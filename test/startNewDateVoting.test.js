const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
    const startNewDateVoting = await StartNewDateVoting.deploy(10);

    expect(await startNewDateVoting.get()).to.equal(0);
  });
});

describe("StartNewDateVoting payments", function () {
    it("Contract should not receive ether", async function () {
        StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        startNewDateVoting = await StartNewDateVoting.deploy(1);
        await startNewDateVoting.deployed();

        const [owner] = await ethers.getSigners();
        const params = {
            to: startNewDateVoting.address,
            value: ethers.utils.parseEther("1.0")
        };

        await expect(owner.sendTransaction(params))
            .to.be.revertedWith("Transaction reverted: there's no receive function, fallback function is not payable and was called with value 1000000000000000000");
    });
});