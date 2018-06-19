---
title: SQL Server 数据库使用练习
tags: [SQL, 数据库]
description: <center>数据库原理上机实验题目及代码整理</center>
date: 2018-05-19 08:49:15
updated: 2018-05-19 10:20:15
---

# 实验环境

- Microsoft SQL Server 2017 Express Edition
- Microsoft SQL Server Management Studio 17.6

# 基本表的建立与修改

成绩管理数据库`GradeManager`包括四个表: 学生表`Student`; 课程表`Course`; 班级表`Class`; 成绩表`Grade`.

<!--more-->

## 学生表 Student

### 表结构定义

| 属性名 | 数据类型    | 可否为空 | 含义       |
| ------ | ----------- | -------- | ---------- |
| Sno    | char(7)     | 否       | 学号(唯一) |
| Sname  | varchar(20) | 否       | 学生姓名   |
| Ssex   | char(2)     | 否       | 性别       |
| Sage   | smallint    | 可       | 年龄       |
| Clno   | char(5)     | 否       | 所在班级   |

```SQL
-- 建立学生表
CREATE TABLE Student(
	Sno char(7) NOT NULL UNIQUE,
	Sname varchar(20) NOT NULL,
	Ssex char(2) NOT NULL,
	Sage smallint,
	Clno char(5) NOT NULL
	);
```

### 表数据内容

| Sno     | Sname  | Ssex | Sage | Clno  |
| ------- | ------ | ---- | ---- | ----- |
| 2000101 | 李勇   | 男   | 20   | 00311 |
| 2000102 | 刘诗晨 | 女   | 19   | 00311 |
| 2000103 | 王一鸣 | 男   | 20   | 00312 |
| 2000104 | 张婷婷 | 女   | 21   | 00312 |
| 2001101 | 李勇敏 | 女   | 19   | 01311 |
| 2001102 | 贾向东 | 男   | 22   | 01311 |
| 2001103 | 陈宝玉 | 男   | 20   | 01311 |
| 2001104 | 张逸凡 | 男   | 21   | 01311 |

```SQL
-- 填充学生表
INSERT INTO Student VALUES('2000101','李勇','男',20,'00311');
INSERT INTO Student VALUES('2000102','刘诗晨','女',19,'00311');
INSERT INTO Student VALUES('2000103','王一鸣','男',20,'00312');
INSERT INTO Student VALUES('2000104','张婷婷','女',21,'00312');
INSERT INTO Student VALUES('2001101','李勇敏','女',19,'01311');
INSERT INTO Student VALUES('2001102','贾向东','男',22,'01311');
INSERT INTO Student VALUES('2001103','陈宝玉','男',20,'01311');
INSERT INTO Student VALUES('2001104','张逸凡','男',21,'01311');
```

## 课程表 Couse

### 表结构定义

| 属性名 | 数据类型    | 可否为空 | 含义         |
| ------ | ----------- | -------- | ------------ |
| Cno    | char(1)     | 否       | 课程号(唯一) |
| Cname  | varchar(20) | 否       | 课程名称     |
| Credit | smallint    | 可       | 学分         |

```SQL
-- 建立课程表
CREATE TABLE Course(
	Cno char(1) NOT NULL UNIQUE,
	Cname varchar(20) NOT NULL,
	Credit smallint
	);
```

### 表数据内容

| Cno  | Cnmae        | Credit |
| ---- | ------------ | ------ |
| 1    | 数据库       | 4      |
| 2    | 离散数学     | 3      |
| 3    | 管理信息系统 | 2      |
| 4    | 操作系统     | 4      |
| 5    | 数据结构     | 4      |
| 6    | 数据处理     | 2      |
| 7    | C语言        | 4      |

```SQL
-- 填充课程表
INSERT INTO Course VALUES('1','数据库',4);
INSERT INTO Course VALUES('2','离散数学',3);
INSERT INTO Course VALUES('3','管理信息系统',2);
INSERT INTO Course VALUES('4','操作系统',4);
INSERT INTO Course VALUES('5','数据结构',4);
INSERT INTO Course VALUES('6','数据处理',2);
INSERT INTO Course VALUES('7','C语言',4);
```

## 班级表 CLass

### 表结构定义

| 属性名     | 数据类型    | 可否为空 | 含义         |
| ---------- | ----------- | -------- | ------------ |
| Clno       | char(5)     | 否       | 班级号(唯一) |
| Speciality | varchar(20) | 否       | 班级所在专业 |
| Inyear     | char(4)     | 否       | 入校年份     |
| Number     | int         | 可       | 班级人数     |
| Monitor    | char(7)     | 可       | 班长学号     |

