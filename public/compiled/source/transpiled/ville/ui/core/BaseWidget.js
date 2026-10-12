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
      "qx.html.Input": {},
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Base widget
   */
  qx.Class.define("ville.ui.core.BaseWidget", {
    extend: qx.ui.core.Widget,
    construct(component) {
      if (component) {
        this.__componentmap__P_94_0 = component;
      }
      qx.ui.core.Widget.constructor.call(this);
    },
    members: {
      __componentmap__P_94_0: {
        "basetag": "div",
        "type": "na"
      },
      // overridden
      _createContentElement() {
        var newelem;
        if (this.__componentmap__P_94_0.basetag === "input") {
          newelem = new qx.html.Input(this.__componentmap__P_94_0.type);
        } else {
          newelem = new qx.html.Element(this.__componentmap__P_94_0.basetag);
        }
        newelem.addListener("click", e => {
          e.preventDefault();
        });
        return newelem;
      }
    }
  });
  ville.ui.core.BaseWidget.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=BaseWidget.js.map?dt=1791841651252