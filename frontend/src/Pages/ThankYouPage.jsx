import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Clock } from "lucide-react";
import { useEffect, useState } from "react";

/* ---------------- CONFETTI ---------------- */
const Confetti = () => {
  const [particles] = useState(() => {
    const colors = ["#22c55e", "#3b82f6", "#eab308", "#ec4899"];
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
};

/* ---------------- MAIN ---------------- */
export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);

  const projectName = location.state?.projectName || "your selected property";

/* 🔥 GOOGLE TAG INTEGRATION */
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.async = true;
    // Use the AW ID as the primary source
    script1.src = "https://www.googletagmanager.com/gtag/js?id=AW-18035172859";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      // Track Google Ads
      gtag('config', 'AW-18035172859');
      // Track Analytics (The one from your screenshot)
      gtag('config', 'G-94YL10VYV6');
      
      // 🔥 ADD THIS: Manual Conversion Event for Google Ads
      gtag('event', 'conversion', {'send_to': 'AW-18035172859/CONVERSION_LABEL'});
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  /* 🔥 Auto redirect */
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(-1);
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  /* 🔥 Countdown */
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <Confetti />

      {/* Glow background */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-50" />

      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
        {/* LOGO */}
        <div className="mb-6 flex justify-center">
          <img
            src="/NirveenaLogo.jpeg"
            alt="Nirveena"
            className="h-12 object-contain"
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-50 p-4 rounded-2xl animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          Thank You! 🎉
        </h1>

        {/* Description */}
        <p className="text-slate-600 text-lg mb-6 leading-relaxed">
          Your enquiry for{" "}
          <span className="font-semibold text-black">{projectName}</span> has
          been successfully submitted.
        </p>

        {/* Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-6">
          <Clock className="w-4 h-4" />
          Our team will contact you within 1 hour
        </div>

        {/* Countdown */}
        <p className="text-sm text-slate-500 mb-8">
          Redirecting back in{" "}
          <span className="font-bold text-black">{countdown}</span> seconds...
        </p>

        {/* Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-medium hover:scale-105 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back Now
        </button>

        {/* Footer */}
        <div className="mt-10 text-xs text-slate-400">
          Nirveena Properties • Premium Living • Trusted Investment
        </div>
      </div>
    </div>
  );
}