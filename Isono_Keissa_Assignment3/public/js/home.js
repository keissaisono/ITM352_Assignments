let params = (new URL(document.location)).searchParams;

if (params.has("cart")) {
    if (params.get("cart") == "cleared") {
        document.getElementById("textDiv").innerHTML = `<h2 class="text-info">Cart cleared!</h2><br>`;
    } else if (params.get("cart") == "empty") {
        document.getElementById("textDiv").innerHTML = `<h2 class="text-danger">Cart is empty!</h2><br>`;
    }
}