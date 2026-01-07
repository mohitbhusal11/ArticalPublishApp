import React, { useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'

import GlobalSafeArea from '../../component/GlobalSafeArea'
import { styles } from './style'

/* 🔹 Dummy backend response */
const kycConfigFromBackend = [
  {
    id: 'aadhaar',
    title: 'Aadhaar Card',
    numberLabel: 'Aadhaar Number',
    numberLength: 12,
    keyboardType: 'number-pad',
  },
  {
    id: 'pan',
    title: 'PAN Card',
    numberLabel: 'PAN Number',
    numberLength: 10,
    keyboardType: 'default',
  },
]

const KYCScreen = () => {
  const [kycData, setKycData] = useState<any>(
    kycConfigFromBackend.reduce((acc, doc) => {
      acc[doc.id] = { number: '', image: null, error: '' }
      return acc
    }, {})
  )

  /* 🔹 Select / Replace Image */
  const pickImage = async (docId: string) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 600,
        height: 400,
        cropping: true,
        compressImageQuality: 0.8,
      })

      setKycData((prev: any) => ({
        ...prev,
        [docId]: {
          ...prev[docId],
          image: image.path,
          error: '',
        },
      }))
    } catch (err) {
      // User cancelled – ignore
    }
  }

  const handleNumberChange = (
    docId: string,
    value: string,
    maxLength: number
  ) => {
    if (value.length > maxLength) return

    setKycData((prev: any) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        number: value,
        error: '',
      },
    }))
  }

  const validateAndSubmit = () => {
    let valid = true
    const updated = { ...kycData }

    kycConfigFromBackend.forEach(doc => {
      const data = updated[doc.id]

      if (data.number.length !== doc.numberLength) {
        data.error = `Invalid ${doc.title} number`
        valid = false
      } else if (!data.image) {
        data.error = `Upload ${doc.title} image`
        valid = false
      }
    })

    setKycData(updated)
    if (!valid) return

    const apiBody = kycConfigFromBackend.map(doc => ({
      documentType: doc.id,
      documentNumber: kycData[doc.id].number,
      documentImage: kycData[doc.id].image,
    }))

    console.log('KYC BODY', apiBody)
    Alert.alert('Success', 'KYC submitted successfully')
  }

  return (
    <GlobalSafeArea style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Complete Your KYC</Text>

        {kycConfigFromBackend.map(doc => {
          const data = kycData[doc.id]

          return (
            <View key={doc.id} style={styles.card}>
              <Text style={styles.docTitle}>{doc.title}</Text>

              <TextInput
                style={[
                  styles.input,
                  data.error && { borderColor: 'red' },
                ]}
                placeholder={doc.numberLabel}
                keyboardType={doc.keyboardType as any}
                value={data.number}
                onChangeText={v =>
                  handleNumberChange(doc.id, v, doc.numberLength)
                }
              />

              {/* IMAGE PICKER */}
              <TouchableOpacity
                style={styles.imageBox}
                onPress={() => pickImage(doc.id)}>

                {data.image ? (
                  <>
                    <Image
                      source={{ uri: data.image }}
                      style={styles.image}
                    />
                    <View style={styles.replaceOverlay}>
                      <Text style={styles.replaceText}>Change</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.uploadText}>Upload Image</Text>
                )}
              </TouchableOpacity>

              {!!data.error && (
                <Text style={styles.errorText}>{data.error}</Text>
              )}
            </View>
          )
        })}

        <TouchableOpacity style={styles.saveButton} onPress={validateAndSubmit}>
          <Text style={styles.saveText}>Submit KYC</Text>
        </TouchableOpacity>
      </ScrollView>
    </GlobalSafeArea>
  )
}

export default KYCScreen
