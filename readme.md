<div align="center"><img width="200" src="https://gitee.com/amingxiansen/images/raw/master/logos/logo-common.png"/>
<h1> wpm（商品后台管理系统） </h1>
</div>

## 说明
> 当前分支为零售版

## 缘起

> 朋友家新开了一家诊所，需要一套可以管理订单和库存的系统，咨询我有没有合适的。看了下有很多类似的收银台系统，都是和收银硬件打包卖的，价格贵缺乏灵活性。恰好最近工作不忙，花了些精力搞了个简易版，先用起来收集一波需求和建议，以备后续优化。

## 需求和功能点
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606232843545.png)
整理了一下朋友的原话：
+ 输入药品名统计出价格
+ 可以统计每天每月的营业额
+ 核销统计药品库存

基于满足这样的需求，大概想了下需要实现的points
#### 优先级P0
1. 商品（/药品/服务）列表
  + 关键字搜索商品
  + 商品类别筛选
  + 加入购物车
2. 购物车
  + 统计车内商品数量和总价
  + 一键核销库存
3. 商品管理
  + 新增商品
  + 删除商品（批量删除）
  + 上下架操作
  + 修改商品信息（价格/库存等）
4. 销售数据统计
  + 订单详细列表
  + 销售订单、销售额统计（图表呈现）
5. 登录token过期限制(一天过期)
6. 系统设置
  + 修改系统名称
  + 修改系统图标

#### 优先级p1（待实现）
+ ~~个人中心：修改用户的资料信息~~
+ 用户管理：系统管理员可以开用户账号
+ 权限管理： 管理员管理其他用户类型的菜单权限（例如普通用户看不到后台数据，对商品无修改权限等）
+ ...

## 效果和演示
技术栈：前端 vue2.x+ElementUi+echarts
后端: nodejs14.x+koa2
数据库：mysql 5.7.0
预览地址: [http://49.235.109.180:3000/#/login](http://49.235.109.180:3000/#/login) 
### 效果展示：
 登录页
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606235635159.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
 首页-商品列表页
![首页-商品列表页](https://img-blog.csdnimg.cn/20210606234850884.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
 购物车
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606235113853.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)> 系统设置-商品管理
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606235252348.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
 销售数据-数据统计
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606235418874.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)>销售数据-订单列表
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606235534932.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)

## 总结
目前基本的核销、库存、订单、销售统计需求都已经满足了，等待朋友反馈再行优化。
> 代码地址请移步[github](https://github.com/aMiing/wmp-admin-fe)，欢迎star，欢迎投币！
> 前前后后花了将近半个月的时间才搞完，如果有帮到您，可根据您的经济情况理性打赏~
<table>
<tr>
<td>
<img width="200px" src="https://gitee.com/amingxiansen/images/raw/master/qr_code/zfb.jpeg">
</td>
<td>
<img width="200px" src="https://gitee.com/amingxiansen/images/raw/master/qr_code/wechat.jpeg">
</td>
</tr>
</table>
> 有疑问可在qq: 1006934861 联系到我。


```bash
# 克隆项目
git clone https://github.com/aMiing/wmp-admin-fe.git
# 进入项目目录
cd wmp-admin-fe
# 安装依赖
npm i
# 本地开发 启动项目
npm run serve
```
