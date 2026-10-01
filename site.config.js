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
    "Longfly is Quinlong's drone hardware workshop. Every part starts in CAD, gets checked through its full range of motion before anything is printed, and is sized for micro quads where every gram counts.",
    "The first product is a two-axis head-tracking gimbal for the DJI O4 Lite camera. More parts and build logs will land here as they come off the printer."
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
