# t*Rez

## Starting the server in development
`npm start`

## Seeding the server 
```
$ npm install -g gulp
$ gulp seed
```

Seeding will provide some example blog posts, FAQ, and press releases for you to build off of. It will also create an admin user which you can use to login to the admin panel.

## Admin Access
The url `http://localhost:8080/authentication/signin` will take you to the signin page. Likewise, `http://localhost:8080/admin/users` will take you to the admin panel if you are already logged in. From here you can manage most aspects of the website content as well as user management and password management. 


Photo upload: https://stackoverflow.com/questions/28029413/adding-a-picture-to-the-mean-js-sample-with-angular-file-upload
