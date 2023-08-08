# 其他API


## transaction
`transaction`创建一个事务
##### 参数
  - `string` 表名

##### 返回值 `Promise<事务对象store>`
 

##### `Demo`:
```js
  // 开启一个事务查询所有数据
  const store = await IDB.transaction("grade");
  store.getAll().onsuccess = function (event) {
    console.log("开启一个事务，查询所有数据:", event.target.result);
  };
```
关于事务操作的更多方法，请查看 https://developer.mozilla.org/zh-CN/docs/Web/API/IDBObjectStore

## getDB
`getDB`获取IDBDatabase对象
##### 参数
  无

##### 返回值 `Promise<事务对象store>`
 

##### `Demo`:
```js
  // 关闭数据库
  const db = await IDB.getDB();
  db.close();
```

关于IDBDatabase对象更多信息，请查看 https://developer.mozilla.org/zh-CN/docs/Web/API/IDBDatabase