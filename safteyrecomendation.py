import React from 'react';
import { Recommendation } from '../types/env';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

interface RecsProps {
  recommendations: Recommendation[];
}

export const SafetyRecommendations: React.FC<RecsProps> = ({ recommendations }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-800">Health & Safety Precautions</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
              rec.severity === 'high'
                ? 'bg-rose-50/80 border-rose-100 text-rose-900'
                : rec.severity === 'medium'
                ? 'bg-amber-50/80 border-amber-100 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-100 text-emerald-900'
            }`}
          >
            {rec.severity === 'high' ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium leading-relaxed">{rec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
