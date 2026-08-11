
# 机房综合管理系统 · Java 后端手把手教程

> **这份文档的定位**：你的书面老师。
>
> 它假设你只会 Java 基础语法（类、方法、`if`、`for`、`List`），**不假设你懂 Spring、Maven、注解、数据库框架**。
> 凡是超出"Java 基础"的概念，本文都会**先讲明白，再让你用**。
>
> 每一步的固定结构：
>
> | 环节 | 说明 |
> |---|---|
> | **① 为什么要做这一步** | 不讲清楚原因就抄代码，等于背答案，换个题就废了 |
> | **② 代码** | 阶段 1-7 给可直接复制的完整核心文件；阶段 8-11 已掌握模板后，明确标注结构片段和需要补齐的文件 |
> | **③ 逐行讲解** | 每个陌生的注解、每个陌生的类，都解释 |
> | **④ 怎么验证** | 明确的、可观察的成功标志。看不到就是没成功，别往下走 |
> | **⑤ 学到了什么 / 自测题** | 合上文档能答出来，才算真的会了 |

---

## 目录

| 章节 | 内容 | 你需要花的时间 |
|---|---|---|
| **第一部分** | 环境体检报告（针对你这台 Mac 的实测结果） | 30 分钟 |
| **第二部分** | Java 补课：Spring 代码里那些"基础 Java 没教过"的东西 | 2 小时（必读） |
| **第三部分** | 项目地图：动手前先看懂全局 | 30 分钟 |
| **第四部分** | 阶段 1 - 11：一步步把后端写出来 | 30 - 40 小时 |
| **第五部分** | 排错手册与开发习惯 | 随用随查 |

---

## 学习路线总览

| 阶段 | 你会做出什么 | 预计耗时 | 难度 |
|---|---|---|---|
| 阶段 1 | 浏览器访问 `localhost:8080/api/test` 有返回 | 1 小时 | ★ |
| 阶段 2 | 写个 Java 类，数据库里自动出现一张表 | 1-2 小时 | ★★ |
| 阶段 3 | Postman 能查到用户列表（第一次打通四层） | 2-3 小时 | ★★★ |
| 阶段 4 | 人员模块增删改查 + 分页搜索全部完成 | 3-4 小时 | ★★★ |
| 阶段 5 | **前端页面显示数据库真实数据（第一个里程碑）** | 2 小时 | ★★ |
| 阶段 6 | 真实注册登录，JWT 鉴权 | 4-6 小时 | ★★★★ |
| 阶段 7 | 不同角色看到不同按钮，后端独立校验权限 | 3-4 小时 | ★★★★ |
| 阶段 8 | 设备管理（这时候你会发现是复制粘贴） | 3-4 小时 | ★★ |
| 阶段 9 | 耗材库存 + 事务（库存不足无法出库） | 3-4 小时 | ★★★ |
| 阶段 10 | 考勤打卡、迟到判断 | 3-4 小时 | ★★★ |
| 阶段 11 | 首页仪表盘数字是真的 | 2 小时 | ★★ |

---

## 最重要的一条方法论：垂直切片

新手最容易犯的错误是**横向分层**：

> 先把 12 张表的实体类全建好 → 再写所有 Service → 再写所有 Controller

结果写到第三天，屏幕上还是什么都看不到，一运行几十个报错，无从下手，然后放弃。

**正确做法是垂直切片**：一次只打通**一个模块**从头到尾的完整链路。

```
User 实体 → Repository → Service → Controller → Postman 测通 → 改 person.js → 页面显示真实数据
└───────────────────────── 一条完整链路，一天内看得见结果 ─────────────────────────┘
```

这条链路跑通之后，设备、耗材、考勤这些模块**都是同一个模板复制粘贴改名字**。

所以本教程把 70% 的篇幅压在**第一个切片（人员管理，阶段 1-5）**上，写得极其详细。
后面的模块给核心代码、接口矩阵和前端迁移清单，重复 CRUD 按阶段 4 模板完成；凡是省略 package/import 的代码会明确称为“结构片段”，不能当作完整文件直接编译。

> **给你的第一条纪律**：严格按顺序做，不要跳步。
> 每一步都验证通过了再做下一步。一旦跳步，出错时你将无法判断是哪一步错的。

---
---

# 第一部分：环境体检报告

我已经实测过你这台 Mac 了。下面是**真实检测结果**，不是通用模板。

## 1.1 已经就绪的（不用管）

| 工具 | 你的版本 | 干什么用的 | 状态 |
|---|---|---|---|
| **Homebrew** | 6.0.15 | macOS 的软件包管理器，用它装 JDK | ✅ |
| **MySQL** | 9.6.0 (Homebrew, arm64) | 数据库，存所有数据 | ✅ 已安装且**正在运行** |
| **IntelliJ IDEA** | Ultimate 2026.2 | 写 Java 的编辑器 | ✅ **Ultimate 版，最好的选择** |
| **DBeaver** | 已安装 | 图形化看数据库，调试神器 | ✅ |
| **Postman** | 已安装 | 测接口用，不用写前端就能试后端 | ✅ |
| **VS Code** | 已安装 | 改前端 JS 用 | ✅ |
| **Node.js** | v26.6.0 | 起一个本地静态服务器跑前端页面 | ✅ |
| **Python 3** | Homebrew 版 | 备选的本地静态服务器 | ✅ |
| **Git** | 2.50.1 | 版本管理，改崩了能回退 | ✅ 已安装 |

> **好消息**：你的 IDEA 是 **Ultimate 版**（产品代号 `IU`）。
> Ultimate 内置了 Spring Boot 专属支持：能可视化查看所有接口路由、直接连数据库、`application.properties` 有自动补全。
> 这份教程里所有 IDEA 相关的操作，你都能用上。

---

## 1.2 需要你动手补的 —— 一共 3 件事

### ❌ 待办 1：安装 JDK 21（**必须做，否则寸步难行**）

**实测结果**：你机器上只有一个 JDK。

```
Matching Java Virtual Machines (1):
    26 (arm64) "Oracle Corporation" - "OpenJDK 26"
    /Users/fashion/Library/Java/JavaVirtualMachines/openjdk-26/Contents/Home
```

**为什么 JDK 26 不能用？**

Java 的版本分两种：

- **LTS 版（Long Term Support，长期支持版）**：8、11、17、**21**、25。企业生产环境用这些，一个版本维护 5-8 年。
- **非 LTS 版**：每 6 个月发一个，比如 26。**只维护 6 个月**，主要是给 Java 团队试验新特性用的。

Spring Boot、Lombok、Hibernate 这些框架，会**优先适配 LTS 版**。你用 JDK 26，很可能遇到：

- Lombok 报 `java.lang.ExceptionInInitializerError`（Lombok 靠 hack 编译器实现，对新 JDK 极其敏感）
- 报一堆 `Unsupported class file major version 70` 之类看不懂的错

这些错**跟你写的代码毫无关系**，纯粹是版本不匹配，但对新手来说是灾难 —— 你会以为是自己写错了，然后卡一整天。

**JDK 21 是目前企业最主流的选择**，中文资料最多，遇到问题一搜就有答案。

**怎么装**：

```bash
brew install openjdk@21
```

装完 Homebrew 会提示你做一步链接。执行：

```bash
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk \
  /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

> 这行命令会要你输 Mac 开机密码（输的时候屏幕不显示任何字符，是正常的，输完直接回车）。
> `ln -sfn` 是"创建符号链接"，相当于在系统的 Java 目录里放了个快捷方式，让 macOS 能找到这个 JDK。

然后让终端默认使用 JDK 21。打开配置文件：

```bash
open -e ~/.zshrc
```

> 如果提示文件不存在，先执行 `touch ~/.zshrc` 再打开。

在文件**最末尾**加上这一行，保存关闭：

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```

让配置生效：

```bash
source ~/.zshrc
```

**验证（这一步必须通过才能往下走）**：

```bash
java -version
```

**必须**看到：

```
openjdk version "21.0.x" 2025-xx-xx
```

如果还显示 26：

1. 关掉终端窗口，**重新开一个**，再试一次（`source` 只对当前窗口生效）
2. 还不行，执行 `/usr/libexec/java_home -V` 看列表里有没有 21。没有就是符号链接那步没成功，重做一遍

> **你的 JDK 26 不用卸载**。两个 JDK 可以共存，`JAVA_HOME` 决定默认用哪个。

---

### ❌ 待办 2：确认 MySQL 的 root 密码

**实测结果**：MySQL 服务**正在运行**（`brew services` 显示 `mysql started`），但我试了两种常见密码都进不去：

```
mysql -u root            → ERROR 1045 (28000): Access denied (using password: NO)
mysql -u root -proot     → ERROR 1045 (28000): Access denied (using password: YES)
```

这说明：**你给 root 设过密码，但不是空密码，也不是 `root`。**

**先试试你自己记得的密码**：

```bash
mysql -u root -p
```

回车后输密码（不显示字符，正常）。能看到 `mysql>` 提示符就成功了，输 `exit` 退出，**把密码记在某个地方，阶段 2 要填进配置文件**。

**如果实在想不起来** —— 按下面步骤重置（这是 MySQL 9.x 的正确做法）：

```bash
# 1. 停掉 MySQL
brew services stop mysql

# 2. 用"跳过权限检查"模式启动（这个终端窗口会被占用，不要关）
mysqld_safe --skip-grant-tables
```

**新开一个终端窗口**，执行：

```bash
mysql -u root
```

进去后依次执行（把 `你的新密码` 换成你要设的，建议简单点比如 `123456`，这是本地学习环境）：

```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '你的新密码';
FLUSH PRIVILEGES;
EXIT;
```

回到第一个终端窗口按 `Ctrl + C` 停掉，然后正常启动：

```bash
brew services start mysql
```

**验证**：

```bash
mysql -u root -p
```

用新密码能进入 `mysql>` 就成功了。

> **把密码写下来**。阶段 2 要填进 `application.properties`，忘了就得再重置一次。

---

### ❌ 待办 3：把项目变成 Git 仓库（强烈建议，5 分钟）

**实测结果**：`ComputerRoomSystem` 目录**还不是 Git 仓库**。

**为什么强烈建议**：你是新手，一定会把代码改崩。有 Git 的话，一条命令就能回到昨天能跑的状态；没有的话，只能靠记忆一点点往回改，非常痛苦。

```bash
cd ~/Documents/Study/ComputerRoomSystem
git init
```

然后创建一个 `.gitignore` 文件（告诉 Git 哪些文件不用管）：

```bash
cat > .gitignore <<'EOF'
# Java 编译产物
back/target/
*.class

# IDE 配置
.idea/
*.iml
.vscode/

# macOS
.DS_Store

# 日志
*.log
EOF
```

先提交一次当前状态：

```bash
git add .
git commit -m "初始状态：前端页面 + 开发文档"
```

> 之后**每完成一个阶段就提交一次**：
> ```bash
> git add .
> git commit -m "阶段 3 完成：人员查询接口跑通"
> ```
> 改崩了执行 `git checkout .` 就能丢弃所有未提交的修改，回到上次提交的状态。

---

## 1.3 不需要装的（省得你瞎折腾）

| 工具 | 为什么不用装 |
|---|---|
| **Maven** | 阶段 1 生成的项目会自带 `mvnw`（Maven Wrapper），它会自动下载正确版本的 Maven。这是现在的行业标准做法，比自己装更不容易出问题 |
| **Tomcat** | Spring Boot 内置了 Tomcat，`./mvnw spring-boot:run` 就自带 Web 服务器。十几年前才需要单独装 Tomcat |
| **Navicat** | 你已经有 DBeaver 了，功能足够，而且免费 |

---

## 1.4 环境完成检查表

**三项全部打勾才能进入第二部分**：

```
[ ] java -version 输出 21.x.x（不是 26）
[ ] mysql -u root -p 能进入 mysql> 提示符，且密码我记得
[ ] ComputerRoomSystem 目录下执行 git status 不报错
```

---
---

# 第二部分：Java 补课

> **这一部分是这份文档相比普通教程最重要的地方，请不要跳过。**

你会写 Java 基础代码。但 Spring Boot 的代码长这样：

```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse getById(Long id) {
        return userRepository.findById(id)
                .map(UserResponse::from)
                .orElseThrow(() -> new BusinessException("用户不存在"));
    }
}
```

这段代码里，**基础 Java 教过的只有 `public class`、`private`、`return`**。
其他全是你没学过的东西：`@Service` 是什么？`final` 字段没赋值为什么不报错？`::` 是什么运算符？`->` 又是什么？

**如果你不懂这些就去抄代码，你会一直处于"能跑但不知道为什么能跑"的状态。** 一旦报错就完全无从下手。

下面 8 个知识点，**每个都花 10-15 分钟弄懂**。花这 2 小时，后面 30 小时会顺畅得多。

---

## 2.1 注解（Annotation）：`@` 开头的那些东西

### 一句话理解

**注解是贴在代码上的标签，它本身什么都不做，是别的程序读取这个标签后替你做事。**

### 生活类比

你往行李箱上贴一张 **"易碎品"** 贴纸。

- 这张贴纸本身**不会保护**你的行李
- 但机场的搬运工**看到这个标签，就会轻拿轻放**
- 如果没有搬运工（没人读这个标签），贴纸就是一张废纸

`@Service`、`@Entity` 这些注解完全一样：

- 注解本身**不执行任何逻辑**
- **Spring 框架启动时会扫描你的所有类**，看到 `@Service` 就说"哦，这个类要交给我管理"，然后帮你创建对象
- 如果没有 Spring，`@Service` 就是个装饰品

### 对照代码

```java
// 你写的（3 行）
@Entity
@Table(name = "sys_user")
public class User { ... }
```

Hibernate 框架启动时读到这两个标签，替你干的事相当于：

```sql
CREATE TABLE sys_user (
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    ...
);
```

**你写 3 行标签，框架替你写几十行 SQL。这就是注解的价值。**

### 你必须建立的思维习惯

以后每看到一个新注解，问自己两个问题：

1. **谁会读这个标签？**（Spring？Hibernate？Lombok？）
2. **它读了之后替我做了什么？**

本教程每引入一个新注解，都会回答这两个问题。

### 自测题

> 如果我把 `@Service` 从一个类上删掉，程序会怎样？

<details>
<summary>点开看答案</summary>

Spring 启动时扫描不到这个类，不会为它创建对象。
其他类想注入它时会报 `NoSuchBeanDefinitionException`（找不到这个 Bean），启动直接失败。
</details>

---

## 2.2 接口（interface）与"面向接口编程"

### 基础回顾

接口就是**只规定"有哪些方法"，不规定"怎么实现"**的东西。

```java
// 接口：只说"能存能取"，不说怎么存
public interface Storage {
    void save(String data);
    String load();
}

// 实现类 1：存在文件里
public class FileStorage implements Storage {
    public void save(String data) { /* 写文件 */ }
    public String load() { /* 读文件 */ return null; }
}

// 实现类 2：存在内存里
public class MemoryStorage implements Storage {
    public void save(String data) { /* 存 Map */ }
    public String load() { /* 读 Map */ return null; }
}
```

### 为什么 Spring 到处用接口

因为**换实现不用改调用方的代码**：

```java
Storage storage = new FileStorage();   // 今天存文件
Storage storage = new MemoryStorage(); // 明天改存内存，其他代码一行不用动
```

### Spring 里最魔幻的一处：你只写接口，不写实现

这是新手最困惑的地方，提前告诉你：

```java
public interface UserRepository extends JpaRepository<User, Long> {
    // 空的！一行代码都没有
}
```

**你只写了这个空接口，然后就能直接调 `userRepository.findById(1L)` 并且真的能查出数据。**

为什么？因为 **Spring Data JPA 在程序启动时，会自动帮你生成这个接口的实现类**（用一种叫"动态代理"的技术，在内存里现场造一个类出来）。

你写的 `findById`、`findByUsername` 这些方法名，框架会**按方法名解析成 SQL**：

| 你写的方法名 | 框架生成的 SQL |
|---|---|
| `findByUsername(String u)` | `SELECT * FROM sys_user WHERE username = ?` |
| `findByDepartment(String d)` | `SELECT * FROM sys_user WHERE department = ?` |
| `existsByEmployeeNo(String n)` | `SELECT COUNT(*) > 0 FROM sys_user WHERE employee_no = ?` |
| `countByStatus(Integer s)` | `SELECT COUNT(*) FROM sys_user WHERE status = ?` |

**所以方法名必须严格按规则命名**：`findBy` + `字段名（首字母大写）`。
写错一个字母，启动时就报错 `No property 'xxx' found for type 'User'`。

### 自测题

> `findByRealNameContaining(String name)` 会生成什么 SQL？

<details>
<summary>点开看答案</summary>

```sql
SELECT * FROM sys_user WHERE real_name LIKE '%?%'
```

`Containing` 关键字对应 SQL 的 `LIKE %值%`，用来做模糊搜索。
</details>

---

## 2.3 泛型 `<T>`：给容器标注"里面装什么"

### 你已经见过泛型了

```java
List<String> names = new ArrayList<>();
```

这个 `<String>` 就是泛型。它告诉编译器"这个 List 里只能装 String"。

好处是：

```java
names.add(123);           // 编译期就报错，不用等到运行时
String s = names.get(0);  // 不用强制转换 (String)
```

### 后端代码里会用到的泛型

本教程会写一个统一的响应类：

```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;        // ← data 的类型不固定
}
```

用的时候：

```java
Result<UserResponse>        // data 是一个用户
Result<List<UserResponse>>  // data 是一批用户
Result<Void>                // 没有 data（比如删除接口）
Result<Map<String, Object>> // data 是键值对（比如统计数据）
```

**为什么不直接用 `Object`？**

```java
private Object data;   // 也能装任何东西，但是……

// 取的时候你不知道里面是什么，要强转，而且可能转错
UserResponse u = (UserResponse) result.getData();  // 运行时才可能爆 ClassCastException
```

泛型让**编译器在你写代码的时候就帮你检查**，而不是等程序跑起来才炸。

### 记住这个写法

```java
Result<T>              // 定义时：T 是占位符，代表"某个类型"
Result<UserResponse>   // 使用时：把 T 换成具体类型
```

---

## 2.4 依赖注入（DI）与 IoC：Spring 最核心的概念

> **这是整个 Spring 里最重要的一个概念。如果只能弄懂一个，就弄懂这个。**

### 问题：传统写法有什么毛病

```java
public class UserService {
    // 我自己 new 一个 Repository 出来
    private UserRepository userRepository = new UserRepositoryImpl();
}
```

三个毛病：

1. **写死了**。哪天要换成 `UserRepositoryMySQL`，得改这行代码
2. **重复创建**。10 个 Service 都需要 Repository，就 new 出 10 个一模一样的对象，浪费内存
3. **没法测试**。测试时想用一个假的 Repository 都做不到

### Spring 的解法：**你别自己 new，我给你**

这就叫 **IoC（Inversion of Control，控制反转）** —— **"创建对象"这件事的控制权，从你手里翻转到了 Spring 手里**。

### 生活类比

- **传统写法**：你要喝咖啡，自己买咖啡豆、自己磨、自己煮
- **依赖注入**：你在门口挂个牌子写"我需要咖啡"，Spring 每天早上直接把煮好的咖啡放你桌上

那块**牌子**就是注解 `@Autowired` 或者构造器参数。

### 完整流程（一定要看懂这个流程）

```
第 1 步：程序启动
        ↓
第 2 步：Spring 扫描所有 Java 类，找带这些注解的：
        @Component / @Service / @Repository / @Controller / @RestController / @Configuration
        ↓
第 3 步：为每个找到的类【创建一个对象】，存进一个大仓库
        这个仓库叫【IoC 容器】，里面的每个对象叫【Bean】
        ↓
第 4 步：发现 UserService 需要一个 UserRepository
        ↓
第 5 步：去仓库里找到 UserRepository 的 Bean，塞进 UserService
        这个"塞"的动作，就叫【依赖注入 Dependency Injection】
        ↓
第 6 步：你的代码直接用就行了，从来不用写 new
```

**关键认知：整个项目里，`Service`、`Repository`、`Controller` 这些类，你一次 `new` 都不会写。全是 Spring 造好给你的。**

### 三种注入写法（本教程只用第 3 种）

```java
// ❌ 写法 1：字段注入 —— 最常见，但已经不推荐了
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
// 问题：字段不能是 final（无法保证不被改）；单元测试时没法手动传入
```

```java
// 😐 写法 2：构造器注入（手写版）—— 正确但啰嗦
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {   // ← 这个构造器要自己写
        this.userRepository = userRepository;
    }
}
// Spring 看到只有一个构造器，会自动调用它并传入 Bean
```

```java
// ✅ 写法 3：Lombok 简化版 —— 本教程统一用这个
@Service
@RequiredArgsConstructor      // ← Lombok 自动生成上面那个构造器
public class UserService {
    private final UserRepository userRepository;   // 只需要写这一行
}
```

### 这下能读懂开头那段代码了

```java
@Service                            // ① 标签：Spring 请管理这个类
@RequiredArgsConstructor            // ② 标签：Lombok 请生成构造器
public class UserService {
    private final UserRepository userRepository;
    //     ↑ final 但没赋值，为什么不报错？
    //       因为 Lombok 生成的构造器里赋值了，编译时就有值了
}
```

`@RequiredArgsConstructor` 的规则是：**给所有 `final` 字段生成一个构造器参数**。
所以你以后加一个依赖，只要多写一行 `private final XxxService xxxService;` 就够了，构造器 Lombok 自动更新。

### 自测题

> 我在 `UserService` 里写了 `private final EmailService emailService;`，
> 但 `EmailService` 类上忘了加 `@Service`。启动会发生什么？

<details>
<summary>点开看答案</summary>

启动失败，报错大意是：

```
Parameter 1 of constructor in com.example.computerroom.user.UserService
required a bean of type 'com.example.computerroom.EmailService' that could not be found.
```

翻译：UserService 的构造器需要一个 EmailService 类型的 Bean，但仓库里没有。
因为没加 `@Service`，Spring 扫描时压根没把它放进仓库。

**这个报错你以后会遇到很多次，记住它的长相。**
</details>

---

## 2.5 `Optional<T>`：优雅地处理"可能没有"

### 问题：空指针异常

```java
User user = userRepository.findById(1L);
String name = user.getRealName();     // 如果 id=1 的用户不存在，user 是 null
                                      // → NullPointerException，程序崩溃
```

`NullPointerException`（简称 NPE，空指针异常）是 Java 世界里最常见的错误。
Java 的发明人之一 Tony Hoare 说过，发明 null 是他"价值十亿美元的错误"。

### 解法：用一个盒子把结果装起来

`Optional<User>` 就是**一个盒子，里面可能装着 User，也可能是空的**。
它强迫你在取东西之前**先处理"空盒子"的情况**。

```java
Optional<User> box = userRepository.findById(1L);
```

### 你会用到的 4 个方法

```java
// ① orElseThrow：有就返回，没有就抛异常  ← 本教程用得最多
User user = userRepository.findById(1L)
        .orElseThrow(() -> new BusinessException("用户不存在"));
// 执行到下一行时，user 一定不是 null，可以放心用

// ② orElse：有就返回，没有就用默认值
User user = userRepository.findById(1L).orElse(new User());

// ③ isPresent：判断里面有没有东西
if (box.isPresent()) { ... }

// ④ map：如果有，就转换成另一种东西；如果没有，还是空盒子
Optional<UserResponse> dto = userRepository.findById(1L)
        .map(UserResponse::from);
```

### 本教程的固定套路（背下来）

```java
User user = userRepository.findById(id)
        .orElseThrow(() -> new BusinessException("用户不存在"));
```

**这行代码在后面会出现几十次。** 含义是：
"查 id，查到了就给我 User 对象；查不到就抛一个业务异常，异常信息是'用户不存在'"。

---

## 2.6 Lambda `->` 与方法引用 `::`

### Lambda：把"一段代码"当成参数传给别人

基础 Java 里，你传给方法的参数是**数据**（数字、字符串、对象）。
Lambda 让你可以传**一段还没执行的代码**。

```java
// 老写法：要写一个完整的匿名内部类，7 行
list.sort(new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
});

// Lambda：1 行，意思完全一样
list.sort((a, b) -> a.length() - b.length());
```

**语法**：`(参数) -> 表达式` 或 `(参数) -> { 多行语句 }`

```java
() -> new BusinessException("用户不存在")     // 没有参数
u  -> u.getRealName()                        // 一个参数，可以省略括号
(a, b) -> a + b                              // 两个参数
u  -> { System.out.println(u); return u; }   // 多行要加大括号和 return
```

### 回头看这行代码

```java
.orElseThrow(() -> new BusinessException("用户不存在"))
```

`() -> new BusinessException(...)` 是一段**还没执行的代码**。

为什么不直接写 `.orElseThrow(new BusinessException("用户不存在"))`？

因为那样的话，**不管查没查到，异常对象都会被创建出来**（虽然可能不抛）。用 Lambda 包起来，只有真的需要抛异常时才会执行 `new`。这叫**延迟执行**。

### 方法引用 `::`：Lambda 的进一步简写

当 Lambda 的内容**只是调用一个已有的方法**时，可以用 `::` 简写：

```java
.map(u -> UserResponse.from(u))    // Lambda 写法
.map(UserResponse::from)           // 方法引用，完全等价，更短
```

读法：`类名::方法名`。

### Stream：处理集合的流水线

```java
List<UserResponse> result = users.stream()      // ① 把 List 变成"流"
        .filter(u -> u.getStatus() == 1)        // ② 过滤：只留启用的
        .map(UserResponse::from)                // ③ 转换：User → UserResponse
        .toList();                              // ④ 收集回 List
```

等价于这段老代码：

```java
List<UserResponse> result = new ArrayList<>();
for (User u : users) {
    if (u.getStatus() == 1) {
        result.add(UserResponse.from(u));
    }
}
```

**Stream 常用的三个动作**：

| 方法 | 作用 | 例子 |
|---|---|---|
| `filter` | 筛选，留下满足条件的 | `.filter(u -> u.getStatus() == 1)` |
| `map` | 转换，把每个元素变成另一个东西 | `.map(UserResponse::from)` |
| `toList` | 收集回 List | `.toList()` |

> 本教程用到的 Stream 就这三个，不用学更多。

---

## 2.7 异常：`Exception` 和 `RuntimeException` 的区别

### 两类异常

