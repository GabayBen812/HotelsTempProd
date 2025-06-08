import { Button } from "@/components/ui/button";
import { Hotel } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatsSection from "./components/StatsSection";
import FeaturePillars from "./components/FeatureSection";
import AICapabilities from "./components/AICapabilities";
import CTASection from "./components/CTASection";
import HeroSection from "./components/HeroSection";
import LanguagePicker from "@/components/LanguagePicker";

export default function Homepage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 py-5">
          <div className="flex justify-between max-w-7xl w-full m-auto items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">מלונות</span>
            </div>
            <div className="flex justify-start gap-2">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 py-5 px-7"
              >
                התחברות
              </Button>
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
        <footer className="flex gap-6 w-full py-12 justify-center items-center flex-row-reverse text-sm">
          <p>@ Copyright 2025 Hotels Inc.</p>
          <p className="cursor-default">|</p>
          <p className="cursor-pointer">Terms and Conditions</p>
          <p className="cursor-default">|</p>
          <p className="cursor-pointer">Privacy Policy</p>
          <p>|</p> <p className="cursor-pointer">Hotels</p>
        </footer>
      </motion.div>
    </div>
  );
}
