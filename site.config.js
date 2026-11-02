/*
  Longfly site settings (longfly.us). Page words live in index.html; these are the switches.
*/
Longfly.config({
  contact: {
    email: { value: "quinlongliang@gmail.com" }   // shown only if the waitlist form fails to send
  },

  // Founders deposit ("Hold my spot — $100", longfly.us/#reserve).
  // link: the LIVE Stripe Payment Link for the $100 deposit (see README). Empty = the button sends people to the waitlist.
  // claimed: how many founder spots are paid. Raise it by one after each deposit. Must be a real number.
  preorder: {
    deposit: 100,
    units: 10,
    claimed: 0,
    link: ""
  },

  // Waitlist form. Sign-ups go to PostHog People. Optionally also to a form service (e.g. a Formspree URL).
  launch: {
    signupEndpoint: ""
  },

  // Meta (Facebook/Instagram) Pixel ID for ads. Empty = off.
  metaPixel: "",

  // Visitor analytics (PostHog).
  analytics: {
    key: "phc_xrZjfCAjjvQzvMbFLXzftnwFym4GxyMGmz77iXghikPd",   // PostHog project key (public by design)
    host: "https://us.i.posthog.com",
    cookieless: false,
    debug: false
  }
});
