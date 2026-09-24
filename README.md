# NoteTaker 应用

一个完整的前后端分离笔记应用，使用 Node.js + Express 后端和原生 JavaScript 前端。

## 项目结构

```
Week4/
├── server.js           # Express 后端服务器
├── package.json        # 项目依赖配置
├── public/            # 前端文件目录
│   ├── index.html     # 前端页面
│   ├── style.css      # 样式文件
│   └── app.js         # 前端 JavaScript
└── README.md          # 项目说明文档
```

## 功能特性

### 后端功能
- ✅ RESTful API 设计
- ✅ CORS 跨域支持
- ✅ 创建笔记 (POST /api/notes)
- ✅ 获取所有笔记 (GET /api/notes)
- ✅ 获取单个笔记 (GET /api/notes/:id)
- ✅ 更新笔记 (PUT /api/notes/:id)
- ✅ 删除笔记 (DELETE /api/notes/:id)
- ✅ 搜索笔记 (GET /api/notes/search/:keyword)

### 前端功能
- ✅ 现代化响应式界面
- ✅ 创建和编辑笔记
- ✅ 实时保存和更新
- ✅ 笔记列表显示
- ✅ 搜索功能（标题和内容）
- ✅ 删除笔记（带确认）
- ✅ 状态消息提示
- ✅ 笔记预览
- ✅ 时间戳显示

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

### 3. 访问应用

打开浏览器访问：
```
http://localhost:3000
```

## API 端点说明

### 获取所有笔记
```
GET /api/notes
响应: { success: true, data: [...] }
```

### 获取单个笔记
```
GET /api/notes/:id
响应: { success: true, data: {...} }
```

### 创建笔记
```
POST /api/notes
请求体: { title: "标题", content: "内容" }
响应: { success: true, data: {...}, message: "笔记创建成功" }
```

### 更新笔记
```
PUT /api/notes/:id
请求体: { title: "新标题", content: "新内容" }
响应: { success: true, data: {...}, message: "笔记更新成功" }
```

### 删除笔记
```
DELETE /api/notes/:id
响应: { success: true, message: "笔记删除成功" }
```

### 搜索笔记
```
GET /api/notes/search/:keyword
响应: { success: true, data: [...], count: 10 }
```

## 技术栈

### 后端
- **Node.js** - JavaScript 运行环境
- **Express** - Web 应用框架
- **CORS** - 跨域资源共享
- **Body-Parser** - 请求体解析

### 前端
- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **JavaScript (ES6+)** - 前端逻辑
- **Fetch API** - HTTP 请求

## 数据存储

当前版本使用**内存存储**（服务器重启后数据会丢失）。

如需持久化存储，可以升级为：
- 文件系统存储（JSON 文件）
- SQLite 数据库
- MongoDB 数据库
- PostgreSQL/MySQL 数据库

## 使用说明

### 创建笔记
1. 在左侧编辑区输入标题和内容
2. 点击"💾 保存笔记"按钮
3. 笔记会出现在右侧列表中

### 编辑笔记
1. 在右侧列表点击"📖 加载"按钮
2. 笔记内容会加载到编辑器
3. 修改后点击保存

### 删除笔记
1. 点击笔记项的"❌ 删除"按钮
2. 确认删除操作

### 搜索笔记
1. 在搜索框输入关键词
2. 点击"🔍 搜索"或按回车键
3. 显示匹配的笔记

### 新建笔记
- 点击"➕ 新建笔记"清空编辑器开始新笔记

## 开发说明

### 添加数据库持久化

如需添加数据库，修改 `server.js` 中的数据存储部分：

```javascript
// 替换内存存储
let notes = [];

// 改为数据库操作
const db = require('./database'); // 你的数据库模块
```

### 自定义端口

修改 `server.js` 中的 PORT 变量：

```javascript
const PORT = 3000; // 改为你想要的端口
```

### 添加用户认证

可以添加：
- JWT 令牌认证
- Session 会话管理
- OAuth 第三方登录

## 注意事项

1. **CORS 设置**：当前允许所有来源，生产环境请限制具体域名
2. **数据持久化**：当前使用内存存储，服务器重启会丢失数据
3. **输入验证**：已实现基础验证，可根据需求加强
4. **安全性**：已实现 HTML 转义防止 XSS 攻击

## 浏览器兼容性

支持所有现代浏览器：
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 许可证

MIT License - 自由使用
