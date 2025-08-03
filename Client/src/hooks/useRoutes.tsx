import { useMatches } from "react-router-dom";

interface RouteHandle {
  documentTitle: string;
}

export function useRoutes() {
  const matches = useMatches();
  const current = [...matches].reverse().find((m) => (m.handle as RouteHandle)?.documentTitle);
  return { currentRoute: current };
}
