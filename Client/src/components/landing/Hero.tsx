import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Building2, Hotel, Users, Calendar } from "lucide-react";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-blue-600 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 w-full h-full opacity-10">
        <div className="absolute inset-0 grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {i % 4 === 0 && <Building2 size={32} />}
              {i % 4 === 1 && <Hotel size={32} />}
              {i % 4 === 2 && <Users size={32} />}
              {i % 4 === 3 && <Calendar size={32} />}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              {t("landing.hero.system_name")} - {t("landing.header.title")}
            </h1>
            <p className="text-xl text-blue-100 mb-8 mx-auto md:mx-0 text-center">
              {t("landing.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-center  ">
              <Link
                to="/login"
                className="btn-sm bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg shadow-lg font-semibold"
              >
                {t("login")}
              </Link>
              <Link
                to="/contact"
                className="btn-sm bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg font-semibold"
              >
                {t("user_actions.contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
