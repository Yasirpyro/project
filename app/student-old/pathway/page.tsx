'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { SkillsTranscript } from '@/components/student/skills-transcript';
import { OpportunityCard } from '@/components/student/opportunity-card';
import { AlumniPathwayCard } from '@/components/student/alumni-pathway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockStudentProfile, mockJobOpportunities, mockAlumniPathways, mockRadarData } from '@/lib/mock-data';
import { ArrowRight, Target, TrendingUp, Search, Lightbulb, BookOpen } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function StudentPathwayPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlumniResults, setShowAlumniResults] = useState(false);
  const [sortBy, setSortBy] = useState('match');

  const profile = mockStudentProfile;
  const opportunities = [...mockJobOpportunities].sort((a, b) => {
    if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
    if (sortBy === 'salary') return parseInt(b.salary.replace(/[^0-9]/g, '')) - parseInt(a.salary.replace(/[^0-9]/g, ''));
    return 0;
  });

  const progressPercentage = (profile.creditsEarned / profile.totalCredits) * 100;

  const exampleQueries = [
    'English majors who work in Tech Marketing',
    'History to UX Design',
    'CS to Product Management',
    'Biology to Data Science',
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowAlumniResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation role="student" />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg p-8 mb-6">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.name}!</h1>
            <p className="text-lg text-muted-foreground mb-6">Track your progress and discover opportunities aligned with your skills</p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Credits Progress</span>
                    <span className="text-sm font-bold">
                      {profile.creditsEarned}/{profile.totalCredits}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">{(100 - progressPercentage).toFixed(0)}% remaining to graduation</p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">Career Readiness Score</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-600">{profile.careerReadinessScore}%</span>
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
                  <div className="text-3xl font-bold">{profile.skills.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {profile.skills.filter((s) => s.proficiency === 'Advanced').length} advanced
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-600">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Current: {profile.major} Major</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-medium">Building Skills</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Target Career: Software Engineer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SkillsTranscript skills={profile.skills} />
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Opportunity Matcher</CardTitle>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Best Match</SelectItem>
                      <SelectItem value="salary">Highest Salary</SelectItem>
                      <SelectItem value="deadline">Nearest Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunities.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={mockRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Your Skills" dataKey="student" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  <Radar name="Target Job" dataKey="target" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm mb-1">AI Insight</p>
                    <p className="text-sm text-muted-foreground">
                      You excel in Communication and Problem Solving, but need to strengthen Data Visualization and Machine Learning skills to reach
                      your target role.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { code: 'CS401', name: 'Machine Learning Fundamentals', skills: ['ML', 'Python'], semester: 'Fall 2024' },
                { code: 'STAT301', name: 'Data Visualization', skills: ['Visualization', 'R'], semester: 'Fall 2024' },
                { code: 'CS450', name: 'Advanced Algorithms', skills: ['Algorithms', 'Problem Solving'], semester: 'Spring 2025' },
              ].map((course, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">
                        {course.code}: {course.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{course.semester}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {course.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Add to Plan
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alumni Pathway Explorer</CardTitle>
            <p className="text-sm text-muted-foreground">Discover how alumni with your major transitioned into various careers</p>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Ask me anything... e.g., 'Show me English majors who work in Tech Marketing'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Try:</span>
                {exampleQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(query);
                      setShowAlumniResults(true);
                    }}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>

            {showAlumniResults && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAlumniPathways.slice(0, 3).map((pathway) => (
                  <AlumniPathwayCard key={pathway.id} pathway={pathway} />
                ))}
              </div>
            )}

            {!showAlumniResults && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Search for alumni pathways to see career transitions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function GraduationCap({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
      />
    </svg>
  );
}
