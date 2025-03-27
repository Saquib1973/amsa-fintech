import { useEffect, useState } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Loader from '@/components/loader-component'
import { CoinData } from '@/types/coingecko-types'
import ContentContainer from './../containers/content-container'

interface ChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

interface AssetChartProps {
  coinData: CoinData
  selectedCurrency: string
  currencySymbol: string
}

const AssetChart = ({
  coinData,
  selectedCurrency,
  currencySymbol,
}: AssetChartProps) => {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loadingChartData, setLoadingChartData] = useState(false)

  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChartData(true)
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinData.id}/market_chart?vs_currency=${selectedCurrency}&days=30`,
          {
            headers: {
              accept: 'application/json',
              'x-cg-demo-api-key': 'CG-1Ms2BtmhRRJT4dAEvyFt1Ldi',
            },
          }
        )
        const data = await response.json()
        setChartData(data)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoadingChartData(false)
      }
    }

    if (coinData.id) {
      fetchChartData()
    }
  }, [coinData.id, selectedCurrency])

  const getChartOptions = (type: 'candlestick' | 'line' | 'area'): Highcharts.Options => {
    const priceData = chartData?.prices.map(([timestamp, price]) => [timestamp, price]) || []
    const candlestickData = chartData?.prices.map(([timestamp, price]) => [
      timestamp,
      price,
      price,
      price,
      price,
    ]) || []

    const baseOptions: Highcharts.Options = {
      chart: {
        height: 400,
      },
      rangeSelector: {
        selected: 1,
        buttons: [
          {
            type: 'day',
            count: 1,
            text: '1D',
          },
          {
            type: 'week',
            count: 1,
            text: '1W',
          },
          {
            type: 'month',
            count: 1,
            text: '1M',
          },
          {
            type: 'month',
            count: 3,
            text: '3M',
          },
          {
            type: 'month',
            count: 6,
            text: '6M',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'year',
            count: 1,
            text: '1Y',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
      },
      yAxis: {
        labels: {
          format: `{value} ${currencySymbol}`,
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.key}</small><table>',
        pointFormat:
          '<tr><td style="color: {series.color}">{series.name}: </td>' +
          '<td style="text-align: right"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        valueDecimals: 2,
      },
    }

    switch (type) {
      case 'candlestick':
        return {
          ...baseOptions,
          title: {
            text: 'Candlestick Chart',
            style: {
              fontSize: '16px',
              fontWeight: 'normal',
            },
          },
          series: [
            {
              type: 'candlestick',
              name: 'Price',
              data: candlestickData,
            },
          ],
        }
      case 'line':
        return {
          ...baseOptions,
          title: {
            text: 'Line Chart',
            style: {
              fontSize: '16px',
              fontWeight: 'normal',
            },
          },
          series: [
            {
              type: 'line',
              name: 'Price',
              data: priceData,
              color: '#3B82F6',
              lineWidth: 2,
            },
          ],
        }
      case 'area':
        return {
          ...baseOptions,
          title: {
            text: 'Area Chart',
            style: {
              fontSize: '16px',
              fontWeight: 'normal',
            },
          },
          series: [
            {
              type: 'area',
              name: 'Price',
              data: priceData,
              color: '#3B82F6',
              fillOpacity: 0.2,
            },
          ],
        }
      default:
        return baseOptions
    }
  }

  return (
    <div className="w-full space-y-8">
      <ContentContainer heading="Price Charts">
        {loadingChartData ? (
          <div className="flex flex-col justify-center items-center h-[400px]">
            <Loader message="Loading chart data..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            <div className="w-full">
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={getChartOptions('candlestick')}
              />
            </div>
            <div className="w-full">
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={getChartOptions('line')}
              />
            </div>
            <div className="w-full">
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={getChartOptions('area')}
              />
            </div>
          </div>
        )}
      </ContentContainer>

      <ContentContainer heading={`About ${coinData.name}`}>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: coinData.description.en }}
        />
      </ContentContainer>
    </div>
  )
}

export default AssetChart
