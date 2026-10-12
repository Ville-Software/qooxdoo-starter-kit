/**
 * Register page
 *
 */
qx.Class.define("qxapp.pages.auth.Register",
{
  extend : qx.ui.container.Composite,

  include : qxapp.pages.MPage,

  construct() {
    super(new qx.ui.layout.Canvas());

    this.setComponentName("auth.Register");

    const pagenameroot = "register";
    const pageurl = `/${pagenameroot}`;
    const pageName = qx.lang.String.firstUp(pagenameroot);

    // Set up the page
    this.addListener("appear", () => {document.title = `${pageName} - Laravel`});

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
