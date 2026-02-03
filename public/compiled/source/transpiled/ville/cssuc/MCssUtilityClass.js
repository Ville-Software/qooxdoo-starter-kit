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
      },
      excludeInlineStyles: {
        check: "Array",
        nullable: true,
        init: null,
        apply: "_applyExcludeInlineStyles",
        themeable: true
      },
      clearAllInlineStyles: {
        check: "Boolean",
        init: false,
        apply: "_applyClearAllInlineStyles",
        themeable: true
      },
      removeCssClasses: {
        check: "Array",
        nullable: true,
        init: null,
        apply: "_applyRemoveCssClasses",
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
      },
      // property apply
      _applyExcludeInlineStyles(value, old) {
        var elem = this.getContentElement();
        for (const style of value) {
          elem.removeStyle(style, true);
        }
      },
      // property apply
      _applyClearAllInlineStyles(value, old) {
        if (value) {
          var elem = this.getContentElement();
          var elemstyles = elem.getAllStyles();
          for (const style in elemstyles) {
            elem.removeStyle(style, true);
          }
        }
      },
      // property apply
      _applyRemoveCssClasses(value, old) {
        var elem = this.getContentElement();
        for (const qxcssclass of value) {
          elem.removeClass(qxcssclass, true);
        }
      }
    }
  });
  ville.cssuc.MCssUtilityClass.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MCssUtilityClass.js.map?dt=1769806687274