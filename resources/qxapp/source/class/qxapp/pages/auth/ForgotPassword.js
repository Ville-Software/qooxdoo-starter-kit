/**
 * Forgot Password page
 *
 */
qx.Class.define("qxapp.pages.auth.ForgotPassword",
{
  extend : qx.ui.container.Composite,

  include : qxapp.pages.MPage,

  construct() {
    super(new qx.ui.layout.Canvas());

    this.setComponentName("auth.ForgotPassword");

    const pagenameroot = "forgot-password";
    const pageurl = `/${pagenameroot}`;

    // Set up the page
    this.addListener("appear", () => {document.title = `Forgot password - Laravel`});

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
