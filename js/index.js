// 📦 改良版 JS：支援雙輪播區塊（大學/高中），自動播放、點選圓點切換、滑鼠拖曳切換

$(function () {
    $('.sliderBoard').each(function () {
        initCarousel($(this));
    });

    function initCarousel($board) {
        const $ul = $board.find('.content');
        const $items = $ul.find('li');
        const $btnGroup = $board.find('.contentButton');

        let divWidth = $board.width();
        let imgCount = $items.length;
        let index = 0;
        let timer;
        let isDragging = false;
        let startX, currentX;

        // 設定每個 li 寬度
        $items.width(divWidth).css('flex-shrink', 0);
        $ul.width(divWidth * imgCount);

        // 建立圓點
        for (let i = 0; i < imgCount; i++) {
            $btnGroup.append(`<li></li>`);
        }
        $btnGroup.find('li:first').addClass('clicked');

        // 點擊圓點
        $btnGroup.on('click', 'li', function () {
            clearInterval(timer);
            index = $(this).index();
            moveTo(index);
            restartTimer();
        });

        // 滑鼠拖曳切換
        $ul.on('mousedown', function (e) {
            clearInterval(timer);
            isDragging = true;
            startX = e.pageX;
        });

        $(document).on('mousemove', function (e) {
            if (!isDragging) return;
            currentX = e.pageX;
            let deltaX = currentX - startX;
            $ul.css('left', -index * divWidth + deltaX);
        });

        $(document).on('mouseup', function (e) {
            if (!isDragging) return;
            isDragging = false;
            let deltaX = e.pageX - startX;
            if (deltaX > 50 && index > 0) index--;
            else if (deltaX < -50 && index < imgCount - 1) index++;
            moveTo(index);
            restartTimer();
        });

        function moveTo(i) {
            $ul.stop().animate({ left: -i * divWidth }, 400);
            $btnGroup.find('li').eq(i).addClass('clicked').siblings().removeClass('clicked');
        }

        function restartTimer() {
            timer = setInterval(() => {
                index = (index + 1) % imgCount;
                moveTo(index);
            }, 5000);
        }

        restartTimer();
    }
});
