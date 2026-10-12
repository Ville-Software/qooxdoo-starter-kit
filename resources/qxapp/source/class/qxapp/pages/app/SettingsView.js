/**
 * Settings TabView
 * @external(mantine/core/styles/Tabs.css)
 */
qx.Class.define("qxapp.pages.app.SettingsView",
{
  extend: qx.ui.container.Stack,

  include : qxapp.pages.MPage,

  construct(nexturl) {
    super();

    const pagenameroot = "settings";
    const pageName = qx.lang.String.firstUp(pagenameroot);

    this.setComponentName("app.SettingsView");
    this.setPageName(pageName);

    // Set up the page
    //this.addListener("appear", () => {document.title = `${pageName} - Laravel`});

    const SettingsConfigLocal = {
        "pages":[
            {"objname":"settings.Profile","uris":[{"uri":"/settings/profile"}]},
            {"objname":"settings.Password","uris":[{"uri":"/settings/password"}]},
            {"objname":"settings.TwoFactor","uris":[{"uri":"/settings/two-factor"}]},
            {"objname":"settings.Appearance","uris":[{"uri":"/settings/appearance"}]}
        ]
      };

      var routing = qx.core.Init.getApplication().getRouting();

      //console.log("settingsview - first current page: " + routing.getCurrentPage().component);

      // Header
      var SettingsViewHeader = new qx.ui.container.Composite();
      var svhLayout = new qx.ui.layout.VBox();
      SettingsViewHeader.setLayout(svhLayout);
      //var ViewTitle = new ville.ui.typography.Title("2", "Settings");
      var ViewTitle = new ville.ui.basic.Label("Settings", "h1");
      /*ViewTitle.setStyles({
        "--title-fw": "var(--mantine-h1-font-weight)",
        "--title-lh": "var(--mantine-h1-line-height)",
        "--title-fz": "var(--mantine-h1-font-size)"
      });*/
      //var ViewDesc = new ville.ui.typography.Text("Manage your profile and account settings");
      var ViewDesc = new ville.ui.basic.Label("Manage your profile and account settings");

      SettingsViewHeader.add(ViewTitle);
      SettingsViewHeader.add(ViewDesc);
      this.add(SettingsViewHeader);

      // Settings TabView
      var SettingsTabview = (this.__tabview = new qx.ui.tabview.TabView("left", "pills"));
      SettingsTabview.getContentElement().setStyles({
        "--tabs-radius": "var(--mantine-radius-sm)",
        "--tabs-color": "var(--mantine-primary-color-filled)"
      });
      var SettingsTabviewPane = SettingsTabview.getChildControl("pane");
      SettingsTabviewPane.getContentElement().setStyle("padding-left", "var(--mantine-spacing-xs)");

      //var SettingsTabviewBar = SettingsTabview.getChildControl("bar");
      //SettingsTabviewBar.setStyle("--tabs-justify", "flex-start");

      //const SettingsappHeader = qx.core.Init.getApplication().getStack().getSelection()[0].getHeader();

      const SettingsConfig = SettingsConfigLocal; //JSON.parse(routing.getCurrentPage().props.auth.user.qxappconfig);
      var tabpagematch = null;
      SettingsConfig.pages.forEach(page => {
        var clazz = qx.Class.getByName(`qxapp.pages.${page.objname}`);
        var tabpage = new clazz(page);
        page.uris.forEach(uri => {
            //populate routes
            var onuri = uri.uri;
            //if (uri.type == "regex") {
              //  onuri = new RegExp(uri.uri);
            //}
            routing.on(onuri, () => {
                SettingsTabview.setSelection([tabpage]);
                //SettingsappHeader.setAttribute("html",tabpage.getPageName());
            }, this);
            if (onuri == nexturl)
                tabpagematch = tabpage;

          }
        );
        // Add TabPage to the TabView
        SettingsTabview.add(tabpage);
      });

      if (tabpagematch) {
        SettingsTabview.setSelection([tabpagematch]);
        this.setPageName(tabpagematch.getPageName());
      }


      this.add(SettingsTabview);

  },

  members: {
    __tabview: null,

    getTabView() {
        return this.__tabview;
    }
  }

});
