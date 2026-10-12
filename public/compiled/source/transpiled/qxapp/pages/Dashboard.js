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
      "qxapp.pages.MPage": {
        "require": true
      },
      "qx.ui.layout.Canvas": {
        "construct": true
      },
      "qx.lang.String": {
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
    extend: qx.ui.container.Composite,
    include: qxapp.pages.MPage,
    construct() {
      qx.ui.container.Composite.constructor.call(this, new qx.ui.layout.Canvas());
      const pagenameroot = "dashboard";
      const pageurl = `/${pagenameroot}`;
      const pageName = qx.lang.String.firstUp(pagenameroot);
      this.setPageName(pageName);
      this.setComponentName(pageName);

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
      });

      // Add to routing
      // var routing = qx.core.Init.getApplication().getRouting();
      this.setPageUrl(pageurl);
    }
  });
  qxapp.pages.Dashboard.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Dashboard.js.map?dt=1791841649108