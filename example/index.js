import Idb from "../src/Idb";
import db_student_config from "./db_student_config";

(async function () {
  const IDB = await Idb(db_student_config);
  console.log(IDB);

  try {
    // 添加一条数据
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

  // 添加多条数据
  try {
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
        {
          id: 4,
          score: 67,
          name: "小刚刚",
        },
        {
          id: 5,
          score: 100,
          name: "小李",
        },
        {
          id: 6,
          score: 100,
          name: "小高",
        },
      ],
    });
  } catch (error) {}

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

  // 按条件查询
  const res1 = await IDB.query({
    tableName: "grade",
    condition: (item, index) => item.score == 100,
  });
  console.log(`按条件查询：`, res1);

  // 查询全部
  const res2 = await IDB.query({
    tableName: "grade",
  });
  console.log(`查询全部:`, res2);

  // 根据条件修改
  const res3 = await IDB.update({
    tableName: "grade",
    condition: (item, index) => item.score == 100,
    handler: (row) => {
      row.name = "新名字";
    },
  });
  console.log("根据条件修改的数据：", res3);

  // 全部数据修改-增加新字段
  const res4 = await IDB.update({
    tableName: "grade",
    handler: (row, index) => {
      row.newField = "这是新字段";
    },
  });
  console.log("全部数据修改-增加新字段：", res4);

  // 删除数据
  const res5 = await IDB.delete({
    tableName: "grade",
    condition: (item, index) => item.name === "小红",
  });
  console.log("删除的数据：", res5);

  // 开启一个事务
  const store = await IDB.transaction("grade");
  store.getAll().onsuccess = function (event) {
    console.log("开启一个事务，查询所有数据:", event.target.result);
  };

  // 获取IDBDatabase对象
  const db = await IDB.getDB();
  console.log("getDB", db);
})();
