create table users
(
    id serial primary key,
    email text,
    phash text,
    token text,
    token_expiration timestamp,
    status text,
    timestamp timestamp,
    active boolean

);