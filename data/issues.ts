import clone from "clone";

export interface IssueDef {
  id: number;
  date: Date;
  title: string;
  intro: string;
  summary: string;
  draft?: boolean;
  links: { id: string; title: string; link: string; summary: string }[];
}

const issueDefs: IssueDef[] = [
  {
    id: 1,
    date: new Date("2019-11-07T00:00:00.000Z"),
    title: "Creative Tech #1: The Robot Takeover",
    intro:
      'Welcome to the first issue of the Creative Technology newsletter, which you signed up for at <a href="https://endquote.com/">endquote.com</a>, or you got signed up for because you\'ve been in touch with Josh Santangelo recently. This issue features three different projects that use robot arms, which is pure coincidence and not a marketing tie-in to the new Terminator movie.',
    summary:
      "This issue features three different projects that use robot arms, which is pure coincidence and not a marketing tie-in to the new Terminator movie.",
    links: [
      {
        id: "border-tuner",
        title: "Border Tuner",
        link: "https://www.bordertuner.net/",
        summary:
          "An interactive light installation illustrates connections across the US/Mexico border in dramatic style",
      },
      {
        id: "apologue-2047",
        title: "Apologue 2047",
        link: "https://vimeo.com/368477230",
        summary:
          "WHITEVOID brings a constellation of kinetic triangular displays to a Beijing performance",
      },
      {
        id: "paper-phone",
        title: "Paper Phone",
        link: "http://specialprojects.studio/project/paper-phone/",
        summary:
          "Everything you need in your pocket, with infinite battery life",
      },
      {
        id: "mona-lisa-vr",
        title: "Mona Lisa: Beyond the Glass",
        link: "https://youtu.be/Au_UpzhzHwk",
        summary:
          'The Louvre\'s huge Leonardo exhibit replaces the painting with a VR exhibit by <a href="http://www.emissive.fr/en/project/monalisa/">Emissive</a> and <a href="https://arts.vive.com/us/articles/projects/art-photography/mona_lisa_beyond_the_glass/">Vive Arts</a>',
      },
      {
        id: "rag-and-bone",
        title: "Rag and Bone at NYFW",
        link:
          "https://www.microsoft.com/inculture/fashion/rag-bone-fashion-week/",
        summary:
          'Kinect Azure cameras on robotic arms amplify the movements of models and dancers, don\'t miss <a href="https://vimeo.com/368535088">the BTS video</a>',
      },
      {
        id: "44-montgomery",
        title: "44 Montgomery St in SF",
        link: "https://esidesign.com/work/44-montgomery-street-san-francisco/",
        summary:
          "A subtle, reactive lighting installation in an SF office lobby",
      },
      {
        id: "symulakra",
        title: "Symulakra Digital Sculpture",
        link: "https://pangenerator.com/projects/symulakra/",
        summary: "A data-driven, user-generated, five-story artwork in Warsaw",
      },
      {
        id: "what-you-dont-know",
        title: "What You Don't Know",
        link: "https://www.with.in/watch/what-you-dont-know",
        summary:
          'Remix the new Matthew Dear track in WebVR, then play with the <a href="https://twitter.com/jonobr1/status/1187047778624724992">early prototypes and source</a>',
      },
      {
        id: "sonic-arms",
        title: "Sonic Arms",
        link: "http://ultraviolet.to/portfolio/sonic-arms/",
        summary: "A dance of robotic arms, lights and images in Rome",
      },
      {
        id: "spleeter",
        title: "Extract Audio Stems with Machine Learning",
        link:
          "https://waxy.org/2019/11/fast-and-free-music-separation-with-deezers-machine-learning-library/",
        summary:
          "Pull separate vocal and instrumental tracks from finished songs for remixing",
      },
      {
        id: "notch-path-tracing",
        title: "Notch 0.9.23 Adds Path Tracing",
        link:
          "https://medium.com/notchblog/path-tracing-explained-7cf629927c4e",
        summary: "The popular visuals package delivers more realistic graphics",
      },
      {
        id: "lightform-lf2",
        title: "Lightform's Second Generation",
        link: "https://lightform.com",
        summary:
          "Lightform's easy-to-use projection mapping tools get an upgrade, now combining the camera, projector, and compute into a single unit",
      },
      {
        id: "lumen-prize-2019",
        title: "Lumen Prize 2019 Winners",
        link: "https://lumenprize.com/edition/2019-winners/",
        summary:
          "The Lumen Prize for Art and Technology recognizes Refik Anadol, Sougwen Chung, Maja Petric, and more",
      },
      {
        id: "ai-art",
        title: "AI in Art, from 1895 to Today",
        link:
          "https://lareviewofbooks.org/article/ghost-hands-player-pianos-and-the-hidden-history-of-ai/",
        summary:
          "Vanessa Chang discusses the role of unseen intelligence in art, from player pianos to current fads",
      },
    ],
  },
  {
    id: 2,
    date: new Date("2019-12-10T00:00:00.000Z"),
    title: "Creative Tech #2: Reality Reproduction",
    intro:
      'This batch of inspiration is being prepared from the exit row of flight AA2421 as I transition from the 75-and-analog world of Miami Art Week back to the 57-and-digital kingdom of San Francisco. The trip wasn\'t very "creative tech", so I\'m posting some of my favorite artwork from Miami <a href="https://www.instagram.com/endquote/">on Instagram</a>. For the newsletter we have some new photogrammetry projects, a killer device to for glasses-free 3D, and a couple of longer reads to settle into during your holiday break.',
    summary:
      "For the newsletter we have some new photogrammetry projects, a killer device to for glasses-free 3D, and a couple of longer reads to settle into during your holiday break.",
    links: [
      {
        id: "alivia-and-the-dark-evil",
        title: "Alivia and the Dark Evil",
        link: "https://vimeo.com/376143000",
        summary:
          'An incredible immersive show in Jakarta with super-tight interaction between acrobatic performers and media. <a href="https://vimeo.com/377801377">A little more BTS here</a>, but I\'d love more technical detail.',
      },
      {
        id: "looking-glass",
        title: "Looking Glass 8k",
        link: "https://lookingglassfactory.com/product/8k",
        summary:
          "The magicians at Looking Glass have scaled up their holographic display to make it even better for multi-user glasses-free viewing of 3D content.",
      },
      {
        id: "wedding-photogrammetry",
        title: "Wedding Photogrammetry",
        link:
          "https://medium.com/@LisbethKaufman/the-collaborative-hologram-turn-your-wedding-guests-into-artists-53e6ac44a215",
        summary:
          "Your wedding guests are snapping pics anyway, so use photogrammetry to build a model from the images. Then your grandkids can attend the ceremony via their embedded VR implants in 2050.",
      },
      {
        id: "display-land",
        title: "Display.land",
        link:
          "https://medium.com/ubiquity6/welcome-to-display-land-5f0014cb5d51?",
        summary:
          "Also on the photogrammetry thread, use a single phone to capture models of objects, buildings, or city blocks to explore later in VR, or on that Looking Glass you put on your wedding registry.",
      },
      {
        id: "runway-palette",
        title: "Runway Palette",
        link: "https://artsexperiments.withgoogle.com/runwaypalette",
        summary:
          "A visualization of the colors chosen by fashion designers across 144k looks in recent shows. This made me cry because it's so beautiful, and also because I had a similar idea years ago but never pursued it. Don't miss <a href=\"https://twitter.com/cyrildiagne/status/1199016232818823169\">the technical BTS thread</a>.",
      },
      {
        id: "technology-garden",
        title: "IBM Technology Garden",
        link: "http://variable.io/ibm-technology-garden/",
        summary:
          'This visualization of the massive dataset tracked by IBM at Wimbledon is pretty, but even better is the <a href="https://notes.variable.io/case-study-ibm-technology-garden-3a4f0b274de5">super deep dive</a> into the process of designing and building it with WebGL tools that we\'ll soon get to try out too.',
      },
      {
        id: "teachable-machine",
        title: "Teachable Machine 2",
        link: "https://teachablemachine.withgoogle.com",
        summary:
          "Using machine learning for interaction and identification can be hard to ramp up on, but Teachable Machine has been upgraded to help classify images, sounds, and poses in a way that integrates quickly with popular frameworks.",
      },
      {
        id: "kyle-machine-learning",
        title: "The Limits of Learning",
        link: "https://youtu.be/kWvHjp8vifM",
        summary:
          "If you want to explore machine learning but don't know where to start, this talk by Kyle McDonald is an excellent survey of what the tools are good at and how to get into them. Bookmark this to cuddle up with over your holiday break.",
      },
    ],
  },
  {
    id: 3,
    date: new Date("2020-01-15T00:00:00.000Z"),
    title: "Creative Tech #3: Making Music with Cameras",
    intro:
      "Happy new year from San Francisco. I hope you're all rested and inspired to make amazing things in 2020. This time the list is a bit shorter and more experimental, with a couple of projects that use computer vision to create music and sound.",
    summary:
      "This time the list is a bit shorter and more experimental, with a couple of projects that use computer vision to create music and sound.",
    links: [
      {
        id: "concentric-circles",
        title: "Concentric Circles",
        link: "https://www.brettbolton.net/avshows",
        summary:
          "A simple drum head becomes a more layered instrument and a visual canvas with projection mapping, optical drumstick tracking, and custom software.",
      },
      {
        id: "rollpapersynth",
        title: "RollpaperSynth",
        link: "https://vimeo.com/381152333",
        summary:
          "Any sort of drawing becomes a musical score in this experiment where a long scroll rolls past a camera which translates the image into audio.",
      },
      {
        id: "wave-frames",
        title: "Wave Frames",
        link: "http://teamvoid.net/index.php/project/wave-frames/",
        summary:
          "26 layers of physical shapes are distorted to create complex patterns and illusions, no screens required.",
      },
      {
        id: "timeplusplus",
        title: "time++",
        link: "http://ravenkwok.com/time/",
        summary:
          "I love this playful clock visualization, but the scale and the constant ticking are also a bit ominous and stressful.",
      },
    ],
  },
  {
    id: 4,
    date: new Date("2020-02-18T00:00:00.000Z"),
    title: "Creative Tech #4: AR Inevitable?",
    intro:
      'It seems too soon to be publishing a fourth issue, yet here we are. Please <a href="http://endquote.com/issue/4">tell a friend</a>, <a href="mailto:josh@endquote.com">write in</a> to suggest a link, or point out the typo I left in just for you to find. This time around there\'s a cluster of augmented reality projects which seem like a peek into our inevitable future.',
    summary:
      "There's a cluster of augmented reality projects this time around which seem like a peek into our inevitable future.",
    links: [
      {
        id: "wall-of-sound",
        title: "The Wall of Sound",
        link: "https://pangenerator.com/projects/the-wall-of-sound/",
        summary:
          'Custom electronics arranged sculpturally to create a multi-user sequencer of light and sound. Reminiscent of my own <a href="http://endquote.com/project/touchtones">TouchTones</a> project from 2010, which was in turn inspired by 2005\'s <a href="https://youtu.be/l1h_h05JjMQ">Electroplankton</a>.',
      },
      {
        id: "augmented-basketball",
        title: "Augmented Basketball",
        link:
          "https://www.creativeapplications.net/member-submissions/nike-lebron-17-interactive-basketball-trial-studio-nowhere/",
        summary:
          'If AR glasses are adopted in the world of sport before it trickles down to consumers, this is what future NBA players could see on the court. Quite an upgrade from Nike\'s <a href="https://www.akqa.com/work/jordan/the-last-shot/">similar project five years ago with AKQA</a>.',
      },
      {
        id: "envelope",
        title: "Envelope",
        link: "http://specialprojects.studio/project/envelope/",
        summary:
          'Something of a repeat from <a href="http://endquote.com/issue/1">issue 1</a>, Special Projects return with another delightful way to get you to quit staring at your phone all the time. Or you could take it a little further and try the <a href="http://justine-haupt.com/rotarycellphone/">rotary cell phone</a>.',
      },
      {
        id: "drawing-series",
        title: "Sol LeWitt: Drawing Series",
        link: "https://endquote.com/post/drawing_series",
        summary:
          "Since the last issue, I developed a visualization of the rules behind some of Sol LeWitt's wall drawings, showing how simple logic builds on itself to produce vast variations of pattern.",
      },
      {
        id: "tetra",
        title: "Tetra: Kinetic Ceiling",
        link: "https://volvoxlabs.com/project/tetra/",
        summary:
          "Volvox is back with a 100-foot long kinetic sculpture comprised of 300 motors and 150 LED tubes, which is apparently the largest such installation in NYC.",
      },
      {
        id: "terminal-slam",
        title: "Squarepusher: Terminal Slam",
        link: "https://squarepusher.net/terminal-slam",
        summary:
          'Another look into our probably-inevitable AR future, this time in the form of a Squarepusher music video by Daito Manabe and the <a href="https://rhizomatiks.com/en/">Rhizomatiks</a> crew, featuring the future ubiquity of <a href="https://pjreddie.com/darknet/yolo/">YOLO-style</a> object recognition and modification.',
      },
      {
        id: "ar-pianist",
        title: "AR Pianist",
        link: "https://www.massivetechnologies.ca/ar-pianist",
        summary:
          'A demo of an AR app showing a virtual human playing an actual piano in an actual room, until the piano goes virtual along with the rest of the world. If you\'ve got a piano you can <a href="https://apps.apple.com/fi/app/ar-piano-3d-piano-concerts/id1478118473">try it yourself</a>.',
      },
    ],
  },
  {
    id: 5,
    date: new Date("2020-03-24T00:00:00.000Z"),
    title: "Creative Tech #5: Can We Talk About Something Else?",
    intro:
      'From my quarantine to yours, a new collection of creative tech links to keep you distracted while working from home. You\'re not likely to see much work like this in person for a while, but if you want it to still exist when "normal" returns, consider supporting the arts where you can. Here in SF, <a href="https://grayarea.org/an-urgent-call-to-save-gray-area-cultural-community-from-closing/">Gray Area could certainly use a hand</a>.',
    summary:
      "From my quarantine to yours, a new collection of creative tech links to keep you distracted while working from home.",
    links: [
      {
        id: "cbm8032av",
        title: "CBM 8032 AV",
        link: "https://roberthenke.com/concerts/cbm8032av.html",
        summary:
          'After seeing this live AV performance using 40-year-old, 1mhz, monochrome computers, I stopped complaining about how slow my laptop has gotten. <a href="https://roberthenke.com/technology/inside8032av.html">The detailed technical breakdown</a>, including assembly programming and custom audio hardware, is also fascinating.',
      },
      {
        id: "apartment",
        title: "New York Apartment",
        link: "https://whitney.org/artport-commissions/new-york-apartment/",
        summary:
          'Another for the "wish I\'d thought of this" file, a project that combines listings for every apartment available in New York City into one massive listing for a 65,764-bedroom unit, complete with photos and video walkthroughs. Congrats to <a href="https://lav.io/projects/new-york-apartment/">Sam Lavigne</a> and <a href="http://tegabrain.com/New-York-Apartment">Tega Brain</a> on what looks like an immense amount of work.',
      },
      {
        id: "kazu",
        title: "KAZU",
        link: "https://youtu.be/B3ygQCHn5Ps",
        summary:
          'Sorry-not-sorry for including Rhizomatiks in two consecutive issues. This music video flies us around a pastoral point-cloud landscape dotted with <a href="https://elevenplay.net">ELEVENPLAY</a> dancers. No BTS on this one yet (is the landscape real, and if so, how was it captured?), but there is <a href="https://research.rhizomatiks.com/s/works/squarepusher/">more detail</a> up on the Squarepusher video from last time. (Apr 8 update: <a href="https://youtu.be/7yFFlcVi3r4">the BTS video is out</a>.)',
      },
      {
        id: "remnant",
        title: "Remnant",
        link: "https://www.design-io.com/projects/remnant",
        summary:
          'Calming reactive particles and fluids illustrate supernovas and black holes for a science museum in Canada. These days you <a href="https://twitter.com/design_io/status/1235623259942440961">don\'t have to spend a ton</a> on hardware to build such a thing.',
      },
      {
        id: "tore",
        title: "TORE",
        link: "https://youtu.be/rCJ1UPbWBPo",
        summary:
          'Way on the other extreme of the budget spectrum is this <a href="https://www.antycipsimulation.com/press/world-first-in-virtual-reality-for-the-university-of-lille/">180-degree, 20-projector immersive space</a> with head-tracking and stereoscopic 3D content in Paris. This is a couple years old and intended for academic research, but it would be neat to see what artists could do with it.',
      },
    ],
  },
  {
    id: 6,
    date: new Date("2020-04-22T00:00:00.000Z"),
    title: "Creative Tech #6: What Day Is It Again?",
    intro:
      "If you're feeling like home is a little too immersive these days, take a break from Animal Crossing and get inspired by these projects that have carried on in the midst of these strange times.",
    summary:
      "If you're feeling like home is a little too immersive these days, take a break from Animal Crossing and get inspired by these projects that have carried on in the midst of these strange times.",
    links: [
      {
        id: "jam3",
        title: "jam3×FWA",
        link: "https://fwa100.jam3.com",
        summary:
          'Legendary agency <a href="https://www.jam3.com">Jam3</a> celebrated their 100th (!) <a href="https://thefwa.com/profiles/jam3">FWA award</a> by creating a dreamy 3D illustration of their past and future. <a href="https://medium.com/@Jam3/12262265548d">The technical breakdown</a> goes into some of the solutions they came up with to generate the effects.',
      },
      {
        id: "origami",
        title: "Origami Projection Tutorial",
        link: "https://joanielemercier.com/origami/",
        summary:
          "Joanie's <a href=\"https://joanielemercier.com/paper-and-light/\">famous 2012 piece</a> has been on a million mood boards, but now you can install it at home if you've got paper, tape, a computer, and a projector.",
      },
      {
        id: "knol",
        title: "Roelof Knol",
        link: "https://instagram.com/roelofknol",
        summary:
          'This developer at <a href="https://yipp.nl/">YIPP</a> in Amsterdam is having fun at home building reactive projected music visualizers and experimental drawing tools.',
      },
      {
        id: "xoxo",
        title: "#XOXO",
        link: "https://xoxo.support/",
        summary:
          'It looks like <a href="https://dotdotdash.io">dotdotdash</a> has a spare robot arm lying around, and you can use it to play tic-tac-toe with another mystery player. Donations are encouraged.',
      },
      {
        id: "meteoriks",
        title: "Meteoriks 2020",
        link: "https://2020.meteoriks.org/laureates",
        summary:
          'The demoscene is still out there producing custom engines that get down to the metal to create amazing visuals. The best of the year are honored with awards in various categories, like <a href="https://youtu.be/mVdISz9-iFc">best graphics</a>. Outstanding technical achievement went to <a href="https://youtu.be/gI6j0lZlytM">a 4KB intro</a> written in MATLAB.',
      },
      {
        id: "led-mask",
        title: "LED Face Mask",
        link: "https://youtu.be/aYAwOimNzb0",
        summary:
          'I\'m just rocking a bandana tied on with rubber bands, but I appreciate those that are taking it to the next level with <a href="https://www.lumencouture.com/buy-led-light-up-dresses/shop-tech-warning-face-mask/">realtime LED graphics</a> on their face coverings.',
      },
    ],
  },
];

export interface Issue extends IssueDef {
  href: string;
  link: string;
  image: string | null;
}

export const issues: Issue[] = issueDefs.map((i) => {
  return {
    ...i,
    href: "/issue/[id]",
    link: `/issue/${i.id}`,
    image:
      i.links && i.links.length
        ? `images/issues/${i.id}/${i.links[0].id}.jpg`
        : null,
    date: i.date || new Date(),
  };
});

issues.sort((a, b) => {
  return b.date.getTime() - a.date.getTime();
});

export const index = issues.map((i) => {
  i = clone(i);
  delete i.links;
  delete i.intro;
  return i;
});

export function query(id: number): Issue | undefined {
  return issues.find((i) => i.id === id);
}
