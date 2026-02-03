/**
 *
 * Basic application routing manager.
 *
 * Define routes to react on certain GET / POST / DELETE / PUT operations.
 *
 * * GET is triggered when the hash value of the url is changed. Can be called
 *   manually by calling the {@link #executeGet} method.
 * * POST / DELETE / PUT has to be triggered manually right now (will be changed later)
 *    by calling the {@link #executePost}, {@link #executeDelete}, {@link #executePut} method.
 *
 * Note this class must be disposed after use
 */
qx.Bootstrap.define("qxapp.Routing", {
  implement: [qx.core.IDisposable],

  construct(initialpage) {
    this.__messaging = new qx.event.Messaging();

    window.addEventListener('popstate', function(event) {
        var routing = qx.core.Init.getApplication().getRouting();
        routing.execute(event.state.page.url);
    });

    if (initialpage) {
        // require inertiajs core library
        var Inertia = require('@inertiajs/core');

        // initialize the Inertia page
        Inertia.router.init({
            initialPage: initialpage,
            resolveComponent: () => {},
            swapComponent: () => {return qx.Promise.resolve()}
        });

        this.__inertiaRouter = Inertia.router;

        this.__currentPage = initialpage;
    }
  },

  statics: {
    DEFAULT_PATH: "",

    __back: [],

    __forward: []
  },

  members: {

    __messaging: null,

    __currentGetPath: null,

    __inertiaRouter: null,

    __currentPage: null,

    /**
     * Initialization method used to execute the get route for the currently set history path.
     * If no path is set, either the given argument named <code>defaultPath</code>
     * or the {@link #DEFAULT_PATH} will be used for initialization.
     *
     * @param defaultPath {String?} Optional default path for initialization.
     */
    init(defaultPath) {
      if (qx.core.Environment.get("qx.debug")) {
        if (defaultPath != null) {
          qx.core.Assert.assertString(
            defaultPath,
            "Invalid argument 'defaultPath'"
          );
        }
      }
    },

    getRouter() {
        return this.__inertiaRouter;
    },

    getCurrentPage() {
        return this.__currentPage;
    },

    setCurrentPage(page) {
        this.__currentPage = page;
    },

    /**
     * Checks if path is valid and registered in channel "get" and then just returns it.
     * If the path is not valid either the <code>defaultPath</code> (if given) or the
     * {@link #DEFAULT_PATH} will be returned.
     *
     * @param path {String} Path which gets checked.
     * @param defaultPath {String?} Optional default path.
     * @return {String} A valid path.
     */
    _getPathOrFallback(path, defaultPath) {
      if (path == "" || path == null || !this.__messaging.has("get", path)) {
        path = defaultPath || qxapp.Routing.DEFAULT_PATH;
      }
      return path;
    },

    /**
     * Adds a route handler for the "get" operation. The route gets called
     * when the {@link #executeGet} method found a match.
     *
     * @param route {String|RegExp} The route, used for checking if the executed path matches.
     * @param handler {Function} The handler to call, when the route matches with the executed path.
     * @param scope {Object} The scope of the handler.
     * @return {String} Event listener ID
     */
    onGet(route, handler, scope) {
      return this.__messaging.on("get", route, handler, scope);
    },

    /**
     * This is a shorthand for {@link #onGet}.
     *
     * @param route {String|RegExp} The route, used for checking if the executed path matches.
     * @param handler {Function} The handler to call, when the route matches with the executed path.
     * @param scope {Object} The scope of the handler.
     * @return {String} Event listener ID
     */
    on(route, handler, scope) {
      return this.onGet(route, handler, scope);
    },

    /**
     * Adds a route handler for the "post" operation. The route gets called
     * when the {@link #executePost} method found a match.
     *
     * @param route {String|RegExp} The route, used for checking if the executed path matches.
     * @param handler {Function} The handler to call, when the route matches with the executed path.
     * @param scope {Object} The scope of the handler.
     * @return {String} Event listener ID
     */
    onPost(route, handler, scope) {
      return this.__messaging.on("post", route, handler, scope);
    },

    /**
     * Adds a route handler for the "put" operation. The route gets called
     * when the {@link #executePut} method found a match.
     *
     * @param route {String|RegExp} The route, used for checking if the executed path matches
     * @param handler {Function} The handler to call, when the route matches with the executed path
     * @param scope {Object} The scope of the handler
     * @return {String} Event listener ID
     */
    onPut(route, handler, scope) {
      return this.__messaging.on("put", route, handler, scope);
    },

    /**
     * Adds a route handler for the "delete" operation. The route gets called
     * when the {@link #executeDelete} method found a match.
     *
     * @param route {String|RegExp} The route, used for checking if the executed path matches
     * @param handler {Function} The handler to call, when the route matches with the executed path
     * @param scope {Object} The scope of the handler
     * @return {String} Event listener ID
     */
    onDelete(route, handler, scope) {
      return this.__messaging.on("delete", route, handler, scope);
    },

    /**
     * Adds a route handler for the "any" operation. The "any" operation is called
     * before all other operations.
     *
     * @param route {String|RegExp} The route, used for checking if the executed path matches
     * @param handler {Function} The handler to call, when the route matches with the executed path
     * @param scope {Object} The scope of the handler
     * @return {String} Event listener ID
     */
    onAny(route, handler, scope) {
      return this.__messaging.onAny(route, handler, scope);
    },

    /**
     * Removes a registered route by the given id.
     *
     * @param id {String} The id of the registered route
     */
    remove(id) {
      this.__messaging.remove(id);
    },

    /**
     * Executes the get operation and informs all matching route handler.
     *
     * @param path {String} The path to execute
     * @param customData {var} The given custom data that should be propagated
     * @param fromEvent {var} Determines whether this method was called from history
     *
     */
    _executeGet(path, customData, fromEvent) {
      this.__currentGetPath = path;

      var history = this.__getFromHistory(path);
      if (history) {
        if (!customData) {
          customData = history.data.customData || {};
          customData.fromHistory = true;
          customData.action = history.action;
          customData.fromEvent = fromEvent;
        } else {
          this.__replaceCustomData(path, customData);
        }
      } else {
        this.__addToHistory(path, customData);
        qxapp.Routing.__forward = [];
      }

      this.__messaging.emit("get", path, null, customData);
    },

    /**
     * Executes the get operation and informs all matching route handler.
     *
     * @param path {String} The path to execute
     * @param customData {var} The given custom data that should be propagated
     */
    executeGet(path, customData) {
      this._executeGet(path, customData);
    },

    /**
     * This is a shorthand for {@link #executeGet}.
     *
     * @param path {String} The path to execute
     * @param customData {var} The given custom data that should be propagated
     */
    execute(path, customData) {
      this.executeGet(path, customData);
    },

    /**
     * Executes the post operation and informs all matching route handler.
     *
     * @param path {String} The path to execute
     * @param params {Map} The given parameters that should be propagated
     * @param customData {var} The given custom data that should be propagated
     */
    executePost(path, params, customData) {
      this.__messaging.emit("post", path, params, customData);
    },

    /**
     * Executes the put operation and informs all matching route handler.
     *
     * @param path {String} The path to execute
     * @param params {Map} The given parameters that should be propagated
     * @param customData {var} The given custom data that should be propagated
     */
    executePut(path, params, customData) {
      this.__messaging.emit("put", path, params, customData);
    },

    /**
     * Executes the delete operation and informs all matching route handler.
     *
     * @param path {String} The path to execute
     * @param params {Map} The given parameters that should be propagated
     * @param customData {var} The given custom data that should be propagated
     */
    executeDelete(path, params, customData) {
      this.__messaging.emit("delete", path, params, customData);
    },

    /**
     * Adds the custom data of a given path to the history.
     *
     * @param path {String} The path to store.
     * @param customData {var} The custom data to store
     */
    __addToHistory(path, customData) {
      qxapp.Routing.__back.unshift({
        path: path,
        customData: customData
      });
    },

    /**
     * Replaces the customData in the history objects with the recent custom data.
     * @param path {String} The path to replace.
     * @param customData {var} The custom data to store.
     */
    __replaceCustomData(path, customData) {
      var register = [
        qxapp.Routing.__back,
        qxapp.Routing.__forward
      ];

      for (var i = 0; i < register.length; i++) {
        for (var j = 0; j < register[i].length; j++) {
          if (register[i][j].path == path) {
            register[i][j].customData = customData;
          }
        }
      }
    },

    /**
     * Returns a history entry for a certain path.
     *
     * @param path {String} The path of the entry
     * @return {Map|null} The retrieved entry. <code>null</code> when no entry was found.
     */
    __getFromHistory(path) {
      var back = qxapp.Routing.__back;
      var forward = qxapp.Routing.__forward;
      var found = false;

      var entry = null;
      var length = back.length;
      for (var i = 0; i < length; i++) {
        if (back[i].path == path) {
          entry = back[i];
          var toForward = back.splice(0, i);
          for (var a = 0; a < toForward.length; a++) {
            forward.unshift(toForward[a]);
          }
          found = true;
          break;
        }
      }
      if (found) {
        return {
          data: entry,
          action: "back"
        };
      }

      var length = forward.length;
      for (var i = 0; i < length; i++) {
        if (forward[i].path == path) {
          entry = forward[i];
          var toBack = forward.splice(0, i + 1);
          for (var a = 0; a < toBack.length; a++) {
            back.unshift(toBack[a]);
          }
          break;
        }
      }

      if (entry) {
        return {
          data: entry,
          action: "forward"
        };
      }
      return entry;
    },

    /**
     * Navigates back to the previously executed path.
     *
     * @param customData {Map?} The given custom data that should be propagated.
     *   If it contains a key <code>defaultPath</code> and no history data is
     *   available, its value is used as a target path. If it does not include
     *   such a key, the routing's default path is used instead (again only for
     *   empty history).
     *   This behavior is useful for instance when reloading a page during
     *   development but expecting the page's back button always to work.
     */
    back(customData) {
      var data = customData;
      if (data) {
        data["action"] = "back";
      } else {
        data = {
          action: "back"
        };
      }

      var path,
        back = qxapp.Routing.__back;

      if (back.length > 0) {
        // Remove current state
        back.shift();
      }

      if (back.length > 0) {
        // Get previous state
        var state = back.shift();

        this._executeGet(state.path, data);
      } else if (data.defaultPath) {
        path = data.defaultPath;
        delete data.defaultPath;
        this._executeGet(path, data);
      } else if (qxapp.Routing.DEFAULT_PATH) {
        this._executeGet(qxapp.Routing.DEFAULT_PATH, data);
      }
    }

  }
});
