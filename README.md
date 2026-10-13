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

## F-14 price test

The F-14 cockpit section on the home page (settings under `cockpit` in `site.config.js`, files in `projects/f14-cockpit/`) shows each visitor one price picked at random from `prices`. A visitor keeps the same price on later visits, so nobody is counted at two prices.

Events sent to PostHog, each with a `price` property:

| Event | When |
|---|---|
| `cockpit_price_shown` | The button came on screen (once per page view) |
| `cockpit_interest` | They pressed the Kickstarter button |
| `cockpit_price_answer` | They answered "would $X be fair?", with `answer` = `yes` or `no` |

Charts to build in PostHog (Product analytics → New insight):

- **Interest per price:** Trends, event `cockpit_interest`, count "Unique users", breakdown by `price`. Set the chart type to "Total value" (bar) to see one bar per price.
- **Who says the price is fair:** Trends, event `cockpit_price_answer` with filter `answer = yes`, count "Unique users", breakdown by `price`. Add a second series with `answer = no` to compare.
- **Click rate per price:** Funnels, step 1 `cockpit_price_shown`, step 2 `cockpit_interest`, step 3 `cockpit_price_answer` (filter `answer = yes`), breakdown by `price`. This corrects for one price happening to be shown more often than another.

To add the 3D model, export the assembly from SolidWorks as one STL (File → Save As → STL, "Save all components of an assembly in a single file"), put a reduced-detail copy at `projects/f14-cockpit/model/preview.stl` and set `model: "model/preview.stl"`.

## Kickstarter launch

Everything is set under `launch`, `press` and `metaPixel` in `site.config.js`.

**Email sign-up.** Works now with no extra account: each sign-up is saved in PostHog (People → filter "email is set" → export CSV) and sends a `launch_signup` event with the price that visitor saw in the price test. Ad blockers hide PostHog from some visitors, so before running ads also connect a form service:

1. Create a free form at formspree.io (or a similar service) and copy its endpoint URL.
2. Paste it into `launch.signupEndpoint`. Sign-ups then also land in your Formspree inbox and can be exported or sent to Mailchimp/Kit.

**$1 reservation (optional).** Make a live Stripe Payment Link for $1 (name it "F-14 cockpit early-bird reservation") and paste it into `launch.reserveLink`. The button shows after someone signs up and sends a `reserve_click` event. Card details are only ever entered on Stripe's page.

**Launch day.** Paste the campaign URL into `launch.kickstarterUrl`. The top of the page then shows "Back it on Kickstarter", the reservation button hides, and clicks send `kickstarter_click`.

**Meta Pixel.** In Meta Events Manager create a pixel, then paste its ID into `metaPixel`. The site sends PageView, `Lead` on sign-up and `InitiateCheckout` on the reservation button, so ads can optimise for sign-ups.

**Press kit.** Files in `press/` are listed in `press.files`. Put full-resolution photos in a shared Google Drive or Dropbox folder and paste its link into `press.folderLink`.

**Link previews.** `projects/f14-cockpit/images/share.jpg` (1200×630) is the picture shown when the site is shared. The tags at the top of `index.html` point at https://longfly.us; change them if the domain changes.

## Pre-order page

A separate page at https://longfly.us/preorder/ (`preorder/index.html`, `assets/js/preorder.js`, settings under `preorder` in `site.config.js`). It reuses the cockpit model and video from the main page.

Each visitor sees one pre-order price picked at random from `preorder.tiers` ($100, $200, $300 or $400, shown as 50% off double that) and keeps it on later visits. They enter name and email, which are saved in PostHog, then go to that tier's Stripe Payment Link to pay. Until a tier has a link, its visitors see "Pre-orders open soon" and are just added to the list.

**Set up the Stripe links (once per tier, in live mode):**

1. Stripe Dashboard → Product catalog → Add product "F-14 cockpit (pre-order)", one-time price $100. Repeat for $200, $300, $400 (or add four prices to one product).
2. Payment Links → New, pick the $100 price.
3. Under **Options**: tick "Collect customers' addresses" → Shipping address, and choose the countries you ship to (US, Canada, Mexico, Central and South America). Tick "Require customers to provide a phone number". Untick "Allow customers to adjust quantity" unless you want multiples.
4. Under **After payment**: "Don't show confirmation page" → redirect to `https://longfly.us/preorder/?paid=1`.
5. Create the link, copy it into the matching tier's `link` in `site.config.js`. Repeat for the other prices.

**Your buyer list:** Stripe Dashboard → Payments (or Customers) → Export. The CSV has each buyer's name, email, phone and shipping address. Nothing personal is stored on the site or in this repo.

**Results by price in PostHog:** events `preorder_price_shown`, `preorder_start` (pressed Pre-order) and `preorder_paid` (came back from Stripe), each with `price`. Build a Funnel of those three steps with breakdown by `price`. Stripe's own payment list is the source of truth for who actually paid.

## Cockpit poll

"Which one would you want?" sits under the F-14 section. Settings are under `poll` in `site.config.js`: each option is `{ label, note }` (note is the small grey line, optional), and `allowOther: true` adds an "Other" box. Each visitor votes once per poll `id`; when you change the options, change `id` (e.g. "v3") so everyone can vote again and old votes stay separate.

Every vote sends a `cockpit_poll` event with `poll` (the id), `choice` (the option's label) and, for Other, `other`.

In PostHog (Product analytics → New insight):

- **Vote split:** Trends, event `cockpit_poll` filtered to `poll = v2`, count "Unique users", breakdown by `choice`, chart type "Total value" (bar) or pie.
- **Write-ins (if Other is on):** same, filtered to `choice = Other`, breakdown by `other`, shown as a table.

## Free downloads (gimbal STLs)

The `#downloads` section on the home page shows the micro gimbal as a rotatable 3D model, a short description, the STL files and a "Tip me" PayPal button. Everything is set under `downloads` in `site.config.js`; the files live in `downloads/micro-gimbal/` (`files/` for the STLs, `model/assembly.stl` for the 3D view, plus a zip of all STLs). To add or replace a file, drop it in `files/`, add a line to `downloads.files`, and rebuild the zip. Delete the `downloads` block to hide the section.

PostHog events: `download_file` (property `file`) and `tip_click`. For a chart, create a Trends insight on `download_file` broken down by `file`.
