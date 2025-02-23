<script setup lang="ts">
import type { ProjectsCollectionItem } from "@nuxt/content";
import { useDateFormat } from "@vueuse/core";

const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("content").path(route.path).first());
useSiteHead(page.value, { image: page.value?.image });

// get all business roles
const { data: roles } = await useAsyncData(() => queryCollection("roles").order("date", "DESC").all());

const business = roles.value?.filter((role) => role.context?.includes("business")) || [];

// get projects associated with each role
const { data: roleProjects } = await useAsyncData(() =>
  queryCollection("projects")
    .select("title", "date", "stem", "role")
    .where(
      "role",
      "IN",
      business.map((r) => r.stem.split("/").pop()),
    )
    .order("date", "DESC")
    .all(),
);

// join projects to roles
for (const role of business) {
  role.meta.projects = roleProjects.value?.filter((p) => role.stem.endsWith(p.role));
}

// roles older than this are "additional experience"
const oldRoles = business.findIndex((role) => role.date < "2007-01-01");

// get all education roles
const education = roles.value?.filter((role) => role.context?.includes("educational"));

// get all honors
const { data: honors } = await useAsyncData(() => queryCollection("honors").order("date", "DESC").all());

// get all awards
const { data: awards } = await useAsyncData(() => queryCollection("awards").order("date", "DESC").all());

// get projects associated with each award
const awardProjects = (
  await useAsyncData(() =>
    queryCollection("projects")
      .select("title", "stem")
      .where(
        "stem",
        "IN",
        awards.value!.map((a) => `projects/${a.project.split("/").pop()}`),
      )
      .all(),
  )
).data.value!;

// join projects to awards
for (const award of awards.value!) {
  award.meta.project = awardProjects.find((p) => p.stem.endsWith(award.project));
}

// get all volunteer roles
const volunteer = roles.value?.filter((role) => role.context?.includes("volunteer"));

const printOnly = "hidden print:block";
const section = "mt-8 print:mt-0";
const grid = "grid grid-cols-4";
const colsL = "col-span-4 md:col-span-1";
const colsR = "col-span-4 md:col-span-3";
const metaRow = "flex flex-col md:flex-row";
const metaLeft = "flex-1";
const metaRight = "flex-shrink-0";
</script>

<template>
  <div class="prose-custom">
    <div :class="grid">
      <div :class="colsL">
        <div :class="printOnly">
          <h4>Josh Santangelo</h4>
          <h6><a href="mailto:josh@endquote.com" class="no-underline">josh@endquote.com</a></h6>
          <h6><a href="https://endquote.com" class="no-underline">endquote.com</a></h6>
          <h6><a href="tel:+12062295674" class="no-underline">+1&nbsp;(206)&nbsp;229&#8209;5674</a></h6>
        </div>
      </div>
      <div :class="colsR">
        <h2 :class="['print:mt-4', 'mb-0']">{{ page?.description }}</h2>
      </div>
    </div>

    <div :class="section">
      <div v-for="(role, i) in business" :key="role.stem" :class="grid">
        <div :class="colsL" v-if="i < oldRoles">
          <template v-if="i === 0">
            <h2>Experience</h2>
          </template>
        </div>
        <div :class="colsR" v-if="i < oldRoles && roles">
          <h3 v-if="i === 0 || roles[i - 1]!.company !== role.company">{{ role.company }}</h3>
          <div :class="metaRow">
            <div :class="metaLeft">
              <NuxtLink v-if="(role.meta.projects as ProjectsCollectionItem[]).length" :to="role.stem">
                <strong>{{ role.title }}</strong>
              </NuxtLink><strong v-else>{{ role.title }}</strong>
            </div>
            <div :class="metaRight">
              {{ role.location }}, {{ useDateFormat(role.date, "YYYY") }}-<template v-if="role.end">{{
                useDateFormat(role.end, "YYYY")
                }}</template><template v-else>present</template>
            </div>
          </div>

          <ContentRenderer :value="role" />
        </div>
      </div>
    </div>

    <div :class="section">
      <div v-for="(role, i) in business" :key="role.stem" :class="grid">
        <div :class="colsL" v-if="i >= oldRoles">
          <template v-if="i === oldRoles">
            <h2>Additional Experience</h2>
          </template>
        </div>
        <div :class="colsR" v-if="i >= oldRoles && roles">
          <h3 v-if="i === 0 || roles[i - 1]!.company !== role.company">{{ role.company }}</h3>
          <div :class="metaRow">
            <div :class="metaLeft">
              <NuxtLink v-if="(role.meta.projects as ProjectsCollectionItem[]).length" :to="role.stem">
                <strong>{{ role.title }}</strong>
              </NuxtLink><strong v-else>{{ role.title }}</strong>
            </div>
            <div :class="metaRight">
              {{ role.location }}
            </div>
          </div>

          <ContentRenderer :value="role" />
        </div>
      </div>
    </div>

    <div :class="section">
      <div v-for="(edu, i) in education" :key="edu.stem" :class="grid">
        <div :class="colsL">
          <template v-if="i === 0">
            <h2>Education</h2>
          </template>
        </div>
        <div :class="colsR">
          <h3>{{ edu.company }}</h3>
          <div :class="metaRow">
            <div :class="metaLeft">
              <strong>{{ edu.title }}</strong>
            </div>
            <div :class="metaRight">
              {{ edu.location }}
            </div>
          </div>

          <ContentRenderer :value="edu" />
        </div>
      </div>
    </div>

    <div :class="section">
      <div v-for="(honor, i) in honors" :key="honor.stem" :class="grid">
        <div :class="colsL">
          <template v-if="i === 0">
            <h2>Honors</h2>
          </template>
        </div>
        <div :class="colsR">
          <div :class="metaRow">
            <div :class="metaLeft">
              <strong>{{ honor.title }}</strong>
            </div>
            <div :class="metaRight">{{ honor.company }}, {{ useDateFormat(honor.date, "YYYY") }}</div>
          </div>

          <ContentRenderer :value="honor" />
        </div>
      </div>
    </div>

    <div :class="[grid, section]">
      <div :class="colsL">
        <h2>Awards</h2>
      </div>
      <div :class="colsR">
        <ul>
          <li v-for="(award, i) in awards" :key="award.stem">
            <template v-if="award.link">
              <NuxtLink :to="award.link">{{ award.title }}</NuxtLink>
            </template>
            <template v-else>
              {{ award.title }}
            </template>
            - {{ award.company }},
            <NuxtLink :to="(award.meta.project as ProjectsCollectionItem).stem">{{
              (award.meta.project as ProjectsCollectionItem).title
              }}</NuxtLink>, {{ useDateFormat(award.date, "YYYY") }}
          </li>
        </ul>
      </div>
    </div>

    <div :class="[grid, section]">
      <div :class="colsL">
        <h2>Volunteering</h2>
      </div>
      <div :class="colsR">
        <ul>
          <li v-for="role in volunteer" :key="role.stem">
            {{ role.description }},
            <template v-if="role.link">
              <NuxtLink :to="role.link">{{ role.company }}</NuxtLink>
            </template>
            <template v-else> {{ role.company }} </template>, {{ useDateFormat(role.date, "YYYY") }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
