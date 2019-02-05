
function signupForm(){

    return `
    <div class"container">
    
    <form action="/signup" method="POST">
    
    <div class="row justify-content-start mb-4">
    <label class="col-3"> Email </label>
        <input class="col-3 mr-4" type="text" name="email" required>
    </div>
        <div class="row justify-content-start mb-4">
    <label class="col-3"> Password </label>    
        <input class="col-3 mr-4" type="password" name="password" minlength="12" placeholder="minlength 12" required>
        </div>
    <br>
        <input type="submit">
    
    </form>
    </div>
    `;
}

module.exports = signupForm;