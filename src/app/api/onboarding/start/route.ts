// src/app/api/onboarding/start/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// Import the correct classes from the SDK
import { Fireblocks, BasePath, CreateVaultAccountConnectionRequestFeeLevelEnum } from '@fireblocks/ts-sdk';

const prisma = new PrismaClient();

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

export async function POST() {
  // We wrap the logic in a try/catch block to handle any potential errors
  try {
    // 1. Create a new vault account in Fireblocks
    console.log("Calling Fireblocks to create a new vault...");
    const vaultResponse = await fireblocks.vaults.createVaultAccount({
        createVaultAccountRequest: {
            name: `WorthyTrust User Vault - ${Date.now()}`, // A unique name for the vault
            hiddenOnUI: true, // Best practice: hide segregated user accounts from the console
            autoFuel: false, // We are not using the Gas Station for the MVP
        }
    });
    const vaultId = vaultResponse.data.id;
    console.log("Successfully created vault with ID:", vaultId);

    // --- ADDED CHECK ---
    // Ensure we have a valid vaultId before proceeding
    if (!vaultId) {
        throw new Error("Failed to create vault account: No vault ID returned.");
    }

    // 2. Create a new asset wallet (Arbitrum Sepolia) within that vault
    const assetId = "ETH_TEST5"; 
    const assetResponse = await fireblocks.vaults.createVaultAccountAsset({
        vaultAccountId: vaultId,
        assetId: assetId,
    });
    const walletAddress = assetResponse.data.address;
    console.log(`Created ${assetId} wallet with address: ${walletAddress}`);

    if (!walletAddress) {
        throw new Error("Failed to create vault asset: No wallet address returned.");
    }

    // 3. Save the new user to your Postgres database
    const newUser = await prisma.user.create({
      data: {
        walletAddress: walletAddress,
        fireblocksVaultId: vaultId,
      },
    });
    console.log("Successfully created new user in database:", newUser.id);

    // 4. Generate a WalletConnect URI for device pairing
    console.log("Generating WalletConnect URI for pairing...");
    const connection = await fireblocks.web3Connections.create({
        createConnectionRequest: {
            vaultAccountId: parseInt(vaultId),
            feeLevel: CreateVaultAccountConnectionRequestFeeLevelEnum.Medium,
            uri: "", // Pass an empty URI to generate a new session for pairing
            chainIds: [assetId]
        }
    });

    const uri = connection.data 

    if (!uri) {
      throw new Error("Failed to extract WalletConnect URI from Fireblocks response.");
    }

    console.log("Generated URI successfully.");

    // 5. Respond to the frontend with the URI
    return NextResponse.json({ success: true, pairingUri: uri });

  } catch (error) {
    console.error("Onboarding failed:", error);
    return NextResponse.json(
      { error: "Failed to create wallet. Please try again." },
      { status: 500 }
    );
  }
}

