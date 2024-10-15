const fs = require('fs').promises;
const path = require('path');

let articles = [];
let categories = [];

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

module.exports = {
    initialize,
    getPublishedArticles,
    getAllArticles,
    getCategories
};