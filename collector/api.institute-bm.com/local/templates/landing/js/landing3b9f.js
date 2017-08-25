//=================================================
// Получение параметров лендингов
//=================================================
function LandingUserParams_get() {
	try {
		var prefix = "landing=";
		var start = document.cookie.indexOf(prefix);
		if(start == -1)
			return new Object();
		var end = document.cookie.indexOf(";", start+prefix.length);
		if(end == -1)
			end = document.cookie.length;
		return JSON.parse(unescape(document.cookie.substring(start+prefix.length, end)));
	} catch(e) {
		return new Object(); 
	}
}

//=================================================
// Сохранение параметров лендингов
//=================================================
function LandingUserParams_save(params) {
	var expires = new Date(2100,01,01);
	document.cookie = "landing="+escape(JSON.stringify(params)) + "; expires="+expires.toGMTString() + "; path=/";
}










//=================================================
// Получение статуса выполнения лендинга
//=================================================
function IsCompleteLanding(id) {
	var params = LandingUserParams_get();
	if(typeof(params)=='object' && typeof(params.complete)=='object')
		return (params.complete[id]==true ? true : false);
	else
		return false;
}

//=================================================
// Установка статуса выполнения лендинга
//=================================================
function SetCompleteLanding(id) {
	var params = LandingUserParams_get();
	if(typeof(params)!='object')
		params = new Object();
	if(typeof(params.complete)!='object')
		params.complete = new Object();
	params.complete[id] = true;
	LandingUserParams_save(params);
}










//=================================================
// проверка движения по цепочке
//=================================================
function CheckCompleteLanding(id, condition, url) {
	if(IsCompleteLanding(id)==condition)
		document.location.href = url;
}










//=================================================
// заполнение формочки пользователя
//=================================================
function FillLandingUserForm(name, email, phone_pre, phone_code, phone_number) {
	var params = $('form .form-params');
	if(params.length>0) {
		params.find('input[name=firstname]').val(name).prop('readonly',true);
		params.find('input[name=email]').val(email).prop('readonly',true);
		params.find('input[name=phone_country_code]').val(phone_pre).prop('readonly',true);
		params.find('input[name=phone_code]').val(phone_code).prop('readonly',true);
		params.find('input[name=phone]').val(phone_number).prop('readonly',true);
	}
}










//=================================================
// лицензия в форме
//=================================================
$(document).ready(function() {
	$('label.form-agreement-yes').click(function(e){
		if($(e.target).get(0).tagName.toLowerCase()=='a')
			return;
		alert("Без согласия на обработку данных мы не можем принять заявку!");
		$(this).children("input").attr('checked', 'checked');
	});
	
	$('a.form-subscribe-setup').click(function()
	{	var el = $($($(this).parent()).parent()).children(".form-subscribe-detail");
		if(el.css("display") == "none")
			el.css("display","block");
		else
			el.css("display","none");
	});
	
	$('label.form-subscribe input').on('change', function(){
		var el = $($($($(this).parent()).parent()).children(".form-subscribe-detail")).children("label");
		if($(this).attr('checked') == 'checked')
		{	for(var i=0; i<el.length; i++)
			{	$($(el[i]).children("input")).attr('checked', 'checked');
			}
		}
		else {
			for(var i=0; i<el.length; i++)
				$($(el[i]).children("input")).removeAttr("checked");
			$($($(this).parent()).parent()).children(".form-subscribe-detail").show();
		}
	});
	
	$('.form-subscribe-detail label input[type="checkbox"]').on('change', function(){
		var els = $('.form-subscribe-detail label input[type="checkbox"]')
		var cntyes = 0;
		var cntno = 0;
		for(var i=0; i<els.length; i++)
		{	if($($(els[i])).attr('checked') == 'checked'){cntyes++;}
			else{cntno++;}
		}
		if(cntyes == els.length)
		{	$('label.form-subscribe input').prop('indeterminate',false);
			$('label.form-subscribe input').attr('checked', 'checked');
		
		}
		else if(cntno == els.length)
		{	$('label.form-subscribe input').prop('indeterminate',false);
			$('label.form-subscribe input').removeAttr("checked");
		}
		else
		{	$('label.form-subscribe input').prop("indeterminate", true);
		}
	});
	
});
