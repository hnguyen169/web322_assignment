const fs = require('fs');
const path = require('path');

let articles = [];
let categories = {};

function initialize() {
    return new Promise((res, rej) => {
        const articlesPath = path.join(__dirname, 'data', 'articles.json');
        const categoriesPath = path.join(__dirname, 'data', 'categories.json');

        fs.readFile(articlesPath, 'utf8', (err, data) => {
            if (err) {
                reject("unable to read file");
                return;
            }

            try {
                articles = JSON.parse(data);
            }
            catch (parseErr) {
                reject("unable to read file");
                return;
            }

            fs.readFile(categoriesPath, 'utf8', (err, data) => {
                if (err) {
                    reject("unable to read file");
                    return;
                }
    
                try {
                    categories = JSON.parse(data);
                    resolve();
                }
                catch (parseErr) {
                    reject("unable to read file");
                    return;
                }                
            });
        });
    });
}

function getPublishedArticles() {
    return new Promise((res, rej) => {
        const publishedArticles = articles.filter(article => article.published);

        if (publishedArticles.length > 0) {
            resolve(publishedArticles);
        }
        else {
            reject("no results returned");
        }
    });
}

function getAllArticles() {
    return new Promise((res, rej) => {
        if (articles.length > 0) {
            resolve(articles);
        }
        else {
            reject("no results returned");
        }
    });
}

function getCategories () {
    return new Promise((res, rej) => {
        if (categories.length > 0) {
            resolve(categories);
        }
        else {
            reject("no results returned");
        }
    });
}

module.exports = {
    initialize,
    getPublishedArticles,
    getAllArticles,
    getCategories
};