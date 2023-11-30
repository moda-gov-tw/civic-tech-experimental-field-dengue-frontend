<template>
  <q-card>
    <q-card-section>
      <template v-for="(rows, group) of signs">
        <div class="text-h6">組別: {{ group }}</div>
        <div class="row q-col-gutter-sm">
          <div class="col-auto q-mb-md" v-for="row of rows">
            <q-img
              :src="row.sign"
              class="q-mb-xs"
              width="150px"
              height="80px"
              style="border: 1px solid #ddd"
            ></q-img>
            <div class="text-center text-subtitle1">
              {{ row.name }}
            </div>
            <div class="text-center text-subtitle1">
              {{ row.createdAt }}
            </div>
          </div>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { asyncComputed } from "@vueuse/core";
import { useQuasar } from "quasar";
import Store from "stores/default";
import _ from "lodash";

const props = defineProps(["section"]);
const store = Store();
const $q = useQuasar();

const signs = asyncComputed(async () => {
  if (!props.section) return [];
  let signs = await store.getSigns(props.section);
  signs = signs.map((o) => ({
    ...o,
    group: o.group || "無組別",
  }));
  let groups = _.groupBy(signs, "group");
  return groups;
});
</script>

<style scoped>
.text-subtitle1 {
  line-height: 1.2rem;
}
</style>
