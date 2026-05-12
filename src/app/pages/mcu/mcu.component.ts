import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PagePair {
  slug: string;
  eyebrow: string;
  title: string;
  note: string;
  oldUrl: string;
  newUrl: string;
  oldShort: string;
  newShort: string;
  before: string;
  after: string;
}

@Component({
  selector: 'app-mcu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="case-study">
      <section class="section">
        <div class="container">

          <!-- Masthead -->
          <header class="masthead">
            <div class="masthead-rule">
              <span class="rule-tag">CHAPTER FOUR · CASE STUDY</span>
            </div>
            <h1 class="title">
              <em>The</em> Manx Cutover
            </h1>
            <p class="subtitle">
              A regulated credit union, dragged from 2014 to 2026 without losing
              its members along the way.
              <span class="mono">[ ISLE OF MAN · FSA REGULATED ]</span>
            </p>
          </header>

          <!-- Stat strip -->
          <div class="stat-strip" aria-label="Project scale">
            <div class="stat">
              <span class="stat-num">7</span>
              <span class="stat-label">LOAN PRODUCTS</span>
            </div>
            <div class="stat">
              <span class="stat-num">22</span>
              <span class="stat-label">PAGES REBUILT</span>
            </div>
            <div class="stat">
              <span class="stat-num">1993</span>
              <span class="stat-label">MEMBER-OWNED SINCE</span>
            </div>
            <div class="stat">
              <span class="stat-num">£50k</span>
              <span class="stat-label">DEPOSIT PROTECTION</span>
            </div>
          </div>

          <!-- Lede -->
          <p class="lede">
            <em>The brief</em>: Manx Credit Union is the only credit union on the
            Isle of Man &mdash; FSA-regulated, member-owned, run for the benefit
            of its borrowers. Its previous website read like a 2014 classic-ASP
            build: stock-photo group of strangers, neon green, cookie bar at the
            bottom, no live calculator. The new build keeps every regulatory
            disclosure, every loan product, and every form &mdash; and adds the
            things a credit union actually needs in 2026.
          </p>

          <!-- ===== PART ONE · VISUAL DELTA ===== -->
          <section class="compare-section" aria-labelledby="compare-h">
            <header class="section-head">
              <div class="section-rule">
                <span class="section-eyebrow">PART ONE · THE VISUAL DELTA</span>
              </div>
              <h2 id="compare-h" class="section-title">
                <em>Drag</em> to compare
              </h2>
              <p class="section-lede">
                Both versions are live as of writing. Pull the divider left for
                the legacy site, right for the rebuild. Above-the-fold captures
                from production, no retouching.
              </p>
            </header>

            <div class="compare-grid">
              @for (pair of pairs; track pair.slug; let i = $index) {
                <article class="compare" [attr.data-slug]="pair.slug">
                  <header class="compare-head">
                    <span class="compare-eyebrow">{{ pair.eyebrow }}</span>
                    <h3 class="compare-name">{{ pair.title }}</h3>
                    <p class="compare-note">{{ pair.note }}</p>
                  </header>

                  <div
                    class="compare-slider"
                    [attr.data-idx]="i"
                    (mousedown)="onPointerDown($event, i)"
                    (touchstart)="onPointerDown($event, i)"
                    role="img"
                    [attr.aria-label]="pair.title + ' — drag to compare old vs new'"
                  >
                    <img
                      class="compare-img compare-img--before"
                      [src]="pair.before"
                      [alt]="pair.title + ' on the legacy mcu.im site'"
                      loading="lazy"
                      decoding="async"
                    />
                    <img
                      class="compare-img compare-img--after"
                      [src]="pair.after"
                      [alt]="pair.title + ' on the rebuilt MCU site'"
                      [style.clip-path]="afterClip(i)"
                      loading="lazy"
                      decoding="async"
                    />
                    <div class="compare-handle" [style.left.%]="splits()[i]">
                      <span class="compare-handle-line"></span>
                      <span class="compare-handle-knob" aria-hidden="true">⇄</span>
                    </div>
                    <span class="compare-label compare-label--before">LEGACY</span>
                    <span class="compare-label compare-label--after">REBUILD</span>
                  </div>

                  <footer class="compare-urls">
                    <a class="compare-url" [href]="pair.oldUrl" target="_blank" rel="noopener noreferrer">
                      <span class="url-tag">OLD</span>
                      <span class="url-text">{{ pair.oldShort }}</span>
                      <span class="url-arrow">↗</span>
                    </a>
                    <a class="compare-url" [href]="pair.newUrl" target="_blank" rel="noopener noreferrer">
                      <span class="url-tag url-tag--new">NEW</span>
                      <span class="url-text">{{ pair.newShort }}</span>
                      <span class="url-arrow">↗</span>
                    </a>
                  </footer>
                </article>
              }
            </div>
          </section>

          <!-- ===== PART TWO · STACK ===== -->
          <section class="stack-section" aria-labelledby="stack-h">
            <header class="section-head">
              <div class="section-rule">
                <span class="section-eyebrow">PART TWO · THE STACK SWAP</span>
              </div>
              <h2 id="stack-h" class="section-title">
                <em>Out</em> with one, <em>in</em> with another
              </h2>
              <p class="section-lede">
                A credit union's website is mostly content: loan T&amp;Cs,
                governance, financial accounts, forms. Everything dynamic
                (calculator, app links, sign-in) is one component &mdash; the
                rest is generated.
              </p>
            </header>

            <div class="stack-grid">
              <div class="stack-col stack-col--out">
                <header class="stack-col-head">
                  <span class="stack-col-tag">REMOVED</span>
                  <h3 class="stack-col-title">The legacy side</h3>
                </header>
                <ul class="stack-list">
                  @for (item of stackOut; track item.name) {
                    <li class="stack-item">
                      <span class="stack-item-name">{{ item.name }}</span>
                      <span class="stack-item-note">{{ item.note }}</span>
                    </li>
                  }
                </ul>
              </div>

              <div class="stack-col stack-col--in">
                <header class="stack-col-head">
                  <span class="stack-col-tag stack-col-tag--in">KEPT &amp; ADDED</span>
                  <h3 class="stack-col-title">The rebuild side</h3>
                </header>
                <ul class="stack-list">
                  @for (item of stackIn; track item.name) {
                    <li class="stack-item">
                      <span class="stack-item-name">{{ item.name }}</span>
                      <span class="stack-item-note">{{ item.note }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </section>

          <!-- ===== PART THREE · COMPLIANCE-FIRST DECISIONS ===== -->
          <section class="grace-section" aria-labelledby="grace-h">
            <header class="section-head">
              <div class="section-rule">
                <span class="section-eyebrow">PART THREE · DECISIONS THAT MATTERED</span>
              </div>
              <h2 id="grace-h" class="section-title">
                <em>What</em> a regulated site needs
              </h2>
              <p class="section-lede">
                Credit unions live or die on trust. Each of these is something
                the legacy site either lacked or buried, and that the rebuild
                makes obvious from the homepage onwards.
              </p>
            </header>

            <ul class="grace-grid">
              @for (g of graces; track g.title) {
                <li class="grace">
                  <span class="grace-num">{{ pad($index + 1) }}</span>
                  <h3 class="grace-title">{{ g.title }}</h3>
                  <p class="grace-blurb">{{ g.blurb }}</p>
                </li>
              }
            </ul>
          </section>

          <!-- ===== CLOSING ===== -->
          <footer class="closing">
            <div class="closing-rule">
              <span class="closing-tag">END · CASE STUDY</span>
            </div>
            <p class="closing-line">
              Both versions are live until cutover. Legacy at
              <a href="https://www.mcu.im/" target="_blank" rel="noopener noreferrer">www.mcu.im</a>
              &mdash; rebuild at
              <a href="https://manx-credit-union-mcu-website.vercel.app/" target="_blank" rel="noopener noreferrer">manx-credit-union-mcu-website.vercel.app</a>.
            </p>
            <p class="closing-line">
              <a [routerLink]="['/']" fragment="projects" class="closing-link">
                ↩ return to <em>The Archive</em>
              </a>
            </p>
          </footer>

        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      background: var(--ink);
      color: var(--text);
      min-height: 100vh;
    }
    .case-study { padding-top: 88px; }
    @media (max-width: 768px) { .case-study { padding-top: 72px; } }

    /* ===== MASTHEAD ===== */
    .masthead { margin-bottom: 4rem; max-width: 820px; }
    .masthead-rule { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .masthead-rule::before { content: ''; flex: 0 0 60px; height: 1px; background: var(--ember); }
    .masthead-rule::after { content: ''; flex: 1; height: 1px; background: var(--rule); }
    .rule-tag {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      color: var(--brass);
    }
    .title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(3rem, 8vw, 6rem);
      line-height: 0.95;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.04em;
      margin-bottom: 1.25rem;
    }
    .title em {
      font-style: italic; font-weight: 200; color: var(--text-mute);
      font-size: 0.7em; margin-right: 0.25rem;
    }
    .subtitle {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.15rem;
      color: var(--text);
      line-height: 1.6;
    }
    .subtitle .mono {
      font-family: var(--font-mono);
      font-style: normal;
      font-size: 0.75rem;
      color: var(--brass-mute);
      margin-left: 0.75rem;
      letter-spacing: 0.1em;
    }

    /* ===== STAT STRIP ===== */
    .stat-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      padding: 1.5rem 0;
      margin-bottom: 3rem;
      border-top: 1px solid var(--rule);
      border-bottom: 1px solid var(--rule);
    }
    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 0 1.5rem;
      border-right: 1px solid var(--rule);
    }
    .stat:last-child { border-right: none; }
    .stat-num {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144;
      font-size: 2rem;
      line-height: 1;
      color: var(--ember);
      font-weight: 300;
      letter-spacing: -0.02em;
    }
    .stat-label {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: var(--text-faint);
    }
    @media (max-width: 768px) {
      .stat-strip { grid-template-columns: repeat(2, 1fr); }
      .stat { padding: 0.75rem 1rem; border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
      .stat:nth-child(2n) { border-right: none; }
      .stat:nth-last-child(-n+2) { border-bottom: none; }
    }

    /* ===== LEDE ===== */
    .lede {
      max-width: 720px;
      font-family: var(--font-display);
      font-size: 1.05rem;
      line-height: 1.7;
      color: var(--text);
      margin-bottom: 5rem;
      padding-left: 1.5rem;
      border-left: 1px solid var(--rule);
    }
    .lede em { font-style: italic; color: var(--brass); font-weight: 500; }

    /* ===== SECTION HEADS ===== */
    .section-head { max-width: 820px; margin: 0 0 3rem; }
    .section-rule { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .section-rule::before { content: ''; flex: 0 0 40px; height: 1px; background: var(--ember); }
    .section-rule::after  { content: ''; flex: 1; height: 1px; background: var(--rule); }
    .section-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      color: var(--brass);
    }
    .section-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(2rem, 5vw, 3.25rem);
      line-height: 1.05;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
    }
    .section-title em {
      font-style: italic; font-weight: 200; color: var(--text-mute);
      font-size: 0.85em; margin-right: 0.2rem;
    }
    .section-lede {
      font-family: var(--font-display);
      font-size: 1rem;
      line-height: 1.65;
      color: var(--text);
      max-width: 680px;
    }
    .section-lede em { color: var(--brass); font-style: italic; }
    .compare-section, .stack-section, .grace-section { margin-bottom: 6rem; }

    /* ===== COMPARE SLIDER ===== */
    .compare-grid { display: grid; gap: 4rem; }
    .compare-head { margin-bottom: 1.25rem; }
    .compare-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--text-faint);
      display: block;
      margin-bottom: 0.5rem;
    }
    .compare-name {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 96;
      font-size: 1.6rem;
      line-height: 1.1;
      color: var(--paper);
      letter-spacing: -0.02em;
      margin-bottom: 0.4rem;
    }
    .compare-note {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 0.95rem;
      color: var(--text-mute);
      line-height: 1.5;
    }
    .compare-slider {
      position: relative;
      width: 100%;
      aspect-ratio: 1440 / 900;
      overflow: hidden;
      border: 1px solid var(--rule);
      background: var(--ink-deep);
      user-select: none;
      touch-action: none;
      cursor: ew-resize;
    }
    .compare-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
    }
    .compare-img--after {
      z-index: 2;
      transition: clip-path 0.05s linear;
      will-change: clip-path;
    }
    .compare-handle {
      position: absolute;
      top: 0; bottom: 0;
      width: 0;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 4;
    }
    .compare-handle-line {
      position: absolute;
      top: 0; bottom: 0; left: 50%;
      transform: translateX(-50%);
      width: 2px;
      background: var(--paper);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
    }
    .compare-handle-knob {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 40px; height: 40px;
      border-radius: 50%;
      background: var(--ember);
      color: var(--ink-deep);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-mono);
      font-size: 1.1rem;
      font-weight: 700;
      box-shadow: 0 6px 20px rgba(0,0,0,0.5), 0 0 0 4px rgba(255,107,53,0.15);
      pointer-events: auto;
      cursor: ew-resize;
    }
    .compare-label {
      position: absolute;
      top: 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      padding: 0.35rem 0.75rem;
      background: rgba(10, 9, 7, 0.85);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(244, 236, 216, 0.15);
      color: var(--paper);
      pointer-events: none;
      z-index: 3;
    }
    .compare-label--before { left: 0.75rem; }
    .compare-label--after  { right: 0.75rem; color: var(--ember); border-color: rgba(255, 107, 53, 0.4); }

    .compare-urls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--rule);
      margin-top: 1rem;
    }
    .compare-url {
      display: inline-flex;
      align-items: baseline;
      gap: 0.6rem;
      text-decoration: none;
      color: var(--text-mute);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      transition: color 0.15s ease;
    }
    .compare-url:hover { color: var(--paper); }
    .url-tag {
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      padding: 0.15rem 0.5rem;
      border: 1px solid var(--rule-light);
      color: var(--text-faint);
    }
    .url-tag--new { color: var(--ember); border-color: rgba(255, 107, 53, 0.5); }
    .url-arrow { color: var(--brass-mute); }

    /* ===== STACK GRID ===== */
    .stack-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid var(--rule);
    }
    @media (max-width: 768px) {
      .stack-grid { grid-template-columns: 1fr; }
      .stack-col + .stack-col { border-top: 1px solid var(--rule); }
    }
    .stack-col { padding: 2rem; }
    .stack-col--out { background: rgba(217, 77, 31, 0.04); border-right: 1px solid var(--rule); }
    .stack-col--in  { background: rgba(201, 169, 97, 0.04); }
    @media (max-width: 768px) { .stack-col--out { border-right: none; } }
    .stack-col-head { margin-bottom: 1.5rem; }
    .stack-col-tag {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--ember-deep);
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--ember-deep);
      margin-bottom: 0.75rem;
    }
    .stack-col-tag--in { color: var(--brass); border-color: var(--brass); }
    .stack-col-title {
      font-family: var(--font-display);
      font-size: 1.4rem;
      color: var(--paper);
      font-weight: 400;
      letter-spacing: -0.01em;
    }
    .stack-list { list-style: none; padding: 0; margin: 0; }
    .stack-item {
      display: grid;
      gap: 0.25rem;
      padding: 0.85rem 0;
      border-bottom: 1px dashed var(--rule);
    }
    .stack-item:last-child { border-bottom: none; }
    .stack-item-name {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--paper);
    }
    .stack-item-note {
      font-family: var(--font-display);
      font-size: 0.85rem;
      color: var(--text-mute);
      font-style: italic;
      line-height: 1.5;
    }

    /* ===== GRACE GRID ===== */
    .grace-grid {
      list-style: none; padding: 0; margin: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      border: 1px solid var(--rule);
    }
    @media (max-width: 768px) { .grace-grid { grid-template-columns: 1fr; } }
    .grace {
      padding: 1.75rem;
      border-bottom: 1px solid var(--rule);
      border-right: 1px solid var(--rule);
    }
    .grace:nth-child(2n) { border-right: none; }
    @media (max-width: 768px) { .grace { border-right: none; } }
    .grace-num {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--ember);
      letter-spacing: 0.15em;
      display: block;
      margin-bottom: 0.75rem;
    }
    .grace-title {
      font-family: var(--font-display);
      font-size: 1.15rem;
      color: var(--paper);
      font-weight: 400;
      margin-bottom: 0.4rem;
    }
    .grace-blurb {
      font-family: var(--font-display);
      font-size: 0.92rem;
      color: var(--text-mute);
      line-height: 1.6;
    }

    /* ===== CLOSING ===== */
    .closing { margin-top: 5rem; padding-top: 3rem; border-top: 1px solid var(--rule); }
    .closing-rule { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .closing-rule::before { content: ''; flex: 0 0 60px; height: 1px; background: var(--ember); }
    .closing-rule::after  { content: ''; flex: 1; height: 1px; background: var(--rule); }
    .closing-tag {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      color: var(--brass);
    }
    .closing-line {
      font-family: var(--font-display);
      font-size: 1rem;
      line-height: 1.7;
      color: var(--text);
      margin-bottom: 0.5rem;
    }
    .closing-line a {
      color: var(--ember);
      text-decoration: none;
      border-bottom: 1px solid rgba(255, 107, 53, 0.35);
      word-break: break-all;
    }
    .closing-line a:hover { color: var(--paper); border-bottom-color: var(--paper); }
    .closing-link em { font-style: italic; color: var(--brass); }
  `],
})
export class McuComponent {
  splits = signal<number[]>([50, 50, 50, 50, 50, 50]);

  private activeIdx: number | null = null;
  private activeRect: DOMRect | null = null;

  pairs: PagePair[] = [
    {
      slug: 'home',
      eyebrow: '01 · HOMEPAGE',
      title: 'Above the fold',
      note: 'Legacy: stock-photo group of strangers, neon green, cookie bar nailed to the bottom. Rebuild: a single value-prop and a live indicative loan calculator.',
      oldUrl: 'https://www.mcu.im/',
      newUrl: 'https://manx-credit-union-mcu-website.vercel.app/',
      oldShort: 'www.mcu.im',
      newShort: 'manx-credit-union-mcu-website.vercel.app',
      before: 'assets/projects/mcu/old-home.jpg',
      after:  'assets/projects/mcu/new-home.jpg',
    },
    {
      slug: 'loans',
      eyebrow: '02 · LOAN PRODUCTS',
      title: 'The loan catalog',
      note: 'Same products, restructured: a clear grid of seven loans (Basic, Family, Loyalty Saver, Premier, Save-as-you-borrow, Starter, Emergency) with rate, term and use-case visible at a glance.',
      oldUrl: 'https://www.mcu.im/loans',
      newUrl: 'https://manx-credit-union-mcu-website.vercel.app/loans',
      oldShort: '/loans',
      newShort: '/loans',
      before: 'assets/projects/mcu/old-loans.jpg',
      after:  'assets/projects/mcu/new-loans.jpg',
    },
    {
      slug: 'loan',
      eyebrow: '03 · SINGLE LOAN',
      title: 'Loan detail',
      note: 'A single product page now leads with rate, repayment example, eligibility and a path to apply. Legacy was a single column of prose under a stock banner.',
      oldUrl: 'https://www.mcu.im/loans/basic-loan',
      newUrl: 'https://manx-credit-union-mcu-website.vercel.app/loans/basic',
      oldShort: '/loans/basic-loan',
      newShort: '/loans/basic',
      before: 'assets/projects/mcu/old-loan.jpg',
      after:  'assets/projects/mcu/new-loan.jpg',
    },
    {
      slug: 'join',
      eyebrow: '04 · MEMBERSHIP',
      title: 'Become a member',
      note: 'The conversion page. Legacy buried the requirements in paragraphs; rebuild lays out the four eligibility criteria, the proof of identity rules and a single primary CTA.',
      oldUrl: 'https://www.mcu.im/joinus',
      newUrl: 'https://manx-credit-union-mcu-website.vercel.app/membership',
      oldShort: '/joinus',
      newShort: '/membership',
      before: 'assets/projects/mcu/old-join.jpg',
      after:  'assets/projects/mcu/new-join.jpg',
    },
    {
      slug: 'about',
      eyebrow: '05 · ABOUT',
      title: 'Who we are',
      note: 'Same story (member-owned since 1993, FSA-regulated, lottery-funded origin) &mdash; paced. Board of directors, governance, financial reports, all in one structured nav instead of a side menu.',
      oldUrl: 'https://www.mcu.im/aboutus',
      newUrl: 'https://manx-credit-union-mcu-website.vercel.app/about',
      oldShort: '/aboutus',
      newShort: '/about',
      before: 'assets/projects/mcu/old-about.jpg',
      after:  'assets/projects/mcu/new-about.jpg',
    },
    {
      slug: 'contact',
      eyebrow: '06 · CONTACT',
      title: 'Get in touch',
      note: 'Address, opening hours, phone, email, and the FSA registration line &mdash; on one page, in one card, instead of three separate paragraphs in a sidebar.',
      oldUrl: 'https://www.mcu.im/contact',
      newUrl: 'https://manx-credit-union-mcu-website.vercel.app/contact',
      oldShort: '/contact',
      newShort: '/contact',
      before: 'assets/projects/mcu/old-contact.jpg',
      after:  'assets/projects/mcu/new-contact.jpg',
    },
  ];

  stackOut = [
    { name: 'Classic ASP / IIS',     note: 'Server-rendered .aspx with VBScript-era patterns.' },
    { name: 'jQuery + Bootstrap 3',  note: 'CDN-loaded vendor JS for layout that\u2019s now native.' },
    { name: 'Stock photography',     note: 'Generic "happy faces" hero unrelated to MCU members.' },
    { name: 'Cookie-banner plugin',  note: 'Bottom-bound banner with no granular consent.' },
    { name: 'Forms-as-PDF',          note: 'Membership flow ended in a PDF download.' },
    { name: 'No live calculator',    note: 'A static .html page linked from a sidebar.' },
  ];

  stackIn = [
    { name: 'Next.js + React',         note: 'Server components for the marketing pages, client islands for the calculator.' },
    { name: 'Tailwind + a design system', note: 'Cream/charcoal palette built for trust, not novelty.' },
    { name: 'Live loan calculator',    note: 'Real APR, real repayment example, real save-as-you-borrow bonus &mdash; on the homepage.' },
    { name: 'Vercel + preview URLs',   note: 'Every PR gets its own URL for stakeholder review &mdash; matters when the FSA is a reader.' },
    { name: 'Native cookie consent',   note: 'Granular, GDPR-shaped, no plugin.' },
    { name: 'Inline forms',            note: 'Joining is a form on the page, not a PDF download.' },
  ];

  graces = [
    { title: 'Live indicative loan calculator on the homepage', blurb: 'Borrow / over / monthly / total cost. No dropdown menu, no separate page &mdash; visible before you scroll.' },
    { title: 'FSA & compensation scheme called out above the fold', blurb: '"Protected by the Isle of Man Depositors\u2019 Compensation Scheme up to £50,000." First-time visitors don\u2019t have to dig.' },
    { title: 'Branch-status badge that reflects reality', blurb: '"Closed · opens Saturday at 9:45am" &mdash; tells you when you can actually visit without phoning.' },
    { title: 'Member-owned, not member-onboarded', blurb: '"Dividends, not profit" / "Small enough to call you" &mdash; the value props match what a credit union actually is.' },
    { title: 'Single source of truth for products', blurb: 'Each loan is content + one card component, not a hand-edited HTML page per product.' },
    { title: 'Sign-in routed to the existing portal', blurb: 'No fake login form &mdash; the auth/portal stays where it already lives.' },
  ];

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  afterClip(idx: number): string {
    const split = this.splits()[idx] ?? 50;
    return `inset(0 ${100 - split}% 0 0)`;
  }

  onPointerDown(ev: MouseEvent | TouchEvent, idx: number) {
    ev.preventDefault();
    const slider = (ev.currentTarget as HTMLElement);
    this.activeIdx = idx;
    this.activeRect = slider.getBoundingClientRect();
    this.updateFromEvent(ev);
    window.addEventListener('mousemove', this.onPointerMove, { passive: false });
    window.addEventListener('touchmove', this.onPointerMove, { passive: false });
    window.addEventListener('mouseup', this.onPointerUp);
    window.addEventListener('touchend', this.onPointerUp);
    window.addEventListener('touchcancel', this.onPointerUp);
  }

  private onPointerMove = (ev: MouseEvent | TouchEvent) => {
    if (this.activeIdx === null || !this.activeRect) return;
    const slider = document.querySelector(
      `.compare-slider[data-idx="${this.activeIdx}"]`
    ) as HTMLElement | null;
    if (slider) this.activeRect = slider.getBoundingClientRect();
    ev.preventDefault();
    this.updateFromEvent(ev);
  };

  private onPointerUp = () => {
    this.activeIdx = null;
    this.activeRect = null;
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('touchmove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchend', this.onPointerUp);
    window.removeEventListener('touchcancel', this.onPointerUp);
  };

  private updateFromEvent(ev: MouseEvent | TouchEvent) {
    if (this.activeIdx === null || !this.activeRect) return;
    const clientX =
      ev instanceof MouseEvent
        ? ev.clientX
        : ev.touches?.[0]?.clientX ?? ev.changedTouches?.[0]?.clientX ?? 0;
    const rel = clientX - this.activeRect.left;
    const pct = Math.max(0, Math.min(100, (rel / this.activeRect.width) * 100));
    const next = [...this.splits()];
    next[this.activeIdx] = pct;
    this.splits.set(next);
  }
}
