/**
 * Login form renderer for {@link qx.ui.form.Form}.
 */
qx.Class.define("qxapp.components.form.renderer.LoginForm", {
    extend: ville.ui.form.renderer.AbstractRenderer,

    construct(form, callingpage) {

      super(form);

      this._setLayout(new qx.ui.layout.Canvas());

      if (callingpage != null)
        this.__callingpage = callingpage;

    },

    members: {
      __callingpage: null,
      _row: 0,
      _itemsStack: null,
      _buttonRow: null,

      // overridden
      _createContentElement() {
          return new qx.html.Element("form");
      },

      // overridden
      _onFormChange() {
        if (this._buttonRow) {
          this._buttonRow.destroy();
          this._buttonRow = null;
        }
        this._row = 0;
        super._onFormChange();
      },

      /**
       * Add a group of form items with the corresponding names. The names are
       * displayed as label.
       * The title is optional and is used as grouping for the given form
       * items.
       *
       * @param items {qx.ui.core.Widget[]} An array of form items to render.
       * @param names {String[]} An array of names for the form items.
       */
      addItems(items, names, title, customize) {
        // create items content container
        //var itemscontainer = new ville.ui.layout.VStack("stretch", null, "xl");
        var itemscontainer = new qx.ui.container.Composite();
        var itemslayout = new qx.ui.layout.VBox(10);
        itemscontainer.setLayout(itemslayout);

        // add the items
        for (var i = 0; i < items.length; i++) {
          var label = null;
          var item = items[i];

          if (names[i] != null && names[i] != "") {
            label = this._createLabel(names[i]);
            label.setCssUtilityClass("m_8fdc1311 mantine-InputWrapper-label mantine-TextInput-label");
            if (item.getRequired()) {
              label.getContentElement().setAttribute("data-required", "true");
            }
          }

          var itemwrapper;
          if (customize[i].complexity == "email") {
            itemwrapper = new ville.ui.form.TextFieldWrapper(item);
            if (label) {
              label.getContentElement().addClass("mantine-TextInput-label");
              label.getContentElement().setAttribute("for", "villetxtemail123");
              // itemwrapper.setLabel(label);
            }
          } else if (customize[i].complexity == "password") {
            var IconEye = new ville.ui.icon.phosphor.Eye(16).set({ "viewBox" : "0 0 15 15" });
            IconEye.getContentElement().setStyles({ width: "var(--psi-icon-size)", height: "var(--psi-icon-size)" });
            var IconEyeOff = new ville.ui.icon.phosphor.EyeSlash(16).set({ "viewBox" : "0 0 15 15" });
            IconEyeOff.getContentElement().setStyles({ width: "var(--psi-icon-size)", height: "var(--psi-icon-size)" });
            var btnShowHidePassword = new ville.ui.form.ToggleActionIcon(IconEyeOff, IconEye, "subtle");
            btnShowHidePassword.getContentElement().setStyles({
              "--ai-radius" : "var(--mantine-radius-sm)",
              "--ai-bg" : "transparent",
              "--ai-hover" : "var(--mantine-color-gray-light-hover)",
              "--ai-color" : "var(--mantine-color-gray-light-color)",
              "--ai-bd" : "calc(0.0625rem * var(--mantine-scale)) solid transparent"
            });

            itemwrapper = new ville.ui.form.PasswordFieldWrapper(item, null, null, btnShowHidePassword);
            if (label) {
              label.getContentElement().addClass("mantine-PasswordInput-label");
              label.getContentElement().setAttribute("for", "villetxtpassword123");
              // include Forgot password link
              //var passwordlabelgroup = new ville.ui.layout.HGroup();
              var passwordlabelgroup = new qx.ui.container.Composite();
              var passwordlglayout = new qx.ui.layout.HBox(10);
              passwordlabelgroup.setLayout(passwordlglayout);
              /*passwordlabelgroup.getContentElement().setStyles({
                    "--group-gap": "var(--mantine-spacing-md)",
                    "--group-align": "center",
                    "--group-justify": "space-between",
                    "--group-wrap": "wrap"
                });*/
                passwordlabelgroup.add(label);
                var forgot = new ville.ui.navigation.Anchor("Forgot password?");
                forgot.getContentElement().setStyles({
                    "--text-fz": "var(--mantine-font-size-sm)",
                    "--text-lh": "var(--mantine-line-height-sm)"
                });
                forgot.setUnderline("always");
                forgot.setHref("/forgot-password");
                forgot.addListener("click", () => {
                    qx.core.Init.getApplication().LoadStackPart("auth.ForgotPassword", this.__callingpage);
                }, this);
                passwordlabelgroup.add(forgot);
              //itemwrapper.setLabel(passwordlabelgroup);
            }
          } else {
            itemwrapper = item;
          }

          if (label) {
            /*if (!itemwrapper.getNestLabel()) {
              label.setBuddy(item);
            }*/
            this._connectVisibility(item, label);
            // store the names for translation
            if (qx.core.Environment.get("qx.dynlocale")) {
                this._names.push({ name: names[i], label: label, item: items[i] });
            }
          }
          itemscontainer.add(itemwrapper);
        }
        this._add(itemscontainer);
        this._itemsStack = itemscontainer;
      },

      /**
       * Adds a button the form renderer. All buttons will be added in a
       * single row at the bottom of the form.
       *
       * @param button {qx.ui.form.Button} The button to add.
       */
      addButton(button) {
        /*if (this._buttonRow == null) {
          // create button row
          this._buttonRow = new ville.ui.layout.HGroup();
          this._add(this._buttonRow);
        }*/

        if (this._itemsStack)
            this._itemsStack.add(button);

        // add the button
        // this._buttonRow.add(button);
      },

      /**
       * Creates a label for the given form item.
       *
       * @param name {String} The content of the label without the
       *   trailing * and :
       * @param item {qx.ui.core.Widget} The item, which has the required state.
       * @return {qx.ui.basic.Label} The label for the given item.
       */
      _createLabel(name) {
        var label = new ville.ui.basic.Label(name);
        // store labels for disposal
        this._labels.push(label);
        return label;
      }

    },

    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct() {
      // first, remove all buttons from the button row because they
      // should not be disposed
      if (this._buttonRow) {
        this._buttonRow.removeAll();
        this._disposeObjects("_buttonRow");
      }
      this._disposeObjects("__callingpage");
    }
  });
