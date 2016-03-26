$(document).ready(function(){
	var upDisplay = function(mod){
		var display = $("#display:text").val();
		$("#display:text").val(display + mod);
	};

	$("#deleteAll").click(function(){
		$("#display:text").val("");
	});

	$("#deleteOne").click(function(){
		var dsp = $("#display:text").val();
		dsp = dsp.substring(0,dsp.length-1);
		$("#display:text").val(dsp);
	});

	$("button#btn").click(function(){
		upDisplay($(this).val());
	});

	$("#btn-science").click(function(){
		$(".btn").removeAttr("style");
	});

	$("#btn-simple").click(function(){
		var btns = $(".btn");
		for(var i=5; i < btns.length; i+=8){
			$(btns[i]).attr("style","display:none;");
			$(btns[i+1]).attr("style","display:none;");
			$(btns[i+2]).attr("style","display:none;");
		};
	});

	var getNum = function(f){
		for(var j=0; j <= 9; j++){
			if(parseInt(f) === j){
				return f;
			};
		};
		if(f === "."){
			return f;
		}
		return null;
	}

	var rest = function(n1,n2,opet){
		switch(opet){
		case "+":
			return (n1 + n2);
		case "-":
			return (n1 - n2);
		case "*":
			return (n1 * n2);
		case "/":
			return (n1 / n2);
		case "^":
			return (Math.pow(n1,n2));
		};
		return "";
	};

	var addArray = function(array,element){
		if(element === ""){
			return;
		}
		if(array.length === 0){
			array[0] = element;
		}else{
			array[array.length] = element;
		};
	};

	var sustituteSpecialChars = function(n){
		ans = localStorage.getItem("ans");
		for(var i=0; i < n.length; i++){
			if(n[i] === "Ans"){
				n.splice(i,1,ans);
			};
			if(n[i] === "π"){
				n.splice(i,1,Math.PI);
			};
			if(n[i] === "e"){
				n.splice(i,1,Math.E);
			};
		};
	};

	var sustituteScience = function(o,n){
		for(var i=0; i < o.length; i++){
			switch (o[i]){
			case "x10":
				o.splice(i,1,"*");
				n.splice(i+1,1,Math.pow(10,n[i+1]));
				return true;
			case "cos(":
				o.splice(i,2);
				n.splice(i,1,Math.cos(n[i]));
				return true;
			case "sen(":
				o.splice(i,2);
				n.splice(i,1,Math.sin(n[i]));
				return true;
			case "tan(":
				o.splice(i,2);
				n.splice(i,1,Math.tan(n[i]));
				return true;
			case "sqr(":
				o.splice(i,2);
				n.splice(i,1,Math.sqrt(n[i]));
				return true;
			case "log(":
				o.splice(i,2);
				n.splice(i,1,Math.log10(n[i]));
				return true;
			case "ln(":
				o.splice(i,2);
				n.splice(i,1,Math.log(n[i]));
				return true;
			};
		};
		return false;
	};

	var firstParenthesis = function(o,n){
		var p1 = -1;
		var p2 = -1;
		for(var i =0; i < o.length; i++){
			if(o[i] === "("){
				p1 = i;
			};
			if(o[i] === ")"){
				p2 = i;
				break;
			};
		};
		if(p1 === -1 || p2 === -1){
			return false;
		}

		var nAux = n.slice(p1,p2);
		var oAux = o.slice(p1+1,p2);
		var rAux = answer(nAux,oAux);
		if(rAux != ""){
			n.splice(p1,(p2-p1),rAux.toString());
			o.splice(p1,p2+1);
		};
		return true;
	};

	var answer = function(n,o){
		var r = "";
		sustituteSpecialChars(n);
		while(sustituteScience(o,n)){};
		while(firstParenthesis(o,n)){};
		for(var i = 0 ; i < o.length; i++){
			if(o[i] === "^"){
				r = rest(parseFloat(n[i]),parseFloat(n[i+1]),o[i]);
				o.splice(i,1);
				n[i] = r.toString();
				n.splice(i+1,1);
				i--;
			};
		};
		for(var i = 0 ; i < o.length; i++){
			if(o[i] === "*" || o[i] === "/"){
				r = rest(parseFloat(n[i]),parseFloat(n[i+1]),o[i]);
				o.splice(i,1);
				n[i] = r.toString();
				n.splice(i+1,1);
				i--;
			};
		};
		for(var i = 0; i < o.length; i++){
			if(i === 0){
				r = rest(parseFloat(n[i]),parseFloat(n[i+1]),o[i]);
				continue;
			};
			r = rest(parseFloat(r),parseFloat(n[i+1]),o[i]);
		};
		if(o.length === 0){
			return n[0];
		}
		return r;
	};

	var isAns = function(opt,ind){
		var func = opt[ind] + opt[ind+1] + opt[ind+2]
		switch(func){
		case "Ans":
			return true;
		};
		return false;
	};

	var exponential = function(opt,ind){
		var func = opt[ind] + opt[ind+1] + opt[ind+2]
		switch(func){
		case "x10":
			return true;
		case "ln(":
			return true;
		};
		return false;
	};

	var specialNums = function(sn){
		if(sn === "e"){
			return true;
		}else if(sn === "π"){
			return true;
		};
		return false;
	};

	var safeOperation = function(oper){
		var optArrAux = localStorage.getItem("operations");
		if(optArrAux == null){
			optArrAux = [];
			optArrAux[0] = oper;
			localStorage.setItem("operations",optArrAux);
			return;
		}
		optArrAux = optArrAux.split(",");
		if(optArrAux.length >= 4){
			optArrAux.splice(0,1);
		};
		optArrAux[optArrAux.length] = oper;
		localStorage.setItem("operations",optArrAux);
	};

	var optSciences = function(opt,ind){
		var func = opt[ind] + opt[ind+1] + opt[ind+2] + opt[ind+3];
		switch(func){
		case "sqr(":
			return true;
		case "cos(":
			return true;
		case "sen(":
			return true;
		case "tan(":
			return true;
		case "log(":
			return true;
		};
		return false;
	};

	var result = function(f){
		safeOperation(f);
		var c = f.split("");
		var nums = [];
		var opts = [];
		var n = "";
		var opt = "";
		var ans = "";
		var opCmp = 0;
		for(var i=0; i < c.length; i++){
			if(getNum(c[i]) != null){
				n += c[i];
				addArray(opts,opt);
				opt = "";
				continue;
			};
			if(specialNums(c[i])){
				n = c[i];
				addArray(opts,opt);
				opt = "";
				continue;
			};
			if(c[i] === "("){
				addArray(opts,opt);
				opt = c[i];
				n = "";
				continue;
			};
			if(c[i] === ")"){
				opt = c[i];
				addArray(nums,n);
				addArray(opts,opt);
				n = "";
				opt = "";
				continue;
			};
			if(isAns(c,i)){
				n = c[i] + c[i+1] + c[i+2];
				c.splice(i,3);
				continue;
			};
			if(exponential(c,i)){
				addArray(nums,n);
				opt = c[i] + c[i+1] + c[i+2];
				c.splice(i,3);
				n = "";
				i--;
				continue;
			};
			if(optSciences(c,i)){
				addArray(opts,opt);
				opt = c[i] + c[i+1] + c[i+2] + c[i+3];
				c.splice(i,4);
				n = "";
				i--;
				continue;
			}
			addArray(nums,n);
			opt += c[i];
			n = "";
		};
		addArray(nums,n);
		addArray(opts,opt);
		ans = answer(nums,opts);
		localStorage.setItem("ans",ans);
		return ans;
	};

	$("#equal").click(function(){
		var display = $("#display:text").val();
		$("#display:text").val(result(display));
	});

	var eng = function(f){
		var c = f.split("");
		var safe = true;
		console.log(f);
		if(c[0] === 0){
			return f;
		}
		console.log(f);
		for(var i=0; i < c.length; i++){
			if(getNum(c[i]) === null){
				safe = false;
			};
		};
		console.log(f);
		if(!safe){
			return f;
		};
		f = (parseFloat(f) / 1000).toString();
		console.log(f);
		return eng(f);

	};

	$("#ENG").click(function(){
		console.log("aqui calculo la base en ENG");
		var display = $("#display:text").val();
		$("#display:text").val(eng(display));
	});

	var getOperation = function(oper,ind){
		var optArrAux = localStorage.getItem("operations");
		if(optArrAux == null){
			return oper;
		};
		optArrAux = optArrAux.split(",");
		for(var i =0; i < optArrAux.length; i++){
			if(optArrAux[i] === oper){
				if(optArrAux[i-ind] === undefined){
					return "";
				}
				return optArrAux[i-ind];
			};
		};
		if(optArrAux[optArrAux.length - ind] === undefined){
			return "";
		}
		return optArrAux[optArrAux.length - ind];
		
	};

	$(document).keypress(function(key){
		var display = $("#display:text").val();
		if(key.keyCode === 0){
			localStorage.removeItem("operations");
			return;
		};
		if(key.keyCode === 38){ //up opt
			display = getOperation(display,1);
		};
		if(key.keyCode === 40 && display != null){ //down opt
			display = getOperation(display,-1);
		};
		$("#display:text").val(display);
	});
});