//set up params from header, order array, and error value
let params = (new URL(document.location)).searchParams;
let error;
let order = [];

//get if there was an error before
error = params.get('error');

//fill order array with item ammounts from previous attempts
params.forEach((value,key) => {
    if (key.startsWith('prod')) {
            order.push(parseInt(value));
        }
});


//if there is an error submitted, then show the error text in errorDiv
if(error == 'true'){
    
    document.getElementById('errorDiv').innerHTML += `<h2 class="text-danger">Input Error - Please Fix!</h2><br>`;
}

/*
For every product in the array:
    Create a card with the image on top
    Fill the card body with the title of the card found in products[i], so with price, aval, and total sold

    Create an input that oninput validates the quantity, a placeholder value of 0 
        The initial value found in the box can be populated if there is anything but 0 or undefined in order array for that position
    Create an area to define errors
    Run the validation to populate errors just incase an initial value is passed
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

//runs to generate a validation message
    function validateQuantity(quantity){
        //set variables, and grab number from the quantity and set it to an number
        let valMessage = '';
        let quantityNumber = Number(quantity.value);
        //console.log(Number.isInteger(quantityNumber));
        document.getElementById(`invalidQuantity${quantity.id}`).innerHTML = "validationMessage";
        //console.log(products[quantity.id]['qty_available']);
        //gets validation message if not a number, negative, not an integer, or if there is not enough items in stock
        //else  empty string 
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
        //set the valMessage to the innerHTML to the section
        document.getElementById(`invalidQuantity${quantity.id}`).innerHTML = valMessage;
        //console.log(products[quantity.id])
    }