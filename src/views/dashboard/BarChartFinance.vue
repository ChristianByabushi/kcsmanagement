<template>
    <v-card elevation="3" style="height: 260px;">
        <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
    </v-card>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar, Pie },
    props: {
        monthyAnalysisData: [],
    },

    data() {
        return {
            loaded: false,
            chartData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Total Expenses', // Descriptive label for clarity
                        data: [40, 20, 12, 69, 40, 20, 12, 69, 40, 20, 12, 69],
                        backgroundColor: 'indigo', // Customize color
                        borderColor: 'rgba(255, 99, 132, 1)' // Customize border color
                    },
                    {
                        label: 'Total Dettes', // Descriptive label for clarity
                        data: [10, 30, 5, 80, 20, 50, 8, 30, 20, 20, 50, 8, 30],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Customize color
                        borderColor: 'rgba(54, 162, 235, 1)' // Customize border color
                    },
                    {
                        label: 'Total Due', // Descriptive label for clarity
                        data: [1, 3, 5, 80, 20, 40, 80, 50, 80, 20, 100, 8, 30],
                        backgroundColor: '#fef45', // Customize color
                        borderColor: 'rgba(214, 112, 235, 1)' // Customize border color
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                backgroundColor: 'indigo',
                color: 'dark',
                label: 'Bar Dataset',
            }
        }
    },
    async mounted() {
        this.loaded = false
        let expenses = []
        let payments = []
        let difference = []
        this.monthyAnalysisData.forEach(item => {
            expenses.push(item.costOrderMonth)
            payments.push(item.costPaymentOrder)
            difference.push(item.Difference)
        });
        this.loaded = true
    },

    methods: {
        async try() {

        }
    }
}
</script>