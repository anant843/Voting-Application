import { useEffect, useState } from 'react';
import { Shield, Server, Globe, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface SystemStats {
  totalVoters: number;
  activeElection: string;
  serverStatus: string;
  region: string;
}

export default function SystemStatus() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch backend stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-7xl mx-auto px-4 mb-12">
      <Card className="bg-white/50 backdrop-blur-sm border-slate-100">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Server className="h-3 w-3" />
            Backend Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="text-lg font-bold text-green-600 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            {stats?.serverStatus || 'Online'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border-slate-100">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Globe className="h-3 w-3" />
            Region
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="text-lg font-bold text-slate-700">
            {stats?.region || 'India'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border-slate-100">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Activity className="h-3 w-3" />
            Active Election
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="text-lg font-bold text-orange-600 truncate">
            {stats?.activeElection || 'General 2026'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 backdrop-blur-sm border-slate-100">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="text-lg font-bold text-blue-600">AES-256</div>
        </CardContent>
      </Card>
    </div>
  );
}