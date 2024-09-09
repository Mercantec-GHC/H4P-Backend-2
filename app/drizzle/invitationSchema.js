import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { competition } from "./competitionSchema";

const invitations = pgTable("invitations", {
    id: serial("id").primaryKey(),
    ownerId: serial("ownerId").references(users.id),
    username: text("username").references(users.username),
    competitionId: serial("competitionId").references(competition.id),
    status: boolean("status").notNull(),
    createdAt: timestamp("createdAt").notNull(),
});

export { invitations };
