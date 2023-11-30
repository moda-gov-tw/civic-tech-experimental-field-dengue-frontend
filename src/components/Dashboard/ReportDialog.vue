<template>
  <q-card style="width: 400px">
    <q-card-section style="max-height: 50vh" class="scroll">
      <div ref="reportSection"></div>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn color="primary" @click="download">下載</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import _ from "lodash";
import Store from "stores/default";
import { onMounted, ref, computed } from "vue";
import tjth from "transform-json-to-html";

const store = Store();
const report = ref({});
const emit = defineEmits(["close"]);
const { section } = defineProps(["section"]);
const reportSection = ref(null);

const itemOptions = [
  "花瓶",
  "各式底盤",
  "水溝",
  "水塔、冷卻水塔",
  "帆布、塑膠布",
  "桶、缸、甕、盆",
  "保麗龍、箱盤、塑膠籃",
  "馬桶、水箱",
  "杯、瓶、碗、罐、盒",
  "地下室、防空洞",
  "輪胎",
  "其他",
];

onMounted(async () => {
  await getReport(section);
  reportSection.value.appendChild(
    tjth.transform(report.value, { depth: 10, collapseDepth: 10 })
  );
});

async function getReport(section) {
  let address = await store.getSectionAddress(section);

  let 陽性戶 = [];
  let 積水容器 = [];
  let 壓罐數量 = 0;
  let 衛教人數 = 0;
  address.forEach((row) => {
    if (_.some(row.report?.spray?.積水容器, "陽性")) {
      陽性戶.push(row);
    }
    if (row.report?.spray?.積水容器?.length) {
      積水容器 = [...積水容器, ...row.report?.spray?.積水容器];
    }
    if (_.some(row.report?.rid?.積水容器, "陽性")) {
      陽性戶.push(row);
    }
    if (row.report?.rid?.積水容器?.length) {
      積水容器 = [...積水容器, ...row.report?.rid?.積水容器];
    }
    if (row.report?.spray?.壓罐數量) {
      壓罐數量 += row.report?.spray?.壓罐數量 || 0;
    }
    if (row.report?.spray?.衛教人數) {
      衛教人數 += row.report?.spray?.衛教人數 || 0;
    }
  });

  let 積水容器種類 = _.groupBy(積水容器, "容器");

  let 積水容器統計 = {};
  itemOptions.forEach((key) => {
    積水容器統計[key] = {
      戶外積水容器:
        積水容器種類[key]?.filter((o) => o.位置 == "戶外").length || 0,
      戶內積水容器:
        積水容器種類[key]?.filter((o) => o.位置 == "戶內").length || 0,
      戶外陽性容器:
        積水容器種類[key]?.filter((o) => o.位置 == "戶外" && o.陽性).length ||
        0,
      戶內陽性容器:
        積水容器種類[key]?.filter((o) => o.位置 == "戶內" && o.陽性).length ||
        0,
    };
  });

  report.value = {
    調查戶數: address.length,
    衛教人數,
    陽性戶數: 陽性戶.length,
    壓罐數量,
    積水容器統計,
    積水容器數: {
      全部: 積水容器.length,
      戶內: 積水容器.filter((o) => o.位置 == "戶內").length,
      戶外: 積水容器.filter((o) => o.位置 == "戶外").length,
    },
    陽性容器數: {
      全部: 積水容器.filter((o) => o.陽性).length,
      戶內: 積水容器.filter((o) => o.位置 == "戶內" && o.陽性).length,
      戶外: 積水容器.filter((o) => o.位置 == "戶外" && o.陽性).length,
    },
    成蟲數: {
      埃及斑紋: 積水容器.reduce((a, b) => a + (b.埃及斑紋成蟲 || 0), 0),
      白線斑紋: 積水容器.reduce((a, b) => a + (b.白線斑紋成蟲 || 0), 0),
    },
    幼蟲數: {
      埃及斑紋: 積水容器.reduce((a, b) => a + (b.埃及斑紋幼蟲 || 0), 0),
      白線斑紋: 積水容器.reduce((a, b) => a + (b.白線斑紋幼蟲 || 0), 0),
    },
    陽性戶: 陽性戶.map((o) => o.地址),
    化噴狀況: {
      完全噴射: {
        全部: address.filter((o) => o.report?.spray?.action == "完全噴射")
          .length,
        一般: address.filter(
          (o) =>
            o.report?.spray?.action == "完全噴射" &&
            o.report?.spray?.type == "一般"
        ).length,
        不在戶: address.filter(
          (o) =>
            o.report?.spray?.action == "完全噴射" &&
            o.report?.spray?.type == "不在戶"
        ).length,
        空戶: address.filter(
          (o) =>
            o.report?.spray?.action == "完全噴射" &&
            o.report?.spray?.type == "空戶"
        ).length,
        空地: address.filter(
          (o) =>
            o.report?.spray?.action == "完全噴射" &&
            o.report?.spray?.type == "空地"
        ).length,
        其他: address.filter(
          (o) =>
            o.report?.spray?.action == "完全噴射" &&
            o.report?.spray?.type == "其他"
        ).length,
        無填寫: address.filter(
          (o) => o.report?.spray?.action == "完全噴射" && !o.report?.spray?.type
        ).length,
      },
      部分噴射: address.filter((o) => o.report?.spray?.action == "部分噴射")
        .length,
      無噴射: {
        全部: address.filter((o) => o.report?.spray?.action == "無噴射").length,
        "⺠眾拒絕": address.filter(
          (o) =>
            o.report?.spray?.action == "無噴射" &&
            o.report?.spray?.fail == "⺠眾拒絕"
        ).length,
        "不在戶(無法開鎖)": address.filter(
          (o) =>
            o.report?.spray?.action == "無噴射" &&
            o.report?.spray?.fail == "不在戶(無法開鎖)"
        ).length,
        "空戶(無法開鎖)": address.filter(
          (o) =>
            o.report?.spray?.action == "無噴射" &&
            o.report?.spray?.fail == "空戶(無法開鎖)"
        ).length,
        其他: address.filter(
          (o) =>
            o.report?.spray?.action == "無噴射" &&
            o.report?.spray?.fail == "其他"
        ).length,
        無填寫: address.filter(
          (o) => o.report?.spray?.action == "無噴射" && !o.report?.spray?.fail
        ).length,
      },
    },
  };
}

function download() {
  let data = flattenObject(report.value);
  let csv = _.map(data, (v, k) => `"${k}","${v}"`).join("\n");
  let blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  let url = URL.createObjectURL(blob);
  let pom = document.createElement("a");
  pom.href = url;
  pom.setAttribute("download", section + "孳清噴藥結果數據.csv");
  pom.click();
}

function flattenObject(o, prefix = "", result = {}, keepNull = true) {
  if (
    _.isString(o) ||
    _.isNumber(o) ||
    _.isBoolean(o) ||
    (keepNull && _.isNull(o))
  ) {
    result[prefix] = o;
    return result;
  }

  if (_.isArray(o) || _.isPlainObject(o)) {
    for (let i in o) {
      let pref = prefix;
      if (_.isArray(o)) {
        pref = pref + `[${i}]`;
      } else {
        if (_.isEmpty(prefix)) {
          pref = i;
        } else {
          pref = prefix + "." + i;
        }
      }
      flattenObject(o[i], pref, result, keepNull);
    }
    return result;
  }
  return result;
}
</script>

<style></style>
