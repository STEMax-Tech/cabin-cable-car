function doSomething (value: number, min: number, max: number, col: number) {
    for (let index = 0; index <= Math.map(value, min, max, 0, 4); index++) {
        led.plot(col, Math.map(value, min, max, 0, 4) - index)
    }
}
let delayCount = 0
let isRunning = false
let isForward = true
let speed = 100
let lightThreshold = 100
basic.showLeds(`
    . . # . .
    . # # # .
    # # # # #
    # # # # #
    . # . # .
    `)
basic.pause(1000)
basic.forever(function () {
    if (input.buttonIsPressed(Button.B)) {
        isRunning = true
    }
    if (input.buttonIsPressed(Button.A)) {
        lightThreshold += 10
        if (lightThreshold > 200) {
            lightThreshold = 50
            basic.clearScreen()
        }
        basic.pause(200)
    }
})
basic.forever(function () {
    if (isRunning) {
        if (pins.analogReadPin(AnalogReadWritePin.P2) <= lightThreshold) {
            while (pins.analogReadPin(AnalogReadWritePin.P2) <= lightThreshold) {
                delayCount += 1
                serial.writeNumbers([delayCount])
                if (delayCount == 40) {
                    isForward = !(isForward)
                    isRunning = false
                    basic.clearScreen()
                    serial.writeLine("" + isRunning + "     " + isForward)
                    serial.writeNumbers([delayCount])
                } else if (delayCount > 40) {
                    break;
                }
                basic.pause(50)
            }
            delayCount = 0
        }
    }
    serial.writeNumbers([lightThreshold])
})
basic.forever(function () {
    if (isRunning) {
        if (isForward) {
            ContinuousServo.spin_one_way_with_speed(AnalogPin.P0, speed)
            ContinuousServo.spin_one_way_with_speed(AnalogPin.P1, speed)
            basic.showArrow(ArrowNames.West)
        } else {
            ContinuousServo.spin_other_way_with_speed(AnalogPin.P0, speed)
            ContinuousServo.spin_other_way_with_speed(AnalogPin.P1, speed)
            basic.showArrow(ArrowNames.East)
        }
    } else {
        ContinuousServo.turn_off_motor(DigitalPin.P0)
        ContinuousServo.turn_off_motor(DigitalPin.P1)
        doSomething(lightThreshold, 60, 100, 3)
        doSomething(lightThreshold, 110, 150, 2)
        doSomething(lightThreshold, 160, 200, 1)
        basic.pause(250)
        basic.clearScreen()
        basic.pause(250)
    }
})
