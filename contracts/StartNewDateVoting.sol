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
        uint256[] memory _possibleDates,
        address[] memory _voterAddresses
    ) public {
        require(_id > 0, "New date poll id must be bigger then 0.");
        require(
            datePolls[_id].id == 0,
            "Date poll with given id already exists."
        );
        require(
            _possibleDates.length <= maxOptionsInPolls,
            "Number of possible dates should be lower then limit."
        );

        DatePoll storage newDatePoll = datePolls[_id];
        newDatePoll.id = _id;
        newDatePoll.name = _name;
        newDatePoll.pollManagerAddress = _pollManagerAddress;
        newDatePoll.addedByAddress = msg.sender;
        newDatePoll.possibleDates = _possibleDates;
        newDatePoll.voterAddresses = _voterAddresses;

        emit PollAdded(msg.sender, _pollManagerAddress, _id, _name);
    }

    fallback() external {}

    struct DatePoll {
        uint256 id;
        string name;
        address pollManagerAddress;
        address addedByAddress;
        uint256[] possibleDates;
        address[] voterAddresses;
        mapping(uint256 => SingleVote[]) votes;
    }

    struct SingleVote {
        address voterAddress;
        uint256 voteTimestamp;
    }
}
