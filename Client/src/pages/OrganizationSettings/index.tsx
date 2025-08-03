import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CallSettingsTable from "./CallSettings";
import { GetDirection } from "@/lib/i18n";
import Locations from "@/pages/OrganizationSettings/Locations";
import { useTranslation } from "react-i18next";
import GeneralSettings from "./GeneralSettings";
import SettingsBreadcrumbs from "./SettingsBreadcrumbs";
import Roles from "./Roles";
import DepartmentsList from "./Departments";
import { useHasScopedAccess } from "@/api/utils/hasScopedAccess";
import AiChatSettings from "./AiChat";

function OrganizationSettings() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const canAccessDepartments = useHasScopedAccess({
    resource: "departments",
    action: "view",
  });

  const canAccessCalls = useHasScopedAccess({
    resource: "callCategories",
    action: "view",
  });

  const canAccessRoles = useHasScopedAccess({
    resource: "roles",
    action: "view",
  });

  const canAccessLocations = useHasScopedAccess({
    resource: "locations",
    action: "view",
  });

  const activeTab = searchParams.get("tab") || "general";
  const activeSubTab = searchParams.get("subtab");

  const validTabs = useMemo(() => {
    const tabs = ["general", "ai"];
    if (canAccessDepartments) tabs.push("departments");
    if (canAccessCalls) tabs.push("calls");
    if (canAccessRoles) tabs.push("roles");
    if (canAccessLocations) tabs.push("locations");
    return tabs;
  }, [
    canAccessDepartments,
    canAccessCalls,
    canAccessRoles,
    canAccessLocations,
  ]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");

    if (tabFromUrl && !validTabs.includes(tabFromUrl)) {
      setSearchParams({ tab: "general" }, { replace: true });
    } else if (!tabFromUrl) {
      setSearchParams({ tab: "general" }, { replace: true });
    }
  }, [searchParams, setSearchParams, validTabs]);

  const handleMainTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  const getBreadcrumbs = () => {
    const crumbs: { label: string; href?: string }[] = [
      {
        label: t("organization_settings"),
        href: "/organization-settings?tab=general",
      },
    ];

    if (activeTab && activeTab !== "general") {
      crumbs.push({
        label: t(activeTab),
        href: `/organization-settings?tab=${activeTab}`,
      });
    }

    if (activeSubTab) {
      crumbs.push({ label: t(activeSubTab) });
    }

    return crumbs;
  };

  const breadcrumbCrumbs = getBreadcrumbs();

  return (
    <div className="mx-auto h-full flex flex-col">
      <h1 className="heading text-2xl mb-1">{t(activeSubTab || activeTab)}</h1>
      <div className="pb-6">
        <SettingsBreadcrumbs crumbs={breadcrumbCrumbs} />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleMainTabChange}
        className="w-full flex flex-col flex-1"
        dir={GetDirection() ? "rtl" : "ltr"}
      >
        <div className="mb-2">
          <TabsList className={`grid grid-cols-${validTabs.length} mb-8`}>
            <TabsTrigger variant={"outline"} value="general">
              {t("general")}
            </TabsTrigger>
            <TabsTrigger variant={"outline"} value="ai">
              {t("ai")}
            </TabsTrigger>
            {canAccessDepartments && (
              <TabsTrigger variant={"outline"} value="departments">
                {t("departments")}
              </TabsTrigger>
            )}

            {canAccessCalls && (
              <TabsTrigger variant={"outline"} value="calls">
                {t("call_settings")}
              </TabsTrigger>
            )}

            {canAccessRoles && (
              <TabsTrigger variant={"outline"} value="roles">
                {t("roles")}
              </TabsTrigger>
            )}

            {canAccessLocations && (
              <TabsTrigger variant={"outline"} value="locations">
                {t("locations")}
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <div className="flex flex-col gap-2 mt-5 flex-1">
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          <TabsContent value="ai">
            <AiChatSettings />
          </TabsContent>
          {canAccessDepartments && (
            <TabsContent value="departments">
              <DepartmentsList />
            </TabsContent>
          )}

          {canAccessCalls && (
            <TabsContent value="calls">
              <CallSettingsTable />
            </TabsContent>
          )}

          {canAccessRoles && (
            <TabsContent value="roles">
              <Roles
                setSearchParams={setSearchParams}
                searchParams={searchParams}
              />
            </TabsContent>
          )}

          {canAccessLocations && (
            <TabsContent className="flex-1" value="locations">
              <Locations />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}

export default OrganizationSettings;
