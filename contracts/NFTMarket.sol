//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./NFT.sol";

contract NFTMarket is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _allItemsCounter;
  Counters.Counter private _soldItemsCounter;

  address payable private owner;
  uint256 public listingPrice = 0.025 ether;
  NFT private creator;

  constructor() {
    owner = payable(msg.sender);
    creator = new NFT(address(this));
  }

  struct MarketItem {
    uint256 itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  function getMarketListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  // function createMarketItem(string memory tokenURI) public returns (uint256) {
  //   uint256 tokenId = creator.createToken(tokenURI);
  //   return tokenId;
  // }

  event SalesOfferCreated(
    uint256 indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  function createSalesOffer(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must match listing price");

    _allItemsCounter.increment();
    uint256 itemId = _allItemsCounter.current();

    idToMarketItem[itemId] = MarketItem(itemId, nftContract, tokenId, payable(msg.sender), payable(address(0)), price, false);

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit SalesOfferCreated(itemId, nftContract, tokenId, msg.sender, address(0), price, false);
  }

  function createPurchaseOffer(address nftContract, uint256 itemId) public payable nonReentrant {
    uint256 price = idToMarketItem[itemId].price;
    uint256 tokenId = idToMarketItem[itemId].tokenId;

    require(msg.value == price, "Price must match item price");

    idToMarketItem[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    _soldItemsCounter.increment();
    payable(owner).transfer(listingPrice);
  }

  function fetchMarketAllItems() public view returns (MarketItem[] memory) {
    uint256 itemCount = _allItemsCounter.current();
    uint256 unsoldItemCount = _allItemsCounter.current() - _soldItemsCounter.current();
    uint256 currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);

    for (uint256 i = 0; i < itemCount; i++) {
      if (idToMarketItem[i].owner == address(0)) {
        uint256 currentId = idToMarketItem[i + 1].itemId;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex++;
      }
    }

    return items;
  }

  function fetchMyAllItems() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _allItemsCounter.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint256 i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint256 currentId = idToMarketItem[i + 1].itemId;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex++;
      }
    }

    return items;
  }

  function fetchMyListedItems() public view returns (MarketItem[] memory) {
    uint256 totalItemCount = _allItemsCounter.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount++;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);

    for (uint256 i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint256 currentId = idToMarketItem[i + 1].itemId;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex++;
      }
    }

    return items;
  }
}
