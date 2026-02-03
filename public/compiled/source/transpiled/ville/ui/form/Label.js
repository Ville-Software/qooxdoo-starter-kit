(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.basic.Label": {
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
      "qx.html.Element": {},
      "qx.ui.core.queue.Layout": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.dynlocale": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Class.define("ville.ui.form.Label", {
    extend: qx.ui.basic.Label,
    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],
    construct(text) {
      qx.ui.basic.Label.constructor.call(this);
      this._setLayout(new qx.ui.layout.Basic());
      if (text) {
        this.setValue(text);
      }
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
    },
    properties: {
      size: {
        init: "xs",
        check: ["xs", "sm", "md", "lg", "xl"],
        apply: "_applySize",
        nullable: true,
        themeable: true,
        event: "changeSize"
      }
    },
    members: {
      // overridden
      _createContentElement() {
        return new qx.html.Element("label");
      },
      _applySize(value, old) {
        if (value) {
          this.setAttribute("data-size", value);
          this.setStyle("--input-label-size", `var(--mantine-font-size-${value})`);
        }
      },
      // overridden
      _applyValue: qx.core.Environment.select("qx.dynlocale", {
        true(value, old) {
          // Sync with content element
          if (value && value.translate) {
            this.setAttribute("html", value.translate());
          } else {
            this.setAttribute("html", value);
          }

          // Mark text size cache as invalid
          this.__invalidContentSize__P_85_0 = true;

          // Update layout
          qx.ui.core.queue.Layout.add(this);
        },
        false(value, old) {
          this.getContentElement().setAttribute("html", value);

          // Mark text size cache as invalid
          this.__invalidContentSize__P_85_0 = true;

          // Update layout
          qx.ui.core.queue.Layout.add(this);
        }
      })
    }
  });
  ville.ui.form.Label.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Label.js.map?dt=1769806689490