| 类型 | 例子 | 特点 |
|---|---|---|
| **受检异常**（继承 `Exception`） | `IOException` | **必须**写 `try-catch` 或 `throws`，否则编译不过 |
| **非受检异常**（继承 `RuntimeException`） | `NullPointerException` | 不强制处理，编译器不管 |

### 本教程为什么用 RuntimeException

我们会自己写一个业务异常：

```java
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
```

**继承 `RuntimeException` 而不是 `Exception`**，因为：

```java
// 如果继承 Exception，每一层都得处理，代码会变成这样：
public UserResponse getById(Long id) throws BusinessException {   // 要声明
    ...
}
// Controller 调用时还得 try-catch，层层污染

// 继承 RuntimeException，直接抛就行，中间层完全不用管
public UserResponse getById(Long id) {
    throw new BusinessException("用户不存在");   // 干净
}
```

### 那抛出去谁接？—— 全局异常处理器

阶段 4 会写一个类，用 `@RestControllerAdvice` 统一处理 Spring MVC Controller 调用链抛出的异常。进入 Controller 之前的 Security 过滤器异常需要由 `AuthenticationEntryPoint` 和 `AccessDeniedHandler` 单独处理。

```
Service 抛 BusinessException("库存不足")
    ↓ 一路往上，没人处理
GlobalExceptionHandler 接住
    ↓ 转换
返回给前端：{"code": 400, "message": "库存不足", "data": null}
```

**这样你的业务代码里只管 `throw`，不用写任何 `try-catch`。**

---

## 2.8 Maven 与 `pom.xml`：Java 的"依赖管理器"

### Maven 是什么

如果你接触过前端，Maven ≈ npm。

**它解决的问题**：你的项目要用 MySQL 驱动、要用 JSON 解析库、要用 JWT 库……
没有 Maven 的话，你得手动去官网下载几十个 `.jar` 文件，还要处理"A 库依赖 B 库的 2.0 版，C 库依赖 B 库的 1.0 版"这种冲突。

有了 Maven，你只需要在 `pom.xml` 里写一行"我要 MySQL 驱动"，它自动下载 + 处理所有连带依赖。

### `pom.xml` 的关键部分

```xml
<dependencies>
    <!-- 每个 dependency 就是一个第三方库 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>      <!-- 组织名 -->
        <artifactId>spring-boot-starter-web</artifactId> <!-- 库名 -->
        <!-- 没写 version，因为 Spring Boot 父项目统一管理了版本 -->
    </dependency>
</dependencies>
```

### 什么是 starter

`spring-boot-starter-web` 这种名字里带 **starter** 的，是**依赖包**（打包好的一套）。

加这一个，Maven 会自动带进来：Spring MVC + 内嵌 Tomcat + JSON 序列化 + 参数校验……**十几个库**。

这就是 Spring Boot 的核心卖点：**约定优于配置**，不用你一个个挑。

### 你会用到的 Maven 命令（就这 3 个）

```bash
./mvnw spring-boot:run     # 启动项目（用得最多）
./mvnw clean               # 删掉编译产物，出怪问题时用
./mvnw clean package       # 打包成 jar 文件（最后部署时用）
```

> `./mvnw` 前面的 `./` 表示"当前目录下的"，不能省。
> 第一次执行会下载 Maven 本身和所有依赖，**要几分钟，是正常的**，别以为卡死了。

---

## 第二部分完成检查表

**这 6 个问题你能不看文档答出来，才进入第三部分**：

```
[ ] 注解本身会执行逻辑吗？是谁在读它？
[ ] 我为什么不用自己 new UserRepository？
[ ] @RequiredArgsConstructor 替我生成了什么？
[ ] .orElseThrow(() -> new BusinessException("x")) 这行在干嘛？
[ ] () -> xxx 和 Xxx::yyy 分别是什么写法？
[ ] BusinessException 为什么要继承 RuntimeException？
```

答不上来的，回去重看对应小节。**这 2 小时省不得。**

---
---

# 第三部分：项目地图

动手前先看懂全局，写代码时才知道自己在哪一层。

## 3.1 三层架构：为什么要分层

一个"查询用户列表"的功能，如果全写在一个方法里：

```java
@GetMapping("/users")
public String getUsers(String keyword) {
    // 连数据库
    Connection conn = DriverManager.getConnection("jdbc:mysql://...");
    // 拼 SQL
    String sql = "SELECT * FROM sys_user WHERE real_name LIKE '%" + keyword + "%'";
    // 执行、遍历结果集、拼 JSON 字符串……
}
```

问题：**改数据库要动这里，改业务规则要动这里，改返回格式还要动这里**。一个方法几百行，谁也不敢改。

**分层就是把职责切开，每层只干一件事**：

```
        HTTP 请求
            ↓
┌───────────────────────┐
│  Controller           │  收请求、取参数、返回响应
│  「前台接待」          │  ❌ 不写业务判断
└───────────────────────┘
            ↓
┌───────────────────────┐
│  Service              │  所有业务规则都在这
│  「业务经理」          │  工号重不重复？库存够不够？能不能删？
└───────────────────────┘
            ↓
┌───────────────────────┐
│  Repository           │  只管数据库读写
│  「仓库管理员」        │  你写接口，Spring 生成实现
└───────────────────────┘
            ↓
┌───────────────────────┐
│  Entity               │  Java 类 ←→ 数据库表 的映射
│  「货物清单」          │
└───────────────────────┘
            ↓
        MySQL 数据库
```

### 判断自己有没有写错层的标准

| 现象 | 说明 |
|---|---|
| Controller 里出现 `if (库存 < 数量)` | ❌ 业务判断跑到接待台了，应该挪到 Service |
| Service 里出现 `HttpServletRequest` | ❌ Service 不该知道 HTTP 的存在 |
| Controller 里直接调 `userRepository` | ❌ 跳过了 Service 层 |
| Controller 方法只有 2-3 行 | ✅ 正常，接待台就该这么薄 |

---

## 3.2 一个请求的完整旅程

以"前端搜索姓名含'张'的用户，看第 1 页"为例，**从点击到显示，数据经过的每一站**：

```
【浏览器】用户在搜索框输入"张"，点搜索
    ↓  fetch('http://localhost:8080/api/users?realName=张&page=1&size=10')
    ↓
【Tomcat】Spring Boot 内嵌的 Web 服务器收到请求（8080 端口）
    ↓
【DispatcherServlet】Spring 的总调度器，看路径 /api/users 该给谁
    ↓
【CORS 过滤器】检查跨域是否允许（阶段 4 配）
    ↓
【JWT 过滤器】检查 token 有效吗？是谁在请求？（阶段 6 加）
    ↓
【UserController.list()】
    ↓  参数绑定：URL 里的 realName=张 → 方法参数 String realName
    ↓  调用 userService.list(realName, 1, 10)
    ↓
【UserService.list()】
    ↓  业务处理：页码从 1 开始（前端习惯）转成从 0 开始（JPA 要求）
    ↓  调用 userRepository.findAll(...)
    ↓
【UserRepository】（Spring 自动生成的实现）
    ↓  按方法名生成 SQL
    ↓
【Hibernate】
    ↓  SELECT * FROM sys_user WHERE real_name LIKE '%张%' LIMIT 0, 10
    ↓
【MySQL】执行查询，返回数据行
    ↓
【Hibernate】把每一行数据封装成一个 User 对象
    ↓
【UserService】User（含密码！）→ UserResponse（不含密码）
    ↓
【UserController】包装成 Result 对象
    ↓
【Jackson】Java 对象 → JSON 字符串（Spring 自动做的）
    ↓  {"code":200,"message":"success","data":{"list":[...],"total":3}}
    ↓
【浏览器】person.js 收到 JSON，渲染成表格
```

**看懂这张图，你就知道报错时该去哪一站找问题**：

| 现象 | 该查哪一站 |
|---|---|
| 浏览器 F12 显示 404 | Controller 的路径写错了 |
| 显示 CORS 错误 | 跨域配置 |
| 显示 401 | JWT 过滤器（阶段 6 之后） |
| 显示 500 | 后端代码抛异常了，看终端的错误堆栈 |
| 有数据但表格空白 | 前端字段名和后端返回的 JSON 对不上 |

---

## 3.3 最终的目录结构

做完全部 11 个阶段，你的 `back/` 会长这样。**现在不用记，有个印象即可**：

```
back/
├── mvnw                          ← Maven 包装器（自带，别删）
├── pom.xml                       ← 依赖清单
└── src/main/
    ├── java/com/example/computerroom/
    │   ├── ComputerroomApplication.java    ← 启动类（自带）
    │   │
    │   ├── common/                         ← 全项目公用的东西
    │   │   ├── Result.java                 统一响应格式
    │   │   ├── PageResult.java             分页响应格式
    │   │   ├── BusinessException.java      业务异常
    │   │   └── GlobalExceptionHandler.java 全局异常处理
    │   │
    │   ├── config/                         ← 配置类
    │   │   ├── CorsConfig.java             跨域
    │   │   ├── SecurityConfig.java         安全（阶段 6）
    │   │   └── DataInitializer.java        初始化数据
    │   │
    │   ├── security/                       ← 认证授权（阶段 6-7）
    │   │   ├── JwtService.java
    │   │   ├── JwtAuthenticationFilter.java
    │   │   └── SecurityUtils.java
    │   │
    │   ├── user/                           ← 人员模块（阶段 2-5）
    │   │   ├── User.java                   实体
    │   │   ├── UserRepository.java         数据访问
    │   │   ├── UserService.java            业务逻辑
    │   │   ├── UserController.java         接口
    │   │   └── dto/
    │   │       ├── UserResponse.java       返回给前端的格式
    │   │       ├── UserCreateRequest.java  新增用的入参
    │   │       └── UserUpdateRequest.java  修改用的入参
    │   │
    │   ├── auth/                           ← 登录注册（阶段 6）
    │   ├── role/                           ← 角色权限（阶段 7）
    │   ├── equipment/                      ← 设备（阶段 8）
    │   ├── goods/                          ← 耗材（阶段 9）
    │   ├── attendance/                     ← 考勤（阶段 10）
    │   └── dashboard/                      ← 仪表盘（阶段 11）
    │
    └── resources/
        └── application.properties          ← 配置文件
```

### 为什么按"模块"分包，而不是按"层"分包

有两种分包方式：

```
❌ 按层分（新手教程常见）        ✅ 按模块分（本教程用，也是企业主流）
   controller/                     user/
     UserController                  User.java
     EquipmentController             UserService.java
     GoodsController                 UserController.java
   service/                        equipment/
     UserService                     Equipment.java
     EquipmentService                EquipmentService.java
     ...                             ...
```

**按模块分的好处**：改人员功能时，所有相关文件都在 `user/` 一个文件夹里，不用在 5 个文件夹之间来回跳。

---

## 3.4 接口设计约定（RESTful 风格）

本项目所有接口遵守下面的约定。**先看一遍，写的时候会反复用到**：

| HTTP 方法 | 用途 | 例子 |
|---|---|---|
| `GET` | 查询（不改数据） | `GET /api/users` 查列表 |
| `POST` | 新增 | `POST /api/users` 新建用户 |
| `PUT` | 修改 | `PUT /api/users/1` 修改 1 号用户 |
| `DELETE` | 删除 | `DELETE /api/users/1` 删除 1 号用户 |

**路径规则**：

```
/api/users          ← 复数名词，表示"用户这个集合"
/api/users/1        ← 集合里的第 1 个
/api/users/1/role   ← 第 1 个用户的角色

❌ /api/getUserList     路径里不要有动词，动词由 HTTP 方法表达
❌ /api/user/delete/1   同上
```

**统一响应格式**（后面每个接口都返回这个结构）：

```json
{
  "code": 200,          // 200 成功，400 参数/业务错误，401 未登录，403 无权限，500 服务器错误
  "message": "success", // 出错时这里放给用户看的提示
  "data": { }           // 真正的数据，出错时为 null
}
```

> **为什么不用 HTTP 状态码就够了？**
> 用也可以。但统一格式让前端处理起来简单：不管什么情况，都是先看 `code`，再取 `data`，
> 不用区分"HTTP 层面的错"和"业务层面的错"。这是国内企业最常见的做法。

---
---

# 第四部分：一步步把后端写出来

# 阶段 1：创建项目，跑通第一个接口

**目标**：浏览器访问 `http://localhost:8080/api/test`，看到一行字。

听起来很简单，但这一步会打通「项目怎么建 → 怎么启动 → 接口怎么被访问到」这条最基础的链路。

## 步骤 1.1：用 Spring Initializr 生成项目骨架

**① 为什么不手动建**：一个 Spring Boot 项目需要正确的目录结构、`pom.xml`、启动类、Maven 包装器。手动建极容易出错。官方提供了在线生成器，点几下就好。

**② 操作**：打开 [start.spring.io](https://start.spring.io)，按下表填：

| 选项 | 填什么 | 为什么 |
|---|---|---|
| Project | **Maven** | Gradle 也行，但 Maven 中文资料多 |
| Language | **Java** | |
| Spring Boot | **3.4.x**（选最新的 3.4） | **不要选 4.x / SNAPSHOT / M 版本**，那些是测试版 |
| Group | `com.example` | 公司域名倒写，学习项目随意 |
| Artifact | `computerroom` | 项目名 |
| Name | `computerroom` | |
| Package name | `com.example.computerroom` | 所有代码的根包名 |
| Packaging | **Jar** | |
| Java | **21** | 和你刚装的 JDK 对应 |

右侧 **ADD DEPENDENCIES** 点进去，搜索并添加这 5 个：

| 依赖 | 作用 |
|---|---|
| `Spring Web` | 写 HTTP 接口，内含 Tomcat |
| `Spring Data JPA` | 操作数据库（阶段 2 用） |
| `MySQL Driver` | 连 MySQL 的驱动 |
| `Validation` | 参数校验（`@NotBlank` 这些，阶段 4 用） |
| `Lombok` | 自动生成 getter/setter 和构造器 |

> **千万暂时不要加 `Spring Security`。**
> 它一加进来，**所有接口都会默认需要登录**。你在阶段 1-5 会被一个登录页面挡住，完全测不了接口，非常挫败。阶段 6 再加。

点 **GENERATE**，下载得到 `computerroom.zip`。

## 步骤 1.2：放进项目目录

解压后，把**压缩包里面的内容**放进 `back/` 目录（注意是内容，不是那个文件夹本身）。

在终端执行：

```bash
cd ~/Documents/Study/ComputerRoomSystem
mkdir -p back
cd ~/Downloads && unzip -o computerroom.zip
mv computerroom/* ~/Documents/Study/ComputerRoomSystem/back/
mv computerroom/.gitignore ~/Documents/Study/ComputerRoomSystem/back/ 2>/dev/null
```

**验证结构**：

```bash
cd ~/Documents/Study/ComputerRoomSystem && ls back
```

应该看到 `mvnw`、`mvnw.cmd`、`pom.xml`、`src`。整体结构：

```
ComputerRoomSystem/
├── front/
├── 思路/
└── back/
    ├── mvnw
    ├── pom.xml
    └── src/main/
        ├── java/com/example/computerroom/ComputerroomApplication.java
        └── resources/application.properties
```

> 如果 `back/` 里出现了 `computerroom/computerroom/` 这种嵌套，说明放错了一层，删掉重来。

## 步骤 1.3：用 IDEA 打开

打开 IntelliJ IDEA → `Open` → 选中 **`back` 文件夹**（不是 `ComputerRoomSystem`）→ 打开。

IDEA 会在右下角显示进度条，正在下载依赖，**第一次要几分钟**。等它跑完，`pom.xml` 不再有红色波浪线为止。

> **为什么打开 `back` 而不是整个项目**：IDEA 需要识别 `pom.xml` 才能把它当 Maven 项目处理。
> 前端文件用 VS Code 打开更顺手，两个编辑器各管一边。

**Lombok 插件**：IDEA 2023 之后已内置，不用装。如果 `@Getter` 下面有红线，去 `Settings → Build → Compiler → Annotation Processors` 勾上 `Enable annotation processing`。

## 步骤 1.4：写第一个接口

**① 为什么**：先不碰数据库，只验证「HTTP 请求能不能进到我的方法里」。变量控制到最少，出错好定位。

**② 代码**：在 `back/src/main/java/com/example/computerroom/` 下新建 `TestController.java`：

```java
package com.example.computerroom;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "后端启动成功";
    }
}
```

**③ 逐行讲解**：

| 代码 | 谁在读这个标签 | 替你做了什么 |
|---|---|---|
| `@RestController` | Spring | ① 把这个类注册成 Bean；② 方法的返回值**直接作为响应体**，而不是当成网页文件名去找 |
| `@RequestMapping("/api")` | Spring | 这个类里所有接口的**路径前缀** |
| `@GetMapping("/test")` | Spring | 这个方法处理 `GET /api/test`（前缀 + 这里 = 完整路径） |

**关键认知**：你没有写任何"启动服务器""解析 HTTP""写响应"的代码。
`return "后端启动成功"` 这个返回值，Spring 自动帮你变成了 HTTP 响应体。

## 步骤 1.5：暂时关掉数据库检查

现在还没配数据库，直接启动会报 `Failed to configure a DataSource`。

打开 `back/src/main/resources/application.properties`，改成：

```properties
spring.application.name=computerroom
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

> 第二行的意思是"启动时先别管数据库"。**阶段 2 会删掉它。**

## 步骤 1.6：启动

两种方式，选一种：

**方式 A：IDEA 里点绿色三角**（推荐）
打开 `ComputerroomApplication.java`，点 `main` 方法左边的绿色 ▶。

**方式 B：命令行**

```bash
cd ~/Documents/Study/ComputerRoomSystem/back
./mvnw spring-boot:run
```

> 第一次执行 `./mvnw` 会下载 Maven 和所有依赖，**要几分钟，属正常**，别以为卡死了。

**④ 怎么验证**：看到这两行就是成功了：

```
Tomcat started on port 8080 (http) with context path '/'
Started ComputerroomApplication in 2.156 seconds
```

浏览器打开 `http://localhost:8080/api/test`，看到 **后端启动成功** 五个字。

再用 Postman 试一次：新建请求，方法选 `GET`，地址 `http://localhost:8080/api/test`，点 Send。

> **停止服务**：IDEA 里点红色方块，或命令行按 `Ctrl + C`。
> **重要**：后面每次改完 Java 代码，都要**停掉再重启**才生效。

## 常见报错对照表

| 报错 | 原因 | 解决 |
|---|---|---|
| `Port 8080 was already in use` | 8080 端口被占了（很可能上一次没关干净） | `lsof -ti:8080 \| xargs kill -9` |
| `invalid target release: 21` | JDK 版本不对 | 回到待办 1 检查 `java -version` |
| `Failed to configure a DataSource` | 步骤 1.5 没做 | 检查 `application.properties` |
| 访问显示 `Whitelabel Error Page` 404 | 路径拼错了 | 确认是 `/api/test`，前缀和方法路径都要对 |
| `@Getter` 报红但能编译 | Lombok 注解处理没开 | 见步骤 1.3 末尾 |

## ⑤ 这一步学到了什么

- `@RestController` = 这个类里的方法返回**数据**，不是网页
- `@RequestMapping` 定前缀，`@GetMapping` 定具体路径，**两者拼起来**才是完整 URL
- 方法返回值自动变成 HTTP 响应体，这是 Spring 做的
- Spring Boot 内置 Tomcat，不用单独装服务器

**自测题**：如果我把 `@RequestMapping("/api")` 改成 `@RequestMapping("/backend")`，访问地址变成什么？

<details><summary>答案</summary>

`http://localhost:8080/backend/test`
</details>

**提交一次**：

```bash
cd ~/Documents/Study/ComputerRoomSystem
git add . && git commit -m "阶段1完成：项目骨架 + 第一个接口跑通"
```

---

# 阶段 2：连上 MySQL，写个 Java 类就自动建表

**目标**：写一个 `User.java` 类，启动项目后，数据库里自动出现一张 `sys_user` 表。

## 先理解一个概念：ORM

**问题**：Java 世界里数据是**对象**（`User` 有 `realName` 字段）；数据库里数据是**表的行**（`sys_user` 有 `real_name` 列）。两边结构不一样，来回转换要写大量重复代码。

```java
// 没有 ORM 的年代，查一个用户要写这么多
String sql = "SELECT * FROM sys_user WHERE id = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setLong(1, id);
ResultSet rs = ps.executeQuery();
User user = new User();
user.setId(rs.getLong("id"));
user.setRealName(rs.getString("real_name"));
user.setEmployeeNo(rs.getString("employee_no"));
// ... 每个字段都要手写一遍，12 张表就是几千行
```

**ORM（Object-Relational Mapping，对象关系映射）** 帮你自动做这个转换：

```
Java 类   ←→  数据库表      User        ←→  sys_user
Java 字段 ←→  表的列        realName    ←→  real_name
Java 对象 ←→  表的一行      user 实例   ←→  id=1 那一行
```

**本项目用的 ORM 是 Hibernate**，通过 **JPA**（Java 官方定的 ORM 标准接口）来使用它。
`Spring Data JPA` 则是 Spring 在 JPA 之上又包了一层，让你写更少的代码。

三者关系：

```
你的代码 → Spring Data JPA（最省代码） → JPA（标准接口） → Hibernate（真正干活的）→ MySQL
```

> 不用记这三个的区别，知道"我写 Java，它生成 SQL"就够了。

## 步骤 2.1：创建数据库

```bash
mysql -u root -p
```

输入密码进去后执行：

```sql
CREATE DATABASE computer_room
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

**为什么必须是 `utf8mb4`**：MySQL 里有个历史遗留的坑 —— 它的 `utf8` **不是真正的 UTF-8**，是残缺的三字节版本，存不了 emoji，某些生僻中文字也会出问题。`utf8mb4` 才是完整的四字节 UTF-8。

**验证**：

```sql
SHOW DATABASES;
```

列表里能看到 `computer_room`。然后 `exit` 退出。

## 步骤 2.2：配置数据库连接

把 `application.properties` **整个替换**成下面内容：

```properties
spring.application.name=computerroom

# ===== 数据库连接 =====
spring.datasource.url=jdbc:mysql://localhost:3306/computer_room?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8mb4&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=改成你的MySQL密码
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ===== JPA / Hibernate =====
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false
```

**逐项解释**：

| 配置 | 作用 | 不写会怎样 |
|---|---|---|
| `serverTimezone=Asia/Shanghai` | 指定时区 | 存进去的时间差 8 小时 |
| `allowPublicKeyRetrieval=true` | MySQL 8+ 用新的密码加密方式，需要这个 | **连不上，报 Public Key Retrieval is not allowed** |
| `characterEncoding=utf8mb4` | 连接层用 utf8mb4 | 中文变问号 |
| `ddl-auto=update` | **根据实体类自动建表/加字段** | 表不会自动创建 |
| `show-sql=true` | 控制台打印实际执行的 SQL | 查不出数据时没法排查 |
| `format_sql=true` | SQL 换行缩进，好读 | SQL 挤成一行 |
| `open-in-view=false` | 关掉一个默认开启的坏特性 | 启动时有警告，且数据库连接会占用过久 |

> **注意**：`spring.autoconfigure.exclude` 那一行**已经删掉了**（不再需要跳过数据库）。

**关于 `ddl-auto=update` 的重要边界**：

| 你改了什么 | `update` 会做什么 |
|---|---|
| 新增一个字段 | ✅ 自动 `ALTER TABLE ADD COLUMN` |
| 新增一个实体类 | ✅ 自动 `CREATE TABLE` |
| 删除一个字段 | ❌ **不管**，数据库里那列还留着 |
| 改字段类型/长度/约束 | ⚠️ 行为不可靠：可能尝试修改、失败或只改一部分 |

所以不要依赖 `update` 做结构迁移。学习阶段没有重要数据时，可以在 DBeaver 删除对应表后重启重建；有数据后应使用 Flyway 编写明确的迁移 SQL。

> 生产环境**绝不能用 `update`**（它可能在你不知情时改动线上表结构），要用 Flyway 做版本化迁移。现在是学习阶段，用 `update` 最省事。

## 步骤 2.3：写第一个实体类

**① 为什么先写 User**：人员是整个系统的地基 —— 设备的"登记人"、耗材的"操作人"、考勤的"打卡人"，全都指向用户。先把它做好。

**② 代码**：新建目录 `back/src/main/java/com/example/computerroom/user/`，在里面新建 `User.java`：

```java
package com.example.computerroom.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "sys_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(name = "real_name", nullable = false, length = 50)
    private String realName;

    @Column(name = "employee_no", nullable = false, unique = true, length = 20)
    private String employeeNo;

    @Column(length = 50)
    private String department;

    @Column(length = 20)
    private String phone;

    @Column(name = "role_code", nullable = false, length = 20)
    private String roleCode = "user";

    @Column(nullable = false)
    private Integer status = 1;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
```

**③ 注解逐个讲解**：

| 注解 | 谁读它 | 做了什么 |
|---|---|---|
| `@Entity` | Hibernate | 声明"这个类对应数据库的一张表" |
| `@Table(name="sys_user")` | Hibernate | 表名明确为 `sys_user`，避免 `user` 与数据库内置函数、系统对象命名混淆，也符合系统表统一加 `sys_` 前缀的约定 |
| `@Id` | Hibernate | 这个字段是主键 |
| `@GeneratedValue(IDENTITY)` | Hibernate | 主键自增，对应 MySQL 的 `AUTO_INCREMENT` |
| `@Column(nullable=false)` | Hibernate | 首次建表时生成 `NOT NULL`；已有表的约束变更应使用迁移 SQL |
| `@Column(unique=true)` | Hibernate | 建表时加唯一索引，**数据库层面**禁止重复 |
| `@Column(length=50)` | Hibernate | `VARCHAR(50)`，不写默认 255 |
| `@Column(updatable=false)` | Hibernate | 这列只在插入时写，之后 `UPDATE` 永远不碰它（创建时间不该被改） |
| `@PrePersist` | Hibernate | **插入之前**自动执行这个方法 |
| `@PreUpdate` | Hibernate | **更新之前**自动执行这个方法 |
| `@Getter` `@Setter` | Lombok | 生成全部 getter/setter，**省掉约 100 行代码** |

**几个容易忽略的细节**：

**（1）驼峰 ↔ 下划线**

Java 里写 `realName`，数据库里是 `real_name`。Spring Boot 默认会自动转换，写 `@Column(name = "real_name")` 是**显式声明**，更保险、更好读。

**（2）字段的默认值写在 Java 里**

```java
private String roleCode = "user";   // 新建对象时默认是普通用户
private Integer status = 1;         // 默认启用
```

这是 **Java 层面**的默认值（`new User()` 时就有值），不是数据库的 `DEFAULT`。对我们够用。

**（3）为什么用 `Long` 而不是 `long`，`Integer` 而不是 `int`**

包装类型可以是 `null`，基本类型不行。

```java
private Long id;    // 新建还没保存时，id 是 null —— 表示"还没有 id"
private long id;    // 只能是 0，而 0 会被误当成"id 等于 0 的记录"
```

**实体类的字段一律用包装类型**，这是行业惯例。

**（4）为什么用 `LocalDateTime` 而不是 `Date`**

`java.util.Date` 是 Java 1.0 的老类，设计有缺陷（月份从 0 开始、线程不安全、可变）。
Java 8 引入了 `java.time` 包替代它。**新项目一律用 `LocalDateTime` / `LocalDate` / `LocalTime`**。

| 类型 | 装什么 | 用在哪 |
|---|---|---|
| `LocalDate` | 只有日期 `2026-08-09` | 考勤日期 |
| `LocalTime` | 只有时间 `09:15:00` | 打卡时间 |
| `LocalDateTime` | 日期 + 时间 | 创建时间、更新时间 |

## 步骤 2.4：启动，看表是否自动创建

```bash
cd ~/Documents/Study/ComputerRoomSystem/back
./mvnw spring-boot:run
```

**④ 怎么验证**：控制台里应该能看到 Hibernate 打印的建表 SQL（因为开了 `show-sql`）：

```sql
create table sys_user (
    id bigint not null auto_increment,
    created_at datetime(6),
    department varchar(50),
    employee_no varchar(20) not null,
    password varchar(100) not null,
    phone varchar(20),
    real_name varchar(50) not null,
    role_code varchar(20) not null,
    status integer not null,
    updated_at datetime(6),
    username varchar(50) not null,
    primary key (id)
) engine=InnoDB
```

**这就是注解的威力**：你写了 11 个字段和几个标签，Hibernate 替你生成了完整的 `CREATE TABLE`。

## 步骤 2.5：用 DBeaver 看一眼，并插入测试数据

打开 DBeaver → 新建 MySQL 连接：

| 项 | 值 |
|---|---|
| Server Host | `localhost` |
| Port | `3306` |
| Database | `computer_room` |
| Username | `root` |
| Password | 你的密码 |

> 首次连接 DBeaver 会提示下载 MySQL 驱动，点确认让它下。
> 如果报 `Public Key Retrieval is not allowed`，在连接设置的 `Driver properties` 里把 `allowPublicKeyRetrieval` 改成 `true`。

连上后展开 `computer_room` → `Tables`，应该能看到 **sys_user**。

打开 SQL 编辑器，执行下面的 SQL 插入测试数据。

> **这 13 条数据刻意和 `front/js/person.js` 里的示例数组保持一致**（同样的姓名、工号、部门、手机号），这样阶段 5 联调时，页面上的数据看起来"没变化"就说明接通了 —— 这是个很好的验证方式。

```sql
INSERT INTO sys_user
(username, password, real_name, employee_no, department, phone, role_code, status, created_at, updated_at)
VALUES
('zhangsan','temp','张三','001','技术部','13800131234','admin',1,NOW(),NOW()),
('lisi',    'temp','李四','002','运维部','13900135678','user', 1,NOW(),NOW()),
('wangwu',  'temp','王五','003','后勤部','13700139012','user', 1,NOW(),NOW()),
('zhaoliu', 'temp','赵六','004','技术部','13600134567','user', 1,NOW(),NOW()),
('sunqi',   'temp','孙七','005','运维部','13500137890','user', 1,NOW(),NOW()),
('zhouba',  'temp','周八','006','技术部','13400132345','user', 1,NOW(),NOW()),
('wujiu',   'temp','吴九','007','后勤部','13300135678','user', 1,NOW(),NOW()),
('zhengshi','temp','郑十','008','运维部','13200138901','user', 1,NOW(),NOW()),
('qianyi',  'temp','钱一','009','技术部','13100131234','user', 1,NOW(),NOW()),
('chener',  'temp','陈二','010','后勤部','13000134567','user', 1,NOW(),NOW()),
('linsan',  'temp','林三','011','运维部','18900137890','user', 1,NOW(),NOW()),
('huangsi', 'temp','黄四','012','技术部','18800132345','user', 1,NOW(),NOW()),
('hewu',    'temp','何五','013','后勤部','18700135678','admin',1,NOW(),NOW());
```

> 密码先填 `temp` 占位，现在还登录不了。阶段 6 讲 BCrypt 加密时会统一替换。
> **真实密码永远不能明文存库** —— 这一点阶段 6 会展开讲。

验证：

```sql
SELECT id, username, real_name, department, role_code FROM sys_user;
```

应该返回 13 行。

## 阶段 2 完成标准

```
[ ] DBeaver 里能看到 sys_user 表，字段和 User.java 一一对应
[ ] 表里有 13 条测试数据
[ ] 启动时控制台能看到 Hibernate 打印的 SQL
[ ] 没有任何报错
```

## 常见报错对照表

| 报错 | 原因 | 解决 |
|---|---|---|
| `Access denied for user 'root'` | 密码填错 | 检查 `application.properties` 里的密码 |
| `Unknown database 'computer_room'` | 数据库没建 | 回到步骤 2.1 |
| `Public Key Retrieval is not allowed` | URL 少了参数 | 确认有 `allowPublicKeyRetrieval=true` |
| `Table 'user' already exists` 或建表名称不符合预期 | 没有显式指定表名 | 确认有 `@Table(name = "sys_user")` |
| `Communications link failure` | MySQL 没启动 | `brew services start mysql` |

## ⑤ 这一步学到了什么

- **ORM 的核心思想**：你写 Java 类，框架生成表和 SQL，你不写 `CREATE TABLE`
- 类 ↔ 表，字段 ↔ 列，对象 ↔ 一行数据
- `@PrePersist` / `@PreUpdate` 这类**生命周期回调**，能把"每次都得做的事"自动化
- 实体类字段用包装类型（`Long`/`Integer`），时间用 `java.time` 包
- `show-sql=true` 让你看见框架背后到底执行了什么 —— **这是你以后最重要的调试手段**

**自测题**：我给 `User` 加一个 `private String email;` 字段，然后重启项目。数据库会发生什么？

<details><summary>答案</summary>

Hibernate 执行 `ALTER TABLE sys_user ADD COLUMN email VARCHAR(255)`，自动加上这一列。
因为 `ddl-auto=update` 会对比实体类和现有表结构，把缺的字段补上。
（长度是 255，因为没写 `@Column(length=...)`）
</details>

```bash
git add . && git commit -m "阶段2完成：连接MySQL，User实体自动建表"
```

---

# 阶段 3：写出第一个真正的查询接口

**目标**：Postman 请求 `GET /api/users`，返回数据库里 13 个用户的 JSON。

**这是全教程最重要的一个阶段。** 你会第一次把四层全部串起来。理解了这一个，后面 8 个模块都是复制粘贴。

## 这一阶段要建 5 个文件

```
user/
├── User.java                 ← 阶段 2 已完成
├── UserRepository.java       ← 新建：数据访问
├── UserService.java          ← 新建：业务逻辑
├── UserController.java       ← 新建：HTTP 接口
└── dto/
    └── UserResponse.java     ← 新建：返回给前端的格式
common/
└── Result.java               ← 新建：统一响应外壳
```

**建议的顺序是从下往上**：Repository → DTO → Result → Service → Controller。
因为上层要调下层，先建下层就不会出现红色报错。

---

## 步骤 3.1：Repository —— 数据访问层

**① 为什么**：需要一个"专门跟数据库打交道"的角色。Service 不该知道 SQL 长什么样。

**② 代码**：新建 `user/UserRepository.java`：

```java
package com.example.computerroom.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmployeeNo(String employeeNo);
}
```

**③ 讲解 —— 这是全教程最"魔幻"的一个文件，一定要看懂**：

**（1）它是 `interface`，不是 `class`，而且没有任何实现代码。**

那它怎么干活的？**Spring Data JPA 在启动时，用动态代理技术在内存里现场生成了一个实现类。** 你不用写、也看不到那个类，但它确实存在。

**（2）`extends JpaRepository<User, Long>` 白送你一堆方法**

两个泛型参数的含义：`<实体类型, 主键类型>`。因为 `User` 的 `id` 是 `Long`，所以填 `Long`。

继承之后，你**一行代码不写**就能用这些：

| 方法 | 作用 | 生成的 SQL |
|---|---|---|
| `save(user)` | 新增**或**修改 | id 为 null → `INSERT`；id 有值 → `UPDATE` |
| `findById(1L)` | 按主键查 | `SELECT * FROM sys_user WHERE id = 1` |
| `findAll()` | 查全部 | `SELECT * FROM sys_user` |
| `findAll(pageable)` | 分页查 | `SELECT ... LIMIT ?, ?` |
| `deleteById(1L)` | 按主键删 | `DELETE FROM sys_user WHERE id = 1` |
| `count()` | 统计条数 | `SELECT COUNT(*) FROM sys_user` |
| `existsById(1L)` | 判断是否存在 | `SELECT COUNT(*) > 0 ...` |

> `save` 一个方法管新增和修改，这一点要记牢，后面反复用到。

**（3）自己加的三个方法：靠"方法名"生成 SQL**

这叫**方法名派生查询**（Query Derivation）。框架**解析你的方法名**，拼出 SQL：

```
findByUsername          →  SELECT * FROM sys_user WHERE username = ?
existsByUsername        →  SELECT COUNT(*) > 0 FROM sys_user WHERE username = ?
existsByEmployeeNo      →  SELECT COUNT(*) > 0 FROM sys_user WHERE employee_no = ?
 ↑      ↑
 动作   条件字段（首字母大写的 Java 字段名）
