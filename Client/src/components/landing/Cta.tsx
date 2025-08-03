import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  const { t } = useTranslation();

  return (
    <section className="bg-blue-600 text-surface py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">
              {t(
                "landing.cta.start_managing_your_hotel_operations_more_efficiently_today"
              )}
            </h2>
            <p className="text-xl text-blue-100">
              {t(
                "landing.cta.start_managing_your_hotel_operations_more_efficiently_today"
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-surface text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg shadow-lg font-semibold transition-colors"
            >
              {t("login")}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-surface px-6 py-3 rounded-lg shadow-lg font-semibold transition-colors"
            >
              {t("user_actions.contact")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
