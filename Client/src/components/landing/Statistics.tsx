import { useTranslation } from "react-i18next";
import { Building2, Users2, Clock, Star } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useSpring, animated } from "@react-spring/web";

function AnimatedCounter({ end }: { end: number }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { number } = useSpring({
    from: { number: 0 },
    number: inView ? end : 0,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return (
    <animated.span ref={ref}>
      {number.to((n: number) => n.toFixed(0))}
    </animated.span>
  );
}

export default function Statistics() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      value: 1,
      label: t("landing.statistics.hotels_managed"),
    },
    {
      icon: <Users2 className="w-8 h-8 text-blue-600" />,
      value: 3,
      label: t("landing.statistics.staff_members"),
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      value: 98,
      label: t("landing.statistics.response_rate"),
    },
    {
      icon: <Star className="w-8 h-8 text-blue-600" />,
      value: 4.9,
      label: t("landing.statistics.customer_rating"),
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <AnimatedCounter end={stat.value} />
                {stat.label.includes("%") ? "%" : ""}
              </div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
