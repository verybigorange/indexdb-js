export default {
  dbName: "student",
  version: 1,
  tables: [
    {
      tableName: "grade",
      option: { keyPath: "id" },
    },
    // {
    //   tableName: "info",
    //   option: { keyPath: "id" },
    //   indexs: [  // 创建索引 https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex
    //     {
    //       key: "id",
    //       option: {
    //         unique: true,
    //       },
    //     },
    //     {
    //       key: "name",
    //       option: {
    //         unique: false,
    //       },
    //     },
    //     {
    //       key: "age",
    //       option: {
    //         unique: false,
    //       },
    //     },
    //     {
    //       key: "sex",
    //       option: {
    //         unique: false,
    //       },
    //     },
    //   ],
    // },
  ],
};
