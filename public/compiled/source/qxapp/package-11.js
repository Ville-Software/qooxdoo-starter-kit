(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.Abstract": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.Util": {},
      "qx.theme.manager.Decoration": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A vertical box layout.
   *
   * The vertical box layout lays out widgets in a vertical column, from top
   * to bottom.
   *
   * *Features*
   *
   * * Minimum and maximum dimensions
   * * Prioritized growing/shrinking (flex)
   * * Margins (with vertical collapsing)
   * * Auto sizing (ignoring percent values)
   * * Percent heights (not relevant for size hint)
   * * Alignment (child property {@link qx.ui.core.LayoutItem#alignY} is ignored)
   * * Vertical spacing (collapsed with margins)
   * * Reversed children layout (from last to first)
   * * Horizontal children stretching (respecting size hints)
   *
   * *Item Properties*
   *
   * <ul>
   * <li><strong>flex</strong> <em>(Integer)</em>: The flexibility of a layout item determines how the container
   *   distributes remaining empty space among its children. If items are made
   *   flexible, they can grow or shrink accordingly. Their relative flex values
   *   determine how the items are being resized, i.e. the larger the flex ratio
   *   of two items, the larger the resizing of the first item compared to the
   *   second.
   *
   *   If there is only one flex item in a layout container, its actual flex
   *   value is not relevant. To disallow items to become flexible, set the
   *   flex value to zero.
   * </li>
   * <li><strong>height</strong> <em>(String)</em>: Allows to define a percent
   *   height for the item. The height in percent, if specified, is used instead
   *   of the height defined by the size hint. The minimum and maximum height still
   *   takes care of the element's limits. It has no influence on the layout's
   *   size hint. Percent values are mostly useful for widgets which are sized by
   *   the outer hierarchy.
   * </li>
   * </ul>
   *
   * *Example*
   *
   * Here is a little example of how to use the vertical box layout.
   *
   * <pre class="javascript">
   * var layout = new qx.ui.layout.VBox();
   * layout.setSpacing(4); // apply spacing
   *
   * var container = new qx.ui.container.Composite(layout);
   *
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * container.add(new qx.ui.core.Widget());
   * </pre>
   *
   * *External Documentation*
   *
   * See <a href='https://qooxdoo.org/documentation/#/desktop/layout/box.md'>extended documentation</a>
   * and links to demos for this layout.
   *
   */
  qx.Class.define("qx.ui.layout.VBox", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param spacing {Integer?0} The spacing between child widgets {@link #spacing}.
     * @param alignY {String?"top"} Vertical alignment of the whole children
     *     block {@link #alignY}.
     * @param separator {String|qx.ui.decoration.IDecorator?} A separator to be rendered between the items
     */
    construct(spacing, alignY, separator) {
      qx.ui.layout.Abstract.constructor.call(this);
      if (spacing) {
        this.setSpacing(spacing);
      }
      if (alignY) {
        this.setAlignY(alignY);
      }
      if (separator) {
        this.setSeparator(separator);
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Vertical alignment of the whole children block. The vertical
       * alignment of the child is completely ignored in VBoxes (
       * {@link qx.ui.core.LayoutItem#alignY}).
       */
      alignY: {
        check: ["top", "middle", "bottom"],
        init: "top",
        apply: "_applyLayoutChange"
      },
      /**
       * Horizontal alignment of each child. Can be overridden through
       * {@link qx.ui.core.LayoutItem#alignX}.
       */
      alignX: {
        check: ["left", "center", "right"],
        init: "left",
        apply: "_applyLayoutChange"
      },
      /** Vertical spacing between two children */
      spacing: {
        check: "Integer",
        init: 0,
        apply: "_applyLayoutChange"
      },
      /** Separator lines to use between the objects */
      separator: {
        check: "Decorator",
        nullable: true,
        apply: "_applyLayoutChange"
      },
      /** Whether the actual children list should be laid out in reversed order. */
      reversed: {
        check: "Boolean",
        init: false,
        apply: "_applyReversed"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __heights__P_12_0: null,
      __flexs__P_12_1: null,
      __enableFlex__P_12_2: null,
      __children__P_12_3: null,
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyReversed() {
        // easiest way is to invalidate the cache
        this._invalidChildrenCache = true;

        // call normal layout change
        this._applyLayoutChange();
      },
      /**
       * Rebuilds caches for flex and percent layout properties
       */
      __rebuildCache__P_12_4() {
        var children = this._getLayoutChildren();
        var length = children.length;
        var enableFlex = false;
        var reuse = this.__heights__P_12_0 && this.__heights__P_12_0.length != length && this.__flexs__P_12_1 && this.__heights__P_12_0;
        var props;

        // Sparse array (keep old one if lengths has not been modified)
        var heights = reuse ? this.__heights__P_12_0 : new Array(length);
        var flexs = reuse ? this.__flexs__P_12_1 : new Array(length);

        // Reverse support
        if (this.getReversed()) {
          children = children.concat().reverse();
        }

        // Loop through children to preparse values
        for (var i = 0; i < length; i++) {
          props = children[i].getLayoutProperties();
          if (props.height != null) {
            heights[i] = parseFloat(props.height) / 100;
          }
          if (props.flex != null) {
            flexs[i] = props.flex;
            enableFlex = true;
          } else {
            // reset (in case the index of the children changed: BUG #3131)
            flexs[i] = 0;
          }
        }

        // Store data
        if (!reuse) {
          this.__heights__P_12_0 = heights;
          this.__flexs__P_12_1 = flexs;
        }
        this.__enableFlex__P_12_2 = enableFlex;
        this.__children__P_12_3 = children;

        // Clear invalidation marker
        delete this._invalidChildrenCache;
      },
      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          if (name == "height") {
            this.assertMatch(value, qx.ui.layout.Util.PERCENT_VALUE);
          } else if (name == "flex") {
            // flex
            this.assertNumber(value);
            this.assert(value >= 0);
          } else if (name == "flexShrink") {
            this.assertBoolean(value);
          } else {
            this.assert(false, "The property '" + name + "' is not supported by the VBox layout!");
          }
        },
        false: null
      }),
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        // Rebuild flex/height caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_12_4();
        }

        // Cache children
        var children = this.__children__P_12_3;
        var length = children.length;
        var util = qx.ui.layout.Util;

        // Compute gaps
        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;
        if (separator) {
          gaps = util.computeVerticalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeVerticalGaps(children, spacing, true);
        }

        // First run to cache children data and compute allocated height
        var i, child, height, percent;
        var heights = [],
          hint;
        var allocatedHeight = gaps;
        for (i = 0; i < length; i += 1) {
          percent = this.__heights__P_12_0[i];
          hint = children[i].getSizeHint();
          height = percent != null ? Math.floor((availHeight - gaps) * percent) : hint.height;

          // Limit computed value
          if (height < hint.minHeight) {
            height = hint.minHeight;
          } else if (height > hint.maxHeight) {
            height = hint.maxHeight;
          }
          heights.push(height);
          allocatedHeight += height;
        }

        // Flex support (growing/shrinking)
        if (this.__enableFlex__P_12_2 && allocatedHeight != availHeight) {
          var flexibles = {};
          var flex, offset;
          var notEnoughSpace = allocatedHeight > availHeight;
          for (i = 0; i < length; i += 1) {
            flex = this.__flexs__P_12_1[i];
            if (flex > 0) {
              hint = children[i].getSizeHint();
              flexibles[i] = {
                min: hint.minHeight,
                value: heights[i],
                max: hint.maxHeight,
                flex: flex
              };
              if (notEnoughSpace) {
                var props = children[i].getLayoutProperties();
                if (props && props.flexShrink) {
                  flexibles[i].min = 0;
                }
              }
            }
          }
          var result = util.computeFlexOffsets(flexibles, availHeight, allocatedHeight);
          for (i in result) {
            offset = result[i].offset;
            heights[i] += offset;
            allocatedHeight += offset;
          }
        }

        // Start with top coordinate
        var top = children[0].getMarginTop();

        // Alignment support
        if (allocatedHeight < availHeight && this.getAlignY() != "top") {
          top = availHeight - allocatedHeight;
          if (this.getAlignY() === "middle") {
            top = Math.round(top / 2);
          }
        }

        // Layouting children
        var hint, left, width, height, marginBottom, marginLeft, marginRight;

        // Pre configure separators
        this._clearSeparators();

        // Compute separator height
        if (separator) {
          var separatorInsets = qx.theme.manager.Decoration.getInstance().resolve(separator).getInsets();
          var separatorHeight = separatorInsets.top + separatorInsets.bottom;
        }

        // Render children and separators
        for (i = 0; i < length; i += 1) {
          child = children[i];
          height = heights[i];
          hint = child.getSizeHint();
          marginLeft = child.getMarginLeft();
          marginRight = child.getMarginRight();

          // Find usable width
          width = Math.max(hint.minWidth, Math.min(availWidth - marginLeft - marginRight, hint.maxWidth));

          // Respect horizontal alignment
          left = util.computeHorizontalAlignOffset(child.getAlignX() || this.getAlignX(), width, availWidth, marginLeft, marginRight);

          // Add collapsed margin
          if (i > 0) {
            // Whether a separator has been configured
            if (separator) {
              // add margin of last child and spacing
              top += marginBottom + spacing;

              // then render the separator at this position
              this._renderSeparator(separator, {
                top: top + padding.top,
                left: padding.left,
                height: separatorHeight,
                width: availWidth
              });

              // and finally add the size of the separator, the spacing (again) and the top margin
              top += separatorHeight + spacing + child.getMarginTop();
            } else {
              // Support margin collapsing when no separator is defined
              top += util.collapseMargins(spacing, marginBottom, child.getMarginTop());
            }
          }

          // Layout child
          child.renderLayout(left + padding.left, top + padding.top, width, height);

          // Add height
          top += height;

          // Remember bottom margin (for collapsing)
          marginBottom = child.getMarginBottom();
        }
      },
      // overridden
      _computeSizeHint() {
        // Rebuild flex/height caches
        if (this._invalidChildrenCache) {
          this.__rebuildCache__P_12_4();
        }
        var util = qx.ui.layout.Util;
        var children = this.__children__P_12_3;

        // Initialize
        var minHeight = 0,
          height = 0,
          percentMinHeight = 0;
        var minWidth = 0,
          width = 0;
        var child, hint, margin;

        // Iterate over children
        for (var i = 0, l = children.length; i < l; i += 1) {
          child = children[i];
          hint = child.getSizeHint();

          // Sum up heights
          height += hint.height;

          // Detect if child is shrinkable or has percent height and update minHeight
          var flex = this.__flexs__P_12_1[i];
          var percent = this.__heights__P_12_0[i];
          if (flex) {
            minHeight += hint.minHeight;
          } else if (percent) {
            percentMinHeight = Math.max(percentMinHeight, Math.round(hint.minHeight / percent));
          } else {
            minHeight += hint.height;
          }

          // Build horizontal margin sum
          margin = child.getMarginLeft() + child.getMarginRight();

          // Find biggest width
          if (hint.width + margin > width) {
            width = hint.width + margin;
          }

          // Find biggest minWidth
          if (hint.minWidth + margin > minWidth) {
            minWidth = hint.minWidth + margin;
          }
        }
        minHeight += percentMinHeight;

        // Respect gaps
        var spacing = this.getSpacing();
        var separator = this.getSeparator();
        var gaps;
        if (separator) {
          gaps = util.computeVerticalSeparatorGaps(children, spacing, separator);
        } else {
          gaps = util.computeVerticalGaps(children, spacing, true);
        }

        // Return hint
        return {
          minHeight: minHeight + gaps,
          height: height + gaps,
          minWidth: minWidth,
          width: width
        };
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this.__heights__P_12_0 = this.__flexs__P_12_1 = this.__children__P_12_3 = null;
    }
  });
  qx.ui.layout.VBox.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.Atom": {
        "construct": true
      },
      "qx.ui.basic.Label": {},
      "qx.ui.basic.Image": {},
      "qx.lang.String": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A multi-purpose widget, which combines a label with an icon.
   *
   * The intended purpose of qx.ui.basic.Atom is to easily align the common icon-text
   * combination in different ways.
   *
   * This is useful for all types of buttons, tooltips, ...
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   var atom = new qx.ui.basic.Atom("Icon Right", "icon/32/actions/go-next.png");
   *   this.getRoot().add(atom);
   * </pre>
   *
   * This example creates an atom with the label "Icon Right" and an icon.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/atom.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   *
   *
   * @childControl label {qx.ui.basic.Label} label part of the atom
   * @childControl icon {qx.ui.basic.Image} icon part of the atom
   */
  qx.Class.define("qx.ui.basic.Atom", {
    extend: qx.ui.core.Widget,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param label {String} Label to use
     * @param icon {String?null} Icon to use
     */
    construct(label, icon) {
      {
        this.assertArgumentsCount(arguments, 0, 2);
      }
      qx.ui.core.Widget.constructor.call(this);
      this._setLayout(new qx.ui.layout.Atom());
      if (label != null) {
        this.setLabel(label);
      }
      if (icon !== undefined) {
        this.setIcon(icon);
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "atom"
      },
      /** The label/caption/text of the qx.ui.basic.Atom instance */
      label: {
        apply: "_applyLabel",
        nullable: true,
        check: "String",
        event: "changeLabel"
      },
      /**
       * Switches between rich HTML and text content. The text mode (<code>false</code>) supports
       * advanced features like ellipsis when the available space is not
       * enough. HTML mode (<code>true</code>) supports multi-line content and all the
       * markup features of HTML content.
       */
      rich: {
        check: "Boolean",
        init: false,
        apply: "_applyRich"
      },
      /** Any URI String supported by qx.ui.basic.Image to display an icon */
      icon: {
        check: "String",
        apply: "_applyIcon",
        nullable: true,
        themeable: true,
        event: "changeIcon"
      },
      /**
       * The space between the icon and the label
       */
      gap: {
        check: "Integer",
        nullable: false,
        event: "changeGap",
        apply: "_applyGap",
        themeable: true,
        init: 4
      },
      /**
       * Configure the visibility of the sub elements/widgets.
       * Possible values: both, label, icon
       */
      show: {
        init: "both",
        check: ["both", "label", "icon"],
        themeable: true,
        inheritable: true,
        apply: "_applyShow",
        event: "changeShow"
      },
      /**
       * The position of the icon in relation to the text.
       * Only useful/needed if text and icon is configured and 'show' is configured as 'both' (default)
       */
      iconPosition: {
        init: "left",
        check: ["top", "right", "bottom", "left", "top-left", "bottom-left", "top-right", "bottom-right"],
        themeable: true,
        apply: "_applyIconPosition"
      },
      /**
       * Whether the content should be rendered centrally when to much space
       * is available. Enabling this property centers in both axis. The behavior
       * when disabled of the centering depends on the {@link #iconPosition} property.
       * If the icon position is <code>left</code> or <code>right</code>, the X axis
       * is not centered, only the Y axis. If the icon position is <code>top</code>
       * or <code>bottom</code>, the Y axis is not centered. In case of e.g. an
       * icon position of <code>top-left</code> no axis is centered.
       */
      center: {
        init: false,
        check: "Boolean",
        themeable: true,
        apply: "_applyCenter"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "label":
            control = new qx.ui.basic.Label(this.getLabel());
            control.setAnonymous(true);
            control.setRich(this.getRich());
            control.setSelectable(this.getSelectable());
            this._add(control);
            if (this.getLabel() == null || this.getShow() === "icon") {
              control.exclude();
            }
            break;
          case "icon":
            control = new qx.ui.basic.Image(this.getIcon());
            control.setAnonymous(true);
            this._addAt(control, 0);
            if (this.getIcon() == null || this.getShow() === "label") {
              control.exclude();
            }
            break;
        }
        return control || qx.ui.basic.Atom.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      /**
       * @lint ignoreReferenceField(_forwardStates)
       */
      _forwardStates: {
        focused: true,
        hovered: true
      },
      /**
       * Updates the visibility of the label
       */
      _handleLabel() {
        if (this.getLabel() == null || this.getShow() === "icon") {
          this._excludeChildControl("label");
        } else {
          this._showChildControl("label");
        }
      },
      /**
       * Updates the visibility of the icon
       */
      _handleIcon() {
        if (this.getIcon() == null || this.getShow() === "label") {
          this._excludeChildControl("icon");
        } else {
          this._showChildControl("icon");
        }
      },
      // property apply
      _applyLabel(value, old) {
        var label = this.getChildControl("label", true);
        if (label) {
          label.setValue(value);
        }
        this._handleLabel();
      },
      // property apply
      _applyRich(value, old) {
        var label = this.getChildControl("label", true);
        if (label) {
          label.setRich(value);
        }
      },
      // property apply
      _applyIcon(value, old) {
        var icon = this.getChildControl("icon", true);
        if (icon) {
          icon.setSource(value);
        }
        this._handleIcon();
      },
      // property apply
      _applyShow(value, old) {
        this._handleLabel();
        this._handleIcon();
      },
      __safeSetPropertyOnLayout__P_106_0(value, propertyName) {
        const layout = this._getLayout();
        const propertySetter = `set${qx.lang.String.firstUp(propertyName)}`;
        if (layout[propertySetter]) {
          layout[propertySetter](value);
        } else {
          this.warn(`The \`${propertyName}\` property of a ${this.classname} was set, but the layout ${this._getLayout().classname} does not support a \`${propertyName}\` property.`);
        }
      },
      // property apply
      _applyGap(value) {
        this.__safeSetPropertyOnLayout__P_106_0(value, "gap");
      },
      // property apply
      _applyIconPosition(value) {
        this.__safeSetPropertyOnLayout__P_106_0(value, "iconPosition");
      },
      // property apply
      _applyCenter(value) {
        this.__safeSetPropertyOnLayout__P_106_0(value, "center");
      },
      // overridden
      _applySelectable(value, old) {
        qx.ui.basic.Atom.superclass.prototype._applySelectable.call(this, value, old);
        var label = this.getChildControl("label", true);
        if (label) {
          this.getChildControl("label").setSelectable(value);
        }
      }
    }
  });
  qx.ui.basic.Atom.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Mixin": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.command.Command": {},
      "qx.Class": {},
      "qx.util.PropertyUtil": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.command.bindEnabled": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * This mixin is included by all widgets, which support an 'execute' like
   * buttons or menu entries.
   */
  qx.Mixin.define("qx.ui.core.MExecutable", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired if the {@link #execute} method is invoked.*/
      execute: "qx.event.type.Event"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * A command called if the {@link #execute} method is called, e.g. on a
       * button tap.
       */
      command: {
        check: "qx.ui.command.Command",
        apply: "_applyCommand",
        event: "changeCommand",
        nullable: true
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __executableBindingIds__P_164_0: null,
      __semaphore__P_164_1: false,
      __executeListenerId__P_164_2: null,
      /**
       * @type {Map} Set of properties, which will by synced from the command to the
       *    including widget
       *
       * @lint ignoreReferenceField(_bindableProperties)
       */
      _bindableProperties: qx.core.Environment.select("qx.command.bindEnabled", {
        true: ["enabled", "label", "icon", "toolTipText", "value", "menu"],
        false: ["label", "icon", "toolTipText", "value", "menu"]
      }),
      /**
       * Initiate the execute action.
       */
      execute() {
        var cmd = this.getCommand();
        if (cmd) {
          if (this.__semaphore__P_164_1) {
            this.__semaphore__P_164_1 = false;
          } else {
            this.__semaphore__P_164_1 = true;
            cmd.execute(this);
          }
        }
        this.fireEvent("execute");
      },
      /**
       * Handler for the execute event of the command.
       *
       * @param e {qx.event.type.Event} The execute event of the command.
       */
      __onCommandExecute__P_164_3(e) {
        if (this.isEnabled()) {
          if (this.__semaphore__P_164_1) {
            this.__semaphore__P_164_1 = false;
            return;
          }
          if (this.isEnabled()) {
            this.__semaphore__P_164_1 = true;
            this.execute();
          }
        }
      },
      // property apply
      _applyCommand(value, old) {
        // execute forwarding
        if (old != null) {
          old.removeListenerById(this.__executeListenerId__P_164_2);
        }
        if (value != null) {
          this.__executeListenerId__P_164_2 = value.addListener("execute", this.__onCommandExecute__P_164_3, this);
        }

        // binding stuff
        var ids = this.__executableBindingIds__P_164_0;
        if (ids == null) {
          this.__executableBindingIds__P_164_0 = ids = {};
        }
        var selfPropertyValue;
        for (var i = 0; i < this._bindableProperties.length; i++) {
          var property = this._bindableProperties[i];

          // remove the old binding
          if (old != null && !old.isDisposed() && ids[property] != null) {
            old.removeBinding(ids[property]);
            ids[property] = null;
          }

          // add the new binding
          if (value != null && qx.Class.hasProperty(this.constructor, property)) {
            // handle the init value (don't sync the initial null)
            var cmdPropertyValue = value.get(property);
            if (cmdPropertyValue == null) {
              selfPropertyValue = this.get(property);
              // check also for themed values [BUG #5906]
              if (selfPropertyValue == null) {
                // update the appearance to make sure every themed property is up to date
                this.$$resyncNeeded = true;
                this.syncAppearance();
                selfPropertyValue = qx.util.PropertyUtil.getThemeValue(this, property);
              }
            } else {
              // Reset the self property value [BUG #4534]
              selfPropertyValue = null;
            }
            // set up the binding
            ids[property] = value.bind(property, this, property);
            // reapply the former value
            if (selfPropertyValue) {
              this.set(property, selfPropertyValue);
            }
          }
        }
      }
    },
    destruct() {
      this._applyCommand(null, this.getCommand());
      this.__executableBindingIds__P_164_0 = null;
    }
  });
  qx.ui.core.MExecutable.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.IField": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Form interface for all form widgets which have boolean as their primary
   * data type like a checkbox.
   */
  qx.Interface.define("qx.ui.form.IBooleanForm", {
    extend: qx.ui.form.IField,
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired when the value was modified */
      changeValue: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        VALUE PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the element's value.
       *
       * @param value {Boolean|null} The new value of the element.
       * @return {Boolean|null}
       */
      setValue(value) {
        return arguments.length == 1;
      },
      /**
       * Resets the element's value to its initial value.
       */
      resetValue() {},
      /**
       * The element's user set value.
       *
       * @return {Boolean|null} The value.
       */
      getValue() {}
    }
  });
  qx.ui.form.IBooleanForm.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Form interface for all form widgets which are executable in some way. This
   * could be a button for example.
   */
  qx.Interface.define("qx.ui.form.IExecutable", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired when the widget is executed. Sets the "data" property of the
       * event to the object that issued the command.
       */
      execute: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        COMMAND PROPERTY
      ---------------------------------------------------------------------------
      */

      /**
       * Set the command of this executable.
       *
       * @param command {qx.ui.command.Command} The command.
       */
      setCommand(command) {
        return arguments.length == 1;
      },
      /**
       * Return the current set command of this executable.
       *
       * @return {qx.ui.command.Command} The current set command.
       */
      getCommand() {},
      /**
       * Fire the "execute" event on the command.
       */
      execute() {}
    }
  });
  qx.ui.form.IExecutable.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.RadioGroup": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Each object, which should be managed by a {@link RadioGroup} have to
   * implement this interface.
   */
  qx.Interface.define("qx.ui.form.IRadioItem", {
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired when the item was checked or unchecked */
      changeValue: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Set whether the item is checked
       *
       * @param value {Boolean} whether the item should be checked
       */
      setValue(value) {},
      /**
       * Get whether the item is checked
       *
       * @return {Boolean} whether the item it checked
       */
      getValue() {},
      /**
       * Set the radiogroup, which manages this item
       *
       * @param value {qx.ui.form.RadioGroup} The radiogroup, which should
       *     manage the item.
       */
      setGroup(value) {
        this.assertInstance(value, qx.ui.form.RadioGroup);
      },
      /**
       * Get the radiogroup, which manages this item
       *
       * @return {qx.ui.form.RadioGroup} The radiogroup, which manages the item.
       */
      getGroup() {}
    }
  });
  qx.ui.form.IRadioItem.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.Abstract": {
        "require": true
      },
      "qx.ui.layout.Util": {},
      "qx.ui.basic.Label": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A atom layout. Used to place an image and label in relation
   * to each other. Useful to create buttons, list items, etc.
   *
   * *Features*
   *
   * * Gap between icon and text (using {@link #gap})
   * * Vertical and horizontal mode (using {@link #iconPosition})
   * * Sorting options to place first child on top/left or bottom/right (using {@link #iconPosition})
   * * Automatically middles/centers content to the available space
   * * Auto-sizing
   * * Supports more than two children (will be processed the same way like the previous ones)
   *
   * *Item Properties*
   *
   * None
   *
   * *Notes*
   *
   * * Does not support margins and alignment of {@link qx.ui.core.LayoutItem}.
   *
   * *Alternative Names*
   *
   * None
   */
  qx.Class.define("qx.ui.layout.Atom", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** The gap between the icon and the text */
      gap: {
        check: "Integer",
        init: 4,
        apply: "_applyLayoutChange"
      },
      /** The position of the icon in relation to the text */
      iconPosition: {
        check: ["left", "top", "right", "bottom", "top-left", "bottom-left", "top-right", "bottom-right"],
        init: "left",
        apply: "_applyLayoutChange"
      },
      /**
       * Whether the content should be rendered centrally when to much space
       * is available. Enabling this property centers in both axis. The behavior
       * when disabled of the centering depends on the {@link #iconPosition} property.
       * If the icon position is <code>left</code> or <code>right</code>, the X axis
       * is not centered, only the Y axis. If the icon position is <code>top</code>
       * or <code>bottom</code>, the Y axis is not centered. In case of e.g. an
       * icon position of <code>top-left</code> no axis is centered.
       */
      center: {
        check: "Boolean",
        init: false,
        apply: "_applyLayoutChange"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          this.assert(false, "The property '" + name + "' is not supported by the Atom layout!");
        },
        false: null
      }),
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        var left = padding.left;
        var top = padding.top;
        var Util = qx.ui.layout.Util;
        var iconPosition = this.getIconPosition();
        var children = this._getLayoutChildren();
        var length = children.length;
        var width, height;
        var child, hint;
        var gap = this.getGap();
        var center = this.getCenter();

        // reverse ordering
        var allowedPositions = ["bottom", "right", "top-right", "bottom-right"];
        if (allowedPositions.indexOf(iconPosition) != -1) {
          var start = length - 1;
          var end = -1;
          var increment = -1;
        } else {
          var start = 0;
          var end = length;
          var increment = 1;
        }

        // vertical
        if (iconPosition == "top" || iconPosition == "bottom") {
          if (center) {
            var allocatedHeight = 0;
            for (var i = start; i != end; i += increment) {
              height = children[i].getSizeHint().height;
              if (height > 0) {
                allocatedHeight += height;
                if (i != start) {
                  allocatedHeight += gap;
                }
              }
            }
            top += Math.round((availHeight - allocatedHeight) / 2);
          }
          var childTop = top;
          for (var i = start; i != end; i += increment) {
            child = children[i];
            hint = child.getSizeHint();
            width = Math.min(hint.maxWidth, Math.max(availWidth, hint.minWidth));
            height = hint.height;
            left = Util.computeHorizontalAlignOffset("center", width, availWidth) + padding.left;
            child.renderLayout(left, childTop, width, height);

            // Ignore pseudo invisible elements
            if (height > 0) {
              childTop = top + height + gap;
            }
          }
        }

        // horizontal
        // in this way it also supports shrinking of the first label
        else {
          var remainingWidth = availWidth;
          var shrinkTarget = null;
          var count = 0;
          for (var i = start; i != end; i += increment) {
            child = children[i];
            width = child.getSizeHint().width;
            if (width > 0) {
              if (!shrinkTarget && child instanceof qx.ui.basic.Label) {
                shrinkTarget = child;
              } else {
                remainingWidth -= width;
              }
              count++;
            }
          }
          if (count > 1) {
            var gapSum = (count - 1) * gap;
            remainingWidth -= gapSum;
          }
          if (shrinkTarget) {
            var hint = shrinkTarget.getSizeHint();
            var shrinkTargetWidth = Math.max(hint.minWidth, Math.min(remainingWidth, hint.maxWidth));
            remainingWidth -= shrinkTargetWidth;
          }
          if (center && remainingWidth > 0) {
            left += Math.round(remainingWidth / 2);
          }
          for (var i = start; i != end; i += increment) {
            child = children[i];
            hint = child.getSizeHint();
            height = Math.min(hint.maxHeight, Math.max(availHeight, hint.minHeight));
            if (child === shrinkTarget) {
              width = shrinkTargetWidth;
            } else {
              width = hint.width;
            }
            var align = "middle";
            if (iconPosition == "top-left" || iconPosition == "top-right") {
              align = "top";
            } else if (iconPosition == "bottom-left" || iconPosition == "bottom-right") {
              align = "bottom";
            }
            var childTop = top + Util.computeVerticalAlignOffset(align, hint.height, availHeight);
            child.renderLayout(left, childTop, width, height);

            // Ignore pseudo invisible childs for gap e.g.
            // empty text or unavailable images
            if (width > 0) {
              left += width + gap;
            }
          }
        }
      },
      // overridden
      _computeSizeHint() {
        var children = this._getLayoutChildren();
        var length = children.length;
        var hint, result;

        // Fast path for only one child
        if (length === 1) {
          var hint = children[0].getSizeHint();

          // Work on a copy, but do not respect max
          // values as a Atom can be rendered bigger
          // than its content.
          result = {
            width: hint.width,
            height: hint.height,
            minWidth: hint.minWidth,
            minHeight: hint.minHeight
          };
        } else {
          var minWidth = 0,
            width = 0;
          var minHeight = 0,
            height = 0;
          var iconPosition = this.getIconPosition();
          var gap = this.getGap();
          if (iconPosition === "top" || iconPosition === "bottom") {
            var count = 0;
            for (var i = 0; i < length; i++) {
              hint = children[i].getSizeHint();

              // Max of widths
              width = Math.max(width, hint.width);
              minWidth = Math.max(minWidth, hint.minWidth);

              // Sum of heights
              if (hint.height > 0) {
                height += hint.height;
                minHeight += hint.minHeight;
                count++;
              }
            }
            if (count > 1) {
              var gapSum = (count - 1) * gap;
              height += gapSum;
              minHeight += gapSum;
            }
          } else {
            var count = 0;
            for (var i = 0; i < length; i++) {
              hint = children[i].getSizeHint();

              // Max of heights
              height = Math.max(height, hint.height);
              minHeight = Math.max(minHeight, hint.minHeight);

              // Sum of widths
              if (hint.width > 0) {
                width += hint.width;
                minWidth += hint.minWidth;
                count++;
              }
            }
            if (count > 1) {
              var gapSum = (count - 1) * gap;
              width += gapSum;
              minWidth += gapSum;
            }
          }

          // Build hint
          result = {
            minWidth: minWidth,
            width: width,
            minHeight: minHeight,
            height: height
          };
        }
        return result;
      }
    }
  });
  qx.ui.layout.Atom.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.basic.Atom": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MExecutable": {
        "require": true
      },
      "qx.ui.form.IBooleanForm": {
        "require": true
      },
      "qx.ui.form.IExecutable": {
        "require": true
      },
      "qx.ui.form.IRadioItem": {
        "require": true
      },
      "qx.ui.form.RadioGroup": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * A toggle Button widget
   *
   * If the user presses the button by tapping on it pressing the enter or
   * space key, the button toggles between the pressed an not pressed states.
   */
  qx.Class.define("qx.ui.form.ToggleButton", {
    extend: qx.ui.basic.Atom,
    include: [qx.ui.core.MExecutable],
    implement: [qx.ui.form.IBooleanForm, qx.ui.form.IExecutable, qx.ui.form.IRadioItem],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Creates a ToggleButton.
     *
     * @param label {String} The text on the button.
     * @param icon {String} An URI to the icon of the button.
     */
    construct(label, icon) {
      qx.ui.basic.Atom.constructor.call(this, label, icon);

      // register pointer events
      this.addListener("pointerover", this._onPointerOver);
      this.addListener("pointerout", this._onPointerOut);
      this.addListener("pointerdown", this._onPointerDown);
      this.addListener("pointerup", this._onPointerUp);

      // register keyboard events
      this.addListener("keydown", this._onKeyDown);
      this.addListener("keyup", this._onKeyUp);

      // register execute event
      this.addListener("execute", this._onExecute, this);

      // ARIA attrs
      const contentEl = this.getContentElement();
      contentEl.setAttribute("role", "button");
      contentEl.setAttribute("aria-pressed", false);
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "toggle-button"
      },
      // overridden
      focusable: {
        refine: true,
        init: true
      },
      /** The value of the widget. True, if the widget is checked. */
      value: {
        check: "Boolean",
        nullable: true,
        event: "changeValue",
        apply: "_applyValue",
        init: false
      },
      /** The assigned qx.ui.form.RadioGroup which handles the switching between registered buttons. */
      group: {
        check: "qx.ui.form.RadioGroup",
        nullable: true,
        apply: "_applyGroup"
      },
      /**
       * Whether the button has a third state. Use this for tri-state checkboxes.
       *
       * When enabled, the value null of the property value stands for "undetermined",
       * while true is mapped to "enabled" and false to "disabled" as usual. Note
       * that the value property is set to false initially.
       *
       */
      triState: {
        check: "Boolean",
        apply: "_applyTriState",
        nullable: true,
        init: null
      },
      /**
       * The behavior when the button is executed (e.g. clicked). Only useful for tri-state checkboxes.
       * If "cycle" is set, the button cycles through the states "disabled", "undetermined", and "enabled"
       * If "toggle" is set, the button toggles between "disabled" and "enabled".
       */
      executeBehavior: {
        check: ["cycle", "toggle"],
        init: "toggle"
      },
      /**
       * Whether the field is read only
       */
      readOnly: {
        check: "Boolean",
        event: "changeReadOnly",
        init: false
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /** The assigned {@link qx.ui.form.RadioGroup} which handles the switching between registered buttons */
      _applyGroup(value, old) {
        if (old) {
          old.remove(this);
        }
        if (value) {
          value.add(this);
        }
      },
      /**
       * Changes the state of the button dependent on the checked value.
       *
       * @param value {Boolean} Current value
       * @param old {Boolean} Previous value
       */
      _applyValue(value, old) {
        value ? this.addState("checked") : this.removeState("checked");
        let ariaPressed = Boolean(value);
        if (this.isTriState()) {
          if (value === null) {
            ariaPressed = "mixed";
            this.addState("undetermined");
          } else if (old === null) {
            this.removeState("undetermined");
          }
        }
        this.getContentElement().setAttribute("aria-pressed", ariaPressed);
      },
      /**
       * Apply value property when triState property is modified.
       *
       * @param value {Boolean} Current value
       * @param old {Boolean} Previous value
       */
      _applyTriState(value, old) {
        this._applyValue(this.getValue());
      },
      /**
       * Handler for the execute event.
       *
       * @param e {qx.event.type.Event} The execute event.
       */
      _onExecute(e) {
        if (this.getReadOnly()) {
          return;
        }
        if (this.isTriState() && this.getExecuteBehavior() === "cycle") {
          let newValue;
          let currentValue = this.getValue();
          if (currentValue === null) {
            newValue = true;
          } else if (currentValue === true) {
            newValue = false;
          } else {
            newValue = null;
          }
          this.setValue(newValue);
        } else {
          this.toggleValue();
        }
      },
      /**
       * Listener method for "pointerover" event.
       * <ul>
       * <li>Adds state "hovered"</li>
       * <li>Removes "abandoned" and adds "pressed" state (if "abandoned" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onPointerOver(e) {
        if (e.getTarget() !== this) {
          return;
        }
        if (this.getReadOnly()) {
          return;
        }
        this.addState("hovered");
        if (this.hasState("abandoned")) {
          this.removeState("abandoned");
          this.addState("pressed");
        }
      },
      /**
       * Listener method for "pointerout" event.
       * <ul>
       * <li>Removes "hovered" state</li>
       * <li>Adds "abandoned" state (if "pressed" state is set)</li>
       * <li>Removes "pressed" state (if "pressed" state is set and button is not checked)
       * </ul>
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onPointerOut(e) {
        if (e.getTarget() !== this) {
          return;
        }
        this.removeState("hovered");
        if (this.hasState("pressed")) {
          if (!this.getValue()) {
            this.removeState("pressed");
          }
          this.addState("abandoned");
        }
      },
      /**
       * Listener method for "pointerdown" event.
       * <ul>
       * <li>Activates capturing</li>
       * <li>Removes "abandoned" state</li>
       * <li>Adds "pressed" state</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onPointerDown(e) {
        if (!e.isLeftPressed()) {
          return;
        }
        if (this.getReadOnly()) {
          return;
        }

        // Activate capturing if the button get a pointerout while
        // the button is pressed.
        this.capture();
        this.removeState("abandoned");
        this.addState("pressed");
        e.stopPropagation();
      },
      /**
       * Listener method for "pointerup" event.
       * <ul>
       * <li>Releases capturing</li>
       * <li>Removes "pressed" state (if not "abandoned" state is set and "pressed" state is set)</li>
       * <li>Removes "abandoned" state (if set)</li>
       * <li>Toggles {@link #value} (if state "abandoned" is not set and state "pressed" is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} pointer event
       */
      _onPointerUp(e) {
        this.releaseCapture();
        if (this.hasState("abandoned")) {
          this.removeState("abandoned");
        } else if (this.hasState("pressed")) {
          this.execute();
        }
        this.removeState("pressed");
        e.stopPropagation();
      },
      /**
       * Listener method for "keydown" event.<br/>
       * Removes "abandoned" and adds "pressed" state
       * for the keys "Enter" or "Space"
       *
       * @param e {Event} Key event
       */
      _onKeyDown(e) {
        if (this.getReadOnly()) {
          return;
        }
        switch (e.getKeyIdentifier()) {
          case "Enter":
          case "Space":
            this.removeState("abandoned");
            this.addState("pressed");
            e.stopPropagation();
        }
      },
      /**
       * Listener method for "keyup" event.<br/>
       * Removes "abandoned" and "pressed" state (if "pressed" state is set)
       * for the keys "Enter" or "Space". It also toggles the {@link #value} property.
       *
       * @param e {Event} Key event
       */
      _onKeyUp(e) {
        if (!this.hasState("pressed")) {
          return;
        }
        switch (e.getKeyIdentifier()) {
          case "Enter":
          case "Space":
            this.removeState("abandoned");
            this.execute();
            this.removeState("pressed");
            e.stopPropagation();
        }
      }
    }
  });
  qx.ui.form.ToggleButton.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-11.js.map?dt=1791845587542
qx.$$packageData['11'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
