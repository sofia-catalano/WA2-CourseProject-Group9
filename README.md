# WA2-Course Project-Group09

## Instructions for launching the application
1. Configure the docker container
2. Open Database section on Intellij and create a connection with the postgres container.
3. Right-click on the database and add three new databases (New -> Database -> Ok)
4. Modify the application properties of each module with the options that you have just set
5. Build and run the docker-compose.yml in main folder
6. Build and run all the microservices

## Instructions to use the application
#### Registration of a user
In order to create a user with username 'USER1' execute those commands:
```
curl -X POST -d '{"username":"USER1","email":"user1@user.com","password":"Passw0rd!"}' -v -i 'http://localhost:8100/login/user/register' -H "Content-Type: application/json"
```

In order to activate the user, go in the ACTIVATION table, copy/paste the provisionalId and activationCode in the following command:
```
curl -X POST -d '{"provisionalId":"{provisionalId}","activationCode":"{activationCode}"}' -v -i 'http://localhost:8100/login/user/validate' -H "Content-Type: application/json"
```
In order to create an ADMIN with username 'ADMIN' executes those commands:
```
curl -X POST -d '{"username":"ADMIN","email":"admin@user.com","password":"Passw0rd!"}' -v -i 'http://localhost:8100/login/user/register' -H "Content-Type: application/json"
```

In order to activate the user, go in the ACTIVATION table, copy/paste the provisionalId and activationCode in the following command:
```
curl -X POST -d '{"provisionalId":"{provisionalId}","activationCode":"{activationCode}"}' -v -i 'http://localhost:8100/login/user/validate' -H "Content-Type: application/json"
```
Now set in the DB the Role of this user equal to 1 in order to obtain the ADMIN privilege

In order to log in the user, execute the following command:
```
curl -X POST -d '{"username":"USER1","password":"Passw0rd!"}' -v -i 'http://localhost:8100/login/user/login' -H "Content-Type: application/json"
```

When the login is done, a JWT valid for the next hour is obtained in order to be able to later contact the TravelerService, specifying the JWT as a value of the Authorisation http header, like the following one:
```
BearereyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJVU0VSMSIsImlhdCI6MTY1MTkzNjg2OSwiZXhwIjoxNjUxOTQwNDY5LCJyb2xlIjoiQ1VTVE9NRVIifQ.KTZKau_A0FxDUNxj9Sk9UKtiE6Ir1N8b7t_js3I0GFloVOghVpAx2uUS-bX6-V6u
```

Now use this token to perform actions in 8100 microservice:

- GET "/my/profile":
```
curl --request GET -H "Authorization: {Bearer...}" -v -i  http://localhost:8100/traveler/my/profile
```
- PUT "/my/profile"
```
 curl --request PUT -H "Authorization: {Bearer...}" -H "Accept: application/json" -H "Content-Type:application/json" -d '{"name":"Mario","surname":"Rossi","address":"via dei test Torino","date_of_birth":"01/01/1990","telephone_number":"1231231231"}' -v -i  http://localhost:8100/my/profile
```
- GET "/my/tickets"
```
curl --request GET -H "Authorization: {Bearer...}" -v -i  http://localhost:8100/traveler/my/tickets
```
- POST "/my/tickets"
```
curl --request POST -H "Authorization: {Bearer...}" -H "Accept: application/json" -H "Content-Type:application/json" -d '{"cmd":"buy_tickets","quantity":"3","zones":"ABC","type":"2"}' -v -i  http://localhost:8100/my/tickets
```
- GET "/my/travelcards"
```
curl --request GET -H "Authorization: {Bearer...}" -v -i  http://localhost:8100/traveler/my/travelcards
```
- POST "/my/travelcards"
```
curl --request POST -H "Authorization: {Bearer...}" -H "Accept: application/json" -H "Content-Type:application/json" -d '{"cmd":"buy_travelcard","zones":"ABC","type":"8", "owner":{"fiscal_code":"DFGSGH89T56G2987D","name":"Mario","surname":"Rossi","address":"via dei test Torino","date_of_birth":"01/01/1990","telephone_number":"1231231231"} }' -v -i  http://localhost:8100/traveler/my/travelcards
```
- GET /transactions → get transactions of the current user
```
curl GET -H "Authorization:{Bearer...}" -H "Content-Type: application/json" -v -i http://localhost:8100/payment/transactions
```

---

