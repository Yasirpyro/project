import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabaseclient';
import type { Student, StudentWithRelations, StudentFilters } from '@/types/database';

// Fetch students with optional filters
export function useStudents(filters?: StudentFilters) {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      let query = supabase.from('students').select('*');

      // Apply filters
      if (filters?.major) {
        query = query.eq('major', filters.major);
      }
      if (filters?.gpa_min !== undefined) {
        query = query.gte('gpa', filters.gpa_min);
      }
      if (filters?.gpa_max !== undefined) {
        query = query.lte('gpa', filters.gpa_max);
      }
      if (filters?.persistence_min !== undefined) {
        query = query.gte('persistence_score', filters.persistence_min);
      }
      if (filters?.persistence_max !== undefined) {
        query = query.lte('persistence_score', filters.persistence_max);
      }
      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query.order('last_name', { ascending: true });

      if (error) throw error;
      return data as Student[];
    },
    enabled: !!supabase,
  });
}

// Fetch single student with relations
export function useStudent(studentId?: number) {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!supabase || !studentId) {
        throw new Error('Supabase client not initialized or student ID missing');
      }

      const { data, error } = await supabase
        .from('students')
        .select(
          `
          *,
          enrollments:enrollments(
            *,
            course:courses(*)
          ),
          student_skills:student_skills(
            *,
            skill:skills(*)
          ),
          opportunity_matches:opportunity_matches(
            *,
            opportunity:opportunities(*)
          )
        `
        )
        .eq('student_id', studentId)
        .single();

      if (error) throw error;
      return data as StudentWithRelations;
    },
    enabled: !!supabase && !!studentId,
  });
}

// Fetch student enrollments
export function useStudentEnrollments(studentId?: number) {
  return useQuery({
    queryKey: ['student-enrollments', studentId],
    queryFn: async () => {
      if (!supabase || !studentId) {
        throw new Error('Supabase client not initialized or student ID missing');
      }

      const { data, error } = await supabase
        .from('enrollments')
        .select(
          `
          *,
          course:courses(*)
        `
        )
        .eq('student_id', studentId)
        .order('semester', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!supabase && !!studentId,
  });
}

// Fetch student grades
export function useStudentGrades(studentId?: number) {
  return useQuery({
    queryKey: ['student-grades', studentId],
    queryFn: async () => {
      if (!supabase || !studentId) {
        throw new Error('Supabase client not initialized or student ID missing');
      }

      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('enrollment_id')
        .eq('student_id', studentId);

      if (enrollmentsError) throw enrollmentsError;
      if (!enrollments || enrollments.length === 0) return [];

      const enrollmentIds = enrollments.map((e) => e.enrollment_id);

      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .in('enrollment_id', enrollmentIds)
        .order('graded_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!supabase && !!studentId,
  });
}

// Fetch student LMS activity for the last N days
export function useStudentLMSActivity(studentId?: number, days: number = 30) {
  return useQuery({
    queryKey: ['student-lms-activity', studentId, days],
    queryFn: async () => {
      if (!supabase || !studentId) {
        throw new Error('Supabase client not initialized or student ID missing');
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from('lms_activity')
        .select('*')
        .eq('student_id', studentId)
        .gte('activity_date', cutoffDate.toISOString())
        .order('activity_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!supabase && !!studentId,
  });
}
