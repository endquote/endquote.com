import fs from "fs";
import Handlebars from "handlebars";
import { issues, query } from "../../data/issues";

// node index.ts [baseUrl] [issueId]

const baseUrl = process.argv[2] || "http://endquote.com";

const id = process.argv[3] ? process.argv[3] : issues[0].id;
const issue = query(id);

const html = fs.readFileSync("template.hbs").toString();

Handlebars.registerHelper("stylelink", (s) =>
  s.replace("<a ", '<a style="color:black" ')
);

const template = Handlebars.compile(html);

const out = template({ issue, baseUrl });

fs.writeFileSync("email.html", out);
