// ==UserScript==
// @name Just Another Intel Script Lite
// @namespace http://jleijdekkers.nl
// @author J1pster
// @version 0.5.2.20181104
// @description Does Something
// @updateURL      https://j1pster.github.io/jais/dist/jaisLite.user.js
// @downloadURL    https://j1pster.github.io/jais/dist/jaisLite.user.js
// @include        *://*.ingress.com/intel*
// @include        *://*.ingress.com/mission/*
// @include        *://intel.ingress.com/*
// @match          *://*.ingress.com/intel*
// @match          *://*.ingress.com/mission/*
// @match          *://intel.ingress.com/*
// @copyright      2018+ JL
// ==/UserScript==

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};
    // Create own namespace for plugin
    window.plugin.jais = {
        FIELD_SCORE: 750,
        LINK_SCORE: 187,
        RESO_SCORE: 75,
        BUILD_SCORE: 1750,
        MOD_SCORE: 250
    };
