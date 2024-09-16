"use server";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { competition } from "../drizzle/competitionSchema";
import { and, eq } from "drizzle-orm/expressions";
import { getCompetitions } from "./getCompetitions";
import { users } from "../drizzle/userSchema";

//competition has a members field that is a JSON array. In this we add the progress of the user to the competition. When we update progress we add it to all competitions the user is a member of. Progress is a number that represents the distance the user has covered in the competition. So we add it to the already existing progress in the competition. If the user has not covered any distance yet we set the progress to the new progress.

export async function updateProgress({ userId, progress }) {
    console.log("Updating progress", userId, progress);
    try {
        const sql = neon(process.env.DATABASE_URL);

        const db = drizzle(sql, { competition });

        //Make sure it has an email and password
        if (!userId || !progress) {
            return new Response("User Id and progress are required", {
                status: 400,
                statusText: "User Id and progress are required",
            });
        }

        let competitions = await getCompetitions({ userId: userId });

        if (competitions.length === 0) {
            return new Response("No competitions found", {
                status: 404,
                statusText: "No competitions found",
            });
        }

        console.log("Competitions", competitions);

        //Add the progress to each competition

        for (const comp of competitions) {
            // Get the competition data
            const competitionData = await db
                .select()
                .from(competition)
                .where(eq(competition.id, comp.id));

            //In the competition data we have the members field which is a JSON array. We add the progress to the user in the members field by finding the user by id and adding the progress to the existing progress. If the user is not found in the members field we add the user to the members field with the progress.
            let members = competitionData[0].members;

            let memberIndex = members.findIndex((m) => m.id === userId);

            progress = Number(progress);

            if (memberIndex === -1) {
                console.log("Member not found", userId);
                //Find the user by ownerId of the competition
                const userData = await db.select().from(users).where(eq(users.id, userId));
                if (userData.length === 0) {
                    return new Response("User not found", {
                        status: 404,
                        statusText: "User not found",
                    });
                }

                members.push({ id: userId, progress, username: userData[0].username });
            } else {
                console.log("Member found", userId);
                //If members.progress is null then set it to progress
                if (!members[memberIndex].progress) {
                    console.log("Progress is null", members[memberIndex].progress);
                    members[memberIndex].progress = Number(progress);
                }

                if (members[memberIndex].progress) {
                    console.log("Progress is not null", members[memberIndex].progress);
                    //Reset the progress to 0
                    //Convert members.progress to a number
                    members[memberIndex].progress = Number(members[memberIndex].progress);
                    members[memberIndex].progress += Number(progress);
                } else {
                    console.log("Progress is null", members[memberIndex].progress);
                    members[memberIndex].progress = Number(members[memberIndex].progress);
                    members[memberIndex].progress = Number(progress);
                }
            }

            //Update the competition with the new members field
            await db.update(competition).set({ members }).where(eq(competition.id, comp.id));
        }

        return new Response("Progress updated successfully", {
            status: 200,
            statusText: "Progress updated successfully",
        });
    } catch (error) {
        console.log("Error updating progress", error);
        return new Response("Error updating progress", {
            status: 500,
            statusText: "Error updating progress",
        });
    }
}
