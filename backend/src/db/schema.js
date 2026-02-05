const { pgTable, uuid, varchar, text, boolean, integer, timestamp, jsonb } = require('drizzle-orm/pg-core');

// Admins table
const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Members table
const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  dob: varchar('dob', { length: 50 }),
  age: integer('age'),
  gender: varchar('gender', { length: 20 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  baptized: boolean('baptized'),
  waterBaptized: boolean('water_baptized'),
  holyGhostBaptized: boolean('holy_ghost_baptized'),
  presidingElder: varchar('presiding_elder', { length: 100 }),
  working: boolean('working'),
  occupation: varchar('occupation', { length: 100 }),
  maritalStatus: varchar('marital_status', { length: 50 }),
  childrenCount: integer('children_count'),
  ministry: varchar('ministry', { length: 100 }),
  joinedDate: varchar('joined_date', { length: 50 }),
  picture: text('picture'),
  metadata: jsonb('metadata'), // For dynamic fields
  syncStatus: varchar('sync_status', { length: 20 }).default('synced'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Form schema table
const formSchema = pgTable('form_schema', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: integer('version').notNull().default(1),
  elements: jsonb('elements').notNull(), // JSON array of form field definitions
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

module.exports = { admins, members, formSchema };
