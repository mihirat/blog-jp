import React, { useEffect } from "react"

const client = process.env.GATSBY_GOOGLE_ADSENSE_ID
const slot = process.env.GATSBY_GOOGLE_ADSENSE_SLOT_ID

const style = {
  display: 'block', 
  textAlign: 'center'
}

const Ad = props => {
  const { currentPath } = props

  useEffect(() => {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
  }, [currentPath])

  return (
      <ins 
      className="adsbygoogle"
      style={style}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client={client}
      data-ad-slot={slot} />
  )
}
export default Ad
