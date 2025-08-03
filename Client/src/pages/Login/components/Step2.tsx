import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Hotel, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Organization } from "@/types/api/organization";
import { useContext, useEffect } from "react";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import logo from "@/assets/logo.svg";

function Step2() {
  const { t } = useTranslation();
  const {
    organizations,
    organizationsStatus,
    selectOrganization,
    refetchOrganizations,
  } = useContext(OrganizationsContext);
  const navigate = useNavigate();

  useEffect(() => {
    refetchOrganizations();
  }, []);

  const handleOrganizationClick = (organizationId: string) => {
    if (organizationId === "new") navigate(`/create-organization`);
    else {
      selectOrganization(Number(organizationId));
      navigate("/home");
    }
  };

  if (
    organizationsStatus === "pending" ||
    !organizations ||
    !organizations.data
  ) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full h-full border-0 shadow-none">
      <CardHeader className="text-center pb-2 justify-center items-center">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 w-16 h-16 shadow-md shadow-primary/10 rounded-2xl border border-border/20"
        />
        <CardTitle className="text-2xl font-bold text-primary">
          {t("select_organization")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <form className="grid grid-cols-3 items-center gap-3 w-full text-right">
          {organizations.data.length === 0 && <NoOrganizations />}
          {organizations.data.length > 0 && (
            <Organizations
              organizations={organizations.data}
              handleOrganizationClick={handleOrganizationClick}
            />
          )}

          <button
            className="flex flex-col items-center justify-center rounded-xl border border-border/40 shadow-sm p-6 aspect-square h-40 group hover:bg-background cursor-pointer duration-200 ease-out relative"
            type="button"
            onClick={() => handleOrganizationClick("new")}
          >
            <Avatar className="rounded-md w-14 h-14">
              <AvatarFallback className="rounded-full bg-border/30 group-hover:bg-surface duration-150">
                <Plus className="text-accent" />
              </AvatarFallback>
            </Avatar>
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

function Organizations({
  organizations,
  handleOrganizationClick,
}: {
  organizations: Organization[];
  handleOrganizationClick: (organizationId: string) => void;
}) {
  return (
    <>
      {organizations.map((organization: Organization) => (
        <button
          className="flex flex-col items-center justify-center rounded-xl border border-border/40 shadow-sm 
                   p-6 aspect-square w-40 group cursor-pointer relative 
                   transition-all duration-200 ease-out
                   hover:scale-105 hover:shadow-md hover:bg-background/70"
          type="button"
          onClick={() => handleOrganizationClick(String(organization.id))}
        >
          <Avatar className="rounded-md mb-5 w-14 h-14">
            <AvatarFallback className="rounded-full bg-accent text-surface">
              <Hotel />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1 text-center">
            <p className="font-medium">{organization.name}</p>
          </div>
        </button>
      ))}
    </>
  );
}

function NoOrganizations() {
  return (
    <div>
      <h1 className="font-medium text-2xl">לחשבון זה אין חברות משוייכות לו</h1>
    </div>
  );
}

export default Step2;
