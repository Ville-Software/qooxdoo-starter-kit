(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "ville.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MChildrenHandling": {
        "require": true
      },
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Horizontal flex layout
   * @external(mantine/core/styles/Flex.css)
   */
  qx.Class.define("ville.ui.layout.Flex", {
    extend: ville.ui.core.Widget,
    include: qx.ui.core.MChildrenHandling,
    construct(component) {
      if (component) this.__componenttag__P_21_0 = component;
      ville.ui.core.Widget.constructor.call(this);
      this.setCssUtilityClass("m_8bffd616 mantine-Flex-root");
    },
    members: {
      __componenttag__P_21_0: "div",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_21_0);
      }
    }
  });
  ville.ui.layout.Flex.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Flex.js.map?dt=1769806686214