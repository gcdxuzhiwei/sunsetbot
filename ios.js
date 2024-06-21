async function fetchData() {
  let event = "set_1";
  if (args.widgetParameter === "rise") {
    event = isAfterHour(8) ? "rise_2" : "rise_1";
  } else if (isAfterHour(20)) {
    event = "set_2";
  }

  return await new Request(
    `https://sunsetbot.top/?query_id=${Math.floor(
      Math.random() * 10000000 + 1
    ).toString()}&intend=select_city&query_city=%E4%B8%8A%E6%B5%B7&event_date=None&event=${event}&times=None`
  ).loadJSON();
}

async function createWidget(data) {
  const widget = new ListWidget();

  addCenteredText(widget, data.quality_des, 16, true);
  widget.addSpacer(5);
  addCenteredText(widget, extractTimeInfo(data.table_content), 13, false);
  widget.addSpacer(5);
  addCenteredText(
    widget,
    `${data.local_quality.toFixed(3)} ${data.local_aod.toFixed(3)} (${
      data.aod_des
    })`,
    10,
    false
  );

  const refreshInterval = (30 + Math.round(10 * Math.random())) * 60 * 1000;
  widget.refreshAfterDate = new Date(Date.now() + refreshInterval);

  return widget;
}

function addCenteredText(widget, text, size, bold) {
  const textItem = widget.addText(text);
  textItem.centerAlignText();
  textItem.font = Font[bold ? "boldSystemFont" : "systemFont"](size);
}

function isAfterHour(num) {
  return new Date().getHours() >= num;
}

function extractTimeInfo(htmlString) {
  const match = htmlString.match(
    isAccessory()
      ? /(\d{2}-\d{2})<br>(\d{2}:\d{2}:\d{2})/
      : /(\d{4}-\d{2}-\d{2})<br>(\d{2}:\d{2}:\d{2})/
  );
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return "未知时间";
}

function isAccessory() {
  return !!config.widgetFamily?.startsWith?.("accessory");
}

// Main function
async function main() {
  const widget = await createWidget(await fetchData());

  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    widget.presentMedium();
  }

  Script.complete();
}

main();
