import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json()); // Use built-in JSON parser

// const SSL_STORE_ID = "arena67c0424a7c4be";
// const SSL_STORE_PASS = "arena67c0424a7c4be@ssl";
const SSL_SANDBOX_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

app.post("/initiate-payment", async (req, res) => {
  console.log("req2222222222222222222222222222222222222222222222222222", req);
  try {
    const { userData } = req.body;
    console.log(
      "req2222222222222222222222222222222222222222222222222222 2222222222222222",
      userData?.store_id,
      userData?.store_passwd
      //   userData
    );

    if (!userData?.store_id || !userData?.store_passwd) {
      return res
        .status(400)
        .json({ error: "Store ID or Store Password is missing." });
    }

    const paymentData = {
      store_id: userData?.store_id, // Use store_id from request body
      store_passwd: userData?.store_passwd, // Use store_passwd from request body
      total_amount: userData.premium,
      currency: "BDT",
      tran_id: `LIC${Date.now()}`,
      success_url: "https://licbangladesh.com/success",
      fail_url: "https://licbangladesh.com/fail",
      cancel_url: "https://licbangladesh.com/cancel",
      emi_option: 0,
      cus_name: userData.personalInfo.name,
      cus_email: userData.personalInfo.email,
      cus_phone: userData.personalInfo.mobile,
      cus_add1: userData.personalInfo.address,
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      product_name: userData.policyName,
      product_category: "Insurance",
      product_profile: "non-physical-goods",
    };

    const response = await fetch(SSL_SANDBOX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (result.status === "SUCCESS") {
      res.json({ gatewayUrl: result.GatewayPageURL });
    } else {
      res.status(400).json({
        error: "Payment initialization failed",
        details: result,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
