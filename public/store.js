//Establish parameters from the header, order array, and error value.
let params = (new URL(document.location)).searchParams;
let error;
let order = [];

//Retrieve whether there was an error previously.
error = params.get('error');

//Populate the order array with item amounts from previous attempts.
params.forEach((value,key) => {
    if (key.startsWith('prod')) {
            order.push(parseInt(value));
        }
});


//If an error is submitted, display the error text in the errorDiv.
//Referenced chatgpt for this code. Asked it "How can I conditionally display an error message in the 'errorDiv' element using JavaScript when the error variable is set to 'true'?"
if(error == 'true'){
    
    document.getElementById('errorDiv').innerHTML += `<h2 class="text-danger">Input Error - Please Fix!</h2><br>`;
}

/*
For each product in the array:
    Generate a card with the image positioned at the top.
    Populate the card body with information such as the title from products[i], along with the price, availability, and total sold.

    Generate an input field that validates the quantity as the user inputs, with a placeholder value of 0. 
        The initial value in the box can be filled if there is anything other than 0 or undefined in the order array for that position. Create a section to handle errors and execute the validation to populate errors in case an initial value is passed. 
    
    Asked chatgpt for this code. "How can I dynamically generate HTML elements for each product in my array using JavaScript, including an input field that validates quantity on input and initializes with values from an order array?"
*/
for (let i = 0; i < products.length; i++) {
    document.querySelector('.row').innerHTML += 
        `<div class="col-md-6 product_name mb-4">
        <div class="card">
            <div class="text-center">
                <img src="${products[i].image}" class="card-img-top border-top" alt="Product Image">
            </div>
            <div class="card-body">
                <h5 class="card-title">${products[i].name}</h5>
                <p class="card-text">
                    Price: $${(products[i].price).toFixed(2)}<br>
                    Available: ${products[i].qty_available}<br>
                    Total Sold: ${products[i].total_sold}
                </p>
                
                <input type="text" placeholder="0" name="quantity_textbox" id="${[i]}" class="form-control mb-2" oninput="validateQuantity(this)" value="${order[i] !== 0 && order[i] !== undefined ? order[i] : ''}" onload="validateQuantity(this)">
                <p id="invalidQuantity${[i]}" class="text-danger"></p>
                </div>
            </div>
        </div>`
        validateQuantity(document.getElementById(`${[i]}`));
 ;}

//Executes to produce a validation message.
    function validateQuantity(quantity){
        //Define variables and extract a numeric value from the quantity, assigning it to a variable as a number.
        let valMessage = '';
        let quantityNumber = Number(quantity.value);
        document.getElementById(`invalidQuantity${quantity.id}`).innerHTML = "validationMessage";
        //Retrieves a validation message for cases where the input is not a number, negative, not an integer, or if there are insufficient items in stock.
        //Otherwise, an empty string.
        if(isNaN(quantityNumber)){
            valMessage = "Please Enter a Number";
        }else if (quantityNumber<0 && !Number.isInteger(quantityNumber)){
            valMessage = "Please Enter a Positive Integer";
        }else if (quantityNumber <0){
            valMessage = "Please Enter a Positive Value";
        }else if(!Number.isInteger(quantityNumber)){
            valMessage = "Please Enter an Integer";
        }else if(quantityNumber > products[quantity.id]['qty_available']){
            valMessage = "Not Enough Items in Stock!";
        }
        else{
            valMessage = '';
        }
        //Assign the innerHTML of the section to the valMessage.
        document.getElementById(`invalidQuantity${quantity.id}`).innerHTML = valMessage;
    }