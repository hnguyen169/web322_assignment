/******************************
* Name: Harrison Nguyen
* Section: WEB322 NDD
* Student ID: 167096239
* Email: hnguyen169@myseneca.ca
* Date Created: October 1, 2024
* Last Modified: November 18, 2024
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
        const publishedArticles = articles
            .filter(article => article.published)
            .map(article => ({
                ...article,
                categoryName: getCategoryNameById(article.categoryId) // Add category name
            }));

        if (publishedArticles.length > 0) {
            res(publishedArticles);
        } else {
            rej("no results returned");
        }
    });
}

// Get all articles
function getAllArticles() {
    return new Promise((res, rej) => {
        if (articles.length > 0) {
            const updatedArticles = articles.map(article => ({
                ...article,
                categoryName: getCategoryNameById(article.categoryId) // Add category name
            }));
            res(updatedArticles);
        } else {
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
            getCategoryNameById(article.categoryId) == category
        );
        
        if (filteredArticles.length) {
            resolve(filteredArticles);
        } else {
            reject(new Error("No articles found for this category."));
        }
    });
}

// Get articles by minimum date
function getArticlesByMinDate(minDateStr) { 
    return new Promise((resolve, reject) => { 
        // Validate the input date string format
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(minDateStr);
        if (!isValidDate) {
            reject("Invalid date format. Expected YYYY-MM-DD.");
            return;
        }

        // Parse the date
        const minDate = new Date(minDateStr);
        if (isNaN(minDate.getTime())) {
            reject("Invalid date. Could not parse the provided date.");
            return;
        }

        // Filter articles based on the date
        const filteredArticles = articles.filter(article => {
            const articleDate = new Date(article.articleDate);
            return !isNaN(articleDate.getTime()) && articleDate >= minDate;
        });

        // Resolve or reject based on results
        if (filteredArticles.length > 0) {
            resolve(filteredArticles);
        } else {
            reject("No articles found after the specified date.");
        }
    });
}; 

// Get article by ID
function getArticleById(id) { 
    return new Promise((resolve, reject) => { 
        const foundArticle = articles.find(article => article.id == id); 

        if (foundArticle) {
            foundArticle.forEach(article => { 
                article.categoryName = getCategoryNameById(article.categoryId); 
            });
            resolve(foundArticle);
        } else {
            reject("no result returned");
        }
    }); 
}; 

// Helper function to get Name based on ID
function getCategoryNameById(categoryId) {
    const category = categories.find(cat => cat.id == categoryId);
    return category ? category.name : "Unknown Category";
}

module.exports = {
    initialize,
    getPublishedArticles,
    getAllArticles,
    getCategories,
    addArticle,
    getArticlesByCategory,
    getArticlesByMinDate,
    getArticleById,
    getCategoryNameById
};