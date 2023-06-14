function loadImage(src) {
    return new Promise(function (resolve) {
        let image = new Image()
        image.src = src
        image.addEventListener("load", function () {
            resolve(image)
        })
    })
}
window.addEventListener("DOMContentLoaded", async function () {
    let canvas = document.getElementById("game")
    let context = canvas.getContext("2d")
    let width = canvas.width
    let height = canvas.height
    let fps = 50

    context.fillStyle = "white"
   
    let dragon = await loadImage("dragon.webp")
    let dragonScale = 0.35
    let dragonWidth = dragonScale * dragon.width
    let dragonHeight = dragonScale * dragon.height
    let dragonLeft = 0 
    let dragonTop = 0
    let dragonMovingRight = true
    let dragonSpeed = (width - dragonWidth) / fps / 1

    let crossbow = await loadImage("crossbow.png")
    let crossbowScale = 0.25
    let crossbowWidth = crossbowScale * crossbow.width
    let crossbowHeight = crossbowScale * crossbow.height
    let crossbowLeft = (width - crossbowWidth) / 2
    let crossbowTop = height - crossbowHeight

    let arrow = await loadImage("arrow.png")
    let arrowScale = 0.15 
    let arrowWidth = arrowScale * arrow.width
    let arrowHeight = arrowScale * arrow.height
    let arrowLeft = 0
    let arrowTop = height - arrowHeight 
    let isArrowFired = false  
    let arrowSpeed = height / fps / 1.5 
    
    let fireball = await loadImage("fireball.webp")
    let fireballScale = 0.1
    let fireballWidth = fireballScale * fireball.width
    let fireballHeight = fireballScale * fireball.height
    let fireballLeft = 200
    let fireballTop = 125
    let fireballSpeed = (height - 125) / fps / (1 / Math.PI) 

    canvas.addEventListener("mousemove", function (event) {
        let left = event.offsetX - crossbowWidth / 2
        if (left < 0) left = 0
        if (left > width - crossbowWidth) left = width - crossbowWidth
        crossbowLeft = left
    })

    canvas.addEventListener("click", function () {
        if (!isArrowFired) {
            let crossbowCenter = crossbowLeft + crossbowWidth / 2
            let left = crossbowCenter - arrowWidth / 2
            arrowLeft = left 
            arrowTop = height - arrowHeight
            isArrowFired = true
        }
    })

    let interval = setInterval(() => {
        animate()
        moveDragon()
        moveArrow()
        moveFireball()
    }, 1000 / fps);

    function animate(){
        context.fillRect(0, 0, width, height)
        if (dragonMovingRight) {
            context.drawImage(dragon, dragonLeft, dragonTop, dragonWidth, dragonHeight)
        } else {
            context.save()
            context.translate(width, 0)
            context.scale(-1, 1)
            context.drawImage(dragon, width - dragonLeft - dragonWidth, dragonTop, dragonWidth, dragonHeight)
            context.restore()
        }
        context.drawImage(crossbow, crossbowLeft, crossbowTop, crossbowWidth, crossbowHeight)
        if (isArrowFired) {
            context.drawImage(arrow, arrowLeft, arrowTop, arrowWidth, arrowHeight)
        }
        if (dragonMovingRight) {
            context.drawImage(fireball, fireballLeft, fireballTop, fireballWidth, fireballHeight)
        } else {
            context.save()
            context.translate(width, 0)
            context.scale(-1, 1)
            context.drawImage(fireball, width - fireballLeft - fireballWidth, fireballTop, fireballWidth, fireballHeight)
            context.restore()
        }
    }

    function moveDragon() {
        if (dragonMovingRight) {
            dragonLeft = dragonLeft + dragonSpeed
            if (dragonLeft >= width - dragonWidth) {
                dragonMovingRight = false
            }
        } else {
            dragonLeft = dragonLeft - dragonSpeed
            if (dragonLeft <= 0) {
                dragonMovingRight = true
            }
        }
    }

    function moveArrow() {
        if (isArrowFired) {
            arrowTop = arrowTop - arrowSpeed
            if (arrowTop <= -arrowHeight) {
                isArrowFired = false
            }
        }
    }  
    
    function moveFireball() {
        fireballTop = fireballTop + fireballSpeed
        if (fireballTop >= height) {
            fireballTop = 125
            if (dragonMovingRight) {
                fireballLeft = dragonLeft + 200
            } else {
                fireballLeft = dragonLeft + dragonWidth - 200
            }
        }
    }

})