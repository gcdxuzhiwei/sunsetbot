async function fetchData() {
  return await new Request(
    `https://sunsetbot.top/?query_id=${Math.floor(
      Math.random() * 10000000 + 1
    ).toString()}&intend=select_city&query_city=%E4%B8%8A%E6%B5%B7&event_date=None&event=${
      isAfter8PM() ? "set_2" : "set_1"
    }&times=None`
  ).loadJSON();
}

async function createWidget(data) {
  const widget = new ListWidget();

  // Add title
  const title = widget.addText(
    `${isAfter8PM() ? "明日" : "今日"}火烧云预测: ` + data.quality_des
  );
  title.font = Font.boldSystemFont(16);
  title.centerAlignText();
  widget.addSpacer(8);

  // Add table
  const table = widget.addStack();
  table.layoutVertically();

  addTableRow(table, "北京时间", extractTimeInfo(data.table_content));
  addTableRow(
    table,
    "本地预报火烧云鲜艳度",
    `${data.local_quality.toFixed(3)}(${data.quality_des})`
  );
  addTableRow(
    table,
    "本地预报空气湿度",
    `${data.local_aod.toFixed(3)}(${data.aod_des})`
  );
  addTableRow(table, "数据拉取时间", getCurrentFormattedTime());

  // Set refresh interval
  const refreshInterval = (30 + Math.round(10 * Math.random())) * 60 * 1000;
  widget.refreshAfterDate = new Date(Date.now() + refreshInterval);

  return widget;
}

// Add a row to the table
function addTableRow(table, title, value) {
  const row = table.addStack();
  row.layoutHorizontally();

  const titleText = row.addText(title + ": ");
  titleText.font = Font.systemFont(14);

  row.addSpacer();

  const valueText = row.addText(value);
  valueText.font = Font.systemFont(14);
  valueText.rightAlignText();

  table.addSpacer(4);
}

function isAfter8PM() {
  const now = new Date();
  const currentHour = now.getHours();
  if (currentHour >= 20) {
    return true;
  } else {
    return false;
  }
}

function extractTimeInfo(htmlString) {
  const timeRegex = /(\d{4}-\d{2}-\d{2})<br>(\d{2}:\d{2}:\d{2})/;
  const match = htmlString.match(timeRegex);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return "未知时间";
}

function getCurrentFormattedTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Main function
async function main() {
  const data = await fetchData();
  const widget = await createWidget(data);

  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    widget.presentMedium();
  }

  Script.complete();
}

main();
