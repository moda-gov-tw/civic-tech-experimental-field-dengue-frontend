<template>
  <div class="flex column q-pt-md">
    <div>
      <q-select
        multiple
        class="text-h6 q-mb-xs"
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
    </div>
    <div v-if="!filterTasks && ready" class="text-h6 text-center">
      目前尚無任何呼叫
    </div>

    <template v-for="(task, n) of filterTasks">
      <Transition>
        <template v-if="!task.hide">
          <q-slide-item @left="onLeft(n, $event)">
            <template v-slot:left>
              <div class="text-h6">隱藏</div>
            </template>
            <q-item
              class="column q-px-none q-my-xs"
              :class="task.received ? 'bg-green-1' : ''"
            >
              <div class="row">
                <div
                  class="col-auto flex flex-center relative-position"
                  style="width: 56px"
                >
                  <div
                    v-if="isController && !task.received"
                    class="absolute receiveConfirm flex item-center"
                  >
                    <q-btn
                      class="receivedBtn q-pa-sm"
                      size="md"
                      @click="received(n)"
                    >
                      已收到
                    </q-btn>
                  </div>
                  <q-checkbox
                    :disable="!isController"
                    size="xl"
                    class="text-h6"
                    v-model="task.status"
                    @update:model-value="updateStatus(n)"
                    :keep-color="true"
                    dense
                  ></q-checkbox>
                </div>
                <div class="col text-h6">
                  <div class="q-pl-sm">
                    <div @click="javascript:;">
                      {{ task.time }} -
                      {{ task.type }}
                      <template v-if="task.組別">({{ task.組別 }}組)</template>
                    </div>
                    <div
                      v-if="supplyItem(task.supply).length"
                      @click="javascript:;"
                    >
                      {{ supplyItem(task.supply).join(", ") }}
                    </div>
                    <div
                      class="q-pa-none q-ma-none text-primary text-h6 text-left"
                      @click.stop="open(task.target)"
                    >
                      {{ task.target }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- <q-checkbox
                :disable="!isController"
                size="xl"
                class="text-h6"
                v-model="task.status"
                @update:model-value="updateStatus(n)"
                :keep-color="true"
                dense
              >
                <div class="q-pl-sm">
                  <div @click="javascript:;">
                    {{ task.time }} -
                    {{ task.type }}
                    <template v-if="task.組別">({{ task.組別 }}組)</template>
                  </div>
                  <div
                    v-if="supplyItem(task.supply).length"
                    @click="javascript:;"
                  >
                    {{ supplyItem(task.supply).join(", ") }}
                  </div>
                  <div
                    class="q-pa-none q-ma-none text-primary text-h6 text-left"
                    @click.stop="open(task.target)"
                  >
                    {{ task.target }}
                  </div>
                </div>
              </q-checkbox> -->
              <q-input
                outlined
                v-if="task.note"
                type="textarea"
                readonly
                autogrow
                v-model="task.note"
                class="q-mt-sm"
              >
              </q-input>
            </q-item>
          </q-slide-item>
        </template>
      </Transition>
    </template>
  </div>
</template>

<script setup>
import Store from "stores/default";
import { watchTasks, updateTask } from "src/libs/firebase";
import { ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import _ from "lodash";

const router = useRouter();
const $q = useQuasar();
const store = Store();
const tasks = ref(null);
const ready = ref(false);
const currentSection = storeToRefs(store).currentSection;
let stopWatch = ref(() => {});

const isController = router.currentRoute.value.path == "/controller";

const groups = computed(() => {
  return {
    組別: _.keys(_.groupBy(store.address, "組別")).filter(
      (v) => !!v && v != "undefined"
    ),
  };
});

const filterTasks = computed(() => {
  if (!tasks) return [];
  if (
    store.helpFilter.組別 &&
    store.helpFilter.組別.length &&
    !store.helpFilter.組別.includes(null)
  ) {
    let groups = _.map(store.helpFilter.組別, (o) => o);
    return _.filter(tasks.value, (task) => {
      return groups.includes(task.組別 + "");
    });
  } else {
    return tasks.value;
  }
});

function onLeft(n, { reset }) {
  if (!tasks.value[n].status) {
    reset();
    return;
  }
  if (!isController) {
    reset();
    return;
  }
  tasks.value[n].hide = true;
  updateStatus(n);
}
async function updateStatus(n) {
  await updateTask(currentSection.value.label, n, tasks.value[n]);
  $q.notify("更新成功");
}
async function received(n) {
  tasks.value[n].received = true;
  await updateTask(currentSection.value.label, n, tasks.value[n]);
  $q.notify("收到呼叫");
}

handleWatchTasks(store.currentSection);
watch(currentSection, (val) => {
  handleWatchTasks(val);
});

function handleWatchTasks(section) {
  stopWatch.value();
  if (section && section.label) {
    stopWatch.value = watchTasks(section.label, (data) => {
      tasks.value = data || null;
      ready.value = true;
    });
  }
}

function supplyItem(supply) {
  if (!supply) {
    return [];
  }
  return Object.keys(supply).filter((type) => supply[type] === true);
}

function open(target) {
  window.open(`https://www.google.com/maps/search/台南市${target}`, "_blank");
}
</script>

<style lang="scss" scoped>
.text-h6 {
  font-size: 18px !important;
  line-height: 24px !important;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.receiveConfirm {
  // width: 100%;
  // height: 100%;
  width: 80px;

  left: 0;
  z-index: 999;
}
.receivedBtn {
  background-color: #4caf50de;
  color: white;
}
</style>
