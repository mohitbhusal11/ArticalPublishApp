import React from 'react'
import { TextInput, StyleSheet, TextInputProps } from 'react-native'
import GlobalText from './GlobalText'
import { AppColor } from '../config/AppColor'

type Props = {
  label: string
} & TextInputProps

const FormInput = React.memo(
  ({ label, style, ...rest }: Props) => {
    return (
      <>
        <GlobalText style={styles.label}>{label}</GlobalText>
        <TextInput
          {...rest}
          style={[
            styles.input,
            !rest.editable && styles.disabledInput,
            style,
          ]}
        />
      </>
    )
  }
)

export default FormInput

const styles = StyleSheet.create({
  label: {
    color: AppColor.mainColor,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 16,
    marginHorizontal: 18,
  },
  input: {
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
  disabledInput: {
    backgroundColor: AppColor.color_E9E9E9,
  },
})
