// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract TrustFund is ReentrancyGuard, Pausable {
    // ===== IMMUTABLE STATE =====
    address public immutable creator;
    address public immutable factory;
    uint256 public immutable createdAt;
    
    // ===== REGULAR STATE (not immutable for strings) =====
    string public name;
    string public purpose;
    
    // ===== GOVERNANCE STATE =====
    mapping(address => bool) public trustees;
    mapping(address => uint256) public beneficiaryAllocations; // percentage * 100 (e.g., 50.5% = 5050)
    address[] public beneficiaryList;
    address[] public trusteeList;
    uint256 public trusteeCount;
    
    // ===== FINANCIAL STATE =====
    mapping(address => uint256) public tokenBalances; // token address -> balance
    mapping(address => uint256) public lifetimeDeposits; // depositor -> total deposited
    uint256 public totalValueDeposited; // in ETH equivalent
    
    // ===== PROPOSAL SYSTEM =====
    struct Proposal {
        uint256 id;
        ProposalType proposalType;
        address proposer;
        string title;
        string description;
        bytes proposalData;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        mapping(address => VoteChoice) votes;
        mapping(address => bool) hasVoted;
    }
    
    enum ProposalType {
        ADJUST_PAYOUTS,
        CHANGE_BENEFICIARY,
        ADD_TRUSTEE,
        REMOVE_TRUSTEE,
        EMERGENCY_WITHDRAW,
        DISSOLVE_TRUST
    }
    
    enum VoteChoice {
        ABSTAIN,
        FOR,
        AGAINST
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public votingPeriod = 7 days;
    uint256 public quorumPercentage = 51; // 51% required
    
    // ===== EVENTS =====
    event Deposit(address indexed depositor, address indexed token, uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed beneficiary, address indexed token, uint256 amount);
    event TrusteeAdded(address indexed trustee);
    event TrusteeRemoved(address indexed trustee);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, ProposalType proposalType);
    event VoteCast(uint256 indexed proposalId, address indexed voter, VoteChoice voteChoice);
    event ProposalExecuted(uint256 indexed proposalId, bool success);
    event EmergencyPause(address indexed pausedBy);
    
    // ===== MODIFIERS =====
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator");
        _;
    }
    
    modifier onlyTrustee() {
        require(trustees[msg.sender], "Only trustee");
        _;
    }
    
    modifier onlyBeneficiary() {
        require(beneficiaryAllocations[msg.sender] > 0, "Only beneficiary");
        _;
    }
    
    modifier validProposal(uint256 proposalId) {
        require(proposalId < proposalCount, "Invalid proposal");
        require(proposals[proposalId].deadline > block.timestamp, "Proposal expired");
        require(!proposals[proposalId].executed, "Proposal already executed");
        _;
    }
    
    // ===== CONSTRUCTOR =====
    constructor(
        address _creator,
        string memory _name,
        string memory _purpose,
        address[] memory _beneficiaries,
        uint256[] memory _allocations,
        address[] memory _trustees
    ) {
        creator = _creator;
        factory = msg.sender;
        name = _name;
        purpose = _purpose;
        createdAt = block.timestamp;
        
        // Set up beneficiaries
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            require(_beneficiaries[i] != address(0), "Invalid beneficiary address");
            beneficiaryAllocations[_beneficiaries[i]] = _allocations[i];
            beneficiaryList.push(_beneficiaries[i]);
        }
        
        // Set up trustees
        for (uint256 i = 0; i < _trustees.length; i++) {
            require(_trustees[i] != address(0), "Invalid trustee address");
            require(!trustees[_trustees[i]], "Duplicate trustee");
            trustees[_trustees[i]] = true;
            trusteeList.push(_trustees[i]);
            trusteeCount++;
            emit TrusteeAdded(_trustees[i]);
        }
        
        // Creator is automatically a trustee
        if (!trustees[_creator]) {
            trustees[_creator] = true;
            trusteeList.push(_creator);
            trusteeCount++;
            emit TrusteeAdded(_creator);
        }
    }
    
    // ===== DEPOSIT FUNCTIONS =====
    
    /**
     * @dev Deposit ETH into the trust
     */
    function depositETH() external payable whenNotPaused {
        require(msg.value > 0, "Must deposit something");
        
        tokenBalances[address(0)] += msg.value;
        lifetimeDeposits[msg.sender] += msg.value;
        totalValueDeposited += msg.value;
        
        emit Deposit(msg.sender, address(0), msg.value, block.timestamp);
    }
    
    /**
     * @dev Deposit ERC20 tokens into the trust
     * @param token Address of the ERC20 token
     * @param amount Amount to deposit
     */
    function depositToken(address token, uint256 amount) external whenNotPaused nonReentrant {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Must deposit something");
        
        // Transfer tokens from sender to this contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        tokenBalances[token] += amount;
        lifetimeDeposits[msg.sender] += amount; // Note: This doesn't convert to ETH equivalent
        
        emit Deposit(msg.sender, token, amount, block.timestamp);
    }
    
    // ===== WITHDRAWAL FUNCTIONS =====
    
    /**
     * @dev Allow beneficiaries to withdraw their allocated funds
     * @param token Token address (address(0) for ETH)
     * @param amount Amount to withdraw
     */
    function withdraw(address token, uint256 amount) external onlyBeneficiary nonReentrant whenNotPaused {
        uint256 allocation = beneficiaryAllocations[msg.sender];
        uint256 availableBalance = (tokenBalances[token] * allocation) / 100;
        
        require(amount <= availableBalance, "Insufficient allocation");
        
        tokenBalances[token] -= amount;
        
        if (token == address(0)) {
            // ETH withdrawal
            payable(msg.sender).transfer(amount);
        } else {
            // ERC20 withdrawal
            IERC20(token).transfer(msg.sender, amount);
        }
        
        emit Withdrawal(msg.sender, token, amount);
    }
    
    // ===== PROPOSAL FUNCTIONS =====
    
    /**
     * @dev Create a new proposal
     * @param proposalType Type of proposal
     * @param title Title of the proposal
     * @param description Description of the proposal
     * @param proposalData Encoded data specific to the proposal type
     */
    function createProposal(
        ProposalType proposalType,
        string memory title,
        string memory description,
        bytes memory proposalData
    ) external onlyTrustee returns (uint256) {
        uint256 proposalId = proposalCount++;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposalType = proposalType;
        newProposal.proposer = msg.sender;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.proposalData = proposalData;
        newProposal.deadline = block.timestamp + votingPeriod;
        newProposal.executed = false;
        
        emit ProposalCreated(proposalId, msg.sender, proposalType);
        
        return proposalId;
    }
    
    /**
     * @dev Vote on a proposal
     * @param proposalId ID of the proposal
     * @param voteChoice Vote choice (FOR, AGAINST, ABSTAIN)
     */
    function vote(uint256 proposalId, VoteChoice voteChoice) external onlyTrustee validProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.votes[msg.sender] = voteChoice;
        
        if (voteChoice == VoteChoice.FOR) {
            proposal.votesFor++;
        } else if (voteChoice == VoteChoice.AGAINST) {
            proposal.votesAgainst++;
        }
        
        emit VoteCast(proposalId, msg.sender, voteChoice);
        
        // Auto-execute if quorum reached
        _tryExecuteProposal(proposalId);
    }
    
    /**
     * @dev Try to execute a proposal if conditions are met
     * @param proposalId ID of the proposal
     */
    function _tryExecuteProposal(uint256 proposalId) internal {
        Proposal storage proposal = proposals[proposalId];
        
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 requiredQuorum = (trusteeCount * quorumPercentage) / 100;
        
        if (totalVotes >= requiredQuorum && proposal.votesFor > proposal.votesAgainst) {
            proposal.executed = true;
            
            // Execute proposal based on type
            bool success = _executeProposalAction(proposalId);
            
            emit ProposalExecuted(proposalId, success);
        }
    }
    
    /**
     * @dev Execute the actual proposal action
     * @param proposalId ID of the proposal
     * @return success Whether the execution was successful
     */
    function _executeProposalAction(uint256 proposalId) internal returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.proposalType == ProposalType.EMERGENCY_WITHDRAW) {
            // Emergency withdraw all funds to creator
            uint256 ethBalance = address(this).balance;
            if (ethBalance > 0) {
                payable(creator).transfer(ethBalance);
            }
            return true;
        } else if (proposal.proposalType == ProposalType.DISSOLVE_TRUST) {
            // Pause the contract and prepare for dissolution
            _pause();
            return true;
        }
        
        // Add more proposal type handlers as needed
        return true;
    }
    
    // ===== EMERGENCY FUNCTIONS =====
    
    /**
     * @dev Emergency pause (only trustees)
     */
    function emergencyPause() external onlyTrustee {
        _pause();
        emit EmergencyPause(msg.sender);
    }
    
    /**
     * @dev Unpause (only creator)
     */
    function unpause() external onlyCreator {
        _unpause();
    }
    
    // ===== VIEW FUNCTIONS =====
    
    /**
     * @dev Get trust summary information
     */
    function getTrustInfo() external view returns (
        string memory trustName,
        string memory trustPurpose,
        address trustCreator,
        uint256 trustCreatedAt,
        uint256 trusteeCount_,
        uint256 beneficiaryCount,
        uint256 ethBalance,
        bool isPaused
    ) {
        return (
            name,
            purpose,
            creator,
            createdAt,
            trusteeCount,
            beneficiaryList.length,
            address(this).balance,
            paused()
        );
    }
    
    /**
     * @dev Get all beneficiaries and their allocations
     */
    function getBeneficiaries() external view returns (address[] memory, uint256[] memory) {
        uint256[] memory allocations = new uint256[](beneficiaryList.length);
        
        for (uint256 i = 0; i < beneficiaryList.length; i++) {
            allocations[i] = beneficiaryAllocations[beneficiaryList[i]];
        }
        
        return (beneficiaryList, allocations);
    }
    
    /**
     * @dev Get all trustees
     */
    function getTrustees() external view returns (address[] memory) {
        return trusteeList;
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        ProposalType proposalType,
        address proposer,
        string memory title,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 deadline,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposalType,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.deadline,
            proposal.executed
        );
    }
    
    // ===== RECEIVE FUNCTION =====
    receive() external payable {
        // Allow contract to receive ETH directly
        tokenBalances[address(0)] += msg.value;
        totalValueDeposited += msg.value;
        emit Deposit(msg.sender, address(0), msg.value, block.timestamp);
    }
}