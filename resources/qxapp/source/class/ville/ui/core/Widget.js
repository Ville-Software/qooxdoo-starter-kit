qx.Class.define("ville.ui.core.Widget", {

    extend: qx.ui.core.Widget,

    include: ville.ui.core.MWidget,

    construct() {
        super();

        this._setLayout(new qx.ui.layout.Basic());

        this.setExcludeBoundsFromDom(true);
        this.setClearAllInlineStyles(true);
    },

    members: {

        // overridden
         _createContentElement() {
            return new qx.html.Element("div");
        },

        // property apply
        _applyCursor(value, old) {},

        // property apply
        _applyFocusable(value, old) {
            var target = this.getFocusElement();

            // Apply native tabIndex attribute
            if (value) {
                var tabIndex = this.getTabIndex();
                if (tabIndex == null) {
                    tabIndex = 1;
                }

                target.setAttribute("tabIndex", tabIndex);
                //target.removeStyle("outline");

            } else {
                if (target.isNativelyFocusable()) {
                    target.setAttribute("tabIndex", -1);
                } else if (old) {
                    target.setAttribute("tabIndex", null);
                }
            }
        }
    }
  });
