/// <reference lib="webworker" />

import * as JSZip from 'jszip';

import { MessageIn, MessageOut } from '../models/messages';
import { DownloadVideoOptions } from '../models/download-video-options';



addEventListener('message', async (message: MessageIn.Root) => {
  console.log(message.data.downloadVideoOptions);
  const content = await download(
    message.data.downloadVideoOptions,
    (metadata) => postMessage(new MessageOut.Archiving(metadata)),
    (metadata) => postMessage(new MessageOut.Downloading(metadata))
  );

  postMessage(new MessageOut.Completed(content));
});




type OnUpdateCallback = (metadata: MessageOut.Metadata) => void;

function urlToPromise (url: string, progress: OnUpdateCallback): Promise<any> {
  return new Promise((resolve, reject) => {
    JSZipUtils.getBinaryContent(url, {
      callback: function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
      progress: (e) => progress({ percent: e.percent })
    });
  });
}

function download (videos: DownloadVideoOptions[], archiveCallback: OnUpdateCallback, downloadCallback: OnUpdateCallback): Promise<any> {
  const zip = JSZip();
  const folder = zip.folder('videos');

  videos.forEach(video => folder.file(video.fileName, urlToPromise(video.url, downloadCallback), {binary: true}));

  return zip.generateAsync({ type: 'blob' }, archiveCallback);
}



/********************************** JSZipUtils START *******************************************/


/*
*
* HOTFIX
* not compatible with web workers
*
* */

interface Callback {
  (err: any, data: any): void;
}
interface Progress {
  (options: MessageOut.Metadata): void;
}
interface Options {
  callback?: Callback;
  progress?: Progress;
}

interface JSZipUtils {
  getBinaryContent?: (path: string, options: Options | Callback) => Promise<any>;
  _getBinaryFromXHR?: (xhr: XMLHttpRequest) =>  any;
}
var JSZipUtils = {} as JSZipUtils;
// just use the responseText with xhr1, response with xhr2.
// The transformation doesn't throw away high-order byte (with responseText)
// because JSZip handles that case. If not used with JSZip, you may need to
// do it, see https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
JSZipUtils._getBinaryFromXHR = function (xhr) {
  // for xhr.responseText, the 0xFF mask is applied by JSZip
  return xhr.response || xhr.responseText;
};

// taken from jQuery
function createStandardXHR() {
  try {
    return new self.XMLHttpRequest();
  } catch( e ) {}
}

function createActiveXHR() {
  try {
    // @ts-ignore
    return new self.ActiveXObject("Microsoft.XMLHTTP");
  } catch( e ) {}
}

// Create the request object
// @ts-ignore
var createXHR = (typeof self !== "undefined" && self.ActiveXObject) ?
  /* Microsoft failed to properly
   * implement the XMLHttpRequest in IE7 (can't request local files),
   * so we use the ActiveXObject when it is available
   * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
   * we need a fallback.
   */
  function() {
    return createStandardXHR() || createActiveXHR();
  } :
  // For all other browsers, use the standard XMLHttpRequest object
  createStandardXHR;


/**
 * @param  {string} path    The path to the resource to GET.
 * @param  {function|{callback: function, progress: function}} options
 * @return {Promise|undefined} If no callback is passed then a promise is returned
 */
JSZipUtils.getBinaryContent = function (path, options) {
  var promise, resolve, reject;
  var callback;

  if (!options) {
    options = {};
  }

  // backward compatible callback
  if (typeof options === "function") {
    callback = options;
    options = {};
  } else if (typeof options.callback === 'function') {
    // callback inside options object
    callback = options.callback;
  }

  if (!callback && typeof Promise !== "undefined") {
    promise = new Promise(function (_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
  } else {
    resolve = function (data) { callback(null, data); };
    reject = function (err) { callback(err, null); };
  }

  /*
   * Here is the tricky part : getting the data.
   * In firefox/chrome/opera/... setting the mimeType to 'text/plain; charset=x-user-defined'
   * is enough, the result is in the standard xhr.responseText.
   * cf https://developer.mozilla.org/En/XMLHttpRequest/Using_XMLHttpRequest#Receiving_binary_data_in_older_browsers
   * In IE <= 9, we must use (the IE only) attribute responseBody
   * (for binary data, its content is different from responseText).
   * In IE 10, the 'charset=x-user-defined' trick doesn't work, only the
   * responseType will work :
   * http://msdn.microsoft.com/en-us/library/ie/hh673569%28v=vs.85%29.aspx#Binary_Object_upload_and_download
   *
   * I'd like to use jQuery to avoid this XHR madness, but it doesn't support
   * the responseType attribute : http://bugs.jquery.com/ticket/11461
   */
  try {
    var xhr = createXHR();

    xhr.open('GET', path, true);

    // recent browsers
    if ("responseType" in xhr) {
      xhr.responseType = "arraybuffer";
    }

    // older browser
    if(xhr.overrideMimeType) {
      xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }

    xhr.onreadystatechange = function (event) {
      // use `xhr` and not `this`... thanks IE
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          try {
            resolve(JSZipUtils._getBinaryFromXHR(xhr));
          } catch(err) {
            reject(new Error(err));
          }
        } else {
          reject(new Error("Ajax error for " + path + " : " + this.status + " " + this.statusText));
        }
      }
    };

    if('progress' in options) {
      xhr.onprogress = function(e) {
        // @ts-ignore
        options.progress({
            path: path,
            originalEvent: e,
            percent: e.loaded / e.total * 100,
            loaded: e.loaded,
            total: e.total
          });
      };
    }

    xhr.send();

  } catch (e) {
    reject(new Error(e), null);
  }

  // returns a promise or undefined depending on whether a callback was
  // provided
  return promise;
};

/********************************** JSZipUtils END *******************************************/
