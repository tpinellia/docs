---
author: mantic
title: 通用编程概念
date: 2024-07-03 10:00:00
summary: 介绍rust通用的编程概念：变量与可变性、数据类型、函数、注释、控制流等
usePageBundles: true
series: ["Rust程序设计语言"]
---

## 变量与可变性

可变性与不可变性，rust中，变量是默认不可变的。

```rust
let mut x = 5;  // mutable
x = 6;  
let y = 7;      // immutable
y = 8;          // cannot assign twice to immutable variable
```

## 常量

```rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```

与不可变变量类似，常量（constant）是绑定到一个常量名且不允许更改的值，但是常量和变量之间存在一些差异。

- 常量不允许使用 mut。常量不仅仅默认不可变，而且自始至终不可变。
- 常量使用 `const` 关键字而不是 let 关键字来声明，并且值的类型必须注明。
- 常量可以在任意作用域内声明，包括全局作用域，这对于代码中很多部分都需要知道一个值的情况特别有用。
- 常量只能设置为常量表达式，而不能是函数调用的结果或是只能在运行时计算得到的值。

常量的命名规范：全部字母都使用大写，并使用下划线分隔单词。

## 遮蔽(shadow)

可以使用相同的名字声明新的变量，新的变量就会shadow（隐藏）之前声明的同名变量。

```rust
    let x = 6;
    let x = x + 1;

    let mut y = "  ";
    let mut y = y.len();                 // 可以改变值的类型
    y = 4;

    println!("The value of x is {}",x);  // The value of x is 7
    println!("The value of y is {}",y);  // The value of y is 4
```

## 数据类型

Rust 是一种静态类型（statically typed）的语言，这意味着它必须在编译期知道所有变量的类型。编译器通常可以根据值和使用方式推导出我们想要使用的类型。当类型可能是多种情况时，我们必须加上一个类型标注。

```rust
    let guess = "42".parse().expect("Not a number!"); // 错误 type annotations needed
    let guess:u32 = "42".parse().expect("Not a number!"); // 正确 手动指定类型 :u32
```

### 标量类型

标量（scalar）类型表示单个值。Rust 有 4 个基本的标量类型：整型、浮点型、布尔型和字符。

##### 整数类型

|长度|有符号类型|无符号类型|
|-|-|-|
|8|i8|u8|
|16|i16|u16|
|32|i32|u32|
|64|i64|u64|
|128|i128|u128|
|arch|isize|usize|

`isize` 和 `usize` 类型取决于程序运行的计算机体系结构，在表中表示为“arch”：若使用 64 位架构系统则为 64 位，若使用 32 位架构系统则为 32 位。

整型字面量，除了字节类型外，所有整型字面量都允许使用类型后缀，例如: `56u8`。除此之外，可以添加 下划线`_`增加可读性，例如 `98222` 可以表示为 `98_222`。

|数字字面量|示例|
|-|-|
|十进制|98_222|
|十六进制|0xff|
|八进制|0o77|
|二进制|0b1111_0000|
|字节(仅限于u8)|b'A'|

##### 浮点类型

rust 浮点类型有两种基本类型，单精度浮点类型 `f32` 和 双精度浮点类型 `f64`。 默认浮点类型是 `f64`。

##### 布尔类型

rust 的布尔类型含有两种可能的值： `true` 和 `false`。布尔值的大小为 `1` 个字节。

##### 字符类型

rust 的 字符类型 `char` 用来描述语言中最基础的单个字符。字面量使用单引号括起来，例如：`'Z'`；这和字符串字面量不同，字符串字面量是用双括号括起来；rust 的 `char` 类型大小为4字节，表示的是一个 `Unicode` 标量值。

### 复合类型

rust 提供了两种基本的复合类型： `元组（tuple）` 和 `数组（array）`。

##### 元组

元组是将多种类型的多个值组合到一个复合类型中的一种基本方式。元组的长度是固定的：声明后，它们就无法增长或缩小。

