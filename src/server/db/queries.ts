import { asc, between, count, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from ".";
import { InsertSensor, sensorTable } from "./schema";

export async function insertSensorData(data: InsertSensor) {
  await db.insert(sensorTable).values(data);
}

export const getSensorForLast24Hours = async (): Promise<
  Array<{
    id: number;
    suhu: number;
    tds: number;
    ph: number;
    createdAt: Date;
  }>
> => {
  try {
    const res = await db
      .select({
        id: sensorTable.id,
        suhu: sensorTable.suhu,
        tds: sensorTable.tds,
        ph: sensorTable.ph,
        createdAt: sensorTable.createdAt,
      })
      .from(sensorTable)
      .where(
        between(
          sensorTable.createdAt,
          sql`now() - interval '1 day'`,
          sql`now()`
        )
      )
      .orderBy(asc(sensorTable.createdAt), asc(sensorTable.id));

    return res;
  } catch (e) {
    console.error(e);

    return [];
  }
};

export const getSensorForLast2Days = async (): Promise<
  Array<{
    id: number;
    suhu: number;
    tds: number;
    ph: number;
    createdAt: Date;
  }>
> => {
  try {
    const res = await db
      .select({
        id: sensorTable.id,
        suhu: sensorTable.suhu,
        tds: sensorTable.tds,
        ph: sensorTable.ph,
        createdAt: sensorTable.createdAt,
      })
      .from(sensorTable)
      .where(
        between(
          sensorTable.createdAt,
          sql`now() - interval '2 day'`,
          sql`now()`
        )
      )
      .orderBy(asc(sensorTable.createdAt), asc(sensorTable.id));

    return res;
  } catch (e) {
    console.error(e);

    return [];
  }
};

export const getSensorForLast3Days = async (): Promise<
  Array<{
    id: number;
    suhu: number;
    tds: number;
    ph: number;
    createdAt: Date;
  }>
> => {
  try {
    const res = await db
      .select({
        id: sensorTable.id,
        suhu: sensorTable.suhu,
        tds: sensorTable.tds,
        ph: sensorTable.ph,
        createdAt: sensorTable.createdAt,
      })
      .from(sensorTable)
      .where(
        between(
          sensorTable.createdAt,
          sql`now() - interval '3 day'`,
          sql`now()`
        )
      )
      .orderBy(asc(sensorTable.createdAt), asc(sensorTable.id));

    return res;
  } catch (e) {
    console.error(e);

    return [];
  }
};

export const getSensorForLast1Week = async (): Promise<
  Array<{
    id: number;
    suhu: number;
    tds: number;
    ph: number;
    createdAt: Date;
  }>
> => {
  try {
    const res = await db
      .select({
        id: sensorTable.id,
        suhu: sensorTable.suhu,
        tds: sensorTable.tds,
        ph: sensorTable.ph,
        createdAt: sensorTable.createdAt,
      })
      .from(sensorTable)
      .where(
        between(
          sensorTable.createdAt,
          sql`now() - interval '1 week'`,
          sql`now()`
        )
      )
      .orderBy(asc(sensorTable.createdAt), asc(sensorTable.id));

    return res;
  } catch (e) {
    console.error(e);

    return [];
  }
};