import { pgTable, serial, text, timestamp, integer, jsonb, foreignKey } from "drizzle-orm/pg-core";
import { users } from "./userSchema"; // Import the users table

const competition = pgTable("competition", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    ownerId: integer("owner_id")
        .notNull()
        .references(() => users.id), // Reference to users table user.id
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    targetDistance: integer("target_distance"),
    members: jsonb("members").notNull().default("[]"), // Assuming members is stored as a JSON array
    invites: jsonb("invites").notNull().default("[]"), // Assuming invites is stored as a JSON array
});

export { competition };
