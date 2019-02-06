const db = require('./db');
const bcrypt = require('bcryptjs');
const dateTime = require('date-time');

const saltRounds = 10;

class User {
    constructor(id,email, phash,token, token_expiration, status, created, active) {
        this.id = id,
        this.email = email,
        this.phash = phash
        this.token = token
        this.token_expiration = token_expiration,
        this.status = status,
        this.created = created,
        this.active = active
    }

// Creates a user taking email and password as inputs and uses Bcyrpt to hash password
static createUser(email,password) {
    const salt = bcrypt.genSaltSync(saltRounds)
    const phash = bcrypt.hashSync(password,salt)
    return db.one(`insert into users 
        (email, phash, 
        token, token_expiration, 
        status, created, 
        active) 
            values 
                ($1,$2,$3,$4,$5,$6,$7) returning id` , 
        [email,phash,
        null, null,
        'pending',dateTime(),
        false])
        .then(data => {
            return new User (data.id, email, phash, data.token, data.token_expiration, data.created,data.active );
    })
}

// A check to see if the user's email is already registered and in the database
static checkUser(email) {
    return db.one('select * from users where email=$1',[email])
        .then(result => {console.log('user existed'); return true})
        .catch(result => {console.log('user does not exist'); return false})
}

// retrieves a user by email address
static retreiveUser(email) {
    return db.one('select * from users where email=$1',[email])
        .then(data => {
            return new User (data.id, email, data.phash, data.token, data.token_expiration, data.status, data.created, data.active);
            })
            // this is our catch which returns a dummy user if email doesn't exist in db
        .catch(data => {return new User (phash="didntpass")})
    }

// checks password match from bcrypt library
passwordDoesMatch(thePassword) {
    const didMatch = bcrypt.compareSync(thePassword, this.phash);
    return didMatch;
}

// updated the users status from 'pending' to 'verfied' upon email confirmation
// can be used to update to any other status as it is an input
updateUserStatus(status){
    return db.result(`update users set status=$1 where id=$2`, [status, this.id])
        .then(console.log)
}

// method that is called on login to change users 'active' to true
updateUserActive(){
    return db.result(`update users set active=$1 where id=$2`, [true, this.id])
        .then(console.log)
}
// method that is called on logout to change users 'active' to false
updateUserNotActive(){
    return db.result(`update users set active=$1 where id=$2`, [false, this.id])
    .then(console.log)
}

}

module.exports = User