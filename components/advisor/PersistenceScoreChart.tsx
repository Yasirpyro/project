'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Student } from '@/types/database';

interface PersistenceScoreChartProps {
  students?: Student[];
}

export function PersistenceScoreChart({ students = [] }: PersistenceScoreChartProps) {
  // Group students by persistence score ranges
  const scoreRanges = [
    { range: '0-30', min: 0, max: 30, count: 0, color: '#EF4444' },
    { range: '31-50', min: 31, max: 50, count: 0, color: '#F59E0B' },
    { range: '51-70', min: 51, max: 70, count: 0, color: '#F59E0B' },
    { range: '71-85', min: 71, max: 85, count: 0, color: '#3B82F6' },
    { range: '86-100', min: 86, max: 100, count: 0, color: '#10B981' },
  ];

  students.forEach((student) => {
    const score = student.persistence_score ?? 0;
    const range = scoreRanges.find((r) => score >= r.min && score <= r.max);
    if (range) {
      range.count++;
    }
  });

  const chartData = scoreRanges.map((r) => ({
    name: r.range,
    students: r.count,
    fill: r.color,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Persistence Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ value: 'Persistence Score Range', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{payload[0].payload.name}% Range</p>
                      <p className="text-sm text-muted-foreground">
                        {payload[0].value} student{payload[0].value !== 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="students" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span className="text-sm">High Risk (0-50)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm">At Risk (51-70)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-sm">Moderate (71-85)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-sm">Safe (86-100)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
