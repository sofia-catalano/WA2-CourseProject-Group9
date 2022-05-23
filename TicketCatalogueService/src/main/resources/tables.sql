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
    status            varchar(20) NOT NULL CHECK (status IN('PENDING', 'CANCELED', 'ACCEPTED')),
    ticketCatalogueId bigint           not null,
    quantity          int              not null,
    customerUsername  varchar(255)     not null
);


