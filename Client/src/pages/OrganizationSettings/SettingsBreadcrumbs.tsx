import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import React from "react";

interface Crumb {
  label: string;
  href?: string;
}

type Props = {
  crumbs: Crumb[];
};

export default function SettingsBreadcrumbs({ crumbs }: Props) {
  const navigate = useNavigate();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <BreadcrumbItem>
              {crumb.href && i !== crumbs.length - 1 ? (
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => navigate(crumb.href!)}
                >
                  {crumb.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {i < crumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
