---
author: mantic
title: 使用包、Crate 和模块管理不断增长的项目
date: 2024-07-10 10:00:00
summary: 介绍如何使用包、Crate 和模块管理不断增长的项目
usePageBundles: true
series: ["Rust程序设计语言"]
---

Rust 有许多功能可以让你管理代码的组织，包括哪些内容可以被公开，哪些内容作为私有部分，以及程序每个作用域中的名字。这些功能，有时被统称为 `模块系统（the module system）`，包括：

- 包（Packages）：Cargo 的一个功能，它允许你构建、测试和分享 crate。
- Crates ：一个模块的树形结构，它形成了库或二进制项目。
- 模块（Modules）和 use：允许你控制作用域和路径的私有性。
- 路径（path）：一个命名例如结构体、函数或模块等项的方式。

## 包和Crate

`包（package）`是提供一系列功能的一个或者多个 `crate`：
- 包含一个 `Cargo.toml` 文件，阐述如何去构建这些 `crate`；
- 包中可以包含 0个 或 1个 `库 crate(library crate)`;
- 包中可以包含任意多个`二进制 crate(binary crate)`；
- 必须至少包含一个 crate（无论是库的还是二进制的）；

`crate` 有两种形式：
- `二进制crate`，二进制crate 可以被编译为可执行程序，它们必须有一个`main`函数；
- `库crate`，库crate 并没有 `main` 函数，它们也不会编译为可执行程序，它们提供一些诸如函数之类的东西，使其他项目也能使用这些东西。

`crate root` 是一个源文件，Rust 编译器以它为起始点，并构成你的 crate 的根模块。 `Cargo` 遵循的一个约定：`src/main.rs` 就是一个与包同名的`二进制 crate` 的 `crate 根`。同样的，Cargo 知道如果包目录中包含 `src/lib.rs`，则包带有与其同名的`库 crate`，且 `src/lib.rs` 是 `crate 根`。`crate 根文件`将由 Cargo 传递给 `rustc` 来实际构建库或者二进制项目。

{{% notice note "二进制和库crate包的最佳实践" %}}
模块树应该定义在 src/lib.rs 中。这样通过以包名开头的路径，公有项就可以在二进制 crate 中使用。二进制 crate 就完全变成了同其它 外部 crate 一样的库 crate 的用户：它只能使用公有 API。这有助于你设计一个好的 API；你不仅仅是作者，也是用户！
{{% /notice %}}

## 定义模块来控制作用域与私有性

`模块（Module）`让我们可以将一个 crate 中的代码进行分组，以提高可读性与重用性；同时也可以用它来控制代码控制`项（item）`的 `私有性`和`公有性`。

定义一个`模块（Module）`，是以 `mod` 关键字为起始，然后指定模块的名字（本例中叫做 front_of_house），并且用花括号包围模块的主体。模块可以嵌套，也可以保存一些定义的其他项，比如结构体、枚举、常量、特性、或者函数。

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}
```

![](./images/2024-07-15_21-10-29.png '图7-1 模块树的结构')

`src/main.rs` 和 `src/lib.rs` 叫做 crate 根，也就是图中的`crate`，也叫隐式模块。我们说整个模块树都植根于名为 `crate` 的隐式模块下。

## 引用模块项目的路径

Rust 如何在模块树中找到一个项的位置，我们使用`路径`的方式。路径有两种形式， `绝对路径（absolute path）` 和 `相对路径（relative path）`，我们更倾向于使用`绝对路径`：

- `绝对路径（absolute path）` 是以 crate 根（root）开头的全路径；对于外部 crate 的代码，是以 crate 名开头的绝对路径，对于当前 crate 的代码，则以字面值 crate 开头。
- `相对路径（relative path）` 从当前模块开始，以 `self`、`super` 或定义在当前模块中的标识符开头。

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();

    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}
```

