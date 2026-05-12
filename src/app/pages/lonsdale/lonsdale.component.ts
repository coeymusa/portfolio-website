import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PagePair {
  slug: string;
  eyebrow: string;
  title: string;
  note: string;
  wpUrl: string;
  astroUrl: string;
  wpShort: string;
  astroShort: string;
  wp: string;
  astro: string;
}

@Component({
  selector: 'app-lonsdale',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="case-study">
      <section class="section">
        <div class="container">

          <!-- Masthead -->
          <header class="masthead">
            <div class="masthead-rule">
              <span class="rule-tag">CHAPTER THREE · CASE STUDY</span>
            </div>
            <h1 class="title">
              <em>The</em> Lonsdale Cutover
            </h1>
            <p class="subtitle">
              WordPress to Astro. Same content, same brand, different stewardship.
              <span class="mono">[ MAY 2026 · ONE-PERSON MIGRATION ]</span>
            </p>
          </header>

          <!-- Stat strip -->
          <div class="stat-strip" aria-label="Migration scale">
            <div class="stat">
              <span class="stat-num">38</span>
              <span class="stat-label">VANS · CATALOG</span>
            </div>
            <div class="stat">
              <span class="stat-num">188</span>
              <span class="stat-label">VARIATION SKUs</span>
            </div>
            <div class="stat">
              <span class="stat-num">1.4k</span>
              <span class="stat-label">WEBP VARIANTS</span>
            </div>
            <div class="stat">
              <span class="stat-num">£0</span>
              <span class="stat-label">HOSTING · MONTHLY</span>
            </div>
          </div>

          <!-- Lede -->
          <p class="lede">
            <em>The brief</em>: my aunt's WordPress site &mdash; Lonsdale Commercials,
            Cardiff, trading since 1980 &mdash; was being maintained by an agency on a
            retainer. The redesign was already paid for. The new site was running
            locally. I took it the rest of the way: out of WordPress, into Astro,
            onto Vercel, with the GitHub repo under my account. Below, page by page,
            is what changed.
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
                Both sites are still live as of writing. Pull the divider left to
                see what was there. Right for what's there now. These are
                above-the-fold captures from production &mdash; no retouching.
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
                    [attr.aria-label]="pair.title + ' — drag to compare WordPress vs Astro'"
                  >
                    <img
                      class="compare-img compare-img--before"
                      [src]="pair.wp"
                      [alt]="pair.title + ' on the WordPress site'"
                      loading="lazy"
                      decoding="async"
                    />
                    <img
                      class="compare-img compare-img--after"
                      [src]="pair.astro"
                      [alt]="pair.title + ' on the new Astro site'"
                      [style.clip-path]="afterClip(i)"
                      loading="lazy"
                      decoding="async"
                    />
                    <div class="compare-handle" [style.left.%]="splits()[i]">
                      <span class="compare-handle-line"></span>
                      <span class="compare-handle-knob" aria-hidden="true">⇄</span>
                    </div>
                    <span class="compare-label compare-label--before">← BEFORE · WORDPRESS</span>
                    <span class="compare-label compare-label--after">AFTER · ASTRO →</span>
                  </div>

                  <footer class="compare-urls">
                    <a class="compare-url" [href]="pair.wpUrl" target="_blank" rel="noopener noreferrer">
                      <span class="url-tag">WP</span>
                      <span class="url-text">{{ pair.wpShort }}</span>
                      <span class="url-arrow">↗</span>
                    </a>
                    <a class="compare-url" [href]="pair.astroUrl" target="_blank" rel="noopener noreferrer">
                      <span class="url-tag url-tag--new">NEW</span>
                      <span class="url-text">{{ pair.astroShort }}</span>
                      <span class="url-arrow">↗</span>
                    </a>
                  </footer>
                </article>
              }
            </div>
          </section>

          <!-- ===== PART ONE.5 · NEW SURFACES ===== -->
          <section class="surfaces-section" aria-labelledby="surfaces-h">
            <header class="section-head">
              <div class="section-rule">
                <span class="section-eyebrow">PART ONE.5 · THE NEW SURFACES</span>
              </div>
              <h2 id="surfaces-h" class="section-title">
                <em>What</em> didn't exist before
              </h2>
              <p class="section-lede">
                The drag-to-compare above shows the <em>same</em> page rebuilt. Below
                are two surfaces where the rebuild added real product depth &mdash;
                no equivalent on the WordPress side, so no slider would do them
                justice.
              </p>
            </header>

            <div class="surfaces-grid">
              @for (s of surfaces; track s.slug) {
                <article class="surface">
                  <header class="surface-head">
                    <span class="surface-eyebrow">{{ s.eyebrow }}</span>
                    <h3 class="surface-name">{{ s.title }}</h3>
                    <p class="surface-note">{{ s.note }}</p>
                  </header>
                  <a class="surface-shot" [href]="s.url" target="_blank" rel="noopener noreferrer">
                    <img [src]="s.image" [alt]="s.title + ' on the new Astro site'" loading="lazy" decoding="async" />
                    <span class="surface-shot-tag">NEW</span>
                  </a>
                  <ul class="surface-bullets">
                    @for (b of s.bullets; track b) {
                      <li>{{ b }}</li>
                    }
                  </ul>
                  <a class="surface-url" [href]="s.url" target="_blank" rel="noopener noreferrer">
                    <span class="url-tag url-tag--new">LIVE</span>
                    <span class="url-text">{{ s.urlShort }}</span>
                    <span class="url-arrow">↗</span>
                  </a>
                </article>
              }
            </div>
          </section>

          <!-- ===== PART TWO · STACK SWAP ===== -->
          <section class="stack-section" aria-labelledby="stack-h">
            <header class="section-head">
              <div class="section-rule">
                <span class="section-eyebrow">PART TWO · THE STACK SWAP</span>
              </div>
              <h2 id="stack-h" class="section-title">
                <em>Out</em> with one, <em>in</em> with another
              </h2>
              <p class="section-lede">
                The brand stayed, the agency went. The stack lost ten moving parts
                and gained two. Anything PHP, server-rendered, or licensed by the
                seat is on the left.
              </p>
            </header>

            <div class="stack-grid">
              <div class="stack-col stack-col--out">
                <header class="stack-col-head">
                  <span class="stack-col-tag">REMOVED</span>
                  <h3 class="stack-col-title">The WordPress side</h3>
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
                  <h3 class="stack-col-title">The Astro side</h3>
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

          <!-- ===== PART THREE · WHAT MIGRATION ACTUALLY MEANT ===== -->
          <section class="ledger-section" aria-labelledby="ledger-h">
            <header class="section-head">
              <div class="section-rule">
                <span class="section-eyebrow">PART THREE · THE MIGRATION LEDGER</span>
              </div>
              <h2 id="ledger-h" class="section-title">
                <em>Five</em> scripts in order
              </h2>
              <p class="section-lede">
                The cutover is &mdash; intentionally &mdash; a chain of small scripts,
                not one big tool. Each one is idempotent. Each one ran enough times
                to make sense of the WP database before committing to a shape.
              </p>
            </header>

            <ol class="ledger">
              @for (step of ledger; track step.script; let i = $index) {
                <li class="ledger-row">
                  <span class="ledger-num">{{ pad(i + 1) }}</span>
                  <div class="ledger-body">
                    <div class="ledger-head-row">
                      <span class="ledger-script">{{ step.script }}</span>
                      <span class="ledger-tag">{{ step.tag }}</span>
                    </div>
                    <p class="ledger-blurb">{{ step.blurb }}</p>
                  </div>
                </li>
              }
            </ol>
          </section>

          <!-- ===== PART FOUR · THE LIGHT TOUCH BITS ===== -->
          <section class="grace-section" aria-labelledby="grace-h">
            <header class="section-head">
              <div class="section-rule">
                <span class="section-eyebrow">PART FOUR · THE LIGHT-TOUCH BITS</span>
              </div>
              <h2 id="grace-h" class="section-title">
                <em>What</em> changed quietly
              </h2>
              <p class="section-lede">
                Beyond the visible swap, a handful of polish moves that didn't
                exist on the WordPress version. None of these required a plugin
                &mdash; each one is a single Astro component or a few CSS rules.
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
              The DNS cutover is one record flip away. Old site still serving at
              <a href="https://www.lonsdalecommercials.co.uk/" target="_blank" rel="noopener noreferrer">lonsdalecommercials.co.uk</a>
              &mdash; new build at
              <a href="https://londsdale.vercel.app/" target="_blank" rel="noopener noreferrer">londsdale.vercel.app</a>.
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
    @media (max-width: 768px) {
      .case-study { padding-top: 72px; }
    }

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
      font-style: italic;
      font-weight: 200;
      color: var(--text-mute);
      font-size: 0.7em;
      margin-right: 0.25rem;
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
      gap: 0;
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

    .compare-section,
    .surfaces-section,
    .stack-section,
    .ledger-section,
    .grace-section { margin-bottom: 6rem; }

    /* ===== NEW SURFACES ===== */
    .surfaces-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
    @media (max-width: 920px) {
      .surfaces-grid { grid-template-columns: 1fr; gap: 4rem; }
    }
    .surface-head { margin-bottom: 1.25rem; }
    .surface-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--text-faint);
      display: block;
      margin-bottom: 0.5rem;
    }
    .surface-name {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 96;
      font-size: 1.5rem;
      line-height: 1.15;
      color: var(--paper);
      letter-spacing: -0.02em;
      margin-bottom: 0.4rem;
    }
    .surface-note {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 0.95rem;
      color: var(--text-mute);
      line-height: 1.55;
    }
    .surface-shot {
      position: relative;
      display: block;
      border: 1px solid var(--rule);
      background: var(--ink-deep);
      overflow: hidden;
      margin-bottom: 1.25rem;
      transition: border-color 0.2s ease;
    }
    .surface-shot:hover { border-color: rgba(255, 107, 53, 0.5); }
    .surface-shot img {
      display: block;
      width: 100%;
      height: auto;
      max-height: 540px;
      object-fit: cover;
      object-position: top center;
    }
    .surface-shot-tag {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      padding: 0.3rem 0.65rem;
      background: rgba(255, 107, 53, 0.12);
      border: 1px solid rgba(255, 107, 53, 0.5);
      color: var(--ember);
      backdrop-filter: blur(4px);
    }
    .surface-bullets {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem;
    }
    .surface-bullets li {
      font-family: var(--font-display);
      font-size: 0.92rem;
      line-height: 1.55;
      color: var(--text);
      padding: 0.45rem 0 0.45rem 1.25rem;
      position: relative;
      border-bottom: 1px dashed var(--rule);
    }
    .surface-bullets li:last-child { border-bottom: none; }
    .surface-bullets li::before {
      content: '›';
      position: absolute;
      left: 0;
      color: var(--brass-mute);
      font-family: var(--font-mono);
    }
    .surface-url {
      display: inline-flex;
      align-items: baseline;
      gap: 0.6rem;
      text-decoration: none;
      color: var(--text-mute);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--rule);
      width: 100%;
      transition: color 0.15s ease;
    }
    .surface-url:hover { color: var(--paper); }

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
      /* clip-path set inline per-instance from the component */
      transition: clip-path 0.05s linear;
      will-change: clip-path;
    }

    .compare-handle {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 0;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 4;
    }
    .compare-handle-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      background: var(--paper);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
    }
    .compare-handle-knob {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--ember);
      color: var(--ink-deep);
      display: flex;
      align-items: center;
      justify-content: center;
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
    .compare-label--before {
      left: 0.75rem;
      color: var(--text-mute);
      background: rgba(10, 9, 7, 0.7);
    }
    .compare-label--after  {
      right: 0.75rem;
      color: var(--ember);
      background: rgba(255, 107, 53, 0.12);
      border-color: rgba(255, 107, 53, 0.5);
    }

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
      gap: 0;
      border: 1px solid var(--rule);
    }
    @media (max-width: 768px) {
      .stack-grid { grid-template-columns: 1fr; }
      .stack-col + .stack-col { border-top: 1px solid var(--rule); }
    }
    .stack-col { padding: 2rem; }
    .stack-col--out { background: rgba(217, 77, 31, 0.04); border-right: 1px solid var(--rule); }
    .stack-col--in  { background: rgba(201, 169, 97, 0.04); }
    @media (max-width: 768px) {
      .stack-col--out { border-right: none; }
    }
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
      grid-template-columns: 1fr;
      gap: 0.25rem;
      padding: 0.85rem 0;
      border-bottom: 1px dashed var(--rule);
    }
    .stack-item:last-child { border-bottom: none; }
    .stack-item-name {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--paper);
      letter-spacing: 0.02em;
    }
    .stack-item-note {
      font-family: var(--font-display);
      font-size: 0.85rem;
      color: var(--text-mute);
      font-style: italic;
      line-height: 1.5;
    }

    /* ===== LEDGER ===== */
    .ledger {
      list-style: none;
      padding: 0;
      margin: 0;
      border-top: 1px solid var(--rule);
    }
    .ledger-row {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 1.5rem;
      padding: 1.5rem 0;
      border-bottom: 1px solid var(--rule);
      align-items: start;
    }
    .ledger-num {
      font-family: var(--font-mono);
      font-size: 0.9rem;
      color: var(--brass-mute);
      letter-spacing: 0.1em;
    }
    .ledger-head-row {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      margin-bottom: 0.4rem;
      flex-wrap: wrap;
    }
    .ledger-script {
      font-family: var(--font-mono);
      font-size: 0.95rem;
      color: var(--paper);
    }
    .ledger-tag {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: var(--text-faint);
      padding: 0.15rem 0.5rem;
      border: 1px solid var(--rule-light);
    }
    .ledger-blurb {
      font-family: var(--font-display);
      font-size: 0.95rem;
      color: var(--text);
      line-height: 1.6;
      max-width: 720px;
    }

    /* ===== GRACE GRID ===== */
    .grace-grid {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0;
      border: 1px solid var(--rule);
    }
    @media (max-width: 768px) {
      .grace-grid { grid-template-columns: 1fr; }
    }
    .grace {
      padding: 1.75rem;
      border-bottom: 1px solid var(--rule);
      border-right: 1px solid var(--rule);
    }
    .grace:nth-child(2n) { border-right: none; }
    @media (max-width: 768px) {
      .grace { border-right: none; }
    }
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
    }
    .closing-line a:hover { color: var(--paper); border-bottom-color: var(--paper); }
    .closing-link em { font-style: italic; color: var(--brass); }
  `],
})
export class LonsdaleComponent {
  // Per-pair split percentage, 0 = full WP, 100 = full Astro.
  splits = signal<number[]>([50, 50, 50, 50, 50, 50]);

  private activeIdx: number | null = null;
  private activeRect: DOMRect | null = null;

  pairs: PagePair[] = [
    {
      slug: 'home',
      eyebrow: '01 · HOMEPAGE',
      title: 'Above the fold',
      note: 'WordPress: stock photo of a tyre. Astro: a single van, a benefit-led headline, and the year-models in stock.',
      wpUrl: 'https://www.lonsdalecommercials.co.uk/',
      astroUrl: 'https://londsdale.vercel.app/',
      wpShort: 'lonsdalecommercials.co.uk',
      astroShort: 'londsdale.vercel.app',
      wp: 'assets/projects/lonsdale/wp-home.jpg',
      astro: 'assets/projects/lonsdale/astro-home.jpg',
    },
    {
      slug: 'archive',
      eyebrow: '02 · VAN SALES ARCHIVE',
      title: 'The catalog grid',
      note: 'Three live facets on the Astro side — manufacturer, body type, body length — driven entirely by the data, no plugin.',
      wpUrl: 'https://www.lonsdalecommercials.co.uk/van-sales/',
      astroUrl: 'https://londsdale.vercel.app/van-sales/',
      wpShort: '/van-sales/',
      astroShort: '/van-sales/',
      wp: 'assets/projects/lonsdale/wp-archive.jpg',
      astro: 'assets/projects/lonsdale/astro-archive.jpg',
    },
    {
      slug: 'product',
      eyebrow: '03 · SINGLE VAN',
      title: 'Product detail',
      note: 'WP rendered a Visual-Composer accordion of plain text. Astro parses it into a 3-column spec grid with a variation picker.',
      wpUrl: 'https://www.lonsdalecommercials.co.uk/product/citroen-relay-luton-body-van-inc-tail-lift-13-4ft-335l3-blue2-2hdi-140ps-euro-6-4-copy/',
      astroUrl: 'https://londsdale.vercel.app/van-sales/citroen-relay-luton-body-van-inc-tail-lift-13-4ft-335l3-blue2-2hdi-140ps-euro-6-/',
      wpShort: '/product/citroen-relay-…',
      astroShort: '/van-sales/citroen-relay-…',
      wp: 'assets/projects/lonsdale/wp-product.jpg',
      astro: 'assets/projects/lonsdale/astro-product.jpg',
    },
    {
      slug: 'bodybuilding',
      eyebrow: '04 · BODYBUILDING',
      title: 'Bespoke builds gallery',
      note: 'Same imagery, redrawn as image-led overlay tiles in a 4:3 grid. 12 galleries, 501 source images, 1,400+ WebP variants.',
      wpUrl: 'https://www.lonsdalecommercials.co.uk/bodybuilding/',
      astroUrl: 'https://londsdale.vercel.app/bodybuilding/',
      wpShort: '/bodybuilding/',
      astroShort: '/bodybuilding/',
      wp: 'assets/projects/lonsdale/wp-bodybuilding.jpg',
      astro: 'assets/projects/lonsdale/astro-bodybuilding.jpg',
    },
    {
      slug: 'about',
      eyebrow: '05 · ABOUT',
      title: 'The story page',
      note: 'WP version was a wall of paragraphs. Astro version is a hero, a five-point "why us" set, and a service split — same copy, paced.',
      wpUrl: 'https://www.lonsdalecommercials.co.uk/about-us/',
      astroUrl: 'https://londsdale.vercel.app/about/',
      wpShort: '/about-us/',
      astroShort: '/about/',
      wp: 'assets/projects/lonsdale/wp-about.jpg',
      astro: 'assets/projects/lonsdale/astro-about.jpg',
    },
    {
      slug: 'contact',
      eyebrow: '06 · CONTACT',
      title: 'Get in touch',
      note: 'Contact form left, address card + live Google Maps embed right. Old version: a stretched 1-col WP plugin form, no map.',
      wpUrl: 'https://www.lonsdalecommercials.co.uk/contact-us/',
      astroUrl: 'https://londsdale.vercel.app/contact-us/',
      wpShort: '/contact-us/',
      astroShort: '/contact-us/',
      wp: 'assets/projects/lonsdale/wp-contact.jpg',
      astro: 'assets/projects/lonsdale/astro-contact.jpg',
    },
  ];

  surfaces = [
    {
      slug: 'product-detail',
      eyebrow: '07 · SINGLE VAN, IN FULL',
      title: 'Spec grid + variation picker',
      note: 'A WordPress accordion of plain-text body copy, parsed once at build time into a structured 3-column spec grid with a native disclosure variation picker beneath.',
      image: 'assets/projects/lonsdale/astro-product-detail.jpg',
      url: 'https://londsdale.vercel.app/van-sales/citroen-relay-luton-body-van-inc-tail-lift-13-4ft-335l3-blue2-2hdi-140ps-euro-6-/',
      urlShort: '/van-sales/citroen-relay-…',
      bullets: [
        'Visual-Composer accordion → typed JSON fields, parsed by migration/03',
        'Three-column spec grid: engine, body, fitments — no plugin',
        'Native <details> variation picker, ~30 lines of TS to swap price',
        'JSON-LD Product + AggregateOffer schema generated from the same data',
      ],
    },
    {
      slug: 'bodybuilding-detail',
      eyebrow: '08 · BODYBUILDING DETAIL',
      title: 'Gallery page with bespoke-quote CTA',
      note: 'Each of the 12 bespoke-build galleries gets its own page — image-led grid, descriptive copy, and a dedicated "request a build" CTA that the WordPress site never had.',
      image: 'assets/projects/lonsdale/astro-bodybuilding-detail.jpg',
      url: 'https://londsdale.vercel.app/galleries/contour/',
      urlShort: '/galleries/contour/',
      bullets: [
        '12 gallery pages, each driven by a JSON content collection entry',
        'Responsive 4:3 image grid with WebP variants at 400/800/1200w',
        '"Discuss a build" CTA scrolling to a contact intent — new addition',
        'Breadcrumb back to /bodybuilding/, JSON-LD ImageGallery on each',
      ],
    },
  ];

  stackOut = [
    { name: 'WordPress core',     note: 'PHP runtime, MySQL, admin surface, plugin update treadmill.' },
    { name: 'WooCommerce',        note: 'Carted product catalog used as a data model — never as a checkout.' },
    { name: 'Visual Composer',    note: 'Page-builder shortcodes encoded into post_content.' },
    { name: 'WP Engine hosting',  note: 'Managed but always-on PHP/MySQL bill, agency-billed.' },
    { name: 'All-in-One Migration', note: 'Required just to extract the data once.' },
    { name: 'Agency retainer',    note: 'Monthly maintenance fee, slow turnaround on small edits.' },
  ];

  stackIn = [
    { name: 'Astro 5',                note: 'Static site generator; islands only where they earn it.' },
    { name: 'Content collections',    note: 'JSON files + Zod schemas as the new content store.' },
    { name: 'Vercel + GitHub',        note: 'Auto-deploy on push, preview URLs per branch, free for this traffic.' },
    { name: 'Sharp WebP pipeline',    note: '~80% bandwidth saving on card grids.' },
    { name: 'Pure HTML+CSS components', note: 'Native <details>, CSS Grid, no jQuery.' },
    { name: 'Resend for email',       note: 'API-based contact form, no DB needed.' },
  ];

  ledger = [
    {
      script: 'migration/01-audit.js',
      tag: 'READ-ONLY',
      blurb: 'Walks the WordPress SQL dump and prints the inventory: 38 vans, 188 variations, 12 galleries, 501 attachments, 15 pages. The baseline that every later script gets reconciled against.',
    },
    {
      script: 'migration/02-migrate.js',
      tag: 'EXTRACT',
      blurb: 'Pulls products, attributes, and post_content from the dump and writes one JSON file per van into Astro content collections. Handles WooCommerce variations via the post_parent link.',
    },
    {
      script: 'migration/03-parse-content.js',
      tag: 'TRANSFORM',
      blurb: 'Splits Visual-Composer accordion shortcodes into structured fields — intro + named sections — so the Astro template can render a 3-column spec grid instead of one flat blob.',
    },
    {
      script: 'migration/04-copy-images.js',
      tag: 'COPY',
      blurb: 'Walks the WP uploads tree and copies each attached image into /public/vans/<slug>/, renaming featured-images to a predictable filename so the template doesn\u2019t need a manifest.',
    },
    {
      script: 'migration/05-optimize-images.js',
      tag: 'OPTIMIZE',
      blurb: 'Idempotent Sharp pass that generates 400/800/1200-wide WebP variants for every source image. Always emits the smallest tier even for tiny featured-image PNGs — otherwise the srcset 404\'d.',
    },
  ];

  graces = [
    { title: 'Cookie consent that defers third-party scripts', blurb: 'PromptMySite chat doesn\u2019t inject until consent is given. UK GDPR/PECR-clean without a banner plugin.' },
    { title: 'JSON-LD on every product', blurb: 'Product + AggregateOffer + BreadcrumbList structured data, written from the same data that drives the page.' },
    { title: 'Single Google Maps embed', blurb: 'A real iframe of the Cardiff yard on /contact-us — the old site shipped no map at all.' },
    { title: 'Slug cleanup, server-side', blurb: '14 vans had a trailing "-copy" left over from the WP duplicate-then-edit workflow. Migration stripped them.' },
    { title: 'Variation picker as one <details> + JS', blurb: 'No plugin, no jQuery. Native disclosure, a few lines of TS to swap the visible price.' },
    { title: 'Vercel preview URL per branch', blurb: 'Every commit on a feature branch deploys to its own URL. Reviews aren\u2019t blocked on a staging environment that no one owns.' },
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
    // Immediate jump-to-click
    this.updateFromEvent(ev);
    // Bind window listeners so dragging works outside the slider too
    window.addEventListener('mousemove', this.onPointerMove, { passive: false });
    window.addEventListener('touchmove', this.onPointerMove, { passive: false });
    window.addEventListener('mouseup', this.onPointerUp);
    window.addEventListener('touchend', this.onPointerUp);
    window.addEventListener('touchcancel', this.onPointerUp);
  }

  private onPointerMove = (ev: MouseEvent | TouchEvent) => {
    if (this.activeIdx === null || !this.activeRect) return;
    // Need to re-fetch rect if scroll happened mid-drag — quick + cheap.
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