In order to log in with the admin, execute the following commands:
```
curl -X POST -d '{"username":"ADMIN","password":"Passw0rd!"}' -v -i 'http://localhost:8100/login/user/login' -H "Content-Type: application/json"
```

When the login is done, a JWT valid for the next hour is obtained in order to be able to later contact the TravelerService, specifying the JWT as a value of the Authorisation http header, like the following one:
```
BearereyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJVU0VSMSIsImlhdCI6MTY1MTkzNjg2OSwiZXhwIjoxNjUxOTQwNDY5LCJyb2xlIjoiQ1VTVE9NRVIifQ.KTZKau_A0FxDUNxj9Sk9UKtiE6Ir1N8b7t_js3I0GFloVOghVpAx2uUS-bX6-V6u
```

- POST admin/registerAdmin
```
curl -X POST -d '{"username":"ADMIN2","email":"admin2@user.com","password":"Passw0rd!"}' -v -i 'http://localhost:8100/login/admin/registerAdmin' -H "Content-Type: application/json" -H "Authorization:{Bearer...}"
```
The endpoint create another ADMIN if the current one has enroll capability

- GET admin/enrollAdmin/{admin}
```
curl GET -v -i 'http://localhost:8100/login/admin/enrollAdmin/ADMIN2' -H "Authorization:{Bearer...}"
```
The endpoint give the enroll capability to the {admin}

- GET admin/admins
```
curl -v -i 'http://localhost:8100/login/admin/admins' -H "Authorization:{Bearer...}"
```
The endpoints returns a JSON list of all Admins (except the one who is making the request)

- GET /admin/travelers
```
curl GET -v -i 'http://localhost:8100/traveler/admin/travelers' -H "Authorization:{Bearer...}"
```
The endpoint returns a JSON list of usernames for which there exists any information (either in terms of user profile or issued tickets).

- GET /admin/travelers/tickets/purchased
```
curl GET -v -i 'http://localhost:8100/traveler/admin/travelers/tickets/purchased?start=10/11/2022&end=10/11/2022' -H "Authorization:{Bearer...}"
```
The endpoint returns a JSON list of tickets purchased by any user in the period specified.

- GET /admin/travelers/tickets/purchased
```
curl GET -v -i 'http://localhost:8100/traveler/admin/travelers/tickets/purchased' -H "Authorization:{Bearer...}"
```
The endpoint returns a JSON list of tickets purchased by any user.

- GET /admin/traveler/{userID}/profile
```
curl GET -v -i 'http://localhost:8100/traveler/admin/traveler/USER1/profile' -H "Authorization:{Bearer...}"
```
The endpoint will return the profile corresponding to userID.

- GET /admin/traveler/{userID}/tickets/purchased → returns the tickets purchased by userID.
```
curl GET -v -i 'http://localhost:8100/traveler/admin/traveler/USER1/tickets/purchased' -H "Authorization:{Bearer...}"
```

- GET /admin/traveler/{userID}/tickets/purchased → returns the tickets purchased by userID in the period selected.
```
curl GET -v -i 'http://localhost:8100/traveler/admin/traveler/USER1/tickets/purchased?start=10/08/2022&end=30/08/2022' -H "Authorization:{Bearer...}"
```

- GET /admin/traveler/{userID}/tickets/validated → returns the tickets purchased by userID in the period selected.
```
curl GET -v -i 'http://localhost:8100/traveler/admin/traveler/USER1/tickets/validated?start=10/08/2022&end=30/08/2022' -H "Authorization:{Bearer...}"
```

- POST /admin/tickets → Admin add to catalog new available tickets
```
curl POST -H "Authorization:{Bearer...}" -H "Content-Type: application/json" -H "Accept: application/json" -d '{"type":"60 min","price":"2.30",  "zones":"ABC", "maxAge":"30", "minAge":"18"}' -v -i 'http://localhost:8100/catalogue/admin/tickets' 
```
- GET /admin/orders → returns all the users orders.
```
curl GET -H "Authorization:{Bearer...}" -H "Content-Type: application/json" -v -i http://localhost:8100/catalogue/admin/orders
```
- GET /admin/orders/{userID} → returns all the orders of a user.
```
curl GET -H "Authorization:{Bearer...}" -H "Content-Type: application/json" -v -i http://localhost:8100/catalogue/admin/orders/USER1
```
- GET /admin/transactions → get transactions of all users
```
curl GET -H "Authorization:{Bearer...}" -H "Content-Type: application/json" -v -i http://localhost:8100/payment/admin/transactions
```
Now use the token to perform actions in 8100 microservice (TicketCatalogue):

