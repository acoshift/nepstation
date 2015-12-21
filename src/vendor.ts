// Polyfills
//import 'es6-shim';
//import 'es6-promise';
// (these modules are what is in 'angular2/bundles/angular2-polyfills' so don't use that here)
//import 'es7-reflect-metadata/dist/browser';
import 'reflect-metadata';
import 'zone.js/lib/browser/zone-microtask';
import 'zone.js/lib/zones/long-stack-trace'; // in Production you may want to remove this module

// Angular 2
import 'angular2/platform/browser';
import 'angular2/platform/common_dom';
import 'angular2/core';
import 'angular2/router';
import 'angular2/http';

// RxJS
import 'rxjs';

// Styles
require('!style!css!semantic-ui-css/semantic.min.css');

// Other vendors
import 'lodash';
import 'moment';
require('script!jquery/dist/jquery.min.js');
require('script!semantic-ui-css/semantic.min.js');
