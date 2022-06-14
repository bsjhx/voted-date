const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("StartNewDateVoting adding new poll", function () {
    it("When new date poll is added, event is emitted", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(10);
        const [owner, manager] = await ethers.getSigners();

        await expect(startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000, 10005]
        )).to.emit(startNewDateVoting, "PollAdded").withArgs(owner.address, manager.address, 123, "Test date poll");
    });

    it("Adding two polls with same id should be not possible", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(10);
        const [_, manager] = await ethers.getSigners();

        await startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000, 10005]
        );

        await expect(startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000, 10005]
        )).to.be.revertedWith("Date poll with given id already exists.");
    });

    it("Number of possible dates should be lower then limit", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(1);
        const [_, manager] = await ethers.getSigners();

        await expect(startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000, 10005]
        )).to.be.revertedWith("Number of possible dates should be lower then limit.");
    });
});

describe("Reading base poll data for voter", function () {
    it("User can see only base poll data", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(10);
        const [_, manager] = await ethers.getSigners();

        await startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000]
        );

        const poll = await startNewDateVoting.getPollDataForVoter(123);
        expect(poll[0]).to.be.equal("Test date poll");
        expect(poll[1]).deep.to.be.equal([BigNumber.from("1000")]);
    });

    it("If poll does not exist, transaction will be reverted", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(10);

        await expect(startNewDateVoting.getPollDataForVoter(123)).to.be.revertedWith("Date poll with given id does not exists");
    });
});

describe("Voting", function () {
    it("User can vote for existing option", async function () {
        const StartNewDateVoting = await ethers.getContractFactory("StartNewDateVoting");
        const startNewDateVoting = await StartNewDateVoting.deploy(10);
        const [_, manager, thirdAccount] = await ethers.getSigners();

        await startNewDateVoting.addNewPoll(
            123,
            "Test date poll",
            manager.address,
            [1000, 1005, 1010]
        );

        await expect(startNewDateVoting.connect(thirdAccount).vote(123, 1000, 1000)).to
            .emit(startNewDateVoting, "Voted")
            .withArgs(thirdAccount.address, 1000);
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