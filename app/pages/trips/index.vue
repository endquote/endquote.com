<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

// get page content
const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("content").path(route.path).first());
useSiteHead(page.value);

// get trip data
const { $client } = useNuxtApp();
const tripData = await $client.trips.query();

// get trip pages
const { data: pages } = await useAsyncData(() => queryCollection("trips").all());

// merge trip data with pages
let trips = tripData.map((data) => {
  const page = pages.value?.find(
    (page) => page.date >= data.start.split("T")[0]! && page.date <= data.end.split("T")[0]!,
  );
  return { data, page };
});

const fmt = "YYYY-MM-DD";
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
    <ul>
      <li v-for="trip in trips" :key="trip.data.eqId">
        <NuxtLink :href="`/trips/${useDateFormat(trip.data.start, fmt).value}`"
          >{{ useDateFormat(trip.data.start, fmt) }} - {{ useDateFormat(trip.data.end, fmt) }}</NuxtLink
        >
      </li>
    </ul>
  </div>
</template>
