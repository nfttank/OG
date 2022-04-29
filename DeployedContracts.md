Network | Contract | Address
-|-|-
Mainnet|OG|0xb9b2580d902811546C5C5A4a26906Af183360b7c
Mainnet|GotToken|0x4a4E0627b0136a5D7aE7f20A25Cb3Fdb2AcdF2E5
Mainnet|OGColor|0x4B90Cc4295632645663DA6c50F38352240771424
Mainnet|OGStats|0x387f0Ade20CBCb5bA84Ac519DAB540A09A3C34f1
Rinkeby|OG|0x2226E55Fc75eF9dbBF936BAEdFf18D7e237AFa7b
Rinkeby|GotToken|0x128F9533FfcC46239f44834C74a20184Db212DaD
Rinkeby|OGColor|0x4a339A1efb366d329B28f00618450d853494103c
Rinkeby|OGStats|0x24fA26b186Eb367503E5fd4Ab8039722a05AFAc5
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