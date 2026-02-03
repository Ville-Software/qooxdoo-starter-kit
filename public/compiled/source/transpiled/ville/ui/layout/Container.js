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
   * Base Container
   * @external(mantine/core/styles/Container.css)
   */
  qx.Class.define("ville.ui.layout.Container", {
    extend: ville.ui.core.Widget,
    include: qx.ui.core.MChildrenHandling,
    construct(component) {
      if (component) {
        this.__componenttag__P_9_0 = component;
      }
      ville.ui.core.Widget.constructor.call(this);
      this.setCssUtilityClass("m_7485cace mantine-Container-root");
    },
    members: {
      __componenttag__P_9_0: "div",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_9_0);
      }
    }
  });
  ville.ui.layout.Container.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Container.js.map?dt=1769806685957