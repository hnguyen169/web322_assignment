/******************************
* Name: Harrison Nguyen
* Section: WEB322 NDD
* Student ID: 167096239
* Email: hnguyen169@myseneca.ca
* Date Created: September 21, 2024
* Last Modified: October 18, 2024
******************************/

const express = require("express");
const path = require("path");
const contentService = require("./content-service");
const multer = require("multer"); 
const cloudinary = require('cloudinary').v2; 
const streamifier = require('streamifier');

// Initialize express
const app = express();

// Set up middleware
app.use(express.static('public'));

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

// Routes
app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    const htmlPath = path.join(__dirname, '/views/about.html');  
    res.sendFile(htmlPath);
});

app.get('/articles', (req, res) => {
    contentService.getAllArticles()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
        });
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
    res.sendFile(path.join(__dirname, 'views', 'addArticle.html'));
});

// POST route to handle adding articles
app.post('/articles/add', upload.single("featureImage"), (req, res) => { 
    // Check if file was uploaded
    if (req.file) { 
        let streamUpload = (req) => { 
            return new Promise((resolve, reject) => { 
                // Upload file to Cloudinary by stream
                let stream = cloudinary.uploader.upload_stream( 
                    (error, result) => { 
                        if (result) resolve(result); // Upload succesful
                        else reject(error); // Upload failed
                    } 
                ); 
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
            processArticle(uploaded.url); 
        }).catch(err => res.status(500).json({ message: "Image upload failed", error: err })); 
        } 
        else { 
            // No file uploaded, process article without image
            processArticle(""); 
        } 
        
        // Function to process article and save it
        function processArticle(imageUrl) {
            // Attach image URL to article data
            req.body.featureImage = imageUrl;
        
            // Add article to content-service 
            contentService.addArticle((req.body) // Call content service to add article
                .then(() => res.redirect('/articles')) 
                .catch(err => res.status(500).json({ message: "Article creation failed", error: err })));
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