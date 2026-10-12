(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.tabview.Page": {
        "construct": true,
        "require": true
      },
      "qxapp.pages.MPage": {
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
   * Appearance page
   *
   */
  qx.Class.define("qxapp.pages.settings.Appearance", {
    extend: qx.ui.tabview.Page,
    include: qxapp.pages.MPage,
    construct() {
      const pagenameroot = "appearance";
      const pageurl = `/settings/${pagenameroot}`;
      const pageName = qx.lang.String.firstUp(pagenameroot) + " settings";
      this.setPageName(pageName);
      qx.ui.tabview.Page.constructor.call(this, qx.lang.String.firstUp(pagenameroot));
      this.setComponentName("settings.Appearance");
      this.setPageUrl(pageurl);

      // Update Button to link
      var pagebtnlink = this.getButton();
      pagebtnlink.getContentElement().setNodeName("a");
      pagebtnlink.getContentElement().setAttribute("href", pageurl);
      pagebtnlink.addListener("click", e => {
        e.preventDefault();
      });
      pagebtnlink.setNativeContextMenu(false);
      pagebtnlink.getChildControl("label").getContentElement().setStyle("text-align", "start");

      // Get the Routing object
      // const routing = qx.core.Init.getApplication().getRouting();
      const SettingsappHeader = qx.core.Init.getApplication().getStack().getSelection()[0].getHeader();

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
        //routing.getRouter().push({ url: pageurl });
        SettingsappHeader.getContentElement().setAttribute("html", pageName);
      });
      this.getContentElement().setAttribute("html", pagenameroot);
    }
  });
  qxapp.pages.settings.Appearance.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Appearance.js.map?dt=1791841649265