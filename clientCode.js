  // const handlePayNow = async () => {
  //   console.log("ddddddddddddddddddddddddddd", userData);
  //   try {
  //     const response = await fetch("http://localhost:8080/initiate-payment", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userData: {
  //           ...userData,
  //           store_id: "arena67c0424a7c4be", // Store ID from frontend
  //           store_passwd: "arena67c0424a7c4be@ssl", // Store Password from frontend
  //         },
  //       }),
  //     });

  //     const result = await response.json();
  //     console.log("dddddddddddddddddddddddddd result", result);
  //     if (response.ok) {
  //       console.log("Payment initiated, Gateway URL:", result.gatewayUrl);
  //     } else {
  //       console.error("Error:", result.error);
  //     }
  //   } catch (error) {
  //     console.error("Error during payment initiation:", error);
  //   }
  // };

    const handlePayNow = async () => {
      console.log("User Data:", userData);
      try {
        const response = await fetch("http://localhost:8080/initiate-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userData: {
              ...userData,
              store_id: "arena67c8a0d6353cc", // Ensure this is correct
              store_passwd: "arena67c8a0d6353cc@ssl", // Ensure this is correct
            },
          }),
        });

        const result = await response.json();
        console.log("Payment Initiation Result:", result);
        if (response.ok) {
          console.log("Payment initiated, Gateway URL:", result.gatewayUrl);
          // Redirect user to the payment gateway URL
          window.location.href = result.gatewayUrl;
        } else {
          console.error("Error:", result.error);
        }
      } catch (error) {
        console.error("Error during payment initiation:", error);
      }
    };