<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

const route = useRoute();

const res = await useAsyncData(() => queryCollection("roles").path(route.path).first());

if (!res.data.value) {
  throw createError({ statusCode: 404 });
}

const role = res.data.value!;

useSiteHead(role);

const roleId = role.stem.split("/").pop();
const projects = (
  await useAsyncData(() => queryCollection("projects").where("role", "=", roleId).order("date", "DESC").all())
).data.value;
</script>

<template>
  <div class="prose-custom">
    <h1 v-if="role.link">
      <NuxtLink :href="role.link" class="not-prose">{{ role.company }}</NuxtLink>
    </h1>
    <h1 v-else>{{ role.company }}</h1>
    <h2>{{ role.title }}</h2>
    <p>
      {{ role.location }}, {{ useDateFormat(role.date, "YYYY") }}-<template v-if="role.end">{{
        useDateFormat(role.end, "YYYY")
      }}</template
      ><template v-else>present</template>
    </p>
    <ContentRenderer :value="role" />
  </div>
  <ProjectGrid :projects="projects" />
</template>
