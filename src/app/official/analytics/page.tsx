"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { areaChartData, areaChartConfig, trendsChartData, trendsChartConfig } from "@/lib/data";


export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Waste Management Analytics"
        description="Insights into cleanup operations and reporting trends."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Litter Reports by Area</CardTitle>
            <CardDescription>Comparison of reported vs. cleaned litter across key areas.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={areaChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="area"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                 <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="reports" fill="var(--color-reports)" radius={4} />
                <Bar dataKey="cleaned" fill="var(--color-cleaned)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Tracking total and hazardous reports over the past six months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendsChartConfig} className="h-[300px] w-full">
              <LineChart
                accessibilityLayer
                data={trendsChartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                 <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                 <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="reports"
                  type="monotone"
                  stroke="var(--color-reports)"
                  strokeWidth={2}
                  dot={true}
                />
                <Line
                  dataKey="hazardous"
                  type="monotone"
                  stroke="var(--color-hazardous)"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
