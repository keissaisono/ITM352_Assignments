//initialize variables. chatgpt helped me get this fix.
let extendedPrices = [];
let extendedPrice = 0;
let subtotal = 0;
let taxAmount = 0;
let shipping = 0;

/*originally had this to initialize variables, did it wrong. no set values allowed here.
let purchaseData = [
    { productId: 0, quantity: 0 },
    { productId: 1, quantity: 0 },
    { productId: 2, quantity: 0 },
    { productId: 3, quantity: 0 },
    { productId: 4, quantity: 0 },*/


//accesses the URL parameters and generates an array of the values.
let params = (new URL(document.location)).searchParams;
    //initializes empty order array
    let order = [];
    //for each prod, push the value to the array
    params.forEach((value,key) => {
        if (key.startsWith('prod')) {
            order.push(parseInt(value));
            }
});
     
//create rows for all the items in the order array.
generateItemRows();

//tax amount calculation
 let tax = (subtotal*0.0475);

//evaluates the shipping price based on the subtotal.
if(subtotal <= 50)
{
    shipping = 2;
}else if(subtotal <=100)
{
    shipping = 5;
}
else{
    shipping = subtotal*.05;
}

//total price calculation with tax, subtotal, and shipping.
let total = tax+subtotal+shipping;

//insert footer row values into the table at the bottom. chatgpt helped me get this along with reference to previous POKE.
document.getElementById("subtotal_cell").innerHTML = "$" + subtotal.toFixed(2);
document.getElementById("tax_cell").innerHTML = "$" + tax.toFixed(2);
document.getElementById("shipping_cell").innerHTML = "$"+shipping.toFixed(2);
document.getElementById("total_cell").innerHTML = "$"+total.toFixed(2);


//function to validate the quantity, returns a string if not a number, negative, not an integer, or a combination of both
//if no errors in quantity, returns empty string
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
//create rows for all purchased items
function generateItemRows(){

    //assigns the HTML table to the invoice table.
    let table = document.getElementById("invoiceTable");

    //verify if there are errors and temporarily set them to "no."
    let hasErrors = false; 

    //for every element in the array.
    for(let i=0;i<products.length;i++){
        
        //assigns values to item and itemQuantity using data from both the products array and the array retrieved from the URL.
        let item = products[i];
        let itemQuantity = order[i];
        
        //validate the quantity, focusing on identifying whether it's negative to determine whether to display it.
        let validationMessage = validateQuantity(itemQuantity);
        
        
        //for each item in the array, if there's an error, simply disregard this. 
        if(validationMessage !== ""){
            hasErrors = true;
            let row =table.insertRow();
            row.insertCell(0).insertHTML = item.name;
            row.insertCell(1).innerHTML = validationMessage;
        } 
        //if there's no error, generate the row in the invoice and update the extended price and subtotal.
        else if(itemQuantity >0){
            //modify the variables
            extendedPrice = item.price * itemQuantity;
            subtotal += extendedPrice;

            //generate a fresh row and insert the information. Refer to the invoice3 assignment for the previous code.
            let row = table.insertRow();
            row.insertCell(0).innerHTML = `<img src="${item.image}" class="img-small" name = "img">`;
            row.insertCell(1).innerHTML = item.name;
            row.insertCell(2).innerHTML = itemQuantity;
            row.insertCell(3).innerHTML = "$" + item.price.toFixed(2);
            row.insertCell(4).innerHTML = "$"+extendedPrice.toFixed(2);

        }

    }

}