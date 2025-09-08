"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

export function ChartAreaInteractive({
  recapData,
}: {
  recapData: { perday: any[]; permonth: any[]; peryear: any[] }
}) {
  const [timeRange, setTimeRange] = React.useState("perday")

  // Pilih data sesuai timeRange
  const chartData =
    timeRange === "perday"
      ? recapData.perday.map((item) => ({
          date: item.perday,
          total: item.total,
        }))
      : timeRange === "permonth"
      ? recapData.permonth.map((item) => ({
          date: item.permonth,
          total: item.total,
        }))
      : recapData.peryear.map((item) => ({
          date: item.peryear,
          total: item.total,
        }))

  return (
    <Card className="pt-0 m-2 mt-5">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing recap data antrian pasien
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Per Hari" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="perday" className="rounded-lg">
              Per Hari
            </SelectItem>
            <SelectItem value="permonth" className="rounded-lg">
              Per Bulan
            </SelectItem>
            <SelectItem value="peryear" className="rounded-lg">
              Per Tahun
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{ total: { label: "Total", color: "var(--chart-1)" } }}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total"
              type="natural"
              fill="var(--chart-1)"
              stroke="var(--chart-1)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
