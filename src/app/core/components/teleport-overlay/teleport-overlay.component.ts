import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  GhostKind,
  TeleportRequest,
  TeleportService,
} from '../../services/teleport.service';

/** Mooncake's special card: Queen of Hearts (filled crown + heart). */
const QUEEN_OF_HEARTS_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M 30 30 L 36 14 L 42 27 L 50 8 L 58 27 L 64 14 L 70 30 L 70 34 L 30 34 Z"/>
  <circle cx="38" cy="22" r="1.5" style="fill: rgba(255, 220, 220, 0.65); stroke: none;"/>
  <circle cx="50" cy="16" r="2"   style="fill: rgba(255, 230, 230, 0.8);  stroke: none;"/>
  <circle cx="62" cy="22" r="1.5" style="fill: rgba(255, 220, 220, 0.65); stroke: none;"/>
  <path d="M 50 92 C 30 80 14 62 14 47 C 14 37 22 30 30 30 C 38 30 45 35 50 42 C 55 35 62 30 70 30 C 78 30 86 37 86 47 C 86 62 70 80 50 92 Z"/>
</svg>`;

/**
 * Full-screen cinematic overlay played when the dice oracle picks a project.
 *
 * Sequence (~2.5s):
 *   1. Backdrop dims the page.
 *   2. A spectral copy of the rolled face rises from the dice's location to
 *      the centre of the viewport, glowing.
 *   3. A swirling ember portal opens beneath it.
 *   4. The face plummets into the portal, spinning down to a point.
 *   5. The portal collapses with a flash of light.
 *   6. While the flash hides the page, we scroll to the chosen project.
 *   7. Backdrop fades out, project card receives a `.fate-glow` impact.
 *
 * Honors `prefers-reduced-motion` by skipping the animation and scrolling
 * directly.
 */
@Component({
  selector: 'app-teleport-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" [class.active]="active()">
      <div class="backdrop" #backdrop></div>

      <div class="portal" #portal>
        <span class="portal-ring"></span>
        <span class="portal-core"></span>
      </div>

      <!-- Spectral ghost — either the rolled triangular face or the drawn tarot card. -->
      <div class="ghost"
           #ghost
           [class.ghost-face]="kind() === 'face'"
           [class.ghost-card]="kind() === 'card'"
           [style.--accent]="accent()">
        @if (kind() === 'face') {
          <span class="ghost-numeral">{{ numeral() }}</span>
        } @else {
          <div class="card-frame">
            <span class="card-numeral nw">
              <span class="numeral-letter">{{ numeral() }}</span>
              @if (cornerSuit()) {
                <span class="numeral-suit">{{ cornerSuit() }}</span>
              }
            </span>
            <div class="card-icon"
                 [class.is-queen]="isQueen()"
                 [innerHTML]="iconSvg()"></div>
            <span class="card-title">{{ title() }}</span>
            <span class="card-numeral se">
              <span class="numeral-letter">{{ numeral() }}</span>
              @if (cornerSuit()) {
                <span class="numeral-suit">{{ cornerSuit() }}</span>
              }
            </span>
          </div>
        }
      </div>

      <div class="flash" #flash></div>
    </div>
  `,
  styles: [`
    :host { display: contents; }

    .overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9000;
      visibility: hidden;
      contain: layout paint;
    }
    .overlay.active { visibility: visible; }

    /* ---------------- backdrop ---------------- */
    .backdrop {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at center,
          rgba(15, 14, 12, 0.55) 0%,
          rgba(10, 9, 7, 0.96) 78%);
      opacity: 0;
      will-change: opacity;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    }

    /* ---------------- portal ---------------- */
    .portal {
      position: fixed;
      width: 360px;
      height: 360px;
      left: -180px;     /* element's centre is at left:0 */
      top: -180px;      /* element's centre is at top:0  */
      opacity: 0;
      transform: translate(0, 0) scale(0);
      will-change: transform, opacity;
      pointer-events: none;
    }

    .portal-ring,
    .portal-core {
      position: absolute;
      inset: 0;
      border-radius: 50%;
    }

    .portal-ring {
      background:
        conic-gradient(
          from 0deg,
          rgba(255, 107, 53, 0.95) 0%,
          rgba(255, 200, 130, 0.75) 18%,
          rgba(255, 107, 53, 0.4)   38%,
          rgba(60, 20, 8, 0.85)     55%,
          rgba(255, 107, 53, 0.95)  82%,
          rgba(255, 200, 130, 0.6)  92%,
          rgba(255, 107, 53, 0.95) 100%);
      filter: blur(6px) drop-shadow(0 0 30px rgba(255, 107, 53, 0.6));
      mask: radial-gradient(circle at center,
            transparent 36%,
            black 42%,
            black 70%,
            transparent 88%);
      -webkit-mask: radial-gradient(circle at center,
            transparent 36%,
            black 42%,
            black 70%,
            transparent 88%);
    }
    /* Only spin while the overlay is active — otherwise it would burn frames
       continuously even though it's invisible (visibility: hidden doesn't
       suspend running animations). */
    .overlay.active .portal-ring {
      animation: portal-spin 1.6s linear infinite;
    }

    .portal-core {
      background:
        radial-gradient(circle at center,
          #050402 0%,
          #050402 36%,
          rgba(40, 12, 4, 0.9) 46%,
          transparent 65%);
      box-shadow:
        inset 0 0 60px rgba(0, 0, 0, 0.85),
        0 0 80px rgba(255, 107, 53, 0.55);
    }

    @keyframes portal-spin {
      to { transform: rotate(360deg); }
    }

    /* ---------------- ghost (rising form) ---------------- */
    .ghost {
      --accent: var(--ember, #ff6b35);

      position: fixed;
      left: 0;
      top: 0;

      opacity: 0;
      transform: translate(0, 0) scale(0.5);
      will-change: transform, opacity;
    }

    /* Triangular dice face variant */
    .ghost.ghost-face {
      width: 140px;
      height: 121px;
      margin-left: -70px;
      margin-top: -60px;

      box-sizing: border-box;
      padding-top: 42px;

      display: flex;
      align-items: center;
      justify-content: center;

      background: linear-gradient(160deg, var(--accent) 0%, #b54620 78%);
      border: 2px solid var(--paper, #f4ecd8);
      box-shadow:
        0 0 30px rgba(255, 107, 53, 0.7),
        0 0 60px rgba(255, 107, 53, 0.35),
        inset 0 0 0 1px rgba(255, 255, 255, 0.3),
        inset 4px 4px 14px rgba(0, 0, 0, 0.25);
      clip-path: polygon(50% 1%, 99% 99%, 1% 99%);
    }

    .ghost-numeral {
      font-family: var(--font-display, Georgia, serif);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-style: italic;
      font-weight: 400;
      font-size: 2.6rem;
      letter-spacing: -0.05em;
      color: var(--ink, #0a0907);
      text-shadow: 0 0 10px rgba(255, 240, 200, 0.55);
    }

    /* Rectangular tarot card variant */
    .ghost.ghost-card {
      width: 200px;
      height: 280px;
      margin-left: -100px;
      margin-top: -140px;
      padding: 12px;
      box-sizing: border-box;

      background: linear-gradient(165deg, #f4ecd8 0%, #e0d5b8 100%);
      border: 1px solid var(--accent);
      box-shadow:
        0 0 30px rgba(255, 200, 130, 0.55),
        0 0 60px rgba(255, 107, 53, 0.35),
        0 18px 36px rgba(0, 0, 0, 0.5),
        inset 0 0 0 4px rgba(244, 236, 216, 0.6),
        inset 0 0 0 5px var(--accent);
    }

    .ghost.ghost-card .card-frame {
      position: relative;
      width: 100%;
      height: 100%;
      border: 1px solid rgba(0, 0, 0, 0.18);
      padding: 0.5rem 0.75rem;
      box-sizing: border-box;

      display: grid;
      grid-template-rows: auto 1fr auto;
      align-items: center;
      justify-items: center;
      gap: 0.4rem;
    }

    .ghost.ghost-card .card-numeral {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
      color: var(--accent);
      font-family: var(--font-display, Georgia, serif);
    }
    .ghost.ghost-card .card-numeral.nw { top: 6px; left: 10px; }
    .ghost.ghost-card .card-numeral.se {
      bottom: 6px; right: 10px;
      transform: rotate(180deg);
    }
    .ghost.ghost-card .numeral-letter {
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-style: italic;
      font-weight: 400;
      font-size: 1.3rem;
      letter-spacing: -0.03em;
    }
    .ghost.ghost-card .numeral-suit {
      font-size: 0.9rem;
      font-style: normal;
      margin-top: -1px;
    }

    .ghost.ghost-card .card-icon {
      width: 80px;
      height: 80px;
      color: var(--accent);
      grid-row: 2 / 3;
      align-self: center;
      filter: drop-shadow(0 0 8px rgba(255, 107, 53, 0.4));
    }
    .ghost.ghost-card .card-icon ::ng-deep svg {
      width: 100%;
      height: 100%;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    /* Mooncake's Queen of Hearts is filled, not stroked. */
    .ghost.ghost-card .card-icon.is-queen ::ng-deep svg {
      stroke: none;
      fill: currentColor;
    }

    .ghost.ghost-card .card-title {
      grid-row: 3 / 4;
      font-family: var(--font-display, Georgia, serif);
      font-style: italic;
      font-size: 0.78rem;
      color: var(--ink, #0a0907);
      text-align: center;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      max-width: 90%;
      line-height: 1.2;
      margin-bottom: 0.4rem;
    }

    /* ---------------- flash ---------------- */
    .flash {
      position: fixed;
      left: 50%;
      top: 50%;
      width: 220vmax;
      height: 220vmax;
      transform: translate(-50%, -50%) scale(0);
      border-radius: 50%;
      background:
        radial-gradient(circle at center,
          rgba(255, 220, 160, 0.95) 0%,
          rgba(255, 140, 70, 0.55) 22%,
          rgba(255, 107, 53, 0.18) 46%,
          transparent 75%);
      opacity: 0;
      will-change: transform, opacity;
      mix-blend-mode: screen;
    }

    @media (prefers-reduced-motion: reduce) {
      .overlay { display: none !important; }
    }
  `],
})
export class TeleportOverlayComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly teleport = inject(TeleportService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly active = signal(false);
  readonly numeral = signal('');
  readonly accent = signal('var(--ember)');
  readonly kind = signal<GhostKind>('face');
  readonly title = signal('');
  readonly iconSvg = signal<SafeHtml>('');
  /** Suit symbol shown beneath the numeral; null for non-special cards. */
  readonly cornerSuit = signal<string | null>(null);
  /** True when the icon is the filled Queen of Hearts (Mooncake's card). */
  readonly isQueen = signal(false);

  private readonly backdropRef = viewChild.required<ElementRef<HTMLElement>>('backdrop');
  private readonly portalRef = viewChild.required<ElementRef<HTMLElement>>('portal');
  private readonly ghostRef = viewChild.required<ElementRef<HTMLElement>>('ghost');
  private readonly flashRef = viewChild.required<ElementRef<HTMLElement>>('flash');

  private busy = false;

  constructor() {
    effect(() => {
      const req = this.teleport.request();
      if (req && this.isBrowser && !this.busy) {
        void this.runTeleport(req);
      }
    });
  }

  private async runTeleport(req: TeleportRequest): Promise<void> {
    this.busy = true;

    if (this.prefersReducedMotion()) {
      this.scrollToTarget(req);
      this.teleport.clear();
      this.busy = false;
      return;
    }

    this.accent.set(req.accent);
    this.kind.set(req.ghostKind);
    this.title.set(req.project.title);

    // Mooncake gets the Queen of Hearts treatment when arriving via the
    // card oracle: corners read "Q♥", icon is a filled crown + heart.
    const queen = req.ghostKind === 'card' && req.project.id === 'mooncake';
    this.numeral.set(queen ? 'Q' : req.faceNumeral);
    this.cornerSuit.set(queen ? '♥' : null);
    this.isQueen.set(queen);
    this.iconSvg.set(this.sanitizer.bypassSecurityTrustHtml(
      queen ? QUEEN_OF_HEARTS_SVG : `<svg viewBox="0 0 24 24">${req.project.icon}</svg>`,
    ));

    this.active.set(true);

    // Wait for the overlay to commit to the DOM with the new state.
    await this.frame();

    const backdrop = this.backdropRef().nativeElement;
    const portal = this.portalRef().nativeElement;
    const ghost = this.ghostRef().nativeElement;
    const flash = this.flashRef().nativeElement;

    const srcX = req.sourceRect.left + req.sourceRect.width / 2;
    const srcY = req.sourceRect.top + req.sourceRect.height / 2;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const portalY = cy + 130;

    // -------- 1. Backdrop in + ghost rises (0 → 1300 ms) --------
    backdrop.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 700, fill: 'forwards', easing: 'ease-out' },
    );

    ghost.animate(
      [
        { transform: `translate(${srcX}px, ${srcY}px) scale(0.45) rotate(-15deg)`, opacity: 0 },
        { transform: `translate(${srcX}px, ${srcY - 24}px) scale(0.7) rotate(0deg)`, opacity: 1, offset: 0.18 },
        { transform: `translate(${cx}px, ${cy - 35}px) scale(1.5) rotate(0deg)`, opacity: 1 },
      ],
      { duration: 1300, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1.15)', fill: 'forwards' },
    );
    await this.sleep(1300);

    // -------- 2. Hover at apex while portal opens (1300 → 1900 ms) --------
    // Hold the ghost at the apex with a subtle hover so the eye registers it.
    ghost.animate(
      [
        { transform: `translate(${cx}px, ${cy - 35}px) scale(1.5) rotate(0deg)` },
        { transform: `translate(${cx}px, ${cy - 42}px) scale(1.55) rotate(2deg)`, offset: 0.5 },
        { transform: `translate(${cx}px, ${cy - 35}px) scale(1.5) rotate(0deg)` },
      ],
      { duration: 600, easing: 'ease-in-out', fill: 'forwards' },
    );

    portal.animate(
      [
        { transform: `translate(${cx}px, ${portalY}px) scale(0)`,    opacity: 0 },
        { transform: `translate(${cx}px, ${portalY}px) scale(1.08)`, opacity: 1, offset: 0.7 },
        { transform: `translate(${cx}px, ${portalY}px) scale(1)`,    opacity: 1 },
      ],
      { duration: 600, easing: 'cubic-bezier(0.34, 1.45, 0.64, 1)', fill: 'forwards' },
    );
    await this.sleep(600);

    // -------- 3. Ghost plummets into portal (1900 → 2850 ms) --------
    ghost.animate(
      [
        { transform: `translate(${cx}px, ${cy - 35}px) scale(1.5) rotate(0deg)`,    opacity: 1 },
        { transform: `translate(${cx}px, ${cy + 30}px) scale(1.15) rotate(160deg)`, opacity: 1, offset: 0.35 },
        { transform: `translate(${cx}px, ${cy + 90}px) scale(0.7) rotate(420deg)`,  opacity: 0.9, offset: 0.7 },
        { transform: `translate(${cx}px, ${portalY - 6}px) scale(0.04) rotate(880deg)`, opacity: 0 },
      ],
      { duration: 950, easing: 'cubic-bezier(0.45, 0.05, 0.85, 0.4)', fill: 'forwards' },
    );
    await this.sleep(950);

    // -------- 4. Portal collapses + flash + scroll (2850 → 3450 ms) --------
    portal.animate(
      [
        { transform: `translate(${cx}px, ${portalY}px) scale(1)`,    opacity: 1 },
        { transform: `translate(${cx}px, ${portalY}px) scale(1.3)`,  opacity: 0.4, offset: 0.4 },
        { transform: `translate(${cx}px, ${portalY}px) scale(0)`,    opacity: 0 },
      ],
      { duration: 600, easing: 'cubic-bezier(0.55, 0.1, 0.85, 0.4)', fill: 'forwards' },
    );

    flash.animate(
      [
        { opacity: 0,    transform: 'translate(-50%, -50%) scale(0)' },
        { opacity: 0.95, transform: 'translate(-50%, -50%) scale(0.6)', offset: 0.32 },
        { opacity: 0,    transform: 'translate(-50%, -50%) scale(1.5)' },
      ],
      { duration: 850, fill: 'forwards', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    );

    await this.sleep(280);

    // Scroll under cover of the flash so the page jump is invisible.
    this.scrollToTarget(req);

    await this.sleep(620);

    // -------- 5. Backdrop fades out (3450 → 4400 ms) --------
    backdrop.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 950, fill: 'forwards', easing: 'ease-in' },
    );
    await this.sleep(950);

    this.active.set(false);
    this.teleport.clear();
    this.busy = false;
  }

  private scrollToTarget(req: TeleportRequest): void {
    const projects = document.getElementById('projects');
    if (!projects) return;

    const cards = projects.querySelectorAll('app-project-card');
    // The teleport request's projectIndex is the position in PROJECTS, which
    // matches the rendered card order one-to-one.
    const target = cards[req.projectIndex] as HTMLElement | undefined;
    if (!target) return;

    target.scrollIntoView({ behavior: 'auto', block: 'start' });
    // Re-trigger the impact glow even if it's already on (e.g. successive rolls).
    target.classList.remove('fate-glow');
    // Force reflow so the animation restarts.
    void target.offsetWidth;
    target.classList.add('fate-glow');
    window.setTimeout(() => target.classList.remove('fate-glow'), 2600);
  }

  private frame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }
}
