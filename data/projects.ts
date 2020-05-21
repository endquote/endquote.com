export interface Project {
  id: string;
  title: string;
  director: boolean;
  engineer: boolean;
  experimental: boolean;
  date: Date;
  skip: number;
  subtitle: string;
  technologies: string;
  client: string;
  description: string;
  role: string;
  audio?: boolean;
}

export const projects: Project[] = [
  {
    id: "city_of_hope",
    title: "City of Hope Museum",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2017-07-01T00:00:00.000Z"),
    skip: 20,
    subtitle: "touch screens, LED effects, 3D microsite, CMS",
    technologies:
      "Node.js, JavaScript, WebGL, Chromium, openFrameworks, C++, third-party CMS",
    client:
      '<a href="https://stimulant.com/portfolio-item/city-of-hope-museum/">Stimulant</a>, for <a href="https://www.gallagherdesign.com/projects/the-city-of-hope-museum/">Gallagher & Associates</a>, for <a href="https://www.cityofhope.org/about-city-of-hope/museum">City of Hope</a>',
    description:
      'A series of exhibits on the outside and inside of a custom fiberglass form. Three touch screens present a network of related stories, each on a given theme. Stories display on top of an ambient background which is synchronized between the touch screens and the LEDs spanning the spaces between them. The meditative space within the sculpture presents a <a href="https://en.wikipedia.org/wiki/Wish_tree">wishing tree</a> rendered in realtime 3D, which is also available on the museum website. All content is editable by museum staff by via a third-party CMS installation.',
    role:
      "I coordinated a team of freelance and full-time software engineers, hardware integrators, and testers. My own tools were used for deployment and support. I was the primary technical interface between engineering, creative, and the client.",
  },
  {
    id: "intel_museum",
    title: "Intel Corporate Museum",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2016-04-01T00:00:00.000Z"),
    skip: 5,
    subtitle: "five years, ten exhibits",
    technologies:
      "Unity, Silverlight, C#, Cinder, C++, Node.js, JavaScript, depth cameras",
    client:
      '<a href="https://stimulant.com/intel-museum/">Stimulant</a>, for <a href="http://intel.com/museum/">The Intel Museum</a>',
    description:
      "We designed and implemented large series of exhibits to educate visitors on the history of Intel and the chip manufacturing process. The software platform evolved over the years, from Silverlight to Unity to Cinder. Some exhibits were augmented with presence-sensing depth cameras, physical controls and buttons, and content moderation tools.",
    role:
      "I coordinated a team of freelance and full-time software engineers, hardware integrators, and testers. My own tools were used for deployment and support, and I engineered content moderation tools. I was the primary technical interface between engineering, creative, and the client.",
  },
  {
    id: "skyspace",
    title: "OUE Skyspace LA",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2016-06-01T00:00:00.000Z"),
    skip: 7,
    subtitle: "360° projection, motion tracking, responsive lighting",
    technologies:
      "openFrameworks, C++, Node.js, JavaScript, WebGL, depth cameras",
    client:
      '<a href="http://stimulant.com/skyspace">Stimulant</a> for <a href="https://oue-skyspace.com">OUE Skyspace</a>',
    description:
      "We designed and implemented a 360° projection theater which tracked visitors via a series of cameras in the ceiling and responded with 3D animations and LED lighting. An adjacent disused elevator shaft reflected visitor silhouettes as a swirl of particles for selfies. In between, an infinity mirror lit up when guests walked on it, with custom lighting schemes for every occasion. A custom show control system tied it all together and let staff run the exhibits from a tablet.",
    role:
      "I coordinated a team of freelance and full-time software engineers, hardware integrators, and testers. My own tools were used for deployment and support, and I engineered the show control system. I was the primary technical interface between engineering, creative, and the client.",
  },
  {
    id: "db_cube",
    title: "The Microsoft Cube",
    director: true,
    engineer: false,
    experimental: true,
    date: new Date("2014-11-01T00:00:00.000Z"),
    skip: 13,
    subtitle: "audio-reactive dance installation",
    technologies: "Cinder, C++, depth cameras",
    client:
      '<a href="https://stimulant.com/dbcube-at-seattle-interactive-conference/">Stimulant</a> for <a href="https://en.wikipedia.org/wiki/Decibel_Festival">Decibel Festival</a> and <a href="https://blogs.microsoft.com/ai/microsoft-cube-decibel-dance-music/">Microsoft</a>',
    description:
      "Microsoft created a sculpture that was projected on from within, including integrated Kinect sensors on four sides. We visualized the skeletons of dancers on all sides, connecting the limbs of those on opposite sides of the cube. It was installed in the main venue of a Seattle music festival, and reacted to the audio in real-time.",
    role:
      "I managed engineering, QA, and deployment, and was the technical contact with the clients.",
  },
  {
    id: "launchpad",
    title: "Launchpad Exhibit",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2014-03-01T00:00:00.000Z"),
    skip: 16,
    subtitle: "digital mirror to inspire innovation",
    technologies: "Cinder, C++, depth cameras",
    client:
      '<a href="https://stimulant.com/portfolio-item/launchpad-exhibit-mohai/">Stimulant</a> for <a href="https://mohai.org/exhibit/bezos-center-for-innovation/">MOHAI</a>',
    description:
      "This wide-screen display is behind a mirrored surface and augmented with depth cameras, reflecting the guest's image and a particle silhouette as they approach to play with a number of mini-games that inspire innovation and collaboration.",
    role: "I managed engineering, QA, and deployment.",
  },
  {
    id: "one_world_observatory",
    title: "Visitor Map at One World Trade",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2015-06-01T00:00:00.000Z"),
    skip: 6,
    subtitle: "ticket sales mapped on a large projection",
    technologies: "Cinder, C++, Node.js, JavaScript",
    client:
      '<a href="https://stimulant.com/portfolio-item/oneworldobservatory/">Stimulant</a>, for <a href="http://thehettemagroup.com/project/one-world-observatory/">The Hettema Group</a>',
    description:
      "A 65' by 16' projection greets visitors to the tower by highlighting their origin on a 3D world map and welcoming them in their native language. The experience consists of a Cinder application running at 8k resolution and a Node.js server which gets ticket sale and scan data in real time. Millions of visitors have been tracked by the system so far.",
    role:
      "I managed the development, QA, and deployment teams, and assisted with warranty support.",
  },
  {
    id: "genentech",
    title: "Genentech Lobby Displays",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2015-09-01T00:00:00.000Z"),
    skip: 17,
    subtitle: "news and information in many form factors",
    technologies: "JavaScript",
    client:
      '<a href="https://stimulant.com/portfolio-item/gview/">Stimulant</a>, for <a href="https://gene.com">Genentech</a>',
    description:
      "This touch screen digital signage system on Genentech’s campus is running in seven building lobbies, each with a different configuration of displays and touch sensors. The content is a blend of items from Twitter, building sensors, and the company intranet.",
    role:
      "I managed the development effort, performed QA, was the main client contact during development, and performed on-site installation.",
  },
  {
    id: "prototype_retail",
    title: "Prototype Retail Space",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2017-08-01T00:00:00.000Z"),
    skip: null,
    subtitle: "physical guest tracking across digital exhibits",
    technologies:
      'Node.js, JavaScript, Unity, C#, <a href="https://quuppa.com">Quuppa BLE</a>',
    client:
      '<a href="https://stimulant.com">Stimulant</a>, for <a href="https://eightinc.com">8</a> and <a href="https://www.eleveninc.com">11</a>, for an automotive brand',
    description:
      "A high-resolution Bluetooth sensor network was installed throughout a full-scale, high-resolution mockup of a retail showroom for a major automotive brand. A series of seven touch screen exhibits guided visitors through a purchase, with BLE tracking enabling a persistent session across each one. A mobile exhibit reflected information about a vehicle as guests walked around it. Administrators could view reports and heat maps of guest journeys over time.",
    role:
      "I coordinated a team of freelance and full-time software engineers, hardware integrators, and testers. My own tools were used for deployment and support. I was the primary technical interface between engineering, creative, and the client.",
  },
  {
    id: "prototype_device",
    title: "Prototype Consumer Device",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2016-12-01T00:00:00.000Z"),
    skip: null,
    subtitle: "headset-free augmented reality",
    technologies:
      "Unity, C#, RabbitMQ, depth cameras, DSLR cameras, speech-to-text APIs",
    client:
      '<a href="https://stimulant.com/">Stimulant</a>, for a consumer electronics brand',
    description:
      "The brand's innovation team had a seed of an idea which we expanded to a physical prototype and a suite of applications to run on it. High-quality video streams from DSLR cameras were merged with depth data to create large-scale, headset-free augmented reality experiences. Users interacted with voice, touch, gesture, and mobile devices.",
    role:
      "I coordinated a team of freelance and full-time software engineers, hardware integrators, and testers. My own tools were used for deployment and support. I was the primary technical interface between engineering, creative, and the client.",
  },
  {
    id: "space_needle",
    title: "Space Needle City Explorers",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2015-03-01T00:00:00.000Z"),
    skip: 8,
    subtitle: "teleport around the city from above",
    technologies: "JavaScript",
    client:
      '<a href="https://stimulant.com/portfolio-item/space-needle/">Stimulant</a> for the <a href="https://www.spaceneedle.com">Space Needle</a>',
    description:
      "A series of touch screen kiosks which let visitors pan and zoom around a massive 360° image of Seattle, dotted with points of interest organized by category, each with copy and a slide show. A second experience teleports guests to insider locations around the city with immersive video.",
    role:
      "I managed hardware and software engineering, QA, content integration, deployment, and support.",
  },
  {
    id: "gigapixel",
    title: "Philadelphia Gigapixel Zoom",
    director: true,
    engineer: false,
    experimental: false,
    date: new Date("2015-11-01T00:00:00.000Z"),
    skip: 8,
    subtitle: "zoom into the city",
    technologies: "JavaScript",
    client:
      '<a href="https://stimulant.com">Stimulant</a>, for <a href="https://phillyfromthetop.com">Montparnasse 56</a>',
    description:
      "A series of touch screen kiosks which let visitors pan and zoom around a massive 360° image of Philadelphia. Day and night images are synced together and dotted with points of interest organized by category, each with copy and a slide show. All text and UI is available in multiple languages.",
    role:
      "I managed hardware and software engineering, QA, content integration, deployment, and support.",
  },
  {
    id: "bing",
    title: "Bing Search for Surface",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2011-04-01T00:00:00.000Z"),
    skip: 6,
    subtitle: "multi-user image search and maps",
    technologies: "WPF, C#",
    client:
      '<a href="https://stimulant.com/bing/">Stimulant</a> for <a href="https://microsoft.com">Microsoft</a>',
    description:
      "The second-generation Surface table shipped with one application, Bing. It was meant to be used in public spaces and could route visitors to a destination on a map, or provide image search results in a novel way. Multiple users could perform tasks on the same display simultaneously. The source code was eventually released and some of the UI elements were granted patents.",
    role: "I architected and implemented the application.",
  },
  {
    id: "ultrabook",
    title: "Intel Ultrabook Exhibit",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2013-11-01T00:00:00.000Z"),
    skip: 5,
    subtitle: "transparent display and projection mapping",
    technologies: "WPF, C#",
    client:
      '<a href="https://stimulant.com/portfolio-item/intel-museum-ultrabook-exhibit/">Stimulant</a> for <a href="http://intel.com/museum/">The Intel Museum</a>',
    description:
      "A transparent LCD display, a laptop behind it, and a mapped projection all display synchronized product information when visitors interact. An integrated calibration system is included to adjust the projection as needed.",
    role: "I developed the software for the exhibit.",
  },
  {
    id: "looploop",
    title: "LoopLoop for Sifteo Cubes",
    director: false,
    engineer: true,
    experimental: true,
    audio: true,
    date: new Date("2011-10-01T00:00:00.000Z"),
    skip: 4,
    subtitle: "making music with one-inch screens",
    technologies: "C#, Python",
    // dead link https://stimulant.com/portfolio-item/looploop-for-sifteo-cubes/
    client:
      '<a href="http://stimulant.com/">Stimulant</a> for <a href="https://en.wikipedia.org/wiki/Sifteo_Cubes">Sifteo</a>',
    description:
      "An experimental music sequencer which used a collection of physical cubes, each with a one-inch, 128x128 screen, and the ability to sense its neighboring devices. One cube kept the master sequence, and the others were individual instruments. This was a launch app for the Sifteo platform.",
    role:
      "I implemented the software on the devices and collaborated with the Sifteo team on their C# SDK.",
  },
  {
    id: "maxim",
    title: "Maxim Lobby Touch Wall",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2013-02-01T00:00:00.000Z"),
    skip: 5,
    subtitle: "generative effects and company info",
    technologies: "Silverlight, C#",
    client:
      '<a href="https://stimulant.com">Stimulant</a> for <a href="https://www.maximintegrated.com/">Maxim Integrated</a>',
    description:
      "A six-screen touch wall in the lobby of a chip manufacturer’s new corporate headquarters included generative and touch-reactive graphics as an ambient mode, and a playful way to navigate content describing the company’s history and products.",
    role:
      "I was the sole developer and assisted with on-site deployment and warranty support.",
  },
  {
    id: "rgbtv",
    title: "RGBTV",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2017-08-01T00:00:00.000Z"),
    skip: 0,
    subtitle: "in-home digital art display with a physical controller",
    technologies: "Node.js, JavaScript, Vue.js, MongoDB",
    client: "personal project",
    description:
      "I love digital and installation art, but wanted to enjoy it at home. I developed a digital signage system which accepts links to videos from around the web and plays them offline. Content can be grouped into channels with multiple displays playing the same or different channels. A physical rotary controller allows for seeking, skipping, muting, and displaying metadata.",
    role: "I conceived of the project, developed and deployed it.",
  },
  {
    id: "intel_ces",
    title: "Intel CES Booth",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2012-01-01T00:00:00.000Z"),
    skip: 6,
    subtitle: "object scanning and projection mapping",
    technologies: "WPF, C#, OpenCV, vvvv, Python",
    client:
      '<a href="https://stimulant.com">Stimulant</a>, for <a href="http://www.foghorncreative.com/mobile/work-intel-connect.html">Foghorn Creative</a>, for <a href="https://intel.com">Intel</a>',
    description:
      "Conference attendees could use any of six custom-made stations to scan an object. From this silhouette, a unique life form was created on a 2200 square-foot, non-uniform, projection-mapped surface, using 24 projectors.",
    role:
      "I implemented the software for the input stations, as well as health-monitoring tools for the larger installation.",
  },
  {
    id: "social_stream",
    title: "Social Stream for Surface",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2010-08-01T00:00:00.000Z"),
    skip: 5,
    subtitle: "multi-user tweets, photos, and news",
    technologies: "WPF, C#",
    client:
      '<a href="https://stimulant.com/socialstream/">Stimulant</a> for <a href="https://microsoft.com">Microsoft</a>',
    description:
      "An application which aggregates content from RSS, Twitter, and Flickr, and displays those items as an endless stream of news. Items can be pulled from the stream for closer examination and saved to a mobile device. A companion application customizes the look and content of the application for various contexts.",
    role: "I architected and implemented the application.",
  },
  {
    id: "kexp",
    title: "Radio Archive Visualization",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2011-09-01T00:00:00.000Z"),
    skip: 4,
    subtitle: "early GPU-powered web graphics",
    technologies: "JavaScript",
    client:
      '<a href="https://stimulant.com/webvizbench">Stimulant</a> for <a href="https://microsoft.com">Microsoft</a>',
    description: `Microsoft commissioned an animated visualization of <a href="https://www.kexp.org">KEXP's</a> playlist data and album art going back for years. Certain interactions could be automated, with the frame rate recorded and used to generate a GPU benchmark.`,
    role:
      "I developed the software for scraping the playlist info and displaying the visualization.",
  },
  {
    id: "xsp",
    title: "Experiential Sensing Platform",
    director: false,
    engineer: true,
    experimental: true,
    date: new Date("2018-08-01T00:00:00.000Z"),
    skip: null,
    subtitle: "technology-agnostic tracking of guest interactions",
    technologies:
      'Node.js, JavaScript, MongoDB, Redis, vue.js, <a href="https://www.zebra.com/us/en/products/location-technologies/ultra-wideband.html">Zebra UWB</a>, <a href="https://quuppa.com">Quuppa BLE</a>',
    client: '<a href="https://stimulant.com">Stimulant</a>',
    description:
      "A platform on which to build experiences which respond to guest interaction in physical space. Multiple sensing technologies including depth/RGB cameras, beacons, and UWB are aggregated into a single coordinate space and event stream. A guests' session can begin with a website click, persist when they enter a physical space, and influence immersive installations. Implemented as decoupled micro-services which can theoretically scale to an infinitely large physical space.",
    role:
      "I conceived of the project, designed the architecture, and built both the back-end services and front-end interfaces.",
  },
  {
    id: "meta_mirror",
    title: "Meta Mirror",
    director: false,
    engineer: true,
    experimental: true,
    date: new Date("2017-03-01T00:00:00.000Z"),
    skip: 15,
    subtitle: "distorted social media viewer for a festival",
    technologies:
      "Node.js, JavaScript, Canvas2D, private Instagram API, openFrameworks, C++",
    client:
      '<a href="https://stimulant.com/luminary/">Stimulant</a> for <a href="https://www.futurefires.com">Future Fires</a>',
    description:
      "Approved photos with the event's hashtag were scraped from social media and merged into a Delaunay collage before being twisted and warped into a mesh of triangles.",
    role:
      "I implemented the social media scraping and collaging software and deployed the installation.",
  },
  {
    id: "ampm",
    title: "am/pm",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2015-03-01T00:00:00.000Z"),
    skip: null,
    subtitle: "application monitoring and performance management",
    technologies: "Node.js, JavaScript",
    client: '<a href="https://stimulant.com/ampm/">Stimulant</a>',
    description:
      '<a href="https://github.com/stimulant/ampm">An open-source project</a> to perform application management and performance monitoring for Stimulant’s installation projects. The tool launches application processes, restarts them if there’s an error, and collects logging and analytics information. Deployed in many Stimulant projects and used by other agencies as well.',
    role: "I conceived of, architected, implemented, and supported the tool.",
  },
  {
    id: "wind_mobile",
    title: "WIND Mobile Retail",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2010-06-01T00:00:00.000Z"),
    skip: 25,
    subtitle: "play music and compare devices",
    technologies: "WPF, C#",
    client:
      '<a href="https://stimulant.com/wind">Stimulant</a> for WIND Mobile',
    description:
      "An in-store experience for a mobile network which let customers place mobile devices on a table to learn their details and specifications. When two devices were placed near each other, relevant specs could be compared side-by side. Info about devices as well as service plans were stored in a custom CMS and deployed to all stores nightly.",
    role: "I architected and implemented the application.",
  },
  {
    id: "ringmaster",
    title: "Ringmaster",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2016-06-01T00:00:00.000Z"),
    skip: null,
    subtitle: "automate control of hardware and software",
    technologies: "Node.js, JavaScript",
    client: '<a href="http://stimulant.com/">Stimulant</a>',
    description:
      'Ringmaster is a show control system in which hardware and software to be controlled are defined in a form of markup and organized into a hierarchy. Any number of devices such as projectors, displays, computers, and lighting controllers can be defined. A mobile-friendly dashboard displays device status and issues commands. Commands can also be issued on a schedule, and alerts can be sent automatically if things go wrong. Operated continuously for years at <a href="/project/skyspace">OUE Skyspace</a>.',
    role: "I conceived of, architected, implemented, and supported the system.",
  },
  {
    id: "db_schedule",
    title: "Decibel Festival Digital Schedule",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2013-09-01T00:00:00.000Z"),
    skip: 6,
    subtitle: "reactive visuals, social media, and show times",
    technologies: "JavaScript",
    client:
      '<a href="https://stimulant.com/portfolio-item/decibel-festival-digital-schedule/">Stimulant</a> for <a href="https://en.wikipedia.org/wiki/Decibel_Festival">Decibel Festival</a>',
    description:
      "Deployed across multiple venues during a Seattle music festival, the signage displayed upcoming performance schedules and social media content scraped from the web. Organizers could inject announcements as the event went on. A series of generative backgrounds reacted in realtime to the music.",
    role: "I conceived of the project and implemented all software components.",
  },
  {
    id: "touchtones",
    title: "TouchTones",
    director: false,
    engineer: true,
    experimental: true,
    date: new Date("2010-03-01T00:00:00.000Z"),
    skip: 7,
    subtitle: "multi-user musical instrument",
    technologies: "WPF, C#",
    client: '<a href="http://stimulant.com/touchtones">Stimulant</a>',
    description:
      "An experimental sequencer for the original Microsoft Surface table, where up to four users can make music together on four instruments distributed across four octaves, all playing to a master tempo. Released as freeware and exhibited at several events.",
    role: "I conceived of, architected, and implemented the application.",
  },
  {
    id: "surface_launch",
    title: "Original Surface Prototypes",
    director: false,
    engineer: true,
    experimental: true,
    date: new Date("2007-04-01T00:00:00.000Z"),
    skip: 193,
    subtitle: "multitouch before iPhone",
    technologies: "Flash, ActionScript",
    client: '<a href="https://microsoft.com">Microsoft</a>',
    description:
      'I spent time at Microsoft, working on the as-yet-unannounced <a href="https://en.wikipedia.org/wiki/Microsoft_PixelSense">Microsoft Surface touch table</a> product. I was in the Surface design studio and, without an official SDK, developed a number of high-polish proof of concept apps envisioning retail and restaurant scenarios which were presented by Bill Gates on the Today Show and Steve Ballmer at the D5 conference in 2007.',
    role:
      "I architected and implemented several applications using internal SDKs.",
  },
  {
    id: "tuva",
    title: "Project Tuva",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2009-07-01T00:00:00.000Z"),
    skip: 4,
    subtitle: "study tools for Feynman's lectures",
    technologies: "Silverlight, C#",
    client:
      '<a href="https://stimulant.com/tuva">Stimulant</a> for <a href="http://research.microsoft.com/tuva">Microsoft</a>',
    description:
      "An interactive video experience which annotates lectures with images, links, and transcripts. Students can save their progress through the videos as well as take time-synced notes within the application. The project launched with Richard Feynman’s Messenger Series lectures, a cornerstone set of seven talks at Cornell University in 1964.",
    role: "I architected and implemented the application.",
  },
  {
    id: "local_impact_map",
    title: "Local Impact Map",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2010-07-01T00:00:00.000Z"),
    skip: 5,
    subtitle: "a zooming lens into a world map",
    technologies: "WPF, C#",
    client:
      '<a href="https://stimulant.com/portfolio-item/microsoft-local-impact-map/">Stimulant</a> for <a href="https://microsoft.com">Microsoft</a>',
    description:
      "A touch table application which displayed stories about Microsoft’s global philanthropic efforts on a world map. The application uses a novel “lens” based UI to give multiple people the ability to explore stories and data visualizations simultaneously.",
    role: "I architected and implemented the application.",
  },
  {
    id: "insite_studio",
    title: "SAP InSite Studio",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2010-02-01T00:00:00.000Z"),
    skip: 10,
    subtitle: "multi-application screen sharing",
    technologies: "WPF, C#",
    client:
      '<a href="https://stimulant.com/portfolio-item/sap-insite-studio/">Stimulant</a> for <a href="https://www.sap.com/">SAP</a>',
    description:
      "An application which used low-level Windows graphics APIs to display a multi-touch application switcher. The tool was used to allow meeting participants to queue up content and literally throw applications, websites, and other documents onto one of three massive shared screens, controlled by a Cisco CTS3000 Telepresence Suite.",
    role: "I architected and implemented the application.",
  },
  {
    id: "xray",
    title: "XRay",
    director: false,
    engineer: true,
    experimental: true,
    date: new Date("2009-01-01T00:00:00.000Z"),
    skip: 8,
    subtitle: "synchronized mobile displays",
    technologies: "WPF, C#, JavaScript",
    client:
      '<a href="https://stimulant.com/from-the-labs-xray-integrates-apple-iphone-and-microsoft-surface/">Stimulant</a>',
    description:
      "An experiment in using mobile displays as lenses into the content on a larger fixed display. When a mobile phone is placed on the table top, it's detected and sent an image representing an alternative view of the content displayed beneath it. Multiple simultaneous devices are supported.",
    role: "I conceived of, architected, and implemented the application.",
  },
  {
    id: "balance_bubbles",
    title: "Balance Bubbles",
    director: false,
    engineer: true,
    experimental: true,
    date: new Date("2008-10-01T00:00:00.000Z"),
    skip: 8,
    subtitle: "weird, tangible physics",
    technologies: "WPF, C#",
    client:
      '<a href="https://stimulant.com/from-the-labs-pressure-sensitive-surface/">Stimulant</a>',
    description:
      'An original <a href="https://en.wikipedia.org/wiki/Microsoft_PixelSense">Surface table</a> was modified to sit on top of a <a href="https://en.wikipedia.org/wiki/Wii_Balance_Board">Wii Balance Board</a> and connected via a reverse-engineered protocol. Weight on the edges of the table was detected by the scale and added forces to a physics simulation on the display.',
    role: "I conceived of, architected, and implemented the application.",
  },
  {
    id: "kodak",
    title: "Kodak Product Explorer",
    director: false,
    engineer: true,
    experimental: false,
    date: new Date("2009-06-01T00:00:00.000Z"),
    skip: 5,
    subtitle: "object recognition on the show floor",
    technologies: "WPF, C#",
    client:
      '<a href="https://stimulant.com/portfolio-item/kodak-product-explorer/">Stimulant</a>, for <a href="http://obscuradigital.com">Obscura Digital</a>, for <a href="http://kodak.com">Kodak</a>',
    description:
      "Examples of the output of Kodak industrial printers were placed on an interactive table, detected, and surrounded with more information about how they were produced.",
    role: "I architected and implemented the application.",
  },
];

function trim(p) {
  return { id: p.id, title: p.title, subtitle: p.subtitle };
}

export const index = projects.map((p) => {
  return {
    id: p.id,
    title: p.title,
  };
});

export const director = projects.filter((p) => p.director).map((p) => trim(p));

export const directorFeatured = projects
  .filter(
    (p) => ["city_of_hope", "intel_museum", "skyspace"].indexOf(p.id) !== -1
  )
  .map((p) => trim(p));

export const engineer = projects.filter((p) => p.engineer).map((p) => trim(p));

export const engineerFeatured = projects
  .filter((p) => ["bing", "ultrabook", "looploop"].indexOf(p.id) !== -1)
  .map((p) => trim(p));

export const featured = {
  director: directorFeatured,
  engineer: engineerFeatured,
};

export function query(id) {
  return projects.find((p) => p.id === id);
}
