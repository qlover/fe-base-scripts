# fe-base-scripts

为 `fe-base` 项目集成了基础开发的工具脚本

内部集成 `release-it`, `commitlint`, `husky`

- `fe-clean` 清理所有工具生成文件或目录，如： node_modules, yarn.lock, dist...
- `fe-reinit`
- `fe-commit` 代码提交
- `fe-release` 用于代码发布
- `fe-ts-run node` 环境运行 typescript
- `fe-setup-husky` 安装 commintlint 提交规范
- `fe-clean-branch` 清理本地无效或在远程已被删除的分支

## 配置

创建 `.fe-scripts` 文件, 扩展名读取顺序

- package.json fe-scripts 属性
- .fe-scripts.json
- .fe-scripts.js
- .fe-scripts.ts
- .fe-scripts.cjs
- .fe-scripts.yaml
- .fe-scripts.yml

## fe-release, 覆盖 release-it 配置

还没有集成到 `.fe-scripts` 中,和 `release-it` 用法一致,创建一个 `.release-it` 配置文件

## fe-commit, 覆盖 commintlint 配置

创建 .fe-scripts.json

```json
{
  "commitlint": {
    "extends": [
      // ...
    ]
  }
}
```

## fe-clean

`cleanFiles` 执行 `fe-clean` 时需要删除的文件对象

```json
{
  "cleanFiles": ["*.log", "package-lock.lock", ".cache", "dist", "build"]
}
```

## fe-clean-branch

定义 `protectedBranches` 保护指定分支防止删除

```json
{
  "protectedBranches": [
    // branch name ...
  ]
}
```

## package.json

```json
{
  "fe-scripts": {
    // ...
  }
}
```