在 Rust 中，默认所有项（函数、方法、结构体、枚举、模块和常量）对父模块都是私有的。如果希望创建一个私有函数或结构体，你可以将其放入一个模块。父模块中的项不能使用子模块中的私有项，但是子模块中的项可以使用它们父模块中的项。我们可以使用 `pub` 关键字将其设置为公有。

#### super 开始的相对路径

```rust
fn deliver_order() {}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        super::deliver_order();
    }

    fn cook_order() {}
}
```

#### 创建公有结构体和枚举

可以使用 `pub` 来设计公有的结构体和枚举，不过关于在结构体和枚举上使用 pub 还有一些额外的细节需要注意：
- 将结构体设为公有，但这个结构体的字段仍然是私有的。我们可以根据情况决定每个字段是否公有。
- 将枚举设为公有，则它的所有成员都将变为公有。

```rust
mod back_of_house {
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
}

pub fn eat_at_restaurant() {
    // 在夏天订购一个黑麦土司作为早餐
    let mut meal = back_of_house::Breakfast::summer("Rye");
    // 改变主意更换想要面包的类型
    meal.toast = String::from("Wheat");
    println!("I'd like {} toast please", meal.toast);

    // 如果取消下一行的注释代码不能编译；
    // 不允许查看或修改早餐附带的季节水果
    // meal.seasonal_fruit = String::from("blueberries");
}
```

```rust
mod back_of_house {
    pub enum Appetizer {
        Soup,
        Salad,
    }
}

pub fn eat_at_restaurant() {
    let order1 = back_of_house::Appetizer::Soup;
    let order2 = back_of_house::Appetizer::Salad;
}
```

## 使用 use 关键字将路径引入作用域

我们可以使用 `use` 关键字创建一个短路径，然后就可以在作用域中的任何地方使用这个更短的名字；通过 `use` 引入作用域的路径也会检查私有性与公有性。

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

#### use的习惯用法

在引用函数时，使用 `use` 将函数的父模块引入作用域，我们必须在调用函数时指定父模块，这样可以清晰地表明函数不是在本地定义的，同时使完整路径的重复度最小化；而当我们使用 `use` 引入结构体、枚举和其他项时，习惯是指定它们的完整路径，但如果有同名条目，我们引用到父级即可，另一种做法是，可以使用 `as` 关键字提供新的名称。

```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
    // --snip--
}

fn function2() -> IoResult<()> {
    // --snip--
}
```

#### 使用 pub use 重导出名称

使用 `use` 关键字，将某个名称导入当前作用域后，这个名称在此作用域中就可以使用了，但它对此作用域之外还是私有的。如果想让其他人调用我们的代码时，也能够正常使用这个名称，就好像它本来就在当前作用域一样，那我们可以将 `pub` 和 `use` 合起来使用。这种技术被称为 `“重导出（re-exporting）”`：我们不仅将一个名称导入了当前作用域，还允许别人把它导入他们自己的作用域。

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

#### 使用外部包

例如，我们使用外部包 `rand`，那么，只需要在 `Cargo.toml` 添加以下行： `rand = "0.8.5"` ，`Cargo` 就会从 [crates.io](https://crates.io) 下载 rand 和其依赖，并使其可在项目代码中使用。

#### 嵌套路径来消除大量的 use 行

```rust
use std::cmp::Ordering;
use std::io;
// 可以改为
use std::{cmp::Ordering, io};

use std::io;
use std::io::Write;
// 可以改为
use std::io::{self, Write};
```

#### 通过 glob 运算符将所有的公有定义引入作用域

如果希望将一个路径下 所有 公有项引入作用域，可以指定路径后跟 `*`，即 glob 运算符： `use std::collections::*;` 。 一般不建议使用该 `glob运算符` ，因为它会使得我们难以推导作用域中有什么名称和它们是在何处定义的。但如下两个场景，是可以使用的：

- glob 运算符经常用于测试模块 tests 中，这时会将所有内容引入作用域；
- glob 运算符有时也用于 prelude 模式。

## 将模块拆分成多个文件