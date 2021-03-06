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

    idToMarketItem[tokenId] = MarketItem(tokenId, address(this), payable(msg.sender), 0, false);

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
    require(!itemToSell.isListed, "This token is already listed");

    itemToSell.price = price;
    itemToSell.isListed = true;

    setApprovalForAll(address(this), true);

    IERC721(address(this)).transferFrom(msg.sender, address(this), tokenId);
  }

  function changeSalesOfferPrice(uint256 tokenId, uint256 newPrice) public payable nonReentrant {
    MarketItem storage itemToSell = idToMarketItem[tokenId];

    require(itemToSell.owner == msg.sender, "You are not the owner of this token");
    require(newPrice > 0, "Price must be greater than 0");
    require(itemToSell.isListed, "This token is not listed");

    itemToSell.price = newPrice;
  }

  function cancelSalesOffer(uint256 tokenId) public payable nonReentrant {
    MarketItem storage itemToCancel = idToMarketItem[tokenId];

    require(itemToCancel.owner == msg.sender, "You are not the owner of this token");
    require(itemToCancel.isListed, "This token is not listed");

    itemToCancel.price = 0;
    itemToCancel.isListed = false;

    IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
  }

  function createPurchaseOffer(uint256 tokenId) public payable nonReentrant {
    MarketItem storage itemToBuy = idToMarketItem[tokenId];

    require(itemToBuy.isListed == true, "This token is not listed");
    require(itemToBuy.price == msg.value, "Price does not match");
    require(itemToBuy.owner != msg.sender, "You are the owner of this token");

    itemToBuy.owner.transfer(msg.value);
    IERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);

    itemToBuy.owner = payable(msg.sender);
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

  function fetchMarketListedItems() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _id.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i].isListed) {
        itemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i].isListed) {
        items[currentIndex] = idToMarketItem[i];
        currentIndex++;
      }
    }

    return items;
  }

  function fetchItem(uint256 tokenId) public view returns (MarketItem memory item) {
    return idToMarketItem[tokenId];
  }

  function fetchOwnedItems(address owner) public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _id.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i].owner == owner) {
        itemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i].owner == owner) {
        items[currentIndex] = idToMarketItem[i];
        currentIndex++;
      }
    }

    return items;
  }
}
