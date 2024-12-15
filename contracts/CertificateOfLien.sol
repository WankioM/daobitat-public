// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CertificateOfLien is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    struct Lien {
        uint256 landPrice;
        address borrower;
        address lender;
        uint256 period;
        uint256 interestRate;
        bool isActive;
        uint256 creationTime;
        uint256 collateralAmount;
        uint256 loanAmount;
    }

    mapping(uint256 => Lien) public liens;
    Counters.Counter private _tokenIdCounter;

    uint256 public constant INTEREST_RATE_PRECISION = 10000;
    uint256 public constant MAX_INTEREST_RATE = 5000; // 50%
    uint256 public constant MIN_LOAN_PERIOD = 1 days;
    uint256 public constant MAX_LOAN_PERIOD = 365 days;

    event LienCreated(uint256 indexed tokenId, address indexed borrower, address indexed lender, uint256 landPrice, uint256 period, uint256 interestRate);
    event LoanRepaid(uint256 indexed tokenId, address indexed borrower, address indexed lender, uint256 amount);
    event LienDefaulted(uint256 indexed tokenId, address indexed previousOwner, address indexed newOwner);
    event LoanFunded(uint256 indexed tokenId, address indexed lender, uint256 amount);

    constructor() ERC721("CertificateOfLien", "COL") {}

    function createLien(
        uint256 landPrice,
        uint256 period,
        uint256 interestRate,
        uint256 loanAmount
    ) public payable nonReentrant returns (uint256) {
        require(landPrice > 0, "Land price must be greater than 0");
        require(period >= MIN_LOAN_PERIOD && period <= MAX_LOAN_PERIOD, "Invalid loan period");
        require(interestRate > 0 && interestRate <= MAX_INTEREST_RATE, "Invalid interest rate");
        require(msg.value >= landPrice / 10, "Collateral must be at least 10% of land price");
        require(loanAmount > 0 && loanAmount <= landPrice, "Invalid loan amount");

        uint256 newTokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, newTokenId);

        liens[newTokenId] = Lien({
            landPrice: landPrice,
            borrower: msg.sender,
            lender: address(0), // Will be set when a lender invests
            period: period,
            interestRate: interestRate,
            isActive: true,
            creationTime: block.timestamp,
            collateralAmount: msg.value,
            loanAmount: loanAmount
        });

        emit LienCreated(newTokenId, msg.sender, address(0), landPrice, period, interestRate);
        return newTokenId;
    }

    function invest(uint256 tokenId) public payable nonReentrant {
        require(_exists(tokenId), "Lien does not exist");
        Lien storage lien = liens[tokenId];
        require(lien.isActive, "Lien is not active");
        require(lien.lender == address(0), "Loan already funded");
        require(msg.value == lien.loanAmount, "Incorrect loan amount");

        lien.lender = msg.sender;
        payable(lien.borrower).transfer(msg.value);

        emit LoanFunded(tokenId, msg.sender, msg.value);
    }

    function repayLoan(uint256 tokenId) public payable nonReentrant {
        require(_exists(tokenId), "Lien does not exist");
        Lien storage lien = liens[tokenId];
        require(lien.isActive, "Lien is not active");
        require(msg.sender == lien.borrower, "Only borrower can repay the loan");
        require(lien.lender != address(0), "Loan not yet funded");

        uint256 repaymentAmount = calculateRepaymentAmount(tokenId);
        require(msg.value >= repaymentAmount, "Insufficient payment");

        lien.isActive = false;
        payable(lien.lender).transfer(repaymentAmount);
        
        // Return excess payment and collateral to the borrower
        uint256 totalReturn = msg.value - repaymentAmount + lien.collateralAmount;
        if (totalReturn > 0) {
            payable(lien.borrower).transfer(totalReturn);
        }

        emit LoanRepaid(tokenId, lien.borrower, lien.lender, repaymentAmount);
    }

    function calculateRepaymentAmount(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Lien does not exist");
        Lien storage lien = liens[tokenId];
        uint256 timeElapsed = block.timestamp - lien.creationTime;
        uint256 interest = (lien.loanAmount * lien.interestRate * timeElapsed) / (365 days * INTEREST_RATE_PRECISION);
        return lien.loanAmount + interest;
    }

    function transferAfterDefault(uint256 tokenId) public onlyOwner nonReentrant {
        require(_exists(tokenId), "Lien does not exist");
        Lien storage lien = liens[tokenId];
        require(lien.isActive, "Lien is not active");
        require(block.timestamp > lien.creationTime + lien.period, "Loan period not expired");
        require(lien.lender != address(0), "Loan not yet funded");

        address previousOwner = ownerOf(tokenId);
        _transfer(previousOwner, lien.lender, tokenId);
        lien.isActive = false;

        // Transfer collateral to the lender
        payable(lien.lender).transfer(lien.collateralAmount);

        emit LienDefaulted(tokenId, previousOwner, lien.lender);
    }

    function getLienDetails(uint256 tokenId) public view returns (Lien memory) {
        require(_exists(tokenId), "Lien does not exist");
        return liens[tokenId];
    }

    function withdrawExcessFunds() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds to withdraw");
        payable(owner()).transfer(contractBalance);
    }
}