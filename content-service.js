/******************************
* Name: Harrison Nguyen
* Section: WEB322 NDD
* Student ID: 167096239
* Email: hnguyen169@myseneca.ca
* Date Created: October 1, 2024
* Last Modified: October 14, 2024
******************************/

const fs = require('fs').promises;
const path = require('path');

let articles = [];
let categories = [];

// Initialize data
function initialize() {
    return new Promise((res, rej) => {
        const articlesPath = path.join(__dirname, '/data/articles.json');
        const categoriesPath = path.join(__dirname, '/data/categories.json');

        fs.readFile(articlesPath, 'utf8')
            .then(data => {
                articles = JSON.parse(data);
                return fs.readFile(categoriesPath, 'utf8');
            })
            .then(data => {
                categories = JSON.parse(data);
                res();
            })
            .catch(err => {
                rej("unable to read file");
        });
    });
}

// Get all published articles
function getPublishedArticles() {
    return new Promise((res, rej) => {
        const publishedArticles = articles.filter(article => article.published);

        if (publishedArticles.length > 0) {
            res(publishedArticles);
        }
        else {
            rej("no results returned");
        }
    });
}

// Get all articles
function getAllArticles() {
    return new Promise((res, rej) => {
        if (articles.length > 0) {
            res(articles);
        }
        else {
            rej("no results returned");
        }
    });
}

// Get all categories
function getCategories () {
    return new Promise((res, rej) => {
        if (categories.length > 0) {
            res(categories);
        }
        else {
            rej("no results returned");
        }
    });
}

// Add an article
function addArticle(articleData) {
    return new Promise((resolve, reject) => {
        articleData.published = articleData.published ? true : false;
        articleData.id = articles.length + 1; // Set ID to the current length + 1
        articles.push(articleData);
        resolve(articleData);
    });
}

// Get articles by category
function getArticlesByCategory(category) {
    return new Promise((resolve, reject) => {
        const filteredArticles = articles.filter(article => 
            // Added toLowerCase() to make the comparison case-insensitive
            article.category && article.category.toLowerCase() == category.toLowerCase());
        if (filteredArticles.length > 0) resolve(filteredArticles);
        else reject("no results returned");
    });
}

// Get articles by minimum date
function getArticlesByMinDate(minDateStr) { 
    return new Promise((resolve, reject) => { 
        const minDate = new Date(minDateStr); 
        const filteredArticles = articles.filter(article => new Date(article.articleDate) >= minDate); 
        if (filteredArticles.length > 0) resolve(filteredArticles); 
        else reject("no results returned"); 
    }); 
}; 

// Get article by ID
function getArticleById(id) { 
    return new Promise((resolve, reject) => { 
        const foundArticle = articles.find(article=> article.id == id); 
        if (foundArticle) resolve(foundArticle); 
        else reject("no result returned"); 
    }); 
}; 

module.exports = {
    initialize,
    getPublishedArticles,
    getAllArticles,
    getCategories,
    addArticle,
    getArticlesByCategory,
    getArticlesByMinDate,
    getArticleById
};