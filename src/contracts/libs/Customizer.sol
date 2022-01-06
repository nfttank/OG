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

    function getColors(IERC721 callingContract, address ogColorContractAddress, uint256 tokenId) external view returns (string memory back, string memory frame, string memory digit, string memory slug) {

        address ownerOfToken = safeOwnerOf(callingContract, tokenId);
        if (ownerOfToken != address(0)) {
            if (ogColorContractAddress != address(0)) {
                OGColorInterface ogColorContract = OGColorInterface(ogColorContractAddress);
                try ogColorContract.getColors(ownerOfToken, tokenId) returns (string memory extBack, string memory extFrame, string memory extDigit, string memory extSlug) {
                    return (extBack, extFrame, extDigit, extSlug);
                }
                catch { }
            }
        }
        
        return ("<linearGradient id='back'><stop stop-color='#FFFFFF'/></linearGradient>",
                "<linearGradient id='frame'><stop stop-color='#000000'/></linearGradient>",
                "<linearGradient id='digit'><stop stop-color='#000000'/></linearGradient>",
                "<linearGradient id='slug'><stop stop-color='#FFFFFF'/></linearGradient>");
    }
    
    function getOwnedSupportedCollection(IERC721 callingContract, address gotTokenContractAddress, address[] memory supportedCollections, uint256 tokenId) external view returns (address) {
        
        if (gotTokenContractAddress == address(0))
            return address(0);
        
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

    function suggestFreeIds(IERC721 callingContract, uint16 desiredCount, uint256 minValue, uint256 maxValue, uint256 seed) public view returns (uint256[] memory) {
        require(desiredCount > 0 && desiredCount < 11, "Desired count too low or too large");
        require(minValue >= 0, "Min value too low or too large");
        require(maxValue > 0 && maxValue > minValue, "Max value too low or too large");

        uint256[] memory freeIds = new uint256[](desiredCount);
        uint16 approach = 0;
        uint16 count = 0;
        
        // try to find some random free ids
        for (uint16 i = 0; i < desiredCount; i++) {

            uint256 rnd = random(approach++ + seed, maxValue);
            if (rnd >= minValue && safeOwnerOf(callingContract, rnd) == address(0)) {
                freeIds[count++] = rnd;
                if (count >= desiredCount) {
                    return freeIds;
                }
            }

            // if we have a lot of minted tokens, it might get hard to find random numbers, so stop
            if (approach > 100)
                break;
        }

        // we tried so hard and got so far - but we did not find random free ids, so take free ones sequentially
        count = 0;
        // https://ethereum.stackexchange.com/questions/63653/why-i-cannot-loop-through-array-backwards-in-solidity/63654
        for (uint256 id = maxValue; id > minValue; id--) {
            if (safeOwnerOf(callingContract, id) == address(0)) {
                freeIds[count] = id - 1;
                count++;
                if (count >= desiredCount) {
                    break;
                }
            }
        }

        return freeIds;
    }

    /**
    * @dev I am aware that these are only pseudo random numbers and that they can be predicted.
    * However, exploiting this method won't get an attacker much benefit as these random numbers
    * are just used to suggest some free token ids to mint.
    * Anyone can choose his favorite ids while minting.
    */
    function random(uint256 seed, uint256 maxValue) public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, seed))) % maxValue;      
    }
}
