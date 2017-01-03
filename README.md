# Airbnb Prototype Application

* This repository contains code for Airbnb Prototype Application. It was part of the course requirements for CMPE273 final project.

# About

* The application is a fully functional prototype of the Airbnb website. A user can sign up, become a host, book properties for rent. User also has the option to bid 
on a property if a host has the option enabled.

* The user can also search for properties in a specific area using the map. Users can also add reviews about the previous trip and the host. Hosts can also add reviews 
about the user.

* The host is also shown several analytics about the performance of his property. Several metrics like user clicks, bookings in last month, trends etc are made 
available for the host.

* A seperate admin panel has also been made for the website administrator. It offers functionalities to verify and add a host/user/property. Admins can also disable 
users or properties.

* Various metrics like number of users, properties, hosts are displayed on the admin panel, and information about them is also displayed.

* The application also has features like dynamic pricing which takes into account the popularity of the property by keeping in account the bookings in the past 2 months. 
It generates a multiplier which is added to the property price.

* The application also has several validations to make sure there are no unexpected inputs by the user.

* The application is also performance tested with more than 10,000 users, 10,000 hosts and 100,000 billing records. It has also been load tested using JMeter 
upto 1000 requests by 1000 concurrent users. It also has unit testing written in Mocha.js . 

# Technologies

> Node.js - Webserver

> MySQL / mongoDB (mongoose) - Database

> rabbitMQ - Messaging Queue

> ELK stack - Host Analysis

> Redis - Cache

> AngularJs - Frontend