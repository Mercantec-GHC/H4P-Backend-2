"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm/expressions";
import { users } from "../drizzle/userSchema";
import { generateToken } from "@/utils/jwt";

export async function loginUser({ email, password }) {
    console.log("Logging in user");
    email = email.toLowerCase();
    try {
        const sql = neon(process.env.DATABASE_URL);
        const db = drizzle(sql, { users });

        // Check if email has %40 instead of @
        if (email.includes("%40")) {
            email = email.replace("%40", "@");
        }

        // Fetch user by username
        let user = await db.select().from(users).where(eq(users.email, email));

        if (!user) {
            return { status: 401, error: "Invalid credentials" };
        } else {
            console.log(user);
            user = user[0];
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { status: 401, error: "Invalid credentials" };
        } else {
            console.log("Password is valid");
        }

        // Generate JWT
        const token = generateToken({ id: user.id, email: user.email });

        return { status: 200, token };
    } catch (error) {
        console.log(error);
        return { error };
    }
}
