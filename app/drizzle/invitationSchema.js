import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { competition } from "./competitionSchema";

const invitations = pgTable("invitations", {
    id: serial("id").primaryKey(),
    ownerId: serial("owner_id").references(users.id),
    username: text("username").references(users.username),
    competitionId: serial("competition_id").references(competition.id),
    status: boolean("status").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export { invitations };
