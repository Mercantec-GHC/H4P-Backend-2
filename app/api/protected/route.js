import { authenticate } from "@/middleware/auth";

export async function POST(req) {
    const user = authenticate(req);

    if (!user) {
        return new Response(JSON.stringify({ error: "Authentication failed" }), {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // If authentication is successful, proceed with the protected logic
    return new Response(JSON.stringify({ message: "You are authenticated" }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
