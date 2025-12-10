'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterventionForm } from '@/components/advisor/InterventionForm';
import { SkillRadarChart } from '@/components/student/SkillRadarChart';
import { ProgressTracker } from '@/components/student/ProgressTracker';
import { useStudent, useStudentEnrollments, useStudentGrades, useStudentLMSActivity } from '@/lib/hooks/useStudents';
import { useInterventions } from '@/lib/hooks/useInterventions';
import { useStudentSkills } from '@/lib/hooks/useOpportunities';
import { ArrowLeft, Mail, Phone, Calendar, TrendingUp, TrendingDown, BookOpen, Activity } from 'lucide-react';

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const studentId = parseInt(id);

  // Fetch student data
  const { data: student, isLoading: isLoadingStudent } = useStudent(studentId);
  const { data: enrollments = [] } = useStudentEnrollments(studentId);
  const { data: grades = [] } = useStudentGrades(studentId);
  const { data: lmsActivity = [] } = useStudentLMSActivity(studentId, 30);
  const { data: interventions = [] } = useInterventions(studentId);
  const { data: studentSkills = [] } = useStudentSkills(studentId);

  if (isLoadingStudent) {
    return (
      <ProtectedRoute requiredRole="advisor">
        <DashboardLayout role="advisor" userName="Dr. Smith" userEmail="advisor1@test.edu">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-center h-64">
              <p>Loading student data...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!student) {
    return (
      <ProtectedRoute requiredRole="advisor">
        <DashboardLayout role="advisor" userName="Dr. Smith" userEmail="advisor1@test.edu">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-center h-64">
              <p>Student not found</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const initials = `${student.first_name?.[0] ?? ''}${student.last_name?.[0] ?? ''}`;
  const persistenceScore = student.persistence_score ?? 0;
  const gpa = student.gpa ?? 0;

  const getRiskLevel = () => {
    if (persistenceScore < 50) return { label: 'High Risk', color: 'bg-red-600' };
    if (persistenceScore < 70) return { label: 'At Risk', color: 'bg-amber-500' };
    return { label: 'On Track', color: 'bg-green-600' };
  };

  const riskLevel = getRiskLevel();

  // Calculate LMS activity summary
  const totalLogins = lmsActivity.filter((a) => a.activity_type === 'login').length;
  const totalAssignments = lmsActivity.filter((a) => a.activity_type === 'assignment_submit').length;

  return (
    <ProtectedRoute requiredRole="advisor">
      <DashboardLayout role="advisor" userName="Dr. Smith" userEmail="advisor1@test.edu">
        <div className="container mx-auto px-6 py-6">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-lg">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-blue-600 text-white text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">
                  {student.first_name} {student.last_name}
                </h1>
                <p className="text-muted-foreground">{student.email}</p>
                <p className="text-muted-foreground">{student.major ?? 'No major declared'}</p>
                <div className="flex gap-2 mt-3">
                  <Badge className={riskLevel.color}>{riskLevel.label}</Badge>
                  <Badge variant="outline">GPA: {gpa.toFixed(2)}</Badge>
                  <Badge variant="outline">
                    Persistence: {persistenceScore}%
                  </Badge>
                  <Badge variant="outline">
                    Credits: {student.credits_earned ?? 0}/{student.total_credits_required ?? 120}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Persistence Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{persistenceScore}%</span>
                    {persistenceScore < 70 ? (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Career Readiness</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{student.career_readiness_score ?? 0}%</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    LMS Activity (30 days)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Logins:</span>
                    <span className="font-medium">{totalLogins}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Assignments:</span>
                    <span className="font-medium">{totalAssignments}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                  <TabsTrigger value="interventions">Interventions</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <ProgressTracker student={student} />
                </TabsContent>

                <TabsContent value="enrollments" className="space-y-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {enrollments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No enrollments found</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {enrollments.map((enrollment) => (
                            <div key={enrollment.enrollment_id} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">
                                    {enrollment.course?.course_name ?? 'Unknown Course'}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {enrollment.course?.course_code} • {enrollment.semester}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge
                                    variant={enrollment.status === 'completed' ? 'default' : 'outline'}
                                    className={enrollment.status === 'completed' ? 'bg-green-600' : ''}
                                  >
                                    {enrollment.status}
                                  </Badge>
                                  {enrollment.grade && (
                                    <p className="text-sm font-semibold mt-1">Grade: {enrollment.grade}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="interventions" className="space-y-3">
                  <InterventionForm
                    studentId={studentId}
                    studentName={`${student.first_name} ${student.last_name}`}
                    advisorId="advisor-1"
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Intervention History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {interventions.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">No interventions yet</p>
                      ) : (
                        <div className="space-y-3">
                          {interventions.map((intervention) => (
                            <div key={intervention.intervention_id} className="p-3 border rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <Badge variant="outline" className="mb-2">
                                    {intervention.intervention_type}
                                  </Badge>
                                  {intervention.subject && (
                                    <p className="font-medium">{intervention.subject}</p>
                                  )}
                                  <p className="text-sm text-muted-foreground">{intervention.message}</p>
                                </div>
                                <Badge
                                  className={
                                    intervention.status === 'completed'
                                      ? 'bg-green-600'
                                      : intervention.status === 'sent'
                                        ? 'bg-blue-600'
                                        : ''
                                  }
                                >
                                  {intervention.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-3">
                  <SkillRadarChart skills={studentSkills} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
