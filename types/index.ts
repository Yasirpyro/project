export type RiskLevel = 'safe' | 'at-risk' | 'high-risk';

export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  gpa: number;
  persistenceScore: number;
  riskLevel: RiskLevel;
  lastEngagement: string;
  courses: Course[];
  lmsLogins: number;
  financialHolds: FinancialHold[];
  meetingNotes: MeetingNote[];
  autoNudgesSent: number;
  nextMeeting?: string;
  photoUrl?: string;
  studentId: string;
  attendance: number;
  assignmentCompletion: number;
}

export interface Course {
  code: string;
  name: string;
  grade: string;
  trend: 'up' | 'down' | 'stable';
  lastSubmission: string;
}

export interface FinancialHold {
  type: string;
  amount: number;
  deadline: string;
  status: 'active' | 'resolved';
}

export interface MeetingNote {
  date: string;
  topic: string;
  notes: string;
  advisor: string;
}

export interface Activity {
  id: string;
  message: string;
  timestamp: string;
  type: 'nudge' | 'booking' | 'meeting' | 'alert';
}

export interface Skill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Technical' | 'Soft Skills' | 'Domain Knowledge';
  acquiredFrom: string[];
}

export interface JobOpportunity {
  id: string;
  company: string;
  title: string;
  matchPercentage: number;
  requiredSkills: string[];
  skillGaps: string[];
  salary: string;
  location: string;
  deadline: string;
  logo?: string;
}

export interface AlumniPathway {
  id: string;
  name: string;
  startingMajor: string;
  currentRole: string;
  careerTransitions: string[];
  keySkills: string[];
  courses: string[];
  timeline: string;
}

export interface StudentProfile {
  name: string;
  major: string;
  creditsEarned: number;
  totalCredits: number;
  careerReadinessScore: number;
  skills: Skill[];
  completedCourses: string[];
}

export interface RadarDataPoint {
  skill: string;
  student: number;
  target: number;
}
