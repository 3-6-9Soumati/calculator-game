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
                <button class="calc-btn" onclick="addToDisplay(')')">)</button><br>
                
                <button class="calc-btn" onclick="addToDisplay('7')">7</button>
                <button class="calc-btn" onclick="addToDisplay('8')">8</button>
                <button class="calc-btn" onclick="addToDisplay('9')">9</button>
                <button class="calc-btn" onclick="addToDisplay('÷')">÷</button><br>
                
                <button class="calc-btn" onclick="addToDisplay('4')">4</button>
                <button class="calc-btn" onclick="addToDisplay('5')">5</button>
                <button class="calc-btn" onclick="addToDisplay('6')">6</button>
                <button class="calc-btn" onclick="addToDisplay('×')">×</button><br>
                
                <button class="calc-btn" onclick="addToDisplay('1')">1</button>
                <button class="calc-btn" onclick="addToDisplay('2')">2</button>
                <button class="calc-btn" onclick="addToDisplay('3')">3</button>
                <button class="calc-btn" onclick="addToDisplay('-')">-</button><br>
                
                <button class="calc-btn" onclick="addToDisplay('0')">0</button>
                <button class="calc-btn" onclick="addToDisplay('.')">.</button>
                <button class="calc-btn" onclick="addToDisplay('^')">^</button>
                <button class="calc-btn" onclick="addToDisplay('+')">+</button><br>
                
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
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // タップの遅延を防ぐ
            // onclickで指定していた関数をここで呼ぶ
            const func = btn.getAttribute('onclick');
            eval(func); 
        });
    });
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