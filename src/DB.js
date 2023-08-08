import Dep from "./uitils/Dep.js";
import { log_error } from "./uitils/log";
import { indexedDB, IDBTransaction, IDBKeyRange } from "./global";
import { isArray, isObject } from "./uitils/type.js";
import { NAME } from "./uitils/config.js";

class DB {
  constructor({ dbName, version }) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.idb = null;
    this.tables = [];
    this._status = false; // 是否先添加了表
    this._dep_ = new Dep();
  }

  /**
   * 打开数据库
   * @success 成功的回调，返回db，非必传
   * @error 失败的回调，返回错误信息，非必传
   * */
  open(ops) {
    let success = () => {},
      error = () => {};

    if (ops) {
      success = ops.success ? ops.success : success;
      error = ops.error ? ops.error : error;
    }

    // 打开前要先添加表
    if (this.tables.length == 0 && !this._status) {
      log_error("打开前要先用add_table添加表");
      return;
    }

    if (typeof success !== "function") {
      log_error("open中success必须是一个function类型");
      return;
    }

    const request = indexedDB.open(this.dbName, this.version);

    request.onerror = (e) => {
      error(e.currentTarget.error.message);
    };

    request.onsuccess = (e) => {
      this.db = e.target.result;
      success(this.db);
      this._dep_.notify();
    };

    request.onupgradeneeded = (e) => {
      this.idb = e.target.result;

      for (let i = 0; i < this.tables.length; i++) {
        this.__create_table(this.idb, this.tables[i]);
      }
    };
  }

  /**
   * 添加一张表
   * @param tableOption<Object>
   * @tableName 表名
   * @option 表配置
   * @index 索引配置
   * */
  add_table(tableOption = {}) {
    this._status = false;
    this.tables.push(tableOption);
  }

  /**
   * 开启一个事务
   * @param tableName 表名
   * @param mode 模式 readonly | readwrite
   * @return promise<store>
   * */
  transaction(tableName, mode = "readwrite") {
    return this.__action(() =>
      this.db.transaction(tableName, mode).objectStore(tableName)
    );
  }

  /**
   * 返回IDBDatabase对象
   * @return promise<IDBDatabase>
   * */
  getDB() {
    return this.__action(() => this.db);
  }

  /**
   * @method 查询
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Function} condition 查询的条件,如果不传，默认查询全部数据
   *      @arg {Object} 遍历每条数据，和filter类似
   *      @arg {number} 索引index，从0开始
   *      @return 条件
   *  @return Promise<[]>
   * */
  query({ tableName, condition = () => true }) {
    return this.__action(() =>
      this.__create_transaction(
        tableName,
        (store) => {
          return new Promise(async (resolve, reject) => {
            try {
              const res = [];
              let index = 0;
              this.__openCursor(store, async (cursor) => {
                if (cursor) {
                  if (await condition(cursor.value, index)) {
                    res.push(cursor.value);
                  }
                  cursor.continue();
                  index++;
                } else {
                  resolve(res);
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        },
        "readonly"
      )
    );
  }

  /**
   * @method 增加数据
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Object} data 插入的数据
   *   @property {Function} [success] 插入成功的回调
   *  @return {Promise}
   * */
  add({ tableName, data }) {
    if (!(isArray(data) || isObject(data))) {
      log_error("in insert，data type is Object or Array");
      return;
    }

    return this.__action(() =>
      this.__create_transaction(
        tableName,
        (store) => {
          isArray(data) ? data.forEach((v) => store.add(v)) : store.add(data);
        },
        "readwrite"
      )
    );
  }

  /**
   * @method 删除数据
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Function} condition 查询的条件，遍历，与filter类似,默认全部数据
   *      @arg {Object} 每个元素
   *      @arg {Number} 索引index，从0开始
   * */
  delete({ tableName, condition = () => true }) {
    return this.__action(() =>
      this.__create_transaction(
        tableName,
        (store) => {
          return new Promise(async (resolve, reject) => {
            try {
              const res = [];
              let index = 0;
              this.__openCursor(store, async (cursor) => {
                if (cursor) {
                  let curValue = cursor.value;
                  if (await condition(curValue, index)) {
                    cursor.delete(curValue);
                    res.push(curValue);
                  }
                  cursor.continue();
                  index++;
                } else {
                  resolve(res);
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        },
        "readwrite"
      )
    );
  }

  /**
   * @method 修改数据
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Function} condition 查询的条件，遍历，与filter类似,默认全部数据
   *      @arg {Object} 每个元素
   *      @arg {Number} 索引index，从0开始
   *   @property {Function} handler 处理函数，接收本条数据的引用，对其修改
   * */
  update({ tableName, handler, condition = () => true }) {
    return this.__action(() =>
      this.__create_transaction(
        tableName,
        (store) => {
          return new Promise(async (resolve, reject) => {
            try {
              const res = [];
              let index = 0;
              this.__openCursor(store, async (cursor) => {
                if (cursor) {
                  let curValue = cursor.value;
                  if (await condition(curValue, index)) {
                    await handler(curValue);
                    cursor.update(curValue);
                    res.push(curValue);
                  }
                  cursor.continue();
                  index++;
                } else {
                  resolve(res);
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        },
        "readwrite"
      )
    );
  }

  /**
   * @method 开启游标
   * @param  Store
   * @param  callback {游标}
   * */
  __openCursor(store, callback) {
    const request = store.openCursor();

    request.onsuccess = (e) => {
      const cursor = e.target.result;
      callback(cursor);
    };
  }

  /**
   * @method 开启事务
   * @param {String} 表名
   * @param {String} 事务权限
   * @return {Promise}
   * */
  __create_transaction(tableName, handler, mode = "readwrite") {
    return new Promise(async (resolve, reject) => {
      if (!tableName || !mode) {
        reject();
        throw new Error(
          "in __create_transaction,tableName and mode is required"
        );
      }
      const transaction = this.db.transaction(tableName, mode);

      const store = transaction.objectStore(tableName);

      let data = null;
      try {
        data = await handler(store);
      } catch (error) {
        reject(error);
      }

      transaction.oncomplete = (event) => {
        resolve({ data, event });
      };
      transaction.onerror = (event) => {
        reject({
          name: NAME,
          msg: event.target.error,
          event,
        });
      };
    });
  }

  // db是异步的,保证fn执行的时候db存在
  __action(handler) {
    return new Promise((resolve, reject) => {
      const action = async () => {
        try {
          const result = await handler();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      // 如果db不存在，加入依赖
      if (!this.db) {
        this._dep_.add(action);
      } else {
        action();
      }
    });
  }

  /**
   * 创建table
   * @option<Object>  keyPath指定主键 autoIncrement是否自增
   * @index 索引配置
   * */
  __create_table(idb, { tableName, option, indexs = [] }) {
    if (!idb.objectStoreNames.contains(tableName)) {
      let store = idb.createObjectStore(tableName, option);
      for (let indexItem of indexs) {
        this.__create_index(store, indexItem);
      }
    }
  }

  /**
   * 创建索引
   * @option<Object> unique是否是唯一值
   * */
  __create_index(store, { key, option }) {
    store.createIndex(key, key, option);
  }
}

export default DB;
