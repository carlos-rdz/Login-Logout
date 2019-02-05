function loginForm(){

    return `
    <form action="/login" method="POST">
    <label> Email </label>
        <input type="text" name="email"  >
    <label> Password </label>    
        <input type="password" name="password" >
        <br>
        <input type="submit">
    </form>
    `;
}

module.exports = loginForm;