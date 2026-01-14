import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import DateTimePicker from '@react-native-community/datetimepicker'

import GlobalSafeArea from '../../component/GlobalSafeArea'
import GlobalText from '../../component/GlobalText'
import FormInput from '../../component/FormInput'

import { AppString } from '../../strings'
import { AppColor } from '../../config/AppColor'
import {
  fetchBankByIfsc,
  getReporterDetails,
  putReporterDetails,
  ReporterResponse,
  UpdateReporterRequest,
} from '../../services/calls/userService'
import { AppImage } from '../../config/AppImage'

const EditProfileScreen = ({ navigation }: any) => {
  const [reporter, setReporter] = useState<ReporterResponse | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ifscLoading, setIfscLoading] = useState(false)

  const ifscTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [form, setForm] = useState({
    fatherName: '',
    dob: '',
    email: '',
    secondaryPhone: '',  // ✅ secondaryMobile
    zipCode: '',         // ✅ zipcode
    permanentAddress: '', // ✅ permanentAddress
    presentAddress: '',   // ✅ presentAddress
    education: '',        // ✅ education

    spouseName: '',
    husbandName: '',
    firstChildName: '',
    secondChildName: '',
    thirdChildName: '',

    jobLocation: '',
    experience: '',
    designation: '',
    currentCompany: '',

    accountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    phonePeNo: '',
  })




  /* =========================
     FORM CHANGE HANDLER
  ========================= */
  const onChange = useCallback(
    (key: keyof typeof form, value: string) => {
      setForm(prev => ({ ...prev, [key]: value }))
    },
    []
  )

  /* =========================
     IFSC HANDLER (DEBOUNCED)
  ========================= */
  const handleIfscChange = (value: string) => {
    const ifsc = value.toUpperCase()
    onChange('ifscCode', ifsc)

    if (ifscTimeoutRef.current) {
      clearTimeout(ifscTimeoutRef.current)
    }

    if (ifsc.length < 5) {
      onChange('bankName', '')
      onChange('branchName', '')
      return
    }

    ifscTimeoutRef.current = setTimeout(async () => {
      try {
        setIfscLoading(true)
        const bank = await fetchBankByIfsc(ifsc)

        onChange('bankName', bank.BANK)
        onChange('branchName', bank.BRANCH)
      } catch {
        onChange('bankName', '')
        onChange('branchName', '')
      } finally {
        setIfscLoading(false)
      }
    }, 600)
  }

  /* =========================
     FETCH REPORTER DATA
  ========================= */
  useEffect(() => {
    const init = async () => {
      try {
        const data = await getReporterDetails()
        setReporter(data)

        setForm({
          fatherName: data?.fatherName ?? '',
          dob: data?.dob ?? '',
          email: data?.email ?? '',
          secondaryPhone: data?.secondaryMobile ?? '',
          zipCode: data?.zipcode?.toString() ?? '',
          permanentAddress: data?.permanentAddress ?? '',
          presentAddress: data?.presentAddress ?? '',
          education: data?.education ?? '',

          spouseName: data?.spouseName ?? '',
          husbandName: data?.husbandName ?? '',
          firstChildName: data?.firstChildName ?? '',
          secondChildName: data?.secondChildName ?? '',
          thirdChildName: data?.thirdChildName ?? '',

          jobLocation: data?.jobLocation ?? '',
          experience: data?.experience ?? '',
          designation: data?.designation ?? '',
          currentCompany: data?.currentCompany ?? '',

          accountNumber: data?.bankDetails.accountNumber ?? '',
          bankName: data?.bankDetails.bankName ?? '',
          branchName: data?.bankDetails.branchName ?? '',
          ifscCode: data?.bankDetails.ifscCode ?? '',
          phonePeNo: data?.bankDetails.phonePeNo ?? '',
        })

      } catch (e) {
        console.log('init error', e)
      }
    }

    init()

    return () => {
      if (ifscTimeoutRef.current) {
        clearTimeout(ifscTimeoutRef.current)
      }
    }
  }, [])

  /* =========================
     DATE PICKER
  ========================= */
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() - 1)

  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 100)

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      onChange('dob', selectedDate.toISOString().split('T')[0])
    }
  }

  /* =========================
     SAVE PROFILE
  ========================= */
  const handleSave = async () => {
    if (!reporter || loading) return

    try {
      setLoading(true)

      const body: UpdateReporterRequest = {
        fatherName: form.fatherName || null,
        zipcode: form.zipCode ? Number(form.zipCode) : null,
        dob: form.dob || null,
        imageUrl: reporter.imageUrl || null,
        secondaryMobile: form.secondaryPhone || null,
        email: form.email || null,
        presentAddress: form.presentAddress || null,
        permanentAddress: form.permanentAddress || null,
        education: form.education || null,
        spouseName: form.spouseName || null,
        husbandName: form.husbandName || null,
        firstChildName: form.firstChildName || null,
        secondChildName: form.secondChildName || null,
        thirdChildName: form.thirdChildName || null,

        jobLocation: form.jobLocation || null,
        experience: form.experience || null,
        designation: form.designation || null,
        currentCompany: form.currentCompany || null,

        accountNumber: form.accountNumber || null,
        bankName: form.bankName || null,
        branchName: form.branchName || null,
        ifscCode: form.ifscCode || null,
        phonePeNo: form.phonePeNo || null,
        // 🔴 REQUIRED – pass as-is
        kycDocuments: reporter.kycDocuments,
      }
      console.log('PUT Reporter Request:', JSON.stringify(body, null, 2))

      await putReporterDetails(body)
      navigation.goBack()
    } catch (e) {
      console.log('Save error', e)
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     UI
  ========================= */
  return (
    <GlobalSafeArea style={styles.mainContainer}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* PROFILE CARD */}
        <View style={styles.editProfileContainer}>
          <GlobalText style={styles.editProfileText}>
            {AppString.common.profile}
          </GlobalText>

          <View style={styles.imageContainer}>
            <FastImage
              style={styles.profileIcon}
              source={
                reporter?.imageUrl
                  ? { uri: reporter.imageUrl }
                  : AppImage.profile_placeholder_ic
              }
            />
          </View>

          <View style={styles.divider} />

          <GlobalText style={styles.nameTitle}>
            {AppString.common.name}
          </GlobalText>
          <GlobalText style={styles.userName}>
            {reporter?.fullName}
          </GlobalText>

          <GlobalText style={styles.mobileNumberTitile}>
            {AppString.common.mobileNumber}
          </GlobalText>
          <GlobalText style={styles.mobileNumber}>
            +91 {reporter?.primaryMobile}
          </GlobalText>
        </View>

        <View style={styles.editProfileContainer}>
          <GlobalText style={styles.editProfileText}>
            {AppString.common.editProfile}
          </GlobalText>

          <FormInput label="Father Name" value={form.fatherName}
            onChangeText={v => onChange('fatherName', v)} />

          <GlobalText style={styles.fieldTitle}>Date of Birth</GlobalText>
          <TouchableOpacity
            style={styles.fieldInput}
            onPress={() => setShowDatePicker(true)}>
            <GlobalText>{form.dob || 'Select date of birth'}</GlobalText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form.dob ? new Date(form.dob) : maxDate}
              mode="date"
              maximumDate={maxDate}
              minimumDate={minDate}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}

          <FormInput label="Email" value={form.email}
            onChangeText={v => onChange('email', v)} />

          <FormInput
            label="Secondary Mobile"
            keyboardType="phone-pad"
            value={form.secondaryPhone}
            onChangeText={v => onChange('secondaryPhone', v)}
          />

          <FormInput
            label="Zip Code"
            keyboardType="number-pad"
            value={form.zipCode}
            onChangeText={v => onChange('zipCode', v)}
          />

          <FormInput
            label="Present Address"
            value={form.presentAddress}
            onChangeText={v => onChange('presentAddress', v)}
          />

          <FormInput
            label="Permanent Address"
            value={form.permanentAddress}
            onChangeText={v => onChange('permanentAddress', v)}
          />

          <FormInput
            label="Education"
            value={form.education}
            onChangeText={v => onChange('education', v)}
          />


          <FormInput label="Spouse Name" value={form.spouseName}
            onChangeText={v => onChange('spouseName', v)} />

          <FormInput label="Husband Name" value={form.husbandName}
            onChangeText={v => onChange('husbandName', v)} />

          <FormInput label="First Child Name" value={form.firstChildName}
            onChangeText={v => onChange('firstChildName', v)} />

          <FormInput label="Second Child Name" value={form.secondChildName}
            onChangeText={v => onChange('secondChildName', v)} />

          <FormInput label="Third Child Name" value={form.thirdChildName}
            onChangeText={v => onChange('thirdChildName', v)} />

        </View>

        <View style={styles.editProfileContainer}>
          <GlobalText style={styles.editProfileText}>
            Job Details
          </GlobalText>

          <FormInput label="Current Company" value={form.currentCompany}
            onChangeText={v => onChange('currentCompany', v)} />

          <FormInput label="Designation" value={form.designation}
            onChangeText={v => onChange('designation', v)} />

          <FormInput label="Experience" value={form.experience}
            onChangeText={v => onChange('experience', v)} />

          <FormInput label="Job Location" value={form.jobLocation}
            onChangeText={v => onChange('jobLocation', v)} />
        </View>

        <View style={styles.editProfileContainer}>
          <GlobalText style={styles.editProfileText}>
            {AppString.common.bankDetails}
          </GlobalText>
          <FormInput label="Account Number"
            keyboardType="number-pad"
            value={form.accountNumber}
            onChangeText={v => onChange('accountNumber', v)} />

          <FormInput
            label="IFSC Code"
            value={form.ifscCode}
            autoCapitalize="characters"
            onChangeText={handleIfscChange}
          />

          <FormInput label="Bank Name" value={form.bankName} editable={false} />
          <FormInput label="Branch Name" value={form.branchName} editable={false} />

          <FormInput
            label="PhonePe Number"
            keyboardType="phone-pad"
            value={form.phonePeNo}
            onChangeText={v => onChange('phonePeNo', v)}
          />


        </View>


        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={handleSave}>
          <GlobalText style={styles.buttonText}>Save</GlobalText>
        </TouchableOpacity>

        {ifscLoading && (
          <GlobalText style={{ marginTop: 8 }}>
            Fetching bank details...
          </GlobalText>
        )}
      </ScrollView>
    </GlobalSafeArea>
  )
}

