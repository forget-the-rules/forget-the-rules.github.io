function loadImage(src) {
    return new Promise(function (resolve) {
        let image = new Image()
        image.src = src
        image.addEventListener("load", function () {
            resolve(image)
        })
    })
}

function overlapping (rect1, rect2) {
    let isRight = rect2.left > rect1.right
    let isLeft = rect2.right < rect1.left
    let isTop = rect2.bottom < rect1.top
    let isBottom = rect2.top > rect1.bottom
    let notOverlapping = isRight || isLeft || isTop || isBottom
    let isOverlapping = !notOverlapping 
    return isOverlapping  
}

window.addEventListener("DOMContentLoaded", async function () {
    let canvas = document.getElementById("game")
    let context = canvas.getContext("2d")
    let width = canvas.width
    let height = canvas.height
    let fps = 50

    context.fillStyle = "white"

    let space = await loadImage("space.jpg")

    let victory = await loadImage("victory.png")
    let victoryScale = 1
    let victoryWidth = victoryScale * victory.width
    let victoryHeight = victoryScale * victory.height
    let victoryLeft = (width - victoryWidth) / 2
    let victoryTop = (height - victoryHeight) / 2

    let wasted = await loadImage("wasted.png")
    let wastedScale = 1
    let wastedWidth = wastedScale * wasted.width
    let wastedHeight = wastedScale * wasted.height
    let wastedLeft = (width - wastedWidth) / 2
    let wastedTop = (height - wastedHeight) / 2

    let winner = undefined
          
    let dragon = await loadImage("dragon.webp")
    let dragonScale = 0.35
    let dragonWidth = dragonScale * dragon.width
    let dragonHeight = dragonScale * dragon.height
    let dragonLeft = 0 
    let dragonTop = 0
    let dragonMovingRight = true
    let dragonSpeed = (width - dragonWidth) / fps / 1
    let isDragonHit = false 

    let crossbow = await loadImage("crossbow.png")
    let crossbowScale = 0.25
    let crossbowWidth = crossbowScale * crossbow.width
    let crossbowHeight = crossbowScale * crossbow.height
    let crossbowLeft = (width - crossbowWidth) / 2
    let crossbowTop = height - crossbowHeight
    let isCrossbowHit = false

    let arrow = await loadImage("arrow.png")
    let arrowScale = 0.15 
    let arrowWidth = arrowScale * arrow.width
    let arrowHeight = arrowScale * arrow.height
    let arrowLeft = 0
    let arrowTop = height - arrowHeight 
    let isArrowFired = false  
    let arrowSpeed = height / fps / 0.4 
    
    let fireball = await loadImage("fireball.webp")
    let fireballScale = 0.1
    let fireballWidth = fireballScale * fireball.width
    let fireballHeight = fireballScale * fireball.height
    let fireballLeft = 200
    let fireballTop = 125
    let fireballSpeed = (height - 125) / fps / (1 / Math.PI)
    
    let heart = await loadImage("heart.png")
    let heartScale = 0.03
    let heartWidth = heartScale * heart.width
    let heartHeight = heartScale * heart.height
    let dragonHearts = 10
    let crossbowHearts = 5 
    
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
        detectCollisions()
    }, 1000 / fps);

    function animate(){
        context.drawImage(space, 0, 0, width, height)
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
        for (let i = 0; i < dragonHearts; i = i + 1) {
            context.drawImage(heart, heartWidth * i, 0, heartWidth, heartHeight)
        }
        for (let i = 0; i < crossbowHearts; i = i + 1) {
            context.drawImage(heart, width - heartWidth - heartWidth * i, height - heartHeight, heartWidth, heartHeight)
        }
        switch (winner) {
            case "crossbow":
                context.drawImage(victory, victoryLeft, victoryTop, victoryWidth, victoryHeight)
                break
            case "dragon":
                context.drawImage(wasted, wastedLeft, wastedTop, wastedWidth, wastedHeight)
                break
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
                isDragonHit = false
            }
        }
    }  
    
    function moveFireball() {
        fireballTop = fireballTop + fireballSpeed
        if (fireballTop >= height) {
            isCrossbowHit = false
            fireballTop = 125
            if (dragonMovingRight) {
                fireballLeft = dragonLeft + 200
            } else {
                fireballLeft = dragonLeft + dragonWidth - 200
            }
        }
    }

    function detectCollisions() {
        let dragonRect = {
            left: dragonLeft, 
            top: dragonTop, 
            right: dragonLeft + dragonWidth,
            bottom: dragonTop + dragonHeight 
        }
        let crossbowRect = {
            left: crossbowLeft, 
            top: crossbowTop, 
            right: crossbowLeft + crossbowWidth,
            bottom: crossbowTop + crossbowHeight 
        }
        let arrowRect = {
            left: arrowLeft, 
            top: arrowTop, 
            right: arrowLeft + arrowWidth,
            bottom: arrowTop + arrowHeight
        }
        let fireballRect = {
            left: fireballLeft, 
            top: fireballTop, 
            right: fireballLeft + fireballWidth,
            bottom: fireballTop + fireballHeight 
        }
        if (!isDragonHit && overlapping(dragonRect, arrowRect)) {
            isDragonHit = true
            dragonHearts = dragonHearts - 1
            if (dragonHearts === 0) {
                clearInterval(interval)
                winner = "crossbow"
                animate()
            }
        } 
        if (!isCrossbowHit && overlapping(crossbowRect, fireballRect)) {
            isCrossbowHit = true
            crossbowHearts = crossbowHearts - 1
            if (crossbowHearts === 0) {
                clearInterval(interval)
                winner = "dragon"
                animate()
            }
        }
    }

})