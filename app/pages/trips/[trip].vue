<script setup lang="ts">
import FlightToFrom from "~/components/FlightToFrom.vue";
const { $trpc } = useNuxtApp();

const isDev = useDev();
const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("trips").path(route.path).first());
const date = page.value ? page.value.date.split("T")[0] : (route.params.trip as string);

if ((!page.value && !isDev) || !date) {
  throw createError({ statusCode: 404 });
}

const { data } = await useAsyncData(() => $trpc.trips.trip.query({ date }));

useSiteHead(page.value);
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
