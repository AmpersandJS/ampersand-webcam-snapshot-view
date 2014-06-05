var SnapshotView = require('../index');

document.addEventListener('DOMContentLoaded', function () {
    var view = new SnapshotView();
    view.render();
    document.querySelector('#videoOutput').appendChild(view.el);
    var snap = document.querySelector('#snap');
    var output = document.querySelector('#snapshots');

    snap.addEventListener('click', function () {
        var src = view.takeSnapshot();
        var img = document.createElement('img');
        img.setAttribute('src', src);
        output.appendChild(img);
    });
});
