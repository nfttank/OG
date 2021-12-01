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

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

library Stringify {

    function that(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

}

/// @title Base64
/// @author Brecht Devos - <brecht@loopring.org>
/// @notice Provides functions for encoding/decoding base64
library Base64 {
    string internal constant TABLE_ENCODE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    bytes  internal constant TABLE_DECODE = hex"0000000000000000000000000000000000000000000000000000000000000000"
                                            hex"00000000000000000000003e0000003f3435363738393a3b3c3d000000000000"
                                            hex"00000102030405060708090a0b0c0d0e0f101112131415161718190000000000"
                                            hex"001a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132330000000000";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return '';

        // load the table into memory
        string memory table = TABLE_ENCODE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
            // set the actual output length
            mstore(result, encodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 3 bytes at a time
            for {} lt(dataPtr, endPtr) {}
            {
                // read 3 bytes
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

                // write 4 characters
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr( 6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(        input,  0x3F))))
                resultPtr := add(resultPtr, 1)
            }

            // padding with '='
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }

        return result;
    }

    function decode(string memory _data) internal pure returns (bytes memory) {
        bytes memory data = bytes(_data);

        if (data.length == 0) return new bytes(0);
        require(data.length % 4 == 0, "invalid base64 decoder input");

        // load the table into memory
        bytes memory table = TABLE_DECODE;

        // every 4 characters represent 3 bytes
        uint256 decodedLen = (data.length / 4) * 3;

        // add some extra buffer at the end required for the writing
        bytes memory result = new bytes(decodedLen + 32);

        assembly {
            // padding with '='
            let lastBytes := mload(add(data, mload(data)))
            if eq(and(lastBytes, 0xFF), 0x3d) {
                decodedLen := sub(decodedLen, 1)
                if eq(and(lastBytes, 0xFFFF), 0x3d3d) {
                    decodedLen := sub(decodedLen, 1)
                }
            }

            // set the actual output length
            mstore(result, decodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 4 characters at a time
            for {} lt(dataPtr, endPtr) {}
            {
               // read 4 characters
               dataPtr := add(dataPtr, 4)
               let input := mload(dataPtr)

               // write 3 bytes
               let output := add(
                   add(
                       shl(18, and(mload(add(tablePtr, and(shr(24, input), 0xFF))), 0xFF)),
                       shl(12, and(mload(add(tablePtr, and(shr(16, input), 0xFF))), 0xFF))),
                   add(
                       shl( 6, and(mload(add(tablePtr, and(shr( 8, input), 0xFF))), 0xFF)),
                               and(mload(add(tablePtr, and(        input , 0xFF))), 0xFF)
                    )
                )
                mstore(resultPtr, shl(232, output))
                resultPtr := add(resultPtr, 3)
            }
        }

        return result;
    }
}

