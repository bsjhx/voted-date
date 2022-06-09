const { expect } = require("chai");

describe("StartNewDateVoting adding new poll", function () {
    it("When new date poll is added, event is emitted", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(10);
        const [owner, manager, third, fourth] = await ethers.getSigners();

        await expect(startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000, 10005],
            [third.address, fourth.address]
        )).to.emit(startNewDateVoting, "PollAdded").withArgs(owner.address, manager.address, 123, "Test date poll");
    });

    it("Adding two polls with same id should be not possible", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(10);
        const [owner, manager, third, fourth] = await ethers.getSigners();

        await startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000, 10005],
            [third.address, fourth.address]
        )

        await expect(startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000, 10005],
            [third.address, fourth.address]
        )).to.be.revertedWith("Date poll with given id already exists.");
    });

    it("New poll id should be bigger then 0", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(10);
        const [owner, manager, third, fourth] = await ethers.getSigners();

        await expect(startNewDateVoting.addNewPoll(
            0,
            "Test date poll",
            manager.address,
            [1000, 10005],
            [third.address, fourth.address]
        )).to.be.revertedWith("New date poll id must be bigger then 0.");
    });

    it("Number of possible dates should be lower then limit", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(1);
        const [owner, manager, third, fourth] = await ethers.getSigners();

        await expect(startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000, 10005],
            [third.address, fourth.address]
        )).to.be.revertedWith("Number of possible dates should be lower then limit.");
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