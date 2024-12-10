document.addEventListener('DOMContentLoaded', function() {
  fetch('waka_data.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('waka-container');
      if (data.length === 0) {
        container.innerHTML = '<p>和歌データがありません。</p>';
        return;
      }
      
      data.forEach(waka => {
        const item = document.createElement('div');
        item.classList.add('waka-item');

        // 高亮显示“決め字”部分
        const firstHalf = waka.first_half.replace(waka.kimeji, `<strong class="kimeji">${waka.kimeji}</strong>`);
        const secondHalf = waka.second_half.replace(waka.kimeji, `<strong class="kimeji">${waka.kimeji}</strong>`);

        item.innerHTML = `
          <div class="waka-part">${firstHalf}</div>
          <div class="waka-part">${secondHalf}</div>
        `;

        container.appendChild(item);
      });
    })
    .catch(error => {
      console.error('データの読み込みに失敗しました:', error);
      document.getElementById('waka-container').innerHTML = '<p>和歌データの読み込みに失敗しました。</p>';
    });
});
