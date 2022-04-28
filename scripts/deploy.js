const hre = require("hardhat");

async function main() {
    const ethers = hre.ethers;
    const upgrades = hre.upgrades;

    console.log('Deploying Market...');

    const ThewinTKMarketplace = await ethers.getContractFactory("ThewinTKMarketplace");

    const market = await upgrades.deployProxy(ThewinTKMarketplace, { initialize: 'initialize' });

    await market.deployed();

    console.log("MarketPlace deployed to address:", market.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });