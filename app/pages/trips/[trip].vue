<script setup lang="ts">
import FlightToFrom from "~/components/FlightToFrom.vue";

const isDev = useDev();

// get page and 404 if not found
const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("trips").path(route.path).first());
useSiteHead(page.value);

if (!page.value && !isDev) {
  throw createError({ statusCode: 404 });
}

// merge with trip data
const date = page.value!.date;

const { $client } = useNuxtApp();
const { data } = await useAsyncData(() => $client.trip.query({ date }));
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
    <div v-if="data && data.checkins.length">
      <h2>Checkins</h2>
      <ul>
        <li v-for="checkin in data.checkins" :key="checkin.eqId">
          {{ checkin.date.split("T")[0]! }} -
          <NuxtLink :href="`https://foursquare.com/v/${checkin.venue.fsId}`">{{ checkin.venue.name }}</NuxtLink>
          <FlightToFrom :airport="checkin.venue.airport" :flight="checkin.flight" />
          <MichelinAward :restaurant="checkin.venue.restaurant" />
        </li>
      </ul>
    </div>
    <div v-if="data && data.flights.length">
      <h2>Flights</h2>
      <ul>
        <li v-for="flight in data?.flights" :key="flight.eqId" :class="{ 'line-through': flight.canceled }">
          {{ flight.date.split("T")[0]! }} - {{ flight.fromAirport }}-{{ flight.toAirport }}
        </li>
      </ul>
    </div>
  </div>
</template>
