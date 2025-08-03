import { useEffect, useState } from "react";
import Step1 from "./components/Step1";
import { LoginSteps } from "@/types/login/login";
import Step2 from "./components/Step2";
import { useLocation } from "react-router-dom";
import { decryptData } from "@/lib/crypto-js";
import LoginFooter from "./components/LoginFooter";
import { Toaster } from "sonner";
import { motion } from "framer-motion";

function Login() {
  const [step, setStep] = useState<LoginSteps>(1);
  const location = useLocation();
  useEffect(() => {
    if (location.search) {
      const searchParams = new URLSearchParams(location.search);
      const encryptedData = searchParams.get("d");
      const data = decryptData(encryptedData || "") as {
        step: LoginSteps;
        gmail: string;
      };
      if (data && data.step) setStep(data.step);
    } else setStep(1);
  }, [location.search]);
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };
  return (
    <div className="min-h-[750px] h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full opacity-10 blur-3xl"></div>
      {/* Floating elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-20 w-6 h-6 bg-blue-500 rounded-full opacity-20"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
        className="absolute top-40 right-32 w-4 h-4 bg-cyan-500 rounded-full opacity-20"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "4s" }}
        className="absolute bottom-32 left-32 w-8 h-8 bg-purple-500 rounded-full opacity-20"
      />
      <Toaster />
      <div
        className="flex items-center justify-center w-full h-screen min-h-[750px] z-20 bg-transparent"
        data-cy="login-page"
      >
        <div className="bg-white/80 backdrop-blur-sm shadow-xl w-[38rem] p-4 border border-border/30 rounded-xl">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}

export default Login;
