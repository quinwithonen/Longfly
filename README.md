# Longfly website

A plain static site: HTML, CSS and a little JavaScript, no build step. Open `index.html` through any static host (Netlify, Cloudflare Pages, GitHub Pages) and it works.

## Where things live

```
index.html                 page layout (rarely needs editing)
site.config.js             business name, about text, contact, payment handles, preorder form URL
payments/                  QR code images (PayPal etc.)
products/catalog.js        which products show, in what order
products/<product>/        one folder per product
    product.js             name, price, status, specs, text, image list
    images/                renders and photos
    video/                 motion clips
work/work.js               build-log entries on the home page
work/images/               images for work entries that aren't tied to a product
assets/                    site styling and script
```

## Common changes

**New renders for the gimbal.** Drop them into `products/fpv-micro-gimbal/images/`. If you keep the same file names, nothing else changes. If the names change, update the paths in `product.js` (`heroImage`, `cardImage`, `gallery`).

**New video.** Replace `products/fpv-micro-gimbal/video/motion-pan-tilt.mp4`, or point `video` in `product.js` at the new file. Use H.264 MP4 so every browser plays it.

**3D model.** Put an STL in the product folder (e.g. `model/preview.stl`) and set `model: "model/preview.stl"` in `product.js`. Visitors can save whatever is shown, so use a reduced-detail mesh, not the print file. Add `modelUp: "y"` if the model shows up lying on its side.

**New revision (Rev C).** Edit `revision`, `specs` and `changes` in `product.js`, and swap the images. To keep the old revision's files, move them into an `images/rev-b/` folder first.

**Set a price.** In `product.js`, change `price: null` to a number, e.g. `price: 89`.

**Add a product.** Copy the `fpv-micro-gimbal` folder, rename it (lowercase, dashes), edit its `product.js`, then add the folder name to `products/catalog.js`. Its page appears at `index.html#<folder-name>`.

**Payment details.** In `site.config.js`, fill in each method's `value`, save a QR image to `payments/` and set `qr` to its path, then set `placeholder: false` so the "Placeholder" tag disappears.

**Receive preorders automatically.** Without a form service, buyers copy their order summary and email it. To receive orders directly, create a free form at a service such as Formspree and paste its URL into `preorderEndpoint` in `site.config.js`.

## Digital downloads

Products are sold as files. The files are in a Google Drive folder shared as "Anyone with the link", not in this repo (the repo is public, so nothing secret goes here).

- **Card (Stripe):** in the Stripe Payment Link, set **After payment → Redirect customers to your website** to the Drive folder link. Turn off shipping address and quantity on the link.
- **PayPal:** when a payment comes in, email the buyer the same Drive folder link.

Anyone who has the Drive link can share it. To cut off an old link, make a new folder (new link) and update Stripe.

## Status values

`status` in `product.js` can be `prototype`, `preorder`, `in-stock` or `sold-out`. `statusLabel` is the text on the badge. Products with `preorder: true` or `status: "in-stock"` appear on the order form.

## Visitor analytics

