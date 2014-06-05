var SnapshotView = require('./index');

document.addEventListener('DOMContentLoaded', function () {
    var view = new SnapshotView();
    view.render();
    document.body.appendChild(view.el);
    view.on('snapshot', console.log.bind(console, 'Got data:'));
});
