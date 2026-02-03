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
      "qx.event.Registration": {
        "construct": true,
        "defer": "runtime",
        "require": true
      },
      "qx.ui.core.Widget": {},
      "qx.event.type.Event": {},
      "qx.event.Pool": {},
      "qx.event.Utils": {}
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
   * Connects the widgets to the browser DOM events.
   */
  qx.Class.define("qx.ui.core.EventHandler", {
    extend: qx.core.Object,
    implement: qx.event.IEventHandler,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.core.Object.constructor.call(this);
      this.__manager__P_104_0 = qx.event.Registration.getManager(window);
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Integer} Priority of this handler */
      PRIORITY: qx.event.Registration.PRIORITY_FIRST,
      /** @type {Map} Supported event types. Identical to events map of qx.ui.core.Widget */
      SUPPORTED_TYPES: {
        // mouse events
        mousemove: 1,
        mouseover: 1,
        mouseout: 1,
        mousedown: 1,
        mouseup: 1,
        click: 1,
        auxclick: 1,
        dblclick: 1,
        contextmenu: 1,
        mousewheel: 1,
        // key events
        keyup: 1,
        keydown: 1,
        keypress: 1,
        keyinput: 1,
        // mouse capture
        capture: 1,
        losecapture: 1,
        // focus events
        focusin: 1,
        focusout: 1,
        focus: 1,
        blur: 1,
        activate: 1,
        deactivate: 1,
        // appear events
        appear: 1,
        disappear: 1,
        // drag drop events
        dragstart: 1,
        dragend: 1,
        dragover: 1,
        dragleave: 1,
        drop: 1,
        drag: 1,
        dragchange: 1,
        droprequest: 1,
        // touch events
        touchstart: 1,
        touchend: 1,
        touchmove: 1,
        touchcancel: 1,
        // gestures
        tap: 1,
        longtap: 1,
        swipe: 1,
        dbltap: 1,
        track: 1,
        trackend: 1,
        trackstart: 1,
        pinch: 1,
        rotate: 1,
        roll: 1,
        // pointer events
        pointermove: 1,
        pointerover: 1,
        pointerout: 1,
        pointerdown: 1,
        pointerup: 1,
        pointercancel: 1
      },
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: false
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      __manager__P_104_0: null,
      /**
       * @type {Map} Supported focus event types
       *
       * @lint ignoreReferenceField(__focusEvents)
       */
      __focusEvents__P_104_1: {
        focusin: 1,
        focusout: 1,
        focus: 1,
        blur: 1
      },
      /**
       * @type {Map} Map of events which should be fired independently from being disabled
       *
       * @lint ignoreReferenceField(__ignoreDisabled)
       */
      __ignoreDisabled__P_104_2: {
        // mouse events
        mouseover: 1,
        mouseout: 1,
        // appear events
        appear: 1,
        disappear: 1
      },
      // interface implementation
      canHandleEvent(target, type) {
        return target instanceof qx.ui.core.Widget;
      },
      /**
       * Dispatches a DOM event on a widget.
       *
       * @param domEvent {qx.event.type.Event} The event object to dispatch.
       */
      _dispatchEvent(domEvent) {
        // EVENT TARGET
        var domTarget = domEvent.getTarget();
        var widgetTarget = qx.ui.core.Widget.getWidgetByElement(domTarget);
        var targetChanged = false;
        while (widgetTarget && widgetTarget.isAnonymous()) {
          var targetChanged = true;
          widgetTarget = widgetTarget.getLayoutParent();
        }

        // don't activate anonymous widgets!
        if (widgetTarget && targetChanged && domEvent.getType() == "activate") {
          widgetTarget.getContentElement().activate();
        }

        // Correcting target for focus events
        if (this.__focusEvents__P_104_1[domEvent.getType()]) {
          widgetTarget = widgetTarget && widgetTarget.getFocusTarget();

          // Whether nothing is returned
          if (!widgetTarget) {
            return;
          }
        }

        // EVENT RELATED TARGET
        if (domEvent.getRelatedTarget) {
          var domRelatedTarget = domEvent.getRelatedTarget();
          var widgetRelatedTarget = qx.ui.core.Widget.getWidgetByElement(domRelatedTarget);
          while (widgetRelatedTarget && widgetRelatedTarget.isAnonymous()) {
            widgetRelatedTarget = widgetRelatedTarget.getLayoutParent();
          }
          if (widgetRelatedTarget) {
            // Correcting target for focus events
            if (this.__focusEvents__P_104_1[domEvent.getType()]) {
              widgetRelatedTarget = widgetRelatedTarget.getFocusTarget();
            }

            // If target and related target are identical ignore the event
            if (widgetRelatedTarget === widgetTarget) {
              return;
            }
          }
        }

        // EVENT CURRENT TARGET
        var currentTarget = domEvent.getCurrentTarget();
        var currentWidget = qx.ui.core.Widget.getWidgetByElement(currentTarget);
        if (!currentWidget || currentWidget.isAnonymous()) {
          return;
        }

        // Correcting target for focus events
        if (this.__focusEvents__P_104_1[domEvent.getType()]) {
          currentWidget = currentWidget.getFocusTarget();
        }

        // Ignore most events in the disabled state.
        var type = domEvent.getType();
        if (!currentWidget || !(currentWidget.isEnabled() || this.__ignoreDisabled__P_104_2[type])) {
          return;
        }

        // PROCESS LISTENERS

        // Load listeners
        var capture = domEvent.getEventPhase() == qx.event.type.Event.CAPTURING_PHASE;
        var listeners = this.__manager__P_104_0.getListeners(currentWidget, type, capture);
        if (domEvent.getEventPhase() == qx.event.type.Event.AT_TARGET) {
          if (!listeners) {
            listeners = [];
          }
          var otherListeners = this.__manager__P_104_0.getListeners(currentWidget, type, !capture);
          if (otherListeners) {
            listeners = listeners.concat(otherListeners);
          }
        }
        if (!listeners || listeners.length === 0) {
          return;
        }

        // Create cloned event with correct target
        var widgetEvent = qx.event.Pool.getInstance().getObject(domEvent.constructor);
        domEvent.clone(widgetEvent);
        widgetEvent.setTarget(widgetTarget);
        widgetEvent.setRelatedTarget(widgetRelatedTarget || null);
        widgetEvent.setCurrentTarget(currentWidget);

        // Keep original target of DOM event, otherwise map it to the original
        var orig = domEvent.getOriginalTarget();
        if (orig) {
          var widgetOriginalTarget = qx.ui.core.Widget.getWidgetByElement(orig);
          while (widgetOriginalTarget && widgetOriginalTarget.isAnonymous()) {
            widgetOriginalTarget = widgetOriginalTarget.getLayoutParent();
          }
          widgetEvent.setOriginalTarget(widgetOriginalTarget);
        } else {
          widgetEvent.setOriginalTarget(domTarget);
        }

        // Dispatch it on all listeners
        var tracker = {};
        qx.event.Utils.then(tracker, function () {
          return qx.event.Utils.series(listeners, function (listener) {
            var context = listener.context || currentWidget;
            return listener.handler.call(context, widgetEvent);
          });
        });

        // Synchronize propagation stopped/prevent default property
        qx.event.Utils.then(tracker, function () {
          if (widgetEvent.getPropagationStopped()) {
            domEvent.stopPropagation();
          }
          if (widgetEvent.getDefaultPrevented()) {
            domEvent.preventDefault();
          }
        });
        return qx.event.Utils.then(tracker, function () {
          qx.event.Pool.getInstance().poolObject(widgetEvent);
        });
      },
      // interface implementation
      registerEvent(target, type, capture) {
        var elem;
        if (type === "focus" || type === "blur") {
          elem = target.getFocusElement();
        } else {
          elem = target.getContentElement();
        }
        if (elem) {
          elem.addListener(type, this._dispatchEvent, this, capture);
        }
      },
      // interface implementation
      unregisterEvent(target, type, capture) {
        var elem;
        if (type === "focus" || type === "blur") {
          elem = target.getFocusElement();
        } else {
          elem = target.getContentElement();
        }
        if (elem) {
          elem.removeListener(type, this._dispatchEvent, this, capture);
        }
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this.__manager__P_104_0 = null;
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
  qx.ui.core.EventHandler.$$dbClassInfo = $$dbClassInfo;
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
        var __TRACE_LOGGING__P_160_0 = false; //(event._type == "pointerup" && event._target.className === "qx-toolbar-button-checked");
        var __TRACE__P_160_1 = function () {};
        if (__TRACE_LOGGING__P_160_0) {
          var serial = (this.SERIAL || 0) + 1;
          this.SERIAL = serial + 1;
          __TRACE__P_160_1 = function () {
            var args = [].slice.apply(arguments);
            args.unshift("serial #" + serial + ": ");
            console.log.apply(this, args);
          };
        }
        qx.event.Utils.catch(tracker, function () {
          // This function must exist to suppress "unhandled rejection" messages from promises
          __TRACE__P_160_1("Aborted serial=" + serial + ", type=" + event.getType());
        });

        // capturing phase
        qx.event.Utils.then(tracker, function () {
          // loop through the hierarchy in reverted order (from root)
          event.setEventPhase(qx.event.type.Event.CAPTURING_PHASE);
          __TRACE__P_160_1("captureList=" + captureList.length);
          return qx.event.Utils.series(captureList, function (localList, i) {
            __TRACE__P_160_1("captureList[" + i + "]: localList.length=" + localList.length);
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
                __TRACE__P_160_1("captureList[" + i + "] => localList[" + listenerIndex + "] callListener");
                return listener.handler.call(context, event);
              } else {
                __TRACE__P_160_1("captureList[" + i + "] => localList[" + listenerIndex + "] is blacklisted");
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
          __TRACE__P_160_1("targetList=" + targetList.length);
          return qx.event.Utils.series(targetList, function (localList, i) {
            __TRACE__P_160_1("targetList[" + i + "] localList.length=" + localList.length);
            var result = qx.event.Utils.series(localList, function (listener, listenerIndex) {
              __TRACE__P_160_1("targetList[" + i + "] -> localList[" + listenerIndex + "] callListener");
              context = listener.context || target;
              {
                // warn if the context is disposed
                if (context && context.isDisposed && context.isDisposed()) {
                  self.warn("The context object '" + context + "' for the event '" + type + "' of '" + target + "'is already disposed.");
                }
              }
              __TRACE__P_160_1("Calling target serial=" + serial + ", type=" + event.getType());
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
          __TRACE__P_160_1("bubbleList=" + bubbleList.length);
          return qx.event.Utils.series(bubbleList, function (localList, i) {
            __TRACE__P_160_1("bubbleList[" + i + "] localList.length=" + localList.length);
            var currentTarget = bubbleTargets[i];
            event.setCurrentTarget(currentTarget);
            var result = qx.event.Utils.series(localList, function (listener, listenerIndex) {
              __TRACE__P_160_1("bubbleList[" + i + "] -> localList[" + listenerIndex + "] callListener");
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
        if (__TRACE_LOGGING__P_160_0) {
          if (tracker.promise) {
            __TRACE__P_160_1("events promised");
            qx.event.Utils.then(tracker, function () {
              __TRACE__P_160_1("events promised done");
            });
          } else {
            __TRACE__P_160_1("events done");
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
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["device.name", "device.touch", "device.type", "device.pixelRatio"],
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
   * The class is responsible for device detection. This is specially useful
   * if you are on a mobile device.
   *
   * This class is used by {@link qx.core.Environment} and should not be used
   * directly. Please check its class comment for details how to use it.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.Device", {
    statics: {
      /** Maps user agent names to device IDs */
      __ids__P_167_0: {
        "Windows Phone": "iemobile",
        iPod: "ipod",
        iPad: "ipad",
        iPhone: "iphone",
        PSP: "psp",
        "PLAYSTATION 3": "ps3",
        "Nintendo Wii": "wii",
        "Nintendo DS": "ds",
        XBOX: "xbox",
        Xbox: "xbox"
      },
      /**
       * Returns the name of the current device if detectable. It falls back to
       * <code>pc</code> if the detection for other devices fails.
       *
       * @internal
       * @return {String} The string of the device found.
       */
      getName() {
        var str = [];
        for (var key in qx.bom.client.Device.__ids__P_167_0) {
          str.push(key);
        }
        var reg = new RegExp("(" + str.join("|").replace(/\./g, ".") + ")", "g");
        var match = reg.exec(navigator.userAgent);
        if (match && match[1]) {
          return qx.bom.client.Device.__ids__P_167_0[match[1]];
        }
        return "pc";
      },
      /**
       * Determines on what type of device the application is running.
       * Valid values are: "mobile", "tablet" or "desktop".
       * @return {String} The device type name of determined device.
       */
      getType() {
        return qx.bom.client.Device.detectDeviceType(navigator.userAgent);
      },
      /**
       * Detects the device type, based on given userAgentString.
       *
       * @param userAgentString {String} userAgent parameter, needed for decision.
       * @return {String} The device type name of determined device: "mobile","desktop","tablet"
       */
      detectDeviceType(userAgentString) {
        if (qx.bom.client.Device.detectTabletDevice(userAgentString)) {
          return "tablet";
        } else if (qx.bom.client.Device.detectMobileDevice(userAgentString)) {
          return "mobile";
        }
        return "desktop";
      },
      /**
       * Detects if a device is a mobile phone. (Tablets excluded.)
       * @param userAgentString {String} userAgent parameter, needed for decision.
       * @return {Boolean} Flag which indicates whether it is a mobile device.
       */
      detectMobileDevice(userAgentString) {
        return /android.+mobile|ip(hone|od)|bada\/|blackberry|BB10|maemo|opera m(ob|in)i|fennec|NetFront|phone|psp|symbian|IEMobile|windows (ce|phone)|xda/i.test(userAgentString);
      },
      /**
       * Detects if a device is a tablet device.
       * @param userAgentString {String} userAgent parameter, needed for decision.
       * @return {Boolean} Flag which indicates whether it is a tablet device.
       */
      detectTabletDevice(userAgentString) {
        var iPadOS13Up = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
        var isIE10Tablet = /MSIE 10/i.test(userAgentString) && /ARM/i.test(userAgentString) && !/windows phone/i.test(userAgentString);
        var isCommonTablet = !/android.+mobile|Tablet PC/i.test(userAgentString) && /Android|ipad|tablet|playbook|silk|kindle|psp/i.test(userAgentString);
        return isIE10Tablet || isCommonTablet || iPadOS13Up;
      },
      /**
       * Detects the device's pixel ratio. Returns 1 if detection is not possible.
       *
       * @return {Number} The device's pixel ratio
       */
      getDevicePixelRatio() {
        if (typeof window.devicePixelRatio !== "undefined") {
          return window.devicePixelRatio;
        }
        return 1;
      },
      /**
       * Detects if either touch events or pointer events are supported.
       * Additionally it checks if touch is enabled for pointer events.
       *
       * @return {Boolean} <code>true</code>, if the device supports touch
       */
      getTouch() {
        return "ontouchstart" in window || window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
      }
    },
    defer(statics) {
      qx.core.Environment.add("device.name", statics.getName);
      qx.core.Environment.add("device.touch", statics.getTouch);
      qx.core.Environment.add("device.type", statics.getType);
      qx.core.Environment.add("device.pixelRatio", statics.getDevicePixelRatio);
    }
  });
  qx.bom.client.Device.$$dbClassInfo = $$dbClassInfo;
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
      __lastTouch__P_186_0: null
    },
    /**
     * Create a new instance
     *
     * @param target {Element} element on which to listen for native touch events
     * @param emitter {qx.event.Emitter?} Event emitter (used if dispatchEvent
     * is not supported, e.g. in IE8)
     */
    construct(target, emitter) {
      this.__defaultTarget__P_186_1 = target;
      this.__emitter__P_186_2 = emitter;
      this.__eventNames__P_186_3 = [];
      this.__buttonStates__P_186_4 = [];
      this.__activeTouches__P_186_5 = [];
      this._processedFlag = "$$qx" + this.classname.substr(this.classname.lastIndexOf(".") + 1) + "Processed";
      var engineName = qx.core.Environment.get("engine.name");
      var docMode = parseInt(qx.core.Environment.get("browser.documentmode"), 10);
      if (engineName == "mshtml" && docMode == 10) {
        // listen to native prefixed events and custom unprefixed (see bug #8921)
        this.__eventNames__P_186_3 = ["MSPointerDown", "MSPointerMove", "MSPointerUp", "MSPointerCancel", "MSPointerOver", "MSPointerOut", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout"];
        this._initPointerObserver();
      } else {
        if (qx.core.Environment.get("event.mspointer")) {
          this.__nativePointerEvents__P_186_6 = true;
        }
        this.__eventNames__P_186_3 = ["pointerdown", "pointermove", "pointerup", "pointercancel", "pointerover", "pointerout"];
        this._initPointerObserver();
      }
      if (!qx.core.Environment.get("event.mspointer")) {
        if (qx.core.Environment.get("device.touch")) {
          this.__eventNames__P_186_3 = ["touchstart", "touchend", "touchmove", "touchcancel"];
          this._initObserver(this._onTouchEvent);
        }
        this.__eventNames__P_186_3 = ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "contextmenu"];
        this._initObserver(this._onMouseEvent);
      }
    },
    members: {
      __defaultTarget__P_186_1: null,
      __emitter__P_186_2: null,
      __eventNames__P_186_3: null,
      __nativePointerEvents__P_186_6: false,
      __wrappedListener__P_186_7: null,
      __lastButtonState__P_186_8: 0,
      __buttonStates__P_186_4: null,
      __primaryIdentifier__P_186_9: null,
      __activeTouches__P_186_5: null,
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
        this.__wrappedListener__P_186_7 = qx.lang.Function.listener(callback, this);
        this.__eventNames__P_186_3.forEach(function (type) {
          if (useEmitter && qx.dom.Node.isDocument(this.__defaultTarget__P_186_1)) {
            if (!this.__defaultTarget__P_186_1.$$emitter) {
              this.__defaultTarget__P_186_1.$$emitter = new qx.event.Emitter();
            }
            this.__defaultTarget__P_186_1.$$emitter.on(type, this.__wrappedListener__P_186_7);
          } else {
            qx.bom.Event.addNativeListener(this.__defaultTarget__P_186_1, type, this.__wrappedListener__P_186_7);
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
        if (!this.__nativePointerEvents__P_186_6) {
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
        if (domEvent.touches.length < this.__activeTouches__P_186_5.length) {
          // Firing pointer cancel for previously active touches.
          for (var i = this.__activeTouches__P_186_5.length - 1; i >= 0; i--) {
            var cancelEvent = new qx.event.type.dom.Pointer("pointercancel", domEvent, {
              identifier: this.__activeTouches__P_186_5[i].identifier,
              target: domEvent.target,
              pointerType: "touch",
              pointerId: this.__activeTouches__P_186_5[i].identifier + 2
            });
            this._fireEvent(cancelEvent, "pointercancel", domEvent.target);
          }

          // Reset primary identifier
          this.__primaryIdentifier__P_186_9 = null;

          // cleanup of active touches array.
          this.__activeTouches__P_186_5 = [];

          // Do nothing after pointer cancel.
          return;
        }
        if (domEvent.type == "touchstart" && this.__primaryIdentifier__P_186_9 === null) {
          this.__primaryIdentifier__P_186_9 = changedTouches[0].identifier;
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
          if (touch.identifier == this.__primaryIdentifier__P_186_9) {
            touchProps.isPrimary = true;
            // always simulate left click on touch interactions for primary pointer
            touchProps.button = 0;
            touchProps.buttons = 1;
            qx.event.handler.PointerCore.__lastTouch__P_186_0 = {
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
            if (this.__primaryIdentifier__P_186_9 == touch.identifier) {
              this.__primaryIdentifier__P_186_9 = null;
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
          this.__buttonStates__P_186_4[domEvent.which] = 1;
        } else if (domEvent.type == "mouseup") {
          if (qx.core.Environment.get("os.name") == "osx" && qx.core.Environment.get("engine.name") == "gecko") {
            if (this.__buttonStates__P_186_4[domEvent.which] != 1 && domEvent.ctrlKey) {
              this.__buttonStates__P_186_4[1] = 0;
            }
          }
          this.__buttonStates__P_186_4[domEvent.which] = 0;
        }
        var type = qx.event.handler.PointerCore.MOUSE_TO_POINTER_MAPPING[domEvent.type];
        var target = qx.bom.Event.getTarget(domEvent);
        var buttonsPressed = qx.lang.Array.sum(this.__buttonStates__P_186_4);
        var mouseProps = {
          pointerType: "mouse",
          pointerId: 1
        };

        // if the button state changes but not from or to zero
        if (this.__lastButtonState__P_186_8 != buttonsPressed && buttonsPressed !== 0 && this.__lastButtonState__P_186_8 !== 0) {
          var moveEvt = new qx.event.type.dom.Pointer("pointermove", domEvent, mouseProps);
          this._fireEvent(moveEvt, "pointermove", target);
        }
        this.__lastButtonState__P_186_8 = buttonsPressed;

        // pointerdown should only trigger form the first pressed button.
        if (domEvent.type == "mousedown" && buttonsPressed > 1) {
          return;
        }

        // pointerup should only trigger if user releases all buttons.
        if (domEvent.type == "mouseup" && buttonsPressed > 0) {
          return;
        }
        if (domEvent.type == "contextmenu") {
          this.__buttonStates__P_186_4[domEvent.which] = 0;
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
            this.__activeTouches__P_186_5.push(changedTouches[i]);
          }
        } else if (type == "touchend" || type == "touchcancel") {
          var updatedActiveTouches = [];
          for (var i = 0; i < this.__activeTouches__P_186_5.length; i++) {
            var add = true;
            for (var j = 0; j < changedTouches.length; j++) {
              if (this.__activeTouches__P_186_5[i].identifier == changedTouches[j].identifier) {
                add = false;
                break;
              }
            }
            if (add) {
              updatedActiveTouches.push(this.__activeTouches__P_186_5[i]);
            }
          }
          this.__activeTouches__P_186_5 = updatedActiveTouches;
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
        var touch = qx.event.handler.PointerCore.__lastTouch__P_186_0;
        if (touch) {
          var timeSinceTouch = new Date().getTime() - touch.time;
          var dist = qx.event.handler.PointerCore.SIM_MOUSE_DISTANCE;
          var distX = Math.abs(x - qx.event.handler.PointerCore.__lastTouch__P_186_0.x);
          var distY = Math.abs(y - qx.event.handler.PointerCore.__lastTouch__P_186_0.y);
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
        for (var i = 0; i < this.__eventNames__P_186_3.length; i++) {
          qx.bom.Event.removeNativeListener(this.__defaultTarget__P_186_1, this.__eventNames__P_186_3[i], this.__wrappedListener__P_186_7);
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
          if (!this.__nativePointerEvents__P_186_6) {
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
        this.__defaultTarget__P_186_1 = this.__emitter__P_186_2 = null;
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
      this.__manager__P_126_0 = manager;
      this.__window__P_126_1 = manager.getWindow();
      this.__root__P_126_2 = this.__window__P_126_1.document;
      qx.event.handler.PointerCore.apply(this, [this.__root__P_126_2]);
    },
    members: {
      __manager__P_126_0: null,
      __window__P_126_1: null,
      __root__P_126_2: null,
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
              return qx.event.Registration.fireEvent(self.__root__P_126_2, qx.event.handler.PointerCore.POINTER_TO_GESTURE_MAPPING[type], qx.event.type.Pointer, [domEvent, target, null, false, false]);
            }
          });
          qx.event.Utils.then(tracker, function () {
            // Fire user action event
            return qx.event.Registration.fireEvent(self.__window__P_126_1, "useraction", qx.event.type.Data, [type]);
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
        this.__callBase__P_126_3("dispose");
        this.__manager__P_126_0 = this.__window__P_126_1 = this.__root__P_126_2 = null;
      },
      /**
       * Call overridden method.
       *
       * @param method {String} Name of the overridden method.
       * @param args {Array} Arguments.
       */
      __callBase__P_126_3(method, args) {
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
      this.__defaultTarget__P_127_0 = target;
      this.__emitter__P_127_1 = emitter;
      this.__gesture__P_127_2 = {};
      this.__lastTap__P_127_3 = {};
      this.__stopMomentum__P_127_4 = {};
      this.__momentum__P_127_5 = {};
      this.__rollEvents__P_127_6 = [];
      this._initObserver();
    },
    members: {
      __defaultTarget__P_127_0: null,
      __emitter__P_127_1: null,
      __gesture__P_127_2: null,
      __eventName__P_127_7: null,
      __primaryTarget__P_127_8: null,
      __isMultiPointerGesture__P_127_9: null,
      __initialAngle__P_127_10: null,
      __lastTap__P_127_3: null,
      __rollImpulseId__P_127_11: null,
      __stopMomentum__P_127_4: null,
      __initialDistance__P_127_12: null,
      __momentum__P_127_5: null,
      __rollEvents__P_127_6: null,
      __rollEventsCountStart__P_127_13: 0,
      __rollEventsCount__P_127_14: 0,
      __touchPadDetectionPerformed__P_127_15: false,
      __lastRollEventTime__P_127_16: 0,
      /**
       * Register pointer event listeners
       */
      _initObserver() {
        qx.event.handler.GestureCore.GESTURE_EVENTS.forEach(function (gestureType) {
          qxWeb(this.__defaultTarget__P_127_0).on(gestureType, this.checkAndFireGesture, this);
        }.bind(this));
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
          qxWeb(this.__defaultTarget__P_127_0).on("dblclick", this._onDblClick, this);
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
          qxWeb(this.__defaultTarget__P_127_0).off(pointerType, this.checkAndFireGesture, this);
        }.bind(this));
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
          qxWeb(this.__defaultTarget__P_127_0).off("dblclick", this._onDblClick, this);
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
        if (this.__gesture__P_127_2[domEvent.pointerId]) {
          this.__stopLongTapTimer__P_127_17(this.__gesture__P_127_2[domEvent.pointerId]);
          delete this.__gesture__P_127_2[domEvent.pointerId];
        }

        /*
          If the dom event's target or one of its ancestors have
          a gesture handler, we don't need to fire the gesture again
          since it bubbles.
         */
        if (this._hasIntermediaryHandler(target)) {
          return;
        }
        this.__gesture__P_127_2[domEvent.pointerId] = {
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
          longTapTimer: window.setTimeout(this.__fireLongTap__P_127_18.bind(this, domEvent, target), qx.event.handler.GestureCore.LONGTAP_TIME)
        };
        if (domEvent.isPrimary) {
          this.__isMultiPointerGesture__P_127_9 = false;
          this.__primaryTarget__P_127_8 = target;
          this.__fireTrack__P_127_19("trackstart", domEvent, target);
        } else {
          this.__isMultiPointerGesture__P_127_9 = true;
          if (Object.keys(this.__gesture__P_127_2).length === 2) {
            this.__initialAngle__P_127_10 = this._calcAngle();
            this.__initialDistance__P_127_12 = this._calcDistance();
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
        var gesture = this.__gesture__P_127_2[domEvent.pointerId];
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
          if (Object.keys(this.__gesture__P_127_2).length === 2) {
            this.__fireRotate__P_127_20(domEvent, gesture.target);
            this.__firePinch__P_127_21(domEvent, gesture.target);
          }
          if (!this.__isMultiPointerGesture__P_127_9) {
            this.__fireTrack__P_127_19("track", domEvent, gesture.target);
            this._fireRoll(domEvent, "touch", gesture.target);
          }

          // abort long tap timer if the distance is too big
          if (gesture.isTap) {
            gesture.isTap = this._isBelowTapMaxDistance(domEvent);
            if (!gesture.isTap) {
              this.__stopLongTapTimer__P_127_17(gesture);
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
        while (target && target !== this.__defaultTarget__P_127_0) {
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
        if (!this.__gesture__P_127_2[domEvent.pointerId]) {
          return;
        }
        var gesture = this.__gesture__P_127_2[domEvent.pointerId];
        // delete the long tap
        this.__stopLongTapTimer__P_127_17(gesture);

        /*
          If the dom event's target or one of its ancestors have
          a gesture handler, we don't need to fire the gesture again
          since it bubbles.
         */
        if (this._hasIntermediaryHandler(target)) {
          return;
        }

        // always start the roll impulse on the original target
        this.__handleRollImpulse__P_127_22(gesture.velocityX, gesture.velocityY, domEvent, gesture.target);
        this.__fireTrack__P_127_19("trackend", domEvent, gesture.target);
        if (gesture.isTap) {
          if (target !== gesture.target) {
            delete this.__gesture__P_127_2[domEvent.pointerId];
            return;
          }
          this._fireEvent(domEvent, "tap", domEvent.target || target);
          var isDblTap = false;
          if (Object.keys(this.__lastTap__P_127_3).length > 0) {
            // delete old tap entries
            var limit = Date.now() - qx.event.handler.GestureCore.DOUBLETAP_TIME;
            for (var time in this.__lastTap__P_127_3) {
              if (time < limit) {
                delete this.__lastTap__P_127_3[time];
              } else {
                var lastTap = this.__lastTap__P_127_3[time];
                var isBelowDoubleTapDistance = this.__isBelowDoubleTapDistance__P_127_23(lastTap.x, lastTap.y, domEvent.clientX, domEvent.clientY, domEvent.getPointerType());
                var isSameTarget = lastTap.target === (domEvent.target || target);
                var isSameButton = lastTap.button === domEvent.button;
                if (isBelowDoubleTapDistance && isSameButton && isSameTarget) {
                  isDblTap = true;
                  delete this.__lastTap__P_127_3[time];
                  this._fireEvent(domEvent, "dbltap", domEvent.target || target);
                }
              }
            }
          }
          if (!isDblTap) {
            this.__lastTap__P_127_3[Date.now()] = {
              x: domEvent.clientX,
              y: domEvent.clientY,
              target: domEvent.target || target,
              button: domEvent.button
            };
          }
        } else if (!this._isBelowTapMaxDistance(domEvent)) {
          var swipe = this.__getSwipeGesture__P_127_24(domEvent, target);
          if (swipe) {
            domEvent.swipe = swipe;
            this._fireEvent(domEvent, "swipe", gesture.target || target);
          }
        }
        delete this.__gesture__P_127_2[domEvent.pointerId];
      },
      /**
       * Stops the momentum scrolling currently running.
       *
       * @param id {Integer} The timeoutId of a 'roll' event
       */
      stopMomentum(id) {
        this.__stopMomentum__P_127_4[id] = true;
      },
      /**
       * Cancels the gesture if running.
       * @param id {Number} The pointer Id.
       */
      gestureCancel(id) {
        if (this.__gesture__P_127_2[id]) {
          this.__stopLongTapTimer__P_127_17(this.__gesture__P_127_2[id]);
          delete this.__gesture__P_127_2[id];
        }
        if (this.__momentum__P_127_5[id]) {
          this.stopMomentum(this.__momentum__P_127_5[id]);
          delete this.__momentum__P_127_5[id];
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
        this.__gesture__P_127_2[id].target = target;
      },
      /**
       * Method which will be called recursively to provide a momentum scrolling.
       * @param deltaX {Number} The last offset in X direction
       * @param deltaY {Number} The last offset in Y direction
       * @param domEvent {Event} The original gesture event
       * @param target {Element} The target of the momentum roll events
       * @param time {Number ?} The time in ms between the last two calls
       */
      __handleRollImpulse__P_127_22(deltaX, deltaY, domEvent, target, time) {
        var oldTimeoutId = domEvent.timeoutId;
        if (!time && this.__momentum__P_127_5[domEvent.pointerId]) {
          // new roll impulse started, stop the old one
          this.stopMomentum(this.__momentum__P_127_5[domEvent.pointerId]);
        }
        // do nothing if we don't need to scroll
        if (Math.abs(deltaY) < 1 && Math.abs(deltaX) < 1 || this.__stopMomentum__P_127_4[oldTimeoutId] || this.getWindow && !this.getWindow()) {
          delete this.__stopMomentum__P_127_4[oldTimeoutId];
          delete this.__momentum__P_127_5[domEvent.pointerId];
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
          this.__handleRollImpulse__P_127_22(deltaX, deltaY, domEvent, target, time);
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
        this.__momentum__P_127_5[domEvent.pointerId] = timeoutId;
        this._fireEvent(domEvent, "roll", domEvent.target || target);
      },
      /**
       * Calculates the angle of the primary and secondary pointer.
       * @return {Number} the rotation angle of the 2 pointers.
       */
      _calcAngle() {
        var pointerA = null;
        var pointerB = null;
        for (var pointerId in this.__gesture__P_127_2) {
          var gesture = this.__gesture__P_127_2[pointerId];
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
        for (var pointerId in this.__gesture__P_127_2) {
          var gesture = this.__gesture__P_127_2[pointerId];
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
      __isBelowDoubleTapDistance__P_127_23(x1, y1, x2, y2, type) {
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
        var gesture = this.__gesture__P_127_2[domEvent.pointerId];
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
        if (!this.__defaultTarget__P_127_0) {
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
        } else if (this.__emitter__P_127_1) {
          evt = new qx.event.type.dom.Custom(type, domEvent, {
            target: this.__defaultTarget__P_127_0,
            currentTarget: this.__defaultTarget__P_127_0,
            srcElement: this.__defaultTarget__P_127_0,
            swipe: domEvent.swipe,
            scale: domEvent.scale,
            angle: domEvent.angle,
            delta: domEvent.delta,
            pointerType: domEvent.pointerType,
            momentum: domEvent.momentum
          });
          this.__emitter__P_127_1.emit(type, domEvent);
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
      __getSwipeGesture__P_127_24(domEvent, target) {
        var gesture = this.__gesture__P_127_2[domEvent.pointerId];
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
      __fireTrack__P_127_19(type, domEvent, target) {
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
      __fireRollEvent__P_127_25(domEvent, target, rollFactor) {
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
      __performAdaptativeRollScrolling__P_127_26(target) {
        var rollFactor = qx.event.handler.GestureCore.ROLL_FACTOR;
        if (qx.util.Wheel.IS_TOUCHPAD) {
          // The domEvent was generated by a touchpad
          rollFactor = qx.event.handler.GestureCore.TOUCHPAD_ROLL_FACTOR;
        }
        this.__lastRollEventTime__P_127_16 = new Date().getTime();
        var reLength = this.__rollEvents__P_127_6.length;
        for (var i = 0; i < reLength; i++) {
          var domEvent = this.__rollEvents__P_127_6[i];
          this.__fireRollEvent__P_127_25(domEvent, target, rollFactor);
        }
        this.__rollEvents__P_127_6 = [];
      },
      /**
       * Ends touch pad detection process.
       */
      __endTouchPadDetection__P_127_27() {
        if (this.__rollEvents__P_127_6.length > qx.event.handler.GestureCore.TOUCHPAD_WHEEL_EVENTS_THRESHOLD) {
          qx.util.Wheel.IS_TOUCHPAD = true;
        } else {
          qx.util.Wheel.IS_TOUCHPAD = false;
        }
        this.__touchPadDetectionPerformed__P_127_15 = true;
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
            if (this.__lastRollEventTime__P_127_16 > 0 && now - this.__lastRollEventTime__P_127_16 > detectionTimeout) {
              // The detection timeout was reached. A new detection step should occur.
              this.__touchPadDetectionPerformed__P_127_15 = false;
              this.__rollEvents__P_127_6 = [];
              this.__lastRollEventTime__P_127_16 = 0;
            }
            if (!this.__touchPadDetectionPerformed__P_127_15) {
              // We are into a detection session. We count the events so that we can decide if
              // they were fired by a real mouse wheel or a touchpad. Just swallow them until the
              // detection period is over.
              if (this.__rollEvents__P_127_6.length === 0) {
                // detection starts
                this.__rollEventsCountStart__P_127_13 = now;
                qx.event.Timer.once(function () {
                  if (!this.__touchPadDetectionPerformed__P_127_15) {
                    // There were not enough events during the TOUCHPAD_WHEEL_EVENTS_PERIOD to actually
                    // trigger a scrolling. Trigger it manually.
                    this.__endTouchPadDetection__P_127_27();
                    this.__performAdaptativeRollScrolling__P_127_26(target);
                  }
                }, this, qx.event.handler.GestureCore.TOUCHPAD_WHEEL_EVENTS_PERIOD + 50);
              }
              this.__rollEvents__P_127_6.push(domEvent);
              this.__rollEventsCount__P_127_14++;
              if (now - this.__rollEventsCountStart__P_127_13 > qx.event.handler.GestureCore.TOUCHPAD_WHEEL_EVENTS_PERIOD) {
                this.__endTouchPadDetection__P_127_27();
              }
            }
            if (this.__touchPadDetectionPerformed__P_127_15) {
              if (this.__rollEvents__P_127_6.length === 0) {
                this.__rollEvents__P_127_6.push(domEvent);
              }
              // Detection is done. We can now decide the roll factor to apply to the delta.
              // Default to a real mouse wheel event as opposed to a touchpad one.
              this.__performAdaptativeRollScrolling__P_127_26(target);
            }
          } else {
            this.__fireRollEvent__P_127_25(domEvent, target, qx.event.handler.GestureCore.ROLL_FACTOR);
          }
        } else {
          var gesture = this.__gesture__P_127_2[domEvent.pointerId];
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
      __fireRotate__P_127_20(domEvent, target) {
        if (!domEvent.isPrimary) {
          var angle = this._calcAngle();
          domEvent.angle = Math.round((angle - this.__initialAngle__P_127_10) % 360);
          this._fireEvent(domEvent, "rotate", this.__primaryTarget__P_127_8);
        }
      },
      /**
       * Fires a pinch event.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       */
      __firePinch__P_127_21(domEvent, target) {
        if (!domEvent.isPrimary) {
          var distance = this._calcDistance();
          var scale = distance / this.__initialDistance__P_127_12;
          domEvent.scale = Math.round(scale * 100) / 100;
          this._fireEvent(domEvent, "pinch", this.__primaryTarget__P_127_8);
        }
      },
      /**
       * Fires the long tap event.
       *
       * @param domEvent {Event} DOM event
       * @param target {Element} event target
       */
      __fireLongTap__P_127_18(domEvent, target) {
        var gesture = this.__gesture__P_127_2[domEvent.pointerId];
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
      __stopLongTapTimer__P_127_17(gesture) {
        if (gesture.longTapTimer) {
          window.clearTimeout(gesture.longTapTimer);
          gesture.longTapTimer = null;
        }
      },
      /**
       * Dispose the current instance
       */
      dispose() {
        for (var gesture in this.__gesture__P_127_2) {
          this.__stopLongTapTimer__P_127_17(gesture);
        }
        this._stopObserver();
        this.__defaultTarget__P_127_0 = this.__emitter__P_127_1 = null;
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
      this.__manager__P_45_0 = manager;
      this.__window__P_45_1 = manager.getWindow();
      this.__root__P_45_2 = this.__window__P_45_1.document;
      qx.event.handler.GestureCore.apply(this, [this.__root__P_45_2]);
    },
    members: {
      __manager__P_45_0: null,
      __window__P_45_1: null,
      __root__P_45_2: null,
      __listener__P_45_3: null,
      __onDblClickWrapped__P_45_4: null,
      __fireRollWrapped__P_45_5: null,
      /**
       * Getter for the internal __window object
       * @return {Window} DOM window instance
       */
      getWindow() {
        return this.__window__P_45_1;
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
        this.__listener__P_45_3 = qx.lang.Function.listener(this.checkAndFireGesture, this);
        qx.event.handler.Gesture.GESTURE_EVENTS.forEach(function (type) {
          qx.event.Registration.addListener(this.__root__P_45_2, type, this.__listener__P_45_3, this);
        }.bind(this));
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
          this.__onDblClickWrapped__P_45_4 = qx.lang.Function.listener(this._onDblClick, this);
          qx.bom.Event.addNativeListener(this.__root__P_45_2, "dblclick", this.__onDblClickWrapped__P_45_4);
        }

        // list to wheel events
        var data = qx.bom.client.Event.getMouseWheel(this.__window__P_45_1);
        this.__fireRollWrapped__P_45_5 = qx.lang.Function.listener(this._fireRoll, this);
        // replaced the useCapture (4th parameter) from this to true
        // see https://github.com/qooxdoo/qooxdoo/pull/9292
        qx.bom.Event.addNativeListener(data.target, data.type, this.__fireRollWrapped__P_45_5, true, false);
      },
      /**
       * Checks if a gesture was made and fires the gesture event.
       *
       * @param pointerEvent {qx.event.type.Pointer} Pointer event
       * @param type {String ? null} type of the event
       * @param target {Element ? null} event target
       */
      checkAndFireGesture(pointerEvent, type, target) {
        this.__callBase__P_45_6("checkAndFireGesture", [pointerEvent.getNativeEvent(), pointerEvent.getType(), pointerEvent.getTarget()]);
      },
      // overridden
      _stopObserver() {
        qx.event.handler.Gesture.GESTURE_EVENTS.forEach(function (type) {
          qx.event.Registration.removeListener(this.__root__P_45_2, type, this.__listener__P_45_3);
        }.bind(this));
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9) {
          qx.bom.Event.removeNativeListener(this.__root__P_45_2, "dblclick", this.__onDblClickWrapped__P_45_4);
        }
        var data = qx.bom.client.Event.getMouseWheel(this.__window__P_45_1);
        qx.bom.Event.removeNativeListener(data.target, data.type, this.__fireRollWrapped__P_45_5);
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
        qx.event.Registration.fireEvent(this.__window__P_45_1, "useraction", qx.event.type.Data, [type]);
      },
      /**
       * Dispose this object
       */
      dispose() {
        this._stopObserver();
        this.__callBase__P_45_6("dispose");
        this.__manager__P_45_0 = this.__window__P_45_1 = this.__root__P_45_2 = this.__onDblClickWrapped__P_45_4 = null;
      },
      /**
       * Call overridden method.
       *
       * @param method {String} Name of the overridden method.
       * @param args {Array} Arguments.
       */
      __callBase__P_45_6(method, args) {
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
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This handler accepts the useraction event fired by the keyboard, mouse and
   * pointer handlers after an user triggered action has occurred.
   */
  qx.Class.define("qx.event.handler.UserAction", {
    extend: qx.core.Object,
    implement: qx.event.IEventHandler,
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
      this.__manager__P_124_0 = manager;
      this.__window__P_124_1 = manager.getWindow();
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
        useraction: 1
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
      __manager__P_124_0: null,
      __window__P_124_1: null,
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
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this.__manager__P_124_0 = this.__window__P_124_1 = null;
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
  qx.event.handler.UserAction.$$dbClassInfo = $$dbClassInfo;
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
      this.__manager__P_44_0 = manager;
      this.__window__P_44_1 = manager.getWindow();

      // Gecko ignores key events when not explicitly clicked in the document.
      if (qx.core.Environment.get("engine.name") == "gecko") {
        this.__root__P_44_2 = this.__window__P_44_1;
      } else {
        this.__root__P_44_2 = this.__window__P_44_1.document.documentElement;
      }

      // Internal sequence cache
      this.__lastUpDownType__P_44_3 = {};

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
      __onKeyUpDownWrapper__P_44_4: null,
      __manager__P_44_0: null,
      __window__P_44_1: null,
      __root__P_44_2: null,
      __lastUpDownType__P_44_3: null,
      __lastKeyCode__P_44_5: null,
      __inputListeners__P_44_6: null,
      __onKeyPressWrapper__P_44_7: null,
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
        var target = this.__getEventTarget__P_44_8();
        var tracker = {};
        var self = this;

        // Only fire when target is defined and visible
        if (target && target.offsetWidth != 0) {
          var event = qx.event.Registration.createEvent("keyinput", qx.event.type.KeyInput, [domEvent, target, charCode]);
          qx.event.Utils.then(tracker, function () {
            self.__manager__P_44_0.dispatchEvent(target, event);
          });
        }

        // Fire user action event
        // Needs to check if still alive first
        if (this.__window__P_44_1) {
          var self = this;
          qx.event.Utils.then(tracker, function () {
            return qx.event.Registration.fireEvent(self.__window__P_44_1, "useraction", qx.event.type.Data, ["keyinput"]);
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
        var target = this.__getEventTarget__P_44_8();
        var keyCode = domEvent.keyCode;
        var tracker = {};
        var self = this;

        // Fire key event
        var event = qx.event.Registration.createEvent(type, qx.event.type.KeySequence, [domEvent, target, keyIdentifier]);
        qx.event.Utils.then(tracker, function () {
          return self.__manager__P_44_0.dispatchEvent(target, event);
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
        if (this.__window__P_44_1) {
          qx.event.Utils.then(tracker, function () {
            return qx.event.Registration.fireEvent(self.__window__P_44_1, "useraction", qx.event.type.Data, [type]);
          });
        }
        return tracker.promise;
      },
      /**
       * Get the target element for key events
       *
       * @return {Element} the event target element
       */
      __getEventTarget__P_44_8() {
        var focusHandler = this.__manager__P_44_0.getHandler(qx.event.handler.Focus);
        var target = focusHandler.getActive();

        // Fallback to focused element when active is null or invisible
        if (!target || target.offsetWidth == 0) {
          target = focusHandler.getFocus();
        }

        // Fallback to body when focused is null or invisible
        if (!target || target.offsetWidth == 0) {
          target = this.__manager__P_44_0.getWindow().document.body;
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
        this.__onKeyUpDownWrapper__P_44_4 = qx.lang.Function.listener(this.__onKeyUpDown__P_44_9, this);
        this.__onKeyPressWrapper__P_44_7 = qx.lang.Function.listener(this.__onKeyPress__P_44_10, this);
        var Event = qx.bom.Event;
        Event.addNativeListener(this.__root__P_44_2, "keyup", this.__onKeyUpDownWrapper__P_44_4);
        Event.addNativeListener(this.__root__P_44_2, "keydown", this.__onKeyUpDownWrapper__P_44_4);
        Event.addNativeListener(this.__root__P_44_2, "keypress", this.__onKeyPressWrapper__P_44_7);
      },
      /**
       * Stops the native key event listeners.
       *
       * @signature function()
       */
      _stopKeyObserver() {
        var Event = qx.bom.Event;
        Event.removeNativeListener(this.__root__P_44_2, "keyup", this.__onKeyUpDownWrapper__P_44_4);
        Event.removeNativeListener(this.__root__P_44_2, "keydown", this.__onKeyUpDownWrapper__P_44_4);
        Event.removeNativeListener(this.__root__P_44_2, "keypress", this.__onKeyPressWrapper__P_44_7);
        for (var key in this.__inputListeners__P_44_6 || {}) {
          var listener = this.__inputListeners__P_44_6[key];
          Event.removeNativeListener(listener.target, "keypress", listener.callback);
        }
        delete this.__inputListeners__P_44_6;
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
      __onKeyUpDown__P_44_9: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
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
          this.__lastUpDownType__P_44_3[keyCode] = type;
          return tracker.promise;
        },
        opera(domEvent) {
          this.__lastKeyCode__P_44_5 = domEvent.keyCode;
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
      __firefoxInputFix__P_44_11: qx.core.Environment.select("engine.name", {
        gecko(target, type, keyCode) {
          if (type === "keydown" && (keyCode == 33 || keyCode == 34 || keyCode == 38 || keyCode == 40) && target.type == "text" && target.tagName.toLowerCase() === "input" && target.getAttribute("autoComplete") !== "off") {
            if (!this.__inputListeners__P_44_6) {
              this.__inputListeners__P_44_6 = {};
            }
            var hash = qx.core.ObjectRegistry.toHashCode(target);
            if (this.__inputListeners__P_44_6[hash]) {
              return;
            }
            var self = this;
            this.__inputListeners__P_44_6[hash] = {
              target: target,
              callback(domEvent) {
                qx.bom.Event.stopPropagation(domEvent);
                self.__onKeyPress__P_44_10(domEvent);
              }
            };
            var listener = qx.event.GlobalError.observeMethod(this.__inputListeners__P_44_6[hash].callback);
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
      __onKeyPress__P_44_10: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
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
          if (keyCode != this.__lastKeyCode__P_44_5) {
            return this._idealKeyHandler(0, this.__lastKeyCode__P_44_5, type, domEvent);
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
      this.__lastKeyCode__P_44_5 = this.__manager__P_44_0 = this.__window__P_44_1 = this.__root__P_44_2 = this.__lastUpDownType__P_44_3 = null;
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
      "qx.event.IEventHandler": {
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
   * This class provides capture event support at DOM level.
   */
  qx.Class.define("qx.event.handler.Capture", {
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
        capture: true,
        losecapture: true
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
  qx.event.handler.Capture.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.Gesture": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.handler.Keyboard": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.handler.Capture": {
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
      "qx.event.Registration": {
        "construct": true,
        "defer": "runtime",
        "require": true
      },
      "qx.ui.core.Widget": {},
      "qx.event.Utils": {},
      "qx.Promise": {},
      "qx.event.type.Drag": {},
      "qx.ui.core.DragDropCursor": {},
      "qx.bom.element.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.promise": {
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
   * Event handler, which supports drag events on DOM elements.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * @require(qx.event.handler.Gesture)
   * @require(qx.event.handler.Keyboard)
   * @require(qx.event.handler.Capture)
   */
  qx.Class.define("qx.event.handler.DragDrop", {
    extend: qx.core.Object,
    implement: [qx.event.IEventHandler, qx.core.IDisposable],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param manager {qx.event.Manager} Event manager for the window to use
     */
    construct(manager) {
      qx.core.Object.constructor.call(this);

      // Define shorthands
      this.__manager__P_105_0 = manager;
      this.__root__P_105_1 = manager.getWindow().document.documentElement;

      // Initialize listener
      this.__manager__P_105_0.addListener(this.__root__P_105_1, "longtap", this._onLongtap, this);
      this.__manager__P_105_0.addListener(this.__root__P_105_1, "pointerdown", this._onPointerdown, this, true);
      qx.event.Registration.addListener(window, "blur", this._onWindowBlur, this);

      // Initialize data structures
      this.__rebuildStructures__P_105_2();
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
        dragstart: 1,
        dragend: 1,
        dragover: 1,
        dragleave: 1,
        drop: 1,
        drag: 1,
        dragchange: 1,
        droprequest: 1
      },
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true,
      /**
       * Array of strings holding the names of the allowed mouse buttons
       * for Drag & Drop. The default is "left" but could be extended with
       * "middle" or "right"
       */
      ALLOWED_BUTTONS: ["left"],
      /**
       * The distance needed to change the mouse position before a drag session start.
       */
      MIN_DRAG_DISTANCE: 5
    },
    properties: {
      /**
       * Widget instance of the drag & drop cursor. If non is given, the default
       * {@link qx.ui.core.DragDropCursor} will be used.
       */
      cursor: {
        check: "qx.ui.core.Widget",
        nullable: true,
        init: null
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __manager__P_105_0: null,
      __root__P_105_1: null,
      __dropTarget__P_105_3: null,
      __dragTarget__P_105_4: null,
      __types__P_105_5: null,
      __actions__P_105_6: null,
      __keys__P_105_7: null,
      __cache__P_105_8: null,
      __currentType__P_105_9: null,
      __currentAction__P_105_10: null,
      __sessionActive__P_105_11: false,
      __validDrop__P_105_12: false,
      __validAction__P_105_13: false,
      __dragTargetWidget__P_105_14: null,
      __startConfig__P_105_15: null,
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
        PUBLIC METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Registers a supported type
       *
       * @param type {String} The type to add
       */
      addType(type) {
        this.__types__P_105_5[type] = true;
      },
      /**
       * Registers a supported action. One of <code>move</code>,
       * <code>copy</code> or <code>alias</code>.
       *
       * @param action {String} The action to add
       */
      addAction(action) {
        this.__actions__P_105_6[action] = true;
      },
      /**
       * Whether the current drag target supports the given type
       *
       * @param type {String} Any type
       * @return {Boolean} Whether the type is supported
       */
      supportsType(type) {
        return !!this.__types__P_105_5[type];
      },
      /**
       * Whether the current drag target supports the given action
       *
       * @param type {String} Any type
       * @return {Boolean} Whether the action is supported
       */
      supportsAction(type) {
        return !!this.__actions__P_105_6[type];
      },
      /**
       * Whether the current drop target allows the current drag target.
       *
       * @param isAllowed {Boolean} False if a drop should be disallowed
       */
      setDropAllowed(isAllowed) {
        this.__validDrop__P_105_12 = isAllowed;
        this.__detectAction__P_105_16();
      },
      /**
       * Returns the data of the given type during the <code>drop</code> event
       * on the drop target. This method fires a <code>droprequest</code> at
       * the drag target which should be answered by calls to {@link #addData}.
       *
       * Note that this is a synchronous method and if any of the drag and drop
       * events handlers are implemented using Promises, this may fail; @see
       * `getDataAsync`.
       *
       * @param type {String} Any supported type
       * @return {var} The result data in a promise
       */
      getData(type) {
        if (!this.__validDrop__P_105_12 || !this.__dropTarget__P_105_3) {
          throw new Error("This method must not be used outside the drop event listener!");
        }
        if (!this.__types__P_105_5[type]) {
          throw new Error("Unsupported data type: " + type + "!");
        }
        if (!this.__cache__P_105_8[type]) {
          this.__currentType__P_105_9 = type;
          this.__fireEvent__P_105_17("droprequest", this.__dragTarget__P_105_4, this.__dropTarget__P_105_3, false, false);
        }
        if (!this.__cache__P_105_8[type]) {
          throw new Error("Please use a droprequest listener to the drag source to fill the manager with data!");
        }
        return this.__cache__P_105_8[type] || null;
      },
      /**
       * Returns the data of the given type during the <code>drop</code> event
       * on the drop target. This method fires a <code>droprequest</code> at
       * the drag target which should be answered by calls to {@link #addData}.
       *
       * @param type {String} Any supported type
       * @return {qx.Promise} The result data in a promise
       */
      getDataAsync(type) {
        if (!this.__validDrop__P_105_12 || !this.__dropTarget__P_105_3) {
          throw new Error("This method must not be used outside the drop event listener!");
        }
        if (!this.__types__P_105_5[type]) {
          throw new Error("Unsupported data type: " + type + "!");
        }
        var tracker = {};
        var self = this;
        if (!this.__cache__P_105_8[type]) {
          qx.event.Utils.then(tracker, function () {
            self.__currentType__P_105_9 = type;
            return self.__fireEvent__P_105_17("droprequest", self.__dragTarget__P_105_4, self.__dropTarget__P_105_3, false);
          });
        }
        return qx.event.Utils.then(tracker, function () {
          if (!this.__cache__P_105_8[type]) {
            throw new Error("Please use a droprequest listener to the drag source to fill the manager with data!");
          }
          return this.__cache__P_105_8[type] || null;
        });
      },
      /**
       * Returns the currently selected action (by user keyboard modifiers)
       *
       * @return {String} One of <code>move</code>, <code>copy</code> or
       *    <code>alias</code>
       */
      getCurrentAction() {
        this.__detectAction__P_105_16();
        return this.__currentAction__P_105_10;
      },
      /**
       * Returns the currently selected action (by user keyboard modifiers)
       *
       * @return {qx.Promise|String} One of <code>move</code>, <code>copy</code> or
       *    <code>alias</code>
       */
      getCurrentActionAsync: qx.core.Environment.select("qx.promise", {
        true() {
          var self = this;
          return qx.Promise.resolve(self.__detectAction__P_105_16()).then(function () {
            return self.__currentAction__P_105_10;
          });
        },
        false() {
          throw new Error(this.classname + ".getCurrentActionAsync not supported because qx.promise==false");
        }
      }),
      /**
       * Returns the widget which has been the target of the drag start.
       * @return {qx.ui.core.Widget} The widget on which the drag started.
       */
      getDragTarget() {
        return this.__dragTargetWidget__P_105_14;
      },
      /**
       * Adds data of the given type to the internal storage. The data
       * is available until the <code>dragend</code> event is fired.
       *
       * @param type {String} Any valid type
       * @param data {var} Any data to store
       */
      addData(type, data) {
        this.__cache__P_105_8[type] = data;
      },
      /**
       * Returns the type which was requested last.
       *
       * @return {String} The last requested data type
       */
      getCurrentType() {
        return this.__currentType__P_105_9;
      },
      /**
       * Returns if a drag session is currently active
       *
       * @return {Boolean} active drag session
       */
      isSessionActive() {
        return this.__sessionActive__P_105_11;
      },
      /*
      ---------------------------------------------------------------------------
        INTERNAL UTILS
      ---------------------------------------------------------------------------
      */

      /**
       * Rebuilds the internal data storage used during a drag&drop session
       */
      __rebuildStructures__P_105_2() {
        this.__types__P_105_5 = {};
        this.__actions__P_105_6 = {};
        this.__keys__P_105_7 = {};
        this.__cache__P_105_8 = {};
      },
      /**
       * Detects the current action and stores it under the private
       * field <code>__currentAction</code>. Also fires the event
       * <code>dragchange</code> on every modification.
       *
       * @return {qx.Promise|null}
       */
      __detectAction__P_105_16() {
        if (this.__dragTarget__P_105_4 == null) {
          {
            return qx.Promise.reject();
          }
        }
        var actions = this.__actions__P_105_6;
        var keys = this.__keys__P_105_7;
        var current = null;
        if (this.__validDrop__P_105_12) {
          if (keys.Shift && keys.Control && actions.alias) {
            current = "alias";
          } else if (keys.Shift && keys.Alt && actions.copy) {
            current = "copy";
          } else if (keys.Shift && actions.move) {
            current = "move";
          } else if (keys.Alt && actions.alias) {
            current = "alias";
          } else if (keys.Control && actions.copy) {
            current = "copy";
          } else if (actions.move) {
            current = "move";
          } else if (actions.copy) {
            current = "copy";
          } else if (actions.alias) {
            current = "alias";
          }
        }
        var self = this;
        var tracker = {};
        var old = this.__currentAction__P_105_10;
        if (current != old) {
          if (this.__dropTarget__P_105_3) {
            qx.event.Utils.catch(function () {
              self.__validAction__P_105_13 = false;
              current = null;
            });
            qx.event.Utils.then(tracker, function () {
              self.__currentAction__P_105_10 = current;
              return self.__fireEvent__P_105_17("dragchange", self.__dropTarget__P_105_3, self.__dragTarget__P_105_4, true);
            });
            qx.event.Utils.then(tracker, function (validAction) {
              self.__validAction__P_105_13 = validAction;
              if (!validAction) {
                current = null;
              }
            });
          }
        }
        return qx.event.Utils.then(tracker, function () {
          if (current != old) {
            self.__currentAction__P_105_10 = current;
            return self.__fireEvent__P_105_17("dragchange", self.__dragTarget__P_105_4, self.__dropTarget__P_105_3, false);
          }
        });
      },
      /**
       * Wrapper for {@link qx.event.Registration#fireEvent} for drag&drop events
       * needed in this class.
       *
       * @param type {String} Event type
       * @param target {Object} Target to fire on
       * @param relatedTarget {Object} Related target, i.e. drag or drop target
       *    depending on the drag event
       * @param cancelable {Boolean} Whether the event is cancelable
       * @param original {qx.event.type.Pointer} Original pointer event
       * @return {qx.Promise|Boolean} <code>true</code> if the event's default behavior was
       * not prevented
       */
      __fireEvent__P_105_17(type, target, relatedTarget, cancelable, original, async) {
        var Registration = qx.event.Registration;
        var dragEvent = Registration.createEvent(type, qx.event.type.Drag, [cancelable, original]);
        if (target !== relatedTarget) {
          dragEvent.setRelatedTarget(relatedTarget);
        }
        var result = Registration.dispatchEvent(target, dragEvent);
        {
          if (async === undefined || async) {
            return qx.Promise.resolve(result).then(function () {
              return !dragEvent.getDefaultPrevented();
            });
          } else {
            {
              if (qx.Promise.isPromise(result)) {
                this.error('DragDrop event "' + type + '" returned a promise but a synchronous event was required, drag and drop may not work as expected (consider using getDataAsync)');
              }
            }
            return result;
          }
        }
      },
      /**
       * Finds next draggable parent of the given element. Maybe the element itself as well.
       *
       * Looks for the attribute <code>qxDraggable</code> with the value <code>on</code>.
       *
       * @param elem {Element} The element to query
       * @return {Element} The next parent element which is draggable. May also be <code>null</code>
       */
      __findDraggable__P_105_18(elem) {
        while (elem && elem.nodeType == 1) {
          if (elem.getAttribute("qxDraggable") == "on") {
            return elem;
          }
          elem = elem.parentNode;
        }
        return null;
      },
      /**
       * Finds next droppable parent of the given element. Maybe the element itself as well.
       *
       * Looks for the attribute <code>qxDroppable</code> with the value <code>on</code>.
       *
       * @param elem {Element} The element to query
       * @return {Element} The next parent element which is droppable. May also be <code>null</code>
       */
      __findDroppable__P_105_19(elem) {
        while (elem && elem.nodeType == 1) {
          if (elem.getAttribute("qxDroppable") == "on") {
            return elem;
          }
          elem = elem.parentNode;
        }
        return null;
      },
      /**
       * Cleans up a drag&drop session when <code>dragstart</code> was fired before.
       *
       * @return {qx.Promise?} promise, if one was created by event handlers
       */
      clearSession() {
        //this.debug("clearSession");

        // Deregister from root events
        this.__manager__P_105_0.removeListener(this.__root__P_105_1, "pointermove", this._onPointermove, this);
        this.__manager__P_105_0.removeListener(this.__root__P_105_1, "pointerup", this._onPointerup, this, true);
        this.__manager__P_105_0.removeListener(this.__root__P_105_1, "keydown", this._onKeyDown, this, true);
        this.__manager__P_105_0.removeListener(this.__root__P_105_1, "keyup", this._onKeyUp, this, true);
        this.__manager__P_105_0.removeListener(this.__root__P_105_1, "keypress", this._onKeyPress, this, true);
        this.__manager__P_105_0.removeListener(this.__root__P_105_1, "roll", this._onRoll, this, true);
        var tracker = {};
        var self = this;

        // Fire dragend event
        if (this.__dragTarget__P_105_4) {
          qx.event.Utils.then(tracker, function () {
            return self.__fireEvent__P_105_17("dragend", self.__dragTarget__P_105_4, self.__dropTarget__P_105_3, false);
          });
        }
        return qx.event.Utils.then(tracker, function () {
          // Cleanup
          self.__validDrop__P_105_12 = false;
          self.__dropTarget__P_105_3 = null;
          if (self.__dragTargetWidget__P_105_14) {
            self.__dragTargetWidget__P_105_14.removeState("drag");
            self.__dragTargetWidget__P_105_14 = null;
          }

          // Clear init
          //self.debug("Clearing drag target");
          self.__dragTarget__P_105_4 = null;
          self.__sessionActive__P_105_11 = false;
          self.__startConfig__P_105_15 = null;
          self.__rebuildStructures__P_105_2();
        });
      },
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLERS
      ---------------------------------------------------------------------------
      */

      /**
       * Handler for long tap which takes care of starting the drag & drop session for
       * touch interactions.
       * @param e {qx.event.type.Tap} The longtap event.
       */
      _onLongtap(e) {
        // only for touch
        if (e.getPointerType() != "touch") {
          return;
        }
        // prevent scrolling
        this.__manager__P_105_0.addListener(this.__root__P_105_1, "roll", this._onRoll, this, true);
        return this._start(e);
      },
      /**
       * Helper to start the drag & drop session. It is responsible for firing the
       * dragstart event and attaching the key listener.
       * @param e {qx.event.type.Pointer} Either a longtap or pointermove event.
       *
       * @return {Boolean} Returns <code>false</code> if drag session should be
       * canceled.
       */
      _start(e) {
        // only for primary pointer and allowed buttons
        var isButtonOk = qx.event.handler.DragDrop.ALLOWED_BUTTONS.indexOf(e.getButton()) !== -1;
        if (!e.isPrimary() || !isButtonOk) {
          return false;
        }

        // start target can be none as the drag & drop handler might
        // be created after the first start event
        var target = this.__startConfig__P_105_15 ? this.__startConfig__P_105_15.target : e.getTarget();
        var draggable = this.__findDraggable__P_105_18(target);
        if (draggable) {
          // This is the source target
          //this.debug("Setting dragtarget = " + draggable);
          this.__dragTarget__P_105_4 = draggable;
          var widgetOriginalTarget = qx.ui.core.Widget.getWidgetByElement(this.__startConfig__P_105_15.original);
          while (widgetOriginalTarget && widgetOriginalTarget.isAnonymous()) {
            widgetOriginalTarget = widgetOriginalTarget.getLayoutParent();
          }
          if (widgetOriginalTarget) {
            this.__dragTargetWidget__P_105_14 = widgetOriginalTarget;
            widgetOriginalTarget.addState("drag");
          }

          // fire cancelable dragstart
          var self = this;
          var tracker = {};
          qx.event.Utils.catch(function () {
            //self.debug("dragstart FAILED, setting __sessionActive=false");
            self.__sessionActive__P_105_11 = false;
          });
          qx.event.Utils.then(tracker, function () {
            return self.__fireEvent__P_105_17("dragstart", self.__dragTarget__P_105_4, self.__dropTarget__P_105_3, true, e);
          });
          return qx.event.Utils.then(tracker, function (validAction) {
            if (!validAction) {
              return;
            }
            //self.debug("dragstart ok, setting __sessionActive=true")
            self.__manager__P_105_0.addListener(self.__root__P_105_1, "keydown", self._onKeyDown, self, true);
            self.__manager__P_105_0.addListener(self.__root__P_105_1, "keyup", self._onKeyUp, self, true);
            self.__manager__P_105_0.addListener(self.__root__P_105_1, "keypress", self._onKeyPress, self, true);
            self.__sessionActive__P_105_11 = true;
          });
        }
      },
      /**
       * Event handler for the pointerdown event which stores the initial targets and the coordinates.
       * @param e {qx.event.type.Pointer} The pointerdown event.
       */
      _onPointerdown(e) {
        if (e.isPrimary()) {
          this.__startConfig__P_105_15 = {
            target: e.getTarget(),
            original: e.getOriginalTarget(),
            left: e.getDocumentLeft(),
            top: e.getDocumentTop()
          };
          this.__manager__P_105_0.addListener(this.__root__P_105_1, "pointermove", this._onPointermove, this);
          this.__manager__P_105_0.addListener(this.__root__P_105_1, "pointerup", this._onPointerup, this, true);
        }
      },
      /**
       * Event handler for the pointermove event which starts the drag session and
       * is responsible for firing the drag, dragover and dragleave event.
       * @param e {qx.event.type.Pointer} The pointermove event.
       */
      _onPointermove(e) {
        // only allow drag & drop for primary pointer
        if (!e.isPrimary()) {
          return;
        }

        //this.debug("_onPointermove: start");

        var self = this;
        var tracker = {};
        qx.event.Utils.catch(function () {
          return self.clearSession();
        });

        // start the drag session for mouse
        if (!self.__sessionActive__P_105_11 && e.getPointerType() == "mouse") {
          var delta = self._getDelta(e);
          // if the mouse moved a bit in any direction
          var distance = qx.event.handler.DragDrop.MIN_DRAG_DISTANCE;
          if (delta && (Math.abs(delta.x) > distance || Math.abs(delta.y) > distance)) {
            //self.debug("_onPointermove: outside min drag distance");
            qx.event.Utils.then(tracker, function () {
              return self._start(e);
            });
          }
        }
        return qx.event.Utils.then(tracker, function () {
          // check if the session has been activated
          if (!self.__sessionActive__P_105_11) {
            //self.debug("not active");
            return;
          }
          var tracker = {};
          qx.event.Utils.then(tracker, function () {
            //self.debug("active, firing drag");
            return self.__fireEvent__P_105_17("drag", self.__dragTarget__P_105_4, self.__dropTarget__P_105_3, true, e);
          });
          qx.event.Utils.then(tracker, function (validAction) {
            if (!validAction) {
              this.clearSession();
            }

            //self.debug("drag");
            // find current hovered droppable
            var el = e.getTarget();
            if (self.__startConfig__P_105_15.target === el) {
              // on touch devices the native events return wrong elements as target (its always the element where the dragging started)
              el = e.getNativeEvent().view.document.elementFromPoint(e.getDocumentLeft(), e.getDocumentTop());
            }
            var cursor = self.getCursor();
            if (!cursor) {
              cursor = qx.ui.core.DragDropCursor.getInstance();
            }
            var cursorEl = cursor.getContentElement().getDomElement();
            if (cursorEl && (el === cursorEl || cursorEl.contains(el))) {
              var display = qx.bom.element.Style.get(cursorEl, "display");
              // get the cursor out of the way
              qx.bom.element.Style.set(cursorEl, "display", "none");
              el = e.getNativeEvent().view.document.elementFromPoint(e.getDocumentLeft(), e.getDocumentTop());
              qx.bom.element.Style.set(cursorEl, "display", display);
            }
            if (el !== cursorEl) {
              var droppable = self.__findDroppable__P_105_19(el);

              // new drop target detected
              if (droppable && droppable != self.__dropTarget__P_105_3) {
                var dropLeaveTarget = self.__dropTarget__P_105_3;
                self.__validDrop__P_105_12 = true; // initial value should be true
                self.__dropTarget__P_105_3 = droppable;
                var innerTracker = {};
                qx.event.Utils.catch(innerTracker, function () {
                  self.__dropTarget__P_105_3 = null;
                  self.__validDrop__P_105_12 = false;
                });

                // fire dragleave for previous drop target
                if (dropLeaveTarget) {
                  qx.event.Utils.then(innerTracker, function () {
                    return self.__fireEvent__P_105_17("dragleave", dropLeaveTarget, self.__dragTarget__P_105_4, false, e);
                  });
                }
                qx.event.Utils.then(innerTracker, function () {
                  return self.__fireEvent__P_105_17("dragover", droppable, self.__dragTarget__P_105_4, true, e);
                });
                return qx.event.Utils.then(innerTracker, function (validDrop) {
                  self.__validDrop__P_105_12 = validDrop;
                });
              }

              // only previous drop target
              else if (!droppable && self.__dropTarget__P_105_3) {
                var innerTracker = {};
                qx.event.Utils.then(innerTracker, function () {
                  return self.__fireEvent__P_105_17("dragleave", self.__dropTarget__P_105_3, self.__dragTarget__P_105_4, false, e);
                });
                return qx.event.Utils.then(innerTracker, function () {
                  self.__dropTarget__P_105_3 = null;
                  self.__validDrop__P_105_12 = false;
                  return self.__detectAction__P_105_16();
                });
              }
            }
          });
          return qx.event.Utils.then(tracker, function () {
            // Reevaluate current action
            var keys = self.__keys__P_105_7;
            keys.Control = e.isCtrlPressed();
            keys.Shift = e.isShiftPressed();
            keys.Alt = e.isAltPressed();
            return self.__detectAction__P_105_16();
          });
        });
      },
      /**
       * Helper function to compute the delta between current cursor position from given event
       * and the stored coordinates at {@link #_onPointerdown}.
       *
       * @param e {qx.event.type.Pointer} The pointer event
       *
       * @return {Map} containing the deltaX as x, and deltaY as y.
       */
      _getDelta(e) {
        if (!this.__startConfig__P_105_15) {
          return null;
        }
        var deltaX = e.getDocumentLeft() - this.__startConfig__P_105_15.left;
        var deltaY = e.getDocumentTop() - this.__startConfig__P_105_15.top;
        return {
          x: deltaX,
          y: deltaY
        };
      },
      /**
       * Handler for the pointerup event which is responsible fore firing the drop event.
       * @param e {qx.event.type.Pointer} The pointerup event
       */
      _onPointerup(e) {
        if (!e.isPrimary()) {
          return;
        }
        var tracker = {};
        var self = this;

        // Fire drop event in success case
        if (this.__validDrop__P_105_12 && this.__validAction__P_105_13) {
          qx.event.Utils.then(tracker, function () {
            return self.__fireEvent__P_105_17("drop", self.__dropTarget__P_105_3, self.__dragTarget__P_105_4, false, e);
          });
        }
        return qx.event.Utils.then(tracker, function () {
          // Stop event
          if (e.getTarget() == self.__dragTarget__P_105_4) {
            e.stopPropagation();
          }

          // Clean up
          return self.clearSession();
        });
      },
      /**
       * Roll listener to stop scrolling on touch devices.
       * @param e {qx.event.type.Roll} The roll event.
       */
      _onRoll(e) {
        e.stop();
      },
      /**
       * Event listener for window's <code>blur</code> event
       *
       * @param e {qx.event.type.Event} Event object
       */
      _onWindowBlur(e) {
        return this.clearSession();
      },
      /**
       * Event listener for root's <code>keydown</code> event
       *
       * @param e {qx.event.type.KeySequence} Event object
       */
      _onKeyDown(e) {
        var iden = e.getKeyIdentifier();
        switch (iden) {
          case "Alt":
          case "Control":
          case "Shift":
            if (!this.__keys__P_105_7[iden]) {
              this.__keys__P_105_7[iden] = true;
              return this.__detectAction__P_105_16();
            }
        }
      },
      /**
       * Event listener for root's <code>keyup</code> event
       *
       * @param e {qx.event.type.KeySequence} Event object
       */
      _onKeyUp(e) {
        var iden = e.getKeyIdentifier();
        switch (iden) {
          case "Alt":
          case "Control":
          case "Shift":
            if (this.__keys__P_105_7[iden]) {
              this.__keys__P_105_7[iden] = false;
              return this.__detectAction__P_105_16();
            }
        }
      },
      /**
       * Event listener for root's <code>keypress</code> event
       *
       * @param e {qx.event.type.KeySequence} Event object
       */
      _onKeyPress(e) {
        var iden = e.getKeyIdentifier();
        switch (iden) {
          case "Escape":
            return this.clearSession();
        }
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      qx.event.Registration.removeListener(window, "blur", this._onWindowBlur, this);

      // Clear fields
      this.__dragTarget__P_105_4 = this.__dropTarget__P_105_3 = this.__manager__P_105_0 = this.__root__P_105_1 = this.__types__P_105_5 = this.__actions__P_105_6 = this.__keys__P_105_7 = this.__cache__P_105_8 = null;
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
  qx.event.handler.DragDrop.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {},
      "qx.core.Property": {}
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
   * A helper class for accessing the property system directly.
   *
   * This class is rather to be used internally. For all regular usage of the
   * property system the default API should be sufficient.
   */
  qx.Class.define("qx.util.PropertyUtil", {
    statics: {
      /**
       * Get the property map of the given class
       *
       * @param clazz {Class} a qooxdoo class
       * @return {Map} A properties map as defined in {@link qx.Class#define}
       *   including the properties of included mixins and not including refined
       *   properties.
       */
      getProperties(clazz) {
        return clazz.$$properties;
      },
      /**
       * Get the property map of the given class including the properties of all
       * superclasses!
       *
       * @param clazz {Class} a qooxdoo class
       * @return {Map} The properties map as defined in {@link qx.Class#define}
       *   including the properties of included mixins of the current class and
       *   all superclasses.
       */
      getAllProperties(clazz) {
        var properties = {};
        var superclass = clazz;
        // go threw the class hierarchy
        while (superclass != qx.core.Object) {
          var currentProperties = this.getProperties(superclass);
          for (var property in currentProperties) {
            properties[property] = currentProperties[property];
          }
          superclass = superclass.superclass;
        }
        return properties;
      },
      /*
      -------------------------------------------------------------------------
        USER VALUES
      -------------------------------------------------------------------------
      */

      /**
       * Returns the user value of the given property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       * @return {var} The user value
       */
      getUserValue(object, propertyName) {
        return object["$$user_" + propertyName];
      },
      /**
       * Sets the user value of the given property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       * @param value {var} The value to set
       */
      setUserValue(object, propertyName, value) {
        object["$$user_" + propertyName] = value;
      },
      /**
       * Deletes the user value of the given property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       */
      deleteUserValue(object, propertyName) {
        delete object["$$user_" + propertyName];
      },
      /*
      -------------------------------------------------------------------------
        INIT VALUES
      -------------------------------------------------------------------------
      */

      /**
       * Returns the init value of the given property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       * @return {var} The init value
       */
      getInitValue(object, propertyName) {
        return object["$$init_" + propertyName];
      },
      /**
       * Sets the init value of the given property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       * @param value {var} The value to set
       */
      setInitValue(object, propertyName, value) {
        object["$$init_" + propertyName] = value;
      },
      /**
       * Deletes the init value of the given property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       */
      deleteInitValue(object, propertyName) {
        delete object["$$init_" + propertyName];
      },
      /*
      -------------------------------------------------------------------------
        THEME VALUES
      -------------------------------------------------------------------------
      */

      /**
       * Returns the theme value of the given property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       * @return {var} The theme value
       */
      getThemeValue(object, propertyName) {
        return object["$$theme_" + propertyName];
      },
      /**
       * Sets the theme value of the given property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       * @param value {var} The value to set
       */
      setThemeValue(object, propertyName, value) {
        object["$$theme_" + propertyName] = value;
      },
      /**
       * Deletes the theme value of the given property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       */
      deleteThemeValue(object, propertyName) {
        delete object["$$theme_" + propertyName];
      },
      /*
      -------------------------------------------------------------------------
        THEMED PROPERTY
      -------------------------------------------------------------------------
      */

      /**
       * Sets a themed property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       * @param value {var} The value to set
       */
      setThemed(object, propertyName, value) {
        var styler = qx.core.Property.$$method.setThemed;
        object[styler[propertyName]](value);
      },
      /**
       * Resets a themed property
       *
       * @param object {Object} The object to access
       * @param propertyName {String} The name of the property
       */
      resetThemed(object, propertyName) {
        var unstyler = qx.core.Property.$$method.resetThemed;
        object[unstyler[propertyName]]();
      }
    }
  });
  qx.util.PropertyUtil.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.queue.Manager": {},
      "qx.ui.core.queue.Visibility": {}
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
   * The layout queue manages all widgets, which need a recalculation of their
   * layout. The {@link #flush} method computes the layout of all queued widgets
   * and their dependent widgets.
   */
  qx.Class.define("qx.ui.core.queue.Layout", {
    statics: {
      /** @type {Map} This contains all the queued widgets for the next flush. */
      __queue__P_101_0: {},
      /** Nesting level cache **/
      __nesting__P_101_1: {},
      /**
       * Clears the widget from the internal queue. Normally only used
       * during interims disposes of one or a few widgets.
       *
       * @param widget {qx.ui.core.Widget} The widget to clear
       */
      remove(widget) {
        delete this.__queue__P_101_0[widget.toHashCode()];
      },
      /**
       * Mark a widget's layout as invalid and add its layout root to
       * the queue.
       *
       * Should only be used by {@link qx.ui.core.Widget}.
       *
       * @param widget {qx.ui.core.Widget} Widget to add.
       */
      add(widget) {
        this.__queue__P_101_0[widget.toHashCode()] = widget;
        qx.ui.core.queue.Manager.scheduleFlush("layout");
      },
      /**
       * Check whether the queue has scheduled changes for a widget.
       * Note that the layout parent can have changes scheduled that
       * affect the children widgets.
       *
       * @param widget {qx.ui.core.Widget} Widget to check.
       * @return {Boolean} Whether the widget given has layout changes queued.
       */
      isScheduled(widget) {
        return !!this.__queue__P_101_0[widget.toHashCode()];
      },
      /**
       * Update the layout of all widgets, which layout is marked as invalid.
       *
       * This is used exclusively by the {@link qx.ui.core.queue.Manager}.
       *
       */
      flush() {
        // get sorted widgets to (re-)layout
        var queue = this.__getSortedQueue__P_101_2();

        // iterate in reversed order to process widgets with the smallest nesting
        // level first because these may affect the inner lying children
        for (var i = queue.length - 1; i >= 0; i--) {
          var widget = queue[i];

          // continue if a relayout of one of the root's parents has made the
          // layout valid
          if (widget.hasValidLayout()) {
            continue;
          }

          // overflow areas or qx.ui.root.*
          if (widget.isRootWidget() && !widget.hasUserBounds()) {
            // This is a real root widget. Set its size to its preferred size.
            var hint = widget.getSizeHint();
            widget.renderLayout(0, 0, hint.width, hint.height);
          } else {
            // This is an inner item of layout changes. Do a relayout of its
            // children without changing its position and size.
            var bounds = widget.getBounds();
            if (bounds) {
              widget.renderLayout(bounds.left, bounds.top, bounds.width, bounds.height);
            }
          }
        }
      },
      /**
       * Get the widget's nesting level. Top level widgets have a nesting level
       * of <code>0</code>.
       *
       * @param widget {qx.ui.core.Widget} The widget to query.
       * @return {Integer} The nesting level
       */
      getNestingLevel(widget) {
        var cache = this.__nesting__P_101_1;
        var level = 0;
        var parent = widget;

        // Detecting level
        while (true) {
          if (cache[parent.toHashCode()] != null) {
            level += cache[parent.toHashCode()];
            break;
          }
          if (!parent.$$parent) {
            break;
          }
          parent = parent.$$parent;
          level += 1;
        }

        // Update the processed hierarchy (runs from inner to outer)
        var leveldown = level;
        while (widget && widget !== parent) {
          cache[widget.toHashCode()] = leveldown--;
          widget = widget.$$parent;
        }
        return level;
      },
      /**
       * Group widget by their nesting level.
       *
       * @return {Map[]} A sparse array. Each entry of the array contains a widget
       *     map with all widgets of the same level as the array index.
       */
      __getLevelGroupedWidgets__P_101_3() {
        var VisibilityQueue = qx.ui.core.queue.Visibility;

        // clear cache
        this.__nesting__P_101_1 = {};

        // sparse level array
        var levels = [];
        var queue = this.__queue__P_101_0;
        var widget, level;
        for (var hash in queue) {
          widget = queue[hash];
          if (VisibilityQueue.isVisible(widget)) {
            level = this.getNestingLevel(widget);

            // create hierarchy
            if (!levels[level]) {
              levels[level] = {};
            }

            // store widget in level map
            levels[level][hash] = widget;

            // remove widget from layout queue
            delete queue[hash];
          }
        }
        return levels;
      },
      /**
       * Compute all layout roots of the given widgets. Layout roots are either
       * root widgets or widgets, which preferred size has not changed by the
       * layout changes of its children.
       *
       * This function returns the roots ordered by their nesting factors. The
       * layout with the largest nesting level comes first.
       *
       * @return {qx.ui.core.Widget[]} Ordered list or layout roots.
       */
      __getSortedQueue__P_101_2() {
        var sortedQueue = [];
        var levels = this.__getLevelGroupedWidgets__P_101_3();
        for (var level = levels.length - 1; level >= 0; level--) {
          // Ignore empty levels (levels is an sparse array)
          if (!levels[level]) {
            continue;
          }
          for (var hash in levels[level]) {
            var widget = levels[level][hash];

            // This is a real layout root. Add it directly to the list
            if (level == 0 || widget.isRootWidget() || widget.hasUserBounds()) {
              sortedQueue.push(widget);
              widget.invalidateLayoutCache();
              continue;
            }

            // compare old size hint to new size hint
            var oldSizeHint = widget.getSizeHint(false);
            if (oldSizeHint) {
              widget.invalidateLayoutCache();
              var newSizeHint = widget.getSizeHint();
              var hintChanged = !widget.getBounds() || oldSizeHint.minWidth !== newSizeHint.minWidth || oldSizeHint.width !== newSizeHint.width || oldSizeHint.maxWidth !== newSizeHint.maxWidth || oldSizeHint.minHeight !== newSizeHint.minHeight || oldSizeHint.height !== newSizeHint.height || oldSizeHint.maxHeight !== newSizeHint.maxHeight;
            } else {
              hintChanged = true;
            }
            if (hintChanged) {
              // Since the level is > 0, the widget must
              // have a parent != null.
              var parent = widget.getLayoutParent();
              if (!levels[level - 1]) {
                levels[level - 1] = {};
              }
              levels[level - 1][parent.toHashCode()] = parent;
            } else {
              // this is an internal layout root since its own preferred size
              // has not changed.
              sortedQueue.push(widget);
            }
          }
        }
        return sortedQueue;
      }
    }
  });
  qx.ui.core.queue.Layout.$$dbClassInfo = $$dbClassInfo;
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
      "qx.theme.manager.Color": {},
      "qx.theme.manager.Decoration": {},
      "qx.theme.manager.Font": {},
      "qx.theme.manager.Icon": {},
      "qx.theme.manager.Appearance": {},
      "qx.core.Environment": {},
      "qx.Theme": {}
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
   * Manager for meta themes
   */
  qx.Class.define("qx.theme.manager.Meta", {
    type: "singleton",
    extend: qx.core.Object,
    events: {
      /** Fires if any theme manager has been changed. */
      changeTheme: "qx.event.type.Event"
    },
    properties: {
      /**
       * Meta theme. Applies the defined color, decoration, ... themes to
       * the corresponding managers.
       */
      theme: {
        check: "Theme",
        nullable: false,
        apply: "_applyTheme"
      }
    },
    members: {
      // property apply
      _applyTheme(value, old) {
        // collect changes
        var colorChanged = true;
        var decorationChanged = true;
        var fontChanged = true;
        var iconChanged = true;
        var appearanceChanged = true;
        if (old) {
          colorChanged = value.meta.color !== old.meta.color;
          decorationChanged = value.meta.decoration !== old.meta.decoration;
          fontChanged = value.meta.font !== old.meta.font;
          iconChanged = value.meta.icon !== old.meta.icon;
          appearanceChanged = value.meta.appearance !== old.meta.appearance;
        }
        var colorMgr = qx.theme.manager.Color.getInstance();
        var decorationMgr = qx.theme.manager.Decoration.getInstance();
        var fontMgr = qx.theme.manager.Font.getInstance();
        var iconMgr = qx.theme.manager.Icon.getInstance();
        var appearanceMgr = qx.theme.manager.Appearance.getInstance();

        // suspend listeners
        this._suspendEvents();

        // apply meta changes
        if (colorChanged) {
          // color theme changed, but decorator not? force decorator
          if (!decorationChanged) {
            var dec = decorationMgr.getTheme();
            decorationMgr._applyTheme(dec);
          }
          colorMgr.setTheme(value.meta.color);
        }
        decorationMgr.setTheme(value.meta.decoration);
        fontMgr.setTheme(value.meta.font);
        iconMgr.setTheme(value.meta.icon);
        appearanceMgr.setTheme(value.meta.appearance);

        // fire change event only if at least one theme manager changed
        if (colorChanged || decorationChanged || fontChanged || iconChanged || appearanceChanged) {
          this.fireEvent("changeTheme");
        }

        // re add listener
        this._activateEvents();
      },
      __timer__P_103_0: null,
      /**
       * Fires <code>changeTheme</code> event.
       *
       * @param e {qx.event.type.Data} Data event.
       */
      _fireEvent(e) {
        if (e.getTarget() === qx.theme.manager.Color.getInstance()) {
          // force clearing all previously created CSS rules, to be able to
          // re-create decorator rules with changed color theme
          qx.theme.manager.Decoration.getInstance().refresh();
        }
        this.fireEvent("changeTheme");
      },
      /**
       * Removes listeners for <code>changeTheme</code> event of all
       * related theme managers.
       */
      _suspendEvents() {
        var colorMgr = qx.theme.manager.Color.getInstance();
        var decorationMgr = qx.theme.manager.Decoration.getInstance();
        var fontMgr = qx.theme.manager.Font.getInstance();
        var iconMgr = qx.theme.manager.Icon.getInstance();
        var appearanceMgr = qx.theme.manager.Appearance.getInstance();

        // suspend listeners
        if (colorMgr.hasListener("changeTheme")) {
          colorMgr.removeListener("changeTheme", this._fireEvent, this);
        }
        if (decorationMgr.hasListener("changeTheme")) {
          decorationMgr.removeListener("changeTheme", this._fireEvent, this);
        }
        if (fontMgr.hasListener("changeTheme")) {
          fontMgr.removeListener("changeTheme", this._fireEvent, this);
        }
        if (iconMgr.hasListener("changeTheme")) {
          iconMgr.removeListener("changeTheme", this._fireEvent, this);
        }
        if (appearanceMgr.hasListener("changeTheme")) {
          appearanceMgr.removeListener("changeTheme", this._fireEvent, this);
        }
      },
      /**
       * Activates listeners for <code>changeTheme</code> event of all related
       * theme managers, to forwards the event to this meta manager instance.
       */
      _activateEvents() {
        var colorMgr = qx.theme.manager.Color.getInstance();
        var decorationMgr = qx.theme.manager.Decoration.getInstance();
        var fontMgr = qx.theme.manager.Font.getInstance();
        var iconMgr = qx.theme.manager.Icon.getInstance();
        var appearanceMgr = qx.theme.manager.Appearance.getInstance();

        // add listeners to check changes
        if (!colorMgr.hasListener("changeTheme")) {
          colorMgr.addListener("changeTheme", this._fireEvent, this);
        }
        if (!decorationMgr.hasListener("changeTheme")) {
          decorationMgr.addListener("changeTheme", this._fireEvent, this);
        }
        if (!fontMgr.hasListener("changeTheme")) {
          fontMgr.addListener("changeTheme", this._fireEvent, this);
        }
        if (!iconMgr.hasListener("changeTheme")) {
          iconMgr.addListener("changeTheme", this._fireEvent, this);
        }
        if (!appearanceMgr.hasListener("changeTheme")) {
          appearanceMgr.addListener("changeTheme", this._fireEvent, this);
        }
      },
      /**
       * Initialize the themes which were selected using the settings. Should only
       * be called from qooxdoo based application.
       */
      initialize() {
        var env = qx.core.Environment;
        var theme, obj;
        theme = env.get("qx.theme");
        if (theme) {
          obj = qx.Theme.getByName(theme);
          if (!obj) {
            throw new Error("The theme to use is not available: " + theme);
          }
          this.setTheme(obj);
        }
      }
    },
    /*
    *****************************************************************************
       ENVIRONMENT SETTINGS
    *****************************************************************************
    */

    environment: {
      "qx.theme": "qx.theme.Modern"
    }
  });
  qx.theme.manager.Meta.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.log.Logger": {}
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
   * This mixin exposes all methods to manage the layout manager of a widget.
   * It can only be included into instances of {@link qx.ui.core.Widget}.
   *
   * To optimize the method calls the including widget should call the method
   * {@link #remap} in its defer function. This will map the protected
   * methods to the public ones and save one method call for each function.
   */
  qx.Mixin.define("qx.ui.core.MLayoutHandling", {
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
        this._setLayout(layout);
      },
      /**
       * Get the widget's layout manager.
       *
       * @return {qx.ui.layout.Abstract} The widget's layout manager
       */
      getLayout() {
        return this._getLayout();
      }
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Mapping of protected methods to public.
       * This omits an additional function call when using these methods. Call
       * this methods in the defer block of the including class.
       *
       * @param members {Map} The including classes members map
       * @deprecated {7.0} this is not necessary in modern compilers and leads to unexpected behaviour
       */
      remap(members) {
        {
          qx.log.Logger.debug("Calling qx.ui.core.MLayoutHandling.remap is deprecated, please dont use it");
        }
        members.getLayout = members._getLayout;
        members.setLayout = members._setLayout;
      }
    }
  });
  qx.ui.core.MLayoutHandling.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.MLayoutHandling": {
        "require": true
      },
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
   * The Composite is a generic container widget.
   *
   * It exposes all methods to set layouts and to manage child widgets
   * as public methods. You must configure this widget with a layout manager to
   * define the way the widget's children are positioned.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   // create the composite
   *   var composite = new qx.ui.container.Composite()
   *
   *   // configure it with a horizontal box layout with a spacing of '5'
   *   composite.setLayout(new qx.ui.layout.HBox(5));
   *
   *   // add some children
   *   composite.add(new qx.ui.basic.Label("Name: "));
   *   composite.add(new qx.ui.form.TextField());
   *
   *   this.getRoot().add(composite);
   * </pre>
   *
   * This example horizontally groups a label and text field by using a
   * Composite configured with a horizontal box layout as a container.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/composite.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.container.Composite", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MChildrenHandling, qx.ui.core.MLayoutHandling],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param layout {qx.ui.layout.Abstract} A layout instance to use to
     *   place widgets on the screen.
     */
    construct(layout) {
      qx.ui.core.Widget.constructor.call(this);
      if (layout != null) {
        this._setLayout(layout);
      }
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * This event is fired after a child widget was added to this widget. The
       * {@link qx.event.type.Data#getData} method of the event returns the
       * added child.
       */
      addChildWidget: "qx.event.type.Data",
      /**
       * This event is fired after a child widget has been removed from this widget.
       * The {@link qx.event.type.Data#getData} method of the event returns the
       * removed child.
       */
      removeChildWidget: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // overridden
      _afterAddChild(child) {
        this.fireNonBubblingEvent("addChildWidget", qx.event.type.Data, [child]);
      },
      // overridden
      _afterRemoveChild(child) {
        this.fireNonBubblingEvent("removeChildWidget", qx.event.type.Data, [child]);
      }
    }
  });
  qx.ui.container.Composite.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Function": {},
      "qx.event.Idle": {},
      "qx.bom.element.Location": {},
      "qx.util.placement.Placement": {}
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
       * Martin Wittemann (martinwittemann)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Methods to place popup like widgets to other widgets, points,
   * pointer event coordinates, etc.
   */
  qx.Mixin.define("qx.ui.core.MPlacement", {
    statics: {
      __visible__P_143_0: null,
      __direction__P_143_1: "left",
      /**
       * Set the always visible element. If an element is set, the
       * {@link #moveTo} method takes care of every move and tries not to cover
       * the given element with a movable widget like a popup or context menu.
       *
       * @param elem {qx.ui.core.Widget} The widget which should always be visible.
       */
      setVisibleElement(elem) {
        this.__visible__P_143_0 = elem;
      },
      /**
       * Returns the given always visible element. See {@link #setVisibleElement}
       * for more details.
       *
       * @return {qx.ui.core.Widget|null} The given widget.
       */
      getVisibleElement() {
        return this.__visible__P_143_0;
      },
      /**
       * Set the move direction for an element which hides always visible element.
       * The value has only an effect when the {@link #setVisibleElement} is set.
       *
       * @param direction {String} The direction <code>left</code> or <code>top</code>.
       */
      setMoveDirection(direction) {
        if (direction === "top" || direction === "left") {
          this.__direction__P_143_1 = direction;
        } else {
          throw new Error("Invalid value for the parameter 'direction' [qx.ui.core.MPlacement.setMoveDirection()], the value was '" + direction + "' " + "but 'top' or 'left' are allowed.");
        }
      },
      /**
       * Returns the move direction for an element which hides always visible element.
       * See {@link #setMoveDirection} for more details.
       *
       * @return {String} The move direction.
       */
      getMoveDirection() {
        return this.__direction__P_143_1;
      }
    },
    properties: {
      /**
       * Position of the aligned object in relation to the opener.
       *
       * Please note than changes to this property are only applied
       * when re-aligning the widget.
       *
       * The first part of the value is the edge to attach to. The second
       * part the alignment of the orthogonal edge after the widget
       * has been attached.
       *
       * The default value "bottom-left" for example means that the
       * widget should be shown directly under the given target and
       * then should be aligned to be left edge:
       *
       * <pre>
       * +--------+
       * | target |
       * +--------+
       * +-------------+
       * |   widget    |
       * +-------------+
       * </pre>
       */
      position: {
        check: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right", "left-top", "left-middle", "left-bottom", "right-top", "right-middle", "right-bottom"],
        init: "bottom-left",
        themeable: true
      },
      /**
       * Whether the widget should be placed relative to an other widget or to
       * the pointer.
       */
      placeMethod: {
        check: ["widget", "pointer"],
        init: "pointer",
        themeable: true
      },
      /** Whether the widget should moved using DOM methods. */
      domMove: {
        check: "Boolean",
        init: false
      },
      /**
       * Selects the algorithm to place the widget horizontally. <code>direct</code>
       * uses {@link qx.util.placement.DirectAxis}, <code>keep-align</code>
       * uses {@link qx.util.placement.KeepAlignAxis} and <code>best-fit</code>
       * uses {@link qx.util.placement.BestFitAxis}.
       */
      placementModeX: {
        check: ["direct", "keep-align", "best-fit"],
        init: "keep-align",
        themeable: true
      },
      /**
       * Selects the algorithm to place the widget vertically. <code>direct</code>
       * uses {@link qx.util.placement.DirectAxis}, <code>keep-align</code>
       * uses {@link qx.util.placement.KeepAlignAxis} and <code>best-fit</code>
       * uses {@link qx.util.placement.BestFitAxis}.
       */
      placementModeY: {
        check: ["direct", "keep-align", "best-fit"],
        init: "keep-align",
        themeable: true
      },
      /** Left offset of the pointer (in pixel) */
      offsetLeft: {
        check: "Integer",
        init: 0,
        themeable: true
      },
      /** Top offset of the pointer (in pixel) */
      offsetTop: {
        check: "Integer",
        init: 0,
        themeable: true
      },
      /** Right offset of the pointer (in pixel) */
      offsetRight: {
        check: "Integer",
        init: 0,
        themeable: true
      },
      /** Bottom offset of the pointer (in pixel) */
      offsetBottom: {
        check: "Integer",
        init: 0,
        themeable: true
      },
      /** Offsets in one group */
      offset: {
        group: ["offsetTop", "offsetRight", "offsetBottom", "offsetLeft"],
        mode: "shorthand",
        themeable: true
      }
    },
    members: {
      __ptwLiveUpdater__P_143_2: null,
      __ptwLiveDisappearListener__P_143_3: null,
      __ptwLiveUpdateDisappearListener__P_143_4: null,
      /**@type {Record<"top" | "right" | "bottom" | "left", number> | null}*/
      __lastKnownCoords__P_143_5: null,
      __lastKnownSize__P_143_6: null,
      /**
       * Returns the location data like {qx.bom.element.Location#get} does,
       * but does not rely on DOM elements coordinates to be rendered. Instead,
       * this method works with the available layout data available in the moment
       * when it is executed.
       * This works best when called in some type of <code>resize</code> or
       * <code>move</code> event which are supported by all widgets out of the
       * box.
       *
       * @param widget {qx.ui.core.Widget} Any widget
       * @return {Map|null} Returns a map with <code>left</code>, <code>top</code>,
       *   <code>right</code> and <code>bottom</code> which contains the distance
       *   of the widget relative coords the document.
       */
      getLayoutLocation(widget) {
        // Use post-layout dimensions
        // which do not rely on the final rendered DOM element
        var insets, bounds, left, top;

        // Add bounds of the widget itself
        bounds = widget.getBounds();
        if (!bounds) {
          return null;
        }
        left = bounds.left;
        top = bounds.top;

        // Keep size to protect it for loop
        var size = bounds;

        // Now loop up with parents until reaching the root
        widget = widget.getLayoutParent();
        while (widget && !widget.isRootWidget()) {
          // Add coordinates
          bounds = widget.getBounds();
          left += bounds.left;
          top += bounds.top;

          // Add insets
          insets = widget.getInsets();
          left += insets.left;
          top += insets.top;

          // Next parent
          widget = widget.getLayoutParent();
        }

        // Add the rendered location of the root widget
        if (widget && widget.isRootWidget()) {
          var rootCoords = widget.getContentLocation();
          if (rootCoords) {
            left += rootCoords.left;
            top += rootCoords.top;
          }
        }

        // Build location data
        return {
          left: left,
          top: top,
          right: left + size.width,
          bottom: top + size.height
        };
      },
      /**
       * Sets the position. Uses low-level, high-performance DOM
       * methods when the property {@link #domMove} is enabled.
       * Checks if an always visible element is set and moves the widget to not
       * overlay the always visible widget if possible. The algorithm tries to
       * move the widget as far left as necessary but not of the screen.
       * ({@link #setVisibleElement})
       *
       * @param left {Integer} The left position
       * @param top {Integer} The top position
       */
      moveTo(left, top) {
        var visible = qx.ui.core.MPlacement.getVisibleElement();

        // if we have an always visible element
        if (visible) {
          var bounds = this.getBounds();
          var elemLocation = visible.getContentLocation();

          // if we have bounds for both elements
          if (bounds && elemLocation) {
            var bottom = top + bounds.height;
            var right = left + bounds.width;

            // horizontal placement wrong
            // each number is for the upcomming check (huge element is
            // the always visible, eleme prefixed)
            //     | 3 |
            //   ---------
            //   | |---| |
            //   |       |
            // --|-|   |-|--
            // 1 | |   | | 2
            // --|-|   |-|--
            //   |       |
            //   | |---| |
            //   ---------
            //     | 4 |
            if (right > elemLocation.left && left < elemLocation.right && bottom > elemLocation.top && top < elemLocation.bottom) {
              var direction = qx.ui.core.MPlacement.getMoveDirection();
              if (direction === "left") {
                left = Math.max(elemLocation.left - bounds.width, 0);
              } else {
                top = Math.max(elemLocation.top - bounds.height, 0);
              }
            }
          }
        }
        if (this.getDomMove()) {
          this.setDomPosition(left, top);
        } else {
          this.setLayoutProperties({
            left: left,
            top: top
          });
        }
      },
      /**
       * Places the widget to another (at least laid out) widget. The DOM
       * element is not needed, but the bounds are needed to compute the
       * location of the widget to align to.
       *
       * @param target {qx.ui.core.Widget} Target coords align coords
       * @param liveupdate {Boolean} Flag indicating if the position of the
       * widget should be checked and corrected automatically.
       * @return {Boolean} true if the widget was successfully placed
       */
      placeToWidget(target, liveupdate) {
        // Use the idle event to make sure that the widget's position gets
        // updated automatically (e.g. the widget gets scrolled).
        if (liveupdate) {
          this.__cleanupFromLastPlaceToWidgetLiveUpdate__P_143_7();

          // Bind target and livupdate to placeToWidget
          this.__ptwLiveUpdater__P_143_2 = qx.lang.Function.bind(this.placeToWidget, this, target, false);
          qx.event.Idle.getInstance().addListener("interval", this.__ptwLiveUpdater__P_143_2);

          // Remove the listener when the element disappears.
          this.__ptwLiveUpdateDisappearListener__P_143_4 = function () {
            this.__cleanupFromLastPlaceToWidgetLiveUpdate__P_143_7();
          };
          this.addListener("disappear", this.__ptwLiveUpdateDisappearListener__P_143_4, this);
        }
        var coords = target.getContentLocation() || this.getLayoutLocation(target);
        var size = this.__getPlacementSize__P_143_8();
        if (coords != null) {
          const boundsAreEqual = (bound1, bound2) => bound1 && bound2 && bound1.top === bound2.top && bound1.right === bound2.right && bound1.bottom === bound2.bottom && bound1.left === bound2.left;
          if (boundsAreEqual(coords, this.__lastKnownCoords__P_143_5) && boundsAreEqual(size, this.__lastKnownSize__P_143_6)) {
            return true;
          }
          this.__lastKnownCoords__P_143_5 = coords;
          this.__lastKnownSize__P_143_6 = size;
          this._place(coords);
          return true;
        } else {
          return false;
        }
      },
      /**
       * Removes all resources allocated by the last run of placeToWidget with liveupdate=true
       */
      __cleanupFromLastPlaceToWidgetLiveUpdate__P_143_7() {
        if (this.__ptwLiveUpdater__P_143_2) {
          qx.event.Idle.getInstance().removeListener("interval", this.__ptwLiveUpdater__P_143_2);
          this.__ptwLiveUpdater__P_143_2 = null;
        }
        if (this.__ptwLiveUpdateDisappearListener__P_143_4) {
          this.removeListener("disappear", this.__ptwLiveUpdateDisappearListener__P_143_4, this);
          this.__ptwLiveUpdateDisappearListener__P_143_4 = null;
        }
      },
      /**
       * Places the widget to the pointer position.
       *
       * @param event {qx.event.type.Pointer} Pointer event to align to
       */
      placeToPointer(event) {
        var left = Math.round(event.getDocumentLeft());
        var top = Math.round(event.getDocumentTop());
        var coords = {
          left: left,
          top: top,
          right: left,
          bottom: top
        };
        this._place(coords);
      },
      /**
       * Places the widget to any (rendered) DOM element.
       *
       * @param elem {Element} DOM element to align to
       * @param liveupdate {Boolean} Flag indicating if the position of the
       * widget should be checked and corrected automatically.
       */
      placeToElement(elem, liveupdate) {
        var location = qx.bom.element.Location.get(elem);
        var coords = {
          left: location.left,
          top: location.top,
          right: location.left + elem.offsetWidth,
          bottom: location.top + elem.offsetHeight
        };

        // Use the idle event to make sure that the widget's position gets
        // updated automatically (e.g. the widget gets scrolled).
        if (liveupdate) {
          // Bind target and livupdate to placeToWidget
          this.__ptwLiveUpdater__P_143_2 = qx.lang.Function.bind(this.placeToElement, this, elem, false);
          qx.event.Idle.getInstance().addListener("interval", this.__ptwLiveUpdater__P_143_2);

          // Remove the listener when the element disappears.
          this.addListener("disappear", () => {
            if (this.__ptwLiveUpdater__P_143_2) {
              qx.event.Idle.getInstance().removeListener("interval", this.__ptwLiveUpdater__P_143_2);
              this.__ptwLiveUpdater__P_143_2 = null;
            }
          });
        }
        this._place(coords);
      },
      /**
       * Places the widget in relation to the given point
       *
       * @param point {Map} Coordinate of any point with the keys <code>left</code>
       *   and <code>top</code>.
       */
      placeToPoint(point) {
        var coords = {
          left: point.left,
          top: point.top,
          right: point.left,
          bottom: point.top
        };
        this._place(coords);
      },
      /**
       * Returns the placement offsets as a map
       *
       * @return {Map} The placement offsets
       */
      _getPlacementOffsets() {
        return {
          left: this.getOffsetLeft(),
          top: this.getOffsetTop(),
          right: this.getOffsetRight(),
          bottom: this.getOffsetBottom()
        };
      },
      /**
       * Get the size of the object to place. The callback will be called with
       * the size as first argument. This methods works asynchronously.
       *
       * The size of the object to place is the size of the widget. If a widget
       * including this mixin needs a different size it can implement the method
       * <code>_computePlacementSize</code>, which returns the size.
       *
       *  @param callback {Function} This function will be called with the size as
       *    first argument. If it is null, the size is returned directly.
       */
      __getPlacementSize__P_143_8(callback) {
        var size = null;
        if (this._computePlacementSize) {
          var size = this._computePlacementSize();
        } else if (this.isVisible()) {
          var size = this.getBounds();
        }
        if (!callback) {
          return {
            ...size
          };
        }
        if (size == null) {
          this.addListenerOnce("appear", () => {
            this.__getPlacementSize__P_143_8(callback);
          });
        } else {
          callback.call(this, size);
        }
      },
      /**
       * Internal method to read specific this properties and
       * apply the results to the this afterwards.
       *
       * @param coords {Map} Location of the object to align the this to. This map
       *   should have the keys <code>left</code>, <code>top</code>, <code>right</code>
       *   and <code>bottom</code>.
       */
      _place(coords) {
        this.__getPlacementSize__P_143_8(function (size) {
          var result = qx.util.placement.Placement.compute(size, this.getLayoutParent().getBounds(), coords, this._getPlacementOffsets(), this.getPosition(), this.getPlacementModeX(), this.getPlacementModeY());

          // state handling for tooltips e.g.
          this.removeState("placementLeft");
          this.removeState("placementRight");
          this.addState(coords.left < result.left ? "placementRight" : "placementLeft");
          this.moveTo(result.left, result.top);
        });
      }
    },
    destruct() {
      this.__cleanupFromLastPlaceToWidgetLiveUpdate__P_143_7();
    }
  });
  qx.ui.core.MPlacement.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.MPlacement": {
        "require": true
      },
      "qx.core.Init": {},
      "qx.ui.popup.Manager": {}
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
   * Popups are widgets, which can be placed on top of the application.
   * They are automatically added to the application root.
   *
   * Popups are used to display menus, the lists of combo or select boxes,
   * tooltips, etc.
   */
  qx.Class.define("qx.ui.popup.Popup", {
    extend: qx.ui.container.Composite,
    include: qx.ui.core.MPlacement,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct(layout) {
      qx.ui.container.Composite.constructor.call(this, layout);

      // Initialize visibility
      this.initVisibility();
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
        init: "popup"
      },
      // overridden
      visibility: {
        refine: true,
        init: "excluded"
      },
      /**
       * Whether to let the system decide when to hide the popup. Setting
       * this to false gives you better control but it also requires you
       * to handle the closing of the popup.
       */
      autoHide: {
        check: "Boolean",
        init: true
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
      show() {
        // Lazy adding to the root element, otherwise it could happen that
        // IE scrolls automatically to top, see bug #3955 for details.
        if (this.getLayoutParent() == null) {
          // Automatically add to application's root
          qx.core.Init.getApplication().getRoot().add(this);
        }
        qx.ui.popup.Popup.superclass.prototype.show.call(this);
      },
      // overridden
      _applyVisibility(value, old) {
        qx.ui.popup.Popup.superclass.prototype._applyVisibility.call(this, value, old);
        var mgr = qx.ui.popup.Manager.getInstance();
        value === "visible" ? mgr.add(this) : mgr.remove(this);
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      if (!qx.ui.popup.Manager.getInstance().isDisposed()) {
        qx.ui.popup.Manager.getInstance().remove(this);
      }
    }
  });
  qx.ui.popup.Popup.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.popup.Popup": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.HBox": {
        "construct": true
      },
      "qx.ui.core.Widget": {},
      "qx.ui.basic.Atom": {},
      "qx.ui.basic.Image": {}
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
   * A Tooltip provides additional information for widgets when the user hovers
   * over a widget.
   *
   * @childControl atom {qx.ui.basic.Atom} atom widget which represents the content of the tooltip
   */
  qx.Class.define("qx.ui.tooltip.ToolTip", {
    extend: qx.ui.popup.Popup,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param label {String} label of the tooltip
     * @param icon {String?null} Icon URL of the tooltip
     */

    construct(label, icon) {
      qx.ui.popup.Popup.constructor.call(this);

      // Use static layout
      this.setLayout(new qx.ui.layout.HBox());
      this._createChildControl("arrow");
      // Integrate atom
      this._createChildControl("atom");

      // Initialize properties
      if (label != null) {
        this.setLabel(label);
      }
      if (icon != null) {
        this.setIcon(icon);
      }
      this.addListener("pointerover", this._onPointerOver, this);
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
        init: "tooltip"
      },
      /** Interval after the tooltip is shown (in milliseconds) */
      showTimeout: {
        check: "Integer",
        init: 700,
        themeable: true
      },
      /** Interval after the tooltip is hidden (in milliseconds) */
      hideTimeout: {
        check: "Integer",
        init: 4000,
        themeable: true
      },
      /** The label/caption/text of the ToolTip's atom. */
      label: {
        check: "String",
        nullable: true,
        apply: "_applyLabel"
      },
      /**
       * Any URI String supported by qx.ui.basic.Image to display an icon in
       * ToolTips's atom.
       */
      icon: {
        check: "String",
        nullable: true,
        apply: "_applyIcon",
        themeable: true
      },
      /**
       * Switches between rich HTML and text content. The text mode
       * (<code>false</code>) supports advanced features like ellipsis when the
       * available space is not enough. HTML mode (<code>true</code>) supports
       * multi-line content and all the markup features of HTML content.
       */
      rich: {
        check: "Boolean",
        init: false,
        apply: "_applyRich"
      },
      /** Widget that opened the tooltip */
      opener: {
        check: "qx.ui.core.Widget",
        nullable: true
      },
      /** Position of the arrow pointing towards the opening widget **/
      arrowPosition: {
        check: ["left", "right"],
        init: "left",
        themeable: true,
        apply: "_applyArrowPosition"
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
        placementLeft: true
      },
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "atom":
            control = new qx.ui.basic.Atom();
            this._add(control, {
              flex: 1
            });
            break;
          case "arrow":
            control = new qx.ui.basic.Image();
            this._add(control);
        }
        return control || qx.ui.tooltip.ToolTip.superclass.prototype._createChildControlImpl.call(this, id);
      },
      /**
       * Listener method for "pointerover" event
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onPointerOver(e) {
        //this.hide();
      },
      /*
      ---------------------------------------------------------------------------
        APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyIcon(value, old) {
        var atom = this.getChildControl("atom");
        value == null ? atom.resetIcon() : atom.setIcon(value);
      },
      // property apply
      _applyLabel(value, old) {
        var atom = this.getChildControl("atom");
        value == null ? atom.resetLabel() : atom.setLabel(value);
      },
      // property apply
      _applyRich(value, old) {
        var atom = this.getChildControl("atom");
        atom.setRich(value);
      },
      // property apply
      _applyArrowPosition(value, old) {
        this._getLayout().setReversed(value == "left");
      }
    }
  });
  qx.ui.tooltip.ToolTip.$$dbClassInfo = $$dbClassInfo;
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
   * This mixin redirects all children handling methods to a child widget of the
   * including class. This is e.g. used in {@link qx.ui.window.Window} to add
   * child widgets directly to the window pane.
   *
   * The including class must implement the method <code>getChildrenContainer</code>,
   * which has to return the widget, to which the child widgets should be added.
   */
  qx.Mixin.define("qx.ui.core.MRemoteChildrenHandling", {
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Forward the call with the given function name to the children container
       *
       * @param functionName {String} name of the method to forward
       * @param a1 {var?} first argument of the method to call
       * @param a2 {var?} second argument of the method to call
       * @param a3 {var?} third argument of the method to call
       * @return {var} The return value of the forward method
       */
      __forward__P_144_0(functionName, a1, a2, a3) {
        var container = this.getChildrenContainer();
        if (container === this) {
          functionName = "_" + functionName;
        }
        return container[functionName](a1, a2, a3);
      },
      /**
       * Returns the children list
       *
       * @return {qx.ui.core.LayoutItem[]} The children array (Arrays are
       *   reference types, please do not modify them in-place)
       */
      getChildren() {
        return this.__forward__P_144_0("getChildren");
      },
      /**
       * Whether the widget contains children.
       *
       * @return {Boolean} Returns <code>true</code> when the widget has children.
       */
      hasChildren() {
        return this.__forward__P_144_0("hasChildren");
      },
      /**
       * Adds a new child widget.
       *
       * The supported keys of the layout options map depend on the layout manager
       * used to position the widget. The options are documented in the class
       * documentation of each layout manager {@link qx.ui.layout}.
       *
       * @param child {qx.ui.core.LayoutItem} the item to add.
       * @param options {Map?null} Optional layout data for item.
       * @return {qx.ui.core.Widget} This object (for chaining support)
       */
      add(child, options) {
        return this.__forward__P_144_0("add", child, options);
      },
      /**
       * Remove the given child item.
       *
       * @param child {qx.ui.core.LayoutItem} the item to remove
       * @return {qx.ui.core.Widget} This object (for chaining support)
       */
      remove(child) {
        return this.__forward__P_144_0("remove", child);
      },
      /**
       * Remove all children.
       * @return {Array} An array containing the removed children.
       */
      removeAll() {
        return this.__forward__P_144_0("removeAll");
      },
      /**
       * Returns the index position of the given item if it is
       * a child item. Otherwise it returns <code>-1</code>.
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} the item to query for
       * @return {Integer} The index position or <code>-1</code> when
       *   the given item is no child of this layout.
       */
      indexOf(child) {
        return this.__forward__P_144_0("indexOf", child);
      },
      /**
       * Add a child at the specified index
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} item to add
       * @param index {Integer} Index, at which the item will be inserted
       * @param options {Map?null} Optional layout data for item.
       */
      addAt(child, index, options) {
        this.__forward__P_144_0("addAt", child, index, options);
      },
      /**
       * Add an item before another already inserted item
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} item to add
       * @param before {qx.ui.core.LayoutItem} item before the new item will be inserted.
       * @param options {Map?null} Optional layout data for item.
       */
      addBefore(child, before, options) {
        this.__forward__P_144_0("addBefore", child, before, options);
      },
      /**
       * Add an item after another already inserted item
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param child {qx.ui.core.LayoutItem} item to add
       * @param after {qx.ui.core.LayoutItem} item, after which the new item will be inserted
       * @param options {Map?null} Optional layout data for item.
       */
      addAfter(child, after, options) {
        this.__forward__P_144_0("addAfter", child, after, options);
      },
      /**
       * Remove the item at the specified index.
       *
       * This method works on the widget's children list. Some layout managers
       * (e.g. {@link qx.ui.layout.HBox}) use the children order as additional
       * layout information. Other layout manager (e.g. {@link qx.ui.layout.Grid})
       * ignore the children order for the layout process.
       *
       * @param index {Integer} Index of the item to remove.
       * @return {qx.ui.core.LayoutItem} The removed item
       */
      removeAt(index) {
        return this.__forward__P_144_0("removeAt", index);
      }
    }
  });
  qx.ui.core.MRemoteChildrenHandling.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.MPlacement": {
        "require": true
      },
      "qx.ui.core.MRemoteChildrenHandling": {
        "require": true
      },
      "qx.ui.menu.Layout": {
        "construct": true
      },
      "qx.ui.core.Blocker": {
        "construct": true
      },
      "qx.ui.menu.Separator": {},
      "qx.ui.menu.Manager": {},
      "qx.ui.menu.AbstractButton": {},
      "qx.ui.menu.MenuSlideBar": {},
      "qx.ui.layout.Grow": {},
      "qx.lang.Array": {},
      "qx.ui.core.queue.Widget": {},
      "qx.core.ObjectRegistry": {}
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
   * The menu is a popup like control which supports buttons. It comes
   * with full keyboard navigation and an improved timeout based pointer
   * control behavior.
   *
   * This class is the container for all derived instances of
   * {@link qx.ui.menu.AbstractButton}.
   *
   * @childControl slidebar {qx.ui.menu.MenuSlideBar} shows a slidebar to easily navigate inside the menu (if too little space is left)
   */
  qx.Class.define("qx.ui.menu.Menu", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MPlacement, qx.ui.core.MRemoteChildrenHandling],
    construct() {
      qx.ui.core.Widget.constructor.call(this);

      // Use hard coded layout
      this._setLayout(new qx.ui.menu.Layout());

      // Automatically add to application's root
      var root = this.getApplicationRoot();
      root.add(this);

      // ARIA attrs
      const contentEl = this.getContentElement();
      contentEl.setAttribute("role", "menu");
      contentEl.setAttribute("id", "menu-" + this.toHashCode());

      // Register pointer listeners
      this.addListener("pointerover", this._onPointerOver);
      this.addListener("pointerout", this._onPointerOut);

      // add resize listener
      this.addListener("resize", this._onResize, this);
      root.addListener("resize", this._onResize, this);
      this._blocker = new qx.ui.core.Blocker(root);

      // Initialize properties
      this.initVisibility();
      this.initKeepFocus();
      this.initKeepActive();
    },
    properties: {
      /*
      ---------------------------------------------------------------------------
        WIDGET PROPERTIES
      ---------------------------------------------------------------------------
      */

      // overridden
      appearance: {
        refine: true,
        init: "menu"
      },
      // overridden
      allowGrowX: {
        refine: true,
        init: false
      },
      // overridden
      allowGrowY: {
        refine: true,
        init: false
      },
      // overridden
      visibility: {
        refine: true,
        init: "excluded"
      },
      // overridden
      keepFocus: {
        refine: true,
        init: true
      },
      // overridden
      keepActive: {
        refine: true,
        init: true
      },
      /*
      ---------------------------------------------------------------------------
        STYLE OPTIONS
      ---------------------------------------------------------------------------
      */

      /** The spacing between each cell of the menu buttons */
      spacingX: {
        check: "Integer",
        apply: "_applySpacingX",
        init: 0,
        themeable: true
      },
      /** The spacing between each menu button */
      spacingY: {
        check: "Integer",
        apply: "_applySpacingY",
        init: 0,
        themeable: true
      },
      /**
       * Default icon column width if no icons are rendered.
       * This property is ignored as soon as an icon is present.
       */
      iconColumnWidth: {
        check: "Integer",
        init: 0,
        themeable: true,
        apply: "_applyIconColumnWidth"
      },
      /** Default arrow column width if no sub menus are rendered */
      arrowColumnWidth: {
        check: "Integer",
        init: 0,
        themeable: true,
        apply: "_applyArrowColumnWidth"
      },
      /**
       * Color of the blocker
       */
      blockerColor: {
        check: "Color",
        init: null,
        nullable: true,
        apply: "_applyBlockerColor",
        themeable: true
      },
      /**
       * Opacity of the blocker
       */
      blockerOpacity: {
        check: "Number",
        init: 1,
        apply: "_applyBlockerOpacity",
        themeable: true
      },
      /*
      ---------------------------------------------------------------------------
        FUNCTIONALITY PROPERTIES
      ---------------------------------------------------------------------------
      */

      /** The currently selected button */
      selectedButton: {
        check: "qx.ui.core.Widget",
        nullable: true,
        apply: "_applySelectedButton"
      },
      /** The currently opened button (sub menu is visible) */
      openedButton: {
        check: "qx.ui.core.Widget",
        nullable: true,
        apply: "_applyOpenedButton"
      },
      /** Widget that opened the menu */
      opener: {
        check: "qx.ui.core.Widget",
        nullable: true,
        apply: "_applyOpener"
      },
      /*
      ---------------------------------------------------------------------------
        BEHAVIOR PROPERTIES
      ---------------------------------------------------------------------------
      */

      /** Interval in ms after which sub menus should be opened */
      openInterval: {
        check: "Integer",
        themeable: true,
        init: 250
      },
      /** Interval in ms after which sub menus should be closed  */
      closeInterval: {
        check: "Integer",
        themeable: true,
        init: 250
      },
      /** Blocks the background if value is <code>true<code> */
      blockBackground: {
        check: "Boolean",
        themeable: true,
        init: false
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __scheduledOpen__P_56_0: null,
      __onAfterSlideBarAdd__P_56_1: null,
      /** @type {qx.ui.core.Blocker} blocker for background blocking */
      _blocker: null,
      /*
      ---------------------------------------------------------------------------
        PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * Opens the menu and configures the opener
       */
      open() {
        if (this.getOpener() != null) {
          var isPlaced = this.placeToWidget(this.getOpener(), true);
          if (isPlaced) {
            this.__updateSlideBar__P_56_2();
            this.show();
            this._placementTarget = this.getOpener();
          } else {
            this.warn("Could not open menu instance because 'opener' widget is not visible");
          }
        } else {
          this.warn("The menu instance needs a configured 'opener' widget!");
        }
      },
      /**
       * Opens the menu at the pointer position
       *
       * @param e {qx.event.type.Pointer} Pointer event to align to
       */
      openAtPointer(e) {
        this.placeToPointer(e);
        this.__updateSlideBar__P_56_2();
        this.show();
        this._placementTarget = {
          left: e.getDocumentLeft(),
          top: e.getDocumentTop()
        };
      },
      /**
       * Opens the menu in relation to the given point
       *
       * @param point {Map} Coordinate of any point with the keys <code>left</code>
       *   and <code>top</code>.
       */
      openAtPoint(point) {
        this.placeToPoint(point);
        this.__updateSlideBar__P_56_2();
        this.show();
        this._placementTarget = point;
      },
      /**
       * Convenience method to add a separator to the menu
       */
      addSeparator() {
        this.add(new qx.ui.menu.Separator());
      },
      /**
       * Returns the column sizes detected during the pre-layout phase
       *
       * @return {Array} List of all column widths
       */
      getColumnSizes() {
        return this._getMenuLayout().getColumnSizes();
      },
      /**
       * Return all selectable menu items.
       *
       * @return {qx.ui.core.Widget[]} selectable widgets
       */
      getSelectables() {
        var result = [];
        var children = this.getChildren();
        for (var i = 0; i < children.length; i++) {
          if (children[i].isEnabled()) {
            result.push(children[i]);
          }
        }
        return result;
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyIconColumnWidth(value, old) {
        this._getMenuLayout().setIconColumnWidth(value);
      },
      // property apply
      _applyArrowColumnWidth(value, old) {
        this._getMenuLayout().setArrowColumnWidth(value);
      },
      // property apply
      _applySpacingX(value, old) {
        this._getMenuLayout().setColumnSpacing(value);
      },
      // property apply
      _applySpacingY(value, old) {
        this._getMenuLayout().setSpacing(value);
      },
      // overridden
      _applyVisibility(value, old) {
        qx.ui.menu.Menu.superclass.prototype._applyVisibility.call(this, value, old);
        var mgr = qx.ui.menu.Manager.getInstance();
        if (value === "visible") {
          // Register to manager (zIndex handling etc.)
          mgr.add(this);

          // Mark opened in parent menu
          var parentMenu = this.getParentMenu();
          if (parentMenu) {
            parentMenu.setOpenedButton(this.getOpener());
          }
        } else if (old === "visible") {
          // Deregister from manager (zIndex handling etc.)
          mgr.remove(this);

          // Unmark opened in parent menu
          var parentMenu = this.getParentMenu();
          if (parentMenu && parentMenu.getOpenedButton() == this.getOpener()) {
            parentMenu.resetOpenedButton();
          }

          // Clear properties
          this.resetOpenedButton();
          this.resetSelectedButton();
        }
        this.__updateBlockerVisibility__P_56_3();
      },
      /**
       * Updates the blocker's visibility
       */
      __updateBlockerVisibility__P_56_3() {
        if (this.isVisible()) {
          if (this.getBlockBackground()) {
            var zIndex = this.getZIndex();
            this._blocker.blockContent(zIndex - 1);
          }
        } else {
          if (this._blocker.isBlocked()) {
            this._blocker.unblock();
          }
        }
      },
      /**
       * Get the parent menu. Returns <code>null</code> if the menu doesn't have a
       * parent menu.
       *
       * @return {qx.ui.core.Widget|null} The parent menu.
       */
      getParentMenu() {
        var widget = this.getOpener();
        if (!widget || !(widget instanceof qx.ui.menu.AbstractButton)) {
          return null;
        }
        if (widget && widget.getContextMenu() === this) {
          return null;
        }
        while (widget && !(widget instanceof qx.ui.menu.Menu)) {
          widget = widget.getLayoutParent();
        }
        return widget;
      },
      // property apply
      _applySelectedButton(value, old) {
        if (old) {
          old.removeState("selected");
        }
        if (value) {
          value.addState("selected");
        }

        // ARIA attrs
        const opener = this.__getRootOpener__P_56_4();
        const contentEl = opener ? opener.getContentElement() : this.getContentElement();
        if (!contentEl) {
          return;
        }
        const valueContentEl = value ? value.getContentElement() : null;
        if (valueContentEl) {
          contentEl.setAttribute("aria-activedescendant", valueContentEl.getAttribute("id"));
        } else {
          contentEl.removeAttribute("aria-activedescendant");
        }
      },
      // property apply
      _applyOpenedButton(value, old) {
        if (old && old.getMenu()) {
          old.getMenu().exclude();
        }
        if (value) {
          value.getMenu().open();
        }
      },
      // property apply
      _applyOpener(value, old) {
        // ARIA attrs
        const contentEl = this.getContentElement();
        if (!contentEl) {
          return;
        }
        if (value && value.getContentElement()) {
          contentEl.setAttribute("aria-labelledby", "");
          this.addAriaLabelledBy(value);
        } else {
          contentEl.removeAttribute("aria-labelledby");
        }
      },
      // property apply
      _applyBlockerColor(value, old) {
        this._blocker.setColor(value);
      },
      // property apply
      _applyBlockerOpacity(value, old) {
        this._blocker.setOpacity(value);
      },
      /*
      ---------------------------------------------------------------------------
      SCROLLING SUPPORT
      ---------------------------------------------------------------------------
      */

      // overridden
      getChildrenContainer() {
        return this.getChildControl("slidebar", true) || this;
      },
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "slidebar":
            var control = new qx.ui.menu.MenuSlideBar();
            var layout = this._getLayout();
            this._setLayout(new qx.ui.layout.Grow());
            var slidebarLayout = control.getLayout();
            control.setLayout(layout);
            slidebarLayout.dispose();
            var children = qx.lang.Array.clone(this.getChildren());
            for (var i = 0; i < children.length; i++) {
              control.add(children[i]);
            }
            this.removeListener("resize", this._onResize, this);
            control.getChildrenContainer().addListener("resize", this._onResize, this);
            this._add(control);
            break;
        }
        return control || qx.ui.menu.Menu.superclass.prototype._createChildControlImpl.call(this, id);
      },
      /**
       * Get the menu layout manager
       *
       * @return {qx.ui.layout.Abstract} The menu layout manager
       */
      _getMenuLayout() {
        if (this.hasChildControl("slidebar")) {
          return this.getChildControl("slidebar").getChildrenContainer().getLayout();
        } else {
          return this._getLayout();
        }
      },
      /**
       * Get the menu bounds
       *
       * @return {Map} The menu bounds
       */
      _getMenuBounds() {
        if (this.hasChildControl("slidebar")) {
          return this.getChildControl("slidebar").getChildrenContainer().getBounds();
        } else {
          return this.getBounds();
        }
      },
      /**
       * Computes the size of the menu. This method is used by the
       * {@link qx.ui.core.MPlacement} mixin.
       * @return {Map} The menu bounds
       */
      _computePlacementSize() {
        return this._getMenuBounds();
      },
      /**
       * Updates the visibility of the slidebar based on the menu's current size
       * and position.
       */
      __updateSlideBar__P_56_2() {
        var menuBounds = this._getMenuBounds();
        if (!menuBounds) {
          this.addListenerOnce("resize", this.__updateSlideBar__P_56_2, this);
          return;
        }
        var rootHeight = this.getLayoutParent().getBounds().height;
        var top = this.getLayoutProperties().top;
        var left = this.getLayoutProperties().left;

        // Adding the slidebar must be deferred because this call can happen
        // during the layout flush, which make it impossible to move existing
        // layout to the slidebar
        if (top < 0) {
          this._assertSlideBar(function () {
            this.setHeight(menuBounds.height + top);
            this.moveTo(left, 0);
          });
        } else if (top + menuBounds.height > rootHeight) {
          this._assertSlideBar(function () {
            this.setHeight(rootHeight - top);
          });
        } else {
          this.setHeight(null);
        }
      },
      /**
       * Schedules the addition of the slidebar and calls the given callback
       * after the slidebar has been added.
       *
       * @param callback {Function} the callback to call
       * @return {var|undefined} The return value of the callback if the slidebar
       * already exists, or <code>undefined</code> if it doesn't
       */
      _assertSlideBar(callback) {
        if (this.hasChildControl("slidebar")) {
          return callback.call(this);
        }
        this.__onAfterSlideBarAdd__P_56_1 = callback;
        qx.ui.core.queue.Widget.add(this);
      },
      // overridden
      syncWidget(jobs) {
        this.getChildControl("slidebar");
        if (this.__onAfterSlideBarAdd__P_56_1) {
          this.__onAfterSlideBarAdd__P_56_1.call(this);
          delete this.__onAfterSlideBarAdd__P_56_1;
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLING
      ---------------------------------------------------------------------------
      */

      /**
       * Gets called when a child is added. Sets ARIA attrs
       * @param {*} child
       */
      _afterAddChild(child) {
        // Some childs, e.g. Seperators, are no meaningful menu items
        if (child instanceof qx.ui.menu.AbstractButton) {
          const contentEl = child.getContentElement();
          contentEl.setAttribute("id", "menu-item-" + child.toHashCode());
          contentEl.setAttribute("role", "menuitem");
        }
      },
      /**
       * Update position if the menu or the root is resized
       */
      _onResize() {
        if (this.isVisible()) {
          var target = this._placementTarget;
          if (!target) {
            return;
          } else if (target instanceof qx.ui.core.Widget) {
            this.placeToWidget(target, true);
          } else if (target.top !== undefined) {
            this.placeToPoint(target);
          } else {
            throw new Error("Unknown target: " + target);
          }
          this.__updateSlideBar__P_56_2();
        }
      },
      /**
       * Event listener for pointerover event.
       *
       * @param e {qx.event.type.Pointer} pointerover event
       */
      _onPointerOver(e) {
        // Cache manager
        var mgr = qx.ui.menu.Manager.getInstance();

        // Be sure this menu is kept
        mgr.cancelClose(this);

        // Change selection
        var target = e.getTarget();
        if (target.isEnabled() && target instanceof qx.ui.menu.AbstractButton) {
          // Select button directly
          this.setSelectedButton(target);
          var subMenu = target.getMenu && target.getMenu();
          if (subMenu) {
            subMenu.setOpener(target);

            // Finally schedule for opening
            mgr.scheduleOpen(subMenu);

            // Remember scheduled menu for opening
            this.__scheduledOpen__P_56_0 = subMenu;
          } else {
            var opened = this.getOpenedButton();
            if (opened) {
              mgr.scheduleClose(opened.getMenu());
            }
            if (this.__scheduledOpen__P_56_0) {
              mgr.cancelOpen(this.__scheduledOpen__P_56_0);
              this.__scheduledOpen__P_56_0 = null;
            }
          }
        } else if (!this.getOpenedButton()) {
          // When no button is opened reset the selection
          // Otherwise keep it
          this.resetSelectedButton();
        }
      },
      /**
       * Event listener for pointerout event.
       *
       * @param e {qx.event.type.Pointer} pointerout event
       */
      _onPointerOut(e) {
        // Cache manager
        var mgr = qx.ui.menu.Manager.getInstance();

        // Detect whether the related target is out of the menu
        if (!qx.ui.core.Widget.contains(this, e.getRelatedTarget())) {
          // Update selected property
          // Force it to the open sub menu in cases where that is opened
          // Otherwise reset it. Menus which are left by the cursor should
          // not show any selection.
          var opened = this.getOpenedButton();
          opened ? this.setSelectedButton(opened) : this.resetSelectedButton();

          // Cancel a pending close request for the currently
          // opened sub menu
          if (opened) {
            mgr.cancelClose(opened.getMenu());
          }

          // When leaving this menu to the outside, stop
          // all pending requests to open any other sub menu
          if (this.__scheduledOpen__P_56_0) {
            mgr.cancelOpen(this.__scheduledOpen__P_56_0);
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        HELPER FUNCTIONS
      ---------------------------------------------------------------------------
      */

      /**
       * Get the opener of the root/the first parent menu.
       * parent menu.
       *
       * @return {qx.ui.core.Widget|null} The opener.
       */
      __getRootOpener__P_56_4() {
        let parentMenu = this.getParentMenu();
        if (!parentMenu) {
          return this.getOpener();
        }
        let opener;
        while (parentMenu) {
          opener = parentMenu.getOpener();
          parentMenu = parentMenu.getParentMenu();
        }
        return opener;
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      if (!qx.core.ObjectRegistry.inShutDown) {
        qx.ui.menu.Manager.getInstance().remove(this);
      }
      this.getApplicationRoot().removeListener("resize", this._onResize, this);
      this._placementTarget = null;
      this._disposeObjects("_blocker");
    }
  });
  qx.ui.menu.Menu.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.Object": {
        "require": true
      },
      "qx.ui.core.LayoutItem": {}
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
   * Base class for all layout managers.
   *
   * Custom layout manager must derive from
   * this class and implement the methods {@link #invalidateLayoutCache},
   * {@link #renderLayout} and {@link #getSizeHint}.
   */
  qx.Class.define("qx.ui.layout.Abstract", {
    type: "abstract",
    extend: qx.core.Object,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** @type {Map} The cached size hint */
      __sizeHint__P_107_0: null,
      /** @type {Boolean} Whether the children cache is valid. This field is protected
       *    because sub classes must be able to access it quickly.
       */
      _invalidChildrenCache: null,
      /** @type {qx.ui.core.Widget} The connected widget */
      __widget__P_107_1: null,
      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      /**
       * Invalidate all layout relevant caches. Automatically deletes the size hint.
       *
       * @abstract
       */
      invalidateLayoutCache() {
        this.__sizeHint__P_107_0 = null;
      },
      /**
       * Applies the children layout.
       *
       * @abstract
       * @param availWidth {Integer} Final width available for the content (in pixel)
       * @param availHeight {Integer} Final height available for the content (in pixel)
       * @param padding {Map} Map containing the padding values. Keys:
       * <code>top</code>, <code>bottom</code>, <code>left</code>, <code>right</code>
       */
      renderLayout(availWidth, availHeight, padding) {
        this.warn("Missing renderLayout() implementation!");
      },
      /**
       * Computes the layout dimensions and possible ranges of these.
       *
       * @return {Map|null} The map with the preferred width/height and the allowed
       *   minimum and maximum values in cases where shrinking or growing
       *   is required. Can also return <code>null</code> when this detection
       *   is not supported by the layout.
       */
      getSizeHint() {
        if (this.__sizeHint__P_107_0) {
          return this.__sizeHint__P_107_0;
        }
        return this.__sizeHint__P_107_0 = this._computeSizeHint();
      },
      /**
       * Whether the layout manager supports height for width.
       *
       * @return {Boolean} Whether the layout manager supports height for width
       */
      hasHeightForWidth() {
        return false;
      },
      /**
       * If layout wants to trade height for width it has to implement this
       * method and return the preferred height if it is resized to
       * the given width. This function returns <code>null</code> if the item
       * do not support height for width.
       *
       * @param width {Integer} The computed width
       * @return {Integer} The desired height
       */
      getHeightForWidth(width) {
        this.warn("Missing getHeightForWidth() implementation!");
        return null;
      },
      /**
       * This computes the size hint of the layout and returns it.
       *
       * @abstract
       * @return {Map} The size hint.
       */
      _computeSizeHint() {
        return null;
      },
      /**
       * This method is called, on each child "add" and "remove" action and
       * whenever the layout data of a child is changed. The method should be used
       * to clear any children relevant cached data.
       *
       */
      invalidateChildrenCache() {
        this._invalidChildrenCache = true;
      },
      /**
       * Verifies the value of a layout property.
       *
       * Note: This method is only available in the debug builds.
       *
       * @signature function(item, name, value)
       * @param item {Object} The affected layout item
       * @param name {Object} Name of the layout property
       * @param value {Object} Value of the layout property
       */
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          // empty implementation
        },
        false: null
      }),
      /**
       * Remove all currently visible separators
       */
      _clearSeparators() {
        // It may be that the widget do not implement clearSeparators which is especially true
        // when it do not inherit from LayoutItem.
        var widget = this.__widget__P_107_1;
        if (widget instanceof qx.ui.core.LayoutItem) {
          widget.clearSeparators();
        }
      },
      /**
       * Renders a separator between two children
       *
       * @param separator {String|qx.ui.decoration.IDecorator} The separator to render
       * @param bounds {Map} Contains the left and top coordinate and the width and height
       *    of the separator to render.
       */
      _renderSeparator(separator, bounds) {
        this.__widget__P_107_1.renderSeparator(separator, bounds);
      },
      /**
       * This method is called by the widget to connect the widget with the layout.
       *
       * @param widget {qx.ui.core.Widget} The widget to connect to.
       */
      connectToWidget(widget) {
        if (widget && this.__widget__P_107_1) {
          throw new Error("It is not possible to manually set the connected widget.");
        }
        this.__widget__P_107_1 = widget;

        // Invalidate cache
        this.invalidateChildrenCache();
      },
      /**
       * Return the widget that is this layout is responsible for.
       *
       * @return {qx.ui.core.Widget} The widget connected to this layout.
       */
      _getWidget() {
        return this.__widget__P_107_1;
      },
      /**
       * Indicate that the layout has layout changed and propagate this information
       * up the widget hierarchy.
       *
       * Also a generic property apply method for all layout relevant properties.
       */
      _applyLayoutChange() {
        if (this.__widget__P_107_1) {
          this.__widget__P_107_1.scheduleLayoutUpdate();
        }
      },
      /**
       * Returns the list of all layout relevant children.
       *
       * @return {Array} List of layout relevant children.
       */
      _getLayoutChildren() {
        return this.__widget__P_107_1.getLayoutChildren();
      }
    },
    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */

    destruct() {
      this.__widget__P_107_1 = this.__sizeHint__P_107_0 = null;
    }
  });
  qx.ui.layout.Abstract.$$dbClassInfo = $$dbClassInfo;
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
      "qx.lang.Type": {},
      "qx.ui.style.Stylesheet": {},
      "qx.Bootstrap": {},
      "qx.ui.decoration.Decorator": {},
      "qx.ui.decoration.IDecorator": {},
      "qx.lang.Object": {},
      "qx.util.AliasManager": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "construct": true,
          "className": "qx.bom.client.Engine"
        },
        "browser.documentmode": {
          "construct": true,
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
       * Andreas Ecker (ecker)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Manager for decoration themes
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.theme.manager.Decoration", {
    type: "singleton",
    extend: qx.core.Object,
    implement: [qx.core.IDisposable],
    statics: {
      /** The prefix for all created CSS classes*/
      CSS_CLASSNAME_PREFIX: "qx-"
    },
    construct() {
      qx.core.Object.constructor.call(this);
      this.__rules__P_108_0 = [];
      this.__legacyIe__P_108_1 = qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9;
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** Selected decoration theme */
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
      __dynamic__P_108_2: null,
      __rules__P_108_0: null,
      __legacyIe__P_108_1: false,
      /**
       * Returns the name which will be / is used as css class name.
       * @param value {String|qx.ui.decoration.IDecorator} The decorator string or instance.
       * @return {String} The css class name.
       */
      getCssClassName(value) {
        var prefix = qx.theme.manager.Decoration.CSS_CLASSNAME_PREFIX;
        if (qx.lang.Type.isString(value)) {
          return prefix + value;
        } else {
          return prefix + value.toHashCode();
        }
      },
      /**
       * Adds a css class to the global stylesheet for the given decorator.
       * This includes resolving the decorator if it's a string.
       * @param value {String|qx.ui.decoration.IDecorator} The decorator string or instance.
       * @return {String} the css class name.
       */
      addCssClass(value) {
        var sheet = qx.ui.style.Stylesheet.getInstance();
        var instance = value;
        value = this.getCssClassName(value);
        var selector = "." + value;
        if (sheet.hasRule(selector)) {
          return value;
        }
        if (qx.lang.Type.isString(instance)) {
          instance = this.resolve(instance);
        }
        if (!instance) {
          throw new Error("Unable to resolve decorator '" + value + "'.");
        }

        // create and add a CSS rule
        var css = "";
        var styles = instance.getStyles(true);

        // Sort the styles so that more specific styles come after the group styles,
        // eg background-color comes after background. The sort order is alphabetical
        // so that short cut rules come before actual
        Object.keys(styles).sort().forEach(function (key) {
          // if we find a map value, use it as pseudo class
          if (qx.Bootstrap.isObject(styles[key])) {
            var innerCss = "";
            var innerStyles = styles[key];
            var inner = false;
            for (var innerKey in innerStyles) {
              inner = true;
              innerCss += innerKey + ":" + innerStyles[innerKey] + ";";
            }
            var innerSelector = this.__legacyIe__P_108_1 ? selector : selector + (inner ? ":" : "");
            this.__rules__P_108_0.push(innerSelector + key);
            sheet.addRule(innerSelector + key, innerCss);
            return;
          }
          css += key + ":" + styles[key] + ";";
        }, this);
        if (css) {
          sheet.addRule(selector, css);
          this.__rules__P_108_0.push(selector);
        }
        return value;
      },
      /**
       * Removes all previously by {@link #addCssClass} created CSS rule from
       * the global stylesheet.
       */
      removeAllCssClasses() {
        // remove old rules
        for (var i = 0; i < this.__rules__P_108_0.length; i++) {
          var selector = this.__rules__P_108_0[i];
          qx.ui.style.Stylesheet.getInstance().removeRule(selector);
        }
        this.__rules__P_108_0 = [];
      },
      /**
       * Returns the dynamically interpreted result for the incoming value
       *
       * @param value {String} dynamically interpreted idenfier
       * @return {var} return the (translated) result of the incoming value
       */
      resolve(value) {
        if (!value) {
          return null;
        }
        if (typeof value === "object") {
          return value;
        }
        var cache = this.__dynamic__P_108_2;
        if (!cache) {
          cache = this.__dynamic__P_108_2 = {};
        }
        var resolved = cache[value];
        if (resolved) {
          return resolved;
        }
        var theme = this.getTheme();
        if (!theme) {
          return null;
        }
        if (!theme.decorations[value]) {
          return null;
        }

        // create an empty decorator
        var decorator = new qx.ui.decoration.Decorator();

        // handle recursive decorator includes
        var recurseDecoratorInclude = function (currentEntry, name) {
          // follow the include chain to the topmost decorator entry
          if (currentEntry.include && theme.decorations[currentEntry.include]) {
            recurseDecoratorInclude(theme.decorations[currentEntry.include], currentEntry.include);
          }

          // apply styles from the included decorator,
          // overwriting existing values.
          if (currentEntry.style) {
            decorator.set(currentEntry.style);
          }
        };

        // start with the current decorator entry
        recurseDecoratorInclude(theme.decorations[value], value);
        cache[value] = decorator;
        return cache[value];
      },
      /**
       * Whether the given value is valid for being used in a property
       * with the 'check' configured to 'Decorator'.
       *
       * @param value {var} Incoming value
       * @return {Boolean} Whether the value is valid for being used in a Decorator property
       */
      isValidPropertyValue(value) {
        if (typeof value === "string") {
          return this.isDynamic(value);
        } else if (typeof value === "object") {
          var clazz = value.constructor;
          return qx.Class.hasInterface(clazz, qx.ui.decoration.IDecorator);
        }
        return false;
      },
      /**
       * Whether a value is interpreted dynamically
       *
       * @param value {String} dynamically interpreted identifier
       * @return {Boolean} returns <code>true</code> if the value is interpreted dynamically
       */
      isDynamic(value) {
        if (!value) {
          return false;
        }
        var theme = this.getTheme();
        if (!theme) {
          return false;
        }
        return !!theme.decorations[value];
      },
      /**
       * Whether the given decorator is cached
       *
       * @param decorator {String|qx.ui.decoration.IDecorator} The decorator to check
       * @return {Boolean} <code>true</code> if the decorator is cached
       * @internal
       */
      isCached(decorator) {
        return !this.__dynamic__P_108_2 ? false : qx.lang.Object.contains(this.__dynamic__P_108_2, decorator);
      },
      // property apply
      _applyTheme(value, old) {
        var aliasManager = qx.util.AliasManager.getInstance();

        // remove old rules
        this.removeAllCssClasses();
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
        this._disposeMap("__dynamic__P_108_2");
        this.__dynamic__P_108_2 = {};
      },
      /**
       * Clears internal caches and removes all previously created CSS classes.
       */
      clear() {
        // remove aliases
        var aliasManager = qx.util.AliasManager.getInstance();
        var theme = this.getTheme();
        if (!aliasManager.isDisposed() && theme && theme.alias) {
          for (var alias in theme.aliases) {
            aliasManager.remove(alias, theme.aliases[alias]);
          }
        }

        // remove old rules
        this.removeAllCssClasses();
        this._disposeMap("__dynamic__P_108_2");
        this.__dynamic__P_108_2 = {};
      },
      /**
       * Refreshes all decorator by clearing internal caches and re applying
       * aliases.
       */
      refresh() {
        this.clear();
        var aliasManager = qx.util.AliasManager.getInstance();
        var theme = this.getTheme();
        if (theme && theme.alias) {
          for (var alias in theme.aliases) {
            aliasManager.add(alias, theme.aliases[alias]);
          }
        }
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this.clear();
    }
  });
  qx.theme.manager.Decoration.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.AnimationFrame": {},
      "qx.ui.core.queue.Widget": {},
      "qx.log.Logger": {},
      "qx.ui.core.queue.Visibility": {},
      "qx.ui.core.queue.Appearance": {},
      "qx.ui.core.queue.Layout": {},
      "qx.html.Element": {
        "defer": "runtime"
      },
      "qx.ui.core.queue.Dispose": {},
      "qx.dev.StackTrace": {},
      "qx.event.Registration": {
        "defer": "runtime"
      },
      "qx.bom.client.Event": {
        "defer": "load",
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
        },
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This class performs the auto flush of all layout relevant queues.
   *
   * @require(qx.event.handler.UserAction)
   */
  qx.Class.define("qx.ui.core.queue.Manager", {
    statics: {
      /** @type {Boolean} Whether a flush was scheduled */
      __scheduled__P_109_0: false,
      /** @type {Boolean} true, if the flush should not be executed */
      __canceled__P_109_1: false,
      /** @type {Map} Internal data structure for the current job list */
      __jobs__P_109_2: {},
      /** @type {Integer} Counts how often a flush failed due to exceptions */
      __retries__P_109_3: 0,
      /** @type {Integer} Maximum number of flush retries */
      MAX_RETRIES: 10,
      /**
       * Schedule a deferred flush of all queues.
       *
       * @param job {String} The job, which should be performed. Valid values are
       *     <code>layout</code>, <code>decoration</code> and <code>element</code>.
       */
      scheduleFlush(job) {
        // Sometimes not executed in context, fix this
        var self = qx.ui.core.queue.Manager;
        self.__jobs__P_109_2[job] = true;
        if (!self.__scheduled__P_109_0) {
          self.__canceled__P_109_1 = false;
          qx.bom.AnimationFrame.request(function () {
            if (self.__canceled__P_109_1) {
              self.__canceled__P_109_1 = false;
              return;
            }
            self.flush();
          }, self);
          self.__scheduled__P_109_0 = true;
        }
      },
      /**
       * Flush all layout queues in the correct order. This function is called
       * deferred if {@link #scheduleFlush} is called.
       *
       */
      flush() {
        // Sometimes not executed in context, fix this
        var self = qx.ui.core.queue.Manager;

        // Stop when already executed
        if (self.__inFlush__P_109_4) {
          return;
        }
        self.__inFlush__P_109_4 = true;

        // Cancel timeout if called manually
        self.__canceled__P_109_1 = true;
        var jobs = self.__jobs__P_109_2;
        self.__executeAndRescheduleOnError__P_109_5(function () {
          // Process jobs
          while (jobs.visibility || jobs.widget || jobs.appearance || jobs.layout || jobs.element) {
            // No else blocks here because each flush can influence the following flushes!
            if (jobs.widget) {
              delete jobs.widget;
              {
                try {
                  qx.ui.core.queue.Widget.flush();
                } catch (e) {
                  qx.log.Logger.error(qx.ui.core.queue.Widget, "Error in the 'Widget' queue:" + e, e);
                }
              }
            }
            if (jobs.visibility) {
              delete jobs.visibility;
              {
                try {
                  qx.ui.core.queue.Visibility.flush();
                } catch (e) {
                  qx.log.Logger.error(qx.ui.core.queue.Visibility, "Error in the 'Visibility' queue:" + e, e);
                }
              }
            }
            if (jobs.appearance) {
              delete jobs.appearance;
              {
                try {
                  qx.ui.core.queue.Appearance.flush();
                } catch (e) {
                  qx.log.Logger.error(qx.ui.core.queue.Appearance, "Error in the 'Appearance' queue:" + e, e);
                }
              }
            }

            // Defer layout as long as possible
            if (jobs.widget || jobs.visibility || jobs.appearance) {
              continue;
            }
            if (jobs.layout) {
              delete jobs.layout;
              {
                try {
                  qx.ui.core.queue.Layout.flush();
                } catch (e) {
                  qx.log.Logger.error(qx.ui.core.queue.Layout, "Error in the 'Layout' queue:" + e, e);
                }
              }
            }

            // Defer element as long as possible
            if (jobs.widget || jobs.visibility || jobs.appearance || jobs.layout) {
              continue;
            }
            if (jobs.element) {
              delete jobs.element;
              qx.html.Element.flush();
            }
          }
        }, function () {
          self.__scheduled__P_109_0 = false;
        });
        self.__executeAndRescheduleOnError__P_109_5(function () {
          if (jobs.dispose) {
            delete jobs.dispose;
            {
              try {
                qx.ui.core.queue.Dispose.flush();
              } catch (e) {
                qx.log.Logger.error("Error in the 'Dispose' queue:" + e);
              }
            }
          }
        }, function () {
          // Clear flag
          self.__inFlush__P_109_4 = false;
        });

        // flush succeeded successfully. Reset retries
        self.__retries__P_109_3 = 0;
      },
      /**
       * Executes the callback code. If the callback throws an error the current
       * flush is cleaned up and rescheduled. The finally code is called after the
       * callback even if it has thrown an exception.
       *
       * @signature function(callback, finallyCode)
       * @param callback {Function} the callback function
       * @param finallyCode {Function} function to be called in the finally block
       */
      __executeAndRescheduleOnError__P_109_5: qx.core.Environment.select("qx.debug", {
        true(callback, finallyCode) {
          callback();
          finallyCode();
        },
        false(callback, finallyCode) {
          var self = qx.ui.core.queue.Manager;
          try {
            callback();
          } catch (e) {
            {
              qx.log.Logger.error("Error while layout flush: " + e + "\n" + "Stack trace: \n" + qx.dev.StackTrace.getStackTraceFromError(e));
            }
            self.__scheduled__P_109_0 = false;
            self.__inFlush__P_109_4 = false;
            self.__retries__P_109_3 += 1;
            if (self.__retries__P_109_3 <= self.MAX_RETRIES) {
              self.scheduleFlush();
            } else {
              throw new Error("Fatal Error: Flush terminated " + (self.__retries__P_109_3 - 1) + " times in a row" + " due to exceptions in user code. The application has to be reloaded!");
            }
            throw e;
          } finally {
            finallyCode();
          }
        }
      }),
      /**
       * Handler used on touch devices to prevent the queue from manipulating
       * the dom during the touch - mouse - ... event sequence. Usually, iOS
       * devices fire a click event 300ms after the touchend event. So using
       * 500ms should be a good value to be on the save side. This is necessary
       * due to the fact that the event chain is stopped if a manipulation in
       * the DOM is done.
       *
       * @param e {qx.event.type.Data} The user action data event.
       */
      __onUserAction__P_109_6(e) {
        qx.ui.core.queue.Manager.flush();
      }
    },
    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */

    defer(statics) {
      // Replace default scheduler for HTML element with local one.
      // This is quite a hack, but allows us to force other flushes
      // before the HTML element flush.
      qx.html.Element._scheduleFlush = statics.scheduleFlush;

      // Register to user action
      qx.event.Registration.addListener(window, "useraction", qx.core.Environment.get("event.touch") ? statics.__onUserAction__P_109_6 : statics.flush);
    }
  });
  qx.ui.core.queue.Manager.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.core.Assert": {},
      "qx.html.Factory": {},
      "qx.html.Serializer": {},
      "qx.lang.Array": {},
      "qx.bom.element.Attribute": {},
      "qx.html.Element": {},
      "qx.event.Registration": {},
      "qx.html.Text": {},
      "qx.data.Array": {},
      "qx.lang.Type": {},
      "qx.lang.Function": {},
      "qx.log.Logger": {},
      "qx.event.Manager": {},
      "qx.core.ObjectRegistry": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "module.objectid": {}
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
       * John Spackman (https://github.com/johnspackman)
  
  ************************************************************************ */

  /**
   * High-performance, high-level DOM element creation and management.
   *
   * Mirrors the DOM structure of Node (see also Element and Text) so to provide
   * DOM insertion and modification with advanced logic to reduce the real transactions.
   *
   * Each child itself also has got some powerful methods to control its
   * position:
   * {@link #getParent}, {@link #free},
   * {@link #insertInto}, {@link #insertBefore}, {@link #insertAfter},
   * {@link #moveTo}, {@link #moveBefore}, {@link #moveAfter},
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * NOTE:: This class used to require `qx.module.Animation` but that brings in a huge
   * list of dependencies, so the require has been moved to the `qx.application.AbstractGui`
   * class
   *
   */
  qx.Class.define("qx.html.Node", {
    extend: qx.core.Object,
    implement: [qx.core.IDisposable],
    /**
     * Creates a new Element
     *
     * @param nodeName {String} name of the node; will be a tag name for Elements, otherwise it's a reserved
     * name eg "#text"
     */
    construct(nodeName) {
      qx.core.Object.constructor.call(this);
      this._nodeName = nodeName;
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Finds the Widget for a given DOM element
       *
       * @param domElement {DOM} the DOM element
       * @return {qx.ui.core.Widget} the Widget that created the DOM element
       */
      fromDomNode(domNode) {
        {
          qx.core.Assert.assertTrue(!domNode.$$element && !domNode.$$elementObject || domNode.$$element === domNode.$$elementObject.toHashCode());
        }
        return domNode.$$elementObject;
      },
      /**
       * Converts a DOM node into a qx.html.Node, providing the existing instance if
       * there is one
       *
       * @param {Node} domNode
       * @returns {qx.html.Node}
       */
      toVirtualNode(domNode) {
        if (domNode.$$elementObject) {
          return domNode.$$elementObject;
        }
        let html = qx.html.Factory.getInstance().createElement(domNode.nodeName, domNode.attributes);
        html.useNode(domNode);
        return html;
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Controls whether the element is visible which means that a previously applied
       * CSS style of display=none gets removed and the element will inserted into the DOM,
       * when this had not already happened before.
       *
       * If the element already exists in the DOM then it will kept in DOM, but configured
       * hidden using a CSS style of display=none.
       *
       * Please note: This does not control the visibility or parent inclusion recursively.
       *
       * @type {Boolean} Whether the element should be visible in the render result
       */
      visible: {
        init: true,
        nullable: true,
        check: "Boolean",
        apply: "_applyVisible",
        event: "changeVisible"
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
        PROTECTED HELPERS/DATA
      ---------------------------------------------------------------------------
      */

      /** @type {String} the name of the node */
      _nodeName: null,
      /** @type {Node} DOM node of this object */
      _domNode: null,
      /** @type {qx.html.Element} parent element */
      _parent: null,
      /** @type {qx.core.Object} the Qooxdoo object this node is attached to */
      _qxObject: null,
      /** @type {Boolean} Whether the element should be included in the render result */
      _included: true,
      _children: null,
      _modifiedChildren: null,
      _propertyJobs: null,
      _properties: null,
      /** @type {Map} map of event handlers */
      __eventValues__P_62_0: null,
      /**
       * Connects a widget to this element, and to the DOM element in this Element.  They
       * remain associated until disposed or disconnectObject is called
       *
       * @param qxObject {qx.core.Object} the object to associate
       */
      connectObject(qxObject) {
        {
          qx.core.Assert.assertTrue(!this._qxObject || this._qxObject === qxObject);
        }
        this._qxObject = qxObject;
        if (this._domNode) {
          {
            qx.core.Assert.assertTrue(!this._domNode.$$qxObjectHash && !this._domNode.$$qxObject || this._domNode.$$qxObject === qxObject && this._domNode.$$qxObjectHash === qxObject.toHashCode());
          }
          this._domNode.$$qxObjectHash = qxObject.toHashCode();
          this._domNode.$$qxObject = qxObject;
        }
        if (qx.core.Environment.get("module.objectid")) {
          this.updateObjectId();
        }
      },
      /**
       * Disconnects a widget from this element and the DOM element.  The DOM element remains
       * untouched, except that it can no longer be used to find the Widget.
       *
       * @param qxObject {qx.core.Object} the Widget
       */
      disconnectObject(qxObject) {
        {
          qx.core.Assert.assertTrue(this._qxObject === qxObject);
        }
        delete this._qxObject;
        if (this._domNode) {
          {
            qx.core.Assert.assertTrue(!this._domNode.$$qxObjectHash && !this._domNode.$$qxObject || this._domNode.$$qxObject === qxObject && this._domNode.$$qxObjectHash === qxObject.toHashCode());
          }
          this._domNode.$$qxObjectHash = "";
          delete this._domNode.$$qxObject;
        }
        if (qx.core.Environment.get("module.objectid")) {
          this.updateObjectId();
        }
      },
      /**
       * Internal helper to generate the DOM element
       *
       * @return {Element} DOM element
       */
      _createDomElement() {
        throw new Error("No implementation for " + this.classname + "._createDomElement");
      },
      /**
       * Serializes the virtual DOM element to a string
       *
       * @param pretty {Boolean?} whether to pretty print the output. Defaults to `false`
       * @return {String} the serialised version
       */
      serialize() {
        let pretty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        let serializer = new qx.html.Serializer();
        serializer.setPrettyPrint(!!pretty);
        this._serializeImpl(serializer);
        return serializer.getOutput();
      },
      /**
       * Serializes the virtual DOM element to a writer; the `writer` function accepts
       *  an varargs, which can be joined with an empty string or streamed.
       *
       * @param serializer {qx.html.Serializer} the serializer
       */
      _serializeImpl(serializer) {
        throw new Error("No implementation for " + this.classname + ".serializeImpl");
      },
      /**
       * Uses an existing element instead of creating one. This may be interesting
       * when the DOM element is directly needed to add content etc.
       *
       * @param domNode {Node} DOM Node to reuse
       */
      useNode(domNode) {
        if (this._domNode) {
          throw new Error("Could not overwrite existing element!");
        }
        const removeAllChildren = parentElement => {
          if (parentElement._children) {
            qx.lang.Array.clone(parentElement._children).forEach(node => {
              parentElement._removeChildImpl(node);
              node._disconnectDomNode();
            });
            parentElement._children = null;
          }
        };
        const scanDomNode = (parentElement, domNode, idx) => {
          if (domNode.nodeType == window.Node.TEXT_NODE) {
            let newChild = qx.html.Factory.getInstance().createElement("#text");
            newChild._useNodeImpl(domNode);
            parentElement._addChildImpl(newChild);
            if (parentElement._children[idx]?.classname === "qx.html.Text") {
              parentElement._children[idx] = newChild;
            } else {
              parentElement._children.push(newChild);
            }
            return;
          }
          let id = domNode.getAttribute("data-qx-object-id");
          let element = null;
          if (id) {
            try {
              element = parentElement.getQxObject(id);
            } catch (ex) {
              element = null;
            }
          }
          if (!element) {
            element = qx.html.Factory.getInstance().createElement(domNode.nodeName, domNode.attributes);
          }
          if (element._parent !== parentElement) {
            parentElement._addChildImpl(element);
            parentElement._children.push(element);
          }
          element._connectDomNode(domNode);
          element._copyData(true, true);
          qx.lang.Array.fromCollection(domNode.childNodes).forEach((childDomNode, idx) => scanDomNode(element, childDomNode, idx));
          parentElement._scheduleChildrenUpdate();
        };
        removeAllChildren(this);
        this._connectDomNode(domNode);
        this._copyData(true, true);
        qx.lang.Array.fromCollection(domNode.childNodes).forEach((childDomNode, idx) => scanDomNode(this, childDomNode, idx));
        this.flush();
        this._insertChildren();
        this._scheduleChildrenUpdate();
      },
      /**
       * Connects a DOM element to this Node; if this Node is already connected to a Widget
       * then the Widget is also connected.
       *
       * @param domNode {DOM} the DOM Node to associate
       */
      _connectDomNode(domNode) {
        {
          qx.core.Assert.assertTrue(!this._domNode || this._domNode === domNode);
          qx.core.Assert.assertTrue(domNode.$$elementObject === this && domNode.$$element === this.toHashCode() || !domNode.$$elementObject && !domNode.$$element);
        }
        this._domNode = domNode;
        domNode.$$elementObject = this;
        domNode.$$element = this.toHashCode();
        if (this._qxObject) {
          domNode.$$qxObjectHash = this._qxObject.toHashCode();
          domNode.$$qxObject = this._qxObject;
        }
      },
      /**
       * Disconnects the DOM node
       */
      _disconnectDomNode() {
        if (this._domNode && this._domNode.parentElement) {
          this._domNode.parentElement.removeChild(this._domNode);
        }
        this._domNode = null;
      },
      /**
       * Detects whether the DOM node has been created and is in the document
       *
       * @return {Boolean}
       */
      isInDocument() {
        if (!this._domNode) {
          return false;
        }
        if (document.body) {
          for (var domNode = this._domNode; domNode != null; domNode = domNode.parentElement) {
            if (domNode === document.body) {
              return true;
            }
          }
        }
        return false;
      },
      /**
       * Updates the Object ID on the element to match the QxObjectId
       */
      updateObjectId() {
        // Copy Object Id
        if (qx.core.Environment.get("module.objectid")) {
          if (this._domNode) {
            qx.bom.element.Attribute.set("data-qx-object-id", this._getApplicableQxObjectId());
          }
        }
      },
      /**
       * @Override
       */
      _cascadeQxObjectIdChanges() {
        if (qx.core.Environment.get("module.objectid")) {
          this.updateObjectId();
        }
        qx.html.Node.superclass.prototype._cascadeQxObjectIdChanges.call(this);
      },
      /*
      ---------------------------------------------------------------------------
        FLUSH OBJECT
      ---------------------------------------------------------------------------
      */

      /**
       * Add the element to the global modification list.
       *
       */
      _scheduleChildrenUpdate() {
        if (this._modifiedChildren) {
          return;
        }
        if (this._domNode) {
          this._modifiedChildren = true;
          qx.html.Element._modified[this.toHashCode()] = this;
          qx.html.Element._scheduleFlush("element");
        }
      },
      /**
       * Syncs data of an HtmlElement object to the DOM.
       *
       * This is just a public wrapper around `flush`, because the scope has changed
       *
       * @deprecated {6.0} Please use `.flush()` instead
       */
      _flush() {
        this.flush();
      },
      /**
       * Syncs data of an HtmlElement object to the DOM.
       *
       */
      flush() {
        {
          if (this.DEBUG) {
            this.debug("Flush: " + this.getAttribute("id"));
          }
        }
        var length;
        var children = this._children;
        if (children) {
          length = children.length;
          var child;
          for (var i = 0; i < length; i++) {
            child = children[i];
            if (child.isVisible() && child._included && !child._domNode) {
              child.flush();
            }
          }
        }
        if (!this._domNode) {
          this._connectDomNode(this._createDomElement());
          this._copyData(false, false);
          if (children && length > 0) {
            this._insertChildren();
          }
        } else {
          this._syncData();
          if (this._modifiedChildren) {
            this._syncChildren();
          }
        }
        delete this._modifiedChildren;
      },
      /**
       * Returns this element's root flag
       *
       * @return {Boolean}
       */
      isRoot() {
        throw new Error("No implementation for " + this.classname + ".isRoot");
      },
      /**
       * Detects whether this element is inside a root element
       *
       * @return {Boolean}
       */
      isInRoot() {
        var tmp = this;
        while (tmp) {
          if (tmp.isRoot()) {
            return true;
          }
          tmp = tmp._parent;
        }
        return false;
      },
      /**
       * Walk up the internal children hierarchy and
       * look if one of the children is marked as root.
       *
       * This method is quite performance hungry as it
       * really walks up recursively.
       * @return {Boolean} <code>true</code> if the element will be seeable
       */
      _willBeSeeable() {
        if (!qx.html.Element._hasRoots) {
          return false;
        }
        var pa = this;

        // Any chance to cache this information in the parents?
        while (pa) {
          if (pa.isRoot()) {
            return true;
          }
          if (!pa._included || !pa.isVisible()) {
            return false;
          }
          pa = pa._parent;
        }
        return false;
      },
      /*
      ---------------------------------------------------------------------------
        SUPPORT FOR CHILDREN FLUSH
      ---------------------------------------------------------------------------
      */

      /**
       * Append all child nodes to the DOM
       * element. This function is used when the element is initially
       * created. After this initial apply {@link #_syncChildren} is used
       * instead.
       *
       */
      _insertChildren() {
        var children = this._children;
        if (!children) {
          return;
        }
        var length = children.length;
        var child;
        if (length > 2) {
          var domElement = document.createDocumentFragment();
          for (var i = 0; i < length; i++) {
            child = children[i];
            if (child._domNode && child._included) {
              domElement.appendChild(child._domNode);
            }
          }
          this._domNode.appendChild(domElement);
        } else {
          var domElement = this._domNode;
          for (var i = 0; i < length; i++) {
            child = children[i];
            if (child._domNode && child._included) {
              domElement.appendChild(child._domNode);
            }
          }
        }
      },
      /**
       * Synchronize internal children hierarchy to the DOM. This is used
       * for further runtime updates after the element has been created
       * initially.
       *
       */
      _syncChildren() {
        var dataChildren = this._children || [];
        var dataLength = dataChildren.length;
        var dataChild;
        var dataEl;
        var domParent = this._domNode;
        var domChildren = domParent.childNodes;
        var domPos = 0;
        var domEl;
        {
          var domOperations = 0;
        }

        // Remove children from DOM which are excluded or remove first
        for (var i = domChildren.length - 1; i >= 0; i--) {
          domEl = domChildren[i];
          dataEl = qx.html.Node.fromDomNode(domEl);
          if (!dataEl || !dataEl._included || dataEl._parent !== this) {
            domParent.removeChild(domEl);
            {
              domOperations++;
            }
          }
        }

        // Start from beginning and bring DOM in sync
        // with the data structure
        for (var i = 0; i < dataLength; i++) {
          dataChild = dataChildren[i];

          // Only process visible childs
          if (dataChild._included) {
            dataEl = dataChild._domNode;
            domEl = domChildren[domPos];
            if (!dataEl) {
              continue;
            }

            // Only do something when out of sync
            // If the data element is not there it may mean that it is still
            // marked as visible=false
            if (dataEl != domEl) {
              if (domEl) {
                domParent.insertBefore(dataEl, domEl);
              } else {
                domParent.appendChild(dataEl);
              }
              {
                domOperations++;
              }
            }

            // Increase counter
            domPos++;
          }
        }

        // User feedback
        {
          if (qx.html.Element.DEBUG) {
            this.debug("Synced DOM with " + domOperations + " operations");
          }
        }
      },
      /**
       * Copies data between the internal representation and the DOM. This
       * simply copies all the data and only works well directly after
       * element creation. After this the data must be synced using {@link #_syncData}
       *
       * @param fromMarkup {Boolean} Whether the copy should respect styles
       *   given from markup
       * @param propertiesFromDom {Boolean} whether the copy should respect the property
       *  values in the dom
       */
      _copyData(fromMarkup, propertiesFromDom) {
        var elem = this._domNode;

        // Attach events
        var data = this.__eventValues__P_62_0;
        if (data) {
          // Import listeners
          let domEvents = {};
          let manager = qx.event.Registration.getManager(elem);
          for (let id in data) {
            if (manager.findHandler(elem, data[id].type)) {
              domEvents[id] = data[id];
            }
          }
          qx.event.Registration.getManager(elem).importListeners(elem, domEvents);

          // Cleanup event map
          // Events are directly attached through event manager
          // after initial creation. This differs from the
          // handling of styles and attributes where queuing happens
          // through the complete runtime of the application.
          delete this.__eventValues__P_62_0;
        }

        // Copy properties
        if (this._properties) {
          for (var key in this._properties) {
            var prop = this._properties[key];
            if (propertiesFromDom) {
              if (prop.get) {
                prop.value = prop.get.call(this, key);
              }
            } else if (prop.value !== undefined) {
              prop.set.call(this, prop.value, key);
            }
          }
        }
      },
      /**
       * Synchronizes data between the internal representation and the DOM. This
       * is the counterpart of {@link #_copyData} and is used for further updates
       * after the element has been created.
       *
       */
      _syncData() {
        // Sync misc
        var jobs = this._propertyJobs;
        if (jobs && this._properties) {
          for (var key in jobs) {
            var prop = this._properties[key];
            if (prop.value !== undefined) {
              prop.set.call(this, prop.value, key);
            }
          }
          this._propertyJobs = null;
        }
      },
      /*
      ---------------------------------------------------------------------------
        PRIVATE HELPERS/DATA
      ---------------------------------------------------------------------------
      */

      /**
       * Internal helper for all children addition needs
       *
       * @param child {var} the element to add
       * @throws {Error} if the given element is already a child
       *     of this element
       */
      _addChildImpl(child) {
        if (child._parent === this) {
          throw new Error("Child is already in: " + child);
        }
        if (child.__root__P_62_1) {
          throw new Error("Root elements could not be inserted into other ones.");
        }

        // Remove from previous parent
        if (child._parent) {
          child._parent.remove(child);
        }

        // Convert to child of this object
        child._parent = this;

        // Prepare array
        if (!this._children) {
          this._children = [];
        }

        // Schedule children update
        if (this._domNode) {
          this._scheduleChildrenUpdate();
        }
      },
      /**
       * Internal helper for all children removal needs
       *
       * @param child {qx.html.Element} the removed element
       * @throws {Error} if the given element is not a child
       *     of this element
       */
      _removeChildImpl(child) {
        if (child._parent !== this) {
          throw new Error("Has no child: " + child);
        }

        // Schedule children update
        if (this._domNode) {
          this._scheduleChildrenUpdate();
        }

        // Remove reference to old parent
        delete child._parent;
      },
      /**
       * Internal helper for all children move needs
       *
       * @param child {qx.html.Element} the moved element
       * @throws {Error} if the given element is not a child
       *     of this element
       */
      _moveChildImpl(child) {
        if (child._parent !== this) {
          throw new Error("Has no child: " + child);
        }

        // Schedule children update
        if (this._domNode) {
          this._scheduleChildrenUpdate();
        }
      },
      /*
      ---------------------------------------------------------------------------
        CHILDREN MANAGEMENT (EXECUTED ON THE PARENT)
      ---------------------------------------------------------------------------
      */

      /**
       * Returns a copy of the internal children structure.
       *
       * Please do not modify the array in place. If you need
       * to work with the data in such a way make yourself
       * a copy of the data first.
       *
       * @return {Array} the children list
       */
      getChildren() {
        return this._children || null;
      },
      /**
       * Get a child element at the given index
       *
       * @param index {Integer} child index
       * @return {qx.html.Element|null} The child element or <code>null</code> if
       *     no child is found at that index.
       */
      getChild(index) {
        var children = this._children;
        return children && children[index] || null;
      },
      /**
       * Returns whether the element has any child nodes
       *
       * @return {Boolean} Whether the element has any child nodes
       */
      hasChildren() {
        var children = this._children;
        return children && children[0] !== undefined;
      },
      /**
       * Find the position of the given child
       *
       * @param child {qx.html.Element} the child
       * @return {Integer} returns the position. If the element
       *     is not a child <code>-1</code> will be returned.
       */
      indexOf(child) {
        var children = this._children;
        return children ? children.indexOf(child) : -1;
      },
      /**
       * Whether the given element is a child of this element.
       *
       * @param child {qx.html.Element} the child
       * @return {Boolean} Returns <code>true</code> when the given
       *    element is a child of this element.
       */
      hasChild(child) {
        var children = this._children;
        return children && children.indexOf(child) !== -1;
      },
      /**
       * Append all given children at the end of this element.
       *
       * @param varargs {qx.html.Element} elements to insert
       * @return {qx.html.Element} this object (for chaining support)
       */
      add(varargs) {
        var self = this;
        function addImpl(arr) {
          arr.forEach(function (child) {
            if (["string", "number", "boolean"].includes(typeof child)) {
              child = new qx.html.Text(`${child}`);
            } else if (child instanceof qx.data.Array || qx.lang.Type.isArray(child)) {
              addImpl(child);
            }
            if (child == null) {
              {
                console.error(`Tried to add a child of ${child} to ${self.classname}`);
              }
              child = new qx.html.Text(`[${child}]`);
            }
            self._addChildImpl(child);
            self._children.push(child);
          });
        }
        addImpl(qx.lang.Array.fromArguments(arguments));

        // Chaining support
        return this;
      },
      /**
       * Inserts a new element into this element at the given position.
       *
       * @param child {qx.html.Element} the element to insert
       * @param index {Integer} the index (starts at 0 for the
       *     first child) to insert (the index of the following
       *     children will be increased by one)
       * @return {qx.html.Element} this object (for chaining support)
       */
      addAt(child, index) {
        if (typeof child == "string") {
          child = new qx.html.Text(child);
        } else if (typeof child == "number") {
          child = new qx.html.Text("" + child);
        }
        this._addChildImpl(child);
        qx.lang.Array.insertAt(this._children, child, index);

        // Chaining support
        return this;
      },
      /**
       * Removes all given children
       *
       * @param childs {qx.html.Element} children to remove
       * @return {qx.html.Element} this object (for chaining support)
       */
      remove(childs) {
        var children = this._children;
        if (!children) {
          return this;
        }
        var self = this;
        function removeImpl(arr) {
          arr.forEach(function (child) {
            if (child instanceof qx.data.Array || qx.lang.Type.isArray(child)) {
              removeImpl(child);
            } else {
              self._removeChildImpl(child);
              qx.lang.Array.remove(children, child);
            }
          });
        }
        removeImpl(qx.lang.Array.fromArguments(arguments));

        // Chaining support
        return this;
      },
      /**
       * Removes the child at the given index
       *
       * @param index {Integer} the position of the
       *     child (starts at 0 for the first child)
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeAt(index) {
        var children = this._children;
        if (!children) {
          throw new Error("Has no children!");
        }
        var child = children[index];
        if (!child) {
          throw new Error("Has no child at this position!");
        }
        this._removeChildImpl(child);
        qx.lang.Array.removeAt(this._children, index);

        // Chaining support
        return this;
      },
      /**
       * Remove all children from this element.
       *
       * @return {qx.html.Element} A reference to this.
       */
      removeAll() {
        var children = this._children;
        if (children) {
          for (var i = 0, l = children.length; i < l; i++) {
            this._removeChildImpl(children[i]);
          }

          // Clear array
          children.length = 0;
        }

        // Chaining support
        return this;
      },
      /*
      ---------------------------------------------------------------------------
        CHILDREN MANAGEMENT (EXECUTED ON THE CHILD)
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the parent of this element.
       *
       * @return {qx.html.Element|null} The parent of this element
       */
      getParent() {
        return this._parent || null;
      },
      /**
       * Insert self into the given parent. Normally appends self to the end,
       * but optionally a position can be defined. With index <code>0</code> it
       * will be inserted at the begin.
       *
       * @param parent {qx.html.Element} The new parent of this element
       * @param index {Integer?null} Optional position
       * @return {qx.html.Element} this object (for chaining support)
       */
      insertInto(parent, index) {
        parent._addChildImpl(this);
        if (index == null) {
          parent._children.push(this);
        } else {
          qx.lang.Array.insertAt(this._children, this, index);
        }
        return this;
      },
      /**
       * Insert self before the given (related) element
       *
       * @param rel {qx.html.Element} the related element
       * @return {qx.html.Element} this object (for chaining support)
       */
      insertBefore(rel) {
        var parent = rel._parent;
        parent._addChildImpl(this);
        qx.lang.Array.insertBefore(parent._children, this, rel);
        return this;
      },
      /**
       * Insert self after the given (related) element
       *
       * @param rel {qx.html.Element} the related element
       * @return {qx.html.Element} this object (for chaining support)
       */
      insertAfter(rel) {
        var parent = rel._parent;
        parent._addChildImpl(this);
        qx.lang.Array.insertAfter(parent._children, this, rel);
        return this;
      },
      /**
       * Move self to the given index in the current parent.
       *
       * @param index {Integer} the index (starts at 0 for the first child)
       * @return {qx.html.Element} this object (for chaining support)
       * @throws {Error} when the given element is not child
       *      of this element.
       */
      moveTo(index) {
        var parent = this._parent;
        parent._moveChildImpl(this);
        var oldIndex = parent._children.indexOf(this);
        if (oldIndex === index) {
          throw new Error("Could not move to same index!");
        } else if (oldIndex < index) {
          index--;
        }
        qx.lang.Array.removeAt(parent._children, oldIndex);
        qx.lang.Array.insertAt(parent._children, this, index);
        return this;
      },
      /**
       * Move self before the given (related) child.
       *
       * @param rel {qx.html.Element} the related child
       * @return {qx.html.Element} this object (for chaining support)
       */
      moveBefore(rel) {
        var parent = this._parent;
        return this.moveTo(parent._children.indexOf(rel));
      },
      /**
       * Move self after the given (related) child.
       *
       * @param rel {qx.html.Element} the related child
       * @return {qx.html.Element} this object (for chaining support)
       */
      moveAfter(rel) {
        var parent = this._parent;
        return this.moveTo(parent._children.indexOf(rel) + 1);
      },
      /**
       * Remove self from the current parent.
       *
       * @return {qx.html.Element} this object (for chaining support)
       */
      free() {
        var parent = this._parent;
        if (!parent) {
          throw new Error("Has no parent to remove from.");
        }
        if (!parent._children) {
          return this;
        }
        parent._removeChildImpl(this);
        qx.lang.Array.remove(parent._children, this);
        return this;
      },
      /*
      ---------------------------------------------------------------------------
        DOM ELEMENT ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the DOM element (if created). Please use this with caution.
       * It is better to make all changes to the object itself using the public
       * API rather than to the underlying DOM element.
       *
       * @param create {Boolean?} if true, the DOM node will be created if it does
       * not exist
       * @return {Element|null} The DOM element node, if available.
       */
      getDomElement(create) {
        if (create && !this._domNode) {
          this.flush();
        }
        return this._domNode || null;
      },
      /**
       * Returns the nodeName of the DOM element.
       *
       * @return {String} The node name
       */
      getNodeName() {
        return this._nodeName;
      },
      /**
       * Sets the nodeName of the DOM element.
       *
       * @param name {String} The node name
       */
      setNodeName(name) {
        if (this._domNode && name.toLowerCase() !== this._nodeName.toLowerCase()) {
          throw new Error("Cannot change the name of the node after the DOM node has been created");
        }
        this._nodeName = name;
      },
      /*
      ---------------------------------------------------------------------------
        EXCLUDE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Marks the element as included which means it will be moved into
       * the DOM again and synced with the internal data representation.
       *
       * @return {Node} this object (for chaining support)
       */
      include() {
        if (this._included) {
          return this;
        }
        delete this._included;
        if (this._parent) {
          this._parent._scheduleChildrenUpdate();
        }
        return this;
      },
      /**
       * Marks the element as excluded which means it will be removed
       * from the DOM and ignored for updates until it gets included again.
       *
       * @return {qx.html.Element} this object (for chaining support)
       */
      exclude() {
        if (!this._included) {
          return this;
        }
        this._included = false;
        if (this._parent) {
          this._parent._scheduleChildrenUpdate();
        }
        return this;
      },
      /**
       * Whether the element is part of the DOM
       *
       * @return {Boolean} Whether the element is part of the DOM.
       */
      isIncluded() {
        return this._included === true;
      },
      /**
       * Apply method for visible property
       */
      _applyVisible(value) {
        // Nothing - to be overridden
      },
      /*
      ---------------------------------------------------------------------------
      PROPERTY SUPPORT
      ---------------------------------------------------------------------------
      */
      /**
       * Registers a property and the implementations used to read the property value
       * from the DOM and to set the property value onto the DOM.  This allows the element
       * to have a simple `setProperty` method that knows how to read and write the value.
       *
       * You do not have to specify a getter or a setter - by default the setter will use
       * `_applyProperty` for backwards compatibility, and there is no getter implementation.
       *
       * The functions are called with `this` set to this Element.  The getter takes
       * the property name as a parameter and is expected to return a value, the setter takes
       * the property name and value as parameters, and returns nothing.
       *
       * @param key {String} the property name
       * @param getter {Function?} function to read from the DOM
       * @param setter {Function?} function to copy to the DOM
       * @param serialize {Function?} function to serialize the value to HTML
       */
      registerProperty(key, get, set, serialize) {
        if (!this._properties) {
          this._properties = {};
        }
        if (this._properties[key]) {
          this.debug("Overridding property " + key + " in " + this + "[" + this.classname + "]");
        }
        if (!set) {
          set = qx.lang.Function.bind(function (value, key) {
            this._applyProperty(key, value);
          }, this);
          qx.log.Logger.deprecatedMethodWarning(this._applyProperty, "The method '_applyProperty' is deprecated.  Please use `registerProperty` instead (property '" + key + "' in " + this.classname + ")");
        }
        this._properties[key] = {
          get: get,
          set: set,
          serialize: serialize,
          value: undefined
        };
      },
      /**
       * Applies a special property with the given value.
       *
       * This property apply routine can be easily overwritten and
       * extended by sub classes to add new low level features which
       * are not easily possible using styles and attributes.
       *
       * Note that this implementation is for backwards compatibility and
       * implementations
       *
       * @param name {String} Unique property identifier
       * @param value {var} Any valid value (depends on the property)
       * @return {qx.html.Element} this object (for chaining support)
       * @abstract
       * @deprecated {6.0} please use `registerProperty` instead
       */
      _applyProperty(name, value) {
        // empty implementation
      },
      /**
       * Set up the given property.
       *
       * @param key {String} the name of the property
       * @param value {var} the value
       * @param direct {Boolean?false} Whether the value should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      _setProperty(key, value, direct) {
        if (!this._properties || !this._properties[key]) {
          this.registerProperty(key, null, null);
        }
        if (this._properties[key].value == value) {
          return this;
        }
        this._properties[key].value = value;
        // Uncreated elements simply copy all data
        // on creation. We don't need to remember any
        // jobs. It is a simple full list copy.
        if (this._domNode) {
          // Omit queuing in direct mode
          if (direct) {
            this._properties[key].set.call(this, value, key);
            return this;
          }

          // Dynamically create if needed
          if (!this._propertyJobs) {
            this._propertyJobs = {};
          }

          // Store job info
          this._propertyJobs[key] = true;

          // Register modification
          qx.html.Element._modified[this.toHashCode()] = this;
          qx.html.Element._scheduleFlush("element");
        }
        return this;
      },
      /**
       * Removes the given misc
       *
       * @param key {String} the name of the misc
       * @param direct {Boolean?false} Whether the value should be removed
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      _removeProperty(key, direct) {
        return this._setProperty(key, null, direct);
      },
      /**
       * Get the value of the given misc.
       *
       * @param key {String} name of the misc
       * @param direct {Boolean?false} Whether the value should be obtained directly (without queuing)
       * @return {var} the value of the misc
       */
      _getProperty(key, direct) {
        if (!this._properties || !this._properties[key]) {
          return null;
        }
        var value = this._properties[key].value;
        if (this._domNode) {
          if (direct || value === undefined) {
            var fn = this._properties[key].get;
            if (fn) {
              this._properties[key].value = value = fn.call(this, key);
            }
          }
        }
        return value === undefined ? null : value;
      },
      /*
      ---------------------------------------------------------------------------
        EVENT SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Adds an event listener to the element.
       *
       * @param type {String} Name of the event
       * @param listener {Function} Function to execute on event
       * @param self {Object ? null} Reference to the 'this' variable inside
       *         the event listener. When not given, the corresponding dispatcher
       *         usually falls back to a default, which is the target
       *         by convention. Note this is not a strict requirement, i.e.
       *         custom dispatchers can follow a different strategy.
       * @param capture {Boolean ? false} Whether capturing should be enabled
       * @return {var} An opaque id, which can be used to remove the event listener
       *         using the {@link #removeListenerById} method.
       */
      addListener(type, listener, self, capture) {
        if (this.$$disposed) {
          return null;
        }
        {
          var msg = "Failed to add event listener for type '" + type + "'" + " to the target '" + this + "': ";
          this.assertString(type, msg + "Invalid event type.");
          this.assertFunction(listener, msg + "Invalid callback function");
          if (self !== undefined) {
            this.assertObject(self, "Invalid context for callback.");
          }
          if (capture !== undefined) {
            this.assertBoolean(capture, "Invalid capture flag.");
          }
        }
        const registerDomEvent = () => {
          if (this._domNode) {
            return qx.event.Registration.addListener(this._domNode, type, listener, self, capture);
          }
          if (!this.__eventValues__P_62_0) {
            this.__eventValues__P_62_0 = {};
          }
          if (capture == null) {
            capture = false;
          }
          var unique = qx.event.Manager.getNextUniqueId();
          var id = type + (capture ? "|capture|" : "|bubble|") + unique;
          this.__eventValues__P_62_0[id] = {
            type: type,
            listener: listener,
            self: self,
            capture: capture,
            unique: unique
          };
          return id;
        };
        if (qx.Class.supportsEvent(this, type)) {
          let id = qx.html.Node.superclass.prototype.addListener.call(this, type, listener, self, capture);
          id.domEventId = registerDomEvent();
          return id;
        }
        return registerDomEvent();
      },
      /**
       * Removes an event listener from the element.
       *
       * @param type {String} Name of the event
       * @param listener {Function} Function to execute on event
       * @param self {Object} Execution context of given function
       * @param capture {Boolean ? false} Whether capturing should be enabled
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeListener(type, listener, self, capture) {
        if (this.$$disposed) {
          return null;
        }
        {
          var msg = "Failed to remove event listener for type '" + type + "'" + " from the target '" + this + "': ";
          this.assertString(type, msg + "Invalid event type.");
          this.assertFunction(listener, msg + "Invalid callback function");
          if (self !== undefined) {
            this.assertObject(self, "Invalid context for callback.");
          }
          if (capture !== undefined) {
            this.assertBoolean(capture, "Invalid capture flag.");
          }
        }
        if (qx.Class.supportsEvent(this, type)) {
          qx.html.Node.superclass.prototype.removeListener.call(this, type, listener, self, capture);
        }
        if (this._domNode) {
          if (listener.$$wrapped_callback && listener.$$wrapped_callback[type + this.toHashCode()]) {
            var callback = listener.$$wrapped_callback[type + this.toHashCode()];
            delete listener.$$wrapped_callback[type + this.toHashCode()];
            listener = callback;
          }
          qx.event.Registration.removeListener(this._domNode, type, listener, self, capture);
        } else {
          var values = this.__eventValues__P_62_0;
          var entry;
          if (capture == null) {
            capture = false;
          }
          for (var key in values) {
            entry = values[key];

            // Optimized for performance: Testing references first
            if (entry.listener === listener && entry.self === self && entry.capture === capture && entry.type === type) {
              delete values[key];
              break;
            }
          }
        }
        return this;
      },
      /**
       * Removes an event listener from an event target by an id returned by
       * {@link #addListener}
       *
       * @param id {var} The id returned by {@link #addListener}
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeListenerById(id) {
        if (this.$$disposed) {
          return null;
        }
        if (id.domEventId) {
          if (this._domNode) {
            qx.event.Registration.removeListenerById(this._domNode, id.domEventId);
          }
          delete id.domEventId;
          qx.html.Node.superclass.prototype.removeListenerById.call(this, id);
        } else {
          if (this._domNode) {
            qx.event.Registration.removeListenerById(this._domNode, id);
          } else {
            delete this.__eventValues__P_62_0[id];
          }
        }
        return this;
      },
      /**
       * Check if there are one or more listeners for an event type.
       *
       * @param type {String} name of the event type
       * @param capture {Boolean ? false} Whether to check for listeners of
       *         the bubbling or of the capturing phase.
       * @return {Boolean} Whether the object has a listener of the given type.
       */
      hasListener(type, capture) {
        if (this.$$disposed) {
          return false;
        }
        if (qx.Class.supportsEvent(this, type)) {
          let has = qx.html.Node.superclass.prototype.hasListener.call(this, type, capture);
          if (has) {
            return true;
          }
        }
        if (this._domNode) {
          if (qx.event.Registration.hasListener(this._domNode, type, capture)) {
            return true;
          }
        } else {
          var values = this.__eventValues__P_62_0;
          var entry;
          if (capture == null) {
            capture = false;
          }
          for (var key in values) {
            entry = values[key];

            // Optimized for performance: Testing fast types first
            if (entry.capture === capture && entry.type === type) {
              return true;
            }
          }
        }
        return false;
      },
      /**
       * Serializes and returns all event listeners attached to this element
       * @return {Map[]} an Array containing a map for each listener. The maps
       * have the following keys:
       * <ul>
       *   <li><code>type</code> (String): Event name</li>
       *   <li><code>handler</code> (Function): Callback function</li>
       *   <li><code>self</code> (Object): The callback's context</li>
       *   <li><code>capture</code> (Boolean): If <code>true</code>, the listener is
       * attached to the capturing phase</li>
       * </ul>
       */
      getListeners() {
        if (this.$$disposed) {
          return null;
        }
        var listeners = [];
        qx.lang.Array.append(listeners, qx.event.Registration.serializeListeners(this) || []);
        if (this._domNode) {
          qx.lang.Array.append(listeners, qx.event.Registration.serializeListeners(this._domNode) || []);
        }
        for (var id in this.__eventValues__P_62_0) {
          var listenerData = this.__eventValues__P_62_0[id];
          listeners.push({
            type: listenerData.type,
            handler: listenerData.listener,
            self: listenerData.self,
            capture: listenerData.capture
          });
        }
        return listeners;
      }
    },
    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */

    destruct() {
      var el = this._domNode;
      if (el) {
        qx.event.Registration.getManager(el).removeAllListeners(el);
        el.$$element = "";
        delete el.$$elementObject;
        el.$$qxObjectHash = "";
        delete el.$$qxObject;
      }
      if (!qx.core.ObjectRegistry.inShutDown) {
        var parent = this._parent;
        if (parent && !parent.$$disposed) {
          parent.remove(this);
        }
      }
      this._disposeArray("_children");
      this._properties = this._propertyJobs = this._domNode = this._parent = this.__eventValues__P_62_0 = null;
    }
  });
  qx.html.Node.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.bom.Style": {
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
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {}
    },
    "environment": {
      "provided": ["css.textoverflow", "css.placeholder", "css.borderradius", "css.boxshadow", "css.gradient.linear", "css.gradient.radial", "css.gradient.legacywebkit", "css.boxmodel", "css.rgba", "css.borderimage", "css.borderimage.standardsyntax", "css.usermodify", "css.userselect", "css.userselect.none", "css.appearance", "css.float", "css.boxsizing", "css.inlineblock", "css.opacity", "css.textShadow", "css.alphaimageloaderneeded", "css.pointerevents", "css.flexboxSyntax"],
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
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The purpose of this class is to contain all checks about css.
   *
   * This class is used by {@link qx.core.Environment} and should not be used
   * directly. Please check its class comment for details how to use it.
   *
   * @internal
   * @ignore(WebKitCSSMatrix)
   * @require(qx.bom.Style)
   */
  qx.Bootstrap.define("qx.bom.client.Css", {
    statics: {
      __WEBKIT_LEGACY_GRADIENT__P_74_0: null,
      /**
       * Checks what box model is used in the current environment.
       * @return {String} It either returns "content" or "border".
       * @internal
       */
      getBoxModel() {
        var content = qx.bom.client.Engine.getName() !== "mshtml" || !qx.bom.client.Browser.getQuirksMode();
        return content ? "content" : "border";
      },
      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>textOverflow</code> style property.
       *
       * @return {String|null} textOverflow property name or <code>null</code> if
       * textOverflow is not supported.
       * @internal
       */
      getTextOverflow() {
        return qx.bom.Style.getPropertyName("textOverflow");
      },
      /**
       * Checks if a placeholder could be used.
       * @return {Boolean} <code>true</code>, if it could be used.
       * @internal
       */
      getPlaceholder() {
        if (qx.core.Environment.get("engine.name") === "mshtml") {
          return false;
        }
        var i = document.createElement("input");
        return "placeholder" in i;
      },
      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>appearance</code> style property.
       *
       * @return {String|null} appearance property name or <code>null</code> if
       * appearance is not supported.
       * @internal
       */
      getAppearance() {
        return qx.bom.Style.getPropertyName("appearance");
      },
      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>borderRadius</code> style property.
       *
       * @return {String|null} borderRadius property name or <code>null</code> if
       * borderRadius is not supported.
       * @internal
       */
      getBorderRadius() {
        return qx.bom.Style.getPropertyName("borderRadius");
      },
      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>boxShadow</code> style property.
       *
       * @return {String|null} boxShadow property name or <code>null</code> if
       * boxShadow is not supported.
       * @internal
       */
      getBoxShadow() {
        return qx.bom.Style.getPropertyName("boxShadow");
      },
      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>borderImage</code> style property.
       *
       * @return {String|null} borderImage property name or <code>null</code> if
       * borderImage is not supported.
       * @internal
       */
      getBorderImage() {
        return qx.bom.Style.getPropertyName("borderImage");
      },
      /**
       * Returns the type of syntax this client supports for its CSS border-image
       * implementation. Some browsers do not support the "fill" keyword defined
       * in the W3C draft (http://www.w3.org/TR/css3-background/) and will not
       * show the border image if it's set. Others follow the standard closely and
       * will omit the center image if "fill" is not set.
       *
       * @return {Boolean|null} <code>true</code> if the standard syntax is supported.
       * <code>null</code> if the supported syntax could not be detected.
       * @internal
       */
      getBorderImageSyntax() {
        var styleName = qx.bom.client.Css.getBorderImage();
        if (!styleName) {
          return null;
        }
        var el = document.createElement("div");
        if (styleName === "borderImage") {
          // unprefixed implementation: check individual properties
          el.style[styleName] = 'url("foo.png") 4 4 4 4 fill stretch';
          if (el.style.borderImageSource.indexOf("foo.png") >= 0 && el.style.borderImageSlice.indexOf("4 fill") >= 0 && el.style.borderImageRepeat.indexOf("stretch") >= 0) {
            return true;
          }
        } else {
          // prefixed implementation, assume no support for "fill"
          el.style[styleName] = 'url("foo.png") 4 4 4 4 stretch';
          // serialized value is unreliable, so just a simple check
          if (el.style[styleName].indexOf("foo.png") >= 0) {
            return false;
          }
        }

        // unable to determine syntax
        return null;
      },
      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>userSelect</code> style property.
       *
       * @return {String|null} userSelect property name or <code>null</code> if
       * userSelect is not supported.
       * @internal
       */
      getUserSelect() {
        return qx.bom.Style.getPropertyName("userSelect");
      },
      /**
       * Returns the (possibly vendor-prefixed) value for the
       * <code>userSelect</code> style property that disables selection. For Gecko,
       * "-moz-none" is returned since "none" only makes the target element appear
       * as if its text could not be selected
       *
       * @internal
       * @return {String|null} the userSelect property value that disables
       * selection or <code>null</code> if userSelect is not supported
       */
      getUserSelectNone() {
        var styleProperty = qx.bom.client.Css.getUserSelect();
        if (styleProperty) {
          var el = document.createElement("span");
          el.style[styleProperty] = "-moz-none";
          return el.style[styleProperty] === "-moz-none" ? "-moz-none" : "none";
        }
        return null;
      },
      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>userModify</code> style property.
       *
       * @return {String|null} userModify property name or <code>null</code> if
       * userModify is not supported.
       * @internal
       */
      getUserModify() {
        return qx.bom.Style.getPropertyName("userModify");
      },
      /**
       * Returns the vendor-specific name of the <code>float</code> style property
       *
       * @return {String|null} <code>cssFloat</code> for standards-compliant
       * browsers, <code>styleFloat</code> for legacy IEs, <code>null</code> if
       * the client supports neither property.
       * @internal
       */
      getFloat() {
        var style = document.documentElement.style;
        return style.cssFloat !== undefined ? "cssFloat" : style.styleFloat !== undefined ? "styleFloat" : null;
      },
      /**
       * Returns the (possibly vendor-prefixed) name this client uses for
       * <code>linear-gradient</code>.
       * http://dev.w3.org/csswg/css3-images/#linear-gradients
       *
       * @return {String|null} Prefixed linear-gradient name or <code>null</code>
       * if linear gradients are not supported
       * @internal
       */
      getLinearGradient() {
        qx.bom.client.Css.__WEBKIT_LEGACY_GRADIENT__P_74_0 = false;
        var value = "linear-gradient(0deg, #fff, #000)";
        var el = document.createElement("div");
        var style = qx.bom.Style.getAppliedStyle(el, "backgroundImage", value);
        if (!style) {
          //try old WebKit syntax (versions 528 - 534.16)
          value = "-webkit-gradient(linear,0% 0%,100% 100%,from(white), to(red))";
          var style = qx.bom.Style.getAppliedStyle(el, "backgroundImage", value, false);
          if (style) {
            qx.bom.client.Css.__WEBKIT_LEGACY_GRADIENT__P_74_0 = true;
          }
        }

        // not supported
        if (!style) {
          return null;
        }
        var match = /(.*?)\(/.exec(style);
        return match ? match[1] : null;
      },
      /**
       * Returns the (possibly vendor-prefixed) name this client uses for
       * <code>radial-gradient</code>.
       *
       * @return {String|null} Prefixed radial-gradient name or <code>null</code>
       * if radial gradients are not supported
       * @internal
       */
      getRadialGradient() {
        var value = "radial-gradient(0px 0px, cover, red 50%, blue 100%)";
        var el = document.createElement("div");
        var style = qx.bom.Style.getAppliedStyle(el, "backgroundImage", value);
        if (!style) {
          return null;
        }
        var match = /(.*?)\(/.exec(style);
        return match ? match[1] : null;
      },
      /**
       * Checks if **only** the old WebKit (version < 534.16) syntax for
       * linear gradients is supported, e.g.
       * <code>linear-gradient(0deg, #fff, #000)</code>
       *
       * @return {Boolean} <code>true</code> if the legacy syntax must be used
       * @internal
       */
      getLegacyWebkitGradient() {
        if (qx.bom.client.Css.__WEBKIT_LEGACY_GRADIENT__P_74_0 === null) {
          qx.bom.client.Css.getLinearGradient();
        }
        return qx.bom.client.Css.__WEBKIT_LEGACY_GRADIENT__P_74_0;
      },
      /**
       * Checks if rgba colors can be used:
       * http://www.w3.org/TR/2010/PR-css3-color-20101028/#rgba-color
       *
       * @return {Boolean} <code>true</code>, if rgba colors are supported.
       * @internal
       */
      getRgba() {
        var el;
        try {
          el = document.createElement("div");
        } catch (ex) {
          el = document.createElement();
        }

        // try catch for IE
        try {
          el.style["color"] = "rgba(1, 2, 3, 0.5)";
          if (el.style["color"].indexOf("rgba") != -1) {
            return true;
          }
        } catch (ex) {}
        return false;
      },
      /**
       * Returns the (possibly vendor-prefixed) name the browser uses for the
       * <code>boxSizing</code> style property.
       *
       * @return {String|null} boxSizing property name or <code>null</code> if
       * boxSizing is not supported.
       * @internal
       */
      getBoxSizing() {
        return qx.bom.Style.getPropertyName("boxSizing");
      },
      /**
       * Returns the browser-specific name used for the <code>display</code> style
       * property's <code>inline-block</code> value.
       *
       * @internal
       * @return {String|null}
       */
      getInlineBlock() {
        var el = document.createElement("span");
        el.style.display = "inline-block";
        if (el.style.display == "inline-block") {
          return "inline-block";
        }
        el.style.display = "-moz-inline-box";
        if (el.style.display !== "-moz-inline-box") {
          return "-moz-inline-box";
        }
        return null;
      },
      /**
       * Checks if CSS opacity is supported
       *
       * @internal
       * @return {Boolean} <code>true</code> if opacity is supported
       */
      getOpacity() {
        return typeof document.documentElement.style.opacity == "string";
      },
      /**
       * Checks if CSS texShadow is supported
       *
       * @internal
       * @return {Boolean} <code>true</code> if textShadow is supported
       */
      getTextShadow() {
        return !!qx.bom.Style.getPropertyName("textShadow");
      },
      /**
       * Checks if the Alpha Image Loader must be used to display transparent PNGs.
       *
       * @return {Boolean} <code>true</code> if the Alpha Image Loader is required
       */
      getAlphaImageLoaderNeeded() {
        return qx.bom.client.Engine.getName() == "mshtml" && qx.bom.client.Browser.getDocumentMode() < 9;
      },
      /**
       * Checks if pointer events are available.
       *
       * @internal
       * @return {Boolean} <code>true</code> if pointer events are supported.
       */
      getPointerEvents() {
        var el = document.documentElement;
        // Check if browser reports that pointerEvents is a known style property
        if ("pointerEvents" in el.style) {
          // The property is defined in Opera and IE9 but setting it has no effect
          var initial = el.style.pointerEvents;
          el.style.pointerEvents = "auto";
          // don't assume support if a nonsensical value isn't ignored
          el.style.pointerEvents = "foo";
          var supported = el.style.pointerEvents == "auto";
          el.style.pointerEvents = initial;
          return supported;
        }
        return false;
      },
      /**
       * Returns which Flexbox syntax is supported by the browser.
       * <code>display: box;</code> old 2009 version of Flexbox.
       * <code>display: flexbox;</code> tweener phase in 2011.
       * <code>display: flex;</code> current specification.
       * @internal
       * @return {String} <code>flex</code>,<code>flexbox</code>,<code>box</code> or <code>null</code>
       */
      getFlexboxSyntax() {
        var detectedSyntax = null;
        var detector = document.createElement("detect");
        var flexSyntax = [{
          value: "flex",
          syntax: "flex"
        }, {
          value: "-ms-flexbox",
          syntax: "flexbox"
        }, {
          value: "-webkit-flex",
          syntax: "flex"
        }];
        for (var i = 0; i < flexSyntax.length; i++) {
          // old IEs will throw an "Invalid argument" exception here
          try {
            detector.style.display = flexSyntax[i].value;
          } catch (ex) {
            return null;
          }
          if (detector.style.display === flexSyntax[i].value) {
            detectedSyntax = flexSyntax[i].syntax;
            break;
          }
        }
        detector = null;
        return detectedSyntax;
      }
    },
    defer(statics) {
      qx.core.Environment.add("css.textoverflow", statics.getTextOverflow);
      qx.core.Environment.add("css.placeholder", statics.getPlaceholder);
      qx.core.Environment.add("css.borderradius", statics.getBorderRadius);
      qx.core.Environment.add("css.boxshadow", statics.getBoxShadow);
      qx.core.Environment.add("css.gradient.linear", statics.getLinearGradient);
      qx.core.Environment.add("css.gradient.radial", statics.getRadialGradient);
      qx.core.Environment.add("css.gradient.legacywebkit", statics.getLegacyWebkitGradient);
      qx.core.Environment.add("css.boxmodel", statics.getBoxModel);
      qx.core.Environment.add("css.rgba", statics.getRgba);
      qx.core.Environment.add("css.borderimage", statics.getBorderImage);
      qx.core.Environment.add("css.borderimage.standardsyntax", statics.getBorderImageSyntax);
      qx.core.Environment.add("css.usermodify", statics.getUserModify);
      qx.core.Environment.add("css.userselect", statics.getUserSelect);
      qx.core.Environment.add("css.userselect.none", statics.getUserSelectNone);
      qx.core.Environment.add("css.appearance", statics.getAppearance);
      qx.core.Environment.add("css.float", statics.getFloat);
      qx.core.Environment.add("css.boxsizing", statics.getBoxSizing);
      qx.core.Environment.add("css.inlineblock", statics.getInlineBlock);
      qx.core.Environment.add("css.opacity", statics.getOpacity);
      qx.core.Environment.add("css.textShadow", statics.getTextShadow);
      qx.core.Environment.add("css.alphaimageloaderneeded", statics.getAlphaImageLoaderNeeded);
      qx.core.Environment.add("css.pointerevents", statics.getPointerEvents);
      qx.core.Environment.add("css.flexboxSyntax", statics.getFlexboxSyntax);
    }
  });
  qx.bom.client.Css.$$dbClassInfo = $$dbClassInfo;
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
      "qx.html.Node": {
        "construct": true,
        "require": true
      },
      "qx.log.Logger": {},
      "qx.bom.Element": {},
      "qx.dom.Hierarchy": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.element.Scroll": {},
      "qx.bom.Selection": {},
      "qx.event.handler.Appear": {},
      "qx.event.Registration": {},
      "qx.event.handler.Focus": {},
      "qx.event.dispatch.MouseCapture": {},
      "qx.dom.Element": {},
      "qx.bom.element.Attribute": {},
      "qx.lang.Object": {},
      "qx.bom.element.Style": {},
      "qx.core.Id": {},
      "qx.html.Slot": {},
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.lang.Array": {},
      "qx.html.Text": {},
      "qx.bom.element.Location": {},
      "qx.bom.element.Dimension": {},
      "qx.util.DeferredCall": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "module.objectid": {},
        "css.userselect": {
          "className": "qx.bom.client.Css"
        },
        "css.userselect.none": {
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
  
  ************************************************************************ */

  /**
   * High-performance, high-level DOM element creation and management.
   *
   * Includes support for HTML and style attributes. Elements also have
   * got a powerful children and visibility management.
   *
   * Processes DOM insertion and modification with advanced logic
   * to reduce the real transactions.
   *
   * From the view of the parent you can use the following children management
   * methods:
   * {@link #getChildren}, {@link #indexOf}, {@link #hasChild}, {@link #add},
   * {@link #addAt}, {@link #remove}, {@link #removeAt}, {@link #removeAll}
   *
   * Each child itself also has got some powerful methods to control its
   * position:
   * {@link #getParent}, {@link #free},
   * {@link #insertInto}, {@link #insertBefore}, {@link #insertAfter},
   * {@link #moveTo}, {@link #moveBefore}, {@link #moveAfter},
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * NOTE:: This class used to require `qx.module.Animation` but that brings in a huge
   * list of dependencies, so the require has been moved to the `qx.application.AbstractGui`
   * class
   */
  qx.Class.define("qx.html.Element", {
    extend: qx.html.Node,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Creates a new Element
     *
     * @param tagName {String?"div"} Tag name of the element to create
     * @param styles {Map?null} optional map of CSS styles, where the key is the name
     *    of the style and the value is the value to use.
     * @param attributes {Map?null} optional map of element attributes, where the
     *    key is the name of the attribute and the value is the value to use.
     */
    construct(tagName, styles, attributes) {
      qx.html.Node.constructor.call(this, tagName || "div");
      this.__styleValues__P_24_0 = styles || null;
      this.__attribValues__P_24_1 = attributes || null;
      this.__slots__P_24_2 = new Map();
      if (attributes) {
        for (var key in attributes) {
          if (!key) {
            throw new Error("Invalid unnamed attribute in " + this.classname);
          }
        }
      }
      this.initCssClass();
      this.registerProperty("innerHtml", null, function (value) {
        if (this._domNode) {
          this._domNode.innerHTML = value;
        }
      }, (serializer, property, name) => {
        serializer.rawTextInBody(property.value);
      });
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /*
      ---------------------------------------------------------------------------
        STATIC DATA
      ---------------------------------------------------------------------------
      */

      /** @type {Boolean} If debugging should be enabled */
      DEBUG: false,
      /** @type {Integer} number of roots */
      _hasRoots: 0,
      /** @type {Element} the default root to use */
      _defaultRoot: null,
      /** @type {Map} Contains the modified {@link qx.html.Element}s. The key is the hash code. */
      _modified: {},
      /** @type {Map} Contains the {@link qx.html.Element}s which should get hidden or visible at the next flush. The key is the hash code. */
      _visibility: {},
      /** @type {Map} Contains the {@link qx.html.Element}s which should scrolled at the next flush */
      _scroll: {},
      /** @type {Array} List of post actions for elements. The key is the action name. The value the {@link qx.html.Element}. */
      _actions: [],
      /**  @type {Map} List of all selections. */
      __selection__P_24_3: {},
      __focusHandler__P_24_4: null,
      __mouseCapture__P_24_5: null,
      /*
      ---------------------------------------------------------------------------
        PUBLIC ELEMENT FLUSH
      ---------------------------------------------------------------------------
      */

      /**
       * Schedule a deferred element queue flush. If the widget subsystem is used
       * this method gets overwritten by {@link qx.ui.core.queue.Manager}.
       *
       * @param job {String} The job descriptor. Should always be <code>"element"</code>.
       */
      _scheduleFlush(job) {
        qx.html.Element.__deferredCall__P_24_6.schedule();
      },
      /**
       * Flush the global modified list
       */
      flush() {
        var obj;
        {
          if (this.DEBUG) {
            qx.log.Logger.debug(this, "Flushing elements...");
          }
        }
        {
          // blur elements, which will be removed
          var focusHandler = this.__getFocusHandler__P_24_7();
          var focusedDomElement = focusHandler.getFocus();
          if (focusedDomElement && this.__willBecomeInvisible__P_24_8(focusedDomElement)) {
            focusHandler.blur(focusedDomElement);
          }

          // deactivate elements, which will be removed
          var activeDomElement = focusHandler.getActive();
          if (activeDomElement && this.__willBecomeInvisible__P_24_8(activeDomElement)) {
            qx.bom.Element.deactivate(activeDomElement);
          }

          // release capture for elements, which will be removed
          var captureDomElement = this.__getCaptureElement__P_24_9();
          if (captureDomElement && this.__willBecomeInvisible__P_24_8(captureDomElement)) {
            qx.bom.Element.releaseCapture(captureDomElement);
          }
        }
        var later = [];
        var modified = qx.html.Element._modified;
        for (var hc in modified) {
          obj = modified[hc];
          // Ignore all hidden elements except iframes
          // but keep them until they get visible (again)
          if (obj._willBeSeeable() || obj.classname == "qx.html.Iframe") {
            // Separately queue rendered elements
            if (obj._domNode && qx.dom.Hierarchy.isRendered(obj._domNode)) {
              later.push(obj);
            }

            // Flush invisible elements first
            else {
              {
                if (this.DEBUG) {
                  obj.debug("Flush invisible element");
                }
              }
              obj.flush();
            }

            // Cleanup modification list
            delete modified[hc];
          }
        }
        for (var i = 0, l = later.length; i < l; i++) {
          obj = later[i];
          {
            if (this.DEBUG) {
              obj.debug("Flush rendered element");
            }
          }
          obj.flush();
        }

        // Process visibility list
        var visibility = this._visibility;
        for (var hc in visibility) {
          obj = visibility[hc];
          var element = obj._domNode;
          if (!element) {
            delete visibility[hc];
            continue;
          }
          {
            if (this.DEBUG) {
              qx.log.Logger.debug(this, "Switching visibility to: " + obj.isVisible());
            }
          }

          // hiding or showing an object and deleting it right after that may
          // cause an disposed object in the visibility queue [BUG #3607]
          if (!obj.$$disposed) {
            element.style.display = obj.isVisible() ? "" : "none";
            // also hide the element (fixed some rendering problem in IE<8 & IE8 quirks)
            if (qx.core.Environment.get("engine.name") == "mshtml") {
              if (!(document.documentMode >= 8)) {
                element.style.visibility = obj.isVisible() ? "visible" : "hidden";
              }
            }
          }
          delete visibility[hc];
        }
        {
          // Process scroll list
          var scroll = this._scroll;
          for (var hc in scroll) {
            obj = scroll[hc];
            var elem = obj._domNode;
            if (elem && elem.offsetWidth) {
              var done = true;

              // ScrollToX
              if (obj.__lazyScrollX__P_24_10 != null) {
                obj._domNode.scrollLeft = obj.__lazyScrollX__P_24_10;
                delete obj.__lazyScrollX__P_24_10;
              }

              // ScrollToY
              if (obj.__lazyScrollY__P_24_11 != null) {
                obj._domNode.scrollTop = obj.__lazyScrollY__P_24_11;
                delete obj.__lazyScrollY__P_24_11;
              }

              // ScrollIntoViewX
              var intoViewX = obj.__lazyScrollIntoViewX__P_24_12;
              if (intoViewX != null) {
                var child = intoViewX.element.getDomElement();
                if (child && child.offsetWidth) {
                  qx.bom.element.Scroll.intoViewX(child, elem, intoViewX.align);
                  delete obj.__lazyScrollIntoViewX__P_24_12;
                } else {
                  done = false;
                }
              }

              // ScrollIntoViewY
              var intoViewY = obj.__lazyScrollIntoViewY__P_24_13;
              if (intoViewY != null) {
                var child = intoViewY.element.getDomElement();
                if (child && child.offsetWidth) {
                  qx.bom.element.Scroll.intoViewY(child, elem, intoViewY.align);
                  delete obj.__lazyScrollIntoViewY__P_24_13;
                } else {
                  done = false;
                }
              }

              // Clear flag if all things are done
              // Otherwise wait for the next flush
              if (done) {
                delete scroll[hc];
              }
            }
          }
          var activityEndActions = {
            releaseCapture: 1,
            blur: 1,
            deactivate: 1
          };

          // Process action list
          for (var i = 0; i < this._actions.length; i++) {
            var action = this._actions[i];
            var element = action.element._domNode;
            if (!element || !activityEndActions[action.type] && !action.element._willBeSeeable()) {
              continue;
            }
            var args = action.args;
            args.unshift(element);
            qx.bom.Element[action.type].apply(qx.bom.Element, args);
          }
          this._actions = [];
        }

        // Process selection
        for (var hc in this.__selection__P_24_3) {
          var selection = this.__selection__P_24_3[hc];
          var elem = selection.element._domNode;
          if (elem) {
            qx.bom.Selection.set(elem, selection.start, selection.end);
            delete this.__selection__P_24_3[hc];
          }
        }

        // Fire appear/disappear events
        qx.event.handler.Appear.refresh();
      },
      /**
       * Get the focus handler
       *
       * @return {qx.event.handler.Focus} The focus handler
       */
      __getFocusHandler__P_24_7() {
        {
          if (!this.__focusHandler__P_24_4) {
            var eventManager = qx.event.Registration.getManager(window);
            this.__focusHandler__P_24_4 = eventManager.getHandler(qx.event.handler.Focus);
          }
          return this.__focusHandler__P_24_4;
        }
      },
      /**
       * Get the mouse capture element
       *
       * @return {Element} The mouse capture DOM element
       */
      __getCaptureElement__P_24_9() {
        {
          if (!this.__mouseCapture__P_24_5) {
            var eventManager = qx.event.Registration.getManager(window);
            this.__mouseCapture__P_24_5 = eventManager.getDispatcher(qx.event.dispatch.MouseCapture);
          }
          return this.__mouseCapture__P_24_5.getCaptureElement();
        }
      },
      /**
       * Whether the given DOM element will become invisible after the flush
       *
       * @param domElement {Element} The DOM element to check
       * @return {Boolean} Whether the element will become invisible
       */
      __willBecomeInvisible__P_24_8(domElement) {
        var element = this.fromDomElement(domElement);
        return element && !element._willBeSeeable();
      },
      /**
       * Finds the Widget for a given DOM element
       *
       * @param domElement {Node} the DOM element
       * @return {qx.ui.core.Widget} the Widget that created the DOM element
       * @deprecated {6.1} see qx.html.Node.fromDomNode
       */
      fromDomElement(domElement) {
        return qx.html.Node.fromDomNode(domElement);
      },
      /**
       * Sets the default Root element
       *
       * @param root {Element} the new default root
       */
      setDefaultRoot(root) {
        {
          if (this._defaultRoot && root) {
            qx.log.Logger.warn(qx.html.Element, "Changing default root, from " + this._defaultRoot + " to " + root);
          }
        }
        this._defaultRoot = root;
      },
      /**
       * Returns the default root
       *
       * @return {Element} the default root
       */
      getDefaultRoot() {
        return this._defaultRoot;
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * @type{String} The primary CSS class for this element
       *
       * The implementation will add and remove this class from the list of classes,
       * this property is provided as a means to easily set the primary class.  Because
       * SCSS supports inheritance, it's more useful to be able to allow the SCSS
       * definition to control the inheritance hierarchy of classes.
       *
       * For example, a dialog could be implemented in code as a Dialog class derived from
       * a Window class, but the presentation may be so different that the theme author
       * would choose to not use inheritance at all.
       */
      cssClass: {
        init: null,
        nullable: true,
        check: "String",
        apply: "_applyCssClass"
      },
      /**
       * Used by the {@link qx.html.Slot}-related mechanisms to determine if an
       * element is the top-level of a custom tag function.
       */
      isCustomElement: {
        init: false,
        check: "Boolean",
        apply: "_applyIsCustomElement"
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
        PROTECTED HELPERS/DATA
      ---------------------------------------------------------------------------
      */

      /** @type {Boolean} Marker for always visible root nodes (often the body node) */
      __root__P_24_14: false,
      __lazyScrollIntoViewX__P_24_12: null,
      __lazyScrollIntoViewY__P_24_13: null,
      __lazyScrollX__P_24_10: null,
      __lazyScrollY__P_24_11: null,
      __styleJobs__P_24_15: null,
      __attribJobs__P_24_16: null,
      __styleValues__P_24_0: null,
      __attribValues__P_24_1: null,
      /**
       * This is a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map},
       * not a POJO
       * @type {Map<string, qx.html.Slot>}
       */
      __slots__P_24_2: null,
      /*
       * @Override
       */
      _createDomElement() {
        return qx.dom.Element.create(this._nodeName);
      },
      /*
       * @Override
       */
      _serializeImpl(serializer) {
        serializer.openTag(this._nodeName);
        serializer.pushQxObject(this);

        // Copy attributes
        if (this.__attribValues__P_24_1) {
          for (var key in this.__attribValues__P_24_1) {
            let result = qx.bom.element.Attribute.serialize(key, this.__attribValues__P_24_1[key]);
            for (let key in result) {
              if (key != "data-qx-object-id") {
                serializer.setAttribute(key, result[key]);
              }
            }
          }
        }
        let id = serializer.getQxObjectIdFor(this);
        if (id) {
          serializer.setAttribute("data-qx-object-id", `"${id}"`);
        }

        // Copy styles
        var data = this.__styleValues__P_24_0 || {};
        if (!this.isVisible()) {
          data = qx.lang.Object.clone(data);
          data.display = "none";
        }
        if (Object.keys(data).length) {
          var Style = qx.bom.element.Style;
          var css = Style.compile(data);
          if (css) {
            serializer.setAttribute("style", `"${css}"`);
          }
        }

        // Copy properties
        var data = this._properties;
        if (data) {
          for (var key in this._properties) {
            let property = this._properties[key];
            if (property.serialize) {
              property.serialize.call(this, serializer, key, property);
            } else if (property.value !== undefined && property.value !== null) {
              let value = JSON.stringify(property.value);
              serializer.setAttribute(key, value);
            }
          }
        }

        // Children
        if (this._children) {
          for (var i = 0; i < this._children.length; i++) {
            this._children[i]._serializeImpl(serializer);
          }
        }
        serializer.closeTag();
        serializer.popQxObject(this);
      },
      /**
       * Connects a widget to this element, and to the DOM element in this Element.  They
       * remain associated until disposed or disconnectWidget is called
       *
       * @param widget {qx.ui.core.Widget} the widget to associate
       * @deprecated {6.1} see connectObject
       */
      connectWidget(widget) {
        return this.connectObject(widget);
      },
      /**
       * Disconnects a widget from this element and the DOM element.  The DOM element remains
       * untouched, except that it can no longer be used to find the Widget.
       *
       * @param qxObject {qx.core.Object} the Widget
       * @deprecated {6.1} see disconnectObject
       */
      disconnectWidget(widget) {
        return this.disconnectObject(widget);
      },
      /*
       * @Override
       */
      _addChildImpl(child) {
        if (this.getIsCustomElement()) {
          throw new Error(`Cannot add children to Custom Elements! (use ${this.classname}.inject and <slot> tags instead)`);
        }
        qx.html.Element.superclass.prototype._addChildImpl.call(this, child);
        this.__childrenHaveChanged__P_24_17 = true;
      },
      /*
       * @Override
       */
      _removeChildImpl(child) {
        if (this.getIsCustomElement()) {
          throw new Error(`Cannot remove children from Custom Elements!`);
        }
        qx.html.Element.superclass.prototype._removeChildImpl.call(this, child);
        this.__childrenHaveChanged__P_24_17 = true;
      },
      /**
       * Works out the object ID to use on an actual DOM node
       *
       * @returns {String}
       */
      _getApplicableQxObjectId() {
        if (qx.core.Environment.get("module.objectid")) {
          let target = this.getQxObjectId() ? this : this._qxObject;
          let id = target ? qx.core.Id.getAbsoluteIdOf(target, true) : null;
          return id;
        } else {
          throw new Error("Cannot get qxObjectId because module.objectid is false");
        }
      },
      /*
      ---------------------------------------------------------------------------
        SLOTS API
      ---------------------------------------------------------------------------
      */

      /**
       * Retrieve the slots this element contains.
       * The Map returned is a copy of the internal Map, as such modifications to
       * it will not effect the element.
       * @returns {Map<string, qx.html.Slot>} A `Map` of slots, keyed by slot name. The default slot, if it exists, is keyed as `qx.html.Slot.DEFAULT`
       */
      getSlots() {
        if (!this.getIsCustomElement()) {
          return null;
        }
        return new Map(this.__slots__P_24_2);
      },
      /**
       * Returns whether the element has slot(s) matching the given projection.
       *
       * @param projection {true | String?} `true` to check for the default slot, a string to check for a slot with the given name, or `null|undefined` to check for any slot(s)
       * @return {Boolean} Indicates whether the projected slot exists, or if any slots exist if no projection was specified
       * @example
       * ```js
       * myNode.hasSlots();             // `true` if there are any slots                 `false` if there are none
       * myNode.hasSlots(true);         // `true` if there is a default (unnamed) slot   `false` if there is not
       * myNode.hasSlots("mySlotName"); // `true` if there is a slot named `mySlotName`  `false` if there is not
       * ```
       */
      hasSlots(projection) {
        if (projection === null || projection === undefined) {
          return this.__slots__P_24_2.size > 0;
        }
        if (projection === true || projection === qx.html.Slot.DEFAULT) {
          return this.__slots__P_24_2.has(qx.html.Slot.DEFAULT);
        }
        if (typeof projection === "string") {
          return this.__slots__P_24_2.has(projection);
        }
        throw new Error(`Cannot lookup slot for projection: ${JSON.stringify(projection)} ! (expected: string, true, or null/undefined)`);
      },
      /**
       * Provides devtime debugging assistance for invalid slot usage.
       * @return {Boolean} `false` if no such slot, `true` otherwise
       */
      __injectionSlotCheck__P_24_18(slotName) {
        if (!this.hasSlots(slotName)) {
          {
            const what = slotName === qx.html.Slot.DEFAULT ? "default slot" : `slot named "${slotName}"`;
            const slotsList = Array.from(this.__slots__P_24_2.keys()).join(", ").replace(qx.html.Slot.DEFAULT, "(default)");
            console.warn(`No ${what} found! Available slots are: ${slotsList}`);
          }
          return false;
        }
        return true;
      },
      /**
       * Inject a child into a slot descendant of this element.
       *
       * @param childNode {qx.html.Element} element to insert. Use a fragment to inject many elements.
       * @param slotNameOverride {String?} name of the slot to inject into. If not provided, the slot name will be read from the `slot` attribute of `childNode`. This may be useful when injecting fragments.
       * @return {this} this object (for chaining support)
       *
       * @example
       * ```js
       * myElem.inject(<p>Hello World</p>);                   // inject one child to the default slot
       * myElem.inject(<p slot="mySlotName">Hello World</p>); // inject one child to the slot named "mySlotName" (declarative syntax)
       * myElem.inject(<p>Hello World</p>, "mySlotName");     // inject one child to the slot named "mySlotName" (functional syntax)
       * myElem.inject((
       *   <>
       *     <p>Hello World</p>
       *     <p>Hello Qooxdoo</p>
       *   </>
       * ), "mySlotName");                                    // inject a fragment of children to the slot named "mySlotName"
       *
       * ```
       */
      inject(childNode, slotNameOverride) {
        const slotName = childNode.getAttribute?.("slot") ?? slotNameOverride ?? qx.html.Slot.DEFAULT;
        if (!this.__injectionSlotCheck__P_24_18(slotName)) {
          return;
        }
        this.__slots__P_24_2.get(slotName).add(childNode);

        // Chaining support
        return this;
      },
      __slotScan__P_24_19(element) {
        // recursively iterate children. if any are instanceof qx.html.Slot, append to local slots, if any are `.getIscustomElement() === true`, do not look at their children
        const slots = [];
        if (element.getIsCustomElement?.()) {
          return slots;
        }
        if (element instanceof qx.html.Slot) {
          slots.push(element);
        }
        element.getChildren()?.forEach(child => slots.push(...this.__slotScan__P_24_19(child)));
        return slots;
      },
      _slotScanAdd(element) {
        for (const slot of this.__slotScan__P_24_19(element)) {
          this.__slots__P_24_2.set(slot.getName(), slot);
        }
      },
      _slotScanRemove(child) {
        for (const slot of this.__slotScan__P_24_19(child)) {
          this.__slots__P_24_2.delete(slot.getName());
        }
      },
      /*
      ---------------------------------------------------------------------------
        SUPPORT FOR ATTRIBUTE/STYLE/EVENT FLUSH
      ---------------------------------------------------------------------------
      */

      /**
       * Copies data between the internal representation and the DOM. This
       * simply copies all the data and only works well directly after
       * element creation. After this the data must be synced using {@link #_syncData}
       *
       * @param fromMarkup {Boolean} Whether the copy should respect styles
       *   given from markup
       */
      _copyData(fromMarkup, propertiesFromDom) {
        qx.html.Element.superclass.prototype._copyData.call(this, fromMarkup, propertiesFromDom);
        var elem = this._domNode;

        // Copy attributes
        var data = this.__attribValues__P_24_1;
        var Attribute = qx.bom.element.Attribute;
        if (data) {
          if (fromMarkup) {
            var str;
            let classes = {};
            str = this.getAttribute("class");
            (str ? str.split(" ") : []).forEach(name => {
              if (name.startsWith("qx-")) {
                classes[name] = true;
              }
            });
            str = Attribute.get(elem, "class");
            {
              if (str instanceof window.SVGAnimatedString) {
                str = str.baseVal;
              }
            }
            (str ? str.split(" ") : []).forEach(name => classes[name] = true);
            classes = Object.keys(classes);
            var segs = classes;
            if (segs.length) {
              this.setCssClass(segs[0]);
              this.setAttribute("class", classes.join(" "));
            } else {
              this.setCssClass(null);
              this.setAttribute("class", null);
            }
          }
          for (var key in data) {
            Attribute.set(elem, key, data[key]);
          }
        }
        Attribute.set(elem, "data-qx-object-id", this._getApplicableQxObjectId());

        // Copy styles
        var data = this.__styleValues__P_24_0;
        if (data) {
          var Style = qx.bom.element.Style;
          if (fromMarkup) {
            Style.setStyles(elem, data);
          } else {
            // Set styles at once which is a lot faster in most browsers
            // compared to separate modifications of many single style properties.
            Style.setCss(elem, Style.compile(data));
          }
        }

        // Copy visibility
        if (!fromMarkup) {
          var display = elem.style.display || "";
          if (display == "" && !this.isVisible()) {
            elem.style.display = "none";
          } else if (display == "none" && this.isVisible()) {
            elem.style.display = "";
          }
        } else {
          var display = elem.style.display || "";
          this.setVisible(display != "none");
        }
      },
      /**
       * Synchronizes data between the internal representation and the DOM. This
       * is the counterpart of {@link #_copyData} and is used for further updates
       * after the element has been created.
       *
       */
      _syncData() {
        qx.html.Element.superclass.prototype._syncData.call(this);
        var elem = this._domNode;
        var Attribute = qx.bom.element.Attribute;
        var Style = qx.bom.element.Style;

        // Sync attributes
        var jobs = this.__attribJobs__P_24_16;
        if (jobs) {
          var data = this.__attribValues__P_24_1;
          if (data) {
            var value;
            for (var key in jobs) {
              value = data[key];
              if (value !== undefined) {
                Attribute.set(elem, key, value);
              } else {
                Attribute.reset(elem, key);
              }
            }
          }
          this.__attribJobs__P_24_16 = null;
        }

        // Sync styles
        var jobs = this.__styleJobs__P_24_15;
        if (jobs) {
          var data = this.__styleValues__P_24_0;
          if (data) {
            var styles = {};
            for (var key in jobs) {
              styles[key] = data[key];
            }
            Style.setStyles(elem, styles);
          }
          this.__styleJobs__P_24_15 = null;
        }
      },
      /*
      ---------------------------------------------------------------------------
        DOM ELEMENT ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the element's root flag, which indicates
       * whether the element should be a root element or not.
       * @param root {Boolean} The root flag.
       */
      setRoot(root) {
        if (root && !this.__root__P_24_14) {
          qx.html.Element._hasRoots++;
        } else if (!root && this.__root__P_24_14) {
          qx.html.Element._hasRoots--;
        }
        this.__root__P_24_14 = root;
      },
      /*
       * @Override
       */
      isRoot() {
        return this.__root__P_24_14;
      },
      /**
       * Uses existing markup for this element. This is mainly used
       * to insert pre-built markup blocks into the element hierarchy.
       *
       * @param html {String} HTML markup with one root element
       *   which is used as the main element for this instance.
       * @return {Element} The created DOM element
       */
      useMarkup(html) {
        if (this._domNode) {
          throw new Error("Could not overwrite existing element!");
        }

        // Prepare extraction
        // We have a IE specific issue with "Unknown error" messages
        // when we try to use the same DOM node again. I am not sure
        // why this happens. Would be a good performance improvement,
        // but does not seem to work.
        if (qx.core.Environment.get("engine.name") == "mshtml") {
          var helper = document.createElement("div");
        } else {
          var helper = qx.dom.Element.getHelperElement();
        }

        // Extract first element
        helper.innerHTML = html;
        this.useNode(helper.firstChild);
        return this._domNode;
      },
      /**
       * Whether the element is focusable (or will be when created)
       *
       * @return {Boolean} <code>true</code> when the element is focusable.
       */
      isFocusable() {
        var tabIndex = this.getAttribute("tabIndex");
        if (tabIndex >= 1) {
          return true;
        }
        var focusable = qx.event.handler.Focus.FOCUSABLE_ELEMENTS;
        if (tabIndex >= 0 && focusable[this._nodeName]) {
          return true;
        }
        return false;
      },
      /**
       * Set whether the element is selectable. It uses the qooxdoo attribute
       * qxSelectable with the values 'on' or 'off'.
       * In webkit, a special css property will be used (-webkit-user-select).
       *
       * @param value {Boolean} True, if the element should be selectable.
       */
      setSelectable(value) {
        this.setAttribute("qxSelectable", value ? "on" : "off");
        var userSelect = qx.core.Environment.get("css.userselect");
        if (userSelect) {
          this.setStyle(userSelect, value ? "text" : qx.core.Environment.get("css.userselect.none"));
        }
      },
      /**
       * Whether the element is natively focusable (or will be when created)
       *
       * This ignores the configured tabIndex.
       *
       * @return {Boolean} <code>true</code> when the element is focusable.
       */
      isNativelyFocusable() {
        return !!qx.event.handler.Focus.FOCUSABLE_ELEMENTS[this._nodeName];
      },
      /*
      ---------------------------------------------------------------------------
        ANIMATION SUPPORT
      ---------------------------------------------------------------------------
      */
      /**
       * Fades in the element.
       * @param duration {Number} Time in ms.
       * @return {qx.bom.element.AnimationHandle} The animation handle to react for
       *   the fade animation.
       */
      fadeIn(duration) {
        var col = qxWeb(this._domNode);
        if (col.isPlaying()) {
          col.stop();
        }
        // create the element right away
        if (!this._domNode) {
          this.flush();
          col.push(this._domNode);
        }
        if (this._domNode) {
          col.fadeIn(duration).once("animationEnd", function () {
            this.show();
            qx.html.Element.flush();
          }, this);
          return col.getAnimationHandles()[0];
        }
      },
      /**
       * Fades out the element.
       * @param duration {Number} Time in ms.
       * @return {qx.bom.element.AnimationHandle} The animation handle to react for
       *   the fade animation.
       */
      fadeOut(duration) {
        var col = qxWeb(this._domNode);
        if (col.isPlaying()) {
          col.stop();
        }
        if (this._domNode) {
          col.fadeOut(duration).once("animationEnd", function () {
            this.hide();
            qx.html.Element.flush();
          }, this);
          return col.getAnimationHandles()[0];
        }
      },
      /*
      ---------------------------------------------------------------------------
        VISIBILITY SUPPORT
      ---------------------------------------------------------------------------
      */

      /*
       * @Override
       */
      _applyVisible(value, oldValue) {
        qx.html.Element.superclass.prototype._applyVisible.call(this, value, oldValue);
        if (value) {
          if (this._domNode) {
            qx.html.Element._visibility[this.toHashCode()] = this;
            qx.html.Element._scheduleFlush("element");
          }

          // Must be sure that the element gets included into the DOM.
          if (this._parent) {
            this._parent._scheduleChildrenUpdate();
          }
        } else {
          if (this._domNode) {
            qx.html.Element._visibility[this.toHashCode()] = this;
            qx.html.Element._scheduleFlush("element");
          }
        }
      },
      /**
       * Marks the element as visible which means that a previously applied
       * CSS style of display=none gets removed and the element will inserted
       * into the DOM, when this had not already happened before.
       *
       * @return {qx.html.Element} this object (for chaining support)
       */
      show() {
        this.setVisible(true);
        return this;
      },
      /**
       * Marks the element as hidden which means it will kept in DOM (if it
       * is already there, but configured hidden using a CSS style of display=none).
       *
       * @return {qx.html.Element} this object (for chaining support)
       */
      hide() {
        this.setVisible(false);
        return this;
      },
      /*
      ---------------------------------------------------------------------------
        SCROLL SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Scrolls the given child element into view. Only scrolls children.
       * Do not influence elements on top of this element.
       *
       * If the element is currently invisible it gets scrolled automatically
       * at the next time it is visible again (queued).
       *
       * @param elem {qx.html.Element} The element to scroll into the viewport.
       * @param align {String?null} Alignment of the element. Allowed values:
       *   <code>left</code> or <code>right</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       * @param direct {Boolean?true} Whether the execution should be made
       *   directly when possible
       */
      scrollChildIntoViewX(elem, align, direct) {
        var thisEl = this._domNode;
        var childEl = elem.getDomElement();
        if (direct !== false && thisEl && thisEl.offsetWidth && childEl && childEl.offsetWidth) {
          qx.bom.element.Scroll.intoViewX(childEl, thisEl, align);
        } else {
          this.__lazyScrollIntoViewX__P_24_12 = {
            element: elem,
            align: align
          };
          qx.html.Element._scroll[this.toHashCode()] = this;
          qx.html.Element._scheduleFlush("element");
        }
        delete this.__lazyScrollX__P_24_10;
      },
      /**
       * Scrolls the given child element into view. Only scrolls children.
       * Do not influence elements on top of this element.
       *
       * If the element is currently invisible it gets scrolled automatically
       * at the next time it is visible again (queued).
       *
       * @param elem {qx.html.Element} The element to scroll into the viewport.
       * @param align {String?null} Alignment of the element. Allowed values:
       *   <code>top</code> or <code>bottom</code>. Could also be null.
       *   Without a given alignment the method tries to scroll the widget
       *   with the minimum effort needed.
       * @param direct {Boolean?true} Whether the execution should be made
       *   directly when possible
       */
      scrollChildIntoViewY(elem, align, direct) {
        var thisEl = this._domNode;
        var childEl = elem.getDomElement();
        if (direct !== false && thisEl && thisEl.offsetWidth && childEl && childEl.offsetWidth) {
          qx.bom.element.Scroll.intoViewY(childEl, thisEl, align);
        } else {
          this.__lazyScrollIntoViewY__P_24_13 = {
            element: elem,
            align: align
          };
          qx.html.Element._scroll[this.toHashCode()] = this;
          qx.html.Element._scheduleFlush("element");
        }
        delete this.__lazyScrollY__P_24_11;
      },
      /**
       * Scrolls the element to the given left position.
       *
       * @param x {Integer} Horizontal scroll position
       * @param lazy {Boolean?false} Whether the scrolling should be performed
       *    during element flush.
       */
      scrollToX(x, lazy) {
        var thisEl = this._domNode;
        if (lazy !== true && thisEl && thisEl.offsetWidth) {
          thisEl.scrollLeft = x;
          delete this.__lazyScrollX__P_24_10;
        } else {
          this.__lazyScrollX__P_24_10 = x;
          qx.html.Element._scroll[this.toHashCode()] = this;
          qx.html.Element._scheduleFlush("element");
        }
        delete this.__lazyScrollIntoViewX__P_24_12;
      },
      /**
       * Get the horizontal scroll position.
       *
       * @return {Integer} Horizontal scroll position
       */
      getScrollX() {
        var thisEl = this._domNode;
        if (thisEl) {
          return thisEl.scrollLeft;
        }
        return this.__lazyScrollX__P_24_10 || 0;
      },
      /**
       * Scrolls the element to the given top position.
       *
       * @param y {Integer} Vertical scroll position
       * @param lazy {Boolean?false} Whether the scrolling should be performed
       *    during element flush.
       */
      scrollToY(y, lazy) {
        var thisEl = this._domNode;
        if (lazy !== true && thisEl && thisEl.offsetWidth) {
          thisEl.scrollTop = y;
          delete this.__lazyScrollY__P_24_11;
        } else {
          this.__lazyScrollY__P_24_11 = y;
          qx.html.Element._scroll[this.toHashCode()] = this;
          qx.html.Element._scheduleFlush("element");
        }
        delete this.__lazyScrollIntoViewY__P_24_13;
      },
      /**
       * Get the vertical scroll position.
       *
       * @return {Integer} Vertical scroll position
       */
      getScrollY() {
        var thisEl = this._domNode;
        if (thisEl) {
          return thisEl.scrollTop;
        }
        return this.__lazyScrollY__P_24_11 || 0;
      },
      /**
       * Disables browser-native scrolling
       */
      disableScrolling() {
        this.enableScrolling();
        this.scrollToX(0);
        this.scrollToY(0);
        this.addListener("scroll", this.__onScroll__P_24_20, this);
      },
      /**
       * Re-enables browser-native scrolling
       */
      enableScrolling() {
        this.removeListener("scroll", this.__onScroll__P_24_20, this);
      },
      __inScroll__P_24_21: null,
      /**
       * Handler for the scroll-event
       *
       * @param e {qx.event.type.Native} scroll-event
       */
      __onScroll__P_24_20(e) {
        if (!this.__inScroll__P_24_21) {
          this.__inScroll__P_24_21 = true;
          this._domNode.scrollTop = 0;
          this._domNode.scrollLeft = 0;
          delete this.__inScroll__P_24_21;
        }
      },
      /*
      ---------------------------------------------------------------------------
        TEXT SUPPORT
      ---------------------------------------------------------------------------
      */

      /*
       * Sets the text value of this element; it will delete children first, except
       * for the first node which (if it is a Text node) will have it's value updated
       *
       * @param value {String} the text to set
       */
      setText(value) {
        var self = this;
        var children = this._children ? qx.lang.Array.clone(this._children) : [];
        if (children[0] instanceof qx.html.Text) {
          children[0].setText(value);
          children.shift();
          children.forEach(function (child) {
            self.remove(child);
          });
        } else {
          children.forEach(function (child) {
            self.remove(child);
          });
          this.add(new qx.html.Text(value));
        }
      },
      /**
       * Returns the text value, accumulated from all child nodes
       *
       * @return {String} the text value
       */
      getText() {
        var result = [];
        if (this._children) {
          this._children.forEach(function (child) {
            result.push(child.getText());
          });
        }
        return result.join("");
      },
      /**
       * Get the selection of the element.
       *
       * If the underlaying DOM element is not yet created, this methods returns
       * a null value.
       *
       * @return {String|null}
       */
      getTextSelection() {
        var el = this._domNode;
        if (el) {
          return qx.bom.Selection.get(el);
        }
        return null;
      },
      /**
       * Get the length of selection of the element.
       *
       * If the underlaying DOM element is not yet created, this methods returns
       * a null value.
       *
       * @return {Integer|null}
       */
      getTextSelectionLength() {
        var el = this._domNode;
        if (el) {
          return qx.bom.Selection.getLength(el);
        }
        return null;
      },
      /**
       * Get the start of the selection of the element.
       *
       * If the underlaying DOM element is not yet created, this methods returns
       * a null value.
       *
       * @return {Integer|null}
       */
      getTextSelectionStart() {
        var el = this._domNode;
        if (el) {
          return qx.bom.Selection.getStart(el);
        }
        return null;
      },
      /**
       * Get the end of the selection of the element.
       *
       * If the underlaying DOM element is not yet created, this methods returns
       * a null value.
       *
       * @return {Integer|null}
       */
      getTextSelectionEnd() {
        var el = this._domNode;
        if (el) {
          return qx.bom.Selection.getEnd(el);
        }
        return null;
      },
      /**
       * Set the selection of the element with the given start and end value.
       * If no end value is passed the selection will extend to the end.
       *
       * This method only works if the underlying DOM element is already created.
       *
       * @param start {Integer} start of the selection (zero based)
       * @param end {Integer} end of the selection
       */
      setTextSelection(start, end) {
        var el = this._domNode;
        if (el) {
          qx.bom.Selection.set(el, start, end);
          return;
        }

        // if element not created, save the selection for flushing
        qx.html.Element.__selection__P_24_3[this.toHashCode()] = {
          element: this,
          start: start,
          end: end
        };
        qx.html.Element._scheduleFlush("element");
      },
      /**
       * Clears the selection of the element.
       *
       * This method only works if the underlying DOM element is already created.
       *
       */
      clearTextSelection() {
        var el = this._domNode;
        if (el) {
          qx.bom.Selection.clear(el);
        }
        delete qx.html.Element.__selection__P_24_3[this.toHashCode()];
      },
      /*
      ---------------------------------------------------------------------------
        FOCUS/ACTIVATE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Takes the action to process as argument and queues this action if the
       * underlying DOM element is not yet created.
       *
       * Note that "actions" are functions in `qx.bom.Element` and only apply to
       * environments with a user interface.  This will throw an error if the user
       * interface is headless
       *
       * @param action {String} action to queue
       * @param args {Array} optional list of arguments for the action
       */
      __performAction__P_24_22(action, args) {
        {
          var actions = qx.html.Element._actions;
          actions.push({
            type: action,
            element: this,
            args: args || []
          });
          qx.html.Element._scheduleFlush("element");
        }
      },
      /**
       * Focus this element.
       *
       * If the underlaying DOM element is not yet created, the
       * focus is queued for processing after the element creation.
       *
       * Silently does nothing when in a headless environment
       */
      focus() {
        {
          this.__performAction__P_24_22("focus");
        }
      },
      /**
       * Mark this element to get blurred on the next flush of the queue
       *
       * Silently does nothing when in a headless environment
       *
       */
      blur() {
        {
          this.__performAction__P_24_22("blur");
        }
      },
      /**
       * Mark this element to get activated on the next flush of the queue
       *
       * Silently does nothing when in a headless environment
       *
       */
      activate() {
        {
          this.__performAction__P_24_22("activate");
        }
      },
      /**
       * Mark this element to get deactivated on the next flush of the queue
       *
       * Silently does nothing when in a headless environment
       *
       */
      deactivate() {
        {
          this.__performAction__P_24_22("deactivate");
        }
      },
      /**
       * Captures all mouse events to this element
       *
       * Silently does nothing when in a headless environment
       *
       * @param containerCapture {Boolean?true} If true all events originating in
       *   the container are captured. If false events originating in the container
       *   are not captured.
       */
      capture(containerCapture) {
        {
          this.__performAction__P_24_22("capture", [containerCapture !== false]);
        }
      },
      /**
       * Releases this element from a previous {@link #capture} call
       *
       * Silently does nothing when in a headless environment
       */
      releaseCapture() {
        {
          this.__performAction__P_24_22("releaseCapture");
        }
      },
      /*
      ---------------------------------------------------------------------------
        STYLE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Set up the given style attribute
       *
       * @param key {String} the name of the style attribute
       * @param value {var} the value
       * @param direct {Boolean?false} Whether the value should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      setStyle(key, value, direct) {
        if (!this.__styleValues__P_24_0) {
          this.__styleValues__P_24_0 = {};
        }
        if (this.__styleValues__P_24_0[key] == value) {
          return this;
        }
        this._applyStyle(key, value, this.__styleValues__P_24_0[key]);
        if (value == null) {
          delete this.__styleValues__P_24_0[key];
        } else {
          this.__styleValues__P_24_0[key] = value;
        }

        // Uncreated elements simply copy all data
        // on creation. We don't need to remember any
        // jobs. It is a simple full list copy.
        if (this._domNode) {
          // Omit queuing in direct mode
          if (direct) {
            qx.bom.element.Style.set(this._domNode, key, value);
            return this;
          }

          // Dynamically create if needed
          if (!this.__styleJobs__P_24_15) {
            this.__styleJobs__P_24_15 = {};
          }

          // Store job info
          this.__styleJobs__P_24_15[key] = true;

          // Register modification
          qx.html.Element._modified[this.toHashCode()] = this;
          qx.html.Element._scheduleFlush("element");
        }
        return this;
      },
      /**
       * Called by setStyle when a value of a style changes; this is intended to be
       * overridden to allow the element to update properties etc according to the
       * style
       *
       * @param key {String} the style value
       * @param value {String?} the value to set
       * @param oldValue {String?} The previous value (not from DOM)
       */
      _applyStyle(key, value, oldValue) {
        // Nothing
      },
      /**
       * Convenience method to modify a set of styles at once.
       *
       * @param map {Map} a map where the key is the name of the property
       *    and the value is the value to use.
       * @param direct {Boolean?false} Whether the values should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      setStyles(map, direct) {
        // inline calls to "set" because this method is very
        // performance critical!
        var Style = qx.bom.element.Style;
        if (!this.__styleValues__P_24_0) {
          this.__styleValues__P_24_0 = {};
        }
        if (this._domNode) {
          // Dynamically create if needed
          if (!this.__styleJobs__P_24_15) {
            this.__styleJobs__P_24_15 = {};
          }
          for (var key in map) {
            var value = map[key];
            if (this.__styleValues__P_24_0[key] == value) {
              continue;
            }
            this._applyStyle(key, value, this.__styleValues__P_24_0[key]);
            if (value == null) {
              delete this.__styleValues__P_24_0[key];
            } else {
              this.__styleValues__P_24_0[key] = value;
            }

            // Omit queuing in direct mode
            if (direct) {
              Style.set(this._domNode, key, value);
              continue;
            }

            // Store job info
            this.__styleJobs__P_24_15[key] = true;
          }

          // Register modification
          qx.html.Element._modified[this.toHashCode()] = this;
          qx.html.Element._scheduleFlush("element");
        } else {
          for (var key in map) {
            var value = map[key];
            if (this.__styleValues__P_24_0[key] == value) {
              continue;
            }
            this._applyStyle(key, value, this.__styleValues__P_24_0[key]);
            if (value == null) {
              delete this.__styleValues__P_24_0[key];
            } else {
              this.__styleValues__P_24_0[key] = value;
            }
          }
        }
        return this;
      },
      /**
       * Removes the given style attribute
       *
       * @param key {String} the name of the style attribute
       * @param direct {Boolean?false} Whether the value should be removed
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeStyle(key, direct) {
        this.setStyle(key, null, direct);
        return this;
      },
      /**
       * Get the value of the given style attribute.
       *
       * @param key {String} name of the style attribute
       * @return {var} the value of the style attribute
       */
      getStyle(key) {
        return this.__styleValues__P_24_0 ? this.__styleValues__P_24_0[key] : null;
      },
      /**
       * Returns a map of all styles. Do not modify the result map!
       *
       * @return {Map} All styles or <code>null</code> when none are configured.
       */
      getAllStyles() {
        return this.__styleValues__P_24_0 || null;
      },
      /*
      ---------------------------------------------------------------------------
        CSS CLASS SUPPORT
      ---------------------------------------------------------------------------
      */
      __breakClasses__P_24_23() {
        var map = {};
        (this.getAttribute("class") || "").split(" ").forEach(function (name) {
          if (name) {
            map[name.toLowerCase()] = name;
          }
        });
        return map;
      },
      __combineClasses__P_24_24(map) {
        var primaryClass = this.getCssClass();
        var arr = [];
        if (primaryClass) {
          arr.push(primaryClass);
          delete map[primaryClass.toLowerCase()];
        }
        qx.lang.Array.append(arr, Object.values(map));
        return arr.length ? arr.join(" ") : null;
      },
      /**
       * Adds a css class to the element.
       *
       * @param name {String} Name of the CSS class.
       * @return {Element} this, for chaining
       */
      addClass(name) {
        var classes = this.__breakClasses__P_24_23();
        var primaryClass = (this.getCssClass() || "").toLowerCase();
        name.split(" ").forEach(name => {
          var nameLower = name.toLowerCase();
          if (nameLower == primaryClass) {
            this.setCssClass(null);
          }
          classes[nameLower] = name;
        });
        this.setAttribute("class", this.__combineClasses__P_24_24(classes));
        return this;
      },
      /**
       * Removes a CSS class from the current element.
       *
       * @param name {String} Name of the CSS class.
       * @return {Element} this, for chaining
       */
      removeClass(name) {
        var classes = this.__breakClasses__P_24_23();
        var primaryClass = (this.getCssClass() || "").toLowerCase();
        name.split(" ").forEach(name => {
          var nameLower = name.toLowerCase();
          if (nameLower == primaryClass) {
            this.setCssClass(null);
          }
          delete classes[nameLower];
        });
        this.setAttribute("class", this.__combineClasses__P_24_24(classes));
        return this;
      },
      /**
       * Removes all CSS classed from the current element.
       */
      removeAllClasses() {
        this.setCssClass(null);
        this.setAttribute("class", "");
      },
      /**
       * Apply method for cssClass
       */
      _applyCssClass(value, oldValue) {
        var classes = this.__breakClasses__P_24_23();
        if (oldValue) {
          oldValue.split(" ").forEach(name => delete classes[name.toLowerCase()]);
        }
        if (value) {
          value.split(" ").forEach(name => classes[name.toLowerCase()] = name);
        }
        this.setAttribute("class", this.__combineClasses__P_24_24(classes));
      },
      _applyIsCustomElement(value, oldValue) {
        // if currently `true` and trying to set `false`, throw an error
        if (!value && oldValue) {
          throw new Error(`Cannot change isCustomElement property of ${this.classname} after it has been set`);
        }
        // if no change, return
        if (value === oldValue) {
          return;
        }

        // therefore currently `false` and trying to set `true`; re-grab all slots
        this.getChildren()?.forEach(child => this._slotScanAdd(child));
      },
      /*
      ---------------------------------------------------------------------------
        SIZE AND POSITION SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the size and position of this element; this is just a helper method that wraps
       * the calls to qx.bom.*
       *
       * Supported modes:
       *
       * * <code>margin</code>: Calculate from the margin box of the element (bigger than the visual appearance: including margins of given element)
       * * <code>box</code>: Calculates the offset box of the element (default, uses the same size as visible)
       * * <code>border</code>: Calculate the border box (useful to align to border edges of two elements).
       * * <code>scroll</code>: Calculate the scroll box (relevant for absolute positioned content).
       * * <code>padding</code>: Calculate the padding box (relevant for static/relative positioned content).
       *
       * @param mode {String} the type of size required, see above
       * @return {Object} a map, containing:
       *  left, right, top, bottom - document co-ords
       *  content - Object, containing:
       *    width, height: maximum permissible content size
       */
      getDimensions(mode) {
        if (!this._domNode) {
          return {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            content: {
              width: 0,
              height: 0
            }
          };
        }
        var loc = qx.bom.element.Location.get(this._domNode, mode);
        loc.content = qx.bom.element.Dimension.getContentSize(this._domNode);
        loc.width = loc.right - loc.left;
        loc.height = loc.bottom - loc.top;
        return loc;
      },
      /**
       * Detects whether the DOM Node is visible
       */
      canBeSeen() {
        if (this._domNode && this.isVisible()) {
          var rect = this._domNode.getBoundingClientRect();
          if (rect.top > 0 || rect.left > 0 || rect.width > 0 || rect.height > 0) {
            return true;
          }
        }
        return false;
      },
      /*
      ---------------------------------------------------------------------------
        ATTRIBUTE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Set up the given attribute
       *
       * @param key {String} the name of the attribute
       * @param value {var} the value
       * @param direct {Boolean?false} Whether the value should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      setAttribute(key, value, direct) {
        if (!this.__attribValues__P_24_1) {
          this.__attribValues__P_24_1 = {};
        }
        if (this.__attribValues__P_24_1[key] == value) {
          return this;
        }
        if (value == null) {
          delete this.__attribValues__P_24_1[key];
        } else {
          this.__attribValues__P_24_1[key] = value;
        }
        if (key == "data-qx-object-id") {
          throw new Error("Cannot set the data-qx-object-id attribute directly");
        }

        // Uncreated elements simply copy all data
        // on creation. We don't need to remember any
        // jobs. It is a simple full list copy.
        if (this._domNode) {
          // Omit queuing in direct mode
          if (direct) {
            qx.bom.element.Attribute.set(this._domNode, key, value);
            return this;
          }

          // Dynamically create if needed
          if (!this.__attribJobs__P_24_16) {
            this.__attribJobs__P_24_16 = {};
          }

          // Store job info
          this.__attribJobs__P_24_16[key] = true;

          // Register modification
          qx.html.Element._modified[this.toHashCode()] = this;
          qx.html.Element._scheduleFlush("element");
        }
        return this;
      },
      /**
       * Convenience method to modify a set of attributes at once.
       *
       * @param map {Map} a map where the key is the name of the property
       *    and the value is the value to use.
       * @param direct {Boolean?false} Whether the values should be applied
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      setAttributes(map, direct) {
        for (var key in map) {
          this.setAttribute(key, map[key], direct);
        }
        return this;
      },
      /**
       * Removes the given attribute
       *
       * @param key {String} the name of the attribute
       * @param direct {Boolean?false} Whether the value should be removed
       *    directly (without queuing)
       * @return {qx.html.Element} this object (for chaining support)
       */
      removeAttribute(key, direct) {
        return this.setAttribute(key, null, direct);
      },
      /**
       * Get the value of the given attribute.
       *
       * @param key {String} name of the attribute
       * @return {var} the value of the attribute
       */
      getAttribute(key) {
        return this.__attribValues__P_24_1 ? this.__attribValues__P_24_1[key] : null;
      }
    },
    /*
     *****************************************************************************
        DEFER
     *****************************************************************************
     */

    defer(statics) {
      statics.__deferredCall__P_24_6 = new qx.util.DeferredCall(statics.flush, statics);
    },
    /*
    *****************************************************************************
       DESTRUCT
    *****************************************************************************
    */

    destruct() {
      var hash = this.toHashCode();
      if (hash) {
        delete qx.html.Element._modified[hash];
        delete qx.html.Element._scroll[hash];
      }
      this.setRoot(false);
      this.__attribValues__P_24_1 = this.__styleValues__P_24_0 = this.__attribJobs__P_24_16 = this.__styleJobs__P_24_15 = this.__lazyScrollIntoViewX__P_24_12 = this.__lazyScrollIntoViewY__P_24_13 = null;
    }
  });
  qx.html.Element.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.Focus": {
        "defer": "runtime"
      },
      "qx.event.handler.Window": {
        "defer": "runtime"
      },
      "qx.event.handler.Capture": {
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
      "qx.event.dispatch.AbstractBubbling": {
        "construct": true,
        "require": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.dom.Hierarchy": {},
      "qx.bom.Event": {},
      "qx.event.type.Event": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.client.OperatingSystem": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "load": true,
          "className": "qx.bom.client.Engine"
        },
        "browser.documentmode": {
          "load": true,
          "className": "qx.bom.client.Browser"
        },
        "os.version": {
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
      2007-2008 1&1 Internet AG, Germany, http://www.1und1.de
     License:
      MIT: https://opensource.org/licenses/MIT
      See the LICENSE file in the project's top-level directory for details.
     Authors:
      * Fabian Jakobs (fjakobs)
  ************************************************************************ */

  /**
   * Implementation of the Internet Explorer specific event capturing mode for
   * mouse events http://msdn2.microsoft.com/en-us/library/ms536742.aspx.
   *
   * This class is used internally by {@link qx.event.Manager} to do mouse event
   * capturing.
   *
   * @use(qx.event.handler.Focus)
   * @use(qx.event.handler.Window)
   * @use(qx.event.handler.Capture)
   */
  qx.Class.define("qx.event.dispatch.MouseCapture", {
    extend: qx.event.dispatch.AbstractBubbling,
    /**
     * @param manager {qx.event.Manager} Event manager for the window to use
     * @param registration {qx.event.Registration} The event registration to use
     */
    construct(manager, registration) {
      qx.event.dispatch.AbstractBubbling.constructor.call(this, manager);
      this.__window__P_68_0 = manager.getWindow();
      this.__registration__P_68_1 = registration;
      manager.addListener(this.__window__P_68_0, "blur", this.releaseCapture, this);
      manager.addListener(this.__window__P_68_0, "focus", this.releaseCapture, this);
      manager.addListener(this.__window__P_68_0, "scroll", this.releaseCapture, this);
    },
    statics: {
      /** @type {Integer} Priority of this dispatcher */
      PRIORITY: qx.event.Registration.PRIORITY_FIRST
    },
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      __registration__P_68_1: null,
      __captureElement__P_68_2: null,
      __containerCapture__P_68_3: true,
      __window__P_68_0: null,
      // overridden
      _getParent(target) {
        return target.parentNode;
      },
      /*
      ---------------------------------------------------------------------------
        EVENT DISPATCHER INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      canDispatchEvent(target, event, type) {
        return !!(this.__captureElement__P_68_2 && this.__captureEvents__P_68_4[type]);
      },
      // overridden
      dispatchEvent(target, event, type) {
        if (type == "click") {
          event.stopPropagation();
          this.releaseCapture();
          return;
        }
        if (this.__containerCapture__P_68_3 || !qx.dom.Hierarchy.contains(this.__captureElement__P_68_2, target)) {
          target = this.__captureElement__P_68_2;
        }
        return qx.event.dispatch.MouseCapture.superclass.prototype.dispatchEvent.call(this, target, event, type);
      },
      /*
      ---------------------------------------------------------------------------
        HELPER
      ---------------------------------------------------------------------------
      */

      /**
       * @lint ignoreReferenceField(__captureEvents)
       */
      __captureEvents__P_68_4: {
        mouseup: 1,
        mousedown: 1,
        click: 1,
        dblclick: 1,
        mousemove: 1,
        mouseout: 1,
        mouseover: 1,
        pointerdown: 1,
        pointerup: 1,
        pointermove: 1,
        pointerover: 1,
        pointerout: 1,
        tap: 1,
        dbltap: 1
      },
      /*
      ---------------------------------------------------------------------------
        USER ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Set the given element as target for event
       *
       * @param element {Element} The element which should capture the mouse events.
       * @param containerCapture {Boolean?true} If true all events originating in
       *   the container are captured. IF false events originating in the container
       *   are not captured.
       */
      activateCapture(element, containerCapture) {
        var containerCapture = containerCapture !== false;
        if (this.__captureElement__P_68_2 === element && this.__containerCapture__P_68_3 == containerCapture) {
          return;
        }
        if (this.__captureElement__P_68_2) {
          this.releaseCapture();
        }

        // turn on native mouse capturing if the browser supports it
        if (this.hasNativeCapture) {
          this.nativeSetCapture(element, containerCapture);
          var self = this;
          var onNativeListener = function () {
            qx.bom.Event.removeNativeListener(element, "losecapture", onNativeListener);
            self.releaseCapture();
          };
          qx.bom.Event.addNativeListener(element, "losecapture", onNativeListener);
        }
        this.__containerCapture__P_68_3 = containerCapture;
        this.__captureElement__P_68_2 = element;
        this.__registration__P_68_1.fireEvent(element, "capture", qx.event.type.Event, [true, false]);
      },
      /**
       * Get the element currently capturing events.
       *
       * @return {Element|null} The current capture element. This value may be
       *    null.
       */
      getCaptureElement() {
        return this.__captureElement__P_68_2;
      },
      /**
       * Stop capturing of mouse events.
       */
      releaseCapture() {
        var element = this.__captureElement__P_68_2;
        if (!element) {
          return;
        }
        this.__captureElement__P_68_2 = null;
        this.__registration__P_68_1.fireEvent(element, "losecapture", qx.event.type.Event, [true, false]);

        // turn off native mouse capturing if the browser supports it
        this.nativeReleaseCapture(element);
      },
      /** Whether the browser should use native mouse capturing */
      hasNativeCapture: qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 9 || parseInt(qx.core.Environment.get("os.version"), 10) > 7 && qx.core.Environment.get("browser.documentmode") > 9,
      /**
       * If the browser supports native mouse capturing, sets the mouse capture to
       * the object that belongs to the current document.
       *
       * Please note that under Windows 7 (but not Windows 8), capturing is
       * not only applied to mouse events as expected, but also to native pointer events.
       *
       * @param element {Element} The capture DOM element
       * @param containerCapture {Boolean?true} If true all events originating in
       *   the container are captured. If false events originating in the container
       *   are not captured.
       * @signature function(element, containerCapture)
       */
      nativeSetCapture: qx.core.Environment.select("engine.name", {
        mshtml(element, containerCapture) {
          element.setCapture(containerCapture !== false);
        },
        default() {}
      }),
      /**
       * If the browser supports native mouse capturing, removes mouse capture
       * from the object in the current document.
       *
       * @param element {Element} The DOM element to release the capture for
       * @signature function(element)
       */
      nativeReleaseCapture: qx.core.Environment.select("engine.name", {
        mshtml(element) {
          element.releaseCapture();
        },
        default() {}
      })
    },
    defer(statics) {
      qx.event.Registration.addDispatcher(statics);
    }
  });
  qx.event.dispatch.MouseCapture.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.dispatch.DomBubbling": {
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
      "qx.bom.client.OperatingSystem": {
        "construct": true,
        "require": true
      },
      "qx.core.Init": {
        "construct": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.Selection": {},
      "qx.event.type.Focus": {},
      "qx.lang.Function": {},
      "qx.bom.Event": {},
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {},
      "qx.bom.element.Attribute": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "os.name": {
          "construct": true,
          "className": "qx.bom.client.OperatingSystem"
        },
        "os.version": {
          "construct": true,
          "className": "qx.bom.client.OperatingSystem"
        },
        "engine.name": {
          "load": true,
          "className": "qx.bom.client.Engine"
        },
        "browser.name": {
          "load": true,
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
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * This handler is used to normalize all focus/activation requirements
   * and normalize all cross browser quirks in this area.
   *
   * Notes:
   *
   * * Webkit and Opera (before 9.5) do not support tabIndex for all elements
   * (See also: https://bugs.webkit.org/show_bug.cgi?id=7138)
   *
   * * TabIndex is normally 0, which means all naturally focusable elements are focusable.
   * * TabIndex > 0 means that the element is focusable and tabable
   * * TabIndex < 0 means that the element, even if naturally possible, is not focusable.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * @use(qx.event.dispatch.DomBubbling)
   */
  qx.Class.define("qx.event.handler.Focus", {
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
     *
     * @ignore(qx.application.Inline)
     */
    construct(manager) {
      qx.core.Object.constructor.call(this);

      // Define shorthands
      this._manager = manager;
      this._window = manager.getWindow();
      this._document = this._window.document;
      this._root = this._document.documentElement;
      this._body = this._document.body;
      if (qx.core.Environment.get("os.name") == "ios" && parseFloat(qx.core.Environment.get("os.version")) > 6 && parseFloat(qx.core.Environment.get("os.version")) < 15 && (!qx.application.Inline || !qx.core.Init.getApplication() instanceof qx.application.Inline)) {
        this.__needsScrollFix__P_67_0 = true;
      }

      // Initialize
      this._initObserver();
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** The active DOM element */
      active: {
        apply: "_applyActive",
        nullable: true
      },
      /** The focused DOM element */
      focus: {
        apply: "_applyFocus",
        nullable: true
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
        focus: 1,
        blur: 1,
        focusin: 1,
        focusout: 1,
        activate: 1,
        deactivate: 1
      },
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true,
      /**
       * @type {Map} See: http://msdn.microsoft.com/en-us/library/ms534654(VS.85).aspx
       */
      FOCUSABLE_ELEMENTS: qx.core.Environment.select("engine.name", {
        mshtml: {
          a: 1,
          body: 1,
          button: 1,
          frame: 1,
          iframe: 1,
          img: 1,
          input: 1,
          object: 1,
          select: 1,
          textarea: 1
        },
        gecko: {
          a: 1,
          body: 1,
          button: 1,
          frame: 1,
          iframe: 1,
          img: 1,
          input: 1,
          object: 1,
          select: 1,
          textarea: 1
        },
        opera: {
          button: 1,
          input: 1,
          select: 1,
          textarea: 1
        },
        webkit: {
          button: 1,
          input: 1,
          select: 1,
          textarea: 1
        }
      })
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __onNativeMouseDownWrapper__P_67_1: null,
      __onNativeMouseUpWrapper__P_67_2: null,
      __onNativeFocusWrapper__P_67_3: null,
      __onNativeBlurWrapper__P_67_4: null,
      __onNativeDragGestureWrapper__P_67_5: null,
      __onNativeSelectStartWrapper__P_67_6: null,
      __onNativeFocusInWrapper__P_67_7: null,
      __onNativeFocusOutWrapper__P_67_8: null,
      __previousFocus__P_67_9: null,
      __previousActive__P_67_10: null,
      __down__P_67_11: "",
      __up__P_67_12: "",
      __needsScrollFix__P_67_0: false,
      __relatedTarget__P_67_13: null,
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
        FOCUS/BLUR USER INTERFACE
      ---------------------------------------------------------------------------
      */

      /**
       * Focuses the given DOM element
       *
       * @param element {Element} DOM element to focus
       */
      focus(element) {
        // Fixed timing issue with IE, see [BUG #3267]
        if (qx.core.Environment.get("engine.name") == "mshtml") {
          window.setTimeout(function () {
            try {
              // focus element before set cursor position
              element.focus();

              // Fixed cursor position issue with IE, only when nothing is selected.
              // See [BUG #3519] for details.
              var selection = qx.bom.Selection.get(element);
              if (selection.length == 0 && typeof element.createTextRange == "function") {
                var textRange = element.createTextRange();
                textRange.moveStart("character", element.value.length);
                textRange.collapse();
                textRange.select();
              }
            } catch (ex) {}
          }, 0);
        } else {
          // Fix re-focusing on mousup event
          // See https://github.com/qooxdoo/qooxdoo/issues/9393 and
          // discussion in https://github.com/qooxdoo/qooxdoo/pull/9394
          window.setTimeout(function () {
            try {
              element.focus();
            } catch (ex) {}
          }, 0);
        }
        this.setFocus(element);
        this.setActive(element);
      },
      /**
       * Activates the given DOM element
       *
       * @param element {Element} DOM element to activate
       */
      activate(element) {
        this.setActive(element);
      },
      /**
       * Blurs the given DOM element
       *
       * @param element {Element} DOM element to focus
       */
      blur(element) {
        try {
          element.blur();
        } catch (ex) {}
        if (this.getActive() === element) {
          this.resetActive();
        }
        if (this.getFocus() === element) {
          this.resetFocus();
        }
      },
      /**
       * Deactivates the given DOM element
       *
       * @param element {Element} DOM element to activate
       */
      deactivate(element) {
        if (this.getActive() === element) {
          this.resetActive();
        }
      },
      /**
       * Tries to activate the given element. This checks whether
       * the activation is allowed first.
       *
       * @param element {Element} DOM element to activate
       */
      tryActivate(element) {
        var active = this.__findActivatableElement__P_67_14(element);
        if (active) {
          this.setActive(active);
        }
      },
      /*
      ---------------------------------------------------------------------------
        HELPER
      ---------------------------------------------------------------------------
      */

      /**
       * Shorthand to fire events from within this class.
       *
       * @param target {Element} DOM element which is the target
       * @param related {Element} DOM element which is the related target
       * @param type {String} Name of the event to fire
       * @param bubbles {Boolean} Whether the event should bubble
       * @return {qx.Promise?} a promise, if one or more of the event handlers returned a promise
       */
      __fireEvent__P_67_15(target, related, type, bubbles) {
        var Registration = qx.event.Registration;
        var evt = Registration.createEvent(type, qx.event.type.Focus, [target, related, bubbles]);
        return Registration.dispatchEvent(target, evt);
      },
      /*
      ---------------------------------------------------------------------------
        WINDOW FOCUS/BLUR SUPPORT
      ---------------------------------------------------------------------------
      */

      /** @type {Boolean} Whether the window is focused currently */
      _windowFocused: true,
      /**
       * Helper for native event listeners to react on window blur
       */
      __doWindowBlur__P_67_16() {
        // Omit doubled blur events
        // which is a common behavior at least for gecko based clients
        if (this._windowFocused) {
          this._windowFocused = false;
          this.__fireEvent__P_67_15(this._window, null, "blur", false);
        }
      },
      /**
       * Helper for native event listeners to react on window focus
       */
      __doWindowFocus__P_67_17() {
        // Omit doubled focus events
        // which is a common behavior at least for gecko based clients
        if (!this._windowFocused) {
          this._windowFocused = true;
          this.__fireEvent__P_67_15(this._window, null, "focus", false);
        }
      },
      /*
      ---------------------------------------------------------------------------
        NATIVE OBSERVER
      ---------------------------------------------------------------------------
      */

      /**
       * Initializes event listeners.
       *
       * @signature function()
       */
      _initObserver: qx.core.Environment.select("engine.name", {
        gecko() {
          // Bind methods
          this.__onNativeMouseDownWrapper__P_67_1 = qx.lang.Function.listener(this.__onNativeMouseDown__P_67_18, this);
          this.__onNativeMouseUpWrapper__P_67_2 = qx.lang.Function.listener(this.__onNativeMouseUp__P_67_19, this);
          this.__onNativeFocusWrapper__P_67_3 = qx.lang.Function.listener(this.__onNativeFocus__P_67_20, this);
          this.__onNativeBlurWrapper__P_67_4 = qx.lang.Function.listener(this.__onNativeBlur__P_67_21, this);
          this.__onNativeDragGestureWrapper__P_67_5 = qx.lang.Function.listener(this.__onNativeDragGesture__P_67_22, this);

          // Register events
          qx.bom.Event.addNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1, true);
          qx.bom.Event.addNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2, true);

          // Capturing is needed for gecko to correctly
          // handle focus of input and textarea fields
          qx.bom.Event.addNativeListener(this._window, "focus", this.__onNativeFocusWrapper__P_67_3, true);
          qx.bom.Event.addNativeListener(this._window, "blur", this.__onNativeBlurWrapper__P_67_4, true);

          // Capture drag events
          qx.bom.Event.addNativeListener(this._window, "draggesture", this.__onNativeDragGestureWrapper__P_67_5, true);
        },
        mshtml() {
          // Bind methods
          this.__onNativeMouseDownWrapper__P_67_1 = qx.lang.Function.listener(this.__onNativeMouseDown__P_67_18, this);
          this.__onNativeMouseUpWrapper__P_67_2 = qx.lang.Function.listener(this.__onNativeMouseUp__P_67_19, this);
          this.__onNativeFocusInWrapper__P_67_7 = qx.lang.Function.listener(this.__onNativeFocusIn__P_67_23, this);
          this.__onNativeFocusOutWrapper__P_67_8 = qx.lang.Function.listener(this.__onNativeFocusOut__P_67_24, this);
          this.__onNativeSelectStartWrapper__P_67_6 = qx.lang.Function.listener(this.__onNativeSelectStart__P_67_25, this);

          // Register events
          qx.bom.Event.addNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1);
          qx.bom.Event.addNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2);

          // MSHTML supports their own focusin and focusout events
          // To detect which elements get focus the target is useful
          // The window blur can detected using focusout and look
          // for the toTarget property which is empty in this case.
          qx.bom.Event.addNativeListener(this._document, "focusin", this.__onNativeFocusInWrapper__P_67_7);
          qx.bom.Event.addNativeListener(this._document, "focusout", this.__onNativeFocusOutWrapper__P_67_8);

          // Add selectstart to prevent selection
          qx.bom.Event.addNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper__P_67_6);
        },
        webkit: qx.core.Environment.select("browser.name", {
          // fix for [ISSUE #9174]
          // distinguish bettween MS Edge, which is reported
          // as engine webkit and all other webkit browsers
          edge(domEvent) {
            // Bind methods
            this.__onNativeMouseDownWrapper__P_67_1 = qx.lang.Function.listener(this.__onNativeMouseDown__P_67_18, this);
            this.__onNativeMouseUpWrapper__P_67_2 = qx.lang.Function.listener(this.__onNativeMouseUp__P_67_19, this);
            this.__onNativeFocusOutWrapper__P_67_8 = qx.lang.Function.listener(this.__onNativeFocusOut__P_67_24, this);
            this.__onNativeFocusInWrapper__P_67_7 = qx.lang.Function.listener(this.__onNativeFocusIn__P_67_23, this);
            this.__onNativeSelectStartWrapper__P_67_6 = qx.lang.Function.listener(this.__onNativeSelectStart__P_67_25, this);

            // Register events
            qx.bom.Event.addNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1, true);
            qx.bom.Event.addNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2, true);
            qx.bom.Event.addNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper__P_67_6, false);
            qx.bom.Event.addNativeListener(this._document, "focusin", this.__onNativeFocusInWrapper__P_67_7);
            qx.bom.Event.addNativeListener(this._document, "focusout", this.__onNativeFocusOutWrapper__P_67_8);
          },
          default(domEvent) {
            // Bind methods
            this.__onNativeMouseDownWrapper__P_67_1 = qx.lang.Function.listener(this.__onNativeMouseDown__P_67_18, this);
            this.__onNativeMouseUpWrapper__P_67_2 = qx.lang.Function.listener(this.__onNativeMouseUp__P_67_19, this);
            this.__onNativeFocusOutWrapper__P_67_8 = qx.lang.Function.listener(this.__onNativeFocusOut__P_67_24, this);
            this.__onNativeFocusWrapper__P_67_3 = qx.lang.Function.listener(this.__onNativeFocus__P_67_20, this);
            this.__onNativeBlurWrapper__P_67_4 = qx.lang.Function.listener(this.__onNativeBlur__P_67_21, this);
            this.__onNativeSelectStartWrapper__P_67_6 = qx.lang.Function.listener(this.__onNativeSelectStart__P_67_25, this);

            // Register events
            qx.bom.Event.addNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1, true);
            qx.bom.Event.addNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2, true);
            qx.bom.Event.addNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper__P_67_6, false);
            qx.bom.Event.addNativeListener(this._window, "DOMFocusOut", this.__onNativeFocusOutWrapper__P_67_8, true);
            qx.bom.Event.addNativeListener(this._window, "focus", this.__onNativeFocusWrapper__P_67_3, true);
            qx.bom.Event.addNativeListener(this._window, "blur", this.__onNativeBlurWrapper__P_67_4, true);
          }
        }),
        opera() {
          // Bind methods
          this.__onNativeMouseDownWrapper__P_67_1 = qx.lang.Function.listener(this.__onNativeMouseDown__P_67_18, this);
          this.__onNativeMouseUpWrapper__P_67_2 = qx.lang.Function.listener(this.__onNativeMouseUp__P_67_19, this);
          this.__onNativeFocusInWrapper__P_67_7 = qx.lang.Function.listener(this.__onNativeFocusIn__P_67_23, this);
          this.__onNativeFocusOutWrapper__P_67_8 = qx.lang.Function.listener(this.__onNativeFocusOut__P_67_24, this);

          // Register events
          qx.bom.Event.addNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1, true);
          qx.bom.Event.addNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2, true);
          qx.bom.Event.addNativeListener(this._window, "DOMFocusIn", this.__onNativeFocusInWrapper__P_67_7, true);
          qx.bom.Event.addNativeListener(this._window, "DOMFocusOut", this.__onNativeFocusOutWrapper__P_67_8, true);
        }
      }),
      /**
       * Disconnects event listeners.
       *
       * @signature function()
       */
      _stopObserver: qx.core.Environment.select("engine.name", {
        gecko() {
          qx.bom.Event.removeNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1, true);
          qx.bom.Event.removeNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2, true);
          qx.bom.Event.removeNativeListener(this._window, "focus", this.__onNativeFocusWrapper__P_67_3, true);
          qx.bom.Event.removeNativeListener(this._window, "blur", this.__onNativeBlurWrapper__P_67_4, true);
          qx.bom.Event.removeNativeListener(this._window, "draggesture", this.__onNativeDragGestureWrapper__P_67_5, true);
        },
        mshtml() {
          qx.bom.Event.removeNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1);
          qx.bom.Event.removeNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2);
          qx.bom.Event.removeNativeListener(this._document, "focusin", this.__onNativeFocusInWrapper__P_67_7);
          qx.bom.Event.removeNativeListener(this._document, "focusout", this.__onNativeFocusOutWrapper__P_67_8);
          qx.bom.Event.removeNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper__P_67_6);
        },
        webkit: qx.core.Environment.select("browser.name", {
          // fix for [ISSUE #9174]
          // distinguish bettween MS Edge, which is reported
          // as engine webkit and all other webkit browsers
          edge() {
            qx.bom.Event.removeNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1);
            qx.bom.Event.removeNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2);
            qx.bom.Event.removeNativeListener(this._document, "focusin", this.__onNativeFocusInWrapper__P_67_7);
            qx.bom.Event.removeNativeListener(this._document, "focusout", this.__onNativeFocusOutWrapper__P_67_8);
            qx.bom.Event.removeNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper__P_67_6);
          },
          default() {
            qx.bom.Event.removeNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1, true);
            qx.bom.Event.removeNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2, true);
            qx.bom.Event.removeNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper__P_67_6, false);
            qx.bom.Event.removeNativeListener(this._window, "DOMFocusOut", this.__onNativeFocusOutWrapper__P_67_8, true);
            qx.bom.Event.removeNativeListener(this._window, "focus", this.__onNativeFocusWrapper__P_67_3, true);
            qx.bom.Event.removeNativeListener(this._window, "blur", this.__onNativeBlurWrapper__P_67_4, true);
          }
        }),
        opera() {
          qx.bom.Event.removeNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper__P_67_1, true);
          qx.bom.Event.removeNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper__P_67_2, true);
          qx.bom.Event.removeNativeListener(this._window, "DOMFocusIn", this.__onNativeFocusInWrapper__P_67_7, true);
          qx.bom.Event.removeNativeListener(this._window, "DOMFocusOut", this.__onNativeFocusOutWrapper__P_67_8, true);
        }
      }),
      /*
      ---------------------------------------------------------------------------
        NATIVE LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Native event listener for <code>draggesture</code> event
       * supported by gecko. Used to stop native drag and drop when
       * selection is disabled.
       *
       * @see https://developer.mozilla.org/en-US/docs/Drag_and_Drop
       * @signature function(domEvent)
       * @param domEvent {Event} Native event
       */
      __onNativeDragGesture__P_67_22: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        gecko(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (!this.__isSelectable__P_67_26(target)) {
            qx.bom.Event.preventDefault(domEvent);
          }
        },
        default: null
      })),
      /**
       * Native event listener for <code>DOMFocusIn</code> or <code>focusin</code>
       * depending on the client's engine.
       *
       * @signature function(domEvent)
       * @param domEvent {Event} Native event
       */
      __onNativeFocusIn__P_67_23: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        mshtml(domEvent) {
          // Force window focus to be the first
          this.__doWindowFocus__P_67_17();

          // Update internal data
          var target = qx.bom.Event.getTarget(domEvent);

          // IE focusin is also fired on elements which are not focusable at all
          // We need to look up for the next focusable element.
          var focusTarget = this.__findFocusableElement__P_67_27(target);
          if (focusTarget) {
            this.setFocus(focusTarget);
          }

          // Make target active
          this.tryActivate(target);
        },
        webkit: qx.core.Environment.select("browser.name", {
          // fix for [ISSUE #9174]
          // distinguish bettween MS Edge, which is reported
          // as engine webkit and all other webkit browsers
          edge(domEvent) {
            // Force window focus to be the first
            this.__doWindowFocus__P_67_17();

            // Update internal data
            var target = qx.bom.Event.getTarget(domEvent);

            // IE focusin is also fired on elements which are not focusable at all
            // We need to look up for the next focusable element.
            var focusTarget = this.__findFocusableElement__P_67_27(target);
            if (focusTarget) {
              this.setFocus(focusTarget);
            }

            // Make target active
            this.tryActivate(target);
          },
          default: null
        }),
        opera(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (target == this._document || target == this._window) {
            this.__doWindowFocus__P_67_17();
            if (this.__previousFocus__P_67_9) {
              this.setFocus(this.__previousFocus__P_67_9);
              delete this.__previousFocus__P_67_9;
            }
            if (this.__previousActive__P_67_10) {
              this.setActive(this.__previousActive__P_67_10);
              delete this.__previousActive__P_67_10;
            }
          } else {
            this.setFocus(target);
            this.tryActivate(target);

            // Clear selection
            if (!this.__isSelectable__P_67_26(target)) {
              target.selectionStart = 0;
              target.selectionEnd = 0;
            }
          }
        },
        default: null
      })),
      /**
       * Native event listener for <code>DOMFocusOut</code> or <code>focusout</code>
       * depending on the client's engine.
       *
       * @signature function(domEvent)
       * @param domEvent {Event} Native event
       */
      __onNativeFocusOut__P_67_24: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        mshtml(domEvent) {
          var relatedTarget = qx.bom.Event.getRelatedTarget(domEvent);

          // If the focus goes to nowhere (the document is blurred)
          if (relatedTarget == null) {
            // Update internal representation
            this.__doWindowBlur__P_67_16();

            // Reset active and focus
            this.resetFocus();
            this.resetActive();
          }
        },
        webkit: qx.core.Environment.select("browser.name", {
          // fix for [ISSUE #9174]
          // distinguish bettween MS Edge, which is reported
          // as engine webkit and all other webkit browsers
          edge(domEvent) {
            var relatedTarget = qx.bom.Event.getRelatedTarget(domEvent);

            // If the focus goes to nowhere (the document is blurred)
            if (relatedTarget == null) {
              // Update internal representation
              this.__doWindowBlur__P_67_16();

              // Reset active and focus
              this.resetFocus();
              this.resetActive();
            }
          },
          default(domEvent) {
            var target = qx.bom.Event.getTarget(domEvent);
            if (target === this.getFocus()) {
              this.resetFocus();
            }
            if (target === this.getActive()) {
              this.resetActive();
            }
          }
        }),
        opera(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (target == this._document) {
            this.__doWindowBlur__P_67_16();

            // Store old focus/active elements
            // Opera do not fire focus events for them
            // when refocussing the window (in my opinion an error)
            this.__previousFocus__P_67_9 = this.getFocus();
            this.__previousActive__P_67_10 = this.getActive();
            this.resetFocus();
            this.resetActive();
          } else {
            if (target === this.getFocus()) {
              this.resetFocus();
            }
            if (target === this.getActive()) {
              this.resetActive();
            }
          }
        },
        default: null
      })),
      /**
       * Native event listener for <code>blur</code>.
       *
       * @signature function(domEvent)
       * @param domEvent {Event} Native event
       */
      __onNativeBlur__P_67_21: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        gecko(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (target === this._window || target === this._document) {
            this.__doWindowBlur__P_67_16();
            this.resetActive();
            this.resetFocus();
          }
        },
        webkit(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (target === this._window || target === this._document) {
            this.__doWindowBlur__P_67_16();

            // Store old focus/active elements
            // Opera do not fire focus events for them
            // when refocussing the window (in my opinion an error)
            this.__previousFocus__P_67_9 = this.getFocus();
            this.__previousActive__P_67_10 = this.getActive();
            this.resetActive();
            this.resetFocus();
          }
        },
        default: null
      })),
      /**
       * Native event listener for <code>focus</code>.
       *
       * @signature function(domEvent)
       * @param domEvent {Event} Native event
       */
      __onNativeFocus__P_67_20: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        gecko(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (target === this._window || target === this._document) {
            this.__doWindowFocus__P_67_17();

            // Always speak of the body, not the window or document
            target = this._body;
          }
          this.setFocus(target);
          this.tryActivate(target);
        },
        webkit(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (target === this._window || target === this._document) {
            this.__doWindowFocus__P_67_17();
            if (this.__previousFocus__P_67_9) {
              this.setFocus(this.__previousFocus__P_67_9);
              delete this.__previousFocus__P_67_9;
            }
            if (this.__previousActive__P_67_10) {
              this.setActive(this.__previousActive__P_67_10);
              delete this.__previousActive__P_67_10;
            }
          } else {
            this.__relatedTarget__P_67_13 = domEvent.relatedTarget;
            this.setFocus(target);
            this.__relatedTarget__P_67_13 = null;
            this.tryActivate(target);
          }
        },
        default: null
      })),
      /**
       * Native event listener for <code>mousedown</code>.
       *
       * @signature function(domEvent)
       * @param domEvent {Event} Native event
       */
      __onNativeMouseDown__P_67_18: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        mshtml(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);

          // Stop events when no focus element available (or blocked)
          var focusTarget = this.__findFocusableElement__P_67_27(target);
          if (focusTarget) {
            // Add unselectable to keep selection
            if (!this.__isSelectable__P_67_26(target)) {
              // The element is not selectable. Block selection.
              target.unselectable = "on";

              // Unselectable may keep the current selection which
              // is not what we like when changing the focus element.
              // So we clear it
              try {
                if (document.selection) {
                  document.selection.empty();
                }
              } catch (ex) {
                // ignore 'Unknown runtime error'
              }

              // The unselectable attribute stops focussing as well.
              // Do this manually.
              try {
                focusTarget.focus();
              } catch (ex) {
                // ignore "Can't move focus of this control" error
              }
            }
          } else {
            // Stop event for blocking support
            qx.bom.Event.preventDefault(domEvent);

            // Add unselectable to keep selection
            if (!this.__isSelectable__P_67_26(target)) {
              target.unselectable = "on";
            }
          }
        },
        webkit(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          var focusTarget = this.__findFocusableElement__P_67_27(target);
          if (focusTarget) {
            this.setFocus(focusTarget);
          } else {
            qx.bom.Event.preventDefault(domEvent);
          }
        },
        gecko(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          var focusTarget = this.__findFocusableElement__P_67_27(target);
          if (focusTarget) {
            this.setFocus(focusTarget);
          } else {
            qx.bom.Event.preventDefault(domEvent);
          }
        },
        opera(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          var focusTarget = this.__findFocusableElement__P_67_27(target);
          if (!this.__isSelectable__P_67_26(target)) {
            // Prevent the default action for all non-selectable
            // targets. This prevents text selection and context menu.
            qx.bom.Event.preventDefault(domEvent);

            // The stopped event keeps the selection
            // of the previously focused element.
            // We need to clear the old selection.
            if (focusTarget) {
              var current = this.getFocus();
              if (current && current.selectionEnd) {
                current.selectionStart = 0;
                current.selectionEnd = 0;
                current.blur();
              }

              // The prevented event also stop the focus, do
              // it manually if needed.
              if (focusTarget) {
                this.setFocus(focusTarget);
              }
            }
          } else if (focusTarget) {
            this.setFocus(focusTarget);
          }
        },
        default: null
      })),
      /**
       * Native event listener for <code>mouseup</code>.
       *
       * @signature function(domEvent)
       * @param domEvent {Event} Native event
       */
      __onNativeMouseUp__P_67_19: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        mshtml(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (target.unselectable) {
            target.unselectable = "off";
          }
          this.tryActivate(this.__fixFocus__P_67_28(target));
        },
        gecko(domEvent) {
          // As of Firefox 3.0:
          // Gecko fires mouseup on XUL elements
          // We only want to deal with real HTML elements
          var target = qx.bom.Event.getTarget(domEvent);
          while (target && target.offsetWidth === undefined) {
            target = target.parentNode;
          }
          if (target) {
            this.tryActivate(target);
          }
        },
        webkit(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          this.tryActivate(this.__fixFocus__P_67_28(target));
        },
        opera(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          this.tryActivate(this.__fixFocus__P_67_28(target));
        },
        default: null
      })),
      /**
       * Fix for bug #9331.
       *
       * @signature function(target)
       * @param target {Element} element to check
       * @return {Element} return correct target (in case of compound input controls should always return textfield);
       */
      __getCorrectFocusTarget__P_67_29(target) {
        var focusedElement = this.getFocus();
        if (focusedElement && target != focusedElement) {
          if (focusedElement.nodeName.toLowerCase() === "input" || focusedElement.nodeName.toLowerCase() === "textarea") {
            return focusedElement;
          }
          if (qx.Class.isClass("qx.ui.core.Widget")) {
            // Check compound widgets
            var widget = qx.ui.core.Widget.getWidgetByElement(focusedElement),
              textField = widget && widget.getChildControl && widget.getChildControl("textfield", true);
          }
          if (textField) {
            return textField.getContentElement().getDomElement();
          }
        }
        return target;
      },
      /**
       * Fix for bug #2602.
       *
       * @signature function(target)
       * @param target {Element} target element from mouse up event
       * @return {Element} Element to activate;
       */
      __fixFocus__P_67_28: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        mshtml(target) {
          return this.__getCorrectFocusTarget__P_67_29(target);
        },
        webkit(target) {
          return this.__getCorrectFocusTarget__P_67_29(target);
        },
        default(target) {
          return target;
        }
      })),
      /**
       * Native event listener for <code>selectstart</code>.
       *
       *@signature function(domEvent)
       * @param domEvent {Event} Native event
       */
      __onNativeSelectStart__P_67_25: qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name", {
        mshtml(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (!this.__isSelectable__P_67_26(target)) {
            qx.bom.Event.preventDefault(domEvent);
          }
        },
        webkit(domEvent) {
          var target = qx.bom.Event.getTarget(domEvent);
          if (!this.__isSelectable__P_67_26(target)) {
            qx.bom.Event.preventDefault(domEvent);
          }
        },
        default: null
      })),
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Whether the given element is focusable. This is perfectly modeled to the
       * browsers behavior and this way may differ in the various clients.
       *
       * @param el {Element} DOM Element to query
       * @return {Boolean} Whether the element is focusable
       */
      __isFocusable__P_67_30(el) {
        var index = qx.bom.element.Attribute.get(el, "tabIndex");
        if (index >= 1) {
          return true;
        }
        var focusable = qx.event.handler.Focus.FOCUSABLE_ELEMENTS;
        if (index >= 0 && focusable[el.tagName]) {
          return true;
        }
        return false;
      },
      /**
       * Returns the next focusable parent element of an activated DOM element.
       *
       * @param el {Element} Element to start lookup with.
       * @return {Element|null} The next focusable element.
       */
      __findFocusableElement__P_67_27(el) {
        while (el && el.nodeType === 1) {
          if (el.getAttribute("qxKeepFocus") == "on") {
            return null;
          }
          if (this.__isFocusable__P_67_30(el)) {
            return el;
          }
          el = el.parentNode;
        }

        // This should be identical to the one which is selected when
        // clicking into an empty page area. In mshtml this must be
        // the body of the document.
        return this._body;
      },
      /**
       * Returns the next activatable element. May be the element itself.
       * Works a bit different than the method {@link #__findFocusableElement}
       * as it looks up for a parent which is has a keep focus flag. When
       * there is such a parent it returns null otherwise the original
       * incoming element.
       *
       * @param el {Element} Element to start lookup with.
       * @return {Element} The next activatable element.
       */
      __findActivatableElement__P_67_14(el) {
        var orig = el;
        while (el && el.nodeType === 1) {
          if (el.getAttribute("qxKeepActive") == "on") {
            return null;
          }
          el = el.parentNode;
        }
        return orig;
      },
      /**
       * Whether the given el (or its content) should be selectable
       * by the user.
       *
       * @param node {Element} Node to start lookup with
       * @return {Boolean} Whether the content is selectable.
       */
      __isSelectable__P_67_26(node) {
        while (node && node.nodeType === 1) {
          var attr = node.getAttribute("qxSelectable");
          if (attr != null) {
            return attr === "on";
          }
          node = node.parentNode;
        }
        return true;
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // apply routine
      _applyActive(value, old) {
        // Fire events
        if (old) {
          this.__fireEvent__P_67_15(old, value, "deactivate", true);
        }
        if (value) {
          this.__fireEvent__P_67_15(value, old, "activate", true);
        }
        // correct scroll position for iOS 7 to 14 [ISSUE #9393 and #10565]
        if (this.__needsScrollFix__P_67_0) {
          window.scrollTo(0, 0);
        }
      },
      // apply routine
      _applyFocus(value, old) {
        // Fire bubbling events
        if (old) {
          this.__fireEvent__P_67_15(old, value, "focusout", true);
        }
        if (value) {
          this.__fireEvent__P_67_15(value, old, "focusin", true);
        }

        // Fire after events
        if (old) {
          this.__fireEvent__P_67_15(old, value, "blur", false);
        }
        if (value) {
          this.__fireEvent__P_67_15(value, old || this.__relatedTarget__P_67_13, "focus", false);
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
      this._manager = this._window = this._document = this._root = this._body = this.__mouseActive__P_67_31 = this.__relatedTarget__P_67_13 = null;
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      qx.event.Registration.addHandler(statics);

      // For faster lookups generate uppercase tag names dynamically
      var focusable = statics.FOCUSABLE_ELEMENTS;
      for (var entry in focusable) {
        focusable[entry.toUpperCase()] = 1;
      }
    }
  });
  qx.event.handler.Focus.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "defer": "runtime",
        "require": true
      },
      "qx.core.ObjectRegistry": {},
      "qx.core.Object": {},
      "qx.core.MAssert": {
        "defer": "runtime"
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
       * Jonathan Weiß (jonathan_rass)
  
     ======================================================================
  
       This class uses documentation of the native String methods from the MDC
       documentation of Mozilla.
  
       License:
         CC Attribution-Sharealike License:
         http://creativecommons.org/licenses/by-sa/2.5/
  
  ************************************************************************ */

  /**
   * This class emulates the built-in JavaScript String class. It can be used as
   * base class for classes, which need to derive from String.
   *
   * Instances of this class can be used in any place a JavaScript string can.
   */
  qx.Class.define("qx.type.BaseString", {
    extend: Object,
    /**
     * @param txt {String?""} Initialize with this string
     */
    construct(txt) {
      var txt = txt || "";

      // no base call needed

      this.__txt__P_204_0 = txt;
      this.length = txt.length;
    },
    members: {
      $$isString: true,
      length: 0,
      __txt__P_204_0: null,
      /**
       * Returns a string representing the specified object.
       *
       * The valueOf method of String returns the primitive value of a String
       * object as a string data type.
       * This method is usually called internally by JavaScript and not
       * explicitly in code.
       *
       * @return {String} A new string containing the string value.
       */
      toString() {
        return this.__txt__P_204_0;
      },
      /**
       *  Returns the specified character from a string.
       *
       * Characters in a string are indexed from left to right. The index of the
       * first character is 0, and the index of the last character in a string
       * called stringName is stringName.length - 1. If the index you supply is
       * out of range, JavaScript returns an empty string.
       *
       * @signature function(index)
       * @param index {Integer} An integer between 0 and 1 less than the length
       *   of the string.
       * @return {String} The character.
       */
      charAt: null,
      /**
       * Returns the primitive value of a String object.
       *
       * The valueOf method of String returns the primitive value of a String
       * object as a string data type.
       * This method is usually called internally by JavaScript and not
       * explicitly in code.
       *
       * @signature function()
       * @return {String} A new string containing the primitive value.
       */
      valueOf: null,
      /**
       * Returns a number indicating the Unicode value of the character at the given index.
       *
       * @signature function(index)
       * @param index {Integer} An integer greater than 0 and less than the length
       *   of the string; if it is not a number, it defaults to 0.
       * @return {Integer} The number.
       */
      charCodeAt: null,
      /**
       * Combines the text of two or more strings and returns a new string.
       * Changes to the text in one string do not affect the other string.
       *
       * @signature function(stringN)
       * @param stringN {String} One or more strings to be combined.
       * @return {String} The combined string.
       */
      concat: null,
      /**
       * Returns the index within the calling String object of the first
       * occurrence of the specified value, starting the search at fromIndex,
       * returns -1 if the value is not found.
       *
       * @signature function(index, offset)
       * @param index {String} A string representing the value to search for.
       * @param offset {Integer?0} The location within the calling string to start
       *   the search from. It can be any integer between 0 and the length of the
       *   string. The default value is 0.
       * @return {Integer} The index or -1.
       */
      indexOf: null,
      /**
       * Returns the index within the calling String object of the last occurrence
       * of the specified value, or -1 if not found. The calling string is
       * searched backward, starting at fromIndex.
       *
       * @signature function(index, offset)
       * @param index {String} A string representing the value to search for.
       * @param offset {Integer?0} The location within the calling string to start
       *   the search from, indexed from left to right. It can be any integer
       *   between 0 and the length of the string. The default value is the length
       *    of the string.
       * @return {Integer} The index or -1.
       */
      lastIndexOf: null,
      /**
       * Used to retrieve the matches when matching a string against a regular
       * expression.
       *
       * If the regular expression does not include the g flag, returns the same
       * result as regexp.exec(string). If the regular expression includes the g
       * flag, the method returns an Array containing all matches.
       *
       * @signature function(regexp)
       * @param regexp {Object} A regular expression object. If a non-RegExp object
       *  obj is passed, it is implicitly converted to a RegExp by using
       *   new RegExp(obj).
       * @return {Object} The matching RegExp object or an array containing all
       *   matches.
       */
      match: null,
      /**
       * Finds a match between a regular expression and a string, and replaces the
       * matched substring with a new substring.
       *
       * @signature function(regexp, aFunction)
       * @param regexp {Object} A RegExp object. The match is replaced by the
       *   return value of parameter #2. Or a String that is to be replaced by
       *   newSubStr.
       * @param aFunction {Function} A function to be invoked to create the new
       *   substring (to put in place of the substring received from parameter
       *   #1).
       * @return {String} The new substring.
       */
      replace: null,
      /**
       * Executes the search for a match between a regular expression and this
       * String object.
       *
       * If successful, search returns the index of the regular expression inside
       * the string. Otherwise, it returns -1.
       *
       * @signature function(regexp)
       * @param regexp {Object} A regular expression object. If a non-RegExp object
       *  obj is passed, it is implicitly converted to a RegExp by using
       *   new RegExp(obj).
       * @return {Object} The matching RegExp object or -1.
       *   matches.
       */
      search: null,
      /**
       * Extracts a section of a string and returns a new string.
       *
       * Slice extracts the text from one string and returns a new string. Changes
       * to the text in one string do not affect the other string.
       * As a negative index, endSlice indicates an offset from the end of the
       * string.
       *
       * @signature function(beginslice, endSlice)
       * @param beginslice {Integer} The zero-based index at which to begin
       *   extraction.
       * @param endSlice {Integer?null} The zero-based index at which to end
       *   extraction. If omitted, slice extracts to the end of the string.
       * @return {String} The extracted string.
       */
      slice: null,
      /**
       * Splits a String object into an array of strings by separating the string
       * into substrings.
       *
       * When found, separator is removed from the string and the substrings are
       * returned in an array. If separator is omitted, the array contains one
       * element consisting of the entire string.
       *
       * If separator is a regular expression that contains capturing parentheses,
       * then each time separator is matched the results (including any undefined
       * results) of the capturing parentheses are spliced into the output array.
       * However, not all browsers support this capability.
       *
       * Note: When the string is empty, split returns an array containing one
       *
       * @signature function(separator, limit)
       * @param separator {String?null} Specifies the character to use for
       *   separating the string. The separator is treated as a string or a regular
       *   expression. If separator is omitted, the array returned contains one
       *   element consisting of the entire string.
       * @param limit {Integer?null} Integer specifying a limit on the number of
       *   splits to be found.
       * @return {Array} The Array containing substrings.
       */
      split: null,
      /**
       * Returns the characters in a string beginning at the specified location
       * through the specified number of characters.
       *
       * Start is a character index. The index of the first character is 0, and the
       * index of the last character is 1 less than the length of the string. substr
       *  begins extracting characters at start and collects length characters
       * (unless it reaches the end of the string first, in which case it will
       * return fewer).
       * If start is positive and is greater than or equal to the length of the
       * string, substr returns an empty string.
       *
       * @signature function(start, length)
       * @param start {Integer} Location at which to begin extracting characters
       *   (an integer between 0 and one less than the length of the string).
       * @param length {Integer?null} The number of characters to extract.
       * @return {String} The substring.
       */
      substr: null,
      /**
       * Returns a subset of a String object.
       *
       * substring extracts characters from indexA up to but not including indexB.
       * In particular:
       * If indexA equals indexB, substring returns an empty string.
       * If indexB is omitted, substring extracts characters to the end of the
       * string.
       * If either argument is less than 0 or is NaN, it is treated as if it were
       * 0.
       * If either argument is greater than stringName.length, it is treated as if
       * it were stringName.length.
       * If indexA is larger than indexB, then the effect of substring is as if
       * the two arguments were swapped; for example, str.substring(1, 0) == str.substring(0, 1).
       *
       * @signature function(indexA, indexB)
       * @param indexA {Integer} An integer between 0 and one less than the
       *   length of the string.
       * @param indexB {Integer?null} (optional) An integer between 0 and the
       *   length of the string.
       * @return {String} The subset.
       */
      substring: null,
      /**
       * Returns the calling string value converted to lowercase.
       * The toLowerCase method returns the value of the string converted to
       * lowercase. toLowerCase does not affect the value of the string itself.
       *
       * @signature function()
       * @return {String} The new string.
       */
      toLowerCase: null,
      /**
       * Returns the calling string value converted to uppercase.
       * The toUpperCase method returns the value of the string converted to
       * uppercase. toUpperCase does not affect the value of the string itself.
       *
       * @signature function()
       * @return {String} The new string.
       */
      toUpperCase: null,
      /**
       * Return unique hash code of object
       *
       * @return {Integer} unique hash code of the object
       */
      toHashCode() {
        return qx.core.ObjectRegistry.toHashCode(this);
      },
      /**
       * The characters within a string are converted to lower case while
       * respecting the current locale.
       *
       * The toLowerCase method returns the value of the string converted to
       * lowercase. toLowerCase does not affect the value of the string itself.
       *
       * @signature function()
       * @return {String} The new string.
       */
      toLocaleLowerCase: null,
      /**
       * The characters within a string are converted to upper case while
       * respecting the current locale.
       * The toUpperCase method returns the value of the string converted to
       * uppercase. toUpperCase does not affect the value of the string itself.
       *
       * @signature function()
       * @return {String} The new string.
       */
      toLocaleUpperCase: null,
      /**
       * Call the same method of the super class.
       *
       * @param args {arguments} the arguments variable of the calling method
       * @param varags {var} variable number of arguments passed to the overwritten function
       * @return {var} the return value of the method of the base class.
       */
      base(args, varags) {
        return qx.core.Object.prototype.base.apply(this, arguments);
      }
    },
    /*
     *****************************************************************************
        DEFER
     *****************************************************************************
     */

    defer(statics, members) {
      // add asserts into each debug build
      {
        qx.Class.include(statics, qx.core.MAssert);
      }
      var mappedFunctions = ["charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "match", "replace", "search", "slice", "split", "substr", "substring", "toLowerCase", "toUpperCase", "toLocaleLowerCase", "toLocaleUpperCase", "trim", "codePointAt"];

      // feature/bug detection:
      // Some older Firefox version (<2) break if valueOf is overridden
      members.valueOf = members.toString;
      if (new statics("").valueOf() == null) {
        delete members.valueOf;
      }
      for (var i = 0, l = mappedFunctions.length; i < l; i++) {
        members[mappedFunctions[i]] = String.prototype[mappedFunctions[i]];
      }
    }
  });
  qx.type.BaseString.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.type.BaseString": {
        "construct": true,
        "require": true
      },
      "qx.locale.Manager": {}
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
   * This class contains the translation of a message and all information
   * to translate it again into a different language.
   */
  qx.Class.define("qx.locale.LocalizedString", {
    extend: qx.type.BaseString,
    /**
     * @param translation {String} The translated message
     * @param messageId {String} The messageId to translate
     * @param args {Array} list of arguments passed used as values for format strings
     * @param localized {Boolean} True if the string uses localize instead of translate
     */
    construct(translation, messageId, args, localized) {
      qx.type.BaseString.constructor.call(this, translation);
      this.__messageId__P_168_0 = messageId;
      this.__localized__P_168_1 = !!localized;
      this.__args__P_168_2 = args;
    },
    members: {
      __localized__P_168_1: null,
      __messageId__P_168_0: null,
      __args__P_168_2: null,
      /**
       * Get a translation of the string using the current locale.
       *
       * @return {qx.locale.LocalizedString|String} This string translated using the current
       *    locale.
       */
      translate() {
        if (this.__localized__P_168_1) {
          return qx.locale.Manager.getInstance().localize(this.__messageId__P_168_0, this.__args__P_168_2);
        }
        return qx.locale.Manager.getInstance().translate(this.__messageId__P_168_0, this.__args__P_168_2);
      },
      /**
       * Returns the messageId.
       *
       * @return {String} The messageId of this localized String
       */
      getMessageId() {
        return this.__messageId__P_168_0;
      }
    }
  });
  qx.locale.LocalizedString.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.bom.client.OperatingSystem": {
        "require": true,
        "defer": "runtime"
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Type": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["locale", "locale.variant", "locale.default"],
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
       * Sebastian Werner (wpbasti)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * This class comes with all relevant information regarding
   * the client's selected locale.
   *
   * This class is used by {@link qx.core.Environment} and should not be used
   * directly. Please check its class comment for details how to use it.
   *
   * @internal
   * @require(qx.bom.client.OperatingSystem)
   */
  qx.Bootstrap.define("qx.bom.client.Locale", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * The name of the system locale e.g. "de" when the full locale is "de_AT"
       * @return {String} The current locale
       * @internal
       */
      getLocale() {
        var locale = qx.bom.client.Locale.__getNavigatorLocale__P_169_0();
        var index = locale.indexOf("-");
        if (index != -1) {
          locale = locale.substr(0, index);
        }
        return locale;
      },
      /**
       * The name of the variant for the system locale e.g. "at" when the
       * full locale is "de_AT"
       *
       * @return {String} The locales variant.
       * @internal
       */
      getVariant() {
        var locale = qx.bom.client.Locale.__getNavigatorLocale__P_169_0();
        var variant = "";
        var index = locale.indexOf("-");
        if (index != -1) {
          variant = locale.substr(index + 1);
        }
        return variant;
      },
      /**
       * Internal helper for accessing the navigators language.
       *
       * @return {String} The language set by the navigator.
       */
      __getNavigatorLocale__P_169_0() {
        var locale = navigator.userLanguage || navigator.language || "";

        // Android Bug: Android does not return the system language from the
        // navigator language before version 4.4.x. Try to parse the language
        // from the userAgent.
        // See http://code.google.com/p/android/issues/detail?id=4641
        if (qx.bom.client.OperatingSystem.getName() == "android") {
          var version = /^(\d+)\.(\d+)(\..+)?/i.exec(qx.bom.client.OperatingSystem.getVersion());
          if (qx.lang.Type.isArray(version) && version.length >= 3) {
            if (parseInt(version[1]) < 4 || parseInt(version[1]) === 4 && parseInt(version[2]) < 4) {
              var match = /(\w{2})-(\w{2})/i.exec(navigator.userAgent);
              if (match) {
                locale = match[0];
              }
            }
          }
        }
        return locale.toLowerCase();
      }
    },
    defer(statics) {
      qx.core.Environment.add("locale", statics.getLocale);
      qx.core.Environment.add("locale.variant", statics.getVariant);
      qx.core.Environment.add("locale.default", "C");
    }
  });
  qx.bom.client.Locale.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.dispatch.Direct": {
        "require": true
      },
      "qx.locale.LocalizedString": {
        "require": true
      },
      "qx.bom.client.Locale": {
        "require": true
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
      "qx.lang.Array": {},
      "qx.log.Logger": {},
      "qx.lang.String": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "locale": {
          "className": "qx.bom.client.Locale"
        },
        "locale.default": {
          "className": "qx.bom.client.Locale",
          "load": true
        },
        "locale.variant": {
          "className": "qx.bom.client.Locale"
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
   * The qx.locale.Manager provides static translation methods (like tr()) and
   * general locale information.
   *
   * @require(qx.event.dispatch.Direct)
   * @require(qx.locale.LocalizedString)
   * @require(qx.bom.client.Locale)
   *
   * Note: "translating" the empty string, e.g. tr("") will return the header
   * of the respective .po file. See also https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html#PO-Files
   *
   * @cldr()
   */

  qx.Class.define("qx.locale.Manager", {
    type: "singleton",
    extend: qx.core.Object,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.core.Object.constructor.call(this);
      this.__translations__P_81_0 = qx.$$translations || {};
      this.__locales__P_81_1 = qx.$$locales || {};
      this.initLocale();
      this.__clientLocale__P_81_2 = this.getLocale();
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Translate a message
       *
       * @param messageId {String} message id (may contain format strings)
       * @param varargs {Object} variable number of arguments applied to the format string
       * @return {String|LocalizedString} The translated message or localized string
       * @see qx.lang.String.format
       */
      tr(messageId, varargs) {
        var args = qx.lang.Array.fromArguments(arguments, 1);
        return qx.locale.Manager.getInstance().translate(messageId, args);
      },
      /**
       * Translate a plural message
       *
       * Depending on the third argument the plural or the singular form is chosen.
       *
       * @param singularMessageId {String} message id of the singular form (may contain format strings)
       * @param pluralMessageId {String} message id of the plural form (may contain format strings)
       * @param count {Integer} singular form if equals 1, otherwise plural
       * @param varargs {Object} variable number of arguments applied to the format string
       * @return {String|LocalizedString} The translated message or localized string
       * @see qx.lang.String.format
       */
      trn(singularMessageId, pluralMessageId, count, varargs) {
        var args = qx.lang.Array.fromArguments(arguments);
        args.splice(0, 3);

        // assumes "Two forms, singular used for one only" (seems to be the most common form)
        // (http://www.gnu.org/software/gettext/manual/html_node/gettext_150.html#Plural-forms)
        // closely related with bug #745
        if (count != 1) {
          return qx.locale.Manager.getInstance().translate(pluralMessageId, args);
        } else {
          return qx.locale.Manager.getInstance().translate(singularMessageId, args);
        }
      },
      /**
       * Translate a message with translation hint (from developer addressed to translator).
       *
       * @param hint {String} hint for the translator of the message. Will be included in the .po file.
       * @param messageId {String} message id (may contain format strings)
       * @param varargs {Object} variable number of arguments applied to the format string
       * @return {String|LocalizedString} The translated message or localized string
       * @see qx.lang.String.format
       */
      trc(hint, messageId, varargs) {
        var args = qx.lang.Array.fromArguments(arguments);
        args.splice(0, 2);
        return qx.locale.Manager.getInstance().translate(messageId, args);
      },
      /**
       * Translate a plural message with translation hint (from developer addressed to translator).
       *
       * Depending on the third argument the plural or the singular form is chosen.
       *
       * @param hint {String} hint for the translator of the message. Will be included in the .po file.
       * @param singularMessageId {String} message id of the singular form (may contain format strings)
       * @param pluralMessageId {String} message id of the plural form (may contain format strings)
       * @param count {Integer} singular form if equals 1, otherwise plural
       * @param varargs {Object} variable number of arguments applied to the format string
       * @return {String|LocalizedString} The translated message or localized string
       * @see qx.lang.String.format
       */
      trnc(hint, singularMessageId, pluralMessageId, count, varargs) {
        var args = qx.lang.Array.fromArguments(arguments);
        args.splice(0, 4);

        // see trn()
        if (count != 1) {
          return qx.locale.Manager.getInstance().translate(pluralMessageId, args);
        } else {
          return qx.locale.Manager.getInstance().translate(singularMessageId, args);
        }
      },
      /**
       * Mark the message for translation but return the original message.
       *
       * @param messageId {String} the message ID
       * @return {String} messageId
       */
      marktr(messageId) {
        return messageId;
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** current locale. locale is an language code like de, de_AT, en, en_GB, fr, ... */
      locale: {
        check: "String",
        apply: "_applyLocale",
        event: "changeLocale",
        init: function () {
          var locale = qx.core.Environment.get("locale");
          if (!locale || locale === "") {
            return qx.core.Environment.get("locale.default");
          }
          var variant = qx.core.Environment.get("locale.variant");
          if (variant !== "") {
            locale += "_" + variant;
          }
          return locale;
        }()
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __defaultLocale__P_81_3: qx.core.Environment.get("locale.default"),
      __locale__P_81_4: null,
      __language__P_81_5: null,
      __translations__P_81_0: null,
      __locales__P_81_1: null,
      __clientLocale__P_81_2: null,
      /**
       * Get the language code of the current locale
       *
       * This is the first part of a locale definition. The language for "de_DE" would be "de"
       *
       * @return {String} language code
       */
      getLanguage() {
        return this.__language__P_81_5;
      },
      /**
       * Get the territory code of the current locale
       *
       * This is the second part of a locale definition. The territory for "de_DE" would be "DE"
       *
       * @return {String} territory code
       */
      getTerritory() {
        return this.getLocale().split("_")[1] || "";
      },
      /**
       * Return the available application locales
       *
       * This corresponds to the LOCALES setting in config.json. Without argument,
       * it only returns the currently loaded locales, with an argument of true
       * all locales that went into the build. This is particularly interesting if
       * locales were generated as dedicated I18N parts, and have to be loaded
       * explicitly before being available.
       *
       * @param includeNonloaded {Boolean?null} include locales not yet loaded
       * @return {String[]} array of available locales
       */
      getAvailableLocales(includeNonloaded) {
        var locales = [];
        for (var locale in this.__locales__P_81_1) {
          if (locale != this.__defaultLocale__P_81_3) {
            if (this.__locales__P_81_1[locale] === null && !includeNonloaded) {
              continue; // skip not yet loaded locales
            }
            locales.push(locale);
          }
        }
        return locales;
      },
      /**
       * Extract the language part from a locale.
       *
       * @param locale {String} locale to be used
       * @return {String} language
       */
      __extractLanguage__P_81_6(locale) {
        var language;
        if (locale == null) {
          return null;
        }
        var pos = locale.indexOf("_");
        if (pos == -1) {
          language = locale;
        } else {
          language = locale.substring(0, pos);
        }
        return language;
      },
      // property apply
      _applyLocale(value, old) {
        {
          if (!(value in this.__locales__P_81_1 || value == this.__clientLocale__P_81_2)) {
            qx.log.Logger.warn("Locale: " + value + " not available.");
          }
        }
        this.__locale__P_81_4 = value;
        this.__language__P_81_5 = this.__extractLanguage__P_81_6(value);
      },
      /**
       * Add a translation to the translation manager.
       *
       * If <code>languageCode</code> already exists, its map will be updated with
       * <code>translationMap</code> (new keys will be added, existing keys will be
       * overwritten).
       *
       * @param languageCode {String} language code of the translation like <i>de, de_AT, en, en_GB, fr, ...</i>
       * @param translationMap {Map} mapping of message identifiers to message strings in the target
       *                             language, e.g. <i>{"greeting_short" : "Hello"}</i>. Plural forms
       *                             are separate keys.
       */
      addTranslation(languageCode, translationMap) {
        var catalog = this.__translations__P_81_0;
        if (catalog[languageCode]) {
          for (var key in translationMap) {
            catalog[languageCode][key] = translationMap[key];
          }
        } else {
          catalog[languageCode] = translationMap;
        }
      },
      /**
       * Add a localization to the localization manager.
       *
       * If <code>localeCode</code> already exists, its map will be updated with
       * <code>localeMap</code> (new keys will be added, existing keys will be overwritten).
       *
       * @param localeCode {String} locale code of the translation like <i>de, de_AT, en, en_GB, fr, ...</i>
       * @param localeMap {Map} mapping of locale keys to the target locale values, e.g.
       *                        <i>{"cldr_date_format_short" : "M/d/yy"}</i>.
       */
      addLocale(localeCode, localeMap) {
        var catalog = this.__locales__P_81_1;
        if (catalog[localeCode]) {
          for (var key in localeMap) {
            catalog[localeCode][key] = localeMap[key];
          }
        } else {
          catalog[localeCode] = localeMap;
        }
      },
      /**
       * Translate a message using the current locale and apply format string to the arguments.
       *
       * Implements the lookup chain locale (e.g. en_US) -> language (e.g. en) ->
       * default locale (e.g. C). Localizes the arguments if possible and splices
       * them into the message. If qx.dynlocale is on, returns a {@link
       * LocalizedString}.
       *
       * @param messageId {String} message id (may contain format strings)
       * @param args {Object[]} array of objects, which are inserted into the format string
       * @param locale {String ? #locale} locale to be used; if not given, defaults to the value of {@link #locale}
       * @return {String|LocalizedString} translated message or localized string
       */
      translate(messageId, args, locale) {
        var catalog = this.__translations__P_81_0;
        return this.__lookupAndExpand__P_81_7(catalog, messageId, args, locale);
      },
      /**
       * Provide localization (CLDR) data.
       *
       * Implements the lookup chain locale (e.g. en_US) -> language (e.g. en) ->
       * default locale (e.g. C). Localizes the arguments if possible and splices
       * them into the message. If qx.dynlocale is on, returns a {@link
       * LocalizedString}.
       *
       * @param messageId {String} message id (may contain format strings)
       * @param args {Object[]} array of objects, which are inserted into the format string
       * @param locale {String ? #locale} locale to be used; if not given, defaults to the value of {@link #locale}
       * @return {String|LocalizedString} translated message or localized string
       */
      localize(messageId, args, locale) {
        var catalog = this.__locales__P_81_1;
        return this.__lookupAndExpand__P_81_7(catalog, messageId, args, locale);
      },
      /**
       * Look up an I18N key in a catalog and expand format strings.
       *
       * Implements the lookup chain locale (e.g. en_US) -> language (e.g. en) ->
       * default locale (e.g. C). Localizes the arguments if possible and splices
       * them into the message. If qx.dynlocale is on, returns a {@link
       * LocalizedString}.
       *
       * @param catalog {Map} map of I18N keys and their values
       * @param messageId {String} message id (may contain format strings)
       * @param args {Object[]} array of objects, which are inserted into the format string
       * @param locale {String ? #locale} locale to be used; if not given, defaults to the value of {@link #locale}
       * @return {String|LocalizedString} translated message or localized string
       */
      __lookupAndExpand__P_81_7(catalog, messageId, args, locale) {
        {
          this.assertObject(catalog);
          this.assertString(messageId);
          this.assertArray(args);
        }
        var txt;
        if (!catalog) {
          return messageId;
        }
        if (locale) {
          var language = this.__extractLanguage__P_81_6(locale);
        } else {
          locale = this.__locale__P_81_4;
          language = this.__language__P_81_5;
        }

        // e.g. DE_at
        if (!txt && catalog[locale]) {
          txt = catalog[locale][messageId];
        }

        // e.g. DE
        if (!txt && catalog[language]) {
          txt = catalog[language][messageId];
        }

        // C
        if (!txt && catalog[this.__defaultLocale__P_81_3]) {
          txt = catalog[this.__defaultLocale__P_81_3][messageId];
        }
        if (!txt) {
          txt = messageId;
        }
        if (args.length > 0) {
          var translatedArgs = [];
          for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (arg && arg.translate) {
              translatedArgs[i] = arg.translate();
            } else {
              translatedArgs[i] = arg;
            }
          }
          txt = qx.lang.String.format(txt, translatedArgs);
        }
        {
          txt = new qx.locale.LocalizedString(txt, messageId, args, catalog === this.__locales__P_81_1);
        }
        return txt;
      }
    }
  });
  qx.locale.Manager.$$dbClassInfo = $$dbClassInfo;
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
       2007-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * Abstract base class for all managers of themed values.
   */
  qx.Class.define("qx.util.ValueManager", {
    type: "abstract",
    extend: qx.core.Object,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.core.Object.constructor.call(this);

      // Create empty dynamic map
      this._dynamic = {};
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      _dynamic: null,
      /**
       * Returns the dynamically interpreted result for the incoming value
       *
       * @param value {String} dynamically interpreted identifier
       * @return {var} return the (translated) result of the incoming value
       */
      resolveDynamic(value) {
        return this._dynamic[value];
      },
      /**
       * Whether a value is interpreted dynamically
       *
       * @param value {String} dynamically interpreted identifier
       * @return {Boolean} returns true if the value is interpreted dynamically
       */
      isDynamic(value) {
        return !!this._dynamic[value];
      },
      /**
       * Returns the dynamically interpreted result for the incoming value,
       * (if available), otherwise returns the original value
       * @param value {String} Value to resolve
       * @return {var} either returns the (translated) result of the incoming
       * value or the value itself
       */
      resolve(value) {
        if (value && this._dynamic[value]) {
          return this._dynamic[value];
        }
        return value;
      },
      /**
       * Sets the dynamics map.
       * @param value {Map} The map.
       */
      _setDynamic(value) {
        this._dynamic = value;
      },
      /**
       * Returns the dynamics map.
       * @return {Map} The map.
       */
      _getDynamic() {
        return this._dynamic;
      }
    }
  });
  qx.util.ValueManager.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.ValueManager": {
        "require": true
      },
      "qx.util.ColorUtil": {}
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
   * Manager for color themes
   */
  qx.Class.define("qx.theme.manager.Color", {
    type: "singleton",
    extend: qx.util.ValueManager,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** the currently selected color theme */
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
      _applyTheme(value) {
        var dest = {};
        this._setDynamic(dest); // reset dynamic cache
        if (value) {
          var colors = value.colors;
          for (var name in colors) {
            if (!dest[name]) {
              dest[name] = this.__parseColor__P_110_0(colors, name);
            }
          }
        }
      },
      /**
       * Helper to take a color stored in the theme and returns the string color value.
       * In most of the times that means it just returns the string stored in the theme.
       * It additionally checks if its a valid color at all.
       *
       * @param colors {Map} The map of color definitions.
       * @param name {String} The name of the color to check.
       * @return {String} The resolved color as string.
       */
      __parseColor__P_110_0(colors, name) {
        var color = colors[name];
        if (typeof color === "string") {
          if (!qx.util.ColorUtil.isCssString(color)) {
            // check for references to in theme colors
            if (colors[color] != undefined) {
              return this.__parseColor__P_110_0(colors, color);
            }
            throw new Error("Could not parse color: " + color);
          }
          return color;
        } else if (color instanceof Array) {
          return qx.util.ColorUtil.rgbToRgbString(color);
        } else if (color instanceof Function) {
          return this.__parseColor__P_110_0(colors, color(name));
        }
        // this is might already be a rgb or hex color
        return name;
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
        if (theme !== null && theme.colors[value]) {
          return cache[value] = this.__parseColor__P_110_0(theme.colors, value);
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
        if (value && cache[value] !== undefined) {
          return true;
        }

        // If the font instance is not yet cached create a new one to return
        // This is true whenever a runtime include occurred (using "qx.Theme.include"
        // or "qx.Theme.patch"), since these methods only merging the keys of
        // the theme and are not updating the cache
        var theme = this.getTheme();
        if (theme !== null && value && theme.colors[value] !== undefined) {
          cache[value] = this.__parseColor__P_110_0(theme.colors, value);
          return true;
        }
        return false;
      }
    }
  });
  qx.theme.manager.Color.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Array": {},
      "qx.ui.core.queue.Manager": {},
      "qx.ui.core.queue.Visibility": {}
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
   * The AppearanceQueue registers all widgets which are influences through
   * state changes.
   */
  qx.Class.define("qx.ui.core.queue.Appearance", {
    statics: {
      /** @type {Array} This contains all the queued widgets for the next flush. */
      __queue__P_111_0: [],
      /** @type {Map} map of widgets by hash code which are in the queue */
      __lookup__P_111_1: {},
      /**
       * Clears the widget from the internal queue. Normally only used
       * during interims disposes of one or a few widgets.
       *
       * @param widget {qx.ui.core.Widget} The widget to clear
       */
      remove(widget) {
        if (this.__lookup__P_111_1[widget.toHashCode()]) {
          qx.lang.Array.remove(this.__queue__P_111_0, widget);
          delete this.__lookup__P_111_1[widget.toHashCode()];
        }
      },
      /**
       * Adds a widget to the queue.
       *
       * Should only be used by {@link qx.ui.core.Widget}.
       *
       * @param widget {qx.ui.core.Widget} The widget to add.
       */
      add(widget) {
        if (this.__lookup__P_111_1[widget.toHashCode()]) {
          return;
        }
        this.__queue__P_111_0.unshift(widget);
        this.__lookup__P_111_1[widget.toHashCode()] = widget;
        qx.ui.core.queue.Manager.scheduleFlush("appearance");
      },
      /**
       * Whether the given widget is already queued
       *
       * @param widget {qx.ui.core.Widget} The widget to check
       * @return {Boolean} <code>true</code> if the widget is queued
       */
      has(widget) {
        return !!this.__lookup__P_111_1[widget.toHashCode()];
      },
      /**
       * Flushes the appearance queue.
       *
       * This is used exclusively by the {@link qx.ui.core.queue.Manager}.
       */
      flush() {
        var Visibility = qx.ui.core.queue.Visibility;
        var queue = this.__queue__P_111_0;
        var obj;
        for (var i = queue.length - 1; i >= 0; i--) {
          // Order is important to allow the same widget to be re-queued directly
          obj = queue[i];
          queue.splice(i, 1);
          delete this.__lookup__P_111_1[obj.toHashCode()];

          // Only apply to currently visible widgets
          if (Visibility.isVisible(obj)) {
            obj.syncAppearance();
          } else {
            obj.$$stateChanges = true;
          }
        }
      }
    }
  });
  qx.ui.core.queue.Appearance.$$dbClassInfo = $$dbClassInfo;
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
   * Manager for appearance themes
   */
  qx.Class.define("qx.theme.manager.Appearance", {
    type: "singleton",
    extend: qx.core.Object,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.core.Object.constructor.call(this);
      this.__styleCache__P_112_0 = {};
      this.__aliasMap__P_112_1 = {};
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** Currently used appearance theme */
      theme: {
        check: "Theme",
        nullable: true,
        event: "changeTheme",
        apply: "_applyTheme"
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
       * @lint ignoreReferenceField(__defaultStates)
       */
      __defaultStates__P_112_2: {},
      __styleCache__P_112_0: null,
      __aliasMap__P_112_1: null,
      // property apply
      _applyTheme() {
        // empty the caches
        this.__aliasMap__P_112_1 = {};
        this.__styleCache__P_112_0 = {};
      },
      /*
      ---------------------------------------------------------------------------
        THEME HELPER
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the appearance entry ID to use
       * when all aliases etc. are processed.
       *
       * @param id {String} ID to resolve.
       * @param theme {Theme} Theme to use for lookup.
       * @param defaultId {String} ID for a fallback.
       * @param chain {Array} The appearance id chain.
       * @return {String} Resolved ID
       */
      __resolveId__P_112_3(id, theme, defaultId, chain) {
        var db = theme.appearances;
        var entry = db[id];
        if (!entry) {
          var divider = "/";
          var end = [];
          var splitted = id.split(divider);
          var chainCopy = qx.lang.Array.clone(splitted);
          var alias;
          while (!entry && splitted.length > 0) {
            end.unshift(splitted.pop());
            var baseid = splitted.join(divider);
            entry = db[baseid];
            if (entry) {
              alias = entry.alias || entry;
              if (typeof alias === "string") {
                var mapped = alias + divider + end.join(divider);
                return this.__resolveId__P_112_3(mapped, theme, defaultId, chainCopy);
              }
            }
          }

          // check if we find a control fitting in the appearance [BUG #4020]
          for (var i = 0; i < end.length - 1; i++) {
            // remove the first id, it has already been checked at startup
            end.shift();
            // build a new subid without the former first id
            var subId = end.join(divider);
            var resolved = this.__resolveId__P_112_3(subId, theme, null, chainCopy);
            if (resolved) {
              return resolved;
            }
          }

          // check for the fallback
          if (defaultId != null) {
            return this.__resolveId__P_112_3(defaultId, theme, null, chainCopy);
          }

          // it's safe to output this message here since we can be sure that the return
          // value is 'null' and something went wrong with the id lookup.
          {
            if (typeof chain !== "undefined") {
              this.debug("Cannot find a matching appearance for '" + chain.join("/") + "'.");
              if (chain.length > 1) {
                this.info("Hint: This may be an issue with nested child controls and a missing alias definition in the appearance theme.");
              }
            }
          }
          return null;
        } else if (typeof entry === "string") {
          return this.__resolveId__P_112_3(entry, theme, defaultId, chainCopy);
        } else if (entry.include && !entry.style) {
          return this.__resolveId__P_112_3(entry.include, theme, defaultId, chainCopy);
        }
        return id;
      },
      /**
       * Get the result of the "state" function for a given id and states
       *
       * @param id {String} id of the appearance (e.g. "button", "label", ...)
       * @param states {Map} hash map defining the set states
       * @param theme {Theme?} appearance theme
       * @param defaultId {String} fallback id.
       * @return {Map} map of widget properties as returned by the "state" function
       */
      styleFrom(id, states, theme, defaultId) {
        if (!theme) {
          theme = this.getTheme();
        }

        // Resolve ID
        var aliasMap = this.__aliasMap__P_112_1;
        if (!aliasMap[theme.name]) {
          aliasMap[theme.name] = {};
        }
        var resolved = aliasMap[theme.name][id];
        if (!resolved) {
          resolved = aliasMap[theme.name][id] = this.__resolveId__P_112_3(id, theme, defaultId);
        }

        // Query theme for ID
        var entry = theme.appearances[resolved];
        if (!entry) {
          this.warn("Missing appearance: " + id);
          return null;
        }

        // Entries with includes, but without style are automatically merged
        // by the ID handling in {@link #getEntry}. When there is no style method in the
        // final object the appearance is empty and null could be returned.
        if (!entry.style) {
          return null;
        }

        // Build an unique cache name from ID and state combination
        var unique = resolved;
        if (states) {
          // Create data fields
          var bits = entry.$$bits;
          if (!bits) {
            bits = entry.$$bits = {};
            entry.$$length = 0;
          }

          // Compute sum
          var sum = 0;
          for (var state in states) {
            if (!states[state]) {
              continue;
            }
            if (bits[state] == null) {
              bits[state] = 1 << entry.$$length++;
            }
            sum += bits[state];
          }

          // Only append the sum if it is bigger than zero
          if (sum > 0) {
            unique += ":" + sum;
          }
        }

        // Using cache if available
        var cache = this.__styleCache__P_112_0;
        if (cache[theme.name] && cache[theme.name][unique] !== undefined) {
          return cache[theme.name][unique];
        }

        // Fallback to default (empty) states map
        if (!states) {
          states = this.__defaultStates__P_112_2;
        }

        // Compile the appearance
        var result;

        // If an include or base is defined, too, we need to merge the entries
        if (entry.include || entry.base) {
          // Gather included data
          var incl;
          if (entry.include) {
            incl = this.styleFrom(entry.include, states, theme, defaultId);
          }

          // This process tries to insert the original data first, and
          // append the new data later, to higher prioritize the local
          // data above the included/inherited data. This is especially needed
          // for property groups or properties which includes other
          // properties when modified.
          var local = entry.style(states, incl);

          // Create new map
          result = {};

          // Copy base data, but exclude overwritten local and included stuff
          if (entry.base) {
            var base = this.styleFrom(resolved, states, entry.base, defaultId);
            if (entry.include) {
              for (var baseIncludeKey in base) {
                if (!incl.hasOwnProperty(baseIncludeKey) && !local.hasOwnProperty(baseIncludeKey)) {
                  result[baseIncludeKey] = base[baseIncludeKey];
                }
              }
            } else {
              for (var baseKey in base) {
                if (!local.hasOwnProperty(baseKey)) {
                  result[baseKey] = base[baseKey];
                }
              }
            }
          }

          // Copy include data, but exclude overwritten local stuff
          if (entry.include) {
            for (var includeKey in incl) {
              if (!local.hasOwnProperty(includeKey)) {
                result[includeKey] = incl[includeKey];
              }
            }
          }

          // Append local data
          for (var localKey in local) {
            result[localKey] = local[localKey];
          }
        } else {
          result = entry.style(states);
        }

        // Cache new entry and return
        if (!cache[theme.name]) {
          cache[theme.name] = {};
        }
        return cache[theme.name][unique] = result || null;
      }
    }
  });
  qx.theme.manager.Appearance.$$dbClassInfo = $$dbClassInfo;
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
      "qx.util.AliasManager": {},
      "qx.theme.manager.Color": {},
      "qx.io.ImageLoader": {},
      "qx.lang.String": {},
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.html.Image": {},
      "qx.html.Label": {},
      "qx.html.Element": {},
      "qx.util.ResourceManager": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.element.Decoration": {},
      "qx.lang.Type": {},
      "qx.bom.AnimationFrame": {},
      "qx.theme.manager.Font": {},
      "qx.lang.Object": {},
      "qx.theme.manager.Decoration": {},
      "qx.ui.core.queue.Layout": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.alphaimageloaderneeded": {
          "className": "qx.bom.client.Css"
        },
        "engine.name": {
          "className": "qx.bom.client.Engine",
          "load": true
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * The image class displays an image file
   *
   * This class supports image clipping, which means that multiple images can be combined
   * into one large image and only the relevant part is shown.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   var image = new qx.ui.basic.Image("icon/32/actions/format-justify-left.png");
   *
   *   this.getRoot().add(image);
   * </pre>
   *
   * This example create a widget to display the image
   * <code>icon/32/actions/format-justify-left.png</code>.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/image.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.ui.basic.Image", {
    extend: qx.ui.core.Widget,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param source {String?null} The URL of the image to display.
     */
    construct(source) {
      this.__contentElements__P_177_0 = {};
      qx.ui.core.Widget.constructor.call(this);
      if (source) {
        this.setSource(source);
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** The URL of the image. Setting it will possibly abort loading of current image. */
      source: {
        check: "String",
        init: null,
        nullable: true,
        event: "changeSource",
        apply: "_applySource",
        themeable: true
      },
      /**
       * Whether the image should be scaled to the given dimensions
       *
       * This is disabled by default because it prevents the usage
       * of image clipping when enabled.
       */
      scale: {
        check: "Boolean",
        init: false,
        event: "changeScale",
        themeable: true,
        apply: "_applyScale"
      },
      /**
       * Whether to preserve the image ratio (ie prevent distortion), and which dimension
       * to prioritise
       */
      forceRatio: {
        init: "auto",
        check: ["disabled", "height", "width", "auto"],
        apply: "_applyDimension"
      },
      /**
       * Whether to allow scaling the image up
       */
      allowScaleUp: {
        init: false,
        check: "Boolean",
        apply: "_applyDimension"
      },
      // overridden
      appearance: {
        refine: true,
        init: "image"
      },
      // overridden
      allowShrinkX: {
        refine: true,
        init: false
      },
      // overridden
      allowShrinkY: {
        refine: true,
        init: false
      },
      // overridden
      allowGrowX: {
        refine: true,
        init: false
      },
      // overridden
      allowGrowY: {
        refine: true,
        init: false
      },
      /**
       * Source of image to display if the image in the `source` property fails to load.
       */
      fallbackSource: {
        check: "String",
        init: null,
        nullable: true,
        event: "changeFallbackSource"
      }
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired if the image source can not be loaded. This event can only be
       * fired for the first loading of an unmanaged resource (external image).
       */
      loadingFailed: "qx.event.type.Event",
      /**
       * Fired if the image has been loaded. This is even true for managed
       * resources (images known by generator).
       */
      loaded: "qx.event.type.Event",
      /** Fired when the pending request has been aborted. */
      aborted: "qx.event.type.Event"
    },
    statics: {
      PLACEHOLDER_IMAGE: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __width__P_177_1: null,
      __height__P_177_2: null,
      __mode__P_177_3: null,
      __contentElements__P_177_0: null,
      __currentContentElement__P_177_4: null,
      __wrapper__P_177_5: null,
      __requestId__P_177_6: 0,
      /**
       * If the image in the `source` property failed to load.
       */
      __failedToLoad__P_177_7: false,
      /**
       * @type {string} The actual source of the image that we display.
       * While the `source` property is what we want to display,
       * this property is what we are actually showing.
       * This can be the `source` property but it can also be the `fallbackSource` property
       * if the image in the `source` property failed to load.
       */
      __sourceToDisplay__P_177_8: null,
      // overridden
      _onChangeTheme() {
        qx.ui.basic.Image.superclass.prototype._onChangeTheme.call(this);
        // restyle source (theme change might have changed the resolved url)
        this._styleSource();
      },
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      getContentElement() {
        return this.__getSuitableContentElement__P_177_9();
      },
      // overridden
      _createContentElement() {
        return this.__getSuitableContentElement__P_177_9();
      },
      // overridden
      _getContentHint() {
        return {
          width: this.__width__P_177_1 || 0,
          height: this.__height__P_177_2 || 0
        };
      },
      // overridden
      _applyDecorator(value, old) {
        qx.ui.basic.Image.superclass.prototype._applyDecorator.call(this, value, old);
        var source = this.__sourceToDisplay__P_177_8;
        source = qx.util.AliasManager.getInstance().resolve(source);
        var el = this.getContentElement();
        if (this.__wrapper__P_177_5) {
          el = el.getChild(0);
        }
        this.__setSource__P_177_10(el, source);
      },
      // overridden
      _applyTextColor(value) {
        if (this.__getMode__P_177_11() === "font") {
          var el = this.getContentElement();
          if (this.__wrapper__P_177_5) {
            el = el.getChild(0);
          }
          if (value) {
            el.setStyle("color", qx.theme.manager.Color.getInstance().resolve(value));
          } else {
            el.removeStyle("color");
          }
        }
      },
      // overridden
      _applyPadding(value, old, name) {
        qx.ui.basic.Image.superclass.prototype._applyPadding.call(this, value, old, name);
        var element = this.getContentElement();
        if (this.__wrapper__P_177_5) {
          element.getChild(0).setStyles({
            top: (this.getPaddingTop() || 0) + "px",
            left: (this.getPaddingLeft() || 0) + "px"
          });
        } else if (this.__getMode__P_177_11() === "font") {
          let bounds = this.getBounds() || {};
          element.setStyles({
            top: (bounds.top || 0) + (this.getPaddingTop() || 0) + "px",
            left: (bounds.left || 0) + (this.getPaddingLeft() || 0) + "px"
          });
        } else {
          element.setPadding(this.getPaddingLeft() || 0, this.getPaddingTop() || 0);
        }
      },
      renderLayout(left, top, width, height) {
        qx.ui.basic.Image.superclass.prototype.renderLayout.call(this, left, top, width, height);
        var element = this.getContentElement();
        if (this.__wrapper__P_177_5) {
          element.getChild(0).setStyles({
            width: width - (this.getPaddingLeft() || 0) - (this.getPaddingRight() || 0),
            height: height - (this.getPaddingTop() || 0) - (this.getPaddingBottom() || 0),
            top: this.getPaddingTop() || 0,
            left: this.getPaddingLeft() || 0
          });
        }
      },
      /*
      ---------------------------------------------------------------------------
        IMAGE API
      ---------------------------------------------------------------------------
      */

      // property apply, overridden
      _applyEnabled(value, old) {
        qx.ui.basic.Image.superclass.prototype._applyEnabled.call(this, value, old);
        if (this.__sourceToDisplay__P_177_8) {
          this._styleSource();
        }
      },
      // property apply
      _applySource(value, old) {
        // abort loading current image
        if (old) {
          if (qx.io.ImageLoader.isLoading(old)) {
            qx.io.ImageLoader.abort(old);
          }
        }
        this.__failedToLoad__P_177_7 = false;
        this.__sourceToDisplay__P_177_8 = value;
        this._styleSource();
      },
      // property apply
      _applyScale(value) {
        this._styleSource();
      },
      /**
       * Remembers the mode to keep track which contentElement is currently in use.
       * @param mode {String} internal mode (alphaScaled|scaled|nonScaled)
       */
      __setMode__P_177_12(mode) {
        this.__mode__P_177_3 = mode;
      },
      /**
       * Returns the current mode if set. Otherwise checks the current source and
       * the current scaling to determine the current mode.
       *
       * @return {String} current internal mode
       */
      __getMode__P_177_11() {
        if (this.__mode__P_177_3 == null) {
          var source = this.__sourceToDisplay__P_177_8;
          if (source && qx.lang.String.startsWith(source, "@")) {
            this.__mode__P_177_3 = "font";
          }
          var isPng = false;
          if (source != null) {
            isPng = source.endsWith(".png");
          }
          if (this.getScale() && isPng && qx.core.Environment.get("css.alphaimageloaderneeded")) {
            this.__mode__P_177_3 = "alphaScaled";
          } else if (this.getScale()) {
            this.__mode__P_177_3 = "scaled";
          } else {
            this.__mode__P_177_3 = "nonScaled";
          }
        }
        return this.__mode__P_177_3;
      },
      /**
       * Creates a contentElement suitable for the current mode
       *
       * @param mode {String} internal mode
       * @return {qx.html.Image} suitable image content element
       */
      __createSuitableContentElement__P_177_13(mode) {
        var scale;
        var tagName;
        var clazz = qx.html.Image;
        switch (mode) {
          case "font":
            clazz = qx.html.Label;
            scale = true;
            tagName = "div";
            break;
          case "alphaScaled":
            scale = true;
            tagName = "div";
            break;
          case "nonScaled":
            scale = false;
            tagName = "div";
            break;
          default:
            scale = true;
            tagName = "img";
            break;
        }
        var element = new clazz(tagName);
        element.connectObject(this);
        element.setStyles({
          overflowX: "hidden",
          overflowY: "hidden",
          boxSizing: "border-box"
        });
        if (mode == "font") {
          element.setRich(true);
          element.setStyle("line-height", "1");
        } else {
          element.setScale(scale);
          if (qx.core.Environment.get("css.alphaimageloaderneeded")) {
            var wrapper = this.__wrapper__P_177_5 = new qx.html.Element("div");
            element.connectObject(this);
            wrapper.setStyle("position", "absolute");
            wrapper.add(element);
            return wrapper;
          }
        }
        return element;
      },
      /**
       * Returns a contentElement suitable for the current mode
       *
       * @return {qx.html.Image} suitable image contentElement
       */
      __getSuitableContentElement__P_177_9() {
        if (this.$$disposed) {
          return null;
        }
        var mode = this.__getMode__P_177_11();
        if (this.__contentElements__P_177_0[mode] == null) {
          this.__contentElements__P_177_0[mode] = this.__createSuitableContentElement__P_177_13(mode);
        }
        var element = this.__contentElements__P_177_0[mode];
        if (!this.__currentContentElement__P_177_4) {
          this.__currentContentElement__P_177_4 = element;
        }
        return element;
      },
      /**
       * Applies the source to the clipped image instance or preload
       * an image to detect sizes and apply it afterwards.
       */
      _styleSource() {
        var AliasManager = qx.util.AliasManager.getInstance();
        var ResourceManager = qx.util.ResourceManager.getInstance();
        var source = AliasManager.resolve(this.__sourceToDisplay__P_177_8);
        var element = this.getContentElement();
        if (this.__wrapper__P_177_5) {
          element = element.getChild(0);
        }
        if (!source) {
          this.__resetSource__P_177_14(element);
          return;
        }
        this.__checkForContentElementSwitch__P_177_15(source);
        if (qx.core.Environment.get("engine.name") == "mshtml" && (parseInt(qx.core.Environment.get("engine.version"), 10) < 9 || qx.core.Environment.get("browser.documentmode") < 9)) {
          var repeat = this.getScale() ? "scale" : "no-repeat";
          element.tagNameHint = qx.bom.element.Decoration.getTagName(repeat, source);
        }
        var contentEl = this.__getContentElement__P_177_16();

        // Detect if the image registry knows this image
        if (ResourceManager.isFontUri(source)) {
          this.__setManagedImage__P_177_17(contentEl, source);
          var color = this.getTextColor();
          if (qx.lang.Type.isString(color)) {
            this._applyTextColor(color, null);
          }
        } else if (ResourceManager.has(source)) {
          var highResolutionSource = ResourceManager.findHighResolutionSource(source);
          if (highResolutionSource) {
            var imageWidth = ResourceManager.getImageWidth(source);
            var imageHeight = ResourceManager.getImageHeight(source);
            this.setWidth(imageWidth);
            this.setHeight(imageHeight);

            // set background size on current element (div or img)
            var backgroundSize = imageWidth + "px, " + imageHeight + "px";
            this.__currentContentElement__P_177_4.setStyle("background-size", backgroundSize);
            this.setSource(highResolutionSource);
            source = highResolutionSource;
          }
          this.__setManagedImage__P_177_17(contentEl, source);
          this.__fireLoadEvent__P_177_18();
        } else if (qx.io.ImageLoader.isLoaded(source)) {
          this.__setUnmanagedImage__P_177_19(contentEl, source);
          this.__fireLoadEvent__P_177_18();
        } else {
          this.__loadUnmanagedImage__P_177_20(contentEl, source);
        }
      },
      /**
       * Helper function, which fires <code>loaded</code> event asynchronously.
       * It emulates native <code>loaded</code> event of an image object. This
       * helper will be called, if you try to load a managed image or an
       * previously loaded unmanaged image.
       */
      __fireLoadEvent__P_177_18() {
        this.__requestId__P_177_6++;
        qx.bom.AnimationFrame.request(function (rId) {
          // prevent firing of the event if source changed in the meantime
          if (rId === this.__requestId__P_177_6) {
            this.fireEvent("loaded");
          } else {
            this.fireEvent("aborted");
          }
        }.bind(this, this.__requestId__P_177_6));
      },
      /**
       * Returns the content element.
       * @return {qx.html.Image} content element
       */
      __getContentElement__P_177_16() {
        var contentEl = this.__currentContentElement__P_177_4;
        if (this.__wrapper__P_177_5) {
          contentEl = contentEl.getChild(0);
        }
        return contentEl;
      },
      /**
       * Checks if the current content element is capable to display the image
       * with the current settings (scaling, alpha PNG)
       *
       * @param source {String} source of the image
       */
      __checkForContentElementSwitch__P_177_15: qx.core.Environment.select("engine.name", {
        mshtml(source) {
          var alphaImageLoader = qx.core.Environment.get("css.alphaimageloaderneeded");
          var isPng = source.endsWith(".png");
          var isFont = source.startsWith("@");
          if (isFont) {
            this.__setMode__P_177_12("font");
          } else if (alphaImageLoader && isPng) {
            if (this.getScale() && this.__getMode__P_177_11() != "alphaScaled") {
              this.__setMode__P_177_12("alphaScaled");
            } else if (!this.getScale() && this.__getMode__P_177_11() != "nonScaled") {
              this.__setMode__P_177_12("nonScaled");
            }
          } else {
            if (this.getScale() && this.__getMode__P_177_11() != "scaled") {
              this.__setMode__P_177_12("scaled");
            } else if (!this.getScale() && this.__getMode__P_177_11() != "nonScaled") {
              this.__setMode__P_177_12("nonScaled");
            }
          }
          this.__checkForContentElementReplacement__P_177_21(this.__getSuitableContentElement__P_177_9());
        },
        default(source) {
          var isFont = source && qx.lang.String.startsWith(source, "@");
          if (isFont) {
            this.__setMode__P_177_12("font");
          } else if (this.getScale() && this.__getMode__P_177_11() != "scaled") {
            this.__setMode__P_177_12("scaled");
          } else if (!this.getScale() && this.__getMode__P_177_11() != "nonScaled") {
            this.__setMode__P_177_12("nonScaled");
          }
          this.__checkForContentElementReplacement__P_177_21(this.__getSuitableContentElement__P_177_9());
        }
      }),
      /**
       * Checks the current child and replaces it if necessary
       *
       * @param elementToAdd {qx.html.Image} content element to add
       */
      __checkForContentElementReplacement__P_177_21(elementToAdd) {
        var currentContentElement = this.__currentContentElement__P_177_4;
        if (currentContentElement != elementToAdd) {
          if (currentContentElement != null) {
            var pixel = "px";
            var styles = {};

            //inherit styles from current element
            var currentStyles = currentContentElement.getAllStyles();
            if (currentStyles) {
              for (var prop in currentStyles) {
                styles[prop] = currentStyles[prop];
              }
            }

            // Don't transfer background image when switching from image to icon font
            var mode = this.__getMode__P_177_11();
            if (mode === "font" || mode === "scaled") {
              delete styles.backgroundImage;
            }

            // Copy dimension and location of the current content element
            var bounds = this.getBounds();
            if (bounds != null) {
              styles.width = bounds.width + pixel;
              styles.height = bounds.height + pixel;
            }
            var insets = this.getInsets();
            styles.left = parseInt(currentContentElement.getStyle("left") || insets.left) + pixel;
            styles.top = parseInt(currentContentElement.getStyle("top") || insets.top) + pixel;
            styles.zIndex = 10;
            var newEl = this.__wrapper__P_177_5 ? elementToAdd.getChild(0) : elementToAdd;
            newEl.setStyles(styles, true);
            newEl.setSelectable(this.getSelectable());
            if (!currentContentElement.isVisible()) {
              elementToAdd.hide();
            } else if (!elementToAdd.isVisible()) {
              elementToAdd.show();
            }
            if (!currentContentElement.isIncluded()) {
              elementToAdd.exclude();
            } else if (!elementToAdd.isIncluded()) {
              elementToAdd.include();
            }
            var container = currentContentElement.getParent();
            if (container) {
              var index = container.getChildren().indexOf(currentContentElement);
              container.removeAt(index);
              container.addAt(elementToAdd, index);
            }
            // force re-application of source so __setSource is called again
            var hint = newEl.getNodeName();
            if (newEl.setSource) {
              newEl.setSource(null);
            } else {
              newEl.setValue("");
            }
            var currentEl = this.__getContentElement__P_177_16();
            newEl.tagNameHint = hint;
            newEl.setAttribute("class", currentEl.getAttribute("class"));
            var currentDomEl = currentEl.getDomElement();
            if (currentDomEl && !elementToAdd.getDomElement()) {
              // Flush elements to make sure the DOM elements are created.
              qx.html.Element.flush();
            }
            var newDomEl = elementToAdd.getDomElement();

            // copy event listeners
            var listeners = currentContentElement.getListeners() || [];
            listeners.forEach(function (listenerData) {
              elementToAdd.addListener(listenerData.type, listenerData.handler, listenerData.self, listenerData.capture);
            });
            if (currentDomEl && newDomEl) {
              // Switch the DOM elements' hash codes. This is required for the event
              // layer to work [BUG #7447]
              var currentHash = currentDomEl.$$hash;
              currentDomEl.$$hash = newDomEl.$$hash;
              newDomEl.$$hash = currentHash;
            }
            this.__currentContentElement__P_177_4 = elementToAdd;
          }
        }
      },
      /**
       * Use the ResourceManager to set a managed image
       *
       * @param el {Element} image DOM element
       * @param source {String} source path
       */
      __setManagedImage__P_177_17(el, source) {
        var ResourceManager = qx.util.ResourceManager.getInstance();
        var isFont = ResourceManager.isFontUri(source);

        // Try to find a disabled image in registry
        if (!this.getEnabled()) {
          var disabled = source.replace(/\.([a-z]+)$/, "-disabled.$1");
          if (!isFont && ResourceManager.has(disabled)) {
            source = disabled;
            this.addState("replacement");
          } else {
            this.removeState("replacement");
          }
        }

        // Optimize case for enabled changes when no disabled image was found
        if (!isFont && el.getSource() === source) {
          return;
        }

        // Special case for non resource manager handled font icons
        if (isFont) {
          // Don't use scale if size is set via postfix
          if (this.getScale() && parseInt(source.split("/")[2], 10)) {
            this.setScale(false);
          }

          // Adjust size if scaling is applied
          var width;
          var height;
          if (this.getScale()) {
            var hint = this.getSizeHint();
            width = this.getWidth() || hint.width;
            height = this.getHeight() || hint.height;
          } else {
            var font = this.__getFont__P_177_22(source);
            var size = parseInt(source.split("/")[2] || font.getSize(), 10);
            width = ResourceManager.getImageWidth(source) || size;
            height = ResourceManager.getImageHeight(source) || size;
          }
          this.__updateContentHint__P_177_23(width, height);
          this.__setSource__P_177_10(el, source);

          // Apply source
        } else {
          // Apply source
          this.__setSource__P_177_10(el, source);

          // Compare with old sizes and relayout if necessary
          this.__updateContentHint__P_177_23(ResourceManager.getImageWidth(source), ResourceManager.getImageHeight(source));
        }
      },
      __setFontSize__P_177_24(el, width, height) {
        if (this.getScale()) {
          el.setStyle("fontSize", (width > height ? height : width) + "px");
        } else {
          var source = qx.util.AliasManager.getInstance().resolve(this.__sourceToDisplay__P_177_8);
          var sparts = source.split("/");
          var font = this.__getFont__P_177_22(source);
          var size = parseInt(sparts[2] || font.getSize());
          el.setStyle("fontSize", size + "px");
        }
      },
      _applyDimension() {
        qx.ui.basic.Image.superclass.prototype._applyDimension.call(this);
        var isFont = this.__sourceToDisplay__P_177_8 && qx.lang.String.startsWith(this.__sourceToDisplay__P_177_8, "@");
        if (isFont) {
          var el = this.getContentElement();
          if (el) {
            var hint = this.getSizeHint();
            var width = this.getWidth() || hint.width || 40;
            var height = this.getHeight() || hint.height || 40;
            this.__setFontSize__P_177_24(el, width, height);
          }
        } else {
          this.__updateContentHint__P_177_23();
        }
      },
      /**
       * Use the infos of the ImageLoader to set an unmanaged image
       *
       * @param el {Element} image DOM element
       * @param source {String} source path
       */
      __setUnmanagedImage__P_177_19(el, source) {
        var ImageLoader = qx.io.ImageLoader;

        // Apply source
        this.__setSource__P_177_10(el, source);

        // Compare with old sizes and relayout if necessary
        var width = ImageLoader.getWidth(source);
        var height = ImageLoader.getHeight(source);
        this.__updateContentHint__P_177_23(width, height);
      },
      /**
       * Use the ImageLoader to load an unmanaged image
       *
       * @param el {Element} image DOM element
       * @param source {String} source path
       */
      __loadUnmanagedImage__P_177_20(el, source) {
        var ImageLoader = qx.io.ImageLoader;
        {
          // loading external images via HTTP/HTTPS is a common usecase, as is
          // using data URLs.
          var sourceLC = source.toLowerCase();
          if (!sourceLC.startsWith("http") && !sourceLC.startsWith("data:image/")) {
            var self = qx.ui.basic.Image;
            if (!self.__warned__P_177_25) {
              self.__warned__P_177_25 = {};
            }
            if (!self.__warned__P_177_25[source]) {
              this.debug("try to load an unmanaged relative image: " + source);
              self.__warned__P_177_25[source] = true;
            }
          }
        }

        // only try to load the image if it not already failed
        if (!ImageLoader.isFailed(source)) {
          ImageLoader.load(source, this.__loaderCallback__P_177_26, this);
        } else {
          this.__resetSource__P_177_14(el);
          if (!this.__failedToLoad__P_177_7 && this.getFallbackSource()) {
            this.__failedToLoad__P_177_7 = true;
            this.__sourceToDisplay__P_177_8 = this.getFallbackSource();
            this._styleSource();
          }
        }
      },
      /**
       * Reset source displayed by the DOM element.
       *
       * @param el {Element} image DOM element
       */
      __resetSource__P_177_14(el) {
        if (el != null) {
          if (el instanceof qx.html.Image) {
            el.resetSource();
          } else {
            el.resetValue();
          }
        }
      },
      __getFont__P_177_22(source) {
        var font = qx.theme.manager.Font.getInstance().resolve(source.match(/@([^/]+)/)[1]);
        if (typeof font == "string") {
          throw new Error(`Cannot find font in virtual image source: '${source}'`);
        }
        return font;
      },
      /**
       * Sets image source on the DOM element
       * Combines the decorator's image styles with our own image to make sure
       * gradient and backgroundImage decorators work on Images.
       *
       * @param el {Element} image DOM element
       * @param source {String} source path
       */
      __setSource__P_177_10(el, source) {
        var isFont = source && qx.lang.String.startsWith(source, "@");
        if (isFont) {
          var ResourceManager = qx.util.ResourceManager.getInstance();
          var font = this.__getFont__P_177_22(source);
          var fontStyles = qx.lang.Object.clone(font.getStyles());
          delete fontStyles.color;
          el.setStyles(fontStyles);
          el.setStyle("font");
          el.setStyle("display", "table-cell");
          el.setStyle("verticalAlign", "middle");
          el.setStyle("textAlign", "center");
          this.__setFontSize__P_177_24(el, this.__width__P_177_1, this.__height__P_177_2);
          var charCode = ResourceManager.fromFontUriToCharCode(source);
          el.setValue(String.fromCharCode(charCode));
          return;
        } else if (el.getNodeName() == "div") {
          // checks if a decorator already set.
          // In this case we have to merge background styles
          var decorator = qx.theme.manager.Decoration.getInstance().resolve(this.getDecorator());
          if (decorator) {
            var hasGradient = decorator.getStartColor() && decorator.getEndColor();
            var hasBackground = decorator.getBackgroundImage();
            if (hasGradient || hasBackground) {
              var repeat = this.getScale() ? "scale" : "no-repeat";

              // get the style attributes for the given source
              var attr = qx.bom.element.Decoration.getAttributes(source, repeat);
              // get the background image(s) defined by the decorator
              var decoratorStyle = decorator.getStyles(true);
              var combinedStyles = {
                backgroundImage: attr.style.backgroundImage,
                backgroundPosition: attr.style.backgroundPosition || "0 0",
                backgroundRepeat: attr.style.backgroundRepeat || "no-repeat",
                position: "absolute"
              };
              if (hasBackground) {
                combinedStyles["backgroundPosition"] += "," + decoratorStyle["background-position"] || "0 0";
                combinedStyles["backgroundRepeat"] += ", " + decorator.getBackgroundRepeat();
              }
              if (hasGradient) {
                combinedStyles["backgroundPosition"] += ", 0 0";
                combinedStyles["backgroundRepeat"] += ", no-repeat";
              }
              combinedStyles["backgroundImage"] += "," + (decoratorStyle["background-image"] || decoratorStyle["background"]);

              // apply combined background images
              el.setStyles(combinedStyles);
              return;
            }
          } else {
            // force re-apply to remove old decorator styles
            if (el.setSource) {
              el.setSource(null);
            }
          }
        }
        if (el.setSource) {
          el.setSource(source);
          el.setStyle("position", "absolute");
        }
      },
      /**
       * Tries to display the image in the `source` property again if it has failed to load.
       */
      tryReload() {
        if (!this.__failedToLoad__P_177_7) {
          return;
        }
        this.__failedToLoad__P_177_7 = false;
        this.__sourceToDisplay__P_177_8 = this.getSource();
        qx.io.ImageLoader.load(this.getSource(), () => this._styleSource(), undefined, {
          retryFailed: true
        });
      },
      /**
       * @returns {boolean} If the image in the `source` property failed to load.
       */
      hasFailedToLoad() {
        return this.__failedToLoad__P_177_7;
      },
      /**
       * Event handler fired after the preloader has finished loading the icon
       *
       * @param source {String} Image source which was loaded
       * @param imageInfo {Map} Dimensions of the loaded image
       */
      __loaderCallback__P_177_26(source, imageInfo) {
        // Ignore the callback on already disposed images
        if (this.$$disposed === true) {
          return;
        }

        // Ignore when the source has already been modified
        if (source !== qx.util.AliasManager.getInstance().resolve(this.__sourceToDisplay__P_177_8)) {
          this.fireEvent("aborted");
          return;
        }

        /// Output a warning if the image could not loaded and quit
        if (imageInfo.failed) {
          this.warn("Image could not be loaded: " + source);
          this.fireEvent("loadingFailed");
          if (!this.__failedToLoad__P_177_7 && this.getFallbackSource()) {
            this.__failedToLoad__P_177_7 = true;
            this.__sourceToDisplay__P_177_8 = this.getFallbackSource();
            this._styleSource();
            return;
          }
        } else if (imageInfo.aborted) {
          this.fireEvent("aborted");
          return;
        } else {
          this.fireEvent("loaded");
        }

        // Update image
        this.__setUnmanagedImage__P_177_19(this.__getContentElement__P_177_16(), source);
      },
      /**
       * Updates the content hint when the image size has been changed
       *
       * @param width {Integer} width of the image
       * @param height {Integer} height of the image
       */
      __updateContentHint__P_177_23(width, height) {
        if (width === undefined) {
          width = this.__width__P_177_1;
        }
        if (height === undefined) {
          height = this.__height__P_177_2;
        }
        if (this._recalc(width, height)) {
          qx.ui.core.queue.Layout.add(this);
        }
      },
      /**
       * Recalculates the size of the image, according to scaling parameters
       * @param maxWidth {Integer?} maximum width restriction
       * @param maxHeight {Integer?} minimum height restriction
       */
      _recalc(originalWidth, originalHeight) {
        var maxWidth = this.getMaxWidth();
        var maxHeight = this.getMaxHeight();
        var minWidth = this.getMinWidth();
        var minHeight = this.getMinHeight();
        var width = originalWidth;
        var height = originalHeight;
        var ratio = originalHeight / originalWidth;
        switch (this.getForceRatio()) {
          case "height":
            if (maxHeight !== null && height > maxHeight) {
              height = maxHeight;
              width = height / ratio;
            } else if (height < minHeight) {
              height = minHeight;
              width = height / ratio;
            }
            if (height < maxHeight && this.isAllowScaleUp()) {
              height = maxHeight;
              width = height / ratio;
            }
            break;
          case "width":
            if (maxWidth !== null && width > maxWidth) {
              width = maxWidth;
              height = width * ratio;
            } else if (width < minWidth) {
              width = minWidth;
              height = width * ratio;
            }
            if (width < maxWidth && this.isAllowScaleUp()) {
              width = maxWidth;
              height = width * ratio;
            }
            break;
          case "auto":
          case "bestfit":
            if (maxWidth !== null && width > maxWidth) {
              width = maxWidth;
              height = width * ratio;
            } else if (width < minWidth) {
              width = minWidth;
              height = width * ratio;
            }
            if (width < maxWidth && this.isAllowScaleUp()) {
              width = maxWidth;
              height = width * ratio;
            }
            if (maxHeight !== null && height > maxHeight) {
              height = maxHeight;
              width = height / ratio;
            }
            break;
        }
        width = Math.round(width);
        height = Math.round(height);
        if (width != this.__width__P_177_1 || height != this.__height__P_177_2) {
          this.__width__P_177_1 = width;
          this.__height__P_177_2 = height;
          return true;
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
      for (var mode in this.__contentElements__P_177_0) {
        if (this.__contentElements__P_177_0.hasOwnProperty(mode)) {
          this.__contentElements__P_177_0[mode].disconnectObject(this);
        }
      }
      delete this.__currentContentElement__P_177_4;
      if (this.__wrapper__P_177_5) {
        delete this.__wrapper__P_177_5;
      }
      this._disposeMap("__contentElements__P_177_0");
    }
  });
  qx.ui.basic.Image.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.basic.Image": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MPlacement": {
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
   * This widget is used as feedback widget in drag and drop actions.
   */
  qx.Class.define("qx.ui.core.DragDropCursor", {
    extend: qx.ui.basic.Image,
    include: qx.ui.core.MPlacement,
    type: "singleton",
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.basic.Image.constructor.call(this);

      // Put above other stuff
      this.setZIndex(1e8);

      // Move using DOM
      this.setDomMove(true);

      // Automatically add to root
      var root = this.getApplicationRoot();
      root.add(this, {
        left: -1000,
        top: -1000
      });
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      appearance: {
        refine: true,
        init: "dragdrop-cursor"
      },
      /** The current drag&drop action */
      action: {
        check: ["alias", "copy", "move"],
        apply: "_applyAction",
        nullable: true
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    members: {
      // property apply
      _applyAction(value, old) {
        if (old) {
          this.removeState(old);
        }
        if (value) {
          this.addState(value);
        }
      }
    }
  });
  qx.ui.core.DragDropCursor.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.element.Style": {},
      "qx.dom.Node": {},
      "qx.bom.Viewport": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.element.BoxSizing": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "load": true,
          "className": "qx.bom.client.Engine"
        },
        "browser.quirksmode": {
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
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * jQuery Dimension Plugin
         http://jquery.com/
         Version 1.1.3
  
       Copyright:
         (c) 2007, Paul Bakaus & Brandon Aaron
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
       Authors:
         Paul Bakaus
         Brandon Aaron
  
  ************************************************************************ */

  /**
   * Query the location of an arbitrary DOM element in relation to its top
   * level body element. Works in all major browsers:
   *
   * * Mozilla 1.5 + 2.0
   * * Internet Explorer 6.0 + 7.0 (both standard & quirks mode)
   * * Opera 9.2
   * * Safari 3.0 beta
   *
   * @ignore(SVGElement)
   */
  qx.Bootstrap.define("qx.bom.element.Location", {
    statics: {
      /**
       * Queries a style property for the given element
       *
       * @param elem {Element} DOM element to query
       * @param style {String} Style property
       * @return {String} Value of given style property
       */
      __style__P_76_0(elem, style) {
        return qx.bom.element.Style.get(elem, style, qx.bom.element.Style.COMPUTED_MODE, false);
      },
      /**
       * Queries a style property for the given element and parses it to an integer value
       *
       * @param elem {Element} DOM element to query
       * @param style {String} Style property
       * @return {Integer} Value of given style property
       */
      __num__P_76_1(elem, style) {
        return parseInt(qx.bom.element.Style.get(elem, style, qx.bom.element.Style.COMPUTED_MODE, false), 10) || 0;
      },
      /**
       * Computes the scroll offset of the given element relative to the document
       * <code>body</code>.
       *
       * @param elem {Element} DOM element to query
       * @return {Map} Map which contains the <code>left</code> and <code>top</code> scroll offsets
       */
      __computeScroll__P_76_2(elem) {
        var left = 0,
          top = 0;
        // Find window
        var win = qx.dom.Node.getWindow(elem);
        left -= qx.bom.Viewport.getScrollLeft(win);
        top -= qx.bom.Viewport.getScrollTop(win);
        return {
          left: left,
          top: top
        };
      },
      /**
       * Computes the offset of the given element relative to the document
       * <code>body</code>.
       *
       * @param elem {Element} DOM element to query
       * @return {Map} Map which contains the <code>left</code> and <code>top</code> offsets
       */
      __computeBody__P_76_3: qx.core.Environment.select("engine.name", {
        mshtml(elem) {
          // Find body element
          var doc = qx.dom.Node.getDocument(elem);
          var body = doc.body;
          var left = 0;
          var top = 0;
          left -= body.clientLeft + doc.documentElement.clientLeft;
          top -= body.clientTop + doc.documentElement.clientTop;
          if (!qx.core.Environment.get("browser.quirksmode")) {
            left += this.__num__P_76_1(body, "borderLeftWidth");
            top += this.__num__P_76_1(body, "borderTopWidth");
          }
          return {
            left: left,
            top: top
          };
        },
        webkit(elem) {
          // Find body element
          var doc = qx.dom.Node.getDocument(elem);
          var body = doc.body;

          // Start with the offset
          var left = body.offsetLeft;
          var top = body.offsetTop;
          return {
            left: left,
            top: top
          };
        },
        gecko(elem) {
          // Find body element
          var body = qx.dom.Node.getDocument(elem).body;

          // Start with the offset
          var left = body.offsetLeft;
          var top = body.offsetTop;

          // Correct substracted border (only in content-box mode)
          if (qx.bom.element.BoxSizing.get(body) !== "border-box") {
            left += this.__num__P_76_1(body, "borderLeftWidth");
            top += this.__num__P_76_1(body, "borderTopWidth");
          }
          return {
            left: left,
            top: top
          };
        },
        // At the moment only correctly supported by Opera
        default(elem) {
          // Find body element
          var body = qx.dom.Node.getDocument(elem).body;

          // Start with the offset
          var left = body.offsetLeft;
          var top = body.offsetTop;
          return {
            left: left,
            top: top
          };
        }
      }),
      /**
       * Computes the sum of all offsets of the given element node.
       *
       * @signature function(elem)
       * @param elem {Element} DOM element to query
       * @return {Map} Map which contains the <code>left</code> and <code>top</code> offsets
       */
      __computeOffset__P_76_4(elem) {
        var rect = elem.getBoundingClientRect();

        // Firefox 3.0 alpha 6 (gecko 1.9) returns floating point numbers
        // use Math.round() to round them to style compatible numbers
        // MSHTML returns integer numbers
        return {
          left: Math.round(rect.left),
          top: Math.round(rect.top)
        };
      },
      /**
       * Computes the location of the given element in context of
       * the document dimensions.
       *
       * Supported modes:
       *
       * * <code>margin</code>: Calculate from the margin box of the element (bigger than the visual appearance: including margins of given element)
       * * <code>box</code>: Calculates the offset box of the element (default, uses the same size as visible)
       * * <code>border</code>: Calculate the border box (useful to align to border edges of two elements).
       * * <code>scroll</code>: Calculate the scroll box (relevant for absolute positioned content).
       * * <code>padding</code>: Calculate the padding box (relevant for static/relative positioned content).
       *
       * @param elem {Element} DOM element to query
       * @param mode {String?box} A supported option. See comment above.
       * @return {Map} Returns a map with <code>left</code>, <code>top</code>,
       *   <code>right</code> and <code>bottom</code> which contains the distance
       *   of the element relative to the document.
       */
      get(elem, mode) {
        if (elem.tagName == "BODY") {
          var location = this.__getBodyLocation__P_76_5(elem);
          var left = location.left;
          var top = location.top;
        } else {
          var body = this.__computeBody__P_76_3(elem);
          var offset = this.__computeOffset__P_76_4(elem);
          // Reduce by viewport scrolling.
          // Hint: getBoundingClientRect returns the location of the
          // element in relation to the viewport which includes
          // the scrolling
          var scroll = this.__computeScroll__P_76_2(elem);
          var left = offset.left + body.left - scroll.left;
          var top = offset.top + body.top - scroll.top;
        }
        var elementWidth;
        var elementHeight;
        if (elem instanceof SVGElement) {
          var rect = elem.getBoundingClientRect();
          elementWidth = rect.width;
          elementHeight = rect.height;
        } else {
          elementWidth = elem.offsetWidth;
          elementHeight = elem.offsetHeight;
        }
        var right = left + elementWidth;
        var bottom = top + elementHeight;
        if (mode) {
          // In this modes we want the size as seen from a child what means that we want the full width/height
          // which may be higher than the outer width/height when the element has scrollbars.
          if (mode == "padding" || mode == "scroll") {
            var overX = qx.bom.element.Style.get(elem, "overflowX");
            if (overX == "scroll" || overX == "auto") {
              right += elem.scrollWidth - elementWidth + this.__num__P_76_1(elem, "borderLeftWidth") + this.__num__P_76_1(elem, "borderRightWidth");
            }
            var overY = qx.bom.element.Style.get(elem, "overflowY");
            if (overY == "scroll" || overY == "auto") {
              bottom += elem.scrollHeight - elementHeight + this.__num__P_76_1(elem, "borderTopWidth") + this.__num__P_76_1(elem, "borderBottomWidth");
            }
          }
          switch (mode) {
            case "padding":
              left += this.__num__P_76_1(elem, "paddingLeft");
              top += this.__num__P_76_1(elem, "paddingTop");
              right -= this.__num__P_76_1(elem, "paddingRight");
              bottom -= this.__num__P_76_1(elem, "paddingBottom");
            // no break here

            case "scroll":
              left -= elem.scrollLeft;
              top -= elem.scrollTop;
              right -= elem.scrollLeft;
              bottom -= elem.scrollTop;
            // no break here

            case "border":
              left += this.__num__P_76_1(elem, "borderLeftWidth");
              top += this.__num__P_76_1(elem, "borderTopWidth");
              right -= this.__num__P_76_1(elem, "borderRightWidth");
              bottom -= this.__num__P_76_1(elem, "borderBottomWidth");
              break;
            case "margin":
              left -= this.__num__P_76_1(elem, "marginLeft");
              top -= this.__num__P_76_1(elem, "marginTop");
              right += this.__num__P_76_1(elem, "marginRight");
              bottom += this.__num__P_76_1(elem, "marginBottom");
              break;
          }
        }
        return {
          left: left,
          top: top,
          right: right,
          bottom: bottom
        };
      },
      /**
       * Get the location of the body element relative to the document.
       * @param body {Element} The body element.
       * @return {Map} map with the keys <code>left</code> and <code>top</code>
       */
      __getBodyLocation__P_76_5(body) {
        var top = body.offsetTop;
        var left = body.offsetLeft;
        top += this.__num__P_76_1(body, "marginTop");
        left += this.__num__P_76_1(body, "marginLeft");
        if (qx.core.Environment.get("engine.name") === "gecko") {
          top += this.__num__P_76_1(body, "borderLeftWidth");
          left += this.__num__P_76_1(body, "borderTopWidth");
        }
        return {
          left: left,
          top: top
        };
      },
      /**
       * Computes the location of the given element in context of
       * the document dimensions. For supported modes please
       * have a look at the {@link qx.bom.element.Location#get} method.
       *
       * @param elem {Element} DOM element to query
       * @param mode {String} A supported option. See comment above.
       * @return {Integer} The left distance
       *   of the element relative to the document.
       */
      getLeft(elem, mode) {
        return this.get(elem, mode).left;
      },
      /**
       * Computes the location of the given element in context of
       * the document dimensions. For supported modes please
       * have a look at the {@link qx.bom.element.Location#get} method.
       *
       * @param elem {Element} DOM element to query
       * @param mode {String} A supported option. See comment above.
       * @return {Integer} The top distance
       *   of the element relative to the document.
       */
      getTop(elem, mode) {
        return this.get(elem, mode).top;
      },
      /**
       * Computes the location of the given element in context of
       * the document dimensions. For supported modes please
       * have a look at the {@link qx.bom.element.Location#get} method.
       *
       * @param elem {Element} DOM element to query
       * @param mode {String} A supported option. See comment above.
       * @return {Integer} The right distance
       *   of the element relative to the document.
       */
      getRight(elem, mode) {
        return this.get(elem, mode).right;
      },
      /**
       * Computes the location of the given element in context of
       * the document dimensions. For supported modes please
       * have a look at the {@link qx.bom.element.Location#get} method.
       *
       * @param elem {Element} DOM element to query
       * @param mode {String} A supported option. See comment above.
       * @return {Integer} The bottom distance
       *   of the element relative to the document.
       */
      getBottom(elem, mode) {
        return this.get(elem, mode).bottom;
      },
      /**
       * Returns the distance between two DOM elements. For supported modes please
       * have a look at the {@link qx.bom.element.Location#get} method.
       *
       * @param elem1 {Element} First element
       * @param elem2 {Element} Second element
       * @param mode1 {String?null} Mode for first element
       * @param mode2 {String?null} Mode for second element
       * @return {Map} Returns a map with <code>left</code> and <code>top</code>
       *   which contains the distance of the elements from each other.
       */
      getRelative(elem1, elem2, mode1, mode2) {
        var loc1 = this.get(elem1, mode1);
        var loc2 = this.get(elem2, mode2);
        return {
          left: loc1.left - loc2.left,
          top: loc1.top - loc2.top,
          right: loc1.right - loc2.right,
          bottom: loc1.bottom - loc2.bottom
        };
      },
      /**
       * Returns the distance between the given element to its offset parent.
       *
       * @param elem {Element} DOM element to query
       * @return {Map} Returns a map with <code>left</code> and <code>top</code>
       *   which contains the distance of the elements from each other.
       */
      getPosition(elem) {
        return this.getRelative(elem, this.getOffsetParent(elem));
      },
      /**
       * Detects the offset parent of the given element
       *
       * @param element {Element} Element to query for offset parent
       * @return {Element} Detected offset parent
       */
      getOffsetParent(element) {
        // Ther is no offsetParent for SVG elements
        if (element instanceof SVGElement) {
          return document.body;
        }
        var offsetParent = element.offsetParent || document.body;
        var Style = qx.bom.element.Style;
        while (offsetParent && !/^body|html$/i.test(offsetParent.tagName) && Style.get(offsetParent, "position") === "static") {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent;
      }
    }
  });
  qx.bom.element.Location.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.queue.Manager": {}
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
   * The DisposeQueue registers all widgets which are should be disposed.
   * This queue makes it possible to remove widgets from the DOM using
   * the layout and element queues and dispose them afterwards.
   */
  qx.Class.define("qx.ui.core.queue.Dispose", {
    statics: {
      /** @type {Array} This contains all the queued widgets for the next flush. */
      __queue__P_113_0: [],
      /**
       * Adds a widget to the queue.
       *
       * Should only be used by {@link qx.ui.core.Widget}.
       *
       * @param widget {qx.ui.core.Widget} The widget to add.
       */
      add(widget) {
        var queue = this.__queue__P_113_0;
        if (queue.includes(widget)) {
          return;
        }
        queue.unshift(widget);
        qx.ui.core.queue.Manager.scheduleFlush("dispose");
      },
      /**
       * Whether the dispose queue is empty
       * @return {Boolean}
       * @internal
       */
      isEmpty() {
        return this.__queue__P_113_0.length == 0;
      },
      /**
       * Flushes the dispose queue.
       *
       * This is used exclusively by the {@link qx.ui.core.queue.Manager}.
       */
      flush() {
        // Dispose all registered objects
        var queue = this.__queue__P_113_0;
        for (var i = queue.length - 1; i >= 0; i--) {
          var widget = queue[i];
          queue.splice(i, 1);
          widget.dispose();
        }

        // Empty check
        if (queue.length != 0) {
          return;
        }

        // Recreate the array is cheaper compared to keep a sparse array over time
        this.__queue__P_113_0 = [];
      }
    }
  });
  qx.ui.core.queue.Dispose.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Array": {},
      "qx.lang.Object": {},
      "qx.ui.core.queue.Manager": {}
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
       * Mustafa Sak (msak)
  
  ************************************************************************ */

  /**
   * The widget queue handles the deferred computation of certain widget properties.
   * It is used e.g. for the tree to update the indentation of tree nodes.
   *
   * This queue calls the method {@link qx.ui.core.Widget#syncWidget} of each
   * queued widget before the layout queues are processed.
   */
  qx.Class.define("qx.ui.core.queue.Widget", {
    statics: {
      /** @type {Array} This contains all the queued widgets for the next flush. */
      __queue__P_114_0: [],
      /**
       * @type {Object} This contains a map of widgets hash ($$hash) and their
       * corresponding map of jobs.
       */
      __jobs__P_114_1: {},
      /**
       * Clears given job of a widget from the internal queue. If no jobs left, the
       * widget will be removed completely from queue. If job param is <code>null</code>
       * or <code>undefined</code> widget will be removed completely from queue.
       * Normally only used during interims disposes of one or a few widgets.
       *
       * @param widget {qx.ui.core.Widget} The widget to clear
       * @param job {String?} Job identifier. If not used, it will be converted to
       * "$$default".
       */
      remove(widget, job) {
        var queue = this.__queue__P_114_0;
        if (!queue.includes(widget)) {
          return;
        }
        var hash = widget.toHashCode();

        // remove widget and all corresponding jobs, if job param is not given.
        if (job == null) {
          qx.lang.Array.remove(queue, widget);
          delete this.__jobs__P_114_1[hash];
          return;
        }
        if (this.__jobs__P_114_1[hash]) {
          delete this.__jobs__P_114_1[hash][job];
          if (qx.lang.Object.getLength(this.__jobs__P_114_1[hash]) == 0) {
            qx.lang.Array.remove(queue, widget);
          }
        }
      },
      /**
       * Adds a widget to the queue. The second param can be used to identify
       * several jobs. You can add one job at once, which will be returned as
       * an map at flushing on method {@link qx.ui.core.Widget#syncWidget}.
       *
       * @param widget {qx.ui.core.Widget} The widget to add.
       * @param job {String?} Job identifier. If not used, it will be converted to
       * "$$default".
       */
      add(widget, job) {
        var queue = this.__queue__P_114_0;
        //add widget if not containing
        if (!queue.includes(widget)) {
          queue.unshift(widget);
        }

        //add job
        if (job == null) {
          job = "$$default";
        }
        var hash = widget.toHashCode();
        if (!this.__jobs__P_114_1[hash]) {
          this.__jobs__P_114_1[hash] = {};
        }
        this.__jobs__P_114_1[hash][job] = true;
        qx.ui.core.queue.Manager.scheduleFlush("widget");
      },
      /**
       * Flushes the widget queue.
       *
       * This is used exclusively by the {@link qx.ui.core.queue.Manager}.
       */
      flush() {
        // Process all registered widgets
        var queue = this.__queue__P_114_0;
        var obj, jobs;
        for (var i = queue.length - 1; i >= 0; i--) {
          // Order is important to allow the same widget to be requeued directly
          obj = queue[i];
          jobs = this.__jobs__P_114_1[obj.toHashCode()];
          queue.splice(i, 1);
          obj.syncWidget(jobs);
        }

        // Empty check
        if (queue.length != 0) {
          return;
        }

        // Recreate the array is cheaper compared to keep a sparse array over time
        this.__queue__P_114_0 = [];
        this.__jobs__P_114_1 = {};
      }
    }
  });
  qx.ui.core.queue.Widget.$$dbClassInfo = $$dbClassInfo;
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
        "construct": true,
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.theme.manager.Color": {},
      "qx.event.Registration": {},
      "qx.event.handler.Focus": {},
      "qx.ui.core.Widget": {},
      "qx.html.Blocker": {},
      "qx.event.type.Event": {},
      "qx.ui.core.FocusHandler": {},
      "qx.theme.manager.Meta": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.dyntheme": {
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
   * This class blocks events and can be included into all widgets.
   *
   * The {@link #block} and {@link #unblock} methods provided by this class can be used
   * to block any event from the widget. When blocked,
   * the blocker widget overlays the widget to block, including the padding area.
   *
   * @ignore(qx.ui.root.Abstract)
   */
  qx.Class.define("qx.ui.core.Blocker", {
    extend: qx.core.Object,
    events: {
      /**
       * Fires after {@link #block} executed.
       */
      blocked: "qx.event.type.Event",
      /**
       * Fires after {@link #unblock} executed.
       */
      unblocked: "qx.event.type.Event"
    },
    /**
     * Creates a blocker for the passed widget.
     *
     * @param widget {qx.ui.core.Widget} Widget which should be added the blocker
     */
    construct(widget) {
      qx.core.Object.constructor.call(this);
      this._widget = widget;
      widget.addListener("resize", this.__onBoundsChange__P_146_0, this);
      widget.addListener("move", this.__onBoundsChange__P_146_0, this);
      widget.addListener("disappear", this.__onWidgetDisappear__P_146_1, this);
      if (qx.Class.isDefined("qx.ui.root.Abstract") && widget instanceof qx.ui.root.Abstract) {
        this._isRoot = true;
        this.setKeepBlockerActive(true);
      }

      // dynamic theme switch

      this.__activeElements__P_146_2 = [];
      this.__focusElements__P_146_3 = [];
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Color of the blocker
       */
      color: {
        check: "Color",
        init: null,
        nullable: true,
        apply: "_applyColor",
        themeable: true
      },
      /**
       * Opacity of the blocker
       */
      opacity: {
        check: "Number",
        init: 1,
        apply: "_applyOpacity",
        themeable: true
      },
      /**
       * If this property is enabled, the blocker created with {@link #block}
       * will always stay activated. This means that the blocker then gets all keyboard
       * events, this is useful to block keyboard input on other widgets.
       * Take care that only one blocker instance will be kept active, otherwise your
       * browser will freeze.
       *
       * Setting this property to true is ignored, if the blocker is attached to a
       * widget with a focus handler, as this would mean that the focus handler
       * tries to activate the widget behind the blocker.
       *
       * fixes:
       *     https://github.com/qooxdoo/qooxdoo/issues/9449
       *     https://github.com/qooxdoo/qooxdoo/issues/8104
       */
      keepBlockerActive: {
        check: "Boolean",
        init: false
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __blocker__P_146_4: null,
      __blockerCount__P_146_5: 0,
      __activeElements__P_146_2: null,
      __focusElements__P_146_3: null,
      __timer__P_146_6: null,
      _widget: null,
      _isRoot: false,
      __appearListener__P_146_7: null,
      /**
       * Adjust html element size on layout resizes.
       *
       * @param e {qx.event.type.Data} event object
       */
      __onBoundsChange__P_146_0(e) {
        var data = e.getData();
        if (this.isBlocked()) {
          this._updateBlockerBounds(data);
        }
      },
      /**
       * Widget re-appears: Update blocker size/position and attach to (new) parent
       */
      __onWidgetAppear__P_146_8() {
        this._updateBlockerBounds(this._widget.getBounds());
        if (this._widget.isRootWidget()) {
          this._widget.getContentElement().add(this.getBlockerElement());
        } else {
          this._widget.getLayoutParent().getContentElement().add(this.getBlockerElement());
        }
      },
      /**
       * Remove the blocker if the widget disappears
       */
      __onWidgetDisappear__P_146_1() {
        if (this.isBlocked()) {
          this.getBlockerElement().getParent().remove(this.getBlockerElement());
          this._widget.addListenerOnce("appear", this.__onWidgetAppear__P_146_8, this);
        }
      },
      /**
       * set the blocker's size and position
       * @param bounds {Map} Map with the new width, height, left and top values
       */
      _updateBlockerBounds(bounds) {
        this.getBlockerElement().setStyles({
          width: bounds.width + "px",
          height: bounds.height + "px",
          left: bounds.left + "px",
          top: bounds.top + "px"
        });
      },
      // property apply
      _applyColor(value, old) {
        var color = qx.theme.manager.Color.getInstance().resolve(value);
        this.__setBlockersStyle__P_146_9("backgroundColor", color);
      },
      // property apply
      _applyOpacity(value, old) {
        this.__setBlockersStyle__P_146_9("opacity", value);
      },
      /**
       * Handler for the theme change.
       * @signature function()
       */
      _onChangeTheme: qx.core.Environment.select("qx.dyntheme", {
        true() {
          this._applyColor(this.getColor());
        },
        false: null
      }),
      /**
       * Set the style to all blockers (blocker and content blocker).
       *
       * @param key {String} The name of the style attribute.
       * @param value {String} The value.
       */
      __setBlockersStyle__P_146_9(key, value) {
        var blockers = [];
        this.__blocker__P_146_4 && blockers.push(this.__blocker__P_146_4);
        for (var i = 0; i < blockers.length; i++) {
          blockers[i].setStyle(key, value);
        }
      },
      /**
       * Backup the current active and focused widget.
       */
      _backupActiveWidget() {
        var focusHandler = qx.event.Registration.getManager(window).getHandler(qx.event.handler.Focus);
        var activeWidget = qx.ui.core.Widget.getWidgetByElement(focusHandler.getActive());
        var focusedWidget = qx.ui.core.Widget.getWidgetByElement(focusHandler.getFocus());
        this.__activeElements__P_146_2.push(activeWidget);
        this.__focusElements__P_146_3.push(focusedWidget);
        if (activeWidget) {
          activeWidget.deactivate();
        }
        if (focusedWidget && focusedWidget.isFocusable()) {
          focusedWidget.blur();
        }
      },
      /**
       * Restore the current active and focused widget.
       */
      _restoreActiveWidget() {
        var widget;
        var focusElementsLength = this.__focusElements__P_146_3.length;
        if (focusElementsLength > 0) {
          widget = this.__focusElements__P_146_3.pop();
          if (widget && !widget.isDisposed() && widget.isFocusable()) {
            widget.focus();
          }
        }
        var activeElementsLength = this.__activeElements__P_146_2.length;
        if (activeElementsLength > 0) {
          widget = this.__activeElements__P_146_2.pop();
          if (widget && !widget.isDisposed()) {
            widget.activate();
          }
        }
      },
      /**
       * Creates the blocker element.
       *
       * @return {qx.html.Element} The blocker element
       */
      __createBlockerElement__P_146_10() {
        return new qx.html.Blocker(this.getColor(), this.getOpacity());
      },
      /**
       * Get/create the blocker element
       *
       * @param widget {qx.ui.core.Widget} The blocker will be added to this
       * widget's content element
       * @return {qx.html.Element} The blocker element
       */
      getBlockerElement(widget) {
        if (!this.__blocker__P_146_4) {
          this.__blocker__P_146_4 = this.__createBlockerElement__P_146_10();
          this.__blocker__P_146_4.setStyle("zIndex", 15);
          if (!widget) {
            if (this._isRoot) {
              widget = this._widget;
            } else {
              widget = this._widget.getLayoutParent();
            }
          }
          widget.getContentElement().add(this.__blocker__P_146_4);
          this.__blocker__P_146_4.exclude();
        }
        return this.__blocker__P_146_4;
      },
      /**
       * Block all events from this widget by placing a transparent overlay widget,
       * which receives all events, exactly over the widget.
       */
      block() {
        this._block();
      },
      /**
       * Adds the blocker to the appropriate element and includes it.
       *
       * @param zIndex {Number} All child widgets with a zIndex below this value will be blocked
       * @param blockContent {Boolean} append the blocker to the widget's content if true
       */
      _block(zIndex, blockContent) {
        if (!this._isRoot && !this._widget.getLayoutParent()) {
          if (!this.__appearListener__P_146_7) {
            this.__appearListener__P_146_7 = this._widget.addListenerOnce("appear", this._block.bind(this, zIndex));
          }
          return;
        }
        var parent;
        if (this._isRoot || blockContent) {
          parent = this._widget;
        } else {
          parent = this._widget.getLayoutParent();
        }
        var blocker = this.getBlockerElement(parent);
        if (zIndex != null) {
          blocker.setStyle("zIndex", zIndex);
        }
        this.__blockerCount__P_146_5++;
        if (this.__blockerCount__P_146_5 < 2) {
          this._backupActiveWidget();
          var bounds = this._widget.getBounds();
          // no bounds -> widget not yet rendered -> bounds will be set on resize
          if (bounds) {
            this._updateBlockerBounds(bounds);
          }
          blocker.include();
          if (!blockContent) {
            blocker.activate();
          }
          blocker.addListener("deactivate", this.__activateBlockerElement__P_146_11, this);
          blocker.addListener("keypress", this.__stopTabEvent__P_146_12, this);
          blocker.addListener("keydown", this.__stopTabEvent__P_146_12, this);
          blocker.addListener("keyup", this.__stopTabEvent__P_146_12, this);
          this.fireEvent("blocked", qx.event.type.Event);
        }
      },
      /**
       * Returns whether the widget is blocked.
       *
       * @return {Boolean} Whether the widget is blocked.
       */
      isBlocked() {
        return this.__blockerCount__P_146_5 > 0;
      },
      /**
       * Unblock the widget blocked by {@link #block}, but it takes care of
       * the amount of {@link #block} calls. The blocker is only removed if
       * the number of {@link #unblock} calls is identical to {@link #block} calls.
       */
      unblock() {
        if (this.__appearListener__P_146_7) {
          this._widget.removeListenerById(this.__appearListener__P_146_7);
          this.__appearListener__P_146_7 = null;
        }
        if (!this.isBlocked()) {
          return;
        }
        this.__blockerCount__P_146_5--;
        if (this.__blockerCount__P_146_5 < 1) {
          this.__unblock__P_146_13();
          this.__blockerCount__P_146_5 = 0;
        }
      },
      /**
       * Unblock the widget blocked by {@link #block}, but it doesn't take care of
       * the amount of {@link #block} calls. The blocker is directly removed.
       */
      forceUnblock() {
        if (this.__appearListener__P_146_7) {
          this._widget.removeListenerById(this.__appearListener__P_146_7);
          this.__appearListener__P_146_7 = null;
        }
        if (!this.isBlocked()) {
          return;
        }
        this.__blockerCount__P_146_5 = 0;
        this.__unblock__P_146_13();
      },
      /**
       * Unblock the widget blocked by {@link #block}.
       */
      __unblock__P_146_13() {
        this._restoreActiveWidget();
        var blocker = this.getBlockerElement();
        blocker.removeListener("deactivate", this.__activateBlockerElement__P_146_11, this);
        blocker.removeListener("keypress", this.__stopTabEvent__P_146_12, this);
        blocker.removeListener("keydown", this.__stopTabEvent__P_146_12, this);
        blocker.removeListener("keyup", this.__stopTabEvent__P_146_12, this);
        blocker.exclude();
        this.fireEvent("unblocked", qx.event.type.Event);
      },
      /**
       * Block direct child widgets with a zIndex below <code>zIndex</code>
       *
       * @param zIndex {Integer} All child widgets with a zIndex below this value
       *     will be blocked
       */
      blockContent(zIndex) {
        this._block(zIndex, true);
      },
      /**
       * Stops the passed "Tab" event.
       *
       * @param e {qx.event.type.KeySequence} event to stop.
       */
      __stopTabEvent__P_146_12(e) {
        if (e.getKeyIdentifier() == "Tab") {
          e.stop();
        }
      },
      /**
       * Sets the blocker element to active.
       */
      __activateBlockerElement__P_146_11() {
        //
        // If this._widget is attached to the focus handler as a focus root,
        // activating the blocker after this widget was deactivated,
        // leads to the focus handler re-activate the widget behind
        // the blocker, loosing tab handling for this._widget which is
        // visually in front. Hence we prevent activating the
        // blocker in this situation.
        //
        // fixes:
        //  https://github.com/qooxdoo/qooxdoo/issues/9449
        //  https://github.com/qooxdoo/qooxdoo/issues/8104
        //
        if (this.getKeepBlockerActive() && !qx.ui.core.FocusHandler.getInstance().isFocusRoot(this._widget)) {
          this.getBlockerElement().activate();
        }
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      // remove dynamic theme listener
      if (false && this.__changeThemeBlockerListenerId__P_146_14) {
        qx.theme.manager.Meta.getInstance().removeListenerById(this.__changeThemeBlockerListenerId__P_146_14);
      }
      this._widget.removeListener("resize", this.__onBoundsChange__P_146_0, this);
      this._widget.removeListener("move", this.__onBoundsChange__P_146_0, this);
      this._widget.removeListener("appear", this.__onWidgetAppear__P_146_8, this);
      this._widget.removeListener("disappear", this.__onWidgetDisappear__P_146_1, this);
      if (this.__appearListener__P_146_7) {
        this._widget.removeListenerById(this.__appearListener__P_146_7);
      }
      this._disposeObjects("__blocker__P_146_4", "__timer__P_146_6");
      this.__activeElements__P_146_2 = this.__focusElements__P_146_3 = this._widget = null;
    }
  });
  qx.ui.core.Blocker.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.Stylesheet": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["html.stylesheet.createstylesheet", "html.stylesheet.insertrule", "html.stylesheet.deleterule", "html.stylesheet.addimport", "html.stylesheet.removeimport"],
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
   * This class contains checks related to Stylesheet objects.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.Stylesheet", {
    statics: {
      /**
       * Returns a stylesheet to be used for feature checks
       *
       * @return {StyleSheet} Stylesheet element
       */
      __getStylesheet__P_128_0() {
        if (!qx.bom.client.Stylesheet.__stylesheet__P_128_1) {
          qx.bom.client.Stylesheet.__stylesheet__P_128_1 = qx.bom.Stylesheet.createElement();
        }
        return qx.bom.client.Stylesheet.__stylesheet__P_128_1;
      },
      /**
       * Check for IE's non-standard document.createStyleSheet function.
       * In IE9 (standards mode), the typeof check returns "function" so false is
       * returned. This is intended since IE9 supports the DOM-standard
       * createElement("style") which should be used instead.
       *
       * @internal
       * @return {Boolean} <code>true</code> if the browser supports
       * document.createStyleSheet
       */
      getCreateStyleSheet() {
        return typeof document.createStyleSheet === "object";
      },
      /**
       * Check for stylesheet.insertRule. Legacy IEs do not support this.
       *
       * @internal
       * @return {Boolean} <code>true</code> if insertRule is supported
       */
      getInsertRule() {
        return typeof qx.bom.client.Stylesheet.__getStylesheet__P_128_0().insertRule === "function";
      },
      /**
       * Check for stylesheet.deleteRule. Legacy IEs do not support this.
       *
       * @internal
       * @return {Boolean} <code>true</code> if deleteRule is supported
       */
      getDeleteRule() {
        return typeof qx.bom.client.Stylesheet.__getStylesheet__P_128_0().deleteRule === "function";
      },
      /**
       * Decides whether to use the legacy IE-only stylesheet.addImport or the
       * DOM-standard stylesheet.insertRule('@import [...]')
       *
       * @internal
       * @return {Boolean} <code>true</code> if stylesheet.addImport is supported
       */
      getAddImport() {
        return typeof qx.bom.client.Stylesheet.__getStylesheet__P_128_0().addImport === "object";
      },
      /**
       * Decides whether to use the legacy IE-only stylesheet.removeImport or the
       * DOM-standard stylesheet.deleteRule('@import [...]')
       *
       * @internal
       * @return {Boolean} <code>true</code> if stylesheet.removeImport is supported
       */
      getRemoveImport() {
        return typeof qx.bom.client.Stylesheet.__getStylesheet__P_128_0().removeImport === "object";
      }
    },
    defer(statics) {
      qx.core.Environment.add("html.stylesheet.createstylesheet", statics.getCreateStyleSheet);
      qx.core.Environment.add("html.stylesheet.insertrule", statics.getInsertRule);
      qx.core.Environment.add("html.stylesheet.deleterule", statics.getDeleteRule);
      qx.core.Environment.add("html.stylesheet.addimport", statics.getAddImport);
      qx.core.Environment.add("html.stylesheet.removeimport", statics.getRemoveImport);
    }
  });
  qx.bom.client.Stylesheet.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.bom.client.Stylesheet": {
        "require": true
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Assert": {},
      "qx.dom.Element": {},
      "qx.util.Uri": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "html.stylesheet.createstylesheet": {
          "className": "qx.bom.client.Stylesheet"
        },
        "html.stylesheet.insertrule": {
          "className": "qx.bom.client.Stylesheet"
        },
        "html.stylesheet.deleterule": {
          "className": "qx.bom.client.Stylesheet"
        },
        "html.stylesheet.addimport": {
          "className": "qx.bom.client.Stylesheet"
        },
        "html.stylesheet.removeimport": {
          "className": "qx.bom.client.Stylesheet"
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
       2006 STZ-IDA, Germany, http://www.stz-ida.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Andreas Junghans (lucidcake)
  
  ************************************************************************ */

  /**
   * Cross-browser wrapper to work with CSS stylesheets.
   * @require(qx.bom.client.Stylesheet)
   */
  qx.Bootstrap.define("qx.bom.Stylesheet", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Include a CSS file
       *
       * <em>Note:</em> Using a resource ID as the <code>href</code> parameter
       * will no longer be supported. Call
       * <code>qx.util.ResourceManager.getInstance().toUri(href)</code> to get
       * valid URI to be used with this method.
       *
       * @param href {String} Href value
       * @param doc {Document?} Document to modify
       */
      includeFile(href, doc) {
        if (!doc) {
          doc = document;
        }
        var el = doc.createElement("link");
        el.type = "text/css";
        el.rel = "stylesheet";
        el.href = href;
        var head = doc.getElementsByTagName("head")[0];
        head.appendChild(el);
      },
      /**
       * Create a new Stylesheet node and append it to the document
       *
       * @param text {String?} optional string of css rules
       * @return {StyleSheet} the generates stylesheet element
       */
      createElement(text) {
        if (qx.core.Environment.get("html.stylesheet.createstylesheet")) {
          var sheet = document.createStyleSheet();
          if (text) {
            sheet.cssText = text;
          }
          return sheet;
        } else {
          var elem = document.createElement("style");
          elem.type = "text/css";
          if (text) {
            elem.appendChild(document.createTextNode(text));
          }
          document.getElementsByTagName("head")[0].appendChild(elem);
          return elem.sheet;
        }
      },
      /**
       * Insert a new CSS rule into a given Stylesheet
       *
       * @param sheet {Object} the target Stylesheet object
       * @param selector {String} the selector
       * @param entry {String} style rule
       */
      addRule(sheet, selector, entry) {
        {
          var msg = "qx.bom.Stylesheet.addRule: The rule '" + entry + "' for the selector '" + selector + "' must not be enclosed in braces";
          qx.core.Assert.assertFalse(/^\s*?\{.*?\}\s*?$/.test(entry), msg);
        }
        if (qx.core.Environment.get("html.stylesheet.insertrule")) {
          sheet.insertRule(selector + "{" + entry + "}", sheet.cssRules.length);
        } else {
          sheet.addRule(selector, entry);
        }
      },
      /**
       * Remove a CSS rule from a stylesheet
       *
       * @param sheet {Object} the Stylesheet
       * @param selector {String} the Selector of the rule to remove
       */
      removeRule(sheet, selector) {
        if (qx.core.Environment.get("html.stylesheet.deleterule")) {
          var rules = sheet.cssRules;
          var len = rules.length;
          for (var i = len - 1; i >= 0; --i) {
            if (rules[i].selectorText == selector) {
              sheet.deleteRule(i);
            }
          }
        } else {
          var rules = sheet.rules;
          var len = rules.length;
          for (var i = len - 1; i >= 0; --i) {
            if (rules[i].selectorText == selector) {
              sheet.removeRule(i);
            }
          }
        }
      },
      /**
       * Remove the given sheet from its owner.
       * @param sheet {Object} the stylesheet object
       */
      removeSheet(sheet) {
        var owner = sheet.ownerNode ? sheet.ownerNode : sheet.owningElement;
        qx.dom.Element.removeChild(owner, owner.parentNode);
      },
      /**
       * Remove all CSS rules from a stylesheet
       *
       * @param sheet {Object} the stylesheet object
       */
      removeAllRules(sheet) {
        if (qx.core.Environment.get("html.stylesheet.deleterule")) {
          var rules = sheet.cssRules;
          var len = rules.length;
          for (var i = len - 1; i >= 0; i--) {
            sheet.deleteRule(i);
          }
        } else {
          var rules = sheet.rules;
          var len = rules.length;
          for (var i = len - 1; i >= 0; i--) {
            sheet.removeRule(i);
          }
        }
      },
      /**
       * Add an import of an external CSS file to a stylesheet
       *
       * @param sheet {Object} the stylesheet object
       * @param url {String} URL of the external stylesheet file
       */
      addImport(sheet, url) {
        if (qx.core.Environment.get("html.stylesheet.addimport")) {
          sheet.addImport(url);
        } else {
          sheet.insertRule('@import "' + url + '";', sheet.cssRules.length);
        }
      },
      /**
       * Removes an import from a stylesheet
       *
       * @param sheet {Object} the stylesheet object
       * @param url {String} URL of the imported CSS file
       */
      removeImport(sheet, url) {
        if (qx.core.Environment.get("html.stylesheet.removeimport")) {
          var imports = sheet.imports;
          var len = imports.length;
          for (var i = len - 1; i >= 0; i--) {
            if (imports[i].href == url || imports[i].href == qx.util.Uri.getAbsolute(url)) {
              sheet.removeImport(i);
            }
          }
        } else {
          var rules = sheet.cssRules;
          var len = rules.length;
          for (var i = len - 1; i >= 0; i--) {
            if (rules[i].href == url) {
              sheet.deleteRule(i);
            }
          }
        }
      },
      /**
       * Remove all imports from a stylesheet
       *
       * @param sheet {Object} the stylesheet object
       */
      removeAllImports(sheet) {
        if (qx.core.Environment.get("html.stylesheet.removeimport")) {
          var imports = sheet.imports;
          var len = imports.length;
          for (var i = len - 1; i >= 0; i--) {
            sheet.removeImport(i);
          }
        } else {
          var rules = sheet.cssRules;
          var len = rules.length;
          for (var i = len - 1; i >= 0; i--) {
            if (rules[i].type == rules[i].IMPORT_RULE) {
              sheet.deleteRule(i);
            }
          }
        }
      }
    }
  });
  qx.bom.Stylesheet.$$dbClassInfo = $$dbClassInfo;
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
        "defer": "load",
        "require": true
      },
      "qx.bom.client.Browser": {
        "defer": "load",
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "defer": true,
          "className": "qx.bom.client.Engine"
        },
        "engine.version": {
          "defer": true,
          "className": "qx.bom.client.Engine"
        },
        "browser.documentmode": {
          "defer": true,
          "className": "qx.bom.client.Browser"
        },
        "browser.quirksmode": {
          "defer": true,
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
  
  ************************************************************************ */

  /**
   * Contains methods to control and query the element's cursor property
   */
  qx.Bootstrap.define("qx.bom.element.Cursor", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** Internal helper structure to map cursor values to supported ones */
      __map__P_162_0: {},
      /**
       * Compiles the given cursor into a CSS compatible string.
       *
       * @param cursor {String} Valid CSS cursor name
       * @return {String} CSS string
       */
      compile(cursor) {
        return "cursor:" + (this.__map__P_162_0[cursor] || cursor) + ";";
      },
      /**
       * Returns the computed cursor style for the given element.
       *
       * @param element {Element} The element to query
       * @param mode {Number} Choose one of the modes {@link qx.bom.element.Style#COMPUTED_MODE},
       *   {@link qx.bom.element.Style#CASCADED_MODE}, {@link qx.bom.element.Style#LOCAL_MODE}.
       *   The computed mode is the default one.
       * @return {String} Computed cursor value of the given element.
       */
      get(element, mode) {
        return qx.bom.element.Style.get(element, "cursor", mode, false);
      },
      /**
       * Applies a new cursor style to the given element
       *
       * @param element {Element} The element to modify
       * @param value {String} New cursor value to set
       */
      set(element, value) {
        element.style.cursor = this.__map__P_162_0[value] || value;
      },
      /**
       * Removes the local cursor style applied to the element
       *
       * @param element {Element} The element to modify
       */
      reset(element) {
        element.style.cursor = "";
      }
    },
    defer(statics) {
      // < IE 9
      if (qx.core.Environment.get("engine.name") == "mshtml" && (parseFloat(qx.core.Environment.get("engine.version")) < 9 || qx.core.Environment.get("browser.documentmode") < 9) && !qx.core.Environment.get("browser.quirksmode")) {
        statics.__map__P_162_0["nesw-resize"] = "ne-resize";
        statics.__map__P_162_0["nwse-resize"] = "nw-resize";
      }
    }
  });
  qx.bom.element.Cursor.$$dbClassInfo = $$dbClassInfo;
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
        "require": true
      },
      "qx.ui.layout.Util": {},
      "qx.lang.Type": {}
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
   * The Canvas is an extended Basic layout.
   *
   * It is possible to position a widget relative to the right or bottom edge of
   * the available space. It further supports stretching between left and right
   * or top and bottom e.g. <code>left=20</code> and <code>right=20</code> would
   * keep a margin of 20 pixels to both edges. The Canvas layout has support for
   * percent dimensions and locations.
   *
   * *Features*
   *
   * * Pixel dimensions and locations
   * * Percent dimensions and locations
   * * Stretching between left+right and top+bottom
   * * Minimum and maximum dimensions
   * * Children are automatically shrunk to their minimum dimensions if not enough space is available
   * * Auto sizing (ignoring percent values)
   * * Margins (also negative ones)
   *
   * *Item Properties*
   *
   * <ul>
   * <li><strong>left</strong> <em>(Integer|String)</em>: The left coordinate in pixel or as a percent string e.g. <code>20</code> or <code>30%</code>.</li>
   * <li><strong>top</strong> <em>(Integer|String)</em>: The top coordinate in pixel or as a percent string e.g. <code>20</code> or <code>30%</code>.</li>
   * <li><strong>right</strong> <em>(Integer|String)</em>: The right coordinate in pixel or as a percent string e.g. <code>20</code> or <code>30%</code>.</li>
   * <li><strong>bottom</strong> <em>(Integer|String)</em>: The bottom coordinate in pixel or as a percent string e.g. <code>20</code> or <code>30%</code>.</li>
   * <li><strong>edge</strong> <em>(Integer|String)</em>: The coordinate in pixels or as a percent string to be used for all four edges.
   * <li><strong>width</strong> <em>(String)</em>: A percent width e.g. <code>40%</code>.</li>
   * <li><strong>height</strong> <em>(String)</em>: A percent height e.g. <code>60%</code>.</li>
   * </ul>
   *
   * *Notes*
   *
   * <ul>
   * <li>Stretching (<code>left</code>-><code>right</code> or <code>top</code>-><code>bottom</code>)
   *   has a higher priority than the preferred dimensions</li>
   * <li>Stretching has a lower priority than the min/max dimensions.</li>
   * <li>Percent values have no influence on the size hint of the layout.</li>
   * </ul>
   *
   * *Example*
   *
   * Here is a little example of how to use the canvas layout.
   *
   * <pre class="javascript">
   * var container = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
   *
   * // simple positioning
   * container.add(new qx.ui.core.Widget(), {top: 10, left: 10});
   *
   * // stretch vertically with 10 pixel distance to the parent's top
   * // and bottom border
   * container.add(new qx.ui.core.Widget(), {top: 10, left: 10, bottom: 10});
   *
   * // percent positioning and size
   * container.add(new qx.ui.core.Widget(), {left: "50%", top: "50%", width: "25%", height: "40%"});
   * </pre>
   *
   * *External Documentation*
   *
   * <a href='https://qooxdoo.org/documentation/#/desktop/layout/canvas.md'>
   * Extended documentation</a> and links to demos of this layout in the qooxdoo manual.
   */
  qx.Class.define("qx.ui.layout.Canvas", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * If desktop mode is active, the children's minimum sizes are ignored
       * by the layout calculation. This is necessary to prevent the desktop
       * from growing if e.g. a window is moved beyond the edge of the desktop
       */
      desktop: {
        check: "Boolean",
        init: false
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
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          var layoutProperties = {
            top: 1,
            left: 1,
            bottom: 1,
            right: 1,
            width: 1,
            height: 1,
            edge: 1
          };
          this.assert(layoutProperties[name] == 1, "The property '" + name + "' is not supported by the Canvas layout!");
          if (name == "width" || name == "height") {
            this.assertMatch(value, qx.ui.layout.Util.PERCENT_VALUE);
          } else {
            if (typeof value === "number") {
              this.assertInteger(value);
            } else if (qx.lang.Type.isString(value)) {
              this.assertMatch(value, qx.ui.layout.Util.PERCENT_VALUE);
            } else {
              this.fail("Bad format of layout property '" + name + "': " + value + ". The value must be either an integer or an percent string.");
            }
          }
        },
        false: null
      }),
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        var children = this._getLayoutChildren();
        var child, size, props;
        var left, top, right, bottom, width, height;
        var marginTop, marginRight, marginBottom, marginLeft;
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          size = child.getSizeHint();
          props = child.getLayoutProperties();

          // Cache margins
          marginTop = child.getMarginTop();
          marginRight = child.getMarginRight();
          marginBottom = child.getMarginBottom();
          marginLeft = child.getMarginLeft();

          // **************************************
          //   Processing location
          // **************************************

          left = props.left != null ? props.left : props.edge;
          if (qx.lang.Type.isString(left)) {
            left = Math.round(parseFloat(left) * availWidth / 100);
          }
          right = props.right != null ? props.right : props.edge;
          if (qx.lang.Type.isString(right)) {
            right = Math.round(parseFloat(right) * availWidth / 100);
          }
          top = props.top != null ? props.top : props.edge;
          if (qx.lang.Type.isString(top)) {
            top = Math.round(parseFloat(top) * availHeight / 100);
          }
          bottom = props.bottom != null ? props.bottom : props.edge;
          if (qx.lang.Type.isString(bottom)) {
            bottom = Math.round(parseFloat(bottom) * availHeight / 100);
          }

          // **************************************
          //   Processing dimension
          // **************************************

          // Stretching has higher priority than dimension data
          if (left != null && right != null) {
            width = availWidth - left - right - marginLeft - marginRight;

            // Limit computed value
            if (width < size.minWidth) {
              width = size.minWidth;
            } else if (width > size.maxWidth) {
              width = size.maxWidth;
            }

            // Add margin
            left += marginLeft;
          } else {
            // Layout data has higher priority than data from size hint
            width = props.width;
            if (width == null) {
              width = size.width;
            } else {
              width = Math.round(parseFloat(width) * availWidth / 100);

              // Limit computed value
              if (width < size.minWidth) {
                width = size.minWidth;
              } else if (width > size.maxWidth) {
                width = size.maxWidth;
              }
            }

            // AlignX support.
            if (left == null && right == null) {
              switch (child.getAlignX()) {
                case "center":
                  left = Math.round((availWidth - size.width) / 2 - marginRight);
                  break;
                case "right":
                  right = 0;
                  break;
              }
            }
            if (right != null) {
              left = availWidth - width - right - marginRight;
            } else if (left == null) {
              left = marginLeft;
            } else {
              left += marginLeft;
            }
          }

          // Stretching has higher priority than dimension data
          if (top != null && bottom != null) {
            height = availHeight - top - bottom - marginTop - marginBottom;

            // Limit computed value
            if (height < size.minHeight) {
              height = size.minHeight;
            } else if (height > size.maxHeight) {
              height = size.maxHeight;
            }

            // Add margin
            top += marginTop;
          } else {
            // Layout data has higher priority than data from size hint
            height = props.height;
            if (height == null) {
              height = size.height;
            } else {
              height = Math.round(parseFloat(height) * availHeight / 100);

              // Limit computed value
              if (height < size.minHeight) {
                height = size.minHeight;
              } else if (height > size.maxHeight) {
                height = size.maxHeight;
              }
            }

            // AlignY support.
            if (top == null && bottom == null) {
              switch (child.getAlignY()) {
                case "middle":
                  top = Math.round((availHeight - size.height) / 2 - marginBottom);
                  break;
                case "bottom":
                  bottom = 0;
                  break;
              }
            }
            if (bottom != null) {
              top = availHeight - height - bottom - marginBottom;
            } else if (top == null) {
              top = marginTop;
            } else {
              top += marginTop;
            }
          }
          left += padding.left;
          top += padding.top;

          // Apply layout
          child.renderLayout(left, top, width, height);
        }
      },
      // overridden
      _computeSizeHint() {
        var neededWidth = 0,
          neededMinWidth = 0;
        var neededHeight = 0,
          neededMinHeight = 0;
        var width, minWidth;
        var height, minHeight;
        var children = this._getLayoutChildren();
        var child, props, hint;
        var desktop = this.isDesktop();
        var left, top, right, bottom;
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          props = child.getLayoutProperties();
          hint = child.getSizeHint();

          // Cache margins
          var marginX = child.getMarginLeft() + child.getMarginRight();
          var marginY = child.getMarginTop() + child.getMarginBottom();

          // Compute width
          width = hint.width + marginX;
          minWidth = hint.minWidth + marginX;
          left = props.left != null ? props.left : props.edge;
          if (left && typeof left === "number") {
            width += left;
            minWidth += left;
          }
          right = props.right != null ? props.right : props.edge;
          if (right && typeof right === "number") {
            width += right;
            minWidth += right;
          }
          neededWidth = Math.max(neededWidth, width);
          neededMinWidth = desktop ? 0 : Math.max(neededMinWidth, minWidth);

          // Compute height
          height = hint.height + marginY;
          minHeight = hint.minHeight + marginY;
          top = props.top != null ? props.top : props.edge;
          if (top && typeof top === "number") {
            height += top;
            minHeight += top;
          }
          bottom = props.bottom != null ? props.bottom : props.edge;
          if (bottom && typeof bottom === "number") {
            height += bottom;
            minHeight += bottom;
          }
          neededHeight = Math.max(neededHeight, height);
          neededMinHeight = desktop ? 0 : Math.max(neededMinHeight, minHeight);
        }
        return {
          width: neededWidth,
          minWidth: neededMinWidth,
          height: neededHeight,
          minHeight: neededMinHeight
        };
      }
    }
  });
  qx.ui.layout.Canvas.$$dbClassInfo = $$dbClassInfo;
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * This is the root element for a set of {@link qx.html.Element}s.
   *
   * To make other elements visible these elements must be inserted
   * into an root element at any level.
   *
   * A root element uses an existing DOM element where is assumed that
   * this element is always visible. In the easiest case, the root element
   * is identical to the document's body.
   */
  qx.Class.define("qx.html.Root", {
    extend: qx.html.Element,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Creates a root element
     *
     * @param elem {Element?null} DOM element to use
     */
    construct(elem) {
      qx.html.Element.constructor.call(this);
      if (elem != null) {
        this.useNode(elem);
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Sets the element to an already existing node. It will be
       * assumed that this DOM element is already visible e.g.
       * like a normal displayed element in the document's body.
       *
       * @param elem {Element} the dom element to set
       * @throws {Error} if the element is assigned again
       */
      useNode(elem) {
        // Base call
        qx.html.Root.superclass.prototype.useNode.call(this, elem);

        // Mark as root
        this.setRoot(true);

        // Register for synchronization
        qx.html.Element._modified[this.toHashCode()] = this;
      }
    }
  });
  qx.html.Root.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.Document": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
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
       * Sebastian Fastner (fastner)
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
   * Includes library functions to work with the client's viewport (window).
   * Orientation related functions are point to window.top as default.
   */
  qx.Bootstrap.define("qx.bom.Viewport", {
    statics: {
      /**
       * Returns the current width of the viewport (excluding the vertical scrollbar
       * if present).
       *
       * @param win {Window?window} The window to query
       * @return {Integer} The width of the viewable area of the page (excluding scrollbars).
       */
      getWidth(win) {
        var win = win || window;
        var doc = win.document;
        return qx.bom.Document.isStandardMode(win) ? doc.documentElement.clientWidth : doc.body.clientWidth;
      },
      /**
       * Returns the current height of the viewport (excluding the horizontal scrollbar
       * if present).
       *
       * @param win {Window?window} The window to query
       * @return {Integer} The Height of the viewable area of the page (excluding scrollbars).
       */
      getHeight(win) {
        var win = win || window;
        var doc = win.document;

        // [BUG #7785] Document element's clientHeight is calculated wrong on iPad iOS7
        if (qx.core.Environment.get("os.name") == "ios" && window.innerHeight != doc.documentElement.clientHeight) {
          return window.innerHeight;
        }
        return qx.bom.Document.isStandardMode(win) ? doc.documentElement.clientHeight : doc.body.clientHeight;
      },
      /**
       * Returns the scroll position of the viewport
       *
       * All clients except IE < 9 support the non-standard property <code>pageXOffset</code>.
       * As this is easier to evaluate we prefer this property over <code>scrollLeft</code>.
       * Since the window could differ from the one the application is running in, we can't
       * use a one-time environment check to decide which property to use.
       *
       * @param win {Window?window} The window to query
       * @return {Integer} Scroll position in pixels from left edge, always a positive integer or zero
       */
      getScrollLeft(win) {
        var win = win ? win : window;
        if (typeof win.pageXOffset !== "undefined") {
          return win.pageXOffset;
        }

        // Firefox is using 'documentElement.scrollLeft' and Chrome is using
        // 'document.body.scrollLeft'. For the other value each browser is returning
        // 0, so we can use this check to get the positive value without using specific
        // browser checks.
        var doc = win.document;
        return doc.documentElement.scrollLeft || doc.body.scrollLeft;
      },
      /**
       * Returns the scroll position of the viewport
       *
       * All clients except MSHTML support the non-standard property <code>pageYOffset</code>.
       * As this is easier to evaluate we prefer this property over <code>scrollTop</code>.
       * Since the window could differ from the one the application is running in, we can't
       * use a one-time environment check to decide which property to use.
       *
       * @param win {Window?window} The window to query
       * @return {Integer} Scroll position in pixels from top edge, always a positive integer or zero
       */
      getScrollTop(win) {
        var win = win ? win : window;
        if (typeof win.pageYOffset !== "undefined") {
          return win.pageYOffset;
        }

        // Firefox is using 'documentElement.scrollTop' and Chrome is using
        // 'document.body.scrollTop'. For the other value each browser is returning
        // 0, so we can use this check to get the positive value without using specific
        // browser checks.
        var doc = win.document;
        return doc.documentElement.scrollTop || doc.body.scrollTop;
      },
      /**
       * Returns an orientation normalizer value that should be added to device orientation
       * to normalize behaviour on different devices.
       *
       * @param win {Window} The window to query
       * @return {Map} Orientation normalizing value
       */
      __getOrientationNormalizer__P_97_0(win) {
        // Calculate own understanding of orientation (0 = portrait, 90 = landscape)
        var currentOrientation = this.getWidth(win) > this.getHeight(win) ? 90 : 0;
        var deviceOrientation = win.orientation;
        if (deviceOrientation == null || Math.abs(deviceOrientation % 180) == currentOrientation) {
          // No device orientation available or device orientation equals own understanding of orientation
          return {
            "-270": 90,
            "-180": 180,
            "-90": -90,
            0: 0,
            90: 90,
            180: 180,
            270: -90
          };
        } else {
          // Device orientation is not equal to own understanding of orientation
          return {
            "-270": 180,
            "-180": -90,
            "-90": 0,
            0: 90,
            90: 180,
            180: -90,
            270: 0
          };
        }
      },
      // Cache orientation normalizer map on start
      __orientationNormalizer__P_97_1: null,
      /**
       * Returns the current orientation of the viewport in degree.
       *
       * All possible values and their meaning:
       *
       * * <code>-90</code>: "Landscape"
       * * <code>0</code>: "Portrait"
       * * <code>90</code>: "Landscape"
       * * <code>180</code>: "Portrait"
       *
       * @param win {Window?window.top} The window to query. (Default = top window)
       * @return {Integer} The current orientation in degree
       */
      getOrientation(win) {
        // Set window.top as default, because orientationChange event is only fired top window
        var win = win || window.top;
        // The orientation property of window does not have the same behaviour over all devices
        // iPad has 0degrees = Portrait, Playbook has 90degrees = Portrait, same for Android Honeycomb
        //
        // To fix this an orientationNormalizer map is calculated on application start
        //
        // The calculation of getWidth and getHeight returns wrong values if you are in an input field
        // on iPad and rotate your device!
        var orientation = win.orientation;
        if (orientation == null) {
          // Calculate orientation from window width and window height
          orientation = this.getWidth(win) > this.getHeight(win) ? 90 : 0;
        } else {
          if (this.__orientationNormalizer__P_97_1 == null) {
            this.__orientationNormalizer__P_97_1 = this.__getOrientationNormalizer__P_97_0(win);
          }
          // Normalize orientation value
          orientation = this.__orientationNormalizer__P_97_1[orientation];
        }
        return orientation;
      },
      /**
       * Whether the viewport orientation is currently in landscape mode.
       *
       * @param win {Window?window} The window to query
       * @return {Boolean} <code>true</code> when the viewport orientation
       *     is currently in landscape mode.
       */
      isLandscape(win) {
        var orientation = this.getOrientation(win);
        return orientation === -90 || orientation === 90;
      },
      /**
       * Whether the viewport orientation is currently in portrait mode.
       *
       * @param win {Window?window} The window to query
       * @return {Boolean} <code>true</code> when the viewport orientation
       *     is currently in portrait mode.
       */
      isPortrait(win) {
        var orientation = this.getOrientation(win);
        return orientation === 0 || orientation === 180;
      }
    }
  });
  qx.bom.Viewport.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.lang.normalize.String": {
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.element.Style": {}
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
   * Contains methods to control and query the element's clip property
   *
   * @require(qx.lang.normalize.String)
   */
  qx.Bootstrap.define("qx.bom.element.Clip", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Compiles the given clipping into a CSS compatible string. This
       * is a simple square which describes the visible area of an DOM element.
       * Changing the clipping does not change the dimensions of
       * an element.
       *
       * @param map {Map}  Map which contains <code>left</code>, <code>top</code>
       *   <code>width</code> and <code>height</code> of the clipped area.
       * @return {String} CSS compatible string
       */
      compile(map) {
        if (!map) {
          return "clip:auto;";
        }
        var left = map.left;
        var top = map.top;
        var width = map.width;
        var height = map.height;
        var right, bottom;
        if (left == null) {
          right = width == null ? "auto" : width + "px";
          left = "auto";
        } else {
          right = width == null ? "auto" : left + width + "px";
          left = left + "px";
        }
        if (top == null) {
          bottom = height == null ? "auto" : height + "px";
          top = "auto";
        } else {
          bottom = height == null ? "auto" : top + height + "px";
          top = top + "px";
        }
        return "clip:rect(" + top + "," + right + "," + bottom + "," + left + ");";
      },
      /**
       * Gets the clipping of the given element.
       *
       * @param element {Element} DOM element to query
       * @param mode {Number} Choose one of the modes {@link qx.bom.element.Style#COMPUTED_MODE},
       *   {@link qx.bom.element.Style#CASCADED_MODE}, {@link qx.bom.element.Style#LOCAL_MODE}.
       *   The computed mode is the default one.
       * @return {Map} Map which contains <code>left</code>, <code>top</code>
       *   <code>width</code> and <code>height</code> of the clipped area.
       *   Each one could be null or any integer value.
       */
      get(element, mode) {
        var clip = qx.bom.element.Style.get(element, "clip", mode, false);
        var left, top, width, height;
        var right, bottom;
        if (typeof clip === "string" && clip !== "auto" && clip !== "") {
          clip = clip.trim();

          // Do not use "global" here. This will break Firefox because of
          // an issue that the lastIndex will not be reset on separate calls.
          if (/\((.*)\)/.test(clip)) {
            var result = RegExp.$1;

            // Process result
            // Some browsers store values space-separated, others comma-separated.
            // Handle both cases by means of feature-detection.
            if (/,/.test(result)) {
              var split = result.split(",");
            } else {
              var split = result.split(" ");
            }
            top = split[0].trim();
            right = split[1].trim();
            bottom = split[2].trim();
            left = split[3].trim();

            // Normalize "auto" to null
            if (left === "auto") {
              left = null;
            }
            if (top === "auto") {
              top = null;
            }
            if (right === "auto") {
              right = null;
            }
            if (bottom === "auto") {
              bottom = null;
            }

            // Convert to integer values
            if (top != null) {
              top = parseInt(top, 10);
            }
            if (right != null) {
              right = parseInt(right, 10);
            }
            if (bottom != null) {
              bottom = parseInt(bottom, 10);
            }
            if (left != null) {
              left = parseInt(left, 10);
            }

            // Compute width and height
            if (right != null && left != null) {
              width = right - left;
            } else if (right != null) {
              width = right;
            }
            if (bottom != null && top != null) {
              height = bottom - top;
            } else if (bottom != null) {
              height = bottom;
            }
          } else {
            throw new Error("Could not parse clip string: " + clip);
          }
        }

        // Return map when any value is available.
        return {
          left: left || null,
          top: top || null,
          width: width || null,
          height: height || null
        };
      },
      /**
       * Sets the clipping of the given element. This is a simple
       * square which describes the visible area of an DOM element.
       * Changing the clipping does not change the dimensions of
       * an element.
       *
       * @param element {Element} DOM element to modify
       * @param map {Map} A map with one or more of these available keys:
       *   <code>left</code>, <code>top</code>, <code>width</code>, <code>height</code>.
       */
      set(element, map) {
        if (!map) {
          element.style.clip = "rect(auto,auto,auto,auto)";
          return;
        }
        var left = map.left;
        var top = map.top;
        var width = map.width;
        var height = map.height;
        var right, bottom;
        if (left == null) {
          right = width == null ? "auto" : width + "px";
          left = "auto";
        } else {
          right = width == null ? "auto" : left + width + "px";
          left = left + "px";
        }
        if (top == null) {
          bottom = height == null ? "auto" : height + "px";
          top = "auto";
        } else {
          bottom = height == null ? "auto" : top + height + "px";
          top = top + "px";
        }
        element.style.clip = "rect(" + top + "," + right + "," + bottom + "," + left + ")";
      },
      /**
       * Resets the clipping of the given DOM element.
       *
       * @param element {Element} DOM element to modify
       */
      reset(element) {
        element.style.clip = "rect(auto, auto, auto, auto)";
      }
    }
  });
  qx.bom.element.Clip.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.bom.element.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "load": true,
          "className": "qx.bom.client.Engine"
        },
        "css.opacity": {
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
       * Christian Hagendorn (chris_schmidt)
  
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
   * Cross-browser opacity support.
   *
   * Optimized for animations (contains workarounds for typical flickering
   * in some browsers). Reduced class dependencies for optimal size and
   * performance.
   */
  qx.Bootstrap.define("qx.bom.element.Opacity", {
    statics: {
      /**
       * Compiles the given opacity value into a cross-browser CSS string.
       * Accepts numbers between zero and one
       * where "0" means transparent, "1" means opaque.
       *
       * @signature function(opacity)
       * @param opacity {Float} A float number between 0 and 1
       * @return {String} CSS compatible string
       */
      compile: qx.core.Environment.select("engine.name", {
        mshtml(opacity) {
          if (opacity >= 1) {
            opacity = 1;
          }
          if (opacity < 0.00001) {
            opacity = 0;
          }
          if (qx.core.Environment.get("css.opacity")) {
            return "opacity:" + opacity + ";";
          } else {
            return "zoom:1;filter:alpha(opacity=" + opacity * 100 + ");";
          }
        },
        default(opacity) {
          return "opacity:" + opacity + ";";
        }
      }),
      /**
       * Sets opacity of given element. Accepts numbers between zero and one
       * where "0" means transparent, "1" means opaque.
       *
       * @param element {Element} DOM element to modify
       * @param opacity {Float} A float number between 0 and 1
       * @signature function(element, opacity)
       */
      set: qx.core.Environment.select("engine.name", {
        mshtml(element, opacity) {
          if (qx.core.Environment.get("css.opacity")) {
            element.style.opacity = opacity;
          } else {
            // Read in computed filter
            var filter = qx.bom.element.Style.get(element, "filter", qx.bom.element.Style.COMPUTED_MODE, false);
            if (opacity >= 1) {
              opacity = 1;
            }
            if (opacity < 0.00001) {
              opacity = 0;
            }

            // IE has trouble with opacity if it does not have layout (hasLayout)
            // Force it by setting the zoom level
            if (!element.currentStyle || !element.currentStyle.hasLayout) {
              element.style.zoom = 1;
            }

            // Remove old alpha filter and add new one
            element.style.filter = filter.replace(/alpha\([^\)]*\)/gi, "") + "alpha(opacity=" + opacity * 100 + ")";
          }
        },
        default(element, opacity) {
          element.style.opacity = opacity;
        }
      }),
      /**
       * Resets opacity of given element.
       *
       * @param element {Element} DOM element to modify
       * @signature function(element)
       */
      reset: qx.core.Environment.select("engine.name", {
        mshtml(element) {
          if (qx.core.Environment.get("css.opacity")) {
            element.style.opacity = "";
          } else {
            // Read in computed filter
            var filter = qx.bom.element.Style.get(element, "filter", qx.bom.element.Style.COMPUTED_MODE, false);

            // Remove old alpha filter
            element.style.filter = filter.replace(/alpha\([^\)]*\)/gi, "");
          }
        },
        default(element) {
          element.style.opacity = "";
        }
      }),
      /**
       * Gets computed opacity of given element. Accepts numbers between zero and one
       * where "0" means transparent, "1" means opaque.
       *
       * @param element {Element} DOM element to modify
       * @param mode {Number} Choose one of the modes {@link qx.bom.element.Style#COMPUTED_MODE},
       *   {@link qx.bom.element.Style#CASCADED_MODE}, {@link qx.bom.element.Style#LOCAL_MODE}.
       *   The computed mode is the default one.
       * @return {Float} A float number between 0 and 1
       * @signature function(element, mode)
       */
      get: qx.core.Environment.select("engine.name", {
        mshtml(element, mode) {
          if (qx.core.Environment.get("css.opacity")) {
            var opacity = qx.bom.element.Style.get(element, "opacity", mode, false);
            if (opacity != null) {
              return parseFloat(opacity);
            }
            return 1.0;
          } else {
            var filter = qx.bom.element.Style.get(element, "filter", mode, false);
            if (filter) {
              var opacity = filter.match(/alpha\(opacity=(.*)\)/);
              if (opacity && opacity[1]) {
                return parseFloat(opacity[1]) / 100;
              }
            }
            return 1.0;
          }
        },
        default(element, mode) {
          var opacity = qx.bom.element.Style.get(element, "opacity", mode, false);
          if (opacity != null) {
            return parseFloat(opacity);
          }
          return 1.0;
        }
      })
    }
  });
  qx.bom.element.Opacity.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.bom.Style": {},
      "qx.log.Logger": {},
      "qx.bom.element.Style": {},
      "qx.bom.Document": {},
      "qx.dom.Node": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.boxsizing": {
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
  
  ************************************************************************ */

  /**
   * Contains methods to control and query the element's box-sizing property.
   *
   * Supported values:
   *
   * * "content-box" = W3C model (dimensions are content specific)
   * * "border-box" = Microsoft model (dimensions are box specific incl. border and padding)
   */
  qx.Bootstrap.define("qx.bom.element.BoxSizing", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Map} Internal data structure for __usesNativeBorderBox() */
      __nativeBorderBox__P_163_0: {
        tags: {
          button: true,
          select: true
        },
        types: {
          search: true,
          button: true,
          submit: true,
          reset: true,
          checkbox: true,
          radio: true
        }
      },
      /**
       * Whether the given elements defaults to the "border-box" Microsoft model in all cases.
       *
       * @param element {Element} DOM element to query
       * @return {Boolean} true when the element uses "border-box" independently from the doctype
       */
      __usesNativeBorderBox__P_163_1(element) {
        var map = this.__nativeBorderBox__P_163_0;
        return map.tags[element.tagName.toLowerCase()] || map.types[element.type];
      },
      /**
       * Compiles the given box sizing into a CSS compatible string.
       *
       * @param value {String} Valid CSS box-sizing value
       * @return {String} CSS string
       */
      compile(value) {
        if (qx.core.Environment.get("css.boxsizing")) {
          var prop = qx.bom.Style.getCssName(qx.core.Environment.get("css.boxsizing"));
          return prop + ":" + value + ";";
        } else {
          {
            qx.log.Logger.warn(this, "This client does not support dynamic modification of the boxSizing property.");
            qx.log.Logger.trace();
          }
        }
      },
      /**
       * Returns the box sizing for the given element.
       *
       * @param element {Element} The element to query
       * @return {String} Box sizing value of the given element.
       */
      get(element) {
        if (qx.core.Environment.get("css.boxsizing")) {
          return qx.bom.element.Style.get(element, "boxSizing", null, false) || "";
        }
        if (qx.bom.Document.isStandardMode(qx.dom.Node.getWindow(element))) {
          if (!this.__usesNativeBorderBox__P_163_1(element)) {
            return "content-box";
          }
        }
        return "border-box";
      },
      /**
       * Applies a new box sizing to the given element
       *
       * @param element {Element} The element to modify
       * @param value {String} New box sizing value to set
       */
      set(element, value) {
        if (qx.core.Environment.get("css.boxsizing")) {
          // IE8 bombs when trying to apply an unsupported value
          try {
            element.style[qx.core.Environment.get("css.boxsizing")] = value;
          } catch (ex) {
            {
              qx.log.Logger.warn(this, "This client does not support the boxSizing value", value);
            }
          }
        } else {
          {
            qx.log.Logger.warn(this, "This client does not support dynamic modification of the boxSizing property.");
          }
        }
      },
      /**
       * Removes the local box sizing applied to the element
       *
       * @param element {Element} The element to modify
       */
      reset(element) {
        this.set(element, "");
      }
    }
  });
  qx.bom.element.BoxSizing.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.lang.String": {
        "require": true,
        "defer": "runtime"
      },
      "qx.bom.client.Css": {
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
      "qx.lang.Object": {},
      "qx.bom.Style": {},
      "qx.bom.element.Clip": {
        "require": true
      },
      "qx.bom.element.Cursor": {
        "require": true
      },
      "qx.bom.element.Opacity": {
        "require": true
      },
      "qx.bom.element.BoxSizing": {
        "require": true
      },
      "qx.core.Assert": {},
      "qx.dom.Node": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.appearance": {
          "className": "qx.bom.client.Css"
        },
        "css.userselect": {
          "className": "qx.bom.client.Css"
        },
        "css.textoverflow": {
          "className": "qx.bom.client.Css"
        },
        "css.borderimage": {
          "className": "qx.bom.client.Css"
        },
        "css.float": {
          "className": "qx.bom.client.Css"
        },
        "css.usermodify": {
          "className": "qx.bom.client.Css"
        },
        "css.boxsizing": {
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
   * Style querying and modification of HTML elements.
   *
   * Automatically normalizes cross-browser differences for setting and reading
   * CSS attributes. Optimized for performance.
   *
   * @require(qx.lang.String)
   * @require(qx.bom.client.Css)
  
   * @require(qx.bom.element.Clip#set)
   * @require(qx.bom.element.Cursor#set)
   * @require(qx.bom.element.Opacity#set)
   * @require(qx.bom.element.BoxSizing#set)
  
   * @require(qx.bom.element.Clip#get)
   * @require(qx.bom.element.Cursor#get)
   * @require(qx.bom.element.Opacity#get)
   * @require(qx.bom.element.BoxSizing#get)
  
   * @require(qx.bom.element.Clip#reset)
   * @require(qx.bom.element.Cursor#reset)
   * @require(qx.bom.element.Opacity#reset)
   * @require(qx.bom.element.BoxSizing#reset)
  
   * @require(qx.bom.element.Clip#compile)
   * @require(qx.bom.element.Cursor#compile)
   * @require(qx.bom.element.Opacity#compile)
   * @require(qx.bom.element.BoxSizing#compile)
   */
  qx.Bootstrap.define("qx.bom.element.Style", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      __styleNames__P_72_0: null,
      __cssNames__P_72_1: null,
      /**
       * Detect vendor specific properties.
       */
      __detectVendorProperties__P_72_2() {
        var styleNames = {
          appearance: qx.core.Environment.get("css.appearance"),
          userSelect: qx.core.Environment.get("css.userselect"),
          textOverflow: qx.core.Environment.get("css.textoverflow"),
          borderImage: qx.core.Environment.get("css.borderimage"),
          float: qx.core.Environment.get("css.float"),
          userModify: qx.core.Environment.get("css.usermodify"),
          boxSizing: qx.core.Environment.get("css.boxsizing")
        };
        this.__cssNames__P_72_1 = {};
        for (var key in qx.lang.Object.clone(styleNames)) {
          if (!styleNames[key]) {
            delete styleNames[key];
          } else {
            if (key === "float") {
              this.__cssNames__P_72_1["cssFloat"] = key;
            } else {
              this.__cssNames__P_72_1[key] = qx.bom.Style.getCssName(styleNames[key]);
            }
          }
        }
        this.__styleNames__P_72_0 = styleNames;
      },
      /**
       * Gets the (possibly vendor-prefixed) name of a style property and stores
       * it to avoid multiple checks.
       *
       * @param name {String} Style property name to check
       * @return {String|null} The client-specific name of the property, or
       * <code>null</code> if it's not supported.
       */
      __getStyleName__P_72_3(name) {
        var styleName = qx.bom.Style.getPropertyName(name);
        if (styleName) {
          this.__styleNames__P_72_0[name] = styleName;
        }
        return styleName;
      },
      /**
       * Mshtml has proprietary pixel* properties for locations and dimensions
       * which return the pixel value. Used by getComputed() in mshtml variant.
       *
       * @internal
       */
      __mshtmlPixel__P_72_4: {
        width: "pixelWidth",
        height: "pixelHeight",
        left: "pixelLeft",
        right: "pixelRight",
        top: "pixelTop",
        bottom: "pixelBottom"
      },
      /**
       * Whether a special class is available for the processing of this style.
       *
       * @internal
       */
      __special__P_72_5: {
        clip: qx.bom.element.Clip,
        cursor: qx.bom.element.Cursor,
        opacity: qx.bom.element.Opacity,
        boxSizing: qx.bom.element.BoxSizing
      },
      /*
      ---------------------------------------------------------------------------
        COMPILE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Compiles the given styles into a string which can be used to
       * concat a HTML string for innerHTML usage.
       *
       * @param map {Map} Map of style properties to compile
       * @return {String} Compiled string of given style properties.
       */
      compile(map) {
        var html = [];
        var special = this.__special__P_72_5;
        var cssNames = this.__cssNames__P_72_1;
        var name, value;
        for (name in map) {
          // read value
          value = map[name];
          if (value == null) {
            continue;
          }

          // normalize name
          name = this.__cssNames__P_72_1[name] || name;

          // process special properties
          if (special[name]) {
            html.push(special[name].compile(value));
          } else {
            if (!cssNames[name]) {
              cssNames[name] = qx.bom.Style.getCssName(name);
            }
            html.push(cssNames[name], ":", value === "" ? '""' : value, ";");
          }
        }
        return html.join("");
      },
      /*
      ---------------------------------------------------------------------------
        CSS TEXT SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Set the full CSS content of the style attribute
       *
       * @param element {Element} The DOM element to modify
       * @param value {String} The full CSS string
       */
      setCss(element, value) {
        element.setAttribute("style", value);
      },
      /**
       * Returns the full content of the style attribute.
       *
       * @param element {Element} The DOM element to query
       * @return {String} the full CSS string
       * @signature function(element)
       */
      getCss(element) {
        return element.getAttribute("style");
      },
      /*
      ---------------------------------------------------------------------------
        STYLE ATTRIBUTE SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Checks whether the browser supports the given CSS property.
       *
       * @param propertyName {String} The name of the property
       * @return {Boolean} Whether the property id supported
       */
      isPropertySupported(propertyName) {
        return this.__special__P_72_5[propertyName] || this.__styleNames__P_72_0[propertyName] || propertyName in document.documentElement.style;
      },
      /** @type {Integer} Computed value of a style property. Compared to the cascaded style,
       * this one also interprets the values e.g. translates <code>em</code> units to
       * <code>px</code>.
       */
      COMPUTED_MODE: 1,
      /** @type {Integer} Cascaded value of a style property. */
      CASCADED_MODE: 2,
      /**
       * @type {Integer} Local value of a style property. Ignores inheritance cascade.
       *   Does not interpret values.
       */
      LOCAL_MODE: 3,
      /**
       * Sets the value of a style property
       *
       * @param element {Element} The DOM element to modify
       * @param name {String} Name of the style attribute (js variant e.g. marginTop, wordSpacing)
       * @param value {var} The value for the given style
       * @param smart {Boolean?true} Whether the implementation should automatically use
       *    special implementations for some properties
       */
      set(element, name, value, smart) {
        {
          qx.core.Assert.assertElement(element, "Invalid argument 'element'");
          qx.core.Assert.assertString(name, "Invalid argument 'name'");
          if (smart !== undefined) {
            qx.core.Assert.assertBoolean(smart, "Invalid argument 'smart'");
          }
        }

        // normalize name
        name = this.__styleNames__P_72_0[name] || this.__getStyleName__P_72_3(name) || name;

        // special handling for specific properties
        // through this good working switch this part costs nothing when
        // processing non-smart properties
        if (smart !== false && this.__special__P_72_5[name]) {
          this.__special__P_72_5[name].set(element, value);
        } else {
          if (typeof value === "string" && name.startsWith("--")) {
            element.style.setProperty(name, value);
          } else {
            element.style[name] = value !== null ? value : "";
          }
        }
      },
      /**
       * Convenience method to modify a set of styles at once.
       *
       * @param element {Element} The DOM element to modify
       * @param styles {Map} a map where the key is the name of the property
       *    and the value is the value to use.
       * @param smart {Boolean?true} Whether the implementation should automatically use
       *    special implementations for some properties
       */
      setStyles(element, styles, smart) {
        {
          qx.core.Assert.assertElement(element, "Invalid argument 'element'");
          qx.core.Assert.assertMap(styles, "Invalid argument 'styles'");
          if (smart !== undefined) {
            qx.core.Assert.assertBoolean(smart, "Invalid argument 'smart'");
          }
        }

        // inline calls to "set" and "reset" because this method is very
        // performance critical!
        var styleNames = this.__styleNames__P_72_0;
        var special = this.__special__P_72_5;
        var style = element.style;
        for (var key in styles) {
          var value = styles[key];
          var name = styleNames[key] || this.__getStyleName__P_72_3(key) || key;
          if (value === undefined) {
            if (smart !== false && special[name]) {
              special[name].reset(element);
            } else {
              style[name] = "";
            }
          } else {
            if (smart !== false && special[name]) {
              special[name].set(element, value);
            } else {
              style[name] = value !== null ? value : "";
            }
          }
        }
      },
      /**
       * Resets the value of a style property
       *
       * @param element {Element} The DOM element to modify
       * @param name {String} Name of the style attribute (js variant e.g. marginTop, wordSpacing)
       * @param smart {Boolean?true} Whether the implementation should automatically use
       *    special implementations for some properties
       */
      reset(element, name, smart) {
        // normalize name
        name = this.__styleNames__P_72_0[name] || this.__getStyleName__P_72_3(name) || name;

        // special handling for specific properties
        if (smart !== false && this.__special__P_72_5[name]) {
          this.__special__P_72_5[name].reset(element);
        } else {
          element.style[name] = "";
        }
      },
      /**
       * Gets the value of a style property.
       *
       * *Computed*
       *
       * Returns the computed value of a style property. Compared to the cascaded style,
       * this one also interprets the values e.g. translates <code>em</code> units to
       * <code>px</code>.
       *
       * *Cascaded*
       *
       * Returns the cascaded value of a style property.
       *
       * *Local*
       *
       * Ignores inheritance cascade. Does not interpret values.
       *
       * @signature function(element, name, mode, smart)
       * @param element {Element} The DOM element to modify
       * @param name {String} Name of the style attribute (js variant e.g. marginTop, wordSpacing)
       * @param mode {Number} Choose one of the modes {@link #COMPUTED_MODE}, {@link #CASCADED_MODE},
       *   {@link #LOCAL_MODE}. The computed mode is the default one.
       * @param smart {Boolean?true} Whether the implementation should automatically use
       *    special implementations for some properties
       * @return {var} The value of the property
       */
      get(element, name, mode, smart) {
        // normalize name
        name = this.__styleNames__P_72_0[name] || this.__getStyleName__P_72_3(name) || name;

        // special handling
        if (smart !== false && this.__special__P_72_5[name]) {
          return this.__special__P_72_5[name].get(element, mode);
        }

        // switch to right mode
        switch (mode) {
          case this.LOCAL_MODE:
            return element.style[name] || "";
          case this.CASCADED_MODE:
            // Currently only supported by Opera and Internet Explorer
            if (element.currentStyle) {
              return element.currentStyle[name] || "";
            }
            throw new Error("Cascaded styles are not supported in this browser!");
          default:
            // Opera, Mozilla and Safari 3+ also have a global getComputedStyle which is identical
            // to the one found under document.defaultView.

            // The problem with this is however that this does not work correctly
            // when working with frames and access an element of another frame.
            // Then we must use the <code>getComputedStyle</code> of the document
            // where the element is defined.

            var doc = qx.dom.Node.getDocument(element);
            var getStyle = doc.defaultView ? doc.defaultView.getComputedStyle : undefined;
            if (getStyle !== undefined) {
              // Support for the DOM2 getComputedStyle method
              //
              // Safari >= 3 & Gecko > 1.4 expose all properties to the returned
              // CSSStyleDeclaration object. In older browsers the function
              // "getPropertyValue" is needed to access the values.
              //
              // On a computed style object all properties are read-only which is
              // identical to the behavior of MSHTML's "currentStyle".

              var computed = getStyle(element, null);
              // All relevant browsers expose the configured style properties to
              // the CSSStyleDeclaration objects
              if (computed && computed[name]) {
                return computed[name];
              }
            } else {
              // if the element is not inserted into the document "currentStyle"
              // may be undefined. In this case always return the local style.
              if (!element.currentStyle) {
                return element.style[name] || "";
              }

              // Read cascaded style. Shorthand properties like "border" are not available
              // on the currentStyle object.
              var currentStyle = element.currentStyle[name] || element.style[name] || "";

              // Pixel values are always OK
              if (/^-?[\.\d]+(px)?$/i.test(currentStyle)) {
                return currentStyle;
              }

              // Try to convert non-pixel values
              var pixel = this.__mshtmlPixel__P_72_4[name];
              if (pixel && pixel in element.style) {
                // Backup local and runtime style
                var localStyle = element.style[name];

                // Overwrite local value with cascaded value
                // This is needed to have the pixel value setup
                element.style[name] = currentStyle || 0;

                // Read pixel value and add "px"
                var value = element.style[pixel] + "px";

                // Recover old local value
                element.style[name] = localStyle;

                // Return value
                return value;
              }

              // Just the current style
              return currentStyle;
            }
            return element.style[name] || "";
        }
      }
    },
    defer(statics) {
      statics.__detectVendorProperties__P_72_2();
    }
  });
  qx.bom.element.Style.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.element.Attribute": {}
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
   * Manages children structures of an element. Easy and convenient APIs
   * to insert, remove and replace children.
   */
  qx.Bootstrap.define("qx.dom.Element", {
    statics: {
      /**
       * Whether the given <code>child</code> is a child of <code>parent</code>
       *
       * @param parent {Element} parent element
       * @param child {Node} child node
       * @return {Boolean} true when the given <code>child</code> is a child of <code>parent</code>
       */
      hasChild(parent, child) {
        return child.parentNode === parent;
      },
      /**
       * Whether the given <code>element</code> has children.
       *
       * @param element {Element} element to test
       * @return {Boolean} true when the given <code>element</code> has at least one child node
       */
      hasChildren(element) {
        return !!element.firstChild;
      },
      /**
       * Whether the given <code>element</code> has any child elements.
       *
       * @param element {Element} element to test
       * @return {Boolean} true when the given <code>element</code> has at least one child element
       */
      hasChildElements(element) {
        element = element.firstChild;
        while (element) {
          if (element.nodeType === 1) {
            return true;
          }
          element = element.nextSibling;
        }
        return false;
      },
      /**
       * Returns the parent element of the given element.
       *
       * @param element {Element} Element to find the parent for
       * @return {Element} The parent element
       */
      getParentElement(element) {
        return element.parentNode;
      },
      /**
       * Checks if the <code>element</code> is in the DOM, but note that
       * the method is very expensive!
       *
       * @param element {Element} The DOM element to check.
       * @param win {Window} The window to check for.
       * @return {Boolean} <code>true</code> if the <code>element</code> is in
       *          the DOM, <code>false</code> otherwise.
       */
      isInDom(element, win) {
        if (!win) {
          win = window;
        }
        var domElements = win.document.getElementsByTagName(element.nodeName);
        for (var i = 0, l = domElements.length; i < l; i++) {
          if (domElements[i] === element) {
            return true;
          }
        }
        return false;
      },
      /*
      ---------------------------------------------------------------------------
        INSERTION
      ---------------------------------------------------------------------------
      */

      /**
       * Inserts <code>node</code> at the given <code>index</code>
       * inside <code>parent</code>.
       *
       * @param node {Node} node to insert
       * @param parent {Element} parent element node
       * @param index {Integer} where to insert
       * @return {Boolean} returns true (successful)
       */
      insertAt(node, parent, index) {
        var ref = parent.childNodes[index];
        if (ref) {
          parent.insertBefore(node, ref);
        } else {
          parent.appendChild(node);
        }
        return true;
      },
      /**
       * Insert <code>node</code> into <code>parent</code> as first child.
       * Indexes of other children will be incremented by one.
       *
       * @param node {Node} Node to insert
       * @param parent {Element} parent element node
       * @return {Boolean} returns true (successful)
       */
      insertBegin(node, parent) {
        if (parent.firstChild) {
          this.insertBefore(node, parent.firstChild);
        } else {
          parent.appendChild(node);
        }
        return true;
      },
      /**
       * Insert <code>node</code> into <code>parent</code> as last child.
       *
       * @param node {Node} Node to insert
       * @param parent {Element} parent element node
       * @return {Boolean} returns true (successful)
       */
      insertEnd(node, parent) {
        parent.appendChild(node);
        return true;
      },
      /**
       * Inserts <code>node</code> before <code>ref</code> in the same parent.
       *
       * @param node {Node} Node to insert
       * @param ref {Node} Node which will be used as reference for insertion
       * @return {Boolean} returns true (successful)
       */
      insertBefore(node, ref) {
        ref.parentNode.insertBefore(node, ref);
        return true;
      },
      /**
       * Inserts <code>node</code> after <code>ref</code> in the same parent.
       *
       * @param node {Node} Node to insert
       * @param ref {Node} Node which will be used as reference for insertion
       * @return {Boolean} returns true (successful)
       */
      insertAfter(node, ref) {
        var parent = ref.parentNode;
        if (ref == parent.lastChild) {
          parent.appendChild(node);
        } else {
          return this.insertBefore(node, ref.nextSibling);
        }
        return true;
      },
      /*
      ---------------------------------------------------------------------------
        REMOVAL
      ---------------------------------------------------------------------------
      */

      /**
       * Removes the given <code>node</code> from its parent element.
       *
       * @param node {Node} Node to remove
       * @return {Boolean} <code>true</code> when node was successfully removed,
       *   otherwise <code>false</code>
       */
      remove(node) {
        if (!node.parentNode) {
          return false;
        }
        node.parentNode.removeChild(node);
        return true;
      },
      /**
       * Removes the given <code>node</code> from the <code>parent</code>.
       *
       * @param node {Node} Node to remove
       * @param parent {Element} parent element which contains the <code>node</code>
       * @return {Boolean} <code>true</code> when node was successfully removed,
       *   otherwise <code>false</code>
       */
      removeChild(node, parent) {
        if (node.parentNode !== parent) {
          return false;
        }
        parent.removeChild(node);
        return true;
      },
      /**
       * Removes the node at the given <code>index</code>
       * from the <code>parent</code>.
       *
       * @param index {Integer} position of the node which should be removed
       * @param parent {Element} parent DOM element
       * @return {Boolean} <code>true</code> when node was successfully removed,
       *   otherwise <code>false</code>
       */
      removeChildAt(index, parent) {
        var child = parent.childNodes[index];
        if (!child) {
          return false;
        }
        parent.removeChild(child);
        return true;
      },
      /*
      ---------------------------------------------------------------------------
        REPLACE
      ---------------------------------------------------------------------------
      */

      /**
       * Replaces <code>oldNode</code> with <code>newNode</code> in the current
       * parent of <code>oldNode</code>.
       *
       * @param newNode {Node} DOM node to insert
       * @param oldNode {Node} DOM node to remove
       * @return {Boolean} <code>true</code> when node was successfully replaced
       */
      replaceChild(newNode, oldNode) {
        if (!oldNode.parentNode) {
          return false;
        }
        oldNode.parentNode.replaceChild(newNode, oldNode);
        return true;
      },
      /**
       * Replaces the node at <code>index</code> with <code>newNode</code> in
       * the given parent.
       *
       * @param newNode {Node} DOM node to insert
       * @param index {Integer} position of old DOM node
       * @param parent {Element} parent DOM element
       * @return {Boolean} <code>true</code> when node was successfully replaced
       */
      replaceAt(newNode, index, parent) {
        var oldNode = parent.childNodes[index];
        if (!oldNode) {
          return false;
        }
        parent.replaceChild(newNode, oldNode);
        return true;
      },
      /**
       * Stores helper element for element creation in WebKit
       *
       * @internal
       */
      __helperElement__P_69_0: {},
      /**
       * Creates and returns a DOM helper element.
       *
       * @param win {Window?} Window to create the element for
       * @return {Element} The created element node
       */
      getHelperElement(win) {
        if (!win) {
          win = window;
        }

        // key is needed to allow using different windows
        var key = win.location.href;
        if (!qx.dom.Element.__helperElement__P_69_0[key]) {
          var helper = qx.dom.Element.__helperElement__P_69_0[key] = win.document.createElement("div");

          // innerHTML will only parsed correctly if element is appended to document
          if (qx.core.Environment.get("engine.name") == "webkit") {
            helper.style.display = "none";
            win.document.body.appendChild(helper);
          }
        }
        return qx.dom.Element.__helperElement__P_69_0[key];
      },
      /**
       * Creates a DOM element.
       *
       * @param name {String} Tag name of the element
       * @param attributes {Map?} Map of attributes to apply
       * @param win {Window?} Window to create the element for
       * @return {Element} The created element node
       */
      create(name, attributes, win) {
        if (!win) {
          win = window;
        }
        if (!name) {
          throw new Error("The tag name is missing!");
        }
        var element = win.document.createElement(name);
        for (var key in attributes) {
          qx.bom.element.Attribute.set(element, key, attributes[key]);
        }
        return element;
      },
      /**
       * Removes all content from the given element
       *
       * @param element {Element} element to clean
       * @return {String} empty string (new HTML content)
       */
      empty(element) {
        return element.innerHTML = "";
      }
    }
  });
  qx.dom.Element.$$dbClassInfo = $$dbClassInfo;
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
      __styles__P_98_0: {
        fontFamily: 1,
        fontSize: 1,
        fontWeight: 1,
        fontStyle: 1,
        lineHeight: 1,
        wordBreak: 1,
        letterSpacing: 1
      },
      /** @type{Object<String,Object>} cache of label sizes */
      __sizeCache__P_98_1: {},
      /**
       * Generates the helper DOM element for text measuring
       *
       * @return {Element} Helper DOM element
       */
      __prepareText__P_98_2() {
        var el = this.__createMeasureElement__P_98_3(false);
        document.body.insertBefore(el, document.body.firstChild);
        return this._textElement = el;
      },
      /**
       * Generates the helper DOM element for HTML measuring
       *
       * @return {Element} Helper DOM element
       */
      __prepareHtml__P_98_4() {
        var el = this.__createMeasureElement__P_98_3(true);
        document.body.insertBefore(el, document.body.firstChild);
        return this._htmlElement = el;
      },
      /**
       * Creates the measure element
       *
       * @param html {Boolean?false} Whether HTML markup should be used.
       * @return {Element} The measure element
       */
      __createMeasureElement__P_98_3(html) {
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
            for (var key in this.__styles__P_98_0) {
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
      __getStyles__P_98_5(html) {
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
          for (var key in this.__styles__P_98_0) {
            xulel.style[key] = "inherit";
          }
          xulel.setAttribute("crop", "end");
          el.appendChild(xulel);
        } else {
          qx.bom.element.Style.setStyles(el, this.__getStyles__P_98_5(html));
        }
        if (content) {
          this.setValue(el, content);
        }
        return el;
      },
      /** Sanitizer function */
      __sanitizer__P_98_6: null,
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
        qx.bom.Label.__sanitizer__P_98_6 = func;
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
          if (qx.bom.Label.__sanitizer__P_98_6 && typeof qx.bom.Label.__sanitizer__P_98_6 === "function") {
            value = qx.bom.Label.__sanitizer__P_98_6(value);
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
        let cacheKey = this.__getCacheKey__P_98_7(styles, width);
        let size = this.__getCachedSize__P_98_8(cacheKey, content);
        if (size !== undefined) {
          return size;
        }
        var element = this._htmlElement || this.__prepareHtml__P_98_4();

        // apply width
        element.style.width = width != undefined ? width + "px" : "auto";
        // insert content
        element.innerHTML = content;
        size = this.__measureSize__P_98_9(element, styles);
        this.__storeCacheSize__P_98_10(cacheKey, content, size);
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
        let cacheKey = this.__getCacheKey__P_98_7(styles);
        let size = this.__getCachedSize__P_98_8(cacheKey, text);
        if (size !== undefined) {
          return size;
        }
        var element = this._textElement || this.__prepareText__P_98_2();
        if (!qx.core.Environment.get("css.textoverflow") && qx.core.Environment.get("html.xul")) {
          element.firstChild.setAttribute("value", text);
        } else {
          qx.bom.element.Attribute.set(element, "text", text);
        }
        size = this.__measureSize__P_98_9(element, styles);
        this.__storeCacheSize__P_98_10(cacheKey, text, size);
        return size;
      },
      /**
       * Returns a key for a specific set of styles, used in the caching of size calculations
       *
       * @param {*} styles
       * @param {Integer?} width optional width
       * @returns
       */
      __getCacheKey__P_98_7(styles, width) {
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
      __getCachedSize__P_98_8(cacheKey, text) {
        let cache = qx.bom.Label.__sizeCache__P_98_1[cacheKey];
        return cache?.sizes[text];
      },
      /**
       * Stores the size of the given text in the cache
       *
       * @param {String} cacheKey
       * @param {String} text
       * @param {*} size
       */
      __storeCacheSize__P_98_10(cacheKey, text, size) {
        if (!size) {
          return;
        }
        let cache = qx.bom.Label.__sizeCache__P_98_1[cacheKey];
        if (cache === undefined) {
          cache = qx.bom.Label.__sizeCache__P_98_1[cacheKey] = {
            sizes: {}
          };
        }
        cache.sizes[text] = size;
      },
      /**
       * Flushes the size cache - use this when something changes, for example webfonts have been loaded
       */
      flushSizeCache() {
        qx.bom.Label.__sizeCache__P_98_1 = {};
      },
      /**
       * Measure the size of the given element
       *
       * @param element {Element} The element to measure
       * @param styles {Map?null} Optional styles to apply
       * @return {Map} A map with preferred <code>width</code> and <code>height</code>.
       */
      __measureSize__P_98_9(element, styles) {
        // sync styles
        var keys = this.__styles__P_98_0;
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
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.lang.Type": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "html.element.textcontent": {
          "load": true,
          "className": "qx.bom.client.Html"
        },
        "engine.name": {
          "load": true,
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
       2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Alexander Steitz (aback)
  
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
   * Attribute/Property handling for DOM HTML elements.
   *
   * Also includes support for HTML properties like <code>checked</code>
   * or <code>value</code>. This feature set is supported cross-browser
   * through one common interface and is independent of the differences between
   * the multiple implementations.
   *
   * Supports applying text and HTML content using the attribute names
   * <code>text</code> and <code>html</code>.
   */
  qx.Bootstrap.define("qx.bom.element.Attribute", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** Internal map of attribute conversions */
      __hints__P_70_0: {
        // Name translation table (camelcase is important for some attributes)
        names: {
          class: "className",
          for: "htmlFor",
          html: "innerHTML",
          text: qx.core.Environment.get("html.element.textcontent") ? "textContent" : "innerText",
          colspan: "colSpan",
          rowspan: "rowSpan",
          valign: "vAlign",
          datetime: "dateTime",
          accesskey: "accessKey",
          tabindex: "tabIndex",
          maxlength: "maxLength",
          readonly: "readOnly",
          longdesc: "longDesc",
          cellpadding: "cellPadding",
          cellspacing: "cellSpacing",
          frameborder: "frameBorder",
          usemap: "useMap"
        },
        // Attributes which are only applyable on a DOM element (not using compile())
        runtime: {
          html: 1,
          text: 1
        },
        // Attributes which are (forced) boolean
        bools: {
          compact: 1,
          nowrap: 1,
          ismap: 1,
          declare: 1,
          noshade: 1,
          checked: 1,
          disabled: 1,
          readOnly: 1,
          multiple: 1,
          selected: 1,
          noresize: 1,
          defer: 1,
          allowTransparency: 1
        },
        // Interpreted as property (element.property)
        property: {
          // Used by qx.html.Element
          $$element: 1,
          $$elementObject: 1,
          // Used by qx.ui.core.Widget
          $$qxObjectHash: 1,
          $$qxObject: 1,
          // Native properties
          checked: 1,
          readOnly: 1,
          multiple: 1,
          selected: 1,
          value: 1,
          maxLength: 1,
          className: 1,
          innerHTML: 1,
          innerText: 1,
          textContent: 1,
          htmlFor: 1,
          tabIndex: 1
        },
        qxProperties: {
          $$qxObjectHash: 1,
          $$qxObject: 1,
          $$element: 1,
          $$elementObject: 1
        },
        // Default values when "null" is given to a property
        propertyDefault: {
          disabled: false,
          checked: false,
          readOnly: false,
          multiple: false,
          selected: false,
          value: "",
          className: "",
          innerHTML: "",
          innerText: "",
          textContent: "",
          htmlFor: "",
          tabIndex: 0,
          maxLength: qx.core.Environment.select("engine.name", {
            mshtml: 2147483647,
            webkit: 524288,
            default: -1
          })
        },
        // Properties which can be removed to reset them
        removeableProperties: {
          disabled: 1,
          multiple: 1,
          maxLength: 1
        }
      },
      /**
       * Compiles an incoming attribute map to a string which
       * could be used when building HTML blocks using innerHTML.
       *
       * This method silently ignores runtime attributes like
       * <code>html</code> or <code>text</code>.
       *
       * @param map {Map} Map of attributes. The key is the name of the attribute.
       * @return {String} Returns a compiled string ready for usage.
       */
      compile(map) {
        var html = [];
        var runtime = this.__hints__P_70_0.runtime;
        for (var key in map) {
          if (!runtime[key]) {
            html.push(key, "='", map[key], "'");
          }
        }
        return html.join("");
      },
      /**
       * Returns the value of the given HTML attribute
       *
       * @param element {Element} The DOM element to query
       * @param name {String} Name of the attribute
       * @return {var} The value of the attribute
       */
      get(element, name) {
        var hints = this.__hints__P_70_0;
        var value;

        // normalize name
        name = hints.names[name] || name;

        // respect properties
        if (hints.property[name]) {
          value = element[name];
          if (typeof hints.propertyDefault[name] !== "undefined" && value == hints.propertyDefault[name]) {
            // only return null for all non-boolean properties
            if (typeof hints.bools[name] === "undefined") {
              return null;
            } else {
              return value;
            }
          }
        } else {
          // fallback to attribute
          value = element.getAttribute(name);

          // All modern browsers interpret "" as true but not IE8, which set the property to "" reset
          if (hints.bools[name] && !(qx.core.Environment.get("engine.name") == "mshtml" && parseInt(qx.core.Environment.get("browser.documentmode"), 10) <= 8)) {
            return qx.Bootstrap.isString(value); // also respect empty strings as true
          }
        }
        if (hints.bools[name]) {
          return !!value;
        }
        return value;
      },
      /**
       * Sets an HTML attribute on the given DOM element
       *
       * @param element {Element} The DOM element to modify
       * @param name {String} Name of the attribute
       * @param value {var} New value of the attribute
       */
      set(element, name, value) {
        if (typeof value === "undefined") {
          return;
        }
        var hints = this.__hints__P_70_0;

        // normalize name
        name = hints.names[name] || name;

        // respect booleans
        if (hints.bools[name] && !qx.lang.Type.isBoolean(value)) {
          value = qx.lang.Type.isString(value);
        }

        // apply attribute
        // only properties which can be applied by the browser or qxProperties
        // otherwise use the attribute methods
        if (hints.property[name] && (!(element[name] === undefined) || hints.qxProperties[name])) {
          // resetting the attribute/property
          if (value == null) {
            // for properties which need to be removed for a correct reset
            if (hints.removeableProperties[name]) {
              element.removeAttribute(name);
              return;
            } else if (typeof hints.propertyDefault[name] !== "undefined") {
              value = hints.propertyDefault[name];
            }
          }
          element[name] = value;
        } else {
          if ((hints.bools[name] || value === null) && name.indexOf("data-") !== 0) {
            if (value === true) {
              element.setAttribute(name, name);
            } else if (value === false || value === null) {
              element.removeAttribute(name);
            }
          } else if (value === null) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value);
          }
        }
      },
      /**
       * Serializes an HTML attribute into a writer; the `writer` function accepts
       *  an varargs, which can be joined with an empty string or streamed.
       *
       * @param name {String} Name of the attribute
       * @param value {var} New value of the attribute
       */
      serialize(name, value) {
        if (typeof value === "undefined") {
          return null;
        }
        var hints = this.__hints__P_70_0;

        // Skip serialization of hidden Qooxdoo state properties
        if (hints.qxProperties[name]) {
          return null;
        }

        // respect booleans
        if (hints.bools[name] && !qx.lang.Type.isBoolean(value)) {
          value = qx.lang.Type.isString(value);
        }

        // apply attribute
        if ((hints.bools[name] || value === null) && name.indexOf("data-") !== 0) {
          if (value === true) {
            let result = {};
            result[name] = `"${name}"`;
            return result;
          }
        } else if (value !== null) {
          let result = {};
          result[name] = '"' + value + '"';
          return result;
        }
        return null;
      },
      /**
       * Resets an HTML attribute on the given DOM element
       *
       * @param element {Element} The DOM element to modify
       * @param name {String} Name of the attribute
       */
      reset(element, name) {
        if (name.indexOf("data-") === 0) {
          element.removeAttribute(name);
        } else {
          this.set(element, name, null);
        }
      }
    }
  });
  qx.bom.element.Attribute.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.dom.Node": {},
      "qx.bom.element.Dimension": {},
      "qx.bom.Document": {},
      "qx.bom.Viewport": {},
      "qx.bom.Stylesheet": {},
      "qxWeb": {
        "defer": "runtime"
      },
      "qx.bom.element.Location": {},
      "qx.lang.String": {},
      "qx.bom.element.Style": {},
      "qx.bom.element.Class": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2011-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
       * Daniel Wagner (danielwagner)
  
  ************************************************************************ */
  /**
   * CSS/Style property manipulation module
   * @group (Core)
   */
  qx.Bootstrap.define("qx.module.Css", {
    statics: {
      /**
       * INTERNAL
       *
       * Returns the rendered height of the first element in the collection.
       * @attach {qxWeb}
       * @param force {Boolean?false} When true also get the height of a <em>non displayed</em> element
       * @return {Number} The first item's rendered height
       */
      _getHeight(force) {
        var elem = this[0];
        if (elem) {
          if (qx.dom.Node.isElement(elem)) {
            var elementHeight;
            if (force) {
              var stylesToSwap = {
                display: "block",
                position: "absolute",
                visibility: "hidden"
              };
              elementHeight = qx.module.Css.__swap__P_206_0(elem, stylesToSwap, "_getHeight", this);
            } else {
              elementHeight = qx.bom.element.Dimension.getHeight(elem);
            }
            return elementHeight;
          } else if (qx.dom.Node.isDocument(elem)) {
            return qx.bom.Document.getHeight(qx.dom.Node.getWindow(elem));
          } else if (qx.dom.Node.isWindow(elem)) {
            return qx.bom.Viewport.getHeight(elem);
          }
        }
        return null;
      },
      /**
       * INTERNAL
       *
       * Returns the rendered width of the first element in the collection
       * @attach {qxWeb}
       * @param force {Boolean?false} When true also get the width of a <em>non displayed</em> element
       * @return {Number} The first item's rendered width
       */
      _getWidth(force) {
        var elem = this[0];
        if (elem) {
          if (qx.dom.Node.isElement(elem)) {
            var elementWidth;
            if (force) {
              var stylesToSwap = {
                display: "block",
                position: "absolute",
                visibility: "hidden"
              };
              elementWidth = qx.module.Css.__swap__P_206_0(elem, stylesToSwap, "_getWidth", this);
            } else {
              elementWidth = qx.bom.element.Dimension.getWidth(elem);
            }
            return elementWidth;
          } else if (qx.dom.Node.isDocument(elem)) {
            return qx.bom.Document.getWidth(qx.dom.Node.getWindow(elem));
          } else if (qx.dom.Node.isWindow(elem)) {
            return qx.bom.Viewport.getWidth(elem);
          }
        }
        return null;
      },
      /**
       * INTERNAL
       *
       * Returns the content height of the first element in the collection.
       * This is the maximum height the element can use, excluding borders,
       * margins, padding or scroll bars.
       * @attach {qxWeb}
       * @param force {Boolean?false} When true also get the content height of a <em>non displayed</em> element
       * @return {Number} Computed content height
       */
      _getContentHeight(force) {
        var obj = this[0];
        if (qx.dom.Node.isElement(obj)) {
          var contentHeight;
          if (force) {
            var stylesToSwap = {
              position: "absolute",
              visibility: "hidden",
              display: "block"
            };
            contentHeight = qx.module.Css.__swap__P_206_0(obj, stylesToSwap, "_getContentHeight", this);
          } else {
            contentHeight = qx.bom.element.Dimension.getContentHeight(obj);
          }
          return contentHeight;
        }
        return null;
      },
      /**
       * INTERNAL
       *
       * Returns the content width of the first element in the collection.
       * This is the maximum width the element can use, excluding borders,
       * margins, padding or scroll bars.
       * @attach {qxWeb}
       * @param force {Boolean?false} When true also get the content width of a <em>non displayed</em> element
       * @return {Number} Computed content width
       */
      _getContentWidth(force) {
        var obj = this[0];
        if (qx.dom.Node.isElement(obj)) {
          var contentWidth;
          if (force) {
            var stylesToSwap = {
              position: "absolute",
              visibility: "hidden",
              display: "block"
            };
            contentWidth = qx.module.Css.__swap__P_206_0(obj, stylesToSwap, "_getContentWidth", this);
          } else {
            contentWidth = qx.bom.element.Dimension.getContentWidth(obj);
          }
          return contentWidth;
        }
        return null;
      },
      /**
       * Maps HTML elements to their default "display" style values.
       */
      __displayDefaults__P_206_1: {},
      /**
       * Attempts tp determine the default "display" style value for
       * elements with the given tag name.
       *
       * @param tagName {String} Tag name
       * @param  doc {Document?} Document element. Default: The current document
       * @return {String} The default "display" value, e.g. <code>inline</code>
       * or <code>block</code>
       */
      __getDisplayDefault__P_206_2(tagName, doc) {
        var defaults = qx.module.Css.__displayDefaults__P_206_1;
        if (!defaults[tagName]) {
          var docu = doc || document;
          var tempEl = qxWeb(docu.createElement(tagName)).appendTo(doc.body);
          defaults[tagName] = tempEl.getStyle("display");
          tempEl.remove();
        }
        return defaults[tagName] || "";
      },
      /**
       * Swaps the given styles of the element and execute the callback
       * before the original values are restored.
       *
       * Finally returns the return value of the callback.
       *
       * @param element {Element} the DOM element to operate on
       * @param styles {Map} the styles to swap
       * @param methodName {String} the callback functions name
       * @param context {Object} the context in which the callback should be called
       * @return {Object} the return value of the callback
       */
      __swap__P_206_0(element, styles, methodName, context) {
        // get the current values
        var currentValues = {};
        for (var styleProperty in styles) {
          currentValues[styleProperty] = element.style[styleProperty];
          element.style[styleProperty] = styles[styleProperty];
        }
        var value = context[methodName]();
        for (var styleProperty in currentValues) {
          element.style[styleProperty] = currentValues[styleProperty];
        }
        return value;
      },
      /**
       * Includes a Stylesheet file
       *
       * @attachStatic {qxWeb}
       * @param uri {String} The stylesheet's URI
       * @param doc {Document?} Document to modify
       */
      includeStylesheet(uri, doc) {
        qx.bom.Stylesheet.includeFile(uri, doc);
      }
    },
    members: {
      /**
       * Returns the rendered height of the first element in the collection.
       * @attach {qxWeb}
       * @param force {Boolean?false} When true also get the height of a <em>non displayed</em> element
       * @return {Number} The first item's rendered height
       */
      getHeight(force) {
        return this._getHeight(force);
      },
      /**
       * Returns the rendered width of the first element in the collection
       * @attach {qxWeb}
       * @param force {Boolean?false} When true also get the width of a <em>non displayed</em> element
       * @return {Number} The first item's rendered width
       */
      getWidth(force) {
        return this._getWidth(force);
      },
      /**
       * Returns the content height of the first element in the collection.
       * This is the maximum height the element can use, excluding borders,
       * margins, padding or scroll bars.
       * @attach {qxWeb}
       * @param force {Boolean?false} When true also get the content height of a <em>non displayed</em> element
       * @return {Number} Computed content height
       */
      getContentHeight(force) {
        return this._getContentHeight(force);
      },
      /**
       * Returns the content width of the first element in the collection.
       * This is the maximum width the element can use, excluding borders,
       * margins, padding or scroll bars.
       * @attach {qxWeb}
       * @param force {Boolean?false} When true also get the content width of a <em>non displayed</em> element
       * @return {Number} Computed content width
       */
      getContentWidth(force) {
        return this._getContentWidth(force);
      },
      /**
       * Shows any elements with "display: none" in the collection. If an element
       * was hidden by using the {@link #hide} method, its previous
       * "display" style value will be re-applied. Otherwise, the
       * default "display" value for the element type will be applied.
       *
       * @attach {qxWeb}
       * @return {qxWeb} The collection for chaining
       */
      show() {
        this._forEachElementWrapped(function (item) {
          var currentVal = item.getStyle("display");
          var prevVal = item[0].$$qPrevDisp;
          var newVal;
          if (currentVal == "none") {
            if (prevVal && prevVal != "none") {
              newVal = prevVal;
            } else {
              var doc = qxWeb.getDocument(item[0]);
              newVal = qx.module.Css.__getDisplayDefault__P_206_2(item[0].tagName, doc);
            }
            item.setStyle("display", newVal);
            item[0].$$qPrevDisp = "none";
          }
        });
        return this;
      },
      /**
       * Hides all elements in the collection by setting their "display"
       * style to "none". The previous value is stored so it can be re-applied
       * when {@link #show} is called.
       *
       * @attach {qxWeb}
       * @return {qxWeb} The collection for chaining
       */
      hide() {
        this._forEachElementWrapped(function (item) {
          var prevStyle = item.getStyle("display");
          if (prevStyle !== "none") {
            item[0].$$qPrevDisp = prevStyle;
            item.setStyle("display", "none");
          }
        });
        return this;
      },
      /**
       * Returns the distance between the first element in the collection and its
       * offset parent
       *
       * @attach {qxWeb}
       * @return {Map} a map with the keys <code>left</code> and <code>top</code>
       * containing the distance between the elements
       */
      getPosition() {
        var obj = this[0];
        if (qx.dom.Node.isElement(obj)) {
          return qx.bom.element.Location.getPosition(obj);
        }
        return null;
      },
      /**
       * Returns the computed location of the given element in the context of the
       * document dimensions.
       *
       * Supported modes:
       *
       * * <code>margin</code>: Calculate from the margin box of the element (bigger than the visual appearance: including margins of given element)
       * * <code>box</code>: Calculates the offset box of the element (default, uses the same size as visible)
       * * <code>border</code>: Calculate the border box (useful to align to border edges of two elements).
       * * <code>scroll</code>: Calculate the scroll box (relevant for absolute positioned content).
       * * <code>padding</code>: Calculate the padding box (relevant for static/relative positioned content).
       *
       * @attach {qxWeb}
       * @param mode {String?box} A supported option. See comment above.
       * @return {Map} A map with the keys <code>left</code>, <code>top</code>,
       * <code>right</code> and <code>bottom</code> which contains the distance
       * of the element relative to the document.
       */
      getOffset(mode) {
        var elem = this[0];
        if (elem && qx.dom.Node.isElement(elem)) {
          return qx.bom.element.Location.get(elem, mode);
        }
        return null;
      },
      /**
       * Modifies the given style property on all elements in the collection.
       *
       * @attach {qxWeb}
       * @param name {String} Name of the style property to modify
       * @param value {var} The value to apply
       * @return {qxWeb} The collection for chaining
       */
      setStyle(name, value) {
        if (/\w-\w/.test(name)) {
          name = qx.lang.String.camelCase(name);
        }
        this._forEachElement(function (item) {
          qx.bom.element.Style.set(item, name, value);
        });
        return this;
      },
      /**
       * Returns the value of the given style property for the first item in the
       * collection.
       *
       * @attach {qxWeb}
       * @param name {String} Style property name
       * @return {var} Style property value
       */
      getStyle(name) {
        if (this[0] && qx.dom.Node.isElement(this[0])) {
          if (/\w-\w/.test(name)) {
            name = qx.lang.String.camelCase(name);
          }
          return qx.bom.element.Style.get(this[0], name);
        }
        return null;
      },
      /**
       * Sets multiple style properties for each item in the collection.
       *
       * @attach {qxWeb}
       * @param styles {Map} A map of style property name/value pairs
       * @return {qxWeb} The collection for chaining
       */
      setStyles(styles) {
        for (var name in styles) {
          this.setStyle(name, styles[name]);
        }
        return this;
      },
      /**
       * Returns the values of multiple style properties for each item in the
       * collection
       *
       * @attach {qxWeb}
       * @param names {String[]} List of style property names
       * @return {Map} Map of style property name/value pairs
       */
      getStyles(names) {
        var styles = {};
        for (var i = 0; i < names.length; i++) {
          styles[names[i]] = this.getStyle(names[i]);
        }
        return styles;
      },
      /**
       * Adds a class name to each element in the collection
       *
       * @attach {qxWeb}
       * @param name {String} Class name
       * @return {qxWeb} The collection for chaining
       */
      addClass(name) {
        this._forEachElement(function (item) {
          qx.bom.element.Class.add(item, name);
        });
        return this;
      },
      /**
       * Adds multiple class names to each element in the collection
       *
       * @attach {qxWeb}
       * @param names {String[]} List of class names to add
       * @return {qxWeb} The collection for chaining
       */
      addClasses(names) {
        this._forEachElement(function (item) {
          qx.bom.element.Class.addClasses(item, names);
        });
        return this;
      },
      /**
       * Removes a class name from each element in the collection
       *
       * @attach {qxWeb}
       * @param name {String} The class name to remove
       * @return {qxWeb} The collection for chaining
       */
      removeClass(name) {
        this._forEachElement(function (item) {
          qx.bom.element.Class.remove(item, name);
        });
        return this;
      },
      /**
       * Removes multiple class names from each element in the collection.
       * Use {@link qx.module.Attribute#removeAttribute} to remove all classes.
       *
       * @attach {qxWeb}
       * @param names {String[]} List of class names to remove
       * @return {qxWeb} The collection for chaining
       */
      removeClasses(names) {
        this._forEachElement(function (item) {
          qx.bom.element.Class.removeClasses(item, names);
        });
        return this;
      },
      /**
       * Checks if the first element in the collection has the given class name
       *
       * @attach {qxWeb}
       * @param name {String} Class name to check for
       * @return {Boolean} <code>true</code> if the first item has the given class name
       */
      hasClass(name) {
        if (!this[0] || !qx.dom.Node.isElement(this[0])) {
          return false;
        }
        return qx.bom.element.Class.has(this[0], name);
      },
      /**
       * Returns the class name of the first element in the collection
       *
       * @attach {qxWeb}
       * @return {String} Class name
       */
      getClass() {
        if (!this[0] || !qx.dom.Node.isElement(this[0])) {
          return "";
        }
        return qx.bom.element.Class.get(this[0]);
      },
      /**
       * Toggles the given class name on each item in the collection
       *
       * @attach {qxWeb}
       * @param name {String} Class name
       * @return {qxWeb} The collection for chaining
       */
      toggleClass(name) {
        var bCls = qx.bom.element.Class;
        this._forEachElement(function (item) {
          bCls.has(item, name) ? bCls.remove(item, name) : bCls.add(item, name);
        });
        return this;
      },
      /**
       * Toggles the given list of class names on each item in the collection
       *
       * @attach {qxWeb}
       * @param names {String[]} Class names
       * @return {qxWeb} The collection for chaining
       */
      toggleClasses(names) {
        for (var i = 0, l = names.length; i < l; i++) {
          this.toggleClass(names[i]);
        }
        return this;
      },
      /**
       * Replaces a class name on each element in the collection
       *
       * @attach {qxWeb}
       * @param oldName {String} Class name to remove
       * @param newName {String} Class name to add
       * @return {qxWeb} The collection for chaining
       */
      replaceClass(oldName, newName) {
        this._forEachElement(function (item) {
          qx.bom.element.Class.replace(item, oldName, newName);
        });
        return this;
      }
    },
    defer(statics) {
      qxWeb.$attachAll(this);
      // manually attach private method which is ignored by attachAll
      qxWeb.$attach({
        _getWidth: statics._getWidth,
        _getHeight: statics._getHeight,
        _getContentHeight: statics._getContentHeight,
        _getContentWidth: statics._getContentWidth
      });
    }
  });
  qx.module.Css.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.lang.normalize.Array": {
        "require": true
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
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
       2007-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
     ======================================================================
  
     This class uses ideas and code snippets presented at
     http://webreflection.blogspot.com/2008/05/habemus-array-unlocked-length-in-ie8.html
     http://webreflection.blogspot.com/2008/05/stack-and-arrayobject-how-to-create.html
  
     Author:
       Andrea Giammarchi
  
     License:
       MIT: http://www.opensource.org/licenses/mit-license.php
  
     ======================================================================
  
     This class uses documentation of the native Array methods from the MDC
     documentation of Mozilla.
  
     License:
       CC Attribution-Sharealike License:
       http://creativecommons.org/licenses/by-sa/2.5/
  
  ************************************************************************ */

  /**
   * This class is the common superclass for most array classes in
   * qooxdoo. It supports all of the shiny 1.6 JavaScript array features
   * like <code>forEach</code> and <code>map</code>.
   *
   * This class may be instantiated instead of the native Array if
   * one wants to work with a feature-unified Array instead of the native
   * one. This class uses native features whereever possible but fills
   * all missing implementations with custom ones.
   *
   * Through the ability to extend from this class one could add even
   * more utility features on top of it.
   *
   * @require(qx.bom.client.Engine)
   * @require(qx.lang.normalize.Array)
   */
  qx.Bootstrap.define("qx.type.BaseArray", {
    extend: Array,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Creates a new Array with the given length or the listed elements.
     *
     * <pre class="javascript">
     * var arr1 = new qx.type.BaseArray(arrayLength);
     * var arr2 = new qx.type.BaseArray(item0, item1, ..., itemN);
     * </pre>
     *
     * * <code>arrayLength</code>: The initial length of the array. You can access
     * this value using the length property. If the value specified is not a
     * number, an array of length 1 is created, with the first element having
     * the specified value. The maximum length allowed for an
     * array is 2^32-1, i.e. 4,294,967,295.
     * * <code>itemN</code>:  A value for the element in that position in the
     * array. When this form is used, the array is initialized with the specified
     * values as its elements, and the array's length property is set to the
     * number of arguments.
     *
     * @param length_or_items {Integer|var?null} The initial length of the array
     *        OR an argument list of values.
     */
    construct(length_or_items) {},
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Converts a base array to a native Array
       *
       * @signature function()
       * @return {Array} The native array
       */
      toArray: null,
      /**
       * Returns the current number of items stored in the Array
       *
       * @signature function()
       * @return {Integer} number of items
       */
      valueOf: null,
      /**
       * Removes the last element from an array and returns that element.
       *
       * This method modifies the array.
       *
       * @signature function()
       * @return {var} The last element of the array.
       */
      pop: null,
      /**
       * Adds one or more elements to the end of an array and returns the new length of the array.
       *
       * This method modifies the array.
       *
       * @signature function(varargs)
       * @param varargs {var} The elements to add to the end of the array.
       * @return {Integer} The new array's length
       */
      push: null,
      /**
       * Reverses the order of the elements of an array -- the first becomes the last, and the last becomes the first.
       *
       * This method modifies the array.
       *
       * @signature function()
       * @return {Array} Returns the modified array (works in place)
       */
      reverse: null,
      /**
       * Removes the first element from an array and returns that element.
       *
       * This method modifies the array.
       *
       * @signature function()
       * @return {var} The first element of the array.
       */
      shift: null,
      /**
       * Sorts the elements of an array.
       *
       * This method modifies the array.
       *
       * @signature function(compareFunction)
       * @param compareFunction {Function?null} Specifies a function that defines the sort order. If omitted,
       *   the array is sorted lexicographically (in dictionary order) according to the string conversion of each element.
       * @return {Array} Returns the modified array (works in place)
       */
      sort: null,
      /**
       * Adds and/or removes elements from an array.
       *
       * @signature function(index, howMany, varargs)
       * @param index {Integer} Index at which to start changing the array. If negative, will begin
       *   that many elements from the end.
       * @param howMany {Integer} An integer indicating the number of old array elements to remove.
       *   If <code>howMany</code> is 0, no elements are removed. In this case, you should specify
       *   at least one new element.
       * @param varargs {var?null} The elements to add to the array. If you don't specify any elements,
       *   splice simply removes elements from the array.
       * @return {qx.type.BaseArray} New array with the removed elements.
       */
      splice: null,
      /**
       * Adds one or more elements to the front of an array and returns the new length of the array.
       *
       * This method modifies the array.
       *
       * @signature function(varargs)
       * @param varargs {var} The elements to add to the front of the array.
       * @return {Integer} The new array's length
       */
      unshift: null,
      /**
       * Returns a new array comprised of this array joined with other array(s) and/or value(s).
       *
       * This method does not modify the array and returns a modified copy of the original.
       *
       * @signature function(varargs)
       * @param varargs {Array|var} Arrays and/or values to concatenate to the resulting array.
       * @return {qx.type.BaseArray} New array built of the given arrays or values.
       */
      concat: null,
      /**
       * Joins all elements of an array into a string.
       *
       * @signature function(separator)
       * @param separator {String} Specifies a string to separate each element of the array. The separator is
       *   converted to a string if necessary. If omitted, the array elements are separated with a comma.
       * @return {String} The stringified values of all elements divided by the given separator.
       */
      join: null,
      /**
       * Extracts a section of an array and returns a new array.
       *
       * @signature function(begin, end)
       * @param begin {Integer} Zero-based index at which to begin extraction. As a negative index, start indicates
       *   an offset from the end of the sequence. slice(-2) extracts the second-to-last element and the last element
       *   in the sequence.
       * @param end {Integer?length} Zero-based index at which to end extraction. slice extracts up to but not including end.
       *   <code>slice(1,4)</code> extracts the second element through the fourth element (elements indexed 1, 2, and 3).
       *   As a negative index, end indicates an offset from the end of the sequence. slice(2,-1) extracts the third element through the second-to-last element in the sequence.
       *   If end is omitted, slice extracts to the end of the sequence.
       * @return {qx.type.BaseArray} An new array which contains a copy of the given region.
       */
      slice: null,
      /**
       * Returns a string representing the array and its elements. Overrides the Object.prototype.toString method.
       *
       * @signature function()
       * @return {String} The string representation of the array.
       */
      toString: null,
      /**
       * Returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found.
       *
       * @signature function(searchElement, fromIndex)
       * @param searchElement {var} Element to locate in the array.
       * @param fromIndex {Integer?0} The index at which to begin the search. Defaults to 0, i.e. the
       *   whole array will be searched. If the index is greater than or equal to the length of the
       *   array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as
       *   the offset from the end of the array. Note that even when the index is negative, the array
       *   is still searched from front to back. If the calculated index is less than 0, the whole
       *   array will be searched.
       * @return {Integer} The index of the given element
       */
      indexOf: null,
      /**
       * Returns the last (greatest) index of an element within the array equal to the specified value, or -1 if none is found.
       *
       * @signature function(searchElement, fromIndex)
       * @param searchElement {var} Element to locate in the array.
       * @param fromIndex {Integer?length} The index at which to start searching backwards. Defaults to
       *   the array's length, i.e. the whole array will be searched. If the index is greater than
       *   or equal to the length of the array, the whole array will be searched. If negative, it
       *   is taken as the offset from the end of the array. Note that even when the index is
       *   negative, the array is still searched from back to front. If the calculated index is
       *   less than 0, -1 is returned, i.e. the array will not be searched.
       * @return {Integer} The index of the given element
       */
      lastIndexOf: null,
      /**
       * Executes a provided function once per array element.
       *
       * <code>forEach</code> executes the provided function (<code>callback</code>) once for each
       * element present in the array.  <code>callback</code> is invoked only for indexes of the array
       * which have assigned values; it is not invoked for indexes which have been deleted or which
       * have never been assigned values.
       *
       * <code>callback</code> is invoked with three arguments: the value of the element, the index
       * of the element, and the Array object being traversed.
       *
       * If a <code>obj</code> parameter is provided to <code>forEach</code>, it will be used
       * as the <code>this</code> for each invocation of the <code>callback</code>.  If it is not
       * provided, or is <code>null</code>, the global object associated with <code>callback</code>
       * is used instead.
       *
       * <code>forEach</code> does not mutate the array on which it is called.
       *
       * The range of elements processed by <code>forEach</code> is set before the first invocation of
       * <code>callback</code>.  Elements which are appended to the array after the call to
       * <code>forEach</code> begins will not be visited by <code>callback</code>. If existing elements
       * of the array are changed, or deleted, their value as passed to <code>callback</code> will be
       * the value at the time <code>forEach</code> visits them; elements that are deleted are not visited.
       *
       * @signature function(callback, obj)
       * @param callback {Function} Function to execute for each element.
       * @param obj {Object} Object to use as this when executing callback.
       */
      forEach: null,
      /**
       * Creates a new array with all elements that pass the test implemented by the provided
       * function.
       *
       * <code>filter</code> calls a provided <code>callback</code> function once for each
       * element in an array, and constructs a new array of all the values for which
       * <code>callback</code> returns a true value.  <code>callback</code> is invoked only
       * for indexes of the array which have assigned values; it is not invoked for indexes
       * which have been deleted or which have never been assigned values.  Array elements which
       * do not pass the <code>callback</code> test are simply skipped, and are not included
       * in the new array.
       *
       * <code>callback</code> is invoked with three arguments: the value of the element, the
       * index of the element, and the Array object being traversed.
       *
       * If a <code>obj</code> parameter is provided to <code>filter</code>, it will
       * be used as the <code>this</code> for each invocation of the <code>callback</code>.
       * If it is not provided, or is <code>null</code>, the global object associated with
       * <code>callback</code> is used instead.
       *
       * <code>filter</code> does not mutate the array on which it is called. The range of
       * elements processed by <code>filter</code> is set before the first invocation of
       * <code>callback</code>. Elements which are appended to the array after the call to
       * <code>filter</code> begins will not be visited by <code>callback</code>. If existing
       * elements of the array are changed, or deleted, their value as passed to <code>callback</code>
       * will be the value at the time <code>filter</code> visits them; elements that are deleted
       * are not visited.
       *
       * @signature function(callback, obj)
       * @param callback {Function} Function to test each element of the array.
       * @param obj {Object} Object to use as <code>this</code> when executing <code>callback</code>.
       * @return {qx.type.BaseArray} The newly created array with all matching elements
       */
      filter: null,
      /**
       * Creates a new array with the results of calling a provided function on every element in this array.
       *
       * <code>map</code> calls a provided <code>callback</code> function once for each element in an array,
       * in order, and constructs a new array from the results.  <code>callback</code> is invoked only for
       * indexes of the array which have assigned values; it is not invoked for indexes which have been
       * deleted or which have never been assigned values.
       *
       * <code>callback</code> is invoked with three arguments: the value of the element, the index of the
       * element, and the Array object being traversed.
       *
       * If a <code>obj</code> parameter is provided to <code>map</code>, it will be used as the
       * <code>this</code> for each invocation of the <code>callback</code>. If it is not provided, or is
       * <code>null</code>, the global object associated with <code>callback</code> is used instead.
       *
       * <code>map</code> does not mutate the array on which it is called.
       *
       * The range of elements processed by <code>map</code> is set before the first invocation of
       * <code>callback</code>. Elements which are appended to the array after the call to <code>map</code>
       * begins will not be visited by <code>callback</code>.  If existing elements of the array are changed,
       * or deleted, their value as passed to <code>callback</code> will be the value at the time
       * <code>map</code> visits them; elements that are deleted are not visited.
       *
       * @signature function(callback, obj)
       * @param callback {Function} Function produce an element of the new Array from an element of the current one.
       * @param obj {Object} Object to use as <code>this</code> when executing <code>callback</code>.
       * @return {qx.type.BaseArray} A new array which contains the return values of every item executed through the given function
       */
      map: null,
      /**
       * Tests whether some element in the array passes the test implemented by the provided function.
       *
       * <code>some</code> executes the <code>callback</code> function once for each element present in
       * the array until it finds one where <code>callback</code> returns a true value. If such an element
       * is found, <code>some</code> immediately returns <code>true</code>. Otherwise, <code>some</code>
       * returns <code>false</code>. <code>callback</code> is invoked only for indexes of the array which
       * have assigned values; it is not invoked for indexes which have been deleted or which have never
       * been assigned values.
       *
       * <code>callback</code> is invoked with three arguments: the value of the element, the index of the
       * element, and the Array object being traversed.
       *
       * If a <code>obj</code> parameter is provided to <code>some</code>, it will be used as the
       * <code>this</code> for each invocation of the <code>callback</code>. If it is not provided, or is
       * <code>null</code>, the global object associated with <code>callback</code> is used instead.
       *
       * <code>some</code> does not mutate the array on which it is called.
       *
       * The range of elements processed by <code>some</code> is set before the first invocation of
       * <code>callback</code>.  Elements that are appended to the array after the call to <code>some</code>
       * begins will not be visited by <code>callback</code>. If an existing, unvisited element of the array
       * is changed by <code>callback</code>, its value passed to the visiting <code>callback</code> will
       * be the value at the time that <code>some</code> visits that element's index; elements that are
       * deleted are not visited.
       *
       * @signature function(callback, obj)
       * @param callback {Function} Function to test for each element.
       * @param obj {Object} Object to use as <code>this</code> when executing <code>callback</code>.
       * @return {Boolean} Whether at least one elements passed the test
       */
      some: null,
      /**
       * Tests whether all elements in the array pass the test implemented by the provided function.
       *
       * <code>every</code> executes the provided <code>callback</code> function once for each element
       * present in the array until it finds one where <code>callback</code> returns a false value. If
       * such an element is found, the <code>every</code> method immediately returns <code>false</code>.
       * Otherwise, if <code>callback</code> returned a true value for all elements, <code>every</code>
       * will return <code>true</code>.  <code>callback</code> is invoked only for indexes of the array
       * which have assigned values; it is not invoked for indexes which have been deleted or which have
       * never been assigned values.
       *
       * <code>callback</code> is invoked with three arguments: the value of the element, the index of
       * the element, and the Array object being traversed.
       *
       * If a <code>obj</code> parameter is provided to <code>every</code>, it will be used as
       * the <code>this</code> for each invocation of the <code>callback</code>. If it is not provided,
       * or is <code>null</code>, the global object associated with <code>callback</code> is used instead.
       *
       * <code>every</code> does not mutate the array on which it is called. The range of elements processed
       * by <code>every</code> is set before the first invocation of <code>callback</code>. Elements which
       * are appended to the array after the call to <code>every</code> begins will not be visited by
       * <code>callback</code>.  If existing elements of the array are changed, their value as passed
       * to <code>callback</code> will be the value at the time <code>every</code> visits them; elements
       * that are deleted are not visited.
       *
       * @signature function(callback, obj)
       * @param callback {Function} Function to test for each element.
       * @param obj {Object} Object to use as <code>this</code> when executing <code>callback</code>.
       * @return {Boolean} Whether all elements passed the test
       */
      every: null
    }
  });
  (function () {
    function createStackConstructor(stack) {
      // In IE don't inherit from Array but use an empty object as prototype
      // and copy the methods from Array
      if (qx.core.Environment.get("engine.name") == "mshtml") {
        Stack.prototype = {
          length: 0,
          $$isArray: true
        };
        var args = "pop.push.reverse.shift.sort.splice.unshift.join.slice".split(".");
        for (var length = args.length; length;) {
          Stack.prototype[args[--length]] = Array.prototype[args[length]];
        }
      }

      // Remember Array's slice method
      var slice = Array.prototype.slice;

      // Fix "concat" method
      Stack.prototype.concat = function () {
        var constructor = this.slice(0);
        for (var i = 0, length = arguments.length; i < length; i++) {
          var copy;
          if (arguments[i] instanceof Stack) {
            copy = slice.call(arguments[i], 0);
          } else if (arguments[i] instanceof Array) {
            copy = arguments[i];
          } else {
            copy = [arguments[i]];
          }
          constructor.push.apply(constructor, copy);
        }
        return constructor;
      };

      // Fix "toString" method
      Stack.prototype.toString = function () {
        return slice.call(this, 0).toString();
      };

      // Fix "toLocaleString"
      Stack.prototype.toLocaleString = function () {
        return slice.call(this, 0).toLocaleString();
      };

      // Fix constructor
      Stack.prototype.constructor = Stack;

      // Add JS 1.6 Array features
      Stack.prototype.indexOf = Array.prototype.indexOf;
      Stack.prototype.lastIndexOf = Array.prototype.lastIndexOf;
      Stack.prototype.forEach = Array.prototype.forEach;
      Stack.prototype.some = Array.prototype.some;
      Stack.prototype.every = Array.prototype.every;
      var filter = Array.prototype.filter;
      var map = Array.prototype.map;

      // Fix methods which generates a new instance
      // to return an instance of the same class
      Stack.prototype.filter = function () {
        var ret = new this.constructor();
        ret.push.apply(ret, filter.apply(this, arguments));
        return ret;
      };
      Stack.prototype.map = function () {
        var ret = new this.constructor();
        ret.push.apply(ret, map.apply(this, arguments));
        return ret;
      };
      Stack.prototype.slice = function () {
        var ret = new this.constructor();
        ret.push.apply(ret, Array.prototype.slice.apply(this, arguments));
        return ret;
      };
      Stack.prototype.splice = function () {
        var ret = new this.constructor();
        ret.push.apply(ret, Array.prototype.splice.apply(this, arguments));
        return ret;
      };

      // Add new "toArray" method for convert a base array to a native Array
      Stack.prototype.toArray = function () {
        return Array.prototype.slice.call(this, 0);
      };

      // Add valueOf() to return the length
      Stack.prototype.valueOf = function () {
        return this.length;
      };

      // Return final class
      return Stack;
    }
    function Stack(length) {
      if (arguments.length === 1 && typeof length === "number") {
        this.length = -1 < length && length === length >> 0.5 ? length : this.push(length);
      } else if (arguments.length) {
        this.push.apply(this, arguments);
      }
    }
    function PseudoArray() {}
    PseudoArray.prototype = [];
    Stack.prototype = new PseudoArray();
    Stack.prototype.length = 0;
    qx.type.BaseArray = createStackConstructor(Stack);
  })();
  qx.type.BaseArray.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-5.js.map?dt=1769807053882
qx.$$packageData['5'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
