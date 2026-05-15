# coreyscodecave.com

Source for **[coreyscodecave.com](https://www.coreyscodecave.com/)** — the personal site of **Corey Musa**, senior full-stack engineer (Zürich · fintech · AI).

> **Open to work** — Senior, Staff or Principal full-stack roles · Zürich on-site / hybrid or fully remote across EU time zones · permanent or contract.
> Fastest route in: **[coreymusa@outlook.com](mailto:coreymusa@outlook.com)**.
> See also: **[github.com/coeymusa](https://github.com/coeymusa)** · **[linkedin.com/in/corey-musa](https://www.linkedin.com/in/corey-musa/)**.

---

## About the site

A curated archive of shipped work — AI-driven SaaS platforms, regulated fintech systems, machine-learning pipelines, developer tooling, and consultancy services. Most built solo. All in production.

**Featured case studies on the live site:**

- **MCU** *(private — regulated product)* — Loan-management platform for a regulated credit union. Three services (Angular 19 + Spring Boot 3 + Spring Authorization Server), 280+ endpoints, OAuth2/OIDC, four-eyes and director sign-off enforced in the schema. Electron desktop client, code-signed. Details on request.
- **One Week** — A constraint-based build challenge.
- **Lonsdale** — Brand / product case study.
- **CV** — Long-form CV at [/cv](https://www.coreyscodecave.com/cv).

## Stack

Angular 19 (standalone components, lazy-loaded routes), TypeScript 5.7, SCSS, OnPush change detection. No UI framework dependency by design — every section is hand-built.

## Local development

```bash
npm install
npm start         # ng serve → http://localhost:4200
npm run build     # production build → dist/corey-portfolio/
```

## Repository layout

```
src/app/
├── pages/
│   ├── home/            # Landing — hero, projects, about, contact
│   ├── cv/              # Long-form CV
│   ├── mcu/             # MCU case study
│   ├── one-week/        # One Week case study
│   └── lonsdale/        # Lonsdale case study
├── sections/
│   ├── hero/            # Code Cave masthead + interactive dice / oracle
│   ├── projects/        # Shipped-work archive cards
│   ├── about/
│   ├── contact/
│   ├── footer/
│   └── nav/
└── core/                # Shared utilities
```

---

*Hiring? Read the [profile README](https://github.com/coeymusa) for the full pitch.*
