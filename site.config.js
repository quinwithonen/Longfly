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
    prices: [400]                              // each visitor sees one of these at random (was 100-500; now matches the ~$400 expected price)
  },

  // Kickstarter launch: email sign-up, optional $1 reservation, and the live campaign link (README, "Kickstarter launch").
  launch: {
    eyebrow: "Pre-orders opening soon",
    title: "Get an email when pre-orders go live",
    offer: { earlyPrice: 200, earlyLabel: "first 10 units, with a $100 deposit", finalPrice: 400 },
    perk: "The final product is expected to cost about $400. The first 10 people who pre-order and put down a $100 deposit get theirs for $200.",
    doneText: "I'll email you the moment pre-orders go live, so you can grab one of the first 10 at $200.",
    signupEndpoint: "",      // optional form service URL, e.g. "https://formspree.io/f/xxxxxxx" (sign-ups also go to PostHog)
    reserveLink: "",         // optional $1 Stripe Payment Link (live, not test) shown after sign-up
    reserveLabel: "Reserve the early-bird price for $1",
    reserveText: "Want to lock in the lowest price? A $1 reservation holds your early-bird spot and comes off your pledge.",
    kickstarterUrl: ""       // paste the campaign link on launch day; the main button then goes straight to Kickstarter
  },

  // Artwork section (#art) above the poll. Files live in projects/f16-cockpit/art/. Remove this block to hide it.
  art: {
    eyebrow: "In the works",
    title: "F-16 cockpit",
    lede: "Concept art for the F-16 cockpit: what you'd see through the FPV goggles, and how the cockpit fits around the head-tracking camera.",
    folder: "projects/f16-cockpit/art",
    images: [
      { file: "f16-cockpit-view.svg", alt: "Illustration of the view from an F-16 cockpit at sunset: head-up display, two screens, keypad, side-stick and throttle", caption: "The view from the seat. Illustration, not a photo of the product." },
      { file: "f16-cockpit-cutaway.svg", alt: "Side cutaway illustration of an F-16 nose with an FPV camera on a gimbal where the pilot's head would be", caption: "The camera sits where the pilot's head would be, so looking around shows the cockpit." }
    ]
  },

  // "Which cockpit first?" poll under the F-14 section. One vote per visitor; results in PostHog (README, "Cockpit poll").
  poll: {
    id: "v2",                 // change this whenever the options change, so everyone can vote again and old votes stay separate
    question: "Which one would you want?",
    options: [
      { label: "F-16 cockpit, 70mm", note: "Flight time ~4-8 minutes depending on battery" },
      { label: "F-16 cockpit, 90mm", note: "Flight time ~4-8 minutes depending on battery" },
      { label: "P-51 Mustang, 1.2m", note: "WW2-era warbird. Flight time 10-25 minutes depending on battery" },
      { label: "P-51 Mustang, 1.46m", note: "Flight time 10-25 minutes depending on battery" }
    ],
    allowOther: false         // true adds "Other" with a box to type their own
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

  // Pre-order page at /preorder/ (README, "Pre-order page"). One offer for everyone: the first `units` pre-orders
  // pay `earlyPrice` instead of the expected `finalPrice`, reserved with a `deposit` paid now through a live Stripe
  // Payment Link (`link`) that collects name, phone and shipping address. Until `link` is set, visitors are added
  // to the email list and told pre-orders open soon.
  preorder: {
    earlyPrice: 200,
    finalPrice: 400,
    deposit: 100,
    units: 10,
    link: "",                // live Stripe Payment Link for the $100 deposit (limit it to 10 payments in Stripe)
    availability: "Available for purchase by November 5 in the Americas.",
    details: [
      ["How does the deposit work?", "Pay a $100 deposit now to hold one of the first 10 cockpits at $200 instead of the expected $400. The other $100 is due when it's ready to ship, and I'll email you before charging anything else."],
      ["What if the 10 are gone?", "After the first 10, the cockpit is expected to cost about $400. Sign up on the main page and I'll email you when more are available."],
      ["When does it ship?", "The cockpit will be available by November 5. Pre-orders are first in line, and you'll get shipping updates by email."],
      ["Where do you ship?", "Anywhere in the Americas: the US, Canada, Mexico, Central and South America."],
      ["What if it's late?", "If it can't ship by November 5, you'll be emailed a new date and can cancel for a full refund."],
      ["Can I cancel?", "Yes. Email quinlongliang@gmail.com any time before it ships and your deposit is refunded in full."],
      ["How do I pay?", "Checkout is handled by Stripe (card, Apple Pay, Google Pay). Your card details never touch this site."]
    ]
  },

  // Free downloads section (#downloads). Files live in downloads/micro-gimbal/.
  // "tip" shows your PayPal QR code (qr); tapping it opens the PayPal link. Remove this whole block to hide the section.
  downloads: {
    title: "FPV head-tracking micro gimbal",
    folder: "downloads/micro-gimbal",
    model: "model/assembly.stl",
    modelFit: 0.9,
    description: [
      "A tiny 2-axis head-tracking gimbal designed for the DJI and Caddx FPV cameras.",
      "Weighs 24 grams. The only parts besides the prints are two 4.3\u00a0g servos.",
      "Assembles in about 1 minute with no screws: superglue plus a pinch of baking soda cures instantly."
    ],
    zip: { file: "longfly-micro-gimbal-stl.zip", label: "Download all STL files (.zip)" },
    files: [
      { file: "files/camera_cradle.stl", label: "Camera cradle" },
      { file: "files/servo_base.stl", label: "Servo base" },
      { file: "files/servo_yoke.stl", label: "Servo yoke" },
      { file: "files/cradle_gear_35T.stl", label: "Cradle gear (35T)" },
      { file: "files/pitch_servo_gear_51T.stl", label: "Pitch servo gear (51T)" }
    ],
    tip: { label: "Tip me", text: "Free to download and print. If it helped you, scan the QR code with your phone to tip me on PayPal.", qr: "payments/paypal-qr.png", link: "https://www.paypal.com/qrcodes/p2pqrc/7BPLWG644ETC4" }
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
