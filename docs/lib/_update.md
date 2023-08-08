# 修改
修改数据库中的一条或者多条数据

## update
`update`游标的方式修改单条或者多条数据
##### 参数
  - `{Object}`
  
##### 属性
  - `tableName` { String } 表名
  - `condition` [非必传，不传则全部数据] { Function } 匹配条件 @return { Boolean }
  - `handler` { Function } 修改方式

##### 返回值 `Promise<[]>`
##### `Demo`:
```js
  // 根据条件修改
  // 将grade表中，将name是小明的全部数据的score修改为100
  const res = await IDB.update({
    tableName: "grade",
    condition: (item, index) => item.name === '小明',
    handler: (row) => {
      row.score = 100;
    },
  });
  console.log("根据条件修改的数据：", res);
```

```js
// 全部数据修改-全部数据增加新字段newField
const res = await IDB.update({
  tableName: "grade",
  handler: (row, index) => {
    row.newField = "这是新字段";
  },
});
console.log("全部数据修改-增加新字段：", res);
```