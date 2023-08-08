# 更新内容

### 2.0.0
  - `2023-08-08`
    - 增删查改全面升级
      - 支持 `promise`
      - `condition` 中注入 `index`
    - 废弃部分API
      - `close_db`
      - `delete_db`
      - `clear_table`
      - `delete_by_primaryKey`
      - `query_by_primaryKey`
      - `query_by_index`
    - `insert` 更改为 `add`
    
### 1.3.1
  - `2019-2-15` 
    - `insert`方法中，底层将`add` 替换成 `put`的方式

### 1.3.0
  - `2018-12-14` 增加文档

### 1.2.1
  - `2018-12-07` 完成了基础方法
    - `close_db`
    - `delete_db`
    - `clear_table`
    - `insert`
    - `query`
    - `query_by_primaryKey`
    - `query_by_index`
    - ,`queryAll`
    - `delete`
    - `delete_by_primaryKey`
    - `update`
    - `update_by_primaryKey`
