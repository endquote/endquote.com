<script setup lang="ts">
import { useMap } from "@indoorequal/vue-maplibre-gl";
import type { inferRouterOutputs } from "@trpc/server";
import type { LngLatBoundsLike } from "maplibre-gl";
import type { AppRouter } from "~~/server/trpc/routers";

/*

- use 4sq icons for markers
- marker popups
- visualize flights
- proxy tile requests

*/

type RouterOutput = inferRouterOutputs<AppRouter>;
type TripOutput = NonNullable<RouterOutput["trips"]["trip"]>;

const props = defineProps<{ trip: TripOutput | undefined | null }>();

const maptilerKey = useRuntimeConfig().public.maptilerKey;
const style = `https://api.maptiler.com/maps/streets/style.json?key=${maptilerKey}`;

const mapKey = `trip-${props.trip?.eqId}`;
const map = useMap(mapKey);

// don't render the trip directly, remove some checkins first
const filteredTrip = computed(() => {
  const { trip } = props;
  if (!trip) return null;
  const copy = { ...trip, checkins: [...trip.checkins], flights: [...trip.flights] };

  // remove consecutive duplicate checkins
  copy.checkins = copy.checkins.filter((checkin, index, array) => {
    if (index === 0) return true;
    return checkin.venue.fsId !== array[index - 1]!.venue.fsId;
  });

  return copy;
});

// compute map bounds based on the filtered checkins list
const bounds = computed<LngLatBoundsLike | undefined>(() => {
  if (!filteredTrip.value?.checkins?.length) return undefined;

  const firstCheckin = filteredTrip.value.checkins[0]!;
  const sw = [firstCheckin.venue.lng, firstCheckin.venue.lat];
  const ne = [firstCheckin.venue.lng, firstCheckin.venue.lat];

  filteredTrip.value.checkins.forEach((checkin) => {
    const { lng, lat } = checkin.venue;
    sw[0] = Math.min(sw[0] as number, lng);
    sw[1] = Math.min(sw[1] as number, lat);
    ne[0] = Math.max(ne[0] as number, lng);
    ne[1] = Math.max(ne[1] as number, lat);
  });

  return [sw, ne] as LngLatBoundsLike;
});

// if the map is loaded and the bounds are computed, fit the map to the bounds
watch(
  [() => map.isLoaded, () => bounds.value],
  ([isLoaded, currentBounds]) => {
    if (isLoaded && currentBounds && map.map) {
      map.map.fitBounds(currentBounds, { padding: 50, maxZoom: 15 });
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
  <div v-if="filteredTrip" class="h-96 w-full">
    <ClientOnly>
      <MglMap :map-style="style" :map-key="mapKey">
        <MglNavigationControl />
        <MglMarker
          v-for="checkin in filteredTrip.checkins"
          :key="checkin.eqId"
          :coordinates="[checkin.venue.lng, checkin.venue.lat]"
        >
          <template #marker><div @click="(e) => handleMarkerClick(e, checkin)">📍</div></template>
        </MglMarker>
      </MglMap>
    </ClientOnly>
  </div>
</template>
