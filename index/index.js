// pages/components/unitAudio/unitAudio.js
const APP = getApp()
var BackAudio=getApp().globalData.global_bac_audio_manager.manage
Page({
  /**
   * 组件的属性列表
   */

  /**
   * 组件的初始数据
   */
  data: {
    this_audioInfo:{
      title:'音乐1',
      watchTime:'0',
      isEnd:'',
      fileUrl:'https://www.shebeiyunwei.com:8081/ec3d9d2a005e41be96982839cdf896ad.mp3'
    },
    fileList:[
      {
        title:'音乐1',
        fileUrl:'https://www.shebeiyunwei.com:8081/ec3d9d2a005e41be96982839cdf896ad.mp3'
      },
      {
        title:'音乐22222',
        fileUrl:'https://www.shebeiyunwei.com:8081/8bfb818e6e554c3598161b8f82264936.mp3'
      }
    ],
    fileIndex:0,
    sliderValue:null,
    current_process:'',//当前播放进度，显示用
    sliderMax:'',//音频长度 显示用
    audioState:'pause',
    is_moving_slider:false,
    interVal:null,
    canPlay:false,
    showAudio:false,
    switch:false,
    isFirst:false,
    startTime:0,
  },
  onReady: function () {
    this.setData({
      sliderValue:this.data.this_audioInfo.watchTime?this.data.this_audioInfo.watchTime:0,
    })
    this.setData({
      current_process:this.format(this.data.sliderValue),
      // showMax:this.format(this.data.this_audioInfo.courseTime),
    })
    if(this.data.this_audioInfo.fileUrl){
      console.log(this.data.this_audioInfo.fileUrl)
      //BackAudio.pause()
      // BackAudio.src=this.data.this_audioInfo.fileUrl;
      // BackAudio.title=this.data.this_audioInfo.title
      if(this.data.sliderValue && this.data.sliderValue!=0){
        if(this.data.this_audioInfo.watchTime && this.data.this_audioInfo.courseTime && (Number(this.data.this_audioInfo.courseTime) - Number(this.data.this_audioInfo.watchTime)<=5)){
          this.setData({
            sliderValue:0,
          })
        }
      }
      BackAudio.startTime=this.data.sliderValue;
      //BackAudio.play();
      setTimeout(() => {
        BackAudio.onCanplay(()=>{
          // console.log(BackAudio.duration);
          // console.log('onCanplay',this.data.sliderValue)
          wx.seekBackgroundAudio({
            position: Number(this.data.sliderValue),
            success:res=>{
              this.setData({
                showAudio:true,
                showMax:this.format(BackAudio.duration),
              })
            }
          })
        })
      }, 0);
    }

    let that=this; 
    BackAudio.onStop(()=>{
      console.log('stop');
      clearInterval();
      this.savePlayTimes();
    })
    BackAudio.onEnded(() => {
      console.log('end')
      clearInterval();
      this.savePlayTimes('end');
      this.triggerEvent('closeAudio');
    })
    BackAudio.onError((error) => {
      console.log(error)
      wx.showToast({
        title: '音频文件错误，请联系管理员',
        icon:'none'
      })
      this.setData({
        audioState:false,
      })
      BackAudio.stop();
      this.triggerEvent('closeAudio');
    })
  },
   // 时间格式化
   format(t) {
    let time = Math.floor(t / 60) >= 10 ? Math.floor(t / 60) : '0' + Math.floor(t / 60)
    t = time + ':' + ((t % 60) / 100).toFixed(2).slice(-2)
    return t
  },
  hanle_slider_change(e){
    const position = e.detail.value
    console.log(position)
    wx.seekBackgroundAudio({
      position: Math.floor(position),
      success:res=>{
        BackAudio.currentTime=position
        this.setData({
          sliderValue: Math.floor(position),
          current_process:this.format(Math.floor(position))
        })
      }
    })
    //BackAudio.seek(this.data.sliderValue);
  },
  handle_slider_move_start(){
    console.log('start')
    this.setData({
        is_moving_slider: true
    });
    if(!this.data.this_audioInfo.isEnd){
      wx.showToast({
        title: '首次学习课程完成前不能拖动进度条',
        icon:'none'
      })
      this.setData({
          is_moving_slider: false
      });
    }
  },
  handle_slider_move_end(e){
    this.setData({
        is_moving_slider: false,
    });
  },
  switchPlay(){
    let old=this.data.audioState
    console.log('switch')
    this.setData({
      audioState:old=='play'?'pause':'play'
    })
    console.log(this.data.audioState)
    if(this.data.audioState=='play'){
      BackAudio.play();
      BackAudio.src=this.data.this_audioInfo.fileUrl
      BackAudio.title=this.data.this_audioInfo.title
      BackAudio.onTimeUpdate(() => {
        console.log('currentTime',BackAudio.currentTime);
        if(BackAudio.currentTime && BackAudio.currentTime!=0 && !this.data.is_moving_slider && BackAudio.currentTime>=Number(this.data.this_audioInfo.watchTime)){
          this.setData({
            sliderValue:(Number(BackAudio.currentTime)).toFixed(2),
            current_process:this.format(BackAudio.currentTime),
          })
        }
      })
      this.setData({
        interVal:setInterval(()=>{
          console.log('inter')
          this.savePlayTimes();
        },2000)
      })
    }else{
      clearInterval(this.data.interVal);
      BackAudio.pause();
      BackAudio.onTimeUpdate(()=>{
        return false;
      })
    }
  },
  changeAudio(e){
    let type=e.currentTarget.dataset.type;
    this.setData({
      fileIndex:this.data.fileIndex==0?1:0
    })
    BackAudio.onTimeUpdate(()=>{
      return false;
    })
    clearInterval();
    
    BackAudio.src=this.data.fileList[this.data.fileIndex].fileUrl;
    BackAudio.title=this.data.fileList[this.data.fileIndex].title;
    this.setData({
      'this_audioInfo.title':this.data.fileList[this.data.fileIndex].title,
      'this_audioInfo.fileUrl':this.data.fileList[this.data.fileIndex].fileUrl
    })
    BackAudio.onTimeUpdate(() => {
      console.log('currentTime',BackAudio.currentTime);
      if(BackAudio.currentTime && BackAudio.currentTime!=0 && !this.data.is_moving_slider && BackAudio.currentTime>=Number(this.data.this_audioInfo.watchTime)){
        this.setData({
          sliderValue:(Number(BackAudio.currentTime)).toFixed(2),
          current_process:this.format(BackAudio.currentTime),
        })
      }
    })
    //BackAudio.startTime=this.data.fileList[this.data.fileIndex].watchTime//如果需要跳转；
  },
  savePlayTimes(type){
    let params={
      courseId:this.data.this_audioInfo.id,
      watchTime:parseInt(this.data.sliderValue)
    }
    if(type){
      params['isEnd']=1
    }
    // Https.class.setRecordTimes({
    //   data:params,
    //   success:res=>{
    //   this.triggerEvent('resetWatchTime',{id:this.data.this_audioInfo.id,watchTime:parseInt(this.data.sliderValue)})
    //   }
    // })
  },
  closeAudio(){
    console.log('手动stop')
    BackAudio.stop();
    this.triggerEvent('closeAudio');
    // this.savePlayTimes();
    // this.triggerEvent('closeAudio')
  }
})
