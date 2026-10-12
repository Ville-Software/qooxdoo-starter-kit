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
      },
      "ville.ui.navigation.Anchor": {
        "construct": true
      },
      "qx.core.Init": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Register page
   *
   */
  qx.Class.define("qxapp.pages.auth.Register", {
    extend: qx.ui.container.Composite,
    include: qxapp.pages.MPage,
    construct() {
      qx.ui.container.Composite.constructor.call(this, new qx.ui.layout.Canvas());
      this.setComponentName("auth.Register");
      const pagenameroot = "register";
      const pageurl = `/${pagenameroot}`;
      const pageName = qx.lang.String.firstUp(pagenameroot);

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
      });

      // Add to routing
      // var routing = qx.core.Init.getApplication().getRouting();
      this.setPageUrl(pageurl);
      var login = new ville.ui.navigation.Anchor("Log in");
      login.setHref("/login");
      login.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("auth.Login", this);
      }, this);
      this.getContentElement().setAttribute("html", pagenameroot);
      this.add(login);
    }
  });
  qxapp.pages.auth.Register.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Register.js.map?dt=1791841649259