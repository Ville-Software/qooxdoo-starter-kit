/* ************************************************************************


************************************************************************ */

/**
 * A tab view is a multi page view where only one page is visible
 * at each moment. It is possible to switch the pages using the
 * buttons rendered by each page.
 *
 * Note that prior to v6.0, when changing the currently selected tab via code
 * (ie changing the selection property) TabView would automatically set the
 * focus to that tab; this is undesirable (and inconsistent with other parts
 * of the framework) and is no longer done automatically.
 *
 * @external(mantine/core/styles/Tabs.css)
 * @childControl bar {ville.ui.core.Box} slidebar for all tab buttons
 * @childControl pane {qx.ui.container.Stack} stack container to show one tab page
 */
qx.Class.define("ville.ui.tabview.TabView", {
  
  extend: ville.ui.core.Widget,
  implement: qx.ui.core.ISingleSelection,
  include: qx.ui.core.MContentPadding,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param barPosition {String} Initial bar position ({@link #barPosition})
   */
  construct(barPosition, variant) {

    super();
    
    this.setCssUtilityClass("m_89d60db1 mantine-Tabs-root");

    if (barPosition == "bottom") {
      this._createChildControl("pane");
      this._createChildControl("bar");
    } else {
      this._createChildControl("bar");
      this._createChildControl("pane");
    }

    // Create manager
    var mgr = (this.__radioGroup = this._createRadioGroupInstance());
    mgr.setWrap(false);
    mgr.addListener("changeSelection", this._onChangeSelection, this);

    // Initialize bar position
    if (barPosition != null) {
      this.setBarPosition(barPosition);
    } else {
      this.initBarPosition();
    }

    if (variant != null) {
      this.setVariant(variant);
    } else {
      this.initVariant();
    }

    // ARIA attrs
    //this.getContentElement().setAttribute("role", "tablist");
  },

  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events: {
    /** Fires after the selection was modified */
    changeSelection: "qx.event.type.Data",

    /** Fires after the value was modified */
    changeValue: "qx.event.type.Data"
  },

  statics: {

    barVariantClasses: {
      default: "m_576c9d4",
      outline: "m_6772fbd5",
      pills: ""
    }

  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties: {

    variant: {
      init: "default",
      check: ["default", "outline", "pills"],
      apply: "_applyVariant",
      themeable: true,
      event: "changeVariant"
    },

    /**
     * This property defines on which side of the TabView the bar should be positioned.
     */
    barPosition: {
      check: ["left", "right", "top", "bottom"],
      init: "top",
      apply: "_applyBarPosition",
      event: "changeBarPosition"
    }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    /** @type {qx.ui.form.RadioGroup} instance containing the radio group */
    __radioGroup: null,

    /**
     * setValue implements part of the {@link qx.ui.form.IField} interface.
     *
     * @param item {null|ville.ui.tabview.Page} Page to set as selected value.
     * @returns {null|TypeError} The status of this operation.
     */
    setValue(item) {
      if (null === item) {
        this.resetSelection();
        return null;
      }

      if (item instanceof ville.ui.tabview.Page) {
        this.setSelection([item]);
        return null;
      } else {
        return new TypeError(
          "Given argument is not null or a {ville.ui.tabview.Page}."
        );
      }
    },

    /**
     * getValue implements part of the {@link qx.ui.form.IField} interface.
     *
     * @returns {null|qx.ui.tabview.Page} The currently selected page or null if there is none.
     */
    getValue() {
      var pages = this.getSelection();
      if (pages.length) {
        return pages[0];
      } else {
        return null;
      }
    },

    /**
     * resetValue implements part of the {@link qx.ui.form.IField} interface.
     */
    resetValue() {
      this.resetSelection();
    },

    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */

    // overridden
    _createContentElement() {
      return new qx.html.Element("div");
    },

    // overridde
    _createChildControlImpl(id, hash) {
      var control;

      switch (id) {
        case "bar":
          control = new ville.ui.core.Box();
          control.setCssUtilityClass("m_89d33d6d mantine-Tabs-list");
          control.setAttribute("role", "tablist");
          this._add(control);
          break;

        case "pane":
          control = new ville.ui.layout.Stack();
          this._add(control);
          break;
      }

      return control || super._createChildControlImpl(id);
    },

    /**
     * Creates the radio group manager instance.
     *
     * Allows override customizations of the instance
     *
     * @return {qx.ui.form.RadioGroup}
     */
    _createRadioGroupInstance() {
      return new qx.ui.form.RadioGroup();
    },

    /**
     * Returns the element, to which the content padding should be applied.
     *
     * @return {qx.ui.core.Widget} The content padding target.
     */
    _getContentPaddingTarget() {
      return this.getChildControl("pane");
    },

    /*
    ---------------------------------------------------------------------------
      CHILDREN HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * Adds a page to the tabview including its needed button
     * (contained in the page).
     *
     * @param page {ville.ui.tabview.Page} The page which should be added.
     */
    add(page) {
      if (qx.core.Environment.get("qx.debug")) {
        if (!(page instanceof ville.ui.tabview.Page)) {
          throw new Error("Incompatible child for TabView: " + page);
        }
      }

      var button = page.getButton();
      var bar = this.getChildControl("bar");
      var pane = this.getChildControl("pane");

      // Set button's variant value to match tabview
      button.setVariant(this.getVariant());
      button.setBarPosition(this.getBarPosition());
      // Bind the button's variant value to the TabView's variant value
      this.bind("variant", button, "variant");
      this.bind("barPosition", button, "barPosition");

      // Exclude page
      page.exclude();

      // Add button and page
      bar.add(button);
      pane.add(page);

      // Register button
      this.__radioGroup.add(button);

      // Add state to page
      //page.addState(this.__barPositionToState[this.getBarPosition()]);

      //this.__updateFirstLastTabStates();

      page.addListener("close", this._onPageClose, this);
      page.addListener(
        "changeTabVisibility",
        this.__onPageChangeTabVisibility,
        this
      );
    },

    /**
     * Adds a page to the tabview including its needed button
     * (contained in the page).
     *
     * @param page {qx.ui.tabview.Page} The page which should be added.
     * @param index {Integer?null} Optional position where to add the page.
     */
    addAt(page, index) {
      if (qx.core.Environment.get("qx.debug")) {
        if (!(page instanceof ville.ui.tabview.Page)) {
          throw new Error("Incompatible child for TabView: " + page);
        }
      }
      var children = this.getChildren();
      if (!(index == null) && index > children.length) {
        throw new Error("Index should be less than : " + children.length);
      }

      if (index == null) {
        index = children.length;
      }

      var button = page.getButton();
      var bar = this.getChildControl("bar");
      var pane = this.getChildControl("pane");

      // Set button's variant value to match tabview
      button.setVariant(this.getVariant());
      button.setBarPosition(this.getBarPosition());
      // Bind the button's variant value to the TabView's variant value
      this.bind("variant", button, "variant");
      this.bind("barPosition", button, "barPosition");

      // Exclude page
      page.exclude();

      // Add button and page
      bar.addAt(button, index);
      pane.addAt(page, index);

      // Register button
      this.__radioGroup.add(button);

      // Add state to page
      //page.addState(this.__barPositionToState[this.getBarPosition()]);

      // Update states
      //this.__updateFirstLastTabStates();

      page.addListener("close", this._onPageClose, this);
      page.addListener(
        "changeTabVisibility",
        this.__onPageChangeTabVisibility,
        this
      );
    },

    /**
     * Removes a page (and its corresponding button) from the TabView.
     *
     * @param page {qx.ui.tabview.Page} The page to be removed.
     */
    remove(page) {
      var pane = this.getChildControl("pane");
      var bar = this.getChildControl("bar");
      var button = page.getButton();
      var children = pane.getChildren();

      // Try to select next page
      if (this.getSelection()[0] == page) {
        var index = children.indexOf(page);
        if (index == 0) {
          if (children[1]) {
            this.setSelection([children[1]]);
          } else {
            this.resetSelection();
          }
        } else {
          this.setSelection([children[index - 1]]);
        }
      }

      // Remove the button and page
      bar.remove(button);
      pane.remove(page);

      // Remove the button from the radio group
      this.__radioGroup.remove(button);

      // Remove state from page
      //page.removeState(this.__barPositionToState[this.getBarPosition()]);

      //this.__updateFirstLastTabStates();

      page.removeListener("close", this._onPageClose, this);
      page.removeListener(
        "changeTabVisibility",
        this.__onPageChangeTabVisibility,
        this
      );
    },

    /**
     * Returns TabView's children widgets.
     *
     * @return {qx.ui.tabview.Page[]} List of children.
     */
    getChildren() {
      return this.getChildControl("pane").getChildren();
    },

    /**
     * Returns the position of the given page in the TabView.
     *
     * @param page {qx.ui.tabview.Page} The page to query for.
     * @return {Integer} Position of the page in the TabView.
     */
    indexOf(page) {
      return this.getChildControl("pane").indexOf(page);
    },

    /**
     * Returns the radio group manager.
     *
     * @return {qx.ui.form.RadioGroup} the radio group.
     */
    getRadioGroup() {
      return this.__radioGroup;
    },

    /*
    ---------------------------------------------------------------------------
      APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    /** @type {Map} Maps the bar position to an appearance state */
    __barPositionToState: null,

    /**
     * Apply method for the placeBarOnTop-Property.
     *
     * Passes the desired value to the layout of the tabview so
     * that the layout can handle it.
     * It also sets the states to all buttons so they know the
     * position of the bar.
     *
     * @param value {Boolean} The new value.
     * @param old {Boolean} The old value.
     */
    _applyBarPosition(value, old) {
      var bar = this.getChildControl("bar");

      switch (value) {
        case "top":
          this.setAttribute("data-orientation", "horizontal");
          this.removeAttribute("data-inverted");
          this.removeAttribute("data-placement");
          bar.setAttribute("data-orientation", "horizontal");
          bar.removeAttribute("data-inverted");
          bar.removeAttribute("data-placement");

          break;

        case "bottom":
          this.setAttributes({
            "data-orientation": "horizontal",
            "data-inverted": "true"
          });
          this.removeAttribute("data-placement");
          bar.setAttributes({
            "data-orientation": "horizontal",
            "data-inverted": "true"
          });
          bar.removeAttribute("data-placement");

          break;

        case "left":
          this.setAttributes({
            "data-orientation": "vertical",
            "data-placement": "left"
          });
          this.removeAttribute("data-inverted");
          bar.setAttributes({
            "data-orientation": "vertical",
            "data-placement": "left"
          });
          bar.removeAttribute("data-inverted");
          break;

        case "right":
          this.setAttributes({
            "data-orientation": "vertical",
            "data-placement": "right"
          });
          this.removeAttribute("data-inverted");
          bar.setAttributes({
            "data-orientation": "vertical",
            "data-placement": "right"
          });
          bar.removeAttribute("data-inverted");
          break;
      }
    },

    // property apply
    _applyVariant(value, old) {
      if (value) {
        this.setAttribute("data-variant", value);
        var bar = this.getChildControl("bar");
        bar.setAttribute("data-variant", value);
        if (old)
          bar.removeClass(this.constructor.barVariantClasses[old]);

        bar.addClass(this.constructor.barVariantClasses[value]);

      }
    },

    /*
    ---------------------------------------------------------------------------
      SELECTION API
    ---------------------------------------------------------------------------
    */

    /**
     * Returns an array of currently selected items.
     *
     * Note: The result is only a set of selected items, so the order can
     * differ from the sequence in which the items were added.
     *
     * @return {ville.ui.tabview.Page[]} List of items.
     */
    getSelection() {
      var buttons = this.__radioGroup.getSelection();
      var result = [];

      for (var i = 0; i < buttons.length; i++) {
        result.push(buttons[i].getUserData("page"));
      }

      return result;
    },

    /**
     * Replaces current selection with the given items.
     *
     * @param items {ville.ui.tabview.Page[]} Items to select.
     * @throws {Error} if one of the items is not a child element and if
     *    items contains more than one elements.
     */
    setSelection(items) {
      var buttons = [];

      for (var i = 0; i < items.length; i++) {
        buttons.push(items[i].getChildControl("button"));
      }
      this.__radioGroup.setSelection(buttons);
    },

    /**
     * Clears the whole selection at once.
     */
    resetSelection() {
      this.__radioGroup.resetSelection();
    },

    /**
     * Detects whether the given item is currently selected.
     *
     * @param item {qx.ui.tabview.Page} Any valid selectable item.
     * @return {Boolean} Whether the item is selected.
     * @throws {Error} if one of the items is not a child element.
     */
    isSelected(item) {
      var button = item.getChildControl("button");
      return this.__radioGroup.isSelected(button);
    },

    /**
     * Whether the selection is empty.
     *
     * @return {Boolean} Whether the selection is empty.
     */
    isSelectionEmpty() {
      return this.__radioGroup.isSelectionEmpty();
    },

    /**
     * Returns all elements which are selectable.
     *
     * @return {ville.ui.tabview.Page[]} The contained items.
     * @param all {Boolean} true for all selectables, false for the
     *   selectables the user can interactively select
     */
    getSelectables(all) {
      var buttons = this.__radioGroup.getSelectables(all);
      var result = [];

      for (var i = 0; i < buttons.length; i++) {
        result.push(buttons[i].getUserData("page"));
      }

      return result;
    },

    /**
     * Event handler for <code>changeSelection</code>.
     *
     * @param e {qx.event.type.Data} Data event.
     */
    _onChangeSelection(e) {
      var pane = this.getChildControl("pane");
      var button = e.getData()[0];
      var oldButton = e.getOldData()[0];
      var value = [];
      var old = [];

      if (button) {
        value = [button.getUserData("page")];
        pane.setSelection(value);
        this.scrollChildIntoView(button, null, null, false);
      } else {
        pane.resetSelection();
      }

      if (oldButton) {
        old = [oldButton.getUserData("page")];
      }

      this.fireDataEvent("changeSelection", value, old);
    },

    /**
     * Event handler for <code>beforeChangeSelection</code>.
     *
     * @param e {qx.event.type.Event} Data event.
     */
    _onBeforeChangeSelection(e) {
      if (
        !this.fireNonBubblingEvent(
          "beforeChangeSelection",
          qx.event.type.Event,
          [false, true]
        )
      ) {
        e.preventDefault();
      }
    },

    /*
    ---------------------------------------------------------------------------
      EVENT LISTENERS
    ---------------------------------------------------------------------------
    */

    /**
     * Event handler for the change of the selected item of the radio group.
     * @param e {qx.event.type.Data} The data event
     */
    _onRadioChangeSelection(e) {
      var element = e.getData()[0];
      if (element) {
        this.setSelection([element.getUserData("page")]);
      } else {
        this.resetSelection();
      }
    },

    /**
     * Removes the Page widget on which the close button was tapped.
     *
     * @param e {qx.event.type.Pointer} pointer event
     */
    _onPageClose(e) {
      // reset the old close button states, before remove page
      // see http://bugzilla.qooxdoo.org/show_bug.cgi?id=3763 for details
      var page = e.getTarget();
      var closeButton = page.getButton().getChildControl("close-button");
      closeButton.reset();

      this.remove(page);
    },

    __onPageChangeTabVisibility() {
      this.__updateFirstLastTabStates();
    },

    __updateFirstLastTabStates() {
      let firstPage = null;
      let lastPage = null;

      for (let pages = this.getChildren(), i = 0; i < pages.length; i++) {
        let page = pages[i];
        if (page.getTabVisibility() == "visible") {
          if (!firstPage) {
            firstPage = page;
          }
          lastPage = page;
        }
        page.removeState("firstTab");
        page.removeState("lastTab");
      }

      firstPage?.addState("firstTab");
      lastPage?.addState("lastTab");
    }
  },

  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct() {
    this._disposeObjects("__radioGroup");
    this.__barPositionToState = null;
  }
});