```SQL
-- 建立班级表
CREATE TABLE Class(
	Clno char(5) NOT NULL UNIQUE,
	Speciality varchar(20) NOT NULL,
	Inyear char(4) NOT NULL,
	Number int,
	Monitor char(7)
	);
```

### 表数据内容 

| Clno  | Speciality | Inyear | Number | Monitor |
| ----- | ---------- | ------ | ------ | ------- |
| 00311 | 计算机软件 | 2000   | 120    | 2000101 |
| 00312 | 计算机应用 | 2000   | 140    | 2000103 |
| 01311 | 计算机软件 | 2001   | 220    | 2001103 |

```SQL
-- 填充班级表
INSERT INTO Class VALUES('00311','计算机软件','2000',120,'2000101');
INSERT INTO Class VALUES('00312','计算机应用','2000',140,'2000103');
INSERT INTO Class VALUES('01311','计算机软件','2001',220,'2001103');
```

## 成绩表 Grade

### 表结构定义

| 属性名 | 数据类型     | 可否为空 | 含义   |
| ------ | ------------ | -------- | ------ |
| Sno    | char(7)      | 否       | 学号   |
| Cno    | char(1)      | 否       | 课程号 |
| Gmark  | numeric(4,1) | 可       | 成绩   |
```SQL
-- 建立成绩表
CREATE TABLE Grade(
	Sno char(7) NOT NULL,
	Cno char(1) NOT NULL,
	Gmark numeric(4,1)
	);
```

### 表数据内容 

| Sno     | Cno  | Gmark |
| ------- | ---- | ----- |
| 2000101 | 1    | 92    |
| 2000101 | 3    | NULL  |
| 2000101 | 5    | 86    |
| 2000102 | 1    | 78    |
| 2000102 | 6    | 55    |
| 2000103 | 3    | 65    |
| 2000103 | 6    | 78    |
| 2000103 | 5    | 66    |
| 2000104 | 1    | 54    |
| 2000104 | 6    | 83    |
| 2001101 | 2    | 70    |
| 2001101 | 4    | 65    |
| 2001102 | 2    | 80    |
| 2001102 | 4    | NULL  |
| 2001103 | 1    | 83    |
| 2001103 | 2    | 76    |
| 2001103 | 4    | 56    |
| 2001103 | 7    | 88    |

```SQL
-- 填充成绩表
INSERT INTO Grade VALUES('2000101','1',92);
INSERT INTO Grade VALUES('2000101','3',NULL);
INSERT INTO Grade VALUES('2000101','5',86);
INSERT INTO Grade VALUES('2000102','1',78);
INSERT INTO Grade VALUES('2000102','6',55);
INSERT INTO Grade VALUES('2000103','3',65);
INSERT INTO Grade VALUES('2000103','6',78);
INSERT INTO Grade VALUES('2000103','5',66);
INSERT INTO Grade VALUES('2000104','1',54);
INSERT INTO Grade VALUES('2000104','6',83);
INSERT INTO Grade VALUES('2001101','2',70);
INSERT INTO Grade VALUES('2001101','4',65);
INSERT INTO Grade VALUES('2001102','2',80);
INSERT INTO Grade VALUES('2001102','4',NULL);
INSERT INTO Grade VALUES('2001103','1',83);
INSERT INTO Grade VALUES('2001103','2',76);
INSERT INTO Grade VALUES('2001103','4',56);
INSERT INTO Grade VALUES('2001103','7',88);
```

## 基本表的修改

