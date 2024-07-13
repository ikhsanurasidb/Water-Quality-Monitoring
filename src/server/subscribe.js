"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const mqtt = __importStar(require("aws-iot-device-sdk"));
const dotenv = __importStar(require("dotenv"));
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const pg_core_1 = require("drizzle-orm/pg-core");
(0, dotenv_1.config)({ path: ".env" });
const client = (0, postgres_1.default)(process.env.DATABASE_URL);
const db = (0, postgres_js_1.drizzle)(client);
const sensorTable = (0, pg_core_1.pgTable)("sensor_table", {
  id: (0, pg_core_1.serial)("id").primaryKey(),
  suhu: (0, pg_core_1.doublePrecision)("suhu").notNull(),
  tds: (0, pg_core_1.doublePrecision)("tds").notNull(),
  ph: (0, pg_core_1.doublePrecision)("ph").notNull(),
  createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
function insertSensorData(data) {
  return __awaiter(this, void 0, void 0, function* () {
    yield db.insert(sensorTable).values(data);
  });
}
// Kode diatas untuk setup drizzle-orm dan membuat schema untuk tabel sensor_table.
dotenv.config({ path: path.join(__dirname, "../../.env") });
const keyPath = path.resolve(process.env.KEY_PATH);
const certPath = path.resolve(process.env.CERT_PATH);
const caPath = path.resolve(process.env.CA_PATH);
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
device.on("message", (topic, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(payload.toString());
    console.log(data);
    const schema = zod_1.z.object({
      suhu: zod_1.z.coerce.number().transform((val) => Math.max(val, 0)),
      tds: zod_1.z.coerce.number().transform((val) => Math.max(val, 0)),
      ph: zod_1.z.coerce.number().transform((val) => Math.max(val, 0)),
    });
    const validatedData = schema.safeParse({
      suhu: data.suhu,
      tds: data.tds,
      ph: data.ph,
    });
    if (!validatedData.success) {
      console.error(validatedData.error);
    }
    const sensor = {
      suhu: validatedData.data.suhu,
      tds: validatedData.data.tds,
      ph: validatedData.data.ph,
    };
    try {
      yield insertSensorData(sensor);
    } catch (error) {
      console.error("Error:", error);
    }
  })
);
device.on("error", (error) => {
  console.error("Error:", error);
});
