import { AlumniPathway } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, GraduationCap, Briefcase, Clock } from 'lucide-react';

interface AlumniPathwayCardProps {
  pathway: AlumniPathway;
}

export function AlumniPathwayCard({ pathway }: AlumniPathwayCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
              <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold">{pathway.name}</p>
              <p className="text-xs text-muted-foreground">{pathway.startingMajor} → {pathway.currentRole}</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {pathway.timeline}
          </Badge>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Career Journey
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            {pathway.careerTransitions.map((transition, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {transition}
                </Badge>
                {index < pathway.careerTransitions.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Key Skills Acquired</h4>
          <div className="flex flex-wrap gap-2">
            {pathway.keySkills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Critical Courses</h4>
          <div className="space-y-1">
            {pathway.courses.map((course, index) => (
              <p key={index} className="text-xs text-muted-foreground">
                • {course}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
