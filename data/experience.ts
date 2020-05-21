import { DateTime } from "luxon";

export interface Role {
  company?: string;
  title: string;
  location: string;
  start: DateTime;
  end?: DateTime;
  role: string;
  accomplishments: string[];
}

export const skills: string[] = [
  "recruiting and management of engineering employees, contractors, and vendors",
  "front-end and behind-the-scenes software development with a modern web stack",
  "project concepting, scoping and estimation",
  "technology selection and systems architecture",
  "technical project management",
  "design and implementation of QA and CI/CD processes",
];

export const experience: Role[] = [
  {
    company: '<a href="https://www.playstation.com/en-us/">PlayStation</a>',
    title: "Senior Manager, Design Technology",
    location: "San Francisco, CA",
    start: DateTime.fromISO("2020-05-01T00:00:00.000Z"),
    role:
      "Building teams, tools, and processes that help the UX group at PlayStation push the boundaries of play.",
    accomplishments: [],
  },
  {
    company:
      '<a href="https://vimeo.com/obscuradigital">Obscura Digital</a> (acquired by <a href="https://www.msg.com/obscura-digital">Madison Square Garden</a>)',
    title: "Director of Systems",
    location: "San Francisco, CA",
    start: DateTime.fromISO("2018-07-01T00:00:00.000Z"),
    end: DateTime.fromISO("2019-09-20T00:00:00.000Z"),
    role:
      'Led a distributed team that designed and implemented hardware platforms behind large-scale immersive experiences for agency clients and <a href="https://www.msgsphere.com">MSG Sphere</a>.',
    accomplishments: [
      "Directed the production of playback systems for high-resolution video content using projection, LED, and traditional displays.",
      "Created and managed a team to build an ingestion and rendering pipeline to handle super-resolution content in a hybrid on-premises/cloud infrastructure.",
      "Negotiated multiple $1M+ vendor agreements for hardware and software.",
      "Managed a team that provided external and internal customer support for large-format video installations and custom VR tools.",
    ],
  },
  {
    company: '<a href="https://stimulant.com/">Stimulant</a>',
    title: "Technical Director",
    location: "San Francisco, CA",
    start: DateTime.fromISO("2010-04-01T00:00:00.000Z"),
    end: DateTime.fromISO("2018-04-01T00:00:00.000Z"),
    role:
      "Managed all technical disciplines of a digital agency across multiple offices, including software development, systems engineering, QA, deployment, and support. Deployed projects in the US, Europe, Asia, and Middle East.",
    accomplishments: [
      "Recruited engineering staff, freelancers, and vendors, converging a broad set of capabilities to apply to client projects.",
      "Collaborated with sales and design teams to translate project requirements into realistic timelines and budgets which landed client engagements.",
      "Implemented standards for developing, testing, deploying, supporting, and documenting projects, ensuring robustness and 24/7 operation.",
      "Promoted R&D of environmental sensing technologies based on Bluetooth, RFID, ultra-wideband, and computer vision, which enabled interaction beyond touchscreens.",
      'Built monitoring and show-control tools like <a href="/project/ampm">am/pm</a>, <a href="/project/ringmaster">Ringmaster</a>, and <a href="/project/xsp">XSP</a> to ensure continuous operation and reduce repetitive engineering tasks.',
      'Directed the engineering behind immersive projects at <a href="/project/one_world_observatory">One World Observatory</a>, <a href="/project/genentech">Genentech</a>, <a href="/project/skyspace">OUE Skyspace</a>, and <a href="/director">more</a>, which have run continuously for years.',
    ],
  },
  {
    title: "Lead Engineer",
    location: "Seattle, WA",
    start: DateTime.fromISO("2008-04-01T00:00:00.000Z"),
    end: DateTime.fromISO("2010-04-01T00:00:00.000Z"),
    role:
      'Co-founded a digital agency focused on emerging multi-user natural interaction paradigms. Implemented <a href="/engineer">novel user interfaces</a> using emerging hardware and software technologies.',
    accomplishments: [
      'Architected and implemented production applications for Microsoft like <a href="/project/bing">Bing for Surface</a>, <a href="/project/local_impact_map">Local Impact Map</a>, and <a href="/project/tuva">Project Tuva</a>.',
      'Developed R&D projects and experiments like <a href="/project/touchtones">TouchTones</a>, <a href="/project/xray">XRay</a>, and <a href="/project/looploop">LoopLoop</a>.',
    ],
  },
  {
    company: '<a href="https://microsoft.com">Microsoft</a>',
    title: "Lead Engineer",
    location: "Redmond, WA",
    start: DateTime.fromISO("2006-05-01T00:00:00.000Z"),
    end: DateTime.fromISO("2007-05-01T00:00:00.000Z"),
    role:
      'Architected and implemented <a href="/project/surface_launch">high-polish demo applications</a> for the not-yet-announced <a href="https://en.wikipedia.org/wiki/Microsoft_PixelSense">Microsoft Surface touch table</a> as a contractor.',
    accomplishments: [
      "Embedded with the design team to translate static design comps into fluid, functioning software.",
      "Created bulletproof and flexible applications on prototype hardware and a rudimentary software toolkit.",
    ],
  },
];

