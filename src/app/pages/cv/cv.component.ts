import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cv-container">
      <a routerLink="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Portfolio
      </a>

      <!-- Personal Statement -->
      <div class="card statement-card">
        <h1 class="name">Corey Musa</h1>
        <p class="subtitle">Full-Stack Software Engineer</p>
        <p class="statement">
          Nine years in software, all within fintech and banking. Associate Director at 27.
          Learned not just how to write software but how to communicate ideas, formalise processes,
          and drive delivery across distributed teams. When AI emerged, it reignited my passion for
          building. Software development became what you imagined when you started: think of a product
          and make it. I've shipped three AI-powered platforms solo in six months, all live and
          generating revenue. Combined with deep enterprise experience and architectural thinking,
          I build software that's both technically sound and commercially real.
        </p>
      </div>

      <!-- Experience -->
      <h2 class="section-heading">Experience</h2>

      <div class="roles-list">
        @for (role of roles; track role.title + role.company) {
          <div class="card role-card">
            <div class="role-header">
              <span class="role-title">{{ role.title }}</span>
              <span class="role-company"> &middot; {{ role.company }}</span>
            </div>
            <div class="role-meta">{{ role.location }} &middot; {{ role.period }}</div>
            @if (role.context) {
              <p class="role-context">{{ role.context }}</p>
            }
            <ul class="role-bullets">
              @for (bullet of role.bullets; track bullet) {
                <li>{{ bullet }}</li>
              }
            </ul>
          </div>
        }
      </div>

      <!-- Technical Skills -->
      <h2 class="section-heading">Technical Skills</h2>

      <div class="skills-grid">
        @for (category of skillCategories; track category.label) {
          <div class="card skill-card">
            <div class="skill-label">{{ category.label }}</div>
            <div class="skill-pills">
              @for (skill of category.skills; track skill) {
                <span class="pill">{{ skill }}</span>
              }
            </div>
          </div>
        }
      </div>

      <!-- Education -->
      <h2 class="section-heading">Education</h2>

      <div class="card education-card">
        <div class="degree">BSc Computer Science</div>
        <div class="university">Newcastle University | 2014 - 2017</div>
      </div>
    </div>
  `,
  styles: `
    .cv-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 100px 24px 64px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      color: #9ca3af;
      text-decoration: none;
      margin-bottom: 24px;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: #111827;
    }

    .card {
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
      border: none;
      border-radius: 20px;
      padding: 28px;
    }

    /* Personal Statement */
    .name {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px;
    }

    .subtitle {
      color: #9ca3af;
      font-size: 0.9375rem;
      margin: 0 0 20px;
    }

    .statement {
      font-size: 1.0625rem;
      line-height: 1.8;
      color: #6b7280;
      margin: 0;
    }

    /* Section Headings */
    .section-heading {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 20px;
      margin-top: 48px;
    }

    /* Roles */
    .roles-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .role-header {
      font-size: 1rem;
      line-height: 1.5;
    }

    .role-title {
      font-weight: 600;
      color: #111827;
    }

    .role-company {
      font-weight: 400;
      color: #6b7280;
    }

    .role-meta {
      font-size: 0.8125rem;
      color: #9ca3af;
      margin-top: 2px;
    }

    .role-context {
      font-style: italic;
      color: #9ca3af;
      font-size: 0.875rem;
      margin: 12px 0;
    }

    .role-bullets {
      list-style: none;
      padding: 0;
      margin: 12px 0 0;
    }

    .role-bullets li {
      position: relative;
      padding-left: 16px;
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.7;
    }

    .role-bullets li + li {
      margin-top: 6px;
    }

    .role-bullets li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.55em;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #9ca3af;
    }

    /* Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .skill-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9ca3af;
      margin-bottom: 12px;
    }

    .skill-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill {
      background: #f3f4f6;
      color: #6b7280;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 0.8125rem;
    }

    /* Education */
    .education-card {
      display: inline-block;
    }

    .degree {
      font-weight: 600;
      color: #111827;
      font-size: 1rem;
    }

    .university {
      color: #9ca3af;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .skills-grid {
        grid-template-columns: 1fr;
      }

      .cv-container {
        padding: 100px 16px 64px;
      }

      .name {
        font-size: 1.5rem;
      }
    }
  `,
})
export class CvComponent {
  readonly roles = [
    {
      title: 'Associate Director',
      company: 'UBS',
      location: 'Zurich, Switzerland',
      period: 'Jun 2024 – Jul 2025',
      context:
        'UBS acquired Credit Suisse in the largest Swiss banking merger in history. Tasked with consolidating two wealth management platforms and rolling out to EMEA.',
      bullets: [
        'Led full-stack Java 17/React development for the merged wealth management platform — the largest banking integration in Swiss history',
        'Delivered and deployed the consolidated application to Spain, Italy, and UK clients across three EMEA regions',
        'Authored architectural design documents for system changes and improvements — formalising technical decisions for stakeholder sign-off',
        'Designed the entire technical hiring process from scratch — pair programming exercises, assessment criteria — and hired three developers',
        'Drove cross-functional communication between business stakeholders and distributed engineering teams',
      ],
    },
    {
      title: 'Assistant Vice President',
      company: 'Credit Suisse',
      location: 'Zurich, Switzerland',
      period: 'Feb 2023 – Jun 2024',
      context: '',
      bullets: [
        'Sole backend developer for the Zurich wealth management team — led the monolith-to-microservices migration single-handedly',
        'Full-stack React/Java delivery with complete ownership: requirements, design, implementation, testing, deployment',
        'Built and enforced development standards across internationally distributed teams',
        'Ran Java workshops and knowledge-sharing sessions to upskill team members across multiple offices',
      ],
    },
    {
      title: 'Frontend Development Consultant',
      company: 'Credit Suisse (Contract)',
      location: 'Zurich, Switzerland',
      period: 'Aug 2020 – Feb 2023',
      context: '',
      bullets: [
        'Architected Angular 12 micro frontends adopted across multiple business units — became the standard component library for the wealth platform',
        'Led and mentored distributed international teams; set the bar for frontend quality and consistency',
      ],
    },
    {
      title: 'Junior Full Stack Developer',
      company: 'Backbase',
      location: 'Cardiff, UK',
      period: 'Jan 2019 – Aug 2020',
      context: '',
      bullets: [
        "Company's first full-stack developer. Built the reusable micro frontend library used across all credit union and banking clients (Angular, Java 8)",
        'Owned the security layer: SMS OTP, device out-of-band authentication, Keycloak integration — shipped to production across multiple financial institutions',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Smartstream Technologies',
      location: 'Bristol, UK',
      period: 'Jun 2017 – Aug 2018',
      context: '',
      bullets: [
        'Promoted from Junior to Software Engineer within 6 months. Java microservices, full lifecycle ownership, and Scrum-master responsibilities on a 2-year graduate programme',
      ],
    },
  ];

  readonly skillCategories = [
    {
      label: 'Backend',
      skills: [
        'Java 17+',
        'Spring Boot',
        'RESTful APIs',
        'Clean Architecture',
        'DDD',
        'PostgreSQL',
        'JPA/Hibernate',
        'OAuth2/OIDC',
        'JUnit',
      ],
    },
    {
      label: 'Frontend',
      skills: [
        'Angular 12+',
        'React',
        'TypeScript',
        'RxJS',
        'State Management',
        'SCSS',
        'Responsive Design',
        'Web Performance',
      ],
    },
    {
      label: 'AI & LLM',
      skills: [
        'Prompt Engineering',
        'Claude API',
        'OpenAI',
        'Generative UI',
        'Content Extraction',
        'AI Product Design',
      ],
    },
    {
      label: 'DevOps & Cloud',
      skills: ['Docker', 'AWS', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Maven', 'Git', 'SonarQube'],
    },
    {
      label: 'Practices',
      skills: [
        'Agile/Scrum',
        'XP',
        'API-First Design',
        'TDD',
        'Test Automation',
        'Secure Coding',
        'Technical Documentation',
      ],
    },
  ];
}
