(function () {
  var data = window.AUDIO_DATA || [];
  var catOrder = ["字母", "数字", "歌曲", "每课生词", "课文对话", "音素", "句型与例句", "动词变位"];
  var currentCat = "";
  var currentLesson = "";
  var currentQuery = "";

  var cardsEl = document.getElementById("cards");
  var chips = document.querySelectorAll(".chip");
  var searchEl = document.getElementById("search");
  var lessonEl = document.getElementById("lessonSelect");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      currentCat = chip.getAttribute("data-cat") || "";
      render();
    });
  });

  searchEl.addEventListener("input", function () {
    currentQuery = searchEl.value.trim().toLowerCase();
    render();
  });

  lessonEl.addEventListener("change", function () {
    currentLesson = lessonEl.value;
    render();
  });

  function matches(item) {
    if (currentCat && item.cat !== currentCat) return false;
    if (currentLesson && item.lesson !== currentLesson) return false;
    if (!currentQuery) return true;
    var hay = (item.text + " " + item.ipa + " " + item.zh + " " + item.id + " " + item.cat).toLowerCase();
    return hay.indexOf(currentQuery) !== -1;
  }

  function render() {
    var list = data.filter(matches);
    var html = "";
    if (currentLesson) {
      // 按分类分组显示
      catOrder.forEach(function (cat) {
        var sub = list.filter(function (it) { return it.cat === cat; });
        if (!sub.length) return;
        html += '<div class="section-title">' + cat + "（" + sub.length + "）</div>";
        html += sub.map(cardHtml).join("");
      });
    } else {
      html = list.map(cardHtml).join("");
    }
    if (!html) html = '<p class="muted">没有找到匹配的音频。</p>';
    cardsEl.innerHTML = html;
  }

  function cardHtml(item) {
    return (
      '<div class="card" data-id="' + item.id + '">' +
        '<audio controls preload="none" src="' + item.url + '"></audio>' +
        '<div class="fr">' + esc(item.text) + "</div>" +
        '<div class="meta">' +
          (item.ipa ? '<span class="ipa">' + esc(item.ipa) + "</span>" : "") +
          (item.zh ? "<span>" + esc(item.zh) + "</span>" : "") +
        "</div>" +
        '<span class="tag">' + esc(item.id) + (item.lesson ? " · " + item.lesson : "") + "</span>" +
      "</div>"
    );
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  // 支持 #S1L1 锚点直达某课
  var hash = location.hash.replace("#", "");
  if (hash && lessonEl.querySelector('option[value="' + hash + '"]')) {
    lessonEl.value = hash;
    currentLesson = hash;
  }
  render();
})();

