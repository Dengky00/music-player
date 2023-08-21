const $ = s => document.querySelector(s)
const $$ = s => document.querySelectorAll(s)

const $barContainer = $('.bar-container')
const $circle = $('.circle')
const $list = $('.list')


//音乐列表
const list = [
    {
        "id": "0",
        "title": "真的吗",
        "author": "莫文蔚",
        "albumn": "我要说I Say",
        "lyric": "https://jirengu.github.io/data-mock/huawei-music/lyric_真的吗.json",
        "url": "./assets/真的吗.mp3",
        "cover": "./assets/真的吗.jpg"
    },

    {
        "id": "1",
        "title": "水星记",
        "author": "郭顶",
        "albumn": "飞行器的执行周期",
        "lyric": "https://jirengu.github.io/data-mock/huawei-music/lyric_水星记.json",
        "url": "./assets/水星记.mp3",
        "cover": "./assets/水星记.jpg"
    },
    {
        "id": "2",
        "title": "后来的我们",
        "author": "五月天",
        "albumn": "后来的我们",
        "lyric": "https://jirengu.github.io/data-mock/huawei-music/lyric_后来的我们.json",
        "url": "./assets/后来的我们.mp3",
        "cover": "./assets/后来的我们.jpg"
    },
    {
        "id": "3",
        "title": "假装",
        "author": "陈雪凝",
        "albumn": "拾陆",
        "lyric": "https://jirengu.github.io/data-mock/huawei-music/lyric_假装.json",
        "url": "./assets/假装.mp3",
        "cover": "./assets/假装.jpg"
    },
    {
        "id": "4",
        "title": "烦恼歌",
        "author": "张学友",
        "albumn": "在你身边",
        "lyric": "https://jirengu.github.io/data-mock/huawei-music/lyric_烦恼歌.json",
        "url": "./assets/烦恼歌.mp3",
        "cover": "./assets/烦恼歌.jpg"
    }
]

//创建音频对象
const audioObject = new Audio()

//从列表获取歌曲信息
setAudio()
function setAudio(index = 0) {
    let currentAudio = list[index]
    $('.title').innerText = currentAudio.title
    $('.author').innerText = currentAudio.author
    $('.cover').style.backgroundImage = `url(${currentAudio.cover})`
    $('.bg').style.backgroundImage = `url(${currentAudio.cover})`
    audioObject.src = currentAudio.url
}

//歌曲播放模式
let index = 0
let modes = ['normal', 'once', 'random']//normal:普通模式 once:单曲循环 random:随机
let modeIndex = 0
audioObject.onended = function () {
    switch (modes[modeIndex]) {
        case 'normal':
            index++
            if (index === list.length) {
                index = 0
            }
            setAudio(index)
            audioObject.play()
            break;
        case 'once':
            setAudio(index)
            audioObject.play()
            break;
        case 'random':
            randomMode()
            audioObject.play()
            break;
    }
}

$('.mode').onclick = function () {//点击切换播放模式
    let modeClass = ['.play-cycle', '.play-once', '.shuffle-one']
    modeIndex = (++modeIndex) % modes.length
    $$('.mode .iconpark-icon').forEach($mode => {
        $mode.classList.remove('appear')
    })
    $(modeClass[modeIndex]).classList.add('appear')
}

function randomMode() {//随机播放
    let newIndex = Math.floor(Math.random() * list.length)
    while (newIndex === index && list.length != 1) {
        newIndex = Math.floor(Math.random() * list.length)
    }
    index = newIndex
    setAudio(index)
}

//切换上下歌曲
$('.go-start').onclick = function () {
    if (modes[modeIndex] === 'random') {
        randomMode()
    } else {
        index--
        if (index < 0) {
            index = list.length - 1
        }
        setAudio(index)
    }
    if (shouldPlay()) {
        audioObject.play()
    } else {
        $('.current-time').innerText = '00:00'
        clearInterval(clock)
        $('.bar').style.width = '0'
    }
}
$('.go-end').onclick = function () {
    if (modes[modeIndex] === 'random') {
        randomMode()
    } else {
        index++
        if (index === list.length) {
            index = 0
        }
        setAudio(index)
    }
    if (shouldPlay()) {
        audioObject.play()
    } else {
        $('.current-time').innerText = '00:00'
        clearInterval(clock)
        $('.bar').style.width = '0'
    }
}
function shouldPlay() {//判断切换后状态
    return $('.play').classList.contains('hidden')
}

