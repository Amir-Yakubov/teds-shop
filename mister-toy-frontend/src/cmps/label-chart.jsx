import React, { useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import { loadToys } from '../store/toy.action'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

ChartJS.register(ArcElement, Tooltip, Legend)

export function LabelChart() {
    const toys = useSelector((storeState) => storeState.toyModule.toys)
    const shopLabels = []

    useEffect(() => {
        onLoadToys()
    }, [])

    async function onLoadToys() {
        try {
            await loadToys()
            showSuccessMsg('Toys loaded')
        } catch (err) {
            showErrorMsg('Cannot load toys')
        }
    }

    getLabels()

    function getLabels() {
        if (!toys) return
        toys.map(toy => {
            toy.labels.map(label => {
                if (shopLabels.find(shopLabel => shopLabel === label)) return
                shopLabels.push(label)
            })
        })
        console.log(shopLabels)

    }

    function getDataFromToys() {
        const mapArray = shopLabels.map(shopLabel => {
            let count = 0
            toys.map(toy => {
                toy.labels.map(label => {
                    if (label === shopLabel) count++
                })
            })
            return { shopLabel, count }
        })
        const data = mapArray.map(item => item.count)
        return data
    }

    const data = {
        labels: shopLabels,
        datasets: [
            {
                label: 'items',
                data: getDataFromToys(),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 2,
            },
        ],
    }

    return (
        <div style={{ width: '40%' }}>
            <Doughnut data={data} />
        </div>
    )
}