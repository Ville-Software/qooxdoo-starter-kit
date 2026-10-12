/**
 * Dashboard page
 *
 */
qx.Class.define("qxapp.pages.Dashboard",
{
  extend : qx.ui.container.Composite,

  include : qxapp.pages.MPage,

  construct() {
    super(new qx.ui.layout.Canvas());

    const pagenameroot = "dashboard";
    const pageurl = `/${pagenameroot}`;
    const pageName = qx.lang.String.firstUp(pagenameroot);
    this.setPageName(pageName);

    this.setComponentName(pageName);

    // Set up the page
    this.addListener("appear", () => {document.title = `${pageName} - Laravel`});

    // Add to routing
    // var routing = qx.core.Init.getApplication().getRouting();
    this.setPageUrl(pageurl);

  }

});
