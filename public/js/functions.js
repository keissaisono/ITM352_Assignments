function loadJSON(service, callback) {   
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', service, false);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 let count = 0;
 loadJSON('get_user_count', function(response) {
     count = JSON.parse(response).length;
 })

 console.log(count);

function navbar(user_data) {
    document.getElementById("nav").innerHTML = `
        <h1 class="h2">The Second Best Coffee Shop</h1>
        <p class="lead">Because, can it be the second best? Who's to say?</p>
        <div class="mt-4">
            <a href="/" class="btn btn-outline-primary btn-lg">Home</a>
            <a href="/drinks" class="btn btn-outline-primary btn-lg">Drinks</a>
            <a href="/mugs" class="btn btn-outline-primary btn-lg">Mugs</a>
            <a href="/pastry" class="btn btn-outline-primary btn-lg">Pastry</a>
        </div>
    `;

    if (user_data != "") {
        document.getElementById("nav").innerHTML += `
            <div class="row justify-content-center">
                <div class="mt-4 col-xs-6">
                    <button class="btn btn-outline-primary btn-lg dropdown-toggle" type="button" id="profileButton" data-toggle="dropdown" aria-expanded="false">
                        ${user_data}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="profileButton">
                        <form action='/logout' method='post'>
                            <button class="dropdown-item" href="#">Log Out</button>
                        </form>
                    </div>
                </div>
                <div class="mt-4 col-xs-6">
                    <button class="btn btn-outline-primary btn-lg dropdown-toggle" type="button" id="cartButton" data-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-cart2"></i>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="cartButton">
                        <a class="dropdown-item" href="/invoice">Cart</a>
                        <a class="dropdown-item" href="/clear_cart">Clear Cart</a>
                    </div>
                </div>
            </div>
            <div class="row text-center justify-content-center">
                <p class="text-info">Current Users: ${count}</p>
            </div>
        `
    } else {
        document.getElementById("nav").innerHTML += `
            <div class="mt-4">
                <button class="btn btn-outline-primary btn-lg dropdown-toggle" type="button" id="profileButton" data-toggle="dropdown" aria-expanded="false">
                    Login
                </button>
                <div class="dropdown-menu" aria-labelledby="profileButton">
                    <a class="dropdown-item" href="/login">Login</a>
                    <a class="dropdown-item" href="/register">Register</a>
                </div>
                <a href="/login"><button class="btn btn-outline-primary btn-lg" type="button" id="cartButton"  aria-expanded="false">
                    <i class="bi bi-cart2"></i>
                </button></a>
                <p class="text-info">Current Users: ${count}</p>
                
            </div>
        `
    }
}