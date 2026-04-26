import {
  Component,
  signal,
  inject,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="nav">
      <div class="nav-inner">
        <a class="logo" routerLink="/" (click)="scrollToTop()">
          <span class="logo-mark">CC</span>
          <span class="logo-text">
            <em>Corey's</em><br/>
            Code Cave
          </span>
        </a>

        <div class="nav-links-desktop">
          @for (link of navLinks; track link.id; let i = $index) {
            <a
              class="nav-link"
              [class.active]="activeSection() === link.id"
              (click)="scrollTo(link.id)"
            >
              <span class="link-num">{{ pad(i + 1) }}</span>
              <span class="link-text">{{ link.label }}</span>
            </a>
          }
          <a class="nav-link nav-link--cv" routerLink="/cv">
            <span class="link-num">04</span>
            <span class="link-text">CV</span>
          </a>
        </div>

        <button
          class="hamburger"
          (click)="menuOpen.set(!menuOpen())"
          [attr.aria-expanded]="menuOpen()"
          aria-label="Toggle navigation menu"
        >
          <span class="hamburger-line" [class.open]="menuOpen()"></span>
          <span class="hamburger-line" [class.open]="menuOpen()"></span>
          <span class="hamburger-line" [class.open]="menuOpen()"></span>
        </button>
      </div>

      @if (menuOpen()) {
        <div class="mobile-overlay" (click)="menuOpen.set(false)">
          <div class="mobile-menu" (click)="$event.stopPropagation()">
            @for (link of navLinks; track link.id; let i = $index) {
              <a
                class="mobile-link"
                [class.active]="activeSection() === link.id"
                (click)="scrollTo(link.id); menuOpen.set(false)"
              >
                <span class="link-num">{{ pad(i + 1) }}</span>
                {{ link.label }}
              </a>
            }
            <a class="mobile-link" routerLink="/cv" (click)="menuOpen.set(false)">
              <span class="link-num">04</span>
              CV
            </a>
          </div>
        </div>
      }
    </nav>
  `,
  styles: `
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }

    .nav {
      background: rgba(10, 9, 7, 0.85);
      backdrop-filter: blur(16px) saturate(140%);
      -webkit-backdrop-filter: blur(16px) saturate(140%);
      border-bottom: 1px solid var(--rule);
    }

    .nav-inner {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 3rem;
      height: 88px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      cursor: pointer;
      user-select: none;
      transition: opacity 0.25s;
    }

    .logo:hover {
      opacity: 0.85;
    }

    .logo-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: var(--ember);
      color: var(--ink);
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      font-family: var(--font-mono);
    }

    .logo-text {
      font-family: var(--font-display);
      font-size: 0.9rem;
      line-height: 1.1;
      color: var(--paper);
      font-weight: 400;
      letter-spacing: -0.005em;
    }

    .logo-text em {
      font-style: italic;
      color: var(--text-mute);
      font-size: 0.85em;
      font-weight: 200;
    }

    .nav-links-desktop {
      display: flex;
      align-items: center;
      gap: 2.5rem;
    }

    .nav-link {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: baseline;
      gap: 0.45rem;
      transition: color 0.3s;
    }

    .link-num {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--brass-mute);
      letter-spacing: 0.15em;
    }

    .link-text {
      font-family: var(--font-display);
      font-size: 0.95rem;
      color: var(--text);
      font-style: italic;
      transition: color 0.3s;
    }

    .nav-link:hover .link-text {
      color: var(--ember);
    }

    .nav-link.active .link-text {
      color: var(--ember);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--ember);
    }

    .nav-link:focus-visible {
      outline: 2px solid var(--ember);
      outline-offset: 6px;
    }

    /* Hamburger */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      background: none;
      border: 1px solid var(--rule);
      cursor: pointer;
      padding: 10px;
      width: 44px;
      height: 44px;
      align-items: center;
    }

    .hamburger:focus-visible {
      outline: 2px solid var(--ember);
      outline-offset: 2px;
    }

    .hamburger-line {
      display: block;
      width: 20px;
      height: 1px;
      background: var(--paper);
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .hamburger-line.open:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }
    .hamburger-line.open:nth-child(2) {
      opacity: 0;
    }
    .hamburger-line.open:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }

    /* Mobile menu */
    .mobile-overlay {
      position: fixed;
      inset: 88px 0 0 0;
      background: var(--ink);
      animation: fadeIn 0.25s ease;
      z-index: 99;
      overflow-y: auto;
    }

    .mobile-overlay::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at top left, rgba(255, 107, 53, 0.04) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(201, 169, 97, 0.03) 0%, transparent 50%);
      pointer-events: none;
    }

    .mobile-menu {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      padding: 2rem;
      gap: 0.5rem;
      border-top: 1px solid var(--rule);
      background: var(--ink);
    }

    .mobile-link {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      color: var(--text);
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.5rem;
      padding: 1rem 0;
      cursor: pointer;
      transition: color 0.25s;
      border-bottom: 1px solid var(--rule);
    }

    .mobile-link .link-num {
      font-size: 0.75rem;
      font-style: normal;
      color: var(--brass-mute);
    }

    .mobile-link:hover,
    .mobile-link.active {
      color: var(--ember);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 768px) {
      .nav-inner {
        padding: 0 1.5rem;
        height: 72px;
      }
      .nav-links-desktop {
        display: none;
      }
      .hamburger {
        display: flex;
      }
      .mobile-overlay {
        inset: 72px 0 0 0;
        background: var(--ink);
      }
    }
  `,
})
export class NavComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  readonly activeSection = signal<string>('hero');
  readonly menuOpen = signal(false);

  readonly navLinks = [
    { id: 'projects', label: 'Archive' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  private observer: IntersectionObserver | null = null;

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollTo(id: string): void {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sectionIds = ['hero', 'projects', 'about', 'contact'];

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { threshold: 0.3 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        this.observer.observe(el);
      }
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
