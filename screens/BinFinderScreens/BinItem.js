import { View, Text } from 'react-native'
import React from 'react'

export default function BinItem(data) {
  return (
    <View>
      <Text>{data.title}</Text>
    </View>
  )
}