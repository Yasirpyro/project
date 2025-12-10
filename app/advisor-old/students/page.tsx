import { Navigation } from '@/components/navigation';

export default function AdvisorStudentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation role="advisor" />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground mt-2">Coming soon...</p>
      </main>
    </div>
  );
}
