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
  qx.Class.define("ville.ui.basic.Label", {
    extend: qx.ui.basic.Label,
    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],
    construct(text, component) {
      if (component) {
        this.__componenttag__P_57_0 = component;
      }
      qx.ui.basic.Label.constructor.call(this);
      this._setLayout(new qx.ui.layout.Basic());
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
      if (text) {
        this.setValue(text);
      }
    },
    members: {
      __componenttag__P_57_0: "span",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_57_0);
      },
      // overridden
      _applyValue: qx.core.Environment.select("qx.dynlocale", {
        true(value, old) {
          // Sync with content element
          if (value && value.translate) {
            this.getContentElement().setAttribute("html", value.translate());
          } else {
            this.getContentElement().setAttribute("html", value);
          }

          // Mark text size cache as invalid
          this.__invalidContentSize__P_57_1 = true;

          // Update layout
          qx.ui.core.queue.Layout.add(this);
        },
        false(value, old) {
          this.getContentElement().setAttribute("html", value);

          // Mark text size cache as invalid
          this.__invalidContentSize__P_57_1 = true;

          // Update layout
          qx.ui.core.queue.Layout.add(this);
        }
      })
    }
  });
  ville.ui.basic.Label.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Label.js.map?dt=1769806688398