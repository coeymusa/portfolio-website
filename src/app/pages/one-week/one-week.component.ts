import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  computed,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { previewUrl } from '../../core/models/project.model';
import {
  OFF_THE_RECORD,
  OFF_THE_RECORD_TOTALS,
  SPRINT_ENTRIES,
  SprintEntry,
  ZOOMED_OUT,
} from './sprint-entry.model';

interface RenderedEntry extends SprintEntry {
  /** Final image src — starts at staticPreview (or live screenshot), can upgrade. */
  preview: string | null;
  /** True for cards under the same chapter sub-header — used to draw the shared rule. */
  groupHead: boolean;
  /** True for the second/third card sharing a chapter sub-header. */
  groupedFollower: boolean;
  /** Cached short host for the browser-chrome address bar */
  shortUrl: string;
  /** Cached short host/path for the repo link */
  shortRepo: string;
}

@Component({
  selector: 'app-one-week',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="case-study">
      <section class="section">
        <div class="container">

          <!-- Masthead — same vocabulary as The Archive -->
          <header class="masthead">
            <div class="masthead-rule">
              <span class="rule-tag">CHAPTER TWO · CASE STUDY</span>
            </div>
            <h1 class="title">
              <em>One</em> Week
            </h1>
            <p class="subtitle">
              Four products. Seven days. Two shipped on the same afternoon.
              <span class="mono">[ APR 27 → MAY 04 · 2026 ]</span>
            </p>
          </header>

          <!-- Stat strip — mirrors the filter row vocabulary in The Archive -->
          <div class="stat-strip" aria-label="Sprint summary">
            <div class="stat">
              <span class="stat-num">04</span>
              <span class="stat-label">PRODUCTS</span>
            </div>
            <div class="stat">
              <span class="stat-num">07</span>
              <span class="stat-label">DAYS</span>
            </div>
            <div class="stat">
              <span class="stat-num">04</span>
              <span class="stat-label">LIVE URLS</span>
            </div>
            <div class="stat">
              <span class="stat-num">250</span>
              <span class="stat-label">COMMITS · ALL REPOS</span>
            </div>
          </div>

          <!-- Pre-amble — frame the constraint, not the metrics -->
          <p class="lede">
            <em>The claim</em>: in the seven days ending today, four products went live —
            two of them launched in the same afternoon, hours apart. What follows is the
            ledger, in chronological order. No retconned timeline; commit timestamps speak
            for themselves.
          </p>

          <!-- Timeline -->
          <ol class="timeline">
            @for (entry of rendered(); track $index; let i = $index) {

              <!-- Chapter sub-header sits above the FIRST card of a same-day group -->
              @if (entry.chapter && entry.groupHead) {
                <li class="chapter-head" [style.--theme-accent]="entry.accent">
                  <span class="chapter-rule"></span>
                  <span class="chapter-tag">{{ entry.chapter }}</span>
                  <span class="chapter-rule"></span>
                </li>
              }

              <li
                class="entry"
                [class.entry--grouped]="entry.groupedFollower"
                [style.--theme-accent]="entry.accent"
              >
                <!-- Date stamp -->
                <aside class="date-side">
                  <div class="date-stamp">
                    <span class="date-day">{{ entry.date }}</span>
                    <span class="date-weekday">{{ entry.weekday }}</span>
                  </div>
                  <span class="date-rule"></span>
                  <span class="date-window">{{ entry.windowSummary }}</span>
                </aside>

                <!-- Card -->
                <div class="card">
                  <header class="card-head">
                    <h2 class="card-title">{{ entry.title }}</h2>
                    <p class="card-tagline"><em>{{ entry.tagline }}</em></p>
                  </header>

                  @if (entry.preview) {
                    <a
                      class="polaroid"
                      [href]="entry.liveUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      [attr.aria-label]="'Visit ' + entry.title"
                    >
                      <div class="polaroid-tape"></div>
                      <div class="polaroid-frame">
                        <div class="polaroid-browser">
                          <span class="browser-dot"></span>
                          <span class="browser-dot"></span>
                          <span class="browser-dot"></span>
                          <span class="browser-url">{{ entry.shortUrl }}</span>
                        </div>
                        <img
                          class="polaroid-img"
                          [src]="entry.preview"
                          [alt]="entry.title + ' — live site preview'"
                          loading="lazy"
                          decoding="async"
                        />
                        <div class="polaroid-hover">
                          <span>open live →</span>
                        </div>
                      </div>
                    </a>
                  }

                  <ul class="notes">
                    @for (note of entry.buildNotes; track note; let n = $index) {
                      <li class="note">
                        <span class="note-num">{{ pad(n + 1) }}</span>
                        <span class="note-text">{{ note }}</span>
                      </li>
                    }
                  </ul>

                  <footer class="card-foot">
                    <a
                      class="visit"
                      [href]="entry.liveUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span class="visit-arrow">→</span>
                      <span class="visit-text">view it live</span>
                      <span class="visit-url">{{ entry.shortUrl }}</span>
                    </a>

                    @if (entry.repoUrl) {
                      <a
                        class="repo"
                        [href]="entry.repoUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span class="repo-tag">open source</span>
                        <span class="repo-sep">·</span>
                        <span class="repo-host">{{ entry.shortRepo }}</span>
                        <span class="repo-arrow">↗</span>
                      </a>
                    }

                    @if (entry.archiveSlug) {
                      <a class="archive-link" [routerLink]="['/']" [fragment]="'projects'">
                        <span class="archive-arrow">↩</span>
                        <span>read the long-form in <em>The Archive</em></span>
                      </a>
                    }
                  </footer>
                </div>
              </li>
            }
          </ol>

          <!-- ===== OFF THE RECORD ===== -->
          <!-- The four shipped products are the visible portion. The full
               GitHub ledger for the same window includes private repos and
               work commits that don't normally show up on a portfolio. -->
          <section class="off-record" aria-labelledby="off-record-heading">
            <header class="off-head">
              <div class="off-rule">
                <span class="off-eyebrow">OFF THE RECORD · INCLUDING PRIVATE REPOS</span>
              </div>
              <h2 id="off-record-heading" class="off-title">
                <em>The</em> full ledger
              </h2>
              <p class="off-lede">
                The four products above are what you can click. Below is what GitHub
                actually saw across the same seven days — public, private, and one
                work repository — because most of the throughput lives in places a
                portfolio normally can't show.
              </p>
            </header>

            <!-- Aggregate totals, larger than the top stat strip -->
            <div class="off-totals">
              <div class="off-total">
                <span class="off-total-num">{{ totals.commits }}</span>
                <span class="off-total-label">COMMITS</span>
              </div>
              <div class="off-total">
                <span class="off-total-num">{{ totals.repos }}</span>
                <span class="off-total-label">REPOS TOUCHED</span>
              </div>
              <div class="off-total">
                <span class="off-total-num">{{ totals.privateRepos }}</span>
                <span class="off-total-label">PRIVATE</span>
              </div>
              <div class="off-total">
                <span class="off-total-num">{{ totals.publicRepos }}</span>
                <span class="off-total-label">PUBLIC</span>
              </div>
            </div>

            <!-- Repo ledger — sorted descending by commit count -->
            <div class="ledger" role="table" aria-label="Per-repo commit ledger for the window">
              <div class="ledger-head" role="row">
                <span role="columnheader">REPO</span>
                <span role="columnheader" class="ledger-priv-h">VISIBILITY</span>
                <span role="columnheader" class="ledger-num-h">COMMITS</span>
              </div>
              @for (row of offRecord; track row.name) {
                <div class="ledger-row" role="row" [class.ledger-row--work]="row.privacy === 'WORK · PRIVATE'">
                  <div class="ledger-name" role="cell">
                    <span class="ledger-repo">{{ row.name }}</span>
                    <span class="ledger-blurb">{{ row.blurb }}</span>
                  </div>
                  <span
                    class="ledger-priv"
                    role="cell"
                    [class.priv-public]="row.privacy === 'PUBLIC'"
                    [class.priv-private]="row.privacy === 'PRIVATE'"
                    [class.priv-work]="row.privacy === 'WORK · PRIVATE'"
                  >{{ row.privacy }}</span>
                  <span class="ledger-num" role="cell">{{ row.commits }}</span>
                </div>
              }
            </div>

            <p class="off-foot">
              <em>Context</em>: on GitHub since {{ totals.githubJoined }}.
              This week is not the average — most weeks ship one product, not four.
              The point of this page is to show what's possible when the stack, the
              tooling, and the focus all line up.
            </p>
          </section>

          <!-- ===== ZOOMED OUT — lifetime / yearly base rate ===== -->
          <section class="zoom-out" aria-labelledby="zoom-out-heading">
            <header class="zoom-head">
              <div class="zoom-rule">
                <span class="zoom-eyebrow">ZOOMED OUT · BASE RATE</span>
              </div>
              <h2 id="zoom-out-heading" class="zoom-title">
                <em>The</em> base rate
              </h2>
              <p class="zoom-lede">
                Pulled back from the seven-day window, here is what GitHub's commit
                index records across every repo I've authored to. Sets the context
                for whether one big week is an outlier or a sample of how I work.
              </p>
            </header>

            <div class="zoom-grid">
              <div class="zoom-cell zoom-cell--hero">
                <span class="zoom-num">{{ zoom.lastYearContributions.toLocaleString() }}</span>
                <span class="zoom-label">CONTRIBUTIONS · LAST YEAR</span>
                <span class="zoom-sub">as counted on the GitHub profile calendar (commits, PRs, issues, reviews — public &amp; private)</span>
              </div>
              <div class="zoom-cell">
                <span class="zoom-num">{{ zoom.ytdCommits.toLocaleString() }}</span>
                <span class="zoom-label">COMMITS · 2026 YTD</span>
              </div>
              <div class="zoom-cell">
                <span class="zoom-num">~{{ zoom.weeklyAverage }}</span>
                <span class="zoom-label">CONTRIBUTIONS / WEEK</span>
              </div>
              <div class="zoom-cell">
                <span class="zoom-num">{{ totals.githubJoined.split(' ')[1] }}</span>
                <span class="zoom-label">ON GITHUB SINCE</span>
                <span class="zoom-sub">{{ totals.githubJoined }} · 11 years</span>
              </div>
            </div>

            <!-- The punchline: this week vs the base rate, as a single sentence -->
            <p class="zoom-punch">
              This week — <strong>{{ totals.commits }}</strong> commits.
              About <strong>{{ zoom.weekMultiple }}×</strong> the weekly average.
              <em>Not the floor. Not the ceiling. A sample of what's possible
              when the stack, the tooling, and the focus all line up.</em>
            </p>
          </section>

          <!-- Footer rule + outbound link -->
          <footer class="closing">
            <div class="closing-rule">
              <span class="closing-tag">END · CASE STUDY</span>
            </div>
            <p class="closing-line">
              For the long-form versions of each entry —
              <a [routerLink]="['/']" fragment="projects" class="closing-link">return to <em>The Archive</em> →</a>
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

    .case-study {
      padding-top: 88px; /* clears the fixed nav */
    }

    @media (max-width: 768px) {
      .case-study { padding-top: 72px; }
    }

    /* ===== MASTHEAD ===== */
    .masthead {
      margin-bottom: 4rem;
      max-width: 820px;
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
      .stat-strip {
        grid-template-columns: repeat(2, 1fr);
      }
      .stat {
        padding: 0.75rem 1rem;
        border-right: 1px solid var(--rule);
        border-bottom: 1px solid var(--rule);
      }
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
      margin-bottom: 4rem;
      padding-left: 1.5rem;
      border-left: 1px solid var(--rule);
    }

    .lede em {
      font-style: italic;
      color: var(--brass);
      font-weight: 500;
    }

    /* ===== TIMELINE ===== */
    .timeline {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4rem;
      margin-bottom: 5rem;
    }

    /* Sub-header for grouped same-day entries */
    .chapter-head {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
      margin-bottom: -2rem; /* tuck it just above the next entry */
    }

    .chapter-rule {
      flex: 1;
      height: 1px;
      background: var(--theme-accent, var(--ember));
      opacity: 0.45;
    }

    .chapter-tag {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      color: var(--theme-accent, var(--ember));
      padding: 0 0.5rem;
    }

    /* ===== ENTRY ===== */
    .entry {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 3rem;
      align-items: start;
    }

    .entry--grouped {
      position: relative;
      padding-left: 0;
    }

    /* Vertical "this is part of the same day" rule, only on grouped followers */
    .entry--grouped::before {
      content: '';
      position: absolute;
      left: -1.5rem;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--theme-accent, var(--ember));
      opacity: 0.35;
    }

    .date-side {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: sticky;
      top: 120px;
    }

    .date-stamp {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.85rem 1rem;
      border: 1px solid var(--theme-accent, var(--ember));
      width: max-content;
    }

    .date-day {
      font-family: var(--font-mono);
      font-size: 1rem;
      letter-spacing: 0.2em;
      color: var(--theme-accent, var(--ember));
      font-weight: 600;
    }

    .date-weekday {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      color: var(--text-mute);
    }

    .date-rule {
      width: 40px;
      height: 1px;
      background: var(--rule);
    }

    .date-window {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-faint);
      letter-spacing: 0.05em;
      line-height: 1.5;
      max-width: 180px;
    }

    /* ===== CARD ===== */
    .card {
      max-width: 720px;
    }

    .card-head {
      margin-bottom: 1.75rem;
    }

    .card-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144;
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 400;
      color: var(--paper);
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }

    .card-tagline {
      font-family: var(--font-display);
      font-size: 1.05rem;
      color: var(--text-mute);
      line-height: 1.5;
    }

    .card-tagline em {
      font-style: italic;
    }

    /* ===== POLAROID — borrowed vocabulary from project-card ===== */
    .polaroid {
      display: block;
      position: relative;
      margin-bottom: 2rem;
      text-decoration: none;
      cursor: pointer;
      transform: rotate(-0.4deg);
      transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      max-width: 580px;
    }

    .polaroid:hover {
      transform: rotate(0deg) translateY(-3px);
    }

    .polaroid:hover .polaroid-frame {
      box-shadow:
        0 24px 48px rgba(0, 0, 0, 0.55),
        0 10px 20px rgba(0, 0, 0, 0.35),
        0 0 0 1px var(--theme-accent, var(--ember));
    }

    .polaroid:hover .polaroid-hover { opacity: 1; }
    .polaroid:hover .polaroid-img { filter: brightness(0.7) saturate(0.8); }

    .polaroid-tape {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%) rotate(-2deg);
      width: 80px;
      height: 22px;
      background: rgba(212, 169, 97, 0.25);
      background-image: repeating-linear-gradient(
        90deg,
        transparent 0,
        transparent 4px,
        rgba(255, 255, 255, 0.04) 4px,
        rgba(255, 255, 255, 0.04) 5px
      );
      z-index: 2;
      border-left: 1px solid rgba(212, 169, 97, 0.3);
      border-right: 1px solid rgba(212, 169, 97, 0.3);
      pointer-events: none;
    }

    .polaroid-frame {
      position: relative;
      background: var(--paper);
      padding: 12px 12px 14px;
      box-shadow:
        0 18px 36px rgba(0, 0, 0, 0.45),
        0 7px 14px rgba(0, 0, 0, 0.25);
      transition: box-shadow 0.4s ease;
      overflow: hidden;
    }

    .polaroid-browser {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 6px 10px;
      background: #1a1817;
      margin-bottom: 8px;
      border-radius: 4px 4px 0 0;
    }

    .browser-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(212, 169, 97, 0.4);
    }

    .browser-dot:nth-child(1) { background: #ef4444; }
    .browser-dot:nth-child(2) { background: #eab308; }
    .browser-dot:nth-child(3) { background: #22c55e; }

    .browser-url {
      flex: 1;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--paper-mute);
      letter-spacing: 0.05em;
      padding: 2px 0;
    }

    .polaroid-img {
      width: 100%;
      display: block;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      object-position: top center;
      background: #1a1817;
      transition: filter 0.4s ease;
    }

    .polaroid-hover {
      position: absolute;
      inset: 12px 12px 14px 12px;
      margin-top: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(10, 9, 7, 0.55);
      font-family: var(--font-mono);
      font-size: 0.85rem;
      letter-spacing: 0.2em;
      color: var(--theme-accent, var(--ember));
      text-transform: uppercase;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      font-weight: 600;
    }

    /* ===== NOTES (build-log bullets) ===== */
    .notes {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 2rem;
      padding-left: 0;
    }

    .note {
      display: grid;
      grid-template-columns: 36px 1fr;
      gap: 0.85rem;
      align-items: baseline;
      font-family: var(--font-display);
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text);
    }

    .note-num {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      color: var(--theme-accent, var(--ember));
      padding-top: 0.15rem;
    }

    .note-text {
      font-style: italic;
    }

    /* ===== CARD FOOTER ===== */
    .card-foot {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--rule);
    }

    .visit, .repo, .archive-link {
      display: inline-flex;
      align-items: baseline;
      gap: 0.6rem;
      text-decoration: none;
      color: var(--text);
      transition: color 0.25s;
      width: max-content;
    }

    .visit {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-style: italic;
      color: var(--theme-accent, var(--ember));
    }

    .visit:hover { opacity: 0.85; }

    .visit-arrow {
      font-family: var(--font-mono);
      font-style: normal;
      font-size: 0.9rem;
    }

    .visit-url {
      font-family: var(--font-mono);
      font-style: normal;
      font-size: 0.7rem;
      color: var(--brass-mute);
      letter-spacing: 0.05em;
      margin-left: 0.4rem;
    }

    .repo {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-faint);
      letter-spacing: 0.05em;
    }

    .repo:hover { color: var(--brass); }

    .repo-tag {
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--brass-mute);
    }

    .repo-sep { color: var(--rule-light); }

    .archive-link {
      font-family: var(--font-display);
      font-size: 0.9rem;
      font-style: italic;
      color: var(--text-mute);
    }

    .archive-link:hover { color: var(--ember); }

    .archive-link em { font-style: italic; }

    /* ===== OFF THE RECORD ===== */
    .off-record {
      margin-top: 5rem;
      padding-top: 4rem;
      border-top: 2px solid var(--ember);
    }

    .off-head {
      max-width: 760px;
      margin-bottom: 3rem;
    }

    .off-rule {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .off-rule::before {
      content: '';
      flex: 0 0 40px;
      height: 1px;
      background: var(--ember);
    }

    .off-rule::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--rule);
    }

    .off-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      color: var(--ember);
    }

    .off-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(2.25rem, 5vw, 3.5rem);
      line-height: 1;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
    }

    .off-title em {
      font-style: italic;
      font-weight: 200;
      color: var(--text-mute);
      font-size: 0.6em;
      margin-right: 0.25rem;
    }

    .off-lede {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.05rem;
      line-height: 1.7;
      color: var(--text);
    }

    /* Big totals row */
    .off-totals {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      padding: 2rem 0;
      margin-bottom: 3rem;
      border-top: 1px solid var(--rule);
      border-bottom: 1px solid var(--rule);
    }

    .off-total {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 0 1.5rem;
      border-right: 1px solid var(--rule);
    }

    .off-total:last-child { border-right: none; }

    .off-total-num {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144;
      font-size: clamp(2.5rem, 5vw, 3.75rem);
      line-height: 1;
      color: var(--ember);
      font-weight: 300;
      letter-spacing: -0.03em;
    }

    .off-total-label {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: var(--text-faint);
    }

    /* Ledger table */
    .ledger {
      display: flex;
      flex-direction: column;
      margin-bottom: 2.5rem;
      border: 1px solid var(--rule);
    }

    .ledger-head, .ledger-row {
      display: grid;
      grid-template-columns: 1fr 160px 100px;
      gap: 1.5rem;
      padding: 1rem 1.5rem;
      align-items: center;
    }

    .ledger-head {
      background: rgba(255, 107, 53, 0.04);
      border-bottom: 1px solid var(--rule);
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--text-faint);
    }

    .ledger-priv-h, .ledger-num-h {
      text-align: right;
    }

    .ledger-row {
      border-bottom: 1px dashed var(--rule);
      transition: background 0.25s ease;
    }

    .ledger-row:last-child { border-bottom: none; }

    .ledger-row:hover {
      background: rgba(255, 107, 53, 0.03);
    }

    .ledger-row--work {
      background: rgba(201, 169, 97, 0.04);
    }

    .ledger-name {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      min-width: 0;
    }

    .ledger-repo {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--paper);
      letter-spacing: 0.02em;
      word-break: break-all;
    }

    .ledger-blurb {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 0.9rem;
      color: var(--text-mute);
      line-height: 1.45;
    }

    .ledger-priv {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      text-align: right;
      padding: 0.3rem 0.6rem;
      border: 1px solid var(--rule);
      width: max-content;
      justify-self: end;
    }

    .priv-public {
      color: #5eb87a;
      border-color: rgba(94, 184, 122, 0.3);
    }

    .priv-private {
      color: var(--brass);
      border-color: rgba(201, 169, 97, 0.4);
    }

    .priv-work {
      color: var(--ember);
      border-color: var(--ember-deep);
    }

    .ledger-num {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144;
      font-size: 2rem;
      color: var(--ember);
      text-align: right;
      letter-spacing: -0.02em;
      font-weight: 300;
      line-height: 1;
    }

    .off-foot {
      max-width: 720px;
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1rem;
      line-height: 1.7;
      color: var(--text-mute);
      padding-left: 1.5rem;
      border-left: 1px solid var(--rule);
    }

    .off-foot em {
      font-style: italic;
      color: var(--brass);
      font-weight: 500;
    }

    /* ===== ZOOMED OUT ===== */
    .zoom-out {
      margin-top: 5rem;
      padding-top: 4rem;
      border-top: 1px solid var(--rule);
    }

    .zoom-head {
      max-width: 760px;
      margin-bottom: 3rem;
    }

    .zoom-rule {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .zoom-rule::before {
      content: '';
      flex: 0 0 40px;
      height: 1px;
      background: var(--brass);
    }

    .zoom-rule::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--rule);
    }

    .zoom-eyebrow {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      color: var(--brass);
    }

    .zoom-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(2.25rem, 5vw, 3.5rem);
      line-height: 1;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
    }

    .zoom-title em {
      font-style: italic;
      font-weight: 200;
      color: var(--text-mute);
      font-size: 0.6em;
      margin-right: 0.25rem;
    }

    .zoom-lede {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.05rem;
      line-height: 1.7;
      color: var(--text);
    }

    /* Big stat grid — hero cell spans 2 columns on desktop */
    .zoom-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 0;
      margin-bottom: 3rem;
      border-top: 1px solid var(--rule);
      border-bottom: 1px solid var(--rule);
    }

    .zoom-cell {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 2rem 1.75rem;
      border-right: 1px solid var(--rule);
    }

    .zoom-cell:last-child { border-right: none; }

    .zoom-cell--hero {
      background: rgba(255, 107, 53, 0.04);
    }

    .zoom-cell--hero .zoom-num {
      font-size: clamp(3.5rem, 7vw, 5rem);
      color: var(--ember);
    }

    .zoom-num {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144;
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      line-height: 1;
      color: var(--paper);
      font-weight: 300;
      letter-spacing: -0.03em;
    }

    .zoom-label {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      color: var(--text-faint);
    }

    .zoom-sub {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 0.85rem;
      color: var(--text-mute);
      margin-top: 0.25rem;
    }

    .zoom-punch {
      max-width: 720px;
      font-family: var(--font-display);
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--text);
      padding: 1.75rem 2rem;
      border: 1px solid var(--ember-deep);
      background: rgba(255, 107, 53, 0.05);
      position: relative;
    }

    .zoom-punch::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      width: 24px;
      height: 24px;
      border-top: 2px solid var(--ember);
      border-left: 2px solid var(--ember);
    }

    .zoom-punch::after {
      content: '';
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 24px;
      height: 24px;
      border-bottom: 2px solid var(--ember);
      border-right: 2px solid var(--ember);
    }

    .zoom-punch strong {
      color: var(--ember);
      font-weight: 600;
      font-style: normal;
    }

    .zoom-punch em {
      font-style: italic;
      color: var(--text-mute);
      display: block;
      margin-top: 0.5rem;
      font-size: 0.95rem;
    }

    /* ===== CLOSING ===== */
    .closing {
      margin-top: 4rem;
      padding-top: 3rem;
      border-top: 1px solid var(--rule);
    }

    .closing-rule {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .closing-rule::before, .closing-rule::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--rule);
    }

    .closing-tag {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      color: var(--brass-mute);
    }

    .closing-line {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1rem;
      color: var(--text-mute);
      text-align: center;
    }

    .closing-link {
      color: var(--ember);
      text-decoration: none;
      border-bottom: 1px solid var(--ember-deep);
      transition: opacity 0.25s;
    }

    .closing-link:hover { opacity: 0.85; }

    .closing-link em { font-style: italic; }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 900px) {
      .entry {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .date-side {
        position: static;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
      }
      .date-rule {
        width: 24px;
      }
      .date-window {
        max-width: none;
      }
      .entry--grouped::before {
        left: -0.75rem;
      }
      .polaroid {
        transform: rotate(0deg);
        max-width: 100%;
      }

      .off-totals {
        grid-template-columns: repeat(2, 1fr);
      }
      .off-total {
        padding: 0.75rem 1rem;
        border-right: 1px solid var(--rule);
        border-bottom: 1px solid var(--rule);
      }
      .off-total:nth-child(2n) { border-right: none; }
      .off-total:nth-last-child(-n+2) { border-bottom: none; }

      .ledger-head {
        display: none;
      }
      .ledger-row {
        grid-template-columns: 1fr 80px;
        grid-template-rows: auto auto;
        gap: 0.5rem 1rem;
      }
      .ledger-name {
        grid-column: 1 / -1;
      }
      .ledger-priv {
        grid-row: 2;
        justify-self: start;
        font-size: 0.6rem;
      }
      .ledger-num {
        grid-row: 2;
        font-size: 1.5rem;
      }

      .zoom-grid {
        grid-template-columns: 1fr 1fr;
      }
      .zoom-cell {
        padding: 1.5rem 1.25rem;
        border-right: 1px solid var(--rule);
        border-bottom: 1px solid var(--rule);
      }
      .zoom-cell:nth-child(2n) { border-right: none; }
      .zoom-cell:nth-last-child(-n+2) { border-bottom: none; }
      .zoom-cell--hero {
        grid-column: 1 / -1;
        border-right: none;
      }
    }

    @media (max-width: 640px) {
      .masthead {
        margin-bottom: 2.5rem;
      }
      .lede {
        font-size: 1rem;
        margin-bottom: 2.5rem;
      }
      .timeline {
        gap: 3rem;
      }
      .card-title {
        font-size: 1.5rem;
      }
      .card-tagline {
        font-size: 0.95rem;
      }
      .note {
        font-size: 0.95rem;
        grid-template-columns: 28px 1fr;
        gap: 0.6rem;
      }
      .subtitle .mono {
        display: block;
        margin-left: 0;
        margin-top: 0.5rem;
      }
    }
  `],
})
export class OneWeekComponent implements OnInit {
  private readonly entries = signal<RenderedEntry[]>([]);
  rendered = computed(() => this.entries());

  readonly offRecord = OFF_THE_RECORD;
  readonly totals = OFF_THE_RECORD_TOTALS;
  readonly zoom = ZOOMED_OUT;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Compute group flags so the template knows which card sits at the head
    // of a same-day cluster, and which ones are followers.
    const seenChapters = new Set<string>();
    const initial: RenderedEntry[] = SPRINT_ENTRIES.map((e) => {
      const isHead = !!e.chapter && !seenChapters.has(e.chapter);
      if (e.chapter) seenChapters.add(e.chapter);
      const groupedFollower = !!e.chapter && !isHead;

      return {
        ...e,
        preview: e.staticPreview ?? previewUrl(e.liveUrl),
        groupHead: isHead,
        groupedFollower,
        shortUrl: this.shortHost(e.liveUrl),
        shortRepo: this.shortRepoPath(e.repoUrl),
      };
    });

    this.entries.set(initial);

    // For entries that have no static asset, the preview was set to the
    // Microlink live URL. For entries that DO have a static asset, optionally
    // upgrade to the Microlink screenshot in the background — same approach as
    // ProjectCardComponent (project-card.component.ts:413).
    if (!this.isBrowser) return;

    initial.forEach((entry, idx) => {
      if (!entry.staticPreview || !entry.liveUrl) return;
      const live = previewUrl(entry.liveUrl);
      if (!live) return;

      const img = new Image();
      img.onload = () => {
        const next = [...this.entries()];
        next[idx] = { ...next[idx], preview: live };
        this.entries.set(next);
      };
      img.onerror = () => { /* keep static — no problem */ };
      img.src = live;
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  private shortHost(url: string): string {
    try {
      return new URL(url).host.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  private shortRepoPath(url?: string): string {
    if (!url) return '';
    try {
      const u = new URL(url);
      const path = u.pathname.split('/').filter(Boolean).slice(0, 2).join('/');
      return path ? `${u.host}/${path}` : u.host;
    } catch {
      return url;
    }
  }
}