```

常用关键字：

| 方法名关键字 | SQL | 例子 |
|---|---|---|
| `findBy` | `SELECT ... WHERE` | `findByPhone` |
| `existsBy` | 判断存在 | `existsByUsername` |
| `countBy` | 计数 | `countByStatus` |
| `deleteBy` | 删除 | `deleteByStatus` |
| `Containing` | `LIKE %值%` | `findByRealNameContaining` |
| `And` / `Or` | 多条件 | `findByDepartmentAndStatus` |
| `OrderByXxxDesc` | 排序 | `findAllByOrderByCreatedAtDesc` |

> **字段名必须和实体类的 Java 字段名完全一致**（不是数据库列名！）。
> 写成 `findByReal_name` 或 `findByRealname` 都会在**启动时**报错：
> `No property 'xxx' found for type 'User'`。
> 好消息是它在启动时就报错，不会等到运行时才炸。

**（4）为什么 `findByUsername` 返回 `Optional<User>`，而不是 `User`**

因为**可能查不到**。返回 `Optional` 强迫调用方处理"没查到"的情况（见 2.5 节），避免空指针。

而 `existsByUsername` 返回 `boolean`，因为"存不存在"只有是/否两种答案，不需要 `Optional`。

**（5）为什么不用加 `@Repository` 注解**

`JpaRepository` 的子接口会被 Spring Data JPA **自动发现并注册成 Bean**，不需要额外标注。
（加了也不报错，但没必要。）

---

## 步骤 3.2：Result —— 统一响应外壳

**① 为什么**：如果每个接口返回的结构都不一样，前端得为每个接口写不同的处理逻辑。
统一成一个外壳，前端只需要写一次"先看 code，再取 data"。

**② 代码**：新建 `common/` 目录，里面建 `Result.java`：

```java
package com.example.computerroom.common;

import lombok.Getter;

@Getter
public class Result<T> {

    private final Integer code;
    private final String message;
    private final T data;

    private Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }

    public static <T> Result<T> success() {
        return new Result<>(200, "success", null);
    }

    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
}
```

**③ 讲解**：

**（1）`Result<T>` 的泛型**（回顾 2.3 节）

`T` 是占位符，用的时候换成具体类型：

```java
Result<UserResponse>          // data 是一个用户
Result<List<UserResponse>>    // data 是用户列表
Result<Void>                  // 没有 data（删除、修改这类接口）
```

**（2）为什么构造器是 `private`**

强制你只能通过 `Result.success(...)` 和 `Result.error(...)` 来创建对象。
这样全项目的 `code` 值就统一了 —— 不会有人手写 `new Result<>(201, "ok", data)` 搞出个新花样。

这种"用静态方法代替构造器"的写法叫**静态工厂方法**，好处是**方法名能表达意图**（`success` 比 `new Result(200,...)` 一眼就懂）。

**（3)`static <T> Result<T> success(T data)` 里为什么有两个 `<T>`**

```java
public static <T> Result<T> success(T data)
//            ↑        ↑
//        声明泛型   使用泛型
```

静态方法不能用类上的泛型（类的泛型属于实例），所以要**自己声明一个**。
第一个 `<T>` 是"我这个方法要用一个泛型，名字叫 T"，后面的 `T` 才是使用。

**（4）字段用 `final`**

一旦创建就不能改，避免中途被人篡改 `code`。这叫**不可变对象**，是好习惯。

**（5）Jackson 会把它转成 JSON**

```java
return Result.success(userList);
```

Spring 底层用 **Jackson** 库把 Java 对象序列化成 JSON。它靠 **getter 方法**来取值 ——
所以 `@Getter` 不只是给你自己用的，**没有 getter，Jackson 就读不到字段，JSON 会是空对象 `{}`**。

最终前端收到：

```json
{ "code": 200, "message": "success", "data": [ ... ] }
```

---

## 步骤 3.3：DTO —— 为什么绝对不能直接返回 Entity

**① 为什么**：这是**安全问题**，不是代码风格问题。

假设 Controller 直接返回 `User` 实体：

```java
return Result.success(userRepository.findAll());   // ❌ 危险
```

前端收到的 JSON 会是：

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "username": "zhangsan",
      "password": "$2a$10$N9qo8uLOickgx2ZMRZoMye...",   ← 密码哈希泄露了！
      "realName": "张三",
      ...
    }
  ]
}
```

**密码哈希被发到了浏览器**。任何人 F12 打开 Network 就能看到。虽然是哈希，但攻击者可以拿去离线暴力破解。

除了安全，还有三个理由：

| 理由 | 说明 |
|---|---|
| **字段名对不上** | 前端 `person.js` 用的是 `name`/`no`/`dept`，实体是 `realName`/`employeeNo`/`department` |
| **需要转换** | 数据库存 `role_code = "admin"`，前端要显示"管理员" |
| **改表就改接口** | 实体加一个字段，接口返回就多一个字段，可能意外泄露内部信息 |

**② 代码**：新建 `user/dto/UserResponse.java`：

```java
package com.example.computerroom.user.dto;

import com.example.computerroom.user.User;
import lombok.Getter;

@Getter
public class UserResponse {

    private final Long id;
    private final String name;
    private final String no;
    private final String dept;
    private final String role;
    private final String roleCode;
    private final String phone;
    private final String username;

    private UserResponse(User user) {
        this.id = user.getId();
        this.name = user.getRealName();
        this.no = user.getEmployeeNo();
        this.dept = user.getDepartment();
        this.roleCode = user.getRoleCode();
        this.role = toRoleName(user.getRoleCode());
        this.phone = user.getPhone();
        this.username = user.getUsername();
    }

    public static UserResponse from(User user) {
        return new UserResponse(user);
    }

    private static String toRoleName(String roleCode) {
        if (roleCode == null) {
            return "普通用户";
        }
        return switch (roleCode) {
            case "root"  -> "超级管理员";
            case "admin" -> "管理员";
            default      -> "普通用户";
        };
    }
}
```

**③ 讲解**：

**（1）字段名故意用 `name`/`no`/`dept`**

去看一眼 `front/js/person.js` 第 8 行：

```javascript
{ id: 1, name: '张三', no: '001', dept: '技术部', role: '管理员', phone: '13800131234' }
```

**DTO 的字段名和前端已有的字段名完全对齐**，这样阶段 5 联调时，前端的 `render()` 方法**几乎不用改**。

> 这是个很实用的技巧：**后端 DTO 去适配已有前端**，比让前端改 20 处渲染代码省事得多。

**（2）没有 `password` 字段**

DTO 里根本没这个字段，所以**物理上不可能泄露**。这比"记得每次都手动清空密码"可靠得多。

**（3)`from(user)` 静态工厂方法**

```java
UserResponse.from(user)          // 直接调用
users.stream().map(UserResponse::from).toList()   // 配合方法引用批量转换
```

**（4）`switch` 表达式（Java 14+ 新语法）**

```java
// 新写法（本教程用）
return switch (roleCode) {
    case "root"  -> "超级管理员";
    case "admin" -> "管理员";
    default      -> "普通用户";
};

// 老写法，等价
switch (roleCode) {
    case "root":  return "超级管理员";
    case "admin": return "管理员";
    default:      return "普通用户";
}
```

新写法用 `->`，**不需要 `break`**（老写法忘写 `break` 会"贯穿"到下一个 case，是经典 bug 来源），而且可以直接当表达式赋值。

**（5）中英文转换只在这一个地方做**

数据库存英文 `admin`，前端显示中文"管理员"。**转换逻辑只写在 DTO 里一处**。
如果分散到 Service、Controller、前端各处都转一遍，哪天要加个新角色，你得改 5 个地方还可能漏。

**（6）同时返回 `role` 和 `roleCode`**

- `role`（"管理员"）给人看，直接显示在表格里
- `roleCode`（"admin"）给程序判断用，比如 `if (roleCode === 'admin')`

**不要让前端去判断中文字符串** —— 中文一改（"管理员"改成"系统管理员"），前端逻辑就崩了。

---

## 步骤 3.4：Service —— 业务逻辑层

**① 为什么**：所有"规则"都放这里。工号能不能重复？谁能删谁？库存够不够？
Controller 和 Repository 都不该管这些。

**② 代码**：新建 `user/UserService.java`：

```java
package com.example.computerroom.user;

import com.example.computerroom.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> listAll() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }
}
```

**③ 讲解**：

| 注解 | 谁读它 | 做了什么 |
|---|---|---|
| `@Service` | Spring | 注册成 Bean，让别的类能注入它。功能上和 `@Component` 一样，但语义上表明"这是业务层" |
| `@RequiredArgsConstructor` | Lombok | 为所有 `final` 字段生成构造器 → 实现构造器注入（见 2.4 节） |
| `@Transactional(readOnly=true)` | Spring | 类上统一声明"只读事务" |

**关于 `@Transactional(readOnly = true)`**：

放在**类上**表示这个类的所有方法默认是只读事务。好处：

- 数据库知道你不会写数据，可以做优化
- Hibernate 跳过"脏检查"（不用比对对象有没有被改），性能更好
- 清楚表达这个事务主要用于查询

> `readOnly = true` 是优化和语义提示，**不是写保护**。不同数据库和驱动不保证调用
> `save()` 时立即报错；真正的约束仍要靠清晰的代码分层、测试和数据库权限。

写操作的方法（新增、修改、删除）要**单独加 `@Transactional`** 覆盖掉类上的只读设置。阶段 4 会用到。

**关于这段链式调用**：

```java
return userRepository.findAll()      // ① List<User>，13 个实体对象
        .stream()                    // ② 变成"流"
        .map(UserResponse::from)     // ③ 每个 User → UserResponse
        .toList();                   // ④ 收集成 List<UserResponse>
```

等价的老写法（如果 Stream 还不熟，对照看）：

```java
List<User> users = userRepository.findAll();
List<UserResponse> result = new ArrayList<>();
for (User user : users) {
    result.add(UserResponse.from(user));
}
return result;
```

**两种写法完全等价。** Stream 版本更短，而且意图更明确（"把每个元素转换一下"）。

---

## 步骤 3.5：Controller —— HTTP 接口层

**① 为什么**：需要一个"前台接待"，负责把 HTTP 请求翻译成 Java 方法调用。

**② 代码**：新建 `user/UserController.java`：

```java
package com.example.computerroom.user;

import com.example.computerroom.common.Result;
import com.example.computerroom.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public Result<List<UserResponse>> listAll() {
        return Result.success(userService.listAll());
    }
}
```

**③ 讲解**：

**（1）Controller 只有 1 行业务代码**

```java
return Result.success(userService.listAll());
```

**这就是正确的 Controller**：收请求 → 调 Service → 包装返回。**没有任何 `if`、没有任何循环、没有任何计算。**

如果你的 Controller 里出现了 `if (库存 < 数量)`，说明业务逻辑跑错层了，要挪到 Service。

**（2）完整路径怎么拼**

```
@RequestMapping("/api/users")   类上的前缀
@GetMapping                     方法上不再追加路径
         ↓
GET http://localhost:8080/api/users
```

**（3）注入 Service 的过程回顾**

```java
private final UserService userService;
```

配合 `@RequiredArgsConstructor`，Spring 启动时：
找到 `UserService` 的 Bean → 通过构造器塞进 `UserController`。

**整条依赖链**：

```
UserController  需要 →  UserService  需要 →  UserRepository  需要 →  DataSource（数据库连接池）
```

Spring 会自动**按正确顺序**创建这一整条链上的所有对象。你什么都不用管。

## 步骤 3.6：启动并验证

```bash
./mvnw spring-boot:run
```

**④ 验证 —— 用 Postman**：

```
方法：GET
地址：http://localhost:8080/api/users
```

点 Send，应该看到：

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "no": "001",
      "dept": "技术部",
      "role": "管理员",
      "roleCode": "admin",
      "phone": "13800131234",
      "username": "zhangsan"
    },
    ... 共 13 条
  ]
}
```

**逐项自查**：

```
[ ] code 是 200
[ ] data 是数组，长度 13
[ ] 字段名是 name / no / dept，不是 realName / employeeNo / department
[ ] role 是中文"管理员"，roleCode 是英文"admin"
[ ] 【最重要】JSON 里没有 password 字段
```

同时看终端，应该有 Hibernate 打印的 SQL：

```sql
select u1_0.id, u1_0.created_at, ... from sys_user u1_0
```

## 常见报错对照表

| 现象 | 原因 | 解决 |
|---|---|---|
| 启动报 `Consider defining a bean of type 'UserRepository'` | Repository 不在启动类的同级或子包下 | 确认 `UserRepository.java` 在 `com.example.computerroom.user` 包里 |
| 启动报 `No property 'xxx' found for type 'User'` | Repository 方法名里的字段名写错 | 对照 `User.java` 的字段名逐字检查 |
| 返回 `{"code":200,"data":[{},{},{}]}` 全是空对象 | DTO 上忘了 `@Getter` | Jackson 靠 getter 取值，加上 `@Getter` |
| 返回 404 | 路径不对 | 确认是 `/api/users` |
| 返回 500，终端有 `LazyInitializationException` | `open-in-view` 相关 | 确认配置里有 `spring.jpa.open-in-view=false` |
| `data` 是空数组 `[]` | 数据库表里没数据 | 回到步骤 2.5 插入测试数据 |

## ⑤ 这一步学到了什么

这一步信息量最大，请务必对着下面这张图回顾一遍**你刚才写的 5 个文件是怎么协作的**：

```
Postman 发 GET /api/users
    ↓
UserController.listAll()             ← 你写的，只有 1 行
    ↓ userService.listAll()
UserService.listAll()                ← 你写的，转换 DTO
    ↓ userRepository.findAll()
UserRepository（Spring 生成的实现）    ← 你只写了接口
    ↓ Hibernate 生成 SQL
MySQL: SELECT * FROM sys_user
    ↓ 13 行数据
Hibernate 封装成 13 个 User 对象
    ↓
UserService: User → UserResponse（去掉密码，字段改名，角色转中文）
    ↓
UserController: 包进 Result
    ↓ Jackson 序列化
JSON → Postman
```

**核心收获**：

- **四层各管一段，互不越界** —— 这是所有企业级 Java 项目的骨架
- **Repository 只写接口，实现由框架生成**
- **DTO 是一道安全闸门**，物理隔绝敏感字段
- `Result<T>` 统一响应格式，前端只写一套处理逻辑
- Spring 自动创建并串联所有对象，你从不写 `new`

**自测题 1**：为什么 Service 要把 `User` 转成 `UserResponse`，而不是直接把 `User` 返回给 Controller？

<details><summary>答案</summary>

因为 `User` 里有 `password` 字段，会被 Jackson 序列化进 JSON 发到浏览器，造成密码哈希泄露。
另外前端需要的字段名（`name`/`no`/`dept`）和实体不一致，也需要 DTO 来对齐。
</details>

**自测题 2**：我想加一个"按部门查用户"的功能，需要改哪几个文件？分别加什么？

<details><summary>答案</summary>

3 个文件：
1. `UserRepository`：加 `List<User> findByDepartment(String department);`
2. `UserService`：加一个方法调用它，并转成 DTO
3. `UserController`：加 `@GetMapping` 暴露接口

**注意 DTO 不用改** —— 返回的还是用户，格式没变。这就是分层的好处：改动范围是可预测的。
</details>

```bash
git add . && git commit -m "阶段3完成：四层打通，第一个查询接口"
```

---

# 阶段 4：完成人员模块的增删改查

**目标**：人员模块的 6 个接口全部可用，Postman 全部测通。

```
GET    /api/users            分页 + 条件搜索
GET    /api/users/{id}       查单个
POST   /api/users            新增
PUT    /api/users/{id}       修改
DELETE /api/users/{id}       删除
DELETE /api/users            批量删除
```

## 步骤 4.1：异常处理机制（先做这个）

**① 为什么先做**：因为下面每个接口都会用到"参数不合法就报错"。先把报错机制建好，后面写业务就顺了。

### 先想清楚：不做统一异常处理会怎样

```java
// Service 里
if (userRepository.existsByUsername(username)) {
    // 怎么告诉前端"用户名已存在"？
}
```

三种糟糕的做法：

```java
return null;                      // ❌ Controller 不知道是"没查到"还是"出错了"
return Result.error(400, "...");  // ❌ Service 返回 Result，业务层被 HTTP 概念污染了
throw new RuntimeException(...);  // ❌ 前端收到 500 和一大堆 Java 堆栈
```

**正确做法**：Service 直接 `throw` 一个自定义异常，由一个**全局处理器**统一接住并翻译成 `Result`。

```
Service: throw new BusinessException("用户名已存在")
    ↓ 一路往上抛，Controller 完全不用管
