function loginForm(message=""){

    return `
      <h5> Login </h5>
      <form action="/login" method="POST">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
           <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      <a href="/forgotpassword">Forgot Password?</a>
      <div class="formMessage text-secondary">${message}</div>

    <div>
      <form action="/auth/google"> 
        <button type="submit" class="btn btn-light btn-block">
        <img width="20px" alt="" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"/>
        Login with Google
        </button>
      </form>

      <form action="/auth/linkedin"> 
        <button type="submit" class="btn btn-light btn-block">
        <img width="20px" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEUAe7X///8AcbDi6/MAd7N9rM4Ac7G70eStyN/I2ukAebQAdbIAcLDY6fLM4e5QmsXn8ve10+U5j7/0+vx2qc2Cs9Ntq88Af7idw9uly+EgiLxvpMpTnsg4k8JEk8Lq8/i92uqev9qNu9jR4+6uy+CZvNh4sNGvyuCIstJinceTuNUxir3eoYF2AAAEwklEQVR4nO2dbXfiKhRGARk6gjEvjho1tzq215lO////u1FrrTZQOwsP9dxnf+kHk7WyCxxIOICQB7K6mU8FC+ZNnb16iZe/ZaWcTv1k0dBOVeWJYZErm/qpImNVXhwNh4JP8R3RYngwHA64FeAeOxjuDQvBU7BVFMXOMOdYRffofGtYqtTPcUVU2RpWfIuwraeVFBnnImwLMRO1S/0QV8XVouFcSdtY04h56me4MnPBZLANAAAAAAAAAAAAAAAAAID/NVYbpQbKOKZpANboRT3sFVm5rgYM5yCtmc5e86pkb2K4laN1a3lCdm9SP1NU7D7b6IQNp3wAa7N3glKO+Sha974EtyzYZASYdaegHM25hJtpt6CUJZNoY2Y+Q8mjEK0deQ1rFoWon7yCsmARTl3tN5Qs0o/UKmCYc2iIqqu3P/CDQ5eoegHDbxwMzUPAkMWwxvm7QykrDu3Qjf2CI83B0FZ+wxWLHj8UTCccmmFoUFPwKMJAIbKIpFu0pyUyaYVb3KRLMOMQRw+YTYfglJOhMPnyTLDktgDOTU+GNsWCTxt8xYh1tn/bH62aAZcoeopT03zx46nSiqffDq21tcwaIADgK2CUn9Og6gJXns0aW9sGLWdecNsARqh0ivnV9zJ8eqvo/viv7P8+KlrrjHjOJ+P68a795a6crSf5szWp9um4/FubuQtc+eswCGpNmvVDcT5VMCr66/s0+QGRDL/vDbWqHv3zIEU9TZAgENPQmqp7svVI+Uw+4o1pqENzIAdq6o1XIhrqjwpwT1HRNsdohtaEZkBOmJDW1GiGpgz8fMaaUjGW4aC5XFDKMaFiNMOL6+iOhq4txjLMPyVImQURybD+RCvc8UCW5BnL0D+S8bChqqeRDC/rCt8yonrdiGT4F1Bl66QzpJp/TWcoNzQD1ISGGU01TWgo70kKMaUhTaxJaZiRdIkpDeUzRTRNakiS7JHUsKSopkkNSfqLpIaSYliT1vAfgoaY1nBM0BCjGy5Xs/pnPVsVl1w8I2iIcQ2z8Xy7RtM5YwbTzccvjSuC1QAxDZcL8zZ0OJV/9HmqGNyU4fuN0rX+6PPNTdXSzo3SB4/hmwi2W41muOxMhLMffEclyCSPZjjpDvyhLOuW5nYMe74WZUKLcijWrMQyXPv6bh2c0CDo8mMZ+r/ST88zOy/6x3w5w5G/YwuuyiHYYD3WN29/xxZYpNoO227GMLBm+Hw3g0vv+2KGjwHDb4H7CBYExM4Yeo8OGl5/6B03Y+jThkP2hg83U0v/1pDgwJHEhj0YwhCGMIQhDGEIQxjCEIYwhCEMYQhDGMIQhjCEIQxhCEMYwhCGMIQhDGEIQxjCEIYwhCEMYQhDGMIQhjBMYhhYb5Ha0PR7XpaLt8u13Hf/lb1//avs7GLpv69PsEw2tI/w6Xq00D7CoWWENnAfw/37AQAAAAAAAAAAAAAAAAAAAAAAgCPz1A9wZeaiYXz0u9juSiwItq1NiasFwVaLKVGZoNjlPB26kkKWnAvRlK2hzPnGGp3LrWEhuNZTK4qdYfcxDAywg+2hJ1vDjqM0OKDF7lSXnaEscsWtGLXJ92fziJfM1LJSjk9Baqeqw3ku4jX7NqsbLmPUeVMfTzr5D3pkWtnuvn/IAAAAAElFTkSuQmCC"/>
        Login with Linkedin
        </button>
      </form>
    `;
}

module.exports = loginForm;