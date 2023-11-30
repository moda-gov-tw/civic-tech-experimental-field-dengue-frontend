import { Dialog } from "quasar";

async function qConfirm({ title, message, size = "md" }) {
  return new Promise((done) => {
    Dialog.create({
      title,
      message,
      cancel: true,
      persistent: true,
      class: size == "lg" ? "text-h6" : "",
      ok: {
        flat: true,
        size,
      },
      cancel: {
        flat: true,
        color: "red-5",
        size,
      },
    })
      .onOk(() => {
        done(true);
      })
      .onCancel(() => {
        done(false);
      });
  });
}

export default qConfirm;
