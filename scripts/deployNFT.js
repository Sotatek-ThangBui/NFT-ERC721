const hre = require("hardhat");

async function main() {
    const ethers = hre.ethers;

    const NFTThewinTK = await ethers.getContractFactory("NFTThewinTK");
    const nft = await NFTThewinTK.deploy();

    console.log("Contract deployed to address:", nft.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });