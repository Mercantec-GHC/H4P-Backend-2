import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

const todos = pgTable("todos", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
});

export { todos };
