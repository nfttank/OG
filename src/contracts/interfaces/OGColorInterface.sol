
// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

/**
 * @title The interface to access the OGColor contract to get the colors to render the SVG
 * @author nfttank.eth
 */
interface OGColorInterface {
    function getColors(address forAddress, uint256 tokenId) external view returns (string memory backColor, string memory frameColor, string memory digitColor, string memory slugColor);
}