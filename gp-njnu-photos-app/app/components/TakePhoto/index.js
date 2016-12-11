import React from 'react'
import {Map} from 'immutable'
import css from './style.less'


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.clickBtn = this.clickBtn.bind(this)
    }

    componentDidMount() {
        const {canvas, video} = this
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

        navigator.getUserMedia &&
        navigator.getUserMedia({ video: { facingMode: "user" } }, (stream) => {
            video.src = window.URL.createObjectURL(stream);  
            video.play();  
        }, console.error);  
        
    }

    clickBtn() {
        const {onPhotoCallback} = this.props
        const {canvas, video} = this
        const ctx = canvas.getContext('2d')
        canvas.width = video.clientWidth
        canvas.height = video.clientHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        onPhotoCallback && onPhotoCallback(canvas.toDataURL('image/png', 1.0))
    }

    render() {
        const {text="拍照", onPhotoCallback} = this.props
        return (
            <div className={css.main}>
                <div className={css.content}>
                    <video ref={r=>this.video=r} />
                    <canvas ref={r=>this.canvas=r} width="1000" />
                </div>
                <div><span className={css.btn} onClick={this.clickBtn}>{text}</span></div>
            </div>
        )
    }
}