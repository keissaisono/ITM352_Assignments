let params = (new URL(document.location)).searchParams;
if (params.has('error')) {
    if (params.get('error') == "exists") {
        document.getElementById("email-error").innerHTML = "This email is already registered";
    } else if (params.get('error') == "email") {
        document.getElementById("email-error").innerHTML = "Please enter a valid email";
    } else if (params.get('error') == "pass") {
        document.getElementById("pass-error").innerHTML = "Passwords must be a Min of 10 characters, Max of 16 characters, and include at least 1 number and 1 Special Character";
    } else if (params.get('error') == "match") {
        document.getElementById("repass-error").innerHTML = "Your passwords do not match";
    } else if (params.get('error') == "name") {
        document.getElementById("name-error").innerHTML = "Please enter your FULL NAME (First Last), Min of 2 characters, Max of 30 character";
    }
}