import React from "react";
import appPromoImg from "../assets/app-promo.jpg"; // use your image
const AppPromoPage = () => (
  <div className="container my-5">
    <div className="row align-items-center">
      <div className="col-md-6">
        <h2>Get Our Mobile App</h2>
        <ul className="list-unstyled fs-5">
          <li>📅 <b>Easy Scheduling:</b> Book appointments with just a few taps.</li>
          <li>⚡ <b>Real-time Updates:</b> Track your service provider in real-time.</li>
          <li>❤️ <b>Favorite Providers:</b> Save and rebook with your preferred professionals.</li>
        </ul>
        <button className="btn btn-dark me-3">App Store</button>
        <button className="btn btn-dark">Google Play</button>
      </div>
      <div className="col-md-6 text-center">
        <img src={appPromoImg} alt="App Promo" className="img-fluid rounded shadow" />
      </div>
    </div>
  </div>
);

export default AppPromoPage;