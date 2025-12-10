'use client';

import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProgressTracker } from '@/components/student/ProgressTracker';
import { SkillRadarChart } from '@/components/student/SkillRadarChart';
import { CareerPathwayFlow } from '@/components/student/CareerPathwayFlow';
import { OpportunityCard } from '@/components/student/opportunity-card';
import { useOpportunityMatches, useCareerPaths, useStudentSkills } from '@/lib/hooks/useOpportunities';
import { Target, TrendingUp, BookOpen, Briefcase } from 'lucide-react';

// Mock student data - in real app, this would come from auth context
const mockStudent = {
  student_id: 1,
  user_id: 'user-1',
  first_name: 'Jordan',
  last_name: 'Smith',
  email: 'student1@test.edu',
  major: 'Computer Science',
  credits_earned: 90,
  total_credits_required: 120,
  gpa: 3.5,
  persistence_score: 85,
  career_readiness_score: 78,
  expected_graduation: '2025-05-15',
};

export default function StudentDashboardPage() {
  // Fetch data using hooks
  const { data: opportunityMatches = [] } = useOpportunityMatches(mockStudent.student_id);
  const { data: careerPaths = [] } = useCareerPaths();
  const { data: studentSkills = [] } = useStudentSkills(mockStudent.student_id);

  const progressPercentage = (mockStudent.credits_earned / mockStudent.total_credits_required) * 100;

  // Get top 3 opportunity matches
  const topOpportunities = opportunityMatches.slice(0, 3);

  return (
    <ProtectedRoute requiredRole="student">
      <DashboardLayout
        role="student"
        userName={`${mockStudent.first_name} ${mockStudent.last_name}`}
        userEmail={mockStudent.email}
      >
        <div className="container mx-auto px-6 py-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg p-8">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {mockStudent.first_name}!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Track your progress and discover opportunities aligned with your skills
              </p>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Credits Progress</span>
                      <span className="text-sm font-bold">
                        {mockStudent.credits_earned}/{mockStudent.total_credits_required}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {(100 - progressPercentage).toFixed(0)}% remaining to graduation
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Career Readiness</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-600">
                        {mockStudent.career_readiness_score}%
                      </span>
                      <Badge className="bg-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Good
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Skills Acquired</span>
                    </div>
                    <div className="text-3xl font-bold">{studentSkills.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {studentSkills.filter((s) => s.proficiency_level === 'Advanced').length} advanced
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Progress Tracker */}
            <ProgressTracker student={mockStudent} />

            {/* Skills Radar Chart */}
            <SkillRadarChart skills={studentSkills} />
          </div>

          {/* Career Pathway Flow */}
          <div className="mb-6">
            <CareerPathwayFlow careerPaths={careerPaths} currentMajor={mockStudent.major} />
          </div>

          {/* Top Opportunities */}
          {topOpportunities.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Top Matched Opportunities</h2>
                  <p className="text-sm text-muted-foreground">
                    Based on your skills and career goals
                  </p>
                </div>
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topOpportunities.map((match) => {
                  if (!match.opportunity) return null;

                  // Convert database opportunity to component format
                  const opportunity = {
                    id: match.opportunity.opportunity_id.toString(),
                    company: match.opportunity.company_name,
                    title: match.opportunity.title,
                    matchPercentage: match.match_score,
                    requiredSkills: match.opportunity.required_skills
                      ? JSON.parse(match.opportunity.required_skills)
                      : [],
                    skillGaps: match.skill_gaps ? JSON.parse(match.skill_gaps) : [],
                    salary: match.opportunity.salary_range ?? 'Not specified',
                    location: match.opportunity.location ?? 'Remote',
                    deadline: match.opportunity.deadline ?? 'Rolling',
                  };

                  return <OpportunityCard key={match.match_id} opportunity={opportunity} />;
                })}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
