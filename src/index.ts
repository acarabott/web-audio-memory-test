import { getElementById } from "./getElementById.js";
import { onReady } from "./onReady.js";

onReady(() => {
  const iframe = getElementById<HTMLIFrameElement>("iframe");
  const reload = getElementById<HTMLButtonElement>("reload");
  reload.onclick = () => {
    if (iframe.contentWindow !== null) {
      iframe.contentWindow.location.reload();
    }
  };
  const remove = getElementById<HTMLButtonElement>("remove");
  remove.onclick = () => {
    document.body.removeChild(iframe);
  };
});
