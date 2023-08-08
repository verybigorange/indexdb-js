# idb-js
基于indexdb本地数据库的封装, 简单易用.

[文档地址](https://verybigorange.github.io/idb-js/)

#### 安装
使用npm安装 `idb-js` 依赖
```bash
npm install idb-js
```
#### 使用
* 第一步： 引入Idb
```
    import Idb from 'idb-js'  //  引入Idb
```
* 第二步： 引入数据库配置
```
    import IDB_Config from './IDB_Config.js'
```
  
* 第三步： 载入配置，数据库开启成功拿到数据库实例进行操作
```
    Idb(IDB_Config).then(IDB => {...})
```

#### 数据库配置
IDB_Config.js

```
export default {
  dbName: "myDB",
  version: 1,
  tables: [
    {
      tableName: "表名1",
      option: { keyPath: "id" },
    },
  ],
};
```


### add
添加单条或者多条数据

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

### delete
删除数据库中的一条或者多条数据

##### `Demo`:
```js
  // 将grade表中，将name是小红的数据删除
  const res = await IDB.delete({
    tableName: "grade",
    condition: (item, index) => item.name === "小红",
  });
  console.log("删除的数据：", res);
```

### qeury
查询数据库中的一条或者多条数据

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

### update
修改数据库中的一条或者多条数据

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

### transaction
创建一个事务

##### `Demo`:
```js
  // 开启一个事务查询所有数据
  const store = await IDB.transaction("grade");
  store.getAll().onsuccess = function (event) {
    console.log("开启一个事务，查询所有数据:", event.target.result);
  };
```
关于事务操作的更多方法，请查看 https://developer.mozilla.org/zh-CN/docs/Web/API/IDBObjectStore

### getDB
获取IDBDatabase对象

##### `Demo`:
```js
  // 关闭数据库
  const db = await IDB.getDB();
  db.close();
```

关于IDBDatabase对象更多信息，请查看 https://developer.mozilla.org/zh-CN/docs/Web/API/IDBDatabase