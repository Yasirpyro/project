# University AI Portal

A modern, AI-powered university operating system featuring two core modules:
- **Advisor Dashboard**: Comprehensive student monitoring with AI-generated insights
- **Student Pathway Dashboard**: Skills-based transcript and career opportunity matching

## Tech Stack

- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui components
- Recharts for data visualization
- Zustand for state management
- TanStack Query for data fetching

## Getting Started

### Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features

### Advisor Dashboard (`/advisor/dashboard`)

- Real-time KPI cards showing total students, at-risk counts, and resolved cases
- Sortable, filterable student table with risk indicators
- Detailed student profiles with tabbed sections:
  - Academic summary with course grades and trends
  - Engagement metrics with LMS login visualization
  - Financial aid status and holds
  - AI-generated recommendations
  - Meeting history timeline
- Risk distribution donut chart
- Live activity feed showing automated interventions
- Interactive student detail panel

### Student Pathway Dashboard (`/student/pathway`)

- Progress tracking for credits and career readiness score
- Skills-based transcript with proficiency levels
- Opportunity matcher with:
  - Match percentage calculations
  - Skill gap analysis
  - Required vs. acquired skills visualization
- Radar chart comparing student skills vs. target job requirements
- Alumni pathway explorer with natural language search
- Recommended courses to bridge skill gaps

### Shared Features

- Modern, responsive design (mobile-first approach)
- Dark mode toggle with persistent settings
- Accessible (WCAG 2.1 AA compliant)
- Professional SaaS aesthetic with smooth animations
- Mock authentication system

## Project Structure

```
/app                    # Next.js App Router pages
/components            # Reusable UI components
  /advisor            # Advisor-specific components
  /student            # Student-specific components
  /ui                 # shadcn/ui components
/lib                   # Utilities and mock data
/stores                # Zustand state stores
/types                 # TypeScript type definitions
/hooks                 # Custom React hooks
```

## Routes

- `/` - Landing page
- `/login` - Authentication (supports advisor and student roles)
- `/advisor/dashboard` - Advisor dashboard with student insights
- `/student/pathway` - Student career pathway and opportunities

## Design System

- **Primary Blue**: #1E3A8A
- **Success Green**: #10B981
- **Warning Amber**: #F59E0B
- **Danger Red**: #EF4444
- **Font**: Inter

## Demo Credentials

Use any email and password to login. The system will redirect based on selected role.

## Development Notes

- Mock data is provided in `/lib/mock-data.ts`
- All components follow modern React patterns with hooks
- State management uses Zustand for simplicity
- Charts use Recharts for interactive visualizations
- Forms use React Hook Form with Zod validation

## Known Issues

- Production build (`npm run build`) has issues with Next.js 13.5.1 and Radix UI Progress component bundling
- Development mode works perfectly - use `npm run dev` for testing and development

## Future Enhancements

- Real backend integration with API
- Advanced filtering and search
- PDF export functionality
- Real-time notifications
- Calendar integration for meetings
- Email/SMS notification system
