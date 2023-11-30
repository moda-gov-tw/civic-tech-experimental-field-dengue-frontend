<template>
  <q-card style="max-width: 80vw">
    <q-card-section style="max-height: 80vh" class="scroll">
      <div class="row q-gutter-md flex flex-center">
        <template v-for="(file, index) in files">
          <q-img
            class="col-6 cursor-pointer shadow-2"
            height="200px"
            width="300px"
            :src="file.url"
            fit="cover"
            @click="open(file.url)"
          >
            <div class="absolute-bottom text-center padding">
              {{ file.time }}
              <div v-if="file.type">
                {{ file.type }}
                <span v-if="file.note">({{ file.note }})</span>
              </div>
            </div>
          </q-img>
        </template>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn color="primary" @click="close">關閉</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import _ from "lodash";
import Store from "stores/default";
import { ref } from "vue";

const { files } = defineProps(["files"]);
const emit = defineEmits(["close"]);

function close() {
  emit("close");
}

function open(url) {
  window.open(url, "_blank");
}
</script>

<style scoped>
.padding {
  padding: 10px !important;
}
</style>
