const express = require('express');
const router = express.Router();
const Post=require('../models/post');

//Routes
/*
GET/HOME
*/ 

router.get('',async (req, res) => {
   try {
    const locals={
      title:"BLOGS",
      description:"Blogs on career options"
     }
     let perpage=10;
     let page=req.query.page || 1;

     const data=await Post.aggregate([{$sort:{createdAt:-1}}]).skip(perpage*page-perpage).limit(perpage).exec();
     
    const count=await Post.countDocuments();
    const nextPage=parseInt(page)+1;
    const hasNextPage=nextPage<=Math.ceil(count/perpage);

    res.render('index',{locals,data,current:page,
      nextPage:hasNextPage?nextPage:null,
      currentRoute: '/'
    }); 
  } catch (error) {
    console.log(error);
   }

});




// router.get('',async (req, res) => {
//   const locals={
//    title:"BLOGS",
//    description:"Blogs on career options"
//   }
  
//   try {
//    const data=await Post.find();
//    res.render('index',{locals,data}); 
//  } catch (error) {
//    console.log(error);
//   }

// });



//Routes
/*
GET post id
*/ 


router.get('/post/:id',async (req, res) => {
  try {
    
    let slug=req.params.id;
    const data=await Post.findById({_id:slug});

    const locals={
      title:data.title,
      description:"Blogs on career options",
        currentRoute: '/post/${slug}'
     }

   res.render('post',{locals,data}); 
 } catch (error) {
   console.log(error);
  }

});


//Routes
/*
POST post search
*/


router.post('/search',async (req, res) => {
 
  try {
    const locals={
      title:"Search",
      description:"Blogs on career options"
     }
  
     let searchTerm=req.body.searchTerm;
     const searchNoSpecialChar=searchTerm.replace(/[^a-zA-z0-9]/g,"");

     const data=await Post.find({
      $or:[
        {title:{$regex:new RegExp(searchNoSpecialChar,'i') }},
        {body:{$regex:new RegExp(searchNoSpecialChar,'i')}}
      ]
     });

     res.render("search",{
      data,
      locals
     });
  //    console.log(searchTerm);

  //  const data=await Post.find();
   res.send(searchTerm); 
 } catch (error) {
   console.log(error);
  }

});






router.get('/about', (req, res) => {
    res.render('about',{
        currentRoute: '/about'
    });
  });
  
  router.get('/contacts', (req, res) => {
    res.render('contacts',{
        currentRoute: '/contacts'
    });
  });
  
  // router.get('/details', (req, res) => {
  //   res.render('details');
  // });
  
 

// function insertPostData(){
//   Post.insertMany([
//     {
//       title: "Understanding MongoDB Basics",
//       body: "MongoDB is a NoSQL database that offers high performance, high availability, and easy scalability. In this post, we'll explore the basics of MongoDB, including collections, documents, and CRUD operations."
//     },
//     {
//       title: "Setting Up Node.js for Your Project",
//       body: "Node.js is a powerful JavaScript runtime built on Chrome's V8 engine. This tutorial will guide you through setting up Node.js for your project, including installing Node.js and initializing a new project."
//     },
//     {
//       title: "Creating Your First Express Application",
//       body: "Express is a minimal and flexible Node.js web application framework. Learn how to create your first Express application, set up routes, and handle HTTP requests and responses."
//     },
//     {
//       title: "Connecting Node.js to MongoDB",
//       body: "Connecting your Node.js application to MongoDB is a crucial step in building a dynamic website. This post covers how to use Mongoose to establish a connection and perform basic database operations."
//     },
//     {
//       title: "Building RESTful APIs with Express",
//       body: "RESTful APIs are essential for modern web development. This tutorial will show you how to build RESTful APIs using Express, handle various HTTP methods, and structure your routes."
//     },
//     {
//       title: "Handling Form Data in Express",
//       body: "Forms are a fundamental part of web applications. Learn how to handle form data in Express, including parsing incoming data, validating inputs, and processing form submissions."
//     },
//     {
//       title: "User Authentication with Passport.js",
//       body: "Authentication is critical for securing your web application. This post explains how to implement user authentication in your Node.js and Express application using Passport.js."
//     },
//     {
//       title: "Deploying Your Node.js Application",
//       body: "Deploying your Node.js application can be daunting. This guide covers various deployment options, including using platforms like Heroku and setting up your own server."
//     },
//     {
//       title: "Error Handling in Express",
//       body: "Proper error handling is vital for creating robust applications. Discover how to handle errors gracefully in your Express application, including middleware and custom error pages."
//     },
//     {
//       title: "Optimizing Performance in MongoDB",
//       body: "Performance optimization is key to maintaining a responsive application. This post delves into various techniques to optimize your MongoDB queries, indexing strategies, and best practices for scaling."
//     }
//   ])
// }

// insertPostData();

module.exports = router;
