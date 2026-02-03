(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "ville.ui.layout.Flex": {
        "construct": true,
        "require": true
      },
      "qx.lang.String": {
        "construct": true
      },
      "qx.core.Init": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Dashboard page
   *
   */
  qx.Class.define("qxapp.pages.Dashboard", {
    extend: ville.ui.layout.Flex,
    construct() {
      ville.ui.layout.Flex.constructor.call(this);
      const pagenameroot = "dashboard";
      const pageurl = `/${pagenameroot}`;
      const pageName = qx.lang.String.firstUp(pagenameroot);

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
      });

      // Add to routing
      var routing = qx.core.Init.getApplication().getRouting();
      this.setPageUrl(pageurl);
    },
    properties: {
      /** Page's url made externally available */
      pageUrl: {
        check: "String",
        init: null
      },
      componentName: {
        check: "String",
        init: "Dashboard"
      }
    }
  });
  qxapp.pages.Dashboard.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Dashboard.js.map?dt=1769806685452