// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Defines colors for OG NFTs. When claiming, a color and an application (which part of the OG NFT to colorize) has to be defined.
 * There are four different applications (back, frame, digit, slug), but only a few colors to mint.
 * @author nfttank.eth
 */
contract OGColor is ERC721Enumerable, ReentrancyGuard, Ownable {
    
    mapping(uint256 => string) private _colors;
    mapping(uint256 => string) private _applications;
    
    mapping(address => string) private _backColorsForAddress;
    mapping(address => string) private _frameColorsForAddress;
    mapping(address => string) private _digitColorsForAddress;
    mapping(address => string) private _slugColorsForAddress;
    
    constructor() ERC721("OGColor", "OGCOLOR") Ownable() {
    }

    function claim(string calldata application, string calldata hexColor) public nonReentrant {

        // take the next free token index, no need to define it externally
        uint256 tokenId = totalSupply();

        require(tokenId >= 0 && tokenId <= 255, "Token Id invalid");
        require(isValidApplication(application), "Application invalid, allowed are 'back', 'frame', 'digit' and 'slug'.");
        require(isValidHexColor(hexColor), "Color invalid, use hex format '#224466'.");

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
        
        if (application == keccak256("back"))
            _backColorsForAddress[to] = color;
        else if (application == keccak256("frame"))
            _frameColorsForAddress[to] = color;
        else if (application == keccak256("digit"))
            _digitColorsForAddress[to] = color;
        else if (application == keccak256("slug"))
            _slugColorsForAddress[to] = color;
    }
    
    function getColors(address forAddress, uint256 tokenId) external view returns (string memory backColor, string memory frameColor, string memory digitColor, string memory slugColor) {

        string memory color = tokenId < 99999 ? _backColorsForAddress[forAddress] : ""; // pseudo use of tokenId to prevent warnings. We still want the tokenId in the method arguments to be able to modify colors by the tokenId in the future.
        string memory back = bytes(color).length == 0 ? "#FFFFFF" : color;
        
        color = _frameColorsForAddress[forAddress];
        string memory frame = bytes(color).length == 0 ? "#000000" : color;
        
        color = _digitColorsForAddress[forAddress];
        string memory digit = bytes(color).length == 0 ? "#000000" : color;
        
        color = _slugColorsForAddress[forAddress];
        string memory slug = bytes(color).length == 0 ? "#FFFFFF" : color;
        
        return (back, frame, digit, slug);
    }
}