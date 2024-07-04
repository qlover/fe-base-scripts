# fe-base-scripts

Integrated basic development tool scripts for the `fe-base` project
Internal integration `release-it`, `commitlint`, `husky`

- `fe-clean` Cleans all tool generated files or directories, such as `node_modules, yarn.lock, dist`

- `fe-reinit` init project, `yarn install...`
- `fe-commit` code submission
- `fe-release` is used for code publishing
- `fe-ts-run` Run typescript in the node environment
- `fe-setup-husky` Install commentlint submission specification
- `fe-clean-branch` Cleans up locally invalid or remotely deleted branches

## Configuration

Create a `.fe-scripts` file with extension reading order

- package.json fe-scripts property
- .fe-scripts.json
- .fe-scripts.js
- .fe-scripts.ts
- .fe-scripts.cjs
- .fe-scripts.yaml
- .fe-scripts.yml

## fe-release

overwrite `release-it` configuration

Not yet integrated into `.fe-scripts`, consistent with the usage of `release-it`, create a `.release it` configuration file

## fe-commit

covering commentlint configuration

Create a `.fe-scripts.json`

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

`cleanFiles` The file objects that need to be deleted when executing `fe-clean`

```json
{
  "cleanFiles": ["*.log", "package-lock.lock", ".cache", "dist", "build"]
}
```

## fe-clean-branch

Define `protectedBranches` to protect specified branches from deletion

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
