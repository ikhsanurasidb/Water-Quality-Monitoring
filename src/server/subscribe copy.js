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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const mqtt = __importStar(require("aws-iot-device-sdk"));
const dotenv = __importStar(require("dotenv"));

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
device.on("message", (topic, payload) => {
  console.log("Message received from topic:", topic);
  console.log("Payload:", payload.toString());
});
device.on("error", (error) => {
  console.error("Error:", error);
});
