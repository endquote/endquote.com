<script setup lang="ts">
const page = (await useAsyncData(() => queryCollection("content").where("path", "=", "/trips").first())).data.value!;
useSiteHead(page);

// merge trip data and pages
const { $client } = useNuxtApp();
const tripData = await $client.trips.query();

const tripPages = (await useAsyncData(() => queryCollection("tripPages").all())).data.value!;

const trips = tripData.map((data) => {
  const page = tripPages.find((page) => page.date >= data.start.split("T")[0]! && page.date <= data.end.split("T")[0]!);
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
      <li v-for="trip in trips" :key="trip.data.eqId">
        <a v-if="trip.page" :href="`/${trip.page.stem}`">{{ "hi" }} - {{ "hi" }}</a>
        <div v-else>
          {{ "hi" }} -
          {{ "hi" }}
        </div>
      </li>
    </ul>
  </div>
</template>
