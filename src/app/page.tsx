"use client";


import React, { useState } from "react";
import { Users, DollarSign, Activity, ArrowUpRight } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricCard } from "@/components/MetricCard";
import { useProgramsAndRounds, extractRoundsAndPrograms, useAggregates, useDonations } from "@/hooks/useGraphQLData";
import { SimpleTable } from "@/components/SimpleTable";

const Dashboard = () => {

  const [selectedProgramId, setSelectedProgramId] = useState("all");

  const { data: programsAndRounds } = useProgramsAndRounds();
  const { uniquePrograms, rounds } = extractRoundsAndPrograms(programsAndRounds);

  const { data: aggregatesData} = useAggregates(rounds.filter((round) => round.projectId === selectedProgramId)?.map((round) => round.id));
  const { data: donationsData } = useDonations(rounds.filter((round) => round.projectId === selectedProgramId)?.map((round) => round.id));


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DashboardHeader
          title="Analytics Dashboard"
          subtitle="Monitor your key metrics and performance indicators"
          programs={uniquePrograms}
          onProgramChange={setSelectedProgramId}
          selectedProgram={selectedProgramId}
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