(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.bom.client.Engine": {
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
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.Event": {},
      "qx.bom.client.Runtime": {
        "require": true
      },
      "qx.event.GlobalError": {
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
        },
        "runtime.name": {
          "className": "qx.bom.client.Runtime"
        },
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
       2007-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This handler provides events for qooxdoo application startup/shutdown logic.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   * @require(qx.bom.client.Engine)
   */
  qx.Class.define("qx.event.handler.Application", {
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
      this._window = manager.getWindow();
      this.__domReady__P_54_0 = false;
      this.__loaded__P_54_1 = false;
      this.__isReady__P_54_2 = false;
      this.__isInitialized__P_54_3 = false;
      this.__isUnloaded__P_54_4 = false;

      // Initialize observers
      this._initObserver();

      // Store instance (only supported for main app window, this
      // is the reason why this is OK here)
      qx.event.handler.Application.$$instance = this;
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
        ready: 1,
        shutdown: 1
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_WINDOW,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: true,
      /**
       * Sends the currently running application the ready signal. Used
       * exclusively by package loader system.
       *
       * @internal
       */
      onScriptLoaded() {
        var inst = qx.event.handler.Application.$$instance;
        if (inst) {
          inst.__fireReady__P_54_5();
        }
      },
      /**
       * Notifies that the application has finished initialization
       *
       * @internal
       */
      onAppInstanceInitialized() {
        var inst = qx.event.handler.Application.$$instance;
        if (inst) {
          inst.__fireAppInstanceInitialized__P_54_6();
        }
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
      __isReady__P_54_2: null,
      __isInitialized__P_54_3: null,
      __domReady__P_54_0: null,
      __loaded__P_54_1: null,
      __isUnloaded__P_54_4: null,
      /*
      ---------------------------------------------------------------------------
        USER ACCESS
      ---------------------------------------------------------------------------
      */

      /**
       * Fires a global ready event.
       *
       */
      __fireReady__P_54_5() {
        // Wrapper qxloader needed to be compatible with old generator
        if (!this.__isReady__P_54_2 && this.__domReady__P_54_0 && qx.$$loader.scriptLoaded) {
          // If qooxdoo is loaded within a frame in IE, the document is ready before
          // the "ready" listener can be added. To avoid any startup issue check
          // for the availability of the "ready" listener before firing the event.
          // So at last the native "load" will trigger the "ready" event.
          if (qx.core.Environment.get("engine.name") == "mshtml") {
            if (qx.event.Registration.hasListener(this._window, "ready")) {
              this.__isReady__P_54_2 = true;

              // Fire user event
              qx.event.Registration.fireEvent(this._window, "ready");
            }
          } else {
            this.__isReady__P_54_2 = true;

            // Fire user event
            qx.event.Registration.fireEvent(this._window, "ready");
          }
        }
      },
      /**
       * Fires a global "appinitialized" event.
       *
       */
      __fireAppInstanceInitialized__P_54_6() {
        this.__isInitialized__P_54_3 = true;

        // Fire user event
        qx.event.Registration.fireEvent(this._window, "appinitialized");
      },
      /**
       * Whether the application is ready.
       *
       * @return {Boolean} ready status
       */
      isApplicationReady() {
        return this.__isReady__P_54_2;
      },
      /**
       * Whether the application is initialized
       *
       * @return {Boolean} initialization status
       */
      isApplicationInitialized() {
        return this.__isInitialized__P_54_3;
      },
      /*
      ---------------------------------------------------------------------------
        OBSERVER INIT/STOP
      ---------------------------------------------------------------------------
      */

      /**
       * Initializes the native application event listeners.
       *
       */
      _initObserver() {
        // in Firefox the loader script sets the ready state
        if (qx.$$domReady || document.readyState == "complete" || document.readyState == "ready") {
          this.__domReady__P_54_0 = true;
          this.__fireReady__P_54_5();
        } else {
          this._onNativeLoadWrapped = qx.lang.Function.bind(this._onNativeLoad, this);
          if (qx.core.Environment.get("engine.name") == "gecko" || qx.core.Environment.get("engine.name") == "opera" || qx.core.Environment.get("engine.name") == "webkit" || qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") > 8) {
            // Using native method supported by Mozilla, Webkit, Opera and IE >= 9
            qx.bom.Event.addNativeListener(this._window, "DOMContentLoaded", this._onNativeLoadWrapped);
          } else if (typeof document !== "undefined") {
            var self = this;

            // Continually check to see if the document is ready
            var timer = function () {
              try {
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");
                if (document.body) {
                  self._onNativeLoadWrapped();
                }
              } catch (error) {
                window.setTimeout(timer, 100);
              }
            };
            timer();
          }

          // Additional load listener as fallback
          qx.bom.Event.addNativeListener(this._window, "load", this._onNativeLoadWrapped);
        }
        if (qx.core.Environment.get("runtime.name") == "rhino" || qx.core.Environment.get("runtime.name") == "node.js") {
          return;
        }
        this._onNativeUnloadWrapped = qx.lang.Function.bind(this._onNativeUnload, this);
        qx.bom.Event.addNativeListener(this._window, "unload", this._onNativeUnloadWrapped);
      },
      /**
       * Disconnect the native application event listeners.
       *
       */
      _stopObserver() {
        if (this._onNativeLoadWrapped) {
          qx.bom.Event.removeNativeListener(this._window, "load", this._onNativeLoadWrapped);
        }
        qx.bom.Event.removeNativeListener(this._window, "unload", this._onNativeUnloadWrapped);
        this._onNativeLoadWrapped = null;
        this._onNativeUnloadWrapped = null;
      },
      /*
      ---------------------------------------------------------------------------
        NATIVE LISTENER
      ---------------------------------------------------------------------------
      */

      /**
       * When qx.globalErrorHandling is enabled the callback will observed
       */
      _onNativeLoad() {
        var callback = qx.core.Environment.select("qx.globalErrorHandling", {
          true: qx.event.GlobalError.observeMethod(this.__onNativeLoadHandler__P_54_7),
          false: this.__onNativeLoadHandler__P_54_7
        });
        callback.apply(this, arguments);
      },
      /**
       * Event listener for native load event
       */
      __onNativeLoadHandler__P_54_7() {
        this.__domReady__P_54_0 = true;
        this.__fireReady__P_54_5();
      },
      /**
       * When qx.globalErrorHandling is enabled the callback will observed
       */
      _onNativeUnload() {
        var callback = qx.core.Environment.select("qx.globalErrorHandling", {
          true: qx.event.GlobalError.observeMethod(this.__onNativeUnloadHandler__P_54_8),
          false: this.__onNativeUnloadHandler__P_54_8
        });
        callback.apply(this, arguments);
      },
      /**
       * Event listener for native unload event
       */
      __onNativeUnloadHandler__P_54_8() {
        if (!this.__isUnloaded__P_54_4) {
          this.__isUnloaded__P_54_4 = true;
          try {
            // Fire user event
            qx.event.Registration.fireEvent(this._window, "shutdown");
          } catch (e) {
            // IE doesn't execute the "finally" block if no "catch" block is present
            throw e;
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
      this._stopObserver();
      this._window = null;
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
  qx.event.handler.Application.$$dbClassInfo = $$dbClassInfo;
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
      "qx.log.Logger": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.Bootstrap": {},
      "qx.event.handler.Application": {}
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
        "os.name": {
          "className": "qx.bom.client.OperatingSystem"
        },
        "qx.debug.startupTimings": {},
        "qx.application": {}
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
       * Sebastian Werner (wpbasti)
       * Daniel Wagner (d_wagner)
       * John Spackman
  
  ************************************************************************ */

  /**
   * This is the base class for non-browser qooxdoo applications.
   */
  qx.Class.define("qx.core.BaseInit", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      __application__P_55_0: null,
      /**
       * Returns the instantiated qooxdoo application.
       *
       * @return {qx.core.Object} The application instance.
       */
      getApplication() {
        return this.__application__P_55_0 || null;
      },
      /**
       * Runs when the application is loaded. Automatically creates an instance
       * of the class defined by the setting <code>qx.application</code>.
       *
       */
      ready() {
        if (this.__application__P_55_0) {
          return;
        }
        if (qx.core.Environment.get("engine.name") == "") {
          qx.log.Logger.warn("Could not detect engine!");
        }
        if (qx.core.Environment.get("engine.version") == "") {
          qx.log.Logger.warn("Could not detect the version of the engine!");
        }
        if (qx.core.Environment.get("os.name") == "") {
          qx.log.Logger.warn("Could not detect operating system!");
        }
        if (qx.core.Environment.get("qx.debug.startupTimings")) {
          qx.log.Logger.debug(this, "Load runtime: " + (new Date() - qx.Bootstrap.LOADSTART) + "ms");
        }
        var app = qx.core.Environment.get("qx.application");
        var clazz = qx.Class.getByName(app);
        if (clazz) {
          this.__application__P_55_0 = new clazz();
          var start = new Date();
          this.__application__P_55_0.main();
          if (qx.core.Environment.get("qx.debug.startupTimings")) {
            qx.log.Logger.debug(this, "Main runtime: " + (new Date() - start) + "ms");
          }
          var start = new Date();
          this.__application__P_55_0.finalize();
          if (qx.core.Environment.get("qx.debug.startupTimings")) {
            qx.log.Logger.debug(this, "Finalize runtime: " + (new Date() - start) + "ms");
          }
          qx.event.handler.Application.onAppInstanceInitialized();
        } else {
          qx.log.Logger.warn("Missing application class: " + app);
        }
      },
      /**
       * Runs before the document is unloaded. Calls the application's close
       * method to check if the unload process should be stopped.
       *
       * @param e {qx.event.type.Native} Incoming beforeunload event.
       */
      __close__P_55_1(e) {
        var app = this.__application__P_55_0;
        if (app) {
          app.close();
        }
      },
      /**
       * Runs when the document is unloaded. Automatically terminates a previously
       * created application instance.
       *
       */
      __shutdown__P_55_2() {
        var app = this.__application__P_55_0;
        if (app) {
          app.terminate();
        }
      }
    }
  });
  qx.core.BaseInit.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.Application": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.handler.Window": {
        "require": true,
        "defer": "runtime"
      },
      "qx.event.dispatch.Direct": {
        "require": true,
        "defer": "runtime"
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.BaseInit": {
        "require": true
      },
      "qx.event.Registration": {
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
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * This is the base class for all qooxdoo applications.
   *
   * @require(qx.event.handler.Application)
   * @require(qx.event.handler.Window)
   * @require(qx.event.dispatch.Direct)
   */
  qx.Class.define("qx.core.Init", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Returns the instantiated qooxdoo application.
       *
       * @return {qx.core.Object} The application instance.
       */
      getApplication: qx.core.BaseInit.getApplication,
      /**
       * Runs when the application is loaded. Automatically creates an instance
       * of the class defined by the setting <code>qx.application</code>.
       *
       */
      ready: qx.core.BaseInit.ready,
      /**
       * Runs before the document is unloaded. Calls the application's close
       * method to check if the unload process should be stopped.
       *
       * @param e {qx.event.type.Native} Incoming beforeunload event.
       */
      __close__P_10_0(e) {
        var app = this.getApplication();
        if (app) {
          e.setReturnValue(app.close());
        }
      },
      /**
       * Runs when the document is unloaded. Automatically terminates a previously
       * created application instance.
       *
       */
      __shutdown__P_10_1() {
        var app = this.getApplication();
        if (app) {
          app.terminate();
        }
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      qx.event.Registration.addListener(window, "ready", statics.ready, statics);
      qx.event.Registration.addListener(window, "shutdown", statics.__shutdown__P_10_1, statics);
      qx.event.Registration.addListener(window, "beforeunload", statics.__close__P_10_0, statics);
    }
  });
  qx.core.Init.$$dbClassInfo = $$dbClassInfo;
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
  
  ************************************************************************ */

  /**
   * This interface defines what an application class has to implement.
   */
  qx.Interface.define("qx.application.IApplication", {
    members: {
      /**
       * Called when the application relevant classes are loaded and ready.
       *
       */
      main() {},
      /**
       * Called when the application's main method was executed to handle
       * "final" tasks like rendering or retrieving data.
       *
       */
      finalize() {},
      /**
       * Called in the document.beforeunload event of the browser. If the method
       * returns a string value, the user will be asked by the browser, whether
       * he really wants to leave the page. The return string will be displayed in
       * the message box.
       *
       * @return {String?null} message text on unloading the page
       */
      close() {},
      /**
       * This method contains the last code which is run inside the page and may contain cleanup code.
       *
       */
      terminate() {}
    }
  });
  qx.application.IApplication.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.module.Animation": {},
      "qx.core.Init": {
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "require": true
      },
      "qx.application.IApplication": {
        "require": true
      },
      "qx.locale.MTranslation": {
        "require": true
      },
      "qx.theme.manager.Meta": {},
      "qx.ui.tooltip.Manager": {},
      "qx.ui.style.Stylesheet": {},
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
  
  ************************************************************************ */

  /**
   * Abstract base class for GUI applications using qooxdoo widgets.
   *
   * @require(qx.core.Init)
   * @use(qx.module.Animation)
   */
  qx.Class.define("qx.application.AbstractGui", {
    type: "abstract",
    extend: qx.core.Object,
    implement: [qx.application.IApplication],
    include: qx.locale.MTranslation,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** @type {qx.ui.core.Widget} The root widget */
      __root__P_99_0: null,
      /**
       * Create the root widget. This method is abstract and must be overridden
       * by sub classes.
       *
       * @return {qx.ui.core.Widget} The root widget. This widget must be configured
       *     with a {@link qx.ui.layout.Basic} or {@link qx.ui.layout.Canvas} layout.
       */
      _createRootWidget() {
        throw new Error("Abstract method call");
      },
      /**
       * Returns the application's root widget. The root widgets can act as container
       * for popups. It is configured with a {@link qx.ui.layout.Basic} (if the
       * application is an inline application) layout or a {@link qx.ui.layout.Canvas}
       * (if the application is a standalone application) layout .
       *
       * The root has the same add method as the configured layout
       * ({@link qx.ui.layout.Basic} or {@link qx.ui.layout.Canvas}).
       *
       * @return {qx.ui.core.Widget} The application's root widget.
       */
      getRoot() {
        return this.__root__P_99_0;
      },
      // interface method
      main() {
        // Initialize themes
        qx.theme.manager.Meta.getInstance().initialize();

        // Initialize tooltip manager
        qx.ui.tooltip.Manager.getInstance();
        var rule = ["-webkit-touch-callout: none;", "-ms-touch-select: none;", "-webkit-tap-highlight-color: rgba(0,0,0,0);", "-webkit-tap-highlight-color: transparent;"].join("");
        qx.ui.style.Stylesheet.getInstance().addRule("*", rule);
        this.__root__P_99_0 = this._createRootWidget();

        // make sure we start with a good scroll position
        window.scrollTo(0, 0);
      },
      // interface method
      finalize() {
        this.render();
      },
      /**
       * Updates the GUI rendering
       *
       */
      render() {
        qx.ui.core.queue.Manager.flush();
      },
      // interface method
      close(val) {
        // empty
      },
      // interface method
      terminate() {
        // empty
      }
    }
  });
  qx.application.AbstractGui.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Init": {
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.application.AbstractGui": {
        "require": true
      },
      "qx.ui.root.Application": {}
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
   * For a GUI application that looks & feels like native desktop application
   * (often called "RIA" - Rich Internet Application).
   *
   * Such a stand-alone application typically creates and updates all content
   * dynamically. Often it is called a "single-page application", since the
   * document itself is never reloaded or changed. Communication with the server
   * is done with AJAX.
   *
   * @require(qx.core.Init)
   */
  qx.Class.define("qx.application.Standalone", {
    extend: qx.application.AbstractGui,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      _createRootWidget() {
        return new qx.ui.root.Application(document);
      }
    }
  });
  qx.application.Standalone.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-3.js.map?dt=1769807053831
qx.$$packageData['3'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
