import { StyleSheet } from 'react-native'
import { AppColor } from '../../config/AppColor'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
  },
  replaceOverlay: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)',
  paddingVertical: 6,
  alignItems: 'center',
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
},

replaceText: {
  color: '#FFF',
  fontSize: 12,
  fontWeight: '600',
},

  docTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: AppColor.mainColor,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  imageBox: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  uploadText: {
    color: '#999',
  },
  errorText: {
    color: 'red',
    marginTop: 6,
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: AppColor.mainColor,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  saveText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
})
