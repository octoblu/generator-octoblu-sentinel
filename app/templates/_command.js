#!/usr/bin/env casperjs

var system  = require('system');
var helpers = require('./helpers');
var Casper  = require('casper');
var casper  = helpers.buildCasper(Casper);

var <%= constantPrefix %>_USERNAME = system.env.<%= constantPrefix %>_USERNAME;
var <%= constantPrefix %>_PASSWORD = system.env.<%= constantPrefix %>_PASSWORD;

if(!<%= constantPrefix %>_USERNAME || !<%= constantPrefix %>_PASSWORD)  {
  console.log('Missing required env: <%= constantPrefix %>_USERNAME or <%= constantPrefix %>_PASSWORD')
  this.exit(1)
}

helpers.thenWithErrors(casper, function(){
  return casper.click('.auth__button--social-button');
})

casper.waitForSelector("#login_form")

helpers.thenWithErrors(casper, function(){
  casper.fillLabels('#login_form', {
    'username': <%= constantPrefix %>_USERNAME,
    'password': <%= constantPrefix %>_PASSWORD
  })
  casper.click("#login")
})

helpers.assertOnOctobluDashboard(casper);

casper.run();
