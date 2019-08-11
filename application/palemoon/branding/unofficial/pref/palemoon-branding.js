#filter substitution
#filter emptyLines
#include ../../shared/pref/preferences.inc
#include ../../shared/pref/uaoverrides.inc

pref("startup.homepage_override_url","http://www.powerprogress.org/");
pref("app.releaseNotesURL", "http://repo.powerprogress.org/");

// Updates disabled
pref("app.update.enabled", false);
pref("app.update.url", "");
