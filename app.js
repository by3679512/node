// 导入express
const express = require('express')
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(3000, () => {
    console.log('Express服务器已启动，监听端口3000');
  });