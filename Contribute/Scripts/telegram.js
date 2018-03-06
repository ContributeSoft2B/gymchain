$(function () {
    $('a.btn-copy').on('click', function (e) {
        var copy_ele = $(this).siblings('span.copy-txt')[0];
        copyToClipboard(e, copy_ele);
    });
    function copyToClipboard(e, copy_ele) {
        var clipboardData = window.clipboardData || e.clipboardData;
        var txt = $(copy_ele).text();
        $('.pop-tip').show();
        if (clipboardData) {
            clipboardData.clearData();
            clipboardData.setData("text/plain", txt);
        } else if (document.execCommand) {
            var range = document.createRange();
            range.selectNode(copy_ele);

            var selection = window.getSelection();
            if (selection.rangeCount > 0) selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
        } else {
            //$('p.tip-txt').text('复制失败');
        }
        setTimeout(function () {
            $('.pop-tip').hide();
        },3000);
    }

    $('input.btn-sub').on('click', function () {
        var $this = $(this);
        var parId = $('input.parId').val();
        var eAddr = $('.e-addr input').val();
        var onEn = $(this).val() != "提交";
        var pageLang = $(this).val();
        if (!eAddr) {
            $('.pop-tip').show();
            $('p.tip-txt').text(onEn ? 'Please enter your ETH wallet address':'请输入你的ETH钱包地址');
            return false;
        } else if (eAddr.substr(0, 2) != "0x") {
            $('.pop-tip').show();
            $('p.tip-txt').text(onEn ? 'Please enter the correct address' : '请输入正确的地址');
            return false;
        }
        
        $(this).prop('disabled', 'true');
        var url = "";
       
        $.ajax({
            url: url,
            type: 'post',
            data: { parentId: parId, ethAddress: eAddr },
            success: function (data) {
                //$('.pop-tip').show().find('.tip-txt').html(onEn ? "latest events." : "最新活动。");
                setTimeout(function () {
                    if (onEn) {
                        location.href = "../Telegram/DetailEn?code=" + data.VerificationCode;
                        return false;
                    } else {
                        location.href = "../Telegram/Detail?code=" + data.VerificationCode;
                    }
                },500);
            },
            error: function () {
                console.log('失败');
                $('.pop-tip').show().find('p').text("failed!");
                setTimeout(function () {
                    $('.pop-tip').hide();
                }, 2000);
                $this.removeProp('disabled');
            }
        });
        return false;
    });
    $('.modal').on('click', function () {
        $(this).hide();
    })
});