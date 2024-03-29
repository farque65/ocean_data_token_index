import Conversion from '../../../../atoms/Price/Conversion'
import { useField } from 'formik'
import React, { ReactElement, useState, useEffect } from 'react'
import Input from '../../../../atoms/Input'
import styles from './Price.module.css'
import Error from './Error'
import { DDO } from '@oceanprotocol/lib'
import PriceUnit from '../../../../atoms/Price/PriceUnit'
import usePricing from '../../../../../hooks/usePricing'

export default function Price({
  ddo,
  firstPrice
}: {
  ddo: DDO
  firstPrice?: string
}): ReactElement {
  const [field, meta] = useField('price')
  const { getDTName, getDTSymbol } = usePricing()
  const [dtSymbol, setDtSymbol] = useState<string>()
  const [dtName, setDtName] = useState<string>()

  useEffect(() => {
    if (!ddo) return
    async function setDatatokenSymbol(ddo: DDO) {
      const dtSymbol = await getDTSymbol(ddo)
      setDtSymbol(dtSymbol)
    }
    async function setDatatokenName(ddo: DDO) {
      const dtName = await getDTName(ddo)
      setDtName(dtName)
    }
    setDatatokenSymbol(ddo)
    setDatatokenName(ddo)
  }, [])

  return (
    <div className={styles.price}>
      <div className={styles.grid}>
        <div className={styles.form}>
          <Input
            value={field.value}
            name="price"
            type="number"
            prefix="OCEAN"
            min="1"
            {...field}
            additionalComponent={
              <Conversion price={field.value} className={styles.conversion} />
            }
          />
          <Error meta={meta} />
        </div>
        <div className={styles.datatoken}>
          <h4>
            = <strong>1</strong> {dtName} — {dtSymbol}
          </h4>
        </div>
      </div>
      {firstPrice && (
        <aside className={styles.firstPrice}>
          Expected first price:{' '}
          <PriceUnit
            price={Number(firstPrice) > 0 ? firstPrice : '-'}
            small
            conversion
          />
        </aside>
      )}
    </div>
  )
}
