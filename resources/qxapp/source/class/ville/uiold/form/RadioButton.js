/**
 * RadioButton
 * 
 * @external(mantine/core/styles/Radio.css)
 * @require(ville.ui.icon.IconRadio)
 */
qx.Class.define("ville.ui.form.RadioButton", {
    
    extend: qx.ui.form.RadioButton,

    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],

    construct(label, alticon) {
        super();

        this._setLayout(new qx.ui.layout.Basic());
        this.setExcludeBoundsFromDom(true);
        this.setClearAllInlineStyles(true);
        this.setCssUtilityClass("m_f3f1af94 mantine-Radio-root m_5f75b09e mantine-Radio-root");

        this._createChildControl("input");
        if (alticon) {
            this.setInlineIcon(alticon);
            this.__alticon = true;
        }
        
        this._createChildControl("icon");
    
        if (label) {
            this.setLabel(label);
        }

        // Set attributes
        this.setAttributes({
            "data-label-position" : this.getLabelPosition(),
            "data-variant" : this.getVariant()
        });

        //var cbinput = this.getChildControl("input");

        // Add a change value listener to update the icon
        /*this.addListener("changeValue", (e) => {
            var cbinnerwrapper = this.getChildControl("checkboxinnerwrapper");
            if (this.isTriState() && e.getData() == null) {
                // replace entire svg inline icon
                cbinput.setAttribute("data-indeterminate", "true");
                cbinnerwrapper.removeAt(1);
                cbinnerwrapper.add(this.getIndeterminateIcon());
            } else if (this.isTriState() && e.getData() && e.getOldData() == null) {
                cbinput.removeAttribute("data-indeterminate");
                cbinnerwrapper.removeAt(1);
                cbinnerwrapper.add(this.getInlineIcon());
            }
        });*/
    },

    properties: {

        variant: {
            init: "filled",
            check: ["filled", "outline"],
            apply: "_applyVariant",
            themeable: true,
            event: "changeVariant"
        },

        labelPosition: {
            init: "right",
            check: ["right", "left"],
            apply: "_applyLabelPosition",
            themeable: true,
            event: "changeLabelPosition"
        },

        inlineIcon: {
            check: "qx.ui.core.Widget",
            nullable: true,
            themeable: true
        },

        indeterminateIcon: {
            check: "qx.ui.core.Widget",
            nullable: true,
            themeable: true
        },

        id: {
            check: "String",
            apply: "_applyId",
            themeable: false,
            nullable: true,
            event: "changeId"
        },

        nestLabel: {
            check: "Boolean",
            init: true,
            nullable: false,
            themeable: true,
            apply: "_applyNestLabel"
        }

    },

    members: {

        // global flag for alt icons
        __alticon : false,

        __altindeterminateicon : false,

        // overridden
        _createContentElement() {
            return new qx.html.Element("div");
        },

        // overridden
        _createChildControlImpl(id, hash) {
            var control;
            var rbbody;
            var rbinnerwrapper;
            var rblabelwrapper;

            switch (id) {
                case "radiobuttonbody":
                    control = new ville.ui.core.InnerWrapper("div");
                    control.setCssUtilityClass("m_5f6e695e mantine-Radio-body");
                    this._add(control);
                    break;  

                case "radiobuttoninnerwrapper":
                    control = new ville.ui.core.InnerWrapper("div");
                    control.setCssUtilityClass("m_89c4f5e4 mantine-Radio-inner");
                    control.setAttribute("data-label-position", this.getLabelPosition());
                    rbbody = this.getChildControl("radiobuttonbody");
                    rbbody.add(control);
                    break; 

                case "radiobuttonlabelwrapper":
                    control = new ville.ui.core.InnerWrapper("div");
                    control.setCssUtilityClass("m_d3ea56bb mantine-Radio-labelWrapper");
                    rbbody = this.getChildControl("radiobuttonbody");
                    rbbody.add(control);
                    break;

                case "label":
                    control = new ville.ui.form.Label();
                    control.setAnonymous(true);
                    control.setSelectable(false);
                    control.setCssUtilityClass("m_8ee546b8 mantine-Radio-label");
                    rblabelwrapper = this.getChildControl("radiobuttonlabelwrapper");
                    rblabelwrapper.add(control);
                    break;

                case "input":
                    control = new ville.ui.core.BaseWidget({ "basetag" : "input", "type" : "radio" });
                    control.setCssUtilityClass("mantine-focus-auto m_8a3dbb89 mantine-Radio-radio");
                    rbinnerwrapper = this.getChildControl("radiobuttoninnerwrapper");
                    rbinnerwrapper.add(control);
                    break;
                
                case "icon":
                    // check to see if there is an alternative icon, otherwise use default
                    if (this.__alticon) {
                        control = this.getInlineIcon();
                    } else {
                        control = new ville.ui.icon.IconRadio();
                        control.setViewBox("0 0 5 5");
                        control.setCssUtilityClass("m_f3ed6b2b mantine-Radio-icon");
                        this.setInlineIcon(control);
                    }
                    control.setCssUtilityClass("m_f3ed6b2b mantine-Radio-icon");
                    control.setAttribute("aria-hidden", "true");
                    rbinnerwrapper = this.getChildControl("radiobuttoninnerwrapper");
                    rbinnerwrapper.add(control);
                    break;
                
            }

            return control || super._createChildControlImpl(id);
        },

        // property apply
        _applyVariant(value, old) {
            if (value) {
                this.setAttribute("data-variant", value);
                var input = this.getChildControl("input");
                if (input) {
                    if (value = "outline") {
                        input.getContentElement().addClass("m_215c4542");
                    } else {
                        input.getContentElement().removeClass("m_215c4542");
                    }
                }
            }
        },

        // property apply
        _applyLabelPosition(value, old) {
            if (value) {
                this.setAttribute("data-label-position", value);
                var rbiw = this.getChildControl("radiobuttoninnerwrapper");
                if (rbiw) {
                   rbiw.setAttribute("data-label-position", value);
                }
            }
        },

        // property apply
        _applyId(value, old) {
            if (value) {
                var input = this.getChildControl("input");
                if (input) {
                    input.setAttribute("id", value);
                }
                var label = this.getChildControl("label", true);
                if (label) {
                    label.setAttribute("for", value);
                }
            }
        },

        // overridden
        _applyIcon() {},

        _applyLabel(value, old) {
            if (value) {
                var label = this.getChildControl("label");
                if (label) {
                    label.setValue(value);
                }
            }
        },

        // property apply
        _applyNestLabel(value, old) {
            if (value) {
                var label = this.getChildControl("label");
                if (label) {
                    var rbinnerwrapper = this.getChildControl("radiobuttoninnerwrapper");
                    if (rbinnerwrapper) {
                        label.add(rbinnerwrapper);
                    }
                }
            }
        }
    }
  });
