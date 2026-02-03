qx.Mixin.define("ville.cssuc.patch.MAbstractField", {

  members: {

    // overridden
    renderLayout(left, top, width, height) {

      if (qx.core.Environment.get("ville.cssuc")) {
        var updateInsets = this._updateInsets;
        if (qx.core.Environment.get("qx.debug"))
            this.assert(qx.Class.hasProperty(this.constructor, "excludeBoundsFromDom"), "Missing ExcludeBoundsFromDom property.");
        if (!this.getExcludeBoundsFromDom())
          var changes = super.renderLayout(left, top, width, height);
        else
          var changes = undefined;
      } else {
        var updateInsets = this._updateInsets;
        var changes = super.renderLayout(left, top, width, height);
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
      if (updateInsets && this.__useQxPlaceholder) {
        if (this.__useQxPlaceholder) {
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
        if (this.__useQxPlaceholder) {
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
        if (this.__useQxPlaceholder) {
          this._getPlaceholderElement().setStyles({
            left: left + pixel,
            top: top + pixel
          });
        }
      }
    }
}
   
});
