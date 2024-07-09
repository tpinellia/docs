---
author: mantic
title: 常见编程概念
date: 2024-07-02 10:00:00
summary: 介绍rust常见的编程概念
usePageBundles: true
series: ["Rust程序设计语言"]
---

## 名词
1. prelude
2. `let`  `let mut`
3. 关联函数: `::new` 那一行的 `::` 语法表明 new 是 String 类型的一个关联函数。关联函数（associated function）是实现一种特定类型的函数。
4. `&` 引用
5. `crate` 是一个 Rust 代码包。分为 `二进制crate` 和 `库crate`。 `二进制crate` 生成一个可执行文件； 而`库crate` 可以包含任意能被其他程序使用的代码，但是不能独自执行。
6. `cargo update`，将crate更新到新版本。
7. `trait`,类似于其他语言的接口。
8. 遮蔽 （shadow）,用来隐藏同名的变量。



## 一个例子

```rust
use std::io; //prelude 序曲,预导入

fn main() {
    println!("猜数"); //println! 宏

    let mut guess = String::new();
    // String是struct类型，`::`语法表示new是String类型的关联函数，表示该函数是针对该String类型来实现的，而不是String类型的某个实例

    io::stdin().read_line(&mut guess).expect("无法读取行");

    println!("你猜测的数是: {}",guess);
}
```

`use std::io;`

默认情况下，Rust 设定了若干个会自动导入到每个程序作用域中的标准库内容，这组内容被称为 预导入（prelude） 内容。

`fn main() {` 

`fn` 语法声明了一个新函数，小括号为空 `()` 表明没有参数，大括号 `{` 作为函数体的开始。

`println!("猜数");`

`println!` 是一个在屏幕上打印字符串的宏。

`let mut guess = String::new();`

我们使用 `let` 语句创建变量。这里是另外一个例子 `let apple = 5;` rust中，变量默认是不可变的。

```rust
let apples = 5; //不可变 immutable
let mut bananas = 5; //可变 mutable
```

`io::stdin().read_line(&mut guess).expect("无法读取行");`

`&` 表示这个参数是一个引用（reference），这为你提供了一种方法，让代码的多个部分可以访问同一处数据，而无需在内存中多次拷贝。

`read_line`会返回一个值`io::Result`。 Rust 标准库中有很多名为 `Result` 的类型：一个通用的 `Result` 以及在子模块中的特化版本，比如 `io::Result`。Result 类型是 `枚举`（enumerations），通常也写作 enum。枚举类型持有固定集合的值，这些值被称为枚举的`成员`（variant）。枚举往往与条件表达式 `match` 一起使用，match 是一种条件语句，在其被执行时，可以方便地匹配不同枚举值来执行不同的代码。

`Result` 的成员是 `Ok` 和 `Err`，`Ok` 成员表示操作成功，且 `Ok` 内部包含成功生成的值。`Err` 成员则意味着操作失败，并且包含失败的前因后果。

`Result` 类型的值，就像任何类型的值一样，都有为其定义的方法。`io::Result` 的实例拥有 `expect` 方法。如果 `io::Result` 实例的值是 `Err`，`expect` 会导致程序崩溃，并显示传递给 `expect` 的参数。如果 `read_line` 方法返回 `Err`，则可能是底层操作系统引起的错误结果。如果 `io::Result` 实例的值是 `Ok`，`expect` 会获取 `Ok` 中的值并原样返回，以便你可以使用它。在本例中，这个值是用户输入的字节数。