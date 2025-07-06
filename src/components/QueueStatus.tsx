
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { geminiService } from '@/services/geminiService';

interface QueueStatusProps {
  isVisible: boolean;
}

const QueueStatus = ({ isVisible }: QueueStatusProps) => {
  const [status, setStatus] = useState({
    queueLength: 12,
    position: 8,
    estimatedWaitTime: 45000 // 45 seconds
  });

  useEffect(() => {
    if (!isVisible) return;

    const updateStatus = () => {
      // Simulation of realistic queue
      setStatus(prev => ({
        queueLength: Math.max(1, prev.queueLength - Math.floor(Math.random() * 2)),
        position: Math.max(1, prev.position - Math.floor(Math.random() * 2)),
        estimatedWaitTime: Math.max(5000, prev.estimatedWaitTime - 2000)
      }));
    };

    const interval = setInterval(updateStatus, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const progressValue = Math.max(0, 100 - (status.position / status.queueLength) * 100);
  const usage = geminiService.getDailyUsage();

  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">Service temporarily saturated</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-amber-700">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Position: {status.position}/{status.queueLength}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>~{formatTime(status.estimatedWaitTime)}</span>
            </div>
          </div>
        </div>

        <Progress value={progressValue} className="h-3 mb-4" />

        <div className="text-sm text-amber-700 space-y-2">
          <p>📊 <strong>Daily quota reached:</strong> {usage.used}/{usage.limit} requests used</p>
          <p>⏳ Your request will be processed automatically as soon as possible</p>
          <p>🔄 The quota renews every day at midnight UTC</p>
          <div className="mt-3 p-3 bg-white/50 rounded-lg">
            <p className="text-xs text-amber-600">
              💡 <strong>Tip:</strong> Come back in a few hours or tomorrow for immediate analysis
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueueStatus;
