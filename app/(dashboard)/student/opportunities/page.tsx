'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OpportunityCard } from '@/components/student/opportunity-card';
import { useOpportunityMatches, useOpportunities } from '@/lib/hooks/useOpportunities';
import { Search, Filter, Briefcase, MapPin, DollarSign } from 'lucide-react';
import type { JobOpportunity } from '@/types';

// Mock student data
const mockStudent = {
  student_id: 1,
  first_name: 'Jordan',
  last_name: 'Smith',
  email: 'student1@test.edu',
};

export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('match');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch opportunity matches for the student
  const { data: opportunityMatches = [], isLoading } = useOpportunityMatches(mockStudent.student_id);

  // Convert database opportunities to component format
  const opportunities: JobOpportunity[] = opportunityMatches
    .filter((match) => match.opportunity)
    .map((match) => ({
      id: match.opportunity!.opportunity_id.toString(),
      company: match.opportunity!.company_name,
      title: match.opportunity!.title,
      matchPercentage: match.match_score,
      requiredSkills: match.opportunity!.required_skills
        ? JSON.parse(match.opportunity!.required_skills)
        : [],
      skillGaps: match.skill_gaps ? JSON.parse(match.skill_gaps) : [],
      salary: match.opportunity!.salary_range ?? 'Not specified',
      location: match.opportunity!.location ?? 'Remote',
      deadline: match.opportunity!.deadline ?? 'Rolling',
    }));

  // Filter and sort opportunities
  const filteredOpportunities = opportunities
    .filter((opp) => {
      const matchesSearch =
        searchQuery === '' ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation =
        locationFilter === '' || opp.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
      if (sortBy === 'salary') {
        const salaryA = parseInt(a.salary.replace(/[^0-9]/g, ''));
        const salaryB = parseInt(b.salary.replace(/[^0-9]/g, ''));
        return salaryB - salaryA;
      }
      return 0;
    });

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(opportunities.map((o) => o.location))).sort();

  // Calculate stats
  const highMatchCount = opportunities.filter((o) => o.matchPercentage >= 80).length;
  const avgMatchScore =
    opportunities.length > 0
      ? Math.round(opportunities.reduce((sum, o) => sum + o.matchPercentage, 0) / opportunities.length)
      : 0;

  return (
    <ProtectedRoute requiredRole="student">
      <DashboardLayout
        role="student"
        userName={`${mockStudent.first_name} ${mockStudent.last_name}`}
        userEmail={mockStudent.email}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Career Opportunities</h1>
            <p className="text-muted-foreground">
              Explore job and internship opportunities matched to your skills and interests
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Opportunities</p>
                    <p className="text-3xl font-bold">{opportunities.length}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Match (≥80%)</p>
                    <p className="text-3xl font-bold">{highMatchCount}</p>
                  </div>
                  <Badge className="bg-green-600 text-lg px-3 py-1">{avgMatchScore}%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Locations</p>
                    <p className="text-3xl font-bold">{uniqueLocations.length}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Search & Filter</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search by title, company, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="match">Best Match</SelectItem>
                        <SelectItem value="salary">Highest Salary</SelectItem>
                        <SelectItem value="deadline">Nearest Deadline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All locations</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setLocationFilter('');
                        setSortBy('match');
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opportunities Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading opportunities...</p>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No opportunities match your search criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredOpportunities.length} of {opportunities.length} opportunities
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpportunities.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
