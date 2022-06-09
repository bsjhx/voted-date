const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");

    const startNewDateVoting = await StartNewDateVoting.deploy(10);

    expect(await startNewDateVoting.get()).to.equal(0);
  });
});