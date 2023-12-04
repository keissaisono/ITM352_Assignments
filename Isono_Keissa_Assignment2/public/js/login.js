let params = (new URL(document.location)).searchParams;
if (params.has('error')) {
    if (params.get('error') == "email") {
        document.getElementById("email-error").innerHTML = "Email does not exist";
    } else if (params.get('error') == "pass") {
        document.getElementById("pass-error").innerHTML = "Password is not correct";
    }
}