const { expect } = require("chai"); 

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("ThewinTKMarketplace", function () {

  let NFTThewinTK;
  let nft;
  let Marketplace;
  let marketplace
  let deployer;
  let addr1;
  let addr2;
  let addrs;
  let URI = "sample URI"

  beforeEach(async function () {
    // Get the ContractFactories and Signers here.
    NFTThewinTK = await ethers.getContractFactory("NFTThewinTK");
    ThewinTKMarketplace = await ethers.getContractFactory("ThewinTKMarketplace");
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
    // To deploy our contracts
    nft = await NFTThewinTK.deploy();
    marketplace = await ThewinTKMarketplace.deploy();
  });

  describe("Deployment", function () {

    it("Should track name and symbol of the nft collection", async function () {
      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      const nftName = "NFTThewinTK"
      const nftSymbol = "TWTK"
      expect(await nft.name()).to.equal(nftName);
      expect(await nft.symbol()).to.equal(nftSymbol);
    });

  });

  describe("Minting NFTs", function () {

    it("Should track each minted NFT", async function () {
      // deployer mints an nft
      await nft.mintNFT(deployer.address, URI)
      expect(await nft.tokenURI(1)).to.equal(URI);
      expect(await nft.balanceOf(deployer.address)).to.equal(1);
    });
  })

  describe("Making marketplace items", function () {
    let price = 1
    let result 
    beforeEach(async function () {
      await nft.connect(deployer).mintNFT(deployer.address, URI)
      await nft.connect(deployer).setApprovalForAll(marketplace.address, true)
    })

    it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
      await expect(marketplace.connect(deployer).makeItem(nft.address, 1 , toWei(price)))
        .to.emit(marketplace, "Offered")
        .withArgs(
          1,
          nft.address,
          1,
          toWei(price),
          deployer.address,
          marketplace.address,
        )
      // Owner of NFT should now be the marketplace
      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
    });

    it("Should fail if price is set to zero", async function () {
      await expect(
        marketplace.connect(addr1).makeItem(nft.address, 1, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });

  });

});