Please add a new ticket catalogue in the db manually or with admin route.

- GET /tickets → get all tickets available in the catalogue
```
curl GET -v -i 'http://localhost:8100/catalogue/tickets'
```
- POST /shop/ticketId → to buy tickets of a ticket type (this route will return the orderId if the payment has success, BAD REQUEST otherwise)
```
curl --request POST -H "Authorization: {Bearer...}" -H "Content-Type: application/json" -H "Accept: application/json" -d '{"numberOfTickets":"3","ticketId":"6300dd325ef1cf365be57aee", "paymentInfo":{"creditCardNumber":"1234568911111122","expirationDate":"10/22", "cvv":"123","cardHolder":"User" }}' -v -i 'http://localhost:8100/catalogue/shop/{ticketId}'
```
- GET /orders → return a list of all orders made by the customer
```
curl GET -H "Authorization: {Bearer...}" -H "Content-Type: application/json" -v -i http://localhost:8100/catalogue/orders
```
- GET /orders/{ordersId} → return a list of all orders made by the customer
```
curl GET -H "Authorization: {Bearer...}" -H "Content-Type: application/json" -v -i http://localhost:8100/catalogue/orders/{orderId}
```

- GET /admin/travelers/travelcards/purchased
```
curl GET -v -i 'http://localhost:8100/traveler/admin/travelers/travelcards/purchased' -H "Authorization:{Bearer...}"
```
The endpoint returns a JSON list of travelcards purchased by any user.

GET /admin/travelers/travelcards/purchased
```
curl GET -v -i 'http://localhost:8100/traveler/admin/travelers/travelcards/purchased?start=10/06/2022&end=19/08/2022' -H "Authorization:{Bearer...}"
```
The endpoint returns a JSON list of travelcards purchased by any user in the period specified.

- GET /admin/traveler/{userID}/travelcards/purchased → returns the travelcards purchased by userID.
```
curl GET -v -i 'http://localhost:8100/traveler/admin/traveler/USER1/travelcards/purchased' -H "Authorization:{Bearer...}"
```

- GET /admin/traveler/{userID}/travelcards/purchased → returns the travelcards purchased by userID in the period selected.
```
curl GET -v -i 'http://localhost:8100/traveler/admin/traveler/USER1/travelcards/purchased?start=10/06/2022&end=19/08/2022' -H "Authorization:{Bearer...}"
```

- GET /admin/travelers/travelcards/expired
```
curl GET -v -i 'http://localhost:8100/traveler/admin/travelers/travelcards/expired' -H "Authorization:{Bearer...}"
```
The endpoint returns a JSON list of expired travelcards purchased by any user.

- GET /admin/travelers/travelcards/expired
```
curl GET -v -i 'http://localhost:8100/traveler/admin/travelers/travelcards/expired?start=10/06/2022&end=19/08/2022' -H "Authorization:{Bearer...}"
```
The endpoint returns a JSON list of expired travelcards purchased by any user in the period specified.

- GET /admin/traveler/{userID}/travelcards/expired → returns the expired travelcards purchased by userID.
```
curl GET -v -i 'http://localhost:8100/traveler/admin/traveler/USER1/travelcards/expired' -H "Authorization:{Bearer...}"
```

- GET /admin/traveler/{userID}/travelcards/expired → returns the expired travelcards purchased by userID in the period selected.
```
curl GET -v -i 'http://localhost:8100/traveler/admin/traveler/USER1/travelcards/expired?start=10/06/2022&end=19/08/2022' -H "Authorization:{Bearer...}"
```
In order to download a QRCode Ticket 

- GET /QRCode/generateQRCode/{ticketId}
```
curl --remote-name --remote-header-name --write-out "Downloaded %{filename_effective} file" -H "Authorization: Bearer..." --silent http://localhost:8100/QRCode/generateQRCode/{ticketId}
```

In order to validate a ticket

- POST /QRCode/checkTicket

```
curl --request POST -H "Accept: application/json" -H "Content-Type:application/json" -d '{"jwt":"{jwt}","zid":"{A/B/C}"}' -v -i  http://localhost:8100/QRCode/validateQRCode
```




