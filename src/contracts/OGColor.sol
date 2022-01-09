// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

/**
 * @title Defines colors for OG NFTs. When minting, a color and an application (which part of the OG NFT to colorize) has to be defined.
 * There are four different applications (back, frame, digit, slug), but only a few colors to mint.
 * @author nfttank.eth
 */
contract OGColor is ERC721, Ownable {
    
    uint256 private _totalSupply;

    mapping(uint256 => string) private _colors;
    mapping(uint256 => string) private _applications;
    
    mapping(address => string[]) private _backColorsForAddress;
    mapping(address => string[]) private _frameColorsForAddress;
    mapping(address => string[]) private _digitColorsForAddress;
    mapping(address => string[]) private _slugColorsForAddress;
    
    constructor() ERC721("OGColor", "OGCOLOR") Ownable() {
    }

    /**
    * @dev It's recommended to use lower case color strings like #ffffff instead of #FFFFFF
    */
    function mint(string calldata application, string calldata color) public {

        require(_totalSupply + 1 < 9999, "No free tokens available.");
        require(isValidApplication(application), "Application invalid, allowed are 'back', 'frame', 'digit' and 'slug'.");

        uint256 newId = _totalSupply;

        _colors[newId] = color;
        _applications[newId] = application;
        
        _safeMint(_msgSender(), newId);

        _totalSupply++;
    }

    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    function renderSvg(uint256 tokenId) public virtual view returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
        require(_exists(tokenId), "Token does not exist");
        
        string[] memory parts = new string[](7);

        parts[0] = "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'>";
        parts[1] = string(abi.encodePacked("<defs>", formatColor(_colors[tokenId], _applications[tokenId]), "</defs>"));
        parts[2] = "<mask id='_mask'>";
        parts[3] = "    <circle vector-effect='non-scaling-stroke' cx='150' cy='150' r='125' fill='white' stroke='none' />";
        parts[4] = "</mask>";
        parts[5] = string(abi.encodePacked("<circle vector-effect='non-scaling-stroke' cx='150' cy='150' r='125' fill='url(#", _applications[tokenId], ")' mask='url(#_mask)' />"));
        parts[6] = "</svg>";
        
        return string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]));
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
        require(_exists(tokenId), "Token does not exist");
    
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "OG Color", "description": "", ', getAttributesForColor(tokenId), ', "image": "data:image/svg+xml;base64,', Base64.encode(bytes(renderSvg(tokenId))), '"}'))));
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function getAttributesForColor(uint256 tokenId) private view returns (string memory) {

        string memory traits = string(abi.encodePacked('{ "trait_type": "Application", "value": "', _applications[tokenId], '" }'));

        string memory color = _colors[tokenId];
        string memory type_;

        if (stringEquals(color, '#c8fbfb')) {
            type_ = 'Alien';
        } else if (stringEquals(color, '#7da269')) {
            type_ = 'Zombie';
        } else if (stringEquals(color, '#856f56')) {
            type_ = 'Ape';
        } 

        if (bytes(type_).length > 0) {
            traits = string(abi.encodePacked(traits, (bytes(traits).length > 0 ? ', ' : ''), '{ "trait_type": "Type", "value": "', type_, '" }'));
        }

        return string(abi.encodePacked('"attributes": [', traits, ']'));
    }

    function getOgAttributes(address forAddress, uint256 tokenId) external view returns (string memory) {
        

        (string memory back, string memory frame, string memory digit, string memory slug) = this.getColors(forAddress, tokenId);

        if (stringEquals(back, '#c8fbfb') || stringEquals(frame, '#c8fbfb') || stringEquals(digit, '#c8fbfb') || stringEquals(slug, '#c8fbfb')) {
            return string(abi.encodePacked('"attributes": [{ "trait_type": "Type", "value": "Alien" }]'));
        }

        if (stringEquals(back, '#7da269') || stringEquals(frame, '#7da269') || stringEquals(digit, '#7da269') || stringEquals(slug, '#7da269')) {
           return string(abi.encodePacked('"attributes": [{ "trait_type": "Type", "value": "Zombie" }]'));
        }

        if (stringEquals(back, '#856f56') || stringEquals(frame, '#856f56') || stringEquals(digit, '#856f56') || stringEquals(slug, '#856f56')) {
            return string(abi.encodePacked('"attributes": [{ "trait_type": "Type", "value": "Ape" }]'));
        }

        return '';
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

        return formatColor(color, application);
    }

    function formatColor(string memory color, string memory application) internal pure returns (string memory) {

        // turn hex colors like #527862 into a linear gradient
        if (bytes(color).length <= 7) {
            return string(abi.encodePacked("<linearGradient id='", application, "'><stop stop-color='", color, "'/></linearGradient>"));
        }

        return color;
    }
}