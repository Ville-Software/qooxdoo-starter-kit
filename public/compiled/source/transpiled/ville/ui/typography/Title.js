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
   * default node is <div>
   * @external(mantine/core/styles/Title.css)
   */
  qx.Class.define("ville.ui.typography.Title", {
    extend: ville.ui.core.Widget,
    include: qx.ui.core.MChildrenHandling,
    construct(order, text) {
      if (order >= 1 && order <= 6) {
        this.__componenttag__P_19_0 = "h" + order;
      }
      ville.ui.core.Widget.constructor.call(this);
      this.setCssUtilityClass("m_8a5d1357 mantine-Title-root");
      if (text) this.setText(text);
    },
    properties: {
      text: {
        apply: "_applyText",
        nullable: true,
        check: "String"
      }
    },
    members: {
      __componenttag__P_19_0: "div",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_19_0);
      },
      // property apply
      _applyText(value) {
        if (value) {
          this.getContentElement().setAttribute("html", value);
        }
      }
    }
  });
  ville.ui.typography.Title.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Title.js.map?dt=1769806686190