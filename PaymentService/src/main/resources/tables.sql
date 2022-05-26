CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS user_transaction
(
    transaction_id    uuid default gen_random_uuid() PRIMARY KEY,
    amount            float        not null,
    customer_username varchar(255) not null,
    order_id          uuid not null,
    date              timestamp    not null,
    is_confirmed      boolean
);


