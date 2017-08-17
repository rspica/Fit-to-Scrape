// ****************** Dependencies ******************
//---------------------------------------------------
const express = require('express');

// Adds console.log color styles for easier reading on reporting
const chalk = require('chalk');

//web scraping modules
const request = require('request');
const cheerio = require('cheerio');

//require models notes and articles
const Comments = require('./../models/comments.js');
const Articles = require('./../models/articles.js')

const router = express.Router();


// this assembles a title from the scraped end-point url
function createTitle(url, jpg) {
    if (url === undefined || jpg === undefined) {
        console.log(chalk.bold.gray('unable to convert title, not recording undefined url'));
        return false
    } else {
        return url.split('-').slice(1).join(' ');
    }
}

// Routes
//================================================
// Scrape handling from website and data-scrape routing 

//get request to scrape data from cooking.NYtimes
router.get('/scrape', function(req, res) {
    var search = 'https://cooking.nytimes.com'
    request(search, function(err, resp, html) {
        var $ = cheerio.load(html);

    // grabs all of the recipes from the `a` tag with the class of image-anchor that falls under the context of the div with the class of image-wrap
    $('div.image-wrap').each(function(i, element) {
        // console.log('this: ',this);

        //data-scrape results builder
        var result = {}

        //Grabs scrapes recipe end-point 
        for (var corn in this.parent.attribs) {
            if (corn == "data-url") {
                urlEndPoint = (this.parent.attribs[corn]) //recipe url end-point
            } else if (corn == "data-seo-image-url") {
                var image = (this.parent.attribs[corn]) //img url
            }
        }
               
            result.image = image;
            result.link = (search + urlEndPoint); // concats to a fully funtional url
            result.title = createTitle(urlEndPoint, image);

            // Creates new entry
            var entry = new Articles(result);
            // console.log('Entry: ', entry)
            // console.log("image: ", result.image)
            entry.save(function(err, doc) { //saves recipe to db
                if (err) {
                   console.log(chalk.bold.gray("unable to save new article; save error: "), chalk.redBright(err));
                } else {
                    console.log(doc)
                }
            });
        });
     });
    res.send('NYT recipe scrape complete...') //browser message
});

// Grabs the articles stored in mongoDB that were scraped
router.get('/articles', function (req, res) {
    Articles.find({}, function(err, doc) {
        if (err) {
                console.log(chalk.bold.gray('Error executing article query; error: '), chalk.redBright(err));
            } else {
                console.log(doc);
                res.json(doc); //sends data to browser as JSON obj
            }
    });
});

//Grab an article by the ObjectId
router.get('/article/:id', function(req, res) {
    Articles.findOne({ '_id': req.parames.id }) // preps the query that finds a match based on the ID passed in
        .populate("Comments") // populates all the comments associated with the article's ID
        .exec(function(err, doc) { //executes the query
            if (err) {
                console.log(chalk.bold.gray('Error executing Comment query; error: '), chalk.redBright(err));
            } else {
                res.json(doc); //sends data to browser as JSON obj
            }
        });
});

// Create and handles comments
router.post('/article/:id', function(req, res) {
    var newComment = new Comments(req.body); //creates new comment with a request to the body content
    
    newComment.save(function(err, doc) {
        if (err) {
            console.log(chalk.bold.gray("unable to save new comment; save error: "), chalk.redBright(err));
        } else {
            Articles.findOneAndUpdate({ '_id': req.parames.id }, { 'notes': doc._id })
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







