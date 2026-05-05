export interface SprintEntry {
  /** "MAY 01" — top-left date stamp on the card */
  date: string;
  /** "THU" — sub-line under the date */
  weekday: string;
  /** Optional sub-header sitting above grouped same-day cards (e.g. "THE BLITZ") */
  chapter?: string;
  /** ISO yyyy-mm-dd, used for ordering and machine readability */
  isoDate: string;
  title: string;
  tagline: string;
  liveUrl: string;
  repoUrl?: string;
  /** anchor id of the matching entry in The Archive, if one exists */
  archiveSlug?: string;
  /** Path under src/assets — leave undefined to use a live Microlink screenshot */
  staticPreview?: string;
  /** Themed accent matching the archive entry where applicable */
  accent: string;
  /** Three to five short, factual bullets pulled from the commit log */
  buildNotes: string[];
  /** "11 commits · 17:26 → 21:50 UTC" */
  windowSummary: string;
}

/**
 * Hand-curated, in chronological order.
 * Two cards share May 1 — they render under a single "THE BLITZ" sub-header.
 *
 * Sourced from commit history under github.com/coeymusa (and one work repo
 * at Future-Proof-Solutions-Ltd), window 2026-04-27 → 2026-05-04. Build
 * notes are derived from commit messages, not marketing copy — factual.
 */

/** Lifetime / aggregate stats surfaced in the "Off the record" section. */
export interface OffTheRecordRow {
  /** Display name — may be redacted. */
  name: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'WORK · PRIVATE';
  commits: number;
  /** One-line context — what this repo is. */
  blurb: string;
}

export const OFF_THE_RECORD: OffTheRecordRow[] = [
  {
    name: 'coeymusa/What-is-your-concern',
    privacy: 'PUBLIC',
    commits: 103,
    blurb: 'Anonymous global concern map (the May 1 launch above)',
  },
  {
    name: 'coeymusa/mooncake',
    privacy: 'PRIVATE',
    commits: 59,
    blurb: 'Personal-context AI chat — repo private, product live at getmooncake.com',
  },
  {
    name: 'coeymusa/portfolio-website',
    privacy: 'PUBLIC',
    commits: 35,
    blurb: 'This site you are reading — codex redesign + dice/oracle + new entries',
  },
  {
    name: 'Future-Proof-Solutions-Ltd/mcu-authenticator',
    privacy: 'WORK · PRIVATE',
    commits: 18,
    blurb: 'Spring Auth Server for the credit-union loan platform — day-job throughput',
  },
  {
    name: 'coeymusa/cariadletters',
    privacy: 'PRIVATE',
    commits: 16,
    blurb: 'Couples SaaS — launched in 14 commits, now at 70+ with i18n × 8 and a Lookbook',
  },
  {
    name: 'coeymusa/yinyan-news',
    privacy: 'PUBLIC',
    commits: 11,
    blurb: 'Paired editorial news (the May 1 launch above)',
  },
  {
    name: 'coeymusa/promptmysite-full',
    privacy: 'PRIVATE',
    commits: 7,
    blurb: 'PromptMySite SaaS — maintenance commits across the same week',
  },
  {
    name: 'coeymusa/rugby-workspace',
    privacy: 'PRIVATE',
    commits: 1,
    blurb: 'Rugby Unlocked monorepo — single touch-up commit',
  },
];

/** Headline aggregate displayed above the per-repo list. */
export const OFF_THE_RECORD_TOTALS = {
  commits: 250,
  repos: 8,
  publicRepos: 3,
  privateRepos: 5,
  /** Personal GitHub join date — for the "I've been at this for years" context line. */
  githubJoined: 'April 2015',
};

/**
 * "Zoomed out" — yearly context so the 250-commit window doesn't read as a
 * one-off. The headline figure is what GitHub itself displays on the profile
 * (commits + PRs + issues + reviews + repo creations across public + private
 * repos with the "include private contributions" toggle on). Other figures
 * are commit-only via `gh api search/commits`.
 */
