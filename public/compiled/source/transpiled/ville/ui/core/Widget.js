(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "ville.ui.core.MWidget": {
        "require": true
      },
      "qx.ui.layout.Basic": {
        "construct": true
      },
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Class.define("ville.ui.core.Widget", {
    extend: qx.ui.core.Widget,
    include: ville.ui.core.MWidget,
    construct() {
      qx.ui.core.Widget.constructor.call(this);
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
  ville.ui.core.Widget.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Widget.js.map?dt=1769806688006