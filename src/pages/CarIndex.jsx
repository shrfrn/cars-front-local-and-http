import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

import { carService } from "../services/car.service.local.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { CarFilter } from "../cmps/CarFilter.jsx"
import { CarList } from "../cmps/CarList.jsx"

export function CarIndex() {

    const [cars, setCars] = useState(null)
    const [filterBy, setFilterBy] = useState(carService.getDefaultFilter())

    useEffect(() => {
        fetchData()
    }, [filterBy])

    async function fetchData() {
        try {
            const cars = await carService.query(filterBy)
            setCars(cars)
        } catch (err) {
            console.log('err:', err)
        }
    }

    async function onRemoveCar(carId) {
        try {
            await carService.remove(carId)
            setCars(prevCars => prevCars.filter(car => car._id !== carId))
            showSuccessMsg(`Car Removed! ${carId}`)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Problem Removing ' + carId)
        }
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    if (!cars) return <div>Loading...</div>
    return (
        <section className="car-index">
            <CarFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <Link to="/car/edit" >Add Car</Link>
            <CarList cars={cars} onRemoveCar={onRemoveCar} />
        </section>
    )
}