import * as path from "path";
import * as mqtt from "aws-iot-device-sdk";
import { config } from "dotenv";
import { DeviceStatus } from "@/components/device-status";
import { unstable_noStore as noStore } from "next/cache";

config({ path: path.join(__dirname, "../../.env") });

export async function getDeviceStatus(): Promise<DeviceStatus | undefined> {
  noStore();

  const keyPath = path.resolve(process.env.KEY_PATH!);
  const certPath = path.resolve(process.env.CERT_PATH!);
  const caPath = path.resolve(process.env.CA_PATH!);
  const endpoint = process.env.AWS_IOT_ENDPOINT;

  console.log(keyPath, certPath, caPath, endpoint);

  return new Promise((resolve, reject) => {
    const device = new mqtt.device({
      keyPath: keyPath,
      certPath: certPath,
      caPath: caPath,
      clientId: "mqtt-client-device-status-monitor-10",
      host: endpoint,
    });

    device.on("connect", () => {
      console.log("Connected to AWS IoT");
      device.subscribe("esp32/device_status", { qos: 1 }, (error, granted) => {
        if (error) {
          console.error("Subscription error:", error);
          reject(error);
        } else {
          console.log("Subscription granted:", granted);
        }
      });
    });

    device.on("message", (topic, payload) => {
      let data: DeviceStatus;
      try {
        data = JSON.parse(payload.toString());
      } catch (error) {
        console.error("Error parsing JSON:", error);
        reject(error);
        return;
      }
      
      console.log("Device status:", data);

      const deviceStatus: DeviceStatus = {
        status: data.status || 'Unknown',
        wifi_status: data.wifi_status || 'Unknown',
        aws_status: data.aws_status || 'Unknown',
      };

      resolve(deviceStatus);
    });

    device.on("error", (error) => {
      console.error("MQTT error:", error);
      reject(error);
    });
  });
}
