const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const fs = require("fs-then")

// 获取所有书本
app.get('/api/getbooks', async (req, res) => {
    // 如果要使用async来实现同步的话，要记住await后面要promise对象才可以，用第三方模块fs-then，是把已经封装好的promise直接调用，用fs内置模块得自己封装promise
    const data = await fs.readFile('./data.json', 'utf-8')
    res.send({ status: 200, message: '获取图书成功', data: JSON.parse(data) })
})

// 根据id获取书本
app.get('/api/onebook', async (req, res) => {
    // 先获取数据
    let data = await fs.readFile('./data.json', 'utf-8')
    // 然后把数据转换成数组
    data = JSON.parse(data)
    // 获取到传进来的id参数
    const id = req.query.id
    // 通过数组的find方法查询对应数据
    const book = data.find(function (item) {
        return item.id == id
    })
    if (book) {
        res.send({ status: 0, message: '获取图书成功', data: book })
    } else {
        res.send({ status: 0, message: '获取图书失败' })
    }
})


// 配置，接收请求体
app.use(express.urlencoded({ extended: true })); // 接收查询字符串格式请求体

app.post('/api/addbook', async (req, res) => {
    // 先获取数据
    let data = await fs.readFile('./data.json', 'utf-8')
    // 然后把数据转换成数组
    data = JSON.parse(data)
    // 已经设置app.use(express.urlencoded())，可以直接用req.query来获取前端传进来的参数
    // 获取到的参数是有多个数据的数组，所以需要用展开运算符...展开，不然无法识别会报错
    // Date.now()是从1970年1月1日到现在的时间戳
    data.push({ ...req.body, id: Date.now() })

    // writeFile是创建文件，如果没有这个文件名会增加新的，已经有这个文件会直接覆盖，目的就是为了把增加新数据后的文件覆盖掉之前的
    await fs.writeFile('./data.json', JSON.stringify(data))
    res.send({ status: 0, message: '添加图书成功' })
})


app.listen(3000, () => {
    console.log('Express服务器已启动，监听端口3000');
});