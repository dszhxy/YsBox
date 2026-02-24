import {Crypto, cheerio} from "assets://js/lib/cat.js";
import './pako.min.js';
import './htmlq.js';

// ========== 用户代理常量 ==========
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';
const PC_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36';
const UA = 'Mozilla/5.0';
const UC_UA = 'Mozilla/5.0 (Linux; U; Android 9; zh-CN; MI 9 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.5.5.1035 Mobile Safari/537.36';
const IOS_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

// ========== 从 utils.js 移入的常量 ==========
const charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
const deviceBrands = ['Huawei', 'Xiaomi'];
const deviceModels = [
    ['MHA-AL00', 'HUAWEI Mate 9', 'MHA-TL00', 'HUAWEI Mate 9', 'LON-AL00', 'HUAWEI Mate 9 Pro', 'ALP-AL00', 'HUAWEI Mate 10', 'ALP-TL00', 'HUAWEI Mate 10', 'BLA-AL00', 'HUAWEI Mate 10 Pro', 'BLA-TL00', 'HUAWEI Mate 10 Pro', 'HMA-AL00', 'HUAWEI Mate 20', 'HMA-TL00', 'HUAWEI Mate 20', 'LYA-AL00', 'HUAWEI Mate 20 Pro', 'LYA-AL10', 'HUAWEI Mate 20 Pro', 'LYA-TL00', 'HUAWEI Mate 20 Pro', 'EVR-AL00', 'HUAWEI Mate 20 X', 'EVR-TL00', 'HUAWEI Mate 20 X', 'EVR-AN00', 'HUAWEI Mate 20 X', 'TAS-AL00', 'HUAWEI Mate 30', 'TAS-TL00', 'HUAWEI Mate 30', 'TAS-AN00', 'HUAWEI Mate 30', 'TAS-TN00', 'HUAWEI Mate 30', 'LIO-AL00', 'HUAWEI Mate 30 Pro', 'LIO-TL00', 'HUAWEI Mate 30 Pro', 'LIO-AN00', 'HUAWEI Mate 30 Pro', 'LIO-TN00', 'HUAWEI Mate 30 Pro', 'LIO-AN00m', 'HUAWEI Mate 30E Pro', 'OCE-AN10', 'HUAWEI Mate 40', 'OCE-AN50', 'HUAWEI Mate 40E', 'OCE-AL50', 'HUAWEI Mate 40E', 'NOH-AN00', 'HUAWEI Mate 40 Pro', 'NOH-AN01', 'HUAWEI Mate 40 Pro', 'NOH-AL00', 'HUAWEI Mate 40 Pro', 'NOH-AL10', 'HUAWEI Mate 40 Pro', 'NOH-AN50', 'HUAWEI Mate 40E Pro', 'NOP-AN00', 'HUAWEI Mate 40 Pro', 'CET-AL00', 'HUAWEI Mate 50', 'CET-AL60', 'HUAWEI Mate 50E', 'DCO-AL00', 'HUAWEI Mate 50 Pro', 'TAH-AN00', 'HUAWEI Mate X', 'TAH-AN00m', 'HUAWEI Mate Xs', 'TET-AN00', 'HUAWEI Mate X2', 'TET-AN10', 'HUAWEI Mate X2', 'TET-AN50', 'HUAWEI Mate X2', 'TET-AL00', 'HUAWEI Mate X2', 'PAL-AL00', 'HUAWEI Mate Xs 2', 'PAL-AL10', 'HUAWEI Mate Xs 2', 'EVA-AL00', 'HUAWEI P9', 'EVA-AL10', 'HUAWEI P9', 'EVA-TL00', 'HUAWEI P9', 'EVA-DL00', 'HUAWEI P9', 'EVA-CL00', 'HUAWEI P9', 'VIE-AL10', 'HUAWEI P9 Plus', 'VTR-AL00', 'HUAWEI P10', 'VTR-TL00', 'HUAWEI P10', 'VKY-AL00', 'HUAWEI P10 Plus', 'VKY-TL00', 'HUAWEI P10 Plus', 'EML-AL00', 'HUAWEI P20', 'EML-TL00', 'HUAWEI P20', 'CLT-AL00', 'HUAWEI P20 Pro', 'CLT-AL01', 'HUAWEI P20 Pro', 'CLT-AL00l', 'HUAWEI P20 Pro', 'CLT-TL00', 'HUAWEI P20 Pro', 'CLT-TL01', 'HUAWEI P20 Pro', 'ELE-AL00', 'HUAWEI P30', 'ELE-TL00', 'HUAWEI P30', 'VOG-AL00', 'HUAWEI P30 Pro', 'VOG-AL10', 'HUAWEI P30 Pro', 'VOG-TL00', 'HUAWEI P30 Pro', 'ANA-AL00', 'HUAWEI P40', 'ANA-AN00', 'HUAWEI P40', 'ANA-TN00', 'HUAWEI P40', 'ELS-AN00', 'HUAWEI P40 Pro', 'ELS-TN00', 'HUAWEI P40 Pro', 'ELS-AN10', 'HUAWEI P40 Pro', 'ELS-TN10', 'HUAWEI P40 Pro', 'ABR-AL00', 'HUAWEI P50', 'ABR-AL80', 'HUAWEI P50', 'ABR-AL60', 'HUAWEI P50E', 'ABR-AL90', 'HUAWEI P50E', 'JAD-AL00', 'HUAWEI P50 Pro', 'JAD-AL80', 'HUAWEI P50 Pro', 'JAD-AL50', 'HUAWEI P50 Pro', 'JAD-AL60', 'HUAWEI P50 Pro', 'BAL-AL00', 'HUAWEI P50 Pocket', 'BAL-AL60', 'HUAWEI Pocket S', 'PIC-AL00', 'HUAWEI nova 2', 'PIC-TL00', 'HUAWEI nova 2', 'BAC-AL00', 'HUAWEI nova 2 Plus', 'BAC-TL00', 'HUAWEI nova 2 Plus', 'HWI-AL00', 'HUAWEI nova 2s', 'HWI-TL00', 'HUAWEI nova 2s', 'ANE-AL00', 'HUAWEI nova 3e', 'ANE-TL00', 'HUAWEI nova 3e', 'PAR-AL00', 'HUAWEI nova 3', 'PAR-TL00', 'HUAWEI nova 3', 'INE-AL00', 'HUAWEI nova 3i', 'INE-TL00', 'HUAWEI nova 3i', 'VCE-AL00', 'HUAWEI nova 4', 'VCE-TL00', 'HUAWEI nova 4', 'MAR-AL00', 'HUAWEI nova 4e', 'MAR-TL00', 'HUAWEI nova 4e', 'SEA-AL00', 'HUAWEI nova 5', 'SEA-TL00', 'HUAWEI nova 5', 'SEA-AL10', 'HUAWEI nova 5 Pro', 'SEA-TL10', 'HUAWEI nova 5 Pro', 'GLK-AL00', 'HUAWEI nova 5i', 'GLK-TL00', 'HUAWEI nova 5i', 'GLK-LX1U', 'HUAWEI nova 5i', 'SPN-TL00', 'HUAWEI nova 5i Pro', 'SPN-AL00', 'HUAWEI nova 5z', 'WLZ-AL10', 'HUAWEI nova 6', 'WLZ-AN00', 'HUAWEI nova 6', 'JNY-AL10', 'HUAWEI nova 6 SE', 'JNY-TL10', 'HUAWEI nova 6 SE', 'JEF-AN00', 'HUAWEI nova 7', 'JEF-AN20', 'HUAWEI nova 7', 'JEF-TN00', 'HUAWEI nova 7', 'JEF-TN20', 'HUAWEI nova 7', 'JER-AN10', 'HUAWEI nova 7 Pro', 'JER-AN20', 'HUAWEI nova 7 Pro', 'JER-TN10', 'HUAWEI nova 7 Pro', 'JER-TN20', 'HUAWEI nova 7 Pro', 'CDY-AN00', 'HUAWEI nova 7 SE', 'CDY-AN20', 'HUAWEI nova 7 SE', 'CDY-TN00', 'HUAWEI nova 7 SE', 'CDY-TN20', 'HUAWEI nova 7 SE', 'ANG-AN00', 'HUAWEI nova 8', 'BRQ-AN00', 'HUAWEI nova 8 Pro', 'BRQ-AL00', 'HUAWEI nova 8 Pro', 'JSC-AN00', 'HUAWEI nova 8 SE', 'JSC-TN00', 'HUAWEI nova 8 SE', 'JSC-AL50', 'HUAWEI nova 8 SE', 'NAM-AL00', 'HUAWEI nova 9', 'RTE-AL00', 'HUAWEI nova 9 Pro', 'JLN-AL00', 'HUAWEI nova 9 SE', 'NCO-AL00', 'HUAWEI nova 10', 'GLA-AL00', 'HUAWEI nova 10 Pro', 'CHA-AL80', 'HUAWEI nova 10z'],
    ['M2001J2C', 'Xiaomi 10', 'M2001J2G', 'Xiaomi 10', 'M2001J2I', 'Xiaomi 10', 'M2011K2C', 'Xiaomi 11', 'M2011K2G', 'Xiaomi 11', '2201123C', 'Xiaomi 12', '2201123G', 'Xiaomi 12', '2112123AC', 'Xiaomi 12X', '2112123AG', 'Xiaomi 12X', '2201122C', 'Xiaomi 12 Pro', '2201122G', 'Xiaomi 12 Pro'],
];

