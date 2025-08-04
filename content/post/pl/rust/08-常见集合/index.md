---
author: mantic
title: 常见集合
date: 2024-07-11 10:00:00
summary: 讨论如何创建和更新 vector、字符串和哈希 map，以及它们有什么特别之处
usePageBundles: true
series: ["Rust程序设计语言"]
---

## 使用 Vector 储存列表

类型 `Vec<T>`，也被称为 vector。它允许我们在一个单独的数据结构中储存多于一个的值，它在内存中彼此相邻地排列所有的值。

#### 新建vector

一般有两种方式创建vector,一种是使用 `Vec::new` 函数；另一种是使用 `vec!`宏。通常我们较多使用的是 `vec!` 宏的形式创建 vector。

```rust
let v: Vec<i32> = Vec::new();
// 使用vec!宏
let v = vec![1, 2, 3];
```

#### 向 Vector 添加元素

注意使用 `mut` 使其可变。

```rust
    let mut v = Vec::new();

    v.push(5);
```

#### 删除 Vector

类似于任何其他的 struct，vector 在其离开作用域时会被释放，包括其元素。

```rust
    {
        let v = vec![1, 2, 3, 4];

        // do stuff with v
    } // <- v goes out of scope and is freed here
```

#### 读取 Vector 的元素

有两种方法引用 vector 中储存的值：通过索引或使用 `get` 方法。

```rust
    let v = vec![1, 2, 3, 4, 5];

    let third: &i32 = &v[2];
    println!("The third element is {third}");

    let third: Option<&i32> = v.get(2);
    match third {
        Some(third) => println!("The third element is {third}"),
        None => println!("There is no third element."),
    }
```

#### 遍历 Vector 的元素

```rust
// 不可变引用并打印
    let v = vec![100, 32, 57];
    for i in &v {
        println!("{i}");
    }
// 可变引用并更改元素值
    let mut v = vec![100, 32, 57];
    for i in &mut v {
        *i += 50;
    }
```

#### 使用枚举来储存多种类型

vector 只能储存相同类型的值。这是很不方便的；绝对会有需要储存一系列不同类型的值的用例。幸运的是，枚举的成员都被定义为相同的枚举类型，所以当需要在 vector 中储存不同类型值时，我们可以定义并使用一个枚举！

```rust
    enum SpreadsheetCell {
        Int(i32),
        Float(f64),
        Text(String),
    }

    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];
```

## 使用字符串储存 UTF-8 编码的文本

在开始深入这些方面之前，我们需要讨论一下术语 字符串 的具体意义。Rust 的核心语言中只有一种字符串类型，字符串slice： `str`，它通常以被借用的形式出现，`&str`，它是一些对储存在别处的 UTF-8 编码字符串数据的引用。举例来说，由于字符串字面值被储存在程序的二进制输出中，因此字符串字面值也是`字符串slice`。

字符串（`String`）类型由 Rust 标准库提供，而不是编入核心语言，它是一种可增长、可变、可拥有、UTF-8 编码的字符串类型。当 Rustaceans 提及 Rust 中的 "字符串 "时，他们可能指的是 `String` 或 字符串slice即 `&str` 类型，而不仅仅是其中一种类型，而且这两种类型都是 UTF-8 编码的。

#### 新建 String

```rust
    // 新建一个空的字符串
    let mut s = String::new();

    // 使用to_string方法从字符串字面值构建
    let data = "initial contents";

    let s = data.to_string();

    // 使用String::from()函数从字符串字面值创建
    let s = String::from("initial contents");
```

#### 更新String

使用 `push_str` 和 `push` 附加字符串

```rust
    // 使用push_str
    let mut s = String::from("foo");
    s.push_str("bar");

    // 使用push
    let mut s = String::from("lo");
    s.push('l');
```

使用 `+` 运算符或 `format!` 宏拼接字符串

