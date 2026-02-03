/**
 * Register page
 *
 */
qx.Class.define("qxapp.pages.auth.Register",
{
  extend : ville.ui.layout.Flex,

  include : qxapp.pages.MPage,

  construct() {
    super();

    this.setComponentName("auth.Register");

    const pagenameroot = "register";
    const pageurl = `/${pagenameroot}`;
    const pageName = qx.lang.String.firstUp(pagenameroot);

    // Set up the page
    this.addListener("appear", () => {document.title = `${pageName} - Laravel`});

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
