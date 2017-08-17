# All the News that's Fit to Scrape
a web app that lets users leave comments on the latest news. This uses Mongoose and Cheerio to scrape news from another site.

## Overview

1. Whenever a user visits your site, the app will scrape stories from a predetermined news outlet. The data includes a link to the story and a headline.

2. Cheerio is used to grab the site content and Mongoose to save it to your MongoDB database. 

3. All users can leave comments on the stories collected during the scrape. They should also be allowed to delete whatever comments they want removed. All stored comments should be visible to every user.

## Installation

To install the FriendFinder application locally follow the instructions below:

With the command line:

* 1 `git clone https://github.com/rspica/Fit-to-Scrape.git`
* 2 `cd Fit-to-Scrape`
* 3 `npm install`
* 4 Run the Fit-to-Scrape server via the comand line locally: `node server.js`

The Fit-to-Scrape app will now be running locally, note the command line log `listening on port 3000`

Now access the Fit-to-Scrape app webpages from your browser url: `localhost:PORT`, the default port is set to 3000 specified by the user in the comand line is 3000. The URL would look like this: localhost:3000.

## Heroku

Access Fit-to-scrape via heroku at:


## Technical details

#### This project utilizes the following:
1. Node.js
2. Express
3. HTML
4. CSS
5. JavaScript
6. jQuery

#### dependencies
npm packages:
* body-parser (middleware handler)
* chalk
* cheerio
* express (handles routing and the `server.js` file requires the following npm packages):
* express-handlebars
* mongoose
* morgan
* request


//============================
directory organization for this repository matches the following:

  ```
  Fit-to-Scrape
   |—app
   |  └──data
   |      └──scrape.js
   |—controllers
   |  └──scrape_control.js
   |-public
   |  |──js
   |  |   └──app.js
   |  └──index.html
   |-models
   |  |──articles.js
   |  └──comments.js
   |-view
   |  |──layout
   |  |   └──main.handlebars
   |  └──xxxx
   |
   |-node_modules
   |-package.json
   |-README.md
   |-server.js
   
  ```


