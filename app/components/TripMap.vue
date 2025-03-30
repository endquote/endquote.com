<script setup lang="ts">
import { useMap } from "@indoorequal/vue-maplibre-gl";
import type { inferRouterOutputs } from "@trpc/server";
import type { LngLatLike } from "maplibre-gl";
import type { AppRouter } from "~~/server/trpc/routers";

type RouterOutput = inferRouterOutputs<AppRouter>;
type TripOutput = NonNullable<RouterOutput["trips"]["trip"]>;

const props = defineProps<{ trip: TripOutput | undefined | null }>();

const maptilerKey = useRuntimeConfig().public.maptilerKey;
const style = `https://api.maptiler.com/maps/streets/style.json?key=${maptilerKey}`;
const center: LngLatLike = [-1.559482, 47.21322];
const zoom = 8;

const mapKey = `trip-${props.trip?.eqId}`;
const map = useMap(mapKey);

watch(
  () => map.isLoaded,
  (isLoaded) => {
    console.log("map loaded ", isLoaded);
  },
);

const handleMarkerClick = (e: MouseEvent, checkin: TripOutput["checkins"][number]) => {
  e.stopPropagation();
  console.log(e, checkin);
};
</script>

<template>
  <div v-if="trip" class="h-96 w-full">
    <ClientOnly>
      <MglMap :map-style="style" :center="center" :zoom="zoom" :map-key="mapKey">
        <MglNavigationControl />
        <MglMarker
          v-for="checkin in trip.checkins"
          :key="checkin.eqId"
          :coordinates="[checkin.venue.lng, checkin.venue.lat]"
        >
          <template #marker><div @click="(e) => handleMarkerClick(e, checkin)">📍</div></template>
        </MglMarker>
      </MglMap>
    </ClientOnly>
  </div>
</template>
