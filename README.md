# jlxy-client

> 精灵学院H5部分

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 登录鉴权

1. 先微信授权，获得openid、nickName、token，存cookies（此处cookies不做安全验证功能，只做存储介质）
2. 除获取孩子列表（手表、children）需要openid，nickName之外，之后获取其他数据，只需要openid、token即可做到。
## 用户信息组成

```
{
  ...,
  children: [
    vipExpire,
    grade,
    nickName
  ]
}
```

## TODO

### 互动

 - 发布任务

    1. 有任务时未完成：年级可选、发布的内容标题不变 or 年级禁用。
    2. 任务未完成、任务已完成未互动，能否继续布置任务？
    3. 有多个未完成的任务，顶部应该显示哪个任务呢？
    4. 有多个任务，状态分别不同：未完成、未互动、未完成，是否进行单项控制？
 - 发布互动
 - 获取互动结果
 - 评价互动



