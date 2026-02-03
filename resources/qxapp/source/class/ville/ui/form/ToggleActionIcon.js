/**
 * Button
 * @external(mantine/core/styles/ActionIcon.css)
 */
qx.Class.define("ville.ui.form.ToggleActionIcon", {
    extend: ville.ui.form.UnstyledToggleButton,

    construct(trueicon, falseicon, variant, component) {
        if (component) {
            this.__componenttag = component;
        }
        super(); 

        this.setCssUtilityClass("mantine-focus-auto mantine-active m_8d3f4000 mantine-ActionIcon-root " + this.getCssUtilityClass());

        if (trueicon) {
            this.setTrueIcon(trueicon);
        }

        if (falseicon) {
            this.setFalseIcon(falseicon);
        }
        
        if (variant) {
            this.setVariant(variant);
        }

        var innerwrapper = this.getChildControl("innerwrapper");

        innerwrapper.add(trueicon);

        innerwrapper.add(falseicon);

        this.addListenerOnce("appear", (e) => {
            if (this.isValue()) {
                trueicon.setStyle("display", "block");
                falseicon.setStyle("display", "none");
            } else {
                trueicon.setStyle("display", "none");
                falseicon.setStyle("display", "block");
            }
        });

        // Add a change value listener to update the icon
        this.addListener("changeValue", (e) => {
            var innerwrapper = this.getChildControl("innerwrapper");
            if (this.isIconPathSwitch()) {
                // only replace the path d value in the svg inline icon
                var iwdom = innerwrapper.getContentElement().getDomElement();
                // get svg path node
                var pathnode = iwdom.firstChild.children[0];
                if (e.getData()) {
                    pathnode.setAttribute("d", this.__trueiconpathd);
                } else {
                    pathnode.setAttribute("d", this.__falseiconpathd);
                }
            } else {
                // replace entire svg inline icon
                //innerwrapper.removeAll();
                if (e.getData()) {
                    //innerwrapper.add(this.getTrueIcon());
                    trueicon.setStyle("display", "block");
                    falseicon.setStyle("display", "none");
                } else {
                    //innerwrapper.add(this.getFalseIcon());
                    trueicon.setStyle("display", "none");
                    falseicon.setStyle("display", "block");
                }
            }
            
        });

        
    },

    properties: {

        trueIcon: {
            check: "qx.ui.core.Widget",
            apply: "_applyTrueIcon",
            nullable: true,
            themeable: true
        },

        falseIcon: {
            check: "qx.ui.core.Widget",
            apply: "_applyFalseIcon",
            nullable: true,
            themeable: true
        },

        undefinedIcon: {
            check: "qx.ui.core.Widget",
            nullable: true,
            themeable: true
        },

        iconPathSwitch: {
            check: "Boolean",
            init: false,
            nullable: false,
        },

        variant: {
            check: ["default", "filled", "light", "outline", "subtle", "transparent", "white"],
            init: "default",
            apply: "_applyVariant",
            themeable: true,
            event: "changeVariant"
        }

    },

    members: {

        __componenttag: "button",

        __trueiconpathd: null,

        __falseiconpathd: null,

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        },

        // overridden
        _createChildControlImpl(id, hash) {
            var control;

            switch (id) {
                case "innerwrapper":
                    control = new ville.ui.core.InnerWrapper();
                    control.setCssUtilityClass("m_8d3afb97 mantine-ActionIcon-icon");
                    this._add(control);
                    break;

            }

            return control || super._createChildControlImpl(id);
        },

        // property apply
        _applyVariant(value, old) {
            if (value) {
                this.setAttribute("data-variant", value);
            }
        },

        // property apply
        _applyTrueIcon(value, old) {
            if (value) {
                if (this.isIconPathSwitch()) {
                    this.__trueiconpathd = value.constructor.PATHD;
                }
            }
        },

        // property apply
        _applyFalseIcon(value, old) {
            if (value) {
                if (this.isIconPathSwitch()) {
                    this.__falseiconpathd = value.constructor.PATHD;
                }
            }
        },

        // overridden
        _applyLabel(value, old) {},

        // overridden
        _applyIcon(value, old) {},

        // overridden
        _applyShow(value, old) {}

    }
  });
