const utils = {
    getSetting: (fn) => {
        let t = this;
        uni.getSetting({
            success: result => {
                console.log(result, '6666666');
                let {
                    "scope.userInfo": a
                } = result.authSetting;
                if (a === undefined) return;
                uni.setStorageSync("authSetting.userInfo", a);
                fn(result)
            },
            fail: () => {},
            complete: () => {}
        });
    },
    /* 若对象为null、undefined、''时，转化为空对象或指定某值 */
    replaceNull: function (obj) {
        if (typeof obj === 'object') {
            Object.keys(obj).forEach(element => {
                let value = obj[element];
                if (value === null || value === undefined || value === '') {
                    obj[element] = '-';
                    // delete obj[element];
                } else if (typeof value === 'object') {
                    utils.replaceNull(value);
                }
            });
        }
        return obj;
    },

    /* ajax请求 */
    ajax: async function (url, method, data, res) {
        const promise = new Promise((resolve, reject) => {
            if (true) {
                console.log(url + '-->' + '请求数据data--->', data)
                uni.request({
                    url: url, //仅为示例，并非真实接口地址。
                    method: method,
                    data: data,
                    header: {
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    success: (res) => {
                        let result = res.data,
                            code = result.code,
                            msg = result.msg;
                        console.log(url + '-->' + '请求接口返回值--->', res)
                        // console.log(url + '-->' + "接口code码返回值--->", code);
                        if (code == 40001 || code == 0) {
                            utils.showToast(msg, false)
                            return
                        }
                        result = utils.replaceNull(result)
                        return resolve(result)
                    },
                });
            } else {
                return reject('Promise异步执行失败')
            }
        })
        res(await promise)
    },
    // 上传
    upLoad(url, filePath, name, formData, resolve) {
        // let userInfo = uni.getStorageSync('userInfo')
        /* let formData = {}
        if (userInfo) {
          formData.user_id = userInfo.id
          formData.openid = userInfo.openid
          formData.sign = userInfo.sign
        } */
        // console.log(formData)
        const uploadTask = uni.uploadFile({
            url: url,
            filePath: filePath,
            name: name,
            formData: formData,
            header: {
                "content-type": "application/x-www-form-urlencoded",
            },
            complete: (res) => {
                resolve(res)
            }
        })
        /* uploadTask.onProgressUpdate((res) => {
            if (name == 'files') {
                let videoLength = (res.totalBytesSent) / 1024 / 1024
                if (videoLength > 8) {
                    uploadTask.abort()
                    utils.showToast('视频大小超过80MB, 请重新上传', false)
                }
            } else if (name == 'image') {
                let imgLength = (res.totalBytesSent) / 1024 / 8
                console.log(imgLength, 'imgLengthimgLengthimgLength');
                if (imgLength > 2048) {
                    uploadTask.abort()
                    utils.showToast('图片超过100KB, 请重新上传')
                }
            }
        }) */
    },
}

export default utils