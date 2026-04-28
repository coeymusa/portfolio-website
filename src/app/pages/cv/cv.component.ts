import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="cv">
      <div class="container">
        <!-- Top folio bar -->
        <header class="folio">
          <a routerLink="/" class="back-link">
            <span class="back-arrow">←</span>
            <span class="back-text">return to archive</span>
          </a>
          <span class="folio-rule"></span>
          <span class="folio-mono">CURRICULUM VITÆ · APR MMXXVI</span>
        </header>

        <!-- Masthead -->
        <header class="masthead">
          <div class="masthead-rule">
            <span class="rule-tag">APPENDIX</span>
          </div>
          <h1 class="cv-title">
            <em>The</em> Author<span class="period">.</span>
          </h1>
          <p class="cv-subtitle">
            Corey Musa <span class="sep">·</span> <em>Full-stack engineer</em>
            <span class="sep">·</span> Zürich, CH
          </p>
        </header>

        <!-- Statement -->
        <section class="statement-block">
          <div class="statement-meta">
            <span class="meta-num">i.</span>
            <span class="meta-label">statement</span>
          </div>
          <p class="statement">
            <em>N</em>ine years in software, all within
            <strong>fintech and banking</strong>. Associate Director at
            twenty-seven. Learned not just how to write software but how
            to communicate ideas, formalise processes, and drive delivery
            across distributed teams. When AI emerged, it reignited a
            passion for building. I've shipped
            <strong>three AI-powered platforms solo</strong> in six months
            — all live, all generating revenue. Combined with deep
            enterprise experience and architectural thinking, I build
            software that's both
            <strong>technically sound and commercially real</strong>.
          </p>
        </section>

        <!-- Experience -->
        <section class="section-block">
          <div class="section-rule">
            <span class="rule-tag">CHAPTER ONE — ENGAGEMENTS</span>
          </div>
          <h2 class="section-title">Experience</h2>

          <ol class="roles">
            @for (role of roles; track role.company + role.title; let i = $index) {
              <li class="role" [class.role--early]="role.early">
                <aside class="role-numeral">
                  <span class="numeral-prefix">№</span>
                  <span class="numeral-digit">{{ pad(roles.length - i) }}</span>
                </aside>

                <div class="role-content">
                  <header class="role-header">
                    <h3 class="role-title">{{ role.title }}</h3>
                    <p class="role-company">
                      <em>at</em> {{ role.company }}
                    </p>
                    <div class="role-meta">
                      <span class="role-loc">{{ role.location }}</span>
                      <span class="dot">·</span>
                      <span class="role-period">{{ role.period }}</span>
                    </div>
                  </header>

                  @if (role.context) {
                    <p class="role-context">{{ role.context }}</p>
                  }

                  <ul class="role-bullets">
                    @for (bullet of role.bullets; track bullet; let b = $index) {
                      <li class="bullet">
                        <span class="bullet-num">{{ pad(b + 1) }}</span>
                        <span class="bullet-text">{{ bullet }}</span>
                      </li>
                    }
                  </ul>
                </div>
              </li>
            }
          </ol>
        </section>

        <!-- Selected Works callout -->
        <section class="section-block">
          <div class="section-rule">
            <span class="rule-tag">CHAPTER TWO — SELECTED WORKS</span>
          </div>
          <h2 class="section-title">Recent Builds</h2>

          <p class="works-blurb">
            Eight shipped projects spanning AI SaaS, fintech platforms,
            ML pipelines, mobile apps, developer tooling, and consultancy services.
            <a routerLink="/" class="works-link">
              <span class="works-arrow">→</span>
              <span>see Chapter One for the live archive</span>
            </a>
          </p>
        </section>

        <!-- Education -->
        <section class="section-block">
          <div class="section-rule">
            <span class="rule-tag">CHAPTER THREE — STUDIES</span>
          </div>
          <h2 class="section-title">Education</h2>

          <div class="education">
            <span class="degree">BSc Computer Science</span>
            <span class="university">
              <em>Newcastle University</em>
              <span class="dot">·</span>
              MMXIV — MMXVII
            </span>
          </div>
        </section>

        <!-- Languages -->
        <section class="section-block">
          <div class="section-rule">
            <span class="rule-tag">CHAPTER FOUR — TONGUES</span>
          </div>
          <h2 class="section-title">Languages</h2>

          <ul class="languages">
            @for (lang of languages; track lang.name; let i = $index) {
              <li class="lang">
                <span class="lang-num">{{ pad(i + 1) }}</span>
                <span class="lang-name">{{ lang.name }}</span>
                <span class="lang-level"><em>{{ lang.level }}</em></span>
              </li>
            }
          </ul>
        </section>

        <!-- Closing -->
        <footer class="closing">
          <span class="mono">— end of appendix —</span>
        </footer>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .cv {
      background: var(--ink);
      min-height: 100vh;
      padding: 6rem 0 4rem;
      position: relative;
      z-index: 2;
    }

    /* Top folio */
    .folio {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-mute);
      margin-bottom: 4rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text);
      transition: color 0.3s;
    }

    .back-link:hover {
      color: var(--ember);
    }

    .back-arrow {
      color: var(--ember);
      font-size: 0.95rem;
    }

    .folio-rule {
      flex: 1;
      height: 1px;
      background: var(--rule);
    }

    .folio-mono {
      white-space: nowrap;
    }

    /* Masthead */
    .masthead {
      max-width: 780px;
      margin-bottom: 5rem;
    }

    .masthead-rule {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .masthead-rule::before {
      content: '';
      flex: 0 0 60px;
      height: 1px;
      background: var(--ember);
    }

    .masthead-rule::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--rule);
    }

    .rule-tag {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      color: var(--brass);
    }

    .cv-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(3rem, 8vw, 6rem);
      line-height: 0.95;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.04em;
      margin-bottom: 1.5rem;
    }

    .cv-title em {
      font-style: italic;
      font-weight: 200;
      color: var(--text-mute);
      font-size: 0.7em;
      margin-right: 0.25rem;
    }

    .cv-title .period {
      color: var(--ember);
    }

    .cv-subtitle {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.15rem;
      color: var(--text);
      line-height: 1.6;
    }

    .cv-subtitle em {
      color: var(--paper);
      font-weight: 500;
    }

    .sep {
      color: var(--rule-light);
      margin: 0 0.4rem;
      font-style: normal;
    }

    /* Statement block */
    .statement-block {
      margin-bottom: 6rem;
      max-width: 780px;
      padding-top: 2rem;
      border-top: 1px solid var(--rule);
    }

    .statement-meta {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .meta-num {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 0.95rem;
      color: var(--brass);
    }

    .meta-label {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--text-mute);
    }

    .statement {
      font-family: var(--font-display);
      font-size: 1.2rem;
      line-height: 1.75;
      color: var(--text);
      max-width: 65ch;
    }

    .statement em:first-of-type {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: 3.5em;
      float: left;
      line-height: 0.85;
      margin-right: 0.6rem;
      margin-top: 0.4rem;
      color: var(--ember);
      font-weight: 400;
      font-style: italic;
    }

    .statement strong {
      color: var(--paper);
      font-weight: 500;
      font-style: italic;
    }

    /* Section blocks */
    .section-block {
      margin-bottom: 6rem;
    }

    .section-rule {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .section-rule::before {
      content: '';
      flex: 0 0 30px;
      height: 1px;
      background: var(--ember);
    }

    .section-rule::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--rule);
    }

    .section-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(2.25rem, 5vw, 3.5rem);
      line-height: 1;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.03em;
      margin-bottom: 3rem;
    }

    /* Roles */
    .roles {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }

    .role {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 2.5rem;
      align-items: start;
      padding-top: 2.5rem;
      border-top: 1px solid var(--rule);
    }

    .role:first-child {
      padding-top: 0;
      border-top: none;
    }

    /* Early career — small gap before, slightly muted treatment */
    .role--early {
      margin-top: 2.5rem;
      padding-top: 3.5rem;
    }

    .role--early::before {
      content: '· · ·';
      display: block;
      font-family: var(--font-mono);
      letter-spacing: 0.5em;
      color: var(--rule-light);
      text-align: center;
      grid-column: 1 / -1;
      margin-bottom: 2rem;
      margin-top: -2rem;
    }

    .role--early .numeral-digit {
      color: var(--brass-mute);
    }

    .role--early .role-company {
      color: var(--brass-mute);
    }

    .role-numeral {
      display: flex;
      align-items: flex-start;
      gap: 0.4rem;
      line-height: 0.85;
    }

    .numeral-prefix {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.25rem;
      color: var(--brass);
      font-weight: 200;
      margin-top: 0.5rem;
    }

    .numeral-digit {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(3.5rem, 6vw, 5rem);
      font-weight: 200;
      color: var(--ember);
      letter-spacing: -0.05em;
      line-height: 1;
    }

    .role-content {
      max-width: 720px;
    }

    .role-header {
      margin-bottom: 1rem;
    }

    .role-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(1.5rem, 2.5vw, 2rem);
      font-weight: 400;
      line-height: 1.1;
      color: var(--paper);
      letter-spacing: -0.02em;
      margin-bottom: 0.4rem;
    }

    .role-company {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.1rem;
      color: var(--ember);
      margin-bottom: 0.5rem;
    }

    .role-company em {
      color: var(--text-mute);
      font-weight: 200;
      margin-right: 0.25rem;
    }

    .role-meta {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-mute);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dot {
      color: var(--rule-light);
    }

    .role-context {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1rem;
      color: var(--text);
      line-height: 1.6;
      margin: 1.25rem 0;
      padding: 1rem 1.25rem;
      border-left: 2px solid var(--brass);
      background: linear-gradient(90deg, var(--ink-warm), transparent);
    }

    .role-bullets {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-top: 1.25rem;
    }

    .bullet {
      display: grid;
      grid-template-columns: 2.25rem 1fr;
      gap: 0.75rem;
      font-family: var(--font-display);
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text);
    }

    .bullet-num {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--brass-mute);
      padding-top: 0.2rem;
      letter-spacing: 0.1em;
    }

    /* Skills */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2.5rem;
    }

    .skill-block {
      display: flex;
      flex-direction: column;
    }

    .skill-heading {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--rule);
      margin-bottom: 1rem;
    }

    .skill-pills {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 0.6rem;
    }

    .pill {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      letter-spacing: 0.05em;
      padding: 0.35rem 0.7rem;
      color: var(--text);
      border: 1px solid var(--rule-light);
      background: var(--ink-warm);
      transition: all 0.2s;
    }

    .pill:hover {
      color: var(--ember);
      border-color: var(--ember);
    }

    /* Education */
    .education {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.5rem 0;
    }

    .degree {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.02em;
    }

    .university {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.05rem;
      color: var(--text-mute);
    }

    .university em {
      color: var(--ember);
      font-style: italic;
      font-weight: 500;
    }

    /* Selected Works */
    .works-blurb {
      font-family: var(--font-display);
      font-size: 1.15rem;
      line-height: 1.7;
      color: var(--text);
      max-width: 65ch;
    }

    .works-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      letter-spacing: 0.05em;
      color: var(--ember);
      text-transform: uppercase;
      transition: gap 0.3s;
      padding-bottom: 0.2rem;
      border-bottom: 1px solid transparent;
      width: fit-content;
    }

    .works-link:hover {
      gap: 0.85rem;
      border-color: var(--ember);
    }

    .works-arrow {
      font-size: 1.1rem;
    }

    /* Languages */
    .languages {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .lang {
      display: grid;
      grid-template-columns: 2.5rem 1fr auto;
      gap: 1rem;
      align-items: baseline;
      padding: 0.75rem 0;
      border-bottom: 1px dashed var(--rule);
    }

    .lang:last-child {
      border-bottom: none;
    }

    .lang-num {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--brass-mute);
      letter-spacing: 0.1em;
    }

    .lang-name {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 400;
      color: var(--paper);
    }

    .lang-level {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1rem;
      color: var(--text-mute);
    }

    .lang-level em {
      color: var(--ember);
    }

    /* Closing */
    .closing {
      text-align: center;
      margin-top: 6rem;
      padding-top: 3rem;
      border-top: 1px solid var(--rule);
    }

    .closing .mono {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--text-faint);
    }

    /* Responsive */
    @media (max-width: 900px) {
      .role {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }

      .role-numeral {
        align-items: flex-end;
      }

      .numeral-digit {
        font-size: 3rem;
      }
    }

    @media (max-width: 640px) {
      .cv {
        padding: 5rem 0 3rem;
      }

      .folio {
        margin-bottom: 2.5rem;
        font-size: 0.6rem;
        gap: 0.75rem;
      }

      .folio-rule {
        display: none;
      }

      .masthead {
        margin-bottom: 3.5rem;
      }

      .masthead-rule::before {
        flex: 0 0 30px;
      }

      .rule-tag {
        font-size: 0.6rem;
      }

      .statement-block {
        margin-bottom: 4rem;
      }

      .statement {
        font-size: 1.05rem;
      }

      .statement em:first-of-type {
        font-size: 2.5em;
      }

      .section-block {
        margin-bottom: 4rem;
      }

      .roles {
        gap: 2.5rem;
      }

      .role {
        padding-top: 2rem;
      }

      .skills-grid {
        gap: 1.75rem;
      }

      .closing {
        margin-top: 4rem;
        padding-top: 2rem;
      }
    }
  `,
})
export class CvComponent {
  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  readonly roles = [
    {
      title: 'Associate Director',
      company: 'UBS',
      location: 'Zurich, Switzerland',
      period: 'Jun 2024 – Jul 2025',
      context:
        'UBS acquired Credit Suisse in the largest Swiss banking merger in history. Tasked with consolidating two wealth management platforms — Credit Suisse\'s Angular stack onto UBS\'s React stack — and rolling out to EMEA.',
      bullets: [
        'Led full-stack Java 17 / React development on UBS\'s wealth platform — the receiving side of the largest banking integration in Swiss history',
        'Drove the Angular-to-React migration of Credit Suisse features into the UBS platform — translating components, state, and integration patterns across two very different frameworks',
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
        'Full-stack Angular / Java delivery with complete ownership: requirements, design, implementation, testing, deployment',
        'Built and enforced development standards across internationally distributed teams',
        'Ran Java workshops and knowledge-sharing sessions to upskill team members across multiple offices',
      ],
    },
    {
      title: 'Frontend Development Consultant · Backbase Specialist',
      company: 'Credit Suisse (Contract)',
      location: 'Zurich, Switzerland',
      period: 'Aug 2020 – Feb 2023',
      context: '',
      bullets: [
        'Brought in as a Backbase platform specialist after my time at Backbase HQ — extended and customised the Backbase wealth-management widgets for Credit Suisse advisors',
        'Architected Angular 12 micro frontends on top of the Backbase orchestration layer — adopted across multiple business units as the standard component library for the wealth platform',
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
    {
      title: 'Crew Member',
      company: "McDonald's",
      location: 'United Kingdom',
      period: '2013 – 2015',
      context: '',
      bullets: [
        'First job. Front of house, kitchen, drive-thru — worked every station on rotating shifts through sixth form',
        'Learned how to keep my head when the queue is out the door — composure under pressure, fast hands, fast decisions',
        'Picked up the muscle memory for showing up, doing the work, and looking after teammates',
      ],
      early: true,
    },
  ];

  readonly languages = [
    { name: 'English', level: 'Native' },
  ];
}
