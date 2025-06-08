import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetDirection } from "@/lib/i18n";
import CallTable from "./Tabs/CallTable";
import RecurringCallTable from "./Tabs/RecurringCallTable";

export default function CallsPage() {
  const { t } = useTranslation();
  const direction = GetDirection();

  return (
    <div className="mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary mb-8 rtl:text-right ltr:text-left">
        {t("calls")}
      </h1>

      <Tabs
        defaultValue="active"
        className="w-full"
        dir={direction ? "rtl" : "ltr"}
      >
        <TabsList className={`grid`}>
          <TabsTrigger variant={"boxed"} value="active">
            {t("active_calls")}
          </TabsTrigger>
          <TabsTrigger variant={"boxed"} value="recurring">
            {t("recurring_calls")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <CallTable />
        </TabsContent>
        <TabsContent value="recurring" className="mt-6">
          <RecurringCallTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
