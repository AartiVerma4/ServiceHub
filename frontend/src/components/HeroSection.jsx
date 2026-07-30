import React from "react";
import heroImg from "../assets/hero.jpg"; // Replace with your hero image

const Hero = () => (
  <section className="container py-5">
    <div className="row align-items-center">
      <div className="col-md-6">
        <h1 className="display-4" style={{ color: "#0ea5e9", fontWeight: 700 }}>
          Your Home Service Partner
        </h1>
        <p className="lead mb-4">
          Connect with trusted professionals for all your home service needs. Simple, secure, and reliable solutions delivered at your doorstep.
        </p>
        <a href="/services" className="btn btn-primary btn-lg me-3">
          Book Service Now
        </a>
        <a href="/auth" className="btn btn-success btn-lg">
          Join as Provider
        </a>
      </div>
      <div className="col-md-6 text-center">
        <img src={heroImg} alt="Home Services Banner" className="img-fluid rounded shadow" />
      </div>
    </div>
  </section>
);

export default Hero;