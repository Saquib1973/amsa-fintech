import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { TransactionStatus, TransactionMethod } from '@prisma/client'


// Map Transak statuses to our database enum values
const mapTransakStatusToDbStatus = (
  transakStatus: string
): TransactionStatus => {
  const statusMap: Record<string, TransactionStatus> = {
    AWAITING_PAYMENT_FROM_USER: 'PENDING',
    ORDER_CREATED: 'PENDING',
    ORDER_PROCESSING: 'PROCESSING',
    ORDER_COMPLETED: 'COMPLETED',
    ORDER_FAILED: 'FAILED',
    ORDER_CANCELLED: 'CANCELLED',
    ORDER_EXPIRED: 'EXPIRED',
    PAYMENT_PENDING: 'PENDING',
    PAYMENT_PROCESSING: 'PROCESSING',
    PAYMENT_COMPLETED: 'COMPLETED',
    PAYMENT_FAILED: 'FAILED',
    PAYMENT_CANCELLED: 'CANCELLED',
    PAYMENT_EXPIRED: 'EXPIRED',
    COMPLETED: 'COMPLETED',
    SUCCESS: 'COMPLETED',
    SUCCESSFUL: 'COMPLETED',
    DONE: 'COMPLETED',
    FINALIZED: 'COMPLETED',
    SETTLED: 'COMPLETED',
    CONFIRMED: 'COMPLETED',
  }

  return statusMap[transakStatus] || 'PENDING'
}

