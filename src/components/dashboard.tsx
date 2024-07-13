import {
  getSensorForLast24Hours,
  getSensorForLast2Days,
  getSensorForLast3Days,
} from "@/server/db/queries";
import { Chart } from "@/components/chart";
import { ChartConfig } from "@/components/ui/chart";
import { Button } from "./ui/button";
import Link from "next/link";

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
  let res;
  if (mode === 1) {
    res = await getSensorForLast24Hours();
  } else if (mode === 2) {
    res = await getSensorForLast2Days();
  } else {
    res = await getSensorForLast3Days();
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
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 w-full px-8">
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
