const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = process.env.PORT || 3000;
const { DEV, PROD_HREF } = require("./data/constants");
const app = next({ DEV });
const handle = app.getRequestHandler();
const fs = require("fs");
const path = require("path");

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    // if (parsedUrl.protocol !== "https:" && !DEV) {
    //   res.writeHead(301, { Location: `${PROD_HREF}${parsedUrl.href}` });
    //   res.end();
    // } else {
    fs.appendFileSync(
      path.join(__dirname, "log.txt"),
      JSON.stringify(parsedUrl)
    );
    handle(req, res, parsedUrl);
    // }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
