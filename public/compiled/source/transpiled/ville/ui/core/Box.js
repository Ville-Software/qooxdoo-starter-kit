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
   * Used as a base component or as a replacement for HTML elements
   * 
   */
  qx.Class.define("ville.ui.core.Box", {
    extend: ville.ui.core.Widget,
    include: qx.ui.core.MChildrenHandling,
    construct(component) {
      if (component) {
        this.__componenttag__P_11_0 = component;
      }
      ville.ui.core.Widget.constructor.call(this);
    },
    members: {
      __componenttag__P_11_0: "div",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_11_0);
      }
    }
  });
  ville.ui.core.Box.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Box.js.map?dt=1769806685979