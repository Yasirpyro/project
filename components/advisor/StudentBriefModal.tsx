'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Target,
  MessageSquare,
} from 'lucide-react';
import type { StudentWithRelations } from '@/types/database';

interface StudentBriefModalProps {
  student?: StudentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendIntervention?: (type: string) => void;
}

export function StudentBriefModal({
  student,
  open,
  onOpenChange,
  onSendIntervention,
}: StudentBriefModalProps) {
  if (!student) return null;

  const initials = `${student.first_name?.[0] ?? ''}${student.last_name?.[0] ?? ''}`;
  const persistenceScore = student.persistence_score ?? 0;
  const gpa = student.gpa ?? 0;

  const getRiskLevel = () => {
    if (persistenceScore < 50) return { label: 'High Risk', color: 'bg-red-600' };
    if (persistenceScore < 70) return { label: 'At Risk', color: 'bg-amber-500' };
    return { label: 'On Track', color: 'bg-green-600' };
  };

  const riskLevel = getRiskLevel();

  // AI-generated summary
  const aiSummary = `${student.first_name} ${student.last_name} is showing ${
    persistenceScore < 70 ? 'concerning' : 'positive'
  } academic patterns with a persistence score of ${persistenceScore}%. ${
    gpa < 2.5
      ? 'Their GPA is below the recommended threshold, suggesting need for immediate intervention.'
      : 'Their GPA indicates satisfactory academic performance.'
  } ${
    (student.enrollments?.length ?? 0) > 0
      ? `Currently enrolled in ${student.enrollments?.length ?? 0} course${
          (student.enrollments?.length ?? 0) !== 1 ? 's' : ''
        }.`
      : 'No current enrollments found.'
  } Recommended action: ${persistenceScore < 50 ? 'Schedule urgent meeting' : 'Send check-in email'}.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
          <DialogDescription>Detailed overview and intervention options</DialogDescription>
        </DialogHeader>

        {/* Header Section */}
        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-600 text-white text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold">
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">{student.email}</p>
            <p className="text-sm text-muted-foreground">{student.major ?? 'No major declared'}</p>
            <div className="flex gap-2 mt-2">
              <Badge className={riskLevel.color}>{riskLevel.label}</Badge>
              <Badge variant="outline">GPA: {gpa.toFixed(2)}</Badge>
              <Badge variant="outline">
                Credits: {student.credits_earned ?? 0}/{student.total_credits_required ?? 120}
              </Badge>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI-Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{aiSummary}</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button onClick={() => onSendIntervention?.('email')} variant="outline" className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          <Button onClick={() => onSendIntervention?.('sms')} variant="outline" className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send SMS
          </Button>
          <Button onClick={() => onSendIntervention?.('meeting')} className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{student.career_readiness_score ?? 0}%</span>
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">GPA</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{gpa.toFixed(2)}</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Degree Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">
                    {Math.round(
                      ((student.credits_earned ?? 0) / (student.total_credits_required ?? 120)) * 100
                    )}
                    %
                  </span>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-3">
            {!student.enrollments || student.enrollments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No enrollments found</p>
              </div>
            ) : (
              student.enrollments.map((enrollment) => (
                <Card key={enrollment.enrollment_id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{enrollment.course?.course_name ?? 'Unknown Course'}</h4>
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
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="skills" className="space-y-3">
            {!student.student_skills || student.student_skills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No skills recorded</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {student.student_skills.map((ss) => (
                  <Badge key={ss.student_skill_id} variant="secondary" className="px-3 py-1">
                    {ss.skill?.skill_name ?? 'Unknown'} •{' '}
                    <span className="ml-1 text-xs">{ss.proficiency_level ?? 'N/A'}</span>
                  </Badge>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
