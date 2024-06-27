const express = require('express');
const router = express.Router();
const Post=require('../models/post');
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const adminLayout='../views/layouts/admin';
const jwtSecret=process.env.JWTSECRET;

/*
check-login
*/ 
const authMiddleware=(req,res,next)=>{
  const token=req.cookies.token;

  if(!token){
    return res.status(401).json({message:'Unauthorized'});
    }

    try {
      const decoded=jwt.verify(token,jwtSecret);
      req.userId=decoded.userId;
      next();
    } catch (error) {
      return res.status(401).json({message:'Unauthorized'});
    }
}

// module.exports=authMiddleware;


//Routes
/*
admin-login
*/ 

router.get('/admin',async (req, res) => {
  
  try {
    const locals={
        title:'Admin',
        description:'Blogs on career options'
       }

   res.render('admin/index',{locals,layout:adminLayout}); 
 } catch (error) {
   console.log(error);
  }

});



/*
POST
admin-check login
*/ 

router.post('/admin',async (req, res) => {
     
    try {
       const{username,password}=req.body;
        const user= await User.findOne({username});
        if(!user){
          return res.status(401).json({message:'Invalid credentials'});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
          return res.status(401).json({message:'Invalid credentials'});
       }
       const token=jwt.sign({userId:user._id},jwtSecret);
       res.cookie('token',token,{httpOnly:true});
       res.redirect('/dashboard');

   } catch (error) {
     console.log(error);
    }
  
  });


/*
get
admin-dashboard
*/ 

router.get('/dashboard',authMiddleware,async (req, res) => {
    
   try {
    const locals={
      title:'Dashboard',
      description:'Blogs on career options'
     }

    const data=await Post.find();
    res.render('admin/dashboard',{
     locals,
     data,
     layout:adminLayout
    });
   } catch (error) {
    console.log(error);
   }
});


/*
GET
admin-create new post
*/ 


router.get('/add-post',authMiddleware,async (req, res) => {
  
  try {
   const locals={
     title:'Add post',
     description:'Blogs on career options'
    }

   const data=await Post.find();
   res.render('admin/add-post',{
    locals,
    layout:adminLayout
   });
  } catch (error) {
   console.log(error);
  }
});




/*
POST
admin-create new post
*/ 


router.post('/add-post',authMiddleware,async (req, res) => {
  
  try {
    // const { title, body } = req.body;
    // console.log(req.body.title);
    // console.log(req.body.body);
    // // Ensure these match the `name` attributes in your form
    //     if (!title || !body) {
    //         return res.status(400).send('Title and body are required');
    //     }
   console.log(req.body);
   
   try {
    const newPost=new Post({
      title:req.body.title,
      body:req.body.body
    });

    await Post.create(newPost);
    res.redirect('/dashboard');
   } catch (error) {
    console.log(error);
   }

  } catch (error) {
   console.log(error);
  }
});


/*
GET
admin-EDIT  post
*/ 


router.get('/edit-post/:id',authMiddleware,async (req, res) => {
  
  try {
    const locals={
      title:"Edit Post",
      description:"Edit your blog here and add new experiences."
    };
  
    const data=await Post.findOne({ _id: req.params.id});
   res.render('admin/edit-post',{
     locals,
    data,
    layout:adminLayout
   })

  } catch (error) {
   console.log(error);
  }
});




/*
PUT
admin-EDIT  post
*/ 


router.put('/edit-post/:id',authMiddleware,async (req, res) => {
  
  try {
   
    await Post.findByIdAndUpdate(req.params.id,{
      title:req.body.title,
      body:req.body.body,
      updatedAt:Date.now()
    });

    res.redirect(`/edit-post/${req.params.id}`); 
   
  } catch (error) {
   console.log(error);
  }
});



/*
POST
admin-check login
*/ 

// router.post('/admin',async (req, res) => {
  
//   try {
//      const{username,password}=req.body;
//   const hashedPassword= await bcrypt.hash(password,10);

//   try {
//       const user=await User.create({username,password:hashedPassword});
//       res.status(101).json({message:'User created',user});
//   } catch (error) {
//       if(error.code===11000){
//           res.status(409).json({message:'User already in use'});
//       }
//       res.status(500).json({message:'Internal server error'});
//   }

//  } catch (error) {
//    console.log(error);
//   }

// });



/*
POST
admin-register
*/ 

router.post('/register',async (req, res) => {
  
    try {
       const{username,password}=req.body;
    //    console.log(req.body);
    //    res.redirect('/admin');
      if(req.body.username==='admin' && req.body.password==='password'){
        res.send('You are logged in');
      }else{
        res.send('Wrong username or password');
      }

   } catch (error) {
     console.log(error);
    }
  
  });



/*
GET
admin Delete  post
*/ 


router.delete('/delete-post/:id',authMiddleware,async (req, res) => {
   try {
    await Post.deleteOne({_id: req.params.id});
    res.redirect('/dashboard');
   } catch (error) {
     console.log(error);    
   }
});

/*
GET
admin Logout
*/ 

router.get('/logout',(req,res)=>{
 res.clearCookie('token');
//  res.json({message:'Logout successful.'});
 res.redirect('/');
});

module.exports = router;