# ScaleupMap platform reference

**Live site:** [https://scaleupmap.com](https://scaleupmap.com)

---

## Product

| | |
|---|---|
| **Name** | ScaleupMap (older copy sometimes uses ScaleUpMap) |
| **Tagline** | The venture intelligence platform for the startup ecosystem |
| **Score brand** | ScaleupMap Score™ (venture / investability snapshot) |

---

## Audiences

### Homepage tabs

| URL hash | Label | Subline |
|----------|--------|---------|
| (none) | For Founders | A complete founder operating system |
| `#venture-diligence` | For Venture Diligence | 10x your due diligence and intake |
| `#innovation-programs` | For Innovation Programs | 24/7 support for cohort companies |

### Post sign-up role picker (`/welcome`)

| Internal role | UI title | Tagline |
|---------------|----------|---------|
| Venture | Startup | A complete founder operating system |
| Investor | Investor | 10x your due diligence and intake |
| Ecosystem | Service Provider | 24/7 support for ventures and cohorts |

**Startup capabilities (as shown on welcome):**

- ScaleupMap Score™ and mitigating risks before pitching
- Investment memos and tearsheets for fundraising
- Public profile, one-click investor applications, grants
- Founder OS / AI business co-founder

**Investor capabilities (as shown on welcome):**

- Deal flow, venture scoring, venture-investor fit
- Investment memos and tearsheets
- KPIs, investor updates, portfolio tracking
- AI chat per venture

**Service provider capabilities (as shown on welcome):**

- Profile visibility to ventures
- Client and request management
- Pitch competitions (rubric, judges)
- Cohort support (tasks, KPIs, progress)

---

## Brand colors

### Core

| Name | Hex | Typical use |
|------|-----|-------------|
| Primary light blue | `#4FBBEA` | Highlights, links, checks, gradient start |
| Primary dark blue | `#3160AE` | Headers, primary buttons, active tabs |
| Primary button hover | `#254a8f` | Navy CTA hover |

### Neutrals and surfaces

| Hex | Typical use |
|-----|-------------|
| `#1a365d` | In-app titles (serif) |
| `#1a2744` | Landing headlines |
| `#475569` | Secondary body |
| `#64748b` | Meta, captions |
| `#f1f5f9` | Logged-in page background |
| `#FAFBFD` | Public landing background |
| `#FFFFFF` | Cards, heroes |

### Common UI patterns

- **Eyebrow:** `#4FBBEA`, uppercase, wide tracking (e.g. 11px, ~0.18 to 0.22em)
- **Cards:** `rounded-2xl`, border `#3160AE` at ~12% opacity, white / white 90%, light shadow
- **Primary CTA:** `rounded-full`, `#3160AE` fill, white text
- **Secondary CTA:** `rounded-full`, border `#3160AE` at ~25% opacity, text `#3160AE`
- **Accent:** vertical or horizontal gradient `#4FBBEA` → `#3160AE`

---

## Typography

| Role | Font | Fallback |
|------|------|----------|
| Body / UI | [DM Sans](https://fonts.google.com/specimen/DM+Sans) | system-ui, sans-serif |
| Display / headings | [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) | Georgia, serif |

Landing uses DM Sans for body (`font-landing`) and DM Serif Display for heroes (`font-heading`). Logged-in workbench-style pages often use DM Sans + serif titles at `#1a365d`.

Some standalone investor-style forms still use **Montserrat** (headings) and **Open Sans** (body).

**Google Fonts:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-display: 'DM Serif Display', Georgia, serif;
}
```

---

## Logo

Use the header logo and favicon from [scaleupmap.com](https://scaleupmap.com). Event organizers may also provide a PNG export.

---

## Public routes

### Marketing and auth

| Path | Purpose |
|------|---------|
| `/` | Homepage |
| `/signup` | Sign up (Google or email) |
| `/signin` | Sign in |
| `/welcome` | Role selection after account setup |
| `/about` | About |
| `/contact` | Contact |
| `/billing` | Pricing |
| `/tos` | Terms of service |
| `/privacy` | Privacy policy |

### Onboarding

| Path | Purpose |
|------|---------|
| `/onboarding/founder` | Founder multi-step onboarding |
| `/onboarding/founder/complete` | Post-onboarding "where to go first" |
| `/onboarding/founder/tutorial` | Goal-based product tutorials |
| `/onboarding/investor` | Investor onboarding |
| `/onboarding/provider` | Service provider onboarding |

### Founder product destinations (logged-in)

| Feature | Path |
|---------|------|
| Venture / ScaleupMap Score | `/dashboard/score` |
| Pitch deck score | `/dashboard/score/deck` |
| Pitch practice | `/dashboard/score/practice` |
| North Star Sprint | `/coach/north-star-sprint` |
| Goals calendar | `/coach/goals/view/calendar` |
| Coach journey map | `/coach?view=map` |
| Investment memo | `/dashboard/memo` |
| Tearsheet | `/dashboard/tearsheet` |
| Venture hub | `/dashboard/hub/venture` |
| Venture AI chat | `/dashboard/venture-chat` |
| Investor directory | `/entities#static-investors` |
| Grants directory | `/entities#grants` |
| Investor hub | `/dashboard/hub/investor` |
| Provider hub | `/dashboard/hub/provider` |
| Main dashboard | `/dashboard` |

---

## Sign-up and sign-in flow

1. Homepage "Get started" → `/signup` when not authenticated.
2. **Sign up:** Google, or email with first name, last name, password (8+ chars, number or special char, no spaces), optional profile photo.
3. **Email sign-up:** verification email → user confirms → setup completes → redirect to `/welcome`.
4. **Welcome:** choose Startup, Investor, or Service Provider → role-specific onboarding.
5. **Sign in:** `/signin` (Google, email/password, forgot password).

### Auth screen styling (current product)

- Page background: `#f1f5f9`
- Card: white, `rounded-2xl`, border `#3160AE` ~12% opacity
- Title: DM Serif Display, `#1a365d`
- Primary button: full-width pill, `#3160AE`, hover `#254a8f`

---

## Founder onboarding data (production)

Used in `/onboarding/founder` to personalize tutorials and "complete" recommendations.

### Journey stage

| Value | Label |
|-------|--------|
| `looking_for_idea` | Looking for an idea |
| `building_mvp` | Building an MVP |
| `early_traction` | Early traction |
| `raising_first_round` | Raising a first round |
| `scaling_post_seed` | Scaling after seed |
| `pivoting` | Pivoting |

### Platform goals (multi-select)

| Value | Label | Typical product tie-in |
|-------|--------|-------------------------|
| `validate_direction` | Unsure about direction | Coach / journey map |
| `win_customers` | Traction and customers | North Star, GTM coach |
| `raise_funding` | Raising feels overwhelming | Memo, tearsheet, hub |
| `find_funding` | Finding investors and funding | Entities / directory |
| `investor_blind_spots` | Blind spots investors will see | Venture score |
| `execution_focus` | Need weekly focus | North Star Sprint, calendar |

### Team size

- Just me (solo founder)
- 2 to 5 people
- 6 to 10 people
- 11+ people

### How they heard about ScaleupMap

Search engine, founder referral, investor/VC ecosystem, accelerator/incubator/program, social media, event/webinar, other.

Pitch deck upload is requested for most journey stages except "looking for an idea."

### Goal → primary destinations (simplified)

| Goal | Common primary link |
|------|---------------------|
| `find_funding` | `/entities#static-investors` |
| `raise_funding` | `/dashboard/memo` |
| `investor_blind_spots` | `/dashboard/score` |
| `validate_direction` | `/coach?view=map` |
| `execution_focus` | `/coach/north-star-sprint` |
| `win_customers` | North Star / coach GTM paths |

After onboarding, `/onboarding/founder/complete` surfaces pillars such as **Venture score**, **North Star Sprint**, and **Lean canvas / journey map** with links to `/dashboard/score`, `/coach/north-star-sprint`, and `/coach?view=map`.

---

## Editorial UI tokens (in-app pages)

Common patterns on dashboard and document workbench screens:

- Page canvas: `#f1f5f9`, DM Sans
- Titles: DM Serif Display, `#1a365d`
- Body/meta: `#64748b`, `#475569`
- Primary pill button: `#3160AE`, hover `#254a8f`
- Content cards: `rounded-2xl`, border `#3160AE`/12, white 90%
