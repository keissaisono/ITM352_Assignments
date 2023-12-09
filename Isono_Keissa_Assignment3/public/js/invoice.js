//Initialize variables. chatgpt helped me get this fix.
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


//Retrieves the URL parameters and forms an array containing their values. Asked chatgpt for help. Asked it "How can I extract parameters from the URL using JavaScript and initialize an array with values associated with specific keys?"
let params = (new URL(document.location)).searchParams;
    //Creates an empty array named "order."
    let order = [];
    //For every "prod," add its value to the array.
    params.forEach((value,key) => {
        if (key.startsWith('prod')) {
            order.push(parseInt(value));
            }
});
     
//Generate rows for each item in the order array.
generateItemRows();

//Calculation of the tax amount.
 let tax = (subtotal*0.0475);

//Determines the shipping price depending on the subtotal.
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

//Calculation of the overall price, including tax, subtotal, and shipping.
let total = tax+subtotal+shipping;

//Insert the footer row values at the bottom of the table. ChatGPT assisted me in achieving this and referencing a previous POKE.
document.getElementById("subtotal_cell").innerHTML = "$" + subtotal.toFixed(2);
document.getElementById("tax_cell").innerHTML = "$" + tax.toFixed(2);
document.getElementById("shipping_cell").innerHTML = "$"+shipping.toFixed(2);
document.getElementById("total_cell").innerHTML = "$"+total.toFixed(2);


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
function generateItemRows(){

    //Associates the HTML table with the invoice table.
    let table = document.getElementById("invoiceTable");

    //Check for errors and temporarily set them to "no" if any are found.
    let hasErrors = false; 

    //For each element in the array.
    for(let i=0;i<products.length;i++){
        
        //Sets values for item and itemQuantity by utilizing data from both the products array and the array obtained from the URL.
        let item = products[i];
        let itemQuantity = order[i];
        
        //Validate the quantity, with a focus on identifying negativity to decide whether to display it.
        let validationMessage = validateQuantity(itemQuantity);
        
        
        //For each item in the array, ignore it if there is an error. 
        if(validationMessage !== ""){
            hasErrors = true;
            let row =table.insertRow();
            row.insertCell(0).insertHTML = item.name;
            row.insertCell(1).innerHTML = validationMessage;
        } 
        //If there are no errors, create the row in the invoice, and update the extended price and subtotal.
        else if(itemQuantity >0){
            //Adjust the variables.
            extendedPrice = item.price * itemQuantity;
            subtotal += extendedPrice;

            //Create a new row and insert the information. Consult the invoice3 assignment for the prior code.
            let row = table.insertRow();
            row.insertCell(0).innerHTML = `<img src="${item.image}" class="img-small" name = "img">`;
            row.insertCell(1).innerHTML = item.name;
            row.insertCell(2).innerHTML = itemQuantity;
            row.insertCell(3).innerHTML = "$" + item.price.toFixed(2);
            row.insertCell(4).innerHTML = "$"+extendedPrice.toFixed(2);

        }

    }

}