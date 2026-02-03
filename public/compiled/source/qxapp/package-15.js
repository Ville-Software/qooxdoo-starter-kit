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
       2004-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * Basic implementation for an event emitter. This supplies a basic and
   * minimalistic event mechanism.
   */
  qx.Bootstrap.define("qx.event.Emitter", {
    extend: Object,
    statics: {
      /** Static storage for all event listener */
      __storage__P_218_0: []
    },
    members: {
      __listener__P_218_1: null,
      __any__P_218_2: null,
      /**
       * Attach a listener to the event emitter. The given <code>name</code>
       * will define the type of event. Handing in a <code>'*'</code> will
       * listen to all events emitted by the event emitter.
       *
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer} An unique <code>id</code> for the attached listener.
       */
      on(name, listener, ctx) {
        var id = qx.event.Emitter.__storage__P_218_0.length;
        this.__getStorage__P_218_3(name).push({
          listener: listener,
          ctx: ctx,
          id: id,
          name: name
        });
        qx.event.Emitter.__storage__P_218_0.push({
          name: name,
          listener: listener,
          ctx: ctx
        });
        return id;
      },
      /**
       * Attach a listener to the event emitter which will be executed only once.
       * The given <code>name</code> will define the type of event. Handing in a
       * <code>'*'</code> will listen to all events emitted by the event emitter.
       *
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer} An unique <code>id</code> for the attached listener.
       */
      once(name, listener, ctx) {
        var id = qx.event.Emitter.__storage__P_218_0.length;
        this.__getStorage__P_218_3(name).push({
          listener: listener,
          ctx: ctx,
          once: true,
          id: id
        });
        qx.event.Emitter.__storage__P_218_0.push({
          name: name,
          listener: listener,
          ctx: ctx
        });
        return id;
      },
      /**
       * Remove a listener from the event emitter. The given <code>name</code>
       * will define the type of event.
       *
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer|null} The listener's id if it was removed or
       * <code>null</code> if it wasn't found
       */
      off(name, listener, ctx) {
        var storage = this.__getStorage__P_218_3(name);
        for (var i = storage.length - 1; i >= 0; i--) {
          var entry = storage[i];
          if (entry.listener == listener && entry.ctx == ctx) {
            storage.splice(i, 1);
            qx.event.Emitter.__storage__P_218_0[entry.id] = null;
            return entry.id;
          }
        }
        return null;
      },
      /**
       * Removes the listener identified by the given <code>id</code>. The id
       * will be return on attaching the listener and can be stored for removing.
       *
       * @param id {Integer} The id of the listener.
       * @return {Integer|null} The listener's id if it was removed or
       * <code>null</code> if it wasn't found
       */
      offById(id) {
        var entry = qx.event.Emitter.__storage__P_218_0[id];
        if (entry) {
          this.off(entry.name, entry.listener, entry.ctx);
        }
        return null;
      },
      /**
       * Alternative for {@link #on}.
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer} An unique <code>id</code> for the attached listener.
       */
      addListener(name, listener, ctx) {
        return this.on(name, listener, ctx);
      },
      /**
       * Alternative for {@link #once}.
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       * @return {Integer} An unique <code>id</code> for the attached listener.
       */
      addListenerOnce(name, listener, ctx) {
        return this.once(name, listener, ctx);
      },
      /**
       * Alternative for {@link #off}.
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function execute on {@link #emit}.
       * @param ctx {var?Window} The context of the listener.
       */
      removeListener(name, listener, ctx) {
        this.off(name, listener, ctx);
      },
      /**
       * Alternative for {@link #offById}.
       * @param id {Integer} The id of the listener.
       */
      removeListenerById(id) {
        this.offById(id);
      },
      /**
       * Emits an event with the given name. The data will be passed
       * to the listener.
       * @param name {String} The name of the event to emit.
       * @param data {var?undefined} The data which should be passed to the listener.
       */
      emit(name, data) {
        var storage = this.__getStorage__P_218_3(name).concat();
        var toDelete = [];
        for (var i = 0; i < storage.length; i++) {
          var entry = storage[i];
          entry.listener.call(entry.ctx, data);
          if (entry.once) {
            toDelete.push(entry);
          }
        }

        // listener callbacks could manipulate the storage
        // (e.g. module.Event.once)
        toDelete.forEach(function (entry) {
          var origStorage = this.__getStorage__P_218_3(name);
          var idx = origStorage.indexOf(entry);
          origStorage.splice(idx, 1);
        }.bind(this));

        // call on any
        storage = this.__getStorage__P_218_3("*");
        for (var i = storage.length - 1; i >= 0; i--) {
          var entry = storage[i];
          entry.listener.call(entry.ctx, data);
        }
      },
      /**
       * Returns the internal attached listener.
       * @internal
       * @return {Map} A map which has the event name as key. The values are
       *   arrays containing a map with 'listener' and 'ctx'.
       */
      getListeners() {
        return this.__listener__P_218_1;
      },
      /**
       * Returns the data entry for a given event id. If the entry could
       * not be found, undefined will be returned.
       * @internal
       * @param id {Number} The listeners id
       * @return {Map|undefined} The data entry if found
       */
      getEntryById(id) {
        for (var name in this.__listener__P_218_1) {
          var store = this.__listener__P_218_1[name];
          for (var i = 0, j = store.length; i < j; i++) {
            if (store[i].id === id) {
              return store[i];
            }
          }
        }
      },
      /**
       * Internal helper which will return the storage for the given name.
       * @param name {String} The name of the event.
       * @return {Array} An array which is the storage for the listener and
       *   the given event name.
       */
      __getStorage__P_218_3(name) {
        if (this.__listener__P_218_1 == null) {
          this.__listener__P_218_1 = {};
        }
        if (this.__listener__P_218_1[name] == null) {
          this.__listener__P_218_1[name] = [];
        }
        return this.__listener__P_218_1[name];
      }
    }
  });
  qx.event.Emitter.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.bom.Stylesheet": {
        "require": true,
        "defer": "runtime"
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.Style": {},
      "qx.bom.Event": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["css.animation", "css.animation.requestframe"],
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
   * Responsible for checking all relevant animation properties.
   *
   * Spec: http://www.w3.org/TR/css3-animations/
   *
   * @require(qx.bom.Stylesheet)
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.CssAnimation", {
    statics: {
      /**
       * Main check method which returns an object if CSS animations are
       * supported. This object contains all necessary keys to work with CSS
       * animations.
       * <ul>
       *  <li><code>name</code> The name of the css animation style</li>
       *  <li><code>play-state</code> The name of the play-state style</li>
       *  <li><code>start-event</code> The name of the start event</li>
       *  <li><code>iteration-event</code> The name of the iteration event</li>
       *  <li><code>end-event</code> The name of the end event</li>
       *  <li><code>fill-mode</code> The fill-mode style</li>
       *  <li><code>keyframes</code> The name of the keyframes selector.</li>
       * </ul>
       *
       * @internal
       * @return {Object|null} The described object or null, if animations are
       *   not supported.
       */
      getSupport() {
        var name = qx.bom.client.CssAnimation.getName();
        if (name != null) {
          return {
            name: name,
            "play-state": qx.bom.client.CssAnimation.getPlayState(),
            "start-event": qx.bom.client.CssAnimation.getAnimationStart(),
            "iteration-event": qx.bom.client.CssAnimation.getAnimationIteration(),
            "end-event": qx.bom.client.CssAnimation.getAnimationEnd(),
            "fill-mode": qx.bom.client.CssAnimation.getFillMode(),
            keyframes: qx.bom.client.CssAnimation.getKeyFrames()
          };
        }
        return null;
      },
      /**
       * Checks for the 'animation-fill-mode' CSS style.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getFillMode() {
        return qx.bom.Style.getPropertyName("AnimationFillMode");
      },
      /**
       * Checks for the 'animation-play-state' CSS style.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getPlayState() {
        return qx.bom.Style.getPropertyName("AnimationPlayState");
      },
      /**
       * Checks for the style name used for animations.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getName() {
        return qx.bom.Style.getPropertyName("animation");
      },
      /**
       * Checks for the event name of animation start.
       * @internal
       * @return {String} The name of the event.
       */
      getAnimationStart() {
        // special handling for mixed prefixed / unprefixed implementations
        if (qx.bom.Event.supportsEvent(window, "webkitanimationstart")) {
          return "webkitAnimationStart";
        }
        var mapping = {
          msAnimation: "MSAnimationStart",
          WebkitAnimation: "webkitAnimationStart",
          MozAnimation: "animationstart",
          OAnimation: "oAnimationStart",
          animation: "animationstart"
        };
        return mapping[this.getName()];
      },
      /**
       * Checks for the event name of animation end.
       * @internal
       * @return {String} The name of the event.
       */
      getAnimationIteration() {
        // special handling for mixed prefixed / unprefixed implementations
        if (qx.bom.Event.supportsEvent(window, "webkitanimationiteration")) {
          return "webkitAnimationIteration";
        }
        var mapping = {
          msAnimation: "MSAnimationIteration",
          WebkitAnimation: "webkitAnimationIteration",
          MozAnimation: "animationiteration",
          OAnimation: "oAnimationIteration",
          animation: "animationiteration"
        };
        return mapping[this.getName()];
      },
      /**
       * Checks for the event name of animation end.
       * @internal
       * @return {String} The name of the event.
       */
      getAnimationEnd() {
        // special handling for mixed prefixed / unprefixed implementations
        if (qx.bom.Event.supportsEvent(window, "webkitanimationend")) {
          return "webkitAnimationEnd";
        }
        var mapping = {
          msAnimation: "MSAnimationEnd",
          WebkitAnimation: "webkitAnimationEnd",
          MozAnimation: "animationend",
          OAnimation: "oAnimationEnd",
          animation: "animationend"
        };
        return mapping[this.getName()];
      },
      /**
       * Checks what selector should be used to add keyframes to stylesheets.
       * @internal
       * @return {String|null} The name of the selector or null, if the selector
       *   is not supported.
       */
      getKeyFrames() {
        var prefixes = qx.bom.Style.VENDOR_PREFIXES;
        var keyFrames = [];
        for (var i = 0; i < prefixes.length; i++) {
          var key = "@" + qx.bom.Style.getCssName(prefixes[i]) + "-keyframes";
          keyFrames.push(key);
        }
        keyFrames.unshift("@keyframes");
        var sheet = qx.bom.Stylesheet.createElement();
        for (var i = 0; i < keyFrames.length; i++) {
          try {
            qx.bom.Stylesheet.addRule(sheet, keyFrames[i] + " name", "");
            return keyFrames[i];
          } catch (e) {}
        }
        return null;
      },
      /**
       * Checks for the requestAnimationFrame method and return the prefixed name.
       * @internal
       * @return {String|null} A string the method name or null, if the method
       *   is not supported.
       */
      getRequestAnimationFrame() {
        var choices = ["requestAnimationFrame", "msRequestAnimationFrame", "webkitRequestAnimationFrame", "mozRequestAnimationFrame", "oRequestAnimationFrame" // currently unspecified, so we guess the name!
        ];
        for (var i = 0; i < choices.length; i++) {
          if (window[choices[i]] != undefined) {
            return choices[i];
          }
        }
        return null;
      }
    },
    defer(statics) {
      qx.core.Environment.add("css.animation", statics.getSupport);
      qx.core.Environment.add("css.animation.requestframe", statics.getRequestAnimationFrame);
    }
  });
  qx.bom.client.CssAnimation.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.lang.normalize.Date": {
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
      "qx.event.Emitter": {
        "require": true
      },
      "qx.bom.client.CssAnimation": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "css.animation.requestframe": {
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
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * This is a cross browser wrapper for requestAnimationFrame. For further
   * information about the feature, take a look at spec:
   * http://www.w3.org/TR/animation-timing/
   *
   * This class offers two ways of using this feature. First, the plain
   * API the spec describes.
   *
   * Here is a sample usage:
   * <pre class='javascript'>var start = Date.now();
   * var cb = function(time) {
   *   if (time >= start + duration) {
   *     // ... do some last tasks
   *   } else {
   *     var timePassed = time - start;
   *     // ... calculate the current step and apply it
   *     qx.bom.AnimationFrame.request(cb, this);
   *   }
   * };
   * qx.bom.AnimationFrame.request(cb, this);
   * </pre>
   *
   * Another way of using it is to use it as an instance emitting events.
   *
   * Here is a sample usage of that API:
   * <pre class='javascript'>var frame = new qx.bom.AnimationFrame();
   * frame.on("end", function() {
   *   // ... do some last tasks
   * }, this);
   * frame.on("frame", function(timePassed) {
   *   // ... calculate the current step and apply it
   * }, this);
   * frame.startSequence(duration);
   * </pre>
   *
   * @require(qx.lang.normalize.Date)
   */
  qx.Bootstrap.define("qx.bom.AnimationFrame", {
    extend: qx.event.Emitter,
    events: {
      /** Fired as soon as the animation has ended. */
      end: undefined,
      /**
       * Fired on every frame having the passed time as value
       * (might be a float for higher precision).
       */
      frame: "Number"
    },
    members: {
      __canceled__P_180_0: false,
      /**
       * Method used to start a series of animation frames. The series will end as
       * soon as the given duration is over.
       *
       * @param duration {Number} The duration the sequence should take.
       *
       * @ignore(performance.*)
       */
      startSequence(duration) {
        this.__canceled__P_180_0 = false;
        var start = window.performance && performance.now ? performance.now() + qx.bom.AnimationFrame.__start__P_180_1 : Date.now();
        var cb = function (time) {
          if (this.__canceled__P_180_0) {
            this.id = null;
            return;
          }

          // final call
          if (time >= start + duration) {
            this.emit("end");
            this.id = null;
          } else {
            var timePassed = Math.max(time - start, 0);
            this.emit("frame", timePassed);
            this.id = qx.bom.AnimationFrame.request(cb, this);
          }
        };
        this.id = qx.bom.AnimationFrame.request(cb, this);
      },
      /**
       * Cancels a started sequence of frames. It will do nothing if no
       * sequence is running.
       */
      cancelSequence() {
        this.__canceled__P_180_0 = true;
      }
    },
    statics: {
      /**
       * The default time in ms the timeout fallback implementation uses.
       */
      TIMEOUT: 30,
      /**
       * Calculation of the predefined timing functions. Approximation of the real
       * bezier curves has been used for easier calculation. This is good and close
       * enough for the predefined functions like <code>ease</code> or
       * <code>linear</code>.
       *
       * @param func {String} The defined timing function. One of the following values:
       *   <code>"ease-in"</code>, <code>"ease-out"</code>, <code>"linear"</code>,
       *   <code>"ease-in-out"</code>, <code>"ease"</code>.
       * @param x {Integer} The percent value of the function.
       * @return {Integer} The calculated value
       */
      calculateTiming(func, x) {
        if (func == "ease-in") {
          var a = [3.1223e-7, 0.0757, 1.2646, -0.167, -0.4387, 0.2654];
        } else if (func == "ease-out") {
          var a = [-7.0198e-8, 1.652, -0.551, -0.0458, 0.1255, -0.1807];
        } else if (func == "linear") {
          return x;
        } else if (func == "ease-in-out") {
          var a = [2.482e-7, -0.2289, 3.3466, -1.0857, -1.7354, 0.7034];
        } else {
          // default is 'ease'
          var a = [-0.0021, 0.2472, 9.8054, -21.6869, 17.7611, -5.1226];
        }

        // A 6th grade polynomial has been used as approximation of the original
        // bezier curves  described in the transition spec
        // http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
        // (the same is used for animations as well)
        var y = 0;
        for (var i = 0; i < a.length; i++) {
          y += a[i] * Math.pow(x, i);
        }
        return y;
      },
      /**
       * Request for an animation frame. If the native <code>requestAnimationFrame</code>
       * method is supported, it will be used. Otherwise, we use timeouts with a
       * 30ms delay. The HighResolutionTime will be used if supported but the time given
       * to the callback will still be a timestamp starting at 1 January 1970 00:00:00 UTC.
       *
       * @param callback {Function} The callback function which will get the current
       *   time as argument (which could be a float for higher precision).
       * @param context {var} The context of the callback.
       * @return {Number} The id of the request.
       */
      request(callback, context) {
        var req = qx.core.Environment.get("css.animation.requestframe");
        var cb = function (time) {
          // check for high resolution time
          if (time < 1e10) {
            time = qx.bom.AnimationFrame.__start__P_180_1 + time;
          }
          time = time || Date.now();
          callback.call(context, time);
        };
        if (req) {
          return window[req](cb);
        } else {
          // make sure to use an indirection because setTimeout passes a
          // number as first argument as well
          return window.setTimeout(function () {
            cb();
          }, qx.bom.AnimationFrame.TIMEOUT);
        }
      }
    },
    /**
     * @ignore(performance.timing.*)
     */
    defer(statics) {
      // check and use the high resolution start time if available
      statics.__start__P_180_1 = window.performance && performance.timing && performance.timing.navigationStart;
      // if not, simply use the current time
      if (!statics.__start__P_180_1) {
        statics.__start__P_180_1 = Date.now();
      }
    }
  });
  qx.bom.AnimationFrame.$$dbClassInfo = $$dbClassInfo;
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
       2004-2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
   ************************************************************************ */

  /**
   * Util for mouse wheel normalization.
   */
  qx.Bootstrap.define("qx.util.Wheel", {
    statics: {
      /**
       * The maximal measured scroll wheel delta.
       * @internal
       */
      MAXSCROLL: null,
      /**
       * The minimal measured scroll wheel delta.
       * @internal
       */
      MINSCROLL: null,
      /**
       * The normalization factor for the speed calculation.
       * @internal
       */
      FACTOR: 1,
      /**
       * Is the Wheel actually a touchpad ?
       * @internal
       */
      IS_TOUCHPAD: false,
      /**
       * Get the amount the wheel has been scrolled
       *
       * @param domEvent {Event} The native wheel event.
       * @param axis {String?} Optional parameter which defines the scroll axis.
       *   The value can either be <code>"x"</code> or <code>"y"</code>.
       * @return {Integer} Scroll wheel movement for the given axis. If no axis
       *   is given, the y axis is used.
       */
      getDelta(domEvent, axis) {
        // default case
        if (axis === undefined) {
          // default case
          var delta = 0;
          if (domEvent.wheelDelta !== undefined) {
            delta = -domEvent.wheelDelta;
          } else if (domEvent.detail !== 0) {
            delta = domEvent.detail;
          } else if (domEvent.deltaY !== undefined) {
            // use deltaY as default for firefox
            delta = domEvent.deltaY;
          }
          return this.__normalize__P_187_0(delta);
        }

        // get the x scroll delta
        if (axis === "x") {
          var x = 0;
          if (domEvent.wheelDelta !== undefined) {
            if (domEvent.wheelDeltaX !== undefined) {
              x = domEvent.wheelDeltaX ? this.__normalize__P_187_0(-domEvent.wheelDeltaX) : 0;
            }
          } else {
            if (domEvent.axis && domEvent.axis == domEvent.HORIZONTAL_AXIS && domEvent.detail !== undefined && domEvent.detail > 0) {
              x = this.__normalize__P_187_0(domEvent.detail);
            } else if (domEvent.deltaX !== undefined) {
              x = this.__normalize__P_187_0(domEvent.deltaX);
            }
          }
          return x;
        }

        // get the y scroll delta
        if (axis === "y") {
          var y = 0;
          if (domEvent.wheelDelta !== undefined) {
            if (domEvent.wheelDeltaY !== undefined) {
              y = domEvent.wheelDeltaY ? this.__normalize__P_187_0(-domEvent.wheelDeltaY) : 0;
            } else {
              y = this.__normalize__P_187_0(-domEvent.wheelDelta);
            }
          } else {
            if (!(domEvent.axis && domEvent.axis == domEvent.HORIZONTAL_AXIS) && domEvent.detail !== undefined && domEvent.detail > 0) {
              y = this.__normalize__P_187_0(domEvent.detail);
            } else if (domEvent.deltaY !== undefined) {
              y = this.__normalize__P_187_0(domEvent.deltaY);
            }
          }
          return y;
        }
        // default case, return 0
        return 0;
      },
      /**
       * Normalizer for the mouse wheel data.
       *
       * @param delta {Number} The mouse delta.
       * @return {Number} The normalized delta value
       */
      __normalize__P_187_0(delta) {
        if (qx.util.Wheel.IS_TOUCHPAD) {
          // Reset normalization values that may be re-computed once a real mouse is plugged.
          qx.util.Wheel.MINSCROLL = null;
          qx.util.Wheel.MAXSCROLL = null;
          qx.util.Wheel.FACTOR = 1;
          return delta;
        }
        var absDelta = Math.abs(delta);
        if (absDelta === 0) {
          return 0;
        }

        // store the min value
        if (qx.util.Wheel.MINSCROLL == null || qx.util.Wheel.MINSCROLL > absDelta) {
          qx.util.Wheel.MINSCROLL = absDelta;
          this.__recalculateMultiplicator__P_187_1();
        }

        // store the max value
        if (qx.util.Wheel.MAXSCROLL == null || qx.util.Wheel.MAXSCROLL < absDelta) {
          qx.util.Wheel.MAXSCROLL = absDelta;
          this.__recalculateMultiplicator__P_187_1();
        }

        // special case for systems not speeding up
        if (qx.util.Wheel.MAXSCROLL === absDelta && qx.util.Wheel.MINSCROLL === absDelta) {
          return 2 * (delta / absDelta);
        }
        var range = qx.util.Wheel.MAXSCROLL - qx.util.Wheel.MINSCROLL;
        var ret = delta / range * Math.log(range) * qx.util.Wheel.FACTOR;

        // return at least 1 or -1
        return ret < 0 ? Math.min(ret, -1) : Math.max(ret, 1);
      },
      /**
       * Recalculates the factor with which the calculated delta is normalized.
       */
      __recalculateMultiplicator__P_187_1() {
        var max = qx.util.Wheel.MAXSCROLL || 0;
        var min = qx.util.Wheel.MINSCROLL || max;
        if (max <= min) {
          return;
        }
        var range = max - min;
        var maxRet = max / range * Math.log(range);
        if (maxRet == 0) {
          maxRet = 1;
        }
        qx.util.Wheel.FACTOR = 6 / maxRet;
      }
    }
  });
  qx.util.Wheel.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.Assert": {},
      "qx.event.GlobalError": {
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
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * Global timer support.
   *
   * This class can be used to periodically fire an event. This event can be
   * used to simulate e.g. a background task. The static method
   * {@link #once} is a special case. It will call a function deferred after a
   * given timeout.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.event.Timer", {
    extend: qx.core.Object,
    implement: [qx.core.IDisposable],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param interval {Number} initial interval in milliseconds of the timer.
     */
    construct(interval) {
      qx.core.Object.constructor.call(this);
      if (interval != null) {
        this.setInterval(interval);
      }

      // don't use qx.lang.Function.bind because this function would add a
      // disposed check, which could break the functionality. In IE the handler
      // may get called after "clearInterval" (i.e. after the timer is disposed)
      // and we must be able to handle this.
      var self = this;
      this.__oninterval__P_188_0 = function () {
        self._oninterval.call(self);
      };
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
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Start a function after a given timeout.
       *
       * @param func {Function} Function to call
       * @param obj {Object} context (this), the function is called with
       * @param timeout {Number} Number of milliseconds to wait before the
       *   function is called.
       * @return {qx.event.Timer} The timer object used for the timeout. This
       *    object can be used to cancel the timeout. Note that the timer is
       *    only valid until the timer has been executed.
       */
      once(func, obj, timeout) {
        {
          // check the given parameter
          qx.core.Assert.assertFunction(func, "func is not a function");
          qx.core.Assert.assertNotUndefined(timeout, "No timeout given");
        }

        // Create time instance
        var timer = new qx.event.Timer(timeout);

        // Bug #3481: append original function to timer instance so it can be
        // read by a debugger
        timer.__onceFunc__P_188_1 = func;

        // Add event listener to interval
        timer.addListener("interval", function (e) {
          timer.stop();
          func.call(obj, e);
          delete timer.__onceFunc__P_188_1;
          timer.dispose();
          obj = null;
        }, obj);

        // Directly start timer
        timer.start();
        return timer;
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * With the enabled property the Timer can be started and suspended.
       * Setting it to "true" is equivalent to {@link #start}, setting it
       * to "false" is equivalent to {@link #stop}.
       */
      enabled: {
        init: false,
        check: "Boolean",
        apply: "_applyEnabled"
      },
      /**
       * Time in milliseconds between two callback calls.
       * This property can be set to modify the interval of
       * a running timer.
       */
      interval: {
        check: "Integer",
        init: 1000,
        apply: "_applyInterval"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __intervalHandler__P_188_2: null,
      __oninterval__P_188_0: null,
      /*
      ---------------------------------------------------------------------------
        APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      /**
       * Apply the interval of the timer.
       *
       * @param value {var} Current value
       * @param old {var} Previous value
       */
      _applyInterval(value, old) {
        if (this.getEnabled()) {
          this.restart();
        }
      },
      /**
       * Apply the enabled state of the timer.
       *
       * @param value {var} Current value
       * @param old {var} Previous value
       */
      _applyEnabled(value, old) {
        if (old) {
          window.clearInterval(this.__intervalHandler__P_188_2);
          this.__intervalHandler__P_188_2 = null;
        } else if (value) {
          this.__intervalHandler__P_188_2 = window.setInterval(this.__oninterval__P_188_0, this.getInterval());
        }
      },
      /*
      ---------------------------------------------------------------------------
        USER-ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Start the timer
       *
       */
      start() {
        this.setEnabled(true);
      },
      /**
       * Start the timer with a given interval
       *
       * @param interval {Integer} Time in milliseconds between two callback calls.
       */
      startWith(interval) {
        this.setInterval(interval);
        this.start();
      },
      /**
       * Stop the timer.
       *
       */
      stop() {
        this.setEnabled(false);
      },
      /**
       * Restart the timer.
       * This makes it possible to change the interval of a running timer.
       *
       */
      restart() {
        this.stop();
        this.start();
      },
      /**
       * Restart the timer. with a given interval.
       *
       * @param interval {Integer} Time in milliseconds between two callback calls.
       */
      restartWith(interval) {
        this.stop();
        this.startWith(interval);
      },
      /*
      ---------------------------------------------------------------------------
        EVENT-MAPPER
      ---------------------------------------------------------------------------
      */

      /**
       * timer callback
       *
       * @signature function()
       */
      _oninterval: qx.event.GlobalError.observeMethod(function () {
        if (this.$$disposed) {
          return;
        }
        if (this.getEnabled()) {
          this.fireEvent("interval");
        }
      })
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      if (this.__intervalHandler__P_188_2) {
        window.clearInterval(this.__intervalHandler__P_188_2);
      }
      this.__intervalHandler__P_188_2 = this.__oninterval__P_188_0 = null;
    }
  });
  qx.event.Timer.$$dbClassInfo = $$dbClassInfo;
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
   * Keyboard input event object.
   *
   * the interface of this class is based on the DOM Level 3 keyboard event
   * interface: http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
   */
  qx.Class.define("qx.event.type.KeyInput", {
    extend: qx.event.type.Dom,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Initialize the fields of the event.
       *
       * @param domEvent {Event} DOM event
       * @param target {Object} The event target
       * @param charCode {Integer} the character code
       * @return {qx.event.type.KeyInput} The initialized key event instance
       */
      init(domEvent, target, charCode) {
        qx.event.type.KeyInput.superclass.prototype.init.call(this, domEvent, target, null, true, true);
        this._charCode = charCode;
        return this;
      },
      // overridden
      clone(embryo) {
        var clone = qx.event.type.KeyInput.superclass.prototype.clone.call(this, embryo);
        clone._charCode = this._charCode;
        return clone;
      },
      /**
       * Unicode number of the pressed character.
       *
       * @return {Integer} Unicode number of the pressed character
       */
      getCharCode() {
        return this._charCode;
      },
      /**
       * Returns the pressed character
       *
       * @return {String} The character
       */
      getChar() {
        return String.fromCharCode(this._charCode);
      }
    }
  });
  qx.event.type.KeyInput.$$dbClassInfo = $$dbClassInfo;
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
      },
      "qx.event.util.Keyboard": {}
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
   * Keyboard event object.
   *
   * the interface of this class is based on the DOM Level 3 keyboard event
   * interface: http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
   */
  qx.Class.define("qx.event.type.KeySequence", {
    extend: qx.event.type.Dom,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Initialize the fields of the event.
       *
       * @param domEvent {Event} DOM event
       * @param target {Object} The event target
       * @param identifier {String} Key identifier
       * @return {qx.event.type.KeySequence} The initialized key event instance
       */
      init(domEvent, target, identifier) {
        qx.event.type.KeySequence.superclass.prototype.init.call(this, domEvent, target, null, true, true);
        this._keyCode = domEvent.keyCode;
        this._identifier = identifier;
        return this;
      },
      // overridden
      clone(embryo) {
        var clone = qx.event.type.KeySequence.superclass.prototype.clone.call(this, embryo);
        clone._keyCode = this._keyCode;
        clone._identifier = this._identifier;
        return clone;
      },
      /**
       * Identifier of the pressed key. This property is modeled after the <em>KeyboardEvent.keyIdentifier</em> property
       * of the W3C DOM 3 event specification
       * (http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-KeyboardEvent-keyIdentifier).
       *
       * Printable keys are represented by an unicode string, non-printable keys
       * have one of the following values:
       *
       * <table>
       * <tr><th>Backspace</th><td>The Backspace (Back) key.</td></tr>
       * <tr><th>Tab</th><td>The Horizontal Tabulation (Tab) key.</td></tr>
       * <tr><th>Space</th><td>The Space (Spacebar) key.</td></tr>
       * <tr><th>Enter</th><td>The Enter key. Note: This key identifier is also used for the Return (Macintosh numpad) key.</td></tr>
       * <tr><th>Shift</th><td>The Shift key.</td></tr>
       * <tr><th>Control</th><td>The Control (Ctrl) key.</td></tr>
       * <tr><th>Alt</th><td>The Alt (Menu) key.</td></tr>
       * <tr><th>CapsLock</th><td>The CapsLock key</td></tr>
       * <tr><th>Meta</th><td>The Meta key. (Apple Meta and Windows key)</td></tr>
       * <tr><th>Escape</th><td>The Escape (Esc) key.</td></tr>
       * <tr><th>Left</th><td>The Left Arrow key.</td></tr>
       * <tr><th>Up</th><td>The Up Arrow key.</td></tr>
       * <tr><th>Right</th><td>The Right Arrow key.</td></tr>
       * <tr><th>Down</th><td>The Down Arrow key.</td></tr>
       * <tr><th>PageUp</th><td>The Page Up key.</td></tr>
       * <tr><th>PageDown</th><td>The Page Down (Next) key.</td></tr>
       * <tr><th>End</th><td>The End key.</td></tr>
       * <tr><th>Home</th><td>The Home key.</td></tr>
       * <tr><th>Insert</th><td>The Insert (Ins) key. (Does not fire in Opera/Win)</td></tr>
       * <tr><th>Delete</th><td>The Delete (Del) Key.</td></tr>
       * <tr><th>F1</th><td>The F1 key.</td></tr>
       * <tr><th>F2</th><td>The F2 key.</td></tr>
       * <tr><th>F3</th><td>The F3 key.</td></tr>
       * <tr><th>F4</th><td>The F4 key.</td></tr>
       * <tr><th>F5</th><td>The F5 key.</td></tr>
       * <tr><th>F6</th><td>The F6 key.</td></tr>
       * <tr><th>F7</th><td>The F7 key.</td></tr>
       * <tr><th>F8</th><td>The F8 key.</td></tr>
       * <tr><th>F9</th><td>The F9 key.</td></tr>
       * <tr><th>F10</th><td>The F10 key.</td></tr>
       * <tr><th>F11</th><td>The F11 key.</td></tr>
       * <tr><th>F12</th><td>The F12 key.</td></tr>
       * <tr><th>NumLock</th><td>The Num Lock key.</td></tr>
       * <tr><th>PrintScreen</th><td>The Print Screen (PrintScrn, SnapShot) key.</td></tr>
       * <tr><th>Scroll</th><td>The scroll lock key</td></tr>
       * <tr><th>Pause</th><td>The pause/break key</td></tr>
       * <tr><th>Win</th><td>The Windows Logo key</td></tr>
       * <tr><th>Apps</th><td>The Application key (Windows Context Menu)</td></tr>
       * </table>
       *
       * @return {String} The key identifier
       */
      getKeyIdentifier() {
        return this._identifier;
      },
      /**
       * Returns the native keyCode and is best used on keydown/keyup events to
       * check which physical key was pressed.
       * Don't use this on keypress events because it's erroneous and
       * inconsistent across browsers. But it can be used to detect which key is
       * exactly pressed (e.g. for num pad keys).
       * In any regular case, you should use {@link #getKeyIdentifier} which
       * takes care of all cross browser stuff.
       *
       * The key codes are not character codes, they are just ASCII codes to
       * identify the keyboard (or other input devices) keys.
       *
       * @return {Number} The key code.
       */
      getKeyCode() {
        return this._keyCode;
      },
      /**
       * Checks whether the pressed key is printable.
       *
       * @return {Boolean} Whether the pressed key is printable.
       */
      isPrintable() {
        return qx.event.util.Keyboard.isPrintableKeyIdentifier(this._identifier);
      }
    }
  });
  qx.event.type.KeySequence.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.OperatingSystem": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "os.name": {
          "load": true,
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
       2004-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Utilities for working with character codes and key identifiers
   */
  qx.Bootstrap.define("qx.event.util.Keyboard", {
    statics: {
      /*
      ---------------------------------------------------------------------------
        KEY MAPS
      ---------------------------------------------------------------------------
      */

      /**
       * @type {Map} maps the charcodes of special printable keys to key identifiers
       *
       * @lint ignoreReferenceField(specialCharCodeMap)
       */
      specialCharCodeMap: {
        8: "Backspace",
        // The Backspace (Back) key.
        9: "Tab",
        // The Horizontal Tabulation (Tab) key.

        //   Note: This key identifier is also used for the
        //   Return (Macintosh numpad) key.
        13: "Enter",
        // The Enter key.
        27: "Escape",
        // The Escape (Esc) key.
        32: "Space" // The Space (Spacebar) key.
      },
      /**
       * @type {Map} maps the keycodes of the numpad keys to the right charcodes
       *
       * @lint ignoreReferenceField(numpadToCharCode)
       */
      numpadToCharCode: {
        96: "0".charCodeAt(0),
        97: "1".charCodeAt(0),
        98: "2".charCodeAt(0),
        99: "3".charCodeAt(0),
        100: "4".charCodeAt(0),
        101: "5".charCodeAt(0),
        102: "6".charCodeAt(0),
        103: "7".charCodeAt(0),
        104: "8".charCodeAt(0),
        105: "9".charCodeAt(0),
        106: "*".charCodeAt(0),
        107: "+".charCodeAt(0),
        109: "-".charCodeAt(0),
        110: ",".charCodeAt(0),
        111: "/".charCodeAt(0)
      },
      /**
       * @type {Map} maps the keycodes of non printable keys to key identifiers
       *
       * @lint ignoreReferenceField(keyCodeToIdentifierMap)
       */
      keyCodeToIdentifierMap: {
        16: "Shift",
        // The Shift key.
        17: "Control",
        // The Control (Ctrl) key.
        18: "Alt",
        // The Alt (Menu) key.
        20: "CapsLock",
        // The CapsLock key
        224: "Meta",
        // The Meta key. (Apple Meta and Windows key)

        37: "Left",
        // The Left Arrow key.
        38: "Up",
        // The Up Arrow key.
        39: "Right",
        // The Right Arrow key.
        40: "Down",
        // The Down Arrow key.

        33: "PageUp",
        // The Page Up key.
        34: "PageDown",
        // The Page Down (Next) key.

        35: "End",
        // The End key.
        36: "Home",
        // The Home key.

        45: "Insert",
        // The Insert (Ins) key. (Does not fire in Opera/Win)
        46: "Delete",
        // The Delete (Del) Key.

        112: "F1",
        // The F1 key.
        113: "F2",
        // The F2 key.
        114: "F3",
        // The F3 key.
        115: "F4",
        // The F4 key.
        116: "F5",
        // The F5 key.
        117: "F6",
        // The F6 key.
        118: "F7",
        // The F7 key.
        119: "F8",
        // The F8 key.
        120: "F9",
        // The F9 key.
        121: "F10",
        // The F10 key.
        122: "F11",
        // The F11 key.
        123: "F12",
        // The F12 key.

        144: "NumLock",
        // The Num Lock key.
        44: "PrintScreen",
        // The Print Screen (PrintScrn, SnapShot) key.
        145: "Scroll",
        // The scroll lock key
        19: "Pause",
        // The pause/break key
        // The left Windows Logo key or left cmd key
        91: qx.core.Environment.get("os.name") == "osx" ? "cmd" : "Win",
        92: "Win",
        // The right Windows Logo key or left cmd key
        // The Application key (Windows Context Menu) or right cmd key
        93: qx.core.Environment.get("os.name") == "osx" ? "cmd" : "Apps"
      },
      /** char code for capital A */
      charCodeA: "A".charCodeAt(0),
      /** char code for capital Z */
      charCodeZ: "Z".charCodeAt(0),
      /** char code for 0 */
      charCode0: "0".charCodeAt(0),
      /** char code for 9 */
      charCode9: "9".charCodeAt(0),
      /**
       * converts a keyboard code to the corresponding identifier
       *
       * @param keyCode {Integer} key code
       * @return {String} key identifier
       */
      keyCodeToIdentifier(keyCode) {
        if (this.isIdentifiableKeyCode(keyCode)) {
          var numPadKeyCode = this.numpadToCharCode[keyCode];
          if (numPadKeyCode) {
            return String.fromCharCode(numPadKeyCode);
          }
          return this.keyCodeToIdentifierMap[keyCode] || this.specialCharCodeMap[keyCode] || String.fromCharCode(keyCode);
        } else {
          return "Unidentified";
        }
      },
      /**
       * converts a character code to the corresponding identifier
       *
       * @param charCode {String} character code
       * @return {String} key identifier
       */
      charCodeToIdentifier(charCode) {
        return this.specialCharCodeMap[charCode] || String.fromCharCode(charCode).toUpperCase();
      },
      /**
       * Check whether the keycode can be reliably detected in keyup/keydown events
       *
       * @param keyCode {String} key code to check.
       * @return {Boolean} Whether the keycode can be reliably detected in keyup/keydown events.
       */
      isIdentifiableKeyCode(keyCode) {
        if (keyCode >= this.charCodeA && keyCode <= this.charCodeZ) {
          return true;
        }

        // 0-9
        if (keyCode >= this.charCode0 && keyCode <= this.charCode9) {
          return true;
        }

        // Enter, Space, Tab, Backspace
        if (this.specialCharCodeMap[keyCode]) {
          return true;
        }

        // Numpad
        if (this.numpadToCharCode[keyCode]) {
          return true;
        }

        // non printable keys
        if (this.isNonPrintableKeyCode(keyCode)) {
          return true;
        }
        return false;
      },
      /**
       * Checks whether the keyCode represents a non printable key
       *
       * @param keyCode {String} key code to check.
       * @return {Boolean} Whether the keyCode represents a non printable key.
       */
      isNonPrintableKeyCode(keyCode) {
        return this.keyCodeToIdentifierMap[keyCode] ? true : false;
      },
      /**
       * Checks whether a given string is a valid keyIdentifier
       *
       * @param keyIdentifier {String} The key identifier.
       * @return {Boolean} whether the given string is a valid keyIdentifier
       */
      isValidKeyIdentifier(keyIdentifier) {
        if (this.identifierToKeyCodeMap[keyIdentifier]) {
          return true;
        }
        if (keyIdentifier.length != 1) {
          return false;
        }
        if (keyIdentifier >= "0" && keyIdentifier <= "9") {
          return true;
        }
        if (keyIdentifier >= "A" && keyIdentifier <= "Z") {
          return true;
        }
        switch (keyIdentifier) {
          case "+":
          case "-":
          case "*":
          case "/":
          case ",":
            return true;
          default:
            return false;
        }
      },
      /**
       * Checks whether a given string is a printable keyIdentifier.
       *
       * @param keyIdentifier {String} The key identifier.
       * @return {Boolean} whether the given string is a printable keyIdentifier.
       */
      isPrintableKeyIdentifier(keyIdentifier) {
        if (keyIdentifier === "Space") {
          return true;
        } else {
          return this.identifierToKeyCodeMap[keyIdentifier] ? false : true;
        }
      }
    },
    defer(statics) {
      // construct inverse of keyCodeToIdentifierMap
      if (!statics.identifierToKeyCodeMap) {
        statics.identifierToKeyCodeMap = {};
        for (var key in statics.keyCodeToIdentifierMap) {
          statics.identifierToKeyCodeMap[statics.keyCodeToIdentifierMap[key]] = parseInt(key, 10);
        }
        for (var key in statics.specialCharCodeMap) {
          statics.identifierToKeyCodeMap[statics.specialCharCodeMap[key]] = parseInt(key, 10);
        }
      }
    }
  });
  qx.event.util.Keyboard.$$dbClassInfo = $$dbClassInfo;
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
      "qx.util.ValueManager": {
        "construct": true,
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.bom.Font": {},
      "qx.lang.Object": {},
      "qx.bom.webfonts.WebFontLoader": {},
      "qx.lang.String": {},
      "qx.bom.webfonts.WebFont": {}
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
   * Manager for font themes
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * @ignore(qx.$$fontBootstrap)
   */
  qx.Class.define("qx.theme.manager.Font", {
    type: "singleton",
    extend: qx.util.ValueManager,
    implement: [qx.core.IDisposable],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.util.ValueManager.constructor.call(this);

      // Grab bootstrap info
      if (qx.$$fontBootstrap) {
        this._manifestFonts = qx.$$fontBootstrap;
        delete qx.$$fontBootstrap;
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** the currently selected font theme */
      theme: {
        check: "Theme",
        nullable: true,
        apply: "_applyTheme",
        event: "changeTheme"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      _manifestFonts: null,
      /**
       * Returns the dynamically interpreted result for the incoming value
       *
       * @param value {String} dynamically interpreted identifier
       * @return {var} return the (translated) result of the incoming value
       */
      resolveDynamic(value) {
        var dynamic = this._dynamic;
        return value instanceof qx.bom.Font ? value : dynamic[value];
      },
      /**
       * Returns the dynamically interpreted result for the incoming value,
       * (if available), otherwise returns the original value
       * @param value {String} Value to resolve
       * @return {var} either returns the (translated) result of the incoming
       * value or the value itself
       */
      resolve(value) {
        var cache = this._dynamic;
        var resolved = cache[value];
        if (resolved) {
          return resolved;
        }

        // If the font instance is not yet cached create a new one to return
        // This is true whenever a runtime include occurred (using "qx.Theme.include"
        // or "qx.Theme.patch"), since these methods only merging the keys of
        // the theme and are not updating the cache
        var theme = this.getTheme();
        if (theme !== null && theme.fonts[value]) {
          let createdFonts = this.__initialiseFonts__P_117_0(theme.fonts);
          let font = createdFonts[value] || null;
          if (font) {
            cache[value] = font;
          }
          return font;
        }
        {
          if (theme) {
            if (!this.__warnedMissingFonts__P_117_1) {
              this.__warnedMissingFonts__P_117_1 = {};
            }
            if (!this.__warnedMissingFonts__P_117_1[value]) {
              this.__warnedMissingFonts__P_117_1[value] = true;
              this.debug(`Cannot resolve a font named ${value} - available fonts are ${Object.keys(theme.fonts).join(", ")}`);
            }
          }
        }
        return value;
      },
      /**
       * Whether a value is interpreted dynamically
       *
       * @param value {String} dynamically interpreted identifier
       * @return {Boolean} returns true if the value is interpreted dynamically
       */
      isDynamic(value) {
        var cache = this._dynamic;
        if (value && (value instanceof qx.bom.Font || cache[value] !== undefined)) {
          return true;
        }

        // If the font instance is not yet cached create a new one to return
        // This is true whenever a runtime include occurred (using "qx.Theme.include"
        // or "qx.Theme.patch"), since these methods only merging the keys of
        // the theme and are not updating the cache
        var theme = this.getTheme();
        if (theme !== null && value && theme.fonts[value]) {
          var fontClass = this.__getFontClass__P_117_2(theme.fonts[value]);
          var font = new fontClass();

          // Inject information about custom charcter set tests before we apply the
          // complete blob in one.
          if (theme.fonts[value].comparisonString) {
            font.setComparisonString(theme.fonts[value].comparisonString);
          }
          cache[value] = font.set(theme.fonts[value]);
          return true;
        }
        return false;
      },
      /**
       * Checks for includes and resolves them recursively
       *
       * @param fonts {Map} all fonts of the theme
       * @param fontName {String} font name to include
       */
      __resolveInclude__P_117_3(fonts, fontName) {
        if (fonts[fontName].include) {
          // get font infos out of the font theme
          var fontToInclude = fonts[fonts[fontName].include];

          // delete 'include' key - not part of the merge
          fonts[fontName].include = null;
          delete fonts[fontName].include;
          fonts[fontName] = qx.lang.Object.mergeWith(fonts[fontName], fontToInclude, false);
          this.__resolveInclude__P_117_3(fonts, fontName);
        }
      },
      /**
       * Initialises fonts from a set of font definitions (eg from a theme Font configuration)
       *
       * @param {Map<String,Object>} fontDefs indexed by font ID
       * @return {Map<String,qx.bom.Font>} created fonts
       */
      __initialiseFonts__P_117_0(fontDefs) {
        let webFontDefs = [];
        let createdFonts = {};
        for (var fontId in fontDefs) {
          let fontDef = fontDefs[fontId];
          if (fontDef.include && fontDefs[fontDef.include]) {
            this.__resolveInclude__P_117_3(fontDefs, fontId);
          }
          if (fontDef.fontName) {
            let preset = this._manifestFonts[fontDef.fontName];
            Object.keys(preset).forEach(presetKey => {
              if (fontDef[presetKey] === undefined) {
                fontDef[presetKey] = preset[presetKey];
              }
            });
          }

          // If the theme font is defining sources, then we want to intercept that and either
          //  fabricate a Manifest font, or if the qx.bom.webfonts.WebFont has already been
          //  created we need to add the font face definition to the existing one
          if (fontDef.sources) {
            // Make sure the font family is specified in the font definition (it was previously allowable to
            //  only specify the font family in the sources object)
            if (fontDef.sources.family && fontDef.family.indexOf(fontDef.sources.family) < 0) {
              fontDef.family.unshift(fontDef.sources.family);
            }
            let family = fontDef.family[0];

            // Make sure that there is a font definition
            if (!fontDefs[family]) {
              fontDefs[family] = {
                fontFaces: []
              };
            }

            // Create a lookup of the fontFaces within the font definition
            let fontFacesLookup = {};
            fontDefs[family].fontFaces.forEach(fontFace => {
              let fontKey = qx.bom.webfonts.WebFontLoader.createFontLookupKey(fontFace.family, fontFace.fontWeight, fontFace.fontStyle);
              fontFacesLookup[fontKey] = fontFace;
            });
            let fontKey = qx.bom.webfonts.WebFontLoader.createFontLookupKey(fontDef.sources.family, fontDef.sources.fontWeight, fontDef.sources.fontStyle);
            if (!fontFacesLookup[fontKey]) {
              let fontFace = {
                fontFamily: fontDef.sources.family,
                fontWeight: fontDef.sources.fontWeight,
                fontStyle: fontDef.sources.fontStyle
              };
              fontDefs[family].fontFaces.push(fontFace);
            }
          }
          if (fontDef.css || fontDef.fontFaces) {
            webFontDefs.push(fontDef);
          }
          var fontClass = this.__getFontClass__P_117_2(fontDef);
          var font = new fontClass();

          // Inject information about custom charcter set tests before we apply the
          // complete blob in one.
          if (fontDef.comparisonString) {
            font.setComparisonString(fontDef.comparisonString);
          }
          createdFonts[fontId] = font;
          qx.Class.getProperties(qx.bom.Font).forEach(propertyName => {
            let value = fontDef[propertyName];
            if (value !== undefined) {
              font["set" + qx.lang.String.firstUp(propertyName)](value);
            }
          });
          createdFonts[fontId].themed = true;
        }

        // Load all of the web fonts
        for (let webFontDef of webFontDefs) {
          let loader = qx.bom.webfonts.WebFontLoader.getLoader(webFontDef.family[0], true);
          ["css", "fontFaces", "comparisonString", "version"].forEach(propertyName => {
            if (webFontDef[propertyName]) {
              loader["set" + qx.lang.String.firstUp(propertyName)](webFontDef[propertyName]);
            }
          });
          loader.load();
        }

        // Initialise the fonts, including those that refer to the loaded web fonts
        for (let fontId in createdFonts) {
          let font = createdFonts[fontId];
          font.loadComplete();
        }
        return createdFonts;
      },
      // apply method
      _applyTheme(value) {
        let createdFonts = this._dynamic = {};
        for (let key in createdFonts) {
          if (createdFonts[key].themed) {
            createdFonts[key].dispose();
            delete createdFonts[key];
          }
        }
        if (value) {
          var fonts = this._manifestFonts ? Object.assign(value.fonts, this._manifestFonts) : value.fonts;
          createdFonts = this.__initialiseFonts__P_117_0(fonts);
        }
        this._setDynamic(createdFonts);
      },
      /**
       * Decides which Font class should be used based on the theme configuration
       *
       * @param config {Map} The font's configuration map
       * @return {Class}
       */
      __getFontClass__P_117_2(config) {
        if (config.fontFaces || config.css) {
          return qx.bom.webfonts.WebFont;
        }
        return qx.bom.Font;
      },
      /**
       * Returns the font information output by the compiler
       * @internal subject to change
       * @return {Object}
       */
      getManifestFonts() {
        return this._manifestFonts;
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._disposeMap("_dynamic");
    }
  });
  qx.theme.manager.Font.$$dbClassInfo = $$dbClassInfo;
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
      "qx.util.AliasManager": {}
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
   * Manager for icon themes
   */
  qx.Class.define("qx.theme.manager.Icon", {
    type: "singleton",
    extend: qx.core.Object,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** currently used icon theme */
      theme: {
        check: "Theme",
        nullable: true,
        apply: "_applyTheme",
        event: "changeTheme"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // property apply
      _applyTheme(value, old) {
        var aliasManager = qx.util.AliasManager.getInstance();
        if (old) {
          for (var alias in old.aliases) {
            aliasManager.remove(alias);
          }
        }
        if (value) {
          for (var alias in value.aliases) {
            aliasManager.add(alias, value.aliases[alias]);
          }
        }
      }
    }
  });
  qx.theme.manager.Icon.$$dbClassInfo = $$dbClassInfo;
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
      "qx.dev.StackTrace": {}
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
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * Theme classes contain styling information for certain aspects of the
   * graphical user interface.
   *
   * Supported themes are: colors, decorations, fonts, icons, appearances.
   * The additional meta theme allows for grouping of the individual
   * themes.
   *
   * For more details, take a look at the
   * <a href='http://qooxdoo.org/docs/#desktop/gui/theming.md' target='_blank'>
   * documentation of the theme system in the qooxdoo manual.</a>
   */
  qx.Bootstrap.define("qx.Theme", {
    statics: {
      /*
      ---------------------------------------------------------------------------
         PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * Theme config
       *
       * Example:
       * <pre class='javascript'>
       * qx.Theme.define("name",
       * {
       *   aliases : {
       *     "aliasKey" : "resourceFolderOrUri"
       *   },
       *   extend : otherTheme,
       *   include : [MMixinTheme],
       *   patch : [MMixinTheme],
       *   colors : {},
       *   decorations : {},
       *   fonts : {},
       *   widgets : {},
       *   appearances : {},
       *   meta : {},
       *   boot : function(){}
       * });
       * </pre>
       *
       * For more details, take a look at the
       * <a href='http://qooxdoo.org/docs/#desktop/gui/theming.md' target='_blank'>
       * documentation of the theme system in the qooxdoo manual.</a>
       *
       * @param name {String} name of the mixin
       * @param config {Map} config structure
       */
      define(name, config) {
        if (!config) {
          var config = {};
        }
        config.include = this.__normalizeArray__P_29_0(config.include);
        config.patch = this.__normalizeArray__P_29_0(config.patch);

        // Validate incoming data
        {
          this.__validateConfig__P_29_1(name, config);
        }

        // Create alias
        var theme = {
          $$type: "Theme",
          name: name,
          title: config.title,
          // Attach toString
          toString: this.genericToString
        };

        // Remember extend
        if (config.extend) {
          theme.supertheme = config.extend;
        }

        // Assign to namespace
        theme.basename = qx.Bootstrap.createNamespace(name, theme);

        // Convert theme entry from Object to Function (for prototype inheritance)
        this.__convert__P_29_2(theme, config);
        this.__initializeAliases__P_29_3(theme, config);

        // Store class reference in global class registry
        this.$$registry[name] = theme;

        // Include mixin themes
        for (var i = 0, a = config.include, l = a.length; i < l; i++) {
          this.include(theme, a[i]);
        }
        for (var i = 0, a = config.patch, l = a.length; i < l; i++) {
          this.patch(theme, a[i]);
        }

        // Run boot code
        if (config.boot) {
          config.boot();
        }
      },
      /**
       * Normalize an object to an array
       *
       * @param objectOrArray {Object|Array} Either an object that is to be
       *   normalized to an array, or an array, which is just passed through
       *
       * @return {Array} Either an array that has the original object as its
       *   single item, or the original array itself
       */
      __normalizeArray__P_29_0(objectOrArray) {
        if (!objectOrArray) {
          return [];
        }
        if (qx.Bootstrap.isArray(objectOrArray)) {
          return objectOrArray;
        } else {
          return [objectOrArray];
        }
      },
      /**
       * Initialize alias inheritance
       *
       * @param theme {Map} The theme
       * @param config {Map} config structure
       */
      __initializeAliases__P_29_3(theme, config) {
        var aliases = config.aliases || {};
        if (config.extend && config.extend.aliases) {
          qx.Bootstrap.objectMergeWith(aliases, config.extend.aliases, false);
        }
        theme.aliases = aliases;
      },
      /**
       * Return a map of all known themes
       *
       * @return {Map} known themes
       */
      getAll() {
        return this.$$registry;
      },
      /**
       * Returns a theme by name
       *
       * @param name {String} theme name to check
       * @return {Object ? void} theme object
       */
      getByName(name) {
        return this.$$registry[name];
      },
      /**
       * Determine if theme exists
       *
       * @param name {String} theme name to check
       * @return {Boolean} true if theme exists
       */
      isDefined(name) {
        return this.getByName(name) !== undefined;
      },
      /**
       * Determine the number of themes which are defined
       *
       * @return {Number} the number of classes
       */
      getTotalNumber() {
        return qx.Bootstrap.objectGetLength(this.$$registry);
      },
      /*
      ---------------------------------------------------------------------------
         PRIVATE/INTERNAL API
      ---------------------------------------------------------------------------
      */

      /**
       * This method will be attached to all themes to return
       * a nice identifier for them.
       *
       * @internal
       * @return {String} The interface identifier
       */
      genericToString() {
        return "[Theme " + this.name + "]";
      },
      /**
       * Extract the inheritable key (could be only one)
       *
       * @param config {Map} The map from where to extract the key
       * @return {String} the key which was found
       */
      __extractType__P_29_4(config) {
        for (var i = 0, keys = this.__inheritableKeys__P_29_5, l = keys.length; i < l; i++) {
          if (config[keys[i]]) {
            return keys[i];
          }
        }
      },
      /**
       * Convert existing entry to a prototype based inheritance function
       *
       * @param theme {Theme} newly created theme object
       * @param config {Map} incoming theme configuration
       */
      __convert__P_29_2(theme, config) {
        var type = this.__extractType__P_29_4(config);

        // Use theme key from extended theme if own one is not available
        if (config.extend && !type) {
          type = config.extend.type;
        }

        // Save theme type
        theme.type = type || "other";

        // Create pseudo class
        var clazz = function () {};

        // Process extend config
        if (config.extend) {
          clazz.prototype = new config.extend.$$clazz();
        }
        var target = clazz.prototype;
        var source = config[type];

        // Copy entries to prototype
        for (var id in source) {
          target[id] = source[id];

          // Appearance themes only:
          // Convert base flag to class reference (needed for mixin support)
          if (target[id].base) {
            {
              if (!config.extend) {
                throw new Error("Found base flag in entry '" + id + "' of theme '" + config.name + "'. Base flags are not allowed for themes without a valid super theme!");
              }
            }
            target[id].base = config.extend;
          }
        }

        // store pseudo class
        theme.$$clazz = clazz;

        // and create instance under the old key
        theme[type] = new clazz();
      },
      /** @type {Map} Internal theme registry */
      $$registry: {},
      /** @type {Array} Keys which support inheritance */
      __inheritableKeys__P_29_5: ["colors", "borders", "decorations", "fonts", "icons", "widgets", "appearances", "meta"],
      /** @type {Map} allowed keys in theme definition */
      __allowedKeys__P_29_6: qx.core.Environment.select("qx.debug", {
        true: {
          title: "string",
          // String
          aliases: "object",
          // Map
          type: "string",
          // String
          extend: "object",
          // Theme
          colors: "object",
          // Map
          borders: "object",
          // Map
          decorations: "object",
          // Map
          fonts: "object",
          // Map
          icons: "object",
          // Map
          widgets: "object",
          // Map
          appearances: "object",
          // Map
          meta: "object",
          // Map
          include: "object",
          // Array
          patch: "object",
          // Array
          boot: "function" // Function
        },
        default: null
      }),
      /** @type {Map} allowed keys inside a meta theme block */
      __metaKeys__P_29_7: qx.core.Environment.select("qx.debug", {
        true: {
          color: "object",
          border: "object",
          decoration: "object",
          font: "object",
          icon: "object",
          appearance: "object",
          widget: "object"
        },
        default: null
      }),
      /**
       * Validates incoming configuration and checks keys and values
       *
       * @signature function(name, config)
       * @param name {String} The name of the class
       * @param config {Map} Configuration map
       * @throws {Error} if the given config is not valid (e.g. wrong key or wrong key value)
       */
      __validateConfig__P_29_1: qx.core.Environment.select("qx.debug", {
        true(name, config) {
          var allowed = this.__allowedKeys__P_29_6;
          for (var key in config) {
            if (allowed[key] === undefined) {
              throw new Error('The configuration key "' + key + '" in theme "' + name + '" is not allowed!');
            }
            if (config[key] == null) {
              throw new Error('Invalid key "' + key + '" in theme "' + name + '"! The value is undefined/null!');
            }
            if (allowed[key] !== null && typeof config[key] !== allowed[key]) {
              throw new Error('Invalid type of key "' + key + '" in theme "' + name + '"! The type of the key must be "' + allowed[key] + '"!');
            }
          }

          // Validate maps
          var maps = ["colors", "borders", "decorations", "fonts", "icons", "widgets", "appearances", "meta"];
          for (var i = 0, l = maps.length; i < l; i++) {
            var key = maps[i];
            if (config[key] !== undefined && (config[key] instanceof Array || config[key] instanceof RegExp || config[key] instanceof Date || config[key].classname !== undefined)) {
              throw new Error('Invalid key "' + key + '" in theme "' + name + '"! The value needs to be a map!');
            }
          }

          // Check conflicts (detect number ...)
          var counter = 0;
          for (var i = 0, l = maps.length; i < l; i++) {
            var key = maps[i];
            if (config[key]) {
              counter++;
            }
            if (counter > 1) {
              throw new Error("You can only define one theme category per file! Invalid theme: " + name);
            }
          }

          // Validate meta
          if (config.meta) {
            var value;
            for (var key in config.meta) {
              value = config.meta[key];
              if (this.__metaKeys__P_29_7[key] === undefined) {
                throw new Error('The key "' + key + '" is not allowed inside a meta theme block.');
              }
              if (typeof value !== this.__metaKeys__P_29_7[key]) {
                throw new Error('The type of the key "' + key + '" inside the meta block is wrong.');
              }
              if (!(typeof value === "object" && value !== null && value.$$type === "Theme")) {
                throw new Error('The content of a meta theme must reference to other themes. The value for "' + key + '" in theme "' + name + '" is invalid: ' + value);
              }
            }
          }

          // Validate extend
          if (config.extend && config.extend.$$type !== "Theme") {
            throw new Error('Invalid extend in theme "' + name + '": ' + config.extend);
          }

          // Validate include
          if (config.include) {
            for (var i = 0, l = config.include.length; i < l; i++) {
              if (typeof config.include[i] == "undefined" || config.include[i].$$type !== "Theme") {
                throw new Error('Invalid include in theme "' + name + '": ' + config.include[i]);
              }
            }
          }

          // Validate patch
          if (config.patch) {
            for (var i = 0, l = config.patch.length; i < l; i++) {
              if (typeof config.patch[i] === "undefined" || config.patch[i].$$type !== "Theme") {
                throw new Error('Invalid patch in theme "' + name + '": ' + config.patch[i]);
              }
            }
          }
        },
        default() {}
      }),
      /**
       * Include all keys of the given mixin theme into the theme. The mixin may
       * include keys which are already defined in the target theme. Existing
       * features of equal name will be overwritten.
       *
       * @param theme {Theme} An existing theme which should be modified by including the mixin theme.
       * @param mixinTheme {Theme} The theme to be included.
       */
      patch(theme, mixinTheme) {
        this.__checkForInvalidTheme__P_29_8(mixinTheme);
        var type = this.__extractType__P_29_4(mixinTheme);
        if (type !== this.__extractType__P_29_4(theme)) {
          throw new Error("The mixins '" + theme.name + "' are not compatible '" + mixinTheme.name + "'!");
        }
        var source = mixinTheme[type];
        var target = theme.$$clazz.prototype;
        for (var key in source) {
          target[key] = source[key];
        }
      },
      /**
       * Include all keys of the given mixin theme into the theme. If the
       * mixin includes any keys that are already available in the
       * class, they will be silently ignored. Use the {@link #patch} method
       * if you need to overwrite keys in the current class.
       *
       * @param theme {Theme} An existing theme which should be modified by including the mixin theme.
       * @param mixinTheme {Theme} The theme to be included.
       */
      include(theme, mixinTheme) {
        this.__checkForInvalidTheme__P_29_8(mixinTheme);
        var type = mixinTheme.type;
        if (type !== theme.type) {
          throw new Error("The mixins '" + theme.name + "' are not compatible '" + mixinTheme.name + "'!");
        }
        var source = mixinTheme[type];
        var target = theme.$$clazz.prototype;
        for (var key in source) {
          //Skip keys already present
          if (target[key] !== undefined) {
            continue;
          }
          target[key] = source[key];
        }
      },
      /**
       * Helper method to check for an invalid theme
       *
       * @param mixinTheme {qx.Theme?null} theme to check
       * @throws {Error} if the theme is not valid
       */
      __checkForInvalidTheme__P_29_8(mixinTheme) {
        if (typeof mixinTheme === "undefined" || mixinTheme == null) {
          var errorObj = new Error("Mixin theme is not a valid theme!");
          {
            var stackTrace = qx.dev.StackTrace.getStackTraceFromError(errorObj);
            qx.Bootstrap.error(this, stackTrace);
          }
          throw errorObj;
        }
      }
    }
  });
  qx.Theme.$$dbClassInfo = $$dbClassInfo;
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
      __timer__P_193_0: null,
      // property apply
      _applyTimeoutInterval(value) {
        if (this.__timer__P_193_0) {
          this.__timer__P_193_0.setInterval(value);
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
      __startTimer__P_193_1() {
        if (!this.__timer__P_193_0 && this.hasListener("interval")) {
          var timer = new qx.event.Timer(this.getTimeoutInterval());
          timer.addListener("interval", this._onInterval, this);
          timer.start();
          this.__timer__P_193_0 = timer;
        }
      },
      /**
       * Stops the timer but only if there are no listeners for the interval event
       */
      __stopTimer__P_193_2() {
        if (this.__timer__P_193_0 && !this.hasListener("interval")) {
          this.__timer__P_193_0.stop();
          this.__timer__P_193_0.dispose();
          this.__timer__P_193_0 = null;
        }
      },
      /*
       * @Override
       */
      addListener(type, listener, self, capture) {
        var result = qx.event.Idle.superclass.prototype.addListener.call(this, type, listener, self, capture);
        this.__startTimer__P_193_1();
        return result;
      },
      /*
       * @Override
       */
      addListenerOnce(type, listener, self, capture) {
        var result = qx.event.Idle.superclass.prototype.addListenerOnce.call(this, type, listener, self, capture);
        this.__startTimer__P_193_1();
        return result;
      },
      /*
       * @Override
       */
      removeListener(type, listener, self, capture) {
        var result = qx.event.Idle.superclass.prototype.removeListener.call(this, type, listener, self, capture);
        this.__stopTimer__P_193_2();
        return result;
      },
      /*
       * @Override
       */
      removeListenerById(id) {
        var result = qx.event.Idle.superclass.prototype.removeListenerById.call(this, id);
        this.__stopTimer__P_193_2();
        return result;
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      if (this.__timer__P_193_0) {
        this.__timer__P_193_0.stop();
      }
      this.__timer__P_193_0 = null;
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
      this.__defaultAxis__P_194_0 = qx.util.placement.DirectAxis;
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
      __instance__P_194_1: null,
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
        this.__instance__P_194_1 = this.__instance__P_194_1 || new qx.util.placement.Placement();
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
        this.__instance__P_194_1.set({
          axisX: this.__getAxis__P_194_2(modeX),
          axisY: this.__getAxis__P_194_2(modeY),
          edge: edge,
          align: align
        });
        return this.__instance__P_194_1.compute(size, area, target, offsets);
      },
      __direct__P_194_3: null,
      __keepAlign__P_194_4: null,
      __bestFit__P_194_5: null,
      /**
       * Get the axis implementation for the given mode
       *
       * @param mode {String} One of <code>direct</code>, <code>keep-align</code> or
       *   <code>best-fit</code>
       * @return {qx.util.placement.AbstractAxis}
       */
      __getAxis__P_194_2(mode) {
        switch (mode) {
          case "direct":
            this.__direct__P_194_3 = this.__direct__P_194_3 || qx.util.placement.DirectAxis;
            return this.__direct__P_194_3;
          case "keep-align":
            this.__keepAlign__P_194_4 = this.__keepAlign__P_194_4 || qx.util.placement.KeepAlignAxis;
            return this.__keepAlign__P_194_4;
          case "best-fit":
            this.__bestFit__P_194_5 = this.__bestFit__P_194_5 || qx.util.placement.BestFitAxis;
            return this.__bestFit__P_194_5;
          default:
            throw new Error("Invalid 'mode' argument!'");
        }
      }
    },
    members: {
      __defaultAxis__P_194_0: null,
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
        var axisX = this.getAxisX() || this.__defaultAxis__P_194_0;
        var left = axisX.computeStart(size.width, {
          start: target.left,
          end: target.right
        }, {
          start: offsets.left,
          end: offsets.right
        }, area.width, this.__getPositionX__P_194_6());
        var axisY = this.getAxisY() || this.__defaultAxis__P_194_0;
        var top = axisY.computeStart(size.height, {
          start: target.top,
          end: target.bottom
        }, {
          start: offsets.top,
          end: offsets.bottom
        }, area.height, this.__getPositionY__P_194_7());
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
      __getPositionX__P_194_6() {
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
      __getPositionY__P_194_7() {
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
      this._disposeObjects("__defaultAxis__P_194_0");
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
      this.__objects__P_210_0 = [];

      // Register pointerdown handler
      qx.event.Registration.addListener(document.documentElement, "pointerdown", this.__onPointerDown__P_210_1, this, true);

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
      __objects__P_210_0: null,
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
        this.__objects__P_210_0.push(obj);
        this.__updateIndexes__P_210_2();
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
        qx.lang.Array.remove(this.__objects__P_210_0, obj);
        this.__updateIndexes__P_210_2();
      },
      /**
       * Excludes all currently open popups,
       * except those with {@link qx.ui.popup.Popup#autoHide} set to false.
       */
      hideAll() {
        var l = this.__objects__P_210_0.length,
          current = {};
        while (l--) {
          current = this.__objects__P_210_0[l];
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
      __updateIndexes__P_210_2() {
        var min = 1e7;
        for (var i = 0; i < this.__objects__P_210_0.length; i++) {
          this.__objects__P_210_0[i].setZIndex(min++);
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
      __onPointerDown__P_210_1(e) {
        // Get the corresponding widget of the target since we are dealing with
        // DOM elements here. This is necessary because we have to be aware of
        // Inline applications which are not covering the whole document and
        // therefore are not able to get all pointer events when only the
        // application root is monitored.
        var target = qx.ui.core.Widget.getWidgetByElement(e.getTarget());
        var reg = this.__objects__P_210_0;
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
      qx.event.Registration.removeListener(document.documentElement, "pointerdown", this.__onPointerDown__P_210_1, this, true);
      this._disposeArray("__objects__P_210_0");
    }
  });
  qx.ui.popup.Manager.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.layout.Util": {},
      "qx.theme.manager.Decoration": {}
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
   * A horizontal box layout.
   *
   * The horizontal box layout lays out widgets in a horizontal row, from left
   * to right.
   *
   * *Features*
   *
   * * Minimum and maximum dimensions
   * * Prioritized growing/shrinking (flex)
   * * Margins (with horizontal collapsing)
   * * Auto sizing (ignoring percent values)
   * * Percent widths (not relevant for size hint)
   * * Alignment (child property {@link qx.ui.core.LayoutItem#alignX} is ignored)
   * * Horizontal spacing (collapsed with margins)
   * * Reversed children layout (from last to first)
   * * Vertical children stretching (respecting size hints)
   *
   * *Item Properties*
   *
   * <ul>
   * <li><strong>flex</strong> <em>(Integer)</em>: The flexibility of a layout item determines how the container
   *   distributes remaining empty space among its children. If items are made
   *   flexible, they can grow or shrink accordingly. Their relative flex values
   *   determine how the items are being resized, i.e. the larger the flex ratio
   *   of two items, the larger the resizing of the first item compared to the
   *   second.
   *
   *   If there is only one flex item in a layout container, its actual flex
   *   value is not relevant. To disallow items to become flexible, set the
   *   flex value to zero.
   * </li>
   * <li><strong>flexShrink</strong> <em>(Boolean)</em>: Only valid if `flex` is
   *    set to a non-zero value, `flexShrink` tells the layout to force the child
   *    widget to shink if there is not enough space available for all of the children.
   *    This is used in scenarios such as when the child insists that it has a `minWidth`
   *    but there simply is not enough space to support that minimum width, so the
   *    overflow has to be cut off.  This setting allows the container to pick
   *    which children are able to have their `minWidth` sacrificed.  Without this
   *    setting, one oversized child can force later children out of view, regardless
   *    of `flex` settings
   * </li>
   * <li><strong>width</strong> <em>(String)</em>: Allows to define a percent
   *   width for the item. The width in percent, if specified, is used instead
   *   of the width defined by the size hint. The minimum and maximum width still
   *   takes care of the element's limits. It has no influence on the layout's
   *   size hint. Percent values are mostly useful for widgets which are sized by
   *   the outer hierarchy.
   * </li>
   * </ul>
   *
   * *Example*
   *
   * Here is a little example of how to use the HBox layout.
   *
   * <pre class="javascript">
   * var layout = new qx.ui.layout.HBox();
   * layout.setSpacing(4); // apply spacing
   *
   * var container = new qx.ui.container.Composite(layout);
   *
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * </pre>
   *
   * *External Documentation*
   *
   * See <a href='https://qooxdoo.org/documentation/#/desktop/layout/box.md'>extended documentation</a>
   * and links to demos for this layout.
   *
   */
  qx.Class.define("qx.ui.layout.HBox", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param spacing {Integer?0} The spacing between child widgets {@link #spacing}.
     * @param alignX {String?"left"} Horizontal alignment of the whole children
     *     block {@link #alignX}.
     * @param separator {String|qx.ui.decoration.IDecorator?} A separator to render between the items
     */
    construct(spacing, alignX, separator) {
      qx.ui.layout.Abstract.constructor.call(this);
      if (spacing) {
        this.setSpacing(spacing);
      }
      if (alignX) {
        this.setAlignX(alignX);
      }
      if (separator) {
        this.setSeparator(separator);
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Horizontal alignment of the whole children block. The horizontal
       * alignment of the child is completely ignored in HBoxes (
       * {@link qx.ui.core.LayoutItem#alignX}).
       */
      alignX: {
        check: ["left", "center", "right"],
        init: "left",
        apply: "_applyLayoutChange"
      },
      /**
       * Vertical alignment of each child. Can be overridden through
       * {@link qx.ui.core.LayoutItem#alignY}.
       */
      alignY: {
        check: ["top", "middle", "bottom"],
        init: "top",
        apply: "_applyLayoutChange"
      },
      /** Horizontal spacing between two children */
      spacing: {
        check: "Integer",
        init: 0,
        apply: "_applyLayoutChange"
      },
      /** Separator lines to use between the objects */
      separator: {
        check: "Decorator",
        nullable: true,
        apply: "_applyLayoutChange"
      },
      /** Whether the actual children list should be laid out in reversed order. */
      reversed: {
        check: "Boolean",
        init: false,
        apply: "_applyReversed"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __widths__P_176_0: null,
      __flexs__P_176_1: null,
      __enableFlex__P_176_2: null,
      __children__P_176_3: null,
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyReversed() {
        // easiest way is to invalidate the cache
        this._invalidChildrenCache = true;

        // call normal layout change
        this._applyLayoutChange();
      },
      /**
       * Rebuilds caches for flex and percent layout properties
       */
      __rebuildCache__P_176_4() {
        var children = this._getLayoutChildren();
        var length = children.length;
        var enableFlex = false;
        var reuse = this.__widths__P_176_0 && this.__widths__P_176_0.length != length && this.__flexs__P_176_1 && this.__widths__P_176_0;
        var props;

        // Sparse array (keep old one if lengths has not been modified)
        var widths = reuse ? this.__widths__P_176_0 : new Array(length);
        var flexs = reuse ? this.__flexs__P_176_1 : new Array(length);

        // Reverse support
        if (this.getReversed()) {
          children = children.concat().reverse();
        }

        // Loop through children to preparse values
        for (var i = 0; i < length; i++) {
          props = children[i].getLayoutProperties();
          if (props.width != null) {
            widths[i] = parseFloat(props.width) / 100;
          }
          if (props.flex != null) {
            flexs[i] = props.flex;
            enableFlex = true;
          } else {
            // reset (in case the index of the children changed: BUG #3131)
            flexs[i] = 0;
          }
        }

        // Store data
        if (!reuse) {
          this.__widths__P_176_0 = widths;
          this.__flexs__P_176_1 = flexs;
        }
        this.__enableFlex__P_176_2 = enableFlex;
        this.__children__P_176_3 = children;

        // Clear invalidation marker
        delete this._invalidChildrenCache;
      },
      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          if (name === "width") {
            this.assertMatch(value, qx.ui.layout.Util.PERCENT_VALUE);
          } else if (name === "flex") {
            this.assertNumber(value);
            this.assert(value >= 0);
          } else if (name === "flexShrink") {
            this.assertBoolean(value);
          } else {
            this.assert(false, "The property '" + name + "' is not supported by the HBox layout!");
          }
        },
        false: null
      }),
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        // Rebuild flex/width caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_176_4();
        }

        // Cache children
        var children = this.__children__P_176_3;
        var length = children.length;
        var util = qx.ui.layout.Util;

        // Compute gaps
        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;
        if (separator) {
          gaps = util.computeHorizontalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeHorizontalGaps(children, spacing, true);
        }

        // First run to cache children data and compute allocated width
        var i, child, width, percent;
        var widths = [],
          hint;
        var allocatedWidth = gaps;
        for (i = 0; i < length; i += 1) {
          percent = this.__widths__P_176_0[i];
          hint = children[i].getSizeHint();
          width = percent != null ? Math.floor((availWidth - gaps) * percent) : hint.width;

          // Limit computed value
          if (width < hint.minWidth) {
            width = hint.minWidth;
          } else if (width > hint.maxWidth) {
            width = hint.maxWidth;
          }
          widths.push(width);
          allocatedWidth += width;
        }

        // Flex support (growing/shrinking)
        if (this.__enableFlex__P_176_2 && allocatedWidth != availWidth) {
          var flexibles = {};
          var flex, offset;
          var notEnoughSpace = allocatedWidth > availWidth;
          for (i = 0; i < length; i += 1) {
            flex = this.__flexs__P_176_1[i];
            if (flex > 0) {
              hint = children[i].getSizeHint();
              flexibles[i] = {
                min: hint.minWidth,
                value: widths[i],
                max: hint.maxWidth,
                flex: flex
              };
              if (notEnoughSpace) {
                var props = children[i].getLayoutProperties();
                if (props && props.flexShrink) {
                  flexibles[i].min = 0;
                }
              }
            }
          }
          var result = util.computeFlexOffsets(flexibles, availWidth, allocatedWidth);
          for (i in result) {
            offset = result[i].offset;
            widths[i] += offset;
            allocatedWidth += offset;
          }
        }

        // Start with left coordinate
        var left = children[0].getMarginLeft();

        // Alignment support
        if (allocatedWidth < availWidth && this.getAlignX() != "left") {
          left = availWidth - allocatedWidth;
          if (this.getAlignX() === "center") {
            left = Math.round(left / 2);
          }
        }

        // Layouting children
        var hint, top, height, width, marginRight, marginTop, marginBottom;
        var spacing = this.getSpacing();

        // Pre configure separators
        this._clearSeparators();

        // Compute separator width
        if (separator) {
          var separatorInsets = qx.theme.manager.Decoration.getInstance().resolve(separator).getInsets();
          var separatorWidth = separatorInsets.left + separatorInsets.right;
        }

        // Render children and separators
        for (i = 0; i < length; i += 1) {
          child = children[i];
          width = widths[i];
          hint = child.getSizeHint();
          marginTop = child.getMarginTop();
          marginBottom = child.getMarginBottom();

          // Find usable height
          height = Math.max(hint.minHeight, Math.min(availHeight - marginTop - marginBottom, hint.maxHeight));

          // Respect vertical alignment
          top = util.computeVerticalAlignOffset(child.getAlignY() || this.getAlignY(), height, availHeight, marginTop, marginBottom);

          // Add collapsed margin
          if (i > 0) {
            // Whether a separator has been configured
            if (separator) {
              // add margin of last child and spacing
              left += marginRight + spacing;

              // then render the separator at this position
              this._renderSeparator(separator, {
                left: left + padding.left,
                top: padding.top,
                width: separatorWidth,
                height: availHeight
              });

              // and finally add the size of the separator, the spacing (again) and the left margin
              left += separatorWidth + spacing + child.getMarginLeft();
            } else {
              // Support margin collapsing when no separator is defined
              left += util.collapseMargins(spacing, marginRight, child.getMarginLeft());
            }
          }

          // Layout child
          child.renderLayout(left + padding.left, top + padding.top, width, height);

          // Add width
          left += width;

          // Remember right margin (for collapsing)
          marginRight = child.getMarginRight();
        }
      },
      // overridden
      _computeSizeHint() {
        // Rebuild flex/width caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_176_4();
        }
        var util = qx.ui.layout.Util;
        var children = this.__children__P_176_3;

        // Initialize
        var minWidth = 0,
          width = 0,
          percentMinWidth = 0;
        var minHeight = 0,
          height = 0;
        var child, hint, margin;

        // Iterate over children
        for (var i = 0, l = children.length; i < l; i += 1) {
          child = children[i];
          hint = child.getSizeHint();

          // Sum up widths
          width += hint.width;

          // Detect if child is shrinkable or has percent width and update minWidth
          var flex = this.__flexs__P_176_1[i];
          var percent = this.__widths__P_176_0[i];
          if (flex) {
            minWidth += hint.minWidth;
          } else if (percent) {
            percentMinWidth = Math.max(percentMinWidth, Math.round(hint.minWidth / percent));
          } else {
            minWidth += hint.width;
          }

          // Build vertical margin sum
          margin = child.getMarginTop() + child.getMarginBottom();

          // Find biggest height
          if (hint.height + margin > height) {
            height = hint.height + margin;
          }

          // Find biggest minHeight
          if (hint.minHeight + margin > minHeight) {
            minHeight = hint.minHeight + margin;
          }
        }
        minWidth += percentMinWidth;

        // Respect gaps
        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;
        if (separator) {
          gaps = util.computeHorizontalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeHorizontalGaps(children, spacing, true);
        }

        // Return hint
        return {
          minWidth: minWidth + gaps,
          width: width + gaps,
          minHeight: minHeight,
          height: height
        };
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this.__widths__P_176_0 = this.__flexs__P_176_1 = this.__children__P_176_3 = null;
    }
  });
  qx.ui.layout.HBox.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.layout.Atom": {
        "construct": true
      },
      "qx.ui.basic.Label": {},
      "qx.ui.basic.Image": {},
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
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A multi-purpose widget, which combines a label with an icon.
   *
   * The intended purpose of qx.ui.basic.Atom is to easily align the common icon-text
   * combination in different ways.
   *
   * This is useful for all types of buttons, tooltips, ...
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   var atom = new qx.ui.basic.Atom("Icon Right", "icon/32/actions/go-next.png");
   *   this.getRoot().add(atom);
   * </pre>
   *
   * This example creates an atom with the label "Icon Right" and an icon.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/atom.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   *
   *
   * @childControl label {qx.ui.basic.Label} label part of the atom
   * @childControl icon {qx.ui.basic.Image} icon part of the atom
   */
  qx.Class.define("qx.ui.basic.Atom", {
    extend: qx.ui.core.Widget,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param label {String} Label to use
     * @param icon {String?null} Icon to use
     */
    construct(label, icon) {
      {
        this.assertArgumentsCount(arguments, 0, 2);
      }
      qx.ui.core.Widget.constructor.call(this);
      this._setLayout(new qx.ui.layout.Atom());
      if (label != null) {
        this.setLabel(label);
      }
      if (icon !== undefined) {
        this.setIcon(icon);
      }
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
        init: "atom"
      },
      /** The label/caption/text of the qx.ui.basic.Atom instance */
      label: {
        apply: "_applyLabel",
        nullable: true,
        check: "String",
        event: "changeLabel"
      },
      /**
       * Switches between rich HTML and text content. The text mode (<code>false</code>) supports
       * advanced features like ellipsis when the available space is not
       * enough. HTML mode (<code>true</code>) supports multi-line content and all the
       * markup features of HTML content.
       */
      rich: {
        check: "Boolean",
        init: false,
        apply: "_applyRich"
      },
      /** Any URI String supported by qx.ui.basic.Image to display an icon */
      icon: {
        check: "String",
        apply: "_applyIcon",
        nullable: true,
        themeable: true,
        event: "changeIcon"
      },
      /**
       * The space between the icon and the label
       */
      gap: {
        check: "Integer",
        nullable: false,
        event: "changeGap",
        apply: "_applyGap",
        themeable: true,
        init: 4
      },
      /**
       * Configure the visibility of the sub elements/widgets.
       * Possible values: both, label, icon
       */
      show: {
        init: "both",
        check: ["both", "label", "icon"],
        themeable: true,
        inheritable: true,
        apply: "_applyShow",
        event: "changeShow"
      },
      /**
       * The position of the icon in relation to the text.
       * Only useful/needed if text and icon is configured and 'show' is configured as 'both' (default)
       */
      iconPosition: {
        init: "left",
        check: ["top", "right", "bottom", "left", "top-left", "bottom-left", "top-right", "bottom-right"],
        themeable: true,
        apply: "_applyIconPosition"
      },
      /**
       * Whether the content should be rendered centrally when to much space
       * is available. Enabling this property centers in both axis. The behavior
       * when disabled of the centering depends on the {@link #iconPosition} property.
       * If the icon position is <code>left</code> or <code>right</code>, the X axis
       * is not centered, only the Y axis. If the icon position is <code>top</code>
       * or <code>bottom</code>, the Y axis is not centered. In case of e.g. an
       * icon position of <code>top-left</code> no axis is centered.
       */
      center: {
        init: false,
        check: "Boolean",
        themeable: true,
        apply: "_applyCenter"
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
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "label":
            control = new qx.ui.basic.Label(this.getLabel());
            control.setAnonymous(true);
            control.setRich(this.getRich());
            control.setSelectable(this.getSelectable());
            this._add(control);
            if (this.getLabel() == null || this.getShow() === "icon") {
              control.exclude();
            }
            break;
          case "icon":
            control = new qx.ui.basic.Image(this.getIcon());
            control.setAnonymous(true);
            this._addAt(control, 0);
            if (this.getIcon() == null || this.getShow() === "label") {
              control.exclude();
            }
            break;
        }
        return control || qx.ui.basic.Atom.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        focused: true,
        hovered: true
      },
      /**
       * Updates the visibility of the label
       */
      _handleLabel() {
        if (this.getLabel() == null || this.getShow() === "icon") {
          this._excludeChildControl("label");
        } else {
          this._showChildControl("label");
        }
      },
      /**
       * Updates the visibility of the icon
       */
      _handleIcon() {
        if (this.getIcon() == null || this.getShow() === "label") {
          this._excludeChildControl("icon");
        } else {
          this._showChildControl("icon");
        }
      },
      // property apply
      _applyLabel(value, old) {
        var label = this.getChildControl("label", true);
        if (label) {
          label.setValue(value);
        }
        this._handleLabel();
      },
      // property apply
      _applyRich(value, old) {
        var label = this.getChildControl("label", true);
        if (label) {
          label.setRich(value);
        }
      },
      // property apply
      _applyIcon(value, old) {
        var icon = this.getChildControl("icon", true);
        if (icon) {
          icon.setSource(value);
        }
        this._handleIcon();
      },
      // property apply
      _applyShow(value, old) {
        this._handleLabel();
        this._handleIcon();
      },
      __safeSetPropertyOnLayout__P_151_0(value, propertyName) {
        const layout = this._getLayout();
        const propertySetter = `set${qx.lang.String.firstUp(propertyName)}`;
        if (layout[propertySetter]) {
          layout[propertySetter](value);
        } else {
          this.warn(`The \`${propertyName}\` property of a ${this.classname} was set, but the layout ${this._getLayout().classname} does not support a \`${propertyName}\` property.`);
        }
      },
      // property apply
      _applyGap(value) {
        this.__safeSetPropertyOnLayout__P_151_0(value, "gap");
      },
      // property apply
      _applyIconPosition(value) {
        this.__safeSetPropertyOnLayout__P_151_0(value, "iconPosition");
      },
      // property apply
      _applyCenter(value) {
        this.__safeSetPropertyOnLayout__P_151_0(value, "center");
      },
      // overridden
      _applySelectable(value, old) {
        qx.ui.basic.Atom.superclass.prototype._applySelectable.call(this, value, old);
        var label = this.getChildControl("label", true);
        if (label) {
          this.getChildControl("label").setSelectable(value);
        }
      }
    }
  });
  qx.ui.basic.Atom.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.layout.Util": {},
      "qx.theme.manager.Decoration": {}
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
   * A vertical box layout.
   *
   * The vertical box layout lays out widgets in a vertical column, from top
   * to bottom.
   *
   * *Features*
   *
   * * Minimum and maximum dimensions
   * * Prioritized growing/shrinking (flex)
   * * Margins (with vertical collapsing)
   * * Auto sizing (ignoring percent values)
   * * Percent heights (not relevant for size hint)
   * * Alignment (child property {@link qx.ui.core.LayoutItem#alignY} is ignored)
   * * Vertical spacing (collapsed with margins)
   * * Reversed children layout (from last to first)
   * * Horizontal children stretching (respecting size hints)
   *
   * *Item Properties*
   *
   * <ul>
   * <li><strong>flex</strong> <em>(Integer)</em>: The flexibility of a layout item determines how the container
   *   distributes remaining empty space among its children. If items are made
   *   flexible, they can grow or shrink accordingly. Their relative flex values
   *   determine how the items are being resized, i.e. the larger the flex ratio
   *   of two items, the larger the resizing of the first item compared to the
   *   second.
   *
   *   If there is only one flex item in a layout container, its actual flex
   *   value is not relevant. To disallow items to become flexible, set the
   *   flex value to zero.
   * </li>
   * <li><strong>height</strong> <em>(String)</em>: Allows to define a percent
   *   height for the item. The height in percent, if specified, is used instead
   *   of the height defined by the size hint. The minimum and maximum height still
   *   takes care of the element's limits. It has no influence on the layout's
   *   size hint. Percent values are mostly useful for widgets which are sized by
   *   the outer hierarchy.
   * </li>
   * </ul>
   *
   * *Example*
   *
   * Here is a little example of how to use the vertical box layout.
   *
   * <pre class="javascript">
   * var layout = new qx.ui.layout.VBox();
   * layout.setSpacing(4); // apply spacing
   *
   * var container = new qx.ui.container.Composite(layout);
   *
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * </pre>
   *
   * *External Documentation*
   *
   * See <a href='https://qooxdoo.org/documentation/#/desktop/layout/box.md'>extended documentation</a>
   * and links to demos for this layout.
   *
   */
  qx.Class.define("qx.ui.layout.VBox", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param spacing {Integer?0} The spacing between child widgets {@link #spacing}.
     * @param alignY {String?"top"} Vertical alignment of the whole children
     *     block {@link #alignY}.
     * @param separator {String|qx.ui.decoration.IDecorator?} A separator to be rendered between the items
     */
    construct(spacing, alignY, separator) {
      qx.ui.layout.Abstract.constructor.call(this);
      if (spacing) {
        this.setSpacing(spacing);
      }
      if (alignY) {
        this.setAlignY(alignY);
      }
      if (separator) {
        this.setSeparator(separator);
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Vertical alignment of the whole children block. The vertical
       * alignment of the child is completely ignored in VBoxes (
       * {@link qx.ui.core.LayoutItem#alignY}).
       */
      alignY: {
        check: ["top", "middle", "bottom"],
        init: "top",
        apply: "_applyLayoutChange"
      },
      /**
       * Horizontal alignment of each child. Can be overridden through
       * {@link qx.ui.core.LayoutItem#alignX}.
       */
      alignX: {
        check: ["left", "center", "right"],
        init: "left",
        apply: "_applyLayoutChange"
      },
      /** Vertical spacing between two children */
      spacing: {
        check: "Integer",
        init: 0,
        apply: "_applyLayoutChange"
      },
      /** Separator lines to use between the objects */
      separator: {
        check: "Decorator",
        nullable: true,
        apply: "_applyLayoutChange"
      },
      /** Whether the actual children list should be laid out in reversed order. */
      reversed: {
        check: "Boolean",
        init: false,
        apply: "_applyReversed"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __heights__P_195_0: null,
      __flexs__P_195_1: null,
      __enableFlex__P_195_2: null,
      __children__P_195_3: null,
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyReversed() {
        // easiest way is to invalidate the cache
        this._invalidChildrenCache = true;

        // call normal layout change
        this._applyLayoutChange();
      },
      /**
       * Rebuilds caches for flex and percent layout properties
       */
      __rebuildCache__P_195_4() {
        var children = this._getLayoutChildren();
        var length = children.length;
        var enableFlex = false;
        var reuse = this.__heights__P_195_0 && this.__heights__P_195_0.length != length && this.__flexs__P_195_1 && this.__heights__P_195_0;
        var props;

        // Sparse array (keep old one if lengths has not been modified)
        var heights = reuse ? this.__heights__P_195_0 : new Array(length);
        var flexs = reuse ? this.__flexs__P_195_1 : new Array(length);

        // Reverse support
        if (this.getReversed()) {
          children = children.concat().reverse();
        }

        // Loop through children to preparse values
        for (var i = 0; i < length; i++) {
          props = children[i].getLayoutProperties();
          if (props.height != null) {
            heights[i] = parseFloat(props.height) / 100;
          }
          if (props.flex != null) {
            flexs[i] = props.flex;
            enableFlex = true;
          } else {
            // reset (in case the index of the children changed: BUG #3131)
            flexs[i] = 0;
          }
        }

        // Store data
        if (!reuse) {
          this.__heights__P_195_0 = heights;
          this.__flexs__P_195_1 = flexs;
        }
        this.__enableFlex__P_195_2 = enableFlex;
        this.__children__P_195_3 = children;

        // Clear invalidation marker
        delete this._invalidChildrenCache;
      },
      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          if (name == "height") {
            this.assertMatch(value, qx.ui.layout.Util.PERCENT_VALUE);
          } else if (name == "flex") {
            // flex
            this.assertNumber(value);
            this.assert(value >= 0);
          } else if (name == "flexShrink") {
            this.assertBoolean(value);
          } else {
            this.assert(false, "The property '" + name + "' is not supported by the VBox layout!");
          }
        },
        false: null
      }),
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        // Rebuild flex/height caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_195_4();
        }

        // Cache children
        var children = this.__children__P_195_3;
        var length = children.length;
        var util = qx.ui.layout.Util;

        // Compute gaps
        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;
        if (separator) {
          gaps = util.computeVerticalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeVerticalGaps(children, spacing, true);
        }

        // First run to cache children data and compute allocated height
        var i, child, height, percent;
        var heights = [],
          hint;
        var allocatedHeight = gaps;
        for (i = 0; i < length; i += 1) {
          percent = this.__heights__P_195_0[i];
          hint = children[i].getSizeHint();
          height = percent != null ? Math.floor((availHeight - gaps) * percent) : hint.height;

          // Limit computed value
          if (height < hint.minHeight) {
            height = hint.minHeight;
          } else if (height > hint.maxHeight) {
            height = hint.maxHeight;
          }
          heights.push(height);
          allocatedHeight += height;
        }

        // Flex support (growing/shrinking)
        if (this.__enableFlex__P_195_2 && allocatedHeight != availHeight) {
          var flexibles = {};
          var flex, offset;
          var notEnoughSpace = allocatedHeight > availHeight;
          for (i = 0; i < length; i += 1) {
            flex = this.__flexs__P_195_1[i];
            if (flex > 0) {
              hint = children[i].getSizeHint();
              flexibles[i] = {
                min: hint.minHeight,
                value: heights[i],
                max: hint.maxHeight,
                flex: flex
              };
              if (notEnoughSpace) {
                var props = children[i].getLayoutProperties();
                if (props && props.flexShrink) {
                  flexibles[i].min = 0;
                }
              }
            }
          }
          var result = util.computeFlexOffsets(flexibles, availHeight, allocatedHeight);
          for (i in result) {
            offset = result[i].offset;
            heights[i] += offset;
            allocatedHeight += offset;
          }
        }

        // Start with top coordinate
        var top = children[0].getMarginTop();

        // Alignment support
        if (allocatedHeight < availHeight && this.getAlignY() != "top") {
          top = availHeight - allocatedHeight;
          if (this.getAlignY() === "middle") {
            top = Math.round(top / 2);
          }
        }

        // Layouting children
        var hint, left, width, height, marginBottom, marginLeft, marginRight;

        // Pre configure separators
        this._clearSeparators();

        // Compute separator height
        if (separator) {
          var separatorInsets = qx.theme.manager.Decoration.getInstance().resolve(separator).getInsets();
          var separatorHeight = separatorInsets.top + separatorInsets.bottom;
        }

        // Render children and separators
        for (i = 0; i < length; i += 1) {
          child = children[i];
          height = heights[i];
          hint = child.getSizeHint();
          marginLeft = child.getMarginLeft();
          marginRight = child.getMarginRight();

          // Find usable width
          width = Math.max(hint.minWidth, Math.min(availWidth - marginLeft - marginRight, hint.maxWidth));

          // Respect horizontal alignment
          left = util.computeHorizontalAlignOffset(child.getAlignX() || this.getAlignX(), width, availWidth, marginLeft, marginRight);

          // Add collapsed margin
          if (i > 0) {
            // Whether a separator has been configured
            if (separator) {
              // add margin of last child and spacing
              top += marginBottom + spacing;

              // then render the separator at this position
              this._renderSeparator(separator, {
                top: top + padding.top,
                left: padding.left,
                height: separatorHeight,
                width: availWidth
              });

              // and finally add the size of the separator, the spacing (again) and the top margin
              top += separatorHeight + spacing + child.getMarginTop();
            } else {
              // Support margin collapsing when no separator is defined
              top += util.collapseMargins(spacing, marginBottom, child.getMarginTop());
            }
          }

          // Layout child
          child.renderLayout(left + padding.left, top + padding.top, width, height);

          // Add height
          top += height;

          // Remember bottom margin (for collapsing)
          marginBottom = child.getMarginBottom();
        }
      },
      // overridden
      _computeSizeHint() {
        // Rebuild flex/height caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_195_4();
        }
        var util = qx.ui.layout.Util;
        var children = this.__children__P_195_3;

        // Initialize
        var minHeight = 0,
          height = 0,
          percentMinHeight = 0;
        var minWidth = 0,
          width = 0;
        var child, hint, margin;

        // Iterate over children
        for (var i = 0, l = children.length; i < l; i += 1) {
          child = children[i];
          hint = child.getSizeHint();

          // Sum up heights
          height += hint.height;

          // Detect if child is shrinkable or has percent height and update minHeight
          var flex = this.__flexs__P_195_1[i];
          var percent = this.__heights__P_195_0[i];
          if (flex) {
            minHeight += hint.minHeight;
          } else if (percent) {
            percentMinHeight = Math.max(percentMinHeight, Math.round(hint.minHeight / percent));
          } else {
            minHeight += hint.height;
          }

          // Build horizontal margin sum
          margin = child.getMarginLeft() + child.getMarginRight();

          // Find biggest width
          if (hint.width + margin > width) {
            width = hint.width + margin;
          }

          // Find biggest minWidth
          if (hint.minWidth + margin > minWidth) {
            minWidth = hint.minWidth + margin;
          }
        }
        minHeight += percentMinHeight;

        // Respect gaps
        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;
        if (separator) {
          gaps = util.computeVerticalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeVerticalGaps(children, spacing, true);
        }

        // Return hint
        return {
          minHeight: minHeight + gaps,
          height: height + gaps,
          minWidth: minWidth,
          width: width
        };
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this.__heights__P_195_0 = this.__flexs__P_195_1 = this.__children__P_195_3 = null;
    }
  });
  qx.ui.layout.VBox.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.VBox": {
        "require": true
      },
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
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Layouter used by the qooxdoo menu's to render their buttons
   *
   * @internal
   */
  qx.Class.define("qx.ui.menu.Layout", {
    extend: qx.ui.layout.VBox,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** Spacing between each cell on the menu buttons */
      columnSpacing: {
        check: "Integer",
        init: 0,
        apply: "_applyLayoutChange"
      },
      /**
       * Whether a column and which column should automatically span
       * when the following cell is empty. Spanning may be disabled
       * through setting this property to <code>null</code>.
       */
      spanColumn: {
        check: "Integer",
        init: 1,
        nullable: true,
        apply: "_applyLayoutChange"
      },
      /** Default icon column width if no icons are rendered */
      iconColumnWidth: {
        check: "Integer",
        init: 0,
        themeable: true,
        apply: "_applyLayoutChange"
      },
      /** Default arrow column width if no sub menus are rendered */
      arrowColumnWidth: {
        check: "Integer",
        init: 0,
        themeable: true,
        apply: "_applyLayoutChange"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __columnSizes__P_145_0: null,
      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      _computeSizeHint() {
        var children = this._getLayoutChildren();
        var child, sizes, spacing;
        var spanColumn = this.getSpanColumn();
        var columnSizes = this.__columnSizes__P_145_0 = [0, 0, 0, 0];
        var columnSpacing = this.getColumnSpacing();
        var spanColumnWidth = 0;
        var maxInset = 0;

        // Compute column sizes and insets
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          if (child.isAnonymous()) {
            continue;
          }
          sizes = child.getChildrenSizes();
          for (var column = 0; column < sizes.length; column++) {
            if (spanColumn != null && column == spanColumn && sizes[spanColumn + 1] == 0) {
              spanColumnWidth = Math.max(spanColumnWidth, sizes[column]);
            } else {
              columnSizes[column] = Math.max(columnSizes[column], sizes[column]);
            }
          }
          var insets = children[i].getInsets();
          maxInset = Math.max(maxInset, insets.left + insets.right);
        }

        // Fix label column width is cases where the maximum button with no shortcut
        // is larger than the maximum button with a shortcut
        if (spanColumn != null && columnSizes[spanColumn] + columnSpacing + columnSizes[spanColumn + 1] < spanColumnWidth) {
          columnSizes[spanColumn] = spanColumnWidth - columnSizes[spanColumn + 1] - columnSpacing;
        }

        // When merging the cells for label and shortcut
        // ignore the spacing between them
        if (spanColumnWidth == 0) {
          spacing = columnSpacing * 2;
        } else {
          spacing = columnSpacing * 3;
        }

        // Fix zero size icon column
        if (columnSizes[0] == 0) {
          columnSizes[0] = this.getIconColumnWidth();
        }

        // Fix zero size arrow column
        if (columnSizes[3] == 0) {
          columnSizes[3] = this.getArrowColumnWidth();
        }
        var height = qx.ui.menu.Layout.superclass.prototype._computeSizeHint.call(this).height;

        // Build hint
        return {
          minHeight: height,
          height: height,
          width: qx.lang.Array.sum(columnSizes) + maxInset + spacing
        };
      },
      /*
      ---------------------------------------------------------------------------
        CUSTOM ADDONS
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the column sizes detected during the pre-layout phase
       *
       * @return {Array} List of all column widths
       */
      getColumnSizes() {
        return this.__columnSizes__P_145_0 || null;
      }
    },
    /*
     *****************************************************************************
        DESTRUCT
     *****************************************************************************
     */

    destruct() {
      this.__columnSizes__P_145_0 = null;
    }
  });
  qx.ui.menu.Layout.$$dbClassInfo = $$dbClassInfo;
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
      this.__objects__P_147_0 = [];
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
      this.__openTimer__P_147_1 = new qx.event.Timer();
      this.__openTimer__P_147_1.addListener("interval", this._onOpenInterval, this);

      // Create close timer
      this.__closeTimer__P_147_2 = new qx.event.Timer();
      this.__closeTimer__P_147_2.addListener("interval", this._onCloseInterval, this);
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */

    members: {
      __scheduleOpen__P_147_3: null,
      __scheduleClose__P_147_4: null,
      __openTimer__P_147_1: null,
      __closeTimer__P_147_2: null,
      __objects__P_147_0: null,
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
        var menus = this.__objects__P_147_0;
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
        var reg = this.__objects__P_147_0;
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
        var reg = this.__objects__P_147_0;
        if (reg) {
          qx.lang.Array.remove(reg, obj);
        }
      },
      /**
       * Hides all currently opened menus.
       */
      hideAll() {
        var reg = this.__objects__P_147_0;
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
        var reg = this.__objects__P_147_0;
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
          if (this.__scheduleOpen__P_147_3) {
            this.cancelOpen(this.__scheduleOpen__P_147_3);
          }
        }

        // When the menu is not visible and not scheduled already
        // then schedule it for opening
        else if (this.__scheduleOpen__P_147_3 != menu) {
          // menu.debug("Schedule open");
          this.__scheduleOpen__P_147_3 = menu;
          this.__openTimer__P_147_1.restartWith(menu.getOpenInterval());
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
          if (this.__scheduleClose__P_147_4) {
            this.cancelClose(this.__scheduleClose__P_147_4);
          }
        }

        // When the menu is visible and not scheduled already
        // then schedule it for closing
        else if (this.__scheduleClose__P_147_4 != menu) {
          // menu.debug("Schedule close");
          this.__scheduleClose__P_147_4 = menu;
          this.__closeTimer__P_147_2.restartWith(menu.getCloseInterval());
        }
      },
      /**
       * When the given menu is scheduled for open this pending
       * request is canceled.
       *
       * @param menu {qx.ui.menu.Menu} The menu to cancel for open
       */
      cancelOpen(menu) {
        if (this.__scheduleOpen__P_147_3 == menu) {
          // menu.debug("Cancel open");
          this.__openTimer__P_147_1.stop();
          this.__scheduleOpen__P_147_3 = null;
        }
      },
      /**
       * When the given menu is scheduled for close this pending
       * request is canceled.
       *
       * @param menu {qx.ui.menu.Menu} The menu to cancel for close
       */
      cancelClose(menu) {
        if (this.__scheduleClose__P_147_4 == menu) {
          // menu.debug("Cancel close");
          this.__closeTimer__P_147_2.stop();
          this.__scheduleClose__P_147_4 = null;
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
        this.__openTimer__P_147_1.stop();

        // Open menu and reset flag
        this.__scheduleOpen__P_147_3.open();
        this.__scheduleOpen__P_147_3 = null;
      },
      /**
       * Event listener for a pending close request. Configured to the interval
       * of the current menu to close.
       *
       * @param e {qx.event.type.Event} Interval event
       */
      _onCloseInterval(e) {
        // Stop timer, reset scheduling flag
        this.__closeTimer__P_147_2.stop();

        // Close menu and reset flag
        this.__scheduleClose__P_147_4.exclude();
        this.__scheduleClose__P_147_4 = null;
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
        qx.event.Registration.addListener(document.body, "contextmenu", this.__onPreventContextMenu__P_147_5, this, true);
      },
      /**
       * Internal event handler to stop <code>contextmenu</code> event bubbling,
       * if target is inside the opened menu.
       *
       * @param e {qx.event.type.Mouse} contextmenu event
       *
       * @internal
       */
      __onPreventContextMenu__P_147_5(e) {
        var target = e.getTarget();
        target = qx.ui.core.Widget.getWidgetByElement(target, true);
        if (this._isInMenu(target)) {
          e.stopPropagation();
          e.preventDefault();
        }

        // stop only once
        qx.event.Registration.removeListener(document.body, "contextmenu", this.__onPreventContextMenu__P_147_5, this, true);
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
        if (this.__objects__P_147_0.length > 0 && !this._isInMenu(target)) {
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
      __selectionKeys__P_147_6: {
        Enter: 1,
        Space: 1
      },
      /**
       * @type {Map} Map of all keys working without a selection
       * @lint ignoreReferenceField(__navigationKeys)
       */
      __navigationKeys__P_147_7: {
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
        if (this.__navigationKeys__P_147_7[iden] || this.__selectionKeys__P_147_6[iden] && menu.getSelectedButton()) {
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
        var navigation = this.__navigationKeys__P_147_7[iden];
        var selection = this.__selectionKeys__P_147_6[iden];
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
        if (this.__objects__P_147_0.length > 0 && !this._isInMenu(target) && !this._isMenuOpener(target) && !e.getMomentum()) {
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
      this._disposeObjects("__openTimer__P_147_1", "__closeTimer__P_147_2");
      this._disposeArray("__objects__P_147_0");
    }
  });
  qx.ui.menu.Manager.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.command.Command": {},
      "qx.Class": {},
      "qx.util.PropertyUtil": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.command.bindEnabled": {
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * This mixin is included by all widgets, which support an 'execute' like
   * buttons or menu entries.
   */
  qx.Mixin.define("qx.ui.core.MExecutable", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired if the {@link #execute} method is invoked.*/
      execute: "qx.event.type.Event"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * A command called if the {@link #execute} method is called, e.g. on a
       * button tap.
       */
      command: {
        check: "qx.ui.command.Command",
        apply: "_applyCommand",
        event: "changeCommand",
        nullable: true
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __executableBindingIds__P_152_0: null,
      /**
       * @type {Boolean} Whether the command already executed. The protection flag to stop the second command execution.
       */
      __commandExecuted__P_152_1: false,
      __executeListenerId__P_152_2: null,
      /**
       * @type {Map} Set of properties, which will by synced from the command to the
       *    including widget
       *
       * @lint ignoreReferenceField(_bindableProperties)
       */
      _bindableProperties: qx.core.Environment.select("qx.command.bindEnabled", {
        true: ["enabled", "label", "icon", "toolTipText", "value", "menu"],
        false: ["label", "icon", "toolTipText", "value", "menu"]
      }),
      /**
       * Initiate the execute action.
       */
      execute() {
        var cmd = this.getCommand();
        if (cmd) {
          if (this.__commandExecuted__P_152_1) {
            this.__commandExecuted__P_152_1 = false;
          } else {
            this.__commandExecuted__P_152_1 = true;
            cmd.execute(this);
          }
        }
        this.fireEvent("execute");
      },
      /**
       * Handler for the execute event of the command.
       *
       * @param e {qx.event.type.Event} The execute event of the command.
       */
      __onCommandExecute__P_152_3(e) {
        if (this.__commandExecuted__P_152_1) {
          this.__commandExecuted__P_152_1 = false;
          return;
        }
        this.__commandExecuted__P_152_1 = true;
        if (this.isEnabled()) {
          this.execute();
        }
      },
      // property apply
      _applyCommand(value, old) {
        // execute forwarding
        if (old != null) {
          old.removeListenerById(this.__executeListenerId__P_152_2);
        }
        if (value != null) {
          this.__executeListenerId__P_152_2 = value.addListener("execute", this.__onCommandExecute__P_152_3, this);
        }

        // binding stuff
        var ids = this.__executableBindingIds__P_152_0;
        if (ids == null) {
          this.__executableBindingIds__P_152_0 = ids = {};
        }
        var selfPropertyValue;
        for (var i = 0; i < this._bindableProperties.length; i++) {
          var property = this._bindableProperties[i];

          // remove the old binding
          if (old != null && !old.isDisposed() && ids[property] != null) {
            old.removeBinding(ids[property]);
            ids[property] = null;
          }

          // add the new binding
          if (value != null && qx.Class.hasProperty(this.constructor, property)) {
            // handle the init value (don't sync the initial null)
            var cmdPropertyValue = value.get(property);
            if (cmdPropertyValue == null) {
              selfPropertyValue = this.get(property);
              // check also for themed values [BUG #5906]
              if (selfPropertyValue == null) {
                // update the appearance to make sure every themed property is up to date
                this.$$resyncNeeded = true;
                this.syncAppearance();
                selfPropertyValue = qx.util.PropertyUtil.getThemeValue(this, property);
              }
            } else {
              // Reset the self property value [BUG #4534]
              selfPropertyValue = null;
            }
            // set up the binding
            ids[property] = value.bind(property, this, property);
            // reapply the former value
            if (selfPropertyValue) {
              this.set(property, selfPropertyValue);
            }
          }
        }
      }
    },
    destruct() {
      this._applyCommand(null, this.getCommand());
      this.__executableBindingIds__P_152_0 = null;
    }
  });
  qx.ui.core.MExecutable.$$dbClassInfo = $$dbClassInfo;
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Form interface for all form widgets which are executable in some way. This
   * could be a button for example.
   */
  qx.Interface.define("qx.ui.form.IExecutable", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired when the widget is executed. Sets the "data" property of the
       * event to the object that issued the command.
       */
      execute: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        COMMAND PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Set the command of this executable.
       *
       * @param command {qx.ui.command.Command} The command.
       */
      setCommand(command) {
        return arguments.length == 1;
      },
      /**
       * Return the current set command of this executable.
       *
       * @return {qx.ui.command.Command} The current set command.
       */
      getCommand() {},
      /**
       * Fire the "execute" event on the command.
       */
      execute() {}
    }
  });
  qx.ui.form.IExecutable.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MExecutable": {
        "require": true
      },
      "qx.ui.form.IExecutable": {
        "require": true
      },
      "qx.ui.menu.ButtonLayout": {
        "construct": true
      },
      "qx.ui.menu.Menu": {},
      "qx.ui.basic.Image": {},
      "qx.ui.basic.Label": {},
      "qx.event.Timer": {},
      "qx.ui.menu.Manager": {},
      "qx.locale.Manager": {},
      "qx.core.ObjectRegistry": {}
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The abstract menu button class is used for all type of menu content
   * for example normal buttons, checkboxes or radiobuttons.
   *
   * @childControl icon {qx.ui.basic.Image} icon of the button
   * @childControl label {qx.ui.basic.Label} label of the button
   * @childControl shortcut {qx.ui.basic.Label} shows if specified the shortcut
   * @childControl arrow {qx.ui.basic.Image} shows the arrow to show an additional widget (e.g. popup or submenu)
   */
  qx.Class.define("qx.ui.menu.AbstractButton", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MExecutable],
    implement: [qx.ui.form.IExecutable],
    type: "abstract",
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.core.Widget.constructor.call(this);

      // Use hard coded layout
      this._setLayout(new qx.ui.menu.ButtonLayout());

      // Add listeners
      this.addListener("tap", this._onTap);
      this.addListener("keypress", this._onKeyPress);

      // Add command listener
      this.addListener("changeCommand", this._onChangeCommand, this);
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      blockToolTip: {
        refine: true,
        init: true
      },
      /** The label text of the button */
      label: {
        check: "String",
        apply: "_applyLabel",
        nullable: true,
        event: "changeLabel"
      },
      /** Whether a sub menu should be shown and which one */
      menu: {
        check: "qx.ui.menu.Menu",
        apply: "_applyMenu",
        nullable: true,
        dereference: true,
        event: "changeMenu"
      },
      /** The icon to use */
      icon: {
        check: "String",
        apply: "_applyIcon",
        themeable: true,
        nullable: true,
        event: "changeIcon"
      },
      /** Indicates whether the label for the command (shortcut) should be visible or not. */
      showCommandLabel: {
        check: "Boolean",
        apply: "_applyShowCommandLabel",
        themeable: true,
        init: true,
        event: "changeShowCommandLabel"
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
          case "icon":
            control = new qx.ui.basic.Image();
            control.setAnonymous(true);
            this._add(control, {
              column: 0
            });
            break;
          case "label":
            control = new qx.ui.basic.Label();
            control.setAnonymous(true);
            this._add(control, {
              column: 1
            });
            break;
          case "shortcut":
            control = new qx.ui.basic.Label();
            control.setAnonymous(true);
            if (!this.getShowCommandLabel()) {
              control.exclude();
            }
            this._add(control, {
              column: 2
            });
            break;
          case "arrow":
            control = new qx.ui.basic.Image();
            control.setAnonymous(true);
            this._add(control, {
              column: 3
            });
            break;
        }
        return control || qx.ui.menu.AbstractButton.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        selected: 1
      },
      /*
      ---------------------------------------------------------------------------
        LAYOUT UTILS
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the dimensions of all children
       *
       * @return {Array} Preferred width of each child
       */
      getChildrenSizes() {
        var iconWidth = 0,
          labelWidth = 0,
          shortcutWidth = 0,
          arrowWidth = 0;
        if (this._isChildControlVisible("icon")) {
          var icon = this.getChildControl("icon");
          iconWidth = icon.getMarginLeft() + icon.getSizeHint().width + icon.getMarginRight();
        }
        if (this._isChildControlVisible("label")) {
          var label = this.getChildControl("label");
          labelWidth = label.getMarginLeft() + label.getSizeHint().width + label.getMarginRight();
        }
        if (this._isChildControlVisible("shortcut")) {
          var shortcut = this.getChildControl("shortcut");
          shortcutWidth = shortcut.getMarginLeft() + shortcut.getSizeHint().width + shortcut.getMarginRight();
        }
        if (this._isChildControlVisible("arrow")) {
          var arrow = this.getChildControl("arrow");
          arrowWidth = arrow.getMarginLeft() + arrow.getSizeHint().width + arrow.getMarginRight();
        }
        return [iconWidth, labelWidth, shortcutWidth, arrowWidth];
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for tap
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onTap(e) {
        if (e.isLeftPressed()) {
          this.execute();
          qx.event.Timer.once(qx.ui.menu.Manager.getInstance().hideAll, qx.ui.menu.Manager.getInstance(), 0);
        }

        // right click
        else {
          // only prevent contextmenu event if button has no further context menu.
          if (!this.getContextMenu()) {
            qx.ui.menu.Manager.getInstance().preventContextMenuOnce();
          }
        }
      },
      /**
       * Event listener for keypress event
       *
       * @param e {qx.event.type.KeySequence} keypress event
       */
      _onKeyPress(e) {
        this.execute();
      },
      /**
       * Event listener for command changes. Updates the text of the shortcut.
       *
       * @param e {qx.event.type.Data} Property change event
       */
      _onChangeCommand(e) {
        var command = e.getData();

        // do nothing if no command is set
        if (command == null) {
          return;
        }
        {
          var oldCommand = e.getOldData();
          if (!oldCommand) {
            this.__changeLocaleCommandListenerId__P_148_0 = qx.locale.Manager.getInstance().addListener("changeLocale", this._onChangeLocale, this);
          }
          if (!command && this.__changeLocaleCommandListenerId__P_148_0) {
            qx.locale.Manager.getInstance().removeListenerById(this.__changeLocaleCommandListenerId__P_148_0);
          }
        }
        var cmdString = command != null ? command.toString() : "";
        this.getChildControl("shortcut").setValue(cmdString);
      },
      /**
       * Update command string on locale changes
       */
      _onChangeLocale: qx.core.Environment.select("qx.dynlocale", {
        true(e) {
          var command = this.getCommand();
          if (command != null) {
            this.getChildControl("shortcut").setValue(command.toString());
          }
        },
        false: null
      }),
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyIcon(value, old) {
        if (value) {
          this._showChildControl("icon").setSource(value);
        } else {
          this._excludeChildControl("icon");
        }
      },
      // property apply
      _applyLabel(value, old) {
        if (value) {
          this._showChildControl("label").setValue(value);
        } else {
          this._excludeChildControl("label");
        }
      },
      // property apply
      _applyMenu(value, old) {
        if (old) {
          old.removeListener("changeVisibility", this._onMenuChange, this);
          old.resetOpener();
          old.removeState("submenu");
        }
        if (value) {
          this._showChildControl("arrow");
          value.addListener("changeVisibility", this._onMenuChange, this);
          value.setOpener(this);
          value.addState("submenu");
        } else {
          this._excludeChildControl("arrow");
        }

        // ARIA attrs
        const contentEl = this.getContentElement();
        if (!contentEl) {
          return;
        }
        if (value) {
          contentEl.setAttribute("aria-haspopup", "menu");
          contentEl.setAttribute("aria-expanded", value.isVisible());
          contentEl.setAttribute("aria-controls", value.getContentElement().getAttribute("id"));
        } else {
          contentEl.removeAttribute("aria-haspopup");
          contentEl.removeAttribute("aria-expanded");
          contentEl.removeAttribute("aria-controls");
        }
      },
      /**
       * Listener for visibility property changes of the attached menu
       *
       * @param e {qx.event.type.Data} Property change event
       */
      _onMenuChange(e) {
        // ARIA attrs
        this.getContentElement().setAttribute("aria-expanded", this.getMenu().isVisible());
      },
      // property apply
      _applyShowCommandLabel(value, old) {
        if (value) {
          this._showChildControl("shortcut");
        } else {
          this._excludeChildControl("shortcut");
        }
      }
    },
    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */

    destruct() {
      this.removeListener("changeCommand", this._onChangeCommand, this);
      if (this.getMenu()) {
        if (!qx.core.ObjectRegistry.inShutDown) {
          this.getMenu().destroy();
        }
      }
      if (true && this.__changeLocaleCommandListenerId__P_148_0) {
        qx.locale.Manager.getInstance().removeListenerById(this.__changeLocaleCommandListenerId__P_148_0);
      }
    }
  });
  qx.ui.menu.AbstractButton.$$dbClassInfo = $$dbClassInfo;
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
      __insets__P_214_0: null,
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
        this.__insets__P_214_0 = null;
      },
      // interface implementation
      getInsets() {
        if (!this.__insets__P_214_0) {
          this.__insets__P_214_0 = this._getDefaultInsets();
        }
        return this.__insets__P_214_0;
      }
    },
    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */

    destruct() {
      this.__insets__P_214_0 = null;
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
      this._getDefaultInsetsForBorder = this.__getDefaultInsetsForDoubleBorder__P_215_0;
      this._styleBorder = this.__styleDoubleBorder__P_215_1;
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
      __styleDoubleBorder__P_215_1(styles) {
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
          this.__processInnerOpacity__P_215_2(innerColor, innerOpacity);
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
      __processInnerOpacity__P_215_2(innerColor, innerOpacity) {
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
      __getDefaultInsetsForDoubleBorder__P_215_0() {
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
        var styleImpl = this.__styleLinearBackgroundGradientAccordingToSpec__P_216_0;
        if (qx.core.Environment.get("css.gradient.legacywebkit")) {
          styleImpl = this.__styleLinearBackgroundGradientForLegacyWebkit__P_216_1;
        } else if (!qx.core.Environment.get("css.gradient.linear") && qx.core.Environment.get("css.borderradius")) {
          styleImpl = this.__styleLinearBackgroundGradientWithCanvas__P_216_2;
        } else if (!qx.core.Environment.get("css.gradient.linear")) {
          styleImpl = this.__styleLinearBackgroundGradientWithMSFilter__P_216_3;
        }
        var gradientProperties = ["startColor", "endColor", "colorPositionUnit", "orientation", "startColorPosition", "endColorPosition"];
        (function (startColors, endColors, units, orientations, startColorPositions, endColorPositions) {
          for (var i = 0; i < startColors.length; i++) {
            var startColor = this.__getColor__P_216_4(startColors[i]);
            var endColor = this.__getColor__P_216_4(endColors[i]);
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
      __styleLinearBackgroundGradientForLegacyWebkit__P_216_1(startColor, endColor, unit, orientation, startColorPosition, endColorPosition, styles, backgroundStyle) {
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
      __styleLinearBackgroundGradientWithCanvas__P_216_2(startColor, endColor, unit, orientation, startColorPosition, endColorPosition, styles, backgroundStyle) {
        const me = qx.ui.decoration.MLinearBackgroundGradient.__styleLinearBackgroundGradientWithCanvas__P_216_2;
        if (!me.__canvas__P_216_5) {
          me.__canvas__P_216_5 = document.createElement("canvas");
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
        me.__canvas__P_216_5.width = width;
        me.__canvas__P_216_5.height = height;
        var ctx = me.__canvas__P_216_5.getContext("2d");
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
        backgroundStyle.push("url(" + me.__canvas__P_216_5.toDataURL() + ") " + size);
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
      __styleLinearBackgroundGradientWithMSFilter__P_216_3(startColor, endColor, unit, orientation, startColorPosition, endColorPosition, styles, backgroundStyle) {
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
      __styleLinearBackgroundGradientAccordingToSpec__P_216_0(startColor, endColor, unit, orientation, startColorPosition, endColorPosition, styles, backgroundStyle) {
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
      __getColor__P_216_4(color) {
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
        var computedSlices = this.__getSlices__P_217_0(resolvedImage);
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
      __getSlices__P_217_0(baseImage) {
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
      __initialized__P_178_0: false,
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
        this.__initialized__P_178_0 = true;
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
        return this.__initialized__P_178_0;
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
          this.__extendArray__P_178_1(propertyValues[i], items);
        }
        return propertyValues;
      },
      /**
       * Extends an array up to the given length by repeating the elements already present.
       * @param array {Array} Incoming array. Has to contain at least one element.
       * @param to {Integer} Desired length. Must be greater than or equal to the the length of arr.
       */
      __extendArray__P_178_1(array, to) {
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
      this.__aliases__P_179_0 = {};

      // Define static alias from setting
      this.add("static", "qx/static");
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __aliases__P_179_0: null,
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
          if (this.__aliases__P_179_0[value]) {
            return this.__aliases__P_179_0[value];
          }
          var alias = value.substring(0, value.indexOf("/"));
          var resolved = this.__aliases__P_179_0[alias];
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
        this.__aliases__P_179_0[alias] = base;

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
        delete this.__aliases__P_179_0[alias];

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
        for (var key in this.__aliases__P_179_0) {
          res[key] = this.__aliases__P_179_0[key];
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
      "qx.html.Text": {
        "construct": true
      },
      "qx.html.Iframe": {
        "construct": true
      },
      "qx.html.Input": {
        "construct": true
      },
      "qx.html.Slot": {
        "construct": true
      },
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2019-2020 Zenesis Limited, https://www.zenesis.com
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (https://github.com/johnspackman, john.spackman@zenesis.com)
  
  ************************************************************************ */

  /**
   * Factory class used to create Virtual DOM instances by JSX support
   */
  qx.Class.define("qx.html.Factory", {
    extend: qx.core.Object,
    type: "singleton",
    construct() {
      qx.core.Object.constructor.call(this);
      this.__factoriesByTagName__P_153_0 = {};
      this.registerFactory("#text", (tagName, styles, attributes) => new qx.html.Text(""));
      this.registerFactory("iframe", (tagName, styles, attributes) => new qx.html.Iframe(attributes.src, styles, attributes));
      this.registerFactory("input", (tagName, styles, attributes) => new qx.html.Input(attributes.type || "text", styles, attributes));
      this.registerFactory("slot", (tagName, styles, attributes) => {
        if (tagName !== "slot") {
          throw new Error(`Cannot create slot with tag <${tagName}> - only <slot> is supported`);
        }
        if (Object.keys(styles).length > 0) {
          throw new Error(`Cannot create slot with attribute "style" - only the "name" attribute is supported`);
        }
        Object.keys(attributes).forEach(key => {
          if (key !== "name") {
            throw new Error(`Cannot create slot with attribute "${key}" - only the "name" attribute is supported`);
          }
        });
        return new qx.html.Slot(attributes.name);
      });
    },
    members: {
      __factoriesByTagName__P_153_0: null,
      /**
       * Registers a factory; a factory is either a class, or a function which is
       * called with the parameters (tagName {String}, styles{Map?}, attributes {Map?}), and
       * which is expected to return an {Element}
       *
       * @param tagName {String} the name of the tag
       * @param factory {Class|Function} the function used to create instances for that tagName
       */
      registerFactory(tagName, factory) {
        tagName = tagName.toLowerCase();
        if (this.__factoriesByTagName__P_153_0[tagName] === undefined) {
          this.__factoriesByTagName__P_153_0[tagName] = [];
        }
        this.__factoriesByTagName__P_153_0[tagName].push(factory);
      },
      /**
       * Called to create an {Element}
       *
       * @param tagName {String} the name of the tag
       * @param attributes {Map?} the attributes to create (including style etc)
       * @return {qx.html.Node}
       */
      createElement(tagName, attributes) {
        tagName = tagName.toLowerCase();
        if (attributes) {
          if (window.NamedNodeMap && attributes instanceof window.NamedNodeMap) {
            var newAttrs = {};
            for (var i = attributes.length - 1; i >= 0; i--) {
              newAttrs[attributes[i].name] = attributes[i].value;
            }
            attributes = newAttrs;
          }
          var styles = {};
          if (attributes.style) {
            attributes.style.split(/;/).forEach(function (seg) {
              var pos = seg.indexOf(":");
              var key = seg.substring(0, pos);
              var value = seg.substring(pos + 1).trim();
              if (key) {
                styles[key] = value;
              }
            });
            delete attributes.style;
          }
          var classname = attributes["data-qx-classname"];
          if (classname) {
            var clazz = qx.Class.getByName(classname);
            {
              this.assertTrue(clazz && qx.Class.isSubClassOf(clazz, qx.html.Element));
              return new clazz(tagName, styles, attributes);
            }
          }
        }
        var factories = this.__factoriesByTagName__P_153_0[tagName];
        if (factories) {
          for (var i = factories.length - 1; i > -1; i--) {
            var factory = factories[i];
            if (factory.classname && qx.Class.getByName(factory.classname) === factory) {
              return new factory(tagName, styles, attributes);
            }
            {
              this.assertTrue(typeof factory == "function");
            }
            var element = factory(tagName, styles, attributes);
            if (element) {
              return element;
            }
          }
        }
        return new qx.html.Element(tagName, styles, attributes);
      }
    }
  });
  qx.html.Factory.$$dbClassInfo = $$dbClassInfo;
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
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2019-22 Zenesis Ltd, https://www.zenesis.com
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       John Spackman (john.spackman@zenesis.com, @johnspackman)
  
  ************************************************************************ */

  /**
   * Controls serializing the VDOM in `qx.html.*` into an HTML string.
   *
   * The principal task here is to write the HTML with QxObjectIds, in a form which allows
   * the DOM that the browser parsed to be connected to the instances of `qx.html.Node`
   * that are created by the Javascript on the client.
   *
   * In other words, the DOM which is created by this HTML will be passed to `qx.html.Element.useNode`
   * on the client.
   */
  qx.Class.define("qx.html.Serializer", {
    extend: qx.core.Object,
    /**
     * Constructor
     */
    construct() {
      qx.core.Object.constructor.call(this);
      this.__output__P_154_0 = "";
      this.__objectStack__P_154_1 = [];
      this.__tagDataStack__P_154_2 = [];
    },
    properties: {
      /** Whether to pretty print (default is whatever qx.cdebug is set to) */
      prettyPrint: {
        init: true,
        check: "Boolean",
        nullable: false
      }
    },
    members: {
      /** @type{String} the HTML being built up */
      __output__P_154_0: null,
      /** @type{qx.html.Node[]} the stack of objects being written */
      __objectStack__P_154_1: null,
      /**
       * For each tag on the stack being emitted, we track the data in an object, nominally called TagData
       *
       * @typedef {Object} TagData
       * @property {Integer} indent how far this node is indented
       * @property {String} tagName the name of the tag
       * @property {Dictionary} attributes the attributes to set on the tag
       * @property {Boolean?} openTagWritten whether the open tag has been written
       * @property {Boolean?} closeTagWritten whether the close tag has been written
       */

      /** @type{TagData[]} the stack of elements being written */
      __tagDataStack__P_154_2: null,
      /** @type{String?} the current tag name */
      __currentTagName__P_154_3: null,
      /**
       * Writes to the output
       * @param  {var[]} args array of values to convert to strings and output
       */
      write() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        this.__output__P_154_0 += args.join("");
      },
      /**
       * Called when an open tag needs to be emitted
       *
       * @param {String} tagName
       */
      openTag(tagName) {
        this.__flush__P_154_4();
        this.__tagDataStack__P_154_2.push({
          indent: this.__tagDataStack__P_154_2.length,
          tagName: tagName.toLowerCase(),
          attributes: {}
        });
      },
      /**
       * Called to add plain text into the output
       * @param {String?} text
       */
      rawTextInBody(text) {
        if (text !== null && text !== undefined) {
          this.__flush__P_154_4();
          this.write(text);
        }
      },
      /**
       * Called to close the current tag
       */
      closeTag() {
        this.__flush__P_154_4(true);
        this.__tagDataStack__P_154_2.pop();
      },
      /**
       * Adds an attribute to the current tag; cannot be done if body or children have been output
       *
       * @param {String} key the attribute name
       * @param {String?} value teh attribite value, if null the attribute will be deleted
       */
      setAttribute(key, value) {
        const tagData = this.__peekTagData__P_154_5();
        if (tagData.openTagWritten) {
          throw new Error("Cannot modify attributes after the opening tag has been written");
        }
        tagData.attributes[key] = value;
      },
      /**
       * Looks for the current tag
       *
       * @returns {TagData}
       */
      __peekTagData__P_154_5() {
        return this.__tagDataStack__P_154_2[this.__tagDataStack__P_154_2.length - 1];
      },
      /**
       * Flushes the tag into the output.  This will prevent further attributes etc from being emitted
       * and if `closeTag` is true then the tag is closed.  Handles self closing tags and indentation
       *
       * @param {Boolean} closeTag if we are flushing because the tag is being closed
       */
      __flush__P_154_4(closeTag) {
        const tagData = this.__peekTagData__P_154_5();
        if (!tagData) {
          return;
        }
        const indent = () => {
          if (this.isPrettyPrint()) {
            for (let i = 0; i < tagData.indent; i++) {
              this.write("  ");
            }
          }
        };
        if (!tagData.openTagWritten) {
          indent();
          const tmp = ["<" + tagData.tagName];
          for (const key in tagData.attributes) {
            const value = tagData.attributes[key];
            if (value !== null && value !== undefined) {
              tmp.push(`${key}=${value}`);
            }
          }
          this.write(tmp.join(" "));
          if (closeTag) {
            if (qx.html.Serializer.__SELF_CLOSING_TAGS__P_154_6[tagData.tagName]) {
              this.write("/>");
            } else {
              this.write("></" + tagData.tagName + ">");
            }
            tagData.openTagWritten = true;
            tagData.closeTagWritten = true;
            if (this.isPrettyPrint()) {
              this.write("\n");
            }
          } else {
            this.write(">");
            if (this.isPrettyPrint()) {
              this.write("\n");
            }
            tagData.openTagWritten = true;
          }
        } else if (closeTag && !tagData.closeTagWritten) {
          indent();
          this.write(`</${tagData.tagName}>`);
          if (this.isPrettyPrint()) {
            this.write("\n");
          }
          tagData.closeTagWritten = true;
        }
      },
      /**
       * Erases all output
       */
      clear() {
        this.__output__P_154_0 = "";
      },
      /**
       * Provides the accumulated output
       *
       * @returns {String}
       */
      getOutput() {
        return this.__output__P_154_0;
      },
      /**
       * Pushes the QxObject onto the stack
       *
       * @param {qx.core.Object} obj
       */
      pushQxObject(obj) {
        this.__objectStack__P_154_1.push(obj);
      },
      /**
       * Pops the topmost QxObject from the stack
       */
      popQxObject() {
        this.__objectStack__P_154_1.pop();
      },
      /**
       * Peeks the QxObject stack
       *
       * @returns {qx.core.Object}
       */
      peekQxObject() {
        return this.__objectStack__P_154_1[this.__objectStack__P_154_1.length - 1] || null;
      },
      /**
       * Calculates a Qx Object ID which is either relative to the root most element,
       * or is relative to it's owner.  This tries to be as concise as possible so that
       * the output HTML is as readable as possible
       *
       * The return is null if the object does not have an ID
       *
       * @param {qx.html.Element} target
       * @returns {String?}
       */
      getQxObjectIdFor(target) {
        if (!target.getQxObjectId()) {
          return null;
        }

        // If we can make the ID relative to it's parent, then just use the shorter version.  This is
        //  not strictly necessary because we could use absolute paths everywhere, but it's a lot
        //  easier to read and understand, and consumes less bytes in the output
        const stackTop = this.peekQxObject();
        if (stackTop === target) {
          const secondTop = this.__objectStack__P_154_1.slice(-2)[0] || null;
          if (secondTop === target.getQxOwner()) {
            return target.getQxObjectId();
          }
        }

        // Calculate the relative path between the stack top and the target object
        const ids = [target.getQxObjectId()];
        const stackFirst = this.__objectStack__P_154_1[0];
        let tmp = target;
        do {
          const owner = tmp.getQxOwner();
          if (this.__objectStack__P_154_1.indexOf(owner) < 0) {
            break;
          } else if (owner === stackFirst) {
            ids.unshift("..");
          } else {
            ids.unshift(tmp.getQxObjectId());
          }
        } while (tmp = tmp.getQxOwner());
        return ids.join("/");
      }
    },
    statics: {
      /** @type{Dictionary<String,Boolean>} list of self closing tags, in lowercase */
      __SELF_CLOSING_TAGS__P_154_6: null
    },
    /**
     * Populates statics
     */
    defer(statics) {
      statics.__SELF_CLOSING_TAGS__P_154_6 = {};
      ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"].forEach(function (tagName) {
        statics.__SELF_CLOSING_TAGS__P_154_6[tagName] = true;
      });
    }
  });
  qx.html.Serializer.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.html.Node": {
        "construct": true,
        "require": true
      },
      "qx.html.Element": {
        "defer": "runtime"
      },
      "qx.util.DeferredCall": {
        "defer": "runtime"
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2019-2020 Zenesis Limited, https://www.zenesis.com
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (https://github.com/johnspackman, john.spackman@zenesis.com)
  
  ************************************************************************ */

  /**
   * DOM representation of Text nodes
   */
  qx.Class.define("qx.html.Text", {
    extend: qx.html.Node,
    /*
     * ****************************************************************************
     * CONSTRUCTOR
     * ****************************************************************************
     */

    /**
     * Creates a new Text
     *
     * @param value
     *          {String?} the value of the text
     */
    construct(text) {
      qx.html.Node.constructor.call(this, "#text");
      if (text) {
        this.__text__P_75_0 = text;
      }
    },
    /*
     * ****************************************************************************
     * MEMBERS
     * ****************************************************************************
     */

    members: {
      __text__P_75_0: null,
      /*
       * @Override
       */
      _createDomElement() {
        return window.document.createTextNode(this.__text__P_75_0 || "");
      },
      /*
       * @Override
       */
      isRoot() {
        return false;
      },
      /*
       * @Override
       */
      _copyData(fromMarkup, propertiesFromDom) {
        qx.html.Text.superclass.prototype._copyData.call(this, fromMarkup, propertiesFromDom);
        var elem = this._domNode;
        elem.nodeValue = this.__text__P_75_0 || "";
      },
      /*
       * @Override
       */
      _useNodeImpl(domNode) {
        this.setText(domNode.nodeValue);
      },
      /**
       * @Override
       */
      _syncData() {
        qx.html.Text.superclass.prototype._syncData.call(this);
        var elem = this._domNode;
        elem.nodeValue = this.__text__P_75_0 || "";
      },
      /*
       * @Override
       */
      _serializeImpl(serializer) {
        serializer.rawTextInBody(this.__text__P_75_0);
      },
      /**
       * @Override
       */
      useMarkup(html) {
        throw new Error("Could not overwrite existing text node!");
      },
      /**
       * Sets the text value
       *
       * @param value {String?} the text value of for the text node
       * @param direct {Boolean?} whether to set the DOM node immediately if there is one
       */
      setText(value, direct) {
        this.__text__P_75_0 = value;
        if (direct && this._domNode) {
          this._domNode.nodeValue = value;
        } else {
          qx.html.Element._modified[this.$$hash] = this;
          qx.html.Element._scheduleFlush("element");
        }
      },
      /**
       * Returns the value of the node
       *
       * @return {String} the text node
       */
      getText() {
        return this.__text__P_75_0;
      }
    },
    /*
     * ****************************************************************************
     * DEFER
     * ****************************************************************************
     */

    defer(statics) {
      statics.__deferredCall__P_75_1 = new qx.util.DeferredCall(statics.flush, statics);
    },
    /*
     * ****************************************************************************
     * DESTRUCT
     * ****************************************************************************
     */

    destruct() {
      if (this.toHashCode()) {
        delete qx.html.Element._modified[this.toHashCode()];
        delete qx.html.Element._scroll[this.toHashCode()];
      }
      this.__attribValues__P_75_2 = this.__styleValues__P_75_3 = this.__eventValues__P_75_4 = this.__attribJobs__P_75_5 = this.__styleJobs__P_75_6 = this.__lazyScrollIntoViewX__P_75_7 = this.__lazyScrollIntoViewY__P_75_8 = null;
    }
  });
  qx.html.Text.$$dbClassInfo = $$dbClassInfo;
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
      "qx.lang.Function": {
        "construct": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.bom.Event": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Mouse": {},
      "qx.event.type.MouseWheel": {},
      "qx.event.type.Data": {},
      "qx.bom.client.Event": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.dom.Hierarchy": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "os.name": {
          "className": "qx.bom.client.OperatingSystem"
        },
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
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * This class provides an unified mouse event handler for Internet Explorer,
   * Firefox, Opera and Safari
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * @require(qx.event.handler.UserAction)
   * @ignore(qx.event.handler.DragDrop)
   * @ignore(performance.now)
   */
  qx.Class.define("qx.event.handler.Mouse", {
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
      this.__manager__P_155_0 = manager;
      this.__window__P_155_1 = manager.getWindow();
      this.__root__P_155_2 = this.__window__P_155_1.document;
      this.__onNativeListener__P_155_3 = qx.lang.Function.listener(this._onNative, this);

      // Initialize observers
      this._initButtonObserver();
      this._initMoveObserver();
      this._initWheelObserver();
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
        auxclick: 1,
        click: 1,
        contextmenu: 1,
        dblclick: 1,
        mousedown: 1,
        mouseenter: 1,
        mouseleave: 1,
        mousemove: 1,
        mouseout: 1,
        mouseover: 1,
        mouseup: 1,
        mousewheel: 1
      },
      /** @type{Map} these event types cannot be attached to the root (the document), they must be attached to the element itself */
      NON_BUBBLING_EVENTS: {
        mouseenter: true,
        mouseleave: true
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE + qx.event.IEventHandler.TARGET_DOCUMENT + qx.event.IEventHandler.TARGET_WINDOW,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __onButtonEventWrapper__P_155_4: null,
      __onMoveEventWrapper__P_155_5: null,
      __onWheelEventWrapper__P_155_6: null,
      __lastEventType__P_155_7: null,
      __lastMouseDownTarget__P_155_8: null,
      __manager__P_155_0: null,
      __window__P_155_1: null,
      __root__P_155_2: null,
      __preventNextClick__P_155_9: null,
      /** @type{Function} wrapper for `_onNative`, bound as a native listener */
      __onNativeListener__P_155_3: null,
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER INTERFACE
      ---------------------------------------------------------------------------
      */

      // interface implementation
      canHandleEvent(target, type) {},
      /**
       * @Override
       */
      registerEvent(target, type, capture) {
        if (qx.event.handler.Mouse.NON_BUBBLING_EVENTS[type]) {
          qx.bom.Event.addNativeListener(target, type, this.__onNativeListener__P_155_3);
        } else if (qx.core.Environment.get("os.name") === "ios") {
          // The iPhone requires for attaching mouse events natively to every element which
          // should react on mouse events. As of version 3.0 it also requires to keep the
          // listeners as long as the event should work. In 2.0 it was enough to attach the
          // listener once.
          target["on" + type] = function () {
            return null;
          };
        }
      },
      /**
       * @Override
       */
      unregisterEvent(target, type, capture) {
        if (qx.event.handler.Mouse.NON_BUBBLING_EVENTS[type]) {
          qx.bom.Event.removeNativeListener(target, type, this.__onNativeListener__P_155_3);
        } else if (qx.core.Environment.get("os.name") === "ios") {
          target["on" + type] = undefined;
        }
      },
      /**
       * Default event handler for events that do not bubble
       *
       * @signature function(domEvent, eventId)
       * @param domEvent {Event} Native event
       */
      _onNative: qx.event.GlobalError.observeMethod(function (domEvent) {
        let target = qx.bom.Event.getTarget(domEvent);
        qx.event.Registration.fireNonBubblingEvent(target, domEvent.type, qx.event.type.Mouse, [domEvent, target, undefined, undefined, domEvent.cancelable]);
      }),
      /*
      ---------------------------------------------------------------------------
        HELPER
      ---------------------------------------------------------------------------
      */

      /**
       * Fire a mouse event with the given parameters
       *
       * @param domEvent {Event} DOM event
       * @param type {String} type of the event
       * @param target {Element} event target
       */
      __fireEvent__P_155_10(domEvent, type, target) {
        if (!target) {
          target = qx.bom.Event.getTarget(domEvent);
        }

        // we need a true node for the fireEvent
        // e.g. when hovering over text of disabled textfields IE is returning
        // an empty object as "srcElement"
        if (target && target.nodeType) {
          qx.event.Registration.fireEvent(target, type || domEvent.type, type == "mousewheel" ? qx.event.type.MouseWheel : qx.event.type.Mouse, [domEvent, target, null, true, true]);
        }

        // Fire user action event
        qx.event.Registration.fireEvent(this.__window__P_155_1, "useraction", qx.event.type.Data, [type || domEvent.type]);
      },
      /**
       * Helper to prevent the next click.
       * @internal
       */
      preventNextClick() {
        this.__preventNextClick__P_155_9 = true;
      },
      /*
      ---------------------------------------------------------------------------
        OBSERVER INIT
      ---------------------------------------------------------------------------
      */

      /**
       * Initializes the native mouse button event listeners.
       *
       * @signature function()
       */
      _initButtonObserver() {
        this.__onButtonEventWrapper__P_155_4 = qx.lang.Function.listener(this._onButtonEvent, this);
        var Event = qx.bom.Event;
        Event.addNativeListener(this.__root__P_155_2, "mousedown", this.__onButtonEventWrapper__P_155_4);
        Event.addNativeListener(this.__root__P_155_2, "mouseup", this.__onButtonEventWrapper__P_155_4);
        Event.addNativeListener(this.__root__P_155_2, "click", this.__onButtonEventWrapper__P_155_4);
        Event.addNativeListener(this.__root__P_155_2, "auxclick", this.__onButtonEventWrapper__P_155_4);
        Event.addNativeListener(this.__root__P_155_2, "dblclick", this.__onButtonEventWrapper__P_155_4);
        Event.addNativeListener(this.__root__P_155_2, "contextmenu", this.__onButtonEventWrapper__P_155_4);
      },
      /**
       * Initializes the native mouse move event listeners.
       *
       * @signature function()
       */
      _initMoveObserver() {
        this.__onMoveEventWrapper__P_155_5 = qx.lang.Function.listener(this._onMoveEvent, this);
        var Event = qx.bom.Event;
        Event.addNativeListener(this.__root__P_155_2, "mousemove", this.__onMoveEventWrapper__P_155_5);
        Event.addNativeListener(this.__root__P_155_2, "mouseout", this.__onMoveEventWrapper__P_155_5);
        Event.addNativeListener(this.__root__P_155_2, "mouseover", this.__onMoveEventWrapper__P_155_5);
      },
      /**
       * Initializes the native mouse wheel event listeners.
       *
       * @signature function()
       */
      _initWheelObserver() {
        this.__onWheelEventWrapper__P_155_6 = qx.lang.Function.listener(this._onWheelEvent, this);
        var data = qx.bom.client.Event.getMouseWheel(this.__window__P_155_1);
        qx.bom.Event.addNativeListener(data.target, data.type, this.__onWheelEventWrapper__P_155_6);
      },
      /*
      ---------------------------------------------------------------------------
        OBSERVER STOP
      ---------------------------------------------------------------------------
      */

      /**
       * Disconnects the native mouse button event listeners.
       *
       * @signature function()
       */
      _stopButtonObserver() {
        var Event = qx.bom.Event;
        Event.removeNativeListener(this.__root__P_155_2, "mousedown", this.__onButtonEventWrapper__P_155_4);
        Event.removeNativeListener(this.__root__P_155_2, "mouseup", this.__onButtonEventWrapper__P_155_4);
        Event.removeNativeListener(this.__root__P_155_2, "click", this.__onButtonEventWrapper__P_155_4);
        Event.removeNativeListener(this.__root__P_155_2, "dblclick", this.__onButtonEventWrapper__P_155_4);
        Event.removeNativeListener(this.__root__P_155_2, "contextmenu", this.__onButtonEventWrapper__P_155_4);
      },
      /**
       * Disconnects the native mouse move event listeners.
       *
       * @signature function()
       */
      _stopMoveObserver() {
        var Event = qx.bom.Event;
        Event.removeNativeListener(this.__root__P_155_2, "mousemove", this.__onMoveEventWrapper__P_155_5);
        Event.removeNativeListener(this.__root__P_155_2, "mouseover", this.__onMoveEventWrapper__P_155_5);
        Event.removeNativeListener(this.__root__P_155_2, "mouseout", this.__onMoveEventWrapper__P_155_5);
      },
      /**
       * Disconnects the native mouse wheel event listeners.
       *
       * @signature function()
       */
      _stopWheelObserver() {
        var data = qx.bom.client.Event.getMouseWheel(this.__window__P_155_1);
        qx.bom.Event.removeNativeListener(data.target, data.type, this.__onWheelEventWrapper__P_155_6);
      },
      /*
      ---------------------------------------------------------------------------
        NATIVE EVENT OBSERVERS
      ---------------------------------------------------------------------------
      */

      /**
       * Global handler for all mouse move related events like "mousemove",
       * "mouseout" and "mouseover".
       *
       * @signature function(domEvent)
       * @param domEvent {Event} DOM event
       */
      _onMoveEvent: qx.event.GlobalError.observeMethod(function (domEvent) {
        this.__fireEvent__P_155_10(domEvent);
      }),
      /**
       * Global handler for all mouse button related events like "mouseup",
       * "mousedown", "click", "dblclick" and "contextmenu".
       *
       * @signature function(domEvent)
       * @param domEvent {Event} DOM event
       */
      _onButtonEvent: qx.event.GlobalError.observeMethod(function (domEvent) {
        var type = domEvent.type;
        var target = qx.bom.Event.getTarget(domEvent);
        if (type == "click" && this.__preventNextClick__P_155_9) {
          delete this.__preventNextClick__P_155_9;
          return;
        }

        // Safari (and maybe gecko) takes text nodes as targets for events
        // See: http://www.quirksmode.org/js/events_properties.html
        if (qx.core.Environment.get("engine.name") == "gecko" || qx.core.Environment.get("engine.name") == "webkit") {
          if (target && target.nodeType == 3) {
            target = target.parentNode;
          }
        }

        // prevent click events on drop during Drag&Drop [BUG #6846]
        var isDrag = qx.event.handler.DragDrop && this.__manager__P_155_0.getHandler(qx.event.handler.DragDrop).isSessionActive();
        if (isDrag && type == "click") {
          return;
        }
        if (this.__doubleClickFixPre__P_155_11) {
          this.__doubleClickFixPre__P_155_11(domEvent, type, target);
        }
        this.__fireEvent__P_155_10(domEvent, type, target);

        /*
         * In order to normalize middle button click events we
         * need to fire an artificial click event if the client
         * fires auxclick events for non primary buttons instead.
         *
         * See https://github.com/qooxdoo/qooxdoo/issues/9268
         */
        if (type == "auxclick" && domEvent.button == 1) {
          this.__fireEvent__P_155_10(domEvent, "click", target);
        }
        if (this.__rightClickFixPost__P_155_12) {
          this.__rightClickFixPost__P_155_12(domEvent, type, target);
        }
        if (this.__differentTargetClickFixPost__P_155_13 && !isDrag) {
          this.__differentTargetClickFixPost__P_155_13(domEvent, type, target);
        }
        this.__lastEventType__P_155_7 = type;
      }),
      /**
       * Global handler for the mouse wheel event.
       *
       * @signature function(domEvent)
       * @param domEvent {Event} DOM event
       */
      _onWheelEvent: qx.event.GlobalError.observeMethod(function (domEvent) {
        this.__fireEvent__P_155_10(domEvent, "mousewheel");
      }),
      /*
      ---------------------------------------------------------------------------
        CROSS BROWSER SUPPORT FIXES
      ---------------------------------------------------------------------------
      */

      /**
       * Normalizes the click sequence of right click events in Webkit and Opera.
       * The normalized sequence is:
       *
       *  1. mousedown  <- not fired by Webkit
       *  2. mouseup  <- not fired by Webkit
       *  3. contextmenu <- not fired by Opera
       *
       * @param domEvent {Event} original DOM event
       * @param type {String} event type
       * @param target {Element} event target of the DOM event.
       *
       * @signature function(domEvent, type, target)
       */
      __rightClickFixPost__P_155_12: qx.core.Environment.select("engine.name", {
        opera(domEvent, type, target) {
          if (type == "mouseup" && domEvent.button == 2) {
            this.__fireEvent__P_155_10(domEvent, "contextmenu", target);
          }
        },
        default: null
      }),
      /**
       * Normalizes the click sequence of double click event in the Internet
       * Explorer. The normalized sequence is:
       *
       *  1. mousedown
       *  2. mouseup
       *  3. click
       *  4. mousedown  <- not fired by IE
       *  5. mouseup
       *  6. click  <- not fired by IE
       *  7. dblclick
       *
       *  Note: This fix is only applied, when the IE event model is used, otherwise
       *  the fix is ignored.
       *
       * @param domEvent {Event} original DOM event
       * @param type {String} event type
       * @param target {Element} event target of the DOM event.
       *
       * @signature function(domEvent, type, target)
       */
      __doubleClickFixPre__P_155_11: qx.core.Environment.select("engine.name", {
        mshtml(domEvent, type, target) {
          // Do only apply the fix when the event is from the IE event model,
          // otherwise do not apply the fix.
          if (domEvent.target !== undefined) {
            return;
          }
          if (type == "mouseup" && this.__lastEventType__P_155_7 == "click") {
            this.__fireEvent__P_155_10(domEvent, "mousedown", target);
          } else if (type == "dblclick") {
            this.__fireEvent__P_155_10(domEvent, "click", target);
          }
        },
        default: null
      }),
      /**
       * If the mouseup event happens on a different target than the corresponding
       * mousedown event the internet explorer dispatches a click event on the
       * first common ancestor of both targets. The presence of this click event
       * is essential for the qooxdoo widget system. All other browsers don't fire
       * the click event so it must be emulated.
       *
       * @param domEvent {Event} original DOM event
       * @param type {String} event type
       * @param target {Element} event target of the DOM event.
       *
       * @signature function(domEvent, type, target)
       */
      __differentTargetClickFixPost__P_155_13: qx.core.Environment.select("engine.name", {
        mshtml: null,
        default(domEvent, type, target) {
          switch (type) {
            case "mousedown":
              this.__lastMouseDownTarget__P_155_8 = target;
              break;
            case "mouseup":
              if (target !== this.__lastMouseDownTarget__P_155_8) {
                var commonParent = qx.dom.Hierarchy.getCommonParent(target, this.__lastMouseDownTarget__P_155_8);
                if (commonParent) {
                  this.__fireEvent__P_155_10(domEvent, "click", commonParent);
                }
              }
          }
        }
      })
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._stopButtonObserver();
      this._stopMoveObserver();
      this._stopWheelObserver();
      this.__manager__P_155_0 = this.__window__P_155_1 = this.__root__P_155_2 = this.__lastMouseDownTarget__P_155_8 = null;
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
  qx.event.handler.Mouse.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.ObjectRegistry": {},
      "qx.lang.Function": {},
      "qx.bom.Event": {},
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Native": {}
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
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * This class supports typical DOM element inline events like scroll,
   * change, select, ...
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.event.handler.Element", {
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
      this._manager = manager;
      this._registeredEvents = {};
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
        abort: true,
        // Image elements
        load: true,
        // Image elements
        scroll: true,
        select: true,
        reset: true,
        // Form Elements
        submit: true // Form Elements
      },
      /** @type {MAP} Whether the event is cancelable */
      CANCELABLE: {
        selectstart: true
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: false
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
        // Don't handle "load" event of Iframe. Unfortunately, both Element and
        // Iframe handler support "load" event. Should be handled by
        // qx.event.handler.Iframe only. Fixes [#BUG 4587].
        if (type === "load") {
          return target.tagName.toLowerCase() !== "iframe";
        } else {
          return true;
        }
      },
      // interface implementation
      registerEvent(target, type, capture) {
        var elementId = qx.core.ObjectRegistry.toHashCode(target);
        var eventId = elementId + "-" + type;
        var listener = qx.lang.Function.listener(this._onNative, this, eventId);
        qx.bom.Event.addNativeListener(target, type, listener);
        this._registeredEvents[eventId] = {
          element: target,
          type: type,
          listener: listener
        };
      },
      // interface implementation
      unregisterEvent(target, type, capture) {
        var events = this._registeredEvents;
        if (!events) {
          return;
        }
        var elementId = qx.core.ObjectRegistry.toHashCode(target);
        var eventId = elementId + "-" + type;
        var eventData = this._registeredEvents[eventId];
        if (eventData) {
          qx.bom.Event.removeNativeListener(target, type, eventData.listener);
        }
        delete this._registeredEvents[eventId];
      },
      /*
      ---------------------------------------------------------------------------
        EVENT-HANDLER
      ---------------------------------------------------------------------------
      */

      /**
       * Default event handler.
       *
       * @signature function(nativeEvent, eventId)
       * @param nativeEvent {Event} Native event
       * @param eventId {Integer} ID of the event (as stored internally)
       */
      _onNative: qx.event.GlobalError.observeMethod(function (nativeEvent, eventId) {
        var events = this._registeredEvents;
        if (!events) {
          return;
        }
        var eventData = events[eventId];
        var isCancelable = nativeEvent.cancelable || this.constructor.CANCELABLE[eventData.type];
        qx.event.Registration.fireNonBubblingEvent(eventData.element, eventData.type, qx.event.type.Native, [nativeEvent, undefined, undefined, undefined, isCancelable]);
      })
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      var entry;
      var events = this._registeredEvents;
      for (var id in events) {
        entry = events[id];
        qx.bom.Event.removeNativeListener(entry.element, entry.type, entry.listener);
      }
      this._manager = this._registeredEvents = null;
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
  qx.event.handler.Element.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.ObjectRegistry": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.event.Utils": {}
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
       2007-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * This class supports <code>appear</code> and <code>disappear</code> events
   * on DOM level.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.event.handler.Appear", {
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
      this.__manager__P_66_0 = manager;
      this.__targets__P_66_1 = {};

      // Register
      qx.event.handler.Appear.__instances__P_66_2[this.toHashCode()] = this;
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
        appear: true,
        disappear: true
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true,
      /** @type {Map} Stores all appear manager instances */
      __instances__P_66_2: {},
      /**
       * Refreshes all appear handlers. Useful after massive DOM manipulations e.g.
       * through qx.html.Element.
       *
       */
      refresh() {
        var all = this.__instances__P_66_2;
        for (var hash in all) {
          all[hash].refresh();
        }
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __manager__P_66_0: null,
      __targets__P_66_1: null,
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER INTERFACE
      ---------------------------------------------------------------------------
      */

      // interface implementation
      canHandleEvent(target, type) {},
      // interface implementation
      registerEvent(target, type, capture) {
        var hash = qx.core.ObjectRegistry.toHashCode(target) + type;
        var targets = this.__targets__P_66_1;
        if (targets && !targets[hash]) {
          targets[hash] = target;
          target.$$displayed = target.offsetWidth > 0;
        }
      },
      // interface implementation
      unregisterEvent(target, type, capture) {
        var hash = qx.core.ObjectRegistry.toHashCode(target) + type;
        var targets = this.__targets__P_66_1;
        if (!targets) {
          return;
        }
        if (targets[hash]) {
          delete targets[hash];
        }
      },
      /*
      ---------------------------------------------------------------------------
        USER ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * This method should be called by all DOM tree modifying routines
       * to check the registered nodes for changes.
       *
       * @return {qx.Promise?} a promise, if one or more of the event handlers returned one
       */
      refresh() {
        var targets = this.__targets__P_66_1;
        var legacyIe = qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9;
        var tracker = {};
        var self = this;
        Object.keys(targets).forEach(function (hash) {
          var elem = targets[hash];
          if (elem === undefined) {
            return;
          }
          qx.event.Utils.then(tracker, function () {
            var displayed = elem.offsetWidth > 0;
            if (!displayed && legacyIe) {
              // force recalculation in IE 8. See bug #7872
              displayed = elem.offsetWidth > 0;
            }
            if (!!elem.$$displayed !== displayed) {
              elem.$$displayed = displayed;
              var evt = qx.event.Registration.createEvent(displayed ? "appear" : "disappear");
              return self.__manager__P_66_0.dispatchEvent(elem, evt);
            }
          });
        });
        return tracker.promise;
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this.__manager__P_66_0 = this.__targets__P_66_1 = null;

      // Deregister
      delete qx.event.handler.Appear.__instances__P_66_2[this.toHashCode()];
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
  qx.event.handler.Appear.$$dbClassInfo = $$dbClassInfo;
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
      "qx.lang.Function": {},
      "qx.bom.Event": {},
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.bom.Viewport": {},
      "qx.event.type.Orientation": {}
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
   * This class provides a handler for the orientation event.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.event.handler.Orientation", {
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
      this.__manager__P_200_0 = manager;
      this.__window__P_200_1 = manager.getWindow();
      this._initObserver();
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
        orientationchange: 1
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_WINDOW,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __manager__P_200_0: null,
      __window__P_200_1: null,
      __nativeEventType__P_200_2: null,
      _currentOrientation: null,
      __onNativeWrapper__P_200_3: null,
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER INTERFACE
      ---------------------------------------------------------------------------
      */

      // interface implementation
      canHandleEvent(target, type) {
        // Nothing needs to be done here
      },
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
        OBSERVER INIT
      ---------------------------------------------------------------------------
      */

      /**
       * Initializes the native orientation change event listeners.
       */
      _initObserver() {
        this.__onNativeWrapper__P_200_3 = qx.lang.Function.listener(this._onNative, this);

        // Handle orientation change event for Android devices by the resize event.
        // See http://stackoverflow.com/questions/1649086/detect-rotation-of-android-phone-in-the-browser-with-javascript
        // for more information.
        this.__nativeEventType__P_200_2 = qx.bom.Event.supportsEvent(this.__window__P_200_1, "orientationchange") ? "orientationchange" : "resize";
        var Event = qx.bom.Event;
        Event.addNativeListener(this.__window__P_200_1, this.__nativeEventType__P_200_2, this.__onNativeWrapper__P_200_3);
      },
      /*
      ---------------------------------------------------------------------------
        OBSERVER STOP
      ---------------------------------------------------------------------------
      */

      /**
       * Disconnects the native orientation change event listeners.
       */
      _stopObserver() {
        var Event = qx.bom.Event;
        Event.removeNativeListener(this.__window__P_200_1, this.__nativeEventType__P_200_2, this.__onNativeWrapper__P_200_3);
      },
      /*
      ---------------------------------------------------------------------------
        NATIVE EVENT OBSERVERS
      ---------------------------------------------------------------------------
      */

      /**
       * Handler for the native orientation change event.
       *
       * @signature function(domEvent)
       * @param domEvent {Event} The touch event from the browser.
       */
      _onNative: qx.event.GlobalError.observeMethod(function (domEvent) {
        var detectOrientationChangeDelay = 0;
        if (qx.core.Environment.get("os.name") == "android") {
          // On Android Devices the detection of orientation mode has to be delayed.
          // See: http://stackoverflow.com/questions/8985805/orientation-change-in-android-using-javascript
          detectOrientationChangeDelay = 300;
        }
        qx.lang.Function.delay(this._onOrientationChange, detectOrientationChangeDelay, this, domEvent);
      }),
      /**
       * Handler for the detection of an orientation change.
       * @param domEvent {Event} The touch event from the browser.
       */
      _onOrientationChange(domEvent) {
        var Viewport = qx.bom.Viewport;
        var orientation = Viewport.getOrientation(domEvent.target);
        if (this._currentOrientation != orientation) {
          this._currentOrientation = orientation;
          var mode = Viewport.isLandscape(domEvent.target) ? "landscape" : "portrait";
          qx.event.Registration.fireEvent(this.__window__P_200_1, "orientationchange", qx.event.type.Orientation, [orientation, mode]);
        }
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._stopObserver();
      this.__manager__P_200_0 = this.__window__P_200_1 = null;
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
  qx.event.handler.Orientation.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.bom.client.Device": {
        "require": true
      },
      "qx.lang.Function": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Event": {
        "require": true
      },
      "qx.bom.Event": {},
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.element.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "os.name": {
          "load": true,
          "className": "qx.bom.client.OperatingSystem"
        },
        "device.touch": {
          "load": true,
          "className": "qx.bom.client.Device"
        },
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "event.mspointer": {
          "className": "qx.bom.client.Event"
        },
        "engine.version": {
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
       2004-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
       * Tino Butz (tbtz)
       * Christian Hagendorn (chris_schmidt)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */

  /**
   * Listens for native touch events and fires composite events like "tap" and
   * "swipe"
   *
   * @ignore(qx.event.*)
   */
  qx.Bootstrap.define("qx.event.handler.TouchCore", {
    extend: Object,
    implement: [qx.core.IDisposable],
    statics: {
      /** @type {Integer} The maximum distance of a tap. Only if the x or y distance of
       *      the performed tap is less or equal the value of this constant, a tap
       *      event is fired.
       */
      TAP_MAX_DISTANCE: qx.core.Environment.get("os.name") != "android" ? 10 : 40,
      /** @type {Map} The direction of a swipe relative to the axis */
      SWIPE_DIRECTION: {
        x: ["left", "right"],
        y: ["up", "down"]
      },
      /** @type {Integer} The minimum distance of a swipe. Only if the x or y distance
       *      of the performed swipe is greater as or equal the value of this
       *      constant, a swipe event is fired.
       */
      SWIPE_MIN_DISTANCE: qx.core.Environment.get("os.name") != "android" ? 11 : 41,
      /** @type {Integer} The minimum velocity of a swipe. Only if the velocity of the
       *      performed swipe is greater as or equal the value of this constant, a
       *      swipe event is fired.
       */
      SWIPE_MIN_VELOCITY: 0,
      /**
       * @type {Integer} The time delta in milliseconds to fire a long tap event.
       */
      LONGTAP_TIME: qx.core.Environment.get("device.touch") ? 500 : 99999
    },
    /**
     * Create a new instance
     *
     * @param target {Element} element on which to listen for native touch events
     * @param emitter {qx.event.Emitter} Event emitter object
     */
    construct(target, emitter) {
      this.__target__P_201_0 = target;
      this.__emitter__P_201_1 = emitter;
      this._initTouchObserver();
      this.__pointers__P_201_2 = [];
      this.__touchStartPosition__P_201_3 = {};
    },
    members: {
      __target__P_201_0: null,
      __emitter__P_201_1: null,
      __onTouchEventWrapper__P_201_4: null,
      __originalTarget__P_201_5: null,
      __touchStartPosition__P_201_3: null,
      __startTime__P_201_6: null,
      __beginScalingDistance__P_201_7: null,
      __beginRotation__P_201_8: null,
      __pointers__P_201_2: null,
      __touchEventNames__P_201_9: null,
      /*
      ---------------------------------------------------------------------------
        OBSERVER INIT
      ---------------------------------------------------------------------------
      */

      /**
       * Initializes the native touch event listeners.
       */
      _initTouchObserver() {
        this.__onTouchEventWrapper__P_201_4 = qx.lang.Function.listener(this._onTouchEvent, this);
        this.__touchEventNames__P_201_9 = ["touchstart", "touchmove", "touchend", "touchcancel"];

        // Ensure the workaround applies to IE only as intended
        // See: https://github.com/qooxdoo/qooxdoo/issues/10774
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("event.mspointer")) {
          var engineVersion = parseInt(qx.core.Environment.get("engine.version"), 10);
          if (engineVersion == 10) {
            // IE 10
            this.__touchEventNames__P_201_9 = ["MSPointerDown", "MSPointerMove", "MSPointerUp", "MSPointerCancel"];
          } else {
            // IE 11+
            this.__touchEventNames__P_201_9 = ["pointerdown", "pointermove", "pointerup", "pointercancel"];
          }
        }
        for (var i = 0; i < this.__touchEventNames__P_201_9.length; i++) {
          qx.bom.Event.addNativeListener(this.__target__P_201_0, this.__touchEventNames__P_201_9[i], this.__onTouchEventWrapper__P_201_4);
        }
      },
      /*
      ---------------------------------------------------------------------------
        OBSERVER STOP
      ---------------------------------------------------------------------------
      */

      /**
       * Disconnects the native touch event listeners.
       */
      _stopTouchObserver() {
        for (var i = 0; i < this.__touchEventNames__P_201_9.length; i++) {
          qx.bom.Event.removeNativeListener(this.__target__P_201_0, this.__touchEventNames__P_201_9[i], this.__onTouchEventWrapper__P_201_4);
        }
      },
      /*
      ---------------------------------------------------------------------------
        NATIVE EVENT OBSERVERS
      ---------------------------------------------------------------------------
      */

      /**
       * Handler for native touch events.
       *
       * @param domEvent {Event} The touch event from the browser.
       */
      _onTouchEvent(domEvent) {
        this._commonTouchEventHandler(domEvent);
      },
      /**
       * Calculates the scaling distance between two touches.
       * @param touch0 {Event} The touch event from the browser.
       * @param touch1 {Event} The touch event from the browser.
       * @return {Number} the calculated distance.
       */
      _getScalingDistance(touch0, touch1) {
        return Math.sqrt(Math.pow(touch0.pageX - touch1.pageX, 2) + Math.pow(touch0.pageY - touch1.pageY, 2));
      },
      /**
       * Calculates the rotation between two touches.
       * @param touch0 {Event} The touch event from the browser.
       * @param touch1 {Event} The touch event from the browser.
       * @return {Number} the calculated rotation.
       */
      _getRotationAngle(touch0, touch1) {
        var x = touch0.pageX - touch1.pageX;
        var y = touch0.pageY - touch1.pageY;
        return Math.atan2(y, x) * 180 / Math.PI;
      },
      /**
       * Calculates the delta of the touch position relative to its position when <code>touchstart/code> event occurred.
       * @param touches {Array} an array with the current active touches, provided by <code>touchmove/code> event.
       * @return {Array} an array containing objects with the calculated delta as <code>x</code>,
       * <code>y</code> and the identifier of the corresponding touch.
       */
      _calcTouchesDelta(touches) {
        var delta = [];
        for (var i = 0; i < touches.length; i++) {
          delta.push(this._calcSingleTouchDelta(touches[i]));
        }
        return delta;
      },
      /**
       * Calculates the delta of one single touch position relative to its position when <code>touchstart/code> event occurred.
       * @param touch {Event} the current active touch, provided by <code>touchmove/code> event.
       * @return {Map} a map containing deltaX as <code>x</code>, deltaY as <code>y</code>, the direction of the movement as <code>axis</code> and the touch identifier as <code>identifier</code>.
       */
      _calcSingleTouchDelta(touch) {
        if (this.__touchStartPosition__P_201_3.hasOwnProperty(touch.identifier)) {
          var touchStartPosition = this.__touchStartPosition__P_201_3[touch.identifier];
          var deltaX = Math.floor(touch.clientX - touchStartPosition[0]);
          var deltaY = Math.floor(touch.clientY - touchStartPosition[1]);
          var axis = "x";
          if (Math.abs(deltaX / deltaY) < 1) {
            axis = "y";
          }
          return {
            x: deltaX,
            y: deltaY,
            axis: axis,
            identifier: touch.identifier
          };
        } else {
          return {
            x: 0,
            y: 0,
            axis: null,
            identifier: touch.identifier
          };
        }
      },
      /**
       * Called by an event handler.
       *
       * @param domEvent {Event} DOM event
       * @param type {String ? null} type of the event
       */
      _commonTouchEventHandler(domEvent, type) {
        var type = type || domEvent.type;
        if (qx.core.Environment.get("event.mspointer")) {
          type = this._mapPointerEvent(type);
          var touches = this._detectTouchesByPointer(domEvent, type);
          domEvent.changedTouches = touches;
          domEvent.targetTouches = touches;
          domEvent.touches = touches;
        }
        domEvent.delta = [];
        if (type == "touchstart") {
          this.__originalTarget__P_201_5 = this._getTarget(domEvent);
          if (domEvent.touches && domEvent.touches.length > 1) {
            this.__beginScalingDistance__P_201_7 = this._getScalingDistance(domEvent.touches[0], domEvent.touches[1]);
            this.__beginRotation__P_201_8 = this._getRotationAngle(domEvent.touches[0], domEvent.touches[1]);
          }
          for (var i = 0; i < domEvent.changedTouches.length; i++) {
            var touch = domEvent.changedTouches[i];
            this.__touchStartPosition__P_201_3[touch.identifier] = [touch.clientX, touch.clientY];
          }
        }
        if (type == "touchmove") {
          // Polyfill for scale
          if (typeof domEvent.scale == "undefined" && domEvent.targetTouches.length > 1) {
            var currentScalingDistance = this._getScalingDistance(domEvent.targetTouches[0], domEvent.targetTouches[1]);
            domEvent.scale = currentScalingDistance / this.__beginScalingDistance__P_201_7;
          }
          // Polyfill for rotation
          if ((typeof domEvent.rotation == "undefined" || qx.core.Environment.get("event.mspointer")) && domEvent.targetTouches.length > 1) {
            var currentRotation = this._getRotationAngle(domEvent.targetTouches[0], domEvent.targetTouches[1]);
            domEvent._rotation = currentRotation - this.__beginRotation__P_201_8;
          }
          domEvent.delta = this._calcTouchesDelta(domEvent.targetTouches);
        }
        this._fireEvent(domEvent, type, this.__originalTarget__P_201_5);
        if (qx.core.Environment.get("event.mspointer")) {
          if (type == "touchend" || type == "touchcancel") {
            delete this.__pointers__P_201_2[domEvent.pointerId];
          }
        }
        if ((type == "touchend" || type == "touchcancel") && domEvent.changedTouches[0]) {
          delete this.__touchStartPosition__P_201_3[domEvent.changedTouches[0].identifier];
        }
      },
      /**
       * Creates an array with all current used touches out of multiple serial pointer events.
       * Needed because pointerEvents do not provide a touch list.
       * @param domEvent {Event} DOM event
       * @param type {String ? null} type of the event
       * @return {Array} touch list array.
       */
      _detectTouchesByPointer(domEvent, type) {
        var touches = [];
        if (type == "touchstart") {
          this.__pointers__P_201_2[domEvent.pointerId] = domEvent;
        } else if (type == "touchmove") {
          this.__pointers__P_201_2[domEvent.pointerId] = domEvent;
        }
        for (var pointerId in this.__pointers__P_201_2) {
          var pointer = this.__pointers__P_201_2[pointerId];
          touches.push(pointer);
        }
        return touches;
      },
      /**
       * Maps a pointer event type to the corresponding touch event type.
       * @param type {String} the event type to parse.
       * @return {String} the parsed event name.
       */
      _mapPointerEvent(type) {
        type = type.toLowerCase();
        if (type.indexOf("pointerdown") !== -1) {
          return "touchstart";
        } else if (type.indexOf("pointerup") !== -1) {
          return "touchend";
        } else if (type.indexOf("pointermove") !== -1) {
          return "touchmove";
        } else if (type.indexOf("pointercancel") !== -1) {
          return "touchcancel";
        }
        return type;
      },
      /**
       * Return the target of the event.
       *
       * @param domEvent {Event} DOM event
       * @return {Element} Event target
       */
      _getTarget(domEvent) {
        var target = qx.bom.Event.getTarget(domEvent);

        // Text node. Fix Safari Bug, see http://www.quirksmode.org/js/events_properties.html
        if (qx.core.Environment.get("engine.name") == "webkit") {
          if (target && target.nodeType == 3) {
            target = target.parentNode;
          }
        } else if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 11) {
          // Fix for IE10 and pointer-events:none
          //
          // Changed the condition above to match exactly those browsers
          // for which the fix was intended
          // See: https://github.com/qooxdoo/qooxdoo/issues/9481
          //
          var targetForIE = this.__evaluateTarget__P_201_10(domEvent);
          if (targetForIE) {
            target = targetForIE;
          }
        }
        return target;
      },
      /**
       * This method fixes "pointer-events:none" for Internet Explorer 10.
       * Checks which elements are placed to position x/y and traverses the array
       * till one element has no "pointer-events:none" inside its style attribute.
       * @param domEvent {Event} DOM event
       * @return {Element|null} Event target
       */
      __evaluateTarget__P_201_10(domEvent) {
        var clientX = null;
        var clientY = null;
        if (domEvent && domEvent.touches && domEvent.touches.length !== 0) {
          clientX = domEvent.touches[0].clientX;
          clientY = domEvent.touches[0].clientY;
        }

        // Retrieve an array with elements on point X/Y.
        var hitTargets = document.msElementsFromPoint(clientX, clientY);
        if (hitTargets) {
          // Traverse this array for the elements which has no pointer-events:none inside.
          for (var i = 0; i < hitTargets.length; i++) {
            var currentTarget = hitTargets[i];
            var pointerEvents = qx.bom.element.Style.get(currentTarget, "pointer-events", 3);
            if (pointerEvents != "none") {
              return currentTarget;
            }
          }
        }
        return null;
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
          target = this._getTarget(domEvent);
        }
        var type = type || domEvent.type;
        if (target && target.nodeType && this.__emitter__P_201_1) {
          this.__emitter__P_201_1.emit(type, domEvent);
        }
      },
      /**
       * Dispose this object
       */
      dispose() {
        this._stopTouchObserver();
        this.__originalTarget__P_201_5 = this.__target__P_201_0 = this.__touchEventNames__P_201_9 = this.__pointers__P_201_2 = this.__emitter__P_201_1 = this.__beginScalingDistance__P_201_7 = this.__beginRotation__P_201_8 = null;
      }
    }
  });
  qx.event.handler.TouchCore.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.UserAction": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.handler.Orientation": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.type.Tap": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.type.Swipe": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.type.Track": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.type.Rotate": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.type.Pinch": {
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
      "qx.event.handler.TouchCore": {
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
      "qx.event.type.Touch": {},
      "qx.event.type.Data": {},
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Event": {
        "defer": "load",
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "event.touch": {
          "defer": true,
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
       2004-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
       * Tino Butz (tbtz)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * This class provides a unified touch event handler.
   *
   * @require(qx.event.handler.UserAction)
   * @require(qx.event.handler.Orientation)
   * @require(qx.event.type.Tap)
   * @require(qx.event.type.Swipe)
   * @require(qx.event.type.Track)
   * @require(qx.event.type.Rotate)
   * @require(qx.event.type.Pinch)
   */
  qx.Class.define("qx.event.handler.Touch", {
    extend: qx.event.handler.TouchCore,
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
      // Define shorthands
      this.__manager__P_156_0 = manager;
      this.__window__P_156_1 = manager.getWindow();
      this.__root__P_156_2 = this.__window__P_156_1.document;
      qx.event.handler.TouchCore.apply(this, [this.__root__P_156_2]);
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
        touchstart: 1,
        touchmove: 1,
        touchend: 1,
        touchcancel: 1,
        // Appears when the touch is interrupted, e.g. by an alert box
        tap: 1,
        longtap: 1,
        swipe: 1
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE + qx.event.IEventHandler.TARGET_DOCUMENT,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true,
      /** @type {Map} Mapping of mouse events to touch events */
      MOUSE_TO_TOUCH_MAPPING: {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __manager__P_156_0: null,
      __window__P_156_1: null,
      __root__P_156_2: null,
      // Checks if the mouse movement is happening while simulating a touch event
      __isInTouch__P_156_3: false,
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
       * Fire a touch event with the given parameters
       *
       * @param domEvent {Event} DOM event
       * @param type {String ? null} type of the event
       * @param target {Element ? null} event target
       * @param eventTypeClass {Class ? qx.event.type.Touch} the event type class
       */
      _fireEvent(domEvent, type, target, eventTypeClass) {
        if (!target) {
          target = this._getTarget(domEvent);
        }
        var type = type || domEvent.type;
        if (target && target.nodeType) {
          qx.event.Registration.fireEvent(target, type, eventTypeClass || qx.event.type.Touch, [domEvent, target, null, true, true]);
        }

        // Fire user action event
        qx.event.Registration.fireEvent(this.__window__P_156_1, "useraction", qx.event.type.Data, [type]);
      },
      /*
      ---------------------------------------------------------------------------
        NATIVE EVENT OBSERVERS
      ---------------------------------------------------------------------------
      */

      /**
       * Handler for the native touch events.
       *
       * @signature function(domEvent)
       * @param domEvent {Event} The touch event from the browser.
       */
      _onTouchEvent: qx.event.GlobalError.observeMethod(function (domEvent) {
        this._commonTouchEventHandler(domEvent);
      }),
      /**
       * Dispose this object
       */
      dispose() {
        this.__callBase__P_156_4("dispose");
        this.__manager__P_156_0 = this.__window__P_156_1 = this.__root__P_156_2 = null;
      },
      /**
       * Call overridden method.
       *
       * @param method {String} Name of the overridden method.
       * @param args {Array} Arguments.
       */
      __callBase__P_156_4(method, args) {
        qx.event.handler.TouchCore.prototype[method].apply(this, args || []);
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      qx.event.Registration.addHandler(statics);

      // Prevent scrolling on the document to avoid scrolling at all
      if (qx.core.Environment.get("event.touch")) {
        // get the handler to assure that the instance is created
        qx.event.Registration.getManager(document).getHandler(statics);
      }
    }
  });
  qx.event.handler.Touch.$$dbClassInfo = $$dbClassInfo;
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
      "qx.lang.Function": {},
      "qx.bom.Event": {},
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Event": {},
      "qx.event.handler.Appear": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * This class provides a handler for the online event.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.event.handler.Offline", {
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
      this.__manager__P_157_0 = manager;
      this.__window__P_157_1 = manager.getWindow();
      this._initObserver();
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
        online: true,
        offline: true
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_WINDOW,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __manager__P_157_0: null,
      __window__P_157_1: null,
      __onNativeWrapper__P_157_2: null,
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
      /**
       * Connects the native online and offline event listeners.
       */
      _initObserver() {
        this.__onNativeWrapper__P_157_2 = qx.lang.Function.listener(this._onNative, this);
        qx.bom.Event.addNativeListener(this.__window__P_157_1, "offline", this.__onNativeWrapper__P_157_2);
        qx.bom.Event.addNativeListener(this.__window__P_157_1, "online", this.__onNativeWrapper__P_157_2);
      },
      /**
       * Disconnects the native online and offline event listeners.
       */
      _stopObserver() {
        qx.bom.Event.removeNativeListener(this.__window__P_157_1, "offline", this.__onNativeWrapper__P_157_2);
        qx.bom.Event.removeNativeListener(this.__window__P_157_1, "online", this.__onNativeWrapper__P_157_2);
      },
      /**
       * Native handler function which fires a qooxdoo event.
       * @signature function(domEvent)
       * @param domEvent {Event} Native DOM event
       */
      _onNative: qx.event.GlobalError.observeMethod(function (domEvent) {
        qx.event.Registration.fireEvent(this.__window__P_157_1, domEvent.type, qx.event.type.Event, []);
      }),
      /*
      ---------------------------------------------------------------------------
        USER ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Returns whether the current window thinks its online or not.
       * @return {Boolean} <code>true</code> if its online
       */
      isOnline() {
        return !!this.__window__P_157_1.navigator.onLine;
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this.__manager__P_157_0 = null;
      this._stopObserver();

      // Deregister
      delete qx.event.handler.Appear.__instances__P_157_3[this.toHashCode()];
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
  qx.event.handler.Offline.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
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
      "qx.lang.Function": {
        "construct": true
      },
      "qx.bom.client.Engine": {
        "construct": true,
        "require": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.Event": {},
      "qx.event.type.Data": {},
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "construct": true,
          "className": "qx.bom.client.Engine",
          "load": true
        },
        "engine.version": {
          "className": "qx.bom.client.Engine"
        },
        "browser.documentmode": {
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  // Original behavior:
  // ================================================================
  // Normally a "change" event should occur on blur of the element
  // (http://www.w3.org/TR/DOM-Level-2-Events/events.html)

  // However this is not true for "file" upload fields

  // And this is also not true for checkboxes and radiofields (all non mshtml)
  // And this is also not true for select boxes where the selections
  // happens in the opened popup (Gecko + Webkit)

  // Normalized behavior:
  // ================================================================
  // Change on blur for textfields, textareas and file
  // Instant change event on checkboxes, radiobuttons

  // Select field fires on select (when using popup or size>1)
  // but differs when using keyboard:
  // mshtml+opera=keypress; mozilla+safari=blur

  // Input event for textareas does not work in Safari 3 beta (WIN)
  // Safari 3 beta (WIN) repeats change event for select box on blur when selected using popup

  // Opera fires "change" on radio buttons two times for each change

  /**
   * This handler provides an "change" event for all form fields and an
   * "input" event for form fields of type "text" and "textarea".
   *
   * To let these events work it is needed to create the elements using
   * {@link qx.bom.Input}
   */
  qx.Class.define("qx.event.handler.Input", {
    extend: qx.core.Object,
    implement: qx.event.IEventHandler,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.core.Object.constructor.call(this);
      this._onChangeCheckedWrapper = qx.lang.Function.listener(this._onChangeChecked, this);
      this._onChangeValueWrapper = qx.lang.Function.listener(this._onChangeValue, this);
      this._onInputWrapper = qx.lang.Function.listener(this._onInput, this);
      this._onPropertyWrapper = qx.lang.Function.listener(this._onProperty, this);

      // special event handler for opera
      if (qx.core.Environment.get("engine.name") == "opera") {
        this._onKeyDownWrapper = qx.lang.Function.listener(this._onKeyDown, this);
        this._onKeyUpWrapper = qx.lang.Function.listener(this._onKeyUp, this);
      }
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
        input: 1,
        change: 1
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: false
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // special handling for opera
      __enter__P_158_0: false,
      __onInputTimeoutId__P_158_1: null,
      // stores the former set value for opera and IE
      __oldValue__P_158_2: null,
      // stores the former set value for IE
      __oldInputValue__P_158_3: null,
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER INTERFACE
      ---------------------------------------------------------------------------
      */

      // interface implementation
      canHandleEvent(target, type) {
        var lower = target.tagName.toLowerCase();
        if (type === "input" && (lower === "input" || lower === "textarea")) {
          return true;
        }
        if (type === "change" && (lower === "input" || lower === "textarea" || lower === "select")) {
          return true;
        }
        return false;
      },
      // interface implementation
      registerEvent(target, type, capture) {
        if (qx.core.Environment.get("engine.name") == "mshtml" && (qx.core.Environment.get("engine.version") < 9 || qx.core.Environment.get("engine.version") >= 9 && qx.core.Environment.get("browser.documentmode") < 9)) {
          if (!target.__inputHandlerAttached__P_158_4) {
            var tag = target.tagName.toLowerCase();
            var elementType = target.type;
            if (elementType === "text" || elementType === "password" || tag === "textarea" || elementType === "checkbox" || elementType === "radio") {
              qx.bom.Event.addNativeListener(target, "propertychange", this._onPropertyWrapper);
            }
            if (elementType !== "checkbox" && elementType !== "radio") {
              qx.bom.Event.addNativeListener(target, "change", this._onChangeValueWrapper);
            }
            if (elementType === "text" || elementType === "password") {
              this._onKeyPressWrapped = qx.lang.Function.listener(this._onKeyPress, this, target);
              qx.bom.Event.addNativeListener(target, "keypress", this._onKeyPressWrapped);
            }
            target.__inputHandlerAttached__P_158_4 = true;
          }
        } else {
          if (type === "input") {
            this.__registerInputListener__P_158_5(target);
          } else if (type === "change") {
            if (target.type === "radio" || target.type === "checkbox") {
              qx.bom.Event.addNativeListener(target, "change", this._onChangeCheckedWrapper);
            } else {
              qx.bom.Event.addNativeListener(target, "change", this._onChangeValueWrapper);
            }

            // special enter bugfix for opera
            if (qx.core.Environment.get("engine.name") == "opera" || qx.core.Environment.get("engine.name") == "mshtml") {
              if (target.type === "text" || target.type === "password") {
                this._onKeyPressWrapped = qx.lang.Function.listener(this._onKeyPress, this, target);
                qx.bom.Event.addNativeListener(target, "keypress", this._onKeyPressWrapped);
              }
            }
          }
        }
      },
      __registerInputListener__P_158_5: qx.core.Environment.select("engine.name", {
        mshtml(target) {
          if (qx.core.Environment.get("engine.version") >= 9 && qx.core.Environment.get("browser.documentmode") >= 9) {
            qx.bom.Event.addNativeListener(target, "input", this._onInputWrapper);
            if (target.type === "text" || target.type === "password" || target.type === "textarea") {
              // Fixed input for delete and backspace key
              this._inputFixWrapper = qx.lang.Function.listener(this._inputFix, this, target);
              qx.bom.Event.addNativeListener(target, "keyup", this._inputFixWrapper);
            }
          }
        },
        webkit(target) {
          var tag = target.tagName.toLowerCase();

          // the change event is not fired while typing
          // this has been fixed in the latest nightlies
          if (parseFloat(qx.core.Environment.get("engine.version")) < 532 && tag == "textarea") {
            qx.bom.Event.addNativeListener(target, "keypress", this._onInputWrapper);
          }
          qx.bom.Event.addNativeListener(target, "input", this._onInputWrapper);
        },
        opera(target) {
          // register key events for filtering "enter" on input events
          qx.bom.Event.addNativeListener(target, "keyup", this._onKeyUpWrapper);
          qx.bom.Event.addNativeListener(target, "keydown", this._onKeyDownWrapper);

          // register an blur event for preventing the input event on blur

          qx.bom.Event.addNativeListener(target, "input", this._onInputWrapper);
        },
        default(target) {
          qx.bom.Event.addNativeListener(target, "input", this._onInputWrapper);
        }
      }),
      // interface implementation
      unregisterEvent(target, type) {
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("engine.version") < 9 && qx.core.Environment.get("browser.documentmode") < 9) {
          if (target.__inputHandlerAttached__P_158_4) {
            var tag = target.tagName.toLowerCase();
            var elementType = target.type;
            if (elementType === "text" || elementType === "password" || tag === "textarea" || elementType === "checkbox" || elementType === "radio") {
              qx.bom.Event.removeNativeListener(target, "propertychange", this._onPropertyWrapper);
            }
            if (elementType !== "checkbox" && elementType !== "radio") {
              qx.bom.Event.removeNativeListener(target, "change", this._onChangeValueWrapper);
            }
            if (elementType === "text" || elementType === "password") {
              qx.bom.Event.removeNativeListener(target, "keypress", this._onKeyPressWrapped);
            }
            try {
              delete target.__inputHandlerAttached__P_158_4;
            } catch (ex) {
              target.__inputHandlerAttached__P_158_4 = null;
            }
          }
        } else {
          if (type === "input") {
            this.__unregisterInputListener__P_158_6(target);
          } else if (type === "change") {
            if (target.type === "radio" || target.type === "checkbox") {
              qx.bom.Event.removeNativeListener(target, "change", this._onChangeCheckedWrapper);
            } else {
              qx.bom.Event.removeNativeListener(target, "change", this._onChangeValueWrapper);
            }
          }
          if (qx.core.Environment.get("engine.name") == "opera" || qx.core.Environment.get("engine.name") == "mshtml") {
            if (target.type === "text" || target.type === "password") {
              qx.bom.Event.removeNativeListener(target, "keypress", this._onKeyPressWrapped);
            }
          }
        }
      },
      __unregisterInputListener__P_158_6: qx.core.Environment.select("engine.name", {
        mshtml(target) {
          if (qx.core.Environment.get("engine.version") >= 9 && qx.core.Environment.get("browser.documentmode") >= 9) {
            qx.bom.Event.removeNativeListener(target, "input", this._onInputWrapper);
            if (target.type === "text" || target.type === "password" || target.type === "textarea") {
              // Fixed input for delete and backspace key
              qx.bom.Event.removeNativeListener(target, "keyup", this._inputFixWrapper);
            }
          }
        },
        webkit(target) {
          var tag = target.tagName.toLowerCase();

          // the change event is not fired while typing
          // this has been fixed in the latest nightlies
          if (parseFloat(qx.core.Environment.get("engine.version")) < 532 && tag == "textarea") {
            qx.bom.Event.removeNativeListener(target, "keypress", this._onInputWrapper);
          }
          qx.bom.Event.removeNativeListener(target, "input", this._onInputWrapper);
        },
        opera(target) {
          // unregister key events for filtering "enter" on input events
          qx.bom.Event.removeNativeListener(target, "keyup", this._onKeyUpWrapper);
          qx.bom.Event.removeNativeListener(target, "keydown", this._onKeyDownWrapper);
          qx.bom.Event.removeNativeListener(target, "input", this._onInputWrapper);
        },
        default(target) {
          qx.bom.Event.removeNativeListener(target, "input", this._onInputWrapper);
        }
      }),
      /*
      ---------------------------------------------------------------------------
        FOR OPERA AND IE (KEYPRESS TO SIMULATE CHANGE EVENT)
      ---------------------------------------------------------------------------
      */
      /**
       * Handler for fixing the different behavior when pressing the enter key.
       *
       * FF and Safari fire a "change" event if the user presses the enter key.
       * IE and Opera fire the event only if the focus is changed.
       *
       * @signature function(e, target)
       * @param e {Event} DOM event object
       * @param target {Element} The event target
       */
      _onKeyPress: qx.core.Environment.select("engine.name", {
        mshtml(e, target) {
          if (e.keyCode === 13) {
            if (target.value !== this.__oldValue__P_158_2) {
              this.__oldValue__P_158_2 = target.value;
              qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.value]);
            }
          }
        },
        opera(e, target) {
          if (e.keyCode === 13) {
            if (target.value !== this.__oldValue__P_158_2) {
              this.__oldValue__P_158_2 = target.value;
              qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.value]);
            }
          }
        },
        default: null
      }),
      /*
      ---------------------------------------------------------------------------
        FOR IE (KEYUP TO SIMULATE INPUT EVENT)
      ---------------------------------------------------------------------------
      */
      /**
       * Handler for fixing the different behavior when pressing the backspace or
       * delete key.
       *
       * The other browsers fire a "input" event if the user presses the backspace
       * or delete key.
       * IE fire the event only for other keys.
       *
       * @signature function(e, target)
       * @param e {Event} DOM event object
       * @param target {Element} The event target
       */
      _inputFix: qx.core.Environment.select("engine.name", {
        mshtml(e, target) {
          if (e.keyCode === 46 || e.keyCode === 8) {
            if (target.value !== this.__oldInputValue__P_158_3) {
              this.__oldInputValue__P_158_3 = target.value;
              qx.event.Registration.fireEvent(target, "input", qx.event.type.Data, [target.value]);
            }
          }
        },
        default: null
      }),
      /*
      ---------------------------------------------------------------------------
        FOR OPERA ONLY LISTENER (KEY AND BLUR)
      ---------------------------------------------------------------------------
      */
      /**
       * Key event listener for opera which recognizes if the enter key has been
       * pressed.
       *
       * @signature function(e)
       * @param e {Event} DOM event object
       */
      _onKeyDown: qx.core.Environment.select("engine.name", {
        opera(e) {
          // enter is pressed
          if (e.keyCode === 13) {
            this.__enter__P_158_0 = true;
          }
        },
        default: null
      }),
      /**
       * Key event listener for opera which recognizes if the enter key has been
       * pressed.
       *
       * @signature function(e)
       * @param e {Event} DOM event object
       */
      _onKeyUp: qx.core.Environment.select("engine.name", {
        opera(e) {
          // enter is pressed
          if (e.keyCode === 13) {
            this.__enter__P_158_0 = false;
          }
        },
        default: null
      }),
      /*
      ---------------------------------------------------------------------------
        NATIVE EVENT HANDLERS
      ---------------------------------------------------------------------------
      */

      /**
       * Internal function called by input elements created using {@link qx.bom.Input}.
       *
       * @signature function(e)
       * @param e {Event} Native DOM event
       */
      _onInput: qx.event.GlobalError.observeMethod(function (e) {
        var target = qx.bom.Event.getTarget(e);
        var tag = target.tagName.toLowerCase();
        // ignore native input event when triggered by return in input element
        if (!this.__enter__P_158_0 || tag !== "input") {
          // opera lower 10.6 needs a special treatment for input events because
          // they are also fired on blur
          if (qx.core.Environment.get("engine.name") == "opera" && qx.core.Environment.get("browser.version") < 10.6) {
            this.__onInputTimeoutId__P_158_1 = window.setTimeout(function () {
              qx.event.Registration.fireEvent(target, "input", qx.event.type.Data, [target.value]);
            }, 0);
          } else {
            qx.event.Registration.fireEvent(target, "input", qx.event.type.Data, [target.value]);
          }
        }
      }),
      /**
       * Internal function called by input elements created using {@link qx.bom.Input}.
       *
       * @signature function(e)
       * @param e {Event} Native DOM event
       */
      _onChangeValue: qx.event.GlobalError.observeMethod(function (e) {
        var target = qx.bom.Event.getTarget(e);
        var data = target.value;
        if (target.type === "select-multiple") {
          var data = [];
          for (var i = 0, o = target.options, l = o.length; i < l; i++) {
            if (o[i].selected) {
              data.push(o[i].value);
            }
          }
        }
        qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [data]);
      }),
      /**
       * Internal function called by input elements created using {@link qx.bom.Input}.
       *
       * @signature function(e)
       * @param e {Event} Native DOM event
       */
      _onChangeChecked: qx.event.GlobalError.observeMethod(function (e) {
        var target = qx.bom.Event.getTarget(e);
        if (target.type === "radio") {
          if (target.checked) {
            qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.value]);
          }
        } else {
          qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.checked]);
        }
      }),
      /**
       * Internal function called by input elements created using {@link qx.bom.Input}.
       *
       * @signature function(e)
       * @param e {Event} Native DOM event
       */
      _onProperty: qx.core.Environment.select("engine.name", {
        mshtml: qx.event.GlobalError.observeMethod(function (e) {
          var target = qx.bom.Event.getTarget(e);
          var prop = e.propertyName;
          if (prop === "value" && (target.type === "text" || target.type === "password" || target.tagName.toLowerCase() === "textarea")) {
            if (!target.$$inValueSet) {
              qx.event.Registration.fireEvent(target, "input", qx.event.type.Data, [target.value]);
            }
          } else if (prop === "checked") {
            if (target.type === "checkbox") {
              qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.checked]);
            } else if (target.checked) {
              qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.value]);
            }
          }
        }),
        default() {}
      })
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
  qx.event.handler.Input.$$dbClassInfo = $$dbClassInfo;
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
      "qx.event.IEventHandler": {
        "require": true
      },
      "qx.lang.Function": {
        "construct": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.bom.Event": {},
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Dom": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2021 Zenesis Limited, https://www.zenesis.com
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (johnspackman, john.spackman@zenesis.com)
  
  ************************************************************************ */

  /**
   * Defines the event handlers for Video tags - also Audio because they are identical
   */
  qx.Class.define("qx.event.handler.Video", {
    extend: qx.core.Object,
    implement: qx.event.IEventHandler,
    construct() {
      qx.core.Object.constructor.call(this);
      this.__onNativeListener__P_159_0 = qx.lang.Function.listener(this._onNative, this);
    },
    statics: {
      /** @type {Integer} Priority of this handler */
      PRIORITY: qx.event.Registration.PRIORITY_NORMAL,
      /** @type {Map} Supported event types */
      SUPPORTED_TYPES: {
        abort: 1,
        canplay: 1,
        canplaythrough: 1,
        durationchange: 1,
        emptied: 1,
        ended: 1,
        error: 1,
        loadeddata: 1,
        loadedmetadata: 1,
        loadstart: 1,
        pause: 1,
        play: 1,
        playing: 1,
        progress: 1,
        ratechange: 1,
        seeked: 1,
        seeking: 1,
        stalled: 1,
        suspend: 1,
        timeupdate: 1,
        volumechange: 1,
        waiting: 1
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: false
    },
    members: {
      // interface implementation
      canHandleEvent(target, type) {
        var lower = target.tagName.toLowerCase();
        if (lower === "video" || lower === "audio") {
          return true;
        }
        return false;
      },
      // interface implementation
      registerEvent(target, type, capture) {
        qx.bom.Event.addNativeListener(target, type, this.__onNativeListener__P_159_0);
      },
      /**
       * Default event handler for events that do not bubble
       *
       * @signature function(domEvent, eventId)
       * @param domEvent {Event} Native event
       */
      _onNative: qx.event.GlobalError.observeMethod(function (domEvent) {
        let target = qx.bom.Event.getTarget(domEvent);
        qx.event.Registration.fireNonBubblingEvent(target, domEvent.type, qx.event.type.Dom, [domEvent, target, undefined, undefined, domEvent.cancelable]);
      }),
      // interface implementation
      unregisterEvent(target, type) {
        qx.bom.Event.removeNativeListener(target, type, this.__onNativeListener__P_159_0);
      }
    },
    defer(statics) {
      qx.event.Registration.addHandler(statics);
    }
  });
  qx.event.handler.Video.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.dispatch.Direct": {
        "require": true
      },
      "qx.event.dispatch.DomBubbling": {
        "require": true
      },
      "qx.event.handler.Keyboard": {
        "require": true
      },
      "qx.event.handler.Mouse": {
        "require": true
      },
      "qx.event.handler.Element": {
        "require": true
      },
      "qx.event.handler.Appear": {
        "require": true
      },
      "qx.event.handler.Touch": {
        "require": true
      },
      "qx.event.handler.Offline": {
        "require": true
      },
      "qx.event.handler.Input": {
        "require": true
      },
      "qx.event.handler.Pointer": {
        "require": true
      },
      "qx.event.handler.Gesture": {
        "require": true
      },
      "qx.event.handler.Video": {
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
      "qx.event.Registration": {},
      "qx.event.handler.Focus": {},
      "qx.event.dispatch.MouseCapture": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.xml.Document": {},
      "qx.dom.Hierarchy": {}
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
   * This class is mainly a convenience wrapper for DOM elements to
   * qooxdoo's event system.
   *
   * @require(qx.event.dispatch.Direct)
   * @require(qx.event.dispatch.DomBubbling)
   * @require(qx.event.handler.Keyboard)
   * @require(qx.event.handler.Mouse)
   * @require(qx.event.handler.Element)
   * @require(qx.event.handler.Appear)
   * @require(qx.event.handler.Touch)
   * @require(qx.event.handler.Offline)
   * @require(qx.event.handler.Input)
   * @require(qx.event.handler.Pointer)
   * @require(qx.event.handler.Gesture)
   * @require(qx.event.handler.Video)
   */
  qx.Class.define("qx.bom.Element", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /*
      ---------------------------------------------------------------------------
        EVENTS
      ---------------------------------------------------------------------------
      */

      /**
       * Add an event listener to a DOM element. The event listener is passed an
       * instance of {@link Event} containing all relevant information
       * about the event as parameter.
       *
       * @param element {Element} DOM element to attach the event on.
       * @param type {String} Name of the event e.g. "click", "keydown", ...
       * @param listener {Function} Event listener function
       * @param self {Object ? null} Reference to the 'this' variable inside
       *         the event listener. When not given, the corresponding dispatcher
       *         usually falls back to a default, which is the target
       *         by convention. Note this is not a strict requirement, i.e.
       *         custom dispatchers can follow a different strategy.
       * @param capture {Boolean} Whether to attach the event to the
       *       capturing phase or the bubbling phase of the event. The default is
       *       to attach the event handler to the bubbling phase.
       * @return {String} An opaque id, which can be used to remove the event listener
       *       using the {@link #removeListenerById} method.
       */
      addListener(element, type, listener, self, capture) {
        return qx.event.Registration.addListener(element, type, listener, self, capture);
      },
      /**
       * Remove an event listener from a from DOM node.
       *
       * Note: All registered event listeners will automatically be removed from
       *   the DOM at page unload so it is not necessary to detach events yourself.
       *
       * @param element {Element} DOM Element
       * @param type {String} Name of the event
       * @param listener {Function} The pointer to the event listener
       * @param self {Object ? null} Reference to the 'this' variable inside
       *         the event listener.
       * @param capture {Boolean} Whether to remove the event listener of
       *       the bubbling or of the capturing phase.
       * @return {Boolean} <code>true</code> if the listener was removed
       */
      removeListener(element, type, listener, self, capture) {
        return qx.event.Registration.removeListener(element, type, listener, self, capture);
      },
      /**
       * Removes an event listener from an event target by an id returned by
       * {@link #addListener}
       *
       * @param target {Object} The event target
       * @param id {String} The id returned by {@link #addListener}
       * @return {Boolean} <code>true</code> if the listener was removed
       */
      removeListenerById(target, id) {
        return qx.event.Registration.removeListenerById(target, id);
      },
      /**
       * Check whether there are one or more listeners for an event type
       * registered at the element.
       *
       * @param element {Element} DOM element
       * @param type {String} The event type
       * @param capture {Boolean ? false} Whether to check for listeners of
       *       the bubbling or of the capturing phase.
       * @return {Boolean} Whether the element has event listeners of the given type.
       */
      hasListener(element, type, capture) {
        return qx.event.Registration.hasListener(element, type, capture);
      },
      /**
       * Focuses the given element. The element needs to have a positive <code>tabIndex</code> value.
       *
       * @param element {Element} DOM element to focus
       */
      focus(element) {
        qx.event.Registration.getManager(element).getHandler(qx.event.handler.Focus).focus(element);
      },
      /**
       * Blurs the given element
       *
       * @param element {Element} DOM element to blur
       */
      blur(element) {
        qx.event.Registration.getManager(element).getHandler(qx.event.handler.Focus).blur(element);
      },
      /**
       * Activates the given element. The active element receives all key board events.
       *
       * @param element {Element} DOM element to focus
       */
      activate(element) {
        qx.event.Registration.getManager(element).getHandler(qx.event.handler.Focus).activate(element);
      },
      /**
       * Deactivates the given element. The active element receives all key board events.
       *
       * @param element {Element} DOM element to focus
       */
      deactivate(element) {
        qx.event.Registration.getManager(element).getHandler(qx.event.handler.Focus).deactivate(element);
      },
      /**
       * Captures the given element
       *
       * @param element {Element} DOM element to capture
       * @param containerCapture {Boolean?true} If true all events originating in
       *   the container are captured. If false events originating in the container
       *   are not captured.
       */
      capture(element, containerCapture) {
        qx.event.Registration.getManager(element).getDispatcher(qx.event.dispatch.MouseCapture).activateCapture(element, containerCapture);
      },
      /**
       * Releases the given element (from a previous {@link #capture} call)
       *
       * @param element {Element} DOM element to release
       */
      releaseCapture(element) {
        qx.event.Registration.getManager(element).getDispatcher(qx.event.dispatch.MouseCapture).releaseCapture(element);
      },
      /*
      ---------------------------------------------------------------------------
        UTILS
      ---------------------------------------------------------------------------
      */

      /**
       * Clone given DOM element. May optionally clone all attached
       * events (recursively) as well.
       *
       * @param element {Element} Element to clone
       * @param events {Boolean?false} Whether events should be copied as well
       * @return {Element} The copied element
       */
      clone(element, events) {
        var clone;
        if (events || qx.core.Environment.get("engine.name") == "mshtml" && !qx.xml.Document.isXmlDocument(element)) {
          var mgr = qx.event.Registration.getManager(element);
          var all = qx.dom.Hierarchy.getDescendants(element);
          all.push(element);
        }

        // IE copies events bound via attachEvent() when
        // using cloneNode(). Calling detachEvent() on the
        // clone will also remove the events from the original.
        //
        // In order to get around this, we detach all locally
        // attached events first, do the cloning and recover
        // them afterwards again.
        if (qx.core.Environment.get("engine.name") == "mshtml") {
          for (var i = 0, l = all.length; i < l; i++) {
            mgr.toggleAttachedEvents(all[i], false);
          }
        }

        // Do the native cloning
        var clone = element.cloneNode(true);

        // Recover events on original elements
        if (qx.core.Environment.get("engine.name") == "mshtml") {
          for (var i = 0, l = all.length; i < l; i++) {
            mgr.toggleAttachedEvents(all[i], true);
          }
        }

        // Attach events from original element
        if (events === true) {
          // Produce recursive list of elements in the clone
          var cloneAll = qx.dom.Hierarchy.getDescendants(clone);
          cloneAll.push(clone);

          // Process all elements and copy over listeners
          var eventList, cloneElem, origElem, eventEntry;
          for (var i = 0, il = all.length; i < il; i++) {
            origElem = all[i];
            eventList = mgr.serializeListeners(origElem);
            if (eventList.length > 0) {
              cloneElem = cloneAll[i];
              for (var j = 0, jl = eventList.length; j < jl; j++) {
                eventEntry = eventList[j];
                mgr.addListener(cloneElem, eventEntry.type, eventEntry.handler, eventEntry.self, eventEntry.capture);
              }
            }
          }
        }

        // Finally return the clone
        return clone;
      }
    }
  });
  qx.bom.Element.$$dbClassInfo = $$dbClassInfo;
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
      "qx.dom.Node": {},
      "qx.bom.client.Html": {
        "require": true
      },
      "qx.lang.Array": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "html.element.contains": {
          "className": "qx.bom.client.Html"
        },
        "html.element.compareDocumentPosition": {
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
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * Prototype JS
       http://www.prototypejs.org/
       Version 1.5
  
       Copyright:
         (c) 2006-2007, Prototype Core Team
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
       Authors:
         * Prototype Core Team
  
     ----------------------------------------------------------------------
  
       Copyright (c) 2005-2008 Sam Stephenson
  
       Permission is hereby granted, free of charge, to any person
       obtaining a copy of this software and associated documentation
       files (the "Software"), to deal in the Software without restriction,
       including without limitation the rights to use, copy, modify, merge,
       publish, distribute, sublicense, and/or sell copies of the Software,
       and to permit persons to whom the Software is furnished to do so,
       subject to the following conditions:
  
       THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
       EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
       MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
       NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
       HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
       WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
       OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
       DEALINGS IN THE SOFTWARE.
  
  ************************************************************************ */

  /**
   * Methods to operate on nodes and elements on a DOM tree. This contains
   * special getters to query for child nodes, siblings, etc. This class also
   * supports to operate on one element and reorganize the content with
   * the insertion of new HTML or nodes.
   */
  qx.Bootstrap.define("qx.dom.Hierarchy", {
    statics: {
      /**
       * Returns the DOM index of the given node
       *
       * @param node {Node} Node to look for
       * @return {Integer} The DOM index
       */
      getNodeIndex(node) {
        var index = 0;
        while (node && (node = node.previousSibling)) {
          index++;
        }
        return index;
      },
      /**
       * Returns the DOM index of the given element (ignoring non-elements)
       *
       * @param element {Element} Element to look for
       * @return {Integer} The DOM index
       */
      getElementIndex(element) {
        var index = 0;
        var type = qx.dom.Node.ELEMENT;
        while (element && (element = element.previousSibling)) {
          if (element.nodeType == type) {
            index++;
          }
        }
        return index;
      },
      /**
       * Return the next element to the supplied element
       *
       * "nextSibling" is not good enough as it might return a text or comment element
       *
       * @param element {Element} Starting element node
       * @return {Element|null} Next element node
       */
      getNextElementSibling(element) {
        while (element && (element = element.nextSibling) && !qx.dom.Node.isElement(element)) {
          continue;
        }
        return element || null;
      },
      /**
       * Return the previous element to the supplied element
       *
       * "previousSibling" is not good enough as it might return a text or comment element
       *
       * @param element {Element} Starting element node
       * @return {Element|null} Previous element node
       */
      getPreviousElementSibling(element) {
        while (element && (element = element.previousSibling) && !qx.dom.Node.isElement(element)) {
          continue;
        }
        return element || null;
      },
      /**
       * Whether the first element contains the second one
       *
       * Uses native non-standard contains() in Internet Explorer,
       * Opera and Webkit (supported since Safari 3.0 beta)
       *
       * @param element {Element} Parent element
       * @param target {Node} Child node
       * @return {Boolean}
       */
      contains(element, target) {
        if (qx.core.Environment.get("html.element.contains")) {
          if (qx.dom.Node.isDocument(element)) {
            var doc = qx.dom.Node.getDocument(target);
            return element && doc == element;
          } else if (qx.dom.Node.isDocument(target)) {
            return false;
          } else {
            return element.contains(target);
          }
        } else if (qx.core.Environment.get("html.element.compareDocumentPosition")) {
          // https://developer.mozilla.org/en-US/docs/DOM:Node.compareDocumentPosition
          return !!(element.compareDocumentPosition(target) & 16);
        } else {
          while (target) {
            if (element == target) {
              return true;
            }
            target = target.parentNode;
          }
          return false;
        }
      },
      /**
       * Whether the element is inserted into the document
       * for which it was created.
       *
       * @param element {Element} DOM element to check
       * @return {Boolean} <code>true</code> when the element is inserted
       *    into the document.
       */
      isRendered(element) {
        var doc = element.ownerDocument || element.document;
        if (qx.core.Environment.get("html.element.contains")) {
          // Fast check for all elements which are not in the DOM
          if (!element.parentNode) {
            return false;
          }
          return doc.body.contains(element);
        } else if (qx.core.Environment.get("html.element.compareDocumentPosition")) {
          // Gecko way, DOM3 method
          return !!(doc.compareDocumentPosition(element) & 16);
        } else {
          while (element) {
            if (element == doc.body) {
              return true;
            }
            element = element.parentNode;
          }
          return false;
        }
      },
      /**
       * Checks if <code>element</code> is a descendant of <code>ancestor</code>.
       *
       * @param element {Element} first element
       * @param ancestor {Element} second element
       * @return {Boolean} Element is a descendant of ancestor
       */
      isDescendantOf(element, ancestor) {
        return this.contains(ancestor, element);
      },
      /**
       * Get the common parent element of two given elements. Returns
       * <code>null</code> when no common element has been found.
       *
       * Uses native non-standard contains() in Opera and Internet Explorer
       *
       * @param element1 {Element} First element
       * @param element2 {Element} Second element
       * @return {Element} the found parent, if none was found <code>null</code>
       */
      getCommonParent(element1, element2) {
        if (element1 === element2) {
          return element1;
        }
        if (qx.core.Environment.get("html.element.contains")) {
          while (element1 && qx.dom.Node.isElement(element1)) {
            if (element1.contains(element2)) {
              return element1;
            }
            element1 = element1.parentNode;
          }
          return null;
        } else {
          var known = [];
          while (element1 || element2) {
            if (element1) {
              if (known.includes(element1)) {
                return element1;
              }
              known.push(element1);
              element1 = element1.parentNode;
            }
            if (element2) {
              if (known.includes(element2)) {
                return element2;
              }
              known.push(element2);
              element2 = element2.parentNode;
            }
          }
          return null;
        }
      },
      /**
       * Collects all of element's ancestors and returns them as an array of
       * elements.
       *
       * @param element {Element} DOM element to query for ancestors
       * @return {Array} list of all parents
       */
      getAncestors(element) {
        return this._recursivelyCollect(element, "parentNode");
      },
      /**
       * Returns element's children.
       *
       * @param element {Element} DOM element to query for child elements
       * @return {Array} list of all child elements
       */
      getChildElements(element) {
        element = element.firstChild;
        if (!element) {
          return [];
        }
        var arr = this.getNextSiblings(element);
        if (element.nodeType === 1) {
          arr.unshift(element);
        }
        return arr;
      },
      /**
       * Collects all of element's descendants (deep) and returns them as an array
       * of elements.
       *
       * @param element {Element} DOM element to query for child elements
       * @return {Array} list of all found elements
       */
      getDescendants(element) {
        return qx.lang.Array.fromCollection(element.getElementsByTagName("*"));
      },
      /**
       * Returns the first child that is an element. This is opposed to firstChild DOM
       * property which will return any node (whitespace in most usual cases).
       *
       * @param element {Element} DOM element to query for first descendant
       * @return {Element} the first descendant
       */
      getFirstDescendant(element) {
        element = element.firstChild;
        while (element && element.nodeType != 1) {
          element = element.nextSibling;
        }
        return element;
      },
      /**
       * Returns the last child that is an element. This is opposed to lastChild DOM
       * property which will return any node (whitespace in most usual cases).
       *
       * @param element {Element} DOM element to query for last descendant
       * @return {Element} the last descendant
       */
      getLastDescendant(element) {
        element = element.lastChild;
        while (element && element.nodeType != 1) {
          element = element.previousSibling;
        }
        return element;
      },
      /**
       * Collects all of element's previous siblings and returns them as an array of elements.
       *
       * @param element {Element} DOM element to query for previous siblings
       * @return {Array} list of found DOM elements
       */
      getPreviousSiblings(element) {
        return this._recursivelyCollect(element, "previousSibling");
      },
      /**
       * Collects all of element's next siblings and returns them as an array of
       * elements.
       *
       * @param element {Element} DOM element to query for next siblings
       * @return {Array} list of found DOM elements
       */
      getNextSiblings(element) {
        return this._recursivelyCollect(element, "nextSibling");
      },
      /**
       * Recursively collects elements whose relationship is specified by
       * property.  <code>property</code> has to be a property (a method won't
       * do!) of element that points to a single DOM node. Returns an array of
       * elements.
       *
       * @param element {Element} DOM element to start with
       * @param property {String} property to look for
       * @return {Array} result list
       */
      _recursivelyCollect(element, property) {
        var list = [];
        while (element = element[property]) {
          if (element.nodeType == 1) {
            list.push(element);
          }
        }
        return list;
      },
      /**
       * Collects all of element's siblings and returns them as an array of elements.
       *
       * @param element {var} DOM element to start with
       * @return {Array} list of all found siblings
       */
      getSiblings(element) {
        return this.getPreviousSiblings(element).reverse().concat(this.getNextSiblings(element));
      },
      /**
       * Whether the given element is empty.
       * Inspired by Base2 (Dean Edwards)
       *
       * @param element {Element} The element to check
       * @return {Boolean} true when the element is empty
       */
      isEmpty(element) {
        element = element.firstChild;
        while (element) {
          if (element.nodeType === qx.dom.Node.ELEMENT || element.nodeType === qx.dom.Node.TEXT) {
            return false;
          }
          element = element.nextSibling;
        }
        return true;
      },
      /**
       * Removes all of element's text nodes which contain only whitespace
       *
       * @param element {Element} Element to cleanup
       */
      cleanWhitespace(element) {
        var node = element.firstChild;
        while (node) {
          var nextNode = node.nextSibling;
          if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {
            element.removeChild(node);
          }
          node = nextNode;
        }
      }
    }
  });
  qx.dom.Hierarchy.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.element.Style": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.dom.Node": {},
      "qx.bom.Viewport": {},
      "qx.bom.element.Location": {},
      "qx.event.Registration": {}
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
   * Contains methods to control and query the element's scroll properties
   */
  qx.Class.define("qx.bom.element.Scroll", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Integer} The typical native scrollbar size in the environment */
      __scrollbarSize__P_64_0: null,
      /**
       * Get the typical native scrollbar size in the environment
       *
       * @return {Number} The native scrollbar size
       */
      getScrollbarWidth() {
        if (this.__scrollbarSize__P_64_0 !== null) {
          return this.__scrollbarSize__P_64_0;
        }
        var Style = qx.bom.element.Style;
        var getStyleSize = function (el, propertyName) {
          return parseInt(Style.get(el, propertyName), 10) || 0;
        };
        var getBorderRight = function (el) {
          return Style.get(el, "borderRightStyle") == "none" ? 0 : getStyleSize(el, "borderRightWidth");
        };
        var getBorderLeft = function (el) {
          return Style.get(el, "borderLeftStyle") == "none" ? 0 : getStyleSize(el, "borderLeftWidth");
        };
        var getInsetRight = qx.core.Environment.select("engine.name", {
          mshtml(el) {
            if (Style.get(el, "overflowY") == "hidden" || el.clientWidth == 0) {
              return getBorderRight(el);
            }
            return Math.max(0, el.offsetWidth - el.clientLeft - el.clientWidth);
          },
          default(el) {
            // Alternative method if clientWidth is unavailable
            // clientWidth == 0 could mean both: unavailable or really 0
            if (el.clientWidth == 0) {
              var ov = Style.get(el, "overflow");
              var sbv = ov == "scroll" || ov == "-moz-scrollbars-vertical" ? 16 : 0;
              return Math.max(0, getBorderRight(el) + sbv);
            }
            return Math.max(0, el.offsetWidth - el.clientWidth - getBorderLeft(el));
          }
        });
        var getScrollBarSizeRight = function (el) {
          return getInsetRight(el) - getBorderRight(el);
        };
        var t = document.createElement("div");
        var s = t.style;
        s.height = s.width = "100px";
        s.overflow = "scroll";
        document.body.appendChild(t);
        var c = getScrollBarSizeRight(t);
        this.__scrollbarSize__P_64_0 = c;
        document.body.removeChild(t);
        return this.__scrollbarSize__P_64_0;
      },
      /*
      ---------------------------------------------------------------------------
        SCROLL INTO VIEW
      ---------------------------------------------------------------------------
      */

      /**
       * The method scrolls the element into view (x-axis only).
       *
       * @param element {Element} DOM element to scroll into view
       * @param stop {Element?null} Any parent element which functions as
       *   outermost element to scroll. Default is the HTML document.
       * @param align {String?null} Alignment of the element. Allowed values:
       *   <code>left</code> or <code>right</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       */
      intoViewX(element, stop, align) {
        var parent = element.parentNode;
        var doc = qx.dom.Node.getDocument(element);
        var body = doc.body;
        var parentLocation, parentLeft, parentRight;
        var parentOuterWidth, parentClientWidth, parentScrollWidth;
        var parentLeftBorder, parentRightBorder, parentScrollBarWidth;
        var elementLocation, elementLeft, elementRight, elementWidth;
        var leftOffset, rightOffset, scrollDiff;
        var alignLeft = align === "left";
        var alignRight = align === "right";

        // Correcting stop position
        stop = stop ? stop.parentNode : doc;

        // Go up the parent chain
        while (parent && parent != stop) {
          // "overflow" is always visible for both: document.body and document.documentElement
          if (parent.scrollWidth > parent.clientWidth && (parent === body || qx.bom.element.Style.get(parent, "overflowY") != "visible")) {
            // Calculate parent data
            // Special handling for body element
            if (parent === body) {
              parentLeft = parent.scrollLeft;
              parentRight = parentLeft + qx.bom.Viewport.getWidth();
              parentOuterWidth = qx.bom.Viewport.getWidth();
              parentClientWidth = parent.clientWidth;
              parentScrollWidth = parent.scrollWidth;
              parentLeftBorder = 0;
              parentRightBorder = 0;
              parentScrollBarWidth = 0;
            } else {
              parentLocation = qx.bom.element.Location.get(parent);
              parentLeft = parentLocation.left;
              parentRight = parentLocation.right;
              parentOuterWidth = parent.offsetWidth;
              parentClientWidth = parent.clientWidth;
              parentScrollWidth = parent.scrollWidth;
              parentLeftBorder = parseInt(qx.bom.element.Style.get(parent, "borderLeftWidth"), 10) || 0;
              parentRightBorder = parseInt(qx.bom.element.Style.get(parent, "borderRightWidth"), 10) || 0;
              parentScrollBarWidth = parentOuterWidth - parentClientWidth - parentLeftBorder - parentRightBorder;
            }

            // Calculate element data
            elementLocation = qx.bom.element.Location.get(element);
            elementLeft = elementLocation.left;
            elementRight = elementLocation.right;
            elementWidth = element.offsetWidth;

            // Relative position from each other
            leftOffset = elementLeft - parentLeft - parentLeftBorder;
            rightOffset = elementRight - parentRight + parentRightBorder;

            // Scroll position rearrangement
            scrollDiff = 0;

            // be sure that element is on left edge
            if (alignLeft) {
              scrollDiff = leftOffset;
            }

            // be sure that element is on right edge
            else if (alignRight) {
              scrollDiff = rightOffset + parentScrollBarWidth;
            }

            // element must go down
            // * when current left offset is smaller than 0
            // * when width is bigger than the inner width of the parent
            else if (leftOffset < 0 || elementWidth > parentClientWidth) {
              scrollDiff = leftOffset;
            }

            // element must go up
            // * when current right offset is bigger than 0
            else if (rightOffset > 0) {
              scrollDiff = rightOffset + parentScrollBarWidth;
            }
            parent.scrollLeft += scrollDiff;

            // Browsers that follow the CSSOM View Spec fire the "scroll"
            // event asynchronously. See #intoViewY for more details.
            qx.event.Registration.fireNonBubblingEvent(parent, "scroll");
          }
          if (parent === body) {
            break;
          }
          parent = parent.parentNode;
        }
      },
      /**
       * The method scrolls the element into view (y-axis only).
       *
       * @param element {Element} DOM element to scroll into view
       * @param stop {Element?null} Any parent element which functions as
       *   outermost element to scroll. Default is the HTML document.
       * @param align {String?null} Alignment of the element. Allowed values:
       *   <code>top</code> or <code>bottom</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       */
      intoViewY(element, stop, align) {
        var parent = element.parentNode;
        var doc = qx.dom.Node.getDocument(element);
        var body = doc.body;
        var parentLocation, parentTop, parentBottom;
        var parentOuterHeight, parentClientHeight, parentScrollHeight;
        var parentTopBorder, parentBottomBorder, parentScrollBarHeight;
        var elementLocation, elementTop, elementBottom, elementHeight;
        var topOffset, bottomOffset, scrollDiff;
        var alignTop = align === "top";
        var alignBottom = align === "bottom";

        // Correcting stop position
        stop = stop ? stop.parentNode : doc;

        // Go up the parent chain
        while (parent && parent != stop) {
          // "overflow" is always visible for both: document.body and document.documentElement
          if (parent.scrollHeight > parent.clientHeight && (parent === body || qx.bom.element.Style.get(parent, "overflowY") != "visible")) {
            // Calculate parent data
            // Special handling for body element
            if (parent === body) {
              parentTop = parent.scrollTop;
              parentBottom = parentTop + qx.bom.Viewport.getHeight();
              parentOuterHeight = qx.bom.Viewport.getHeight();
              parentClientHeight = parent.clientHeight;
              parentScrollHeight = parent.scrollHeight;
              parentTopBorder = 0;
              parentBottomBorder = 0;
              parentScrollBarHeight = 0;
            } else {
              parentLocation = qx.bom.element.Location.get(parent);
              parentTop = parentLocation.top;
              parentBottom = parentLocation.bottom;
              parentOuterHeight = parent.offsetHeight;
              parentClientHeight = parent.clientHeight;
              parentScrollHeight = parent.scrollHeight;
              parentTopBorder = parseInt(qx.bom.element.Style.get(parent, "borderTopWidth"), 10) || 0;
              parentBottomBorder = parseInt(qx.bom.element.Style.get(parent, "borderBottomWidth"), 10) || 0;
              parentScrollBarHeight = parentOuterHeight - parentClientHeight - parentTopBorder - parentBottomBorder;
            }

            // Calculate element data
            elementLocation = qx.bom.element.Location.get(element);
            elementTop = elementLocation.top;
            elementBottom = elementLocation.bottom;
            elementHeight = element.offsetHeight;

            // Relative position from each other
            topOffset = elementTop - parentTop - parentTopBorder;
            bottomOffset = elementBottom - parentBottom + parentBottomBorder;

            // Scroll position rearrangement
            scrollDiff = 0;

            // be sure that element is on top edge
            if (alignTop) {
              scrollDiff = topOffset;
            }

            // be sure that element is on bottom edge
            else if (alignBottom) {
              scrollDiff = bottomOffset + parentScrollBarHeight;
            }

            // element must go down
            // * when current top offset is smaller than 0
            // * when height is bigger than the inner height of the parent
            else if (topOffset < 0 || elementHeight > parentClientHeight) {
              scrollDiff = topOffset;
            }

            // element must go up
            // * when current bottom offset is bigger than 0
            else if (bottomOffset > 0) {
              scrollDiff = bottomOffset + parentScrollBarHeight;
            }
            parent.scrollTop += scrollDiff;

            // Browsers that follow the CSSOM View Spec fire the "scroll"
            // event asynchronously.
            //
            // The widget layer expects the "scroll" event to be fired before
            // the "appear" event. Fire non-bubbling "scroll" in all browsers,
            // since a duplicate "scroll" should not cause any issues and it
            // is hard to track which version of the browser engine started to
            // follow the CSSOM Spec. Fixes [BUG #4570].
            qx.event.Registration.fireNonBubblingEvent(parent, "scroll");
          }
          if (parent === body) {
            break;
          }
          parent = parent.parentNode;
        }
      },
      /**
       * The method scrolls the element into view.
       *
       * @param element {Element} DOM element to scroll into view
       * @param stop {Element?null} Any parent element which functions as
       *   outermost element to scroll. Default is the HTML document.
       * @param alignX {String} Alignment of the element. Allowed values:
       *   <code>left</code> or <code>right</code>. Could also be undefined.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       * @param alignY {String} Alignment of the element. Allowed values:
       *   <code>top</code> or <code>bottom</code>. Could also be undefined.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       */
      intoView(element, stop, alignX, alignY) {
        this.intoViewX(element, stop, alignX);
        this.intoViewY(element, stop, alignY);
      }
    }
  });
  qx.bom.element.Scroll.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.Range": {},
      "qx.util.StringSplit": {},
      "qx.bom.client.Engine": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "html.selection": {
          "load": true,
          "className": "qx.bom.client.Html"
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
       * Alexander Steitz (aback)
  
  ************************************************************************ */

  /**
   * Low-level selection API to select elements like input and textarea elements
   * as well as text nodes or elements which their child nodes.
   *
   * @ignore(qx.bom.Element, qx.bom.Element.blur)
   */
  qx.Bootstrap.define("qx.bom.Selection", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Returns the native selection object.
       *
       * @signature function(documentNode)
       * @param documentNode {document} Document node to retrieve the connected selection from
       * @return {Selection} native selection object
       */
      getSelectionObject: qx.core.Environment.select("html.selection", {
        selection(documentNode) {
          return documentNode.selection;
        },
        // suitable for gecko, opera, webkit and mshtml >= 9
        default(documentNode) {
          return qx.dom.Node.getWindow(documentNode).getSelection();
        }
      }),
      /**
       * Returns the current selected text.
       *
       * @signature function(node)
       * @param node {Node} node to retrieve the selection for
       * @return {String|null} selected text as string
       */
      get: qx.core.Environment.select("html.selection", {
        selection(node) {
          // to get the selected text in legacy IE you have to work with the TextRange
          // of the selection object. So always pass the document node to the
          // Range class to get this TextRange object.
          var rng = qx.bom.Range.get(qx.dom.Node.getDocument(node));
          return rng.text;
        },
        // suitable for gecko, opera and webkit
        default(node) {
          if (this.__isInputOrTextarea__P_65_0(node)) {
            return node.value.substring(node.selectionStart, node.selectionEnd);
          } else {
            return this.getSelectionObject(qx.dom.Node.getDocument(node)).toString();
          }
        }
      }),
      /**
       * Returns the length of the selection
       *
       * @signature function(node)
       * @param node {Node} Form node or document/window to check.
       * @return {Integer|null} length of the selection or null
       */
      getLength: qx.core.Environment.select("html.selection", {
        selection(node) {
          var selectedValue = this.get(node);
          // get the selected part and split it by linebreaks
          var split = qx.util.StringSplit.split(selectedValue, /\r\n/);

          // return the length substracted by the count of linebreaks
          // legacy IE counts linebreaks as two chars
          // -> harmonize this to one char per linebreak
          return selectedValue.length - (split.length - 1);
        },
        default(node) {
          if (qx.core.Environment.get("engine.name") == "opera") {
            var selectedValue, selectedLength, split;
            if (this.__isInputOrTextarea__P_65_0(node)) {
              var start = node.selectionStart;
              var end = node.selectionEnd;
              selectedValue = node.value.substring(start, end);
              selectedLength = end - start;
            } else {
              selectedValue = qx.bom.Selection.get(node);
              selectedLength = selectedValue.length;
            }

            // get the selected part and split it by linebreaks
            split = qx.util.StringSplit.split(selectedValue, /\r\n/);

            // substract the count of linebreaks
            // Opera counts each linebreak as two chars
            // -> harmonize this to one char per linebreak
            return selectedLength - (split.length - 1);
          }

          // suitable for gecko and webkit
          if (this.__isInputOrTextarea__P_65_0(node)) {
            return node.selectionEnd - node.selectionStart;
          } else {
            return this.get(node).length;
          }
        }
      }),
      /**
       * Returns the start of the selection
       *
       * @signature function(node)
       * @param node {Node} node to check for
       * @return {Integer} start of current selection or "-1" if the current
       *                   selection is not within the given node
       */
      getStart: qx.core.Environment.select("html.selection", {
        selection(node) {
          if (this.__isInputOrTextarea__P_65_0(node)) {
            var documentRange = qx.bom.Range.get();

            // Check if the document.selection is the text range inside the input element
            if (!node.contains(documentRange.parentElement())) {
              return -1;
            }
            var range = qx.bom.Range.get(node);
            var len = node.value.length;

            // Synchronize range start and end points
            range.moveToBookmark(documentRange.getBookmark());
            range.moveEnd("character", len);
            return len - range.text.length;
          } else {
            var range = qx.bom.Range.get(node);
            var parentElement = range.parentElement();

            // get a range which holds the text of the parent element
            var elementRange = qx.bom.Range.get();
            try {
              // IE throws an invalid argument error when the document has no selection
              elementRange.moveToElementText(parentElement);
            } catch (ex) {
              return 0;
            }

            // Move end points of full range so it starts at the user selection
            // and ends at the end of the element text.
            var bodyRange = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));
            bodyRange.setEndPoint("StartToStart", range);
            bodyRange.setEndPoint("EndToEnd", elementRange);

            // selection is at beginning
            if (elementRange.compareEndPoints("StartToStart", bodyRange) == 0) {
              return 0;
            }
            var moved;
            var steps = 0;
            while (true) {
              moved = bodyRange.moveStart("character", -1);

              // Starting points of both ranges are equal
              if (elementRange.compareEndPoints("StartToStart", bodyRange) == 0) {
                break;
              }

              // Moving had no effect -> range is at begin of body
              if (moved == 0) {
                break;
              } else {
                steps++;
              }
            }
            return ++steps;
          }
        },
        default(node) {
          if (qx.core.Environment.get("engine.name") === "gecko" || qx.core.Environment.get("engine.name") === "webkit") {
            if (this.__isInputOrTextarea__P_65_0(node)) {
              return node.selectionStart;
            } else {
              var documentElement = qx.dom.Node.getDocument(node);
              var documentSelection = this.getSelectionObject(documentElement);

              // gecko and webkit do differ how the user selected the text
              // "left-to-right" or "right-to-left"
              if (documentSelection.anchorOffset < documentSelection.focusOffset) {
                return documentSelection.anchorOffset;
              } else {
                return documentSelection.focusOffset;
              }
            }
          }
          if (this.__isInputOrTextarea__P_65_0(node)) {
            return node.selectionStart;
          } else {
            return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).anchorOffset;
          }
        }
      }),
      /**
       * Returns the end of the selection
       *
       * @signature function(node)
       * @param node {Node} node to check
       * @return {Integer} end of current selection
       */
      getEnd: qx.core.Environment.select("html.selection", {
        selection(node) {
          if (this.__isInputOrTextarea__P_65_0(node)) {
            var documentRange = qx.bom.Range.get();

            // Check if the document.selection is the text range inside the input element
            if (!node.contains(documentRange.parentElement())) {
              return -1;
            }
            var range = qx.bom.Range.get(node);
            var len = node.value.length;

            // Synchronize range start and end points
            range.moveToBookmark(documentRange.getBookmark());
            range.moveStart("character", -len);
            return range.text.length;
          } else {
            var range = qx.bom.Range.get(node);
            var parentElement = range.parentElement();

            // get a range which holds the text of the parent element
            var elementRange = qx.bom.Range.get();
            try {
              // IE throws an invalid argument error when the document has no selection
              elementRange.moveToElementText(parentElement);
            } catch (ex) {
              return 0;
            }
            var len = elementRange.text.length;

            // Move end points of full range so it ends at the user selection
            // and starts at the start of the element text.
            var bodyRange = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));
            bodyRange.setEndPoint("EndToEnd", range);
            bodyRange.setEndPoint("StartToStart", elementRange);

            // selection is at beginning
            if (elementRange.compareEndPoints("EndToEnd", bodyRange) == 0) {
              return len - 1;
            }
            var moved;
            var steps = 0;
            while (true) {
              moved = bodyRange.moveEnd("character", 1);

              // Ending points of both ranges are equal
              if (elementRange.compareEndPoints("EndToEnd", bodyRange) == 0) {
                break;
              }

              // Moving had no effect -> range is at begin of body
              if (moved == 0) {
                break;
              } else {
                steps++;
              }
            }
            return len - ++steps;
          }
        },
        default(node) {
          if (qx.core.Environment.get("engine.name") === "gecko" || qx.core.Environment.get("engine.name") === "webkit") {
            if (this.__isInputOrTextarea__P_65_0(node)) {
              return node.selectionEnd;
            } else {
              var documentElement = qx.dom.Node.getDocument(node);
              var documentSelection = this.getSelectionObject(documentElement);

              // gecko and webkit do differ how the user selected the text
              // "left-to-right" or "right-to-left"
              if (documentSelection.focusOffset > documentSelection.anchorOffset) {
                return documentSelection.focusOffset;
              } else {
                return documentSelection.anchorOffset;
              }
            }
          }
          if (this.__isInputOrTextarea__P_65_0(node)) {
            return node.selectionEnd;
          } else {
            return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).focusOffset;
          }
        }
      }),
      /**
       * Utility method to check for an input or textarea element
       *
       * @param node {Node} node to check
       * @return {Boolean} Whether the given node is an input or textarea element
       */
      __isInputOrTextarea__P_65_0(node) {
        return qx.dom.Node.isElement(node) && (node.nodeName.toLowerCase() == "input" || node.nodeName.toLowerCase() == "textarea");
      },
      /**
       * Sets a selection at the given node with the given start and end.
       * For text nodes, input and textarea elements the start and end parameters
       * set the boundaries at the text.
       * For element nodes the start and end parameters are used to select the
       * childNodes of the given element.
       *
       * @signature function(node, start, end)
       * @param node {Node} node to set the selection at
       * @param start {Integer} start of the selection
       * @param end {Integer} end of the selection
       * @return {Boolean} whether a selection is drawn
       */
      set: qx.core.Environment.select("html.selection", {
        selection(node, start, end) {
          var rng;

          // if the node is the document itself then work on with the body element
          if (qx.dom.Node.isDocument(node)) {
            node = node.body;
          }
          if (qx.dom.Node.isElement(node) || qx.dom.Node.isText(node)) {
            switch (node.nodeName.toLowerCase()) {
              case "input":
              case "textarea":
              case "button":
                if (end === undefined) {
                  end = node.value.length;
                }
                if (start >= 0 && start <= node.value.length && end >= 0 && end <= node.value.length) {
                  rng = qx.bom.Range.get(node);
                  rng.collapse(true);
                  rng.moveStart("character", start);
                  rng.moveEnd("character", end - start);
                  rng.select();
                  return true;
                }
                break;
              case "#text":
                if (end === undefined) {
                  end = node.nodeValue.length;
                }
                if (start >= 0 && start <= node.nodeValue.length && end >= 0 && end <= node.nodeValue.length) {
                  // get a range of the body element
                  rng = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));

                  // use the parent node -> "moveToElementText" expects an element
                  rng.moveToElementText(node.parentNode);
                  rng.collapse(true);
                  rng.moveStart("character", start);
                  rng.moveEnd("character", end - start);
                  rng.select();
                  return true;
                }
                break;
              default:
                if (end === undefined) {
                  end = node.childNodes.length - 1;
                }

                // check start and end -> childNodes
                if (node.childNodes[start] && node.childNodes[end]) {
                  // get the TextRange of the body element
                  // IMPORTANT: only with a range of the body the method "moveElementToText" is available
                  rng = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));
                  // position it at the given node
                  rng.moveToElementText(node.childNodes[start]);
                  rng.collapse(true);

                  // create helper range
                  var newRng = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));
                  newRng.moveToElementText(node.childNodes[end]);

                  // set the end of the range to the end of the helper range
                  rng.setEndPoint("EndToEnd", newRng);
                  rng.select();
                  return true;
                }
            }
          }
          return false;
        },
        // suitable for gecko, opera, webkit and mshtml >=9
        default(node, start, end) {
          // special handling for input and textarea elements
          var nodeName = node.nodeName.toLowerCase();
          if (qx.dom.Node.isElement(node) && (nodeName == "input" || nodeName == "textarea")) {
            // if "end" is not given set it to the end
            if (end === undefined) {
              end = node.value.length;
            }

            // check boundaries
            if (start >= 0 && start <= node.value.length && end >= 0 && end <= node.value.length) {
              node.focus();
              node.select();
              // IE can throw "Unspecified error"
              try {
                node.setSelectionRange(start, end);
              } catch (ex) {}
              return true;
            }
          } else {
            var validBoundaries = false;
            var sel = qx.dom.Node.getWindow(node).getSelection();
            var rng = qx.bom.Range.get(node);

            // element or text node?
            // for elements nodes the offsets are applied to childNodes
            // for text nodes the offsets are applied to the text content
            if (qx.dom.Node.isText(node)) {
              if (end === undefined) {
                end = node.length;
              }
              if (start >= 0 && start < node.length && end >= 0 && end <= node.length) {
                validBoundaries = true;
              }
            } else if (qx.dom.Node.isElement(node)) {
              if (end === undefined) {
                end = node.childNodes.length - 1;
              }
              if (start >= 0 && node.childNodes[start] && end >= 0 && node.childNodes[end]) {
                validBoundaries = true;
              }
            } else if (qx.dom.Node.isDocument(node)) {
              // work on with the body element
              node = node.body;
              if (end === undefined) {
                end = node.childNodes.length - 1;
              }
              if (start >= 0 && node.childNodes[start] && end >= 0 && node.childNodes[end]) {
                validBoundaries = true;
              }
            }
            if (validBoundaries) {
              // collapse the selection if needed
              if (!sel.isCollapsed) {
                sel.collapseToStart();
              }

              // set start and end of the range
              rng.setStart(node, start);

              // for element nodes set the end after the childNode
              if (qx.dom.Node.isText(node)) {
                rng.setEnd(node, end);
              } else {
                rng.setEndAfter(node.childNodes[end]);
              }

              // remove all existing ranges and add the new one
              if (sel.rangeCount > 0) {
                sel.removeAllRanges();
              }
              sel.addRange(rng);
              return true;
            }
          }
          return false;
        }
      }),
      /**
       * Selects all content/childNodes of the given node
       *
       * @param node {Node} text, element or document node
       * @return {Boolean} whether a selection is drawn
       */
      setAll(node) {
        return qx.bom.Selection.set(node, 0);
      },
      /**
       * Clears the selection on the given node.
       *
       * @param node {Node} node to clear the selection for
       */
      clear: qx.core.Environment.select("html.selection", {
        selection(node) {
          var rng = qx.bom.Range.get(node);
          var parent = rng.parentElement();
          var documentRange = qx.bom.Range.get(qx.dom.Node.getDocument(node));

          // only collapse if the selection is really on the given node
          // -> compare the two parent elements of the ranges with each other and
          // the given node
          if (qx.dom.Node.isText(node)) {
            node = node.parentNode;
          }
          if (parent == documentRange.parentElement() && parent == node) {
            var sel = qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node));
            sel.empty();
          }
        },
        default(node) {
          var sel = qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node));
          var nodeName = node.nodeName.toLowerCase();

          // if the node is an input or textarea element use the specialized methods
          if (qx.dom.Node.isElement(node) && (nodeName == "input" || nodeName == "textarea")) {
            // IE can throw "Unspecified error"
            try {
              node.setSelectionRange(0, 0);
            } catch (ex) {}
            if (qx.bom.Element && qx.bom.Element.blur) {
              qx.bom.Element.blur(node);
            }
          }
          // if the given node is the body/document node -> collapse the selection
          else if (qx.dom.Node.isDocument(node) || nodeName == "body") {
            sel.collapse(node.body ? node.body : node, 0);
          }
          // if an element/text node is given the current selection has to
          // encompass the node. Only then the selection is cleared.
          else {
            var rng = qx.bom.Range.get(node);
            if (!rng.collapsed) {
              var compareNode;
              var commonAncestor = rng.commonAncestorContainer;

              // compare the parentNode of the textNode with the given node
              // (if this node is an element) to decide whether the selection
              // is cleared or not.
              if (qx.dom.Node.isElement(node) && qx.dom.Node.isText(commonAncestor)) {
                compareNode = commonAncestor.parentNode;
              } else {
                compareNode = commonAncestor;
              }
              if (compareNode == node) {
                sel.collapse(node, 0);
              }
            }
          }
        }
      })
    }
  });
  qx.bom.Selection.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.MObjectId": {},
      "qx.core.Init": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2017 Zenesis Limited, http://www.zenesis.com
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (john.spackman@zenesis.com, @johnspackman)
  
  ************************************************************************ */

  /**
   * Provides a registry of top level objects
   */
  qx.Class.define("qx.core.Id", {
    extend: qx.core.Object,
    type: "singleton",
    members: {
      __registeredObjects__P_73_0: null,
      __registeredIdHashes__P_73_1: null,
      /*
       * @Override
       */
      _createQxObject(id) {
        // Create the object, but don't add it to the list of owned objects
        var result = this._createQxObjectImpl(id);
        return result;
      },
      /*
       * @Override
       */
      _createQxObjectImpl(id) {
        {
          let object = qx.core.MObjectId.handleObjects(qx.core.Id, this, ...arguments);
          if (object !== undefined) {
            return object;
          }
        }
        if (this.__registeredObjects__P_73_0) {
          var obj = this.__registeredObjects__P_73_0[id];
          if (obj !== undefined) {
            return obj;
          }
        }
        switch (id) {
          case "application":
            return qx.core.Init.getApplication() || undefined;
        }
        return undefined;
      },
      /**
       * Returns an object path which can be used to locate an object anywhere in the application
       * with a call to `qx.core.Id.getQxObject()`.
       *
       * This will return null if it is not possible to calculate a path because one of the
       * ancestors has a null `qxObjectId`.
       *
       * This will also return null if the top-most ancestor is not one of the globals registered
       * with `registerObject` or a known global (such as the application); however, by passing
       * `true` as the `suppressWarnings` parameter, this will prevent errors from appearing in
       * the console when this happens
       *
       * @param obj {qx.core.Object} the object
       * @param suppressWarnings {Boolean?} default: false; silently returns null if an ID cannot be created
       * @return {String} full path to the object
       */
      getAbsoluteIdOf(obj, suppressWarnings) {
        if (this.__registeredIdHashes__P_73_1 && this.__registeredIdHashes__P_73_1[obj.toHashCode()]) {
          return obj.getQxObjectId();
        }
        var segs = [];
        var application = qx.core.Init.getApplication();
        while (obj) {
          var id = obj.getQxObjectId();
          if (!id) {
            if (!suppressWarnings) {
              this.error("Cannot determine an absolute Object ID because one of the ancestor ObjectID's is null (got as far as " + segs.join("/") + ")");
            }
            return null;
          }
          segs.unshift(id);
          var owner = obj.getQxOwner();
          if (owner) {
            // Find the ID of the owner, *if* it is registered as a top level object
            var ownerId = null;
            if (owner === application) {
              ownerId = "application";
            } else {
              ownerId = this.__registeredIdHashes__P_73_1 && this.__registeredIdHashes__P_73_1[owner.toHashCode()] || null;
            }

            // When we have found the ID of a top level object, add it to the path and stop
            if (ownerId) {
              segs.unshift(ownerId);
              break;
            }
          } else {
            if (!suppressWarnings) {
              this.error("Cannot determine a global absolute Object ID because the topmost object is not registered");
            }
            return null;
          }
          obj = owner;
        }
        var path = segs.join("/");
        return path;
      },
      /**
       * Registers an object with an ID; as this is registering a global object which is the root of a tree
       * of objects with IDs, the `id` parameter can be provided to set the ID used for the root object - this
       * allows an object to be registered under a well known, common name without affecting the API of the
       * object.
       *
       * @param obj {qx.core.Object} the object to register
       * @param id {String?} the ID to register the object under, otherwise the object's own Object Id is used
       */
      register(obj, id) {
        if (!this.__registeredObjects__P_73_0) {
          this.__registeredObjects__P_73_0 = {};
          this.__registeredIdHashes__P_73_1 = {};
        }
        if (!id) {
          id = obj.getQxObjectId();
        }
        this.__registeredObjects__P_73_0[id] = obj;
        this.__registeredIdHashes__P_73_1[obj.toHashCode()] = id;
        obj._cascadeQxObjectIdChanges();
      },
      /**
       * Unregisters a previously registered object with an ID
       *
       * @param data {Object|String} the object to unregister, or the ID of the object
       * @return {Boolean} whether there was an object to unregister
       */
      unregister(data) {
        if (!this.__registeredObjects__P_73_0) {
          return false;
        }
        var id;
        if (typeof data == "string") {
          id = data;
        } else {
          var hash = data.toHashCode();
          id = this.__registeredIdHashes__P_73_1[hash];
          if (!id) {
            return false;
          }
        }
        var obj = this.__registeredObjects__P_73_0[id];
        if (obj) {
          delete this.__registeredObjects__P_73_0[id];
          delete this.__registeredIdHashes__P_73_1[obj.toHashCode()];
          obj._cascadeQxObjectIdChanges();
          return true;
        }
        return false;
      },
      /**
       * Returns a map of the objects that have been registered as id roots, with
       * the topmost part of the ID as key.
       * @return {Object}
       */
      getRegisteredObjects() {
        return this.__registeredObjects__P_73_0;
      }
    },
    statics: {
      /**
       * Returns a top level instance
       *
       * @param id {String} the ID to look for
       * @return {qx.core.Object?} the object
       */
      getQxObject(id) {
        return this.getInstance().getQxObject(id);
      },
      /**
       * Helper for `qx.core.Id.getAbsoluteIdOf`
       *
       * @param obj {qx.core.Object} the object
       * @param suppressWarnings {Boolean?} default: false; silently returns null if an ID cannot be created
       * @return {String} full path to the object
       */
      getAbsoluteIdOf(obj, suppressWarnings) {
        return this.getInstance().getAbsoluteIdOf(obj, suppressWarnings);
      }
    }
  });
  qx.core.Id.$$dbClassInfo = $$dbClassInfo;
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
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2023 ZenesisUK https://www.zenesis.com/
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Will Johnson (WillsterJohnson)
  
  ************************************************************************ */

  /**
   * The slot turns JSX from a syntax convenience into a declaratively expressive system.
   *
   * Passing children to a custom tag:
   * ```jsx
   * const MyFirstSlot = () => (
   *   <p>
   *     <slot />
   *   </p>
   * );
   *
   * const UseFirstSlot = (
   *   <MyFirstSlot>
   *     Lorem Ipsum Dolor Sit Amet
   *   </MyFirstSlot>
   * );
   * ```
   * Output:
   * ```html
   * <p>
   *   Lorem Ipsum Dolor Sit Amet
   * </p>
   * ```
   *
   * Declared children of the slot are the default children to use when no
   * children are passed or injected. Default children may be *any* valid JSX.
   *
   * Slots are named by passing a `name` attribute to the slot, and used by
   * passing a corresponding `slot` attribute to the child. In this way, slots
   * can be used to declare multiple remote children of the Custom Tag.
   */
  qx.Class.define("qx.html.Slot", {
    extend: qx.html.Element,
    /**
     * Creates a new Slot
     *
     * @see constructor for {Element}
     */
    construct(slotName) {
      if (typeof slotName === "string" && !slotName?.match(/^[a-zA-Z0-9\-\_]+$/)) {
        throw new Error(`Slot name "${slotName}" is invalid! Slot names may only contain alphanumeric characters, hyphens, and underscores.`);
      }
      qx.html.Element.constructor.call(this, "slot", {}, {
        name: slotName ?? qx.html.Slot.DEFAULT
      });
      this._defaultChildren = [];
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**@override */
      inject() {
        throw new Error("Cannot inject into <slot>! Injections only work for the top-most element of a JSX expression.");
      },
      /**@override */
      _serializeImpl(serializer) {
        serializer.openTag(this._nodeName);
        serializer.pushQxObject(this);
        let id = serializer.getQxObjectIdFor(this);
        if (id) {
          serializer.setAttribute("data-qx-object-id", `"${id}"`);
        }

        // Children
        if (this._children?.length) {
          for (var i = 0; i < this._children.length; i++) {
            this._children[i]._serializeImpl(serializer);
          }
        } else {
          for (var i = 0; i < this._defaultChildren.length; i++) {
            this._defaultChildren[i]._serializeImpl(serializer);
          }
        }
        serializer.closeTag();
        serializer.popQxObject(this);
      },
      /*
      ---------------------------------------------------------------------------
        SLOT API
      ---------------------------------------------------------------------------
      */

      _defaultChildren: null,
      /**
       * @returns {ReadonlyArray<qx.html.Node>} The default children of this slot
       */
      getDefaultChildren() {
        return this._defaultChildren;
      },
      addDefaultChild(child) {
        try {
          this._defaultChildren.push(child);
        } catch (e) {
          throw new Error("Cannot modify default children of <slot> outside of declaration!");
        }
      },
      sealDefaultChildren() {
        Object.seal(this._defaultChildren);
      },
      getName() {
        return this.getAttribute("name");
      }
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */
    statics: {
      DEFAULT: "qx.html.Slot.DEFAULT"
    }
  });
  qx.html.Slot.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.element.Style": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.dom.Node": {}
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
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Contains support for calculating dimensions of HTML elements.
   *
   * We differ between the box (or border) size which is available via
   * {@link #getWidth} and {@link #getHeight} and the content or scroll
   * sizes which are available via {@link #getContentWidth} and
   * {@link #getContentHeight}.
   */
  qx.Bootstrap.define("qx.bom.element.Dimension", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Returns the rendered width of the given element.
       *
       * This is the visible width of the object, which need not to be identical
       * to the width configured via CSS. This highly depends on the current
       * box-sizing for the document and maybe even for the element.
       *
       * @signature function(element)
       * @param element {Element} element to query
       * @return {Integer} width of the element
       */
      getWidth(element) {
        var rect = element.getBoundingClientRect();
        return Math.round(rect.right - rect.left);
      },
      /**
       * Returns the rendered height of the given element.
       *
       * This is the visible height of the object, which need not to be identical
       * to the height configured via CSS. This highly depends on the current
       * box-sizing for the document and maybe even for the element.
       *
       * @signature function(element)
       * @param element {Element} element to query
       * @return {Integer} height of the element
       */
      getHeight(element) {
        var rect = element.getBoundingClientRect();
        return Math.round(rect.bottom - rect.top);
      },
      /**
       * Returns the rendered size of the given element.
       *
       * @param element {Element} element to query
       * @return {Map} map containing the width and height of the element
       */
      getSize(element) {
        return {
          width: this.getWidth(element),
          height: this.getHeight(element)
        };
      },
      /**
       * Returns the outer height of the given element, including height, vertical padding, and vertical borders
       *
       * @param element {Element} element to query
       * @param includeMargins {Boolean?} whether to include margins in teh
       * @return {Integer} the height of the element
       */
      getOuterHeight(element, includeMargins) {
        if (includeMargins) {
          let marginTop = parseInt(document.defaultView.getComputedStyle(element, "").getPropertyValue("margin-top"), 10);
          let marginBottom = parseInt(document.defaultView.getComputedStyle(element, "").getPropertyValue("margin-bottom"), 10);
          return element.offsetHeight + marginTop + marginBottom;
        }
        return element.offsetHeight;
      },
      /**
       * Returns the outer width of the given element, including height, vertical padding, and vertical borders
       *
       * @param element {Element} element to query
       * @param includeMargins {Boolean?} whether to include margins in teh
       * @return {Integer} the width of the element
       */
      getOuterWidth(element, includeMargins) {
        if (includeMargins) {
          let marginLeft = parseInt(document.defaultView.getComputedStyle(element, "").getPropertyValue("margin-left"), 10);
          let marginRight = parseInt(document.defaultView.getComputedStyle(element, "").getPropertyValue("margin-right"), 10);
          return element.offsetWidth + marginLeft + marginRight;
        }
        return element.offsetWidth;
      },
      /**
       * Returns the outer size of the given element, including height, vertical padding, and vertical borders
       *
       * @param element {Element} element to query
       * @param includeMargins {Boolean?} whether to include margins in teh
       * @return {Map} map containing the width and height of the element
       */
      getOuterSize(element, includeMargins) {
        return {
          width: this.getOuterWidth(element, includeMargins),
          height: this.getOuterHeight(element, includeMargins)
        };
      },
      /** @type {Map} Contains all overflow values where scrollbars are invisible */
      __hiddenScrollbars__P_77_0: {
        visible: true,
        hidden: true
      },
      /**
       * Returns the content width.
       *
       * The content width is basically the maximum
       * width used or the maximum width which can be used by the content. This
       * excludes all kind of styles of the element like borders, paddings, margins,
       * and even scrollbars.
       *
       * Please note that with visible scrollbars the content width returned
       * may be larger than the box width returned via {@link #getWidth}.
       *
       * @param element {Element} element to query
       * @return {Integer} Computed content width
       */
      getContentWidth(element) {
        var Style = qx.bom.element.Style;
        var overflowX = qx.bom.element.Style.get(element, "overflowX");
        var paddingLeft = parseInt(Style.get(element, "paddingLeft") || "0px", 10);
        var paddingRight = parseInt(Style.get(element, "paddingRight") || "0px", 10);
        if (this.__hiddenScrollbars__P_77_0[overflowX]) {
          var contentWidth = element.clientWidth;
          if (qx.core.Environment.get("engine.name") == "opera" || qx.dom.Node.isBlockNode(element)) {
            contentWidth = contentWidth - paddingLeft - paddingRight;
          }

          // IE seems to return 0 on clientWidth if the element is 0px
          // in height so we use the offsetWidth instead
          if (qx.core.Environment.get("engine.name") == "mshtml") {
            if (contentWidth === 0 && element.offsetHeight === 0) {
              return element.offsetWidth;
            }
          }
          return contentWidth;
        } else {
          if (element.clientWidth >= element.scrollWidth) {
            // Scrollbars visible, but not needed? We need to substract both paddings
            return Math.max(element.clientWidth, element.scrollWidth) - paddingLeft - paddingRight;
          } else {
            // Scrollbars visible and needed. We just remove the left padding,
            // as the right padding is not respected in rendering.
            var width = element.scrollWidth - paddingLeft;

            // IE renders the paddingRight as well with scrollbars on
            if (qx.core.Environment.get("engine.name") == "mshtml") {
              width -= paddingRight;
            }
            return width;
          }
        }
      },
      /**
       * Returns the content height.
       *
       * The content height is basically the maximum
       * height used or the maximum height which can be used by the content. This
       * excludes all kind of styles of the element like borders, paddings, margins,
       * and even scrollbars.
       *
       * Please note that with visible scrollbars the content height returned
       * may be larger than the box height returned via {@link #getHeight}.
       *
       * @param element {Element} element to query
       * @return {Integer} Computed content height
       */
      getContentHeight(element) {
        var Style = qx.bom.element.Style;
        var overflowY = qx.bom.element.Style.get(element, "overflowY");
        var paddingTop = parseInt(Style.get(element, "paddingTop") || "0px", 10);
        var paddingBottom = parseInt(Style.get(element, "paddingBottom") || "0px", 10);
        if (this.__hiddenScrollbars__P_77_0[overflowY]) {
          return element.clientHeight - paddingTop - paddingBottom;
        } else {
          if (element.clientHeight >= element.scrollHeight) {
            // Scrollbars visible, but not needed? We need to substract both paddings
            return Math.max(element.clientHeight, element.scrollHeight) - paddingTop - paddingBottom;
          } else {
            // Scrollbars visible and needed. We just remove the top padding,
            // as the bottom padding is not respected in rendering.
            return element.scrollHeight - paddingTop;
          }
        }
      },
      /**
       * Returns the rendered content size of the given element.
       *
       * @param element {Element} element to query
       * @return {Map} map containing the content width and height of the element
       */
      getContentSize(element) {
        return {
          width: this.getContentWidth(element),
          height: this.getContentHeight(element)
        };
      }
    }
  });
  qx.bom.element.Dimension.$$dbClassInfo = $$dbClassInfo;
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
          color = this.__rgbaStringToRgb__P_82_0(str);
        } else if (this.isRgbString(str)) {
          color = this.__rgbStringToRgb__P_82_1();
        } else if (this.ishexShortString(str)) {
          color = this.__hexShortStringToRgb__P_82_2();
        } else if (this.ishexLongString(str)) {
          color = this.__hexLongStringToRgb__P_82_3();
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
      __rgbStringToRgb__P_82_1() {
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
      __rgbaStringToRgb__P_82_0() {
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
      __hexShortStringToRgb__P_82_2() {
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
      __hex3StringToRgb__P_82_4() {
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
      __hex6StringToRgb__P_82_5() {
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
      __hexLongStringToRgb__P_82_3() {
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
          return this.__hex3StringToRgb__P_82_4(value);
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
          return this.__hex6StringToRgb__P_82_5(value);
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
          return this.__hexShortStringToRgb__P_82_2(value);
        }
        if (this.ishexLongString(value)) {
          return this.__hexLongStringToRgb__P_82_3(value);
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
      __tuner__P_82_6(color, tuneMap, tuner, hue_tuner) {
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
        return this.__tuner__P_82_6(color, scaleMap, function (value, scale, max) {
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
        return this.__tuner__P_82_6(color, adjustMap, function (value, offset, max) {
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
      __data__P_211_0: {},
      /** @type {Map} Default image size */
      __defaultSize__P_211_1: {
        width: null,
        height: null
      },
      /** @type {RegExp} Known image types */
      __knownImageTypesRegExp__P_211_2: /\.(png|gif|jpg|jpeg|bmp)\b/i,
      /** @type {RegExp} Image types of a data URL */
      __dataUrlRegExp__P_211_3: /^data:image\/(png|gif|jpg|jpeg|bmp|svg)\b/i,
      /**
       * Whether the given image has previously been loaded using the
       * {@link #load} method.
       *
       * @param source {String} Image source to query
       * @return {Boolean} <code>true</code> when the image is loaded
       */
      isLoaded(source) {
        var entry = this.__data__P_211_0[source];
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
        var entry = this.__data__P_211_0[source];
        return !!(entry && entry.failed);
      },
      /**
       * Whether the given image is currently loading.
       *
       * @param source {String} Image source to query
       * @return {Boolean} <code>true</code> when the image is loading in the moment.
       */
      isLoading(source) {
        var entry = this.__data__P_211_0[source];
        return !!(entry && entry.loading);
      },
      /**
       * Returns the format of a previously loaded image
       *
       * @param source {String} Image source to query
       * @return {String ? null} The format of the image or <code>null</code>
       */
      getFormat(source) {
        var entry = this.__data__P_211_0[source];
        if (!entry || !entry.format) {
          var result = this.__dataUrlRegExp__P_211_3.exec(source);
          if (result != null) {
            // If width and height aren't defined, provide some defaults
            var width = entry && qx.lang.Type.isNumber(entry.width) ? entry.width : this.__defaultSize__P_211_1.width;
            var height = entry && qx.lang.Type.isNumber(entry.height) ? entry.height : this.__defaultSize__P_211_1.height;
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
        var entry = this.__data__P_211_0[source];
        return entry ? {
          width: entry.width,
          height: entry.height
        } : this.__defaultSize__P_211_1;
      },
      /**
       * Returns the image width
       *
       * @param source {String} Image source to query
       * @return {Integer} The width or <code>null</code> when the image is not loaded
       */
      getWidth(source) {
        var entry = this.__data__P_211_0[source];
        return entry ? entry.width : null;
      },
      /**
       * Returns the image height
       *
       * @param source {String} Image source to query
       * @return {Integer} The height or <code>null</code> when the image is not loaded
       */
      getHeight(source) {
        var entry = this.__data__P_211_0[source];
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
        var entry = this.__data__P_211_0[source];
        if (!entry || options.retryFailed && entry.failed) {
          entry = this.__data__P_211_0[source] = {};
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
          var boundCallback = qx.lang.Function.listener(this.__onload__P_211_4, this, el, source);

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
        var entry = this.__data__P_211_0[source];
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
        this.__data__P_211_0[source] = null;
      },
      /**
       * Calls a method based on qx.globalErrorHandling
       */
      __onload__P_211_4() {
        var callback = qx.core.Environment.select("qx.globalErrorHandling", {
          true: qx.event.GlobalError.observeMethod(this.__onLoadHandler__P_211_5),
          false: this.__onLoadHandler__P_211_5
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
      __onLoadHandler__P_211_5(event, element, source) {
        // Shorthand
        var entry = this.__data__P_211_0[source];

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
          var result = this.__knownImageTypesRegExp__P_211_2.exec(source);
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
        this.__data__P_211_0 = {};
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
      __paddingTop__P_212_0: null,
      __paddingLeft__P_212_1: null,
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
        this.__paddingLeft__P_212_1 = paddingLeft;
        this.__paddingTop__P_212_0 = paddingTop;
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
          styles.paddingTop = this.__paddingTop__P_212_0;
          styles.paddingLeft = this.__paddingLeft__P_212_1;
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
      __registry__P_120_0: qx.$$resources || {},
      /** @type {Map} prefix per library used in HTTPS mode for IE */
      __urlPrefix__P_120_1: {}
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
        var registry = qx.util.ResourceManager.__registry__P_120_0;
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
        return !!qx.util.ResourceManager.__registry__P_120_0[id];
      },
      /**
       * Get information about an resource.
       *
       * @param id {String} The resource to get the information for
       * @return {Array} Registered data or <code>null</code>
       */
      getData(id) {
        return qx.util.ResourceManager.__registry__P_120_0[id] || null;
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
        var entry = qx.util.ResourceManager.__registry__P_120_0[id]; // [ width, height, codepoint ]
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
        var entry = qx.util.ResourceManager.__registry__P_120_0[id];
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
        var entry = qx.util.ResourceManager.__registry__P_120_0[id];
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
        var entry = qx.util.ResourceManager.__registry__P_120_0[id];
        var isclipped = entry && entry.length > 4 && typeof entry[4] == "string" && this.constructor.__registry__P_120_0[entry[4]];
        if (isclipped) {
          var combId = entry[4];
          var combImg = this.constructor.__registry__P_120_0[combId];
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
        var entry = qx.util.ResourceManager.__registry__P_120_0[id];
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
          urlPrefix = qx.util.ResourceManager.__urlPrefix__P_120_1[lib];
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
        var resentry = this.constructor.__registry__P_120_0[resid];
        var combined = resentry ? this.constructor.__registry__P_120_0[resentry[4]] : null;
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
              statics.__urlPrefix__P_120_1[lib] = "";
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
              statics.__urlPrefix__P_120_1[lib] = window.location.protocol;
            }
            // If the resourceUri begins with a single slash, include the current
            // hostname
            else if (resourceUri.match(/^\//) != null) {
              if (href) {
                statics.__urlPrefix__P_120_1[lib] = href;
              } else {
                statics.__urlPrefix__P_120_1[lib] = window.location.protocol + "//" + window.location.host;
              }
            }
            // If the resolved URL begins with "./" the final URL has to be
            // put together using the document.URL property.
            // IMPORTANT: this is only applicable for the source version
            else if (resourceUri.match(/^\.\//) != null) {
              var url = document.URL;
              statics.__urlPrefix__P_120_1[lib] = url.substring(0, url.lastIndexOf("/") + 1);
            } else if (resourceUri.match(/^http/) != null) {
              // Let absolute URLs pass through
              statics.__urlPrefix__P_120_1[lib] = "";
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
              statics.__urlPrefix__P_120_1[lib] = href.substring(0, href.lastIndexOf("/") + 1);
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
      __libs__P_183_0: qx.$$libraries || {}
    },
    members: {
      /**
       * Checks whether the library with the given namespace is known to the
       * application.
       * @param namespace {String} The library's namespace
       * @return {Boolean} <code>true</code> if the given library is known
       */
      has(namespace) {
        return !!qx.util.LibraryManager.__libs__P_183_0[namespace];
      },
      /**
       * The namespaces of all libraries known to the application
       *
       * @returns {String[]} the namespaces
       */
      getNamespaces() {
        return Object.keys(qx.util.LibraryManager.__libs__P_183_0);
      },
      /**
       * Returns the value of an attribute of the given library
       * @param namespace {String} The library's namespace
       * @param key {String} Name of the attribute
       * @return {var|null} The attribute's value or <code>null</code> if it's not defined
       */
      get(namespace, key) {
        return qx.util.LibraryManager.__libs__P_183_0[namespace][key] ? qx.util.LibraryManager.__libs__P_183_0[namespace][key] : null;
      },
      /**
       * Sets an attribute on the given library.
       *
       * @param namespace {String} The library's namespace
       * @param key {String} Name of the attribute
       * @param value {var} Value of the attribute
       */
      set(namespace, key, value) {
        qx.util.LibraryManager.__libs__P_183_0[namespace][key] = value;
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
      __warnings__P_213_0: {},
      /** @type {Map} List of repeat modes which supports the IE AlphaImageLoader */
      __alphaFixRepeats__P_213_1: qx.core.Environment.select("engine.name", {
        mshtml: {
          "scale-x": true,
          "scale-y": true,
          scale: true,
          "no-repeat": true
        },
        default: null
      }),
      /** @type {Map} Mapping between background repeat and the tag to create */
      __repeatToTagname__P_213_2: {
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
        if (source && qx.core.Environment.get("css.alphaimageloaderneeded") && this.__alphaFixRepeats__P_213_1[repeat] && source.endsWith(".png")) {
          return "div";
        }
        return this.__repeatToTagname__P_213_2[repeat];
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
        if (qx.core.Environment.get("css.alphaimageloaderneeded") && this.__alphaFixRepeats__P_213_1[repeat] && format === "png") {
          var dimension = this.__getDimension__P_213_3(source);
          this.__normalizeWidthHeight__P_213_4(style, dimension.width, dimension.height);
          result = this.processAlphaFix(style, repeat, source);
        } else {
          delete style.clip;
          if (repeat === "scale") {
            result = this.__processScale__P_213_5(style, repeat, source);
          } else if (repeat === "scale-x" || repeat === "scale-y") {
            result = this.__processScaleXScaleY__P_213_6(style, repeat, source);
          } else {
            // Native repeats or "no-repeat"
            result = this.__processRepeats__P_213_7(style, repeat, source);
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
      __normalizeWidthHeight__P_213_4(style, width, height) {
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
      __getDimension__P_213_3(source) {
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
      __processScale__P_213_5(style, repeat, source) {
        var uri = qx.util.ResourceManager.getInstance().toUri(source);
        var dimension = this.__getDimension__P_213_3(source);
        this.__normalizeWidthHeight__P_213_4(style, dimension.width, dimension.height);
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
      __processScaleXScaleY__P_213_6(style, repeat, sourceid) {
        var ResourceManager = qx.util.ResourceManager.getInstance();
        var clipped = ResourceManager.getCombinedFormat(sourceid);
        var dimension = this.__getDimension__P_213_3(sourceid);
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
            style = this.__getStylesForClippedScaleX__P_213_8(style, data, dimension.height);
          } else {
            style = this.__getStylesForClippedScaleY__P_213_9(style, data, dimension.width);
          }
          return {
            src: uri,
            style: style
          };
        }

        // No clipped image available
        else {
          {
            this.__checkForPotentialClippedImage__P_213_10(sourceid);
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
      __getStylesForClippedScaleX__P_213_8(style, data, height) {
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
      __getStylesForClippedScaleY__P_213_9(style, data, width) {
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
      __processRepeats__P_213_7(style, repeat, sourceid) {
        var ResourceManager = qx.util.ResourceManager.getInstance();
        var clipped = ResourceManager.getCombinedFormat(sourceid);
        var dimension = this.__getDimension__P_213_3(sourceid);

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
              this.__checkForPotentialClippedImage__P_213_10(sourceid);
            }
          }
          this.__normalizeWidthHeight__P_213_4(style, dimension.width, dimension.height);
          this.__getStylesForSingleRepeat__P_213_11(style, sourceid, repeat);
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
      __getStylesForSingleRepeat__P_213_11(style, source, repeat) {
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
      __checkForPotentialClippedImage__P_213_10(source) {
        if (this.DEBUG && qx.util.ResourceManager.getInstance().has(source) && source.indexOf("qx/icon") == -1) {
          if (!this.__warnings__P_213_0[source]) {
            qx.log.Logger.debug("Potential clipped image candidate: " + source);
            this.__warnings__P_213_0[source] = true;
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
      this.addListener("appear", this.__refreshCursor__P_196_0, this);
      this.addListener("disappear", this.__refreshCursor__P_196_0, this);
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
      __refreshCursor__P_196_0() {
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
                this.__toParameterPair__P_129_0(key, value[i], parts, post);
              }
            } else {
              this.__toParameterPair__P_129_0(key, value, parts, post);
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
      __toParameterPair__P_129_0(key, value, parts, post) {
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
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.Viewport": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "load": true,
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
       * Sebastian Werner (wpbasti)
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * Yahoo! UI Library
         http://developer.yahoo.com/yui
         Version 2.2.0
  
       Copyright:
         (c) 2007, Yahoo! Inc.
  
       License:
         BSD: http://developer.yahoo.com/yui/license.txt
  
     ----------------------------------------------------------------------
  
       http://developer.yahoo.com/yui/license.html
  
       Copyright (c) 2009, Yahoo! Inc.
       All rights reserved.
  
       Redistribution and use of this software in source and binary forms,
       with or without modification, are permitted provided that the
       following conditions are met:
  
       * Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in
         the documentation and/or other materials provided with the
         distribution.
       * Neither the name of Yahoo! Inc. nor the names of its contributors
         may be used to endorse or promote products derived from this
         software without specific prior written permission of Yahoo! Inc.
  
       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
       "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
       LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
       FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
       COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
       INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
       (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
       SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
       HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
       STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
       ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
       OF THE POSSIBILITY OF SUCH DAMAGE.
  
  ************************************************************************ */

  /**
   * Includes library functions to work with the current document.
   */
  qx.Bootstrap.define("qx.bom.Document", {
    statics: {
      /**
       * Whether the document is in quirks mode (e.g. non XHTML, HTML4 Strict or missing doctype)
       *
       * @signature function(win)
       * @param win {Window?window} The window to query
       * @return {Boolean} true when containing document is in quirks mode
       */
      isQuirksMode: qx.core.Environment.select("engine.name", {
        mshtml(win) {
          if (qx.core.Environment.get("engine.version") >= 8) {
            return (win || window).document.documentMode === 5;
          } else {
            return (win || window).document.compatMode !== "CSS1Compat";
          }
        },
        webkit(win) {
          if (document.compatMode === undefined) {
            var el = (win || window).document.createElement("div");
            el.style.cssText = "position:absolute;width:0;height:0;width:1";
            return el.style.width === "1px" ? true : false;
          } else {
            return (win || window).document.compatMode !== "CSS1Compat";
          }
        },
        default(win) {
          return (win || window).document.compatMode !== "CSS1Compat";
        }
      }),
      /**
       * Whether the document is in standard mode (e.g. XHTML, HTML4 Strict or doctype defined)
       *
       * @param win {Window?window} The window to query
       * @return {Boolean} true when containing document is in standard mode
       */
      isStandardMode(win) {
        return !this.isQuirksMode(win);
      },
      /**
       * Returns the width of the document.
       *
       * Internet Explorer in standard mode stores the proprietary <code>scrollWidth</code> property
       * on the <code>documentElement</code>, but in quirks mode on the body element. All
       * other known browsers simply store the correct value on the <code>documentElement</code>.
       *
       * If the viewport is wider than the document the viewport width is returned.
       *
       * As the html element has no visual appearance it also can not scroll. This
       * means that we must use the body <code>scrollWidth</code> in all non mshtml clients.
       *
       * Verified to correctly work with:
       *
       * * Mozilla Firefox 2.0.0.4
       * * Opera 9.2.1
       * * Safari 3.0 beta (3.0.2)
       * * Internet Explorer 7.0
       *
       * @param win {Window?window} The window to query
       * @return {Integer} The width of the actual document (which includes the body and its margin).
       *
       * NOTE: Opera 9.5x and 9.6x have wrong value for the scrollWidth property,
       * if an element use negative value for top and left to be outside the viewport!
       * See: http://bugzilla.qooxdoo.org/show_bug.cgi?id=2869
       */
      getWidth(win) {
        var doc = (win || window).document;
        var view = qx.bom.Viewport.getWidth(win);
        var scroll = this.isStandardMode(win) ? doc.documentElement.scrollWidth : doc.body.scrollWidth;
        return Math.max(scroll, view);
      },
      /**
       * Returns the height of the document.
       *
       * Internet Explorer in standard mode stores the proprietary <code>scrollHeight</code> property
       * on the <code>documentElement</code>, but in quirks mode on the body element. All
       * other known browsers simply store the correct value on the <code>documentElement</code>.
       *
       * If the viewport is higher than the document the viewport height is returned.
       *
       * As the html element has no visual appearance it also can not scroll. This
       * means that we must use the body <code>scrollHeight</code> in all non mshtml clients.
       *
       * Verified to correctly work with:
       *
       * * Mozilla Firefox 2.0.0.4
       * * Opera 9.2.1
       * * Safari 3.0 beta (3.0.2)
       * * Internet Explorer 7.0
       *
       * @param win {Window?window} The window to query
       * @return {Integer} The height of the actual document (which includes the body and its margin).
       *
       * NOTE: Opera 9.5x and 9.6x have wrong value for the scrollWidth property,
       * if an element use negative value for top and left to be outside the viewport!
       * See: http://bugzilla.qooxdoo.org/show_bug.cgi?id=2869
       */
      getHeight(win) {
        var doc = (win || window).document;
        var view = qx.bom.Viewport.getHeight(win);
        var scroll = this.isStandardMode(win) ? doc.documentElement.scrollHeight : doc.body.scrollHeight;
        return Math.max(scroll, view);
      }
    }
  });
  qx.bom.Document.$$dbClassInfo = $$dbClassInfo;
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
      "qx.log.Logger": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "html.classlist": {
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
       * Sebastian Werner (wpbasti)
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * Base2
       http://code.google.com/p/base2/
       Version 0.9
  
       Copyright:
         (c) 2006-2007, Dean Edwards
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
       Authors:
         * Dean Edwards
  
  ************************************************************************ */

  /**
   * CSS class name support for HTML elements. Supports multiple class names
   * for each element. Can query and apply class names to HTML elements.
   */
  qx.Bootstrap.define("qx.bom.element.Class", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {RegExp} Regular expressions to split class names */
      __splitter__P_227_0: /\s+/g,
      /** @type {RegExp} String trim regular expression. */
      __trim__P_227_1: /^\s+|\s+$/g,
      /**
       * Adds a className to the given element
       * If successfully added the given className will be returned
       *
       * @signature function(element, name)
       * @param element {Element} The element to modify
       * @param name {String} The class name to add
       * @return {String} The added classname (if so)
       */
      add: {
        native(element, name) {
          if (name.length > 0) {
            element.classList.add(name);
          }
          return name;
        },
        default(element, name) {
          if (!this.has(element, name)) {
            element.className += (element.className ? " " : "") + name;
          }
          return name;
        }
      }[qx.core.Environment.get("html.classlist") ? "native" : "default"],
      /**
       * Adds multiple classes to the given element
       *
       * @signature function(element, classes)
       * @param element {Element} DOM element to modify
       * @param classes {String[]} List of classes to add.
       * @return {String} The resulting class name which was applied
       */
      addClasses: {
        native(element, classes) {
          for (var i = 0; i < classes.length; i++) {
            if (classes[i].length > 0) {
              element.classList.add(classes[i]);
            }
          }
          return element.className;
        },
        default(element, classes) {
          var keys = {};
          var result;
          var old = element.className;
          if (old) {
            result = old.split(this.__splitter__P_227_0);
            for (var i = 0, l = result.length; i < l; i++) {
              keys[result[i]] = true;
            }
            for (var i = 0, l = classes.length; i < l; i++) {
              if (!keys[classes[i]]) {
                result.push(classes[i]);
              }
            }
          } else {
            result = classes;
          }
          return element.className = result.join(" ");
        }
      }[qx.core.Environment.get("html.classlist") ? "native" : "default"],
      /**
       * Gets the classname of the given element
       *
       * @param element {Element} The element to query
       * @return {String} The retrieved classname
       */
      get(element) {
        var className = element.className;
        if (typeof className.split !== "function") {
          if (typeof className === "object") {
            if (qx.Bootstrap.getClass(className) == "SVGAnimatedString") {
              className = className.baseVal;
            } else {
              {
                qx.log.Logger.warn(this, "className for element " + element + " cannot be determined");
              }
              className = "";
            }
          }
          if (typeof className === "undefined") {
            {
              qx.log.Logger.warn(this, "className for element " + element + " is undefined");
            }
            className = "";
          }
        }
        return className;
      },
      /**
       * Whether the given element has the given className.
       *
       * @signature function(element, name)
       * @param element {Element} The DOM element to check
       * @param name {String} The class name to check for
       * @return {Boolean} true when the element has the given classname
       */
      has: {
        native(element, name) {
          return element.classList.contains(name);
        },
        default(element, name) {
          var regexp = new RegExp("(^|\\s)" + name + "(\\s|$)");
          return regexp.test(element.className);
        }
      }[qx.core.Environment.get("html.classlist") ? "native" : "default"],
      /**
       * Removes a className from the given element
       *
       * @signature function(element, name)
       * @param element {Element} The DOM element to modify
       * @param name {String} The class name to remove
       * @return {String} The removed class name
       */
      remove: {
        native(element, name) {
          element.classList.remove(name);
          return name;
        },
        default(element, name) {
          var regexp = new RegExp("(^|\\s)" + name + "(\\s|$)");
          element.className = element.className.replace(regexp, "$2");
          return name;
        }
      }[qx.core.Environment.get("html.classlist") ? "native" : "default"],
      /**
       * Removes multiple classes from the given element
       *
       * @signature function(element, classes)
       * @param element {Element} DOM element to modify
       * @param classes {String[]} List of classes to remove.
       * @return {String} The resulting class name which was applied
       */
      removeClasses: {
        native(element, classes) {
          for (var i = 0; i < classes.length; i++) {
            element.classList.remove(classes[i]);
          }
          return element.className;
        },
        default(element, classes) {
          var reg = new RegExp("\\b" + classes.join("\\b|\\b") + "\\b", "g");
          return element.className = element.className.replace(reg, "").replace(this.__trim__P_227_1, "").replace(this.__splitter__P_227_0, " ");
        }
      }[qx.core.Environment.get("html.classlist") ? "native" : "default"],
      /**
       * Replaces the first given class name with the second one
       *
       * @param element {Element} The DOM element to modify
       * @param oldName {String} The class name to remove
       * @param newName {String} The class name to add
       * @return {String} The added class name
       */
      replace(element, oldName, newName) {
        if (!this.has(element, oldName)) {
          return "";
        }
        this.remove(element, oldName);
        return this.add(element, newName);
      },
      /**
       * Toggles a className of the given element
       *
       * @signature function(element, name, toggle)
       * @param element {Element} The DOM element to modify
       * @param name {String} The class name to toggle
       * @param toggle {Boolean?null} Whether to switch class on/off. Without
       *    the parameter an automatic toggling would happen.
       * @return {String} The class name
       */
      toggle: {
        native(element, name, toggle) {
          if (toggle === undefined) {
            element.classList.toggle(name);
          } else {
            toggle ? this.add(element, name) : this.remove(element, name);
          }
          return name;
        },
        default(element, name, toggle) {
          if (toggle == null) {
            toggle = !this.has(element, name);
          }
          toggle ? this.add(element, name) : this.remove(element, name);
          return name;
        }
      }[qx.core.Environment.get("html.classlist") ? "native" : "default"]
    }
  });
  qx.bom.element.Class.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.CssAnimation": {
        "require": true
      },
      "qx.bom.element.AnimationCss": {},
      "qx.bom.element.AnimationJs": {},
      "qx.lang.String": {},
      "qx.bom.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.animation": {
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
       2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Wrapper for {@link qx.bom.element.AnimationCss} and
   * {@link qx.bom.element.AnimationJs}. It offers the public API and decides using
   * feature checks either to use CSS animations or JS animations.
   *
   * If you use this class, the restrictions of the JavaScript animations apply.
   * This means that you can not use transforms and custom bezier timing functions.
   */
  qx.Bootstrap.define("qx.bom.element.Animation", {
    statics: {
      /**
       * This function takes care of the feature check and starts the animation.
       * It takes a DOM element to apply the animation to, and a description.
       * The description should be a map, which could look like this:
       *
       * <pre class="javascript">
       * {
       *   "duration": 1000,
       *   "keep": 100,
       *   "keyFrames": {
       *     0 : {"opacity": 1, "scale": 1},
       *     100 : {"opacity": 0, "scale": 0}
       *   },
       *   "origin": "50% 50%",
       *   "repeat": 1,
       *   "timing": "ease-out",
       *   "alternate": false,
       *   "delay" : 2000
       * }
       * </pre>
       *
       * *duration* is the time in milliseconds one animation cycle should take.
       *
       * *keep* is the key frame to apply at the end of the animation. (optional)
       *   Keep in mind that the keep key is reversed in case you use an reverse
       *   animation or set the alternate key and a even repeat count.
       *
       * *keyFrames* is a map of separate frames. Each frame is defined by a
       *   number which is the percentage value of time in the animation. The value
       *   is a map itself which holds css properties or transforms
       *   {@link qx.bom.element.Transform} (Transforms only for CSS Animations).
       *
       * *origin* maps to the transform origin {@link qx.bom.element.Transform#setOrigin}
       *   (Only for CSS animations).
       *
       * *repeat* is the amount of time the animation should be run in
       *   sequence. You can also use "infinite".
       *
       * *timing* takes one of the predefined value:
       *   <code>ease</code> | <code>linear</code> | <code>ease-in</code>
       *   | <code>ease-out</code> | <code>ease-in-out</code> |
       *   <code>cubic-bezier(&lt;number&gt;, &lt;number&gt;, &lt;number&gt;, &lt;number&gt;)</code>
       *   (cubic-bezier only available for CSS animations)
       *
       * *alternate* defines if every other animation should be run in reverse order.
       *
       * *delay* is the time in milliseconds the animation should wait before start.
       *
       * @param el {Element} The element to animate.
       * @param desc {Map} The animations description.
       * @param duration {Integer?} The duration in milliseconds of the animation
       *   which will override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} AnimationHandle instance to control
       *   the animation.
       */
      animate(el, desc, duration) {
        var onlyCssKeys = qx.bom.element.Animation.__hasOnlyCssKeys__P_208_0(el, desc.keyFrames);
        if (qx.core.Environment.get("css.animation") && onlyCssKeys) {
          return qx.bom.element.AnimationCss.animate(el, desc, duration);
        } else {
          return qx.bom.element.AnimationJs.animate(el, desc, duration);
        }
      },
      /**
       * Starts an animation in reversed order. For further details, take a look at
       * the {@link #animate} method.
       * @param el {Element} The element to animate.
       * @param desc {Map} The animations description.
       * @param duration {Integer?} The duration in milliseconds of the animation
       *   which will override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} AnimationHandle instance to control
       *   the animation.
       */
      animateReverse(el, desc, duration) {
        var onlyCssKeys = qx.bom.element.Animation.__hasOnlyCssKeys__P_208_0(el, desc.keyFrames);
        if (qx.core.Environment.get("css.animation") && onlyCssKeys) {
          return qx.bom.element.AnimationCss.animateReverse(el, desc, duration);
        } else {
          return qx.bom.element.AnimationJs.animateReverse(el, desc, duration);
        }
      },
      /**
       * Detection helper which detects if only CSS keys are in
       * the animations key frames.
       * @param el {Element} The element to check for the styles.
       * @param keyFrames {Map} The keyFrames of the animation.
       * @return {Boolean} <code>true</code> if only css properties are included.
       */
      __hasOnlyCssKeys__P_208_0(el, keyFrames) {
        var keys = [];
        for (var nr in keyFrames) {
          var frame = keyFrames[nr];
          for (var key in frame) {
            if (keys.indexOf(key) == -1) {
              keys.push(key);
            }
          }
        }
        var transformKeys = ["scale", "rotate", "skew", "translate"];
        for (var i = 0; i < keys.length; i++) {
          var key = qx.lang.String.camelCase(keys[i]);
          if (!(key in el.style)) {
            // check for transform keys
            if (transformKeys.indexOf(keys[i]) != -1) {
              continue;
            }
            // check for prefixed keys
            if (qx.bom.Style.getPropertyName(key)) {
              continue;
            }
            return false;
          }
        }
        return true;
      }
    }
  });
  qx.bom.element.Animation.$$dbClassInfo = $$dbClassInfo;
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
      this.__type__P_119_0 = type;
      this.registerProperty("value", this._getValueProperty, this._setValueProperty);
      this.registerProperty("wrap", null, this._setWrapProperty);
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __type__P_119_0: null,
      // used for webkit only
      __selectable__P_119_1: null,
      __enabled__P_119_2: null,
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
        return qx.bom.Input.create(this.__type__P_119_0);
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
        this.__enabled__P_119_2 = value;
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
              userSelect: this.__selectable__P_119_1 ? null : "none"
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
          this.__selectable__P_119_1 = value;

          // Only apply the value when it is enabled
          qx.html.Input.superclass.prototype.setSelectable.call(this, this.__enabled__P_119_2 && value);
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
        if (this.__type__P_119_0 === "textarea") {
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
        if (this.__type__P_119_0 === "textarea") {
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
      this.__lookupMap__P_122_0 = {
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
      __defaultStyles__P_122_1: {
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
        return this.__defaultStyles__P_122_1;
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
      __lookupMap__P_122_0: null,
      /**
       * Called by the theme manager when all the properties to be set, have been set
       */
      loadComplete() {
        // Nothing
      },
      // property apply
      _applySize(value, old) {
        this.__lookupMap__P_122_0.fontSize = value === null ? null : value + "px";
      },
      _applyLineHeight(value, old) {
        this.__lookupMap__P_122_0.lineHeight = value === null ? null : value;
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
        this.__lookupMap__P_122_0.fontFamily = family;
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
        this.__lookupMap__P_122_0.fontWeight = value == null ? null : value ? "bold" : "normal";
      },
      // property apply
      _applyItalic(value, old) {
        this.__lookupMap__P_122_0.fontStyle = value == null ? null : value ? "italic" : "normal";
      },
      // property apply
      _applyDecoration(value, old) {
        this.__lookupMap__P_122_0.textDecoration = value == null ? null : value;
      },
      // property apply
      _applyColor(value, old) {
        this.__lookupMap__P_122_0.color = null;
        if (value) {
          this.__lookupMap__P_122_0.color = qx.theme.manager.Color.getInstance().resolve(value);
        }
      },
      // property apply
      _applyWeight(value, old) {
        this.__lookupMap__P_122_0.fontWeight = value;
      },
      // property apply
      _applyTextShadow(value, old) {
        this.__lookupMap__P_122_0.textShadow = value == null ? null : value;
      },
      // property apply
      _applyLetterSpacing(value, old) {
        this.__lookupMap__P_122_0.letterSpacing = value === null ? null : value + "px";
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
        return this.__lookupMap__P_122_0;
      }
    }
  });
  qx.bom.Font.$$dbClassInfo = $$dbClassInfo;
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
        apply: "__applyValid__P_121_0"
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
      __families__P_121_1: null,
      __allValidPromise__P_121_2: null,
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
        this.__allValidPromise__P_121_2 = qx.Promise.all(promises).then(results => {
          if (results.length == 0 || results.indexOf(true) > -1) {
            this.setValid(true);
          } else {
            this.setValid(false);
          }
        });
      },
      async checkValid() {
        await this.__allValidPromise__P_121_2;
      },
      __applyValid__P_121_0(value) {
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
       2006 STZ-IDA, Germany, http://www.stz-ida.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Til Schneider (til132)
  
  ************************************************************************ */

  /**
   * Superclass for formatters and parsers.
   */
  qx.Interface.define("qx.util.format.IFormat", {
    members: {
      /**
       * Formats an object.
       *
       * @abstract
       * @param obj {var} The object to format.
       * @return {String} the formatted object.
       * @throws {Error} the abstract function warning.
       */
      format(obj) {},
      /**
       * Parses an object.
       *
       * @abstract
       * @param str {String} the string to parse.
       * @return {var} the parsed object.
       * @throws {Error} the abstract function warning.
       */
      parse(str) {}
    }
  });
  qx.util.format.IFormat.$$dbClassInfo = $$dbClassInfo;
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
      "qx.util.format.IFormat": {
        "require": true
      },
      "qx.locale.Date": {
        "construct": true
      },
      "qx.locale.Manager": {},
      "qx.log.Logger": {},
      "qx.lang.String": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2006 STZ-IDA, Germany, http://www.stz-ida.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Til Schneider (til132)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A formatter and parser for dates, see
   * http://www.unicode.org/reports/tr35/#Date_Format_Patterns
   *
   * Here is a quick overview of the format pattern keys:
   * <table>
   * <tr><th>Key &nbsp;<th>Description
   * <tr><td><code> G </code><td> era, e.g. "AD"
   * <tr><td><code> y </code><td> year
   * <tr><td><code> Y </code><td> week year
   * <tr><td><code> u </code><td> extended year [Not supported yet]
   * <tr><td><code> Q </code><td> quarter
   * <tr><td><code> q </code><td> stand-alone quarter
   * <tr><td><code> M </code><td> month
   * <tr><td><code> L </code><td> stand-alone month
   * <tr><td><code> I </code><td> chinese leap month [Not supported yet]
   * <tr><td><code> w </code><td> week of year
   * <tr><td><code> W </code><td> week of month
   * <tr><td><code> d </code><td> day of month
   * <tr><td><code> D </code><td> day of year
   * <tr><td><code> F </code><td> day of week in month [Not supported yet]
   * <tr><td><code> g </code><td> modified Julian day [Not supported yet]
   * <tr><td><code> E </code><td> day of week
   * <tr><td><code> e </code><td> local day of week
   * <tr><td><code> c </code><td> stand-alone local day of week
   * <tr><td><code> a </code><td> period of day (am or pm)
   * <tr><td><code> h </code><td> 12-hour hour
   * <tr><td><code> H </code><td> 24-hour hour
   * <tr><td><code> K </code><td> hour [0-11]
   * <tr><td><code> k </code><td> hour [1-24]
   * <tr><td><code> j </code><td> special symbol [Not supported yet]
   * <tr><td><code> m </code><td> minute
   * <tr><td><code> s </code><td> second
   * <tr><td><code> S </code><td> fractional second
   * <tr><td><code> A </code><td> millisecond in day [Not supported yet]
   * <tr><td><code> z </code><td> time zone, specific non-location format
   * <tr><td><code> Z </code><td> time zone, rfc822/gmt format
   * <tr><td><code> v </code><td> time zone, generic non-location format [Not supported yet]
   * <tr><td><code> V </code><td> time zone, like z except metazone abbreviations [Not supported yet]
   * </table>
   *
   * (This list is preliminary, not all format keys might be implemented). Most
   * keys support repetitions that influence the meaning of the format. Parts of the
   * format string that should not be interpreted as format keys have to be
   * single-quoted.
   *
   * The same format patterns will be used for both parsing and output formatting.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.util.format.DateFormat", {
    extend: qx.core.Object,
    implement: [qx.util.format.IFormat],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param format {String|null} The format to use. If null, the locale's default
     * format is used.
     * @param locale {String?} optional locale to be used. In case this is not present, the {@link #locale} property of DateFormat
     * will be following the {@link qx.locale.Manager#locale} property of qx.locale.Manager
     */
    construct(format, locale) {
      qx.core.Object.constructor.call(this);
      this.__initialLocale__P_123_0 = this.__locale__P_123_1 = locale;
      if (format != null) {
        this.__format__P_123_2 = format.toString();
        if (this.__format__P_123_2 in qx.util.format.DateFormat.ISO_MASKS) {
          if (this.__format__P_123_2 === "isoUtcDateTime") {
            this.__UTC__P_123_3 = true;
          }
          this.__format__P_123_2 = qx.util.format.DateFormat.ISO_MASKS[this.__format__P_123_2];
        }
      } else {
        this.__format__P_123_2 = qx.locale.Date.getDateFormat("long", this.getLocale()) + " " + qx.locale.Date.getDateTimeFormat("HHmmss", "HH:mm:ss", this.getLocale());
      }
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Convenience factory that returns a <code>DateFomat</code> instance that
       * uses a short date-only format. Beware that the overall layout of the
       * date/time format string is that of the locale in effect when the factory
       * function is called.
       *
       * Implemented as a quasi-singleton, so beware of side effects.
       *
       * @return {DateFormat} a DateFormat instance.
       */
      getDateInstance() {
        var DateFormat = qx.util.format.DateFormat;
        var format = qx.locale.Date.getDateFormat("short") + "";

        // Memoizing the instance, so caller doesn't have to dispose it.
        if (DateFormat._dateInstance == null || DateFormat._dateInstance.__format__P_123_2 != format) {
          DateFormat._dateInstance = new DateFormat(format);
        }
        return DateFormat._dateInstance;
      },
      /**
       * Convenience factory that returns a <code>DateFomat</code> instance that
       * uses a long date/time format. Beware that the overall layout of the
       * date/time format string is that of the locale in effect when the factory
       * function is called.
       *
       * Implemented as a quasi-singleton, so beware of side effects.
       *
       * @return {DateFormat} a DateFormat instance.
       */
      getDateTimeInstance() {
        var DateFormat = qx.util.format.DateFormat;
        var format = qx.locale.Date.getDateFormat("long") + " " + qx.locale.Date.getDateTimeFormat("HHmmss", "HH:mm:ss");

        // Memoizing the instance, so caller doesn't have to dispose it.
        if (DateFormat._dateTimeInstance == null || DateFormat._dateTimeInstance.__format__P_123_2 != format) {
          DateFormat._dateTimeInstance = new DateFormat(format);
        }
        return DateFormat._dateTimeInstance;
      },
      /**
       * @type {Integer} The threshold until when a year should be assumed to belong to the
       *   21st century (e.g. 12 -> 2012). Years over this threshold but below 100 will be
       *   assumed to belong to the 20th century (e.g. 88 -> 1988). Years over 100 will be
       *   used unchanged (e.g. 1792 -> 1792).
       */
      ASSUME_YEAR_2000_THRESHOLD: 30,
      /** @type {Map} Special masks of patterns that are used frequently*/
      ISO_MASKS: {
        isoDate: "yyyy-MM-dd",
        isoTime: "HH:mm:ss",
        isoDateTime: "yyyy-MM-dd'T'HH:mm:ss",
        isoDateTimeTz: "yyyy-MM-dd'T'HH:mm:ssZ",
        isoUtcDateTime: "yyyy-MM-dd'T'HH:mm:ss'Z'"
      },
      /** @type {String} The am marker. */
      AM_MARKER: "am",
      /** @type {String} The pm marker. */
      PM_MARKER: "pm"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __locale__P_123_1: null,
      __initialLocale__P_123_0: null,
      __format__P_123_2: null,
      __parseFeed__P_123_4: null,
      __parseRules__P_123_5: null,
      __formatTree__P_123_6: null,
      __UTC__P_123_3: null,
      /**
       * Fills a number with leading zeros ("25" -> "0025").
       *
       * @param number {Integer} the number to fill.
       * @param minSize {Integer} the minimum size the returned string should have.
       * @return {String} the filled number as string.
       */
      __fillNumber__P_123_7(number, minSize) {
        var str = "" + (number < 0 ? -1 * number : number);
        while (str.length < minSize) {
          str = "0" + str;
        }
        return number < 0 ? "-" + str : str;
      },
      /**
       * Returns the day in year of a date.
       *
       * @param date {Date} the date.
       * @return {Integer} the day in year.
       */
      __getDayInYear__P_123_8(date) {
        var helpDate = new Date(date.getTime());
        var day = helpDate.getDate();
        while (helpDate.getMonth() != 0) {
          // Set the date to the last day of the previous month
          helpDate.setDate(-1);
          day += helpDate.getDate() + 1;
        }
        return day;
      },
      /**
       * Returns the thursday in the same week as the date.
       *
       * @param date {Date} the date to get the thursday of.
       * @return {Date} the thursday in the same week as the date.
       */
      __thursdayOfSameWeek__P_123_9(date) {
        return new Date(date.getTime() + (3 - (date.getDay() + 6) % 7) * 86400000);
      },
      /**
       * Returns the week in year of a date.
       *
       * @param date {Date} the date to get the week in year of.
       * @return {Integer} the week in year.
       */
      __getWeekInYear__P_123_10(date) {
        // The following algorithm comes from http://www.salesianer.de/util/kalwoch.html
        // Get the thursday of the week the date belongs to
        var thursdayDate = this.__thursdayOfSameWeek__P_123_9(date);

        // Get the year the thursday (and therefore the week) belongs to
        var weekYear = thursdayDate.getFullYear();

        // Get the thursday of the week january 4th belongs to
        // (which defines week 1 of a year)
        var thursdayWeek1 = this.__thursdayOfSameWeek__P_123_9(new Date(weekYear, 0, 4));

        // Calculate the calendar week
        return Math.floor(1.5 + (thursdayDate.getTime() - thursdayWeek1.getTime()) / 86400000 / 7);
      },
      /**
       * Returns the week in month of a date.
       *
       * @param date {Date} the date to get the week in year of.
       * @return {Integer} the week in month.
       */
      __getWeekInMonth__P_123_11(date) {
        var thursdayDate = this.__thursdayOfSameWeek__P_123_9(date);
        var thursdayWeek1 = this.__thursdayOfSameWeek__P_123_9(new Date(date.getFullYear(), date.getMonth(), 4));
        return Math.floor(1.5 + (thursdayDate.getTime() - thursdayWeek1.getTime()) / 86400000 / 7);
      },
      /**
       * Returns the week year of a date. (that is the year of the week where this date happens to be)
       * For a week in the middle of the summer, the year is easily obtained, but for a week
       * when New Year's Eve takes place, the year of that week is ambiguous.
       * The thursday day of that week is used to determine the year.
       *
       * @param date {Date} the date to get the week in year of.
       * @return {Integer} the week year.
       */
      __getWeekYear__P_123_12(date) {
        var thursdayDate = this.__thursdayOfSameWeek__P_123_9(date);
        return thursdayDate.getFullYear();
      },
      /**
       * Returns true if the year is a leap one.
       *
       * @param year {Integer} the year to check.
       * @return {Boolean} true if it is a leap year.
       */
      __isLeapYear__P_123_13(year) {
        var februaryDate = new Date(year, 2, 1);
        februaryDate.setDate(-1);
        return februaryDate.getDate() + 1 === 29;
      },
      /**
       * Returns a json object with month and day as keys.
       *
       * @param dayOfYear {Integer} the day of year.
       * @param year {Integer} the year to check.
       * @return {Object} a json object {month: M, day: D}.
       */
      __getMonthAndDayFromDayOfYear__P_123_14(dayOfYear, year) {
        var month = 0;
        var day = 0;
        // if we don't know the year, we take a non-leap year'
        if (!year) {
          year = 1971;
        }
        var dayCounter = 0;
        for (var i = 1; i <= 12; i++) {
          var tempDate = new Date(year, i, 1);
          tempDate.setDate(-1);
          var days = tempDate.getDate() + 1;
          dayCounter += days;
          if (dayCounter < dayOfYear) {
            month++;
            day += days;
          } else {
            day = dayOfYear - (dayCounter - days);
            break;
          }
        }
        return {
          month: month,
          day: day
        };
      },
      /**
       * Returns the year of a date when we know the week year
       *
       * @param weekYear {Integer} the week year.
       * @param month {Integer} the month
       * @param dayOfMonth {Integer} the day in month
       * @return {Integer} the year.
       */
      __getYearFromWeekYearAndMonth__P_123_15(weekYear, month, dayOfMonth) {
        var year;
        switch (month) {
          case 11:
            year = weekYear - 1;
            if (weekYear != this.__getWeekYear__P_123_12(new Date(year, month, dayOfMonth))) {
              year = weekYear;
            }
            break;
          case 0:
            year = weekYear + 1;
            if (weekYear != this.__getWeekYear__P_123_12(new Date(year, month, dayOfMonth))) {
              year = weekYear;
            }
            break;
          default:
            year = weekYear;
        }
        return year;
      },
      /**
       * Sets the new value for locale property
       * @param value {String} The new value.
       *
       */
      setLocale(value) {
        if (value !== null && typeof value != "string") {
          throw new Error("Cannot set locale to " + value + " - please provide a string");
        }
        this.__locale__P_123_1 = value === null ? this.__initialLocale__P_123_0 : value;
      },
      /**
       * Resets the Locale
       */
      resetLocale() {
        this.setLocale(null);
      },
      /**
       * Returns the locale
       */
      getLocale() {
        var locale = this.__locale__P_123_1;
        if (locale === undefined) {
          locale = qx.locale.Manager.getInstance().getLocale();
        }
        return locale;
      },
      /**
       * Returns the original format string
       *
       * @return {String}
       */
      getFormatString() {
        return this.__format__P_123_2;
      },
      /**
       * Formats a date.
       *
       * @param date {Date} The date to format.
       * @return {String} the formatted date.
       */
      format(date) {
        // check for null dates
        if (date == null) {
          return null;
        }
        if (isNaN(date.getTime())) {
          {
            qx.log.Logger.error("Provided date is invalid");
          }
          return null;
        }
        if (this.__UTC__P_123_3) {
          date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
        }
        var locale = this.getLocale();
        var fullYear = date.getFullYear();
        var month = date.getMonth();
        var dayOfMonth = date.getDate();
        var dayOfWeek = date.getDay();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var ms = date.getMilliseconds();
        var timezoneOffset = date.getTimezoneOffset();
        var timezoneSign = timezoneOffset > 0 ? 1 : -1;
        var timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60);
        var timezoneMinutes = Math.abs(timezoneOffset) % 60;

        // Create the output
        this.__initFormatTree__P_123_16();
        var output = "";
        for (var i = 0; i < this.__formatTree__P_123_6.length; i++) {
          var currAtom = this.__formatTree__P_123_6[i];
          if (currAtom.type == "literal") {
            output += currAtom.text;
          } else {
            // This is a wildcard
            var wildcardChar = currAtom.character;
            var wildcardSize = currAtom.size;

            // Get its replacement
            var replacement = "?";
            switch (wildcardChar) {
              case "y":
                // Year
                if (wildcardSize == 2) {
                  replacement = this.__fillNumber__P_123_7(fullYear % 100, 2);
                } else {
                  var year = Math.abs(fullYear);
                  replacement = year + "";
                  if (wildcardSize > replacement.length) {
                    for (var j = replacement.length; j < wildcardSize; j++) {
                      replacement = "0" + replacement;
                    }
                  }
                  if (fullYear < 0) {
                    replacement = "-" + replacement;
                  }
                }
                break;
              case "Y":
                // Year
                replacement = this.__getWeekYear__P_123_12(date) + "";
                var year = replacement.replace("-", "");
                if (wildcardSize > replacement.length) {
                  for (var j = year.length; j < wildcardSize; j++) {
                    year = "0" + year;
                  }
                }
                replacement = replacement.indexOf("-") != -1 ? "-" + year : year;
                break;
              case "G":
                // Era - there is no CLDR data for ERA yet
                if (wildcardSize >= 1 && wildcardSize <= 3) {
                  replacement = fullYear > 0 ? "AD" : "BC";
                } else if (wildcardSize == 4) {
                  replacement = fullYear > 0 ? "Anno Domini" : "Before Christ";
                } else if (wildcardSize == 5) {
                  replacement = fullYear > 0 ? "A" : "B";
                }
                break;
              case "Q":
                // quarter
                if (wildcardSize == 1 || wildcardSize == 2) {
                  replacement = this.__fillNumber__P_123_7(parseInt(month / 4) + 1, wildcardSize);
                }
                if (wildcardSize == 3) {
                  replacement = "Q" + (parseInt(month / 4) + 1);
                }
                break;
              case "q":
                // quarter stand alone
                if (wildcardSize == 1 || wildcardSize == 2) {
                  replacement = this.__fillNumber__P_123_7(parseInt(month / 4) + 1, wildcardSize);
                }
                if (wildcardSize == 3) {
                  replacement = "Q" + (parseInt(month / 4) + 1);
                }
                break;
              case "D":
                // Day in year (e.g. 189)
                replacement = this.__fillNumber__P_123_7(this.__getDayInYear__P_123_8(date), wildcardSize);
                break;
              case "d":
                // Day in month
                replacement = this.__fillNumber__P_123_7(dayOfMonth, wildcardSize);
                break;
              case "w":
                // Week in year (e.g. 27)
                replacement = this.__fillNumber__P_123_7(this.__getWeekInYear__P_123_10(date), wildcardSize);
                break;
              case "W":
                // Week in year (e.g. 27)
                replacement = this.__getWeekInMonth__P_123_11(date);
                break;
              case "E":
                // Day in week
                if (wildcardSize >= 1 && wildcardSize <= 3) {
                  replacement = qx.locale.Date.getDayName("abbreviated", dayOfWeek, locale, "format", true);
                } else if (wildcardSize == 4) {
                  replacement = qx.locale.Date.getDayName("wide", dayOfWeek, locale, "format", true);
                } else if (wildcardSize == 5) {
                  replacement = qx.locale.Date.getDayName("narrow", dayOfWeek, locale, "format", true);
                }
                break;
              case "e":
                // Day in week
                var startOfWeek = qx.locale.Date.getWeekStart(locale);
                // the index is 1 based
                var localeDayOfWeek = 1 + (dayOfWeek - startOfWeek >= 0 ? dayOfWeek - startOfWeek : 7 + (dayOfWeek - startOfWeek));
                if (wildcardSize >= 1 && wildcardSize <= 2) {
                  replacement = this.__fillNumber__P_123_7(localeDayOfWeek, wildcardSize);
                } else if (wildcardSize == 3) {
                  replacement = qx.locale.Date.getDayName("abbreviated", dayOfWeek, locale, "format", true);
                } else if (wildcardSize == 4) {
                  replacement = qx.locale.Date.getDayName("wide", dayOfWeek, locale, "format", true);
                } else if (wildcardSize == 5) {
                  replacement = qx.locale.Date.getDayName("narrow", dayOfWeek, locale, "format", true);
                }
                break;
              case "c":
                // Stand-alone local day in week
                var startOfWeek = qx.locale.Date.getWeekStart(locale);
                // the index is 1 based
                var localeDayOfWeek = 1 + (dayOfWeek - startOfWeek >= 0 ? dayOfWeek - startOfWeek : 7 + (dayOfWeek - startOfWeek));
                if (wildcardSize == 1) {
                  replacement = "" + localeDayOfWeek;
                } else if (wildcardSize == 3) {
                  replacement = qx.locale.Date.getDayName("abbreviated", dayOfWeek, locale, "stand-alone", true);
                } else if (wildcardSize == 4) {
                  replacement = qx.locale.Date.getDayName("wide", dayOfWeek, locale, "stand-alone", true);
                } else if (wildcardSize == 5) {
                  replacement = qx.locale.Date.getDayName("narrow", dayOfWeek, locale, "stand-alone", true);
                }
                break;
              case "M":
                // Month
                if (wildcardSize == 1 || wildcardSize == 2) {
                  replacement = this.__fillNumber__P_123_7(month + 1, wildcardSize);
                } else if (wildcardSize == 3) {
                  replacement = qx.locale.Date.getMonthName("abbreviated", month, locale, "format", true);
                } else if (wildcardSize == 4) {
                  replacement = qx.locale.Date.getMonthName("wide", month, locale, "format", true);
                } else if (wildcardSize == 5) {
                  replacement = qx.locale.Date.getMonthName("narrow", month, locale, "format", true);
                }
                break;
              case "L":
                // Stand-alone month
                if (wildcardSize == 1 || wildcardSize == 2) {
                  replacement = this.__fillNumber__P_123_7(month + 1, wildcardSize);
                } else if (wildcardSize == 3) {
                  replacement = qx.locale.Date.getMonthName("abbreviated", month, locale, "stand-alone", true);
                } else if (wildcardSize == 4) {
                  replacement = qx.locale.Date.getMonthName("wide", month, locale, "stand-alone", true);
                } else if (wildcardSize == 5) {
                  replacement = qx.locale.Date.getMonthName("narrow", month, locale, "stand-alone", true);
                }
                break;
              case "a":
                // am/pm marker
                // NOTE: 0:00 is am, 12:00 is pm
                replacement = hours < 12 ? qx.locale.Date.getAmMarker(locale) : qx.locale.Date.getPmMarker(locale);
                break;
              case "H":
                // Hour in day (0-23)
                replacement = this.__fillNumber__P_123_7(hours, wildcardSize);
                break;
              case "k":
                // Hour in day (1-24)
                replacement = this.__fillNumber__P_123_7(hours == 0 ? 24 : hours, wildcardSize);
                break;
              case "K":
                // Hour in am/pm (0-11)
                replacement = this.__fillNumber__P_123_7(hours % 12, wildcardSize);
                break;
              case "h":
                // Hour in am/pm (1-12)
                replacement = this.__fillNumber__P_123_7(hours % 12 == 0 ? 12 : hours % 12, wildcardSize);
                break;
              case "m":
                // Minute in hour
                replacement = this.__fillNumber__P_123_7(minutes, wildcardSize);
                break;
              case "s":
                // Second in minute
                replacement = this.__fillNumber__P_123_7(seconds, wildcardSize);
                break;
              case "S":
                // Fractional second
                replacement = this.__fillNumber__P_123_7(ms, 3);
                if (wildcardSize < replacement.length) {
                  replacement = replacement.substr(0, wildcardSize);
                } else {
                  while (wildcardSize > replacement.length) {
                    // if needed, fill the remaining wildcard length with trailing zeros
                    replacement += "0";
                  }
                }
                break;
              case "z":
                // Time zone
                if (wildcardSize >= 1 && wildcardSize <= 4) {
                  replacement = "GMT" + (timezoneSign > 0 ? "-" : "+") + this.__fillNumber__P_123_7(Math.abs(timezoneHours), 2) + ":" + this.__fillNumber__P_123_7(timezoneMinutes, 2);
                }
                break;
              case "Z":
                // RFC 822 time zone
                if (wildcardSize >= 1 && wildcardSize <= 3) {
                  replacement = (timezoneSign > 0 ? "-" : "+") + this.__fillNumber__P_123_7(Math.abs(timezoneHours), 2) + this.__fillNumber__P_123_7(timezoneMinutes, 2);
                } else {
                  replacement = "GMT" + (timezoneSign > 0 ? "-" : "+") + this.__fillNumber__P_123_7(Math.abs(timezoneHours), 2) + ":" + this.__fillNumber__P_123_7(timezoneMinutes, 2);
                }
                break;
            }
            output += replacement;
          }
        }
        return output;
      },
      /**
       * Parses a date.
       *
       * @param dateStr {String} the date to parse.
       * @return {Date} the parsed date.
       * @throws {Error} If the format is not well formed or if the date string does not
       *       match to the format.
       */
      parse(dateStr) {
        this.__initParseFeed__P_123_17();

        // Apply the regex
        var hit = this.__parseFeed__P_123_4.regex.exec(dateStr);
        if (hit == null) {
          throw new Error("Date string '" + dateStr + "' does not match the date format: " + this.__format__P_123_2);
        }

        // Apply the rules
        var dateValues = {
          era: 1,
          year: 1970,
          quarter: 1,
          month: 0,
          day: 1,
          dayOfYear: 1,
          hour: 0,
          ispm: false,
          weekDay: 4,
          weekYear: 1970,
          weekOfMonth: 1,
          weekOfYear: 1,
          min: 0,
          sec: 0,
          ms: 0,
          tzOffsetMins: null
        };
        var currGroup = 1;
        var applyWeekYearAfterRule = false;
        var applyDayOfYearAfterRule = false;
        for (var i = 0; i < this.__parseFeed__P_123_4.usedRules.length; i++) {
          var rule = this.__parseFeed__P_123_4.usedRules[i];
          var value = hit[currGroup];
          if (rule.field != null) {
            dateValues[rule.field] = parseInt(value, 10);
          } else {
            rule.manipulator(dateValues, value, rule.pattern);
          }
          if (rule.pattern == "Y+") {
            var yearRuleApplied = false;
            for (var k = 0; k < this.__parseFeed__P_123_4.usedRules.length; k++) {
              if (this.__parseFeed__P_123_4.usedRules[k].pattern == "y+") {
                yearRuleApplied = true;
                break;
              }
            }
            if (!yearRuleApplied) {
              applyWeekYearAfterRule = true;
            }
          }
          if (rule.pattern.indexOf("D") != -1) {
            var dayRuleApplied = false;
            for (var k = 0; k < this.__parseFeed__P_123_4.usedRules.length; k++) {
              if (this.__parseFeed__P_123_4.usedRules[k].pattern.indexOf("d") != -1) {
                dayRuleApplied = true;
                break;
              }
            }
            if (!dayRuleApplied) {
              applyDayOfYearAfterRule = true;
            }
          }
          currGroup += rule.groups == null ? 1 : rule.groups;
        }
        if (applyWeekYearAfterRule) {
          dateValues.year = this.__getYearFromWeekYearAndMonth__P_123_15(dateValues.weekYear, dateValues.month, dateValues.day);
        }
        if (applyDayOfYearAfterRule) {
          var dayAndMonth = this.__getMonthAndDayFromDayOfYear__P_123_14(dateValues.dayOfYear, dateValues.year);
          dateValues.month = dayAndMonth.month;
          dateValues.day = dayAndMonth.day;
        }
        if (dateValues.era < 0 && dateValues.year * dateValues.era < 0) {
          dateValues.year = dateValues.year * dateValues.era;
        }
        var date;
        if (this.__UTC__P_123_3 || dateValues.tzOffsetMins !== null) {
          var utcMs = Date.UTC(dateValues.year, dateValues.month, dateValues.day, dateValues.ispm ? dateValues.hour + 12 : dateValues.hour, dateValues.min, dateValues.sec, dateValues.ms);
          if (dateValues.tzOffsetMins !== 0) {
            utcMs += dateValues.tzOffsetMins * 60000;
          }
          date = new Date(utcMs);
          if (this.__UTC__P_123_3 && (dateValues.month !== date.getUTCMonth() || dateValues.year !== date.getUTCFullYear())) {
            throw new Error("Error parsing date '" + dateStr + "': the value for day or month is too large");
          }
        } else {
          date = new Date(dateValues.year, dateValues.month, dateValues.day, dateValues.ispm ? dateValues.hour + 12 : dateValues.hour, dateValues.min, dateValues.sec, dateValues.ms);
          if (dateValues.month !== date.getMonth() || dateValues.year !== date.getFullYear()) {
            throw new Error("Error parsing date '" + dateStr + "': the value for day or month is too large");
          }
        }
        return date;
      },
      /**
       * Helper method for {@link #format()} and {@link #parse()}.
       * Parses the date format.
       *
       */
      __initFormatTree__P_123_16() {
        if (this.__formatTree__P_123_6 != null) {
          return;
        }
        this.__formatTree__P_123_6 = [];
        var currWildcardChar;
        var currWildcardSize = 0;
        var currLiteral = "";
        var format = this.__format__P_123_2;
        var state = "default";
        var i = 0;
        while (i < format.length) {
          var currChar = format.charAt(i);
          switch (state) {
            case "quoted_literal":
              // We are now inside a quoted literal
              // Check whether the current character is an escaped "'" character
              if (currChar == "'") {
                if (i + 1 >= format.length) {
                  // this is the last character
                  i++;
                  break;
                }
                var lookAhead = format.charAt(i + 1);
                if (lookAhead == "'") {
                  currLiteral += currChar;
                  i++;
                } else {
                  // quoted literal ends
                  i++;
                  state = "unkown";
                }
              } else {
                currLiteral += currChar;
                i++;
              }
              break;
            case "wildcard":
              // Check whether the currChar belongs to that wildcard
              if (currChar == currWildcardChar) {
                // It does -> Raise the size
                currWildcardSize++;
                i++;
              } else {
                // It does not -> The current wildcard is done
                this.__formatTree__P_123_6.push({
                  type: "wildcard",
                  character: currWildcardChar,
                  size: currWildcardSize
                });
                currWildcardChar = null;
                currWildcardSize = 0;
                state = "default";
              }
              break;
            default:
              // We are not (any more) in a wildcard or quoted literal -> Check what's starting here
              if (currChar >= "a" && currChar <= "z" || currChar >= "A" && currChar <= "Z") {
                // This is a letter -> All letters are wildcards
                // Start a new wildcard
                currWildcardChar = currChar;
                state = "wildcard";
              } else if (currChar == "'") {
                if (i + 1 >= format.length) {
                  // this is the last character
                  currLiteral += currChar;
                  i++;
                  break;
                }
                var lookAhead = format.charAt(i + 1);
                if (lookAhead == "'") {
                  currLiteral += currChar;
                  i++;
                }
                i++;
                state = "quoted_literal";
              } else {
                state = "default";
              }
              if (state != "default") {
                // Add the literal
                if (currLiteral.length > 0) {
                  this.__formatTree__P_123_6.push({
                    type: "literal",
                    text: currLiteral
                  });
                  currLiteral = "";
                }
              } else {
                // This is an unquoted literal -> Add it to the current literal
                currLiteral += currChar;
                i++;
              }
              break;
          }
        }

        // Add the last wildcard or literal
        if (currWildcardChar != null) {
          this.__formatTree__P_123_6.push({
            type: "wildcard",
            character: currWildcardChar,
            size: currWildcardSize
          });
        } else if (currLiteral.length > 0) {
          this.__formatTree__P_123_6.push({
            type: "literal",
            text: currLiteral
          });
        }
      },
      /**
       * Initializes the parse feed.
       *
       * The parse contains everything needed for parsing: The regular expression
       * (in compiled and uncompiled form) and the used rules.
       *
       * @throws {Error} If the date format is malformed.
       */
      __initParseFeed__P_123_17() {
        if (this.__parseFeed__P_123_4 != null) {
          // We already have the parse feed
          return;
        }
        var format = this.__format__P_123_2;

        // Initialize the rules
        this.__initParseRules__P_123_18();
        this.__initFormatTree__P_123_16();

        // Get the used rules and construct the regex pattern
        var usedRules = [];
        var pattern = "^";
        for (var atomIdx = 0; atomIdx < this.__formatTree__P_123_6.length; atomIdx++) {
          var currAtom = this.__formatTree__P_123_6[atomIdx];
          if (currAtom.type == "literal") {
            pattern += qx.lang.String.escapeRegexpChars(currAtom.text);
          } else {
            // This is a wildcard
            var wildcardChar = currAtom.character;
            var wildcardSize = currAtom.size;

            // Get the rule for this wildcard
            var wildcardRule;
            for (var ruleIdx = 0; ruleIdx < this.__parseRules__P_123_5.length; ruleIdx++) {
              var rule = this.__parseRules__P_123_5[ruleIdx];
              if (this.__isRuleForWildcard__P_123_19(rule, wildcardChar, wildcardSize)) {
                // We found the right rule for the wildcard
                wildcardRule = rule;
                break;
              }
            }

            // Check the rule
            if (wildcardRule == null) {
              // We have no rule for that wildcard -> Malformed date format
              var wildcardStr = "";
              for (var i = 0; i < wildcardSize; i++) {
                wildcardStr += wildcardChar;
              }
              throw new Error("Malformed date format: " + format + ". Wildcard " + wildcardStr + " is not supported");
            } else {
              // Add the rule to the pattern
              usedRules.push(wildcardRule);
              pattern += wildcardRule.regex;
            }
          }
        }
        pattern += "$";

        // Create the regex
        var regex;
        try {
          regex = new RegExp(pattern);
        } catch (exc) {
          throw new Error("Malformed date format: " + format);
        }

        // Create the this.__parseFeed
        this.__parseFeed__P_123_4 = {
          regex: regex,
          usedRules: usedRules,
          pattern: pattern
        };
      },
      /**
       * Checks whether the rule matches the wildcard or not.
       * @param rule {Object} the rule we try to match with the wildcard
       * @param wildcardChar {String} the character in the wildcard
       * @param wildcardSize {Integer} the number of  wildcardChar characters in the wildcard
       * @return {Boolean} if the rule matches or not
       */
      __isRuleForWildcard__P_123_19(rule, wildcardChar, wildcardSize) {
        if (wildcardChar === "y" && rule.pattern === "y+") {
          rule.regex = rule.regexFunc(wildcardSize);
          return true;
        } else if (wildcardChar === "Y" && rule.pattern === "Y+") {
          rule.regex = rule.regexFunc(wildcardSize);
          return true;
        } else {
          return wildcardChar == rule.pattern.charAt(0) && wildcardSize == rule.pattern.length;
        }
      },
      /**
       * Initializes the static parse rules.
       *
       */
      __initParseRules__P_123_18() {
        var DateFormat = qx.util.format.DateFormat;
        var LString = qx.lang.String;
        if (this.__parseRules__P_123_5 != null) {
          // The parse rules are already initialized
          return;
        }
        var rules = this.__parseRules__P_123_5 = [];
        var amMarker = qx.locale.Date.getAmMarker(this.getLocale()).toString() || DateFormat.AM_MARKER;
        var pmMarker = qx.locale.Date.getPmMarker(this.getLocale()).toString() || DateFormat.PM_MARKER;
        var locale = this.getLocale();
        var yearManipulator = function (dateValues, value) {
          value = parseInt(value, 10);
          if (value >= 0) {
            if (value < DateFormat.ASSUME_YEAR_2000_THRESHOLD) {
              value += 2000;
            } else if (value < 100) {
              value += 1900;
            }
          }
          dateValues.year = value;
        };
        var weekYearManipulator = function (dateValues, value) {
          value = parseInt(value, 10);
          if (value >= 0) {
            if (value < DateFormat.ASSUME_YEAR_2000_THRESHOLD) {
              value += 2000;
            } else if (value < 100) {
              value += 1900;
            }
          }
          dateValues.weekYear = value;
        };
        var monthManipulator = function (dateValues, value) {
          dateValues.month = parseInt(value, 10) - 1;
        };
        var localWeekDayManipulator = function (dateValues, value) {
          var startOfWeek = qx.locale.Date.getWeekStart(locale);
          var dayOfWeek = parseInt(value, 10) - 1 + startOfWeek <= 6 ? parseInt(value, 10) - 1 + startOfWeek : parseInt(value, 10) - 1 + startOfWeek - 7;
          dateValues.weekDay = dayOfWeek;
        };
        var ampmManipulator = function (dateValues, value) {
          var pmMarker = qx.locale.Date.getPmMarker(locale).toString() || DateFormat.PM_MARKER;
          dateValues.ispm = value == pmMarker;
        };
        var noZeroHourManipulator = function (dateValues, value) {
          dateValues.hour = parseInt(value, 10) % 24;
        };
        var noZeroAmPmHourManipulator = function (dateValues, value) {
          dateValues.hour = parseInt(value, 10) % 12;
        };
        var timezoneManipulator = function (dateValues, value) {
          var regEx = new RegExp("([+-]?)(\\d\\d)(?::?(\\d\\d))?$");
          var tzResults = regEx.exec(value);
          var offsetHours = parseInt(tzResults[2], 10);
          var offsetMins = parseInt(tzResults[3], 10);
          // basic check, hours range is -12 to +14 https://en.wikipedia.org/wiki/Category:UTC_offsets
          if (offsetHours > 14) {
            throw new Error("Invalid hours in time zone offset.");
          }
          if (offsetMins > 59) {
            throw new Error("Invalid minutes in time zone offset.");
          }
          dateValues.tzOffsetMins = offsetHours * 60 + offsetMins;
          if (tzResults[1] === "-") {
            dateValues.tzOffsetMins = -dateValues.tzOffsetMins;
          }
        };

        // var ignoreManipulator = function(dateValues, value) {
        //   return;
        // };

        var narrowEraNames = ["A", "B"];
        var narrowEraNameManipulator = function (dateValues, value) {
          dateValues.era = value == "A" ? 1 : -1;
        };
        var abbrevEraNames = ["AD", "BC"];
        var abbrevEraNameManipulator = function (dateValues, value) {
          dateValues.era = value == "AD" ? 1 : -1;
        };
        var fullEraNames = ["Anno Domini", "Before Christ"];
        var fullEraNameManipulator = function (dateValues, value) {
          dateValues.era = value == "Anno Domini" ? 1 : -1;
        };
        var abbrevQuarterNames = ["Q1", "Q2", "Q3", "Q4"];
        var abbrevQuarterManipulator = function (dateValues, value) {
          dateValues.quarter = abbrevQuarterNames.indexOf(value);
        };
        var fullQuarterNames = ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"];
        var fullQuarterManipulator = function (dateValues, value) {
          dateValues.quarter = fullQuarterNames.indexOf(value);
        };
        var cache = {};
        var dateNamesManipulator = function (pattern) {
          var monthPatternLetters = ["L", "M"];
          var dayPatternLetters = ["c", "e", "E"];
          var firstLetterInPattern = pattern.charAt(0);
          var isMonth = monthPatternLetters.indexOf(firstLetterInPattern) >= 0;
          var getContext = function () {
            var letters = isMonth ? monthPatternLetters : dayPatternLetters;
            var context = firstLetterInPattern === letters[0] ? "stand-alone" : "format";
            var patternLength = pattern.length;
            var lengthName = "abbreviated";
            switch (patternLength) {
              case 4:
                lengthName = "wide";
                break;
              case 5:
                lengthName = "narrow";
                break;
              default:
                lengthName = "abbreviated";
            }
            return [context, lengthName];
          };
          if (!cache[pattern]) {
            cache[pattern] = {};
            var context = getContext();
            var func = isMonth ? qx.locale.Date.getMonthNames : qx.locale.Date.getDayNames;
            var names = func.call(qx.locale.Date, context[1], locale, context[0], true);
            for (var i = 0, l = names.length; i < l; i++) {
              names[i] = LString.escapeRegexpChars(names[i].toString());
            }
            cache[pattern].data = names;
            cache[pattern].func = function (dateValues, value) {
              value = LString.escapeRegexpChars(value);
              dateValues[isMonth ? "month" : "weekDay"] = names.indexOf(value);
            };
          }
          return cache[pattern];
        };

        // Unsupported: F (Day of week in month)

        rules.push({
          pattern: "y+",
          regexFunc(yNumber) {
            var regex = "(-*";
            for (var i = 0; i < yNumber; i++) {
              regex += "\\d";
              if (i === yNumber - 1 && i !== 1) {
                regex += "+?";
              }
            }
            regex += ")";
            return regex;
          },
          manipulator: yearManipulator
        });
        rules.push({
          pattern: "Y+",
          regexFunc(yNumber) {
            var regex = "(-*";
            for (var i = 0; i < yNumber; i++) {
              regex += "\\d";
              if (i === yNumber - 1) {
                regex += "+?";
              }
            }
            regex += ")";
            return regex;
          },
          manipulator: weekYearManipulator
        });
        rules.push({
          pattern: "G",
          regex: "(" + abbrevEraNames.join("|") + ")",
          manipulator: abbrevEraNameManipulator
        });
        rules.push({
          pattern: "GG",
          regex: "(" + abbrevEraNames.join("|") + ")",
          manipulator: abbrevEraNameManipulator
        });
        rules.push({
          pattern: "GGG",
          regex: "(" + abbrevEraNames.join("|") + ")",
          manipulator: abbrevEraNameManipulator
        });
        rules.push({
          pattern: "GGGG",
          regex: "(" + fullEraNames.join("|") + ")",
          manipulator: fullEraNameManipulator
        });
        rules.push({
          pattern: "GGGGG",
          regex: "(" + narrowEraNames.join("|") + ")",
          manipulator: narrowEraNameManipulator
        });
        rules.push({
          pattern: "Q",
          regex: "(\\d\\d*?)",
          field: "quarter"
        });
        rules.push({
          pattern: "QQ",
          regex: "(\\d\\d?)",
          field: "quarter"
        });
        rules.push({
          pattern: "QQQ",
          regex: "(" + abbrevQuarterNames.join("|") + ")",
          manipulator: abbrevQuarterManipulator
        });
        rules.push({
          pattern: "QQQQ",
          regex: "(" + fullQuarterNames.join("|") + ")",
          manipulator: fullQuarterManipulator
        });
        rules.push({
          pattern: "q",
          regex: "(\\d\\d*?)",
          field: "quarter"
        });
        rules.push({
          pattern: "qq",
          regex: "(\\d\\d?)",
          field: "quarter"
        });
        rules.push({
          pattern: "qqq",
          regex: "(" + abbrevQuarterNames.join("|") + ")",
          manipulator: abbrevQuarterManipulator
        });
        rules.push({
          pattern: "qqqq",
          regex: "(" + fullQuarterNames.join("|") + ")",
          manipulator: fullQuarterManipulator
        });
        rules.push({
          pattern: "M",
          regex: "(\\d\\d*?)",
          manipulator: monthManipulator
        });
        rules.push({
          pattern: "MM",
          regex: "(\\d\\d?)",
          manipulator: monthManipulator
        });
        rules.push({
          pattern: "MMM",
          regex: "(" + dateNamesManipulator("MMM").data.join("|") + ")",
          manipulator: dateNamesManipulator("MMM").func
        });
        rules.push({
          pattern: "MMMM",
          regex: "(" + dateNamesManipulator("MMMM").data.join("|") + ")",
          manipulator: dateNamesManipulator("MMMM").func
        });
        rules.push({
          pattern: "MMMMM",
          regex: "(" + dateNamesManipulator("MMMMM").data.join("|") + ")",
          manipulator: dateNamesManipulator("MMMMM").func
        });
        rules.push({
          pattern: "L",
          regex: "(\\d\\d*?)",
          manipulator: monthManipulator
        });
        rules.push({
          pattern: "LL",
          regex: "(\\d\\d?)",
          manipulator: monthManipulator
        });
        rules.push({
          pattern: "LLL",
          regex: "(" + dateNamesManipulator("LLL").data.join("|") + ")",
          manipulator: dateNamesManipulator("LLL").func
        });
        rules.push({
          pattern: "LLLL",
          regex: "(" + dateNamesManipulator("LLLL").data.join("|") + ")",
          manipulator: dateNamesManipulator("LLLL").func
        });
        rules.push({
          pattern: "LLLLL",
          regex: "(" + dateNamesManipulator("LLLLL").data.join("|") + ")",
          manipulator: dateNamesManipulator("LLLLL").func
        });
        rules.push({
          pattern: "dd",
          regex: "(\\d\\d?)",
          field: "day"
        });
        rules.push({
          pattern: "d",
          regex: "(\\d\\d*?)",
          field: "day"
        });
        rules.push({
          pattern: "D",
          regex: "(\\d?)",
          field: "dayOfYear"
        });
        rules.push({
          pattern: "DD",
          regex: "(\\d\\d?)",
          field: "dayOfYear"
        });
        rules.push({
          pattern: "DDD",
          regex: "(\\d\\d\\d?)",
          field: "dayOfYear"
        });
        rules.push({
          pattern: "E",
          regex: "(" + dateNamesManipulator("E").data.join("|") + ")",
          manipulator: dateNamesManipulator("E").func
        });
        rules.push({
          pattern: "EE",
          regex: "(" + dateNamesManipulator("EE").data.join("|") + ")",
          manipulator: dateNamesManipulator("EE").func
        });
        rules.push({
          pattern: "EEE",
          regex: "(" + dateNamesManipulator("EEE").data.join("|") + ")",
          manipulator: dateNamesManipulator("EEE").func
        });
        rules.push({
          pattern: "EEEE",
          regex: "(" + dateNamesManipulator("EEEE").data.join("|") + ")",
          manipulator: dateNamesManipulator("EEEE").func
        });
        rules.push({
          pattern: "EEEEE",
          regex: "(" + dateNamesManipulator("EEEEE").data.join("|") + ")",
          manipulator: dateNamesManipulator("EEEEE").func
        });
        rules.push({
          pattern: "e",
          regex: "(\\d?)",
          manipulator: localWeekDayManipulator
        });
        rules.push({
          pattern: "ee",
          regex: "(\\d\\d?)",
          manipulator: localWeekDayManipulator
        });
        rules.push({
          pattern: "eee",
          regex: "(" + dateNamesManipulator("eee").data.join("|") + ")",
          manipulator: dateNamesManipulator("eee").func
        });
        rules.push({
          pattern: "eeee",
          regex: "(" + dateNamesManipulator("eeee").data.join("|") + ")",
          manipulator: dateNamesManipulator("eeee").func
        });
        rules.push({
          pattern: "eeeee",
          regex: "(" + dateNamesManipulator("eeeee").data.join("|") + ")",
          manipulator: dateNamesManipulator("eeeee").func
        });
        rules.push({
          pattern: "c",
          regex: "\\d?",
          manipulator: localWeekDayManipulator
        });
        rules.push({
          pattern: "ccc",
          regex: "(" + dateNamesManipulator("ccc").data.join("|") + ")",
          manipulator: dateNamesManipulator("ccc").func
        });
        rules.push({
          pattern: "cccc",
          regex: "(" + dateNamesManipulator("cccc").data.join("|") + ")",
          manipulator: dateNamesManipulator("cccc").func
        });
        rules.push({
          pattern: "ccccc",
          regex: "(" + dateNamesManipulator("ccccc").data.join("|") + ")",
          manipulator: dateNamesManipulator("ccccc").func
        });
        rules.push({
          pattern: "a",
          regex: "(" + amMarker + "|" + pmMarker + ")",
          manipulator: ampmManipulator
        });
        rules.push({
          pattern: "W",
          regex: "(\\d?)",
          field: "weekOfMonth"
        });
        rules.push({
          pattern: "w",
          regex: "(\\d\\d?)",
          field: "weekOfYear"
        });
        rules.push({
          pattern: "ww",
          regex: "(\\d\\d)",
          field: "weekOfYear"
        });
        rules.push({
          pattern: "HH",
          regex: "(\\d\\d?)",
          field: "hour"
        });
        rules.push({
          pattern: "H",
          regex: "(\\d\\d?)",
          field: "hour"
        });
        rules.push({
          pattern: "kk",
          regex: "(\\d\\d?)",
          manipulator: noZeroHourManipulator
        });
        rules.push({
          pattern: "k",
          regex: "(\\d\\d?)",
          manipulator: noZeroHourManipulator
        });
        rules.push({
          pattern: "KK",
          regex: "(\\d\\d?)",
          field: "hour"
        });
        rules.push({
          pattern: "K",
          regex: "(\\d\\d?)",
          field: "hour"
        });
        rules.push({
          pattern: "hh",
          regex: "(\\d\\d?)",
          manipulator: noZeroAmPmHourManipulator
        });
        rules.push({
          pattern: "h",
          regex: "(\\d\\d?)",
          manipulator: noZeroAmPmHourManipulator
        });
        rules.push({
          pattern: "mm",
          regex: "(\\d\\d?)",
          field: "min"
        });
        rules.push({
          pattern: "m",
          regex: "(\\d\\d?)",
          field: "min"
        });
        rules.push({
          pattern: "ss",
          regex: "(\\d\\d?)",
          field: "sec"
        });
        rules.push({
          pattern: "s",
          regex: "(\\d\\d?)",
          field: "sec"
        });
        rules.push({
          pattern: "SSS",
          regex: "(\\d\\d?\\d?)",
          field: "ms"
        });
        rules.push({
          pattern: "SS",
          regex: "(\\d\\d?\\d?)",
          field: "ms"
        });
        rules.push({
          pattern: "S",
          regex: "(\\d\\d?\\d?)",
          field: "ms"
        });
        rules.push({
          pattern: "Z",
          regex: "([\\+\\-]\\d\\d\\d\\d)",
          manipulator: timezoneManipulator
        });
        rules.push({
          pattern: "z",
          regex: "(GMT[\\+\\-]\\d\\d:\\d\\d)",
          manipulator: timezoneManipulator
        });
      }
    }
  });
  qx.util.format.DateFormat.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.io.part.Package": {
        "construct": true
      },
      "qx.io.part.ClosurePart": {
        "construct": true
      },
      "qx.io.part.Part": {
        "construct": true
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
       * Fabian Jakobs (fjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The part loader knows about all generated packages and parts.
   *
   * It contains functionality to load parts.
   */
  qx.Bootstrap.define("qx.Part", {
    // !! Careful when editing this file. Do not extend the dependencies !!

    /**
     * @param loader {Object} The data structure from the boot script about all
     *   known parts and packages. Usually <code>qx.$$loader</code>.
     */
    construct(loader) {
      // assert: boot part has a single package
      var bootPackageKey = loader.parts[loader.boot][0];
      this.__loader__P_49_0 = loader;

      // initialize the pseudo event listener maps
      this.__partListners__P_49_1 = {};
      this.__packageListeners__P_49_2 = {};
      this.__packageClosureListeners__P_49_3 = {};

      // create the packages
      this.__packages__P_49_4 = {};
      for (var key in loader.packages) {
        var pkg = new qx.io.part.Package(this.__decodeUris__P_49_5(loader.packages[key].uris), key, key == bootPackageKey);
        this.__packages__P_49_4[key] = pkg;
      }

      // create the parts
      this.__parts__P_49_6 = {};
      var parts = loader.parts;
      var closureParts = loader.closureParts || {};
      for (var name in parts) {
        var pkgKeys = parts[name];
        var packages = [];
        for (var i = 0; i < pkgKeys.length; i++) {
          packages.push(this.__packages__P_49_4[pkgKeys[i]]);
        }

        // check for closure loading
        if (closureParts[name]) {
          var part = new qx.io.part.ClosurePart(name, packages, this);
        } else {
          var part = new qx.io.part.Part(name, packages, this);
        }
        this.__parts__P_49_6[name] = part;
      }
    },
    statics: {
      /**
       * Default timeout in ms for the error handling of the closure loading.
       */
      TIMEOUT: 7500,
      /**
       * Get the default part loader instance
       *
       * @return {qx.Part} the default part loader
       */
      getInstance() {
        if (!this.$$instance) {
          this.$$instance = new this(qx.$$loader);
        }
        return this.$$instance;
      },
      /**
       * Loads one or more parts asynchronously. The callback is called after all
       * parts and their dependencies are fully loaded. If the parts are already
       * loaded the callback is called immediately.
       *
       * @param partNames {String[]} List of parts names to load as defined in the
       *    config file at compile time.
       * @param callback {Function} Function to execute on completion
       * @param self {Object?window} Context to execute the given function in
       */
      require(partNames, callback, self) {
        this.getInstance().require(partNames, callback, self);
      },
      /**
       * Preloads one or more closure parts but does not execute them. This means
       * the closure (the whole code of the part) is already loaded but not
       * executed so you can't use the classes in the the part after a preload.
       * If you want to execute them, just use the regular {@link #require}
       * function.
       *
       * @param partNames {String[]} List of parts names to preload as defined
       *   in the config file at compile time.
       */
      preload(partNames) {
        this.getInstance().preload(partNames);
      },
      /**
       * Loaded closure packages have to call this method to indicate
       * successful loading and to get their closure stored.
       *
       * @param id {String} The id of the package.
       * @param closure {Function} The wrapped code of the package.
       */
      $$notifyLoad(id, closure) {
        this.getInstance().saveClosure(id, closure);
      }
    },
    members: {
      __loader__P_49_0: null,
      __packages__P_49_4: null,
      __parts__P_49_6: null,
      __packageClosureListeners__P_49_3: null,
      /**
       * This method is only for testing purposes! Don't use it!
       *
       * @internal
       * @param pkg {qx.io.part.Package} The package to add to the internal
       *   registry of packages.
       */
      addToPackage(pkg) {
        this.__packages__P_49_4[pkg.getId()] = pkg;
      },
      /**
       * Internal helper method to save the closure and notify that the load.
       *
       * @internal
       * @param id {String} The hash of the package.
       * @param closure {Function} The code of the package wrappen into a closure.
       */
      saveClosure(id, closure) {
        // search for the package
        var pkg = this.__packages__P_49_4[id];

        // error if no package could be found
        if (!pkg) {
          throw new Error("Package not available: " + id);
        }

        // save the closure in the package itself
        pkg.saveClosure(closure);

        // call the listeners
        var listeners = this.__packageClosureListeners__P_49_3[id];
        if (!listeners) {
          return;
        }
        for (var i = 0; i < listeners.length; i++) {
          listeners[i]("complete", id);
        }
        // get rid of all closure package listeners for that package
        this.__packageClosureListeners__P_49_3[id] = [];
      },
      /**
       * Internal method for testing purposes which returns the internal parts
       * store.
       *
       * @internal
       * @return {Array} An array of parts.
       */
      getParts() {
        return this.__parts__P_49_6;
      },
      /**
       * Loads one or more parts asynchronously. The callback is called after all
       * parts and their dependencies are fully loaded. If the parts are already
       * loaded the callback is called immediately.
       *
       * @param partNames {String|String[]} List of parts names to load as defined
       *   in the config file at compile time. The method also accepts a single
       *   string as parameter to only load one part.
       * @param callback {Function} Function to execute on completion.
       *   The function has one parameter which is an array of ready states of
       *   the parts specified in the partNames argument.
       * @param self {Object?window} Context to execute the given function in
       */
      require(partNames, callback, self) {
        var callback = callback || function () {};
        var self = self || window;
        if (qx.Bootstrap.isString(partNames)) {
          partNames = [partNames];
        }
        var parts = [];
        for (var i = 0; i < partNames.length; i++) {
          var part = this.__parts__P_49_6[partNames[i]];
          if (part === undefined) {
            var registeredPartNames = qx.Bootstrap.keys(this.getParts());
            throw new Error('Part "' + partNames[i] + '" not found in parts (' + registeredPartNames.join(", ") + ")");
          } else {
            parts.push(part);
          }
        }
        var partsLoaded = 0;
        var onLoad = function () {
          partsLoaded += 1;
          // done?
          if (partsLoaded >= parts.length) {
            // gather the ready states of the parts
            var states = [];
            for (var i = 0; i < parts.length; i++) {
              states.push(parts[i].getReadyState());
            }
            callback.call(self, states);
          }
        };
        for (var i = 0; i < parts.length; i++) {
          parts[i].load(onLoad, this);
        }
      },
      /**
       * Preloader for the given part.
       *
       * @param partNames {String} The hash of the part to preload.
       * @param callback {Function} Function to execute on completion.
       *   The function has one parameter which is an array of ready states of
       *   the parts specified in the partNames argument.
       * @param self {Object?window} Context to execute the given function in
       */
      preload(partNames, callback, self) {
        if (qx.Bootstrap.isString(partNames)) {
          partNames = [partNames];
        }
        var partsPreloaded = 0;
        for (var i = 0; i < partNames.length; i++) {
          this.__parts__P_49_6[partNames[i]].preload(function () {
            partsPreloaded++;
            if (partsPreloaded >= partNames.length) {
              // gather the ready states of the parts
              var states = [];
              for (var i = 0; i < partNames.length; i++) {
                states.push(this.__parts__P_49_6[partNames[i]].getReadyState());
              }
              if (callback) {
                callback.call(self, states);
              }
            }
          }, this);
        }
      },
      /**
       * Get the URI lists of all packages
       *
       * @return {String[][]} Array of URI lists for each package
       */
      __getUris__P_49_7() {
        var packages = this.__loader__P_49_0.packages;
        var uris = [];
        for (var key in packages) {
          uris.push(this.__decodeUris__P_49_5(packages[key].uris));
        }
        return uris;
      },
      /**
       * Decodes a list of source URIs. The function is defined in the loader
       * script.
       *
       * @signature function(compressedUris)
       * @param compressedUris {String[]} Array of compressed URIs
       * @return {String[]} decompressed URIs
       */
      __decodeUris__P_49_5: qx.$$loader.decodeUris,
      /*
      ---------------------------------------------------------------------------
        PART
      ---------------------------------------------------------------------------
      */

      __partListners__P_49_1: null,
      /**
       * Register callback, which is called after the given part has been loaded
       * or fails with an error. After the call the listener is removed.
       *
       * @internal
       *
       * @param part {Object} Part to load
       * @param callback {Object} the listener
       */
      addPartListener(part, callback) {
        var key = part.getName();
        if (!this.__partListners__P_49_1[key]) {
          this.__partListners__P_49_1[key] = [];
        }
        this.__partListners__P_49_1[key].push(callback);
      },
      /**
       * If defined this method is called after each part load.
       */
      onpart: null,
      /**
       * This method is called after a part has been loaded or failed to load.
       * It calls all listeners for this part.
       *
       * @internal
       * @param part {Object} The loaded part
       */
      notifyPartResult(part) {
        var key = part.getName();
        var listeners = this.__partListners__P_49_1[key];
        if (listeners) {
          for (var i = 0; i < listeners.length; i++) {
            listeners[i](part.getReadyState());
          }
          this.__partListners__P_49_1[key] = [];
        }
        if (typeof this.onpart === "function") {
          this.onpart(part);
        }
      },
      /*
      ---------------------------------------------------------------------------
        PACKAGE
      ---------------------------------------------------------------------------
      */

      __packageListeners__P_49_2: null,
      /**
       * Register callback, which is called after the given package has been loaded
       * or fails with an error. After the call the listener is removed.
       *
       * @internal
       *
       * @param pkg {Object} Package to load
       * @param callback {Object} the listener
       */
      addPackageListener(pkg, callback) {
        var key = pkg.getId();
        if (!this.__packageListeners__P_49_2[key]) {
          this.__packageListeners__P_49_2[key] = [];
        }
        this.__packageListeners__P_49_2[key].push(callback);
      },
      /**
       * This method is called after a packages has been loaded or failed to load.
       * It calls all listeners for this package.
       *
       * @internal
       * @param pkg {Object} The loaded package
       */
      notifyPackageResult(pkg) {
        var key = pkg.getId();
        var listeners = this.__packageListeners__P_49_2[key];
        if (!listeners) {
          return;
        }
        for (var i = 0; i < listeners.length; i++) {
          listeners[i](pkg.getReadyState());
        }
        this.__packageListeners__P_49_2[key] = [];
      }
    }
  });
  qx.Part.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.Assert": {
        "construct": true
      },
      "qx.ui.core.ISingleSelectionProvider": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Responsible for the single selection management.
   *
   * The class manage a list of {@link qx.ui.core.Widget} which are returned from
   * {@link qx.ui.core.ISingleSelectionProvider#getItems}.
   *
   * @internal
   */
  qx.Class.define("qx.ui.core.SingleSelectionManager", {
    extend: qx.core.Object,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Construct the single selection manager.
     *
     * @param selectionProvider {qx.ui.core.ISingleSelectionProvider} The provider
     * for selection.
     */
    construct(selectionProvider) {
      qx.core.Object.constructor.call(this);
      {
        qx.core.Assert.assertInterface(selectionProvider, qx.ui.core.ISingleSelectionProvider, "Invalid selectionProvider!");
      }
      this.__selectionProvider__P_150_0 = selectionProvider;
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fires after the selection was modified */
      changeSelected: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * If the value is <code>true</code> the manager allows an empty selection,
       * otherwise the first selectable element returned from the
       * <code>qx.ui.core.ISingleSelectionProvider</code> will be selected.
       */
      allowEmptySelection: {
        check: "Boolean",
        init: true,
        apply: "__applyAllowEmptySelection__P_150_1"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** @type {qx.ui.core.Widget} The selected widget. */
      __selected__P_150_2: null,
      /** @type {qx.ui.core.ISingleSelectionProvider} The provider for selection management */
      __selectionProvider__P_150_0: null,
      /*
      ---------------------------------------------------------------------------
         PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the current selected element.
       *
       * @return {qx.ui.core.Widget|null} The current selected widget or
       *    <code>null</code> if the selection is empty.
       */
      getSelected() {
        return this.__selected__P_150_2;
      },
      /**
       * Selects the passed element.
       *
       * @param item {qx.ui.core.Widget} Element to select.
       * @throws {Error} if the element is not a child element.
       */
      setSelected(item) {
        if (!this.__isChildElement__P_150_3(item)) {
          throw new Error("Could not select " + item + ", because it is not a child element!");
        }
        this.__setSelected__P_150_4(item);
      },
      /**
       * Reset the current selection. If {@link #allowEmptySelection} is set to
       * <code>true</code> the first element will be selected.
       */
      resetSelected() {
        this.__setSelected__P_150_4(null);
      },
      /**
       * Return <code>true</code> if the passed element is selected.
       *
       * @param item {qx.ui.core.Widget} Element to check if selected.
       * @return {Boolean} <code>true</code> if passed element is selected,
       *    <code>false</code> otherwise.
       * @throws {Error} if the element is not a child element.
       */
      isSelected(item) {
        if (!this.__isChildElement__P_150_3(item)) {
          throw new Error("Could not check if " + item + " is selected," + " because it is not a child element!");
        }
        return this.__selected__P_150_2 === item;
      },
      /**
       * Returns <code>true</code> if selection is empty.
       *
       * @return {Boolean} <code>true</code> if selection is empty,
       *    <code>false</code> otherwise.
       */
      isSelectionEmpty() {
        return this.__selected__P_150_2 == null;
      },
      /**
       * Returns all elements which are selectable.
       *
       * @param all {Boolean} true for all selectables, false for the
       *   selectables the user can interactively select
       * @return {qx.ui.core.Widget[]} The contained items.
       */
      getSelectables(all) {
        var items = this.__selectionProvider__P_150_0.getItems();
        var result = [];
        for (var i = 0; i < items.length; i++) {
          if (this.__selectionProvider__P_150_0.isItemSelectable(items[i])) {
            result.push(items[i]);
          }
        }

        // in case of an user selectable list, remove the enabled items
        if (!all) {
          for (var i = result.length - 1; i >= 0; i--) {
            if (!result[i].getEnabled()) {
              result.splice(i, 1);
            }
          }
        }
        return result;
      },
      /*
      ---------------------------------------------------------------------------
         APPLY METHODS
      ---------------------------------------------------------------------------
      */

      // apply method
      __applyAllowEmptySelection__P_150_1(value, old) {
        if (!value) {
          this.__setSelected__P_150_4(this.__selected__P_150_2);
        }
      },
      /*
      ---------------------------------------------------------------------------
         HELPERS
      ---------------------------------------------------------------------------
      */

      /**
       * Set selected element.
       *
       * If passes value is <code>null</code>, the selection will be reseted.
       *
       * @param item {qx.ui.core.Widget | null} element to select, or
       *    <code>null</code> to reset selection.
       */
      __setSelected__P_150_4(item) {
        var oldSelected = this.__selected__P_150_2;
        var newSelected = item;
        if (newSelected != null && oldSelected === newSelected) {
          return;
        }
        if (!this.isAllowEmptySelection() && newSelected == null) {
          var firstElement = this.getSelectables(true)[0];
          if (firstElement) {
            newSelected = firstElement;
          }
        }
        this.__selected__P_150_2 = newSelected;
        this.fireDataEvent("changeSelected", newSelected, oldSelected);
      },
      /**
       * Checks if passed element is a child element.
       *
       * @param item {qx.ui.core.Widget} Element to check if child element.
       * @return {Boolean} <code>true</code> if element is child element,
       *    <code>false</code> otherwise.
       */
      __isChildElement__P_150_3(item) {
        var items = this.__selectionProvider__P_150_0.getItems();
        for (var i = 0; i < items.length; i++) {
          if (items[i] === item) {
            return true;
          }
        }
        return false;
      }
    },
    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
     */
    destruct() {
      if (this.__selectionProvider__P_150_0.toHashCode) {
        this._disposeObjects("__selectionProvider__P_150_0");
      } else {
        this.__selectionProvider__P_150_0 = null;
      }
      this._disposeObjects("__selected__P_150_2");
    }
  });
  qx.ui.core.SingleSelectionManager.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Type": {},
      "qx.lang.Object": {}
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
       * Tino Butz (tbtz)
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * Define messages to react on certain channels.
   *
   * The channel names will be used in the {@link #on} method to define handlers which will
   * be called on certain channels and routes. The {@link #emit} method can be used
   * to execute a given route on a channel. {@link #onAny} defines a handler on any channel.
   *
   * *Example*
   *
   * Here is a little example of how to use the messaging.
   *
   * <pre class='javascript'>
   *   var m = new qx.event.Messaging();
   *
   *   m.on("get", "/address/{id}", function(data) {
   *     var id = data.params.id; // 1234
   *     // do something with the id...
   *   },this);
   *
   *   m.emit("get", "/address/1234");
   * </pre>
   */
  qx.Bootstrap.define("qx.event.Messaging", {
    construct() {
      this._listener = {};
      this.__listenerIdCount__P_51_0 = 0;
      this.__channelToIdMapping__P_51_1 = {};
    },
    members: {
      _listener: null,
      __listenerIdCount__P_51_0: null,
      __channelToIdMapping__P_51_1: null,
      /**
       * Adds a route handler for the given channel. The route is called
       * if the {@link #emit} method finds a match.
       *
       * @param channel {String} The channel of the message.
       * @param type {String|RegExp} The type, used for checking if the executed path matches.
       * @param handler {Function} The handler to call if the route matches the executed path.
       * @param scope {var ? null} The scope of the handler.
       * @return {String} The id of the route used to remove the route.
       */
      on(channel, type, handler, scope) {
        return this._addListener(channel, type, handler, scope);
      },
      /**
       * Adds a handler for the "any" channel. The "any" channel is called
       * before all other channels.
       *
       * @param type {String|RegExp} The route, used for checking if the executed path matches
       * @param handler {Function} The handler to call if the route matches the executed path
       * @param scope {var ? null} The scope of the handler.
       * @return {String} The id of the route used to remove the route.
       */
      onAny(type, handler, scope) {
        return this._addListener("any", type, handler, scope);
      },
      /**
       * Adds a listener for a certain channel.
       *
       * @param channel {String} The channel the route should be registered for
       * @param type {String|RegExp} The type, used for checking if the executed path matches
       * @param handler {Function} The handler to call if the route matches the executed path
       * @param scope {var ? null} The scope of the handler.
       * @return {String} The id of the route used to remove the route.
       */
      _addListener(channel, type, handler, scope) {
        var listeners = this._listener[channel] = this._listener[channel] || {};
        var id = this.__listenerIdCount__P_51_0++;
        var params = [];
        var param = null;

        // Convert the route to a regular expression.
        if (qx.lang.Type.isString(type)) {
          var paramsRegexp = /\{([\w\d]+)\}/g;
          while ((param = paramsRegexp.exec(type)) !== null) {
            params.push(param[1]);
          }
          type = new RegExp("^" + type.replace(paramsRegexp, "([^/]+)") + "$");
        }
        listeners[id] = {
          regExp: type,
          params: params,
          handler: handler,
          scope: scope
        };
        this.__channelToIdMapping__P_51_1[id] = channel;
        return id;
      },
      /**
       * Removes a registered listener by the given id.
       *
       * @param id {String} The id of the registered listener.
       */
      remove(id) {
        var channel = this.__channelToIdMapping__P_51_1[id];
        var listener = this._listener[channel];
        delete listener[id];
        delete this.__channelToIdMapping__P_51_1[id];
      },
      /**
       * Checks if a listener is registered for the given path in the given channel.
       *
       * @param channel {String} The channel of the message.
       * @param path {String} The path to check.
       * @return {Boolean} Whether a listener is registered.
       */
      has(channel, path) {
        var listeners = this._listener[channel];
        if (!listeners || qx.lang.Object.isEmpty(listeners)) {
          return false;
        }
        for (var id in listeners) {
          var listener = listeners[id];
          if (listener.regExp.test(path)) {
            return true;
          }
        }
        return false;
      },
      /**
       * Sends a message on the given channel and informs all matching route handlers.
       *
       * @param channel {String} The channel of the message.
       * @param path {String} The path to execute
       * @param params {Map} The given parameters that should be propagated
       * @param customData {var} The given custom data that should be propagated
       */
      emit(channel, path, params, customData) {
        this._emit(channel, path, params, customData);
      },
      /**
       * Executes a certain channel with a given path. Informs all
       * route handlers that match with the path.
       *
       * @param channel {String} The channel to execute.
       * @param path {String} The path to check
       * @param params {Map} The given parameters that should be propagated
       * @param customData {var} The given custom data that should be propagated
       */
      _emit(channel, path, params, customData) {
        var listenerMatchedAny = false;
        var listener = this._listener["any"];
        listenerMatchedAny = this._emitListeners(channel, path, listener, params, customData);
        var listenerMatched = false;
        listener = this._listener[channel];
        listenerMatched = this._emitListeners(channel, path, listener, params, customData);
        if (!listenerMatched && !listenerMatchedAny) {
          qx.Bootstrap.info("No listener found for " + path);
        }
      },
      /**
       * Executes all given listener for a certain channel. Checks all listeners if they match
       * with the given path and executes the stored handler of the matching route.
       *
       * @param channel {String} The channel to execute.
       * @param path {String} The path to check
       * @param listeners {Map[]} All routes to test and execute.
       * @param params {Map} The given parameters that should be propagated
       * @param customData {var} The given custom data that should be propagated
       *
       * @return {Boolean} Whether the route has been executed
       */
      _emitListeners(channel, path, listeners, params, customData) {
        if (!listeners || qx.lang.Object.isEmpty(listeners)) {
          return false;
        }
        var listenerMatched = false;
        for (var id in listeners) {
          var listener = listeners[id];
          listenerMatched |= this._emitRoute(channel, path, listener, params, customData);
        }
        return listenerMatched;
      },
      /**
       * Executes a certain listener. Checks if the listener matches the given path and
       * executes the stored handler of the route.
       *
       * @param channel {String} The channel to execute.
       * @param path {String} The path to check
       * @param listener {Map} The route data.
       * @param params {Map} The given parameters that should be propagated
       * @param customData {var} The given custom data that should be propagated
       *
       * @return {Boolean} Whether the route has been executed
       */
      _emitRoute(channel, path, listener, params, customData) {
        var match = listener.regExp.exec(path);
        if (match) {
          var params = params || {};
          var param = null;
          var value = null;
          match.shift(); // first match is the whole path
          for (var i = 0; i < match.length; i++) {
            value = match[i];
            param = listener.params[i];
            if (param) {
              params[param] = value;
            } else {
              params[i] = value;
            }
          }
          listener.handler.call(listener.scope, {
            path: path,
            params: params,
            customData: customData
          });
        }
        return match != undefined;
      }
    }
  });
  qx.event.Messaging.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-15.js.map?dt=1769807054086
qx.$$packageData['15'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
