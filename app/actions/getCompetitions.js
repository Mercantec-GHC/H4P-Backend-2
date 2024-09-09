"use server";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { competition } from "../drizzle/competitionSchema";
import { eq } from "drizzle-orm/expressions";

export async function getCompetitions({ userId }) {
    try {
        if (!userId) {
            return [];
        }
        console.log("Getting competitions for user", userId);
        const sql = neon(process.env.DATABASE_URL);
        const db = drizzle(sql, { competition });
        //Get all competitions from the database
        //userId should either be ownerId or be found in members ar
        const results = await db.select().from(competition).where(eq(competition.ownerId, userId));

        console.log(results);

        return results;
    } catch (error) {
        console.log("Error getting competitions", error);
        throw error;
    }
}
