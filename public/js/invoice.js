let cart;
loadJSON('/get_cart', function(response) {
    cart = JSON.parse(response);
});


//Generate rows for each item in the order array.
generateItemRows(cart);


// A function to validate the quantity; it returns a string if the input is not a number, negative, not an integer, or a combination of both. If there are no errors in the quantity, it returns an empty string.
function validateQuantity(quantity){
    if(isNaN(quantity)){
        return "Please Enter a Number";
    }else if (quantity<0 && !Number.isInteger(quantity)){
        return "Please Enter a Positive Integer";
    }else if (quantity <0){
        return "Please Enter a Positive Number";
    }else if(!Number.isInteger(quantity)){
        return "Please Enter an Integer";
    }else{
        return"";
    }

}
//Generate rows for all items that have been purchased.
function generateItemRows(cart){
    //Associates the HTML table with the invoice table.
    let table = document.getElementById("invoiceTable");

    //Check for errors and temporarily set them to "no" if any are found.
    let hasErrors = false; 

    let subtotal = 0;
    let shipping = 0;

    //For each element in the array.
    for(let i = 0; i < cart.length; i++) {
        for (let j = 0; j < cart[i].length; j++) {
            let type;
            switch (i) {
                case 0:
                    type = "drinks"; break;
                case 1:
                    type = "mugs"; break;
                case 2:
                    type = "pastry"; break;
            }

            let row = table.insertRow();
            let item = products[type][j];
            let itemQuantity = cart[i][j];

            if (itemQuantity > 0) {
                let extendedPrice = item.price * itemQuantity;
                subtotal += extendedPrice;
    
                row.insertCell(0).innerHTML = `<img src="${item.image}" class="img-small" name="img">`;
                row.insertCell(1).innerHTML = item.name;
                row.insertCell(2).innerHTML = itemQuantity;
                row.insertCell(3).innerHTML = "$" + item.price.toFixed(2);
                row.insertCell(4).innerHTML = "$" + extendedPrice.toFixed(2);
            }
        }
    }

    //Calculation of the tax amount.
    let tax = (subtotal*0.04712);

    //Determines the shipping price depending on the subtotal.
    if (subtotal <= 50) { shipping = 2; }
    else if(subtotal <=100){ shipping = 5; }
    else { shipping = subtotal * .05; }
    
    //Calculation of the overall price, including tax, subtotal, and shipping.
    let total = tax + subtotal + shipping;
    
    //Insert the footer row values at the bottom of the table. ChatGPT assisted me in achieving this and referencing a previous POKE.
    document.getElementById("subtotal_cell").innerHTML = "$" + subtotal.toFixed(2);
    document.getElementById("tax_cell").innerHTML = "$" + tax.toFixed(2);
    document.getElementById("shipping_cell").innerHTML = "$"+shipping.toFixed(2);
    document.getElementById("total_cell").innerHTML = "$"+total.toFixed(2);
}