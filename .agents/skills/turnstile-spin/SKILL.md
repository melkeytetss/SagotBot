---
name: turnstile-spin
description: Set up Cloudflare Turnstile end-to-end in a project. Scan the codebase, create the widget via the Cloudflare API, embed it where user requests need bot verification (form submissions, SPA actions, API endpoints, download links, comment or vote submissions, etc.), wire canonical server-side siteverify in the customer's existing backend, validate, and persist the skill. Load this when a user asks to add Turnstile, set up CAPTCHA, protect a form or endpoint from bots, or fix a Turnstile integration. Mirrors developers.cloudflare.com/turnstile/spin.
references:
  - vanilla-html
  - nextjs-app
  - nextjs-pages
  - astro
  - sveltekit
  - hugo
---

# Cloudflare Turnstile Integration Skill

Turns the prompt "set up Turnstile" into a working end-to-end integration: a widget, frontend snippets at every chosen insertion point, canonical server-side siteverify in the customer's existing backend, and a real validation pass before reporting success.

## When to load this skill
Load when the prompt mentions:
- "Turnstile", "CAPTCHA", "bot protection"
- "siteverify", "cf-turnstile-response"
- "protect this form", "protect this endpoint", "protect this button", "stop bot signups", "spam signups", "block bots on <target>"
- A specific signup, login, contact form, download, comment, API endpoint, or other user-triggered request combined with "Cloudflare" or "bot"

## Protected Surfaces in EduQuest
- **Login**: `apps/web/src/pages/auth/Login.jsx` (Action: `login`)
- **Register**: `apps/web/src/pages/auth/Register.jsx` (Action: `register`)
- **Recover Password**: `apps/web/src/pages/auth/RecoverPassword.jsx` (Action: `recover`)
- **Component**: `apps/web/src/components/Turnstile.jsx`
- **Site Key**: `0x4AAAAAACus2J8DKC1y7hnS`
