"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../drizzle/userSchema";

export async function createUser({ email, password }) {
    try {
        const sql = neon(process.env.DATABASE_URL);

        const hashedPassword = await bcrypt.hash(password, 10);

        const db = drizzle(sql, { users });

        //Make sure it has an email and password
        if (!email || !password) {
            return { status: 400, error: "Missing email or password" };
        }

        //Make sure there is a email table if not then create one
        await db.createTable(users).ifNotExists().run();

        //Check if user exists
        const user = await db.select(users).where({ email: email }).run();

        if (user.length > 0) {
            return { status: 400, error: "User already exists" };
        }

        //Add user
        const data = await db.insert(users).values({ email: email, password: hashedPassword });

        return { status: 200, data };
    } catch (error) {
        console.log(error);
        return { error };
    }
}
