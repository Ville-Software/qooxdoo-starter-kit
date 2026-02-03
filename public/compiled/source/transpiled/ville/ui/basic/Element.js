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
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Used as a base component or as a replacement for HTML elements
   * 
   */
  qx.Class.define("ville.ui.basic.Element", {
    extend: ville.ui.core.Widget,
    construct(component) {
      if (component) {
        this.__componenttag__P_6_0 = component;
      }
      ville.ui.core.Widget.constructor.call(this);
    },
    members: {
      __componenttag__P_6_0: "div",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_6_0);
      }
    }
  });
  ville.ui.basic.Element.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Element.js.map?dt=1769806685877