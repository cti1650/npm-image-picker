const getImageData = () => {
  const htmlToEle = (html) => {
    let ele = document.createElement('div');
    ele.innerHTML = html;
    return ele.childNodes[0];
  };
  const ImageSize = (url) => {
    let img = document.createElement('img');
    img.src = url;
    img.style.objectFit = 'contain';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.maxWidth = '200px';
    img.style.maxHeight = '200px';
    return img;
  };
  const makeThumbnail = (url) => {
    let img = document.createElement('img');
    img.src =
      'https://s.wordpress.com/mshots/v1/' + encodeURIComponent(url) + '?w=400';
    // img.src = 'http://mozshot.nemui.org/shot/large?' + encodeURIComponent(url);
    img.style.objectFit = 'contain';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.maxWidth = '400px';
    img.style.maxHeight = '400px';
    let div = document.createElement('div');
    div.className = 'w-full flex flex-col flex-wrap p-2';
    div.appendChild(img);
    return div;
  };

  let aTags = document.querySelectorAll('main section div.pr3 > a');
  aTags.forEach((a) => {
    fetch(a.href, {
      mode: 'cors',
    }).then((res) => {
      a.parentNode.parentNode.appendChild(makeThumbnail(a.href));
      res.text().then((text) => {
        let myArray = text.match(/<img.*?src="(.*?)".*?>/gm);
        let div = document.createElement('div');
        div.className = 'w-full flex flex-col flex-wrap p-2';
        let imgs = myArray.map((item) => {
          if (~item.indexOf('width:42px')) return;
          // if (~item.indexOf('svg')) return;
          // if (~item.indexOf('gzip')) return;
          let ele = htmlToEle(item);
          if (~ele.src.indexOf('avatar')) return;
          return ImageSize(ele.src);
        });
        if (imgs.length === 0) {
          let ele = document.createElement('div');
          ele.innerText = ' (Non Image)';
          a.parentNode.append(ele);
        } else {
          let ImageArr = imgs.map((item) => {
            if (!item) return;
            let ele = document.createElement('div');
            ele.style.maxWidth = '200px';
            ele.style.maxHeight = '200px';
            ele.style.width = 'auto';
            ele.style.height = 'auto';
            ele.appendChild(item);
            div.appendChild(ele);
            return ele;
          });
        }
        a.parentNode.parentNode.appendChild(div);
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
