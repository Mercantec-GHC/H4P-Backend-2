"use server";

/* invitationSchema */

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/neon-http";
import { invitations } from "../drizzle/invitationSchema";
import { users } from "../drizzle/userSchema";
import { competition } from "../drizzle/competitionSchema";
import { eq, and } from "drizzle-orm/expressions";

export async function createInvitation({ ownerId, username, competitionId }) {
    console.log("Creating invitation", ownerId, username, competitionId);
    try {
        const sql = neon(process.env.DATABASE_URL);

        const db = drizzle(sql, { invitations });

        //Make sure it has an email and password
        if (!ownerId || !username || !competitionId) {
            return new Response("Owner Id, username, and competition Id are required", {
                status: 400,
                statusText: "Owner Id, username, and competition Id are required",
            });
        }

        //Get the competition data

        let competitionData = await db
            .select()
            .from(competition)
            .where(eq(competition.id, competitionId));

        if (competitionData.length === 0) {
            console.log("Competition does not exist");
            return new Response("Competition does not exist", {
                status: 400,
                statusText: "Competition does not exist",
            });
        }

        //Check if ownerId matches the competition ownerId if not return error because only the owner can invite
        if (ownerId !== competitionData[0].ownerId) {
            console.log("Only the competition owner can invite");
            return new Response("Only the competition owner can invite", {
                status: 400,
                statusText: "Only the competition owner can invite",
            });
        }

        //Get the username of the user inviting from the ownerId
        let owner = await db.select().from(users).where(eq(users.id, ownerId));

        if (owner.length === 0) {
            console.log("Owner does not exist");
            return new Response("Owner does not exist", {
                status: 400,
                statusText: "Owner does not exist",
            });
        }

        //Owner cannot invite themselves

        //Check if username exists
        let userNameExist = await db.select().from(users).where(eq(users.username, username));

        if (userNameExist.length === 0) {
            console.log("User does not exist");
            return new Response("User does not exist", {
                status: 400,
                statusText: "User does not exist",
            });
        }

        //If userNameExist.id is same as ownerId, return error
        if (userNameExist[0].id === ownerId) {
            console.log("You cannot invite yourself");
            return new Response("You cannot invite yourself", {
                status: 400,
                statusText: "You cannot invite yourself",
            });
        }

        //Check if user is already invited
        let userInvited = await db
            .select()
            .from(invitations)
            .where(
                and(
                    eq(invitations.username, username),
                    eq(invitations.competitionId, competitionId)
                )
            );

        if (userInvited.length > 0) {
            console.log("User already invited", userInvited);
            return new Response("User already invited", {
                status: 400,
                statusText: "User already invited",
            });
        }

        /* const invitations = pgTable("invitations", {
    id: serial("id").primaryKey(),
    ownerId: serial("owner_id").references(users.id),
    ownerName: text("owner_name").references(users.username),
    username: text("username").references(users.username),
    competitionId: serial("competition_id").references(competition.id),
    competitionTitle: text("competition_title").references(competition.title),
    status: boolean("status").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}); */

        //Create new invitation
        const newInvitation = await db.insert(invitations).values({
            ownerId,
            username,
            userId: userNameExist[0].id,
            ownerName: owner[0].username,
            competitionId,
            competitionTitle: competitionData[0].title,
            status: false,
            createdAt: new Date(),
        });

        if (!newInvitation) {
            return new Response("Error creating invitation", {
                status: 500,
                statusText: "Error creating invitation",
            });
        }

        console.log("Invitation created", newInvitation);

        return new Response("Invitation created", {
            status: 200,
            statusText: "Invitation created",
        });
    } catch (error) {
        /* console.log(error); */
        //Stop here and return error to the route handler
        throw error;
    }
}
