"use server";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { invitations } from "../drizzle/invitationSchema";
import { users } from "../drizzle/userSchema";
import { competition } from "../drizzle/competitionSchema";
import { eq, and } from "drizzle-orm/expressions";

export async function acceptInvite({ userId, invitationId }) {
    console.log("Accepting invitation", userId, invitationId);
    try {
        const sql = neon(process.env.DATABASE_URL);

        const db = drizzle(sql, { invitations, users, competition });

        //Make sure it has an email and password
        if (!userId || !invitationId) {
            return new Response("User Id and invitation Id are required", {
                status: 400,
                statusText: "User Id and invitation Id are required",
            });
        }

        //Get the invitation data
        let invitationData = await db
            .select()
            .from(invitations)
            .where(eq(invitations.id, invitationId));

        console.log("Invitation data");

        if (invitationData.length === 0) {
            console.log("Invitation does not exist");
            return new Response("Invitation does not exist", {
                status: 400,
                statusText: "Invitation does not exist",
            });
        }

        //Check if userId matches the invitation userId if not return error because only the user can accept
        if (userId !== invitationData[0].userId) {
            console.log("Only the user can accept the invitation");
            return new Response("Only the user can accept the invitation", {
                status: 400,
                statusText: "Only the user can accept the invitation",
            });
        }

        //Get the competition data
        let competitionData = await db
            .select()
            .from(competition)
            .where(eq(competition.id, invitationData[0].competitionId));

        if (competitionData.length === 0) {
            console.log("Competition does not exist");
            return new Response("Competition does not exist", {
                status: 400,
                statusText: "Competition does not exist",
            });
        }

        console.log("Competition data");

        //Check if the user is already a member of the competition
        let user = await db.select().from(users).where(eq(users.id, userId));

        if (user.length === 0) {
            console.log("User does not exist");
            return new Response("User does not exist", {
                status: 400,
                statusText: "User does not exist",
            });
        }

        console.log("User data");

        //Get the members of the competition by getting the competition
        let members = competitionData[0].members;

        //Check if user is already a member of the competition
        let memberExist = members.filter((member) => member.id === userId);

        console.log("Member data");
        //Add user to the competition
        if (memberExist.length === 0) {
            members.push({ id: user[0].id, username: user[0].username });
        }

        console.log("Members", members);

        //Update the competition with the new members
        let res = await db
            .update(competition)
            .set({ members })
            .where(eq(competition.id, invitationData[0].competitionId));

        //Add the competitionId to the user.competitions
        let userCompetitions = user[0].competitions;
        //Log the type of userCompetitions
        //Convert the userCompetitions to an array if it is not an array
        userCompetitions.push({ id: competitionData[0].id, title: competitionData[0].title });

        //Update the user with the new competition
        await db.update(users).set({ competitions: userCompetitions }).where(eq(users.id, userId));

        //Delete the invitation
        await db.delete(invitations).where(eq(invitations.id, invitationId));

        console.log("Successfully accepted invitation");
        return new Response({ status: 200, data: res, statusText: "Invitation accepted" });
    } catch (error) {
        console.log(error);
        return new Response("Error accepting invitation", { status: 500, statusText: error });
    }
}
