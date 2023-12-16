// TODO: CLEAN UP INVOICE, CLEAN FILES, CHECK MAIl


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

// Cookies and Session dependancies
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nodemailer = require('nodemailer');

app.use(cookieParser());
app.use(session({
    secret: "thisismysecret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 15 * 60 * 1000, // Set the session timeout to 15 minutes (in milliseconds)
    },
}));

app.use(function(request, response, next) {
    /* Initialize cookeis for drink cart, mug cart, pastry cart, and combined cart */
    if(!request.cookies.cartDrinks) { response.cookie('cartDrinks', JSON.stringify([0, 0, 0, 0, 0, 0])); }
    if(!request.cookies.cartMugs) { response.cookie('cartMugs', JSON.stringify([0, 0, 0, 0 , 0, 0])); }
    if(!request.cookies.cartPastry) { response.cookie('cartPastry', JSON.stringify([0, 0, 0, 0, 0, 0])); }    
    if(!request.cookies.combinedCart) { response.cookie('combinedCart', JSON.stringify([[0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0]])); }

    // Handle timing out user
    if(request.session && request.session.cookie && request.session.cookie.expires< new Date()) {
        request.session.destroy((err => {
            console.log(err);
        }));
        console.log("Session destroyed & User logged out");
    }

    next();
})

// Handles file reading, URL stringifying, SHA256 encryption dependancies
const fs = require('fs');
const crypto = require('crypto');

let loggedIn = [];

// Route all other GET requests to serve static files from the "public" directory
app.all('*', function (request, response, next) {
    next();
});

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

    const cart = request.query.cart;

    if (cart != undefined) { return response.redirect("./home.html?cart=" + cart); }

    response.redirect("./home.html");
});

// drinks (GET) - Handling for drinks
app.get("/drinks", function(request, response) {
    console.log("Navigating to drinks");

    const prod0 = request.query.prod0;
    const prod1 = request.query.prod1;
    const prod2 = request.query.prod2;
    const prod3 = request.query.prod3;
    const prod4 = request.query.prod4;
    const prod5 = request.query.prod5;
    const error = request.query.error;

    let url = `?error=${error}&prod0=${prod0}&prod1=${prod1}&prod2=${prod2}&prod3=${prod3}&prod4=${prod4}&prod5=${prod5}`

    if (request.query.cart != undefined) { return response.redirect(`./drinks.html?cart=${request.query.cart}`); }
    if (request.query.error != undefined) { return response.redirect(`./drinks.html${url}`); }

    response.redirect("./drinks.html");
});

app.get("/mugs", function(request, response) {
    console.log("Navigating to Mugs");

    const prod0 = request.query.prod0;
    const prod1 = request.query.prod1;
    const prod2 = request.query.prod2;
    const prod3 = request.query.prod3;
    const prod4 = request.query.prod4;
    const prod5 = request.query.prod5;
    const error = request.query.error;

    let url = `?error=${error}&prod0=${prod0}&prod1=${prod1}&prod2=${prod2}&prod3=${prod3}&prod4=${prod4}&prod5=${prod5}`

    if (request.query.cart != undefined) { return response.redirect(`./mugs.html?cart=${request.query.cart}`); }
    if (request.query.error != undefined) { return response.redirect(`./mugs.html${url}`); }

    response.redirect("./mugs.html");
})

app.get("/pastry", function(request, response) {
    console.log("Navigating to Pastry");

    const prod0 = request.query.prod0;
    const prod1 = request.query.prod1;
    const prod2 = request.query.prod2;
    const prod3 = request.query.prod3;
    const prod4 = request.query.prod4;
    const prod5 = request.query.prod5;
    const error = request.query.error;

    let url = `?error=${error}&prod0=${prod0}&prod1=${prod1}&prod2=${prod2}&prod3=${prod3}&prod4=${prod4}&prod5=${prod5}`

    if (request.query.cart != undefined) { return response.redirect(`./pastry.html?cart=${request.query.cart}`); }
    if (request.query.error != undefined) { return response.redirect(`./pastry.html${url}`); }

    response.redirect("./pastry.html");
})

