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
 * Second oracle: a deck of eight tarot-styled cards that shuffles, draws one,
 * reveals the entry, then hands off to the teleport overlay (with the card
 * itself as the ghost). Parallel to the d8 dice in the hero.
 *
 * Animation flow (~4.7s before the teleport fires):
 *   1. Fan out — cards lift from the deck into an arc.
 *   2. Riffle — cards swap positions in two quick passes.
 *   3. Collapse — cards return to the stack with the picked one on top.
 *   4. Draw — top card lifts out, flips face-up, scales up at centre.
 *   5. Hold — drawn card displayed for the user.
 *   6. Dispatch — TeleportService.summon({ ghostKind: 'card', ... }).
 */
@Component({
  selector: 'app-card-oracle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="card-oracle" class="section card-oracle">
      <div class="container">
        <header class="masthead">
          <div class="masthead-rule">
            <span class="rule-tag">INTERLUDE — A SECOND ORACLE</span>
          </div>
          <h2 class="archive-title">
            <em>Cut</em> the Deck
          </h2>
          <p class="archive-subtitle">
            Eight arcana, shuffled. Let the deck pick the next entry.
            <span class="mono">[ {{ stateLabel() }} ]</span>
          </p>
        </header>

        <div class="stage"
             [class.shuffling]="phase() !== 'idle' && phase() !== 'revealed'"
             [class.revealed]="phase() === 'revealed'"
             [class.dispatched]="dispatched()">
          <div class="deck">
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
                    <div class="card-icon" [innerHTML]="iconSvg(project)"></div>
                    <span class="card-title">{{ project.title }}</span>
                    <span class="card-numeral se">{{ romans[i] }}</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <button class="cta"
                  (click)="draw()"
                  [disabled]="!canDraw()">
            <span class="cta-arrow">›</span>
            <span class="cta-text">{{ ctaLabel() }}</span>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .card-oracle {
      background: var(--ink-deep);
      position: relative;
      overflow: hidden;
    }
    .card-oracle::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at top, rgba(201, 169, 97, 0.04) 0%, transparent 60%),
        radial-gradient(ellipse at bottom, rgba(255, 107, 53, 0.03) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ---- Masthead (mirrors the projects section) ---- */
    .masthead {
      margin-bottom: 4rem;
      max-width: 780px;
      position: relative;
      z-index: 2;
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
      background: var(--brass);
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
    .archive-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(3rem, 8vw, 6rem);
      line-height: 0.95;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.04em;
      margin-bottom: 1.25rem;
    }
    .archive-title em {
      font-style: italic;
      font-weight: 200;
      color: var(--text-mute);
      font-size: 0.7em;
      margin-right: 0.25rem;
    }
    .archive-subtitle {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.15rem;
      color: var(--text);
      line-height: 1.6;
    }
    .archive-subtitle .mono {
      font-family: var(--font-mono);
      font-style: normal;
      font-size: 0.75rem;
      color: var(--brass-mute);
      margin-left: 0.75rem;
      letter-spacing: 0.1em;
    }

    /* ---- Stage ---- */
    .stage {
      position: relative;
      height: 460px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      perspective: 1400px;
      perspective-origin: center 35%;
    }

    .deck {
      position: relative;
      width: 200px;
      height: 280px;
      transform-style: preserve-3d;
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

      /* Stacked deck: each card slightly offset for 3D depth */
      transform:
        translate3d(
          calc(var(--depth) * 1.5px),
          calc(var(--depth) * -1.5px),
          calc(var(--depth) * 1px))
        rotate(calc(var(--depth) * 0.4deg));
      transition: transform 0.4s ease;
    }

    .card-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      box-sizing: border-box;
      border-radius: 4px;
    }

    /* Card BACK — dark with brass ornament */
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
      opacity: 0.8;
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

    /* Card FRONT — paper with project info */
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
    .card-numeral.se {
      bottom: 8px;
      right: 12px;
      transform: rotate(180deg);
    }
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

    /* ---- CTA ---- */
    .cta {
      display: inline-flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1.5rem;
      background: transparent;
      color: var(--paper);
      border: 1px solid var(--brass);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.3s, color 0.3s, border-color 0.3s;
      position: relative;
      z-index: 3;
    }
    .cta:hover:not(:disabled) {
      background: var(--brass);
      color: var(--ink);
    }
    .cta:disabled {
      cursor: progress;
      opacity: 0.55;
    }
    .cta-arrow {
      color: var(--ember);
      font-size: 1.05rem;
      line-height: 1;
    }
    .cta:hover:not(:disabled) .cta-arrow { color: var(--ink); }

    /* ---- States ---- */
    .stage.dispatched .deck { opacity: 0; transition: opacity 0.5s ease; }

    @media (prefers-reduced-motion: reduce) {
      .card { transition: none !important; }
    }

    /* Tablet & mobile */
    @media (max-width: 768px) {
      .stage { height: 420px; }
      .deck {
        --card-scale: 0.85;
        width: calc(200px * var(--card-scale));
        height: calc(280px * var(--card-scale));
      }
      .card {
        --card-w: calc(200px * var(--card-scale, 0.85));
        --card-h: calc(280px * var(--card-scale, 0.85));
        width: var(--card-w);
        height: var(--card-h);
      }
      .archive-title { font-size: clamp(2.25rem, 12vw, 3rem); }
    }
    @media (max-width: 480px) {
      .stage { height: 380px; gap: 1.5rem; }
      .deck {
        --card-scale: 0.7;
      }
    }
  `],
})
export class CardOracleComponent {
  private readonly teleport = inject(TeleportService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly projects: Project[] = PROJECTS;
  readonly romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  /** State machine: idle → fanning → riffling → collapsing → drawing → revealed → dispatched. */
  readonly phase = signal<'idle' | 'fanning' | 'riffling' | 'collapsing' | 'drawing' | 'revealed'>('idle');
  readonly drawnIndex = signal(-1);
  readonly dispatched = signal(false);

  private readonly cardsRef = viewChildren<ElementRef<HTMLElement>>('card');

  readonly canDraw = computed(() =>
    this.phase() === 'idle' && !this.dispatched(),
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

  iconSvg(project: Project): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg viewBox="0 0 24 24">${project.icon}</svg>`,
    );
  }

  async draw(): Promise<void> {
    if (!this.canDraw()) return;

    const cards = this.cardsRef().map((r) => r.nativeElement);
    if (cards.length !== this.projects.length) return;

    if (this.prefersReducedMotion()) {
      // Skip the choreography for accessibility — pick + dispatch directly.
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
    await this.collapse(cards, pickIdx);

    this.phase.set('drawing');
    await this.drawCard(cards, pickIdx);

    this.drawnIndex.set(pickIdx);
    this.phase.set('revealed');

    // Hold so the user reads the entry.
    await this.sleep(1700);

    this.dispatchTeleport(pickIdx, cards[pickIdx]);
  }

  // -------------- animation phases --------------

  /** Cards lift out of the deck and arc into a hand. */
  private async fanOut(cards: HTMLElement[]): Promise<void> {
    const N = cards.length;
    const arcDeg = 90; // total spread
    const radius = 240;

    const tasks = cards.map((card, i) => {
      // Spread cards from -arcDeg/2 to +arcDeg/2
      const t = (i / (N - 1)) - 0.5; // -0.5 .. +0.5
      const angle = t * arcDeg;
      const dx = Math.sin((angle * Math.PI) / 180) * radius;
      const dy = -Math.cos((angle * Math.PI) / 180) * 70 + 70; // shallow downward arc
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

  /** Quick riffle: cards swap pairs twice, with a flutter. */
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

    // Two passes of pair swaps. Cards flick up + over to a swapped slot.
    const passes = 2;
    for (let pass = 0; pass < passes; pass++) {
      const swapTasks = cards.map((card, i) => {
        // Pair partner: (i, i^1) — swap adjacent pairs (0↔1, 2↔3, ...).
        // For odd pass, shift by 1 so different pairs swap.
        const partnerOffset = pass % 2 === 0 ? (i % 2 === 0 ? 1 : -1) : (i % 2 === 0 ? -1 : 1);
        const partner = i + partnerOffset;
        if (partner < 0 || partner >= N) return Promise.resolve();
        const here = positionAt(i);
        const there = positionAt(partner);

        // Flick up, swap, settle.
        return card.animate(
          [
            { transform: `translate3d(${here.dx}px, ${here.dy}px, ${here.z}px) rotate(${here.angle}deg)` },
            { transform: `translate3d(${(here.dx + there.dx) / 2}px, ${here.dy - 40}px, ${here.z + 30}px) rotate(${(here.angle + there.angle) / 2}deg)`, offset: 0.5 },
            { transform: `translate3d(${there.dx}px, ${there.dy}px, ${there.z}px) rotate(${there.angle}deg)`, offset: 1 },
          ],
          { duration: 500, easing: 'ease-in-out', fill: 'forwards' },
        ).finished;
      });
      await Promise.all(swapTasks);
    }
  }

  /** Cards return to the deck stack, with the picked card placed on top. */
  private async collapse(cards: HTMLElement[], pickIdx: number): Promise<void> {
    const tasks = cards.map((card, i) => {
      // Visual depth — picked card rendered on top (highest depth).
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

  /** Picked card lifts out of the deck, scales up, and flips face-up. */
  private async drawCard(cards: HTMLElement[], pickIdx: number): Promise<void> {
    const card = cards[pickIdx];

    await card.animate(
      [
        {
          transform: 'translate3d(0, 0, 80px) rotateY(0deg) scale(1)',
          offset: 0,
        },
        {
          transform: 'translate3d(0, -50px, 160px) rotateY(0deg) scale(1.1)',
          offset: 0.35,
        },
        {
          transform: 'translate3d(0, -50px, 200px) rotateY(180deg) scale(1.18)',
          offset: 1,
        },
      ],
      { duration: 850, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1.05)', fill: 'forwards' },
    ).finished;
  }

  // -------------- handoff --------------

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

    // Reset after the cinematic finishes.
    window.setTimeout(() => {
      this.dispatched.set(false);
      this.drawnIndex.set(-1);
      this.phase.set('idle');
      // Snap cards back to deck pose.
      const cards = this.cardsRef().map((r) => r.nativeElement);
      cards.forEach((c, i) => {
        c.getAnimations().forEach((a) => a.cancel());
        c.style.transform = '';
      });
    }, 5500);
  }

  // -------------- helpers --------------

  /** Keyframe representing a card sitting in the stack at depth `i`. */
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
