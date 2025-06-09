//SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";



contract SimpleTestNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    constructor() ERC721("SimpleTestNFT", "STNFT") {}

    function mint(string calldata _tokenURI) external returns (uint256 tokenId){
        tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

}