(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.TextField": {
        "construct": true,
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * TextField
   * @external(mantine/core/styles/Input.css)
   */
  qx.Class.define("ville.ui.form.TextField", {
    extend: qx.ui.form.TextField,
    construct(value, variant) {
      qx.ui.form.TextField.constructor.call(this, value);
      this.getContentElement().removeClass("qx-abstract-field");
      if (variant) {
        this.setVariant(variant);
      } else {
        this.initVariant();
      }
    },
    properties: {
      variant: {
        init: "default",
        check: ["default", "filled", "light", "outline", "subtle", "transparent", "white"],
        apply: "_applyVariant",
        themeable: true,
        event: "changeVariant"
      }
    },
    members: {
      // property apply
      _applyVariant(value, old) {
        if (value) {
          this.getContentElement().setAttribute("data-variant", value);
        }
      }
    }
  });
  ville.ui.form.TextField.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=TextField.js.map?dt=1791841649874