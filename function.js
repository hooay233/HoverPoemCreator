//默认样式
function zipCss(css) {
	// 移除注释
	css = css.replace(/\/\*[\s\S]*?\*\//g, '');
	// 移除行尾空白和换行符
	css = css.replace(/\s*([;{}])\s*/g, '$1');
	// 移除多余空白
	css = css.replace(/\s*([{:]),\s*/g, '$1,');
	// 移除周围的空白
	css = css.replace(/\s*([{:}])\s*/g, '$1');
	// 确保在选择器和块之间有空格
	css = css.replace(/([{:}])\s+/g, '$1 ');
	// 确保在选择器和冒号之间有空格
	css = css.replace(/([a-zA-Z0-9])\s*:/g, '$1:');
	// 移除最后一个分号
	css = css.replace(/;}/g, '}');
	return css;
}

const defaultStyle = zipCss(`span {
  margin: min(0.5mm, 0.5vw, 0.5vh);
}
body{
  text-align: center;
}
span::after{
  font-size: min(calc(100vw / var(--llm) - 2vw), calc((100vh / var(--ln) - 2vh) / 1.5));
}
.diff:hover::after{color: #e23;}
.same:hover::after{color: #b13;}
`);

function create(origin, hiden, style=defaultStyle){
	// alert(style);
	style = style || defaultStyle
	// alert(style);
	let customCss = zipCss(style);
	let styleText = "";
	let htmlText = "";
	let lineNumber = 1;
	let charNumber = 0;
	let lineLengthMax = 0;
	// 遍历原文本
	for (let i in origin) {
		++charNumber;
		let o = origin[i];
		let h = hiden[i];
		// 换行
		if (o=="\n" && h=="\n"){
			htmlText += "<br/>\n";
			lineNumber += 1;
			lineLengthMax = Math.max(charNumber, lineLengthMax);
			charNumber = 0;
		} else {
			// 更新styleText和htmlText
			styleText += `
#${"s"+i}::after{content: "${o}";}
#${"s"+i}:hover:after{content: "${h}";}`;
			// sN(id) lN(所在行号) same(悬浮后不改变) diff(悬浮后不一样) cN(这行第N个字)
			htmlText += `<span id="${"s"+i}" class="l${lineNumber+(o==h?" same":" diff")} c${charNumber}"></span>`;
		}
	}
	lineLengthMax = Math.max(charNumber, lineLengthMax);
	// --ln(line number) --llm(line length max)
	styleText = `:root{--ln:${lineNumber};--llm:${lineLengthMax}}`+styleText;
	// 返回对象
	return {"style":styleText+customCss, "html":htmlText};
}