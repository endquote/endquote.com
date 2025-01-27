<script setup lang="ts">
import type { TripDataCollectionItem, TripPagesCollectionItem } from "@nuxt/content";
import { useDateFormat } from "@vueuse/core";

const page = (await useAsyncData(() => queryCollection("content").where("path", "=", "/trips").first())).data.value!;
useSiteHead(page);

// merge trip data and pages
const tripData = (await useAsyncData(() => queryCollection("tripData").order("start", "DESC").all())).data.value!;
const tripPages = (await useAsyncData(() => queryCollection("tripPages").all())).data.value!;
const trips: (TripDataCollectionItem & TripPagesCollectionItem)[] = tripData.map((data) => {
  const page = tripPages.find((page) => page.stem.match(/\d+/)?.[0] === data.stem);
  return { ...data, ...page };
});

const fmt = "YYYY-MM-DD";
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
  </div>
  <div class="prose-custom">
    <ul>
      <li v-for="trip in trips" :key="trip.id">
        <a v-if="trip.extension === 'md'" :href="`${trip.stem}`"
          >{{ useDateFormat(trip.checkins[0]?.date, fmt) }} -
          {{ useDateFormat(trip.checkins[trip.checkins.length - 1]?.date, fmt) }}</a
        >
        <div v-else>
          {{ useDateFormat(trip.checkins[0]?.date, fmt) }} -
          {{ useDateFormat(trip.checkins[trip.checkins.length - 1]?.date, fmt) }}
        </div>
      </li>
    </ul>
  </div>
</template>
