---
author: mantic
title: struct
date: 2024-07-08 10:00:00
summary: 介绍rust的struct
usePageBundles: true
series: ["Rust程序设计语言"]
---

`struct`，或者 `structure`，是一个自定义数据类型，允许你包装和命名多个相关的值，从而形成一个有意义的组合。

## 结构体的定义和实例化

定义结构体，需要使用 `struct` 关键字并为整个结构体提供一个名字。结构体的名字需要描述它所组合的数据的意义。接着，在大括号中，定义每一部分数据的名字和类型，我们称为 `字段（field）`

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```

使用结构体需要为每个字段指定具体值，我们称之为创建这个结构体的 `实例`。创建一个实例需要以结构体的名字开头，接着在大括号中使用 `key: value`，即 `键 - 值`对 的形式提供字段，其中 `key` 是字段的名字，`value` 是需要存储在字段中的数据值。实例中字段的顺序不需要和它们在结构体中声明的顺序一致。

```rust
    let user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };
```

从结构体中获取某个特定的值，可以使用点号。如果结构体的实例是可变的，即使用 `mut`，那么我们可以使用点号并为对应的字段赋值。注意整个实例必须是可变的；Rust 并不允许只将某个字段标记为可变。另外需要注意同其他任何表达式一样，我们可以在函数体的最后一个表达式中构造一个结构体的新实例，来隐式地返回这个实例。

```rust
// 创建可变的实例
    let mut user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

    user1.email = String::from("anotheremail@example.com");

// 隐式的返回实例
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username: username,
        email: email,
        sign_in_count: 1,
    }
}
```

#### 字段初始化简写语法

当字段名与字段值对应的变量名相同时，可以使用 `字段初始化简写语法` 。

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}
```

#### 结构体更新语法

使用旧实例的大部分值但改变其部分值来创建一个新的结构体实例时，可以使用 `结构体更新语法` 。结构更新语法就像带有 `=` 的赋值，因为它移动了数据。如果移动的数据都是实现 `Copy trait` 的类型，那么新旧实例都有效；如果移动的数据里存在未实现 `Copy trait` 的类型，那么旧实例就不能再使用了。

```rust
// 不使用结构体更新语法

    let user2 = User {
        active: user1.active,
        username: user1.username,
        email: String::from("another@example.com"),
        sign_in_count: user1.sign_in_count,
    };

// 使用结构体更新语法
    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
```

## 方法语法