// Invoice (GET) - Handling for Invoice Page
app.get("/invoice", function(request, response) {
    console.log("Navigating to Invoice");
    console.log(JSON.parse(request.cookies.combinedCart == [ [ 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0 ] ] ));
    if (JSON.parse(request.cookies.combinedCart) == [[0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0]]) {
        return response.redirect("/home?cart=empty");
    }

    response.redirect("/invoice.html");
});

// Confirmation (GET) - Handling for Confirmation Page
app.get("/confirmation", function(request, response) {
    console.log("Navigating to Confirmation");
    // Carrying over parameters
    let name = request.session.name;
    let user = request.session.user;

    // INSERT MAIL LOGIC HERE
    let invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
    let cart = JSON.parse(request.cookies.combinedCart);

    for (let i = 0; i < cart.length; i++) {
        for (let j = 0; j < cart[i].length; j++) {
            if (cart[i][j] <= 0) { continue; }
            let type;
            switch (i) {
                case 0: type = "drinks"; break;
                case 1: type = "mugs"; break;
                case 2: type = "pastry"; break;
            }
            
            qty = cart[i][j];
            invoice_str += `<tr><td>${qty}</td><td>${products[type][j].name}</td></tr>`;
        }
    }

    invoice_str += '</table>';

    let transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    });

    let user_email = request.session.email;
    let mail_options = {
        from: 'keissastore@mail.com',
        to: user_email,
        subject: "Fake Invoice",
        html: invoice_str
    };

    let url = '';

    transporter.sendMail(mail_options, function(error, info) {
        if (error) { 
            invoice_str += '<br>There was an error and your invoice could not be mailed.</br>'; 

            url = './confirmation.html?user=" + user + "&name=" + name + "&error=true"';
        }
        else { invoice_str += 'Your invoice has been mailed'; }
    });

    request.session.destroy(function(){
        console.log("user logged out.")
    });
    if (url != '') { return response.redirect(url); }
    else { return response.redirect("./confirmation.html?user=" + user + "&name=" + name); }
    
});

// Login (GET) - Handling for Login
app.get("/login", function(request, response) {
    console.log("Navigating to Login");
    // Carrying over parameters
    const error = request.query.error;

    if (error == undefined) { return response.redirect("./login.html"); }
    else { return response.redirect("./login.html?error=" + error); }

});

// Register (GET) - Handling for Register
app.get("/register", function(request, response) {
    console.log("Navigating to Register");
    // Carry over parameters
    const error = request.query.error;

    if (error == undefined) { return response.redirect("./register.html"); }
    else { return response.redirect("./register.html?error=" + error); }
});

app.get("/get_user", function(request, response) {
    if (request.session.user) {
        response.json(request.session.user);
    } else {
        response.json("");
    }
});

app.get("/get_user_count", function(request, response) {
    response.json(loggedIn);
})

app.get("/get_cart", function(request, response) {
    const drink_cart = JSON.parse(request.cookies.cartDrinks);
    const mug_cart = JSON.parse(request.cookies.cartMugs);
    const pastry_cart = JSON.parse(request.cookies.cartPastry);

    const combinedCart = [
        drink_cart,
        mug_cart,
        pastry_cart   
    ];

    response.cookie('combinedCart', JSON.stringify(combinedCart));
    response.json(combinedCart); 
});

app.get("/clear_cart", function(request, response) {
    /* Initialize cookeis for drink cart, mug cart, pastry cart, and combined cart */
    response.cookie('cartDrinks', JSON.stringify([0, 0, 0, 0, 0, 0])); 
    response.cookie('cartMugs', JSON.stringify([0, 0, 0, 0 , 0, 0])); 
    response.cookie('cartPastry', JSON.stringify([0, 0, 0, 0, 0, 0]));
    response.cookie('combinedCart', JSON.stringify([[0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0]]));

    response.redirect("/home?cart=cleared");
});

/* ---- POST Request Logic ---- */

