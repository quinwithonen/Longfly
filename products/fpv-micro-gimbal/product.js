/*
  FPV Micro Gimbal — product data.
  Image and video paths are relative to this folder.
  To update to a new revision: drop the new renders into images/ (same names = nothing else to change),
  or change the file names below, then update "revision", the specs and "changes".
*/
Longfly.addProduct({
  name: "FPV Micro Gimbal",
  subtitle: "Two-axis head-tracking gimbal for the DJI O4 Lite",
  revision: "Rev B",
  status: "in-stock",           // "prototype", "preorder", "in-stock" or "sold-out"
  statusLabel: "Digital download",
  preorder: false,              // true shows a Preorder button for something not ready yet
  buyLabel: "Buy the files",    // text on the buy buttons
  price: 1,                     // e.g. 89 for $89. null shows "Price TBA".
  currency: "USD",

  headline: "About 15 grams, 281° of pan, driven by two 1.5 g servos.",
  summary: "A rack-and-pinion gimbal small enough for a micro quad. Two AGFRC 1.5 g linear servos move the bare DJI O4 Lite camera through ±140° of pan and ±79° of tilt, so your view follows your head.",

  // Big readout under the hero video. Keep it to 3–4 short items.
  readout: [
    { label: "Pan", value: "±140.6°" },
    { label: "Tilt", value: "±79.3°" },
    { label: "Mass", value: "~15 g" },
    { label: "Mount", value: "20×20 M2" }
  ],

  heroImage: "images/01_hero_posed_pan-30_tilt25.png",
  cardImage: "images/02_hero_level.png",
  video: "video/motion-pan-tilt.mp4",
  videoPoster: "images/09_motion_video_poster.png",

  // Main gallery on the product page, in order.
  gallery: [
    { src: "images/01_hero_posed_pan-30_tilt25.png", caption: "Panned −30°, tilted up 25°" },
    { src: "images/02_hero_level.png", caption: "Centre pose" },
    { src: "images/06_exploded_view.png", caption: "Exploded view, bottom to top: housing, pan servo, rack, idler, output gear, lid, washer, tilt frame, tilt servo, tilt rack, cradle with camera" },
    { src: "images/10_base_gear_stage_in_housing.png", caption: "Pan gear stage inside the housing: rack, 11T/18T idler, 12T output" },
    { src: "images/03_pan_drive_rack_idler_output.png", caption: "Pan drive: servo, rack, idler and output gear" },
    { src: "images/04_tilt_drive_rack_pinion_cradle.png", caption: "Tilt drive: rack blade and 13T pinion on the camera cradle" },
    { src: "images/05_rear_coax_routing.png", caption: "Rear view with coax routing loops" },
    { src: "images/08_printed_parts_sheet.png", caption: "The nine printed parts" },
    { src: "images/07_test_coupon.png", caption: "Print-tuning test coupon" }
  ],

  specs: [
    ["Pan range", "±140.6° (281° total)"],
    ["Tilt range", "±79.3° (158.7° total)"],
    ["Actuators", "2× AGFRC C1.5CLS linear servo, 9 mm stroke"],
    ["Signal", "900–2100 µs, 1500 µs = centre"],
    ["Supply", "3.7–6 V (5 V BEC ideal)"],
    ["Gearing", "Module 0.5, 25° pressure angle. Pan 1.5 : 1 step-up, tilt 13T pinion"],
    ["Camera", "DJI O4 Lite camera module (bare)"],
    ["Base footprint", "26.5 × 27.1 mm"],
    ["Height", "54.2 mm at centre pose"],
    ["Swept envelope", "Ø35.6 mm, from 19.4 to 54.2 mm above the mount"],
    ["Mounting", "4× M2 on a 20 × 20 mm pattern"],
    ["Gimbal mass", "~15 g without the camera"],
    ["Printed parts", "~10.2 g PETG (8.0 cm³)"],
    ["All-up mass", "~17 g with servos, camera and screws (design estimate)"]
  ],

  // Text sections on the product page. Each is a heading plus paragraphs or bullet points.
  sections: [
    {
      heading: "How it works",
      paragraphs: [
        "Each servo pushes a small slider through 9 mm. A printed rack clips over the slider and turns a gear, so the gearing sets how far the camera moves.",
        "Pan: the rack turns an 11-tooth idler, and an 18-tooth gear on the same idler drives a 12-tooth output. That 1.5 : 1 step-up turns the upper stage 281°.",
        "Tilt: the second servo lies flat on the turning frame. Its rack is an upright toothed blade that drives a 13-tooth pinion built into the camera cradle."
      ]
    },
    {
      heading: "Set up for head tracking",
      bullets: [
        "Plug both servos into flight-controller outputs and map them to your head-tracking channels.",
        "Response is about 0.23° per µs on pan and 0.13° per µs on tilt.",
        "Zero the camera with servo trim in the FC rather than re-meshing gears.",
        "Set endpoints a little inside 900/2100 µs so the servos never stall at their end stops."
      ]
    }
  ],

  // What changed in this revision. Shown as the revision notes.
  changes: [
    "Pan range up from ±93.8° to ±140.6° with a new 1.5 : 1 gear stage in the base.",
    "Upper stage rides on a 2 mm thrust washer, leaving a 2.1 mm gap so the coax can't be pinched.",
    "Chamfered bed edges, filleted pivot column and rounded 1 mm walls for cleaner, tougher prints.",
    "Clearances opened up around the lid rail, rear posts and pan servo.",
    "Trade-off: the step-up multiplies play, so pan dead band is about 8° total (Rev A was 3–4°)."
  ],

  // Honest status shown on the product page.
  // Files the buyer gets. Shown on the product page. The files themselves live in /downloads (see README).
  includes: [
    "Design & build guide (PDF, 8 pages)",
    "Full Rev B assembly (STEP)"
  ],

  notes: "You're buying the design files, not a printed gimbal. You print the parts and supply the two servos, the O4 Lite camera and M2 screws. Rev B is verified in CAD through every end stop but hasn't been flight-tested yet."
});
