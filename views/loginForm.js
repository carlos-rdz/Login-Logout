function loginForm(message=""){

    return `
    <form action="/login" method="POST">
    <label> Email </label>
        <input type="text" name="email"  >
    <label> Password </label>    
        <input type="password" name="password" >
        <br>
        <input type="submit">
    </form>
    <div>${message}</div>
    <a href="./auth/linkedin">
        <button>Log in with LinkedIn</button>
    </a>
    `;
}

module.exports = loginForm;