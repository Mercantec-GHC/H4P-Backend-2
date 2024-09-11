import { pgTable, serial, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    password: text("password").notNull(),
    email: text("email").notNull(),
    competitions: jsonb("competitions").notNull().default("[]"), // Assuming competitions is stored as a JSON array
});

export { users };
