import mongoose from "mongoose";

export async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error("Missing MongoDB connection string");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    tls: true,
    tlsAllowInvalidCertificates: false,
  });
}
