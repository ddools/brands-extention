import ext from "./utils/ext";
import storage from "./utils/storage";

// var popup = document.getElementById("app");
// storage.get('color', function(resp) {
//   var color = resp.color;
//   if(color) {
//     popup.style.backgroundColor = color
//   }
// });

// var template = (data) => {
//   var json = JSON.stringify(data);
//   return (`
//   <div class="site-description">
//     <h3 class="title">${data.title}</h3>
//     <p class="description">${data.description}</p>
//     <a href="${data.url}" target="_blank" class="url">${data.url}</a>
//   </div>
//   <div class="action-container">
//     <button data-bookmark='${json}' id="save-btn" class="btn btn-primary">Save</button>
//   </div>
//   `);
// }
// var renderMessage = (message) => {
//   var displayContainer = document.getElementById("display-container");
//   displayContainer.innerHTML = `<p class='message'>${message}</p>`;
// }

// var renderBookmark = (data) => {
//   var displayContainer = document.getElementById("display-container")
//   if(data) {
//     var tmpl = template(data);
//     displayContainer.innerHTML = tmpl;  
//   } else {
//     renderMessage("Sorry, could not extract this page's title and URL")
//   }
// }

// ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   var activeTab = tabs[0];
//   chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
// });

// popup.addEventListener("click", function(e) {
//   if(e.target && e.target.matches("#save-btn")) {
//     e.preventDefault();
//     var data = e.target.getAttribute("data-bookmark");
//     ext.runtime.sendMessage({ action: "perform-save", data: data }, function(response) {
//       if(response && response.action === "saved") {
//         renderMessage("Your bookmark was saved successfully!");
//       } else {
//         renderMessage("Sorry, there was an error while saving your bookmark.");
//       }
//     })
//   }
// });

var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})

var previewSelect = document.querySelector("#previewSelect");
var previewValue = "true";

var environmentSelect = document.querySelector("#environmentSelect");
var environmentValue = "staging";

var trackingSelect = document.querySelector("#trackingSelect");
var trackingValue = "on";

var typeSelect = document.querySelector("#displayType");
var typeValue;

var bannerSelect = document.querySelector("#displayBanner");
var bannerValue = "noBanner";
var displayBannerContainer = document.getElementById("displayBannerContainer");

var haButton = document.querySelector(".js-ha");
var achButton = document.querySelector(".js-ach");

var tracking = 'on';

//listener for preview
previewSelect.addEventListener("change", function(e) {
  previewValue = document.querySelector('#previewSelect option:checked').value;
})

//listener for environment
environmentSelect.addEventListener("change", function(e) {
  environmentValue = document.querySelector('#environmentSelect option:checked').value;
})

//listener for tracking
trackingSelect.addEventListener("change", function(e) {
  trackingValue = document.querySelector('#trackingSelect option:checked').value;
})

//listener for display type
typeSelect.addEventListener("change", function(e) {
  typeValue = document.querySelector('#displayType option:checked').value;
  showHideBanner();

})
//hide banner type is display is SVG bar
function showHideBanner(){
  if(typeValue=="svgBanner1" || typeValue=="svgBanner2" || typeValue=="svgBanner3"){
    displayBannerContainer.style.display = "none";
  }
  else{
    displayBannerContainer.style.display = "block";
  }
}

// //listener for banner type
bannerSelect.addEventListener("change", function(e) {
  bannerValue = document.querySelector('#displayBanner option:checked').value;
})

// //Launch HA
haButton.addEventListener("click", function(e) {
  e.preventDefault();
  window.open('https://'+environmentValue+'.holidayautos.com?tracking='+trackingValue+'&displayType='+typeValue+'&displayBanner='+bannerValue+'&preview='+previewValue+'','_blank');
})

// //Launch ACH
achButton.addEventListener("click", function(e) {
  e.preventDefault();
  window.open('https://'+environmentValue+'.arguscarhire.com?tracking='+trackingValue+'&displayType='+typeValue+'&displayBanner='+bannerValue+'&preview='+previewValue+'','_blank');
})

//******************************************************************* */
var url,domain, tab, title;
function init(){
    chrome.tabs.query({currentWindow: true, active: true},function(tabs){
       url = tabs[0].url;
       title = tabs[0].title;
       tab = tabs[0];
       //Now that we have the data we can proceed and do something with it
       processTab();
    });

}

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }
  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];
  return hostname;
}
function extractRootDomain(url) {
  var domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain 
  if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
          //this is using a ccTLD
          domain = splitArr[arrLen - 3] + '.' + domain;
      }
  }
  return domain;
}

function processTab(){
    // Use url & tab as you like
    console.log(url);
    console.log(tab);
    
    domain = extractRootDomain(url);

    document.getElementById('pageTitle').innerHTML = title;
    document.getElementById('pageUrl').innerHTML = domain;
    console.log(document.body.classList.contains('near-black'));
}
init();
