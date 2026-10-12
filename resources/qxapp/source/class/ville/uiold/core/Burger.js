/**
 * Button
 * @external(mantine/core/styles/Burger.css)
 */
qx.Class.define("ville.ui.core.Burger", {
    extend: ville.ui.form.UnstyledToggleButton,

    include: qx.ui.core.MChildrenHandling,

    construct(component) {
        if (component) {
            this.__componenttag = component;
        }
        super(); 

        this.setCssUtilityClass("mantine-focus-auto m_fea6bf1a mantine-Burger-root " + this.getCssUtilityClass());

        var innerwrapper = this.getChildControl("innerwrapper");

        // Set icon based on value
        if (this.isValue()) {
            // checked
            innerwrapper.setAttribute("data-opened", "true");
        } else {
            innerwrapper.removeAttribute("data-opened");
        }

        // Add a change value listener to update the icon
        this.addListener("changeValue", (e) => {
            var innerwrap = this.getChildControl("innerwrapper"); 
            if (e.getData()) {
                innerwrap.setAttribute("data-opened", "true");
            } else {
                innerwrap.removeAttribute("data-opened");
            }
        });

        
    },

    members: {

        __componenttag: "button",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        },

        // overridden
        _createChildControlImpl(id, hash) {
            var control;

            switch (id) {
                case "innerwrapper":
                    control = new ville.ui.core.InnerWrapper("div");
                    control.setCssUtilityClass("m_d4fb9cad mantine-Burger-burger");
                    control.setAttribute("data-reduce-motion", "true");
                    this._add(control);
                    break;

            }

            return control || super._createChildControlImpl(id);
        },

        // overridden
        _applyLabel(value, old) {},

        // overridden
        _applyIcon(value, old) {},

        // overridden
        _applyShow(value, old) {}

    }
  });
