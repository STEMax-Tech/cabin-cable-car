let delayCount = 0
let isRunning = false
let isLight = true
let isForward = true
let speed = 50
basic.forever(function () {
    if (input.buttonIsPressed(Button.B)) {
        isRunning = true
    }
    if (input.buttonIsPressed(Button.A)) {
        speed += 10
        if (speed > 100) {
            speed = 30
        }
        basic.pause(200)
    }
})
basic.forever(function () {
    if (isRunning) {
        if (input.lightLevel() <= 0) {
            while (input.lightLevel() <= 0) {
                delayCount += 1
                serial.writeNumbers([delayCount])
                if (delayCount == 20) {
                    isForward = !(isForward)
                    isRunning = false
                    serial.writeLine("" + isRunning + "     " + isForward)
                    serial.writeNumbers([delayCount])
                } else if (delayCount > 20) {
                    break;
                }
                basic.pause(100)
            }
            delayCount = 0
        }
    }
})
basic.forever(function () {
    if (isRunning) {
        if (isForward) {
            ContinuousServo.spin_one_way_with_speed(AnalogPin.P0, speed)
            ContinuousServo.spin_one_way_with_speed(AnalogPin.P1, speed)
            basic.showLeds(`
                . . # . .
                . # . . .
                # # # # #
                . # . . .
                . . # . .
                `)
        } else {
            ContinuousServo.spin_other_way_with_speed(AnalogPin.P0, speed)
            ContinuousServo.spin_other_way_with_speed(AnalogPin.P1, speed)
            basic.showLeds(`
                . . # . .
                . . . # .
                # # # # #
                . . . # .
                . . # . .
                `)
        }
    } else {
        ContinuousServo.turn_off_motor(DigitalPin.P0)
        ContinuousServo.turn_off_motor(DigitalPin.P1)
        basic.showIcon(IconNames.Diamond)
        basic.showIcon(IconNames.SmallDiamond)
    }
})