// ========== T3 环境兼容函数 ==========

/**
 * URL 连接函数（T3环境注入）
 * @param {string} from - 基础URL
 * @param {string} to - 相对路径
 * @returns {string} 完整的URL
 */
if (typeof joinUrl !== 'function') {
    globalThis.joinUrl = (from, to) => {
        const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
        if (resolvedUrl.protocol === 'resolve:') {
            const {pathname, search, hash} = resolvedUrl;
            return pathname + search + hash;
        }
        return resolvedUrl.href;
    };
}

/**
 * URL拼接辅助函数
 * @param {string} fromPath - 基础路径
 * @param {string} nowPath - 当前路径
 * @returns {string} 拼接后的完整URL
 */
function urljoin(fromPath, nowPath) {
    fromPath = fromPath || '';
    nowPath = nowPath || '';
    return joinUrl(fromPath, nowPath);
}

function window_b64() {
    let b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function btoa(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += b64map.charAt(c1 >> 2);
                out += b64map.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += b64map.charAt(c1 >> 2);
                out += b64map.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += b64map.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += b64map.charAt(c1 >> 2);
            out += b64map.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += b64map.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += b64map.charAt(c3 & 0x3F);
        }
        return out;
    }

    function atob(str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1) break;
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1) break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61) return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1) break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1) break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }

    return {
        atob,
        btoa
    }
}
function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
                break;
            case 14:
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(
                    ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
                );
                break;
        }
    }
    return out;
}

