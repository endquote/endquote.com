<script setup lang="ts">
import FlightToFrom from "~/components/FlightToFrom.vue";

const isDev = useDev();

// get page and 404 if not found
const route = useRoute();
const { data: page, refresh: refreshPage } = await useAsyncData(() =>
  queryCollection("trips").path(route.path).first(),
);
useSiteHead(page.value);

if (!page.value && !isDev) {
  throw createError({ statusCode: 404 });
}

// merge with trip data
const date = page.value!.date;

const { $client } = useNuxtApp();
const { data } = await useAsyncData(() => $client.trip.query({ date }));

// Simple handlers for dev mode
async function createTrip() {
  if (!isDev) return;
  try {
    await $fetch("/api/trip", { method: "POST", body: { date } });
    await refreshPage();
  } catch (error) {
    console.error(error);
  }
}

async function deleteTrip() {
  if (!isDev) return;
  try {
    console.log("Deleting trip file...");
    await $fetch(`/api/trip?date=${date}`, { method: "DELETE" });
    await refreshPage();
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="prose-custom">
    <div v-if="isDev">
      <UButton v-if="page" @click="deleteTrip">delete</UButton>
      <UButton v-if="!page" @click="createTrip">create</UButton>
    </div>

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
