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

/**
 * The simple qooxdoo font theme.
 *
 * // Get the exact pixel value of 1rem
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        console.log(rootFontSize);
 */
qx.Theme.define("ville.cssuc.theme.middleman.Font", {
  fonts: {
       
    "default-family": {
      family: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji"]
    },

    "default-xs": {
      include: "default-family",
      size: Math.round(parseFloat(getComputedStyle(document.documentElement).fontSize)*.75),
      lineHeight: 1.4
    },
    
    "default-sm": {
      include: "default-family",
      size: Math.round(parseFloat(getComputedStyle(document.documentElement).fontSize)*.875),
      lineHeight: 1.45
    },

    "default-md": {
      include: "default-family",
      size: parseFloat(getComputedStyle(document.documentElement).fontSize),
      lineHeight: 1.55
    },

    "default-lg": {
      include: "default-family",
      size: Math.round(parseFloat(getComputedStyle(document.documentElement).fontSize)*1.125),
      lineHeight: 1.6
    },

    "default-xl": {
      include: "default-family",
      size: Math.round(parseFloat(getComputedStyle(document.documentElement).fontSize)*1.25),
      lineHeight: 1.65
    },
    
    default: {
      include: "default-md"
    },

    "button-label": {
      include: "default-sm",
      weight: "600"
    },

    "checkbox-label": {
      include: "default-sm"
    },

    "textfield-input": {
      include: "default-sm"
    },

    bold: {
      include: "default",
      bold: true
    },

    headline: {
      include: "default",
      size: 24
    },

    small: {
      include: "default",
      size: 11
    },

    monospace: {
      family: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      size: 11
    }
  }
});
