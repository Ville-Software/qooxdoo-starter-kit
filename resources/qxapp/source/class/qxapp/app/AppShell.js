/**
 * AppShell
 * @external(mantine/core/styles/AppShell.css)
 * @external(qxapp/appshell-qxvui-inline-01.css)
 */
qx.Class.define("qxapp.app.AppShell",
{
  extend: ville.ui.layout.Container,

  construct() {
    super();

    this.setCssUtilityClass("m_89ab340 mantine-AppShell-root");
    this.setAttributes({
        "data-layout" : "alt",
        "data-mode" : "fixed"
    });
    this.setStyles({
        "--app-shell-transition-duration": "200ms",
        "--app-shell-transition-timing-function": "ease"
    });

    // Get the Routing object
    var routing = qx.core.Init.getApplication().getRouting();


    // ::: HEADER :::

    var header = new ville.ui.core.Box("header");
    header.setCssUtilityClass("m_3b16f56b mantine-AppShell-header right-scroll-bar-position");
    header.setAttribute("data-with-border", "true");
    header.setStyles({"--app-shell-header-z-index": 100});

    var headergroup = new ville.ui.layout.HGroup();
    headergroup.setStyles({
       " --group-gap": "var(--mantine-spacing-md)",
        "--group-align": "center",
        "--group-justify": "flex-start",
        "--group-wrap": "wrap",
        "padding-inline": "var(--mantine-spacing-md)",
        "height": "100%"
    });
    header.add(headergroup);


    // ::: NAV :::

    var nav = new ville.ui.core.Box("nav");
    //nav.setCssUtilityClass("NavbarSimple_navbar___KrbF");
    nav.setCssUtilityClass("m_45252eee NavbarSimple_navbar___KrbF mantine-AppShell-navbar");
    nav.setStyles({
        "--app-shell-navbar-z-index": "calc(100 + 1)",
        "padding": "var(--mantine-spacing-md)"
    });
    nav.setAttribute("data-with-border", "true");
    var navmain = new ville.ui.core.Box();
    navmain.setCssUtilityClass("NavbarSimple_navbarMain__NpP2b");
    nav.add(navmain);
    var navheader = new ville.ui.core.Box();
    navheader.setCssUtilityClass("NavbarSimple_header__IB_Qe");
    navheader.setAttribute("html","Laravel Starter Kit");
    navmain.add(navheader);

    // Dashboard
    var navbtnDashboard = new ville.ui.form.NavLink("Dashboard");
    navbtnDashboard.set({ href : "/dashboard" });
    navbtnDashboard.setUserData("component", "Dashboard");
    navbtnDashboard.setCssUtilityClass("NavbarSimple_link__tu4Ig");
    navmain.add(navbtnDashboard);

    var navfooter = new ville.ui.core.Box();
    navfooter.setCssUtilityClass("NavbarSimple_footer___qsct");
    nav.add(navfooter);

    // Nav Footer Bottom Menu
    var navMenu = new ville.ui.menu.Menu();
    var settingsBtn = new ville.ui.menu.NavLink("Settings").set({ minWidth : 40, minHeight : 40 });
    settingsBtn.set({ href : "/settings/profile" });
    settingsBtn.setUserData("component", "settings");
    var logoutBtn = new ville.ui.menu.Button("Log out").set({ minWidth : 40, minHeight : 40 });
    navMenu.add(settingsBtn);
    navMenu.add(logoutBtn);
    var navMenuButton = new ville.ui.form.MenuButton("Chris Eskew");
    navMenuButton.setMenu(navMenu);
    navfooter.add(navMenuButton);

    var navRadioGroup = new qx.ui.form.RadioGroup(navbtnDashboard, settingsBtn);

    logoutBtn.addListener("execute", () => {
        routing.getRouter().visit('/logout', {
            method: 'post',
            onSuccess : (response) => {
                window.location.reload();
            }
        });
      }, this);

    /*settingsBtn.addListener("click", () => {
        qx.io.PartLoader.require(["settings"],() => {
            var setpg = new qxapp.app.SettingsView();
            var stack = qx.core.Init.getApplication().getStack();
            routing.on("settings/profile", () => {
                stack.setSelection([this]);
            });
            stack.add(setpg);
            stack.setSelection([setpg]);
            routing.getRouter().push({ url: setpg.getPageUrl() });
        }, this);
    }, this);*/


    // ::: MAIN :::

    var main = (this.__stack = new ville.ui.layout.Stack("main"));
    main.setCssUtilityClass("m_8983817 mantine-AppShell-main");

    navRadioGroup.addListener("changeSelection", (e) => {
        e.getOldData()[0].getContentElement().removeAttribute("data-active");
        e.getData()[0].getContentElement().setAttribute("data-active", "true");
    });

    /*navRadioGroup.addListener("changeSelection", (e) => {
        e.getOldData()[0].getContentElement().removeAttribute("data-active");
        e.getData()[0].getContentElement().setAttribute("data-active", "true");
        var nextclazznm = e.getData()[0].getUserData("component");
        if (nextclazznm == "settings") {
            qx.io.PartLoader.require(["settings"],() => {
                var settingspage = new qxapp.app.SettingsView();
                main.add(settingspage);
                main.setSelection([settingspage]);
                var pageurl = "/settings/profile";
                routing.on(pageurl, () => {
                    main.setSelection([settingspage]);
                });
                routing.getRouter().push({ url: pageurl });
                headergroup.setAttribute("html", clazznm);
            });
        } else {

        }
        qx.io.PartLoader.require([nextclazznm],() => {
            var clazz = qx.Class.getByName(`qxapp.pages.${nextclazznm}`);
            var initpage = new clazz();
            main.add(initpage);
            main.setSelection([initpage]);
            var pageurl = initpage.getPageUrl();
            routing.on(pageurl, () => {
                main.setSelection([initpage]);
            });
            routing.getRouter().push({ url: pageurl });
            headergroup.setAttribute("html", nextclazznm);
            for (const navbtn of navRadioGroup.getSelectables()) {
                if (navbtn.getUserData("component") == clazznm) {
                    navRadioGroup.setSelection([navbtn]);
                    break;
                }
            }
        }, this);
    });*/

    var curpg = routing.getCurrentPage();
    var clazznm = curpg.component;
    if (clazznm.startsWith("settings")) {
        // load Settings View and all settings tabview pages
        qx.io.PartLoader.require(["settings"],() => {
            var settingsview = new qxapp.app.SettingsView();
            main.add(settingsview);
            main.setSelection([settingsview]);
            var pageurl = curpg.url;
            routing.on(pageurl, () => {
                main.setSelection([settingsview]);
                // Set the settings stack
            });
            routing.getRouter().push({ url: pageurl });
            headergroup.setAttribute("html", clazznm);
        });
    } else {
        // Load Main Area Pages like Dashboard
        qx.io.PartLoader.require([clazznm],() => {
            var clazz = qx.Class.getByName(`qxapp.pages.${clazznm}`);
            var initpage = new clazz();
            main.add(initpage);
            main.setSelection([initpage]);
            var pageurl = initpage.getPageUrl();
            routing.on(pageurl, () => {
                main.setSelection([initpage]);
            });
            routing.getRouter().push({ url: pageurl });
            headergroup.setAttribute("html", clazznm);
            for (const navbtn of navRadioGroup.getSelectables()) {
                if (navbtn.getUserData("component") == clazznm) {
                    navRadioGroup.setSelection([navbtn]);
                    navbtn.setAttribute("data-active", "true");
                    break;
                }
            }
        }, this);
    }


    // Assemble
    this.add(header);
    this.add(nav);
    this.add(main);

  },

  members: {
    __stack : null
  }

});
