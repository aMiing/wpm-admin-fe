<div align="center"><img width="200" src="https://gitee.com/amingxiansen/images/raw/master/logos/logo-common.png"/>
<h1> wpm（商品后台管理系统） </h1>
</div>

#### 说明
> 当前分支为零售版,包含零售收银页面

#### 效果和演示
+ 技术栈：前端 @vue/cli 
+ 后端: nodejs14.x+koa2
+ 数据库：mysql 5.7.0
+ 预览地址: [https://btcloud.top/#/login?origin=gh](https://btcloud.top/#/login?origin=gh) 
##### 效果展示：
> 登录页
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606235635159.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
>首页-收银
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210623144815270.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
>商品列表页
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210623144957471.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
> 库存管理
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210623145102872.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
> 新增商品
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210623145209207.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
> 会员管理
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210623145256119.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
> 销售数据-数据统计
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606235418874.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)>销售数据-订单列表
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606235534932.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)
> 系统设置
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210623145401936.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM5MzkzODk5,size_16,color_FFFFFF,t_70)

需求和方案都比较偏向个人主观，走过路过不妨提下意见，或者提个issues [github issues](https://github.com/aMiing/wpm-server/issues)

#### 总结
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

TODO:
1. 页面底部添加备案信息
2. 性能优化，分包
