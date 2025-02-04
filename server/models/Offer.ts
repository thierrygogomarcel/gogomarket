import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["publié", "en attente", "refusé"], default: "publié" },
  },
  { timestamps: true }
);

export const Offer = mongoose.model("Offer", OfferSchema);
