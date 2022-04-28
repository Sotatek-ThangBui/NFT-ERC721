const hre = require("hardhat");

async function main() {
    const marketAddr = "0x03D55F84b6B8b6578d784b12a53e07032c0Fb629";
    const transparentAddr = "0xC642ef7021597DfAcD125BB87AE1D1b91F2dB5eB";

    const ethers = hre.ethers;
    const upgrades = hre.upgrades;

    console.log('Upgrading Market...');

    const MarketV2 = await ethers.getContractFactory("TheWinTKMarketplaceV2");

    const marketv2 = await upgrades.upgradeProxy(marketAddr, MarketV2);

    await marketv2.deployed();

    console.log("Market Upgraded %s", marketv2.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });