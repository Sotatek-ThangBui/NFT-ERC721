const hre = require("hardhat");

async function main() {
    const ethers = hre.ethers;

    const TWTK = await ethers.getContractFactory("TheWinTKNFT");
    const nft = await TWTK.deploy();

    console.log("Contract deployed to address:", nft.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });