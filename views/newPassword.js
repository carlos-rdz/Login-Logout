function newPassword(user){

    return `
    <h5> Set New Password </h5>
    <form action="/setnewpassword" method="POST">
    <input type="hidden" name="email" value="${user.email}" >
    <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    `;
}

module.exports = newPassword;