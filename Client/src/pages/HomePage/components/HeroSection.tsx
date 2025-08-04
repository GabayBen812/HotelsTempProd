import { Button } from "@/components/ui/button";
import { Building2, Users, Bot, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GetDirection } from "@/lib/i18n";
import Logo from "@/assets/logo.svg";
export default function HeroSection() {
  const { t } = useTranslation();
  const direction = GetDirection();

  const statItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      className="pt-32 pb-20 px-6 overflow-hidden"
      dir={direction ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-28 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t("hero_title_part1")}{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {t("hero_title_highlight")}
                </span>{" "}
                {t("hero_title_part2")}
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                {t("hero_description")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-lg px-8 py-4 h-auto"
              >
                {t("find_plan_button")}
                <ArrowLeft className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <motion.div
              className="flex items-center gap-8 pt-6 flex-wrap"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="text-center" variants={statItemVariants}>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">
                  {t("suitable_all_hotels")}
                </div>
              </motion.div>
              <motion.div className="text-center" variants={statItemVariants}>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">{t("ai_support")}</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 1,
              delay: 0.4,
            }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Main Dashboard Mockup */}
              <motion.div
                className="bg-surface rounded-2xl shadow-2xl p-8"
                whileHover={{ y: -10, scale: 1.02, rotate: 1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 shadow-sm rounded-lg flex items-center justify-center">
                    {/* <Building2 className="w-5 h-5 text-surface" /> */}
                    <img
                      src={Logo}
                      className="border border-border/20 shadow-md shadow-primary/10 rounded-lg"
                    />
                  </div>
                  <span className="font-semibold text-gray-900">
                    {t("admin_screen")}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">
                      {t("calls_in_progress")}
                    </span>
                    <span className="text-lg font-bold text-green-600">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">
                      {t("daily_calls")}
                    </span>
                    <span className="text-lg font-bold text-blue-600">17</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">
                      {t("avg_handling_time")}
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      {t("minutes_example")}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Mobile App Mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: 6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: 6,
                }}
                transition={{
                  opacity: { delay: 0.8, type: "spring", stiffness: 120 },
                  y: { delay: 0.8, type: "spring", stiffness: 120 },
                  rotate: { type: "spring", stiffness: 120 }, // No delay!
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  transition: { duration: 0.2, delay: 0 },
                }}
                className="absolute -bottom-8 -right-8 bg-surface rounded-xl shadow-xl p-4 w-48"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {t("employee_app")}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="bg-yellow-50 rounded p-2">
                    <div className="text-xs font-medium text-yellow-800">
                      {t("call_in_progress")}
                    </div>
                    <div className="text-xs text-yellow-600">
                      {t("room_ac_issue")}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-xs font-medium text-green-800">
                      {t("completed")}
                    </div>
                    <div className="text-xs text-green-600">
                      {t("room_service")}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Chat Mockup */}
              <motion.div
                className="absolute -top-8 -left-8 bg-surface rounded-xl shadow-xl p-4 w-56"
                initial={{ opacity: 0, y: -20, rotate: 6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: 6,
                }}
                transition={{
                  opacity: { delay: 1, type: "spring", stiffness: 120 },
                  y: { delay: 1, type: "spring", stiffness: 120 },
                  rotate: { type: "spring", stiffness: 120 }, // No delay!
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  transition: { duration: 0.2, delay: 0 },
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm font-medium">
                    {t("ai_customer_assistant")}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded-lg p-2 text-xs">
                    {t("customer_message")}
                  </div>
                  <div className="bg-blue-500 text-surface rounded-lg p-2 text-xs ml-4">
                    {t("ai_response")}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
