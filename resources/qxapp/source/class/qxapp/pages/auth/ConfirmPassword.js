/**
 * Confirm Password page
 *
 */
qx.Class.define("qxapp.pages.auth.ConfirmPassword",
{
  extend : qx.ui.container.Composite,

  include : qxapp.pages.MPage,

  construct() {

    const pagenameroot = "confirm-password";
    const pageurl = `/user/${pagenameroot}`;
    const pageName = "Confirm password"
    this.setPageName(pageName);

    super(new qx.ui.layout.Canvas());

    this.setComponentName("auth.ConfirmPassword");

    this.setPageUrl(pageurl);

    // Set up the page
    this.addListener("appear", () => {document.title = `${pageName} - Laravel`});

    this.getContentElement().setAttribute("html", pagenameroot);

  }
});
