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

// Code from CHATGPT (i know it's VARy bad, but it works)
var fs = require('fs');
var qs = require('querystring');
var crypto = require('crypto');

let loggedIn = [];

// Define a route to handle GET requests for "./products.js". Asked chatgpt to write this code based on this question: "How can I create an Express.js route to serve a JavaScript file containing JSON data from a server?""
app.get("/products.js", function (request, response, next) {
    // Set the response type to JavaScript
    response.type('.js');
    // Convert products array to a JavaScript string and send it as the response
    let products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

/* ---- GET Request Routing ---- */

// / (GET) - Handling for Default Request
app.get("/", function(request, response) {
    response.redirect("/home");
});

// Home (GET) - Handling for Home
app.get("/home", function(request, response) {
    console.log("Navigating to Index");
    const user = request.query.user;
    if (user == undefined) { response.redirect("./home.html?count=" + loggedIn.length); return; }
    response.redirect("./home.html?user=" + user + "&count=" + loggedIn.length);
});

// Store (GET) - Handling for Store
app.get("/store", function(request, response) {
    console.log("Navigating to Store");
    // Carrying over parameters
    const user = request.query.user;
    const prod0 = request.query.prod0;
    const prod1 = request.query.prod1;
    const prod2 = request.query.prod2;
    const prod3 = request.query.prod3;
    const prod4 = request.query.prod4;
    const ready = request.query.ready;
    // Routing for if logged in or not, and if already has items in cart
    if (user == undefined) { response.redirect("./store.html?count=" + loggedIn.length); return; }
    if (user != undefined && ready != undefined && prod0 != undefined) {
        response.redirect("/store.html?user=" + user + "&count=" + loggedIn.length + "&prod0=" + prod0 + "&prod1=" + prod1 + "&prod2=" + prod2 + "&prod3=" + prod3 + "&prod4=" + prod4 + "&ready=" + ready);
    }
    response.redirect("./store.html?user=" + user + "&count=" + loggedIn.length);
});

// Invoice (GET) - Handling for Invoice Page
app.get("/invoice", function(request, response) {
    console.log("Navigating to Invoice");
    // Carrying over parameters
    const user = request.query.user;
    const prod0 = request.query.prod0;
    const prod1 = request.query.prod1;
    const prod2 = request.query.prod2;
    const prod3 = request.query.prod3;
    const prod4 = request.query.prod4;
    response.redirect("/invoice.html?user=" + user + "&count=" + loggedIn.length + "&prod0=" + prod0 + "&prod1=" + prod1 + "&prod2=" + prod2 + "&prod3=" + prod3 + "&prod4=" + prod4);
});

// Confirmation (GET) - Handling for Confirmation Page
app.get("/confirmation", function(request, response) {
    console.log("Navigating to Confirmation");
    // Carrying over parameters
    const user = request.query.user;
    const name = request.query.name;
    response.redirect("./confirmation.html?user=" + user + "&name=" + name + "&count=" + loggedIn.length);
});

// Login (GET) - Handling for Login
app.get("/login", function(request, response) {
    console.log("Navigating to Login");
    // Carrying over parameters
    const prod0 = request.query.prod0;
    const prod1 = request.query.prod1;
    const prod2 = request.query.prod2;
    const prod3 = request.query.prod3;
    const prod4 = request.query.prod4;
    const error = request.query.error;

    // If user already shopped before logging in
    if (prod0 != undefined) {
        if (error == undefined) { response.redirect("/login.html?count=" + loggedIn.length + "&prod0=" + prod0 + "&prod1=" + prod1 + "&prod2=" + prod2 + "&prod3=" + prod3 + "&prod4=" + prod4); return; }
        else { response.redirect("/login.html?count=" + loggedIn.length + "&error=" + error + "&prod0=" + prod0 + "&prod1=" + prod1 + "&prod2=" + prod2 + "&prod3=" + prod3 + "&prod4=" + prod4); return; }
    }

    // If no errors, route to default login page, else, include errors
    if (error == undefined) { response.redirect("/login.html?count=" + loggedIn.length); }
    else { response.redirect("/login.html?count=" + loggedIn.length + "&error=" + error); }
    
});

// Register (GET) - Handling for Register
app.get("/register", function(request, response) {
    console.log("Navigating to Register");
    // Carry over parameters
    const prod0 = request.query.prod0;
    const prod1 = request.query.prod1;
    const prod2 = request.query.prod2;
    const prod3 = request.query.prod3;
    const prod4 = request.query.prod4;
    const error = request.query.error;

    // If user already shopped before logging in
    if (prod0 != undefined) {
        if (error == undefined) { response.redirect("/register.html?count=" + loggedIn.length + "&prod0=" + prod0 + "&prod1=" + prod1 + "&prod2=" + prod2 + "&prod3=" + prod3 + "&prod4=" + prod4); return; }
        else { response.redirect("/register.html?count=" + loggedIn.length + "&error=" + error + "&prod0=" + prod0 + "&prod1=" + prod1 + "&prod2=" + prod2 + "&prod3=" + prod3 + "&prod4=" + prod4); return; }
    }

    // If no errors, route to default register page, else, include errors
    if (error == undefined) { response.redirect("/register.html?count=" + loggedIn.length); }
    else { response.redirect("/register.html?count=" + loggedIn.length + "&error=" + error); }
});

/* ---- POST Request Logic ---- */

// Handle POST requests to "/process_form". Chatgpt wrote this code. "How can I handle form submissions in an Express.js application to validate quantities, update product quantities, and redirect to different pages based on the results?"
app.post("/process_form", function (request, response) {
    // Get textbox inputs as an array
    let qtys = request.body[`quantity_textbox`];
    console.log(qtys);
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

    // Check if user is logged in
    if (request.body.user) {
        url += `&user=${request.body.user}`
    }

    // Check if no products were bought
    if (url.indexOf(`&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0`) != -1 ) {
        valid = false;
    }

    // If validity is false, redirect to the store with an error parameter
    if (valid === false) {
        response.redirect(`/store?error=true` + url);
    }
    else if (!url.includes("user")) {
        response.redirect('/login?' + url);
    }
    // Otherwise, redirect to the invoice with the URL parameters attached
    else {
        // Update total_sold and quantity available for each product
        for (let i in qtys) {
            products[i]['total_sold'] += soldArray[i];
            products[i]['qty_available'] -= soldArray[i];
        }
        response.redirect('/invoice?' + url);
    }
});

// Confirm Purchase (POST) - Handles logging user out and routing after confirming their purchase on the invoice
app.post("/confirm_purchase", function (request, response) {
    // Look for purchaser using username
    let purchaser = request.body.user + "@";
    console.log(purchaser);
    let user = "";
    let name = "";
    for (i = 0; i < loggedIn.length; i++) {
        if (loggedIn[i].indexOf(purchaser) != -1) {
            user = loggedIn[i];
            loggedIn.splice(i, 1);
            break;
        }
    }

    // Access User Data from user_data.json
    let raw_user_data = fs.readFileSync("./user_data.json");
    let user_data = JSON.parse(raw_user_data); 

    name = user_data[user].name;

    // Route to Confirmation
    response.redirect("/confirmation?user=" + request.body.user + "&name=" + name);
});



// Login (POST) - Handles logging in the user
app.post("/login", function (request, response) {
    // Access User Data from user_data.json
    let raw_user_data = fs.readFileSync("./user_data.json");
    let user_data = JSON.parse(raw_user_data);

    // Variables to hold inputted user information
    attempted_user = request.body['email'].toLowerCase();
    attempted_pass = request.body['password'];

    if (typeof user_data[attempted_user] != 'undefined') { // If: Username is present in user_data
        if (user_data[attempted_user].password == sha256(attempted_pass)) { // If: Password matches corresponding Username
            // Get rid of password object (for privacy)
            delete request.body.password; 
            delete request.body.submit;

            // Remove email domain from email to get username
            let split_user = attempted_user.split("@");
            request.body.user = split_user[0];

            // Package data for URL
            let data = request.body;
            stringified = qs.stringify(data);

            // Track logged in users
            loggedIn.push(attempted_user);

            if (Object.keys(data).length != 2) { // If: Purchase information exists
                response.redirect("./store?" + stringified + "&ready=yes"); // Redirect to invoice
            } else { // Else (If only signing in)
                response.redirect("/store?" + stringified); // Redirect to storefront
            }
        } else { // Else (Incorrect Password)
            delete request.body.email
            delete request.body.password;
            delete request.body.submit;
            let data = request.body;
            stringified = qs.stringify(data);

            response.redirect("/login?error=pass&" + stringified);
        }
    }
    delete request.body.email
    delete request.body.password;
    delete request.body.submit;
    let data = request.body;
    stringified = qs.stringify(data);

    response.redirect("/login?error=email&" + stringified); // User doesn't exist
});

// Logout (POST) - Handles logging out the user
app.post("/logout", function(request, response) {
    let indexToRemove = loggedIn.indexOf(request.body.user);
    loggedIn.splice(indexToRemove, 1);
    console.log(loggedIn);
    response.redirect("/login");
});

// Register Redirect (POST) - Handles carrying parameters over from Login when exist
app.post("/register_redirect", function(request, response) {
    let data = request.body;
    stringified = qs.stringify(data);

    response.redirect('./register?' + stringified);
})

// Register (POST) - Handles new user registration
app.post("/register", function(request, response) {
    // Access User Data from user_data.json
    let raw_user_data = fs.readFileSync("./user_data.json");
    let user_data = JSON.parse(raw_user_data);

    // Assign user input to variables
    register_email = request.body['email'];
    register_name = request.body['name']; 
    register_pass = request.body['password'];
    register_repass = request.body['repass'];
    
    // Delete Request Body for Privacy
    delete request.body.email;
    delete request.body.password;
    delete request.body.repass;
    delete request.body.name;
    stringified = qs.stringify(request.body);

    // Regex for Validation from https://regexr.com/
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z])(?=.*\d).{10,16}$/;
    const nonLetterRegex = /[^a-zA-Z]/;
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Validation for inputs and appropriate routing
    if (typeof(user_data[register_email]) != 'undefined') { response.redirect("/register?error=exists&" + stringified); return; }
    if (!emailRegex.test(register_email)) { response.redirect("/register?error=email&" + stringified); return; }
    if (!passwordRegex.test(register_pass)) { response.redirect("/register?error=pass&" + stringified); return; }
    if (register_pass != register_repass) { response.redirect("/register?error=match&" + stringified); return; }
    if (register_name.length < 2 || register_name.length > 30 || !nonLetterRegex.test(register_name)) { response.redirect("./register.html?error=name&" + stringified); return; }

    // Write new account into user_data.json
    user_data[register_email] = {};
    user_data[register_email].name = register_name;
    user_data[register_email].password = sha256(register_pass);
    fs.writeFileSync("./user_data.json", JSON.stringify(user_data));

    // Get username from email
    let user_arr = register_email.split("@");
    let user = user_arr[0];

    // Track logged in users
    loggedIn.push(register_email);

    if (Object.keys(request.body).length != 0) {
        response.redirect("/store?" + stringified + "&user=" + user + "&ready=yes");
    } else {
        response.redirect("/store?" + stringified + "&user=" + user);
    }
});

/* ---- Express Configuration ---- */

// Route all other GET requests to serve static files from the "public" directory
app.all('*', function (request, response, next) {
    next();
});

// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));

/* ---- Functions ---- */

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

// Password Encryption using Crypto (SHA256)
function sha256(inputPass) {
    const hash = crypto.createHash('sha256');
    hash.update(inputPass);
    return hash.digest('hex');
}