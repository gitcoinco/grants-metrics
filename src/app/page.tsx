"use client";


import React, { useState } from "react";

import { DashboardHeader } from "@/components/DashboardHeader";

import { useProgramsAndRounds, extractRoundsAndPrograms, useDonations } from "@/hooks/useGraphQLData";
import { SimpleTable } from "@/components/SimpleTable";
import { MetricCardSet } from "@/components/MetricCardSet";

const Dashboard = () => {

  const [selectedProgramId, setSelectedProgramId] = useState("none");

  

  const { data: programsAndRounds } = useProgramsAndRounds();
  const { uniquePrograms, rounds } = extractRoundsAndPrograms(programsAndRounds);

  
  const { data: donationsData } = useDonations(rounds.filter((round) => round.projectId === selectedProgramId)?.map((round) => round.id));


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DashboardHeader
          title="Gitcoin Grants Programs"
          subtitle="Monitor your key metrics and performance indicators for Gitcoin Grants programs."
          programs={uniquePrograms}
          onProgramChange={setSelectedProgramId}
          selectedProgram={selectedProgramId}
        />

    
   

        {/* Metrics Row */}

        <MetricCardSet selectedProgramId={selectedProgramId} />


        <div className="grid grid-cols-1  gap-6 mb-6">
          <SimpleTable 
            headers={["Round Name", "Round Id" ]}
            rows={
              donationsData?.rounds.map((round) => {
                // const sum = round.donations.reduce((acc, donation) => acc + donation.amountInUsd, 0);
              return {
                RoundName: round.roundMetadata?.name, 
                RoundId: round.id,
                // TotalDonations: sum,
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