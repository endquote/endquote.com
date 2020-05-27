import { ContentItem } from "../components/ContentCard";

interface PostDef {
  id: string;
  title: string;
  date: string;
  summary: string;
  draft?: boolean;
}

const postDefs: PostDef[] = [
  {
    id: "miami_2019",
    title: "A First-Timer's Guide to Miami Art Week",
    date: "2019-12-17T10:00:00.000Z",
    summary:
      "I took a trip with my lady to Miami for art week, which consists of many art fairs, exhibitions, parties, and related events. We developed a rough itinerary with her on food and me on art, but kept it fairly flexible. Here's how it worked out.",
    draft: false,
  },
  {
    id: "drawing_series",
    title: "Sol LeWitt: Drawing Series",
    date: "2020-01-21T01:00:00.000Z",
    summary:
      'An interactive exploration of Sol LeWitt\'s "Drawing Series", one of the groups of his many Wall Drawings, produced beginning in 1960.',
    draft: false,
  },
];

export interface Post extends ContentItem {
  draft?: boolean;
  date: string;
}

export const posts: Post[] = postDefs
  .map((p) => {
    return {
      ...p,
      href: "/post/[id]",
      link: `/post/${p.id}`,
      image: `/posts/${p.id}/image.jpg`,
      date: p.date || new Date().toISOString(),
    };
  })
  .sort((a, b) => {
    return Date.parse(b.date) - Date.parse(a.date);
  });

export function query(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}
