'use client'
import { useEffect } from 'react'

export default function AssetPreloaderSimple() {
  useEffect(() => {
    console.log('Simple asset preloader loaded')
  }, [])

  return null
}