if (typeof atob !== "function" || typeof btoa !== "function") {
    console.log("环境不支持Base64，添加polyfill...");
    var { atob, btoa } = window_b64();
    console.log("Base64 polyfill添加完成");
}
/**
 * gzip压缩base64|压缩率80%+
 * @param str
 * @returns {string}
 */
function gzip(str) {
    let arr = pako.gzip(str, {
        // to: 'string'
    });
    return uint8ArrayToBase64(arr)
}

/**
 * gzip解压base64数据
 * @param b64Data
 * @returns {string}
 **
function ungzip(b64Data) {
    let strData = atob(b64Data);
    const charData = strData.split('').map(function (x) {
        return x.charCodeAt(0);
    });
    const binData = new Uint8Array(charData);
    const data = pako.inflate(binData);
    return Utf8ArrayToStr(data);
}

/**
 * gzip解压base64数据
 * @param b64Data
 * @returns {string}
 **/
function ungzip(b64Data) {
    try {
        const strData = atob(b64Data);
        const charCodes = new Uint8Array(strData.length);
        for (let i = 0; i < strData.length; i++) {
            charCodes[i] = strData.charCodeAt(i);
        }
        
        const data = pako.inflate(charCodes);
        return Utf8ArrayToStr(data);
    } catch (error) {
        console.error('Gzip解压失败:', error);
        return '';
    }
}

// ========== 网络请求函数 ==========

/**
 * 清理用户代理头
 * @param {Object} headers - 请求头对象
 * @returns {Object} 清理后的请求头对象
 */
function sanitizeUserAgent(headers) {
    if (!headers) {
        return headers;
    }
    const keys = Object.keys(headers);
    for (const key of keys) {
        if (key.toLowerCase() === 'user-agent' && headers[key] === 'RemoveUserAgent') {
            delete headers[key];
            break;
        }
    }
    return headers;
}

/**
 * 网络请求函数（封装T3环境的req函数）- 异步增强版
 * @param {string} url - 请求URL
 * @param {Object} obj - 请求配置参数
 * @returns {Promise<string>} 请求返回的内容
 */
