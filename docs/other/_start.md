# 快速使用
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