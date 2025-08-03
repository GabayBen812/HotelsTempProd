import React, { useContext } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";

const PrivateRoute: React.FC = () => {
  const auth = useContext(AuthContext);
  const { isOrganizationFetching } = useContext(OrganizationsContext);
  const location = useLocation();
  // @ts-ignore
  const { isAuthenticated, isUserLoading, user } = auth;

  if (isUserLoading || isOrganizationFetching) return <div>Loading...</div>;

  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  const isPremittedSite =
    user?.organizationRoles[0].role.permissions.find(
      // @ts-ignore
      (permission) => permission.resource === "site"
    )?.scope === "any";

  if (!isPremittedSite)
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  if (isAuthenticated && isPremittedSite)
    return (
      <div className="px-6 py-4">
        <Outlet />
      </div>
    );
};

export default PrivateRoute;
