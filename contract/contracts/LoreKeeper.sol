// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LoreKeeper
 * @notice Stores the collaborative story sentences onchain permanently.
 *         Siggy's AI narrations are generated live from these sentences
 *         and stored off-chain — only human contributions live here.
 */
contract LoreKeeper {
    struct StoryEntry {
        address contributor;
        string sentence;
        uint256 timestamp;
        uint256 index;
    }

    StoryEntry[] public entries;
    address public owner;

    event SentenceAdded(
        address indexed contributor,
        string sentence,
        uint256 index,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Any user can add one sentence to the eternal story
    function addSentence(string calldata sentence) external {
        require(bytes(sentence).length > 0, "Sentence cannot be empty");
        require(bytes(sentence).length <= 500, "Sentence too long (max 500 chars)");

        uint256 idx = entries.length;
        entries.push(StoryEntry({
            contributor: msg.sender,
            sentence: sentence,
            timestamp: block.timestamp,
            index: idx
        }));

        emit SentenceAdded(msg.sender, sentence, idx, block.timestamp);
    }

    /// @notice Returns total number of story entries
    function getEntryCount() external view returns (uint256) {
        return entries.length;
    }

    /// @notice Returns all story entries at once
    function getAllEntries() external view returns (StoryEntry[] memory) {
        return entries;
    }

    /// @notice Returns a single entry by index
    function getEntry(uint256 index) external view returns (
        address contributor,
        string memory sentence,
        uint256 timestamp,
        uint256 entryIndex
    ) {
        require(index < entries.length, "Index out of bounds");
        StoryEntry storage e = entries[index];
        return (e.contributor, e.sentence, e.timestamp, e.index);
    }

    /// @notice Owner can reset the story (testnet use)
    function resetStory() external onlyOwner {
        delete entries;
    }

    /// @notice Transfer contract ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
