$(function(){
    //layui.use('element', function () {
    //    var element = layui.element;
    //});
    ListStatus("", "LISTSTATUS", "root","GET");
   
    $("#mkdir").bind("click",function () {
        mkdir();
    })
    $("#deldir").bind("click", function () {
        deldir();
    })
    $("#upload").bind("click", function () {
        upload();
    })
    $("#input-b9").fileinput({
        showPreview: false,
        showUpload: false,
        elErrorContainer: '#kartik-file-errors',
        //allowedFileExtensions: ["jpg", "png", "gif"]
        //uploadUrl: '/site/file-upload-single'
    });
    $("#firstpage").bind("click", function () {
        $("#navigation").empty();
        ListStatus("", "LISTSTATUS", "root", "GET");
        aId = 0;
    })
})
var nowdiv = null;
var aId = 0;
//获取文件夹下的目录,并生成项目到界面
function ListStatus (Path,Op,Name,method){
    fetch('/Home/poxy?path='+Path+'&op='+Op+'&name='+Name,{
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
        
    }).then(function (response) {
        if (response.ok) {
            response.json().then(json => {
                $("#maindiv").empty();
                $(json.FileStatuses.FileStatus).each(function (idx, item) {
                    //$("#maindiv").append('<div class="layui-colla-item" lay-accordion> <h2 class="layui-colla-title">' + item.pathSuffix + '</h2></div>');
                    //$("#maindiv").append('<div class="radio">'+
                    //    '<label><input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>' + item.pathSuffix +
                    //    '</label></div>')
                    var unixTimestamp = new Date(item.modificationTime);
                    var commonTime = unixTimestamp.toLocaleString();
                    $("#maindiv").append('<tr><td>' + item.pathSuffix + '</td><td>' + item.type + '</td><td>' + commonTime + '</td></tr>')
                    layui.use('element', function () {
                        var element = layui.element;
                    });
                });
                $("#maindiv tr").bind("dblclick", function () {
                    // $(this).append('<div class="layui-colla-content layui-show">内容区域</div>');
                    $("#maindiv").empty();
                    NextStatus($(this));
                })
                $("#maindiv tr").bind("click", function () {
                    $("#maindiv tr").removeClass("layui-bg-green");
                    $(this).addClass("layui-bg-green");
                    $("#deldir").removeClass("layui-btn-disabled");
                   
                    nowdiv = $(this);
                })
                //为每一个div添加点击函数
                //$.each($("#maindiv div"), function (idx, item) {
                //    console.log(item);
                //    item.bind("click", function () {
                //        NextStatus(item);
                //    })
                //})

            })
        }
    }).catch(function (err) {
        console.log("Fetch错误:" + err);
    })
};
//为每一项添加点击函数，生成下一项
function NextStatus(div) {
    var name = div[0].cells[0].innerText;
  //  name = name.substring(0, name.length-1);
    $("#navigation").append('<a id=' + aId + '>' + name + '<span lay-separator="">/</span>' + '</a>');
    $("#" + aId).bind("click", function () {
        var id = $(this)[0].id;
        var path = "";
        $.each($("#navigation a"), function (idx, item) {
            if (idx <= id) {
                path = path + item.text + "/";
            }
            else {
                $(this).empty();
            }
            //console.log(item.text);
        })

        //$("#navigation").empty();
        $("#maindiv").empty();
        ListStatus(path, "LISTSTATUS", "root", "GET");
    })
    var path="";
    $.each($("#navigation a"), function (idx,item) {
        
        path = path+item.text + "/" ;
        //console.log(item.text);
    })
    aId++;
    ListStatus(path, "LISTSTATUS", "root","GET");
}
//弹出添加文件夹名字询问框
//Put方法
function putmethod(Path, Op, Name, method, PreviousPath) {
    //fetch('/Home/poxy?path=' + Path + '&op=' + Op + '&name=' + Name, {
    fetch('/Home/poxy?path=' + Path + '&op=' + Op + '&name=' + Name, {
        method: method,
        headers: {
           
            "Content-Type": "application/json"
        }
    }).then(function (response) {
        if (response.ok) {
            response.json().then(json => {
                console.log(json);
            })
        }
        ListStatus(PreviousPath, "LISTSTATUS", "root", "GET");
    }).catch(function (err) {
        console.log("Fetch错误:" + err);
    })
}
function mkdir() {
    layer.prompt({ title: '请输入文件名', formType: 0 }, function (val, index) {
        var path = "";
        $.each($("#navigation a"), function (idx, item) {
            path = path + item.text + "/";
            //console.log(item.text);
        })
        var PreviousPath = path;
        path = path + val;
        layer.close(index);
        putmethod(path, "MKDIRS", "root", "PUT", PreviousPath);
    });
}
//删除选中的文件夹及文件
function deldir() {
    var div = nowdiv;
    var name = div[0].cells[0].innerText;
    var path = "";
    $.each($("#navigation a"), function (idx, item) {
        path = path + item.text + "/";
        //console.log(item.text);
    })
    var PreviousPath = path;
    path = path + name;
    putmethod(path, "DELETE", "root", "DELETE", PreviousPath)
}
//上传文件
function upload() {
    var path = "";
    $.each($("#navigation a"), function (idx, item) {
        path = path + item.text + "/";
        //console.log(item.text);
    })
    //layui.use('upload', function () {
    //    var upload = layui.upload;

    //    //执行实例
    //    var uploadInst = upload.render({
    //        elem: '#upload' //绑定元素
    //      , url: '/Home/poxy?path=' + path + '&op=CREATE' //上传接口
    //      , done: function (res) {
    //          //上传完毕回调
    //      }
    //      , accept: 'file'
    //      , error: function () {
    //          //请求异常回调
    //      }
    //    });
    //});
    nextpath = path;
    var text = $("#input-b9").val();
    var name = text.split('\\').pop();
    path = path + name;
    console.log($("#input-b9").files);
    var objfile = $("#input-b9").files;
    fetch('/Home/poxy?path=' + path + '&op=CREATE' + '&name=root', {
        method: 'PUT',
        headers: {

            "Content-Type": "application/octet-stream"
        },
        body:{
            objfile
    }
    }).then(function (response) {
        if (response.ok) {
            ListStatus(nextpath, "LISTSTATUS", "root", "GET");
            $("#close").click();
        }
    }).catch(function (err) {
        console.log("Fetch错误:" + err);
    })
}