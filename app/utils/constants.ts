export const BASE_OBJECTS = "https://objects-us-east-1.dream.io";
export const BASE_HLS = `${BASE_OBJECTS}/endquote`;

// checkins within this distance of home are considered home (km)
export const HOME_DISTANCE = 120; // about 75mi

export const HOMES = [
  {
    name: "Seattle",
    lat: 47.61683256703408,
    lng: -122.31372739105129,
    start: new Date("1997-06-01T00:00:00Z"),
    end: new Date("2015-04-16T01:53:00Z"),
    airports: ["SEA"],
  },
  {
    name: "San Francisco",
    lat: 37.78579877626331,
    lng: -122.48713449547435,
    start: new Date("2015-04-16T03:50:00Z"),
    end: new Date("2079-01-01T00:00:00Z"),
    airports: ["SFO", "OAK"],
  },
];
