'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock, GraduationCap } from 'lucide-react';
import type { Student } from '@/types/database';

interface ProgressTrackerProps {
  student?: Student;
  milestones?: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  credits: number;
  status: 'completed' | 'in-progress' | 'upcoming';
}

const defaultMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Freshman Year Complete',
    description: 'Complete general education requirements',
    credits: 30,
    status: 'completed',
  },
  {
    id: '2',
    title: 'Sophomore Year Complete',
    description: 'Declare major and complete prerequisites',
    credits: 60,
    status: 'completed',
  },
  {
    id: '3',
    title: 'Junior Year Complete',
    description: 'Complete core major courses',
    credits: 90,
    status: 'in-progress',
  },
  {
    id: '4',
    title: 'Senior Year Complete',
    description: 'Complete capstone and electives',
    credits: 120,
    status: 'upcoming',
  },
];

export function ProgressTracker({ student, milestones = defaultMilestones }: ProgressTrackerProps) {
  const creditsEarned = student?.credits_earned ?? 0;
  const totalCredits = student?.total_credits_required ?? 120;
  const progressPercentage = (creditsEarned / totalCredits) * 100;

  const getStatusIcon = (status: string, isActive: boolean) => {
    if (status === 'completed') {
      return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    }
    if (status === 'in-progress') {
      return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
    }
    return <Circle className="w-6 h-6 text-muted-foreground" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-600';
    if (status === 'in-progress') return 'bg-blue-600';
    return 'bg-muted-foreground';
  };

  // Determine current milestone based on credits
  const getCurrentMilestone = () => {
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (creditsEarned >= milestones[i].credits) {
        return i;
      }
    }
    return 0;
  };

  const currentMilestoneIndex = getCurrentMilestone();

  // Calculate expected graduation date
  const getExpectedGraduation = () => {
    if (student?.expected_graduation) {
      return new Date(student.expected_graduation).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }
    return 'Not set';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Degree Progress</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Track your journey to graduation</p>
          </div>
          <GraduationCap className="w-6 h-6 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold">
              {creditsEarned} / {totalCredits} credits
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            {progressPercentage.toFixed(0)}% complete • {totalCredits - creditsEarned} credits
            remaining
          </p>
        </div>

        {/* Expected Graduation */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Expected Graduation</span>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {getExpectedGraduation()}
          </Badge>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Academic Milestones</h4>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-muted" />

            {milestones.map((milestone, index) => {
              const isCompleted = milestone.status === 'completed';
              const isInProgress = milestone.status === 'in-progress';
              const isCurrent = index === currentMilestoneIndex;

              return (
                <div key={milestone.id} className="relative pl-10 pb-6 last:pb-0">
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-0 z-10 bg-background">
                    {getStatusIcon(milestone.status, isCurrent)}
                  </div>

                  {/* Milestone Content */}
                  <div
                    className={`p-4 rounded-lg border transition-all ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                        : 'border-muted bg-muted/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold">{milestone.title}</h5>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                      <Badge
                        variant={isCompleted ? 'default' : 'outline'}
                        className={isCompleted ? getStatusColor(milestone.status) : ''}
                      >
                        {milestone.status === 'completed'
                          ? 'Complete'
                          : milestone.status === 'in-progress'
                            ? 'In Progress'
                            : 'Upcoming'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Credits Required:</span>
                      <span className="font-medium">{milestone.credits}</span>
                      {isInProgress && (
                        <span className="text-blue-600 text-xs">
                          ({milestone.credits - creditsEarned} more needed)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        {progressPercentage < 100 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg">
            <h5 className="font-semibold text-sm mb-2">Next Steps</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Complete {totalCredits - creditsEarned} more credits to graduate</li>
              <li>• Focus on required courses for your major</li>
              <li>• Meet with your advisor to plan upcoming semesters</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
