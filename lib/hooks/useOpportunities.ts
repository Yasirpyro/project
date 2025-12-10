import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabaseclient';
import type { OpportunityMatch, CareerPath, StudentSkill } from '@/types/database';

// Fetch opportunity matches for a student
export function useOpportunityMatches(studentId?: number) {
  return useQuery({
    queryKey: ['opportunity-matches', studentId],
    queryFn: async () => {
      if (!supabase || !studentId) {
        throw new Error('Supabase client not initialized or student ID missing');
      }

      const { data, error } = await supabase
        .from('opportunity_matches')
        .select(
          `
          *,
          opportunity:opportunities(*)
        `
        )
        .eq('student_id', studentId)
        .order('match_score', { ascending: false });

      if (error) throw error;
      return data as OpportunityMatch[];
    },
    enabled: !!supabase && !!studentId,
  });
}

// Fetch all career paths
export function useCareerPaths() {
  return useQuery({
    queryKey: ['career-paths'],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('career_paths')
        .select('*')
        .order('demand_score', { ascending: false });

      if (error) throw error;
      return data as CareerPath[];
    },
    enabled: !!supabase,
  });
}

// Fetch student skills aggregated from courses
export function useStudentSkills(studentId?: number) {
  return useQuery({
    queryKey: ['student-skills', studentId],
    queryFn: async () => {
      if (!supabase || !studentId) {
        throw new Error('Supabase client not initialized or student ID missing');
      }

      const { data, error } = await supabase
        .from('student_skills')
        .select(
          `
          *,
          skill:skills(*)
        `
        )
        .eq('student_id', studentId);

      if (error) throw error;
      return data as StudentSkill[];
    },
    enabled: !!supabase && !!studentId,
  });
}

// Fetch active opportunities with optional filters
export function useOpportunities(filters?: {
  company?: string;
  location?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      let query = supabase.from('opportunities').select('*').eq('is_active', true);

      if (filters?.company) {
        query = query.eq('company_name', filters.company);
      }
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!supabase,
  });
}
