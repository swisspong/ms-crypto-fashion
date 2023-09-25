// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CryptoFashionToken is ERC20 {
    struct Order {
        string orderId;
        uint256 amount;
        string userId;
        string mchtId;
    }
    address public admin;

    event PaymentDone(
        address payer,
        uint256 amount,
        string orderId,
        string userId,
        string mchtId,
        uint256 date
    );
    event RefundDone(
        address payer,
        uint256 amount,
        string orderId,
        string userId,
        string mchtId,
        uint256 date
    );
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    constructor(address adminAddress) ERC20("CryptoFashionToken", "CFT") {
        admin = adminAddress;
    }

    function buyWithOrderArr(uint256 total, Order[] memory orders)
        public
        payable
        returns (bool)
    {
        require(orders.length > 0, "Orders must be greater than 0.");
        require(msg.value == total, "Invalid amouunt.");
        _mint(msg.sender, msg.value);
        approve(msg.sender, msg.value);
        // transferFrom(msg.sender, address(this), msg.value);
        transferFrom(msg.sender, admin, msg.value);
        for (uint256 i = 0; i < orders.length; i++) {
            emit PaymentDone(
                msg.sender,
                orders[i].amount,
                orders[i].orderId,
                orders[i].userId,
                orders[i].mchtId,
                block.timestamp
            );
        }
        return true;
    }

    function refund(address recipient, Order memory order)
        public
        onlyAdmin
        returns (bool)
    {
        require(order.amount > 0, "Amount must be greater than 0.");
        // require(msg.value == total, "Invalid amouunt.");
        // _mint(admin, order.amount);
        approve(admin, order.amount);
        // transferFrom(msg.sender, address(this), msg.value);
        transferFrom(admin, recipient, order.amount);
        // for (uint256 i = 0; i < order.length; i++) {
        emit RefundDone(
            msg.sender,
            order.amount,
            order.orderId,
            order.userId,
            order.mchtId,
            block.timestamp
        );
        // }
        return true;
    }

    function deposit(uint256 amount) public payable {
        _mint(msg.sender, amount);
    }
}
