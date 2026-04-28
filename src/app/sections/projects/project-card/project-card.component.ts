import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  computed,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Project, previewUrl } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  template: `
    <article
      class="entry"
      [class.entry--reversed]="reversed()"
      [attr.data-theme]="project().theme"
      [style.--theme-accent]="project().accent"
    >
      <!-- Numeral pillar -->
      <aside class="numeral-side">
        <div class="numeral-block">
          <span class="numeral-prefix">№</span>
          <span class="numeral-digit">{{ paddedIndex() }}</span>
        </div>
        <div class="numeral-meta">
          <span class="cat-tag">{{ getCategoryLabel() }}</span>
          <span class="cat-rule"></span>
          <span class="cat-id">{{ project().id }}</span>
        </div>
      </aside>

      <!-- Main content -->
      <div class="content-side">
        <header class="entry-header">
          <h3 class="entry-title">{{ project().title }}</h3>
          <p class="entry-tagline"><em>{{ project().tagline }}</em></p>
        </header>

        <!-- POLAROID PREVIEW (if site is live) -->
        @if (preview()) {
          <a
            class="polaroid"
            [href]="project().liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            [attr.aria-label]="'Visit ' + project().title"
          >
            <div class="polaroid-tape"></div>
            <div class="polaroid-frame">
              <div class="polaroid-browser">
                <span class="browser-dot"></span>
                <span class="browser-dot"></span>
                <span class="browser-dot"></span>
                <span class="browser-url">{{ shortUrl() }}</span>
              </div>
              <img
                class="polaroid-img"
                [src]="preview()"
                [alt]="project().title + ' — live site preview'"
                loading="lazy"
                decoding="async"
              />
              <div class="polaroid-hover">
                <span>open live →</span>
              </div>
            </div>
            @if (project().previewCaption) {
              <p class="polaroid-caption">{{ project().previewCaption }}</p>
            }
          </a>
        }

        <!-- THEMED SPECIMEN DEVICE -->
        <div class="specimen-frame" [attr.data-kind]="project().theme">
          @switch (project().theme) {
            @case ('ai-chat') {
              <div class="device device-prompt">
                <div class="prompt-bar">
                  <span class="prompt-dot d1"></span>
                  <span class="prompt-dot d2"></span>
                  <span class="prompt-dot d3"></span>
                  <span class="prompt-host">promptmysite.com</span>
                </div>
                <div class="prompt-row prompt-user">
                  <span class="prompt-arrow">›</span>
                  <span>{{ specimenStr('userPrompt') }}</span>
                </div>
                <div class="prompt-row prompt-ai">
                  <span class="prompt-arrow ai">∗</span>
                  <span class="prompt-stream">{{ specimenStr('aiResponse') }}<span class="caret"></span></span>
                </div>
                <div class="prompt-meta">
                  <span>tokens: {{ specimenStr('tokens') }}</span>
                  <span>·</span>
                  <span>streaming</span>
                </div>
              </div>
            }

            @case ('compliance') {
              <div class="device device-compliance">
                <div class="compl-header">
                  <span class="compl-ref">REF: {{ specimenStr('ref') }}</span>
                  <span class="stamp">{{ specimenStr('status') }}</span>
                </div>
                <div class="compl-rule"></div>
                <dl class="compl-list">
                  <div><dt>Scope</dt><dd>{{ specimenStr('scope') }}</dd></div>
                  <div><dt>Signed</dt><dd>{{ specimenStr('signedBy') }}</dd></div>
                </dl>
              </div>
            }

            @case ('fintech-ledger') {
              <div class="device device-ledger">
                <div class="ledger-header">
                  <span>MEMBER</span>
                  <span>PRINCIPAL</span>
                  <span>RATE</span>
                  <span class="r">STATUS</span>
                </div>
                <div class="ledger-row">
                  <span>{{ specimenStr('memberId') }}</span>
                  <span class="amount">{{ specimenStr('principal') }}</span>
                  <span>{{ specimenStr('rate') }}</span>
                  <span class="r status-ok">{{ specimenStr('status') }}</span>
                </div>
                <div class="ledger-foot">
                  <span class="dot"></span><span>committee approved · disbursed</span>
                </div>
              </div>
            }

            @case ('sports-card') {
              <div class="device device-sports">
                <div class="sport-num">{{ specimenStr('cap') }}</div>
                <div class="sport-meta">
                  <span class="sport-pos">{{ specimenStr('position') }}</span>
                  <span class="sport-flag">{{ specimenStr('country') }}</span>
                </div>
                <div class="sport-score">
                  <span class="score-label">MATCH SCORE</span>
                  <span class="score-num">{{ specimenStr('matchScore') }}</span>
                </div>
                <div class="sport-line"></div>
              </div>
            }

            @case ('enterprise-gantt') {
              <div class="device device-gantt">
                <div class="gantt-row">
                  <span class="gantt-wbs">{{ specimenStr('wbs') }}</span>
                  <div class="gantt-track">
                    <div class="gantt-bar"></div>
                  </div>
                </div>
                <div class="gantt-row">
                  <span class="gantt-wbs">WBS-3.2.2</span>
                  <div class="gantt-track">
                    <div class="gantt-bar half"></div>
                  </div>
                </div>
                <div class="gantt-row">
                  <span class="gantt-wbs">WBS-3.2.3</span>
                  <div class="gantt-track">
                    <div class="gantt-bar quarter"></div>
                  </div>
                </div>
                <div class="gantt-meta">
                  <span>{{ specimenStr('task') }}</span>
                  <span class="evm">{{ specimenStr('evm') }}</span>
                </div>
              </div>
            }

            @case ('cv-frame') {
              <div class="device device-cv">
                <div class="cv-frame-bar">
                  <span>FRAME {{ specimenStr('frame') }}</span>
                  <span class="rec">● REC</span>
                </div>
                <div class="cv-canvas">
                  <div class="bbox bbox-1">
                    <span class="bbox-label">{{ specimenStr('detection') }}</span>
                  </div>
                  <div class="bbox bbox-2">
                    <span class="bbox-label">PLAYER · 0.91</span>
                  </div>
                  <div class="bbox bbox-3">
                    <span class="bbox-label">BALL · 0.87</span>
                  </div>
                </div>
                <div class="cv-stats">
                  <span>EVENT: {{ specimenStr('event') }}</span>
                  <span>{{ specimenStr('f1') }}</span>
                </div>
              </div>
            }

            @case ('mobile-chat') {
              <div class="device device-chat">
                <div class="chat-head">
                  <div class="avatar">{{ specimenStr('contact').charAt(0) }}</div>
                  <div>
                    <div class="chat-name">{{ specimenStr('contact') }}</div>
                    <div class="chat-status">{{ specimenStr('lastSeen') }}</div>
                  </div>
                  <div class="chat-unread">{{ specimenStr('unread') }}</div>
                </div>
                <div class="chat-bubble bubble-them">
                  <span>{{ specimenStr('message') }}</span>
                </div>
                <div class="chat-bubble bubble-mine">
                  <span>got it ✓ — added to your context</span>
                </div>
              </div>
            }

            @case ('cockpit-ops') {
              <div class="device device-cockpit">
                <div class="cockpit-bar">
                  <span class="cockpit-pulse"></span>
                  <span class="cockpit-title">MCU COCKPIT</span>
                  <span class="cockpit-status">OPS · LIVE</span>
                </div>
                <div class="cockpit-stats">
                  <div class="cockpit-stat">
                    <span class="stat-label">TICKETS</span>
                    <span class="stat-value">{{ specimenStr('tickets') }}</span>
                  </div>
                  <div class="cockpit-stat">
                    <span class="stat-label">DEPLOYS</span>
                    <span class="stat-value">{{ specimenStr('deploys') }}</span>
                  </div>
                  <div class="cockpit-stat">
                    <span class="stat-label">AGENTS</span>
                    <span class="stat-value">{{ specimenStr('agents') }}</span>
                  </div>
                </div>
                <div class="cockpit-feed">
                  <div class="feed-row">
                    <span class="feed-arrow">▸</span>
                    <span class="feed-text">{{ specimenStr('activity1') }}</span>
                    <span class="feed-state agent">{{ specimenStr('activity1State') }}</span>
                  </div>
                  <div class="feed-row">
                    <span class="feed-arrow">▸</span>
                    <span class="feed-text">{{ specimenStr('activity2') }}</span>
                    <span class="feed-state running">{{ specimenStr('activity2State') }}</span>
                  </div>
                  <div class="feed-row">
                    <span class="feed-arrow">▸</span>
                    <span class="feed-text">{{ specimenStr('activity3') }}</span>
                    <span class="feed-state ok">{{ specimenStr('activity3State') }}</span>
                  </div>
                  <div class="feed-row">
                    <span class="feed-arrow">▸</span>
                    <span class="feed-text">{{ specimenStr('activity4') }}</span>
                    <span class="feed-state">{{ specimenStr('activity4State') }}</span>
                  </div>
                </div>
              </div>
            }

            @case ('service-stamp') {
              <div class="device device-stamp">
                <div class="stamp-row">
                  <div class="stamp-col">
                    <span class="stamp-label">INTAKE</span>
                    <span class="stamp-text">{{ specimenStr('intake') }}</span>
                  </div>
                  <div class="stamp-arrow">→</div>
                  <div class="stamp-col">
                    <span class="stamp-label">SHIPPED</span>
                    <span class="stamp-text">{{ specimenStr('shipped') }}</span>
                  </div>
                </div>
                <div class="stamp-mark">
                  <span class="stamp-num">{{ specimenStr('days') }}</span>
                  <span class="stamp-unit">DAY<br/>TURNAROUND</span>
                </div>
                <div class="stamp-foot">{{ specimenStr('guarantee') }}</div>
              </div>
            }
          }
        </div>

        <p class="entry-description">{{ project().description }}</p>

        <!-- Two-column meta -->
        <div class="meta-grid">
          <div class="meta-block">
            <div class="meta-heading">
              <span class="meta-num">i.</span>
              <span class="meta-label">stack</span>
            </div>
            <ul class="tech-list">
              @for (tech of project().techStack; track tech.name) {
                <li class="tech-item" [attr.data-cat]="tech.category">
                  {{ tech.name }}
                </li>
              }
            </ul>
          </div>

          <div class="meta-block">
            <div class="meta-heading">
              <span class="meta-num">ii.</span>
              <span class="meta-label">notes</span>
            </div>
            <ol class="feature-list">
              @for (feature of project().features; track feature; let f = $index) {
                <li class="feature-item">
                  <span class="feature-num">{{ pad(f + 1) }}</span>
                  <span class="feature-text">{{ feature }}</span>
                </li>
              }
            </ol>
          </div>
        </div>

        @if (project().liveUrl) {
          <footer class="entry-footer">
            <a
              class="visit-link"
              [href]="project().liveUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="visit-arrow">→</span>
              <span class="visit-text">view it live</span>
              <span class="visit-url">{{ shortUrl() }}</span>
            </a>
          </footer>
        } @else {
          <footer class="entry-footer">
            <span class="no-link">
              <span class="visit-arrow">◉</span>
              <span>internal · not public</span>
            </span>
          </footer>
        }
      </div>
    </article>
  `,
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent implements OnInit {
  project = input.required<Project>();
  index = input<number>(0);
  reversed = input<boolean>(false);

  /** Current preview src — starts with the static asset, upgrades to live Microlink when loaded */
  currentPreview = signal<string | null>(null);
  livePreviewLoaded = signal(false);

  preview = computed(() => this.currentPreview());

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const p = this.project();

    // Polaroid is only shown when a staticPreview is provided.
    // This lets us opt-out per project (e.g. MCU with no public URL,
    // Rugby CV where the headless screenshot is unreliable).
    if (!p.staticPreview) return;

    // Step 1: Show static preview immediately (instant)
    this.currentPreview.set(p.staticPreview);

    // Step 2: Preload the live Microlink screenshot in background — browser only.
    // SSR/prerender renders without `Image`, so guard with isPlatformBrowser.
    if (this.isBrowser && p.liveUrl) {
      const liveUrl = previewUrl(p.liveUrl);
      if (liveUrl) {
        const img = new Image();
        img.onload = () => {
          this.currentPreview.set(liveUrl);
          this.livePreviewLoaded.set(true);
        };
        img.onerror = () => {
          // Live failed — keep showing static, no problem
        };
        img.src = liveUrl;
      }
    }
  }

  paddedIndex(): string {
    return this.index().toString().padStart(2, '0');
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  shortUrl(): string {
    const url = this.project().liveUrl;
    if (!url) return '';
    try {
      const u = new URL(url);
      return u.host.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  specimenStr(key: string): string {
    const v = this.project().specimen.data[key];
    return v != null ? String(v) : '';
  }

  getCategoryLabel(): string {
    const labels: Record<string, string> = {
      'saas': 'SAAS',
      'platform': 'PLATFORM',
      'enterprise': 'ENTERPRISE',
      'consultancy': 'CONSULTANCY',
      'ml': 'ML/CV',
      'service': 'SERVICE',
    };
    return labels[this.project().category] || this.project().category.toUpperCase();
  }
}
