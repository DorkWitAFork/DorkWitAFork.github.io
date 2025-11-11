function helloWorld() {
    alert("Hello, World!");
}

function makeBigger() {
    const textArea = document.getElementById("textArea");
    textArea.style.fontSize = "24pt";
}

function toggleStyle() {
    const textArea = document.getElementById("textArea");
    const fancy = document.getElementById("fancy");

    if (fancy.checked) {
        textArea.style.fontWeight = "bold";
        textArea.style.color = "blue";
        textArea.style.textDecoration = "underline";
    } else {
        textArea.style.fontWeight = "normal";
        textArea.style.color = "black";
        textArea.style.textDecoration = "none";
    }
}

function addMoo() {
    const textArea = document.getElementById("textArea");
    let text = textArea.value.toUpperCase();
    let sentences = text.split(".");

    for (let i = 0; i < sentences.length - 1; i++) {
        const trimmed = sentences[i].trim();
        if (trimmed.length > 0) {
            sentences[i] = trimmed + "-MOO";
        }
    }
    textArea.value = sentences.join(". ");
}

window.onload = function() {
    document.getElementById("biggerBtn").onclick = makeBigger;
    document.getElementById("fancy").onchange = toggleStyle;
    document.getElementById("boring").onchange = toggleStyle;
    document.getElementById("mooBtn").onclick= addMoo;

}