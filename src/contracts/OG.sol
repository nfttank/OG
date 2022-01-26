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
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import 'base64-sol/base64.sol';
import './interfaces/GotTokenInterface.sol';
import './interfaces/OGColorInterface.sol';
import './libs/Customizer.sol';
import './libs/Digits.sol';
import './ERC/HumbleERC721Enumerable.sol';

/**
 * @title OG
 * @author nfttank.eth
 */
contract OG is HumbleERC721Enumerable, Ownable {

    mapping(address => string) private _supportedSlugs;
    mapping(string => address) private _trustedContracts;
    address[] private _supportedCollections;
    bool private _paused;
    uint16 private _unlockSupply;

    constructor() ERC721("OG", "OG") Ownable() {
        _trustedContracts["gottoken"] = address(0);
        _trustedContracts["ogcolor"] = address(0);
        _paused = true;
        _unlockSupply = 5000;
    }

    function setPaused(bool paused) external onlyOwner {
        _paused = paused;
    }

    function setUnlockSupply(uint16 unlockSupply) external onlyOwner {
         _unlockSupply = unlockSupply;
    }

    function addSupportedCollection(address contractAddress) external onlyOwner {
         _supportedCollections.push(contractAddress);
    }

    function clearSupportedCollections() external onlyOwner {
         delete _supportedCollections;
         delete _supportedSlugs;
    }
    
    function setSupportedCollectionSlug(address contractAddress, string calldata base64EncodedSvgSlug) external onlyOwner {
        _supportedSlugs[contractAddress] = string(Base64.decode(base64EncodedSvgSlug));
    }

    function setTrustedContractAddresses(address gotTokenAddress, address ogColorAddress) external onlyOwner {
        _trustedContracts["gottoken"] = gotTokenAddress;
        _trustedContracts["ogcolor"] = ogColorAddress;
    }
    
    function renderSvg(uint256 tokenId) public virtual view returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
        
        (string memory back, string memory frame, string memory digit, string memory slug)
            = Customizer.getColors(this, _trustedContracts["ogcolor"], tokenId);
        
        address supportedCollection = Customizer.getOwnedSupportedCollection(this, _trustedContracts["gottoken"], _supportedCollections, tokenId);
        bool hasCollection = supportedCollection != address(0);

        string[8] memory parts;

        parts[0] = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1000' height='1000' viewBox='0 0 1000 1000'>";
        
        // OGColor delivers whole definitions like <linearGradient id='back'><stop stop-color='#FFAAFF'/></linearGradient>
        parts[1] = string(abi.encodePacked("<defs>", back, frame, digit, slug, "</defs>"));
        parts[2] = "<mask id='_mask'>";
        
        if (hasCollection)
            parts[3] = "<path id='path-0' d='M 504.28 105.614 C 804.145 105.541 991.639 430.111 841.768 689.836 C 691.898 949.563 317.067 949.655 167.072 690 C 26.805 447.185 181.324 140.169 459.907 108.16 Z' style='fill: none;'/>";
        else
           parts[3] = "";
            
        // don't apply colors on this string, this should be kept white
        parts[4] = string(abi.encodePacked("<circle cx='500' cy='500' r='450' fill='#FFFFFF' stroke='none' /></mask><circle cx='500' cy='500' r='450' fill='url(#back)' mask='url(#_mask)' stroke-width='130' stroke='url(#frame)' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3' />"));

        parts[5] = Digits.generateDigits(tokenId);
          
        if (hasCollection)  
            parts[6] = _supportedSlugs[supportedCollection];
        else
            parts[6] = "";
            
        parts[7] = "</svg>";
        
        return string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7]));
    }
    
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
    
        string memory attributes = Customizer.getColorAttributes(this, _trustedContracts["ogcolor"], tokenId);
        attributes = bytes(attributes).length > 0 ? string(abi.encodePacked(attributes, ", ")) : "";
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "OG #', Strings.toString(tokenId), '", "description": "" ,', attributes, ' "image": "data:image/svg+xml;base64,', Base64.encode(bytes(renderSvg(tokenId))), '"}'))));
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function mint(uint256[] calldata tokenIds) public {
        require(!_paused, "Minting is paused");

        address sender = _msgSender();
        
        if (sender != owner())
            require(balanceOf(sender) + tokenIds.length <= 10, "Minting is limited to max. 10 per wallet");

        for (uint16 i = 0; i < tokenIds.length; i++) {
            require(tokenIds[i] >= 0 && tokenIds[i] <= 9999, "Token Id invalid");
            require(canMint(tokenIds[i]), "Can't mint token yet");
        }

        for (uint16 i = 0; i < tokenIds.length; i++) {
            _safeMint(sender, tokenIds[i]);
        }
    }

    function canMint(uint256 tokenId) public view returns (bool) {

        if (tokenId > 12) {
            return true;
        }
        else if (tokenId <= 12 && tokenId > 1) {
            return totalSupply() >= _unlockSupply;
        } else if (tokenId == 1) {
            return  _exists(2) &&
                    _exists(3) &&
                    _exists(4) &&
                    _exists(5) &&
                    _exists(6) &&
                    _exists(7) &&
                    _exists(8) &&
                    _exists(9) &&
                    _exists(10) &&
                    _exists(11) &&
                    _exists(12);
        } else {
            return _exists(1);
        }
    }

    function suggestFreeIds(uint16 desiredCount, uint256 seed) public view returns (uint256[] memory) {
        return Customizer.suggestFreeIds(this, desiredCount, 13, 10000, seed);
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }
}