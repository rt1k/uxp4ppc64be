# -*- Mode: Java; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

var gTabsPane = {

  /*
   * Preferences:
   *
   * browser.link.open_newwindow
   * - determines where pages which would open in a new window are opened:
   *     1 opens such links in the most recent window or tab,
   *     2 opens such links in a new window,
   *     3 opens such links in a new tab
   * browser.tabs.loadInBackground
   * - true if display should switch to a new tab which has been opened from a
   *   link, false if display shouldn't switch
   * browser.tabs.warnOnClose
   * - true if when closing a window with multiple tabs the user is warned and
   *   allowed to cancel the action, false to just close the window
   * browser.tabs.warnOnOpen
   * - true if the user should be warned if he attempts to open a lot of tabs at
   *   once (e.g. a large folder of bookmarks), false otherwise
   * browser.taskbar.previews.enable
   * - true if tabs are to be shown in the Windows 7 taskbar
   */

  /**
   * Initialize any platform-specific UI.
   */
  init: function () {
#ifdef XP_WIN
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    try {
      let sysInfo = Cc["@mozilla.org/system-info;1"].
                    getService(Ci.nsIPropertyBag2);
      let ver = parseFloat(sysInfo.getProperty("version"));
      let showTabsInTaskbar = document.getElementById("showTabsInTaskbar");
      showTabsInTaskbar.hidden = ver < 6.1;
    } catch (ex) {}
#endif
    // Set the proper value in the newtab drop-down.
    gTabsPane.readNewtabUrl();
  },

  /**
   * Pale Moon: synchronize warnOnClose and warnOnCloseOtherTabs
   */
  syncWarnOnClose: function() {
    var warnOnClosePref = document.getElementById("browser.tabs.warnOnClose");
    var warnOnCloseOtherPref = document.getElementById("browser.tabs.warnOnCloseOtherTabs");
    warnOnCloseOtherPref.value = warnOnClosePref.value;
  },
  
  /**
   * Determines where a link which opens a new window will open.
   *
   * @returns |true| if such links should be opened in new tabs
   */
  readLinkTarget: function() {
    var openNewWindow = document.getElementById("browser.link.open_newwindow");
    return openNewWindow.value != 2;
  },

  /**
   * Determines where a link which opens a new window will open.
   *
   * @returns 2 if such links should be opened in new windows,
   *          3 if such links should be opened in new tabs
   */
  writeLinkTarget: function() {
    var linkTargeting = document.getElementById("linkTargeting");
    return linkTargeting.checked ? 3 : 2;
  },

  /**
   * Determines the value of the New Tab display drop-down based
   * on the value of browser.newtab.url.
   *
   * @returns the appropriate value of browser.newtab.choice
   */
  readNewtabUrl: function() {
    let newtabUrlPref = document.getElementById("browser.newtab.url");
    let newtabUrlSanitizedPref = document.getElementById("browser.newtab.myhome");
    let newtabUrlChoice = document.getElementById("browser.newtab.choice");
    let defaultStartupHomepage = Services.prefs.getDefaultBranch("browser.")
                                  .getComplexValue("startup.homepage",
                                    Components.interfaces.nsIPrefLocalizedString).data;
    switch (newtabUrlPref.value) {
      case "about:logopage": 
        newtabUrlChoice.value = 1;
        break;
      case defaultStartupHomepage:
        newtabUrlChoice.value = 2;
        break;
      case newtabUrlSanitizedPref.value:
        newtabUrlChoice.value = 3;
        break;
      case "about:newtab":
        newtabUrlChoice.value = 4;
        break;
      default: // Custom URL entered.
        document.getElementById("newtabPageCustom").hidden = false;
        newtabUrlChoice.value = 0;
        // We need this to consider instantApply.
        this.newtabPageCustom = newtabUrlPref.value;
    }
  }
};
