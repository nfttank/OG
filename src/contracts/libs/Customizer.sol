// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../interfaces/GotTokenInterface.sol";
import "../interfaces/OGColorInterface.sol";

library Customizer {
    
    function safeOwnerOf(IERC721 callingContract, uint256 tokenId) public view returns (address) {
        
        address ownerOfToken = address(0);
                
        try callingContract.ownerOf(tokenId) returns (address a) {
            ownerOfToken = a;
        }
        catch { }

        return ownerOfToken;
    }

    function getColors(IERC721 callingContract, address ogColorContractAddress, uint256 tokenId) external view returns (string memory backColor, string memory frameColor, string memory digitColor, string memory slugColor) {

        address ownerOfToken = safeOwnerOf(callingContract, tokenId);
        if (ownerOfToken != address(0)) {
            if (ogColorContractAddress != address(0)) {
                OGColorInterface ogColorContract = OGColorInterface(ogColorContractAddress);
                try ogColorContract.getColors(ownerOfToken, tokenId) returns (string memory extBackColor, string memory extFrameColor, string memory extDigitColor, string memory extSlugColor) {
                    return (extBackColor, extFrameColor, extDigitColor, extSlugColor);
                }
                catch { }
            }
        }
        
        return ("#FFFFFF", "#000000", "#000000", "#FFFFFF");
    }
    
    function getOwnedSupportedCollection(IERC721 callingContract, address gotTokenContractAddress, address[] memory supportedCollections, uint256 tokenId) external view returns (address) {
        require(gotTokenContractAddress != address(0), "GotToken contract address not set");
        
        address ownerOfToken = safeOwnerOf(callingContract, tokenId);
        if (ownerOfToken == address(0))
            return address(0);
    
        bool[] memory ownsTokens;
        
        GotTokenInterface gotTokenContract = GotTokenInterface(gotTokenContractAddress);        
        try gotTokenContract.ownsTokenOfContracts(ownerOfToken, supportedCollections, tokenId) returns (bool[] memory returnValue) {
            ownsTokens = returnValue;
        }
        catch { return address(0); }

        // find the first contract which is owned
        for (uint256 i = 0; i < ownsTokens.length; i++) {
            if (ownsTokens[i])
                return supportedCollections[i];
        }

        return address(0);
    }
}
