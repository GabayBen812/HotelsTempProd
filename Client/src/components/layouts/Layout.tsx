import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/Sidebar/Sidebar";
import { GetDirection } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import Topbar from "./Topbar/Topbar";
import { Helmet } from "react-helmet";
import { useContext } from "react";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { useRoutes } from "@/hooks/useRoutes";
import { useTranslation } from "react-i18next";

interface RouteHandle {
  documentTitle: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { organization } = useContext(OrganizationsContext);
  const { currentRoute } = useRoutes();
  const { t } = useTranslation();
  const title = `${organization?.name} - ${t(
    (currentRoute?.handle as RouteHandle)?.documentTitle
  )}`;
  // Dynamically replace the favicon
  // useEffect(() => {
  //   if (!organization?.logo) return;

  //   const link: HTMLLinkElement =
  //     document.querySelector("link[rel*='icon']") ||
  //     document.createElement("link");
  //   link.type = "image/png";
  //   link.rel = "icon";
  //   link.href = organization.logo;

  //   document.head.appendChild(link);
  // }, [organization?.logo]);
  return (
    <>
      <Helmet>
        <title>{organization && title}</title>

        {/* You can add other dynamic meta tags here too */}
      </Helmet>
      <div className="flex h-screen flex-col relative">
        <Topbar />
        <SidebarProvider className="flex-row-reverse">
          <SidebarInset>
            <div className="flex flex-col gap-4 mt-16 h-[calc(100svh-theme(spacing.16))] overflow-auto">
              <div className="w-full overflow-y-auto p-2 min-h-full ">
                {children}
              </div>
              {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
            </div>
          </SidebarInset>
          <AppSidebar
            className="h-[calc(100svh-theme(spacing.16))] top-[calc(theme(spacing.16))]"
            side={GetDirection() ? "right" : "left"}
          />
          <Toaster />
        </SidebarProvider>
      </div>
    </>
  );
};
