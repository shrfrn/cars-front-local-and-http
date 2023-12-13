import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = '//localhost:3030/api/car/'

export const carService = {
	query,
	get,
	remove,
	save,
	getEmptyCar,
	getDefaultFilter,
}

async function query(filterBy = {}) {
    var { data: cars } = await axios.get(BASE_URL)

	if (filterBy.txt) {
		const regExp = new RegExp(filterBy.txt, 'i')
		cars = cars.filter(car => regExp.test(car.vendor))
	}
    
	if (filterBy.minSpeed) {
		cars = cars.filter(car => car.speed >= filterBy.minSpeed)
	}
	return cars
}

async function get(carId) {
    const url = BASE_URL + carId
    
    var { data: car } = await axios.get(url)
    return car
}

async function remove(carId) {
    const url = BASE_URL + carId + '/remove'
    var { data: res } = await axios.get(url)
    return res
}

async function save(car) {
    const queryParams = 
        `?_id=${car._id || ''}&vendor=${car.vendor}&speed=${car.speed}`
    const url = BASE_URL + 'save' + queryParams 

    const { data: savedCar } = await axios.get(url)
    return savedCar
}

function getEmptyCar(vendor = '', speed = '') {
	return { vendor, speed }
}

function getDefaultFilter() {
	return { txt: '', minSpeed: '' }
}