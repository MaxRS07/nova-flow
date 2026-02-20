import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface JWTPayload {
    github_id: number;
    login: string;
    name: string;
    email: string;
    avatar_url: string;
    [key: string]: any;
}

function base64UrlEncode(str: string): string {
    return Buffer.from(str)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

function base64UrlDecode(str: string): string {
    let padded = str.replace(/-/g, "+").replace(/_/g, "/");
    while (padded.length % 4) padded += "=";
    return Buffer.from(padded, "base64").toString("utf-8");
}

function hmacSign(message: string, secret: string): string {
    return base64UrlEncode(
        crypto
            .createHmac("sha256", secret)
            .update(message)
            .digest()
            .toString("binary")
    );
}

export function createJWT(payload: JWTPayload): string {
    const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = base64UrlEncode(
        JSON.stringify({
            ...payload,
            iat: Math.floor(Date.now() / 1000),
        })
    );

    const signature = hmacSign(`${header}.${body}`, JWT_SECRET);
    return `${header}.${body}.${signature}`;
}

export function verifyJWT(token: string): JWTPayload | null {
    try {
        const [header, body, signature] = token.split(".");

        if (!header || !body || !signature) {
            return null;
        }

        const expectedSignature = hmacSign(`${header}.${body}`, JWT_SECRET);
        if (signature !== expectedSignature) {
            return null;
        }

        const payload = JSON.parse(base64UrlDecode(body));
        return payload as JWTPayload;
    } catch {
        return null;
    }
}
