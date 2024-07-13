import * as path from "path";
import * as mqtt from "aws-iot-device-sdk";
import * as dotenv from "dotenv";
import { z } from "zod";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  pgTable,
  serial,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const sensorTable = pgTable("sensor_table", {
  id: serial("id").primaryKey(),
  suhu: doublePrecision("suhu").notNull(),
  tds: doublePrecision("tds").notNull(),
  ph: doublePrecision("ph").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

type InsertSensor = typeof sensorTable.$inferInsert;
type SelectSensor = typeof sensorTable.$inferSelect;

async function insertSensorData(data: InsertSensor) {
  await db.insert(sensorTable).values(data);
}

type SensorData = {
  suhu: number;
  tds: number;
  ph: number;
};

// Kode diatas untuk setup drizzle-orm dan membuat schema untuk tabel sensor_table.

dotenv.config({ path: path.join(__dirname, "../../.env") });

const keyPath = path.resolve(process.env.KEY_PATH!);
const certPath = path.resolve(process.env.CERT_PATH!);
const caPath = path.resolve(process.env.CA_PATH!);
const endpoint = process.env.AWS_IOT_ENDPOINT;

const device = new mqtt.device({
  keyPath: keyPath,
  certPath: certPath,
  caPath: caPath,
  clientId: "mqtt-client",
  host: endpoint,
});

device.on("connect", () => {
  console.log("Connected to AWS IoT");
  device.subscribe("esp32/pub");
});

device.on("message", async (topic, payload: SensorData) => {
  const data = JSON.parse(payload.toString());
  console.log(data);
  console.log(typeof data);

  const schema = z.object({
    suhu: z.coerce.number().transform((val) => Math.max(val, 0)),
    tds: z.coerce.number().transform((val) => Math.max(val, 0)),
    ph: z.coerce.number().transform((val) => Math.max(val, 0)),
  });

  const validatedData = schema.safeParse({
    suhu: data.suhu,
    tds: data.tds,
    ph: data.ph,
  });

  if (validatedData.success) {
    console.error(validatedData.error);
  }

  const sensor: InsertSensor = {
    suhu: validatedData.data!.suhu,
    tds: validatedData.data!.tds,
    ph: validatedData.data!.ph,
  };

  try {
    await insertSensorData(sensor);
  } catch (error) {
    console.error("Error:", error);
  }
});

device.on("error", (error) => {
  console.error("Error:", error);
});
