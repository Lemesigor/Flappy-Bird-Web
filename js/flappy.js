

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

const barreiras = new Barriers(700,100,200,400, 500)

const bird = new Bird (700)

const gameArea = document.querySelector('[wm-flappy]')

gameArea.appendChild(bird.element)
barreiras.pairs.forEach(pair => gameArea.appendChild(pair.element))

setInterval(()=>{
    barreiras.animation()
    bird.animation()
},20)