export default EditProfileScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  saveButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  saveText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
  },




  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column'
  },

  scrollerView: {
    flexGrow: 1,
    backgroundColor: AppColor.color_F5F5F5
  },

  editProfileContainer: {
    backgroundColor: AppColor.color_ffffff,
    paddingBottom: 15,
    elevation: 5,
    marginVertical: 20,
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: 'hidden'
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 150,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: AppColor.mainColor
  },

  editProfileText: {
    backgroundColor: AppColor.mainColor,
    color: AppColor.color_ffffff,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    fontSize: 12,
    fontWeight: 600
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12
  },

  imgStyle: {
    width: 74,
    height: 74,
    borderRadius: 150,
    resizeMode: 'cover',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 150
  },

  imgRadius: {
    borderRadius: 150,
  },

  editIcon: {
    width: 30,
    height: 30,
    tintColor: AppColor.color_ffffff,
    alignSelf: 'center'
  },

  centerIcon: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  divider: {
    height: 1,
    backgroundColor: AppColor.color_E5E5E5,
    // marginVertical: 15
  },

  nameTitle: {
    color: AppColor.mainColor,
    fontSize: 12,
    fontWeight: 600,
    marginTop: 18,
    marginHorizontal: 18,
    textAlign: 'left'
  },
  fieldTitle: {
    color: AppColor.mainColor,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 16,
    marginHorizontal: 18,
  },

  fieldInput: {
    color: AppColor.color_767676,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppColor.color_BADEFF,
    marginTop: 8,
    marginHorizontal: 18,
    backgroundColor: AppColor.color_ffffff,
  },

  mobileNumberTitile: {
    color: AppColor.mainColor,
    fontSize: 12,
    fontWeight: 600,
    marginTop: 18,
    marginHorizontal: 18,
    textAlign: 'left'
  },

  userName: {
    color: AppColor.color_767676,
    fontSize: 14,
    fontWeight: 600,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppColor.color_BADEFF,
    marginTop: 8,
    marginHorizontal: 18,
    backgroundColor: AppColor.color_E9E9E9
  },

  mobileNumber: {
    color: AppColor.color_767676,
    fontSize: 14,
    fontWeight: 600,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppColor.color_BADEFF,
    marginTop: 8,
    marginHorizontal: 18,
    backgroundColor: AppColor.color_E9E9E9
  },

  button: {
    backgroundColor: AppColor.mainColor, // ✅ REQUIRED
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginHorizontal: 18,
    paddingVertical: 14, // ✅ Gives height
  },

  buttonText: {
    color: AppColor.color_ffffff,
    fontSize: 16,
    fontWeight: "600",
  },
})