GlobalExceptionHandler 接住
    ↓ 翻译
{"code": 400, "message": "用户名已存在", "data": null}
```

**Service 里只管 `throw`，Controller 里一个 `try-catch` 都不用写。**

### 代码 1：业务异常类

新建 `common/BusinessException.java`：

```java
package com.example.computerroom.common;

public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
```

就这么简单。继承 `RuntimeException` 的原因见 2.7 节：不用在每层方法签名上写 `throws`。

### 代码 2：全局异常处理器

新建 `common/GlobalExceptionHandler.java`：

```java
package com.example.computerroom.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleBusiness(BusinessException e) {
        return Result.error(400, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(err -> err.getDefaultMessage())
                .orElse("参数不合法");
        return Result.error(400, message);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleUnreadable(HttpMessageNotReadableException e) {
        return Result.error(400, "请求参数格式不正确");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleOther(Exception e) {
        e.printStackTrace();
        return Result.error(500, "服务器内部错误");
    }
}
```

**③ 讲解**：

| 注解 | 作用 |
|---|---|
| `@RestControllerAdvice` | 「全局增强器」。统一处理 Spring MVC Controller 调用链抛出的异常 |
| `@ExceptionHandler(X.class)` | 「我负责处理 X 这类异常」 |
| `@ResponseStatus(...)` | 顺便把 HTTP 状态码也设对（400 / 500） |

**三个处理方法的分工**：

1. **`handleBusiness`** —— 处理我们自己抛的业务异常。`e.getMessage()` 就是 `new BusinessException("用户名已存在")` 里那句话，**直接给用户看**。

2. **`handleValidation`** —— 处理参数校验失败（下一步的 `@NotBlank` 等注解触发的）。
   一次请求可能有多个字段不合法，这里用 `findFirst()` **只取第一条错误**提示给用户 —— 一次给一条，用户改起来不会晕。

3. **`handleOther`** —— 兜底。任何没被上面接住的异常都到这里。
   **注意两点**：
   - `e.printStackTrace()` 把完整堆栈打到**终端**，方便你排查
   - 返回给前端的只是"服务器内部错误"，**不暴露任何内部细节**（数据库表名、类名、SQL 都是攻击者想要的信息）

> **顺序无关**：Spring 会自动选**最精确匹配**的处理器。`BusinessException` 会走第 1 个而不是第 3 个，即使 `Exception` 也能匹配它。

---

## 步骤 4.2：分页 + 条件搜索

**① 为什么要分页**：`findAll()` 会把整张表读进内存。现在 13 条无所谓，将来 10 万条用户，一次查询就能把服务器内存打满。

**分页的本质**：`SELECT * FROM sys_user LIMIT 0, 10` —— 只取 10 条。

### 代码 1：分页响应格式

新建 `common/PageResult.java`：

```java
package com.example.computerroom.common;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

@Getter
public class PageResult<T> {

    private final List<T> list;
    private final long total;
    private final int page;
    private final int size;
    private final int totalPages;

    private PageResult(List<T> list, long total, int page, int size, int totalPages) {
        this.list = list;
        this.total = total;
        this.page = page;
        this.size = size;
        this.totalPages = totalPages;
    }

    public static <E, T> PageResult<T> of(Page<E> page, Function<E, T> mapper) {
        return new PageResult<>(
                page.getContent().stream().map(mapper).toList(),
                page.getTotalElements(),
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalPages()
        );
    }
}
```

**讲解**：

- **`Page<E>`** 是 Spring Data 提供的分页结果对象，里面装着"这一页的数据 + 总条数 + 总页数"
- **`Function<E, T> mapper`** 是一个"转换函数"参数。调用时传 `UserResponse::from`，意思是"用这个方法把每个元素转一下"
- **`page.getNumber() + 1`** —— **这里是最容易出 bug 的地方**：
  - JPA 的页码**从 0 开始**（第一页是 0）
  - 前端习惯**从 1 开始**（第一页是 1）
  - 所以返回给前端时要 `+1`，接收前端参数时要 `-1`

前端会收到：

```json
{
  "code": 200,
  "data": {
    "list": [ ... 10 条 ... ],
    "total": 13,
    "page": 1,
    "size": 10,
    "totalPages": 2
  }
}
```

### 代码 2：Repository 加搜索方法

**问题**：要支持"姓名模糊 + 部门 + 角色"三个条件，而且**每个条件都可能不填**。
按方法名派生的话，得写 8 个方法（2³ 种组合），太蠢了。

**解法**：手写一条 SQL，用"参数为空就跳过这个条件"的技巧。

打开 `user/UserRepository.java`，改成：

```java
package com.example.computerroom.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmployeeNo(String employeeNo);

    @Query("""
            SELECT u FROM User u
            WHERE (:realName IS NULL OR u.realName LIKE %:realName%)
              AND (:department IS NULL OR u.department = :department)
              AND (:roleCode IS NULL OR u.roleCode = :roleCode)
            ORDER BY u.id ASC
            """)
    Page<User> search(@Param("realName") String realName,
                      @Param("department") String department,
                      @Param("roleCode") String roleCode,
                      Pageable pageable);
}
```

**讲解**：

**（1）`@Query` 写的不是 SQL，是 JPQL**

注意里面写的是 `FROM User u`（**Java 类名**），不是 `FROM sys_user`（表名）。

**JPQL** 是 JPA 的查询语言，操作的是**对象和字段**，由 Hibernate 翻译成真正的 SQL：

```
你写的 JPQL:  SELECT u FROM User u WHERE u.realName LIKE %:realName%
                                ↓ Hibernate 翻译
真正的 SQL:   SELECT * FROM sys_user WHERE real_name LIKE ?
```

**（2）`(:realName IS NULL OR ...)` 这个技巧**

```sql
WHERE (:realName IS NULL OR u.realName LIKE %:realName%)
```

- 前端**没传**姓名 → `realName` 是 `null` → `NULL IS NULL` 为真 → **整个条件恒成立，相当于不过滤**
- 前端**传了**"张" → `NULL IS NULL` 为假 → 走后半段 `LIKE '%张%'`

**一条 SQL 搞定 8 种组合**。这是很常用的动态查询技巧。

**（3）`@Param("realName")` 是干什么的**

把方法参数和 JPQL 里的 `:realName` 绑定起来。**必须写**，否则编译后参数名可能丢失，报找不到参数。

**（4）`Pageable` 参数**

`Pageable` 装着"要第几页、每页几条、按什么排序"。你只要在方法签名里加这个参数，
Spring Data 会**自动在 SQL 后面拼上 `LIMIT`**，并且**自动再发一条 `COUNT` 查询**算总数。

**（5）三引号 `"""` 是什么**

Java 15+ 的**文本块**语法，用来写多行字符串，不用到处拼 `+` 和 `\n`。

```java
// 老写法
String sql = "SELECT u FROM User u " +
             "WHERE u.status = 1 " +
             "ORDER BY u.id";

// 文本块，同样效果但好读多了
String sql = """
        SELECT u FROM User u
        WHERE u.status = 1
        ORDER BY u.id
        """;
```

**（6）为什么要 `ORDER BY u.id ASC`**

**分页查询必须有明确排序**。没有排序的话，数据库不保证每次返回的顺序一致 ——
可能出现"第 1 页看到张三，翻到第 2 页又看到张三"的诡异现象。

---

## 步骤 4.3：入参 DTO 与参数校验

**① 为什么不直接用 `User` 接收前端数据**

```java
@PostMapping
public Result<Void> create(@RequestBody User user) {   // ❌ 危险
```

问题：前端可以**传任何字段**，包括你不希望它改的：

```json
{
  "username": "hacker",
  "realName": "黑客",
  "roleCode": "root",      ← 注册时自己给自己设成超级管理员！
  "id": 1,                 ← 甚至可以指定 id 覆盖别人的数据
  "status": 1
}
```

这叫**过度提交攻击（Mass Assignment）**，是真实存在的漏洞类型。

**解法**：为每个操作定义**专门的入参 DTO，只放允许前端填的字段**。

### 先把新增密码改为 BCrypt 哈希

阶段 2 插入的 `temp` 只是本地测试数据，但从现在开始，接口新增的账号绝不能再写明文密码。在 `pom.xml` 增加轻量依赖（这里只使用密码哈希，不会像完整 Security Starter 那样拦截接口）：

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
</dependency>
```

新建 `config/PasswordConfig.java`：

```java
package com.example.computerroom.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

阶段 6 增加完整 Spring Security 后，继续复用这个 Bean；不要在 `SecurityConfig` 里再定义第二个同名 `PasswordEncoder` Bean。

### 代码 1：新增用的 DTO

新建 `user/dto/UserCreateRequest.java`：

```java
package com.example.computerroom.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateRequest {

    @NotBlank(message = "登录账号不能为空")
    @Size(min = 3, max = 50, message = "登录账号长度需在 3-50 之间")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 32, message = "密码长度需在 6-32 之间")
    private String password;

    @NotBlank(message = "姓名不能为空")
    @Size(max = 50, message = "姓名不能超过 50 个字")
    private String name;

    @NotBlank(message = "工号不能为空")
    @Size(max = 20, message = "工号不能超过 20 位")
    private String no;

    @Size(max = 50, message = "部门名称不能超过 50 个字")
    private String dept;

    @Pattern(regexp = "^$|^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

}
```

**讲解校验注解**（这些叫 **Bean Validation**，来自 `Validation` 依赖）：

| 注解 | 校验什么 | 适用类型 |
|---|---|---|
| `@NotBlank` | 不为 null、不为空串、不能只有空格 | String |
| `@NotNull` | 不为 null（空串能通过） | 任意 |
| `@Size(min, max)` | 长度范围 | String / 集合 |
| `@Pattern(regexp)` | 正则匹配 | String |
| `@Min` / `@Max` | 数值范围 | 数字 |
| `@Email` | 邮箱格式 | String |

**`message` 里的话会直接显示给用户**，所以要写成人话（"密码不能为空"），而不是技术术语。

**关于手机号那个正则**：

```java
@Pattern(regexp = "^$|^1[3-9]\\d{9}$", message = "手机号格式不正确")
```

- `^$` 匹配**空字符串** —— 因为手机号是选填的，不填也要能通过
- `|` 或
- `^1[3-9]\d{9}$` 匹配 1 开头、第二位 3-9、后面 9 位数字，共 11 位

> 如果只写 `^1[3-9]\d{9}$`，用户不填手机号就会报错，因为空串匹配不上。
> 这是个很常见的坑：**选填字段的正则要允许空**。

**新增 DTO 故意没有 `roleCode`**。人员管理新增的账号默认只能是普通用户，角色变更统一走阶段 7 的 root 专用接口。否则拥有 `person:add` 的管理员可以在请求里传 `root`，直接创建超级管理员。

### 代码 2：修改用的 DTO

新建 `user/dto/UserUpdateRequest.java`：

```java
package com.example.computerroom.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

    @NotBlank(message = "姓名不能为空")
    @Size(max = 50, message = "姓名不能超过 50 个字")
    private String name;

    @NotBlank(message = "工号不能为空")
    @Size(max = 20, message = "工号不能超过 20 位")
    private String no;

    @Size(max = 50, message = "部门名称不能超过 50 个字")
    private String dept;

    @Pattern(regexp = "^$|^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

}
```

**为什么修改用另一个 DTO，不复用新增的那个**：

| 字段 | 新增 | 修改 |
|---|---|---|
| `username` | 必填 | **不允许改**（登录账号定了就不能变） |
| `password` | 必填 | **不在这里改**（改密码要走单独接口，需要验证旧密码） |
| `roleCode` | 不接收，默认 `user` | **不在这里改**（阶段 7 走 root 专用接口） |

**用两个 DTO，"不能改的字段"物理上就传不进来。** 这比在 Service 里写 `if` 判断可靠。

> 你可能觉得"两个类字段重复，能不能继承一下"。可以，但**不建议** ——
> DTO 是接口契约，各自独立演化更安全。哪天新增要加字段而修改不需要，继承会互相牵扯。
> **DTO 允许适度重复**，这是行业共识。

---

## 步骤 4.4：完整的 UserService

**把 `user/UserService.java` 整个替换成下面内容**：

```java
package com.example.computerroom.user;

import com.example.computerroom.common.BusinessException;
import com.example.computerroom.common.PageResult;
import com.example.computerroom.user.dto.UserCreateRequest;
import com.example.computerroom.user.dto.UserResponse;
import com.example.computerroom.user.dto.UserUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PageResult<UserResponse> search(String realName, String dept, String roleCode,
                                           int page, int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.max(1, Math.min(size, 100));
        Pageable pageable = PageRequest.of(safePage - 1, safeSize);
        return PageResult.of(
                userRepository.search(blankToNull(realName), blankToNull(dept),
                                      blankToNull(roleCode), pageable),
                UserResponse::from
        );
    }

    public UserResponse getById(Long id) {
        return UserResponse.from(findEntity(id));
    }

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("登录账号已存在：" + request.getUsername());
        }
        if (userRepository.existsByEmployeeNo(request.getNo())) {
            throw new BusinessException("工号已存在：" + request.getNo());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRealName(request.getName());
        user.setEmployeeNo(request.getNo());
        user.setDepartment(request.getDept());
        user.setPhone(request.getPhone());
        user.setRoleCode("user");
        user.setStatus(1);

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = findEntity(id);

        if (!user.getEmployeeNo().equals(request.getNo())
                && userRepository.existsByEmployeeNo(request.getNo())) {
            throw new BusinessException("工号已被其他人使用：" + request.getNo());
        }

        user.setRealName(request.getName());
        user.setEmployeeNo(request.getNo());
        user.setDepartment(request.getDept());
        user.setPhone(request.getPhone());

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = findEntity(id);
        if ("root".equals(user.getRoleCode())) {
            throw new BusinessException("超级管理员不能被删除");
        }
        userRepository.delete(user);
    }

    @Transactional
    public void deleteBatch(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException("请至少选择一条记录");
        }
        ids.forEach(this::delete);
    }

    private User findEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("用户不存在，id=" + id));
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
```

### 逐个方法讲解

**（1）`search` —— 页码换算和上限保护**

```java
int safePage = Math.max(page, 1);
int safeSize = Math.max(1, Math.min(size, 100));
Pageable pageable = PageRequest.of(safePage - 1, safeSize);
```

三件事同时发生：

| 代码 | 为什么 |
|---|---|
| `Math.max(page, 1)` | 前端传 `page=0` 或负数时兜底为第 1 页 |
| `safePage - 1` | 前端页码从 1 开始，JPA 从 0 开始 |
| `Math.max(1, Math.min(size, 100))` | 把每页条数限制在 1-100；既防止超大查询，也防止 `size=0` 触发异常 |

> 最后那一条容易被忽略，但很重要：**任何来自前端的数值都要设上限**。
> 不设的话，一个 `?size=10000000` 的请求就能让你的服务卡死。

**（2）`blankToNull` —— 空串转 null**

前端搜索框没填时，通常传的是**空字符串** `?realName=`，不是 `null`。
而我们 SQL 里的技巧判断的是 `IS NULL`。所以要转一下：

```
前端传 realName=""  →  转成 null  →  SQL 里条件不生效  →  查全部  ✅
不转的话            →  LIKE '%%'  →  虽然也能查全部，但走不了索引，性能差
```

**（3）`create` —— 唯一性检查为什么必须写**

数据库上已经有 `unique=true` 了，为什么 Java 里还要查一遍？

因为**报错信息完全不同**：

```
不查，靠数据库拦：DataIntegrityViolationException: Duplicate entry 'zhangsan' for key 'sys_user.username'
                → 被兜底处理器接住 → 前端显示"服务器内部错误"  ❌ 用户看不懂

Java 里先查：    BusinessException("登录账号已存在：zhangsan")
                → 前端显示"登录账号已存在：zhangsan"  ✅ 用户知道怎么改
```

**两层都要有**：Java 里的检查负责给出**友好提示**，数据库唯一索引负责**兜底**（并发情况下 Java 检查可能同时通过）。

**（4）`update` —— 最容易写错的一处**

```java
if (!user.getEmployeeNo().equals(request.getNo())
        && userRepository.existsByEmployeeNo(request.getNo())) {
    throw new BusinessException("工号已被其他人使用");
}
```

**为什么要先判断 `!user.getEmployeeNo().equals(request.getNo())`**？

假设张三工号 001，你只想改他的电话，工号保持 001 不变。
如果直接写 `if (existsByEmployeeNo("001")) throw ...`，会查到**张三自己**，然后报"工号已存在" ——
**用户改不了自己的信息了。**

所以逻辑是：**只有工号真的变了，才需要检查新工号有没有被别人占用。**

> 这个坑几乎每个新手都会踩一次。记住这个模式：**改唯一字段前，先判断是否真的改了。**

**（5）`update` 里为什么不用 `new User()`**

```java
User user = findEntity(id);   // 先查出来
user.setRealName(...);        // 再改属性
userRepository.save(user);    // 保存
```

如果 `new User()` 然后 `setId(id)` 再 save，那些**你没有 set 的字段会全变成 null** ——
`createdAt` 没了、`password` 没了、`status` 没了。这叫**字段丢失**。

**修改的正确姿势永远是"先查出来，改想改的字段，再保存"。**

**（6）`delete` —— 业务保护规则**

```java
if ("root".equals(user.getRoleCode())) {
    throw new BusinessException("超级管理员不能被删除");
}
```

注意写法是 `"root".equals(x)` 而不是 `x.equals("root")`。
前者在 `x` 为 `null` 时返回 `false`，后者会抛 `NullPointerException`。
**这是 Java 里的一个惯用防御写法**，养成习惯。

**（7）`deleteBatch` —— `this::delete` 的坑**

```java
ids.forEach(this::delete);
```

这里**能正常工作**是因为 `delete` 也是本类的 `@Transactional` 方法，
但要注意：**`this::delete` 的事务注解不生效**（同类内部调用绕过了 Spring 代理，见 9 章）。

不过这里没问题，因为 `deleteBatch` 自己就有 `@Transactional`，
整个批量操作在**同一个事务**里 —— 要么全删成功，要么一个都不删。这正是我们想要的。

**（8）角色不由普通人员接口接收**

新增时 Service 固定写入 `user`，修改时完全不碰 `roleCode`。阶段 7 会提供仅 root 可调用的独立角色接口，并在那里进行白名单校验。把敏感操作从普通 CRUD 中物理隔离，比依赖前端下拉框更安全。

---

## 步骤 4.5：完整的 UserController

**把 `user/UserController.java` 整个替换成**：

```java
package com.example.computerroom.user;

import com.example.computerroom.common.PageResult;
import com.example.computerroom.common.Result;
import com.example.computerroom.user.dto.UserCreateRequest;
import com.example.computerroom.user.dto.UserResponse;
import com.example.computerroom.user.dto.UserUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public Result<PageResult<UserResponse>> list(
            @RequestParam(name = "realName", required = false) String realName,
            @RequestParam(name = "dept", required = false) String dept,
            @RequestParam(name = "roleCode", required = false) String roleCode,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return Result.success(userService.search(realName, dept, roleCode, page, size));
    }

    @GetMapping("/{id}")
    public Result<UserResponse> getById(@PathVariable("id") Long id) {
        return Result.success(userService.getById(id));
    }

    @PostMapping
    public Result<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        return Result.success(userService.create(request));
    }

    @PutMapping("/{id}")
    public Result<UserResponse> update(@PathVariable("id") Long id,
                                       @Valid @RequestBody UserUpdateRequest request) {
        return Result.success(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        userService.delete(id);
        return Result.success();
    }

    @DeleteMapping
    public Result<Void> deleteBatch(@RequestBody List<Long> ids) {
        userService.deleteBatch(ids);
        return Result.success();
    }
}
```

### 三种取参数的方式（必须分清）

| 注解 | 参数在哪 | 例子 |
|---|---|---|
| `@RequestParam` | **URL 的问号后面** | `/api/users?realName=张&page=1` |
| `@PathVariable` | **URL 路径里** | `/api/users/5` → `id = 5` |
| `@RequestBody` | **请求体（JSON）** | POST 的 body |

**`@RequestParam` 的两个重要属性**：

```java
@RequestParam(required = false) String realName      // 可以不传，不传就是 null
@RequestParam(defaultValue = "1") int page          // 不传就用默认值 1
```

> **不写 `required = false` 会怎样**：前端不传这个参数，直接报 400，
> 提示 `Required request parameter 'realName' is not present`。搜索框没填就报错，显然不对。

**`@PathVariable Long id` 的名字匹配**：

```java
@GetMapping("/{id}")                        // 路径里的占位符叫 id
public Result<UserResponse> getById(@PathVariable Long id)   // 参数名也叫 id → 自动匹配
```

本教程统一显式写名称，例如 `@PathVariable("id") Long id`。这样即使编译器没有保留方法参数名也能正常绑定；参数变量想叫 `userId` 时同样写 `@PathVariable("id") Long userId`。

**`@Valid` —— 触发校验的开关**

```java
public Result<UserResponse> create(@Valid @RequestBody UserCreateRequest request)
                                   ↑ 没有这个，DTO 里的 @NotBlank 等注解【完全不生效】
```

**这是新手最常见的困惑之一**：明明写了 `@NotBlank`，为什么空值也能通过？
答案：**Controller 参数上忘了加 `@Valid`**。

校验失败时，Spring 抛 `MethodArgumentNotValidException`，
被步骤 4.1 写的 `handleValidation` 接住，返回 `{"code":400,"message":"密码不能为空"}`。

**HTTP 方法与注解的对应**

```java
@GetMapping      → GET      查询
@PostMapping     → POST     新增
@PutMapping      → PUT      修改
@DeleteMapping   → DELETE   删除
```

`@GetMapping` 不写路径就等于类上的路径本身，即 `GET /api/users`。

---

## 步骤 4.6：配置跨域（CORS）

**① 为什么需要**：前端页面跑在 `http://localhost:5500`，后端在 `http://localhost:8080`。
**端口不同就算"不同源"**，浏览器的**同源策略**会拦住这个请求，控制台报：

```
Access to fetch at 'http://localhost:8080/api/users' from origin 'http://localhost:5500'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**注意**：这个拦截是**浏览器**做的，不是后端拒绝了你。用 Postman 测**完全不会有这个问题**（Postman 不是浏览器，没有同源策略）。

所以典型症状是：**Postman 测通了，前端页面却报错。** 这时候就是 CORS 没配。

**② 代码**：新建 `config/CorsConfig.java`：

```java
package com.example.computerroom.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }
}
```

**③ 讲解**：

| 配置 | 含义 |
|---|---|
| `addMapping("/api/**")` | 只对 `/api` 下的接口开放跨域 |
| `allowedOriginPatterns("http://localhost:*")` | 允许来自本机任意端口的请求。`*` 通配端口，这样你换端口不用改代码 |
| `allowedMethods(...)` | 允许的 HTTP 方法。**`OPTIONS` 必须有**（见下） |
| `allowCredentials(false)` | 本项目用 `Authorization` 请求头，不使用跨域 Cookie，因此无需凭据模式 |
| `maxAge(3600)` | 预检结果缓存 1 小时，减少重复的 OPTIONS 请求 |

**关于 `OPTIONS`**：浏览器发 PUT / DELETE 或带自定义请求头的请求前，
会**先偷偷发一个 `OPTIONS` 请求**问服务器"我能这么请求吗"，这叫**预检请求（preflight）**。
不允许 `OPTIONS`，你的 PUT / DELETE 全都会失败。

> **为什么用 `allowedOriginPatterns` 而不是 `allowedOrigins`**：前者支持本地开发端口通配。
> 生产环境必须改成具体前端地址，例如 `allowedOrigins("https://app.example.com")`。

> **生产环境**要把 `allowedOriginPatterns` 改成你的真实域名，
> 比如 `https://crm.yourcompany.com`。留着 `localhost:*` 不算严重风险，但不专业。

---

## 步骤 4.7：用 Postman 逐个测试

**重启项目**，然后按顺序测。**每一个都测通了再往下**。

### 测试 1：分页查询

```
GET http://localhost:8080/api/users?page=1&size=10
```

期望：`data.list` 有 10 条，`data.total` 是 13，`data.totalPages` 是 2。

```
GET http://localhost:8080/api/users?page=2&size=10
```

期望：`data.list` 有 3 条，`data.page` 是 2。

### 测试 2：条件搜索

```
GET http://localhost:8080/api/users?realName=张
GET http://localhost:8080/api/users?dept=技术部
GET http://localhost:8080/api/users?roleCode=admin
GET http://localhost:8080/api/users?dept=技术部&roleCode=admin
```

期望：分别返回 1 条（张三）、5 条、2 条、1 条。

> 如果中文搜索没结果，看终端打印的 SQL 里参数是不是乱码。
> Postman 一般没问题；浏览器直接访问要注意 URL 编码。

### 测试 3：查单个

```
GET http://localhost:8080/api/users/1
GET http://localhost:8080/api/users/9999
```

期望：第一个返回张三；第二个返回 `{"code":400,"message":"用户不存在，id=9999"}`。

**第二个能返回这个友好提示，说明你的异常处理机制生效了。**

### 测试 4：新增

```
POST http://localhost:8080/api/users
Body → raw → JSON:
```

```json
{
  "username": "testuser",
  "password": "123456",
  "name": "测试员",
  "no": "999",
  "dept": "技术部",
  "phone": "13812345678",
}
```

> **Postman 操作提醒**：Body 选 `raw`，右边下拉框选 **JSON**（不是 Text）。
> 选错了会报 `Content-Type 'text/plain' is not supported`。

期望：返回 `code: 200`，`data` 里是新用户（带自动生成的 id）。去 DBeaver 查一下确实多了一行。

### 测试 5：校验是否生效（重要）

**这几个必须都返回对应的中文提示**，说明 `@Valid` 生效了：

```json
{"username": "", "password": "123456", "name": "测试", "no": "998"}
```
→ 期望 `{"code":400,"message":"登录账号不能为空"}`

```json
{"username": "abc", "password": "123", "name": "测试", "no": "997"}
```
→ 期望 `{"code":400,"message":"密码长度需在 6-32 之间"}`

```json
{"username": "abc2", "password": "123456", "name": "测试", "no": "996", "phone": "123"}
```
→ 期望 `{"code":400,"message":"手机号格式不正确"}`

```json
{"username": "testuser", "password": "123456", "name": "重复", "no": "995"}
```
→ 期望 `{"code":400,"message":"登录账号已存在：testuser"}`

在 JSON 里额外传入 `"roleCode":"root"`，期望新用户仍然是 `user`。默认情况下 Jackson 会忽略 DTO 中不存在的字段；角色值没有进入 `UserCreateRequest`，因此不会被保存。

> **如果空 username 也能通过**，说明 Controller 上忘了写 `@Valid`。回去步骤 4.5 检查。

### 测试 6：修改

```
PUT http://localhost:8080/api/users/1
```

```json
{
  "name": "张三丰",
  "no": "001",
  "dept": "技术部",
  "phone": "13800000000",
}
```

期望：返回改后的数据。**注意 `no` 还是填 001（没变），应该能成功** ——
这验证了步骤 4.4 里那个"改唯一字段前先判断是否真的改了"的逻辑。

再试把 `no` 改成 `002`（李四的工号）：

期望：`{"code":400,"message":"工号已被其他人使用：002"}`

### 测试 7：删除

```
DELETE http://localhost:8080/api/users/14
```
（14 是测试 4 新增的那个 id，按实际改）

期望：`{"code":200,"message":"success","data":null}`

### 测试 8：批量删除

```
DELETE http://localhost:8080/api/users
Body → raw → JSON:
[15, 16]
```

期望：成功，或者返回"用户不存在"（如果 id 不存在）。

再测空数组 `[]`：期望 `{"code":400,"message":"请至少选择一条记录"}`

## 阶段 4 完成标准

```
[ ] 分页查询正确（第 1 页 10 条，第 2 页 3 条）
[ ] 三个搜索条件单独用、组合用都对
[ ] 查不存在的 id 返回友好提示，不是 500
[ ] 新增成功，数据库里能看到
[ ] 空账号 / 短密码 / 错手机号 都被拦下并返回中文提示
[ ] 重复账号、重复工号被拦下
[ ] 请求额外携带 roleCode 也不能改变新用户的默认 user 角色
[ ] 修改时工号不变能成功
[ ] 修改时工号改成别人的被拦下
[ ] 删除成功，root 用户删不掉
[ ] 批量删除空数组被拦下
[ ] 所有返回的 JSON 里都【没有】password 字段
```

**12 项全部打勾才能进阶段 5。** 这一步扎实了，后面 8 个模块都是照着抄。

## ⑤ 这一步学到了什么

- **异常处理**：Service 只管 `throw`，全局处理器统一翻译，业务代码里零 `try-catch`
- **分页**：`Pageable` + `Page`，注意**前端页码从 1、JPA 从 0**，以及给 `size` 设上限
- **动态查询**：`(:param IS NULL OR ...)` 一条 SQL 应付所有条件组合
- **入参 DTO**：只放允许前端填的字段，物理防御过度提交攻击
- **参数校验**：DTO 上写 `@NotBlank`，Controller 参数上写 `@Valid`，**两个都要有才生效**
- **改唯一字段前先判断是否真的改了** —— 记住这个坑
- **修改要先查再改再存**，不要 `new` 一个新对象
- **CORS**：浏览器的同源策略，Postman 通了但页面不通就查这里

**自测题**：我要加一个"按手机号搜索"的条件，需要改哪几处？

<details><summary>答案</summary>

3 处：
1. `UserRepository.search()` 的 JPQL 加一行 `AND (:phone IS NULL OR u.phone LIKE %:phone%)`，方法参数加 `@Param("phone") String phone`
2. `UserService.search()` 加一个 `phone` 参数，透传下去（记得 `blankToNull`）
3. `UserController.list()` 加一个 `@RequestParam(required = false) String phone`

DTO 和 Entity 都不用动。
</details>

```bash
git add . && git commit -m "阶段4完成：人员模块CRUD + 分页搜索 + 校验 + 异常处理 + CORS"
```

---

# 阶段 5：前后端联调（第一个里程碑）

**目标**：通过 `index.html` 进入人员管理，表格里显示的是**数据库里的真实数据**，搜索、翻页、新增、编辑、删除全部走后端接口。

**这一步做完，你就有了一个真正的全栈应用。** 是整个项目最有成就感的时刻。

## 步骤 5.1：给前端加统一请求方法

**① 为什么**：如果每个页面都自己写 `fetch`，光是"拼 URL、设请求头、判断 code、处理报错"这些重复代码就要写十几遍。
封装一次，所有页面共用。

**② 代码**：打开 `front/js/utils.js`，在 `formatDate` 方法**后面**（`}` 之前）添加：

```javascript
  // ===== 后端接口请求 =====
  API_BASE: 'http://localhost:8080',

  async request(path, options = {}) {
    const token = this.storage.get('login-token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(this.API_BASE + path, { ...options, headers });

      if (res.status === 401) {
        this.storage.remove('login-token');
        this.storage.remove('login-user');
        alert('登录已过期，请重新登录');
        location.href = 'login.html';
        return null;
      }

      const body = await res.json();
      if (body.code !== 200) {
        alert(body.message || '请求失败');
        return null;
      }
      return body;
    } catch (err) {
      console.error('[API]', path, err);
      alert('无法连接服务器，请确认后端已启动');
      return null;
    }
  },

  get(path, params) {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ) : '';
    return this.request(path + query);
  },

  post(path, data) {
    return this.request(path, { method: 'POST', body: JSON.stringify(data) });
  },

  put(path, data) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(data) });
  },

  del(path, data) {
    return this.request(path, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined
    });
  }
```

> **注意**：添加时确保上一个方法 `formatDate` 结尾有逗号 `,`，否则会有语法错误。

**③ 讲解**：

**（1）为什么统一处理 401**

阶段 6 之后 token 会过期。集中在这里处理，**所有页面自动获得"过期就跳登录页"的行为**，
不用在 20 个地方各写一遍。

**（2）`new URLSearchParams` 自动处理中文编码**

```javascript
{ realName: '张', dept: '技术部' }  →  ?realName=%E5%BC%A0&dept=%E6%8A%80%E6%9C%AF%E9%83%A8
```

如果自己手拼字符串 `'?realName=' + '张'`，中文不编码，后端**收到的是乱码**。

**（3)`.filter(([, v]) => v !== '' && v != null)` 在干什么**

把值为空的参数**去掉**。搜索框没填时不发这个参数，URL 更干净：

```
过滤前：?realName=&dept=技术部&roleCode=
过滤后：?dept=技术部
```

> `[, v]` 这个写法是解构，跳过第一个元素（key），只取第二个（value）。

**（4）为什么叫 `del` 不叫 `delete`**

`delete` 是 JavaScript 的运算符关键字。对象属性可以叫 `delete`，但这里用 `del` 能避免和删除运算符混淆，也与项目现有调用保持简短。

## 步骤 5.2：起一个本地服务器跑前端

**① 为什么不能直接双击 HTML 文件打开**

双击打开时地址栏是 `file:///Users/fashion/.../index.html`，协议是 `file://`。
浏览器通常把 `file://` 页面视为不透明来源，请求可能携带 `Origin: null`；当前 CORS 配置只允许 `localhost` 和 `127.0.0.1`，因此会被拒绝，而且不同浏览器行为并不一致。

**必须通过 `http://` 访问。** 现有前端是一个简单的单页应用：`pages/person.html` 只是页面片段，没有脚本和公共布局，必须由 `index.html` 中的路由加载。

```text
index.html → App.init() → AppRouter.navigate('/person')
           → fetch('pages/person.html') → PersonPage.init()
```

**② 三种方式，选一种**：

**方式 A：VS Code 的 Live Server 插件**（最方便）

1. VS Code 里搜索安装 **Live Server** 插件
2. 用 VS Code 打开 `front` 文件夹
3. 右键 `index.html` → `Open with Live Server`
4. 浏览器打开 `http://127.0.0.1:5500/index.html`，再从左侧菜单进入“人员管理”

> 好处：改完 JS 保存后**页面自动刷新**，不用手动按 F5。

**方式 B：Node（你已经装了 v26）**

```bash
cd ~/Documents/Study/ComputerRoomSystem/front
npx serve -l 5500
```

然后浏览器打开 `http://localhost:5500/index.html`，再进入“人员管理”。

**方式 C：Python（你也装了）**

```bash
cd ~/Documents/Study/ComputerRoomSystem/front
python3 -m http.server 5500
```

**验证**：浏览器地址栏是 `http://localhost:5500/...` 或 `http://127.0.0.1:5500/...`，
**不是 `file://`**。

## 步骤 5.3：改造 person.js

现在的 `person.js` 是**纯前端假数据版**：数据写死在 `data` 数组里，搜索/分页/增删改全在浏览器内存里操作。

我们要把它改成**真的调后端**。一共 7 处改动，我按顺序给出。

> **改之前先备份**：`cp js/person.js js/person.js.bak`，改崩了能对照。

### 改动 1：删掉示例数据，加上角色映射

把开头的 `data: [ ... 13 条 ... ]` **整个删掉**，替换成：

```javascript
// 人员管理页面逻辑（接入后端 API）
const PersonPage = {
  PAGE_SIZE: 10,
  currentPage: 1,
  keyword: { name: '', dept: '', role: '' },
  editingId: null,

  data: [],        // 当前页数据，由后端返回
  total: 0,        // 总条数，由后端返回
  totalPage: 1,    // 总页数，由后端返回

  // 前端下拉框是中文，后端存的是英文编码，这里做转换
  ROLE_TO_CODE: { '管理员': 'admin', '普通用户': 'user' },
```

**为什么要 `ROLE_TO_CODE`**：人员搜索下拉框的 value 是中文：

```html
<option value="管理员">管理员</option>
```

而后端搜索接口收的是 `roleCode: "admin"`。**必须转换**，否则角色筛选查不到数据。root 不出现在普通角色下拉框中；它应显示但不能通过人员 CRUD 修改。

### 改动 2：`init` 改成异步加载

```javascript
  async init() {
    this.bindEvents();
    await this.load();
  },

  // 向后端请求当前页数据
  async load() {
    const res = await Utils.get('/api/users', {
      realName: this.keyword.name,
      dept: this.keyword.dept,
      roleCode: this.ROLE_TO_CODE[this.keyword.role] || '',
      page: this.currentPage,
      size: this.PAGE_SIZE
    });
    if (!res) return;                 // 请求失败，Utils 已经弹过提示了

    this.data = res.data.list;
    this.total = res.data.total;
    this.totalPage = res.data.totalPages;
    this.currentPage = res.data.page;
    this.render();
  },
```

**讲解**：

- `async` / `await` —— 网络请求是**异步**的（要等服务器响应）。`await` 的意思是"等这行拿到结果再往下执行"
- `if (!res) return;` —— `Utils.request` 出错时返回 `null`，这里直接退出，不继续处理
- **后端返回的分页信息覆盖本地状态**，前端不再自己算

### 改动 3：删掉 `filtered()` 和 `totalPages()`

这两个方法是"在浏览器里过滤和分页"，现在这些活**都交给数据库了**（`WHERE` 和 `LIMIT`）。

**把这两个方法整个删掉**：

```javascript
  // ❌ 删掉这个
  filtered() { ... },

  // ❌ 删掉这个
  totalPages() { ... },
```

> **为什么必须让数据库做过滤和分页**：现在 13 条数据，全查回来在前端过滤没问题。
> 但如果有 10 万用户，你要把 10 万条数据传到浏览器再过滤 —— 光传输就要几十秒，浏览器直接卡死。
> **数据的筛选和分页永远在数据库层做。**

### 改动 4：`render` 不再自己过滤分页

把 `render()` 开头的几行改掉：

```javascript
  render() {
    const page = this.data;      // 后端已经返回了当前页，直接用
    const tbody = document.getElementById('person-tbody');

    if (page.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-row">暂无数据</td></tr>';
    } else {
      tbody.innerHTML = page.map(p => `
        <tr>
          <td><input type="checkbox" class="person-check" data-id="${p.id}"></td>
          <td>${Utils.escapeHTML(p.name)}</td>
          <td>${Utils.escapeHTML(p.no)}</td>
          <td>${Utils.escapeHTML(p.dept)}</td>
          <td>${this.roleTag(p.role)}</td>
          <td>${Utils.escapeHTML(p.phone)}</td>
          <td>
            <button type="button" class="btn btn-sm" data-action="edit" data-id="${p.id}"><i class="fa fa-edit"></i> 编辑</button>
            <button type="button" class="btn btn-danger btn-sm" data-action="del" data-id="${p.id}"><i class="fa fa-trash"></i> 删除</button>
          </td>
        </tr>
      `).join('');
    }

    this.renderPagination(this.total);
  },
```

**注意 `map` 里面一个字都没改** —— 因为后端 DTO 的字段名（`name`/`no`/`dept`/`role`/`phone`）
**故意和原来的示例数据保持一致**。这就是步骤 3.3 那个设计的回报。

`renderPagination` 里把 `this.totalPages()` 改成 `this.totalPage`：

```javascript
    for (let i = 1; i <= this.totalPage; i++) {
```

### 改动 5：搜索和翻页改为重新请求后端

```javascript
  doSearch() {
    this.keyword = {
      name: document.getElementById('person-search-name').value.trim(),
      dept: document.getElementById('person-search-dept').value,
      role: document.getElementById('person-search-role').value
    };
    this.currentPage = 1;
    this.load();              // ← 原来是 this.render()
  },
```

`bindEvents` 里的**重置按钮**：

```javascript
    document.getElementById('btn-person-reset').addEventListener('click', () => {
      document.getElementById('person-search-name').value = '';
      document.getElementById('person-search-dept').value = '';
      document.getElementById('person-search-role').value = '';
      this.keyword = { name: '', dept: '', role: '' };
      this.currentPage = 1;
      this.load();            // ← 原来是 this.render()
    });
```

`bindEvents` 里的**分页点击**：

```javascript
    document.getElementById('person-pagination').addEventListener('click', (e) => {
      const btn = e.target.closest('.page-btn');
      if (!btn) return;
      const target = btn.dataset.page;
      if (target === 'prev') this.currentPage = Math.max(1, this.currentPage - 1);
      else if (target === 'next') this.currentPage = Math.min(this.totalPage, this.currentPage + 1);
      else this.currentPage = Number(target);
      this.load();            // ← 原来是 this.render()
    });
```

**规律**：凡是原来写 `this.render()` 的地方，只要**数据需要重新取**，就改成 `this.load()`。
`render()` 只负责"把 `this.data` 画到页面上"，不负责取数据。

### 改动 6：保存改为调接口

`save()` 整个替换成：

> 阶段 5 暂不允许在人员弹窗修改角色。`person-role` 可以设为禁用或只作展示；阶段 7 完成后，root 通过独立角色接口修改。普通新增/编辑接口不会接收 `roleCode`。

```javascript
  async save() {
    const name = document.getElementById('person-name').value.trim();
    const no = document.getElementById('person-no').value.trim();
    const dept = document.getElementById('person-dept').value;
    const phone = document.getElementById('person-phone').value.trim();

    if (!name || !no || !phone) {
      alert('请填写姓名、工号和电话');
      return;
    }

    let res;
    if (this.editingId === null) {
      // 新增：后端要求 username 和 password，这里用工号生成默认值
      res = await Utils.post('/api/users', {
        username: 'u' + no,
        password: '123456',
        name, no, dept, phone
      });
    } else {
      res = await Utils.put(`/api/users/${this.editingId}`, {
        name, no, dept, phone
      });
    }

    if (!res) return;          // 后端校验没过，Utils 已弹出提示，弹窗保持打开让用户改
    this.closeModal();
    await this.load();
  },
```

**讲解**：

**（1）为什么新增时要自己造 `username` 和 `password`**

后端的 `UserCreateRequest` 要求账号和密码必填（登录要用），但人员弹窗里**没有这两个输入框**。

三种处理方式：

| 方案 | 做法 | 适用 |
|---|---|---|
| **A（本教程用）** | 前端生成默认值：账号 = `u` + 工号，密码 = `123456`；角色由后端固定为 `user` | 快速跑通，管理员建号后让员工自己改密码 |
| B | 在 `person.html` 里加两个输入框 | 更规范，但要改 HTML |
| C | 后端把这两个字段改成选填，Service 里生成默认值 | 逻辑放后端，更内聚 |

先用 A 跑通。**跑通之后你可以自己改成 B 练手** —— 这是很好的练习。

**（2）`if (!res) return;` 后面故意不关弹窗**

后端校验失败时（比如工号重复），`Utils` 会 `alert` 出提示，然后返回 `null`。
这时候**保持弹窗打开**，用户改一下就能重新提交。如果关掉，用户填的内容全丢了。

**这是一个小但很重要的体验细节。**

### 改动 7：删除改为调接口

`remove()` 和 `batchRemove()` 替换成：

```javascript
  async remove(id) {
    const p = this.data.find(i => i.id === id);
    if (!p) return;
    if (!confirm(`确定删除「${p.name}」吗？`)) return;

    const res = await Utils.del(`/api/users/${id}`);
    if (!res) return;
    await this.load();
  },

  async batchRemove() {
    const ids = [...document.querySelectorAll('.person-check:checked')].map(c => Number(c.dataset.id));
    if (ids.length === 0) {
      alert('请先勾选要删除的人员');
      return;
    }
    if (!confirm(`确定删除选中的 ${ids.length} 位人员吗？`)) return;

    const res = await Utils.del('/api/users', ids);
    if (!res) return;
    document.getElementById('person-check-all').checked = false;
    await this.load();
  },
```

**`openEdit` 不用改** —— 它从 `this.data`（当前页数据）里找，而 `this.data` 现在装的是后端返回的数据，字段名一样。

---

## 步骤 5.4：验证里程碑

**启动顺序（两个都要跑）**：

```bash
# 终端 1：后端
cd ~/Documents/Study/ComputerRoomSystem/back
./mvnw spring-boot:run

# 终端 2：前端
cd ~/Documents/Study/ComputerRoomSystem/front
npx serve -l 5500
```

浏览器打开 `http://localhost:5500/index.html`，点击左侧“人员管理”。不要直接打开 `pages/person.html`，它只是路由片段，单独打开不会执行 `PersonPage.init()`。

**④ 逐项验证**：

```
[ ] 表格显示 10 条数据，底部显示"共 13 条"
[ ] 点第 2 页，显示剩下 3 条
[ ] 姓名搜"张" → 只剩张三
[ ] 部门选"技术部" → 只剩技术部的人
[ ] 角色选"管理员" → 只剩管理员
[ ] 点重置 → 恢复全部 13 条
[ ] 点添加，填完保存 → 列表出现新人，DBeaver 里也能查到
[ ] 点编辑，改个电话保存 → 列表更新，刷新页面后改动还在
[ ] 点删除 → 确认后消失，DBeaver 里也没了
[ ] 勾选两个，批量删除 → 都消失
[ ] 【关键】按 F5 刷新页面，数据还在（说明存的是数据库不是内存）
```

**最后一项是这个阶段真正的意义**：改完刷新还在 = 数据真的进了 MySQL。

### 打开 F12 学会看请求

按 `F12` → `Network` 标签 → 刷新页面。你会看到：

```
Name                                    Status   Type
users?dept=&page=1&size=10              200      fetch
```

点进去看三个标签：

| 标签 | 看什么 |
|---|---|
| **Headers** | 请求的完整 URL、方法、状态码 |
| **Payload** | POST/PUT 发出去的 JSON |
| **Response** | 后端返回的 JSON |

**这是前后端联调最重要的工具。** 以后遇到"页面显示不对"，第一步永远是：
**看 Network 里后端到底返回了什么** —— 就能立刻分清是前端渲染错了还是后端数据错了。

## 联调常见问题对照表

| 现象 | 原因 | 解决 |
|---|---|---|
| 控制台 `blocked by CORS policy` | 跨域没配 | 检查 `CorsConfig.java`，重启后端 |
| 控制台 `Failed to fetch` | 后端没启动 | 看终端 1 是否在运行 |
| `origin 'null' has been blocked` | 用 `file://` 打开的 | 必须用本地服务器，见步骤 5.2 |
| 表格空白，但 Network 里有数据 | 字段名对不上 | 对比 Response 的 JSON 和 `render` 里用的字段名 |
| 表格空白，Network 显示 `data.list` 是 `[]` | 搜索条件把数据过滤掉了 | 点重置按钮 |
| 中文搜索无结果 | URL 编码问题 | 确认用了 `Utils.get`（内部用 `URLSearchParams`） |
| 第 1 页少数据 / 第 2 页重复 | 页码差 1 | 检查 `PageResult` 里的 `getNumber() + 1` 和 Service 里的 `page - 1` |
| 角色筛选没有结果 | 中文筛选值没转成 code | 检查 `load()` 里的 `ROLE_TO_CODE` |
| 改完 JS 没生效 | 浏览器缓存 | `Cmd + Shift + R` 强制刷新 |

## ⑤ 这一步学到了什么

- **前后端分离的本质**：两个独立程序，通过 HTTP + JSON 通信
- 后端在 8080，前端在 5500，**必须配 CORS**
- **`file://` 打开的页面永远不能跨域**，必须起本地服务器
- **筛选和分页要在数据库做**，不是查全部再前端过滤
- `async` / `await` 处理异步请求
- **DTO 字段名对齐前端**，能省掉大量前端改动
- **F12 → Network 是联调的第一工具**

**恭喜，你现在有一个真正的全栈应用了。** 后面的模块都是这个流程的重复。

```bash
git add . && git commit -m "阶段5完成：人员模块前后端联调通过（第一个里程碑）"
```

---

# 阶段 6：注册、登录与 JWT

**目标**：真实的登录。密码加密存储，登录返回 token，不带 token 访问接口返回 401。

现在你的前端还是**假登录** —— 看一眼 `front/js/login.js`，它只是往 localStorage 塞了个假 token 就跳转。任何人随便输都能进。

## 核心概念 1：HTTP 是无状态的

**问题**：HTTP 协议**不记得你是谁**。你登录成功后，下一个请求过来，服务器完全不知道这是刚才登录的那个人。

两种解决思路：

| 方案 | 怎么做 | 缺点 |
|---|---|---|
| **Session（传统）** | 服务器内存里存一份"会话 ID → 用户"的映射表 | 服务器要存状态，多台服务器之间还要同步 |
| **JWT（现代）** | 把用户身份**编码并签名**成一个字符串给前端，前端每次请求都带上 | token 一旦发出，到期前无法主动作废 |

前后端分离项目普遍用 **JWT**。

## 核心概念 2：JWT 长什么样，凭什么可信

一个 JWT 就是一个字符串，由**三段用点号连接**：

```
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJ6aGFuZ3NhbiIsImV4cCI6MTc2NzE5NTIwMH0 . 4pcPyMD09olPSyXnrXCjTwXyr4BsezdI1AVTmud2fU4
└──── ① Header ────┘   └──────────────── ② Payload ────────────────┘   └────────────── ③ Signature ──────────────┘
        算法说明                    用户信息 + 过期时间                              签名
```

**① Header 和 ② Payload 只是 Base64 编码，不是加密！**

任何人把 token 复制到 [jwt.io](https://jwt.io) 就能看到里面的内容：

```json
{ "sub": "1", "username": "zhangsan", "roleCode": "admin", "exp": 1767195200 }
```

> **所以 JWT 里绝对不能放敏感信息**（密码、身份证号、银行卡号）。
> 它是**防篡改**的，不是**防偷看**的。

**③ Signature 才是关键 —— 它保证内容没被改过**

```
签名 = HMAC-SHA256( Base64(Header) + "." + Base64(Payload),  服务器的密钥 )
```

攻击者拿到 token，把 Payload 里的 `"roleCode": "user"` 改成 `"roleCode": "root"`，会怎样？

```
改完后：Payload 变了 → 重新计算的签名 ≠ token 里的签名 → 后端验证失败 → 401
```

**攻击者没有服务器的密钥，就算不出正确的签名。** 这就是 JWT 的安全基础。

> **推论：密钥泄露 = 任何人都能伪造任意身份的 token。**
> 所以密钥绝不能提交到 Git，生产环境要放环境变量。

## 完整登录流程

```
① 用户输入账号密码，点登录
        ↓ POST /api/auth/login {"username":"zhangsan","password":"123456"}
② 后端查数据库拿到用户
        ↓
③ BCrypt 校验密码：passwordEncoder.matches("123456", 数据库里的哈希)
        ↓ 通过
④ 生成 token：把 userId、username、roleCode、过期时间打包签名
        ↓
⑤ 返回 {"token":"eyJ...", "user":{...}}
        ↓
⑥ 前端存进 localStorage
        ↓
⑦ 之后每个请求都带请求头：Authorization: Bearer eyJ...
        ↓
⑧ 后端的 JwtAuthenticationFilter 拦下每个请求：
   验签 → 检查过期 → 取出 userId → 放进 Spring Security 上下文
        ↓
⑨ Controller / Service 里随时能拿到"当前登录用户是谁"
```

## 步骤 6.1：加依赖

打开 `back/pom.xml`，在 `<dependencies>` 里面加：

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.6</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.6</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.6</version>
            <scope>runtime</scope>
        </dependency>
```

**IDEA 右下角会弹出提示"Maven 配置已变更"，点 `Load Maven Changes`**（或者点右侧 Maven 面板的刷新图标）。

> **`<scope>runtime</scope>` 是什么意思**：这两个包只在**运行时**需要，编译时用不到。
> 你写代码时只会 `import io.jsonwebtoken.Jwts`（来自 `jjwt-api`），
> 具体实现由 `jjwt-impl` 在运行时提供。这是接口和实现分离的设计。

> **重要提醒**：加了 `spring-boot-starter-security` 之后**先不要启动** ——
> 它会让所有接口默认要登录，你现在还没配放行规则。等步骤 6.5 配好 `SecurityConfig` 再启动。

## 步骤 6.2：配置密钥和过期时间

在 `application.properties` **末尾**追加：

```properties
# ===== JWT =====
jwt.secret=${JWT_SECRET}
jwt.expiration-hours=24
```

**关于密钥**：

- HS256 算法要求密钥**至少 32 字节（256 位）**，太短会报 `WeakKeyException`
- 不提供公开的默认密钥。公开密钥等于没有密钥，任何照着教程的人都能伪造你的 token
- 在当前终端生成并导出自己的密钥：

```bash
export JWT_SECRET="$(openssl rand -base64 48)"
```

同一个终端里执行 `./mvnw spring-boot:run`。关闭终端后环境变量会消失，下次启动前重新设置即可。使用 IDEA 启动时，在 Run Configuration 的 Environment variables 中添加 `JWT_SECRET`。

> 密钥绝不能提交到 Git。没有设置 `JWT_SECRET` 时让程序启动失败，是比使用公开默认值更安全的行为。

## 步骤 6.3：JwtService —— 生成和解析 token

新建 `security/JwtService.java`：

```java
package com.example.computerroom.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtService {

    private final SecretKey key;
    private final long expirationMillis;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiration-hours}") long expirationHours) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMillis = Duration.ofHours(expirationHours).toMillis();
    }

    public String generateToken(Long userId, String username, String roleCode) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claims(Map.of("username", username, "roleCode", roleCode))
                .subject(String.valueOf(userId))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMillis)))
                .signWith(key)
                .compact();
    }

    public Long parseUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Long.valueOf(claims.getSubject());
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}
```

**③ 讲解**：

**（1）`@Value("${jwt.secret}")` —— 读配置文件**

```java
public JwtService(@Value("${jwt.secret}") String secret, ...)
```

Spring 创建这个 Bean 时，**自动把 `application.properties` 里 `jwt.secret` 的值传进来**。
`${}` 里写的就是配置项的 key。

**（2）为什么在构造器里算 `key`，而不是每次用时算**

`Keys.hmacShaKeyFor(...)` 有一定开销。构造器只执行一次（Bean 是单例），
之后 `generateToken` 被调用几万次都复用同一个 `key` 对象。

**（3）`subject` 存什么**

JWT 规范里 `sub`（subject）表示"这个 token 是关于谁的"。我们存 **userId**。

注意要 `String.valueOf(userId)` 转成字符串 —— JWT 的 `sub` 字段必须是字符串。
取出来时再 `Long.valueOf(...)` 转回去。

**（4)`claims(...)` 存额外信息**

除了 `sub`，我们额外放了 `username` 和 `roleCode`。这样后面某些场景不用再查数据库。

> **注意**：`roleCode` 放进 token 有个副作用 —— **管理员改了某人的角色，那人的旧 token 里还是老角色**，
> 要等 token 过期才生效。所以下一步的过滤器**会重新查一次数据库**拿最新角色，token 里的只作备用。

**（5)`signWith(key)` 生成签名**

这一步用密钥对前两段做 HMAC-SHA256，产生第三段签名。没有这一步，token 就是可随意篡改的明文。

**（6)`parseUserId` 里的 `try-catch` 返回 `null`**

`parseSignedClaims` 会在这些情况抛异常：

| 情况 | 异常 |
|---|---|
| 签名不对（被篡改） | `SignatureException` |
| 已过期 | `ExpiredJwtException` |
| 格式不是合法 JWT | `MalformedJwtException` |
| token 是 null 或空串 | `IllegalArgumentException` |

这些**都属于 `JwtException` 的子类**（除了最后一个）。我们统一 catch 后返回 `null`，
表示"这个 token 不可信"。**过滤器会把 `null` 当作"未登录"处理。**

> **为什么不抛异常出去**：token 无效是很正常的情况（过期了、伪造的、根本没登录），
> 不算"程序出错"。返回 `null` 让调用方决定怎么处理，比抛异常更合适。

---

## 步骤 6.4：SecurityUtils —— 随时获取当前登录用户

新建 `security/SecurityUtils.java`：

```java
package com.example.computerroom.security;

import com.example.computerroom.common.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser user)) {
            throw new BusinessException("未登录");
        }
        return user.id();
    }

    public static AuthUser getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser user)) {
            throw new BusinessException("未登录");
        }
        return user;
    }

    public static boolean isRoot() {
        return "root".equals(getCurrentUser().roleCode());
    }
}
```

再新建 `security/AuthUser.java`：

```java
package com.example.computerroom.security;

public record AuthUser(Long id, String username, String roleCode) {
}
```

**③ 讲解**：

**（1）`record` 是什么（Java 16+ 新特性）**

```java
public record AuthUser(Long id, String username, String roleCode) {}
```

一行代码，等价于下面这一大堆：

```java
public final class AuthUser {
    private final Long id;
    private final String username;
    private final String roleCode;

    public AuthUser(Long id, String username, String roleCode) { ... }
    public Long id() { return id; }
    public String username() { return username; }
    public String roleCode() { return roleCode; }
    public boolean equals(Object o) { ... }
    public int hashCode() { ... }
    public String toString() { ... }
}
```

**注意 getter 方法名是 `id()` 而不是 `getId()`** —— record 的风格就是这样。

**什么时候用 record**：**纯粹装数据、创建后不改**的类。DTO、坐标点、配置项都很合适。

**（2)`SecurityContextHolder` 是什么**

Spring Security 提供的一个"当前请求的用户信息存放处"。它底层用 **ThreadLocal** 实现 ——
每个请求由一个线程处理，每个线程有自己独立的一份数据，**互不干扰**。

```
请求 A（张三的线程）→ SecurityContextHolder 里是张三
请求 B（李四的线程）→ SecurityContextHolder 里是李四
两者同时进行，各自读到自己的
```

所以你可以在**任何地方**（Service 深处、工具方法里）调 `SecurityUtils.getCurrentUserId()`，
不需要一层层把 userId 当参数传下去。

**（3)`instanceof AuthUser user` 这个写法**

Java 16+ 的**模式匹配**语法：

```java
// 新写法
if (auth.getPrincipal() instanceof AuthUser user) {
    return user.id();       // user 变量直接可用，已经是 AuthUser 类型
}

// 老写法，等价
if (auth.getPrincipal() instanceof AuthUser) {
    AuthUser user = (AuthUser) auth.getPrincipal();   // 要手动强转
    return user.id();
}
```

**（4）构造器私有 + `final` 类**

```java
public final class SecurityUtils {
    private SecurityUtils() { }
```

这是**工具类的标准写法**：全是静态方法，不需要创建实例。
私有构造器防止别人 `new SecurityUtils()`，`final` 防止被继承。

---

## 步骤 6.5：JwtAuthenticationFilter —— 拦下每个请求验证 token

**① 为什么需要过滤器**：token 验证要对**每个请求**做。不可能在 50 个 Controller 方法里各写一遍。
**过滤器（Filter）是请求进入 Controller 之前的统一关卡。**

```
请求 → [CORS 过滤器] → [JWT 过滤器] → DispatcherServlet → Controller
                          ↑ 我们要写的
```

新建 `security/JwtAuthenticationFilter.java`：

```java
package com.example.computerroom.security;

import com.example.computerroom.user.User;
import com.example.computerroom.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Long userId = jwtService.parseUserId(token);
            if (userId != null) {
                userRepository.findById(userId)
                        .filter(u -> u.getStatus() != null && u.getStatus() == 1)
                        .ifPresent(this::authenticate);
            }
        }

        filterChain.doFilter(request, response);
    }

    private void authenticate(User user) {
        AuthUser authUser = new AuthUser(user.getId(), user.getUsername(), user.getRoleCode());

        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRoleCode()));

        var authentication = new UsernamePasswordAuthenticationToken(authUser, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
```

**③ 讲解**：

**（1）继承 `OncePerRequestFilter` 而不是实现 `Filter`**

一个请求在内部转发（forward）时可能经过过滤器链多次。
`OncePerRequestFilter` 保证 **每个请求只执行一次**，避免重复验证。

**（2)`extractToken` —— `Bearer ` 前面有个空格**

前端发的请求头格式是：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIx...
               └─┬──┘ └──────── 真正的 token ────────┘
              这 7 个字符要去掉（Bearer + 空格）
```

`substring(7)` 就是跳过 `"Bearer "` 这 7 个字符。

> `Bearer` 是 OAuth 2.0 规范定的标准前缀，意思是"持有者令牌"。写成 `bearer` 或漏掉空格都会失败。

**（3）为什么要重新查数据库**

```java
userRepository.findById(userId)
        .filter(u -> u.getStatus() != null && u.getStatus() == 1)
        .ifPresent(this::authenticate);
```

token 里已经有 `username` 和 `roleCode` 了，为什么还查库？三个理由：

| 场景 | 不查库的后果 |
|---|---|
| 用户被禁用（`status = 0`） | 他的旧 token 还能用，禁用无效 |
| 用户被删除 | 已删除的用户还能操作系统 |
| 角色被降级 | 要等 24 小时 token 过期才生效 |

`.filter(...)` 那一行就是**在做禁用检查**：状态不是 1 的用户，直接当作未登录。

> 代价是每个请求多一次数据库查询。对本项目的量级完全无所谓。
> 真正高并发的系统会把用户信息缓存到 Redis，但那是以后的事。

**（4）Optional 链式调用回顾**

```java
userRepository.findById(userId)      // Optional<User>
        .filter(u -> ...)            // 不满足条件就变成空 Optional
        .ifPresent(this::authenticate);   // 有值才执行，没值什么都不做
```

**完全不需要写 `if (user != null)`**。这就是 Optional 的价值。

**（5)`ROLE_` 前缀是硬性要求**

```java
new SimpleGrantedAuthority("ROLE_" + user.getRoleCode())   // ROLE_admin
```

Spring Security 的 `hasRole("admin")` 会**自动加上 `ROLE_` 前缀**去比对。
所以存的时候必须带前缀，否则永远匹配不上。

> 记法：`hasRole("admin")` ↔ 权限字符串 `ROLE_admin`
> 　　　`hasAuthority("ROLE_admin")` ↔ 权限字符串 `ROLE_admin`（这个不自动加前缀）

**（6)`filterChain.doFilter(request, response)` 必须调**

这行的意思是"我处理完了，交给下一个过滤器"。

**忘了写会导致请求卡死** —— 永远到不了 Controller，浏览器一直转圈。**这是个经典 bug。**

注意它在 `if` **外面** —— 无论有没有 token 都要往下走。没 token 的请求交给 Spring Security 去判断：
如果访问的是放行接口（登录/注册）就通过，否则返回 401。

---

## 步骤 6.6：SecurityConfig —— 配置放行规则

新建 `config/SecurityConfig.java`：

```java
package com.example.computerroom.config;

import com.example.computerroom.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {})
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                        .requestMatchers("/api/test").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(401);
                            res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            res.setCharacterEncoding("UTF-8");
                            res.getWriter().write("{\"code\":401,\"message\":\"未登录或登录已过期\",\"data\":null}");
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(403);
                            res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            res.setCharacterEncoding("UTF-8");
                            res.getWriter().write("{\"code\":403,\"message\":\"没有权限执行该操作\",\"data\":null}");
                        })
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

**③ 逐项讲解 —— 这个类每一行都有讲究**

**（1)`csrf(disable)` —— 为什么可以关**

CSRF（跨站请求伪造）攻击的原理是：利用**浏览器自动携带 Cookie** 的特性，
诱导你在已登录状态下访问恶意页面，偷偷发出请求。

我们的 token 存在 **localStorage**，需要 JS **手动**加到请求头里。
恶意网站的 JS **读不到你的 localStorage**（浏览器同源策略隔离），所以伪造不了请求。

**用 JWT + localStorage 的纯 API 项目关掉 CSRF 是标准做法。**
（如果用 Cookie 存 token，就必须开 CSRF 防护。）

**（2)`cors(cors -> {})` —— 让 Security 用你的 CORS 配置**

这行的意思是"启用 CORS 支持，用默认配置源"，它会**自动找到你在 `CorsConfig` 里的设置**。

> **不写这一行会怎样**：Spring Security 会在 CORS 过滤器之前就拦下 `OPTIONS` 预检请求并返回 401，
> 浏览器看到预检失败，**真正的请求根本不会发出**。
> 症状是：Postman 一切正常，前端页面全是 CORS 错误。**这个坑非常常见。**

**（3)`SessionCreationPolicy.STATELESS`**

告诉 Spring Security：**不要创建 Session**。我们用 token，服务器不存任何会话状态。

**（4）放行规则的顺序很重要**

```java
.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()      // ① 预检请求全放行
.requestMatchers("/api/auth/login", "/api/auth/register").permitAll()   // ② 登录注册放行
.requestMatchers("/api/test").permitAll()                   // ③ 测试接口放行
.anyRequest().authenticated()                               // ④ 其他全部要登录
```

**规则是从上往下匹配，命中就停止。** 所以 `anyRequest()` 必须放最后 ——
放最前面的话，后面的放行规则永远不会生效，连登录接口都要求登录（死锁）。

**为什么 `OPTIONS` 要放行**：浏览器的预检请求**不会携带 `Authorization` 头**，
如果要求认证，预检就返回 401，跨域直接失败。

**（5）两个异常处理器的区别 —— 401 和 403 不是一回事**

| 状态码 | 含义 | 触发场景 |
|---|---|---|
| **401 Unauthorized** | **你是谁我不知道** | 没带 token / token 过期 / token 伪造 |
| **403 Forbidden** | **知道你是谁，但你没资格** | 普通用户想删人员 |

前端处理方式完全不同：

```
401 → 清空本地 token，跳登录页（步骤 5.1 的 Utils 已经这么做了）
403 → 提示"没有权限"，留在当前页
```

> **为什么要手写这两个处理器**：Spring Security 默认返回的是 HTML 错误页面。
> 前端 `res.json()` 解析 HTML 会抛异常，报一个跟真实原因无关的错，很难排查。
> 手写成 JSON 后，前端能正常解析。

**注意 `setCharacterEncoding("UTF-8")`** —— 不设置的话中文提示会变成乱码。

**（6)`addFilterBefore(...)` —— 把过滤器插进链条**

```java
.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
```

意思是"把我的 JWT 过滤器放在 Spring Security 的表单登录过滤器**之前**"。

**必须在之前** —— 我们要先解析 token 把用户放进 `SecurityContextHolder`，
后面的授权检查才知道当前用户是谁。放后面就晚了。

**（7)`@EnableMethodSecurity`**

开启方法级权限注解（`@PreAuthorize`）。阶段 7 会用到，现在先加上。

**（8）`BCryptPasswordEncoder` —— 为什么密码必须这样存**

`PasswordEncoder` Bean 已在阶段 4 的 `PasswordConfig` 中创建，`SecurityConfig` 不要重复定义。Spring 会把现有 Bean 注入 `AuthService`。

绝对不能明文存密码。数据库一旦泄露，所有用户的密码就都暴露了
（而且很多人多个网站用同一个密码，危害会扩散）。

BCrypt 的三个特点：

```java
passwordEncoder.encode("123456")
// 第一次：$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
// 第二次：$2a$10$AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOp
//         ↑ 同样的密码，两次结果完全不同！
```

| 特点 | 说明 |
|---|---|
| **单向不可逆** | 不能从哈希解出原密码，只能用 `matches` 验证 |
| **自带随机盐** | 同一密码每次加密结果不同 → 攻击者的"彩虹表"失效 |
| **故意很慢** | 算一次约 100ms → 暴力破解成本极高 |

**因为自带随机盐，所以不能用 `==` 或 `equals` 比对**，必须用：

```java
passwordEncoder.matches("用户输入的明文", "数据库里的哈希")   // 返回 boolean
```

BCrypt 会从哈希字符串里**读出当初用的盐**，用同样的盐加密用户输入，再比对。

---

## 步骤 6.7：认证模块的 DTO

新建 `auth/dto/` 目录，建 4 个文件。

**`auth/dto/LoginRequest.java`**：

```java
package com.example.computerroom.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "请输入登录账号")
    private String username;

    @NotBlank(message = "请输入密码")
    private String password;
}
```

**`auth/dto/RegisterRequest.java`**：

```java
package com.example.computerroom.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "登录账号不能为空")
    @Size(min = 3, max = 50, message = "登录账号长度需在 3-50 之间")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 32, message = "密码长度需在 6-32 之间")
    private String password;

    @NotBlank(message = "姓名不能为空")
    private String name;

    @NotBlank(message = "工号不能为空")
    private String no;

    private String dept;

    @Pattern(regexp = "^$|^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
}
```

> **注意：`RegisterRequest` 里没有 `roleCode`。**
> 这是**故意的** —— 允许注册时自己指定角色 = 任何人都能注册一个超级管理员账号。
> **注册的用户一律是普通用户**，提权只能由管理员操作（阶段 7）。
>
> 这条规则叫**最小权限原则**，是安全设计的基本功。

**`auth/dto/LoginResponse.java`**：

```java
package com.example.computerroom.auth.dto;

import com.example.computerroom.user.User;
import lombok.Getter;

@Getter
public class LoginResponse {

    private final String token;
    private final UserInfo user;

    public LoginResponse(String token, User user) {
        this.token = token;
        this.user = new UserInfo(user);
    }

    @Getter
    public static class UserInfo {
        private final Long id;
        private final String username;
        private final String name;
        private final String no;
        private final String dept;
        private final String roleCode;
        private final String role;

        UserInfo(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.name = user.getRealName();
            this.no = user.getEmployeeNo();
            this.dept = user.getDepartment();
            this.roleCode = user.getRoleCode();
            this.role = switch (user.getRoleCode() == null ? "user" : user.getRoleCode()) {
                case "root" -> "超级管理员";
                case "admin" -> "管理员";
                default -> "普通用户";
            };
        }
    }
}
```

**`auth/dto/ChangePasswordRequest.java`**：

```java
package com.example.computerroom.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    @NotBlank(message = "请输入原密码")
    private String oldPassword;

    @NotBlank(message = "请输入新密码")
    @Size(min = 6, max = 32, message = "新密码长度需在 6-32 之间")
    private String newPassword;
}
```

---

## 步骤 6.8：AuthService

新建 `auth/AuthService.java`：

```java
package com.example.computerroom.auth;

import com.example.computerroom.auth.dto.ChangePasswordRequest;
import com.example.computerroom.auth.dto.LoginRequest;
import com.example.computerroom.auth.dto.LoginResponse;
import com.example.computerroom.auth.dto.RegisterRequest;
import com.example.computerroom.common.BusinessException;
import com.example.computerroom.security.JwtService;
import com.example.computerroom.security.SecurityUtils;
import com.example.computerroom.user.User;
import com.example.computerroom.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("账号或密码错误"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("账号或密码错误");
        }

        if (user.getStatus() == null || user.getStatus() != 1) {
            throw new BusinessException("账号已被禁用，请联系管理员");
        }

        String token = jwtService.generateToken(user.getId(), user.getUsername(), user.getRoleCode());
        return new LoginResponse(token, user);
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("登录账号已被占用：" + request.getUsername());
        }
        if (userRepository.existsByEmployeeNo(request.getNo())) {
            throw new BusinessException("工号已存在：" + request.getNo());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRealName(request.getName());
        user.setEmployeeNo(request.getNo());
        user.setDepartment(request.getDept());
        user.setPhone(request.getPhone());
        user.setRoleCode("user");
        user.setStatus(1);

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId(), saved.getUsername(), saved.getRoleCode());
        return new LoginResponse(token, saved);
    }

    public LoginResponse.UserInfo currentUser() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));
        return new LoginResponse(null, user).getUser();
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BusinessException("原密码不正确");
        }
        if (request.getOldPassword().equals(request.getNewPassword())) {
            throw new BusinessException("新密码不能与原密码相同");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
```

### 三条重要的安全设计，逐条讲

**（1）登录失败的提示必须统一说"账号或密码错误"**

```java
.orElseThrow(() -> new BusinessException("账号或密码错误"));   // 用户不存在
...
throw new BusinessException("账号或密码错误");                 // 密码错误
```

**两种情况用完全一样的提示。** 为什么？

```
如果分开提示：
  输 admin → "密码错误"        → 攻击者知道 admin 这个账号【存在】
  输ers   → "用户不存在"       → 知道这个账号【不存在】

攻击者可以用这个差异【枚举出所有有效账号】，然后集中火力破解密码。
```

这叫**用户枚举漏洞**。统一提示就堵住了。

> 顺带一提：**密码错误时也不要跳过 BCrypt 校验**。
> 用户不存在时直接返回，会比密码错误时快很多（BCrypt 要算 100ms），
> 攻击者能通过**响应时间差异**判断账号是否存在。这叫时序攻击。
> 我们这里因为先查库再校验，已经有轻微时间差 —— 学习项目不用管，但要知道有这回事。

**（2）密码进库前必须 `encode`**

```java
user.setPassword(passwordEncoder.encode(request.getPassword()));
//                                ↑ 忘了这个，密码就明文存进数据库了
```

**注册接口最容易犯的错就是漏掉这一句。** 写完一定去 DBeaver 看一眼，
`password` 字段必须是 `$2a$10$...` 开头的一长串。

**（3）改密码必须验证原密码，且用户 id 从 token 取**

```java
Long userId = SecurityUtils.getCurrentUserId();     // ✅ 从 token 取
```

**绝对不能**写成：

```java
public void changePassword(Long userId, ChangePasswordRequest req)   // ❌ 前端传 userId
```

那样的话，攻击者把 `userId` 改成 1（管理员的 id），就能**改管理员的密码**。

> **记住这条铁律**：
> ## 永远不要相信前端传来的"我是谁"。用户身份一律从 token 取。
>
> 这条规则适用于：改密码、改个人资料、考勤打卡、查我的订单……
> 所有"操作当前用户自己的数据"的接口。

---

## 步骤 6.9：AuthController

新建 `auth/AuthController.java`：

```java
package com.example.computerroom.auth;

import com.example.computerroom.auth.dto.ChangePasswordRequest;
import com.example.computerroom.auth.dto.LoginRequest;
import com.example.computerroom.auth.dto.LoginResponse;
import com.example.computerroom.auth.dto.RegisterRequest;
import com.example.computerroom.common.Result;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return Result.success(authService.login(request));
    }

    @PostMapping("/register")
    public Result<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return Result.success(authService.register(request));
    }

    @GetMapping("/me")
    public Result<LoginResponse.UserInfo> me() {
        return Result.success(authService.currentUser());
    }

    @PutMapping("/password")
    public Result<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return Result.success();
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }
}
```

**为什么 `logout` 什么都不做**

JWT 是**无状态**的 —— 服务器没存任何东西，也就没什么可"注销"的。
**真正的退出是前端删掉本地的 token。**

这个空接口存在的意义：留个位置。将来如果要做"token 黑名单"（真正让 token 立即失效），
改这一个方法就行，前端不用动。

> **JWT 的这个特性是它的主要缺点**：token 发出去后，在过期前无法主动作废。
> 用户改了密码、被封号，旧 token 理论上还能用。
>
> 我们的缓解措施是**过滤器每次都查库检查 `status`**（步骤 6.5），
> 所以封号能立即生效。这是个很实用的折中方案。

---

## 步骤 6.10：把测试数据的密码改成真的

之前插入的 13 条数据密码是明文 `temp`，`passwordEncoder.matches("123456", "temp")` 永远返回 false，登录不了。

阶段 4 的 `UserService.create()` 已经使用 BCrypt，因此接口新增的账号无需迁移。这里仅处理阶段 2 用 SQL 插入、密码仍为 `temp` 的 13 个本地测试账号。

新建 `config/DataInitializer.java`，让程序**启动时自动修复**：

```java
package com.example.computerroom.config;

import com.example.computerroom.user.User;
import com.example.computerroom.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<User> plainUsers = userRepository.findAll().stream()
                .filter(u -> "temp".equals(u.getPassword()))
                .toList();

        if (plainUsers.isEmpty()) {
            return;
        }

        plainUsers.forEach(u -> u.setPassword(passwordEncoder.encode("123456")));
        userRepository.saveAll(plainUsers);

        log.warn("已将 {} 个明文密码账号的密码重置为 123456", plainUsers.size());
    }
}
```

**③ 讲解**：

**（1)`CommandLineRunner` 是什么**

Spring Boot 提供的接口。**程序启动完成后，会自动执行 `run` 方法一次**。
常用来做初始化：建默认数据、检查配置、修复历史数据。

**（2）只迁移已知占位值 `temp`**

阶段 2 明确插入的旧值就是 `temp`，所以只重置这个已知值。不要用“不是 `$2` 开头”判断所有用户，否则一条损坏的密码数据也会被悄悄重置成公开密码。第二次启动时已没有 `temp`，会直接跳过，这就是幂等。

> 这是仅用于本地学习数据的一次性迁移。确认 13 个账号修复后应删除 `DataInitializer`，正式系统使用 Flyway 数据迁移或管理员重置流程，不能在每次启动时批量设置统一密码。

**（3)`@Slf4j` + `log.warn`**

Lombok 的注解，自动生成一个 `log` 对象，可以打日志。

| 级别 | 什么时候用 |
|---|---|
| `log.error(...)` | 出错了，需要人工介入 |
| `log.warn(...)` | 值得注意但不影响运行 |
| `log.info(...)` | 正常的重要事件 |
| `log.debug(...)` | 调试细节 |

> **为什么用 `log` 而不是 `System.out.println`**：日志有级别可以过滤、有时间戳、
> 能输出到文件、生产环境能动态调整。`System.out.println` 什么都没有。
> **正式代码里不要用 `System.out.println`。**

---

## 步骤 6.11：启动并测试

保留阶段 1 的 `TestController` 即可；`SecurityConfig` 已明确放行 `/api/test`，它仍可用于检查服务是否启动。

重启项目。**启动日志里应该能看到**：

```
已将 13 个明文密码账号的密码重置为 123456
```

去 DBeaver 查一下：

```sql
SELECT username, LEFT(password, 10) FROM sys_user LIMIT 3;
```

`password` 应该是 `$2a$10$...` 开头。

### 测试 1：不带 token 访问受保护接口

```
GET http://localhost:8080/api/users
```

期望：**HTTP 401**，返回体：

```json
{"code":401,"message":"未登录或登录已过期","data":null}
```

**这一条通过，说明 Security 生效了。**

### 测试 2：登录

```
POST http://localhost:8080/api/auth/login
Body → raw → JSON:
{"username": "zhangsan", "password": "123456"}
```

期望：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUi...",
    "user": {
      "id": 1,
      "username": "zhangsan",
      "name": "张三",
      "no": "001",
      "dept": "技术部",
      "roleCode": "admin",
      "role": "管理员"
    }
  }
}
```

**把 token 复制下来**，下一步要用。

**顺便去 [jwt.io](https://jwt.io) 把 token 粘进去看看** —— 你能看到 Payload 里的内容。
亲眼确认一次"JWT 不加密，只防篡改"，印象会很深。

### 测试 3：密码错误

```json
{"username": "zhangsan", "password": "wrongpassword"}
```

期望：`{"code":400,"message":"账号或密码错误"}`

再试一个不存在的账号：

```json
{"username": "nobody", "password": "123456"}
```

期望：**完全一样的提示** `{"code":400,"message":"账号或密码错误"}`

### 测试 4：带 token 访问

```
GET http://localhost:8080/api/users
Headers 标签页里加一行：
  Key:   Authorization
  Value: Bearer eyJhbGciOiJIUzI1NiJ9...
```

> **注意 `Bearer` 后面有一个空格**，然后才是 token。这是最常出错的地方。

期望：正常返回用户列表。

### 测试 5：token 被篡改

把 token 中间随便改一个字符（比如把某个 `a` 改成 `b`），再请求。

期望：**401**。

**这一条验证了签名机制真的在工作。**

### 测试 6：获取当前用户

```
GET http://localhost:8080/api/auth/me
（带上 Authorization 头）
```

期望：返回张三的信息。

### 测试 7：注册

```
POST http://localhost:8080/api/auth/register
{
  "username": "newuser",
  "password": "abc123",
  "name": "新员工",
  "no": "888",
  "dept": "技术部",
  "phone": "13911112222"
}
```

期望：返回 token 和用户信息，且 **`roleCode` 是 `user`**（即使你在 JSON 里加 `"roleCode":"root"` 也一样，因为 DTO 里根本没这个字段）。

**试一下**：在上面的 JSON 里加一行 `"roleCode": "root"`，再注册一个。
结果还是 `user` —— 这就是入参 DTO 的防御价值。

### 测试 8：修改密码

```
PUT http://localhost:8080/api/auth/password
（带 token）
{"oldPassword": "123456", "newPassword": "newpass123"}
```

期望：成功。然后用新密码登录，能登上；用旧密码登录，失败。

再测原密码填错：期望 `{"code":400,"message":"原密码不正确"}`

---

## 步骤 6.12：前端改造 —— 真登录

### 改动 1：`login.js` 的 `handleLogin`

打开 `front/js/login.js`，把 `handleLogin` 整个替换成：

```javascript
  async handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    if (!username || !password) {
      this.showError('请输入账号和密码');
      return;
    }

    // 只记住账号，绝不保存密码
    Utils.storage.set('login-remember', {
      remember,
      username: remember ? username : ''
    });

    const res = await Utils.post('/api/auth/login', { username, password });
    if (!res) return;

    Utils.storage.set('login-token', res.data.token);
    Utils.storage.set('login-user', res.data.user);
    location.href = 'index.html';
  },
```

同时把 `restoreRemembered` 里回填密码的那行**删掉**：

```javascript
  restoreRemembered() {
    const saved = Utils.storage.get('login-remember', {});
    if (saved.remember) {
      document.getElementById('username').value = saved.username || '';
      // ❌ 删掉这行：document.getElementById('password').value = saved.password || '';
      document.getElementById('remember').checked = true;
    }
  },
```

### 🔴 必须改掉"记住密码"的原因

你现在的代码是这样的（`login.js:50` 附近）：

```javascript
Utils.storage.set('login-remember', {
  remember,
  username: remember ? username : '',
  password: remember ? password : ''      // ← 明文密码存进了 localStorage
});
```

**这是一个真实的安全漏洞**，不是理论问题：

| 谁能读到 | 怎么读 |
|---|---|
| 页面上**任何** JS 代码 | `localStorage.getItem('login-remember')` |
| 引入的第三方脚本（统计、广告、CDN 上的库） | 同上 —— 它们和你的代码同源，权限一样 |
| XSS 注入的恶意脚本 | 同上 |
| 共用电脑的下一个使用者 | F12 → Application → Local Storage，肉眼可见 |

**localStorage 是明文的、无加密的、同源 JS 可任意读写的。**

所以行业惯例是：**"记住我"只记住用户名，绝不记住密码**。
真要免密登录，正确方案是用长效的 refresh token，而不是存密码。

> 顺带说一下 `login-token`：现在存的是 JWT 字符串。
> 它也在 localStorage 里，理论上也能被 XSS 偷走。
> 更安全的方案是存在 `HttpOnly` Cookie 里（JS 读不到），但那要处理 CSRF，复杂度高一截。
> **对学习项目，localStorage + 短过期时间是合理的选择。**

### 改动 2：给需要登录的页面加"守卫"

打开 `front/js/app.js`（或你的公共入口 JS），在最开头加：

```javascript
// 未登录直接踢回登录页
(function guard() {
  const path = location.pathname;
  const isPublicPage = path.endsWith('login.html') || path.endsWith('register.html');
  if (isPublicPage) return;

  if (!Utils.storage.get('login-token')) {
    location.href = 'login.html';
  }
})();
```

**注意**：这只是**体验优化**，不是安全措施。
用户完全可以手动往 localStorage 塞个假 token 绕过它。

**真正的防线是后端** —— 假 token 通不过签名验证，所有接口都会返回 401。
**前端的检查只是为了让用户少看到一个空白页面。**

> 这个认知非常重要，再强调一次：
> ## 前端的任何检查都只是体验，安全必须在后端。

### 改动 3：`register.js` 接后端

当前 `register.html` 没有工号输入框，而数据库要求 `employee_no` 唯一且非空。先在姓名输入项后面增加：

```html
<div class="form-item">
  <i class="fa fa-id-badge"></i>
  <input type="text" id="reg-no" placeholder="请输入工号">
</div>
```

注意现有部门下拉框的真实 ID 是 `reg-department`。然后把 `handleRegister` 整个替换为：

```javascript
  async handleRegister() {
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;
    if (password !== confirmPassword) {
      this.showError('两次输入的密码不一致');
      return;
    }

    const data = {
      username: document.getElementById('reg-username').value.trim(),
      password,
      name: document.getElementById('reg-name').value.trim(),
      no: document.getElementById('reg-no').value.trim(),
      dept: document.getElementById('reg-department').value,
      phone: document.getElementById('reg-phone').value.trim()
    };

    const res = await Utils.post('/api/auth/register', data);
    if (!res) return;

    alert('注册成功，请登录');
    location.href = 'login.html';
  },
```

注册成功后不在前端保存账号资料和明文密码；`register-account` 这份模拟数据不再使用，可以在浏览器 Application 面板中删除。

### 改动 4：退出登录

当前 `navbar.js` 没有独立的 `logout()` 方法，退出逻辑位于 `switch` 的 `case 'logout'` 中。把这一分支替换为：

```javascript
case 'logout':
  if (confirm('确定注销并退出系统吗？')) {
    Utils.storage.remove('login-token');
    Utils.storage.remove('login-user');
    window.location.href = 'login.html';
  }
  break;
```

### 改动 5：显示当前登录用户

```javascript
const user = Utils.storage.get('login-user');
const nickname = document.querySelector('.user-nickname');
if (nickname) nickname.textContent = user?.name || '未登录';
```

现有 `index.html` 使用 class `user-nickname`，没有 `navbar-username` 这个 ID。

同时修改 `user.js` 的 `renderProfile()`：JWT 是字符串，只负责认证；用户资料从 `login-user` 读取。

```javascript
renderProfile() {
  const user = Utils.storage.get('login-user');
  const username = user?.username || '未登录';
  document.getElementById('profile-name').textContent = user?.name || username;
  document.getElementById('profile-username').textContent = `账号：${username}`;
},
```

`savePassword()` 也要改成调用阶段 6 的接口，不能再比较或修改 `register-account.password`：

```javascript
async savePassword() {
  const oldPassword = document.getElementById('user-old-pwd').value;
  const newPassword = document.getElementById('user-new-pwd').value;
  const confirmPassword = document.getElementById('user-confirm-pwd').value;
  if (!oldPassword || !newPassword) return alert('请填写原密码和新密码');
  if (newPassword !== confirmPassword) return alert('两次输入的新密码不一致');

  const res = await Utils.put('/api/auth/password', { oldPassword, newPassword });
  if (!res) return;
  document.getElementById('user-old-pwd').value = '';
  document.getElementById('user-new-pwd').value = '';
  document.getElementById('user-confirm-pwd').value = '';
  alert('密码修改成功，请重新登录');
  Utils.storage.remove('login-token');
  Utils.storage.remove('login-user');
  location.href = 'login.html';
},
```

当前后端没有 token 版本机制，所以旧 JWT 在过期前理论上仍然有效。这里主动删除当前浏览器的 token；如果要让其他设备上的旧 token 也立即失效，需要给用户增加 `tokenVersion` 并在过滤器中校验。

## 阶段 6 完成标准

```
[ ] 数据库里 password 全是 $2a$ 开头的哈希，没有明文
[ ] 用 zhangsan / 123456 能登录，返回 token
[ ] 密码错误和账号不存在，提示【完全相同】
[ ] 不带 token 请求 /api/users 返回 401
[ ] 带 token 请求正常返回数据
[ ] token 改一个字符就返回 401
[ ] 前端登录后跳转首页，导航栏显示"张三"
[ ] F5 刷新，登录状态还在
[ ] 点退出，回到登录页，再访问 index.html 会被踢回登录页
[ ] 注册的新用户 roleCode 一定是 user（传 root 也没用）
[ ] localStorage 里【没有】明文密码
```

## 常见报错对照表

| 现象 | 原因 | 解决 |
|---|---|---|
| 启动报 `WeakKeyException: The signing key's size is 256 bits...` | 密钥太短 | 用 `openssl rand -base64 48` 重新生成 |
| 所有接口都 401，包括登录 | 放行规则没配或顺序错了 | 检查 `.anyRequest()` 是不是在最后 |
| Postman 正常，浏览器全是 CORS 错误 | `SecurityConfig` 里漏了 `.cors(cors -> {})` | 加上这一行 |
| 带了 token 还是 401 | ① 漏了 `Bearer ` 和空格 ② token 过期 | 检查请求头格式，重新登录拿新 token |
| 401 返回的是 HTML 不是 JSON | 没配 `authenticationEntryPoint` | 检查步骤 6.6 |
| 中文提示乱码 | 没设 `setCharacterEncoding("UTF-8")` | 检查步骤 6.6 |
| 请求一直转圈不返回 | 过滤器里漏了 `filterChain.doFilter(...)` | 检查步骤 6.5 |
| 登录一直报"账号或密码错误" | 密码还是明文 | 看启动日志有没有 DataInitializer 的输出 |

## ⑤ 这一步学到了什么

- **JWT 三段结构**：前两段是 Base64（能看），第三段签名（防篡改）
- **JWT 不加密**，不能放敏感信息
- **BCrypt 自带随机盐**，同密码每次哈希不同，所以必须用 `matches` 不能用 `equals`
- **401 vs 403**：不知道你是谁 vs 知道但你没资格
- **过滤器是统一关卡**，`doFilter` 千万别漏
- **登录失败提示要统一**，防用户枚举
- **用户身份从 token 取**，永远不信前端传的 userId
- **注册不允许指定角色**，最小权限原则
- **前端检查只是体验，安全在后端**

**自测题**：攻击者把 token 的 Payload 改成 `"roleCode":"root"`，然后重新 Base64 编码拼回去。能成功提权吗？

<details><summary>答案</summary>

不能。改了 Payload 后，服务器用密钥重新计算的签名和 token 里的第三段对不上，
`parseSignedClaims` 抛 `SignatureException`，`parseUserId` 返回 `null`，请求被当作未登录 → 401。

**而且**：就算签名能伪造，我们的过滤器还会**重新查数据库**拿真实的 `roleCode`，
token 里的 roleCode 根本不用于授权判断。**双重防护。**
</details>

```bash
git add . && git commit -m "阶段6完成：BCrypt + JWT 登录注册鉴权"
```

---

# 阶段 7：角色与权限（RBAC）

**目标**：不同角色拥有不同权限；前端按权限隐藏按钮，后端用 `@PreAuthorize` 独立拦截越权请求。

> 阶段 6 只解决了“你是谁”，阶段 7 解决“你能做什么”。

## 核心概念：认证不等于授权

| 概念 | 回答的问题 | 本项目的实现 |
|---|---|---|
| 认证（Authentication） | 你是谁？ | JWT + `SecurityContextHolder` |
| 授权（Authorization） | 你能做什么？ | 角色、权限、`@PreAuthorize` |

本项目采用 RBAC（Role-Based Access Control，基于角色的访问控制）：

```text
用户 → 一个角色 → 多个权限
张三 → admin  → person:view、person:add、equipment:edit ...
```

权限编码统一使用 `模块:动作`，数据库和 Java 代码都存英文稳定值：

```text
person:view       person:add       person:edit       person:delete
equipment:view    equipment:add    equipment:edit    equipment:delete
equipment:stock
goods:view        goods:add        goods:edit        goods:delete
goods:stock
attendance:view   attendance:record
permission:view   permission:edit
```

## 步骤 7.1：创建权限实体

新建 `role/Permission.java`：

```java
package com.example.computerroom.role;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sys_permission")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "perm_code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "perm_name", nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 30)
    private String module;
}
```

新建 `role/Role.java`：

```java
package com.example.computerroom.role;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "sys_role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "role_name", nullable = false, length = 30)
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "sys_role_permission",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();
}
```

`@ManyToMany` 表示“一个角色有多个权限，一个权限也能属于多个角色”。
中间表 `sys_role_permission` 只保存两列：`role_id` 和 `permission_id`。

## 步骤 7.2：Repository 与初始化 SQL

新建两个 Repository：

```java
// role/RoleRepository.java
package com.example.computerroom.role;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByCode(String code);
}
```

```java
// role/PermissionRepository.java
package com.example.computerroom.role;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findByCodeIn(Collection<String> codes);
}
```

启动一次，让 Hibernate 建出三张表，然后在 DBeaver 执行：

```sql
INSERT INTO sys_role (role_code, role_name) VALUES
('root', '超级管理员'), ('admin', '管理员'), ('user', '普通用户');

INSERT INTO sys_permission (perm_code, perm_name, module) VALUES
('person:view','查看人员','person'), ('person:add','新增人员','person'),
('person:edit','编辑人员','person'), ('person:delete','删除人员','person'),
('equipment:view','查看设备','equipment'), ('equipment:add','登记设备','equipment'),
('equipment:edit','编辑设备','equipment'), ('equipment:delete','报废设备','equipment'),
('equipment:stock','设备出入库','equipment'),
('goods:view','查看耗材','goods'), ('goods:add','新增耗材','goods'),
('goods:edit','编辑耗材','goods'), ('goods:delete','删除耗材','goods'),
('goods:stock','耗材出入库','goods'),
('attendance:view','查看考勤','attendance'),
('attendance:record','考勤打卡','attendance'),
('permission:view','查看权限','permission'),
('permission:edit','编辑权限','permission');

-- root 拥有全部权限
INSERT INTO sys_role_permission (role_id, permission_id)
SELECT r.id, p.id FROM sys_role r CROSS JOIN sys_permission p WHERE r.role_code = 'root';

-- admin 除权限配置外拥有全部业务权限
INSERT INTO sys_role_permission (role_id, permission_id)
SELECT r.id, p.id FROM sys_role r CROSS JOIN sys_permission p
WHERE r.role_code = 'admin' AND p.perm_code NOT IN ('permission:edit');

-- 普通用户只能查看和打卡
INSERT INTO sys_role_permission (role_id, permission_id)
SELECT r.id, p.id FROM sys_role r CROSS JOIN sys_permission p
WHERE r.role_code = 'user'
  AND p.perm_code IN ('person:view','equipment:view','goods:view','attendance:view','attendance:record');
```

> 如果重复执行提示唯一键冲突，说明数据已经初始化成功，不要反复插入。

## 步骤 7.3：让 JWT 过滤器装载真实权限

阶段 6 的过滤器只放了 `ROLE_admin`。打开 `JwtAuthenticationFilter.java`，注入：

```java
private final RoleRepository roleRepository;
```

增加 import：

```java
import com.example.computerroom.role.RoleRepository;
import java.util.ArrayList;
```

把 `authenticate` 方法替换成：

```java
private void authenticate(User user) {
    AuthUser authUser = new AuthUser(user.getId(), user.getUsername(), user.getRoleCode());
    var authorities = new ArrayList<SimpleGrantedAuthority>();
    authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRoleCode()));

    roleRepository.findByCode(user.getRoleCode())
            .ifPresent(role -> role.getPermissions().forEach(permission ->
                    authorities.add(new SimpleGrantedAuthority(permission.getCode()))));

    var authentication = new UsernamePasswordAuthenticationToken(authUser, null, authorities);
    SecurityContextHolder.getContext().setAuthentication(authentication);
}
```

现在当前请求拥有两类授权字符串：

```text
ROLE_admin       ← 角色
person:edit      ← 细粒度权限
```

## 步骤 7.4：后端接口独立鉴权

阶段 6 的 `SecurityConfig` 已加 `@EnableMethodSecurity`。现在给人员接口加权限：

```java
import org.springframework.security.access.prepost.PreAuthorize;

@PreAuthorize("hasAuthority('person:view')")
@GetMapping
public Result<PageResult<UserResponse>> list(...) { ... }

@PreAuthorize("hasAuthority('person:view')")
@GetMapping("/{id}")
public Result<UserResponse> getById(...) { ... }

@PreAuthorize("hasAuthority('person:add')")
@PostMapping
public Result<UserResponse> create(...) { ... }

@PreAuthorize("hasAuthority('person:edit')")
@PutMapping("/{id}")
public Result<UserResponse> update(...) { ... }

@PreAuthorize("hasAuthority('person:delete')")
@DeleteMapping("/{id}")
public Result<Void> delete(...) { ... }

@PreAuthorize("hasAuthority('person:delete')")
@DeleteMapping
public Result<Void> deleteBatch(...) { ... }
```

> 前端隐藏按钮只能改善体验。攻击者能直接用 Postman 调接口，所以每个写接口都必须有后端权限注解。

阶段 4 的 `GlobalExceptionHandler` 有一个 `Exception.class` 兜底。为了避免方法级鉴权失败被它包装成 500，增加一个更精确的处理器：

```java
import org.springframework.security.access.AccessDeniedException;

@ExceptionHandler(AccessDeniedException.class)
@ResponseStatus(HttpStatus.FORBIDDEN)
public Result<Void> handleAccessDenied(AccessDeniedException e) {
    return Result.error(403, "没有权限执行该操作");
}
```

过滤器阶段发生的 401/403 仍由 `SecurityConfig` 处理；进入 Controller 后由 `@PreAuthorize` 抛出的 403 由这里处理。两条路径都返回相同 JSON。

## 步骤 7.5：权限查询、保存和角色变更

新建 `role/dto/PermissionUpdateRequest.java`：

```java
package com.example.computerroom.role.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
public class PermissionUpdateRequest {
    @NotNull(message = "权限列表不能为空")
    private Set<String> permissions;
}
```

新建 `role/dto/UserRoleUpdateRequest.java`：

```java
package com.example.computerroom.role.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRoleUpdateRequest {
    @NotBlank(message = "角色编码不能为空")
    private String roleCode;
}
```

新建 `role/dto/RoleSummary.java`：

```java
package com.example.computerroom.role.dto;

public record RoleSummary(String code, String name) {
}
```

新建 `role/RoleService.java`：

```java
package com.example.computerroom.role;

import com.example.computerroom.common.BusinessException;
import com.example.computerroom.role.dto.PermissionUpdateRequest;
import com.example.computerroom.role.dto.RoleSummary;
import com.example.computerroom.security.SecurityUtils;
import com.example.computerroom.user.User;
import com.example.computerroom.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoleService {

    private static final Set<String> ROLES = Set.of("root", "admin", "user");
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    public List<RoleSummary> listRoles() {
        return roleRepository.findAll().stream()
                .map(role -> new RoleSummary(role.getCode(), role.getName()))
                .toList();
    }

    public Set<String> permissions(String roleCode) {
        return roleRepository.findByCode(roleCode)
                .orElseThrow(() -> new BusinessException("角色不存在"))
                .getPermissions().stream().map(Permission::getCode).collect(java.util.stream.Collectors.toSet());
    }

    @Transactional
    public void updatePermissions(String roleCode, PermissionUpdateRequest request) {
        if ("root".equals(roleCode)) {
            throw new BusinessException("超级管理员权限不能修改");
        }
        Role role = roleRepository.findByCode(roleCode)
                .orElseThrow(() -> new BusinessException("角色不存在"));
        List<Permission> found = permissionRepository.findByCodeIn(request.getPermissions());
        if (found.size() != request.getPermissions().size()) {
            throw new BusinessException("包含不存在的权限编码");
        }
        role.setPermissions(Set.copyOf(found));
        roleRepository.save(role);
    }

    @Transactional
    public void changeUserRole(Long userId, String roleCode) {
        if (!SecurityUtils.isRoot()) {
            throw new BusinessException("只有超级管理员可以调整角色");
        }
        if (!ROLES.contains(roleCode)) {
            throw new BusinessException("非法角色编码");
        }
        if (SecurityUtils.getCurrentUserId().equals(userId)) {
            throw new BusinessException("不能修改自己的角色");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));
        if ("root".equals(user.getRoleCode())) {
            throw new BusinessException("超级管理员不能被降权");
        }
        user.setRoleCode(roleCode);
        userRepository.save(user);
    }
}
```

`RoleSummary` 是专门的响应 DTO，避免把带有关联关系的 `Role` Entity 直接序列化。

新建 `role/RoleController.java`：

```java
package com.example.computerroom.role;

import com.example.computerroom.common.Result;
import com.example.computerroom.role.dto.PermissionUpdateRequest;
import com.example.computerroom.role.dto.RoleSummary;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PreAuthorize("hasAuthority('permission:view')")
    @GetMapping
    public Result<List<RoleSummary>> list() {
        return Result.success(roleService.listRoles());
    }

    @PreAuthorize("hasAuthority('permission:view')")
    @GetMapping("/{roleCode}/permissions")
    public Result<Set<String>> permissions(@PathVariable("roleCode") String roleCode) {
        return Result.success(roleService.permissions(roleCode));
    }

    @PreAuthorize("hasAuthority('permission:edit')")
    @PutMapping("/{roleCode}/permissions")
    public Result<Void> updatePermissions(
            @PathVariable("roleCode") String roleCode,
            @Valid @RequestBody PermissionUpdateRequest request) {
        roleService.updatePermissions(roleCode, request);
        return Result.success();
    }
}
```

角色变更路径属于用户资源，在 `UserController` 中增加：

```java
import com.example.computerroom.role.RoleService;
import com.example.computerroom.role.dto.UserRoleUpdateRequest;

private final RoleService roleService;

@PreAuthorize("hasRole('root')")
@PutMapping("/{id}/role")
public Result<Void> changeRole(
        @PathVariable("id") Long id,
        @Valid @RequestBody UserRoleUpdateRequest request) {
    roleService.changeUserRole(id, request.getRoleCode());
    return Result.success();
}
```

最终接口为：

```text
GET /api/roles
GET /api/roles/{roleCode}/permissions
PUT /api/roles/{roleCode}/permissions   Body: {"permissions":["person:view"]}
PUT /api/users/{id}/role                Body: {"roleCode":"admin"}
```

角色变更和权限变更会在下一次请求重新查数据库时生效。这个“立即生效”来自当前实现的**每次请求查库**，不是 JWT 自带能力；以后若增加 Redis 或二级缓存，必须同时设计缓存失效。

## 步骤 7.6：接入现有 `permission.js`

当前 `PermissionPage.rolePermissions` 和 `PermissionPage.users` 都是内存假数据。后端权限使用完整编码 `person:delete`，而现有页面使用 `{ person: ['view', 'del'] }`，不能直接互传。

接入时统一做转换：

```javascript
const ACTION_TO_CODE = { view: 'view', add: 'add', edit: 'edit', del: 'delete', record: 'record' };

function toApiPermissions(tree) {
  return Object.entries(tree).flatMap(([module, actions]) =>
    actions.map(action => `${module}:${ACTION_TO_CODE[action] || action}`)
  );
}

function fromApiPermissions(codes) {
  const result = {};
  for (const code of codes) {
    const [module, action] = code.split(':');
    const uiAction = action === 'delete' ? 'del' : action;
    (result[module] ||= []).push(uiAction);
  }
  return result;
}
```

进入页面时请求 `/api/roles` 和当前角色权限；保存时把树转换成完整编码后调用 PUT；提权/降权调用 `/api/users/{id}/role`。删除 `rolePermissions` 和 `users` 示例数组，不能再只改浏览器内存。

## 阶段 7 完成标准

```text
[ ] user 调用 DELETE /api/users/{id} 返回 HTTP 403
[ ] admin 能管理人员，但不能保存角色权限
[ ] root 能保存 admin/user 权限
[ ] root 不能修改自己的角色，也不能被降权或删除
[ ] 前端按钮按 permissions 隐藏
[ ] permission.js 保存权限和提权/降权时，Network 出现真实 PUT 请求
[ ] 即使手动显示按钮，后端仍能拦住越权请求
```

```bash
git add . && git commit -m "阶段7完成：RBAC角色权限与后端鉴权"
```

---

# 阶段 8：设备管理

**目标**：完成设备登记、编辑、报废、入库、出库和流水查询。

这个阶段开始复用阶段 4 的 CRUD 模板。真正新增的规则只有两类：**状态机**和**库存流水**。

## 步骤 8.1：实体设计

下面是**结构片段**，用于列清新增字段；package、import、Lombok 和生命周期方法按 `User.java` 补齐后才是完整文件。新建 `equipment/Equipment.java`：

```java
@Entity
@Table(name = "equipment")
public class Equipment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "equipment_no", nullable = false, unique = true, length = 50)
    private String equipmentNo;
    @Column(nullable = false, length = 100)
    private String name;
    private String model;
    @Column(nullable = false)
    private Integer quantity = 0;
    @Column(nullable = false, length = 20)
    private String status = "NORMAL";
    @Column(nullable = false, length = 100)
    private String location;
    @Version
    private Long version;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // 加上 @Getter、@Setter、@PrePersist、@PreUpdate，写法与 User 完全相同
}
```

新建 `equipment/EquipmentStockRecord.java`：

```java
@Getter
@Setter
@Entity
@Table(name = "equipment_stock_record")
public class EquipmentStockRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long equipmentId;
    private String equipmentName;
    private String recordType;       // IN / OUT
    private Integer quantity;
    private LocalDate businessDate;
    private Long operatorId;
    private String operatorName;
    private String remark;
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() { createdAt = LocalDateTime.now(); }
}
```

> 上面第一个实体省略的 import、getter/setter 和生命周期方法，直接复制 `User.java` 对应部分。
> `@Version` 是乐观锁：两个请求同时改库存时，后提交的请求会失败，避免互相覆盖。

## 步骤 8.2：Repository 与接口

```java
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    boolean existsByEquipmentNo(String equipmentNo);
    long countByStatus(String status);
}

public interface EquipmentStockRecordRepository extends JpaRepository<EquipmentStockRecord, Long> {
    Page<EquipmentStockRecord> findByEquipmentIdOrderByIdDesc(Long equipmentId, Pageable pageable);
}
```

后端接口设计如下；前端字段仍需在步骤 8.4 显式映射：

```text
GET  /api/equipment?page=1&size=10&name=&status=
GET  /api/equipment/{id}
POST /api/equipment
PUT  /api/equipment/{id}
PUT  /api/equipment/{id}/scrap
POST /api/equipment/{id}/stock-in
POST /api/equipment/{id}/stock-out
GET  /api/equipment/stock-records
GET  /api/equipment/statistics
```

库存请求 DTO：

```java
@Getter
@Setter
public class EquipmentStockRequest {
    @NotNull(message = "数量不能为空")
    @Positive(message = "数量必须大于 0")
    private Integer quantity;
    @PastOrPresent(message = "业务日期不能晚于今天")
    private LocalDate businessDate;
    @Size(max = 500, message = "备注不能超过 500 字")
    private String remark;
}
```

## 步骤 8.3：库存事务

`EquipmentService` 的核心方法：

```java
@Transactional
public void changeStock(Long id, EquipmentStockRequest request, boolean stockIn) {
    Equipment equipment = equipmentRepository.findById(id)
            .orElseThrow(() -> new BusinessException("设备不存在"));
    if (request.getQuantity() == null || request.getQuantity() <= 0) {
        throw new BusinessException("数量必须大于 0");
    }
    if ("SCRAPPED".equals(equipment.getStatus())) {
        throw new BusinessException("已报废设备不能出入库");
    }
    if (!stockIn && equipment.getQuantity() < request.getQuantity()) {
        throw new BusinessException("库存不足，当前库存 " + equipment.getQuantity());
    }

    int delta = stockIn ? request.getQuantity() : -request.getQuantity();
    equipment.setQuantity(equipment.getQuantity() + delta);
    equipmentRepository.save(equipment);

    AuthUser operator = SecurityUtils.getCurrentUser();
    EquipmentStockRecord record = new EquipmentStockRecord();
    record.setEquipmentId(equipment.getId());
    record.setEquipmentName(equipment.getName());
    record.setRecordType(stockIn ? "IN" : "OUT");
    record.setQuantity(request.getQuantity());
    record.setBusinessDate(request.getBusinessDate() == null ? LocalDate.now() : request.getBusinessDate());
    record.setOperatorId(operator.id());
    record.setOperatorName(operator.username());
    record.setRemark(request.getRemark());
    recordRepository.save(record);
}

@Transactional
public void scrap(Long id) {
    Equipment equipment = equipmentRepository.findById(id)
            .orElseThrow(() -> new BusinessException("设备不存在"));
    if ("SCRAPPED".equals(equipment.getStatus())) {
        throw new BusinessException("设备已经报废");
    }
    if (equipment.getQuantity() != 0) {
        throw new BusinessException("库存不为 0 的设备不能报废，请先完成出库处理");
    }
    equipment.setStatus("SCRAPPED");
    equipmentRepository.save(equipment);
}
```

**为什么必须是一个事务**：更新数量和写流水必须一起成功。任何一步失败，另一部分也要回滚，否则库存和账本会对不上。

`EquipmentController` 的两个库存方法必须完整写成：

```java
@PreAuthorize("hasAuthority('equipment:stock')")
@PostMapping("/{id}/stock-in")
public Result<Void> stockIn(
        @PathVariable("id") Long id,
        @Valid @RequestBody EquipmentStockRequest request) {
    equipmentService.changeStock(id, request, true);
    return Result.success();
}

@PreAuthorize("hasAuthority('equipment:stock')")
@PostMapping("/{id}/stock-out")
public Result<Void> stockOut(
        @PathVariable("id") Long id,
        @Valid @RequestBody EquipmentStockRequest request) {
    equipmentService.changeStock(id, request, false);
    return Result.success();
}
```

不要漏掉 `@Valid`。设备查询、登记、编辑、报废方法分别添加 `equipment:view/add/edit/delete` 权限，写法与阶段 7 的人员 Controller 相同。

## 步骤 8.4：接入现有 `equipment.js`

当前页面字段和后端稳定字段不完全相同，响应 DTO 或前端必须明确映射：

```javascript
function equipmentFromApi(e) {
  return {
    id: e.id,
    no: e.equipmentNo,
    name: e.name,
    model: e.model,
    quantity: e.quantity,
    status: { NORMAL: '正常', REPAIR: '维修', SCRAPPED: '报废' }[e.status],
    location: e.location
  };
}
```

流水同样转换 `businessDate → date`、`IN/OUT → 入库/出库`、`operatorName → operator`。现有弹窗中的“经办人/领用人”不能决定真实操作人：真实操作人来自 JWT；若业务上确实需要领用人，应新增独立字段 `recipientName`，不要冒充 `operatorName`。

把 `EquipmentPage.data` 和流水示例数组改为空数组；页面初始化、搜索和翻页调用 GET，保存、报废、出入库调用对应接口，成功后重新加载。只修改本地数组不算完成阶段 8。

## 阶段 8 完成标准

```text
[ ] 设备编号重复时返回友好提示
[ ] 入库后数量增加且多一条 IN 流水
[ ] 出库后数量减少且多一条 OUT 流水
[ ] 出库数量超过库存时，数量和流水都不变
[ ] 只有库存为 0 的设备能报废，报废后不能再次出入库
[ ] operatorId 来自 token，不接受前端传入
[ ] 普通用户调用库存接口返回 403
[ ] 刷新页面后设备和流水仍然存在，不会恢复示例数组
```

---

# 阶段 9：耗材库存与事务

**目标**：耗材 CRUD、库存流水、低库存预警全部可用，并理解事务和并发保护。

## 步骤 9.1：从设备模块复制模板

复制设备模块并做下面的机械替换：

| 设备模块 | 耗材模块 |
|---|---|
| `Equipment` | `Goods` |
| `equipmentNo` | `goodsNo` |
| `quantity` | `stock` |
| `model/location/status` | `category/unit/safeStock` |
| `EquipmentStockRecord` | `GoodsStockRecord` |

`Goods` 必须有这些字段：

```java
id, goodsNo, name, category, unit, stock, safeStock, version, createdBy, createdAt, updatedAt
```

并保留：

```java
@Version
private Long version;
```

## 步骤 9.2：接口清单

```text
GET    /api/goods?page=1&size=10&name=&category=
GET    /api/goods/{id}
POST   /api/goods
PUT    /api/goods/{id}
DELETE /api/goods/{id}
POST   /api/goods/{id}/stock-in
POST   /api/goods/{id}/stock-out
GET    /api/goods/stock-records?goodsId=&start=&end=&page=1&size=10
GET    /api/goods/warnings
```

低库存查询直接交给数据库：

```java
@Query("SELECT g FROM Goods g WHERE g.stock < g.safeStock ORDER BY g.stock ASC")
List<Goods> findWarnings();

@Query("SELECT COUNT(g) FROM Goods g WHERE g.stock < g.safeStock")
long countWarnings();
```

不要 `findAll()` 后再用 Java 过滤。数据量大时那会把整表读进内存。

## 步骤 9.3：安全出库

```java
@Transactional
public void stockOut(Long goodsId, GoodsStockRequest request) {
    Goods goods = goodsRepository.findById(goodsId)
            .orElseThrow(() -> new BusinessException("耗材不存在"));
    if (request.getQuantity() == null || request.getQuantity() <= 0) {
        throw new BusinessException("出库数量必须大于 0");
    }
    if (goods.getStock() < request.getQuantity()) {
        throw new BusinessException("库存不足，当前库存 " + goods.getStock());
    }

    goods.setStock(goods.getStock() - request.getQuantity());
    goodsRepository.save(goods);

    GoodsStockRecord record = new GoodsStockRecord();
    record.setGoodsId(goodsId);
    record.setGoodsName(goods.getName());
    record.setRecordType("OUT");
    record.setQuantity(request.getQuantity());
    record.setOperatorId(SecurityUtils.getCurrentUserId());
    record.setBusinessDate(request.getBusinessDate() == null ? LocalDate.now() : request.getBusinessDate());
    record.setRemark(request.getRemark());
    recordRepository.save(record);
}
```

### `@Transactional` 的三个边界

1. 方法必须通过 Spring Bean 调用，自己 `new GoodsService()` 不生效。
2. 通常放在 `public` Service 方法上。
3. 同类里 `this.stockOut()` 会绕过代理；外层方法已有事务时没问题，否则要拆到另一个 Service。

### 为什么还需要 `@Version`

只有库存检查仍可能超卖：

```text
请求 A 读到库存 5    请求 B 也读到库存 5
A 出库 4，剩 1       B 也出库 4，剩 1
实际出了 8，但数据库显示剩 1
```

`@Version` 会让更新 SQL 带旧版本号。A 更新后版本变化，B 再提交时匹配不到旧版本，抛出
`ObjectOptimisticLockingFailureException`，从而避免静默覆盖。

乐观锁异常通常在 Hibernate flush 或事务提交阶段抛出，不一定恰好发生在 `save()` 那一行，因此应由全局异常处理器统一处理，不要只在 `save()` 外围写局部 `try-catch`。

在全局异常处理器中补充友好提示：

```java
@ExceptionHandler(ObjectOptimisticLockingFailureException.class)
@ResponseStatus(HttpStatus.CONFLICT)
public Result<Void> handleOptimisticLock(ObjectOptimisticLockingFailureException e) {
    return Result.error(409, "数据已被其他人修改，请刷新后重试");
}
```

## 步骤 9.4：接入现有 `goods.js`

删除 `goodsList` 和 `stockRecords` 示例数据，并按下面映射接口字段：

```text
goodsNo      → no
businessDate → date
IN / OUT     → 入库 / 出库
operatorName → operator
```

`filterGoods()` 和 `filterRecords()` 的数据库筛选职责移到后端；前端只保留搜索条件并重新请求。库存弹窗保存成功后必须重新请求商品和流水，不能本地执行 `g.stock += count`。低库存提示读取 `/api/goods/warnings`，不要继续用本地数组计算作为真实结果。

## 阶段 9 完成标准

```text
[ ] 新增、修改、删除耗材都操作数据库
[ ] 入库同时更新 stock 并写 IN 流水
[ ] 出库同时更新 stock 并写 OUT 流水
[ ] 库存不足时两张表都没有变化
[ ] stock < safeStock 的耗材出现在 warnings
[ ] 日期范围筛选正确
[ ] 并发修改不会静默覆盖库存
[ ] goods.js 的查询和库存操作在 Network 中有真实 API 请求，刷新后数据不丢失
```

```bash
git add . && git commit -m "阶段9完成：耗材库存事务与低库存预警"
```

---

# 阶段 10：考勤打卡

**目标**：当前登录用户可以参会、结束打卡；不能替别人打卡，不能重复打卡，后端判断迟到和早退。

## 步骤 10.1：实体与唯一约束

新建 `attendance/Attendance.java`：

```java
package com.example.computerroom.attendance;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.*;

@Getter
@Setter
@Entity
@Table(name = "attendance_record",
       uniqueConstraints = @UniqueConstraint(
               name = "uk_attendance_user_date",
               columnNames = {"user_id", "attendance_date"}))
public class Attendance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id", nullable = false)
    private Long userId;
    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;
    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;
    @Column(name = "check_in_time")
    private LocalTime checkInTime;
    @Column(name = "check_out_time")
    private LocalTime checkOutTime;
    @Column(name = "check_in_status", length = 20)
    private String checkInStatus;
    @Column(name = "check_out_status", length = 20)
    private String checkOutStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }
    @PreUpdate
    void onUpdate() { updatedAt = LocalDateTime.now(); }
}
```

**唯一约束是最后防线**。Java 的“先查是否存在”能给友好提示，但两个并发请求可能同时通过检查；数据库约束保证最终只能插入一条。

## 步骤 10.2：Repository

```java
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByUserIdAndAttendanceDate(Long userId, LocalDate date);
    Page<Attendance> findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
            Long userId, LocalDate start, LocalDate end, Pageable pageable);
    long countByAttendanceDate(LocalDate date);
}
```

## 步骤 10.3：打卡 Service

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {
    private static final LocalTime START_TIME = LocalTime.of(9, 0);
    private static final LocalTime END_TIME = LocalTime.of(18, 0);

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    @Transactional
    public Attendance checkIn() {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (attendanceRepository.findByUserIdAndAttendanceDate(userId, today).isPresent()) {
            throw new BusinessException("今天已经参会打卡，不能重复打卡");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));

        Attendance record = new Attendance();
        record.setUserId(userId);
        record.setUserName(user.getRealName());
        record.setAttendanceDate(today);
        record.setCheckInTime(now);
        record.setCheckInStatus(now.isAfter(START_TIME) ? "LATE" : "NORMAL");
        return attendanceRepository.save(record);
    }

    @Transactional
    public Attendance checkOut() {
        Long userId = SecurityUtils.getCurrentUserId();
        LocalTime now = LocalTime.now();
        Attendance record = attendanceRepository
                .findByUserIdAndAttendanceDate(userId, LocalDate.now())
                .orElseThrow(() -> new BusinessException("请先完成参会打卡"));
        if (record.getCheckOutTime() != null) {
            throw new BusinessException("今天已经结束打卡，不能重复打卡");
        }
        record.setCheckOutTime(now);
        record.setCheckOutStatus(now.isBefore(END_TIME) ? "EARLY" : "NORMAL");
        return attendanceRepository.save(record);
    }
}
```

两个并发参会请求仍可能同时通过 `findBy...` 检查，其中一个最终会撞上数据库唯一约束。在全局异常处理器中增加：

```java
import org.springframework.dao.DataIntegrityViolationException;

@ExceptionHandler(DataIntegrityViolationException.class)
@ResponseStatus(HttpStatus.CONFLICT)
public Result<Void> handleDataIntegrity(DataIntegrityViolationException e) {
    return Result.error(409, "数据重复或违反唯一约束，请刷新后重试");
}
```

学习项目统一返回约束冲突提示；正式项目可以进一步识别约束名 `uk_attendance_user_date`，只对它返回“今天已经打卡”。

> 时间必须使用服务器的 `LocalDate.now()` / `LocalTime.now()`，不接收前端传来的打卡时间，否则用户修改电脑时间就能作弊。

## 步骤 10.4：接口与月份查询

```text
POST /api/attendance/check-in
POST /api/attendance/check-out
GET  /api/attendance/my?month=2026-08&page=1&size=10
GET  /api/attendance/my/statistics?month=2026-08
GET  /api/attendance/all?month=2026-08&page=1&size=10
```

把月份转成日期范围：

```java
YearMonth ym = YearMonth.parse(month);
LocalDate start = ym.atDay(1);
LocalDate end = ym.atEndOfMonth();
```

`/my` 的 userId 一律从 token 取；`/all` 加 `@PreAuthorize("hasRole('admin') or hasRole('root')")`。

状态 DTO 转中文：

```text
LATE   → 迟到
EARLY  → 早退
NORMAL → 正常
null   → 未打卡
```

## 步骤 10.5：接入现有 `attendance.js`

当前脚本的 `STORAGE_KEY = 'attendance-records'`、`seed()`、`load()`、`save()` 都属于模拟后端，接入后删除。页面初始化请求 `/api/attendance/my`，参会和结束按钮分别 POST 对应接口，再重新加载。

现有渲染使用 `{ date, in, out }`，可以在前端临时映射：

```javascript
const rows = res.data.list.map(item => ({
  date: item.attendanceDate,
  in: item.checkInTime || '',
  out: item.checkOutTime || '',
  inStatus: item.checkInStatus,
  outStatus: item.checkOutStatus
}));
```

迟到、早退结果以服务器返回的状态为准，不再根据浏览器时间重新判定。

## 阶段 10 完成标准

```text
[ ] 第一次参会打卡成功，userId 是当前 token 对应用户
[ ] 同一天第二次参会打卡失败
[ ] 没参会就结束打卡失败
[ ] 第二次结束打卡失败
[ ] 09:00 后参会显示迟到，18:00 前结束显示早退
[ ] 普通用户不能调用全员考勤接口
[ ] 月份边界（1 日和月末）都能查到
[ ] attendance.js 不再读写 attendance-records，状态来自后端响应
```

---

# 阶段 11：仪表盘真实统计

**目标**：首页卡片和最近动态来自数据库，不再显示写死的数字与人员。

## 步骤 11.1：统计接口

```text
GET /api/dashboard/summary
GET /api/dashboard/activities?limit=10
```

`summary` 响应：

```json
{
  "userCount": 13,
  "equipmentQuantity": 48,
  "todayAttendanceCount": 9,
  "lowStockCount": 3
}
```

> 原页面的“待审请假”不能返回假数据。第一版没有请假模块，把卡片改成“低库存预警”。

设备总数需要数据库求和：

```java
@Query("SELECT COALESCE(SUM(e.quantity), 0) FROM Equipment e WHERE e.status <> 'SCRAPPED'")
long sumAvailableQuantity();
```

新建 `dashboard/DashboardService.java`：

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {
    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final GoodsRepository goodsRepository;
    private final AttendanceRepository attendanceRepository;

    public Map<String, Long> summary() {
        return Map.of(
                "userCount", userRepository.count(),
                "equipmentQuantity", equipmentRepository.sumAvailableQuantity(),
                "todayAttendanceCount", attendanceRepository.countByAttendanceDate(LocalDate.now()),
                "lowStockCount", goodsRepository.countWarnings()
        );
    }
}
```

新建 `DashboardController`，调用 `dashboardService.summary()` 并用 `Result.success(...)` 包装。

**不要这样统计**：

```java
userRepository.findAll().size();   // 错：把整张表加载进内存
```

要用数据库的 `COUNT` / `SUM`。数据库就是专门做这件事的。

## 步骤 11.2：最近动态

第一版可以直接合并“最新设备流水 + 最新耗材流水 + 最新考勤”；更规范的做法是建统一操作日志表：

```java
@Entity
@Table(name = "operation_log")
public class OperationLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String operatorName;
    private String module;
    private String action;
    private String description;
    private LocalDateTime createdAt;
}
```

每次人员、权限、设备、库存写操作成功时，在同一个事务里插入日志。查询：

```java
Page<OperationLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
```

`limit` 必须限制范围，防止一次查百万条：

```java
int safeLimit = Math.max(1, Math.min(limit, 50));
return repository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, safeLimit)).getContent();
```

## 步骤 11.3：改造现有首页

当前 `pages/dashboard.html` 已有四张统计卡和“最近动态”，但值和列表都是写死的；`dashboard.js` 目前只管理照片画廊。不要新增重复卡片，而是给现有四个 `.stat-value` 增加 ID，并把第四张卡的标题从“待审请假”改成“低库存预警”：

```html
<div class="stat-value" id="dashboard-user-count">0</div>
<div class="stat-value" id="dashboard-equipment-quantity">0</div>
<div class="stat-value" id="dashboard-attendance-count">0</div>
<div class="stat-label">低库存预警</div>
<div class="stat-value" id="dashboard-low-stock-count">0</div>
<ul class="activity-list" id="dashboard-activities"></ul>
```

把 `DashboardPage.init()` 改为：

```javascript
init() {
  this.loadImages();
  this.bindEvents();
  this.loadSummary();
  this.loadActivities();
},
```

然后增加：

```javascript
async loadSummary() {
  const res = await Utils.get('/api/dashboard/summary');
  if (!res) return;
  document.getElementById('dashboard-user-count').textContent = res.data.userCount;
  document.getElementById('dashboard-equipment-quantity').textContent = res.data.equipmentQuantity;
  document.getElementById('dashboard-attendance-count').textContent = res.data.todayAttendanceCount;
  document.getElementById('dashboard-low-stock-count').textContent = res.data.lowStockCount;
},

async loadActivities() {
  const res = await Utils.get('/api/dashboard/activities', { limit: 10 });
  if (!res) return;
  document.getElementById('dashboard-activities').innerHTML = res.data.map(item => `
    <li class="activity-item">
      ${Utils.escapeHTML(item.description)}
      <span class="activity-time">${Utils.escapeHTML(item.createdAt)}</span>
    </li>
  `).join('');
},
```

最后在 `dashboard.js` 末尾补上：

```javascript
window.DashboardPage = DashboardPage;
```

当前文件缺少这行，路由通过 `window.DashboardPage` 找不到模块时不会执行 `init()`。没有这些 HTML 和 JavaScript 改造，阶段 11 只能算后端完成，不能勾选“首页数字是真的”。

## 阶段 11 完成标准

```text
[ ] 用户数等于 sys_user 实际行数
[ ] 设备数量是 quantity 求和，不是设备记录条数
[ ] 今日考勤只统计服务器当天
[ ] 低库存数只统计 stock < safe_stock
[ ] 首页不再显示虚假的待审请假数量
[ ] 最近动态按 createdAt 倒序，且 limit 最大 50
[ ] DBeaver 修改数据后刷新首页，数字同步变化
```

```bash
git add . && git commit -m "阶段11完成：仪表盘真实统计与最近动态"
```

---
---

# 第五部分：排错手册与开发习惯

## 5.1 先判断错误发生在哪一层

| 现象 | 优先检查 |
|---|---|
| 浏览器 404 | Controller 路径、HTTP 方法 |
| 浏览器 CORS | `CorsConfig`、Security 的 `.cors(...)`、OPTIONS 放行 |
| HTTP 401 | token 是否存在、`Bearer ` 格式、是否过期 |
| HTTP 403 | `@PreAuthorize` 和当前用户权限 |
| HTTP 400 | Response 的 `message`、DTO 校验、业务规则 |
| HTTP 500 | 后端终端最后一个 `Caused by` |
| 返回有数据但页面空 | DTO 字段名和前端渲染字段 |
| 查询结果不对 | Hibernate 打印的 SQL 和参数 |

## 5.2 Java 堆栈怎么读

不要从几百行堆栈第一行开始逐字读。按这个顺序：

1. 搜索最后一个 `Caused by:`，它通常是根因。
2. 往上找第一个 `com.example.computerroom`，那是你自己的代码位置。
3. 看异常类型，再看 message，不要只看“启动失败”。
4. 修改后只重试导致错误的最小接口。

常见异常：

| 异常 | 常见原因 |
|---|---|
| `NoSuchBeanDefinitionException` | 类没加组件注解，或不在扫描包下 |
| `No property 'x' found` | Repository 派生方法的 Java 字段名写错 |
| `DataIntegrityViolationException` | 唯一键、非空或外键约束冲突 |
| `LazyInitializationException` | 事务外访问懒加载关联；应在 Service 内转 DTO |
| `ObjectOptimisticLockingFailureException` | `@Version` 检测到并发修改 |
| `HttpMessageNotReadableException` | JSON 格式错、日期格式错、类型不匹配 |

## 5.3 每次只写一个接口，立刻验证

```text
写 Repository → 启动通过
写 Service → 单独检查业务分支
写 Controller → Postman 成功场景
             → Postman 失败场景
             → 前端联调
             → Git 提交
```

失败场景比成功场景更重要。每个写接口至少测：空参数、不存在 ID、重复数据、无权限、业务上限。

## 5.4 数据库与事务检查清单

```text
[ ] 修改是“先查、再改字段、再保存”，不是 new 一个残缺实体
[ ] 唯一字段既有 Java 友好检查，也有数据库唯一约束
[ ] 库存变化和流水写入在同一个 @Transactional 方法里
[ ] 用户身份和操作人来自 token，不来自请求 body
[ ] 分页有稳定 ORDER BY，size 有 1-100 上下限
[ ] 统计用 count/sum，不用 findAll().size()
[ ] 生产环境不使用 ddl-auto=update
```

分页参数建议统一写成：

```java
int safePage = Math.max(page, 1);
int safeSize = Math.max(1, Math.min(size, 100));
Pageable pageable = PageRequest.of(safePage - 1, safeSize);
```

这比只写 `Math.min(size, 100)` 更完整，因为 `size=0` 同样会让 `PageRequest` 抛异常。

## 5.5 安全底线

```text
[ ] 密码只存 BCrypt 哈希，日志和 JSON 都不出现密码
[ ] Entity 不直接返回，统一转响应 DTO
[ ] 注册 DTO 没有 roleCode/status 等提权字段
[ ] 401 和 403 返回 JSON，不返回默认 HTML
[ ] JWT 密钥不提交到公开仓库，生产环境读环境变量
[ ] 前端隐藏按钮之外，后端接口仍有 @PreAuthorize
[ ] 角色、状态、库存类型都做白名单校验
[ ] 前端“记住我”只保存账号，不保存密码
```

## 5.6 Git 开发节奏

每完成一个可验证的小阶段提交一次：

```bash
git status
git add back/src/main/java/com/example/computerroom/goods
git commit -m "完成耗材出入库事务"
```

提交信息写“完成了什么”，不要写 `update`、`修改一下`。

> 不要在不确定时使用 `git checkout .`，它会丢弃所有未提交修改。先用 `git status` 和 `git diff` 看清楚，再决定如何处理。

## 5.7 最终验收清单

```text
[ ] 注册用户默认是 user，密码是 BCrypt 哈希
[ ] 登录返回 JWT，无效 token 返回 401
[ ] user/admin/root 的接口权限符合预期
[ ] 人员、设备、耗材全部支持真实数据库 CRUD
[ ] 设备和耗材库存不足时不能出库
[ ] 库存数量与流水始终一致
[ ] 当前用户不能替别人打卡，不能重复打卡
[ ] 仪表盘数字来自数据库统计
[ ] 前端核心业务不再依赖示例数组和 localStorage
[ ] 所有接口错误都是统一 JSON，不泄露 Java 堆栈
[ ] `./mvnw clean package` 构建成功
```

最终执行：

```bash
cd ~/Documents/Study/ComputerRoomSystem/back
./mvnw clean package
```

看到 `BUILD SUCCESS`，并且上述清单全部通过，第一版后端才算完成。
