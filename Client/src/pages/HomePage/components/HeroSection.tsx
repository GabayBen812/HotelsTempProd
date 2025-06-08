import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Bot, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const statItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-28 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2"
            >
              נהל את המלון שלך עם AI 🚀
            </Badge>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                ניהול ותפעול{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  מלון חכם
                </span>{" "}
                בצורה מבוקרת ופשוטה
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                מערכת אחת שמרכזת את כל מה שהמלון צריך. מניהול צוותים ועד טיפול
                בתקלות ותקשורת עם האורחים – הכל פועל יחד בפלטפורמה חכמה אחת. עם
                בינה מלאכותית מובנית, תקבלו תובנות, אוטומציה, ושיפור בביצועים
                ובשירות.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-lg px-8 py-4 h-auto"
              >
                מצאו את התוכנית המתאימה
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
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">פניות</div>
              </motion.div>
              <motion.div className="text-center" variants={statItemVariants}>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">מתאים לכל מלון</div>
              </motion.div>
              <motion.div className="text-center" variants={statItemVariants}>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">תמיכת AI</div>
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
                className="bg-white rounded-2xl shadow-2xl p-8"
                whileHover={{ y: -10, scale: 1.02, rotate: 1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">מסך מנהל</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">
                      פניות בטיפול
                    </span>
                    <span className="text-lg font-bold text-green-600">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">
                      פניות יומיות
                    </span>
                    <span className="text-lg font-bold text-blue-600">17</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">
                      זמן ממוצע לטיפול
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      - 3 דקות
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
                className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-xl p-4 w-48"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">אפליקציית עובדים</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-yellow-50 rounded p-2">
                    <div className="text-xs font-medium text-yellow-800">
                      פניה בטיפול
                    </div>
                    <div className="text-xs text-yellow-600">
                      חדר 204 - תקלה במזגן
                    </div>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-xs font-medium text-green-800">
                      הושלם
                    </div>
                    <div className="text-xs text-green-600">
                      חדר 180 - שירות חדרים{" "}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Chat Mockup */}
              <motion.div
                className="absolute -top-8 -left-8 bg-white rounded-xl shadow-xl p-4 w-56"
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
                  <span className="text-sm font-medium">עוזר AI ללקוחות</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded-lg p-2 text-xs">
                    שלום! יש לי בעיה עם מפתח החדר שלי. תוכלו לעזור?
                  </div>
                  <div className="bg-blue-500 text-white rounded-lg p-2 text-xs ml-4">
                    פתחתי פניה ומישהו יגיע לעזור לך ממש עכשיו!
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
