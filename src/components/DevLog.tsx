import { useEffect, useState } from 'react';
import { subscribeDevLog } from '@/lib/devLogger';

const DevLog = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeDevLog(msg => {
      setLogs(prev => [...prev, msg]);
    });
    return unsubscribe;
  }, []);

  if (!import.meta.env.DEV || logs.length === 0) return null;

  return (
    <div className="bg-white text-black p-4 space-y-2 border border-gray-300 mt-4">
      {logs.map((log, i) => (
        <pre key={i} className="whitespace-pre-wrap text-xs">{log}</pre>
      ))}
    </div>
  );
};

export default DevLog;
