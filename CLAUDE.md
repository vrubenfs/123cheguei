# 123cheguei

Landing page and quote-request platform for 123cheguei, a residential moving company operating in Portugal and Europe.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (PostCSS plugin)
- **Animations**: Motion (Framer Motion successor)
- **Font**: Geist Sans (via `next/font/google`)
- **Email**: Brevo (Sendinblue) transactional API
- **i18n**: Custom context-based (PT/EN), no framework

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build (catches route/metadata errors)
npm run start     # Serve production build
npm run lint      # ESLint
npx tsc --noEmit  # Type-check
```

## Environment Variables

- `BREVO_API_KEY` -- Brevo transactional email API key
- `CONTACT_EMAIL` -- Company email (defaults to info@123cheguei.pt)

## Directory Structure

```
src/
  app/
    layout.tsx          # Root layout, metadata, JSON-LD schema, LanguageProvider
    page.tsx            # Single-page app: Hero > Services > Stats > HowItWorks > FAQ > Form
    globals.css         # Tailwind base styles
    api/contact/route.ts  # POST endpoint: validates, rate-limits, sends emails via Brevo
  components/
    Header.tsx          # Navbar with language switcher
    Hero.tsx            # Hero banner with CTA
    Services.tsx        # Service cards grid
    Stats.tsx           # Company statistics
    HowItWorks.tsx      # 3-step process section
    FAQ.tsx             # Accordion FAQ
    MoveRequestForm.tsx # Quote request form (name, phone, origin, dest, date, type, notes)
    Footer.tsx          # Footer with contact info
    ScrollTruck.tsx     # Decorative scroll-following truck animation
    WhatsAppButton.tsx  # Floating WhatsApp CTA
    TruckLogo.tsx       # SVG truck logo component
    motion/             # Reusable animation wrappers (FadeIn, HoverCard, ScrollEffects)
  i18n/
    LanguageContext.tsx  # React context for PT/EN language switching
    translations.ts     # All UI strings in PT and EN
  lib/
    submitQuote.ts       # Client-side fetch wrapper for /api/contact
public/
  images/               # Static images
  europe-map-opt.svg    # Coverage map
  favicon.svg           # Site favicon
```

## Architecture

- **Single-page landing**: One route (`/`) with section-based navigation via anchor links.
- **API route** at `/api/contact` handles quote form submissions with input validation, honeypot spam filtering, IP-based rate limiting (5 req/hour), CSRF origin checks, and sends two Brevo emails (company notification + client confirmation).
- **i18n** uses React context (`LanguageProvider`) wrapping the app; components consume translations via `useLanguage()` hook. No URL-based routing for languages.
- **Animations** use the `motion` library with reusable wrappers in `components/motion/` for fade-in, hover effects, and scroll-driven animations.

## Conventions

- Path alias: `@/*` maps to `./src/*`
- All component files are PascalCase `.tsx`
- Security headers configured in `next.config.ts` (HSTS, X-Frame-Options, etc.)
- Brand colors: navy `#1E3A5F` (primary), green `#5A9E2F` (accent)
- Default language is Portuguese (`lang="pt"` on `<html>`)
- No testing framework is configured
