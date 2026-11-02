# Longfly website (longfly.us)

A single static page for the Longfly F-16 cockpit, built from the redesign mockup (November 2026). No build step; GitHub Pages serves this repo's `main` branch.

```
index.html                     the page (all words live here)
site.config.js                 Stripe deposit link, founder spots claimed, waitlist form URL, analytics key
assets/css/cockpit.css         styles (palette and type at the top)
assets/js/home.js              waitlist form, deposit button, spots counter, sticky mobile bar
assets/js/analytics.js         PostHog (page views, section reach/time, custom events)
projects/f16-cockpit/images/   hero, bench and builder photos, share.jpg (link preview, 1200x630)
instagram/ tiktok/ youtube/ reddit/   bio links: redirect to the home page with utm_source tags
quinlong/                      portfolio page (separate)
CNAME                          keeps the longfly.us domain
```

Page order: hero → the offer (`#reserve`) → the product (`#cockpit`) → the story (`#story`) → how it works → FAQ (`#faq`) → footer.

## Founders deposit ("Hold my spot — $100")

1. Stripe Dashboard → **Activate payments** (business details + the bank account payouts go to).
2. Product catalog → Add product named "$100 refundable deposit — Longfly F-16 Cockpit, Batch 1 Founders", one-time price $100.
3. Payment Links → New → that product. Options: collect **shipping address**, **require phone number**, no quantity changes, **limit the number of payments to 10**. After payment → redirect to `https://longfly.us/?paid=1` (visitors then see "Spot held").
4. Paste the live link (`https://buy.stripe.com/...`, not `test_`) into `preorder.link` in `site.config.js`. Until then the button sends people to the waitlist.
5. After each deposit, raise `preorder.claimed` by one. The counter must be a real number.

Buyer names, emails, phones and addresses: Stripe → Payments or Customers → Export. Nothing personal is stored on the site. The second $100 is collected when each unit is ready (e.g. a Stripe invoice).

## Waitlist

Email, first name and jet. Saved in PostHog (People → filter "email is set" → export CSV; `first_name` and `jet` are person properties), event `launch_signup` with `list = waitlist`. Ad blockers hide PostHog from some visitors: for ads, also create a free Formspree form and paste its URL into `launch.signupEndpoint`.

## Analytics (PostHog)

Same PostHog project as every earlier version of the site, so all old data (votes, sign-ups, downloads, visits) is still there. Events now: `$pageview`, `section_reached` / `section_time` (sections `hero`, `offer`, `waitlist`, `founders`, `product`, `story`, `how`, `faq`, `contact`), `launch_signup`, `reserve_click` (`link` = whether the Stripe link was set), `deposit_paid` (back from Stripe). Meta Pixel (if `metaPixel` is set): `Lead`, `InitiateCheckout`, `Purchase`.

Bio links: longfly.us/instagram, /tiktok, /youtube, /reddit → PostHog Web analytics → Sources → UTM source.

## Earlier versions

The F-14 cockpit section, poll, free gimbal STL downloads, press kit and pre-order page were removed on 2026-11-02. They are all in git history (commit d388901 and before) if anything needs to come back.
