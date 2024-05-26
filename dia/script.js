document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');

    const ball = document.getElementById('ball');
    const gameContainer = document.getElementById('game-container');
    const target = document.getElementById('target');

    let attempts = 10;
    let successes = 0;
    let isBallSelected = false;
    const displayTime = 1000; // 1초 설정

    if (!ball || !gameContainer || !target) {
        console.error('Required elements not found');
        return;
    }

    // 공을 우클릭할 때 이벤트 리스너 설정
    ball.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // 기본 우클릭 메뉴 방지
        isBallSelected = true;
        console.log('Ball contextmenu event triggered');
        document.addEventListener('mousemove', followCursor);
    });

    // 마우스를 따라 공을 움직이게 하는 함수
    function followCursor(e) {
        if (isBallSelected) {
            ball.style.left = `${e.clientX - ball.offsetWidth / 2}px`;
            ball.style.top = `${e.clientY - ball.offsetHeight / 2}px`;
        }
    }

    // 문서 전체에서 클릭 이벤트 리스너 설정
    document.addEventListener('click', (e) => {
        if (isBallSelected) {
            console.log('Document click event triggered');
            checkSuccess();
            isBallSelected = false;
            document.removeEventListener('mousemove', followCursor);
            attempts--;
            console.log(`Attempts left: ${attempts}`);
            if (attempts > 0) {
                setTimeout(showBall, displayTime);
            } else {
                console.log(`Game Over! Success Rate: ${(successes / 10) * 100}%\nSuccesses: ${successes}`);
                alert(`Game Over! Success Rate: ${(successes / 10) * 100}%\nSuccesses: ${successes}`);
            }
        }
    });

    // 전체 화면에서 우클릭 기본 메뉴 방지
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // 공을 무작위로 이동시키는 함수
    function showBall() {
        console.log("Showing ball");
        ball.style.left = `${Math.random() * (gameContainer.clientWidth - ball.clientWidth)}px`;
        ball.style.top = `${Math.random() * (gameContainer.clientHeight - ball.clientHeight)}px`;
        console.log(`Ball position: ${ball.style.left}, ${ball.style.top}`);
    }

    // 성공 여부를 체크하는 함수
    function checkSuccess() {
        const ballRect = ball.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const overlapArea = calculateOverlapArea(ballRect, targetRect);
        const ballArea = ballRect.width * ballRect.height;
        const overlapPercentage = (overlapArea / ballArea) * 100;

        console.log(`Overlap Percentage: ${overlapPercentage}%`);

        if (overlapPercentage >= 50) {
            successes++;
            console.log("Success!");
        }
    }

    // 두 사각형의 겹치는 면적을 계산하는 함수
    function calculateOverlapArea(rect1, rect2) {
        const xOverlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
        const yOverlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
        return xOverlap * yOverlap;
    }

    function startGame() {
        console.log('Game started');
        attempts = 10;
        successes = 0;
        isBallSelected = false;
        showBall();
        const intervalId = setInterval(() => {
            if (attempts > 0) {
                showBall();
            } else {
                clearInterval(intervalId);
            }
        }, displayTime);
    }

    startGame();
});