> 出自[教材](https://www.amazon.cn/dp/B01KUN09NE)习题3的题目均已在对应代码块开头标记题号.

```SQL
-- 11.

-- (1) 给学生表增加一属性Nation(民族)，数据类型为Varchar(20)
ALTER TABLE Student
    ADD Nation varchar(20);

-- (2) 删除学生表中新增的属性Nation
ALTER TABLE Student
    DROP COLUMN Nation;

-- (3) 向成绩表中插入记录('2001110','3',80);
INSERT INTO Grade(Sno,Cno,Gmark)
    VALUES('2001110','3',80);

-- (4) 删除学号为"2001110"的学生的成绩记录
DELETE FROM Grade
    WHERE Sno='2001110';

-- (5) 为学生表的Clno属性上创建一个名为IX_Class的索引, 以班级号的升序排序
CREATE INDEX INDEXX_Class
    ON Student (Clno ASC);

-- (6) 删除学生表上的IX_Class索引
DROP INDEX Student.IX_Class;
```

# SELECT语句的基本使用 

```SQL
-- 12.

-- (1) 找出所有被学生选修了的课程号
SELECT DISTINCT Cno FROM Grade;

-- (2) 找出01311班女学生的个人信息
SELECT * FROM Student WHERE Clno='01311' AND Ssex='女';

-- (3) 找出01311班、01312班的学生姓名、性别、出生年份
SELECT 学生姓名=Sname,性别=Ssex,出生年份=2018-Sage
    FROM Student WHERE Clno='01311' OR Clno='01312';

-- (4) 找出所有姓李的学生的个人信息
SELECT * FROM Student WHERE Sname LIKE '李%';

-- (5) 找出课程名为操作系统的平均成绩, 最高分, 最低分
SELECT 平均成绩=AVG(Gmark),最高分=MAX(Gmark),最低分=MIN(Gmark)
    FROM Course C,Grade G
    WHERE C.Cno=G.Cno AND Cname='操作系统';

-- (6) 找出选修了课程的学生人数
SELECT COUNT(DISTINCT Sno) FROM Grade;

-- (7) 找出选修了课程操作系统的学生人数
SELECT COUNT(DISTINCT Sno)
    FROM Course C,Grade G
    WHERE C.Cno=G.Cno AND Cname='操作系统';

-- (8) 找出2000级计算机软件班的成绩为空的学生姓名
SELECT DISTINCT Sname
    FROM Student S,Class C,Grade G
    WHERE S.Clno=C.Clno AND S.Sno=G.Sno
        AND Inyear='2000'
        AND Speciality='计算机软件'
        AND Gmark IS NULL;
```

# SELECT语句的嵌套使用

```SQL
-- 13.

-- (1) 找出与李勇在同一个班级的学生信息
SELECT * FROM Student
    WHERE Clno=(SELECT Clno FROM Student WHERE Sname='李勇')
        AND Sname != '李勇';

-- (2) 找出所有与李勇有相同选修课程的学生信息
SELECT * FROM Student
    WHERE Sno IN 
    (SELECT Sno FROM Grade
        WHERE Cno IN
        (SELECT Cno FROM Student S, Grade G
            WHERE S.Sno=G.Sno AND S.Sname='李勇')
    ) AND Sname != '李勇';

-- (3) 找出年龄介于学生李勇和25岁之间的学生信息(已知李勇年龄小于25岁)
SELECT * FROM Student
    WHERE Sage > (SELECT Sage FROM Student WHERE Sname='李勇')
        AND 25 > Sage;

-- (4) 找出选修了课程操作系统的学生学号和姓名
SELECT S.Sno, Sname
    FROM Student S, Course C, Grade G
    WHERE S.Sno = G.Sno AND C.Cno = G.Cno
        AND Cname = '操作系统';

-- (5) 找出没有选修1号课程的学生姓名
SELECT Sname FROM Student
    WHERE Sno NOT IN
    (SELECT S.Sno FROM Student S, Grade G
        WHERE S.Sno = G.Sno AND G.Cno = 1);

-- (6) 找出选修了全部课程的学生姓名
-- (提示: 找出没有一门课程是他未选修的学生姓名)
SELECT Sname FROM Student S WHERE NOT EXISTS
    (SELECT * FROM Course C WHERE NOT EXISTS
        (SELECT * FROM Grade G 
            WHERE G.Cno=C.Cno AND G.Sno=S.Sno));
```

```SQL
-- 14.

-- (1) 查询选修了3号课程的学生学号及其成绩, 并按成绩降序排列
SELECT S.Sno, Gmark
    FROM Student S, Grade G
    WHERE S.Sno = G.Sno
    ORDER BY Gmark DESC;

-- (2) 查询全体学生信息, 查询结果按班机号升序排列, 同一班级学生按年龄降序排列
SELECT * FROM Student
    ORDER BY Clno, Sage DESC;

-- (3) 求每个课程号及相应的选课人数
SELECT Cno, 选课人数=COUNT(Sno) FROM Grade
    GROUP BY Cno;

-- (4) 查询选修了3门以上课程的学生学号
SELECT Sno FROM Grade
    GROUP BY Sno
    HAVING COUNT(Cno) > 3;
```

# SQL的存储操作

```SQL
-- 15.

-- (1) 将01311班的全体学生的成绩置零
UPDATE Grade
    SET COLUMN Gmark = 0
    WHERE Sno IN (SELECT Sno FROM Student WHERE Clno = '01311');

-- (2) 删除2001级计算机软件的全体学生的选课记录
DELETE FROM Grade
    WHERE Sno IN
    (SELECT S.Sno FROM Student S, Class C
        WHERE S.Clno = C.Clno AND Speciality = '计算机软件');

-- (3) 学生李勇已退学, 从数据库中删除有关他的记录
UPDATE Class -- (李勇是班长Monitor, 不过也不知道怎么办)
    SET Number = Number-1 -- 李勇所在班级人数-1
    WHERE Clno = (SELECT Clno FROM Student WHERE Sname = '李勇');
DELETE FROM Grade, Student
    WHERE Sno = (SELECT Sno FROM Student WHERE Sname = '李勇');

-- (4) 对每个班, 求学生的平均年龄, 并把结果存入数据库
ALTER TABLE Class
    ADD Clage smallint NULL;
UPDATE Class C
    SET Clage = (SELECT AVG(Sage) FROM Student WHERE Clno=C.Clno GROUP BY Clno)
    WHERE C.Clno IN (SELECT Clno FROM Class);
```

# 视图的建立及操作

```SQL
-- 16.

-- (1) 建立01311班选修了1号课程的学生视图Stu_01311_1
CREATE VIEW Stu_01311_1
    AS SELECT * FROM Student WHERE Sno IN
        (SELECT S.Sno FROM Student S, Grade G
            WHERE S.Sno = G.Sno
                AND S.Clno = '01311'
                AND G.Cno = 1);

-- (2) 建立01311班选修了1号课程并且成绩不及格的学生视图Stu_01311_2
CREATE VIEW Stu_01311_2
    AS SELECT * FROM Student WHERE Sno IN
        (SELECT S.Sno FROM Student S, Grade G
            WHERE S.Sno = G.Sno
                AND S.Clno = '01311'
                AND G.Cno = 1
                AND Gmark < 60);

-- (3) 建立视图Stu_year, 由学生学号, 姓名, 出生年份组成
CREATE VIEW Stu_year(Sno, Sname, BirthYear)
    AS SELECT Sno, Sname, 2018-Sage FROM Student;

-- (4) 查询1983年以后出生的学生姓名
SELECT Sname FROM Stu_year WHERE BirthYear > 1983;

-- (5) 查询01311班选修了1号课程并且成绩不及格的学生的学号, 姓名, 出生年份
SELECT * FROM Stu_year
    WHERE Sno IN (SELECT Sno FROM Stu_01311_2);
```

# 创建触发器和存储过程

```SQL
-- 在查询分析器(Query Analyzer)中创建以下触发器, 并验证其语法的正确性: 

-- 1.
-- 为Student表创建一插入和更新触发器tri_ins_upd_student:
-- 当插入新的学生或者更新学生所在班级号时, 检查该班级的学生人数有没有超过40人 ,
-- 如果没有则插入或者更新成功, 如果超出40人, 操作回滚.
CREATE TRIGGER tri_ins_upd_student
    ON Student
    AFTER INSERT,UPDATE
AS
    IF 40 < (SELECT Number FROM Class
            WHERE Clno = (SELECT Clno FROM inserted))
        ROLLBACK TRANSACTION

-- 2.
-- 为数据库GradeManager创建一存储过程ap_returncount: 
-- 功能是: 输入学生学号, 输出该学生所在的班级人数.
CREATE PROCEDURE ap_returncount
    @Sno char(7)
AS
    DECLARE @count int
    SELECT @count=Number FROM Class
        WHERE Clno = (SELECT Clno FROM Student WHERE Sno = @Sno)
    RETURN @count


-- 3.
-- 在Enterprise Manager中展开GradeManager数据库, 展开Trigger, 
-- 查看刚创建的触发器tri_ins_upd_student, 修改触发器定义, 
-- 使之调用存储过程ap_returncount实现原来的功能.
CREATE TRIGGER tri_ins_upd_student
    ON Student
    AFTER INSERT,UPDATE
AS
    DECLARE @count int
    EXECUTE @count = ap_returncount (SELECT Sno FROM inserted)
    IF 40 < @count
        ROLLBACK TRANSACTION
```

# 参考资料

教材: [《数据库原理(第四版)》 张红娟【摘要 书评 试读】图书 - 亚马逊](https://www.amazon.cn/dp/B01KUN09NE)