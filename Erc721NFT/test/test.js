const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TheWinTKNFT", function () {
  let TWTK;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let treasuryAddr;

  const ERC721Interface = 0x80ac58cd;
  const ERC721MetadataInterface = 0x5b5e139f;
  const ERC721EnumerableInterface = 0x780e9d63;
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const deadAddress = '0x000000000000000000000000000000000000dEaD';

  beforeEach(async function () {
    const nftAddr = '0xab750deFe3F63BC860d275c344969Ae9F1f3109D';

    TWTK = await ethers.getContractAt("TheWinTKNFT", nftAddr);

    [owner, addr1, addr2, treasuryAddr, ...addrs] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Deployment should set the right owner", async function () {
      expect(await TWTK.owner()).to.equal(owner.address);
    });
  });

  describe("Mint NFT", function () {
    it("Should allow mint if is owner's call", async function () {
      await TWTK.mintNFT(owner.address, '');

      expect(await TWTK.balanceOf(addr1.address)).to.equal(2);
    });
  });

  describe("Supports Interface", function () {
    it("Should return true if supported", async function () {
      expect(await TWTK.supportsInterface(ERC721Interface)).to.equal(true);
    });

    it("Should return false if not supported", async function () {
      expect(await TWTK.supportsInterface(0x1d212d12)).to.equal(false);
    });
  });

  describe("Token URI", function () {
    it("Should return token uri", async function () {
      await TWTK.mintNFT(addr2.address, '');

      expect(await TWTK.tokenURI(1)).to.equal('');
    });
  });
});