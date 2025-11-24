'use client';

import { useState, useMemo } from 'react';
import { Student, RiskLevel } from '@/types';
import { RiskBadge } from '@/components/risk-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { ArrowUpDown, Search } from 'lucide-react';
import { useStudentStore } from '@/stores/use-student-store';

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  const { selectedStudent, setSelectedStudent } = useStudentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [majorFilter, setMajorFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Student>('persistenceScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const majors = useMemo(() => {
    const majorSet = new Set(students.map((s) => s.major));
    const uniqueMajors = Array.from(majorSet);
    return uniqueMajors.sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;
      const matchesMajor = majorFilter === 'all' || student.major === majorFilter;

      return matchesSearch && matchesRisk && matchesMajor;
    });
  }, [students, searchTerm, riskFilter, majorFilter]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredStudents, sortField, sortDirection]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedStudents.slice(start, start + itemsPerPage);
  }, [sortedStudents, currentPage]);

  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={riskFilter} onValueChange={(value) => setRiskFilter(value as RiskLevel | 'all')}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="high-risk">High Risk</SelectItem>
          </SelectContent>
        </Select>
        <Select value={majorFilter} onValueChange={setMajorFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Major" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Majors</SelectItem>
            {majors.map((major) => (
              <SelectItem key={major} value={major}>
                {major}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('name')} className="h-8 px-2">
                  Student Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('persistenceScore')} className="h-8 px-2">
                  Persistence Score
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Major</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('gpa')} className="h-8 px-2">
                  GPA
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Last Engagement</TableHead>
              <TableHead className="text-center">Auto-Nudges</TableHead>
              <TableHead>Next Meeting</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`cursor-pointer transition-colors ${
                  selectedStudent?.id === student.id ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
              >
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          student.riskLevel === 'safe'
                            ? 'bg-green-500'
                            : student.riskLevel === 'at-risk'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      />
                      <span className="text-sm font-medium">{student.persistenceScore}</span>
                    </div>
                    <RiskBadge riskLevel={student.riskLevel} showIcon={false} />
                  </div>
                </TableCell>
                <TableCell className="text-sm">{student.major}</TableCell>
                <TableCell className="font-medium">{student.gpa.toFixed(2)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(student.lastEngagement)}</TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                    {student.autoNudgesSent}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{student.nextMeeting ? formatDate(student.nextMeeting) : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedStudents.length)} of{' '}
            {sortedStudents.length} students
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