```rust
    // 使用 + 运算符
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2; // 注意 s1 被移动了，不能继续使用

    // 使用format!宏
    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");

    let s = format!("{s1}-{s2}-{s3}");
```

#### 索引 String

`String` 是一个 `Vec<u8>` 的封装。Rust 不允许使用索引获取 String 字符的原因是，索引操作预期总是需要常数时间（O(1)）。但是对于 String 不可能保证这样的性能，因为 Rust 必须从开头到索引位置遍历来确定有多少有效的字符。

#### 遍历字符串的方法

对于获取unicode标量值，使用 `chars()` 方法

```rust
for c in "Зд".chars() {
    println!("{c}");
}
```

对于获取原始字节，使用 `bytes()` 方法

```rust
for b in "Зд".bytes() {
    println!("{b}");
}
```

## 使用 Hash Map 储存键值对

`哈希 map（hash map）`。`HashMap<K, V>` 类型储存了一个键类型 K 对应一个值类型 V 的映射，所有的键必须是相同类型，值也必须都是相同类型。它通过一个 哈希函数（hashing function）来实现映射，决定如何将键和值放入内存中。

#### 新建一个哈希 map

可以使用 `new` 创建一个空的 HashMap，并使用 `insert` 增加元素

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
```


#### 哈希 map 和所有权

对于像 `i32` 这样的实现了 `Copy trait` 的类型，其值可以拷贝进哈希 map。对于像 `String` 这样拥有所有权的值，其值将被移动而哈希 map 会成为这些值的所有者。而如果将值的引用插入哈希 map，这些值本身将不会被移动进哈希 map，但是这些引用指向的值必须至少在哈希 map 有效时也是有效的。

```rust
    use std::collections::HashMap;

    let field_name = String::from("Favorite color");
    let field_value = String::from("Blue");

    let mut map = HashMap::new();
    map.insert(field_name, field_value);
    // 这里 field_name 和 field_value 不再有效，
```

#### 访问哈希 map 中的值

可以通过 `get` 方法并提供对应的键来从哈希 map 中获取值。

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    let team_name = String::from("Blue");
    let score = scores.get(&team_name);

    match score {
        Some(s) => println!("{}",s),
        None => println!("team not exist"),
    }
```

可以使用与 vector 类似的方式来遍历哈希 map 中的每一个键值对，也就是 `for` 循环

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    for (key, value) in &scores {
        println!("{key}: {value}");
    }
```

#### 更新哈希 map

哈希map的每个K同时只能对应一个V，那么更新哈希map就存在三种情况：
- 覆盖一个值
- 只在键没有对应值时插入键值对
- 根据旧值更新一个值

```rust
    // 覆盖一个值
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Blue"), 25);

    println!("{scores:?}");
    
    // 只在键没有对应值时插入键值对
    // entry，它获取我们想要检查的键作为参数。entry 函数的返回值是一个枚举，Entry，它代表了可能存在也可能不存在的值。
    // Entry 的 or_insert 方法在键对应的值存在时就返回这个值的可变引用，如果不存在则将参数作为新值插入并返回新值的可变引用。
    use std::collections::HashMap;

    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50);

    println!("{scores:?}");

    // 根据旧值更新一个值
    use std::collections::HashMap;

    let text = "hello world wonderful world";

    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }

    println!("{map:?}");
```

#### 哈希函数

HashMap 默认使用一种叫做 SipHash 的哈希函数，它可以抵御涉及哈希表（hash table）1 的拒绝服务（Denial of Service, DoS）攻击。然而这并不是可用的最快的算法，不过为了更高的安全性值得付出一些性能的代价。如果性能监测显示此哈希函数非常慢，以致于你无法接受，你可以指定一个不同的 hasher 来切换为其它函数。hasher 是一个实现了 `BuildHasher` trait 的类型。第十章会讨论 trait 和如何实现它们。你并不需要从头开始实现你自己的 hasher；[crates.io](https://crates.io) 有其他人分享的实现了许多常用哈希算法的 hasher 的库。

