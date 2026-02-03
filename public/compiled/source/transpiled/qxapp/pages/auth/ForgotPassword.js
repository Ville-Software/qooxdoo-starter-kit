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
      "qxapp.pages.MPage": {
        "require": true
      },
      "qx.core.Init": {
        "construct": true
      },
      "ville.ui.form.Anchor": {
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
    extend: ville.ui.layout.Flex,
    include: qxapp.pages.MPage,
    construct() {
      ville.ui.layout.Flex.constructor.call(this);
      this.setComponentName("auth.ForgotPassword");
      const pagenameroot = "forgot-password";
      const pageurl = `/${pagenameroot}`;

      // Set up the page
      this.addListener("appear", () => {
        document.title = `Forgot password - Laravel`;
      });

      // Add to routing
      var routing = qx.core.Init.getApplication().getRouting();
      this.setPageUrl(pageurl);
      var login = new ville.ui.form.Anchor("Return to log in");
      login.setHref("/login");
      login.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("auth.Login", this);
      }, this);
      this.setAttribute("html", pagenameroot);
      this.add(login);
    }
  });
  qxapp.pages.auth.ForgotPassword.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=ForgotPassword.js.map?dt=1769806685496