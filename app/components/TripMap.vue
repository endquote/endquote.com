<template>
  <ClientOnly>
    <div class="h-96 w-full">
      <MglMap :map-style="style" :center="center" :zoom="zoom">
        <MglNavigationControl />
      </MglMap>
    </div>
  </ClientOnly>
</template>

<script setup>
const style = "https://api.maptiler.com/maps/streets/style.json?key=ou5Vg0SLNIKZfcTCphLR";
const center = [-1.559482, 47.21322];
const zoom = 8;
</script>
