//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _id;

  struct MarketItem {
    uint256 tokenId;
    address nftContract;
    address payable seller;
    address payable owner;
    uint256 price;
    bool isListed;
  }

  address payable private _cashbox;
  mapping(uint256 => MarketItem) private idToMarketItem;

  constructor() ERC721("Metaverse Tokens", "METT") {
    _cashbox = payable(msg.sender);
  }

  function createToken(string memory tokenURI) public returns (uint256) {
    uint256 tokenId = _id.current();

    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);
    setApprovalForAll(address(this), true);

    idToMarketItem[tokenId] = MarketItem(tokenId, address(this), payable(0), payable(msg.sender), 0, false);

    _id.increment();

    return tokenId;
  }

  function getItem(uint256 tokenId) public view returns (MarketItem memory item) {
    return idToMarketItem[tokenId];
  }

  function createSalesOffer(uint256 tokenId, uint256 price) public payable nonReentrant {
    MarketItem storage itemToSell = idToMarketItem[tokenId];

    require(itemToSell.owner == msg.sender, "You are not the owner of this token");
    require(price > 0, "Price must be greater than 0");
    require(itemToSell.isListed == false, "This token is already listed");

    itemToSell.price = price;
    itemToSell.isListed = true;

    IERC721(address(this)).transferFrom(msg.sender, address(this), tokenId);
  }

  function createPurchaseOffer(uint256 tokenId) public payable nonReentrant {
    MarketItem storage itemToBuy = idToMarketItem[tokenId];

    require(itemToBuy.isListed == true, "This token is not listed");
    require(itemToBuy.price == msg.value, "Price does not match");
    require(itemToBuy.seller != msg.sender, "You are the seller of this token");

    itemToBuy.seller.transfer(msg.value);
    IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);

    itemToBuy.owner = payable(msg.sender);
    itemToBuy.seller = payable(0);
    itemToBuy.isListed = false;
    itemToBuy.price = 0;

    // _cashbox.transfer(0.1 * msg.value);
  }

  function fetchMarketAllItems() public view returns (MarketItem[] memory) {
    uint256 _marketItemsCount = _id.current();

    MarketItem[] memory items = new MarketItem[](_marketItemsCount);
    for (uint256 i = 0; i < _marketItemsCount; i++) {
      items[i] = idToMarketItem[i];
    }
    return items;
  }

  function fetchMyAllItems() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _id.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i].owner == msg.sender) {
        itemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i].owner == msg.sender) {
        items[currentIndex] = idToMarketItem[i];
        currentIndex++;
      }
    }

    return items;
  }
}
