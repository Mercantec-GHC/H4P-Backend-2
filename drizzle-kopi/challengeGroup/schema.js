import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "../user/schema";
import { relations } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/pg-core";


const challengeGroup = pgTable("challengeGroups", {
    id: serial("id").primaryKey(),
    info: text("info").notNull(),
    title: text("title").notNull(),
});

const usersToChallengeGroups = pgTable("user_to_challenge_groups", {
    userId: serial("user_id")
        .notNull()
        .references(() => users.id),
    challengeGroupId: serial("challenge_group_id")
        .notNull()
        .references(() => challengeGroup.id),    
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.challengeGroupId]}),
    }),
);

const userToChallengeGroupsRelations = relations(usersToChallengeGroups, ({ one }) => ({
    group: one(groups, {
      fields: [usersToChallengeGroups.groupId],
      references: [challengeGroup.id],
    }),
    user: one(users, {
      fields: [usersToChallengeGroups.userId],
      references: [users.id],
    }),
  }));

   const challengeGroupRelations = relations(challengeGroup, ({ many }) => ({
    usersToChallengeGroups: many(usersToChallengeGroups),
  }));


export { challengeGroup, usersToChallengeGroups, userToChallengeGroupsRelations, challengeGroupRelations };


