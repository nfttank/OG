/*

     OOOOOOOOO                  GGGGGGGGGGGGG
   OO:::::::::OO             GGG::::::::::::G
 OO:::::::::::::OO         GG:::::::::::::::G
O:::::::OOO:::::::O       G:::::GGGGGGGG::::G
O::::::O   O::::::O      G:::::G       GGGGGG
O:::::O     O:::::O     G:::::G              
O:::::O     O:::::O     G:::::G              
O:::::O     O:::::O     G:::::G    GGGGGGGGGG
O:::::O     O:::::O     G:::::G    G::::::::G
O:::::O     O:::::O     G:::::G    GGGGG::::G
O:::::O     O:::::O     G:::::G        G::::G
O::::::O   O::::::O      G:::::G       G::::G
O:::::::OOO:::::::O       G:::::GGGGGGGG::::G
 OO:::::::::::::OO         GG:::::::::::::::G
   OO:::::::::OO             GGG::::::GGG:::G
     OOOOOOOOO                  GGGGGG   GGGG
     
*/

// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/utils/Strings.sol';
import 'base64-sol/base64.sol';
import './interfaces/GotTokenInterface.sol';
import './interfaces/OGColorInterface.sol';
import './libs/Customizer.sol';
import './libs/Digits.sol';

/**
 * @title OG
 * @dev nfttank.eth
 */
contract OG is ERC721, ReentrancyGuard, Ownable {

    mapping(address => string) private _supportedSlugs;
    mapping(string => address) private _trustedContracts;
    mapping(uint256 => string) private _custom;
    address[] private _supportedCollections;
    bool _paused;

    constructor() ERC721("OG", "OG") Ownable() {
        _trustedContracts["gottoken"] = address(0);
        _trustedContracts["ogcolor"] = address(0);
    }

    function setPaused(bool paused) external onlyOwner {
        _paused = paused;
    }

    function addSupportedCollection(address contractAddress) external onlyOwner {
         _supportedCollections.push(contractAddress);
    }
    
    function getSupportedCollections() external view onlyOwner returns (address[] memory) {
        return _supportedCollections;
    }

    function clearSupportedCollections() external onlyOwner {
         delete _supportedCollections;
    }
    
    function setSupportedCollectionSlug(address contractAddress, string calldata base64EncodedSvgSlug) external onlyOwner {
        _supportedSlugs[contractAddress] = string(Base64.decode(base64EncodedSvgSlug));
    }

    function setCustom(uint256 tokenId, string calldata base64EncodedSvg) external onlyOwner {
        _custom[tokenId] = string(Base64.decode(base64EncodedSvg));
    }

    function resetCustom(uint256 tokenId) external onlyOwner {
        delete _custom[tokenId];
    }

    function setTrustedContractAddresses(address gotTokenAddress, address ogColorAddress) external onlyOwner {
        _trustedContracts["gottoken"] = gotTokenAddress;
        _trustedContracts["ogcolor"] = ogColorAddress;
    }
    
    function getTrustedContractAddress(string calldata contractName) external view onlyOwner returns (address) {
        return _trustedContracts[contractName];
    }
    
    function renderSvg(uint256 tokenId) public virtual view returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
        
        (string memory backColor, string memory frameColor, string memory digitColor, string memory slugColor)
            = Customizer.getColors(this, _trustedContracts["ogcolor"], tokenId);
        
        address supportedCollection = Customizer.getOwnedSupportedCollection(this, _trustedContracts["gottoken"], _supportedCollections, tokenId);
        bool hasCollection = supportedCollection != address(0);

        string[8] memory parts;

        parts[0] = "<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'>";
        parts[1] = string(abi.encodePacked("<defs><linearGradient id='backColor'><stop stop-color='", backColor, "'/></linearGradient><linearGradient id='frameColor'><stop stop-color='", frameColor, "'/></linearGradient><linearGradient id='digitColor'><stop stop-color='", digitColor, "'/></linearGradient><linearGradient id='slugColor'><stop stop-color='", slugColor, "'/></linearGradient></defs>"));
        parts[2] = "<mask id='_mask'>";
        
        if (hasCollection)
            parts[3] = "<path id='path-0' d='M 504.28 105.614 C 804.145 105.541 991.639 430.111 841.768 689.836 C 691.898 949.563 317.067 949.655 167.072 690 C 26.805 447.185 181.324 140.169 459.907 108.16 Z' style='fill: none;'/>";
        else
           parts[3] = "";
            
        // don't apply colors on this string, this should be kept white
        parts[4] = string(abi.encodePacked("<circle cx='500' cy='500' r='450' fill='#FFFFFF' stroke='none' /></mask><circle cx='500' cy='500' r='450' fill='url(#backColor)' mask='url(#_mask)' stroke-width='130' stroke='url(#frameColor)' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3' />"));

        string memory digits = _custom[tokenId];
        if (bytes(digits).length == 0)
            digits = Digits.generateDigits(tokenId);

        parts[5] = digits;
          
        if (hasCollection)  
            parts[6] = _supportedSlugs[supportedCollection];
        else
            parts[6] = "";
            
        parts[7] = "</svg>";
        
        return string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7]));
    }
    
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
    
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "OG #', Strings.toString(tokenId), '", "description": "", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(renderSvg(tokenId))), '"}'))));
        return string(abi.encodePacked('data:application/json;base64,', json));
    }
    
    function mint(uint16 tokenId) public {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
        require(!_paused, "Minting is paused");

        _safeMint(_msgSender(), tokenId);
    }   
}