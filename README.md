# PTO Web Application

A lite weight PTO management application.

## Table of Contents

1. [Setup](#setup)
2. [Web API](#web-api)
    - [Users](#users)
    - [Requests](#requests)
    - [Admin](#admin)
3. [Authentication](#authentication)
4. [Testing](#testing)
5. [Features](#features)
6. [Bugs](#bugs)
7. [Enhancement Ideas](#enhancements)

## Setup

This web application utilizes docker containers to simplify both setup and hosting. All you need to do is install Docker on your machine:
- [Docker for windows](https://docs.docker.com/docker-for-windows/install/)
- [Docker for mac](https://docs.docker.com/docker-for-mac/install/)
- [Docker for linux](https://docs.docker.com/engine/install/)

Once installed, verify your machine is ready to go with docker --version
``` console
user@YourMachine~ % docker --version
Docker version 19.03.13, build 4484c46d9d
```

Now clone the repo and navigate to the project directory (root). Run the following command to build an instance of the container:
``` console
docker-compose build
```

Once complete, now you can start up the project with the following command:
``` console
docker-compose up
```

The api project utilizes a watch tool called nodemon so that the code will recompile when changes are made to the project directory (relative to where it lives on the container). React utilizes webpack to recompile when changes are made as well. This means you can start the container and do development at the same time without having to rebuild the container. Only rebuild the container if you make changes to package.json or package-lock.json in either of the projects.

## Client

React is the front end framework used for this project. The /client folder contains its own package.json that installs all of its dependencies and utilizes react-scripts for runtime.

<!-- Thinking of using a tool for documenting the web api, like OpenApi 3/Swagger -->
## Web API

For this application we are using an express js server to manage our REST api. For modularity, this project is self contained so the /api folder has its own package.json and node js is used as the runtime (though a future enhancement should be to move to a more secure js runtime like [Deno](https://deno.land/)). The api utilizes the mongoose js library which acts as an ODM with MongoDB. MongoDB holds our documents but the server will act as the primary entity for managing our CRUD operations.

### Users (see also [Authentication](#authentication))

- GET: /api/user/:id
- 

### Requests

- GET: /api/requests
- GET: /api/requests/:id
- POST: /api/new-request/
- PUT: /api/requests/update-request/:id
- DELETE: /api/requests/delete-request/:id
- PUT: /api/requests/approve-request/:id
- PUT: /api/requests/deny-request/:id

### Admin

## Authentication

## Testing

Testing runs within the docker container. Simply use this command to run just the testing service in the container:
``` console
docker-compose run --rm pto-test
```

For this project the testing framework currently utilizes the create react app configuration (jest, startup with react-scripts). The entirety of the container including tests can run so proper integration testing can be executed.

Although not every nook and cranny of this app needs an automated test, it is highly recommended that complex and integrative code are accompanied by tests.

## Features

## Bugs

## Enhancements

- Looking to move to Deno for a more secure run time.
- The data table isn't quite reusable as it contains quite a bit of business logic. Ideally would like to loosely couple the data table with the other elements that are currently grouped in there.
- Would like to move away from using libraries such as Boostrap, react-toastify, devexpress scheduler. These are great start pieces but it will be nice to create elements entirely from scratch.
- Eventually should type this js.
