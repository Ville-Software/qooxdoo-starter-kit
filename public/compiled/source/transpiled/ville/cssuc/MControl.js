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
  qx.Mixin.define("ville.cssuc.MControl", {
    properties: {
      bypassRenderLayout: {
        check: "Boolean",
        init: false,
        themeable: true
      },
      excludeBoundsFromDom: {
        check: "Boolean",
        init: false,
        themeable: true
      },
      excludeBoundsFromDomMods: {
        check: "Array",
        nullable: true,
        init: null,
        themeable: true
      }
    }
  });
  ville.cssuc.MControl.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MControl.js.map?dt=1769806687264