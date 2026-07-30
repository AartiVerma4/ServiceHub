const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Category = require("./models/Category");
const Service = require("./models/Service");
const Provider = require("./models/Provider");
const Coupon = require("./models/Coupon");

const seedData = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/servicehub";
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log("Connected to local MongoDB for seeding...");
    } catch (dbErr) {
      console.log("Local MongoDB not reachable, starting MongoMemoryServer fallback...");
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoMemoryServer for seeding!");
    }

    // Clear existing collections
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await Provider.deleteMany({});
    await Coupon.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash("password123", salt);

    // 1. Create Admin
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@servicehub.com",
      passwordHash: passHash,
      phone: "+91 98765 43210",
      role: "admin",
    });

    // 2. Create Demo Customer
    const customer = await User.create({
      name: "Rahul Sharma",
      email: "customer@servicehub.com",
      passwordHash: passHash,
      phone: "+91 99887 76655",
      role: "customer",
      addresses: [
        {
          title: "Home",
          street: "Connaught Place, Block B",
          city: "New Delhi",
          state: "Delhi",
          zip: "110001",
          lat: 28.6315,
          lng: 77.2167,
          isDefault: true,
        },
      ],
      subscription: {
        isPlus: true,
        planName: "ServiceHub Plus VIP",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        discountPercentage: 10,
      },
    });

    // 3. Create Categories
    const categoriesData = [
      { name: "Salon & Spa", slug: "salon-spa", icon: "Sparkles", description: "Salon, facial, waxing & massage services at your doorstep" },
      { name: "Cleaning & Sanitization", slug: "cleaning", icon: "Sparkle", description: "Deep house cleaning, sofa, carpet & bathroom scrubbing" },
      { name: "AC & Appliance Repair", slug: "appliance-repair", icon: "Wind", description: "Repair & maintenance for ACs, washing machines, refrigerators" },
      { name: "Plumbing Services", slug: "plumbing", icon: "Wrench", description: "Pipe leaks, tap replacement, drainage & bathroom fittings" },
      { name: "Electrician Services", slug: "electrician", icon: "Zap", description: "Wiring, switchboards, fans, lightings & MCB repairs" },
      { name: "Pest Control", slug: "pest-control", icon: "Bug", description: "Child-safe, odourless cockroach, ant & termite extermination" },
    ];
    const createdCategories = await Category.insertMany(categoriesData);

    // 4. Create Services
    const servicesData = [
      {
        name: "Full Home Deep Cleaning",
        categoryId: createdCategories[1]._id,
        category: "Cleaning & Sanitization",
        subCategory: "Deep Cleaning",
        basePrice: 1499,
        durationMinutes: 180,
        description: "Complete 360-degree deep cleaning and sanitization for 2BHK/3BHK apartments using industrial equipment.",
        includedFeatures: ["Kitchen degreasing", "Bathroom stain removal", "Floor scrubbing", "Dusting & balcony wash"],
        isPopular: true,
      },
      {
        name: "Luxury Salon Facial & Glow Treatment",
        categoryId: createdCategories[0]._id,
        category: "Salon & Spa",
        subCategory: "Facials",
        basePrice: 799,
        durationMinutes: 60,
        description: "Organic skin whitening, deep pore cleansing, and diamond radiance glow facial.",
        includedFeatures: ["Single-use hygienic kit", "O3+ certified products", "Face & neck massage"],
        isPopular: true,
      },
      {
        name: "AC Foam & Power Jet Wash Service",
        categoryId: createdCategories[2]._id,
        category: "AC & Appliance Repair",
        subCategory: "AC Service",
        basePrice: 499,
        durationMinutes: 45,
        description: "High-pressure jet pump cleaning with anti-bacterial foam treatment for 2x faster cooling.",
        includedFeatures: ["Filter cleaning", "Drain pipe flush", "Gas level check", "30-day warranty"],
        isPopular: true,
      },
      {
        name: "Plumbing Leak Inspection & Repair",
        categoryId: createdCategories[3]._id,
        category: "Plumbing Services",
        subCategory: "Repair",
        basePrice: 299,
        durationMinutes: 40,
        description: "Instant diagnosis and fix for dripping taps, concealed pipe leaks, and blockages.",
        includedFeatures: ["Licensed plumber", "Free spare part quote", "No mess guarantee"],
        isPopular: false,
      },
      {
        name: "Switchboard & Fan Installation",
        categoryId: createdCategories[4]._id,
        category: "Electrician Services",
        subCategory: "Installation",
        basePrice: 199,
        durationMinutes: 30,
        description: "Safe installation of ceiling fans, modular switchboards, LED panel lights.",
        includedFeatures: ["Background checked electrician", "Insulated safety equipment"],
        isPopular: false,
      },
      {
        name: "Odourless Cockroach & Ant Control",
        categoryId: createdCategories[5]._id,
        category: "Pest Control",
        subCategory: "General Pest Control",
        basePrice: 899,
        durationMinutes: 50,
        description: "Advanced gel baiting technology safe for pets and young children.",
        includedFeatures: ["Herb-based spray", "90-day warranty", "Free re-visit if pests return"],
        isPopular: true,
      },
    ];
    await Service.insertMany(servicesData);

    // 5. Create Verified Service Providers
    const provUser1 = await User.create({
      name: "Amit Kumar (Master Technician)",
      email: "provider@servicehub.com",
      passwordHash: passHash,
      phone: "+91 98112 23344",
      role: "provider",
    });

    await Provider.create({
      userId: provUser1._id,
      bio: "10+ years experienced certified AC and Electrical master technician.",
      experienceYears: 10,
      kycStatus: "approved",
      kycDocs: [{ docType: "Aadhaar Card", url: "https://example.com/aadhaar.pdf" }],
      skills: [createdCategories[2]._id, createdCategories[4]._id],
      rating: { average: 4.9, count: 48 },
      location: { type: "Point", coordinates: [77.2167, 28.6315] },
      availability: { isOnline: true, workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], startHour: 8, endHour: 20 },
      earnings: { total: 42500, pendingPayout: 5400, completedJobsCount: 32 },
    });

    const provUser2 = await User.create({
      name: "Priya Verma (Beauty Expert)",
      email: "priya@servicehub.com",
      passwordHash: passHash,
      phone: "+91 97113 34455",
      role: "provider",
    });

    await Provider.create({
      userId: provUser2._id,
      bio: "Certified salon artist specializing in bridal facials, hair styling, and skincare.",
      experienceYears: 6,
      kycStatus: "approved",
      kycDocs: [{ docType: "Voter ID", url: "https://example.com/voter.pdf" }],
      skills: [createdCategories[0]._id],
      rating: { average: 4.95, count: 62 },
      location: { type: "Point", coordinates: [77.209, 28.6139] },
      availability: { isOnline: true, workingDays: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"], startHour: 9, endHour: 19 },
      earnings: { total: 68900, pendingPayout: 8200, completedJobsCount: 54 },
    });

    // 6. Create Coupons
    await Coupon.create({
      code: "WELCOME50",
      discountPercentage: 50,
      maxDiscount: 300,
      minBookingAmount: 499,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    await Coupon.create({
      code: "FESTIVE20",
      discountPercentage: 20,
      maxDiscount: 500,
      minBookingAmount: 799,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    console.log("--> Comprehensive seed complete!");
    console.log("    Admin: admin@servicehub.com / password123");
    console.log("    Customer: customer@servicehub.com / password123");
    console.log("    Provider: provider@servicehub.com / password123");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedData();
