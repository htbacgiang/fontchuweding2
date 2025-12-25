import mongoose from "mongoose";
import bcrypt from "bcrypt";

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["home", "office"],
    default: "home",
    required: "Please specify the address type.",
  },
  fullName: {
    type: String,
    required: "Please enter the recipient's full name.",
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: "Please enter a phone number.",
    match: [/^0[35789][0-9]{8}$/, "Please enter a valid Vietnamese phone number."],
  },
  address1: {
    type: String,
    required: "Please enter the address.",
    trim: true,
    maxlength: 200,
  },
  city: {
    type: String,
    required: "Please enter the city code.",
    trim: true,
  },
  cityName: {
    type: String,
    required: "Please enter the city name.",
    trim: true,
  },
  district: {
    type: String,
    required: "Please enter the district code.",
    trim: true,
  },
  districtName: {
    type: String,
    required: "Please enter the district name.",
    trim: true,
  },
  ward: {
    type: String,
    required: "Please enter the ward code.",
    trim: true,
  },
  wardName: {
    type: String,
    required: "Please enter the ward name.",
    trim: true,
  },
  country: {
    type: String,
    enum: ["Vietnam"],
    default: "Vietnam",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: "Device ID is required.",
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: "Please enter your full name.",
      trim: true,
    },
    email: {
      type: String,
      required: "Please enter your email address.",
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: "Please enter your phone number.",
      match: [/^0[35789][0-9]{8}$/, "Please enter a valid Vietnamese phone number."],
      unique: true,
    },
    password: {
      type: String,
      required: "Please enter your password.",
    },
    role: {
      type: String,
      enum: ["user", "premium", "admin"],
      default: "user",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642478/992490_b0iqzq.png",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    agree: {
      type: Boolean,
      required: "You must agree to the terms.",
    },
    defaultPaymentMethod: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
    },
    dateOfBirth: {
      type: Date,
    },
    address: [addressSchema],
    favoriteFonts: {
      type: [String],
      default: [],
    },
    brideGroomName: {
      type: String,
      default: "",
      trim: true,
    },
    resetCode: {
      type: String,
      default: null,
    },
    resetCodeExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  // Ensure only one default address (chỉ chạy nếu address tồn tại và là array)
  if (this.address && Array.isArray(this.address) && this.address.length > 0) {
    if (this.address.some((addr) => addr.isDefault)) {
      this.address.forEach((addr, index) => {
        addr.isDefault = index === this.address.findIndex((a) => a.isDefault);
      });
    }
  }
  next();
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ deviceId: 1 });
userSchema.index({ favoriteFonts: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;