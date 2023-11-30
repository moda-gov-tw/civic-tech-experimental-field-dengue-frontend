<template>
  <div v-if="info">
    <q-select
      multiple
      class="text-h6 q-mb-md q-mt-md"
      popup-content-class="text-h6"
      size="lg"
      label="關注組別"
      outlined
      v-model="store.helpFilter.組別"
      :options="[
        null,
        ...groups.組別.sort((a, b) => parseInt(a) - parseInt(b)),
      ]"
      emit-value
      map-options
      clearable
    >
      <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
        <q-item v-bind="itemProps" class="q-py-none">
          <q-item-section>
            <q-item-label v-html="opt" />
          </q-item-section>
          <q-item-section side>
            <q-toggle
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
            />
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-table
      title-class="q-pa-none q-ma-none"
      :rows="info.groups"
      :columns="columns"
      row-key="name"
      table-header-class="td-size"
      :rows-per-page-options="[0]"
      hide-pagination
    >
      <template v-slot:body-cell="props">
        <q-td :props="props" :class="isDown(props.row)">
          <span
            class="text-h6"
            :class="isLink(props.col.name) ? 'underline' : ''"
            @click="go({ 組別: props.row.組別, worker: props.col.name })"
          >
            {{ props.value }}
          </span>
          <span
            class="text-subtitle2 text-deep-orange-5"
            v-if="props.col.name == 'spray' && props.row.sprayFail"
          >
            ({{ props.row.sprayFail }})
          </span>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { asyncComputed } from "@vueuse/core";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import _ from "lodash";
import Store from "stores/default";

const store = Store();
const router = useRouter();

const columns = [
  {
    classes: "td-size",
    name: "組別",
    label: "組別",
    field: "組別",
    style: "width:60px",
    sortable: true,
  },
  {
    classes: "td-size",
    name: "total",
    label: "筆數",
    field: "total",
    style: "width:60px",
    sortable: true,
  },
  // {
  //   classes: "td-size",
  //   name: "preCheck",
  //   label: "貼單",
  //   field: "preCheck",
  // },

  {
    classes: "td-size",
    name: "spray",
    label: "孳清化噴",
    field: "spray",
    style: "width:60px",
    sortable: true,
  },
];
const info = asyncComputed(async () => {
  if (!store.currentSection) return [];

  store.helpFilter.組別;

  store.address = await store.getSectionAddress(store.currentSection.label);
  let address = store.address;

  if (
    store.helpFilter.組別 &&
    store.helpFilter.組別.length &&
    !store.helpFilter.組別.includes(null)
  ) {
    address = _.filter(address, (o) => store.helpFilter.組別.includes(o.組別));
  }

  let groups = _.groupBy(address, "組別");

  groups = _.map(groups, (address) => {
    let total = address;
    let spray = _.filter(address, (o) => {
      return o.report?.spray?.完成;
    });
    let preCheck = _.filter(address, (o) => {
      return o.report?.preCheck?.完成;
    });
    let sprayFail = _.filter(address, (o) => {
      return o.report?.spray?.action && o.report?.spray?.action != "完全噴射";
    });

    return {
      組別: address[0].組別 || "-",
      total: total.length,
      preCheck: preCheck.length,
      spray: spray.length,
      sprayFail: sprayFail.length,
    };
  });

  let total = address;
  let preCheck = _.filter(address, {
    report: { preCheck: { 完成: true } },
  });
  let spray = _.filter(address, (o) => {
    return o.report?.spray?.完成;
  });
  let sprayFail = _.filter(address, (o) => {
    return o.report?.spray?.action && o.report?.spray?.action != "完全噴射";
  });

  groups.push({
    組別: "總計",
    total: total.length,
    preCheck: preCheck.length,
    spray: spray.length,
    sprayFail: sprayFail.length,
  });

  return {
    groups,
    total: total.length,
    preCheck: preCheck.length,
    spray: spray.length,
  };
});

const groups = computed(() => {
  return {
    組別: _.keys(_.groupBy(store.address, "組別")).filter(
      (v) => !!v && v != "undefined"
    ),
  };
});

function isDown(row) {
  return row.spray == row.total ? "bg-green-1" : "";
}

function isLink(key) {
  switch (key) {
    case "spray":
      return true;
  }
  return false;
}

function go({ 組別, worker }) {
  if (isLink(worker)) {
    store.addressFilter.組別 = 組別;
    switch (worker) {
      case "spray":
        store.worker = "孳清噴藥";
        break;
    }
    router.push("/list");
  }
}
</script>

<style scopred></style>
