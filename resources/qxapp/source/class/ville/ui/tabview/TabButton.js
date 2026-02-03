/* ************************************************************************
SQ Notes:
* 

************************************************************************ */

/**
 * A TabButton is the tapable part sitting on the {@link qx.ui.tabview.Page}.
 * By tapping on the TabButton the user can set a Page active.
 *
 * @childControl label {ville.ui.basic.Label} label of the tab button
 * @childControl tabsection {qx.ui.core.Widget} icon of the tab button
 */
qx.Class.define("ville.ui.tabview.TabButton", {
  
  extend: qx.ui.tabview.TabButton,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct(label, variant, tabsection) {
    super();

    var layout = new qx.ui.layout.Basic();

    this._getLayout().dispose();
    this._setLayout(layout);

    this.setExcludeBoundsFromDom(true);
    this.setClearAllInlineStyles(true);
    this.setCssUtilityClass("mantine-focus-auto m_4ec4dce6 mantine-Tabs-tab m_87cf2631 mantine-UnstyledButton-root");

    this.getContentElement().setAttribute('type', 'button');

    if (label) {
      this.setLabel(label);
    }
        
    if (variant != null) {
      this.setVariant(variant);
    } else {
      this.initVariant();
    }

    if (tabsection != null) {
      this.setTabSection(tabsection);
    }

  },

  statics: {

    btnVariantClasses: {
      default: "m_539e827b",
      outline: "m_b59ab47c",
      pills: "m_c3381914"
    }
    
  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties: {
    iconPosition: {
      refine: true,
      init: "left"
    },

    variant: {
      init: "default",
      check: ["default", "outline", "pills"],
      apply: "_applyVariant",
      themeable: true,
      event: "changeVariant"
    },

    tabSection: {
      check: "qx.ui.core.Widget",
      apply: "_applyTabSection",
      nullable: true,
      themeable: true,
      event: "changeTabSection"
    },

    barPosition: {
      check: ["left", "right", "top", "bottom"],
      init: "top",
      apply: "_applyBarPosition",
      event: "changeBarPosition"
    }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {

    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */

    // overridden
    _createContentElement() {
        return new qx.html.Element("button");
    },

    // overridden
    _createChildControlImpl(id, hash) {
      var control;

      switch (id) {
        case "tabsection":
          control = new ville.ui.basic.Label();
          control.setAnonymous(true);
          control.setCssUtilityClass("m_fc420b1f mantine-Tabs-tabSection");
          control.getContentElement().setAttribute("data-position", "left");
          this._add(control);
          break;

        case "label":
          control = new ville.ui.basic.Label();
          control.setAnonymous(true);
          control.setSelectable(this.getSelectable());
          control.setCssUtilityClass("m_42bbd1ae mantine-Tabs-tabLabel");
          this._add(control);
          break;
      }

      return control || super._createChildControlImpl(id);
    },

    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY
    ---------------------------------------------------------------------------
    */

    // overridden
    _applyValue(value, old) {
      //value ? this.addState("checked") : this.removeState("checked");
      //this.getContentElement().setAttribute("aria-checked", Boolean(value));
      if (value)
        this.getContentElement().setAttribute('data-active', 'true');
      else
        this.getContentElement().removeAttribute('data-active');
    },

    // overridden
    _applyIconPosition(value, old) {
      if (value) {
        var section = this.getChildControl("tabsection");
        if (section) {
          if (value === "top" || value === "bottom") {
            section.getContentElement().setAttribute("data-position", "left");
          } else {
            section.getContentElement().setAttribute("data-position", value);
          }
        } 
      }
    },

    // overridden
    _applyIcon(value, old) {},

    // overridden
    _applyLabel(value, old) {
      if (value) {
        var label = this.getChildControl("label");
        if (label) {
          label.setValue(value);
        }
      }
    },

    // property apply
    _applyVariant(value, old) {
      if (value) {
        var elem = this.getContentElement();
        elem.setAttribute("data-variant", value, true);
        if (old)
          elem.removeClass(this.constructor.btnVariantClasses[old]);

        elem.addClass(this.constructor.btnVariantClasses[value]);
      }
    },

    _applyTabSection(value, old) {
      var section = this.getChildControl("tabsection");
      if (section) {
        if (old) {
          section.removeAll();
        }
        if (value) {
          section.add(value);
          section.getContentElement().setAttribute("data-position", this.getIconPosition());
        }
      }
    },

    _applyBarPosition(value, old) {

      var elem = this.getContentElement();

      switch (value) {
        case "top":
          elem.setAttribute("data-orientation", "horizontal");
          elem.removeAttribute("data-inverted");
          elem.removeAttribute("data-placement");
          break;

        case "bottom":
          elem.setAttributes({
            "data-orientation": "horizontal",
            "data-inverted": "true"
          });
          elem.removeAttribute("data-placement");
          break;

        case "left":
          elem.setAttributes({
            "data-orientation": "vertical",
            "data-placement": "left"
          });
          elem.removeAttribute("data-inverted");
          break;

        case "right":
          elem.setAttributes({
            "data-orientation": "vertical",
            "data-placement": "right"
          });
          elem.removeAttribute("data-inverted");
          break;
      }
    },

    // property apply
    _applyShowCloseButton(value, old) {},

    // property apply
    _applyCenter(value) {}

  }
});
