// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./TrustFund.sol";

contract TrustFactory {
    // ===== STATE VARIABLES =====
    address[] public allTrusts;
    mapping(address => address[]) public userTrusts;
    mapping(address => bool) public isTrust;
    uint256 public totalTrusts;
    
    // ===== EVENTS =====
    event TrustCreated(
        address indexed creator,
        address indexed trustAddress,
        string name,
        uint256 indexed trustId
    );
    
    // ===== FUNCTIONS =====
    
    /**
     * @dev Creates a new trust fund contract
     * @param _name Name of the trust
     * @param _purpose Purpose statement for the trust
     * @param _beneficiaries Array of beneficiary addresses
     * @param _allocations Array of allocation percentages (must sum to 100)
     * @param _trustees Array of trustee addresses
     * @return trustAddress Address of the newly created trust contract
     */
    function createTrust(
        string memory _name,
        string memory _purpose,
        address[] memory _beneficiaries,
        uint256[] memory _allocations,
        address[] memory _trustees
    ) external returns (address trustAddress) {
        // Input validation
        require(bytes(_name).length > 0, "Trust name required");
        require(_beneficiaries.length > 0, "At least one beneficiary required");
        require(_beneficiaries.length == _allocations.length, "Beneficiaries and allocations length mismatch");
        require(_trustees.length > 0, "At least one trustee required");
        
        // Validate allocations sum to 100
        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < _allocations.length; i++) {
            totalAllocation += _allocations[i];
        }
        require(totalAllocation == 100, "Allocations must sum to 100");
        
        // Create new trust contract
        TrustFund newTrust = new TrustFund(
            msg.sender,
            _name,
            _purpose,
            _beneficiaries,
            _allocations,
            _trustees
        );
        
        trustAddress = address(newTrust);
        
        // Update state
        allTrusts.push(trustAddress);
        userTrusts[msg.sender].push(trustAddress);
        isTrust[trustAddress] = true;
        totalTrusts++;
        
        // Emit event
        emit TrustCreated(msg.sender, trustAddress, _name, totalTrusts - 1);
        
        return trustAddress;
    }
    
    /**
     * @dev Get all trusts created by a user
     * @param user Address of the user
     * @return Array of trust contract addresses
     */
    function getUserTrusts(address user) external view returns (address[] memory) {
        return userTrusts[user];
    }
    
    /**
     * @dev Get total number of trusts created
     * @return Total number of trusts
     */
    function getTotalTrusts() external view returns (uint256) {
        return totalTrusts;
    }
    
    /**
     * @dev Get all trust addresses (paginated for gas efficiency)
     * @param offset Starting index
     * @param limit Maximum number of results
     * @return trusts Array of trust addresses
     * @return hasMore Whether there are more results
     */
    function getAllTrusts(uint256 offset, uint256 limit) 
        external 
        view 
        returns (address[] memory trusts, bool hasMore) 
    {
        require(offset < allTrusts.length, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > allTrusts.length) {
            end = allTrusts.length;
        }
        
        trusts = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            trusts[i - offset] = allTrusts[i];
        }
        
        hasMore = end < allTrusts.length;
    }
    
    /**
     * @dev Check if an address is a trust created by this factory
     * @param trustAddress Address to check
     * @return True if it's a valid trust
     */
    function isValidTrust(address trustAddress) external view returns (bool) {
        return isTrust[trustAddress];
    }
}