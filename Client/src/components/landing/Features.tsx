import { useTranslation } from "react-i18next";
import { Hotel, Users, ClipboardList, Bell } from "lucide-react";

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Hotel className="w-8 h-8 text-blue-600" />,
      title: t("landing.features.hotels"),
      description: t("landing.features.hotels_description"),
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: t("landing.features.staff"),
      description: t("landing.features.staff_description"),
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-blue-600" />,
      title: t("landing.features.service_request"),
      description: t("landing.features.service_request_description"),
    },
    {
      icon: <Bell className="w-8 h-8 text-blue-600" />,
      title: t("landing.features.reports"),
      description: t("landing.features.reports_description"),
    },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            {t("landing.features.overview")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("landing.features.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-surface p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
