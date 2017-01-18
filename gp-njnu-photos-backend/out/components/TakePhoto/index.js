import React from 'react';
import { Map } from 'immutable';
import css from './style.less';

const _default = class extends React.Component {

    constructor(props) {
        super(props);
        this.clickBtn = this.clickBtn.bind(this);
        this.videoPlay = this.videoPlay.bind(this);
    }

    videoPlay() {
        const { canvas, video, img } = this;
        // img.width=video.clientWidth;
        // img.height=video.clientHeight;
    }

    componentDidMount() {
        const { canvas, video, img } = this;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        navigator.getUserMedia && navigator.getUserMedia({ video: { facingMode: "user" } }, stream => {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, console.error);
    }

    clickBtn() {
        const { onPhotoCallback } = this.props;
        const { canvas, video } = this;
        const ctx = canvas.getContext('2d');
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL('image/jpeg', 1.0);
        onPhotoCallback && onPhotoCallback(data);
    }

    render() {
        const { text = "拍照", onPhotoCallback, data, enable = true } = this.props;
        return React.createElement(
            'div',
            { className: css.main },
            React.createElement(
                'div',
                { className: css.content },
                React.createElement('video', { ref: r => this.video = r, onPlay: this.videoPlay }),
                React.createElement('img', { ref: r => this.img = r, src: data }),
                React.createElement('canvas', { style: { display: 'none' }, ref: r => this.canvas = r })
            ),
            React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    { className: css.btn, disabled: !enable, onClick: this.clickBtn },
                    text
                )
            )
        );
    }
};

export default _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '../gp-njnu-photos-app/app/components/TakePhoto/index.js');
}();

;