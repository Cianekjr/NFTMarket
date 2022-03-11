//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokensCounter;
  address public contractAddress;

  constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
    contractAddress = marketplaceAddress;
  }

  function createToken(string memory tokenURI) public returns (uint256) {
    _tokensCounter.increment();

    uint256 tokenId = _tokensCounter.current();

    _mint(msg.sender, tokenId);

    _setTokenURI(tokenId, tokenURI);
    setApprovalForAll(contractAddress, true);

    return tokenId;
  }
}
