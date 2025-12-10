'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AtRiskStudentsList } from '@/components/advisor/AtRiskStudentsList';
import { PersistenceScoreChart } from '@/components/advisor/PersistenceScoreChart';
import { StudentBriefModal } from '@/components/advisor/StudentBriefModal';
import { InterventionForm } from '@/components/advisor/InterventionForm';
import { useStudents } from '@/lib/hooks/useStudents';
import { useInterventions } from '@/lib/hooks/useInterventions';
import { Users, AlertTriangle, AlertCircle, Trophy, Bell, MessageSquare, Calendar, Activity } from 'lucide-react';
import type { Student, StudentWithRelations } from '@/types/database';

// Mock activities for now
const mockActivities = [
  {
    id: '1',
    message: 'AI sent SMS nudge to student about tutoring',
    timestamp: '5 min ago',
    type: 'nudge',
  },
  {
    id: '2',
    message: 'Student booked advising session',
    timestamp: '12 min ago',
    type: 'booking',
  },
  {
    id: '3',
    message: 'System detected drop in student attendance',
    timestamp: '28 min ago',
    type: 'alert',
  },
];

export default function AdvisorDashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentWithRelations | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showInterventionForm, setShowInterventionForm] = useState(false);

  // Fetch students data
  const { data: students = [], isLoading: isLoadingStudents } = useStudents();

  // Calculate statistics
  const totalStudents = students.length;
  const atRiskCount = students.filter((s) => (s.persistence_score ?? 100) >= 50 && (s.persistence_score ?? 100) < 70).length;
  const highRiskCount = students.filter((s) => (s.persistence_score ?? 100) < 50).length;
  const safeCount = students.filter((s) => (s.persistence_score ?? 100) >= 70).length;
  const resolvedCount = 12; // This could come from interventions data

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student as StudentWithRelations);
    setShowStudentModal(true);
  };

  const handleSendIntervention = (student: Student, type: string) => {
    setSelectedStudent(student as StudentWithRelations);
    setShowInterventionForm(true);
  };

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
    <ProtectedRoute requiredRole="advisor">
      <DashboardLayout role="advisor" userName="Dr. Smith" userEmail="advisor1@test.edu">
        <div className="container mx-auto px-6 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Advisor Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor student progress and manage interventions with AI-powered insights
            </p>
          </div>

          {/* Stats Cards */}
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

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <PersistenceScoreChart students={students} />
            <AtRiskStudentsList
              students={students}
              onSelectStudent={handleSelectStudent}
              onSendIntervention={handleSendIntervention}
            />
          </div>

          {/* Recent Activity */}
          <Card>
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
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        {selectedStudent && (
          <>
            <StudentBriefModal
              student={selectedStudent}
              open={showStudentModal}
              onOpenChange={setShowStudentModal}
              onSendIntervention={(type) => {
                setShowStudentModal(false);
                setShowInterventionForm(true);
              }}
            />

            {showInterventionForm && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                  <InterventionForm
                    studentId={selectedStudent.student_id}
                    studentName={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
                    advisorId="advisor-1"
                    onSuccess={() => setShowInterventionForm(false)}
                  />
                  <button
                    onClick={() => setShowInterventionForm(false)}
                    className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
