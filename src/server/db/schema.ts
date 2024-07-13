import { integer, pgTable, serial, timestamp, doublePrecision } from 'drizzle-orm/pg-core';

export const sensorTable = pgTable('sensor_table', {
  id: serial('id').primaryKey(),
  suhu: doublePrecision('suhu').notNull(),
  tds: doublePrecision('tds').notNull(),
  ph: doublePrecision('ph').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type InsertSensor = typeof sensorTable.$inferInsert;
export type SelectSensor = typeof sensorTable.$inferSelect;
