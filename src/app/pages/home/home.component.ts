import { Component } from '@angular/core';
import { HeroComponent } from '../../sections/hero/hero.component';
import { CardOracleComponent } from '../../sections/card-oracle/card-oracle.component';
import { ProjectsComponent } from '../../sections/projects/projects.component';
import { AboutComponent } from '../../sections/about/about.component';
import { ContactComponent } from '../../sections/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CardOracleComponent,
    ProjectsComponent,
    AboutComponent,
    ContactComponent,
  ],
  template: `
    <app-hero />
    <app-card-oracle />
    <app-projects />
    <app-about />
    <app-contact />
  `,
})
export class HomeComponent {}
