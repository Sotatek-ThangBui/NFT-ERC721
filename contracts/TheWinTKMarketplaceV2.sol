//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ThewinTKMarketplace.sol";

contract TheWinTKMarketplaceV2 is ThewinTKMarketplace {

    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _itemIds;

    mapping(uint256 => Item) private _items;

    address private _treasury;

    function setTreasury(address treasury) public virtual onlyOwner {
        _treasury = treasury;
    }

    function getTreasury() public view virtual onlyOwner returns (address) {
        return _treasury;
    }

    function makeItem(
        address _nftAddress,
        uint256 _nftId,
        uint256 price
    ) public virtual override(ThewinTKMarketplace) returns (uint256) {
        require(price > 0, "Price must greater than 0");

        IERC721 nft = IERC721(_nftAddress);

        require(
            nft.ownerOf(_nftId) == msg.sender &&
            (nft.isApprovedForAll(msg.sender, address(this)) ||
            nft.getApproved(_nftId) == address(this)),
            "Invalid owner or operator"
        );

        nft.transferFrom(msg.sender, address(this), _nftId);

        _itemIds.increment();

        uint256 newOrderId = _itemIds.current();

        _items[newOrderId] = Item(
            newOrderId,
            _nftAddress,
            _nftId,
            price + getFee(price),
            payable(msg.sender),
            payable(address(this)),
            false
        );

        emit Offered(
            newOrderId,
            _nftAddress,
            _nftId,
            price + getFee(price),
            msg.sender,
            address(this)
        );

        return newOrderId;
    }

    function purchaseItem(uint256 _itemId)
    public
    payable
    virtual
    override(ThewinTKMarketplace)
    {
        uint256 price = _items[_itemId].price;

        require(msg.value == price, "Value send must equal to price");

        IERC721 nft = IERC721(_items[_itemId].nftAddress);

        address seller = _items[_itemId].seller;
        uint256 nftId = _items[_itemId].nftId;

        require(
            nft.ownerOf(_items[_itemId].nftId) != msg.sender &&
            (nft.isApprovedForAll(seller, address(this)) ||
            nft.getApproved(nftId) == address(this))
        );

        nft.transferFrom(address(this), msg.sender, nftId);

        if (_treasury != address(0)) {
            uint256 fee = getFee(price);
            payable(seller).transfer(msg.value - fee);
            payable(_treasury).transfer(fee);
        } else {
            payable(seller).transfer(msg.value);
        }

        _items[_itemId].owner = payable(msg.sender);
        _items[_itemId].seller = payable(address(0));
        _items[_itemId].sold = true;

        emit Offered(
            _itemId,
            _items[_itemId].nftAddress,
            nftId,
            price,
            seller,
            _items[_itemId].owner
        );
    }

    function getFee(uint256 _amount) public pure virtual returns (uint256) {
        return (_amount * 25) / 10000;
    }

    function orderIdOf(address _nftAddress, uint256 _nftId)
    public
    view
    virtual
    returns (uint256)
    {
        require(_itemIds.current() > 0, "No Orders");

        for (uint256 i = 0; i < _itemIds.current(); i++) {
            if (
                _items[i + 1].nftAddress == _nftAddress &&
                _items[i + 1].nftId == _nftId
            ) {
                return i + 1;
            }
        }
        revert();
    }
}