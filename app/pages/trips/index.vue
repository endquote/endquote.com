<script setup lang="ts">
// get page content
const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("content").path(route.path).first());
useSiteHead(page.value);

// get trip data
const { $client } = useNuxtApp();
const { data: tripData } = await useAsyncData(() => $client.trips.query());

// get trip pages
const { data: pages } = await useAsyncData(() => queryCollection("trips").all());

// merge trip data with pages
const trips = tripData.value?.map((data) => {
  const start = data.start.split("T")[0]!;
  const end = data.end.split("T")[0]!;
  const page = pages.value?.find((p) => p.date >= start && p.date <= end);
  return { data, page, start, end };
});
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
    <p v-for="trip in trips" :key="trip.data.eqId">
      <span>
        <span v-if="trip.page">✅</span>
        <span v-else>❌</span>&nbsp;
      </span>
      <NuxtLink :href="trip.page?.path || trip.start"
        >{{ trip.start }} - {{ trip.end
        }}<span v-if="trip.data.flights.length"> - {{ trip.data.flights.map((f) => f.toAirport).join(", ") }}</span
        ><span v-if="trip.page"> - {{ trip.page.title }}</span></NuxtLink
      >
    </p>
  </div>
</template>
