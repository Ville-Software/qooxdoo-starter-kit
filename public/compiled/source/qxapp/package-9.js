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
        if (!qx.log.appender.Formatter.__DATETIME_FORMAT__P_41_0) {
          qx.log.appender.Formatter.__DATETIME_FORMAT__P_41_0 = new qx.util.format.DateFormat("YYYY-MM-dd HH:mm:ss");
        }
        return qx.log.appender.Formatter.__DATETIME_FORMAT__P_41_0.format(entry.time);
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
      __DATETIME_FORMAT__P_41_0: null,
      /** @type {qx.log.appender.Formatter} the default instance */
      __defaultFormatter__P_41_1: null,
      /**
       * Returns the default formatter
       *
       * @return {qx.log.appender.Formatter}
       */
      getFormatter() {
        if (!qx.log.appender.Formatter.__defaultFormatter__P_41_1) {
          qx.log.appender.Formatter.__defaultFormatter__P_41_1 = new qx.log.appender.Formatter();
        }
        return qx.log.appender.Formatter.__defaultFormatter__P_41_1;
      },
      /**
       * Sets the default formatter
       *
       * @param instance {qx.log.appender.Formatter}
       */
      setFormatter(instance) {
        qx.log.appender.Formatter.__defaultFormatter__P_41_1 = instance;
      },
      /**
       * Escapes the HTML in the given value
       *
       * @param value
       *          {String} value to escape
       * @return {String} escaped value
       */
      escapeHTML(value) {
        return String(value).replace(/[<>&"']/g, qx.log.appender.Formatter.__escapeHTMLReplace__P_41_2);
      },
      /**
       * Internal replacement helper for HTML escape.
       *
       * @param ch
       *          {String} Single item to replace.
       * @return {String} Replaced item
       */
      __escapeHTMLReplace__P_41_2(ch) {
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

      __main__P_5_0: null,
      __log__P_5_1: null,
      __cmd__P_5_2: null,
      __lastCommand__P_5_3: null,
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
        this.__main__P_5_0 = main;
        this.__log__P_5_1 = main.childNodes[1];
        this.__cmd__P_5_2 = main.childNodes[2].firstChild;

        // Correct height of messages frame
        this.__onResize__P_5_4();

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
        qx.event.Registration.removeListener(document.documentElement, "keypress", this.__onKeyPress__P_5_5, this);
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
        this.__log__P_5_1.innerHTML = "";
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
        this.__log__P_5_1.appendChild(formatter.toHtml(entry));

        // Scroll down
        this.__scrollDown__P_5_6();
      },
      /**
       * Automatically scroll down to the last line
       */
      __scrollDown__P_5_6() {
        this.__log__P_5_1.scrollTop = this.__log__P_5_1.scrollHeight;
      },
      /*
      ---------------------------------------------------------------------------
        VISIBILITY TOGGLING
      ---------------------------------------------------------------------------
      */

      /** @type {Boolean} Flag to store last visibility status */
      __visible__P_5_7: true,
      /**
       * Toggles the visibility of the console between visible and hidden.
       *
       */
      toggle() {
        if (!this.__main__P_5_0) {
          this.init();
        } else if (this.__main__P_5_0.style.display == "none") {
          this.show();
        } else {
          this.__main__P_5_0.style.display = "none";
        }
      },
      /**
       * Shows the console.
       *
       */
      show() {
        if (!this.__main__P_5_0) {
          this.init();
        } else {
          this.__main__P_5_0.style.display = "block";
          this.__log__P_5_1.scrollTop = this.__log__P_5_1.scrollHeight;
        }
      },
      /*
      ---------------------------------------------------------------------------
        COMMAND LINE SUPPORT
      ---------------------------------------------------------------------------
      */

      /** @type {Array} List of all previous commands. */
      __history__P_5_8: [],
      /**
       * Executes the currently given command
       *
       */
      execute() {
        var value = this.__cmd__P_5_2.value;
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
        this.__history__P_5_8.push(value);
        this.__lastCommand__P_5_3 = this.__history__P_5_8.length;
        this.__log__P_5_1.appendChild(command);
        this.__scrollDown__P_5_6();
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
      __onResize__P_5_4(e) {
        this.__log__P_5_1.style.height = this.__main__P_5_0.clientHeight - this.__main__P_5_0.firstChild.offsetHeight - this.__main__P_5_0.lastChild.offsetHeight + "px";
      },
      /**
       * Event handler for keydown listener
       *
       * @param e {Event} Event object
       */
      __onKeyPress__P_5_5(e) {
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
        if (!this.__main__P_5_0) {
          return;
        }

        // Active element not in console
        if (!qx.dom.Hierarchy.contains(this.__main__P_5_0, e.getTarget())) {
          return;
        }

        // Command execution
        if (iden == "Enter" && this.__cmd__P_5_2.value != "") {
          this.execute();
          this.__cmd__P_5_2.value = "";
        }

        // History management
        if (iden == "Up" || iden == "Down") {
          this.__lastCommand__P_5_3 += iden == "Up" ? -1 : 1;
          this.__lastCommand__P_5_3 = Math.min(Math.max(0, this.__lastCommand__P_5_3), this.__history__P_5_8.length);
          var entry = this.__history__P_5_8[this.__lastCommand__P_5_3];
          this.__cmd__P_5_2.value = entry || "";
          this.__cmd__P_5_2.select();
        }
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      qx.event.Registration.addListener(document.documentElement, "keypress", statics.__onKeyPress__P_5_5, statics);
      qx.event.Registration.addListener(document.documentElement, "longtap", statics.__onKeyPress__P_5_5, statics);
    }
  });
  qx.log.appender.Console.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-9.js.map?dt=1769807054019
qx.$$packageData['9'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
