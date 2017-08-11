# iFly Media Purchaser App

A Node app built with Angular, Express, and a lightweight MongoDB backend. For demonstration purposes only.  Angular/Express skeleton cloned from [scotch-io/node-todo](https://github.com/scotch-io/node-todo)

## Requirements

- [Node and npm](http://nodejs.org)
- [MongoDB](https://www.mongodb.com/download-center#community)

## Installation

1. Clone the repository: `git clone git@github.com:bistacos/photopicker`
2. Install the application: `npm install`
3. [Install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/).  You'll have to follow the steps detailed steps depending on what platform you'll be running it on ([OSX](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/), [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/))
4. Run MongoDB [OSX](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb) [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition).  This takes a few steps and is a bit of a pain...sorry.
4. Leave MongoDB running, and in a separate tab start the app server: `node server.js`
5. View in browser at `http://localhost:8080`

## Implementation Notes

There are clearly many features that, in the interest of time, I didn't add. Unit testing, heavier parameter validation and error handling, and cloud deployment spring first to mind.  I also kept the packaging lightweight and omitted a few usual no-brainers like `lodash` for JS structure manipulation, as well as asynchronous DB handlers like `async` and `bluebird`.

I also took this opportunity to use MongoDB for the first time, so some of my usage there may be non-standard.  It's as easy to use as they promise but their Quickstart documentation could use some editing :) .
