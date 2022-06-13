// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.0;

contract StartNewDateVoting {
    mapping(uint256 => DatePoll) private datePolls;
    uint8 private maxOptionsInPolls;

    event PollAdded(
        address _from,
        address indexed _pollManager,
        uint256 _id,
        string _name
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
        require(!datePolls[_id].exists, "Date poll with given id already exists.");
        require(
            _possibleDates.length <= maxOptionsInPolls,
            "Number of possible dates should be lower then limit."
        );

        DatePoll storage newDatePoll = datePolls[_id];
        newDatePoll.id = _id;
        newDatePoll.name = _name;
        newDatePoll.pollManagerAddress = _pollManagerAddress;
        newDatePoll.exists = true;
        newDatePoll.addedByAddress = msg.sender;
        newDatePoll.possibleDates = _possibleDates;

        emit PollAdded(msg.sender, _pollManagerAddress, _id, _name);  
    }

    function getPollDataForVoter(uint256 _id) public view returns (string memory, uint256[] memory) {
        require(!datePolls[_id].exists, "Date poll with given id does not exists");
        DatePoll storage datePoll = datePolls[_id];
        return (datePoll.name, datePoll.possibleDates);
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
