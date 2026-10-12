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
  qx.Mixin.define("qxapp.pages.MPage", {
    properties: {
      /** Page's url made externally available */
      pageUrl: {
        check: "String",
        init: null
      },
      /** Page's name for the browser title */
      pageName: {
        check: "String",
        init: null
      },
      /** Associated Inertia component name */
      componentName: {
        check: "String",
        init: null
      }
    }
  });
  qxapp.pages.MPage.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MPage.js.map?dt=1791841649142