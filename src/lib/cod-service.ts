
'use server';

// Mock list of serviceable pincodes for Cash on Delivery.
// In a real application, this would be a database or an external API call.
const serviceablePincodes = new Set([
    "400001", "400002", "400003", "400004", "400005", // Mumbai
    "110001", "110002", "110003", "110004", "110005", // Delhi
    "700001", "700002", "700003", // Kolkata
    "600001", "600002", "600003", // Chennai
    "560001", "560002", // Bengaluru
]);

const metroPincodes = new Set(["400001", "110001", "700001", "600001", "560001"]);


/**
 * Checks if a given pincode is serviceable for Cash on Delivery.
 * @param pincode - The 6-digit pincode to check.
 * @returns A promise that resolves to an object with availability status and a message.
 */
export async function checkCodAvailability(pincode: string): Promise<{ available: boolean; message: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (serviceablePincodes.has(pincode)) {
    return {
      available: true,
      message: "Cash on Delivery available.",
    };
  } else {
    return {
      available: false,
      message: "Cash on Delivery not available. Please pay online.",
    };
  }
}

/**
 * Gets a delivery estimate for a given pincode.
 * @param pincode The 6-digit pincode to check.
 * @returns A promise that resolves to an object with the delivery message.
 */
export async function getDeliveryEstimate(pincode: string): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    if(pincode.length !== 6) {
        return { message: "Enter a valid pincode for delivery estimates." }
    }

    if (metroPincodes.has(pincode)) {
        return { message: `Delivers in 2-3 days to ${pincode}` };
    }
    
    if (serviceablePincodes.has(pincode)) {
        return { message: `Delivers in 4-5 days to ${pincode}` };
    }

    return { message: `Standard delivery in 7-10 days to ${pincode}` };
}
