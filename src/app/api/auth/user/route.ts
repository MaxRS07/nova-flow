import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: NextRequest) {
    try {
        const sessionCookie = req.cookies.get("session")?.value;

        if (!sessionCookie) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Try to decode JWT
        const user = verifyJWT(sessionCookie);

        if (!user) {
            return NextResponse.json(
                { error: "Invalid session" },
                { status: 401 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
