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

// mongoose and mongo sandbox routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'Moonlight Dancing',
        snippet: 'About second journey',
        body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quos eos eaque fugit eligendi commodi facilis error debitis doloremque nostrum!'
    });

    blog.save()
        .then( result => {
            res.send(result);
        })
        .catch( err => {
            console.log(err.message);
        });
});

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then( result => {
            res.send(result);
        })
        .catch( err => {
            console.log(err.message);
        });
});

// routes
app.get('/', (req, res) => {
    const blogs = [
        {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},
      ];
    res.render('index', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use( (req, res) => {
    res.status(404).render('404', { title: '404'});
});