import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import type { RepetitionData } from '../../types/exercise';
import { Activity, Clock, Award } from 'lucide-react';

interface SessionChartsProps {
  repHistory: RepetitionData[];
}

export const SessionCharts: React.FC<SessionChartsProps> = ({ repHistory }) => {
  if (!repHistory || repHistory.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-mono">No repetition telemetry recorded yet. Perform reps to populate charts.</p>
      </div>
    );
  }

  const chartData = repHistory.map((r) => ({
    rep: `Rep ${r.repNumber}`,
    score: r.score,
    rom: r.romCompleteness,
    concentric: r.concentricTime,
    eccentric: r.eccentricTime
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Form Score Quality Over Reps */}
      <div className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs uppercase font-mono font-bold text-cyan-400">FORM SCORE VS REPETITIONS</h4>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="rep" stroke="#64748b" fontSize={11} />
              <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#00f6ff' }}
              />
              <Line type="monotone" dataKey="score" stroke="#00f6ff" strokeWidth={3} dot={{ fill: '#00f6ff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Rep Tempo Dynamics (Concentric vs Eccentric) */}
      <div className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs uppercase font-mono font-bold text-emerald-400">REP TEMPO DYNAMICS (SEC)</h4>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="rep" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="concentric" name="Concentric (Up)" fill="#05ffa1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="eccentric" name="Eccentric (Down)" fill="#00f6ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
