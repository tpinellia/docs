---
author: mantic
title: 泛型、Trait 和生命周期
date: 2024-07-13 10:00:00
summary: 讨论rust的泛型、Trait 和生命周期
usePageBundles: true
series: ["Rust程序设计语言"]
toc: true
---

## 泛型数据类型

`泛型` 是具体类型或其他属性的抽象替代。我们可以使用泛型为像函数签名或结构体这样的项创建定义，这样它们就可以用于多种不同的具体数据类型。

### 在函数定义中使用泛型

举个泛型的例子：`fn largest<T>(list: &[T]) -> &T {}` 可以这样理解这个定义：函数 largest 有泛型类型 T。它有个参数 list，其类型是元素为 T 的 slice。largest 函数会返回一个与 T 相同类型的引用。

### 结构体定义中的泛型

```rust
struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    let both_integer = Point { x: 5, y: 10 };
    let both_float = Point { x: 1.0, y: 4.0 };
    let integer_and_float = Point { x: 5, y: 4.0 };
}
```

### 枚举定义中的泛型

```rust
enum Option<T> {
    Some(T),
    None,
}
```

### 方法定义中的泛型

注意必须在 `impl` 后面声明 `T`，这样就可以在 `Point<T>` 上实现的方法中使用 `T` 了。通过在 `impl` 之后声明泛型 `T`，Rust 就知道 `Point` 的尖括号中的类型是泛型而不是具体类型。

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p = Point { x: 5, y: 10 };

    println!("p.x = {}", p.x());
}
```

### 泛型代码的性能

泛型并不会使程序比具体类型运行得慢。Rust 通过在编译时进行泛型代码的 `单态化（monomorphization）`来保证效率。单态化是一个通过填充编译时使用的具体类型，将通用代码转换为特定代码的过程。

## Trait：定义共同行为

`trait` 定义了某个特定类型拥有可能与其他类型共享的功能。可以通过 `trait` 以一种抽象的方式定义共同行为。可以使用 `trait bounds` 指定泛型是任何拥有特定行为的类型。

> 注意：`trait` 类似于其他语言中的常被称为 `接口（interfaces）`的功能，虽然有一些不同。

### 定义 trait

一个类型的行为由其可供调用的方法构成。如果可以对不同类型调用相同的方法的话，这些类型就可以共享相同的行为了。`trait` 定义是一种将方法签名组合起来的方法，目的是定义一个实现某些目的所必需的行为的集合。

```rust
pub trait Summary {
    fn summarize(&self) -> String;
}
```

### 为类型实现 trait

```rust
pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```

### 实现 trait 的约束

只有在 trait 或类型至少有一个属于当前 crate 时，我们才能对类型实现该 trait，而不能为外部类型实现外部 trait。这个限制是被称为 `相干性（coherence）`的程序属性的一部分，或者更具体的说是 `孤儿规则（orphan rule）`，其得名于不存在父类型。这条规则确保了其他人编写的代码不会破坏你代码，反之亦然。没有这条规则的话，两个 crate 可以分别对相同类型实现相同的 trait，而 Rust 将无从得知应该使用哪一个实现。

### trait 作为参数

可以使用 `impl Trait` 语法使 `trait` 作为参数

```rust
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```

#### Trait Bound 语法

`impl Trait` 语法适用于直观的例子，它实际上是一种较长形式我们称为 *trait bound* 语法的语法糖。

```rust
pub fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```

`pub fn notify(item1: &impl Summary, item2: &impl Summary) {}` 这适用于 item1 和 item2 允许是不同类型的情况（只要它们都实现了 Summary）。如果需要强制它们都是相同类型，那么需要使用 *trait bound* 语法糖： `pub fn notify<T: Summary>(item1: &T, item2: &T) {}`

#### 通过 + 指定多个 trait bound

`pub fn notify(item: &(impl Summary + Display)) {}`，或者`pub fn notify<T: Summary + Display>(item: &T) {}`

#### 通过 where 简化 trait bound

使用过多的 `trait bound` 也有缺点。每个泛型有其自己的 `trait bound`，所以有多个泛型参数的函数在名称和参数列表之间会有很长的 `trait bound` 信息，这使得函数签名难以阅读。例如:`fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {}`，我们可以使用`where` 从句精简：

```rust
fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
```

### 返回实现了 trait 的类型

也可以在返回值中使用 `impl Trait` 语法，来返回实现了某个 trait 的类型：

```rust
fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from(
            "of course, as you probably already know, people",
        ),
        reply: false,
        retweet: false,
    }
}
```

#### 使用 trait bound 有条件地实现方法

通过使用带有 `trait bound` 的泛型参数的 `impl` 块，可以有条件地只为那些实现了特定 trait 的类型实现方法。

```rust
use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

// 无论T是什么类型，都为它实现new方法
impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}

// 只有T实现了Display + PartialOrd这两个trait的时候，才为它实现cmp_display方法
impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}
```

可以对任何实现了特定 trait 的类型有条件地实现 trait。对任何满足特定 `trait bound` 的类型实现 trait 被称为 `blanket implementations`

```rust
impl<T: Display> ToString for T {
    // --snip--
}
```

## 生命周期确保引用有效