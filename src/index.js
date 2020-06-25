import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
window.React = React;

if (window.IS_DEVELOPMENT) {
  // Canvas supplies a theme by default; in development mode,
  // we have to load our own theme before rendering
  import("@instructure/canvas-theme").then(res => {
    ReactDOM.render(<App />, document.getElementById("root"));
  });
  require("./mocks");
}

export function render(domNode) {
  ReactDOM.render(<App />, domNode);
}
