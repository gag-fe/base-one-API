"use strict";

$("button").click(function () {
    var data = $("input").val();
    if (data) {
        $.ajax({
            type: 'get',
            url: '/add/' + data,
            success: function success(data) {
                if (data == 'success') {
                    alert('上传成功！');
                }
            }
        });
    }
});
//# sourceMappingURL=index.js.map