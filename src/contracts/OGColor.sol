// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Defines colors for OG NFTs. When minting, a color and an application (which part of the OG NFT to colorize) has to be defined.
 * There are four different applications (back, frame, digit, slug), but only a few colors to mint.
 * @author nfttank.eth
 */
contract OGColor is ERC721, Ownable {
    
    uint256 private _tokenId;

    mapping(uint256 => string) private _colors;
    mapping(uint256 => string) private _applications;
    
    mapping(address => string[]) private _backColorsForAddress;
    mapping(address => string[]) private _frameColorsForAddress;
    mapping(address => string[]) private _digitColorsForAddress;
    mapping(address => string[]) private _slugColorsForAddress;
    
    constructor() ERC721("OGColor", "OGCOLOR") Ownable() {
    }

    function mint(string calldata application, string calldata defintion) public {

        require(_tokenId + 1 < 255, "No free tokens available.");
        require(isValidApplication(application), "Application invalid, allowed are 'back', 'frame', 'digit' and 'slug'.");

        _tokenId++;

        _colors[_tokenId] = defintion;
        _applications[_tokenId] = application;
        
        _safeMint(_msgSender(), _tokenId);
    }

    function isValidApplication(string calldata application) private pure returns (bool) {
        bytes32 k = keccak256(bytes(application));
        return k == keccak256("back") 
            || k == keccak256("frame")
            || k == keccak256("digit") 
            || k == keccak256("slug");
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == to) // pseudo use of from-variable to prevent warnings while keeping the overridden method signature
            return;

        string memory color = _colors[tokenId];
        bytes32 application = keccak256(bytes(_applications[tokenId]));
        
        if (application == keccak256("back")) {
            if (from != address(0))
               removeColor(_backColorsForAddress[from], color);
            _backColorsForAddress[to].push(color);
        }
        else if (application == keccak256("frame")) {
            if (from != address(0))
                removeColor(_frameColorsForAddress[from], color);
            _frameColorsForAddress[to].push(color);
        }
        else if (application == keccak256("digit")) {
            if (from != address(0))
                removeColor(_digitColorsForAddress[from], color);
            _digitColorsForAddress[to].push(color);
        }
        else if (application == keccak256("slug")) {
            if (from != address(0))
                removeColor(_slugColorsForAddress[from], color);
            _slugColorsForAddress[to].push(color);
        }
    }

    function removeColor(string[] storage colors, string memory exceptColor) private {

        // https://ethereum.stackexchange.com/questions/63653/why-i-cannot-loop-through-array-backwards-in-solidity/63654
        for (uint256 i = colors.length; i > 0; i--) {
            if (stringEquals(colors[i - 1], exceptColor)) {
                delete colors[i - 1];
                return;
            }
        }
    }

    function stringEquals(string memory a, string memory b) internal pure returns(bool) {
        return bytesEquals(bytes(a), bytes(b));
    }
    
    function bytesEquals(bytes memory a, bytes memory b) internal pure returns(bool) {
        return (a.length == b.length) && (keccak256(a) == keccak256(b));
    }

    function getColors(address forAddress, uint256 tokenId) external view returns (string memory backColor, string memory frameColor, string memory digitColor, string memory slugColor) {

        string[] memory colors = tokenId < 99999 ? _backColorsForAddress[forAddress] : new string[](0); // pseudo use of tokenId to prevent warnings. We still want the tokenId in the method arguments to be able to modify colors by the tokenId in the future.
        string memory back = getColorFromArray(colors, "#FFFFFF", "back");
        
        colors = _frameColorsForAddress[forAddress];
        string memory frame = getColorFromArray(colors, "#000000", "frame");
        
        colors = _digitColorsForAddress[forAddress];
        string memory digit = getColorFromArray(colors, "#000000", "digit");
        
        colors = _slugColorsForAddress[forAddress];
        string memory slug = getColorFromArray(colors, "#FFFFFF", "slug");
        
        return (back, frame, digit, slug);
    }

    function getColorFromArray(string[] memory colors, string memory fallbackValue, string memory application) internal pure returns (string memory) {

        string memory color;

        // https://ethereum.stackexchange.com/questions/63653/why-i-cannot-loop-through-array-backwards-in-solidity/63654
        for (uint256 i = colors.length; i > 0; i--) {
            if (bytes(colors[i - 1]).length > 0) {
                color = colors[i - 1];
                break;
            }
        }

        if (bytes(color).length == 0) {
            color = fallbackValue;
        }

        // turn hex colors like #527862 into a linear gradient
        if (bytes(color).length <= 7) {
            return string(abi.encodePacked("<linearGradient id='", application, "'><stop stop-color='", color, "'/></linearGradient>"));
        }

        return color;
    }

    function getColorDefinition(string memory application, string memory color) internal pure returns (string memory) {
        
    }
}
