import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { competition } from "./competitionSchema";

const invitations = pgTable("invitations", {
    id: serial("id").primaryKey(),
    ownerId: serial("owner_id").references(users.id),
    ownerName: text("owner_name").references(users.username),
    username: text("username").references(users.username),
    userId: serial("user_id").references(users.id),
    competitionId: serial("competition_id").references(competition.id),
    competitionTitle: text("competition_title").references(competition.title),
    status: boolean("status").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export { invitations };
