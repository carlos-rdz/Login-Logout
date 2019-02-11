function resetForm(message=""){

    return `
    <h5> Reset Password </h5>
    <form action="/forgotpassword" method="POST">
        <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
    <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <div class="formMessage text-secondary">${message}</div>    
    `;
}

module.exports = resetForm;