(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Mixin.define("ville.cssuc.patch.MAbstractField", {
    members: {
      // overridden
      renderLayout(left, top, width, height) {
        {
          var updateInsets = this._updateInsets;
          this.assert(qx.Class.hasProperty(this.constructor, "excludeBoundsFromDom"), "Missing ExcludeBoundsFromDom property.");
          if (!this.getExcludeBoundsFromDom()) var changes = qx.Mixin.baseClassMethod(this.constructor, ville.cssuc.patch.MAbstractField, "renderLayout").call(this, left, top, width, height);else var changes = undefined;
        }

        // Directly return if superclass has detected that no
        // changes needs to be applied
        if (!changes) {
          return;
        }
        var inner = changes.size || updateInsets;
        var pixel = "px";
        if (inner || changes.local || changes.margin) {
          var innerWidth = width;
          var innerHeight = height;
        }
        var input = this.getContentElement();

        // we don't need to update positions on native placeholders
        if (updateInsets && this.__useQxPlaceholder__P_40_0) {
          if (this.__useQxPlaceholder__P_40_0) {
            var insets = this.getInsets();
            this._getPlaceholderElement().setStyles({
              paddingTop: insets.top + pixel,
              paddingRight: insets.right + pixel,
              paddingBottom: insets.bottom + pixel,
              paddingLeft: insets.left + pixel
            });
          }
        }
        if (inner || changes.margin) {
          // we don't need to update dimensions on native placeholders
          if (this.__useQxPlaceholder__P_40_0) {
            var insets = this.getInsets();
            this._getPlaceholderElement().setStyles({
              width: innerWidth - insets.left - insets.right + pixel,
              height: innerHeight - insets.top - insets.bottom + pixel
            });
          }
          input.setStyles({
            width: innerWidth + pixel,
            height: innerHeight + pixel
          });
          this._renderContentElement(innerHeight, input);
        }
        if (changes.position) {
          if (this.__useQxPlaceholder__P_40_0) {
            this._getPlaceholderElement().setStyles({
              left: left + pixel,
              top: top + pixel
            });
          }
        }
      }
    }
  });
  ville.cssuc.patch.MAbstractField.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MAbstractField.js.map?dt=1769806687633