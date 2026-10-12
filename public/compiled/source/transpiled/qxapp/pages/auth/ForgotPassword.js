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
   * Forgot Password page
   *
   */
  qx.Class.define("qxapp.pages.auth.ForgotPassword", {
    extend: qx.ui.container.Composite,
    include: qxapp.pages.MPage,
    construct() {
      qx.ui.container.Composite.constructor.call(this, new qx.ui.layout.Canvas());
      this.setComponentName("auth.ForgotPassword");
      const pagenameroot = "forgot-password";
      const pageurl = `/${pagenameroot}`;

      // Set up the page
      this.addListener("appear", () => {
        document.title = `Forgot password - Laravel`;
      });

      // Add to routing
      // var routing = qx.core.Init.getApplication().getRouting();
      this.setPageUrl(pageurl);
      var login = new ville.ui.navigation.Anchor("Return to log in");
      login.setHref("/login");
      login.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("auth.Login", this);
      }, this);
      this.getContentElement().setAttribute("html", pagenameroot);
      this.add(login);
    }
  });
  qxapp.pages.auth.ForgotPassword.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=ForgotPassword.js.map?dt=1791841649231