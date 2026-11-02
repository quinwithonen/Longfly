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

  // F-14 cockpit section: NOT shown since the November 2026 redesign (the page is now the F-16 cockpit).
  // Kept here in case it comes back., with the Kickstarter price test (see README, "F-14 price test").
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

  // Waitlist form (Form A on the home page). Sign-ups go to PostHog People (event launch_signup) and, if set,
  // to a form service such as Formspree, which keeps working for visitors whose ad blocker blocks PostHog.
  launch: {
    signupEndpoint: ""       // optional form service URL, e.g. "https://formspree.io/f/xxxxxxx"
  },

  // F-16 artwork shown at the top of "Inside the cockpit". Files live in projects/f16-cockpit/art/.
  // Replace with real photos of the unit when you have them (the first image is the big one).
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

  // "Which cockpit next?" poll below the FAQ. One vote per visitor; results in PostHog (README, "Cockpit poll").
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

  // Founders deposit (the "Great Faith" card in the offer section, longfly.us/#reserve).
  // link: the live Stripe Payment Link for the $100 deposit. Name the product exactly
  //   "$100 refundable deposit — Longfly F-16 Cockpit, Batch 1 Founders", limit it to 10 payments,
  //   collect shipping address + phone, and set "After payment" to redirect to https://longfly.us/?paid=1
  //   Until it's set, the "Hold my spot" button sends people to the waitlist.
  // claimed: how many founder spots are paid. Update this by hand after each deposit; it must be a real number.
  preorder: {
    earlyPrice: 200,
    finalPrice: 400,
    deposit: 100,
    units: 10,
    claimed: 0,
    link: ""
  },

  // Story section. Drop a real photo of you at the bench into projects/f16-cockpit/images/ and put its path here.
  story: {
    photo: "",               // e.g. "projects/f16-cockpit/images/bench.jpg"
    photoAlt: "Quinlong soldering the cockpit at his desk"
  },

  // Footer links.
  social: [
    { label: "TikTok", handle: "@longfly.shop", url: "https://www.tiktok.com/@longfly.shop" },
    { label: "Instagram", handle: "@quin_long_", url: "https://www.instagram.com/quin_long_/" }
  ],

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
