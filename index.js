const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const path =require("path");
// Serve files from the "uploads" directory

const posts = [];


const app = express();
app.set('views', path.join(__dirname, 'views'));


app.set("view engine", "ejs");
 

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
 

app.get("/", function (request, response) {
  response.render("home", {
    posts: posts,
   
  });
});
app.get("/compose", function (request, response) {
  response.render("compose");
});
app.post("/compose", function (request, response) {
  const postTitle = request.body.postTitle;
  const postContent = request.body.postContent;
  const postDate = request.body.postDate;


  if (!postTitle || !postContent) {
    return response.send(
      "<script>alert('Please fill all the fields'); window.location.href='/compose';</script>"
    );
  }

  const post = {
    Title: postTitle,
    Date: postDate,
    Content: postContent,
     // Use ternary operator to set the image filename or null
  };

  posts.push(post);
  response.redirect("/");
});

/*

app.post("/compose", upload.single("myImage"), function (request, response) {
  const postTitle = request.body.postTitle;
  const postContent = request.body.postContent;
  const postImage = request.body.postImage.file;
  const postDate = request.body.postDate // This will hold the uploaded file information

  if (!postTitle || !postContent) {
    return response.send(
      "<script>alert('Please fill in both the title and content fields.'); window.location.href='/compose';</script>"
    );
  }

  if(!postImage){
    var post = {
       // Save the filename of the uploaded image
      Title: postTitle,
      Content: postContent,
      Date:postDate,
    };
  
  }
  else{
  var post = {
    Image: postImage.filename, // Save the filename of the uploaded image
    Title: postTitle,
    Content: postContent,
    Date:postDate,
  };
}

  // Now you can process the 'post' object and add it to your posts array
  posts.push(post);
  response.redirect("/");
});

/*
app.post("/compose", function (request, response) {
  const postTitle = request.body.postTitle;
  const postContent = request.body.postContent;
  const postDate = request.body.postDate;
  

  if (!postTitle || !postContent || !postDate) {
    return response.send(
      "<script>alert('Please fill all the fields'); window.location.href='/compose';</script>"
    );
  }

  const post = {

    Title: postTitle,
    Date:postDate,
    Content: postContent,
  };

  posts.push(post);
  response.redirect("/");
});
*/

app.get("/posts/:topic", function (request, response) {
  let found = false;
  posts.forEach((item) => {
    if (_.lowerCase(request.params.topic) === _.lowerCase(item.Title)) {
      response.render("post.ejs", {
        Title: item.Title,
        Content: item.Content,
        Date: item.Date, // Pass the date to the template
      });
      found = true;
    }
  });
  if (!found) {
    response.redirect("/");
  }
});




app.post("/delete", function (request, response) {
  const postToDelete = request.body.postTitle;

  posts.forEach((post, index) => {
    if (_.lowerCase(post.Title) === _.lowerCase(postToDelete)) {
      posts.splice(index, 1);
    }
  });

  response.redirect("/");
});
// Add this route handler for editing posts
app.get("/edit/:title", function (request, response) {
  const postTitle = request.params.title;

  // Find the post with the specified title
  const post = posts.find((item) => _.lowerCase(item.Title) === _.lowerCase(postTitle));

  if (!post) {
    return response.redirect("/");
  }

  response.render("edit", {
    post: post,
  });
});

// Add a route handler to handle the edit form submission
app.post("/edit/:title", function (request, response) {
  const postTitle = request.params.title;
  const updatedContent = request.body.updatedContent;

  // Find the post with the specified title
  const post = posts.find((item) => _.lowerCase(item.Title) === _.lowerCase(postTitle));

  if (post) {
    // Update the content of the post
    post.Content = updatedContent;
  }

  response.redirect("/");
});



app.listen(3001, function () {
  console.log("Server started on port 3001");
});
