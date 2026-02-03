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
   * Profile page
   *
   */
  qx.Class.define("qxapp.pages.settings.Profile", {
    extend: ville.ui.tabview.Page,
    include: qxapp.pages.MPage,
    construct() {
      const pagenameroot = "profile";
      const pageurl = `/settings/${pagenameroot}`;
      const pageName = qx.lang.String.firstUp(pagenameroot);
      ville.ui.tabview.Page.constructor.call(this, pageName);
      this.setPageUrl(pageurl);

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
      });
      this.setAttribute("html", pagenameroot);
    }
  });
  qxapp.pages.settings.Profile.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Profile.js.map?dt=1769806685582