---
author: mantic
title: rust环境安装
date: 2024-07-01 10:00:00
summary: 介绍如何安装rust环境
usePageBundles: true
series: ["Rust程序设计语言"]
---

## 安装

第一步是安装 Rust。我们会通过 `rustup` 下载 Rust，这是一个管理 Rust 版本和相关工具的命令行工具。下载时需要联网。

```bash
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

## 更新与卸载

通过 `rustup` 安装了 Rust 之后，更新到最新版本就很简单了，只需要在您对应的命令行中运行如下更新脚本：

```bash
$ rustup update
```

若要卸载 Rust 和 `rustup`，请在命令行中运行如下卸载脚本：

```bash
$ rustup self uninstall
```

## 本地文档

安装程序也自带一份文档的本地拷贝，可以离线阅读。运行下面命令在浏览器中查看本地文档。

```bash
$ rustup doc
```

## Hello,World!

首先创建一个存放 Rust 代码的目录。Rust 并不关心代码的存放位置，所以可以在任何目录创建。

```bash
$ mkdir hello_world
$ cd hello_world
```

编写 Rust 代码

```rust
fn main() {
    println!("Hello, world!");
}
```

编译并执行

```bash
$ rustc main.rs
$ ./main
Hello, world!
```

## Hello,cargo!

Cargo 是 Rust 的构建系统和包管理器。大多数人使用 Cargo 来管理他们的 Rust 项目，因为它可以为你处理很多任务，比如构建代码、下载依赖库并编译这些库。

检查是否已安装 cargo

```bash
$ cargo --version
cargo 1.79.0 (ffa9cf99a 2024-06-03)
```

使用 cargo 创建项目

```bash
$ cargo new hello_cargo
$ cd hello_cargo
```

项目文件结构
```bash
├── Cargo.toml
├── .git
├── .gitignore
└── src
    └── main.rs
```

cargo默认会初始化一个 git 仓库，以及一个 .gitignore 文件。如果在一个已经存在的 git 仓库中运行 `cargo new`，则这些 git 相关文件则不会生成；可以通过运行 `cargo new --vcs=git` 来覆盖这些行为。

Cargo 会创建一个名为 `Cargo.toml` 的配置文件。
第一行，`[package]`，是一个片段（section）标题，表明下面的语句用来配置一个包。随着我们在这个文件增加更多的信息，还将增加其他片段（section）。

接下来的三行设置了 Cargo 编译程序所需的配置：项目的名称、项目的版本以及要使用的 Rust 版本。

最后一行，[dependencies]，是罗列项目依赖的片段的开始。在 Rust 中，代码包被称为 `crates`。这个项目并不需要其他的 crate。

```toml
[package]
name = "hello_cargo"
version = "0.1.0"
edition = "2021"

[dependencies]
```

**src/main.rs** 即为项目代码。Cargo 期望源文件存放在 **src** 目录中。项目根目录只存放 README、license 信息、配置文件和其他跟代码无关的文件。使用 Cargo 帮助你保持项目干净整洁，一切井井有条。

构建 `cargo build`，这个命令会创建一个可执行文件 **target/debug/hello_cargo**，由于默认的构建方法是调试构建（debug build），Cargo 会将可执行文件放在名为 debug 的目录中。

```bash
$ cargo build
   Compiling hello_cargo v0.1.0 (/home/mantic/Projects/rust/hello_cargo)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.13s
```

执行 `./target/debug/hello_cargo`

```bash
$ ./target/debug/hello_cargo 
Hello, world!
```

一步构建并执行: `cargo run`

```bash
$ cargo run
   Compiling hello_cargo v0.1.0 (/home/mantic/Projects/rust/hello_cargo)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.12s
     Running `target/debug/hello_cargo`
Hello, world!
```

快速检查代码但不编译: `cargo check`

```bash
$ cargo check
    Checking hello_cargo v0.1.0 (/home/mantic/Projects/rust/hello_cargo)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.05s
```

发布构建: `cargo build --release`，当项目最终准备好发布时，可以使用该命令来优化编译项目。这会在 **target/release** 生成可执行文件。