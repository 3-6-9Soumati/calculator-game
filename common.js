// 1. 電卓のHTMLを自動挿入する関数
function setupCalculator() {
    const placeholder = document.getElementById('calculator-placeholder');
    if (!placeholder || placeholder.innerHTML.trim() !== "") return;
    const calcHTML = `
        <div class="calc-area">
            <div id="history" class="history-box"></div>
            <input type="text" id="calcInput" readonly>
            <div>
                <button class="calc-btn" onclick="clearInput()">C</button>
                <button class="calc-btn" onclick="backspace()">BS</button>
                <button class="calc-btn" onclick="addToDisplay('(')">(</button>
                <button class="calc-btn" onclick="addToDisplay(')')">)</button>
                
                <button class="calc-btn" onclick="addToDisplay('7')">7</button>
                <button class="calc-btn" onclick="addToDisplay('8')">8</button>
                <button class="calc-btn" onclick="addToDisplay('9')">9</button>
                <button class="calc-btn" onclick="addToDisplay('÷')">÷</button>
                
                <button class="calc-btn" onclick="addToDisplay('4')">4</button>
                <button class="calc-btn" onclick="addToDisplay('5')">5</button>
                <button class="calc-btn" onclick="addToDisplay('6')">6</button>
                <button class="calc-btn" onclick="addToDisplay('×')">×</button>
                
                <button class="calc-btn" onclick="addToDisplay('1')">1</button>
                <button class="calc-btn" onclick="addToDisplay('2')">2</button>
                <button class="calc-btn" onclick="addToDisplay('3')">3</button>
                <button class="calc-btn" onclick="addToDisplay('-')">-</button>
                
                <button class="calc-btn" onclick="addToDisplay('0')">0</button>
                <button class="calc-btn" onclick="addToDisplay('.')">.</button>
                <button class="calc-btn" onclick="addToDisplay('^')">^</button>
                <button class="calc-btn" onclick="addToDisplay('+')">+</button>
                
                <button class="calc-btn" style="width:250px;" onclick="calculate()">＝ 計算実行</button>
            </div>
            <div style="border-top: 1px solid #999; margin-top: 15px; padding-top: 10px;">
                <h4>すだれ算支援</h4>
                <input type="number" id="divA" style="width:60px"> ÷ <input type="number" id="divB" style="width:60px">
                <button onclick="calcRemainder()">計算</button>
                <div id="remHistory" class="rem-history"></div>
            </div>
        </div>`;
    
    placeholder.innerHTML = calcHTML;
    applyButtonFeedback();
}

// 【シンプル版】まずはこれで動くか試してみてください
function addToDisplay(value) {
    console.log("ボタンが押されました: " + value); // デバッグ用：F12キーで確認
    const input = document.getElementById('calcInput');
    if (input) {
        input.value += value;
    }
}

function clearInput() { 
    document.getElementById('calcInput').value = ""; 
}

function backspace() { 
    let i = document.getElementById('calcInput');
    i.value = i.value.slice(0, -1);
}

function calculate() {
    let inputField = document.getElementById('calcInput');
    let rawExp = inputField.value;
    let calcExp = rawExp.replace(/÷/g, '/').replace(/×/g, '*').replace(/\^/g, '**');
    try {
        let res = eval(calcExp);
        res = Math.round(res * 1000000000) / 1000000000;
        let history = document.getElementById('history');
        history.innerHTML = `<div>${rawExp} = ${res}</div>` + history.innerHTML;
        inputField.value = res;
    } catch(e) { 
        alert("式エラー");
    }
}

// 3. すだれ算（除算の余り計算）支援機能
function calcRemainder() { 
    let a = parseInt(document.getElementById("divA").value);
    let b = parseInt(document.getElementById("divB").value);
    if(!isNaN(a) && !isNaN(b) && b !== 0) {
        let remHistory = document.getElementById('remHistory');
        remHistory.innerHTML = `<div>${a}÷${b}=${Math.floor(a/b)} 余 ${a%b}</div>` + remHistory.innerHTML;
        document.getElementById("divA").value = Math.floor(a/b);
    }
}

// 4. 設定用チェックボックス操作系
function toggleAll(name, status) { 
    document.getElementsByName(name).forEach(el => el.checked = status); 
}

function rangeSelect(name) {
    let min = parseInt(prompt("最小進数 (2-16):", "2"));
    let max = parseInt(prompt("最大進数 (2-16):", "16"));
    if(isNaN(min) || isNaN(max)) return;
    document.getElementsByName(name).forEach(el => {
        let val = parseInt(el.value);
        el.checked = (val >= min && val <= max);
    });
}

