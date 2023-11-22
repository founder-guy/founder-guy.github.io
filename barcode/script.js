function validateISBN(isbn) {
    return /^[0-9]{3}-[0-9]-[0-9]{1,5}-[0-9]{1,7}-[0-9]$/g.test(isbn);
}

function validatePrice(price) {
    // This checks if the price is a valid floating point number (optionally with $ or € etc. prefixes)
    return /^[\s\w$€£¥]*\d+(\.\d{1,2})?$/g.test(price);
}

function convertPriceToCode(price, currencyCode) {
    // Remove any currency signs (like $) and convert to a number
    var numericalPrice = parseFloat(price.replace(/[^\d.]/g, ""));
    // Convert to an integer representation (e.g., $5.99 becomes 599)
    var priceCode = Math.round(numericalPrice * 100);
    
    // Ensure it's always 3 digits by padding zeros
    priceCode = priceCode.toString().padStart(3, '0');

    // If price is 9 or less, add an additional zero after the currency code
    if (numericalPrice <= 9) {
        currencyCode += "0";
    }

    // Now prepend the currency code
    return currencyCode + priceCode;
}








function generateBarcode() {
    var canvas = document.getElementById('barcode-canvas');
    var isbnData = document.getElementById('isbn-data').value;
    var priceData = document.getElementById('price-data').value;
    var selectedCurrency = document.getElementById('currency').value;

    if (!validateISBN(isbnData)) {
        alert("Invalid ISBN format. Please ensure the ISBN follows the hyphenated format.");
        return;
    }

    if (priceData && !validatePrice(priceData)) {
        alert("Invalid price format. Please enter the price in the format like 5.99 or $5.99.");
        return;
    }

    // Convert the entered price to the correct price code using the selected currency
    if (priceData) {
        priceData = convertPriceToCode(priceData, selectedCurrency);
    }

    // If price data is available, append it directly to the ISBN with a space in between
    if (priceData) {
        isbnData = isbnData + " " + priceData;
    }


    // Use BWIP-JS to generate barcode
    bwipjs.toCanvas(canvas, {
        bcid: 'isbn',           // 'isbn' for ISBN barcodes
        text: isbnData,        // Text to encode
        scale: 3,              // Scaling factor
        includetext: true,     // Include text below barcode
    });
}

function downloadBarcode(format) {
    var canvas = document.getElementById('barcode-canvas'); // Add this line
    var isbnData = document.getElementById('isbn-data').value;
    var priceData = document.getElementById('price-data').value;
    var selectedCurrency = document.getElementById('currency').value;

    if (!validateISBN(isbnData)) {
        alert("Invalid ISBN format. Please ensure the ISBN follows the hyphenated format.");
        return;
    }

    if (priceData && !validatePrice(priceData)) {
        alert("Invalid price format. Please enter the price in the format like 5.99 or $5.99.");
        return;
    }

    if (priceData) {
        priceData = convertPriceToCode(priceData, selectedCurrency);
    }

    if (priceData) {
        isbnData = isbnData + " " + priceData;
    }

    // Barcode options
    var options = {
        bcid: 'isbn',
        text: isbnData,
        scale: 3,
        includetext: true,
    };

    if (format === 'png') {
        var url = canvas.toDataURL('image/png');
        var a = document.createElement('a');
        a.href = url;
        a.download = 'barcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else if (format === 'svg') {
        let svg = bwipjs.toSVG({
            bcid: 'isbn',
            text: isbnData,
            scale: 3,
            includetext: true,
        });
    
        var blob = new Blob([svg], { type: 'image/svg+xml' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'barcode.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
