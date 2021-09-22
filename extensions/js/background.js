const getImageData = () => {
  let aTags = document.querySelectorAll('main section div.pr3 > a');
  aTags.forEach((a) => {
    fetch(a.href, {
      mode: 'cors',
    }).then((res) => {
      res.text().then((text) => {
        var myArray = text.match(/<img.*?src="(.*?)".*?>/gm);
        if (myArray.length === 0) {
          let ele = document.createElement('div');
          ele.innerText = ' (Non Image)';
          a.parentNode.append(ele);
        } else {
          myArray.map((item) => {
            if (~item.indexOf('width:42px')) return;
            if (~item.indexOf('svg')) return;
            if (~item.indexOf('gzip')) return;
            let ele = document.createElement('div');
            ele.style.maxWidth = '80px';
            ele.style.maxHeight = '80px';
            ele.style.width = 'auto';
            ele.style.height = 'auto';
            ele.innerHTML = item;
            let img = ele.getElementsByTagName('img')[0];
            img.style.objectFit = 'contain';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.maxWidth = '80px';
            img.style.maxHeight = '80px';
            a.parentNode.append(ele);
          });
        }
      });
    });
  });
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'loading') {
  } else if (changeInfo.status == 'complete') {
    if (~tab.url.indexOf('https://www.npmjs.com/search?q=')) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: getImageData,
        },
        () => {}
      );
    }
  }
});
