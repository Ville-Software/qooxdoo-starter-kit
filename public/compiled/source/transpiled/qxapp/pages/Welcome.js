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
      "ville.ui.layout.Container": {
        "construct": true
      },
      "ville.ui.layout.HGroup": {
        "construct": true
      },
      "ville.ui.form.Anchor": {
        "construct": true
      },
      "qx.core.Init": {
        "construct": true
      },
      "ville.ui.core.Box": {
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
    extend: ville.ui.layout.Flex,
    include: qxapp.pages.MPage,
    construct() {
      ville.ui.layout.Flex.constructor.call(this);
      this.setComponentName("Welcome");
      this.setStyles({
        "padding": "var(--mantine-spacing-lg)",
        "gap": "var(--mantine-spacing-md)",
        "align-items": "center",
        "justify-content": "center",
        "flex-flow": "column wrap",
        "min-height": "calc(3.125rem * var(--mantine-scale))"
      });
      const pagenameroot = "welcome";
      const pageurl = "/";
      const pageName = qx.lang.String.firstUp(pagenameroot);

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
      });

      // Add to routing
      //var routing = qx.core.Init.getApplication().getRouting();
      this.setPageUrl(pageurl);

      // Header
      var header = new ville.ui.layout.Container("header");
      this.add(header);

      // Login and Register buttons
      var headernav = new ville.ui.layout.HGroup("nav");
      headernav.setStyles({
        "--group-gap": "var(--mantine-spacing-md)",
        "--group-align": "center",
        "--group-justify": "flex-end",
        "--group-wrap": "wrap"
      });
      header.add(headernav);
      var login = new ville.ui.form.Anchor("Log in");
      login.setHref("/login");
      login.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("auth.Login", this);
      }, this);
      headernav.add(login);
      var register = new ville.ui.form.Anchor("Register");
      register.setHref("/register");
      register.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("auth.Register", this);
      });
      headernav.add(register);

      // Main
      var mainwrapper = new ville.ui.layout.Flex();
      this.add(mainwrapper);
      var main = new ville.ui.core.Box("main");
      main.setCssUtilityClass("WelcomeBanner_wrapper__AZDUt");
      mainwrapper.add(main);
      main.setAttribute("html", "Main area content");
    }
  });
  qxapp.pages.Welcome.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Welcome.js.map?dt=1769806685479