async function request(url, obj) {
    if (!obj) {
        obj = {
            headers: {'user-agent': MOBILE_UA},
        }
    }
    // 清理用户代理
    obj.headers = sanitizeUserAgent(obj.headers);
    
    try {
        const result = await req(url, obj);
        return result.content;
    } catch (e) {
        console.error(`请求${url}错误:${e.message}`);
        return ''
    }
}

/**
 * 请求HTML内容
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise<string>} HTML内容
 */
async function requestHtml(url, options) {
    try {
        let html = (await req(url, options)).content;
        return html;
    } catch (e) {
        console.error(`requestHtml error:${e.message}`);
        return '';
    }
}

/**
 * 请求JSON数据
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} JSON对象
 */
async function requestJson(url, options) {
    try {
        let html = (await req(url, options)).content;
        return JSON.parse(html);
    } catch (e) {
        console.error(`requestJson error:${e.message}`);
        return {};
    }
}

/**
 * 获取公共IP地址
 * @returns {Promise<string>} IP地址
 */
async function getPublicIp() {
    let ip_obj = await requestJson('http://httpbin.org/ip');
    return ip_obj.origin || '';
}

/**
 * 通用HTTP请求函数
 * @param {string|Object} config - 请求配置或URL
 * @returns {Promise<Object>} 响应对象
 */
async function getHtml(config) {
    try {
        const cfg = {
            url: typeof config === "string" ? config : config.url,
            method: (typeof config === "object" ? config.method : null) || 'GET',
            headers: (typeof config === "object" ? config.headers : null) || {'User-Agent': PC_UA},
            data: (typeof config === "object" ? config.data : null) || '',
            responseType: (typeof config === "object" ? config.responseType : null) || ''
        };
        cfg.headers = sanitizeUserAgent(cfg.headers);
        return await axios.request(cfg);
    } catch (e) {
        return e.response || {};
    }
}

/**
 * 简化请求函数
 * @param {string} reqUrl - 请求URL
 * @param {string} mt - 请求方法
 * @param {Object} headers - 请求头
 * @param {any} data - 请求数据
 * @returns {Promise<any>} 响应数据
 */
async function req_(reqUrl, mt, headers, data) {
    let config = {
        method: mt || 'GET',
        url: reqUrl,
        headers: headers || {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36 QSTAPP/1.6.9 Html5Plus/1.0',
        },
        data: data || '',
    };
    config.headers = sanitizeUserAgent(config.headers);
    let res = await axios.request(config);
    return res.data;
}

/**
 * 带编码转换的请求函数
 * @param {string} reqUrl - 请求URL
 * @param {string} mt - 请求方法
 * @param {Object} headers - 请求头
 * @param {string} encoding - 编码格式
 * @param {any} data - 请求数据
 * @returns {Promise<any>} 响应数据
 */
async function req_encoding(reqUrl, mt, headers, encoding, data) {
    let config = {
        method: mt || 'GET',
        url: reqUrl,
        headers: headers || {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36 QSTAPP/1.6.9 Html5Plus/1.0',
        },
        data: data || '',
        responseType: 'arraybuffer'
    };
    config.headers = sanitizeUserAgent(config.headers);
    let res = await axios.request(config);
    if (encoding) {
        res.data = iconv.decode(res.data, encoding);
    }
    return res.data;
}

/**
 * 代理请求函数
 * @param {string} reqUrl - 请求URL
 * @param {string} mt - 请求方法
 * @param {Object} headers - 请求头
 * @param {any} data - 请求数据
 * @returns {Promise<any>} 响应数据
 */
async function req_proxy(reqUrl, mt, headers, data) {
    let config = {
        method: mt || 'GET',
        url: reqUrl,
        headers: headers || {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1931 Build/PQ3A.190605.05081124; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36 QSTAPP/1.6.9 Html5Plus/1.0',
        },
        proxy: {
            protocol: 'http',
            host: '127.0.0.1',
            port: "7890"
        }
    };
    config.headers = sanitizeUserAgent(config.headers);
    if (data) {
        config.data = data;
    }
    let res = await axios.request(config);
    return res.data;
}


/**
 * 加载HTML并返回cheerio对象
 * @param {string} html - HTML字符串
 * @returns {Promise<Object>} cheerio对象
 */
async function $css(html) {
    return cheerio.load(html)
}

// ========== 解析函数 ==========

/**
 * 解析视频列表
 * @param {Object} $ - cheerio对象
 * @param {string} host - 主机地址
 * @param {Object} listItems - cheerio选择的列表项
 * @returns {Array} 视频信息数组
 */
