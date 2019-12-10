
## 一、参考鉴权过程

    概要：访问精灵学院网页时，若cookies中有合法的`openid、nickname、token`，则h5页面正常请求显示数据，否则显示`404 forbidden`

所以微信这边大致鉴权如下，

用户点击菜单栏访问`/login`

`/login`做了3件事情：

1. 向微信拿到用户信息

2. 将cookies里面添加三个必要数据：`openid、nickname、token`（关键字均为小写、与微信返回的保持保持一致）

3. 最后再将请求重定向到学习、互动、商城等即可正常获取数据

### （一）、我方`微信服务端`如何确定重定向的逻辑？


访问`/login`时，告诉`/login`认证完毕后，需要跳转的地方（下方next参数）

前端路由，四个页面分别为（#号不能丢）：

- http://url.com/#/
- http://url.com/#/interact
- http://url.com/#/mall
- http://url.com/#/setting

将菜单中`/login`添加了一个`next`参数，

逻辑上就是：`/login?next=/#/mall`

但重要是需要对参数中的`/#/`进行urlencode编码，才能正常解析

所以最后的菜单栏url应该是这样子：

- http://url.com/login?next=%2f%23%2finteract

- http://url.com/login?next=%2f%23%2fmall

  ......


### （二）、参考python伪代码
```python
def login(...):
  user_info = wx.auth(...) # 从微信官方获取到的用户信息
  api_result = jlxy.login(...) # 使用获取到的openid、nickname调用登录接口
  next = request.args.get('next') # 从参数中获取到需要重定向的路由


  # 创建重定向请求 并设置cookies ， 完成鉴权
  resp = redirect(next) 
  resp.set_cookie('openid', user_info.openid)chifan1
  resp.set_cookie('nickname', user_info.nickname)
  resp.set_cookie('token', api_result['data']['token'])
  return resp
```


## 二、前端源代码结构

前端框架`Vue`，使用`vuex`管理全局状态

### 文件结构（主要在src文件夹内）：
```js
│  App.vue //入口
│  main.js
│  utils.js 
│
├─api
│      index.js  // 封装所有精灵学院网络请求动作
│
├─assets //留空，debug用
│
├─components
│  │  interact.js // 互动页拆分JS逻辑
│  │  study.js // 学习页拆分JS逻辑
│  │  Interact.vue // 互动
│  │  Mall.vue // 商城
│  │  Setting.vue // 设置
│  │  Study.vue // 学习
│  │
│  ├─js
│  │      adapter.js // 做逻辑数据转换，便于js遍历
│  │      statusTestCase.js // 测试数据
│  │      taskCase.js // 互动页面选择题库逻辑数据
│  │
│  └─layout // 复用组件文件夹
│          Child.vue // 设置页面内绑定的孩子，复用组件
│          Debug.vue // debug可忽略
│          Dilog.vue // 布置任务、购买vip对话框
│          Migrate-confirm.vue // 设置：弹出确认迁移对话框
│          Migrate.vue // 设置：迁移选择对话框
│          Overlay.vue // 背景遮罩层
│          Profile.vue // 设置：编辑资料
│          Qtable.vue // 任务、学习动态展开的题目组件
│          Remark.vue // 互动：选择金、银、铜，奖励组件
│          Status.vue // 每个任务、学习动态框，复用组件
│
├─router // 4个前端路由
│      index.js
│      routes.js
│
├─service // 定义http请求器，不涉及业务
│      index.js
│      jlxyHttp.js
│      statusCode.js
│      wxHttp.js
│
├─store // 根全局状态
│  │  index.js
│  │  types.js
│  │
│  └─modules // 拆分子全局状态
│          index.js
│          interact.js
│          mall.js
│          setting.js
│          study.jsku
│
└─style // css样式
    ...
```

### 运行开发环境


首次运行先执行`npm install`安装依赖包，

开发模式：`npm run dev`

编译静态文件：`npm run build`