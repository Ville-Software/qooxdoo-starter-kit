(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Mixin.define("ville.cssuc.MCssUtilityClass", {
    properties: {
      cssUtilityClass: {
        check: "String",
        nullable: true,
        init: null,
        apply: "_applyCssUtilityClass",
        themeable: true
      }
    },
    members: {
      // property apply
      _applyCssUtilityClass(value, old) {
        var content = this.getContentElement();
        if (old) {
          content.removeClass(old);
        }
        if (value) {
          content.addClass(value);
        }
      }
    }
  });
  ville.cssuc.MCssUtilityClass.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MCssUtilityClass.js.map?dt=1791841649488