const lineHeight = 1.1;
const cssProps = [
  ['color', null],
  ['fontStyle', /normal/i],
  ['fontWeight', /^400$/],
  ['textDecoration', /none/i],
];
SyntaxHighlighter.config.space = '&#32;';
SyntaxHighlighter.defaults['auto-links'] = false;

const languageSelectElement = document.getElementById('language');
const themeSelectElement = document.getElementById('theme');
const lineNumbersSelectElement = document.getElementById('line-numbers');
const autoHightlightCheckboxElement = document.getElementById('auto-highlight');
const codeTextareaElement = document.getElementById('code');
const highlightButtonElement = document.getElementById('highlight');
const copyHtmlButtonElement = document.getElementById('copy-html');
const copyTargetDivElement = document.getElementById('copy-target');
const highlightedCodeDivElement = document.getElementById('highlighted-code');
const highlighterTempDivElement = document.getElementById('highlighter-temp');

const loadedLanguageScriptSet = new Set();
let prevTheme, prevData;


function loadScript(url, callback) {
  const scriptElement = document.createElement('script');
  scriptElement.src = url;
  if (callback) {
    scriptElement.onload = () => {
      callback(scriptElement);
    };
  }
  document.body.appendChild(scriptElement);
}


function changeTheme(callback) {
  const themeOptionElement = themeSelectElement.querySelector('option:checked');

  // recreate link element insted of just changing href attribute
  // because `onload` event homehow does not fire on second time

  const cssShCoreLinkElement = document.createElement('link');
  const cssShThemeLinkElement = document.createElement('link');
  cssShCoreLinkElement.rel = 'stylesheet';
  cssShThemeLinkElement.rel = 'stylesheet';
  cssShCoreLinkElement.id = 'css-sh-core';
  cssShThemeLinkElement.id = 'css-sh-theme';
  cssShCoreLinkElement.href = `css/shCore${themeOptionElement.dataset.file}.css`;
  cssShThemeLinkElement.href = `css/shTheme${themeOptionElement.dataset.file}.css`;

  if (callback) {
    let loadedCount = 0;
    cssShCoreLinkElement.onload = cssShThemeLinkElement.onload = () => {
      loadedCount++;
      if (loadedCount === 2) {
        callback();
      }
    }
  }

  document.getElementById('css-sh-core').remove();
  document.getElementById('css-sh-theme').remove();

  document.head.appendChild(cssShCoreLinkElement);
  document.head.appendChild(cssShThemeLinkElement);
}


function highlight() {
  const languageOptionElement = languageSelectElement.querySelector('option:checked');
  const themeOptionElement = themeSelectElement.querySelector('option:checked');

  // load brush (if not loaded yet)
  const languageScriptUrl = `js/shBrush${languageOptionElement.dataset.file}.js`;
  if (!loadedLanguageScriptSet.has(languageScriptUrl)) {
    // clear cache of SyntaxHighlighter
    SyntaxHighlighter.vars.discoveredBrushes = null;
    loadScript(languageScriptUrl, () => {
      loadedLanguageScriptSet.add(languageScriptUrl);
      highlight();
    });
    return;
  }

  // change theme before highlighting (if needed)
  if (prevTheme !== themeOptionElement.dataset.file) {
    changeTheme(() => {
      prevTheme = themeOptionElement.dataset.file;
      highlight();
    });
    return;
  }

  // check if code has been modified
  // (if not, do nothing)
  const data = [
    languageOptionElement.dataset.brush,
    themeOptionElement.dataset.file,
    lineNumbersSelectElement.value,
    codeTextareaElement.value,
  ].map(v => v.toString()).join('/');
  if (data === prevData) {
    // nothing changed
    return;
  }
  prevData = data;

  // highlight
  const preElement = document.createElement('pre');
  preElement.className = `brush: ${languageOptionElement.dataset.brush}`;
  preElement.innerText = codeTextareaElement.value;
  preElement.innerHTML = preElement.innerHTML.replace(/<br\s*\/?>/ig, '&#10;');

  highlighterTempDivElement.innerHTML = '';
  highlighterTempDivElement.appendChild(preElement);

  SyntaxHighlighter.highlight(null, preElement);
  //return;

  const syntaxhighlighterDivElement = highlighterTempDivElement.getElementsByClassName('syntaxhighlighter')[0];
  //syntaxhighlighterDivElement.classList.add('printing');

  const containerDivElement = syntaxhighlighterDivElement.querySelector('.code .container');

  // specify styles directly (by `style` attribute, not `class`) because Chrome does not copy styles if it has `!important`
  // maybe heavy?
  for (const element of containerDivElement.getElementsByTagName('*')) {
    const style = window.getComputedStyle(element);
    for (const cssProp of cssProps) {
      if (style[cssProp[0]] && (!cssProp[1] || !cssProp[1].test(style[cssProp[0]]))) {
        element.style[cssProp[0]] = style[cssProp[0]];
      }
    }
    element.removeAttribute('class');
  }

  // create HTML code and display it
  let html = containerDivElement.innerHTML
    .replace(/<code/ig, '<span')
    .replace(/<\/code/ig, '</span');
  if (lineNumbersSelectElement.value !== 'none') {
    const digits = containerDivElement.getElementsByTagName('div').length.toString().length;
    const pads = (lineNumbersSelectElement.value === 'space' ? ' ' : '0').repeat(digits - 1);
    function pad(str) {
      if (typeof str !== 'string') {
        return pad(str.toString());
      }
      return (pads + str).slice(-digits);
    }
    let count = 1;
    html = html.replace(/<div [^>]+>/ig, str => `${str}<span class="line-number">${pad(count++)}: </span>`);
  }
  highlightedCodeDivElement.innerHTML = html;

  // clear
  highlighterTempDivElement.innerHTML = '';
}


for (const eventName of ['change', 'keyup']) {
  codeTextareaElement.addEventListener(eventName, event => {
    if (autoHightlightCheckboxElement.checked) {
      highlight();
    }
  });
}

for (const element of [
  languageSelectElement,
  themeSelectElement,
  lineNumbersSelectElement,
  autoHightlightCheckboxElement,
]) {
  element.addEventListener('change', event => {
    highlight();
  });
}

highlightButtonElement.addEventListener('click', event => {
  highlight();
});

copyHtmlButtonElement.addEventListener('click', event => {
  document.getSelection().selectAllChildren(copyTargetDivElement);
  const result = document.execCommand('copy');
  if (!result) {
    alert('Failed to copy');
  }
});


highlight();
