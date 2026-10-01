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
