import React, { useEffect, useState } from 'react'
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

import { getReporterDetails, getRequiredKycTypes, KycDocument, KycTypeItem, putReporterDetails, ReporterResponse, UpdateReporterRequest } from '../../services/calls/userService'


type KycFormItem = {
  documentTypeId: number
  documentName: string
  number: string
  image: string | null
  error: string
}

const KYCScreen = () => {
  const [reporter, setReporter] = useState<ReporterResponse | null>(null)
  const [kycTypes, setKycTypes] = useState<KycTypeItem[]>([])
  const [kycForm, setKycForm] = useState<Record<number, KycFormItem>>({})
  const [loading, setLoading] = useState(false)

  /* ================= FETCH & MERGE ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const [kycTypeRes, reporterRes] = await Promise.all([
          getRequiredKycTypes(),
          getReporterDetails(),
        ])

        setReporter(reporterRes)
        setKycTypes(kycTypeRes.data)

        const mergedForm: Record<number, KycFormItem> = {}

        kycTypeRes.data.forEach(type => {
          const existing = reporterRes.kycDocuments.find(
            d => d.DocumentName === type.value
          )

          mergedForm[type.id] = {
            documentTypeId: type.id,
            documentName: type.value,
            number: existing?.DocumentNumber || '',
            image: existing?.DocumentUrl || null,
            error: '',
          }
        })

        setKycForm(mergedForm)
      } catch (e) {
        console.log('KYC init error', e)
      }
    }

    init()
  }, [])

  /* ================= IMAGE PICKER ================= */
  const pickImage = async (id: number) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 600,
        height: 400,
        cropping: true,
        compressImageQuality: 0.8,
      })

      setKycForm(prev => ({
        ...prev,
        [id]: { ...prev[id], image: image.path, error: '' },
      }))
    } catch {}
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    let valid = true
    const updated = { ...kycForm }

    Object.values(updated).forEach(item => {
      if (!item.number) {
        item.error = 'Enter document number'
        valid = false
      } else if (!item.image) {
        item.error = 'Upload document image'
        valid = false
      }
    })

    setKycForm(updated)
    if (!valid || !reporter) return

    const kycDocuments: KycDocument[] = Object.values(kycForm).map(item => ({
      DocumentName: item.documentName,
      DocumentNumber: item.number,
      DocumentUrl: item.image!,
    }))

    try {
      setLoading(true)

      const body: UpdateReporterRequest = {
        kycDocuments,
      }

      const updatedReporter = await putReporterDetails(body)
      setReporter(updatedReporter)

      Alert.alert('Success', 'KYC submitted successfully')
    } catch (e) {
      console.log('KYC submit error', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlobalSafeArea style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Complete Your KYC</Text>

        {kycTypes.map(type => {
          const item = kycForm[type.id]
          if (!item) return null

          return (
            <View key={type.id} style={styles.card}>
              <Text style={styles.docTitle}>{type.value}</Text>

              <TextInput
                style={[styles.input, item.error && { borderColor: 'red' }]}
                placeholder={`${type.value} Number`}
                value={item.number}
                onChangeText={v =>
                  setKycForm(prev => ({
                    ...prev,
                    [type.id]: { ...prev[type.id], number: v, error: '' },
                  }))
                }
              />

              <TouchableOpacity
                style={styles.imageBox}
                onPress={() => pickImage(type.id)}
              >
                {item.image ? (
                  <>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.replaceOverlay}>
                      <Text style={styles.replaceText}>Change</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.uploadText}>Upload Image</Text>
                )}
              </TouchableOpacity>

              {!!item.error && (
                <Text style={styles.errorText}>{item.error}</Text>
              )}
            </View>
          )
        })}

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={handleSubmit}
        >
          <Text style={styles.saveText}>Submit KYC</Text>
        </TouchableOpacity>
      </ScrollView>
    </GlobalSafeArea>
  )
}

export default KYCScreen
