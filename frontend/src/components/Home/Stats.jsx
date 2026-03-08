import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const StatsItem = ({ endValue, label = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

const animateCount = (timestamp) => {
  if (!startTime) startTime = timestamp;
  const elapsedTime = timestamp - startTime;
  const progress = Math.min(elapsedTime / (duration * 1000), 1);

  // Rating like "4.9/5"
  if (endValue.includes("/") && endValue !== "24/7") {
    const [numerator] = endValue.split("/");
    const numericValue = parseFloat(numerator);
    setCount(progress * numericValue);
  }
  // Percentage
  else if (endValue.includes("%")) {
    const numericValue = parseFloat(endValue);
    setCount(progress * numericValue);
  }
  // Plus values
  else if (endValue.includes("+")) {
    const numericValue = parseInt(endValue);
    setCount(progress * numericValue);
  }

  if (progress < 1) {
    animationFrame = requestAnimationFrame(animateCount);
  }
};

    animationFrame = requestAnimationFrame(animateCount);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, endValue, duration]);

const formatCount = () => {
  if (endValue === "24/7") {
    return "24/7";
  }

  if (endValue.includes("/") && endValue !== "24/7") {
    const [, denominator] = endValue.split("/");
    return `${count.toFixed(1)}/${denominator}`;
  }

  if (endValue.includes("%")) {
    return `${Math.round(count)}%`;
  }

  if (endValue.includes("+")) {
    return `${Math.round(count)}+`;
  }

  return Math.round(count);
};

  return (
    <motion.div
      ref={ref}
      className="text-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {formatCount()}
      </div>
      <div className="text-gray-600 text-sm font-medium">{label}</div>
    </motion.div>
  );
};

const Stats = () => {
  const stats = [
    { value: "500+", label: "Happy Clients", duration: 1.5 },
    { value: "99%", label: "Satisfaction Rate", duration: 2 },
    { value: "4.9/5", label: "Average Rating", duration: 1.8 },
    { value: "24/7", label: "Support Available", duration: 1 },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section ref={sectionRef} className="pt-12 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6"
          >
            <span className="text-sm font-bold uppercase tracking-widest">
              Our Achievements
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
          >
            Numbers That Speak
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Trusted by thousands of clients who found their perfect properties with us
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 pt-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <StatsItem
                  endValue={stat.value}
                  label={stat.label}
                  duration={stat.duration}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;