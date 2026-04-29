import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { PROJECTS, Project } from '../../../core/models/project.model';
import { TeleportService } from '../../../core/services/teleport.service';

@Component({
  selector: 'app-dice-roller',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dice-stage" [class.has-result]="!!result()">
      <p class="oracle-prompt">
        <span class="oracle-label">ORACLE</span>
        <span class="oracle-sub">cast a fate · d8</span>
      </p>

      <button
        #diceButton
        class="dice-button"
        [class.teleporting]="teleporting()"
        (click)="roll()"
        [disabled]="rolling() || teleporting()"
        [attr.aria-label]="rolling() ? 'Rolling…' : 'Roll the d8 to pick a random project'"
      >
        <span
          #diceEl
          class="dice"
          [class.rolling]="rolling()"
          [style.--rx]="rotX() + 'deg'"
          [style.--ry]="rotY() + 'deg'"
          [style.--rz]="rotZ() + 'deg'"
        >
          <span class="face f1" [class.landed]="landedFace() === 1">I</span>
          <span class="face f2" [class.landed]="landedFace() === 2">II</span>
          <span class="face f3" [class.landed]="landedFace() === 3">III</span>
          <span class="face f4" [class.landed]="landedFace() === 4">IV</span>
          <span class="face f5" [class.landed]="landedFace() === 5">V</span>
          <span class="face f6" [class.landed]="landedFace() === 6">VI</span>
          <span class="face f7" [class.landed]="landedFace() === 7">VII</span>
          <span class="face f8" [class.landed]="landedFace() === 8">VIII</span>
        </span>

        <span class="dice-shadow" [class.rolling]="rolling()"></span>
      </button>

      <div class="result-strip" [class.visible]="!!result()">
        @if (result()) {
          <div class="result-line">
            <span class="result-arrow">→</span>
            <span class="result-text">
              fate has chosen <em>{{ result()?.title }}</em>
            </span>
          </div>
          <button class="result-jump" (click)="jumpToResult()">
            visit entry №{{ resultIndex() }}
          </button>
        } @else {
          <div class="result-empty">click the die · {{ projects.length }} possibilities</div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .dice-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding-top: 1rem;
    }

    .oracle-prompt {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--rule);
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

    .dice-button {
      position: relative;
      width: 130px;
      height: 130px;
      background: transparent;
      border: none;
      cursor: pointer;
      perspective: 600px;
      perspective-origin: center 30%;
      padding: 0;
      transition: transform 0.3s;
      margin-top: 0.5rem;
    }
    .dice-button:disabled { cursor: progress; }
    .dice-button:hover:not(:disabled) .dice {
      animation: idle-tilt 1.4s ease-in-out infinite;
    }
    .dice-button.teleporting {
      opacity: 0;
      transform: scale(0.7);
      transition: opacity 0.9s ease-out, transform 0.9s ease-out;
      pointer-events: none;
    }
    .dice-button:focus-visible { outline: none; }
    .dice-button:focus-visible .dice {
      filter: drop-shadow(0 0 8px var(--ember));
    }

    /* === The 3D octahedron === */
    .dice {
      --edge: 84;                              /* unitless edge length, px-equivalent */
      --tx: calc(var(--edge) * 0.2357);        /* edge × √2/6 = centroid distance */
      --rx: -22deg;
      --ry: 32deg;
      --rz: 0deg;

      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      transform-style: preserve-3d;
      transform:
        rotateX(var(--rx))
        rotateY(var(--ry))
        rotateZ(var(--rz));
      will-change: transform; /* keep on a GPU layer for smoother rolls on mobile */
    }
    .dice-button { touch-action: manipulation; }
    /* The roll itself is driven by the Web Animations API (see roll() in
       the component) — CSS transitions on transforms with var()-based
       angles aren't reliable on mobile when the rotation spans multiple
       full turns (the engine matrix-decomposes to the shortest path,
       killing the spin). */

    /* === Triangular face === */
    .face {
      position: absolute;
      box-sizing: border-box;
      width: calc(var(--edge) * 1px);
      height: calc(var(--edge) * 0.866 * 1px);     /* √3/2 */
      /* place triangle's centroid (50%, 66.67%) at (0, 0) of dice */
      top: calc(var(--edge) * -0.5773 * 1px);      /* −2H/3 */
      left: calc(var(--edge) * -0.5 * 1px);
      transform-origin: 50% 66.67%;

      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: calc(var(--edge) * 0.289 * 1px); /* push numeral toward centroid */

      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: 1.4rem;
      font-style: italic;
      font-weight: 300;
      letter-spacing: -0.05em;
      color: var(--paper);

      background: linear-gradient(160deg, var(--ink-warm) 0%, var(--ink) 75%);
      border: 1.5px solid var(--ember);
      box-shadow:
        inset 0 0 0 1px rgba(255, 107, 53, 0.15),
        inset 6px 6px 18px rgba(0, 0, 0, 0.55),
        inset -2px -2px 6px rgba(255, 107, 53, 0.08);

      /* equilateral triangle, slightly wonky for the hand-drawn feel */
      clip-path: polygon(50% 1%, 99% 99%, 1% 99%);
      backface-visibility: hidden;

      transition:
        background 0.55s ease,
        border-color 0.55s ease,
        box-shadow 0.55s ease,
        color 0.55s ease;
    }

    /* The face the dice has settled on — glows in ember */
    .face.landed {
      background: linear-gradient(160deg, var(--ember) 0%, #b54620 78%);
      color: var(--ink);
      border-color: var(--paper);
      box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.35),
        inset 4px 4px 14px rgba(0, 0, 0, 0.25),
        inset -2px -2px 6px rgba(255, 255, 255, 0.12),
        0 0 22px rgba(255, 107, 53, 0.55);
      animation: face-glow 2.4s ease-in-out infinite;
    }
    @keyframes face-glow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 107, 53, 0.45)); }
      50%      { filter: drop-shadow(0 0 16px rgba(255, 107, 53, 0.85)); }
    }

    /* === 8 face transforms — regular octahedron, derived by hand === */
    /* Top 4 (apex at +Y), azimuths 45°, 135°, 225°, 315° */
    .f1 { transform: matrix3d(-0.7071, 0, 0.7071, 0,  0.4082, 0.8165, 0.4082, 0,  0.5774, -0.5774, 0.5774, 0,  var(--tx), calc(var(--tx) * -1), var(--tx), 1); }
    .f2 { transform: matrix3d(-0.7071, 0,-0.7071, 0, -0.4082, 0.8165, 0.4082, 0, -0.5774, -0.5774, 0.5774, 0,  calc(var(--tx) * -1), calc(var(--tx) * -1), var(--tx), 1); }
    .f3 { transform: matrix3d( 0.7071, 0,-0.7071, 0, -0.4082, 0.8165,-0.4082, 0, -0.5774, -0.5774,-0.5774, 0,  calc(var(--tx) * -1), calc(var(--tx) * -1), calc(var(--tx) * -1), 1); }
    .f4 { transform: matrix3d( 0.7071, 0, 0.7071, 0,  0.4082, 0.8165,-0.4082, 0,  0.5774, -0.5774,-0.5774, 0,  var(--tx), calc(var(--tx) * -1), calc(var(--tx) * -1), 1); }
    /* Bottom 4 (apex at −Y), azimuths 45°, 135°, 225°, 315° */
    .f5 { transform: matrix3d( 0.7071, 0,-0.7071, 0,  0.4082,-0.8165, 0.4082, 0,  0.5774,  0.5774, 0.5774, 0,  var(--tx), var(--tx), var(--tx), 1); }
    .f6 { transform: matrix3d( 0.7071, 0, 0.7071, 0, -0.4082,-0.8165, 0.4082, 0, -0.5774,  0.5774, 0.5774, 0,  calc(var(--tx) * -1), var(--tx), var(--tx), 1); }
    .f7 { transform: matrix3d(-0.7071, 0, 0.7071, 0, -0.4082,-0.8165,-0.4082, 0, -0.5774,  0.5774,-0.5774, 0,  calc(var(--tx) * -1), var(--tx), calc(var(--tx) * -1), 1); }
    .f8 { transform: matrix3d(-0.7071, 0,-0.7071, 0,  0.4082,-0.8165,-0.4082, 0,  0.5774,  0.5774,-0.5774, 0,  var(--tx), var(--tx), calc(var(--tx) * -1), 1); }

    /* === Shadow under die === */
    .dice-shadow {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 12px;
      background: radial-gradient(ellipse at center, rgba(255, 107, 53, 0.25) 0%, transparent 65%);
      filter: blur(3px);
      transition: opacity 0.3s, transform 0.3s;
      z-index: -1;
    }
    .dice-shadow.rolling { animation: shadow-pulse 1.65s ease-in-out; }

    /* === Result strip === */
    .result-strip {
      width: 100%;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--rule);
      text-align: center;
      word-break: break-word;
      max-width: 100%;
      overflow: hidden;
    }
    .result-text {
      font-family: var(--font-display);
      font-size: 0.85rem;
      color: var(--text);
      max-width: 100%;
      overflow-wrap: break-word;
    }
    .result-text em { font-style: italic; color: var(--ember); }
    .result-empty {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-faint);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .result-line {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
      animation: fade-in 0.5s ease;
    }
    .result-arrow { color: var(--ember); font-size: 1rem; }
    .result-jump {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      background: transparent;
      color: var(--ember);
      border: 1px solid var(--ember);
      padding: 0.4rem 0.85rem;
      cursor: pointer;
      transition: all 0.3s;
      animation: fade-in 0.5s ease 0.1s both;
    }
    .result-jump:hover { background: var(--ember); color: var(--ink); }

    /* === Animations === */
    @keyframes idle-tilt {
      0%, 100% { transform: rotateX(var(--rx)) rotateY(var(--ry)) rotateZ(var(--rz)); }
      50% {
        transform:
          rotateX(calc(var(--rx) - 4deg))
          rotateY(calc(var(--ry) + 6deg))
          rotateZ(calc(var(--rz) + 1deg));
      }
    }
    @keyframes shadow-pulse {
      0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
      30%      { opacity: 0.5; transform: translateX(-50%) scale(0.7); }
      60%      { opacity: 0.9; transform: translateX(-50%) scale(1.1); }
    }
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .dice { transition: none !important; }
      .dice-button:hover .dice { animation: none !important; }
      .dice-shadow.rolling { animation: none !important; }
    }

    /* Tablet — inline row */
    @media (max-width: 1024px) and (min-width: 641px) {
      .dice-stage { flex-direction: row; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
      .oracle-prompt { flex-direction: row; gap: 0.5rem; border: none; padding: 0; width: auto; }
      .dice-button { width: 110px; height: 110px; }
      .dice { --edge: 70; }
      .face { font-size: 1.2rem; }
      .result-strip { flex: 1; min-width: 200px; border: none; padding: 0; align-items: flex-start; text-align: left; }
    }

    /* Mobile — stacked, compact */
    @media (max-width: 640px) {
      .dice-stage { gap: 0.75rem; padding-top: 0.5rem; align-items: center; }
      .oracle-prompt { flex-direction: row; align-items: baseline; gap: 0.6rem; border: none; padding: 0; width: auto; }
      .dice-button { width: 100px; height: 100px; margin-top: 0.25rem; }
      .dice { --edge: 60; }
      .face { font-size: 1rem; }
      .result-strip { border: none; padding-top: 0.5rem; min-height: 40px; }
      .result-text { font-size: 0.85rem; }
    }
  `],
})
export class DiceRollerComponent {
  private readonly teleport = inject(TeleportService);

  readonly projects: Project[] = PROJECTS;
  private readonly numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  readonly rolling = signal(false);
  readonly result = signal<Project | null>(null);
  /** Face numeral the dice settled on (1–8); 0 when no roll yet / mid-roll. */
  readonly landedFace = signal(0);
  /** True from the moment we hand off to the teleport overlay until it ends. */
  readonly teleporting = signal(false);

  readonly rotX = signal(-22);
  readonly rotY = signal(32);
  readonly rotZ = signal(0);

  private readonly diceButtonRef = viewChild<ElementRef<HTMLButtonElement>>('diceButton');
  private readonly diceElRef = viewChild<ElementRef<HTMLElement>>('diceEl');

  /** Pending auto-summon timer; cleared if the user re-rolls or summons manually. */
  private autoSummonTimer: number | null = null;

  /** Dramatic pause between dice settling and the teleport firing. */
  private static readonly AUTO_SUMMON_PAUSE_MS = 1200;
  /** Total runtime of the teleport cinematic (in TeleportOverlayComponent). */
  private static readonly TELEPORT_DURATION_MS = 4700;

  /**
   * Per-face settling Euler angles (degrees). Applying
   *   rotateX(0) rotateY(ry) rotateZ(rz)
   * to the dice brings face k's outward normal to +Z (toward camera),
   * so face k ends up squarely facing the viewer.
   *
   * Derivation: for a face with CSS normal N = (Nx, Ny, Nz)/√3,
   *   • α (rz) is chosen so rotateZ(α) zeroes the y component AND
   *     leaves a positive x component.
   *   • β (ry) is then chosen so rotateY(β) maps (X′, 0, Nz/√3)
   *     onto (0, 0, 1). For Nz = +1 this is β = −54.74°
   *     (= −arctan √2); for Nz = −1 it is β = −125.26°.
   *
   * (Applied as: transform: rotateY(β) rotateZ(α), which CSS evaluates
   *  right-to-left — rotateZ first, then rotateY.)
   */
  private readonly settles = [
    { ry:  -54.74, rz:   45 }, // F1  top, +X +Z
    { ry:  -54.74, rz:  135 }, // F2  top, −X +Z
    { ry: -125.26, rz:  135 }, // F3  top, −X −Z
    { ry: -125.26, rz:   45 }, // F4  top, +X −Z
    { ry:  -54.74, rz:  -45 }, // F5  bot, +X +Z
    { ry:  -54.74, rz: -135 }, // F6  bot, −X +Z
    { ry: -125.26, rz: -135 }, // F7  bot, −X −Z
    { ry: -125.26, rz:  -45 }, // F8  bot, +X −Z
  ];

  resultIndex = computed(() => {
    const r = this.result();
    if (!r) return 0;
    return PROJECTS.findIndex((p) => p.id === r.id) + 1;
  });

  roll(): void {
    if (this.rolling() || this.teleporting()) return;
    // Cancel any pending auto-summon from a previous roll.
    this.cancelAutoSummon();
    this.rolling.set(true);
    this.result.set(null);
    this.landedFace.set(0);

    const facePicked = Math.floor(Math.random() * this.projects.length);
    const picked = this.projects[facePicked];
    const target = this.settles[facePicked];

    const baseX = this.rotX();
    const baseY = this.rotY();
    const baseZ = this.rotZ();
    const minTurns = 3 + Math.floor(Math.random() * 2); // 3 or 4 full revolutions

    const finalX = this.nextEquivalent(baseX,  0,         minTurns);
    const finalY = this.nextEquivalent(baseY,  target.ry, minTurns);
    const finalZ = this.nextEquivalent(baseZ,  target.rz, minTurns);

    // Drive the roll with the Web Animations API. CSS transitions on
    // transforms whose angles come from CSS variables aren't reliable on
    // mobile when the rotation spans multiple full revolutions — many
    // engines decompose to a shortest-path matrix and the spin disappears.
    // WAA receives explicit transform strings per keyframe so the engine
    // interpolates the rotation values directly.
    const diceEl = this.diceElRef()?.nativeElement;
    if (diceEl && !this.prefersReducedMotion()) {
      diceEl.getAnimations().forEach((a) => a.cancel());
      diceEl.animate(
        [
          { transform: `rotateX(${baseX}deg) rotateY(${baseY}deg) rotateZ(${baseZ}deg)` },
          { transform: `rotateX(${finalX}deg) rotateY(${finalY}deg) rotateZ(${finalZ}deg)` },
        ],
        {
          duration: 1700,
          easing: 'cubic-bezier(0.34, 1.06, 0.46, 1)',
          fill: 'forwards',
        },
      );
    }

    // Update signals so the CSS-var-based transform on .dice matches
    // the final orientation. While the WAA animation is filling forwards,
    // its effect overrides this; once the animation is cancelled below
    // the CSS value takes over without any visible jump.
    this.rotX.set(finalX);
    this.rotY.set(finalY);
    this.rotZ.set(finalZ);

    window.setTimeout(() => {
      // Release the WAA effect so future updates (the teleport's source-rect
      // measurement, idle-tilt on hover) interact with the regular CSS rule.
      diceEl?.getAnimations().forEach((a) => a.cancel());

      this.result.set(picked);
      this.landedFace.set(facePicked + 1);
      this.rolling.set(false);

      // Dramatic pause to register the result, then the oracle teleports
      // them to the chosen entry. The user can short-circuit by clicking
      // "visit entry" — both call jumpToResult() which is guarded.
      this.autoSummonTimer = window.setTimeout(() => {
        this.autoSummonTimer = null;
        this.jumpToResult();
      }, DiceRollerComponent.AUTO_SUMMON_PAUSE_MS);
    }, 1700);
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  private cancelAutoSummon(): void {
    if (this.autoSummonTimer !== null) {
      window.clearTimeout(this.autoSummonTimer);
      this.autoSummonTimer = null;
    }
  }

  /**
   * Smallest angle ≥ currentDeg + minTurns·360 that is ≡ targetMod360 (mod 360).
   * Lets us animate at least N full turns and finish on a precise target.
   */
  private nextEquivalent(currentDeg: number, targetMod360: number, minTurns: number): number {
    const minFinal = currentDeg + minTurns * 360;
    const k = Math.ceil((minFinal - targetMod360) / 360);
    return targetMod360 + k * 360;
  }

  jumpToResult(): void {
    if (this.teleporting()) return;

    const picked = this.result();
    const face = this.landedFace();
    if (!picked || face === 0) return;

    const button = this.diceButtonRef()?.nativeElement;
    if (!button) return;

    const idx = PROJECTS.findIndex((p) => p.id === picked.id);
    if (idx < 0) return;

    this.cancelAutoSummon();
    this.teleporting.set(true);

    this.teleport.summon({
      project: picked,
      projectIndex: idx,
      faceNumeral: this.numerals[face - 1] ?? String(face),
      sourceRect: button.getBoundingClientRect(),
      accent: picked.accent,
      ghostKind: 'face',
    });

    // Reset our local state once the cinematic finishes plus a small buffer,
    // so the next visit to the hero finds a fresh oracle.
    window.setTimeout(() => {
      this.teleporting.set(false);
      this.result.set(null);
      this.landedFace.set(0);
    }, DiceRollerComponent.TELEPORT_DURATION_MS + 600);
  }
}
