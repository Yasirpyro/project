'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { SkillRadarChart } from '@/components/student/SkillRadarChart';
import { CareerPathwayFlow } from '@/components/student/CareerPathwayFlow';
import { AlumniPathwayCard } from '@/components/student/alumni-pathway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCareerPaths, useStudentSkills } from '@/lib/hooks/useOpportunities';
import { Search, Lightbulb } from 'lucide-react';
import { mockAlumniPathways } from '@/lib/mock-data';

// Mock student data
const mockStudent = {
  student_id: 1,
  first_name: 'Jordan',
  last_name: 'Smith',
  email: 'student1@test.edu',
  major: 'Computer Science',
};

export default function StudentPathwayPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlumniResults, setShowAlumniResults] = useState(false);

  // Fetch data using hooks
  const { data: careerPaths = [] } = useCareerPaths();
  const { data: studentSkills = [] } = useStudentSkills(mockStudent.student_id);

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
    <ProtectedRoute requiredRole="student">
      <DashboardLayout
        role="student"
        userName={`${mockStudent.first_name} ${mockStudent.last_name}`}
        userEmail={mockStudent.email}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Career Pathway Explorer</h1>
            <p className="text-muted-foreground">
              Discover career opportunities and build the skills you need to succeed
            </p>
          </div>

          {/* Career Pathways */}
          <div className="mb-8">
            <CareerPathwayFlow careerPaths={careerPaths} currentMajor={mockStudent.major} />
          </div>

          {/* Skills Analysis */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <SkillRadarChart skills={studentSkills} title="Your Skill Profile" />

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
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        >
                          {skill}
                        </span>
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

          {/* Alumni Pathway Explorer */}
          <Card>
            <CardHeader>
              <CardTitle>Alumni Pathway Explorer</CardTitle>
              <p className="text-sm text-muted-foreground">
                Discover how alumni with your major transitioned into various careers
              </p>
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
