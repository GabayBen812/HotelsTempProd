import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Smartphone, Bot, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GetDirection } from "@/lib/i18n";

export default function FeaturePillars() {
  const { t } = useTranslation();
  const direction = GetDirection();
  
  const pillars = [
    {
      icon: Monitor,
      title: t("management_dashboard"),
      description: t("management_dashboard_desc"),
      features: [
        t("employee_management"),
        t("call_tracking"),
        t("call_creation"),
        t("performance_analytics"),
      ],
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
    },
    {
      icon: Smartphone,
      title: t("employee_app_title"),
      description: t("employee_app_desc"),
      features: [
        t("task_assignment"),
        t("issue_resolution"),
        t("team_communication"),
        t("real_time_updates"),
      ],
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      icon: Bot,
      title: t("smart_guest_assistant"),
      description: t("smart_guest_assistant_desc"),
      features: [
        t("hotel_data_lake"),
        t("instant_response"),
        t("multilingual_support"),
        t("smart_routing"),
      ],
      gradient: "from-cyan-500 to-teal-600",
      bgGradient: "from-cyan-50 to-teal-50",
    },
  ];

  return (
    <section id="features" className="py-24 px-6" dir={direction ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t("three_platforms_part1")}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {t("three_platforms_highlight")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("built_for_all_users")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card
                className={`h-full bg-gradient-to-br ${pillar.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${pillar.gradient} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <pillar.icon className="w-8 h-8 text-surface" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {pillar.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {pillar.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${pillar.gradient} rounded-full`}
                        ></div>
                        <span className="text-gray-700 font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`flex items-center gap-2 text-transparent bg-gradient-to-r ${pillar.gradient} bg-clip-text font-semibold hover:gap-3 transition-all duration-300`}
                  >
                    {t("read_more")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
