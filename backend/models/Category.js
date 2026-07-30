const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: "Wrench" },
    image: { type: String, default: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" },
    description: { type: String, default: "Professional home service solutions" },
    popularCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