export async function POST(req: Request) {
  const session = await getSession()
  const user_id = session?.user.id
  if (!user_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  let id: string | undefined, isBuyOrSell: string | undefined, fiatAmount: number | undefined, fiatCurrency: string | undefined, cryptoCurrency: string | undefined, status: string | undefined
  
  try {
    const body = await req.json()
    const {
      id: orderId,
      isBuyOrSell: buyOrSell, // This should be 'SELL' for off-ramp
      fiatAmount: fiatAmt,
      fiatCurrency: fiatCurr,
      cryptoCurrency: cryptoCurr,
      walletLink,
      walletAddress,
      network,
      status: orderStatus,
      paymentOptionId,
      fiatAmountInUsd,
      statusHistories,
      amountPaid,
      cryptoAmount,
      totalFeeInFiat,
      countryCode,
      stateCode,
      statusReason,
      transakFeeAmount,
    } = body ?? {}
    
    // Assign to outer scope variables
    id = orderId
    isBuyOrSell = buyOrSell
    fiatAmount = fiatAmt
    fiatCurrency = fiatCurr
    cryptoCurrency = cryptoCurr
    status = orderStatus

    console.log('Saving transaction with status:', status, 'Type:', isBuyOrSell)
    console.log('Transaction data being saved:', {
      id,
      isBuyOrSell,
      fiatAmount,
      fiatCurrency,
      cryptoCurrency,
      walletLink,
      walletAddress,
      network,
      status,
      userId: user_id
    })

    // Map the Transak status to our database enum
    const mappedStatus = mapTransakStatusToDbStatus(status || 'PENDING')

    const toInt = (v: unknown, def: number = 0) => {
      if (v === undefined || v === null || v === '') return def
      const n = Number(v)
      return Number.isFinite(n) ? Math.round(n) : def
    }
    const toFloat = (v: unknown, def: number = 0) => {
      if (v === undefined || v === null || v === '') return def
      const n = Number(v)
      return Number.isFinite(n) ? n : def
    }
    const toString = (v: unknown, def: string = '') => {
      if (v === undefined || v === null) return def
      return String(v)
    }

    // Compute final fields (authoritative) prior to DB transaction to avoid long-running locks
    const finalFields = {
      fiatAmount: toInt(fiatAmount, 0),
      amountPaid: amountPaid === undefined ? null : toInt(amountPaid),
      cryptoAmount: cryptoAmount === undefined ? null : toFloat(cryptoAmount),
      totalFeeInFiat:
        totalFeeInFiat === undefined ? null : toFloat(totalFeeInFiat),
      fiatCurrency: toString(fiatCurrency || 'USD'),
      cryptoCurrency: toString(cryptoCurrency || ''),
    }

    let transaction
    try {
      transaction = await prisma.$transaction(async (tx) => {
        // Check if transaction already exists
        const existingTransaction = id ? await tx.transaction.findUnique({
          where: { id: toString(id) }
        }) : null

        let created
        if (existingTransaction) {
        // Update existing transaction
        created = await tx.transaction.update({
          where: { id: toString(id) },
          data: {
            isBuyOrSell: (toString(isBuyOrSell || 'SELL') === 'SELL'
              ? 'SELL'
              : 'BUY') as TransactionMethod,
            fiatAmount: finalFields.fiatAmount,
            fiatCurrency: finalFields.fiatCurrency,
            cryptoCurrency: finalFields.cryptoCurrency,
            walletLink: toString(walletLink) || '',
            walletAddress: toString(walletAddress),
            network: toString(network),
            status: mappedStatus,
            paymentOptionId: paymentOptionId ? toString(paymentOptionId) : null,
            fiatAmountInUsd:
              fiatAmountInUsd === undefined || fiatAmountInUsd === null
                ? null
                : toString(fiatAmountInUsd),
            statusHistories: statusHistories ?? null,
            amountPaid: finalFields.amountPaid,
            cryptoAmount: finalFields.cryptoAmount,
            totalFeeInFiat: finalFields.totalFeeInFiat,
            countryCode: countryCode ? toString(countryCode) : null,
            stateCode: stateCode ? toString(stateCode) : null,
            statusReason: statusReason ? toString(statusReason) : null,
            transakFeeAmount:
              transakFeeAmount === undefined || transakFeeAmount === null
                ? null
                : toFloat(transakFeeAmount),
          },
        })
      } else {
        // Create new transaction record
        created = await tx.transaction.create({
          data: {
            ...(id ? { id: toString(id) } : {}),
            userId: user_id,
            isBuyOrSell: (toString(isBuyOrSell || 'SELL') === 'SELL'
              ? 'SELL'
              : 'BUY') as TransactionMethod,
            fiatAmount: finalFields.fiatAmount,
            fiatCurrency: finalFields.fiatCurrency,
            cryptoCurrency: finalFields.cryptoCurrency,
            walletLink: toString(walletLink) || '',
            walletAddress: toString(walletAddress),
            network: toString(network),
            status: mappedStatus,
            paymentOptionId: paymentOptionId ? toString(paymentOptionId) : null,
            fiatAmountInUsd:
              fiatAmountInUsd === undefined || fiatAmountInUsd === null
                ? null
                : toString(fiatAmountInUsd),
            statusHistories: statusHistories ?? null,
            amountPaid: finalFields.amountPaid,
            cryptoAmount: finalFields.cryptoAmount,
            totalFeeInFiat: finalFields.totalFeeInFiat,
            countryCode: countryCode ? toString(countryCode) : null,
            stateCode: stateCode ? toString(stateCode) : null,
            statusReason: statusReason ? toString(statusReason) : null,
            transakFeeAmount:
              transakFeeAmount === undefined || transakFeeAmount === null
                ? null
                : toFloat(transakFeeAmount),
          },
        })
      }

      // If the transaction is completed, adjust the corresponding holding atomically
      if (mappedStatus === 'COMPLETED') {
        const finalCryptoAmount = (finalFields.cryptoAmount ?? 0) || 0
        const finalFiatAmount =
          (finalFields.amountPaid ?? finalFields.fiatAmount ?? 0) || 0
        const symbol = finalFields.cryptoCurrency || ''
        const currency = finalFields.fiatCurrency || 'USD'
        const isSell = String(isBuyOrSell || 'BUY') === 'SELL'

        console.log('[POST] Holding adjust check', {
          symbol,
          currency,
          finalCryptoAmount,
          finalFiatAmount,
          mappedStatus,
          isSell,
        })

        if (symbol && finalCryptoAmount > 0 && finalFiatAmount > 0) {
          const existingHolding = await tx.holding.findUnique({
            where: {
              userId_symbol_fiatCurrency: {
                userId: user_id,
                symbol,
                fiatCurrency: currency,
              },
            },
          })

          if (isSell) {
            // Subtract from holding using avgBuyPrice for invested adjustment
            if (!existingHolding) {
              // Nothing to subtract; skip
            } else {
              const sellQty = finalCryptoAmount
              const newQuantity = Math.max(0, existingHolding.quantity - sellQty)
              const reduceInvestedBy = existingHolding.avgBuyPrice * sellQty
              const newTotalInvested = Math.max(
                0,
                existingHolding.totalInvested - reduceInvestedBy
              )
              if (newQuantity === 0) {
                await tx.holding.delete({
                  where: {
                    userId_symbol_fiatCurrency: {
                      userId: user_id,
                      symbol,
                      fiatCurrency: currency,
                    },
                  },
                })
              } else {
                await tx.holding.update({
                  where: {
                    userId_symbol_fiatCurrency: {
                      userId: user_id,
                      symbol,
                      fiatCurrency: currency,
                    },
                  },
                  data: {
                    quantity: newQuantity,
                    totalInvested: newTotalInvested,
                    // Keep avgBuyPrice unchanged for remaining units
                  },
                })
              }
            }
          } else {
            // BUY: add to holding
            if (existingHolding) {
              const newQuantity = existingHolding.quantity + finalCryptoAmount
              const newTotalInvested =
                existingHolding.totalInvested + finalFiatAmount
              const newAvgPrice = newTotalInvested / newQuantity

              await tx.holding.update({
                where: {
                  userId_symbol_fiatCurrency: {
                    userId: user_id,
                    symbol,
                    fiatCurrency: currency,
                  },
                },
                data: {
                  quantity: newQuantity,
                  totalInvested: newTotalInvested,
                  avgBuyPrice: newAvgPrice,
                },
              })
              console.log('[POST] Holding updated', {
                symbol,
                currency,
                newQuantity,
                newTotalInvested,
              })
            } else {
              await tx.holding.create({
                data: {
                  userId: user_id,
                  symbol,
                  fiatCurrency: currency,
                  quantity: finalCryptoAmount,
                  totalInvested: finalFiatAmount,
                  avgBuyPrice: finalFiatAmount / finalCryptoAmount,
                },
              })
              console.log('[POST] Holding created', {
                symbol,
                currency,
                quantity: finalCryptoAmount,
                totalInvested: finalFiatAmount,
              })
            }
          }
        }
      }

        return created
      })
    } catch (dbError) {
      console.error('Database transaction error:', dbError)
      throw new Error(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}`)
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error saving transaction:', error)
    console.error('Transaction data:', {
      id: id || 'unknown',
      isBuyOrSell: isBuyOrSell || 'unknown',
      fiatAmount: fiatAmount || 0,
      fiatCurrency: fiatCurrency || 'unknown',
      cryptoCurrency: cryptoCurrency || 'unknown',
      status: status || 'unknown',
      userId: user_id
    })
    return NextResponse.json({ 
      error: 'Failed to save transaction', 
      details: error instanceof Error ? error.message : 'Unknown error',
      transactionId: id || 'unknown'
    }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getSession()
  const user_id = session?.user.id
  if (!user_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const {
      id,
      status,
      statusHistories,
      fiatAmount,
      fiatCurrency,
      cryptoCurrency,
      walletLink,
      walletAddress,
      network,
      paymentOptionId,
      fiatAmountInUsd,
      amountPaid,
      cryptoAmount,
      totalFeeInFiat,
    } = await req.json()

    const mappedStatus = mapTransakStatusToDbStatus(status)

    let finalFields = {
      fiatAmount,
      amountPaid,
      cryptoAmount,
      totalFeeInFiat,
      fiatCurrency,
      cryptoCurrency,
    }

    // If order is COMPLETED, pull authoritative data from Transak to avoid mismatches
    if (mappedStatus === 'COMPLETED') {
      try {
        const accessTokenConfig = await prisma.config.findFirst({
          where: { key: 'TRANSAK_ACCESS_TOKEN' },
        })
        const parsedToken = accessTokenConfig?.value
          ? JSON.parse(accessTokenConfig.value)
          : null
        if (parsedToken?.accessToken) {
          const res = await fetch(
            `https://api-stg.transak.com/partners/api/v2/order/${id}`,
            {
              method: 'GET',
              headers: {
                accept: 'application/json',
                'access-token': parsedToken.accessToken,
              },
            }
          )
          if (res.ok) {
            const body = await res.json()
            const d = body?.data || {}
            finalFields = {
              fiatAmount: d.fiatAmount ?? fiatAmount,
              amountPaid: d.amountPaid ?? amountPaid,
              cryptoAmount: d.cryptoAmount ?? cryptoAmount,
              totalFeeInFiat: d.totalFeeInFiat ?? totalFeeInFiat,
              fiatCurrency: d.fiatCurrency ?? fiatCurrency,
              cryptoCurrency: d.cryptoCurrency ?? cryptoCurrency,
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    const transaction = await prisma.$transaction(async (tx) => {
      const existingTransaction = await tx.transaction.findUnique({
        where: { id: id },
      })

      const wasPreviouslyCompleted =
        existingTransaction?.status === 'COMPLETED'

      let updatedOrCreated

      if (existingTransaction) {
        updatedOrCreated = await tx.transaction.update({
          where: {
            id: id,
          },
          data: {
            status: mappedStatus,
            statusHistories,
            fiatAmount: finalFields.fiatAmount,
            fiatCurrency: finalFields.fiatCurrency,
            cryptoCurrency: finalFields.cryptoCurrency,
            walletLink,
            walletAddress,
            network,
            paymentOptionId,
            fiatAmountInUsd,
            amountPaid: finalFields.amountPaid,
            cryptoAmount: finalFields.cryptoAmount,
            totalFeeInFiat: finalFields.totalFeeInFiat,
          },
        })
      } else {
        updatedOrCreated = await tx.transaction.create({
          data: {
            id: id,
            userId: user_id,
            status: mappedStatus,
            statusHistories,
            fiatAmount: finalFields.fiatAmount,
            fiatCurrency: finalFields.fiatCurrency,
            cryptoCurrency: finalFields.cryptoCurrency,
            walletLink,
            walletAddress,
            network,
            paymentOptionId,
            fiatAmountInUsd,
            amountPaid: finalFields.amountPaid,
            cryptoAmount: finalFields.cryptoAmount,
            totalFeeInFiat: finalFields.totalFeeInFiat,
          },
        })
      }

      // Adjust holdings when the transaction completes; handle BUY vs SELL
      if (mappedStatus === 'COMPLETED') {
        const finalCryptoAmount = (finalFields.cryptoAmount ?? 0) || 0
        const finalFiatAmount =
          (finalFields.amountPaid ?? finalFields.fiatAmount ?? 0) || 0
        const symbol = finalFields.cryptoCurrency || ''
        const currency = finalFields.fiatCurrency || 'USD'
        const isSell = existingTransaction?.isBuyOrSell === 'SELL'

        console.log('[PUT] Holding upsert check', {
          symbol,
          currency,
          finalCryptoAmount,
          finalFiatAmount,
          mappedStatus,
          wasPreviouslyCompleted,
        })

        if (symbol && finalCryptoAmount > 0 && finalFiatAmount > 0) {
          const existingHolding = await tx.holding.findUnique({
            where: {
              userId_symbol_fiatCurrency: {
                userId: user_id,
                symbol,
                fiatCurrency: currency,
              },
            },
          })

          if (isSell) {
            if (existingHolding && !wasPreviouslyCompleted) {
              const sellQty = finalCryptoAmount
              const newQuantity = Math.max(0, existingHolding.quantity - sellQty)
              const reduceInvestedBy = existingHolding.avgBuyPrice * sellQty
              const newTotalInvested = Math.max(
                0,
                existingHolding.totalInvested - reduceInvestedBy
              )
              if (newQuantity === 0) {
                await tx.holding.delete({
                  where: {
                    userId_symbol_fiatCurrency: {
                      userId: user_id,
                      symbol,
                      fiatCurrency: currency,
                    },
                  },
                })
              } else {
                await tx.holding.update({
                  where: {
                    userId_symbol_fiatCurrency: {
                      userId: user_id,
                      symbol,
                      fiatCurrency: currency,
                    },
                  },
                  data: {
                    quantity: newQuantity,
                    totalInvested: newTotalInvested,
                    // Keep avgBuyPrice unchanged for remaining units
                  },
                })
              }
            }
          } else {
            if (!wasPreviouslyCompleted) {
              if (existingHolding) {
                const newQuantity = existingHolding.quantity + finalCryptoAmount
                const newTotalInvested =
                  existingHolding.totalInvested + finalFiatAmount
                const newAvgPrice = newTotalInvested / newQuantity

                await tx.holding.update({
                  where: {
                    userId_symbol_fiatCurrency: {
                      userId: user_id,
                      symbol,
                      fiatCurrency: currency,
                    },
                  },
                  data: {
                    quantity: newQuantity,
                    totalInvested: newTotalInvested,
                    avgBuyPrice: newAvgPrice,
                  },
                })
                console.log('[PUT] Holding updated', { symbol, currency, newQuantity, newTotalInvested })
              } else {
                await tx.holding.create({
                  data: {
                    userId: user_id,
                    symbol,
                    fiatCurrency: currency,
                    quantity: finalCryptoAmount,
                    totalInvested: finalFiatAmount,
                    avgBuyPrice: finalFiatAmount / finalCryptoAmount,
                  },
                })
                console.log('[PUT] Holding created', { symbol, currency, quantity: finalCryptoAmount, totalInvested: finalFiatAmount })
              }
            }
          }
        }
      }

      return updatedOrCreated
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Transaction update error:', error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