获取元组中的个别值有两种办法：
- 从元组中获取个别值，可以使用模式匹配来解构（destructure）元组的一个值。
- 使用一个句点（.）连上要访问的值的索引来直接访问元组元素

```rust
    let tup: (i32,f64,u8) = (500,6.4,1);
    let (x,y,z) = tup;                    // 解构
    println!("{},{},{}",x,y,z);           // 500,6.4,1
    let five_hundred = tup.0;             // 使用点(.)来访问
    println!("{}",five_hundred);          // 500
```

没有任何值的元组 `()` 是一种特殊的类型，只有一个值，也写成 `()`。该类型被称为单元类型（unit type），该值被称为单元值（unit value）。

##### 数组

将多个值组合在一起的另一种方式就是使用数组（array）。与元组不同，数组的每个元素必须具有相同的类型。与某些其他语言中的数组不同，Rust 中的数组具有固定长度。

数组是可以在栈上分配的已知固定大小的单个内存块。可以使用索引访问数组的元素。如果索引大于或等于数组长度，Rust 会出现 panic。
```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
let b = [3; 5];

let first = a[0];
let second = a[1];
```

## 函数

rust 使用 `fn` 声明新函数，且函数和变量名使用下划线命名法（snake case，直译为蛇形命名法）规范风格。rust 函数的参数必须指明类型。

```rust
fn main() {
    print_labeled_measurement(5, 'h');
}

fn print_labeled_measurement(value: i32, unit_label: char) {
    println!("The measurement is: {}{}", value, unit_label);
}
```

rust 的函数体由一系列语句组成，语句是执行一些动作但不返回值的指令；可选的由一个表达式结束；rust 是一个基于表达式的语言，表达式会计算产生一个值。函数的定义也是一个语句，语句不返回值，所以不能使用 let 将一个语句赋给一个变量。

- 使用 let 关键字创建变量并绑定一个值是一个语句。例如：`let x = 6;`
- 函数定义本身是个语句。`fn main() { let y = 6; }`
- `let y = 6;` 中的 6 是一个表达式，它计算出的值是 6。
- 函数调用是一个表达式。
- 宏调用是一个表达式。
- 我们用来创建新作用域的大括号（代码块） {} 也是一个表达式，例如： `let y = { let x = 4; x + 1};`
- `if` 语句是表达式。

## 注释

注释常见的分为单行注释 `//` 与多行注释 `/**/`。 

```rust

fn main() {
    /*
    多行
    注释
    */
    
    // 单行注释

    println!("{}","注释");

}

```

## 控制流

### if表达式

if 表达式允许根据条件执行不同的代码分支。你提供一个条件并表示 “如果条件满足，运行这段代码；如果条件不满足，不运行这段代码。”

```rust
fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }
}
```

因为 if 是一个表达式，我们可以在 let 语句的右侧使用它来将结果赋值给一个变量。

```rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("The value of number is: {}", number);
}
```

### loop 重复执行代码

使用 `loop`重复执行代码/。`loop` 关键字告诉 Rust 一遍又一遍地执行一段代码直到你明确要求停止。如果存在嵌套循环，`break` 和 `continue` 应用于此时最内层的循环。你可以选择在一个循环上指定一个 `循环标签`（loop label），然后将标签与 `break` 或 `continue` 一起使用，使这些关键字应用于已标记的循环而不是最内层的循环。

```rust
fn main() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {}", count);
        let mut remaining = 10;

        loop {
            println!("remaining = {}", remaining);
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {}", count);
}
```

可以在用于停止循环的 `break` 表达式添加你想要返回的值，该值将从循环中返回，以便您可以使用它。

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {}", result);
}
```

### while 条件循环

`while` 一般用来执行条件循环。

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{}!", number);

        number -= 1;
    }

    println!("LIFTOFF!!!");
}
```

### for 遍历集合

`for` 常用来遍历集合。

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {}", element);
    }
}
```

`Range` 是由标准库提供的类型，用来生成从一个数字开始到另一个数字之前结束的所有数字的序列。例如：`(1..4)`