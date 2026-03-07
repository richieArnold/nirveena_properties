import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MailOpen, Clock, AlertCircle } from 'lucide-react';

const LeadsCard = ({ title, count, icon, color, link, subtitle }) => {
  const navigate = useNavigate();
  
  const colors = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
  };

  return (
    <div 
      onClick={() => navigate(link)}
      className={`
        bg-gradient-to-br ${colors[color]} 
        rounded-2xl p-6 text-white 
        shadow-lg cursor-pointer
        transform hover:-translate-y-1 
        transition-all duration-300
        relative overflow-hidden group
      `}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="80" cy="20" r="40" />
          <circle cx="20" cy="80" r="30" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl opacity-90">{icon}</div>
          <span className="text-3xl font-bold">{count}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
      </div>
    </div>
  );
};

export default LeadsCard;