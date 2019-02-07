
function signupForm(message=""){

    return `
    <div class"container">
    
    <form action="/signup" method="POST">
    
    <div class="row justify-content-start mb-4">
    <label class="col-3"> Email </label>
        <input class="col-3 mr-4" type="text" name="email" required>
    </div>
        <div class="row justify-content-start mb-4">
    <label class="col-3"> Password </label>    
        <input class="col-3 mr-4" type="password" name="password"  placeholder="Min Length 8" required>
        </div>
    <br>
        <input type="submit">
    
    </form>
    <div>${message}</div>
    <a href="./auth/linkedin">
        <button>Sign in with LinkedIn</button>
    </a>
    </div>
    `;
}

module.exports = signupForm;