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
  /**
   * This is the innerwrapper widget for Button, TextFieldWrapper
   * @external(mantine/core/styles/InlineInput.css)
   */
  qx.Class.define("ville.ui.core.InnerWrapper", {
    extend: ville.ui.core.Widget,
    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],
    construct(component) {
      if (component) {
        this.__componenttag__P_58_0 = component;
      }
      ville.ui.core.Widget.constructor.call(this);
      this._setLayout(new qx.ui.layout.Basic());
      this.setExcludeBoundsFromDom(true);
      //this.setExcludeInlineStyles(["position"]);
    },
    members: {
      __componenttag__P_58_0: "span",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_58_0);
      }
    }
  });
  ville.ui.core.InnerWrapper.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=InnerWrapper.js.map?dt=1769806688437