import { create } from 'zustand';
import { Student } from '@/types';

interface StudentStore {
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  selectedStudent: null,
  setSelectedStudent: (student) => set({ selectedStudent: student }),
}));
