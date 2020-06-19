<template>
  <view class="content">
    <button v-if="!ischecked" open-type="getUserInfo" @getuserinfo="getUserInfo">点我授权</button>
    <!-- <view @tap="getLocation" style="height: 100rpx;text-align: center;line-height: 100rpx;">查看当前位置</view> -->
    <view
      v-if="ischecked"
      @tap="upLoadFile"
      style="height: 100rpx;text-align: center;line-height: 100rpx;"
    >点我拍摄</view>
    <view class="imageList">
      <view v-for="(item,index) in imgList" :key="index">
        <view class="imageBox">
          <image :src="item.videoUrl" mode @tap="previewImage(item,index)" />
          <view
            v-if="item.userName!='-'"
            style="text-align: center;font-size: 24rpx;"
          >作者：{{item.userName}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      ischecked: false,
      userRes: null,
      imgList: []
    };
  },
  onShow() {},
  onPullDownRefresh() {
    let t = this;
    t.imgList = [];
    t.getImgList();
    uni.stopPullDownRefresh();
  },
  onLoad() {
    // this.upLoadFile();
    let t = this;
    if (uni.getStorageSync("userInfo")) {
      this.ischecked = true;
      this.userRes = uni.getStorageSync("userInfo");
    }
    this.getImgList();
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    month = month > 9 ? month : "0" + month;
    day = day > 9 ? day : "0" + day;
    console.log(`${year}-${month}-${day}-${hours}:${minutes}:${seconds}s`);
    uni.getLocation({
      type: "wgs84",
      success: function(res) {
        console.log(res);
        console.log("当前位置的经度：" + res.longitude);
        console.log("当前位置的纬度：" + res.latitude);
        t.address = `${res.longitude},${res.latitude}`;
        console.log(t.address);
      },
      fail: err => {
        console.log(err);
      }
    });
  },
  methods: {
    getLocation() {
      let t = this;
      uni.getLocation({
        type: "wgs84",
        success: function(res) {
          console.log(res);
          console.log("当前位置的经度：" + res.longitude);
          console.log("当前位置的纬度：" + res.latitude);
          t.address = `${res.longitude},${res.latitude}`;
          console.log(t.address);
        },
        fail: err => {
          console.log(err);
        }
      });
    },
    getImgList() {
      let t = this;
      t.$utils.ajax(t.$api.getImgArr, "get", {}, res => {
        console.log(res);
        t.imgList = res;
        console.log(t.imgList);
      });
    },
    async upLoadFile() {
      let t = this;
      uni.chooseImage({
        // sourceType: ["camera"],
        success: chooseImageRes => {
          const [tempFilePaths] = chooseImageRes.tempFilePaths;
          console.log(tempFilePaths, "图片的本地文件路径列表");
          let data = {
            name: t.userRes.nickName,
            address: t.address
          };
          t.$utils.upLoad(
            "https://image.wxapp.huangmaorui.cn/upLoad",
            tempFilePaths,
            "file",
            data,
            res => {
              t.imgList = JSON.parse(res.data).data;
              console.log(JSON.parse(res.data));
              uni.showLoading({
                title: "图片加载中"
              });
              setTimeout(() => {
                uni.hideLoading();
              }, 1500);
            }
          );
        }
      });
    },
    getUserInfo(e) {
      this.$utils.getSetting(() => {
        let t = this,
          authSetting_userInfo = uni.getStorageSync("authSetting.userInfo");
        console.log(authSetting_userInfo, "授权信息");
        if (authSetting_userInfo == false) {
          t.ischecked = true;
          return;
        } else {
          t.userRes = e.detail.userInfo;
          uni.setStorageSync("userInfo", t.userRes);
          t.ischecked = true;
        }
      });
    },
    previewImage(item, index) {
      let t = this,
        imgSrc = item.videoUrl;
      console.log([imgSrc]);

      console.log(index);

      uni.previewImage({
        current: index,
        urls: [imgSrc]
      });
    }
    /*  downloadFile(e) {
      var that = this;

      var filePath = e; //对应的网络路径，可以是内网的或者外网
      console.log(filePath);

      // var fileType = e.currentTarget.dataset.type;
      uni.saveFile({
        tempFilePath: filePath,
        success: function(res) {
          var savedFilePath = res.savedFilePath;
          console.log(savedFilePath);
          
        }
      });
    } */
  }
};
</script>
<style lang='less' scoped>
.content {
  min-height: 100vh;
  box-sizing: border-box;
  .imageList {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 16rpx;

    flex-wrap: wrap;
    .imageBox {
      margin-bottom: 50rpx;
      width: 350rpx;
      height: 350rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>