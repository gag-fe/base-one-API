$("button").click(function(){
    var data= $("input").val();
    if(data){
        $.ajax({
        type:'get',
        url:'/add/'+data,
        success:function(data){
            if(data == 'success'){
                alert('上传成功！');
            }
        }
    });
    }
});