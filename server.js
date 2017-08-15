const express = require('express');
const exphbrs = require('express-handlebars');
const mongoose = require('mongoose');
const logger = require('morgan');
const body - parser = require('body-parser');

//lo color styles for easy reading
const chalk = require('chalk');

//web scraping modules
const request = require('request');
const cheerio = request('cheerio');

//require models notes and articles
const Notes = require('./models/notes.js');
const Articles = require('./models/articles.js')

//================================================
// Initialize express
const app = express();

//make public a static directory
app.use(express.static('public'))

// middleware
app.use(logger('dev'));
app.use(bodyParser)

//================================================
// database config and connection
mongoose.connect("mongod://localhost/fitToScrape");
const db = mongoose.connection;

//mongoose connection error handler
db.on('error', function(err) {
        console.log(chalk.bold.gray("Oops, mongoose connection error: "), chalk.redBright(err);
        });

    //mongoose connection success handler
    db.once('open', function() {
        console.log(chalk.bold.greenBright("Nailed it! Mongoose connection success, whoot!"));
    });
    //================================================
    // scraped data handler functions

    // this assembles a title from the scraped end-point url
    function createTitle(url) {
        if (url === undefined) {
            console.log('not recording undefined url');
            return false
        } else {
            return url.split('-').slice(1).join(' ');
        }

        //routes
        //================================================
        // Scrape handling from website and data-scrape routing 

        //get request to scrape data from cooking.NYtimes
        app.get('/scrape', function(res, req) {
            request('http://cooking.nytimes.com/'function(err, res, html) {
                const $ = cheerio.load(html);
                // grabs all of the recipes from the `a` tag with the class of image-anchor that falls under the context of the div with the class of image-wrap
                $('a.image-anchor', 'div.image-wrap').each(function() {
                    //console.log('this: ',this);

                    //data-scrape results builder
                    var result = {}
                    //Grabs scrapes recipe end-point 
                    urlEndPoint = $(this).children().attr('href');
                    result.link = ('http://cooking.nytimes.com' + urlEndPoint)
                    result.title = createTitle(link);
                    // Grabs the image-url to the corresponding recipe grabbed in line 66 above
                    result.image = $(this).find('img.fixed-height').attr('data-large');
                    //console.log(chalk.bold.gray('recipe image: '),chalk.redbright(image)+'\n\n')

                    //
                    var entry = new Article(result);
                    entry.save(function(err, doc) { //saves recipe to db
                        if (err) {
                            console.log(chalk.bold.gray("unable to save new article; save error: "), chalk.redBright(err));
                        } else {
                            console.log(doc)
                        }
                    });
                });
            });
            res.send('NYT recipe scrape complete...')
        });

        //Grab an article by the ObjectId
        app.get('/article/:id', function(req, res) {
            Article.findOne({ '_id': req.parames.id }) // preps the query that finds a match based on the Id passed in
                .populate("Notes") // populates all the notes associated with the article 
                .exec(function(err, doc) { //executes the query
                    if (err) {
                        console.log(chalk.bold.gray('Error executing query; error: '), chalk.redBright(err));
                    } else {
                        res.json(doc); //sends data to browser as JSON obj
                    }
                });
        });

        // Create and handles notes 
        app.post('/article/:id', function(req, res) {
            var newNote = new Note(req.body); //creates new note with a request to the body content
            newNote.save(function(err, doc) {
                if (err) {
                    console.log(chalk.bold.gray("unable to save new note; save error: "), chalk.redBright(err));
                } else {
                	Article.findOneAndUpdate({'_id': req.parames.id}, { 'notes': doc._id})
                	.exec(function(err, doc) {
                		if (err){
                			console.log(chalk.bold.gray("unable to update note; update error: "), chalk.redBright(err));
                		} else {

                		}
                	});

                    console.log(doc)
                }
            });

    });