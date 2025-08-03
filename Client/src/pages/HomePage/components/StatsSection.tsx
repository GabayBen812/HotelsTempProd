import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GetDirection } from "@/lib/i18n";

export default function StatsSection() {
  const { t } = useTranslation();
  const direction = GetDirection();
  
  const stats = [
    { label: t("operational_efficiency_increase"), value: "" },
    { label: t("faster_issue_resolution"), value: "" },
    { label: t("guest_satisfaction_score"), value: "" },
    { label: t("operational_cost_reduction"), value: "" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500" dir={direction ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center text-surface"
            >
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100 font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
