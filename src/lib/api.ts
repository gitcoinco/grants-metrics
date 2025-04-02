
import { toast } from "sonner";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const OLD_API_ENDPOINT = "https://grants-stack-indexer-v2.gitcoin.co/graphql";
const API_ENDPOINT = "https://beta.indexer.gitcoin.co/v1/graphql";


export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network error: ${response.status} - ${errorText}`);
    }

    const json = await response.json() as GraphQLResponse<T>;

    if (json.errors && json.errors.length > 0) {
      const errorMessage = json.errors.map(error => error.message).join(", ");
      toast.error(`API Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }
    return json.data as T;
  } catch (error) {
    console.error("GraphQL fetch error:", error);
    toast.error(`Failed to fetch data: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
}

// Sample queries
export const QUERIES = {
  GET_PROGRAMS: `
    query getPrograms {
      rounds(
        where: {donations: {amount: {_gte: "10"}}, project: {tags: {_contains: "program"}}}
        orderBy: {createdAtBlock: DESC}
      ) {
        id
        projectId
        project {
          metadata
          id
        }
        roundMetadata
      }
    }
  `,

  GET_AGGREGATES:  `
    query getAggregates($_in: [String!] ) {
      roundsAggregate(where: {id: {_in: $_in}}) {
        aggregate {
          sum {
            matchAmount
            totalDonationsCount
            uniqueDonorsCount
          }
        }
      }
    }
  `,

  GET_DONATIONS: `
    query MyQuery($_in: [String!] ) {
      rounds(where: {id: {_in: $_in}}) {
        donations {
          amountInUsd
          donorAddress
          timestamp
          applicationId
        }
        applications {
          id
        }
        roundMetadata
        id
      }
    }
  `,


  // Sample queries for metrics, charts, and tables

  GET_METRICS: `
    query GetMetrics($period: String!) {
      metrics(period: $period) {
        totalUsers
        activeUsers
        revenueAmount
        conversionRate
        lastUpdated
      }
    }
  `,
  GET_CHART_DATA: `
    query GetChartData($type: String!, $period: String!) {
      chartData(type: $type, period: $period) {
        labels
        datasets {
          label
          data
          borderColor
          backgroundColor
        }
      }
    }
  `,
  GET_TABLE_DATA: `
    query GetTableData($type: String!, $limit: Int!, $page: Int!) {
      tableData(type: $type, limit: $limit, page: $page) {
        totalCount
        pageCount
        data {
          id
          name
          email
          status
          date
          value
        }
      }
    }
  `
};

// Mock data for development before the API is ready
export function getMockData<T>(queryName: keyof typeof QUERIES, variables: Record<string, any>): T {
  console.log(`[Mock] Fetching ${queryName} with variables:`, variables);
  
  const mockData: Record<string, any> = {
    GET_METRICS: {
      metrics: {
        totalUsers: 12846,
        activeUsers: 8721,
        revenueAmount: "$421,582",
        conversionRate: "8.7%",
        lastUpdated: new Date().toISOString()
      }
    },
    GET_CHART_DATA: {
      chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue",
            data: [3000, 4500, 3800, 5100, 6200, 5800],
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.1)"
          }
        ]
      }
    },
    GET_TABLE_DATA: {
      tableData: {
        totalCount: 240,
        pageCount: 24,
        data: Array.from({ length: 10 }, (_, i) => ({
          id: `user-${i+1}`,
          name: `User ${i+1}`,
          email: `user${i+1}@example.com`,
          status: ["active", "inactive", "pending"][Math.floor(Math.random() * 3)],
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          value: `$${Math.floor(Math.random() * 1000)}`
        }))
      }
    }
  };
  
  return mockData[queryName] as T;
}
