import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Rocket, ShieldCheck } from "lucide-react"; // Removed ArrowLeft
import { motion } from "framer-motion";
// Removed useLanguage import

export default function CTASection() {
  // Removed language and t from useLanguage()

  const features = [
    { text: "שינויים אישיים לפי מלון", icon: Rocket },
    { text: "בלי דמי התקנה", icon: CheckCircle },
    { text: "24/7 תמיכה", icon: ShieldCheck },
    { text: "ביטול בכל עת", icon: CheckCircle },
  ];

  const cardVariants = {
    offscreen: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    offscreen: { opacity: 0, y: 20 },
    onscreen: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariants}
          className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden relative font-sans`}
        >
          {/* Decorative background elements */}
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full opacity-10 blur-2xl"></div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
            {/* Text Content */}
            <div className={`space-y-6`}>
              <motion.h2
                variants={itemVariants}
                className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              >
                מוכן לשנות את המלון שלך?
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 leading-relaxed"
              >
                צור קשר עם הצוות שלנו כדי להצטרף אלינו ולקבל שינויים אישיים רק
                למלון שלך.
              </motion.p>

              <motion.ul variants={itemVariants} className="space-y-3 pt-2">
                {features.map((feature) => (
                  <li key={feature.text} className={`flex items-center gap-3`}>
                    <feature.icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature.text}</span>
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Buttons and Disclaimer */}
            <div className={`space-y-6 flex flex-col items-start`}>
              <motion.div
                variants={itemVariants}
                className={`w-full flex flex-col gap-4 sm:flex-row md:flex-col`}
              >
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-lg px-8 py-4 h-auto font-semibold text-white shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  <motion.a
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2"
                  >
                    מצאו את התוכנית המתאימה
                    <ArrowLeft className="w-5 h-5 ml-2" />
                  </motion.a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 text-lg px-8 py-4 h-auto shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <motion.a
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    צור קשר
                  </motion.a>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
