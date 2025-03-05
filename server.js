import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json()); // Use built-in JSON parser

// const SSL_STORE_ID = "arena67c0424a7c4be";
// const SSL_STORE_PASS = "arena67c0424a7c4be@ssl";
const SSL_SANDBOX_URL = "https://sandbox.sslcommerz.com/gwprocess/v3/api.php";
//sandbox.sslcommerz.com/gwprocess/v3/api.php

https: app.post("/initiate-payment", async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { userData } = req.body;

    // Validate required fields
    if (!userData?.store_id || !userData?.store_passwd) {
      return res
        .status(400)
        .json({ error: "Store ID or Store Password is missing." });
    }

    // Validate other required fields
    if (
      !userData.premium ||
      !userData.personalInfo?.name ||
      !userData.personalInfo?.email ||
      !userData.personalInfo?.mobile
    ) {
      return res
        .status(400)
        .json({ error: "Required fields are missing in userData." });
    }

    // Construct payment data for SSLCommerz
    const paymentData = {
      store_id: userData.store_id, // Ensure this is correct
      store_passwd: userData.store_passwd, // Ensure this is correct
      total_amount: userData.premium, // Ensure this is a number
      currency: "BDT",
      tran_id: `LIC${Date.now()}`, // Ensure this is unique
      success_url: "http://localhost:3000/success", // Replace with your success URL
      fail_url: "http://localhost:3000/fail", // Replace with your fail URL
      cancel_url: "http://localhost:3000/cancel", // Replace with your cancel URL
      emi_option: 0, // EMI option (0 for no EMI)
      cus_name: userData.personalInfo.name,
      cus_email: userData.personalInfo.email,
      cus_phone: userData.personalInfo.mobile,
      cus_add1: userData.personalInfo.address,
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      shipping_method: "NO", // No shipping required
      product_name: userData.policyName,
      product_category: "Insurance",
      product_profile: "non-physical-goods", // For non-physical products
    };

    console.log("Payment Data Being Sent to SSLCommerz:", paymentData);

    // Send request to SSLCommerz
    const response = await fetch(SSL_SANDBOX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }, // SSLCommerz expects this content type
      body: new URLSearchParams(paymentData).toString(), // Convert object to URL-encoded format
    });

    const result = await response.json();
    console.log("SSLCommerz Response:", result);

    if (result.status === "SUCCESS") {
      res.json({ gatewayUrl: result.GatewayPageURL });
    } else {
      res.status(400).json({
        error: "Payment initialization failed",
        details: result,
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
