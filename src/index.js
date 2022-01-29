import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts

import Auth from "layouts/Auth.js";

// views without layouts

import Landing from "views/Landing.js";
import Products from "views/Products.js";
import TrackOrders from "views/TrackOrders";
import Profile from "views/Profile.js";
import Index from "views/Index.js";

// ant design
import "antd/dist/antd.css";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* add routes with layouts */}
      <Route path="/auth" component={Auth} />
      {/* add routes without layouts */}
      <Route path="/landing" exact component={Landing} />
      <Route path="/romantic_baboy" exact component={Products} />
      <Route path="/macarthur" exact component={Products} />
      <Route path="/infinitee_pares" exact component={Products} />
      <Route path="/rider-profile" exact component={Profile} />
      <Route path="/track-orders" exact component={TrackOrders} />

      <Route path="/" exact component={Index} />
      {/* add redirect for first page */}
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
