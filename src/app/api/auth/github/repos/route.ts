// /app/api/github/repos/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const {
    GITHUB_APP_ID,
    GITHUB_APP_PRIVATE_KEY,
    NODE_ENV,
} = process.env;

function mustGetEnv(name: string, value?: string): string {
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
}

function createAppJWT(): string {
    const now = Math.floor(Date.now() / 1000);

    return jwt.sign(
        {
            iat: now - 60,
            exp: now + 600,
            iss: mustGetEnv("GITHUB_APP_ID", GITHUB_APP_ID),
        },
        mustGetEnv("GITHUB_APP_PRIVATE_KEY", GITHUB_APP_PRIVATE_KEY).replace(/\\n/g, "\n"),
        { algorithm: "RS256" }
    );
}

// 2️⃣ Get installation ID for the authenticated user
async function getInstallationId(appJWT: string) {
    const res = await fetch("https://api.github.com/user/installations", {
        headers: {
            Authorization: `Bearer ${appJWT}`,
            Accept: "application/vnd.github+json",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch installations: ${res.status}`);
    }

    const data = await res.json();

    if (!data.installations?.length) {
        throw new Error("No installations found for user");
    }

    return data.installations[0].id;
}

// 3️⃣ Exchange for installation access token
async function createInstallationToken(appJWT: string, installationId: number) {
    const res = await fetch(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${appJWT}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    if (!res.ok) {
        throw new Error(`Failed to create installation token: ${res.status}`);
    }

    const data = await res.json();
    return data.token as string;
}

// 4️⃣ Fetch repos
async function fetchRepos(installationToken: string) {
    const res = await fetch("https://api.github.com/installation/repositories", {
        headers: {
            Authorization: `Bearer ${installationToken}`,
            Accept: "application/vnd.github+json",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch repos: ${res.status}`);
    }

    return res.json();
}

export async function GET(req: NextRequest) {
    try {
        const appJWT = createAppJWT();
        const installationId = await getInstallationId(appJWT);
        const installationToken = await createInstallationToken(appJWT, installationId);
        const repos = await fetchRepos(installationToken);

        return NextResponse.json(repos);
    } catch (err) {
        console.error("Repo fetch error:", err);
        return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
    }
}