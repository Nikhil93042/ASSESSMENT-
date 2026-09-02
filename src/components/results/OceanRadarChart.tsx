import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { OceanScores } from '../../types/assessment';

interface Props {
  scores: OceanScores;
}

export const OceanRadarChart: React.FC<Props> = ({ scores }) => {
  const data = [
    { trait: 'Openness', score: scores.O, fullMark: 100 },
    { trait: 'Conscientiousness', score: scores.C, fullMark: 100 },
    { trait: 'Extraversion', score: scores.E, fullMark: 100 },
    { trait: 'Agreeableness', score: scores.A, fullMark: 100 },
    { trait: 'Emotional Stability', score: scores.N, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[320px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="trait" 
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 10 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#F8FAFC' }}
            formatter={(value: any) => [`${value}%`, 'Score']}
          />
          <Radar 
            name="Personality Score" 
            dataKey="score" 
            stroke="#8B5CF6" 
            fill="#8B5CF6" 
            fillOpacity={0.45} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
