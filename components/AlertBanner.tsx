import React from 'react';
import { InAppAlert } from '../types/env';
import { Bell, AlertOctagon } from 'lucide-react';

interface AlertsProps {
  alerts: InAppAlert[];
}

/**
 * AlertsBanner Component
 * Displays critical environmental alerts and warnings to users
 * Shows danger (red) and warning (yellow) level alerts with icons
 */
export const AlertsBanner: React.FC<AlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
            alert.type === 'danger'
              ? 'bg-rose-500 text-white border-rose-600'
              : 'bg-amber-500 text-white border-amber-600'
          }`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">{alert.title}</h4>
              <p className="text-xs opacity-90">{alert.message}</p>
            </div>
          </div>
          <Bell className="w-4 h-4 opacity-75 shrink-0" />
        </div>
      ))}
    </div>
  );
};