export const ZOOMED_OUT = {
  /** GitHub-profile contributions in the trailing 12 months — the number on the calendar widget. */
  lastYearContributions: 2453,
  /** Commits-only in 2026 year-to-date — sourced from search/commits. */
  ytdCommits: 1413,
  /** Average contributions per week over the last 12 months. 2453 / 52 ≈ 47. */
  weeklyAverage: 47,
  /**
   * This week's 250 commits ÷ ~47 contributions/week ≈ 5.3 — rounded to ~5
   * for a clean punchline. Calls out the gap without overclaiming.
   */
  weekMultiple: 5,
};
export const SPRINT_ENTRIES: SprintEntry[] = [
  {
    date: 'APR 28',
    weekday: 'TUE',
    isoDate: '2026-04-28',
    title: 'Mooncake',
    tagline: 'A mobile chat app that learns the people in your life and remembers them.',
    liveUrl: 'https://getmooncake.com',
    repoUrl: 'https://github.com/coeymusa/mooncake',
    archiveSlug: 'mooncake',
    staticPreview: 'assets/projects/mooncake.png',
    accent: '#f472b6',
    buildNotes: [
      'Theme system + per-user accent palettes; landing redesign with default "garden" theme',
      'Railway/Docker deploy pipeline, demo mode, pricing section, and "You" profile page',
      'Hono backend, Neon Postgres, Drizzle, Clerk auth, Inngest for async jobs',
      'Claude Sonnet drives chat; Claude Haiku extracts relationship context in the background',
    ],
    windowSummary: '~16 commits across Apr 28 → Apr 30',
  },
  {
    date: 'MAY 01',
    weekday: 'THU',
    chapter: 'THE BLITZ',
    isoDate: '2026-05-01',
    title: 'yinyan.news',
    tagline: 'Paired editorial: for every hard headline, an equal-weight hopeful one.',
    liveUrl: 'https://yinyan.news',
    repoUrl: 'https://github.com/coeymusa/yinyan-news',
    accent: '#d4a24a',
    buildNotes: [
      '11 commits between 17:26 and 21:50 UTC — repo created same afternoon',
      '12 real, sourced pairings; topic landing pages; /random stumble; /today short URL',
      'NewsMediaOrganization + ItemList JSON-LD, dynamic per-pairing OG images, news sitemap',
      'RSS feed, embed widget at /embed/[slug], press kit, IndexNow auto-ping, Vercel Analytics',
    ],
    windowSummary: '11 commits · 17:26 → 21:50 UTC',
  },
  {
    date: 'MAY 01',
    weekday: 'THU',
    chapter: 'THE BLITZ',
    isoDate: '2026-05-01',
    title: 'whatisyourconcern.com',
    tagline: 'An anonymous global record of what humanity is afraid of, on a draggable 3D globe.',
    liveUrl: 'https://whatisyourconcern.com',
    repoUrl: 'https://github.com/coeymusa/What-is-your-concern',
    archiveSlug: 'whatisyourconcern',
    staticPreview: 'assets/projects/whatisyourconcern.png',
    accent: '#c7321b',
    buildNotes: [
      '23 commits between 18:22 and 22:04 UTC — same calendar afternoon as yinyan',
      'SSR homepage hydrated from Supabase; dynamic 1200×630 OG cards per share',
      '/dispatch/[id] permalinks with related voices and the full solutions thread',
      'Embeddable globe widget at /embed/globe, /press kit, /random, focus traps on every dialog',
    ],
    windowSummary: '23 commits · 18:22 → 22:04 UTC',
  },
  {
    date: 'MAY 03',
    weekday: 'SAT',
    isoDate: '2026-05-03',
    title: 'whatisyourconcern.com — SEO long-tail',
    tagline: 'Two days later, a 200-page content expansion on top of the same globe.',
    liveUrl: 'https://whatisyourconcern.com/world',
    repoUrl: 'https://github.com/coeymusa/What-is-your-concern',
    archiveSlug: 'whatisyourconcern',
    accent: '#c7321b',
    buildNotes: [
      '184 country dossiers at /world/[code] and 12 topic indexes at /topics/[slug]',
      '/featured press page, FAQ schema, sitemap +200 URLs, IndexNow ping for every new route',
      'Public discourse pulled from GDELT, Reddit, HN; Google News RSS as primary feed',
    ],
    windowSummary: '1 commit · +200 routes',
  },
  {
    date: 'MAY 04',
    weekday: 'SUN',
    isoDate: '2026-05-04',
    title: 'cariadletters.com',
    tagline: 'Private SaaS for couples — upload photos, AI designs a one-of-one site, deploys to a custom subdomain.',
    liveUrl: 'https://cariadletters.com',
    repoUrl: 'https://github.com/coeymusa/cariadletters',
    archiveSlug: 'cariadletters',
    accent: '#e4846b',
    buildNotes: [
      '14 commits between 17:41 and 22:44 UTC — repo created the same evening',
      'Clerk auth, dashboard, AI spec generation (Anthropic), photo pipeline (R2 → S3, eu-west-1)',
      'Stripe billing with paywall, 14-day refund policy, AI spend tracked per couple/site/operation',
      'Resend transactional email; multi-subdomain rendering; auth-aware marketing header',
      'Beyond the window: by Day 8 the repo crossed 70 commits — added i18n × 8 languages (locale carried through to the AI prose), a public Lookbook of styled demos (polaroid/magazine/cinematic/editorial), and geo-detected currency on billing',
    ],
    windowSummary: '14 commits launch night · 70+ by week\u2009two',
  },
];
