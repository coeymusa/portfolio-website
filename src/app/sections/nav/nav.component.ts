import {
  Component,
  signal,
  inject,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
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
          <span class="logo-icon">C</span>
          <span class="logo-text">Corey</span>
        </a>

        <div class="nav-links-desktop">
          @for (link of navLinks; track link.id) {
            <a
              class="nav-link"
              [class.active]="activeSection() === link.id"
              (click)="scrollTo(link.id)"
            >
              {{ link.label }}
            </a>
          }
          <a class="nav-link" routerLink="/cv">CV</a>
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
            @for (link of navLinks; track link.id) {
              <a
                class="mobile-link"
                [class.active]="activeSection() === link.id"
                (click)="scrollTo(link.id); menuOpen.set(false)"
              >
                {{ link.label }}
              </a>
            }
            <a class="mobile-link" routerLink="/cv" (click)="menuOpen.set(false)">CV</a>
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
      background: rgba(245, 245, 240, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      height: 64px;
    }

    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-decoration: none;
      user-select: none;
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #111827;
      color: #ffffff;
      font-weight: 700;
      font-size: 18px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      letter-spacing: -0.02em;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .nav-links-desktop {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .nav-link {
      position: relative;
      color: #6b7280;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      padding: 4px 0;
      transition: color 0.25s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .nav-link:hover {
      color: #111827;
    }

    .nav-link:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 4px;
      border-radius: 2px;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      border-radius: 1px;
      background: #111827;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.25s ease;
    }

    .nav-link.active {
      color: #111827;
    }

    .nav-link.active::after {
      transform: scaleX(1);
    }

    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      margin-right: -8px;
    }

    .hamburger:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .hamburger-line {
      display: block;
      width: 22px;
      height: 2px;
      background: #111827;
      border-radius: 1px;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .hamburger-line.open:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .hamburger-line.open:nth-child(2) {
      opacity: 0;
    }

    .hamburger-line.open:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    .mobile-overlay {
      position: fixed;
      inset: 64px 0 0 0;
      background: rgba(245, 245, 240, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      animation: fadeIn 0.2s ease;
    }

    .mobile-menu {
      display: flex;
      flex-direction: column;
      padding: 24px;
      gap: 8px;
    }

    .mobile-link {
      color: #6b7280;
      text-decoration: none;
      font-size: 18px;
      font-weight: 500;
      padding: 14px 16px;
      border-radius: 10px;
      cursor: pointer;
      transition: color 0.2s ease, background 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .mobile-link:hover {
      color: #111827;
      background: rgba(0, 0, 0, 0.04);
    }

    .mobile-link:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: -2px;
      border-radius: 10px;
    }

    .mobile-link.active {
      color: #111827;
      background: rgba(0, 0, 0, 0.04);
      border-left: 3px solid #111827;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @media (max-width: 767px) {
      .nav-links-desktop {
        display: none;
      }

      .hamburger {
        display: flex;
      }
    }
  `,
})
export class NavComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  readonly activeSection = signal<string>('hero');
  readonly menuOpen = signal(false);

  readonly navLinks = [
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  private observer: IntersectionObserver | null = null;

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
