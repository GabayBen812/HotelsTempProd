// src/pages/errors/NotFoundPage.tsx

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuroraBackground } from "@/components/backgrounds/AroraBackground";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <AuroraBackground>
      <section className="h-full w-full justify-center items-center flex z-above-all">
        <div className="flex gap-5 items-center justify-center rtl:flex-row-reverse ltr:flex-row h-fit">
          <p className="text-2xl font-medium pr-4 border-r-[1.5px] border-gray-800">
            404
          </p>
          <span className="text-2xl font-normal">{t("page_not_found")}</span>
        </div>
      </section>
    </AuroraBackground>
  );
}
