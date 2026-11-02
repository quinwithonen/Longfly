# Longfly website (longfly.us)

Quinlong's single-file F-16 cockpit pre-order page (`index.html` + `assets/*.webp`), deployed as-is on GitHub Pages from `main`.

## To go live
Open `index.html` and find the `CONFIG` block near the bottom:
- `STRIPE_LINK`: the live Stripe Payment Link for the $100 deposit (product name "$100 refundable deposit — Longfly F-16 Cockpit, Batch 1 Supporters"; collect shipping address + phone; limit to 10 payments; optionally redirect after payment to `https://longfly.us/?paid=1`).
- `WAITLIST_ENDPOINT`: optional Formspree (or similar) URL. Sign-ups are saved in PostHog either way.
- `SPOTS_CLAIMED`: the real number of deposits taken. Update after each one.

Buyer names, emails, phones and addresses live in Stripe → Payments / Customers → Export. Payouts go to the bank account set in Stripe when the account is activated.

## Kept from the old site
- `CNAME` (keeps longfly.us), `assets/js/analytics.js` (PostHog, same project as before, so old data is kept; hooked up at the bottom of `index.html`), the bio-link redirects `/instagram /tiktok /youtube /reddit`, the `/quinlong` portfolio, and `projects/f16-cockpit/images/share.jpg` (link preview image).
- Real media (2026-11-02 trust update): `assets/quinlong-field.jpg`, `assets/comments/` (four real comment screenshots), `assets/video/v1-prototype.mp4` + `v1-poster.jpg` (the 19 s V1 clip). `hero.webp` and `jet.webp` are AI atmosphere only. `assets/video/in-action.mp4` is the reference clip by 轩_快出来飞飞机 (kept at Quinlong's request in #example, credited "Referenced footage by 轩_快出来飞飞机").
- PostHog events: `$pageview`, `section_reached` / `section_time` (sections `offer`, `reception`, `product`, `prototype`, `story`, `how`, `faq`, `contact`), `launch_signup` (waitlist; person gets `email`, `first_name`, `jet`), `reserve_click`, `deposit_paid`.

Everything older (F-14 section, poll, gimbal downloads, press kit, pre-order page) is in git history.
