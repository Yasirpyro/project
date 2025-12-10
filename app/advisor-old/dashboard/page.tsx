'use client';

import { Navigation } from '@/components/navigation';
import { StatCard } from '@/components/stat-card';
import { StudentTable } from '@/components/advisor/student-table';
import { StudentDetailPanel } from '@/components/advisor/student-detail-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStudents, mockActivities } from '@/lib/mock-data';
import { Users, AlertTriangle, AlertCircle, Trophy, Bell, MessageSquare, Calendar, Activity } from 'lucide-react';
import { useStudentStore } from '@/stores/use-student-store';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function AdvisorDashboard() {
  const { selectedStudent } = useStudentStore();

  const totalStudents = mockStudents.length;
  const atRiskCount = mockStudents.filter((s) => s.riskLevel === 'at-risk').length;
  const highRiskCount = mockStudents.filter((s) => s.riskLevel === 'high-risk').length;
  const safeCount = mockStudents.filter((s) => s.riskLevel === 'safe').length;
  const resolvedCount = 12;

  const riskDistributionData = [
    { name: 'Safe', value: safeCount, color: '#10B981' },
    { name: 'At Risk', value: atRiskCount, color: '#F59E0B' },
    { name: 'High Risk', value: highRiskCount, color: '#EF4444' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'nudge':
        return <MessageSquare className="w-4 h-4" />;
      case 'booking':
        return <Calendar className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'alert':
        return <Bell className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="advisor" />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Advisor Dashboard</h1>
          <p className="text-muted-foreground">Monitor student progress and manage interventions with AI-powered insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Students" value={totalStudents} icon={Users} color="bg-blue-600" />
          <StatCard
            title="At-Risk Students"
            value={atRiskCount}
            icon={AlertTriangle}
            color="bg-amber-500"
            badge={<Badge className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100">{atRiskCount}</Badge>}
          />
          <StatCard
            title="High-Risk Students"
            value={highRiskCount}
            icon={AlertCircle}
            color="bg-red-600"
            badge={<Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100">{highRiskCount}</Badge>}
          />
          <StatCard
            title="Recent Wins"
            value={resolvedCount}
            icon={Trophy}
            color="bg-green-600"
            trend={{ value: 15, direction: 'up' }}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Caseload</CardTitle>
              </CardHeader>
              <CardContent>
                <StudentTable students={mockStudents} />
              </CardContent>
            </Card>
          </div>

          <div>
            <StudentDetailPanel student={selectedStudent} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {riskDistributionData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Badge variant="outline">Live</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full text-sm text-blue-600 hover:underline mt-4 font-medium">View All Activity</button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
