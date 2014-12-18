/*
Copyright (C) 2014 Nicholas Bollweg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

Reveal.SvgFragment = (function(Reveal){
  "use strict";
  var window = this,
    document = window.document,
    proto = window.location.protocol,
    local = proto === "file:",
    cdn = (local ? "http:" : proto) + "//cdnjs.cloudflare.com/ajax/libs/",
    timeline_cdn = cdn + "timelinejs/2.30.1/",
    defaults = {
      jQuery: "js/jquery.min.js", //cdn + "jquery/2.1.1/jquery.min.js",
      createStoryJS: "js/storyjs-embed.js", //timeline_cdn + "js/storyjs-embed.js",
      js: "js/timeline-min.js",//timeline_cdn + "js/timeline-min.js",
      css: "css/timeline.css",//timeline_cdn + "/css/timeline.css",
      width: Reveal.getConfig().width
    },

    $ = function(sel){
        var nodes = document.querySelectorAll(sel),
            len = nodes.length,
            result = [],
            i = 0;
        for(i; i < len ; i++){ result.push(nodes[i]); }
        return result;
    };

  $.data = function(node, key){
    return node.getAttribute("data-" + key);
  };

  // the main function, to be called when `createStoryJS` is available
  function api(){
    var createStoryJS = window.createStoryJS,
      container = $("[data-timeline]"),
      slides = $(".slides");
    container.map(function(node){
        var cfg = {
            // TODO: Support other formats?
            source: $.data(node, "timeline"),
            embed_id: node.id ? node.id : node.id = api.id(),
            width:      $.data(node, "width") || api.cfg("width"),
            height:     $.data(node, "height") || (Reveal.getConfig().height - node.parentNode.clientHeight),
            js: api.cfg("js"),
            css: api.cfg("css"),
            keyboard: false
        };

        createStoryJS(cfg);
    });
    return api;
  }

  api.id = function(){
    return "reveal-timeline-" + (""+ Math.random()).replace(/0\./, "");
  };

  // preflight, call immediately it jquery/createStoryJS is available, otherwise load the script
  api.init = function(){
    var options = Reveal.getConfig().svgFragment || {};
    return !window.jQuery ? api.load(api.cfg("jQuery"), api.init) :
        !window.createStoryJS ? api.load(api.cfg("createStoryJS"), api.init) :
        api();
  };

  // get configuration values (or defaults)
  api.cfg = function(opt){
    var cfg = Reveal.getConfig().svgFragment || {};

    return opt in cfg ? cfg[opt] :
      opt in defaults ? defaults[opt] :
      function(){ throw new Error("Unknown property: "+ opt); };
  };


  // load a script, jacked from search, i think
  api.load = function(url, callback){
    var head = $('head')[0],
      script = document.createElement('script');

    // Wrapper for callback to make sure it only fires once
    var finish = function(){
      if(typeof callback === 'function') {
        callback.call();
        callback = null;
      }
    };

    // IE
    script.onreadystatechange = function() {
      if (this.readyState === 'loaded') {
        finish();
      }
    };
    script.type = 'text/javascript';
    script.src = url;
    script.onload = finish;

    // Normal browsers
    head.appendChild(script);

    return api;
  };


  return api.init();
}).call(this, Reveal);
