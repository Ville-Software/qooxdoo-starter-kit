/**
 * CheckBox
 * 
 * Data Attributes (defaults)
 *  data-label-position="right"
 *  data-size="sm"
 * 
 * @external(mantine/core/styles/Checkbox.css)
 * @require(ville.ui.icon.IconCheck)
 * @require(ville.ui.icon.IconIndeterminate)
 */
qx.Class.define("ville.ui.form.CheckBox", {
    extend: qx.ui.form.CheckBox,

    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],

    construct(label, alticon, altindeterminateicon) {
        super();

        this._setLayout(new qx.ui.layout.Basic());
        this.setExcludeBoundsFromDom(true);
        this.setClearAllInlineStyles(true);
        this.setCssUtilityClass("m_bf2d988c mantine-Checkbox-root m_5f75b09e");

        //this._createChildControl("label");
        this._createChildControl("input");
        if (alticon) {
            this.setInlineIcon(alticon);
            this.__alticon = true;
        }

        if (altindeterminateicon) {
            this.setIndeterminateIcon(altindeterminateicon);
            this.__altindeterminateicon = true;
        } else {

        }
        
        this._createChildControl("icon");
        this._createChildControl("indeterminateicon");
    
        if (label) {
            this.setLabel(label);
        }

        // Set attributes
        this.setAttributes({
            "data-label-position" : this.getLabelPosition(),
            "data-variant" : this.getVariant()
        });

        //var cbinnerwrapper = this.getChildControl("checkboxinnerwrapper");
        var cbinput = this.getChildControl("input");

        // Set icon based on value
        if (this.isTriState() && this.getValue() == null) {
            // indeterminate
            cbinput.setAttribute("data-indeterminate", "true");
        }

        // Add a change value listener to update the icon
        this.addListener("changeValue", (e) => {
            var cbinnerwrapper = this.getChildControl("checkboxinnerwrapper");
            //console.log(e.getData());
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
        });
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
            var cbbody;
            var cbinnerwrapper;
            var cblabelwrapper;
            var cblabel;

            switch (id) {
                case "checkboxbody":
                    control = new ville.ui.core.InnerWrapper("div");
                    control.setCssUtilityClass("m_5f6e695e mantine-Checkbox-body");
                    this._add(control);
                    break;  

                case "checkboxinnerwrapper":
                    control = new ville.ui.core.InnerWrapper("div");
                    control.setCssUtilityClass("m_26062bec mantine-Checkbox-inner");
                    control.setAttribute("data-label-position", this.getLabelPosition());
                    cbbody = this.getChildControl("checkboxbody");
                    cbbody.add(control);
                    break; 

                case "checkboxlabelwrapper":
                    control = new ville.ui.core.InnerWrapper("div");
                    control.setCssUtilityClass("m_d3ea56bb mantine-Checkbox-labelWrapper");
                    cbbody = this.getChildControl("checkboxbody");
                    cbbody.add(control);
                    break;

                case "label":
                    control = new ville.ui.form.Label();
                    control.setAnonymous(true);
                    control.setSelectable(false);
                    control.setCssUtilityClass("m_8ee546b8 mantine-Checkbox-label");
                    cblabelwrapper = this.getChildControl("checkboxlabelwrapper");
                    cblabelwrapper.add(control);
                    break;

                case "input":
                    control = new ville.ui.core.BaseWidget({ "basetag" : "input", "type" : "checkbox" });
                    control.setCssUtilityClass("mantine-focus-auto m_26063560 mantine-Checkbox-input");
                    cbinnerwrapper = this.getChildControl("checkboxinnerwrapper");
                    cbinnerwrapper.add(control);
                    break;
                
                case "icon":
                    // check to see if there is an alternative icon, otherwise use default
                    if (this.__alticon) {
                        control = this.getInlineIcon();
                    } else {
                        control = new ville.ui.icon.IconCheck();
                        control.setViewBox("0 0 10 7");
                        this.setInlineIcon(control);
                    }
                    control.setCssUtilityClass("m_bf295423 mantine-Checkbox-icon");
                    control.setAttribute("aria-hidden", "true");
                    cbinnerwrapper = this.getChildControl("checkboxinnerwrapper");
                    cbinnerwrapper.add(control);
                    break;

                case "indeterminateicon":
                    // check to see if there is an alternative icon, otherwise use default
                    if (this.__altinderterminateicon) {
                        control = this.getIndeterminateIcon();
                    } else {
                        control = new ville.ui.icon.IconIndeterminate();
                        control.setViewBox("0 0 32 6");
                        this.setIndeterminateIcon(control);
                    }
                    control.setCssUtilityClass("m_bf295423 mantine-Checkbox-icon");
                    control.setAttribute("aria-hidden", "true");
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
                var cbiw = this.getChildControl("checkboxinnerwrapper");
                if (cbiw) {
                   cbiw.setAttribute("data-label-position", value);
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
                    var cbinnerwrapper = this.getChildControl("checkboxinnerwrapper");
                    if (cbinnerwrapper) {
                        label.add(cbinnerwrapper);
                    }
                }
            }
        }
    }
  });
