/**
 * Registers caching service worker (SW).
 *
 * Service worker itself is auto-generated while building webpack bundle by
 * sw-precache (see packer).
 * https://github.com/GoogleChromeLabs/sw-precache/blob/master/demo/app/js/service-worker-registration.js
 *
 * @param {function} reloadToUpdateVersion
 */
export default function(reloadToUpdateVersion) {
  // register SW in prod environment only, since SW generator does not support
  // webpack dev server. in dev env you would typically disable cache anyway.
  if (process.env.NODE_ENV === 'production') {
    if ('serviceWorker' in navigator) {
      // delay registration until after the page has loaded, to ensure that
      // precaching requests do not degrade the first visit experience.
      window.addEventListener('load', async () => {
        // register service worker. it will only be installed if script is new.
        // if script was not changed (status 304, or status 200 but no changes),
        // installation will be skipped.
        const reg = await navigator.serviceWorker.register('sw-cache.js');

        reg.addEventListener('updatefound', () => {
          // a new service worker being installed (clean install or update)
          var newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (
              // new service worker is installed and cache is filled/updated
              newWorker.state == 'installed' &&
              // existing worker ensures it is update and not clean install
              navigator.serviceWorker.controller
            ) {
              // reload page to complete update process
              reloadToUpdateVersion();
            }
          });
        });
      });
    }
  }
}
