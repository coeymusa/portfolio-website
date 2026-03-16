export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  techStack: TechItem[];
  features: string[];
  liveUrl?: string;
  category: ProjectCategory;
  gradient: string;
  icon: string; // SVG path content
}

export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'infra' | 'api' | 'ml';
}

export type ProjectCategory = 'saas' | 'platform' | 'enterprise' | 'consultancy' | 'ml';

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  saas: 'SaaS',
  platform: 'Platform',
  enterprise: 'Enterprise',
  consultancy: 'Consultancy',
  ml: 'ML / CV',
};

export const PROJECTS: Project[] = [
  {
    id: 'promptmysite',
    title: 'PromptMySite',
    tagline: 'AI-powered conversational website platform',
    description:
      'Visitors type what they need and the site builds the answer live — with real UI components like cards, forms, tables, and booking calendars. Not a chatbot. The AI renders structured interface elements from the website\'s own content.',
    techStack: [
      { name: 'Angular 19', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Vite', category: 'frontend' },
      { name: 'Spring Boot', category: 'backend' },
      { name: 'Java 17', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Claude API', category: 'api' },
      { name: 'Stripe', category: 'api' },
      { name: 'AWS', category: 'infra' },
    ],
    features: [
      'Real-time AI streaming with structured UI blocks',
      'Automatic content discovery and knowledge base generation',
      'Multilingual support (DE/FR/IT) out of the box',
      'Calendar booking, contact flows, and per-workspace billing',
    ],
    liveUrl: 'https://promptmysite.com',
    category: 'saas',
    gradient: 'linear-gradient(135deg, #00f0ff, #a855f7)',
    icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  },
  {
    id: 'futureproof',
    title: 'Future Proof Solutions',
    tagline: 'Software engineering for regulated industries',
    description:
      'Company website and brand for a consultancy building bespoke compliance platforms, governance tools, and audit systems for finance, healthcare, legal, and public sector organisations.',
    techStack: [
      { name: 'Angular 20', category: 'frontend' },
      { name: 'Sass', category: 'frontend' },
      { name: 'EmailJS', category: 'api' },
    ],
    features: [
      'Compliance and risk management systems',
      'Digital governance platforms with maker-checker workflows',
      'Secure document management with immutable audit logs',
      'Real-time reporting dashboards for boards and regulators',
    ],
    liveUrl: 'https://futureproofsolutions.im',
    category: 'consultancy',
    gradient: 'linear-gradient(135deg, #e4846b, #c9d0bb)',
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  },
  {
    id: 'mcu',
    title: 'MCU Loan System',
    tagline: 'Full-stack credit union loan management',
    description:
      'Complete loan lifecycle platform for a credit union — member onboarding, loan applications, committee approvals, cashier operations, treasury management, and full audit trail. Includes an embedded AI assistant powered by PromptMySite.',
    techStack: [
      { name: 'Angular 19', category: 'frontend' },
      { name: 'Spring Boot', category: 'backend' },
      { name: 'Java 21', category: 'backend' },
      { name: 'Spring Auth Server', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Docker', category: 'infra' },
    ],
    features: [
      'Passwordless authentication via Spring Authorization Server',
      'Multi-role system: members, staff, committee, admin',
      'Full loan pipeline from application to disbursement',
      'Embedded AI assistant for member self-service',
    ],
    category: 'platform',
    gradient: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  },
  {
    id: 'rugby-unlocked',
    title: 'Rugby Unlocked',
    tagline: 'Global rugby recruitment marketplace',
    description:
      'Two-sided platform connecting rugby players with professional clubs worldwide. AI-driven matching algorithms, credibility scoring, and a gamified progression system help players find opportunities and clubs find talent.',
    techStack: [
      { name: 'Angular 19', category: 'frontend' },
      { name: 'Spring Boot', category: 'backend' },
      { name: 'WebSockets', category: 'backend' },
      { name: 'JWT Auth', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Stripe', category: 'api' },
    ],
    features: [
      'Dual dashboards for players and clubs',
      'Intelligent matching algorithm with scoring',
      'Real-time messaging via WebSockets (STOMP)',
      'AI-assisted multi-step onboarding and profile building',
    ],
    liveUrl: 'https://rugbyunlocked.com',
    category: 'platform',
    gradient: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    icon: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  },
  {
    id: 'rory',
    title: 'Rory',
    tagline: 'Enterprise project management for defence & aerospace',
    description:
      'Multi-tenant SaaS platform for schedule management, Earned Value Management (EVM), resource planning, and portfolio oversight. Ships as both a web application and an Electron desktop app sharing the same React codebase across a 10-package monorepo.',
    techStack: [
      { name: 'Next.js 15', category: 'frontend' },
      { name: 'React 19', category: 'frontend' },
      { name: 'tRPC v11', category: 'api' },
      { name: 'Electron 34', category: 'frontend' },
      { name: 'PostgreSQL 17', category: 'database' },
      { name: 'Drizzle ORM', category: 'backend' },
      { name: 'Turborepo', category: 'infra' },
    ],
    features: [
      'Critical Path Method (CPM) scheduling with Web Worker support',
      'Custom Canvas 2D Gantt chart renderer',
      'Scenario what-if planning with copy-on-write overlays',
      '43-table database with Row-Level Security for multi-tenant isolation',
    ],
    liveUrl: 'https://web-production-cb84a.up.railway.app/',
    category: 'enterprise',
    gradient: 'linear-gradient(135deg, #0ea5e9, #ec4899)',
    icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  },
  {
    id: 'rugby-cv',
    title: 'Rugby CV',
    tagline: 'Computer vision pipeline for automated rugby match analysis',
    description:
      'End-to-end ML pipeline that takes raw Veo behind-posts footage and automatically extracts player tracking, team classification, event detection (carries, tackles, rucks), phase analysis, per-player statistics, defensive line metrics, and fitness zones — no manual annotation required.',
    techStack: [
      { name: 'Python', category: 'backend' },
      { name: 'YOLOv8/v11', category: 'ml' },
      { name: 'PyTorch', category: 'ml' },
      { name: 'ByteTrack', category: 'ml' },
      { name: 'OpenCV', category: 'ml' },
      { name: 'FastAPI', category: 'backend' },
      { name: 'NumPy / SciPy', category: 'ml' },
      { name: 'FFmpeg', category: 'infra' },
    ],
    features: [
      '14-stage pipeline: detection, tracking, calibration, team classification, event detection, and stats',
      'Carries, tackles, and rucks detected at F1 > 0.82 with state-machine temporal validation',
      'Per-player stats: distance, top speed, carries, tackles, ruck involvement, and fitness zones',
      'Web-based annotation tool for ground-truth labelling and evaluation',
    ],
    category: 'ml',
    gradient: 'linear-gradient(135deg, #f59e0b, #10b981)',
    icon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  },
];
