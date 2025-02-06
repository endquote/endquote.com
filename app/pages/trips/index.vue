<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("content").path(route.path).first());
useSiteHead(page.value);

// merge trip data and pages
const { $client } = useNuxtApp();
const tripData = await $client.trips.query();

const {data:pages} = await useAsyncData(() => queryCollection("trips").all());

const trips = tripData.map((data) => {
  const page = pages.value?.find((page) => page.date >= data.start.split("T")[0]! && page.date <= data.end.split("T")[0]!);
  return { data, page };
});

const fmt = "YYYY-MM-DD";
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
    <ul>
      <li v-for="trip in trips" :key="trip.data.eqId">
        <a v-if="trip.page" :href="`/${trip.page.stem}`"
          >{{ useDateFormat(trip.data.start, fmt) }} - {{ useDateFormat(trip.data.end, fmt) }}</a
        >
        <div v-else>
          {{ useDateFormat(trip.data.start, fmt) }} -
          {{ useDateFormat(trip.data.end, fmt) }}
        </div>
      </li>
    </ul>
  </div>
</template>
