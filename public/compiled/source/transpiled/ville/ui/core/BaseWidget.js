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
      "qx.html.Input": {},
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Base widget
   */
  qx.Class.define("ville.ui.core.BaseWidget", {
    extend: ville.ui.core.Widget,
    construct(component) {
      if (component) {
        this.__componentmap__P_86_0 = component;
      }
      ville.ui.core.Widget.constructor.call(this);
    },
    members: {
      __componentmap__P_86_0: {
        "basetag": "div",
        "type": "na"
      },
      // overridden
      _createContentElement() {
        var newelem;
        if (this.__componentmap__P_86_0.basetag = "input") {
          newelem = new qx.html.Input(this.__componentmap__P_86_0.type);
        } else {
          newelem = new qx.html.Element(this.__componentmap__P_86_0.basetag);
        }
        return newelem;
      }
    }
  });
  ville.ui.core.BaseWidget.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=BaseWidget.js.map?dt=1769806689504