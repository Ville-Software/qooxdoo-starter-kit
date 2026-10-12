(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "require": true
      },
      "qx.util.format.DateFormat": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Class.define("qx.log.appender.Formatter", {
    extend: qx.core.Object,
    properties: {
      /** How to format time in an entry; offset since start (backwards compatible) or as actual date/time */
      formatTimeAs: {
        init: "offset",
        check: ["offset", "datetime"]
      }
    },
    members: {
      /**
       * Formats a numeric time offset to 6 characters.
       *
       * @param offset
       *          {Integer} Current offset value
       * @param length
       *          {Integer?6} Refine the length
       * @return {String} Padded string
       */
      formatOffset(offset, length) {
        var str = offset.toString();
        var diff = (length || 6) - str.length;
        var pad = "";
        for (var i = 0; i < diff; i++) {
          pad += "0";
        }
        return pad + str;
      },
      /**
       * Formats the time part of an entry
       *
       * @param entry {Map} the entry to output
       * @return {String} formatted time, as an offset or date time depending on `formatTimeAs` property
       */
      formatEntryTime(entry) {
        if (this.getFormatTimeAs() == "offset") {
          return this.formatOffset(entry.offset, 6);
        }
        if (!qx.log.appender.Formatter.__DATETIME_FORMAT__P_58_0) {
          qx.log.appender.Formatter.__DATETIME_FORMAT__P_58_0 = new qx.util.format.DateFormat("YYYY-MM-dd HH:mm:ss");
        }
        return qx.log.appender.Formatter.__DATETIME_FORMAT__P_58_0.format(entry.time);
      },
      /**
       * Normalises the entry into an object with clazz, object, hash.
       *
       * @param entry {Map} the entry to output
       * @return {Map} result, containing:
       *  clazz {Class?} the class of the object
       *  object {Object?} the object
       *  hash {String?} the hash code
       */
      normalizeEntryClass(entry) {
        var result = {
          clazz: null,
          object: null,
          hash: null
        };
        if (entry.object) {
          result.hash = entry.object;
          if (entry.clazz) {
            result.clazz = entry.clazz;
          } else {
            var obj = entry.win.qx.core.ObjectRegistry.fromHashCode(entry.object, true);
            if (obj) {
              result.clazz = obj.constructor;
              result.object = obj;
            }
          }
        } else if (entry.clazz) {
          result.clazz = entry.clazz;
        }
        return result;
      },
      /**
       * Formats the object part of an entry
       *
       * @param entry {Map} the entry to output
       * @return {String} formatted object, with class and hash code if possible
       */
      formatEntryObjectAndClass(entry) {
        var breakdown = this.normalizeEntryClass(entry);
        var result = "";
        if (breakdown.clazz) {
          result += breakdown.clazz.classname;
        }
        if (breakdown.hash) {
          result += "[" + breakdown.hash + "]";
        }
        result += ":";
        return result;
      },
      /**
       * Formats the items part of an entry
       *
       * @param entry {Map} the entry to output
       * @return {String} formatted items
       */
      formatEntryItems(entry) {
        var output = [];
        var items = entry.items;
        for (var i = 0, il = items.length; i < il; i++) {
          var item = items[i];
          var msg = item.text;
          if (item.trace && item.trace.length > 0) {
            msg += "\n" + item.trace;
          }
          if (msg instanceof Array) {
            var list = [];
            for (var j = 0, jl = msg.length; j < jl; j++) {
              list.push(msg[j].text);
            }
            if (item.type === "map") {
              output.push("{", list.join(", "), "}");
            } else {
              output.push("[", list.join(", "), "]");
            }
          } else {
            output.push(msg);
          }
        }
        return output.join(" ");
      },
      /**
       * Converts a single log entry to plain text
       *
       * @param entry {Map} The entry to process
       * @return {String} the formatted log entry
       */
      toText(entry) {
        var output = this.formatEntryTime(entry) + " " + this.formatEntryObjectAndClass(entry);
        var str = this.formatEntryItems(entry);
        if (str) {
          output += " " + str;
        }
        return output;
      },
      /**
       * Converts a single log entry to an array of plain text.
       *
       * This use of arrays is an outdated performance improvement, and as there is no
       * specification of what is in each of the elements of the array, there is no value
       * in preserving this.  This method is deprecated because it will be removed in 7.0
       * and only toText will remain.  Note that toTextArray is not used anywhere in Qooxdoo.
       *
       * @param entry {Map} The entry to process
       * @return {Array} Argument list ready message array.
       * @deprecated {6.0} See toText instead
       */
      toTextArray(entry) {
        var output = [];
        output.push(this.formatEntryTime(entry));
        output.push(this.formatEntryObjectAndClass(entry));
        output.push(this.formatEntryItems(entry));
        return output;
      },
      /**
       * Converts a single log entry to HTML
       *
       * @signature function(entry)
       * @param entry {Map} The entry to process
       */
      toHtml(entry) {
        var output = [];
        var item, msg, sub, list;
        output.push("<span class='offset'>", this.formatEntryTime(entry), "</span> ");
        var breakdown = this.normalizeEntryClass(entry);
        var result = "";
        if (breakdown.clazz) {
          result += breakdown.clazz.classname;
        }
        if (breakdown.object) {
          output.push("<span class='object' title='Object instance with hash code: " + breakdown.object.toHashCode() + "'>", breakdown.classname, "[", breakdown.object, "]</span>: ");
        } else if (breakdown.hash) {
          output.push("<span class='object' title='Object instance with hash code: " + breakdown.hash + "'>", breakdown.classname, "[", breakdown.hash, "]</span>: ");
        } else if (breakdown.clazz) {
          output.push("<span class='object'>" + breakdown.clazz.classname, "</span>: ");
        }
        var items = entry.items;
        for (var i = 0, il = items.length; i < il; i++) {
          item = items[i];
          msg = item.text;
          if (msg instanceof Array) {
            var list = [];
            for (var j = 0, jl = msg.length; j < jl; j++) {
              sub = msg[j];
              if (typeof sub === "string") {
                list.push("<span>" + qx.log.appender.Formatter.escapeHTML(sub) + "</span>");
              } else if (sub.key) {
                list.push("<span class='type-key'>" + sub.key + "</span>:<span class='type-" + sub.type + "'>" + qx.log.appender.Formatter.escapeHTML(sub.text) + "</span>");
              } else {
                list.push("<span class='type-" + sub.type + "'>" + qx.log.appender.Formatter.escapeHTML(sub.text) + "</span>");
              }
            }
            output.push("<span class='type-" + item.type + "'>");
            if (item.type === "map") {
              output.push("{", list.join(", "), "}");
            } else {
              output.push("[", list.join(", "), "]");
            }
            output.push("</span>");
          } else {
            output.push("<span class='type-" + item.type + "'>" + qx.log.appender.Formatter.escapeHTML(msg) + "</span> ");
          }
        }
        var wrapper = document.createElement("DIV");
        wrapper.innerHTML = output.join("");
        wrapper.className = "level-" + entry.level;
        return wrapper;
      }
    },
    statics: {
      /** @type {qx.util.format.DateFormat} format for datetimes */
      __DATETIME_FORMAT__P_58_0: null,
      /** @type {qx.log.appender.Formatter} the default instance */
      __defaultFormatter__P_58_1: null,
      /**
       * Returns the default formatter
       *
       * @return {qx.log.appender.Formatter}
       */
      getFormatter() {
        if (!qx.log.appender.Formatter.__defaultFormatter__P_58_1) {
          qx.log.appender.Formatter.__defaultFormatter__P_58_1 = new qx.log.appender.Formatter();
        }
        return qx.log.appender.Formatter.__defaultFormatter__P_58_1;
      },
      /**
       * Sets the default formatter
       *
       * @param instance {qx.log.appender.Formatter}
       */
      setFormatter(instance) {
        qx.log.appender.Formatter.__defaultFormatter__P_58_1 = instance;
      },
      /**
       * Escapes the HTML in the given value
       *
       * @param value
       *          {String} value to escape
       * @return {String} escaped value
       */
      escapeHTML(value) {
        return String(value).replace(/[<>&"']/g, qx.log.appender.Formatter.__escapeHTMLReplace__P_58_2);
      },
      /**
       * Internal replacement helper for HTML escape.
       *
       * @param ch
       *          {String} Single item to replace.
       * @return {String} Replaced item
       */
      __escapeHTMLReplace__P_58_2(ch) {
        var map = {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          "'": "&#39;",
          '"': "&quot;"
        };
        return map[ch] || "?";
      }
    }
  });
  qx.log.appender.Formatter.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["html.webworker", "html.filereader", "html.geolocation", "html.audio", "html.audio.ogg", "html.audio.mp3", "html.audio.wav", "html.audio.au", "html.audio.aif", "html.video", "html.video.ogg", "html.video.h264", "html.video.webm", "html.storage.local", "html.storage.session", "html.storage.userdata", "html.classlist", "html.xpath", "html.xul", "html.canvas", "html.svg", "html.vml", "html.dataset", "html.element.contains", "html.element.compareDocumentPosition", "html.element.textcontent", "html.console", "html.image.naturaldimensions", "html.history.state", "html.selection", "html.node.isequalnode", "html.fullscreen"],
      "required": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * Internal class which contains the checks used by {@link qx.core.Environment}.
   * All checks in here are marked as internal which means you should never use
   * them directly.
   *
   * This class should contain all checks about HTML.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.Html", {
    statics: {
      /**
       * Whether the client supports Web Workers.
       *
       * @internal
       * @return {Boolean} <code>true</code> if webworkers are supported
       */
      getWebWorker() {
        return window.Worker != null;
      },
      /**
       * Whether the client supports File Readers
       *
       * @internal
       * @return {Boolean} <code>true</code> if FileReaders are supported
       */
      getFileReader() {
        return window.FileReader != null;
      },
      /**
       * Whether the client supports Geo Location.
       *
       * @internal
       * @return {Boolean} <code>true</code> if geolocation supported
       */
      getGeoLocation() {
        return "geolocation" in navigator;
      },
      /**
       * Whether the client supports audio.
       *
       * @internal
       * @return {Boolean} <code>true</code> if audio is supported
       */
      getAudio() {
        return !!document.createElement("audio").canPlayType;
      },
      /**
       * Whether the client can play ogg audio format.
       *
       * @internal
       * @return {String} "" or "maybe" or "probably"
       */
      getAudioOgg() {
        if (!qx.bom.client.Html.getAudio()) {
          return "";
        }
        var a = document.createElement("audio");
        return a.canPlayType("audio/ogg");
      },
      /**
       * Whether the client can play mp3 audio format.
       *
       * @internal
       * @return {String} "" or "maybe" or "probably"
       */
      getAudioMp3() {
        if (!qx.bom.client.Html.getAudio()) {
          return "";
        }
        var a = document.createElement("audio");
        return a.canPlayType("audio/mpeg");
      },
      /**
       * Whether the client can play wave audio wave format.
       *
       * @internal
       * @return {String} "" or "maybe" or "probably"
       */
      getAudioWav() {
        if (!qx.bom.client.Html.getAudio()) {
          return "";
        }
        var a = document.createElement("audio");
        return a.canPlayType("audio/x-wav");
      },
      /**
       * Whether the client can play au audio format.
       *
       * @internal
       * @return {String} "" or "maybe" or "probably"
       */
      getAudioAu() {
        if (!qx.bom.client.Html.getAudio()) {
          return "";
        }
        var a = document.createElement("audio");
        return a.canPlayType("audio/basic");
      },
      /**
       * Whether the client can play aif audio format.
       *
       * @internal
       * @return {String} "" or "maybe" or "probably"
       */
      getAudioAif() {
        if (!qx.bom.client.Html.getAudio()) {
          return "";
        }
        var a = document.createElement("audio");
        return a.canPlayType("audio/x-aiff");
      },
      /**
       * Whether the client supports video.
       *
       * @internal
       * @return {Boolean} <code>true</code> if video is supported
       */
      getVideo() {
        return !!document.createElement("video").canPlayType;
      },
      /**
       * Whether the client supports ogg video.
       *
       * @internal
       * @return {String} "" or "maybe" or "probably"
       */
      getVideoOgg() {
        if (!qx.bom.client.Html.getVideo()) {
          return "";
        }
        var v = document.createElement("video");
        return v.canPlayType('video/ogg; codecs="theora, vorbis"');
      },
      /**
       * Whether the client supports mp4 video.
       *
       * @internal
       * @return {String} "" or "maybe" or "probably"
       */
      getVideoH264() {
        if (!qx.bom.client.Html.getVideo()) {
          return "";
        }
        var v = document.createElement("video");
        return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
      },
      /**
       * Whether the client supports webm video.
       *
       * @internal
       * @return {String} "" or "maybe" or "probably"
       */
      getVideoWebm() {
        if (!qx.bom.client.Html.getVideo()) {
          return "";
        }
        var v = document.createElement("video");
        return v.canPlayType('video/webm; codecs="vp8, vorbis"');
      },
      /**
       * Whether the client supports local storage.
       *
       * @internal
       * @return {Boolean} <code>true</code> if local storage is supported
       */
      getLocalStorage() {
        try {
          // write once to make sure to catch safari's private mode [BUG #7718]
          window.localStorage.setItem("$qx_check", "test");
          window.localStorage.removeItem("$qx_check");
          return true;
        } catch (exc) {
          // Firefox Bug: localStorage doesn't work in file:/// documents
          // see https://bugzilla.mozilla.org/show_bug.cgi?id=507361
          return false;
        }
      },
      /**
       * Whether the client supports session storage.
       *
       * @internal
       * @return {Boolean} <code>true</code> if session storage is supported
       */
      getSessionStorage() {
        try {
          // write once to make sure to catch safari's private mode [BUG #7718]
          window.sessionStorage.setItem("$qx_check", "test");
          window.sessionStorage.removeItem("$qx_check");
          return true;
        } catch (exc) {
          // Firefox Bug: Local execution of window.sessionStorage throws error
          // see https://bugzilla.mozilla.org/show_bug.cgi?id=357323
          return false;
        }
      },
      /**
       * Whether the client supports user data to persist data. This is only
       * relevant for IE < 8.
       *
       * @internal
       * @return {Boolean} <code>true</code> if the user data is supported.
       */
      getUserDataStorage() {
        var el = document.createElement("div");
        el.style["display"] = "none";
        document.getElementsByTagName("head")[0].appendChild(el);
        var supported = false;
        try {
          el.addBehavior("#default#userdata");
          el.load("qxtest");
          supported = true;
        } catch (e) {}
        document.getElementsByTagName("head")[0].removeChild(el);
        return supported;
      },
      /**
       * Whether the browser supports CSS class lists.
       * https://developer.mozilla.org/en-US/docs/DOM/element.classList
       *
       * @internal
       * @return {Boolean} <code>true</code> if class list is supported.
       */
      getClassList() {
        return !!(document.documentElement.classList && qx.Bootstrap.getClass(document.documentElement.classList) === "DOMTokenList");
      },
      /**
       * Checks if XPath could be used.
       *
       * @internal
       * @return {Boolean} <code>true</code> if xpath is supported.
       */
      getXPath() {
        return !!document.evaluate;
      },
      /**
       * Checks if XUL could be used.
       *
       * @internal
       * @return {Boolean} <code>true</code> if XUL is supported.
       */
      getXul() {
        try {
          document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "label");
          return true;
        } catch (e) {
          return false;
        }
      },
      /**
       * Checks if SVG could be used
       *
       * @internal
       * @return {Boolean} <code>true</code> if SVG is supported.
       */
      getSvg() {
        return document.implementation && document.implementation.hasFeature && (document.implementation.hasFeature("org.w3c.dom.svg", "1.0") || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
      },
      /**
       * Checks if VML is supported
       *
       * @internal
       * @return {Boolean} <code>true</code> if VML is supported.
       */
      getVml() {
        var el = document.createElement("div");
        document.body.appendChild(el);
        el.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
        el.firstChild.style.behavior = "url(#default#VML)";
        var hasVml = typeof el.firstChild.adj == "object";
        document.body.removeChild(el);
        return hasVml;
      },
      /**
       * Checks if canvas could be used
       *
       * @internal
       * @return {Boolean} <code>true</code> if canvas is supported.
       */
      getCanvas() {
        return !!window.CanvasRenderingContext2D;
      },
      /**
       * Asynchronous check for using data urls.
       *
       * @internal
       * @param callback {Function} The function which should be executed as
       *   soon as the check is done.
       *
       * @ignore(Image)
       */
      getDataUrl(callback) {
        var data = new Image();
        data.onload = data.onerror = function () {
          // wrap that into a timeout because IE might execute it synchronously
          window.setTimeout(function () {
            callback.call(null, data.width == 1 && data.height == 1);
          }, 0);
        };
        data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      },
      /**
       * Checks if dataset could be used
       *
       * @internal
       * @return {Boolean} <code>true</code> if dataset is supported.
       */
      getDataset() {
        return !!document.documentElement.dataset;
      },
      /**
       * Check for element.contains
       *
       * @internal
       * @return {Boolean} <code>true</code> if element.contains is supported
       */
      getContains() {
        // "object" in IE6/7/8, "function" in IE9
        return typeof document.documentElement.contains !== "undefined";
      },
      /**
       * Check for element.compareDocumentPosition
       *
       * @internal
       * @return {Boolean} <code>true</code> if element.compareDocumentPosition is supported
       */
      getCompareDocumentPosition() {
        return typeof document.documentElement.compareDocumentPosition === "function";
      },
      /**
       * Check for element.textContent. Legacy IEs do not support this, use
       * innerText instead.
       *
       * @internal
       * @return {Boolean} <code>true</code> if textContent is supported
       */
      getTextContent() {
        var el = document.createElement("span");
        return typeof el.textContent !== "undefined";
      },
      /**
       * Whether the client supports the fullscreen API.
       *
       * @internal
       * @return {Boolean} <code>true</code> if fullscreen is supported
       */
      getFullScreen() {
        return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || false;
      },
      /**
       * Check for a console object.
       *
       * @internal
       * @return {Boolean} <code>true</code> if a console is available.
       */
      getConsole() {
        return typeof window.console !== "undefined";
      },
      /**
       * Check for the <code>naturalHeight</code> and <code>naturalWidth</code>
       * image element attributes.
       *
       * @internal
       * @return {Boolean} <code>true</code> if both attributes are supported
       */
      getNaturalDimensions() {
        var img = document.createElement("img");
        return typeof img.naturalHeight === "number" && typeof img.naturalWidth === "number";
      },
      /**
       * Check for HTML5 history manipulation support.
       * @internal
       * @return {Boolean} <code>true</code> if the HTML5 history API is supported
       */

      getHistoryState() {
        return typeof window.onpopstate !== "undefined" && typeof window.history.replaceState !== "undefined" && typeof window.history.pushState !== "undefined";
      },
      /**
       * Returns the name of the native object/function used to access the
       * document's text selection.
       *
       * @return {String|null} <code>getSelection</code> if the standard window.getSelection
       * function is available; <code>selection</code> if the MS-proprietary
       * document.selection object is available; <code>null</code> if no known
       * text selection API is available.
       */
      getSelection() {
        if (typeof window.getSelection === "function") {
          return "getSelection";
        }
        if (typeof document.selection === "object") {
          return "selection";
        }
        return null;
      },
      /**
       * Check for the isEqualNode DOM method.
       *
       * @return {Boolean} <code>true</code> if isEqualNode is supported by DOM nodes
       */
      getIsEqualNode() {
        return typeof document.documentElement.isEqualNode === "function";
      }
    },
    defer(statics) {
      qx.core.Environment.add("html.webworker", statics.getWebWorker);
      qx.core.Environment.add("html.filereader", statics.getFileReader);
      qx.core.Environment.add("html.geolocation", statics.getGeoLocation);
      qx.core.Environment.add("html.audio", statics.getAudio);
      qx.core.Environment.add("html.audio.ogg", statics.getAudioOgg);
      qx.core.Environment.add("html.audio.mp3", statics.getAudioMp3);
      qx.core.Environment.add("html.audio.wav", statics.getAudioWav);
      qx.core.Environment.add("html.audio.au", statics.getAudioAu);
      qx.core.Environment.add("html.audio.aif", statics.getAudioAif);
      qx.core.Environment.add("html.video", statics.getVideo);
      qx.core.Environment.add("html.video.ogg", statics.getVideoOgg);
      qx.core.Environment.add("html.video.h264", statics.getVideoH264);
      qx.core.Environment.add("html.video.webm", statics.getVideoWebm);
      qx.core.Environment.add("html.storage.local", statics.getLocalStorage);
      qx.core.Environment.add("html.storage.session", statics.getSessionStorage);
      qx.core.Environment.add("html.storage.userdata", statics.getUserDataStorage);
      qx.core.Environment.add("html.classlist", statics.getClassList);
      qx.core.Environment.add("html.xpath", statics.getXPath);
      qx.core.Environment.add("html.xul", statics.getXul);
      qx.core.Environment.add("html.canvas", statics.getCanvas);
      qx.core.Environment.add("html.svg", statics.getSvg);
      qx.core.Environment.add("html.vml", statics.getVml);
      qx.core.Environment.add("html.dataset", statics.getDataset);
      qx.core.Environment.addAsync("html.dataurl", statics.getDataUrl);
      qx.core.Environment.add("html.element.contains", statics.getContains);
      qx.core.Environment.add("html.element.compareDocumentPosition", statics.getCompareDocumentPosition);
      qx.core.Environment.add("html.element.textcontent", statics.getTextContent);
      qx.core.Environment.add("html.console", statics.getConsole);
      qx.core.Environment.add("html.image.naturaldimensions", statics.getNaturalDimensions);
      qx.core.Environment.add("html.history.state", statics.getHistoryState);
      qx.core.Environment.add("html.selection", statics.getSelection);
      qx.core.Environment.add("html.node.isequalnode", statics.getIsEqualNode);
      qx.core.Environment.add("html.fullscreen", statics.getFullScreen);
    }
  });
  qx.bom.client.Html.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.log.appender.Formatter": {
        "require": true,
        "defer": "runtime"
      },
      "qx.bom.client.Html": {
        "require": true,
        "defer": "runtime"
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.log.Logger": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "html.console": {
          "className": "qx.bom.client.Html"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * Processes the incoming log entry and displays it by means of the native
   * logging capabilities of the client.
   *
   * Supported browsers:
   * * Firefox <4 using FireBug (if available).
   * * Firefox >=4 using the Web Console.
   * * WebKit browsers using the Web Inspector/Developer Tools.
   * * Internet Explorer 8+ using the F12 Developer Tools.
   * * Opera >=10.60 using either the Error Console or Dragonfly
   *
   * Currently unsupported browsers:
   * * Opera <10.60
   *
   * @require(qx.log.appender.Formatter)
   * @require(qx.bom.client.Html)
   */
  qx.Bootstrap.define("qx.log.appender.Native", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Processes a single log entry
       *
       * @param entry {Map} The entry to process
       */
      process(entry) {
        if (qx.core.Environment.get("html.console")) {
          // Firefox 4's Web Console doesn't support "debug"
          var level = console[entry.level] ? entry.level : "log";
          if (console[level]) {
            var formatter = qx.log.appender.Formatter.getFormatter();
            var args = formatter.toText(entry);
            console[level](args);
          }
        }
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      qx.log.Logger.register(statics);
    }
  });
  qx.log.appender.Native.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.UserAction": {
        "require": true,
        "defer": "runtime"
      },
      "qx.core.Environment": {
        "defer": "load",
        "construct": true,
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.event.IEventHandler": {
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.bom.client.Engine": {
        "construct": true,
        "defer": "load",
        "require": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.event.type.KeyInput": {},
      "qx.event.Utils": {},
      "qx.event.type.Data": {},
      "qx.event.type.KeySequence": {},
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.event.util.Keyboard": {},
      "qx.event.handler.Focus": {},
      "qx.lang.Function": {},
      "qx.bom.Event": {},
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.ObjectRegistry": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "construct": true,
          "className": "qx.bom.client.Engine",
          "load": true,
          "defer": true
        },
        "browser.version": {
          "className": "qx.bom.client.Browser",
          "load": true
        },
        "engine.version": {
          "className": "qx.bom.client.Engine"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This class provides unified key event handler for Internet Explorer,
   * Firefox, Opera and Safari.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * @require(qx.event.handler.UserAction)
   */
  qx.Class.define("qx.event.handler.Keyboard", {
    extend: qx.core.Object,
    implement: [qx.event.IEventHandler, qx.core.IDisposable],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Create a new instance
     *
     * @param manager {qx.event.Manager} Event manager for the window to use
     */
    construct(manager) {
      qx.core.Object.constructor.call(this);

      // Define shorthands
      this.__manager__P_61_0 = manager;
      this.__window__P_61_1 = manager.getWindow();

      // Gecko ignores key events when not explicitly clicked in the document.
      if (qx.core.Environment.get("engine.name") == "gecko") {
        this.__root__P_61_2 = this.__window__P_61_1;
      } else {
        this.__root__P_61_2 = this.__window__P_61_1.document.documentElement;
      }

      // Internal sequence cache
      this.__lastUpDownType__P_61_3 = {};

      // Initialize observer
      this._initKeyObserver();
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Integer} Priority of this handler */
      PRIORITY: qx.event.Registration.PRIORITY_NORMAL,
      /** @type {Map} Supported event types */
      SUPPORTED_TYPES: {
        keyup: 1,
        keydown: 1,
        keypress: 1,
        keyinput: 1
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __onKeyUpDownWrapper__P_61_4: null,
      __manager__P_61_0: null,
      __window__P_61_1: null,
      __root__P_61_2: null,
      __lastUpDownType__P_61_3: null,
      __lastKeyCode__P_61_5: null,
      __inputListeners__P_61_6: null,
      __onKeyPressWrapper__P_61_7: null,
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER INTERFACE
      ---------------------------------------------------------------------------
      */

      // interface implementation
      canHandleEvent(target, type) {},
      // interface implementation
      registerEvent(target, type, capture) {
        // Nothing needs to be done here
      },
      // interface implementation
      unregisterEvent(target, type, capture) {
        // Nothing needs to be done here
      },
      /*
      ---------------------------------------------------------------------------
        HELPER
      ---------------------------------------------------------------------------
      */

      /**
       * Fire a key input event with the given parameters
       *
       * @param domEvent {Event} DOM event
       * @param charCode {Integer} character code
       * @return {qx.Promise?} a promise if the event handlers created one
       */
      _fireInputEvent(domEvent, charCode) {
        var target = this.__getEventTarget__P_61_8();
        var tracker = {};
        var self = this;

        // Only fire when target is defined and visible
        if (target && target.offsetWidth != 0) {
          var event = qx.event.Registration.createEvent("keyinput", qx.event.type.KeyInput, [domEvent, target, charCode]);
          qx.event.Utils.then(tracker, function () {
            self.__manager__P_61_0.dispatchEvent(target, event);
          });
        }

        // Fire user action event
        // Needs to check if still alive first
        if (this.__window__P_61_1) {
          var self = this;
          qx.event.Utils.then(tracker, function () {
            return qx.event.Registration.fireEvent(self.__window__P_61_1, "useraction", qx.event.type.Data, ["keyinput"]);
          });
        }
        return tracker.promise;
      },
      /**
       * Fire a key up/down/press event with the given parameters
       *
       * @param domEvent {Event} DOM event
       * @param type {String} type og the event
       * @param keyIdentifier {String} key identifier
       * @return {qx.Promise?} a promise, if any of the event handlers returned a promise
       */
      _fireSequenceEvent(domEvent, type, keyIdentifier) {
        var target = this.__getEventTarget__P_61_8();
        var keyCode = domEvent.keyCode;
        var tracker = {};
        var self = this;

        // Fire key event
        var event = qx.event.Registration.createEvent(type, qx.event.type.KeySequence, [domEvent, target, keyIdentifier]);
        qx.event.Utils.then(tracker, function () {
          return self.__manager__P_61_0.dispatchEvent(target, event);
        });

        // IE and Safari suppress a "keypress" event if the "keydown" event's
        // default action was prevented. In this case we emulate the "keypress"
        //
        // FireFox suppresses "keypress" when "keydown" default action is prevented.
        // from version 29: https://bugzilla.mozilla.org/show_bug.cgi?id=935876.
        if (event.getDefaultPrevented() && type == "keydown") {
          if (qx.core.Environment.get("engine.name") == "mshtml" || qx.core.Environment.get("engine.name") == "webkit" || qx.core.Environment.get("engine.name") == "gecko" && qx.core.Environment.get("browser.version") >= 29) {
            // some key press events are already emulated. Ignore these events.
            if (!qx.event.util.Keyboard.isNonPrintableKeyCode(keyCode) && !this._emulateKeyPress[keyCode]) {
              qx.event.Utils.then(tracker, function () {
                return self._fireSequenceEvent(domEvent, "keypress", keyIdentifier);
              });
            }
          }
        }

        // Fire user action event
        // Needs to check if still alive first
        if (this.__window__P_61_1) {
          qx.event.Utils.then(tracker, function () {
            return qx.event.Registration.fireEvent(self.__window__P_61_1, "useraction", qx.event.type.Data, [type]);
          });
        }
        return tracker.promise;
      },
      /**
       * Get the target element for key events
       *
       * @return {Element} the event target element
       */
      __getEventTarget__P_61_8() {
        var focusHandler = this.__manager__P_61_0.getHandler(qx.event.handler.Focus);
        var target = focusHandler.getActive();

        // Fallback to focused element when active is null or invisible
        if (!target || target.offsetWidth == 0) {
          target = focusHandler.getFocus();
        }

        // Fallback to body when focused is null or invisible
        if (!target || target.offsetWidth == 0) {
          target = this.__manager__P_61_0.getWindow().document.body;
        }
        return target;
      },
      /*
      ---------------------------------------------------------------------------
        OBSERVER INIT/STOP
      ---------------------------------------------------------------------------
      */

      /**
       * Initializes the native key event listeners.
       *
       * @signature function()
       */
      _initKeyObserver() {
        this.__onKeyUpDownWrapper__P_61_4 = qx.lang.Function.listener(this.__onKeyUpDown__P_61_9, this);
        this.__onKeyPressWrapper__P_61_7 = qx.lang.Function.listener(this.__onKeyPress__P_61_10, this);
        var Event = qx.bom.Event;
        Event.addNativeListener(this.__root__P_61_2, "keyup", this.__onKeyUpDownWrapper__P_61_4);
        Event.addNativeListener(this.__root__P_61_2, "keydown", this.__onKeyUpDownWrapper__P_61_4);
        Event.addNativeListener(this.__root__P_61_2, "keypress", this.__onKeyPressWrapper__P_61_7);
      },
      /**
       * Stops the native key event listeners.
       *
       * @signature function()
       */
      _stopKeyObserver() {
        var Event = qx.bom.Event;
        Event.removeNativeListener(this.__root__P_61_2, "keyup", this.__onKeyUpDownWrapper__P_61_4);
        Event.removeNativeListener(this.__root__P_61_2, "keydown", this.__onKeyUpDownWrapper__P_61_4);
        Event.removeNativeListener(this.__root__P_61_2, "keypress", this.__onKeyPressWrapper__P_61_7);
        for (var key in this.__inputListeners__P_61_6 || {}) {
          var listener = this.__inputListeners__P_61_6[key];
          Event.removeNativeListener(listener.target, "keypress", listener.callback);
        }
        delete this.__inputListeners__P_61_6;
      },
      /*
      ---------------------------------------------------------------------------
        NATIVE EVENT OBSERVERS
      ---------------------------------------------------------------------------
      */

      /**
       * Low level handler for "keyup" and "keydown" events
       *
       * @internal
       * @signature function(domEvent)
       * @param domEvent {Event} DOM event object
       */
      __onKeyUpDown__P_61_9: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        "gecko|webkit|mshtml"(domEvent) {
          var keyCode = 0;
          var charCode = 0;
          var type = domEvent.type;
          keyCode = domEvent.keyCode;
          var tracker = {};
          var self = this;
          qx.event.Utils.track(tracker, this._idealKeyHandler(keyCode, charCode, type, domEvent));

          // On non print-able character be sure to add a keypress event
          if (type == "keydown") {
            /*
             * We need an artificial keypress event for every keydown event.
             * Newer browsers do not fire keypress for a regular charachter key (e.g when typing 'a')
             * if it was typed with the CTRL, ALT or META Key pressed during typing, like
             * doing it when typing the combination CTRL+A
             */
            var isModifierDown = domEvent.ctrlKey || domEvent.altKey || domEvent.metaKey;

            // non-printable, backspace, tab or the modfier keys are down
            if (qx.event.util.Keyboard.isNonPrintableKeyCode(keyCode) || this._emulateKeyPress[keyCode] || isModifierDown) {
              qx.event.Utils.then(tracker, function () {
                return self._idealKeyHandler(keyCode, charCode, "keypress", domEvent);
              });
            }
          }

          // Store last type
          this.__lastUpDownType__P_61_3[keyCode] = type;
          return tracker.promise;
        },
        opera(domEvent) {
          this.__lastKeyCode__P_61_5 = domEvent.keyCode;
          return this._idealKeyHandler(domEvent.keyCode, 0, domEvent.type, domEvent);
        }
      })),
      /**
       * some keys like "up", "down", "pageup", "pagedown" do not bubble a
       * "keypress" event in Firefox. To work around this bug we attach keypress
       * listeners directly to the input events.
       *
       * https://bugzilla.mozilla.org/show_bug.cgi?id=467513
       *
       * @signature function(target, type, keyCode)
       * @param target {Element} The event target
       * @param type {String} The event type
       * @param keyCode {Integer} the key code
       */
      __firefoxInputFix__P_61_11: qx.core.Environment.select("engine.name", {
        gecko(target, type, keyCode) {
          if (type === "keydown" && (keyCode == 33 || keyCode == 34 || keyCode == 38 || keyCode == 40) && target.type == "text" && target.tagName.toLowerCase() === "input" && target.getAttribute("autoComplete") !== "off") {
            if (!this.__inputListeners__P_61_6) {
              this.__inputListeners__P_61_6 = {};
            }
            var hash = qx.core.ObjectRegistry.toHashCode(target);
            if (this.__inputListeners__P_61_6[hash]) {
              return;
            }
            var self = this;
            this.__inputListeners__P_61_6[hash] = {
              target: target,
              callback(domEvent) {
                qx.bom.Event.stopPropagation(domEvent);
                self.__onKeyPress__P_61_10(domEvent);
              }
            };
            var listener = qx.event.GlobalError.observeMethod(this.__inputListeners__P_61_6[hash].callback);
            qx.bom.Event.addNativeListener(target, "keypress", listener);
          }
        },
        default: null
      }),
      /**
       * Low level key press handler
       *
       * @signature function(domEvent)
       * @param domEvent {Event} DOM event object
       */
      __onKeyPress__P_61_10: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        mshtml(domEvent) {
          domEvent = window.event || domEvent;
          if (this._charCode2KeyCode[domEvent.keyCode]) {
            return this._idealKeyHandler(this._charCode2KeyCode[domEvent.keyCode], 0, domEvent.type, domEvent);
          } else {
            return this._idealKeyHandler(0, domEvent.keyCode, domEvent.type, domEvent);
          }
        },
        gecko(domEvent) {
          if (qx.core.Environment.get("engine.version") < 66) {
            var charCode = domEvent.charCode;
            var type = domEvent.type;
            return this._idealKeyHandler(domEvent.keyCode, charCode, type, domEvent);
          } else {
            if (this._charCode2KeyCode[domEvent.keyCode]) {
              return this._idealKeyHandler(this._charCode2KeyCode[domEvent.keyCode], 0, domEvent.type, domEvent);
            } else {
              return this._idealKeyHandler(0, domEvent.keyCode, domEvent.type, domEvent);
            }
          }
        },
        webkit(domEvent) {
          if (this._charCode2KeyCode[domEvent.keyCode]) {
            return this._idealKeyHandler(this._charCode2KeyCode[domEvent.keyCode], 0, domEvent.type, domEvent);
          } else {
            return this._idealKeyHandler(0, domEvent.keyCode, domEvent.type, domEvent);
          }
        },
        opera(domEvent) {
          var keyCode = domEvent.keyCode;
          var type = domEvent.type;

          // Some keys are identified differently for key up/down and keypress
          // (e.g. "v" gets identified as "F7").
          // So we store the last key up/down keycode and compare it to the
          // current keycode.
          // See http://bugzilla.qooxdoo.org/show_bug.cgi?id=603
          if (keyCode != this.__lastKeyCode__P_61_5) {
            return this._idealKeyHandler(0, this.__lastKeyCode__P_61_5, type, domEvent);
          } else {
            if (qx.event.util.Keyboard.keyCodeToIdentifierMap[domEvent.keyCode]) {
              return this._idealKeyHandler(domEvent.keyCode, 0, domEvent.type, domEvent);
            } else {
              return this._idealKeyHandler(0, domEvent.keyCode, domEvent.type, domEvent);
            }
          }
        }
      })),
      /*
      ---------------------------------------------------------------------------
        IDEAL KEY HANDLER
      ---------------------------------------------------------------------------
      */

      /**
       * Key handler for an idealized browser.
       * Runs after the browser specific key handlers have normalized the key events.
       *
       * @param keyCode {String} keyboard code
       * @param charCode {String} character code
       * @param eventType {String} type of the event (keydown, keypress, keyup)
       * @param domEvent {Element} DomEvent
       * @return {qx.Promise?} a promise, if an event handler created one
       */
      _idealKeyHandler(keyCode, charCode, eventType, domEvent) {
        var keyIdentifier;

        // Use: keyCode
        if (keyCode || !keyCode && !charCode) {
          keyIdentifier = qx.event.util.Keyboard.keyCodeToIdentifier(keyCode);
          return this._fireSequenceEvent(domEvent, eventType, keyIdentifier);
        }

        // Use: charCode
        else {
          keyIdentifier = qx.event.util.Keyboard.charCodeToIdentifier(charCode);
          var tracker = {};
          var self = this;
          qx.event.Utils.track(tracker, this._fireSequenceEvent(domEvent, "keypress", keyIdentifier));
          return qx.event.Utils.then(tracker, function () {
            return self._fireInputEvent(domEvent, charCode);
          });
        }
      },
      /*
      ---------------------------------------------------------------------------
        KEY MAPS
      ---------------------------------------------------------------------------
      */

      /**
       * @type {Map} maps the charcodes of special keys for key press emulation
       *
       * @lint ignoreReferenceField(_emulateKeyPress)
       */
      _emulateKeyPress: qx.core.Environment.select("engine.name", {
        mshtml: {
          8: true,
          9: true
        },
        webkit: {
          8: true,
          9: true,
          27: true
        },
        gecko: qx.core.Environment.get("browser.version") >= 65 ? {
          8: true,
          9: true,
          27: true
        } : {},
        default: {}
      }),
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * converts a key identifier back to a keycode
       *
       * @param keyIdentifier {String} The key identifier to convert
       * @return {Integer} keyboard code
       */
      _identifierToKeyCode(keyIdentifier) {
        return qx.event.util.Keyboard.identifierToKeyCodeMap[keyIdentifier] || keyIdentifier.charCodeAt(0);
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._stopKeyObserver();
      this.__lastKeyCode__P_61_5 = this.__manager__P_61_0 = this.__window__P_61_1 = this.__root__P_61_2 = this.__lastUpDownType__P_61_3 = null;
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics, members) {
      // register at the event handler
      qx.event.Registration.addHandler(statics);
      if (qx.core.Environment.get("engine.name") !== "opera") {
        members._charCode2KeyCode = {
          13: 13,
          27: 27
        };
      }
    }
  });
  qx.event.handler.Keyboard.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "require": true
      },
      "qx.event.IEventDispatcher": {
        "require": true
      },
      "qx.event.Utils": {},
      "qx.event.type.Event": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * Event dispatcher for all bubbling events.
   */
  qx.Class.define("qx.event.dispatch.AbstractBubbling", {
    extend: qx.core.Object,
    implement: qx.event.IEventDispatcher,
    type: "abstract",
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Create a new instance
     *
     * @param manager {qx.event.Manager} Event manager for the window to use
     */
    construct(manager) {
      this._manager = manager;
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        EVENT DISPATCHER HELPER
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the parent of the given target
       *
       * @abstract
       * @param target {var} The target which parent should be found
       * @return {var} The parent of the given target
       */
      _getParent(target) {
        throw new Error("Missing implementation");
      },
      /*
      ---------------------------------------------------------------------------
        EVENT DISPATCHER INTERFACE
      ---------------------------------------------------------------------------
      */

      // interface implementation
      canDispatchEvent(target, event, type) {
        return event.getBubbles();
      },
      // interface implementation
      dispatchEvent(target, event, type) {
        var parent = target;
        var manager = this._manager;
        var captureListeners, bubbleListeners;
        var context;

        // Cache list for AT_TARGET
        var targetList = [];
        captureListeners = manager.getListeners(target, type, true);
        bubbleListeners = manager.getListeners(target, type, false);
        if (captureListeners) {
          targetList.push(captureListeners);
        }
        if (bubbleListeners) {
          targetList.push(bubbleListeners);
        }

        // Cache list for CAPTURING_PHASE and BUBBLING_PHASE
        var parent = this._getParent(target);
        var bubbleList = [];
        var bubbleTargets = [];
        var captureList = [];
        var captureTargets = [];

        // Walk up the tree and look for event listeners
        while (parent != null) {
          // Attention:
          // We do not follow the DOM2 events specifications here
          // http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-flow-capture
          // Opera is the only browser which conforms to the spec.
          // Safari and Mozilla do it the same way like qooxdoo does
          // and add the capture events of the target to the execution list.
          captureListeners = manager.getListeners(parent, type, true);
          if (captureListeners) {
            captureList.push(captureListeners);
            captureTargets.push(parent);
          }
          bubbleListeners = manager.getListeners(parent, type, false);
          if (bubbleListeners) {
            bubbleList.push(bubbleListeners);
            bubbleTargets.push(parent);
          }
          parent = this._getParent(parent);
        }
        var self = this;
        var tracker = {};
        var __TRACE_LOGGING__P_122_0 = false; //(event._type == "pointerup" && event._target.className === "qx-toolbar-button-checked");
        var __TRACE__P_122_1 = function () {};
        if (__TRACE_LOGGING__P_122_0) {
          var serial = (this.SERIAL || 0) + 1;
          this.SERIAL = serial + 1;
          __TRACE__P_122_1 = function () {
            var args = [].slice.apply(arguments);
            args.unshift("serial #" + serial + ": ");
            console.log.apply(this, args);
          };
        }
        qx.event.Utils.catch(tracker, function () {
          // This function must exist to suppress "unhandled rejection" messages from promises
          __TRACE__P_122_1("Aborted serial=" + serial + ", type=" + event.getType());
        });

        // capturing phase
        qx.event.Utils.then(tracker, function () {
          // loop through the hierarchy in reverted order (from root)
          event.setEventPhase(qx.event.type.Event.CAPTURING_PHASE);
          __TRACE__P_122_1("captureList=" + captureList.length);
          return qx.event.Utils.series(captureList, function (localList, i) {
            __TRACE__P_122_1("captureList[" + i + "]: localList.length=" + localList.length);
            var currentTarget = captureTargets[i];
            event.setCurrentTarget(currentTarget);
            var result = qx.event.Utils.series(localList, function (listener, listenerIndex) {
              context = listener.context || currentTarget;
              {
                // warn if the context is disposed
                if (context && context.isDisposed && context.isDisposed()) {
                  self.warn("The context object '" + context + "' for the event '" + type + "' of '" + currentTarget + "'is already disposed.");
                }
              }
              if (!self._manager.isBlacklisted(listener.unique)) {
                __TRACE__P_122_1("captureList[" + i + "] => localList[" + listenerIndex + "] callListener");
                return listener.handler.call(context, event);
              } else {
                __TRACE__P_122_1("captureList[" + i + "] => localList[" + listenerIndex + "] is blacklisted");
              }
            }, true);
            if (result === qx.event.Utils.ABORT) {
              return qx.event.Utils.reject(tracker);
            }
            if (event.getPropagationStopped()) {
              return qx.event.Utils.reject(tracker);
            }
            return result;
          });
        });

        // at target
        qx.event.Utils.then(tracker, function () {
          event.setEventPhase(qx.event.type.Event.AT_TARGET);
          event.setCurrentTarget(target);
          __TRACE__P_122_1("targetList=" + targetList.length);
          return qx.event.Utils.series(targetList, function (localList, i) {
            __TRACE__P_122_1("targetList[" + i + "] localList.length=" + localList.length);
            var result = qx.event.Utils.series(localList, function (listener, listenerIndex) {
              __TRACE__P_122_1("targetList[" + i + "] -> localList[" + listenerIndex + "] callListener");
              context = listener.context || target;
              {
                // warn if the context is disposed
                if (context && context.isDisposed && context.isDisposed()) {
                  self.warn("The context object '" + context + "' for the event '" + type + "' of '" + target + "'is already disposed.");
                }
              }
              __TRACE__P_122_1("Calling target serial=" + serial + ", type=" + event.getType());
              return listener.handler.call(context, event);
            }, true);
            if (result === qx.event.Utils.ABORT) {
              return qx.event.Utils.reject(tracker);
            }
            if (event.getPropagationStopped()) {
              return qx.event.Utils.reject(tracker);
            }
            return result;
          });
        });

        // bubbling phase
        // loop through the hierarchy in normal order (to root)
        qx.event.Utils.then(tracker, function () {
          event.setEventPhase(qx.event.type.Event.BUBBLING_PHASE);
          __TRACE__P_122_1("bubbleList=" + bubbleList.length);
          return qx.event.Utils.series(bubbleList, function (localList, i) {
            __TRACE__P_122_1("bubbleList[" + i + "] localList.length=" + localList.length);
            var currentTarget = bubbleTargets[i];
            event.setCurrentTarget(currentTarget);
            var result = qx.event.Utils.series(localList, function (listener, listenerIndex) {
              __TRACE__P_122_1("bubbleList[" + i + "] -> localList[" + listenerIndex + "] callListener");
              context = listener.context || currentTarget;
              {
                // warn if the context is disposed
                if (context && context.isDisposed && context.isDisposed()) {
                  self.warn("The context object '" + context + "' for the event '" + type + "' of '" + currentTarget + "'is already disposed.");
                }
              }
              return listener.handler.call(context, event);
            }, true);
            if (result === qx.event.Utils.ABORT) {
              return qx.event.Utils.reject(tracker);
            }
            if (event.getPropagationStopped()) {
              return qx.event.Utils.reject(tracker);
            }
            return result;
          });
        });
        if (__TRACE_LOGGING__P_122_0) {
          if (tracker.promise) {
            __TRACE__P_122_1("events promised");
            qx.event.Utils.then(tracker, function () {
              __TRACE__P_122_1("events promised done");
            });
          } else {
            __TRACE__P_122_1("events done");
          }
        }
        return tracker.promise;
      }
    }
  });
  qx.event.dispatch.AbstractBubbling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.dispatch.AbstractBubbling": {
        "require": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * Event dispatcher for all bubbling events on DOM elements.
   */
  qx.Class.define("qx.event.dispatch.DomBubbling", {
    extend: qx.event.dispatch.AbstractBubbling,
    statics: {
      /** @type {Integer} Priority of this dispatcher */
      PRIORITY: qx.event.Registration.PRIORITY_NORMAL
    },
    members: {
      // overridden
      _getParent(target) {
        return target.parentNode;
      },
      // interface implementation
      canDispatchEvent(target, event, type) {
        return target.nodeType !== undefined && event.getBubbles();
      }
    },
    defer(statics) {
      qx.event.Registration.addDispatcher(statics);
    }
  });
  qx.event.dispatch.DomBubbling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Native": {
        "require": true
      },
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "os.name": {
          "className": "qx.bom.client.OperatingSystem"
        },
        "engine.name": {
          "className": "qx.bom.client.Engine"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Common base class for all DOM events.
   */
  qx.Class.define("qx.event.type.Dom", {
    extend: qx.event.type.Native,
    statics: {
      /** @type {Integer} The modifier mask for the shift key. */
      SHIFT_MASK: 1,
      /** @type {Integer} The modifier mask for the control key. */
      CTRL_MASK: 2,
      /** @type {Integer} The modifier mask for the alt key. */
      ALT_MASK: 4,
      /** @type {Integer} The modifier mask for the meta key (e.g. apple key on Macs). */
      META_MASK: 8,
      /** @type {Integer} The modifier mask for the CapsLock modifier. */
      CAPSLOCK_MASK: 16,
      /** @type {Integer} The modifier mask for the NumLock modifier. */
      NUMLOCK_MASK: 32,
      /** @type {Integer} The modifier mask for the ScrollLock modifier. */
      SCROLLLOCK_MASK: 64
    },
    members: {
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Dom.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        clone.shiftKey = nativeEvent.shiftKey;
        clone.ctrlKey = nativeEvent.ctrlKey;
        clone.altKey = nativeEvent.altKey;
        clone.metaKey = nativeEvent.metaKey;
        if (typeof nativeEvent.getModifierState === "function") {
          clone.numLock = nativeEvent.getModifierState("NumLock");
          clone.capsLock = nativeEvent.getModifierState("CapsLock");
          clone.scrollLock = nativeEvent.getModifierState("ScrollLock");
        } else {
          clone.numLock = false;
          clone.capsLock = false;
          clone.scrollLock = false;
        }
        return clone;
      },
      /**
       * Return in a bit map, which modifier keys are pressed. The constants
       * {@link #SHIFT_MASK}, {@link #CTRL_MASK}, {@link #ALT_MASK},
       * {@link #META_MASK} and {@link #CAPSLOCK_MASK} define the bit positions
       * of the corresponding keys.
       *
       * @return {Integer} A bit map with the pressed modifier keys.
       */
      getModifiers() {
        var mask = 0;
        var evt = this._native;
        if (evt.shiftKey) {
          mask |= qx.event.type.Dom.SHIFT_MASK;
        }
        if (evt.ctrlKey) {
          mask |= qx.event.type.Dom.CTRL_MASK;
        }
        if (evt.altKey) {
          mask |= qx.event.type.Dom.ALT_MASK;
        }
        if (evt.metaKey) {
          mask |= qx.event.type.Dom.META_MASK;
        }
        return mask;
      },
      /**
       * Return in a bit map, which lock keys are pressed. The constants
       * {@link #CAPSLOCK_MASK}, {@link #NUMLOCK_MASK}, and {@link #SCROLLLOCK_MASK}
       * define the bit positions of the corresponding keys.
       *
       * @return {Integer} A bit map with the locked keys.
       */
      getKeyLockState() {
        var mask = 0;
        var evt = this._native;
        if (evt.capsLock) {
          mask |= qx.event.type.Dom.CAPSLOCK_MASK;
        }
        if (evt.numLock) {
          mask |= qx.event.type.Dom.NUMLOCK_MASK;
        }
        if (evt.scrollLock) {
          mask |= qx.event.type.Dom.SCROLLLOCK_MASK;
        }
        return mask;
      },
      /**
       * Returns whether the ctrl key is pressed.
       *
       * @return {Boolean} whether the ctrl key is pressed.
       */
      isCtrlPressed() {
        return this._native.ctrlKey;
      },
      /**
       * Returns whether the shift key is pressed.
       *
       * @return {Boolean} whether the shift key is pressed.
       */
      isShiftPressed() {
        return this._native.shiftKey;
      },
      /**
       * Returns whether the alt key is pressed.
       *
       * @return {Boolean} whether the alt key is pressed.
       */
      isAltPressed() {
        return this._native.altKey;
      },
      /**
       * Returns whether the meta key is pressed.
       *
       * @return {Boolean} whether the meta key is pressed.
       */
      isMetaPressed() {
        return this._native.metaKey;
      },
      /**
       * Returns whether the caps-lock modifier is active
       *
       * @return {Boolean} whether the CapsLock key is pressed.
       */
      isCapsLocked() {
        return this._native.capsLock;
      },
      /**
       * Returns whether the num-lock modifier is active
       *
       * @return {Boolean} whether the NumLock key is pressed.
       */
      isNumLocked() {
        return this._native.numLock;
      },
      /**
       * Returns whether the scroll-lock modifier is active
       *
       * @return {Boolean} whether the ScrollLock key is pressed.
       */
      isScrollLocked() {
        return this._native.scrollLock;
      },
      /**
       * Returns whether the ctrl key or (on the Mac) the command key is pressed.
       *
       * @return {Boolean} <code>true</code> if the command key is pressed on the Mac
       *           or the ctrl key is pressed on another system.
       */
      isCtrlOrCommandPressed() {
        // Opera seems to use ctrlKey for the cmd key so don't fix that for opera
        // on mac [BUG #5884]
        if (qx.core.Environment.get("os.name") == "osx" && qx.core.Environment.get("engine.name") != "opera") {
          return this._native.metaKey;
        } else {
          return this._native.ctrlKey;
        }
      }
    }
  });
  qx.event.type.Dom.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Dom": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.dom.Node": {},
      "qx.bom.Viewport": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "browser.name": {
          "className": "qx.bom.client.Browser"
        },
        "browser.documentmode": {
          "className": "qx.bom.client.Browser"
        },
        "engine.name": {
          "className": "qx.bom.client.Engine"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Mouse event object.
   *
   * the interface of this class is based on the DOM Level 2 mouse event
   * interface: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents
   */
  qx.Class.define("qx.event.type.Mouse", {
    extend: qx.event.type.Dom,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Mouse.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        // Fix for #9619 pointermove/mousemove events return wrong result in isLeftPressed()
        // button only valid in button events. Undefined otherwise.
        // see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        switch (nativeEvent.type) {
          case "mousemove":
          case "mouseenter":
          case "mouseleave":
          case "mouseover":
          case "mouseout":
            clone.button = -1;
            break;
          default:
            clone.button = nativeEvent.button;
            break;
        }
        clone.buttons = nativeEvent.buttons;
        clone.clientX = Math.round(nativeEvent.clientX);
        clone.clientY = Math.round(nativeEvent.clientY);
        clone.pageX = nativeEvent.pageX ? Math.round(nativeEvent.pageX) : undefined;
        clone.pageY = nativeEvent.pageY ? Math.round(nativeEvent.pageY) : undefined;
        clone.screenX = Math.round(nativeEvent.screenX);
        clone.screenY = Math.round(nativeEvent.screenY);
        clone.wheelDelta = nativeEvent.wheelDelta;
        clone.wheelDeltaX = nativeEvent.wheelDeltaX;
        clone.wheelDeltaY = nativeEvent.wheelDeltaY;
        clone.delta = nativeEvent.delta;
        clone.deltaX = nativeEvent.deltaX;
        clone.deltaY = nativeEvent.deltaY;
        clone.deltaZ = nativeEvent.deltaZ;
        clone.detail = nativeEvent.detail;
        clone.axis = nativeEvent.axis;
        clone.wheelX = nativeEvent.wheelX;
        clone.wheelY = nativeEvent.wheelY;
        clone.HORIZONTAL_AXIS = nativeEvent.HORIZONTAL_AXIS;
        clone.srcElement = nativeEvent.srcElement;
        clone.target = nativeEvent.target;
        return clone;
      },
      /**
       * @type {Map} Contains the button ID to identifier data.
       *
       * @lint ignoreReferenceField(__buttonsDom2EventModel)
       */
      __buttonsDom2EventModel__P_131_0: {
        0: "left",
        2: "right",
        1: "middle"
      },
      /**
       * @type {Map} Contains the button ID to identifier data.
       *
       * @lint ignoreReferenceField(__buttonsDom3EventModel)
       */
      __buttonsDom3EventModel__P_131_1: {
        0: "none",
        1: "left",
        2: "right",
        4: "middle"
      },
      /**
       * @type {Map} Contains the button ID to identifier data.
       *
       * @lint ignoreReferenceField(__buttonsMshtmlEventModel)
       */
      __buttonsMshtmlEventModel__P_131_2: {
        1: "left",
        2: "right",
        4: "middle"
      },
      // overridden
      stop() {
        this.stopPropagation();
      },
      /**
       * During mouse events caused by the depression or release of a mouse button,
       * this method can be used to check which mouse button changed state.
       *
       * Only internet explorer can compute the button during mouse move events. For
       * all other browsers the button only contains sensible data during
       * "click" events like "click", "dblclick", "mousedown", "mouseup" or "contextmenu".
       *
       * But still, browsers act different on click:
       * <pre>
       * <- = left mouse button
       * -> = right mouse button
       * ^  = middle mouse button
       *
       * Browser | click, dblclick | contextmenu
       * ---------------------------------------
       * Firefox | <- ^ ->         | ->
       * Chrome  | <- ^            | ->
       * Safari  | <- ^            | ->
       * IE      | <- (^ is <-)    | ->
       * Opera   | <-              | -> (twice)
       * </pre>
       *
       * @return {String} One of "left", "right", "middle" or "none"
       */
      getButton() {
        switch (this._type) {
          case "contextmenu":
            return "right";
          case "click":
            // IE does not support buttons on click --> assume left button
            if (qx.core.Environment.get("browser.name") === "ie" && qx.core.Environment.get("browser.documentmode") < 9) {
              return "left";
            }
          default:
            if (!(qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") <= 8)) {
              // if the button value is -1, we should use the DOM level 3 .buttons attribute
              // the value -1 is only set for pointer events: http://msdn.microsoft.com/en-us/library/ie/ff974877(v=vs.85).aspx
              if (this._native.button === -1) {
                return this.__buttonsDom3EventModel__P_131_1[this._native.buttons] || "none";
              }
              return this.__buttonsDom2EventModel__P_131_0[this._native.button] || "none";
            } else {
              return this.__buttonsMshtmlEventModel__P_131_2[this._native.button] || "none";
            }
        }
      },
      /**
       * Whether the left button is pressed
       *
       * @return {Boolean} true when the left button is pressed
       */
      isLeftPressed() {
        return this.getButton() === "left";
      },
      /**
       * Whether the middle button is pressed
       *
       * @return {Boolean} true when the middle button is pressed
       */
      isMiddlePressed() {
        return this.getButton() === "middle";
      },
      /**
       * Whether the right button is pressed
       *
       * @return {Boolean} true when the right button is pressed
       */
      isRightPressed() {
        return this.getButton() === "right";
      },
      /**
       * Get a secondary event target related to an UI event. This attribute is
       * used with the mouseover event to indicate the event target which the
       * pointing device exited and with the mouseout event to indicate the
       * event target which the pointing device entered.
       *
       * @return {Element} The secondary event target.
       * @signature function()
       */
      getRelatedTarget() {
        return this._relatedTarget;
      },
      /**
       * Get the he horizontal coordinate at which the event occurred relative
       * to the viewport.
       *
       * @return {Integer} The horizontal mouse position
       */
      getViewportLeft() {
        return Math.round(this._native.clientX);
      },
      /**
       * Get the vertical coordinate at which the event occurred relative
       * to the viewport.
       *
       * @return {Integer} The vertical mouse position
       * @signature function()
       */
      getViewportTop() {
        return Math.round(this._native.clientY);
      },
      /**
       * Get the horizontal position at which the event occurred relative to the
       * left of the document. This property takes into account any scrolling of
       * the page.
       *
       * @return {Integer} The horizontal mouse position in the document.
       */
      getDocumentLeft() {
        if (this._native.pageX !== undefined) {
          return Math.round(this._native.pageX);
        } else if (this._native.srcElement) {
          var win = qx.dom.Node.getWindow(this._native.srcElement);
          return Math.round(this._native.clientX) + qx.bom.Viewport.getScrollLeft(win);
        } else {
          return Math.round(this._native.clientX) + qx.bom.Viewport.getScrollLeft(window);
        }
      },
      /**
       * Get the vertical position at which the event occurred relative to the
       * top of the document. This property takes into account any scrolling of
       * the page.
       *
       * @return {Integer} The vertical mouse position in the document.
       */
      getDocumentTop() {
        if (this._native.pageY !== undefined) {
          return Math.round(this._native.pageY);
        } else if (this._native.srcElement) {
          var win = qx.dom.Node.getWindow(this._native.srcElement);
          return Math.round(this._native.clientY) + qx.bom.Viewport.getScrollTop(win);
        } else {
          return Math.round(this._native.clientY) + qx.bom.Viewport.getScrollTop(window);
        }
      },
      /**
       * Get the horizontal coordinate at which the event occurred relative to
       * the origin of the screen coordinate system.
       *
       * Note: This value is usually not very useful unless you want to
       * position a native popup window at this coordinate.
       *
       * @return {Integer} The horizontal mouse position on the screen.
       */
      getScreenLeft() {
        return Math.round(this._native.screenX);
      },
      /**
       * Get the vertical coordinate at which the event occurred relative to
       * the origin of the screen coordinate system.
       *
       * Note: This value is usually not very useful unless you want to
       * position a native popup window at this coordinate.
       *
       * @return {Integer} The vertical mouse position on the screen.
       */
      getScreenTop() {
        return Math.round(this._native.screenY);
      }
    }
  });
  qx.event.type.Mouse.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Mouse": {
        "require": true
      },
      "qx.bom.Event": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * Pointer event object.
   *
   * the interface of this class is based on the pointer event interface:
   * http://www.w3.org/TR/pointerevents/
   */
  qx.Class.define("qx.event.type.Pointer", {
    extend: qx.event.type.Mouse,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        clone = qx.event.type.Pointer.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        clone.pointerId = nativeEvent.pointerId;
        clone.width = nativeEvent.width;
        clone.height = nativeEvent.height;
        clone.pressure = nativeEvent.pressure;
        clone.tiltX = nativeEvent.tiltX;
        clone.tiltY = nativeEvent.tiltY;
        clone.pointerType = nativeEvent.pointerType;
        clone.isPrimary = nativeEvent.isPrimary;
        clone._original = nativeEvent._original;
        clone.MSPOINTER_TYPE_MOUSE = nativeEvent.MSPOINTER_TYPE_MOUSE;
        clone.MSPOINTER_TYPE_PEN = nativeEvent.MSPOINTER_TYPE_PEN;
        clone.MSPOINTER_TYPE_TOUCH = nativeEvent.MSPOINTER_TYPE_TOUCH;
        return clone;
      },
      // overridden
      getDocumentLeft() {
        var x = qx.event.type.Pointer.superclass.prototype.getDocumentLeft.call(this);
        // iOS 6 does not copy pageX over to the fake pointer event
        if (x == 0 && this.getPointerType() == "touch" && this._native._original !== undefined) {
          x = Math.round(this._native._original.changedTouches[0].pageX) || 0;
        }
        return x;
      },
      // overridden
      getDocumentTop() {
        var y = qx.event.type.Pointer.superclass.prototype.getDocumentTop.call(this);
        // iOS 6 does not copy pageY over to the fake pointer event
        if (y == 0 && this.getPointerType() == "touch" && this._native._original !== undefined) {
          y = Math.round(this._native._original.changedTouches[0].pageY) || 0;
        }
        return y;
      },
      /**
       * Returns a unique identified for the pointer. This id is
       * unique for all active pointers.
       *
       * @return {Number} The unique id.
       */
      getPointerId() {
        return this._native.pointerId || 0;
      },
      /**
       * Returns the contact geometry in it's width.
       *
       * @return {Number} The number of pixels (width) of the contact geometry.
       */
      getWidth() {
        return this._native.width || 0;
      },
      /**
       * Returns the contact geometry in it's height.
       *
       * @return {Number} The number of pixels (height) of the contact geometry.
       */
      getHeight() {
        return this._native.height || 0;
      },
      /**
       * Returns the pressure of the pointer in a rage from 0 to 1.
       *
       * @return {Number} <code>1</code> for full pressure. The default is 0.
       */
      getPressure() {
        return this._native.pressure || 0;
      },
      /**
       * Returns the plane angle in degrees between the Y-Z plane and the
       * plane containing e.g. the stylus and the Y axis.
       *
       * @return {Number} A value between -90 and 90. The default is 0.
       */
      getTiltX() {
        return this._native.tiltX || 0;
      },
      /**
       * Returns the plane angle in degrees between the X-Z plane and the
       * plane containing e.g. the stylus and the X axis.
       *
       * @return {Number} A value between -90 and 90. The default is 0.
       */
      getTiltY() {
        return this._native.tiltY || 0;
      },
      // overridden
      getOriginalTarget() {
        if (this._native && this._native._original) {
          // fake pointer events
          var orig = this._native._original;
          // In IE8, the original event can be a DispCEventObj which throws an
          // exception when trying to access its properties.
          try {
            // touch events have a wrong target compared to mouse events
            if (orig.type.indexOf("touch") == 0) {
              if (orig.changedTouches[0]) {
                return document.elementFromPoint(orig.changedTouches[0].clientX, orig.changedTouches[0].clientY);
              }
            }
          } catch (ex) {
            return qx.bom.Event.getTarget(this._native);
          }
          return qx.bom.Event.getTarget(orig);
        } else if (this._native) {
          // native pointer events
          return qx.bom.Event.getTarget(this._native);
        }
        return qx.event.type.Pointer.superclass.prototype.getOriginalTarget.call(this);
      },
      /**
       * Returns the device type which the event triggered. This can be one
       * of the following strings: <code>mouse</code>, <code>wheel</code>,
       * <code>pen</code> or <code>touch</code>.
       *
       * @return {String} The type of the pointer.
       */
      getPointerType() {
        if (typeof this._native.pointerType == "string") {
          return this._native.pointerType;
        }
        if (typeof this._native.pointerType == "number") {
          if (this._native.pointerType == this._native.MSPOINTER_TYPE_MOUSE) {
            return "mouse";
          }
          if (this._native.pointerType == this._native.MSPOINTER_TYPE_PEN) {
            return "pen";
          }
          if (this._native.pointerType == this._native.MSPOINTER_TYPE_TOUCH) {
            return "touch";
          }
        }
        return "";
      },
      /**
       * Returns whether the pointer is the primary pointer.
       *
       * @return {Boolean} <code>true</code>, if it's the primary pointer.
       */
      isPrimary() {
        return !!this._native.isPrimary;
      }
    }
  });
  qx.event.type.Pointer.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Event": {
        "require": true
      },
      "qx.lang.Object": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "event.customevent": {
          "className": "qx.bom.client.Event"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christopher Zuendorf (czuendorf)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Cross-browser custom UI event
   */
  qx.Bootstrap.define("qx.event.type.dom.Custom", {
    extend: Object,
    statics: {
      PROPERTIES: {
        bubbles: false,
        cancelable: true
      }
    },
    /**
     * @param type {String} event type
     * @param domEvent {Event} Native event that will be used as a template for the new event
     * @param customProps {Map} Map of event properties (will override the domEvent's values)
     * @return {Event} event object
     */
    construct(type, domEvent, customProps) {
      this._type = type;
      this._event = this._createEvent();
      this._initEvent(domEvent, customProps);
      this._event._original = domEvent;
      this._event.preventDefault = function () {
        if (this._original.preventDefault) {
          this._original.preventDefault();
        } else {
          // In IE8, the original event can be a DispCEventObj which throws an
          // exception when trying to access its properties.
          try {
            this._original.returnValue = false;
          } catch (ex) {}
        }
      };
      if (this._event.stopPropagation) {
        this._event._nativeStopPropagation = this._event.stopPropagation;
      }
      this._event.stopPropagation = function () {
        this._stopped = true;
        if (this._nativeStopPropagation) {
          this._original.stopPropagation();
          this._nativeStopPropagation();
        } else {
          this._original.cancelBubble = true;
        }
      };
      return this._event;
    },
    members: {
      _type: null,
      _event: null,
      /**
       * Creates a custom event object
       * @return {Event} event object
       */
      _createEvent() {
        var evt;
        if (qx.core.Environment.get("event.customevent")) {
          evt = new window.CustomEvent(this._type);
        } else if (typeof document.createEvent == "function") {
          evt = document.createEvent("UIEvents");
        } else if (typeof document.createEventObject == "object") {
          // IE8 doesn't support custom event types
          evt = {};
          evt.type = this._type;
        }
        return evt;
      },
      /**
       * Initializes a custom event
       *
       * @param domEvent {Event} Native event that will be used as a template for the new event
       * @param customProps {Map?} Map of event properties (will override the domEvent's values)
       */
      _initEvent(domEvent, customProps) {
        customProps = customProps || {};
        var properties = qx.lang.Object.clone(qx.event.type.dom.Custom.PROPERTIES);
        for (var prop in customProps) {
          properties[prop] = customProps[prop];
        }
        if (this._event.initEvent) {
          this._event.initEvent(this._type, properties.bubbles, properties.cancelable);
        }
        for (var prop in properties) {
          try {
            this._event[prop] = properties[prop];
          } catch (ex) {
            //Nothing - strict mode prevents writing to read only properties
          }
        }
      }
    }
  });
  qx.event.type.dom.Custom.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.dom.Custom": {
        "construct": true,
        "require": true
      },
      "qx.dom.Node": {},
      "qx.bom.Viewport": {},
      "qx.bom.client.Event": {
        "require": true
      },
      "qx.bom.client.Engine": {
        "defer": "load",
        "require": true
      },
      "qx.bom.client.OperatingSystem": {
        "defer": "load",
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "event.mouseevent": {
          "className": "qx.bom.client.Event"
        },
        "event.mousecreateevent": {
          "className": "qx.bom.client.Event"
        },
        "engine.name": {
          "defer": true,
          "className": "qx.bom.client.Engine"
        },
        "os.name": {
          "defer": true,
          "className": "qx.bom.client.OperatingSystem"
        },
        "os.version": {
          "defer": true,
          "className": "qx.bom.client.OperatingSystem"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christopher Zuendorf (czuendorf)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Synthetic pointer event
   */
  qx.Bootstrap.define("qx.event.type.dom.Pointer", {
    extend: qx.event.type.dom.Custom,
    statics: {
      MOUSE_PROPERTIES: ["bubbles", "cancelable", "view", "detail", "screenX", "screenY", "clientX", "clientY", "pageX", "pageY", "ctrlKey", "altKey", "shiftKey", "metaKey", "button", "which", "relatedTarget",
      // IE8 properties:
      "fromElement", "toElement"],
      POINTER_PROPERTIES: {
        pointerId: 1,
        width: 0,
        height: 0,
        pressure: 0.5,
        tiltX: 0,
        tiltY: 0,
        pointerType: "",
        isPrimary: false
      },
      READONLY_PROPERTIES: [],
      BIND_METHODS: ["getPointerType", "getViewportLeft", "getViewportTop", "getDocumentLeft", "getDocumentTop", "getScreenLeft", "getScreenTop"],
      /**
       * Returns the device type which the event triggered. This can be one
       * of the following strings: <code>mouse</code>, <code>pen</code>
       * or <code>touch</code>.
       *
       * @return {String} The type of the pointer.
       */
      getPointerType() {
        if (typeof this.pointerType == "string") {
          return this.pointerType;
        }
        if (typeof this.pointerType == "number") {
          if (this.pointerType == this.MSPOINTER_TYPE_MOUSE) {
            return "mouse";
          }
          if (this.pointerType == this.MSPOINTER_TYPE_PEN) {
            return "pen";
          }
          if (this.pointerType == this.MSPOINTER_TYPE_TOUCH) {
            return "touch";
          }
        }
        return "";
      },
      /**
       * Get the horizontal coordinate at which the event occurred relative
       * to the viewport.
       *
       * @return {Number} The horizontal mouse position
       */
      getViewportLeft() {
        return this.clientX;
      },
      /**
       * Get the vertical coordinate at which the event occurred relative
       * to the viewport.
       *
       * @return {Number} The vertical mouse position
       * @signature function()
       */
      getViewportTop() {
        return this.clientY;
      },
      /**
       * Get the horizontal position at which the event occurred relative to the
       * left of the document. This property takes into account any scrolling of
       * the page.
       *
       * @return {Number} The horizontal mouse position in the document.
       */
      getDocumentLeft() {
        if (this.pageX !== undefined) {
          return this.pageX;
        } else {
          var win = qx.dom.Node.getWindow(this.srcElement);
          return this.clientX + qx.bom.Viewport.getScrollLeft(win);
        }
      },
      /**
       * Get the vertical position at which the event occurred relative to the
       * top of the document. This property takes into account any scrolling of
       * the page.
       *
       * @return {Number} The vertical mouse position in the document.
       */
      getDocumentTop() {
        if (this.pageY !== undefined) {
          return this.pageY;
        } else {
          var win = qx.dom.Node.getWindow(this.srcElement);
          return this.clientY + qx.bom.Viewport.getScrollTop(win);
        }
      },
      /**
       * Get the horizontal coordinate at which the event occurred relative to
       * the origin of the screen coordinate system.
       *
       * Note: This value is usually not very useful unless you want to
       * position a native popup window at this coordinate.
       *
       * @return {Number} The horizontal mouse position on the screen.
       */
      getScreenLeft() {
        return this.screenX;
      },
      /**
       * Get the vertical coordinate at which the event occurred relative to
       * the origin of the screen coordinate system.
       *
       * Note: This value is usually not very useful unless you want to
       * position a native popup window at this coordinate.
       *
       * @return {Number} The vertical mouse position on the screen.
       */
      getScreenTop() {
        return this.screenY;
      },
      /**
       * Manipulates the event object, adding methods if they're not
       * already present
       *
       * @param event {Event} Native event object
       */
      normalize(event) {
        var bindMethods = qx.event.type.dom.Pointer.BIND_METHODS;
        for (var i = 0, l = bindMethods.length; i < l; i++) {
          if (typeof event[bindMethods[i]] != "function") {
            event[bindMethods[i]] = qx.event.type.dom.Pointer[bindMethods[i]].bind(event);
          }
        }
      }
    },
    construct(type, domEvent, customProps) {
      return qx.event.type.dom.Custom.constructor.call(this, type, domEvent, customProps);
    },
    members: {
      _createEvent() {
        var evt;
        if (qx.core.Environment.get("event.mouseevent")) {
          evt = new window.MouseEvent(this._type);
        } else if (typeof document.createEvent == "function") {
          /* In IE9, the pageX property of synthetic MouseEvents is always 0
          and cannot be overridden, so we create a plain UIEvent and add
          the mouse event properties ourselves. */
          evt = document.createEvent(qx.core.Environment.get("event.mousecreateevent"));
        } else if (typeof document.createEventObject == "object") {
          // IE8 doesn't support custom event types
          evt = {};
          evt.type = this._type;
        }
        return evt;
      },
      _initEvent(domEvent, customProps) {
        customProps = customProps || {};
        var evt = this._event;
        var properties = {};
        qx.event.type.dom.Pointer.normalize(domEvent);
        Object.keys(qx.event.type.dom.Pointer.POINTER_PROPERTIES).concat(qx.event.type.dom.Pointer.MOUSE_PROPERTIES).forEach(function (propName) {
          if (typeof customProps[propName] !== "undefined") {
            properties[propName] = customProps[propName];
          } else if (typeof domEvent[propName] !== "undefined") {
            properties[propName] = domEvent[propName];
          } else if (typeof qx.event.type.dom.Pointer.POINTER_PROPERTIES[propName] !== "undefined") {
            properties[propName] = qx.event.type.dom.Pointer.POINTER_PROPERTIES[propName];
          }
        });
        var buttons;
        switch (domEvent.which) {
          case 1:
            buttons = 1;
            break;
          case 2:
            buttons = 4;
            break;
          case 3:
            buttons = 2;
            break;
          default:
            buttons = 0;
        }
        if (buttons !== undefined) {
          properties.buttons = buttons;
          properties.pressure = buttons ? 0.5 : 0;
        }
        if (evt.initMouseEvent) {
          evt.initMouseEvent(this._type, properties.bubbles, properties.cancelable, properties.view, properties.detail, properties.screenX, properties.screenY, properties.clientX, properties.clientY, properties.ctrlKey, properties.altKey, properties.shiftKey, properties.metaKey, properties.button, properties.relatedTarget);
        } else if (evt.initUIEvent) {
          evt.initUIEvent(this._type, properties.bubbles, properties.cancelable, properties.view, properties.detail);
        }
        for (var prop in properties) {
          if (evt[prop] !== properties[prop] && qx.event.type.dom.Pointer.READONLY_PROPERTIES.indexOf(prop) === -1) {
            try {
              evt[prop] = properties[prop];
            } catch (ex) {
              // Nothing - cannot override properties in strict mode
            }
          }
        }

        // normalize Windows 8 pointer types
        switch (evt.pointerType) {
          case domEvent.MSPOINTER_TYPE_MOUSE:
            evt.pointerType = "mouse";
            break;
          case domEvent.MSPOINTER_TYPE_PEN:
            evt.pointerType = "pen";
            break;
          case domEvent.MSPOINTER_TYPE_TOUCH:
            evt.pointerType = "touch";
            break;
        }
        if (evt.pointerType == "mouse") {
          evt.isPrimary = true;
        }
      }
    },
    defer(statics) {
      if (qx.core.Environment.get("engine.name") == "gecko") {
        statics.READONLY_PROPERTIES.push("buttons");
      } else if (qx.core.Environment.get("os.name") == "ios" && parseFloat(qx.core.Environment.get("os.version")) >= 8) {
        statics.READONLY_PROPERTIES = statics.READONLY_PROPERTIES.concat(statics.MOUSE_PROPERTIES);
      }
    }
  });
  qx.event.type.dom.Pointer.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.bom.client.Event": {
        "require": true,
        "construct": true
      },
      "qx.bom.client.Device": {
        "require": true,
        "construct": true
      },
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "construct": true,
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.bom.client.Engine": {
        "construct": true,
        "require": true
      },
      "qx.bom.client.Browser": {
        "construct": true,
        "require": true
      },
      "qx.lang.Function": {},
      "qx.dom.Node": {},
      "qx.event.Emitter": {},
      "qx.bom.Event": {},
      "qx.event.type.dom.Pointer": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.lang.Array": {},
      "qx.event.Utils": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "load": true,
          "className": "qx.bom.client.Engine",
          "construct": true
        },
        "browser.documentmode": {
          "load": true,
          "className": "qx.bom.client.Browser",
          "construct": true
        },
        "event.mspointer": {
          "construct": true,
          "className": "qx.bom.client.Event"
        },
        "device.touch": {
          "construct": true,
          "className": "qx.bom.client.Device"
        },
        "os.name": {
          "className": "qx.bom.client.OperatingSystem"
        },
        "event.dispatchevent": {
          "className": "qx.bom.client.Event"
        },
        "browser.name": {
          "className": "qx.bom.client.Browser"
        },
        "browser.version": {
          "className": "qx.bom.client.Browser"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christopher Zuendorf (czuendorf)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Low-level pointer event handler.
   *
   * @require(qx.bom.client.Event)
   * @require(qx.bom.client.Device)
   */
  qx.Bootstrap.define("qx.event.handler.PointerCore", {
    extend: Object,
    implement: [qx.core.IDisposable],
    statics: {
      MOUSE_TO_POINTER_MAPPING: {
        mousedown: "pointerdown",
        mouseup: "pointerup",
        mousemove: "pointermove",
        mouseout: "pointerout",
        mouseover: "pointerover"
      },
      TOUCH_TO_POINTER_MAPPING: {
        touchstart: "pointerdown",
        touchend: "pointerup",
        touchmove: "pointermove",
        touchcancel: "pointercancel"
      },
      MSPOINTER_TO_POINTER_MAPPING: {
        MSPointerDown: "pointerdown",
        MSPointerMove: "pointermove",
        MSPointerUp: "pointerup",
        MSPointerCancel: "pointercancel",
        MSPointerLeave: "pointerleave",
        MSPointerEnter: "pointerenter",
        MSPointerOver: "pointerover",
        MSPointerOut: "pointerout"
      },
      POINTER_TO_GESTURE_MAPPING: {
        pointerdown: "gesturebegin",
        pointerup: "gesturefinish",
        pointercancel: "gesturecancel",
        pointermove: "gesturemove"
      },
      LEFT_BUTTON: qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") <= 8 ? 1 : 0,
      SIM_MOUSE_DISTANCE: 25,
      SIM_MOUSE_DELAY: 2500,
      /**
       * Coordinates of the last touch. This needs to be static because the target could
       * change between touch and simulated mouse events. Touch events will be detected
       * by one instance which moves the target. The simulated mouse events will be fired with
       * a delay which causes another target and with that, another instance of this handler.
       * last touch was.
       */
      __lastTouch__P_194_0: null
    },
    /**
     * Create a new instance
     *
     * @param target {Element} element on which to listen for native touch events
     * @param emitter {qx.event.Emitter?} Event emitter (used if dispatchEvent
     * is not supported, e.g. in IE8)
     */
    construct(target, emitter) {
      this.__defaultTarget__P_194_1 = target;
      this.__emitter__P_194_2 = emitter;
      this.__eventNames__P_194_3 = [];
      this.__buttonStates__P_194_4 = [];
      this.__activeTouches__P_194_5 = [];
      this._processedFlag = "$$qx" + this.classname.substr(this.classname.lastIndexOf(".") + 1) + "Processed";
      var engineName = qx.core.Environment.get("engine.name");
      var docMode = parseInt(qx.core.Environment.get("browser.documentmode"), 10);
      if (engineName == "mshtml" && docMode == 10) {
        // listen to native prefixed events and custom unprefixed (see bug #8921)
        this.__eventNames__P_194_3 = ["MSPointerDown", "MSPointerMove", "MSPointerUp", "MSPointerCancel", "MSPointerOver", "MSPointerOut", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout"];
        this._initPointerObserver();
      } else {
        if (qx.core.Environment.get("event.mspointer")) {
          this.__nativePointerEvents__P_194_6 = true;
        }
        this.__eventNames__P_194_3 = ["pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout"];
        this._initPointerObserver();
      }
      if (!qx.core.Environment.get("event.mspointer")) {
        if (qx.core.Environment.get("device.touch")) {
          this.__eventNames__P_194_3 = ["touchstart", "touchend", "touchmove", "touchcancel"];
          this._initObserver(this._onTouchEvent);
        }
        this.__eventNames__P_194_3 = ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "contextmenu"];
        this._initObserver(this._onMouseEvent);
      }
    },
    members: {
      __defaultTarget__P_194_1: null,
      __emitter__P_194_2: null,
      __eventNames__P_194_3: null,
      __nativePointerEvents__P_194_6: false,
      __wrappedListener__P_194_7: null,
      __lastButtonState__P_194_8: 0,
      __buttonStates__P_194_4: null,
      __primaryIdentifier__P_194_9: null,
      __activeTouches__P_194_5: null,
      _processedFlag: null,
      /**
       * Adds listeners to native pointer events if supported
       */
      _initPointerObserver() {
        this._initObserver(this._onPointerEvent);
      },
      /**
       * Register native event listeners
       * @param callback {Function} listener callback
       * @param useEmitter {Boolean} attach listener to Emitter instead of
       * native event
       */
      _initObserver(callback, useEmitter) {
        this.__wrappedListener__P_194_7 = qx.lang.Function.listener(callback, this);
        this.__eventNames__P_194_3.forEach(function (type) {
          if (useEmitter && qx.dom.Node.isDocument(this.__defaultTarget__P_194_1)) {
            if (!this.__defaultTarget__P_194_1.$$emitter) {
              this.__defaultTarget__P_194_1.$$emitter = new qx.event.Emitter();
            }
            this.__defaultTarget__P_194_1.$$emitter.on(type, this.__wrappedListener__P_194_7);
          } else {
            qx.bom.Event.addNativeListener(this.__defaultTarget__P_194_1, type, this.__wrappedListener__P_194_7);
          }
        }.bind(this));
      },
      /**
       * Handler for native pointer events
       * @param domEvent {Event}  Native DOM event
       */
      _onPointerEvent(domEvent) {
        if (!qx.core.Environment.get("event.mspointer") ||
        // workaround for bug #8533
        qx.core.Environment.get("browser.documentmode") === 10 && domEvent.type.toLowerCase().indexOf("ms") == -1) {
          return;
        }
        if (!this.__nativePointerEvents__P_194_6) {
          domEvent.stopPropagation();
        }
        var type = qx.event.handler.PointerCore.MSPOINTER_TO_POINTER_MAPPING[domEvent.type] || domEvent.type;
        var target = qx.bom.Event.getTarget(domEvent);
        var evt = new qx.event.type.dom.Pointer(type, domEvent);
        this._fireEvent(evt, type, target);
      },
      /**
       * Handler for touch events
       * @param domEvent {Event} Native DOM event
       */
      _onTouchEvent(domEvent) {
        if (domEvent[this._processedFlag]) {
          return;
        }
        domEvent[this._processedFlag] = true;
        var type = qx.event.handler.PointerCore.TOUCH_TO_POINTER_MAPPING[domEvent.type];
        var changedTouches = domEvent.changedTouches;
        this._determineActiveTouches(domEvent.type, changedTouches);

        // Detecting vacuum touches. (Touches which are not active anymore, but did not fire a touchcancel event)
        if (domEvent.touches.length < this.__activeTouches__P_194_5.length) {
          // Firing pointer cancel for previously active touches.
          for (var i = this.__activeTouches__P_194_5.length - 1; i >= 0; i--) {
            var cancelEvent = new qx.event.type.dom.Pointer("pointercancel", domEvent, {
              identifier: this.__activeTouches__P_194_5[i].identifier,
              target: domEvent.target,
              pointerType: "touch",
              pointerId: this.__activeTouches__P_194_5[i].identifier + 2
            });
            this._fireEvent(cancelEvent, "pointercancel", domEvent.target);
          }

          // Reset primary identifier
          this.__primaryIdentifier__P_194_9 = null;

          // cleanup of active touches array.
          this.__activeTouches__P_194_5 = [];

          // Do nothing after pointer cancel.
          return;
        }
        if (domEvent.type == "touchstart" && this.__primaryIdentifier__P_194_9 === null) {
          this.__primaryIdentifier__P_194_9 = changedTouches[0].identifier;
        }
        for (var i = 0, l = changedTouches.length; i < l; i++) {
          var touch = changedTouches[i];
          var touchTarget = domEvent.view.document.elementFromPoint(touch.clientX, touch.clientY) || domEvent.target;
          var touchProps = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            pageX: touch.pageX,
            pageY: touch.pageY,
            identifier: touch.identifier,
            screenX: touch.screenX,
            screenY: touch.screenY,
            target: touchTarget,
            pointerType: "touch",
            pointerId: touch.identifier + 2
          };
          if (domEvent.type == "touchstart") {
            // Fire pointerenter before pointerdown
            var overEvt = new qx.event.type.dom.Pointer("pointerover", domEvent, touchProps);
            this._fireEvent(overEvt, "pointerover", touchProps.target);
          }
          if (touch.identifier == this.__primaryIdentifier__P_194_9) {
            touchProps.isPrimary = true;
            // always simulate left click on touch interactions for primary pointer
            touchProps.button = 0;
            touchProps.buttons = 1;
            qx.event.handler.PointerCore.__lastTouch__P_194_0 = {
              x: touch.clientX,
              y: touch.clientY,
              time: new Date().getTime()
            };
          }
          var evt = new qx.event.type.dom.Pointer(type, domEvent, touchProps);
          this._fireEvent(evt, type, touchProps.target);
          if (domEvent.type == "touchend" || domEvent.type == "touchcancel") {
            // Fire pointerout after pointerup
            var outEvt = new qx.event.type.dom.Pointer("pointerout", domEvent, touchProps);

            // fire on the original target to make sure over / out event are on the same target
            this._fireEvent(outEvt, "pointerout", domEvent.target);
            if (this.__primaryIdentifier__P_194_9 == touch.identifier) {
              this.__primaryIdentifier__P_194_9 = null;
            }
          }
        }
      },
      /**
       * Handler for touch events
       * @param domEvent {Event} Native DOM event
       */
      _onMouseEvent(domEvent) {
        if (domEvent[this._processedFlag]) {
          return;
        }
        domEvent[this._processedFlag] = true;
        if (this._isSimulatedMouseEvent(domEvent.clientX, domEvent.clientY)) {
          /*
            Simulated MouseEvents are fired by browsers directly after TouchEvents
            for improving compatibility. They should not trigger PointerEvents.
          */
          return;
        }
        if (domEvent.type == "mousedown") {
          this.__buttonStates__P_194_4[domEvent.which] = 1;
        } else if (domEvent.type == "mouseup") {
          if (qx.core.Environment.get("os.name") == "osx" && qx.core.Environment.get("engine.name") == "gecko") {
            if (this.__buttonStates__P_194_4[domEvent.which] != 1 && domEvent.ctrlKey) {
              this.__buttonStates__P_194_4[1] = 0;
            }
          }
          this.__buttonStates__P_194_4[domEvent.which] = 0;
        }
        var type = qx.event.handler.PointerCore.MOUSE_TO_POINTER_MAPPING[domEvent.type];
        var target = qx.bom.Event.getTarget(domEvent);
        var buttonsPressed = qx.lang.Array.sum(this.__buttonStates__P_194_4);
        var mouseProps = {
          pointerType: "mouse",
          pointerId: 1
        };

        // if the button state changes but not from or to zero
        if (this.__lastButtonState__P_194_8 != buttonsPressed && buttonsPressed !== 0 && this.__lastButtonState__P_194_8 !== 0) {
          var moveEvt = new qx.event.type.dom.Pointer("pointermove", domEvent, mouseProps);
          this._fireEvent(moveEvt, "pointermove", target);
        }
        this.__lastButtonState__P_194_8 = buttonsPressed;

        // pointerdown should only trigger form the first pressed button.
        if (domEvent.type == "mousedown" && buttonsPressed > 1) {
          return;
        }

        // pointerup should only trigger if user releases all buttons.
        if (domEvent.type == "mouseup" && buttonsPressed > 0) {
          return;
        }
        if (domEvent.type == "contextmenu") {
          this.__buttonStates__P_194_4[domEvent.which] = 0;
          return;
        }
        var evt = new qx.event.type.dom.Pointer(type, domEvent, mouseProps);
        this._fireEvent(evt, type, target);
      },
      /**
       * Determines the current active touches.
       * @param type {String} the DOM event type.
       * @param changedTouches {Array} the current changed touches.
       */
      _determineActiveTouches(type, changedTouches) {
        if (type == "touchstart") {
          for (var i = 0; i < changedTouches.length; i++) {
            this.__activeTouches__P_194_5.push(changedTouches[i]);
          }
        } else if (type == "touchend" || type == "touchcancel") {
          var updatedActiveTouches = [];
          for (var i = 0; i < this.__activeTouches__P_194_5.length; i++) {
            var add = true;
            for (var j = 0; j < changedTouches.length; j++) {
              if (this.__activeTouches__P_194_5[i].identifier == changedTouches[j].identifier) {
                add = false;
                break;
              }
            }
            if (add) {
              updatedActiveTouches.push(this.__activeTouches__P_194_5[i]);
            }
          }
          this.__activeTouches__P_194_5 = updatedActiveTouches;
        }
      },
      /**
       * Detects whether the given MouseEvent position is identical to the previously fired TouchEvent position.
       * If <code>true</code> the corresponding event can be identified as simulated.
       * @param x {Integer} current mouse x
       * @param y {Integer} current mouse y
       * @return {Boolean} <code>true</code> if passed mouse position is a synthetic MouseEvent.
       */
      _isSimulatedMouseEvent(x, y) {
        var touch = qx.event.handler.PointerCore.__lastTouch__P_194_0;
        if (touch) {
          var timeSinceTouch = new Date().getTime() - touch.time;
          var dist = qx.event.handler.PointerCore.SIM_MOUSE_DISTANCE;
          var distX = Math.abs(x - qx.event.handler.PointerCore.__lastTouch__P_194_0.x);
          var distY = Math.abs(y - qx.event.handler.PointerCore.__lastTouch__P_194_0.y);
          if (timeSinceTouch < qx.event.handler.PointerCore.SIM_MOUSE_DELAY) {
            if (distX < dist || distY < dist) {
              return true;
            }
          }
        }
        return false;
      },
      /**
       * Removes native pointer event listeners.
       */
      _stopObserver() {
        for (var i = 0; i < this.__eventNames__P_194_3.length; i++) {
          qx.bom.Event.removeNativeListener(this.__defaultTarget__P_194_1, this.__eventNames__P_194_3[i], this.__wrappedListener__P_194_7);
        }
      },
      /**
       * Fire a touch event with the given parameters
       *
       * @param domEvent {Event} DOM event
       * @param type {String ? null} type of the event
       * @param target {Element ? null} event target
       * @return {qx.Promise?} a promise, if one was returned by event handlers
       */
      _fireEvent(domEvent, type, target) {
        target = target || domEvent.target;
        type = type || domEvent.type;
        var gestureEvent;
        if ((domEvent.pointerType !== "mouse" || domEvent.button <= qx.event.handler.PointerCore.LEFT_BUTTON) && (type == "pointerdown" || type == "pointerup" || type == "pointermove")) {
          gestureEvent = new qx.event.type.dom.Pointer(qx.event.handler.PointerCore.POINTER_TO_GESTURE_MAPPING[type], domEvent);
          qx.event.type.dom.Pointer.normalize(gestureEvent);
          try {
            gestureEvent.srcElement = target;
          } catch (ex) {
            // Nothing - strict mode prevents writing to read only properties
          }
        }
        if (qx.core.Environment.get("event.dispatchevent")) {
          var tracker = {};
          if (!this.__nativePointerEvents__P_194_6) {
            qx.event.Utils.then(tracker, function () {
              return target.dispatchEvent(domEvent);
            });
          }
          if (gestureEvent) {
            qx.event.Utils.then(tracker, function () {
              return target.dispatchEvent(gestureEvent);
            });
          }
          return tracker.promise;
        } else {
          if (qx.core.Environment.get("browser.name") === "msie" && qx.core.Environment.get("browser.version") < 9) {
            // ensure compatibility with native events for IE8
            try {
              domEvent.srcElement = target;
            } catch (ex) {
              // Nothing - strict mode prevents writing to read only properties
            }
          }
          while (target) {
            if (target.$$emitter) {
              domEvent.currentTarget = target;
              if (!domEvent._stopped) {
                target.$$emitter.emit(type, domEvent);
              }
              if (gestureEvent && !gestureEvent._stopped) {
                gestureEvent.currentTarget = target;
                target.$$emitter.emit(gestureEvent.type, gestureEvent);
              }
            }
            target = target.parentNode;
          }
        }
      },
      /**
       * Dispose this object
       */
      dispose() {
        this._stopObserver();
        this.__defaultTarget__P_194_1 = this.__emitter__P_194_2 = null;
      }
    }
  });
  qx.event.handler.PointerCore.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.dispatch.DomBubbling": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.type.Pointer": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.type.dom.Pointer": {
        "require": true,
        "defer": "runtime"
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.handler.PointerCore": {
        "construct": true,
        "require": true
      },
      "qx.event.IEventHandler": {
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.Event": {},
      "qx.event.Utils": {},
      "qx.event.type.Data": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "browser.documentmode": {
          "className": "qx.bom.client.Browser"
        },
        "browser.name": {
          "className": "qx.bom.client.Browser"
        },
        "browser.version": {
          "className": "qx.bom.client.Browser"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christopher Zuendorf (czuendorf)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Unified pointer event handler.
   * @require(qx.event.dispatch.DomBubbling)
   * @require(qx.event.type.Pointer) // load-time dependency for early native events
   * @require(qx.event.type.dom.Pointer)
   */
  qx.Class.define("qx.event.handler.Pointer", {
    extend: qx.event.handler.PointerCore,
    implement: [qx.event.IEventHandler, qx.core.IDisposable],
    statics: {
      /** @type {Integer} Priority of this handler */
      PRIORITY: qx.event.Registration.PRIORITY_NORMAL,
      /** @type {Map} Supported event types */
      SUPPORTED_TYPES: {
        pointermove: 1,
        pointerover: 1,
        pointerout: 1,
        pointerdown: 1,
        pointerup: 1,
        pointercancel: 1,
        gesturebegin: 1,
        gesturemove: 1,
        gesturefinish: 1,
        gesturecancel: 1
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE + qx.event.IEventHandler.TARGET_DOCUMENT,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true
    },
    /**
     * Create a new instance
     *
     * @param manager {qx.event.Manager} Event manager for the window to use
     */
    construct(manager) {
      // Define shorthands
      this.__manager__P_127_0 = manager;
      this.__window__P_127_1 = manager.getWindow();
      this.__root__P_127_2 = this.__window__P_127_1.document;
      qx.event.handler.PointerCore.apply(this, [this.__root__P_127_2]);
    },
    members: {
      __manager__P_127_0: null,
      __window__P_127_1: null,
      __root__P_127_2: null,
      // interface implementation
      canHandleEvent(target, type) {},
      // interface implementation
      registerEvent(target, type, capture) {
        // Nothing needs to be done here
      },
      // interface implementation
      unregisterEvent(target, type, capture) {
        // Nothing needs to be done here
      },
      // overridden
      _initPointerObserver() {
        var useEmitter = false;
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
          // Workaround for bug #8293: Use an emitter to listen to the
          // pointer events fired by a pointer handler attached by qxWeb.
          useEmitter = true;
        }
        this._initObserver(this._onPointerEvent, useEmitter);
      },
      /**
       * Fire a pointer event with the given parameters
       *
       * @param domEvent {Event} DOM event
       * @param type {String ? null} type of the event
       * @param target {Element ? null} event target
       */
      _fireEvent(domEvent, type, target) {
        if (!target) {
          target = qx.bom.Event.getTarget(domEvent);
        }

        // respect anonymous elements
        while (target && target.getAttribute && target.getAttribute("qxanonymous")) {
          target = target.parentNode;
        }
        if (!type) {
          type = domEvent.type;
        }
        type = qx.event.handler.PointerCore.MSPOINTER_TO_POINTER_MAPPING[type] || type;
        if (target && target.nodeType) {
          qx.event.type.dom.Pointer.normalize(domEvent);
          if (qx.core.Environment.get("browser.name") === "msie" && qx.core.Environment.get("browser.version") < 9) {
            // ensure compatibility with native events for IE8
            try {
              domEvent.srcElement = target;
            } catch (ex) {
              // Nothing - cannot change properties in strict mode
            }
          }
          var tracker = {};
          var self = this;
          qx.event.Utils.track(tracker, function () {
            return qx.event.Registration.fireEvent(target, type, qx.event.type.Pointer, [domEvent, target, null, true, true]);
          });
          qx.event.Utils.then(tracker, function () {
            if ((domEvent.getPointerType() !== "mouse" || domEvent.button <= qx.event.handler.PointerCore.LEFT_BUTTON) && (type == "pointerdown" || type == "pointerup" || type == "pointermove" || type == "pointercancel")) {
              return qx.event.Registration.fireEvent(self.__root__P_127_2, qx.event.handler.PointerCore.POINTER_TO_GESTURE_MAPPING[type], qx.event.type.Pointer, [domEvent, target, null, false, false]);
            }
          });
          qx.event.Utils.then(tracker, function () {
            // Fire user action event
            return qx.event.Registration.fireEvent(self.__window__P_127_1, "useraction", qx.event.type.Data, [type]);
          });
          return tracker.promise;
        }
      },
      // overridden
      _onPointerEvent(domEvent) {
        if (domEvent._original && domEvent._original[this._processedFlag]) {
          return;
        }
        var type = qx.event.handler.PointerCore.MSPOINTER_TO_POINTER_MAPPING[domEvent.type] || domEvent.type;
        return this._fireEvent(domEvent, type, qx.bom.Event.getTarget(domEvent));
      },
      /**
       * Dispose this object
       */
      dispose() {
        this.__callBase__P_127_3("dispose");
        this.__manager__P_127_0 = this.__window__P_127_1 = this.__root__P_127_2 = null;
      },
      /**
       * Call overridden method.
       *
       * @param method {String} Name of the overridden method.
       * @param args {Array} Arguments.
       */
      __callBase__P_127_3(method, args) {
        qx.event.handler.PointerCore.prototype[method].apply(this, args || []);
      }
    },
    defer(statics) {
      qx.event.Registration.addHandler(statics);
      qx.event.Registration.getManager(document).getHandler(statics);
    }
  });
  qx.event.handler.Pointer.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.bom.client.Device": {
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.client.Event": {
        "require": true
      },
      "qx.bom.Event": {},
      "qx.bom.AnimationFrame": {},
      "qx.lang.Function": {},
      "qx.event.type.dom.Custom": {},
      "qx.util.Wheel": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.event.Timer": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "device.touch": {
          "load": true,
          "className": "qx.bom.client.Device"
        },
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "browser.documentmode": {
          "className": "qx.bom.client.Browser"
        },
        "event.mousewheel": {
          "className": "qx.bom.client.Event"
        },
        "event.dispatchevent": {
          "className": "qx.bom.client.Event"
        },
        "os.name": {
          "className": "qx.bom.client.OperatingSystem"
        },
        "os.version": {
          "className": "qx.bom.client.OperatingSystem"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christopher Zuendorf (czuendorf)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Listens for (native or synthetic) pointer events and fires events
   * for gestures like "tap" or "swipe"
   */
  qx.Bootstrap.define("qx.event.handler.GestureCore", {
    extend: Object,
    implement: [qx.core.IDisposable],
    statics: {
      TYPES: ["tap", "swipe", "longtap", "dbltap", "track", "trackstart", "trackend", "rotate", "pinch", "roll"],
      GESTURE_EVENTS: ["gesturebegin", "gesturefinish", "gesturemove", "gesturecancel"],
      /** @type {Map} Maximum distance between a pointer-down and pointer-up event, values are configurable */
      TAP_MAX_DISTANCE: {
        touch: 40,
        mouse: 5,
        pen: 20
      },
      // values are educated guesses

      /** @type {Map} Maximum distance between two subsequent taps, values are configurable */
      DOUBLETAP_MAX_DISTANCE: {
        touch: 10,
        mouse: 4,
        pen: 10
      },
      // values are educated guesses

      /** @type {Map} The direction of a swipe relative to the axis */
      SWIPE_DIRECTION: {
        x: ["left", "right"],
        y: ["up", "down"]
      },
      /**
       * @type {Integer} The time delta in milliseconds to fire a long tap event.
       */
      LONGTAP_TIME: qx.core.Environment.get("device.touch") ? 500 : 99999,
      /**
       * @type {Integer} Maximum time between two tap events that will still trigger a
       * dbltap event.
       */
      DOUBLETAP_TIME: 500,
      /**
       * @type {Integer} Factor which is used for adapting the delta of the mouse wheel
       * event to the roll events,
       */
      ROLL_FACTOR: 18,
      /**
       * @type {Integer} Factor which is used for adapting the delta of the touchpad gesture
       * event to the roll events,
       */
      TOUCHPAD_ROLL_FACTOR: 1,
      /**
       * @type {Integer} Minimum number of wheel events to receive during the
       * TOUCHPAD_WHEEL_EVENTS_PERIOD to detect a touchpad.
       */
      TOUCHPAD_WHEEL_EVENTS_THRESHOLD: 10,
      /**
       * @type {Integer} Period (in ms) during which the wheel events are counted in order
       * to detect a touchpad.
       */
      TOUCHPAD_WHEEL_EVENTS_PERIOD: 100,
      /**
       * @type {Integer} Timeout (in ms) after which the touchpad detection is reset if no wheel
       * events are received in the meantime.
       */
      TOUCHPAD_WHEEL_EVENTS_TIMEOUT: 5000
    },
    /**
     * @param target {Element} DOM Element that should fire gesture events
     * @param emitter {qx.event.Emitter?} Event emitter (used if dispatchEvent
     * is not supported, e.g. in IE8)
     */
    construct(target, emitter) {
      this.__defaultTarget__P_128_0 = target;
      this.__emitter__P_128_1 = emitter;
      this.__gesture__P_128_2 = {};
      this.__lastTap__P_128_3 = {};
      this.__stopMomentum__P_128_4 = {};
      this.__momentum__P_128_5 = {};
      this.__rollEvents__P_128_6 = [];
      this._initObserver();
    },
    members: {
      __defaultTarget__P_128_0: null,
      __emitter__P_128_1: null,
      __gesture__P_128_2: null,
      __eventName__P_128_7: null,
      __primaryTarget__P_128_8: null,
      __isMultiPointerGesture__P_128_9: null,
      __initialAngle__P_128_10: null,
      __lastTap__P_128_3: null,
      __rollImpulseId__P_128_11: null,
      __stopMomentum__P_128_4: null,
      __initialDistance__P_128_12: null,
      __momentum__P_128_5: null,
      __rollEvents__P_128_6: null,
      __rollEventsCountStart__P_128_13: 0,
      __rollEventsCount__P_128_14: 0,
      __touchPadDetectionPerformed__P_128_15: false,
      __lastRollEventTime__P_128_16: 0,
      /**
       * Register pointer event listeners
       */
      _initObserver() {
        qx.event.handler.GestureCore.GESTURE_EVENTS.forEach(function (gestureType) {
          qxWeb(this.__defaultTarget__P_128_0).on(gestureType, this.checkAndFireGesture, this);
        }.bind(this));
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
          qxWeb(this.__defaultTarget__P_128_0).on("dblclick", this._onDblClick, this);
        }

        // list to wheel events
        var data = qx.core.Environment.get("event.mousewheel");
        qxWeb(data.target).on(data.type, this._fireRoll, this);
      },
      /**
       * Remove native pointer event listeners.
       */
      _stopObserver() {
        qx.event.handler.GestureCore.GESTURE_EVENTS.forEach(function (pointerType) {
          qxWeb(this.__defaultTarget__P_128_0).off(pointerType, this.checkAndFireGesture, this);
        }.bind(this));
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
          qxWeb(this.__defaultTarget__P_128_0).off("dblclick", this._onDblClick, this);
        }
        var data = qx.core.Environment.get("event.mousewheel");
        qxWeb(data.target).off(data.type, this._fireRoll, this);
      },
      /**
       * Checks if a gesture was made and fires the gesture event.
       *
       * @param domEvent {qx.event.type.Pointer} DOM event
       * @param type {String ? null} type of the event
       * @param target {Element ? null} event target
       */
      checkAndFireGesture(domEvent, type, target) {
        if (!type) {
          type = domEvent.type;
        }
        if (!target) {
          target = qx.bom.Event.getTarget(domEvent);
        }
        if (type == "gesturebegin") {
          this.gestureBegin(domEvent, target);
        } else if (type == "gesturemove") {
          this.gestureMove(domEvent, target);
        } else if (type == "gesturefinish") {
          this.gestureFinish(domEvent, target);
        } else if (type == "gesturecancel") {
          this.gestureCancel(domEvent.pointerId);
        }
      },
      /**
       * Helper method for gesture start.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       */
      gestureBegin(domEvent, target) {
        if (this.__gesture__P_128_2[domEvent.pointerId]) {
          this.__stopLongTapTimer__P_128_17(this.__gesture__P_128_2[domEvent.pointerId]);
          delete this.__gesture__P_128_2[domEvent.pointerId];
        }

        /*
          If the dom event's target or one of its ancestors have
          a gesture handler, we don't need to fire the gesture again
          since it bubbles.
         */
        if (this._hasIntermediaryHandler(target)) {
          return;
        }
        this.__gesture__P_128_2[domEvent.pointerId] = {
          startTime: new Date().getTime(),
          lastEventTime: new Date().getTime(),
          startX: domEvent.clientX,
          startY: domEvent.clientY,
          clientX: domEvent.clientX,
          clientY: domEvent.clientY,
          velocityX: 0,
          velocityY: 0,
          target: target,
          isTap: true,
          isPrimary: domEvent.isPrimary,
          longTapTimer: window.setTimeout(this.__fireLongTap__P_128_18.bind(this, domEvent, target), qx.event.handler.GestureCore.LONGTAP_TIME)
        };
        if (domEvent.isPrimary) {
          this.__isMultiPointerGesture__P_128_9 = false;
          this.__primaryTarget__P_128_8 = target;
          this.__fireTrack__P_128_19("trackstart", domEvent, target);
        } else {
          this.__isMultiPointerGesture__P_128_9 = true;
          if (Object.keys(this.__gesture__P_128_2).length === 2) {
            this.__initialAngle__P_128_10 = this._calcAngle();
            this.__initialDistance__P_128_12 = this._calcDistance();
          }
        }
      },
      /**
       * Helper method for gesture move.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       */
      gestureMove(domEvent, target) {
        var gesture = this.__gesture__P_128_2[domEvent.pointerId];
        if (gesture) {
          var oldClientX = gesture.clientX;
          var oldClientY = gesture.clientY;
          gesture.clientX = domEvent.clientX;
          gesture.clientY = domEvent.clientY;
          gesture.lastEventTime = new Date().getTime();
          if (oldClientX) {
            gesture.velocityX = gesture.clientX - oldClientX;
          }
          if (oldClientY) {
            gesture.velocityY = gesture.clientY - oldClientY;
          }
          if (Object.keys(this.__gesture__P_128_2).length === 2) {
            this.__fireRotate__P_128_20(domEvent, gesture.target);
            this.__firePinch__P_128_21(domEvent, gesture.target);
          }
          if (!this.__isMultiPointerGesture__P_128_9) {
            this.__fireTrack__P_128_19("track", domEvent, gesture.target);
            this._fireRoll(domEvent, "touch", gesture.target);
          }

          // abort long tap timer if the distance is too big
          if (gesture.isTap) {
            gesture.isTap = this._isBelowTapMaxDistance(domEvent);
            if (!gesture.isTap) {
              this.__stopLongTapTimer__P_128_17(gesture);
            }
          }
        }
      },
      /**
       * Checks if a DOM element located between the target of a gesture
       * event and the element this handler is attached to has a gesture
       * handler of its own.
       *
       * @param target {Element} The gesture event's target
       * @return {Boolean}
       */
      _hasIntermediaryHandler(target) {
        while (target && target !== this.__defaultTarget__P_128_0) {
          if (target.$$gestureHandler) {
            return true;
          }
          target = target.parentNode;
        }
        return false;
      },
      /**
       * Helper method for gesture end.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       */
      gestureFinish(domEvent, target) {
        // If no start position is available for this pointerup event, cancel gesture recognition.
        if (!this.__gesture__P_128_2[domEvent.pointerId]) {
          return;
        }
        var gesture = this.__gesture__P_128_2[domEvent.pointerId];
        // delete the long tap
        this.__stopLongTapTimer__P_128_17(gesture);

        /*
          If the dom event's target or one of its ancestors have
          a gesture handler, we don't need to fire the gesture again
          since it bubbles.
         */
        if (this._hasIntermediaryHandler(target)) {
          return;
        }

        // always start the roll impulse on the original target
        this.__handleRollImpulse__P_128_22(gesture.velocityX, gesture.velocityY, domEvent, gesture.target);
        this.__fireTrack__P_128_19("trackend", domEvent, gesture.target);
        if (gesture.isTap) {
          if (target !== gesture.target) {
            delete this.__gesture__P_128_2[domEvent.pointerId];
            return;
          }
          this._fireEvent(domEvent, "tap", domEvent.target || target);
          var isDblTap = false;
          if (Object.keys(this.__lastTap__P_128_3).length > 0) {
            // delete old tap entries
            var limit = Date.now() - qx.event.handler.GestureCore.DOUBLETAP_TIME;
            for (var time in this.__lastTap__P_128_3) {
              if (time < limit) {
                delete this.__lastTap__P_128_3[time];
              } else {
                var lastTap = this.__lastTap__P_128_3[time];
                var isBelowDoubleTapDistance = this.__isBelowDoubleTapDistance__P_128_23(lastTap.x, lastTap.y, domEvent.clientX, domEvent.clientY, domEvent.getPointerType());
                var isSameTarget = lastTap.target === (domEvent.target || target);
                var isSameButton = lastTap.button === domEvent.button;
                if (isBelowDoubleTapDistance && isSameButton && isSameTarget) {
                  isDblTap = true;
                  delete this.__lastTap__P_128_3[time];
                  this._fireEvent(domEvent, "dbltap", domEvent.target || target);
                }
              }
            }
          }
          if (!isDblTap) {
            this.__lastTap__P_128_3[Date.now()] = {
              x: domEvent.clientX,
              y: domEvent.clientY,
              target: domEvent.target || target,
              button: domEvent.button
            };
          }
        } else if (!this._isBelowTapMaxDistance(domEvent)) {
          var swipe = this.__getSwipeGesture__P_128_24(domEvent, target);
          if (swipe) {
            domEvent.swipe = swipe;
            this._fireEvent(domEvent, "swipe", gesture.target || target);
          }
        }
        delete this.__gesture__P_128_2[domEvent.pointerId];
      },
      /**
       * Stops the momentum scrolling currently running.
       *
       * @param id {Integer} The timeoutId of a 'roll' event
       */
      stopMomentum(id) {
        this.__stopMomentum__P_128_4[id] = true;
      },
      /**
       * Cancels the gesture if running.
       * @param id {Number} The pointer Id.
       */
      gestureCancel(id) {
        if (this.__gesture__P_128_2[id]) {
          this.__stopLongTapTimer__P_128_17(this.__gesture__P_128_2[id]);
          delete this.__gesture__P_128_2[id];
        }
        if (this.__momentum__P_128_5[id]) {
          this.stopMomentum(this.__momentum__P_128_5[id]);
          delete this.__momentum__P_128_5[id];
        }
      },
      /**
       * Update the target of a running gesture. This is used in virtual widgets
       * when the DOM element changes.
       *
       * @param id {String} The pointer id.
       * @param target {Element} The new target element.
       * @internal
       */
      updateGestureTarget(id, target) {
        this.__gesture__P_128_2[id].target = target;
      },
      /**
       * Method which will be called recursively to provide a momentum scrolling.
       * @param deltaX {Number} The last offset in X direction
       * @param deltaY {Number} The last offset in Y direction
       * @param domEvent {Event} The original gesture event
       * @param target {Element} The target of the momentum roll events
       * @param time {Number ?} The time in ms between the last two calls
       */
      __handleRollImpulse__P_128_22(deltaX, deltaY, domEvent, target, time) {
        var oldTimeoutId = domEvent.timeoutId;
        if (!time && this.__momentum__P_128_5[domEvent.pointerId]) {
          // new roll impulse started, stop the old one
          this.stopMomentum(this.__momentum__P_128_5[domEvent.pointerId]);
        }
        // do nothing if we don't need to scroll
        if (Math.abs(deltaY) < 1 && Math.abs(deltaX) < 1 || this.__stopMomentum__P_128_4[oldTimeoutId] || this.getWindow && !this.getWindow()) {
          delete this.__stopMomentum__P_128_4[oldTimeoutId];
          delete this.__momentum__P_128_5[domEvent.pointerId];
          return;
        }
        if (!time) {
          time = 1;
          var startFactor = 2.8;
          deltaY = deltaY / startFactor;
          deltaX = deltaX / startFactor;
        }
        time += 0.0006;
        deltaY = deltaY / time;
        deltaX = deltaX / time;

        // set up a new timer with the new delta
        var timeoutId = qx.bom.AnimationFrame.request(qx.lang.Function.bind(function (deltaX, deltaY, domEvent, target, time) {
          this.__handleRollImpulse__P_128_22(deltaX, deltaY, domEvent, target, time);
        }, this, deltaX, deltaY, domEvent, target, time));
        deltaX = Math.round(deltaX * 100) / 100;
        deltaY = Math.round(deltaY * 100) / 100;

        // scroll the desired new delta
        domEvent.delta = {
          x: -deltaX,
          y: -deltaY
        };
        domEvent.momentum = true;
        domEvent.timeoutId = timeoutId;
        this.__momentum__P_128_5[domEvent.pointerId] = timeoutId;
        this._fireEvent(domEvent, "roll", domEvent.target || target);
      },
      /**
       * Calculates the angle of the primary and secondary pointer.
       * @return {Number} the rotation angle of the 2 pointers.
       */
      _calcAngle() {
        var pointerA = null;
        var pointerB = null;
        for (var pointerId in this.__gesture__P_128_2) {
          var gesture = this.__gesture__P_128_2[pointerId];
          if (pointerA === null) {
            pointerA = gesture;
          } else {
            pointerB = gesture;
          }
        }
        var x = pointerA.clientX - pointerB.clientX;
        var y = pointerA.clientY - pointerB.clientY;
        return (360 + Math.atan2(y, x) * (180 / Math.PI)) % 360;
      },
      /**
       * Calculates the scaling distance between two pointers.
       * @return {Number} the calculated distance.
       */
      _calcDistance() {
        var pointerA = null;
        var pointerB = null;
        for (var pointerId in this.__gesture__P_128_2) {
          var gesture = this.__gesture__P_128_2[pointerId];
          if (pointerA === null) {
            pointerA = gesture;
          } else {
            pointerB = gesture;
          }
        }
        var scale = Math.sqrt(Math.pow(pointerA.clientX - pointerB.clientX, 2) + Math.pow(pointerA.clientY - pointerB.clientY, 2));
        return scale;
      },
      /**
       * Checks if the distance between the x/y coordinates of DOM event
       * exceeds TAP_MAX_DISTANCE and returns the result.
       *
       * @param domEvent {Event} The DOM event from the browser.
       * @return {Boolean|null} true if distance is below TAP_MAX_DISTANCE.
       */
      _isBelowTapMaxDistance(domEvent) {
        var delta = this._getDeltaCoordinates(domEvent);
        var maxDistance = qx.event.handler.GestureCore.TAP_MAX_DISTANCE[domEvent.getPointerType()];
        if (!delta) {
          return null;
        }
        return Math.abs(delta.x) <= maxDistance && Math.abs(delta.y) <= maxDistance;
      },
      /**
       * Checks if the distance between the x1/y1 and x2/y2 is
       * below the TAP_MAX_DISTANCE and returns the result.
       *
       * @param x1 {Number} The x position of point one.
       * @param y1 {Number} The y position of point one.
       * @param x2 {Number} The x position of point two.
       * @param y2 {Number} The y position of point two.
       * @param type {String} The pointer type e.g. "mouse"
       * @return {Boolean} <code>true</code>, if points are in range
       */
      __isBelowDoubleTapDistance__P_128_23(x1, y1, x2, y2, type) {
        var clazz = qx.event.handler.GestureCore;
        var inX = Math.abs(x1 - x2) < clazz.DOUBLETAP_MAX_DISTANCE[type];
        var inY = Math.abs(y1 - y2) < clazz.DOUBLETAP_MAX_DISTANCE[type];
        return inX && inY;
      },
      /**
       * Calculates the delta coordinates in relation to the position on <code>pointerstart</code> event.
       * @param domEvent {Event} The DOM event from the browser.
       * @return {Map} containing the deltaX as x, and deltaY as y.
       */
      _getDeltaCoordinates(domEvent) {
        var gesture = this.__gesture__P_128_2[domEvent.pointerId];
        if (!gesture) {
          return null;
        }
        var deltaX = domEvent.clientX - gesture.startX;
        var deltaY = domEvent.clientY - gesture.startY;
        var axis = "x";
        if (Math.abs(deltaX / deltaY) < 1) {
          axis = "y";
        }
        return {
          x: deltaX,
          y: deltaY,
          axis: axis
        };
      },
      /**
       * Fire a gesture event with the given parameters
       *
       * @param domEvent {Event} DOM event
       * @param type {String} type of the event
       * @param target {Element ? null} event target
       * @return {qx.Promise?} a promise, if one or more of the event handlers returned a promise
       */
      _fireEvent(domEvent, type, target) {
        // The target may have been removed, e.g. menu hide on tap
        if (!this.__defaultTarget__P_128_0) {
          return;
        }
        var evt;
        if (qx.core.Environment.get("event.dispatchevent")) {
          evt = new qx.event.type.dom.Custom(type, domEvent, {
            bubbles: true,
            swipe: domEvent.swipe,
            scale: domEvent.scale,
            angle: domEvent.angle,
            delta: domEvent.delta,
            pointerType: domEvent.pointerType,
            momentum: domEvent.momentum
          });
          return target.dispatchEvent(evt);
        } else if (this.__emitter__P_128_1) {
          evt = new qx.event.type.dom.Custom(type, domEvent, {
            target: this.__defaultTarget__P_128_0,
            currentTarget: this.__defaultTarget__P_128_0,
            srcElement: this.__defaultTarget__P_128_0,
            swipe: domEvent.swipe,
            scale: domEvent.scale,
            angle: domEvent.angle,
            delta: domEvent.delta,
            pointerType: domEvent.pointerType,
            momentum: domEvent.momentum
          });
          this.__emitter__P_128_1.emit(type, domEvent);
        }
      },
      /**
       * Fire "tap" and "dbltap" events after a native "dblclick"
       * event to fix IE 8's broken mouse event sequence.
       *
       * @param domEvent {Event} dblclick event
       */
      _onDblClick(domEvent) {
        var target = qx.bom.Event.getTarget(domEvent);
        this._fireEvent(domEvent, "tap", target);
        this._fireEvent(domEvent, "dbltap", target);
      },
      /**
       * Returns the swipe gesture when the user performed a swipe.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       * @return {Map|null} returns the swipe data when the user performed a swipe, null if the gesture was no swipe.
       */
      __getSwipeGesture__P_128_24(domEvent, target) {
        var gesture = this.__gesture__P_128_2[domEvent.pointerId];
        if (!gesture) {
          return null;
        }
        var clazz = qx.event.handler.GestureCore;
        var deltaCoordinates = this._getDeltaCoordinates(domEvent);
        var duration = new Date().getTime() - gesture.startTime;
        var axis = Math.abs(deltaCoordinates.x) >= Math.abs(deltaCoordinates.y) ? "x" : "y";
        var distance = deltaCoordinates[axis];
        var direction = clazz.SWIPE_DIRECTION[axis][distance < 0 ? 0 : 1];
        var velocity = duration !== 0 ? distance / duration : 0;
        var swipe = {
          startTime: gesture.startTime,
          duration: duration,
          axis: axis,
          direction: direction,
          distance: distance,
          velocity: velocity
        };
        return swipe;
      },
      /**
       * Fires a track event.
       *
       * @param type {String} the track type
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       */
      __fireTrack__P_128_19(type, domEvent, target) {
        domEvent.delta = this._getDeltaCoordinates(domEvent);
        this._fireEvent(domEvent, type, domEvent.target || target);
      },
      /**
       * Fires a roll event.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       * @param rollFactor {Integer} the roll factor to apply
       */
      __fireRollEvent__P_128_25(domEvent, target, rollFactor) {
        domEvent.delta = {
          x: qx.util.Wheel.getDelta(domEvent, "x") * rollFactor,
          y: qx.util.Wheel.getDelta(domEvent, "y") * rollFactor
        };
        domEvent.delta.axis = Math.abs(domEvent.delta.x / domEvent.delta.y) < 1 ? "y" : "x";
        domEvent.pointerType = "wheel";
        this._fireEvent(domEvent, "roll", domEvent.target || target);
      },
      /**
       * Triggers the adaptative roll scrolling.
       *
       * @param target {Element} event target
       */
      __performAdaptativeRollScrolling__P_128_26(target) {
        var rollFactor = qx.event.handler.GestureCore.ROLL_FACTOR;
        if (qx.util.Wheel.IS_TOUCHPAD) {
          // The domEvent was generated by a touchpad
          rollFactor = qx.event.handler.GestureCore.TOUCHPAD_ROLL_FACTOR;
        }
        this.__lastRollEventTime__P_128_16 = new Date().getTime();
        var reLength = this.__rollEvents__P_128_6.length;
        for (var i = 0; i < reLength; i++) {
          var domEvent = this.__rollEvents__P_128_6[i];
          this.__fireRollEvent__P_128_25(domEvent, target, rollFactor);
        }
        this.__rollEvents__P_128_6 = [];
      },
      /**
       * Ends touch pad detection process.
       */
      __endTouchPadDetection__P_128_27() {
        if (this.__rollEvents__P_128_6.length > qx.event.handler.GestureCore.TOUCHPAD_WHEEL_EVENTS_THRESHOLD) {
          qx.util.Wheel.IS_TOUCHPAD = true;
        } else {
          qx.util.Wheel.IS_TOUCHPAD = false;
        }
        this.__touchPadDetectionPerformed__P_128_15 = true;
      },
      /**
       * Is touchpad detection enabled ? Default implementation activates it only for Mac OS after Sierra (>= 10.12).
       * @return {boolean} true if touchpad detection should occur.
       * @internal
       */
      _isTouchPadDetectionEnabled() {
        return qx.core.Environment.get("os.name") == "osx" && qx.core.Environment.get("os.version") >= 10.12;
      },
      /**
       * Fires a roll event after determining the roll factor to apply. Mac OS Sierra (10.12+)
       * introduces a lot more wheel events fired from the trackpad, so the roll factor to be applied
       * has to be reduced in order to make the scrolling less sensitive.
       *
       * @param domEvent {Event} DOM event
       * @param type {String} The type of the dom event
       * @param target {Element} event target
       */
      _fireRoll(domEvent, type, target) {
        var now;
        var detectionTimeout;
        if (domEvent.type === qx.core.Environment.get("event.mousewheel").type) {
          if (this._isTouchPadDetectionEnabled()) {
            now = new Date().getTime();
            detectionTimeout = qx.event.handler.GestureCore.TOUCHPAD_WHEEL_EVENTS_TIMEOUT;
            if (this.__lastRollEventTime__P_128_16 > 0 && now - this.__lastRollEventTime__P_128_16 > detectionTimeout) {
              // The detection timeout was reached. A new detection step should occur.
              this.__touchPadDetectionPerformed__P_128_15 = false;
              this.__rollEvents__P_128_6 = [];
              this.__lastRollEventTime__P_128_16 = 0;
            }
            if (!this.__touchPadDetectionPerformed__P_128_15) {
              // We are into a detection session. We count the events so that we can decide if
              // they were fired by a real mouse wheel or a touchpad. Just swallow them until the
              // detection period is over.
              if (this.__rollEvents__P_128_6.length === 0) {
                // detection starts
                this.__rollEventsCountStart__P_128_13 = now;
                qx.event.Timer.once(function () {
                  if (!this.__touchPadDetectionPerformed__P_128_15) {
                    // There were not enough events during the TOUCHPAD_WHEEL_EVENTS_PERIOD to actually
                    // trigger a scrolling. Trigger it manually.
                    this.__endTouchPadDetection__P_128_27();
                    this.__performAdaptativeRollScrolling__P_128_26(target);
                  }
                }, this, qx.event.handler.GestureCore.TOUCHPAD_WHEEL_EVENTS_PERIOD + 50);
              }
              this.__rollEvents__P_128_6.push(domEvent);
              this.__rollEventsCount__P_128_14++;
              if (now - this.__rollEventsCountStart__P_128_13 > qx.event.handler.GestureCore.TOUCHPAD_WHEEL_EVENTS_PERIOD) {
                this.__endTouchPadDetection__P_128_27();
              }
            }
            if (this.__touchPadDetectionPerformed__P_128_15) {
              if (this.__rollEvents__P_128_6.length === 0) {
                this.__rollEvents__P_128_6.push(domEvent);
              }
              // Detection is done. We can now decide the roll factor to apply to the delta.
              // Default to a real mouse wheel event as opposed to a touchpad one.
              this.__performAdaptativeRollScrolling__P_128_26(target);
            }
          } else {
            this.__fireRollEvent__P_128_25(domEvent, target, qx.event.handler.GestureCore.ROLL_FACTOR);
          }
        } else {
          var gesture = this.__gesture__P_128_2[domEvent.pointerId];
          domEvent.delta = {
            x: -gesture.velocityX,
            y: -gesture.velocityY,
            axis: Math.abs(gesture.velocityX / gesture.velocityY) < 1 ? "y" : "x"
          };
          this._fireEvent(domEvent, "roll", domEvent.target || target);
        }
      },
      /**
       * Fires a rotate event.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       */
      __fireRotate__P_128_20(domEvent, target) {
        if (!domEvent.isPrimary) {
          var angle = this._calcAngle();
          domEvent.angle = Math.round((angle - this.__initialAngle__P_128_10) % 360);
          this._fireEvent(domEvent, "rotate", this.__primaryTarget__P_128_8);
        }
      },
      /**
       * Fires a pinch event.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       */
      __firePinch__P_128_21(domEvent, target) {
        if (!domEvent.isPrimary) {
          var distance = this._calcDistance();
          var scale = distance / this.__initialDistance__P_128_12;
          domEvent.scale = Math.round(scale * 100) / 100;
          this._fireEvent(domEvent, "pinch", this.__primaryTarget__P_128_8);
        }
      },
      /**
       * Fires the long tap event.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       */
      __fireLongTap__P_128_18(domEvent, target) {
        var gesture = this.__gesture__P_128_2[domEvent.pointerId];
        if (gesture) {
          this._fireEvent(domEvent, "longtap", domEvent.target || target);
          gesture.longTapTimer = null;
          gesture.isTap = false;
        }
      },
      /**
       * Stops the time for the long tap event.
       * @param gesture {Map} Data may representing the gesture.
       */
      __stopLongTapTimer__P_128_17(gesture) {
        if (gesture.longTapTimer) {
          window.clearTimeout(gesture.longTapTimer);
          gesture.longTapTimer = null;
        }
      },
      /**
       * Dispose the current instance
       */
      dispose() {
        for (var gesture in this.__gesture__P_128_2) {
          this.__stopLongTapTimer__P_128_17(gesture);
        }
        this._stopObserver();
        this.__defaultTarget__P_128_0 = this.__emitter__P_128_1 = null;
      }
    }
  });
  qx.event.handler.GestureCore.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Pointer": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Tino Butz (tbtz)
  
  ************************************************************************ */

  /**
   * Tap is a single pointer gesture fired when one pointer goes down and up on
   * the same location.
   */
  qx.Class.define("qx.event.type.Tap", {
    extend: qx.event.type.Pointer
  });
  qx.event.type.Tap.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Pointer": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Tino Butz (tbtz)
  
  ************************************************************************ */

  /**
   * Swipe is a single pointer gesture fired when a pointer is moved in one direction.
   * It contains some additional data like the primary axis, the velocity and the distance.
   */
  qx.Class.define("qx.event.type.Swipe", {
    extend: qx.event.type.Pointer,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Swipe.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        clone.swipe = nativeEvent.swipe;
        return clone;
      },
      /**
       * Returns the start time of the performed swipe.
       *
       * @return {Integer} the start time
       */
      getStartTime() {
        return this._native.swipe.startTime;
      },
      /**
       * Returns the duration the performed swipe took.
       *
       * @return {Integer} the duration
       */
      getDuration() {
        return this._native.swipe.duration;
      },
      /**
       * Returns whether the performed swipe was on the x or y axis.
       *
       * @return {String} "x"/"y" axis
       */
      getAxis() {
        return this._native.swipe.axis;
      },
      /**
       * Returns the direction of the performed swipe in reference to the axis.
       * y = up / down
       * x = left / right
       *
       * @return {String} the direction
       */
      getDirection() {
        return this._native.swipe.direction;
      },
      /**
       * Returns the velocity of the performed swipe.
       *
       * @return {Number} the velocity
       */
      getVelocity() {
        return this._native.swipe.velocity;
      },
      /**
       * Returns the distance of the performed swipe.
       *
       * @return {Integer} the distance
       */
      getDistance() {
        return this._native.swipe.distance;
      }
    }
  });
  qx.event.type.Swipe.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Pointer": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christopher Zuendorf (czuendorf)
  
  ************************************************************************ */

  /**
   * Rotate is a multi pointer gesture fired when two finger moved around
   * a single point. It contains the angle of the rotation.
   */
  qx.Class.define("qx.event.type.Rotate", {
    extend: qx.event.type.Pointer,
    members: {
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Rotate.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        clone.angle = nativeEvent.angle;
        return clone;
      },
      /**
       * Returns a number with the current calculated angle between the primary and secondary active pointers.
       *
       * @return {Number} the angle of the two active pointers.
       */
      getAngle() {
        return this._native.angle;
      }
    }
  });
  qx.event.type.Rotate.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Pointer": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christopher Zuendorf (czuendorf)
  
  ************************************************************************ */

  /**
   * Pinch is a multi pointer gesture fired when two finger moved towards
   * or away from each other. It contains the scaling factor of the pinch.
   */
  qx.Class.define("qx.event.type.Pinch", {
    extend: qx.event.type.Pointer,
    members: {
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Pinch.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        clone.scale = nativeEvent.scale;
        return clone;
      },
      /**
       * Returns the calculated scale of this event.
       *
       * @return {Float} the scale value of this event.
       */
      getScale() {
        return this._native.scale;
      }
    }
  });
  qx.event.type.Pinch.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Pointer": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christopher Zuendorf (czuendorf)
  
  ************************************************************************ */

  /**
   * Track is a single pointer gesture and contains of a three vent types:
   * <code>trackstart</code>, <code>track</code> and <code>trackend</code>. These
   * events will be fired when a pointer grabs an item and moves the pointer on it.
   */
  qx.Class.define("qx.event.type.Track", {
    extend: qx.event.type.Pointer,
    members: {
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Track.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        clone.delta = nativeEvent.delta;
        return clone;
      },
      /**
       * Returns a map with the calculated delta coordinates and axis,
       * relative to the position on <code>trackstart</code> event.
       *
       * @return {Map} a map with contains the delta as <code>x</code> and
       * <code>y</code> and the movement axis as <code>axis</code>.
       */
      getDelta() {
        return this._native.delta;
      }
    }
  });
  qx.event.type.Track.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Pointer": {
        "require": true
      },
      "qx.event.Registration": {},
      "qx.event.handler.Gesture": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * Roll event object.
   */
  qx.Class.define("qx.event.type.Roll", {
    extend: qx.event.type.Pointer,
    members: {
      // overridden
      stop() {
        this.stopPropagation();
        this.preventDefault();
      },
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Roll.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        clone.delta = nativeEvent.delta;
        clone.momentum = nativeEvent.momentum;
        clone.timeoutId = nativeEvent.timeoutId;
        return clone;
      },
      /**
       * Boolean flag to indicate if this event was triggered by a momentum.
       * @return {Boolean} <code>true</code>, if the event is momentum based
       */
      getMomentum() {
        return this._native.momentum;
      },
      /**
       * Stops the momentum events.
       */
      stopMomentum() {
        if (this._native.timeoutId) {
          qx.event.Registration.getManager(this._originalTarget).getHandler(qx.event.handler.Gesture).stopMomentum(this._native.timeoutId);
        }
      },
      /**
       * Returns a map with the calculated delta coordinates and axis,
       * relative to the last <code>roll</code> event.
       *
       * @return {Map} a map with contains the delta as <code>x</code> and
       * <code>y</code>
       */
      getDelta() {
        return this._native.delta;
      }
    }
  });
  qx.event.type.Roll.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.Pointer": {
        "require": true,
        "defer": "runtime"
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.handler.GestureCore": {
        "construct": true,
        "require": true
      },
      "qx.event.IEventHandler": {
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.event.type.Tap": {
        "require": true
      },
      "qx.event.type.Swipe": {
        "require": true
      },
      "qx.event.type.Rotate": {
        "require": true
      },
      "qx.event.type.Pinch": {
        "require": true
      },
      "qx.event.type.Track": {
        "require": true
      },
      "qx.event.type.Roll": {
        "require": true
      },
      "qx.lang.Function": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.Event": {},
      "qx.bom.client.Event": {},
      "qx.event.type.Pointer": {},
      "qx.event.type.Data": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "browser.documentmode": {
          "className": "qx.bom.client.Browser"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Unified gesture event handler.
   *
   * @require(qx.event.handler.Pointer)
   */
  qx.Class.define("qx.event.handler.Gesture", {
    extend: qx.event.handler.GestureCore,
    implement: [qx.event.IEventHandler, qx.core.IDisposable],
    statics: {
      /** @type {Integer} Priority of this handler */
      PRIORITY: qx.event.Registration.PRIORITY_NORMAL,
      /** @type {Map} Supported event types */
      SUPPORTED_TYPES: {
        tap: 1,
        swipe: 1,
        longtap: 1,
        dbltap: 1,
        rotate: 1,
        pinch: 1,
        track: 1,
        trackstart: 1,
        trackend: 1,
        roll: 1
      },
      GESTURE_EVENTS: ["gesturebegin", "gesturefinish", "gesturemove", "gesturecancel"],
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE + qx.event.IEventHandler.TARGET_DOCUMENT,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true,
      EVENT_CLASSES: {
        tap: qx.event.type.Tap,
        longtap: qx.event.type.Tap,
        dbltap: qx.event.type.Tap,
        swipe: qx.event.type.Swipe,
        rotate: qx.event.type.Rotate,
        pinch: qx.event.type.Pinch,
        track: qx.event.type.Track,
        trackstart: qx.event.type.Track,
        trackend: qx.event.type.Track,
        roll: qx.event.type.Roll
      }
    },
    /**
     * Create a new instance
     *
     * @param manager {qx.event.Manager} Event manager for the window to use
     */
    construct(manager) {
      // Define shorthands
      this.__manager__P_62_0 = manager;
      this.__window__P_62_1 = manager.getWindow();
      this.__root__P_62_2 = this.__window__P_62_1.document;
      qx.event.handler.GestureCore.apply(this, [this.__root__P_62_2]);
    },
    members: {
      __manager__P_62_0: null,
      __window__P_62_1: null,
      __root__P_62_2: null,
      __listener__P_62_3: null,
      __onDblClickWrapped__P_62_4: null,
      __fireRollWrapped__P_62_5: null,
      /**
       * Getter for the internal __window object
       * @return {Window} DOM window instance
       */
      getWindow() {
        return this.__window__P_62_1;
      },
      // interface implementation
      canHandleEvent(target, type) {},
      // interface implementation
      registerEvent(target, type, capture) {
        // Nothing needs to be done here
      },
      // interface implementation
      unregisterEvent(target, type, capture) {
        // Nothing needs to be done here
      },
      // overridden
      _initObserver() {
        this.__listener__P_62_3 = qx.lang.Function.listener(this.checkAndFireGesture, this);
        qx.event.handler.Gesture.GESTURE_EVENTS.forEach(function (type) {
          qx.event.Registration.addListener(this.__root__P_62_2, type, this.__listener__P_62_3, this);
        }.bind(this));
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
          this.__onDblClickWrapped__P_62_4 = qx.lang.Function.listener(this._onDblClick, this);
          qx.bom.Event.addNativeListener(this.__root__P_62_2, "dblclick", this.__onDblClickWrapped__P_62_4);
        }

        // list to wheel events
        var data = qx.bom.client.Event.getMouseWheel(this.__window__P_62_1);
        this.__fireRollWrapped__P_62_5 = qx.lang.Function.listener(this._fireRoll, this);
        // replaced the useCapture (4th parameter) from this to true
        // see https://github.com/qooxdoo/qooxdoo/pull/9292
        qx.bom.Event.addNativeListener(data.target, data.type, this.__fireRollWrapped__P_62_5, true, false);
      },
      /**
       * Checks if a gesture was made and fires the gesture event.
       *
       * @param pointerEvent {qx.event.type.Pointer} Pointer event
       * @param type {String ? null} type of the event
       * @param target {Element ? null} event target
       */
      checkAndFireGesture(pointerEvent, type, target) {
        this.__callBase__P_62_6("checkAndFireGesture", [pointerEvent.getNativeEvent(), pointerEvent.getType(), pointerEvent.getTarget()]);
      },
      // overridden
      _stopObserver() {
        qx.event.handler.Gesture.GESTURE_EVENTS.forEach(function (type) {
          qx.event.Registration.removeListener(this.__root__P_62_2, type, this.__listener__P_62_3);
        }.bind(this));
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
          qx.bom.Event.removeNativeListener(this.__root__P_62_2, "dblclick", this.__onDblClickWrapped__P_62_4);
        }
        var data = qx.bom.client.Event.getMouseWheel(this.__window__P_62_1);
        qx.bom.Event.removeNativeListener(data.target, data.type, this.__fireRollWrapped__P_62_5);
      },
      // overridden
      _hasIntermediaryHandler(target) {
        /* This check is irrelevant for qx.Desktop since there is only one
           gesture handler */
        return false;
      },
      /**
       * Fire a touch event with the given parameters
       *
       * @param domEvent {Event} DOM event
       * @param type {String ? null} type of the event
       * @param target {Element ? null} event target
       */
      _fireEvent(domEvent, type, target) {
        if (!target) {
          target = qx.bom.Event.getTarget(domEvent);
        }
        if (!type) {
          type = domEvent.type;
        }
        var eventTypeClass = qx.event.handler.Gesture.EVENT_CLASSES[type] || qx.event.type.Pointer;
        if (target && target.nodeType) {
          qx.event.Registration.fireEvent(target, type, eventTypeClass, [domEvent, target, null, true, true]);
        }

        // Fire user action event
        qx.event.Registration.fireEvent(this.__window__P_62_1, "useraction", qx.event.type.Data, [type]);
      },
      /**
       * Dispose this object
       */
      dispose() {
        this._stopObserver();
        this.__callBase__P_62_6("dispose");
        this.__manager__P_62_0 = this.__window__P_62_1 = this.__root__P_62_2 = this.__onDblClickWrapped__P_62_4 = null;
      },
      /**
       * Call overridden method.
       *
       * @param method {String} Name of the overridden method.
       * @param args {Array} Arguments.
       */
      __callBase__P_62_6(method, args) {
        qx.event.handler.GestureCore.prototype[method].apply(this, args || []);
      }
    },
    defer(statics) {
      qx.event.Registration.addHandler(statics);
      qx.event.Registration.addListener(window, "appinitialized", () => {
        qx.event.Registration.getManager(document).getHandler(statics);
      });
    }
  });
  qx.event.handler.Gesture.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.Window": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.handler.Keyboard": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.handler.Gesture": {
        "require": true,
        "defer": "runtime"
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.Stylesheet": {},
      "qx.log.Logger": {},
      "qx.core.ObjectRegistry": {},
      "qx.event.Registration": {
        "defer": "runtime"
      },
      "qx.log.appender.Formatter": {},
      "qx.event.type.Tap": {},
      "qx.event.type.Pointer": {},
      "qx.dom.Hierarchy": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * Feature-rich console appender for the qooxdoo logging system.
   *
   * Creates a small inline element which is placed in the top-right corner
   * of the window. Prints all messages with a nice color highlighting.
   *
   * * Allows user command inputs.
   * * Command history enabled by default (Keyboard up/down arrows).
   * * Lazy creation on first open.
   * * Clearing the console using a button.
   * * Display of offset (time after loading) of each message
   * * Supports keyboard shortcuts F7 or Ctrl+D to toggle the visibility
   *
   * Note this class must be disposed of after use
   *
   * @require(qx.event.handler.Window)
   * @require(qx.event.handler.Keyboard)
   * @require(qx.event.handler.Gesture)
   */
  qx.Class.define("qx.log.appender.Console", {
    statics: {
      /*
      ---------------------------------------------------------------------------
        INITIALIZATION AND SHUTDOWN
      ---------------------------------------------------------------------------
      */

      __main__P_7_0: null,
      __log__P_7_1: null,
      __cmd__P_7_2: null,
      __lastCommand__P_7_3: null,
      /**
       * Initializes the console, building HTML and pushing last
       * log messages to the output window.
       *
       */
      init() {
        // Build style sheet content
        var style = [".qxconsole{z-index:10000;width:600px;height:300px;top:0px;right:0px;position:absolute;border-left:1px solid black;color:black;border-bottom:1px solid black;color:black;font-family:Consolas,Monaco,monospace;font-size:11px;line-height:1.2;}", ".qxconsole .control{background:#cdcdcd;border-bottom:1px solid black;padding:4px 8px;}", ".qxconsole .control a{text-decoration:none;color:black;}", ".qxconsole .messages{background:white;height:100%;width:100%;overflow:auto;}", ".qxconsole .messages div{padding:0px 4px;}", ".qxconsole .messages .user-command{color:blue}", ".qxconsole .messages .user-result{background:white}", ".qxconsole .messages .user-error{background:#FFE2D5}", ".qxconsole .messages .level-debug{background:white}", ".qxconsole .messages .level-info{background:#DEEDFA}", ".qxconsole .messages .level-warn{background:#FFF7D5}", ".qxconsole .messages .level-error{background:#FFE2D5}", ".qxconsole .messages .level-user{background:#E3EFE9}", ".qxconsole .messages .type-string{color:black;font-weight:normal;}", ".qxconsole .messages .type-number{color:#155791;font-weight:normal;}", ".qxconsole .messages .type-boolean{color:#15BC91;font-weight:normal;}", ".qxconsole .messages .type-array{color:#CC3E8A;font-weight:bold;}", ".qxconsole .messages .type-map{color:#CC3E8A;font-weight:bold;}", ".qxconsole .messages .type-key{color:#565656;font-style:italic}", ".qxconsole .messages .type-class{color:#5F3E8A;font-weight:bold}", ".qxconsole .messages .type-instance{color:#565656;font-weight:bold}", ".qxconsole .messages .type-stringify{color:#565656;font-weight:bold}", ".qxconsole .command{background:white;padding:2px 4px;border-top:1px solid black;}", ".qxconsole .command input{width:100%;border:0 none;font-family:Consolas,Monaco,monospace;font-size:11px;line-height:1.2;}", ".qxconsole .command input:focus{outline:none;}"];

        // Include stylesheet
        qx.bom.Stylesheet.createElement(style.join(""));

        // Build markup
        var markup = ['<div class="qxconsole">', '<div class="control"><a href="javascript:qx.log.appender.Console.clear()">Clear</a> | <a href="javascript:qx.log.appender.Console.toggle()">Hide</a></div>', '<div class="messages">', "</div>", '<div class="command">', '<input type="text"/>', "</div>", "</div>"];

        // Insert HTML to access DOM node
        var wrapper = document.createElement("DIV");
        wrapper.innerHTML = markup.join("");
        var main = wrapper.firstChild;
        document.body.appendChild(wrapper.firstChild);

        // Make important DOM nodes available
        this.__main__P_7_0 = main;
        this.__log__P_7_1 = main.childNodes[1];
        this.__cmd__P_7_2 = main.childNodes[2].firstChild;

        // Correct height of messages frame
        this.__onResize__P_7_4();

        // Finally register to log engine
        qx.log.Logger.register(this);

        // Register to object manager
        qx.core.ObjectRegistry.register(this);
      },
      /**
       * Used by the object registry to dispose this instance e.g. remove listeners etc.
       *
       */
      dispose() {
        qx.event.Registration.removeListener(document.documentElement, "keypress", this.__onKeyPress__P_7_5, this);
        qx.log.Logger.unregister(this);
      },
      /*
      ---------------------------------------------------------------------------
        INSERT & CLEAR
      ---------------------------------------------------------------------------
      */

      /**
       * Clears the current console output.
       *
       */
      clear() {
        // Remove all messages
        this.__log__P_7_1.innerHTML = "";
      },
      /**
       * Processes a single log entry
       *
       * @signature function(entry)
       * @param entry {Map} The entry to process
       */
      process(entry) {
        // Append new content
        var formatter = qx.log.appender.Formatter.getFormatter();
        this.__log__P_7_1.appendChild(formatter.toHtml(entry));

        // Scroll down
        this.__scrollDown__P_7_6();
      },
      /**
       * Automatically scroll down to the last line
       */
      __scrollDown__P_7_6() {
        this.__log__P_7_1.scrollTop = this.__log__P_7_1.scrollHeight;
      },
      /*
      ---------------------------------------------------------------------------
        VISIBILITY TOGGLING
      ---------------------------------------------------------------------------
      */

      /** @type {Boolean} Flag to store last visibility status */
      __visible__P_7_7: true,
      /**
       * Toggles the visibility of the console between visible and hidden.
       *
       */
      toggle() {
        if (!this.__main__P_7_0) {
          this.init();
        } else if (this.__main__P_7_0.style.display == "none") {
          this.show();
        } else {
          this.__main__P_7_0.style.display = "none";
        }
      },
      /**
       * Shows the console.
       *
       */
      show() {
        if (!this.__main__P_7_0) {
          this.init();
        } else {
          this.__main__P_7_0.style.display = "block";
          this.__log__P_7_1.scrollTop = this.__log__P_7_1.scrollHeight;
        }
      },
      /*
      ---------------------------------------------------------------------------
        COMMAND LINE SUPPORT
      ---------------------------------------------------------------------------
      */

      /** @type {Array} List of all previous commands. */
      __history__P_7_8: [],
      /**
       * Executes the currently given command
       *
       */
      execute() {
        var value = this.__cmd__P_7_2.value;
        if (value == "") {
          return;
        }
        if (value == "clear") {
          this.clear();
          return;
        }
        var command = document.createElement("div");
        var formatter = qx.log.appender.Formatter.getFormatter();
        command.innerHTML = formatter.escapeHTML(">>> " + value);
        command.className = "user-command";
        this.__history__P_7_8.push(value);
        this.__lastCommand__P_7_3 = this.__history__P_7_8.length;
        this.__log__P_7_1.appendChild(command);
        this.__scrollDown__P_7_6();
        try {
          var ret = window.eval(value);
        } catch (ex) {
          qx.log.Logger.error(ex);
        }
        if (ret !== undefined) {
          qx.log.Logger.debug(ret);
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Event handler for resize listener
       *
       * @param e {Event} Event object
       */
      __onResize__P_7_4(e) {
        this.__log__P_7_1.style.height = this.__main__P_7_0.clientHeight - this.__main__P_7_0.firstChild.offsetHeight - this.__main__P_7_0.lastChild.offsetHeight + "px";
      },
      /**
       * Event handler for keydown listener
       *
       * @param e {Event} Event object
       */
      __onKeyPress__P_7_5(e) {
        if (e instanceof qx.event.type.Tap || e instanceof qx.event.type.Pointer) {
          var target = e.getTarget();
          if (target && target.className && target.className.indexOf && target.className.indexOf("navigationbar") != -1) {
            this.toggle();
          }
          return;
        }
        var iden = e.getKeyIdentifier();

        // Console toggling
        if (iden == "F7" || iden == "D" && e.isCtrlPressed()) {
          this.toggle();
          e.preventDefault();
        }

        // Not yet created
        if (!this.__main__P_7_0) {
          return;
        }

        // Active element not in console
        if (!qx.dom.Hierarchy.contains(this.__main__P_7_0, e.getTarget())) {
          return;
        }

        // Command execution
        if (iden == "Enter" && this.__cmd__P_7_2.value != "") {
          this.execute();
          this.__cmd__P_7_2.value = "";
        }

        // History management
        if (iden == "Up" || iden == "Down") {
          this.__lastCommand__P_7_3 += iden == "Up" ? -1 : 1;
          this.__lastCommand__P_7_3 = Math.min(Math.max(0, this.__lastCommand__P_7_3), this.__history__P_7_8.length);
          var entry = this.__history__P_7_8[this.__lastCommand__P_7_3];
          this.__cmd__P_7_2.value = entry || "";
          this.__cmd__P_7_2.select();
        }
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      qx.event.Registration.addListener(document.documentElement, "keypress", statics.__onKeyPress__P_7_5, statics);
      qx.event.Registration.addListener(document.documentElement, "longtap", statics.__onKeyPress__P_7_5, statics);
    }
  });
  qx.log.appender.Console.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.Part": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The part loader knows about all generated packages and parts.
   *
   * It contains functionality to load parts and to retrieve part instances.
   */
  qx.Class.define("qx.io.PartLoader", {
    type: "singleton",
    extend: qx.core.Object,
    construct() {
      qx.core.Object.constructor.call(this);
      var loader = this._loader = qx.Part.getInstance();
      var self = this;
      loader.onpart = function (part) {
        if (part.getReadyState() == "complete") {
          self.fireDataEvent("partLoaded", part);
        } else {
          self.fireDataEvent("partLoadingError", part.getName());
        }
      };
    },
    events: {
      /**
       * Fired if a parts was loaded. The data of the event instance point to the
       * loaded part instance.
       */
      partLoaded: "qx.event.type.Data",
      /**
       * Fired if a part could not be loaded. The event's
       * {@link qx.event.type.Data#getData} method returns the name of the failed
       * part.
       */
      partLoadingError: "qx.event.type.Data"
    },
    statics: {
      /**
       * Loads one or more parts asynchronously. The callback is called after all
       * parts and their dependencies are fully loaded. If the parts are already
       * loaded the callback is called immediately.
       *
       * @param partNames {String[]} List of parts names to load as defined in the
       *    config file at compile time.
       * @param callback {Function} Function to execute on completion.
       *   The function has one parameter which is an array of ready states of
       *   the parts specified in the partNames argument.
       * @param self {Object?window} Context to execute the given function in
       */
      require(partNames, callback, self) {
        this.getInstance().require(partNames, callback, self);
      }
    },
    members: {
      /**
       * Loads one or more parts asynchronously. The callback is called after all
       * parts and their dependencies are fully loaded. If the parts are already
       * loaded the callback is called immediately.
       *
       * @param partNames {String|String[]} List of parts names to load as defined
       *    in the config file at compile time. The method also accepts a single
       *    string as parameter to only load one part.
       * @param callback {Function} Function to execute on completion
       * @param self {Object?window} Context to execute the given function in
       */
      require(partNames, callback, self) {
        this._loader.require(partNames, callback, self);
      },
      /**
       * Get the part instance of the part with the given name.
       *
       * @param name {String} Name of the part as defined in the config file at
       *    compile time.
       * @return {qx.io.part.Part} The corresponding part instance
       */
      getPart(name) {
        return this.getParts()[name];
      },
      /**
       * Checks if a part with the given name is available.
       * @param name {String} Name of the part as defined in the config file at
       *    compile time.
       * @return {Boolean} <code>true</code>, if the part is available
       */
      hasPart(name) {
        return this.getPart(name) !== undefined;
      },
      /**
       * Returns a map of all known parts.
       * @return {Map} Map containing all parts.
       */
      getParts() {
        return this._loader.getParts();
      }
    }
  });
  qx.io.PartLoader.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2017 Martijn Evers, The Netherlands
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martijn Evers (mever)
  
  ************************************************************************ */

  /**
   * Field interface.
   *
   * This interface allows any value to be set as long as the following constraint
   * is met: any value returned by {@link getValue} can be set by {@link setValue}.
   *
   * This specifies the interface for handling the model value of a field.
   * The model value is always in a consistent state (see duration example), and
   * should only handle model values of a type that correctly represents the
   * data available through its UI. E.g.: duration can ideally be modeled by a number
   * of time units, like seconds. When using a date the duration may be
   * unclear (since Unix time?). Type conversions should be handled by data binding.
   *
   * The model value is not necessary what is shown to the end-user
   * by implementing class. A good example is the {@link qx.ui.form.TextField}
   * which is able to operate with or without live updating the model value.
   *
   * Duration example: a field for duration may use two date pickers for begin
   * and end dates. When the end date is before the start date the model is in
   * inconsistent state. getValue should never return such state. And calling
   * it must result in either null or the last consistent value (depending
   * on implementation or setting).
   */
  qx.Interface.define("qx.ui.form.IField", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired when the model value was modified */
      changeValue: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        VALUE PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the field model value. Should also update the UI.
       *
       * @param value {var|null} Updates the field with the new model value.
       * @return {var} Should return an error when the type of
       *  model value is not compatible with the implementing class (the concrete field).
       */
      setValue(value) {
        return arguments.length == 1;
      },
      /**
       * Resets the model value to its initial value. Should also update the UI.
       */
      resetValue() {},
      /**
       * Returns a consistent and up-to-date model value.
       *
       * Note: returned value can also be a promise of type <code>Promise&lt;*|null&gt;</code>.
       *
       * @return {var|null} The model value plain or as promise.
       */
      getValue() {}
    }
  });
  qx.ui.form.IField.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christian Hagendorn (chris_schmidt)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Each object, which should support single selection have to
   * implement this interface.
   */
  qx.Interface.define("qx.ui.core.ISingleSelection", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fires after the selection was modified */
      changeSelection: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Returns an array of currently selected items.
       *
       * Note: The result is only a set of selected items, so the order can
       * differ from the sequence in which the items were added.
       *
       * @return {qx.ui.core.Widget[]} List of items.
       */
      getSelection() {
        return true;
      },
      /**
       * Replaces current selection with the given items.
       *
       * @param items {qx.ui.core.Widget[]} Items to select.
       * @throws {Error} if the item is not a child element.
       */
      setSelection(items) {
        return arguments.length == 1;
      },
      /**
       * Clears the whole selection at once.
       */
      resetSelection() {
        return true;
      },
      /**
       * Detects whether the given item is currently selected.
       *
       * @param item {qx.ui.core.Widget} Any valid selectable item
       * @return {Boolean} Whether the item is selected.
       * @throws {Error} if the item is not a child element.
       */
      isSelected(item) {
        return arguments.length == 1;
      },
      /**
       * Whether the selection is empty.
       *
       * @return {Boolean} Whether the selection is empty.
       */
      isSelectionEmpty() {
        return true;
      },
      /**
       * Returns all elements which are selectable.
       *
       * @param all {Boolean} true for all selectables, false for the
       *   selectables the user can interactively select
       * @return {qx.ui.core.Widget[]} The contained items.
       */
      getSelectables(all) {
        return arguments.length == 1;
      }
    }
  });
  qx.ui.core.ISingleSelection.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {},
      "qx.ui.core.SingleSelectionManager": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * This mixin links all methods to manage the single selection.
   *
   * The class which includes the mixin has to implements two methods:
   *
   * <ul>
   * <li><code>_getItems</code>, this method has to return a <code>Array</code>
   *    of <code>qx.ui.core.Widget</code> that should be managed from the manager.
   * </li>
   * <li><code>_isAllowEmptySelection</code>, this method has to return a
   *    <code>Boolean</code> value for allowing empty selection or not.
   * </li>
   * </ul>
   */
  qx.Mixin.define("qx.ui.core.MSingleSelectionHandling", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fires after the value was modified */
      changeValue: "qx.event.type.Data",
      /** Fires after the selection was modified */
      changeSelection: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** @type {qx.ui.core.SingleSelectionManager} the single selection manager */
      __manager__P_65_0: null,
      /*
      ---------------------------------------------------------------------------
        PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * setValue implements part of the {@link qx.ui.form.IField} interface.
       *
       * @param item {null|qx.ui.core.Widget} Item to set as selected value.
       * @returns {null|TypeError} The status of this operation.
       */
      setValue(item) {
        if (null === item) {
          this.resetSelection();
          return null;
        }
        if (item instanceof qx.ui.core.Widget) {
          this.__getManager__P_65_1().setSelected(item);
          return null;
        } else {
          return new TypeError("Given argument is not null or a {qx.ui.core.Widget}.");
        }
      },
      /**
       * getValue implements part of the {@link qx.ui.form.IField} interface.
       *
       * @returns {null|qx.ui.core.Widget} The currently selected widget or null if there is none.
       */
      getValue() {
        return this.__getManager__P_65_1().getSelected() || null;
      },
      /**
       * resetValue implements part of the {@link qx.ui.form.IField} interface.
       */
      resetValue() {
        this.__getManager__P_65_1().resetSelected();
      },
      /**
       * Returns an array of currently selected items.
       *
       * Note: The result is only a set of selected items, so the order can
       * differ from the sequence in which the items were added.
       *
       * @return {qx.ui.core.Widget[]} List of items.
       */
      getSelection() {
        var selected = this.__getManager__P_65_1().getSelected();
        if (selected) {
          return [selected];
        } else {
          return [];
        }
      },
      /**
       * Replaces current selection with the given items.
       *
       * @param items {qx.ui.core.Widget[]} Items to select.
       * @throws {Error} if one of the items is not a child element and if
       *    items contains more than one elements.
       */
      setSelection(items) {
        switch (items.length) {
          case 0:
            this.resetSelection();
            break;
          case 1:
            this.__getManager__P_65_1().setSelected(items[0]);
            break;
          default:
            throw new Error("Could only select one item, but the selection array contains " + items.length + " items!");
        }
      },
      /**
       * Clears the whole selection at once.
       */
      resetSelection() {
        this.__getManager__P_65_1().resetSelected();
      },
      /**
       * Detects whether the given item is currently selected.
       *
       * @param item {qx.ui.core.Widget} Any valid selectable item.
       * @return {Boolean} Whether the item is selected.
       * @throws {Error} if one of the items is not a child element.
       */
      isSelected(item) {
        return this.__getManager__P_65_1().isSelected(item);
      },
      /**
       * Whether the selection is empty.
       *
       * @return {Boolean} Whether the selection is empty.
       */
      isSelectionEmpty() {
        return this.__getManager__P_65_1().isSelectionEmpty();
      },
      /**
       * Returns all elements which are selectable.
       *
       * @param all {Boolean} true for all selectables, false for the
       *   selectables the user can interactively select
       * @return {qx.ui.core.Widget[]} The contained items.
       */
      getSelectables(all) {
        return this.__getManager__P_65_1().getSelectables(all);
      },
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for <code>changeSelected</code> event on single
       * selection manager.
       *
       * @param e {qx.event.type.Data} Data event.
       */
      _onChangeSelected(e) {
        var newValue = e.getData();
        var oldValue = e.getOldData();
        this.fireDataEvent("changeValue", newValue, oldValue);
        newValue == null ? newValue = [] : newValue = [newValue];
        oldValue == null ? oldValue = [] : oldValue = [oldValue];
        this.fireDataEvent("changeSelection", newValue, oldValue);
      },
      /**
       * Return the selection manager if it is already exists, otherwise creates
       * the manager.
       *
       * @return {qx.ui.core.SingleSelectionManager} Single selection manager.
       */
      __getManager__P_65_1() {
        if (this.__manager__P_65_0 == null) {
          var that = this;
          this.__manager__P_65_0 = new qx.ui.core.SingleSelectionManager({
            getItems() {
              return that._getItems();
            },
            isItemSelectable(item) {
              if (that._isItemSelectable) {
                return that._isItemSelectable(item);
              } else {
                return item.isVisible();
              }
            }
          });
          this.__manager__P_65_0.addListener("changeSelected", this._onChangeSelected, this);
        }
        this.__manager__P_65_0.setAllowEmptySelection(this._isAllowEmptySelection());
        return this.__manager__P_65_0;
      }
    },
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._disposeObjects("__manager__P_65_0");
    }
  });
  qx.ui.core.MSingleSelectionHandling.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.form.IField": {
        "require": true
      },
      "qx.ui.core.ISingleSelection": {
        "require": true
      },
      "qx.ui.core.MSingleSelectionHandling": {
        "require": true
      },
      "qx.ui.core.MChildrenHandling": {
        "require": true
      },
      "qx.ui.layout.Grow": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
       * Adrian Olaru (adrianolaru)
  
  ************************************************************************ */

  /**
   * The stack container puts its child widgets on top of each other and only the
   * topmost widget is visible.
   *
   * This is used e.g. in the tab view widget. Which widget is visible can be
   * controlled by using the {@link #getSelection} method.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   // create stack container
   *   var stack = new qx.ui.container.Stack();
   *
   *   // add some children
   *   stack.add(new qx.ui.core.Widget().set({
   *    backgroundColor: "red"
   *   }));
   *   stack.add(new qx.ui.core.Widget().set({
   *    backgroundColor: "green"
   *   }));
   *   stack.add(new qx.ui.core.Widget().set({
   *    backgroundColor: "blue"
   *   }));
   *
   *   // select green widget
   *   stack.setSelection([stack.getChildren()[1]]);
   *
   *   this.getRoot().add(stack);
   * </pre>
   *
   * This example creates an stack with three children. Only the selected "green"
   * widget is visible.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/stack.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.container.Stack", {
    extend: qx.ui.core.Widget,
    implement: [qx.ui.form.IField, qx.ui.core.ISingleSelection],
    include: [qx.ui.core.MSingleSelectionHandling, qx.ui.core.MChildrenHandling],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.core.Widget.constructor.call(this);
      this._setLayout(new qx.ui.layout.Grow());
      this.addListener("changeSelection", this.__onChangeSelection__P_8_0, this);
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Whether the size of the widget depends on the selected child. When
       * disabled (default) the size is configured to the largest child.
       */
      dynamic: {
        check: "Boolean",
        init: false,
        apply: "_applyDynamic"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // property apply
      _applyDynamic(value) {
        var children = this._getChildren();
        var selected = this.getSelection()[0];
        var child;
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          if (child != selected) {
            if (value) {
              children[i].exclude();
            } else {
              children[i].hide();
            }
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS FOR SELECTION API
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the widget for the selection.
       * @return {qx.ui.core.Widget[]} Widgets to select.
       */
      _getItems() {
        return this.getChildren();
      },
      /**
       * Returns if the selection could be empty or not.
       *
       * @return {Boolean} <code>true</code> If selection could be empty,
       *    <code>false</code> otherwise.
       */
      _isAllowEmptySelection() {
        return true;
      },
      /**
       * Returns whether the given item is selectable.
       *
       * @param item {qx.ui.core.Widget} The item to be checked
       * @return {Boolean} Whether the given item is selectable
       */
      _isItemSelectable(item) {
        return true;
      },
      /**
       * Event handler for <code>changeSelection</code>.
       *
       * Shows the new selected widget and hide the old one.
       *
       * @param e {qx.event.type.Data} Data event.
       */
      __onChangeSelection__P_8_0(e) {
        var old = e.getOldData()[0];
        var value = e.getData()[0];
        if (old) {
          if (this.isDynamic()) {
            old.exclude();
          } else {
            old.hide();
          }
        }
        if (value) {
          value.show();
        }
      },
      //overridden
      _afterAddChild(child) {
        var selected = this.getSelection()[0];
        if (!selected) {
          this.setSelection([child]);
        } else if (selected !== child) {
          if (this.isDynamic()) {
            child.exclude();
          } else {
            child.hide();
          }
        }
      },
      //overridden
      _afterRemoveChild(child) {
        if (this.getSelection()[0] === child) {
          var first = this._getChildren()[0];
          if (first) {
            this.setSelection([first]);
          } else {
            this.resetSelection();
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * Go to the previous child in the children list.
       */
      previous() {
        var selected = this.getSelection()[0];
        var go = this._indexOf(selected) - 1;
        var children = this._getChildren();
        if (go < 0) {
          go = children.length - 1;
        }
        var prev = children[go];
        this.setSelection([prev]);
      },
      /**
       * Go to the next child in the children list.
       */
      next() {
        var selected = this.getSelection()[0];
        var go = this._indexOf(selected) + 1;
        var children = this._getChildren();
        var next = children[go] || children[0];
        this.setSelection([next]);
      }
    }
  });
  qx.ui.container.Stack.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-7.js.map?dt=1791845587462
qx.$$packageData['7'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
