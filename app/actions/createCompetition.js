"use server";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { competition } from "../drizzle/competitionSchema";

/* const competition = pgTable("events", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    ownerId: integer("owner_id")
        .notNull()
        .references(() => users.id), // Reference to users table user.id
    description: text("description"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    targetDistance: integer("target_distance"),
    members: jsonb("members").notNull().default("[]"), // Assuming members is stored as a JSON array
    invites: jsonb("invites").notNull().default("[]"), // Assuming invites is stored as a JSON array
});
 */

export async function createCompetition({ competitionData }) {
    console.log(competitionData);
    try {
        const sql = neon(process.env.DATABASE_URL);
        const db = drizzle(sql, { competition });

        let title = competitionData.title;
        let description = competitionData.description;
        let ownerId = competitionData.ownerId;
        let startDate = competitionData.startDate;
        let endDate = competitionData.endDate;
        let targetDistance = competitionData.targetDistance;

        //Check if all required fields are present
        if (!title || !description || !ownerId || !targetDistance) {
            console.log("title, ownerId, description, and targetDistance are required");
            return new Response("title, ownerId, description, and targetDistance are required", {
                status: 400,
            });
        }

        /* const data = await db
            .insert(users)
            .values({ username: "", password: hashedPassword, email: email }); */

        const data = await db.insert(competition).values({
            title: title,
            description: description,
            ownerId: ownerId,
            targetDistance: targetDistance,
        });

        console.log(data);

        return new Response({ status: 200, data });
    } catch (error) {
        console.log(error);
        throw error;
    }
}
