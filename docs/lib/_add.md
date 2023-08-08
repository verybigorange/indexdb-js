# 增加
向数据库中插入数据

## add
`add`添加单条或者多条数据
##### 参数
  - `{Object}`
  
##### 属性
  - `tableName` { String } 表名
  - `data` { Object \| Array } 数据,单个对象或者一个数组对象
  
##### 返回值 `Promise`
##### `Demo`:
```js
    // 插入单条数据
   try {
    await IDB.add({
      tableName: "grade",
      data: {
        id: 1,
        score: 98,
        name: "小明",
      },
    });
    console.log("数据添加成功");
  } catch (error) {
    console.log("数据添加失败", error);
  }

    // 插入多条数据
    await IDB.add({
      tableName: "grade",
      data: [
        {
          id: 2,
          score: 99,
          name: "小红",
        },
        {
          id: 3,
          score: 100,
          name: "小刚",
        },
      ],
    });
```