export const additional: Role[] = [
  {
    company: '<a href="https://endquote.com">Endquote</a>',
    title: "Owner, Software Engineer",
    location: "Seattle, WA",
    start: DateTime.fromISO("2005-09-01T00:00:00.000Z"),
    end: DateTime.fromISO("2008-04-01T00:00:00.000Z"),
    role:
      "Worked as a freelance developer for digital agencies, leading front-end development of interactive web projects.",
    accomplishments: [
      'Implemented projects with agencies like <a href="https://www.possible.com">POSSIBLE</a>, <a href="http://secondstory.com">Second Story</a>, and <a href="http://www.bwco.info">Belle & Wissell</a>.',
      "Worked with clients like Microsoft, Starbucks, Comcast, The Smithsonian, Seattle University, and the University of Washington.",
      "Navigated the challenges of running a small business, including legal and financial concerns.",
    ],
  },
  {
    company: '<a href="https://smashingideas.com">Smashing Ideas</a>',
    title: "Software Engineer",
    location: "Seattle, WA",
    start: DateTime.fromISO("2003-01-01T00:00:00.000Z"),
    end: DateTime.fromISO("2005-10-01T00:00:00.000Z"),
    role:
      "Led the engineering of web-based interactive and gaming projects for clients such as Adobe, Disney, Nintendo, and Nickelodeon.",
    accomplishments: [],
  },
  {
    company: "Saltmine",
    title: "Software Engineer",
    location: "Seattle, WA",
    start: DateTime.fromISO("1999-01-01T00:00:00.000Z"),
    end: DateTime.fromISO("2003-01-01T00:00:00.000Z"),
    role:
      "Led the development of web projects for clients such as Microsoft, Seattle's Best Coffee, Washington Mutual, and AT&T that pushed the boundaries of the web at the time.",
    accomplishments: [],
  },
  {
    company: '<a href="https://real.com">Real Networks</a>',
    title: "Intern, Web Developer",
    location: "Seattle, WA",
    start: DateTime.fromISO("1998-06-01T00:00:00.000Z"),
    end: DateTime.fromISO("1998-08-30T00:00:00.000Z"),
    role:
      "Built marketing content for the high-traffic real.com site using the limited capabilities of early-generation browsers.",
    accomplishments: [],
  },
];

export const education: Role[] = [
  {
    company: "Art Institute of Seattle",
    title: "AA in Multimedia",
    location: "Seattle, WA",
    start: DateTime.fromISO("1997-06-01T00:00:00.000Z"),
    end: DateTime.fromISO("1999-01-01T00:00:00.000Z"),
    role:
      '"Multimedia" was defined literally in this program to include painting, drawing, lighting, video and audio production, typography, graphic design, and computer programming.',
    accomplishments: [],
  },
];

export interface Volunteer {
  entity: string;
  link: string;
  location: string;
  list: { date: DateTime; role: string }[];
}

export const volunteering: Volunteer[] = [
  {
    entity: "CODAME",
    link: "http://codame.com",
    location: "San Francisco, CA",
    list: [
      {
        date: DateTime.fromISO("2018-03-01T00:00:00.000Z"),
        role:
          'Recruited and managed volunteers for various art+tech events, from small workshops to one-night events to a <a href="https://festival.codame.com">multi-day festival and conference</a>',
      },
      {
        date: DateTime.fromISO("2016-11-01T00:00:00.000Z"),
        role:
          'Assisted in various roles at the "<a href="https://www.facebook.com/events/172984059815354/">Artificial Experiences</a>" event',
      },
    ],
  },
  {
    entity: "Future Fires",
    link: "http://www.futurefires.com",
    location: "San Francisco, CA",
    list: [
      {
        date: DateTime.fromISO("2017-03-01T00:00:00.000Z"),
        role: `Produced "<a href="/project/meta_mirror">Meta Mirror</a>", a projection piece at the "Luminary" event`,
      },
    ],
  },
  {
    entity: "Gray Area Foundation For The Arts",
    link: "http://grayarea.org",
    location: "San Francisco, CA",
    list: [
      {
        date: DateTime.fromISO("2016-04-01T00:00:00.000Z"),
        role:
          'Assisted in various roles at the <a href="http://gafest2016.wpengine.com/">2016 Gray Area Festival</a>',
      },
    ],
  },
];

