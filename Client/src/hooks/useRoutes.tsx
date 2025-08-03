import { useMatches } from "react-router-dom";

export function useRoutes() {
  const matches = useMatches();
  const current = [...matches].reverse().find((m) => m.handle?.documentTitle);
  return { currentRoute: current };
}
