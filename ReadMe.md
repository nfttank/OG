# Rules

* OG #1-12 can only be minted by the punk holders within the [12 topsales](https://www.larvalabs.com/cryptopunks/topsales): The "OG dozen".
* (OG #1-12 are minted black and will unravel after the first sale)
* #0 can be minted for free by anyone after OG #1-12 are minted.
* The collection name will appear if the wallet contains a matching NFT with the given id
* Colors can be customized by owning an ogcolor NFT.

TODO
* Whitelisting of the OG dozen
* Color replacement (background, circle, slug, numbers) --> OK


# Checks
* ONLYOWNER = CONTRACT OWNER OR ITEM OWNER?
* limit onlyOwner methods like addSupportedCollection(), setSupportedCollectionSlug(), setTrustedContractAddresses(), & getTrustedContractAddress().
* set setTrustedContractAddresses() with the correct contract addresses for the corresponding net (Mainnet, etc.)

# Add or update supported collections
* add **new** collections with addSupportedCollection() if required
* set a SVG element with setSupportedCollectionSlug() if required

# Workflows
* Convert slugs to paths with InkScape.
* remove unnecessary path variables like aria-label, style. Keep transform and add fill="rgb(255,255,255)"
* convert the path <g> ... to </g> to base64
* update or add the slug on the contract with setSupportedCollectionSlug()

# External Contracts

address constant CryptoPunksContractMainnet = 0x3C6D0C0d7c818474A93a8A271e0BBdb2e52E71d8;
address constant BoredApesContractMainnet = 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D; 
address constant CoolCatsContractMainnet = 0x1A92f7381B9F03921564a437210bB9396471050C; 
address constant CrypToadzContractMainnet = 0x1CB1A5e65610AEFF2551A50f76a87a7d3fB649C6;
address constant MetaHeroCoreContractMainnet = 0xFb10b1717C92e9cc2d634080c3c337808408D9E1;
address constant MetaHeroGenerativeContractMainnet = 0x6dc6001535e15b9def7b0f6A20a2111dFA9454E2;
address constant NounsContractMainnet = 0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03;

Whitelist: Top 100 All Time Collections on OpenSea 08.11.2021


CryptoPunks 0-9999 #638596
https://opensea.io/assets/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/0
Bored Apes 0-9999 #EF972C
https://opensea.io/assets/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/0
Cool Cats 0-9932 #A0D7F5
https://opensea.io/assets/0x1a92f7381b9f03921564a437210bb9396471050c/0
Cryptoadz 1-6969 #657F1F
https://opensea.io/assets/0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6/1
MetaHero Universe: Identities 1-36 #E35050
https://opensea.io/assets/0xfb10b1717c92e9cc2d634080c3c337808408d9e1/1
Pudgy Penguins 0-8887
https://opensea.io/assets/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/0
Creature World 0-9999
https://opensea.io/assets/0xc92ceddfb8dd984a89fb494c376f9a48b999aafc/0
World of Women 0-9999
https://opensea.io/assets/0xe785e82358879f061bc3dcac6f0444462d4b5330/0
Lazy Lions 0-9999 (placeholders > 9999)
https://opensea.io/assets/0x8943c7bac1914c9a7aba750bf2b6b09fd21037e0/0
SupDucks 0-10000
https://opensea.io/assets/0x3fe1a4c1481c8351e91b64d5c398b159de07cbc5/0
Doodles 0-9999
https://opensea.io/assets/0x8a90cab2b38dba80c64b7734e58ee1db38b8992e/0
Robotos Official 0-9998
https://opensea.io/assets/0x099689220846644f87d1137665cded7bf3422747/0
Winter Bears 0-9999
https://opensea.io/assets/0xc8bcbe0e8ae36d8f9238cd320ef6de88784b1734/0
DeadFellaz 1-10000
https://opensea.io/assets/0x2acab3dea77832c09420663b0e1cb386031ba17b/1
Wicked Ape Bone Club 1-10000
https://opensea.io/assets/0xbe6e3669464e7db1e1528212f0bff5039461cb82/0
Metasaurs by Dr. DMT 1-9999
https://opensea.io/assets/0xf7143ba42d40eaeb49b88dac0067e54af042e963/1
MetaHero Universe: Generative Identities 1-5779
https://opensea.io/assets/0x6dc6001535e15b9def7b0f6a20a2111dfa9454e2/1
Peaceful Groupies 1-10000
https://opensea.io/assets/0x4f89cd0cae1e54d98db6a80150a824a533502eea/1
Gutter Cat Gang 1-3000
https://opensea.io/assets/0xedb61f74b0d09b2558f1eeb79b247c1f363ae452/1
0N1 Force 1-7777
https://opensea.io/assets/0x3bf2922f4520a8ba0c2efc3d2a1539678dad5e9d/1
Punks Comic 1-1000
https://opensea.io/assets/0x5ab21ec0bfa0b29545230395e3adaca7d552c948/1

Ape Gang uses long Ids like 4981676894159712808201908443964193325271219637660871887967797657650558140417

*/

# Deployment
- Install Node
- Install yarn `npm install --global yarn`
- **Only once** Install gh-pages `yarn add gh-pages`
- **Only once** add homepage to package.json
```
{
  "name": ...,
  "version": ...,
  "homepage": "https://nfttank.github.io/OG/",
  "dependencies": ...
```
- **Only once** add scripts predeploy and deploy to package.json
```
  "scripts": {
    "start": ...,
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
```
- Run deployment with `npm run deploy`
- GitHub Pages have to point to the branch `gh-pages` (updated and pushed by this deployment)
