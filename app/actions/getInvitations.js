/* "use server";

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
 */

"use server";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { invitations } from "../drizzle/invitationSchema";
import { users } from "../drizzle/userSchema";
import { eq } from "drizzle-orm/expressions";

export async function getInvitations({ userId }) {
    try {
        if (!userId) {
            return [];
        }
        console.log("Getting invitations for user", userId);
        const sql = neon(process.env.DATABASE_URL);
        const db = drizzle(sql, { invitations });

        //Get username of the user
        const user = await db.select().from(users).where(eq(users.id, userId));
        const username = user[0].username;
        console.log("Username", username);

        //Find all invitations for the username
        const results = await db
            .select()
            .from(invitations)
            .where(eq(invitations.username, username));

        console.log(results);

        return { status: 200, data: results };
    } catch (error) {
        console.log("Error getting invitations", error);
        return new Response("Error getting invitations", { status: 500, statusText: error });
    }
}
