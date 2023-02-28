importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
  );

workbox.loadModule('workbox-background-sync');

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST );

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;
const { BackgroundSyncPlugin } = workbox.backgroundSync;


const cacheNetworkFirst = [
    '/api/auth/renew',
    '/api/events',
];

registerRoute(
    ({ request, url }) => {
        return !!cacheNetworkFirst.includes( url.pathname );
    },
    new NetworkFirst()
)

const cacheFirstNetwork = [
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css'
];

registerRoute(
    ({ request, url }) => {

        return cacheFirstNetwork.includes( url.href );

    },
    new CacheFirst()
)



// Offline post
const bgSyncPlugin = new BackgroundSyncPlugin('offlinePost', {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

registerRoute(
    ({ url }) => url.pathname.includes('/api/events'),
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    'POST'
)

registerRoute(
    ({ url }) => url.pathname.includes('/api/events'),
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    'PUT'
)

registerRoute(
    ({ url }) => url.pathname.includes('/api/events'),
    new NetworkOnly({
        plugins: [bgSyncPlugin],
    }),
    'DELETE'
)