# t*Rez

## Deployed Site
hearthealthyspirts.com 

## This app uses
- bootstrap
- MEAN stack
- sendgrid API

## Features
["animation"](readme/animation.png)
This is the sites landing page, and the opening animation. It is skippable with the button in the top right corner, so that it doesn't hinder usability.

["signin"](readme/signin.png)
This is the signin page, it is where admins can sign in and configure the site. In order to get here, one must go to <URL>/sigin .

["accounts"](readme/accounts.png)
This is an overview of all of the different things admins can configure. 

["about_us"](readme/about_us.png)
This is the about us page.

["about_us_backend"](readme/about_us_backend.png)
This is the page where admins can configure their profile, which is then displayed on the site.

["press_releases"](readme/press_releases.png)
This is the display of the press releases.

["back_end_press_releases"](readme/back_end_press_releases.png)
This is the page where admins can edit, or add a press release.

["blog"](readme/blog.png)
This is the blog page, admins can edit the blog page in a way that is similar to how they would edit press releases.

["email"](readme/email.png)
This is how users of the site can reach out to the admins. This is fully functional, and the receipient email is configure with environment variables. 

["faq"](readme/faq.png)
This is the faq page, admins can edit the faq page in a way that is similar to how they would edit press releases.

["modal"](readme/modal.png)
This functionality is for if the users of the site want to request more information, they can, but they have to provide their contact information first. 

["text_fields"](readme/text_fields.png)
Throughout the site many of the heading and paragraphs are configurable, this is an example of the home page configuration. The other pages are similar. 


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


