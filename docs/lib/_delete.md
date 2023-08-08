# 删除
删除数据库中的一条或者多条数据

## delete
`delete`游标的方式删除单条或者多条数据
##### 参数
  - `{Object}`
  
##### 属性
  - `tableName` { String } 表名
  - `condition` [非必传，不传则全部数据] { Function } 匹配条件 @return { Boolean }
##### 返回值 `Promise<[]>`

##### `Demo`:
```js
  // 将grade表中，将name是小红的数据删除
  const res = await IDB.delete({
    tableName: "grade",
    condition: (item, index) => item.name === "小红",
  });
  console.log("删除的数据：", res);
```