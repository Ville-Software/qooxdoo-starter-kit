/**
 * Password page
 *
 */
qx.Class.define("qxapp.pages.settings.Password",
{
  extend : ville.ui.tabview.Page,

  include : qxapp.pages.MPage,

  construct() {

    const pagenameroot = "password";
    const pageName = qx.lang.String.firstUp(pagenameroot);

    super(pageName);

    // Set up the page
    this.addListener("appear", () => {document.title = `${pageName} - Laravel`});

    this.setAttribute("html", pagenameroot);

  }
});
