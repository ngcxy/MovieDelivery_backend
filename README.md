# EE547 website "Movipendent" - Backend

This repo is the backend part of the website "Movipendent".

## Architecture

This repo has three major parts, along with other configuration files:
- [server.js](https://github.com/ngcxy/MovieDelivery_backend/blob/main/server.js) serves to handle the endpoint requests based on express.js.
- [sourceMongo.js](https://github.com/ngcxy/MovieDelivery_backend/blob/main/sourceMongo.js) contains the function dealing with database operations.
- [api](https://github.com/ngcxy/MovieDelivery_backend/tree/main/api) folder for connections with third-party apis.

## Deployment
This frontend is already deployed on AWS. Check this [link](http://35.86.87.93/api_v1/)

To run locally, follow these steps:

Git clone the repository

- Using Docker: 
   - Install and run docker
   - Run `docker build -t movipendent` to build image
   - Run `docker run -p 3000:3000 movipendent`
- Using npm:
   - Install node and npm
   - Run `npm install` to install essential packages
   - Run `npm start`


