
import { toast } from "sonner";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const API_ENDPOINT = "https://beta.indexer.gitcoin.co/v1/graphql";


export async function fetchGraphQL<T>(
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            totalAmountDonatedInUsd
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

};

