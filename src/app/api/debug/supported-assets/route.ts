// src/app/api/debug/supported-assets/route.ts
import { NextResponse } from 'next/server';
// Import the correct classes from the SDK
import { Fireblocks, BasePath } from '@fireblocks/ts-sdk';

// Initialize the Fireblocks SDK with your API keys from environment variables
const fireblocksApiKey = process.env.FIREBLOCKS_API_KEY || "";
const fireblocksPrivatekey = process.env.FIREBLOCKS_PRIVATE_KEY || "";

// Important: The private key needs to be formatted correctly with newlines
const formattedPrivatekey = fireblocksPrivatekey.replace(/\\n/g, '\n');

// Use the correct initialization method, with the required basePath
const fireblocks = new Fireblocks({
    apiKey: fireblocksApiKey,
    secretKey: formattedPrivatekey,
    basePath: BasePath.Sandbox, // This line tells the SDK to use the sandbox environment
});

// This is a GET request, so we can easily call it from the browser
export async function GET() {
  try {
    console.log("Fetching supported assets from Fireblocks...");
    
    // Call the getSupportedAssets function
    const supportedAssetsResponse = await fireblocks.blockchainsAssets.getSupportedAssets();
    const assets = supportedAssetsResponse.data;

    console.log(`Found ${assets.length} supported assets.`);

    // Return the full list of assets as a JSON response
    return NextResponse.json({ success: true, assets: assets });

  } catch (error) {
    console.error("Failed to fetch supported assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets." },
      { status: 500 }
    );
  }
}