library DigitsPaths {
    
    uint16 constant private smallheight = 2038; // needs div /10

    function generate(uint256 tokenId) public pure returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
        
        if (tokenId <= 9)
            return generateSingleDigit(tokenId);
        else         
            return generateMultiDigits(tokenId);
    }

    function generateSingleDigit(uint256 tokenId) private pure returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9, "Token Id invalid");
        
        if (tokenId == 0)
            return "<path d=' M 498.943 665.697 C 582.899 665.697 637.211 600.707 637.211 499.808 C 637.211 398.633 583.175 333.914 498.943 333.914 C 414.707 333.914 360.675 398.633 360.675 499.808 C 360.675 600.707 414.982 665.697 498.943 665.697 Z  M 498.943 590.443 C 465.665 590.443 447.268 558 447.268 499.808 C 447.268 441.611 465.665 409.169 498.943 409.169 C 531.946 409.169 550.614 441.887 550.614 500.079 C 550.614 558.276 532.222 590.443 498.943 590.443 Z ' fill='url(#digitColor)' />";
    
        if (tokenId == 1)
            return "<path d=' M 423.537 343.5 L 423.537 415.082 L 470.362 415.082 L 470.362 659.375 L 555.459 659.375 L 555.459 343.5 L 423.537 343.5 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 2)
            return "<path d=' M 524.712 587.458 C 592.271 509.202 606.977 478.688 606.977 438.94 C 606.977 379.636 560.712 338.439 493.709 338.439 C 424.549 338.439 382.687 380.657 382.687 444.526 L 382.687 450.368 L 466.187 450.368 L 466.187 444.265 C 466.187 425.25 476.998 413.29 494.73 413.29 C 510.908 413.29 522.194 424.775 522.194 441.904 C 522.194 469.022 504.69 493.247 377.595 643.147 L 377.595 662.375 L 612.53 662.375 L 612.53 587.458 L 524.712 587.458 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 3)
            return "<path d=' M 541.66 455.005 L 605.063 353.511 L 605.063 339 L 388.315 339 L 388.315 411.001 L 494.335 411.001 L 442.898 495.565 L 442.898 513.168 L 493.495 513.168 C 518.076 513.168 533.765 527.489 533.765 550.579 C 533.765 573.664 518.627 589.558 497.034 589.558 C 476.262 589.558 462.416 574.762 461.466 552.494 L 380.388 552.494 C 382.288 617.882 428.952 662.19 496.834 662.19 C 566.141 662.19 615.926 616.186 615.926 551.947 C 615.926 503.027 586.951 466.366 541.665 455.005 L 541.66 455.005 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 4)
            return "<path d=' M 626.556 531.847 L 598.014 531.847 L 598.014 462.278 L 541.099 462.278 L 522.574 531.847 L 472.053 531.847 L 550.29 343.5 L 466.401 343.5 L 365.211 587.175 L 365.211 602.622 L 516.851 602.622 L 516.851 659.375 L 598.019 659.375 L 598.019 602.622 L 626.561 602.622 L 626.556 531.847 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 5)
           return "<path d=' M 497.603 446.539 L 468.21 446.539 L 472.191 410.496 L 594.314 410.496 L 594.314 338.495 L 407.035 338.495 L 389.389 503.163 L 397.45 513.599 L 495.761 513.599 C 518.922 513.599 534.815 529.089 534.815 551.775 C 534.815 573.164 519.672 589.058 498.9 589.058 C 477.654 589.058 462.582 573.715 462.582 552.269 L 381.561 552.269 C 381.561 616.365 430.068 661.69 498.9 661.69 C 567.79 661.69 616.976 615.947 616.976 551.78 C 616.976 489.844 568.341 446.548 497.608 446.548 L 497.603 446.539 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 6)
            return "<path d=' M 520.855 440.333 C 513.701 440.333 506.766 440.827 499.955 441.867 C 520.793 407.04 541.816 372.355 562.612 337.5 L 471.383 337.5 L 413.319 435.378 C 386.862 479.686 377.191 511.739 377.191 544.125 C 377.191 613.057 428.405 660.69 502.952 660.69 C 577.08 660.69 628.162 612.986 628.162 543.721 C 628.162 482.665 584.072 440.333 520.855 440.333 L 520.855 440.333 Z  M 502.676 588.129 C 477.083 588.129 458.544 570.136 458.544 543.721 C 458.544 517.036 477.083 498.843 502.676 498.843 C 528.54 498.843 546.809 517.036 546.809 543.721 C 546.809 570.136 528.54 588.129 502.676 588.129 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 7)
            return "<path d=' M 379.932 342.5 L 379.932 416.515 L 510.272 416.515 L 413.714 658.375 L 502.814 658.375 L 622.514 354.822 L 622.514 342.5 L 379.932 342.5 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 8)
            return "<path d=' M 581.978 491.109 C 604.122 473.524 615.356 451.821 615.356 426.242 C 615.356 371.56 568.82 334.439 499.242 334.439 C 429.659 334.439 382.853 371.836 382.853 426.247 C 382.853 451.536 394.039 473.163 416.093 491.056 C 387.769 509.03 374.175 533.298 374.175 565.042 C 374.175 625.092 424.51 665.68 498.971 665.68 C 573.432 665.68 624.044 624.816 624.044 565.037 C 624.044 533.507 610.221 509.258 581.982 491.104 L 581.978 491.109 Z  M 499.247 397.234 C 520.636 397.234 535.176 410.548 535.176 428.812 C 535.176 447.081 520.636 460.395 499.247 460.395 C 477.858 460.395 463.047 447.081 463.047 428.812 C 463.047 410.548 477.858 397.234 499.247 397.234 Z  M 499.247 599.959 C 473.711 599.959 456.796 584.546 456.796 562.406 C 456.796 540.266 473.711 524.848 499.247 524.848 C 524.783 524.848 541.422 540.266 541.422 562.406 C 541.422 584.546 524.783 599.959 499.247 599.959 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 9)
            return "<path d=' M 495.276 338.939 C 421.148 338.939 370.066 386.643 370.066 455.908 C 370.066 516.964 414.156 559.296 477.373 559.296 C 484.522 559.296 491.457 558.802 498.264 557.762 C 477.392 592.651 456.136 628.105 435.341 662.875 L 526.569 662.875 L 584.909 564.251 C 611.162 519.943 621.037 487.89 621.037 455.504 C 621.037 386.572 569.823 338.939 495.276 338.939 L 495.276 338.939 Z  M 495.552 501.332 C 468.32 501.332 449.23 482.864 449.23 455.908 C 449.23 429.218 468.32 410.954 495.552 410.954 C 522.513 410.954 541.874 429.218 541.874 455.908 C 541.874 482.864 522.513 501.332 495.552 501.332 Z ' fill='url(#digitColor)' />";

        return "";
    }
    
    function generateMultiDigits(uint256 tokenId) private pure returns (string memory) {
        require(tokenId >= 10 && tokenId <= 9999, "Token Id invalid");
        
        bytes memory stringBytes = bytes(Stringify.that(tokenId));
        
        string[] memory parts = new string[](stringBytes.length);
        
        for (uint16 i = 0; i < stringBytes.length; i++)
        {
            uint16 number = uint16(uint8(stringBytes[i])) - 48; // charIndex - 48 is the numeric value

            (uint16 rectX, uint16 rectY, uint16 rectWidth, uint16 rectHeight) = getSmallDigitBounds(stringBytes.length, i);
            
            uint16 offsetX = ((rectX * 10) + (((rectWidth * 10) - getSmallDigitWidth(number) /* is x10 */) / 2)) / 10;
            uint16 offsetY = ((rectY * 10) + (((rectHeight * 10) - smallheight /* is x10 */) / 2)) / 10;

            parts[i] = string(abi.encodePacked("<path transform='translate(", Stringify.that(offsetX), ", ", Stringify.that(offsetY), ")' ", getSmallDigitPath(number)));
        }
        
        if (stringBytes.length == 2) 
            return string(abi.encodePacked(parts[0], parts[1]));
        else if (stringBytes.length == 3)
            return string(abi.encodePacked(parts[0], parts[1], parts[2]));
        else
            return string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3]));
    }


    function getSmallDigitBounds(uint256 numberDigitCount, uint16 currentIndex) private pure returns (uint16 x, uint16 y, uint16 width, uint16 height) {

        uint16 rectX = 0;
        uint16 rectY = 0;
        uint16 rectWidth = 0;
        uint16 rectHeight = 0;
        
        if (numberDigitCount == 2) 
        {
            rectX = currentIndex == 0 ? 210 : 490;
            rectY = 200;
            rectWidth = 300; // don't change the width, lets overlap them to center the paths perfectly
            rectHeight = 600;
        }
        else if (numberDigitCount == 3)            
        {
            rectX = currentIndex == 2 ? 490 : 210;
            rectY = currentIndex == 0 ? 195 : 475; // -15 to the top because with three chars it seems like the text is too far away from the top while mathematically it would be correct 
            rectWidth = currentIndex == 0 ? 580 : 300; // to center, we need to change the width of the upper rect, don't change it of the lower two rects, let's overlap them to center the paths perfectly
            rectHeight = 300;
        }
        else if (numberDigitCount == 4)            
        {
            rectX = (currentIndex == 0 || currentIndex == 2) ? 210 : 490;
            rectY = (currentIndex == 0 || currentIndex == 1) ? 210 : 490;
            rectWidth = 300;
            rectHeight = 300;
        }
        
        return (rectX, rectY, rectWidth, rectHeight);
    }

    // needs to be prefixed to be like: "<path transform='translate(%ox%, %oy%)' ";
    function getSmallDigitPath(uint256 tokenId) private pure returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9, "Token Id invalid");

        if (tokenId == 0)
            return "d=' M 84.945 203.832 C 136.524 203.832 169.891 163.905 169.891 101.917 C 169.891 39.76 136.693 0 84.945 0 C 33.194 0 0 39.76 0 101.917 C 0 163.905 33.364 203.832 84.945 203.832 Z  M 84.945 157.599 C 64.501 157.599 53.198 137.668 53.198 101.917 C 53.198 66.164 64.501 46.233 84.945 46.233 C 105.221 46.233 116.689 66.333 116.689 102.084 C 116.689 137.837 105.39 157.599 84.945 157.599 Z ' fill='url(#digitColor)' />";
    
        if (tokenId == 1)
            return "d=' M 0 0 L 0 46.192 L 30.21 46.192 L 30.21 203.832 L 85.11 203.832 L 85.11 0 L 0 0 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 2)
            return "d=' M 92.554 156.667 C 135.056 107.433 144.308 88.236 144.308 63.229 C 144.308 25.918 115.202 0 73.049 0 C 29.539 0 3.203 26.561 3.203 66.743 L 3.203 70.419 L 55.735 70.419 L 55.735 66.579 C 55.735 54.616 62.536 47.091 73.692 47.091 C 83.87 47.091 90.97 54.317 90.97 65.093 C 90.97 82.154 79.958 97.395 0 191.703 L 0 203.8 L 147.801 203.8 L 147.801 156.667 L 92.554 156.667 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 3)
            return "d=' M 101.712 73.163 L 141.7 9.152 L 141.7 0 L 5 0 L 5 45.41 L 71.865 45.41 L 39.424 98.744 L 39.424 109.846 L 71.335 109.846 C 86.838 109.846 96.733 118.878 96.733 133.44 C 96.733 148 87.186 158.024 73.567 158.024 C 60.467 158.024 51.734 148.692 51.135 134.648 L 0 134.648 C 1.198 175.888 30.629 203.832 73.441 203.832 C 117.152 203.832 148.551 174.818 148.551 134.303 C 148.551 103.45 130.277 80.329 101.715 73.163 L 101.712 73.163 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 4)
            return "d=' M 168.644 121.539 L 150.226 121.539 L 150.226 76.647 L 113.499 76.647 L 101.545 121.539 L 68.944 121.539 L 119.43 0 L 65.297 0 L 0 157.242 L 0 167.21 L 97.852 167.21 L 97.852 203.832 L 150.229 203.832 L 150.229 167.21 L 168.647 167.21 L 168.644 121.539 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 5)
            return "d=' M 73.174 68.13 L 54.639 68.13 L 57.149 45.402 L 134.157 45.402 L 134.157 0 L 16.064 0 L 4.936 103.836 L 10.019 110.417 L 72.012 110.417 C 86.617 110.417 96.639 120.185 96.639 134.49 C 96.639 147.977 87.09 158 73.992 158 C 60.594 158 51.09 148.325 51.09 134.801 L 0 134.801 C 0 175.219 30.588 203.8 73.992 203.8 C 117.432 203.8 148.448 174.956 148.448 134.493 C 148.448 95.438 117.779 68.136 73.177 68.136 L 73.174 68.13 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 6)
            return "d=' M 90.593 64.845 C 86.082 64.845 81.709 65.157 77.413 65.813 C 90.554 43.851 103.811 21.979 116.924 0 L 59.397 0 L 22.782 61.721 C 6.098 89.661 0 109.873 0 130.295 C 0 173.763 32.295 203.8 79.303 203.8 C 126.048 203.8 158.26 173.718 158.26 130.041 C 158.26 91.539 130.457 64.845 90.593 64.845 L 90.593 64.845 Z  M 79.13 158.044 C 62.991 158.044 51.3 146.698 51.3 130.041 C 51.3 113.213 62.991 101.741 79.13 101.741 C 95.439 101.741 106.959 113.213 106.959 130.041 C 106.959 146.698 95.439 158.044 79.13 158.044 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 7)
            return "d=' M 0 0 L 0 47.754 L 84.094 47.754 L 21.796 203.8 L 79.283 203.8 L 156.512 7.95 L 156.512 0 L 0 0 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 8)
            return "d=' M 127.853 96.393 C 141.478 85.573 148.39 72.221 148.39 56.483 C 148.39 22.839 119.758 0 76.949 0 C 34.138 0 5.339 23.009 5.339 56.486 C 5.339 72.045 12.222 85.351 25.791 96.36 C 8.364 107.419 0 122.35 0 141.881 C 0 178.827 30.97 203.8 76.783 203.8 C 122.596 203.8 153.735 178.658 153.735 141.878 C 153.735 122.479 145.23 107.559 127.856 96.39 L 127.853 96.393 Z  M 76.952 38.635 C 90.112 38.635 99.058 46.827 99.058 58.064 C 99.058 69.304 90.112 77.496 76.952 77.496 C 63.792 77.496 54.68 69.304 54.68 58.064 C 54.68 46.827 63.792 38.635 76.952 38.635 Z  M 76.952 163.364 C 61.241 163.364 50.834 153.881 50.834 140.259 C 50.834 126.637 61.241 117.151 76.952 117.151 C 92.663 117.151 102.901 126.637 102.901 140.259 C 102.901 153.881 92.663 163.364 76.952 163.364 Z ' fill='url(#digitColor)' />";
            
        if (tokenId == 9)
            return "d=' M 78.787 0 C 32.142 0 0 30.017 0 73.601 C 0 112.02 27.743 138.657 67.522 138.657 C 72.02 138.657 76.384 138.346 80.667 137.691 C 67.534 159.645 54.158 181.954 41.073 203.832 L 98.477 203.832 L 135.187 141.774 C 151.706 113.894 157.92 93.725 157.92 73.347 C 157.92 29.972 125.694 0 78.787 0 L 78.787 0 Z  M 78.96 102.184 C 61.825 102.184 49.813 90.563 49.813 73.601 C 49.813 56.806 61.825 45.314 78.96 45.314 C 95.925 45.314 108.107 56.806 108.107 73.601 C 108.107 90.563 95.925 102.184 78.96 102.184 Z ' fill='url(#digitColor)' />";
            
        return "";
    }
    
    // needs div /10
    function getSmallDigitWidth(uint256 tokenId) public pure returns (uint16) {
        require(tokenId >= 0 && tokenId <= 9, "Token Id invalid");

        if (tokenId == 0)
            return 1699;
    
        if (tokenId == 1)
            return 851;
            
        if (tokenId == 2)
            return 1478;
            
        if (tokenId == 3)
            return 1486;
            
        if (tokenId == 4)
            return 1686;
            
        if (tokenId == 5)
            return 1484;
            
        if (tokenId == 6)
            return 1583;
            
        if (tokenId == 7)
            return 1565;
            
        if (tokenId == 8)
            return 1537;
            
        if (tokenId == 9)
            return 1579;
            
        return 0;
    }
}

