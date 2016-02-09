# ![MKSTream] (client/assets/logo_plain.png)
<!--# ![MKSTream] (client/assets/logo.png)-->


MKStream allows people to send files directly to each other through a secured and anonymous data-channel established by WebRTC's peer-connection. You can use our service across multiple browsers and acrosss multiple platforms with no plugins, no downloads, and no installs necessary.

# How to use MKStream
**1. Upload files  |**  Visit [MKStream.club](https://www.mkstream.club/) and upload your file(s) by clicking the drop-zone and/or dragging and dropping a file into the drop-zone.

**2. Share link  |**  After choosing your file(s), MKStream creates a anonymous and temporary unique url used to transfer files in the browser. Clicking on the glowing lightning bolt below the drop-zone will copy the temporary url to your clipboard. Give this link to another person to establish a connection and begin transfering.

**3. Transfer data  |**  Your url and your file(s) will be available for transfer as long as you keep your MKStream tab open. When both people have the unique url loaded, a file will appear in your receiving section. Clicking accept on a file begins the transfer and readies it for you to download. While connected, feel free to transfer your files back and forth.

**Note:**   
For anonymity and security reasons, either peer closing or refreshing their MKStream tab destroys the connection and voids the current anonymous link. To share more files, just go back to [MKStream.club](https://www.mkstream.club/) and MKStream will be ready for you any time.


## How does it work
# ![MKSTream] (client/assets/mkstream_architecture.png)
	- writeup coming!

# Contributing
**MKStream is brought to you by:**  
**Malek Ascha** | Product Owner & Software Engineer  
**Kevin Van** | Software Engineer  
**Simon Ding** | Software Engineer  
**Tyler Ferrier** | Scrum Master & Software Engineer  

# Getting Started
[View our git workflow](https://github.com/MAKE-SITY/MKSTream/wiki/Git-Workflow)

[View our commit styling guidelines](https://github.com/MAKE-SITY/MKSTream/wiki/Commit-Styling)

# Installation
Fork our repo and clone it from your own copy.  Install all required node modules and bower components.

`npm install`

Bower components are included in the post install.

# Usage

After all dependencies are installed, run the application with:

`npm start`

While running the application, rooms will be saved to your local mongoDB unless you specify another mongoDB through an environment variable.  To do so, create an file named ".env" in the root directory, and enter:

MONGOLAB_URI='(your mongodb uri)'

# Testing

## Executing tests

`npm test` - Run client-side tests then server-side tests.

To execute client and server tests separately, you may need to globally install some packages:

`sudo npm install -g karma-cli`

`sudo npm install -g jasmine`

Executing tests individually:

`karma start` - Run client side tests.

`jasmine` - Run server side tests.

# Grunt Scripts

`grunt jshint` - Search files for lint.

`grunt uglify` - Minify all required javascript.

Output: /client/allmincode.js 

Automatically concats and minifies all required libraries and application code in specific order.  See Gruntfile.js for details.

NOTE: For development purposes, it is easier to comment back in all the bower components and comment out allmincode.js.  When you are ready to finalize and deploy, run the uglify task again and use only allmincode.js to server the smallest file to the user.

`grunt cssmin` - output: /client/assets/styles.min.css

Minifies local css only, excluding external css libraries such as bootstrap.

`grunt minall` - Executes uglify and cssmin.

`grunt watch` - Watches all files for lint during development.

# Style Guide
Access our [Style Guide here](https://github.com/MKSTeam/thesis/wiki/Style-Guide)

# Press Release
Access our [Press Release here](https://github.com/MKSTeam/thesis/wiki/Press-Release)