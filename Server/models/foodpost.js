//IMPORT MONGOOSE
const mongoose = require("mongoose");

//SCHEMA CREATION
const FoodPostSchema = new mongoose.Schema({
  //FOOD TITLE
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  //FOOD DESCRIPTION
  description: {
    type: String,
    maxlength: 500,
  },

  //TYPES OF FOOD
  foodtype: {
    type: String,
    required: true,
    enum: [
      "prepared_food",
      "raw_ingridients",
      "packaged_food",
      "beverages",
      "other",
    ],
  },

  //HOW MUCH FOOD
  quantity: {
    type: String,
    required: true,
  },

  //WHERE THE FOOD IS LOCATED
  location: {
    address: {
      type: String,
      required: true,
    },

    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
  },

  //ARRAY OF FOOD IMAGES
  images: [
    {
      url: String,
      publicId: String,
    },
  ],

  //STATUS OF FOOD DONATION
  status: {
    type: String,
    enum: [
      "available",
      "unavailable",
      "accepted",
      "picked_up",
      "delivered",
      "canceled",
    ],
    default: "available",
  },

  //WHO POSTED THIS FOOD
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  //WHICH NGO ACCEPTED IT
  assignedNGO: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    default: null,
  },

  //ASSIGNED VOLUNTEER (if any)
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer",
    default: null,
  },

  //PICKUP PREFERENCES
  pickupTimePreference: {
    type: String,
    enum: ["morning", "afternoon", "evening", "anytime"],
    default: "anytime",
  },

  //SPECIAL INSTRUCTIONS
  specialInstructions: {
    type: String,
    maxlength: 300,
  },

  //CONTACT INFO
  contactInfo: {
    phone: String,
    alternatePhone: String,
    email: String,
    preferredContact: {
      type: String,
      enum: ["phone", "email", "both"],
      default: "phone",
    },
  },

  //DIETARY INFO
  isVegetarian: {
    // ✅ Fixed typo
    type: Boolean,
    default: false,
  },

  isVegan: {
    type: Boolean,
    default: false,
  },

  //VIEW COUNT
  views: {
    type: Number,
    default: 0,
  },

  //When food is available until
  availableUntil: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("foodpost", FoodPostSchema);
