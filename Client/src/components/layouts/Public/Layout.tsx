// components/layouts/PublicLayout.tsx
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/hooks/useRoutes";

const PublicLayout = () => {
  const { currentRoute } = useRoutes();
  const { t } = useTranslation();

  // Get the last matched route with a title
  const title = currentRoute
    ? `${t("website_titles." + currentRoute.handle.documentTitle)}`
    : "Bloom";

  return (
    <>
      <Helmet>
        <title>{title}</title>

        {/* You can add other dynamic meta tags here too */}
      </Helmet>

      {/* Public routes content */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
