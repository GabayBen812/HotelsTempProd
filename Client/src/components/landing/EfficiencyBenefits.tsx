import { useTranslation } from "react-i18next";
import { Timer, DollarSign, TrendingUp, UserCheck } from "lucide-react";

export default function EfficiencyBenefits() {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <Timer className="w-16 h-16 text-blue-600" />,
      title: t("landing.efficiency_benefits.save_time"),
      value: "70%",
      description: t("landing.efficiency_benefits.save_time_description"),
    },
    {
      icon: <DollarSign className="w-16 h-16 text-blue-600" />,
      title: t("landing.efficiency_benefits.reduce_costs"),
      value: "30%",
      description: t("landing.efficiency_benefits.reduce_costs_description"),
    },
    {
      icon: <TrendingUp className="w-16 h-16 text-blue-600" />,
      title: t("landing.efficiency_benefits.increase_efficiency"),
      value: "85%",
      description: t(
        "landing.efficiency_benefits.increase_efficiency_description"
      ),
    },
    {
      icon: <UserCheck className="w-16 h-16 text-blue-600" />,
      title: t("landing.efficiency_benefits.guest_satisfaction"),
      value: "95%",
      description: t(
        "landing.efficiency_benefits.guest_satisfaction_description"
      ),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            {t("landing.efficiency_benefits.maximize_efficiency")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("landing.efficiency_benefits.maximize_efficiency_description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-xl border-2 border-blue-100 hover:border-blue-500 transition-colors duration-300"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-full border-2 border-blue-100">
                {benefit.icon}
              </div>
              <div className="mt-8 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {benefit.value}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">
              {t("landing.efficiency_benefits.roi_calculator")}
            </h3>
            <p className="text-gray-600">
              {t("landing.efficiency_benefits.roi_calculator_description")}
            </p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              {t("landing.efficiency_benefits.calculate_savings")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
