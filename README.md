# Vue 3 Admin Plus

## 技术栈

- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia (状态管理)
- Vue Router
- Axios
- ESLint + Prettier (代码规范)

## 环境要求

- Node.js >= 20.0.0
- pnpm >= 7.0.0

## 项目设置

```bash
# 安装依赖
$ pnpm install

# 启动开发服务器
$ pnpm run dev

# 构建生产环境
$ pnpm run build

# 代码格式化
$ pnpm run format

# 代码检查
$ pnpm run lint
```

## 项目结构

```
├── public/
├── src/
│   ├── api/          # API 接口
│   ├── assets/       # 静态资源
│   ├── components/   # 公共组件
│   ├── composables/  # 组合式函数
│   ├── layouts/      # 布局组件
│   ├── router/       # 路由配置
│   ├── stores/       # Pinia 状态管理
│   ├── styles/       # 全局样式
│   ├── types/        # TypeScript 类型
│   ├── utils/        # 工具函数
│   ├── views/        # 页面视图
│   ├── App.vue
│   └── main.ts
├── .env              # 环境变量
├── .eslintrc.js     # ESLint 配置
├── .prettierrc      # Prettier 配置
├── tsconfig.json    # TypeScript 配置
├── vite.config.ts   # Vite 配置
└── package.json
```

## 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 提交前请确保代码通过 lint 检查

### 提交规范

提交信息格式：
```
<type>(<scope>): <subject>

<body>
```

type 类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 13
- Edge >= 88

## 相关文档

- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
- [Element Plus 文档](https://element-plus.org/)

## 许可证

[MIT](LICENSE)

