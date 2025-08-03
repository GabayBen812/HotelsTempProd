import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import StatsSection from "./components/StatsSection";
import FeaturePillars from "./components/FeatureSection";
import AICapabilities from "./components/AICapabilities";
import CTASection from "./components/CTASection";
import HeroSection from "./components/HeroSection";
import LanguagePicker from "@/components/LanguagePicker";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { useTranslation } from "react-i18next";
import { GetDirection } from "@/lib/i18n";

export default function Homepage() {
  const { t } = useTranslation();
  const direction = GetDirection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-surface to-blue-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-gray-100 py-5" dir={direction ? "rtl" : "ltr"}>
          <div className="flex justify-between max-w-7xl w-full m-auto items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <img
                  src={logo}
                  alt={t("bloom_logo")}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-xl font-bold">Bloom</span>
            </div>
            <div className="flex justify-start gap-2">
              <Link to="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 py-5 px-7">
                  {t("website_titles.login")}
                </Button>
              </Link>
              <LanguagePicker />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Feature Pillars */}
        <FeaturePillars />

        {/* AI Capabilities */}
        <AICapabilities />

        {/* Final CTA */}
        <CTASection />

        {/* Footer */}
        <footer className={`flex gap-6 w-full py-12 justify-center items-center text-sm ${direction ? "flex-row-reverse" : "flex-row"}`} dir={direction ? "rtl" : "ltr"}>
          <p>{t("copyright_2025")}</p>
          <p className="cursor-default">|</p>
          <p className="cursor-pointer">{t("terms_and_conditions")}</p>
          <p className="cursor-default">|</p>
          <p className="cursor-pointer">{t("privacy_policy")}</p>
          <p>|</p> <p className="cursor-pointer">{t("hotels")}</p>
        </footer>
      </motion.div>
    </div>
  );
}
