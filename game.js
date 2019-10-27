const init = () => {

    const map = document.getElementById("map");
    const cells = [];
    let row = null;
    let col = null;
    let mineNum = null;
    let isOver = false;
    let cellsLeft = null;
    let remainMineNum = null;
    let time = 0;

    document.getElementById("play").addEventListener('click', start)
    
    function start() {
        document.getElementById("play").classList.add('playing');
        document.getElementById("play").innerText = "다시 시작";
        document.getElementById("play").removeEventListener('click',start);
        document.getElementById("play").addEventListener('click',restart);

        row = parseInt(document.getElementById("row").value);
        col = parseInt(document.getElementById("col").value);
        mineNum = parseInt(document.getElementById("mine").value);
        if (row < 5 || col < 5) {
            alert('판의 크기가 너무 작습니다.');
            document.getElementById("remainMineNum").innerText ="";
            document.getElementById("timer").innerText="";
        } else if (row > 30 || col > 30) {
            alert('판의 크기가 너무 큽니다.');
            document.getElementById("remainMineNum").innerText="";
            document.getElementById("timer").innerText="";
        } else if (mineNum > row*col ) {
            alert('지뢰의 개수가 너무 많습니다.');
            document.getElementById("remainMineNum").innerText="";
            document.getElementById("timer").innerText="";
        } else {
            document.getElementById("timer").innerText = 'Timer: 0';
            let Timer = setInterval(function(){
                time++;
                document.getElementById("timer").innerText = 'Timer: '+time;
                if(isOver) clearInterval(Timer);
                document.getElementById("play").onclick = function() {
                    clearInterval(Timer);
                }
            },1000);
            for(let i = 0; i < row; i ++){
                const cellsX = [];
                cells.push(cellsX);
                const cellRow = document.createElement('div');
                cellRow.classList.add('cellRow');
    
                map.appendChild(cellRow);
    
                for(let j = 0; j < col; j++) {
                    const cell = document.createElement('div');
                    cellRow.appendChild(cell);
    
                    cell.classList.add('cell');
                    cell.classList.add('close');
                    cell.setAttribute('x', i);
                    cell.setAttribute('y', j);
                    cellsX[j] = cell;
    
                    cell.addEventListener('click', function(e) {
                        e.preventDefault();
                        openCell(this);
                    })
    
                    cell.addEventListener('contextmenu', function(e) {
                        e.preventDefault();
                        flagCell(this);
                    })
                }
            }
            placeMine();
            remainMineNum = mineNum;
            document.getElementById("remainMineNum").innerText = 'Remain : '+remainMineNum;
        }
    }

    function placeMine() {
        let a, b;
        const mineLocation = [];
        for(let i = 0; i < row * col; i++){
            mineLocation.push(i);
        }
        for(let j = mineLocation.length; j; j -= 1){
            a = Math.floor(Math.random() * j);
            b = mineLocation[j - 1];
            mineLocation[j -1] = mineLocation[a];
            mineLocation[a] = b;
        }

        for(let k = 0; k < mineNum; k++) {
            const x = parseInt(mineLocation[0] / col);
            const y = mineLocation[0] % col;
            mineLocation.shift();
            cells[x][y].setAttribute('isMine', true);
        }
    }

//
    function openCell(cell) {
        const isMine = cell.getAttribute('isMine');
        const isFlag = cell.classList.contains('flag');
        const isOpen = cell.classList.contains('open');

        if (isOpen || isOver) {
            return;
        } else if(!isOpen && isMine) {
            gameOver();
        } else if(!isOpen && !isMine && isFlag) {
            cell.classList.remove('flag');
            openCell(cell);
        } else {
            const neighborCells = getNeighborCells(cell);
            const mineCount = neighborCells.reduce((pv, cv) => {
                if(cv.getAttribute('isMine') === 'true') pv++;
                return pv;
            } , 0);

            cell.classList.remove('close');
            cell.classList.add('open');
            if(mineCount > 0 ) {
                cell.textContent = mineCount;
            } else {
                neighborCells.forEach(neighborCell => {
                    if(!neighborCell.isOpen) { //메모이제이션 활용
                        openCell(neighborCell);
                    }
                });
        }
        cellsLeft = document.getElementsByClassName('close').length
        if (cellsLeft === mineNum) {
            gameClear();
        }
    }
    }

    function flagCell(cell) {
        if( cell.classList.contains('flag')) {
            cell.classList.remove('flag');
            remainMineNum++;
        } else {
            if (!cell.classList.contains('open')) {
                cell.classList.add('flag');
                remainMineNum--;
            }
        }
        document.getElementById("remainMineNum").innerText = 'Remain : '+remainMineNum;
    }

    const getNeighborCells = function(cell) {
        const x = parseInt(cell.getAttribute('x'));
        const y = parseInt(cell.getAttribute('y'));
        const neighborCells = [];
        
        if( x === 0 ) {
            if( y === 0 ){
                neighborCells.push(
                    cells[x+1][y+1],
                    cells[x+1][y],
                    cells[x][y+1]
                )
            }
            else if( y === col-1){
                neighborCells.push(
                    cells[x+1][y],
                    cells[x+1][y-1],
                    cells[x][y-1],
                )
            } else {
                neighborCells.push(
                    cells[x+1][y+1],
                    cells[x+1][y],
                    cells[x+1][y-1],
                    cells[x][y+1],
                    cells[x][y-1]
                )
            }
        } else if( x === row-1) {
            if( y === 0 ){
                neighborCells.push(
                    cells[x][y+1],
                    cells[x-1][y+1],
                    cells[x-1][y],
                )
            } else if ( y === col-1 ){
                neighborCells.push(
                    cells[x][y-1],
                    cells[x-1][y],
                    cells[x-1][y-1]
                )
            } else {
                neighborCells.push(
                    cells[x][y+1],
                    cells[x][y-1],
                    cells[x-1][y+1],
                    cells[x-1][y],
                    cells[x-1][y-1]
                )
            }
        } else {
            if( y === 0) {
                neighborCells.push(
                    cells[x+1][y+1],
                    cells[x+1][y],
                    cells[x][y+1],
                    cells[x-1][y+1],
                    cells[x-1][y],
                )
            } else if ( y === col-1){
                neighborCells.push(
                    cells[x+1][y],
                    cells[x+1][y-1],
                    cells[x][y-1],
                    cells[x-1][y],
                    cells[x-1][y-1]
                )
            } else {
                neighborCells.push(
                    cells[x+1][y+1],
                    cells[x+1][y],
                    cells[x+1][y-1],
                    cells[x][y+1],
                    cells[x][y-1],
                    cells[x-1][y+1],
                    cells[x-1][y],
                    cells[x-1][y-1]
                )
            }
        }
        return neighborCells;
    }

    function gameOver() {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if(cells[i][j].getAttribute('isMine') === 'true'){
                    cells[i][j].classList.remove('close');
                    cells[i][j].classList.add('mine');
                }
            }
        }
        isOver = true;
        result();
    }

    function gameClear(){
        isOver = true;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if(cells[i][j].getAttribute('isMine') === 'true'){
                    if(!cells[i][j].classList.contains('flag')){
                        cells[i][j].classList.add('flag');
                    }
                }
            }
        }
        result();
    }

    function result(){
        let openedMineNum = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if(cells[i][j].classList.contains('mine')){
                    openedMineNum++;
                }
            }
        }
        if (openedMineNum > 0) {
            alert('Game Over.');
        } else {
            alert('Congratulation!');
        }
    }

    function restart(){
        while (map.hasChildNodes()) {
            map.removeChild(map.firstChild);
        }
        cells.splice(0, cells.length);
        row = null;
        col = null;
        mineNum = null;
        isOver = false;
        cellsLeft = null;
        remainMineNum = null;
        time = 0;
        document.getElementById("play").classList.remove('playing');
        start();
    }
}

init();