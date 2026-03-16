/**
 * 基数変換マスター 共通ロジックファイル (common.js)
 */

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
    const buttons = placeholder.querySelectorAll('.calc-btn');
    // 【修正：58行目付近】
    let touchStartY = 0;
    let isScrolling = false;

    // common.js の buttons.forEach 内を以下のように調整
    buttons.forEach(btn => {
        // 1. 触れた瞬間に「沈ませる」
        btn.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            isScrolling = false;
            btn.classList.add('is-pressed'); // 沈むクラスを追加
        }, { passive: true });

        // 2. 指が動いたら「沈むのをやめる」（スクロール対策）
        btn.addEventListener('touchmove', (e) => {
            let touchMoveY = e.touches[0].clientY;
            if (Math.abs(touchMoveY - touchStartY) > 10) {
                isScrolling = true;
                btn.classList.remove('is-pressed'); // スクロール中は浮かせる
            }
        }, { passive: true });

        // 3. 指を離したら「浮かせる」
        btn.addEventListener('touchend', (e) => {
            btn.classList.remove('is-pressed'); // クラスを外して戻す
            
            if (isScrolling) return;

            e.preventDefault(); 
            const onclick = btn.getAttribute('onclick');
            // ...以下、addToDisplay などの既存の実行ロジック...
            // 前回のコードをそのままここに続けてください
        }, { passive: false });

        // 4. 【PC対応】マウスで押した時も沈ませる
        btn.addEventListener('mousedown', () => btn.classList.add('is-pressed'));
        btn.addEventListener('mouseup', () => btn.classList.remove('is-pressed'));
        btn.addEventListener('mouseleave', () => btn.classList.remove('is-pressed')); // 枠外に逃げた時用
    });
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

/**
 * 画面上のすべてのボタンに「押し込み演出」を設定する共通関数
 */
function applyButtonFeedback() {
    const allButtons = document.querySelectorAll('button, .calc-btn, .back-menu-btn');
    allButtons.forEach(btn => {
        // すでに登録済みなら何もしない
        if (btn.dataset.feedbackSet === "true") return;

        const press = (e) => {
            // クリックイベントの伝播を防がないように注意
            btn.classList.add('btn-pressed');
        };
        const release = () => btn.classList.remove('btn-pressed');

        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
        btn.addEventListener('touchstart', press, { passive: true });
        btn.addEventListener('touchend', release);
        
        btn.dataset.feedbackSet = "true";
    });
}

// ページ読み込み完了時に実行
document.addEventListener('DOMContentLoaded', applyButtonFeedback);

// setupCalculator() の最後にも applyButtonFeedback(); を追加してください