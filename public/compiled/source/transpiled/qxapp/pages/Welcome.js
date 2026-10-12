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
      "qx.ui.layout.VBox": {
        "construct": true
      },
      "qx.lang.String": {
        "construct": true
      },
      "qx.ui.layout.Canvas": {
        "construct": true
      },
      "qx.ui.layout.HBox": {
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
   * Welcome page
   *
   * @external(qxapp/welcome-qxvui-01.css)
   *
   */
  qx.Class.define("qxapp.pages.Welcome", {
    extend: qx.ui.container.Composite,
    include: qxapp.pages.MPage,
    construct() {
      qx.ui.container.Composite.constructor.call(this, new qx.ui.layout.VBox(20));
      this.setComponentName("Welcome");
      const pagenameroot = "welcome";
      const pageurl = "/";
      const pageName = qx.lang.String.firstUp(pagenameroot);

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
      });
      this.setPageUrl(pageurl);

      // Header
      var header = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
      header.getContentElement().setNodeName("header");
      this.add(header);

      // Login and Register buttons
      var headernav = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
      headernav.getContentElement().setNodeName("nav");
      header.add(headernav, {
        top: 0,
        right: 10
      });
      var login = new ville.ui.navigation.Anchor("Log in");
      login.setHref("/login");
      login.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("auth.Login", this);
      }, this);
      headernav.add(login);
      var register = new ville.ui.navigation.Anchor("Register");
      register.setHref("/register");
      register.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("auth.Register", this);
      });
      headernav.add(register);

      // Main
      var mainwrapper = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
      this.add(mainwrapper);
      var main = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
      main.getContentElement().setNodeName("main");
      main.setCssUtilityClass("WelcomeBanner_wrapper__AZDUt");
      mainwrapper.add(main, {
        edge: 0
      });
      main.getContentElement().setAttribute("html", "Main area content");
    }
  });
  qxapp.pages.Welcome.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Welcome.js.map?dt=1791841649176