import { default as HtmlToReact } from "html-to-react";
import Link from "next/link";
import React from "react";
import { PrintLink } from "../components/PrintLink";

// https://github.com/aknuds1/html-to-react

const htmlToReactParser = new HtmlToReact.Parser();

const isValidNode = function () {
  return true;
};

const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

const processingInstructions = [
  {
    // Turn <a> links into <Link> links
    // replaceChildren: true,
    shouldProcessNode: function (node) {
      return (
        node.type === "tag" &&
        node.name === "a" &&
        node.attribs.href &&
        !node.attribs.href.toLowerCase().startsWith("http")
      );
    },

    processNode: function (node, children, index) {
      const href = node.attribs.href.toLowerCase();
      if (href.match(/^\/project\/([^\/+])/)) {
        return (
          <PrintLink href="/project/[id]" hrefAs={href} key={href}>
            {children[0]}
          </PrintLink>
        );
      } else if (href.match(/^\//)) {
        return (
          <PrintLink href={href} hrefAs={href} key={href}>
            {children[0]}
          </PrintLink>
        );
      }

      return (
        <Link href={href} key={href}>
          <a>{children[0]}</a>
        </Link>
      );
    },
  },
  {
    // Anything else
    shouldProcessNode: function (node) {
      return true;
    },
    processNode: processNodeDefinitions.processDefaultNode,
  },
];

export function htmlToReact(htmlInput) {
  return htmlToReactParser.parseWithInstructions(
    htmlInput,
    isValidNode,
    processingInstructions
  );
}
