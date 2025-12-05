import { NextResponse } from "next/server";
import { Client } from "@microsoft/microsoft-graph-client";
import { ConfidentialClientApplication } from "@azure/msal-node";

// Force the route to be dynamic
export const dynamic = "force-dynamic";

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET!,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

// Function to get OAuth 2.0 access token
async function getAccessToken() {
  try {
    const tokenRequest = {
      scopes: ["https://graph.microsoft.com/.default"],
    };
    const response = await cca.acquireTokenByClientCredential(tokenRequest);
    if (!response || !response.accessToken) {
      throw new Error("Failed to acquire access token: No token received");
    }
    console.log("Access token acquired successfully");
    return response.accessToken;
  } catch (error: any) {
    console.error("Error acquiring access token:", {
      message: error.message,
      stack: error.stack,
      errorDetails: error.errorDetails || "No additional details",
    });
    throw error;
  }
}

// Function to send email
async function sendEmail(toEmail: string, subject: string, body: string) {
  try {
    console.log(`Attempting to send email to: ${toEmail}`);
    const accessToken = await getAccessToken();
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    const message = {
      message: {
        subject,
        body: {
          contentType: "HTML",
          content: body,
        },
        toRecipients: [
          {
            emailAddress: {
              address: toEmail,
            },
          },
        ],
        from: {
          emailAddress: {
            address: "connect@drivingmaster.in",
          },
        },
      },
      saveToSentItems: true,
    };

    await client.api("/users/connect@drivingmaster.in/sendMail").post(message);
    console.log(`Email sent successfully to ${toEmail}`);
    return { success: true, message: `Email sent to ${toEmail}` };
  } catch (error: any) {
    console.error("Error sending email:", {
      toEmail,
      subject,
      message: error.message,
      stack: error.stack,
      errorCode: error.code || "N/A",
      errorDetails: error.body
        ? JSON.stringify(error.body)
        : "No additional details",
    });
    throw error;
  }
}

// Named export for POST method
export async function POST(req: Request) {
  try {
    console.log("Received POST request to /api/send-email");
    const { toEmail, subject, body } = await req.json();
    console.log("Request body:", {
      toEmail,
      subject,
      body: body.substring(0, 100) + "...",
    });

    if (!toEmail || !subject || !body) {
      console.error("Missing required fields in request body");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sendEmail(toEmail, subject, body);
    console.log("Email sending result:", result);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error in POST /api/send-email:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
