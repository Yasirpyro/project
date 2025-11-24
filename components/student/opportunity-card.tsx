import { JobOpportunity } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building2, MapPin, DollarSign, Calendar, Bookmark, ExternalLink, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OpportunityCardProps {
  opportunity: JobOpportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: 'Application Started',
      description: `Redirecting to ${opportunity.company} application portal...`,
    });
  };

  const handleSave = () => {
    toast({
      title: 'Opportunity Saved',
      description: `${opportunity.title} has been added to your saved opportunities`,
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-2">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight mb-1">{opportunity.title}</h3>
              <p className="text-sm text-muted-foreground">{opportunity.company}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Match Score</span>
            <span className="text-sm font-bold text-blue-600">{opportunity.matchPercentage}%</span>
          </div>
          <Progress value={opportunity.matchPercentage} className="h-2" />
          {opportunity.matchPercentage < 85 && opportunity.skillGaps.length > 0 && (
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950 rounded-md">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-900 dark:text-amber-100">
                  To reach 90% match: Develop <span className="font-semibold">{opportunity.skillGaps[0]}</span> skills
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {opportunity.requiredSkills.map((skill, index) => {
              const hasSkill = !opportunity.skillGaps.includes(skill);
              return (
                <Badge key={index} variant={hasSkill ? 'default' : 'outline'} className={hasSkill ? 'bg-green-600' : 'border-amber-500 text-amber-600'}>
                  {skill}
                  {hasSkill ? ' ✓' : ' ✗'}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>{opportunity.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
            <Calendar className="w-4 h-4" />
            <span>Apply by {opportunity.deadline}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleApply} className="flex-1">
            Apply Now
            <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
