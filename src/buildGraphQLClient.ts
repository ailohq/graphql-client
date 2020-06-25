import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { authLink, GetAccessTokenFn } from "./links/authLink";
import { errorLink } from "./links/errorLink";
import { httpLink } from "./links/httpLink";
import { Logger } from "./utils/Logger";

export { GetAccessTokenFn, Logger };

export type GraphQLClient = ApolloClient<NormalizedCacheObject>;

export function buildGraphQLClient({
  uri,
  logger = console,
  getAccessToken,
}: {
  uri: string;
  logger?: Logger;
  getAccessToken?: GetAccessTokenFn;
}): GraphQLClient {
  return new ApolloClient({
    link: ApolloLink.from([
      ...(getAccessToken ? [authLink({ getAccessToken })] : []),
      errorLink({ logger }),
      httpLink(uri),
    ]),

    cache: new InMemoryCache(),

    defaultOptions: {
      query: { errorPolicy: "all" },
      watchQuery: { errorPolicy: "all" },
      mutate: { errorPolicy: "all" },
    },
  });
}
