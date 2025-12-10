import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/supabaseclient';
import type { Intervention } from '@/types/database';

// Fetch interventions for a student
export function useInterventions(studentId?: number) {
  return useQuery({
    queryKey: ['interventions', studentId],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      let query = supabase.from('interventions').select('*');

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Intervention[];
    },
    enabled: !!supabase,
  });
}

// Create intervention mutation
export function useCreateIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      intervention: Omit<Intervention, 'intervention_id' | 'created_at' | 'updated_at'>
    ) => {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('interventions')
        .insert(intervention)
        .select()
        .single();

      if (error) throw error;
      return data as Intervention;
    },
    onSuccess: (data) => {
      // Invalidate interventions queries
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      queryClient.invalidateQueries({ queryKey: ['interventions', data.student_id] });
    },
  });
}

// Update intervention mutation
export function useUpdateIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      interventionId,
      updates,
    }: {
      interventionId: number;
      updates: Partial<Intervention>;
    }) => {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { data, error } = await supabase
        .from('interventions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('intervention_id', interventionId)
        .select()
        .single();

      if (error) throw error;
      return data as Intervention;
    },
    onSuccess: (data) => {
      // Invalidate interventions queries
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      queryClient.invalidateQueries({ queryKey: ['interventions', data.student_id] });
    },
  });
}
