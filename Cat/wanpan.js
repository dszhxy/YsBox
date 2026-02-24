
import { Quark, Baidu } from "../utils/pans.js";
import '../lib/dsutil.js';
const DOM_CFG = {
    "玩偶": [
        "https://wogg.xxooo.cf",
        "https://wogg.333232.xyz",
        "https://woggpan.333232.xyz",
        "https://wogg.heshiheng.top",
        "https://www.wogg.one",
        "https://www.wogg.lol"
    ],
    "至臻": [
          "https://mihdr.top",
          "https://www.mihdr.top",
          "https://www.miqk.cc",
          "https://xiaomi666.fun",
          "https://zhizhen8.click",
          "https://www.zhizhen8.click"
    ],
    "蜡笔": [
        "http://xiaocge.fun",
        "http://feimo.fun",
        "https://feimao666.fun",
        "http://feimao888.fun",
        "http://www.labi88.sbs",
        "http://fmao.site",
        "http://fmao.shop",
        "http://xiaocgege.shop"
    ],
    "木偶": [
        "http://123.666291.xyz",
        "https://mogg.5568.eu.org",
        "https://mo.666291.xyz",
        "http://666.666291.xyz",
        "https://mo.muouso.fun"
    ],
    "小米": [
        "https://www.54271.fun",
        "https://54271.fun",
        "https://www.mucpan.cc",
        "https://mucpan.cc"
    ],
    "百家": [
        "https://bj.jiexi.news",
        "http://baijia.filegear-sg.me",
        "http://cj.jiexi.news",
        "http://baijia.885525.xyz"
    ],
    "二小": [
        "https://xhww.net",
        "https://erxiaofn.site",
        "https://erxiaofn.click",
        "https://www.xhww.net"
    ],
    "多多": [
        "https://tv.yydsys.top",
        "https://tv.yydsys.cc"
    ],
    "虎斑": [
        "http://103.45.162.207:20720",
        "http://xsayang.fun:12512"
    ],
    "欧歌": [
        "https://woog.xn--dkw.xn--6qq986b3xl",
        "https://woog.nxog.eu.org"
    ]
};
let host = ''; 
let ext = '';
let apitype = '';
let headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"};
let line_order = ['百度', '夸克'];
let download_threads = '32';
let enable_quark_original = false;
let cachedClasses = [];
let cachedFilters = {};
async function init(cfg) {
    ext = 'ext' in cfg ? cfg.ext : cfg;
    
    let quarkCookie = "";
    let baiduCookie = "";
    let selectedConfig = "至臻";
    let siteOrder = "";
    let customLineOrder = null;
    let customThreads = null;
    let customQuarkOriginal = null;
    
    if (cfg) {
        if (typeof ext === 'object') {
            quarkCookie = cfg.quark_cookie || "";
            baiduCookie = cfg.baidu_cookie || "";
            customLineOrder = cfg.line_order || null;
            customThreads = cfg.threads || null; 
            customQuarkOriginal = cfg.quark_original !== undefined ? cfg.quark_original : null;
        } else if (typeof ext === 'string') {
            const [url, order] = ext.split('$');
            
            const html = await request(url);
            const json = JSON.parse(html);
            
            quarkCookie = json.quark_cookie || "";
            baiduCookie = json.baidu_cookie || "";
            siteOrder = order?.trim() || "";
            customLineOrder = json.line_order || null;
            customThreads = json.threads || null; 
            customQuarkOriginal = json.quark_original !== undefined ? json.quark_original : null;
        }
    }
    
    line_order = customLineOrder?.length ? customLineOrder : line_order;
    download_threads = customThreads || download_threads;
    enable_quark_original = customQuarkOriginal !== null ? customQuarkOriginal : enable_quark_original;
    
    if (quarkCookie?.length > 10) Quark.cookie = quarkCookie;
    if (baiduCookie?.length > 10) Baidu.cookie = baiduCookie;
    
    if (siteOrder) {
        for (const [key] of Object.entries(DOM_CFG)) {
            if (siteOrder.includes(key)) {
                selectedConfig = key;
                break;
            }
        }
    }
    
    const domains = DOM_CFG[selectedConfig];
    
    for (const domain of domains) {
        const response = await req(domain, {method: 'GET', headers, timeout: 3000});
        const status = parseInt(response.status || response.code || 0);
        
        if (status >= 200 && status < 400) {
            host = domain;
            headers.Referer = host + "/";
            break;
        }
    }
    
    apitype = await ApiType();
    
    if (host) {
        const html = await request(host);
        const classes = [];
        const seenTypeIds = new Set();
        
        const navItems = pdfa(html, '.nav-menu-items&&li');
        
        navItems.forEach((item) => {
            const href = pd(item, 'a&&href', host).trim();
            const typeName = pdfh(item, 'a&&Text').trim();
            const match = href.match(/\/([^\/]+)\.html$/);
            
            if (match && typeName && !seenTypeIds.has(match[1])) {
                const typeId = match[1];
                if (/^\d+$/.test(typeId)) {
                    classes.push({"type_name": typeName, "type_id": typeId});
                    seenTypeIds.add(typeId);
                }
            }
        });
        
        cachedClasses = classes;
        
        if (classes.length > 0) {
            const filterPromises = classes.map(async (cls) => {
                const type_id = cls.type_id;
                const url = apitype === "vodshow" ? 
                    `${host}/vodshow/${type_id}-----------.html` : 
                    `${host}/index.php/vod/show/id/${type_id}.html`;
                
                const html = await request(url);
                // 直接接收筛选数组，无需再解析外层key
                const filters = await getFilters(type_id, html);
                return { type_id, filters };
            });
            
            const filterResults = await Promise.all(filterPromises);
            
            filterResults.forEach(result => {
                // 直接赋值筛选数组，形成{type_id: [筛选项]}的标准结构
                cachedFilters[result.type_id] = result.filters;
            });
        }
    }
    
    return JSON.stringify({});
}
async function home(filter) {
    if (cachedClasses.length > 0) {
        return JSON.stringify({
            class: cachedClasses, 
            filters: cachedFilters // 标准结构：{type_id: [筛选数组]}
        });
    }
    
    return JSON.stringify({
        class: [], 
        filters: {}
    });
}
function getList(html) {
    const videos = [];
    const items = pdfa(html, ".module-items .module-item");
    
    items.forEach((it) => {
        const name = pdfh(it, "a&&title");
        const pic = pd(it, "img&&data-src", host);
        const desc = pdfh(it, ".module-item-text&&Text");
        const url = pd(it, "a&&href", host);
        
        if (name && url) {
            videos.push({
                "vod_id": url,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": desc || ""
            });
        }
    });
    
    return videos;
}
async function homeVod() {
    const html = await request(host);
    return JSON.stringify({ list: getList(html) });
}
async function category(tid, pg, filter, extend) {
    const p = pg || 1;
    const fl = extend || {};
    let url = '';
    
    if (apitype === "vodshow") {
        url = `${host}/vodshow/${tid}-${fl.area || ''}-${fl.by || 'time'}-${fl.class || ''}--${fl.letter || ''}---${p}---${fl.year || ''}.html`;
    } else {
        const parts = [
            fl.area ? `area/${fl.area}` : '',
            fl.by ? `by/${fl.by}` : '',
            fl.class ? `class/${fl.class}` : '',
            fl.cateId ? `id/${fl.cateId}` : `id/${tid}`,
            fl.lang ? `lang/${fl.lang}` : '',
            fl.letter ? `letter/${fl.letter}` : '',
            fl.year ? `year/${fl.year}` : ''
        ].filter(Boolean);
        
        url = `${host}/index.php/vod/show/${parts.join('/')}/page/${p}.html`;
    }
    
    const html = await request(url);
    const videos = getList(html);
    return JSON.stringify({list: videos, page: p, pagecount: 999, limit: 20, total: 999});
}
async function detail(id) {
    let html = await request(id);
    
    let vod_name = pdfh(html, '.video-info h1&&Text') || pdfh(html, 'h1&&Text') || '未知名称';
    let type_name = pdfh(html, '.tag-link&&Text') || '未知类型';
    let vod_pic = pd(html, '.lazyload&&data-original||.lazyload&&data-src||img&&src', host) || '';
    let vod_content = pdfh(html, '.sqjj_a--span&&Text') || pdfh(html, '.video-info-content&&Text') || '暂无简介';
    let vod_remarks = pdfh(html, '.video-info-items:eq(3)&&Text') || '未知';
    let vod_year = pdfh(html, '.tag-link:eq(2)&&Text') || '未知年份';
    let vod_area = pdfh(html, '.tag-link:eq(3)&&Text') || '未知地区';
    let vod_actor = pdfh(html, '.video-info-actor:eq(1)&&Text') || '未知演员';
    let vod_director = pdfh(html, '.video-info-actor:eq(0)&&Text') || '未知导演';
    
    vod_content += '\n\n=== 配置信息 ===\n';
    vod_content += `当前域名: ${host}\n`;
    vod_content += `API类型: ${apitype}\n`;
    vod_content += `线路顺序: ${line_order.join(', ')}\n`;
    vod_content += `下载线程: ${download_threads}\n`;
    vod_content += `夸克原画: ${enable_quark_original ? '开启' : '关闭'}\n`;
    
    let playFrom = [], playUrl = [];
    let data = pdfa(html, '.module-row-title');
    
    let panCounters = {'夸克': 1, '百度': 1};
    let allLines = [];
    
    data.forEach((item) => {
        let text = pdfh(item, 'p&&Text');
        if (text) {
            let link = text.trim();
            if (/\.quark/.test(link)) allLines.push({ type: '夸克', link: link });
            else if (/\.baidu/.test(link)) allLines.push({ type: '百度', link: link });
        }
    });
    
    for (let item of allLines) {
        if (item.type === '夸克') {
            let shareData = Quark.getShareData(item.link);
            let files = await Quark.getFilesByShareUrl(shareData);
            let lineName = '夸克#' + panCounters.夸克;
            if (files && files.length > 0) {
                let url = files.map(v => {
                    return `${v.file_name}【${v.size ? formatFileSize(v.size) : ''}】$${[shareData.shareId, v.stoken, v.fid, v.share_fid_token, v.pdir_fid || '', v.subtitle?.fid || '', v.subtitle?.share_fid_token || ''].join('*')}`;
                }).join('#');
                playFrom.push(lineName);
                playUrl.push(url);
                panCounters.夸克++;
            }
        }
        else if (item.type === '百度') {
            let files = await Baidu.getFilesByShareUrl(item.link);
            if (files && Array.isArray(files) && files.length > 0) {
                let lineName = '百度#' + panCounters.百度;
                let url = files.map(v => 
                    `${v.name}【${v.size ? formatFileSize(v.size) : ''}】$${[v.path, v.uk, v.shareid, v.fsid].join('*')}`
                ).join('#');
                
                playFrom.push(lineName);
                playUrl.push(url);
                panCounters.百度++;
            }
        }
    }
    
    if (playFrom.length > 0) {
        let sortedLines = playFrom.map((name, index) => ({
            name, 
            url: playUrl[index], 
            type: name.split('#')[0]
        })).sort((a, b) => {
            let aIndex = line_order.indexOf(a.type);
            let bIndex = line_order.indexOf(b.type);
            if (aIndex === -1) aIndex = Infinity;
            if (bIndex === -1) bIndex = Infinity;
            return aIndex - bIndex;
        });
        
        let sorted = sortedLines.filter(line => !/(无名|失效)/.test(line.url));
        
        playFrom = sorted.map(line => line.name);
        playUrl = sorted.map(line => line.url);
    }
    
    let vod = {
        'vod_id': id,
        'vod_name': vod_name,
        'vod_pic': vod_pic,
        'vod_content': vod_content,
        'vod_remarks': vod_remarks,
        'vod_year': vod_year,
        'vod_area': vod_area,
        'vod_actor': vod_actor,
        'vod_director': vod_director,
        'type_name': type_name,
        'vod_play_from': playFrom.join('$$$'),
        'vod_play_url': playUrl.join('$$$')
    };
    
    return JSON.stringify({ list: [vod] });
}
async function search(wd, quick, pg) {
    const p = pg || 1;
    let url = '';
    
    if (apitype === "vodshow") {
        url = `${host}/vodsearch/${wd}----------${p}---.html`;
    } else {
        url = `${host}/index.php/vod/search/page/${p}/wd/${encodeURIComponent(wd)}.html`;
    }
    
    const html = await request(url);
    const data = pdfa(html, '.module-items .module-search-item');
    const videos = [];
    
    data.forEach((it) => {
        const name = pdfh(it, '.video-info&&a&&title');
        const pic = pd(it, 'img&&data-src', host);
        const desc = pdfh(it, '.module-item-text');
        const url = pd(it, '.video-info&&a&&href', host);
        
        if (name && url) {
            videos.push({
                "vod_id": url,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": desc || ""
            });
        }
    });
    
    const filteredResults = videos.filter(item => {
        const title = item.vod_name || '';
        return title.toLowerCase().includes(wd.toLowerCase());
    });
    
    return JSON.stringify({ 
        list: filteredResults,
        page: p,
        pagecount: 10,
        limit: 20,
        total: 100
    });
}
async function play(flag, id, flags) {
    let urls = [];
    let ids = id.split('*');
    
    if (flag.startsWith('夸克')) {
        if (ids.length >= 4) {
            let [shareId, stoken, fid, share_fid_token] = ids;
            
            let down = await Quark.getDownload(shareId, stoken, fid, share_fid_token, true);
            
            if (down && down.download_url) {
                let headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'origin': 'https://pan.quark.cn',
                    'referer': 'https://pan.quark.cn/',
                    'Cookie': Quark.cookie || ''
                };
                
                if (enable_quark_original) {
                    urls.push("原画", `${down.download_url}#threads=${download_threads}#`);
                }
                
                let transcoding = (await Quark.getLiveTranscoding(shareId, stoken, fid, share_fid_token)).filter((t) => t.accessable);
                transcoding.forEach((t) => {
                    let resolutionName = t.resolution === 'low' ? "流畅" : 
                                        t.resolution === 'high' ? "高清" : 
                                        t.resolution === 'super' ? "超清" : 
                                        t.resolution === '4k' ? "4K" :
                                        t.resolution === 'dolby_vision' ? "HDR" :
                                        "正常";
                    urls.push(resolutionName, `${t.video_info.url}#threads=${download_threads}#`);
                });
                
                return JSON.stringify({
                    parse: 0,
                    url: urls,
                    header: headers
                });
            }
        }
    }
    else if (flag.startsWith('百度')) {
        if (ids.length >= 4) {
            let [path, uk, shareid, fsid] = ids;
            
            let url = await Baidu.getAppShareUrl(path, uk, shareid, fsid);
            if (url) {
                urls = ["原画", `${url}#fastPlayMode##threads=${download_threads}#`];
                
                return JSON.stringify({
                    parse: 0,
                    url: urls,
                    header: {
                        "User-Agent": 'netdisk;P2SP;2.2.91.136;android-android;'
                    }
                });
            }
        }
    }
    
    return JSON.stringify({
        parse: 0,
        url: ["错误", "播放解析失败"],
        header: headers
    });
}
async function request(url, obj = {headers, timeout: 50000}) {
    const response = await req(url, obj);
    return response.content;
}
async function ApiType() {
    if (!host) return "index.php";
    
    const response = await req(`${host}`, { 
        method: 'GET', 
        headers,
        timeout: 3000 
    });
    
    const content = response.content || '';
    
    if (content.includes('vodshow')) return "vodshow";
    if (content.includes('show')) return "index.php";
    
    return "index.php";
}
async function getFilters(type_id, html) {
    // 直接定义筛选数组，不再用外层对象包裹
    let filterItems = [];
    if (!type_id || !html) return filterItems;
    
    const sampleUrl = apitype === "vodshow" ? 
        `${host}/vodshow/${type_id}-----------.html` : 
        `${host}/index.php/vod/show/id/${type_id}.html`;
    
    try {
        const sampleHtml = await request(sampleUrl, { timeout: 5000 });
        
        if (!sampleHtml || sampleHtml.trim() === '') {
            return filterItems;
        }
        // 保持原有的 CATEGORIES 配置
        const CATEGORIES = [
            {key:'cateId', name:'类型', reg:/\/id\/(\d+)/},
            {key:'class', name:'剧情'},
            {key:'lang', name:'语言'},
            {key:'area', name:'地区'},
            {key:'year', name:'时间'},
            {key:'letter', name:'字母'},
        ];
        // 获取所有 library-box
        const libraryBoxes = pdfa(sampleHtml, '.library-box');
        
        // 保持原有的处理逻辑+去重
        filterItems = CATEGORIES.map((category) => {
            let values = [];
            
            // 查找包含分类名的box
            let targetBox = null;
            for (const box of libraryBoxes) {
                const boxText = pdfh(box, 'a&&Text') || '';
                if (boxText.includes(category.name)) {
                    targetBox = box;
                    break;
                }
            }
            
            if (targetBox) {
                const links = pdfa(targetBox, "div a");
                values = links.map(a => {
                    let n = pdfh(a, 'a&&Text') || '';
                    let v = n; 
                    
                    if (category.key === 'cateId') {
                        const href = pd(a, 'a&&href');
                        const match = href.match(category.reg);
                        if (match) {
                            v = match[1];
                        }
                    }
                    
                    // 保持原有的"全部"处理
                    if (/全部|字母/.test(n)) {
                        n = "全部";
                        v = "";
                    }
                    
                    return { n, v };
                }).filter(x => x.n !== undefined && x.n !== "")
                // 去重：基于n值保留唯一选项
                .filter((item, index, self) => self.findIndex(i => i.n === item.n) === index);
            }
            
            return { 
                key: category.key, 
                name: category.name, 
                value: values
            };
        }).filter(item => {
            // 保持原有的过滤条件：必须大于3个值
            return item.value && item.value.length > 3;
        });
        
        // 添加排序选项
        const SORT_OPTIONS = {
            "时间": "time",
            "人气": "hits", 
            "评分": "score",
        };
        
        const sortValues = Object.entries(SORT_OPTIONS).map(([name, value]) => ({
            n: name,
            v: value
        }));
        
        if (sortValues.length > 0) {
            filterItems.push({
                key: "by",
                name: "排序",
                value: sortValues
            });
        }
            
    } catch (e) {
        console.error(`获取type_id:${type_id}筛选配置失败: ${e.message}`);
    }
    
    // 直接返回筛选项数组，这是核心修改
    return filterItems;
}
function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return bytes.toFixed(2) + ' ' + units[i];
}
export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
    }
}
