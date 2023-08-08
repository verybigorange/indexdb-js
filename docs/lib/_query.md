# 查询
查询数据库中的一条或者多条数据

## query
`query`游标的方式查询单条或者多条数据
##### 参数
  - `{Object}`
  
##### 属性
  - `tableName` { String } 表名
  - `condition` [非必传，不传则全部数据] { Function } 匹配条件 @return { Boolean }

##### 返回值 `Promise<[]>`
 

##### `Demo`:
```js
  // 按条件查询
  // 将grade表中，将score是100的数据查询出来
  const res = await IDB.query({
    tableName: "grade",
    condition: (item, index) => item.score == 100,
  });
  console.log(`按条件查询：`, res);
```

```js
  // 查询全部数据
  const res = await IDB.query({
    tableName: "grade",
  });
  console.log(`查询全部数据:`, res);
```

```js
  // 按分页查询
  const res = await IDB.query({
    tableName: "grade",
    condition: (item, index) => {
      const page = 2;
      const pageSize = 2;
      const min = (page - 1) * pageSize;
      const max = page * pageSize;
      return index >= min && index < max;
    },
  });
  console.log(`按分页查询`, res);
```