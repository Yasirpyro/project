import { Skill } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getProficiencyColor } from '@/lib/utils';
import { Download, Code, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SkillsTranscriptProps {
  skills: Skill[];
}

export function SkillsTranscript({ skills }: SkillsTranscriptProps) {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Your skills-based transcript is being generated as a PDF...',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical':
        return <Code className="w-4 h-4" />;
      case 'Soft Skills':
        return <Users className="w-4 h-4" />;
      case 'Domain Knowledge':
        return <BookOpen className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getProficiencyValue = (proficiency: string) => {
    switch (proficiency) {
      case 'Advanced':
        return 100;
      case 'Intermediate':
        return 66;
      case 'Beginner':
        return 33;
      default:
        return 0;
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Skills-Based Transcript</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                {getCategoryIcon(category)}
                <h3 className="font-semibold text-lg">{category}</h3>
                <Badge variant="outline" className="ml-auto">
                  {categorySkills.length} skills
                </Badge>
              </div>
              <div className="space-y-3">
                {categorySkills.map((skill, index) => (
                  <div key={index} className="group p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <Badge className={`${getProficiencyColor(skill.proficiency)} text-xs`}>{skill.proficiency}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Acquired from: {skill.acquiredFrom.slice(0, 3).join(', ')}
                          {skill.acquiredFrom.length > 3 && ` +${skill.acquiredFrom.length - 3} more`}
                        </p>
                      </div>
                    </div>
                    <Progress value={getProficiencyValue(skill.proficiency)} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
