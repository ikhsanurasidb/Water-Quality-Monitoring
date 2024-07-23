import {
  getSensorForLast1Week,
  getSensorForLast24Hours,
  getSensorForLast2Days,
  getSensorForLast3Days,
} from "@/server/db/queries";
import { Chart } from "@/components/chart";
import { ChartConfig } from "@/components/ui/chart";
import { Button } from "./ui/button";
import Link from "next/link";
import * as path from "path";
import * as mqtt from "aws-iot-device-sdk";
import { config } from "dotenv";

config({ path: path.join(__dirname, "../../.env") });

export type SensorData = {
  suhu: number;
  tds: number;
  ph: number;
  createdAt: string;
};

export type ChartProps = {
  data: SensorData[];
  config: ConfigProps;
  chartKey: string;
  dataKey: string;
  chartTitle: string;
};

export type ConfigProps = {
  data: {
    label: string;
    color: string;
  };
};

const chartConfigSuhu = {
  data: {
    label: "Suhu",
    color: "#f08513",
  },
} satisfies ChartConfig;

const chartConfigTds = {
  data: {
    label: "TDS",
    color: "#076cf0",
  },
} satisfies ChartConfig;

const chartConfigPh = {
  data: {
    label: "PH",
    color: "#0bd64f",
  },
} satisfies ChartConfig;

export default async function Dashboard({ mode }: { mode: number }) {
  let isDeviceOn = false;

  const keyPath = path.resolve(process.env.KEY_PATH!);
  const certPath = path.resolve(process.env.CERT_PATH!);
  const caPath = path.resolve(process.env.CA_PATH!);
  const endpoint = process.env.AWS_IOT_ENDPOINT;

  console.log(keyPath, certPath, caPath, endpoint)

  const device = new mqtt.device({
    keyPath: keyPath,
    certPath: certPath,
    caPath: caPath,
    clientId: "mqtt-client",
    host: endpoint,
  });

  device.on("connect", () => {
    console.log("Connected to AWS IoT");
    device.subscribe("esp32/device_status");
  });

  device.on("message", async (topic, payload: SensorData) => {
    const status = JSON.parse(payload.toString());
    console.log("Device status:", status);

    if (status === "ON") {
      isDeviceOn = true;
    } else {
      isDeviceOn = false;
    }
  });

  device.on("error", (error) => {
    console.error("Error:", error);
  });

  let res;
  if (mode === 1) {
    res = await getSensorForLast24Hours();
  } else if (mode === 2) {
    res = await getSensorForLast2Days();
  } else if (mode === 3) {
    res = await getSensorForLast3Days();
  } else {
    res = await getSensorForLast1Week();
  }

  const sensor: SensorData[] = res.map((r) => {
    const date = r.createdAt;
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      day: "numeric",
      month: "short",
      timeZone: "Asia/Jakarta",
    });

    return {
      suhu: r.suhu,
      tds: r.tds,
      ph: r.ph,
      createdAt: timeString,
    };
  });
  return (
    <>
      <div className="flex gap-2 items-center justify-center">
        <Button>
          <Link href={"/dashboard/24hours"}>24 Hours</Link>
        </Button>
        <Button>
          <Link href={"/dashboard/2days"}>2 Days</Link>
        </Button>
        <Button>
          <Link href={"/dashboard/3days"}>3 Days</Link>
        </Button>
        <Button>
          <Link href={"/dashboard/1week"}>1 Week</Link>
        </Button>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <p>Device Status: {isDeviceOn ? "ON" : "OFF"}</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 w-full px-1 lg:px-8">
        <Chart
          data={sensor}
          config={chartConfigSuhu}
          dataKey="suhu"
          chartKey="createdAt"
          chartTitle="Suhu"
        />
        <Chart
          data={sensor}
          config={chartConfigTds}
          chartKey="createdAt"
          dataKey="tds"
          chartTitle="TDS"
        />
        <Chart
          data={sensor}
          config={chartConfigPh}
          chartKey="createdAt"
          dataKey="ph"
          chartTitle="pH"
        />
      </div>
    </>
  );
}
