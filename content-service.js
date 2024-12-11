/******************************
* Name: Harrison Nguyen
* Section: WEB322 NDD
* Student ID: 167096239
* Email: hnguyen169@myseneca.ca
* Date Created: October 1, 2024
* Last Modified: December 11, 2024
******************************/

const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');

let articles = [];
let categories = [];

// Connect using Neon.tech credentials
const pool = new Pool({
    user: 'web322db_owner',
    host: 'ep-young-surf-a5vilnef.us-east-2.aws.neon.tech',
    database: 'blog_database',
    password: 'H0VUejW8TvQd',
    port: 5432,
    ssl: { rejectUnauthorized: false }, // Needed for Neon.tech
});

// Initialize data
function initialize() {
    return Promise.resolve(); // Data is in database
}

// Get all published articles
function getPublishedArticles() {
    return pool.query(
        `SELECT a.*, c.name AS category_name 
         FROM articles a 
         INNER JOIN categories c ON a.category_id = c.id 
         WHERE a.published = true`
    )
        .then(res => res.rows)
        .catch(err => Promise.reject("No published articles found"));
}


// Get all articles
function getAllArticles() {
    return pool.query('SELECT * FROM articles')
        .then(res => res.rows)
        .catch(() => Promise.reject('No results returned'));
}

// Get all categories
function getCategories() {
    return pool.query('SELECT * FROM categories')
        .then(res => res.rows)
        .catch(() => Promise.reject('No results returned'));
}

// Add an article
function addArticle(articleData) {
    const { title, content, author, published, categoryId, date } = articleData;
    return pool.query(
        'INSERT INTO articles (title, content, author, published, category_id, article_date) VALUES ($1, $2, $3, $4, $5, $6)',
        [title, content, author, published, categoryId, date]
    )
        .then(() => 'Article added successfully')
        .catch(() => Promise.reject('Failed to add article'));
}

// Get articles by category
function getArticlesByCategory(categoryId) {
    return pool.query('SELECT * FROM articles WHERE category_id = $1', [categoryId])
        .then(res => res.rows)
        .catch(() => Promise.reject('No results returned'));
}

// Get articles by minimum date
function getArticlesByMinDate(minDateStr) {
    return pool.query(
        `SELECT * FROM articles WHERE article_date >= $1`,
        [minDateStr]
    )
        .then(res => res.rows)
        .catch(() => Promise.reject("No articles found after the specified date"));
}

// Get article by ID
function getArticleById(id) {
    return pool.query('SELECT * FROM articles WHERE id = $1', [id])
        .then(res => (res.rows.length > 0 ? res.rows[0] : Promise.reject('No article found')))
        .catch(() => Promise.reject('No results returned'));
}

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