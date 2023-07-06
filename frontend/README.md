# MyApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# MyApp.
This project is a web application that combines Angular for the frontend and PHP for the backend to implement CRUD (Create, Read, Update, Delete) operations. The frontend is responsible for rendering the user interface and handling user interactions, while the backend handles server-side logic, data processing, and database operations.

The Angular frontend communicates with the PHP backend using RESTful APIs for performing CRUD operations on product stored in the backend database. The PHP backend is responsible for handling incoming API requests, processing the product data, and performing the necessary CRUD operations on the database.

# Project Flow/Execution
![Getting Started](./docs/images/API%20request.png)
above is a data flow diagram of backend

![Getting Started](./docs/images/crud%20-%20frontend.png)
above is a data flow diagram of frontend

The user lands on the application.
The user can create, read, update, and delete products from the application.
The application uses an API to store and retrieve product data.
When the user performs a CRUD operation, the application sends a request to the API to perform the operation.
The API returns a response to the application, which updates the UI accordingly.

# Architecture used
The application follows a component-based architecture, where each component is responsible for a specific part of the UI. The components communicate with each other using services and Input,Output.

# The application also uses the following libraries:

Angular Material for UI components
RxJS for reactive programming
HttpClientModule for sending HTTP requests to the API
Bootstrap for additional styling
The API is built using php. The API follows a RESTful architecture, where each endpoint represents a specific resource.

# Getting Started
To run the application, you will need to have php 7.2+ and Angular CLI installed on your machine.

# Clone the repository.
Navigate to the project folder.
Run npm install to install the project dependencies.
Run ng serve to start the development server.
Navigate to http://localhost:4200 in your browser to view the application.

# Conclusion
This README file provides an overview of the project flow/execution and the architecture used in an Angular 13 application that implements CRUD operations. With this information, you should have a better understanding of how the application works and how to run it on your local machine.