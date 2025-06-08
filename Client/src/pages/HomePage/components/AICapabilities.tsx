import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  TrendingUp,
  Zap,
  BarChart3,
  Target,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AICapabilities() {
  const capabilities = [
    {
      icon: Brain,
      title: "אוטומציה חכמה",
      description: "ניתוב משימות חכם והקצאת עדיפויות לפי הקשר",
    },
    {
      icon: TrendingUp,
      title: "תובנות אסטרטגיות",
      description: "המלצות מבוססות נתונים לשיפור תפעול וזמני פתרון פניות",
    },
    {
      icon: Zap,
      title: "פעולות מהירות",
      description: "בעל יכולת ליצור ולעדכן פניות, מחלקות, ועוד",
    },
    {
      icon: BarChart3,
      title: "דיווח בזמן אמת",
      description: "לוחות נתונים בזמן אמת עם תובנות ומדדים לפעולה",
    },
    {
      icon: Target,
      title: "עוזר אישי",
      description: "לומד את בית המלון שלך, ועונה על שאלות באופן אוטומטי",
    },
    {
      icon: Shield,
      title: "ניטור פרואקטיבי",
      description: "מערכות התרעה מוקדמת לסיכונים ובעיות תאימות",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            מופעל על ידי{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              בינה מלאכותית
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            מנוע הבינה המלאכותית שלנו לומד כל הזמן מהפעילות שלך כדי לספק תובנות
            חכמות יותר, תגובות מהירות יותר וזרימות עבודה יעילות יותר
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <capability.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {capability.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Visualization - Add when more data */}

        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-3 gap-8 items-center text-white">
                <div>
                  <div className="text-4xl font-bold mb-2">99.9%</div>
                  <div className="text-purple-100">System Uptime</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">&lt;2s</div>
                  <div className="text-purple-100">Response Time</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-purple-100">AI Monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div> */}
      </div>
    </section>
  );
}
