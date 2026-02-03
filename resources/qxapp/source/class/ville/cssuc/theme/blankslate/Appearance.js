/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.

   Authors:
   * Martin Wittemann (martinwittemann)

************************************************************************* */

/* ************************************************************************


************************************************************************* */

/**
 * The blankslate ville appearance theme.
 */
qx.Theme.define("ville.cssuc.theme.blankslate.Appearance", {

  appearances: {
    /*
    ---------------------------------------------------------------------------
      CORE
    ---------------------------------------------------------------------------
    */

    widget: {},

    label: {},

    image: {},

    atom: {},
    "atom/label": "label",
    "atom/icon": "image",

   root: {},

    popup: {},

    tooltip: "popup",

    "tooltip/atom": "atom",

    "tooltip-error": "tooltip",

    "tooltip-error/atom": "atom",

    iframe: {},

    "move-frame": {},

    "resize-frame": "move-frame",

    "dragdrop-cursor": {},

    /*
    ---------------------------------------------------------------------------
      SLIDEBAR
    ---------------------------------------------------------------------------
    */

    slidebar: {},
    "slidebar/scrollpane": {},
    "slidebar/content": {},

    "slidebar/button-forward": "button",

    "slidebar/button-backward": "button",

    /*
    ---------------------------------------------------------------------------
      TABLE
    ---------------------------------------------------------------------------
    */

    table: "widget",

    "table/statusbar": {},

    "table/column-button": "button",

    "table-column-reset-button": "menu-button",

    "table-scroller/scrollbar-x": "scrollbar",
    "table-scroller/scrollbar-y": "scrollbar",

    "table-scroller": "widget",

    "table-scroller/header": {},

    "table-scroller/pane": {},

    "table-scroller/focus-indicator": {},

    "table-scroller/resize-line": {},

    "table-header-cell": "atom",

    "table-header-cell/icon": "atom/icon",

    "table-header-cell/sort-icon": {},

    "table-editor-textfield": "textfield",

    "table-editor-selectbox": "selectbox",

    "table-editor-combobox": "combobox",

    "progressive-table-header": {},

    "progressive-table-header-cell": {},

    /*
    ---------------------------------------------------------------------------
      TREEVIRTUAL
    ---------------------------------------------------------------------------
    */

    treevirtual: "textfield",

    "treevirtual-folder": {},

    "treevirtual-file": "treevirtual-folder",

    "treevirtual-line": {},

    "treevirtual-contract": {},

    "treevirtual-expand": {},

    "treevirtual-only-contract": {},

    "treevirtual-only-expand": {},

    "treevirtual-start-contract": {},

    "treevirtual-start-expand": {},

    "treevirtual-end-contract": {},

    "treevirtual-end-expand": {},

    "treevirtual-cross-contract": {},

    "treevirtual-cross-expand": {},

    "treevirtual-end": {},

    "treevirtual-cross": {},

    "treevirtual-node-editor-textfield": "textfield",

    /*
    ---------------------------------------------------------------------------
      RESIZER
    ---------------------------------------------------------------------------
    */

    resizer: {},

    /*
    ---------------------------------------------------------------------------
      SPLITPANE
    ---------------------------------------------------------------------------
    */

    splitpane: {},

    "splitpane/splitter": {},

    "splitpane/splitter/knob": {},

    "splitpane/slider": {},

    /*
    ---------------------------------------------------------------------------
      MENU
    ---------------------------------------------------------------------------
    */

    menu: {},

    "menu/slidebar": "menu-slidebar",

    "menu-slidebar": "widget",

    "menu-slidebar-button": {},

    "menu-slidebar/button-backward": "menu-slidebar-button",

    "menu-slidebar/button-forward": "menu-slidebar-button",

    "menu-separator": {},

    "menu-button": "atom",

    "menu-button/icon": "image",

    "menu-button/label": "label",

    "menu-button/shortcut": "label",

    "menu-button/arrow": "image",

    "menu-checkbox": "menu-button",

    "menu-radiobutton": "menu-button",

    /*
    ---------------------------------------------------------------------------
      MENU BAR
    ---------------------------------------------------------------------------
    */

    menubar: {},

    "menubar-button": {},

    /*
    ---------------------------------------------------------------------------
      VIRTUAL WIDGETS
    ---------------------------------------------------------------------------
    */
    "virtual-list": "list",
    "virtual-list/row-layer": "row-layer",

    "row-layer": "widget",
    "column-layer": "widget",

    "virtual-background-span": "widget",

    "virtual-list-header-cell": "atom",

    "group-item": "label",

    "virtual-selectbox": "selectbox",
    "virtual-selectbox/dropdown": "popup",
    "virtual-selectbox/dropdown/list": "virtual-list",

    "virtual-combobox": "combobox",
    "virtual-combobox/dropdown": "popup",
    "virtual-combobox/dropdown/list": "virtual-list",

    "virtual-tree": "tree",

    "virtual-tree-folder": "tree-folder",
    "virtual-tree-file": "tree-file",

    cell: {},

    "cell-string": "cell",
    "cell-number": "cell",

    "cell-image": "cell",
    "cell-boolean": "cell",
    "cell-atom": "cell",
    "cell-date": "cell",
    "cell-html": "cell",

    /*
    ---------------------------------------------------------------------------
      SCROLLBAR
    ---------------------------------------------------------------------------
    */

    scrollbar: {},
    "scrollbar/slider": {},

    "scrollbar/slider/knob": {},

    "scrollbar/button": "button",

    "scrollbar/button-begin": "scrollbar/button",
    "scrollbar/button-end": "scrollbar/button",

    /*
    ---------------------------------------------------------------------------
      SCROLLAREA
    ---------------------------------------------------------------------------
    */

    "scrollarea/corner": {},

    scrollarea: "widget",
    "scrollarea/pane": "widget",
    "scrollarea/scrollbar-x": "scrollbar",
    "scrollarea/scrollbar-y": "scrollbar",

    /*
    ---------------------------------------------------------------------------
      TEXT FIELD
    ---------------------------------------------------------------------------
    */
    textfield: {},

    textarea: "textfield",

    /*
    ---------------------------------------------------------------------------
      RADIO BUTTON
    ---------------------------------------------------------------------------
    */
    "radiobutton/icon": {},

    radiobutton: {},

    /*
    ---------------------------------------------------------------------------
      FORM
    ---------------------------------------------------------------------------
    */
    "form-renderer-label": "label",

    /*
    ---------------------------------------------------------------------------
      CHECK BOX
    ---------------------------------------------------------------------------
    */
    checkbox: "atom",

    "checkbox/icon": {},

    /*
    ---------------------------------------------------------------------------
      SPINNER
    ---------------------------------------------------------------------------
    */

    spinner: {},

    "spinner/textfield": "textfield",

    "spinner/upbutton": "combobox/button",

    "spinner/downbutton": "combobox/button",

    /*
    ---------------------------------------------------------------------------
      SELECTBOX
    ---------------------------------------------------------------------------
    */

    selectbox: "button-frame",

    "selectbox/atom": "atom",
    "selectbox/popup": "popup",
    "selectbox/list": "list",

    "selectbox/arrow": "button-frame",

    /*
    ---------------------------------------------------------------------------
      COMBO BOX
    ---------------------------------------------------------------------------
    */

    combobox: {},

    "combobox/button": "button-frame",

    "combobox/popup": "popup",
    "combobox/list": "list",

    "combobox/textfield": "textfield",

    /*
    ---------------------------------------------------------------------------
      DATEFIELD
    ---------------------------------------------------------------------------
    */

    datefield: "textfield",

    "datefield/button": "combobox/button",

    "datefield/textfield": "textfield",

    "datefield/list": "datechooser",

    /*
    ---------------------------------------------------------------------------
      LIST
    ---------------------------------------------------------------------------
    */

    list: "textfield",

    listitem: "atom",

    /*
    ---------------------------------------------------------------------------
      SLIDER
    ---------------------------------------------------------------------------
    */

    slider: {},

    "slider/knob": "scrollbar/slider/knob",

    /*
    ---------------------------------------------------------------------------
      BUTTON
    ---------------------------------------------------------------------------
    */

    "button-frame": "atom",

    "button-frame/label": "atom/label",

    "button": "button-frame",

    "toggle-button": "button",

    "hover-button": "button",

    menubutton: "button",

    /*
    ---------------------------------------------------------------------------
      SPLIT BUTTON
    ---------------------------------------------------------------------------
    */
    splitbutton: {},

    "splitbutton/button": "atom",

    "splitbutton/arrow": {},

    /*
    ---------------------------------------------------------------------------
      GROUP BOX
    ---------------------------------------------------------------------------
    */

    groupbox: {},

    "groupbox/legend": "atom",

    "groupbox/frame": {},

    "check-groupbox": "groupbox",

    "check-groupbox/legend": "checkbox",

    "radio-groupbox": "groupbox",

    "radio-groupbox/legend": "radiobutton",

    /*
    ---------------------------------------------------------------------------
      TREE
    ---------------------------------------------------------------------------
    */

    "tree-folder/open": "image",

    "tree-folder": {},

    "tree-folder/icon": "image",

    "tree-folder/label": {},

    "tree-file": "tree-folder",

    tree: "list",

    /*
    ---------------------------------------------------------------------------
      WINDOW
    ---------------------------------------------------------------------------
    */

    window: {},

    "window-resize-frame": "resize-frame",

    "window/pane": {},

    "window/captionbar": {},

    "window/icon": {},

    "window/title": {},

    "window/minimize-button": "button",

    "window/restore-button": "button",

    "window/maximize-button": "button",

    "window/close-button": "button",

    "window/statusbar": {},

    "window/statusbar-text": "label",

    /*
    ---------------------------------------------------------------------------
      DATE CHOOSER
    ---------------------------------------------------------------------------
    */

    datechooser: {},

    "datechooser/navigation-bar": {},

    "datechooser/last-year-button-tooltip": "tooltip",
    "datechooser/last-month-button-tooltip": "tooltip",
    "datechooser/next-year-button-tooltip": "tooltip",
    "datechooser/next-month-button-tooltip": "tooltip",

    "datechooser/last-year-button": "datechooser/button",
    "datechooser/last-month-button": "datechooser/button",
    "datechooser/next-year-button": "datechooser/button",
    "datechooser/next-month-button": "datechooser/button",
    "datechooser/button/icon": {},

    "datechooser/button": {},

    "datechooser/month-year-label": {},

    "datechooser/date-pane": {},

    "datechooser/weekday": {},

    "datechooser/day": {},

    "datechooser/week": {},

    /*
    ---------------------------------------------------------------------------
      PROGRESSBAR
    ---------------------------------------------------------------------------
    */
    progressbar: {},

    "progressbar/progress": {},

    /*
    ---------------------------------------------------------------------------
      TOOLBAR
    ---------------------------------------------------------------------------
    */

    toolbar: {},

    "toolbar/part": {},

    "toolbar/part/container": {},
    "toolbar/part/handle": {},

    "toolbar-separator": {},

    "toolbar-button": "atom",

    "toolbar-menubutton": "toolbar-button",

    "toolbar-menubutton/arrow": "image",
    "toolbar-splitbutton": {},
    "toolbar-splitbutton/button": "toolbar-button",

    "toolbar-splitbutton/arrow": "toolbar-button",

    /*
    ---------------------------------------------------------------------------
      TABVIEW
    ---------------------------------------------------------------------------
    */

    tabview: {},

    "tabview/bar": "slidebar",

    "tabview/bar/button-forward": "button",

    "tabview/bar/button-backward": "button",

    "tabview/pane": {},

    "tabview-page": "widget",

    "tabview-page/button": "button",

    "tabview-page/button/label": "label",

    "tabview-page/button/icon": "image",
    "tabview-page/button/close-button": "atom",


    /*
    ---------------------------------------------------------------------------
      COLOR POPUP
    ---------------------------------------------------------------------------
    */

    colorpopup: "popup",

    "colorpopup/field": {},

    "colorpopup/selector-button": "button",
    "colorpopup/auto-button": "button",

    "colorpopup/preview-pane": "groupbox",

    "colorpopup/current-preview": {},

    "colorpopup/selected-preview": {},

    "colorpopup/colorselector-okbutton": "button",

    "colorpopup/colorselector-cancelbutton": "button",

    /*
    ---------------------------------------------------------------------------
      COLOR SELECTOR
    ---------------------------------------------------------------------------
    */

    colorselector: "widget",
    "colorselector/control-bar": "widget",
    "colorselector/visual-pane": "groupbox",
    "colorselector/control-pane": "widget",
    "colorselector/preset-grid": "widget",

    "colorselector/colorbucket": {},

    "colorselector/preset-field-set": "groupbox",
    "colorselector/input-field-set": "groupbox",

    "colorselector/preview-field-set": "groupbox",

    "colorselector/hex-field-composite": "widget",
    "colorselector/hex-field": "textfield",

    "colorselector/rgb-spinner-composite": "widget",
    "colorselector/rgb-spinner-red": "spinner",
    "colorselector/rgb-spinner-green": "spinner",
    "colorselector/rgb-spinner-blue": "spinner",

    "colorselector/hsb-spinner-composite": "widget",
    "colorselector/hsb-spinner-hue": "spinner",
    "colorselector/hsb-spinner-saturation": "spinner",
    "colorselector/hsb-spinner-brightness": "spinner",

    "colorselector/preview-content-old": {},

    "colorselector/preview-content-new": {},

    "colorselector/hue-saturation-field": {},

    "colorselector/brightness-field": {},

    "colorselector/hue-saturation-pane": "widget",
    "colorselector/hue-saturation-handle": "widget",
    "colorselector/brightness-pane": "widget",
    "colorselector/brightness-handle": "widget",

    /*
    ---------------------------------------------------------------------------
      APPLICATION
    ---------------------------------------------------------------------------
    */

   "app-header" : {},

    "app-header-label": {},

    "app-splitpane": "splitpane",

    /*
      --------------------
      VIRTUAL SELECTBOX 
      --------------------
    */

    "list-search-highlight": {}
  }
});
