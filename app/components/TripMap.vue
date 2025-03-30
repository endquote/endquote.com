<script setup lang="ts">
import type { inferRouterOutputs } from "@trpc/server";
import type { LngLatLike } from "maplibre-gl";
import type { AppRouter } from "~~/server/trpc/routers";

type RouterOutput = inferRouterOutputs<AppRouter>;
type TripOutput = NonNullable<RouterOutput["trips"]["trip"]>;

defineProps<{
  trip: TripOutput | undefined | null;
}>();

const maptilerKey = useRuntimeConfig().public.maptilerKey;
const style = `https://api.maptiler.com/maps/streets/style.json?key=${maptilerKey}`;
const center: LngLatLike = [-1.559482, 47.21322];
const zoom = 8;
</script>

<template>
  <div v-if="trip" class="h-96 w-full">
    <ClientOnly>
      <MglMap :map-style="style" :center="center" :zoom="zoom">
        <MglNavigationControl />
        <MglMarker
          v-for="checkin in trip.checkins"
          :key="checkin.eqId"
          :coordinates="[checkin.venue.lng, checkin.venue.lat]"
        />
      </MglMap>
    </ClientOnly>
  </div>
</template>
