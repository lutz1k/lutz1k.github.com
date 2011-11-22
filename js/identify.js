jQuery.fn.extend({ 
    disableSelection : function() { 
            this.each(function() { 
                    this.onselectstart = function() { return false; }; 
                    this.unselectable = "on"; 
                    jQuery(this).css('-moz-user-select', 'none'); 
            }); 
    },
    enableSelection : function() { 
            this.each(function() { 
                    this.onselectstart = function() {}; 
                    this.unselectable = "off"; 
                    jQuery(this).css('-moz-user-select', 'auto'); 
            }); 
    } 
});

function chr(AsciiNum)
{
	return String.fromCharCode(AsciiNum);
}

function print_r(arr, level) {
    var print_red_text = "";
    if(!level) level = 0;
    var level_padding = "";
    for(var j=0; j<level+1; j++) level_padding += "    ";
    if(typeof(arr) == 'object') {
        for(var item in arr) {
            var value = arr[item];
            if(typeof(value) == 'object') {
                print_red_text += level_padding + "'" + item + "' :\n";
                print_red_text += print_r(value,level+1);
		} 
            else 
                print_red_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
        }
    } 

    else  print_red_text = "===>"+arr+"<===("+typeof(arr)+")";
    alert(print_red_text);
}

$(document).ready(function()
{
	var sample = $('#todo').text();
	$('#input').val('');

	var analyzer = 
	{
		clicks:[]
	};
	
	$('body *').disableSelection(); 
	
	$('#input').keyup(function(e) {
		var len = $(this).val().length;
		
		while (len >= 0 && $(this).val().substr(0, len) != $('#sample').text().substr(0, len)) {
			len--;
		}
		
		$('#correct').text($('#sample').text().substr(0, len));
		$('#todo').text($('#sample').text().substr(len, $('#sample').text().length - len));
	});
	
	$('#input').keypress(function(e)
	{
		var ord = e.which;

		var symb = chr(ord);		
		
		var date = new Date();
		date = date.getTime();
		
		var hold = 
		{
			down_time:date,
			code:ord,
			wrong:(symb != sample[len] ? 1 : 0)
		}
		
		analyzer.clicks.push(hold);
	});
	
	$('input[type="submit"]').click(function(e)
	{
		e.preventDefault();
		var btn = this;
		$(this).attr('disabled','disabled');
		$(this).val('Подождите');
		
		var data = 'user='+$('#subject').val();
		
		var arr_str = '';
		
		for (var i = 0; i < analyzer.clicks.length; i++)
		{
			arr_str = '&data[' + i + '][code]=' + analyzer.clicks[i].code + '&data[' + i + '][down_time]=' + analyzer.clicks[i].down_time + '&data['+i+'][wrong]=' + analyzer.clicks[i].wrong;
			data += arr_str;
		}
		
		$.ajax({
			type:'post',
			dataType:'json',
			data:data,
			success:function()
			{
				$(btn).val('Спасибо');
			}
		});
		
	});
});