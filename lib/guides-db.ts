// lib/guides-db.ts
// Real Pure Electric Repair Guides

export const guidesData = {
  'e3-display-error': {
    id: 'e3-display-error',
    title: "Display Screen Replacement (E3 Error Fix)",
    model: "Air 3 to Air 5 Pro",
    difficulty: "Medium",
    time: "5-8 mins",
    category: "Electronics",
    description: "VCU Display replacement procedure for E3 communication error and power-on issues.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", 
    
    tools: [
      { name: "Flathead Screwdriver", icon: "🔧" },
      { name: "Heat Shrink Cutter", icon: "✂️" },
      { name: "Heat Gun", icon: "🔥" },
      { name: "Protective Gloves", icon: "🧤" }
    ],

    parts: [
      { name: "VCU Display Screen", sku: "PSPUR0034-0001", image: "placeholder" },
      { name: "Heat Shrink Tubing", sku: "CONSUMABLE", image: "placeholder" },
      { name: "Waterproof Rubber Band", sku: "PSPUR-SEAL", image: "placeholder" }
    ],

    steps: [
      {
        order: 1,
        title: "Remove Display Screen",
        desc: "Put the flathead screwdriver between screen and stem and take off screen.",
        tools: "Flathead screwdriver",
        image: "placeholder"
      },
      {
        order: 2,
        title: "Disconnect All Cables",
        desc: "There are five cables on display, unplug all of them. Throttle and brake lever cables are with heat shrink. Cut heat shrink with cutter.",
        tools: "Heat shrink cutter",
        warning: "Wear gloves to protect your hands from sharp edges.",
        image: "placeholder"
      },
      {
        order: 3,
        title: "Remove Old Display & Install New One",
        desc: "Pull out the display from the stem, then put new display in.",
        tip: "There is a grommet at the bottom of the stem - it is needed to put it back properly.",
        parts: "Display screen",
        image: "placeholder"
      },
      {
        order: 4,
        title: "Connect All Cables",
        desc: "All plugs are different types - if it's not correct, you cannot plug them. Plug them all in.",
        tip: "There are two indicator plugs that are the same type, but red color is RIGHT and white is LEFT.",
        image: "placeholder"
      },
      {
        order: 5,
        title: "Seal Throttle & Brake Connections",
        desc: "Throttle and brake plugs need heat shrink to protect from water.",
        tools: "Heat gun",
        parts: "Heat shrink",
        image: "placeholder"
      },
      {
        order: 6,
        title: "Final Assembly",
        desc: "Put a waterproof rubber band on display screen and put it back into the stem.",
        parts: "Rubber band",
        warning: "Don't forget the heat shrink and gasket rubber bands - common mistake!",
        image: "placeholder"
      }
    ]
  },

  'e2-throttle-error': {
    id: 'e2-throttle-error',
    title: "Throttle Replacement (E2/F2 Error Fix)",
    model: "Air 3 to Air 5 Pro",
    difficulty: "Hard",
    time: "10-13 mins",
    category: "Controls",
    description: "Complete throttle replacement procedure for E2/F2 throttle errors with cable routing.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",

    tools: [
      { name: "Small Flathead Screwdriver", icon: "🔧" },
      { name: "Hex Key 2mm", icon: "🔩" },
      { name: "Hex Key 3mm", icon: "🔩" },
      { name: "Small Hook Tool", icon: "🪝" }
    ],

    parts: [
      { name: "Throttle (Metal Core)", sku: "PSPUR0031-0002", image: "placeholder" }
    ],

    steps: [
      {
        order: 1,
        title: "Open Display Screen",
        desc: "Use small flathead screwdriver to open the display screen cover.",
        tools: "Small flathead",
        image: "placeholder"
      },
      {
        order: 2,
        title: "Separate Cables from Grommet",
        desc: "Separate the throttle and right indicator cable from the cable organizing grommet.",
        tip: "Usually the far right two cables.",
        image: "placeholder"
      },
      {
        order: 3,
        title: "Remove Indicator Cover",
        desc: "Remove the indicator cover using flathead screwdriver.",
        tools: "Flathead",
        image: "placeholder"
      },
      {
        order: 4,
        title: "Remove Right Indicator",
        desc: "Unbolt 3 bolts and pull out the cable.",
        tools: "Hex 2mm",
        tip: "Keep the bolts safe - you'll need them for reassembly.",
        image: "placeholder"
      },
      {
        order: 5,
        title: "Remove Hand Grip",
        desc: "Pull it out from the handlebar.",
        tip: "May need to twist while pulling if it's tight.",
        image: "placeholder"
      },
      {
        order: 6,
        title: "Remove Old Throttle",
        desc: "Just loosen the bolt to remove the throttle.",
        tools: "Hex 3mm",
        image: "placeholder"
      },
      {
        order: 7,
        title: "Install New Throttle Cable",
        desc: "Put the cable into the front hole, take the cable out by using the small hook tool, then tighten the bolt enough.",
        tools: "Small hook, Hex 3mm",
        warning: "This is the tricky part - use the hook to grab the cable loop inside the stem.",
        parts: "New throttle (Metal core)",
        image: "placeholder"
      },
      {
        order: 8,
        title: "Reinstall Hand Grip",
        desc: "Put the handgrip back onto the handlebar.",
        image: "placeholder"
      },
      {
        order: 9,
        title: "Reinstall Right Indicator",
        desc: "Put the cable into the big hole, take the cable out by using the hook tool.",
        tools: "Small hook",
        image: "placeholder"
      },
      {
        order: 10,
        title: "Replace Indicator Cover",
        desc: "Put the indicator cover back.",
        warning: "Do not cover the reflection line on indicator.",
        image: "placeholder"
      },
      {
        order: 11,
        title: "Final Cable Management",
        desc: "Put the indicator and throttle cable back into the cable organizing grommet.",
        tip: "Indicator cable should be far right and throttle cable next to it.",
        warning: "COMMON MISTAKE: Don't forget to tighten the throttle screw back and put the indicator first before handgrip!",
        image: "placeholder"
      }
    ]
  }
};
