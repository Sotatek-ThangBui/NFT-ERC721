// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";

contract ThewinTKMarketplace is OwnableUpgradeable {

    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _itemIds;

    function initialize() public virtual initializer {
        __Ownable_init();
    }

    mapping(uint256 => Item) private _items;

    struct Item {
        uint256 itemId;
        address nftAddress;
        uint256 nftId;
        uint256 price;
        address payable seller;
        address payable owner;
        bool sold;
    }

    event Offered(
        uint256 itemId,
        address indexed nftAddress,
        uint256 nftId,
        uint256 price,
        address indexed seller,
        address indexed owner
    );
    event Bought(
        uint256 itemId,
        address indexed nftAddress,
        uint256 nftId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );

    // Make item to offer on the marketplace
    function makeItem(address _nftAddress, uint256 _nftId, uint256 _price) external virtual returns (uint256) {
        require(_price > 0, "Price must be greater than zero");
        // transfer nft
        IERC721 nft = IERC721(_nftAddress);
        nft.transferFrom(msg.sender, address(this), _nftId);
            // increment itemCount
        _itemIds.increment();
        uint256 newItemId = _itemIds.current();
        // add new item to items mapping
        _items[newItemId] = Item (
            newItemId,
            _nftAddress,
            _nftId,
            _price,
            payable(msg.sender),
            payable(address(this)),
            false
        );
        // emit Offered event
        emit Offered(
            newItemId,
            _nftAddress,
            _nftId,
            _price,
            msg.sender,
            address(this)
        );
        return newItemId;
    }

    function purchaseItem(uint256 _itemId) external payable virtual {
        uint256 _totalPrice = _items[_itemId].price;
        Item storage item = _items[_itemId];
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller
        item.seller.transfer(item.price);
    
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        IERC721 nft = IERC721(item.nftAddress);
        nft.transferFrom(address(this), msg.sender, item.nftId);
        // emit Bought event
        emit Bought(
            _itemId,
            item.nftAddress,
            item.nftId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function getAllItems() public view virtual returns (Item[] memory) {
        Item[] memory items = new Item[](_itemIds.current());

        if (_itemIds.current() == 0) {
            return items;
        }

        for (uint256 i = 0; i < _itemIds.current(); i++) {
            items[i + 1] = _items[i + 1];
        }
        return items;
    }

    function itemAt(uint256 _itemId)
        public
        view
        virtual
        returns (Item memory)
    {
        return _items[_itemId];
    }
}