function parseList($, host, listItems) {
    const d = [];

    listItems.each((index, element) => {
        const item = $(element);

        // 提取数据
        const vod_name = item.find('a').attr('title');
        const vod_id = urljoin(host, item.find('a').attr('href'));
        const vod_pic = item.find('.stui-vodlist__thumb').attr('data-original');
        const vod_remarks = item.find('.pic-text').text().trim(); // 使用.text()而不是.attr()

        d.push({
            vod_name,
            vod_id,
            vod_pic,
            vod_remarks
        });
    });
    return d
}

/**
 * 解析视频详情页
 * @param {Object} $ - cheerio对象
 * @param {string} host - 主机地址
 * @param {string} vod_id - 视频ID
 * @returns {Object} 视频详情对象
 */
function parseDetail($, host, vod_id) {
    const tabs = [];
    const lists = [];
    // 获取线路名称列表
    $('.nav-tabs li').each((index, element) => {
        const item = $(element);
        const tab_name = item.find('a').text().replace(/\s/g, '');
        tabs.push(tab_name);
    });
    // 循环每个线路，构造最终播放列表
    $('.tab-content .stui-content__playlist').each((index, element) => {
        const item = $(element);
        const list1 = [];
        item.find('li').each((index1, element1) => {
            const item1 = $(element1);
            const title = item1.find('a').text().replace(/\s/g, '');
            const href = urljoin(host, item1.find('a').attr('href'));
            list1.push(`${title}$${href}`);
        });
        lists.push(list1.join('#'));
    });

    let vod = {
        vod_id: vod_id,
        vod_name: $('.stui-content__thumb a').attr('title'),
        type_name: $('.stui-content__detail p:eq(1) a:eq(0)').text().replace(/\s/g, ''),
        vod_pic: $('.stui-vodlist__thumb img').attr('data-original').replace(/\s/g, ''),
        vod_content: $('.stui-content__detail p:eq(4)').text().replace(/\s/g, '').slice(0, -2),
        vod_play_from: tabs.join('$$$'),
        vod_play_url: lists.join('$$$'),
    };
    return vod;
}

/**
 * 判断URL是否需要解析（是否为大厂视频链接）
 * @param {string} url - 视频URL
 * @returns {number} 1需要解析，0不需要解析
 */
function tellIsJx(url) {
    // 是否大厂
    const isDc = function (vipUrl) {
        let flag = new RegExp('qq\.com|iqiyi\.com|youku\.com|mgtv\.com|bilibili\.com|sohu\.com|ixigua\.com|pptv\.com|miguvideo\.com|le\.com|1905\.com|fun\.tv');
        return flag.test(vipUrl);
    }
    try {
        let is_vip = !/\.(m3u8|mp4|m4a)$/.test(url.split('?')[0]) && isDc(url);
        return is_vip ? 1 : 0
    } catch (e) {
        return 1
    }
}

// ========== 加密解密函数 ==========

/**
 * Base64编码
 * @param {string} text - 要编码的文本
 * @returns {string} Base64编码后的字符串
 */
function base64Encode(text) {
    return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(text));
}

/**
 * Base64解码
 * @param {string} text - Base64编码的文本
 * @returns {string} 解码后的原始文本
 */
function base64Decode(text) {
    return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text));
}

/**
 * 懒解析函数（处理加密的视频链接）
 * @param {string} input - 输入URL
 * @returns {Promise<Object>} 解析结果对象
 */
async function lazy(input) {
    const result = {
        parse: 1,
        url: input,
    };
    // console.log('base64Encode:',base64Encode(JSON.stringify(result)));
    try {
        let html = await request(input);
        let hconf = html.match(/r player_.*?=(.*?)</)[1];
        let json = JSON.parse(hconf);
        let url = json.url;
        if (json.encrypt == '1') {
            url = unescape(url);
        } else if (json.encrypt == '2') {
            url = unescape(base64Decode(url));
        }
        if (/\.(m3u8|mp4|m4a|mp3)/.test(url)) {
            input = {
                parse: 0,
                jx: 0,
                url: url,
            };
        } else {
            input = url && url.startsWith('http') && tellIsJx(url) ? {parse: 0, jx: 1, url: url} :
                result;
        }
        return input
    } catch (e) {
        console.log(`lazy执行发生错误: ${e.message}`);
        return result
    }
}

// ========== 从 utils.js 移入的函数 ==========

/**
 * 判断是否为字幕文件格式
 * @param {string} ext - 文件扩展名
 * @returns {boolean} 是否为字幕文件
 */
