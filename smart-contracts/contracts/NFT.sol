//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleTestNFT is ERC721URIStorage, Ownable {

    uint256 private _tokenIdCounter;
    constructor(string memory _name, string memory _symbol, address initialOwner) ERC721(_name, _symbol) Ownable(initialOwner) {}

    function mint(string calldata _tokenURI, address recipent) external onlyOwner returns (uint256 tokenId){
        _tokenIdCounter ++;
        tokenId = _tokenIdCounter;
        _mint(recipent, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return tokenId;
    }

}