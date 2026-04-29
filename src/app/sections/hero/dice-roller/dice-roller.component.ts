import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { PROJECTS, Project } from '../../../core/models/project.model';

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
        class="dice-button"
        (click)="roll()"
        [disabled]="rolling()"
        [attr.aria-label]="rolling() ? 'Rolling…' : 'Roll the d8 to pick a random project'"
      >
        <span
          class="dice"
          [class.rolling]="rolling()"
          [style.--rx]="rotX() + 'deg'"
          [style.--ry]="rotY() + 'deg'"
          [style.--rz]="rotZ() + 'deg'"
        >
          <span class="face f1">I</span>
          <span class="face f2">II</span>
          <span class="face f3">III</span>
          <span class="face f4">IV</span>
          <span class="face f5">V</span>
          <span class="face f6">VI</span>
          <span class="face f7">VII</span>
          <span class="face f8">VIII</span>
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
      transition: transform 1.6s cubic-bezier(0.32, 1.18, 0.42, 0.96);
    }
    .dice.rolling {
      transition: transform 1.65s cubic-bezier(0.34, 1.06, 0.46, 1);
    }

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
  readonly projects: Project[] = PROJECTS;

  readonly rolling = signal(false);
  readonly result = signal<Project | null>(null);

  readonly rotX = signal(-22);
  readonly rotY = signal(32);
  readonly rotZ = signal(0);

  resultIndex = computed(() => {
    const r = this.result();
    if (!r) return 0;
    return PROJECTS.findIndex((p) => p.id === r.id) + 1;
  });

  roll(): void {
    if (this.rolling()) return;
    this.rolling.set(true);
    this.result.set(null);

    const picked = this.projects[Math.floor(Math.random() * this.projects.length)];

    const baseX = this.rotX();
    const baseY = this.rotY();
    const baseZ = this.rotZ();
    const turnsX = (Math.floor(Math.random() * 2) + 3) * 360;
    const turnsY = (Math.floor(Math.random() * 2) + 3) * 360;
    const turnsZ = (Math.floor(Math.random() * 2) + 2) * 360;
    const wiggleX = -22 + (Math.random() * 44 - 22);
    const wiggleY = 32 + (Math.random() * 60 - 30);
    const wiggleZ = Math.random() * 30 - 15;

    this.rotX.set(baseX + turnsX + wiggleX);
    this.rotY.set(baseY + turnsY + wiggleY);
    this.rotZ.set(baseZ + turnsZ + wiggleZ);

    window.setTimeout(() => {
      this.result.set(picked);
      this.rolling.set(false);
    }, 1700);
  }

  jumpToResult(): void {
    const picked = this.result();
    if (!picked) return;
    const projects = document.getElementById('projects');
    if (!projects) return;
    projects.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window.setTimeout(() => {
      const all = projects.querySelectorAll('app-project-card');
      const idx = PROJECTS.findIndex((p) => p.id === picked.id);
      const target = all[idx] as HTMLElement | undefined;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('fate-glow');
        window.setTimeout(() => target.classList.remove('fate-glow'), 2400);
      }
    }, 600);
  }
}
