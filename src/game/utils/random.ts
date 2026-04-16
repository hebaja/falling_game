// let MOVEMENT = 2
// let CLOUD_MOVEMENT = 1

// export function getRandomX() {
// 	return Phaser.Math.Between(1, 1024)
// }

// export function getRandomMovement() {
// 	return Phaser.Math.Between(-100, -500) * MOVEMENT
// }

// export function getMovement() {
// 	return MOVEMENT
// }

// export function flipMovement() {
// 	MOVEMENT *= -1
// 	CLOUD_MOVEMENT *= -1
// }

// export function getCloudMovement() {
// 	return CLOUD_MOVEMENT
// }

export const speedMultiplier = { value: 1 }

let MOVEMENT = 2;
let CLOUD_MOVEMENT = 1;
export function getRandomX() {
		return Phaser.Math.Between(1, 1024);
}
export function getRandomMovement() {
	return Phaser.Math.Between(-100, -500) * (MOVEMENT * speedMultiplier.value);
}

export function getMovement() {
	return MOVEMENT * speedMultiplier.value;
}

export function getCloudMovement() {
	return CLOUD_MOVEMENT * speedMultiplier.value;
}
