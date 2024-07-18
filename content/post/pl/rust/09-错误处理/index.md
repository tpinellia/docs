---
author: mantic
title: 错误处理
date: 2024-07-12 10:00:00
summary: 讨论rust在错误处理方面的特性
usePageBundles: true
series: ["Rust程序设计语言"]
---

Rust 将错误分为两大类：
- `可恢复的（recoverable）`，对于一个可恢复的错误，比如文件未找到的错误，我们很可能只想向用户报告问题并重试操作。rust 使用 `Result<T, E>` 类型，来处理可恢复的错误。
- `不可恢复的（unrecoverable）`，不可恢复的错误总是 bug 出现的征兆，比如试图访问一个超过数组末端的位置，因此我们要立即停止程序。rust 使用 `panic!` 宏，在程序遇到不可恢复的错误时停止执行。

## 用 panic! 处理不可恢复的错误

在实践中有两种方法造成 panic：
- 执行会造成代码 panic 的操作（比如访问超过数组结尾的内容）
- 显式调用 `panic!` 宏。

这两种情况都会使程序 panic。通常情况下这些 panic 会打印出一个错误信息，展开并清理栈数据，然后退出。当出现 panic 时，程序有两种处理办法：
- 默认会开始 `展开（unwinding）`，这意味着 Rust 会回溯栈并清理它遇到的每一个函数的数据；
- 另一种选择是直接 `终止（abort）`，这会不清理数据就退出程序，程序所使用的内存由操作系统进行清理。`终止` 适合你需要项目的最终二进制文件越小越好的情况。可以通过在 `Cargo.toml` 的 `[profile]` 部分增加 `panic = 'abort'`，可以由展开切换为终止。例如，如果你想要在 `release` 模式中 `panic` 时直接终止：

```rust
[profile.release]
panic = 'abort'
```

使用 `RUST_BACKTRACE=1` 环境变量可以得到回溯信息。例如：`RUST_BACKTRACE=1 cargo run` 

## 用 Result 处理可恢复的错误

用 `Result` 来处理错误并没有严重到需要程序完全停止执行的这种情况。 `T` 代表成功时返回的 `Ok` 成员中的数据的类型，而 `E` 代表失败时返回的 `Err` 成员中的错误的类型。

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

使用 `match` 来处理结果，`File::open` 返回的 `Err` 成员中的值类型 `io::Error`，它是一个标准库中提供的结构体。这个结构体有一个返回 `io::ErrorKind` 值的 `kind` 方法可供调用。`io::ErrorKind` 是一个标准库提供的枚举，它的成员对应 io 操作可能导致的不同错误类型。

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {e:?}"),
            },
            other_error => {
                panic!("Problem opening the file: {other_error:?}");
            }
        },
    };
}
```

#### 失败时 panic 的简写：unwrap 和 expect

`Result<T, E>` 类型定义了很多辅助方法来处理各种情况。其中之一叫做 `unwrap`，它的实现就类似于上面例子中的 `match` 语句。如果 `Result` 值是成员 `Ok`，`unwrap` 会返回 `Ok` 中的值。如果 `Result` 是成员 `Err`，`unwrap` 会为我们调用 `panic!`。

```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt").unwrap();
}
```

`expect` 与 `unwrap` 的使用方式一样：返回文件句柄或调用 `panic!` 宏。`expect` 在调用 `panic!` 时使用的错误信息将是我们传递给 `expect` 的参数，而不像 `unwrap` 那样使用默认的 `panic!` 信息。

```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt")
        .expect("hello.txt should be included in this project");
}
```

#### 传播错误

当编写一个其实先会调用一些可能会失败的操作的函数时，除了在这个函数中处理错误外，还可以选择让调用者知道这个错误并决定该如何处理。这被称为 `传播（propagating）`错误，这样能更好的控制代码调用，因为比起你代码所拥有的上下文，调用者可能拥有更多信息或逻辑来决定应该如何处理错误。rust 提供了一个`?` 运算符，来简化传播错误的代码。当 `Result` 的值是 `Ok`，这个 `？` 表达式将会返回 `Ok` 中的值而程序将继续执行。如果值是 `Err`，`？` 表达式会将 `Err` 作为整个函数的返回值，就好像使用了 `return` 关键字一样，这样错误值就被传播给了调用者。

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}
```

这里 `?` 运算符所使用的错误值实际上是被传递给了 `from` 函数，它定义于标准库的 `From` trait 中，可以用来将错误从一种类型转换为另一种类型。当 `?` 运算符调用 `from` 函数时，收到的错误类型被转换为由当前函数返回类型所指定的错误类型。例如，我们可以将上例中的 `read_username_from_file` 函数修改为返回一个自定义的 `OurError` 错误类型。如果我们也定义了 `impl From<io::Error> for OurError` 来从 `io::Error` 构造一个 `OurError` 实例，那么 `read_username_from_file` 函数体中的 `?` 运算符调用会调用 `from` 并转换错误而无需在函数中增加任何额外的代码。

使用 `？` 的链式方法调用来进一步缩短代码

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();

    File::open("hello.txt")?.read_to_string(&mut username)?;

    Ok(username)
}
```