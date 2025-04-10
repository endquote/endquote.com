<script setup lang="ts">
import { useMap } from "@indoorequal/vue-maplibre-gl";
import type { inferRouterOutputs } from "@trpc/server";
import { greatCircle } from "@turf/great-circle";
import type { LngLatBoundsLike, LngLatLike } from "maplibre-gl";
import type { AppRouter } from "~~/server/trpc/routers";

import { HOMES, HOME_DISTANCE } from "~/utils/constants";
import { haversine } from "~/utils/math";

// props setup
type RouterOutput = inferRouterOutputs<AppRouter>;
type TripOutput = NonNullable<RouterOutput["trips"]["trip"]>;
const props = defineProps<{ trip: TripOutput | undefined | null }>();

const isDarkMode = ref(false);

// store the handler so we can reference it for cleanup
const darkModeHandler = (e: MediaQueryListEvent) => (isDarkMode.value = e.matches);

// check initial dark mode preference and set up listener
onMounted(() => {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  isDarkMode.value = mq.matches;
  mq.addEventListener("change", darkModeHandler);
});

// clean up listener when component is destroyed
onUnmounted(() => {
  window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", darkModeHandler);
});

// update map style to match dark mode
const mapStyle = computed(() => `/api/mapstyle/styles/${isDarkMode.value ? "stamen_toner" : "stamen_toner_lite"}.json`);

const mapKey = `trip-${props.trip?.eqId}`;
const map = useMap(mapKey);

// don't render the trip directly, remove some checkins first
const filteredTrip = computed(() => {
  const { trip } = props;

  if (!trip) return null;

  return {
    ...trip,
    checkins: trip.checkins
      // remove consecutive duplicate checkins
      .filter((c, i, array) => {
        if (i === 0) return true;
        return c.venue.fsId !== array[i - 1]!.venue.fsId;
      }),
  };
});

// compute map bounds based on the filtered checkins list
const bounds = computed<LngLatBoundsLike | undefined>(() => {
  let checkins = filteredTrip.value?.checkins;

  if (!checkins?.length) return undefined;

  // ignore anything close to home
  checkins = checkins.filter((c) =>
    HOMES.some(
      (h) =>
        new Date(c.date) >= h.start &&
        new Date(c.date) <= h.end &&
        haversine(h.lat, h.lng, c.venue.lat, c.venue.lng) > HOME_DISTANCE,
    ),
  );

  const firstCheckin = checkins[0]!;
  const sw: LngLatLike = [firstCheckin.venue.lng, firstCheckin.venue.lat];
  const ne: LngLatLike = [firstCheckin.venue.lng, firstCheckin.venue.lat];

  checkins.forEach((checkin) => {
    const { lng, lat } = checkin.venue;
    sw[0] = Math.min(sw[0], lng);
    sw[1] = Math.min(sw[1], lat);
    ne[0] = Math.max(ne[0], lng);
    ne[1] = Math.max(ne[1], lat);
  });

  return [sw, ne] as LngLatBoundsLike;
});

const flightPaths = computed(() => {
  const flights = filteredTrip.value?.flights || [];
  const processedPairs = new Set<string>();

  return flights
    .filter((flight) => {
      // remove flights that are the same, just different directions
      const fromTo = `${flight.fromAirport.code}-${flight.toAirport.code}`;
      const toFrom = `${flight.toAirport.code}-${flight.fromAirport.code}`;
      if (processedPairs.has(fromTo) || processedPairs.has(toFrom)) return false;
      processedPairs.add(fromTo);
      return true;
    })
    .map((flight) => {
      // generate flight paths using turf greatCircle
      const from = [flight.fromAirport.lng, flight.fromAirport.lat];
      const to = [flight.toAirport.lng, flight.toAirport.lat];
      const options = { npoints: 100 };
      const arc = greatCircle(from, to, options);
      return {
        id: `${flight.fromAirport.code}-${flight.toAirport.code}-${flight.date.split("T")[0]}`,
        geometry: arc.geometry,
      };
    });
});

// if the map is loaded and the bounds are computed, fit the map to the bounds
watch(
  [() => map.isLoaded, () => bounds.value],
  ([loaded, bounds]) => {
    if (loaded && bounds && map.map) {
      map.map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 0 });
    }
  },
  { immediate: true },
);

const handleMarkerClick = (e: MouseEvent, checkin: TripOutput["checkins"][number]) => {
  e.stopPropagation();
  console.log(e, checkin);
};
</script>

<template>
  <div v-if="filteredTrip && (filteredTrip.checkins || filteredTrip.flights)" class="h-96 w-full">
    <ClientOnly>
      <MglMap :map-style="mapStyle" :map-key="mapKey" :attribution-control="false">
        <MglNavigationControl />

        <!-- flight paths -->
        <template v-if="flightPaths.length">
          <MglGeoJsonSource
            source-id="flight-paths-source"
            :data="{
              type: 'FeatureCollection',
              features: flightPaths.map((p) => ({ type: 'Feature', geometry: p.geometry, properties: {} })),
            }"
          >
            <MglLineLayer
              layer-id="flight-paths-layer"
              :paint="{
                'line-color': isDarkMode ? '#6fa8dc' : '#2986cc',
                'line-width': 2,
                'line-dasharray': [2, 1],
              }"
            />
          </MglGeoJsonSource>
        </template>

        <!-- checkin markers -->
        <MglMarker
          v-for="checkin in filteredTrip.checkins"
          :key="checkin.fsId"
          :coordinates="[checkin.venue.lng, checkin.venue.lat]"
          anchor="center"
        >
          <template #marker>
            <div class="text-2xl" @click="(e) => handleMarkerClick(e, checkin)">
              {{ checkin.venue.venueIcon?.eqIcon || "📍" }}
            </div>
          </template>
        </MglMarker>
      </MglMap>
    </ClientOnly>
  </div>
</template>
