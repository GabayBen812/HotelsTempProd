import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { value: "40%", label: "עלייה ביעילות התפעולית" },
    { value: "60%", label: "פתרון תקלות מהיר יותר" },
    { value: "95%", label: "ציון שביעות רצון אורחים" },
    { value: "25%", label: "הפחתה בעלויות תפעול" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center text-white"
            >
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
