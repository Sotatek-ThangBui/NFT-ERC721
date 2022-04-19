const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Thewintk", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Thewintk = await ethers.getContractFactory("Thewintk");
    const greeter = await Thewintk.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
