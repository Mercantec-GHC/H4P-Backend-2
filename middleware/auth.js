// middleware/auth.js

import { getUserIdFromToken, verifyToken } from "@/utils/jwt";

export function authenticate(req) {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);

    if (!token) {
        console.log("No token provided");
        return new Response(JSON.stringify({ error: "No token provided" }), {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const user = verifyToken(token);

    if (!user) {
        console.log("Invalid token");
        return new Response(JSON.stringify({ error: "Invalid token" }), {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    console.log("User authenticated", user);

    // Attach user info to the request if needed
    req.user = user;

    // Proceed with the request
    return user;
}
