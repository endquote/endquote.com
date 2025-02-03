<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
import type { TripQuery, TripResponse } from "../../../server/api/trip";

// get page and 404 if not found
const route = useRoute();
const res = await useAsyncData(() => queryCollection("tripPages").path(route.path).first());
if (!res.data.value) {
  throw createError({ statusCode: 404 });
}

// merge with trip data
const page = res.data.value!;
const date = route.params?.slug?.[0]!;
const { data } = await useFetch<TripResponse, TripQuery>("/api/trip", { query: { start: date } });

const trip = { data: data.value!.data, page };

useSiteHead(trip.page);

const fmt = "YYYY-MM-DD";
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer :value="trip.page" />
    <ul>
      <li v-for="checkin in trip.data.checkins" :key="checkin.eqId">
        {{ useDateFormat(checkin.date, fmt) }} - {{ checkin.venue.name }}
      </li>
    </ul>
  </div>
</template>
