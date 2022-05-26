CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS ticket_catalogue
(
    ticket_id SERIAL PRIMARY KEY,
    type      varchar(255) not null,
    price     float        not null,
    max_age   int,
    min_age   int
);

CREATE TABLE IF NOT EXISTS orders
(
    order_id            uuid default gen_random_uuid() PRIMARY KEY,
    status              varchar(255)  NOT NULL,
    ticket_catalogue_id bigint       not null,
    quantity            int          not null,
    customer_username   varchar(255) not null
);
