let params = (new URL(document.location)).searchParams;
let msg = document.getElementById("confirmation_msg");

msg.innerHTML = `
    <h1>${params.get("name")}</h1>
    <p>Your Purchase is on the way!</p>
    <p>Please wait 5-12 business days</p>
`;

if (params.has("error")) {
    msg.innerHTML += `
        <p class="text-danger">There was an error and your invoice could not be mailed.</p>
    `
}

msg.innerHTML += `
    <p>You have been logged out for your convience. Please click the button to go back to the Homepage</p>
    <a href="/home"><button class="btn btn-info btn-md">Home</button></a>
`