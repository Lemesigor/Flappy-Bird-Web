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
 * @param {boolean} reverse
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

// const b = new Barrier(false)
// b.setHeight(200)
// document.querySelector('[wm-flappy]').appendChild(b.element)

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
        parseInt(this.element.style.left.split('px')[0]) 
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

const b = new DoubleBarrier(700, 200, 800)
document.querySelector('[wm-flappy]').appendChild(b.element)