const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const seedInitialData = async () => {
  try {
    const User = require("../models/User");
    const Service = require("../models/Service");
    const Category = require("../models/Category");

    // ── Admin ──────────────────────────────────────────────────
    const adminEmail = "admin@servicehub.com";
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash("admin123", salt);
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "Super Admin",
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: "admin",
      });
      console.log("--> Default admin created: admin@servicehub.com / admin123");
    } else {
      admin.passwordHash = adminPasswordHash;
      admin.role = "admin";
      await admin.save();
      console.log("--> Admin password reset to: admin123");
    }

    // ── Demo Customer ─────────────────────────────────────────
    const customerEmail = "customer@servicehub.com";
    const customerPasswordHash = await bcrypt.hash("password123", salt);
    let customer = await User.findOne({ email: customerEmail });
    if (!customer) {
      await User.create({
        name: "Rahul Sharma",
        email: customerEmail,
        passwordHash: customerPasswordHash,
        phone: "+91 99887 76655",
        role: "customer",
      });
      console.log("--> Demo customer created: customer@servicehub.com / password123");
    } else {
      customer.passwordHash = customerPasswordHash;
      await customer.save();
      console.log("--> Demo customer password reset to: password123");
    }

    // ── Categories ────────────────────────────────────────────
    const categoryDefs = [
      { name: "Salon & Spa",              slug: "salon-spa",        icon: "Sparkles" },
      { name: "Cleaning",                 slug: "cleaning",         icon: "Sparkle"  },
      { name: "AC & Appliance Repair",    slug: "ac-repair",        icon: "Wind"     },
      { name: "Plumbing",                 slug: "plumbing",         icon: "Wrench"   },
      { name: "Electrician",              slug: "electrician",      icon: "Zap"      },
      { name: "Pest Control",             slug: "pest-control",     icon: "Bug"      },
    ];
    for (const c of categoryDefs) {
      await Category.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
    }

    // ── Services ─────────────────────────────────────────────
    const count = await Service.countDocuments();
    if (count === 0) {
      const catMap = {};
      const cats = await Category.find();
      cats.forEach(c => { catMap[c.slug] = c; });

      await Service.insertMany([
        {
          name: "Full Home Deep Cleaning",
          categoryId: catMap["cleaning"]?._id,
          category: "Cleaning",
          subCategory: "Deep Cleaning",
          basePrice: 1499,
          durationMinutes: 180,
          description: "Complete 360° deep cleaning & sanitization for 2BHK/3BHK apartments using industrial equipment.",
          includedFeatures: ["Kitchen degreasing", "Bathroom stain removal", "Floor scrubbing", "Balcony wash"],
          isPopular: true,
          rating: { average: 4.9, count: 312 },
        },
        {
          name: "Luxury Salon Facial & Glow",
          categoryId: catMap["salon-spa"]?._id,
          category: "Salon & Spa",
          subCategory: "Facials",
          basePrice: 799,
          durationMinutes: 60,
          description: "Organic skin-brightening, deep pore cleansing and diamond radiance glow facial at your home.",
          includedFeatures: ["Single-use hygienic kit", "O3+ certified products", "Face & neck massage"],
          isPopular: true,
          rating: { average: 4.8, count: 245 },
        },
        {
          name: "Salon at Home – Full Package",
          categoryId: catMap["salon-spa"]?._id,
          category: "Salon & Spa",
          subCategory: "Full Package",
          basePrice: 1299,
          durationMinutes: 120,
          description: "Hair cut, blow-dry, waxing and facial combo package by certified beauty experts.",
          includedFeatures: ["Premium products only", "Sanitized tools", "Certified beautician"],
          isPopular: true,
          rating: { average: 4.7, count: 189 },
        },
        {
          name: "AC Power Jet Wash Service",
          categoryId: catMap["ac-repair"]?._id,
          category: "AC & Appliance Repair",
          subCategory: "AC Service",
          basePrice: 499,
          durationMinutes: 45,
          description: "High-pressure jet cleaning with anti-bacterial foam for 2× faster cooling efficiency.",
          includedFeatures: ["Filter cleaning", "Drain pipe flush", "Gas level check", "30-day warranty"],
          isPopular: true,
          rating: { average: 4.9, count: 428 },
        },
        {
          name: "AC Gas Refill & Repair",
          categoryId: catMap["ac-repair"]?._id,
          category: "AC & Appliance Repair",
          subCategory: "AC Repair",
          basePrice: 1199,
          durationMinutes: 90,
          description: "Complete gas top-up, thermostat check and cooling efficiency diagnostic by certified AC technician.",
          includedFeatures: ["R-32 / R-410A compatible", "Leak detection", "Gas pressure test"],
          isPopular: false,
          rating: { average: 4.8, count: 167 },
        },
        {
          name: "Plumbing Leak Repair",
          categoryId: catMap["plumbing"]?._id,
          category: "Plumbing",
          subCategory: "Repair",
          basePrice: 299,
          durationMinutes: 40,
          description: "Instant diagnosis and fix for dripping taps, concealed leaks, pipe fittings and blockages.",
          includedFeatures: ["Licensed plumber", "Free spare-part quote", "No-mess guarantee"],
          isPopular: false,
          rating: { average: 4.7, count: 203 },
        },
        {
          name: "Full Bathroom Plumbing Fix",
          categoryId: catMap["plumbing"]?._id,
          category: "Plumbing",
          subCategory: "Bathroom",
          basePrice: 799,
          durationMinutes: 90,
          description: "Shower head replacement, flush tank repair, tap change and complete bathroom plumbing overhaul.",
          includedFeatures: ["ISI-marked fittings", "Water pressure test", "Post-service clean-up"],
          isPopular: false,
          rating: { average: 4.6, count: 98 },
        },
        {
          name: "Fan & Switchboard Installation",
          categoryId: catMap["electrician"]?._id,
          category: "Electrician",
          subCategory: "Installation",
          basePrice: 199,
          durationMinutes: 30,
          description: "Safe installation of ceiling fans, modular switchboards, LED panel lights and MCB fitting.",
          includedFeatures: ["Background-checked electrician", "Insulated safety gear", "ISI-certified work"],
          isPopular: false,
          rating: { average: 4.8, count: 341 },
        },
        {
          name: "Full Home Electrical Checkup",
          categoryId: catMap["electrician"]?._id,
          category: "Electrician",
          subCategory: "Checkup",
          basePrice: 599,
          durationMinutes: 60,
          description: "Complete wiring audit, earthing test, overload protection check and short-circuit prevention.",
          includedFeatures: ["Certified electrician", "Thermal imaging test", "Safety report"],
          isPopular: false,
          rating: { average: 4.9, count: 112 },
        },
        {
          name: "Cockroach & Ant Pest Control",
          categoryId: catMap["pest-control"]?._id,
          category: "Pest Control",
          subCategory: "General",
          basePrice: 899,
          durationMinutes: 50,
          description: "Advanced gel-baiting technology safe for pets and young children. Odourless treatment.",
          includedFeatures: ["Herb-based spray", "90-day re-visit warranty", "Child & pet safe"],
          isPopular: true,
          rating: { average: 4.8, count: 276 },
        },
      ]);
      console.log("--> Seeded 10 services into database");
    }
  } catch (err) {
    console.error("Seeding initial data failed:", err.message);
  }
};

const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log("MongoDB connected to local/cloud database");
    await seedInitialData();
  } catch (err) {
    console.warn("Local MongoDB connection failed, starting MongoMemoryServer fallback...");

    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();

      await mongoose.connect(uri);
      console.log("MongoDB connected (In-Memory Database Server active)");
      await seedInitialData();
    } catch (fallbackErr) {
      console.error("Failed to start MongoMemoryServer:", fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