//歌曲时间进度
let clock = null
function timeToStr(time) {//将歌曲秒数转换成分钟
    time = parseInt(time, 10)
    let current = parseInt(time / 60, 10)
    let total = time % 60
    current = current > 9 ? '' + current : '0' + current
    total = total > 9 ? '' + total : '0' + total
    return current + ':' + total
}

audioObject.oncanplay = function () {//当歌曲加载完成时触发，否则duration输出为NaN
    $('.total-time').innerText = timeToStr(audioObject.duration)
}

//点击播放暂停
$('.play').onclick = function () {
    audioObject.play()
    this.classList.add('hidden')
    $('.pause-one').classList.remove('hidden')
    clock = setInterval(() => {//setInterval第一个参数为重复执行代码，第二个为时间周期，以此不断更新时间和进度条长度
        $('.current-time').innerText = timeToStr(audioObject.currentTime)
        $('.bar').style.width = (audioObject.currentTime / audioObject.duration) * 100 + '%'
    }, 1000)
}
$('.pause-one').onclick = function () {
    audioObject.pause()
    this.classList.add('hidden')
    $('.play').classList.remove('hidden')
    clearInterval(clock)//暂停就清除setInterval
}

//点击进度条跳转
$barContainer.onclick = function (e) {
    // let width=parseInt(getComputedStyle($barContainer).width,10)
    // console.log(width)
    // let percent = e.offsetX / this.offsetWidth
    // $('.bar').style.width = percent * 100 + '%'
    // audioObject.currentTime = percent * audioObject.duration
    let barClientX = $barContainer.getBoundingClientRect()
    let offSetX = e.clientX - barClientX.x
    let percent = offSetX / $barContainer.offsetWidth
    $('.bar').style.width = percent * 100 + '%'
    audioObject.currentTime = percent * audioObject.duration
}

//拖拽进度条(兼容移动端网页)
let isDrag = false//判断是否处于拖拽中
let clock2 = null//用于优化播放器拖动声音卡断
//pc端事件
$circle.onmousedown = onmousedown
$circle.onmouseup = onmouseup
$barContainer.onmousemove = onmousemove
//移动端事件
$circle.ontouchstart = onmousedown
$circle.ontouchend = onmousedown
$barContainer.ontouchmove = onmousemove

function onmousedown() {
    isDrag = true
}
function onmouseup() {
    isDrag = false
}
function onmousemove(e) {
    if (isDrag) {
        let barClientX = this.getBoundingClientRect()//得到当前元素上下左右与窗口距离的数组
        let clientX = e.touches ? e.touches[0].clientX : e.clientX//判断是否移动pc
        let offSetX = clientX - barClientX.x
        let percent = offSetX / this.offsetWidth
        $('.bar').style.width = percent * 100 + '%'
        if (clock2) {
            clearTimeout(clock2)
        }
        clock2 = setTimeout(() => {//setTimeout规定时间后才会执行代码，与setInterval不同
            audioObject.currentTime = percent * audioObject.duration
        }, 50)
    }
}

//音乐列表
renderList()
let $$musicList = $$('.list li')
audioObject.onplay = function () {//歌曲一播放就触发播放标志更新
    $$musicList.forEach($music => {
        $music.classList.remove('active')
    })
    $$musicList[index].classList.add('active')
}

$('.music-menu').onclick = function () {//点击弹出
    $list.classList.toggle('show')
}
function renderList() {//加载列表
    const $ul = document.createElement('ul')
    const $$doms = list.map((songObj, idx) => {
        let $svg = document.createElement('span')
        $svg.innerHTML = `<svg class="iconpark-icon acoustic"><use href="#acoustic"></use></svg>`
        let $li = document.createElement('li')
        $li.append(idx + 1 + ' ' + songObj.title, $svg)
        return $li
    })
    // console.log($$doms)
    $ul.append(...$$doms)
    $list.append($ul)
}

$list.onclick = function (e) {//点击列表播放
    if (e.target.tagName === 'LI') {
        index = [...$$musicList].indexOf(e.target)
        setAudio(index)
        if (shouldPlay()) {
            audioObject.play()
        } else {
            $('.current-time').innerText = '00:00'
            clearInterval(clock)
            $('.bar').style.width = '0'
        }
    }
}
