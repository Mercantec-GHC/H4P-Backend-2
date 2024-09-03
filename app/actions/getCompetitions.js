"use server";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { competition } from "../drizzle/competitionSchema";

/* "use server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../drizzle/userSchema";
import { revalidatePath } from "next/cache";

export async function getData() {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { users });
    //Get all users from the database
    const result = await db.select().from(users);

    console.log(result);

    revalidatePath("/");
    return result;
}
 */

export async function getCompetitions() {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { competition });
    //Get all competitions from the database
    const results = await db.select().from(competition);

    console.log(results);

    return results;
}