function isSub(ext) {
    return ext === "srt" || ext === "ass" || ext === "ssa";
}

/**
 * 判断字符串是否为数字
 * @param {string} str - 输入字符串
 * @returns {boolean} 是否为数字
 */
function isNumeric(str) {
    return !isNaN(parseInt(str));
}

/**
 * 格式化文件大小
 * @param {number} size - 文件大小（字节）
 * @returns {string} 格式化后的文件大小字符串
 */
function getSize(size) {
    if (size <= 0) return "";
    if (size > 1024 * 1024 * 1024 * 1024.0) {
        size /= (1024 * 1024 * 1024 * 1024.0);
        return size.toFixed(2) + "TB";
    } else if (size > 1024 * 1024 * 1024.0) {
        size /= (1024 * 1024 * 1024.0);
        return size.toFixed(2) + "GB";
    } else if (size > 1024 * 1024.0) {
        size /= (1024 * 1024.0);
        return size.toFixed(2) + "MB";
    } else {
        size /= 1024.0;
        return size.toFixed(2) + "KB";
    }
}

/**
 * 移除文件扩展名
 * @param {string} text - 文件名
 * @returns {string} 移除扩展名后的文件名
 */
function removeExt(text) {
    return text.indexOf('.') > -1 ? text.substring(0, text.lastIndexOf(".")) : text;
}

/**
 * 日志输出函数
 * @param {string} str - 要输出的日志信息
 * @returns {Promise<void>}
 */
async function log(str) {
    console.debug(str);
}

/**
 * 判断是否为视频格式URL
 * @param {string} url - URL地址
 * @returns {boolean} 是否为视频格式
 */
function isVideoFormat(url) {
    var RULE = /http((?!http).){12,}?\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg|m4a|mp3)\?.*|http((?!http).){12,}\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg|m4a|mp3)|http((?!http).)*?video\/tos*/;
    if (url.indexOf("url=http") > -1 || url.indexOf(".js") > -1 || url.indexOf(".css") > -1 || url.indexOf(".html") > -1) {
        return false;
    }
    return RULE.test(url);
}

/**
 * JSON解析函数（用于解析播放数据）
 * @param {string} input - 输入URL
 * @param {string} json - JSON字符串
 * @returns {Object|null} 解析后的任务结果对象或null
 */
function jsonParse(input, json) {
    var jsonPlayData = JSON.parse(json);
    var url = jsonPlayData.url;
    if (url.startsWith("//")) {
        url = "https:" + url;
    }
    if (!url.startsWith("http")) {
        return null;
    }
    if (url === input) {
        if (!isVideoFormat(url)) {
            return null;
        }
    }
    var headers = {};
    var ua = jsonPlayData["user-agent"] || "";
    if (ua.trim().length > 0) {
        headers["User-Agent"] = " " + ua;
    }
    var referer = jsonPlayData.referer || "";
    if (referer.trim().length > 0) {
        headers["Referer"] = " " + referer;
    }
    var taskResult = {
        header: headers, url: url
    };
    return taskResult;
}

/**
 * 递归调试输出函数
 * @param {Object} obj - 要调试的对象
 */
function debug(obj) {
    for (var a in obj) {
        if (typeof (obj[a]) == "object") {
            debug(obj[a]); //递归遍历
        } else {
            console.debug(a + "=" + obj[a]);
        }
    }
}

/**
 * 对象转换为URL参数字符串
 * @param {Object} params - 参数对象
 * @param {boolean} isBase64Encode - 是否进行Base64编码
 * @returns {string} URL参数字符串
 */
function objectToStr(params = null, isBase64Encode = false) {
    let params_str_list = []
    if (params !== null) {
        for (const key of Object.keys(params)) {
            if (isBase64Encode) {
                params_str_list.push(`${key}=${encodeURIComponent(params[key])}`)
            } else {
                params_str_list.push(`${key}=${params[key]}`)
            }

        }
    }

    return params_str_list.join("&")
}

/**
 * 同步休眠函数
 * @param {number} delay - 休眠时间（秒）
 */
function sleep(delay) {
    const start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay * 1000) {
        continue;
    }
}

/**
 * 使用正则表达式提取字符串
 * @param {RegExp} pattern - 正则表达式
 * @param {string} str - 原始字符串
 * @returns {string} 提取到的字符串
 */
