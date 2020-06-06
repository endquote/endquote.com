// a shim to get data in module files into require-land.
import fs from "fs-extra";
import * as config from "../data/config";
import { data } from "../data/drawings";
import * as map from "../data/map";

fs.ensureDirSync("temp");
fs.writeFileSync("temp/config.json", JSON.stringify(config));
fs.writeFileSync("temp/map.json", JSON.stringify(map));

data.forEach((d) => (d.number = d.number.replace("#", "")));
fs.writeFileSync("temp/drawings.json", JSON.stringify({ data }));
