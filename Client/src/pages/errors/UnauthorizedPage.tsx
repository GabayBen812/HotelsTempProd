// src/pages/errors/UnauthorizedPage.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center p-6 shadow-xl rounded-2xl border">
        <ShieldOff className="mx-auto text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-semibold mb-2">
          {t("unauthorized.title", "Access Denied")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t(
            "unauthorized.description",
            "You don't have permission to view this page."
          )}
        </p>
        <Button onClick={() => navigate("/login")}>
          {t("unauthorized.button", "Go to Homepage")}
        </Button>
      </Card>
    </div>
  );
}
