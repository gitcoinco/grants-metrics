"use client";

import React from "react";
import { MetricCard } from "./MetricCard";
import { Users, DollarSign, Activity, ArrowUpRight } from "lucide-react";
import { extractRoundsAndPrograms, useAggregates, useProgramsAndRounds } from "@/hooks/useGraphQLData";

interface MetricCardSetProps {
  selectedProgramId: string
}

export function MetricCardSet({
  selectedProgramId,
} : MetricCardSetProps) {

  const { data: programsAndRounds } = useProgramsAndRounds();
  const { rounds } = extractRoundsAndPrograms(programsAndRounds);

  const { data: aggregatesData } = useAggregates(rounds.filter((round) => round.projectId === selectedProgramId)?.map((round) => round.id));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <MetricCard
        title="Match Amount in USD"
        value={aggregatesData?.roundsAggregate.aggregate.sum.matchAmount?.toLocaleString() ?? "--"}
        icon={DollarSign}
        iconColor="text-blue-500"
        delay={0.1}
      />
      <MetricCard
        title="Donation Count"
        value={aggregatesData?.roundsAggregate.aggregate.sum.totalDonationsCount?.toLocaleString() ?? "--"}
        icon={Activity}
        iconColor="text-green-500"
        delay={0.2}
      />
      <MetricCard
        title="Unique Donors"
        value={aggregatesData?.roundsAggregate.aggregate.sum.uniqueDonorsCount?.toLocaleString() ?? "--"}
        icon={Users}
        iconColor="text-amber-500"
        delay={0.3}
      />
      <MetricCard
        title="Total Donated"
        value={aggregatesData?.roundsAggregate.aggregate.sum.totalAmountDonatedInUsd?.toLocaleString() ?? "--"}
        icon={ArrowUpRight}
        iconColor="text-indigo-500"
        delay={0.4}
      />
    </div>
  );
}

