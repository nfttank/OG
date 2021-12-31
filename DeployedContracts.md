Network | Contract | Address | Address with Truffle migration
-|-|-
Rinkeby|OG|0xeA1ead1c8dE4B356D701DFeB84120C56ACD61B4B|0x39B18B45a8Ae6E2DefD4Ea56E9a1DB1aBcF99273
Rinkeby|GotToken|0x9697eD135b7D80fe979b9aEe799fFe3fa37d1B0d|0x6CbD2d4Ea0b1b794d3a6bc690323d14f18C7a473
Rinkeby|OGColor|0xb1f3378283bb509852D97E5296fa2F0d4D5faD07|0x1d29206eE3eE91A53B93A7D7050D7A5A606f0824
Rinkeby|FakePunks|0xCDF22Cb426aDF76f7048F87e7C8137313D6A8D33|
Rinkeby|FakeApes|0x215970025ef9a213737050E83bB6B235f3B5b8Ae|
Rinkeby|FakeCats|0xe4d3620312c8F81D5aFa248946a5D802bC50189D|

```
contract FakePunks {
    
    mapping (uint => address) public punkIndexToAddress;
    
     constructor() {
         punkIndexToAddress[0] = 0x772B92a6AbE5129F8Ef91D164Cc757dd9BbD0BC7;
         punkIndexToAddress[1] = 0xaA040e38eA003F9894D1cF6E4cED729536a4a1A9;
         punkIndexToAddress[2] = 0x9EcDdA62fC32b37ED6f8337f8C217223786B2e13;
         punkIndexToAddress[3] = 0x1b33EBa79c4DD7243E5a3456fc497b930Db054b2;
         punkIndexToAddress[4] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
     }
}


contract FakeApes is ERC721 {
    
    mapping (uint => address) public _overriddenOwners;

    constructor() ERC721("OG", "OG") {
         _overriddenOwners[0] = 0xaA040e38eA003F9894D1cF6E4cED729536a4a1A9;
         _overriddenOwners[1] = 0x772B92a6AbE5129F8Ef91D164Cc757dd9BbD0BC7;
         _overriddenOwners[2] = 0x1b33EBa79c4DD7243E5a3456fc497b930Db054b2;
         _overriddenOwners[3] = 0x9EcDdA62fC32b37ED6f8337f8C217223786B2e13;
         _overriddenOwners[4] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4; 
         _overriddenOwners[5] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
         _overriddenOwners[6] = 0xaA040e38eA003F9894D1cF6E4cED729536a4a1A9;
    }
    
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _overriddenOwners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
}

contract FakeCats is ERC721 {
    
    mapping (uint => address) public _overriddenOwners;

    constructor() ERC721("OG", "OG") {
        _overriddenOwners[0] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
        _overriddenOwners[1] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
        _overriddenOwners[2] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
        _overriddenOwners[3] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
        _overriddenOwners[4] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
        _overriddenOwners[5] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
        _overriddenOwners[6] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
        _overriddenOwners[7] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
        _overriddenOwners[8] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
        _overriddenOwners[9] = 0x5250eeBa8E1A5284D9c9F331C4Bb50Eb2AE6efe4;
    }
    
    
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _overriddenOwners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
}
```