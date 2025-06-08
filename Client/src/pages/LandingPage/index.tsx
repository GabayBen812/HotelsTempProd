import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Statistics from "@/components/landing/Statistics";
import AiFeatures from "@/components/landing/AiFeatures";
import EfficiencyBenefits from "@/components/landing/EfficiencyBenefits";
import WorkerManagement from "@/components/landing/WorkerManagement";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <EfficiencyBenefits />
        <WorkerManagement />
        <AiFeatures />
        <Statistics />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
