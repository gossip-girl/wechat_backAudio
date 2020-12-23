# wechat_backAudio

微信小程序，基于背景音乐的音频播放器

## 如果需要做播放切换时跳转到指定位置 ios 手机：BackAudio.startTime=跳转位置即可 安卓手机：调用 onCanplay 之后 seek 跳转

## 背景音频 VS 音频

### 背景音频小程序切换到后台 仍可以播放：app.json 中配置：

```
  requiredBackgroundModes": ["audio", "location"]

```

## 遇到的问题：

### 涉及到音视频的小程序 必须是基于企业主题的小程序 个人主题的小程序审核不会通过

### ios 有可能遇到音频播放不了时候 重启手机即可
