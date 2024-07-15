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

####  元祖结构体

可定义与元祖类似的结构体，称为 `元组结构体（tuple structs）`。元组结构体有着结构体名称提供的含义，但没有具体的字段名，只有字段的类型。

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

注意 black 和 origin 值的类型不同，因为它们是不同的元组结构体的实例；其他方面，元组结构体实例类似于元组，你可以将它们解构为单独的部分，也可以使用 `.` 后跟索引来访问单独的值，等等。

#### 类单元结构体

我们也可以定义一个没有任何字段的结构体，它们被称为 `类单元结构体（unit-like structs）`，因为它们类似于 `()`，即“元组类型”一节中提到的 `unit（单元）类型` 。适用于需要在某个类型上实现某个 trait，但又没有想要存储的数据。

```rust
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
```

## 方法语法

`方法（method）`与函数类似：它们使用 fn 关键字和名称声明，可以拥有参数和返回值，同时包含在某处调用该方法时会执行的代码。不过方法与函数是不同的，因为它们在 结构体，枚举 或者 trait对象 的上下文中被定义，并且它们第一个参数总是 `self`，它代表调用该方法的结构体实例。

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

在 `impl` 块 （impl 是 implementation 的缩写）中定义方法。方法的第一个参数可以是 `self`，也可以获得其 所有权(`&self`) 或 可变借用(`&mut self`)，和其他参数一样。调用时使用 `实例.方法名(参数)`。在方法 `fn area(&self) -> u32 { self.width * self.height }`中，`&self` 实际上是 `self: &Self`缩写，在一个 `impl` 块中，`Self`类型是`impl`块的类型的别名，在这个例子中，`Self`指的是`Rectangle`。

#### 关联函数

所有在 `impl` 块中定义的函数被称为 `关联函数（associated functions）`，因为它们与 `impl` 后面命名的类型相关。方法就是比较特殊的关联函数，只有当以 `self` 为第一参数的关联函数才叫方法；当然也可以定义不以 `self` 为第一参数的关联函数（因此不是方法），因为它们并不作用于一个结构体的实例。不是方法的关联函数经常被用作返回一个结构体新实例的构造函数。这些函数的名称通常起做 `new`，当然也可以使用别的名字。

```rust

struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn new(width: u32,height: u32) -> Self {
        Self {
            width: width,
            height: height,
        }
    }

    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main(){
    let rectangle = Rectangle::new(10,20);
    println!(
        "The area of the rectangle is {} square pixels.",
        rectangle.area()
    );
}

```

关键字 `Self` 在函数的返回类型中代指在 `impl` 关键字后出现的类型，在这里是 `Rectangle`。

使用结构体名和 `::` 语法来调用这个关联函数：比如 `let sq = Rectangle::square(3);`。