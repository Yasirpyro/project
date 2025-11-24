import { Badge } from '@/components/ui/badge';
import { RiskLevel } from '@/types';
import { getRiskColor, getRiskLabel } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface RiskBadgeProps {
  riskLevel: RiskLevel;
  showIcon?: boolean;
}

export function RiskBadge({ riskLevel, showIcon = true }: RiskBadgeProps) {
  const Icon = riskLevel === 'safe' ? CheckCircle : riskLevel === 'at-risk' ? AlertTriangle : AlertCircle;

  return (
    <Badge className={`${getRiskColor(riskLevel)} font-medium border`} variant="outline">
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {getRiskLabel(riskLevel)}
    </Badge>
  );
}
