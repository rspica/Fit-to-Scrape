// ****************** Dependencies ******************
//---------------------------------------------------
const express = require('express');

// Adds console.log color styles for easier reading on reporting
const chalk = require('chalk');

//web scraping modules
const request = require('request');
const cheerio = request('cheerio');

//require models notes and articles
const Comments = require('./../models/comments.js');
const Articles = require('./../models/articles.js')

const router = express.Router();


// this assembles a title from the scraped end-point url
function createTitle(url) {
    if (url === undefined) {
        console.log(chalk.bold.gray('not recording undefined url'));
        return false
    } else {
        return url.split('-').slice(1).join(' ');
    };

//routes
//================================================
// Scrape handling from website and data-scrape routing 

get request to scrape data from cooking.NYtimes
router.get('/scrape', function(res, req) {
    var search = 'https://cooking.nytimes.com';
    request(search, function(err, res, html) {
        const $ = cheerio.load(html);

	// grabs all of the recipes from the `a` tag with the class of image-anchor that falls under the context of the div with the class of image-wrap
    $('a.image-anchor', 'div.image-wrap').each(function() {
        //console.log('this: ',this);

        //data-scrape results builder
        var result = {}
                //Grabs scrapes recipe end-point 
            urlEndPoint = $(this).children().attr('href');
            result.link = (search + urlEndPoint)
            result.title = createTitle(link);
            // Grabs the image-url to the corresponding recipe grabbed in line 66 above
       	    result.image = $(this).find('img.fixed-height').attr('data-large');
            //console.log(chalk.bold.gray('recipe image: '),chalk.redbright(image)+'\n\n')

            // Creates new entry
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
router.get('/article/:id', function(req, res) {
    Article.findOne({ '_id': req.parames.id }) // preps the query that finds a match based on the Id passed in
        .populate("Comments") // populates all the comments associated with the article 
        .exec(function(err, doc) { //executes the query
            if (err) {
                console.log(chalk.bold.gray('Error executing query; error: '), chalk.redBright(err));
            } else {
                res.json(doc); //sends data to browser as JSON obj
            }
        });
});

// Create and handles comments 
router.post('/article/:id', function(req, res) {
    var newComment = new Comment(req.body); //creates new comment with a request to the body content
    
    newComment.save(function(err, doc) {
        if (err) {
            console.log(chalk.bold.gray("unable to save new comment; save error: "), chalk.redBright(err));
        } else {
            Article.findOneAndUpdate({ '_id': req.parames.id }, { 'comments': doc._id })
            .exec(function(err, doc) {
                if (err) {
                    console.log(chalk.bold.gray("unable to update comment; update error: "), chalk.redBright(err));
                } else {
                    res.send(doc); //send doc to the browser
                 }
            });
        }
    });
});

// Export routes for server.js to use.
 module.exports = router;
