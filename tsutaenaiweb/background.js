console.log("✅ background.js 已启动！");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchPageContent") {
    console.log("📡 收到获取网页请求:", request.url);

    fetch(request.url)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP 错误 ${response.status}`);
        return response.text();
      })
      .then(data => {
        // 🔄 修正相对路径
        const baseURL = new URL(request.url);
        
        // 使用正则和回调来处理不同的资源
        const updatedHTML = data.replace(/(src|href)=["'](?!https?:\/\/|\/\/)([^"']+)["']/g, (match, attr, path) => {
          try {
            const absolutePath = new URL(path, baseURL).href;
            return `${attr}="${absolutePath}"`;
          } catch (e) {
            console.error(`路径转换错误: ${path}`, e);
            return match;
          }
        });

        console.log("✅ 获取网页成功，返回修改后的 HTML");
        sendResponse({ success: true, content: updatedHTML });
      })
      .catch(error => {
        console.error("❌ 获取网页失败:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // 让 sendResponse 继续有效，支持异步返回数据
  }
});
