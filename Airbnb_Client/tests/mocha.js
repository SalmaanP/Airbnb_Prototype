
/**
 * Created by Salmaan on 10/16/2016.
 */

var express = require('express');
var request = require('request');
var assert = require('assert');
var http = require('http');
var mocha = require('mocha');

describe('API tests', function () {


    it('should display profile page', function(done){

        http.get('http://localhost:3000/profile/398-30-8465', function(res){
            assert.equal(200, res.statusCode);
            done();
        });
    });



    it('should display property page', function(done){

        http.get('http://localhost:3000/property?propertyId=5844b06feb037a6060fe1ee7', function(res){
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should display home page', function(done){

        http.get('http://localhost:3000/', function(res){
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should display 404, as property doesnt exist', function(done){

        http.get('http://localhost:3000/property?propertyId=423', function(res){
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should display 404 page', function(done){

        http.get('http://localhost:3000/profile/salmaan', function(res){
            assert.equal(200, res.statusCode);
            done();
        });
    });



});
