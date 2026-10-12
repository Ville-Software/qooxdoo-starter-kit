/**
 * Two Factor Auth page
 *
 */
qx.Class.define("qxapp.pages.settings.TwoFactor",
{
  extend : qx.ui.tabview.Page,

  include : qxapp.pages.MPage,

  construct() {

    const pagenameroot = "two-factor";
    const pageurl = `/settings/${pagenameroot}`;
    const pageName = "Two-Factor Authentication"
    this.setPageName(pageName);

    super("Two-Factor Auth");

    this.setComponentName("settings.TwoFactor");

    this.setPageUrl(pageurl);

    // Update Button to link
    var pagebtnlink = this.getButton();
    pagebtnlink.getContentElement().setNodeName("a");
    pagebtnlink.getContentElement().setAttribute("href", pageurl);
    pagebtnlink.addListener("click", (e) => {e.preventDefault()});
    pagebtnlink.setNativeContextMenu(false);
    pagebtnlink.getChildControl("label").getContentElement().setStyle("text-align","start");

    // Get the Routing object
    // const routing = qx.core.Init.getApplication().getRouting();
    const SettingsappHeader = qx.core.Init.getApplication().getStack().getSelection()[0].getHeader();

    // Set up the page
    this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
        //routing.getRouter().push({ url: pageurl });
        SettingsappHeader.getContentElement().setAttribute("html", pageName);
    });

    this.getContentElement().setAttribute("html", pagenameroot);

  }
});
