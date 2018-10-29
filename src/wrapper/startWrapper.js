// ==UserScript==
// @name Just Another Intel Script Lite
// @namespace http://jleijdekkers.nl
// @author J1pster
// @version 0.5.1.20181029
// @description Does Something
// @updateURL      https://j1pster.github.io/jais/dist/jaisLite.user.js
// @downloadURL    https://j1pster.github.io/jais/dist/jaisLite.user.js
// @include        https://ingress.com/intel*
// @include        http://ingress.com/intel*
// @match          https://ingress.com/intel*
// @match          http://ingress.com/intel*
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @copyright      2018+ JL
// @require http://code.jquery.com/jquery-latest.js
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
