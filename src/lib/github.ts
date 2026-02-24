import { Repository } from "@/types/gh_user";

export async function fetchUserRepos(): Promise<Repository[]> {
    try {
        const url = new URL("/api/auth/github/repos", window.location.origin);
        url.searchParams.append("per_page", "100");
        url.searchParams.append("page", "1");

        const res = await fetch(url.toString(), {
            method: "GET",
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch user repos: ${res.status}`);
        }
        const data = await res.json();
        return data.repositories as Repository[];
    } catch (err) {
        console.error("Error fetching user repositories:", err);
        return [];
    }
}
/**
 * Get repository tree or YAML files from a repository
 * @param owner 
 * @param repo 
 * @param ref 
 * @param operation 'yaml-files'
 * @returns 
 */
export async function fetchRepoYAML(owner: string, repo: string, ref?: string) {
    try {
        const url = new URL("/api/auth/github/repos", window.location.origin);
        url.searchParams.append("operation", 'yaml-files');
        url.searchParams.append("owner", owner);
        url.searchParams.append("repo", repo);
        if (ref) url.searchParams.append("ref", ref);

        const res = await fetch(url.toString(), {
            method: "GET",
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch repo tree: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching repo tree:", err);
        return null;
    }
}

export async function fetchRepoContent(owner: string, repo: string, path: string, ref?: string) {
    try {
        const url = new URL("/api/auth/github/repos", window.location.origin);
        url.searchParams.append("operation", "content");
        url.searchParams.append("owner", owner);
        url.searchParams.append("repo", repo);
        url.searchParams.append("path", path);
        if (ref) url.searchParams.append("ref", ref);

        const res = await fetch(url.toString(), {
            method: "GET",
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch repo content: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching repo content:", err);
        return null;
    }
}