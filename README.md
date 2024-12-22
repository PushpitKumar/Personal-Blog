# Personal-Blog

## Table of Coontents
<ol>
<li>Project Overview</li>
<br/>
<li>Solution Summary</li>
<br/>
<ul>
  <li>2.1 Scope</li>
  <li>2.2 Assumptions</li>
  <li>2.3 Dependencies</li>
</ul>
<br/>
<li>System Design</li>
<br/>
<ul>
<li>3.1 Proposed Design</li>
</ul>
<br/>
</ul>
<br/>
<li>App Implementation</li>
<br/>
<li>Drawbacks and Future Scope</li>
</ol>

### 1. Project Overview
PK Reflections is my personal blog application where I share thoughts, ideas, and a bit of everything that sparks my interest.

This Web-Application is built using Node and Express JS utiizing EJS templates and allows me to create, read, update, search and delete my posts. TinyMCE text editor has been implemented enabling me to format my blog's content including images. To make the App more secure, user authentication and authorization could be added so that users can login, like and comment on posts, thereby increasing interaction. Blog Posts will be displayed as cards on the homepage and some truncated part of the content would be visible. To read the full post, user will have to click on Read more... present at the bottom right of the card. Users will also be able to send messages (mail) to me via the contact form present in the home page

### 2. Solution Summary

#### 2.1 Scope
The scope of this Blog Web-Application encompasses the development of a comprehensive application using Node and Express JS. This project aims to assist me in managing my posts effectively. The application will provide a range of features and functionalities to enhance user experience.

The project scope includes the following aspects:

#### 1. Create Posts
* Create new Blog posts
* Optionally add a cover image for the blog post
* Rich text editing experience powered by TinyMCE for the blog's content

#### 2. Read Posts
* Read little bit of the created blog posts on home page
* To read the full post, click on Read more... link

#### 3. Update Posts
* Update a post's content
* Optionally update the cover image

#### 4. Delete Posts
* Delete existing posts

#### 5. Search Posts
* Search post(s) from the search option
* Posts can be searched based on title or content

#### 6. Send Message/Email
* Users can send message (email) from the contact section
* No authentication needed

#### 7. Frontend Application Development
* User-Friendly and interactive interface for people to interact with the app
* Design intuitive views and forms for users
* Responsive for all screen sizes

#### 2.2 Assumptions
* Only the blog owner (me) shall be able to create, update and delete posts
* Other users will only be able to read posts
* The owner can edit the cover image and content of a post but not the title
* The application runs smoothly in a production environment and is able to handle high loads and scale as per requirement
* A blog post is deleted permanently once the owner (me) deletes it

#### 2.3 Dependencies

1. **Backend Framework**: The development of this blog application requires a suitable backend framework like Node and Express JS. The framework provides the necessary tools and libraries to handle data processing, business logic, and integration with the database.

2. **Frontend Technologies**: The frontend of the system relies on web technologies like HTML, CSS, and JavaScript, Bootstrap, jQuery, etc. to create a responsive user-friendly interface. All the UI views are written and rendered using powerful EJS templates for a dynamic interaction with the backend.

3. **Development Tool and IDE**: The development of this blog application relies on tools and integrated development environments (IDEs) like Visual Studio Code, or JetBrains Rider, which provide necessary features for coding, debugging, and project management. Visual Studio Code was selected as the ideal choice.

### 3. System Design

#### 3.1 Proposed Design

This is a Personal Blog Application, hence it is a single-user system. Different views are used to render the content based on the functionality. The different views that user can interact within the system are:

* Home Page containing all blog posts in card format
* New Post Creation
* Editing an existing post
* Deleting an existing post
* Search an existing post based on a blog's title or content
* Contact section for sending messages as email
* About section 

### 4. App Implementation
![Screenshot (42)](https://github.com/user-attachments/assets/84ba3eb8-46de-41a1-a6a5-ec93a1e2dd6d)
![Screenshot (43)](https://github.com/user-attachments/assets/c4a48a81-30d5-4caa-9996-32ff43d63eb9)
![Screenshot (44)](https://github.com/user-attachments/assets/f6d381c1-8032-41dc-9b44-6798f8842b4a)
![Screenshot (45)](https://github.com/user-attachments/assets/2de0fb25-638d-4c29-b40d-e28cca61876b)
![Screenshot (46)](https://github.com/user-attachments/assets/b133f245-64fa-432a-8d7a-bd7db27f7f80)
![Screenshot (47)](https://github.com/user-attachments/assets/125892a9-a83a-45a1-8f1a-5c7631162d68)
![Screenshot (48)](https://github.com/user-attachments/assets/56c7bd81-b1e1-428e-9322-7ac7032abe21)
![Screenshot (49)](https://github.com/user-attachments/assets/01a0d080-feaf-46fd-b544-0e6b18562df4)
![Screenshot (50)](https://github.com/user-attachments/assets/57756f5e-93af-4aeb-aaab-272c52e47a34)
![Screenshot (51)](https://github.com/user-attachments/assets/15d900ce-bb62-46b2-829b-814dcca8f638)
![Screenshot (52)](https://github.com/user-attachments/assets/3afda147-1d53-411c-a604-0c4a76afa409)
![Screenshot (53)](https://github.com/user-attachments/assets/5a586113-2b3d-4e91-ab56-714a0ffee3bf)
![Screenshot (54)](https://github.com/user-attachments/assets/71f98972-bb92-438a-9f08-0563e22f629c)
![Screenshot (55)](https://github.com/user-attachments/assets/93e540c9-b11d-49ab-a97c-3a4a17ecd0ed)
![Screenshot (56)](https://github.com/user-attachments/assets/be45c6b0-8993-4479-9b61-fd0f6a076546)
![Screenshot (57)](https://github.com/user-attachments/assets/534f7e76-d622-4486-b03a-8139de1bdc50)
![Screenshot (58)](https://github.com/user-attachments/assets/5d214445-1e59-4da0-83a8-35bcd71ab4da)

### 5. DrawBacks and Future Scope

* No Database has been implemented to store the blog details, essentially deleting all information once the server is shut down. In future, database integration is necessary to have persistent data
* User Authentication and Authorization can be implemented to enhance the app's security
* Application's engagmenent could be significantly increased by allowing authenticated users to like and comment on blog posts
* The application can be run in local currently, since it has not been deployed on a server.