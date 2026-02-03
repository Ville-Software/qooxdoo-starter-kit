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
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * 
   * 
   */
  qx.Class.define("ville.ui.form.InputSection", {
    extend: ville.ui.core.Widget,
    include: qx.ui.core.MChildrenHandling,
    construct() {
      ville.ui.core.Widget.constructor.call(this);
    }
  });
  ville.ui.form.InputSection.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=InputSection.js.map?dt=1769806693095