The site reports to [PostHog](https://posthog.com) (free up to 1 million events a month). Nothing is sent until you add a key.

1. Sign up at posthog.com and create a project (US or EU region).
2. Copy the project's API key (starts with `phc_`) into `analytics.key` in `site.config.js`. If you chose EU, set `host` to `https://eu.i.posthog.com`.
3. Deploy the site. Tracking only runs on the real website, not in the Claude preview.

What gets recorded:

| Event | When | Properties |
|---|---|---|
| `$pageview` | Someone opens the home page or a product page | `page` (`home` or the product folder name) |
| `section_reached` | A section has been on screen for half a second, once per page view | `page`, `section`, `order` |
| `section_time` | The visitor leaves the page or switches tabs | `page`, `section`, `seconds` on screen |

Button and link clicks (Preorder, Copy, etc.) are also captured automatically.

Section names: home page `hero`, `products`, `work`, `about`, `order`, `contact`. Product pages `overview`, `video`, `how-it-works`, `set-up-for-head-tracking`, `specs`, `revision-notes`, plus `order` and `contact`. New sections are tracked automatically when they have a `data-section` attribute (product page sections get one from their heading).

Charts to build in PostHog (Product analytics → New insight):

- **Visitors:** Trends, event `$pageview`, count "Unique users", broken down by `page`.
- **How far people get:** Funnels, steps `section_reached` filtered to `section = hero`, then `products`, `work`, `about`, `order`, `contact` (filter `page = home`). Each bar shows how many visitors reached that section.
- **Time per section:** Trends, event `section_time`, aggregate "Property value: sum" of `seconds`, broken down by `section`. Divide by the unique users who reached each section for the average per visitor, or use "Property value: average" for the average per visit.

Set `cookieless: true` to stop PostHog storing anything in the browser. Repeat visitors then count as new visitors.

## Home page: F-16 cockpit (November 2026 redesign)

`index.html` is now a single page for the F-16 cockpit, built from the redesign mockup, in this order: hero, the offer (`#reserve`), the product (`#cockpit`), the story (`#story`), how it works, FAQ (`#faq`). The older pieces sit below the FAQ: the cockpit poll, free gimbal downloads and the press kit. The copy is final wording from the mockup and lives directly in `index.html`; the refund and Christmas lines are promises, so change them only on purpose. Styles: `assets/css/cockpit.css` (palette and type at the top). Script: `assets/js/home.js`.

**Founders deposit ("Hold my spot — $100").** Settings under `preorder` in `site.config.js`.

1. Stripe Dashboard (live mode) → Product catalog → Add product named exactly "$100 refundable deposit — Longfly F-16 Cockpit, Batch 1 Founders", one-time price $100. In the description: "Batch 1 "Great Faith" Founders Edition. Total price $200 (regular $400): $100 today, $100 when your unit is ready to ship. Deposit refundable until your unit ships. Ships in time for Christmas, or deposit refunded."
2. Payment Links → New, pick that price. Options: collect shipping address and phone number, turn off quantity changes, and tick **Limit the number of payments** = 10.
3. After payment → redirect to `https://longfly.us/?paid=1` (the old `/preorder/?paid=1` also still works). Visitors coming back see "Spot held". Stripe's own confirmation email is the receipt.
4. Paste the link into `preorder.link`. Until then, the button sends people to the waitlist.
5. **After each deposit, raise `preorder.claimed` by one.** The counter on the founders card shows this number; it must be real, never a made-up "7 claimed". At 10 the button switches to the waitlist.

The remaining $100 is collected when each unit is ready (e.g. a Stripe invoice). Buyer names and addresses: Stripe → Payments → Export. Nothing personal is stored on the site.

**Waitlist (free).** Email, first name and jet. Each sign-up is saved in PostHog (People → filter "email is set" → export CSV; `first_name` and `jet` are person properties) and sends `launch_signup` with `list = waitlist`. Ad blockers hide PostHog from some visitors, so before running ads also create a free form at formspree.io and paste its URL into `launch.signupEndpoint`.

**Story photo.** Put a real photo of you at the bench in `projects/f16-cockpit/images/` and set `story.photo` to its path. Until then the story section has no photo.

**Product pictures.** The two F-16 illustrations at the top of "Inside the cockpit" come from `art` in `site.config.js`. Swap them for real photos of the unit when you have them (the first one is shown large).

**Hero picture.** `projects/f16-cockpit/images/hero.jpg` (plus `hero-960.jpg` for phones) is the AI-generated atmosphere shot from the mockup. `share.jpg` (1200×630) is the link preview.

**Mobile.** On phones a "Reserve yours — $100" bar slides up once the hero scrolls away and hides over the offer section.

**Events in PostHog:** `launch_signup` (waitlist), `reserve_click` (`link` = whether the Stripe link was set), `deposit_paid` (back from Stripe), plus the usual `section_reached` / `section_time` for sections `hero`, `offer`, `waitlist`, `founders`, `product`, `story`, `how`, `faq`, `poll`, `downloads`, `press`, `contact`. Meta Pixel (if `metaPixel` is set): `Lead` on waitlist, `InitiateCheckout` on the deposit button, `Purchase` on return from Stripe.

**Link previews.** The tags at the top of `index.html` point at https://longfly.us; change them if the domain changes.

`/preorder/` now just forwards to `/#reserve`. The old F-14 section (`cockpit` in `site.config.js`, `assets/js/cockpit.js`, `assets/js/launch.js`) is no longer on the page; its files are kept in case it comes back.

## Cockpit poll

"Which one would you want?" sits under the F-14 section. Settings are under `poll` in `site.config.js`: each option is `{ label, note }` (note is the small grey line, optional), and `allowOther: true` adds an "Other" box. Each visitor votes once per poll `id`; when you change the options, change `id` (e.g. "v3") so everyone can vote again and old votes stay separate.

Every vote sends a `cockpit_poll` event with `poll` (the id), `choice` (the option's label) and, for Other, `other`.

In PostHog (Product analytics → New insight):

- **Vote split:** Trends, event `cockpit_poll` filtered to `poll = v2`, count "Unique users", breakdown by `choice`, chart type "Total value" (bar) or pie.
- **Write-ins (if Other is on):** same, filtered to `choice = Other`, breakdown by `other`, shown as a table.

## Free downloads (gimbal STLs)

The `#downloads` section on the home page shows the micro gimbal as a rotatable 3D model, a short description, the STL files and a "Tip me" PayPal QR code (from `payments/paypal-qr.png`; tapping it opens PayPal). Everything is set under `downloads` in `site.config.js`; the files live in `downloads/micro-gimbal/` (`files/` for the STLs, `model/assembly.stl` for the 3D view, plus a zip of all STLs). To add or replace a file, drop it in `files/`, add a line to `downloads.files`, and rebuild the zip. Delete the `downloads` block to hide the section.

PostHog events: `download_file` (property `file`) and `tip_click`. For a chart, create a Trends insight on `download_file` broken down by `file`.

## Social bio links (traffic by platform)

Put one link in each bio:

| Platform | Short link | Same thing, long form |
|---|---|---|
| Instagram | https://longfly.us/instagram | https://longfly.us/?utm_source=instagram&utm_medium=social&utm_campaign=bio |
| TikTok | https://longfly.us/tiktok | https://longfly.us/?utm_source=tiktok&utm_medium=social&utm_campaign=bio |
| YouTube | https://longfly.us/youtube | https://longfly.us/?utm_source=youtube&utm_medium=social&utm_campaign=bio |
| Reddit | https://longfly.us/reddit | https://longfly.us/?utm_source=reddit&utm_medium=social&utm_campaign=bio |

The short links are the `instagram/`, `tiktok/`, `youtube/` and `reddit/` folders; each just forwards to the long form. PostHog reads `utm_source` automatically. To see the split: Web analytics → Channels/Sources card → switch to "UTM source". Or make a Trends insight on Pageview, breakdown by "UTM source" (or "Session entry UTM source" to credit the whole visit). For a video description, swap `utm_campaign=bio` for a name like `utm_campaign=f14-video1` to compare individual posts.
