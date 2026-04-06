function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters (including +, spaces, dashes, etc.)
  let cleaned = phone.replace(/\D/g, "");
  
  // If the number is exactly 10 digits, assume it's an Indian number and prepend '91'
  if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }
  
  return cleaned;
}

export async function sendWhatsAppMessage(
  to: string,
  templateName: string,
  variables: string[] = []
) {
  const baseUrl = process.env.INFOBIP_BASE_URL;
  const apiKey = process.env.INFOBIP_API_KEY;
  const senderEnv = process.env.INFOBIP_SENDER;

  if (!baseUrl || !apiKey || !senderEnv) {
    console.error("Infobip credentials not configured.");
    return { success: false, error: "Credentials missing" };
  }

  const sender = formatPhoneNumber(senderEnv);
  const formattedTo = formatPhoneNumber(to);

  // Ensure the base URL has a protocol
  const normalizedBaseUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
  const url = `${normalizedBaseUrl.endsWith("/") ? normalizedBaseUrl : normalizedBaseUrl + "/"}whatsapp/1/message/template`;

  const payload = {
    messages: [
      {
        from: sender,
        to: formattedTo,
        content: {
          templateName: templateName,
          templateData: {
            body: {
              placeholders: variables,
            },
          },
          language: "en",
        },
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `App ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
        console.log("Infobip Template API Success Response:", JSON.stringify(result, null, 2));
        
        // Stricter Check: Even if 200 OK, check if the message itself was rejected
        const firstMessage = result.messages?.[0];
        if (firstMessage?.status?.groupName === "REJECTED") {
            return { 
                success: false, 
                error: firstMessage.status.description || "Message rejected by Infobip",
                data: result 
            };
        }
        
        return { success: true, data: result };
    } else {
      console.error("Infobip Template API Error Response:", JSON.stringify(result, null, 2));
      return { success: false, error: result };
    }
  } catch (error: any) {
    console.error("Infobip Template Fetch Exception:", error);
    return { success: false, error: error.message };
  }
}

export async function sendWhatsAppDirectMessage(
  to: string,
  message: string
) {
  const baseUrl = process.env.INFOBIP_BASE_URL;
  const apiKey = process.env.INFOBIP_API_KEY;
  const senderEnv = process.env.INFOBIP_SENDER;

  if (!baseUrl || !apiKey || !senderEnv) {
    console.error("Infobip credentials not configured.");
    return { success: false, error: "Credentials missing" };
  }

  const sender = formatPhoneNumber(senderEnv);
  const formattedTo = formatPhoneNumber(to);
  const normalizedBaseUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
  const url = `${normalizedBaseUrl.endsWith("/") ? normalizedBaseUrl : normalizedBaseUrl + "/"}whatsapp/1/message/text`;

  const payload = {
    from: sender,
    to: formattedTo,
    content: {
      text: message,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `App ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
        console.log("Infobip Direct API Success Response:", JSON.stringify(result, null, 2));
        
        // Stricter Check: Even if 200 OK, check if the message itself was rejected
        if (result.status?.groupName === "REJECTED") {
            return { 
                success: false, 
                error: result.status.description || "Message rejected by Infobip",
                data: result 
            };
        }
        
        return { success: true, data: result };
    } else {
      console.error("Infobip Direct API Error Response:", JSON.stringify(result, null, 2));
      return { success: false, error: result };
    }
  } catch (error: any) {
    console.error("Infobip Direct Fetch Exception:", error);
    return { success: false, error: error.message };
  }
}
