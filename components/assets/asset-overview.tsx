import Loader from '@/components/loader-component'
import { CoinData } from '@/types/coingecko-types'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { ChartCandlestickIcon, Globe2, Twitter } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ContentContainer from '../containers/content-container'
interface ChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

interface AssetOverviewProps {
  coinData: CoinData
}

const AssetOverview = ({ coinData }: AssetOverviewProps) => {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loadingChartData, setLoadingChartData] = useState(false)

  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChartData(true)
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinData.id}/market_chart?vs_currency=usd&days=7`,
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
  }, [coinData.id])

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
      height: 300,
      style: {
        fontFamily: 'inherit',
      },
    },
    title: {
      text: '7-Day Price Trend',
      style: {
        fontSize: '16px',
        fontWeight: 'normal',
      },
    },
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%Y-%m-%d}',
      },
    },
    yAxis: {
      title: {
        text: 'Price (USD)',
      },
      labels: {
        format: '${value}',
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<small>{point.key}</small><table>',
      pointFormat:
        '<tr><td style="color: {series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>${point.y}</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 2,
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: true,
          radius: 2,
        },
      },
    },
    series: [
      {
        name: 'Price',
        type: 'spline',
        data:
          chartData?.prices.map(([timestamp, price]) => [timestamp, price]) ||
          [],
        color: '#3B82F6',
        lineWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-4">
      <ContentContainer heading="Price Trend">
        {loadingChartData ? (
          <div className="flex flex-col justify-center items-center h-[300px]">
            <Loader message="Loading price trend..." />
          </div>
        ) : (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        )}
      </ContentContainer>

      <ContentContainer heading={`About ${coinData.name}`}>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: coinData.description.en }}
        />
      </ContentContainer>

      <ContentContainer heading="Resources">
        <div className="flex gap-4">
          {coinData.links.homepage[0] && (
            <Link
              href={coinData.links.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline flex gap-2 items-center"
            >
              <Globe2 className="w-4 h-4" />
              Website
            </Link>
          )}
          {coinData.links.blockchain_site[0] && (
            <Link
              href={coinData.links.blockchain_site[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline flex gap-2 items-center"
            >
              <ChartCandlestickIcon className="w-4 h-4" />
              Explorer
            </Link>
          )}
          {coinData.links.twitter_screen_name && (
            <Link
              href={`https://twitter.com/${coinData.links.twitter_screen_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline flex gap-2 items-center"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Link>
          )}
          {coinData.links.subreddit_url && (
            <Link
              href={coinData.links.subreddit_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline flex gap-2 items-center"
            >
              Reddit
            </Link>
          )}
        </div>
      </ContentContainer>
    </div>
  )
}

export default AssetOverview
