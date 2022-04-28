const hre = require("hardhat");

async function main() {
    const ethers = hre.ethers;

    const utils = ethers.utils;

    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;

    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const marketAddr = '0x03D55F84b6B8b6578d784b12a53e07032c0Fb629';

    const nftAddr = '0x3Fc2e4BD733b5B58F6EB4e796D86C21602277890';

    const marketV2 = await ethers.getContractAt("TheWinTKMarketplaceV2", marketAddr);

    await marketV2.setTreasury(addr4.address);

    const nft = await ethers.getContractAt("NFTThewinTK", nftAddr);

    await nft.mintNFT(owner.address, "");

    await nft.setApprovalForAll(marketAddr, false);

    await nft.approve(marketAddr, 1);

    let price = utils.parseEther("1");

    let fee = await marketV2.getFee(price);

    await nft.ownerOf(1);

    await nft.isApprovedForAll(owner.address, marketAddr);

    await marketV2.getTreasury();

    await marketV2.makeItem(nftAddr, 1, price);

    await marketV2.connect(addr2).purchaseItem(7, { value: price.add(fee) });

    await marketV2.orderIdOf(nftAddr, 2);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });