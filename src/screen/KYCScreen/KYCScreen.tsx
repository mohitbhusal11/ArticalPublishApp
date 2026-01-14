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

import { getReporterDetails, KycDocument, putReporterDetails, ReporterResponse, UpdateKycDocument, UpdateReporterRequest } from '../../services/calls/userService'
import { localServerImageUpload } from '../../services/calls/imageUpload'


type KycFormItem = {
  documentTypeId: number
  originalDoc: KycDocument
  documentName: string
  number: string
  image: string | null
  error: string
}


const KYCScreen = ({ navigation }) => {
  const [reporter, setReporter] = useState<ReporterResponse | null>(null)
  const [kycForm, setKycForm] = useState<Record<number, KycFormItem>>({})
  const [loading, setLoading] = useState(false)

  /* ================= FETCH & MERGE ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const reporterRes = await getReporterDetails()
        setReporter(reporterRes)

        const mergedForm: Record<number, KycFormItem> = {}

        reporterRes.kycDocuments.forEach((doc, index) => {
          mergedForm[index] = {
            documentTypeId: index,
            originalDoc: doc,
            documentName: doc.documentName,
            number: doc.documentNumber,
            image: doc.documentUrl,
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

      setLoading(true)

      // 🔼 upload immediately
      const uploadedUrl = await uploadImageAndGetUrl(image)

      // ✅ save PUBLIC URL, not local path
      setKycForm(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          image: uploadedUrl,
          error: '',
        },
      }))
    } catch (e) {
      console.log('Image upload error', e)
      Alert.alert('Upload failed', 'Please try again')
    } finally {
      setLoading(false)
    }
  }



  const uploadImageAndGetUrl = async (image: any): Promise<string> => {
    const formData = new FormData()

    formData.append('image', {
      uri: image.path,
      type: image.mime || 'image/jpeg',
      name: image.filename || 'upload.jpg',
    } as any)

    const response = await localServerImageUpload(formData)

    // ✅ adjust based on your API response
    // example: { data: { url: "https://cdn.xxx/image.jpg" } }
    return response.file.url
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
      ...item.originalDoc,
      documentName: item.documentName.trim(),
      documentNumber: item.number.trim(),
      documentUrl: item.image!,
    }))



    try {
      setLoading(true)

      const body: UpdateReporterRequest = {
        kycDocuments
      }

      const updatedReporter = await putReporterDetails(body)
      setReporter(updatedReporter)
      navigation.goBack()
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

        {Object.values(kycForm).map(item => (
          <View key={item.documentTypeId} style={styles.card}>
            <Text style={styles.docTitle}>{item.documentName}</Text>

            <TextInput
              style={[styles.input, item.error && { borderColor: 'red' }]}
              placeholder={`${item.documentName} Number`}
              value={item.number}
              onChangeText={v =>
                setKycForm(prev => ({
                  ...prev,
                  [item.documentTypeId]: {
                    ...prev[item.documentTypeId],
                    number: v,
                    error: '',
                  },
                }))
              }
            />

            <TouchableOpacity
              style={styles.imageBox}
              onPress={() => pickImage(item.documentTypeId)}
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
        ))}


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
