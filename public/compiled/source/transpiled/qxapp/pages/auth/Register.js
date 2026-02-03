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
      "qx.lang.String": {
        "construct": true
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
   * Register page
   *
   */
  qx.Class.define("qxapp.pages.auth.Register", {
    extend: ville.ui.layout.Flex,
    include: qxapp.pages.MPage,
    construct() {
      ville.ui.layout.Flex.constructor.call(this);
      this.setComponentName("auth.Register");
      const pagenameroot = "register";
      const pageurl = `/${pagenameroot}`;
      const pageName = qx.lang.String.firstUp(pagenameroot);

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
      });

      // Add to routing
      var routing = qx.core.Init.getApplication().getRouting();
      this.setPageUrl(pageurl);
      var login = new ville.ui.form.Anchor("Log in");
      login.setHref("/login");
      login.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("auth.Login", this);
      }, this);
      this.setAttribute("html", pagenameroot);
      this.add(login);
    }
  });
  qxapp.pages.auth.Register.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Register.js.map?dt=1769806685542