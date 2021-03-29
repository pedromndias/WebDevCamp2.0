In this simple app I experiment authentication. There is a register page http://localhost:3000/register where the user can choose a username and password.
Password will be hashed and stored in a database with mongoDB. Then the user can login on http://localhost:3000/login with the credencials and, if correct,
http://localhost:3000/secret will be rendered. The user has then the option to Sign out as well. Express-session package manages the sessions with cookies and 
Bcrypt will manage the hashing in the User's model.
To run this aap we need to run npm init -y in our console, as well as install the following packages: express, ejs, mongoose, bcrypt and express-session.
