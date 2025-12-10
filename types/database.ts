// Database types for Scholaris University Portal

export interface Student {
  student_id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  major?: string;
  enrollment_date?: string;
  expected_graduation?: string;
  gpa?: number;
  credits_earned?: number;
  total_credits_required?: number;
  persistence_score?: number;
  career_readiness_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Enrollment {
  enrollment_id: number;
  student_id: number;
  course_id: number;
  semester: string;
  status: 'active' | 'completed' | 'dropped' | 'withdrawn';
  grade?: string;
  credits?: number;
  created_at?: string;
  updated_at?: string;
  course?: Course;
}

export interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  credits: number;
  department?: string;
  description?: string;
  created_at?: string;
}

export interface Intervention {
  intervention_id: number;
  student_id: number;
  advisor_id: string;
  intervention_type: 'email' | 'sms' | 'meeting' | 'phone_call' | 'auto_nudge';
  subject?: string;
  message: string;
  status: 'pending' | 'sent' | 'completed' | 'failed';
  scheduled_date?: string;
  completed_date?: string;
  created_at?: string;
  updated_at?: string;
  student?: Student;
}

export interface Opportunity {
  opportunity_id: number;
  company_name: string;
  title: string;
  description?: string;
  location?: string;
  salary_range?: string;
  deadline?: string;
  required_skills?: string;
  source_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OpportunityMatch {
  match_id: number;
  student_id: number;
  opportunity_id: number;
  match_score: number;
  skill_gaps?: string;
  matched_date?: string;
  created_at?: string;
  opportunity?: Opportunity;
}

export interface Skill {
  skill_id: number;
  skill_name: string;
  category?: 'Technical' | 'Soft Skills' | 'Domain Knowledge';
  description?: string;
  created_at?: string;
}

export interface StudentSkill {
  student_skill_id: number;
  student_id: number;
  skill_id: number;
  proficiency_level?: 'Beginner' | 'Intermediate' | 'Advanced';
  acquired_from?: string;
  created_at?: string;
  skill?: Skill;
}

export interface CareerPath {
  career_id: number;
  title: string;
  description?: string;
  avg_salary?: number;
  demand_score?: number;
  created_at?: string;
}

export interface LMSActivity {
  activity_id: number;
  student_id: number;
  course_id: number;
  activity_type: 'login' | 'assignment_view' | 'assignment_submit' | 'quiz_attempt' | 'forum_post' | 'resource_view';
  activity_date: string;
  duration_minutes?: number;
  created_at?: string;
}

export interface Grade {
  grade_id: number;
  enrollment_id: number;
  assignment_name?: string;
  grade_value?: number;
  max_points?: number;
  grade_letter?: string;
  graded_date?: string;
  created_at?: string;
}

// Helper types for API responses
export interface StudentWithRelations extends Student {
  enrollments?: Enrollment[];
  interventions?: Intervention[];
  opportunity_matches?: OpportunityMatch[];
  student_skills?: StudentSkill[];
}

export interface StudentFilters {
  risk_level?: 'high-risk' | 'at-risk' | 'safe';
  major?: string;
  gpa_min?: number;
  gpa_max?: number;
  persistence_min?: number;
  persistence_max?: number;
  search?: string;
}
