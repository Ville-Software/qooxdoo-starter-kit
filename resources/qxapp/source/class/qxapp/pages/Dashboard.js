/**
 * Dashboard page
 *
 */
qx.Class.define("qxapp.pages.Dashboard",
{
  extend : ville.ui.layout.Flex,

  construct() {
    super();

    const pagenameroot = "dashboard";
    const pageurl = `/${pagenameroot}`;
    const pageName = qx.lang.String.firstUp(pagenameroot);

    // Set up the page
    this.addListener("appear", () => {document.title = `${pageName} - Laravel`});

    // Add to routing
    var routing = qx.core.Init.getApplication().getRouting();
    this.setPageUrl(pageurl);

  },

  properties : {

    /** Page's url made externally available */
    pageUrl: {
      check: "String",
      init: null
    },

    componentName: {
        check: "String",
        init: "Dashboard"
    }

  }
});
