---
title: 数据库原理查询语句及关系代数题目整理
tags: [Database, SQL, Relational Algebra]
lang: zh-CN
date: 2018-06-29 23:33:33
updated: 2018-06-29 23:34:44
---

在“学生——选课——课程”数据库中的 3 个关系如下：

- S (Sno, Sname, Age, Sex, Class);
- SC (Sno, Cno, Grade);
- C (Cno, Cname, Period, Teacher);

其中：

- `S` 是学生关系，`Sno`：学号，`Sname`：姓名，`Age`：年龄，`Sex`：性别，`Class`：班级；
- `SC` 是学生选课关系，`Sno`：学号，`Cno`：课程号，`Grade`：成绩；
- `C` 是课程关系，`Cno`：课程号，`Cname`：课程名，`Period`：学时，`Teacher`：任课教师。

<!-- more -->

```SQL
-- 查询选修了课程名为 DB 的学生姓名和所在班级
-- ΠSname,Class(S∞SC∞σCname='DB'(C))
SELECT Sname, Class FROM S
  WHERE Sno IN (SELECT Sno FROM SC, C
    WHERE SC.Cno = C.Cno AND Cname = 'DB');
```

```SQL
-- 查询 LIU 老师所授课程的课程号和课程名
-- ΠCno,Cname(σTeacher='LIU'(C))
SELECT Cno, Cname FROM C WHERE Teacher = 'LIU';
```

```SQL
-- 查询学号为 S3 学生所学课程的课程名与任课教师名
-- ΠCname,Teacher(σSno='S3'(S∞SC))
SELECT Cname, Teacher FROM SC, C
  WHERE SC.Cno = C.Cno AND Sno = 'S3';
```

```SQL
-- 查询至少选修 LIU 老师所授课程中一门课程的女学生的姓名
-- ΠSname(σSex='女'∧Teacher='LIU'(S∞SC∞C))
SELECT Sname FROM S
  WHERE Sex = '女'
    AND Sno IN (SELECT Sno FROM SC, C
      WHERE SC.Cno = C.Cno AND Teacher = 'LIU'));
```

```SQL
-- 查询 WANG 同学不学的课程号
-- ΠCno(C)-ΠCno(σSname='WANG'(S∞SC))
SELECT Cno FROM C
  WHERE Cno NOT IN (SELECT Cno FROM S, SC
    WHERE S.Sno = SC.Sno AND Sname = 'WANG');
```

```SQL
-- 查询至少选修两门课程的学生学号
-- ΠSno(σ1=4∧2≠5(SC×SC))
-- （SC 自乘之后，同一个学号（1、4 列）下两个课程号（2、5 列）不同的元组）
SELECT Sno FROM SC GROUP BY Sno HAVING COUNT(Cno) >＝ 2;
```

```SQL
-- 查询全部学生都选修的课程的课程号和课程名
-- ΠCno,Cname(SC∞(ΠSno,Cno(SC)÷ΠSno(S)))
-- （涉及到全部值时，应用除法，“除数”是全部量）
SELECT Cno, Cname FROM C
  WHERE NOT EXISTS (SELECT * FROM S
    WHERE NOT EXISTS (SELECT * FROM SC
      WHERE S.Sno = SC.Sno AND SC.Cno = C.Cno));
```

```SQL
-- 查询选修课程包含 LIU 老师所授课程的学生学号
-- ΠSno(σTeacher='LIU'(SC∞C))
SELECT Sno FROM SC, C
  WHERE SC.Cno = C.Cno AND Teacher = 'LIU'));
```

```SQL
-- 统计有学生选修的课程门数
SELECT COUNT(DISTINCT Cno) FROM SC;
```

```SQL
-- 求选修 C4 课程的学生的平均年龄
SELECT AVG(Age) FROM S
  WHERE Sno IN (SELECT Sno FROM SC WHERE Cno = 'C4');
```

```SQL
-- 求 LIU 老师所授课程的每门课程的学生平均成绩
SELECT Cno, AVG(Grade) FROM SC
  WHERE Cno IN (SELECT Cno FROM C WHERE Teacher = 'LIU')
  GROUP BY Cno;
```

```SQL
-- 统计每门课程的学生选修人数（超过 10 人的课程才统计）
-- 要求输出课程号和选修人数，查询结果按人数降序排列，若人数相同，按课程号升序排列
SELECT DISTINCT Cno, COUNT(Sno) FROM SC
  GROUP BY Cno
  HAVING COUNT(Sno) > 10
  ORDER BY COUNT(Sno) DESC, Cno;
```

```SQL
-- 查询学号比 WANG 同学大，而年龄比他小的学生姓名
SELECT X.Sname FROM S X, S Y
  WHERE X.Sno > Y.Sno AND X.Age < Y.Age AND Y.Sname = 'WANG';
```

```SQL
-- 查询姓名以 WANG 打头的所有学生的姓名和年龄
SELECT Sname, Age FROM S WHERE Sname LIKE 'WANG%';
```

```SQL
-- 在 SC 中检索成绩为空值的学生学号和课程号
SELECT Sno, Cno FROM SC WHERE Grade IS NULL;
```

```SQL
-- 求年龄大于女同学平均年龄的男学生姓名和年龄
SELECT Sname, Age FROM S X
  WHERE X.Sex = '男'
    AND X.Age > (SELECT AVG(Age) FROM S Y WHERE Y.Sex = '女');
```

```SQL
-- 求年龄大于所有女同学年龄的男学生姓名和年龄
SELECT Sname, Age FROM S X
  WHERE X.Sex = '男'
    AND X.Age > ALL (SELECT Age FROM S Y WHERE Y.Sex = '女');
```
