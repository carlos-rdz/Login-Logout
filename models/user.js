const db = require('./db');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

class User {

    constructor(id,email, phash,token, token_expiration, status, timestamp, active) {
        this.id = id,
        this.email = email,
        this.phash = phash
        this.token = token
        this.token_expiration = token_expiration,
        this.status = status,
        this.timestamp = timestamp,
        this.active = active
    }

static createUser(email,password) {

    const salt = bcrypt.genSaltSync(saltRounds)
    const phash = bcrypt.hashSync(password,salt)

    return db.one(`insert into users 
        (email, phash, 
        token, token_expiration, 
        status, timestamp, 
        active) 
            values 
                ($1,$2,$3,$4,$5,$6,$7) returning id` , 
        [email,phash,
        null, null,
        'pending','2001-09-28 01:00',
        true])
        .then(data => {
            return new User (data.id, email, phash, null, null, 'pending','2001-09-28 01:00',true );
    })
    .then(console.log)
}

static checkUser(email) {
    return db.one('select * from users where email=$1',[email])
    .then(result => {console.log('user does not exist'); return false})
    .catch(result => {console.log("user existed"); return true})
}

static retreiveUser(email) {
return db.one('select * from users where email=$1',[email])
.then(data => {
    return new User (data.id, email, data.phash, data.token, data.token_expiration, data.status, data.timestamp, data.active);
})}
// checks password match from bcrypt library
passwordDoesMatch(thePassword) {
    const didMatch = bcrypt.compareSync(thePassword, this.phash);
    return didMatch;
}
}


module.exports = User