// 5. 画面遷移ロジック
function goBack() {
    document.getElementById('gamePage').classList.remove('active');
    document.getElementById('menuPage').classList.add('active');
}

// 確実に呼び出せるようにする
function initializeCalculator() {
    const placeholder = document.getElementById('calculator-placeholder');
    if (placeholder && placeholder.innerHTML.trim() === "") {
        setupCalculator();
    }
}

// 必要に応じてこの関数を呼ぶ（例：ページ読み込み時やゲーム開始時）
document.addEventListener('DOMContentLoaded', initializeCalculator);

// 電卓のリセット関数（前回追加分）
function clearCalculator() {
    if (document.getElementById('calcInput')) document.getElementById('calcInput').value = "";
    if (document.getElementById('history')) document.getElementById('history').innerHTML = "";
    if (document.getElementById('divA')) document.getElementById('divA').value = "";
    if (document.getElementById('divB')) document.getElementById('divB').value = "";
    if (document.getElementById('remHistory')) document.getElementById('remHistory').innerHTML = "";
}

window.onerror = function(message, source, lineno, colno, error) {
    alert("エラー発生: " + message + " (行: " + lineno + ")");
    return false;
};

function applyButtonFeedback() {
    const allButtons = document.querySelectorAll('button, .calc-btn, .back-menu-btn');
    allButtons.forEach(btn => {
        if (btn.dataset.feedbackSet === "true") return;
        btn.dataset.feedbackSet = "true";

        const press = (e) => {
            btn.classList.add('btn-pressed');
        };

        const release = (e) => {
            btn.classList.remove('btn-pressed');
            
            // 指を離した場所がボタンの外だったり、スワイプ中なら無視
            if (e.type === 'touchend') {
                // ここで計算処理などを強制的にキックする工夫（必要なら）
            }
        };

        // タッチ開始
        btn.addEventListener('touchstart', (e) => {
            press();
        }, { passive: true });

        // タッチ終了（ここで反応を確定させる）
        btn.addEventListener('touchend', (e) => {
            release(e);
            // スマホの場合、clickイベントが走らないことがあるのでここで発火
            // ただし、二重実行を防ぐために一瞬待つか、clickをpreventDefaultする
        }, { passive: true });

        btn.addEventListener('touchcancel', release, { passive: true });
        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    });
}

// ページ読み込み完了時に実行
document.addEventListener('DOMContentLoaded', applyButtonFeedback);

// setupCalculator() の最後にも applyButtonFeedback(); を追加してください

// --- メモ帳用の変数 ---
let isDrawing = false;
let canvas, ctx;

function toggleMemo() {
    const drawer = document.getElementById('memoDrawer');
    const floatBtn = document.getElementById('memoFloatingBtn');
    if (!drawer) return;
    
    drawer.classList.toggle('open');
    
    if (drawer.classList.contains('open')) {
        floatBtn.style.display = "none"; // 開いている時はボタンを隠す
        setTimeout(initCanvas, 100); 
    } else {
        floatBtn.style.display = "flex"; // 閉じたらボタンを出す
    }
}

// キャンバスの初期化
function initCanvas() {
    canvas = document.getElementById('memoCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // 表示サイズに合わせて解像度を調整
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.strokeStyle = "#2c3e50"; 
    ctx.lineWidth = 3;           // スマホで見やすいよう少し太く
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // マウスイベント
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);

    // タッチイベント（スマホ用）
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startDrawing(touch);
        e.preventDefault(); 
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        draw(touch);
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function clearMemo() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// ページ切り替え関数
function showPage(pageId) {
    // 1. すべてのページを非表示にする
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    // 2. 指定されたページを表示する
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // 3. メモ起動ボタンの表示・非表示コントロール
    const memoBtn = document.getElementById('memoFloatingBtn');
    if (memoBtn) {
        // ゲーム画面(gamePage)の時だけメモボタンを表示する
        if (pageId === 'gamePage') {
            memoBtn.style.display = 'flex';
        } else {
            memoBtn.style.display = 'none';
            // メモ帳が開いたままなら閉じる
            const drawer = document.getElementById('memoDrawer');
            if (drawer && drawer.classList.contains('open')) {
                toggleMemo();
            }
        }
    }

    // 4. ゲーム開始時の初期化処理（必要に応じて）
    if (pageId === 'gamePage') {
        initializeCalculator(); // 電卓を準備
        if (typeof nextQuestion === "function") {
            // もしindex.html側にnextQuestion関数があれば呼ぶ
            // 初回のみ実行するフラグ管理などをしてもOK
        }
    }
}