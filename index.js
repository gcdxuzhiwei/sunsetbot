const axios = require("axios");

axios
  .get(
    `https://sunsetbot.top/?query_id=${Math.floor(
      Math.random() * 10000000 + 1
    ).toString()}&intend=select_city&query_city=%E4%B8%8A%E6%B5%B7&event_date=None&event=set_1&times=None`
  )
  .then((res) => {
    const { table_content, local_quality, quality_des, local_aod, aod_des } =
      res.data;
    const msg = {
      title: `今日火烧云预测:${quality_des}`,
      desp: `
| 北京时间                | 本地预报火烧云鲜艳度 | 本地预报气溶胶 |
|:------------------------|:---------------------|:---------------|
| ${extractTimeInfo(table_content)}     | ${local_quality.toFixed(
        3
      )}(${quality_des}) | ${local_aod.toFixed(3)}(${aod_des})  |

了解详情:[sunsetbot](https://sunsetbot.top/)
`,
    };
    sendMsg(msg);
  })
  .catch((e) => {
    console.log("---error---");
    console.error(e);
    console.log("---error---");
  });

function extractTimeInfo(htmlString) {
  // 定义正则表达式以匹配日期和时间格式
  const timeRegex = /(\d{4}-\d{2}-\d{2})<br>(\d{2}:\d{2}:\d{2})/;

  // 使用正则表达式在字符串中查找匹配项
  const match = htmlString.match(timeRegex);

  // 如果找到匹配项，则组合日期和时间并返回
  if (match) {
    return `${match[1]} ${match[2]}`;
  }

  // 如果未找到匹配项，则返回null或其他默认值
  return null;
}

function sendMsg(msg) {
  const keys = process.env.SENDKEYS.split(",");
  Promise.all(
    keys.map((v) => {
      return () =>
        axios.get(v, {
          params: msg,
        });
    })
  ).catch((e) => {
    console.log("---errorsend---");
    console.error(e);
    console.log("---errorsend---");
  });
}
