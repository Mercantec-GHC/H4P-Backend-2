import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./userSchema"; // Import the users table

const competitions = pgTable("competitions", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    owner: integer("ownerId")
        .notNull()
        .references(() => users.id), // Correct way to set a foreign key
    members: text("members").notNull(),
    description: text("description").notNull(),
    created: timestamp("created").notNull(),
    target: text("target").notNull(),
});

export { competitions };
