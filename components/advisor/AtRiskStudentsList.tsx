'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';
import type { Student } from '@/types/database';

interface AtRiskStudentsListProps {
  students?: Student[];
  onSelectStudent?: (student: Student) => void;
  onSendIntervention?: (student: Student, type: string) => void;
}

export function AtRiskStudentsList({
  students = [],
  onSelectStudent,
  onSendIntervention,
}: AtRiskStudentsListProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const atRiskStudents = students.filter(
    (s) => (s.persistence_score ?? 100) < 70
  );

  const getRiskLevel = (score?: number) => {
    if (!score) return 'unknown';
    if (score < 50) return 'high-risk';
    if (score < 70) return 'at-risk';
    return 'safe';
  };

  const getRiskColor = (score?: number) => {
    const level = getRiskLevel(score);
    if (level === 'high-risk') return 'bg-red-100 text-red-700 border-red-200';
    if (level === 'at-risk') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedId(student.student_id);
    onSelectStudent?.(student);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <CardTitle>At-Risk Students</CardTitle>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {atRiskStudents.length} students
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {atRiskStudents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No at-risk students at this time</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {atRiskStudents.map((student) => {
              const initials = `${student.first_name?.[0] ?? ''}${student.last_name?.[0] ?? ''}`;
              const isSelected = selectedId === student.student_id;

              return (
                <div
                  key={student.student_id}
                  className={`p-4 border rounded-lg transition-all cursor-pointer ${
                    isSelected ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'hover:bg-muted'
                  }`}
                  onClick={() => handleSelectStudent(student)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">
                          {student.first_name} {student.last_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{student.major}</p>
                      </div>
                    </div>
                    <Badge className={getRiskColor(student.persistence_score)}>
                      {student.persistence_score ?? 'N/A'}% persistence
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">GPA:</span>{' '}
                      <span className="font-medium">{student.gpa?.toFixed(2) ?? 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Credits:</span>{' '}
                      <span className="font-medium">
                        {student.credits_earned ?? 0}/{student.total_credits_required ?? 120}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendIntervention?.(student, 'email');
                      }}
                      className="flex-1"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendIntervention?.(student, 'sms');
                      }}
                      className="flex-1"
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      SMS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendIntervention?.(student, 'meeting');
                      }}
                      className="flex-1"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      Meet
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
