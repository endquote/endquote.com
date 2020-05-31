import clone from "clone";
import { NextApiRequest, NextApiResponse } from "next";
import { BASE_HREF, DEV } from "../../data/constants";
import { issues } from "../../data/issues";
import { posts } from "../../data/posts";
import { projects } from "../../data/projects";

/**
 * Properties that are different for each feed.
 */
interface FeedDef {
  title: string;
  home_page_url: string;
  feed_url: string;
  items: FeedItemDef[];
}

/**
 * Feed properties that can be computed.
 */
interface Feed extends FeedDef {
  version: string;
  author: { name: string; url: string };
  items: FeedItem[];
}

/**
 * Properties that are different for each feed item.
 */
interface FeedItemDef {
  url: string;
  title: string;
  content_html: string;
  image: string;
  date_published: Date;
}

/**
 * Item properties that can be computed.
 */
interface FeedItem extends FeedItemDef {
  id: string;
}

/**
 * Construct a JSON feed for feed readers.
 * https://jsonfeed.org
 */
class Feeds {
  /**
   * Add attributes to feed/item definitions to make them conform to JSON feed.
   * @param feed the feed definition
   */
  static build(feed: FeedDef): Feed {
    return {
      title: feed.title,
      home_page_url: feed.home_page_url,
      feed_url: feed.feed_url,
      version: "https://jsonfeed.org/version/1",
      author: { name: "Josh Santangelo", url: BASE_HREF },
      items: feed.items
        .sort((a, b) => b.date_published.getTime() - a.date_published.getTime())
        .map((item) => {
          return { ...item, id: item.url };
        }),
    };
  }

  /**
   * Return a feed definition for projects.
   */
  static projects(): Feed {
    return Feeds.build({
      title: "Josh Santangelo - work",
      home_page_url: `${BASE_HREF}/work`,
      feed_url: `${BASE_HREF}/project/feed`,
      items: clone(projects).map((project) => {
        return {
          url: `${BASE_HREF}/project/${project.id}`,
          title: project.title,
          content_html: project.description,
          image: `${BASE_HREF}/images/projects/${project.id}/640.jpg`,
          date_published: new Date(project.date),
        };
      }),
    });
  }

  /**
   * Return a feed definition for issues.
   */
  static issues(): Feed {
    return Feeds.build({
      title: "Josh Santangelo - newsletter",
      home_page_url: `${BASE_HREF}/news`,
      feed_url: `${BASE_HREF}/issue/feed`,
      items: clone(issues)
        .filter((i) => DEV || (!i.draft && Date.parse(i.date) < Date.now()))
        .map((issue) => {
          return {
            url: `${BASE_HREF}/issue/${issue.id}`,
            title: issue.title,
            content_html: issue.intro,
            image: `${BASE_HREF}/${issue.image}`,
            date_published: new Date(issue.date),
          };
        }),
    });
  }

  /**
   * Return a feed definition for posts.
   */
  static posts(): Feed {
    return Feeds.build({
      title: "Josh Santangelo - posts",
      home_page_url: `${BASE_HREF}/posts`,
      feed_url: `${BASE_HREF}/post/feed.json`,
      items: clone(posts)
        .filter((p) => DEV || (!p.draft && Date.parse(p.date) < Date.now()))
        .map((post) => {
          return {
            url: `${BASE_HREF}/post/${post.id}`,
            title: post.title,
            image: `${BASE_HREF}/images/post/${post.id}.jpg`,
            date_published: new Date(post.date),
            content_html: post.summary,
          };
        }),
    });
  }

  /**
   * Return a feed definition for issues+posts.
   */
  static content(): Feed {
    return Feeds.build({
      title: "Josh Santangelo",
      home_page_url: BASE_HREF,
      feed_url: `${BASE_HREF}/feed.json`,
      items: Feeds.issues().items.concat(Feeds.posts().items),
    });
  }

  /**
   * Return a feed definition for issues+posts+projects.
   */
  static all(): Feed {
    return Feeds.build({
      title: "Josh Santangelo",
      home_page_url: BASE_HREF,
      feed_url: `${BASE_HREF}/feed.json`,
      items: Feeds.projects().items.concat(
        Feeds.issues().items,
        Feeds.posts().items
      ),
    });
  }
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  let type = "content";
  if (req.query.type && req.query.type.length) {
    if (Array.isArray(req.query.type)) {
      type = req.query.type[0];
    } else {
      type = req.query.type;
    }
  }

  let feed: Feed;
  if (type === "all") {
    feed = Feeds.all();
  } else if (type === "content") {
    feed = Feeds.content();
  } else if (type === "posts") {
    feed = Feeds.posts();
  } else if (type === "issues") {
    feed = Feeds.issues();
  } else if (type === "projects") {
    feed = Feeds.projects();
  } else {
    return res.status(404).end();
  }

  return res.status(200).json(feed);
};
