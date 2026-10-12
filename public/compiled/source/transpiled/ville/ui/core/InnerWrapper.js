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
      "qx.ui.core.MChildrenHandling": {
        "require": true
      },
      "qx.ui.layout.Basic": {
        "construct": true
      },
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * This is the innerwrapper widget for Button, TextFieldWrapper
   * @external(mantine/core/styles/InlineInput.css)
   */
  qx.Class.define("ville.ui.core.InnerWrapper", {
    extend: qx.ui.core.Widget,
    include: qx.ui.core.MChildrenHandling,
    construct(component) {
      if (component) {
        this.__componenttag__P_93_0 = component;
      }
      qx.ui.core.Widget.constructor.call(this);
      this._setLayout(new qx.ui.layout.Basic());
    },
    members: {
      __componenttag__P_93_0: "span",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_93_0);
      }
    }
  });
  ville.ui.core.InnerWrapper.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=InnerWrapper.js.map?dt=1791841651250