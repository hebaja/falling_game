let MOVEMENT = 2

export function getRandomX() {
	return Phaser.Math.Between(1, 1024)
}

export function getRandomMovement() {
	return Phaser.Math.Between(-100, -500) * MOVEMENT
}

export function getMovement() {
	return MOVEMENT
}
