// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

/**
 * @title Defines colors for OG NFTs. When minting, a color and an application (which part of the OG NFT to colorize) has to be defined.
 * There are four different applications (back, frame, digit, slug).
 * @notice You can totally mess your mint up by using unsupported color strings. Make sure you know what you are doing as there is no refund for wasted mints.
 * @author nfttank.eth
 */
contract OGColor is ERC721, Ownable {
    
    uint256 private _totalSupply = 0;

    uint256 private constant MAX_SUPPLY = 2500;

    mapping(uint256 => string) private _colors;
    mapping(uint256 => string) private _applications;
    
    mapping(address => string[]) private _backColorsForAddress;
    mapping(address => string[]) private _frameColorsForAddress;
    mapping(address => string[]) private _digitColorsForAddress;
    mapping(address => string[]) private _slugColorsForAddress;

    uint256 public _colorPrice = 40000000000000000; //0.04 ETH
    uint256 public _extPrice =  100000000000000000; //0.10 ETH;
    
    constructor() ERC721("OGColor", "OGCOLOR") Ownable() {
    }

    /**
    * @notice Mint a color for a specific application for all your OG tokens you hold in the same wallet.
    * Applications are back, frame, digit and slug.
    * It's recommended to use lower case color strings like #ffffff instead of #FFFFFF.
    * You can totally mess your mint up by using unsupported color strings.
    * Make sure you know what you are doing as there is no refund for wasted mints.
    * @param application The part of the OG NFT to colorize. back, frame, digit or slug.
    * @param color The color of the NFT to mint. Use a format like #ffffff or #fff. If you mess this up, your minted color won't work.
    */
    function mint(string calldata application, string calldata color) public payable {

        require(_totalSupply < MAX_SUPPLY, "No tokens available anymore.");
        require(isValidApplication(application), "Application invalid, allowed are 'back', 'frame', 'digit' and 'slug'.");

        if (_msgSender() != owner()) {
            if (bytes(color).length <= 7) { // like #527862 or #fff
                require(_colorPrice <= msg.value, "Ether value sent is not correct");
            } else { // what can that be? oO
                require(_extPrice <= msg.value, "Ether value sent is not correct");
            }
        }

        uint256 newId = ++_totalSupply;

        _colors[newId] = color;
        _applications[newId] = application;
        
        _safeMint(_msgSender(), newId);
    }

    function setPrice(uint256 forColor, uint256 forExt) external onlyOwner {
        _colorPrice = forColor;
        _extPrice = forExt;
    }

    function getPrice() external view returns (uint256, uint256) {
        return (_colorPrice, _extPrice);
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    function renderSvg(uint256 tokenId) public virtual view returns (string memory) {
        require(tokenId > 0 && tokenId <= MAX_SUPPLY, "Token Id invalid");
        require(_exists(tokenId), "Token does not exist");
        
        string[] memory parts = new string[](7);

        parts[0] = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1000' height='1000' viewBox='0 0 1000 1000'>";
        parts[1] = string(abi.encodePacked("<defs>", formatColor(_colors[tokenId], _applications[tokenId]), "</defs>"));
        parts[2] = "<mask id='_mask'>";
        parts[3] = "    <circle vector-effect='non-scaling-stroke' cx='500' cy='500' r='450' fill='white' stroke='none' />";
        parts[4] = "</mask>";
        parts[5] = string(abi.encodePacked("<circle vector-effect='non-scaling-stroke' cx='500' cy='500' r='450' fill='url(#", _applications[tokenId], ")' mask='url(#_mask)' />"));
        parts[6] = "</svg>";
        
        return string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]));
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(tokenId > 0 && tokenId <= MAX_SUPPLY, "Token Id invalid");
        require(_exists(tokenId), "Token does not exist");
    
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "OG Color", "description": "", ', getAttributesForColor(tokenId), ', "image": "data:image/svg+xml;base64,', Base64.encode(bytes(renderSvg(tokenId))), '"}'))));
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function getAttributesForColor(uint256 tokenId) private view returns (string memory) {

        bytes memory ax = '#c8fbfb';
        bytes memory ap = '#856f56';
        bytes memory zz = '#7da269';

        string memory traits = string(abi.encodePacked('{ "trait_type": "Application", "value": "', _applications[tokenId], '" }'));

        bytes memory color = bytes(_colors[tokenId]);
        string memory type_;

        if (stringContains(color, ax)) {
            type_ = 'Alien';
        } else if (stringContains(color, ap)) {
            type_ = 'Ape';
        } else if (stringContains(color, zz)) {
            type_ = 'Zombie';
        }

        if (bytes(type_).length > 0) {
            traits = string(abi.encodePacked(traits, (bytes(traits).length > 0 ? ', ' : ''), '{ "trait_type": "Type", "value": "', type_, '" }'));
        }

        return string(abi.encodePacked('"attributes": [', traits, ']'));
    }

    function getOgAttributes(address forAddress, uint256 tokenId) external view returns (string memory) {
        
        (string memory back, string memory frame, string memory digit, string memory slug) = this.getColors(forAddress, tokenId);

        bytes memory b = bytes(back);
        bytes memory f = bytes(frame);
        bytes memory d = bytes(digit);
        bytes memory s = bytes(slug);

        bytes memory ax = '#c8fbfb';
        bytes memory ap = '#856f56';
        bytes memory zz = '#7da269';

        if (stringContains(b, ax) || stringContains(f, ax) || stringContains(d, ax) || stringContains(s, ax)) {
            return '{ "trait_type": "Color", "value": "Alien" }';
        }

        if (stringContains(b, ap) || stringContains(f, ap) || stringContains(d, ap) || stringContains(s, ap)) {
            return '{ "trait_type": "Color", "value": "Ape" }';
        }

        if (stringContains(b, zz) || stringContains(f, zz) || stringContains(d, zz) || stringContains(s, zz)) {
           return '{ "trait_type": "Color", "value": "Zombie" }';
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

        bytes memory except = bytes(exceptColor);

        // https://ethereum.stackexchange.com/questions/63653/why-i-cannot-loop-through-array-backwards-in-solidity/63654
        for (uint256 i = colors.length; i > 0; i--) {
            if (bytesEquals(bytes(colors[i - 1]), except)) {
                delete colors[i - 1];
                return;
            }
        }
    }

    function bytesEquals(bytes memory a, bytes memory b) internal pure returns(bool) {
        return (a.length == b.length) && (keccak256(a) == keccak256(b));
    }

    function stringContains(bytes memory where, bytes memory what) internal pure returns (bool) {

        require(where.length >= what.length);

        bool found = false;
        for (uint i = 0; i <= where.length - what.length; i++) {
            bool flag = true;
            for (uint j = 0; j < what.length; j++)
                if (where [i + j] != what [j]) {
                    flag = false;
                    break;
                }
            if (flag) {
                found = true;
                break;
            }
        }

        return found;
    }

    function getColors(address forAddress, uint256 tokenId) external view returns (string memory backColor, string memory frameColor, string memory digitColor, string memory slugColor) {

        string[] memory colors = tokenId < 99999 ? _backColorsForAddress[forAddress] : new string[](0); // pseudo use of tokenId to prevent warnings. We still want the tokenId in the method arguments to be able to modify colors by the tokenId in the future.
        string memory back = getColorFromArray(colors, "#ffffff", "back");
        
        colors = _frameColorsForAddress[forAddress];
        string memory frame = getColorFromArray(colors, "#000000", "frame");
        
        colors = _digitColorsForAddress[forAddress];
        string memory digit = getColorFromArray(colors, "#000000", "digit");
        
        colors = _slugColorsForAddress[forAddress];
        string memory slug = getColorFromArray(colors, "#ffffff", "slug");
        
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