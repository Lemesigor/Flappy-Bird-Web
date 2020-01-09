/**
 * 
 * ######## TODO ###########
 *  -  End the game also when the bird colides agasint the top and bottom limits of the screen
 *  -  When the bird colides, create a interface giving the user the option to try again
 * 
 */

/**
 * 
 * @param {string} tagName 
 * @param {string} className
 * @return {HTMLBaseElement} element
 * Aux function to create elements with a class 
 */
function newElement(tagName,className){
    const element = document.createElement(tagName)
    element.classList.add(className)
    return element
}

/**
 * 
 * @param {boolean} reverse to tell if its a top or bottom barrier
 * 
 * Constructor function to set new barriers and define its main properties such as its position and height 
 */
function Barrier (reverse = false){
    this.element = newElement('div', 'barrier')

    const border = newElement('div','barrier-border')
    const body = newElement('div', 'barrier-body')

    if (reverse){
        this.element.appendChild(body)
        this.element.appendChild(border)
    } else if (!reverse) {
        this.element.appendChild(border)
        this.element.appendChild(body)
    }

    this.setHeight = bodyHeight => {
        body.style.height = `${bodyHeight}px`
    }
}



/**
 * 
 * @param {*} barrierHeight 
 * @param {*} distance distance between the top and bottom barrier
 * @param {*} xPosition
 * 
 * Constructor to create a pair of a bottom and top barrier and sort the distance between each barrier 
 */
function DoubleBarrier(barrierHeight, distance, xPosition){
    this.element = newElement ( 'div', 'barriers')

    this.topBarrier = new Barrier(true)
    this.bottomBarrier = new Barrier(false)

    this.element.appendChild(this.topBarrier.element)
    this.element.appendChild(this.bottomBarrier.element)

    //Function to random calculate the distante between the top and bottom barrier
    this.sortDistance = () => {
        const topDistance = Math.random() * (barrierHeight - distance)
        const bottomDistance = barrierHeight - distance - topDistance

        this.topBarrier.setHeight(topDistance)
        this.bottomBarrier.setHeight(bottomDistance)
    }

    //Function to get the number that represents the barrier position
    this.getX = ()=> {
        return parseInt(this.element.style.left.split('px')[0]) 
    }
    //Function to set the barrier position
    this.setX = xPosition => {
        this.element.style.left = `${xPosition}px`
    }
    //Function to get the distance between each pair of barrier
    this.getDistance = () => this.element.clientWidth

    //Finally, sort the distance between each barrier and set its x-axis position
    this.sortDistance()
    this.setX(xPosition)
}   
/**
 * 
 * @param {*} displayHeight 
 * @param {*} displayWidth 
 * @param {*} distance 
 * @param {*} spaceBetween 
 * @param {*} addScore 
 * 
 * 
 */
function Barriers (displayHeight, displayWidth, distance, spaceBetween, addScore){
    this.pairs = [
        new DoubleBarrier(displayHeight,distance,displayWidth),
        new DoubleBarrier(displayHeight,distance,displayWidth + spaceBetween),
        new DoubleBarrier(displayHeight,distance,displayWidth + spaceBetween * 2),
        new DoubleBarrier(displayHeight,distance,displayWidth + spaceBetween * 3)
    ]

    const displacement = 3 //the speed of the barriers animation

    //Make every barrier go to the right side of screen again with a random height
    this.animation = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - displacement)
            //If the barrier is in the 0 position in the x axis, put it to the other side of the screen again
            if(pair.getX() < -pair.getDistance()){
                pair.setX(pair.getX() + spaceBetween * this.pairs.length)
                pair.sortDistance()
            }

            //If the barrir cross the middle of the screen, add a point to the user
            const middle = displayWidth / 2
            const crossedMiddle = pair.getX() + displacement >= middle && pair.getX() < middle
            
            if (crossedMiddle)
                addScore()

        });
    }
}

/**
 * 
 * @param {string} gameHeight 
 * Constructor to create the bird object and control its animation
 */
function Bird (gameHeight){
    let flying = false

    this.element = newElement('img', 'bird')
    this.element.src = 'imgs/bird.png'

    this.getY = () => {
        return parseInt(this.element.style.bottom.split('px')[0])
    }
    this.setY = y => {
        this.element.style.bottom = `${y}px`
    }

    window.onkeydown = e => {
        flying=true
    }
    window.onkeyup = e => {
        flying = false
    }

    this.animation = () => {
        const newY = this.getY() + (flying? 8 : -5) //control the speed of flyng and falling
        const maxHeight = gameHeight - this.element.clientHeight

        //Tests the bird height
        if (newY <= 0){
            this.setY(0)
        } else if (newY >= maxHeight){
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }
    }

    this.setY(gameHeight /2)
}

/**
 * Function to add points to the user score
 */
function Progress(){
    this.element = newElement('span', 'progress')

    this.addScore = score =>{
        this.element.innerHTML = score
    }

    this.addScore(0)
}

/**
 * 
 * @param  bird 
 * @param  barriers
 * 
 * Function that tests in every "movement" of the bird if it colide against a barrier and end the game 
 */
function colide(bird, barriers) {
    let colide = false
    barriers.pairs.forEach(barriersPair => {
        if (!colide) {
            const top = barriersPair.topBarrier.element
            const bottom = barriersPair.bottomBarrier.element
            colide = areOverlaid(bird.element, top)
                || areOverlaid(bird.element, bottom)
        }
    })
    return colide
}

/**
 * 
 * @param  elementA 
 * @param  elementB
 * Aux function to test the overlaid of the barriers in order to create the colide event 
 */
function areOverlaid(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}




function main(){
    let score = 0

    const gameArea = document.querySelector('[wm-flappy]')
    const gameHeight = gameArea.clientHeight
    const gameWidth = gameArea.clientWidth

    const progres = new Progress()
    const barriers = new Barriers(gameHeight,gameWidth,200,400, ()=> progres.addScore(score++))

    const bird = new Bird(gameHeight)

    gameArea.appendChild(progres.element)
    gameArea.appendChild(bird.element)
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        const time = setInterval(() => {
            barriers.animation()
            bird.animation()

            if(colide(bird,barriers)){
                clearInterval(time)
            }
        },20)
    }
}



new main().start()