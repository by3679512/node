// 引入express模块 --> 用来快速开发接口
const express = require('express');
const app = express()
// 引入cors模块 --> 用来解决跨域的
const cors = require('cors')
// 引入封装好promise的fs-then模块
const fs = require('fs-then')
// 引入修改编码格式的body-parser模块 --> 要先下载  body-parser模块名字
const bodyParser = require('body-parser')

// 设置express 支持post请求参数格式支持json   支持application/json
app.use(bodyParser.json());

// 设置 express 支持 post请求参数 默认是application/x-www-form-urlencoded编码格式  app.use(express.urlencoded());
app.use(express.urlencoded())

// 解决跨域问题
app.use(cors())

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


// 修改图书
app.put('/api/updatebook', async (req, res) => {
    // 先获取数据
    let data = await fs.readFile('./data.json', 'utf-8')
    // 然后把数据转换成数组
    data = JSON.parse(data)
    // 修改一样是根据id来修改，所以要先获取id
   const index = data.findIndex(function (item) {
    // 判断请求参数中的id和数据中的id相同的数据是第几个  
    return req.body.id == item.id
})
    // 如果上面的索引找不到，会返回-1，需要进行个判断
if (index == -1) {
    res.send({ status: 1, message: 'id不存在' })
} else {
    // 把对应索引的数据改成传进来的参数
    data[index] = req.body
    // 把新数据覆盖之前的数据
    await fs.writeFile('./data.json', JSON.stringify(data))
    res.send({ status: 0, message: '修改图书成功' })
}
})

// 删除图书
app.delete('/api/delbook', async (req, res) => {
    // 先获取数据
    let data = await fs.readFile('./data.json', 'utf-8')
    // 然后把数据转换成数组
    data = JSON.parse(data)
    // 删除一样是根据id来删除，所以要先获取id
    const index = data.findIndex(function (item) {
        // 判断请求参数中的id和数据中的id相同的数据是第几个
        return req.query.id == item.id
    })
    // 用splice删除对应数据
    data.splice(index, 1)

    // 把新数据覆盖之前的数据
    await fs.writeFile('./data.json', JSON.stringify(data))

    // 响应
    res.send({ status: 0, message: '删除图书成功' })
})


app.listen(3000, () => {
    console.log('Express服务器已启动，监听端口3000');
});