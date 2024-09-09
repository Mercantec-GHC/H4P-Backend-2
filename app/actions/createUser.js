"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../drizzle/userSchema";
import { eq } from "drizzle-orm/expressions";

export async function createUser({ email, username, password }) {
    console.log("Creating user", email);
    try {
        const sql = neon(process.env.DATABASE_URL);

        const hashedPassword = await bcrypt.hash(password, 10);

        const db = drizzle(sql, { users });

        //Check if email has %40 instead of @
        if (email.includes("%40")) {
            email = email.replace("%40", "@");
        }

        //Make sure it has an email and password
        if (!email || !password) {
            return new Response("Email and password are required", { status: 400 });
        }

        if (password.length < 8) {
            return new Response("Password must be at least 8 characters", { status: 400 });
        }

        //Check format for email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response("Invalid email format", { status: 400 });
        }

        //Check if user exists
        let emailExist = await db.select().from(users).where(eq(users.email, email));

        if (emailExist.length > 0) {
            return new Response("User already exists", { status: 400 });
        }

        //Check if username exists
        let usernameExist = await db.select().from(users).where(eq(users.username, username));

        if (usernameExist.length > 0) {
            return new Response("Username already exists", { status: 400 });
        }

        //Add user
        const data = await db
            .insert(users)
            .values({ username: username, password: hashedPassword, email: email });

        return new Response({ status: 200, data });
    } catch (error) {
        console.log(error);
        //Stop here and return error to the route handler
        throw error;
    }
}
