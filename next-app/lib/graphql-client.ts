/**
 * GraphQL Client for WordPress
 * Handles data fetching from WPGraphQL with caching and error handling
 */

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;

if (!WP_GRAPHQL_URL) {
  throw new Error('NEXT_PUBLIC_WP_GRAPHQL_URL environment variable is not set');
}

/**
 * Execute a GraphQL query against WordPress
 */
export async function fetchGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>,
  options?: {
    revalidate?: number;
    tags?: string[];
  }
): Promise<T> {
  const { revalidate = 60, tags = [] } = options || {};

  const response = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: {
      revalidate,
      tags,
    },
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    const errorMessage = result.errors.map((e) => e.message).join('; ');
    console.error('GraphQL Errors:', result.errors);
    throw new Error(`GraphQL Error: ${errorMessage}`);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL query');
  }

  return result.data;
}

/**
 * Execute a GraphQL query with automatic pagination
 */
export async function fetchGraphQLPaginated<T = any>(
  query: string,
  variables?: Record<string, any>,
  options?: {
    revalidate?: number;
    tags?: string[];
  }
): Promise<T[]> {
  const { revalidate = 60, tags = [] } = options || {};
  const allData: T[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetchGraphQL(
      query,
      { ...variables, after },
      { revalidate, tags }
    );

    // Extract the main collection key (assumes it's the first key after 'posts', 'categories', etc.)
    const mainKey = Object.keys(response).find(
      (key) => key !== '__typename' && typeof response[key] === 'object'
    );

    if (!mainKey) {
      break;
    }

    const collection = response[mainKey];

    if (collection.edges) {
      allData.push(...collection.edges.map((edge: any) => edge.node));
    }

    hasNextPage = collection.pageInfo?.hasNextPage || false;
    after = collection.pageInfo?.endCursor || null;
  }

  return allData;
}

/**
 * Check if GraphQL endpoint is accessible
 */
export async function validateWPGraphQLConnection(): Promise<boolean> {
  try {
    const response = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            __typename
          }
        `,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to connect to WordPress GraphQL:', error);
    return false;
  }
}
