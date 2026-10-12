(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.menu.Menu": {
        "construct": true,
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   *
   * @external(mantine/core/styles/Menu.css)
   */
  qx.Class.define("ville.ui.menu.Menu", {
    extend: qx.ui.menu.Menu,
    construct() {
      qx.ui.menu.Menu.constructor.call(this);
    }
  });
  ville.ui.menu.Menu.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Menu.js.map?dt=1791841649746