function getStrByRegex(pattern, str) {
    let matcher = pattern.exec(str);
    if (matcher !== null) {
        if (matcher.length >= 1) {
            if (matcher.length >= 1) return matcher[1]
        }
    }
    return "";
}

/**
 * 使用正则表达式提取字符串（有默认值）
 * @param {RegExp} pattern - 正则表达式
 * @param {string} str - 原始字符串
 * @returns {string} 提取到的字符串或原始字符串
 */
function getStrByRegexDefault(pattern, str) {
    let matcher = pattern.exec(str);
    if (matcher !== null) {
        if (matcher.length >= 1) {
            if (matcher.length >= 1) return matcher[1]
        }
    }
    return str;
}

/**
 * 反转义字符串
 * @param {string} code - 需要反转义的字符串
 * @returns {string} 反转义后的字符串
 */
function unescape(code) {
    return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
}

/**
 * 获取URL的主机部分
 * @param {string} url - 完整URL
 * @returns {string} 主机地址
 */
function getHost(url) {
    let url_list = url.split("/")
    return url_list[0] + "//" + url_list[2]
}

/**
 * 去除字符串两端的引号
 * @param {string} str - 原始字符串
 * @returns {string} 去除引号后的字符串
 */
function unquote(str) {
    return str.replace(/^"(.*)"$/, '$1');
}

/**
 * MD5编码
 * @param {string} text - 要编码的文本
 * @returns {string} MD5哈希值
 */
function md5Encode(text) {
    return Crypto.MD5(Crypto.enc.Utf8.parse(text)).toString();
}

/**
 * 生成UUID
 * @returns {string} 生成的UUID字符串
 */
function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }) + "-" + new Date().getTime().toString(16)

}

/**
 * 对象列表转换为特定属性的字符串
 * @param {Array} list - 对象列表
 * @param {string} key - 要提取的属性名
 * @param {string} split_value - 分隔符，默认为"*"
 * @returns {string} 拼接后的字符串
 */
function objToList(list, key, split_value = "*") {
    let value_list = []
    for (const dic of list) {
        value_list.push(dic[key])
    }
    return value_list.join(split_value)
}

/**
 * 获取对象的所有属性和方法
 * @param {Object} obj - 要检查的对象
 * @returns {string} 对象属性和方法的字符串描述
 */
function getPropertiesAndMethods(obj) {
    let str = ""
    for (let key in obj) {
        if (typeof obj[key] === 'function') {
            str = str + "方法名:" + key + '()' + "\n";
        } else {
            str = str + "属性名:" + (key + ': ' + obj[key]) + "\n";
        }
    }
    return str
}

/**
 * 格式化播放URL中的名称
 * @param {string} src - 源字符串
 * @param {string} name - 原始名称
 * @returns {string} 格式化后的名称
 */
function formatPlayUrl(src, name) {
    return name
        .trim()
        .replaceAll(src, '')
        .replace(/<|>|《|》/g, '')
        .replace(/\$|#/g, ' ')
        .trim();
}

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机整数
 */
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成随机设备信息
 * @returns {Object} 设备信息对象
 */
function randDevice() {
    let brandIdx = rand(0, deviceBrands.length - 1);
    let brand = deviceBrands[brandIdx];
    let modelIdx = rand(0, deviceModels[brandIdx].length / 2 - 1);
    let model = deviceModels[brandIdx][modelIdx * 2 + 1];
    let release = rand(8, 13);
    let buildId = randStr(3, false).toUpperCase() + rand(11, 99) + randStr(1, false).toUpperCase();
    return {
        brand: brand,
        model: model,
        release: release,
        buildId: buildId,
    };
}

/**
 * 生成随机字符串
 * @param {number} len - 字符串长度
 * @param {boolean} withNum - 是否包含数字
 * @param {boolean} onlyNum - 是否只包含数字
 * @returns {string} 随机字符串
 */
function randStr(len, withNum, onlyNum) {
    let _str = '';
    let containsNum = withNum === undefined ? true : withNum;
    for (let i = 0; i < len; i++) {
        let idx = onlyNum ? rand(charStr.length - 10, charStr.length - 1) : rand(0, containsNum ? charStr.length - 1 : charStr.length - 11);
        _str += charStr[idx];
    }
    return _str;
}

/**
 * 生成带有ID的随机设备信息
 * @param {number} len - ID长度
 * @returns {Object} 带有ID的设备信息对象
 */
function randDeviceWithId(len) {
    let device = randDevice();
    device['id'] = randStr(len);
    return device;
}

/**
 * 生成随机UUID
 * @returns {string} 随机UUID字符串
 */
function randUUID() {
    return randStr(8).toLowerCase() + '-' + randStr(4).toLowerCase() + '-' + randStr(4).toLowerCase() + '-' + randStr(4).toLowerCase() + '-' + randStr(12).toLowerCase();
}

/**
 * 格式化URL（修复双斜杠问题）
 * @param {string} url - 原始URL
 * @returns {string} 格式化后的URL
 */
function formatUrl(url) {
    if (url.indexOf("https:////") > -1) {
        url = "https://" + url.replaceAll("https:////", "")
    }
    if (url.indexOf("http:////") > -1) {
        url = "http://" + url.replaceAll("http:////", "")
    }
    return url
}

/**
 * 格式化HTML内容（移除HTML标签和转义字符）
 * @param {string} content - HTML内容
 * @returns {string} 纯文本内容
 */
function formatContent(content) {
    return content.replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '\"')
        .replaceAll(/<\/?[^>]+>/g, '');
}