app.post("/add_to_cart", function(request, response) {
    let qtys = request.body['quantity_textbox'];
    let type = request.body['type'];
    let cartKey;
    switch (type) {
        case "drinks":
            cartKey = "cartDrinks";
            break;
        case "mugs":
            cartKey = "cartMugs";
            break;
        case "pastry":
            cartKey = "cartPastry";
            break;
    }

    const currentCart = [];
    let valid = true;
    let url = '';

    console.log(qtys);
    for (let i in qtys) {
        let q = Number(qtys[i]);

        if (validateQuantity(q) === '') {
            if ((products[type][i]["qty_available"] - q) < 0) {
                valid = false;
                url += `&prod${i}=${q}`;
            } else {
                url += `&prod${i}=${q}`;
                currentCart.push(q);
            }
        } else {
            valid = false;
            url += `&prod${i}=${q}`;
        }
    }

    // Check if no products were bought
    if (url.indexOf(`&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`) != -1 ) { valid = false; }

    if (!valid) { return response.redirect(`/${type}?error=true` + url); }
    
    response.cookie(cartKey, JSON.stringify(currentCart));

    const drink_cart = JSON.parse(request.cookies.cartDrinks);
    const mug_cart = JSON.parse(request.cookies.cartMugs);
    const pastry_cart = JSON.parse(request.cookies.cartPastry);

    const combinedCart = [
        drink_cart,
        mug_cart,
        pastry_cart   
    ];

    response.cookie('combinedCart', JSON.stringify(combinedCart));

    if (!request.session.user) { return response.redirect("/login"); }

    if (type == "drinks") { return response.redirect("/drinks?cart=updated"); }
    else if (type == "mugs") { return response.redirect('/mugs?cart=updated'); }
    else if (type == "pastry") { return response.redirect('/pastry?cart=updated'); }
    
})

// Confirm Purchase (POST) - Handles logging user out and routing after confirming their purchase on the invoice
app.post("/confirm_purchase", function (request, response) {
    let drinks = JSON.parse(request.cookies.cartDrinks);
    let mugs = JSON.parse(request.cookies.cartMugs);
    let pastry = JSON.parse(request.cookies.cartPastry);

    for (let i = 0; i < drinks.length; i++) {
        products['drinks'][i]['qty_available'] -= drinks[i];
    }

    for (let i = 0; i < mugs.length; i++) {
        products['mugs'][i]['qty_available'] -= mugs[i];
    }

    for (let i = 0; i < pastry.length; i++) {
        products['pastry'][i]['qty_available'] -= pastry[i];
    }

    let indexToRemove = loggedIn.indexOf(request.session.user);
    loggedIn.splice(indexToRemove, 1);

    response.redirect('/confirmation');
});

// Login (POST) - Handles logging in the user
app.post("/login", function (request, response) {
    let raw_user_data = fs.readFileSync("./user_data.json");
    let user_data = JSON.parse(raw_user_data);

    attempted_user = request.body['email'].toLowerCase();
    attempted_pass = request.body['password'];

    delete request.body;

    if (typeof user_data[attempted_user] != "undefined") {
        if (user_data[attempted_user].password == sha256(attempted_pass)) {
            let split_user = attempted_user.split('@');

            request.session.user = split_user[0];
            request.session.email = attempted_user;
            request.session.name = user_data[attempted_user].name;

            loggedIn.push(attempted_user);
            response.redirect("./drinks.html");
        } else {
            response.redirect("/login?error=pass");
        }
    } else {
        response.redirect("/login?error=email");
    }

});

// Logout (POST) - Handles logging out the user
app.post("/logout", function(request, response) {
    let indexToRemove = loggedIn.indexOf(request.session.user);
    loggedIn.splice(indexToRemove, 1);
    request.session.destroy(function(){
        console.log("user logged out.")
     });
    response.redirect("/login");
});

// Register Redirect (POST) - Handles carrying parameters over from Login when exist
app.post("/register_redirect", function(request, response) {
    response.redirect('./register');
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

    // Regex for Validation from https://regexr.com/
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z])(?=.*\d).{10,16}$/;
    const nonLetterRegex = /[^a-zA-Z]/;
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Validation for inputs and appropriate routing
    if (typeof(user_data[register_email]) != 'undefined') { response.redirect("/register?error=exists"); return; }
    if (!emailRegex.test(register_email)) { response.redirect("/register?error=email"); return; }
    if (!passwordRegex.test(register_pass)) { response.redirect("/register?error=pass"); return; }
    if (register_pass != register_repass) { response.redirect("/register?error=match"); return; }
    if (register_name.length < 2 || register_name.length > 30 || !nonLetterRegex.test(register_name)) { response.redirect("./register.html?error=name"); return; }

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
    request.session.email = register_email;
    request.session.user = user;

    response.redirect("/drinks");
});

/* ---- Express Configuration ---- */

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