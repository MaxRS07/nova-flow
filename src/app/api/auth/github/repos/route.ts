import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const { GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, NODE_ENV } = process.env;

function mustGetEnv(name: string, value?: string): string {
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
}

// 1️⃣ Create GitHub App JWT
function createAppJWT(): string {
    const now = Math.floor(Date.now() / 1000);

    return jwt.sign(
        {
            iat: now - 60,
            exp: now + 600, // 10 min
            iss: mustGetEnv("GITHUB_APP_ID", GITHUB_APP_ID),
        },
        mustGetEnv("GITHUB_APP_PRIVATE_KEY", GITHUB_APP_PRIVATE_KEY).replace(/\\n/g, "\n"),
        { algorithm: "RS256" }
    );
}

// 2️⃣ Exchange installation ID for installation token
async function createInstallationToken(installationId: string) {
    const appJWT = createAppJWT();

    const res = await fetch(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${appJWT}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        }
    );

    if (!res.ok) {
        throw new Error(`Failed to create installation token: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    return data.token as string;
}

type InstallationRepo = {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    owner: { login: string };
};

// 3️⃣ Fetch repositories with pagination support
async function fetchReposPage(
    installationToken: string,
    page: number = 1,
    perPage: number = 20
): Promise<{
    total_count: number;
    repositories: InstallationRepo[];
    page: number;
    per_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
}> {
    const pageUrl = new URL("https://api.github.com/installation/repositories");
    pageUrl.searchParams.set("per_page", String(perPage));
    pageUrl.searchParams.set("page", String(page));

    const res = await fetch(pageUrl.toString(), {
        headers: {
            Authorization: `Bearer ${installationToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch repositories: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as {
        total_count: number;
        repositories: InstallationRepo[];
    };

    // Calculate if there are next/prev pages
    const totalPages = Math.ceil(data.total_count / perPage);
    const has_next_page = page < totalPages;
    const has_prev_page = page > 1;

    return {
        total_count: data.total_count,
        repositories: data.repositories,
        page,
        per_page: perPage,
        has_next_page,
        has_prev_page,
    };
}

export async function GET(req: NextRequest) {
    // Get operation type from query params
    const operation = req.nextUrl.searchParams.get("operation");

    try {
        const installationId = req.cookies.get("github_installation_id")?.value;
        if (!installationId) {
            return NextResponse.json(
                { error: "No installation ID found. Install the GitHub App first." },
                { status: 400 }
            );
        }

        const installationToken = await createInstallationToken(installationId);

        // Route to different handlers based on operation
        if (operation === "content") {
            const owner = req.nextUrl.searchParams.get("owner");
            const repo = req.nextUrl.searchParams.get("repo");
            const path = req.nextUrl.searchParams.get("path") || "";
            const ref = req.nextUrl.searchParams.get("ref") || undefined;

            if (!owner || !repo) {
                return NextResponse.json(
                    { error: "Missing owner or repo parameter" },
                    { status: 400 }
                );
            }

            const content = await fetchRepoContent(installationToken, owner, repo, path, ref);
            return NextResponse.json(content);
        } else if (operation === "yaml-files") {
            const owner = req.nextUrl.searchParams.get("owner");
            const repo = req.nextUrl.searchParams.get("repo");
            const ref = req.nextUrl.searchParams.get("ref") || undefined;

            if (!owner || !repo) {
                return NextResponse.json(
                    { error: "Missing owner or repo parameter" },
                    { status: 400 }
                );
            }

            const result = await findYamlFilesInRepo(installationToken, owner, repo, ref);
            return NextResponse.json(result);
        } else {
            // Default: fetch repositories with pagination
            const page = Number(req.nextUrl.searchParams.get("page")) || 1;
            const perPage = Number(req.nextUrl.searchParams.get("per_page")) || 20;

            const repos = await fetchReposPage(installationToken, page, perPage);
            return NextResponse.json(repos);
        }
    } catch (err) {
        console.error("Failed to process request:", err);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}

type RepoContentResponse =
    | {
        type: "file";
        name: string;
        path: string;
        sha: string;
        size: number;
        encoding: "base64";
        content: string; // base64
        download_url: string | null;
    }
    | {
        type: "dir";
        name: string;
        path: string;
    }[];

async function fetchRepoContent(
    installationToken: string,
    owner: string,
    repo: string,
    path: string,
    ref?: string
) {
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
    if (ref) url.searchParams.set("ref", ref);

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${installationToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch content: ${res.status} ${await res.text()}`);
    }

    return (await res.json()) as RepoContentResponse;
}

function decodeBase64ToUtf8(b64: string) {
    // GitHub may include newlines in the base64
    const normalized = b64.replace(/\n/g, "");
    return Buffer.from(normalized, "base64").toString("utf8");
}

type TreeItem = {
    path: string;
    mode: string;
    type: "blob" | "tree" | "commit";
    sha: string;
    size?: number;
    url: string;
};

async function getDefaultBranch(installationToken: string, owner: string, repo: string) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            Authorization: `Bearer ${installationToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
    if (!res.ok) throw new Error(`Failed to get repo: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.default_branch as string;
}

async function findYamlFilesInRepo(
    installationToken: string,
    owner: string,
    repo: string,
    ref?: string // branch name or commit sha
) {
    const branch = ref ?? (await getDefaultBranch(installationToken, owner, repo));

    // Get the commit SHA for the branch
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
        headers: {
            Authorization: `Bearer ${installationToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
    if (!refRes.ok) throw new Error(`Failed to get ref: ${refRes.status} ${await refRes.text()}`);
    const refData = await refRes.json();
    const commitSha = refData.object.sha as string;

    // Get commit → tree sha
    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${commitSha}`, {
        headers: {
            Authorization: `Bearer ${installationToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
    if (!commitRes.ok) throw new Error(`Failed to get commit: ${commitRes.status} ${await commitRes.text()}`);
    const commitData = await commitRes.json();
    const treeSha = commitData.tree.sha as string;

    // Get full tree (recursive)
    const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`,
        {
            headers: {
                Authorization: `Bearer ${installationToken}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        }
    );
    if (!treeRes.ok) throw new Error(`Failed to get tree: ${treeRes.status} ${await treeRes.text()}`);

    const treeData = (await treeRes.json()) as { tree: TreeItem[]; truncated: boolean };

    const yamlFiles = treeData.tree
        .filter((item) => item.type === "blob")
        .map((item) => item.path)
        .filter((p) => p.endsWith(".yml") || p.endsWith(".yaml"));

    return {
        ref: branch,
        truncated: treeData.truncated,
        yamlFiles,
    };
}