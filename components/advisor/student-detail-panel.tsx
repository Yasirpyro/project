'use client';

import { Student } from '@/types';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  DollarSign,
  Mail,
  TrendingDown,
  TrendingUp,
  Minus,
  Lightbulb,
  Clock,
  AlertCircle,
  CheckCircle2,
  Send,
  UserCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentDetailPanelProps {
  student: Student | null;
}

export function StudentDetailPanel({ student }: StudentDetailPanelProps) {
  const { toast } = useToast();

  if (!student) {
    return (
      <Card className="h-full">
        <CardContent className="h-full flex items-center justify-center">
          <EmptyState
            title="No Student Selected"
            description="Select a student from the table to view their detailed information and AI-generated recommendations."
          />
        </CardContent>
      </Card>
    );
  }

  const loginData = [
    { day: 'Mon', logins: 3 },
    { day: 'Tue', logins: 2 },
    { day: 'Wed', logins: 4 },
    { day: 'Thu', logins: 1 },
    { day: 'Fri', logins: 5 },
    { day: 'Sat', logins: 0 },
    { day: 'Sun', logins: 2 },
  ];

  const aiRecommendations = [
    {
      priority: 'high',
      text: 'Schedule immediate meeting to discuss academic performance',
      action: 'Schedule Meeting',
    },
    {
      priority: 'high',
      text: 'Refer to STEM tutoring center for Math 101 support',
      action: 'Send Referral',
    },
    {
      priority: 'medium',
      text: 'Follow up on outstanding library fine before it escalates',
      action: 'Send Reminder',
    },
    {
      priority: 'low',
      text: 'Encourage attendance at upcoming study skills workshop',
      action: 'Send Invite',
    },
  ];

  const handleAction = (actionType: string) => {
    toast({
      title: 'Action Initiated',
      description: `${actionType} has been scheduled for ${student.name}`,
    });
  };

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-blue-600 text-white text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{student.name}</CardTitle>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {student.email}
              </span>
              <span>•</span>
              <span>ID: {student.studentId}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{student.major}</Badge>
              <Badge variant="secondary">GPA: {student.gpa.toFixed(2)}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="academic" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b h-auto p-0 bg-transparent">
            <TabsTrigger value="academic" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Academic
            </TabsTrigger>
            <TabsTrigger value="engagement" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Engagement
            </TabsTrigger>
            <TabsTrigger value="financial" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Financial
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              History
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="academic" className="mt-0 space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Current Courses</h4>
                <div className="space-y-3">
                  {student.courses.map((course, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">
                            {course.code}: {course.name}
                          </p>
                          <p className="text-sm text-muted-foreground">Last submission: {formatDate(course.lastSubmission)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={course.grade.startsWith('A') ? 'default' : course.grade.startsWith('B') ? 'secondary' : 'destructive'}>
                            {course.grade}
                          </Badge>
                          {course.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {course.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                          {course.trend === 'stable' && <Minus className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="mt-0 space-y-4">
              <div>
                <h4 className="font-semibold mb-3">LMS Login Frequency (Last 7 Days)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={loginData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-2">Total logins this week: {student.lmsLogins}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Assignment Completion Rate</span>
                    <span className="text-sm font-bold">{student.assignmentCompletion}%</span>
                  </div>
                  <Progress value={student.assignmentCompletion} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Class Attendance</span>
                    <span className="text-sm font-bold">{student.attendance}%</span>
                  </div>
                  <Progress value={student.attendance} className="h-2" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="mt-0 space-y-4">
              {student.financialHolds.length > 0 ? (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Active Financial Holds
                  </h4>
                  <div className="space-y-3">
                    {student.financialHolds.map((hold, index) => (
                      <div key={index} className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">{hold.type}</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">Due: {formatDate(hold.deadline)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-bold">{hold.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Total outstanding: ${student.financialHolds.reduce((sum, hold) => sum + hold.amount, 0).toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mb-2" />
                  <p className="font-medium">No Financial Holds</p>
                  <p className="text-sm text-muted-foreground">Student has no outstanding financial obligations</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0 space-y-3">
              <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium">AI-Generated Actionable Insights</p>
              </div>

              {aiRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {rec.priority}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm mb-2">{rec.text}</p>
                      <Button variant="outline" size="sm" onClick={() => handleAction(rec.action)}>
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="history" className="mt-0 space-y-4">
              {student.meetingNotes.length > 0 ? (
                <div className="space-y-4">
                  {student.meetingNotes.map((note, index) => (
                    <div key={index} className="relative pl-6 pb-4 border-l-2 border-muted last:border-0">
                      <div className="absolute left-0 top-0 transform -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{formatDate(note.date)}</span>
                          <span className="text-muted-foreground">with {note.advisor}</span>
                        </div>
                        <p className="font-medium">{note.topic}</p>
                        <p className="text-sm text-muted-foreground">{note.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No Meeting History"
                  description="No previous meetings recorded for this student"
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="border-t p-4 bg-muted/30">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleAction('Schedule Meeting')} className="flex-1">
            <Calendar className="mr-2 w-4 h-4" />
            Schedule Meeting
          </Button>
          <Button variant="outline" onClick={() => handleAction('Send Custom Nudge')} className="flex-1">
            <Send className="mr-2 w-4 h-4" />
            Send Nudge
          </Button>
          <Button variant="secondary" onClick={() => handleAction('Mark as Resolved')}>
            <UserCheck className="mr-2 w-4 h-4" />
            Mark Resolved
          </Button>
        </div>
      </div>
    </Card>
  );
}
