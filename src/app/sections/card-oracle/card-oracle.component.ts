import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PROJECTS, Project } from '../../core/models/project.model';
import { TeleportService } from '../../core/services/teleport.service';

/**
 * Second oracle (parallel to the d8 dice). Lives in the hero sidebar as a
 * small stacked-deck button that mirrors the dice's compact form. Clicking
 * it expands a full-screen overlay where eight tarot-style cards fan,
 * shuffle, draw, and reveal — then dispatches a card-shaped teleport to
 * the chosen project.
 *
 * The compact and expanded views share a single component because the
 * draw state, drawn index, and dispatched flag all live on the same
 * machine and we want them aligned across both displays.
 */
@Component({
  selector: 'app-card-oracle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ============== COMPACT (in hero sidebar) ============== -->
    <div class="compact-stage" [class.dimmed]="expanded() || dispatched()">
      <p class="oracle-prompt">
        <span class="oracle-label">ORACLE</span>
        <span class="oracle-sub">draw a card · 8 arcana</span>
      </p>

      <button
        class="deck-trigger"
        (click)="expand()"
        [disabled]="expanded() || dispatched()"
        [attr.aria-label]="'Open the deck oracle to draw an arcanum'"
      >
        <span class="mini-stack">
          <span class="mini-card" [style.--i]="0"></span>
          <span class="mini-card" [style.--i]="1"></span>
          <span class="mini-card" [style.--i]="2"></span>
          <span class="mini-card" [style.--i]="3"></span>
        </span>
      </button>

      <div class="compact-status">
        <span class="compact-status-text">cut the deck · 8 arcana</span>
      </div>
    </div>

    <!-- ============== EXPANDED (full-screen) ============== -->
    @if (expanded()) {
      <div class="expanded-overlay" [class.visible]="expandedVisible()">
        <div class="exp-backdrop" (click)="onBackdropClick()"></div>

        <div class="exp-stage">
          <header class="exp-masthead">
            <div class="exp-rule">
              <span class="exp-rule-tag">INTERLUDE — A SECOND ORACLE</span>
            </div>
            <h2 class="exp-title"><em>Cut</em> the Deck</h2>
            <p class="exp-sub">
              Eight arcana, shuffled. Let the deck pick the next entry.
              <span class="mono">[ {{ stateLabel() }} ]</span>
            </p>
          </header>

          <div class="deck-wrap">
            <div class="deck" [class.draw-active]="isDrawingOrRevealed()">
              @for (project of projects; track project.id; let i = $index) {
                <div #card
                     class="card"
                     [attr.data-idx]="i"
                     [style.--accent]="project.accent"
                     [style.--depth]="i"
                     [class.is-drawn]="drawnIndex() === i">
                  <div class="card-face card-back">
                    <div class="back-frame">
                      <div class="back-mark">CC</div>
                      <div class="back-corners">
                        <span></span><span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                  <div class="card-face card-front">
                    <div class="front-frame">
                      <span class="card-numeral nw">{{ romans[i] }}</span>
                      <div class="card-icon" [innerHTML]="iconSvgs[i]"></div>
                      <span class="card-title">{{ project.title }}</span>
                      <span class="card-numeral se">{{ romans[i] }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="exp-controls">
            <button class="cta cta-primary"
                    (click)="draw()"
                    [disabled]="!canDraw()">
              <span class="cta-arrow">›</span>
              <span class="cta-text">{{ ctaLabel() }}</span>
            </button>
            @if (canCancel()) {
              <button class="cta cta-ghost" (click)="collapse()">
                <span>cancel</span>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    /* ================ COMPACT ================ */
    .compact-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding-top: 1.5rem;
      margin-top: 1rem;
      border-top: 1px solid var(--rule);
      transition: opacity 0.4s ease;
    }
    .compact-stage.dimmed { opacity: 0.25; pointer-events: none; }

    .oracle-prompt {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
      width: 100%;
    }
    .oracle-label {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--brass);
    }
    .oracle-sub {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 0.85rem;
      color: var(--text-mute);
    }

    .deck-trigger {
      position: relative;
      width: 130px;
      height: 130px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      perspective: 700px;
      perspective-origin: center 35%;
      transition: transform 0.3s;
    }
    .deck-trigger:hover:not(:disabled) .mini-card {
      animation: deck-hover 1.6s ease-in-out infinite;
    }
    .deck-trigger:disabled {
      cursor: progress;
      opacity: 0.5;
    }
    .deck-trigger:focus-visible {
      outline: none;
    }
    .deck-trigger:focus-visible .mini-card {
      filter: drop-shadow(0 0 6px var(--brass));
    }

    .mini-stack {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      transform-style: preserve-3d;
      transform: rotateX(-12deg) rotateY(8deg);
    }

    .mini-card {
      position: absolute;
      width: 76px;
      height: 106px;
      top: -53px;
      left: -38px;
      border-radius: 4px;

      background:
        repeating-linear-gradient(
          45deg,
          rgba(201, 169, 97, 0.05) 0,
          rgba(201, 169, 97, 0.05) 2px,
          transparent 2px,
          transparent 6px),
        radial-gradient(ellipse at center,
          var(--ink-warm) 0%,
          var(--ink-deep) 80%);
      border: 1px solid var(--brass-mute);
      box-shadow:
        inset 0 0 0 2px var(--ink-deep),
        inset 0 0 0 3px var(--brass-mute),
        0 4px 8px rgba(0, 0, 0, 0.5);

      transform: translate3d(
                   calc(var(--i) * 2px),
                   calc(var(--i) * -2px),
                   calc(var(--i) * 1px))
                 rotate(calc(var(--i) * 1.2deg - 1.8deg));
    }

    .mini-card::after {
      content: '';
      position: absolute;
      inset: 6px;
      border: 1px solid rgba(201, 169, 97, 0.25);
      border-radius: 2px;
    }

    @keyframes deck-hover {
      0%, 100% { transform: translate3d(calc(var(--i) * 2px), calc(var(--i) * -2px), calc(var(--i) * 1px)) rotate(calc(var(--i) * 1.2deg - 1.8deg)); }
      50%      { transform: translate3d(calc(var(--i) * 2.5px), calc(var(--i) * -3px), calc(var(--i) * 2px)) rotate(calc(var(--i) * 1.5deg - 1.5deg)); }
    }

    .compact-status {
      min-height: 24px;
      width: 100%;
      text-align: center;
    }
    .compact-status-text {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-faint);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    /* ================ EXPANDED OVERLAY ================ */
    .expanded-overlay {
      position: fixed;
      inset: 0;
      z-index: 8500;
      pointer-events: auto;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .expanded-overlay.visible { opacity: 1; }

    .exp-backdrop {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at center,
          rgba(15, 14, 12, 0.85) 0%,
          rgba(5, 4, 3, 0.97) 80%);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    .exp-stage {
      position: relative;
      height: 100%;
      width: 100%;
      max-width: 1080px;
      margin: 0 auto;
      padding: 5rem 2rem 3rem;
      box-sizing: border-box;
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 1.5rem;
      align-items: center;
      justify-items: center;
    }

    .exp-masthead {
      max-width: 720px;
      width: 100%;
      text-align: center;
      animation: exp-fade-in 0.6s ease 0.1s both;
    }

    .exp-rule {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      justify-content: center;
    }
    .exp-rule::before, .exp-rule::after {
      content: '';
      height: 1px;
      background: var(--rule);
    }
    .exp-rule::before { flex: 0 0 60px; background: var(--brass); }
    .exp-rule::after { flex: 1; }

    .exp-rule-tag {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      color: var(--brass);
    }

    .exp-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(2.5rem, 7vw, 5rem);
      line-height: 0.95;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.04em;
      margin-bottom: 0.85rem;
    }
    .exp-title em {
      font-style: italic;
      font-weight: 200;
      color: var(--text-mute);
      font-size: 0.7em;
      margin-right: 0.25rem;
    }
    .exp-sub {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.05rem;
      color: var(--text);
      line-height: 1.6;
    }
    .exp-sub .mono {
      font-family: var(--font-mono);
      font-style: normal;
      font-size: 0.7rem;
      color: var(--brass-mute);
      margin-left: 0.5rem;
      letter-spacing: 0.1em;
    }

    /* ================ DECK STAGE (animation area) ================ */
    .deck-wrap {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1400px;
      perspective-origin: center 40%;
    }
    .deck {
      position: relative;
      width: 200px;
      height: 280px;
      transform-style: preserve-3d;
      animation: exp-fade-in 0.6s ease 0.25s both;
    }

    /* ---- Cards ---- */
    .card {
      --card-w: 200px;
      --card-h: 280px;
      --depth: 0;
      --accent: var(--ember);

      position: absolute;
      top: 0;
      left: 0;
      width: var(--card-w);
      height: var(--card-h);
      transform-style: preserve-3d;
      will-change: transform;

      transform:
        translate3d(
          calc(var(--depth) * 1.5px),
          calc(var(--depth) * -1.5px),
          calc(var(--depth) * 1px))
        rotate(calc(var(--depth) * 0.4deg));
    }

    .card-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      box-sizing: border-box;
      border-radius: 4px;
    }

    .card-back {
      background:
        repeating-linear-gradient(
          45deg,
          rgba(201, 169, 97, 0.04) 0,
          rgba(201, 169, 97, 0.04) 2px,
          transparent 2px,
          transparent 7px),
        radial-gradient(ellipse at center,
          var(--ink-warm) 0%,
          var(--ink-deep) 80%);
      border: 1px solid var(--brass-mute);
      box-shadow:
        inset 0 0 0 4px var(--ink-deep),
        inset 0 0 0 5px var(--brass-mute),
        0 12px 24px rgba(0, 0, 0, 0.6),
        0 4px 8px rgba(0, 0, 0, 0.4);
    }
    .back-frame {
      position: absolute;
      inset: 12px;
      border: 1px solid rgba(201, 169, 97, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .back-mark {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-style: italic;
      font-weight: 300;
      font-size: 2.6rem;
      color: var(--brass);
      letter-spacing: -0.08em;
      text-shadow: 0 0 14px rgba(201, 169, 97, 0.4);
      opacity: 0.85;
    }
    .back-corners span {
      position: absolute;
      width: 18px;
      height: 18px;
      border: 1px solid var(--brass-mute);
    }
    .back-corners span:nth-child(1) { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
    .back-corners span:nth-child(2) { top: -1px; right: -1px; border-left: 0; border-bottom: 0; }
    .back-corners span:nth-child(3) { bottom: -1px; left: -1px; border-right: 0; border-top: 0; }
    .back-corners span:nth-child(4) { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

    .card-front {
      background: linear-gradient(165deg, var(--paper) 0%, var(--paper-mute) 100%);
      border: 1px solid var(--accent);
      box-shadow:
        inset 0 0 0 4px var(--paper),
        inset 0 0 0 5px var(--accent),
        0 12px 24px rgba(0, 0, 0, 0.55);
      transform: rotateY(180deg);
      color: var(--ink);
    }
    .front-frame {
      position: absolute;
      inset: 12px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 0.75rem 1rem;
      display: grid;
      grid-template-rows: auto 1fr auto;
      align-items: center;
      justify-items: center;
      gap: 0.5rem;
      box-sizing: border-box;
    }
    .card-numeral {
      position: absolute;
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-style: italic;
      font-weight: 400;
      font-size: 1.4rem;
      color: var(--accent);
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .card-numeral.nw { top: 8px; left: 12px; }
    .card-numeral.se { bottom: 8px; right: 12px; transform: rotate(180deg); }
    .card-icon {
      grid-row: 2 / 3;
      align-self: center;
      width: 88px;
      height: 88px;
      color: var(--accent);
      filter: drop-shadow(0 0 4px rgba(255, 107, 53, 0.25));
    }
    .card-icon ::ng-deep svg {
      width: 100%;
      height: 100%;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .card-title {
      grid-row: 3 / 4;
      font-family: var(--font-display);
      font-style: italic;
      font-size: 0.78rem;
      color: var(--ink);
      text-align: center;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      line-height: 1.2;
      max-width: 90%;
      margin-bottom: 0.5rem;
    }

    /* While the chosen card is being drawn / revealed, every other card
       fades out so it can't sit visually in front of the rising card. */
    .deck.draw-active .card:not(.is-drawn) {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
    }

    /* ================ EXP CONTROLS ================ */
    .exp-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: exp-fade-in 0.6s ease 0.4s both;
    }
    .cta {
      display: inline-flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1.5rem;
      background: transparent;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.3s, color 0.3s, border-color 0.3s;
    }
    .cta-primary {
      color: var(--paper);
      border: 1px solid var(--brass);
    }
    .cta-primary:hover:not(:disabled) {
      background: var(--brass);
      color: var(--ink);
    }
    .cta-primary:disabled { cursor: progress; opacity: 0.55; }
    .cta-arrow { color: var(--ember); font-size: 1.05rem; line-height: 1; }
    .cta-primary:hover:not(:disabled) .cta-arrow { color: var(--ink); }

    .cta-ghost {
      color: var(--text-faint);
      border: 1px solid var(--rule-light);
    }
    .cta-ghost:hover { color: var(--text); border-color: var(--rule); }

    @keyframes exp-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .deck-trigger:hover .mini-card { animation: none !important; }
      .expanded-overlay { transition: none !important; }
      .exp-masthead, .deck, .exp-controls { animation: none !important; }
    }

    @media (max-width: 1024px) and (min-width: 641px) {
      .compact-stage { flex-direction: row; flex-wrap: wrap; gap: 1.5rem; padding-top: 1rem; margin-top: 0; border-top: none; }
      .oracle-prompt { flex-direction: row; gap: 0.5rem; width: auto; }
      .deck-trigger { width: 110px; height: 110px; }
      .mini-card { width: 64px; height: 90px; top: -45px; left: -32px; }
      .compact-status { flex: 1; text-align: left; min-width: 200px; }
    }

    @media (max-width: 640px) {
      .compact-stage { gap: 0.75rem; padding-top: 1rem; margin-top: 0.5rem; }
      .oracle-prompt { flex-direction: row; align-items: baseline; gap: 0.6rem; width: auto; }
      .deck-trigger { width: 100px; height: 100px; }
      .mini-card { width: 60px; height: 84px; top: -42px; left: -30px; }
      .exp-stage { padding: 4rem 1rem 2rem; gap: 1rem; }
      .deck { width: 160px; height: 224px; }
      .card { --card-w: 160px; --card-h: 224px; }
      .card-icon { width: 64px; height: 64px; }
      .card-title { font-size: 0.65rem; }
      .card-numeral { font-size: 1.1rem; }
    }
  `],
})
export class CardOracleComponent {
  private readonly teleport = inject(TeleportService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly projects: Project[] = PROJECTS;
  readonly romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  /** Pre-trusted SVG markup per project — computed once so [innerHTML] doesn't
   *  recreate SafeHtml on every change-detection pass. */
  readonly iconSvgs: SafeHtml[];

  readonly expanded = signal(false);
  /** Two-step show so we can fade in via CSS transition. */
  readonly expandedVisible = signal(false);

  readonly phase = signal<'idle' | 'fanning' | 'riffling' | 'collapsing' | 'drawing' | 'revealed'>('idle');
  readonly drawnIndex = signal(-1);
  readonly dispatched = signal(false);

  private readonly cardsRef = viewChildren<ElementRef<HTMLElement>>('card');

  readonly canDraw = computed(() =>
    this.expanded() && this.phase() === 'idle' && !this.dispatched(),
  );

  readonly canCancel = computed(() =>
    this.expanded() && this.phase() === 'idle' && !this.dispatched(),
  );

  readonly ctaLabel = computed(() => {
    if (this.dispatched()) return 'summoning';
    switch (this.phase()) {
      case 'idle':       return 'cut the deck';
      case 'fanning':    return 'spreading';
      case 'riffling':   return 'shuffling';
      case 'collapsing': return 'cutting';
      case 'drawing':    return 'drawing';
      case 'revealed':   return 'arcanum drawn';
    }
  });

  readonly stateLabel = computed(() => {
    if (this.dispatched()) return 'fate dispatched';
    const idx = this.drawnIndex();
    switch (this.phase()) {
      case 'idle':       return 'awaiting cut';
      case 'fanning':    return 'fanning the deck';
      case 'riffling':   return 'riffling';
      case 'collapsing': return 'cutting';
      case 'drawing':    return 'drawing';
      case 'revealed':
        return idx >= 0 ? `arcanum ${this.romans[idx]} drawn` : 'drawn';
    }
  });

  constructor() {
    this.iconSvgs = this.projects.map((p) =>
      this.sanitizer.bypassSecurityTrustHtml(
        `<svg viewBox="0 0 24 24">${p.icon}</svg>`,
      ),
    );
  }

  readonly isDrawingOrRevealed = computed(() =>
    this.phase() === 'drawing' || this.phase() === 'revealed',
  );

  // ============== expand / collapse ==============

  expand(): void {
    if (this.expanded() || this.dispatched()) return;
    this.expanded.set(true);
    // Next frame, set visible so the CSS transition runs.
    requestAnimationFrame(() => this.expandedVisible.set(true));
  }

  onBackdropClick(): void {
    if (this.canCancel()) this.collapse();
  }

  collapse(): void {
    if (!this.canCancel()) return;
    this.expandedVisible.set(false);
    window.setTimeout(() => {
      this.expanded.set(false);
      this.phase.set('idle');
      this.drawnIndex.set(-1);
    }, 500);
  }

  // ============== draw ==============

  async draw(): Promise<void> {
    if (!this.canDraw()) return;

    const cards = this.cardsRef().map((r) => r.nativeElement);
    if (cards.length !== this.projects.length) return;

    if (this.prefersReducedMotion()) {
      const pick = Math.floor(Math.random() * this.projects.length);
      this.drawnIndex.set(pick);
      this.phase.set('revealed');
      this.dispatchTeleport(pick, cards[pick]);
      return;
    }

    const pickIdx = Math.floor(Math.random() * this.projects.length);

    this.phase.set('fanning');
    await this.fanOut(cards);

    this.phase.set('riffling');
    await this.riffle(cards);

    this.phase.set('collapsing');
    await this.collapse_(cards, pickIdx);

    // Set drawnIndex BEFORE drawing so .is-drawn / .draw-active engage and
    // every other card fades out, leaving only the chosen card visible.
    this.drawnIndex.set(pickIdx);
    this.phase.set('drawing');
    await this.drawCard(cards, pickIdx);

    this.phase.set('revealed');

    await this.sleep(1700);

    this.dispatchTeleport(pickIdx, cards[pickIdx]);
  }

  // ============== animation phases ==============

  private async fanOut(cards: HTMLElement[]): Promise<void> {
    const N = cards.length;
    const arcDeg = 90;
    const radius = 240;

    const tasks = cards.map((card, i) => {
      const t = (i / (N - 1)) - 0.5;
      const angle = t * arcDeg;
      const dx = Math.sin((angle * Math.PI) / 180) * radius;
      const dy = -Math.cos((angle * Math.PI) / 180) * 70 + 70;
      const z = 30 + i * 2;

      return card.animate(
        [
          this.deckPose(i),
          {
            transform: `translate3d(${dx}px, ${dy}px, ${z}px) rotate(${angle}deg)`,
            offset: 1,
          },
        ],
        {
          duration: 700 + i * 30,
          delay: i * 20,
          easing: 'cubic-bezier(0.2, 0.8, 0.3, 1.05)',
          fill: 'forwards',
        },
      ).finished;
    });

    await Promise.all(tasks);
  }

  private async riffle(cards: HTMLElement[]): Promise<void> {
    const arcDeg = 90;
    const radius = 240;
    const N = cards.length;

    const positionAt = (i: number) => {
      const t = (i / (N - 1)) - 0.5;
      const angle = t * arcDeg;
      const dx = Math.sin((angle * Math.PI) / 180) * radius;
      const dy = -Math.cos((angle * Math.PI) / 180) * 70 + 70;
      const z = 30 + i * 2;
      return { dx, dy, angle, z };
    };

    for (let pass = 0; pass < 2; pass++) {
      const swapTasks = cards.map((card, i) => {
        const partnerOffset = pass % 2 === 0
          ? (i % 2 === 0 ? 1 : -1)
          : (i % 2 === 0 ? -1 : 1);
        const partner = i + partnerOffset;
        if (partner < 0 || partner >= N) return Promise.resolve();
        const here = positionAt(i);
        const there = positionAt(partner);

        return card.animate(
          [
            { transform: `translate3d(${here.dx}px, ${here.dy}px, ${here.z}px) rotate(${here.angle}deg)` },
            {
              transform: `translate3d(${(here.dx + there.dx) / 2}px, ${here.dy - 40}px, ${here.z + 30}px) rotate(${(here.angle + there.angle) / 2}deg)`,
              offset: 0.5,
            },
            { transform: `translate3d(${there.dx}px, ${there.dy}px, ${there.z}px) rotate(${there.angle}deg)`, offset: 1 },
          ],
          { duration: 500, easing: 'ease-in-out', fill: 'forwards' },
        ).finished;
      });
      await Promise.all(swapTasks);
    }
  }

  private async collapse_(cards: HTMLElement[], pickIdx: number): Promise<void> {
    const tasks = cards.map((card, i) => {
      const finalDepth = i === pickIdx ? cards.length - 1 : (i < pickIdx ? i : i - 1);
      return card.animate(
        [
          {},
          {
            transform: `translate3d(${finalDepth * 1.5}px, ${finalDepth * -1.5}px, ${finalDepth * 1}px) rotate(${finalDepth * 0.4}deg)`,
            offset: 1,
          },
        ],
        {
          duration: 450,
          delay: (cards.length - i) * 15,
          easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
          fill: 'forwards',
        },
      ).finished;
    });
    await Promise.all(tasks);
  }

  private async drawCard(cards: HTMLElement[], pickIdx: number): Promise<void> {
    const card = cards[pickIdx];
    await card.animate(
      [
        { transform: 'translate3d(0, 0, 80px) rotateY(0deg) scale(1)', offset: 0 },
        { transform: 'translate3d(0, -50px, 160px) rotateY(0deg) scale(1.1)', offset: 0.35 },
        { transform: 'translate3d(0, -50px, 200px) rotateY(180deg) scale(1.18)', offset: 1 },
      ],
      { duration: 850, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1.05)', fill: 'forwards' },
    ).finished;
  }

  // ============== handoff ==============

  private dispatchTeleport(pickIdx: number, card: HTMLElement): void {
    const project = this.projects[pickIdx];
    this.dispatched.set(true);

    this.teleport.summon({
      project,
      projectIndex: pickIdx,
      faceNumeral: this.romans[pickIdx],
      sourceRect: card.getBoundingClientRect(),
      accent: project.accent,
      ghostKind: 'card',
    });

    // After the teleport cinematic finishes, hide the expanded view + reset.
    window.setTimeout(() => {
      this.expandedVisible.set(false);
      window.setTimeout(() => {
        this.expanded.set(false);
        this.dispatched.set(false);
        this.drawnIndex.set(-1);
        this.phase.set('idle');

        // Cancel any lingering animations on the cards so the deck pose returns.
        const cards = this.cardsRef().map((r) => r.nativeElement);
        cards.forEach((c) => {
          c.getAnimations().forEach((a) => a.cancel());
          c.style.transform = '';
        });
      }, 500);
    }, 5000);
  }

  // ============== helpers ==============

  private deckPose(i: number): Keyframe {
    return {
      transform: `translate3d(${i * 1.5}px, ${i * -1.5}px, ${i * 1}px) rotate(${i * 0.4}deg)`,
      offset: 0,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }
}
