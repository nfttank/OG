// // SPDX-License-Identifier: MIT

// pragma solidity ^0.8.0;

// import "./ERC721SlimSequential.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

// /**
//  * @dev This is an alternative implementation to OpenZeppelin's ERC721Enumerable.
//  * ERC721EnumerableSlim is focussing on reducing the gas costs by reducing efforts
//  * in writing methods. With that, reading methods might do an extra mile
//  * which is a fair trade off for significant lower cas costs.
//  * Heavily inspired by squeebo_nft and GoldenXnft
//  * @author nfttank.eth
//  */
// abstract contract ERC721SlimNonSequentialEnumerable is ERC721SlimNonSequential, IERC721Enumerable {
//     /**
//      * @dev See {IERC165-supportsInterface}.
//      */
//     function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721SlimSequential) returns (bool) {
//         return interfaceId == type(IERC721Enumerable).interfaceId || super.supportsInterface(interfaceId);
//     }

//     /**
//      * @dev See {IERC721Enumerable-totalSupply}.
//      */
//     function totalSupply() public view virtual override returns (uint256) {
//         return _owners.length;
//     }

//     /**
//      * @dev See {IERC721Enumerable-tokenByIndex}.
//      */
//     function tokenByIndex(uint256 index) public view virtual override returns (uint256) {
//         require(index < _owners.length, "ERC721Enumerable: global index out of bounds");
//         return index;
//     }

//     /**
//      * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
//      */
//     function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256 tokenId) {
//         require(index < balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
//         return _owners[owner][i];
//     }
// }