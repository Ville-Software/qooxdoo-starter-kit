(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "ville.ui.layout.Center": {
        "construct": true,
        "require": true
      },
      "qxapp.pages.MPage": {
        "require": true
      },
      "qx.lang.String": {
        "construct": true
      },
      "qx.core.Init": {
        "construct": true
      },
      "qx.html.Element": {
        "construct": true
      },
      "ville.ui.form.Anchor": {
        "construct": true
      },
      "ville.ui.layout.VStack": {
        "construct": true
      },
      "ville.ui.typography.Title": {
        "construct": true
      },
      "ville.ui.typography.Text": {
        "construct": true
      },
      "qx.ui.form.Form": {
        "construct": true
      },
      "ville.ui.form.TextField": {
        "construct": true
      },
      "qx.util.Validate": {
        "construct": true
      },
      "ville.ui.form.PasswordField": {
        "construct": true
      },
      "ville.ui.form.CheckBox": {
        "construct": true
      },
      "ville.ui.form.Button": {
        "construct": true
      },
      "qxapp.components.form.renderer.LoginForm": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Login page
   *
   */
  qx.Class.define("qxapp.pages.auth.Login", {
    extend: ville.ui.layout.Center,
    include: qxapp.pages.MPage,
    construct() {
      ville.ui.layout.Center.constructor.call(this);
      this.setComponentName("auth.Login");
      this.setStyles({
        "padding": "var(--mantine-spacing-lg)",
        "min-height": "100svh"
      });
      const pagenameroot = "login";
      const pageurl = `/${pagenameroot}`;
      const pageName = qx.lang.String.firstUp(pagenameroot);

      // Set up the page
      this.addListener("appear", () => {
        document.title = `${pageName} - Laravel`;
      });

      // Add to routing
      var routing = qx.core.Init.getApplication().getRouting();
      this.setPageUrl(pageurl);

      // Laravel Logo
      var laravellogosvg = `<svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 42" width=36 height=36>
            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M17.2 5.633 8.6.855 0 5.633v26.51l16.2 9 16.2-9v-8.442l7.6-4.223V9.856l-8.6-4.777-8.6 4.777V18.3l-5.6 3.111V5.633ZM38 18.301l-5.6 3.11v-6.157l5.6-3.11V18.3Zm-1.06-7.856-5.54 3.078-5.54-3.079 5.54-3.078 5.54 3.079ZM24.8 18.3v-6.157l5.6 3.111v6.158L24.8 18.3Zm-1 1.732 5.54 3.078-13.14 7.302-5.54-3.078 13.14-7.3v-.002Zm-16.2 7.89 7.6 4.222V38.3L2 30.966V7.92l5.6 3.111v16.892ZM8.6 9.3 3.06 6.222 8.6 3.143l5.54 3.08L8.6 9.3Zm21.8 15.51-13.2 7.334V38.3l13.2-7.334v-6.156ZM9.6 11.034l5.6-3.11v14.6l-5.6 3.11v-14.6Z"></path>
        </svg>`;
      var logo = new qx.html.Element();
      logo.useMarkup(laravellogosvg);
      var welcome = new ville.ui.form.Anchor();
      welcome.setHref("/");
      welcome.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("Welcome", this);
      }, this);
      welcome.getContentElement().add(logo);

      // Page Header
      var header = new ville.ui.layout.VStack("center", "center", "md");
      header.setStyle("padding-bottom", "var(--mantine-spacing-md)");
      header.add(welcome);
      var title = new ville.ui.typography.Title(1, "Log in to your account");
      title.setStyles({
        "--title-fw": "var(--mantine-h1-font-weight)",
        "--title-lh": "var(--mantine-h1-line-height)",
        "--title-fz": "var(--mantine-font-size-xl)"
      });
      header.add(title);
      var subtitle = new ville.ui.typography.Text("Enter your email and password below to log in");
      subtitle.setStyles({
        "--text-fz": "var(--mantine-font-size-sm)",
        "--text-lh": "var(--mantine-line-height-sm)"
      });
      header.add(subtitle);

      // Form
      var form = new qx.ui.form.Form();

      // Email
      var email = new ville.ui.form.TextField().set({
        required: true
      });
      email.setAttribute("id", "villetxtemail123");
      email.setPlaceholder("email@example.com");
      form.add(email, "Email address", qx.util.Validate.email(), null, null, {
        complexity: "email"
      });

      // Password
      var password = new ville.ui.form.PasswordField().set({
        required: true
      });
      password.setAttribute("id", "villetxtpassword123", true);
      password.setPlaceholder("Password");
      form.add(password, "Password", null, null, null, {
        complexity: "password"
      });

      // Remember Me - CheckBox
      var rememberme = new ville.ui.form.CheckBox("Remember me").set({
        id: "villechkrme123"
      });
      form.add(rememberme, "rememberme", null, null, null, {
        complexity: "checkbox"
      });

      // Form Bottom Buttons
      var loginbutton = new ville.ui.form.Button("Log in", "filled");
      loginbutton.addClass("mantine-focus-auto mantine-active");
      form.addButton(loginbutton);

      // Form Renderer
      var loginForm = new qxapp.components.form.renderer.LoginForm(form, this);
      loginbutton.addListener("click", e => {
        e.preventDefault();
        if (form.validate()) {
          routing.getRouter().visit(pageurl, {
            method: 'post',
            data: {
              email: email.getValue(),
              password: password.getValue(),
              remember: rememberme.getValue()
            },
            replace: false,
            onError: errors => {
              console.log(errors);
            },
            onSuccess: NextPage => {
              if (NextPage.props.auth.user) {
                // load App Part
                var qxapp = qx.core.Init.getApplication();
                routing.setCurrentPage(NextPage);
                qxapp.initAppShell();
              }
            }
          });
        }
      });
      var noaccountmsg = new ville.ui.typography.Text("Don't have an account? ", "div");
      noaccountmsg.setStyles({
        "text-align": "center",
        "--text-fz": "var(--mantine-font-size-sm)",
        "--text-lh": "var(--mantine-line-height-sm)"
      });
      var register = new ville.ui.form.Anchor("Sign up");
      register.setStyles({
        "--text-fz": "var(--mantine-font-size-sm)",
        "--text-lh": "var(--mantine-line-height-sm)"
      });
      noaccountmsg.add(register);
      register.setUnderline("always");
      register.setHref("/register");
      register.addListener("click", () => {
        qx.core.Init.getApplication().LoadStackPart("auth.Register", this);
      }, this);

      // Internal VStack for all items
      var internalVStack = new ville.ui.layout.VStack();
      internalVStack.setStyle("min-width", "calc(24rem * var(--mantine-scale))");
      internalVStack.add(header);
      internalVStack.add(loginForm);
      internalVStack.add(noaccountmsg);
      this.add(internalVStack);
    }
  });
  qxapp.pages.auth.Login.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Login.js.map?dt=1769806685523