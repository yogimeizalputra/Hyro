const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// express app
const app = express();

// connect to mangoDB
const dbURI = "mongodb+srv://yogimp:yogi123@hyroblogs.ln4eb.mongodb.net/hyro-blogs?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000/'); 
    }))
    .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

// blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then( result => {
            res.render('index', { title: 'All Blogs', blogs: result})
        })
        .catch( err => {
            console.log(err.message); 
        });
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then( result => {
            res.redirect('/blogs')
        })
        .catch( err => {
            console.log(err.message); 
        });
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then( result => {
            res.render('details', { title: 'Blog Details' , blog: result })
        })
        .catch( err => {
            console.log(err.message); 
        });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use( (req, res) => {
    res.status(404).render('404', { title: '404'});
});