
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL, QUERIES } from "@/lib/api";

// Define the types for our API responses
export interface Metrics {
  totalUsers: string | number;
  activeUsers: string | number;
  revenueAmount: string;
  conversionRate: string;
  lastUpdated?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface TableItem {
  id: string;
  name: string;
  email: string;
  status: string;
  date: string;
  value: string;
}

export interface TableData {
  totalCount: number;
  pageCount: number;
  data: TableItem[];
}


interface RoundsResponse {
  rounds: Round[];
}

interface AggregatesResponse {
  roundsAggregate: {
    aggregate: {
      sum: {
        matchAmount: number;
        totalDonationsCount: number;
        uniqueDonorsCount: number;
      };
    };
  };
}

// interface DonationsResponse {
//   rounds: {
//   }
// }

export interface Round {
  id: string;
  projectId: string;
  project: Project;
  roundMetadata: RoundMetadata;
  donations: Donation[];
  applications: Application[];
}

interface Donation {
  amountInUsd: number;
  donorAddress: string;
  timestamp: string;
  applicationId: string;
}

interface ProjectMetadata {
  name: string;
  type: string;
}

interface Application {
  id: string;
}

interface RoundMetadata {
  name: string;
  roundType: string;
}

export interface Project {
  metadata: ProjectMetadata;
  id: string;
}


export function useProgramsAndRounds() {
  return useQuery<RoundsResponse>({
    queryKey: ["programsAndRounds"],
    queryFn: async () => {
     return fetchGraphQL<RoundsResponse>(QUERIES.GET_PROGRAMS, {});
    },
  });
}

export function useAggregates(roundIds: string[] | undefined) {
  if (!roundIds || roundIds.length === 0) {
    roundIds = []
  }

  return useQuery<AggregatesResponse>({
    queryKey: ["aggregrates", roundIds],
    queryFn: async () => {
     return fetchGraphQL<AggregatesResponse>(QUERIES.GET_AGGREGATES, {"_in":  roundIds});
    },
  });
}

export function useDonations(roundIds: string[] | undefined) {
  if (!roundIds || roundIds.length === 0) {
    roundIds = []
  }

  return useQuery<RoundsResponse>({
    queryKey: ["donations", roundIds],
    queryFn: async () => {
     return fetchGraphQL<RoundsResponse>(QUERIES.GET_DONATIONS, {"_in":  roundIds});
    },
  });
}

export function extractRoundsAndPrograms(data?: RoundsResponse) {
  const programs: Project[] = [];
  const rounds: Round[] = [];

  data?.rounds.forEach((round) => {
    programs.push({metadata: round.project.metadata, id: round.project.id});
    rounds.push(round);
  });

  //remove duplicate programs
  const uniquePrograms = programs.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

  return { uniquePrograms, rounds };
}
  