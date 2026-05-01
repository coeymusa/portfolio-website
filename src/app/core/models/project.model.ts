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
  theme: ProjectTheme;
  accent: string; // Themed accent color overriding --ember
  specimen: ProjectSpecimen;
  /** Caption shown beneath the polaroid screenshot */
  previewCaption?: string;
  /** Local static screenshot path — shown immediately, then upgraded to live */
  staticPreview?: string;
}

/** Builds a screenshot URL for any live site via Microlink (free tier, no auth).
 *  waitForTimeout is critical for JS-heavy SPAs — without it Microlink screenshots
 *  the empty shell before client-side rendering completes.
 */
export function previewUrl(liveUrl: string | undefined): string | null {
  if (!liveUrl) return null;
  const encoded = encodeURIComponent(liveUrl);
  return (
    `https://api.microlink.io/?url=${encoded}` +
    `&screenshot=true&meta=false&embed=screenshot.url` +
    `&viewport.width=1280&viewport.height=853` +
    `&waitForTimeout=3500`
  );
}

/** For projects without a liveUrl, returns a themed inline SVG mockup as a data URL. */
export function fallbackPreview(project: { theme: ProjectTheme; accent: string; title: string }): string {
  const accent = project.accent;
  const w = 1280;
  const h = 853;

  let inner = '';
  if (project.theme === 'mobile-chat') {
    // Phone mockup with chat bubbles
    inner = `
      <rect width="${w}" height="${h}" fill="#0f0e0c"/>
      <rect x="${w/2 - 180}" y="60" width="360" height="${h - 120}" rx="42" fill="#1a1817" stroke="${accent}" stroke-width="2"/>
      <rect x="${w/2 - 60}" y="80" width="120" height="20" rx="10" fill="#0f0e0c"/>
      <text x="${w/2}" y="180" font-family="Georgia, serif" font-size="28" font-style="italic" fill="${accent}" text-anchor="middle">Mooncake</text>
      <line x1="${w/2 - 150}" y1="210" x2="${w/2 + 150}" y2="210" stroke="#3a3328" stroke-width="1"/>
      <circle cx="${w/2 - 130}" cy="270" r="22" fill="${accent}"/>
      <text x="${w/2 - 130}" y="278" font-family="Georgia, serif" font-size="20" fill="#0f0e0c" text-anchor="middle" font-weight="700">M</text>
      <rect x="${w/2 - 95}" y="248" width="190" height="50" rx="12" fill="#1a1817" stroke="#3a3328"/>
      <text x="${w/2 - 85}" y="268" font-family="Georgia, serif" font-size="13" fill="#c9c0a8">Mum</text>
      <text x="${w/2 - 85}" y="288" font-family="JetBrains Mono, monospace" font-size="10" fill="${accent}">remembered: birthday May 12</text>
      <rect x="${w/2 - 130}" y="340" width="200" height="60" rx="12" fill="#1a1817" stroke="#3a3328"/>
      <text x="${w/2 - 120}" y="365" font-family="Georgia, serif" font-size="13" fill="#c9c0a8">don't forget her</text>
      <text x="${w/2 - 120}" y="385" font-family="Georgia, serif" font-size="13" fill="#c9c0a8">favourite is jasmine tea</text>
      <rect x="${w/2 - 70}" y="430" width="200" height="40" rx="12" fill="${accent}"/>
      <text x="${w/2 - 60}" y="455" font-family="Georgia, serif" font-size="13" fill="#0f0e0c">got it ✓ — added to context</text>
      <text x="${w/2}" y="${h - 80}" font-family="JetBrains Mono, monospace" font-size="11" fill="#524a3e" text-anchor="middle" letter-spacing="3">PERSONAL · CONTEXT · CHAT</text>
    `;
  } else if (project.theme === 'fintech-ledger') {
    // Banking ledger dashboard
    inner = `
      <rect width="${w}" height="${h}" fill="#0f0e0c"/>
      <rect x="60" y="60" width="${w - 120}" height="${h - 120}" rx="4" fill="#1a1817" stroke="${accent}" stroke-width="1"/>
      <text x="100" y="120" font-family="Georgia, serif" font-size="28" font-style="italic" fill="${accent}">MCU Loan System</text>
      <text x="100" y="148" font-family="JetBrains Mono, monospace" font-size="11" fill="#8a8170" letter-spacing="2">CREDIT UNION · LOAN MANAGEMENT</text>
      <line x1="100" y1="180" x2="${w - 100}" y2="180" stroke="#3a3328"/>
      <text x="100" y="220" font-family="JetBrains Mono, monospace" font-size="10" fill="#524a3e" letter-spacing="2">MEMBER</text>
      <text x="320" y="220" font-family="JetBrains Mono, monospace" font-size="10" fill="#524a3e" letter-spacing="2">PRINCIPAL</text>
      <text x="640" y="220" font-family="JetBrains Mono, monospace" font-size="10" fill="#524a3e" letter-spacing="2">RATE</text>
      <text x="900" y="220" font-family="JetBrains Mono, monospace" font-size="10" fill="#524a3e" letter-spacing="2">STATUS</text>
      ${[0,1,2,3,4].map((i) => `
        <line x1="100" y1="${250 + i*60}" x2="${w - 100}" y2="${250 + i*60}" stroke="#3a3328" stroke-dasharray="3 3"/>
        <text x="100" y="${280 + i*60}" font-family="JetBrains Mono, monospace" font-size="14" fill="#c9c0a8">M-0${4421 + i}</text>
        <text x="320" y="${280 + i*60}" font-family="JetBrains Mono, monospace" font-size="14" fill="${accent}">£${(12500 - i*1500).toLocaleString()}.00</text>
        <text x="640" y="${280 + i*60}" font-family="JetBrains Mono, monospace" font-size="14" fill="#c9c0a8">${(6.5 - i*0.2).toFixed(1)}% APR</text>
        <text x="900" y="${280 + i*60}" font-family="JetBrains Mono, monospace" font-size="14" fill="${accent}" letter-spacing="2">${i % 2 === 0 ? 'APPROVED' : 'PENDING'}</text>
      `).join('')}
      <rect x="100" y="${h - 140}" width="${w - 200}" height="40" rx="2" fill="#0f0e0c" stroke="${accent}"/>
      <circle cx="120" cy="${h - 120}" r="5" fill="${accent}"/>
      <text x="140" y="${h - 115}" font-family="JetBrains Mono, monospace" font-size="11" fill="#8a8170" letter-spacing="2">COMMITTEE APPROVED · DISBURSED · 2026</text>
    `;
  } else if (project.theme === 'global-atlas') {
    // 3D-feeling globe with a couple of red signal dots and an editorial title
    const cx = w / 2;
    const cy = h / 2 + 20;
    const r = 280;
    inner = `
      <rect width="${w}" height="${h}" fill="#08070a"/>
      <text x="80" y="100" font-family="Georgia, serif" font-size="40" font-style="italic" fill="${accent}">what is your concern,</text>
      <text x="80" y="150" font-family="Georgia, serif" font-size="40" font-style="italic" fill="#faf6ed">right now?</text>
      <text x="80" y="180" font-family="JetBrains Mono, monospace" font-size="11" fill="#8a8170" letter-spacing="3">ANONYMOUS · GLOBAL · PERMANENT</text>
      <circle cx="${cx}" cy="${cy}" r="${r + 12}" fill="rgba(120,170,230,0.06)"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(26,34,53,0.95)" stroke="rgba(140,180,220,0.18)" stroke-width="1"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="100" fill="none" stroke="rgba(245,234,205,0.06)" stroke-dasharray="2 4"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="200" fill="none" stroke="rgba(245,234,205,0.06)" stroke-dasharray="2 4"/>
      <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="rgba(245,234,205,0.05)"/>
      <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="rgba(245,234,205,0.05)"/>
      <circle cx="${cx + 60}" cy="${cy - 80}" r="8" fill="${accent}"/>
      <circle cx="${cx + 60}" cy="${cy - 80}" r="3" fill="#ffb19a"/>
      <circle cx="${cx - 110}" cy="${cy + 40}" r="5" fill="${accent}" opacity="0.6"/>
      <circle cx="${cx + 30}" cy="${cy + 130}" r="4" fill="${accent}" opacity="0.45"/>
      <text x="${cx + 80}" y="${cy - 88}" font-family="Georgia, serif" font-size="14" font-style="italic" fill="#faf6ed">"loneliness is killing more of us than any disease"</text>
      <text x="${cx + 80}" y="${cy - 70}" font-family="JetBrains Mono, monospace" font-size="9" fill="${accent}" letter-spacing="2">JAPAN · AGE 41</text>
    `;
  } else {
    // Generic fallback
    inner = `
      <rect width="${w}" height="${h}" fill="#0f0e0c"/>
      <text x="${w/2}" y="${h/2}" font-family="Georgia, serif" font-size="42" font-style="italic" fill="${accent}" text-anchor="middle">${project.title}</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export type ProjectTheme =
  | 'ai-chat'
  | 'compliance'
  | 'fintech-ledger'
  | 'sports-card'
  | 'enterprise-gantt'
  | 'cv-frame'
  | 'mobile-chat'
  | 'service-stamp'
  | 'cockpit-ops'
  | 'global-atlas';

export interface ProjectSpecimen {
  kind: ProjectTheme;
  // Free-form structured data per kind, rendered by the card
  data: Record<string, string | number | boolean>;
}

export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'infra' | 'api' | 'ml';
}

export type ProjectCategory = 'saas' | 'platform' | 'enterprise' | 'consultancy' | 'ml' | 'service';

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  saas: 'SaaS',
  platform: 'Platform',
  enterprise: 'Enterprise',
  consultancy: 'Consultancy',
  ml: 'ML / CV',
  service: 'Service',
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
    theme: 'ai-chat',
    accent: '#22d3ee',
    staticPreview: 'assets/projects/promptmysite.png',
    previewCaption: 'fig. 1 — promptmysite.com · live',
    specimen: {
      kind: 'ai-chat',
      data: {
        userPrompt: 'show me your services',
        aiResponse: 'rendering 4 service cards →',
        tokens: 1247,
      },
    },
  },
  {
    id: 'mooncake',
    title: 'Mooncake',
    tagline: 'Personal-context AI chat app that remembers your relationships',
    description:
      'A monorepo mobile-first chat application that learns about the people in your life and uses that context to provide personalized, relationship-aware conversations. Full-stack with React Native mobile, TypeScript API, and managed database.',
    techStack: [
      { name: 'React Native', category: 'frontend' },
      { name: 'Expo', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Hono', category: 'backend' },
      { name: 'Drizzle ORM', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Inngest', category: 'backend' },
      { name: 'Clerk', category: 'api' },
      { name: 'Claude API', category: 'api' },
      { name: 'OpenAI', category: 'api' },
    ],
    features: [
      'Personal context system that learns and remembers relationship details',
      'Cross-platform mobile app with native feel via Expo',
      'Real-time sync and persistent conversation history',
      'Async job processing with Inngest for background tasks',
    ],
    liveUrl: 'https://getmooncake.com',
    category: 'saas',
    gradient: 'linear-gradient(135deg, #f87171, #fb923c)',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6m-3-3h6"/>',
    theme: 'mobile-chat',
    accent: '#f472b6',
    staticPreview: 'assets/projects/mooncake.png',
    previewCaption: 'fig. 2 — getmooncake.com · live',
    specimen: {
      kind: 'mobile-chat',
      data: {
        contact: 'Mum',
        lastSeen: 'remembered: birthday is May 12',
        message: 'don\'t forget her favourite is jasmine tea',
        unread: 2,
      },
    },
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
    theme: 'sports-card',
    accent: '#5eb8b3',
    staticPreview: 'assets/projects/rugbyunlocked.png',
    previewCaption: 'fig. 3 — rugbyunlocked.com · live',
    specimen: {
      kind: 'sports-card',
      data: {
        position: 'OPENSIDE FLANKER',
        cap: 'No. 7',
        country: 'NZL',
        matchScore: '94',
      },
    },
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
    theme: 'compliance',
    accent: '#ff5722',
    staticPreview: 'assets/projects/futureproof.png',
    previewCaption: 'fig. 4 — futureproofsolutions.im · live',
    specimen: {
      kind: 'compliance',
      data: {
        ref: 'FPS-2025-014',
        scope: 'GDPR · ISO 27001 · SOC 2',
        status: 'CERTIFIED',
        signedBy: 'C. Musa, AD',
      },
    },
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
    liveUrl: 'https://virtuous-optimism-production.up.railway.app/review',
    category: 'ml',
    gradient: 'linear-gradient(135deg, #f59e0b, #10b981)',
    icon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    theme: 'cv-frame',
    accent: '#fbbf24',
    previewCaption: 'fig. 5 — annotation tool · review interface',
    specimen: {
      kind: 'cv-frame',
      data: {
        frame: '01837 / 02400',
        detection: 'PLAYER · 0.94',
        event: 'CARRY → TACKLE',
        f1: 'F1 = 0.823',
      },
    },
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
    theme: 'fintech-ledger',
    accent: '#34d399',
    previewCaption: 'fig. 6 — internal · credit union platform',
    specimen: {
      kind: 'fintech-ledger',
      data: {
        memberId: 'M-04421',
        principal: '£12,500.00',
        rate: '6.5% APR',
        status: 'APPROVED',
      },
    },
  },
  {
    id: 'fixed-shipped',
    title: 'Fixed & Shipped',
    tagline: 'Senior full-stack engineering for production-ready prototypes',
    description:
      'Personal consultancy service fixing vibe-coded prototypes and shipping them to production. Leveraging 8+ years of fintech engineering (ex-UBS, Credit Suisse) to transform almost-working AI-built code into deployed, observable, production systems.',
    techStack: [
      { name: 'Full-Stack', category: 'frontend' },
      { name: 'React / Angular', category: 'frontend' },
      { name: 'Spring Boot / Node', category: 'backend' },
      { name: 'PostgreSQL / MongoDB', category: 'database' },
      { name: 'AWS / GCP / Railway', category: 'infra' },
      { name: 'Docker', category: 'infra' },
      { name: 'Observability', category: 'infra' },
    ],
    features: [
      'Turn vague AI prototypes into robust, tested systems',
      'Production deployment & infrastructure setup',
      'Observability & monitoring implementation',
      'Architecture review and modernization',
    ],
    liveUrl: 'https://fixedandshipped.com',
    category: 'service',
    gradient: 'linear-gradient(135deg, #78350f, #9ca3af)',
    icon: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    theme: 'service-stamp',
    accent: '#ff7a45',
    staticPreview: 'assets/projects/fixedandshipped.png',
    previewCaption: 'fig. 7 — fixedandshipped.com · live',
    specimen: {
      kind: 'service-stamp',
      data: {
        intake: 'Vibe-coded MVP',
        shipped: 'Production-ready system',
        days: '14',
        guarantee: 'Deployed · Observable · Tested',
      },
    },
  },
  {
    id: 'mcu-cockpit',
    title: 'MCU Cockpit',
    tagline: 'Mission control for tickets, deploys, agents, and logs',
    description:
      'A unified operations console wired into GitHub for the entire project lifecycle — triage tickets, dispatch autonomous coding agents to tackle them, run E2E suites on demand, push deploys, and tail production logs from a single cockpit. Replaces a dozen browser tabs with one console built around the way I actually ship work.',
    techStack: [
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Angular', category: 'frontend' },
      { name: 'Node.js', category: 'backend' },
      { name: 'GitHub API', category: 'api' },
      { name: 'Webhooks', category: 'api' },
      { name: 'Claude Agent SDK', category: 'api' },
      { name: 'Playwright', category: 'infra' },
      { name: 'Docker', category: 'infra' },
    ],
    features: [
      'GitHub-integrated ticket board with one-click triage and assignment',
      'Dispatches autonomous coding agents to tackle tickets end-to-end',
      'On-demand E2E test runs with pass/fail breakdown and replay',
      'Push-button deploys with live build pipeline and instant rollback',
      'Streaming production log viewer with filter, search, and tailing',
    ],
    category: 'platform',
    gradient: 'linear-gradient(135deg, #38bdf8, #818cf8)',
    icon: '<rect x="3" y="4" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="7 14 9 16 7 18"/><line x1="13" y1="18" x2="17" y2="18"/>',
    theme: 'cockpit-ops',
    accent: '#38bdf8',
    previewCaption: 'fig. 8 — internal · ops command center',
    specimen: {
      kind: 'cockpit-ops',
      data: {
        tickets: '12 OPEN',
        deploys: '3 RUNNING',
        agents: '2 ACTIVE',
        activity1: '#341 onboarding bug',
        activity1State: 'AGENT',
        activity2: 'deploy/main → prod',
        activity2State: 'RUNNING',
        activity3: 'e2e suite (24/24)',
        activity3State: 'PASSED',
        activity4: 'agent#1 → PR opened',
        activity4State: 'REVIEW',
      },
    },
  },
  {
    id: 'whatisyourconcern',
    title: 'What is your concern?',
    tagline: 'An anonymous global record of what humanity is afraid of, on a draggable 3D globe',
    description:
      'A literal globe you can drag and zoom — voices float up from countries in real time, click any country (yes, including Antarctica) to read what people there are saying, filter by topic and age, and post your own anonymously. No accounts, no email. Built end to end in a single weekend session: 3D orthographic globe in pure SVG (no three.js), Supabase persistence, upvotes-only resonance signal, URL/handle moderation, and Claude Haiku translating non-English submissions on the way in.',
    techStack: [
      { name: 'Next.js 16', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Tailwind v4', category: 'frontend' },
      { name: 'd3-geo', category: 'frontend' },
      { name: 'motion', category: 'frontend' },
      { name: 'Supabase', category: 'database' },
      { name: 'Claude Haiku', category: 'api' },
      { name: 'Cloudflare Turnstile', category: 'infra' },
      { name: 'Vercel', category: 'infra' },
    ],
    features: [
      '3D draggable orthographic globe with atmospheric glow, scan line, and 220 stars — pure SVG',
      '165-country click coverage including Antarctica; auto-pan to selection on click',
      'Anonymous posts plus responses plus upvotes ("this resonates"), per-IP rate-limited',
      'English-by-default with originals shown beneath; auto-translation via Claude Haiku',
      "Live polling — other people's posts surface within 20 seconds without refresh",
    ],
    liveUrl: 'https://whatisyourconcern.com',
    category: 'saas',
    gradient: 'linear-gradient(135deg, #c7321b, #d4a24a)',
    icon: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><circle cx="16" cy="9" r="1.6" fill="currentColor"/>',
    theme: 'global-atlas',
    accent: '#c7321b',
    // staticPreview omitted — polaroid auto-fetches a fresh screenshot via
    // Microlink at runtime. Drop a PNG at assets/projects/whatisyourconcern.png
    // and re-add staticPreview if you want instant first-paint loading.
    previewCaption: 'fig. 9 — whatisyourconcern.com · live',
    specimen: {
      kind: 'global-atlas',
      data: {
        voices: 'LIVE',
        countries: '165 CLICKABLE',
        latest: 'JP · age 41 · loneliness',
        signal: '+ THIS RESONATES',
      },
    },
  },
];
