/* ************************************************************************

   Copyright: 2026 sqville

   License: MIT license

   Authors: sqville

************************************************************************ */

/**
 * This is the main application class of "qxapp"
 *
 * @asset(qxapp/*)
 */
qx.Class.define("qxapp.Application",
{
  extend : ville.ui.application.Standalone,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {

    __routing : null,

    __stack : null,

    __app : null,

    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     *
     * @lint ignoreDeprecated(alert)
     */
    main()
    {
      // Call super class
      super.main();

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      var approot = this.getRoot();

      // Change root dark body bg to a darker black
      var RootStyleUpdate = new ville.ui.basic.Element("style");
      RootStyleUpdate.setAttribute("html",`:root[data-mantine-color-scheme='dark'] {
        --mantine-color-text: '#fafafa';
        --mantine-color-body: '#0a0a0a'}`);
      //approot.add(RootStyleUpdate);

      // Setup global routing
      const InitialPage = JSON.parse(document.getElementById('app').dataset.page);
      this.initRouting(InitialPage);

      // load first page if not logged in
      if (!InitialPage.props.auth.user) {
        var curpg = this.__routing.getCurrentPage();
        var clazznm = curpg.component;
        qx.io.PartLoader.require([clazznm],() => {
            this.__stack = new ville.ui.layout.Stack();
            approot.add(this.__stack);
            var clazz = qx.Class.getByName(`qxapp.pages.${clazznm}`);
            this.__stack.add(new clazz());
        }, this);
      } else {
        this.initAppShell();
      }

    },

    /**
     * Initialize the application's routing.
     */
    initRouting(initialpage) {
      if (!this.__routing) {
        this.__routing = new qxapp.Routing(initialpage);
      }
    },

    /**
     * Returns the application's routing.
     *
     * @return {qxapp.Routing} The application's routing.
     */
    getRouting() {
      return this.__routing;
    },

    /**
     * Returns the application's stack widget.
     *
     * @return {ville.ui.layout.Stack} object
     */
    getStack() {
      const result = this.__stack ?? this.__app;
      return result;
    },

    initAppShell() {

        // Clear the deck of all Welcome, Login and Register related objects
        if (this.__stack) {
            this.__stack.destroy();
            this.__stack = null;
        }

        qx.io.PartLoader.require(["appshell"],() => {
            this.__app = new ville.ui.layout.Stack();
            const appshell = new qxapp.app.AppShell();
            this.__app.add(appshell);
            this.getRoot().add(this.__app);
        }, this);

    },

    getLoadedStackPart(component) {
        var page = null;
        for (const stackobj of this.__stack.getSelectables()) {
            if (stackobj.getComponentName() == component) {
                page = stackobj;
                break;
            }
        }
        return page;
    },

    LoadStackPart(component, callingpage) {
        qx.io.PartLoader.require([component],() => {
            var comppg = this.getLoadedStackPart(component);
            if (!comppg) {
                var clazz = qx.Class.getByName(`qxapp.pages.${component}`);
                comppg = new clazz();
                this.__stack.add(comppg);
            }
            this.__stack.setSelection([comppg]);
            this.__routing.on(callingpage.getPageUrl(), () => { this.__stack.setSelection([callingpage]) });
            this.__routing.getRouter().push({ url: comppg.getPageUrl() });
        }, this);
    }

  }
});
