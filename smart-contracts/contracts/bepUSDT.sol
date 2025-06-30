// SPDX-License-Identifier: MIT


pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
}

contract TestUSD {
    string public name = "Test USD";
    string public symbol = "USD.B";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    bool public tradingEnabled = false;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public isBlocked;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier tradingOpen(address from, address to) {
        if (from != owner && to != owner) {
            require(tradingEnabled, "Trading is disabled");
            require(!isBlocked[from], "Sender is blocked");
            require(!isBlocked[to], "Recipient is blocked");
        }
        _;
    }

    constructor() {
        owner = msg.sender;
        uint256 initialSupply = 100_000_000_000 * 10 ** uint256(decimals);
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }

    function transfer(address to, uint256 value) public tradingOpen(msg.sender, to) returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public tradingOpen(from, to) returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    // Admin Controls

    function startTrading() external onlyOwner {
        tradingEnabled = true;
    }

    function stopTrading() external onlyOwner {
        tradingEnabled = false;
    }

    function blockWallet(address wallet) external onlyOwner {
        isBlocked[wallet] = true;
    }

    function unblockWallet(address wallet) external onlyOwner {
        isBlocked[wallet] = false;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        uint256 minted = amount * 10 ** uint256(decimals);
        totalSupply += minted;
        balanceOf[to] += minted;
        emit Transfer(address(0), to, minted);
    }

    function recoverTokens(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(this), "Cannot recover own token");
        IERC20(tokenAddress).transfer(owner, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}