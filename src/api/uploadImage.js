import axios from 'axios'

const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'book_covers')

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/goalsLibrary/image/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data.secure_url
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

export default uploadImage
