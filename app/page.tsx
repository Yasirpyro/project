'use client'

import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart3, Brain, GraduationCap, Target, Users, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import { FlowButton } from '@/components/ui/flow-button';

const DotScreenShader = dynamic(() => import('@/components/dot-screen-shader').then(mod => ({ default: mod.DotScreenShader })), {
  ssr: false
});

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-[#05070b] dark:via-[#05070b] dark:to-[#05070b]">
      <Navigation />

      {/* Shader Background - Full Screen */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <DotScreenShader />
      </div>

      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium mb-6 animate-pulse">
            <Zap className="w-4 h-4" />
            AI-Powered Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            The Intelligence Layer for Universities
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Transform student success with AI-driven insights, personalized pathways, and intelligent interventions that keep every student on track to graduation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FlowButton href="/login?role=advisor" text="Advisor Login" className="w-full sm:w-auto" />
            <FlowButton href="/login?role=student" text="Student Login" variant="secondary" className="w-full sm:w-auto" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20 relative z-10">
          <Card className="hover:shadow-xl transition-all duration-300 border-2">
            <CardContent className="p-8">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 w-fit mb-4">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Advisors</h3>
              <p className="text-muted-foreground mb-6">
                Intelligent dashboard with AI-powered student insights, risk prediction, and automated interventions to support every student.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">AI-generated student briefs with actionable recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Real-time risk scoring and early intervention alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Automated nudges and personalized outreach at scale</span>
                </li>
              </ul>
              <Link href="/login?role=advisor" className="mt-6 inline-block">
                <Button variant="outline" className="w-full">
                  Explore Advisor Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2">
            <CardContent className="p-8">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900 w-fit mb-4">
                <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">For Students</h3>
              <p className="text-muted-foreground mb-6">
                Discover your career pathway with skills-based transcripts and AI-matched opportunities aligned with your goals.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Skills-based transcript showing career-ready competencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">AI-powered opportunity matching with skill gap analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Alumni pathway explorer to visualize career journeys</span>
                </li>
              </ul>
              <Link href="/login?role=student" className="mt-6 inline-block">
                <Button variant="outline" className="w-full">
                  Explore Student Pathway
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-4">Built on Advanced AI</h2>
          <p className="text-muted-foreground">
            Our platform uses machine learning to predict student success, natural language processing to generate insights, and intelligent automation to scale personalized support across your entire institution.
          </p>
        </div>
      </section>
    </div>
  );
}
