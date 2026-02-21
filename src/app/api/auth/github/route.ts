// /app/api/auth/github/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createJWT } from "@/lib/jwt";
import { GithubUser } from "@/types/gh_user";
import { stat } from "fs";

const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URL,
    NODE_ENV,
} = process.env;

const isProduction = NODE_ENV === "production";

function mustGetEnv(name: string, value?: string): string {
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
}

function randomState() {
    return crypto.randomBytes(16).toString("hex");
}

async function exchangeCodeForToken(code: string) {
    const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "nextjs-github-oauth",
        },
        body: JSON.stringify({
            client_id: mustGetEnv("GITHUB_CLIENT_ID", GITHUB_CLIENT_ID),
            client_secret: mustGetEnv("GITHUB_CLIENT_SECRET", GITHUB_CLIENT_SECRET),
            code,
            redirect_uri: mustGetEnv("GITHUB_REDIRECT_URL", GITHUB_REDIRECT_URL),
        }),
    });

    if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);

    const data = await res.json();
    if (data.error) throw new Error(data.error_description || data.error);

    return data.access_token as string;
}

async function fetchGitHubUser(accessToken: string): Promise<GithubUser> {
    const res = await fetch("https://api.github.com/user", {
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "nextjs-github-oauth",
        },
    });

    if (!res.ok) throw new Error(`GitHub /user failed: ${res.status}`);

    return res.json();
}

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "login";

    if (action === "login") {
        // Step 1: Redirect to GitHub
        const state = randomState();
        const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
        authorizeUrl.searchParams.set("client_id", mustGetEnv("GITHUB_CLIENT_ID", GITHUB_CLIENT_ID));
        authorizeUrl.searchParams.set("redirect_uri", mustGetEnv("GITHUB_REDIRECT_URL", GITHUB_REDIRECT_URL));
        authorizeUrl.searchParams.set("scope", "read:user user:email");
        authorizeUrl.searchParams.set("state", state);

        const res = NextResponse.redirect(authorizeUrl.toString());
        res.cookies.set("oauth_state", state, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
            path: "/",
            maxAge: 10 * 60, // 10 minutes
        });

        return res;
    }

    if (action === "callback") {
        // Step 2: GitHub redirected back with ?code & ?state
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const expectedState = req.cookies.get("oauth_state")?.value;

        if (!code || !state || state !== expectedState) {
            return NextResponse.redirect("http://localhost:3000/login?error=state_mismatch");
        }

        console.log(code, state);
        try {
            const accessToken = await exchangeCodeForToken(code);

            const user = await fetchGitHubUser(accessToken);

            // Clear state cookie
            const res = NextResponse.redirect("http://localhost:3000/"); // Or any frontend route

            res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });

            // Create JWT with user data and store in session cookie
            const sessionJWT = createJWT({
                github_id: user.id,
                login: user.login,
                name: user.name,
                email: user.email,
                avatar_url: user.avatar_url,
            });

            res.cookies.set("session", sessionJWT, {
                httpOnly: true,
                sameSite: "lax",
                secure: isProduction,
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            return res;
        } catch (err) {
            console.error("GitHub OAuth callback error:", err);
            return NextResponse.redirect("http://localhost:3000/login?error=oauth_failed");
        }
    }
    return NextResponse.redirect("http://localhost:3000/login?error=invalid_action");
}