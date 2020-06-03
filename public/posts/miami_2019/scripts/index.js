"use strict";
// Get recent checkins from Swarm and write it to a file.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = __importDefault(require("clone"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var request_promise_native_1 = __importDefault(require("request-promise-native"));
// Lost your token? Here's how to get one:
// Make .env, get SWARM_CLIENT_ID and SWARM_CLIENT_SECRET from here:
// https://foursquare.com/developers/apps/LV4TILXRHDJJ5YZ1HJGA4GDLRSH3FCCOLIO33U2EGXAPZO5U/settings
// Go to this URL:
var authReq = "https://foursquare.com/oauth2/authenticate?client_id=" + process.env.SWARM_CLIENT_ID + "&response_type=code&redirect_uri=https%3A%2F%2Fendquote.com%2Fabout";
// Pull the code from the redirect, save it to .env in SWARM_OAUTH_CODE.
// Then go to this URL:
var tokenReq = "https://foursquare.com/oauth2/access_token?client_id=" + process.env.SWARM_CLIENT_ID + "&client_secret=" + process.env.SWARM_CLIENT_SECRET + "&grant_type=authorization_code&redirect_uri=https%3A%2F%2Fendquote.com%2Fabout&code=" + process.env.SWARM_OAUTH_CODE;
// Put the token in .env as SWARM_OAUTH_TOKEN.
// Filter by some criteria.
function filter(checkin) {
    return checkin.venue.location.state === "FL";
}
var auth = {
    client_id: process.env.SWARM_CLIENT_ID,
    client_secret: process.env.SWARM_CLIENT_SECRET,
    oauth_token: process.env.SWARM_OAUTH_TOKEN,
    v: "20180323",
};
// https://developer.foursquare.com/docs/api-reference/users/checkins/
var getCheckins = {
    url: "https://api.foursquare.com/v2/users/self/checkins",
    qs: Object.assign(clone_1.default(auth), {
        limit: 250,
        afterTimestamp: Math.round(new Date(2019, 11, 4).getTime() / 1000),
        beforeTimestamp: Math.round(new Date(2019, 11, 9).getTime() / 1000),
        sort: "newestfirst",
    }),
};
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var body, items, unique, details, venueDetails, output, outFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request_promise_native_1.default(getCheckins)];
                case 1:
                    body = _a.sent();
                    items = JSON.parse(body).response.checkins.items;
                    unique = [];
                    details = [];
                    // Get the last page of checkins.
                    items
                        .filter(filter)
                        .map(function (c) {
                        return {
                            date: c.createdAt,
                            id: c.venue.id,
                            name: c.venue.name,
                            location: [c.venue.location.lng, c.venue.location.lat],
                        };
                    })
                        .sort(function (a, b) { return a.date - b.date; })
                        .forEach(function (v) {
                        delete v.location.labeledLatLngs;
                        delete v.location.formattedAddress;
                        // Remove any duplicate venues.
                        if (unique.findIndex(function (u) { return u.id === v.id; }) === -1) {
                            unique.push(v);
                            // Set up a request for venue details.
                            details.push(request_promise_native_1.default({
                                url: "https://api.foursquare.com/v2/venues/" + v.id,
                                qs: auth,
                            }));
                        }
                    });
                    return [4 /*yield*/, Promise.all(details)];
                case 2:
                    venueDetails = _a.sent();
                    venueDetails.forEach(function (d) {
                        var venue = JSON.parse(d).response.venue;
                        var checkin = unique.find(function (c) { return c.id === venue.id; });
                        var category = venue.categories.find(function (c) { return c.primary == true; });
                        // Add some props to the checkin.
                        checkin.description = venue.description;
                        checkin.url = venue.url || "https://foursquare.com/v/" + checkin.id;
                        checkin.category = category.name.toLowerCase().replace(/\s/g, "_");
                    });
                    output = JSON.stringify(unique, null, 2);
                    outFile = path_1.default.join(__dirname, "checkins.json");
                    fs_1.default.writeFileSync(outFile, output);
                    return [2 /*return*/];
            }
        });
    });
}
run();