export interface Honor {
  title: string;
  date: DateTime;
  entity: string;
  description: string;
}

export const honors: Honor[] = [
  {
    title: "Feature, Communication Arts Design Annual 2016",
    date: DateTime.fromISO("2016-08-01T00:00:00.000Z"),
    entity: "Communication Arts",
    description:
      'Stimulant was chosen as the subject for <a href="http://www.commarts.com/features/stimulant">an in-depth feature in Communication Arts</a>, an honor given to a single agency each year.',
  },
  {
    title: "Seattle Interactive Conference Session",
    date: DateTime.fromISO("2014-10-01T00:00:00.000Z"),
    entity: "Seattle Interactive Conference",
    description: `Participated in a panel discussion with other designers and developers of the <a href="/project/db_cube">Microsoft Cube</a> installation which was exhibited at the conference.`,
  },
  {
    title: "MIX 11 Session",
    date: DateTime.fromISO("2011-04-01T00:00:00.000Z"),
    entity: "Microsoft",
    description:
      "Participated in a panel discussion at the Microsoft MIX conference on the future of natural user interfaces.",
  },
  {
    title: "Microsoft Surface MVP",
    date: DateTime.fromISO("2011-01-01T00:00:00.000Z"),
    entity: "Microsoft",
    description:
      'Included in the <a href="https://mvp.microsoft.com/">Microsoft MVP program</a> under the Surface discipline, first awarded in 2011 and renewed in 2012 and 2013.',
  },
  {
    title: "US Patent 8775973B2",
    date: DateTime.fromObject({ year: 2011 }),
    entity: "Microsoft",
    description: `Issued for the <a href="http://www.google.com/patents/US8775973B2">image browsing interface</a> in <a href="/project/bing">the Bing application</a> that Stimulant developed for the Microsoft Surface table.`,
  },
];

export interface Award {
  project: string;
  list: { title: string; date: DateTime; entity: string }[];
}

export const awards: Award[] = [
  {
    project: "skyspace",
    list: [
      {
        title: "Design Award (Merit)",
        date: DateTime.fromObject({ year: 2017 }),
        entity: "How Interactive",
      },
      {
        title:
          '<a href="https://www.horizoninteractiveawards.com/kiosk-awards/2016/">Interactive Award, Gold</a>',
        date: DateTime.fromObject({ year: 2016 }),
        entity: "Horizon Interactive Awards",
      },
      {
        title:
          '<a href="https://thefwa.com/cases/skyspace-la-immersive-experiences">The FWA of the Day</a>',
        date: DateTime.fromObject({ year: 2016 }),
        entity: "The FWA",
      },
    ],
  },
  {
    project: "one_world_observatory",
    list: [
      {
        title:
          '<a href="http://www.teaconnect.org/Thea-Awards/Past-Awards/index.cfm?id=6301&redirect=y">Thea Awards for Outstanding Achievement</a>',
        date: DateTime.fromObject({ year: 2015 }),
        entity: "Themed Entertainment Association",
      },
    ],
  },
  {
    project: "bing",
    list: [
      {
        title: "Merit Award",
        date: DateTime.fromObject({ year: 2013 }),
        entity: "How Interactive Design Awards",
      },
    ],
  },
  {
    project: "ultrabook",
    list: [
      {
        title: "Best Museum Environment (Gold)",
        date: DateTime.fromObject({ year: 2013 }),
        entity: "Event Design Awards",
      },
    ],
  },
  {
    project: "looploop",
    list: [
      {
        title: "Merit Award",
        date: DateTime.fromObject({ year: 2013 }),
        entity: "How Interactive Design Awards",
      },
      {
        title:
          '<a href="http://awards.ixda.org/entry/2012/looploop/">Winner "Best in Category, Expressing" and "Best in Show"</a>',
        date: DateTime.fromObject({ year: 2012 }),
        entity: "IxDA Interaction Awards",
      },
    ],
  },
  {
    project: "intel_ces",
    list: [
      {
        title: "Best Tradeshow Exhibit (Gold)",
        date: DateTime.fromObject({ year: 2013 }),
        entity: "Event Marketer Ex Awards",
      },
      {
        title: "Best Use of Technology (Gold)",
        date: DateTime.fromObject({ year: 2013 }),
        entity: "Event Design Awards",
      },
      {
        title: "Merit Award",
        date: DateTime.fromObject({ year: 2013 }),
        entity: "How Interactive Design Awards",
      },
      {
        title: "Experiential Exhibits (Gold)",
        date: DateTime.fromObject({ year: 2012 }),
        entity: "Exhibit Design Awards",
      },
      {
        title: "Best Use of a Single Technology (Silver)",
        date: DateTime.fromObject({ year: 2012 }),
        entity: "Event Technology Awards",
      },
    ],
  },
];
