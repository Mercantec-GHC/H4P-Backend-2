import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("email").notNull(),
    password: text("password").notNull(),
});

export { users };
