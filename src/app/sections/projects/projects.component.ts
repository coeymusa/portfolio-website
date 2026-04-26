import { Component, computed, signal } from '@angular/core';
import {
  CATEGORY_LABELS,
  PROJECTS,
  ProjectCategory,
} from '../../core/models/project.model';
import { ProjectCardComponent } from './project-card/project-card.component';

type FilterValue = ProjectCategory | 'all';

interface FilterChip {
  value: FilterValue;
  label: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCardComponent],
  template: `
    <section id="projects" class="section archive">
      <div class="container">
        <!-- Section masthead -->
        <header class="masthead">
          <div class="masthead-rule">
            <span class="rule-tag">VOL. I — CHAPTER ONE</span>
          </div>
          <h2 class="archive-title">
            <em>The</em> Archive
          </h2>
          <p class="archive-subtitle">
            Seven entries. Each shipped, each studied.
            <span class="mono">[ {{ filteredCount() }} of {{ totalCount }} listed ]</span>
          </p>
        </header>

        <!-- Filter row -->
        <nav class="filter-row" aria-label="Filter projects">
          <span class="filter-label">FILTER BY DISCIPLINE</span>
          <div class="filter-chips">
            @for (chip of filterChips; track chip.value) {
              <button
                class="chip"
                [class.chip--active]="activeFilter() === chip.value"
                (click)="activeFilter.set(chip.value)"
              >
                {{ chip.label }}
              </button>
            }
          </div>
        </nav>

        <!-- Project entries -->
        <div class="entries">
          @for (project of filteredProjects(); track project.id; let i = $index) {
            <app-project-card
              [project]="project"
              [index]="i + 1"
              [reversed]="i % 2 === 1"
            />
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .archive {
      background: var(--ink);
      position: relative;
    }

    /* Masthead */
    .masthead {
      margin-bottom: 5rem;
      max-width: 780px;
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

    /* Filter row */
    .filter-row {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 5rem;
      padding: 1.25rem 0;
      border-top: 1px solid var(--rule);
      border-bottom: 1px solid var(--rule);
      flex-wrap: wrap;
    }

    .filter-label {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--text-faint);
      white-space: nowrap;
    }

    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .chip {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 0.5rem 1rem;
      background: transparent;
      color: var(--text-mute);
      border: 1px solid var(--rule);
      cursor: pointer;
      transition: all 0.25s ease;
      font-weight: 500;
    }

    .chip:hover {
      color: var(--ember);
      border-color: var(--ember-deep);
    }

    .chip--active {
      background: var(--ember);
      color: var(--ink);
      border-color: var(--ember);
    }

    /* Entries — generous but not overwhelming */
    .entries {
      display: flex;
      flex-direction: column;
      gap: 4.5rem;
    }

    .entries > app-project-card:not(:first-child) {
      padding-top: 4.5rem;
      border-top: 1px solid var(--rule);
    }

    @media (max-width: 1024px) {
      .entries {
        gap: 3.5rem;
      }
      .entries > app-project-card:not(:first-child) {
        padding-top: 3.5rem;
      }
    }

    @media (max-width: 640px) {
      .section {
        padding: 4rem 1rem;
      }
      .archive {
        padding: 4rem 0;
      }
      .masthead {
        margin-bottom: 2.5rem;
      }
      .archive-title {
        font-size: clamp(2.25rem, 12vw, 3rem);
      }
      .archive-subtitle {
        font-size: 1rem;
      }
      .archive-subtitle .mono {
        display: block;
        margin-left: 0;
        margin-top: 0.5rem;
      }
      .masthead-rule::before {
        flex: 0 0 30px;
      }
      .rule-tag {
        font-size: 0.6rem;
        letter-spacing: 0.2em;
      }
      .filter-row {
        margin-bottom: 2.5rem;
        gap: 1rem;
        padding: 1rem 0;
        flex-direction: column;
        align-items: flex-start;
      }
      .filter-label {
        font-size: 0.6rem;
      }
      .chip {
        font-size: 0.65rem;
        padding: 0.4rem 0.75rem;
        letter-spacing: 0.1em;
      }
      .entries {
        gap: 3rem;
      }
      .entries > app-project-card:not(:first-child) {
        padding-top: 3rem;
      }
    }
  `],
})
export class ProjectsComponent {
  readonly totalCount = PROJECTS.length;

  readonly filterChips: FilterChip[] = [
    { value: 'all', label: 'ALL' },
    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
      value: value as ProjectCategory,
      label: label.toUpperCase(),
    })),
  ];

  activeFilter = signal<FilterValue>('all');

  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === filter);
  });

  filteredCount = computed(() => this.filteredProjects().length);
}
