//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


contract TestNFTMarketplace is Ownable, IERC721Receiver {
    struct Listing {
        address seller;
        uint256 price;
        bool sold;

    }
    struct Auction{
        address seller;
        uint256 startTime;
        uint256 endTime;
        uint256 highestBid;
        address highestBidder;
    }
    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => mapping(uint256 => Auction)) public auctions;
    mapping(address => mapping(uint256 => bool)) public auctionExists;
    mapping(address => mapping(uint256 => address))public originalOwner;


    event ListingCreated(address indexed seller,address indexed nft, uint256 indexed tokenId, uint256 price);
    event ListingRemoved(address indexed seller,address indexed nft, uint256 indexed tokenId);
    event NFTPurchased(address indexed buyer,address indexed nft, uint256 indexed tokenId, uint256 price);
    event AuctionStarted(address indexed seller,address indexed nft, uint256 indexed tokenId, uint256 endTime);
    event AuctionEnded(address indexed winner,address indexed nft, uint256 indexed tokenId, uint256 amount);
    event BidPlaced(address indexed bidder,address indexed nft, uint256 indexed tokenId, uint256 amount);

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
    return IERC721Receiver.onERC721Received.selector;
    }

    function createListing(address _nft, uint256 _tokenId, uint256 _price) external {
        IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);
        listings[_nft][_tokenId] = Listing(msg.sender, _price, false);
        originalOwner[_nft][_tokenId] = msg.sender;
        emit ListingCreated(msg.sender, _nft, _tokenId, _price);
    }

    function removeListing(address _nft, uint256 _tokenId) external {
        require(listings[_nft][_tokenId].seller == msg.sender, "Only the seller can remove the listing");
        IERC721(_nft).transferFrom(address(this), msg.sender, _tokenId);
        delete listings[_nft][_tokenId];
        emit ListingRemoved(msg.sender, _nft, _tokenId);
        originalOwner[_nft][_tokenId] = address(0);
    }
    function buyNFT(address _nft, uint256 _tokenId) external payable {
        Listing memory listing = listings[_nft][_tokenId];
        require(listing.seller != address(0), "Listing does not exist");
        require(listing.price == msg.value, "Incorrect price");
        require(!listing.sold, "NFT already sold");
        payable(listing.seller).transfer(msg.value);
        IERC721(_nft).transferFrom(address(this), msg.sender, _tokenId);
        listing.sold = true;
        emit NFTPurchased(msg.sender, _nft, _tokenId, listing.price);   
    }
    function  createAuction(address _nft, uint256 _tokenId, uint256 _endTime) external {
        IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);
        auctions[_nft][_tokenId] = Auction(msg.sender, block.timestamp, _endTime, 0, address(0));
        auctionExists[_nft][_tokenId] = true;
        originalOwner[_nft][_tokenId] = msg.sender;
        emit AuctionStarted(msg.sender, _nft, _tokenId, _endTime);
    }

    function PlaceBid(address _nft, uint256 _tokenId) external payable {
        require(auctionExists[_nft][_tokenId], "Auction does not exist");
        Auction storage auction = auctions[_nft][_tokenId];
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.value > auction.highestBid, "Bid must be higher than the current highest bid");
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(msg.sender, _nft, _tokenId, msg.value);





}
}