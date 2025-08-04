---
author: mantic
title: 枚举与模式匹配
date: 2024-07-09 10:00:00
summary: 介绍rust的枚举与模式匹配
usePageBundles: true
series: ["Rust程序设计语言"]
---

## 枚举的定义

`枚举（enumerations）`，也被称作 `enums`。枚举允许你通过列举可能的 `成员（variants）`来定义一个类型。

```rust

enum IpAddrKind {
    V4,
    V6,
}

```

创建 `枚举值`： 枚举的成员位于其标识符的命名空间中，并使用两个冒号分开。

```rust
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;
```

可以将任意类型的数据直接放到每一个枚举成员中，而且每个枚举成员可以拥有不同的类型及关联的数据量，例如字符串，数字类型或者结构体，甚至可以包含另一个枚举。

```rust
    enum IpAddr {
        V4(u8, u8, u8, u8),
        V6(String),
    }

    let home = IpAddr::V4(127, 0, 0, 1);

    let loopback = IpAddr::V6(String::from("::1"));
```

#### Option 枚举和其相对于空值的优势

`Option` 是标准库定义的一个枚举类型。Option 类型应用广泛因为它编码了一个非常普遍的场景，即一个值要么有值要么没值。

```rust
enum Option<T> {
    None,
    Some(T),
}

let some_number = Some(5);
let some_char = Some('e');
let absent_number: Option<i32> = None;
```

## match控制流语法

Rust 有一个叫做 `match` 的极为强大的控制流运算符，它允许我们将一个值与一系列的模式相比较，并根据相匹配的模式执行相应代码。模式可由字面值、变量、通配符和许多其他内容构成。

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

#### 绑定值的模式

匹配分支的另一个有用的功能是可以绑定匹配的模式的部分值。这也就是如何从枚举成员中提取值的。例如，这里我们传入 `Some(5)`，那么会匹配到模式 `Some(i)` ，这时，`5` 就会绑定到 `i` 变量上，这样就可以提取出来使用了。

```
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None,
            Some(i) => Some(i + 1),
        }
    }

    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
```

#### 通配模式和 _ 占位符

`match` 匹配分支必须是有穷尽的，如果确实情况较多，可以使用 `通配模式` 或 `_` 通配符，替代其余没列出来的值。

```rust
// 通配模式：这里将可能的其他数字，绑定到一个变量上，这里绑定到other_num上
    
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        other_num => move_player(other_num),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn move_player(num_spaces: u8) {}

// 如果不想绑定变量使用，那么可以使用_通配符

    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => reroll(),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn reroll() {}
```

## if let简洁控制流

`if let` 来处理只匹配一个模式的值而忽略其他模式的情况。

```rust
// 使用if let
    let config_max = Some(3u8);
    if let Some(max) = config_max {
        println!("The maximum is configured to be {max}");
    }
// 等同于下面的 match 语法
    let config_max = Some(3u8);
    match config_max {
        Some(max) => println!("The maximum is configured to be {max}"),
        _ => (),
    }
```