import express from "express";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer"; //middleware for file uploads
import url from "url";
import methodOverride from "method-override";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
//import { OAuth2Client } from "google-auth-library";

dotenv.config();
const app = express();
const port = 3000;
let posts = [];

/*const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);*/

//oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

//Set storage engine for multer
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

//File flter to accept only image files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
    const allowedExtensions = [".jpeg", ".jpg", ".png", ".gif"];
    const isExtensionValid = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());

    if (isMimeTypeValid && isExtensionValid) {
        return cb(null, true);
    } else {
        cb (new Error("Only image uploads are allowed!"));
    }
};

//Initialize upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

//To truncate a post's content for card display
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...'; //truncates text to a specified max length, ensuring it ends on a complete word. Adds ... if the text is longer than specified length
}

function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString('en-us', options);
}

app.use(express.static("public"));
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //Middleware to serve images from uploads directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method')); //To overide post method as PUT in editPost.ejs and DELETE in readPost.ejs
app.set("view engine", "ejs");

app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});

app.get("/", (req, res) => { //Home Page
    res.render("index.ejs", { posts: posts });
});

app.get("/newPost", (req, res) => { //New Post Page
    res.render("newPost.ejs");
});

app.post("/posts", upload.single('image'), (req, res) => { //For publishing new blog
    const title = req.body.title;
    const content = req.body.content;
    const truncatedContent = truncateText(content, 100);
    const postDate = formatDate(new Date());
    if (title.length > 100 || content.length < 100) {
        return res.status(400).send("Title cannot exceed more than 100 characters and the Content shouldn't have less than 100 characters!");
    }
    /*const {
        title,
        content
    } = req.body;*/
    const imagePath = req.file ? req.file.path.replace(/\\/, '/') : null;
    const post = {
        id: Date.now().toString(), //Unique id for a post based on current timestamp
        title: title,
        content: content,
        imagePath: imagePath,
        truncatedContent: truncatedContent,
        date: postDate
    };
    posts.push(post);
    res.redirect("/"); //Redirect back to Home Page.
    //res.render("index.ejs", { posts: posts }) //Do not use this as it is susceptible to form resubmission upon page refresh. Above line uses PRG pattern (Post/Redirect/Get) to avoid this situation
});

app.get("/readPost/:id", (req, res) => { //For reading a full post
    const postId = req.params.id;
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.render("readPost.ejs", { post: post });
    } else {
        res.status(404).send("Post not found!");
    }
});

app.post("/upload", upload.single('file'), (req, res) => {
    //Handle the uploaded file and respond with file URL
    const file = req.file;
    const fileURL = `/uploads/${file.filename}`;
    res.json({ location: fileURL });
});

app.get("/editPost/:id", (req, res) => { //For editing a post redirection
    const postId = req.params.id;
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.render("editPost.ejs", { post: post });
    } else {
        res.status(400).send("Post not found!");
    }
});

app.put("/editPost/:id", upload.single('new-image'), (req, res) => { //For editing posts and redirecting to index
    const postId = req.params.id;
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.title = req.body.title;
        const oldImagePath = post.imagePath;
        const content = req.body.content;
        post.content = content;
        post.truncatedContent = truncateText(content, 100);
        if (req.file) {
            post.imagePath = req.file ? req.file.path.replace(/\\/, '/') : null;
            //Delete old image if it exists
            if (oldImagePath) {
                const oldImageFullPath = path.join(__dirname, oldImagePath);
                fs.unlink(oldImageFullPath, err => {
                    if (err) {
                        console.error("Error deleting old image", oldImageFullPath, err);
                    }
                });
            }
        }
        res.redirect("/");
    } else {
        res.status(404).send("Post not found!");
    }
});

app.delete("/deletePost/:id", (req, res) => { //For deleting posts
    const postId = req.params.id;
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        const post = posts[postIndex];
        //Delete post image if any
        if (post.imagePath) {
            const imagePath = path.join(__dirname, post.imagePath);
            fs.unlink(imagePath, err => {
                if (err) {
                    console.error("Error deleting image", imagePath, err);
                }
            });
        }
        posts.splice(postIndex, 1); //Remove the post from posts array
        res.redirect("/");
    } else {
        res.status(404).send("Post not found!");
    }
});

app.post("/sendMail", async (req, res) => { //For sending mail in contact section
    const name = req.body.senderName;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.msg;
    //console.log(message);
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required: Name, Email, Subject and Message!' });
    }

    try {
        //const accessToken = await oAuth2Client.getAccessToken();
        /*Create a transporter using Google OAuth2 authentication mechanism
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });*/

        // Create a transporter object using SMTP with Gmail and app password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.APP_PASSWORD
            }
        });

        //Setup email options
        const mailOptions = {
            from: email, //This is my authentical mail address. Gmail requires the from address to be the authenticated user's email address for security reasons. So from will be my own email address: i.e pk99manu@gmail.com. To work around this we can include the user's email in the reply-to field. This way, we can reply directly to the user's email.
            to: process.env.EMAIL_USER,
            replyTo: email, //User's email
            subject: subject,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`
        }

        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + result.response);
        res.json({ message: "Message sent successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error sending email" });
    }
});

app.get("/search", (req, res) => { //Simple Search Functionality
    const query = req.query.query; //Extracts the value of query parameter from the URL's query string. For eg: If url is /search?query=example, req.query.query would be example. This is what user has searched
    if (!query) {
        return res.redirect("/");
    }
    const searchResults = posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()) || post.content.toLowerCase().includes(query.toLowerCase())); //filters the posts array to find the posts that match the search term. filter() method iterates over each post in the array. Posts satisying the search condition will be included in the searchResults array

    res.render("searchResults.ejs", { query: query, posts: searchResults });
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

// Gracefully handle server shutdown to delete all images
function cleanupUploads() {
    return new Promise((resolve, reject) => {
        const uploadsDir = path.join(__dirname, 'uploads');
        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                console.error('Error reading uploads directory', err);
                return reject(err);
            }
            const deletePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const filePath = path.join(uploadsDir, file);
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error('Error deleting file', filePath, err);
                            return reject(err);
                        }
                        resolve();
                        console.log('Uploaded Images have been deleted!');
                    });
                });
            });

            Promise.all(deletePromises)
                .then(() => {
                    console.log("Server is shutting down, All images in uploads directory have been deleted");
                    resolve();
                })
                .catch(reject);
        });
    });
}

//Ctrl + c to shut down the server
process.on('SIGINT', () => {
    console.log('Gracefully shutting down from SIGINT (Ctrl-C)');
    cleanupUploads().then(() => {
        process.exit();
    }).catch(err => {
        console.error("Error during shutdown cleanup", err);
        process.exit(1);
    });
});

process.on('exit', () => {
    cleanupUploads().catch(err => {
        console.error('Error during exit cleanup', err);
    });
});

