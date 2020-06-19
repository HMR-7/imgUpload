var express = require('express');
var mysql = require("mysql");
var multer = require("multer");
var bodyParse = require('body-parser');
const https = 'https://image.wxapp.huangmaorui.cn/'
var app = express();
// var conn = mysql.createConnection({});
/* 连接个人服务器数据库 */
var conn = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "short_video",
    password: "Zd102117",
    database: "short_video",
    charset: 'UTF8Mb4_GENERAL_CI',
    multipleStatements: true
})
// // 设置图片存储路径
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/');
    },
    filename: function (req, file, cb) {
        var singfileArray = file.originalname.split('.');
        var fileExtension = singfileArray[singfileArray.length - 1];
        // cb(null, singfileArray[0] + '-' + Date.now() + "." + fileExtension);
        console.log(file);
        cb(null, `wx${Date.now()}-hmr.${fileExtension}`)
        // cb(null, `wx${Date.now()}-hmr${file.originalname}`)
    }
})

const upload = multer({
    storage: storage
})

app.use('/upLoad', upload.single('file'), (req, res) => {
    let reData = req.body;
    console.log(reData);
    if (req.body) {
        if (req.file) {
            let url = https + req.file.path;
            const sqlinsert = "insert into videoDetail(videoUrl,userName,address) values (?,?,?)"
            conn.query(sqlinsert, [req.file.path, reData.name, reData.address], function (err, result) {
                console.log(sqlinsert);
                const sql = 'select * from videoDetail';
                conn.query(sql, function (err, result) {
                    let _res = JSON.stringify(result)
                    let data = JSON.parse(_res)
                    data.map((v) => {
                        v.videoUrl = `${https+v.videoUrl}`
                    })
                    res.send({
                        msg: '文件上传成功',
                        data: data,
                        req: reData,
                    })
                })
            })
        }
    }
});
app.get('/getImgArr', function (req, res) {
    let reData = req.query;
    const sql = 'select * from videoDetail'
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        data.map((v) => {
            v.videoUrl = `${https+v.videoUrl}`
        })
        res.send(data)
    })
})


app.listen(10070, () => {
    console.log('服务已启动-10070');
});