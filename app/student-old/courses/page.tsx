import { Navigation } from '@/components/navigation';

export default function StudentCoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation role="student" />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground mt-2">Coming soon...</p>
      </main>
    </div>
  );
}
