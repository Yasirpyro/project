import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! ;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const admin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const MAJORS = ['Computer Science', 'Business Administration', 'Psychology', 'Biology', 'Mechanical Engineering'];

async function seedCareers() {
  console.log('🌱 Seeding Career Data.. .\n');

  // Get skills
  const { data: skills } = await admin.from('skills'). select('skill_id');
  const skillIds = skills?.map(s => s.skill_id) || [];

  // Create Career Paths
  console.log('💼 Creating career paths...');
  const careers = [
    { title: 'Software Engineer', salary: 95000, demand: 92 },
    { title: 'Data Scientist', salary: 110000, demand: 88 },
    { title: 'Product Manager', salary: 120000, demand: 85 },
    { title: 'UX Designer', salary: 85000, demand: 78 },
    { title: 'Business Analyst', salary: 75000, demand: 82 },
    { title: 'Marketing Manager', salary: 80000, demand: 75 },
    { title: 'Financial Analyst', salary: 70000, demand: 80 },
    { title: 'Project Manager', salary: 90000, demand: 83 },
    { title: 'DevOps Engineer', salary: 105000, demand: 87 },
    { title: 'Machine Learning Engineer', salary: 125000, demand: 90 },
    { title: 'Full Stack Developer', salary: 100000, demand: 89 },
    { title: 'Cloud Architect', salary: 130000, demand: 86 },
    { title: 'Cybersecurity Analyst', salary: 95000, demand: 91 },
    { title: 'Sales Engineer', salary: 110000, demand: 77 },
    { title: 'HR Manager', salary: 75000, demand: 72 },
  ];

  const careerIds: number[] = [];
  for (const career of careers) {
    const { data } = await admin.from('career_paths').insert({
      title: career.title,
      avg_salary: career.salary,
      demand_score: career.demand,
      description: faker.lorem.paragraph(),
    }). select(). single();
    if (data) careerIds.push(data.career_id);
  }
  console.log(`✅ Created ${careerIds.length} career paths`);

  // Link careers to skills
  console.log('\n🔗 Linking careers to skills...');
  let careerSkillsCount = 0;
  for (const careerId of careerIds) {
    const numSkills = faker.number.int({ min: 5, max: 8 });
    const selectedSkills = faker.helpers.arrayElements(skillIds, numSkills);
    for (const skillId of selectedSkills) {
      await admin.from('career_skills').insert({
        career_id: careerId,
        skill_id: skillId,
        importance_level: faker.number.int({ min: 3, max: 5 }),
      });
      careerSkillsCount++;
    }
  }
  console.log(`✅ Created ${careerSkillsCount} career-skill mappings`);

  // Create Opportunities
  console.log('\n🎯 Creating job opportunities...');
  const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 'IBM', 'Oracle', 'Salesforce', 'Adobe', 'Uber', 'Airbnb', 'Spotify', 'Twitter', 'LinkedIn', 'Cisco', 'Intel', 'NVIDIA', 'PayPal'];
  const positions = ['Software Engineering Intern', 'Data Science Intern', 'Product Management Intern', 'UX Design Intern', 'Marketing Intern', 'Business Development Intern', 'Full Stack Developer Intern', 'Machine Learning Intern', 'Cloud Engineering Intern', 'Cybersecurity Intern'];

  const opportunityIds: number[] = [];
  for (let i = 0; i < 100; i++) {
    const { data } = await admin.from('opportunities').insert({
      company_name: faker.helpers.arrayElement(companies),
      title: faker.helpers.arrayElement(positions),
      description: faker.lorem.paragraphs(2),
      location: faker.location.city() + ', ' + faker.location. state(),
      salary_range: `$${faker.number.int({ min: 50, max: 90 })}k - $${faker.number.int({ min: 80, max: 120 })}k`,
      deadline: faker.date.future().toISOString(). split('T')[0],
      required_skills: JSON.stringify(faker.helpers.arrayElements(skillIds, faker.number.int({ min: 3, max: 6 }))),
      source_url: faker.internet.url(),
      is_active: true,
    }).select().single();
    if (data) opportunityIds.push(data.opportunity_id);
  }
  console.log(`✅ Created ${opportunityIds.length} opportunities`);

  // Create Opportunity Matches
  console.log('\n🎯 Creating opportunity matches...');
  const { data: students } = await admin.from('students').select('student_id');
  const studentIds = students?.map(s => s.student_id) || [];

  let matchesCount = 0;
  for (const studentId of studentIds) {
    const numMatches = faker.number.int({ min: 3, max: 7 });
    const selectedOpps = faker.helpers.arrayElements(opportunityIds, numMatches);
    for (const oppId of selectedOpps) {
      await admin.from('opportunity_matches'). insert({
        student_id: studentId,
        opportunity_id: oppId,
        match_score: parseFloat((Math.random() * 40 + 60).toFixed(2)),
        skill_gaps: JSON.stringify([
          { skill: 'Python', proficiency_needed: 4, current: 2 },
          { skill: 'SQL', proficiency_needed: 3, current: 1 },
        ]),
        recommended_courses: JSON.stringify([1, 2, 3]),
      });
      matchesCount++;
    }
  }
  console.log(`✅ Created ${matchesCount} opportunity matches`);

  // Alumni Careers
  console.log('\n🎓 Creating alumni careers...');
  for (let i = 0; i < 100; i++) {
    await admin.from('alumni_careers'). insert({
      user_id: null,
      graduation_year: faker.number.int({ min: 2015, max: 2023 }),
      starting_major: faker.helpers.arrayElement(MAJORS),
      current_role: faker.helpers.arrayElement(['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'Marketing Manager', 'Business Analyst', 'Project Manager']),
      current_company: faker.company.name(),
      career_transitions: JSON.stringify([
        { role: 'Junior Developer', company: faker.company.name(), year: 2020, skills_used: ['Python', 'SQL'] },
        { role: 'Senior Developer', company: faker.company.name(), year: 2022, skills_used: ['Python', 'React', 'Cloud Computing'] },
      ]),
      is_public: faker.datatype.boolean(),
    });
  }
  console. log(`✅ Created 100 alumni career records\n`);
}

seedCareers().catch(console.error);