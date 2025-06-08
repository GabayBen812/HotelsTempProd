import { useSearchParams } from "react-router-dom";

/**
 * Hook to retrieve the search query parameters from the current URL as object.
 */

export default function useSearchQuery() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  return params;
}
