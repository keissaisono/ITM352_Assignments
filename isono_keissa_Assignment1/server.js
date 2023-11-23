// Import the Express.js framework
const express = require('express');
// Create an instance of the Express application named "app"
// This instance will be used for defining routes and handling requests
const app = express();

// Enable parsing of URL-encoded data in requests
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

// Load product data from the "products.json" file and initialize total_sold property for each product
let products = require(__dirname + '/products.json');
products.forEach((prod, i) => { prod.total_sold = 0; });

// Define a route to handle GET requests for "./products.js". Asked chatgpt to write this code based on this question: "How can I create an Express.js route to serve a JavaScript file containing JSON data from a server?""
app.get("/products.js", function (request, response, next) {
    // Set the response type to JavaScript
    response.type('.js');
    // Convert products array to a JavaScript string and send it as the response
    let products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

// Handle POST requests to "/process_form". Chatgpt wrote this code. "How can I handle form submissions in an Express.js application to validate quantities, update product quantities, and redirect to different pages based on the results?"
app.post("/process_form", function (request, response) {
    // Get textbox inputs as an array
    let qtys = request.body[`quantity_textbox`];
    // Initially set the validity check to true
    let valid = true;
    // Initialize an empty string to hold the URL parameters
    let url = '';
    let soldArray = [];

    // Iterate over each quantity
    for (let i in qtys) {
        // Convert the quantity to a number
        let q = Number(qtys[i]);

        // Check if the quantity is valid
        if (validateQuantity(q) === '') {
            // Check if buying this quantity would result in a negative inventory
            if (products[i]['qty_available'] - q < 0) {
                valid = false;
                url += `&prod${i}=${q}`;
            }
            // If not, update total_sold and subtract from available quantity
            else {
                soldArray[i] = q;
                url += `&prod${i}=${q}`;
            }
        }
        // If the quantity is not valid, set validity to false
        else {
            valid = false;
            url += `&prod${i}=${q}`;
        }
    }

    // Check if no products were bought
    if (url === `&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`) {
        valid = false;
    }

    // If validity is false, redirect to the store with an error parameter
    if (valid === false) {
        response.redirect(`store.html?error=true` + url);
    }
    // Otherwise, redirect to the invoice with the URL parameters attached
    else {
        // Update total_sold and quantity available for each product
        for (let i in qtys) {
            products[i]['total_sold'] += soldArray[i];
            products[i]['qty_available'] -= soldArray[i];
        }
        response.redirect('invoice.html?' + url);
    }
});

// Route all other GET requests to serve static files from the "public" directory
app.all('*', function (request, response, next) {
    next();
});

// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));

// Function to validate the quantity, returns a string if not a number, negative, not an integer, or a combination of both
// If no errors in quantity, returns an empty string
function validateQuantity(quantity) {
    if (isNaN(quantity)) {
        return "Not a Number";
    } else if (quantity < 0 && !Number.isInteger(quantity)) {
        return "Negative Inventory & Not an Integer";
    } else if (quantity < 0) {
        return "Negative Inventory";
    } else if (!Number.isInteger(quantity)) {
        return "Not an Integer";
    } else {
        return "";
    }
}
