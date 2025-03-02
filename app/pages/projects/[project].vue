<script setup lang="ts">
import LightBox from "~/components/LightBox.vue";

const route = useRoute();
const { data: project } = await useAsyncData(() => queryCollection("projects").path(route.path).first());
if (!project.value) {
  throw createError({ statusCode: 404 });
}

const projectId = project.value.stem.split("/").pop()!;

useSiteHead(project.value, { image: `/do/projects/${projectId}/project.jpg` });

const role = (
  await useAsyncData(() =>
    queryCollection("roles")
      .select("title", "company", "path", "stem")
      .where("stem", "LIKE", `%${project.value?.role}`)
      .first(),
  )
).data.value!;
</script>

<template>
  <div>
    <div v-if="project" class="prose-custom">
      <h1 class="mb-2">{{ project.title }}</h1>
      <div class="mb-5 italic">{{ project.subtitle }}</div>
      <div class="grid grid-cols-3 gap-x-7">
        <div class="col-span-3 md:col-span-2">
          <ContentRenderer :value="project" />
        </div>
        <div class="col-span-3 md:col-span-1">
          <div v-if="project.link">
            <p>
              <span class="font-bold">View project: </span>
              <NuxtLink :href="project.link">{{ project.linkText }}</NuxtLink>
            </p>
          </div>
          <div>
            <p>
              <span class="font-bold">Role: </span
              ><NuxtLink :href="role.path">{{ role.title }} at {{ role.company }}</NuxtLink>
            </p>
          </div>
          <p v-if="project.client">
            <span class="font-bold">Client: </span
            ><span v-if="project.client && project.clientLink">
              <NuxtLink :href="project.clientLink">{{ project.client }}</NuxtLink>
            </span>
            <span v-else-if="project.client">
              {{ project.client }}
            </span>
          </p>
          <p v-if="project.technologies">
            <span class="font-bold">Technologies: </span
            ><span v-for="(tech, index) in project.technologies" :key="tech">
              {{ tech }}<template v-if="index < project.technologies.length - 1">, </template>
            </span>
          </p>
        </div>
      </div>
    </div>

    <VideoPlayer
      v-if="project?.video"
      :playlist="`/do/projects/${projectId}/hls/playlist.m3u8`"
      :skip="project.skip"
      :auto-play="false"
      :audio="project.audio ? true : false"
      :poster="`/do/projects/${projectId}/poster.jpg`"
    />

    <LightBox
      v-if="project?.gallery?.length"
      :id="projectId"
      :images="project.gallery.map((i) => `/do/projects/${projectId}/gallery/${i}`)"
    />

    <div v-if="project && !project.gallery && !project.video">
      <div class="flex justify-center">
        <SiteImage
          :src="`/do/projects/${projectId}/project.jpg`"
          width="640"
          height="426"
          :alt="project.title"
          class="rounded-lg"
        />
      </div>
    </div>
  </div>
</template>
