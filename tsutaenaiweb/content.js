console.log("✅ content.js 已启动！当前 URL:", window.location.href);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "clearPageAndInsertContent") {
    console.log("收到消息，准备清空页面并加载新内容，URL:", request.url);

    // 向 background.js 发送请求，获取网页内容
    chrome.runtime.sendMessage({ action: "fetchPageContent", url: request.url }, response => {
      if (chrome.runtime.lastError) {
        console.error("消息传输错误:", chrome.runtime.lastError.message);
        sendResponse({ success: false });
        return;
      }

      if (response.success) {
        console.log("成功获取网页内容，开始替换页面内容");

        // 确保页面更新在消息发送后完成
        document.open();
        document.write(response.content);
        document.close();

        sendResponse({ success: true });
      } else {
        console.error("获取网页内容失败:", response.error);
        sendResponse({ success: false });
      }
    });

    return true; // 让 sendResponse 异步生效
  }
});
