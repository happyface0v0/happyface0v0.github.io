document.addEventListener('DOMContentLoaded', function () {
  const openUrlButton = document.getElementById('openUrlButton');
  openUrlButton.addEventListener('click', function () {
    const url = document.getElementById('url').value.trim();
    if (!url) {
      alert('请输入 URL');
      return;
    }

    // 获取当前活动标签页的 ID
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length === 0) {
        console.error('未找到活动标签页');
        return;
      }

      const tabId = tabs[0].id; // 获取标签页 ID

      // 向 content.js 发送消息
      chrome.tabs.sendMessage(tabId, { action: 'clearPageAndInsertContent', url: url }, function (response) {
        if (chrome.runtime.lastError) {
          console.error('发送消息失败:', chrome.runtime.lastError);
        } else if (response && response.success) {
          console.log('页面内容已插入');
        } else {
          console.error('加载页面失败:', response.error);
        }
      });
    });
  });
});
