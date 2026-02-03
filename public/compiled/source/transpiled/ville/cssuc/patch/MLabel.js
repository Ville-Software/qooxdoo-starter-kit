(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.Label": {},
      "qx.bom.element.Attribute": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Mixin.define("ville.cssuc.patch.MLabel", {
    members: {
      // overridden
      _createDomElement() {
        var rich = this.__rich__P_35_0;
        var el = qx.bom.Label.create(this._content, rich);
        {
          var lblclasses = this._qxObject.getCssUtilityClass();
          if (lblclasses) qx.bom.element.Attribute.set(el, "class", lblclasses);else el.style.overflow = "hidden";
        }
        return el;
      }
    }
  });
  ville.cssuc.patch.MLabel.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MLabel.js.map?dt=1769806687283