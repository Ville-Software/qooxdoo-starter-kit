(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "ville.ui.tabview.Page": {
        "construct": true,
        "require": true
      },
      "qxapp.pages.MPage": {
        "require": true
      },
      "qx.lang.String": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Appearance page
   *
   */
  qx.Class.define("qxapp.pages.settings.Appearance", {
    extend: ville.ui.tabview.Page,
    include: qxapp.pages.MPage,
    construct() {
      const pagenameroot = "appearance";
      const pageName = qx.lang.String.firstUp(pagenameroot);
      ville.ui.tabview.Page.constructor.call(this, pageName);

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
      });
      this.setAttribute("html", pagenameroot);
    }
  });
  qxapp.pages.settings.Appearance.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Appearance.js.map?dt=1769806685558