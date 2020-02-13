import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

import Main from "./Main";
import { createMemoryHistory } from "history";

const history = createMemoryHistory();

ReactDOM.render(
  <Router history={history}>
    <Main />
  </Router>,
  document.getElementById("root")
);
