/******************************
* Name: Harrison Nguyen
* Section: WEB322 NDD
* Student ID: 167096239
* Email: hnguyen169@myseneca.ca
* Date Created: September 21, 2024
* Last Modified: November 24, 2024
******************************/

const express = require("express");
const path = require("path");
const contentService = require("./content-service");
const multer = require("multer"); 
const cloudinary = require('cloudinary').v2; 
const streamifier = require('streamifier');

// Initialize express
const app = express();

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Define port
const HTTP_PORT = process.env.PORT || 4545;

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dda1aaraw',
    api_key: '335552288949545',
    api_secret: 'x7XehtaL9fP9ZJKm6ogaJWwUeWk',
    secure: true
});

// Multer for file uploads
const upload = multer(); // No disk storage, files are stored in memory

// Function to process articles
const processArticle = (req, res, imageUrl) => {
    // Attach the image URL to req.body
    req.body.featureImage = imageUrl;

    // Add the article using content-service
    contentService.addArticle(req.body)
        .then(() => res.redirect('/articles'))
        .catch(err => res.status(500).json({ message: "Article creation failed", error: err }));
};

// GET Routes
app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/articles', (req, res) => {
    // Optional filter using query string
    const { category, minDate } = req.query;

    // Promise to get data
    let dataPromise; 

    // If category is provided
    if (category) {
        dataPromise = contentService.getArticlesByCategory(category);            
    }
    // If minDate is provided
    else if (minDate) {
        // Validate minDate before calling getArticlesByMinDate
        const parsedDate = new Date(minDate);
        if (isNaN(parsedDate.getTime())) {
            res.render('articles', { articles: [], error: "Invalid date format. Expected YYYY-MM-DD." });
            return;
        }
        dataPromise = contentService.getArticlesByMinDate(minDate);
    // If no query is provided, get all articles
    } else {
        dataPromise = contentService.getAllArticles();
    }

    dataPromise
        .then(articles => { 
            res.render('articles', { articles, error: articles.length ? null : "No articles found." });
        })
        .catch(err => {
            res.render('articles', { articles: [], error: err.message });
        });
});

// GET route for article by ID
app.get('/article/:id', (req, res) => {
    const { id } = req.params;

    // Search article by provided ID
    contentService.getArticleById(id)
        .then(article => res.json(article))
        .catch(err => res.status(404).json({ message: err }));
});

app.get('/categories', (req, res) => {
    contentService.getCategories()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
        });
});

app.get('/articles/add', (req, res) => {
    contentService.getCategories()
        .then(categories => {
            res.render('addArticle', { categories });
        })
        .catch(err => {
            res.render('addArticle', { categories: [], error: err.message });
        });
});

// POST route to handle adding articles
app.post('/articles/add', upload.single("featureImage"), (req, res) => { 
    // Check if file was uploaded
    if (req.file) { 
        let streamUpload = (req) => { 
            return new Promise((resolve, reject) => { 
                // Upload file to Cloudinary by stream
                let stream = cloudinary.uploader.upload_stream((error, result) => { 
                        if (result) resolve(result); // Upload successful
                        else reject(error); // Upload failed
                    }); 
                streamifier.createReadStream(req.file.buffer).pipe(stream); 
            }); 
        };

        // Asynchronous function for upload
        async function upload(req) { 
            let result = await streamUpload(req); 
            return result; 
        }      

        // Handle file upload
        upload(req).then((uploaded) => { 
            // Process article with image URL
            processArticle(req, res, uploaded.url); 
        }).catch(err => res.status(500).json({ message: "Image upload failed", error: err })); 
        } 
    else { 
        // No file uploaded, process article without image
        processArticle(req, res, ""); 
    }
});

// Initialize content service and start server
contentService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () =>
            console.log("Express http server listening on port: " + HTTP_PORT));
    })
    .catch(err => {
        console.error(err);
});