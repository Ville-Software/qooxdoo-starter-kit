(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.application.Standalone": {
        "require": true
      },
      "qx.ui.core.Widget": {},
      "ville.cssuc.MCssUtilityClass": {},
      "qx.log.appender.Native": {},
      "qx.log.appender.Console": {},
      "qx.io.PartLoader": {},
      "qx.ui.container.Stack": {},
      "qxapp.Routing": {},
      "qxapp.pages.app.AppShell": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     Copyright: 2026 sqville
  
     License: MIT license
  
     Authors: sqville
  
  ************************************************************************ */

  /**
   * This is the main application class of "qxapp"
   *
   * @external(mantine/core/styles/baseline.css)
   * @external(mantine/core/styles/default-css-variables.css)
   * @external(mantine/core/styles/global.css)
   * @external(qxapp/mantine-style-classes.css)
   * @external(mantine/core/styles/ScrollArea.css)
   *
   * @requires(ville.cssuc.MCssUtilityClass)
   */
  qx.Class.define("qxapp.Application", {
    extend: qx.application.Standalone,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __routing__P_2_0: null,
      __stack__P_2_1: null,
      __app__P_2_2: null,
      /**
       * This method contains the initial application code and gets called
       * during startup of the application
       *
       * @lint ignoreDeprecated(alert)
       */
      main() {
        qx.Class.include(qx.ui.core.Widget, ville.cssuc.MCssUtilityClass);

        // Call super class
        qxapp.Application.superclass.prototype.main.call(this);

        // Enable logging in debug variant

        {
          // support native logging capabilities, e.g. Firebug for Firefox
          qx.log.appender.Native;
          // support additional cross-browser console. Press F7 to toggle visibility
          qx.log.appender.Console;
        }

        // IDEA: Set the project's name dynamically
        //this.__appclassname = this.classname.split(".")[0];

        /*
        -------------------------------------------------------------------------
          Below is your actual application code...
        -------------------------------------------------------------------------
        */

        var approot = this.getRoot();

        // Change root dark body bg to a darker black
        /*var RootStyleUpdate = new ville.ui.basic.Element("style");
        RootStyleUpdate.setAttribute("html",`:root[data-mantine-color-scheme='dark'] {
          --mantine-color-text: '#fafafa';
          --mantine-color-body: '#0a0a0a'}`);
        approot.add(RootStyleUpdate);*/

        /**
         * Setup global routing
         *
         * The qx.core.Environment variable "inertia.rootView" is assigned by the project's compile.json
         * and needs to match the value for $rootView configured in your Laravel app's HandleInertiaRequests.php file
         */
        const InitialPage = JSON.parse(document.getElementById("app").dataset.page);
        this.initRouting(InitialPage);

        // load first page if not logged in
        if (!InitialPage.props.auth.user) {
          var curpg = this.__routing__P_2_0.getCurrentPage();
          var clazznm = curpg.component;
          qx.io.PartLoader.require([clazznm], () => {
            this.__stack__P_2_1 = new qx.ui.container.Stack();
            approot.add(this.__stack__P_2_1, {
              edge: 0
            });
            var clazz = qx.Class.getByName(`qxapp.pages.${clazznm}`);
            this.__stack__P_2_1.add(new clazz());
          }, this);
        } else {
          this.initAppShell();
        }
      },
      /**
       * Initialize the application's routing.
       */
      initRouting(initialpage) {
        if (!this.__routing__P_2_0) {
          this.__routing__P_2_0 = new qxapp.Routing(initialpage);
        }
      },
      /**
       * Returns the application's routing.
       *
       * @return {qxapp.Routing} The application's routing.
       */
      getRouting() {
        return this.__routing__P_2_0;
      },
      /**
       * Returns the application's stack widget.
       *
       * @return {ville.ui.layout.Stack} object
       */
      getStack() {
        const result = this.__stack__P_2_1 ?? this.__app__P_2_2;
        return result;
      },
      initAppShell() {
        // Clear the deck of all Welcome, Login and Register related objects
        if (this.__stack__P_2_1) {
          this.__stack__P_2_1.destroy();
          this.__stack__P_2_1 = null;
        }
        qx.io.PartLoader.require(["app.AppShell"], () => {
          this.__app__P_2_2 = new qx.ui.container.Stack();
          const appshell = new qxapp.pages.app.AppShell();
          this.__app__P_2_2.add(appshell);
          this.getRoot().add(this.__app__P_2_2, {
            edge: 0
          });
        }, this);
      },
      getLoadedStackPart(component) {
        var page = null;
        for (const stackobj of this.__stack__P_2_1.getSelectables()) {
          if (stackobj.getComponentName() == component) {
            page = stackobj;
            break;
          }
        }
        return page;
      },
      LoadStackPart(component, callingpage) {
        qx.io.PartLoader.require([component], () => {
          var comppg = this.getLoadedStackPart(component);
          if (!comppg) {
            var clazz = qx.Class.getByName(`qxapp.pages.${component}`);
            comppg = new clazz();
            this.__stack__P_2_1.add(comppg);
          }
          this.__stack__P_2_1.setSelection([comppg]);
          this.__routing__P_2_0.on(callingpage.getPageUrl(), () => {
            this.__stack__P_2_1.setSelection([callingpage]);
          });
          this.__routing__P_2_0.getRouter().push({
            url: comppg.getPageUrl()
          });
        }, this);
      }
    }
  });
  qxapp.Application.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Application.js.map?dt=1791841649075