# Tuono examples

This folder includes all the official tuono starters.

To simply scaffold the base project run in your terminal:

```shell
$ tuono new [NAME]
```

You can install any example included in this folder by just using the `--template` flag:

```shell
$ tuono new [NAME] --template [TEMPLATE] 
```

`[TEMPLATE]` is the folder name.

## Troubleshooting for contributors

There is a common error that happens during example development due to 
pnpm workspace about the findings of different react versions.

To overcome this issue run within the single example folder:

```
pnpm install --ignore-workspace && pnpm upgrade --save
```
