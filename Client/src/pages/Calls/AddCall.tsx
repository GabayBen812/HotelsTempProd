import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { useLocations } from "@/hooks/organization/useLocations";
import { useUser } from "@/hooks/useUser";
import { getCallFields } from "@/components/forms/calls/callFields";
import { callFormSchema } from "@/components/forms/calls/callFormSchema";
import DynamicForm from "@/components/forms/DynamicForm";
import { createCall } from "@/api/calls";
import { z } from "zod";

export default function AddCall() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { callCategories } = useContext(OrganizationsContext);
  const { locations } = useLocations();
  const { allUsers } = useUser();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build status options as in CallTable
  const statusOptions = Object.entries({
    OPENED: t("status_open"),
    IN_PROGRESS: t("status_in_progress"),
    COMPLETED: t("status_completed"),
    FAILED: t("status_failed"),
    ON_HOLD: t("status_on_hold"),
  }).map(([value, label]) => ({ value, label }));

  // Use the same fields as the main table
  const fields = getCallFields(
    t,
    i18n.language as "he" | "en" | "ar",
    locations,
    callCategories,
    allUsers,
    statusOptions
  );

  // Handle form submit
  const handleSubmit = async (data: z.infer<typeof callFormSchema>) => {
    setError(null);
    try {
      // Find departmentId from callCategoryId
      const category = callCategories.find(
        //@ts-ignore
        (cat) => cat.id === data.callCategoryId
      );
      const departmentId = category?.departmentId;
      if (!departmentId) throw new Error(t("missing_department"));

      const payload = { ...data, departmentId, status: "OPENED" as const };
      await createCall(payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/calls");
      }, 1500);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-muted/50">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("add_call")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicForm
            mode="create"
            fields={fields}
            validationSchema={callFormSchema}
            onSubmit={handleSubmit}
          />
          {success && (
            <div className="text-success text-center mt-2">{t("success")}</div>
          )}
          {error && (
            <div className="text-destructive text-center mt-2">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 