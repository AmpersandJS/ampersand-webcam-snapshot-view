var AmpersandView = require('ampersand-view');
var getUserMedia = require('getusermedia');
var attachMediaStream = require('attachmediastream');

var template = [
    '<div>',
    '    <div role="video-wrap">',
    '        <video role="video"></video>',
    '        <div role="video-overlay" class="video-overlay">',
    '            <div role="video-overlay-inner" class="video-overlay-inner"></div>',
    '        </div>',
    '    </div>',
    '</div>'
].join('\n');

module.exports = AmpersandView.extend({
    template: template,
    events: {
        'click [role=snap]': 'takeSnapshot'
    },
    render: function () {
        this.renderWithTemplate({});
        var videoEl = this.videoEl = this.getByRole('video');
        this.canvasEl = document.createElement('canvas');
        videoEl.addEventListener('canplay', this.videoReady.bind(this));

        getUserMedia({video: true, audio: false }, function (err, video) {
            if (err) return this.trigger('error', err);

            this.videoStream = video;

            attachMediaStream(video, videoEl, {
                mirror: true,
            });
        }.bind(this));

        return this;
    },
    styleVideo: function () {
        var wrap = this.getByRole('video-wrap');
        var overlay = this.getByRole('video-overlay');

        wrap.style.position = 'relative';
        wrap.style.display = 'inline-block';

        overlay.style.position = 'absolute';
        overlay.style.top = overlay.style.bottom = overlay.style.left = overlay.style.right = '0';

        var crop = 0.8 * this.videoEl.videoHeight;
        var topBorder = ((this.videoEl.videoHeight - crop) / 2);
        var leftBorder = ((this.videoEl.videoWidth - crop) / 2);

        this.videoCrop = {
            top: topBorder,
            left: leftBorder,
            width: crop,
            height: crop
        };

        var renderedBoundingRect = this.videoEl.getBoundingClientRect();
        var renderedWidthRatio = renderedBoundingRect.width / this.videoEl.videoHeight;
        var renderedHeightRatio = renderedBoundingRect.height / this.videoEl.videoHeight;

        overlay.style.borderStyle = 'solid';
        overlay.style.borderColor = 'rgba(255,255,255,0.5)';
        overlay.style.borderWidth = [
            topBorder*renderedWidthRatio + 'px',
            leftBorder*renderedHeightRatio + 'px'
        ].join(' ');
    },
    videoReady: function () {
        this.styleVideo();
        if (this.videoEl.videoWidth > 0) {
            this.canvasEl.setAttribute('width', Math.min(this.videoCrop.width, 500));
            this.canvasEl.setAttribute('height', Math.min(this.videoCrop.width, 500));
        }
    },
    takeSnapshot: function () {
        var context = this.canvasEl.getContext('2d');
        var w = this.canvasEl.getAttribute('width');
        var h = this.canvasEl.getAttribute('height');

        context.fillRect(0, 0, w, h);
        context.translate(w/2, h/2);
        context.scale(-1, 1);
        context.translate(w/-2, h/-2);
        context.drawImage(
            this.videoEl,
            this.videoCrop.left, this.videoCrop.top, this.videoCrop.width, this.videoCrop.height,
            0, 0, w, h
        );
        return this.canvasEl.toDataURL('image/jpg');
    },
    remove: function () {
        AmpersandView.prototype.remove.apply(this);
        this.videoStream.stop();
    }
});
