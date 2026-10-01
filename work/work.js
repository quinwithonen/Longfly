/*
  Work and build log, newest first.
  Images can live in work/images/ (path "work/images/...") or point at a product's images.
  "product" links the entry to a product page (its folder name). Leave it out for standalone projects.
*/
Longfly.work([
  {
    date: "2026-09-29",
    title: "Gimbal Rev B: 281° of pan from a 9 mm servo stroke",
    image: "products/fpv-micro-gimbal/images/10_base_gear_stage_in_housing.png",
    text: "Added an 11T/18T idler and 12T output gear in the base. The 1.5 : 1 step-up takes pan from ±94° to ±141°, and the whole stage was checked in CAD at 15 pan/tilt combinations, every end stop included, with no clashes.",
    product: "fpv-micro-gimbal"
  },
  {
    date: "2026-09-29",
    title: "A 20-minute test coupon before the real print",
    image: "products/fpv-micro-gimbal/images/07_test_coupon.png",
    text: "Four small parts reproduce both rack meshes at their real centre distances, plus the M2 pilot and clearance holes. If the coupon slides cleanly, the gimbal gears will too.",
    product: "fpv-micro-gimbal"
  },
  {
    date: "2026-09-29",
    title: "Coax routing that survives full travel",
    image: "products/fpv-micro-gimbal/images/05_rear_coax_routing.png",
    text: "A 29 mm tilt loop and a 51 mm pan loop let the camera reach every end stop. The turning frame rides 2.1 mm above the lid so the 1.3 mm coax can never be pinched.",
    product: "fpv-micro-gimbal"
  }
]);
