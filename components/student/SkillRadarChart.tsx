'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Lightbulb } from 'lucide-react';
import type { StudentSkill } from '@/types/database';

interface SkillRadarChartProps {
  skills?: StudentSkill[];
  targetSkills?: { name: string; level: number }[];
  title?: string;
}

export function SkillRadarChart({
  skills = [],
  targetSkills = [],
  title = 'Skill Gap Analysis',
}: SkillRadarChartProps) {
  // Convert proficiency levels to numeric scores
  const proficiencyToScore = (level?: string) => {
    switch (level) {
      case 'Advanced':
        return 90;
      case 'Intermediate':
        return 60;
      case 'Beginner':
        return 30;
      default:
        return 0;
    }
  };

  // Group skills by category and calculate average scores
  const skillsByCategory: { [key: string]: number[] } = {};
  skills.forEach((ss) => {
    const category = ss.skill?.category ?? 'Other';
    if (!skillsByCategory[category]) {
      skillsByCategory[category] = [];
    }
    skillsByCategory[category].push(proficiencyToScore(ss.proficiency_level));
  });

  // Calculate average scores per category
  const categoryAverages = Object.entries(skillsByCategory).map(([category, scores]) => ({
    category,
    student: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    target: 80, // Default target
  }));

  // Add any target skills that aren't in student's skills
  targetSkills.forEach((target) => {
    if (!categoryAverages.find((ca) => ca.category === target.name)) {
      categoryAverages.push({
        category: target.name,
        student: 0,
        target: target.level,
      });
    }
  });

  // Prepare data for radar chart
  const chartData = categoryAverages.map((ca) => ({
    skill: ca.category,
    student: ca.student,
    target: ca.target,
  }));

  // Calculate gaps
  const skillGaps = chartData
    .filter((d) => d.student < d.target)
    .sort((a, b) => b.target - b.student - (a.target - a.student));

  const topGap = skillGaps[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Your Skills"
              dataKey="student"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
            <Radar
              name="Target Level"
              dataKey="target"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.3}
            />
            <Legend />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold mb-1">{payload[0].payload.skill}</p>
                      <p className="text-sm text-blue-600">Your Level: {payload[0].value}%</p>
                      <p className="text-sm text-red-600">Target: {payload[1]?.value}%</p>
                      {payload[0].value < payload[1]?.value && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Gap: {payload[1]?.value - payload[0].value}%
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {topGap && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm mb-1">AI Insight</p>
                <p className="text-sm text-muted-foreground">
                  Focus on improving your <strong>{topGap.skill}</strong> skills. You're currently at{' '}
                  {topGap.student}% but need to reach {topGap.target}% for your target role. Consider
                  taking relevant courses or working on practical projects.
                </p>
              </div>
            </div>
          </div>
        )}

        {skillGaps.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Top Skill Gaps:</h4>
            <div className="flex flex-wrap gap-2">
              {skillGaps.slice(0, 5).map((gap, index) => (
                <Badge key={index} variant="outline" className="border-amber-500 text-amber-600">
                  {gap.skill} ({gap.target - gap.student}% gap)
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
