<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

// get page and 404 if not found
const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("trips").path(route.path).first());
useSiteHead(page.value);

if (!page.value && !useDev()) {
  throw createError({ statusCode: 404 });
}

// merge with trip data
const date = route.params?.trip as string;

const { $client } = useNuxtApp();
const data = await $client.trip.query({ date });

const fmt = "YYYY-MM-DD";
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
    <div v-if="data && data.checkins.length">
      <h2>Checkins</h2>
      <ul>
        <li v-for="checkin in data.checkins" :key="checkin.eqId">
          {{ useDateFormat(checkin.date, fmt) }} - <NuxtLink :href="`https://foursquare.com/v/${checkin.venue.fsId}`">{{
            checkin.venue.name }}</NuxtLink>
          <Michelin :restaurant="checkin.venue.restaurant" />
        </li>
      </ul>
    </div>
    <div v-if="data && data.flights.length">
      <h2>Flights</h2>
      <ul>
        <li v-for="flight in data?.flights" :key="flight.eqId">
          {{ useDateFormat(flight.date, fmt) }} - {{ flight.fromAirport }}-{{ flight.toAirport }}
        </li>
      </ul>
    </div>
  </div>
</template>
