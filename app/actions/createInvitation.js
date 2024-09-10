"use server";

/* invitationSchema */

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/neon-http";
import { invitations } from "../drizzle/invitationSchema";
import { users } from "../drizzle/userSchema";
import { eq } from "drizzle-orm/expressions";

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
        /* if (userNameExist[0].id === ownerId) {
            console.log("You cannot invite yourself");
            return new Response("You cannot invite yourself", {
                status: 400,
                statusText: "You cannot invite yourself",
            });
        } */

        //Check if user is already invited
        let userInvited = await db
            .select()
            .from(invitations)
            .where(eq(invitations.username, username, invitations.competitionId, competitionId));

        if (userInvited.length > 0) {
            console.log("User already invited", userInvited);
            return new Response("User already invited", {
                status: 400,
                statusText: "User already invited",
            });
        }

        //Create new invitation
        const newInvitation = await db.insert(invitations).values({
            ownerId,
            username,
            competitionId,
            status: false,
            createdAt: new Date(),
        });

        if (!newInvitation) {
            return new Response("Error creating invitation", {
                status: 500,
                statusText: "Error creating invitation",
            });
        }

        console.log("Invitation created");

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
