import address from "./address.json";
import fs from "fs";
(async () => {
  let 日期 = "2023-09-28";
  let 場次 = "安平區天妃里下午場";
  let 組別 = 1;
  address.forEach((item) => {
    item.地址 = `${item.區別 || ""}${item.里別 || ""}${item.路 || ""}${
      item.巷 || ""
    }${item.號 || ""}`;

    item.組別 = item.組別 || 組別;
    item.日期 = 日期;
    item.場次 = 場次;
    item.組別 = item.組別;
    組別 = item.組別;
  });

  await fs.writeFileSync(`./${場次}.json`, JSON.stringify(address));
})();
