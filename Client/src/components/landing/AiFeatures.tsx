import { useTranslation } from "react-i18next";
import { Bot, BarChart3, QrCode, MessageSquareMore } from "lucide-react";

export default function AiFeatures() {
  const { t } = useTranslation();

  const aiFeatures = [
    {
      icon: <Bot className="w-12 h-12 text-blue-600" />,
      title: t("landing.ai_features.ai_powered_insights"),
      description: t("landing.ai_features.ai_powered_insights_description"),
      features: [
        t("landing.ai_features.staff_efficiency_analysis"),
        t("landing.ai_features.performance_optimization_suggestions"),
        t("landing.ai_features.resource_allocation_recommendations"),
      ],
    },
    {
      icon: <QrCode className="w-12 h-12 text-blue-600" />,
      title: "Smart Room Service",
      description: t("landing.ai_features.smart_room_service_description"),
      features: [
        t("landing.ai_features.room_specific_qr_codes"),
        t("landing.ai_features.instant_service_requests"),
        t("landing.ai_features.automated_task_assignment"),
      ],
    },
    {
      icon: <MessageSquareMore className="w-12 h-12 text-blue-600" />,
      title: t("landing.ai_features.ai_chatbot_assistant"),
      description: t("landing.ai_features.ai_chatbot_assistant_description"),
      features: [
        t("landing.ai_features.instant_guest_support"),
        t("landing.ai_features.automated_request_handling"),
        t("landing.ai_features.reduced_reception_workload"),
      ],
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-blue-600" />,
      title: t("landing.ai_features.intelligent_reports"),
      description: t("landing.ai_features.intelligent_reports_description"),
      features: [
        t("landing.ai_features.performance_analytics"),
        t("landing.ai_features.trend_analysis"),
        t("landing.ai_features.optimization_suggestions"),
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            {t("landing.ai_features.ai_powered_excellence")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("landing.ai_features.ai_powered_excellence_description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {aiFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">{feature.icon}</div>
                <h3 className="text-xl font-semibold ml-4">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
