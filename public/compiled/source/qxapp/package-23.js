(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Type": {}
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
       * Tristan Koch (tristankoch)
  
  ************************************************************************ */

  /**
   * Static helpers for parsing and modifying URIs.
   */
  qx.Bootstrap.define("qx.util.Uri", {
    statics: {
      /**
       * Split URL
       *
       * Code taken from:
       *   parseUri 1.2.2
       *   (c) Steven Levithan <stevenlevithan.com>
       *   MIT License
       *
       *
       * @param str {String} String to parse as URI
       * @param strict {Boolean} Whether to parse strictly by the rules
       * @return {Object} Map with parts of URI as properties
       */
      parseUri(str, strict) {
        var options = {
          key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
          q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
          },
          parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@?]*)(?::([^:@?]*))?)?@)?((?:\[[0-9A-Fa-f:]+\])|(?:[^:\/?#\[\]]*))(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@?]+:[^:@?\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@?]*)(?::([^:@?]*))?)?@)?((?:\[[0-9A-Fa-f:]+\])|(?:[^:\/?#\[\]]*))(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
          }
        };
        var o = options,
          m = options.parser[strict ? "strict" : "loose"].exec(str),
          uri = {},
          i = 14;
        while (i--) {
          uri[o.key[i]] = m[i] || "";
        }
        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
          if ($1) {
            uri[o.q.name][$1] = $2;
          }
        });
        return uri;
      },
      /**
       * Append string to query part of URL. Respects existing query.
       *
       * @param url {String} URL to append string to.
       * @param params {String} Parameters to append to URL.
       * @return {String} URL with string appended in query part.
       */
      appendParamsToUrl(url, params) {
        if (params === undefined) {
          return url;
        }
        {
          if (!(qx.lang.Type.isString(params) || qx.lang.Type.isObject(params))) {
            throw new Error("params must be either string or object");
          }
        }
        if (qx.lang.Type.isObject(params)) {
          params = qx.util.Uri.toParameter(params);
        }
        if (!params) {
          return url;
        }
        return url += /\?/.test(url) ? "&" + params : "?" + params;
      },
      /**
       * Serializes an object to URI parameters (also known as query string).
       *
       * Escapes characters that have a special meaning in URIs as well as
       * umlauts. Uses the global function encodeURIComponent, see
       * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
       *
       * Note: For URI parameters that are to be sent as
       * application/x-www-form-urlencoded (POST), spaces should be encoded
       * with "+".
       *
       * @param obj {Object}   Object to serialize.
       * @param post {Boolean} Whether spaces should be encoded with "+".
       * @return {String}      Serialized object. Safe to append to URIs or send as
       *                       URL encoded string.
       */
      toParameter(obj, post) {
        var key,
          parts = [];
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (value instanceof Array) {
              for (var i = 0; i < value.length; i++) {
                this.__toParameterPair__P_130_0(key, value[i], parts, post);
              }
            } else {
              this.__toParameterPair__P_130_0(key, value, parts, post);
            }
          }
        }
        return parts.join("&");
      },
      /**
       * Encodes key/value to URI safe string and pushes to given array.
       *
       * @param key {String} Key.
       * @param value {String} Value.
       * @param parts {Array} Array to push to.
       * @param post {Boolean} Whether spaces should be encoded with "+".
       */
      __toParameterPair__P_130_0(key, value, parts, post) {
        var encode = window.encodeURIComponent;
        if (post) {
          parts.push(encode(key).replace(/%20/g, "+") + "=" + encode(value).replace(/%20/g, "+"));
        } else {
          parts.push(encode(key) + "=" + encode(value));
        }
      },
      /**
       * Takes a relative URI and returns an absolute one.
       *
       * @param uri {String} relative URI
       * @return {String} absolute URI
       */
      getAbsolute(uri) {
        var div = document.createElement("div");
        div.innerHTML = '<a href="' + uri + '">0</a>';
        return div.firstChild.href;
      }
    }
  });
  qx.util.Uri.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.CssAnimation": {
        "require": true
      },
      "qx.bom.Stylesheet": {},
      "qx.bom.Event": {},
      "qx.bom.element.Style": {},
      "qx.log.Logger": {},
      "qx.lang.String": {},
      "qx.bom.element.AnimationHandle": {},
      "qx.bom.element.Transform": {},
      "qx.bom.Style": {},
      "qx.bom.client.OperatingSystem": {
        "defer": "load",
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "css.animation": {
          "load": true,
          "className": "qx.bom.client.CssAnimation"
        },
        "qx.debug": {
          "load": true
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
       2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * This class is responsible for applying CSS3 animations to plain DOM elements.
   *
   * The implementation is mostly a cross-browser wrapper for applying the
   * animations, including transforms. If the browser does not support
   * CSS animations, but you have set a keep frame, the keep frame will be applied
   * immediately, thus making the animations optional.
   *
   * The API aligns closely to the spec wherever possible.
   *
   * http://www.w3.org/TR/css3-animations/
   *
   * {@link qx.bom.element.Animation} is the class, which takes care of the
   * feature detection for CSS animations and decides which implementation
   * (CSS or JavaScript) should be used. Most likely, this implementation should
   * be the one to use.
   */
  qx.Bootstrap.define("qx.bom.element.AnimationCss", {
    statics: {
      // initialization
      __sheet__P_207_0: null,
      __rulePrefix__P_207_1: "Anni",
      __id__P_207_2: 0,
      /** Static map of rules */
      __rules__P_207_3: {},
      /** The used keys for transforms. */
      __transitionKeys__P_207_4: {
        scale: true,
        rotate: true,
        skew: true,
        translate: true
      },
      /** Map of cross browser CSS keys. */
      __cssAnimationKeys__P_207_5: qx.core.Environment.get("css.animation"),
      /**
       * This is the main function to start the animation in reverse mode.
       * For further details, take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animateReverse(el, desc, duration) {
        return this._animate(el, desc, duration, true);
      },
      /**
       * This is the main function to start the animation. For further details,
       * take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animate(el, desc, duration) {
        return this._animate(el, desc, duration, false);
      },
      /**
       * Internal method to start an animation either reverse or not.
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @param reverse {Boolean} <code>true</code>, if the animation should be
       *   reversed.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      _animate(el, desc, duration, reverse) {
        this.__normalizeDesc__P_207_6(desc);

        // debug validation
        {
          this.__validateDesc__P_207_7(desc);
        }

        // reverse the keep property if the animation is reverse as well
        var keep = desc.keep;
        if (keep != null && (reverse || desc.alternate && desc.repeat % 2 == 0)) {
          keep = 100 - keep;
        }
        if (!this.__sheet__P_207_0) {
          this.__sheet__P_207_0 = qx.bom.Stylesheet.createElement();
        }
        var keyFrames = desc.keyFrames;
        if (duration == undefined) {
          duration = desc.duration;
        }

        // if animations are supported
        if (this.__cssAnimationKeys__P_207_5 != null) {
          var name = this.__addKeyFrames__P_207_8(keyFrames, reverse);
          var style = name + " " + duration + "ms " + desc.timing + " " + (desc.delay ? desc.delay + "ms " : "") + desc.repeat + " " + (desc.alternate ? "alternate" : "");
          qx.bom.Event.addNativeListener(el, this.__cssAnimationKeys__P_207_5["start-event"], this.__onAnimationStart__P_207_9);
          qx.bom.Event.addNativeListener(el, this.__cssAnimationKeys__P_207_5["iteration-event"], this.__onAnimationIteration__P_207_10);
          qx.bom.Event.addNativeListener(el, this.__cssAnimationKeys__P_207_5["end-event"], this.__onAnimationEnd__P_207_11);
          {
            if (qx.bom.element.Style.get(el, "display") == "none") {
              qx.log.Logger.warn(el, "Some browsers will not animate elements with display==none");
            }
          }
          el.style[qx.lang.String.camelCase(this.__cssAnimationKeys__P_207_5["name"])] = style;
          // use the fill mode property if available and suitable
          if (keep && keep == 100 && this.__cssAnimationKeys__P_207_5["fill-mode"]) {
            el.style[this.__cssAnimationKeys__P_207_5["fill-mode"]] = "forwards";
          }
        }
        var animation = new qx.bom.element.AnimationHandle();
        animation.desc = desc;
        animation.el = el;
        animation.keep = keep;
        el.$$animation = animation;

        // additional transform keys
        if (desc.origin != null) {
          qx.bom.element.Transform.setOrigin(el, desc.origin);
        }

        // fallback for browsers not supporting animations
        if (this.__cssAnimationKeys__P_207_5 == null) {
          window.setTimeout(function () {
            qx.bom.element.AnimationCss.__onAnimationEnd__P_207_11({
              target: el
            });
          }, 0);
        }
        return animation;
      },
      /**
       * Handler for the animation start.
       * @param e {Event} The native event from the browser.
       */
      __onAnimationStart__P_207_9(e) {
        if (e.target.$$animation) {
          e.target.$$animation.emit("start", e.target);
        }
      },
      /**
       * Handler for the animation iteration.
       * @param e {Event} The native event from the browser.
       */
      __onAnimationIteration__P_207_10(e) {
        // It could happen that an animation end event is fired before an
        // animation iteration appears [BUG #6928]
        if (e.target != null && e.target.$$animation != null) {
          e.target.$$animation.emit("iteration", e.target);
        }
      },
      /**
       * Handler for the animation end.
       * @param e {Event} The native event from the browser.
       */
      __onAnimationEnd__P_207_11(e) {
        var el = e.target;
        var animation = el.$$animation;

        // ignore events when already cleaned up
        if (!animation) {
          return;
        }
        var desc = animation.desc;
        if (qx.bom.element.AnimationCss.__cssAnimationKeys__P_207_5 != null) {
          // reset the styling
          var key = qx.lang.String.camelCase(qx.bom.element.AnimationCss.__cssAnimationKeys__P_207_5["name"]);
          el.style[key] = "";
          qx.bom.Event.removeNativeListener(el, qx.bom.element.AnimationCss.__cssAnimationKeys__P_207_5["name"], qx.bom.element.AnimationCss.__onAnimationEnd__P_207_11);
        }
        if (desc.origin != null) {
          qx.bom.element.Transform.setOrigin(el, "");
        }
        qx.bom.element.AnimationCss.__keepFrame__P_207_12(el, desc.keyFrames[animation.keep]);
        el.$$animation = null;
        animation.el = null;
        animation.ended = true;
        animation.emit("end", el);
      },
      /**
       * Helper method which takes an element and a key frame description and
       * applies the properties defined in the given frame to the element. This
       * method is used to keep the state of the animation.
       * @param el {Element} The element to apply the frame to.
       * @param endFrame {Map} The description of the end frame, which is basically
       *   a map containing CSS properties and values including transforms.
       */
      __keepFrame__P_207_12(el, endFrame) {
        // keep the element at this animation step
        var transforms;
        for (var style in endFrame) {
          if (style in qx.bom.element.AnimationCss.__transitionKeys__P_207_4) {
            if (!transforms) {
              transforms = {};
            }
            transforms[style] = endFrame[style];
          } else {
            el.style[qx.lang.String.camelCase(style)] = endFrame[style];
          }
        }

        // transform keeping
        if (transforms) {
          qx.bom.element.Transform.transform(el, transforms);
        }
      },
      /**
       * Preprocessing of the description to make sure every necessary key is
       * set to its default.
       * @param desc {Map} The description of the animation.
       */
      __normalizeDesc__P_207_6(desc) {
        if (!desc.hasOwnProperty("alternate")) {
          desc.alternate = false;
        }
        if (!desc.hasOwnProperty("keep")) {
          desc.keep = null;
        }
        if (!desc.hasOwnProperty("repeat")) {
          desc.repeat = 1;
        }
        if (!desc.hasOwnProperty("timing")) {
          desc.timing = "linear";
        }
        if (!desc.hasOwnProperty("origin")) {
          desc.origin = null;
        }
      },
      /**
       * Debugging helper to validate the description.
       * @signature function(desc)
       * @param desc {Map} The description of the animation.
       */
      __validateDesc__P_207_7: qx.core.Environment.select("qx.debug", {
        true(desc) {
          var possibleKeys = ["origin", "duration", "keep", "keyFrames", "delay", "repeat", "timing", "alternate"];

          // check for unknown keys
          for (var name in desc) {
            if (!(possibleKeys.indexOf(name) != -1)) {
              qx.Bootstrap.warn("Unknown key '" + name + "' in the animation description.");
            }
          }
          if (desc.keyFrames == null) {
            qx.Bootstrap.warn("No 'keyFrames' given > 0");
          } else {
            // check the key frames
            for (var pos in desc.keyFrames) {
              if (pos < 0 || pos > 100) {
                qx.Bootstrap.warn("Keyframe position needs to be between 0 and 100");
              }
            }
          }
        },
        default: null
      }),
      /**
       * Helper to add the given frames to an internal CSS stylesheet. It parses
       * the description and adds the key frames to the sheet.
       * @param frames {Map} A map of key frames that describe the animation.
       * @param reverse {Boolean} <code>true</code>, if the key frames should
       *   be added in reverse order.
       * @return {String} The generated name of the keyframes rule.
       */
      __addKeyFrames__P_207_8(frames, reverse) {
        var rule = "";

        // for each key frame
        for (var position in frames) {
          rule += (reverse ? -(position - 100) : position) + "% {";
          var frame = frames[position];
          var transforms;
          // each style
          for (var style in frame) {
            if (style in this.__transitionKeys__P_207_4) {
              if (!transforms) {
                transforms = {};
              }
              transforms[style] = frame[style];
            } else {
              var propName = qx.bom.Style.getPropertyName(style);
              var prefixed = propName !== null ? qx.bom.Style.getCssName(propName) : "";
              rule += (prefixed || style) + ":" + frame[style] + ";";
            }
          }

          // transform handling
          if (transforms) {
            rule += qx.bom.element.Transform.getCss(transforms);
          }
          rule += "} ";
        }

        // cached shorthand
        if (this.__rules__P_207_3[rule]) {
          return this.__rules__P_207_3[rule];
        }
        var name = this.__rulePrefix__P_207_1 + this.__id__P_207_2++;
        var selector = this.__cssAnimationKeys__P_207_5["keyframes"] + " " + name;
        qx.bom.Stylesheet.addRule(this.__sheet__P_207_0, selector, rule);
        this.__rules__P_207_3[rule] = name;
        return name;
      },
      /**
       * Internal helper to reset the cache.
       */
      __clearCache__P_207_13() {
        this.__id__P_207_2 = 0;
        if (this.__sheet__P_207_0) {
          this.__sheet__P_207_0.ownerNode.remove();
          this.__sheet__P_207_0 = null;
          this.__rules__P_207_3 = {};
        }
      }
    },
    defer(statics) {
      // iOS 8 seems to stumble over the old sheet object on tab
      // changes or leaving the browser [BUG #8986]
      if (qx.core.Environment.get("os.name") === "ios" && parseInt(qx.core.Environment.get("os.version")) >= 8) {
        document.addEventListener("visibilitychange", function () {
          if (!document.hidden) {
            statics.__clearCache__P_207_13();
          }
        }, false);
      }
    }
  });
  qx.bom.element.AnimationCss.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Object": {},
      "qx.bom.element.AnimationHandle": {},
      "qx.bom.Style": {},
      "qx.bom.element.Transform": {},
      "qx.util.ColorUtil": {},
      "qx.bom.AnimationFrame": {},
      "qx.lang.String": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * This class offers the same API as the CSS3 animation layer in
   * {@link qx.bom.element.AnimationCss} but uses JavaScript to fake the behavior.
   *
   * {@link qx.bom.element.Animation} is the class, which takes care of the
   * feature detection for CSS animations and decides which implementation
   * (CSS or JavaScript) should be used. Most likely, this implementation should
   * be the one to use.
   *
   * @ignore(qx.bom.element.Style.*)
   * @use(qx.bom.element.AnimationJs#play)
   */
  qx.Bootstrap.define("qx.bom.element.AnimationJs", {
    statics: {
      /**
       * The maximal time a frame should take.
       */
      __maxStepTime__P_208_0: 30,
      /**
       * The supported CSS units.
       */
      __units__P_208_1: ["%", "in", "cm", "mm", "em", "ex", "pt", "pc", "px"],
      /** The used keys for transforms. */
      __transitionKeys__P_208_2: {
        scale: true,
        rotate: true,
        skew: true,
        translate: true
      },
      /**
       * This is the main function to start the animation. For further details,
       * take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animate(el, desc, duration) {
        return this._animate(el, desc, duration, false);
      },
      /**
       * This is the main function to start the animation in reversed mode.
       * For further details, take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animateReverse(el, desc, duration) {
        return this._animate(el, desc, duration, true);
      },
      /**
       * Helper to start the animation, either in reversed order or not.
       *
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @param reverse {Boolean} <code>true</code>, if the animation should be
       *   reversed.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      _animate(el, desc, duration, reverse) {
        // stop if an animation is already running
        if (el.$$animation) {
          return el.$$animation;
        }
        desc = qx.lang.Object.clone(desc, true);
        if (duration == undefined) {
          duration = desc.duration;
        }
        var keyFrames = desc.keyFrames;
        var keys = this.__getOrderedKeys__P_208_3(keyFrames);
        var stepTime = this.__getStepTime__P_208_4(duration, keys);
        var steps = parseInt(duration / stepTime, 10);
        this.__normalizeKeyFrames__P_208_5(keyFrames, el);
        var delta = this.__calculateDelta__P_208_6(steps, stepTime, keys, keyFrames, duration, desc.timing);
        var handle = new qx.bom.element.AnimationHandle();
        handle.jsAnimation = true;
        if (reverse) {
          delta.reverse();
          handle.reverse = true;
        }
        handle.desc = desc;
        handle.el = el;
        handle.delta = delta;
        handle.stepTime = stepTime;
        handle.steps = steps;
        el.$$animation = handle;
        handle.i = 0;
        handle.initValues = {};
        handle.repeatSteps = this.__applyRepeat__P_208_7(steps, desc.repeat);
        var delay = desc.delay || 0;
        var self = this;
        handle.delayId = window.setTimeout(function () {
          handle.delayId = null;
          self.play(handle);
        }, delay);
        return handle;
      },
      /**
       * Try to normalize the keyFrames by adding the default / set values of the
       * element.
       * @param keyFrames {Map} The map of key frames.
       * @param el {Element} The element to animate.
       */
      __normalizeKeyFrames__P_208_5(keyFrames, el) {
        // collect all possible keys and its units
        var units = {};
        for (var percent in keyFrames) {
          for (var name in keyFrames[percent]) {
            // prefixed key calculation
            var prefixed = qx.bom.Style.getPropertyName(name);
            if (prefixed && prefixed != name) {
              var prefixedName = qx.bom.Style.getCssName(prefixed);
              keyFrames[percent][prefixedName] = keyFrames[percent][name];
              delete keyFrames[percent][name];
              name = prefixedName;
            }
            // check for the available units
            if (units[name] == undefined) {
              var item = keyFrames[percent][name];
              if (typeof item == "string") {
                units[name] = this.__getUnit__P_208_8(item);
              } else {
                units[name] = "";
              }
            }
          }
        }
        // add all missing keys
        for (var percent in keyFrames) {
          var frame = keyFrames[percent];
          for (var name in units) {
            if (frame[name] == undefined) {
              if (name in el.style) {
                // get the computed style if possible
                if (window.getComputedStyle) {
                  frame[name] = window.getComputedStyle(el, null)[name];
                } else {
                  frame[name] = el.style[name];
                }
              } else {
                frame[name] = el[name];
              }
              // if its a unit we know, set 0 as fallback
              if (frame[name] === "" && this.__units__P_208_1.indexOf(units[name]) != -1) {
                frame[name] = "0" + units[name];
              }
            }
          }
        }
      },
      /**
       * Checks for transform keys and returns a cloned frame
       * with the right transform style set.
       * @param frame {Map} A single key frame of the description.
       * @return {Map} A modified clone of the given frame.
       */
      __normalizeKeyFrameTransforms__P_208_9(frame) {
        frame = qx.lang.Object.clone(frame);
        var transforms;
        for (var name in frame) {
          if (name in this.__transitionKeys__P_208_2) {
            if (!transforms) {
              transforms = {};
            }
            transforms[name] = frame[name];
            delete frame[name];
          }
        }
        if (transforms) {
          var transformStyle = qx.bom.element.Transform.getCss(transforms).split(":");
          if (transformStyle.length > 1) {
            frame[transformStyle[0]] = transformStyle[1].replace(";", "");
          }
        }
        return frame;
      },
      /**
       * Precalculation of the delta which will be applied during the animation.
       * The whole deltas will be calculated prior to the animation and stored
       * in a single array. This method takes care of that calculation.
       *
       * @param steps {Integer} The amount of steps to take to the end of the
       *   animation.
       * @param stepTime {Integer} The amount of milliseconds each step takes.
       * @param keys {Array} Ordered list of keys in the key frames map.
       * @param keyFrames {Map} The map of key frames.
       * @param duration {Integer} Time in milliseconds the animation should take.
       * @param timing {String} The given timing function.
       * @return {Array} An array containing the animation deltas.
       */
      __calculateDelta__P_208_6(steps, stepTime, keys, keyFrames, duration, timing) {
        var delta = new Array(steps);
        var keyIndex = 1;
        delta[0] = this.__normalizeKeyFrameTransforms__P_208_9(keyFrames[0]);
        var last = keyFrames[0];
        var next = keyFrames[keys[keyIndex]];
        var stepsToNext = Math.floor(keys[keyIndex] / (stepTime / duration * 100));
        var calculationIndex = 1; // is used as counter for the timing calculation
        // for every step
        for (var i = 1; i < delta.length; i++) {
          // switch key frames if we crossed a percent border
          if (i * stepTime / duration * 100 > keys[keyIndex]) {
            last = next;
            keyIndex++;
            next = keyFrames[keys[keyIndex]];
            stepsToNext = Math.floor(keys[keyIndex] / (stepTime / duration * 100)) - stepsToNext;
            calculationIndex = 1;
          }
          delta[i] = {};
          var transforms;
          // for every property
          for (var name in next) {
            var nItem = next[name] + "";

            // transform values
            if (name in this.__transitionKeys__P_208_2) {
              if (!transforms) {
                transforms = {};
              }
              if (qx.Bootstrap.isArray(last[name])) {
                if (!qx.Bootstrap.isArray(next[name])) {
                  next[name] = [next[name]];
                }
                transforms[name] = [];
                for (var j = 0; j < next[name].length; j++) {
                  var item = next[name][j] + "";
                  var x = calculationIndex / stepsToNext;
                  transforms[name][j] = this.__getNextValue__P_208_10(item, last[name], timing, x);
                }
              } else {
                var x = calculationIndex / stepsToNext;
                transforms[name] = this.__getNextValue__P_208_10(nItem, last[name], timing, x);
              }

              // color values
            } else if (nItem.charAt(0) == "#") {
              // get the two values from the frames as RGB arrays
              var value0 = qx.util.ColorUtil.cssStringToRgb(last[name]);
              var value1 = qx.util.ColorUtil.cssStringToRgb(nItem);
              var stepValue = [];
              // calculate every color channel
              for (var j = 0; j < value0.length; j++) {
                var range = value0[j] - value1[j];
                var x = calculationIndex / stepsToNext;
                var timingX = qx.bom.AnimationFrame.calculateTiming(timing, x);
                stepValue[j] = parseInt(value0[j] - range * timingX, 10);
              }
              delta[i][name] = qx.util.ColorUtil.rgbToHexString(stepValue);
            } else if (!isNaN(parseFloat(nItem))) {
              var x = calculationIndex / stepsToNext;
              delta[i][name] = this.__getNextValue__P_208_10(nItem, last[name], timing, x);
            } else {
              delta[i][name] = last[name] + "";
            }
          }
          // save all transformations in the delta values
          if (transforms) {
            var transformStyle = qx.bom.element.Transform.getCss(transforms).split(":");
            if (transformStyle.length > 1) {
              delta[i][transformStyle[0]] = transformStyle[1].replace(";", "");
            }
          }
          calculationIndex++;
        }
        // make sure the last key frame is right
        delta[delta.length - 1] = this.__normalizeKeyFrameTransforms__P_208_9(keyFrames[100]);
        return delta;
      },
      /**
       * Ties to parse out the unit of the given value.
       *
       * @param item {String} A CSS value including its unit.
       * @return {String} The unit of the given value.
       */
      __getUnit__P_208_8(item) {
        return item.substring((parseFloat(item) + "").length, item.length);
      },
      /**
       * Returns the next value based on the given arguments.
       *
       * @param nextItem {String} The CSS value of the next frame
       * @param lastItem {String} The CSS value of the last frame
       * @param timing {String} The timing used for the calculation
       * @param x {Number} The x position of the animation on the time axis
       * @return {String} The calculated value including its unit.
       */
      __getNextValue__P_208_10(nextItem, lastItem, timing, x) {
        var range = parseFloat(nextItem) - parseFloat(lastItem);
        return parseFloat(lastItem) + range * qx.bom.AnimationFrame.calculateTiming(timing, x) + this.__getUnit__P_208_8(nextItem);
      },
      /**
       * Internal helper for the {@link qx.bom.element.AnimationHandle} to play
       * the animation.
       * @internal
       * @param handle {qx.bom.element.AnimationHandle} The hand which
       *   represents the animation.
       * @return {qx.bom.element.AnimationHandle} The handle for chaining.
       */
      play(handle) {
        handle.emit("start", handle.el);
        var id = window.setInterval(function () {
          handle.repeatSteps--;
          var values = handle.delta[handle.i % handle.steps];
          // save the init values
          if (handle.i === 0) {
            for (var name in values) {
              if (handle.initValues[name] === undefined) {
                // animate element property
                if (handle.el[name] !== undefined) {
                  handle.initValues[name] = handle.el[name];
                }
                // animate CSS property
                else if (qx.bom.element.Style) {
                  handle.initValues[name] = qx.bom.element.Style.get(handle.el, qx.lang.String.camelCase(name));
                } else {
                  handle.initValues[name] = handle.el.style[qx.lang.String.camelCase(name)];
                }
              }
            }
          }
          qx.bom.element.AnimationJs.__applyStyles__P_208_11(handle.el, values);
          handle.i++;
          // iteration condition
          if (handle.i % handle.steps == 0) {
            handle.emit("iteration", handle.el);
            if (handle.desc.alternate) {
              handle.delta.reverse();
            }
          }
          // end condition
          if (handle.repeatSteps < 0) {
            qx.bom.element.AnimationJs.stop(handle);
          }
        }, handle.stepTime);
        handle.animationId = id;
        return handle;
      },
      /**
       * Internal helper for the {@link qx.bom.element.AnimationHandle} to pause
       * the animation.
       * @internal
       * @param handle {qx.bom.element.AnimationHandle} The hand which
       *   represents the animation.
       * @return {qx.bom.element.AnimationHandle} The handle for chaining.
       */

      pause(handle) {
        // stop the interval
        window.clearInterval(handle.animationId);
        handle.animationId = null;
        return handle;
      },
      /**
       * Internal helper for the {@link qx.bom.element.AnimationHandle} to stop
       * the animation.
       * @internal
       * @param handle {qx.bom.element.AnimationHandle} The hand which
       *   represents the animation.
       * @return {qx.bom.element.AnimationHandle} The handle for chaining.
       */
      stop(handle) {
        var desc = handle.desc;
        var el = handle.el;
        var initValues = handle.initValues;
        if (handle.animationId) {
          window.clearInterval(handle.animationId);
        }

        // clear the delay if the animation has not been started
        if (handle.delayId) {
          window.clearTimeout(handle.delayId);
        }

        // check if animation is already stopped
        if (el == undefined) {
          return handle;
        }

        // if we should keep a frame
        var keep = desc.keep;
        if (keep != undefined && !handle.stopped) {
          if (handle.reverse || desc.alternate && desc.repeat && desc.repeat % 2 == 0) {
            keep = 100 - keep;
          }
          this.__applyStyles__P_208_11(el, this.__normalizeKeyFrameTransforms__P_208_9(desc.keyFrames[keep]));
        } else {
          this.__applyStyles__P_208_11(el, initValues);
        }
        el.$$animation = null;
        handle.el = null;
        handle.ended = true;
        handle.animationId = null;
        handle.emit("end", el);
        return handle;
      },
      /**
       * Takes care of the repeat key of the description.
       * @param steps {Integer} The number of steps one iteration would take.
       * @param repeat {Integer|String} It can be either a number how often the
       * animation should be repeated or the string 'infinite'.
       * @return {Integer} The number of steps to animate.
       */
      __applyRepeat__P_208_7(steps, repeat) {
        if (repeat == undefined) {
          return steps;
        }
        if (repeat == "infinite") {
          return Number.MAX_VALUE;
        }
        return steps * repeat;
      },
      /**
       * Central method to apply css styles and element properties.
       * @param el {Element} The DOM element to apply the styles.
       * @param styles {Map} A map containing styles and values.
       */
      __applyStyles__P_208_11(el, styles) {
        for (var key in styles) {
          // ignore undefined values (might be a bad detection)
          if (styles[key] === undefined) {
            continue;
          }

          // apply element property value - only if a CSS property
          // is *not* available
          if (typeof el.style[key] === "undefined" && key in el) {
            el[key] = styles[key];
            continue;
          }
          var name = qx.bom.Style.getPropertyName(key) || key;
          if (qx.bom.element.Style) {
            qx.bom.element.Style.set(el, name, styles[key]);
          } else {
            el.style[name] = styles[key];
          }
        }
      },
      /**
       * Dynamic calculation of the steps time considering a max step time.
       * @param duration {Number} The duration of the animation.
       * @param keys {Array} An array containing the ordered set of key frame keys.
       * @return {Integer} The best suited step time.
       */
      __getStepTime__P_208_4(duration, keys) {
        // get min difference
        var minDiff = 100;
        for (var i = 0; i < keys.length - 1; i++) {
          minDiff = Math.min(minDiff, keys[i + 1] - keys[i]);
        }
        var stepTime = duration * minDiff / 100;
        while (stepTime > this.__maxStepTime__P_208_0) {
          stepTime = stepTime / 2;
        }
        return Math.round(stepTime);
      },
      /**
       * Helper which returns the ordered keys of the key frame map.
       * @param keyFrames {Map} The map of key frames.
       * @return {Array} An ordered list of keys.
       */
      __getOrderedKeys__P_208_3(keyFrames) {
        var keys = Object.keys(keyFrames);
        for (var i = 0; i < keys.length; i++) {
          keys[i] = parseInt(keys[i], 10);
        }
        keys.sort(function (a, b) {
          return a - b;
        });
        return keys;
      }
    }
  });
  qx.bom.element.AnimationJs.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.String": {}
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
       * Christian Hagendorn (cs)
  
  ************************************************************************ */

  /**
   * Methods to convert colors between different color spaces.
   *
   * @ignore(qx.theme.*)
   * @ignore(qx.Class)
   * @ignore(qx.Class.*)
   */
  qx.Bootstrap.define("qx.util.ColorUtil", {
    statics: {
      /**
       * Regular expressions for color strings
       */
      REGEXP: {
        hexShort: /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])?$/,
        hexLong: /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/,
        hex3: /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
        hex6: /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
        rgb: /^rgb\(\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*\)$/,
        rgba: /^rgba\(\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,2}[0-9]*)\s*\)$/
      },
      /**
       * CSS3 system color names.
       */
      SYSTEM: {
        activeborder: true,
        activecaption: true,
        appworkspace: true,
        background: true,
        buttonface: true,
        buttonhighlight: true,
        buttonshadow: true,
        buttontext: true,
        captiontext: true,
        graytext: true,
        highlight: true,
        highlighttext: true,
        inactiveborder: true,
        inactivecaption: true,
        inactivecaptiontext: true,
        infobackground: true,
        infotext: true,
        menu: true,
        menutext: true,
        scrollbar: true,
        threeddarkshadow: true,
        threedface: true,
        threedhighlight: true,
        threedlightshadow: true,
        threedshadow: true,
        window: true,
        windowframe: true,
        windowtext: true
      },
      /**
       * Named colors, only the 16 basic colors plus the following ones:
       * transparent, grey, magenta, orange and brown
       */
      NAMED: {
        black: [0, 0, 0],
        silver: [192, 192, 192],
        gray: [128, 128, 128],
        white: [255, 255, 255],
        maroon: [128, 0, 0],
        red: [255, 0, 0],
        purple: [128, 0, 128],
        fuchsia: [255, 0, 255],
        green: [0, 128, 0],
        lime: [0, 255, 0],
        olive: [128, 128, 0],
        yellow: [255, 255, 0],
        navy: [0, 0, 128],
        blue: [0, 0, 255],
        teal: [0, 128, 128],
        aqua: [0, 255, 255],
        // Additional values
        transparent: [-1, -1, -1],
        magenta: [255, 0, 255],
        // alias for fuchsia
        orange: [255, 165, 0],
        brown: [165, 42, 42]
      },
      /**
       * Whether the incoming value is a named color.
       *
       * @param value {String} the color value to test
       * @return {Boolean} true if the color is a named color
       */
      isNamedColor(value) {
        return this.NAMED[value] !== undefined;
      },
      /**
       * Whether the incoming value is a system color.
       *
       * @param value {String} the color value to test
       * @return {Boolean} true if the color is a system color
       */
      isSystemColor(value) {
        return this.SYSTEM[value] !== undefined;
      },
      /**
       * Whether the color theme manager is loaded. Generally
       * part of the GUI of qooxdoo.
       *
       * @return {Boolean} <code>true</code> when color theme support is ready.
       **/
      supportsThemes() {
        if (qx.Class) {
          return qx.Class.isDefined("qx.theme.manager.Color");
        }
        return false;
      },
      /**
       * Whether the incoming value is a themed color.
       *
       * @param value {String} the color value to test
       * @return {Boolean} true if the color is a themed color
       */
      isThemedColor(value) {
        if (!this.supportsThemes()) {
          return false;
        }
        if (qx.theme && qx.theme.manager && qx.theme.manager.Color) {
          return qx.theme.manager.Color.getInstance().isDynamic(value);
        }
        return false;
      },
      /**
       * Try to convert an incoming string to an RGBA array.
       * Supports themed, named and system colors, but also RGBA strings,
       * hex[3468] values.
       *
       * @param str {String} any string
       * @return {Array} returns an array of red, green, blue and optional alpha on a successful transformation
       * @throws {Error} if the string could not be parsed
       */
      stringToRgb(str) {
        if (this.supportsThemes() && this.isThemedColor(str)) {
          str = qx.theme.manager.Color.getInstance().resolveDynamic(str);
        }
        return this.cssStringToRgb(str);
      },
      /**
       * Try to convert an incoming string to an RGB array with optional alpha.
       * Support named colors, RGB strings, RGBA strings, hex[3468] values.
       *
       * @param str {String} any string
       * @return {Array} returns an array of red, green, blue on a successful transformation
       * @throws {Error} if the string could not be parsed
       */
      cssStringToRgb(str) {
        var color;
        if (this.isNamedColor(str)) {
          color = this.NAMED[str].concat();
        } else if (this.isSystemColor(str)) {
          throw new Error("Could not convert system colors to RGB: " + str);
        } else if (this.isRgbaString(str)) {
          color = this.__rgbaStringToRgb__P_90_0(str);
        } else if (this.isRgbString(str)) {
          color = this.__rgbStringToRgb__P_90_1();
        } else if (this.ishexShortString(str)) {
          color = this.__hexShortStringToRgb__P_90_2();
        } else if (this.ishexLongString(str)) {
          color = this.__hexLongStringToRgb__P_90_3();
        }
        if (color) {
          // don't mention alpha if the color is opaque
          if (color.length === 3 && color[3] == 1) {
            color.pop();
          }
          return color;
        }
        throw new Error("Could not parse color: " + str);
      },
      /**
       * Try to convert an incoming string to an RGB string, which can be used
       * for all color properties.
       * Supports themed, named and system colors, but also RGB strings,
       * hexShort and hexLong values.
       *
       * @param str {String} any string
       * @return {String} a RGB string
       * @throws {Error} if the string could not be parsed
       */
      stringToRgbString(str) {
        return this.rgbToRgbString(this.stringToRgb(str));
      },
      /**
       * Converts a RGB array to an RGB string
       *
       * @param rgb {Array} an array with red, green and blue values and optionally
       * an alpha value
       * @return {String} an RGB string
       */
      rgbToRgbString(rgb) {
        return "rgb" + (rgb.length === 4 ? "a" : "") + "(" + rgb.map(function (v) {
          return Math.round(v * 1000) / 1000;
        }).join(",") + ")";
      },
      /**
       * Converts a RGB array to a hex[68] string
       *
       * @param rgb {Array} an array with red, green, blue and optional alpha
       * @return {String} a hex[68] string (#xxxxxx)
       */
      rgbToHexString(rgb) {
        return "#" + qx.lang.String.pad(rgb[0].toString(16).toUpperCase(), 2) + qx.lang.String.pad(rgb[1].toString(16).toUpperCase(), 2) + qx.lang.String.pad(rgb[2].toString(16).toUpperCase(), 2) + (rgb.length === 4 && rgb[3] !== 1 ? qx.lang.String.pad(Math.round(rgb[3] * 255).toString(16).toUpperCase(), 2) : "");
      },
      /**
       * Detects if a string is a valid qooxdoo color
       *
       * @param str {String} any string
       * @return {Boolean} true when the incoming value is a valid qooxdoo color
       */
      isValidPropertyValue(str) {
        return this.isThemedColor(str) || this.isNamedColor(str) || this.ishexShortString(str) || this.ishexLongString(str) || this.isRgbString(str) || this.isRgbaString(str);
      },
      /**
       * Detects if a string is a valid CSS color string
       *
       * @param str {String} any string
       * @return {Boolean} true when the incoming value is a valid CSS color string
       */
      isCssString(str) {
        return this.isSystemColor(str) || this.isNamedColor(str) || this.ishexShortString(str) || this.ishexLongString(str) || this.isRgbString(str) || this.isRgbaString(str);
      },
      /**
       * Detects if a string is a valid hexShort string
       *
       * @param str {String} any string
       * @return {Boolean} true when the incoming value is a valid hexShort string
       */
      ishexShortString(str) {
        return this.REGEXP.hexShort.test(str);
      },
      /**
       * Detects if a string is a valid hex3 string
       *
       * @param str {String} any string
       * @return {Boolean} true when the incoming value is a valid hex3 string
       */
      isHex3String(str) {
        return this.REGEXP.hex3.test(str);
      },
      /**
       * Detects if a string is a valid hex6 string
       *
       * @param str {String} any string
       * @return {Boolean} true when the incoming value is a valid hex6 string
       */
      isHex6String(str) {
        return this.REGEXP.hex6.test(str);
      },
      /**
       * Detects if a string is a valid hex6/8 string
       *
       * @param str {String} any string
       * @return {Boolean} true when the incoming value is a valid hex8 string
       */
      ishexLongString(str) {
        return this.REGEXP.hexLong.test(str);
      },
      /**
       * Detects if a string is a valid RGB string
       *
       * @param str {String} any string
       * @return {Boolean} true when the incoming value is a valid RGB string
       */
      isRgbString(str) {
        return this.REGEXP.rgb.test(str);
      },
      /**
       * Detects if a string is a valid RGBA string
       *
       * @param str {String} any string
       * @return {Boolean} true when the incoming value is a valid RGBA string
       */
      isRgbaString(str) {
        return this.REGEXP.rgba.test(str);
      },
      /**
       * Converts a regexp object match of a rgb string to an RGBA array.
       *
       * @return {Array} an array with red, green, blue
       */
      __rgbStringToRgb__P_90_1() {
        var red = parseInt(RegExp.$1, 10);
        var green = parseInt(RegExp.$2, 10);
        var blue = parseInt(RegExp.$3, 10);
        return [red, green, blue];
      },
      /**
       * Converts a regexp object match of a rgba string to an RGB array.
       *
       * @return {Array} an array with red, green, blue
       */
      __rgbaStringToRgb__P_90_0() {
        var red = parseInt(RegExp.$1, 10);
        var green = parseInt(RegExp.$2, 10);
        var blue = parseInt(RegExp.$3, 10);
        var alpha = parseFloat(RegExp.$4, 10);
        if (red === 0 && green === 0 & blue === 0 && alpha === 0) {
          // this is the (pre-alpha) representation of transparency
          // in qooxdoo
          return [-1, -1, -1];
        }
        return alpha == 1 ? [red, green, blue] : [red, green, blue, alpha];
      },
      /**
       * Converts a regexp object match of a hexShort string to an RGB array.
       *
       * @return {Array} an array with red, green, blue
       */
      __hexShortStringToRgb__P_90_2() {
        var red = parseInt(RegExp.$1, 16) * 17;
        var green = parseInt(RegExp.$2, 16) * 17;
        var blue = parseInt(RegExp.$3, 16) * 17;
        var alpha = Math.round(parseInt(RegExp.$4 || "f", 16) / 15 * 1000) / 1000;
        return alpha == 1 ? [red, green, blue] : [red, green, blue, alpha];
      },
      /**
       * Converts a regexp object match of a hex3 string to an RGB array.
       *
       * @return {Array} an array with red, green, blue
       */
      __hex3StringToRgb__P_90_4() {
        var red = parseInt(RegExp.$1, 16) * 17;
        var green = parseInt(RegExp.$2, 16) * 17;
        var blue = parseInt(RegExp.$3, 16) * 17;
        return [red, green, blue];
      },
      /**
       * Converts a regexp object match of a hex6 string to an RGB array.
       *
       * @return {Array} an array with red, green, blue
       */
      __hex6StringToRgb__P_90_5() {
        var red = parseInt(RegExp.$1, 16) * 16 + parseInt(RegExp.$2, 16);
        var green = parseInt(RegExp.$3, 16) * 16 + parseInt(RegExp.$4, 16);
        var blue = parseInt(RegExp.$5, 16) * 16 + parseInt(RegExp.$6, 16);
        return [red, green, blue];
      },
      /**
       * Converts a regexp object match of a hexLong string to an RGB array.
       *
       * @return {Array} an array with red, green, blue
       */
      __hexLongStringToRgb__P_90_3() {
        var red = parseInt(RegExp.$1, 16);
        var green = parseInt(RegExp.$2, 16);
        var blue = parseInt(RegExp.$3, 16);
        var alpha = Math.round(parseInt(RegExp.$4 || "ff", 16) / 255 * 1000) / 1000;
        return alpha == 1 ? [red, green, blue] : [red, green, blue, alpha];
      },
      /**
       * Converts a hex3 string to an RGB array
       *
       * @param value {String} a hex3 (#xxx) string
       * @return {Array} an array with red, green, blue
       */
      hex3StringToRgb(value) {
        if (this.isHex3String(value)) {
          return this.__hex3StringToRgb__P_90_4(value);
        }
        throw new Error("Invalid hex3 value: " + value);
      },
      /**
       * Converts a hex3 (#xxx) string to a hex6 (#xxxxxx) string.
       *
       * @param value {String} a hex3 (#xxx) string
       * @return {String} The hex6 (#xxxxxx) string or the passed value when the
       *   passed value is not an hex3 (#xxx) value.
       */
      hex3StringToHex6String(value) {
        if (this.isHex3String(value)) {
          return this.rgbToHexString(this.hex3StringToRgb(value));
        }
        return value;
      },
      /**
       * Converts a hex6 string to an RGB array
       *
       * @param value {String} a hex6 (#xxxxxx) string
       * @return {Array} an array with red, green, blue
       */
      hex6StringToRgb(value) {
        if (this.isHex6String(value)) {
          return this.__hex6StringToRgb__P_90_5(value);
        }
        throw new Error("Invalid hex6 value: " + value);
      },
      /**
       * Converts a hex string to an RGB array
       *
       * @param value {String} a hexShort (#rgb/#rgba) or hexLong (#rrggbb/#rrggbbaa) string
       * @return {Array} an array with red, green, blue and alpha
       */
      hexStringToRgb(value) {
        if (this.ishexShortString(value)) {
          return this.__hexShortStringToRgb__P_90_2(value);
        }
        if (this.ishexLongString(value)) {
          return this.__hexLongStringToRgb__P_90_3(value);
        }
        throw new Error("Invalid hex value: " + value);
      },
      /**
       * Convert RGB colors to HSB/HSV
       *
       * @param rgb {Number[]} red, blue and green as array
       * @return {Array} an array with hue, saturation and brightness/value
       */
      rgbToHsb(rgb) {
        var hue, saturation, brightness;
        var red = rgb[0];
        var green = rgb[1];
        var blue = rgb[2];
        var cmax = red > green ? red : green;
        if (blue > cmax) {
          cmax = blue;
        }
        var cmin = red < green ? red : green;
        if (blue < cmin) {
          cmin = blue;
        }
        brightness = cmax / 255.0;
        if (cmax != 0) {
          saturation = (cmax - cmin) / cmax;
        } else {
          saturation = 0;
        }
        if (saturation == 0) {
          hue = 0;
        } else {
          var redc = (cmax - red) / (cmax - cmin);
          var greenc = (cmax - green) / (cmax - cmin);
          var bluec = (cmax - blue) / (cmax - cmin);
          if (red == cmax) {
            hue = bluec - greenc;
          } else if (green == cmax) {
            hue = 2.0 + redc - bluec;
          } else {
            hue = 4.0 + greenc - redc;
          }
          hue = hue / 6.0;
          if (hue < 0) {
            hue = hue + 1.0;
          }
        }
        return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
      },
      /**
       * Convert HSB/HSV colors to RGB
       *
       * @param hsb {Number[]} an array with hue, saturation and brightness/value
       * @return {Integer[]} an array with red, green, blue
       */
      hsbToRgb(hsb) {
        var i, f, p, r, t;
        var hue = hsb[0] / 360;
        var saturation = hsb[1] / 100;
        var brightness = hsb[2] / 100;
        if (hue >= 1.0) {
          hue %= 1.0;
        }
        if (saturation > 1.0) {
          saturation = 1.0;
        }
        if (brightness > 1.0) {
          brightness = 1.0;
        }
        var tov = Math.floor(255 * brightness);
        var rgb = {};
        if (saturation == 0.0) {
          rgb.red = rgb.green = rgb.blue = tov;
        } else {
          hue *= 6.0;
          i = Math.floor(hue);
          f = hue - i;
          p = Math.floor(tov * (1.0 - saturation));
          r = Math.floor(tov * (1.0 - saturation * f));
          t = Math.floor(tov * (1.0 - saturation * (1.0 - f)));
          switch (i) {
            case 0:
              rgb.red = tov;
              rgb.green = t;
              rgb.blue = p;
              break;
            case 1:
              rgb.red = r;
              rgb.green = tov;
              rgb.blue = p;
              break;
            case 2:
              rgb.red = p;
              rgb.green = tov;
              rgb.blue = t;
              break;
            case 3:
              rgb.red = p;
              rgb.green = r;
              rgb.blue = tov;
              break;
            case 4:
              rgb.red = t;
              rgb.green = p;
              rgb.blue = tov;
              break;
            case 5:
              rgb.red = tov;
              rgb.green = p;
              rgb.blue = r;
              break;
          }
        }
        return [rgb.red, rgb.green, rgb.blue];
      },
      /**
       * Convert RGB colors to HSL
       *
       * @param rgb {Number[]} red, blue and green as array
       * @return {Array} an array with hue, saturation and lightness
       */
      rgbToHsl(rgb) {
        var r = rgb[0] / 255;
        var g = rgb[1] / 255;
        var b = rgb[2] / 255;
        // implementation from
        // https://stackoverflow.com/questions/2348597/why-doesnt-this-javascript-rgb-to-hsl-code-work/54071699#54071699
        var a = Math.max(r, g, b);
        var n = a - Math.min(r, g, b);
        var f = 1 - Math.abs(a + a - n - 1);
        var h = n && (a == r ? (g - b) / n : a == g ? 2 + (b - r) / n : 4 + (r - g) / n);
        return [60 * (h < 0 ? h + 6 : h), 100 * (f ? n / f : 0), 100 * (a + a - n) / 2];
      },
      /**
       * Convert HSL colors to RGB
       *
       * @param hsl {Number[]} an array with hue, saturation and lightness
       * @return {Integer[]} an array with red, green, blue
       */
      hslToRgb(hsl) {
        var h = hsl[0];
        var s = hsl[1] / 100;
        var l = hsl[2] / 100;
        // implementation from
        // https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex/54014428#54014428
        var a = s * Math.min(l, 1 - l);
        var f = function (n) {
          var k = (n + h / 30) % 12;
          return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        };
        return [f(0), f(8), f(4)].map(function (v) {
          return Math.round(v * 2550) / 10;
        });
      },
      /**
       * Creates a random color.
       *
       * @return {String} a valid qooxdoo/CSS rgb color string.
       */
      randomColor() {
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        return this.rgbToRgbString([r, g, b]);
      },
      /**
       * Tune a color string according to the tuneMap
       *
       * @param color {String} a valid qooxdoo/CSS rgb color string
       * @param scaleMap {Map}  as described above
       * @param tuner {Function}  function
       * @param hue_tuner {Function}  function
       * @return {String} a valid CSS rgb color string.*
       */
      __tuner__P_90_6(color, tuneMap, tuner, hue_tuner) {
        var rgba = this.stringToRgb(color);
        for (var key in tuneMap) {
          if (tuneMap[key] == 0) {
            continue;
          }
          switch (key) {
            case "red":
              rgba[0] = tuner(rgba[0], tuneMap[key], 255);
              break;
            case "green":
              rgba[1] = tuner(rgba[1], tuneMap[key], 255);
              break;
            case "blue":
              rgba[2] = tuner(rgba[2], tuneMap[key], 255);
              break;
            case "alpha":
              rgba[3] = tuner(rgba[3] || 1, tuneMap[key], 1);
              break;
            case "hue":
              if (hue_tuner) {
                var hsb = this.rgbToHsb(rgba);
                hsb[0] = hue_tuner(hsb[0], tuneMap[key]);
                var rgb = this.hsbToRgb(hsb);
                rgb[3] = rgba[3];
                rgba = rgb;
              } else {
                throw new Error("Invalid key in map: " + key);
              }
              break;
            case "saturation":
              var hsb = this.rgbToHsb(rgba);
              hsb[1] = tuner(hsb[1], tuneMap[key], 100);
              rgb = this.hsbToRgb(hsb);
              rgb[3] = rgba[3];
              rgba = rgb;
              break;
            case "brightness":
              var hsb = this.rgbToHsb(rgba);
              hsb[2] = tuner(hsb[2], tuneMap[key], 100);
              rgb = this.hsbToRgb(hsb);
              rgb[3] = rgba[3];
              rgba = rgb;
              break;
            case "lightness":
              var hsl = this.rgbToHsl(rgba);
              hsl[2] = tuner(hsl[2], tuneMap[key], 100);
              rgb = this.hslToRgb(hsl);
              rgb[3] = rgba[3];
              rgba = rgb;
              break;
            default:
              throw new Error("Invalid key in tune map: " + key);
          }
        }
        if (rgba.length === 4) {
          if (rgba[3] === undefined || rgba[3] >= 1) {
            rgba.pop();
          } else if (rgba[3] < 0) {
            rgba[3] = 0;
          }
        }
        [0, 1, 2].forEach(function (i) {
          if (rgba[i] < 0) {
            rgba[i] = 0;
            return;
          }
          if (rgba[i] > 255) {
            rgba[i] = 255;
            return;
          }
        });
        return this.rgbToRgbString(rgba);
      },
      /**
       * Scale
       *
       * Scale the given properties of the input color according to the
       * configuration given in the `scaleMap`. Each key argument must point to a
       * number between -100% and 100% (inclusive). This indicates how far the
       * corresponding property should be moved from its original position
       * towards the maximum (if the argument is positive) or the minimum (if the
       * argument is negative). This means that, for example, `lightness: "50%"`
       * will make all colors 50% closer to maximum lightness without making them
       * fully white.
       *
       * Supported keys are:
       * `red`, `green`, `blue`, `alpha`, `saturation`,
       * `brightness`, `value`, `lightness`.
       *
       * @param color {String}  a valid qooxdoo/CSS rgb color string
       * @param scaleMap {Map}  as described above
       * @return {String} a valid CSS rgb color string.
       */

      scale(color, scaleMap) {
        return this.__tuner__P_90_6(color, scaleMap, function (value, scale, max) {
          if (value > max) {
            value = max;
          }
          if (scale > 0) {
            if (scale > 100) {
              scale = 100;
            }
            return value + (max - value) * scale / 100;
          }
          // scale < 0
          if (scale < -100) {
            scale = -100;
          }
          return value + value * scale / 100;
        });
      },
      /**
       * Adjust
       *
       * Increases or decreases one or more properties of the input color
       * by fixed amounts according to the configuration given in the
       * `adjustMap`. The value of the corresponding key is added to the
       * original value and the final result is adjusted to stay within legal
       * bounds. Hue values can go full circle.a1
       *
       * Supported keys are:
       * `red`, `green`, `blue`, `alpha`, `hue`, `saturation`, `brightness`,
       * `lightness`
       *
       * @param color {String} a valid qooxdoo/CSS rgb color string
       * @param scaleMap {Map} as described above
       * @return {String} a valid CSS rgb color string.
       */
      adjust(color, adjustMap) {
        return this.__tuner__P_90_6(color, adjustMap, function (value, offset, max) {
          value += offset;
          if (value > max) {
            return max;
          }
          if (value < 0) {
            return 0;
          }
          return value;
        }, function (value, offset) {
          value += offset;
          while (value >= 360) {
            value -= 360;
          }
          while (value < 0) {
            value += 360;
          }
          return value;
        });
      },
      /**
       * RgbToLuminance
       *
       * Calculate the [luminance](https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests) of the given rgb color.
       *
       * @param color {String} a valid qooxdoo/CSS rgb color string
       * @return {Number} luminance
       */
      luminance(color) {
        var rgb = this.stringToRgb(color);
        var lum = function (i) {
          var c = rgb[i] / 255;
          return c < 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * lum(0) + 0.7152 * lum(1) + 0.0722 * lum(2);
      },
      /**
       * contrast
       *
       * Calculate the contrast of two given rgb colors.
       *
       * @param back {String} a valid qooxdoo/CSS rgb color string
       * @param front {String} a valid qooxdoo/CSS rgb color string
       * @return {Number} contrast
       */
      contrast(back, front) {
        var bl = this.luminance(back) + 0.05;
        var fl = this.luminance(front) + 0.5;
        return Math.max(bl, fl) / Math.min(bl, fl);
      },
      /**
       * Picks a contrasting color
       *
       * @param rgb {Number[]|String} the color, either as a string or as an RGB array of 3 numbers
       * @param threshold {Number?} the threshold between light and dark outputs, where the range is 0-255, defaults to 128
       * @param dark {String?} the colour to use for "dark", defaults to black
       * @param light {String?} the colour to use for "light", defaults to white
       * @return {String} colour string
       */
      chooseContrastingColor(rgb, threshold, dark, light) {
        if (typeof rgb == "string") {
          rgb = qx.util.ColorUtil.stringToRgb(rgb);
        }
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];
        if (!threshold) {
          threshold = 128;
        }

        // Combine into the YIQ color space (which gives us a handy scale we can use with a threshold)
        var yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= threshold ? dark || "#000" : light || "#fff";
      }
    }
  });
  qx.util.ColorUtil.$$dbClassInfo = $$dbClassInfo;
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A decorator is responsible for computing a widget's decoration styles.
   *
   */
  qx.Interface.define("qx.ui.decoration.IDecorator", {
    members: {
      /**
       * Returns the decorator's styles.
       *
       * @return {Map} Map of decoration styles
       */
      getStyles() {},
      /**
       * Returns the configured padding minus the border width.
       * @return {Map} Map of top, right, bottom and left padding values
       */
      getPadding() {},
      /**
       * Get the amount of space the decoration needs for its border and padding
       * on each side.
       *
       * @return {Map} the desired inset as a map with the keys <code>top</code>,
       *     <code>right</code>, <code>bottom</code>, <code>left</code>.
       */
      getInsets() {}
    }
  });
  qx.ui.decoration.IDecorator.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.decoration.IDecorator": {
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
       * Martin Wittemann (martinwittemann)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */
  /**
   * This class acts as abstract class for all decorators. It offers the
   * properties for the insets handling. Each decorator has to define its own
   * default insets by implementing the template method
   * (http://en.wikipedia.org/wiki/Template_Method) <code>_getDefaultInsets</code>
   */
  qx.Class.define("qx.ui.decoration.Abstract", {
    extend: qx.core.Object,
    implement: [qx.ui.decoration.IDecorator],
    type: "abstract",
    members: {
      __insets__P_185_0: null,
      /**
       * Abstract method. Should return a map containing the default insets of
       * the decorator. This could look like this:
       * <pre>
       * return {
       *   top : 0,
       *   right : 0,
       *   bottom : 0,
       *   left : 0
       * };
       * </pre>
       * @return {Map} Map containing the insets.
       */
      _getDefaultInsets() {
        throw new Error("Abstract method called.");
      },
      /**
       * Abstract method. Should return an boolean value if the decorator is
       * already initialized or not.
       * @return {Boolean} True, if the decorator is initialized.
       */
      _isInitialized() {
        throw new Error("Abstract method called.");
      },
      /**
       * Resets the insets.
       */
      _resetInsets() {
        this.__insets__P_185_0 = null;
      },
      // interface implementation
      getInsets() {
        if (!this.__insets__P_185_0) {
          this.__insets__P_185_0 = this._getDefaultInsets();
        }
        return this.__insets__P_185_0;
      }
    },
    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */

    destruct() {
      this.__insets__P_185_0 = null;
    }
  });
  qx.ui.decoration.Abstract.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.theme.manager.Color": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.theme": {}
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * Mixin responsible for setting the background color of a widget.
   * This mixin is usually used by {@link qx.ui.decoration.Decorator}.
   */
  qx.Mixin.define("qx.ui.decoration.MBackgroundColor", {
    properties: {
      /** Color of the background */
      backgroundColor: {
        check: "Color",
        nullable: true,
        apply: "_applyBackgroundColor"
      }
    },
    members: {
      /**
       * Adds the background-color styles to the given map
       * @param styles {Map} CSS style map
       */
      _styleBackgroundColor(styles) {
        var bgcolor = this.getBackgroundColor();
        if (bgcolor && qx.core.Environment.get("qx.theme")) {
          bgcolor = qx.theme.manager.Color.getInstance().resolve(bgcolor);
        }
        if (bgcolor) {
          styles["background-color"] = bgcolor;
        }
      },
      // property apply
      _applyBackgroundColor() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      }
    }
  });
  qx.ui.decoration.MBackgroundColor.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
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
       2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * Mixin for the border radius CSS property.
   * This mixin is usually used by {@link qx.ui.decoration.Decorator}.
   *
   * Keep in mind that this is not supported by all browsers:
   *
   * * Firefox 3,5+
   * * IE9+
   * * Safari 3.0+
   * * Opera 10.5+
   * * Chrome 4.0+
   */
  qx.Mixin.define("qx.ui.decoration.MBorderRadius", {
    properties: {
      /** top left corner radius */
      radiusTopLeft: {
        nullable: true,
        check: "Integer",
        apply: "_applyBorderRadius"
      },
      /** top right corner radius */
      radiusTopRight: {
        nullable: true,
        check: "Integer",
        apply: "_applyBorderRadius"
      },
      /** bottom left corner radius */
      radiusBottomLeft: {
        nullable: true,
        check: "Integer",
        apply: "_applyBorderRadius"
      },
      /** bottom right corner radius */
      radiusBottomRight: {
        nullable: true,
        check: "Integer",
        apply: "_applyBorderRadius"
      },
      /** Property group to set the corner radius of all sides */
      radius: {
        group: ["radiusTopLeft", "radiusTopRight", "radiusBottomRight", "radiusBottomLeft"],
        mode: "shorthand"
      }
    },
    members: {
      /**
       * Takes a styles map and adds the border radius styles in place to the
       * given map. This is the needed behavior for
       * {@link qx.ui.decoration.Decorator}.
       *
       * @param styles {Map} A map to add the styles.
       */
      _styleBorderRadius(styles) {
        // Fixing the background bleed in Webkits
        // http://tumble.sneak.co.nz/post/928998513/fixing-the-background-bleed
        styles["-webkit-background-clip"] = "padding-box";
        styles["background-clip"] = "padding-box";

        // radius handling
        var hasRadius = false;
        var radius = this.getRadiusTopLeft();
        if (radius > 0) {
          hasRadius = true;
          styles["-moz-border-radius-topleft"] = radius + "px";
          styles["-webkit-border-top-left-radius"] = radius + "px";
          styles["border-top-left-radius"] = radius + "px";
        }
        radius = this.getRadiusTopRight();
        if (radius > 0) {
          hasRadius = true;
          styles["-moz-border-radius-topright"] = radius + "px";
          styles["-webkit-border-top-right-radius"] = radius + "px";
          styles["border-top-right-radius"] = radius + "px";
        }
        radius = this.getRadiusBottomLeft();
        if (radius > 0) {
          hasRadius = true;
          styles["-moz-border-radius-bottomleft"] = radius + "px";
          styles["-webkit-border-bottom-left-radius"] = radius + "px";
          styles["border-bottom-left-radius"] = radius + "px";
        }
        radius = this.getRadiusBottomRight();
        if (radius > 0) {
          hasRadius = true;
          styles["-moz-border-radius-bottomright"] = radius + "px";
          styles["-webkit-border-bottom-right-radius"] = radius + "px";
          styles["border-bottom-right-radius"] = radius + "px";
        }

        // Fixing the background bleed in Webkits
        // http://tumble.sneak.co.nz/post/928998513/fixing-the-background-bleed
        if (hasRadius && qx.core.Environment.get("engine.name") == "webkit") {
          styles["-webkit-background-clip"] = "padding-box";
        } else {
          styles["background-clip"] = "padding-box";
        }
      },
      // property apply
      _applyBorderRadius() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      }
    }
  });
  qx.ui.decoration.MBorderRadius.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.bom.Style": {},
      "qx.theme.manager.Color": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.boxshadow": {
          "className": "qx.bom.client.Css"
        },
        "qx.theme": {}
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * Mixin for the box shadow CSS property.
   * This mixin is usually used by {@link qx.ui.decoration.Decorator}.
   *
   * Keep in mind that this is not supported by all browsers:
   *
   * * Firefox 3,5+
   * * IE9+
   * * Safari 3.0+
   * * Opera 10.5+
   * * Chrome 4.0+
   *
   * It is possible to define multiple box shadows by setting an
   * array containing the needed values as the property value.
   * In case multiple values are specified, the values of the properties
   * are repeated until all match in length.
   *
   * An example:
   * <pre class="javascript">
   *   'my-decorator': {
   *     style: {
   *       shadowBlurRadius: 2,
   *       shadowVerticalLength: 1,
   *       shadowColor: ['rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.4)'],
   *       inset: [true, false]
   *     }
   *   }
   * </pre>
   * which is the same as:
   * <pre class="javascript">
   *   'my-decorator': {
   *     style: {
   *       shadowBlurRadius: [2, 2],
   *       shadowVerticalLength: [1, 1],
   *       shadowColor: ['rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.4)'],
   *       inset: [true, false]
   *     }
   *   }
   */
  qx.Mixin.define("qx.ui.decoration.MBoxShadow", {
    properties: {
      /** Horizontal length of the shadow. */
      shadowHorizontalLength: {
        nullable: true,
        apply: "_applyBoxShadow"
      },
      /** Vertical length of the shadow. */
      shadowVerticalLength: {
        nullable: true,
        apply: "_applyBoxShadow"
      },
      /** The blur radius of the shadow. */
      shadowBlurRadius: {
        nullable: true,
        apply: "_applyBoxShadow"
      },
      /** The spread radius of the shadow. */
      shadowSpreadRadius: {
        nullable: true,
        apply: "_applyBoxShadow"
      },
      /** The color of the shadow. */
      shadowColor: {
        nullable: true,
        apply: "_applyBoxShadow"
      },
      /** Inset shadows are drawn inside the border. */
      inset: {
        init: false,
        apply: "_applyBoxShadow"
      },
      /** Property group to set the shadow length. */
      shadowLength: {
        group: ["shadowHorizontalLength", "shadowVerticalLength"],
        mode: "shorthand"
      }
    },
    members: {
      /**
       * Takes a styles map and adds the box shadow styles in place to the
       * given map. This is the needed behavior for
       * {@link qx.ui.decoration.Decorator}.
       *
       * @param styles {Map} A map to add the styles.
       */
      _styleBoxShadow(styles) {
        var propName = qx.core.Environment.get("css.boxshadow");
        if (!propName || this.getShadowVerticalLength() == null && this.getShadowHorizontalLength() == null) {
          return;
        }
        propName = qx.bom.Style.getCssName(propName);
        var Color = null;
        if (qx.core.Environment.get("qx.theme")) {
          Color = qx.theme.manager.Color.getInstance();
        }
        var boxShadowProperties = ["shadowVerticalLength", "shadowHorizontalLength", "shadowBlurRadius", "shadowSpreadRadius", "shadowColor", "inset"];
        (function (vLengths, hLengths, blurs, spreads, colors, insets) {
          for (var i = 0; i < vLengths.length; i++) {
            var vLength = vLengths[i] || 0;
            var hLength = hLengths[i] || 0;
            var blur = blurs[i] || 0;
            var spread = spreads[i] || 0;
            var color = colors[i] || "black";
            var inset = insets[i];
            if (Color) {
              color = Color.resolve(color);
            }
            if (color != null) {
              var value = (inset ? "inset " : "") + hLength + "px " + vLength + "px " + blur + "px " + spread + "px " + color;
              // apply or append the box shadow styles
              if (!styles[propName]) {
                styles[propName] = value;
              } else {
                styles[propName] += "," + value;
              }
            }
          }
        }).apply(this, this._getExtendedPropertyValueArrays(boxShadowProperties));
      },
      // property apply
      _applyBoxShadow() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      }
    }
  });
  qx.ui.decoration.MBoxShadow.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.theme.manager.Color": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.theme": {}
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * A basic decorator featuring simple borders based on CSS styles.
   * This mixin is usually used by {@link qx.ui.decoration.Decorator}.
   */
  qx.Mixin.define("qx.ui.decoration.MSingleBorder", {
    properties: {
      /*
      ---------------------------------------------------------------------------
        PROPERTY: WIDTH
      ---------------------------------------------------------------------------
      */

      /** top width of border */
      widthTop: {
        check: "Number",
        init: 0,
        apply: "_applyWidth"
      },
      /** right width of border */
      widthRight: {
        check: "Number",
        init: 0,
        apply: "_applyWidth"
      },
      /** bottom width of border */
      widthBottom: {
        check: "Number",
        init: 0,
        apply: "_applyWidth"
      },
      /** left width of border */
      widthLeft: {
        check: "Number",
        init: 0,
        apply: "_applyWidth"
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY: STYLE
      ---------------------------------------------------------------------------
      */

      /** top style of border */
      styleTop: {
        nullable: true,
        check: ["solid", "dotted", "dashed", "double", "inset", "outset", "ridge", "groove"],
        init: "solid",
        apply: "_applyStyle"
      },
      /** right style of border */
      styleRight: {
        nullable: true,
        check: ["solid", "dotted", "dashed", "double", "inset", "outset", "ridge", "groove"],
        init: "solid",
        apply: "_applyStyle"
      },
      /** bottom style of border */
      styleBottom: {
        nullable: true,
        check: ["solid", "dotted", "dashed", "double", "inset", "outset", "ridge", "groove"],
        init: "solid",
        apply: "_applyStyle"
      },
      /** left style of border */
      styleLeft: {
        nullable: true,
        check: ["solid", "dotted", "dashed", "double", "inset", "outset", "ridge", "groove"],
        init: "solid",
        apply: "_applyStyle"
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY: COLOR
      ---------------------------------------------------------------------------
      */

      /** top color of border */
      colorTop: {
        nullable: true,
        check: "Color",
        apply: "_applyStyle"
      },
      /** right color of border */
      colorRight: {
        nullable: true,
        check: "Color",
        apply: "_applyStyle"
      },
      /** bottom color of border */
      colorBottom: {
        nullable: true,
        check: "Color",
        apply: "_applyStyle"
      },
      /** left color of border */
      colorLeft: {
        nullable: true,
        check: "Color",
        apply: "_applyStyle"
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY GROUP: EDGE
      ---------------------------------------------------------------------------
      */

      /** Property group to configure the left border */
      left: {
        group: ["widthLeft", "styleLeft", "colorLeft"]
      },
      /** Property group to configure the right border */
      right: {
        group: ["widthRight", "styleRight", "colorRight"]
      },
      /** Property group to configure the top border */
      top: {
        group: ["widthTop", "styleTop", "colorTop"]
      },
      /** Property group to configure the bottom border */
      bottom: {
        group: ["widthBottom", "styleBottom", "colorBottom"]
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY GROUP: TYPE
      ---------------------------------------------------------------------------
      */

      /** Property group to set the border width of all sides */
      width: {
        group: ["widthTop", "widthRight", "widthBottom", "widthLeft"],
        mode: "shorthand"
      },
      /** Property group to set the border style of all sides */
      style: {
        group: ["styleTop", "styleRight", "styleBottom", "styleLeft"],
        mode: "shorthand"
      },
      /** Property group to set the border color of all sides */
      color: {
        group: ["colorTop", "colorRight", "colorBottom", "colorLeft"],
        mode: "shorthand"
      }
    },
    members: {
      /**
       * Takes a styles map and adds the border styles styles in place
       * to the given map. This is the needed behavior for
       * {@link qx.ui.decoration.Decorator}.
       *
       * @param styles {Map} A map to add the styles.
       */
      _styleBorder(styles) {
        if (qx.core.Environment.get("qx.theme")) {
          var Color = qx.theme.manager.Color.getInstance();
          var colorTop = Color.resolve(this.getColorTop());
          var colorRight = Color.resolve(this.getColorRight());
          var colorBottom = Color.resolve(this.getColorBottom());
          var colorLeft = Color.resolve(this.getColorLeft());
        } else {
          var colorTop = this.getColorTop();
          var colorRight = this.getColorRight();
          var colorBottom = this.getColorBottom();
          var colorLeft = this.getColorLeft();
        }

        // Add borders
        var width = this.getWidthTop();
        if (width > 0) {
          styles["border-top"] = width + "px " + this.getStyleTop() + " " + (colorTop || "");
        }
        var width = this.getWidthRight();
        if (width > 0) {
          styles["border-right"] = width + "px " + this.getStyleRight() + " " + (colorRight || "");
        }
        var width = this.getWidthBottom();
        if (width > 0) {
          styles["border-bottom"] = width + "px " + this.getStyleBottom() + " " + (colorBottom || "");
        }
        var width = this.getWidthLeft();
        if (width > 0) {
          styles["border-left"] = width + "px " + this.getStyleLeft() + " " + (colorLeft || "");
        }

        // Check if valid
        {
          if (styles.length === 0) {
            throw new Error("Invalid Single decorator (zero border width). Use qx.ui.decorator.Background instead!");
          }
        }

        // Add basic styles
        styles.position = "absolute";
      },
      /**
       * Implementation of the interface for the single border.
       *
       * @return {Map} A map containing the default insets.
       *   (top, right, bottom, left)
       */
      _getDefaultInsetsForBorder() {
        return {
          top: this.getWidthTop(),
          right: this.getWidthRight(),
          bottom: this.getWidthBottom(),
          left: this.getWidthLeft()
        };
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyWidth() {
        this._applyStyle();
        this._resetInsets();
      },
      // property apply
      _applyStyle() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      }
    }
  });
  qx.ui.decoration.MSingleBorder.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Type": {},
      "qx.util.AliasManager": {},
      "qx.util.ResourceManager": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      }
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
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * Mixin for supporting the background images on decorators.
   * This mixin is usually used by {@link qx.ui.decoration.Decorator}.
   *
   * It is possible to define multiple background images by setting an
   * array containing the needed values as the property value.
   * In case multiple values are specified, the values of the properties
   * are repeated until all match in length.
   *
   * An example:
   * <pre class="javascript">
   *   'my-decorator': {
   *     style: {
   *       backgroundImage: ['foo1.png', 'foo2.png', 'bar1.png', 'bar2.png'],
   *       backgroundRepeat: 'no-repeat',
   *       backgroundPositionX: ['left', 'right', 'center'],
   *       backgroundPositionY: ['center', 'top']
   *     }
   *   }
   * </pre>
   * which is the same as:
   * <pre class="javascript">
   *   'my-decorator': {
   *     style: {
   *       backgroundImage: ['foo1.png', 'foo2.png', 'bar1.png', 'bar2.png'],
   *       backgroundRepeat: ['no-repeat', 'no-repeat', 'no-repeat', 'no-repeat'],
   *       backgroundPositionX: ['left', 'right', 'center', 'left'],
   *       backgroundPositionY: ['center', 'top', 'center', 'top']
   *     }
   *   }
   * </pre>
   */
  qx.Mixin.define("qx.ui.decoration.MBackgroundImage", {
    properties: {
      /** The URL of the background image */
      backgroundImage: {
        nullable: true,
        apply: "_applyBackgroundImage"
      },
      /** How the background image should be repeated */
      backgroundRepeat: {
        init: "repeat",
        apply: "_applyBackgroundImage"
      },
      /**
       * Either a string or a number, which defines the horizontal position
       * of the background image.
       *
       * If the value is an integer it is interpreted as a pixel value, otherwise
       * the value is taken to be a CSS value. For CSS, the values are "center",
       * "left" and "right".
       */
      backgroundPositionX: {
        nullable: true,
        apply: "_applyBackgroundPosition"
      },
      /**
       * Either a string or a number, which defines the vertical position
       * of the background image.
       *
       * If the value is an integer it is interpreted as a pixel value, otherwise
       * the value is taken to be a CSS value. For CSS, the values are "top",
       * "center" and "bottom".
       */
      backgroundPositionY: {
        nullable: true,
        apply: "_applyBackgroundPosition"
      },
      /**
       * Specifies where the background image is positioned.
       */
      backgroundOrigin: {
        nullable: true,
        apply: "_applyBackgroundImage"
      },
      /**
       * Property group to define the background position
       */
      backgroundPosition: {
        group: ["backgroundPositionY", "backgroundPositionX"]
      },
      /**
       * Whether to order gradients before Image-URL-based background declarations
       * if both qx.ui.decoration.MBackgroundImage and
       * qx.ui.decoration.MLinearBackgroundGradient decorations are used.
       */
      orderGradientsFront: {
        check: "Boolean",
        init: false
      }
    },
    members: {
      /**
       * Adds the background-image styles to the given map
       * @param styles {Map} CSS style map
       */
      _styleBackgroundImage(styles) {
        if (!this.getBackgroundImage()) {
          return;
        }
        if ("background" in styles) {
          if (!qx.lang.Type.isArray(styles["background"])) {
            styles["background"] = [styles["background"]];
          }
        } else {
          styles["background"] = [];
        }
        var backgroundImageProperties = ["backgroundImage", "backgroundRepeat", "backgroundPositionY", "backgroundPositionX", "backgroundOrigin"];
        (function (images, repeats, tops, lefts, origins) {
          for (var i = 0; i < images.length; i++) {
            var image = images[i];
            var repeat = repeats[i];
            var top = tops[i] || 0;
            var left = lefts[i] || 0;
            var origin = origins[i] || "";
            if (top == null) {
              top = 0;
            }
            if (left == null) {
              left = 0;
            }
            if (!isNaN(top)) {
              top += "px";
            }
            if (!isNaN(left)) {
              left += "px";
            }
            var id = qx.util.AliasManager.getInstance().resolve(image);
            var source = qx.util.ResourceManager.getInstance().toUri(id);
            var attrs = {
              image: "url(" + source + ")",
              position: left + " " + top,
              repeat: "repeat",
              origin: origin
            };
            if (repeat === "scale") {
              attrs.size = "100% 100%";
            } else {
              attrs.repeat = repeat;
            }
            var imageMarkup = [attrs.image, attrs.position + ("size" in attrs ? " / " + attrs.size : ""), attrs.repeat, attrs.origin];
            styles["background"][this.getOrderGradientsFront() ? "push" : "unshift"](imageMarkup.join(" "));
            if (true && source && source.endsWith(".png") && (repeat == "scale" || repeat == "no-repeat") && qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
              this.warn("Background PNGs with repeat == 'scale' or repeat == 'no-repeat' are not supported in this client! The image's resource id is '" + id + "'");
            }
          }
        }).apply(this, this._getExtendedPropertyValueArrays(backgroundImageProperties));
      },
      // property apply
      _applyBackgroundImage() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      },
      // property apply
      _applyBackgroundPosition() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
          if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
            this.warn("The backgroundPosition property is not supported by this client!");
          }
        }
      }
    }
  });
  qx.ui.decoration.MBackgroundImage.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.decoration.MSingleBorder": {
        "require": true
      },
      "qx.ui.decoration.MBackgroundImage": {
        "require": true
      },
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.theme.manager.Color": {},
      "qx.bom.Style": {},
      "qx.log.Logger": {},
      "qx.util.ColorUtil": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.boxshadow": {
          "className": "qx.bom.client.Css"
        },
        "qx.theme": {},
        "css.boxsizing": {
          "className": "qx.bom.client.Css"
        },
        "css.borderradius": {
          "className": "qx.bom.client.Css"
        },
        "css.rgba": {
          "className": "qx.bom.client.Css"
        }
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * Border implementation with two CSS borders. Both borders can be styled
   * independent of each other.
   * This mixin is usually used by {@link qx.ui.decoration.Decorator}.
   */
  qx.Mixin.define("qx.ui.decoration.MDoubleBorder", {
    include: [qx.ui.decoration.MSingleBorder, qx.ui.decoration.MBackgroundImage],
    construct() {
      // override the methods of single border and background image
      this._getDefaultInsetsForBorder = this.__getDefaultInsetsForDoubleBorder__P_186_0;
      this._styleBorder = this.__styleDoubleBorder__P_186_1;
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /*
      ---------------------------------------------------------------------------
        PROPERTY: INNER WIDTH
      ---------------------------------------------------------------------------
      */

      /** top width of border */
      innerWidthTop: {
        check: "Number",
        init: 0,
        apply: "_applyDoubleBorder"
      },
      /** right width of border */
      innerWidthRight: {
        check: "Number",
        init: 0,
        apply: "_applyDoubleBorder"
      },
      /** bottom width of border */
      innerWidthBottom: {
        check: "Number",
        init: 0,
        apply: "_applyDoubleBorder"
      },
      /** left width of border */
      innerWidthLeft: {
        check: "Number",
        init: 0,
        apply: "_applyDoubleBorder"
      },
      /** Property group to set the inner border width of all sides */
      innerWidth: {
        group: ["innerWidthTop", "innerWidthRight", "innerWidthBottom", "innerWidthLeft"],
        mode: "shorthand"
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY: INNER COLOR
      ---------------------------------------------------------------------------
      */

      /** top inner color of border */
      innerColorTop: {
        nullable: true,
        check: "Color",
        apply: "_applyDoubleBorder"
      },
      /** right inner color of border */
      innerColorRight: {
        nullable: true,
        check: "Color",
        apply: "_applyDoubleBorder"
      },
      /** bottom inner color of border */
      innerColorBottom: {
        nullable: true,
        check: "Color",
        apply: "_applyDoubleBorder"
      },
      /** left inner color of border */
      innerColorLeft: {
        nullable: true,
        check: "Color",
        apply: "_applyDoubleBorder"
      },
      /**
       * Property group for the inner color properties.
       */
      innerColor: {
        group: ["innerColorTop", "innerColorRight", "innerColorBottom", "innerColorLeft"],
        mode: "shorthand"
      },
      /**
       * The opacity of the inner border.
       */
      innerOpacity: {
        check: "Number",
        init: 1,
        apply: "_applyDoubleBorder"
      }
    },
    members: {
      /**
       * Takes a styles map and adds the outer border styles in place
       * to the given map. This is the needed behavior for
       * {@link qx.ui.decoration.Decorator}.
       *
       * @param styles {Map} A map to add the styles.
       */
      __styleDoubleBorder__P_186_1(styles) {
        var propName = qx.core.Environment.get("css.boxshadow");
        var color, innerColor, innerWidth;
        if (qx.core.Environment.get("qx.theme")) {
          var Color = qx.theme.manager.Color.getInstance();
          color = {
            top: Color.resolve(this.getColorTop()),
            right: Color.resolve(this.getColorRight()),
            bottom: Color.resolve(this.getColorBottom()),
            left: Color.resolve(this.getColorLeft())
          };
          innerColor = {
            top: Color.resolve(this.getInnerColorTop()),
            right: Color.resolve(this.getInnerColorRight()),
            bottom: Color.resolve(this.getInnerColorBottom()),
            left: Color.resolve(this.getInnerColorLeft())
          };
        } else {
          color = {
            top: this.getColorTop(),
            right: this.getColorRight(),
            bottom: this.getColorBottom(),
            left: this.getColorLeft()
          };
          innerColor = {
            top: this.getInnerColorTop(),
            right: this.getInnerColorRight(),
            bottom: this.getInnerColorBottom(),
            left: this.getInnerColorLeft()
          };
        }
        innerWidth = {
          top: this.getInnerWidthTop(),
          right: this.getInnerWidthRight(),
          bottom: this.getInnerWidthBottom(),
          left: this.getInnerWidthLeft()
        };

        // Add outer borders
        var width = this.getWidthTop();
        if (width > 0) {
          styles["border-top"] = width + "px " + this.getStyleTop() + " " + color.top;
        }
        width = this.getWidthRight();
        if (width > 0) {
          styles["border-right"] = width + "px " + this.getStyleRight() + " " + color.right;
        }
        width = this.getWidthBottom();
        if (width > 0) {
          styles["border-bottom"] = width + "px " + this.getStyleBottom() + " " + color.bottom;
        }
        width = this.getWidthLeft();
        if (width > 0) {
          styles["border-left"] = width + "px " + this.getStyleLeft() + " " + color.left;
        }
        var innerOpacity = this.getInnerOpacity();
        if (innerOpacity < 1) {
          this.__processInnerOpacity__P_186_2(innerColor, innerOpacity);
        }

        // inner border
        if (innerWidth.top > 0 || innerWidth.right > 0 || innerWidth.bottom > 0 || innerWidth.left > 0) {
          var borderTop = (innerWidth.top || 0) + "px solid " + innerColor.top;
          var borderRight = (innerWidth.right || 0) + "px solid " + innerColor.right;
          var borderBottom = (innerWidth.bottom || 0) + "px solid " + innerColor.bottom;
          var borderLeft = (innerWidth.left || 0) + "px solid " + innerColor.left;
          styles[":before"] = {
            width: "100%",
            height: "100%",
            position: "absolute",
            content: '""',
            "border-top": borderTop,
            "border-right": borderRight,
            "border-bottom": borderBottom,
            "border-left": borderLeft,
            left: 0,
            top: 0
          };
          var boxSizingKey = qx.bom.Style.getCssName(qx.core.Environment.get("css.boxsizing"));
          styles[":before"][boxSizingKey] = "border-box";

          // make sure to apply the border radius as well
          var borderRadiusKey = qx.core.Environment.get("css.borderradius");
          if (borderRadiusKey) {
            borderRadiusKey = qx.bom.Style.getCssName(borderRadiusKey);
            styles[":before"][borderRadiusKey] = "inherit";
          }

          // Add inner borders as shadows
          var shadowStyle = [];
          if (innerColor.top && innerWidth.top && innerColor.top == innerColor.bottom && innerColor.top == innerColor.right && innerColor.top == innerColor.left && innerWidth.top == innerWidth.bottom && innerWidth.top == innerWidth.right && innerWidth.top == innerWidth.left) {
            shadowStyle.push("inset 0 0 0 " + innerWidth.top + "px " + innerColor.top);
          } else {
            if (innerColor.top) {
              shadowStyle.push("inset 0 " + (innerWidth.top || 0) + "px " + innerColor.top);
            }
            if (innerColor.right) {
              shadowStyle.push("inset -" + (innerWidth.right || 0) + "px 0 " + innerColor.right);
            }
            if (innerColor.bottom) {
              shadowStyle.push("inset 0 -" + (innerWidth.bottom || 0) + "px " + innerColor.bottom);
            }
            if (innerColor.left) {
              shadowStyle.push("inset " + (innerWidth.left || 0) + "px 0 " + innerColor.left);
            }
          }

          // apply or append the box shadow styles
          if (shadowStyle.length > 0 && propName) {
            propName = qx.bom.Style.getCssName(propName);
            if (!styles[propName]) {
              styles[propName] = shadowStyle.join(",");
            } else {
              styles[propName] += "," + shadowStyle.join(",");
            }
          }
        } else {
          styles[":before"] = {
            border: 0
          };
        }
      },
      /**
       * Converts the inner border's colors to rgba.
       *
       * @param innerColor {Map} map of top, right, bottom and left colors
       * @param innerOpacity {Number} alpha value
       */
      __processInnerOpacity__P_186_2(innerColor, innerOpacity) {
        if (!qx.core.Environment.get("css.rgba")) {
          {
            qx.log.Logger.warn("innerOpacity is configured but the browser doesn't support RGBA colors.");
          }
          return;
        }
        for (var edge in innerColor) {
          var rgb = qx.util.ColorUtil.stringToRgb(innerColor[edge]);
          rgb.push(innerOpacity);
          var rgbString = qx.util.ColorUtil.rgbToRgbString(rgb);
          innerColor[edge] = rgbString;
        }
      },
      _applyDoubleBorder() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      },
      /**
       * Implementation of the interface for the double border.
       *
       * @return {Map} A map containing the default insets.
       *   (top, right, bottom, left)
       */
      __getDefaultInsetsForDoubleBorder__P_186_0() {
        return {
          top: this.getWidthTop() + this.getInnerWidthTop(),
          right: this.getWidthRight() + this.getInnerWidthRight(),
          bottom: this.getWidthBottom() + this.getInnerWidthBottom(),
          left: this.getWidthLeft() + this.getInnerWidthLeft()
        };
      }
    }
  });
  qx.ui.decoration.MDoubleBorder.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.lang.Type": {},
      "qx.util.ColorUtil": {},
      "qx.theme.manager.Color": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.gradient.legacywebkit": {
          "className": "qx.bom.client.Css"
        },
        "css.gradient.linear": {
          "className": "qx.bom.client.Css"
        },
        "css.borderradius": {
          "className": "qx.bom.client.Css"
        },
        "qx.theme": {}
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * Mixin for the linear background gradient CSS property.
   * This mixin is usually used by {@link qx.ui.decoration.Decorator}.
   *
   * Keep in mind that this is not supported by all browsers:
   *
   * * Safari 4.0+
   * * Chrome 4.0+
   * * Firefox 3.6+
   * * Opera 11.1+
   * * IE 10+
   * * IE 5.5+ (with limitations)
   *
   * For IE 5.5 to IE 8,this class uses the filter rules to create the gradient. This
   * has some limitations: The start and end position property can not be used. For
   * more details, see the original documentation:
   * http://msdn.microsoft.com/en-us/library/ms532997(v=vs.85).aspx
   *
   * For IE9, we create a gradient in a canvas element and render this gradient
   * as background image. Due to restrictions in the <code>background-image</code>
   * css property, we can not allow negative start values in that case.
   *
   * It is possible to define multiple background gradients by setting an
   * array containing the needed values as the property value.
   * In case multiple values are specified, the values of the properties
   * are repeated until all match in length. It is not possible to define
   * multiple background gradients when falling back to filter rules (IE5.5 to IE8).
   *
   * An example:
   * <pre class="javascript">
   *   'my-decorator': {
   *     style: {
   *       startColor:['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'],
   *       endColor: 'rgba(255, 255, 255, 0.2)',
   *       orientation: ['horizontal', 'vertical']
   *     }
   *   }
   * </pre>
   * which is the same as:
   * <pre class="javascript">
   *   'my-decorator': {
   *     style: {
   *       startColor: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)'],
   *       endColor: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.2)'],
   *       orientation: ['horizontal', 'vertical', 'horizontal']
   *     }
   *   }
   * </pre>
   */
  qx.Mixin.define("qx.ui.decoration.MLinearBackgroundGradient", {
    properties: {
      /**
       * Start color of the background gradient.
       * Note that alpha transparency (rgba) is not supported in IE 8.
       */
      startColor: {
        nullable: true,
        apply: "_applyLinearBackgroundGradient"
      },
      /**
       * End color of the background gradient.
       * Note that alpha transparency (rgba) is not supported in IE 8.
       */
      endColor: {
        nullable: true,
        apply: "_applyLinearBackgroundGradient"
      },
      /** The orientation of the gradient. */
      orientation: {
        init: "vertical",
        apply: "_applyLinearBackgroundGradient"
      },
      /** Position in percent where to start the color. */
      startColorPosition: {
        init: 0,
        apply: "_applyLinearBackgroundGradient"
      },
      /** Position in percent where to start the color. */
      endColorPosition: {
        init: 100,
        apply: "_applyLinearBackgroundGradient"
      },
      /** Defines if the given positions are in % or px.*/
      colorPositionUnit: {
        init: "%",
        apply: "_applyLinearBackgroundGradient"
      },
      /** Property group to set the start color including its start position. */
      gradientStart: {
        group: ["startColor", "startColorPosition"],
        mode: "shorthand"
      },
      /** Property group to set the end color including its end position. */
      gradientEnd: {
        group: ["endColor", "endColorPosition"],
        mode: "shorthand"
      }
    },
    members: {
      /**
       * Takes a styles map and adds the linear background styles in place to the
       * given map. This is the needed behavior for
       * {@link qx.ui.decoration.Decorator}.
       *
       * @param styles {Map} A map to add the styles.
       */
      _styleLinearBackgroundGradient(styles) {
        var backgroundStyle = [];
        if (!this.getStartColor() || !this.getEndColor()) {
          return;
        }
        var styleImpl = this.__styleLinearBackgroundGradientAccordingToSpec__P_187_0;
        if (qx.core.Environment.get("css.gradient.legacywebkit")) {
          styleImpl = this.__styleLinearBackgroundGradientForLegacyWebkit__P_187_1;
        } else if (!qx.core.Environment.get("css.gradient.linear") && qx.core.Environment.get("css.borderradius")) {
          styleImpl = this.__styleLinearBackgroundGradientWithCanvas__P_187_2;
        } else if (!qx.core.Environment.get("css.gradient.linear")) {
          styleImpl = this.__styleLinearBackgroundGradientWithMSFilter__P_187_3;
        }
        var gradientProperties = ["startColor", "endColor", "colorPositionUnit", "orientation", "startColorPosition", "endColorPosition"];
        (function (startColors, endColors, units, orientations, startColorPositions, endColorPositions) {
          for (var i = 0; i < startColors.length; i++) {
            var startColor = this.__getColor__P_187_4(startColors[i]);
            var endColor = this.__getColor__P_187_4(endColors[i]);
            var unit = units[i];
            var orientation = orientations[i];
            var startColorPosition = startColorPositions[i];
            var endColorPosition = endColorPositions[i];
            if (!styleImpl(startColor, endColor, unit, orientation, startColorPosition, endColorPosition, styles, backgroundStyle)) {
              break;
            }
          }
          if ("background" in styles) {
            if (!qx.lang.Type.isArray(styles["background"])) {
              styles["background"] = [styles["background"]];
            }
          } else {
            styles["background"] = [];
          }
          var orderGradientsFront = "getOrderGradientsFront" in this ? this.getOrderGradientsFront() : false;
          var operation = orderGradientsFront ? Array.prototype.unshift : Array.prototype.push;
          operation.apply(styles["background"], backgroundStyle);
        }).apply(this, this._getExtendedPropertyValueArrays(gradientProperties));
      },
      /**
       * Compute CSS rules to style the background with gradients.
       * This can be called multiple times and SHOULD layer the gradients on top of each other and on top of existing backgrounds.
       * Legacy implementation for old WebKit browsers (Chrome < 10).
       *
       * @param startColor {Color} The color to start the gradient with
       * @param endColor {Color} The color to end the gradient with
       * @param unit {Color} The unit in which startColorPosition and endColorPosition are measured
       * @param orientation {String} Either 'horizontal' or 'vertical'
       * @param startColorPosition {Number} The position of the gradient’s starting point, measured in `unit` units along the `orientation` axis from top or left
       * @param endColorPosition {Number} The position of the gradient’s ending point, measured in `unit` units along the `orientation` axis from top or left
       * @param styles {Map} The complete styles currently poised to be applied by decorators. Should not be written to in this method (use `backgroundStyle` for that)
       * @param backgroundStyle {Map} This method should push new background styles onto this array.
       *
       * @return {Boolean} Whether this implementation supports multiple gradients atop each other (true).
       */
      __styleLinearBackgroundGradientForLegacyWebkit__P_187_1(startColor, endColor, unit, orientation, startColorPosition, endColorPosition, styles, backgroundStyle) {
        // webkit uses px values if non are given
        unit = unit === "px" ? "" : unit;
        if (orientation == "horizontal") {
          var startPos = startColorPosition + unit + " 0" + unit;
          var endPos = endColorPosition + unit + " 0" + unit;
        } else {
          var startPos = "0" + unit + " " + startColorPosition + unit;
          var endPos = "0" + unit + " " + endColorPosition + unit;
        }
        var color = "from(" + startColor + "),to(" + endColor + ")";
        backgroundStyle.push("-webkit-gradient(linear," + startPos + "," + endPos + "," + color + ")");
        return true;
      },
      /**
       * Compute CSS rules to style the background with gradients.
       * This can be called multiple times and SHOULD layer the gradients on top of each other and on top of existing backgrounds.
       * IE9 canvas solution.
       *
       * @param startColor {Color} The color to start the gradient with
       * @param endColor {Color} The color to end the gradient with
       * @param unit {Color} The unit in which startColorPosition and endColorPosition are measured
       * @param orientation {String} Either 'horizontal' or 'vertical'
       * @param startColorPosition {Number} The position of the gradient’s starting point, measured in `unit` units along the `orientation` axis from top or left
       * @param endColorPosition {Number} The position of the gradient’s ending point, measured in `unit` units along the `orientation` axis from top or left
       * @param styles {Map} The complete styles currently poised to be applied by decorators. Should not be written to in this method (use `backgroundStyle` for that)
       * @param backgroundStyle {Map} This method should push new background styles onto this array.
       *
       * @return {Boolean} Whether this implementation supports multiple gradients atop each other (true).
       */
      __styleLinearBackgroundGradientWithCanvas__P_187_2(startColor, endColor, unit, orientation, startColorPosition, endColorPosition, styles, backgroundStyle) {
        const me = qx.ui.decoration.MLinearBackgroundGradient.__styleLinearBackgroundGradientWithCanvas__P_187_2;
        if (!me.__canvas__P_187_5) {
          me.__canvas__P_187_5 = document.createElement("canvas");
        }
        var isVertical = orientation == "vertical";
        var height = isVertical ? 200 : 1;
        var width = isVertical ? 1 : 200;
        var range = Math.max(100, endColorPosition - startColorPosition);

        // use the px difference as dimension
        if (unit === "px") {
          if (isVertical) {
            height = Math.max(height, endColorPosition - startColorPosition);
          } else {
            width = Math.max(width, endColorPosition - startColorPosition);
          }
        } else {
          if (isVertical) {
            height = Math.max(height, (endColorPosition - startColorPosition) * 2);
          } else {
            width = Math.max(width, (endColorPosition - startColorPosition) * 2);
          }
        }
        me.__canvas__P_187_5.width = width;
        me.__canvas__P_187_5.height = height;
        var ctx = me.__canvas__P_187_5.getContext("2d");
        if (isVertical) {
          var lingrad = ctx.createLinearGradient(0, 0, 0, height);
        } else {
          var lingrad = ctx.createLinearGradient(0, 0, width, 0);
        }

        // don't allow negative start values
        if (unit === "%") {
          lingrad.addColorStop(Math.max(0, startColorPosition) / range, startColor);
          lingrad.addColorStop(endColorPosition / range, endColor);
        } else {
          var comp = isVertical ? height : width;
          lingrad.addColorStop(Math.max(0, startColorPosition) / comp, startColor);
          lingrad.addColorStop(endColorPosition / comp, endColor);
        }

        //Clear the rect before drawing to allow for semitransparent colors
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = lingrad;
        ctx.fillRect(0, 0, width, height);
        var size;
        if (unit === "%") {
          size = isVertical ? "100% " + range + "%" : range + "% 100%";
        } else {
          size = isVertical ? height + "px 100%" : "100% " + width + "px";
        }
        backgroundStyle.push("url(" + me.__canvas__P_187_5.toDataURL() + ") " + size);
        return true;
      },
      /**
       * Compute CSS rules to style the background with gradients.
       * This can be called multiple times and SHOULD layer the gradients on top of each other and on top of existing backgrounds.
       * Old IE filter fallback.
       *
       * @param startColor {Color} The color to start the gradient with
       * @param endColor {Color} The color to end the gradient with
       * @param unit {Color} The unit in which startColorPosition and endColorPosition are measured
       * @param orientation {String} Either 'horizontal' or 'vertical'
       * @param startColorPosition {Number} The position of the gradient’s starting point, measured in `unit` units along the `orientation` axis from top or left
       * @param endColorPosition {Number} The position of the gradient’s ending point, measured in `unit` units along the `orientation` axis from top or left
       * @param styles {Map} The complete styles currently poised to be applied by decorators. Should not be written to in this method (use `backgroundStyle` for that). Note: this particular implementation will do that because it needs to change the `filter` property.
       * @param backgroundStyle {Map} This method should push new background styles onto this array.
       *
       * @return {Boolean} Whether this implementation supports multiple gradients atop each other (false).
       */
      __styleLinearBackgroundGradientWithMSFilter__P_187_3(startColor, endColor, unit, orientation, startColorPosition, endColorPosition, styles, backgroundStyle) {
        var type = orientation == "horizontal" ? 1 : 0;

        // convert rgb, hex3 and named colors to hex6
        if (!qx.util.ColorUtil.isHex6String(startColor)) {
          startColor = qx.util.ColorUtil.stringToRgb(startColor);
          startColor = qx.util.ColorUtil.rgbToHexString(startColor);
        }
        if (!qx.util.ColorUtil.isHex6String(endColor)) {
          endColor = qx.util.ColorUtil.stringToRgb(endColor);
          endColor = qx.util.ColorUtil.rgbToHexString(endColor);
        }

        // get rid of the starting '#'
        startColor = startColor.substring(1, startColor.length);
        endColor = endColor.substring(1, endColor.length);
        var value = "progid:DXImageTransform.Microsoft.Gradient(GradientType=" + type + ", " + "StartColorStr='#FF" + startColor + "', " + "EndColorStr='#FF" + endColor + "';)";
        if (styles["filter"]) {
          styles["filter"] += ", " + value;
        } else {
          styles["filter"] = value;
        }

        // Elements with transparent backgrounds will not receive receive pointer
        // events if a Gradient filter is set.
        if (!styles["background-color"] || styles["background-color"] == "transparent") {
          // We don't support alpha transparency for the gradient color stops
          // so it doesn't matter which color we set here.
          styles["background-color"] = "white";
        }
        return false;
      },
      /**
       * Compute CSS rules to style the background with gradients.
       * This can be called multiple times and SHOULD layer the gradients on top of each other and on top of existing backgrounds.
       * Default implementation (uses spec-compliant syntax).
       *
       * @param startColor {Color} The color to start the gradient with
       * @param endColor {Color} The color to end the gradient with
       * @param unit {Color} The unit in which startColorPosition and endColorPosition are measured
       * @param orientation {String} Either 'horizontal' or 'vertical'
       * @param startColorPosition {Number} The position of the gradient’s starting point, measured in `unit` units along the `orientation` axis from top or left
       * @param endColorPosition {Number} The position of the gradient’s ending point, measured in `unit` units along the `orientation` axis from top or left
       * @param styles {Map} The complete styles currently poised to be applied by decorators. Should not be written to in this method (use `backgroundStyle` for that)
       * @param backgroundStyle {Map} This method should push new background styles onto this array.
       *
       * @return {Boolean} Whether this implementation supports multiple gradients atop each other (true).
       */
      __styleLinearBackgroundGradientAccordingToSpec__P_187_0(startColor, endColor, unit, orientation, startColorPosition, endColorPosition, styles, backgroundStyle) {
        // WebKit, Opera and Gecko interpret 0deg as "to right"
        var deg = orientation == "horizontal" ? 0 : 270;
        var start = startColor + " " + startColorPosition + unit;
        var end = endColor + " " + endColorPosition + unit;
        var prefixedName = qx.core.Environment.get("css.gradient.linear");
        // Browsers supporting the unprefixed implementation interpret 0deg as
        // "to top" as defined by the spec [BUG #6513]
        if (prefixedName === "linear-gradient") {
          deg = orientation == "horizontal" ? deg + 90 : deg - 90;
        }
        backgroundStyle.push(prefixedName + "(" + deg + "deg, " + start + "," + end + ")");
        return true;
      },
      /**
       * Helper to get a resolved color from a name
       * @param color {String} The color name
       * @return {Map} The resolved color
       */
      __getColor__P_187_4(color) {
        return qx.core.Environment.get("qx.theme") ? qx.theme.manager.Color.getInstance().resolve(color) : color;
      },
      // property apply
      _applyLinearBackgroundGradient() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      }
    }
  });
  qx.ui.decoration.MLinearBackgroundGradient.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.AliasManager": {},
      "qx.util.ResourceManager": {},
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.bom.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.borderimage.standardsyntax": {
          "className": "qx.bom.client.Css"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2013 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Decorator which uses the CSS3 border image properties.
   */
  qx.Mixin.define("qx.ui.decoration.MBorderImage", {
    properties: {
      /**
       * Base image URL.
       */
      borderImage: {
        check: "String",
        nullable: true,
        apply: "_applyBorderImage"
      },
      /**
       * The top slice line of the base image. The slice properties divide the
       * image into nine regions, which define the corner, edge and the center
       * images.
       */
      sliceTop: {
        check: "Integer",
        nullable: true,
        init: null,
        apply: "_applyBorderImage"
      },
      /**
       * The right slice line of the base image. The slice properties divide the
       * image into nine regions, which define the corner, edge and the center
       * images.
       */
      sliceRight: {
        check: "Integer",
        nullable: true,
        init: null,
        apply: "_applyBorderImage"
      },
      /**
       * The bottom slice line of the base image. The slice properties divide the
       * image into nine regions, which define the corner, edge and the center
       * images.
       */
      sliceBottom: {
        check: "Integer",
        nullable: true,
        init: null,
        apply: "_applyBorderImage"
      },
      /**
       * The left slice line of the base image. The slice properties divide the
       * image into nine regions, which define the corner, edge and the center
       * images.
       */
      sliceLeft: {
        check: "Integer",
        nullable: true,
        init: null,
        apply: "_applyBorderImage"
      },
      /**
       * The slice properties divide the image into nine regions, which define the
       * corner, edge and the center images.
       */
      slice: {
        group: ["sliceTop", "sliceRight", "sliceBottom", "sliceLeft"],
        mode: "shorthand"
      },
      /**
       * This property specifies how the images for the sides and the middle part
       * of the border image are scaled and tiled horizontally.
       *
       * Values have the following meanings:
       * <ul>
       *   <li><strong>stretch</strong>: The image is stretched to fill the area.</li>
       *   <li><strong>repeat</strong>: The image is tiled (repeated) to fill the area.</li>
       *   <li><strong>round</strong>: The image is tiled (repeated) to fill the area. If it does not
       *    fill the area with a whole number of tiles, the image is rescaled so
       *    that it does.</li>
       * </ul>
       */
      repeatX: {
        check: ["stretch", "repeat", "round"],
        init: "stretch",
        apply: "_applyBorderImage"
      },
      /**
       * This property specifies how the images for the sides and the middle part
       * of the border image are scaled and tiled vertically.
       *
       * Values have the following meanings:
       * <ul>
       *   <li><strong>stretch</strong>: The image is stretched to fill the area.</li>
       *   <li><strong>repeat</strong>: The image is tiled (repeated) to fill the area.</li>
       *   <li><strong>round</strong>: The image is tiled (repeated) to fill the area. If it does not
       *    fill the area with a whole number of tiles, the image is rescaled so
       *    that it does.</li>
       * </ul>
       */
      repeatY: {
        check: ["stretch", "repeat", "round"],
        init: "stretch",
        apply: "_applyBorderImage"
      },
      /**
       * This property specifies how the images for the sides and the middle part
       * of the border image are scaled and tiled.
       */
      repeat: {
        group: ["repeatX", "repeatY"],
        mode: "shorthand"
      },
      /**
       * If set to <code>false</code>, the center image will be omitted and only
       * the border will be drawn.
       */
      fill: {
        check: "Boolean",
        init: true,
        apply: "_applyBorderImage"
      },
      /**
       * Configures the border image mode. Supported values:
       * <ul>
       *   <li>horizontal: left and right border images</li>
       *   <li>vertical: top and bottom border images</li>
       *   <li>grid: border images for all edges</li>
       * </ul>
       */
      borderImageMode: {
        check: ["horizontal", "vertical", "grid"],
        init: "grid"
      }
    },
    members: {
      /**
       * Adds the border-image styles to the given map
       * @param styles {Map} CSS style map
       */
      _styleBorderImage(styles) {
        if (!this.getBorderImage()) {
          return;
        }
        var resolvedImage = qx.util.AliasManager.getInstance().resolve(this.getBorderImage());
        var source = qx.util.ResourceManager.getInstance().toUri(resolvedImage);
        var computedSlices = this._getDefaultInsetsForBorderImage();
        var slice = [computedSlices.top, computedSlices.right, computedSlices.bottom, computedSlices.left];
        var repeat = [this.getRepeatX(), this.getRepeatY()].join(" ");
        var fill = this.getFill() && qx.core.Environment.get("css.borderimage.standardsyntax") ? " fill" : "";
        var styleName = qx.bom.Style.getPropertyName("borderImage");
        if (styleName) {
          var cssName = qx.bom.Style.getCssName(styleName);
          styles[cssName] = 'url("' + source + '") ' + slice.join(" ") + fill + " " + repeat;
        }
        // Apply border styles even if we couldn't determine the borderImage property name
        // (e.g. because the browser doesn't support it). This is needed to keep
        // the layout intact.
        styles["border-style"] = "solid";
        styles["border-color"] = "transparent";
        styles["border-width"] = slice.join("px ") + "px";
      },
      /**
       * Computes the inset values based on the border image slices (defined in the
       * decoration theme or computed from the fallback image sizes).
       *
       * @return {Map} Map with the top, right, bottom and left insets
       */
      _getDefaultInsetsForBorderImage() {
        if (!this.getBorderImage()) {
          return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          };
        }
        var resolvedImage = qx.util.AliasManager.getInstance().resolve(this.getBorderImage());
        var computedSlices = this.__getSlices__P_188_0(resolvedImage);
        return {
          top: this.getSliceTop() || computedSlices[0],
          right: this.getSliceRight() || computedSlices[1],
          bottom: this.getSliceBottom() || computedSlices[2],
          left: this.getSliceLeft() || computedSlices[3]
        };
      },
      _applyBorderImage() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      },
      /**
       * Gets the slice sizes from the fallback border images.
       *
       * @param baseImage {String} Resource Id of the base border image
       * @return {Integer[]} Array with the top, right, bottom and left slice widths
       */
      __getSlices__P_188_0(baseImage) {
        var mode = this.getBorderImageMode();
        var topSlice = 0;
        var rightSlice = 0;
        var bottomSlice = 0;
        var leftSlice = 0;
        var split = /(.*)(\.[a-z]+)$/.exec(baseImage);
        var prefix = split[1];
        var ext = split[2];
        var ResourceManager = qx.util.ResourceManager.getInstance();
        if (mode == "grid" || mode == "vertical") {
          topSlice = ResourceManager.getImageHeight(prefix + "-t" + ext);
          bottomSlice = ResourceManager.getImageHeight(prefix + "-b" + ext);
        }
        if (mode == "grid" || mode == "horizontal") {
          rightSlice = ResourceManager.getImageWidth(prefix + "-r" + ext);
          leftSlice = ResourceManager.getImageWidth(prefix + "-l" + ext);
        }
        return [topSlice, rightSlice, bottomSlice, leftSlice];
      }
    }
  });
  qx.ui.decoration.MBorderImage.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.CssTransition": {
        "require": true
      },
      "qx.bom.client.Browser": {},
      "qx.bom.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.transition": {
          "className": "qx.bom.client.CssTransition"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2017 OETIKER+PARTNER AG
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Tobias Oetiker (oetiker)
  
  ************************************************************************ */
  /**
   * Mixin responsible for setting the css transition properties of a widget
   * This mixin is usually used by {@link qx.ui.decoration.Decorator}.
   *
   * Keep in mind that this is not supported by all browsers:
   *
   * * Firefox 16+
   * * IE 10+
   * * Edge
   * * Safari 6.1+
   * * Opera 12.10+
   * * Chrome 26+
   *
   * It is possible to define transitions by setting an
   * array containing the needed values as the property value.
   * In case multiple values are specified, the values of the properties
   * are repeated until all match in length.
   *
   * An example:
   * <pre class="javascript">
   *   'my-decorator': {
   *     style: {
   *       transitionProperty: ['top','left']
   *       transitionDuration: '1s'
   *     }
   *   }
   * </pre>
   */
  qx.Mixin.define("qx.ui.decoration.MTransition", {
    properties: {
      /** transition property */
      transitionProperty: {
        nullable: true,
        apply: "_applyTransition"
      },
      /** transition duration */
      transitionDuration: {
        nullable: true,
        apply: "_applyTransition"
      },
      /** transition delay */
      transitionTimingFunction: {
        nullable: true,
        apply: "_applyTransition"
      },
      /** transition delay */
      transitionDelay: {
        nullable: true,
        apply: "_applyTransition"
      }
    },
    members: {
      /**
       * Takes a styles map and adds the box shadow styles in place to the
       * given map. This is the needed behavior for
       * {@link qx.ui.decoration.Decorator}.
       *
       * @param styles {Map} A map to add the styles.
       */
      _styleTransition(styles) {
        var propName = qx.core.Environment.get("css.transition");
        if (!propName || this.getTransitionDuration() == null) {
          return;
        }
        if (qx.bom.client.Browser.getName() === "chrome" && qx.bom.client.Browser.getVersion() >= 71) {
          // chrome has a repaint problem ... as suggested in
          // https://stackoverflow.com/a/21947628/235990 we are setting
          // a transform ...
          if (!styles.transform) {
            styles.transform = "translateZ(0)";
          }
        }
        propName = qx.bom.Style.getCssName(propName.name);
        var transitionProperties = ["transitionProperty", "transitionDuration", "transitionTimingFunction", "transitionDelay"];
        (function (tPros, tDurs, tTims, tDels) {
          for (var i = 0; i < tPros.length; i++) {
            var tPro = tPros[i] || "all";
            var tDur = tDurs[i] || "0s";
            var tTim = tTims[i] || "ease";
            var tDel = tDels[i] || "0s";
            var value = tPro + " " + tDur + " " + tTim + " " + tDel;
            if (!styles[propName]) {
              styles[propName] = value;
            } else {
              styles[propName] += "," + value;
            }
          }
        }).apply(this, this._getExtendedPropertyValueArrays(transitionProperties));
      },
      // property apply
      _applyTransition() {
        {
          if (this._isInitialized()) {
            throw new Error("This decorator is already in-use. Modification is not possible anymore!");
          }
        }
      }
    }
  });
  qx.ui.decoration.MTransition.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.decoration.Abstract": {
        "require": true
      },
      "qx.ui.decoration.IDecorator": {
        "require": true
      },
      "qx.ui.decoration.MBackgroundColor": {
        "require": true
      },
      "qx.ui.decoration.MBorderRadius": {
        "require": true
      },
      "qx.ui.decoration.MBoxShadow": {
        "require": true
      },
      "qx.ui.decoration.MDoubleBorder": {
        "require": true
      },
      "qx.ui.decoration.MLinearBackgroundGradient": {
        "require": true
      },
      "qx.ui.decoration.MBorderImage": {
        "require": true
      },
      "qx.ui.decoration.MTransition": {
        "require": true
      },
      "qx.lang.String": {},
      "qx.lang.Type": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2013 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Decorator including all decoration possibilities from mixins:
   *
   * <ul>
   * <li>Background color</li>
   * <li>Background image</li>
   * <li>Background gradient</li>
   * <li>Single and double borders</li>
   * <li>Border radius</li>
   * <li>Box shadow</li>
   * </ul>
   */
  qx.Class.define("qx.ui.decoration.Decorator", {
    extend: qx.ui.decoration.Abstract,
    implement: [qx.ui.decoration.IDecorator],
    include: [qx.ui.decoration.MBackgroundColor, qx.ui.decoration.MBorderRadius, qx.ui.decoration.MBoxShadow, qx.ui.decoration.MDoubleBorder, qx.ui.decoration.MLinearBackgroundGradient, qx.ui.decoration.MBorderImage, qx.ui.decoration.MTransition],
    members: {
      __initialized__P_116_0: false,
      /**
       * Returns the configured padding minus the border width.
       * @return {Map} Map of top, right, bottom and left padding values
       */
      getPadding() {
        var insets = this.getInset();
        var slices = this._getDefaultInsetsForBorderImage();
        var borderTop = insets.top - (slices.top ? slices.top : this.getWidthTop());
        var borderRight = insets.right - (slices.right ? slices.right : this.getWidthRight());
        var borderBottom = insets.bottom - (slices.bottom ? slices.bottom : this.getWidthBottom());
        var borderLeft = insets.left - (slices.left ? slices.left : this.getWidthLeft());
        return {
          top: insets.top ? borderTop : this.getInnerWidthTop(),
          right: insets.right ? borderRight : this.getInnerWidthRight(),
          bottom: insets.bottom ? borderBottom : this.getInnerWidthBottom(),
          left: insets.left ? borderLeft : this.getInnerWidthLeft()
        };
      },
      /**
       * Returns the styles of the decorator as a map with property names written
       * in javascript style (e.g. <code>fontWeight</code> instead of <code>font-weight</code>).
       *
       * @param css {Boolean?} <code>true</code> if hyphenated CSS names should be returned.
       * @return {Map} style information
       */
      getStyles(css) {
        if (css) {
          return this._getStyles();
        }
        var jsStyles = {};
        var cssStyles = this._getStyles();
        for (var property in cssStyles) {
          jsStyles[qx.lang.String.camelCase(property)] = cssStyles[property];
        }
        return jsStyles;
      },
      /**
       * Collects all the style information from the decorators.
       *
       * @return {Map} style information
       */
      _getStyles() {
        var styles = {};
        for (var name in this) {
          if (name.indexOf("_style") == 0 && this[name] instanceof Function) {
            this[name](styles);
          }
        }
        for (var name in styles) {
          if (qx.lang.Type.isArray(styles[name])) {
            styles[name] = styles[name].join(", ");
          }
        }
        this.__initialized__P_116_0 = true;
        return styles;
      },
      // overridden
      _getDefaultInsets() {
        var directions = ["top", "right", "bottom", "left"];
        var defaultInsets = {};
        for (var name in this) {
          if (name.indexOf("_getDefaultInsetsFor") == 0 && this[name] instanceof Function) {
            var currentInsets = this[name]();
            for (var i = 0; i < directions.length; i++) {
              var direction = directions[i];
              // initialize with the first insets found
              if (defaultInsets[direction] == undefined) {
                defaultInsets[direction] = currentInsets[direction];
              }
              // take the largest inset
              if (currentInsets[direction] > defaultInsets[direction]) {
                defaultInsets[direction] = currentInsets[direction];
              }
            }
          }
        }

        // check if the mixins have created a default insets
        if (defaultInsets["top"] != undefined) {
          return defaultInsets;
        }
        // return a fallback which is 0 for all insets
        return {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
      },
      // overridden
      _isInitialized() {
        return this.__initialized__P_116_0;
      },
      /**
       * Ensures that every propertyValue specified in propertyNames is an array.
       * The value arrays are extended and repeated to match in length.
       * @param propertyNames {Array} Array containing the propertyNames.
       * @return {Array} Array containing the extended value arrays.
       */
      _getExtendedPropertyValueArrays(propertyNames) {
        // transform non-array values to an array containing that value
        var propertyValues = propertyNames.map(function (propName) {
          var value = this.get(propName);
          if (!qx.lang.Type.isArray(value)) {
            value = [value];
          }
          return value;
        }, this);

        // Because it's possible to set multiple values for a property there's
        // a chance that not all properties have the same number of values set.
        // Extend the value arrays by repeating existing values until all
        // arrays match in length.
        var items = Math.max.apply(Math, propertyValues.map(function (prop) {
          return prop.length;
        }));
        for (var i = 0; i < propertyValues.length; i++) {
          this.__extendArray__P_116_1(propertyValues[i], items);
        }
        return propertyValues;
      },
      /**
       * Extends an array up to the given length by repeating the elements already present.
       * @param array {Array} Incoming array. Has to contain at least one element.
       * @param to {Integer} Desired length. Must be greater than or equal to the the length of arr.
       */
      __extendArray__P_116_1(array, to) {
        var initial = array.length;
        while (array.length < to) {
          array.push(array[array.length % initial]);
        }
      }
    }
  });
  qx.ui.decoration.Decorator.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.ValueManager": {
        "construct": true,
        "require": true
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
  
  ************************************************************************ */

  /**
   * This singleton manages global resource aliases.
   *
   * The AliasManager supports simple prefix replacement on strings. There are
   * some pre-defined aliases, and you can register your own with {@link #add}.
   * The AliasManager is automatically invoked in various situations, e.g. when
   * resolving the icon image for a button, so it is common to register aliases for
   * <a href="http://qooxdoo.org/docs/#desktop/gui/resources.md">resource id's</a>.
   * You can of course call the AliasManager's {@link #resolve}
   * explicitly to get an alias resolution in any situation, but keep that
   * automatic invocation of the AliasManager in mind when defining new aliases as
   * they will be applied globally in many classes, not only your own.
   *
   * Examples:
   * <ul>
   *  <li> <code>foo</code> -> <code>bar/16pt/baz</code>  (resolves e.g. __"foo/a/b/c.png"__ to
   *    __"bar/16pt/baz/a/b/c.png"__)
   *  <li> <code>imgserver</code> -> <code>http&#058;&#047;&#047;imgs03.myserver.com/my/app/</code>
   *    (resolves e.g. __"imgserver/a/b/c.png"__ to
   *    __"http&#058;&#047;&#047;imgs03.myserver.com/my/app/a/b/c.png"__)
   * </ul>
   *
   * For resources, only aliases that resolve to proper resource id's can be __managed__
   * resources, and will be considered __unmanaged__ resources otherwise.
   */
  qx.Class.define("qx.util.AliasManager", {
    type: "singleton",
    extend: qx.util.ValueManager,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.util.ValueManager.constructor.call(this);

      // Contains defined aliases (like icons/, widgets/, application/, ...)
      this.__aliases__P_117_0 = {};

      // Define static alias from setting
      this.add("static", "qx/static");
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __aliases__P_117_0: null,
      /**
       * pre-process incoming dynamic value
       *
       * @param value {String} incoming value
       * @return {String} pre processed value
       */
      _preprocess(value) {
        var dynamics = this._getDynamic();
        if (dynamics[value] === false) {
          return value;
        } else if (dynamics[value] === undefined) {
          if (value.charAt(0) === "/" || value.charAt(0) === "." || value.indexOf("http://") === 0 || value.indexOf("https://") === "0" || value.indexOf("file://") === 0) {
            dynamics[value] = false;
            return value;
          }
          if (this.__aliases__P_117_0[value]) {
            return this.__aliases__P_117_0[value];
          }
          var alias = value.substring(0, value.indexOf("/"));
          var resolved = this.__aliases__P_117_0[alias];
          if (resolved !== undefined) {
            dynamics[value] = resolved + value.substring(alias.length);
          }
        }
        return value;
      },
      /**
       * Define an alias to a resource path
       *
       * @param alias {String} alias name for the resource path/url
       * @param base {String} first part of URI for all images which use this alias
       */
      add(alias, base) {
        // Store new alias value
        this.__aliases__P_117_0[alias] = base;

        // Localify stores
        var dynamics = this._getDynamic();

        // Update old entries which use this alias
        for (var path in dynamics) {
          if (path.substring(0, path.indexOf("/")) === alias) {
            dynamics[path] = base + path.substring(alias.length);
          }
        }
      },
      /**
       * Remove a previously defined alias
       *
       * @param alias {String} alias name for the resource path/url
       */
      remove(alias) {
        delete this.__aliases__P_117_0[alias];

        // No signal for depending objects here. These
        // will informed with the new value using add().
      },
      /**
       * Resolves a given path
       *
       * @param path {String} input path
       * @return {String} resulting path (with interpreted aliases)
       */
      resolve(path) {
        var dynamic = this._getDynamic();
        if (path != null) {
          path = this._preprocess(path);
        }
        return dynamic[path] || path;
      },
      /**
       * Get registered aliases
       *
       * @return {Map} the map of the currently registered alias:resolution pairs
       */
      getAliases() {
        var res = {};
        for (var key in this.__aliases__P_117_0) {
          res[key] = this.__aliases__P_117_0[key];
        }
        return res;
      }
    }
  });
  qx.util.AliasManager.$$dbClassInfo = $$dbClassInfo;
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
      "qx.lang.String": {},
      "qx.theme.manager.Font": {},
      "qx.theme.manager.Color": {}
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
       * Mustafa Sak (msak)
  
  ************************************************************************ */

  /**
   * A wrapper for CSS font styles. Fond objects can be applied to instances
   * of {@link qx.html.Element}.
   */
  qx.Class.define("qx.bom.Font", {
    extend: qx.core.Object,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param size {String?} The font size (Unit: pixel)
     * @param family {String[]?} A sorted list of font families
     */
    construct(size, family) {
      qx.core.Object.constructor.call(this);
      this.__lookupMap__P_143_0 = {
        fontFamily: "",
        fontSize: null,
        fontWeight: null,
        fontStyle: null,
        textDecoration: null,
        lineHeight: null,
        color: null,
        textShadow: null,
        letterSpacing: null
      };
      if (size !== undefined) {
        this.setSize(size);
      }
      if (family !== undefined) {
        this.setFamily(family);
      }
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Converts a typical CSS font definition string to an font object
       *
       * Example string: <code>bold italic 20px Arial</code>
       *
       * @param str {String} the CSS string
       * @return {qx.bom.Font} the created instance
       */
      fromString(str) {
        var font = new qx.bom.Font();
        var parts = str.split(/\s+/);
        var name = [];
        var part;
        for (var i = 0; i < parts.length; i++) {
          switch (part = parts[i]) {
            case "bold":
              font.setBold(true);
              break;
            case "italic":
              font.setItalic(true);
              break;
            case "underline":
              font.setDecoration("underline");
              break;
            default:
              var temp = parseInt(part, 10);
              if (temp == part || qx.lang.String.contains(part, "px")) {
                font.setSize(temp);
              } else {
                name.push(part);
              }
              break;
          }
        }
        if (name.length > 0) {
          font.setFamily(name);
        }
        return font;
      },
      /**
       * Converts a map property definition into a font object.
       *
       * @param config {Map} map of property values
       * @return {qx.bom.Font} the created instance
       */
      fromConfig(config) {
        var font = new qx.bom.Font();
        font.set(config);
        return font;
      },
      /** @type {Map} Default (empty) CSS styles */
      __defaultStyles__P_143_1: {
        fontFamily: "",
        fontSize: "",
        fontWeight: "",
        fontStyle: "",
        textDecoration: "",
        lineHeight: 1.2,
        color: "",
        textShadow: "",
        letterSpacing: ""
      },
      /**
       * Returns a map of all properties in empty state.
       *
       * This is useful for resetting previously configured
       * font styles.
       *
       * @return {Map} Default styles
       */
      getDefaultStyles() {
        return this.__defaultStyles__P_143_1;
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** The font size (Unit: pixel) */
      size: {
        check: "Integer",
        nullable: true,
        apply: "_applySize"
      },
      /**
       * The line height as scaling factor of the default line height. A value
       * of 1 corresponds to the default line height
       */
      lineHeight: {
        check: "Number",
        nullable: true,
        apply: "_applyLineHeight"
      },
      /**
       * Characters that are used to test if the font has loaded properly. These
       * default to "WEei" in `qx.bom.webfont.Validator` and can be overridden
       * for certain cases like icon fonts that do not provide the predefined
       * characters.
       */
      comparisonString: {
        check: "String",
        init: null,
        nullable: true
      },
      /**
       * Version identifier that is appended to the URL to be loaded. Fonts
       * that are defined thru themes may be managed by the resource manager.
       * In this case updated fonts persist due to aggressive fontface caching
       * of some browsers. To get around this, set the `version` property to
       * the version of your font. It will be appended to the CSS URL and forces
       * the browser to re-validate.
       *
       * The version needs to be URL friendly, so only characters, numbers,
       * dash and dots are allowed here.
       */
      version: {
        check(value) {
          return value === null || typeof value === "string" && /^[a-zA-Z0-9.-]+$/.test(value);
        },
        init: null,
        nullable: true
      },
      /** A sorted list of font families */
      family: {
        check: "Array",
        nullable: true,
        apply: "_applyFamily"
      },
      /** Whether the font is bold */
      bold: {
        check: "Boolean",
        nullable: true,
        apply: "_applyBold"
      },
      /** Whether the font is italic */
      italic: {
        check: "Boolean",
        nullable: true,
        apply: "_applyItalic"
      },
      /** The text decoration for this font */
      decoration: {
        check: ["underline", "line-through", "overline"],
        nullable: true,
        apply: "_applyDecoration"
      },
      /** The text color for this font */
      color: {
        check: "Color",
        nullable: true,
        apply: "_applyColor"
      },
      /** The text shadow for this font */
      textShadow: {
        nullable: true,
        check: "String",
        apply: "_applyTextShadow"
      },
      /** The weight property of the font as opposed to just setting it to 'bold' by setting the bold property to true */
      weight: {
        nullable: true,
        check: "String",
        apply: "_applyWeight"
      },
      /** The Letter Spacing (Unit: pixel) */
      letterSpacing: {
        check: "Integer",
        nullable: true,
        apply: "_applyLetterSpacing"
      },
      /**
       * This specifies the name of the font defined in Manifest.json in `provides.fonts` - setting it will
       * copy the values from the Manifest into this font definition
       */
      fontName: {
        check: "String",
        nullable: true,
        apply: "_applyFontName"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __lookupMap__P_143_0: null,
      /**
       * Called by the theme manager when all the properties to be set, have been set
       */
      loadComplete() {
        // Nothing
      },
      // property apply
      _applySize(value, old) {
        this.__lookupMap__P_143_0.fontSize = value === null ? null : value + "px";
      },
      _applyLineHeight(value, old) {
        this.__lookupMap__P_143_0.lineHeight = value === null ? null : value;
      },
      // property apply
      _applyFamily(value, old) {
        var family = "";
        for (var i = 0, l = value.length; i < l; i++) {
          // in FireFox 2 and WebKit fonts like 'serif' or 'sans-serif' must
          // not be quoted!
          if (value[i].indexOf(" ") > 0) {
            family += "'" + value[i] + "'";
          } else {
            family += value[i];
          }
          if (i !== l - 1) {
            family += ",";
          }
        }

        // font family is a special case. In order to render the labels correctly
        // we have to return a font family - even if it's an empty string to prevent
        // the browser from applying the element style
        this.__lookupMap__P_143_0.fontFamily = family;
      },
      // property apply
      _applyFontName(value) {
        if (value) {
          let data = qx.theme.manager.Font.getInstance().getManifestFonts()[value];
          if (!data) {
            this.warn("Cannot find a font called " + value);
          } else {
            let toSet = {};
            ["family", "comparisonString"].forEach(name => {
              if (data[name] !== undefined) {
                toSet[name] = data[name];
              }
            });
            this.set(toSet);
          }
        }
      },
      // property apply
      _applyBold(value, old) {
        this.__lookupMap__P_143_0.fontWeight = value == null ? null : value ? "bold" : "normal";
      },
      // property apply
      _applyItalic(value, old) {
        this.__lookupMap__P_143_0.fontStyle = value == null ? null : value ? "italic" : "normal";
      },
      // property apply
      _applyDecoration(value, old) {
        this.__lookupMap__P_143_0.textDecoration = value == null ? null : value;
      },
      // property apply
      _applyColor(value, old) {
        this.__lookupMap__P_143_0.color = null;
        if (value) {
          this.__lookupMap__P_143_0.color = qx.theme.manager.Color.getInstance().resolve(value);
        }
      },
      // property apply
      _applyWeight(value, old) {
        this.__lookupMap__P_143_0.fontWeight = value;
      },
      // property apply
      _applyTextShadow(value, old) {
        this.__lookupMap__P_143_0.textShadow = value == null ? null : value;
      },
      // property apply
      _applyLetterSpacing(value, old) {
        this.__lookupMap__P_143_0.letterSpacing = value === null ? null : value + "px";
      },
      /**
       * Get a map of all CSS styles, which will be applied to the widget. Only
       * the styles which are set are returned.
       *
       * @return {Map} Map containing the current styles. The keys are property
       * names which can directly be used with the <code>set</code> method of each
       * widget.
       */
      getStyles() {
        return this.__lookupMap__P_143_0;
      }
    }
  });
  qx.bom.Font.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.bom.webfonts.Validator": {},
      "qx.bom.webfonts.WebFont": {},
      "qx.util.ResourceManager": {},
      "qx.lang.Array": {},
      "qx.Promise": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.Stylesheet": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "engine.version": {
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
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
  ************************************************************************ */

  /**
   * Loads web fonts
   */
  qx.Class.define("qx.bom.webfonts.WebFontLoader", {
    extend: qx.core.Object,
    construct(fontFamily) {
      qx.core.Object.constructor.call(this);
      this.setFontFamily(fontFamily);
      this.__validators__P_198_0 = {};
    },
    properties: {
      /** The font name that this font is known by */
      fontFamily: {
        check: "String"
      },
      /** The fontFaces which need to be defined */
      fontFaces: {
        nullable: true,
        apply: "_applyFontFaces"
      },
      /** CSS urls or paths which need to be loaded */
      css: {
        nullable: true,
        check: "Array"
      },
      /**
       * Characters that are used to test if the font has loaded properly. These
       * default to "WEei" in `qx.bom.webfont.Validator` and can be overridden
       * for certain cases like icon fonts that do not provide the predefined
       * characters.
       */
      comparisonString: {
        check: "String",
        init: null,
        nullable: true
      },
      /**
       * Version identifier that is appended to the URL to be loaded. Fonts
       * that are defined thru themes may be managed by the resource manager.
       * In this case updated fonts persist due to aggressive fontface caching
       * of some browsers. To get around this, set the `version` property to
       * the version of your font. It will be appended to the CSS URL and forces
       * the browser to re-validate.
       *
       * The version needs to be URL friendly, so only characters, numbers,
       * dash and dots are allowed here.
       */
      version: {
        check(value) {
          return value === null || typeof value === "string" && /^[a-zA-Z0-9.-]+$/.test(value);
        },
        init: null,
        nullable: true
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __fontFacesQueue__P_198_1: null,
      __fontFacesCreatedPromise__P_198_2: null,
      _validators: null,
      getValidator(fontWeight, fontStyle) {
        fontWeight = fontWeight || "normal";
        fontStyle = fontStyle || "normal";
        let id = fontWeight + "::" + fontStyle;
        let validator = this.__validators__P_198_0[id];
        if (!validator) {
          validator = this.__validators__P_198_0[id] = new qx.bom.webfonts.Validator(this.getFontFamily(), this.getComparisonString(), fontWeight, fontStyle);
          validator.setTimeout(qx.bom.webfonts.WebFont.VALIDATION_TIMEOUT);
          validator.validate();
        }
        return validator;
      },
      /**
       * Called to load the font details into the browser
       */
      async load() {
        (this.getCss() || []).forEach(url => {
          if (!url.match(/^https?:/)) {
            url = qx.util.ResourceManager.getInstance().toUri(url);
          }
          if (this.getVersion()) {
            url += url.indexOf("?") < 0 ? "?" : "&";
            url += this.getVersion();
          }
          qx.bom.webfonts.WebFontLoader.__loadStylesheet__P_198_3(url);
        });
        let fontFaces = this.getFontFaces();
        if (fontFaces) {
          fontFaces.forEach(fontFace => {
            if (fontFace.paths) {
              fontFace.paths = fontFace.paths.map(path => {
                if (!path.match(/^https?:/)) {
                  path = qx.util.ResourceManager.getInstance().toUri(path);
                }
                if (this.getVersion()) {
                  path += path.indexOf("?") < 0 ? "?" : "&";
                  path += this.getVersion();
                }
                return path;
              });
            }
          });
          this.__fontFacesQueue__P_198_1 = qx.lang.Array.clone(fontFaces);
          this.__fontFacesCreatedPromise__P_198_2 = new qx.Promise();
        }
        this.__dequeueFontFaces__P_198_4();
      },
      async promiseLoaded() {
        return await this.__fontFacesCreatedPromise__P_198_2;
      },
      /**
       * Adds the font faces in __fontFacesQueue
       */
      __dequeueFontFaces__P_198_4() {
        if (this.__fontFacesQueue__P_198_1 == null) {
          return;
        }
        let fontFace = this.__fontFacesQueue__P_198_1.pop();
        this.__addFontFace__P_198_5(fontFace);
        if (this.__fontFacesQueue__P_198_1.length == 0) {
          this.__fontFacesQueue__P_198_1 = null;
          this.__fontFacesCreatedPromise__P_198_2.resolve(true);
        }
        if (qx.core.Environment.get("engine.name") == "mshtml" && (parseInt(qx.core.Environment.get("engine.version")) < 9 || qx.core.Environment.get("browser.documentmode") < 9)) {
          // old IEs need a break in between adding @font-face rules
          setTimeout(() => this.__dequeueFontFaces__P_198_4(), 100);
        } else {
          this.__dequeueFontFaces__P_198_4();
        }
      },
      /**
       * Adds a font face definition to the browser
       *
       * @param {*} fontFace - POJO of from the array in Manifest.json
       * @returns
       */
      __addFontFace__P_198_5(fontFace) {
        let fontFamily = fontFace.fontFamily || this.getFontFamily();
        let fontLookupKey = qx.bom.webfonts.WebFontLoader.createFontLookupKey(fontFamily, fontFace.fontWeight || "normal", fontFace.fontStyle || "normal");
        if (qx.bom.webfonts.WebFontLoader.__addedFontFaces__P_198_6[fontLookupKey]) {
          return;
        }
        if (!qx.bom.webfonts.WebFontLoader.__styleSheet__P_198_7) {
          let styleSheet = qx.bom.Stylesheet.createElement();
          qx.bom.webfonts.WebFontLoader.__styleSheet__P_198_7 = styleSheet;
          {
            styleSheet.ownerNode.setAttribute("data-qx-created-by", qx.bom.webfonts.WebFontLoader.classname);
            styleSheet.ownerNode.$$qxObject = this;
          }
        }
        let sourcesMap = {};
        const MATCH_FORMAT = new RegExp(".(" + qx.bom.webfonts.WebFontLoader.getPreferredFormats().join("|") + ")");

        /*
         * When compiling a `@font-face` rule, note that the first "src:" must never specify a format
         * and that EOT must go first if there is one
         */

        let fontFaceSrcRules = [];
        for (let i = 0; i < fontFace.paths.length; i++) {
          let match = MATCH_FORMAT.exec(fontFace.paths[i]);
          if (!match) {
            continue;
          }
          let fontFormat = match[1];
          let url = fontFace.paths[i];
          if (this.getVersion()) {
            url += "?" + this.getVersion();
          }
          fontFaceSrcRules.push({
            url: url,
            format: fontFormat
          });
          if (fontFormat == "eot") {
            fontFaceSrcRules.push({
              url: url + "?#iefix'",
              format: "embedded-opentype"
            });
          }
        }
        fontFaceSrcRules = fontFaceSrcRules.sort((a, b) => {
          a.fontFormat == "embedded-opentype" ? -1 : 0;
        });
        let strSources = "src: ";
        for (let i = 0; i < fontFaceSrcRules.length; i++) {
          if (i > 0) {
            strSources += ", ";
          }
          strSources += "url('" + new URL(fontFaceSrcRules[i].url, document.baseURI).href + "')";
          if (i > 0) {
            strSources += " format('" + fontFaceSrcRules[i].format + "')";
          }
        }
        strSources += ";\n";
        let rule = "font-family: " + fontFamily + ";\n";
        rule += strSources + "\n";
        rule += "font-style: " + (fontFace.fontStyle || "normal") + ";\n";
        rule += "font-weight: " + (fontFace.fontWeight || "normal") + ";\n";
        rule = "@font-face {\n" + rule + "}\n";
        let styleSheet = qx.bom.webfonts.WebFontLoader.__styleSheet__P_198_7;
        try {
          if (qx.core.Environment.get("browser.name") == "ie" && qx.core.Environment.get("browser.documentmode") < 9) {
            let cssText = qx.bom.webfonts.WebFontLoader.__fixCssText__P_198_8(styleSheet.cssText);
            cssText += rule;
            styleSheet.cssText = cssText;
          } else {
            styleSheet.insertRule(rule, styleSheet.cssRules.length);
          }
        } catch (ex) {
          {
            this.warn("Error while adding @font-face rule:", ex.message);
            return;
          }
        }
        qx.bom.webfonts.WebFontLoader.__addedFontFaces__P_198_6[fontLookupKey] = true;
      },
      // property apply
      _applyFontFaces(fontFaces, old) {
        var families = [];
        for (var i = 0, l = fontFaces.length; i < l; i++) {
          let fontFace = fontFaces[i];
          var familyName = this._quoteFontFamily(fontFace.family || this.getFontFamily());
          if (families.indexOf(familyName) < 0) {
            families.push(familyName);
          }
        }
      },
      /**
       * Makes sure font-family names containing spaces are properly quoted
       *
       * @param familyName {String} A font-family CSS value
       * @return {String} The quoted family name
       */
      _quoteFontFamily(familyName) {
        return familyName.replace(/["']/g, "");
      }
    },
    statics: {
      /**
       * List of known font definition formats (i.e. file extensions). Used to
       * identify the type of each font file configured for a web font.
       */
      FONT_FORMATS: ["eot", "woff2", "woff", "ttf", "svg"],
      /**
       * Timeout (in ms) to wait before deciding that a web font was not loaded.
       */
      VALIDATION_TIMEOUT: 5000,
      /** @type{String[]} array of supported font formats, most preferred first */
      __preferredFormats__P_198_9: null,
      /** */
      __loadedStylesheets__P_198_10: {},
      __addedFontFaces__P_198_6: {},
      /** Loader instances indexed by font family name */
      __loaders__P_198_11: {},
      /**
       * Gets/creates a loader
       *
       * @param {String} name font family name
       * @param {Boolean?} create whether to create one if one does not exist (default to false)
       * @returns
       */
      getLoader(name, create) {
        let loader = qx.bom.webfonts.WebFontLoader.__loaders__P_198_11[name];
        if (!loader && create) {
          loader = qx.bom.webfonts.WebFontLoader.__loaders__P_198_11[name] = new qx.bom.webfonts.WebFontLoader(name);
        }
        return loader;
      },
      /**
       * Adds a stylesheet, once per url
       *
       * @param {String} url
       */
      __loadStylesheet__P_198_3(url) {
        if (qx.bom.webfonts.WebFontLoader.__loadedStylesheets__P_198_10[url]) {
          return;
        }
        qx.bom.Stylesheet.includeFile(url);
        qx.bom.webfonts.WebFontLoader.__loadedStylesheets__P_198_10[url] = true;
      },
      /**
       * Creates a lookup key to index the created fonts.
       * @param familyName {String} font-family name
       * @param fontWeight {String} the font-weight.
       * @param fontStyle {String} the font-style.
       * @return {string} the font lookup key
       */
      createFontLookupKey(familyName, fontWeight, fontStyle) {
        var lookupKey = familyName + "_" + (fontWeight ? fontWeight : "normal") + "_" + (fontStyle ? fontStyle : "normal");
        return lookupKey;
      },
      /**
       * Uses a naive regExp match to determine the format of each defined source
       * file for a webFont. Returns a map with the format names as keys and the
       * corresponding source URLs as values.
       *
       * @param sources {String[]} Array of source URLs
       * @return {Map} Map of formats and URLs
       */
      __getSourcesMap__P_198_12(sources) {
        var formats = qx.bom.webfonts.WebFontLoader.FONT_FORMATS;
        var sourcesMap = {};
        var reg = new RegExp(".(" + formats.join("|") + ")");
        for (var i = 0, l = sources.length; i < l; i++) {
          var match = reg.exec(sources[i]);
          if (match) {
            var type = match[1];
            sourcesMap[type] = sources[i];
          }
        }
        return sourcesMap;
      },
      /**
       * Returns the preferred font format(s) for the currently used browser. Some
       * browsers support multiple formats, e.g. WOFF and TTF or WOFF and EOT. In
       * those cases, WOFF is considered the preferred format.
       *
       * @return {String[]} List of supported font formats ordered by preference
       * or empty Array if none could be determined
       */
      getPreferredFormats() {
        if (qx.bom.webfonts.WebFontLoader.__preferredFormats__P_198_9) {
          return qx.bom.webfonts.WebFontLoader.__preferredFormats__P_198_9;
        }
        var preferredFormats = [];
        var browser = qx.core.Environment.get("browser.name");
        var browserVersion = qx.core.Environment.get("browser.version");
        var os = qx.core.Environment.get("os.name");
        var osVersion = qx.core.Environment.get("os.version");
        if (browser == "edge" && browserVersion >= 14 || browser == "firefox" && browserVersion >= 69 || browser == "chrome" && browserVersion >= 36) {
          preferredFormats.push("woff2");
        }
        if (browser == "ie" && qx.core.Environment.get("browser.documentmode") >= 9 || browser == "edge" && browserVersion >= 12 || browser == "firefox" && browserVersion >= 3.6 || browser == "chrome" && browserVersion >= 6) {
          preferredFormats.push("woff");
        }
        if (browser == "edge" && browserVersion >= 12 || browser == "opera" && browserVersion >= 10 || browser == "safari" && browserVersion >= 3.1 || browser == "firefox" && browserVersion >= 3.5 || browser == "chrome" && browserVersion >= 4 || browser == "mobile safari" && os == "ios" && osVersion >= 4.2) {
          preferredFormats.push("ttf");
        }
        if (browser == "ie" && browserVersion >= 4) {
          preferredFormats.push("eot");
        }
        if (browser == "mobileSafari" && os == "ios" && osVersion >= 4.1) {
          preferredFormats.push("svg");
        }
        return qx.bom.webfonts.WebFontLoader.__preferredFormats__P_198_9 = preferredFormats;
      },
      /**
       * IE 6 and 7 omit the trailing quote after the format name when
       * querying cssText. This needs to be fixed before cssText is replaced
       * or all rules will be invalid and no web fonts will work any more.
       *
       * @param cssText {String} CSS text
       * @return {String} Fixed CSS text
       */
      __fixCssText__P_198_8(cssText) {
        return cssText.replace("'eot)", "'eot')").replace("('embedded-opentype)", "('embedded-opentype')");
      }
    }
  });
  qx.bom.webfonts.WebFontLoader.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.Font": {
        "require": true
      },
      "qx.bom.webfonts.WebFontLoader": {},
      "qx.Promise": {},
      "qx.bom.Label": {}
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
  
  ************************************************************************ */

  /**
   * Requests web fonts via {@link qx.bom.webfonts.WebFontLoader} and fires events
   * when their loading status is known.
   */
  qx.Class.define("qx.bom.webfonts.WebFont", {
    extend: qx.bom.Font,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Indicates that the font has loaded successfully
       */
      valid: {
        init: false,
        check: "Boolean",
        event: "changeValid",
        apply: "__applyValid__P_142_0"
      }
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired when the status of a web font has been determined. The event data
       * is a map with the keys "family" (the font-family name) and "valid"
       * (Boolean).
       */
      changeStatus: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __families__P_142_1: null,
      __allValidPromise__P_142_2: null,
      toString() {
        let fontWeight = this.isBold() ? "bold" : "normal";
        if (this.getWeight() !== null) {
          fontWeight = this.getWeight();
        }
        let fontStyle = this.isItalic() ? "italic" : "normal";
        return this.getFamily().join(",") + "[" + fontWeight + "::" + fontStyle + "] " + this.toHashCode();
      },
      /**
       * @override
       */
      loadComplete() {
        let promises = [];
        for (let fontFamily of this.getFamily()) {
          let loader = qx.bom.webfonts.WebFontLoader.getLoader(fontFamily);
          if (loader) {
            let fontWeight = this.isBold() ? "bold" : "normal";
            if (this.getWeight() !== null) {
              fontWeight = this.getWeight();
            }
            let fontStyle = this.isItalic() ? "italic" : "normal";
            let validator = loader.getValidator(fontWeight, fontStyle);
            promises.push(validator.isValid());
          }
        }
        this.__allValidPromise__P_142_2 = qx.Promise.all(promises).then(results => {
          if (results.length == 0 || results.indexOf(true) > -1) {
            this.setValid(true);
          } else {
            this.setValid(false);
          }
        });
      },
      async checkValid() {
        await this.__allValidPromise__P_142_2;
      },
      __applyValid__P_142_0(value) {
        qx.bom.Label.flushSizeCache();
        this.fireDataEvent("changeStatus", {
          family: this.getFamily(),
          valid: value
        });
      }
    },
    statics: {
      /**
       * Timeout (in ms) to wait before deciding that a web font was not loaded.
       */
      VALIDATION_TIMEOUT: 5000
    }
  });
  qx.bom.webfonts.WebFont.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.event.Timer": {}
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
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * A generic singleton that fires an "interval" event all 100 milliseconds. It
   * can be used whenever one needs to run code periodically. The main purpose of
   * this class is reduce the number of timers.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */

  qx.Class.define("qx.event.Idle", {
    extend: qx.core.Object,
    implement: [qx.core.IDisposable],
    type: "singleton",
    construct() {
      qx.core.Object.constructor.call(this);
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** This event if fired each time the interval time has elapsed */
      interval: "qx.event.type.Event"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Interval for the timer, which periodically fires the "interval" event,
       * in milliseconds.
       */
      timeoutInterval: {
        check: "Number",
        init: 100,
        apply: "_applyTimeoutInterval"
      }
    },
    members: {
      __timer__P_180_0: null,
      // property apply
      _applyTimeoutInterval(value) {
        if (this.__timer__P_180_0) {
          this.__timer__P_180_0.setInterval(value);
        }
      },
      /**
       * Fires an "interval" event
       */
      _onInterval() {
        this.fireEvent("interval");
      },
      /**
       * Starts the timer but only if there are listeners for the "interval" event
       */
      __startTimer__P_180_1() {
        if (!this.__timer__P_180_0 && this.hasListener("interval")) {
          var timer = new qx.event.Timer(this.getTimeoutInterval());
          timer.addListener("interval", this._onInterval, this);
          timer.start();
          this.__timer__P_180_0 = timer;
        }
      },
      /**
       * Stops the timer but only if there are no listeners for the interval event
       */
      __stopTimer__P_180_2() {
        if (this.__timer__P_180_0 && !this.hasListener("interval")) {
          this.__timer__P_180_0.stop();
          this.__timer__P_180_0.dispose();
          this.__timer__P_180_0 = null;
        }
      },
      /*
       * @Override
       */
      addListener(type, listener, self, capture) {
        var result = qx.event.Idle.superclass.prototype.addListener.call(this, type, listener, self, capture);
        this.__startTimer__P_180_1();
        return result;
      },
      /*
       * @Override
       */
      addListenerOnce(type, listener, self, capture) {
        var result = qx.event.Idle.superclass.prototype.addListenerOnce.call(this, type, listener, self, capture);
        this.__startTimer__P_180_1();
        return result;
      },
      /*
       * @Override
       */
      removeListener(type, listener, self, capture) {
        var result = qx.event.Idle.superclass.prototype.removeListener.call(this, type, listener, self, capture);
        this.__stopTimer__P_180_2();
        return result;
      },
      /*
       * @Override
       */
      removeListenerById(id) {
        var result = qx.event.Idle.superclass.prototype.removeListenerById.call(this, id);
        this.__stopTimer__P_180_2();
        return result;
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      if (this.__timer__P_180_0) {
        this.__timer__P_180_0.stop();
      }
      this.__timer__P_180_0 = null;
    }
  });
  qx.event.Idle.$$dbClassInfo = $$dbClassInfo;
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
      "qx.util.placement.DirectAxis": {
        "construct": true
      },
      "qx.core.Assert": {},
      "qx.util.placement.KeepAlignAxis": {},
      "qx.util.placement.BestFitAxis": {}
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
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Contains methods to compute a position for any object which should
   * be positioned relative to another object.
   */
  qx.Class.define("qx.util.placement.Placement", {
    extend: qx.core.Object,
    construct() {
      qx.core.Object.constructor.call(this);
      this.__defaultAxis__P_181_0 = qx.util.placement.DirectAxis;
    },
    properties: {
      /**
       * The axis object to use for the horizontal placement
       */
      axisX: {
        check: "Class"
      },
      /**
       * The axis object to use for the vertical placement
       */
      axisY: {
        check: "Class"
      },
      /**
       * Specify to which edge of the target object, the object should be attached
       */
      edge: {
        check: ["top", "right", "bottom", "left"],
        init: "top"
      },
      /**
       * Specify with which edge of the target object, the object should be aligned
       */
      align: {
        check: ["top", "right", "bottom", "left", "center", "middle"],
        init: "right"
      }
    },
    statics: {
      __instance__P_181_1: null,
      /**
       * DOM and widget independent method to compute the location
       * of an object to make it relative to any other object.
       *
       * @param size {Map} With the keys <code>width</code> and <code>height</code>
       *   of the object to align
       * @param area {Map} Available area to position the object. Has the keys
       *   <code>width</code> and <code>height</code>. Normally this is the parent
       *   object of the one to align.
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>left</code>, <code>top</code>, <code>right</code>
       *   and <code>bottom</code>.
       * @param offsets {Map} Map with all offsets for each direction.
       *   Comes with the keys <code>left</code>, <code>top</code>,
       *   <code>right</code> and <code>bottom</code>.
       * @param position {String} Alignment of the object on the target, any of
       *   "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right",
       *   "left-top", "left-middle", "left-bottom", "right-top", "right-middle", "right-bottom".
       * @param modeX {String} Horizontal placement mode. Valid values are:
       *   <ul>
       *   <li><code>direct</code>: place the object directly at the given
       *   location.</li>
       *   <li><code>keep-align</code>: if parts of the object is outside of the visible
       *   area it is moved to the best fitting 'edge' and 'alignment' of the target.
       *   It is guaranteed the the new position attaches the object to one of the
       *   target edges and that that is aligned with a target edge.</li>
       *   <li>best-fit</li>: If parts of the object are outside of the visible
       *   area it is moved into the view port ignoring any offset, and position
       *   values.
       *   </ul>
       * @param modeY {String} Vertical placement mode. Accepts the same values as
       *   the 'modeX' argument.
       * @return {Map} A map with the final location stored in the keys
       *   <code>left</code> and <code>top</code>.
       */
      compute(size, area, target, offsets, position, modeX, modeY) {
        this.__instance__P_181_1 = this.__instance__P_181_1 || new qx.util.placement.Placement();
        var splitted = position.split("-");
        var edge = splitted[0];
        var align = splitted[1];
        {
          if (align === "center" || align === "middle") {
            var expected = "middle";
            if (edge === "top" || edge === "bottom") {
              expected = "center";
            }
            qx.core.Assert.assertEquals(expected, align, "Please use '" + edge + "-" + expected + "' instead!");
          }
        }
        this.__instance__P_181_1.set({
          axisX: this.__getAxis__P_181_2(modeX),
          axisY: this.__getAxis__P_181_2(modeY),
          edge: edge,
          align: align
        });
        return this.__instance__P_181_1.compute(size, area, target, offsets);
      },
      __direct__P_181_3: null,
      __keepAlign__P_181_4: null,
      __bestFit__P_181_5: null,
      /**
       * Get the axis implementation for the given mode
       *
       * @param mode {String} One of <code>direct</code>, <code>keep-align</code> or
       *   <code>best-fit</code>
       * @return {qx.util.placement.AbstractAxis}
       */
      __getAxis__P_181_2(mode) {
        switch (mode) {
          case "direct":
            this.__direct__P_181_3 = this.__direct__P_181_3 || qx.util.placement.DirectAxis;
            return this.__direct__P_181_3;
          case "keep-align":
            this.__keepAlign__P_181_4 = this.__keepAlign__P_181_4 || qx.util.placement.KeepAlignAxis;
            return this.__keepAlign__P_181_4;
          case "best-fit":
            this.__bestFit__P_181_5 = this.__bestFit__P_181_5 || qx.util.placement.BestFitAxis;
            return this.__bestFit__P_181_5;
          default:
            throw new Error("Invalid 'mode' argument!'");
        }
      }
    },
    members: {
      __defaultAxis__P_181_0: null,
      /**
       * DOM and widget independent method to compute the location
       * of an object to make it relative to any other object.
       *
       * @param size {Map} With the keys <code>width</code> and <code>height</code>
       *   of the object to align
       * @param area {Map} Available area to position the object. Has the keys
       *   <code>width</code> and <code>height</code>. Normally this is the parent
       *   object of the one to align.
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>left</code>, <code>top</code>, <code>right</code>
       *   and <code>bottom</code>.
       * @param offsets {Map} Map with all offsets for each direction.
       *   Comes with the keys <code>left</code>, <code>top</code>,
       *   <code>right</code> and <code>bottom</code>.
       * @return {Map} A map with the final location stored in the keys
       *   <code>left</code> and <code>top</code>.
       */
      compute(size, area, target, offsets) {
        {
          this.assertObject(size, "size");
          this.assertNumber(size.width, "size.width");
          this.assertNumber(size.height, "size.height");
          this.assertObject(area, "area");
          this.assertNumber(area.width, "area.width");
          this.assertNumber(area.height, "area.height");
          this.assertObject(target, "target");
          this.assertNumber(target.top, "target.top");
          this.assertNumber(target.right, "target.right");
          this.assertNumber(target.bottom, "target.bottom");
          this.assertNumber(target.left, "target.left");
          this.assertObject(offsets, "offsets");
          this.assertNumber(offsets.top, "offsets.top");
          this.assertNumber(offsets.right, "offsets.right");
          this.assertNumber(offsets.bottom, "offsets.bottom");
          this.assertNumber(offsets.left, "offsets.left");
        }
        var axisX = this.getAxisX() || this.__defaultAxis__P_181_0;
        var left = axisX.computeStart(size.width, {
          start: target.left,
          end: target.right
        }, {
          start: offsets.left,
          end: offsets.right
        }, area.width, this.__getPositionX__P_181_6());
        var axisY = this.getAxisY() || this.__defaultAxis__P_181_0;
        var top = axisY.computeStart(size.height, {
          start: target.top,
          end: target.bottom
        }, {
          start: offsets.top,
          end: offsets.bottom
        }, area.height, this.__getPositionY__P_181_7());
        return {
          left: left,
          top: top
        };
      },
      /**
       * Get the position value for the horizontal axis
       *
       * @return {String} the position
       */
      __getPositionX__P_181_6() {
        var edge = this.getEdge();
        var align = this.getAlign();
        if (edge == "left") {
          return "edge-start";
        } else if (edge == "right") {
          return "edge-end";
        } else if (align == "left") {
          return "align-start";
        } else if (align == "center") {
          return "align-center";
        } else if (align == "right") {
          return "align-end";
        }
      },
      /**
       * Get the position value for the vertical axis
       *
       * @return {String} the position
       */
      __getPositionY__P_181_7() {
        var edge = this.getEdge();
        var align = this.getAlign();
        if (edge == "top") {
          return "edge-start";
        } else if (edge == "bottom") {
          return "edge-end";
        } else if (align == "top") {
          return "align-start";
        } else if (align == "middle") {
          return "align-center";
        } else if (align == "bottom") {
          return "align-end";
        }
      }
    },
    destruct() {
      this._disposeObjects("__defaultAxis__P_181_0");
    }
  });
  qx.util.placement.Placement.$$dbClassInfo = $$dbClassInfo;
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
      "qx.event.Registration": {
        "construct": true
      },
      "qx.bom.Element": {
        "construct": true
      },
      "qx.ui.core.Widget": {
        "require": true
      },
      "qx.ui.popup.Popup": {},
      "qx.lang.Array": {}
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
  
  ************************************************************************ */

  /**
   * This singleton is used to manager multiple instances of popups and their
   * state.
   */
  qx.Class.define("qx.ui.popup.Manager", {
    type: "singleton",
    extend: qx.core.Object,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.core.Object.constructor.call(this);

      // Create data structure, use an array because order matters [BUG #4323]
      this.__objects__P_175_0 = [];

      // Register pointerdown handler
      qx.event.Registration.addListener(document.documentElement, "pointerdown", this.__onPointerDown__P_175_1, this, true);

      // Hide all popups on window blur
      qx.bom.Element.addListener(window, "blur", this.hideAll, this);
    },
    properties: {
      /**
       * Function that is used to determine if a widget is contained within another one.
       **/
      containsFunction: {
        check: "Function",
        init: qx.ui.core.Widget.contains
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __objects__P_175_0: null,
      /**
       * Registers a visible popup.
       *
       * @param obj {qx.ui.popup.Popup} The popup to register
       */
      add(obj) {
        {
          if (!(obj instanceof qx.ui.popup.Popup)) {
            throw new Error("Object is no popup: " + obj);
          }
        }
        this.__objects__P_175_0.push(obj);
        this.__updateIndexes__P_175_2();
      },
      /**
       * Removes a popup from the registry
       *
       * @param obj {qx.ui.popup.Popup} The popup which was excluded
       */
      remove(obj) {
        {
          if (!(obj instanceof qx.ui.popup.Popup)) {
            throw new Error("Object is no popup: " + obj);
          }
        }
        qx.lang.Array.remove(this.__objects__P_175_0, obj);
        this.__updateIndexes__P_175_2();
      },
      /**
       * Excludes all currently open popups,
       * except those with {@link qx.ui.popup.Popup#autoHide} set to false.
       */
      hideAll() {
        var l = this.__objects__P_175_0.length,
          current = {};
        while (l--) {
          current = this.__objects__P_175_0[l];
          if (current.getAutoHide()) {
            current.exclude();
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        INTERNAL HELPER
      ---------------------------------------------------------------------------
      */

      /**
       * Updates the zIndex of all registered items to push
       * newly added ones on top of existing ones
       *
       */
      __updateIndexes__P_175_2() {
        var min = 1e7;
        for (var i = 0; i < this.__objects__P_175_0.length; i++) {
          this.__objects__P_175_0[i].setZIndex(min++);
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER
      ---------------------------------------------------------------------------
      */

      /**
       * Event handler for pointer down events
       *
       * @param e {qx.event.type.Pointer} Pointer event object
       */
      __onPointerDown__P_175_1(e) {
        // Get the corresponding widget of the target since we are dealing with
        // DOM elements here. This is necessary because we have to be aware of
        // Inline applications which are not covering the whole document and
        // therefore are not able to get all pointer events when only the
        // application root is monitored.
        var target = qx.ui.core.Widget.getWidgetByElement(e.getTarget());
        var reg = this.__objects__P_175_0;
        for (var i = 0; i < reg.length; i++) {
          var obj = reg[i];
          if (!obj.getAutoHide() || target == obj || this.getContainsFunction()(obj, target)) {
            continue;
          }
          obj.exclude();
        }
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      qx.event.Registration.removeListener(document.documentElement, "pointerdown", this.__onPointerDown__P_175_1, this, true);
      this._disposeArray("__objects__P_175_0");
    }
  });
  qx.ui.popup.Manager.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.html.Element": {
        "construct": true,
        "require": true
      },
      "qx.bom.Iframe": {}
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
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * A cross browser iframe instance.
   */
  qx.Class.define("qx.html.Iframe", {
    extend: qx.html.Element,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Wrapper for the HTML Iframe element.
     * @param url {String} Location which should be loaded inside the Iframe.
     * @param styles {Map?null} optional map of CSS styles, where the key is the name
     *    of the style and the value is the value to use.
     * @param attributes {Map?null} optional map of element attributes, where the
     *    key is the name of the attribute and the value is the value to use.
     */
    construct(url, styles, attributes) {
      qx.html.Element.constructor.call(this, "iframe", styles, attributes);
      this.registerProperty("source", null, this._setSourceProperty);
      this.setSource(url);
      this.addListener("navigate", this.__onNavigate__P_200_0, this);

      // add yourself to the element queue to enforce the creation of DOM element
      qx.html.Element._modified[this.toHashCode()] = this;
      qx.html.Element._scheduleFlush("element");
    },
    /*
     *****************************************************************************
        EVENTS
     *****************************************************************************
     */

    events: {
      /**
       * The "load" event is fired after the iframe content has successfully been loaded.
       */
      load: "qx.event.type.Event",
      /**
       * The "navigate" event is fired whenever the location of the iframe
       * changes.
       *
       * Useful to track user navigation and internally used to keep the source
       * property in sync. Only works when the destination source is of same
       * origin than the page embedding the iframe.
       */
      navigate: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        ELEMENT API
      ---------------------------------------------------------------------------
      */

      /**
       * Implementation of setter for the "source" property
       *
       * @param value {String?} value to set
       */
      _setSourceProperty(value) {
        var element = this.getDomElement();
        var currentUrl = qx.bom.Iframe.queryCurrentUrl(element);

        // Skip if frame is already on URL.
        //
        // When URL of Iframe and source property get out of sync, the source
        // property needs to be updated [BUG #4481]. This is to make sure the
        // same source is not set twice on the BOM level.
        if (value === currentUrl) {
          return;
        }
        qx.bom.Iframe.setSource(element, value);
      },
      // overridden
      _createDomElement() {
        return qx.bom.Iframe.create();
      },
      /*
      ---------------------------------------------------------------------------
        IFRAME API
      ---------------------------------------------------------------------------
      */

      /**
       * Get the DOM window object of an iframe.
       *
       * @return {Window} The DOM window object of the iframe.
       */
      getWindow() {
        var element = this.getDomElement();
        if (element) {
          return qx.bom.Iframe.getWindow(element);
        } else {
          return null;
        }
      },
      /**
       * Get the DOM document object of an iframe.
       *
       * @return {Document} The DOM document object of the iframe.
       */
      getDocument() {
        var element = this.getDomElement();
        if (element) {
          return qx.bom.Iframe.getDocument(element);
        } else {
          return null;
        }
      },
      /**
       * Get the HTML body element of the iframe.
       *
       * @return {Element} The DOM node of the <code>body</code> element of the iframe.
       */
      getBody() {
        var element = this.getDomElement();
        if (element) {
          return qx.bom.Iframe.getBody(element);
        } else {
          return null;
        }
      },
      /**
       * Sets iframe's source attribute to given value
       *
       * @param source {String} URL to be set.
       * @return {qx.html.Iframe} The current instance for chaining
       */
      setSource(source) {
        // the source needs to be applied directly in case the iFrame is hidden
        this._setProperty("source", source, true);
        return this;
      },
      /**
       * Get the current source.
       *
       * @return {String} The iframe's source
       */
      getSource() {
        return this._getProperty("source");
      },
      /**
       * Sets iframe's name attribute to given value
       *
       * @param name {String} Name to be set.
       * @return {qx.html.Iframe} The current instance for chaining
       */
      setName(name) {
        this.setAttribute("name", name);
        return this;
      },
      /**
       * Get the current name.
       *
       * @return {String} The iframe's name.
       */
      getName() {
        return this.getAttribute("name");
      },
      /**
       * Reloads iframe
       */
      reload() {
        var element = this.getDomElement();
        if (element) {
          var url = this.getSource();
          this.setSource(null);
          this.setSource(url);
        }
      },
      /*
      ---------------------------------------------------------------------------
        LISTENER
      ---------------------------------------------------------------------------
      */

      /**
       * Handle user navigation. Sync actual URL of iframe with source property.
       *
       * @param e {qx.event.type.Data} navigate event
       */
      __onNavigate__P_200_0(e) {
        var actualUrl = e.getData();
        if (actualUrl) {
          this.setSource(actualUrl);
        }
      }
    }
  });
  qx.html.Iframe.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.html.Element": {
        "construct": true,
        "require": true
      },
      "qx.bom.Input": {},
      "qx.bom.client.Engine": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine",
          "load": true
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
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A Input wrap any valid HTML input element and make it accessible
   * through the normalized qooxdoo element interface.
   */
  qx.Class.define("qx.html.Input", {
    extend: qx.html.Element,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param type {String} The type of the input field. Valid values are
     *   <code>text</code>, <code>textarea</code>, <code>select</code>,
     *   <code>checkbox</code>, <code>radio</code>, <code>password</code>,
     *   <code>hidden</code>, <code>submit</code>, <code>image</code>,
     *   <code>file</code>, <code>search</code>, <code>reset</code>,
     *   <code>select</code> and <code>textarea</code>.
     * @param styles {Map?null} optional map of CSS styles, where the key is the name
     *    of the style and the value is the value to use.
     * @param attributes {Map?null} optional map of element attributes, where the
     *    key is the name of the attribute and the value is the value to use.
     */
    construct(type, styles, attributes) {
      // Update node name correctly
      if (type === "select" || type === "textarea") {
        var nodeName = type;
      } else {
        nodeName = "input";
      }
      qx.html.Element.constructor.call(this, nodeName, styles, attributes);
      this.__type__P_161_0 = type;
      this.registerProperty("value", this._getValueProperty, this._setValueProperty);
      this.registerProperty("wrap", null, this._setWrapProperty);
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __type__P_161_0: null,
      // used for webkit only
      __selectable__P_161_1: null,
      __enabled__P_161_2: null,
      /*
      ---------------------------------------------------------------------------
        ELEMENT API
      ---------------------------------------------------------------------------
      */

      _useNodeImpl(domNode, newChildren) {
        qx.html.Input.superclass.prototype._useNodeImpl.call(this, domNode, newChildren);
      },
      //overridden
      _createDomElement() {
        return qx.bom.Input.create(this.__type__P_161_0);
      },
      /**
       * Implementation of setter for the "value" property
       *
       * @param value {String?} value to set
       */
      _setValueProperty(value) {
        var element = this.getDomElement();
        qx.bom.Input.setValue(element, value);
      },
      /**
       * Implementation of getter for the "value" property
       *
       * @return {String?} value on the dom
       */
      _getValueProperty() {
        var element = this.getDomElement();
        var value = qx.bom.Input.getValue(element);
        return value;
      },
      /**
       * Implementation of setter for the "wrap" property
       *
       * @param value {String?} value to set
       */
      _setWrapProperty(value) {
        var element = this.getDomElement();
        qx.bom.Input.setWrap(element, value);

        // qx.bom.Input#setWrap has the side-effect that the CSS property
        // overflow is set via DOM methods, causing queue and DOM to get
        // out of sync. Mirror all overflow properties to handle the case
        // when group and x/y property differ.
        this.setStyle("overflow", element.style.overflow, true);
        this.setStyle("overflowX", element.style.overflowX, true);
        this.setStyle("overflowY", element.style.overflowY, true);
      },
      /**
       * Set the input element enabled / disabled.
       * Webkit needs a special treatment because the set color of the input
       * field changes automatically. Therefore, we use
       * <code>-webkit-user-modify: read-only</code> and
       * <code>-webkit-user-select: none</code>
       * for disabling the fields in webkit. All other browsers use the disabled
       * attribute.
       *
       * @param value {Boolean} true, if the input element should be enabled.
       */
      setEnabled(value) {
        this.__enabled__P_161_2 = value;
        this.setAttribute("disabled", value === false);
        if (qx.core.Environment.get("engine.name") == "webkit") {
          if (!value) {
            this.setStyles({
              userModify: "read-only",
              userSelect: "none"
            });
          } else {
            this.setStyles({
              userModify: null,
              userSelect: this.__selectable__P_161_1 ? null : "none"
            });
          }
        }
      },
      /**
       * Set whether the element is selectable. It uses the qooxdoo attribute
       * qxSelectable with the values 'on' or 'off'.
       * In webkit, a special css property will be used and checks for the
       * enabled state.
       *
       * @param value {Boolean} True, if the element should be selectable.
       */
      setSelectable: qx.core.Environment.select("engine.name", {
        webkit(value) {
          this.__selectable__P_161_1 = value;

          // Only apply the value when it is enabled
          qx.html.Input.superclass.prototype.setSelectable.call(this, this.__enabled__P_161_2 && value);
        },
        default(value) {
          qx.html.Input.superclass.prototype.setSelectable.call(this, value);
        }
      }),
      /*
      ---------------------------------------------------------------------------
        INPUT API
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the value of the input element.
       *
       * @param value {var} the new value
       * @return {qx.html.Input} This instance for for chaining support.
       */
      setValue(value) {
        var element = this.getDomElement();
        if (element) {
          // Do not overwrite when already correct (on input events)
          // This is needed to keep caret position while typing.
          if (element.value != value) {
            qx.bom.Input.setValue(element, value);
          }
        } else {
          this._setProperty("value", value);
        }
        return this;
      },
      /**
       * Get the current value.
       *
       * @return {String} The element's current value.
       */
      getValue() {
        var element = this.getDomElement();
        if (element) {
          return qx.bom.Input.getValue(element);
        }
        return this._getProperty("value") || "";
      },
      /**
       * Sets the text wrap behavior of a text area element.
       *
       * This property uses the style property "wrap" (IE) respectively "whiteSpace"
       *
       * @param wrap {Boolean} Whether to turn text wrap on or off.
       * @param direct {Boolean?false} Whether the execution should be made
       *  directly when possible
       * @return {qx.html.Input} This instance for for chaining support.
       */
      setWrap(wrap, direct) {
        if (this.__type__P_161_0 === "textarea") {
          this._setProperty("wrap", wrap, direct);
        } else {
          throw new Error("Text wrapping is only support by textareas!");
        }
        return this;
      },
      /**
       * Gets the text wrap behavior of a text area element.
       *
       * This property uses the style property "wrap" (IE) respectively "whiteSpace"
       *
       * @return {Boolean} Whether wrapping is enabled or disabled.
       */
      getWrap() {
        if (this.__type__P_161_0 === "textarea") {
          return this._getProperty("wrap");
        } else {
          throw new Error("Text wrapping is only support by textareas!");
        }
      }
    }
  });
  qx.html.Input.$$dbClassInfo = $$dbClassInfo;
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
      "qx.util.Wheel": {}
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Mouse wheel event object.
   */
  qx.Class.define("qx.event.type.MouseWheel", {
    extend: qx.event.type.Mouse,
    members: {
      // overridden
      stop() {
        this.stopPropagation();
        this.preventDefault();
      },
      /**
       * Get the amount the wheel has been scrolled
       *
       * @param axis {String?} Optional parameter which defines the scroll axis.
       *   The value can either be <code>"x"</code> or <code>"y"</code>.
       * @return {Integer} Scroll wheel movement for the given axis. If no axis
       *   is given, the y axis is used.
       */
      getWheelDelta(axis) {
        return qx.util.Wheel.getDelta(this._native, axis);
      }
    }
  });
  qx.event.type.MouseWheel.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Event": {
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
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * Unify Project
  
       Homepage:
         http://unify-project.org
  
       Copyright:
         2009-2010 Deutsche Telekom AG, Germany, http://telekom.com
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
  ************************************************************************ */

  /**
   * Orientation event object.
   */
  qx.Class.define("qx.event.type.Orientation", {
    extend: qx.event.type.Event,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __orientation__P_214_0: null,
      __mode__P_214_1: null,
      /**
       * Initialize the fields of the event. The event must be initialized before
       * it can be dispatched.
       *
       * @param orientation {String} One of <code>0</code>, <code>90</code> or <code>-90</code>
       * @param mode {String} <code>landscape</code> or <code>portrait</code>
       * @return {qx.event.type.Orientation} The initialized event instance
       */
      init(orientation, mode) {
        qx.event.type.Orientation.superclass.prototype.init.call(this, false, false);
        this.__orientation__P_214_0 = orientation;
        this.__mode__P_214_1 = mode;
        return this;
      },
      /**
       * Get a copy of this object
       *
       * @param embryo {qx.event.type.Orientation?null} Optional event class, which will
       *     be configured using the data of this event instance. The event must be
       *     an instance of this event class. If the data is <code>null</code>,
       *     a new pooled instance is created.
       *
       * @return {qx.event.type.Orientation} a copy of this object
       */
      clone(embryo) {
        var clone = qx.event.type.Orientation.superclass.prototype.clone.call(this, embryo);
        clone.__orientation__P_214_0 = this.__orientation__P_214_0;
        clone.__mode__P_214_1 = this.__mode__P_214_1;
        return clone;
      },
      /**
       * Returns the current orientation of the viewport in degree.
       *
       * All possible values and their meaning:
       *
       * * <code>0</code>: "Portrait"
       * * <code>-90</code>: "Landscape (right, screen turned clockwise)"
       * * <code>90</code>: "Landscape (left, screen turned counterclockwise)"
       * * <code>180</code>: "Portrait (upside-down portrait)"
       *
       * @return {Integer} The current orientation in degree
       */
      getOrientation() {
        return this.__orientation__P_214_0;
      },
      /**
       * Whether the viewport orientation is currently in landscape mode.
       *
       * @return {Boolean} <code>true</code> when the viewport orientation
       *     is currently in landscape mode.
       */
      isLandscape() {
        return this.__mode__P_214_1 == "landscape";
      },
      /**
       * Whether the viewport orientation is currently in portrait mode.
       *
       * @return {Boolean} <code>true</code> when the viewport orientation
       *     is currently in portrait mode.
       */
      isPortrait() {
        return this.__mode__P_214_1 == "portrait";
      }
    }
  });
  qx.event.type.Orientation.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Dom": {
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
       * Martin Wittemann (martinwittemann)
       * Tino Butz (tbtz)
  
  ************************************************************************ */

  /**
   * Touch event object.
   *
   * For more information see:
   *     https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html
   */
  qx.Class.define("qx.event.type.Touch", {
    extend: qx.event.type.Dom,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Touch.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        clone.pageX = nativeEvent.pageX;
        clone.pageY = nativeEvent.pageY;
        clone.offsetX = nativeEvent.offsetX;
        clone.offsetY = nativeEvent.offsetY;

        // Workaround for BUG #6491
        clone.layerX = nativeEvent.offsetX || nativeEvent.layerX;
        clone.layerY = nativeEvent.offsetY || nativeEvent.layerY;
        clone.scale = nativeEvent.scale;
        clone.rotation = nativeEvent.rotation;
        clone._rotation = nativeEvent._rotation;
        clone.delta = nativeEvent.delta;
        clone.srcElement = nativeEvent.srcElement;
        clone.targetTouches = [];
        for (var i = 0; i < nativeEvent.targetTouches.length; i++) {
          clone.targetTouches[i] = nativeEvent.targetTouches[i];
        }
        clone.changedTouches = [];
        for (i = 0; i < nativeEvent.changedTouches.length; i++) {
          clone.changedTouches[i] = nativeEvent.changedTouches[i];
        }
        clone.touches = [];
        for (i = 0; i < nativeEvent.touches.length; i++) {
          clone.touches[i] = nativeEvent.touches[i];
        }
        return clone;
      },
      // overridden
      stop() {
        this.stopPropagation();
      },
      /**
       * Returns an array of native Touch objects representing all current
       * touches on the document.
       * Returns an empty array for the "touchend" event.
       *
       * @return {Object[]} Array of touch objects. For more information see:
       *     https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchClassReference/Touch/Touch.html
       */
      getAllTouches() {
        return this._native.touches;
      },
      /**
       * Returns an array of native Touch objects representing all touches
       * associated with the event target element.
       * Returns an empty array for the "touchend" event.
       *
       * @return {Object[]} Array of touch objects. For more information see:
       *     https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchClassReference/Touch/Touch.html
       */
      getTargetTouches() {
        return this._native.targetTouches;
      },
      /**
       * Returns an array of native Touch objects representing all touches of
       * the target element that changed in this event.
       *
       * On the "touchstart" event the array contains all touches that were
       * added to the target element.
       * On the "touchmove" event the array contains all touches that were
       * moved on the target element.
       * On the "touchend" event the array contains all touches that used
       * to be on the target element.
       *
       * @return {Object[]} Array of touch objects. For more information see:
       *     https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchClassReference/Touch/Touch.html
       */
      getChangedTargetTouches() {
        return this._native.changedTouches;
      },
      /**
       * Checks whether more than one touch is associated with the event target
       * element.
       *
       * @return {Boolean} Is multi-touch
       */
      isMultiTouch() {
        return this.__getEventSpecificTouches__P_203_0().length > 1;
      },
      /**
       * Returns the distance between two fingers since the start of the event.
       * The distance is a multiplier of the initial distance.
       * Initial value: 1.0.
       * Gestures:
       * < 1.0, pinch close / zoom out.
       * > 1.0, pinch open / to zoom in.
       *
       * @return {Float} The scale distance between two fingers
       */
      getScale() {
        return this._native.scale;
      },
      /**
       * Returns the delta of the rotation since the start of the event, in degrees.
       * Initial value is 0.0
       * Clockwise > 0
       * Counter-clockwise < 0.
       *
       * @return {Float} The rotation delta
       */
      getRotation() {
        if (typeof this._native._rotation === "undefined") {
          return this._native.rotation;
        } else {
          return this._native._rotation;
        }
      },
      /**
       * Returns an array with the calculated delta coordinates of all active touches,
       * relative to the position on <code>touchstart</code> event.
       *
       * @return {Array} an array with objects for each active touch which contains the delta as <code>x</code> and
       * <code>y</code>, the touch identifier as <code>identifier</code> and the movement axis as <code>axis</code>.
       */
      getDelta() {
        return this._native.delta;
      },
      /**
       * Get the horizontal position at which the event occurred relative to the
       * left of the document. This property takes into account any scrolling of
       * the page.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The horizontal position of the touch in the document.
       */
      getDocumentLeft(touchIndex) {
        return this.__getEventSpecificTouch__P_203_1(touchIndex).pageX;
      },
      /**
       * Get the vertical position at which the event occurred relative to the
       * top of the document. This property takes into account any scrolling of
       * the page.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The vertical position of the touch in the document.
       */
      getDocumentTop(touchIndex) {
        return this.__getEventSpecificTouch__P_203_1(touchIndex).pageY;
      },
      /**
       * Get the horizontal coordinate at which the event occurred relative to
       * the origin of the screen coordinate system.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The horizontal position of the touch
       */
      getScreenLeft(touchIndex) {
        return this.__getEventSpecificTouch__P_203_1(touchIndex).screenX;
      },
      /**
       * Get the vertical coordinate at which the event occurred relative to
       * the origin of the screen coordinate system.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The vertical position of the touch
       */
      getScreenTop(touchIndex) {
        return this.__getEventSpecificTouch__P_203_1(touchIndex).screenY;
      },
      /**
       * Get the the horizontal coordinate at which the event occurred relative
       * to the viewport.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The horizontal position of the touch
       */
      getViewportLeft(touchIndex) {
        return this.__getEventSpecificTouch__P_203_1(touchIndex).clientX;
      },
      /**
       * Get the vertical coordinate at which the event occurred relative
       * to the viewport.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The vertical position of the touch
       */
      getViewportTop(touchIndex) {
        return this.__getEventSpecificTouch__P_203_1(touchIndex).clientY;
      },
      /**
       * Returns the unique identifier for a certain touch object.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} Unique identifier of the touch object
       */
      getIdentifier(touchIndex) {
        return this.__getEventSpecificTouch__P_203_1(touchIndex).identifier;
      },
      /**
       * Returns an event specific touch on the target element. This function is
       * used as the "touchend" event only offers Touch objects in the
       * changedTouches array.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object to
       *     retrieve
       * @return {Object} A native Touch object
       */
      __getEventSpecificTouch__P_203_1(touchIndex) {
        touchIndex = touchIndex == null ? 0 : touchIndex;
        return this.__getEventSpecificTouches__P_203_0()[touchIndex];
      },
      /**
       * Returns the event specific touches on the target element. This function
       * is used as the "touchend" event only offers Touch objects in the
       * changedTouches array.
       *
       * @return {Object[]} Array of native Touch objects
       */
      __getEventSpecificTouches__P_203_0() {
        var touches = this._isTouchEnd() ? this.getChangedTargetTouches() : this.getTargetTouches();
        return touches;
      },
      /**
       * Indicates if the event occurs during the "touchend" phase. Needed to
       * determine the event specific touches. Override this method if you derive
       * from this class and want to indicate that the specific event occurred
       * during the "touchend" phase.
       *
       * @return {Boolean} Whether the event occurred during the "touchend" phase
       */
      _isTouchEnd() {
        return this.getType() == "touchend" || this.getType() == "touchcancel";
      }
    }
  });
  qx.event.type.Touch.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Engine": {},
      "qx.bom.client.Browser": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["plugin.gears", "plugin.quicktime", "plugin.quicktime.version", "plugin.windowsmedia", "plugin.windowsmedia.version", "plugin.divx", "plugin.divx.version", "plugin.silverlight", "plugin.silverlight.version", "plugin.pdf", "plugin.pdf.version", "plugin.activex", "plugin.skype"],
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
   * Contains detection for QuickTime, Windows Media, DivX, Silverlight and gears.
   * If no version could be detected the version is set to an empty string as
   * default.
   *
   * This class is used by {@link qx.core.Environment} and should not be used
   * directly. Please check its class comment for details how to use it.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.Plugin", {
    statics: {
      /**
       * Checks for the availability of google gears plugin.
       *
       * @internal
       * @return {Boolean} <code>true</code> if gears is available
       */
      getGears() {
        return !!(window.google && window.google.gears);
      },
      /**
       * Checks for ActiveX availability.
       *
       * @internal
       * @return {Boolean} <code>true</code> if ActiveX is available
       *
       * @ignore(window.ActiveXObject)
       */
      getActiveX() {
        if (typeof window.ActiveXObject === "function") {
          return true;
        }
        try {
          // in IE11 Preview, ActiveXObject is undefined but instances can
          // still be created
          return window.ActiveXObject !== undefined && (typeof new window.ActiveXObject("Microsoft.XMLHTTP") === "object" || typeof new window.ActiveXObject("MSXML2.DOMDocument.6.0") === "object");
        } catch (ex) {
          return false;
        }
      },
      /**
       * Checks for Skypes 'Click to call' availability.
       *
       * @internal
       * @return {Boolean} <code>true</code> if the plugin is available.
       */
      getSkype() {
        // IE Support
        if (qx.bom.client.Plugin.getActiveX()) {
          try {
            new window.ActiveXObject("Skype.Detection");
            return true;
          } catch (e) {}
        }
        var mimeTypes = navigator.mimeTypes;
        if (mimeTypes) {
          // FF support
          if ("application/x-skype" in mimeTypes) {
            return true;
          }
          // webkit support
          for (var i = 0; i < mimeTypes.length; i++) {
            var desc = mimeTypes[i];
            if (desc.type.indexOf("skype.click2call") != -1) {
              return true;
            }
          }
        }
        return false;
      },
      /**
       * Database of supported features.
       * Filled with additional data at initialization
       */
      __db__P_204_0: {
        quicktime: {
          plugin: ["QuickTime"],
          control: "QuickTimeCheckObject.QuickTimeCheck.1"
          // call returns boolean: instance.IsQuickTimeAvailable(0)
        },
        wmv: {
          plugin: ["Windows Media"],
          control: "WMPlayer.OCX.7"
          // version string in: instance.versionInfo
        },
        divx: {
          plugin: ["DivX Web Player"],
          control: "npdivx.DivXBrowserPlugin.1"
        },
        silverlight: {
          plugin: ["Silverlight"],
          control: "AgControl.AgControl"
          // version string in: instance.version (Silverlight 1.0)
          // version string in: instance.settings.version (Silverlight 1.1)
          // version check possible using instance.IsVersionSupported
        },
        pdf: {
          plugin: ["Chrome PDF Viewer", "Adobe Acrobat"],
          control: "AcroPDF.PDF"
          // this is detecting Acrobat PDF version > 7 and Chrome PDF Viewer
        }
      },
      /**
       * Fetches the version of the quicktime plugin.
       * @return {String} The version of the plugin, if available,
       *   an empty string otherwise
       * @internal
       */
      getQuicktimeVersion() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["quicktime"];
        return qx.bom.client.Plugin.__getVersion__P_204_1(entry.control, entry.plugin);
      },
      /**
       * Fetches the version of the windows media plugin.
       * @return {String} The version of the plugin, if available,
       *   an empty string otherwise
       * @internal
       */
      getWindowsMediaVersion() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["wmv"];
        return qx.bom.client.Plugin.__getVersion__P_204_1(entry.control, entry.plugin, true);
      },
      /**
       * Fetches the version of the divx plugin.
       * @return {String} The version of the plugin, if available,
       *   an empty string otherwise
       * @internal
       */
      getDivXVersion() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["divx"];
        return qx.bom.client.Plugin.__getVersion__P_204_1(entry.control, entry.plugin);
      },
      /**
       * Fetches the version of the silverlight plugin.
       * @return {String} The version of the plugin, if available,
       *   an empty string otherwise
       * @internal
       */
      getSilverlightVersion() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["silverlight"];
        return qx.bom.client.Plugin.__getVersion__P_204_1(entry.control, entry.plugin);
      },
      /**
       * Fetches the version of the pdf plugin.
       *
       * There are two built-in PDF viewer shipped with browsers:
       *
       * <ul>
       *  <li>Chrome PDF Viewer</li>
       *  <li>PDF.js (Firefox)</li>
       * </ul>
       *
       * While the Chrome PDF Viewer is implemented as plugin and therefore
       * detected by this method PDF.js is <strong>not</strong>.
       *
       * See the dedicated environment key (<em>plugin.pdfjs</em>) instead,
       * which you might check additionally.
       *
       * @return {String} The version of the plugin, if available,
       *  an empty string otherwise
       * @internal
       */
      getPdfVersion() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["pdf"];
        return qx.bom.client.Plugin.__getVersion__P_204_1(entry.control, entry.plugin);
      },
      /**
       * Checks if the quicktime plugin is available.
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getQuicktime() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["quicktime"];
        return qx.bom.client.Plugin.__isAvailable__P_204_2(entry.control, entry.plugin);
      },
      /**
       * Checks if the windows media plugin is available.
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getWindowsMedia() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["wmv"];
        return qx.bom.client.Plugin.__isAvailable__P_204_2(entry.control, entry.plugin, true);
      },
      /**
       * Checks if the divx plugin is available.
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getDivX() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["divx"];
        return qx.bom.client.Plugin.__isAvailable__P_204_2(entry.control, entry.plugin);
      },
      /**
       * Checks if the silverlight plugin is available.
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getSilverlight() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["silverlight"];
        return qx.bom.client.Plugin.__isAvailable__P_204_2(entry.control, entry.plugin);
      },
      /**
       * Checks if the pdf plugin is available.
       *
       * There are two built-in PDF viewer shipped with browsers:
       *
       * <ul>
       *  <li>Chrome PDF Viewer</li>
       *  <li>PDF.js (Firefox)</li>
       * </ul>
       *
       * While the Chrome PDF Viewer is implemented as plugin and therefore
       * detected by this method PDF.js is <strong>not</strong>.
       *
       * See the dedicated environment key (<em>plugin.pdfjs</em>) instead,
       * which you might check additionally.
       *
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getPdf() {
        var entry = qx.bom.client.Plugin.__db__P_204_0["pdf"];
        return qx.bom.client.Plugin.__isAvailable__P_204_2(entry.control, entry.plugin);
      },
      /**
       * Internal helper for getting the version of a given plugin.
       *
       * @param activeXName {String} The name which should be used to generate
       *   the test ActiveX Object.
       * @param pluginNames {Array} The names with which the plugins are listed in
       *   the navigator.plugins list.
       * @param forceActiveX {Boolean?false} Force detection using ActiveX
       *   for IE11 plugins that aren't listed in navigator.plugins
       * @return {String} The version of the plugin as string.
       */
      __getVersion__P_204_1(activeXName, pluginNames, forceActiveX) {
        var available = qx.bom.client.Plugin.__isAvailable__P_204_2(activeXName, pluginNames, forceActiveX);

        // don't check if the plugin is not available
        if (!available) {
          return "";
        }

        // IE checks
        if (qx.bom.client.Engine.getName() == "mshtml" && (qx.bom.client.Browser.getDocumentMode() < 11 || forceActiveX)) {
          try {
            var obj = new window.ActiveXObject(activeXName);
            var version;

            // pdf version detection
            if (obj.GetVersions && obj.GetVersions()) {
              version = obj.GetVersions().split(",");
              if (version.length > 1) {
                version = version[0].split("=");
                if (version.length === 2) {
                  return version[1];
                }
              }
            }
            version = obj.versionInfo;
            if (version != undefined) {
              return version;
            }
            version = obj.version;
            if (version != undefined) {
              return version;
            }
            version = obj.settings.version;
            if (version != undefined) {
              return version;
            }
          } catch (ex) {
            return "";
          }
          return "";

          // all other browsers
        } else {
          var plugins = navigator.plugins;
          var verreg = /([0-9]\.[0-9])/g;
          for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            for (var j = 0; j < pluginNames.length; j++) {
              if (plugin.name.indexOf(pluginNames[j]) !== -1) {
                if (verreg.test(plugin.name) || verreg.test(plugin.description)) {
                  return RegExp.$1;
                }
              }
            }
          }
          return "";
        }
      },
      /**
       * Internal helper for getting the availability of a given plugin.
       *
       * @param activeXName {String} The name which should be used to generate
       *   the test ActiveX Object.
       * @param pluginNames {Array} The names with which the plugins are listed in
       *   the navigator.plugins list.
       * @param forceActiveX {Boolean?false} Force detection using ActiveX
       *   for IE11 plugins that aren't listed in navigator.plugins
       * @return {Boolean} <code>true</code>, if the plugin available
       */
      __isAvailable__P_204_2(activeXName, pluginNames, forceActiveX) {
        // IE checks
        if (qx.bom.client.Engine.getName() == "mshtml" && (qx.bom.client.Browser.getDocumentMode() < 11 || forceActiveX)) {
          if (!this.getActiveX()) {
            return false;
          }
          try {
            new window.ActiveXObject(activeXName);
          } catch (ex) {
            return false;
          }
          return true;
          // all other
        } else {
          var plugins = navigator.plugins;
          if (!plugins) {
            return false;
          }
          var name;
          for (var i = 0; i < plugins.length; i++) {
            name = plugins[i].name;
            for (var j = 0; j < pluginNames.length; j++) {
              if (name.indexOf(pluginNames[j]) !== -1) {
                return true;
              }
            }
          }
          return false;
        }
      }
    },
    defer(statics) {
      qx.core.Environment.add("plugin.gears", statics.getGears);
      qx.core.Environment.add("plugin.quicktime", statics.getQuicktime);
      qx.core.Environment.add("plugin.quicktime.version", statics.getQuicktimeVersion);
      qx.core.Environment.add("plugin.windowsmedia", statics.getWindowsMedia);
      qx.core.Environment.add("plugin.windowsmedia.version", statics.getWindowsMediaVersion);
      qx.core.Environment.add("plugin.divx", statics.getDivX);
      qx.core.Environment.add("plugin.divx.version", statics.getDivXVersion);
      qx.core.Environment.add("plugin.silverlight", statics.getSilverlight);
      qx.core.Environment.add("plugin.silverlight.version", statics.getSilverlightVersion);
      qx.core.Environment.add("plugin.pdf", statics.getPdf);
      qx.core.Environment.add("plugin.pdf.version", statics.getPdfVersion);
      qx.core.Environment.add("plugin.activex", statics.getActiveX);
      qx.core.Environment.add("plugin.skype", statics.getSkype);
    }
  });
  qx.bom.client.Plugin.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.xml.Document": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["xml.implementation", "xml.domparser", "xml.selectsinglenode", "xml.selectnodes", "xml.getelementsbytagnamens", "xml.domproperties", "xml.attributens", "xml.createelementns", "xml.createnode", "xml.getqualifieditem"],
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
       * Daniel Wagner (d_wagner)
  
  ************************************************************************ */
  /**
   * Internal class which contains the checks used by {@link qx.core.Environment}.
   * All checks in here are marked as internal which means you should never use
   * them directly.
   *
   * This class should contain all XML-related checks
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.Xml", {
    statics: {
      /**
       * Checks if XML is supported
       *
       * @internal
       * @return {Boolean} <code>true</code> if XML is supported
       */
      getImplementation() {
        return document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("XML", "1.0");
      },
      /**
       * Checks if an XML DOMParser is available
       *
       * @internal
       * @return {Boolean} <code>true</code> if DOMParser is supported
       */
      getDomParser() {
        return typeof window.DOMParser !== "undefined";
      },
      /**
       * Checks if the proprietary selectSingleNode method is available on XML DOM
       * nodes.
       *
       * @internal
       * @return {Boolean} <code>true</code> if selectSingleNode is available
       */
      getSelectSingleNode() {
        return typeof qx.xml.Document.create().selectSingleNode !== "undefined";
      },
      /**
       * Checks if the proprietary selectNodes method is available on XML DOM
       * nodes.
       *
       * @internal
       * @return {Boolean} <code>true</code> if selectSingleNode is available
       */
      getSelectNodes() {
        return typeof qx.xml.Document.create().selectNodes !== "undefined";
      },
      /**
       * Checks availability of the getElementsByTagNameNS XML DOM method.
       *
       * @internal
       * @return {Boolean} <code>true</code> if getElementsByTagNameNS is available
       */
      getElementsByTagNameNS() {
        return typeof qx.xml.Document.create().getElementsByTagNameNS !== "undefined";
      },
      /**
       * Checks if MSXML-style DOM Level 2 properties are supported.
       *
       * @internal
       * @return {Boolean} <code>true</code> if DOM Level 2 properties are supported
       */
      getDomProperties() {
        var doc = qx.xml.Document.create();
        return "getProperty" in doc && typeof doc.getProperty("SelectionLanguage") === "string";
      },
      /**
       * Checks if the getAttributeNS and setAttributeNS methods are supported on
       * XML DOM elements
       *
       * @internal
       * @return {Boolean} <code>true</code> if get/setAttributeNS is supported
       */
      getAttributeNS() {
        var docElem = qx.xml.Document.fromString("<a></a>").documentElement;
        return typeof docElem.getAttributeNS === "function" && typeof docElem.setAttributeNS === "function";
      },
      /**
       * Checks if the createElementNS method is supported on XML DOM documents
       *
       * @internal
       * @return {Boolean} <code>true</code> if createElementNS is supported
       */
      getCreateElementNS() {
        return typeof qx.xml.Document.create().createElementNS === "function";
      },
      /**
       * Checks if the proprietary createNode method is supported on XML DOM
       * documents
       *
       * @internal
       * @return {Boolean} <code>true</code> if DOM Level 2 properties are supported
       */
      getCreateNode() {
        return typeof qx.xml.Document.create().createNode !== "undefined";
      },
      /**
       * Checks if the proprietary getQualifiedItem method is supported for XML
       * element attributes
       *
       * @internal
       * @return {Boolean} <code>true</code> if DOM Level 2 properties are supported
       */
      getQualifiedItem() {
        var docElem = qx.xml.Document.fromString("<a></a>").documentElement;
        return typeof docElem.attributes.getQualifiedItem !== "undefined";
      }
    },
    defer(statics) {
      qx.core.Environment.add("xml.implementation", statics.getImplementation);
      qx.core.Environment.add("xml.domparser", statics.getDomParser);
      qx.core.Environment.add("xml.selectsinglenode", statics.getSelectSingleNode);
      qx.core.Environment.add("xml.selectnodes", statics.getSelectNodes);
      qx.core.Environment.add("xml.getelementsbytagnamens", statics.getElementsByTagNameNS);
      qx.core.Environment.add("xml.domproperties", statics.getDomProperties);
      qx.core.Environment.add("xml.attributens", statics.getAttributeNS);
      qx.core.Environment.add("xml.createelementns", statics.getCreateElementNS);
      qx.core.Environment.add("xml.createnode", statics.getCreateNode);
      qx.core.Environment.add("xml.getqualifieditem", statics.getQualifiedItem);
    }
  });
  qx.bom.client.Xml.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.Plugin": {
        "defer": "load",
        "require": true
      },
      "qx.bom.client.Xml": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "plugin.activex": {
          "className": "qx.bom.client.Plugin",
          "defer": true
        },
        "xml.implementation": {
          "className": "qx.bom.client.Xml"
        },
        "xml.domparser": {
          "className": "qx.bom.client.Xml"
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
   * Cross browser XML document creation API
   *
   * The main purpose of this class is to allow you to create XML document objects in a
   * cross-browser fashion. Use <code>create</code> to create an empty document,
   * <code>fromString</code> to create one from an existing XML text. Both methods
   * return a *native DOM object*. That means you use standard DOM methods on such
   * an object (e.g. <code>createElement</code>).
   *
   * The following links provide further information on XML documents:
   *
   * * <a href="http://www.w3.org/TR/DOM-Level-2-Core/core.html#i-Document">W3C Interface Specification</a>
   * * <a href="http://msdn2.microsoft.com/en-us/library/ms535918.aspx">MS xml Object</a>
   * * <a href="http://msdn2.microsoft.com/en-us/library/ms764622.aspx">MSXML GUIDs and ProgIDs</a>
   * * <a href="https://developer.mozilla.org/en-US/docs/Parsing_and_serializing_XML">MDN Parsing and Serializing XML</a>
   */
  /* global ActiveXObject */
  /* global window */
  qx.Bootstrap.define("qx.xml.Document", {
    statics: {
      /** @type {String} ActiveX class name of DOMDocument (IE specific) */
      DOMDOC: null,
      /** @type {String} ActiveX class name of XMLHttpRequest (IE specific) */
      XMLHTTP: null,
      /**
       * Whether the given element is a XML document or element
       * which is part of a XML document.
       *
       * @param elem {Document|Element} Any DOM Document or Element
       * @return {Boolean} Whether the document is a XML document
       */
      isXmlDocument(elem) {
        if (elem.nodeType === 9) {
          return elem.documentElement.nodeName !== "HTML";
        } else if (elem.ownerDocument) {
          return this.isXmlDocument(elem.ownerDocument);
        } else {
          return false;
        }
      },
      /**
       * Create an XML document.
       *
       * Returns a native DOM document object, set up for XML.
       *
       * @param namespaceUri {String ? null} The namespace URI of the document element to create or null.
       * @param qualifiedName {String ? null} The qualified name of the document element to be created or null.
       * @return {Document} empty XML object
       *
       * @ignore(ActiveXObject)
       */
      create(namespaceUri, qualifiedName) {
        // ActiveX - This is the preferred way for IE9 as well since it has no XPath
        // support when using the native implementation.createDocument
        if (qx.core.Environment.get("plugin.activex")) {
          var obj = new ActiveXObject(this.DOMDOC);
          //The SelectionLanguage property is no longer needed in MSXML 6; trying
          // to set it causes an exception in IE9.
          if (this.DOMDOC == "MSXML2.DOMDocument.3.0") {
            obj.setProperty("SelectionLanguage", "XPath");
          }
          if (qualifiedName) {
            var str = '<?xml version="1.0" encoding="utf-8"?>\n<';
            str += qualifiedName;
            if (namespaceUri) {
              str += " xmlns='" + namespaceUri + "'";
            }
            str += " />";
            obj.loadXML(str);
          }
          return obj;
        }
        if (qx.core.Environment.get("xml.implementation")) {
          return document.implementation.createDocument(namespaceUri || "", qualifiedName || "", null);
        }
        throw new Error("No XML implementation available!");
      },
      /**
       * The string passed in is parsed into a DOM document.
       *
       * @param str {String} the string to be parsed
       * @return {Document} XML document with given content
       * @signature function(str)
       *
       * @ignore(DOMParser)
       */
      fromString(str) {
        // Legacy IE/ActiveX
        if (qx.core.Environment.get("plugin.activex")) {
          var dom = qx.xml.Document.create();
          dom.loadXML(str);
          return dom;
        }
        if (qx.core.Environment.get("xml.domparser")) {
          var parser = new DOMParser();
          return parser.parseFromString(str, "text/xml");
        }
        throw new Error("No XML implementation available!");
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      // Detecting available ActiveX implementations.
      if (qx.core.Environment.get("plugin.activex")) {
        // According to information on the Microsoft XML Team's WebLog
        // it is recommended to check for availability of MSXML versions 6.0 and 3.0.
        // http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
        var domDoc = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0"];
        var httpReq = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0"];
        for (var i = 0, l = domDoc.length; i < l; i++) {
          try {
            // Keep both objects in sync with the same version.
            // This is important as there were compatibility issues detected.
            new ActiveXObject(domDoc[i]);
            new ActiveXObject(httpReq[i]);
          } catch (ex) {
            continue;
          }

          // Update static constants
          statics.DOMDOC = domDoc[i];
          statics.XMLHTTP = httpReq[i];

          // Stop loop here
          break;
        }
      }
    }
  });
  qx.xml.Document.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.Html": {
        "require": true
      },
      "qx.dom.Node": {},
      "qx.bom.Selection": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "html.selection": {
          "load": true,
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
       * Alexander Steitz (aback)
  
  ************************************************************************ */

  /**
   * Low-level Range API which is used together with the low-level Selection API.
   * This is especially useful whenever a developer want to work on text level,
   * e.g. for an editor.
   */
  qx.Bootstrap.define("qx.bom.Range", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Returns the range object of the given node.
       *
       * @signature function(node)
       * @param node {Node} node to get the range of
       * @return {Range} valid range of given selection
       */
      get: qx.core.Environment.select("html.selection", {
        selection(node) {
          // check for the type of the given node
          // for legacy IE the nodes input, textarea, button and body
          // have access to own TextRange objects. Everything else is
          // gathered via the selection object.
          if (qx.dom.Node.isElement(node)) {
            switch (node.nodeName.toLowerCase()) {
              case "input":
                switch (node.type) {
                  case "text":
                  case "password":
                  case "hidden":
                  case "button":
                  case "reset":
                  case "file":
                  case "submit":
                    return node.createTextRange();
                  default:
                    return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).createRange();
                }
              case "textarea":
              case "body":
              case "button":
                return node.createTextRange();
              default:
                return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).createRange();
            }
          } else {
            if (node == null) {
              node = window;
            }

            // need to pass the document node to work with multi-documents
            return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).createRange();
          }
        },
        // suitable for gecko, opera and webkit
        default(node) {
          var doc = qx.dom.Node.getDocument(node);

          // get the selection object of the corresponding document
          var sel = qx.bom.Selection.getSelectionObject(doc);
          if (sel.rangeCount > 0) {
            return sel.getRangeAt(0);
          } else {
            return doc.createRange();
          }
        }
      })
    }
  });
  qx.bom.Range.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Adrian Olaru (adrianolaru)
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * Cross-Browser Split
       http://blog.stevenlevithan.com/archives/cross-browser-split
       Version 1.0.1
  
       Copyright:
         (c) 2006-2007, Steven Levithan <http://stevenlevithan.com>
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
       Authors:
         * Steven Levithan
  
  ************************************************************************ */

  /**
   * Implements an ECMA-compliant, uniform cross-browser split method
   */
  qx.Bootstrap.define("qx.util.StringSplit", {
    statics: {
      /**
       * ECMA-compliant, uniform cross-browser split method
       *
       * @param str {String} Incoming string to split
       * @param separator {RegExp} Specifies the character to use for separating the string.
       *   The separator is treated as a string or a  regular expression. If separator is
       *   omitted, the array returned contains one element consisting of the entire string.
       * @param limit {Integer?} Integer specifying a limit on the number of splits to be found.
       * @return {String[]} split string
       */
      split(str, separator, limit) {
        // if `separator` is not a regex, use the native `split`
        if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
          return String.prototype.split.call(str, separator, limit);
        }
        var output = [],
          lastLastIndex = 0,
          flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.sticky ? "y" : ""),
          separator = RegExp(separator.source, flags + "g"),
          // make `global` and avoid `lastIndex` issues by working with a copy
          separator2,
          match,
          lastIndex,
          lastLength,
          compliantExecNpcg = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group

        str = str + ""; // type conversion

        if (!compliantExecNpcg) {
          separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
        }

        /* behavior for `limit`: if it's...
        - `undefined`: no limit.
        - `NaN` or zero: return an empty array.
        - a positive number: use `Math.floor(limit)`.
        - a negative number: no limit.
        - other: type-convert, then use the above rules. */
        if (limit === undefined || +limit < 0) {
          limit = Infinity;
        } else {
          limit = Math.floor(+limit);
          if (!limit) {
            return [];
          }
        }
        while (match = separator.exec(str)) {
          lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser

          if (lastIndex > lastLastIndex) {
            output.push(str.slice(lastLastIndex, match.index));

            // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
            if (!compliantExecNpcg && match.length > 1) {
              match[0].replace(separator2, function () {
                for (var i = 1; i < arguments.length - 2; i++) {
                  if (arguments[i] === undefined) {
                    match[i] = undefined;
                  }
                }
              });
            }
            if (match.length > 1 && match.index < str.length) {
              Array.prototype.push.apply(output, match.slice(1));
            }
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= limit) {
              break;
            }
          }
          if (separator.lastIndex === match.index) {
            separator.lastIndex++; // avoid an infinite loop
          }
        }
        if (lastLastIndex === str.length) {
          if (lastLength || !separator.test("")) {
            output.push("");
          }
        } else {
          output.push(str.slice(lastLastIndex));
        }
        return output.length > limit ? output.slice(0, limit) : output;
      }
    }
  });
  qx.util.StringSplit.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Event": {
        "require": true
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
   * Common base class for all focus events.
   */
  qx.Class.define("qx.event.type.Focus", {
    extend: qx.event.type.Event,
    members: {
      /**
       * Initialize the fields of the event. The event must be initialized before
       * it can be dispatched.
       *
       * @param target {Object} Any possible event target
       * @param relatedTarget {Object} Any possible event target
       * @param canBubble {Boolean?false} Whether or not the event is a bubbling event.
       *     If the event is bubbling, the bubbling can be stopped using
       *     {@link qx.event.type.Event#stopPropagation}
       * @return {qx.event.type.Event} The initialized event instance
       */
      init(target, relatedTarget, canBubble) {
        qx.event.type.Focus.superclass.prototype.init.call(this, canBubble, false);
        this._target = target;
        this._relatedTarget = relatedTarget;
        return this;
      }
    }
  });
  qx.event.type.Focus.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Event": {
        "require": true
      },
      "qx.dom.Node": {},
      "qx.bom.Viewport": {},
      "qx.event.Registration": {},
      "qx.event.handler.DragDrop": {}
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
   * Event object class for drag events
   */
  qx.Class.define("qx.event.type.Drag", {
    extend: qx.event.type.Event,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Initialize the fields of the event. The event must be initialized before
       * it can be dispatched.
       *
       * @param cancelable {Boolean?false} Whether or not an event can have its default
       *     action prevented. The default action can either be the browser's
       *     default action of a native event (e.g. open the context menu on a
       *     right click) or the default action of a qooxdoo class (e.g. close
       *     the window widget). The default action can be prevented by calling
       *     {@link qx.event.type.Event#preventDefault}
       * @param originalEvent {qx.event.type.Track} The original (mouse) event to use
       * @return {qx.event.type.Event} The initialized event instance
       */
      init(cancelable, originalEvent) {
        qx.event.type.Drag.superclass.prototype.init.call(this, true, cancelable);
        if (originalEvent) {
          this._native = originalEvent.getNativeEvent() || null;
          this._originalTarget = originalEvent.getOriginalTarget() || null;
        } else {
          this._native = null;
          this._originalTarget = null;
        }
        return this;
      },
      // overridden
      clone(embryo) {
        var clone = qx.event.type.Drag.superclass.prototype.clone.call(this, embryo);
        clone._native = this._native;
        return clone;
      },
      /**
       * Get the horizontal position at which the event occurred relative to the
       * left of the document. This property takes into account any scrolling of
       * the page.
       *
       * @return {Integer} The horizontal mouse position in the document.
       */
      getDocumentLeft() {
        if (this._native == null) {
          return 0;
        }
        var x = this._native.pageX;
        if (x !== undefined) {
          // iOS 6 does not copy pageX over to the fake pointer event
          if (x == 0 && this._native.pointerType == "touch") {
            x = this._native._original.changedTouches[0].pageX || 0;
          }
          return Math.round(x);
        } else {
          var win = qx.dom.Node.getWindow(this._native.srcElement);
          return Math.round(this._native.clientX) + qx.bom.Viewport.getScrollLeft(win);
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
        if (this._native == null) {
          return 0;
        }
        var y = this._native.pageY;
        if (y !== undefined) {
          // iOS 6 does not copy pageY over to the fake pointer event
          if (y == 0 && this._native.pointerType == "touch") {
            y = this._native._original.changedTouches[0].pageY || 0;
          }
          return Math.round(y);
        } else {
          var win = qx.dom.Node.getWindow(this._native.srcElement);
          return Math.round(this._native.clientY) + qx.bom.Viewport.getScrollTop(win);
        }
      },
      /**
       * Returns the drag&drop event handler responsible for the target
       *
       * @return {qx.event.handler.DragDrop} The drag&drop handler
       */
      getManager() {
        return qx.event.Registration.getManager(this.getTarget()).getHandler(qx.event.handler.DragDrop);
      },
      /**
       * Used during <code>dragstart</code> listener to
       * inform the manager about supported data types.
       *
       * @param type {String} Data type to add to list of supported types
       */
      addType(type) {
        this.getManager().addType(type);
      },
      /**
       * Used during <code>dragstart</code> listener to
       * inform the manager about supported drop actions.
       *
       * @param action {String} Action to add to the list of supported actions
       */
      addAction(action) {
        this.getManager().addAction(action);
      },
      /**
       * Whether the given type is supported by the drag
       * target (source target).
       *
       * This is used in the event listeners for <code>dragover</code>
       * or <code>dragdrop</code>.
       *
       * @param type {String} The type to look for
       * @return {Boolean} Whether the given type is supported
       */
      supportsType(type) {
        return this.getManager().supportsType(type);
      },
      /**
       * Whether the given action is supported by the drag
       * target (source target).
       *
       * This is used in the event listeners for <code>dragover</code>
       * or <code>dragdrop</code>.
       *
       * @param action {String} The action to look for
       * @return {Boolean} Whether the given action is supported
       */
      supportsAction(action) {
        return this.getManager().supportsAction(action);
      },
      /**
       * Adds data of the given type to the internal storage. The data
       * is available until the <code>dragend</code> event is fired.
       *
       * @param type {String} Any valid type
       * @param data {var} Any data to store
       */
      addData(type, data) {
        this.getManager().addData(type, data);
      },
      /**
       * Returns the data of the given type. Used in the <code>drop</code> listener.
       *
       * Note that this is a synchronous method and if any of the drag and drop
       * events handlers are implemented using Promises, this may fail; @see
       * `getDataAsync`.
       *
       * @param type {String} Any of the supported types.
       * @return {var} The data for the given type
       */
      getData(type) {
        return this.getManager().getData(type);
      },
      /**
       * Returns the data of the given type. Used in the <code>drop</code> listener.
       *
       * @param type {String} Any of the supported types.
       * @return {qx.Promise|var} The data for the given type
       */
      getDataAsync(type) {
        return this.getManager().getDataAsync(type);
      },
      /**
       * Returns the type which was requested last, to be used
       * in the <code>droprequest</code> listener.
       *
       * @return {String} The last requested data type
       */
      getCurrentType() {
        return this.getManager().getCurrentType();
      },
      /**
       * Returns the currently selected action. Depends on the
       * supported actions of the source target and the modification
       * keys pressed by the user.
       *
       * Used in the <code>droprequest</code> listener.
       *
       * @return {String} The action. May be one of <code>move</code>,
       *    <code>copy</code> or <code>alias</code>.
       */
      getCurrentAction() {
        if (this.getDefaultPrevented()) {
          return null;
        }
        return this.getManager().getCurrentAction();
      },
      /**
       * Returns the currently selected action. Depends on the
       * supported actions of the source target and the modification
       * keys pressed by the user.
       *
       * Used in the <code>droprequest</code> listener.
       *
       * @return {qx.Promise|String} The action. May be one of <code>move</code>,
       *    <code>copy</code> or <code>alias</code>.
       */
      getCurrentActionAsync() {
        if (this.getDefaultPrevented()) {
          return null;
        }
        return this.getManager().getCurrentActionAsync();
      },
      /**
       * Whether the current drop target allows the current drag target.
       *
       * This can be called from within the "drag" event to enable/disable
       * a drop target selectively, for example based on the child item,
       * above and beyond the one-time choice made by the the "dragover"
       * event for the droppable widget itself.
       *
       * @param isAllowed {Boolean} False if a drop should be disallowed
       */
      setDropAllowed(isAllowed) {
        this.getManager().setDropAllowed(isAllowed);
      },
      /**
       * Returns the target which has been initially tapped on.
       * @return {qx.ui.core.Widget} The tapped widget.
       */
      getDragTarget() {
        return this.getManager().getDragTarget();
      },
      /**
       * Stops the drag&drop session and fires a <code>dragend</code> event.
       */
      stopSession() {
        this.getManager().clearSession();
      }
    }
  });
  qx.event.type.Drag.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "require": true
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
  
  ************************************************************************ */

  /**
   * This widget draws a separator line between two instances of
   * {@link qx.ui.menu.AbstractButton} and is inserted into the
   * {@link qx.ui.menu.Menu}.
   *
   * For convenience reasons there is also
   * a method {@link qx.ui.menu.Menu#addSeparator} to append instances
   * of this class to the menu.
   */
  qx.Class.define("qx.ui.menu.Separator", {
    extend: qx.ui.core.Widget,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "menu-separator"
      },
      // overridden
      anonymous: {
        refine: true,
        init: true
      }
    }
  });
  qx.ui.menu.Separator.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "construct": true,
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
      "qx.event.Registration": {
        "construct": true
      },
      "qx.bom.client.Event": {
        "construct": true,
        "require": true
      },
      "qx.bom.Element": {
        "construct": true
      },
      "qx.event.Timer": {
        "construct": true
      },
      "qx.ui.menu.Menu": {},
      "qx.ui.menu.AbstractButton": {},
      "qx.lang.Array": {},
      "qx.ui.core.Widget": {},
      "qx.ui.menubar.Button": {},
      "qx.ui.menu.Button": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "event.touch": {
          "construct": true,
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * This singleton manages visible menu instances and supports some
   * core features to schedule menu open/close with timeout support.
   *
   * It also manages the whole keyboard support for the currently
   * registered widgets.
   *
   * The zIndex order is also managed by this class.
   */
  qx.Class.define("qx.ui.menu.Manager", {
    type: "singleton",
    extend: qx.core.Object,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.core.Object.constructor.call(this);

      // Create data structure
      this.__objects__P_112_0 = [];
      var el = document.body;
      var Registration = qx.event.Registration;

      // React on pointer/mouse events, but on native, to support inline applications
      Registration.addListener(window.document.documentElement, "pointerdown", this._onPointerDown, this, true);
      Registration.addListener(el, "roll", this._onRoll, this, true);

      // React on keypress events
      Registration.addListener(el, "keydown", this._onKeyUpDown, this, true);
      Registration.addListener(el, "keyup", this._onKeyUpDown, this, true);
      Registration.addListener(el, "keypress", this._onKeyPress, this, true);

      // only use the blur event to hide windows on non touch devices [BUG #4033]
      // When the menu is located on top of an iFrame, the select will fail
      if (!qx.core.Environment.get("event.touch")) {
        // Hide all when the window is blurred
        qx.bom.Element.addListener(window, "blur", this.hideAll, this);
      }

      // Create open timer
      this.__openTimer__P_112_1 = new qx.event.Timer();
      this.__openTimer__P_112_1.addListener("interval", this._onOpenInterval, this);

      // Create close timer
      this.__closeTimer__P_112_2 = new qx.event.Timer();
      this.__closeTimer__P_112_2.addListener("interval", this._onCloseInterval, this);
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */

    members: {
      __scheduleOpen__P_112_3: null,
      __scheduleClose__P_112_4: null,
      __openTimer__P_112_1: null,
      __closeTimer__P_112_2: null,
      __objects__P_112_0: null,
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Query engine for menu children.
       *
       * @param menu {qx.ui.menu.Menu} Any menu instance
       * @param start {Integer} Child index to start with
       * @param iter {Integer} Iteration count, normally <code>+1</code> or <code>-1</code>
       * @param loop {Boolean?false} Whether to wrap when reaching the begin/end of the list
       * @return {qx.ui.menu.Button} Any menu button or <code>null</code>
       */
      _getChild(menu, start, iter, loop) {
        var children = menu.getChildren();
        var length = children.length;
        var child;
        for (var i = start; i < length && i >= 0; i += iter) {
          child = children[i];
          if (child.isEnabled() && !child.isAnonymous() && child.isVisible()) {
            return child;
          }
        }
        if (loop) {
          i = i == length ? 0 : length - 1;
          for (; i != start; i += iter) {
            child = children[i];
            if (child.isEnabled() && !child.isAnonymous() && child.isVisible()) {
              return child;
            }
          }
        }
        return null;
      },
      /**
       * Whether the given widget is inside any Menu instance.
       *
       * @param widget {qx.ui.core.Widget} Any widget
       * @return {Boolean} <code>true</code> when the widget is part of any menu
       */
      _isInMenu(widget) {
        while (widget) {
          if (widget instanceof qx.ui.menu.Menu) {
            return true;
          }
          widget = widget.getLayoutParent();
        }
        return false;
      },
      /**
       * Whether the given widget is one of the menu openers.
       *
       * @param widget {qx.ui.core.Widget} Any widget
       * @return {Boolean} <code>true</code> if the widget is a menu opener
       */
      _isMenuOpener(widget) {
        var menus = this.__objects__P_112_0;
        for (var i = 0; i < menus.length; i++) {
          if (menus[i].getOpener() === widget) {
            return true;
          }
        }
        return false;
      },
      /**
       * Returns an instance of a menu button if the given widget is a child
       *
       * @param widget {qx.ui.core.Widget} any widget
       * @return {qx.ui.menu.Button} Any menu button instance or <code>null</code>
       */
      _getMenuButton(widget) {
        while (widget) {
          if (widget instanceof qx.ui.menu.AbstractButton) {
            return widget;
          }
          widget = widget.getLayoutParent();
        }
        return null;
      },
      /*
      ---------------------------------------------------------------------------
        PUBLIC METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Adds a menu to the list of visible menus.
       *
       * @param obj {qx.ui.menu.Menu} Any menu instance.
       */
      add(obj) {
        {
          if (!(obj instanceof qx.ui.menu.Menu)) {
            throw new Error("Object is no menu: " + obj);
          }
        }
        var reg = this.__objects__P_112_0;
        reg.push(obj);
        obj.setZIndex(1e6 + reg.length);
      },
      /**
       * Remove a menu from the list of visible menus.
       *
       * @param obj {qx.ui.menu.Menu} Any menu instance.
       */
      remove(obj) {
        {
          if (!(obj instanceof qx.ui.menu.Menu)) {
            throw new Error("Object is no menu: " + obj);
          }
        }
        var reg = this.__objects__P_112_0;
        if (reg) {
          qx.lang.Array.remove(reg, obj);
        }
      },
      /**
       * Hides all currently opened menus.
       */
      hideAll() {
        var reg = this.__objects__P_112_0;
        if (reg) {
          for (var i = reg.length - 1; i >= 0; i--) {
            reg[i].exclude();
          }
        }
      },
      /**
       * Returns the menu which was opened at last (which
       * is the active one this way)
       *
       * @return {qx.ui.menu.Menu} The current active menu or <code>null</code>
       */
      getActiveMenu() {
        var reg = this.__objects__P_112_0;
        return reg.length > 0 ? reg[reg.length - 1] : null;
      },
      /*
      ---------------------------------------------------------------------------
        SCHEDULED OPEN/CLOSE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Schedules the given menu to be opened after the
       * {@link qx.ui.menu.Menu#openInterval} configured by the
       * menu instance itself.
       *
       * @param menu {qx.ui.menu.Menu} The menu to schedule for open
       */
      scheduleOpen(menu) {
        // Cancel close of given menu first
        this.cancelClose(menu);

        // When the menu is already visible
        if (menu.isVisible()) {
          // Cancel all other open requests
          if (this.__scheduleOpen__P_112_3) {
            this.cancelOpen(this.__scheduleOpen__P_112_3);
          }
        }

        // When the menu is not visible and not scheduled already
        // then schedule it for opening
        else if (this.__scheduleOpen__P_112_3 != menu) {
          // menu.debug("Schedule open");
          this.__scheduleOpen__P_112_3 = menu;
          this.__openTimer__P_112_1.restartWith(menu.getOpenInterval());
        }
      },
      /**
       * Schedules the given menu to be closed after the
       * {@link qx.ui.menu.Menu#closeInterval} configured by the
       * menu instance itself.
       *
       * @param menu {qx.ui.menu.Menu} The menu to schedule for close
       */
      scheduleClose(menu) {
        // Cancel open of the menu first
        this.cancelOpen(menu);

        // When the menu is already invisible
        if (!menu.isVisible()) {
          // Cancel all other close requests
          if (this.__scheduleClose__P_112_4) {
            this.cancelClose(this.__scheduleClose__P_112_4);
          }
        }

        // When the menu is visible and not scheduled already
        // then schedule it for closing
        else if (this.__scheduleClose__P_112_4 != menu) {
          // menu.debug("Schedule close");
          this.__scheduleClose__P_112_4 = menu;
          this.__closeTimer__P_112_2.restartWith(menu.getCloseInterval());
        }
      },
      /**
       * When the given menu is scheduled for open this pending
       * request is canceled.
       *
       * @param menu {qx.ui.menu.Menu} The menu to cancel for open
       */
      cancelOpen(menu) {
        if (this.__scheduleOpen__P_112_3 == menu) {
          // menu.debug("Cancel open");
          this.__openTimer__P_112_1.stop();
          this.__scheduleOpen__P_112_3 = null;
        }
      },
      /**
       * When the given menu is scheduled for close this pending
       * request is canceled.
       *
       * @param menu {qx.ui.menu.Menu} The menu to cancel for close
       */
      cancelClose(menu) {
        if (this.__scheduleClose__P_112_4 == menu) {
          // menu.debug("Cancel close");
          this.__closeTimer__P_112_2.stop();
          this.__scheduleClose__P_112_4 = null;
        }
      },
      /*
      ---------------------------------------------------------------------------
        TIMER EVENT HANDLERS
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for a pending open request. Configured to the interval
       * of the current menu to open.
       *
       * @param e {qx.event.type.Event} Interval event
       */
      _onOpenInterval(e) {
        // Stop timer
        this.__openTimer__P_112_1.stop();

        // Open menu and reset flag
        this.__scheduleOpen__P_112_3.open();
        this.__scheduleOpen__P_112_3 = null;
      },
      /**
       * Event listener for a pending close request. Configured to the interval
       * of the current menu to close.
       *
       * @param e {qx.event.type.Event} Interval event
       */
      _onCloseInterval(e) {
        // Stop timer, reset scheduling flag
        this.__closeTimer__P_112_2.stop();

        // Close menu and reset flag
        this.__scheduleClose__P_112_4.exclude();
        this.__scheduleClose__P_112_4 = null;
      },
      /*
      ---------------------------------------------------------------------------
        CONTEXTMENU EVENT HANDLING
      ---------------------------------------------------------------------------
      */

      /**
       * Internal function registers a handler to stop next
       * <code>contextmenu</code> event.
       * This function will be called by {@link qx.ui.menu.Button#_onTap}, if
       * right click was pressed.
       *
       * @internal
       */
      preventContextMenuOnce() {
        qx.event.Registration.addListener(document.body, "contextmenu", this.__onPreventContextMenu__P_112_5, this, true);
      },
      /**
       * Internal event handler to stop <code>contextmenu</code> event bubbling,
       * if target is inside the opened menu.
       *
       * @param e {qx.event.type.Mouse} contextmenu event
       *
       * @internal
       */
      __onPreventContextMenu__P_112_5(e) {
        var target = e.getTarget();
        target = qx.ui.core.Widget.getWidgetByElement(target, true);
        if (this._isInMenu(target)) {
          e.stopPropagation();
          e.preventDefault();
        }

        // stop only once
        qx.event.Registration.removeListener(document.body, "contextmenu", this.__onPreventContextMenu__P_112_5, this, true);
      },
      /*
      ---------------------------------------------------------------------------
        POINTER EVENT HANDLERS
      ---------------------------------------------------------------------------
      */

      /**
       * Event handler for pointerdown events
       *
       * @param e {qx.event.type.Pointer} pointerdown event
       */
      _onPointerDown(e) {
        var target = e.getTarget();
        target = qx.ui.core.Widget.getWidgetByElement(target, true);

        // If the target is 'null' the tap appears on a DOM element witch is not
        // a widget. This happens normally with an inline application, when the user
        // taps not in the inline application. In this case all all currently
        // open menus should be closed.
        if (target == null) {
          this.hideAll();
          return;
        }

        // If the target is the one which has opened the current menu
        // we ignore the pointerdown to let the button process the event
        // further with toggling or ignoring the tap.
        if (target.getMenu && target.getMenu() && target.getMenu().isVisible()) {
          return;
        }

        // All taps not inside a menu will hide all currently open menus
        if (this.__objects__P_112_0.length > 0 && !this._isInMenu(target)) {
          this.hideAll();
        }
      },
      /*
      ---------------------------------------------------------------------------
        KEY EVENT HANDLING
      ---------------------------------------------------------------------------
      */

      /**
       * @type {Map} Map of all keys working on an active menu selection
       * @lint ignoreReferenceField(__selectionKeys)
       */
      __selectionKeys__P_112_6: {
        Enter: 1,
        Space: 1
      },
      /**
       * @type {Map} Map of all keys working without a selection
       * @lint ignoreReferenceField(__navigationKeys)
       */
      __navigationKeys__P_112_7: {
        Tab: 1,
        Escape: 1,
        Up: 1,
        Down: 1,
        Left: 1,
        Right: 1
      },
      /**
       * Event handler for all keyup/keydown events. Stops all events
       * when any menu is opened.
       *
       * @param e {qx.event.type.KeySequence} Keyboard event
       */
      _onKeyUpDown(e) {
        var menu = this.getActiveMenu();
        if (!menu) {
          return;
        }

        // Stop for all supported key combos
        var iden = e.getKeyIdentifier();
        if (this.__navigationKeys__P_112_7[iden] || this.__selectionKeys__P_112_6[iden] && menu.getSelectedButton()) {
          e.stopPropagation();
        }
      },
      /**
       * Event handler for all keypress events. Delegates the event to the more
       * specific methods defined in this class.
       *
       * Currently processes the keys: <code>Up</code>, <code>Down</code>,
       * <code>Left</code>, <code>Right</code> and <code>Enter</code>.
       *
       * @param e {qx.event.type.KeySequence} Keyboard event
       */
      _onKeyPress(e) {
        var menu = this.getActiveMenu();
        if (!menu) {
          return;
        }
        var iden = e.getKeyIdentifier();
        var navigation = this.__navigationKeys__P_112_7[iden];
        var selection = this.__selectionKeys__P_112_6[iden];
        if (navigation) {
          switch (iden) {
            case "Up":
              this._onKeyPressUp(menu);
              break;
            case "Down":
              this._onKeyPressDown(menu);
              break;
            case "Left":
              this._onKeyPressLeft(menu);
              break;
            case "Right":
              this._onKeyPressRight(menu);
              break;
            case "Tab":
            case "Escape":
              this.hideAll();
              break;
          }
          e.stopPropagation();
          e.preventDefault();
        } else if (selection) {
          // Do not process these events when no item is hovered
          var button = menu.getSelectedButton();
          if (button) {
            switch (iden) {
              case "Enter":
                this._onKeyPressEnter(menu, button, e);
                break;
              case "Space":
                this._onKeyPressSpace(menu, button, e);
                break;
            }
            e.stopPropagation();
            e.preventDefault();
          }
        }
      },
      /**
       * Event handler for <code>Up</code> key
       *
       * @param menu {qx.ui.menu.Menu} The active menu
       */
      _onKeyPressUp(menu) {
        // Query for previous child
        var selectedButton = menu.getSelectedButton();
        var children = menu.getChildren();
        var start = selectedButton ? menu.indexOf(selectedButton) - 1 : children.length - 1;
        var nextItem = this._getChild(menu, start, -1, true);

        // Reconfigure property
        if (nextItem) {
          menu.setSelectedButton(nextItem);
        } else {
          menu.resetSelectedButton();
        }
      },
      /**
       * Event handler for <code>Down</code> key
       *
       * @param menu {qx.ui.menu.Menu} The active menu
       */
      _onKeyPressDown(menu) {
        // Query for next child
        var selectedButton = menu.getSelectedButton();
        var start = selectedButton ? menu.indexOf(selectedButton) + 1 : 0;
        var nextItem = this._getChild(menu, start, 1, true);

        // Reconfigure property
        if (nextItem) {
          menu.setSelectedButton(nextItem);
        } else {
          menu.resetSelectedButton();
        }
      },
      /**
       * Event handler for <code>Left</code> key
       *
       * @param menu {qx.ui.menu.Menu} The active menu
       */
      _onKeyPressLeft(menu) {
        var menuOpener = menu.getOpener();
        if (!menuOpener) {
          return;
        }

        // Back to the "parent" menu
        if (menuOpener instanceof qx.ui.menu.AbstractButton) {
          var parentMenu = menuOpener.getLayoutParent();
          parentMenu.resetOpenedButton();
          parentMenu.setSelectedButton(menuOpener);
        }

        // Goto the previous toolbar button
        else if (menuOpener instanceof qx.ui.menubar.Button) {
          var buttons = menuOpener.getMenuBar().getMenuButtons();
          var index = buttons.indexOf(menuOpener);

          // This should not happen, definitely!
          if (index === -1) {
            return;
          }

          // Get previous button, fallback to end if first arrived
          var prevButton = null;
          var length = buttons.length;
          for (var i = 1; i <= length; i++) {
            var button = buttons[(index - i + length) % length];
            if (button.isEnabled() && button.isVisible()) {
              prevButton = button;
              break;
            }
          }
          if (prevButton && prevButton != menuOpener) {
            prevButton.open(true);
          }
        }
      },
      /**
       * Event handler for <code>Right</code> key
       *
       * @param menu {qx.ui.menu.Menu} The active menu
       */
      _onKeyPressRight(menu) {
        var selectedButton = menu.getSelectedButton();

        // Open sub-menu of hovered item and select first child
        if (selectedButton) {
          var subMenu = selectedButton.getMenu();
          if (subMenu) {
            // Open previously hovered item
            menu.setOpenedButton(selectedButton);

            // Hover first item in new submenu
            var first = this._getChild(subMenu, 0, 1);
            if (first) {
              subMenu.setSelectedButton(first);
            }
            return;
          }
        }

        // No hover and no open item
        // When first button has a menu, open it, otherwise only hover it
        else if (!menu.getOpenedButton()) {
          var first = this._getChild(menu, 0, 1);
          if (first) {
            menu.setSelectedButton(first);
            if (first.getMenu()) {
              menu.setOpenedButton(first);
            }
            return;
          }
        }

        // Jump to the next toolbar button
        var menuOpener = menu.getOpener();

        // Look up opener hierarchy for menu button
        if (menuOpener instanceof qx.ui.menu.Button && selectedButton) {
          // From one inner selected button try to find the top level
          // menu button which has opened the whole menu chain.
          while (menuOpener) {
            menuOpener = menuOpener.getLayoutParent();
            if (menuOpener instanceof qx.ui.menu.Menu) {
              menuOpener = menuOpener.getOpener();
              if (menuOpener instanceof qx.ui.menubar.Button) {
                break;
              }
            } else {
              break;
            }
          }
          if (!menuOpener) {
            return;
          }
        }

        // Ask the toolbar for the next menu button
        if (menuOpener instanceof qx.ui.menubar.Button) {
          var buttons = menuOpener.getMenuBar().getMenuButtons();
          var index = buttons.indexOf(menuOpener);

          // This should not happen, definitely!
          if (index === -1) {
            return;
          }

          // Get next button, fallback to first if end arrived
          var nextButton = null;
          var length = buttons.length;
          for (var i = 1; i <= length; i++) {
            var button = buttons[(index + i) % length];
            if (button.isEnabled() && button.isVisible()) {
              nextButton = button;
              break;
            }
          }
          if (nextButton && nextButton != menuOpener) {
            nextButton.open(true);
          }
        }
      },
      /**
       * Event handler for <code>Enter</code> key
       *
       * @param menu {qx.ui.menu.Menu} The active menu
       * @param button {qx.ui.menu.AbstractButton} The selected button
       * @param e {qx.event.type.KeySequence} The keypress event
       */
      _onKeyPressEnter(menu, button, e) {
        // Route keypress event to the selected button
        if (button.hasListener("keypress")) {
          // Clone and reconfigure event
          var clone = e.clone();
          clone.setBubbles(false);
          clone.setTarget(button);

          // Finally dispatch the clone
          button.dispatchEvent(clone);
        }

        // Hide all open menus
        this.hideAll();
      },
      /**
       * Event handler for <code>Space</code> key
       *
       * @param menu {qx.ui.menu.Menu} The active menu
       * @param button {qx.ui.menu.AbstractButton} The selected button
       * @param e {qx.event.type.KeySequence} The keypress event
       */
      _onKeyPressSpace(menu, button, e) {
        // Route keypress event to the selected button
        if (button.hasListener("keypress")) {
          // Clone and reconfigure event
          var clone = e.clone();
          clone.setBubbles(false);
          clone.setTarget(button);

          // Finally dispatch the clone
          button.dispatchEvent(clone);
        }
      },
      /**
       * Event handler for roll which hides all windows on scroll.
       *
       * @param e {qx.event.type.Roll} The roll event.
       */
      _onRoll(e) {
        var target = e.getTarget();
        target = qx.ui.core.Widget.getWidgetByElement(target, true);
        if (this.__objects__P_112_0.length > 0 && !this._isInMenu(target) && !this._isMenuOpener(target) && !e.getMomentum()) {
          this.hideAll();
        }
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      var Registration = qx.event.Registration;
      var el = document.body;

      // React on pointerdown events
      Registration.removeListener(window.document.documentElement, "pointerdown", this._onPointerDown, this, true);

      // React on keypress events
      Registration.removeListener(el, "keydown", this._onKeyUpDown, this, true);
      Registration.removeListener(el, "keyup", this._onKeyUpDown, this, true);
      Registration.removeListener(el, "keypress", this._onKeyPress, this, true);
      this._disposeObjects("__openTimer__P_112_1", "__closeTimer__P_112_2");
      this._disposeArray("__objects__P_112_0");
    }
  });
  qx.ui.menu.Manager.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This mixin redirects the layout manager to a child widget of the
   * including class. This is e.g. used in {@link qx.ui.window.Window} to configure
   * the layout manager of the window pane instead of the window directly.
   *
   * The including class must implement the method <code>getChildrenContainer</code>,
   * which has to return the widget, to which the layout should be set.
   */

  qx.Mixin.define("qx.ui.core.MRemoteLayoutHandling", {
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Set a layout manager for the widget. A a layout manager can only be connected
       * with one widget. Reset the connection with a previous widget first, if you
       * like to use it in another widget instead.
       *
       * @param layout {qx.ui.layout.Abstract} The new layout or
       *     <code>null</code> to reset the layout.
       */
      setLayout(layout) {
        var container = this.getChildrenContainer();
        if (container === this) {
          container._setLayout(layout);
        } else {
          container.setLayout(layout);
        }
      },
      /**
       * Get the widget's layout manager.
       *
       * @return {qx.ui.layout.Abstract} The widget's layout manager
       */
      getLayout() {
        var container = this.getChildrenContainer();
        if (container === this) {
          return container._getLayout();
        }
        return container.getLayout();
      }
    }
  });
  qx.ui.core.MRemoteLayoutHandling.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.MRemoteChildrenHandling": {
        "require": true
      },
      "qx.ui.core.MRemoteLayoutHandling": {
        "require": true
      },
      "qx.ui.form.RepeatButton": {},
      "qx.ui.container.Composite": {},
      "qx.ui.core.scroll.ScrollPane": {},
      "qx.ui.layout.HBox": {},
      "qx.ui.layout.VBox": {}
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
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * Container, which provides scrolling in one dimension (vertical or horizontal).
   *
   * @childControl button-forward {qx.ui.form.RepeatButton} button to step forward
   * @childControl button-backward {qx.ui.form.RepeatButton} button to step backward
   * @childControl content {qx.ui.container.Composite} container to hold the content
   * @childControl scrollpane {qx.ui.core.scroll.ScrollPane} the scroll pane holds the content to enable scrolling
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   // create slide bar container
   *   slideBar = new qx.ui.container.SlideBar().set({
   *     width: 300
   *   });
   *
   *   // set layout
   *   slideBar.setLayout(new qx.ui.layout.HBox());
   *
   *   // add some widgets
   *   for (var i=0; i<10; i++)
   *   {
   *     slideBar.add((new qx.ui.core.Widget()).set({
   *       backgroundColor : (i % 2 == 0) ? "red" : "blue",
   *       width : 60
   *     }));
   *   }
   *
   *   this.getRoot().add(slideBar);
   * </pre>
   *
   * This example creates a SlideBar and add some widgets with alternating
   * background colors. Since the content is larger than the container, two
   * scroll buttons at the left and the right edge are shown.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/slidebar.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.container.SlideBar", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MRemoteChildrenHandling, qx.ui.core.MRemoteLayoutHandling],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param orientation {String?"horizontal"} The slide bar orientation
     */
    construct(orientation) {
      qx.ui.core.Widget.constructor.call(this);
      var scrollPane = this.getChildControl("scrollpane");
      this._add(scrollPane, {
        flex: 1
      });
      if (orientation != null) {
        this.setOrientation(orientation);
      } else {
        this.initOrientation();
      }
      this.addListener("roll", this._onRoll, this);
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "slidebar"
      },
      /** Orientation of the bar */
      orientation: {
        check: ["horizontal", "vertical"],
        init: "horizontal",
        apply: "_applyOrientation"
      },
      /** The number of pixels to scroll if the buttons are pressed */
      scrollStep: {
        check: "Integer",
        init: 15,
        themeable: true
      }
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired on scroll animation end invoked by 'scroll*' methods. */
      scrollAnimationEnd: "qx.event.type.Event"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      getChildrenContainer() {
        return this.getChildControl("content");
      },
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "button-forward":
            control = new qx.ui.form.RepeatButton();
            control.addListener("execute", this._onExecuteForward, this);
            control.setFocusable(false);
            this._addAt(control, 2);
            break;
          case "button-backward":
            control = new qx.ui.form.RepeatButton();
            control.addListener("execute", this._onExecuteBackward, this);
            control.setFocusable(false);
            this._addAt(control, 0);
            break;
          case "content":
            control = new qx.ui.container.Composite();
            this.getChildControl("scrollpane").add(control);
            break;
          case "scrollpane":
            control = new qx.ui.core.scroll.ScrollPane();
            control.addListener("update", this._onResize, this);
            control.addListener("scrollX", this._onScroll, this);
            control.addListener("scrollY", this._onScroll, this);
            control.addListener("scrollAnimationEnd", this._onScrollAnimationEnd, this);
            break;
        }
        return control || qx.ui.container.SlideBar.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        barLeft: true,
        barTop: true,
        barRight: true,
        barBottom: true
      },
      /*
      ---------------------------------------------------------------------------
        PUBLIC SCROLL API
      ---------------------------------------------------------------------------
      */

      /**
       * Scrolls the element's content by the given amount.
       *
       * @param offset {Integer?0} Amount to scroll
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollBy(offset, duration) {
        var pane = this.getChildControl("scrollpane");
        if (this.getOrientation() === "horizontal") {
          pane.scrollByX(offset, duration);
        } else {
          pane.scrollByY(offset, duration);
        }
      },
      /**
       * Scrolls the element's content to the given coordinate
       *
       * @param value {Integer} The position to scroll to.
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollTo(value, duration) {
        var pane = this.getChildControl("scrollpane");
        if (this.getOrientation() === "horizontal") {
          pane.scrollToX(value, duration);
        } else {
          pane.scrollToY(value, duration);
        }
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */
      // overridden
      _applyEnabled(value, old, name) {
        qx.ui.container.SlideBar.superclass.prototype._applyEnabled.call(this, value, old, name);
        this._updateArrowsEnabled();
      },
      // property apply
      _applyOrientation(value, old) {
        // ARIA attrs
        this.getContentElement().setAttribute("aria-orientation", value);
        var oldLayouts = [this.getLayout(), this._getLayout()];
        var buttonForward = this.getChildControl("button-forward");
        var buttonBackward = this.getChildControl("button-backward");

        // old can also be null, so we have to check both explicitly to set
        // the states correctly.
        if (old == "vertical" && value == "horizontal") {
          buttonForward.removeState("vertical");
          buttonBackward.removeState("vertical");
          buttonForward.addState("horizontal");
          buttonBackward.addState("horizontal");
        } else if (old == "horizontal" && value == "vertical") {
          buttonForward.removeState("horizontal");
          buttonBackward.removeState("horizontal");
          buttonForward.addState("vertical");
          buttonBackward.addState("vertical");
        }
        if (value == "horizontal") {
          this._setLayout(new qx.ui.layout.HBox());
          this.setLayout(new qx.ui.layout.HBox());
        } else {
          this._setLayout(new qx.ui.layout.VBox());
          this.setLayout(new qx.ui.layout.VBox());
        }
        if (oldLayouts[0]) {
          oldLayouts[0].dispose();
        }
        if (oldLayouts[1]) {
          oldLayouts[1].dispose();
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Scrolls pane on roll events
       *
       * @param e {qx.event.type.Roll} the roll event
       */
      _onRoll(e) {
        // only wheel and touch
        if (e.getPointerType() == "mouse") {
          return;
        }
        var delta = 0;
        var pane = this.getChildControl("scrollpane");
        if (this.getOrientation() === "horizontal") {
          delta = e.getDelta().x;
          var position = pane.getScrollX();
          var max = pane.getScrollMaxX();
          var steps = parseInt(delta);

          // pass the event to the parent if both scrollbars are at the end
          if (!(steps < 0 && position <= 0 || steps > 0 && position >= max || delta == 0)) {
            e.stop();
          } else {
            e.stopMomentum();
          }
        } else {
          delta = e.getDelta().y;
          var position = pane.getScrollY();
          var max = pane.getScrollMaxY();
          var steps = parseInt(delta);

          // pass the event to the parent if both scrollbars are at the end
          if (!(steps < 0 && position <= 0 || steps > 0 && position >= max || delta == 0)) {
            e.stop();
          } else {
            e.stopMomentum();
          }
        }
        this.scrollBy(parseInt(delta, 10));

        // block all momentum scrolling
        if (e.getMomentum()) {
          e.stop();
        }
      },
      /**
       * Update arrow enabled state after scrolling
       */
      _onScroll() {
        this._updateArrowsEnabled();
      },
      /**
       * Handler to fire the 'scrollAnimationEnd' event.
       */
      _onScrollAnimationEnd() {
        this.fireEvent("scrollAnimationEnd");
      },
      /**
       * Listener for resize event. This event is fired after the
       * first flush of the element which leads to another queuing
       * when the changes modify the visibility of the scroll buttons.
       *
       * @param e {Event} Event object
       */
      _onResize(e) {
        var content = this.getChildControl("scrollpane").getChildren()[0];
        if (!content) {
          return;
        }
        var innerSize = this.getInnerSize();
        var contentSize = content.getBounds();
        var overflow = this.getOrientation() === "horizontal" ? contentSize.width > innerSize.width : contentSize.height > innerSize.height;
        if (overflow) {
          this._showArrows();
          this._updateArrowsEnabled();
        } else {
          this._hideArrows();
        }
      },
      /**
       * Scroll handler for left scrolling
       *
       */
      _onExecuteBackward() {
        this.scrollBy(-this.getScrollStep());
      },
      /**
       * Scroll handler for right scrolling
       *
       */
      _onExecuteForward() {
        this.scrollBy(this.getScrollStep());
      },
      /*
      ---------------------------------------------------------------------------
        UTILITIES
      ---------------------------------------------------------------------------
      */

      /**
       * Update arrow enabled state
       */
      _updateArrowsEnabled() {
        // set the disables state directly because we are overriding the
        // inheritance
        if (!this.getEnabled()) {
          this.getChildControl("button-backward").setEnabled(false);
          this.getChildControl("button-forward").setEnabled(false);
          return;
        }
        var pane = this.getChildControl("scrollpane");
        if (this.getOrientation() === "horizontal") {
          var position = pane.getScrollX();
          var max = pane.getScrollMaxX();
        } else {
          var position = pane.getScrollY();
          var max = pane.getScrollMaxY();
        }
        this.getChildControl("button-backward").setEnabled(position > 0);
        this.getChildControl("button-forward").setEnabled(position < max);
      },
      /**
       * Show the arrows (Called from resize event)
       *
       */
      _showArrows() {
        this._showChildControl("button-forward");
        this._showChildControl("button-backward");
      },
      /**
       * Hide the arrows (Called from resize event)
       *
       */
      _hideArrows() {
        this._excludeChildControl("button-forward");
        this._excludeChildControl("button-backward");
        this.scrollTo(0);
      }
    }
  });
  qx.ui.container.SlideBar.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.SlideBar": {
        "construct": true,
        "require": true
      },
      "qx.ui.form.HoverButton": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The MenuSlideBar is used to scroll menus if they don't fit on the screen.
   *
   * @childControl button-forward {qx.ui.form.HoverButton} scrolls forward of hovered
   * @childControl button-backward {qx.ui.form.HoverButton} scrolls backward if hovered
   *
   * @internal
   */
  qx.Class.define("qx.ui.menu.MenuSlideBar", {
    extend: qx.ui.container.SlideBar,
    construct() {
      qx.ui.container.SlideBar.constructor.call(this, "vertical");
    },
    properties: {
      appearance: {
        refine: true,
        init: "menu-slidebar"
      }
    },
    members: {
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "button-forward":
            control = new qx.ui.form.HoverButton();
            control.addListener("execute", this._onExecuteForward, this);
            this._addAt(control, 2);
            break;
          case "button-backward":
            control = new qx.ui.form.HoverButton();
            control.addListener("execute", this._onExecuteBackward, this);
            this._addAt(control, 0);
            break;
        }
        return control || qx.ui.menu.MenuSlideBar.superclass.prototype._createChildControlImpl.call(this, id);
      }
    }
  });
  qx.ui.menu.MenuSlideBar.$$dbClassInfo = $$dbClassInfo;
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
      "qx.lang.Type": {},
      "qx.util.ResourceManager": {},
      "qx.lang.Function": {},
      "qx.event.GlobalError": {
        "require": true
      },
      "qx.bom.client.Engine": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.globalErrorHandling": {
          "className": "qx.event.GlobalError"
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
   * The ImageLoader can preload and manage loaded image resources. It easily
   * handles multiple requests and supports callbacks for successful and failed
   * requests.
   *
   * After loading of an image the dimension of the image is stored as long
   * as the application is running. This is quite useful for in-memory layouting.
   *
   * Use {@link #load} to preload your own images.
   */
  qx.Bootstrap.define("qx.io.ImageLoader", {
    statics: {
      /** @type {Map} Internal data structure to cache image sizes */
      __data__P_176_0: {},
      /** @type {Map} Default image size */
      __defaultSize__P_176_1: {
        width: null,
        height: null
      },
      /** @type {RegExp} Known image types */
      __knownImageTypesRegExp__P_176_2: /\.(png|gif|jpg|jpeg|bmp)\b/i,
      /** @type {RegExp} Image types of a data URL */
      __dataUrlRegExp__P_176_3: /^data:image\/(png|gif|jpg|jpeg|bmp|svg)\b/i,
      /**
       * Whether the given image has previously been loaded using the
       * {@link #load} method.
       *
       * @param source {String} Image source to query
       * @return {Boolean} <code>true</code> when the image is loaded
       */
      isLoaded(source) {
        var entry = this.__data__P_176_0[source];
        return !!(entry && entry.loaded);
      },
      /**
       * Whether the given image has previously been requested using the
       * {@link #load} method but failed.
       *
       * @param source {String} Image source to query
       * @return {Boolean} <code>true</code> when the image loading failed
       */
      isFailed(source) {
        var entry = this.__data__P_176_0[source];
        return !!(entry && entry.failed);
      },
      /**
       * Whether the given image is currently loading.
       *
       * @param source {String} Image source to query
       * @return {Boolean} <code>true</code> when the image is loading in the moment.
       */
      isLoading(source) {
        var entry = this.__data__P_176_0[source];
        return !!(entry && entry.loading);
      },
      /**
       * Returns the format of a previously loaded image
       *
       * @param source {String} Image source to query
       * @return {String ? null} The format of the image or <code>null</code>
       */
      getFormat(source) {
        var entry = this.__data__P_176_0[source];
        if (!entry || !entry.format) {
          var result = this.__dataUrlRegExp__P_176_3.exec(source);
          if (result != null) {
            // If width and height aren't defined, provide some defaults
            var width = entry && qx.lang.Type.isNumber(entry.width) ? entry.width : this.__defaultSize__P_176_1.width;
            var height = entry && qx.lang.Type.isNumber(entry.height) ? entry.height : this.__defaultSize__P_176_1.height;
            entry = {
              loaded: true,
              format: result[1],
              width: width,
              height: height
            };
          }
        }
        return entry ? entry.format : null;
      },
      /**
       * Returns the size of a previously loaded image
       *
       * @param source {String} Image source to query
       * @return {Map} The dimension of the image (<code>width</code> and
       *    <code>height</code> as key). If the image is not yet loaded, the
       *    dimensions are given as <code>null</code> for width and height.
       */
      getSize(source) {
        var entry = this.__data__P_176_0[source];
        return entry ? {
          width: entry.width,
          height: entry.height
        } : this.__defaultSize__P_176_1;
      },
      /**
       * Returns the image width
       *
       * @param source {String} Image source to query
       * @return {Integer} The width or <code>null</code> when the image is not loaded
       */
      getWidth(source) {
        var entry = this.__data__P_176_0[source];
        return entry ? entry.width : null;
      },
      /**
       * Returns the image height
       *
       * @param source {String} Image source to query
       * @return {Integer} The height or <code>null</code> when the image is not loaded
       */
      getHeight(source) {
        var entry = this.__data__P_176_0[source];
        return entry ? entry.height : null;
      },
      /**
       * Loads the given image. Supports a callback which is
       * executed when the image is loaded.
       *
       * This method works asynchronous.
       *
       * @param source {String} Image source to load
       * @param callback {Function?} Callback function to execute
       *   The first parameter of the callback is the given source url, the
       *   second parameter is the data entry which contains additional
       *   information about the image.
       * @param context {Object?} Context in which the given callback should be executed
       * @param options {Map?} Optional configuration options:
       * - retryFailed {boolean} Whether to retry loading of a failed image source
       */
      load(source, callback, context, options) {
        options ??= {};
        // Shorthand
        var entry = this.__data__P_176_0[source];
        if (!entry || options.retryFailed && entry.failed) {
          entry = this.__data__P_176_0[source] = {};
        }

        // Normalize context
        if (callback && !context) {
          context = window;
        }

        // Already known image source
        if (entry.loaded || entry.loading || entry.failed) {
          if (callback) {
            if (entry.loading) {
              entry.callbacks.push(callback, context);
            } else {
              callback.call(context, source, entry);
            }
          }
        } else {
          // Updating entry
          entry.loading = true;
          entry.callbacks = [];
          if (callback) {
            entry.callbacks.push(callback, context);
          }
          var ResourceManager = qx.util.ResourceManager.getInstance();
          if (ResourceManager.isFontUri(source)) {
            var el = document.createElement("div");
            var charCode = ResourceManager.fromFontUriToCharCode(source);
            el.value = String.fromCharCode(charCode);
            entry.element = el;
            return;
          }

          // Create image element
          var el = document.createElement("img");

          // Create common callback routine
          var boundCallback = qx.lang.Function.listener(this.__onload__P_176_4, this, el, source);

          // Assign callback to element
          el.onload = boundCallback;
          el.onerror = boundCallback;

          // Start loading of image
          el.src = source;

          // save the element for aborting
          entry.element = el;
        }
      },
      /**
       * Abort the loading for the given url.
       *
       * @param source {String} URL of the image to abort its loading.
       */
      abort(source) {
        var entry = this.__data__P_176_0[source];
        if (entry && !entry.loaded) {
          entry.aborted = true;
          var callbacks = entry.callbacks;
          var element = entry.element;

          // Cleanup listeners
          element.onload = element.onerror = null;

          // prevent further loading
          element.src = "";

          // Cleanup entry
          delete entry.callbacks;
          delete entry.element;
          delete entry.loading;
          for (var i = 0, l = callbacks.length; i < l; i += 2) {
            callbacks[i].call(callbacks[i + 1], source, entry);
          }
        }
        this.__data__P_176_0[source] = null;
      },
      /**
       * Calls a method based on qx.globalErrorHandling
       */
      __onload__P_176_4() {
        var callback = qx.core.Environment.select("qx.globalErrorHandling", {
          true: qx.event.GlobalError.observeMethod(this.__onLoadHandler__P_176_5),
          false: this.__onLoadHandler__P_176_5
        });
        callback.apply(this, arguments);
      },
      /**
       * Internal event listener for all load/error events.
       *
       * @signature function(event, element, source)
       *
       * @param event {Event} Native event object
       * @param element {Element} DOM element which represents the image
       * @param source {String} The image source loaded
       */
      __onLoadHandler__P_176_5(event, element, source) {
        // Shorthand
        var entry = this.__data__P_176_0[source];

        // [BUG #9149]: When loading a SVG IE11 won't have
        // the width/height of the element set, unless
        // it is inserted into the DOM.
        if (qx.bom.client.Engine.getName() == "mshtml" && parseFloat(qx.bom.client.Engine.getVersion()) === 11) {
          document.body.appendChild(element);
        }
        var isImageAvailable = function (imgElem) {
          return imgElem && imgElem.height !== 0;
        };

        // [BUG #7497]: IE11 doesn't properly emit an error event
        // when loading fails so augment success check
        if (event.type === "load" && isImageAvailable(element)) {
          // Store dimensions
          entry.loaded = true;
          entry.width = element.width;
          entry.height = element.height;

          // try to determine the image format
          var result = this.__knownImageTypesRegExp__P_176_2.exec(source);
          if (result != null) {
            entry.format = result[1];
          }
        } else {
          entry.failed = true;
        }
        if (qx.bom.client.Engine.getName() == "mshtml" && parseFloat(qx.bom.client.Engine.getVersion()) === 11) {
          document.body.removeChild(element);
        }

        // Cleanup listeners
        element.onload = element.onerror = null;

        // Cache callbacks
        var callbacks = entry.callbacks;

        // Cleanup entry
        delete entry.loading;
        delete entry.callbacks;
        delete entry.element;

        // Execute callbacks
        for (var i = 0, l = callbacks.length; i < l; i += 2) {
          callbacks[i].call(callbacks[i + 1], source, entry);
        }
      },
      /**
       * Dispose stored images.
       */
      dispose() {
        this.__data__P_176_0 = {};
      }
    }
  });
  qx.io.ImageLoader.$$dbClassInfo = $$dbClassInfo;
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
      "qx.html.Element": {
        "construct": true,
        "require": true
      },
      "qx.bom.element.Decoration": {},
      "qx.bom.client.Engine": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
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
  
  ************************************************************************ */

  /**
   * This is a simple image class using the low level image features of
   * qooxdoo and wraps it for the qx.html layer.
   */
  qx.Class.define("qx.html.Image", {
    extend: qx.html.Element,
    /**
     * Creates a new Image
     *
     * @see constructor for {Element}
     */
    construct(tagName, styles, attributes) {
      qx.html.Element.constructor.call(this, tagName, styles, attributes);
      this.registerProperty("source", null, this._setSourceProperty, (writer, key, property) => property.value && writer("src=" + JSON.stringify(property.value)));
      this.registerProperty("scale", null, this._setScaleProperty);
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __paddingTop__P_177_0: null,
      __paddingLeft__P_177_1: null,
      // this member variable is only used for IE browsers to be able
      // to the tag name which will be set. This is heavily connected to the runtime
      // change of decorators and the use of external (=unmanaged images). It is
      // necessary to be able to determine what tag will be used e.g. before the
      // ImageLoader has finished its loading of an external image.
      // See Bug #3894 for more details
      tagNameHint: null,
      /**
       * Maps padding to background-position if the widget is rendered as a
       * background image
       * @param paddingLeft {Integer} left padding value
       * @param paddingTop {Integer} top padding value
       */
      setPadding(paddingLeft, paddingTop) {
        this.__paddingLeft__P_177_1 = paddingLeft;
        this.__paddingTop__P_177_0 = paddingTop;
        if (this.getNodeName() == "div") {
          this.setStyle("backgroundPosition", paddingLeft + "px " + paddingTop + "px");
        }
      },
      /*
      ---------------------------------------------------------------------------
        ELEMENT API
      ---------------------------------------------------------------------------
      */

      /**
       * Implementation of setter for the "source" property
       *
       * @param value {String?} value to set
       */
      _setSourceProperty(value) {
        var elem = this.getDomElement();

        // To prevent any wrong background-position or -repeat it is necessary
        // to reset those styles whenever a background-image is updated.
        // This is only necessary if any backgroundImage was set already.
        // See bug #3376 for details
        var styles = this.getAllStyles() || {};
        if (this.getNodeName() == "div" && this.getStyle("backgroundImage")) {
          styles.backgroundRepeat = null;
        }
        var source = this._getProperty("source");
        var scale = this._getProperty("scale");
        var repeat = scale ? "scale" : "no-repeat";

        // Source can be null in certain circumstances.
        // See bug #3701 for details.
        if (source != null) {
          // Normalize "" to null
          source = source || null;
          styles.paddingTop = this.__paddingTop__P_177_0;
          styles.paddingLeft = this.__paddingLeft__P_177_1;
          qx.bom.element.Decoration.update(elem, source, repeat, styles);
        }
      },
      _setScaleProperty(value) {
        // Nothing
      },
      // overridden
      _removeProperty(key, direct) {
        if (key == "source") {
          // Work-around check for null in #_applyProperty, introduced with fix
          // for bug #3701. Use empty string that is later normalized to null.
          // This fixes bug #4524.
          this._setProperty(key, "", direct);
        } else {
          this._setProperty(key, null, direct);
        }
      },
      // overridden
      _createDomElement() {
        var scale = this._getProperty("scale");
        var repeat = scale ? "scale" : "no-repeat";
        if (qx.core.Environment.get("engine.name") == "mshtml") {
          var source = this._getProperty("source");
          if (this.tagNameHint != null) {
            this.setNodeName(this.tagNameHint);
          } else {
            this.setNodeName(qx.bom.element.Decoration.getTagName(repeat, source));
          }
        } else {
          this.setNodeName(qx.bom.element.Decoration.getTagName(repeat));
        }
        return qx.html.Image.superclass.prototype._createDomElement.call(this);
      },
      // overridden
      // be sure that style attributes are merged and not overwritten
      _copyData(fromMarkup, propertiesFromDom) {
        return qx.html.Image.superclass.prototype._copyData.call(this, true, propertiesFromDom);
      },
      /*
      ---------------------------------------------------------------------------
        IMAGE API
      ---------------------------------------------------------------------------
      */

      /**
       * Configures the image source
       *
       * @param value {Boolean} Whether the HTML mode should be used.
       * @return {qx.html.Label} This instance for for chaining support.
       */
      setSource(value) {
        this._setProperty("source", value);
        return this;
      },
      /**
       * Returns the image source.
       *
       * @return {String} Current image source.
       */
      getSource() {
        return this._getProperty("source");
      },
      /**
       * Resets the current source to null which means that no image
       * is shown anymore.
       * @return {qx.html.Image} The current instance for chaining
       */
      resetSource() {
        // webkit browser do not allow to remove the required "src" attribute.
        // If removing the attribute the old image is still visible.
        if (qx.core.Environment.get("engine.name") == "webkit") {
          this._setProperty("source", "qx/static/blank.gif");
        } else {
          this._removeProperty("source", true);
        }
        return this;
      },
      /**
       * Whether the image should be scaled or not.
       *
       * @param value {Boolean} Scale the image
       * @return {qx.html.Label} This instance for for chaining support.
       */
      setScale(value) {
        this._setProperty("scale", value);
        return this;
      },
      /**
       * Returns whether the image is scaled or not.
       *
       * @return {Boolean} Whether the image is scaled
       */
      getScale() {
        return this._getProperty("scale");
      }
    }
  });
  qx.html.Image.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.html.Element": {
        "construct": true,
        "require": true
      },
      "qx.bom.Label": {}
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
   * A cross browser label instance with support for rich HTML and text labels.
   *
   * Text labels supports ellipsis to reduce the text width.
   *
   * The mode can be changed through the method {@link #setRich}
   * which accepts a boolean value. The default mode is "text" which is
   * a good choice because it has a better performance.
   */
  qx.Class.define("qx.html.Label", {
    extend: qx.html.Element,
    /**
     * Creates a new Image
     *
     * @see constructor for {Element}
     */
    construct(tagName, styles, attributes) {
      qx.html.Element.constructor.call(this, tagName, styles, attributes);
      this.registerProperty("value", null, this._setValueProperty);
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __rich__P_140_0: null,
      /*
      ---------------------------------------------------------------------------
        ELEMENT API
      ---------------------------------------------------------------------------
      */

      /**
       * Implementation of setter for the "value" property
       *
       * @param value {String?} value to set
       */
      _setValueProperty(value) {
        var element = this.getDomElement();
        qx.bom.Label.setValue(element, value);
      },
      // overridden
      _createDomElement() {
        var rich = this.__rich__P_140_0;
        var el = qx.bom.Label.create(this._content, rich);
        el.style.overflow = "hidden";
        return el;
      },
      // overridden
      // be sure that style attributes are merged and not overwritten
      _copyData(fromMarkup, propertiesFromDom) {
        return qx.html.Label.superclass.prototype._copyData.call(this, true, propertiesFromDom);
      },
      /*
      ---------------------------------------------------------------------------
        LABEL API
      ---------------------------------------------------------------------------
      */

      /**
       * Toggles between rich HTML mode and pure text mode.
       *
       * @param value {Boolean} Whether the HTML mode should be used.
       * @return {qx.html.Label} This instance for chaining support.
       */
      setRich(value) {
        var element = this.getDomElement();
        if (element) {
          throw new Error("The label mode cannot be modified after initial creation");
        }
        value = !!value;
        if (this.__rich__P_140_0 == value) {
          return this;
        }
        this.__rich__P_140_0 = value;
        return this;
      },
      /**
       * Sets the HTML/text content depending on the content mode.
       *
       * @param value {String} The content to be used.
       * @return {qx.html.Label} This instance for for chaining support.
       */
      setValue(value) {
        this._setProperty("value", value);
        return this;
      },
      /**
       * Get the current content.
       *
       * @return {String} The labels's content
       */
      getValue() {
        return this._getProperty("value");
      },
      /**
       * Reset the current content
       *
       * @return {qx.html.Label} This instance for for chaining support.
       */
      resetValue() {
        return this._removeProperty("value");
      }
    }
  });
  qx.html.Label.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Engine": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["io.maxrequests", "io.ssl", "io.xhr"],
      "required": {}
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
       * Carsten Lergenmueller (carstenl)
       * Fabian Jakobs (fbjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Determines browser-dependent information about the transport layer.
   *
   * This class is used by {@link qx.core.Environment} and should not be used
   * directly. Please check its class comment for details how to use it.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.Transport", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Returns the maximum number of parallel requests the current browser
       * supports per host addressed.
       *
       * Note that this assumes one connection can support one request at a time
       * only. Technically, this is not correct when pipelining is enabled (which
       * it currently is only for IE 8 and Opera). In this case, the number
       * returned will be too low, as one connection supports multiple pipelined
       * requests. This is accepted for now because pipelining cannot be
       * detected from JavaScript and because modern browsers have enough
       * parallel connections already - it's unlikely an app will require more
       * than 4 parallel XMLHttpRequests to one server at a time.
       *
       * @internal
       * @return {Integer} Maximum number of parallel requests
       */
      getMaxConcurrentRequestCount() {
        var maxConcurrentRequestCount;

        // Parse version numbers.
        var versionParts = qx.bom.client.Engine.getVersion().split(".");
        var versionMain = 0;
        var versionMajor = 0;
        var versionMinor = 0;

        // Main number
        if (versionParts[0]) {
          versionMain = versionParts[0];
        }

        // Major number
        if (versionParts[1]) {
          versionMajor = versionParts[1];
        }

        // Minor number
        if (versionParts[2]) {
          versionMinor = versionParts[2];
        }

        // IE 8 gives the max number of connections in a property
        // see http://msdn.microsoft.com/en-us/library/cc197013(VS.85).aspx
        if (window.maxConnectionsPerServer) {
          maxConcurrentRequestCount = window.maxConnectionsPerServer;
        } else if (qx.bom.client.Engine.getName() == "opera") {
          // Opera: 8 total
          // see http://operawiki.info/HttpProtocol
          maxConcurrentRequestCount = 8;
        } else if (qx.bom.client.Engine.getName() == "webkit") {
          // Safari: 4
          // http://www.stevesouders.com/blog/2008/03/20/roundup-on-parallel-connections/

          // Bug #6917: Distinguish Chrome from Safari, Chrome has 6 connections
          //       according to
          //      http://stackoverflow.com/questions/561046/how-many-concurrent-ajax-xmlhttprequest-requests-are-allowed-in-popular-browser

          maxConcurrentRequestCount = 4;
        } else if (qx.bom.client.Engine.getName() == "gecko" && (versionMain > 1 || versionMain == 1 && versionMajor > 9 || versionMain == 1 && versionMajor == 9 && versionMinor >= 1)) {
          // FF 3.5 (== Gecko 1.9.1): 6 Connections.
          // see  http://gemal.dk/blog/2008/03/18/firefox_3_beta_5_will_have_improved_connection_parallelism/
          maxConcurrentRequestCount = 6;
        } else {
          // Default is 2, as demanded by RFC 2616
          // see http://blogs.msdn.com/ie/archive/2005/04/11/407189.aspx
          maxConcurrentRequestCount = 2;
        }
        return maxConcurrentRequestCount;
      },
      /**
       * Checks whether the app is loaded with SSL enabled which means via https.
       *
       * @internal
       * @return {Boolean} <code>true</code>, if the app runs on https
       */
      getSsl() {
        return window.location.protocol === "https:";
      },
      /**
       * Checks what kind of XMLHttpRequest object the browser supports
       * for the current protocol, if any.
       *
       * The standard XMLHttpRequest is preferred over ActiveX XMLHTTP.
       *
       * @internal
       * @return {String}
       *  <code>"xhr"</code>, if the browser provides standard XMLHttpRequest.<br/>
       *  <code>"activex"</code>, if the browser provides ActiveX XMLHTTP.<br/>
       *  <code>""</code>, if there is not XHR support at all.
       */
      getXmlHttpRequest() {
        // Standard XHR can be disabled in IE's security settings,
        // therefore provide ActiveX as fallback. Additionally,
        // standard XHR in IE7 is broken for file protocol.
        var supports = window.ActiveXObject ? function () {
          if (window.location.protocol !== "file:") {
            try {
              new window.XMLHttpRequest();
              return "xhr";
            } catch (noXhr) {}
          }
          try {
            new window.ActiveXObject("Microsoft.XMLHTTP");
            return "activex";
          } catch (noActiveX) {}
        }() : function () {
          try {
            new window.XMLHttpRequest();
            return "xhr";
          } catch (noXhr) {}
        }();
        return supports || "";
      }
    },
    defer(statics) {
      qx.core.Environment.add("io.maxrequests", statics.getMaxConcurrentRequestCount);
      qx.core.Environment.add("io.ssl", statics.getSsl);
      qx.core.Environment.add("io.xhr", statics.getXmlHttpRequest);
    }
  });
  qx.bom.client.Transport.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.bom.client.Device": {},
      "qx.bom.client.Engine": {
        "defer": "load",
        "require": true
      },
      "qx.bom.client.Transport": {
        "defer": "load",
        "require": true
      },
      "qx.util.LibraryManager": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine",
          "defer": true
        },
        "io.ssl": {
          "className": "qx.bom.client.Transport",
          "defer": true
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
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Contains information about images (size, format, clipping, ...) and
   * other resources like CSS files, local data, ...
   */
  qx.Class.define("qx.util.ResourceManager", {
    extend: qx.core.Object,
    type: "singleton",
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.core.Object.constructor.call(this);
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Map} the shared image registry */
      __registry__P_178_0: qx.$$resources || {},
      /** @type {Map} prefix per library used in HTTPS mode for IE */
      __urlPrefix__P_178_1: {}
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Detects whether there is a high-resolution image available.
       * A high-resolution image is assumed to have the same file name as
       * the parameter source, but with a pixelRatio identifier before the file
       * extension, like "@2x".
       * Medium Resolution: "example.png", high-resolution: "example@2x.png"
       *
       * @param lowResImgSrc {String} source of the low resolution image.
       * @param factor {Number} Factor to find the right image. If not set calculated by getDevicePixelRatio()
       * @return {String|Boolean} If a high-resolution image source.
       */
      findHighResolutionSource(lowResImgSrc, factor) {
        var pixelRatioCandidates = ["3", "2", "1.5"];

        // Calculate the optimal ratio, based on the rem scale factor of the application and the device pixel ratio.
        if (!factor) {
          factor = parseFloat(qx.bom.client.Device.getDevicePixelRatio().toFixed(2));
        }
        if (factor <= 1) {
          return false;
        }
        var i = pixelRatioCandidates.length;
        while (i > 0 && factor > pixelRatioCandidates[--i]) {}
        var hiResImgSrc;
        var k;

        // Search for best img with a higher resolution.
        for (k = i; k >= 0; k--) {
          hiResImgSrc = this.getHighResolutionSource(lowResImgSrc, pixelRatioCandidates[k]);
          if (hiResImgSrc) {
            return hiResImgSrc;
          }
        }

        // Search for best img with a lower resolution.
        for (k = i + 1; k < pixelRatioCandidates.length; k++) {
          hiResImgSrc = this.getHighResolutionSource(lowResImgSrc, pixelRatioCandidates[k]);
          if (hiResImgSrc) {
            return hiResImgSrc;
          }
        }
        return null;
      },
      /**
       * Returns the source name for the high-resolution image based on the passed
       * parameters.
       * @param source {String} the source of the medium resolution image.
       * @param pixelRatio {Number} the pixel ratio of the high-resolution image.
       * @return {String} the high-resolution source name or null if no source could be found.
       */
      getHighResolutionSource(source, pixelRatio) {
        var fileExtIndex = source.lastIndexOf(".");
        if (fileExtIndex > -1) {
          var pixelRatioIdentifier = "@" + pixelRatio + "x";
          var candidate = source.slice(0, fileExtIndex) + pixelRatioIdentifier + source.slice(fileExtIndex);
          if (this.has(candidate)) {
            return candidate;
          }
        }
        return null;
      },
      /**
       * Get all known resource IDs.
       *
       * @param pathfragment{String|null|undefined} an optional path fragment to check against with id.indexOf(pathfragment)
       * @return {Array|null} an array containing the IDs or null if the registry is not initialized
       */
      getIds(pathfragment) {
        var registry = qx.util.ResourceManager.__registry__P_178_0;
        if (!registry) {
          return null;
        }
        return Object.keys(registry).filter(function (key) {
          return !pathfragment || key.indexOf(pathfragment) != -1;
        });
      },
      /**
       * Whether the registry has information about the given resource.
       *
       * @param id {String} The resource to get the information for
       * @return {Boolean} <code>true</code> when the resource is known.
       */
      has(id) {
        return !!qx.util.ResourceManager.__registry__P_178_0[id];
      },
      /**
       * Get information about an resource.
       *
       * @param id {String} The resource to get the information for
       * @return {Array} Registered data or <code>null</code>
       */
      getData(id) {
        return qx.util.ResourceManager.__registry__P_178_0[id] || null;
      },
      /**
       * Returns the width of the given resource ID,
       * when it is not a known image <code>0</code> is
       * returned.
       *
       * @param id {String} Resource identifier
       * @return {Integer} The image width, maybe <code>null</code> when the width is unknown
       */
      getImageWidth(id) {
        var size;
        if (id && id.startsWith("@")) {
          var part = id.split("/");
          size = parseInt(part[2], 10);
          if (size) {
            id = part[0] + "/" + part[1];
          }
        }
        var entry = qx.util.ResourceManager.__registry__P_178_0[id]; // [ width, height, codepoint ]
        if (size && entry) {
          var width = Math.ceil(size / entry[1] * entry[0]);
          return width;
        }
        return entry ? entry[0] : null;
      },
      /**
       * Returns the height of the given resource ID,
       * when it is not a known image <code>0</code> is
       * returned.
       *
       * @param id {String} Resource identifier
       * @return {Integer} The image height, maybe <code>null</code> when the height is unknown
       */
      getImageHeight(id) {
        if (id && id.startsWith("@")) {
          var part = id.split("/");
          var size = parseInt(part[2], 10);
          if (size) {
            return size;
          }
        }
        var entry = qx.util.ResourceManager.__registry__P_178_0[id];
        return entry ? entry[1] : null;
      },
      /**
       * Returns the format of the given resource ID,
       * when it is not a known image <code>null</code>
       * is returned.
       *
       * @param id {String} Resource identifier
       * @return {String} File format of the image
       */
      getImageFormat(id) {
        if (id && id.startsWith("@")) {
          return "font";
        }
        var entry = qx.util.ResourceManager.__registry__P_178_0[id];
        return entry ? entry[2] : null;
      },
      /**
       * Returns the format of the combined image (png, gif, ...), if the given
       * resource identifier is an image contained in one, or the empty string
       * otherwise.
       *
       * @param id {String} Resource identifier
       * @return {String} The type of the combined image containing id
       */
      getCombinedFormat(id) {
        var clippedtype = "";
        var entry = qx.util.ResourceManager.__registry__P_178_0[id];
        var isclipped = entry && entry.length > 4 && typeof entry[4] == "string" && this.constructor.__registry__P_178_0[entry[4]];
        if (isclipped) {
          var combId = entry[4];
          var combImg = this.constructor.__registry__P_178_0[combId];
          clippedtype = combImg[2];
        }
        return clippedtype;
      },
      /**
       * Converts the given resource ID to a full qualified URI
       *
       * @param id {String} Resource ID
       * @return {String} Resulting URI
       */
      toUri(id) {
        if (id == null) {
          return id;
        }
        var entry = qx.util.ResourceManager.__registry__P_178_0[id];
        if (!entry) {
          return id;
        }
        if (typeof entry === "string") {
          var lib = entry;
        } else {
          var lib = entry[3];

          // no lib reference
          // may mean that the image has been registered dynamically
          if (!lib) {
            return id;
          }
        }
        var urlPrefix = "";
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("io.ssl")) {
          urlPrefix = qx.util.ResourceManager.__urlPrefix__P_178_1[lib];
        }
        return urlPrefix + qx.util.LibraryManager.getInstance().get(lib, "resourceUri") + "/" + id;
      },
      /**
       * Construct a data: URI for an image resource.
       *
       * Constructs a data: URI for a given resource id, if this resource is
       * contained in a base64 combined image. If this is not the case (e.g.
       * because the combined image has not been loaded yet), returns the direct
       * URI to the image file itself.
       *
       * @param resid {String} resource id of the image
       * @return {String} "data:" or "http:" URI
       */
      toDataUri(resid) {
        var resentry = this.constructor.__registry__P_178_0[resid];
        var combined = resentry ? this.constructor.__registry__P_178_0[resentry[4]] : null;
        var uri;
        if (combined) {
          var resstruct = combined[4][resid];
          uri = "data:image/" + resstruct["type"] + ";" + resstruct["encoding"] + "," + resstruct["data"];
        } else {
          uri = this.toUri(resid);
        }
        return uri;
      },
      /**
       * Checks whether a given resource id for an image is a font handle.
       *
       * @param resid {String} resource id of the image
       * @return {Boolean} True if it's a font URI
       */
      isFontUri(resid) {
        return resid ? resid.startsWith("@") : false;
      },
      /**
       * Returns the correct char code, ignoring scale postfix.
       *
       * The resource ID can be a ligature name (eg `@FontAwesome/heart` or `@MaterialIcons/home/16`),
       * or a hex character code (eg `@FontAwesome/f004` or `@FontAwesome/f004/16`)
       *
       * @param source {String} resource id of the image
       * @returns charCode of the glyph
       */
      fromFontUriToCharCode(source) {
        var sparts = source.split("/");
        var fontSource = source;
        if (sparts.length > 2) {
          fontSource = sparts[0] + "/" + sparts[1];
        }
        var resource = this.getData(fontSource);
        var charCode = null;
        if (resource) {
          charCode = resource[2];
        } else {
          let hexString = source.match(/@([^/]+)\/(.*)$/)[2];
          if (hexString) {
            charCode = parseInt(hexString, 16);
            if (isNaN(charCode)) {
              charCode = null;
            }
          }
        }
        if (!charCode) {
          throw new Error(`Cannot determine charCode from source: ${source}`);
        }
        return charCode;
      }
    },
    defer(statics) {
      if (qx.core.Environment.get("engine.name") == "mshtml") {
        // To avoid a "mixed content" warning in IE when the application is
        // delivered via HTTPS a prefix has to be added. This will transform the
        // relative URL to an absolute one in IE.
        // Though this warning is only displayed in conjunction with images which
        // are referenced as a CSS "background-image", every resource path is
        // changed when the application is served with HTTPS.
        if (qx.core.Environment.get("io.ssl")) {
          for (var lib in qx.$$libraries) {
            var resourceUri;
            if (qx.util.LibraryManager.getInstance().get(lib, "resourceUri")) {
              resourceUri = qx.util.LibraryManager.getInstance().get(lib, "resourceUri");
            } else {
              // default for libraries without a resourceUri set
              statics.__urlPrefix__P_178_1[lib] = "";
              continue;
            }
            var href;
            //first check if there is base url set
            var baseElements = document.getElementsByTagName("base");
            if (baseElements.length > 0) {
              href = baseElements[0].href;
            }

            // It is valid to to begin a URL with "//" so this case has to
            // be considered. If the to resolved URL begins with "//" the
            // manager prefixes it with "https:" to avoid any problems for IE
            if (resourceUri.match(/^\/\//) != null) {
              statics.__urlPrefix__P_178_1[lib] = window.location.protocol;
            }
            // If the resourceUri begins with a single slash, include the current
            // hostname
            else if (resourceUri.match(/^\//) != null) {
              if (href) {
                statics.__urlPrefix__P_178_1[lib] = href;
              } else {
                statics.__urlPrefix__P_178_1[lib] = window.location.protocol + "//" + window.location.host;
              }
            }
            // If the resolved URL begins with "./" the final URL has to be
            // put together using the document.URL property.
            // IMPORTANT: this is only applicable for the source version
            else if (resourceUri.match(/^\.\//) != null) {
              var url = document.URL;
              statics.__urlPrefix__P_178_1[lib] = url.substring(0, url.lastIndexOf("/") + 1);
            } else if (resourceUri.match(/^http/) != null) {
              // Let absolute URLs pass through
              statics.__urlPrefix__P_178_1[lib] = "";
            } else {
              if (!href) {
                // check for parameters with URLs as value
                var index = window.location.href.indexOf("?");
                if (index == -1) {
                  href = window.location.href;
                } else {
                  href = window.location.href.substring(0, index);
                }
              }
              statics.__urlPrefix__P_178_1[lib] = href.substring(0, href.lastIndexOf("/") + 1);
            }
          }
        }
      }
    }
  });
  qx.util.ResourceManager.$$dbClassInfo = $$dbClassInfo;
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
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Author:
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Provides read/write access to library-specific information such as
   * source/resource URIs.
   */
  qx.Class.define("qx.util.LibraryManager", {
    extend: qx.core.Object,
    type: "singleton",
    statics: {
      /** @type {Map} The libraries used by this application */
      __libs__P_209_0: qx.$$libraries || {}
    },
    members: {
      /**
       * Checks whether the library with the given namespace is known to the
       * application.
       * @param namespace {String} The library's namespace
       * @return {Boolean} <code>true</code> if the given library is known
       */
      has(namespace) {
        return !!qx.util.LibraryManager.__libs__P_209_0[namespace];
      },
      /**
       * The namespaces of all libraries known to the application
       *
       * @returns {String[]} the namespaces
       */
      getNamespaces() {
        return Object.keys(qx.util.LibraryManager.__libs__P_209_0);
      },
      /**
       * Returns the value of an attribute of the given library
       * @param namespace {String} The library's namespace
       * @param key {String} Name of the attribute
       * @return {var|null} The attribute's value or <code>null</code> if it's not defined
       */
      get(namespace, key) {
        return qx.util.LibraryManager.__libs__P_209_0[namespace][key] ? qx.util.LibraryManager.__libs__P_209_0[namespace][key] : null;
      },
      /**
       * Sets an attribute on the given library.
       *
       * @param namespace {String} The library's namespace
       * @param key {String} Name of the attribute
       * @param value {var} Value of the attribute
       */
      set(namespace, key, value) {
        qx.util.LibraryManager.__libs__P_209_0[namespace][key] = value;
      }
    }
  });
  qx.util.LibraryManager.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.util.ResourceManager": {},
      "qx.bom.element.Style": {},
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.theme.manager.Font": {},
      "qx.lang.Object": {},
      "qx.bom.Style": {},
      "qx.io.ImageLoader": {},
      "qx.log.Logger": {},
      "qx.bom.element.Background": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "load": true,
          "className": "qx.bom.client.Engine"
        },
        "css.alphaimageloaderneeded": {
          "className": "qx.bom.client.Css"
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
       * Alexander Steitz (aback)
  
  ************************************************************************ */

  /**
   * Powerful creation and update features for images used for decoration
   * purposes like for rounded borders, icons, etc.
   *
   * Includes support for image clipping, PNG alpha channel support, additional
   * repeat options like <code>scale-x</code> or <code>scale-y</code>.
   */
  qx.Class.define("qx.bom.element.Decoration", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Boolean} Whether clipping hints should be logged */
      DEBUG: false,
      /** @type {Map} Collect warnings for potential clipped images */
      __warnings__P_179_0: {},
      /** @type {Map} List of repeat modes which supports the IE AlphaImageLoader */
      __alphaFixRepeats__P_179_1: qx.core.Environment.select("engine.name", {
        mshtml: {
          "scale-x": true,
          "scale-y": true,
          scale: true,
          "no-repeat": true
        },
        default: null
      }),
      /** @type {Map} Mapping between background repeat and the tag to create */
      __repeatToTagname__P_179_2: {
        "scale-x": "img",
        "scale-y": "img",
        scale: "img",
        repeat: "div",
        "no-repeat": "div",
        "repeat-x": "div",
        "repeat-y": "div"
      },
      /**
       * Updates the element to display the given source
       * with the repeat option.
       *
       * @param element {Element} DOM element to update
       * @param source {String} Any valid URI
       * @param repeat {String} One of <code>scale-x</code>, <code>scale-y</code>,
       *   <code>scale</code>, <code>repeat</code>, <code>repeat-x</code>,
       *   <code>repeat-y</code>, <code>repeat</code>
       * @param style {Map} Additional styles to apply
       */
      update(element, source, repeat, style) {
        var tag = this.getTagName(repeat, source);
        if (tag != element.tagName.toLowerCase()) {
          // The "no-repeat" means that `getTagName` will suggest a `div` as opposed to an `img` tag, preferring to use
          //  `img` only for things that need scaling.  The Desktop `qx.ui.*` will always follow this rule, but it
          //  is valid for virtual DOM (`qx.html.*`) to be used to create a no-repeat `img` tag.  Ignore the validation
          //  for `no-repeat` `img`.
          if (repeat != "no-repeat" || element.tagName.toLowerCase() != "img") {
            throw new Error("Image modification not possible because elements could not be replaced at runtime anymore!");
          }
        }
        var ret = this.getAttributes(source, repeat, style);
        if (tag === "img") {
          element.src = ret.src || qx.util.ResourceManager.getInstance().toUri("qx/static/blank.gif");
        }

        // Fix for old background position
        if (element.style.backgroundPosition != "" && ret.style.backgroundPosition === undefined) {
          ret.style.backgroundPosition = null;
        }

        // Fix for old clip
        if (element.style.clip != "" && ret.style.clip === undefined) {
          ret.style.clip = null;
        }

        // Apply new styles
        qx.bom.element.Style.setStyles(element, ret.style);

        // we need to apply the filter to prevent black rendering artifacts
        // http://blog.hackedbrain.com/archive/2007/05/21/6110.aspx
        if (qx.core.Environment.get("css.alphaimageloaderneeded")) {
          try {
            element.filters["DXImageTransform.Microsoft.AlphaImageLoader"].apply();
          } catch (e) {}
        }
      },
      /**
       * Creates the HTML for a decorator image element with the given options.
       *
       * @param source {String} Any valid URI
       * @param repeat {String} One of <code>scale-x</code>, <code>scale-y</code>,
       *   <code>scale</code>, <code>repeat</code>, <code>repeat-x</code>,
       *   <code>repeat-y</code>, <code>repeat</code>
       * @param style {Map} Additional styles to apply
       * @return {String} Decorator image HTML
       */
      create(source, repeat, style) {
        var tag = this.getTagName(repeat, source);
        var ret = this.getAttributes(source, repeat, style);
        var css = qx.bom.element.Style.compile(ret.style);
        var ResourceManager = qx.util.ResourceManager.getInstance();
        if (ResourceManager.isFontUri(source)) {
          var font = qx.theme.manager.Font.getInstance().resolve(source.match(/@([^/]+)/)[1]);
          var styles = qx.lang.Object.clone(font.getStyles());
          styles["width"] = style.width;
          styles["height"] = style.height;
          styles["lineHeight"] = style.height;
          styles["fontSize"] = parseInt(style.width) > parseInt(style.height) ? style.height : style.width;
          styles["display"] = style.display;
          styles["verticalAlign"] = style.verticalAlign;
          styles["position"] = style.position;
          var css = "";
          for (var _style in styles) {
            if (styles.hasOwnProperty(_style)) {
              let value = styles[_style];
              if (value !== null) {
                css += qx.bom.Style.getCssName(_style) + ": " + value + ";";
              }
            }
          }
          var charCode = ResourceManager.fromFontUriToCharCode(source);
          return '<div style="' + css + '">' + String.fromCharCode(charCode) + "</div>";
        } else {
          if (tag === "img") {
            return '<img src="' + ret.src + '" style="' + css + '"/>';
          } else {
            return '<div style="' + css + '"></div>';
          }
        }
      },
      /**
       * Translates the given repeat option to a tag name. Useful
       * for systems which depends on early information of the tag
       * name to prepare element like {@link qx.html.Image}.
       *
       * @param repeat {String} One of <code>scale-x</code>, <code>scale-y</code>,
       *   <code>scale</code>, <code>repeat</code>, <code>repeat-x</code>,
       *   <code>repeat-y</code>, <code>repeat</code>
       * @param source {String?null} Source used to identify the image format
       * @return {String} The tag name: <code>div</code> or <code>img</code>
       */
      getTagName(repeat, source) {
        if (source && qx.core.Environment.get("css.alphaimageloaderneeded") && this.__alphaFixRepeats__P_179_1[repeat] && source.endsWith(".png")) {
          return "div";
        }
        return this.__repeatToTagname__P_179_2[repeat];
      },
      /**
       * This method is used to collect all needed attributes for
       * the tag name detected by {@link #getTagName}.
       *
       * @param source {String} Image source
       * @param repeat {String} Repeat mode of the image
       * @param style {Map} Additional styles to apply
       * @return {String} Markup for image
       */
      getAttributes(source, repeat, style) {
        if (!style) {
          style = {};
        }
        if (qx.core.Environment.get("engine.name") == "mshtml") {
          // Add a fix for small blocks where IE has a minHeight
          // of the fontSize in quirks mode
          style.fontSize = 0;
          style.lineHeight = 0;
        } else if (qx.core.Environment.get("engine.name") == "webkit") {
          // This stops images from being draggable in webkit
          style.WebkitUserDrag = "none";
        }
        var format = qx.util.ResourceManager.getInstance().getImageFormat(source) || qx.io.ImageLoader.getFormat(source);
        {
          if (source != null && format == null) {
            qx.log.Logger.warn("ImageLoader: Not recognized format of external image '" + source + "'!");
          }
        }
        var result;

        // Enable AlphaImageLoader in IE6/IE7/IE8
        if (qx.core.Environment.get("css.alphaimageloaderneeded") && this.__alphaFixRepeats__P_179_1[repeat] && format === "png") {
          var dimension = this.__getDimension__P_179_3(source);
          this.__normalizeWidthHeight__P_179_4(style, dimension.width, dimension.height);
          result = this.processAlphaFix(style, repeat, source);
        } else {
          delete style.clip;
          if (repeat === "scale") {
            result = this.__processScale__P_179_5(style, repeat, source);
          } else if (repeat === "scale-x" || repeat === "scale-y") {
            result = this.__processScaleXScaleY__P_179_6(style, repeat, source);
          } else {
            // Native repeats or "no-repeat"
            result = this.__processRepeats__P_179_7(style, repeat, source);
          }
        }
        return result;
      },
      /**
       * Normalize the given width and height values
       *
       * @param style {Map} style information
       * @param width {Integer?null} width as number or null
       * @param height {Integer?null} height as number or null
       */
      __normalizeWidthHeight__P_179_4(style, width, height) {
        if (style.width == null && width != null) {
          style.width = width + "px";
        }
        if (style.height == null && height != null) {
          style.height = height + "px";
        }
      },
      /**
       * Returns the dimension of the image by calling
       * {@link qx.util.ResourceManager} or {@link qx.io.ImageLoader}
       * depending on if the image is a managed one.
       *
       * @param source {String} image source
       * @return {Map} dimension of image
       */
      __getDimension__P_179_3(source) {
        var width = qx.util.ResourceManager.getInstance().getImageWidth(source) || qx.io.ImageLoader.getWidth(source);
        var height = qx.util.ResourceManager.getInstance().getImageHeight(source) || qx.io.ImageLoader.getHeight(source);
        return {
          width: width,
          height: height
        };
      },
      /**
       * Get all styles for IE browser which need to load the image
       * with the help of the AlphaImageLoader
       *
       * @param style {Map} style information
       * @param repeat {String} repeat mode
       * @param source {String} image source
       *
       * @return {Map} style infos
       */
      processAlphaFix(style, repeat, source) {
        if (repeat == "repeat" || repeat == "repeat-x" || repeat == "repeat-y") {
          return style;
        }
        var sizingMethod = repeat == "no-repeat" ? "crop" : "scale";
        var filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + qx.util.ResourceManager.getInstance().toUri(source) + "', sizingMethod='" + sizingMethod + "')";
        style.filter = filter;
        style.backgroundImage = style.backgroundRepeat = "";
        delete style["background-image"];
        delete style["background-repeat"];
        return {
          style: style
        };
      },
      /**
       * Process scaled images.
       *
       * @param style {Map} style information
       * @param repeat {String} repeat mode
       * @param source {String} image source
       *
       * @return {Map} image URI and style infos
       */
      __processScale__P_179_5(style, repeat, source) {
        var uri = qx.util.ResourceManager.getInstance().toUri(source);
        var dimension = this.__getDimension__P_179_3(source);
        this.__normalizeWidthHeight__P_179_4(style, dimension.width, dimension.height);
        return {
          src: uri,
          style: style
        };
      },
      /**
       * Process images which are either scaled horizontally or
       * vertically.
       *
       * @param style {Map} style information
       * @param repeat {String} repeat mode
       * @param sourceid {String} image resource id
       *
       * @return {Map} image URI and style infos
       */
      __processScaleXScaleY__P_179_6(style, repeat, sourceid) {
        var ResourceManager = qx.util.ResourceManager.getInstance();
        var clipped = ResourceManager.getCombinedFormat(sourceid);
        var dimension = this.__getDimension__P_179_3(sourceid);
        var uri;
        if (clipped) {
          var data = ResourceManager.getData(sourceid);
          var combinedid = data[4];
          if (clipped == "b64") {
            uri = ResourceManager.toDataUri(sourceid);
          } else {
            uri = ResourceManager.toUri(combinedid);
          }
          if (repeat === "scale-x") {
            style = this.__getStylesForClippedScaleX__P_179_8(style, data, dimension.height);
          } else {
            style = this.__getStylesForClippedScaleY__P_179_9(style, data, dimension.width);
          }
          return {
            src: uri,
            style: style
          };
        }

        // No clipped image available
        else {
          {
            this.__checkForPotentialClippedImage__P_179_10(sourceid);
          }
          if (repeat == "scale-x") {
            style.height = dimension.height == null ? null : dimension.height + "px";
            // note: width is given by the user
          } else if (repeat == "scale-y") {
            style.width = dimension.width == null ? null : dimension.width + "px";
            // note: height is given by the user
          }
          uri = ResourceManager.toUri(sourceid);
          return {
            src: uri,
            style: style
          };
        }
      },
      /**
       * Generates the style infos for horizontally scaled clipped images.
       *
       * @param style {Map} style infos
       * @param data {Array} image data retrieved from the {@link qx.util.ResourceManager}
       * @param height {Integer} image height
       *
       * @return {Map} style infos and image URI
       */
      __getStylesForClippedScaleX__P_179_8(style, data, height) {
        // Use clipped image (multi-images on x-axis)
        var imageHeight = qx.util.ResourceManager.getInstance().getImageHeight(data[4]);

        // Add size and clipping
        style.clip = {
          top: -data[6],
          height: height
        };
        style.height = imageHeight + "px";

        // note: width is given by the user

        // Fix user given y-coordinate to include the combined image offset
        if (style.top != null) {
          style.top = parseInt(style.top, 10) + data[6] + "px";
        } else if (style.bottom != null) {
          style.bottom = parseInt(style.bottom, 10) + height - imageHeight - data[6] + "px";
        }
        return style;
      },
      /**
       * Generates the style infos for vertically scaled clipped images.
       *
       * @param style {Map} style infos
       * @param data {Array} image data retrieved from the {@link qx.util.ResourceManager}
       * @param width {Integer} image width
       *
       * @return {Map} style infos and image URI
       */
      __getStylesForClippedScaleY__P_179_9(style, data, width) {
        // Use clipped image (multi-images on x-axis)
        var imageWidth = qx.util.ResourceManager.getInstance().getImageWidth(data[4]);

        // Add size and clipping
        style.clip = {
          left: -data[5],
          width: width
        };
        style.width = imageWidth + "px";

        // note: height is given by the user

        // Fix user given x-coordinate to include the combined image offset
        if (style.left != null) {
          style.left = parseInt(style.left, 10) + data[5] + "px";
        } else if (style.right != null) {
          style.right = parseInt(style.right, 10) + width - imageWidth - data[5] + "px";
        }
        return style;
      },
      /**
       * Process repeated images.
       *
       * @param style {Map} style information
       * @param repeat {String} repeat mode
       * @param sourceid {String} image resource id
       *
       * @return {Map} image URI and style infos
       */
      __processRepeats__P_179_7(style, repeat, sourceid) {
        var ResourceManager = qx.util.ResourceManager.getInstance();
        var clipped = ResourceManager.getCombinedFormat(sourceid);
        var dimension = this.__getDimension__P_179_3(sourceid);

        // Double axis repeats cannot be clipped
        if (clipped && repeat !== "repeat") {
          // data = [ 8, 5, "png", "qx", "qx/decoration/Modern/arrows-combined.png", -36, 0]
          var data = ResourceManager.getData(sourceid);
          var combinedid = data[4];
          if (clipped == "b64") {
            var uri = ResourceManager.toDataUri(sourceid);
            var offx = 0;
            var offy = 0;
          } else {
            var uri = ResourceManager.toUri(combinedid);
            var offx = data[5];
            var offy = data[6];

            // honor padding for combined images
            if (style.paddingTop || style.paddingLeft || style.paddingRight || style.paddingBottom) {
              var top = style.paddingTop || 0;
              var left = style.paddingLeft || 0;
              offx += style.paddingLeft || 0;
              offy += style.paddingTop || 0;
              style.clip = {
                left: left,
                top: top,
                width: dimension.width,
                height: dimension.height
              };
            }
          }
          var bg = qx.bom.element.Background.getStyles(uri, repeat, offx, offy);
          for (var key in bg) {
            style[key] = bg[key];
          }
          if (dimension.width != null && style.width == null && (repeat == "repeat-y" || repeat === "no-repeat")) {
            style.width = dimension.width + "px";
          }
          if (dimension.height != null && style.height == null && (repeat == "repeat-x" || repeat === "no-repeat")) {
            style.height = dimension.height + "px";
          }
          return {
            style: style
          };
        } else {
          // honor padding
          var top = style.paddingTop || 0;
          var left = style.paddingLeft || 0;
          style.backgroundPosition = left + "px " + top + "px";
          {
            if (repeat !== "repeat") {
              this.__checkForPotentialClippedImage__P_179_10(sourceid);
            }
          }
          this.__normalizeWidthHeight__P_179_4(style, dimension.width, dimension.height);
          this.__getStylesForSingleRepeat__P_179_11(style, sourceid, repeat);
          return {
            style: style
          };
        }
      },
      /**
       * Generate all style infos for single repeated images
       *
       * @param style {Map} style information
       * @param repeat {String} repeat mode
       * @param source {String} image source
       */
      __getStylesForSingleRepeat__P_179_11(style, source, repeat) {
        // retrieve the "backgroundPosition" style if available to prevent
        // overwriting with default values
        var top = null;
        var left = null;
        if (style.backgroundPosition) {
          var backgroundPosition = style.backgroundPosition.split(" ");
          left = parseInt(backgroundPosition[0], 10);
          if (isNaN(left)) {
            left = backgroundPosition[0];
          }
          top = parseInt(backgroundPosition[1], 10);
          if (isNaN(top)) {
            top = backgroundPosition[1];
          }
        }
        var bg = qx.bom.element.Background.getStyles(source, repeat, left, top);
        for (var key in bg) {
          style[key] = bg[key];
        }

        // Reset the AlphaImageLoader filter if applied
        // This prevents IE from setting BOTH CSS filter AND backgroundImage
        // This is only a fallback if the image is not recognized as PNG
        // If it's a Alpha-PNG file it *may* result in display problems
        if (style.filter) {
          style.filter = "";
        }
      },
      /**
       * Output a warning if the image can be clipped.
       *
       * @param source {String} image source
       */
      __checkForPotentialClippedImage__P_179_10(source) {
        if (this.DEBUG && qx.util.ResourceManager.getInstance().has(source) && source.indexOf("qx/icon") == -1) {
          if (!this.__warnings__P_179_0[source]) {
            qx.log.Logger.debug("Potential clipped image candidate: " + source);
            this.__warnings__P_179_0[source] = true;
          }
        }
      }
    }
  });
  qx.bom.element.Decoration.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "construct": true,
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.html.Element": {
        "construct": true,
        "require": true
      },
      "qx.theme.manager.Color": {
        "construct": true
      },
      "qx.bom.client.Engine": {
        "construct": true,
        "require": true
      },
      "qx.util.ResourceManager": {
        "construct": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "construct": true,
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
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The blocker element is used to block interaction with the application.
   *
   * It is usually transparent or semi-transparent and blocks all events from
   * the underlying elements.
   */
  qx.Class.define("qx.html.Blocker", {
    extend: qx.html.Element,
    /**
     * @param backgroundColor {Color?null} the blocker's background color. This
     *    color can be themed and will be resolved by the blocker.
     * @param opacity {Number?0} The blocker's opacity
     */
    construct(backgroundColor, opacity) {
      var backgroundColor = backgroundColor ? qx.theme.manager.Color.getInstance().resolve(backgroundColor) : null;
      var styles = {
        position: "absolute",
        opacity: opacity || 0,
        backgroundColor: backgroundColor
      };

      // IE needs some extra love here to convince it to block events.
      if (qx.core.Environment.get("engine.name") == "mshtml") {
        styles.backgroundImage = "url(" + qx.util.ResourceManager.getInstance().toUri("qx/static/blank.gif") + ")";
        styles.backgroundRepeat = "repeat";
      }
      qx.html.Element.constructor.call(this, "div", styles);
      this.addListener("mousedown", this._stopPropagation, this);
      this.addListener("mouseup", this._stopPropagation, this);
      this.addListener("click", this._stopPropagation, this);
      this.addListener("dblclick", this._stopPropagation, this);
      this.addListener("mousemove", this._stopPropagation, this);
      this.addListener("mouseover", this._stopPropagation, this);
      this.addListener("mouseout", this._stopPropagation, this);
      this.addListener("mousewheel", this._stopPropagation, this);
      this.addListener("roll", this._stopPropagation, this);
      this.addListener("contextmenu", this._stopPropagation, this);
      this.addListener("pointerdown", this._stopPropagation, this);
      this.addListener("pointerup", this._stopPropagation, this);
      this.addListener("pointermove", this._stopPropagation, this);
      this.addListener("pointerover", this._stopPropagation, this);
      this.addListener("pointerout", this._stopPropagation, this);
      this.addListener("tap", this._stopPropagation, this);
      this.addListener("dbltap", this._stopPropagation, this);
      this.addListener("swipe", this._stopPropagation, this);
      this.addListener("longtap", this._stopPropagation, this);
      this.addListener("appear", this.__refreshCursor__P_182_0, this);
      this.addListener("disappear", this.__refreshCursor__P_182_0, this);
    },
    members: {
      /**
       * Stop the event propagation from the passed event.
       *
       * @param e {qx.event.type.Mouse} mouse event to stop propagation.
       */
      _stopPropagation(e) {
        e.stopPropagation();
      },
      /**
       * Refreshes the cursor by setting it to <code>null</code> and then to the
       * old value.
       */
      __refreshCursor__P_182_0() {
        var currentCursor = this.getStyle("cursor");
        this.setStyle("cursor", null, true);
        this.setStyle("cursor", currentCursor, true);
      }
    }
  });
  qx.html.Blocker.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.theme.manager.Decoration": {}
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
  
  ************************************************************************ */

  /**
   * Common set of utility methods used by the standard qooxdoo layouts.
   *
   * @internal
   */
  qx.Class.define("qx.ui.layout.Util", {
    statics: {
      /** @type {RegExp} Regular expression to match percent values */
      PERCENT_VALUE: /[0-9]+(?:\.[0-9]+)?%/,
      /**
       * Computes the flex offsets needed to reduce the space
       * difference as much as possible by respecting the
       * potential of the given elements (being in the range of
       * their min/max values)
       *
       * @param flexibles {Map} Each entry must have these keys:
       *   <code>id</code>, <code>potential</code> and <code>flex</code>.
       *   The ID is used in the result map as the key for the user to work
       *   with later (e.g. upgrade sizes etc. to respect the given offset)
       *   The potential is an integer value which is the difference of the
       *   currently interesting direction (e.g. shrinking=width-minWidth, growing=
       *   maxWidth-width). The flex key holds the flex value of the item.
       * @param avail {Integer} Full available space to allocate (ignoring used one)
       * @param used {Integer} Size of already allocated space
       * @return {Map} A map which contains the calculated offsets under the key
       *   which is identical to the ID given in the incoming map.
       */
      computeFlexOffsets(flexibles, avail, used) {
        var child, key, flexSum, flexStep;
        var grow = avail > used;
        var remaining = Math.abs(avail - used);
        var roundingOffset, currentOffset;

        // Preprocess data
        var result = {};
        for (key in flexibles) {
          child = flexibles[key];
          result[key] = {
            potential: grow ? child.max - child.value : child.value - child.min,
            flex: grow ? child.flex : 1 / child.flex,
            offset: 0
          };
        }

        // Continue as long as we need to do anything
        while (remaining != 0) {
          // Find minimum potential for next correction
          flexStep = Infinity;
          flexSum = 0;
          for (key in result) {
            child = result[key];
            if (child.potential > 0) {
              flexSum += child.flex;
              flexStep = Math.min(flexStep, child.potential / child.flex);
            }
          }

          // No potential found, quit here
          if (flexSum == 0) {
            break;
          }

          // Respect maximum potential given through remaining space
          // The parent should always win in such conflicts.
          flexStep = Math.min(remaining, flexStep * flexSum) / flexSum;

          // Start with correction
          roundingOffset = 0;
          for (key in result) {
            child = result[key];
            if (child.potential > 0) {
              // Compute offset for this step
              currentOffset = Math.min(remaining, child.potential, Math.ceil(flexStep * child.flex));

              // Fix rounding issues
              roundingOffset += currentOffset - flexStep * child.flex;
              if (roundingOffset >= 1) {
                roundingOffset -= 1;
                currentOffset -= 1;
              }

              // Update child status
              child.potential -= currentOffset;
              if (grow) {
                child.offset += currentOffset;
              } else {
                child.offset -= currentOffset;
              }

              // Update parent status
              remaining -= currentOffset;
            }
          }
        }
        return result;
      },
      /**
       * Computes the offset which needs to be added to the top position
       * to result in the stated vertical alignment. Also respects
       * existing margins (without collapsing).
       *
       * @param align {String} One of <code>top</code>, <code>center</code> or <code>bottom</code>.
       * @param width {Integer} The visible width of the widget
       * @param availWidth {Integer} The available inner width of the parent
       * @param marginLeft {Integer?0} Optional left margin of the widget
       * @param marginRight {Integer?0} Optional right margin of the widget
       * @return {Integer} Computed top coordinate
       */
      computeHorizontalAlignOffset(align, width, availWidth, marginLeft, marginRight) {
        if (marginLeft == null) {
          marginLeft = 0;
        }
        if (marginRight == null) {
          marginRight = 0;
        }
        var value = 0;
        switch (align) {
          case "left":
            value = marginLeft;
            break;
          case "right":
            // Align right changes priority to right edge:
            // To align to the right is more important here than to left.
            value = availWidth - width - marginRight;
            break;
          case "center":
            // Ideal center position
            value = Math.round((availWidth - width) / 2);

            // Try to make this possible (with left-right priority)
            if (value < marginLeft) {
              value = marginLeft;
            } else if (value < marginRight) {
              value = Math.max(marginLeft, availWidth - width - marginRight);
            }
            break;
        }
        return value;
      },
      /**
       * Computes the offset which needs to be added to the top position
       * to result in the stated vertical alignment. Also respects
       * existing margins (without collapsing).
       *
       * @param align {String} One of <code>top</code>, <code>middle</code> or <code>bottom</code>.
       * @param height {Integer} The visible height of the widget
       * @param availHeight {Integer} The available inner height of the parent
       * @param marginTop {Integer?0} Optional top margin of the widget
       * @param marginBottom {Integer?0} Optional bottom margin of the widget
       * @return {Integer} Computed top coordinate
       */
      computeVerticalAlignOffset(align, height, availHeight, marginTop, marginBottom) {
        if (marginTop == null) {
          marginTop = 0;
        }
        if (marginBottom == null) {
          marginBottom = 0;
        }
        var value = 0;
        switch (align) {
          case "top":
            value = marginTop;
            break;
          case "bottom":
            // Align bottom changes priority to bottom edge:
            // To align to the bottom is more important here than to top.
            value = availHeight - height - marginBottom;
            break;
          case "middle":
            // Ideal middle position
            value = Math.round((availHeight - height) / 2);

            // Try to make this possible (with top-down priority)
            if (value < marginTop) {
              value = marginTop;
            } else if (value < marginBottom) {
              value = Math.max(marginTop, availHeight - height - marginBottom);
            }
            break;
        }
        return value;
      },
      /**
       * Collapses two margins.
       *
       * Supports positive and negative margins.
       * Collapsing find the largest positive and the largest
       * negative value. Afterwards the result is computed through the
       * subtraction of the negative from the positive value.
       *
       * @param varargs {arguments} Any number of configured margins
       * @return {Integer} The collapsed margin
       */
      collapseMargins(varargs) {
        var max = 0,
          min = 0;
        for (var i = 0, l = arguments.length; i < l; i++) {
          var value = arguments[i];
          if (value < 0) {
            min = Math.min(min, value);
          } else if (value > 0) {
            max = Math.max(max, value);
          }
        }
        return max + min;
      },
      /**
       * Computes the sum of all horizontal gaps. Normally the
       * result is used to compute the available width in a widget.
       *
       * The method optionally respects margin collapsing as well. In
       * this mode the spacing is collapsed together with the margins.
       *
       * @param children {Array} List of children
       * @param spacing {Integer?0} Spacing between every child
       * @param collapse {Boolean?false} Optional margin collapsing mode
       * @return {Integer} Sum of all gaps in the final layout.
       */
      computeHorizontalGaps(children, spacing, collapse) {
        if (spacing == null) {
          spacing = 0;
        }
        var gaps = 0;
        if (collapse) {
          // Add first child
          gaps += children[0].getMarginLeft();
          for (var i = 1, l = children.length; i < l; i += 1) {
            gaps += this.collapseMargins(spacing, children[i - 1].getMarginRight(), children[i].getMarginLeft());
          }

          // Add last child
          gaps += children[l - 1].getMarginRight();
        } else {
          // Simple adding of all margins
          for (var i = 1, l = children.length; i < l; i += 1) {
            gaps += children[i].getMarginLeft() + children[i].getMarginRight();
          }

          // Add spacing
          gaps += spacing * (l - 1);
        }
        return gaps;
      },
      /**
       * Computes the sum of all vertical gaps. Normally the
       * result is used to compute the available height in a widget.
       *
       * The method optionally respects margin collapsing as well. In
       * this mode the spacing is collapsed together with the margins.
       *
       * @param children {Array} List of children
       * @param spacing {Integer?0} Spacing between every child
       * @param collapse {Boolean?false} Optional margin collapsing mode
       * @return {Integer} Sum of all gaps in the final layout.
       */
      computeVerticalGaps(children, spacing, collapse) {
        if (spacing == null) {
          spacing = 0;
        }
        var gaps = 0;
        if (collapse) {
          // Add first child
          gaps += children[0].getMarginTop();
          for (var i = 1, l = children.length; i < l; i += 1) {
            gaps += this.collapseMargins(spacing, children[i - 1].getMarginBottom(), children[i].getMarginTop());
          }

          // Add last child
          gaps += children[l - 1].getMarginBottom();
        } else {
          // Simple adding of all margins
          for (var i = 1, l = children.length; i < l; i += 1) {
            gaps += children[i].getMarginTop() + children[i].getMarginBottom();
          }

          // Add spacing
          gaps += spacing * (l - 1);
        }
        return gaps;
      },
      /**
       * Computes the gaps together with the configuration of separators.
       *
       * @param children {qx.ui.core.LayoutItem[]} List of children
       * @param spacing {Integer} Configured spacing
       * @param separator {String|qx.ui.decoration.IDecorator} Separator to render
       * @return {Integer} Sum of gaps
       */
      computeHorizontalSeparatorGaps(children, spacing, separator) {
        var instance = qx.theme.manager.Decoration.getInstance().resolve(separator);
        var insets = instance.getInsets();
        var width = insets.left + insets.right;
        var gaps = 0;
        for (var i = 0, l = children.length; i < l; i++) {
          var child = children[i];
          gaps += child.getMarginLeft() + child.getMarginRight();
        }
        gaps += (spacing + width + spacing) * (l - 1);
        return gaps;
      },
      /**
       * Computes the gaps together with the configuration of separators.
       *
       * @param children {qx.ui.core.LayoutItem[]} List of children
       * @param spacing {Integer} Configured spacing
       * @param separator {String|qx.ui.decoration.IDecorator} Separator to render
       * @return {Integer} Sum of gaps
       */
      computeVerticalSeparatorGaps(children, spacing, separator) {
        var instance = qx.theme.manager.Decoration.getInstance().resolve(separator);
        var insets = instance.getInsets();
        var height = insets.top + insets.bottom;
        var gaps = 0;
        for (var i = 0, l = children.length; i < l; i++) {
          var child = children[i];
          gaps += child.getMarginTop() + child.getMarginBottom();
        }
        gaps += (spacing + height + spacing) * (l - 1);
        return gaps;
      },
      /**
       * Arranges two sizes in one box to best respect their individual limitations.
       *
       * Mainly used by split layouts (Split Panes) where the layout is mainly defined
       * by the outer dimensions.
       *
       * @param beginMin {Integer} Minimum size of first widget (from size hint)
       * @param beginIdeal {Integer} Ideal size of first widget (maybe after dragging the splitter)
       * @param beginMax {Integer} Maximum size of first widget (from size hint)
       * @param endMin {Integer} Minimum size of second widget (from size hint)
       * @param endIdeal {Integer} Ideal size of second widget (maybe after dragging the splitter)
       * @param endMax {Integer} Maximum size of second widget (from size hint)
       * @return {Map} Map with the keys <code>begin</code and <code>end</code> with the
       *   arranged dimensions.
       */
      arrangeIdeals(beginMin, beginIdeal, beginMax, endMin, endIdeal, endMax) {
        if (beginIdeal < beginMin || endIdeal < endMin) {
          if (beginIdeal < beginMin && endIdeal < endMin) {
            // Just increase both, can not rearrange them otherwise
            // Result into overflowing of the overlapping content
            // Should normally not happen through auto sizing!
            beginIdeal = beginMin;
            endIdeal = endMin;
          } else if (beginIdeal < beginMin) {
            // Reduce end, increase begin to min
            endIdeal -= beginMin - beginIdeal;
            beginIdeal = beginMin;

            // Re-check to keep min size of end
            if (endIdeal < endMin) {
              endIdeal = endMin;
            }
          } else if (endIdeal < endMin) {
            // Reduce begin, increase end to min
            beginIdeal -= endMin - endIdeal;
            endIdeal = endMin;

            // Re-check to keep min size of begin
            if (beginIdeal < beginMin) {
              beginIdeal = beginMin;
            }
          }
        }
        if (beginIdeal > beginMax || endIdeal > endMax) {
          if (beginIdeal > beginMax && endIdeal > endMax) {
            // Just reduce both, can not rearrange them otherwise
            // Leaves a blank area in the pane!
            beginIdeal = beginMax;
            endIdeal = endMax;
          } else if (beginIdeal > beginMax) {
            // Increase end, reduce begin to max
            endIdeal += beginIdeal - beginMax;
            beginIdeal = beginMax;

            // Re-check to keep max size of end
            if (endIdeal > endMax) {
              endIdeal = endMax;
            }
          } else if (endIdeal > endMax) {
            // Increase begin, reduce end to max
            beginIdeal += endIdeal - endMax;
            endIdeal = endMax;

            // Re-check to keep max size of begin
            if (beginIdeal > beginMax) {
              beginIdeal = beginMax;
            }
          }
        }
        return {
          begin: beginIdeal,
          end: endIdeal
        };
      }
    }
  });
  qx.ui.layout.Util.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.locale.Manager": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Assert": {}
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
   * Static class that provides localized date information (like names of week
   * days, AM/PM markers, start of week, etc.).
   *
   * @cldr()
   */
  qx.Class.define("qx.locale.Date", {
    statics: {
      /**
       * Reference to the locale manager.
       *
       * @internal
       */
      __mgr__P_192_0: qx.locale.Manager.getInstance(),
      /**
       * Get AM marker for time definitions
       *
       * @param locale {String} optional locale to be used
       * @return {String} translated AM marker.
       */
      getAmMarker(locale) {
        return this.__mgr__P_192_0.localize("cldr_am", [], locale);
      },
      /**
       * Get PM marker for time definitions
       *
       * @param locale {String} optional locale to be used
       * @return {String} translated PM marker.
       */
      getPmMarker(locale) {
        return this.__mgr__P_192_0.localize("cldr_pm", [], locale);
      },
      /**
       * Return localized names of day names
       *
       * @param length {String} format of the day names.
       *       Possible values: "abbreviated", "narrow", "wide"
       * @param locale {String} optional locale to be used
       * @param context {String} (default: "format") intended context.
       *       Possible values: "format", "stand-alone"
       * @param withFallback {Boolean?} if true, the previous parameter's other value is tried
       * in order to find a localized name for the day
       * @return {String[]} array of localized day names starting with sunday.
       */
      getDayNames(length, locale, context, withFallback) {
        var context = context ? context : "format";
        {
          qx.core.Assert.assertInArray(length, ["abbreviated", "narrow", "wide"]);
          qx.core.Assert.assertInArray(context, ["format", "stand-alone"]);
        }
        var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var names = [];
        for (var i = 0; i < days.length; i++) {
          var key = "cldr_day_" + context + "_" + length + "_" + days[i];
          names.push(withFallback ? this.__localizeWithFallback__P_192_1(context, context === "format" ? "stand-alone" : "format", key, locale) : this.__mgr__P_192_0.localize(key, [], locale));
        }
        return names;
      },
      /**
       * Return localized name of a week day name
       *
       * @param length {String} format of the day name.
       *       Possible values: "abbreviated", "narrow", "wide"
       * @param day {Integer} day number. 0=sunday, 1=monday, ...
       * @param locale {String} optional locale to be used
       * @param context {String} (default: "format") intended context.
       *       Possible values: "format", "stand-alone"
       * @param withFallback {Boolean?} if true, the previous parameter's other value is tried
       * in order to find a localized name for the day
       * @return {String} localized day name
       */
      getDayName(length, day, locale, context, withFallback) {
        var context = context ? context : "format";
        {
          qx.core.Assert.assertInArray(length, ["abbreviated", "narrow", "wide"]);
          qx.core.Assert.assertInteger(day);
          qx.core.Assert.assertInRange(day, 0, 6);
          qx.core.Assert.assertInArray(context, ["format", "stand-alone"]);
        }
        var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var key = "cldr_day_" + context + "_" + length + "_" + days[day];
        return withFallback ? this.__localizeWithFallback__P_192_1(context, context === "format" ? "stand-alone" : "format", key, locale) : this.__mgr__P_192_0.localize(key, [], locale);
      },
      /**
       * Return localized names of month names
       *
       * @param length {String} format of the month names.
       *       Possible values: "abbreviated", "narrow", "wide"
       * @param locale {String} optional locale to be used
       * @param context {String} (default: "format") intended context.
       *       Possible values: "format", "stand-alone"
       * @param withFallback {Boolean?} if true, the previous parameter's other value is tried
       * in order to find a localized name for the month
       * @return {String[]} array of localized month names starting with january.
       */
      getMonthNames(length, locale, context, withFallback) {
        var context = context ? context : "format";
        {
          qx.core.Assert.assertInArray(length, ["abbreviated", "narrow", "wide"]);
          qx.core.Assert.assertInArray(context, ["format", "stand-alone"]);
        }
        var names = [];
        for (var i = 0; i < 12; i++) {
          var key = "cldr_month_" + context + "_" + length + "_" + (i + 1);
          names.push(withFallback ? this.__localizeWithFallback__P_192_1(context, context === "format" ? "stand-alone" : "format", key, locale) : this.__mgr__P_192_0.localize(key, [], locale));
        }
        return names;
      },
      /**
       * Return localized name of a month
       *
       * @param length {String} format of the month names.
       *       Possible values: "abbreviated", "narrow", "wide"
       * @param month {Integer} index of the month. 0=january, 1=february, ...
       * @param locale {String} optional locale to be used
       * @param context {String} (default: "format") intended context.
       *       Possible values: "format", "stand-alone"
       * @param withFallback {Boolean?} if true, the previous parameter's other value is tried
       * in order to find a localized name for the month
       * @return {String} localized month name
       */
      getMonthName(length, month, locale, context, withFallback) {
        var context = context ? context : "format";
        {
          qx.core.Assert.assertInArray(length, ["abbreviated", "narrow", "wide"]);
          qx.core.Assert.assertInArray(context, ["format", "stand-alone"]);
        }
        var key = "cldr_month_" + context + "_" + length + "_" + (month + 1);
        return withFallback ? this.__localizeWithFallback__P_192_1(context, context === "format" ? "stand-alone" : "format", key, locale) : this.__mgr__P_192_0.localize(key, [], locale);
      },
      /**
       * Return localized date format string to be used with {@link qx.util.format.DateFormat}.
       *
       * @param size {String} format of the date format.
       *      Possible values: "short", "medium", "long", "full"
       * @param locale {String?} optional locale to be used
       * @return {String} localized date format string
       */
      getDateFormat(size, locale) {
        {
          qx.core.Assert.assertInArray(size, ["short", "medium", "long", "full"]);
        }
        var key = "cldr_date_format_" + size;
        return this.__mgr__P_192_0.localize(key, [], locale);
      },
      /**
       * Try to localize a date/time format string. For format string possibilities see
       * <a href="http://cldr.unicode.org/translation/date-time">Date/Time Symbol reference</a>
       * at CLDR - Unicode Common Locale Data Repository.
       *
       * If no localization is available take the fallback format string.
       *
       * @param canonical {String} format string containing only field information, and in a canonical order.
       *       Examples are "yyyyMMMM" for year + full month, or "MMMd" for abbreviated month + day.
       * @param fallback {String} fallback format string if no localized version is found
       * @param locale {String} optional locale to be used
       * @return {String} best matching format string
       */
      getDateTimeFormat(canonical, fallback, locale) {
        var key = "cldr_date_time_format_" + canonical;
        var localizedFormat = this.__mgr__P_192_0.localize(key, [], locale);
        if (localizedFormat == key) {
          localizedFormat = fallback;
        }
        return localizedFormat;
      },
      /**
       * Return localized time format string to be used with {@link qx.util.format.DateFormat}.
       *
       * @param size {String} format of the time pattern.
       *      Possible values: "short", "medium", "long", "full"
       * @param locale {String} optional locale to be used
       * @return {String} localized time format string
       */
      getTimeFormat(size, locale) {
        {
          qx.core.Assert.assertInArray(size, ["short", "medium", "long", "full"]);
        }
        var key = "cldr_time_format_" + size;
        var localizedFormat = this.__mgr__P_192_0.localize(key, [], locale);
        if (localizedFormat != key) {
          return localizedFormat;
        }
        switch (size) {
          case "short":
          case "medium":
            return qx.locale.Date.getDateTimeFormat("HHmm", "HH:mm");
          case "long":
            return qx.locale.Date.getDateTimeFormat("HHmmss", "HH:mm:ss");
          case "full":
            return qx.locale.Date.getDateTimeFormat("HHmmsszz", "HH:mm:ss zz");
          default:
            throw new Error("This case should never happen.");
        }
      },
      /**
       * Return the day the week starts with
       *
       * Reference: Common Locale Data Repository (cldr) supplementalData.xml
       *
       * @param locale {String} optional locale to be used
       * @return {Integer} index of the first day of the week. 0=sunday, 1=monday, ...
       */
      getWeekStart(locale) {
        var weekStart = {
          // default is monday
          MV: 5,
          // friday
          AE: 6,
          // saturday
          AF: 6,
          BH: 6,
          DJ: 6,
          DZ: 6,
          EG: 6,
          ER: 6,
          ET: 6,
          IQ: 6,
          IR: 6,
          JO: 6,
          KE: 6,
          KW: 6,
          LB: 6,
          LY: 6,
          MA: 6,
          OM: 6,
          QA: 6,
          SA: 6,
          SD: 6,
          SO: 6,
          TN: 6,
          YE: 6,
          AS: 0,
          // sunday
          AU: 0,
          AZ: 0,
          BW: 0,
          CA: 0,
          CN: 0,
          FO: 0,
          GE: 0,
          GL: 0,
          GU: 0,
          HK: 0,
          IE: 0,
          IL: 0,
          IS: 0,
          JM: 0,
          JP: 0,
          KG: 0,
          KR: 0,
          LA: 0,
          MH: 0,
          MN: 0,
          MO: 0,
          MP: 0,
          MT: 0,
          NZ: 0,
          PH: 0,
          PK: 0,
          SG: 0,
          TH: 0,
          TT: 0,
          TW: 0,
          UM: 0,
          US: 0,
          UZ: 0,
          VI: 0,
          ZA: 0,
          ZW: 0,
          MW: 0,
          NG: 0,
          TJ: 0
        };
        var territory = qx.locale.Date._getTerritory(locale);

        // default is monday
        return weekStart[territory] != null ? weekStart[territory] : 1;
      },
      /**
       * Return the day the weekend starts with
       *
       * Reference: Common Locale Data Repository (cldr) supplementalData.xml
       *
       * @param locale {String} optional locale to be used
       * @return {Integer} index of the first day of the weekend. 0=sunday, 1=monday, ...
       */
      getWeekendStart(locale) {
        var weekendStart = {
          // default is saturday
          EG: 5,
          // friday
          IL: 5,
          SY: 5,
          IN: 0,
          // sunday
          AE: 4,
          // thursday
          BH: 4,
          DZ: 4,
          IQ: 4,
          JO: 4,
          KW: 4,
          LB: 4,
          LY: 4,
          MA: 4,
          OM: 4,
          QA: 4,
          SA: 4,
          SD: 4,
          TN: 4,
          YE: 4
        };
        var territory = qx.locale.Date._getTerritory(locale);

        // default is saturday
        return weekendStart[territory] != null ? weekendStart[territory] : 6;
      },
      /**
       * Return the day the weekend ends with
       *
       * Reference: Common Locale Data Repository (cldr) supplementalData.xml
       *
       * @param locale {String} optional locale to be used
       * @return {Integer} index of the last day of the weekend. 0=sunday, 1=monday, ...
       */
      getWeekendEnd(locale) {
        var weekendEnd = {
          // default is sunday
          AE: 5,
          // friday
          BH: 5,
          DZ: 5,
          IQ: 5,
          JO: 5,
          KW: 5,
          LB: 5,
          LY: 5,
          MA: 5,
          OM: 5,
          QA: 5,
          SA: 5,
          SD: 5,
          TN: 5,
          YE: 5,
          AF: 5,
          IR: 5,
          EG: 6,
          // saturday
          IL: 6,
          SY: 6
        };
        var territory = qx.locale.Date._getTerritory(locale);

        // default is sunday
        return weekendEnd[territory] != null ? weekendEnd[territory] : 0;
      },
      /**
       * Returns whether a certain day of week belongs to the week end.
       *
       * @param day {Integer} index of the day. 0=sunday, 1=monday, ...
       * @param locale {String} optional locale to be used
       * @return {Boolean} whether the given day is a weekend day
       */
      isWeekend(day, locale) {
        var weekendStart = qx.locale.Date.getWeekendStart(locale);
        var weekendEnd = qx.locale.Date.getWeekendEnd(locale);
        if (weekendEnd > weekendStart) {
          return day >= weekendStart && day <= weekendEnd;
        } else {
          return day >= weekendStart || day <= weekendEnd;
        }
      },
      /**
       * Extract the territory part from a locale
       *
       * @param locale {String} the locale
       * @return {String} territory
       */
      _getTerritory(locale) {
        if (locale) {
          var territory = locale.split("_")[1] || locale;
        } else {
          territory = this.__mgr__P_192_0.getTerritory() || this.__mgr__P_192_0.getLanguage();
        }
        return territory.toUpperCase();
      },
      /**
       * Provide localization (CLDR) data with fallback between "format" and "stand-alone" contexts.
       * It is used in {@link #getDayName} and {@link #getMonthName} methods.
       *
       * @param context {String} intended context.
       *       Possible values: "format", "stand-alone".
       * @param fallbackContext {String} the context used in case no localization is found for the key.
       * @param key {String} message id (may contain format strings)
       * @param locale {String} the locale
       * @return {String} localized name for the key
       *
       */
      __localizeWithFallback__P_192_1(context, fallbackContext, key, locale) {
        var localizedString = this.__mgr__P_192_0.localize(key, [], locale);
        if (localizedString == key) {
          var newKey = key.replace("_" + context + "_", "_" + fallbackContext + "_");
          return this.__mgr__P_192_0.localize(newKey, [], locale);
        } else {
          return localizedString;
        }
      }
    }
  });
  qx.locale.Date.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.Part": {},
      "qx.bom.request.Script": {},
      "qx.bom.client.Engine": {}
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The Package wraps a list of related script URLs, which are required by one
   * or more parts.
   *
   * @internal
   * @ignore(qx.util.ResourceManager)
   */
  qx.Bootstrap.define("qx.io.part.Package", {
    /**
     * @param urls {String[]} A list of script URLs
     * @param id {var} Unique package hash key
     * @param loaded {Boolean?false} Whether the package is already loaded
     */
    construct(urls, id, loaded) {
      this.__readyState__P_136_0 = loaded ? "complete" : "initialized";
      this.__urls__P_136_1 = urls;
      this.__id__P_136_2 = id;
    },
    members: {
      __readyState__P_136_0: null,
      __urls__P_136_1: null,
      __id__P_136_2: null,
      __closure__P_136_3: null,
      __loadWithClosure__P_136_4: null,
      __timeoutId__P_136_5: null,
      __notifyPackageResult__P_136_6: null,
      /**
       * Get the package ID.
       *
       * @return {String} The package id
       */
      getId() {
        return this.__id__P_136_2;
      },
      /**
       * Get the ready state of the package. The value is one of
       * <ul>
       * <li>
       *   <b>initialized</b>: The package is initialized. The {@link #load}
       *   method has not yet been called
       * </li>
       * <li><b>loading</b>: The package is still loading.</li>
       * <li><b>complete</b>: The package has been loaded successfully</li>
       * <li><b>cached</b>: The package is loaded but is not executed
       *   (for closure parts)</li>
       * </li>
       *
       * @return {String} The ready state.
       */
      getReadyState() {
        return this.__readyState__P_136_0;
      },
      /**
       * Returns the urlsstored stored in the package.
       *
       * @internal
       * @return {String[]} An array of urls of this package.
       */
      getUrls() {
        return this.__urls__P_136_1;
      },
      /**
       * Method for storing the closure for this package. This is only relevant
       * if a {@link qx.io.part.ClosurePart} is used.
       *
       * @param closure {Function} The code of this package wrapped in a closure.
       */
      saveClosure(closure) {
        if (this.__readyState__P_136_0 == "error") {
          return;
        }
        this.__closure__P_136_3 = closure;
        if (!this.__loadWithClosure__P_136_4) {
          this.execute();
        } else {
          clearTimeout(this.__timeoutId__P_136_5);
          this.__readyState__P_136_0 = "cached";
          this.__notifyPackageResult__P_136_6(this);
        }
      },
      /**
       * Executes the stored closure. This is only relevant if a
       * {@link qx.io.part.ClosurePart} is used.
       */
      execute() {
        if (this.__closure__P_136_3) {
          this.__closure__P_136_3();
          delete this.__closure__P_136_3;
        }
        if (qx.$$packageData[this.__id__P_136_2]) {
          this.__importPackageData__P_136_7(qx.$$packageData[this.__id__P_136_2]);
          delete qx.$$packageData[this.__id__P_136_2];
        }
        this.__readyState__P_136_0 = "complete";
      },
      /**
       * Load method if the package loads a closure. This is only relevant if a
       * {@link qx.io.part.ClosurePart} is used.
       *
       * @param notifyPackageResult {Function} The callback if all scripts are
       *   done loading in this package.
       * @param self {Object?} The context of the callback.
       */
      loadClosure(notifyPackageResult, self) {
        if (this.__readyState__P_136_0 !== "initialized") {
          return;
        }
        this.__loadWithClosure__P_136_4 = true;
        this.__readyState__P_136_0 = "loading";
        this.__notifyPackageResult__P_136_6 = qx.Bootstrap.bind(notifyPackageResult, self);
        this.__loadScriptList__P_136_8(this.__urls__P_136_1, function () {}, function () {
          this.__readyState__P_136_0 = "error";
          notifyPackageResult.call(self, this);
        }, this);
        var pkg = this;
        this.__timeoutId__P_136_5 = setTimeout(function () {
          pkg.__readyState__P_136_0 = "error";
          notifyPackageResult.call(self, pkg);
        }, qx.Part.TIMEOUT);
      },
      /**
       * Load the part's script URLs in the correct order.
       *
       * @param notifyPackageResult {Function} The callback if all scripts are
       *   done loading in this package.
       * @param self {Object?} The context of the callback.
       */
      load(notifyPackageResult, self) {
        if (this.__readyState__P_136_0 !== "initialized") {
          return;
        }
        this.__loadWithClosure__P_136_4 = false;
        this.__readyState__P_136_0 = "loading";
        this.__loadScriptList__P_136_8(this.__urls__P_136_1, function () {
          this.__readyState__P_136_0 = "complete";
          this.execute();
          notifyPackageResult.call(self, this);
        }, function () {
          this.__readyState__P_136_0 = "error";
          notifyPackageResult.call(self, this);
        }, this);
      },
      /**
       * Loads a list of scripts in the correct order.
       *
       * @param urlList {String[]} List of script urls
       * @param callback {Function} Function to execute on completion
       * @param errBack {Function} Function to execute on error
       * @param self {Object?window} Context to execute the given function in
       */
      __loadScriptList__P_136_8(urlList, callback, errBack, self) {
        if (urlList.length == 0) {
          callback.call(self);
          return;
        }
        var urlsLoaded = 0;
        var self = this;
        var loadScripts = function (urls) {
          if (urlsLoaded >= urlList.length) {
            callback.call(self);
            return;
          }
          var loader = new qx.bom.request.Script();
          loader.open("GET", urls.shift());
          loader.onload = function () {
            urlsLoaded += 1;
            loader.dispose();

            // Important to use engine detection directly to keep the minimal
            // package size small [BUG #5068]
            if (qx.bom.client.Engine.getName() == "webkit") {
              // force asynchronous load
              // Safari fails with an "maximum recursion depth exceeded" error if it is
              // called sync.
              setTimeout(function () {
                loadScripts.call(self, urls, callback, self);
              }, 0);
            } else {
              loadScripts.call(self, urls, callback, self);
            }
          };
          loader.onerror = function () {
            if (self.__readyState__P_136_0 == "loading") {
              clearTimeout(self.__timeoutId__P_136_5);
              loader.dispose();
              return errBack.call(self);
            }
          };

          // Force loading script asynchronously (IE may load synchronously)
          window.setTimeout(function () {
            loader.send();
          });
        };
        loadScripts(urlList.concat());
      },
      /**
       * Import the data of a package. The function is defined in the loader
       * script.
       *
       * @signature function(packageData)
       * @param packageData {Map} Map of package data categories ("resources",...)
       */
      __importPackageData__P_136_7: qx.$$loader.importPackageData
    }
  });
  qx.io.part.Package.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
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
       * Fabian Jakobs (fjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Wrapper for a part as defined in the config file. This class knows about all
   * packages the part depends on and provides functionality to load the part.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.io.part.Part", {
    /**
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @param packages {qx.io.part.Package[]} List of dependent packages
     * @param loader {qx.Part} The loader of this part.
     */
    construct(name, packages, loader) {
      this.__name__P_138_0 = name;
      this._readyState = "complete";
      this._packages = packages;
      this._loader = loader;
      for (var i = 0; i < packages.length; i++) {
        if (packages[i].getReadyState() !== "complete") {
          this._readyState = "initialized";
          break;
        }
      }
    },
    members: {
      _readyState: null,
      _loader: null,
      _packages: null,
      __name__P_138_0: null,
      /**
       * Get the ready state of the part. The value is one of
       * <ul>
       * <li>
       *   <b>initialized</b>: The part is initialized. The {@link #load}
       *   method has not yet been called
       * </li>
       * <li><b>loading</b>: The part is still loading.</li>
       * <li><b>complete</b>: The part has been loaded successfully</li>
       * </li>
       *
       * @return {String} The ready state.
       */
      getReadyState() {
        return this._readyState;
      },
      /**
       * The part name as defined in the config file
       *
       * @return {String} The part name
       */
      getName() {
        return this.__name__P_138_0;
      },
      /**
       * Internal helper for testing purposes.
       * @internal
       * @return {qx.io.part.Package[]} All contained packages in an array.
       */
      getPackages() {
        return this._packages;
      },
      /**
       * Method for preloading this part.
       * Empty implementation! Regular parts can not be preloaded.
       *
       * @param callback {Function} Callback for the preload.
       * @param self {Object?} The context of the callback.
       */
      preload(callback, self) {
        // Just do nothing because you can not preload regular parts.
        // Also, loading the part here is not a good idea because it could break
        // the load order of the packages if someone uses preload right after
        // loading another part. So we just invoke the callback async.
        if (callback) {
          window.setTimeout(function () {
            callback.call(self, this);
          }, 0);
        }
      },
      /**
       * Loads the part asynchronously. The callback is called after the part and
       * its dependencies are fully loaded. If the part is already loaded the
       * callback is called immediately.
       *
       * @internal
       *
       * @param callback {Function} Function to execute on completion
       * @param self {Object?window} Context to execute the given function in
       */
      load(callback, self) {
        if (this._checkCompleteLoading(callback, self)) {
          return;
        }
        this._readyState = "loading";
        if (callback) {
          this._appendPartListener(callback, self, this);
        }
        var part = this;
        var onLoad = function () {
          part.load();
        };
        for (var i = 0; i < this._packages.length; i++) {
          var pkg = this._packages[i];
          switch (pkg.getReadyState()) {
            case "initialized":
              this._loader.addPackageListener(pkg, onLoad);
              pkg.load(this._loader.notifyPackageResult, this._loader);
              return;
            case "loading":
              this._loader.addPackageListener(pkg, onLoad);
              return;
            case "complete":
              break;
            case "error":
              this._markAsCompleted("error");
              return;
            default:
              throw new Error("Invalid case! " + pkg.getReadyState());
          }
        }
        this._markAsCompleted("complete");
      },
      /**
       * Helper for appending a listener for this part.
       *
       * @param callback {Function} The function to call when the part is loaded.
       * @param self {Object?} The context of the callback.
       * @param part {qx.io.part.Part|qx.io.part.ClosurePart} The part to listen
       *   to.
       */
      _appendPartListener(callback, self, part) {
        var that = this;
        this._loader.addPartListener(this, function () {
          that._signalStartup();
          callback.call(self, part._readyState);
        });
      },
      /**
       * Helper for marking the part as complete.
       *
       * @param readyState {String} The new ready state.
       */
      _markAsCompleted(readyState) {
        this._readyState = readyState;
        this._loader.notifyPartResult(this);
      },
      /**
       * Method used to start up the application in case not all parts
       * necessary to initialize the application are in the boot part. [BUG #3793]
       */
      _signalStartup() {
        // signal the application startup if not already done
        if (!qx.$$loader.applicationHandlerReady) {
          qx.$$loader.signalStartup();
        }
      },
      /**
       * Helper for checking if the part is loaded completely.
       *
       * @param callback {Function} The function to be called if the part has
       *   been loaded completely.
       * @param self {Object} The context of the callback function.
       * @return {Boolean} true, if the part is loading, complete or has an error.
       */
      _checkCompleteLoading(callback, self) {
        // check if its already loaded
        var readyState = this._readyState;
        if (readyState == "complete" || readyState == "error") {
          if (callback) {
            var that = this;
            setTimeout(function () {
              that._signalStartup();
              callback.call(self, readyState);
            }, 0);
          }
          return true;
        }
        // add a listener if it is currently loading
        else if (readyState == "loading" && callback) {
          this._appendPartListener(callback, self, this);
          return true;
        }
      }
    }
  });
  qx.io.part.Part.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.io.part.Part": {
        "construct": true,
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
       * Fabian Jakobs (fjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Wrapper for a part as defined in the config file. This class knows about all
   * packages the part depends on and provides functionality to load the part.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.io.part.ClosurePart", {
    extend: qx.io.part.Part,
    /**
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @param packages {qx.io.part.Package[]} List of dependent packages
     * @param loader {qx.Part} The loader of this part.
     */
    construct(name, packages, loader) {
      qx.io.part.Part.call(this, name, packages, loader);
    },
    members: {
      __packagesToLoad__P_137_0: 0,
      // overridden
      preload(callback, self) {
        // store how many packages are already preloaded
        var packagesLoaded = 0;
        var that = this;
        for (var i = 0; i < this._packages.length; i++) {
          var pkg = this._packages[i];
          if (pkg.getReadyState() == "initialized") {
            pkg.loadClosure(function (pkg) {
              packagesLoaded++;
              that._loader.notifyPackageResult(pkg);
              // everything loaded?
              if (packagesLoaded >= that._packages.length && callback) {
                callback.call(self);
              }
            }, this._loader);
          }
        }
      },
      /**
       * Loads the closure part including all its packages. The loading will
       * be done parallel. After all packages are available, the closures are
       * executed in the correct order.
       *
       * @param callback {Function} The function to call after the loading.
       * @param self {Object?} The context of the callback.
       */
      load(callback, self) {
        if (this._checkCompleteLoading(callback, self)) {
          return;
        }
        this._readyState = "loading";
        if (callback) {
          this._appendPartListener(callback, self, this);
        }
        this.__packagesToLoad__P_137_0 = this._packages.length;
        for (var i = 0; i < this._packages.length; i++) {
          var pkg = this._packages[i];
          var pkgReadyState = pkg.getReadyState();

          // trigger loading
          if (pkgReadyState == "initialized") {
            pkg.loadClosure(this._loader.notifyPackageResult, this._loader);
          }

          // Listener for package changes
          if (pkgReadyState == "initialized" || pkgReadyState == "loading") {
            this._loader.addPackageListener(pkg, qx.Bootstrap.bind(this._onPackageLoad, this, pkg));
          } else if (pkgReadyState == "error") {
            this._markAsCompleted("error");
            return;
          } else {
            // "complete" and "cached"
            this.__packagesToLoad__P_137_0--;
          }
        }

        // execute closures in case everything is already loaded/cached
        if (this.__packagesToLoad__P_137_0 <= 0) {
          this.__executePackages__P_137_1();
        }
      },
      /**
       * Executes the packages in their correct order and marks the part as
       * complete after execution.
       */
      __executePackages__P_137_1() {
        for (var i = 0; i < this._packages.length; i++) {
          this._packages[i].execute();
        }
        this._markAsCompleted("complete");
      },
      /**
       * Handler for every package load. It checks for errors and decreases the
       * packages to load. If all packages has been loaded, it invokes the
       * execution.
       *
       * @param pkg {qx.io.part.Package} The loaded package.
       */
      _onPackageLoad(pkg) {
        // if the part already has an error, ignore the callback
        if (this._readyState == "error") {
          return;
        }

        // one error package results in an error part
        if (pkg.getReadyState() == "error") {
          this._markAsCompleted("error");
          return;
        }

        // every package could be loaded -> execute the closures
        this.__packagesToLoad__P_137_0--;
        if (this.__packagesToLoad__P_137_0 <= 0) {
          this.__executePackages__P_137_1();
        }
      }
    }
  });
  qx.io.part.ClosurePart.$$dbClassInfo = $$dbClassInfo;
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
  
  ************************************************************************ */
  /**
   * Defines the callback for the single selection manager.
   *
   * @internal
   */
  qx.Interface.define("qx.ui.core.ISingleSelectionProvider", {
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Returns the elements which are part of the selection.
       *
       * @return {qx.ui.core.Widget[]} The widgets for the selection.
       */
      getItems() {},
      /**
       * Returns whether the given item is selectable.
       *
       * @param item {qx.ui.core.Widget} The item to be checked
       * @return {Boolean} Whether the given item is selectable
       */
      isItemSelectable(item) {}
    }
  });
  qx.ui.core.ISingleSelectionProvider.$$dbClassInfo = $$dbClassInfo;
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
      "qx.dom.Element": {},
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.bom.client.Html": {
        "require": true
      },
      "qx.bom.element.Style": {},
      "qx.core.Assert": {},
      "qx.bom.element.Attribute": {},
      "qx.bom.element.Dimension": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.textoverflow": {
          "className": "qx.bom.client.Css"
        },
        "html.xul": {
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
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Cross browser abstractions to work with labels.
   */
  qx.Bootstrap.define("qx.bom.Label", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Map} Contains all supported styles */
      __styles__P_144_0: {
        fontFamily: 1,
        fontSize: 1,
        fontWeight: 1,
        fontStyle: 1,
        lineHeight: 1,
        wordBreak: 1,
        letterSpacing: 1
      },
      /** @type{Object<String,Object>} cache of label sizes */
      __sizeCache__P_144_1: {},
      /**
       * Generates the helper DOM element for text measuring
       *
       * @return {Element} Helper DOM element
       */
      __prepareText__P_144_2() {
        var el = this.__createMeasureElement__P_144_3(false);
        document.body.insertBefore(el, document.body.firstChild);
        return this._textElement = el;
      },
      /**
       * Generates the helper DOM element for HTML measuring
       *
       * @return {Element} Helper DOM element
       */
      __prepareHtml__P_144_4() {
        var el = this.__createMeasureElement__P_144_3(true);
        document.body.insertBefore(el, document.body.firstChild);
        return this._htmlElement = el;
      },
      /**
       * Creates the measure element
       *
       * @param html {Boolean?false} Whether HTML markup should be used.
       * @return {Element} The measure element
       */
      __createMeasureElement__P_144_3(html) {
        var el = qx.dom.Element.create("div");
        var style = el.style;
        style.width = style.height = "auto";
        style.left = style.top = "-1000px";
        style.visibility = "hidden";
        style.position = "absolute";
        style.overflow = "visible";
        style.display = "block";
        if (html) {
          style.whiteSpace = "normal";
        } else {
          style.whiteSpace = "nowrap";
          if (!qx.core.Environment.get("css.textoverflow") && qx.core.Environment.get("html.xul")) {
            var inner = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "label");

            // Force style inheritance for font styles to omit usage of
            // CSS "label" selector, See bug #1349 for details.
            var style = inner.style;
            style.padding = "0";
            style.margin = "0";
            style.width = "auto";
            for (var key in this.__styles__P_144_0) {
              style[key] = "inherit";
            }
            el.appendChild(inner);
          }
        }
        return el;
      },
      /**
       * Returns a map of all styles which should be applied as
       * a basic set.
       *
       * @param html {Boolean?false} Whether HTML markup should be used.
       * @return {Map} Initial styles which should be applied to a label element.
       */
      __getStyles__P_144_5(html) {
        var styles = {};
        styles.overflow = "hidden";
        if (html) {
          styles.whiteSpace = "normal";
        } else if (!qx.core.Environment.get("css.textoverflow") && qx.core.Environment.get("html.xul")) {
          styles.display = "block";
        } else {
          styles.whiteSpace = "nowrap";
          styles[qx.core.Environment.get("css.textoverflow")] = "ellipsis";
        }
        return styles;
      },
      /**
       * Creates a label.
       *
       * The default mode is 'text' which means that the overlapping text is cut off
       * using ellipsis automatically. Text wrapping is disabled in this mode
       * as well. Spaces are normalized. Umlauts and other special symbols are only
       * allowed in unicode mode as normal characters.
       *
       * In the HTML mode you can insert any HTML, but loose the capability to cut
       * of overlapping text. Automatic text wrapping is enabled by default.
       *
       * It is not possible to modify the mode afterwards.
       *
       * @param content {String} Content of the label
       * @param html {Boolean?false} Whether HTML markup should be used.
       * @param win {Window?null} Window to create the element for
       * @return {Element} The created iframe node
       */
      create(content, html, win) {
        if (!win) {
          win = window;
        }
        var el = win.document.createElement("div");
        if (html) {
          el.useHtml = true;
        }
        if (!qx.core.Environment.get("css.textoverflow") && qx.core.Environment.get("html.xul")) {
          // Gecko as of Firefox 2.x and 3.0 does not support ellipsis
          // for text overflow. We use this feature from XUL instead.
          var xulel = win.document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "label");
          var style = xulel.style;
          style.cursor = "inherit";
          style.color = "inherit";
          style.overflow = "hidden";
          style.maxWidth = "100%";
          style.padding = "0";
          style.margin = "0";
          style.width = "auto";

          // Force style inheritance for font styles to omit usage of
          // CSS "label" selector, See bug #1349 for details.
          for (var key in this.__styles__P_144_0) {
            xulel.style[key] = "inherit";
          }
          xulel.setAttribute("crop", "end");
          el.appendChild(xulel);
        } else {
          qx.bom.element.Style.setStyles(el, this.__getStyles__P_144_5(html));
        }
        if (content) {
          this.setValue(el, content);
        }
        return el;
      },
      /** Sanitizer function */
      __sanitizer__P_144_6: null,
      /**
       * Sets a function to sanitize values. It will be used by {@link #setValue}.
       * The function to sanitize will get the <code>string</code> value and
       * should return a sanitized / cleared <code>string</code>.
       *
       * @param func {Function | null} Function to sanitize / clean HTML code
       *  from given string parameter
       */
      setSanitizer(func) {
        {
          if (func) {
            qx.core.Assert.assertFunction(func);
          }
        }
        qx.bom.Label.__sanitizer__P_144_6 = func;
      },
      /**
       * Sets the content of the element.
       *
       * The possibilities of the value depends on the mode
       * defined using {@link #create}.
       *
       * @param element {Element} DOM element to modify.
       * @param value {String} Content to insert.
       */
      setValue(element, value) {
        value = value || "";
        if (element.useHtml) {
          if (qx.bom.Label.__sanitizer__P_144_6 && typeof qx.bom.Label.__sanitizer__P_144_6 === "function") {
            value = qx.bom.Label.__sanitizer__P_144_6(value);
          }
          element.innerHTML = value;
        } else if (!qx.core.Environment.get("css.textoverflow") && qx.core.Environment.get("html.xul")) {
          element.firstChild.setAttribute("value", value);
        } else {
          qx.bom.element.Attribute.set(element, "text", value);
        }
      },
      /**
       * Returns the content of the element.
       *
       * @param element {Element} DOM element to query.
       * @return {String} Content stored in the element.
       */
      getValue(element) {
        if (element.useHtml) {
          return element.innerHTML;
        } else if (!qx.core.Environment.get("css.textoverflow") && qx.core.Environment.get("html.xul")) {
          return element.firstChild.getAttribute("value") || "";
        } else {
          return qx.bom.element.Attribute.get(element, "text");
        }
      },
      /**
       * Returns the preferred dimensions of the given HTML content.
       *
       * @param content {String} The HTML markup to measure
       * @param styles {Map?null} Optional styles to apply
       * @param width {Integer} To support width for height it is possible to limit the width
       * @return {Map} A map with preferred <code>width</code> and <code>height</code>.
       */
      getHtmlSize(content, styles, width) {
        let cacheKey = this.__getCacheKey__P_144_7(styles, width);
        let size = this.__getCachedSize__P_144_8(cacheKey, content);
        if (size !== undefined) {
          return size;
        }
        var element = this._htmlElement || this.__prepareHtml__P_144_4();

        // apply width
        element.style.width = width != undefined ? width + "px" : "auto";
        // insert content
        element.innerHTML = content;
        size = this.__measureSize__P_144_9(element, styles);
        this.__storeCacheSize__P_144_10(cacheKey, content, size);
        return size;
      },
      /**
       * Returns the preferred dimensions of the given text.
       *
       * @param text {String} The text to measure
       * @param styles {Map} Optional styles to apply
       * @return {Map} A map with preferred <code>width</code> and <code>height</code>.
       */
      getTextSize(text, styles) {
        let cacheKey = this.__getCacheKey__P_144_7(styles);
        let size = this.__getCachedSize__P_144_8(cacheKey, text);
        if (size !== undefined) {
          return size;
        }
        var element = this._textElement || this.__prepareText__P_144_2();
        if (!qx.core.Environment.get("css.textoverflow") && qx.core.Environment.get("html.xul")) {
          element.firstChild.setAttribute("value", text);
        } else {
          qx.bom.element.Attribute.set(element, "text", text);
        }
        size = this.__measureSize__P_144_9(element, styles);
        this.__storeCacheSize__P_144_10(cacheKey, text, size);
        return size;
      },
      /**
       * Returns a key for a specific set of styles, used in the caching of size calculations
       *
       * @param {*} styles
       * @param {Integer?} width optional width
       * @returns
       */
      __getCacheKey__P_144_7(styles, width) {
        let cacheKey = [];
        for (let key in styles) {
          let value = styles[key];
          if (value !== null) {
            cacheKey.push(key + ":" + value);
          }
        }
        if (width !== undefined) {
          cacheKey.push("width:" + width);
        }
        return cacheKey.join(",");
      },
      /**
       * Returns the cached size of the given text
       *
       * @param {String} cacheKey
       * @param {String} text
       * @returns {*} size object
       */
      __getCachedSize__P_144_8(cacheKey, text) {
        let cache = qx.bom.Label.__sizeCache__P_144_1[cacheKey];
        return cache?.sizes[text];
      },
      /**
       * Stores the size of the given text in the cache
       *
       * @param {String} cacheKey
       * @param {String} text
       * @param {*} size
       */
      __storeCacheSize__P_144_10(cacheKey, text, size) {
        if (!size) {
          return;
        }
        let cache = qx.bom.Label.__sizeCache__P_144_1[cacheKey];
        if (cache === undefined) {
          cache = qx.bom.Label.__sizeCache__P_144_1[cacheKey] = {
            sizes: {}
          };
        }
        cache.sizes[text] = size;
      },
      /**
       * Flushes the size cache - use this when something changes, for example webfonts have been loaded
       */
      flushSizeCache() {
        qx.bom.Label.__sizeCache__P_144_1 = {};
      },
      /**
       * Measure the size of the given element
       *
       * @param element {Element} The element to measure
       * @param styles {Map?null} Optional styles to apply
       * @return {Map} A map with preferred <code>width</code> and <code>height</code>.
       */
      __measureSize__P_144_9(element, styles) {
        // sync styles
        var keys = this.__styles__P_144_0;
        if (!styles) {
          styles = {};
        }
        for (var key in keys) {
          element.style[key] = styles[key] || "";
        }

        // detect size
        var size = qx.bom.element.Dimension.getSize(element);

        // all modern browser are needing one more pixel for width
        size.width++;
        return size;
      }
    }
  });
  qx.bom.Label.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.Shortcut": {
        "construct": true
      },
      "qx.ui.menu.Menu": {}
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
       * Martin Wittemann (martinwittemann)
       * Mustafa Sak (msak)
  
  ************************************************************************ */
  /**
   * Commands can be used to globally define keyboard shortcuts. They could
   * also be used to assign an execution of a command sequence to multiple
   * widgets. It is possible to use the same Command in a MenuButton and
   * ToolBarButton for example.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.ui.command.Command", {
    extend: qx.core.Object,
    /**
     * @param shortcut {String} Shortcuts can be composed of optional modifier
     *    keys Control, Alt, Shift, Meta and a non modifier key.
     *    If no non modifier key is specified, the second parameter is evaluated.
     *    The key must be separated by a <code>+</code> or <code>-</code> character.
     *    Examples: Alt+F1, Control+C, Control+Alt+Delete
     */
    construct(shortcut) {
      qx.core.Object.constructor.call(this);
      this._shortcut = new qx.bom.Shortcut(shortcut);
      this._shortcut.addListener("execute", this.execute, this);
      if (shortcut !== undefined) {
        this.setShortcut(shortcut);
      }
    },
    events: {
      /**
       * Fired when the command is executed. Sets the "data" property of the
       * event to the object that issued the command.
       */
      execute: "qx.event.type.Data"
    },
    properties: {
      /** Whether the command should be activated. If 'false' execute event
       * wouldn't fire. This property will be used by command groups when
       * activating/deactivating all commands of the group.*/
      active: {
        init: true,
        check: "Boolean",
        event: "changeActive",
        apply: "_applyActive"
      },
      /** Whether the command should be respected/enabled. If 'false' execute event
       * wouldn't fire. If value of property {@link qx.ui.command.Command#active}
       * is 'false', enabled value can be set but has no effect until
       * {@link qx.ui.command.Command#active} will be set to 'true'.*/
      enabled: {
        init: true,
        check: "Boolean",
        event: "changeEnabled",
        apply: "_applyEnabled"
      },
      /** The command shortcut as a string */
      shortcut: {
        check: "String",
        apply: "_applyShortcut",
        nullable: true
      },
      /** The label, which will be set in all connected widgets (if available) */
      label: {
        check: "String",
        nullable: true,
        event: "changeLabel"
      },
      /** The icon, which will be set in all connected widgets (if available) */
      icon: {
        check: "String",
        nullable: true,
        event: "changeIcon"
      },
      /**
       * The tooltip text, which will be set in all connected
       * widgets (if available)
       */
      toolTipText: {
        check: "String",
        nullable: true,
        event: "changeToolTipText"
      },
      /** The value of the connected widgets */
      value: {
        nullable: true,
        event: "changeValue"
      },
      /** The menu, which will be set in all connected widgets (if available) */
      menu: {
        check: "qx.ui.menu.Menu",
        nullable: true,
        event: "changeMenu"
      }
    },
    members: {
      _shortcut: null,
      // property apply
      _applyActive(value) {
        if (value === false) {
          this._shortcut.setEnabled(false);
        } else {
          // synchronize value with current "enabled" value of this command
          this._shortcut.setEnabled(this.getEnabled());
        }
      },
      // property apply
      _applyEnabled(value) {
        if (this.getActive()) {
          this._shortcut.setEnabled(value);
        }
      },
      // property apply
      _applyShortcut(value) {
        this._shortcut.setShortcut(value);
      },
      /**
       * Fire the "execute" event on this command. If property
       * <code>active</code> and <code>enabled</code> set to
       * <code>true</code>.
       * @param target {Object?} Object which issued the execute event
       */
      execute(target) {
        if (this.getActive() && this.getEnabled()) {
          this.fireDataEvent("execute", target);
        }
      },
      /**
       * Returns the used shortcut as string using the currently selected locale.
       *
       * @return {String} shortcut
       */
      toString() {
        if (this._shortcut) {
          return this._shortcut.toString();
        }
        return qx.ui.command.Command.superclass.prototype.toString.call(this);
      }
    },
    destruct() {
      this._shortcut.removeListener("execute", this.execute, this);
      this._disposeObjects("_shortcut");
    }
  });
  qx.ui.command.Command.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This mixin defines the <code>contentPadding</code> property, which is used
   * by widgets like the window or group box, which must have a property, which
   * defines the padding of an inner pane.
   *
   * The including class must implement the method
   * <code>_getContentPaddingTarget</code>, which must return the widget on which
   * the padding should be applied.
   */
  qx.Mixin.define("qx.ui.core.MContentPadding", {
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** Top padding of the content pane */
      contentPaddingTop: {
        check: "Integer",
        init: 0,
        apply: "_applyContentPadding",
        themeable: true
      },
      /** Right padding of the content pane */
      contentPaddingRight: {
        check: "Integer",
        init: 0,
        apply: "_applyContentPadding",
        themeable: true
      },
      /** Bottom padding of the content pane */
      contentPaddingBottom: {
        check: "Integer",
        init: 0,
        apply: "_applyContentPadding",
        themeable: true
      },
      /** Left padding of the content pane */
      contentPaddingLeft: {
        check: "Integer",
        init: 0,
        apply: "_applyContentPadding",
        themeable: true
      },
      /**
       * The 'contentPadding' property is a shorthand property for setting 'contentPaddingTop',
       * 'contentPaddingRight', 'contentPaddingBottom' and 'contentPaddingLeft'
       * at the same time.
       *
       * If four values are specified they apply to top, right, bottom and left respectively.
       * If there is only one value, it applies to all sides, if there are two or three,
       * the missing values are taken from the opposite side.
       */
      contentPadding: {
        group: ["contentPaddingTop", "contentPaddingRight", "contentPaddingBottom", "contentPaddingLeft"],
        mode: "shorthand",
        themeable: true
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      /**
       * @type {Map} Maps property names of content padding to the setter of the padding
       *
       * @lint ignoreReferenceField(__contentPaddingSetter)
       */
      __contentPaddingSetter__P_74_0: {
        contentPaddingTop: "setPaddingTop",
        contentPaddingRight: "setPaddingRight",
        contentPaddingBottom: "setPaddingBottom",
        contentPaddingLeft: "setPaddingLeft"
      },
      /**
       * @type {Map} Maps property names of content padding to the themed setter of the padding
       *
       * @lint ignoreReferenceField(__contentPaddingThemedSetter)
       */
      __contentPaddingThemedSetter__P_74_1: {
        contentPaddingTop: "setThemedPaddingTop",
        contentPaddingRight: "setThemedPaddingRight",
        contentPaddingBottom: "setThemedPaddingBottom",
        contentPaddingLeft: "setThemedPaddingLeft"
      },
      /**
       * @type {Map} Maps property names of content padding to the resetter of the padding
       *
       * @lint ignoreReferenceField(__contentPaddingResetter)
       */
      __contentPaddingResetter__P_74_2: {
        contentPaddingTop: "resetPaddingTop",
        contentPaddingRight: "resetPaddingRight",
        contentPaddingBottom: "resetPaddingBottom",
        contentPaddingLeft: "resetPaddingLeft"
      },
      // property apply
      _applyContentPadding(value, old, name, variant) {
        var target = this._getContentPaddingTarget();
        if (value == null) {
          var resetter = this.__contentPaddingResetter__P_74_2[name];
          target[resetter]();
        } else {
          // forward the themed sates if case the apply was invoked by a theme
          if (variant == "setThemed" || variant == "resetThemed") {
            var setter = this.__contentPaddingThemedSetter__P_74_1[name];
            target[setter](value);
          } else {
            var setter = this.__contentPaddingSetter__P_74_0[name];
            target[setter](value);
          }
        }
      }
    }
  });
  qx.ui.core.MContentPadding.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.ISingleSelection": {
        "require": true
      },
      "qx.ui.core.MContentPadding": {
        "require": true
      },
      "qx.ui.tabview.Page": {},
      "qx.ui.container.SlideBar": {},
      "qx.ui.container.Stack": {},
      "qx.ui.form.RadioGroup": {},
      "qx.ui.layout.HBox": {},
      "qx.ui.layout.VBox": {},
      "qx.event.type.Event": {}
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
       * Martin Wittemann (martinwittemann)
       * Jonathan Weiß (jonathan_rass)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * A tab view is a multi page view where only one page is visible
   * at each moment. It is possible to switch the pages using the
   * buttons rendered by each page.
   *
   * Note that prior to v6.0, when changing the currently selected tab via code
   * (ie changing the selection property) TabView would automatically set the
   * focus to that tab; this is undesirable (and inconsistent with other parts
   * of the framework) and is no longer done automatically.
   *
   * @childControl bar {qx.ui.container.SlideBar} slidebar for all tab buttons
   * @childControl pane {qx.ui.container.Stack} stack container to show one tab page
   */
  qx.Class.define("qx.ui.tabview.TabView", {
    extend: qx.ui.core.Widget,
    implement: qx.ui.core.ISingleSelection,
    include: [qx.ui.core.MContentPadding],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param barPosition {String} Initial bar position ({@link #barPosition})
     */
    construct(barPosition) {
      qx.ui.core.Widget.constructor.call(this);
      this.__barPositionToState__P_23_0 = {
        top: "barTop",
        right: "barRight",
        bottom: "barBottom",
        left: "barLeft"
      };
      this._createChildControl("bar");
      this._createChildControl("pane");

      // Create manager
      var mgr = this.__radioGroup__P_23_1 = this._createRadioGroupInstance();
      mgr.setWrap(false);
      mgr.addListener("changeSelection", this._onChangeSelection, this);

      // Initialize bar position
      if (barPosition != null) {
        this.setBarPosition(barPosition);
      } else {
        this.initBarPosition();
      }

      // ARIA attrs
      this.getContentElement().setAttribute("role", "tablist");
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fires after the selection was modified */
      changeSelection: "qx.event.type.Data",
      /** Fires after the value was modified */
      changeValue: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "tabview"
      },
      /**
       * This property defines on which side of the TabView the bar should be positioned.
       */
      barPosition: {
        check: ["left", "right", "top", "bottom"],
        init: "top",
        apply: "_applyBarPosition"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** @type {qx.ui.form.RadioGroup} instance containing the radio group */
      __radioGroup__P_23_1: null,
      /**
       * setValue implements part of the {@link qx.ui.form.IField} interface.
       *
       * @param item {null|qx.ui.tabview.Page} Page to set as selected value.
       * @returns {null|TypeError} The status of this operation.
       */
      setValue(item) {
        if (null === item) {
          this.resetSelection();
          return null;
        }
        if (item instanceof qx.ui.tabview.Page) {
          this.setSelection([item]);
          return null;
        } else {
          return new TypeError("Given argument is not null or a {qx.ui.tabview.Page}.");
        }
      },
      /**
       * getValue implements part of the {@link qx.ui.form.IField} interface.
       *
       * @returns {null|qx.ui.tabview.Page} The currently selected page or null if there is none.
       */
      getValue() {
        var pages = this.getSelection();
        if (pages.length) {
          return pages[0];
        } else {
          return null;
        }
      },
      /**
       * resetValue implements part of the {@link qx.ui.form.IField} interface.
       */
      resetValue() {
        this.resetSelection();
      },
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "bar":
            control = new qx.ui.container.SlideBar();
            control.setZIndex(10);
            this._add(control);
            break;
          case "pane":
            control = new qx.ui.container.Stack();
            control.setZIndex(5);
            this._add(control, {
              flex: 1
            });
            break;
        }
        return control || qx.ui.tabview.TabView.superclass.prototype._createChildControlImpl.call(this, id);
      },
      /**
       * Creates the radio group manager instance.
       *
       * Allows override customizations of the instance
       *
       * @return {qx.ui.form.RadioGroup}
       */
      _createRadioGroupInstance() {
        return new qx.ui.form.RadioGroup();
      },
      /**
       * Returns the element, to which the content padding should be applied.
       *
       * @return {qx.ui.core.Widget} The content padding target.
       */
      _getContentPaddingTarget() {
        return this.getChildControl("pane");
      },
      /*
      ---------------------------------------------------------------------------
        CHILDREN HANDLING
      ---------------------------------------------------------------------------
      */

      /**
       * Adds a page to the tabview including its needed button
       * (contained in the page).
       *
       * @param page {qx.ui.tabview.Page} The page which should be added.
       */
      add(page) {
        {
          if (!(page instanceof qx.ui.tabview.Page)) {
            throw new Error("Incompatible child for TabView: " + page);
          }
        }
        var button = page.getButton();
        var bar = this.getChildControl("bar");
        var pane = this.getChildControl("pane");

        // Exclude page
        page.exclude();

        // Add button and page
        bar.add(button);
        pane.add(page);

        // Register button
        this.__radioGroup__P_23_1.add(button);

        // Add state to page
        page.addState(this.__barPositionToState__P_23_0[this.getBarPosition()]);
        this.__updateFirstLastTabStates__P_23_2();
        page.addListener("close", this._onPageClose, this);
        page.addListener("changeTabVisibility", this.__onPageChangeTabVisibility__P_23_3, this);
      },
      /**
       * Adds a page to the tabview including its needed button
       * (contained in the page).
       *
       * @param page {qx.ui.tabview.Page} The page which should be added.
       * @param index {Integer?null} Optional position where to add the page.
       */
      addAt(page, index) {
        {
          if (!(page instanceof qx.ui.tabview.Page)) {
            throw new Error("Incompatible child for TabView: " + page);
          }
        }
        var children = this.getChildren();
        if (!(index == null) && index > children.length) {
          throw new Error("Index should be less than : " + children.length);
        }
        if (index == null) {
          index = children.length;
        }
        var button = page.getButton();
        var bar = this.getChildControl("bar");
        var pane = this.getChildControl("pane");

        // Exclude page
        page.exclude();

        // Add button and page
        bar.addAt(button, index);
        pane.addAt(page, index);

        // Register button
        this.__radioGroup__P_23_1.add(button);

        // Add state to page
        page.addState(this.__barPositionToState__P_23_0[this.getBarPosition()]);

        // Update states
        this.__updateFirstLastTabStates__P_23_2();
        page.addListener("close", this._onPageClose, this);
        page.addListener("changeTabVisibility", this.__onPageChangeTabVisibility__P_23_3, this);
      },
      /**
       * Removes a page (and its corresponding button) from the TabView.
       *
       * @param page {qx.ui.tabview.Page} The page to be removed.
       */
      remove(page) {
        var pane = this.getChildControl("pane");
        var bar = this.getChildControl("bar");
        var button = page.getButton();
        var children = pane.getChildren();

        // Try to select next page
        if (this.getSelection()[0] == page) {
          var index = children.indexOf(page);
          if (index == 0) {
            if (children[1]) {
              this.setSelection([children[1]]);
            } else {
              this.resetSelection();
            }
          } else {
            this.setSelection([children[index - 1]]);
          }
        }

        // Remove the button and page
        bar.remove(button);
        pane.remove(page);

        // Remove the button from the radio group
        this.__radioGroup__P_23_1.remove(button);

        // Remove state from page
        page.removeState(this.__barPositionToState__P_23_0[this.getBarPosition()]);
        this.__updateFirstLastTabStates__P_23_2();
        page.removeListener("close", this._onPageClose, this);
        page.removeListener("changeTabVisibility", this.__onPageChangeTabVisibility__P_23_3, this);
      },
      /**
       * Returns TabView's children widgets.
       *
       * @return {qx.ui.tabview.Page[]} List of children.
       */
      getChildren() {
        return this.getChildControl("pane").getChildren();
      },
      /**
       * Returns the position of the given page in the TabView.
       *
       * @param page {qx.ui.tabview.Page} The page to query for.
       * @return {Integer} Position of the page in the TabView.
       */
      indexOf(page) {
        return this.getChildControl("pane").indexOf(page);
      },
      /**
       * Returns the radio group manager.
       *
       * @return {qx.ui.form.RadioGroup} the radio group.
       */
      getRadioGroup() {
        return this.__radioGroup__P_23_1;
      },
      /*
      ---------------------------------------------------------------------------
        APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      /** @type {Map} Maps the bar position to an appearance state */
      __barPositionToState__P_23_0: null,
      /**
       * Apply method for the placeBarOnTop-Property.
       *
       * Passes the desired value to the layout of the tabview so
       * that the layout can handle it.
       * It also sets the states to all buttons so they know the
       * position of the bar.
       *
       * @param value {Boolean} The new value.
       * @param old {Boolean} The old value.
       */
      _applyBarPosition(value, old) {
        var bar = this.getChildControl("bar");
        var pane = this.getChildControl("pane");
        var horizontal = value == "left" || value == "right";
        var reversed = value == "right" || value == "bottom";
        var layoutClass = horizontal ? qx.ui.layout.HBox : qx.ui.layout.VBox;
        var layout = this._getLayout();
        if (layout && layout instanceof layoutClass) {
          // pass
        } else {
          this._setLayout(layout = new layoutClass());
        } // Update reversed
        layout.setReversed(reversed); // Sync orientation to bar
        bar.setOrientation(horizontal ? "vertical" : "horizontal"); // Read children
        var children = this.getChildren();
        var i, l;
        // Toggle state to bar
        if (old) {
          var oldState = this.__barPositionToState__P_23_0[old];

          // Update bar
          bar.removeState(oldState);

          // Update pane
          pane.removeState(oldState);

          // Update pages
          for (i = 0, l = children.length; i < l; i++) {
            children[i].removeState(oldState);
          }
        }
        if (value) {
          var newState = this.__barPositionToState__P_23_0[value];

          // Update bar
          bar.addState(newState);

          // Update pane
          pane.addState(newState);

          // Update pages
          for (i = 0, l = children.length; i < l; i++) {
            children[i].addState(newState);
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        SELECTION API
      ---------------------------------------------------------------------------
      */

      /**
       * Returns an array of currently selected items.
       *
       * Note: The result is only a set of selected items, so the order can
       * differ from the sequence in which the items were added.
       *
       * @return {qx.ui.tabview.Page[]} List of items.
       */
      getSelection() {
        var buttons = this.__radioGroup__P_23_1.getSelection();
        var result = [];
        for (var i = 0; i < buttons.length; i++) {
          result.push(buttons[i].getUserData("page"));
        }
        return result;
      },
      /**
       * Replaces current selection with the given items.
       *
       * @param items {qx.ui.tabview.Page[]} Items to select.
       * @throws {Error} if one of the items is not a child element and if
       *    items contains more than one elements.
       */
      setSelection(items) {
        var buttons = [];
        for (var i = 0; i < items.length; i++) {
          buttons.push(items[i].getChildControl("button"));
        }
        this.__radioGroup__P_23_1.setSelection(buttons);
      },
      /**
       * Clears the whole selection at once.
       */
      resetSelection() {
        this.__radioGroup__P_23_1.resetSelection();
      },
      /**
       * Detects whether the given item is currently selected.
       *
       * @param item {qx.ui.tabview.Page} Any valid selectable item.
       * @return {Boolean} Whether the item is selected.
       * @throws {Error} if one of the items is not a child element.
       */
      isSelected(item) {
        var button = item.getChildControl("button");
        return this.__radioGroup__P_23_1.isSelected(button);
      },
      /**
       * Whether the selection is empty.
       *
       * @return {Boolean} Whether the selection is empty.
       */
      isSelectionEmpty() {
        return this.__radioGroup__P_23_1.isSelectionEmpty();
      },
      /**
       * Returns all elements which are selectable.
       *
       * @return {qx.ui.tabview.Page[]} The contained items.
       * @param all {Boolean} true for all selectables, false for the
       *   selectables the user can interactively select
       */
      getSelectables(all) {
        var buttons = this.__radioGroup__P_23_1.getSelectables(all);
        var result = [];
        for (var i = 0; i < buttons.length; i++) {
          result.push(buttons[i].getUserData("page"));
        }
        return result;
      },
      /**
       * Event handler for <code>changeSelection</code>.
       *
       * @param e {qx.event.type.Data} Data event.
       */
      _onChangeSelection(e) {
        var pane = this.getChildControl("pane");
        var button = e.getData()[0];
        var oldButton = e.getOldData()[0];
        var value = [];
        var old = [];
        if (button) {
          value = [button.getUserData("page")];
          pane.setSelection(value);
          this.scrollChildIntoView(button, null, null, false);
        } else {
          pane.resetSelection();
        }
        if (oldButton) {
          old = [oldButton.getUserData("page")];
        }
        this.fireDataEvent("changeSelection", value, old);
      },
      /**
       * Event handler for <code>beforeChangeSelection</code>.
       *
       * @param e {qx.event.type.Event} Data event.
       */
      _onBeforeChangeSelection(e) {
        if (!this.fireNonBubblingEvent("beforeChangeSelection", qx.event.type.Event, [false, true])) {
          e.preventDefault();
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Event handler for the change of the selected item of the radio group.
       * @param e {qx.event.type.Data} The data event
       */
      _onRadioChangeSelection(e) {
        var element = e.getData()[0];
        if (element) {
          this.setSelection([element.getUserData("page")]);
        } else {
          this.resetSelection();
        }
      },
      /**
       * Removes the Page widget on which the close button was tapped.
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onPageClose(e) {
        // reset the old close button states, before remove page
        // see http://bugzilla.qooxdoo.org/show_bug.cgi?id=3763 for details
        var page = e.getTarget();
        var closeButton = page.getButton().getChildControl("close-button");
        closeButton.reset();
        this.remove(page);
      },
      __onPageChangeTabVisibility__P_23_3() {
        this.__updateFirstLastTabStates__P_23_2();
      },
      __updateFirstLastTabStates__P_23_2() {
        let firstPage = null;
        let lastPage = null;
        for (let pages = this.getChildren(), i = 0; i < pages.length; i++) {
          let page = pages[i];
          if (page.getTabVisibility() == "visible") {
            if (!firstPage) {
              firstPage = page;
            }
            lastPage = page;
          }
          page.removeState("firstTab");
          page.removeState("lastTab");
        }
        firstPage?.addState("firstTab");
        lastPage?.addState("lastTab");
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._disposeObjects("__radioGroup__P_23_1");
      this.__barPositionToState__P_23_0 = null;
    }
  });
  qx.ui.tabview.TabView.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "construct": true,
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.Emitter": {
        "require": true
      },
      "qx.bom.client.CssAnimation": {
        "construct": true,
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "css.animation": {
          "construct": true,
          "className": "qx.bom.client.CssAnimation"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * This is a simple handle, which will be returned when an animation is
   * started using the {@link qx.bom.element.Animation#animate} method. It
   * basically controls the animation.
   *
   * @ignore(qx.bom.element.AnimationJs)
   */
  qx.Bootstrap.define("qx.bom.element.AnimationHandle", {
    extend: qx.event.Emitter,
    construct() {
      var css = qx.core.Environment.get("css.animation");
      this.__playState__P_216_0 = css && css["play-state"];
      this.__playing__P_216_1 = true;
      this.addListenerOnce("end", this.__setEnded__P_216_2, this);
    },
    events: {
      /** Fired when the animation started via {@link qx.bom.element.Animation}. */
      start: "Element",
      /**
       * Fired when the animation started via {@link qx.bom.element.Animation} has
       * ended.
       */
      end: "Element",
      /** Fired on every iteration of the animation. */
      iteration: "Element"
    },
    members: {
      __playState__P_216_0: null,
      __playing__P_216_1: false,
      __ended__P_216_3: false,
      /**
       * Accessor of the playing state.
       * @return {Boolean} <code>true</code>, if the animations is playing.
       */
      isPlaying() {
        return this.__playing__P_216_1;
      },
      /**
       * Accessor of the ended state.
       * @return {Boolean} <code>true</code>, if the animations has ended.
       */
      isEnded() {
        return this.__ended__P_216_3;
      },
      /**
       * Accessor of the paused state.
       * @return {Boolean} <code>true</code>, if the animations is paused.
       */
      isPaused() {
        return this.el.style[this.__playState__P_216_0] == "paused";
      },
      /**
       * Pauses the animation, if running. If not running, it will be ignored.
       */
      pause() {
        if (this.el) {
          this.el.style[this.__playState__P_216_0] = "paused";
          this.el.$$animation.__playing__P_216_1 = false;
          // in case the animation is based on JS
          if (this.animationId && qx.bom.element.AnimationJs) {
            qx.bom.element.AnimationJs.pause(this);
          }
        }
      },
      /**
       * Resumes an animation. This does not start the animation once it has ended.
       * In this case you need to start a new Animation.
       */
      play() {
        if (this.el) {
          this.el.style[this.__playState__P_216_0] = "running";
          this.el.$$animation.__playing__P_216_1 = true;
          // in case the animation is based on JS
          if (this.i != undefined && qx.bom.element.AnimationJs) {
            qx.bom.element.AnimationJs.play(this);
          }
        }
      },
      /**
       * Stops the animation if running.
       */
      stop() {
        if (this.el && qx.core.Environment.get("css.animation") && !this.jsAnimation) {
          this.el.style[this.__playState__P_216_0] = "";
          this.el.style[qx.core.Environment.get("css.animation").name] = "";
          this.el.$$animation.__playing__P_216_1 = false;
          this.el.$$animation.__ended__P_216_3 = true;
        }
        // in case the animation is based on JS
        else if (this.jsAnimation) {
          this.stopped = true;
          qx.bom.element.AnimationJs.stop(this);
        }
      },
      /**
       * Set the animation state to ended
       */
      __setEnded__P_216_2() {
        this.__playing__P_216_1 = false;
        this.__ended__P_216_3 = true;
      }
    }
  });
  qx.bom.element.AnimationHandle.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.Style": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["css.transform", "css.transform.3d"],
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
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * Responsible for checking all relevant CSS transform properties.
   *
   * Specs:
   * http://www.w3.org/TR/css3-2d-transforms/
   * http://www.w3.org/TR/css3-3d-transforms/
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.CssTransform", {
    statics: {
      /**
       * Main check method which returns an object if CSS animations are
       * supported. This object contains all necessary keys to work with CSS
       * animations.
       * <ul>
       *  <li><code>name</code> The name of the css transform style</li>
       *  <li><code>style</code> The name of the css transform-style style</li>
       *  <li><code>origin</code> The name of the transform-origin style</li>
       *  <li><code>3d</code> Whether 3d transforms are supported</li>
       *  <li><code>perspective</code> The name of the perspective style</li>
       *  <li><code>perspective-origin</code> The name of the perspective-origin style</li>
       *  <li><code>backface-visibility</code> The name of the backface-visibility style</li>
       * </ul>
       *
       * @internal
       * @return {Object|null} The described object or null, if animations are
       *   not supported.
       */
      getSupport() {
        var name = qx.bom.client.CssTransform.getName();
        if (name != null) {
          return {
            name: name,
            style: qx.bom.client.CssTransform.getStyle(),
            origin: qx.bom.client.CssTransform.getOrigin(),
            "3d": qx.bom.client.CssTransform.get3D(),
            perspective: qx.bom.client.CssTransform.getPerspective(),
            "perspective-origin": qx.bom.client.CssTransform.getPerspectiveOrigin(),
            "backface-visibility": qx.bom.client.CssTransform.getBackFaceVisibility()
          };
        }
        return null;
      },
      /**
       * Checks for the style name used to set the transform origin.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getStyle() {
        return qx.bom.Style.getPropertyName("transformStyle");
      },
      /**
       * Checks for the style name used to set the transform origin.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getPerspective() {
        return qx.bom.Style.getPropertyName("perspective");
      },
      /**
       * Checks for the style name used to set the perspective origin.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getPerspectiveOrigin() {
        return qx.bom.Style.getPropertyName("perspectiveOrigin");
      },
      /**
       * Checks for the style name used to set the backface visibility.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getBackFaceVisibility() {
        return qx.bom.Style.getPropertyName("backfaceVisibility");
      },
      /**
       * Checks for the style name used to set the transform origin.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getOrigin() {
        return qx.bom.Style.getPropertyName("transformOrigin");
      },
      /**
       * Checks for the style name used for transforms.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getName() {
        return qx.bom.Style.getPropertyName("transform");
      },
      /**
       * Checks if 3D transforms are supported.
       * @internal
       * @return {Boolean} <code>true</code>, if 3D transformations are supported
       */
      get3D() {
        return qx.bom.client.CssTransform.getPerspective() != null;
      }
    },
    defer(statics) {
      qx.core.Environment.add("css.transform", statics.getSupport);
      qx.core.Environment.add("css.transform.3d", statics.get3D);
    }
  });
  qx.bom.client.CssTransform.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.CssTransform": {
        "require": true
      },
      "qx.bom.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.transform": {
          "load": true,
          "className": "qx.bom.client.CssTransform"
        },
        "css.transform.3d": {
          "className": "qx.bom.client.CssTransform"
        }
      }
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
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * This class is responsible for applying CSS3 transforms to plain DOM elements.
   * The implementation is mostly a cross browser wrapper for applying the
   * transforms.
   * The API is keep to the spec as close as possible.
   *
   * http://www.w3.org/TR/css3-3d-transforms/
   */
  qx.Bootstrap.define("qx.bom.element.Transform", {
    statics: {
      /** Internal storage of the CSS names */
      __cssKeys__P_217_0: qx.core.Environment.get("css.transform"),
      /**
       * Method to apply multiple transforms at once to the given element. It
       * takes a map containing the transforms you want to apply plus the values
       * e.g.<code>{scale: 2, rotate: "5deg"}</code>.
       * The values can be either singular, which means a single value will
       * be added to the CSS. If you give an array, the values will be split up
       * and each array entry will be used for the X, Y or Z dimension in that
       * order e.g. <code>{scale: [2, 0.5]}</code> will result in a element
       * double the size in X direction and half the size in Y direction.
       * The values can be either singular, which means a single value will
       * be added to the CSS. If you give an array, the values will be join to
       * a string.
       * 3d suffixed properties will be taken for translate and scale if they are
       * available and an array with three values is given.
       * Make sure your browser supports all transformations you apply.
       *
       * @param el {Element} The element to apply the transformation.
       * @param transforms {Map} The map containing the transforms and value.
       */
      transform(el, transforms) {
        var transformCss = this.getTransformValue(transforms);
        if (this.__cssKeys__P_217_0 != null) {
          var style = this.__cssKeys__P_217_0["name"];
          el.style[style] = transformCss;
        }
      },
      /**
       * Translates the given element by the given value. For further details, take
       * a look at the {@link #transform} method.
       * @param el {Element} The element to apply the transformation.
       * @param value {String|Array} The value to translate e.g. <code>"10px"</code>.
       */
      translate(el, value) {
        this.transform(el, {
          translate: value
        });
      },
      /**
       * Scales the given element by the given value. For further details, take
       * a look at the {@link #transform} method.
       * @param el {Element} The element to apply the transformation.
       * @param value {Number|Array} The value to scale.
       */
      scale(el, value) {
        this.transform(el, {
          scale: value
        });
      },
      /**
       * Rotates the given element by the given value. For further details, take
       * a look at the {@link #transform} method.
       * @param el {Element} The element to apply the transformation.
       * @param value {String|Array} The value to rotate e.g. <code>"90deg"</code>.
       */
      rotate(el, value) {
        this.transform(el, {
          rotate: value
        });
      },
      /**
       * Skews the given element by the given value. For further details, take
       * a look at the {@link #transform} method.
       * @param el {Element} The element to apply the transformation.
       * @param value {String|Array} The value to skew e.g. <code>"90deg"</code>.
       */
      skew(el, value) {
        this.transform(el, {
          skew: value
        });
      },
      /**
       * Converts the given map to a string which could be added to a css
       * stylesheet.
       * @param transforms {Map} The transforms map. For a detailed description,
       * take a look at the {@link #transform} method.
       * @return {String} The CSS value.
       */
      getCss(transforms) {
        var transformCss = this.getTransformValue(transforms);
        if (this.__cssKeys__P_217_0 != null) {
          var style = this.__cssKeys__P_217_0["name"];
          return qx.bom.Style.getCssName(style) + ":" + transformCss + ";";
        }
        return "";
      },
      /**
       * Sets the transform-origin property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#transform-origin-property
       * @param el {Element} The dom element to set the property.
       * @param value {String} CSS position values like <code>50% 50%</code> or
       *   <code>left top</code>.
       */
      setOrigin(el, value) {
        if (this.__cssKeys__P_217_0 != null) {
          el.style[this.__cssKeys__P_217_0["origin"]] = value;
        }
      },
      /**
       * Returns the transform-origin property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#transform-origin-property
       * @param el {Element} The dom element to read the property.
       * @return {String} The set property, e.g. <code>50% 50%</code>
       */
      getOrigin(el) {
        if (this.__cssKeys__P_217_0 != null) {
          return el.style[this.__cssKeys__P_217_0["origin"]];
        }
        return "";
      },
      /**
       * Sets the transform-style property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#transform-style-property
       * @param el {Element} The dom element to set the property.
       * @param value {String} Either <code>flat</code> or <code>preserve-3d</code>.
       */
      setStyle(el, value) {
        if (this.__cssKeys__P_217_0 != null) {
          el.style[this.__cssKeys__P_217_0["style"]] = value;
        }
      },
      /**
       * Returns the transform-style property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#transform-style-property
       * @param el {Element} The dom element to read the property.
       * @return {String} The set property, either <code>flat</code> or
       *   <code>preserve-3d</code>.
       */
      getStyle(el) {
        if (this.__cssKeys__P_217_0 != null) {
          return el.style[this.__cssKeys__P_217_0["style"]];
        }
        return "";
      },
      /**
       * Sets the perspective property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#perspective-property
       * @param el {Element} The dom element to set the property.
       * @param value {Number} The perspective layer. Numbers between 100
       *   and 5000 give the best results.
       */
      setPerspective(el, value) {
        if (this.__cssKeys__P_217_0 != null) {
          el.style[this.__cssKeys__P_217_0["perspective"]] = value + "px";
        }
      },
      /**
       * Returns the perspective property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#perspective-property
       * @param el {Element} The dom element to read the property.
       * @return {String} The set property, e.g. <code>500</code>
       */
      getPerspective(el) {
        if (this.__cssKeys__P_217_0 != null) {
          return el.style[this.__cssKeys__P_217_0["perspective"]];
        }
        return "";
      },
      /**
       * Sets the perspective-origin property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#perspective-origin-property
       * @param el {Element} The dom element to set the property.
       * @param value {String} CSS position values like <code>50% 50%</code> or
       *   <code>left top</code>.
       */
      setPerspectiveOrigin(el, value) {
        if (this.__cssKeys__P_217_0 != null) {
          el.style[this.__cssKeys__P_217_0["perspective-origin"]] = value;
        }
      },
      /**
       * Returns the perspective-origin property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#perspective-origin-property
       * @param el {Element} The dom element to read the property.
       * @return {String} The set property, e.g. <code>50% 50%</code>
       */
      getPerspectiveOrigin(el) {
        if (this.__cssKeys__P_217_0 != null) {
          var value = el.style[this.__cssKeys__P_217_0["perspective-origin"]];
          if (value != "") {
            return value;
          } else {
            var valueX = el.style[this.__cssKeys__P_217_0["perspective-origin"] + "X"];
            var valueY = el.style[this.__cssKeys__P_217_0["perspective-origin"] + "Y"];
            if (valueX != "") {
              return valueX + " " + valueY;
            }
          }
        }
        return "";
      },
      /**
       * Sets the backface-visibility property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#backface-visibility-property
       * @param el {Element} The dom element to set the property.
       * @param value {Boolean} <code>true</code> if the backface should be visible.
       */
      setBackfaceVisibility(el, value) {
        if (this.__cssKeys__P_217_0 != null) {
          el.style[this.__cssKeys__P_217_0["backface-visibility"]] = value ? "visible" : "hidden";
        }
      },
      /**
       * Returns the backface-visibility property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#backface-visibility-property
       * @param el {Element} The dom element to read the property.
       * @return {Boolean} <code>true</code>, if the backface is visible.
       */
      getBackfaceVisibility(el) {
        if (this.__cssKeys__P_217_0 != null) {
          return el.style[this.__cssKeys__P_217_0["backface-visibility"]] == "visible";
        }
        return true;
      },
      /**
       * Converts the given transforms map to a valid CSS string.
       *
       * @param transforms {Map} A map containing the transforms.
       * @return {String} The CSS transforms.
       */
      getTransformValue(transforms) {
        var value = "";
        var properties3d = ["translate", "scale"];
        for (var property in transforms) {
          var params = transforms[property];

          // if an array is given
          if (qx.Bootstrap.isArray(params)) {
            // use 3d properties for translate and scale if all 3 parameter are given
            if (params.length === 3 && properties3d.indexOf(property) > -1 && qx.core.Environment.get("css.transform.3d")) {
              value += this._compute3dProperty(property, params);
            }

            // use axis related properties
            else {
              value += this._computeAxisProperties(property, params);
            }

            // case for single values given
          } else {
            // single value case
            value += property + "(" + params + ") ";
          }
        }
        return value.trim();
      },
      /**
       * Helper function to create 3d property.
       *
       * @param property {String} Property of transform, e.g. translate
       * @param params {Array} Array with three values, each one stands for an axis.
       *
       * @return {String} Computed property and its value
       */
      _compute3dProperty(property, params) {
        var cssValue = "";
        property += "3d";
        for (var i = 0; i < params.length; i++) {
          if (params[i] == null) {
            params[i] = 0;
          }
        }
        cssValue += property + "(" + params.join(", ") + ") ";
        return cssValue;
      },
      /**
       * Helper function to create axis related properties.
       *
       * @param property {String} Property of transform, e.g. rotate
       * @param params {Array} Array with values, each one stands for an axis.
       *
       * @return {String} Computed property and its value
       */
      _computeAxisProperties(property, params) {
        var value = "";
        var dimensions = ["X", "Y", "Z"];
        for (var i = 0; i < params.length; i++) {
          if (params[i] == null || i == 2 && !qx.core.Environment.get("css.transform.3d")) {
            continue;
          }
          value += property + dimensions[i] + "(";
          value += params[i];
          value += ") ";
        }
        return value;
      }
    }
  });
  qx.bom.element.Transform.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.Promise": {
        "construct": true
      },
      "qx.bom.Label": {},
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.event.Timer": {},
      "qx.bom.element.Dimension": {},
      "qx.lang.Object": {},
      "qx.bom.element.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
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
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
  ************************************************************************ */

  /**
   * Checks whether a given font is available on the document and fires events
   * accordingly.
   *
   * This class does not need to be disposed, unless you want to abort the validation
   * early
   */
  qx.Class.define("qx.bom.webfonts.Validator", {
    extend: qx.core.Object,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param fontFamily {String} The name of the font to be verified
     * @param comparisonString {String?} String to be used to detect whether a font was loaded or not
     * @param fontWeight {String?} the weight of the font to be verified
     * @param fontStyle {String?} the style of the font to be verified
     * whether the font has loaded properly
     */
    construct(fontFamily, comparisonString, fontWeight, fontStyle) {
      qx.core.Object.constructor.call(this);
      if (comparisonString) {
        this.setComparisonString(comparisonString);
      }
      if (fontWeight) {
        this.setFontWeight(fontWeight);
      }
      if (fontStyle) {
        this.setFontStyle(fontStyle);
      }
      if (fontFamily) {
        this.setFontFamily(fontFamily);
        this.__requestedHelpers__P_212_0 = this._getRequestedHelpers();
      }
      this.__promiseValid__P_212_1 = new qx.Promise();
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Sets of serif and sans-serif fonts to be used for size comparisons.
       * At least one of these fonts should be present on any system.
       */
      COMPARISON_FONTS: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        serif: ["Times New Roman", "Georgia", "serif"]
      },
      /**
       * Map of common CSS attributes to be used for all  size comparison elements
       */
      HELPER_CSS: {
        position: "absolute",
        margin: "0",
        padding: "0",
        top: "-1000px",
        left: "-1000px",
        fontSize: "350px",
        width: "auto",
        height: "auto",
        lineHeight: "normal",
        fontVariant: "normal",
        visibility: "hidden"
      },
      /**
       * The string to be used in the size comparison elements. This is the default string
       * which is used for the {@link #COMPARISON_FONTS} and the font to be validated. It
       * can be overridden for the font to be validated using the {@link #comparisonString}
       * property.
       */
      COMPARISON_STRING: "WEei",
      __defaultSizes__P_212_2: null,
      __defaultHelpers__P_212_3: null,
      /**
       * Removes the two common helper elements used for all size comparisons from
       * the DOM
       */
      removeDefaultHelperElements() {
        var defaultHelpers = qx.bom.webfonts.Validator.__defaultHelpers__P_212_3;
        if (defaultHelpers) {
          for (var prop in defaultHelpers) {
            document.body.removeChild(defaultHelpers[prop]);
          }
        }
        delete qx.bom.webfonts.Validator.__defaultHelpers__P_212_3;
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * The font-family this validator should check
       */
      fontFamily: {
        nullable: true,
        init: null,
        apply: "_applyFontFamily"
      },
      /** The font weight to check */
      fontWeight: {
        nullable: true,
        check: "String",
        apply: "_applyFontWeight"
      },
      /** The font style to check */
      fontStyle: {
        nullable: true,
        check: "String",
        apply: "_applyFontStyle"
      },
      /**
       * Comparison string used to check whether the font has loaded or not.
       */
      comparisonString: {
        nullable: true,
        init: null
      },
      /**
       * Time in milliseconds from the beginning of the check until it is assumed
       * that a font is not available
       */
      timeout: {
        check: "Integer",
        init: 5000
      }
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired when the status of a web font has been determined. The event data
       * is a map with the keys "family" (the font-family name) and "valid"
       * (Boolean).
       */
      changeStatus: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __requestedHelpers__P_212_0: null,
      __checkTimer__P_212_4: null,
      __checkStarted__P_212_5: null,
      __promiseValid__P_212_1: null,
      /*
      ---------------------------------------------------------------------------
        PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * Validates the font
       */
      validate() {
        if (this.__checkStarted__P_212_5) {
          return;
        }
        const setValidImpl = valid => {
          if (this.__checkTimer__P_212_4) {
            this.__checkTimer__P_212_4.stop();
          }
          this._reset();
          this.__promiseValid__P_212_1.resolve(valid);
          this.fireDataEvent("changeStatus", {
            family: this.getFontFamily(),
            valid: valid
          });
        };
        if (document.fonts && typeof document.fonts.load == "function") {
          this.__checkStarted__P_212_5 = new Date().getTime();
          let fontExpr = `${this.getFontStyle() || "normal"} ${this.getFontWeight() || "normal"} 14px ${this.getFontFamily()}`;
          const loadImpl = async () => {
            try {
              await document.fonts.load(fontExpr);
              await document.fonts.ready;
              qx.bom.Label.getTextSize("Hello World", {
                fontFamily: this.getFontFamily(),
                fontStyle: this.getFontStyle(),
                fontWeight: this.getFontWeight()
              });
              setTimeout(() => setValidImpl(this._isFontValid()), 100);
            } catch (ex) {
              this.warn(`Exception while loading font ${fontExpr}: ` + ex);
              setValidImpl(false);
            }
          };
          loadImpl();
        } else {
          this.__checkStarted__P_212_5 = new Date().getTime();
          let fontExpr = `${this.getFontStyle() || "normal"} ${this.getFontWeight() || "normal"} 14px ${this.getFontFamily()}`;
          const timerCheck = () => {
            if (this._isFontValid()) {
              // safari has trouble resizing, adding it again fixed the issue [BUG #8786]
              if (qx.core.Environment.get("browser.name") == "safari" && parseFloat(qx.core.Environment.get("browser.version")) >= 8) {
                setTimeout(() => setValidImpl(true), 100);
              } else {
                setValidImpl(true);
              }
            } else {
              var now = new Date().getTime();
              if (now - this.__checkStarted__P_212_5 >= this.getTimeout()) {
                setValidImpl(false);
              }
            }
          };

          // Give the browser a chance to render the new elements
          qx.event.Timer.once(() => {
            this.__checkTimer__P_212_4 = new qx.event.Timer(100);
            this.__checkTimer__P_212_4.addListener("interval", timerCheck);
            this.__checkTimer__P_212_4.start();
          }, this, 0);
        }
      },
      /**
       * Waits for the font to become invalid or valid
       *
       * @returns {Boolean} whether valid or not
       */
      async isValid() {
        return await this.__promiseValid__P_212_1;
      },
      /*
      ---------------------------------------------------------------------------
        PROTECTED API
      ---------------------------------------------------------------------------
      */

      /**
       * Removes the helper elements from the DOM
       */
      _reset() {
        if (this.__requestedHelpers__P_212_0) {
          for (var prop in this.__requestedHelpers__P_212_0) {
            var elem = this.__requestedHelpers__P_212_0[prop];
            document.body.removeChild(elem);
          }
          this.__requestedHelpers__P_212_0 = null;
        }
      },
      /**
       * Checks if the font is available by comparing the widths of the elements
       * using the generic fonts to the widths of the elements using the font to
       * be validated
       *
       * @return {Boolean} Whether or not the font caused the elements to differ
       * in size
       */
      _isFontValid() {
        if (!qx.bom.webfonts.Validator.__defaultSizes__P_212_2) {
          this.__init__P_212_6();
        }
        if (!this.__requestedHelpers__P_212_0) {
          this.__requestedHelpers__P_212_0 = this._getRequestedHelpers();
        }

        // force rerendering for chrome
        this.__requestedHelpers__P_212_0.sans.style.visibility = "visible";
        this.__requestedHelpers__P_212_0.sans.style.visibility = "hidden";
        this.__requestedHelpers__P_212_0.serif.style.visibility = "visible";
        this.__requestedHelpers__P_212_0.serif.style.visibility = "hidden";
        var requestedSans = qx.bom.element.Dimension.getWidth(this.__requestedHelpers__P_212_0.sans);
        var requestedSerif = qx.bom.element.Dimension.getWidth(this.__requestedHelpers__P_212_0.serif);
        var cls = qx.bom.webfonts.Validator;
        if (requestedSans !== cls.__defaultSizes__P_212_2.sans || requestedSerif !== cls.__defaultSizes__P_212_2.serif) {
          return true;
        }
        return false;
      },
      /**
       * Creates the two helper elements styled with the font to be checked
       *
       * @return {Map} A map with the keys <pre>sans</pre> and <pre>serif</pre>
       * and the created span elements as values
       */
      _getRequestedHelpers() {
        var fontsSans = [this.getFontFamily()].concat(qx.bom.webfonts.Validator.COMPARISON_FONTS.sans);
        var fontsSerif = [this.getFontFamily()].concat(qx.bom.webfonts.Validator.COMPARISON_FONTS.serif);
        return {
          sans: this._getHelperElement(fontsSans, this.getComparisonString()),
          serif: this._getHelperElement(fontsSerif, this.getComparisonString())
        };
      },
      /**
       * Creates a span element with the comparison text (either {@link #COMPARISON_STRING} or
       * {@link #comparisonString}) and styled with the default CSS ({@link #HELPER_CSS}) plus
       * the given font-family value and appends it to the DOM
       *
       * @param fontFamily {String} font-family string
       * @param comparisonString {String?} String to be used to detect whether a font was loaded or not
       * @return {Element} the created DOM element
       */
      _getHelperElement(fontFamily, comparisonString) {
        var styleMap = qx.lang.Object.clone(qx.bom.webfonts.Validator.HELPER_CSS);
        if (fontFamily) {
          if (styleMap.fontFamily) {
            styleMap.fontFamily += "," + fontFamily.join(",");
          } else {
            styleMap.fontFamily = fontFamily.join(",");
          }
        }
        if (this.getFontWeight()) {
          styleMap.fontWeight = this.getFontWeight();
        }
        if (this.getFontStyle()) {
          styleMap.fontStyle = this.getFontStyle();
        }
        var elem = document.createElement("span");
        elem.innerHTML = comparisonString || qx.bom.webfonts.Validator.COMPARISON_STRING;
        qx.bom.element.Style.setStyles(elem, styleMap);
        document.body.appendChild(elem);
        return elem;
      },
      // property apply
      _applyFontFamily(value, old) {
        if (value !== old) {
          this._reset();
        }
      },
      // property apply
      _applyFontWeight(value, old) {
        if (value !== old) {
          this._reset();
        }
      },
      // property apply
      _applyFontStyle(value, old) {
        if (value !== old) {
          this._reset();
        }
      },
      /*
      ---------------------------------------------------------------------------
        PRIVATE API
      ---------------------------------------------------------------------------
      */

      /**
       * Creates the default helper elements and gets their widths
       */
      __init__P_212_6() {
        var cls = qx.bom.webfonts.Validator;
        if (!cls.__defaultHelpers__P_212_3) {
          cls.__defaultHelpers__P_212_3 = {
            sans: this._getHelperElement(cls.COMPARISON_FONTS.sans),
            serif: this._getHelperElement(cls.COMPARISON_FONTS.serif)
          };
        }
        cls.__defaultSizes__P_212_2 = {
          sans: qx.bom.element.Dimension.getWidth(cls.__defaultHelpers__P_212_3.sans),
          serif: qx.bom.element.Dimension.getWidth(cls.__defaultHelpers__P_212_3.serif)
        };
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._reset();
      if (this.__checkTimer__P_212_4 != null) {
        this.__checkTimer__P_212_4.stop();
      }
      this._disposeObjects("__checkTimer__P_212_4");
    }
  });
  qx.bom.webfonts.Validator.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
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
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Abstract class to compute the position of an object on one axis.
   */
  qx.Bootstrap.define("qx.util.placement.AbstractAxis", {
    extend: Object,
    statics: {
      /**
       * Computes the start of the object on the axis
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param areaSize {Integer} Size of the axis.
       * @param position {String} Alignment of the object on the target. Valid values are
       *   <ul>
       *   <li><code>edge-start</code> The object is placed before the target</li>
       *   <li><code>edge-end</code> The object is placed after the target</li>
       *   <li><code>align-start</code>The start of the object is aligned with the start of the target</li>
       *   <li><code>align-center</code>The center of the object is aligned with the center of the target</li>
       *   <li><code>align-end</code>The end of the object is aligned with the end of the object</li>
       *   </ul>
       * @return {Integer} The computed start position of the object.
       * @abstract
       */
      computeStart(size, target, offsets, areaSize, position) {
        throw new Error("abstract method call!");
      },
      /**
       * Computes the start of the object by taking only the attachment and
       * alignment into account. The object by be not fully visible.
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param position {String} Accepts the same values as the <code> position</code>
       *   argument of {@link #computeStart}.
       * @return {Integer} The computed start position of the object.
       */
      _moveToEdgeAndAlign(size, target, offsets, position) {
        switch (position) {
          case "edge-start":
            return target.start - offsets.end - size;
          case "edge-end":
            return target.end + offsets.start;
          case "align-start":
            return target.start + offsets.start;
          case "align-center":
            return target.start + parseInt((target.end - target.start - size) / 2, 10) + offsets.start;
          case "align-end":
            return target.end - offsets.end - size;
        }
      },
      /**
       * Whether the object specified by <code>start</code> and <code>size</code>
       * is completely inside of the axis' range..
       *
       * @param start {Integer} Computed start position of the object
       * @param size {Integer} Size of the object
       * @param areaSize {Integer} The size of the axis
       * @return {Boolean} Whether the object is inside of the axis' range
       */
      _isInRange(start, size, areaSize) {
        return start >= 0 && start + size <= areaSize;
      }
    }
  });
  qx.util.placement.AbstractAxis.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.placement.AbstractAxis": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Places the object directly at the specified position. It is not moved if
   * parts of the object are outside of the axis' range.
   */
  qx.Bootstrap.define("qx.util.placement.DirectAxis", {
    statics: {
      /**
       * Computes the start of the object by taking only the attachment and
       * alignment into account. The object by be not fully visible.
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param position {String} Accepts the same values as the <code> position</code>
       *   argument of {@link #computeStart}.
       * @return {Integer} The computed start position of the object.
       */
      _moveToEdgeAndAlign: qx.util.placement.AbstractAxis._moveToEdgeAndAlign,
      /**
       * Computes the start of the object on the axis
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param areaSize {Integer} Size of the axis.
       * @param position {String} Alignment of the object on the target. Valid values are
       *   <ul>
       *   <li><code>edge-start</code> The object is placed before the target</li>
       *   <li><code>edge-end</code> The object is placed after the target</li>
       *   <li><code>align-start</code>The start of the object is aligned with the start of the target</li>
       *   <li><code>align-center</code>The center of the object is aligned with the center of the target</li>
       *   <li><code>align-end</code>The end of the object is aligned with the end of the object</li>
       *   </ul>
       * @return {Integer} The computed start position of the object.
       */
      computeStart(size, target, offsets, areaSize, position) {
        return this._moveToEdgeAndAlign(size, target, offsets, position);
      }
    }
  });
  qx.util.placement.DirectAxis.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.placement.AbstractAxis": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Places the object to the target. If parts of the object are outside of the
   * range this class places the object at the best "edge", "alignment"
   * combination so that the overlap between object and range is maximized.
   */
  qx.Bootstrap.define("qx.util.placement.KeepAlignAxis", {
    statics: {
      /**
       * Computes the start of the object by taking only the attachment and
       * alignment into account. The object by be not fully visible.
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param position {String} Accepts the same values as the <code> position</code>
       *   argument of {@link #computeStart}.
       * @return {Integer} The computed start position of the object.
       */
      _moveToEdgeAndAlign: qx.util.placement.AbstractAxis._moveToEdgeAndAlign,
      /**
       * Whether the object specified by <code>start</code> and <code>size</code>
       * is completely inside of the axis' range..
       *
       * @param start {Integer} Computed start position of the object
       * @param size {Integer} Size of the object
       * @param areaSize {Integer} The size of the axis
       * @return {Boolean} Whether the object is inside of the axis' range
       */
      _isInRange: qx.util.placement.AbstractAxis._isInRange,
      /**
       * Computes the start of the object on the axis
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param areaSize {Integer} Size of the axis.
       * @param position {String} Alignment of the object on the target. Valid values are
       *   <ul>
       *   <li><code>edge-start</code> The object is placed before the target</li>
       *   <li><code>edge-end</code> The object is placed after the target</li>
       *   <li><code>align-start</code>The start of the object is aligned with the start of the target</li>
       *   <li><code>align-center</code>The center of the object is aligned with the center of the target</li>
       *   <li><code>align-end</code>The end of the object is aligned with the end of the object</li>
       *   </ul>
       * @return {Integer} The computed start position of the object.
       */
      computeStart(size, target, offsets, areaSize, position) {
        var start = this._moveToEdgeAndAlign(size, target, offsets, position);
        var range1End, range2Start;
        if (this._isInRange(start, size, areaSize)) {
          return start;
        }
        if (position == "edge-start" || position == "edge-end") {
          range1End = target.start - offsets.end;
          range2Start = target.end + offsets.start;
        } else {
          range1End = target.end - offsets.end;
          range2Start = target.start + offsets.start;
        }
        if (range1End > areaSize - range2Start) {
          start = Math.max(0, range1End - size);
        } else {
          start = range2Start;
        }
        return start;
      }
    }
  });
  qx.util.placement.KeepAlignAxis.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.placement.AbstractAxis": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Places the object according to the target. If parts of the object are outside
   * of the axis' range the object's start is adjusted so that the overlap between
   * the object and the axis is maximized.
   */
  qx.Bootstrap.define("qx.util.placement.BestFitAxis", {
    statics: {
      /**
       * Whether the object specified by <code>start</code> and <code>size</code>
       * is completely inside of the axis' range..
       *
       * @param start {Integer} Computed start position of the object
       * @param size {Integer} Size of the object
       * @param areaSize {Integer} The size of the axis
       * @return {Boolean} Whether the object is inside of the axis' range
       */
      _isInRange: qx.util.placement.AbstractAxis._isInRange,
      /**
       * Computes the start of the object by taking only the attachment and
       * alignment into account. The object by be not fully visible.
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param position {String} Accepts the same values as the <code> position</code>
       *   argument of {@link #computeStart}.
       * @return {Integer} The computed start position of the object.
       */
      _moveToEdgeAndAlign: qx.util.placement.AbstractAxis._moveToEdgeAndAlign,
      /**
       * Computes the start of the object on the axis
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param areaSize {Integer} Size of the axis.
       * @param position {String} Alignment of the object on the target. Valid values are
       *   <ul>
       *   <li><code>edge-start</code> The object is placed before the target</li>
       *   <li><code>edge-end</code> The object is placed after the target</li>
       *   <li><code>align-start</code>The start of the object is aligned with the start of the target</li>
       *   <li><code>align-center</code>The center of the object is aligned with the center of the target</li>
       *   <li><code>align-end</code>The end of the object is aligned with the end of the object</li>
       *   </ul>
       * @return {Integer} The computed start position of the object.
       */
      computeStart(size, target, offsets, areaSize, position) {
        var start = this._moveToEdgeAndAlign(size, target, offsets, position);
        if (this._isInRange(start, size, areaSize)) {
          return start;
        }
        if (start < 0) {
          start = Math.min(0, areaSize - size);
        }
        if (start + size > areaSize) {
          start = Math.max(0, areaSize - size);
        }
        return start;
      }
    }
  });
  qx.util.placement.BestFitAxis.$$dbClassInfo = $$dbClassInfo;
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
      "qx.event.IEventHandler": {
        "require": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.Iframe": {},
      "qx.event.type.Data": {}
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
  
  ************************************************************************ */

  /**
   * This handler provides a "load" event for iframes
   */
  qx.Class.define("qx.event.handler.Iframe", {
    extend: qx.core.Object,
    implement: qx.event.IEventHandler,
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
        load: 1,
        navigate: 1
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: false,
      /**
       * Internal function called by iframes created using {@link qx.bom.Iframe}.
       *
       * @signature function(target)
       * @internal
       * @param target {Element} DOM element which is the target of this event
       */
      onevent: qx.event.GlobalError.observeMethod(function (target) {
        // Fire navigate event when actual URL diverges from stored URL
        var currentUrl = qx.bom.Iframe.queryCurrentUrl(target);
        if (currentUrl !== target.$$url) {
          qx.event.Registration.fireEvent(target, "navigate", qx.event.type.Data, [currentUrl]);
          target.$$url = currentUrl;
        }

        // Always fire load event
        qx.event.Registration.fireEvent(target, "load");
      })
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER INTERFACE
      ---------------------------------------------------------------------------
      */

      // interface implementation
      canHandleEvent(target, type) {
        return target.tagName.toLowerCase() === "iframe";
      },
      // interface implementation
      registerEvent(target, type, capture) {
        // Nothing needs to be done here
      },
      // interface implementation
      unregisterEvent(target, type, capture) {
        // Nothing needs to be done here
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      qx.event.Registration.addHandler(statics);
    }
  });
  qx.event.handler.Iframe.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.Iframe": {
        "require": true
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Object": {},
      "qx.dom.Element": {},
      "qx.dom.Hierarchy": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.log.Logger": {},
      "qx.bom.Event": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "os.name": {
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Jonathan Weiß (jonathan_rass)
       * Christian Hagendorn (Chris_schmidt)
  
  ************************************************************************ */

  /**
   * Cross browser abstractions to work with iframes.
   *
   * @require(qx.event.handler.Iframe)
   */
  qx.Class.define("qx.bom.Iframe", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * @type {Map} Default attributes for creation {@link #create}.
       */
      DEFAULT_ATTRIBUTES: {
        frameBorder: 0,
        frameSpacing: 0,
        marginWidth: 0,
        marginHeight: 0,
        hspace: 0,
        vspace: 0,
        border: 0,
        allowTransparency: true
      },
      /**
       * Creates an DOM element.
       *
       * Attributes may be given directly with this call. This is critical
       * for some attributes e.g. name, type, ... in many clients.
       *
       * @param attributes {Map?null} Map of attributes to apply
       * @param win {Window?null} Window to create the element for
       * @return {Element} The created iframe node
       */
      create(attributes, win) {
        // Work on a copy to not modify given attributes map
        var attributes = attributes ? qx.lang.Object.clone(attributes) : {};
        var initValues = qx.bom.Iframe.DEFAULT_ATTRIBUTES;
        for (var key in initValues) {
          if (!(key in attributes)) {
            attributes[key] = initValues[key];
          }
        }
        var elem = qx.dom.Element.create("iframe", attributes, win);
        if (!("onload" in attributes)) {
          elem.onload = function () {
            qx.event.handler.Iframe.onevent(elem);
          };
        }
        return elem;
      },
      /**
       * Get the DOM window object of an iframe.
       *
       * @param iframe {Element} DOM element of the iframe.
       * @return {Window?null} The DOM window object of the iframe or null.
       * @signature function(iframe)
       */
      getWindow(iframe) {
        try {
          return iframe.contentWindow;
        } catch (ex) {
          return null;
        }
      },
      /**
       * Get the DOM document object of an iframe.
       *
       * @param iframe {Element} DOM element of the iframe.
       * @return {Document} The DOM document object of the iframe.
       */
      getDocument(iframe) {
        if ("contentDocument" in iframe) {
          try {
            return iframe.contentDocument;
          } catch (ex) {
            return null;
          }
        }
        try {
          var win = this.getWindow(iframe);
          return win ? win.document : null;
        } catch (ex) {
          return null;
        }
      },
      /**
       * Get the HTML body element of the iframe.
       *
       * @param iframe {Element} DOM element of the iframe.
       * @return {Element} The DOM node of the <code>body</code> element of the iframe.
       */
      getBody(iframe) {
        try {
          var doc = this.getDocument(iframe);
          return doc ? doc.getElementsByTagName("body")[0] : null;
        } catch (ex) {
          return null;
        }
      },
      /**
       * Sets iframe's source attribute to given value
       *
       * @param iframe {Element} DOM element of the iframe.
       * @param source {String} URL to be set.
       * @signature function(iframe, source)
       */
      setSource(iframe, source) {
        try {
          // the guru says ...
          // it is better to use 'replace' than 'src'-attribute, since 'replace'
          // does not interfere with the history (which is taken care of by the
          // history manager), but there has to be a loaded document
          if (this.getWindow(iframe) && qx.dom.Hierarchy.isRendered(iframe)) {
            /*
              Some gecko users might have an exception here:
              Exception... "Component returned failure code: 0x805e000a
              [nsIDOMLocation.replace]"  nsresult: "0x805e000a (<unknown>)"
            */
            try {
              // Webkit on Mac can't set the source when the iframe is still
              // loading its current page
              if (qx.core.Environment.get("engine.name") == "webkit" && qx.core.Environment.get("os.name") == "osx") {
                var contentWindow = this.getWindow(iframe);
                if (contentWindow) {
                  contentWindow.stop();
                }
              }
              this.getWindow(iframe).location.replace(source);
            } catch (ex) {
              iframe.src = source;
            }
          } else {
            iframe.src = source;
          }

          // This is a programmer provided source. Remember URL for this source
          // for later comparison with current URL. The current URL can diverge
          // if the end-user navigates in the Iframe.
          this.__rememberUrl__P_213_0(iframe);
        } catch (ex) {
          qx.log.Logger.warn("Iframe source could not be set!");
        }
      },
      /**
       * Returns the current (served) URL inside the iframe
       *
       * @param iframe {Element} DOM element of the iframe.
       * @return {String} Returns the location href or null (if a query is not possible/allowed)
       */
      queryCurrentUrl(iframe) {
        var doc = this.getDocument(iframe);
        try {
          if (doc && doc.location) {
            return doc.location.href;
          }
        } catch (ex) {}
        return "";
      },
      /**
       * Remember actual URL of iframe.
       *
       * @param iframe {Element} DOM element of the iframe.
       */
      __rememberUrl__P_213_0(iframe) {
        // URL can only be detected after load. Retrieve and store URL once.
        var callback = function () {
          qx.bom.Event.removeNativeListener(iframe, "load", callback);
          iframe.$$url = qx.bom.Iframe.queryCurrentUrl(iframe);
        };
        qx.bom.Event.addNativeListener(iframe, "load", callback);
      }
    }
  });
  qx.bom.Iframe.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.Assert": {},
      "qx.lang.Object": {},
      "qx.dom.Element": {},
      "qx.lang.Type": {},
      "qx.bom.client.Engine": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine",
          "load": true
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
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * jQuery
       http://jquery.com
       Version 1.3.1
  
       Copyright:
         2009 John Resig
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
  ************************************************************************ */

  /**
   * Cross browser abstractions to work with input elements.
   */
  qx.Bootstrap.define("qx.bom.Input", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Map} Internal data structures with all supported input types */
      __types__P_205_0: {
        textarea: true,
        select: true,
        button: true,
        checkbox: true,
        color: true,
        date: true,
        "datetime-local": true,
        email: true,
        file: true,
        hidden: true,
        image: true,
        month: true,
        number: true,
        password: true,
        radio: true,
        range: true,
        reset: true,
        search: true,
        submit: true,
        tel: true,
        text: true,
        time: true,
        url: true,
        week: true
      },
      /**
       * Creates an DOM input/textarea/select element.
       *
       * Attributes may be given directly with this call. This is critical
       * for some attributes e.g. name, type, ... in many clients.
       *
       * Note: <code>select</code> and <code>textarea</code> elements are created
       * using the identically named <code>type</code>.
       *
       * @param type {String} Any valid type for HTML, <code>select</code>
       *   and <code>textarea</code>
       * @param attributes {Map} Map of attributes to apply
       * @param win {Window} Window to create the element for
       * @return {Element} The created input node
       */
      create(type, attributes, win) {
        {
          qx.core.Assert.assertKeyInMap(type, this.__types__P_205_0, "Unsupported input type.");
        }

        // Work on a copy to not modify given attributes map
        var attributes = attributes ? qx.lang.Object.clone(attributes) : {};
        var tag;
        if (type === "textarea" || type === "select") {
          tag = type;
        } else {
          tag = "input";
          attributes.type = type;
        }
        return qx.dom.Element.create(tag, attributes, win);
      },
      /**
       * Applies the given value to the element.
       *
       * Normally the value is given as a string/number value and applied
       * to the field content (textfield, textarea) or used to
       * detect whether the field is checked (checkbox, radiobutton).
       *
       * Supports array values for selectboxes (multiple-selection)
       * and checkboxes or radiobuttons (for convenience).
       *
       * Please note: To modify the value attribute of a checkbox or
       * radiobutton use {@link qx.bom.element.Attribute#set} instead.
       *
       * @param element {Element} element to update
       * @param value {String|Number|Array} the value to apply
       */
      setValue(element, value) {
        var tag = element.nodeName.toLowerCase();
        var type = element.type;
        var Type = qx.lang.Type;
        if (typeof value === "number") {
          value += "";
        }
        if (type === "checkbox" || type === "radio") {
          if (Type.isArray(value)) {
            element.checked = value.includes(element.value);
          } else {
            element.checked = element.value == value;
          }
        } else if (tag === "select") {
          var isArray = Type.isArray(value);
          var options = element.options;
          var subel, subval;
          for (var i = 0, l = options.length; i < l; i++) {
            subel = options[i];
            subval = subel.getAttribute("value");
            if (subval == null) {
              subval = subel.text;
            }
            subel.selected = isArray ? value.includes(subval) : value == subval;
          }
          if (isArray && value.length == 0) {
            element.selectedIndex = -1;
          }
        } else if ((type === "text" || type === "textarea") && qx.core.Environment.get("engine.name") == "mshtml") {
          // These flags are required to detect self-made property-change
          // events during value modification. They are used by the Input
          // event handler to filter events.
          element.$$inValueSet = true;
          element.value = value;
          element.$$inValueSet = null;
        } else {
          element.value = value;
        }
      },
      /**
       * Returns the currently configured value.
       *
       * Works with simple input fields as well as with
       * select boxes or option elements.
       *
       * Returns an array in cases of multi-selection in
       * select boxes but in all other cases a string.
       *
       * @param element {Element} DOM element to query
       * @return {String|Array} The value of the given element
       */
      getValue(element) {
        var tag = element.nodeName.toLowerCase();
        if (tag === "option") {
          return (element.attributes.value || {}).specified ? element.value : element.text;
        }
        if (tag === "select") {
          var index = element.selectedIndex;

          // Nothing was selected
          if (index < 0) {
            return null;
          }
          var values = [];
          var options = element.options;
          var one = element.type == "select-one";
          var clazz = qx.bom.Input;
          var value;

          // Loop through all the selected options
          for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
            var option = options[i];
            if (option.selected) {
              // Get the specific value for the option
              value = clazz.getValue(option);

              // We don't need an array for one selects
              if (one) {
                return value;
              }

              // Multi-Selects return an array
              values.push(value);
            }
          }
          return values;
        } else {
          return (element.value || "").replace(/\r/g, "");
        }
      },
      /**
       * Sets the text wrap behaviour of a text area element.
       * This property uses the attribute "wrap" respectively
       * the style property "whiteSpace"
       *
       * @signature function(element, wrap)
       * @param element {Element} DOM element to modify
       * @param wrap {Boolean} Whether to turn text wrap on or off.
       */
      setWrap: qx.core.Environment.select("engine.name", {
        mshtml(element, wrap) {
          var wrapValue = wrap ? "soft" : "off";

          // Explicitly set overflow-y CSS property to auto when wrapped,
          // allowing the vertical scroll-bar to appear if necessary
          var styleValue = wrap ? "auto" : "";
          element.wrap = wrapValue;
          element.style.overflowY = styleValue;
        },
        gecko(element, wrap) {
          var wrapValue = wrap ? "soft" : "off";
          var styleValue = wrap ? "" : "auto";
          element.setAttribute("wrap", wrapValue);
          element.style.overflow = styleValue;
        },
        webkit(element, wrap) {
          var wrapValue = wrap ? "soft" : "off";
          var styleValue = wrap ? "" : "auto";
          element.setAttribute("wrap", wrapValue);
          element.style.overflow = styleValue;
        },
        default(element, wrap) {
          element.style.whiteSpace = wrap ? "normal" : "nowrap";
        }
      })
    }
  });
  qx.bom.Input.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.MenuButton": {
        "require": true
      },
      "qx.ui.toolbar.ToolBar": {},
      "qx.ui.menu.Manager": {}
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
  
  ************************************************************************ */

  /**
   * A menubar button
   */
  qx.Class.define("qx.ui.menubar.Button", {
    extend: qx.ui.form.MenuButton,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      appearance: {
        refine: true,
        init: "menubar-button"
      },
      show: {
        refine: true,
        init: "inherit"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Inspects the parent chain to find the MenuBar
       *
       * @return {qx.ui.menubar.MenuBar} MenuBar instance or <code>null</code>.
       */
      getMenuBar() {
        var parent = this;
        while (parent) {
          /* this method is also used by toolbar.MenuButton, so we need to check
             for a ToolBar instance. */
          if (parent instanceof qx.ui.toolbar.ToolBar) {
            return parent;
          }
          parent = parent.getLayoutParent();
        }
        return null;
      },
      // overridden
      open(selectFirst) {
        qx.ui.menubar.Button.superclass.prototype.open.call(this, selectFirst);
        var menubar = this.getMenuBar();
        if (menubar) {
          menubar._setAllowMenuOpenHover(true);
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Listener for visibility property changes of the attached menu
       *
       * @param e {qx.event.type.Data} Property change event
       */
      _onMenuChange(e) {
        var menu = this.getMenu();
        var menubar = this.getMenuBar();
        if (menu.isVisible()) {
          this.addState("pressed");

          // Sync with open menu property
          if (menubar) {
            menubar.setOpenMenu(menu);
          }
        } else {
          this.removeState("pressed");

          // Sync with open menu property
          if (menubar && menubar.getOpenMenu() == menu) {
            menubar.resetOpenMenu();
            menubar._setAllowMenuOpenHover(false);
          }
        }
      },
      // overridden
      _onPointerUp(e) {
        qx.ui.menubar.Button.superclass.prototype._onPointerUp.call(this, e);

        // Set state 'pressed' to visualize that the menu is open.
        var menu = this.getMenu();
        if (menu && menu.isVisible() && !this.hasState("pressed")) {
          this.addState("pressed");
        }
      },
      /**
       * Event listener for pointerover event
       *
       * @param e {qx.event.type.Pointer} pointerover event object
       */
      _onPointerOver(e) {
        // Add hovered state
        this.addState("hovered");

        // Open submenu
        if (this.getMenu() && e.getPointerType() == "mouse") {
          var menubar = this.getMenuBar();
          if (menubar && menubar._isAllowMenuOpenHover()) {
            // Hide all open menus
            qx.ui.menu.Manager.getInstance().hideAll();

            // Set it again, because hideAll remove it.
            menubar._setAllowMenuOpenHover(true);

            // Then show the attached menu
            if (this.isEnabled()) {
              this.open();
            }
          }
        }
      }
    }
  });
  qx.ui.menubar.Button.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.Button": {
        "construct": true,
        "require": true
      },
      "qx.event.AcceleratingTimer": {
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
       * Andreas Ecker (ecker)
       * Martin Wittemann (martinwittemann)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The RepeatButton is a special button, which fires repeatedly {@link #execute}
   * events, while a button is pressed on the button. The initial delay
   * and the interval time can be set using the properties {@link #firstInterval}
   * and {@link #interval}. The {@link #execute} events will be fired in a shorter
   * amount of time if a button is hold, until the min {@link #minTimer}
   * is reached. The {@link #timerDecrease} property sets the amount of milliseconds
   * which will decreased after every firing.
   *
   * <pre class='javascript'>
   *   var button = new qx.ui.form.RepeatButton("Hello World");
   *
   *   button.addListener("execute", function(e) {
   *     alert("Button is executed");
   *   }, this);
   *
   *   this.getRoot.add(button);
   * </pre>
   *
   * This example creates a button with the label "Hello World" and attaches an
   * event listener to the {@link #execute} event.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/repeatbutton.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.form.RepeatButton", {
    extend: qx.ui.form.Button,
    /**
     * @param label {String} Label to use
     * @param icon {String?null} Icon to use
     */
    construct(label, icon) {
      qx.ui.form.Button.constructor.call(this, label, icon);

      // create the timer and add the listener
      this.__timer__P_145_0 = new qx.event.AcceleratingTimer();
      this.__timer__P_145_0.addListener("interval", this._onInterval, this);
    },
    events: {
      /**
       * This event gets dispatched with every interval. The timer gets executed
       * as long as the user holds down a button.
       */
      execute: "qx.event.type.Event",
      /**
       * This event gets dispatched when the button is pressed.
       */
      press: "qx.event.type.Event",
      /**
       * This event gets dispatched when the button is released.
       */
      release: "qx.event.type.Event"
    },
    properties: {
      /**
       * Interval used after the first run of the timer. Usually a smaller value
       * than the "firstInterval" property value to get a faster reaction.
       */
      interval: {
        check: "Integer",
        init: 100
      },
      /**
       * Interval used for the first run of the timer. Usually a greater value
       * than the "interval" property value to a little delayed reaction at the first
       * time.
       */
      firstInterval: {
        check: "Integer",
        init: 500
      },
      /** This configures the minimum value for the timer interval. */
      minTimer: {
        check: "Integer",
        init: 20
      },
      /** Decrease of the timer on each interval (for the next interval) until minTimer reached. */
      timerDecrease: {
        check: "Integer",
        init: 2
      }
    },
    members: {
      __executed__P_145_1: null,
      __timer__P_145_0: null,
      /**
       * Calling this function is like a tap from the user on the
       * button with all consequences.
       * <span style='color: red'>Be sure to call the {@link #release} function.</span>
       *
       */
      press() {
        // only if the button is enabled
        if (this.isEnabled()) {
          // if the state pressed must be applied (first call)
          if (!this.hasState("pressed")) {
            // start the timer
            this.__startInternalTimer__P_145_2();
          }

          // set the states
          this.removeState("abandoned");
          this.addState("pressed");
        }
      },
      /**
       * Calling this function is like a release from the user on the
       * button with all consequences.
       * Usually the {@link #release} function will be called before the call of
       * this function.
       *
       * @param fireExecuteEvent {Boolean?true} flag which signals, if an event should be fired
       */
      release(fireExecuteEvent) {
        // only if the button is enabled
        if (!this.isEnabled()) {
          return;
        }

        // only if the button is pressed
        if (this.hasState("pressed")) {
          // if the button has not been executed
          if (!this.__executed__P_145_1) {
            this.execute();
          }
        }

        // remove button states
        this.removeState("pressed");
        this.removeState("abandoned");

        // stop the repeat timer and therefore the execution
        this.__stopInternalTimer__P_145_3();
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // overridden
      _applyEnabled(value, old) {
        qx.ui.form.RepeatButton.superclass.prototype._applyEnabled.call(this, value, old);
        if (!value) {
          if (this.isCapturing()) {
            // also release capture because out event is missing on iOS
            this.releaseCapture();
          }

          // remove button states
          this.removeState("pressed");
          this.removeState("abandoned");

          // stop the repeat timer and therefore the execution
          this.__stopInternalTimer__P_145_3();
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER
      ---------------------------------------------------------------------------
      */

      /**
       * Listener method for "pointerover" event
       * <ul>
       * <li>Adds state "hovered"</li>
       * <li>Removes "abandoned" and adds "pressed" state (if "abandoned" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onPointerOver(e) {
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
        if (this.hasState("abandoned")) {
          this.removeState("abandoned");
          this.addState("pressed");
          this.__timer__P_145_0.start();
        }
        this.addState("hovered");
      },
      /**
       * Listener method for "pointerout" event
       * <ul>
       * <li>Removes "hovered" state</li>
       * <li>Adds "abandoned" and removes "pressed" state (if "pressed" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onPointerOut(e) {
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
        this.removeState("hovered");
        if (this.hasState("pressed")) {
          this.removeState("pressed");
          this.addState("abandoned");
          this.__timer__P_145_0.stop();
        }
      },
      /**
       * Callback method for the "pointerdown" method.
       *
       * Sets the interval of the timer (value of firstInterval property) and
       * starts the timer. Additionally removes the state "abandoned" and adds the
       * state "pressed".
       *
       * @param e {qx.event.type.Pointer} pointerdown event
       */
      _onPointerDown(e) {
        if (!e.isLeftPressed()) {
          return;
        }

        // Activate capturing if the button get a pointerout while
        // the button is pressed.
        this.capture();
        this.__startInternalTimer__P_145_2();
        e.stopPropagation();
      },
      /**
       * Callback method for the "pointerup" event.
       *
       * Handles the case that the user is releasing a button
       * before the timer interval method got executed. This way the
       * "execute" method get executed at least one time.
       *
       * @param e {qx.event.type.Pointer} pointerup event
       */
      _onPointerUp(e) {
        this.releaseCapture();
        if (!this.hasState("abandoned")) {
          this.addState("hovered");
          if (this.hasState("pressed") && !this.__executed__P_145_1) {
            this.execute();
          }
        }
        this.__stopInternalTimer__P_145_3();
        e.stopPropagation();
      },
      // Nothing to do, 'execute' is already fired by _onPointerUp.
      _onTap(e) {},
      /**
       * Listener method for "keyup" event.
       *
       * Removes "abandoned" and "pressed" state (if "pressed" state is set)
       * for the keys "Enter" or "Space" and stops the internal timer
       * (same like pointer up).
       *
       * @param e {Event} Key event
       */
      _onKeyUp(e) {
        switch (e.getKeyIdentifier()) {
          case "Enter":
          case "Space":
            if (this.hasState("pressed")) {
              if (!this.__executed__P_145_1) {
                this.execute();
              }
              this.removeState("pressed");
              this.removeState("abandoned");
              e.stopPropagation();
              this.__stopInternalTimer__P_145_3();
            }
        }
      },
      /**
       * Listener method for "keydown" event.
       *
       * Removes "abandoned" and adds "pressed" state
       * for the keys "Enter" or "Space". It also starts
       * the internal timer (same like pointerdown).
       *
       * @param e {Event} Key event
       */
      _onKeyDown(e) {
        switch (e.getKeyIdentifier()) {
          case "Enter":
          case "Space":
            this.removeState("abandoned");
            this.addState("pressed");
            e.stopPropagation();
            this.__startInternalTimer__P_145_2();
        }
      },
      /**
       * Callback for the interval event.
       *
       * Stops the timer and starts it with a new interval
       * (value of the "interval" property - value of the "timerDecrease" property).
       * Dispatches the "execute" event.
       *
       * @param e {qx.event.type.Event} interval event
       */
      _onInterval(e) {
        this.__executed__P_145_1 = true;
        this.fireEvent("execute");
      },
      /*
      ---------------------------------------------------------------------------
        INTERNAL TIMER
      ---------------------------------------------------------------------------
      */

      /**
       * Starts the internal timer which causes firing of execution
       * events in an interval. It also presses the button.
       *
       */
      __startInternalTimer__P_145_2() {
        this.fireEvent("press");
        this.__executed__P_145_1 = false;
        this.__timer__P_145_0.set({
          interval: this.getInterval(),
          firstInterval: this.getFirstInterval(),
          minimum: this.getMinTimer(),
          decrease: this.getTimerDecrease()
        }).start();
        this.removeState("abandoned");
        this.addState("pressed");
      },
      /**
       * Stops the internal timer and releases the button.
       *
       */
      __stopInternalTimer__P_145_3() {
        this.fireEvent("release");
        this.__timer__P_145_0.stop();
        this.removeState("abandoned");
        this.removeState("pressed");
      }
    },
    /*
      *****************************************************************************
         DESTRUCTOR
      *****************************************************************************
      */

    destruct() {
      this._disposeObjects("__timer__P_145_0");
    }
  });
  qx.ui.form.RepeatButton.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.layout.Grow": {
        "construct": true
      },
      "qx.bom.AnimationFrame": {}
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
  
  ************************************************************************ */

  /**
   * This class represents a scroll able pane. This means that this widget
   * may contain content which is bigger than the available (inner)
   * dimensions of this widget. The widget also offer methods to control
   * the scrolling position. It can only have exactly one child.
   */
  qx.Class.define("qx.ui.core.scroll.ScrollPane", {
    extend: qx.ui.core.Widget,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.core.Widget.constructor.call(this);
      this.set({
        minWidth: 0,
        minHeight: 0
      });

      // Automatically configure a "fixed" grow layout.
      this._setLayout(new qx.ui.layout.Grow());

      // Add resize listener to "translate" event
      this.addListener("resize", this._onUpdate);
      var contentEl = this.getContentElement();

      // Synchronizes the DOM scroll position with the properties
      contentEl.addListener("scroll", this._onScroll, this);

      // Fixed some browser quirks e.g. correcting scroll position
      // to the previous value on re-display of a pane
      contentEl.addListener("appear", this._onAppear, this);
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired on resize of both the container or the content. */
      update: "qx.event.type.Event",
      /** Fired on scroll animation end invoked by 'scroll*' methods. */
      scrollAnimationEnd: "qx.event.type.Event"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** The horizontal scroll position */
      scrollX: {
        check: "qx.lang.Type.isNumber(value)&&value>=0&&value<=this.getScrollMaxX()",
        apply: "_applyScrollX",
        transform: "_transformScrollX",
        event: "scrollX",
        init: 0
      },
      /** The vertical scroll position */
      scrollY: {
        check: "qx.lang.Type.isNumber(value)&&value>=0&&value<=this.getScrollMaxY()",
        apply: "_applyScrollY",
        transform: "_transformScrollY",
        event: "scrollY",
        init: 0
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __frame__P_146_0: null,
      /*
      ---------------------------------------------------------------------------
        CONTENT MANAGEMENT
      ---------------------------------------------------------------------------
      */

      /**
       * Configures the content of the scroll pane. Replaces any existing child
       * with the newly given one.
       *
       * @param widget {qx.ui.core.Widget?null} The content widget of the pane
       */
      add(widget) {
        var old = this._getChildren()[0];
        if (old) {
          this._remove(old);
          old.removeListener("resize", this._onUpdate, this);
        }
        if (widget) {
          this._add(widget);
          widget.addListener("resize", this._onUpdate, this);
        }
      },
      /**
       * Removes the given widget from the content. The pane is empty
       * afterwards as only one child is supported by the pane.
       *
       * @param widget {qx.ui.core.Widget?null} The content widget of the pane
       */
      remove(widget) {
        if (widget) {
          this._remove(widget);
          widget.removeListener("resize", this._onUpdate, this);
        }
      },
      /**
       * Returns an array containing the current content.
       *
       * @return {Object[]} The content array
       */
      getChildren() {
        return this._getChildren();
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENER
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for resize event of content and container
       *
       * @param e {Event} Resize event object
       */
      _onUpdate(e) {
        this.fireEvent("update");
      },
      /**
       * Event listener for scroll event of content
       *
       * @param e {qx.event.type.Event} Scroll event object
       */
      _onScroll(e) {
        var contentEl = this.getContentElement();
        this.setScrollX(contentEl.getScrollX());
        this.setScrollY(contentEl.getScrollY());
      },
      /**
       * Event listener for appear event of content
       *
       * @param e {qx.event.type.Event} Appear event object
       */
      _onAppear(e) {
        var contentEl = this.getContentElement();
        var internalX = this.getScrollX();
        var domX = contentEl.getScrollX();
        if (internalX != domX) {
          contentEl.scrollToX(internalX);
        }
        var internalY = this.getScrollY();
        var domY = contentEl.getScrollY();
        if (internalY != domY) {
          contentEl.scrollToY(internalY);
        }
      },
      /*
      ---------------------------------------------------------------------------
        ITEM LOCATION SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the top offset of the given item in relation to the
       * inner height of this widget.
       *
       * @param item {qx.ui.core.Widget} Item to query
       * @return {Integer} Top offset
       */
      getItemTop(item) {
        var top = 0;
        do {
          top += item.getBounds().top;
          item = item.getLayoutParent();
        } while (item && item !== this);
        return top;
      },
      /**
       * Returns the top offset of the end of the given item in relation to the
       * inner height of this widget.
       *
       * @param item {qx.ui.core.Widget} Item to query
       * @return {Integer} Top offset
       */
      getItemBottom(item) {
        return this.getItemTop(item) + item.getBounds().height;
      },
      /**
       * Returns the left offset of the given item in relation to the
       * inner width of this widget.
       *
       * @param item {qx.ui.core.Widget} Item to query
       * @return {Integer} Top offset
       */
      getItemLeft(item) {
        var left = 0;
        var parent;
        do {
          left += item.getBounds().left;
          parent = item.getLayoutParent();
          if (parent) {
            left += parent.getInsets().left;
          }
          item = parent;
        } while (item && item !== this);
        return left;
      },
      /**
       * Returns the left offset of the end of the given item in relation to the
       * inner width of this widget.
       *
       * @param item {qx.ui.core.Widget} Item to query
       * @return {Integer} Right offset
       */
      getItemRight(item) {
        return this.getItemLeft(item) + item.getBounds().width;
      },
      /*
      ---------------------------------------------------------------------------
        DIMENSIONS
      ---------------------------------------------------------------------------
      */

      /**
       * The size (identical with the preferred size) of the content.
       *
       * @return {Map} Size of the content (keys: <code>width</code> and <code>height</code>)
       */
      getScrollSize() {
        return this.getChildren()[0].getBounds();
      },
      /*
      ---------------------------------------------------------------------------
        SCROLL SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * The maximum horizontal scroll position.
       *
       * @return {Integer} Maximum horizontal scroll position.
       */
      getScrollMaxX() {
        var paneSize = this.getInnerSize();
        var scrollSize = this.getScrollSize();
        if (paneSize && scrollSize) {
          return Math.max(0, scrollSize.width - paneSize.width);
        }
        return 0;
      },
      /**
       * The maximum vertical scroll position.
       *
       * @return {Integer} Maximum vertical scroll position.
       */
      getScrollMaxY() {
        var paneSize = this.getInnerSize();
        var scrollSize = this.getScrollSize();
        if (paneSize && scrollSize) {
          return Math.max(0, scrollSize.height - paneSize.height);
        }
        return 0;
      },
      /**
       * Scrolls the element's content to the given left coordinate
       *
       * @param value {Integer} The vertical position to scroll to.
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollToX(value, duration) {
        var max = this.getScrollMaxX();
        if (value < 0) {
          value = 0;
        } else if (value > max) {
          value = max;
        }
        this.stopScrollAnimation();
        if (duration) {
          var from = this.getScrollX();
          this.__frame__P_146_0 = new qx.bom.AnimationFrame();
          this.__frame__P_146_0.on("end", function () {
            this.setScrollX(value);
            this.__frame__P_146_0 = null;
            this.fireEvent("scrollAnimationEnd");
          }, this);
          this.__frame__P_146_0.on("frame", function (timePassed) {
            var newX = parseInt(timePassed / duration * (value - from) + from);
            this.setScrollX(newX);
          }, this);
          this.__frame__P_146_0.startSequence(duration);
        } else {
          this.setScrollX(value);
        }
      },
      /**
       * Scrolls the element's content to the given top coordinate
       *
       * @param value {Integer} The horizontal position to scroll to.
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollToY(value, duration) {
        var max = this.getScrollMaxY();
        if (value < 0) {
          value = 0;
        } else if (value > max) {
          value = max;
        }
        this.stopScrollAnimation();
        if (duration) {
          var from = this.getScrollY();
          this.__frame__P_146_0 = new qx.bom.AnimationFrame();
          this.__frame__P_146_0.on("end", function () {
            this.setScrollY(value);
            this.__frame__P_146_0 = null;
            this.fireEvent("scrollAnimationEnd");
          }, this);
          this.__frame__P_146_0.on("frame", function (timePassed) {
            var newY = parseInt(timePassed / duration * (value - from) + from);
            this.setScrollY(newY);
          }, this);
          this.__frame__P_146_0.startSequence(duration);
        } else {
          this.setScrollY(value);
        }
      },
      /**
       * Scrolls the element's content horizontally by the given amount.
       *
       * @param x {Integer?0} Amount to scroll
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollByX(x, duration) {
        this.scrollToX(this.getScrollX() + x, duration);
      },
      /**
       * Scrolls the element's content vertically by the given amount.
       *
       * @param y {Integer?0} Amount to scroll
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollByY(y, duration) {
        this.scrollToY(this.getScrollY() + y, duration);
      },
      /**
       * If an scroll animation is running, it will be stopped with that method.
       */
      stopScrollAnimation() {
        if (this.__frame__P_146_0) {
          this.__frame__P_146_0.cancelSequence();
          this.__frame__P_146_0 = null;
        }
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyScrollX(value) {
        this.getContentElement().scrollToX(value);
      },
      /**
       * Transform property
       *
       * @param value {Number} Value to transform
       * @return {Number} Rounded value
       */
      _transformScrollX(value) {
        return Math.round(value);
      },
      // property apply
      _applyScrollY(value) {
        this.getContentElement().scrollToY(value);
      },
      /**
       * Transform property
       *
       * @param value {Number} Value to transform
       * @return {Number} Rounded value
       */
      _transformScrollY(value) {
        return Math.round(value);
      }
    }
  });
  qx.ui.core.scroll.ScrollPane.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.basic.Atom": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MExecutable": {
        "require": true
      },
      "qx.ui.form.IExecutable": {
        "require": true
      },
      "qx.event.AcceleratingTimer": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The HoverButton is an {@link qx.ui.basic.Atom}, which fires repeatedly
   * execute events while the pointer is over the widget.
   *
   * The rate at which the execute event is fired accelerates is the pointer keeps
   * inside of the widget. The initial delay and the interval time can be set using
   * the properties {@link #firstInterval} and {@link #interval}. The
   * {@link #execute} events will be fired in a shorter amount of time if the pointer
   * remains over the widget, until the min {@link #minTimer} is reached.
   * The {@link #timerDecrease} property sets the amount of milliseconds which will
   * decreased after every firing.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   var button = new qx.ui.form.HoverButton("Hello World");
   *
   *   button.addListener("execute", function(e) {
   *     alert("Button is hovered");
   *   }, this);
   *
   *   this.getRoot.add(button);
   * </pre>
   *
   * This example creates a button with the label "Hello World" and attaches an
   * event listener to the {@link #execute} event.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/hoverbutton.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.form.HoverButton", {
    extend: qx.ui.basic.Atom,
    include: [qx.ui.core.MExecutable],
    implement: [qx.ui.form.IExecutable],
    /**
     * @param label {String} Label to use
     * @param icon {String?null} Icon to use
     */
    construct(label, icon) {
      qx.ui.basic.Atom.constructor.call(this, label, icon);
      this.addListener("pointerover", this._onPointerOver, this);
      this.addListener("pointerout", this._onPointerOut, this);
      this.__timer__P_184_0 = new qx.event.AcceleratingTimer();
      this.__timer__P_184_0.addListener("interval", this._onInterval, this);
    },
    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "hover-button"
      },
      /**
       * Interval used after the first run of the timer. Usually a smaller value
       * than the "firstInterval" property value to get a faster reaction.
       */
      interval: {
        check: "Integer",
        init: 80
      },
      /**
       * Interval used for the first run of the timer. Usually a greater value
       * than the "interval" property value to a little delayed reaction at the first
       * time.
       */
      firstInterval: {
        check: "Integer",
        init: 200
      },
      /** This configures the minimum value for the timer interval. */
      minTimer: {
        check: "Integer",
        init: 20
      },
      /** Decrease of the timer on each interval (for the next interval) until minTimer reached. */
      timerDecrease: {
        check: "Integer",
        init: 2
      }
    },
    members: {
      __timer__P_184_0: null,
      /**
       * Start timer on pointer over
       *
       * @param e {qx.event.type.Pointer} The pointer event
       */
      _onPointerOver(e) {
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
        this.__timer__P_184_0.set({
          interval: this.getInterval(),
          firstInterval: this.getFirstInterval(),
          minimum: this.getMinTimer(),
          decrease: this.getTimerDecrease()
        }).start();
        this.addState("hovered");
      },
      /**
       * Stop timer on pointer out
       *
       * @param e {qx.event.type.Pointer} The pointer event
       */
      _onPointerOut(e) {
        this.__timer__P_184_0.stop();
        this.removeState("hovered");
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
      },
      /**
       * Fire execute event on timer interval event
       */
      _onInterval() {
        if (this.isEnabled()) {
          this.execute();
        } else {
          this.__timer__P_184_0.stop();
        }
      }
    },
    destruct() {
      this._disposeObjects("__timer__P_184_0");
    }
  });
  qx.ui.form.HoverButton.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.util.ResourceManager": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
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
       * Fabian Jakobs (fjakobs)
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * The background class contains methods to compute and set the background image
   * of a DOM element.
   *
   * It fixes a background position issue in Firefox 2.
   */
  qx.Class.define("qx.bom.element.Background", {
    statics: {
      /** @type {Array} Internal helper to improve compile performance */
      __tmpl__P_210_0: ["background-image:url(", null, ");", "background-position:", null, ";", "background-repeat:", null, ";"],
      /** @type {Map} Empty styles when no image is given */
      __emptyStyles__P_210_1: {
        backgroundImage: null,
        backgroundPosition: null,
        backgroundRepeat: null
      },
      /**
       * Computes the background position CSS value
       *
       * @param left {Integer|String} either an integer pixel value or a CSS
       *    string value
       * @param top {Integer|String} either an integer pixel value or a CSS
       *    string value
       * @return {String} The background position CSS value
       */
      __computePosition__P_210_2(left, top) {
        // Correcting buggy Firefox background-position implementation
        // Have problems with identical values
        var engine = qx.core.Environment.get("engine.name");
        var version = qx.core.Environment.get("engine.version");
        if (engine == "gecko" && version < 1.9 && left == top && typeof left == "number") {
          top += 0.01;
        }
        if (left) {
          var leftCss = typeof left == "number" ? left + "px" : left;
        } else {
          leftCss = "0";
        }
        if (top) {
          var topCss = typeof top == "number" ? top + "px" : top;
        } else {
          topCss = "0";
        }
        return leftCss + " " + topCss;
      },
      /**
       * Compiles the background into a CSS compatible string.
       *
       * @param source {String?null} The URL of the background image
       * @param repeat {String?null} The background repeat property. valid values
       *     are <code>repeat</code>, <code>repeat-x</code>,
       *     <code>repeat-y</code>, <code>no-repeat</code>
       * @param left {Integer|String?null} The horizontal offset of the image
       *      inside of the image element. If the value is an integer it is
       *      interpreted as pixel value otherwise the value is taken as CSS value.
       *      CSS the values are "center", "left" and "right"
       * @param top {Integer|String?null} The vertical offset of the image
       *      inside of the image element. If the value is an integer it is
       *      interpreted as pixel value otherwise the value is taken as CSS value.
       *      CSS the values are "top", "bottom" and "center"
       * @return {String} CSS string
       */
      compile(source, repeat, left, top) {
        var position = this.__computePosition__P_210_2(left, top);
        var backgroundImageUrl = qx.util.ResourceManager.getInstance().toUri(source);

        // Updating template
        var tmpl = this.__tmpl__P_210_0;
        tmpl[1] = "'" + backgroundImageUrl + "'"; // Put in quotes so spaces work
        tmpl[4] = position;
        tmpl[7] = repeat;
        return tmpl.join("");
      },
      /**
       * Get standard css background styles
       *
       * @param source {String} The URL of the background image
       * @param repeat {String?null} The background repeat property. valid values
       *     are <code>repeat</code>, <code>repeat-x</code>,
       *     <code>repeat-y</code>, <code>no-repeat</code>
       * @param left {Integer|String?null} The horizontal offset of the image
       *      inside of the image element. If the value is an integer it is
       *      interpreted as pixel value otherwise the value is taken as CSS value.
       *      CSS the values are "center", "left" and "right"
       * @param top {Integer|String?null} The vertical offset of the image
       *      inside of the image element. If the value is an integer it is
       *      interpreted as pixel value otherwise the value is taken as CSS value.
       *      CSS the values are "top", "bottom" and "center"
       * @return {Map} A map of CSS styles
       */
      getStyles(source, repeat, left, top) {
        if (!source) {
          return this.__emptyStyles__P_210_1;
        }
        var position = this.__computePosition__P_210_2(left, top);
        var backgroundImageUrl = qx.util.ResourceManager.getInstance().toUri(source);
        var backgroundImageCssString = "url('" + backgroundImageUrl + "')"; // Put in quotes so spaces work
        var map = {
          backgroundPosition: position,
          backgroundImage: backgroundImageCssString
        };
        if (repeat != null) {
          map.backgroundRepeat = repeat;
        }
        return map;
      },
      /**
       * Set the background on the given DOM element
       *
       * @param element {Element} The element to modify
       * @param source {String?null} The URL of the background image
       * @param repeat {String?null} The background repeat property. valid values
       *     are <code>repeat</code>, <code>repeat-x</code>,
       *     <code>repeat-y</code>, <code>no-repeat</code>
       * @param left {Integer?null} The horizontal offset of the image inside of
       *     the image element.
       * @param top {Integer?null} The vertical offset of the image inside of
       *     the image element.
       */
      set(element, source, repeat, left, top) {
        var styles = this.getStyles(source, repeat, left, top);
        for (var prop in styles) {
          element.style[prop] = styles[prop];
        }
      }
    }
  });
  qx.bom.element.Background.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "construct": true,
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.event.Emitter": {
        "construct": true
      },
      "qx.util.Uri": {},
      "qx.bom.client.Engine": {},
      "qx.bom.client.Browser": {}
    },
    "environment": {
      "provided": ["qx.debug.io"],
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
       * Tristan Koch (tristankoch)
  
  ************************************************************************ */

  /**
   * Script loader with interface similar to
   * <a href="http://www.w3.org/TR/XMLHttpRequest/">XmlHttpRequest</a>.
   *
   * The script loader can be used to load scripts from arbitrary sources.
   * <span class="desktop">
   * For JSONP requests, consider the {@link qx.bom.request.Jsonp} transport
   * that derives from the script loader.
   * </span>
   *
   * <div class="desktop">
   * Example:
   *
   * <pre class="javascript">
   *  var req = new qx.bom.request.Script();
   *  req.onload = function() {
   *    // Script is loaded and parsed and
   *    // globals set are available
   *  }
   *
   *  req.open("GET", url);
   *  req.send();
   * </pre>
   * </div>
   *
   * @ignore(qx.core, qx.core.Environment.*)
   * @require(qx.bom.request.Script#_success)
   * @require(qx.bom.request.Script#abort)
   * @require(qx.bom.request.Script#dispose)
   * @require(qx.bom.request.Script#isDisposed)
   * @require(qx.bom.request.Script#getAllResponseHeaders)
   * @require(qx.bom.request.Script#getResponseHeader)
   * @require(qx.bom.request.Script#setDetermineSuccess)
   * @require(qx.bom.request.Script#setRequestHeader)
   *
   * @group (IO)
   */

  qx.Bootstrap.define("qx.bom.request.Script", {
    implement: [qx.core.IDisposable],
    construct() {
      this.__initXhrProperties__P_197_0();
      this.__onNativeLoadBound__P_197_1 = qx.Bootstrap.bind(this._onNativeLoad, this);
      this.__onNativeErrorBound__P_197_2 = qx.Bootstrap.bind(this._onNativeError, this);
      this.__onTimeoutBound__P_197_3 = qx.Bootstrap.bind(this._onTimeout, this);
      this.__headElement__P_197_4 = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
      this._emitter = new qx.event.Emitter();

      // BUGFIX: Browsers not supporting error handler
      // Set default timeout to capture network errors
      //
      // Note: The script is parsed and executed, before a "load" is fired.
      this.timeout = this.__supportsErrorHandler__P_197_5() ? 0 : 15000;
    },
    events: {
      /** Fired at ready state changes. */
      readystatechange: "qx.bom.request.Script",
      /** Fired on error. */
      error: "qx.bom.request.Script",
      /** Fired at loadend. */
      loadend: "qx.bom.request.Script",
      /** Fired on timeouts. */
      timeout: "qx.bom.request.Script",
      /** Fired when the request is aborted. */
      abort: "qx.bom.request.Script",
      /** Fired on successful retrieval. */
      load: "qx.bom.request.Script"
    },
    members: {
      /**
       * @type {Number} Ready state.
       *
       * States can be:
       * UNSENT:           0,
       * OPENED:           1,
       * LOADING:          2,
       * LOADING:          3,
       * DONE:             4
       *
       * Contrary to {@link qx.bom.request.Xhr#readyState}, the script transport
       * does not receive response headers. For compatibility, another LOADING
       * state is implemented that replaces the HEADERS_RECEIVED state.
       */
      readyState: null,
      /**
       * @type {Number} The status code.
       *
       * Note: The script transport cannot determine the HTTP status code.
       */
      status: null,
      /**
       * @type {String} The status text.
       *
       * The script transport does not receive response headers. For compatibility,
       * the statusText property is set to the status casted to string.
       */
      statusText: null,
      /**
       * @type {Number} Timeout limit in milliseconds.
       *
       * 0 (default) means no timeout.
       */
      timeout: null,
      /**
       * @type {Function} Function that is executed once the script was loaded.
       */
      __determineSuccess__P_197_6: null,
      /**
       * Add an event listener for the given event name.
       *
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function to execute when the event is fired
       * @param ctx {var?} The context of the listener.
       * @return {qx.bom.request.Script} Self for chaining.
       */
      on(name, listener, ctx) {
        this._emitter.on(name, listener, ctx);
        return this;
      },
      /**
       * Initializes (prepares) request.
       *
       * @param method {String}
       *   The HTTP method to use.
       *   This parameter exists for compatibility reasons. The script transport
       *   does not support methods other than GET.
       * @param url {String}
       *   The URL to which to send the request.
       */
      open(method, url) {
        if (this.__disposed__P_197_7) {
          return;
        }

        // Reset XHR properties that may have been set by previous request
        this.__initXhrProperties__P_197_0();
        this.__abort__P_197_8 = null;
        this.__url__P_197_9 = url;
        if (this.__environmentGet__P_197_10("qx.debug.io")) {
          qx.Bootstrap.debug(qx.bom.request.Script, "Open native request with url: " + url);
        }
        this._readyStateChange(1);
      },
      /**
       * Appends a query parameter to URL.
       *
       * This method exists for compatibility reasons. The script transport
       * does not support request headers. However, many services parse query
       * parameters like request headers.
       *
       * Note: The request must be initialized before using this method.
       *
       * @param key {String}
       *  The name of the header whose value is to be set.
       * @param value {String}
       *  The value to set as the body of the header.
       * @return {qx.bom.request.Script} Self for chaining.
       */
      setRequestHeader(key, value) {
        if (this.__disposed__P_197_7) {
          return null;
        }
        var param = {};
        if (this.readyState !== 1) {
          throw new Error("Invalid state");
        }
        param[key] = value;
        this.__url__P_197_9 = qx.util.Uri.appendParamsToUrl(this.__url__P_197_9, param);
        return this;
      },
      /**
       * Sends request.
       * @return {qx.bom.request.Script} Self for chaining.
       */
      send() {
        if (this.__disposed__P_197_7) {
          return null;
        }
        var script = this.__createScriptElement__P_197_11(),
          head = this.__headElement__P_197_4,
          that = this;
        if (this.timeout > 0) {
          this.__timeoutId__P_197_12 = window.setTimeout(this.__onTimeoutBound__P_197_3, this.timeout);
        }
        if (this.__environmentGet__P_197_10("qx.debug.io")) {
          qx.Bootstrap.debug(qx.bom.request.Script, "Send native request");
        }

        // Attach script to DOM
        head.insertBefore(script, head.firstChild);

        // The resource is loaded once the script is in DOM.
        // Assume HEADERS_RECEIVED and LOADING and dispatch async.
        window.setTimeout(function () {
          that._readyStateChange(2);
          that._readyStateChange(3);
        });
        return this;
      },
      /**
       * Aborts request.
       * @return {qx.bom.request.Script} Self for chaining.
       */
      abort() {
        if (this.__disposed__P_197_7) {
          return null;
        }
        this.__abort__P_197_8 = true;
        this.__disposeScriptElement__P_197_13();
        this._emit("abort");
        return this;
      },
      /**
       * Helper to emit events and call the callback methods.
       * @param event {String} The name of the event.
       */
      _emit(event) {
        this["on" + event]();
        this._emitter.emit(event, this);
      },
      /**
       * Event handler for an event that fires at every state change.
       *
       * Replace with custom method to get informed about the communication progress.
       */
      onreadystatechange() {},
      /**
       * Event handler for XHR event "load" that is fired on successful retrieval.
       *
       * Note: This handler is called even when an invalid script is returned.
       *
       * Warning: Internet Explorer < 9 receives a false "load" for invalid URLs.
       * This "load" is fired about 2 seconds after sending the request. To
       * distinguish from a real "load", consider defining a custom check
       * function using {@link #setDetermineSuccess} and query the status
       * property. However, the script loaded needs to have a known impact on
       * the global namespace. If this does not work for you, you may be able
       * to set a timeout lower than 2 seconds, depending on script size,
       * complexity and execution time.
       *
       * Replace with custom method to listen to the "load" event.
       */
      onload() {},
      /**
       * Event handler for XHR event "loadend" that is fired on retrieval.
       *
       * Note: This handler is called even when a network error (or similar)
       * occurred.
       *
       * Replace with custom method to listen to the "loadend" event.
       */
      onloadend() {},
      /**
       * Event handler for XHR event "error" that is fired on a network error.
       *
       * Note: Some browsers do not support the "error" event.
       *
       * Replace with custom method to listen to the "error" event.
       */
      onerror() {},
      /**
       * Event handler for XHR event "abort" that is fired when request
       * is aborted.
       *
       * Replace with custom method to listen to the "abort" event.
       */
      onabort() {},
      /**
       * Event handler for XHR event "timeout" that is fired when timeout
       * interval has passed.
       *
       * Replace with custom method to listen to the "timeout" event.
       */
      ontimeout() {},
      /**
       * Get a single response header from response.
       *
       * Note: This method exists for compatibility reasons. The script
       * transport does not receive response headers.
       *
       * @param key {String}
       *  Key of the header to get the value from.
       * @return {String|null} Warning message or <code>null</code> if the request
       * is disposed
       */
      getResponseHeader(key) {
        if (this.__disposed__P_197_7) {
          return null;
        }
        if (this.__environmentGet__P_197_10("qx.debug")) {
          qx.Bootstrap.debug("Response header cannot be determined for requests made with script transport.");
        }
        return "unknown";
      },
      /**
       * Get all response headers from response.
       *
       * Note: This method exists for compatibility reasons. The script
       * transport does not receive response headers.
       * @return {String|null} Warning message or <code>null</code> if the request
       * is disposed
       */
      getAllResponseHeaders() {
        if (this.__disposed__P_197_7) {
          return null;
        }
        if (this.__environmentGet__P_197_10("qx.debug")) {
          qx.Bootstrap.debug("Response headers cannot be determined forrequests made with script transport.");
        }
        return "Unknown response headers";
      },
      /**
       * Determine if loaded script has expected impact on global namespace.
       *
       * The function is called once the script was loaded and must return a
       * boolean indicating if the response is to be considered successful.
       *
       * @param check {Function} Function executed once the script was loaded.
       *
       */
      setDetermineSuccess(check) {
        this.__determineSuccess__P_197_6 = check;
      },
      /**
       * Dispose object.
       */
      dispose() {
        var script = this.__scriptElement__P_197_14;
        if (!this.__disposed__P_197_7) {
          // Prevent memory leaks
          if (script) {
            script.onload = script.onreadystatechange = null;
            this.__disposeScriptElement__P_197_13();
          }
          if (this.__timeoutId__P_197_12) {
            window.clearTimeout(this.__timeoutId__P_197_12);
          }
          this.__disposed__P_197_7 = true;
        }
      },
      /**
       * Check if the request has already beed disposed.
       * @return {Boolean} <code>true</code>, if the request has been disposed.
       */
      isDisposed() {
        return !!this.__disposed__P_197_7;
      },
      /*
      ---------------------------------------------------------------------------
        PROTECTED
      ---------------------------------------------------------------------------
      */

      /**
       * Get URL of request.
       *
       * @return {String} URL of request.
       */
      _getUrl() {
        return this.__url__P_197_9;
      },
      /**
       * Get script element used for request.
       *
       * @return {Element} Script element.
       */
      _getScriptElement() {
        return this.__scriptElement__P_197_14;
      },
      /**
       * Handle timeout.
       */
      _onTimeout() {
        this.__failure__P_197_15();
        if (!this.__supportsErrorHandler__P_197_5()) {
          this._emit("error");
        }
        this._emit("timeout");
        if (!this.__supportsErrorHandler__P_197_5()) {
          this._emit("loadend");
        }
      },
      /**
       * Handle native load.
       */
      _onNativeLoad() {
        var script = this.__scriptElement__P_197_14,
          determineSuccess = this.__determineSuccess__P_197_6,
          that = this;

        // Aborted request must not fire load
        if (this.__abort__P_197_8) {
          return;
        }

        // BUGFIX: IE < 9
        // When handling "readystatechange" event, skip if readyState
        // does not signal loaded script
        if (this.__environmentGet__P_197_10("engine.name") === "mshtml" && this.__environmentGet__P_197_10("browser.documentmode") < 9) {
          if (!/loaded|complete/.test(script.readyState)) {
            return;
          } else {
            if (this.__environmentGet__P_197_10("qx.debug.io")) {
              qx.Bootstrap.debug(qx.bom.request.Script, "Received native readyState: loaded");
            }
          }
        }
        if (this.__environmentGet__P_197_10("qx.debug.io")) {
          qx.Bootstrap.debug(qx.bom.request.Script, "Received native load");
        }

        // Determine status by calling user-provided check function
        if (determineSuccess) {
          // Status set before has higher precedence
          if (!this.status) {
            this.status = determineSuccess() ? 200 : 500;
          }
        }
        if (this.status === 500) {
          if (this.__environmentGet__P_197_10("qx.debug.io")) {
            qx.Bootstrap.debug(qx.bom.request.Script, "Detected error");
          }
        }
        if (this.__timeoutId__P_197_12) {
          window.clearTimeout(this.__timeoutId__P_197_12);
        }
        window.setTimeout(function () {
          that._success();
          that._readyStateChange(4);
          that._emit("load");
          that._emit("loadend");
        });
      },
      /**
       * Handle native error.
       */
      _onNativeError() {
        this.__failure__P_197_15();
        this._emit("error");
        this._emit("loadend");
      },
      /*
      ---------------------------------------------------------------------------
        PRIVATE
      ---------------------------------------------------------------------------
      */

      /**
       * @type {Element} Script element
       */
      __scriptElement__P_197_14: null,
      /**
       * @type {Element} Head element
       */
      __headElement__P_197_4: null,
      /**
       * @type {String} URL
       */
      __url__P_197_9: "",
      /**
       * @type {Function} Bound _onNativeLoad handler.
       */
      __onNativeLoadBound__P_197_1: null,
      /**
       * @type {Function} Bound _onNativeError handler.
       */
      __onNativeErrorBound__P_197_2: null,
      /**
       * @type {Function} Bound _onTimeout handler.
       */
      __onTimeoutBound__P_197_3: null,
      /**
       * @type {Number} Timeout timer iD.
       */
      __timeoutId__P_197_12: null,
      /**
       * @type {Boolean} Whether request was aborted.
       */
      __abort__P_197_8: null,
      /**
       * @type {Boolean} Whether request was disposed.
       */
      __disposed__P_197_7: null,
      /*
      ---------------------------------------------------------------------------
        HELPER
      ---------------------------------------------------------------------------
      */

      /**
       * Initialize properties.
       */
      __initXhrProperties__P_197_0() {
        this.readyState = 0;
        this.status = 0;
        this.statusText = "";
      },
      /**
       * Change readyState.
       *
       * @param readyState {Number} The desired readyState
       */
      _readyStateChange(readyState) {
        this.readyState = readyState;
        this._emit("readystatechange");
      },
      /**
       * Handle success.
       */
      _success() {
        this.__disposeScriptElement__P_197_13();
        this.readyState = 4;

        // By default, load is considered successful
        if (!this.status) {
          this.status = 200;
        }
        this.statusText = "" + this.status;
      },
      /**
       * Handle failure.
       */
      __failure__P_197_15() {
        this.__disposeScriptElement__P_197_13();
        this.readyState = 4;
        this.status = 0;
        this.statusText = null;
      },
      /**
       * Looks up whether browser supports error handler.
       *
       * @return {Boolean} Whether browser supports error handler.
       */
      __supportsErrorHandler__P_197_5() {
        var isLegacyIe = this.__environmentGet__P_197_10("engine.name") === "mshtml" && this.__environmentGet__P_197_10("browser.documentmode") < 9;
        var isOpera = this.__environmentGet__P_197_10("engine.name") === "opera";
        return !(isLegacyIe || isOpera);
      },
      /**
       * Create and configure script element.
       *
       * @return {Element} Configured script element.
       */
      __createScriptElement__P_197_11() {
        var script = this.__scriptElement__P_197_14 = document.createElement("script");
        script.src = this.__url__P_197_9;
        script.onerror = this.__onNativeErrorBound__P_197_2;
        script.onload = this.__onNativeLoadBound__P_197_1;

        // BUGFIX: IE < 9
        // Legacy IEs do not fire the "load" event for script elements.
        // Instead, they support the "readystatechange" event
        if (this.__environmentGet__P_197_10("engine.name") === "mshtml" && this.__environmentGet__P_197_10("browser.documentmode") < 9) {
          script.onreadystatechange = this.__onNativeLoadBound__P_197_1;
        }
        return script;
      },
      /**
       * Remove script element from DOM.
       */
      __disposeScriptElement__P_197_13() {
        var script = this.__scriptElement__P_197_14;
        if (script && script.parentNode) {
          this.__headElement__P_197_4.removeChild(script);
        }
      },
      /**
       * Proxy Environment.get to guard against env not being present yet.
       *
       * @param key {String} Environment key.
       * @return {var} Value of the queried environment key
       * @lint environmentNonLiteralKey(key)
       */
      __environmentGet__P_197_10(key) {
        if (qx && qx.core && qx.core.Environment) {
          return qx.core.Environment.get(key);
        } else {
          if (key === "engine.name") {
            return qx.bom.client.Engine.getName();
          }
          if (key === "browser.documentmode") {
            return qx.bom.client.Browser.getDocumentMode();
          }
          if (key == "qx.debug.io") {
            return false;
          }
          throw new Error("Unknown environment key at this phase");
        }
      }
    },
    defer() {
      if (qx && qx.core && qx.core.Environment) {
        qx.core.Environment.add("qx.debug.io", false);
      }
    }
  });
  qx.bom.request.Script.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.event.Registration": {},
      "qx.event.util.Keyboard": {},
      "qx.lang.String": {},
      "qx.locale.Key": {}
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
   * Shortcuts can be used to globally define keyboard shortcuts.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.bom.Shortcut", {
    extend: qx.core.Object,
    implement: [qx.core.IDisposable],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Create a new instance of Command
     *
     * @param shortcut {String} shortcuts can be composed of optional modifier
     *    keys Control, Alt, Shift, Meta and a non modifier key.
     *    If no non modifier key is specified, the second parameter is evaluated.
     *    The key must be separated by a <code>+</code> or <code>-</code> character.
     *    Examples: Alt+F1, Control+C, Control+Alt+Delete
     */
    construct(shortcut) {
      qx.core.Object.constructor.call(this);
      this.__modifier__P_215_0 = {};
      this.__key__P_215_1 = null;
      if (shortcut != null) {
        this.setShortcut(shortcut);
      }
      this.initEnabled();
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired when the command is executed. Sets the "data" property of the event to
       * the object that issued the command.
       */
      execute: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** whether the command should be respected/enabled */
      enabled: {
        init: true,
        check: "Boolean",
        event: "changeEnabled",
        apply: "_applyEnabled"
      },
      /** The command shortcut */
      shortcut: {
        check: "String",
        apply: "_applyShortcut",
        nullable: true
      },
      /**
       * Whether the execute event should be fired repeatedly if the user keep
       * the keys pressed.
       */
      autoRepeat: {
        check: "Boolean",
        init: false
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      __modifier__P_215_0: "",
      __key__P_215_1: "",
      /*
      ---------------------------------------------------------------------------
        USER METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Fire the "execute" event on this shortcut.
       *
       * @param target {Object} Object which issued the execute event
       */
      execute(target) {
        this.fireDataEvent("execute", target);
      },
      /**
       * Key down event handler.
       *
       * @param event {qx.event.type.KeySequence} The key event object
       */
      __onKeyDown__P_215_2(event) {
        if (this.getEnabled() && this.__matchesKeyEvent__P_215_3(event)) {
          if (!this.isAutoRepeat()) {
            this.execute(event.getTarget());
          }
          event.stop();
        }
      },
      /**
       * Key press event handler.
       *
       * @param event {qx.event.type.KeySequence} The key event object
       */
      __onKeyPress__P_215_4(event) {
        if (this.getEnabled() && this.__matchesKeyEvent__P_215_3(event)) {
          if (this.isAutoRepeat()) {
            this.execute(event.getTarget());
          }
          event.stop();
        }
      },
      /*
      ---------------------------------------------------------------------------
        APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyEnabled(value, old) {
        if (value) {
          qx.event.Registration.addListener(document.documentElement, "keydown", this.__onKeyDown__P_215_2, this);
          qx.event.Registration.addListener(document.documentElement, "keypress", this.__onKeyPress__P_215_4, this);
        } else {
          qx.event.Registration.removeListener(document.documentElement, "keydown", this.__onKeyDown__P_215_2, this);
          qx.event.Registration.removeListener(document.documentElement, "keypress", this.__onKeyPress__P_215_4, this);
        }
      },
      // property apply
      _applyShortcut(value, old) {
        if (value) {
          // do not allow whitespaces within shortcuts
          if (value.search(/[\s]+/) != -1) {
            var msg = "Whitespaces are not allowed within shortcuts";
            this.error(msg);
            throw new Error(msg);
          }
          this.__modifier__P_215_0 = {
            Control: false,
            Shift: false,
            Meta: false,
            Alt: false
          };
          this.__key__P_215_1 = null;

          // To support shortcuts with "+" and "-" as keys it is necessary
          // to split the given value in a different way to determine the
          // several keyIdentifiers
          var index;
          var a = [];
          while (value.length > 0 && index != -1) {
            // search for delimiters "+" and "-"
            index = value.search(/[-+]+/);

            // add identifiers - take value if no separator was found or
            // only one char is left (second part of shortcut)
            a.push(value.length == 1 || index == -1 ? value : value.substring(0, index));

            // extract the already detected identifier
            value = value.substring(index + 1);
          }
          var al = a.length;
          for (var i = 0; i < al; i++) {
            var identifier = this.__normalizeKeyIdentifier__P_215_5(a[i]);
            switch (identifier) {
              case "Control":
              case "Shift":
              case "Meta":
              case "Alt":
                this.__modifier__P_215_0[identifier] = true;
                break;
              case "Unidentified":
                var msg = "Not a valid key name for a shortcut: " + a[i];
                this.error(msg);
                throw msg;
              default:
                if (this.__key__P_215_1) {
                  var msg = "You can only specify one non modifier key!";
                  this.error(msg);
                  throw msg;
                }
                this.__key__P_215_1 = identifier;
            }
          }
        }
        return true;
      },
      /*
      --------------------------------------------------------------------------
        INTERNAL MATCHING LOGIC
      ---------------------------------------------------------------------------
      */

      /**
       * Checks whether the given key event matches the shortcut's shortcut
       *
       * @param e {qx.event.type.KeySequence} the key event object
       * @return {Boolean} whether the shortcuts shortcut matches the key event
       */
      __matchesKeyEvent__P_215_3(e) {
        var key = this.__key__P_215_1;
        if (!key) {
          // no shortcut defined.
          return false;
        }

        // for check special keys
        // and check if a shortcut is a single char and special keys are pressed
        if (!this.__modifier__P_215_0.Shift && e.isShiftPressed() || this.__modifier__P_215_0.Shift && !e.isShiftPressed() || !this.__modifier__P_215_0.Control && e.isCtrlPressed() || this.__modifier__P_215_0.Control && !e.isCtrlPressed() || !this.__modifier__P_215_0.Meta && e.isMetaPressed() || this.__modifier__P_215_0.Meta && !e.isMetaPressed() || !this.__modifier__P_215_0.Alt && e.isAltPressed() || this.__modifier__P_215_0.Alt && !e.isAltPressed()) {
          return false;
        }
        if (key == e.getKeyIdentifier()) {
          return true;
        }
        return false;
      },
      /*
      ---------------------------------------------------------------------------
        COMPATIBILITY TO COMMAND
      ---------------------------------------------------------------------------
      */

      /**
       * @lint ignoreReferenceField(__oldKeyNameToKeyIdentifierMap)
       */
      __oldKeyNameToKeyIdentifierMap__P_215_6: {
        // all other keys are converted by converting the first letter to uppercase
        esc: "Escape",
        ctrl: "Control",
        print: "PrintScreen",
        del: "Delete",
        pageup: "PageUp",
        pagedown: "PageDown",
        numlock: "NumLock",
        numpad_0: "0",
        numpad_1: "1",
        numpad_2: "2",
        numpad_3: "3",
        numpad_4: "4",
        numpad_5: "5",
        numpad_6: "6",
        numpad_7: "7",
        numpad_8: "8",
        numpad_9: "9",
        numpad_divide: "/",
        numpad_multiply: "*",
        numpad_minus: "-",
        numpad_plus: "+"
      },
      /**
       * Checks and normalizes the key identifier.
       *
       * @param keyName {String} name of the key.
       * @return {String} normalized keyIdentifier or "Unidentified" if a conversion was not possible
       */
      __normalizeKeyIdentifier__P_215_5(keyName) {
        var kbUtil = qx.event.util.Keyboard;
        var keyIdentifier = "Unidentified";
        if (kbUtil.isValidKeyIdentifier(keyName)) {
          return keyName;
        }
        if (keyName.length == 1 && keyName >= "a" && keyName <= "z") {
          return keyName.toUpperCase();
        }
        keyName = keyName.toLowerCase();
        var keyIdentifier = this.__oldKeyNameToKeyIdentifierMap__P_215_6[keyName] || qx.lang.String.firstUp(keyName);
        if (kbUtil.isValidKeyIdentifier(keyIdentifier)) {
          return keyIdentifier;
        } else {
          return "Unidentified";
        }
      },
      /*
      ---------------------------------------------------------------------------
        STRING CONVERSION
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the shortcut as string using the currently selected locale.
       *
       * @return {String} shortcut
       */
      toString() {
        var key = this.__key__P_215_1;
        var str = [];
        for (var modifier in this.__modifier__P_215_0) {
          // this.__modifier holds a map with shortcut combination keys
          // like "Control", "Alt", "Meta" and "Shift" as keys with
          // Boolean values
          if (this.__modifier__P_215_0[modifier]) {
            str.push(qx.locale.Key.getKeyName("short", modifier));
          }
        }
        if (key) {
          str.push(qx.locale.Key.getKeyName("short", key));
        }
        return str.join("+");
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      // this will remove the event listener
      this.setEnabled(false);
      this.__modifier__P_215_0 = this.__key__P_215_1 = null;
    }
  });
  qx.bom.Shortcut.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.Composite": {
        "construct": true,
        "require": true
      },
      "qx.ui.tabview.TabButton": {}
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
       * Martin Wittemann (martinwittemann)
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * A page is the way to add content to a {@link TabView}. Each page gets a
   * button to switch to the page. Only one page is visible at a time.
   *
   * @childControl button {qx.ui.tabview.TabButton} tab button connected to the page
   */
  qx.Class.define("qx.ui.tabview.Page", {
    extend: qx.ui.container.Composite,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param label {String} Initial label of the tab
     * @param icon {String} Initial icon of the tab
     */
    construct(label, icon) {
      qx.ui.container.Composite.constructor.call(this);
      this._createChildControl("button");

      // init
      if (label != null) {
        this.setLabel(label);
      }
      if (icon != null) {
        this.setIcon(icon);
      }

      // ARIA attrs
      const btn = this.getButton();
      const pageId = "page-" + this.toHashCode();
      const btnId = "btn-" + pageId + btn.toHashCode();
      const contentEl = this.getContentElement();
      contentEl.setAttribute("id", pageId);
      contentEl.setAttribute("role", "tabpanel");
      contentEl.setAttribute("aria-labelledBy", btnId);
      contentEl.setAttribute("aria-expanded", false);
      const btnContentEl = btn.getContentElement();
      btnContentEl.setAttribute("id", btnId);
      btnContentEl.setAttribute("role", "tab");
      btnContentEl.setAttribute("aria-selected", false);
      btnContentEl.setAttribute("aria-controls", pageId);
      btn.addListener("changeValue", this._onBtnChangeValue, this);
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired by {@link qx.ui.tabview.TabButton} if the close button is tapped.
       */
      close: "qx.event.type.Event"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "tabview-page"
      },
      /** The label/caption/text of the Page's button. */
      label: {
        check: "String",
        init: "",
        apply: "_applyLabel"
      },
      /** Any URI String supported by qx.ui.basic.Image to display an icon in Page's button. */
      icon: {
        check: "String",
        init: "",
        apply: "_applyIcon",
        nullable: true
      },
      /** Indicates if the close button of a TabButton should be shown. */
      showCloseButton: {
        check: "Boolean",
        init: false,
        apply: "_applyShowCloseButton"
      },
      /** Allows the tab to be excluded from the display */
      tabVisibility: {
        init: "visible",
        check: ["visible", "excluded"],
        nullable: false,
        apply: "_applyTabVisibility",
        event: "changeTabVisibility"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */

    members: {
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        barTop: 1,
        barRight: 1,
        barBottom: 1,
        barLeft: 1,
        firstTab: 1,
        lastTab: 1
      },
      /*
      ---------------------------------------------------------------------------
        APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyIcon(value, old) {
        var btn = this.getChildControl("button");
        if (value) {
          btn.setIcon(value);
          btn._showChildControl("icon");
        } else {
          btn._excludeChildControl("icon");
        }
      },
      // property apply
      _applyLabel(value, old) {
        this.getChildControl("button").setLabel(value);
      },
      // overridden
      _applyEnabled(value, old) {
        qx.ui.tabview.Page.superclass.prototype._applyEnabled.call(this, value, old);

        // delegate to non-child widget button
        // since enabled is inheritable value may be null
        var btn = this.getChildControl("button");
        value == null ? btn.resetEnabled() : btn.setEnabled(value);
      },
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "button":
            control = new qx.ui.tabview.TabButton();
            control.setAllowGrowX(true);
            control.setAllowGrowY(true);
            control.setUserData("page", this);
            control.addListener("close", this._onButtonClose, this);
            control.setVisibility(this.getTabVisibility());
            break;
        }
        return control || qx.ui.tabview.Page.superclass.prototype._createChildControlImpl.call(this, id);
      },
      /**
       * Tab Change Listener
       * @param {*} e
       */
      _onBtnChangeValue(e) {
        const val = e.getData();
        this.getContentElement().setAttribute("aria-expanded", val, true); // Set third argument to true -> direct Update
        this.getButton().getContentElement().setAttribute("aria-selected", val);
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyShowCloseButton(value, old) {
        this.getChildControl("button").setShowCloseButton(value);
      },
      // property apply
      _applyTabVisibility(newValue, oldValue) {
        this.getButton().setVisibility(newValue);
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Fires an "close" event when the close button of the TabButton of the page
       * is tapped.
       */
      _onButtonClose() {
        this.fireEvent("close");
      },
      /*
      ---------------------------------------------------------------------------
        PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * By default, widgets are added to `this`
       *
       * @return {qx.ui.core.Widget} the widget to add to
       */
      getChildrenContainer() {
        return this;
      },
      /**
       * Returns the button used within this page. This method is used by
       * the TabView to access the button.
       *
       * @return {qx.ui.form.RadioButton} The button associated with this page.
       */
      getButton() {
        return this.getChildControl("button");
      }
    }
  });
  qx.ui.tabview.Page.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.MChildrenHandling": {
        "require": true
      },
      "qx.ui.layout.HBox": {
        "construct": true
      },
      "qx.ui.menu.Menu": {},
      "qx.util.PropertyUtil": {},
      "qx.ui.core.Spacer": {},
      "qx.ui.toolbar.Separator": {},
      "qx.ui.menubar.Button": {},
      "qx.ui.toolbar.Part": {}
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
       * Martin Wittemann (martinwittemann)
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * The Toolbar class is the main part of the toolbar widget.
   *
   * It can handle added {@link Button}s, {@link CheckBox}es, {@link RadioButton}s
   * and {@link Separator}s in its {@link #add} method. The {@link #addSpacer} method
   * adds a spacer at the current toolbar position. This means that the widgets
   * added after the method call of {@link #addSpacer} are aligned to the right of
   * the toolbar.
   *
   * For more details on the documentation of the toolbar widget, take a look at the
   * documentation of the {@link qx.ui.toolbar}-Package.
   */
  qx.Class.define("qx.ui.toolbar.ToolBar", {
    extend: qx.ui.core.Widget,
    include: qx.ui.core.MChildrenHandling,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Constructor
     * @param {qx.ui.layout.Abstract?} layout optional layout, defaults to qx.ui.layout.HBox
     */
    construct(layout) {
      qx.ui.core.Widget.constructor.call(this);

      // ARIA attrs
      this.getContentElement().setAttribute("role", "toolbar");

      // add needed layout
      this._setLayout(layout || new qx.ui.layout.HBox());

      // initialize the overflow handling
      this.__removedItems__P_211_0 = [];
      this.__removePriority__P_211_1 = [];
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** Appearance of the widget */
      appearance: {
        refine: true,
        init: "toolbar"
      },
      /** Holds the currently open menu (when the toolbar is used for menus) */
      openMenu: {
        check: "qx.ui.menu.Menu",
        event: "changeOpenMenu",
        nullable: true
      },
      /** Whether icons, labels, both or none should be shown. */
      show: {
        init: "both",
        check: ["both", "label", "icon"],
        inheritable: true,
        apply: "_applyShow",
        event: "changeShow"
      },
      /** The spacing between every child of the toolbar */
      spacing: {
        nullable: true,
        check: "Integer",
        themeable: true,
        apply: "_applySpacing"
      },
      /**
       * Widget which will be shown if at least one toolbar item is hidden.
       * Keep in mind to add this widget to the toolbar before you set it as
       * indicator!
       */
      overflowIndicator: {
        check: "qx.ui.core.Widget",
        nullable: true,
        apply: "_applyOverflowIndicator"
      },
      /** Enables the overflow handling which automatically removes items.*/
      overflowHandling: {
        init: false,
        check: "Boolean",
        apply: "_applyOverflowHandling"
      }
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired if an item will be hidden by the {@link #overflowHandling}.*/
      hideItem: "qx.event.type.Data",
      /** Fired if an item will be shown by the {@link #overflowHandling}.*/
      showItem: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        OVERFLOW HANDLING
      ---------------------------------------------------------------------------
      */

      __removedItems__P_211_0: null,
      __removePriority__P_211_1: null,
      // overridden
      _computeSizeHint() {
        // get the original hint
        var hint = qx.ui.toolbar.ToolBar.superclass.prototype._computeSizeHint.call(this);
        if (true && this.getOverflowHandling()) {
          var minWidth = 0;
          // if an overflow widget is given, use its width + spacing as min width
          var overflowWidget = this.getOverflowIndicator();
          if (overflowWidget) {
            minWidth = overflowWidget.getSizeHint().width + this.getSpacing();
          }
          // reset the minWidth because we reduce the count of elements
          hint.minWidth = minWidth;
        }
        return hint;
      },
      /**
       * Resize event handler.
       *
       * @param e {qx.event.type.Data} The resize event.
       */
      _onResize(e) {
        this._recalculateOverflow(e.getData().width);
      },
      /**
       * Responsible for calculation the overflow based on the available width.
       *
       * @param width {Integer?null} The available width.
       * @param requiredWidth {Integer?null} The required width for the widget
       *   if available.
       */
      _recalculateOverflow(width, requiredWidth) {
        // do nothing if overflow handling is not enabled
        if (!this.getOverflowHandling()) {
          return;
        }

        // get all required sizes
        requiredWidth = requiredWidth || this.getSizeHint().width;
        var overflowWidget = this.getOverflowIndicator();
        var overflowWidgetWidth = 0;
        if (overflowWidget) {
          overflowWidgetWidth = overflowWidget.getSizeHint().width;
        }
        if (width == undefined && this.getBounds() != null) {
          width = this.getBounds().width;
        }

        // if we still don't have a width, than we are not added to a parent
        if (width == undefined) {
          // we should ignore it in that case
          return;
        }

        // if we have not enough space
        if (width < requiredWidth) {
          do {
            // get the next child
            var childToHide = this._getNextToHide();
            // if there is no child to hide, just do nothing
            if (!childToHide) {
              return;
            }
            // get margins or spacing
            var margins = childToHide.getMarginLeft() + childToHide.getMarginRight();
            margins = Math.max(margins, this.getSpacing());
            var childWidth = childToHide.getSizeHint().width + margins;
            this.__hideChild__P_211_2(childToHide);

            // new width is the requiredWidth - the removed childs width
            requiredWidth -= childWidth;

            // show the overflowWidgetWidth
            if (overflowWidget && overflowWidget.getVisibility() != "visible") {
              overflowWidget.setVisibility("visible");
              // if we need to add the overflow indicator, we need to add its width
              requiredWidth += overflowWidgetWidth;
              // add spacing or margins
              var overflowWidgetMargins = overflowWidget.getMarginLeft() + overflowWidget.getMarginRight();
              requiredWidth += Math.max(overflowWidgetMargins, this.getSpacing());
            }
          } while (requiredWidth > width);

          // if we can possibly show something
        } else if (this.__removedItems__P_211_0.length > 0) {
          do {
            var removedChild = this.__removedItems__P_211_0[0];
            // if we have something we can show
            if (removedChild) {
              // get the margins or spacing
              var margins = removedChild.getMarginLeft() + removedChild.getMarginRight();
              margins = Math.max(margins, this.getSpacing());

              // check if the element has been rendered before [BUG #4542]
              if (removedChild.getContentElement().getDomElement() == null) {
                // if not, apply the decorator element because it can change the
                // width of the child with padding e.g.
                removedChild.syncAppearance();
                // also invalidate the layout cache to trigger size hint
                // recalculation
                removedChild.invalidateLayoutCache();
              }
              var removedChildWidth = removedChild.getSizeHint().width;

              // check if it fits in in case its the last child to replace
              var fits = false;
              // if we can remove the overflow widget if its available

              if (this.__removedItems__P_211_0.length == 1 && overflowWidgetWidth > 0) {
                var addedMargin = margins - this.getSpacing();
                var wouldRequiredWidth = requiredWidth - overflowWidgetWidth + removedChildWidth + addedMargin;
                fits = width > wouldRequiredWidth;
              }

              // if it just fits in || it fits in when we remove the overflow widget
              if (width > requiredWidth + removedChildWidth + margins || fits) {
                this.__showChild__P_211_3(removedChild);
                requiredWidth += removedChildWidth;
                // check if we need to remove the overflow widget
                if (overflowWidget && this.__removedItems__P_211_0.length == 0) {
                  overflowWidget.setVisibility("excluded");
                }
              } else {
                return;
              }
            }
          } while (width >= requiredWidth && this.__removedItems__P_211_0.length > 0);
        }
      },
      /**
       * Helper to show a toolbar item.
       *
       * @param child {qx.ui.core.Widget} The widget to show.
       */
      __showChild__P_211_3(child) {
        child.setVisibility("visible");
        this.__removedItems__P_211_0.shift();
        this.fireDataEvent("showItem", child);
      },
      /**
       * Helper to exclude a toolbar item.
       *
       * @param child {qx.ui.core.Widget} The widget to exclude.
       */
      __hideChild__P_211_2(child) {
        // ignore the call if no child is given
        if (!child) {
          return;
        }
        this.__removedItems__P_211_0.unshift(child);
        child.setVisibility("excluded");
        this.fireDataEvent("hideItem", child);
      },
      /**
       * Responsible for returning the next item to remove. In It checks the
       * priorities added by {@link #setRemovePriority}. If all priorized widgets
       * already excluded, it takes the widget added at last.
       *
       * @return {qx.ui.core.Widget|null} The widget which should be removed next.
       *   If null is returned, no widget is available to remove.
       */
      _getNextToHide() {
        // get the elements by priority
        for (var i = this.__removePriority__P_211_1.length - 1; i >= 0; i--) {
          var item = this.__removePriority__P_211_1[i];
          // maybe a priority is left out and spacers don't have the visibility
          if (item && item.getVisibility && item.getVisibility() == "visible") {
            return item;
          }
        }

        // if there is non found by priority, check all available widgets
        var children = this._getChildren();
        for (var i = children.length - 1; i >= 0; i--) {
          var child = children[i];
          // ignore the overflow widget
          if (child == this.getOverflowIndicator()) {
            continue;
          }
          // spacer don't have the visibility
          if (child.getVisibility && child.getVisibility() == "visible") {
            return child;
          }
        }
      },
      /**
       * The removal of the toolbar items is priority based. You can change these
       * priorities with this method. The higher a priority, the earlier it will
       * be excluded. Remember to use every priority only once! If you want
       * override an already set priority, use the override parameter.
       * Keep in mind to only use already added items.
       *
       * @param item {qx.ui.core.Widget} The item to give the priority.
       * @param priority {Integer} The priority, higher means removed earlier.
       * @param override {Boolean} true, if the priority should be overridden.
       */
      setRemovePriority(item, priority, override) {
        // security check for overriding priorities
        if (!override && this.__removePriority__P_211_1[priority] != undefined) {
          throw new Error("Priority already in use!");
        }
        this.__removePriority__P_211_1[priority] = item;
      },
      // property apply
      _applyOverflowHandling(value, old) {
        // invalidate the own and the parents layout cache because the size hint changes
        this.invalidateLayoutCache();
        var parent = this.getLayoutParent();
        if (parent) {
          parent.invalidateLayoutCache();
        }

        // recalculate if possible
        var bounds = this.getBounds();
        if (bounds && bounds.width) {
          this._recalculateOverflow(bounds.width);
        }

        // if the handling has been enabled
        if (value) {
          // add the resize listener
          this.addListener("resize", this._onResize, this);

          // if the handles has been disabled
        } else {
          this.removeListener("resize", this._onResize, this);

          // set the overflow indicator to excluded
          var overflowIndicator = this.getOverflowIndicator();
          if (overflowIndicator) {
            overflowIndicator.setVisibility("excluded");
          }

          // set all buttons back to visible
          for (var i = 0; i < this.__removedItems__P_211_0.length; i++) {
            this.__removedItems__P_211_0[i].setVisibility("visible");
          }
          // reset the removed items
          this.__removedItems__P_211_0 = [];
        }
      },
      // property apply
      _applyOverflowIndicator(value, old) {
        if (old) {
          this._remove(old);
        }
        if (value) {
          // check if its a child of the toolbar
          if (this._indexOf(value) == -1) {
            throw new Error("Widget must be child of the toolbar.");
          }
          // hide the widget
          value.setVisibility("excluded");
        }
      },
      /*
      ---------------------------------------------------------------------------
        MENU OPEN
      ---------------------------------------------------------------------------
      */

      __allowMenuOpenHover__P_211_4: false,
      /**
       * Indicate if a menu could be opened on hover or not.
       *
       * @internal
       * @param value {Boolean} <code>true</code> if a menu could be opened,
       *    <code>false</code> otherwise.
       */
      _setAllowMenuOpenHover(value) {
        this.__allowMenuOpenHover__P_211_4 = value;
      },
      /**
       * Return if a menu could be opened on hover or not.
       *
       * @internal
       * @return {Boolean} <code>true</code> if a menu could be opened,
       *    <code>false</code> otherwise.
       */
      _isAllowMenuOpenHover() {
        return this.__allowMenuOpenHover__P_211_4;
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applySpacing(value, old) {
        var layout = this._getLayout();
        value == null ? layout.resetSpacing() : layout.setSpacing(value);
      },
      // property apply
      _applyShow(value) {
        var children = this._getChildren();
        for (var i = 0; i < children.length; i++) {
          if (children[i].setShow) {
            children[i].setShow(value);
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        CHILD HANDLING
      ---------------------------------------------------------------------------
      */
      // overridden
      _add(child, options) {
        qx.ui.toolbar.ToolBar.superclass.prototype._add.call(this, child, options);
        // sync the show property (bug #6743) - but only if show wasn't explicitly set for the child (bug #6823)
        if (child.setShow && !qx.util.PropertyUtil.getUserValue(child, "show")) {
          child.setShow(this.getShow());
        }
        var newWidth = this.getSizeHint().width + child.getSizeHint().width + 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _addAt(child, index, options) {
        qx.ui.toolbar.ToolBar.superclass.prototype._addAt.call(this, child, index, options);
        // sync the show property (bug #6743) - but only if show wasn't explicitly set for the child (bug #6823)
        if (child.setShow && !qx.util.PropertyUtil.getUserValue(child, "show")) {
          child.setShow(this.getShow());
        }
        var newWidth = this.getSizeHint().width + child.getSizeHint().width + 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _addBefore(child, before, options) {
        qx.ui.toolbar.ToolBar.superclass.prototype._addBefore.call(this, child, before, options);
        // sync the show property (bug #6743) - but only if show wasn't explicitly set for the child (bug #6823)
        if (child.setShow && !qx.util.PropertyUtil.getUserValue(child, "show")) {
          child.setShow(this.getShow());
        }
        var newWidth = this.getSizeHint().width + child.getSizeHint().width + 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _addAfter(child, after, options) {
        qx.ui.toolbar.ToolBar.superclass.prototype._addAfter.call(this, child, after, options);
        // sync the show property (bug #6743) - but only if show wasn't explicitly set for the child (bug #6823)
        if (child.setShow && !qx.util.PropertyUtil.getUserValue(child, "show")) {
          child.setShow(this.getShow());
        }
        var newWidth = this.getSizeHint().width + child.getSizeHint().width + 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _remove(child) {
        qx.ui.toolbar.ToolBar.superclass.prototype._remove.call(this, child);
        var newWidth = this.getSizeHint().width - child.getSizeHint().width - 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _removeAt(index) {
        var child = this._getChildren()[index];
        qx.ui.toolbar.ToolBar.superclass.prototype._removeAt.call(this, index);
        var newWidth = this.getSizeHint().width - child.getSizeHint().width - 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
        return child;
      },
      // overridden
      _removeAll() {
        var children = qx.ui.toolbar.ToolBar.superclass.prototype._removeAll.call(this);
        this._recalculateOverflow(null, 0);
        return children;
      },
      /*
      ---------------------------------------------------------------------------
        UTILITIES
      ---------------------------------------------------------------------------
      */

      /**
       * Add a spacer to the toolbar. The spacer has a flex
       * value of one and will stretch to the available space.
       *
       * @return {qx.ui.core.Spacer} The newly added spacer object. A reference
       *   to the spacer is needed to remove this spacer from the layout.
       */
      addSpacer() {
        var spacer = new qx.ui.core.Spacer();
        this._add(spacer, {
          flex: 1
        });
        return spacer;
      },
      /**
       * Adds a separator to the toolbar.
       */
      addSeparator() {
        this.add(new qx.ui.toolbar.Separator());
      },
      /**
       * Returns all nested buttons which contains a menu to show. This is mainly
       * used for keyboard support.
       *
       * @return {Array} List of all menu buttons
       */
      getMenuButtons() {
        var children = this.getChildren();
        var buttons = [];
        var child;
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          if (child instanceof qx.ui.menubar.Button) {
            buttons.push(child);
          } else if (child instanceof qx.ui.toolbar.Part) {
            buttons.push.apply(buttons, child.getMenuButtons());
          }
        }
        return buttons;
      }
    },
    destruct() {
      if (this.hasListener("resize")) {
        this.removeListener("resize", this._onResize, this);
      }
    }
  });
  qx.ui.toolbar.ToolBar.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.event.Timer": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Timer, which accelerates after each interval. The initial delay and the
   * interval time can be set using the properties {@link #firstInterval}
   * and {@link #interval}. The {@link #interval} events will be fired with
   * decreasing interval times while the timer is running, until the {@link #minimum}
   * is reached. The {@link #decrease} property sets the amount of milliseconds
   * which will decreased after every firing.
   *
   * This class is e.g. used in the {@link qx.ui.form.RepeatButton} and
   * {@link qx.ui.form.HoverButton} widgets.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.event.AcceleratingTimer", {
    extend: qx.core.Object,
    implement: [qx.core.IDisposable],
    construct() {
      qx.core.Object.constructor.call(this);
      this.__timer__P_199_0 = new qx.event.Timer(this.getInterval());
      this.__timer__P_199_0.addListener("interval", this._onInterval, this);
    },
    events: {
      /** This event if fired each time the interval time has elapsed */
      interval: "qx.event.type.Event"
    },
    properties: {
      /**
       * Interval used after the first run of the timer. Usually a smaller value
       * than the "firstInterval" property value to get a faster reaction.
       */
      interval: {
        check: "Integer",
        init: 100
      },
      /**
       * Interval used for the first run of the timer. Usually a greater value
       * than the "interval" property value to a little delayed reaction at the first
       * time.
       */
      firstInterval: {
        check: "Integer",
        init: 500
      },
      /** This configures the minimum value for the timer interval. */
      minimum: {
        check: "Integer",
        init: 20
      },
      /** Decrease of the timer on each interval (for the next interval) until minTimer reached. */
      decrease: {
        check: "Integer",
        init: 2
      }
    },
    members: {
      __timer__P_199_0: null,
      __currentInterval__P_199_1: null,
      /**
       * Reset and start the timer.
       */
      start() {
        this.__timer__P_199_0.setInterval(this.getFirstInterval());
        this.__timer__P_199_0.start();
      },
      /**
       * Stop the timer
       */
      stop() {
        this.__timer__P_199_0.stop();
        this.__currentInterval__P_199_1 = null;
      },
      /**
       * Interval event handler
       */
      _onInterval() {
        this.__timer__P_199_0.stop();
        if (this.__currentInterval__P_199_1 == null) {
          this.__currentInterval__P_199_1 = this.getInterval();
        }
        this.__currentInterval__P_199_1 = Math.max(this.getMinimum(), this.__currentInterval__P_199_1 - this.getDecrease());
        this.__timer__P_199_0.setInterval(this.__currentInterval__P_199_1);
        this.__timer__P_199_0.start();
        this.fireEvent("interval");
      }
    },
    destruct() {
      this._disposeObjects("__timer__P_199_0");
    }
  });
  qx.event.AcceleratingTimer.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.Assert": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.locale.Manager": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "os.name": {
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
   * Static class, which contains functionality to localize the names of keyboard keys.
   */

  qx.Class.define("qx.locale.Key", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Return localized name of a key identifier
       * {@link qx.event.type.KeySequence}
       *
       * @param size {String} format of the key identifier.
       *       Possible values: "short", "full"
       * @param keyIdentifier {String} key identifier to translate {@link qx.event.type.KeySequence}
       * @param locale {String} optional locale to be used
       * @return {String} localized key name
       */
      getKeyName(size, keyIdentifier, locale) {
        {
          qx.core.Assert.assertInArray(size, ["short", "full"]);
        }
        var key = "key_" + size + "_" + keyIdentifier;
        // Control is always named control on a mac and not Strg in German e.g.
        if (qx.core.Environment.get("os.name") == "osx" && keyIdentifier == "Control") {
          key += "_Mac";
        }
        var localizedKey = qx.locale.Manager.getInstance().translate(key, [], locale);
        if (localizedKey == key) {
          return qx.locale.Key._keyNames[key] || keyIdentifier;
        } else {
          return localizedKey;
        }
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      var keyNames = {};
      var Manager = qx.locale.Manager;

      // TRANSLATION: short representation of key names
      keyNames[Manager.marktr("key_short_Backspace")] = "Backspace";
      keyNames[Manager.marktr("key_short_Tab")] = "Tab";
      keyNames[Manager.marktr("key_short_Space")] = "Space";
      keyNames[Manager.marktr("key_short_Enter")] = "Enter";
      keyNames[Manager.marktr("key_short_Shift")] = "Shift";
      keyNames[Manager.marktr("key_short_Control")] = "Ctrl";
      keyNames[Manager.marktr("key_short_Control_Mac")] = "Ctrl";
      keyNames[Manager.marktr("key_short_Alt")] = "Alt";
      keyNames[Manager.marktr("key_short_CapsLock")] = "Caps";
      keyNames[Manager.marktr("key_short_Meta")] = "Meta";
      keyNames[Manager.marktr("key_short_Escape")] = "Esc";
      keyNames[Manager.marktr("key_short_Left")] = "Left";
      keyNames[Manager.marktr("key_short_Up")] = "Up";
      keyNames[Manager.marktr("key_short_Right")] = "Right";
      keyNames[Manager.marktr("key_short_Down")] = "Down";
      keyNames[Manager.marktr("key_short_PageUp")] = "PgUp";
      keyNames[Manager.marktr("key_short_PageDown")] = "PgDn";
      keyNames[Manager.marktr("key_short_End")] = "End";
      keyNames[Manager.marktr("key_short_Home")] = "Home";
      keyNames[Manager.marktr("key_short_Insert")] = "Ins";
      keyNames[Manager.marktr("key_short_Delete")] = "Del";
      keyNames[Manager.marktr("key_short_NumLock")] = "Num";
      keyNames[Manager.marktr("key_short_PrintScreen")] = "Print";
      keyNames[Manager.marktr("key_short_Scroll")] = "Scroll";
      keyNames[Manager.marktr("key_short_Pause")] = "Pause";
      keyNames[Manager.marktr("key_short_Win")] = "Win";
      keyNames[Manager.marktr("key_short_Apps")] = "Apps";

      // TRANSLATION: full/long representation of key names
      keyNames[Manager.marktr("key_full_Backspace")] = "Backspace";
      keyNames[Manager.marktr("key_full_Tab")] = "Tabulator";
      keyNames[Manager.marktr("key_full_Space")] = "Space";
      keyNames[Manager.marktr("key_full_Enter")] = "Enter";
      keyNames[Manager.marktr("key_full_Shift")] = "Shift";
      keyNames[Manager.marktr("key_full_Control")] = "Control";
      keyNames[Manager.marktr("key_full_Control_Mac")] = "Control";
      keyNames[Manager.marktr("key_full_Alt")] = "Alt";
      keyNames[Manager.marktr("key_full_CapsLock")] = "CapsLock";
      keyNames[Manager.marktr("key_full_Meta")] = "Meta";
      keyNames[Manager.marktr("key_full_Escape")] = "Escape";
      keyNames[Manager.marktr("key_full_Left")] = "Left";
      keyNames[Manager.marktr("key_full_Up")] = "Up";
      keyNames[Manager.marktr("key_full_Right")] = "Right";
      keyNames[Manager.marktr("key_full_Down")] = "Down";
      keyNames[Manager.marktr("key_full_PageUp")] = "PageUp";
      keyNames[Manager.marktr("key_full_PageDown")] = "PageDown";
      keyNames[Manager.marktr("key_full_End")] = "End";
      keyNames[Manager.marktr("key_full_Home")] = "Home";
      keyNames[Manager.marktr("key_full_Insert")] = "Insert";
      keyNames[Manager.marktr("key_full_Delete")] = "Delete";
      keyNames[Manager.marktr("key_full_NumLock")] = "NumLock";
      keyNames[Manager.marktr("key_full_PrintScreen")] = "PrintScreen";
      keyNames[Manager.marktr("key_full_Scroll")] = "Scroll";
      keyNames[Manager.marktr("key_full_Pause")] = "Pause";
      keyNames[Manager.marktr("key_full_Win")] = "Win";
      keyNames[Manager.marktr("key_full_Apps")] = "Apps";

      // Save
      statics._keyNames = keyNames;
    }
  });
  qx.locale.Key.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.locale.Manager": {
        "construct": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.dynlocale": {
          "load": true
        }
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Mixin handling the valid and required properties for the form widgets.
   */
  qx.Mixin.define("qx.ui.form.MForm", {
    construct() {
      {
        this.__changeLocaleMFormListenerId__P_163_0 = qx.locale.Manager.getInstance().addListener("changeLocale", this.__onChangeLocale__P_163_1, this);
      }
    },
    properties: {
      /**
       * Flag signaling if a widget is valid. If a widget is invalid, an invalid
       * state will be set.
       */
      valid: {
        check: "Boolean",
        init: true,
        apply: "_applyValid",
        event: "changeValid"
      },
      /**
       * Flag signaling if a widget is required.
       */
      required: {
        check: "Boolean",
        init: false,
        event: "changeRequired"
      },
      /**
       * Message which will be shown in an tooltip if the widget is invalid.
       */
      invalidMessage: {
        init: null,
        nullable: true,
        check: "String",
        event: "changeInvalidMessage"
      },
      /**
       * Message which will be shown in an invalid tooltip if the {@link #required} is
       * set to true.
       */
      requiredInvalidMessage: {
        check: "String",
        nullable: true,
        event: "changeRequiredInvalidMessage"
      }
    },
    members: {
      // apply method
      _applyValid(value, old) {
        value ? this.removeState("invalid") : this.addState("invalid");
      },
      /**
       * Locale change event handler
       *
       * @signature function(e)
       * @param e {Event} the change event
       */
      __onChangeLocale__P_163_1: qx.core.Environment.select("qx.dynlocale", {
        true(e) {
          // invalid message
          var invalidMessage = this.getInvalidMessage();
          if (invalidMessage && invalidMessage.translate) {
            this.setInvalidMessage(invalidMessage.translate());
          }
          // required invalid message
          var requiredInvalidMessage = this.getRequiredInvalidMessage();
          if (requiredInvalidMessage && requiredInvalidMessage.translate) {
            this.setRequiredInvalidMessage(requiredInvalidMessage.translate());
          }
        },
        false: null
      })
    },
    destruct() {
      if (true && this.__changeLocaleMFormListenerId__P_163_0) {
        qx.locale.Manager.getInstance().removeListenerById(this.__changeLocaleMFormListenerId__P_163_0);
      }
    }
  });
  qx.ui.form.MForm.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.Button": {
        "construct": true,
        "require": true
      },
      "qx.ui.form.MForm": {
        "require": true
      },
      "qx.ui.form.MModelProperty": {
        "require": true
      },
      "qx.ui.form.IRadioItem": {
        "require": true
      },
      "qx.ui.form.IForm": {
        "require": true
      },
      "qx.ui.form.IBooleanForm": {
        "require": true
      },
      "qx.ui.form.IModel": {
        "require": true
      },
      "qx.ui.form.RadioGroup": {}
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
  
  ************************************************************************ */

  /**
   * Radio buttons can be used in radio groups to allow to the user to select
   * exactly one item from a list. Radio groups are established by adding
   * radio buttons to a radio manager {@link qx.ui.form.RadioGroup}.
   *
   * Example:
   * <pre class="javascript">
   *   var container = new qx.ui.container.Composite(new qx.ui.layout.VBox);
   *
   *   var female = new qx.ui.form.RadioButton("female");
   *   var male = new qx.ui.form.RadioButton("male");
   *
   *   var mgr = new qx.ui.form.RadioGroup();
   *   mgr.add(female, male);
   *
   *   container.add(male);
   *   container.add(female);
   * </pre>
   */
  qx.Class.define("qx.ui.form.RadioButton", {
    extend: qx.ui.form.Button,
    include: [qx.ui.form.MForm, qx.ui.form.MModelProperty],
    implement: [qx.ui.form.IRadioItem, qx.ui.form.IForm, qx.ui.form.IBooleanForm, qx.ui.form.IModel],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param label {String?null} An optional label for the radio button.
     */
    construct(label) {
      {
        this.assertArgumentsCount(arguments, 0, 1);
      }
      qx.ui.form.Button.constructor.call(this, label);

      // ARIA attrs
      // Important: (Grouped) radio btns should be children of a div with role 'radiogroup'
      const contentEl = this.getContentElement();
      contentEl.setAttribute("role", "radio");
      contentEl.setAttribute("aria-checked", false);

      // Add listeners
      this.addListener("execute", this._onExecute);
      this.addListener("keypress", this._onKeyPress);
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** The assigned qx.ui.form.RadioGroup which handles the switching between registered buttons */
      group: {
        check: "qx.ui.form.RadioGroup",
        nullable: true,
        apply: "_applyGroup"
      },
      /** The value of the widget. True, if the widget is checked. */
      value: {
        check: "Boolean",
        nullable: true,
        event: "changeValue",
        apply: "_applyValue",
        init: false
      },
      // overridden
      appearance: {
        refine: true,
        init: "radiobutton"
      },
      // overridden
      allowGrowX: {
        refine: true,
        init: false
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        checked: true,
        focused: true,
        invalid: true,
        hovered: true
      },
      // overridden (from MExecutable to keep the icon out of the binding)
      /**
       * @lint ignoreReferenceField(_bindableProperties)
       */
      _bindableProperties: ["enabled", "label", "toolTipText", "value", "menu"],
      /*
      ---------------------------------------------------------------------------
        APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyValue(value, old) {
        value ? this.addState("checked") : this.removeState("checked");
        this.getContentElement().setAttribute("aria-checked", Boolean(value));
      },
      /** The assigned {@link qx.ui.form.RadioGroup} which handles the switching between registered buttons */
      _applyGroup(value, old) {
        if (old) {
          old.remove(this);
        }
        if (value) {
          value.add(this);
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT-HANDLER
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for the "execute" event.
       *
       * Sets the property "checked" to true.
       *
       * @param e {qx.event.type.Event} execute event
       */
      _onExecute(e) {
        var grp = this.getGroup();
        if (grp && grp.getAllowEmptySelection()) {
          this.toggleValue();
        } else {
          this.setValue(true);
        }
      },
      /**
       * Event listener for the "keyPress" event.
       *
       * Selects the previous RadioButton when pressing "Left" or "Up" and
       * Selects the next RadioButton when pressing "Right" and "Down"
       *
       * @param e {qx.event.type.KeySequence} KeyPress event
       */
      _onKeyPress(e) {
        var grp = this.getGroup();
        if (!grp) {
          return;
        }
        switch (e.getKeyIdentifier()) {
          case "Left":
          case "Up":
            grp.selectPrevious();
            break;
          case "Right":
          case "Down":
            grp.selectNext();
            break;
        }
      }
    }
  });
  qx.ui.form.RadioButton.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.RadioButton": {
        "construct": true,
        "require": true
      },
      "qx.ui.form.IRadioItem": {
        "require": true
      },
      "qx.ui.layout.Grid": {
        "construct": true
      },
      "qx.ui.basic.Label": {},
      "qx.ui.basic.Image": {},
      "qx.ui.form.Button": {}
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
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * A TabButton is the tapable part sitting on the {@link qx.ui.tabview.Page}.
   * By tapping on the TabButton the user can set a Page active.
   *
   * @childControl label {qx.ui.basic.Label} label of the tab button
   * @childControl icon {qx.ui.basic.Image} icon of the tab button
   * @childControl close-button {qx.ui.form.Button} close button of the tab button
   */
  qx.Class.define("qx.ui.tabview.TabButton", {
    extend: qx.ui.form.RadioButton,
    implement: qx.ui.form.IRadioItem,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.form.RadioButton.constructor.call(this);
      var layout = new qx.ui.layout.Grid(2, 0);
      layout.setRowAlign(0, "left", "middle");
      layout.setColumnAlign(0, "right", "middle");
      this._getLayout().dispose();
      this._setLayout(layout);
      this.initShowCloseButton();
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired by {@link qx.ui.tabview.Page} if the close button is tapped.
       *
       * Event data: The tab button.
       */
      close: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** Indicates if the close button of a TabButton should be shown. */
      showCloseButton: {
        check: "Boolean",
        init: false,
        apply: "_applyShowCloseButton"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        focused: true,
        checked: true
      },
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */

      _applyIconPosition(value, old) {
        var children = {
          icon: this.getChildControl("icon"),
          label: this.getChildControl("label"),
          closeButton: this.getShowCloseButton() ? this.getChildControl("close-button") : null
        };

        // Remove all children before adding them again
        for (var child in children) {
          if (children[child]) {
            this._remove(children[child]);
          }
        }
        switch (value) {
          case "top":
            this._add(children.label, {
              row: 3,
              column: 2
            });
            this._add(children.icon, {
              row: 1,
              column: 2
            });
            if (children.closeButton) {
              this._add(children.closeButton, {
                row: 0,
                column: 4
              });
            }
            break;
          case "bottom":
            this._add(children.label, {
              row: 1,
              column: 2
            });
            this._add(children.icon, {
              row: 3,
              column: 2
            });
            if (children.closeButton) {
              this._add(children.closeButton, {
                row: 0,
                column: 4
              });
            }
            break;
          case "left":
            this._add(children.label, {
              row: 0,
              column: 2
            });
            this._add(children.icon, {
              row: 0,
              column: 0
            });
            if (children.closeButton) {
              this._add(children.closeButton, {
                row: 0,
                column: 4
              });
            }
            break;
          case "right":
            this._add(children.label, {
              row: 0,
              column: 0
            });
            this._add(children.icon, {
              row: 0,
              column: 2
            });
            if (children.closeButton) {
              this._add(children.closeButton, {
                row: 0,
                column: 4
              });
            }
            break;
        }
      },
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "label":
            var control = new qx.ui.basic.Label(this.getLabel());
            control.setAnonymous(true);
            this._add(control, {
              row: 0,
              column: 2
            });
            this._getLayout().setColumnFlex(2, 1);
            break;
          case "icon":
            control = new qx.ui.basic.Image(this.getIcon());
            control.setAnonymous(true);
            this._add(control, {
              row: 0,
              column: 0
            });
            break;
          case "close-button":
            control = new qx.ui.form.Button();
            control.setFocusable(false);
            control.setKeepActive(true);
            control.addListener("tap", this._onCloseButtonTap, this);
            this._add(control, {
              row: 0,
              column: 4
            });
            if (!this.getShowCloseButton()) {
              control.exclude();
            }
            break;
        }
        return control || qx.ui.tabview.TabButton.superclass.prototype._createChildControlImpl.call(this, id);
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Fires a "close" event when the close button is tapped.
       */
      _onCloseButtonTap() {
        this.fireDataEvent("close", this);
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyShowCloseButton(value, old) {
        if (value) {
          this._showChildControl("close-button");
        } else {
          this._excludeChildControl("close-button");
        }
      },
      // property apply
      _applyCenter(value) {
        var layout = this._getLayout();
        if (value) {
          layout.setColumnAlign(2, "center", "middle");
        } else {
          layout.setColumnAlign(2, "left", "middle");
        }
      }
    }
  });
  qx.ui.tabview.TabButton.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "require": true
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
  
  ************************************************************************ */

  /**
   * A widget used for decoration proposes to structure a toolbar. Each
   * Separator renders a line between the buttons around.
   */
  qx.Class.define("qx.ui.toolbar.Separator", {
    extend: qx.ui.core.Widget,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "toolbar-separator"
      },
      // overridden
      anonymous: {
        refine: true,
        init: true
      },
      // overridden
      width: {
        refine: true,
        init: 0
      },
      // overridden
      height: {
        refine: true,
        init: 0
      }
    }
  });
  qx.ui.toolbar.Separator.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.MRemoteChildrenHandling": {
        "require": true
      },
      "qx.ui.layout.HBox": {
        "construct": true
      },
      "qx.ui.basic.Image": {},
      "qx.ui.toolbar.PartContainer": {},
      "qx.ui.toolbar.Separator": {},
      "qx.ui.menubar.Button": {}
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
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * A part is a container for multiple toolbar buttons. Each part comes
   * with a handle which may be used in later versions to drag the part
   * around and move it to another position. Currently mainly used
   * for structuring large toolbars beyond the capabilities of the
   * {@link Separator}.
   *
   * @childControl handle {qx.ui.basic.Image} prat handle to visualize the separation
   * @childControl container {qx.ui.toolbar.PartContainer} holds the content of the toolbar part
   */
  qx.Class.define("qx.ui.toolbar.Part", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MRemoteChildrenHandling],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.core.Widget.constructor.call(this);

      // Hard coded HBox layout
      this._setLayout(new qx.ui.layout.HBox());

      // Force creation of the handle
      this._createChildControl("handle");
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      appearance: {
        refine: true,
        init: "toolbar/part"
      },
      /** Whether icons, labels, both or none should be shown. */
      show: {
        init: "both",
        check: ["both", "label", "icon"],
        inheritable: true,
        event: "changeShow"
      },
      /** The spacing between every child of the toolbar */
      spacing: {
        nullable: true,
        check: "Integer",
        themeable: true,
        apply: "_applySpacing"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "handle":
            control = new qx.ui.basic.Image();
            control.setAlignY("middle");
            this._add(control);
            break;
          case "container":
            control = new qx.ui.toolbar.PartContainer();
            control.addListener("syncAppearance", this.__onSyncAppearance__P_218_0, this);
            this._add(control);
            control.addListener("changeChildren", () => {
              this.__onSyncAppearance__P_218_0();
            });
            break;
        }
        return control || qx.ui.toolbar.Part.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      getChildrenContainer() {
        return this.getChildControl("container");
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      _applySpacing(value, old) {
        var layout = this.getChildControl("container").getLayout();
        value == null ? layout.resetSpacing() : layout.setSpacing(value);
      },
      /*
      ---------------------------------------------------------------------------
        UTILITIES
      ---------------------------------------------------------------------------
      */
      /**
       * Helper which applies the left, right and middle states.
       */
      __onSyncAppearance__P_218_0() {
        // check every child
        var children = this.getChildrenContainer().getChildren();
        children = children.filter(function (child) {
          return child.getVisibility() == "visible";
        });
        for (var i = 0; i < children.length; i++) {
          // if its the first child
          if (i == 0 && i != children.length - 1) {
            children[i].addState("left");
            children[i].removeState("right");
            children[i].removeState("middle");
            // if its the last child
          } else if (i == children.length - 1 && i != 0) {
            children[i].addState("right");
            children[i].removeState("left");
            children[i].removeState("middle");
            // if there is only one child
          } else if (i == 0 && i == children.length - 1) {
            children[i].removeState("left");
            children[i].removeState("middle");
            children[i].removeState("right");
          } else {
            children[i].addState("middle");
            children[i].removeState("right");
            children[i].removeState("left");
          }
        }
      },
      /**
       * Adds a separator to the toolbar part.
       */
      addSeparator() {
        this.add(new qx.ui.toolbar.Separator());
      },
      /**
       * Returns all nested buttons which contains a menu to show. This is mainly
       * used for keyboard support.
       *
       * @return {Array} List of all menu buttons
       */
      getMenuButtons() {
        var children = this.getChildren();
        var buttons = [];
        var child;
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          if (child instanceof qx.ui.menubar.Button) {
            buttons.push(child);
          }
        }
        return buttons;
      }
    }
  });
  qx.ui.toolbar.Part.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.Abstract": {
        "construct": true,
        "require": true
      },
      "qx.lang.Object": {},
      "qx.ui.layout.Util": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
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
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The grid layout manager arranges the items in a two dimensional
   * grid. Widgets can be placed into the grid's cells and may span multiple rows
   * and columns.
   *
   * *Features*
   *
   * * Flex values for rows and columns
   * * Minimal and maximal column and row sizes
   * * Manually setting of column and row sizes
   * * Horizontal and vertical alignment
   * * Horizontal and vertical spacing
   * * Column and row spans
   * * Auto-sizing
   *
   * *Item Properties*
   *
   * <ul>
   * <li><strong>row</strong> <em>(Integer)</em>: The row of the cell the
   *   widget should occupy. Each cell can only containing one widget. This layout
   *   property is mandatory.
   * </li>
   * <li><strong>column</strong> <em>(Integer)</em>: The column of the cell the
   *   widget should occupy. Each cell can only containing one widget. This layout
   *   property is mandatory.
   * </li>
   * <li><strong>rowSpan</strong> <em>(Integer)</em>: The number of rows, the
   *   widget should span, starting from the row specified in the <code>row</code>
   *   property. The cells in the spanned rows must be empty as well.
   * </li>
   * <li><strong>colSpan</strong> <em>(Integer)</em>: The number of columns, the
   *   widget should span, starting from the column specified in the <code>column</code>
   *   property. The cells in the spanned columns must be empty as well.
   * </li>
   * </ul>
   *
   * *Example*
   *
   * Here is a little example of how to use the grid layout.
   *
   * <pre class="javascript">
   * var layout = new qx.ui.layout.Grid();
   * layout.setRowFlex(0, 1); // make row 0 flexible
   * layout.setColumnWidth(1, 200); // set with of column 1 to 200 pixel
   *
   * var container = new qx.ui.container.Composite(layout);
   * container.add(new qx.ui.core.Widget(), {row: 0, column: 0});
   * container.add(new qx.ui.core.Widget(), {row: 0, column: 1});
   * container.add(new qx.ui.core.Widget(), {row: 1, column: 0, rowSpan: 2});
   * </pre>
   *
   * *External Documentation*
   *
   * <a href='https://qooxdoo.org/documentation/#/desktop/layout/grid.md'>
   * Extended documentation</a> and links to demos of this layout in the qooxdoo manual.
   */
  qx.Class.define("qx.ui.layout.Grid", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param spacingX {Integer?0} The horizontal spacing between grid cells.
     *     Sets {@link #spacingX}.
     * @param spacingY {Integer?0} The vertical spacing between grid cells.
     *     Sets {@link #spacingY}.
     */
    construct(spacingX, spacingY) {
      qx.ui.layout.Abstract.constructor.call(this);
      this.__rowData__P_165_0 = [];
      this.__colData__P_165_1 = [];
      if (spacingX) {
        this.setSpacingX(spacingX);
      }
      if (spacingY) {
        this.setSpacingY(spacingY);
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * The horizontal spacing between grid cells.
       */
      spacingX: {
        check: "Integer",
        init: 0,
        apply: "_applyLayoutChange"
      },
      /**
       * The vertical spacing between grid cells.
       */
      spacingY: {
        check: "Integer",
        init: 0,
        apply: "_applyLayoutChange"
      },
      /**
       * Allow growing of spanning cells' widths beyond the accumulated widths of the columns.
       * The default behavior (init value false) is that the width of the spanning cell is
       * determined by the accumulated width of the columns (plus spacing).
       * Setting this property to true lets the cell width grow as needed to show
       * the widget in the spanning cell, which also enlarges the width of the spanned columns.
       */
      allowGrowSpannedCellWidth: {
        check: "Boolean",
        init: false,
        apply: "_applyLayoutChange"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** @type {Array} 2D array of grid cell data */
      __grid__P_165_2: null,
      __rowData__P_165_0: null,
      __colData__P_165_1: null,
      __colSpans__P_165_3: null,
      __rowSpans__P_165_4: null,
      __maxRowIndex__P_165_5: null,
      __maxColIndex__P_165_6: null,
      /** @type {Array} cached row heights */
      __rowHeights__P_165_7: null,
      /** @type {Array} cached column widths */
      __colWidths__P_165_8: null,
      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          var layoutProperties = {
            row: 1,
            column: 1,
            rowSpan: 1,
            colSpan: 1
          };
          this.assert(layoutProperties[name] == 1, "The property '" + name + "' is not supported by the Grid layout!");
          this.assertInteger(value);
          this.assert(value >= 0, "Value must be positive");
        },
        false: null
      }),
      /**
       * Rebuild the internal representation of the grid
       */
      __buildGrid__P_165_9() {
        var grid = [];
        var colSpans = [];
        var rowSpans = [];
        var maxRowIndex = -1;
        var maxColIndex = -1;
        var children = this._getLayoutChildren();
        for (var i = 0, l = children.length; i < l; i++) {
          var child = children[i];
          var props = child.getLayoutProperties();
          var row = props.row;
          var column = props.column;
          props.colSpan = props.colSpan || 1;
          props.rowSpan = props.rowSpan || 1;

          // validate arguments
          if (row == null || column == null) {
            throw new Error("The layout properties 'row' and 'column' of the child widget '" + child + "' must be defined!");
          }
          if (grid[row] && grid[row][column]) {
            throw new Error("Cannot add widget '" + child + "'!. " + "There is already a widget '" + grid[row][column] + "' in this cell (" + row + ", " + column + ") for '" + this + "'");
          }
          for (var x = column; x < column + props.colSpan; x++) {
            for (var y = row; y < row + props.rowSpan; y++) {
              if (grid[y] == undefined) {
                grid[y] = [];
              }
              grid[y][x] = child;
              maxColIndex = Math.max(maxColIndex, x);
              maxRowIndex = Math.max(maxRowIndex, y);
            }
          }
          if (props.rowSpan > 1) {
            rowSpans.push(child);
          }
          if (props.colSpan > 1) {
            colSpans.push(child);
          }
        }

        // make sure all columns are defined so that accessing the grid using
        // this.__grid[column][row] will never raise an exception
        for (var y = 0; y <= maxRowIndex; y++) {
          if (grid[y] == undefined) {
            grid[y] = [];
          }
        }
        this.__grid__P_165_2 = grid;
        this.__colSpans__P_165_3 = colSpans;
        this.__rowSpans__P_165_4 = rowSpans;
        this.__maxRowIndex__P_165_5 = maxRowIndex;
        this.__maxColIndex__P_165_6 = maxColIndex;
        this.__rowHeights__P_165_7 = null;
        this.__colWidths__P_165_8 = null;

        // Clear invalidation marker
        delete this._invalidChildrenCache;
      },
      /**
       * Stores data for a grid row
       *
       * @param row {Integer} The row index
       * @param key {String} The key under which the data should be stored
       * @param value {var} data to store
       */
      _setRowData(row, key, value) {
        var rowData = this.__rowData__P_165_0[row];
        if (!rowData) {
          this.__rowData__P_165_0[row] = {};
          this.__rowData__P_165_0[row][key] = value;
        } else {
          rowData[key] = value;
        }
      },
      /**
       * Stores data for a grid column
       *
       * @param column {Integer} The column index
       * @param key {String} The key under which the data should be stored
       * @param value {var} data to store
       */
      _setColumnData(column, key, value) {
        var colData = this.__colData__P_165_1[column];
        if (!colData) {
          this.__colData__P_165_1[column] = {};
          this.__colData__P_165_1[column][key] = value;
        } else {
          colData[key] = value;
        }
      },
      /**
       * Shortcut to set both horizontal and vertical spacing between grid cells
       * to the same value.
       *
       * @param spacing {Integer} new horizontal and vertical spacing
       * @return {qx.ui.layout.Grid} This object (for chaining support).
       */
      setSpacing(spacing) {
        this.setSpacingY(spacing);
        this.setSpacingX(spacing);
        return this;
      },
      /**
       * Set the default cell alignment for a column. This alignment can be
       * overridden on a per cell basis by setting the cell's content widget's
       * <code>alignX</code> and <code>alignY</code> properties.
       *
       * If on a grid cell both row and a column alignment is set, the horizontal
       * alignment is taken from the column and the vertical alignment is taken
       * from the row.
       *
       * @param column {Integer} Column index
       * @param hAlign {String} The horizontal alignment. Valid values are
       *    "left", "center" and "right".
       * @param vAlign {String} The vertical alignment. Valid values are
       *    "top", "middle", "bottom"
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setColumnAlign(column, hAlign, vAlign) {
        {
          this.assertInteger(column, "Invalid parameter 'column'");
          this.assertInArray(hAlign, ["left", "center", "right"]);
          this.assertInArray(vAlign, ["top", "middle", "bottom"]);
        }
        this._setColumnData(column, "hAlign", hAlign);
        this._setColumnData(column, "vAlign", vAlign);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get a map of the column's alignment.
       *
       * @param column {Integer} The column index
       * @return {Map} A map with the keys <code>vAlign</code> and <code>hAlign</code>
       *     containing the vertical and horizontal column alignment.
       */
      getColumnAlign(column) {
        var colData = this.__colData__P_165_1[column] || {};
        return {
          vAlign: colData.vAlign || "top",
          hAlign: colData.hAlign || "left"
        };
      },
      /**
       * Set the default cell alignment for a row. This alignment can be
       * overridden on a per cell basis by setting the cell's content widget's
       * <code>alignX</code> and <code>alignY</code> properties.
       *
       * If on a grid cell both row and a column alignment is set, the horizontal
       * alignment is taken from the column and the vertical alignment is taken
       * from the row.
       *
       * @param row {Integer} Row index
       * @param hAlign {String} The horizontal alignment. Valid values are
       *    "left", "center" and "right".
       * @param vAlign {String} The vertical alignment. Valid values are
       *    "top", "middle", "bottom"
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setRowAlign(row, hAlign, vAlign) {
        {
          this.assertInteger(row, "Invalid parameter 'row'");
          this.assertInArray(hAlign, ["left", "center", "right"]);
          this.assertInArray(vAlign, ["top", "middle", "bottom"]);
        }
        this._setRowData(row, "hAlign", hAlign);
        this._setRowData(row, "vAlign", vAlign);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get a map of the row's alignment.
       *
       * @param row {Integer} The Row index
       * @return {Map} A map with the keys <code>vAlign</code> and <code>hAlign</code>
       *     containing the vertical and horizontal row alignment.
       */
      getRowAlign(row) {
        var rowData = this.__rowData__P_165_0[row] || {};
        return {
          vAlign: rowData.vAlign || "top",
          hAlign: rowData.hAlign || "left"
        };
      },
      /**
       * Get the widget located in the cell. If a the cell is empty or the widget
       * has a {@link qx.ui.core.Widget#visibility} value of <code>exclude</code>,
       * <code>null</code> is returned.
       *
       * @param row {Integer} The cell's row index
       * @param column {Integer} The cell's column index
       * @return {qx.ui.core.Widget|null}The cell's widget. The value may be null.
       */
      getCellWidget(row, column) {
        if (this._invalidChildrenCache) {
          this.__buildGrid__P_165_9();
        }
        var row = this.__grid__P_165_2[row] || {};
        return row[column] || null;
      },
      /**
       * Get the number of rows in the grid layout.
       *
       * @return {Integer} The number of rows in the layout
       */
      getRowCount() {
        if (this._invalidChildrenCache) {
          this.__buildGrid__P_165_9();
        }
        return this.__maxRowIndex__P_165_5 + 1;
      },
      /**
       * Get the number of columns in the grid layout.
       *
       * @return {Integer} The number of columns in the layout
       */
      getColumnCount() {
        if (this._invalidChildrenCache) {
          this.__buildGrid__P_165_9();
        }
        return this.__maxColIndex__P_165_6 + 1;
      },
      /**
       * Get a map of the cell's alignment. For vertical alignment the row alignment
       * takes precedence over the column alignment. For horizontal alignment it is
       * the over way round. If an alignment is set on the cell widget using
       * {@link qx.ui.core.LayoutItem#setLayoutProperties}, this alignment takes
       * always precedence over row or column alignment.
       *
       * @param row {Integer} The cell's row index
       * @param column {Integer} The cell's column index
       * @return {Map} A map with the keys <code>vAlign</code> and <code>hAlign</code>
       *     containing the vertical and horizontal cell alignment.
       */
      getCellAlign(row, column) {
        var vAlign = "top";
        var hAlign = "left";
        var rowData = this.__rowData__P_165_0[row];
        var colData = this.__colData__P_165_1[column];
        var widget = this.__grid__P_165_2[row][column];
        if (widget) {
          var widgetProps = {
            vAlign: widget.getAlignY(),
            hAlign: widget.getAlignX()
          };
        } else {
          widgetProps = {};
        }

        // compute vAlign
        // precedence : widget -> row -> column
        if (widgetProps.vAlign) {
          vAlign = widgetProps.vAlign;
        } else if (rowData && rowData.vAlign) {
          vAlign = rowData.vAlign;
        } else if (colData && colData.vAlign) {
          vAlign = colData.vAlign;
        }

        // compute hAlign
        // precedence : widget -> column -> row
        if (widgetProps.hAlign) {
          hAlign = widgetProps.hAlign;
        } else if (colData && colData.hAlign) {
          hAlign = colData.hAlign;
        } else if (rowData && rowData.hAlign) {
          hAlign = rowData.hAlign;
        }
        return {
          vAlign: vAlign,
          hAlign: hAlign
        };
      },
      /**
       * Set the flex value for a grid column.
       * By default the column flex value is <code>0</code>.
       *
       * @param column {Integer} The column index
       * @param flex {Integer} The column's flex value
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setColumnFlex(column, flex) {
        this._setColumnData(column, "flex", flex);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get the flex value of a grid column.
       *
       * @param column {Integer} The column index
       * @return {Integer} The column's flex value
       */
      getColumnFlex(column) {
        var colData = this.__colData__P_165_1[column] || {};
        return colData.flex !== undefined ? colData.flex : 0;
      },
      /**
       * Set the flex value for a grid row.
       * By default the row flex value is <code>0</code>.
       *
       * @param row {Integer} The row index
       * @param flex {Integer} The row's flex value
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setRowFlex(row, flex) {
        this._setRowData(row, "flex", flex);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get the flex value of a grid row.
       *
       * @param row {Integer} The row index
       * @return {Integer} The row's flex value
       */
      getRowFlex(row) {
        var rowData = this.__rowData__P_165_0[row] || {};
        var rowFlex = rowData.flex !== undefined ? rowData.flex : 0;
        return rowFlex;
      },
      /**
       * Set the maximum width of a grid column.
       * The default value is <code>Infinity</code>.
       *
       * @param column {Integer} The column index
       * @param maxWidth {Integer} The column's maximum width
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setColumnMaxWidth(column, maxWidth) {
        this._setColumnData(column, "maxWidth", maxWidth);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get the maximum width of a grid column.
       *
       * @param column {Integer} The column index
       * @return {Integer} The column's maximum width
       */
      getColumnMaxWidth(column) {
        var colData = this.__colData__P_165_1[column] || {};
        return colData.maxWidth !== undefined ? colData.maxWidth : Infinity;
      },
      /**
       * Set the preferred width of a grid column.
       * The default value is <code>Infinity</code>.
       *
       * @param column {Integer} The column index
       * @param width {Integer} The column's width
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setColumnWidth(column, width) {
        this._setColumnData(column, "width", width);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get the preferred width of a grid column.
       *
       * @param column {Integer} The column index
       * @return {Integer} The column's width
       */
      getColumnWidth(column) {
        var colData = this.__colData__P_165_1[column] || {};
        return colData.width !== undefined ? colData.width : null;
      },
      /**
       * Set the minimum width of a grid column.
       * The default value is <code>0</code>.
       *
       * @param column {Integer} The column index
       * @param minWidth {Integer} The column's minimum width
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setColumnMinWidth(column, minWidth) {
        this._setColumnData(column, "minWidth", minWidth);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get the minimum width of a grid column.
       *
       * @param column {Integer} The column index
       * @return {Integer} The column's minimum width
       */
      getColumnMinWidth(column) {
        var colData = this.__colData__P_165_1[column] || {};
        return colData.minWidth || 0;
      },
      /**
       * Set the maximum height of a grid row.
       * The default value is <code>Infinity</code>.
       *
       * @param row {Integer} The row index
       * @param maxHeight {Integer} The row's maximum width
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setRowMaxHeight(row, maxHeight) {
        this._setRowData(row, "maxHeight", maxHeight);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get the maximum height of a grid row.
       *
       * @param row {Integer} The row index
       * @return {Integer} The row's maximum width
       */
      getRowMaxHeight(row) {
        var rowData = this.__rowData__P_165_0[row] || {};
        return rowData.maxHeight || Infinity;
      },
      /**
       * Set the preferred height of a grid row.
       * The default value is <code>Infinity</code>.
       *
       * @param row {Integer} The row index
       * @param height {Integer} The row's width
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setRowHeight(row, height) {
        this._setRowData(row, "height", height);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get the preferred height of a grid row.
       *
       * @param row {Integer} The row index
       * @return {Integer} The row's width
       */
      getRowHeight(row) {
        var rowData = this.__rowData__P_165_0[row] || {};
        return rowData.height !== undefined ? rowData.height : null;
      },
      /**
       * Set the minimum height of a grid row.
       * The default value is <code>0</code>.
       *
       * @param row {Integer} The row index
       * @param minHeight {Integer} The row's minimum width
       * @return {qx.ui.layout.Grid} This object (for chaining support)
       */
      setRowMinHeight(row, minHeight) {
        this._setRowData(row, "minHeight", minHeight);
        this._applyLayoutChange();
        return this;
      },
      /**
       * Get the minimum height of a grid row.
       *
       * @param row {Integer} The row index
       * @return {Integer} The row's minimum width
       */
      getRowMinHeight(row) {
        var rowData = this.__rowData__P_165_0[row] || {};
        return rowData.minHeight || 0;
      },
      /**
       * Computes the widget's size hint including the widget's margins
       *
       * @param widget {qx.ui.core.LayoutItem} The widget to get the size for
       * @return {Map} a size hint map
       */
      _getOuterSize(widget) {
        var hint = widget.getSizeHint();
        var hMargins = widget.getMarginLeft() + widget.getMarginRight();
        var vMargins = widget.getMarginTop() + widget.getMarginBottom();
        var outerSize = {
          height: hint.height + vMargins,
          width: hint.width + hMargins,
          minHeight: hint.minHeight + vMargins,
          minWidth: hint.minWidth + hMargins,
          maxHeight: hint.maxHeight + vMargins,
          maxWidth: hint.maxWidth + hMargins
        };
        return outerSize;
      },
      /**
       * Check whether all row spans fit with their preferred height into the
       * preferred row heights. If there is not enough space, the preferred
       * row sizes are increased. The distribution respects the flex and max
       * values of the rows.
       *
       *  The same is true for the min sizes.
       *
       *  The height array is modified in place.
       *
       * @param rowHeights {Map[]} The current row height array as computed by
       *     {@link #_getRowHeights}.
       */
      _fixHeightsRowSpan(rowHeights) {
        var vSpacing = this.getSpacingY();
        for (var i = 0, l = this.__rowSpans__P_165_4.length; i < l; i++) {
          var widget = this.__rowSpans__P_165_4[i];
          var hint = this._getOuterSize(widget);
          var widgetProps = widget.getLayoutProperties();
          var widgetRow = widgetProps.row;
          var prefSpanHeight = vSpacing * (widgetProps.rowSpan - 1);
          var minSpanHeight = prefSpanHeight;
          var rowFlexes = {};
          for (var j = 0; j < widgetProps.rowSpan; j++) {
            var row = widgetProps.row + j;
            var rowHeight = rowHeights[row];
            var rowFlex = this.getRowFlex(row);
            if (rowFlex > 0) {
              // compute flex array for the preferred height
              rowFlexes[row] = {
                min: rowHeight.minHeight,
                value: rowHeight.height,
                max: rowHeight.maxHeight,
                flex: rowFlex
              };
            }
            prefSpanHeight += rowHeight.height;
            minSpanHeight += rowHeight.minHeight;
          }

          // If there is not enough space for the preferred size
          // increment the preferred row sizes.
          if (prefSpanHeight < hint.height) {
            if (!qx.lang.Object.isEmpty(rowFlexes)) {
              var rowIncrements = qx.ui.layout.Util.computeFlexOffsets(rowFlexes, hint.height, prefSpanHeight);
              for (var k = 0; k < widgetProps.rowSpan; k++) {
                var offset = rowIncrements[widgetRow + k] ? rowIncrements[widgetRow + k].offset : 0;
                rowHeights[widgetRow + k].height += offset;
              }
              // row is too small and we have no flex value set
            } else {
              var totalSpacing = vSpacing * (widgetProps.rowSpan - 1);
              var availableHeight = hint.height - totalSpacing;

              // get the row height which every child would need to share the
              // available hight equally
              var avgRowHeight = Math.floor(availableHeight / widgetProps.rowSpan);

              // get the hight already used and the number of children which do
              // not have at least that avg row height
              var usedHeight = 0;
              var rowsNeedAddition = 0;
              for (var k = 0; k < widgetProps.rowSpan; k++) {
                var currentHeight = rowHeights[widgetRow + k].height;
                usedHeight += currentHeight;
                if (currentHeight < avgRowHeight) {
                  rowsNeedAddition++;
                }
              }

              // the difference of available and used needs to be shared among
              // those not having the min size
              var additionalRowHeight = Math.floor((availableHeight - usedHeight) / rowsNeedAddition);

              // add the extra height to the too small children
              for (var k = 0; k < widgetProps.rowSpan; k++) {
                if (rowHeights[widgetRow + k].height < avgRowHeight) {
                  rowHeights[widgetRow + k].height += additionalRowHeight;
                }
              }
            }
          }

          // If there is not enough space for the min size
          // increment the min row sizes.
          if (minSpanHeight < hint.minHeight) {
            var rowIncrements = qx.ui.layout.Util.computeFlexOffsets(rowFlexes, hint.minHeight, minSpanHeight);
            for (var j = 0; j < widgetProps.rowSpan; j++) {
              var offset = rowIncrements[widgetRow + j] ? rowIncrements[widgetRow + j].offset : 0;
              rowHeights[widgetRow + j].minHeight += offset;
            }
          }
        }
      },
      /**
       * Check whether all col spans fit with their preferred width into the
       * preferred column widths. If there is not enough space the preferred
       * column sizes are increased. The distribution respects the flex and max
       * values of the columns.
       *
       *  The same is true for the min sizes.
       *
       *  The width array is modified in place.
       *
       * @param colWidths {Map[]} The current column width array as computed by
       *     {@link #_getColWidths}.
       */
      _fixWidthsColSpan(colWidths) {
        var hSpacing = this.getSpacingX();
        var colSpans = this._getColSpans();
        for (var i = 0, l = colSpans.length; i < l; i++) {
          var widget = colSpans[i];
          var hint = this._getOuterSize(widget);
          var widgetProps = widget.getLayoutProperties();
          var widgetColumn = widgetProps.column;
          var prefSpanWidth = hSpacing * (widgetProps.colSpan - 1);
          var minSpanWidth = prefSpanWidth;
          var colFlexes = {};
          var offset;
          for (var j = 0; j < widgetProps.colSpan; j++) {
            var col = widgetProps.column + j;
            var colWidth = colWidths[col];
            var colFlex = this.getColumnFlex(col);

            // compute flex array for the preferred width
            if (colFlex > 0) {
              colFlexes[col] = {
                min: colWidth.minWidth,
                value: colWidth.width,
                max: colWidth.maxWidth,
                flex: colFlex
              };
            }
            prefSpanWidth += colWidth.width;
            minSpanWidth += colWidth.minWidth;
          }

          // If there is not enough space for the preferred size
          // increment the preferred column sizes.
          if (prefSpanWidth < hint.width) {
            // Do not adapt column widths to the width
            // of the spanning cell if allowGrowSpannedCellWidth property
            // is set to false
            // See https://github.com/qooxdoo/qooxdoo/issues/9871
            if (!this.getAllowGrowSpannedCellWidth() || !qx.lang.Object.isEmpty(colFlexes)) {
              var colIncrements = qx.ui.layout.Util.computeFlexOffsets(colFlexes, hint.width, prefSpanWidth);
              for (var j = 0; j < widgetProps.colSpan; j++) {
                offset = colIncrements[widgetColumn + j] ? colIncrements[widgetColumn + j].offset : 0;
                colWidths[widgetColumn + j].width += offset;
              }
              // col is too small and we have no flex value set
            } else {
              var totalSpacing = hSpacing * (widgetProps.colSpan - 1);
              var availableWidth = hint.width - totalSpacing;

              // get the col width which every child would need to share the
              // available width equally
              var avgColWidth = Math.floor(availableWidth / widgetProps.colSpan);

              // get the width already used and the number of children which do
              // not have at least that avg col width
              var usedWidth = 0;
              var colsNeedAddition = 0;
              for (var k = 0; k < widgetProps.colSpan; k++) {
                var currentWidth = colWidths[widgetColumn + k].width;
                usedWidth += currentWidth;
                if (currentWidth < avgColWidth) {
                  colsNeedAddition++;
                }
              }

              // the difference of available and used needs to be shared among
              // those not having the min size
              var additionalColWidth = Math.floor((availableWidth - usedWidth) / colsNeedAddition);

              // add the extra width to the too small children
              for (var k = 0; k < widgetProps.colSpan; k++) {
                if (colWidths[widgetColumn + k].width < avgColWidth) {
                  colWidths[widgetColumn + k].width += additionalColWidth;
                }
              }
            }
          }

          // If there is not enough space for the min size
          // increment the min column sizes.
          if (minSpanWidth < hint.minWidth) {
            var colIncrements = qx.ui.layout.Util.computeFlexOffsets(colFlexes, hint.minWidth, minSpanWidth);
            for (var j = 0; j < widgetProps.colSpan; j++) {
              offset = colIncrements[widgetColumn + j] ? colIncrements[widgetColumn + j].offset : 0;
              colWidths[widgetColumn + j].minWidth += offset;
            }
          }
        }
      },
      /**
       * Compute the min/pref/max row heights.
       *
       * @return {Map[]} An array containing height information for each row. The
       *     entries have the keys <code>minHeight</code>, <code>maxHeight</code> and
       *     <code>height</code>.
       */
      _getRowHeights() {
        if (this.__rowHeights__P_165_7 != null) {
          return this.__rowHeights__P_165_7;
        }
        var rowHeights = [];
        var maxRowIndex = this.__maxRowIndex__P_165_5;
        var maxColIndex = this.__maxColIndex__P_165_6;
        for (var row = 0; row <= maxRowIndex; row++) {
          var minHeight = 0;
          var height = 0;
          var maxHeight = 0;
          for (var col = 0; col <= maxColIndex; col++) {
            var widget = this.__grid__P_165_2[row][col];
            if (!widget) {
              continue;
            }

            // ignore rows with row spans at this place
            // these rows will be taken into account later
            var widgetRowSpan = widget.getLayoutProperties().rowSpan || 0;
            if (widgetRowSpan > 1) {
              continue;
            }
            var cellSize = this._getOuterSize(widget);
            if (this.getRowFlex(row) > 0) {
              minHeight = Math.max(minHeight, cellSize.minHeight);
            } else {
              minHeight = Math.max(minHeight, cellSize.height);
            }
            height = Math.max(height, cellSize.height);
          }
          var minHeight = Math.max(minHeight, this.getRowMinHeight(row));
          var maxHeight = this.getRowMaxHeight(row);
          if (this.getRowHeight(row) !== null) {
            var height = this.getRowHeight(row);
          } else {
            var height = Math.max(minHeight, Math.min(height, maxHeight));
          }
          rowHeights[row] = {
            minHeight: minHeight,
            height: height,
            maxHeight: maxHeight
          };
        }
        if (this.__rowSpans__P_165_4.length > 0) {
          this._fixHeightsRowSpan(rowHeights);
        }
        this.__rowHeights__P_165_7 = rowHeights;
        return rowHeights;
      },
      /**
       * Compute the min/pref/max column widths.
       *
       * @return {Map[]} An array containing width information for each column. The
       *     entries have the keys <code>minWidth</code>, <code>maxWidth</code> and
       *     <code>width</code>.
       */
      _getColWidths() {
        if (this.__colWidths__P_165_8 != null) {
          return this.__colWidths__P_165_8;
        }
        var colWidths = [];
        var maxColIndex = this.__maxColIndex__P_165_6;
        var maxRowIndex = this.__maxRowIndex__P_165_5;
        for (var col = 0; col <= maxColIndex; col++) {
          var width = 0;
          var minWidth = 0;
          var maxWidth = Infinity;
          for (var row = 0; row <= maxRowIndex; row++) {
            var widget = this.__grid__P_165_2[row][col];
            if (!widget) {
              continue;
            }

            // ignore columns with col spans at this place
            // these columns will be taken into account later
            var widgetColSpan = widget.getLayoutProperties().colSpan || 0;
            if (widgetColSpan > 1) {
              continue;
            }
            var cellSize = this._getOuterSize(widget);
            minWidth = Math.max(minWidth, cellSize.minWidth);
            width = Math.max(width, cellSize.width);
          }
          minWidth = Math.max(minWidth, this.getColumnMinWidth(col));
          maxWidth = this.getColumnMaxWidth(col);
          if (this.getColumnWidth(col) !== null) {
            var width = this.getColumnWidth(col);
          } else {
            var width = Math.max(minWidth, Math.min(width, maxWidth));
          }
          colWidths[col] = {
            minWidth: minWidth,
            width: width,
            maxWidth: maxWidth
          };
        }
        if (this._getColSpans().length > 0) {
          this._fixWidthsColSpan(colWidths);
        }
        this.__colWidths__P_165_8 = colWidths;
        return colWidths;
      },
      /**
       * Computes for each column by how many pixels it must grow or shrink, taking
       * the column flex values and min/max widths into account.
       *
       * @param width {Integer} The grid width
       * @return {Integer[]} Sparse array of offsets to add to each column width. If
       *     an array entry is empty nothing should be added to the column.
       */
      _getColumnFlexOffsets(width) {
        var hint = this.getSizeHint();
        var diff = width - hint.width;
        if (diff == 0) {
          return {};
        }

        // collect all flexible children
        var colWidths = this._getColWidths();
        var flexibles = {};
        for (var i = 0, l = colWidths.length; i < l; i++) {
          var col = colWidths[i];
          var colFlex = this.getColumnFlex(i);
          if (colFlex <= 0 || col.width == col.maxWidth && diff > 0 || col.width == col.minWidth && diff < 0) {
            continue;
          }
          flexibles[i] = {
            min: col.minWidth,
            value: col.width,
            max: col.maxWidth,
            flex: colFlex
          };
        }
        return qx.ui.layout.Util.computeFlexOffsets(flexibles, width, hint.width);
      },
      /**
       * Computes for each row by how many pixels it must grow or shrink, taking
       * the row flex values and min/max heights into account.
       *
       * @param height {Integer} The grid height
       * @return {Integer[]} Sparse array of offsets to add to each row height. If
       *     an array entry is empty nothing should be added to the row.
       */
      _getRowFlexOffsets(height) {
        var hint = this.getSizeHint();
        var diff = height - hint.height;
        if (diff == 0) {
          return {};
        }

        // collect all flexible children
        var rowHeights = this._getRowHeights();
        var flexibles = {};
        for (var i = 0, l = rowHeights.length; i < l; i++) {
          var row = rowHeights[i];
          var rowFlex = this.getRowFlex(i);
          if (rowFlex <= 0 || row.height == row.maxHeight && diff > 0 || row.height == row.minHeight && diff < 0) {
            continue;
          }
          flexibles[i] = {
            min: row.minHeight,
            value: row.height,
            max: row.maxHeight,
            flex: rowFlex
          };
        }
        return qx.ui.layout.Util.computeFlexOffsets(flexibles, height, hint.height);
      },
      /**
       * Returns the internal private __colSpans array in order
       * have a protected getter which can be used other methods
       * to make them overridable
       *
       * @return {Array} the __colSpans array
       */
      _getColSpans() {
        return this.__colSpans__P_165_3;
      },
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        if (this._invalidChildrenCache) {
          this.__buildGrid__P_165_9();
        }
        var Util = qx.ui.layout.Util;
        var hSpacing = this.getSpacingX();
        var vSpacing = this.getSpacingY();

        // calculate column widths
        var prefWidths = this._getColWidths();
        var colStretchOffsets = this._getColumnFlexOffsets(availWidth);
        var colWidths = [];
        var maxColIndex = this.__maxColIndex__P_165_6;
        var maxRowIndex = this.__maxRowIndex__P_165_5;
        var offset;
        for (var col = 0; col <= maxColIndex; col++) {
          offset = colStretchOffsets[col] ? colStretchOffsets[col].offset : 0;
          colWidths[col] = prefWidths[col].width + offset;
        }

        // calculate row heights
        var prefHeights = this._getRowHeights();
        var rowStretchOffsets = this._getRowFlexOffsets(availHeight);
        var rowHeights = [];
        for (var row = 0; row <= maxRowIndex; row++) {
          offset = rowStretchOffsets[row] ? rowStretchOffsets[row].offset : 0;
          rowHeights[row] = prefHeights[row].height + offset;
        }

        // do the layout
        var left = 0;
        for (var col = 0; col <= maxColIndex; col++) {
          var top = 0;
          for (var row = 0; row <= maxRowIndex; row++) {
            var widget = this.__grid__P_165_2[row][col];

            // ignore empty cells
            if (!widget) {
              top += rowHeights[row] + vSpacing;
              continue;
            }
            var widgetProps = widget.getLayoutProperties();

            // ignore cells, which have cell spanning but are not the origin
            // of the widget
            if (widgetProps.row !== row || widgetProps.column !== col) {
              top += rowHeights[row] + vSpacing;
              continue;
            }

            // compute sizes width including cell spanning
            var spanWidth = hSpacing * (widgetProps.colSpan - 1);
            for (var i = 0; i < widgetProps.colSpan; i++) {
              spanWidth += colWidths[col + i];
            }
            var spanHeight = vSpacing * (widgetProps.rowSpan - 1);
            for (var i = 0; i < widgetProps.rowSpan; i++) {
              spanHeight += rowHeights[row + i];
            }
            var cellHint = widget.getSizeHint();
            var marginTop = widget.getMarginTop();
            var marginLeft = widget.getMarginLeft();
            var marginBottom = widget.getMarginBottom();
            var marginRight = widget.getMarginRight();
            var cellWidth = Math.max(cellHint.minWidth, Math.min(spanWidth - marginLeft - marginRight, cellHint.maxWidth));
            var cellHeight = Math.max(cellHint.minHeight, Math.min(spanHeight - marginTop - marginBottom, cellHint.maxHeight));
            var cellAlign = this.getCellAlign(row, col);
            var cellLeft = left + Util.computeHorizontalAlignOffset(cellAlign.hAlign, cellWidth, spanWidth, marginLeft, marginRight);
            var cellTop = top + Util.computeVerticalAlignOffset(cellAlign.vAlign, cellHeight, spanHeight, marginTop, marginBottom);
            widget.renderLayout(cellLeft + padding.left, cellTop + padding.top, cellWidth, cellHeight);
            top += rowHeights[row] + vSpacing;
          }
          left += colWidths[col] + hSpacing;
        }
      },
      // overridden
      invalidateLayoutCache() {
        qx.ui.layout.Grid.superclass.prototype.invalidateLayoutCache.call(this);
        this.__colWidths__P_165_8 = null;
        this.__rowHeights__P_165_7 = null;
      },
      // overridden
      _computeSizeHint() {
        if (this._invalidChildrenCache) {
          this.__buildGrid__P_165_9();
        }

        // calculate col widths
        var colWidths = this._getColWidths();
        var minWidth = 0,
          width = 0;
        for (var i = 0, l = colWidths.length; i < l; i++) {
          var col = colWidths[i];
          if (this.getColumnFlex(i) > 0) {
            minWidth += col.minWidth;
          } else {
            minWidth += col.width;
          }
          width += col.width;
        }

        // calculate row heights
        var rowHeights = this._getRowHeights();
        var minHeight = 0,
          height = 0;
        for (var i = 0, l = rowHeights.length; i < l; i++) {
          var row = rowHeights[i];
          if (this.getRowFlex(i) > 0) {
            minHeight += row.minHeight;
          } else {
            minHeight += row.height;
          }
          height += row.height;
        }
        var spacingX = this.getSpacingX() * (colWidths.length - 1);
        var spacingY = this.getSpacingY() * (rowHeights.length - 1);
        var hint = {
          minWidth: minWidth + spacingX,
          width: width + spacingX,
          minHeight: minHeight + spacingY,
          height: height + spacingY
        };
        return hint;
      }
    },
    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */

    destruct() {
      this.__grid__P_165_2 = this.__rowData__P_165_0 = this.__colData__P_165_1 = this.__colSpans__P_165_3 = this.__rowSpans__P_165_4 = this.__colWidths__P_165_8 = this.__rowHeights__P_165_7 = null;
    }
  });
  qx.ui.layout.Grid.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.Composite": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.HBox": {
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
       * Andreas Ecker (ecker)
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * The container used by {@link Part} to insert the buttons.
   *
   * @internal
   */
  qx.Class.define("qx.ui.toolbar.PartContainer", {
    extend: qx.ui.container.Composite,
    construct() {
      qx.ui.container.Composite.constructor.call(this);
      this._setLayout(new qx.ui.layout.HBox());
    },
    events: {
      /** Fired if a child has been added or removed */
      changeChildren: "qx.event.type.Event"
    },
    properties: {
      appearance: {
        refine: true,
        init: "toolbar/part/container"
      },
      /** Whether icons, labels, both or none should be shown. */
      show: {
        init: "both",
        check: ["both", "label", "icon"],
        inheritable: true,
        event: "changeShow"
      }
    },
    members: {
      // overridden
      _afterAddChild(child) {
        this.fireEvent("changeChildren");
      },
      // overridden
      _afterRemoveChild(child) {
        this.fireEvent("changeChildren");
      }
    }
  });
  qx.ui.toolbar.PartContainer.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-23.js.map?dt=1791845587575
qx.$$packageData['23'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
