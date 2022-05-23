CREATE TABLE IF NOT EXISTS ticket_catalogue
(
    ticketId bigint PRIMARY KEY,
    type     varchar(255) not null,
    price    float        not null,
    maxAge   int,
    minAge   int
);

CREATE TABLE IF NOT EXISTS orders
(
    orderId           uuid PRIMARY KEY,
    status            pg_enum(0, 1, 2) not null,
    ticketCatalogueId bigint           not null,
    quantity          int              not null,
    customerUsername  varchar(255)     not null
);


