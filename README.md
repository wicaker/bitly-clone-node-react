# BackEnd 

Before run this program :
...............
> npm install
...............

Add your mongodb account in ` config/keys.js `

`
module.exports = {
  mongoURI : 'your mongodb code',
  secretOrKey : 'your secret'
};

`


api end point :

>> users endpoint for authentication (register/ login) 

`http://localhost:5000/api/users/register` method POST

`http://localhost:5000/api/users/login` method POST



>> shorters endpoint for url shorten

` http://localhost:5000/api/shorters ` method POST or GET

` http://localhost:5000/api/shorters/delete/:id ` method DELETE

` http://localhost:5000//:code ` method GET 


>> secure authentication using ` jwt `

### Thank You
