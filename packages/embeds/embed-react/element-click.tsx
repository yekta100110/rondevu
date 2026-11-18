/**
 * @fileoverview This file is an example file and tells how to use the element-click popup embed in a React application. This is also used by playwright e2e
 */
import { useEffect } from "react";
import * as React from "react";
import ReactDom from "react-dom";

import { getRondevuApi } from "./src/index";

const rondevuNamespace = "element-click";
function App() {
  useEffect(() => {
    (async function () {
      const cal = await getRondevuApi({
        embedJsUrl: "http://localhost:3000/embed/embed.js",
        namespace: rondevuNamespace,
      });
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
      });
    })();
  }, []);
  return (
    <button
      data-rondevu-namespace={rondevuNamespace}
      data-rondevu-link="pro"
      data-rondevu-config='{"layout":"month_view", "theme":"dark", "useSlotsViewOnSmallScreen":"true"}'
    >
      Click me
    </button>
  );
}

ReactDom.render(<App />, document.getElementById("root"));
