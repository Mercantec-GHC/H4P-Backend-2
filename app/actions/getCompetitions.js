"use server";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { competition } from "../drizzle/competitionSchema";
import { users } from "../drizzle/userSchema";
import { eq, inArray } from "drizzle-orm/expressions";

export async function getCompetitions({ userId }) {
    try {
        if (!userId) {
            return [];
        }
        console.log("Getting competitions for user", userId);
        const sql = neon(process.env.DATABASE_URL);
        const db = drizzle(sql, { competition });

        // Get all competitions the user owns
        const ownedCompetitions = await db
            .select()
            .from(competition)
            .where(eq(competition.ownerId, userId));

        // Get the user data, including competitions they are a part of
        const member = await db.select().from(users).where(eq(users.id, userId));

        let competitions = ownedCompetitions;

        // Check if user is a member of other competitions
        if (member.length > 0 && member[0].competitions) {
            const memberCompetitionIds = member[0].competitions.map((c) => c.id);

            // Fetch competitions where user is a member
            const memberCompetitions = await db
                .select()
                .from(competition)
                .where(inArray(competition.id, memberCompetitionIds));

            competitions = competitions.concat(memberCompetitions);
        }

        // Deduplicate competitions based on competition.id
        const uniqueCompetitions = Array.from(new Map(competitions.map((c) => [c.id, c])).values());

        return uniqueCompetitions;
    } catch (error) {
        console.log("Error getting competitions", error);
        throw error;
    }
}
