'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Target, ArrowRight, Briefcase } from 'lucide-react';
import type { CareerPath } from '@/types/database';

interface CareerPathwayFlowProps {
  careerPaths?: CareerPath[];
  currentMajor?: string;
}

export function CareerPathwayFlow({ careerPaths = [], currentMajor }: CareerPathwayFlowProps) {
  // Sort career paths by demand score
  const sortedPaths = [...careerPaths].sort(
    (a, b) => (b.demand_score ?? 0) - (a.demand_score ?? 0)
  );

  const topPaths = sortedPaths.slice(0, 6);

  const getDemandColor = (score?: number) => {
    if (!score) return 'text-gray-600';
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-amber-600';
  };

  const getDemandLabel = (score?: number) => {
    if (!score) return 'Unknown';
    if (score >= 85) return 'Very High Demand';
    if (score >= 70) return 'High Demand';
    if (score >= 50) return 'Moderate Demand';
    return 'Low Demand';
  };

  const formatSalary = (salary?: number) => {
    if (!salary) return 'N/A';
    return `$${(salary / 1000).toFixed(0)}k`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Career Pathway Recommendations</CardTitle>
            {currentMajor && (
              <p className="text-sm text-muted-foreground mt-1">
                Based on your {currentMajor} major
              </p>
            )}
          </div>
          <Briefcase className="w-6 h-6 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        {topPaths.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No career paths available at this time</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topPaths.map((path, index) => (
              <div
                key={path.career_id}
                className="p-4 border rounded-lg hover:shadow-md transition-all bg-gradient-to-r from-background to-muted/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{path.title}</h3>
                      {path.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {path.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Avg. Salary</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      {formatSalary(path.avg_salary)}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Job Demand</span>
                    </div>
                    <div>
                      <Progress value={path.demand_score ?? 0} className="h-2 mb-1" />
                      <p className={`text-xs font-medium ${getDemandColor(path.demand_score)}`}>
                        {getDemandLabel(path.demand_score)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <Badge
                    variant="secondary"
                    className={
                      path.demand_score && path.demand_score >= 85
                        ? 'bg-green-100 text-green-700'
                        : ''
                    }
                  >
                    Match Score: {path.demand_score ?? 0}%
                  </Badge>
                  <Button size="sm" variant="outline">
                    Explore Path
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {topPaths.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-start gap-2">
              <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm mb-1">Career Planning Tip</p>
                <p className="text-sm text-muted-foreground">
                  These career paths are sorted by job market demand. Higher demand typically means
                  more job opportunities and competitive salaries. Consider exploring the top 3
                  matches to align your course selection and skill development.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
