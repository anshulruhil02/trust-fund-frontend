const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting WorthyTrust deployment...\n");
    
    try {
        // Get the deployer account
        console.log("Getting signers...");
        const signers = await ethers.getSigners();
        console.log("Signers length:", signers.length);
        
        if (signers.length === 0) {
            throw new Error("No signers found. Check your private key in .env file.");
        }
        
        const [deployer] = signers;
        console.log("Deployer object:", deployer ? "exists" : "undefined");
        console.log("📝 Deploying contracts with account:", deployer.address);
        
        // Check deployer balance
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");
        
        // Deploy TrustFactory
        console.log("📦 Deploying TrustFactory...");
        const TrustFactory = await ethers.getContractFactory("TrustFactory");
        const trustFactory = await TrustFactory.deploy();
        await trustFactory.waitForDeployment();
        
        const factoryAddress = await trustFactory.getAddress();
        console.log("✅ TrustFactory deployed to:", factoryAddress);
        
        // Verify deployment by calling a view function
        const totalTrusts = await trustFactory.getTotalTrusts();
        console.log("🔍 Total trusts created:", totalTrusts.toString());
        
        console.log("\n🎉 Deployment Summary:");
        console.log("========================");
        console.log("TrustFactory Address:", factoryAddress);
        console.log("Deployer Address:", deployer.address);
        console.log("Network:", (await ethers.provider.getNetwork()).name);
        console.log("Block Number:", await ethers.provider.getBlockNumber());
        
        console.log("\n📋 Next Steps:");
        console.log("1. Update your frontend .env file with the factory address:");
        console.log(`   NEXT_PUBLIC_TRUST_FACTORY_ADDRESS="${factoryAddress}"`);
        console.log("2. Verify the contract on Arbiscan (optional):");
        console.log(`   npx hardhat verify --network arbitrumSepolia ${factoryAddress}`);
        console.log("3. Test creating a trust from your frontend!");
        
        return {
            factoryAddress,
            deployerAddress: deployer.address
        };
        
    } catch (error) {
        console.error("Error details:", error.message);
        throw error;
    }
}

// Handle script execution
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error("❌ Deployment failed:");
            console.error(error);
            process.exit(1);
        });
}

module.exports = main;