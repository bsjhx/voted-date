// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DatePolls {
    mapping(uint256 => DatePoll) public idsToDatePolls;
    uint8 maxOptionsInPolls;

    event PollAdded(
        address _addedByAddress,
        address indexed _pollManagerAddress,
        uint256 _id,
        string _name
    );

    event Voted(
        address _voterAddress,
        uint256 _vottedDate
    );

    constructor(uint8 _maxOptionsInPolls) {
        maxOptionsInPolls = _maxOptionsInPolls;
    }

    function addNewPoll(
        uint256 _id,
        string memory _name,
        address _pollManagerAddress,
        uint256[] memory _possibleDates
    ) public {
        require(!idsToDatePolls[_id].exists, "Date poll with given id already exists");

        require(
            _possibleDates.length <= maxOptionsInPolls,
            "Number of possible dates should be lower then limit."
        );

        DatePoll storage newDatePoll = idsToDatePolls[_id];

        newDatePoll.id = _id;
        newDatePoll.name = _name;
        newDatePoll.pollManagerAddress = _pollManagerAddress;
        newDatePoll.exists = true;
        newDatePoll.addedByAddress = msg.sender;
        newDatePoll.possibleDates = _possibleDates;

        emit PollAdded(msg.sender, _pollManagerAddress, _id, _name);  
    }

    function getPollDataForVoter(uint256 _id) public view returns (string memory, uint256[] memory) {
        require(idsToDatePolls[_id].exists, "Date poll with given id does not exist");

        DatePoll storage datePoll = idsToDatePolls[_id];

        return (datePoll.name, datePoll.possibleDates);
    }

    function vote(uint256 _id, uint256 _dateToVote, uint256 _timestamp) public {
        require(idsToDatePolls[_id].exists, "Date poll with given id does not exist");

        DatePoll storage datePoll = idsToDatePolls[_id];

        SingleVote memory newVote = SingleVote(msg.sender, _timestamp);
        datePoll.votes[_dateToVote].push(newVote);

        emit Voted(msg.sender, _dateToVote);
    }

    fallback() external {}

    struct DatePoll {
        uint256 id;
        string name;
        address pollManagerAddress;
        address addedByAddress;
        bool exists;
        uint256[] possibleDates;
        mapping(uint256 => SingleVote[]) votes;
    }

    struct SingleVote {
        address voterAddress;
        uint256 voteTimestamp;
    }
}