<script setup lang="ts">
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~~/server/trpc/routers";

type RouterOutput = inferRouterOutputs<AppRouter>;
type TripOutput = NonNullable<RouterOutput["trips"]["trip"]>;
type FlightOutput = TripOutput["checkins"][number]["flight"];
type AirportOutput = TripOutput["flights"][number]["fromAirport"];

defineProps<{
  airport: AirportOutput | null;
  flight: FlightOutput | null;
}>();
</script>
<template>
  <span v-if="airport && flight">
    &nbsp;
    <span :class="{ 'line-through': flight.canceled }">
      <span v-if="airport.code === flight.fromAirport.code">🛬 {{ flight.toAirport.code }}</span>
      <span v-if="airport.code === flight.toAirport.code">🛫 {{ flight.fromAirport.code }}</span>
    </span>
  </span>
</template>