/**
 * 字符串相似度匹配（最长公共子序列）
 * @param {string} str1 - 第一个字符串
 * @param {string} str2 - 第二个字符串
 * @returns {Object} 匹配结果对象
 */
function lcs(str1, str2) {
    if (!str1 || !str2) {
        return {
            length: 0,
            sequence: '',
            offset: 0,
        };
    }

    var sequence = '';
    var str1Length = str1.length;
    var str2Length = str2.length;
    var num = new Array(str1Length);
    var maxlen = 0;
    var lastSubsBegin = 0;

    for (var i = 0; i < str1Length; i++) {
        var subArray = new Array(str2Length);
        for (var j = 0; j < str2Length; j++) {
            subArray[j] = 0;
        }
        num[i] = subArray;
    }
    var thisSubsBegin = null;
    for (i = 0; i < str1Length; i++) {
        for (j = 0; j < str2Length; j++) {
            if (str1[i] !== str2[j]) {
                num[i][j] = 0;
            } else {
                if (i === 0 || j === 0) {
                    num[i][j] = 1;
                } else {
                    num[i][j] = 1 + num[i - 1][j - 1];
                }

                if (num[i][j] > maxlen) {
                    maxlen = num[i][j];
                    thisSubsBegin = i - num[i][j] + 1;
                    if (lastSubsBegin === thisSubsBegin) {
                        // if the current LCS is the same as the last time this block ran
                        sequence += str1[i];
                    } else {
                        // this block resets the string builder if a different LCS is found
                        lastSubsBegin = thisSubsBegin;
                        sequence = ''; // clear it
                        sequence += str1.substr(lastSubsBegin, i + 1 - lastSubsBegin);
                    }
                }
            }
        }
    }
    return {
        length: maxlen,
        sequence: sequence,
        offset: thisSubsBegin,
    };
}

/**
 * 查找数组中特定值的所有索引
 * @param {Array} arr - 要搜索的数组
 * @param {*} value - 要查找的值
 * @returns {Array} 所有匹配的索引数组
 */
function findAllIndexes(arr, value) {
    const indexes = arr.map((item, index) => index).filter(index => arr[index] === value);
    return indexes;
}

// ========== 导出所有函数和常量 ==========
export {
    // 原有函数
    urljoin,
    request,
    $css,
    parseList,
    parseDetail,
    base64Encode,
    base64Decode,
    lazy,
    cheerio,
    Crypto as CryptoJS,
    
    // 从utils.js移入的函数
    isSub,
    isNumeric,
    getSize,
    removeExt,
    log,
    isVideoFormat,
    jsonParse,
    debug,
    objectToStr,
    sleep,
    getStrByRegex,
    getStrByRegexDefault,
    unescape,
    getHost,
    unquote,
    md5Encode,
    getUUID,
    objToList,
    getPropertiesAndMethods,
    formatPlayUrl,
    rand,
    randDevice,
    randStr,
    randDeviceWithId,
    randUUID,
    formatUrl,
    formatContent,
    lcs,
    findAllIndexes,
    
    // 新增的网络请求函数
    sanitizeUserAgent,
    requestHtml,
    requestJson,
    getPublicIp,
    getHtml,
    req_,
    req_encoding,
    req_proxy,
    
    gzip,
    ungzip,
    
    // 常量
    MOBILE_UA,
    PC_UA,
    UA,
    UC_UA,
    IOS_UA
};