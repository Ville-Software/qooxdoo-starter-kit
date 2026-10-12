/**
 * AppShell
 * @external(mantine/core/styles/Popover.css)
 * @external(mantine/core/styles/Menu.css)
 * @external(mantine/core/styles/AppShell.css)
 * @external(qxapp/appshell-qxvui-inline-01.css)
 *
 */
qx.Class.define("qxapp.pages.app.AppShell",
{
  extend: qx.ui.container.Composite,

  construct() {
    var docLayout = new qx.ui.layout.Dock();
    docLayout.setSort("x");
    super(docLayout);

    /*this.setCssUtilityClass("m_89ab340 mantine-AppShell-root");
    this.getContentElement().setAttributes({
        "data-layout" : "alt",
        "data-mode" : "fixed"
    });
    this.getContentElement().setStyles({
        "--app-shell-transition-duration": "200ms",
        "--app-shell-transition-timing-function": "ease"
    });*/

    // Get the Routing object
    var routing = qx.core.Init.getApplication().getRouting();


    // ::: HEADER :::

    //var header = new ville.ui.core.Box("header");
    var header = new qx.ui.container.Composite();
    header.getContentElement().setNodeName("header");
    var headerLayout = new qx.ui.layout.Canvas();
    header.setLayout(headerLayout);
    // header.setCssUtilityClass("m_3b16f56b mantine-AppShell-header right-scroll-bar-position");
    //header.getContentElement().setAttribute("data-with-border", "true");
    //header.getContentElement().setStyles({"--app-shell-header-z-index": 100});

    //var headergroup = (this.__header = new ville.ui.layout.HGroup());
    var headergroup = new qx.ui.container.Composite();
    headergroup.setLayout(new qx.ui.layout.HBox());
    header.add(headergroup);

    // Header title
    var headertitle = (this.__header = new ville.ui.basic.Label().set({font: "default-lg", minWidth: 200}));
    headergroup.add(headertitle);


    // ::: NAV :::

    //var nav = new ville.ui.core.Box("nav");
    var nav = new qx.ui.container.Composite().set({width: 220});
    nav.getContentElement().setNodeName("nav");
    nav.setLayout(new qx.ui.layout.VBox(10));
    // nav.setCssUtilityClass("m_45252eee NavbarSimple_navbar___KrbF mantine-AppShell-navbar");
    /*nav.getContentElement().setStyles({
        "--app-shell-navbar-z-index": "calc(100 + 1)",
        "padding": "var(--mantine-spacing-md)"
    });*/
    nav.getContentElement().setAttribute("data-with-border", "true");

    //var navmain = new ville.ui.core.Box();
    var navmain = new qx.ui.container.Composite();
    var navmainLayout = new qx.ui.layout.VBox(10);
    navmain.setLayout(navmainLayout);
    // navmain.setCssUtilityClass("NavbarSimple_navbarMain__NpP2b");
    nav.add(navmain);
    //var navheader = new ville.ui.core.Box();
    var navheader = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({height: 30});
    // navheader.setCssUtilityClass("NavbarSimple_header__IB_Qe");
    navheader.getContentElement().setAttribute("html","Laravel Starter Kit");
    navmain.add(navheader);

    // ::: App Page CONFIG :::
    const AppPagesConfigLocal = {
        "pages":[
            {objname:"Dashboard", uri:"/dashboard"}
        ]
    };
    var navbtnsArr = [];
    AppPagesConfigLocal.pages.forEach(page => {
        var navbtn = new ville.ui.navigation.NavLink(page.objname);
        navbtn.set({ href : page.uri });
        navbtn.setUserData("component", page.objname);
        navbtn.setUserData("appshelltitle", page.objname);
        // navbtn.setCssUtilityClass("NavbarSimple_link__tu4Ig");
        navmain.add(navbtn);
        navbtnsArr.push(navbtn);
    });

    //var navfooter = new ville.ui.core.Box();
    var navfooter = new qx.ui.container.Composite(new qx.ui.layout.Basic());
    // navfooter.setCssUtilityClass("NavbarSimple_footer___qsct");
    nav.add(new qx.ui.core.Spacer(50));

    nav.add(navfooter);

    // Nav Footer Bottom Menu
    var navMenu = new ville.ui.menu.Menu();
    var settingsBtn = new ville.ui.menu.NavLink("Settings").set({ minWidth : 40, minHeight : 40 });
    settingsBtn.set({ href : "/settings/profile" });
    settingsBtn.setUserData("component", "app.SettingsView");
    settingsBtn.setUserData("appshelltitle", "Profile settings");
    var logoutBtn = new ville.ui.menu.Button("Log out").set({ minWidth : 40, minHeight : 40 });
    navMenu.add(settingsBtn);
    navMenu.add(logoutBtn);
    var navMenuButton = new ville.ui.form.MenuButton("Chris Eskew");
    navMenuButton.setMenu(navMenu);
    navfooter.add(navMenuButton);

    logoutBtn.addListener("execute", () => {
        routing.getRouter().visit('/logout', {
            method: 'post',
            onSuccess : (response) => {
                window.location.reload();
            }
        });
      }, this);

    // Nav RadioGroup
    var navRadioGroup = new qx.ui.form.RadioGroup();


    // ::: MAIN :::

   //var main = (this.__stack = new ville.ui.layout.Stack("main"));
    var main = (this.__stack = new qx.ui.container.Stack());
    // main.setCssUtilityClass("m_8983817 mantine-AppShell-main");

    var curpg = routing.getCurrentPage();
    var clazznm = curpg.component;
    if (clazznm.startsWith("settings")) {
        // add settings button to radio group first
        navRadioGroup.add(settingsBtn, ...navbtnsArr);
        // load Settings View and all settings tabview pages
        qx.io.PartLoader.require(["app.SettingsView"],() => {
            var settingsview = new qxapp.pages.app.SettingsView(curpg.url);
            main.add(settingsview);
            main.setSelection([settingsview]);
            var pageurl = curpg.url;
            settingsview.setPageUrl(pageurl);
            var settingspage = settingsview.getTabView().getSelection();
            routing.on(pageurl, () => {
                main.setSelection([settingsview]);
                navRadioGroup.setSelection([settingsBtn]);
                //headergroup.getContentElement().setAttribute("html", settingspage.getPageName());
                headertitle.setValue(settingspage.getPageName());
            });
            //headergroup.getContentElement().setAttribute("html", settingsview.getPageName());
            headertitle.setValue(settingspage.getPageName());
        });
    } else {
        // Load Main Area Pages like Dashboard
        // add App Page NavLinks to radio group first
        navRadioGroup.add(...navbtnsArr, settingsBtn);
        qx.io.PartLoader.require([clazznm],() => {
            var clazz = qx.Class.getByName(`qxapp.pages.${clazznm}`);
            var initpage = new clazz();
            main.add(initpage);
            main.setSelection([initpage]);
            var pageurl = initpage.getPageUrl();
            var navbutton = null;
            for (const navbtn of navRadioGroup.getSelectables()) {
                if (navbtn.getUserData("component") == clazznm) {
                    navRadioGroup.setSelection([navbtn]);
                    navbtn.getContentElement().setAttribute("data-active", "true");
                    navbutton = navbtn;
                    break;
                }
            }
            routing.on(pageurl, () => {
                main.setSelection([initpage]);
                navRadioGroup.setSelection([navbutton]);
                //headergroup.getContentElement().setAttribute("html", initpage.getPageName());
                headertitle.setValue(initpage.getPageName());
            });
            //headergroup.getContentElement().setAttribute("html", initpage.getPageName());
            headertitle.setValue(initpage.getPageName());

        }, this);
    }

    navRadioGroup.addListener("changeSelection", (e) => {
        e.getOldData()[0].getContentElement().removeAttribute("data-active");
        e.getData()[0].getContentElement().setAttribute("data-active", "true");
        var nextclazznm = e.getData()[0].getUserData("component");
        var currentpage = this.getLoadedStackPart(e.getOldData()[0].getUserData("component"));
        currentpage.setPageUrl(e.getOldData()[0].getHref());
        this.LoadStackPart(nextclazznm, e.getData()[0].getHref(), currentpage);
        //headergroup.getContentElement().setAttribute("html", e.getData()[0].getUserData("appshelltitle"));
        headertitle.setValue(e.getData()[0].getUserData("appshelltitle"));
    });


    // Assemble
    this.add(header, { edge: "north" });
    this.add(nav, { edge: "west" });
    this.add(main, { edge: "center" });

  },

  members: {
    __stack : null,

    __header : null,

    getHeader() {
      return this.__header;
    },

    getLoadedStackPart(component) {
        var page = null;
        for (const stackobj of this.__stack.getSelectables()) {
            if (stackobj.getComponentName() == component) {
                page = stackobj;
                break;
            }
        }
        return page;
    },

    LoadStackPart(component, nexturl, callingpage) {
        qx.io.PartLoader.require([component],() => {
            var comppg = this.getLoadedStackPart(component);
            if (!comppg) {
                var clazz = qx.Class.getByName(`qxapp.pages.${component}`);
                comppg = new clazz(nexturl);
                this.__stack.add(comppg);
            }
            this.__stack.setSelection([comppg]);
            this.__header.setValue(comppg.getPageName());
            comppg.setPageUrl(nexturl);
            var routing = qx.core.Init.getApplication().getRouting();
            routing.on(callingpage.getPageUrl(), () => {
                this.__stack.setSelection([callingpage]);
                this.__header.setValue(comppg.getPageName());
            });
            routing.getRouter().push({ url: nexturl });
        }, this);
    }

  }

});
