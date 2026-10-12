/*
  Longfly site settings.
  Edit the values below; no other file needs to change.
  Anything still marked placeholder: true shows a "Placeholder" tag on the site
  so nobody mistakes it for real payment details. Set it to false once filled in.
*/
Longfly.config({
  name: "Longfly",
  tagline: "Small, light hardware for FPV pilots.",

  // Product shown in the big top section of the home page (its folder name).
  featured: "fpv-micro-gimbal",

  about: [
    "Longfly is Quinlong's FPV hardware workshop. Every part starts in CAD and gets checked through its full range of motion before anything is printed.",
    "Right now I'm finding out whether there's enough interest to launch a Kickstarter for an ultra-realistic F-14 cockpit for head-tracking FPV. If you'd want one, press the button at the top of the page."
  ],

  contact: {
    email: { value: "quinlongliang@gmail.com", placeholder: false },
    // Optional. Leave value empty ("") to hide a link.
    instagram: { value: "", placeholder: true },
    youtube: { value: "", placeholder: true }
  },

  // How buyers pay. Swap the values, drop a QR image into /payments, and set placeholder: false.
  payments: [
    {
      id: "paypal",
      label: "PayPal",
      value: "Quin-Long Liang",
      link: "https://www.paypal.com/qrcodes/p2pqrc/7BPLWG644ETC4",   // opens PayPal to pay you
      qr: "payments/paypal-qr.png",
      note: "Scan the code or tap Open PayPal. Put your order reference in the note, and the download link is emailed to you once the payment comes through.",
      placeholder: false
    },
    {
      id: "card",
      label: "Card",
      value: "Credit or debit card, Apple Pay or Google Pay through Stripe's secure checkout.",
      link: "https://buy.stripe.com/test_14AdR88kN4BcfFYesa3sI00",   // TEST link: swap for the live buy.stripe.com link
      linkLabel: "Pay by card",
      copy: false,
      tag: "Test mode",                                                  // remove once the live link is in
      note: "After paying you go straight to the download page.",
      placeholder: false
    }
  ],

  // F-14 cockpit idea on the home page, with the Kickstarter price test (see README, "F-14 price test").
  // Files live in projects/f14-cockpit/. Delete this whole block to hide the section.
  cockpit: {
    folder: "projects/f14-cockpit",
    image: "images/hero_closed.jpg",          // shown until a 3D model is added
    imageAlt: "Render of the F-14 cockpit with the canopy closed",
    model: "model/preview.stl",                // reduced-detail copy of F14B_RC_Cockpit.stl, canopy glass left out
    modelFit: 0.72,                            // camera distance; lower = closer
    video: "video/sample.mp4",
    videoPoster: "video/sample-poster.jpg",
    videoCredit: "Video by 轩_快出来飞飞机 on bilibili, not a Longfly build.",
    reddit: "https://www.reddit.com/r/RCPlanes/comments/1x3s7wa/fpv_headtracker_with_an_ultra_realistic_cockpit/",
    prices: [100, 200, 300, 400, 500]          // each visitor sees one of these at random
  },

  // Kickstarter launch: email sign-up, optional $1 reservation, and the live campaign link (README, "Kickstarter launch").
  launch: {
    perk: "Sign up to hear the moment it launches and get the early-bird price on day one.",
    signupEndpoint: "",      // optional form service URL, e.g. "https://formspree.io/f/xxxxxxx" (sign-ups also go to PostHog)
    reserveLink: "",         // optional $1 Stripe Payment Link (live, not test) shown after sign-up
    reserveLabel: "Reserve the early-bird price for $1",
    reserveText: "Want to lock in the lowest price? A $1 reservation holds your early-bird spot and comes off your pledge.",
    kickstarterUrl: ""       // paste the campaign link on launch day; the main button then goes straight to Kickstarter
  },

  // Press kit section. Files live in press/. Add a Google Drive or Dropbox folder link for full-resolution photos.
  press: {
    folder: "press",
    blurb: "Longfly is building an ultra-realistic F-14 cockpit for head-tracking FPV: a scale cockpit with seats, canopy frame and instrument panels that sits around the FPV camera, so the pilot sees the inside of a Tomcat when they look around. Free to use with credit to Longfly.",
    folderLink: "",
    files: [
      { file: "longfly-f14-cockpit-render.png", thumb: "thumbs/render.jpg", label: "Cockpit render", note: "PNG · 1600×1000" },
      { file: "longfly-f14-cockpit-3d-view.png", thumb: "thumbs/3d-view.jpg", label: "3D view, canopy off", note: "PNG" },
      { file: "longfly-logo.svg", label: "Longfly logo", note: "SVG" }
    ]
  },

  // Pre-order page at /preorder/ (README, "Pre-order page"). Each visitor sees one tier at random; the regular
  // price shown is double. Each tier needs its own live Stripe Payment Link that collects name, phone and shipping
  // address. Until a tier has a link, its visitors are added to the email list instead of paying.
  preorder: {
    tiers: [
      { price: 100, link: "" },
      { price: 200, link: "" },
      { price: 300, link: "" },
      { price: 400, link: "" }
    ],
    availability: "Available for purchase by November 5 in the Americas.",
    details: [
      ["When does it ship?", "The cockpit will be available by November 5. Pre-orders are first in line, and you'll get shipping updates by email."],
      ["Where do you ship?", "Anywhere in the Americas: the US, Canada, Mexico, Central and South America."],
      ["What if it's late?", "If it can't ship by November 5, you'll be emailed a new date and can cancel for a full refund."],
      ["Can I cancel?", "Yes. Email quinlongliang@gmail.com any time before it ships for a full refund."],
      ["How do I pay?", "Checkout is handled by Stripe (card, Apple Pay, Google Pay). Your card details never touch this site."]
    ]
  },

  // Meta (Facebook/Instagram) Pixel ID for ad conversion tracking. Leave empty to keep it off.
  metaPixel: "",

  // Optional: a form service URL (Formspree, Basin, Getform...) that receives orders as JSON.
  // Leave empty and buyers will copy their order summary and email it instead.
  preorderEndpoint: "",

  // Visitor analytics (PostHog, free up to 1 million events a month).
  // Sign up at posthog.com, create a project, and paste its "Project API key" (starts with phc_) below.
  // Use "https://eu.i.posthog.com" as host if you picked the EU region.
  analytics: {
    key: "phc_xrZjfCAjjvQzvMbFLXzftnwFym4GxyMGmz77iXghikPd",   // PostHog project key (public by design)
    host: "https://us.i.posthog.com",
    cookieless: false,                    // true = no browser storage, but repeat visitors count as new
    debug: false                          // true = also print every event in the browser console
  }
});
