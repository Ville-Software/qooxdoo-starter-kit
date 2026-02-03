(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.Stack": {
        "construct": true,
        "require": true
      },
      "ville.ui.core.MWidget": {
        "require": true
      },
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Stack Container - created specifically for TabView panes
   */
  qx.Class.define("ville.ui.layout.Stack", {
    extend: qx.ui.container.Stack,
    include: ville.ui.core.MWidget,
    construct(component) {
      if (component) {
        this.__componenttag__P_7_0 = component;
      }
      qx.ui.container.Stack.constructor.call(this);

      //this._setLayout(new qx.ui.layout.Basic());
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
      //this.setCssUtilityClass("m_7485cace mantine-Container-root");
    },
    members: {
      __componenttag__P_7_0: "div",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_7_0);
      }
    }
  });
  ville.ui.layout.Stack.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Stack.js.map?dt=1769806685910