/**
 * Profile page
 *
 */
qx.Class.define("qxapp.pages.settings.Profile",
{
  extend : ville.ui.tabview.Page,

  include : qxapp.pages.MPage,

  construct() {

    const pagenameroot = "profile";
    const pageurl = `/settings/${pagenameroot}`;
    const pageName = qx.lang.String.firstUp(pagenameroot);

    super(pageName);

    this.setPageUrl(pageurl);

    // Set up the page
    this.addListener("appear", () => {document.title = `${pageName} - Laravel`});

    this.setAttribute("html", pagenameroot);

  }

});
