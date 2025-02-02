<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

const page = (await useAsyncData(() => queryCollection("content").where("path", "=", "/trips").first())).data.value!;
useSiteHead(page);

// merge trip data and pages
const tripData = (await useAsyncData(() => queryCollection("tripData").order("start", "DESC").all())).data.value!;
const tripPages = (await useAsyncData(() => queryCollection("tripPages").all())).data.value!;
const trips = tripData.map((data) => {
  const page = tripPages.find((page) => page.date >= data.startDate && page.date <= data.endDate);
  return { data, page };
});

const fmt = "YYYY-MM-DD";
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
  </div>
  <div class="prose-custom">
    <ul>
      <li v-for="trip in trips" :key="trip.data.id">
        <a v-if="trip.page" :href="`${trip.page.stem}`"
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
