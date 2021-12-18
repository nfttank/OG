// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Defines colors for OG NFTs. When minting, a color and an application (which part of the OG NFT to colorize) has to be defined.
 * There are four different applications (back, frame, digit, slug), but only a few colors to mint.
 * @author nfttank.eth
 */
contract OGColor is ERC721Enumerable, ReentrancyGuard, Ownable {
    
    mapping(uint256 => string) private _colors;
    mapping(uint256 => string) private _applications;
    
    mapping(address => string[]) private _backColorsForAddress;
    mapping(address => string[]) private _frameColorsForAddress;
    mapping(address => string[]) private _digitColorsForAddress;
    mapping(address => string[]) private _slugColorsForAddress;
    
    constructor() ERC721("OGColor", "OGCOLOR") Ownable() {
    }

    function mint(string calldata application, string calldata hexColor) public nonReentrant {

        // take the next free token index, no need to define it externally
        uint256 tokenId = totalSupply();

        require(tokenId < 255, "No free tokens available.");
        require(isValidApplication(application), "Application invalid, allowed are 'back', 'frame', 'digit' and 'slug'.");
        require(isValidHexColor(hexColor), "Color invalid, use hex format like '#224466'.");

        _colors[tokenId] = hexColor;
        _applications[tokenId] = application;
        
        _safeMint(_msgSender(), tokenId);
    }

    function isValidApplication(string calldata hexColor) private pure returns (bool) {
        bytes32 k = keccak256(bytes(hexColor));
        return k == keccak256("back") 
            || k == keccak256("frame")
            || k == keccak256("digit") 
            || k == keccak256("slug");
    }
    
    function isValidHexColor(string calldata hexColor) public pure returns (bool) {
        
        bytes memory hexColorBytes = bytes(hexColor);
        
        if (hexColorBytes.length != 7) // #ffffff
            return false;
        
        for (uint16 i = 0; i < hexColorBytes.length; i++) {
            
            int16 char = int16(uint16(uint8(hexColorBytes[i])));
            
            if (i == 0) {
                if (char != 35) // #
                    return false;
            }
            else {
                int16 num1 = char - 48; // charIndex - 48 is the numeric value
                int16 num2 = char - 65; // charIndex - 65 uppercase letters
                int16 num3 = char - 97; // charIndex - 97 lowercase letters
                bool isHex = (num1 >= 0 && num1 <= 9) || (num2 >= 0 && num2 <= 5) || (num3 >= 0 && num3 <= 5); // 0-9 or A-H or a-h
                if (!isHex)
                     return false;
            }
        }
        
        return true;
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
        string memory back = getColorFromArray(colors, "#FFFFFF");
        
        colors = _frameColorsForAddress[forAddress];
        string memory frame = getColorFromArray(colors, "#000000");
        
        colors = _digitColorsForAddress[forAddress];
        string memory digit = getColorFromArray(colors, "#000000");
        
        colors = _slugColorsForAddress[forAddress];
        string memory slug = getColorFromArray(colors, "#FFFFFF");
        
        return (back, frame, digit, slug);
    }

    function getColorFromArray(string[] memory colors, string memory fallbackValue) internal pure returns (string memory) {

        // https://ethereum.stackexchange.com/questions/63653/why-i-cannot-loop-through-array-backwards-in-solidity/63654
        for (uint256 i = colors.length; i > 0; i--) {
            if (bytes(colors[i - 1]).length > 0)
                return colors[i - 1];
        }

        return fallbackValue;
    }
}