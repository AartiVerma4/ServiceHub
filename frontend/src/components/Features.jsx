import React from "react";
import { CheckCircle } from "react-bootstrap-icons"; // Optional, Bootstrap icons

const features = [
  {
    icon: <CheckCircle color="#22c55e" size={48} />, // or use your own image/icon
    title: "Growing Fast",
    description: "More cities and services added every month."
  },
  {
    icon: <CheckCircle color="#22c55e" size={48} />, 
    title: "100% Secure",
    description: "Verified professionals and safe payments for every order."
  },
  {
    icon: <CheckCircle color="#22c55e" size={48} />, 
    title: "Award Winning",
    description: "Recognized for service excellence and customer support."
  }
];

const Features = () => (
  <section className="container my-5 py-4">
    <div className="row text-center">
      {features.map((f, i) => (
        <div key={i} className="col-md-4 mb-4">
          <div className="mb-3">{f.icon}</div>
          <h5>{f.title}</h5>
          <p className="text-muted">{f.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;