![SpeakRTC](./public/img/speakrtc.png "SpeakRTC")

An application of example to work with <strong>WebRTC Protocol</strong>.

 * Multi-party video chat with Rooms

 * Chat Room

 * Simple administration of logs

 * Simple administration of users

Libraries used by SpeakRTC:
--------------------------

 * [EasyRTC](http://easyrtc.com)
 **A bundle of Open Source WebRTC joy!**

    Priologic's EasyRTC, a bundle of Open Source WebRTC joy, incorporates an EasyRTC server install and client API, and working, HTML5 and JavaScript, application source code under a BSD 2 license.
    
 * [Socket.io](http://socket.io)
 
 * **Client Side**
     * [Twitter Bootstrap](http://getbootstrap.com)
     * [AngularJS](https://code.angularjs.org)
     * [jQuery](http://api.jquery.com)
     
 * **Server Side**
     * [NodeJS](http://nodejs.org)
     * [ExpressJS](http://expressjs.com)
     * [MongoDB](http://www.mongodb.org/)

Installation
------------

1. Install [NodeJS](http://nodejs.org)
2. Use GIT to clone the repository:

    $ git clone <strong style="color: white;background-color: red;">TODO:Victor: Poner la direccion del repositorio en github, ejemplo: git clone http://github.com/linnovate/mean.git</strong>
    
3. Enter the subdirectory that was created:

     $ cd speakrtc
     
4. Install SpeakRTC's dependencies from NPM:

     $ npm install
     
5. Or download all the project from this [LINK]<strong style="color: white;background-color: red;">TODO:Victor: Poner el enlace desde donde estará todo el proyecto para poder ser descargado completamente, ponerlo en dropbox.</strong>:
     
Running SpeakRTC Server
------------
In the speakrtc folder:

1. Configure MongoDB in file "config.json":

```json
    {
      "database": {
        "host": "192.168.3.26",
        "name": "speakrtc",
        "user": "",
        "pass": "",
        "port": ""
      },
      ...
    }
```
        
2. To run the server using the node command:

    $ node app.js
    
3. Open a browser and go to:

    http://localhost:3000
    
``` text
      user: admin@root
      pass: admin505
```

Credits
------------
(c) 2014 CodeField Group. MIT License