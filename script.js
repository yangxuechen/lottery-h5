const prizes = {
    0: { name: '一等奖', probability: 0.01 },
    1: { name: '9.9元优惠卷', probability: 0.20 },
    2: { name: '二等奖', probability: 0.05 },
    3: { name: '三等奖', probability: 0.05 },
    4: { name: '11.9元优惠卷', probability: 0.30 },
    5: { name: '二等奖', probability: 0.04 },
    6: { name: '三等奖', probability: 0.05 },
    7: { name: '13.9元优惠卷', probability: 0.30 },
};
const total_items = 8;
const minimum_jumps = 30; // 超過這數字開始進入抽獎
let current_index = -1;
let jumps = 0;
let speed = 30;
let timer = 0;
let prize = -1;

function runCircle() {
    $(`[data-order="${current_index}"]`).removeClass('is-active');

    current_index += 1;

    if (current_index > total_items - 1) {
        current_index = 0;
    }

    $(`[data-order="${current_index}"]`).addClass('is-active');
}

function generatePrizeNumber() {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < total_items; i++) {
        cumulativeProbability += prizes[i].probability;
        if (random < cumulativeProbability) {
            return i;
        }
    }
    return total_items - 1; // 如果没有匹配，返回最后一个奖项
}

function controllSpeed() {
    jumps += 1;
    runCircle();

    if (jumps > minimum_jumps + 10 && prize === current_index) {
        clearTimeout(timer);
        swal("恭喜！", `你获得了${prizes[prize].name}`, "success");
        jumps = 0;
        speed = 30;
        prize = -1;
    } else {
        if (jumps < minimum_jumps) {
            speed -= 5;
        } else if (jumps === minimum_jumps) {
            prize = generatePrizeNumber();
        } else {
            speed += 5;
        }

        if (speed < 40) {
            speed = 40;
        }

        timer = setTimeout(controllSpeed, speed);
    }
}

$('#js-start').on('click', function() {
    if (timer) {
        clearTimeout(timer);
    }
    jumps = 0;
    speed = 30;
    prize = -1;
    current_index = -1;
    controllSpeed();
});