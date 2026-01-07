import React, { useState } from 'react'
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native'
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'
import DateTimePicker from '@react-native-community/datetimepicker'

import { RootState } from '../../redux/store'
import GlobalSafeArea from '../../component/GlobalSafeArea'
import GlobalText from '../../component/GlobalText'
import { AppString } from '../../strings'
import { AppColor } from '../../config/AppColor'

const EditProfileScreen = () => {
  const user = useSelector((state: RootState) => state.userDetails.details)

  const [form, setForm] = useState({
    fatherName: '',
    dob: '',
    email: '',
    secondaryPhone: '',
    zipCode: '',
    permanentAddress: '',
    presentAddress: '',
    education: '',
    experience: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
  })

  const [showDatePicker, setShowDatePicker] = useState(false)

  const onChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  /* DOB LIMIT */
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() - 1)

  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 100)

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setForm(prev => ({
        ...prev,
        dob: selectedDate.toISOString().split('T')[0],
      }))
    }
  }

  const handleSave = () => {
    const body = {
      ...form,
    }
    console.log('SAVE BODY', body)
  }

  const RenderInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    editable = true,
  }: any) => (
    <>
      <GlobalText style={styles.fieldTitle}>{label}</GlobalText>
      <TextInput
        style={[
          styles.fieldInput,
          !editable && { backgroundColor: AppColor.color_E9E9E9 },
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
      />
    </>
  )

  return (
    <GlobalSafeArea style={styles.mainContainer}>
      <ScrollView style={styles.scrollerView}>

        {/* ===== OLD PROFILE CARD (UNCHANGED) ===== */}
        <View style={styles.editProfileContainer}>
          <GlobalText style={styles.editProfileText}>
            {AppString.common.editProfile}
          </GlobalText>

          <View style={styles.imageContainer}>
            <FastImage
              style={styles.profileIcon}
              source={{ uri: user?.imgUrl }}
            />
          </View>

          <View style={styles.divider} />

          <GlobalText style={styles.nameTitle}>
            {AppString.common.name}
          </GlobalText>
          <GlobalText style={styles.userName}>
            {user?.userName}
          </GlobalText>

          <GlobalText style={styles.mobileNumberTitile}>
            {AppString.common.mobileNumber}
          </GlobalText>
          <GlobalText style={styles.mobileNumber}>
            +91 {user?.mobileNo}
          </GlobalText>
        </View>

        {/* ===== NEW EDITABLE SECTION (MATCHING STYLE) ===== */}
        <View style={styles.editProfileContainer}>

          <RenderInput
            label="Father Name"
            placeholder="Enter father name"
            value={form.fatherName}
            onChangeText={(v: string) => onChange('fatherName', v)}
          />

          <GlobalText style={styles.fieldTitle}>Date of Birth</GlobalText>
          <TouchableOpacity
            style={styles.fieldInput}
            onPress={() => setShowDatePicker(true)}>
            <GlobalText>
              {form.dob || 'Select date of birth'}
            </GlobalText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={maxDate}
              mode="date"
              maximumDate={maxDate}
              minimumDate={minDate}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}

          <RenderInput
            label="Email ID"
            placeholder="Enter email"
            value={form.email}
            onChangeText={(v: string) => onChange('email', v)}
          />

          <RenderInput
            label="Secondary Mobile No"
            placeholder="Enter mobile number"
            keyboardType="number-pad"
            value={form.secondaryPhone}
            onChangeText={(v: string) => onChange('secondaryPhone', v)}
          />

          <RenderInput
            label="Zip Code"
            keyboardType="number-pad"
            value={form.zipCode}
            onChangeText={(v: string) => onChange('zipCode', v)}
          />

          <RenderInput
            label="Permanent Address"
            value={form.permanentAddress}
            onChangeText={(v: string) => onChange('permanentAddress', v)}
          />

          <RenderInput
            label="Present Address"
            value={form.presentAddress}
            onChangeText={(v: string) => onChange('presentAddress', v)}
          />

          <RenderInput
            label="Education"
            value={form.education}
            onChangeText={(v: string) => onChange('education', v)}
          />

          <RenderInput
            label="Experience"
            value={form.experience}
            onChangeText={(v: string) => onChange('experience', v)}
          />

          <RenderInput
            label="Account Number"
            keyboardType="number-pad"
            value={form.accountNumber}
            onChangeText={(v: string) => onChange('accountNumber', v)}
          />

          <RenderInput
            label="Bank Name"
            value={form.bankName}
            onChangeText={(v: string) => onChange('bankName', v)}
          />

          <RenderInput
            label="Branch Name"
            value={form.branchName}
            onChangeText={(v: string) => onChange('branchName', v)}
          />

          <RenderInput
            label="IFSC Code"
            value={form.ifscCode}
            onChangeText={(v: string) => onChange('ifscCode', v)}
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <GlobalText style={styles.buttonText}>Save</GlobalText>
          </TouchableOpacity>

        </View>
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
