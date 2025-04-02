"use client";


import React, { useState } from "react";
import { Users, DollarSign, Activity, FileText, ArrowUpRight, Layers } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { ChartContainer } from "@/components/ChartContainer";
import { DataTable } from "@/components/DataTable";
import { useMetrics, useChartData, useTableData, TableItem, useProgramsAndRounds, extractRoundsAndPrograms, useAggregates, useDonations } from "@/hooks/useGraphQLData";
import { SimpleTable } from "@/components/SimpleTable";

const Dashboard = () => {
  const [period, setPeriod] = useState("30d");
  const [dataType, setDataType] = useState("all");
  const [page, setPage] = useState(1);


  const [selectedProgramId, setSelectedProgramId] = useState("all");


  const { data: metricsData, isLoading: isLoadingMetrics } = useMetrics(period);
  const { data: chartData, isLoading: isLoadingChart } = useChartData(dataType, period);
  const { data: tableData, isLoading: isLoadingTable } = useTableData(dataType, 10, page);

  const { data: programsAndRounds, isLoading: isLoadingPandR } = useProgramsAndRounds();
  const { uniquePrograms, rounds } = extractRoundsAndPrograms(programsAndRounds);

  const { data: aggregatesData, isLoading: isLoadingAggregates } = useAggregates(rounds.filter((round) => round.projectId === selectedProgramId)?.map((round) => round.id));
  const { data: donationsData, isLoading: isLoadingDonations} = useDonations(rounds.filter((round) => round.projectId === selectedProgramId)?.map((round) => round.id));


  

  // Sample chart data for development
  const sampleAreaData = [
    { name: "Jan", users: 4000, revenue: 2400 },
    { name: "Feb", users: 3000, revenue: 1398 },
    { name: "Mar", users: 2000, revenue: 9800 },
    { name: "Apr", users: 2780, revenue: 3908 },
    { name: "May", users: 1890, revenue: 4800 },
    { name: "Jun", users: 2390, revenue: 3800 },
    { name: "Jul", users: 3490, revenue: 4300 },
  ];

  const pieData = [
    { name: "Chrome", value: 60 },
    { name: "Safari", value: 20 },
    { name: "Firefox", value: 10 },
    { name: "Edge", value: 7 },
    { name: "Others", value: 3 },
  ];

  const columns = [
    {
      key: "id",
      title: "ID",
      width: "15%",
    },
    {
      key: "name",
      title: "Name",
      width: "20%",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "email",
      title: "Email",
      width: "25%",
    },
    {
      key: "status",
      title: "Status",
      width: "15%",
      render: (value: string) => (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value === "active"
          ? "bg-green-100 text-green-800"
          : value === "inactive"
            ? "bg-gray-100 text-gray-800"
            : "bg-yellow-100 text-yellow-800"
          }`}>
          {value}
        </div>
      ),
    },
    {
      key: "date",
      title: "Date",
      width: "15%",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "value",
      title: "Value",
      width: "10%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DashboardHeader
          title="Analytics Dashboard"
          subtitle="Monitor your key metrics and performance indicators"
          dataType={dataType}
          // onDataTypeChange={setDataType}
          programs={uniquePrograms}
          onProgramChange={setSelectedProgramId}
          selectedProgram={selectedProgramId}
        // rounds={rounds}
        />
   

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Match Amount in USD"
            value={aggregatesData?.roundsAggregate.aggregate.sum.matchAmount ?? "--"}
            icon={DollarSign}
            iconColor="text-blue-500"
            delay={0.1}
          />
          <MetricCard
            title="Donation Count"
            value={aggregatesData?.roundsAggregate.aggregate.sum.totalDonationsCount ?? "--"}
            icon={Activity}
            iconColor="text-green-500"
            delay={0.2}
          />
          <MetricCard
            title="Unique Donors"
            value={aggregatesData?.roundsAggregate.aggregate.sum.uniqueDonorsCount ?? "--"}
            icon={Users}
            iconColor="text-amber-500"
            delay={0.3}
          />
          <MetricCard
            title="Total Donated"
            value={
              donationsData?.rounds
          ?.reduce((acc, round) => acc + round.donations.reduce((sum, donation) => sum + donation.amountInUsd, 0), 0) ?? "--"
            }
            icon={ArrowUpRight}
            iconColor="text-indigo-500"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1  gap-6 mb-6">
          <SimpleTable 
            headers={["Round Name", "Round Id","Total Donations" ]}
            rows={
              donationsData?.rounds.map((round) => {
                const sum = round.donations.reduce((acc, donation) => acc + donation.amountInUsd, 0);
              return {
                RoundName: round.roundMetadata?.name, 
                RoundId: round.id,
                TotalDonations: sum,
              }
            })}
            caption="All Rounds in the Program." 
            />
        </div>

        {/* Charts Row */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ChartContainer
            title="Donations Over Time"
            subtitle="Across all rounds"
            type="area"
            data={sampleAreaData}
            dataKey="users"
            className="lg:col-span-2"
            isLoading={isLoadingChart}
          />
          <ChartContainer
            title="Browser Distribution"
            subtitle="Users by browser"
            type="pie"
            data={pieData}
            isLoading={isLoadingChart}
          />
        </div> */}

        {/* Charts Row 2 */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartContainer
            title="Revenue Trends"
            subtitle="Monthly revenue"
            type="bar"
            data={sampleAreaData}
            dataKey="revenue"
            valueFormatter={(value) => `$${value}`}
            isLoading={isLoadingChart}
          />
          <ChartContainer
            title="User Activity"
            subtitle="Daily active sessions"
            type="line"
            data={sampleAreaData}
            dataKey="users"
            isLoading={isLoadingChart}
          />
        </div> */}

        {/* Table */}
        {/* <DataTable
          title="Recent Users"
          columns={columns}
          data={tableData?.tableData?.data ?? []}
          totalCount={tableData?.tableData?.totalCount ?? 0}
          page={page}
          onPageChange={setPage}
          isLoading={isLoadingTable}
        /> */}
{/* 
        <div>
          {JSON.stringify(programsAndRounds?.rounds.filter((round) => round.projectId === selectedProgramId))}
        </div> */}


{/* 
        <div>
          {JSON.stringify(donationsData)}
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;