(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Theme": {
        "usage": "dynamic",
        "require": true
      },
      "ville.cssuc.theme.blankslate.Color": {
        "require": true
      },
      "ville.cssuc.theme.blankslate.Decoration": {
        "require": true
      },
      "ville.cssuc.theme.blankslate.Font": {
        "require": true
      },
      "ville.cssuc.theme.blankslate.Icon": {
        "require": true
      },
      "ville.cssuc.theme.blankslate.Appearance": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     Copyright: 2024 undefined
  
     License: MIT license
  
     Authors: undefined
  
  ************************************************************************ */

  qx.Theme.define("ville.cssuc.theme.blankslate.Theme", {
    meta: {
      color: ville.cssuc.theme.blankslate.Color,
      decoration: ville.cssuc.theme.blankslate.Decoration,
      font: ville.cssuc.theme.blankslate.Font,
      icon: ville.cssuc.theme.blankslate.Icon,
      appearance: ville.cssuc.theme.blankslate.Appearance
    }
  });
  ville.cssuc.theme.blankslate.Theme.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Theme.js.map?dt=1769806685593