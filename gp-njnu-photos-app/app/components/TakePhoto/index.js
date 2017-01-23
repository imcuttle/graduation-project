import React from 'react'
import {Map} from 'immutable'
import {isBrowser, showModal} from '../../common/utils'
const css = isBrowser ? require('./style.less') : require('./style.less')

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.clickBtn = this.clickBtn.bind(this)
        this.videoPlay = this.videoPlay.bind(this)
    }

    videoPlay() {
        const {canvas, video, img} = this
        // img.width=video.clientWidth;
        // img.height=video.clientHeight;
    }

    componentDidMount() {
        const {canvas, video, img} = this
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        if (!navigator.getUserMedia) {
            showModal('请跟我念 “Chrome 大法好”，你的浏览器不能开摄像头！', ()=>{}, null, null, 'md')
            return;
        }
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

        const data = canvas.toDataURL('image/jpeg', 1.0)
        onPhotoCallback && onPhotoCallback(data)

    }

    render() {
        const {text="拍照", onPhotoCallback, data, enable=true} = this.props
        return (
            <div className={css.main}>
                <div className={css.content}>
                    <video ref={r=>this.video=r} onPlay={this.videoPlay}/>
                    <img ref={r=>this.img=r} src={data}/>
                    <canvas style={{display: 'none'}} ref={r=>this.canvas=r} />
                </div>
                <div><span className={css.btn} disabled={!enable} onClick={this.clickBtn}>{text}</span></div>
            </div>
        )
    }
}