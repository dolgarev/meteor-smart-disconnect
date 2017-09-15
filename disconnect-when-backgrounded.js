var disconnectTimer = null;

// 60 seconds by default
var disconnectTime = (Meteor.settings && Meteor.settings.public && Meteor.settings.public.disconnectTimeSec || 60) * 1000;
var disconnectVoids = (Meteor.settings && Meteor.settings.public && Meteor.settings.public.disconnectVoids || []);

Meteor.startup(disconnectIfHidden);

document.addEventListener('visibilitychange', disconnectIfHidden);

if (Meteor.isCordova) {
    document.addEventListener('resume', function () { Meteor.reconnect(); });
    document.addEventListener('pause', function () { createDisconnectTimeout(); });
}

function disconnectIfHidden() {
    removeDisconnectTimeout();

    if (document.hidden) {
        let currentRouteName = null
        if (Package["kadira:flow-router"]) {
          currentRouteName = FlowRouter.getRouteName();
        } else if (Package["iron:router"]) {
          currentRouteName = Router.current().route.getName();
        }
        if (currentRouteName === null || disconnectVoids.indexOf(currentRouteName) === -1) {
          createDisconnectTimeout();
        }
    } else {
        Meteor.reconnect();
    }
}

function createDisconnectTimeout() {
    removeDisconnectTimeout();

    disconnectTimer = setTimeout(function () {
        Meteor.disconnect();
    }, disconnectTime);
}

function removeDisconnectTimeout() {
    if (disconnectTimer) {
        clearTimeout(disconnectTimer);
    }
}
