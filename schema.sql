create table users
(
    id serial primary key,
    email text,
    phash text,
    token text,
    token_expiration timestamp,
    status text,
    created timestamp,
    active boolean

);