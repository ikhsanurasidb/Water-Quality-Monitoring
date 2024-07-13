"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartProps } from "./dashboard";

export function Chart(props: ChartProps) {
  const color = "var(--color-data)";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.chartTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={props.config}>
          <LineChart
            accessibilityLayer
            data={props.data}
            margin={{
              top: 20,
              left: 10,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey={props.chartKey}
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 16)}
            />
            <YAxis
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              domain={[0, "auto"]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey={props.dataKey}
              type="natural"
              stroke={color}
              strokeWidth={2}
              dot={{
                fill: color,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
