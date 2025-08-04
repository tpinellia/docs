---
author: mantic
title: vscode-leetcode-rust环境(自动补全)
date: 2024-12-08
usePageBundles: true
summary: 介绍如何在vscode使用leetcode时配置rust环境，以实现自动补全功能。
---

## 创建项目目录
工程目录：`/home/mantic/Projects/rust/`
1. `cd /home/mantic/Projects/rust/`
2. `cargo new leetcode`
3. `cd leetcode`
4. `cargo add automod`
5. `cd src`
6. `mkdir leetcode`
7. `vi lib.rs`
```rust
mod leetcode {
    automod::dir!("src/leetcode/");
}
```

## 配置vscode

```json
{
    "leetcode.endpoint": "leetcode-cn",
    "leetcode.hint.configWebviewMarkdown": false,
    "leetcode.defaultLanguage": "rust",
    "leetcode.workspaceFolder": "/home/mantic/Projects/rust/leetcode/",
    "leetcode.filePath": {
        "default": {
            "folder": "src/leetcode",
            "filename": "${id}-${kebab-case-name}.rs"
        }
    },
    "leetcode.hint.commentDescription": false,
    "leetcode.hint.commandShortcut": false
}
```