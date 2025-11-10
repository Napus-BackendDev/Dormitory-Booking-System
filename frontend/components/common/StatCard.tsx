import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  gradientFrom: string;
  gradientTo: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  gradientFrom,
  gradientTo,
  trend,
}) => {
  return (
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group relative">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Decorative circle */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full -mr-20 -mt-20 opacity-10`}></div>
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg blur-sm`}></div>
        <div className="absolute inset-[2px] bg-white rounded-lg"></div>
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
        <div className={`${iconBg} p-3 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-bold text-gray-900 tabular-nums">
            <AnimatedCounter value={value} />
          </div>
          {trend && (
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
        
        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min((value / 10) * 100, 100)}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};