/**
 * @title Owner
 * @dev Set & change owner
 */
contract OG is ERC721Enumerable, ReentrancyGuard, Ownable {

    address[] _supportedCollections;
    mapping(address => string) private _supportedCollectionSlugs;
    mapping(string => address) private _knownContractAddresses;


    constructor() ERC721("OG", "OG") Ownable() {
        
        _knownContractAddresses["gottoken"] = address(0);
        _knownContractAddresses["ogcolor"] = address(0);
    }

    function addSupportedCollection(address contractAddress) public onlyOwner {
         _supportedCollections.push(contractAddress);
    }
    
    function getSupportedCollections() public view returns (address[] memory) {
        return _supportedCollections;
    }

    function clearSupportedCollections() public onlyOwner {
         delete _supportedCollections;
    }
    
    function setSupportedCollectionSlug(address contractAddress, string calldata base64EncodedSvgSlug) public onlyOwner {
        _supportedCollectionSlugs[contractAddress] = string(Base64.decode(base64EncodedSvgSlug));
    }

    function setKnownContractAddresses(address gotTokenAddress, address ogColorAddress) public onlyOwner {
        _knownContractAddresses["gottoken"] = gotTokenAddress;
        _knownContractAddresses["ogcolor"] = ogColorAddress;
    }
    
    function getKnownContractAddress(string calldata name) public view onlyOwner returns (address) {
        return _knownContractAddresses[name];
    }
    
    function safeOwnerOf(uint256 tokenId) public view returns (address) {
        
        address ownerOfToken = address(0);
                
        try this.ownerOf(tokenId) returns (address a) {
            ownerOfToken = a;
        }
        catch { }

        return ownerOfToken;
    }
    
    function getOwnedSupportedCollection(uint256 tokenId) public view returns (address) {
        require(_knownContractAddresses["gottoken"] != address(0), "GotToken contract address not set");
        
        address ownerOfToken = safeOwnerOf(tokenId);
        if (ownerOfToken == address(0))
            return address(0);
    
        bool[] memory ownsTokens;
        
        GotTokenInterface gotTokenContract = GotTokenInterface(_knownContractAddresses["gottoken"]);        
        try gotTokenContract.ownsTokenOfContracts(ownerOfToken, _supportedCollections, tokenId) returns (bool[] memory returnValue) {
            ownsTokens = returnValue;
        }
        catch { return address(0); }

        // find the first contract which is owned
        for (uint256 i = 0; i < ownsTokens.length; i++) {
            if (ownsTokens[i])
                return _supportedCollections[i];
        }

        return address(0);
    }

    function getColors(uint256 tokenId) public view returns (string memory backColor, string memory frameColor, string memory digitColor, string memory slugColor) {

        address ownerOfToken = safeOwnerOf(tokenId);
        if (ownerOfToken != address(0)) {
            if (_knownContractAddresses["ogcolor"] != address(0)) {
                OGColorInterface ogColorContract = OGColorInterface(_knownContractAddresses["ogcolor"]);
                try ogColorContract.getColors(ownerOfToken, tokenId) returns (string memory extBackColor, string memory extFrameColor, string memory extDigitColor, string memory extSlugColor) {
                    return (extBackColor, extFrameColor, extDigitColor, extSlugColor);
                }
                catch { }
            }
        }
        
        return ("#ffffff", "#000000", "#000000", "#ffffff");
    }

    function renderSvg(uint256 tokenId) public virtual view returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
        
        (string memory backColor, string memory frameColor, string memory digitColor, string memory slugColor) = getColors(tokenId);
        
        address supportedCollection = getOwnedSupportedCollection(tokenId);
        bool hasCollection = supportedCollection != address(0);

        string[10] memory parts;

        parts[0] = "<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'>";
        
        parts[1] = string(abi.encodePacked(
            "<defs>"
            "<linearGradient id='backColor'><stop stop-color='", backColor, "'/></linearGradient>", 
            "<linearGradient id='frameColor'><stop stop-color='", frameColor, "'/></linearGradient>",
            "<linearGradient id='digitColor'><stop stop-color='", digitColor, "'/></linearGradient>",
            "<linearGradient id='slugColor'><stop stop-color='", slugColor, "'/></linearGradient>",
            "</defs>"));
        
        parts[2] = "<mask id='_mask'>";
        
        if (hasCollection)
            parts[3] = "<path id='path-0' d='M 504.28 105.614 C 804.145 105.541 991.639 430.111 841.768 689.836 C 691.898 949.563 317.067 949.655 167.072 690 C 26.805 447.185 181.324 140.169 459.907 108.16 Z' style='fill: none;'/>";
        else
            parts[3] = "";
            
        parts[4] = string(abi.encodePacked("<circle cx='500' cy='500' r='450' fill='#ffffff' stroke='none' />")); // don't apply colors here
        parts[5] = "</mask>";
        parts[6] = string(abi.encodePacked("<circle cx='500' cy='500' r='450' fill='url(#backColor)' mask='url(#_mask)' stroke-width='130' stroke='url(#frameColor)' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3' />"));
        parts[7] = DigitsPaths.generate(tokenId);
          
        if (hasCollection)  
            parts[8] = _supportedCollectionSlugs[supportedCollection];
        else
            parts[8] = "";
            
        parts[9] = "</svg>";
        
        return string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9]));
    }
    
    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
    
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "OG #', Stringify.that(tokenId), '", "description": "Crypto Natives.", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(renderSvg(tokenId))), '"}'))));
        return string(abi.encodePacked('data:application/json;base64,', json));
    }
    
    function claim(uint16 tokenId) public nonReentrant {
        require(tokenId >= 0 && tokenId <= 9999, "Token Id invalid");
        _safeMint(_msgSender(), tokenId);
    }
    
}

/**
 * The interface to access the GotToken contract to check of an address owns a given token of a given contract
 */
interface GotTokenInterface {
    function ownsTokenOfContract(address possibleOwner, address contractAddress, uint256 tokenId) external view returns (bool);
    function ownsTokenOfContracts(address possibleOwner, address[] calldata upToTenContractAddresses, uint256 tokenId) external view returns (bool[] memory);
}


/**
 * The interface to access the OGColor contract to get the colors to render the SVG
 */
interface OGColorInterface {
    function getColors(address forAddress, uint256 tokenId) external view returns (string memory backColor, string memory frameColor, string memory digitColor, string memory slugColor);
}