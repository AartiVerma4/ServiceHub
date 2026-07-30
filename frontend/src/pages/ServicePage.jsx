import React from "react";
import cleanImg from "../assets/clean.jpg";
import plumbingImg from "../assets/plumbing.jpg";
import electricalImg from "../assets/electrical.jpg";
import beautyImg from "../assets/beauty.jpg";
import homeImpImg from "../assets/home.jpg";

const services = [
  {
    img: cleanImg,
    label: "Cleaning & Maintenance",
    price: "From $50",
    color: "from-green-100 to-green-50"
  },
  {
    img: plumbingImg,
    label: "Plumbing & Repairs",
    price: "From $75",
    color: "from-blue-100 to-teal-50"
  },
  {
    img: electricalImg,
    label: "Electrical Services",
    price: "From $60",
    color: "from-yellow-100 to-green-50"
  },
  {
    img: beautyImg,
    label: "Beauty & Wellness",
    price: "From $40",
    color: "from-pink-100 to-teal-50"
  },
  {
    img: homeImpImg,
    label: "Home Improvement",
    price: "From $100",
    color: "from-teal-100 to-green-50"
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-10 font-montserrat tracking-tight">
        Our Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {services.map((service, i) => (
          <div
            key={service.label}
            className={`
              bg-gradient-to-br ${service.color} rounded-2xl p-6 shadow-lg
              flex flex-col items-center text-center transition hover:scale-105 hover:shadow-2xl
              border-t-4 border-green-100 hover:border-teal-400
            `}
          >
            <img
              src={service.img}
              alt={service.label}
              className="w-20 h-20 object-cover rounded-full shadow mb-4 border-4 border-white"
            />
            <div className="font-semibold text-lg text-gray-800 mb-2 font-montserrat">{service.label}</div>
            <div className="text-green-600 font-bold text-base bg-green-50 rounded-full px-3 py-1 mt-1">
              {service.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
