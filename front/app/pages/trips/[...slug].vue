<script setup lang="ts">
import type { TripDataCollectionItem, TripPagesCollectionItem } from "@nuxt/content";
import { useDateFormat } from "@vueuse/core";

// get page and 404 if not found
const route = useRoute();
const res = await useAsyncData(() => queryCollection("tripPages").path(route.path).first());
if (!res.data.value) {
  throw createError({ statusCode: 404 });
}

// merge with trip data
const tripPage = res.data.value!;
const tripId = tripPage.path.match(/\d+/)?.[0]!;
const tripData = (await useAsyncData(() => queryCollection("tripData").path(`/${tripId}`).first())).data.value!;
const trip: TripDataCollectionItem & TripPagesCollectionItem = { ...tripData, ...tripPage };

useSiteHead(trip);

const fmt = "YYYY-MM-DD";
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer :value="trip" />
    <ul>
      <li v-for="checkin in trip.checkins" :key="checkin.eqId">
        {{ useDateFormat(checkin.date, fmt) }} - {{ checkin.venue.name }}
      </li>
    </ul>
  </div>
</template>
