/**
 * Settings TabView
 *
 */
qx.Class.define("qxapp.app.SettingsView",
{
  extend: ville.ui.layout.VStack,

  construct() {
    super();

    const pagenameroot = "settings";
    const pageName = qx.lang.String.firstUp(pagenameroot);

    // Set up the page
    //this.addListener("appear", () => {document.title = `${pageName} - Laravel`});

    const SettingsConfigLocal = {
        "pages":[
            {"objname":"Profile","uris":[{"uri":"settings/profile"}]},
            {"objname":"Password","uris":[{"uri":"settings/password"}]},
            {"objname":"TwoFactorAuth","uris":[{"uri":"settings/two-factor"}]},
            {"objname":"Appearance","uris":[{"uri":"settings/appearance"}]}
        ]
      };

      var routing = qx.core.Init.getApplication().getRouting();

      // Header
      var SettingsViewHeader = new ville.ui.layout.VStack();
      var ViewTitle = new ville.ui.typography.Title("2", "Settings");
      var ViewDesc = new ville.ui.typography.Text("Manage your profile and account settings");
      SettingsViewHeader.add(ViewTitle);
      SettingsViewHeader.add(ViewDesc);
      this.add(SettingsViewHeader);

      // Settings Nav

      // Settings Stack



      //const SettingsConfig = SettingsConfigLocal; //JSON.parse(routing.getCurrentPage().props.auth.user.qxappconfig);
      /*SettingsConfig.pages.forEach(page => {
        var clazz = qx.Class.getByName(`qxapp.pages.${page.objname}`);
        var tabpage = new clazz(page);
        page.uris.forEach(uri => {
            //populate routes
            var onuri = uri.uri;
            //if (uri.type == "regex") {
              //  onuri = new RegExp(uri.uri);
            //}
            routing.on(onuri, () => {
                this.setSelection([tabpage]);
            }, this);
          }
        );
        // Add TabPage to the TabView
        this.add(tabpage);
      });*/

  },

  properties : {

    componentName: {
        check: "String",
        init: "settings"
    }

  }
});
